<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-2 md:p-4 font-tajawal" dir="rtl">
    <!-- Authentication Check -->
    <div v-if="!isAuthenticated" class="flex items-center justify-center min-h-screen">
      <div class="text-center text-white p-8 bg-gray-800/50 backdrop-blur rounded-2xl">
        <h2 class="text-xl font-bold mb-4">يجب تسجيل الدخول للوصول إلى سجل الحركات</h2>
        <router-link to="/login" class="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg">
          تسجيل الدخول
        </router-link>
      </div>
    </div>

    <!-- Main Content when authenticated -->
    <div v-else>
      <!-- Header -->
      <div class="mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl shadow border-0 relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400"></div>
        <div class="relative p-4">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shadow border border-white/30">
                <span class="text-xl font-bold text-white">📊</span>
              </div>
              <div>
                <h1 class="text-xl font-black text-white mb-1 font-tajawal">
                  سجل الحركات
                </h1>
                <p class="text-sm text-white/90 font-medium font-tajawal">
                  نظام متكامل لتتبع حركات الأصناف
                </p>
              </div>
            </div>
            <div class="flex gap-2 flex-wrap justify-center items-center">
              <button
                @click="refreshData"
                :disabled="loading"
                class="bg-white/20 backdrop-blur text-white font-black rounded-xl px-3 py-2 flex items-center gap-2 hover:bg-white/30 disabled:bg-white/10 disabled:text-white/50 transition-all duration-200 text-sm border border-white/30"
              >
                <span class="text-sm">🔄</span>
                <span>تحديث</span>
              </button>
              <button
                @click="exportData"
                :disabled="!transactionsData.length"
                class="bg-white/20 backdrop-blur text-white font-black rounded-xl px-3 py-2 flex items-center gap-2 hover:bg-white/30 disabled:bg-white/10 disabled:text-white/50 transition-all duration-200 text-sm border border-white/30"
              >
                <span class="text-sm">📥</span>
                <span>تصدير</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
        <p class="text-white text-lg">جاري تحميل البيانات...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 rounded-xl shadow mb-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-lg">⚠️</span>
            <span>{{ error }}</span>
          </div>
          <button @click="error = ''" class="text-white/80 hover:text-white text-lg">
            ✕
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else>
        <!-- Stats Summary -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-4 text-white">
            <div class="text-sm opacity-90 mb-1">إجمالي الحركات</div>
            <div class="text-2xl font-bold">{{ filteredTransactions.length }}</div>
          </div>
          <div class="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-4 text-white">
            <div class="text-sm opacity-90 mb-1">الإضافات</div>
            <div class="text-2xl font-bold">{{ stats.added }}</div>
          </div>
          <div class="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-4 text-white">
            <div class="text-sm opacity-90 mb-1">التحويلات</div>
            <div class="text-2xl font-bold">{{ stats.transferred }}</div>
          </div>
          <div class="bg-gradient-to-r from-orange-600 to-orange-800 rounded-xl p-4 text-white">
            <div class="text-sm opacity-90 mb-1">الصرف</div>
            <div class="text-2xl font-bold">{{ stats.dispatched }}</div>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-gray-800/50 backdrop-blur rounded-xl p-4 mb-4 border border-gray-700/50">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <input
                type="text"
                v-model="filters.search"
                placeholder="🔍 ابحث في الحركات..."
                class="w-full p-3 bg-gray-700/50 rounded-xl border border-blue-600 focus:border-blue-500 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <select
                v-model="filters.type"
                class="w-full p-3 bg-gray-700/50 rounded-xl border border-purple-600 text-white"
              >
                <option value="">جميع الأنواع</option>
                <option value="ADD">إضافة</option>
                <option value="TRANSFER">تحويل</option>
                <option value="DISPATCH">صرف</option>
              </select>
            </div>
            <div>
              <input
                type="date"
                v-model="filters.startDate"
                class="w-full p-3 bg-gray-700/50 rounded-xl border border-blue-600 text-white"
              />
            </div>
            <div>
              <input
                type="date"
                v-model="filters.endDate"
                class="w-full p-3 bg-gray-700/50 rounded-xl border border-blue-600 text-white"
              />
            </div>
          </div>
        </div>

        <!-- Transactions Table -->
        <div class="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700/50 overflow-hidden">
          <!-- Desktop View -->
          <div class="hidden md:block">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gradient-to-r from-blue-600 to-purple-600">
                  <tr>
                    <th class="p-3 text-white font-bold text-sm">النوع</th>
                    <th class="p-3 text-white font-bold text-sm">من</th>
                    <th class="p-3 text-white font-bold text-sm">إلى</th>
                    <th class="p-3 text-white font-bold text-sm">الكمية</th>
                    <th class="p-3 text-white font-bold text-sm">التاريخ</th>
                    <th class="p-3 text-white font-bold text-sm">ملاحظات</th>
                    <th class="p-3 text-white font-bold text-sm">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredTransactions.length === 0">
                    <td colspan="7" class="p-8 text-center text-gray-400">
                      <div class="py-8">
                        <h3 class="text-lg font-bold mb-2">لا توجد حركات</h3>
                        <p class="text-sm">لم يتم تسجيل أي حركات حتى الآن.</p>
                      </div>
                    </td>
                  </tr>
                  <tr 
                    v-for="transaction in filteredTransactions" 
                    :key="transaction.id"
                    class="border-b border-gray-700/50 hover:bg-blue-900/20"
                  >
                    <td class="p-3 text-center">
                      <span :class="getTransactionTypeClass(transaction.type)" 
                            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium">
                        {{ getTransactionType(transaction.type) }}
                      </span>
                    </td>
                    <td class="p-3 text-center text-gray-300 text-sm">
                      {{ getWarehouseLabel(transaction.from_warehouse) || '-' }}
                    </td>
                    <td class="p-3 text-center text-gray-300 text-sm">
                      {{ getWarehouseLabel(transaction.to_warehouse) || '-' }}
                    </td>
                    <td class="p-3 text-center">
                      <span class="text-blue-400 font-bold">
                        {{ Math.abs(transaction.cartons_delta * (transaction.per_carton_updated || 1) + transaction.single_delta) }}
                      </span>
                    </td>
                    <td class="p-3 text-center text-gray-300 text-sm">
                      {{ formatDate(transaction.timestamp) }}
                    </td>
                    <td class="p-3 text-center text-gray-300 text-sm max-w-xs truncate">
                      {{ transaction.notes || '-' }}
                    </td>
                    <td class="p-3 text-center">
                      <button
                        @click="viewTransactionDetails(transaction)"
                        class="p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                        title="عرض التفاصيل"
                      >
                        👁️
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Mobile View -->
          <div class="md:hidden">
            <div v-if="filteredTransactions.length === 0" class="p-8 text-center text-gray-400">
              <h3 class="text-lg font-bold mb-2">لا توجد حركات</h3>
              <p class="text-sm">لم يتم تسجيل أي حركات حتى الآن.</p>
            </div>
            <div v-else class="space-y-2 p-4">
              <div 
                v-for="transaction in filteredTransactions.slice(0, 20)" 
                :key="transaction.id"
                class="bg-gray-800/30 rounded-xl p-3 border border-gray-700/50"
                @click="viewTransactionDetails(transaction)"
              >
                <div class="flex justify-between items-start mb-2">
                  <span :class="getTransactionTypeClass(transaction.type)" 
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">
                    {{ getTransactionType(transaction.type) }}
                  </span>
                  <span class="text-xs text-gray-400">
                    {{ formatDate(transaction.timestamp) }}
                  </span>
                </div>
                <div class="text-sm text-gray-300 space-y-1">
                  <div v-if="transaction.from_warehouse">
                    من: {{ getWarehouseLabel(transaction.from_warehouse) }}
                  </div>
                  <div v-if="transaction.to_warehouse">
                    إلى: {{ getWarehouseLabel(transaction.to_warehouse) }}
                  </div>
                  <div>
                    الكمية: {{ Math.abs(transaction.cartons_delta * (transaction.per_carton_updated || 1) + transaction.single_delta) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Transaction Details Modal -->
      <div v-if="selectedTransaction" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click="selectedTransaction = null">
        <div class="w-full max-w-2xl bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden" @click.stop>
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-bold text-white">تفاصيل الحركة</h2>
              <button @click="selectedTransaction = null" class="text-white/80 hover:text-white text-xl">
                ✕
              </button>
            </div>
          </div>
          <div class="p-4 max-h-[70vh] overflow-y-auto">
            <div v-if="selectedTransaction" class="space-y-4">
              <!-- Transaction Type -->
              <div class="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span class="text-white">↔</span>
                </div>
                <div>
                  <div class="text-sm text-gray-400">نوع الحركة</div>
                  <div class="text-lg font-bold text-white">{{ getTransactionType(selectedTransaction.type) }}</div>
                </div>
              </div>

              <!-- Warehouses -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div v-if="selectedTransaction.from_warehouse" class="p-3 bg-gray-800/50 rounded-xl">
                  <div class="text-sm text-gray-400 mb-1">من</div>
                  <div class="text-lg font-bold text-amber-400">{{ getWarehouseLabel(selectedTransaction.from_warehouse) }}</div>
                </div>
                <div v-if="selectedTransaction.to_warehouse" class="p-3 bg-gray-800/50 rounded-xl">
                  <div class="text-sm text-gray-400 mb-1">إلى</div>
                  <div class="text-lg font-bold text-green-400">{{ getWarehouseLabel(selectedTransaction.to_warehouse) }}</div>
                </div>
              </div>

              <!-- Quantity Details -->
              <div class="p-3 bg-gray-800/50 rounded-xl">
                <div class="text-sm text-gray-400 mb-2">تفاصيل الكمية</div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div class="text-center">
                    <div class="text-xs text-gray-400">الكراتين</div>
                    <div class="text-xl font-bold text-blue-400">{{ Math.abs(selectedTransaction.cartons_delta) || 0 }}</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xs text-gray-400">الفردي</div>
                    <div class="text-xl font-bold text-green-400">{{ Math.abs(selectedTransaction.single_delta) || 0 }}</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xs text-gray-400">في الكرتونة</div>
                    <div class="text-xl font-bold text-purple-400">{{ selectedTransaction.per_carton_updated || 1 }}</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xs text-gray-400">الإجمالي</div>
                    <div class="text-xl font-bold text-white">
                      {{ Math.abs(selectedTransaction.cartons_delta * (selectedTransaction.per_carton_updated || 1) + selectedTransaction.single_delta) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Date and Notes -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="p-3 bg-gray-800/50 rounded-xl">
                  <div class="text-sm text-gray-400 mb-1">التاريخ والوقت</div>
                  <div class="text-white">{{ formatDate(selectedTransaction.timestamp) }}</div>
                </div>
                <div class="p-3 bg-gray-800/50 rounded-xl">
                  <div class="text-sm text-gray-400 mb-1">ملاحظات</div>
                  <div class="text-white">{{ selectedTransaction.notes || 'لا توجد ملاحظات' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'TransactionHistory',
  
  setup() {
    const store = useStore()
    
    // Reactive state
    const loading = ref(false)
    const error = ref('')
    const selectedTransaction = ref(null)
    const filters = ref({
      search: '',
      type: '',
      startDate: '',
      endDate: ''
    })

    // Helper functions
    const getTransactionType = (type) => {
      const types = {
        'ADD': 'إضافة',
        'TRANSFER': 'تحويل',
        'DISPATCH': 'صرف'
      }
      return types[type] || type
    }

    const getTransactionTypeClass = (type) => {
      const classes = {
        'ADD': 'bg-green-100 text-green-800',
        'TRANSFER': 'bg-blue-100 text-blue-800',
        'DISPATCH': 'bg-orange-100 text-orange-800'
      }
      return classes[type] || 'bg-gray-100 text-gray-800'
    }

    const formatDate = (timestamp) => {
      if (!timestamp) return '-'
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        if (isNaN(date.getTime())) return '-'
        
        return date.toLocaleString('ar-EG', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      } catch (err) {
        console.error('Error formatting date:', err)
        return '-'
      }
    }

    const getWarehouseLabel = (warehouseId) => {
      if (!warehouseId) return '-'
      const label = store.getters.getWarehouseLabel(warehouseId)
      return label || warehouseId
    }

    // Computed properties - with safe null checks
    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    
    const transactionsData = computed(() => {
      try {
        const transactions = store.state.transactions
        // Handle null/undefined cases
        if (!transactions || !Array.isArray(transactions)) {
          return []
        }
        return transactions
      } catch (err) {
        console.error('Error accessing transactions:', err)
        return []
      }
    })

    // Calculate statistics safely
    const stats = computed(() => {
      try {
        const trans = transactionsData.value
        if (!Array.isArray(trans)) {
          return { added: 0, transferred: 0, dispatched: 0 }
        }

        return {
          added: trans.filter(t => t.type === 'ADD').length,
          transferred: trans.filter(t => t.type === 'TRANSFER').length,
          dispatched: trans.filter(t => t.type === 'DISPATCH').length
        }
      } catch (err) {
        console.error('Error calculating stats:', err)
        return { added: 0, transferred: 0, dispatched: 0 }
      }
    })

    // Filter transactions safely
    const filteredTransactions = computed(() => {
      try {
        const trans = transactionsData.value
        if (!Array.isArray(trans)) {
          return []
        }

        let filtered = [...trans]
        
        // Type filter
        if (filters.value.type) {
          filtered = filtered.filter(t => t.type === filters.value.type)
        }
        
        // Search filter
        if (filters.value.search) {
          const searchTerm = filters.value.search.toLowerCase()
          filtered = filtered.filter(t => {
            const fromWarehouse = getWarehouseLabel(t.from_warehouse) || ''
            const toWarehouse = getWarehouseLabel(t.to_warehouse) || ''
            const notes = t.notes || ''
            const type = getTransactionType(t.type) || ''
            
            return fromWarehouse.toLowerCase().includes(searchTerm) ||
                   toWarehouse.toLowerCase().includes(searchTerm) ||
                   notes.toLowerCase().includes(searchTerm) ||
                   type.toLowerCase().includes(searchTerm)
          })
        }
        
        // Date filter
        if (filters.value.startDate) {
          const startDate = new Date(filters.value.startDate)
          startDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter(t => {
            if (!t.timestamp) return false
            const date = t.timestamp.toDate ? t.timestamp.toDate() : new Date(t.timestamp)
            return date >= startDate
          })
        }
        
        if (filters.value.endDate) {
          const endDate = new Date(filters.value.endDate)
          endDate.setHours(23, 59, 59, 999)
          filtered = filtered.filter(t => {
            if (!t.timestamp) return false
            const date = t.timestamp.toDate ? t.timestamp.toDate() : new Date(t.timestamp)
            return date <= endDate
          })
        }
        
        return filtered
      } catch (err) {
        console.error('Error filtering transactions:', err)
        return []
      }
    })

    // Methods
    const refreshData = async () => {
      try {
        loading.value = true
        error.value = ''
        // Refresh transactions subscription
        await store.dispatch('subscribeToTransactions')
      } catch (err) {
        error.value = 'فشل في تحديث البيانات: ' + (err.message || 'خطأ غير معروف')
      } finally {
        loading.value = false
      }
    }

    const exportData = () => {
      try {
        const data = filteredTransactions.value
        if (!data || data.length === 0) {
          error.value = 'لا توجد بيانات للتصدير'
          return
        }

        const headers = ['النوع', 'من', 'إلى', 'الكمية', 'التاريخ', 'ملاحظات']
        const csvData = data.map(transaction => [
          getTransactionType(transaction.type),
          getWarehouseLabel(transaction.from_warehouse) || '-',
          getWarehouseLabel(transaction.to_warehouse) || '-',
          Math.abs(transaction.cartons_delta * (transaction.per_carton_updated || 1) + transaction.single_delta),
          formatDate(transaction.timestamp),
          transaction.notes || '-'
        ])

        const csvContent = [
          '\uFEFF' + headers.join(','),
          ...csvData.map(row => row.map(field => `"${field}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `حركات-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } catch (err) {
        console.error('Export error:', err)
        error.value = 'فشل في تصدير الملف: ' + err.message
      }
    }

    const viewTransactionDetails = (transaction) => {
      selectedTransaction.value = transaction
    }

    // Lifecycle
    onMounted(() => {
      if (isAuthenticated.value) {
        // Ensure transactions are subscribed
        store.dispatch('subscribeToTransactions')
      }
    })

    onUnmounted(() => {
      selectedTransaction.value = null
    })

    return {
      // State
      loading,
      error,
      selectedTransaction,
      filters,
      
      // Computed
      isAuthenticated,
      transactionsData,
      stats,
      filteredTransactions,
      
      // Methods
      getTransactionType,
      getTransactionTypeClass,
      formatDate,
      getWarehouseLabel,
      refreshData,
      exportData,
      viewTransactionDetails
    }
  }
}
</script>

<style scoped>
.font-tajawal {
  font-family: 'Tajawal', 'Amiri', sans-serif;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.8);
}
</style>