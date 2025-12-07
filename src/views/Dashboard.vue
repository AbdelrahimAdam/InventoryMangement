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
          <button @click="refreshData" class="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm flex items-center">
            <svg :class="{'animate-spin': loading}" class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            تحديث البيانات
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
          <router-link to="/transactions" class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700">عرض الكل</router-link>
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
            <div v-for="transaction in recentTransactions.slice(0, 6)" :key="transaction.id" 
                 class="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
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
          <div v-for="warehouse in warehouseStats" :key="warehouse.id" class="space-y-2">
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
      <button v-if="canModifyItems" @click="openAddItemModal" 
              class="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center">
        <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        إضافة صنف جديد
      </button>
      
      <button @click="exportReport"
              class="bg-gradient-to-r from-green-600 to-emerald-500 text-white font-medium py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center">
        <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        تصدير تقرير
      </button>
      
      <button @click="printDashboard"
              class="bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center">
        <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
        </svg>
        طباعة اللوحة
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Dashboard',
  
  setup() {
    const store = useStore();
    const router = useRouter();
    
    // State
    const loading = ref(false);
    
    // Computed properties
    const userProfile = computed(() => store.state.userProfile);
    const userRole = computed(() => store.getters.userRole);
    const userName = computed(() => store.getters.userName);
    const dashboardStats = computed(() => store.getters.dashboardStats);
    const recentTransactions = computed(() => store.state.recentTransactions);
    const recentTransactionsLoading = computed(() => store.state.recentTransactionsLoading);
    const inventory = computed(() => store.state.inventory || []);
    const accessibleWarehouses = computed(() => store.getters.accessibleWarehouses || []);
    
    const canModifyItems = computed(() => store.getters.canEdit);
    const canDispatch = computed(() => store.getters.canDispatch);
    const canManageUsers = computed(() => store.getters.canManageUsers);
    const canViewReports = computed(() => {
      const role = store.getters.userRole;
      return ['superadmin', 'company_manager'].includes(role);
    });
    
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
    
    // Mock transaction stats
    const todayTransactions = computed(() => {
      return recentTransactions.value.filter(t => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const transactionDate = t.timestamp?.toDate ? t.timestamp.toDate() : new Date(t.timestamp);
        return transactionDate >= today;
      }).length;
    });
    
    const thisWeekTransactions = computed(() => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return recentTransactions.value.filter(t => {
        const transactionDate = t.timestamp?.toDate ? t.timestamp.toDate() : new Date(t.timestamp);
        return transactionDate >= weekAgo;
      }).length;
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
    
    const lowStockNotifications = computed(() => {
      const lowStockItems = inventory.value.filter(item => 
        (item.remaining_quantity || 0) < 10 && (item.remaining_quantity || 0) > 0
      ).slice(0, 5);
      
      return lowStockItems.map(item => ({
        id: item.id,
        message: `الصنف ${item.name || item.code} منخفض المخزون (${item.remaining_quantity} وحدة)`
      }));
    });
    
    // Methods
    const refreshData = async () => {
      loading.value = true;
      try {
        await store.dispatch('getRecentTransactions');
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
    
    const exportReport = () => {
      console.log('Export report');
    };
    
    const printDashboard = () => {
      window.print();
    };
    
    const formatNumber = (num) => {
      return new Intl.NumberFormat('ar-EG').format(num);
    };
    
    const formatDateTime = (date) => {
      if (!date) return '';
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleString('ar-EG', {
        dateStyle: 'short',
        timeStyle: 'short'
      });
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
    
    const getUserInitials = (name) => {
      if (!name) return '??';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };
    
    // Lifecycle
    onMounted(() => {
      // Load initial data
      refreshData();
    });
    
    return {
      // State
      loading,
      
      // Computed
      userProfile,
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
      notificationCount,
      getUserRoleName,
      todayTransactions,
      thisWeekTransactions,
      warehouseStats,
      lowStockNotifications,
      
      // Methods
      refreshData,
      openAddItemModal,
      openTransferModal,
      openDispatchModal,
      exportReport,
      printDashboard,
      formatNumber,
      formatDateTime,
      getTransactionColor,
      getTransactionLabel,
      getUserInitials
    };
  }
};
</script>

<style scoped>
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
}
</style>