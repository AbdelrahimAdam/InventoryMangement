<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Removed Header since this is inside dashboard -->
    
    <main class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Stats Cards - Now 4 small cards side by side -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- Total Transactions Card -->
        <div class="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center ml-3 shadow-md">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">إجمالي الحركات</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ formatNumber(totalTransactions) }}</p>
            </div>
          </div>
        </div>

        <!-- Add Transactions Card -->
        <div class="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center ml-3 shadow-md">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">الإضافات</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ formatNumber(addTransactions) }}</p>
            </div>
          </div>
        </div>

        <!-- Transfer Transactions Card -->
        <div class="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center ml-3 shadow-md">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">النقل</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ formatNumber(transferTransactions) }}</p>
            </div>
          </div>
        </div>

        <!-- Dispatch Transactions Card -->
        <div class="bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-red-900/10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center ml-3 shadow-md">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">الصرف</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ formatNumber(dispatchTransactions) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Section - Modern Design -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <!-- Search Box -->
          <div class="lg:w-1/3">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <span class="inline-flex items-center">
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                بحث متقدم
              </span>
            </label>
            <div class="relative">
              <input
                type="text"
                v-model="searchTerm"
                @input="handleSearch"
                placeholder="ابحث باسم الصنف، الكود، الملاحظات..."
                class="w-full px-4 py-3 pr-12 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
              >
              <svg class="absolute right-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Date Range Filters -->
          <div class="lg:w-1/3">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <span class="inline-flex items-center">
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                نطاق التاريخ
              </span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="relative">
                <input 
                  type="date" 
                  v-model="dateFrom"
                  class="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                <label class="absolute -top-2 right-2 px-1 text-xs bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">من</label>
              </div>
              <div class="relative">
                <input 
                  type="date" 
                  v-model="dateTo"
                  class="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                <label class="absolute -top-2 right-2 px-1 text-xs bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">إلى</label>
              </div>
            </div>
          </div>

          <!-- Type Filter and Export -->
          <div class="lg:w-1/3">
            <div class="flex flex-col sm:flex-row gap-3">
              <!-- Type Filter -->
              <div class="flex-1">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <span class="inline-flex items-center">
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                    نوع الحركة
                  </span>
                </label>
                <select 
                  v-model="typeFilter"
                  @change="handleFilter"
                  class="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">جميع الأنواع</option>
                  <option value="ADD">الإضافة</option>
                  <option value="TRANSFER">النقل</option>
                  <option value="DISPATCH">الصرف</option>
                </select>
              </div>

              <!-- Export Button -->
              <div class="flex-1">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 opacity-0">تصدير</label>
                <button 
                  v-if="canExport"
                  @click="exportTransactions"
                  class="w-full h-full inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  تصدير Excel
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Filters Badges -->
        <div v-if="hasActiveFilters" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">التصفيات النشطة:</span>
            
            <span v-if="searchTerm" class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
              بحث: "{{ searchTerm }}"
              <button @click="searchTerm = ''" class="mr-1 hover:text-blue-900">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>
            </span>
            
            <span v-if="typeFilter" class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
              نوع: {{ getTypeLabel(typeFilter) }}
              <button @click="typeFilter = ''" class="mr-1 hover:text-purple-900">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>
            </span>
            
            <span v-if="dateFrom || dateTo" class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
              تاريخ: {{ formatDateRange(dateFrom, dateTo) }}
              <button @click="dateFrom = ''; dateTo = ''" class="mr-1 hover:text-yellow-900">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>
            </span>
            
            <button 
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              إعادة الضبط
            </button>
          </div>
        </div>
      </div>

      <!-- Transaction History Component -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">سجل جميع الحركات</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">عرض وتتبع جميع عمليات المخزون</p>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full font-medium">
                {{ formatNumber(filteredTransactions.length) }} حركة
              </span>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                تم التصفية: {{ filterPercentage }}%
              </div>
            </div>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-700 dark:text-gray-300 font-medium">جاري تحميل البيانات...</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">الرجاء الانتظار</p>
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

    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center shadow-2xl">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-700 dark:text-gray-300 font-medium">جاري تحميل الحركات...</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">الرجاء الانتظار</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import * as XLSX from 'xlsx';
import TransactionHistory from '@/components/transactions/TransactionHistory.vue';

export default {
  name: 'Transactions',
  components: {
    TransactionHistory
  },
  setup() {
    const store = useStore();
    
    // Refs
    const loading = ref(false);
    const searchTerm = ref('');
    const dateFrom = ref('');
    const dateTo = ref('');
    const typeFilter = ref('');
    
    // Computed properties
    const userRole = computed(() => store.getters.userRole);
    const canExport = computed(() => {
      return userRole.value === 'superadmin' || userRole.value === 'company_manager';
    });
    
    const allTransactions = computed(() => store.state.transactions || []);
    const recentTransactions = computed(() => store.state.recentTransactions || []);
    
    const filteredTransactions = computed(() => {
      let filtered = [...allTransactions.value];
      
      // Apply search filter
      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase();
        filtered = filtered.filter(transaction => 
          (transaction.item_name?.toLowerCase() || '').includes(term) ||
          (transaction.item_code?.toLowerCase() || '').includes(term) ||
          (transaction.notes?.toLowerCase() || '').includes(term) ||
          (transaction.user_name?.toLowerCase() || '').includes(term)
        );
      }
      
      // Apply type filter
      if (typeFilter.value) {
        filtered = filtered.filter(transaction => transaction.type === typeFilter.value);
      }
      
      // Apply date range filter
      if (dateFrom.value) {
        const fromDate = new Date(dateFrom.value);
        filtered = filtered.filter(transaction => {
          if (!transaction.timestamp) return false;
          try {
            const transDate = transaction.timestamp?.toDate ? transaction.timestamp.toDate() : new Date(transaction.timestamp);
            return transDate >= fromDate;
          } catch (error) {
            return false;
          }
        });
      }
      
      if (dateTo.value) {
        const toDate = new Date(dateTo.value);
        toDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(transaction => {
          if (!transaction.timestamp) return false;
          try {
            const transDate = transaction.timestamp?.toDate ? transaction.timestamp.toDate() : new Date(transaction.timestamp);
            return transDate <= toDate;
          } catch (error) {
            return false;
          }
        });
      }
      
      return filtered;
    });
    
    const totalTransactions = computed(() => allTransactions.value.length);
    const addTransactions = computed(() => allTransactions.value.filter(t => t.type === 'ADD').length);
    const transferTransactions = computed(() => allTransactions.value.filter(t => t.type === 'TRANSFER').length);
    const dispatchTransactions = computed(() => allTransactions.value.filter(t => t.type === 'DISPATCH').length);
    
    const hasActiveFilters = computed(() => {
      return searchTerm.value || typeFilter.value || dateFrom.value || dateTo.value;
    });
    
    const filterPercentage = computed(() => {
      if (allTransactions.value.length === 0) return 0;
      const percentage = Math.round((filteredTransactions.value.length / allTransactions.value.length) * 100);
      return 100 - percentage;
    });
    
    // Methods
    const formatNumber = (num) => {
      if (num === undefined || num === null) return '0';
      return new Intl.NumberFormat('ar-EG').format(num);
    };
    
    const getTypeLabel = (type) => {
      const labels = {
        'ADD': 'الإضافة',
        'TRANSFER': 'النقل',
        'DISPATCH': 'الصرف',
        'UPDATE': 'التحديث',
        'DELETE': 'الحذف'
      };
      return labels[type] || type;
    };
    
    const formatDateRange = (from, to) => {
      if (!from && !to) return '';
      if (from && to) {
        return `${formatShortDate(from)} - ${formatShortDate(to)}`;
      } else if (from) {
        return `من ${formatShortDate(from)}`;
      } else {
        return `إلى ${formatShortDate(to)}`;
      }
    };
    
    const formatShortDate = (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
    };
    
    const handleSearch = () => {
      // Search is handled by computed property
    };
    
    const handleFilter = () => {
      // Filter is handled by computed property
    };
    
    const clearFilters = () => {
      searchTerm.value = '';
      typeFilter.value = '';
      dateFrom.value = '';
      dateTo.value = '';
    };
    
    const refreshData = async () => {
      loading.value = true;
      try {
        await store.dispatch('getRecentTransactions');
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const exportTransactions = () => {
      try {
        loading.value = true;
        
        // Create workbook
        const wb = XLSX.utils.book_new();
        
        // Prepare data for export
        const exportData = filteredTransactions.value.map(transaction => ({
          'تاريخ الحركة': transaction.timestamp ? 
            (transaction.timestamp.toDate ? 
              transaction.timestamp.toDate().toLocaleDateString('ar-EG') : 
              new Date(transaction.timestamp).toLocaleDateString('ar-EG')) : '',
          'وقت الحركة': transaction.timestamp ? 
            (transaction.timestamp.toDate ? 
              transaction.timestamp.toDate().toLocaleTimeString('ar-EG') : 
              new Date(transaction.timestamp).toLocaleTimeString('ar-EG')) : '',
          'نوع الحركة': getTypeLabel(transaction.type),
          'اسم الصنف': transaction.item_name || '',
          'كود الصنف': transaction.item_code || '',
          'الكمية': transaction.total_delta || 0,
          'من المخزن': store.getters.getWarehouseLabel(transaction.from_warehouse) || '',
          'إلى المخزن': store.getters.getWarehouseLabel(transaction.to_warehouse) || '',
          'المستخدم': transaction.user_name || '',
          'ملاحظات': transaction.notes || ''
        }));
        
        // Convert to worksheet
        const ws = XLSX.utils.json_to_sheet(exportData);
        
        // Add to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'الحركات');
        
        // Generate filename
        const filename = `سجل_الحركات_${new Date().toISOString().split('T')[0]}.xlsx`;
        
        // Save file
        XLSX.writeFile(wb, filename);
        
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم تصدير ${exportData.length} حركة إلى Excel بنجاح`
        });
        
      } catch (error) {
        console.error('Error exporting transactions:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تصدير الحركات'
        });
      } finally {
        loading.value = false;
      }
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
      
      // Computed
      filteredTransactions,
      totalTransactions,
      addTransactions,
      transferTransactions,
      dispatchTransactions,
      canExport,
      hasActiveFilters,
      filterPercentage,
      
      // Methods
      formatNumber,
      getTypeLabel,
      formatDateRange,
      handleSearch,
      handleFilter,
      clearFilters,
      refreshData,
      exportTransactions
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap');

body {
  font-family: 'Cairo', sans-serif;
}

.space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 8px;
  border: 2px solid #f1f1f1;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-color: #374151;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Loading animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Card hover effects */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .mobile-stack {
    flex-direction: column !important;
  }
  
  .mobile-full {
    width: 100% !important;
  }
}
</style>
