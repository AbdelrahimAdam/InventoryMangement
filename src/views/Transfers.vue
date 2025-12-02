<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
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
                <h1 class="text-lg font-bold text-gray-900 dark:text-white">نقل المخزون</h1>
                <p class="text-xs text-gray-500 dark:text-gray-400">نظام المخزون</p>
              </div>
            </router-link>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-3 space-x-reverse">
            <button 
              @click="showTransferModal = true"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
              نقل جديد
            </button>
            
            <router-link 
              to="/inventory" 
              class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              المخزون
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center ml-4">
              <svg class="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">إجمالي النقل</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalTransfers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center ml-4">
              <svg class="h-6 w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">مكتمل</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.completed }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center ml-4">
              <svg class="h-6 w-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">قيد الانتظار</p>
              <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ stats.pending }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center ml-4">
              <svg class="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">إجمالي القيمة</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(stats.totalValue) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">تصفية النتائج</h2>
            <div class="flex flex-wrap gap-4">
              <div class="relative">
                <input 
                  type="date" 
                  v-model="filters.dateFrom"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                <label class="absolute -top-2 right-2 px-1 text-xs bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  من تاريخ
                </label>
              </div>
              
              <div class="relative">
                <input 
                  type="date" 
                  v-model="filters.dateTo"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                <label class="absolute -top-2 right-2 px-1 text-xs bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  إلى تاريخ
                </label>
              </div>
              
              <select v-model="filters.status" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">جميع الحالات</option>
                <option value="pending">قيد الانتظار</option>
                <option value="approved">مقبول</option>
                <option value="completed">مكتمل</option>
                <option value="rejected">مرفوض</option>
              </select>
              
              <select v-model="filters.sourceWarehouse" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">المخزن المصدر</option>
                <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
                  {{ warehouse.name_ar }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="flex gap-3">
            <button @click="refreshData" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
            
            <button @click="exportData" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
              <svg class="w-5 h-5 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              تصدير
            </button>
          </div>
        </div>
      </div>

      <!-- Transfers Table -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">سجل النقل</h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  رقم النقل
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  التاريخ
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  من مخزن
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  إلى مخزن
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  عدد الأصناف
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الحالة
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              <tr v-for="transfer in paginatedTransfers" :key="transfer.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  #{{ transfer.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(transfer.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ getWarehouseName(transfer.source_warehouse_id) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ getWarehouseName(transfer.destination_warehouse_id) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ transfer.items_count }} صنف
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(transfer.status)">
                    {{ getStatusText(transfer.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    @click="viewTransferDetails(transfer)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 ml-3"
                  >
                    عرض
                  </button>
                  <button 
                    v-if="canApprove(transfer)"
                    @click="approveTransfer(transfer)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 ml-3"
                  >
                    قبول
                  </button>
                  <button 
                    v-if="canReject(transfer)"
                    @click="rejectTransfer(transfer)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-3"
                  >
                    رفض
                  </button>
                </td>
              </tr>
              
              <tr v-if="transfers.length === 0 && !loading">
                <td colspan="7" class="px-6 py-12 text-center">
                  <div class="text-gray-500 dark:text-gray-400">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                    </svg>
                    <p class="mt-2">لا توجد عمليات نقل</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            عرض <span class="font-medium">{{ startIndex + 1 }}</span> إلى 
            <span class="font-medium">{{ Math.min(endIndex, totalTransfers) }}</span> من 
            <span class="font-medium">{{ totalTransfers }}</span> نتيجة
          </div>
          
          <div class="flex space-x-2 space-x-reverse">
            <button 
              @click="prevPage" 
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              السابق
            </button>
            
            <div class="flex space-x-1 space-x-reverse">
              <button 
                v-for="page in visiblePages" 
                :key="page"
                @click="goToPage(page)"
                class="w-8 h-8 rounded-lg flex items-center justify-center"
                :class="page === currentPage 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              التالي
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Transfer Modal -->
    <TransferModal 
      v-if="showTransferModal"
      :show="showTransferModal"
      @close="showTransferModal = false"
      @saved="handleTransferCreated"
    />
    
    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-8 flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-700 dark:text-gray-300">جاري تحميل البيانات...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import TransferModal from '@/components/inventory/TransferModal.vue';

export default {
  name: 'Transfers',
  components: {
    TransferModal
  },
  setup() {
    const store = useStore();
    
    const loading = ref(false);
    const showTransferModal = ref(false);
    
    // Pagination
    const currentPage = ref(1);
    const itemsPerPage = 10;
    
    // Filters
    const filters = ref({
      dateFrom: '',
      dateTo: '',
      status: '',
      sourceWarehouse: '',
      destinationWarehouse: '',
      search: ''
    });
    
    // Stats
    const stats = ref({
      totalTransfers: 0,
      completed: 0,
      pending: 0,
      totalValue: 0
    });
    
    // Data
    const warehouses = ref([]);
    const transfers = ref([]);
    
    // Computed properties
    const user = computed(() => store.state.user);
    const userRole = computed(() => user.value?.role);
    
    const filteredTransfers = computed(() => {
      let filtered = [...transfers.value];
      
      if (filters.value.dateFrom) {
        const dateFrom = new Date(filters.value.dateFrom);
        filtered = filtered.filter(transfer => 
          new Date(transfer.created_at) >= dateFrom
        );
      }
      
      if (filters.value.dateTo) {
        const dateTo = new Date(filters.value.dateTo);
        dateTo.setHours(23, 59, 59, 999);
        filtered = filtered.filter(transfer => 
          new Date(transfer.created_at) <= dateTo
        );
      }
      
      if (filters.value.status) {
        filtered = filtered.filter(transfer => transfer.status === filters.value.status);
      }
      
      if (filters.value.sourceWarehouse) {
        filtered = filtered.filter(transfer => 
          transfer.source_warehouse_id === filters.value.sourceWarehouse
        );
      }
      
      if (filters.value.destinationWarehouse) {
        filtered = filtered.filter(transfer => 
          transfer.destination_warehouse_id === filters.value.destinationWarehouse
        );
      }
      
      return filtered;
    });
    
    const totalTransfers = computed(() => filteredTransfers.value.length);
    const totalPages = computed(() => Math.ceil(totalTransfers.value / itemsPerPage));
    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
    const endIndex = computed(() => startIndex.value + itemsPerPage);
    const paginatedTransfers = computed(() => 
      filteredTransfers.value.slice(startIndex.value, endIndex.value)
    );
    
    const visiblePages = computed(() => {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
      let end = Math.min(totalPages.value, start + maxVisible - 1);
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    });
    
    // Methods
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
    
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP'
      }).format(amount);
    };
    
    const getWarehouseName = (warehouseId) => {
      const warehouse = warehouses.value.find(w => w.id === warehouseId);
      return warehouse ? warehouse.name_ar : 'غير معروف';
    };
    
    const getStatusText = (status) => {
      const statusMap = {
        pending: 'قيد الانتظار',
        approved: 'مقبول',
        completed: 'مكتمل',
        rejected: 'مرفوض'
      };
      return statusMap[status] || status;
    };
    
    const getStatusBadgeClass = (status) => {
      const classes = {
        pending: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        approved: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        completed: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        rejected: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      };
      return classes[status] || 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    };
    
    const canApprove = (transfer) => {
      return userRole.value === 'superadmin' && transfer.status === 'pending';
    };
    
    const canReject = (transfer) => {
      return userRole.value === 'superadmin' && transfer.status === 'pending';
    };
    
    const loadData = async () => {
      loading.value = true;
      try {
        // Load warehouses
        const warehousesData = await store.dispatch('fetchWarehouses');
        warehouses.value = warehousesData;
        
        // Load transfers
        const transfersData = await store.dispatch('fetchTransfers');
        transfers.value = transfersData;
        
        // Calculate stats
        calculateStats();
        
      } catch (error) {
        console.error('Error loading data:', error);
        showError('خطأ في تحميل البيانات');
      } finally {
        loading.value = false;
      }
    };
    
    const calculateStats = () => {
      stats.value.totalTransfers = transfers.value.length;
      stats.value.completed = transfers.value.filter(t => t.status === 'completed').length;
      stats.value.pending = transfers.value.filter(t => t.status === 'pending').length;
      stats.value.totalValue = transfers.value.reduce((sum, transfer) => sum + transfer.total_value, 0);
    };
    
    const refreshData = () => {
      currentPage.value = 1;
      loadData();
    };
    
    const exportData = () => {
      // Implement export functionality
      console.log('Export data');
    };
    
    const viewTransferDetails = (transfer) => {
      // Navigate to transfer details
      console.log('View transfer details:', transfer);
    };
    
    const approveTransfer = async (transfer) => {
      if (!confirm('هل أنت متأكد من قبول هذا النقل؟')) return;
      
      try {
        await store.dispatch('approveTransfer', transfer.id);
        showSuccess('تم قبول النقل بنجاح');
        loadData();
      } catch (error) {
        showError('خطأ في قبول النقل');
      }
    };
    
    const rejectTransfer = async (transfer) => {
      if (!confirm('هل أنت متأكد من رفض هذا النقل؟')) return;
      
      try {
        await store.dispatch('rejectTransfer', transfer.id);
        showSuccess('تم رفض النقل بنجاح');
        loadData();
      } catch (error) {
        showError('خطأ في رفض النقل');
      }
    };
    
    const handleTransferCreated = () => {
      showTransferModal.value = false;
      showSuccess('تم إنشاء النقل بنجاح');
      loadData();
    };
    
    const showSuccess = (message) => {
      // Implement success notification
      alert(message);
    };
    
    const showError = (message) => {
      // Implement error notification
      alert(message);
    };
    
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };
    
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };
    
    const goToPage = (page) => {
      currentPage.value = page;
    };
    
    // Watch filters for changes
    watch(filters, () => {
      currentPage.value = 1;
    }, { deep: true });
    
    // Lifecycle
    onMounted(() => {
      loadData();
    });
    
    return {
      // State
      loading,
      showTransferModal,
      filters,
      stats,
      warehouses,
      transfers,
      currentPage,
      
      // Computed
      paginatedTransfers,
      totalTransfers,
      totalPages,
      startIndex,
      endIndex,
      visiblePages,
      
      // Methods
      formatDate,
      formatCurrency,
      getWarehouseName,
      getStatusText,
      getStatusBadgeClass,
      canApprove,
      canReject,
      refreshData,
      exportData,
      viewTransferDetails,
      approveTransfer,
      rejectTransfer,
      handleTransferCreated,
      prevPage,
      nextPage,
      goToPage
    };
  }
};
</script>