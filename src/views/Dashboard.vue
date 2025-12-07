<template>
  <div>
    <!-- Welcome Banner -->
    <div class="mb-8">
      <div class="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-xl p-8">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-3xl font-bold text-white mb-2">مرحباً، {{ userName }} 👋</h2>
            <p class="text-blue-100 opacity-90">هذه نظرة عامة على أداء نظام المخزون</p>
            <div class="mt-4 flex items-center space-x-6 rtl:space-x-reverse">
              <div class="flex items-center text-blue-100">
                <svg class="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm">النظام يعمل بشكل طبيعي</span>
              </div>
              <div class="flex items-center text-blue-100">
                <svg class="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm">{{ accessibleWarehouses.length }} مخازن نشطة</span>
              </div>
            </div>
          </div>
          <button 
            @click="refreshData" 
            :disabled="loading"
            :class="{'opacity-50 cursor-not-allowed': loading}"
            class="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm flex items-center"
          >
            <svg :class="{'animate-spin': loading}" class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {{ loading ? 'جاري التحديث...' : 'تحديث البيانات' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Grid - 4 Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Items Card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <span class="text-sm font-medium text-green-600 dark:text-green-400">+12%</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ formatNumber(dashboardStats.totalItems) }}</h3>
        <p class="text-gray-600 dark:text-gray-400">إجمالي الأصناف</p>
      </div>

      <!-- Total Quantity Card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <span class="text-sm font-medium text-green-600 dark:text-green-400">+8%</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ formatNumber(dashboardStats.totalQuantity) }}</h3>
        <p class="text-gray-600 dark:text-gray-400">إجمالي الكمية</p>
      </div>

      <!-- Low Stock Card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <span class="text-sm font-medium text-orange-600 dark:text-orange-400">+3</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ formatNumber(dashboardStats.lowStockItems) }}</h3>
        <p class="text-gray-600 dark:text-gray-400">أصناف منخفضة</p>
      </div>

      <!-- Recent Activity Card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <span class="text-sm font-medium text-green-600 dark:text-green-400">+15%</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ formatNumber(dashboardStats.recentTransactions) }}</h3>
        <p class="text-gray-600 dark:text-gray-400">الحركات اليوم</p>
      </div>
    </div>

    <!-- Charts and Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Transactions -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">آخر الحركات</h3>
          <div 
            @click="navigateTo('/transactions')"
            class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 cursor-pointer hover:underline"
          >
            عرض الكل
          </div>
        </div>
        <div class="space-y-4">
          <div v-if="recentTransactionsLoading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">جاري تحميل الحركات...</p>
          </div>
          <div v-else-if="recentTransactions.length === 0" class="text-center py-8">
            <svg class="h-12 w-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">لا توجد حركات حديثة</p>
          </div>
          <div v-else class="space-y-4">
            <div 
              v-for="transaction in recentTransactions.slice(0, 6)" 
              :key="transaction.id" 
              class="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer"
              @click="viewTransaction(transaction)"
            >
              <div :class="getTransactionColor(transaction.type)" class="h-12 w-12 rounded-xl flex items-center justify-center mr-4">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-gray-900 dark:text-white">{{ getTransactionLabel(transaction.type) }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ formatDateTime(transaction.timestamp) }}</p>
              </div>
              <div class="text-right">
                <p class="font-medium text-gray-900 dark:text-white">{{ transaction.quantity || 0 }} وحدة</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ transaction.item_code || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Warehouse Distribution -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">توزيع المخزون</h3>
        <div class="space-y-4">
          <div 
            v-for="warehouse in warehouseStats" 
            :key="warehouse.id" 
            class="space-y-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 rounded-lg transition-colors"
            @click="navigateToWarehouse(warehouse.id)"
          >
            <div class="flex justify-between text-sm">
              <span class="font-medium text-gray-900 dark:text-white">{{ warehouse.name }}</span>
              <span class="text-gray-600 dark:text-gray-400">{{ warehouse.items }} أصناف</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="h-2 rounded-full" :style="{ width: warehouse.percentage + '%', backgroundColor: warehouse.color }"></div>
            </div>
            <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{{ formatNumber(warehouse.quantity) }} وحدة</span>
              <span>{{ warehouse.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions Row -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <button 
        v-if="canModifyItems" 
        @click="navigateTo('/inventory/add')"
        @touchstart="handleTouch($event, () => navigateTo('/inventory/add'))"
        class="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center cursor-pointer touch-target"
        :class="{'opacity-50 cursor-not-allowed': !canModifyItems}"
        :disabled="!canModifyItems"
      >
        <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        إضافة صنف جديد
      </button>

      <button 
        @click="navigateTo('/reports')"
        @touchstart="handleTouch($event, () => navigateTo('/reports'))"
        v-if="canViewReports"
        class="bg-gradient-to-r from-green-600 to-emerald-500 text-white font-medium py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center cursor-pointer touch-target"
        :class="{'opacity-50 cursor-not-allowed': !canViewReports}"
        :disabled="!canViewReports"
      >
        <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        عرض التقارير
      </button>

      <button 
        v-else
        @click="exportReport"
        @touchstart="handleTouch($event, exportReport)"
        class="bg-gradient-to-r from-green-600 to-emerald-500 text-white font-medium py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center cursor-pointer touch-target"
      >
        <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        تصدير تقرير
      </button>

      <button 
        @click="navigateTo('/transfers')"
        @touchstart="handleTouch($event, () => navigateTo('/transfers'))"
        v-if="canModifyItems"
        class="bg-gradient-to-r from-purple-600 to-violet-500 text-white font-medium py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center cursor-pointer touch-target"
        :class="{'opacity-50 cursor-not-allowed': !canModifyItems}"
        :disabled="!canModifyItems"
      >
        <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
        </svg>
        نقل المخزون
      </button>

      <button 
        @click="navigateTo('/dispatch')"
        @touchstart="handleTouch($event, () => navigateTo('/dispatch'))"
        v-else-if="canDispatch"
        class="bg-gradient-to-r from-orange-600 to-amber-500 text-white font-medium py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center cursor-pointer touch-target"
        :class="{'opacity-50 cursor-not-allowed': !canDispatch}"
        :disabled="!canDispatch"
      >
        <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m6 4l4-4m0 0l4 4m-4-4v12"/>
        </svg>
        صرف خارجي
      </button>

      <button 
        @click="printDashboard"
        @touchstart="handleTouch($event, printDashboard)"
        v-else
        class="bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center cursor-pointer touch-target"
      >
        <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
        </svg>
        طباعة اللوحة
      </button>
    </div>

    <!-- Additional Actions -->
    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <button 
        @click="navigateTo('/inventory')"
        @touchstart="handleTouch($event, () => navigateTo('/inventory'))"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-medium py-3 rounded-xl shadow hover:shadow-md transition-all flex items-center justify-center cursor-pointer touch-target"
      >
        <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
        </svg>
        عرض المخزون
      </button>

      <button 
        @click="navigateTo('/users')"
        @touchstart="handleTouch($event, () => navigateTo('/users'))"
        v-if="canManageUsers"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-medium py-3 rounded-xl shadow hover:shadow-md transition-all flex items-center justify-center cursor-pointer touch-target"
        :class="{'opacity-50 cursor-not-allowed': !canManageUsers}"
        :disabled="!canManageUsers"
      >
        <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-6.197a6 6 0 00-9-5.197M9 10h.01"/>
        </svg>
        إدارة المستخدمين
      </button>

      <button 
        @click="navigateTo('/warehouses')"
        @touchstart="handleTouch($event, () => navigateTo('/warehouses'))"
        v-if="canManageUsers"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-medium py-3 rounded-xl shadow hover:shadow-md transition-all flex items-center justify-center cursor-pointer touch-target"
        :class="{'opacity-50 cursor-not-allowed': !canManageUsers}"
        :disabled="!canManageUsers"
      >
        <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
        إدارة المخازن
      </button>

      <button 
        @click="navigateTo('/profile')"
        @touchstart="handleTouch($event, () => navigateTo('/profile'))"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-medium py-3 rounded-xl shadow hover:shadow-md transition-all flex items-center justify-center cursor-pointer touch-target"
      >
        <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
        الملف الشخصي
      </button>
    </div>

    <!-- Toast for navigation errors -->
    <div v-if="navigationError" class="fixed bottom-4 right-4 left-4 md:right-auto md:left-1/2 md:-translate-x-1/2 md:w-96 z-50">
      <div class="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between animate-slide-down">
        <span class="flex-1">{{ navigationError }}</span>
        <button @click="navigationError = ''" class="ml-4">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';

export default {
  name: 'Dashboard',
  
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    
    // State
    const loading = ref(false);
    const navigationError = ref('');
    
    // Computed properties
    const userRole = computed(() => store.getters.userRole);
    const userName = computed(() => store.getters.userName);
    const dashboardStats = computed(() => store.getters.dashboardStats || {
      totalItems: 0,
      totalQuantity: 0,
      lowStockItems: 0,
      recentTransactions: 0
    });
    const recentTransactions = computed(() => store.state.recentTransactions || []);
    const recentTransactionsLoading = computed(() => store.state.recentTransactionsLoading || false);
    const inventory = computed(() => store.state.inventory || []);
    const accessibleWarehouses = computed(() => store.getters.accessibleWarehouses || []);
    
    const canModifyItems = computed(() => store.getters.canEdit || false);
    const canDispatch = computed(() => store.getters.canDispatch || false);
    const canManageUsers = computed(() => store.getters.canManageUsers || false);
    const canViewReports = computed(() => {
      const role = store.getters.userRole;
      return ['superadmin', 'company_manager'].includes(role);
    });
    
    // Warehouse stats for chart
    const warehouseStats = computed(() => {
      const warehouses = accessibleWarehouses.value.slice(0, 4);
      const colors = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'];
      
      return warehouses.map((warehouse, index) => {
        const warehouseItems = inventory.value.filter(item => item.warehouse_id === warehouse.id);
        const totalItems = inventory.value.length;
        
        return {
          id: warehouse.id,
          name: warehouse.name_ar || warehouse.name,
          items: warehouseItems.length,
          quantity: warehouseItems.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0),
          percentage: totalItems > 0 ? Math.round((warehouseItems.length / totalItems) * 100) : 0,
          color: colors[index] || '#6b7280'
        };
      });
    });
    
    // Methods
    const handleTouch = (event, handler) => {
      event.preventDefault();
      event.stopPropagation();
      
      // Add visual feedback
      const target = event.currentTarget;
      target.classList.add('active-touch');
      setTimeout(() => {
        target.classList.remove('active-touch');
      }, 200);
      
      if (typeof handler === 'function') {
        handler();
      }
    };
    
    const navigateTo = async (path) => {
      try {
        console.log('Navigating to:', path);
        
        // Check if user has permission for the route
        const canAccess = await checkRoutePermission(path);
        if (!canAccess) {
          navigationError.value = 'ليس لديك صلاحية للوصول إلى هذه الصفحة';
          setTimeout(() => {
            navigationError.value = '';
          }, 3000);
          return;
        }
        
        // Navigate
        await router.push(path);
        
      } catch (error) {
        console.error('Navigation error:', error);
        
        if (error.name !== 'NavigationDuplicated') {
          navigationError.value = 'حدث خطأ في التنقل إلى الصفحة';
          setTimeout(() => {
            navigationError.value = '';
          }, 3000);
        }
      }
    };
    
    const checkRoutePermission = async (path) => {
      try {
        // Check route meta permissions
        const routeRecord = router.resolve(path).route;
        
        // No restrictions
        if (!routeRecord.meta?.allowedRoles) {
          return true;
        }
        
        // Check user role
        const userRole = store.getters.userRole;
        if (!userRole) {
          return false;
        }
        
        // Check if role is allowed
        const allowedRoles = routeRecord.meta.allowedRoles;
        if (!allowedRoles.includes(userRole)) {
          return false;
        }
        
        // Check specific permissions
        if (routeRecord.meta.permissions) {
          const permission = routeRecord.meta.permissions[userRole];
          if (permission === 'none') {
            return false;
          }
        }
        
        // Additional checks for warehouse managers
        if (userRole === 'warehouse_manager') {
          const allowedWarehouses = store.state.userProfile?.allowed_warehouses || [];
          
          if (path.includes('/inventory') && allowedWarehouses.length === 0) {
            return false;
          }
        }
        
        return true;
        
      } catch (error) {
        console.error('Permission check error:', error);
        return false;
      }
    };
    
    const refreshData = async () => {
      if (loading.value) return;
      
      loading.value = true;
      try {
        await store.dispatch('getRecentTransactions');
        
        // Show success feedback
        const event = new CustomEvent('show-toast', {
          detail: {
            message: 'تم تحديث البيانات بنجاح',
            type: 'success'
          }
        });
        window.dispatchEvent(event);
        
      } catch (error) {
        console.error('Error refreshing data:', error);
        
        const event = new CustomEvent('show-toast', {
          detail: {
            message: 'حدث خطأ في تحديث البيانات',
            type: 'error'
          }
        });
        window.dispatchEvent(event);
        
      } finally {
        loading.value = false;
      }
    };
    
    const exportReport = async () => {
      try {
        // Show loading
        const loadingEvent = new CustomEvent('show-toast', {
          detail: {
            message: 'جاري تصدير التقرير...',
            type: 'info'
          }
        });
        window.dispatchEvent(loadingEvent);
        
        // Simulate export process
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success
        const successEvent = new CustomEvent('show-toast', {
          detail: {
            message: 'تم تصدير التقرير بنجاح',
            type: 'success'
          }
        });
        window.dispatchEvent(successEvent);
        
      } catch (error) {
        console.error('Export error:', error);
        
        const errorEvent = new CustomEvent('show-toast', {
          detail: {
            message: 'حدث خطأ في تصدير التقرير',
            type: 'error'
          }
        });
        window.dispatchEvent(errorEvent);
      }
    };
    
    const printDashboard = () => {
      window.print();
    };
    
    const viewTransaction = (transaction) => {
      console.log('View transaction:', transaction);
      // Could navigate to transaction details if implemented
    };
    
    const navigateToWarehouse = (warehouseId) => {
      navigateTo(`/inventory?warehouse=${warehouseId}`);
    };
    
    const formatNumber = (num) => {
      const number = Number(num) || 0;
      return new Intl.NumberFormat('ar-EG').format(number);
    };
    
    const formatDateTime = (date) => {
      if (!date) return '';
      try {
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleString('ar-EG', {
          dateStyle: 'short',
          timeStyle: 'short'
        });
      } catch (error) {
        return '';
      }
    };
    
    const getTransactionColor = (type) => {
      const colors = {
        add: 'bg-green-500',
        transfer: 'bg-blue-500',
        dispatch: 'bg-orange-500',
        receive: 'bg-purple-500'
      };
      return colors[type] || 'bg-gray-500';
    };
    
    const getTransactionLabel = (type) => {
      const labels = {
        add: 'إضافة',
        transfer: 'نقل',
        dispatch: 'صرف',
        receive: 'استلام'
      };
      return labels[type] || type;
    };
    
    // Listen for toast events
    const handleToastEvent = (event) => {
      console.log('Toast event received:', event.detail);
      // This would show a toast if implemented
    };
    
    // Lifecycle
    onMounted(() => {
      console.log('Dashboard mounted');
      
      // Load initial data
      refreshData();
      
      // Listen for toast events
      window.addEventListener('show-toast', handleToastEvent);
    });
    
    onUnmounted(() => {
      window.removeEventListener('show-toast', handleToastEvent);
    });
    
    return {
      // State
      loading,
      navigationError,
      
      // Computed
      userRole,
      userName,
      dashboardStats,
      recentTransactions,
      recentTransactionsLoading,
      accessibleWarehouses,
      canModifyItems,
      canDispatch,
      canManageUsers,
      canViewReports,
      warehouseStats,
      
      // Methods
      handleTouch,
      navigateTo,
      refreshData,
      exportReport,
      printDashboard,
      viewTransaction,
      navigateToWarehouse,
      formatNumber,
      formatDateTime,
      getTransactionColor,
      getTransactionLabel
    };
  }
};
</script>

<style scoped>
/* Touch feedback */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.active-touch {
  transform: scale(0.98);
  opacity: 0.9;
}

/* Disabled state */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button:disabled:hover {
  transform: none !important;
  box-shadow: none !important;
}

/* Button hover effects */
button:not(:disabled):hover {
  transform: translateY(-2px);
}

/* Animation for error toast */
@keyframes slide-down {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out;
}

/* Print styles */
@media print {
  button {
    display: none !important;
  }
  
  .bg-gradient-to-r {
    background: white !important;
    color: black !important;
  }
  
  .dark\:bg-gray-800 {
    background: white !important;
  }
  
  .text-white {
    color: black !important;
  }
  
  .dark\:text-white {
    color: black !important;
  }
  
  .shadow-lg, .shadow-xl {
    box-shadow: none !important;
  }
  
  .rounded-2xl {
    border-radius: 0 !important;
    border: 1px solid #e5e7eb !important;
  }
  
  /* Ensure all text is black for printing */
  * {
    color: black !important;
  }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .md\:grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .lg\:grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  button {
    transition: none !important;
  }
  
  .animate-slide-down {
    animation: none !important;
  }
}
</style>