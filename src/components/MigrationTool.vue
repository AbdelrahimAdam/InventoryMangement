<template>
  <div class="migration-tool">
    <div class="header">
      <h1>🧳 ترقية قاعدة البيانات</h1>
      <p>إضافة حقل التاريخ للعناصر</p>
    </div>
    
    <div class="warning" v-if="!user">
      <p>⚠️ يجب تسجيل الدخول أولاً</p>
      <button @click="$router.push('/login')">تسجيل الدخول</button>
    </div>
    
    <div v-else class="migration-content">
      <div class="stats">
        <div class="stat-card">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">إجمالي العناصر</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.withCreatedAt }}</div>
          <div class="stat-label">تم تحديثها</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.withoutCreatedAt }}</div>
          <div class="stat-label">تحتاج تحديث</div>
        </div>
      </div>
      
      <div class="progress">
        <div class="progress-bar" :style="{ width: stats.percentage + '%' }"></div>
        <div class="progress-text">{{ stats.percentage }}% مكتمل</div>
      </div>
      
      <div class="controls">
        <button 
          @click="migrateItems(10)" 
          :disabled="isMigrating || stats.withoutCreatedAt === 0"
          class="btn-primary"
        >
          تحديث 10 عناصر
        </button>
        
        <button 
          @click="migrateItems(25)" 
          :disabled="isMigrating || stats.withoutCreatedAt === 0"
          class="btn-primary"
        >
          تحديث 25 عنصر
        </button>
        
        <button 
          @click="migrateItems(50)" 
          :disabled="isMigrating || stats.withoutCreatedAt === 0"
          class="btn-primary"
        >
          تحديث 50 عنصر
        </button>
        
        <button 
          @click="checkAllItems" 
          :disabled="isMigrating"
          class="btn-secondary"
        >
          فحص العناصر
        </button>
      </div>
      
      <div v-if="isMigrating" class="loading">
        <div class="spinner"></div>
        <p>جاري التحديث... {{ currentProgress }}/{{ batchSize }}</p>
      </div>
      
      <div class="log">
        <h3>سجل العمليات</h3>
        <div class="log-content">
          <div v-for="(log, index) in logs" :key="index" :class="['log-entry', log.type]">
            [{{ log.time }}] {{ log.message }}
          </div>
        </div>
      </div>
      
      <div class="instructions">
        <h3>التعليمات:</h3>
        <ol>
          <li>اضغط "فحص العناصر" أولاً لمعرفة عدد العناصر التي تحتاج تحديث</li>
          <li>اختر عدد العناصر المراد تحديثها (10، 25، أو 50)</li>
          <li>كرر العملية حتى تصبح نسبة الإكمال 100%</li>
          <li>بعد الانتهاء، قم بحذف هذه الصفحة ونشر التطبيق</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase/config'
import { collection, getDocs, updateDoc, serverTimestamp, limit } from 'firebase/firestore'

export default {
  name: 'MigrationTool',
  
  data() {
    return {
      isMigrating: false,
      currentProgress: 0,
      batchSize: 0,
      logs: [],
      stats: {
        total: 0,
        withCreatedAt: 0,
        withoutCreatedAt: 0,
        percentage: 0
      }
    }
  },
  
  computed: {
    user() {
      return this.$store.state.user
    }
  },
  
  mounted() {
    this.addLog('📱 تم تحميل أداة الترقية', 'info')
    this.checkAllItems()
  },
  
  methods: {
    addLog(message, type = 'info') {
      const time = new Date().toLocaleTimeString('ar-SA')
      this.logs.unshift({ time, message, type })
      
      // Keep only last 50 logs
      if (this.logs.length > 50) {
        this.logs.pop()
      }
    },
    
    async checkAllItems() {
      try {
        this.addLog('🔍 جاري فحص العناصر...', 'info')
        
        const itemsRef = collection(db, 'items')
        const snapshot = await getDocs(itemsRef)
        
        let withCreatedAt = 0
        let withoutCreatedAt = 0
        
        snapshot.docs.forEach(doc => {
          const data = doc.data()
          if (data.createdAt) {
            withCreatedAt++
          } else {
            withoutCreatedAt++
          }
        })
        
        const total = snapshot.size
        const percentage = total > 0 ? Math.round((withCreatedAt / total) * 100) : 0
        
        this.stats = {
          total,
          withCreatedAt,
          withoutCreatedAt,
          percentage
        }
        
        this.addLog(`✅ تم فحص ${total} عنصر`, 'success')
        this.addLog(`📊 ${withCreatedAt} تم تحديثها | ${withoutCreatedAt} تحتاج تحديث`, 'info')
        
      } catch (error) {
        this.addLog(`❌ خطأ في الفحص: ${error.message}`, 'error')
      }
    },
    
    async migrateItems(count) {
      if (this.isMigrating) return
      
      this.isMigrating = true
      this.currentProgress = 0
      this.batchSize = count
      
      try {
        this.addLog(`🚀 بدء تحديث ${count} عنصر...`, 'info')
        
        const itemsRef = collection(db, 'items')
        const snapshot = await getDocs(itemsRef)
        
        let updatedCount = 0
        let processedCount = 0
        
        // Process items one by one
        for (const doc of snapshot.docs) {
          if (processedCount >= count) break
          
          const data = doc.data()
          if (!data.createdAt) {
            try {
              await updateDoc(doc.ref, {
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
              })
              
              updatedCount++
              this.currentProgress = updatedCount
              this.addLog(`✅ تم تحديث: ${data.name || doc.id}`, 'success')
              
              // Update stats
              this.stats.withCreatedAt++
              this.stats.withoutCreatedAt--
              this.stats.percentage = Math.round((this.stats.withCreatedAt / this.stats.total) * 100)
              
            } catch (error) {
              this.addLog(`❌ خطأ في ${doc.id}: ${error.message}`, 'error')
            }
            
            // Small delay to avoid rate limiting on Spark plan
            await new Promise(resolve => setTimeout(resolve, 100))
          }
          
          processedCount++
        }
        
        this.addLog(`🎉 تم تحديث ${updatedCount} عنصر بنجاح`, 'success')
        
      } catch (error) {
        this.addLog(`❌ خطأ عام: ${error.message}`, 'error')
      } finally {
        this.isMigrating = false
        this.currentProgress = 0
        this.batchSize = 0
      }
    }
  }
}
</script>

<style scoped>
.migration-tool {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 10px;
}

.header h1 {
  margin: 0;
  font-size: 2em;
}

.header p {
  margin: 10px 0 0;
  opacity: 0.9;
}

.warning {
  text-align: center;
  padding: 40px;
  background: #fff3cd;
  border: 2px solid #ffd76a;
  border-radius: 10px;
  margin: 20px 0;
}

.warning button {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 5px;
  margin-top: 15px;
  cursor: pointer;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin: 20px 0;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.stat-value {
  font-size: 2em;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  margin-top: 5px;
  color: #666;
}

.progress {
  background: #f0f0f0;
  height: 20px;
  border-radius: 10px;
  margin: 30px 0;
  position: relative;
  overflow: hidden;
}

.progress-bar {
  background: linear-gradient(90deg, #4CAF50, #45a049);
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #333;
}

.controls {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin: 30px 0;
}

.btn-primary {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background: #45a049;
}

.btn-primary:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #667eea;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  grid-column: span 2;
}

.btn-secondary:hover:not(:disabled) {
  background: #5a67d8;
}

.loading {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  margin: 20px 0;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.log {
  margin: 30px 0;
}

.log h3 {
  margin-bottom: 10px;
  color: #333;
}

.log-content {
  background: #1a1a1a;
  color: white;
  padding: 15px;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.log-entry {
  padding: 5px 0;
  border-bottom: 1px solid #333;
}

.log-entry:last-child {
  border-bottom: none;
}

.log-entry.success {
  color: #4CAF50;
}

.log-entry.error {
  color: #f44336;
}

.log-entry.info {
  color: #2196F3;
}

.instructions {
  background: #e8f4fd;
  padding: 20px;
  border-radius: 10px;
  margin-top: 30px;
  border-right: 4px solid #2196F3;
}

.instructions h3 {
  color: #1967d2;
  margin-top: 0;
}

.instructions ol {
  padding-left: 20px;
}

.instructions li {
  margin-bottom: 10px;
  line-height: 1.5;
}
</style>