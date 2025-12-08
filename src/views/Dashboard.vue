<template>
  <div class="space-y-4 lg:space-y-6">
    <!-- Stats Overview -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-200 hover:shadow-md">
        <div class="px-3 py-4 lg:px-4 lg:py-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
              <svg class="h-5 w-5 lg:h-6 lg:w-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div class="mr-3 lg:mr-4">
              <dt class="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">إجمالي الأصناف</dt>
              <dd class="mt-1 text-lg lg:text-2xl font-semibold text-gray-900 dark:text-white">{{ dashboardStats.totalItems }}</dd>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-200 hover:shadow-md">
        <div class="px-3 py-4 lg:px-4 lg:py-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <svg class="h-5 w-5 lg:h-6 lg:w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="mr-3 lg:mr-4">
              <dt class="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">إجمالي الكمية</dt>
              <dd class="mt-1 text-lg lg:text-2xl font-semibold text-gray-900 dark:text-white">{{ formatNumber(dashboardStats.totalQuantity) }}</dd>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-200 hover:shadow-md">
        <div class="px-3 py-4 lg:px-4 lg:py-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <svg class="h-5 w-5 lg:h-6 lg:w-6 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="mr-3 lg:mr-4">
              <dt class="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">أصناف قليلة</dt>
              <dd class="mt-1 text-lg lg:text-2xl font-semibold text-red-600 dark:text-red-400">{{ dashboardStats.lowStockItems }}</dd>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-200 hover:shadow-md">
        <div class="px-3 py-4 lg:px-4 lg:py-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <svg class="h-5 w-5 lg:h-6 lg:w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div class="mr-3 lg:mr-4">
              <dt class="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">الحركات اليوم</dt>
              <dd class="mt-1 text-lg lg:text-2xl font-semibold text-gray-900 dark:text-white">{{ dashboardStats.recentTransactions }}</dd>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter Bar -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 lg:mb-6">
        <div>
          <h2 class="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">المخزون الحالي</h2>
          <p class="text-xs lg:text-sm text-gray-500 dark:text-gray-400">عرض جميع الأصناف في النظام</p>
        </div>

        <div class="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
          <!-- Search Input -->
          <div class="relative flex-grow">
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input
              type="text"
              v-model="searchTerm"
              @input="handleSearch"
              placeholder="ابحث عن صنف..."
              class="block w-full pr-10 pl-3 py-2 text-sm lg:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
            />
          </div>

          <!-- Filter by Warehouse -->
          <select
            v-model="selectedWarehouse"
            @change="handleWarehouseChange"
            class="block w-full lg:w-auto pl-3 pr-10 py-2 text-sm lg:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
            :disabled="loading || accessibleWarehouses.length === 0"
          >
            <option value="">جميع المخازن</option>
            <option v-for="warehouse in accessibleWarehouses" :key="warehouse.id" :value="warehouse.id">
              {{ warehouse.name_ar }}
            </option>
          </select>

          <!-- Add Item Button -->
          <button 
            v-if="canModifyItems"
            @click="openAddItemModal"
            class="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm lg:text-base"
          >
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span class="hidden lg:inline">إضافة صنف</span>
            <span class="lg:hidden">إضافة</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">جاري تحميل البيانات...</p>
      </div>

      <!-- Integrated InventoryTable Component -->
      <div v-else-if="transformedInventory.length > 0" class="overflow-x-auto">
        <InventoryTable 
          :items="transformedInventory"
          :readonly="!canModifyItems"
          :user-role="userRole"
          @transfer="openTransferModalForItem"
          @dispatch="openDispatchModalForItem"
        />
      </div>

      <!-- Pagination Info -->
      <div v-if="transformedInventory.length > 0" class="mt-4 text-xs lg:text-sm text-gray-700 dark:text-gray-400">
        عرض {{ transformedInventory.length }} من {{ inventory.length }} صنف
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading" class="text-center py-8 lg:py-12">
        <svg class="mx-auto h-10 w-10 lg:h-12 lg:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">لا توجد بيانات</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">لم يتم إضافة أي أصناف بعد.</p>
        <button 
          v-if="canModifyItems" 
          @click="openAddItemModal" 
          class="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors duration-200 shadow-md text-sm lg:text-base"
        >
          إضافة صنف جديد
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { debounce } from 'lodash';

// Import inventory components
import AddItemModal from '@/components/inventory/AddItemModal.vue';
import TransferModal from '@/components/inventory/TransferModal.vue';
import DispatchModal from '@/components/inventory/DispatchModal.vue';
import InventoryTable from '@/components/inventory/InventoryTable.vue';

export default {
  name: 'Dashboard',
  components: {
    AddItemModal,
    TransferModal,
    DispatchModal,
    InventoryTable
  },
  setup() {
    const store = useStore();
    
    const selectedWarehouse = ref('');
    const searchTerm = ref('');
    const loading = ref(true);
    
    // Modal states
    const showAddItemModal = ref(false);
    const showTransferModal = ref(false);
    const showDispatchModal = ref(false);
    const selectedItemForAction = ref(null);

    // Computed properties
    const userRole = computed(() => store.getters.userRole);
    const dashboardStats = computed(() => store.getters.dashboardStats);
    const inventory = computed(() => store.state.inventory || []);
    
    // Permission getters
    const canModifyItems = computed(() => {
      const role = store.getters.userRole;
      const profile = store.state.userProfile;
      
      // Superadmin always has permission
      if (role === 'superadmin') return true;
      
      // Warehouse manager has permission if they have allowed warehouses
      if (role === 'warehouse_manager') {
        const hasWarehouses = profile?.allowed_warehouses?.length > 0;
        const hasPermission = profile?.permissions?.includes('full_access') || 
                              profile?.permissions?.includes('manage_inventory');
        return hasWarehouses && hasPermission;
      }
      
      return false;
    });
    
    const accessibleWarehouses = computed(() => {
      return store.state.warehouses || [];
    });

    // Filtered inventory based on search and warehouse selection
    const filteredInventory = computed(() => {
      let filtered = [...inventory.value];
      
      // Apply warehouse filter
      if (selectedWarehouse.value) {
        filtered = filtered.filter(item => 
          (item.warehouse_id || item.المخزن_id) === selectedWarehouse.value
        );
      }
      
      // Apply search filter
      if (searchTerm.value.trim()) {
        const term = searchTerm.value.toLowerCase().trim();
        filtered = filtered.filter(item => {
          const name = (item.name || item.الاسم || '').toLowerCase();
          const code = (item.code || item.الكود || '').toLowerCase();
          const color = (item.color || item.اللون || '').toLowerCase();
          const supplier = (item.supplier || item.المورد || '').toLowerCase();
          
          return name.includes(term) || 
                 code.includes(term) || 
                 color.includes(term) ||
                 supplier.includes(term);
        });
      }
      
      return filtered;
    });

    // Transform inventory data to match InventoryTable component structure
    const transformedInventory = computed(() => {
      return filteredInventory.value.map(item => ({
        id: item.id,
        name: item.name || item.الاسم || 'غير محدد',
        code: item.code || item.الكود || '-',
        color: item.color || item.اللون || '-',
        warehouse_id: item.warehouse_id || item.المخزن_id,
        supplier: item.supplier || item.المورد || '-',
        item_location: item.item_location || item.مكان_الصنف || '-',
        cartons_count: item.cartons_count || item.كراتين || 0,
        per_carton_count: item.per_carton_count || item.في_الكرتونة || 0,
        single_bottles_count: item.single_bottles_count || item.فردي || 0,
        total_added: item.total_added || item.المضاف || 0,
        remaining_quantity: item.remaining_quantity || item.الكميه_المتبقيه || 0,
        updated_at: item.updated_at || item.آخر_تحديث || new Date()
      }));
    });

    // Helper functions
    const formatNumber = (num) => {
      return new Intl.NumberFormat('ar-EG').format(num);
    };

    // Search handler with debounce
    const handleSearch = debounce(() => {
      // Search is handled in computed property
    }, 300);

    const handleWarehouseChange = () => {
      // Warehouse change is handled in computed property
    };

    // Modal handlers
    const openAddItemModal = () => {
      if (!canModifyItems.value) {
        alert('ليس لديك صلاحية لإضافة أصناف. يرجى التواصل مع المشرف العام.');
        return;
      }
      showAddItemModal.value = true;
    };

    const openTransferModal = () => {
      if (!canModifyItems.value) {
        alert('ليس لديك صلاحية لنقل الأصناف. يرجى التواصل مع المشرف العام.');
        return;
      }
      showTransferModal.value = true;
    };

    const openDispatchModal = () => {
      if (!canModifyItems.value) {
        alert('ليس لديك صلاحية لصرف الأصناف. يرجى التواصل مع المشرف العام.');
        return;
      }
      showDispatchModal.value = true;
    };

    const openTransferModalForItem = (item) => {
      selectedItemForAction.value = item;
      showTransferModal.value = true;
    };

    const openDispatchModalForItem = (item) => {
      selectedItemForAction.value = item;
      showDispatchModal.value = true;
    };

    const handleItemAdded = () => {
      showAddItemModal.value = false;
      // Inventory will update automatically via subscription
    };

    const handleTransferSuccess = () => {
      showTransferModal.value = false;
      selectedItemForAction.value = null;
      // Inventory will update automatically via subscription
    };

    const handleDispatchSuccess = () => {
      showDispatchModal.value = false;
      selectedItemForAction.value = null;
      // Inventory will update automatically via subscription
    };

    onMounted(() => {
      // Set default warehouse if accessible warehouses exist
      if (accessibleWarehouses.value.length > 0) {
        const mainWarehouse = store.getters.mainWarehouse;
        selectedWarehouse.value = mainWarehouse?.id || accessibleWarehouses.value[0].id;
      }
      
      // Subscribe to real-time data
      store.dispatch('subscribeToInventory');
      store.dispatch('subscribeToTransactions');
      
      // Set loading to false after a short delay
      setTimeout(() => {
        loading.value = false;
      }, 1000);
    });

    return {
      selectedWarehouse,
      searchTerm,
      loading,
      showAddItemModal,
      showTransferModal,
      showDispatchModal,
      selectedItemForAction,
      userRole,
      dashboardStats,
      inventory,
      filteredInventory,
      transformedInventory,
      canModifyItems,
      accessibleWarehouses,
      formatNumber,
      handleSearch,
      handleWarehouseChange,
      openAddItemModal,
      openTransferModal,
      openDispatchModal,
      openTransferModalForItem,
      openDispatchModalForItem,
      handleItemAdded,
      handleTransferSuccess,
      handleDispatchSuccess
    };
  }
};
</script>
