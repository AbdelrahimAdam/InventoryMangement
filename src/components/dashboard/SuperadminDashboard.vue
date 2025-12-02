<template>
  <div class="space-y-6 fade-in">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg overflow-hidden">
      <div class="px-6 py-8">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="text-white">
            <h2 class="text-2xl font-bold mb-2">مرحباً بك، المشرف العام!</h2>
            <p class="opacity-90">لديك صلاحيات كاملة للتحكم في جميع أجزاء النظام.</p>
          </div>
          <div class="mt-4 md:mt-0">
            <div class="flex items-center space-x-4 space-x-reverse">
              <div class="text-right">
                <p class="text-sm text-white opacity-90">إجمالي المستخدمين</p>
                <p class="text-2xl font-bold text-white">{{ usersCount }}</p>
              </div>
              <div class="h-10 w-px bg-white/20"></div>
              <div class="text-right">
                <p class="text-sm text-white opacity-90">المخازن النشطة</p>
                <p class="text-2xl font-bold text-white">{{ activeWarehousesCount }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <router-link 
        to="/users"
        class="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <svg class="h-6 w-6 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
          </div>
          <span class="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">{{ usersCount }} مستخدم</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">إدارة المستخدمين</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">إنشاء وتعديل المستخدمين، تعيين الأدوار والصلاحيات</p>
        <span class="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
          الدخول إلى لوحة التحكم
          <svg class="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </span>
      </router-link>

      <router-link 
        to="/inventory"
        class="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-green-300 dark:hover:border-green-700 transition-all duration-200"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <svg class="h-6 w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
          <span class="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">{{ totalItems }} صنف</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">إدارة المخزون</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">عرض وتعديل جميع الأصناف في جميع المخازن</p>
        <span class="inline-flex items-center text-sm text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300">
          عرض المخزون الكامل
          <svg class="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </span>
      </router-link>

      <router-link 
        to="/transactions"
        class="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <svg class="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
            </svg>
          </div>
          <span class="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">{{ todayTransactions }} حركة اليوم</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">سجل الحركات</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">مراقبة جميع عمليات النقل والإضافة والصرف</p>
        <span class="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
          عرض السجل الكامل
          <svg class="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </span>
      </router-link>

      <button 
        @click="showQuickAddModal = true"
        class="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-200 text-right"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <svg class="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">إضافة فورية</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">إضافة صنف جديد أو مستخدم أو حركة بسرعة</p>
        <span class="inline-flex items-center text-sm text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300">
          بدء الإضافة
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </span>
      </button>
    </div>

    <!-- System Overview -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">نظرة عامة على النظام</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">إحصائيات وأداء النظام</p>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- System Health -->
          <div class="lg:col-span-2">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">صحة النظام</h4>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                    <svg class="h-5 w-5 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">قاعدة البيانات</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">متصل وجاهز</p>
                  </div>
                </div>
                <span class="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">ممتاز</span>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                    <svg class="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">الأمان</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">مستوى أمان عالي</p>
                  </div>
                </div>
                <span class="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">آمن</span>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                    <svg class="h-5 w-5 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">الذاكرة</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">استخدام ذاكرة معقول</p>
                  </div>
                </div>
                <span class="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">85%</span>
              </div>
            </div>
          </div>

          <!-- Recent Activities -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">أحدث الأنشطة</h4>
            <div class="space-y-3">
              <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start">
                <div :class="['h-8 w-8 rounded-full flex items-center justify-center mr-2', getActivityColor(activity.type)]">
                  <component :is="getActivityIcon(activity.type)" class="h-4 w-4 text-white" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.description }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatTimeAgo(activity.timestamp) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Critical Alerts -->
    <div v-if="criticalAlerts.length > 0" class="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-xl shadow-sm">
      <div class="px-6 py-4 border-b border-red-100 dark:border-red-800">
        <div class="flex items-center">
          <svg class="h-5 w-5 text-red-500 dark:text-red-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <h3 class="text-lg font-semibold text-red-800 dark:text-red-200">تنبيهات مهمة</h3>
          <span class="mr-3 text-xs font-medium px-2 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
            {{ criticalAlerts.length }}
          </span>
        </div>
      </div>
      <div class="p-6">
        <div class="space-y-3">
          <div v-for="alert in criticalAlerts" :key="alert.id" class="flex items-start">
            <div class="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-3">
              <svg class="h-4 w-4 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-red-800 dark:text-red-200">{{ alert.message }}</p>
              <div class="flex items-center mt-1">
                <span class="text-xs text-red-600 dark:text-red-400">{{ formatTimeAgo(alert.timestamp) }}</span>
                <button @click="resolveAlert(alert.id)" class="mr-3 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                  تم الحل
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions Modal -->
    <div v-if="showQuickAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md rtl">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">إضافة فورية</h3>
            <button @click="showQuickAddModal = false" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="p-6 space-y-4">
          <button 
            @click="openAddUser"
            class="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div class="flex items-center">
              <div class="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                <svg class="h-5 w-5 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </div>
              <div class="text-right">
                <p class="font-medium text-gray-900 dark:text-white">إضافة مستخدم جديد</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">إنشاء حساب جديد وتعيين الصلاحيات</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          <button 
            @click="openAddItem"
            class="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div class="flex items-center">
              <div class="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                <svg class="h-5 w-5 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <div class="text-right">
                <p class="font-medium text-gray-900 dark:text-white">إضافة صنف جديد</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">إضافة صنف إلى المخزون</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          <button 
            @click="openAddTransaction"
            class="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div class="flex items-center">
              <div class="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                <svg class="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
              </div>
              <div class="text-right">
                <p class="font-medium text-gray-900 dark:text-white">تسجيل حركة</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">نقل أو صرف أصناف</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

// Activity Icons Components
const AddUserIcon = {
  template: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>`
};

const AddItemIcon = {
  template: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>`
};

const TransferIcon = {
  template: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>`
};

const AlertIcon = {
  template: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>`
};

export default {
  name: 'SuperadminDashboard',
  components: {
    AddUserIcon,
    AddItemIcon,
    TransferIcon,
    AlertIcon
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    
    const showQuickAddModal = ref(false);

    // Computed properties
    const usersCount = computed(() => {
      return store.state.inventory?.length || 0; // Mock data - replace with actual users count
    });

    const activeWarehousesCount = computed(() => {
      return store.state.warehouses?.filter(w => w.type === 'primary').length || 0;
    });

    const totalItems = computed(() => {
      return store.state.inventory?.length || 0;
    });

    const todayTransactions = computed(() => {
      return store.state.transactions?.filter(t => {
        const date = t.timestamp?.toDate ? t.timestamp.toDate() : new Date(t.timestamp);
        return date.toDateString() === new Date().toDateString();
      }).length || 0;
    });

    // Mock data - replace with actual data from store
    const recentActivities = computed(() => [
      { id: 1, type: 'add_user', description: 'تم إضافة مستخدم جديد: مدير مخزن جديد', timestamp: new Date(Date.now() - 3600000) },
      { id: 2, type: 'add_item', description: 'تم إضافة 50 كرتون من عطر فلورا', timestamp: new Date(Date.now() - 7200000) },
      { id: 3, type: 'transfer', description: 'نقل 100 قطعة من مخزن الشيخ إلى مخزن الترعة', timestamp: new Date(Date.now() - 10800000) },
      { id: 4, type: 'alert', description: 'تنبيه: مخزون عطر نايت منخفض', timestamp: new Date(Date.now() - 14400000) }
    ]);

    const criticalAlerts = computed(() => [
      { id: 1, type: 'low_stock', message: '3 أصناف عندها كميات منخفضة جداً', timestamp: new Date(Date.now() - 3600000) },
      { id: 2, type: 'inactive_user', message: 'مستخدم لم يسجل دخول منذ 30 يوم', timestamp: new Date(Date.now() - 7200000) }
    ]);

    // Helper functions
    const getActivityColor = (type) => {
      const colors = {
        add_user: 'bg-indigo-500',
        add_item: 'bg-green-500',
        transfer: 'bg-blue-500',
        alert: 'bg-red-500'
      };
      return colors[type] || 'bg-gray-500';
    };

    const getActivityIcon = (type) => {
      const icons = {
        add_user: 'AddUserIcon',
        add_item: 'AddItemIcon',
        transfer: 'TransferIcon',
        alert: 'AlertIcon'
      };
      return icons[type] || 'AlertIcon';
    };

    const formatTimeAgo = (timestamp) => {
      const now = new Date();
      const diff = now - timestamp;
      
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      
      if (minutes < 60) return `قبل ${minutes} دقيقة`;
      if (hours < 24) return `قبل ${hours} ساعة`;
      return `قبل ${days} يوم`;
    };

    const openAddUser = () => {
      showQuickAddModal.value = false;
      router.push('/users/add');
    };

    const openAddItem = () => {
      showQuickAddModal.value = false;
      router.push('/inventory/add');
    };

    const openAddTransaction = () => {
      showQuickAddModal.value = false;
      router.push('/transactions/add');
    };

    const resolveAlert = (alertId) => {
      console.log('Resolving alert:', alertId);
      // Implement alert resolution logic
    };

    const exportSystemReport = () => {
      console.log('Exporting system report...');
      // Implement export functionality
    };

    onMounted(() => {
      // Load any additional data needed for superadmin dashboard
      store.dispatch('loadAllUsers');
    });

    return {
      showQuickAddModal,
      usersCount,
      activeWarehousesCount,
      totalItems,
      todayTransactions,
      recentActivities,
      criticalAlerts,
      getActivityColor,
      getActivityIcon,
      formatTimeAgo,
      openAddUser,
      openAddItem,
      openAddTransaction,
      resolveAlert,
      exportSystemReport
    };
  }
};
</script>

<style scoped>
/* Custom animations */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Gradient borders */
.gradient-border {
  position: relative;
}

.gradient-border::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #6366f1, #8b5cf6, #ec4899);
  border-radius: inherit;
  z-index: -1;
}

/* Custom scrollbar for activity list */
.activity-scroll {
  max-height: 300px;
  overflow-y: auto;
}

.activity-scroll::-webkit-scrollbar {
  width: 4px;
}

.activity-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.activity-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.activity-scroll::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark .activity-scroll::-webkit-scrollbar-track {
  background: #374151;
}

.dark .activity-scroll::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark .activity-scroll::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>