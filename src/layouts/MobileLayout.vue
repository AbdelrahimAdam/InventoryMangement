<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <!-- Mobile Header -->
    <header class="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div class="px-4 py-3">
        <div class="flex items-center justify-between">
          <!-- Logo & Title -->
          <div class="flex items-center">
            <div class="h-10 w-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="mr-3">
              <h1 class="text-lg font-bold text-gray-900 dark:text-white">لوحة التحكم</h1>
              <p class="text-xs text-gray-600 dark:text-gray-400">{{ getUserRoleName }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-3 rtl:space-x-reverse">
            <button @click="toggleDarkMode" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg v-if="isDarkMode" class="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              <svg v-else class="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            </button>

            <button @click="toggleNotifications" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative">
              <svg class="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span v-if="notificationCount > 0" class="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="pb-20 px-4">
      <!-- Welcome Card -->
      <div class="mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-xl p-6">
        <div class="text-white">
          <h2 class="text-xl font-bold mb-2">مرحباً، {{ userName }}</h2>
          <p class="text-blue-100 opacity-90 text-sm">آخر تحديث: {{ formatTime(lastUpdate) }}</p>
          <div class="mt-4 flex items-center space-x-4 rtl:space-x-reverse">
            <button @click="refreshData" :disabled="loading" 
                    class="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all">
              <svg :class="{'animate-spin': loading}" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <span class="text-sm">تحديث</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Grid - 4 Cards -->
      <div class="grid grid-cols-2 gap-4 mt-6">
        <!-- Total Items -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <div class="flex items-center mb-3">
            <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
              <svg class="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <span class="text-xs text-green-600 dark:text-green-400 ml-auto">+12%</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ formatNumber(dashboardStats.totalItems) }}</h3>
          <p class="text-xs text-gray-600 dark:text-gray-400">الأصناف</p>
        </div>

        <!-- Total Quantity -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <div class="flex items-center mb-3">
            <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
              <svg class="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="text-xs text-green-600 dark:text-green-400 ml-auto">+8%</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ formatNumber(dashboardStats.totalQuantity) }}</h3>
          <p class="text-xs text-gray-600 dark:text-gray-400">الكمية</p>
        </div>

        <!-- Low Stock -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <div class="flex items-center mb-3">
            <div class="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg mr-3">
              <svg class="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="text-xs text-orange-600 dark:text-orange-400 ml-auto">+3</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ formatNumber(dashboardStats.lowStockItems) }}</h3>
          <p class="text-xs text-gray-600 dark:text-gray-400">منخفضة</p>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <div class="flex items-center mb-3">
            <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
              <svg class="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <span class="text-xs text-green-600 dark:text-green-400 ml-auto">+15%</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ formatNumber(dashboardStats.recentTransactions) }}</h3>
          <p class="text-xs text-gray-600 dark:text-gray-400">حركات</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">إجراءات سريعة</h3>
        <div class="grid grid-cols-2 gap-3">
          <button v-if="canModifyItems" @click="openAddItemModal" 
                  class="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium py-3 rounded-xl shadow-lg flex items-center justify-center">
            <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            إضافة صنف
          </button>

          <button v-if="canModifyItems" @click="openTransferModal"
                  class="bg-gradient-to-r from-green-600 to-emerald-500 text-white font-medium py-3 rounded-xl shadow-lg flex items-center justify-center">
            <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
            نقل مخزون
          </button>

          <button v-if="canModifyItems && canDispatch" @click="openDispatchModal"
                  class="bg-gradient-to-r from-orange-600 to-amber-500 text-white font-medium py-3 rounded-xl shadow-lg flex items-center justify-center">
            <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m6 4l4-4m0 0l4 4m-4-4v12"/>
            </svg>
            صرف خارجي
          </button>

          <button @click="exportData"
                  class="bg-gradient-to-r from-purple-600 to-violet-500 text-white font-medium py-3 rounded-xl shadow-lg flex items-center justify-center">
            <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            تصدير
          </button>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="mt-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">آخر الحركات</h3>
          <router-link to="/transactions" class="text-sm text-blue-600 dark:text-blue-400">عرض الكل</router-link>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow">
          <div v-if="recentTransactionsLoading" class="p-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">جاري التحميل...</p>
          </div>

          <div v-else-if="recentTransactions.length === 0" class="p-8 text-center">
            <svg class="h-12 w-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">لا توجد حركات حديثة</p>
          </div>

          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <div v-for="transaction in recentTransactions.slice(0, 5)" :key="transaction.id" 
                 class="p-4 flex items-center">
              <div :class="getTransactionColor(transaction.type)" class="h-10 w-10 rounded-lg flex items-center justify-center mr-3">
                <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ getTransactionLabel(transaction.type) }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(transaction.timestamp) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ transaction.quantity || 0 }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">وحدة</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- My Warehouses -->
      <div v-if="accessibleWarehouses.length > 0" class="mt-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">مخازني</h3>
        <div class="space-y-3">
          <div v-for="warehouse in accessibleWarehouses.slice(0, 3)" :key="warehouse.id" 
               class="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center">
                <div class="h-8 w-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                  {{ warehouse.name_ar.charAt(0) }}
                </div>
                <span class="font-medium text-gray-900 dark:text-white">{{ warehouse.name_ar }}</span>
              </div>
              <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full">
                {{ getWarehouseStats(warehouse.id).items }} أصناف
              </span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-blue-500 h-2 rounded-full" :style="{ width: getWarehouseFillPercentage(warehouse.id) + '%' }"></div>
            </div>
            <div class="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
              <span>{{ formatNumber(getWarehouseStats(warehouse.id).quantity) }} وحدة</span>
              <span>{{ getWarehouseFillPercentage(warehouse.id) }}% إشغال</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40">
      <div class="flex justify-around py-3">
        <router-link to="/dashboard" class="flex flex-col items-center text-blue-600 dark:text-blue-400">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span class="text-xs mt-1">الرئيسية</span>
        </router-link>

        <router-link to="/inventory" class="flex flex-col items-center text-gray-600 dark:text-gray-400">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
          </svg>
          <span class="text-xs mt-1">المخزون</span>
        </router-link>

        <router-link to="/transactions" class="flex flex-col items-center text-gray-600 dark:text-gray-400">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <span class="text-xs mt-1">الحركات</span>
        </router-link>

        <router-link to="/profile" class="flex flex-col items-center text-gray-600 dark:text-gray-400">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          <span class="text-xs mt-1">حسابي</span>
        </router-link>
      </div>
    </nav>

    <!-- Notifications Dropdown -->
    <div v-if="showNotifications" class="fixed inset-0 z-50" @click="showNotifications = false">
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl max-h-80 overflow-y-auto"
           @click.stop>
        <div class="p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">الإشعارات</h3>
            <button @click="showNotifications = false" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg class="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div v-if="notificationCount === 0" class="text-center py-8">
            <p class="text-gray-600 dark:text-gray-400">لا توجد إشعارات جديدة</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="notification in lowStockNotifications" :key="notification.id" 
                 class="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div class="flex items-start">
                <svg class="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">تحذير المخزون</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ notification.message }}</p>
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
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'MobileLayout',
  
  setup() {
    const store = useStore();
    const router = useRouter();
    
    // State
    const isDarkMode = ref(false);
    const loading = ref(false);
    const showNotifications = ref(false);
    const lastUpdate = ref(new Date());
    
    // Computed properties
    const userRole = computed(() => store.getters.userRole);
    const userName = computed(() => store.getters.userName);
    const dashboardStats = computed(() => store.getters.dashboardStats);
    const recentTransactions = computed(() => store.state.recentTransactions);
    const recentTransactionsLoading = computed(() => store.state.recentTransactionsLoading);
    const inventory = computed(() => store.state.inventory || []);
    const accessibleWarehouses = computed(() => store.getters.accessibleWarehouses || []);
    
    const canModifyItems = computed(() => store.getters.canEdit);
    const canDispatch = computed(() => store.getters.canDispatch);
    
    const notificationCount = computed(() => {
      return store.getters.dashboardStats?.lowStockItems || 0;
    });
    
    const getUserRoleName = computed(() => {
      const roles = {
        superadmin: 'المشرف العام',
        warehouse_manager: 'مدير المخازن',
        company_manager: 'مدير الشركة'
      };
      return roles[userRole.value] || 'مستخدم';
    });
    
    const lowStockNotifications = computed(() => {
      const lowStockItems = inventory.value.filter(item => 
        (item.remaining_quantity || 0) < 10 && (item.remaining_quantity || 0) > 0
      ).slice(0, 3);
      
      return lowStockItems.map(item => ({
        id: item.id,
        message: `الصنف ${item.name || item.code} منخفض المخزون (${item.remaining_quantity} وحدة)`
      }));
    });
    
    // Methods
    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
      document.documentElement.classList.toggle('dark', isDarkMode.value);
      localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
    };
    
    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
    };
    
    const refreshData = async () => {
      loading.value = true;
      try {
        await store.dispatch('getRecentTransactions');
        lastUpdate.value = new Date();
      } catch (error) {
        console.error('Error refreshing data:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const openAddItemModal = () => {
      if (!canModifyItems.value) {
        alert('ليس لديك صلاحية لإضافة أصناف');
        return;
      }
      router.push('/inventory/add');
    };
    
    const openTransferModal = () => {
      if (!canModifyItems.value) {
        alert('ليس لديك صلاحية لنقل الأصناف');
        return;
      }
      // Implement transfer modal
      console.log('Open transfer modal');
    };
    
    const openDispatchModal = () => {
      if (!canDispatch.value) {
        alert('ليس لديك صلاحية لصرف الأصناف');
        return;
      }
      // Implement dispatch modal
      console.log('Open dispatch modal');
    };
    
    const exportData = () => {
      console.log('Export data');
    };
    
    const getWarehouseStats = (warehouseId) => {
      const items = inventory.value.filter(item => item.warehouse_id === warehouseId);
      return {
        items: items.length,
        quantity: items.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0),
        lowStock: items.filter(item => (item.remaining_quantity || 0) < 10).length
      };
    };
    
    const getWarehouseFillPercentage = (warehouseId) => {
      const warehouse = accessibleWarehouses.value.find(w => w.id === warehouseId);
      if (!warehouse?.capacity) return 0;
      
      const items = getWarehouseStats(warehouseId).items;
      return Math.min(Math.round((items / warehouse.capacity) * 100), 100);
    };
    
    const formatNumber = (num) => {
      return new Intl.NumberFormat('ar-EG').format(num);
    };
    
    const formatTime = (date) => {
      if (!date) return '';
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    };
    
    const getTransactionColor = (type) => {
      const colors = {
        add: 'bg-green-500',
        transfer: 'bg-blue-500',
        dispatch: 'bg-orange-500'
      };
      return colors[type] || 'bg-gray-500';
    };
    
    const getTransactionLabel = (type) => {
      const labels = {
        add: 'إضافة',
        transfer: 'نقل',
        dispatch: 'صرف'
      };
      return labels[type] || type;
    };
    
    // Lifecycle
    onMounted(() => {
      // Check theme
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDarkMode.value = true;
        document.documentElement.classList.add('dark');
      }
      
      // Load initial data
      refreshData();
    });
    
    return {
      // State
      isDarkMode,
      loading,
      showNotifications,
      lastUpdate,
      
      // Computed
      userRole,
      userName,
      dashboardStats,
      recentTransactions,
      recentTransactionsLoading,
      accessibleWarehouses,
      canModifyItems,
      canDispatch,
      notificationCount,
      getUserRoleName,
      lowStockNotifications,
      
      // Methods
      toggleDarkMode,
      toggleNotifications,
      refreshData,
      openAddItemModal,
      openTransferModal,
      openDispatchModal,
      exportData,
      getWarehouseStats,
      getWarehouseFillPercentage,
      formatNumber,
      formatTime,
      getTransactionColor,
      getTransactionLabel
    };
  }
};
</script>

<style scoped>
/* Mobile-specific styles */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Safe area for iPhone X and above */
@supports (padding: max(0px)) {
  .fixed.bottom-0 {
    padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
  }
}

/* Animation for notifications dropdown */
.fixed.inset-0 {
  animation: fadeIn 0.2s ease;
}

.absolute.bottom-0 {
  animation: slideUp 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>