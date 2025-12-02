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
                <h1 class="text-lg font-bold text-gray-900 dark:text-white">صرف المخزون</h1>
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
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              المخزون
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center ml-4">
              <svg class="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">إجمالي عمليات الصرف</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(totalDispatches) }}</p>
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
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">صرف هذا الشهر</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(monthlyDispatches) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center ml-4">
              <svg class="h-6 w-6 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">قيمة الصرف</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(totalValue) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Dispatch Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">إنشاء صرف جديد</h2>
          <button 
            @click="showDispatchModal = true"
            class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
          >
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            إنشاء صرف جديد
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Quick Dispatch -->
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">الصرف السريع</h3>
            <div class="space-y-3">
              <button 
                v-for="dispatch in quickDispatches"
                :key="dispatch.id"
                @click="createQuickDispatch(dispatch)"
                class="w-full text-right p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ dispatch.from }} → {{ dispatch.to }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ dispatch.items }} أصناف</p>
                  </div>
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>

          <!-- Recent Dispatches -->
          <div>
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">آخر عمليات الصرف</h3>
            <div class="space-y-3">
              <div 
                v-for="dispatch in recentDispatches"
                :key="dispatch.id"
                class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ dispatch.from }} → {{ dispatch.to }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ dispatch.date }}</p>
                  </div>
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    {{ dispatch.status }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">{{ dispatch.description }}</p>
                <p class="text-sm font-medium text-gray-900 dark:text-white mt-1">{{ formatCurrency(dispatch.value) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dispatch History -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">سجل عمليات الصرف</h2>
            <div class="flex space-x-3 space-x-reverse">
              <div class="relative">
                <input 
                  type="date" 
                  v-model="dateFilter"
                  class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
              </div>
              <button 
                @click="refreshData"
                class="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                تحديث
              </button>
              <button 
                v-if="canExport"
                @click="exportDispatches"
                class="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                تصدير
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-700 dark:text-gray-300">جاري تحميل البيانات...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="dispatches.length === 0" class="p-8 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">لا توجد عمليات صرف</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">
            لم يتم العثور على أي عمليات صرف
          </p>
          <button 
            @click="showDispatchModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            إنشاء أول صرف
          </button>
        </div>

        <!-- Table Content -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  رقم الصرف
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  التاريخ
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  من مخزن
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  إلى
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  عدد الأصناف
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  القيمة
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              <tr v-for="dispatch in filteredDispatches" :key="dispatch.id" class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  #{{ dispatch.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(dispatch.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ getWarehouseLabel(dispatch.from_warehouse) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ getDestinationLabel(dispatch.to_destination) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ dispatch.items_count }} صنف
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(dispatch.total_value) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    @click="viewDispatchDetails(dispatch)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 ml-3"
                  >
                    عرض
                  </button>
                  <button 
                    @click="printDispatch(dispatch)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 ml-3"
                  >
                    طباعة
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Dispatch Modal -->
    <DispatchModal 
      v-if="showDispatchModal"
      :show="showDispatchModal"
      @close="showDispatchModal = false"
      @saved="handleDispatchCreated"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import DispatchModal from '@/components/inventory/DispatchModal.vue';

export default {
  name: 'Dispatch',
  components: {
    DispatchModal
  },
  setup() {
    const store = useStore();
    
    const showDispatchModal = ref(false);
    const loading = ref(false);
    const dateFilter = ref('');
    
    // Mock data - replace with actual data from your store
    const dispatches = ref([]);
    const totalDispatches = ref(0);
    const monthlyDispatches = ref(0);
    const totalValue = ref(0);
    
    // Computed properties
    const userRole = computed(() => store.getters.userRole);
    const canExport = computed(() => {
      return userRole.value === 'superadmin' || userRole.value === 'company_manager';
    });
    
    const filteredDispatches = computed(() => {
      let filtered = [...dispatches.value];
      
      if (dateFilter.value) {
        filtered = filtered.filter(dispatch => {
          const dispatchDate = new Date(dispatch.created_at).toISOString().split('T')[0];
          return dispatchDate === dateFilter.value;
        });
      }
      
      return filtered;
    });
    
    // Mock data - replace with actual data
    const quickDispatches = ref([
      { id: 1, from: 'مخزن شارع الشيخ', to: 'صرف الي مصنع البران', items: 10 },
      { id: 2, from: 'مخزن الترعه', to: 'صرف الي مخزن الزهراء', items: 5 },
      { id: 3, from: 'مخزن موقف شبين', to: 'صرف الي مصنع البران', items: 8 }
    ]);
    
    const recentDispatches = ref([
      { 
        id: 1, 
        from: 'مخزن شارع الشيخ', 
        to: 'صرف الي مصنع البران',
        date: '2024-01-15',
        status: 'مكتمل',
        description: 'صرف 10 كراتين عطر فلورا',
        value: 15000
      },
      { 
        id: 2, 
        from: 'مخزن الترعه', 
        to: 'صرف الي مخزن الزهراء',
        date: '2024-01-14',
        status: 'مكتمل',
        description: 'صرف 5 كراتين عطر نايت',
        value: 8000
      }
    ]);
    
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
    
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
    
    const getWarehouseLabel = (warehouseId) => {
      return store.getters.getWarehouseLabel(warehouseId) || warehouseId;
    };
    
    const getDestinationLabel = (destinationId) => {
      return store.getters.getDestinationLabel(destinationId) || destinationId;
    };
    
    const createQuickDispatch = (dispatch) => {
      console.log('Create quick dispatch:', dispatch);
      showDispatchModal.value = true;
    };
    
    const viewDispatchDetails = (dispatch) => {
      console.log('View dispatch details:', dispatch);
    };
    
    const printDispatch = (dispatch) => {
      console.log('Print dispatch:', dispatch);
      // Implement print functionality
    };
    
    const refreshData = () => {
      loading.value = true;
      // Simulate API call
      setTimeout(() => {
        // Mock data - replace with actual API call
        dispatches.value = [
          {
            id: 1,
            created_at: '2024-01-15T10:30:00',
            from_warehouse: 'main_warehouse',
            to_destination: 'factory',
            items_count: 10,
            total_value: 15000
          },
          {
            id: 2,
            created_at: '2024-01-14T14:20:00',
            from_warehouse: 'tera_warehouse',
            to_destination: 'zahra',
            items_count: 5,
            total_value: 8000
          },
          {
            id: 3,
            created_at: '2024-01-13T09:15:00',
            from_warehouse: 'shobeen_warehouse',
            to_destination: 'factory',
            items_count: 8,
            total_value: 12000
          }
        ];
        
        totalDispatches.value = dispatches.value.length;
        monthlyDispatches.value = 3;
        totalValue.value = dispatches.value.reduce((sum, d) => sum + (d.total_value || 0), 0);
        
        loading.value = false;
      }, 1000);
    };
    
    const exportDispatches = () => {
      alert('ميزة تصدير الصرف قريباً...');
    };
    
    const handleDispatchCreated = () => {
      showDispatchModal.value = false;
      alert('تم إنشاء الصرف بنجاح');
      refreshData();
    };
    
    onMounted(() => {
      refreshData();
    });
    
    // Watch date filter changes
    watch(dateFilter, () => {
      // Filter dispatches when date changes
    });
    
    return {
      // State
      showDispatchModal,
      loading,
      dateFilter,
      dispatches,
      totalDispatches,
      monthlyDispatches,
      totalValue,
      quickDispatches,
      recentDispatches,
      
      // Computed
      filteredDispatches,
      canExport,
      
      // Methods
      formatNumber,
      formatCurrency,
      formatDate,
      getWarehouseLabel,
      getDestinationLabel,
      createQuickDispatch,
      viewDispatchDetails,
      printDispatch,
      refreshData,
      exportDispatches,
      handleDispatchCreated
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