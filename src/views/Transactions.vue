<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Navigation -->
          <div class="flex items-center space-x-4 space-x-reverse">
            <router-link to="/" class="flex items-center space-x-2 space-x-reverse hover:opacity-80 transition-opacity">
              <div class="h-8 w-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">م</span>
              </div>
              <div>
                <h1 class="text-lg font-bold text-gray-900 dark:text-white">سجل الحركات</h1>
                <p class="text-xs text-gray-500 dark:text-gray-400">نظام إدارة المخزون</p>
              </div>
            </router-link>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-3 space-x-reverse">
            <router-link 
              to="/inventory" 
              class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              المخزون
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center ml-4">
              <svg class="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">إجمالي الحركات</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(totalTransactions) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center ml-4">
              <svg class="h-6 w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">الإضافات</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(addTransactions) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center ml-4">
              <svg class="h-6 w-6 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">النقل</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(transferTransactions) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center ml-4">
              <svg class="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">الصرف</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(dispatchTransactions) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex-1">
            <div class="relative">
              <input
                type="text"
                v-model="searchTerm"
                @input="handleSearch"
                placeholder="ابحث باسم الصنف، الكود، أو الملاحظات..."
                class="w-full pr-12 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="flex space-x-3 space-x-reverse">
            <!-- Date Range -->
            <div class="flex space-x-2 space-x-reverse">
              <input 
                type="date" 
                v-model="dateFrom"
                class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="من تاريخ"
              >
              <input 
                type="date" 
                v-model="dateTo"
                class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="إلى تاريخ"
              >
            </div>

            <!-- Type Filter -->
            <select 
              v-model="typeFilter"
              @change="handleFilter"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع الأنواع</option>
              <option value="ADD">الإضافة</option>
              <option value="TRANSFER">النقل</option>
              <option value="DISPATCH">الصرف</option>
            </select>

            <!-- Export Button -->
            <button 
              v-if="canExport"
              @click="exportTransactions"
              class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm"
            >
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              تصدير
            </button>
          </div>
        </div>
      </div>

      <!-- Transaction History Component -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">سجل جميع الحركات</h2>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatNumber(filteredTransactions.length) }} حركة
            </div>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-700 dark:text-gray-300">جاري تحميل البيانات...</p>
        </div>

        <!-- Transaction History Component -->
        <TransactionHistory 
          v-else
          :transactions="filteredTransactions"
          :loading="false"
          :can-export="canExport"
          @refresh="refreshData"
        />
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import TransactionHistory from '@/components/transactions/TransactionHistory.vue';

export default {
  name: 'Transactions',
  components: {
    TransactionHistory
  },
  setup() {
    const store = useStore();
    
    const loading = ref(false);
    const searchTerm = ref('');
    const dateFrom = ref('');
    const dateTo = ref('');
    const typeFilter = ref('');
    
    // Mock data - replace with actual data from store
    const transactions = ref([]);
    
    // Computed properties
    const userRole = computed(() => store.getters.userRole);
    const canExport = computed(() => {
      return userRole.value === 'superadmin' || userRole.value === 'company_manager';
    });
    
    const filteredTransactions = computed(() => {
      let filtered = [...transactions.value];
      
      // Apply search filter
      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase();
        filtered = filtered.filter(transaction => 
          transaction.item_name?.toLowerCase().includes(term) ||
          transaction.item_code?.toLowerCase().includes(term) ||
          transaction.notes?.toLowerCase().includes(term) ||
          transaction.user_name?.toLowerCase().includes(term)
        );
      }
      
      // Apply type filter
      if (typeFilter.value) {
        filtered = filtered.filter(transaction => transaction.type === typeFilter.value);
      }
      
      // Apply date range filter
      if (dateFrom.value) {
        const fromDate = new Date(dateFrom.value);
        filtered = filtered.filter(transaction => 
          new Date(transaction.timestamp) >= fromDate
        );
      }
      
      if (dateTo.value) {
        const toDate = new Date(dateTo.value);
        toDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(transaction => 
          new Date(transaction.timestamp) <= toDate
        );
      }
      
      return filtered;
    });
    
    const totalTransactions = computed(() => transactions.value.length);
    const addTransactions = computed(() => transactions.value.filter(t => t.type === 'ADD').length);
    const transferTransactions = computed(() => transactions.value.filter(t => t.type === 'TRANSFER').length);
    const dispatchTransactions = computed(() => transactions.value.filter(t => t.type === 'DISPATCH').length);
    
    // Methods
    const formatNumber = (num) => {
      return new Intl.NumberFormat('ar-EG').format(num || 0);
    };
    
    const handleSearch = () => {
      // Search is handled by computed property
    };
    
    const handleFilter = () => {
      // Filter is handled by computed property
    };
    
    const refreshData = async () => {
      loading.value = true;
      try {
        // Use store action to get recent transactions
        const recentTransactions = await store.dispatch('getRecentTransactions', 100);
        transactions.value = recentTransactions || [];
      } catch (error) {
        console.error('Error loading transactions:', error);
        // Fallback to mock data
        transactions.value = getMockTransactions();
      } finally {
        loading.value = false;
      }
    };
    
    const exportTransactions = () => {
      alert('ميزة تصدير الحركات قريباً...');
    };
    
    // Mock data function
    const getMockTransactions = () => {
      return [
        {
          id: '1',
          type: 'ADD',
          item_name: 'عطر فلورا',
          item_code: 'PERF-001',
          timestamp: new Date('2024-01-15T10:30:00'),
          user_name: 'مدير المخازن',
          notes: 'إضافة 5 كراتين',
          from_warehouse: null,
          to_warehouse: 'مخزن شارع الشيخ',
          quantity: 60
        },
        {
          id: '2',
          type: 'TRANSFER',
          item_name: 'عطر نايت',
          item_code: 'PERF-002',
          timestamp: new Date('2024-01-14T14:20:00'),
          user_name: 'مدير المخازن',
          notes: 'نقل 3 كراتين',
          from_warehouse: 'مخزن شارع الشيخ',
          to_warehouse: 'مخزن الترعه',
          quantity: 36
        },
        {
          id: '3',
          type: 'DISPATCH',
          item_name: 'عطر فلورا',
          item_code: 'PERF-001',
          timestamp: new Date('2024-01-13T09:15:00'),
          user_name: 'مدير المخازن',
          notes: 'صرف إلى مصنع البران',
          from_warehouse: 'مخزن الترعه',
          to_warehouse: 'صرف الي مصنع البران',
          quantity: 24
        }
      ];
    };
    
    onMounted(() => {
      refreshData();
    });
    
    return {
      // State
      loading,
      searchTerm,
      dateFrom,
      dateTo,
      typeFilter,
      transactions,
      
      // Computed
      filteredTransactions,
      totalTransactions,
      addTransactions,
      transferTransactions,
      dispatchTransactions,
      canExport,
      
      // Methods
      formatNumber,
      handleSearch,
      handleFilter,
      refreshData,
      exportTransactions
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Cairo', sans-serif;
}

.space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}
</style>