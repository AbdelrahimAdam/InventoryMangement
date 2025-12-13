<template>
  <!-- Your template remains exactly the same as your original -->
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- ... all your template code ... -->
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import * as XLSX from 'xlsx';

export default {
  name: 'DispatchPage',
  setup() {
    const store = useStore();
    
    // State
    const loading = ref(false);
    const showDispatchModal = ref(false);
    const selectedWarehouse = ref('');
    const selectedItemForDispatch = ref(null);
    const historyWarehouseFilter = ref('');
    const dateFilter = ref('all');
    const customDateFrom = ref('');
    const customDateTo = ref('');
    const currentHistoryPage = ref(1);
    const itemsPerPage = ref(20);
    
    // Computed properties from store
    const userRole = computed(() => store.getters.userRole);
    const userName = computed(() => store.getters.userName);
    const userProfile = computed(() => store.state.userProfile);
    const allInventory = computed(() => store.state.inventory || []);
    const allTransactions = computed(() => store.state.transactions || []);
    const allWarehouses = computed(() => store.state.warehouses || []);
    
    // Permissions
    const canDispatch = computed(() => store.getters.canDispatch);
    const canExport = computed(() => userRole.value === 'superadmin' || userRole.value === 'company_manager');
    
    // Dispatch from warehouses
    const dispatchFromWarehouses = computed(() => {
      if (userRole.value === 'superadmin') {
        return allWarehouses.value.filter(w => w.type === 'primary');
      }
      
      if (userRole.value === 'warehouse_manager') {
        const allowedWarehouses = userProfile.value?.allowed_warehouses || [];
        if (allowedWarehouses.includes('all')) {
          return allWarehouses.value.filter(w => w.type === 'primary');
        }
        return allWarehouses.value.filter(w => 
          w.type === 'primary' && allowedWarehouses.includes(w.id)
        );
      }
      
      return [];
    });
    
    // Dispatch destinations
    const dispatchDestinations = computed(() => {
      return allWarehouses.value.filter(w => w.type === 'dispatch');
    });
    
    // Filter dispatch transactions
    const dispatchTransactions = computed(() => {
      return (allTransactions.value || []).filter(t => t.type === 'DISPATCH');
    });
    
    // Stats
    const totalDispatches = computed(() => dispatchTransactions.value.length);
    
    const monthlyDispatches = computed(() => {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      return dispatchTransactions.value.filter(t => {
        try {
          const dispatchDate = t.timestamp?.toDate ? t.timestamp.toDate() : new Date(t.timestamp);
          return dispatchDate >= oneMonthAgo;
        } catch (error) {
          return false;
        }
      }).length;
    });
    
    const totalDispatchValue = computed(() => {
      return dispatchTransactions.value.reduce((total, dispatch) => {
        return total + calculateDispatchValue(dispatch);
      }, 0);
    });
    
    // Available items in selected warehouse
    const availableItems = computed(() => {
      if (!selectedWarehouse.value) return [];
      return allInventory.value.filter(item => 
        item.warehouse_id === selectedWarehouse.value && 
        item.remaining_quantity > 0
      );
    });
    
    // Filter dispatch history
    const filteredDispatchHistory = computed(() => {
      let filtered = [...dispatchTransactions.value];
      
      if (historyWarehouseFilter.value) {
        filtered = filtered.filter(d => d.from_warehouse === historyWarehouseFilter.value);
      }
      
      if (dateFilter.value !== 'all') {
        const now = new Date();
        let startDate;
        
        switch (dateFilter.value) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'custom':
            if (customDateFrom.value && customDateTo.value) {
              const start = new Date(customDateFrom.value);
              const end = new Date(customDateTo.value);
              end.setHours(23, 59, 59, 999);
              
              return filtered.filter(d => {
                try {
                  const dispatchDate = d.timestamp?.toDate ? d.timestamp.toDate() : new Date(d.timestamp);
                  return dispatchDate >= start && dispatchDate <= end;
                } catch (error) {
                  return false;
                }
              });
            }
            break;
        }
        
        if (startDate) {
          filtered = filtered.filter(d => {
            try {
              const dispatchDate = d.timestamp?.toDate ? d.timestamp.toDate() : new Date(d.timestamp);
              return dispatchDate >= startDate;
            } catch (error) {
              return false;
            }
          });
        }
      }
      
      filtered.sort((a, b) => {
        try {
          const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
          const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
          return dateB - dateA;
        } catch (error) {
          return 0;
        }
      });
      
      return filtered;
    });
    
    // Pagination
    const totalHistoryPages = computed(() => Math.ceil(filteredDispatchHistory.value.length / itemsPerPage.value));
    const startIndex = computed(() => (currentHistoryPage.value - 1) * itemsPerPage.value);
    const endIndex = computed(() => startIndex.value + itemsPerPage.value);
    const paginatedHistory = computed(() => filteredDispatchHistory.value.slice(startIndex.value, endIndex.value));
    
    // Check if any filters are active
    const hasFilters = computed(() => historyWarehouseFilter.value || dateFilter.value !== 'all');
    
    // Helper functions
    const formatNumber = (num) => {
      if (num === undefined || num === null) return '0';
      return new Intl.NumberFormat('ar-EG').format(num);
    };
    
    const formatCurrency = (amount) => {
      if (amount === undefined || amount === null) return '0 ج.م';
      return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };
    
    const formatDate = (timestamp) => {
      if (!timestamp) return '-';
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      } catch (error) {
        return '-';
      }
    };
    
    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return '';
      }
    };
    
    const formatDateTime = (timestamp) => {
      if (!timestamp) return '-';
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString('ar-EG', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return '-';
      }
    };
    
    const getWarehouseLabel = (warehouseId) => {
      if (!warehouseId) return '';
      const warehouse = allWarehouses.value.find(w => w.id === warehouseId);
      return warehouse ? warehouse.name_ar : warehouseId;
    };
    
    const getDestinationLabel = (destinationId) => {
      if (!destinationId) return '';
      const destination = allWarehouses.value.find(w => w.id === destinationId);
      return destination ? destination.name_ar : destinationId;
    };
    
    const getUsername = (userId) => {
      if (!userId) return 'مستخدم النظام';
      return 'مستخدم النظام';
    };
    
    const calculateDispatchValue = (dispatch) => {
      const quantity = Math.abs(dispatch.total_delta || 0);
      const pricePerItem = 50;
      return quantity * pricePerItem;
    };
    
    const getDispatchQuantityClass = (quantity) => {
      const qty = Math.abs(quantity || 0);
      if (qty < 10) return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300';
      if (qty < 50) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300';
      return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300';
    };
    
    // Actions
    const selectItemForDispatch = (item) => {
      selectedItemForDispatch.value = item;
      showDispatchModal.value = true;
    };
    
    const updateAvailableItems = () => {
      selectedItemForDispatch.value = null;
    };
    
    const applyHistoryFilters = () => {
      currentHistoryPage.value = 1;
    };
    
    const nextPage = () => {
      if (currentHistoryPage.value < totalHistoryPages.value) {
        currentHistoryPage.value++;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    const prevPage = () => {
      if (currentHistoryPage.value > 1) {
        currentHistoryPage.value--;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    const viewDispatchDetails = (dispatch) => {
      alert(`تفاصيل الصرف:\n\nالصنف: ${dispatch.item_name}\nالكمية: ${Math.abs(dispatch.total_delta)}\nمن: ${getWarehouseLabel(dispatch.from_warehouse)}\nإلى: ${getDestinationLabel(dispatch.to_warehouse)}\nالتاريخ: ${formatDateTime(dispatch.timestamp)}`);
    };
    
    const printDispatch = (dispatch) => {
      const printWindow = window.open('', '_blank');
      const printContent = `
        <html dir="rtl">
        <head>
          <title>طباعة صرف ${dispatch.item_name}</title>
          <style>
            body { font-family: 'Cairo', sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .details { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .details th, .details td { padding: 10px; border: 1px solid #ddd; text-align: right; }
            .details th { background-color: #f5f5f5; font-weight: bold; }
            .signature { margin-top: 50px; text-align: left; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">سند صرف</div>
            <div>نظام إدارة المخزون</div>
          </div>
          
          <table class="details">
            <tr><th>رقم العملية</th><td>${dispatch.id || 'N/A'}</td></tr>
            <tr><th>اسم الصنف</th><td>${dispatch.item_name}</td></tr>
            <tr><th>كود الصنف</th><td>${dispatch.item_code}</td></tr>
            <tr><th>الكمية</th><td>${Math.abs(dispatch.total_delta)} وحدة</td></tr>
            <tr><th>من مخزن</th><td>${getWarehouseLabel(dispatch.from_warehouse)}</td></tr>
            <tr><th>إلى</th><td>${getDestinationLabel(dispatch.to_warehouse)}</td></tr>
            <tr><th>تاريخ الصرف</th><td>${formatDateTime(dispatch.timestamp)}</td></tr>
            <tr><th>القيمة</th><td>${formatCurrency(calculateDispatchValue(dispatch))}</td></tr>
            <tr><th>تم بواسطة</th><td>${getUsername(dispatch.user_id)}</td></tr>
          </table>
          
          <div class="signature">
            <p>التوقيع: _______________</p>
            <p>الختم: _______________</p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 1000);
            }
          </script>
        </body>
        </html>
      `;
      
      printWindow.document.write(printContent);
      printWindow.document.close();
    };
    
    const exportDispatches = async () => {
      try {
        loading.value = true;
        
        const exportData = filteredDispatchHistory.value.map(dispatch => ({
          'رقم العملية': dispatch.id || '',
          'التاريخ': formatDate(dispatch.timestamp),
          'الوقت': formatTime(dispatch.timestamp),
          'اسم الصنف': dispatch.item_name || '',
          'كود الصنف': dispatch.item_code || '',
          'الكمية': Math.abs(dispatch.total_delta || 0),
          'من مخزن': getWarehouseLabel(dispatch.from_warehouse),
          'إلى': getDestinationLabel(dispatch.to_warehouse),
          'القيمة': calculateDispatchValue(dispatch),
          'تم بواسطة': getUsername(dispatch.user_id),
          'ملاحظات': dispatch.notes || ''
        }));
        
        if (exportData.length === 0) {
          store.dispatch('showNotification', {
            type: 'warning',
            message: 'لا توجد بيانات للتصدير'
          });
          return;
        }
        
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);
        
        const wscols = [
          { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 25 }, { wch: 15 },
          { wch: 10 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 30 }
        ];
        ws['!cols'] = wscols;
        
        XLSX.utils.book_append_sheet(wb, ws, 'عمليات الصرف');
        const filename = `عمليات_الصرف_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, filename);
        
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم تصدير ${exportData.length} عملية صرف بنجاح`
        });
        
      } catch (error) {
        console.error('Error exporting dispatches:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تصدير البيانات'
        });
      } finally {
        loading.value = false;
      }
    };
    
    const handleDispatchSuccess = () => {
      showDispatchModal.value = false;
      selectedItemForDispatch.value = null;
      
      store.dispatch('showNotification', {
        type: 'success',
        message: 'تم إنشاء عملية الصرف بنجاح'
      });
      
      setTimeout(() => {
        currentHistoryPage.value = 1;
      }, 1000);
    };
    
    const loadInitialData = async () => {
      loading.value = true;
      try {
        console.log('Dispatch page: Loading initial data...');
        
        if (allInventory.value.length === 0 || allTransactions.value.length === 0) {
          console.log('Waiting for store data to load...');
          setTimeout(() => {
            loading.value = false;
          }, 2000);
        } else {
          loading.value = false;
        }
        
        if (dispatchFromWarehouses.value.length === 1) {
          selectedWarehouse.value = dispatchFromWarehouses.value[0].id;
        }
        
      } catch (error) {
        console.error('Error loading dispatch data:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تحميل بيانات الصرف'
        });
        loading.value = false;
      }
    };
    
    onMounted(() => {
      console.log('Dispatch page mounted');
      
      if (!canDispatch.value) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية للوصول إلى صفحة الصرف'
        });
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
        return;
      }
      
      loadInitialData();
    });
    
    watch(() => [allInventory.value, allTransactions.value], () => {
      console.log('Store data updated, refreshing dispatch view');
    }, { deep: true });
    
    return {
      // State
      loading,
      showDispatchModal,
      selectedWarehouse,
      selectedItemForDispatch,
      historyWarehouseFilter,
      dateFilter,
      customDateFrom,
      customDateTo,
      currentHistoryPage,
      
      // Computed
      userRole,
      userName,
      canDispatch,
      canExport,
      dispatchFromWarehouses,
      dispatchDestinations,
      availableItems,
      totalDispatches,
      monthlyDispatches,
      totalDispatchValue,
      filteredDispatchHistory: paginatedHistory,
      totalHistoryPages,
      startIndex,
      endIndex,
      hasFilters,
      
      // Methods
      formatNumber,
      formatCurrency,
      formatDate,
      formatTime,
      getWarehouseLabel,
      getDestinationLabel,
      getDispatchQuantityClass,
      selectItemForDispatch,
      updateAvailableItems,
      applyHistoryFilters,
      nextPage,
      prevPage,
      viewDispatchDetails,
      printDispatch,
      exportDispatches,
      handleDispatchSuccess
    };
  }
};
</script>

<style scoped>
/* Your styles remain exactly the same as your original */
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Cairo', sans-serif;
}

.space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
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

/* Print styles */
@media print {
  header, 
  .bg-gray-50,
  button,
  select,
  input {
    display: none !important;
  }
  
  .bg-white {
    background-color: white !important;
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  
  th {
    background-color: #f5f5f5;
  }
}

/* Enhanced hover effects */
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Fix for RTL direction */
[dir="rtl"] {
  text-align: right;
}

/* Ensure proper spacing for RTL */
.ml-2 {
  margin-left: 0.5rem;
}

.ml-4 {
  margin-left: 1rem;
}

.ml-3 {
  margin-left: 0.75rem;
}

.mr-auto {
  margin-right: auto;
}

/* Responsive improvements */
@media (max-width: 768px) {
  .grid-cols-1 {
    grid-template-columns: 1fr;
  }
  
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  
  .px-6 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .py-4 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
}

/* Improve touch targets on mobile */
@media (max-width: 640px) {
  button, 
  select, 
  input {
    min-height: 44px;
  }
  
  .text-sm {
    font-size: 14px;
  }
  
  .text-xs {
    font-size: 12px;
  }
}

/* Dark mode improvements */
.dark .text-gray-900 {
  color: #f9fafb;
}

.dark .text-gray-700 {
  color: #d1d5db;
}

.dark .text-gray-500 {
  color: #9ca3af;
}

.dark .border-gray-700 {
  border-color: #4b5563;
}

.dark .bg-gray-800 {
  background-color: #1f2937;
}

.dark .bg-gray-900 {
  background-color: #111827;
}
</style>
