<template>
  <!-- Mobile Navigation -->
  <div class="lg:hidden">
    <!-- Sticky Navigation Tabs - ROLE BASED -->
    <div class="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <!-- Role-based Navigation Tabs -->
      <div class="flex overflow-x-auto scrollbar-hide px-4">
        <router-link 
          v-for="nav in filteredNavLinks" 
          :key="nav.path"
          :to="nav.path" 
          class="flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200"
          :class="[
            $route.path === nav.path 
              ? 'text-yellow-600 dark:text-yellow-400 border-yellow-500' 
              : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-yellow-500 dark:hover:text-yellow-300'
          ]"
        >
          <span class="whitespace-nowrap">{{ nav.title }}</span>
        </router-link>
      </div>

      <!-- User Info and Quick Actions -->
      <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <!-- User Info -->
          <div class="flex items-center space-x-3 space-x-reverse">
            <div class="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center shadow-sm">
              <span class="text-white font-medium text-sm">
                {{ getUserInitials(userName) }}
              </span>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">{{ userName }}</p>
              <span :class="['text-xs px-2 py-0.5 rounded-full', roleBadgeClass]">
                {{ getRoleName(userRole) }}
              </span>
            </div>
          </div>

          <!-- Quick Actions Buttons - Only show if user can modify items -->
          <div class="flex items-center space-x-2 space-x-reverse">
            <button 
              v-if="canModifyItems"
              @click="openTransferModal"
              class="p-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200"
              title="نقل بين المخازن"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
            </button>

            <button 
              v-if="canModifyItems"
              @click="openDispatchModal"
              class="p-2 rounded-lg bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors duration-200"
              title="صرف إلى خارجي"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>

            <button 
              v-if="canModifyItems"
              @click="openAddItemModal"
              class="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 transition-colors duration-200"
              title="إضافة صنف جديد"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Search and Filter Row -->
      <div class="px-4 pb-3 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-2 space-x-reverse mt-3">
          <!-- Search Input -->
          <div class="flex-1 relative">
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input
              type="text"
              :value="searchTerm"
              @input="handleSearchInput"
              placeholder="ابحث عن صنف..."
              class="block w-full pr-10 pl-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <!-- Warehouse Filter - Only show if user has accessible warehouses -->
          <button 
            v-if="accessibleWarehouses.length > 0"
            @click="toggleWarehouseFilter"
            class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            :class="{'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300': showWarehouseFilter}"
            title="تصفية حسب المخزن"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </button>
        </div>

        <!-- Warehouse Filter Dropdown -->
        <div v-if="showWarehouseFilter && accessibleWarehouses.length > 0" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white">اختر المخزن</h3>
            <button 
              @click="clearWarehouseFilter"
              class="text-xs text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300"
            >
              عرض الكل
            </button>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <button 
              v-for="warehouse in accessibleWarehouses" 
              :key="warehouse.id"
              @click="selectWarehouse(warehouse.id)"
              class="p-2 text-xs rounded-lg border transition-colors duration-200 flex items-center justify-center"
              :class="{
                'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300': selectedWarehouse === warehouse.id,
                'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600': selectedWarehouse !== warehouse.id
              }"
              :title="warehouse.name_ar"
            >
              <span class="truncate">{{ getWarehouseShortName(warehouse.name_ar) }}</span>
              <span v-if="selectedWarehouse === warehouse.id" class="mr-1 h-2 w-2 rounded-full bg-yellow-500"></span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Stats Bar -->
    <div v-if="dashboardStats" class="sticky top-[208px] z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div class="flex overflow-x-auto scrollbar-hide px-4 py-2">
        <!-- Total Items -->
        <div class="flex-shrink-0 px-3 text-center border-l border-gray-200 dark:border-gray-700 first:border-l-0">
          <div class="text-xs text-gray-500 dark:text-gray-400">الأصناف</div>
          <div class="text-sm font-bold text-gray-900 dark:text-white">{{ dashboardStats.totalItems || 0 }}</div>
        </div>

        <!-- Total Quantity -->
        <div class="flex-shrink-0 px-3 text-center border-l border-gray-200 dark:border-gray-700">
          <div class="text-xs text-gray-500 dark:text-gray-400">الكمية</div>
          <div class="text-sm font-bold text-gray-900 dark:text-white">{{ formatNumber(dashboardStats.totalQuantity) || 0 }}</div>
        </div>

        <!-- Low Stock -->
        <div class="flex-shrink-0 px-3 text-center border-l border-gray-200 dark:border-gray-700">
          <div class="text-xs text-gray-500 dark:text-gray-400">قليلة</div>
          <div class="text-sm font-bold text-red-600 dark:text-red-400">{{ dashboardStats.lowStockItems || 0 }}</div>
        </div>

        <!-- Today's Transactions -->
        <div class="flex-shrink-0 px-3 text-center border-l border-gray-200 dark:border-gray-700">
          <div class="text-xs text-gray-500 dark:text-gray-400">حركات اليوم</div>
          <div class="text-sm font-bold text-gray-900 dark:text-white">{{ dashboardStats.recentTransactions || 0 }}</div>
        </div>

        <!-- Allowed Warehouses -->
        <div class="flex-shrink-0 px-3 text-center border-l border-gray-200 dark:border-gray-700">
          <div class="text-xs text-gray-500 dark:text-gray-400">المخازن</div>
          <div class="text-sm font-bold text-gray-900 dark:text-white">{{ accessibleWarehouses.length }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { debounce } from 'lodash';

export default {
  name: 'MobileNav',
  props: {
    searchTerm: {
      type: String,
      default: ''
    },
    selectedWarehouse: {
      type: String,
      default: ''
    }
  },
  emits: ['update:searchTerm', 'update:selectedWarehouse', 'openAddItemModal', 'openTransferModal', 'openDispatchModal'],
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    
    const showWarehouseFilter = ref(false);
    const localSearchTerm = ref(props.searchTerm);
    
    // Navigation links based on user role
    const defaultNavigationLinks = [
      {
        path: '/',
        title: 'لوحة التحكم',
        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
        roles: ['superadmin', 'warehouse_manager', 'company_manager'],
        show: true
      },
      {
        path: '/users',
        title: 'المستخدمين',
        icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
        roles: ['superadmin'], // Only superadmin can see users
        show: true
      },
      {
        path: '/transactions',
        title: 'الحركات',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
        roles: ['superadmin', 'warehouse_manager', 'company_manager'],
        show: true
      },
      {
        path: '/reports',
        title: 'التقارير',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        roles: ['superadmin', 'company_manager'], // Superadmin and company managers can see reports
        show: true
      }
    ];
    
    // Filter navigation links based on user role from store
    const filteredNavLinks = computed(() => {
      const userRole = store.getters.userRole;
      return defaultNavigationLinks.filter(link => {
        return link.roles.includes(userRole) && link.show;
      });
    });
    
    // Computed properties from store
    const userRole = computed(() => store.getters.userRole);
    const userName = computed(() => store.getters.userName);
    const userProfile = computed(() => store.state.userProfile);
    const dashboardStats = computed(() => store.getters.dashboardStats);
    
    // Check permissions from store
    const canModifyItems = computed(() => {
      const role = store.getters.userRole;
      if (role === 'superadmin') return true;
      if (role === 'warehouse_manager') {
        const hasWarehouses = userProfile.value?.allowed_warehouses?.length > 0;
        const hasPermission = userProfile.value?.permissions?.includes('full_access') || 
                             userProfile.value?.permissions?.includes('manage_inventory');
        return hasWarehouses && hasPermission;
      }
      return false;
    });
    
    const canManageUsers = computed(() => store.getters.canManageUsers);
    
    // Get accessible warehouses from store getter
    const accessibleWarehouses = computed(() => {
      const warehouses = store.getters.accessibleWarehouses || [];
      return warehouses.filter(w => w.type === 'primary'); // Only show primary warehouses for filtering
    });
    
    // Role badge class based on user role
    const roleBadgeClass = computed(() => {
      const classes = {
        superadmin: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
        warehouse_manager: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
        company_manager: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
      };
      return classes[userRole.value] || 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    });

    // Helper functions
    const getRoleName = (role) => {
      const names = {
        superadmin: 'المشرف العام',
        warehouse_manager: 'مدير المخازن',
        company_manager: 'مدير الشركة'
      };
      return names[role] || role;
    };

    const getUserInitials = (name) => {
      if (!name) return '?';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const formatNumber = (num) => {
      if (!num && num !== 0) return '0';
      return new Intl.NumberFormat('ar-EG').format(num);
    };

    const getWarehouseShortName = (name) => {
      if (!name) return '';
      if (name.length <= 8) return name;
      return name.substring(0, 8) + '...';
    };

    // Event handlers with debounce
    const handleSearch = debounce((value) => {
      emit('update:searchTerm', value);
    }, 300);

    const handleSearchInput = (event) => {
      localSearchTerm.value = event.target.value;
      handleSearch(event.target.value);
    };

    const toggleWarehouseFilter = () => {
      showWarehouseFilter.value = !showWarehouseFilter.value;
    };

    const selectWarehouse = (warehouseId) => {
      emit('update:selectedWarehouse', warehouseId);
    };

    const clearWarehouseFilter = () => {
      emit('update:selectedWarehouse', '');
      showWarehouseFilter.value = false;
    };

    const openAddItemModal = () => {
      emit('openAddItemModal');
    };

    const openTransferModal = () => {
      emit('openTransferModal');
    };

    const openDispatchModal = () => {
      emit('openDispatchModal');
    };

    // Watch for route changes to close warehouse filter
    watch(() => route.path, () => {
      showWarehouseFilter.value = false;
    });

    // Watch for prop changes to update local state
    watch(() => props.searchTerm, (newVal) => {
      localSearchTerm.value = newVal;
    });

    return {
      showWarehouseFilter,
      localSearchTerm,
      filteredNavLinks,
      userRole,
      userName,
      userProfile,
      dashboardStats,
      roleBadgeClass,
      canModifyItems,
      canManageUsers,
      accessibleWarehouses,
      getRoleName,
      getUserInitials,
      formatNumber,
      getWarehouseShortName,
      handleSearchInput,
      toggleWarehouseFilter,
      selectWarehouse,
      clearWarehouseFilter,
      openAddItemModal,
      openTransferModal,
      openDispatchModal
    };
  }
};
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.sticky {
  position: -webkit-sticky;
  position: sticky;
}

/* Ensure proper z-index stacking */
.z-50 {
  z-index: 50;
}

.z-40 {
  z-index: 40;
}
</style>