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
                <h1 class="text-lg font-bold text-gray-900 dark:text-white">التقارير والإحصائيات</h1>
                <p class="text-xs text-gray-500 dark:text-gray-400">نظام إدارة المخزون</p>
              </div>
            </router-link>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-3 space-x-reverse">
            <select 
              v-model="reportPeriod"
              @change="changePeriod"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="today">اليوم</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
              <option value="quarter">هذا الربع</option>
              <option value="year">هذه السنة</option>
              <option value="custom">مخصص</option>
            </select>
            
            <button 
              @click="exportReport"
              class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm"
            >
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              تصدير التقرير
            </button>
            
            <router-link 
              to="/" 
              class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              الرئيسية
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Custom Date Range (shown only when custom is selected) -->
      <div v-if="reportPeriod === 'custom'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">تحديد الفترة المخصصة</h3>
          <div class="flex space-x-3 space-x-reverse">
            <input 
              type="date" 
              v-model="customDateFrom"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
            <input 
              type="date" 
              v-model="customDateTo"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
            <button 
              @click="applyCustomDate"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              تطبيق
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center ml-4">
              <svg class="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">إجمالي الأصناف</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(summary.totalItems) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center ml-4">
              <svg class="h-6 w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">إجمالي الحركات</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(summary.totalTransactions) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center ml-4">
              <svg class="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">القيمة الإجمالية</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(summary.totalValue) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center ml-4">
              <svg class="h-6 w-6 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">أصناف قليلة</p>
              <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ formatNumber(summary.lowStockItems) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts and Detailed Reports -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Warehouse Distribution -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">توزيع المخزون حسب المخازن</h3>
            <select 
              v-model="distributionFilter"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="quantity">حسب الكمية</option>
              <option value="value">حسب القيمة</option>
              <option value="items">حسب عدد الأصناف</option>
            </select>
          </div>
          
          <div class="space-y-4">
            <div v-for="warehouse in warehouseDistribution" :key="warehouse.id" class="flex items-center">
              <div class="w-32 text-sm text-gray-600 dark:text-gray-400">{{ warehouse.name }}</div>
              <div class="flex-1 ml-4">
                <div class="relative h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    :style="{ width: warehouse.percentage + '%' }"
                    class="absolute h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  ></div>
                </div>
              </div>
              <div class="w-16 text-right text-sm font-medium text-gray-900 dark:text-white">
                {{ formatNumber(warehouse.value) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Monthly Transactions -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">الحركات الشهرية</h3>
            <select 
              v-model="monthlyFilter"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="transactions">عدد الحركات</option>
              <option value="quantity">الكمية المنقولة</option>
              <option value="value">القيمة</option>
            </select>
          </div>
          
          <div class="space-y-4">
            <div v-for="month in monthlyTransactions" :key="month.month" class="flex items-center">
              <div class="w-24 text-sm text-gray-600 dark:text-gray-400">{{ month.month }}</div>
              <div class="flex-1 ml-4">
                <div class="relative h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    :style="{ width: month.percentage + '%' }"
                    class="absolute h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  ></div>
                </div>
              </div>
              <div class="w-16 text-right text-sm font-medium text-gray-900 dark:text-white">
                {{ formatNumber(month.value) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Reports -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">التقارير التفصيلية</h3>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Inventory Report -->
            <router-link 
              to="/reports/inventory"
              class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div class="flex items-center mb-4">
                <div class="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center ml-4">
                  <svg class="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">تقرير المخزون</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">تحليل مفصل للمخزون الحالي</p>
                </div>
              </div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                عرض جميع الأصناف مع تفاصيل الكمية، القيمة، والحالة
              </p>
            </router-link>

            <!-- Transactions Report -->
            <router-link 
              to="/reports/transactions"
              class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 border border-green-100 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div class="flex items-center mb-4">
                <div class="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center ml-4">
                  <svg class="h-6 w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">تقرير الحركات</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">سجل كامل لجميع الحركات</p>
                </div>
              </div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                عرض تفصيلي لجميع عمليات الإضافة، النقل، والصرف
              </p>
            </router-link>

            <!-- Financial Report -->
            <router-link 
              to="/reports/financial"
              class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 border border-purple-100 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div class="flex items-center mb-4">
                <div class="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center ml-4">
                  <svg class="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">تقرير مالي</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">القيمة المالية وتحليل التكلفة</p>
                </div>
              </div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                تحليل القيمة المالية للمخزون والأرباح المتوقعة
              </p>
            </router-link>
          </div>
        </div>
      </div>
    </main>

    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-8 flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-700 dark:text-gray-300">جاري تحميل التقارير...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Reports',
  setup() {
    const store = useStore();
    
    const loading = ref(false);
    const reportPeriod = ref('month');
    const distributionFilter = ref('quantity');
    const monthlyFilter = ref('transactions');
    const customDateFrom = ref('');
    const customDateTo = ref('');
    
    // Summary data
    const summary = ref({
      totalItems: 0,
      totalTransactions: 0,
      totalValue: 0,
      lowStockItems: 0
    });
    
    // Mock data - replace with actual data from store
    const warehouseDistribution = ref([
      { id: 1, name: 'مخزن شارع الشيخ', value: 1560, percentage: 40 },
      { id: 2, name: 'مخزن الترعه', value: 980, percentage: 25 },
      { id: 3, name: 'مخزن موقف شبين', value: 780, percentage: 20 },
      { id: 4, name: 'مخزن هايبر التهامي', value: 590, percentage: 15 }
    ]);
    
    const monthlyTransactions = ref([
      { month: 'يناير', value: 245, percentage: 100 },
      { month: 'ديسمبر', value: 198, percentage: 80 },
      { month: 'نوفمبر', value: 167, percentage: 68 },
      { month: 'أكتوبر', value: 142, percentage: 58 }
    ]);
    
    // Computed properties
    const userRole = computed(() => store.getters.userRole);
    
    // Methods
    const formatNumber = (num) => {
      return new Intl.NumberFormat('ar-EG').format(num || 0);
    };
    
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP'
      }).format(amount || 0);
    };
    
    const changePeriod = () => {
      if (reportPeriod.value === 'custom') {
        // Show custom date inputs
        const today = new Date();
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        
        customDateFrom.value = lastMonth.toISOString().split('T')[0];
        customDateTo.value = today.toISOString().split('T')[0];
      } else {
        loadReportData();
      }
    };
    
    const applyCustomDate = () => {
      if (customDateFrom.value && customDateTo.value) {
        loadReportData();
      }
    };
    
    const loadReportData = async () => {
      loading.value = true;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - replace with actual API calls
        const inventory = store.state.inventory || [];
        const transactions = store.state.transactions || [];
        
        summary.value = {
          totalItems: inventory.length,
          totalTransactions: transactions.length,
          totalValue: inventory.reduce((sum, item) => sum + ((item.remaining_quantity || 0) * (item.price || 100)), 0),
          lowStockItems: inventory.filter(item => (item.remaining_quantity || 0) < 10).length
        };
        
        // Update warehouse distribution based on filter
        updateWarehouseDistribution();
        
        // Update monthly transactions
        updateMonthlyTransactions();
        
      } catch (error) {
        console.error('Error loading report data:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const updateWarehouseDistribution = () => {
      const inventory = store.state.inventory || [];
      const warehouses = store.state.warehouses || [];
      
      const distribution = warehouses
        .filter(w => w.type === 'primary')
        .map(warehouse => {
          const items = inventory.filter(item => item.warehouse_id === warehouse.id);
          let value = 0;
          
          if (distributionFilter.value === 'quantity') {
            value = items.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0);
          } else if (distributionFilter.value === 'value') {
            value = items.reduce((sum, item) => sum + ((item.remaining_quantity || 0) * (item.price || 100)), 0);
          } else {
            value = items.length;
          }
          
          return {
            id: warehouse.id,
            name: warehouse.name_ar,
            value: value
          };
        })
        .filter(item => item.value > 0);
      
      // Calculate percentages
      const total = distribution.reduce((sum, item) => sum + item.value, 0);
      distribution.forEach(item => {
        item.percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
      });
      
      warehouseDistribution.value = distribution;
    };
    
    const updateMonthlyTransactions = () => {
      // Mock monthly data - replace with actual calculations
      monthlyTransactions.value = [
        { month: 'يناير', value: 245, percentage: 100 },
        { month: 'ديسمبر', value: 198, percentage: 80 },
        { month: 'نوفمبر', value: 167, percentage: 68 },
        { month: 'أكتوبر', value: 142, percentage: 58 }
      ];
    };
    
    const exportReport = () => {
      alert(`تقرير ${reportPeriod.value} جاهز للتصدير...`);
    };
    
    onMounted(() => {
      loadReportData();
    });
    
    // Watch filter changes
    watch(distributionFilter, () => {
      updateWarehouseDistribution();
    });
    
    watch(monthlyFilter, () => {
      updateMonthlyTransactions();
    });
    
    return {
      // State
      loading,
      reportPeriod,
      distributionFilter,
      monthlyFilter,
      customDateFrom,
      customDateTo,
      summary,
      warehouseDistribution,
      monthlyTransactions,
      
      // Computed
      userRole,
      
      // Methods
      formatNumber,
      formatCurrency,
      changePeriod,
      applyCustomDate,
      exportReport
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