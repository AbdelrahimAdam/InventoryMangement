<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl rtl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">إعدادات النظام</h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="overflow-y-auto max-h-[calc(90vh-8rem)]">
        <div class="p-6 space-y-6">
          <!-- System Information -->
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 class="font-semibold text-blue-900 mb-2">معلومات النظام</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-blue-700">الإصدار:</span>
                <span class="text-blue-900 font-medium mr-2">1.0.0</span>
              </div>
              <div>
                <span class="text-blue-700">آخر تحديث:</span>
                <span class="text-blue-900 font-medium mr-2">2024-01-15</span>
              </div>
              <div>
                <span class="text-blue-700">عدد المستخدمين:</span>
                <span class="text-blue-900 font-medium mr-2">{{ systemStats.totalUsers }}</span>
              </div>
              <div>
                <span class="text-blue-700">المخازن النشطة:</span>
                <span class="text-blue-900 font-medium mr-2">{{ systemStats.activeWarehouses }}</span>
              </div>
            </div>
          </div>

          <!-- General Settings -->
          <div class="space-y-4">
            <h4 class="font-semibold text-gray-900 border-b border-gray-200 pb-2">الإعدادات العامة</h4>
            
            <!-- Auto Logout -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700">تسجيل الخروج التلقائي</p>
                <p class="text-xs text-gray-500">تسجيل الخروج تلقائياً بعد فترة من عدم النشاط</p>
              </div>
              <select v-model="settings.autoLogout" class="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="30">30 دقيقة</option>
                <option value="60">60 دقيقة</option>
                <option value="120">ساعتين</option>
                <option value="0">معطل</option>
              </select>
            </div>

            <!-- Low Stock Threshold -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700">حد الإنذار للمخزون المنخفض</p>
                <p class="text-xs text-gray-500">عدد الوحدات الذي يعتبر عنده المخزون منخفضاً</p>
              </div>
              <input
                v-model.number="settings.lowStockThreshold"
                type="number"
                min="1"
                max="100"
                class="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
            </div>

            <!-- Notifications -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700">إشعارات البريد الإلكتروني</p>
                  <p class="text-xs text-gray-500">إرسال إشعارات عبر البريد الإلكتروني</p>
                </div>
                <button
                  @click="settings.emailNotifications = !settings.emailNotifications"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
                  :class="settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'"
                >
                  <span
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="settings.emailNotifications ? 'translate-x-5' : 'translate-x-0'"
                  />
                </button>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700">إشعارات المخزون المنخفض</p>
                  <p class="text-xs text-gray-500">إرسال تنبيهات عندما ينخفض المخزون</p>
                </div>
                <button
                  @click="settings.lowStockAlerts = !settings.lowStockAlerts"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
                  :class="settings.lowStockAlerts ? 'bg-blue-600' : 'bg-gray-200'"
                >
                  <span
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="settings.lowStockAlerts ? 'translate-x-5' : 'translate-x-0'"
                  />
                </button>
              </div>
            </div>
          </div>

          <!-- Data Management -->
          <div class="space-y-4">
            <h4 class="font-semibold text-gray-900 border-b border-gray-200 pb-2">إدارة البيانات</h4>
            
            <!-- Auto Backup -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700">النسخ الاحتياطي التلقائي</p>
                <p class="text-xs text-gray-500">إنشاء نسخة احتياطية تلقائية للبيانات</p>
              </div>
              <select v-model="settings.autoBackup" class="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="daily">يومياً</option>
                <option value="weekly">أسبوعياً</option>
                <option value="monthly">شهرياً</option>
                <option value="disabled">معطل</option>
              </select>
            </div>

            <!-- Data Retention -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700">فترة حفظ السجلات</p>
                <p class="text-xs text-gray-500">المدة الزمنية لحفظ سجلات النظام</p>
              </div>
              <select v-model="settings.dataRetention" class="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="30">30 يوم</option>
                <option value="90">3 أشهر</option>
                <option value="365">سنة واحدة</option>
                <option value="forever">للأبد</option>
              </select>
            </div>

            <!-- Manual Backup -->
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm font-medium text-gray-700 mb-2">نسخة احتياطية يدوية</p>
              <p class="text-xs text-gray-500 mb-3">إنشاء نسخة احتياطية لجميع بيانات النظام</p>
              <button
                @click="createBackup"
                :disabled="backupLoading"
                class="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
              >
                <span v-if="backupLoading">جاري إنشاء النسخة...</span>
                <span v-else>إنشاء نسخة احتياطية</span>
              </button>
            </div>
          </div>

          <!-- Security Settings -->
          <div class="space-y-4">
            <h4 class="font-semibold text-gray-900 border-b border-gray-200 pb-2">الإعدادات الأمنية</h4>
            
            <!-- Password Policy -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700">قوة كلمة المرور</p>
                <p class="text-xs text-gray-500">متطلبات تعقيد كلمة المرور</p>
              </div>
              <select v-model="settings.passwordPolicy" class="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="low">منخفضة</option>
                <option value="medium">متوسطة</option>
                <option value="high">عالية</option>
              </select>
            </div>

            <!-- Session Management -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700">جلسات متعددة</p>
                <p class="text-xs text-gray-500">السماح بتسجيل الدخول من أجهزة متعددة</p>
              </div>
              <button
                @click="settings.multipleSessions = !settings.multipleSessions"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
                :class="settings.multipleSessions ? 'bg-blue-600' : 'bg-gray-200'"
              >
                <span
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="settings.multipleSessions ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="border border-red-200 rounded-xl p-4 bg-red-50">
            <h4 class="font-semibold text-red-900 mb-3">منطقة الخطر</h4>
            
            <!-- Reset System -->
            <div class="flex items-center justify-between mb-3">
              <div>
                <p class="text-sm font-medium text-red-700">إعادة تعيين النظام</p>
                <p class="text-xs text-red-600">حذف جميع البيانات وإعادة النظام إلى الحالة الافتراضية</p>
              </div>
              <button
                @click="showResetConfirm = true"
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                إعادة التعيين
              </button>
            </div>

            <!-- Clear All Data -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-red-700">مسح جميع البيانات</p>
                <p class="text-xs text-red-600">حذف جميع البيانات بشكل نهائي ولا يمكن التراجع عنه</p>
              </div>
              <button
                @click="showClearConfirm = true"
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                مسح الكل
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex space-x-3 space-x-reverse">
          <button
            @click="$emit('close')"
            class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            إلغاء
          </button>
          <button
            @click="saveSettings"
            :disabled="saveLoading"
            class="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
          >
            <span v-if="saveLoading">جاري الحفظ...</span>
            <span v-else>حفظ الإعدادات</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Reset Confirmation Modal -->
    <div v-if="showResetConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
      <div class="bg-white rounded-xl p-6 max-w-sm w-full">
        <h4 class="text-lg font-semibold text-red-900 mb-2">تأكيد إعادة التعيين</h4>
        <p class="text-sm text-gray-600 mb-4">هل أنت متأكد من أنك تريد إعادة تعيين النظام؟ هذا الإجراء لا يمكن التراجع عنه.</p>
        <div class="flex space-x-3 space-x-reverse">
          <button
            @click="showResetConfirm = false"
            class="flex-1 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            إلغاء
          </button>
          <button
            @click="resetSystem"
            class="flex-1 px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            تأكيد
          </button>
        </div>
      </div>
    </div>

    <!-- Clear Data Confirmation Modal -->
    <div v-if="showClearConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
      <div class="bg-white rounded-xl p-6 max-w-sm w-full">
        <h4 class="text-lg font-semibold text-red-900 mb-2">تأكيد مسح البيانات</h4>
        <p class="text-sm text-gray-600 mb-4">سيتم حذف جميع البيانات بشكل نهائي. هذا الإجراء لا يمكن التراجع عنه.</p>
        <div class="flex space-x-3 space-x-reverse">
          <button
            @click="showClearConfirm = false"
            class="flex-1 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            إلغاء
          </button>
          <button
            @click="clearAllData"
            class="flex-1 px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            تأكيد
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'SystemSettingsModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const store = useStore()
    
    const saveLoading = ref(false)
    const backupLoading = ref(false)
    const showResetConfirm = ref(false)
    const showClearConfirm = ref(false)

    const systemStats = computed(() => ({
      totalUsers: store.state.users?.length || 0,
      activeWarehouses: store.state.warehouses?.length || 0
    }))

    const settings = reactive({
      autoLogout: '60',
      lowStockThreshold: 10,
      emailNotifications: true,
      lowStockAlerts: true,
      autoBackup: 'weekly',
      dataRetention: '365',
      passwordPolicy: 'medium',
      multipleSessions: false
    })

    const saveSettings = async () => {
      saveLoading.value = true
      try {
        // Simulate API call to save settings
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('Settings saved:', settings)
        // In real app, dispatch to Vuex store or call API
        // await store.dispatch('saveSystemSettings', settings)
      } catch (error) {
        console.error('Error saving settings:', error)
      } finally {
        saveLoading.value = false
        emit('close')
      }
    }

    const createBackup = async () => {
      backupLoading.value = true
      try {
        // Simulate backup creation
        await new Promise(resolve => setTimeout(resolve, 2000))
        console.log('Backup created successfully')
        // In real app, implement actual backup logic
      } catch (error) {
        console.error('Error creating backup:', error)
      } finally {
        backupLoading.value = false
      }
    }

    const resetSystem = async () => {
      try {
        console.log('System reset initiated')
        // Implement system reset logic
        showResetConfirm.value = false
        emit('close')
      } catch (error) {
        console.error('Error resetting system:', error)
      }
    }

    const clearAllData = async () => {
      try {
        console.log('Data clear initiated')
        // Implement data clear logic
        showClearConfirm.value = false
        emit('close')
      } catch (error) {
        console.error('Error clearing data:', error)
      }
    }

    return {
      settings,
      systemStats,
      saveLoading,
      backupLoading,
      showResetConfirm,
      showClearConfirm,
      saveSettings,
      createBackup,
      resetSystem,
      clearAllData
    }
  }
}
</script>

<style scoped>
.rtl {
  direction: rtl;
}

.space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

.max-h-\[90vh\] {
  max-height: 90vh;
}

.max-h-\[calc\(90vh-8rem\)\] {
  max-height: calc(90vh - 8rem);
}
</style>