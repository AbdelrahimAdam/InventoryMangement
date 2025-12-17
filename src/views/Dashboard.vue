<template>
  <div class="space-y-4 lg:space-y-6">
    <!-- Header with Filter -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 lg:mb-6">
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">لوحة التحكم</h1>
        <p class="text-sm lg:text-base text-gray-500 dark:text-gray-400">نظرة عامة على المخزون والحركات</p>
      </div>
      
      <!-- Warehouse Filter -->
      <div class="w-full lg:w-auto">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تصفية حسب المخزن</label>
        <div class="flex gap-3">
          <select 
            v-model="selectedWarehouse"
            @change="handleWarehouseChange"
            class="w-full lg:w-64 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
          >
            <option value="all">جميع المخازن</option>
            <option 
              v-for="warehouse in warehouses" 
              :key="warehouse.id" 
              :value="warehouse.id"
            >
              {{ warehouse.name_ar || warehouse.name }}
            </option>
          </select>
          
          <button
            @click="refreshDashboard"
            :disabled="loading || statsLoading"
            class="px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="loading || statsLoading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-else>تحديث</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Overview - REAL TOTALS -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
      <!-- Total Items -->
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
              <dd class="mt-1 text-lg lg:text-2xl font-semibold text-gray-900 dark:text-white">
                {{ formatEnglishNumber(currentStats.totalItems) }}
                <span v-if="statsLoading" class="text-xs text-gray-400">(جاري التحميل...)</span>
              </dd>
              <div v-if="selectedWarehouse !== 'all'" class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {{ getCurrentWarehouseName() }}
              </div>
              <div v-else class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                مجموع {{ warehouses.length }} مخزن
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Total Quantity -->
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
              <dd class="mt-1 text-lg lg:text-2xl font-semibold text-gray-900 dark:text-white">
                {{ formatEnglishNumber(currentStats.totalQuantity) }}
                <span v-if="statsLoading" class="text-xs text-gray-400">(جاري التحميل...)</span>
              </dd>
              <div v-if="selectedWarehouse !== 'all'" class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {{ getCurrentWarehouseName() }}
              </div>
              <div v-else class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                مجموع {{ warehouses.length }} مخزن
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Low Stock Items -->
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
              <dd class="mt-1 text-lg lg:text-2xl font-semibold text-red-600 dark:text-red-400">
                {{ formatEnglishNumber(currentStats.lowStockItems) }}
                <span v-if="statsLoading" class="text-xs text-gray-400">(جاري التحميل...)</span>
              </dd>
              <div v-if="selectedWarehouse !== 'all'" class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {{ getCurrentWarehouseName() }}
              </div>
              <div v-else class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                مجموع {{ warehouses.length }} مخزن
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
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
              <dd class="mt-1 text-lg lg:text-2xl font-semibold text-gray-900 dark:text-white">
                {{ formatEnglishNumber(currentStats.recentTransactions) }}
                <span v-if="statsLoading" class="text-xs text-gray-400">(جاري التحميل...)</span>
              </dd>
              <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {{ selectedWarehouse === 'all' ? 'جميع المخازن' : getCurrentWarehouseName() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rest of your template remains the same... -->
    <!-- Keep all the existing template code for Quick Actions, Recent Inventory, and Recent Transactions -->
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Dashboard',
  setup() {
    const store = useStore();
    const router = useRouter();
    
    const loading = ref(true);
    const statsLoading = ref(false);
    const selectedWarehouse = ref('all');
    const currentStats = ref({
      totalItems: 0,
      totalQuantity: 0,
      lowStockItems: 0,
      recentTransactions: 0,
      lastUpdated: null
    });

    // Cache for performance
    const statsCache = ref({
      'all': null,
      lastCalculated: {}
    });

    // Computed properties
    const userRole = computed(() => store.getters.userRole || '');
    
    // Warehouses list
    const warehouses = computed(() => {
      try {
        return store.getters.warehouses || [];
      } catch (error) {
        console.error('Error getting warehouses:', error);
        return [];
      }
    });

    // Get ALL inventory items from Vuex store
    const allInventoryItems = computed(() => {
      try {
        const inventory = store.getters.inventoryItems;
        return Array.isArray(inventory) ? inventory : [];
      } catch (error) {
        console.error('Error getting inventory items:', error);
        return [];
      }
    });

    // Recent transactions
    const recentTransactions = computed(() => {
      try {
        const items = store.getters.recentTransactions;
        return Array.isArray(items) ? items : [];
      } catch (error) {
        console.error('Error getting recent transactions:', error);
        return [];
      }
    });

    // Permission check
    const canModifyItems = computed(() => {
      try {
        const role = userRole.value;
        const userProfile = store.state.userProfile || {};
        
        if (role === 'superadmin') return true;
        
        if (role === 'warehouse_manager') {
          const allowedWarehouses = userProfile?.allowed_warehouses || [];
          const hasWarehouses = allowedWarehouses.length > 0;
          const hasPermission = userProfile?.permissions?.includes('full_access') || 
                                userProfile?.permissions?.includes('manage_inventory') ||
                                userProfile?.permissions?.includes('add_items');
          return hasWarehouses && hasPermission;
        }
        
        return false;
      } catch (error) {
        console.error('Error checking permissions:', error);
        return false;
      }
    });

    // Recent inventory (last 5 items sorted by date)
    const recentInventory = computed(() => {
      try {
        const items = allInventoryItems.value;
        if (!Array.isArray(items) || items.length === 0) return [];
        
        return [...items]
          .filter(item => item && typeof item === 'object')
          .sort((a, b) => {
            try {
              const dateA = new Date(a.updated_at || a.created_at || 0);
              const dateB = new Date(b.updated_at || b.created_at || 0);
              return dateB - dateA;
            } catch (error) {
              return 0;
            }
          })
          .slice(0, 5);
      } catch (error) {
        console.error('Error getting recent inventory:', error);
        return [];
      }
    });

    // Filtered recent inventory based on selected warehouse
    const filteredRecentInventory = computed(() => {
      if (selectedWarehouse.value === 'all') {
        return recentInventory.value;
      }
      
      return recentInventory.value.filter(item => item.warehouse_id === selectedWarehouse.value);
    });

    // Filtered recent transactions based on selected warehouse
    const filteredRecentTransactions = computed(() => {
      if (selectedWarehouse.value === 'all') {
        return recentTransactions.value;
      }
      
      return recentTransactions.value.filter(transaction => 
        transaction.from_warehouse === selectedWarehouse.value || 
        transaction.to_warehouse === selectedWarehouse.value
      );
    });

    // ==================== STATS CALCULATION FUNCTIONS ====================

    /**
     * Calculate warehouse stats from ALL loaded inventory items
     * This uses the Vuex store data that's already loaded (no extra Firestore reads)
     */
    const calculateWarehouseStats = (warehouseId) => {
      try {
        const items = allInventoryItems.value;
        
        // Filter items for this warehouse
        const warehouseItems = warehouseId === 'all' 
          ? items 
          : items.filter(item => item.warehouse_id === warehouseId);
        
        // Calculate stats
        const totalItems = warehouseItems.length;
        const totalQuantity = warehouseItems.reduce((sum, item) => 
          sum + (item.remaining_quantity || 0), 0
        );
        const lowStockItems = warehouseItems.filter(item => 
          (item.remaining_quantity || 0) < 10
        ).length;

        // Calculate today's transactions for this warehouse
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayTransactions = recentTransactions.value.filter(transaction => {
          if (!transaction.timestamp) return false;
          
          try {
            const transDate = transaction.timestamp?.toDate ? 
              transaction.timestamp.toDate() : new Date(transaction.timestamp);
            
            const isToday = transDate >= today;
            
            // Check warehouse filter
            if (warehouseId === 'all') {
              return isToday;
            } else {
              return isToday && (
                transaction.from_warehouse === warehouseId || 
                transaction.to_warehouse === warehouseId
              );
            }
          } catch (error) {
            return false;
          }
        });

        const recentTransactionsCount = todayTransactions.length;
        
        console.log(`📊 Calculated stats for ${warehouseId === 'all' ? 'all warehouses' : 'warehouse ' + warehouseId}:`);
        console.log(`   Total Items: ${totalItems}`);
        console.log(`   Total Quantity: ${totalQuantity}`);
        console.log(`   Low Stock: ${lowStockItems}`);
        console.log(`   Today's Transactions: ${recentTransactionsCount}`);
        
        return {
          totalItems,
          totalQuantity,
          lowStockItems,
          recentTransactions: recentTransactionsCount,
          lastUpdated: new Date(),
          itemCount: warehouseItems.length
        };
      } catch (error) {
        console.error('Error calculating warehouse stats:', error);
        return getDefaultStats();
      }
    };

    /**
     * Get warehouse stats with caching
     */
    const getWarehouseStats = (warehouseId) => {
      // Check cache first (5 minute cache)
      const cacheKey = warehouseId;
      const cached = statsCache.value[cacheKey];
      const cacheExpiry = 5 * 60 * 1000; // 5 minutes
      
      if (cached && !isCacheExpired(cached.lastUpdated, cacheExpiry)) {
        console.log(`Using cached stats for ${warehouseId}`);
        return cached;
      }
      
      // Calculate fresh stats
      console.log(`Calculating fresh stats for ${warehouseId}`);
      const stats = calculateWarehouseStats(warehouseId);
      
      // Update cache
      statsCache.value[cacheKey] = stats;
      statsCache.value.lastCalculated[cacheKey] = Date.now();
      
      return stats;
    };

    // ==================== HELPER FUNCTIONS ====================

    const formatEnglishNumber = (num) => {
      if (isNaN(num) || num === null || num === undefined) return '0';
      return new Intl.NumberFormat('en-US').format(num);
    };

    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      
      try {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        
        if (diffMins < 60) {
          return `منذ ${diffMins} دقيقة`;
        } else if (diffHours < 24) {
          return `منذ ${diffHours} ساعة`;
        } else {
          return date.toLocaleDateString('ar-EG');
        }
      } catch (error) {
        return '';
      }
    };

    const formatDetailedTime = (timestamp) => {
      if (!timestamp) return '';
      
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      } catch (error) {
        return '';
      }
    };

    const formatRelativeTime = (timestamp) => {
      if (!timestamp) return '';
      
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMins < 1) {
          return 'الآن';
        } else if (diffMins < 60) {
          return `قبل ${diffMins} دقيقة`;
        } else if (diffHours < 24) {
          return `قبل ${diffHours} ساعة`;
        } else if (diffDays === 1) {
          return 'أمس';
        } else if (diffDays < 7) {
          return `قبل ${diffDays} أيام`;
        } else {
          return date.toLocaleDateString('ar-EG');
        }
      } catch (error) {
        return '';
      }
    };

    const getWarehouseLabel = (warehouseId) => {
      if (!warehouseId) return '';
      try {
        return store.getters.getWarehouseLabel(warehouseId) || warehouseId;
      } catch (error) {
        return warehouseId;
      }
    };

    const getDestinationLabel = (destinationId) => {
      if (!destinationId) return '';
      try {
        return store.getters.getDestinationLabel(destinationId) || destinationId;
      } catch (error) {
        return destinationId;
      }
    };

    const getCurrentWarehouseName = () => {
      if (selectedWarehouse.value === 'all') return 'جميع المخازن';
      const warehouse = warehouses.value.find(w => w.id === selectedWarehouse.value);
      return warehouse ? warehouse.name_ar || warehouse.name : 'مخزن غير معروف';
    };

    const getTransactionTypeLabel = (type) => {
      const labels = {
        'ADD': 'إضافة',
        'TRANSFER': 'نقل',
        'DISPATCH': 'صرف',
        'UPDATE': 'تحديث',
        'DELETE': 'حذف'
      };
      return labels[type] || type;
    };

    const getQuantityClass = (quantity) => {
      if (!quantity || quantity === 0) return 'text-red-600 dark:text-red-400';
      if (quantity < 10) return 'text-orange-600 dark:text-orange-400';
      return 'text-green-600 dark:text-green-400';
    };

    const getStatusClass = (quantity) => {
      if (!quantity || quantity === 0) return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      if (quantity < 5) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
    };

    const getStatusText = (quantity) => {
      if (!quantity || quantity === 0) return 'منتهي';
      if (quantity < 5) return 'حرج';
      return 'جيد';
    };

    const getUserRoleBadge = (userName) => {
      if (userName?.includes('admin') || userName?.includes('مشرف')) {
        return 'مشرف';
      }
      return 'مستخدم';
    };

    function getDefaultStats() {
      return {
        totalItems: 0,
        totalQuantity: 0,
        lowStockItems: 0,
        recentTransactions: 0,
        lastUpdated: null
      };
    }

    function isCacheExpired(timestamp, expiryMs = 5 * 60 * 1000) {
      if (!timestamp) return true;
      const cacheTime = new Date(timestamp).getTime();
      const now = Date.now();
      return now - cacheTime > expiryMs;
    }

    // ==================== EVENT HANDLERS ====================

    const handleWarehouseChange = async () => {
      statsLoading.value = true;
      
      try {
        // Calculate stats for selected warehouse
        const stats = getWarehouseStats(selectedWarehouse.value);
        currentStats.value = stats;
        
        console.log('Updated stats for warehouse:', selectedWarehouse.value, stats);
      } catch (error) {
        console.error('Error updating warehouse stats:', error);
        currentStats.value = getDefaultStats();
      } finally {
        statsLoading.value = false;
      }
    };

    const refreshDashboard = async () => {
      loading.value = true;
      
      try {
        // Clear cache
        statsCache.value = {
          'all': null,
          lastCalculated: {}
        };
        
        // Refresh all data
        await store.dispatch('refreshInventory');
        await store.dispatch('getRecentTransactions');
        
        // Recalculate stats
        await handleWarehouseChange();
        
        console.log('Dashboard refreshed successfully');
      } catch (error) {
        console.error('Error refreshing dashboard:', error);
      } finally {
        loading.value = false;
      }
    };

    // Load data function
    const loadDashboardData = async () => {
      loading.value = true;
      
      try {
        console.log('Loading dashboard data...');
        
        // Load warehouses if needed
        if (warehouses.value.length === 0) {
          await store.dispatch('loadWarehouses');
        }
        
        // Make sure inventory is loaded
        if (allInventoryItems.value.length === 0) {
          await store.dispatch('loadAllInventory');
        }
        
        // Load recent transactions
        await store.dispatch('getRecentTransactions');
        
        // Calculate initial stats
        await handleWarehouseChange();
        
        console.log('Dashboard data loaded successfully');
        console.log(`Total inventory items loaded: ${allInventoryItems.value.length}`);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        currentStats.value = getDefaultStats();
      } finally {
        loading.value = false;
      }
    };

    // Watch for inventory changes to recalculate stats
    watch(allInventoryItems, (newItems) => {
      if (newItems.length > 0 && !statsLoading.value) {
        console.log(`Inventory updated: ${newItems.length} items, recalculating stats...`);
        handleWarehouseChange();
      }
    }, { deep: true });

    watch(recentTransactions, (newTransactions) => {
      if (newTransactions.length > 0 && !statsLoading.value) {
        console.log(`Transactions updated: ${newTransactions.length} transactions, recalculating stats...`);
        handleWarehouseChange();
      }
    }, { deep: true });

    onMounted(async () => {
      console.log('Dashboard mounted');
      
      try {
        await loadDashboardData();
      } catch (error) {
        console.error('Error in dashboard mounted:', error);
        loading.value = false;
      }
    });

    return {
      // State
      loading,
      statsLoading,
      selectedWarehouse,
      currentStats,
      
      // Computed
      userRole,
      warehouses,
      canModifyItems,
      recentInventory,
      filteredRecentInventory,
      recentTransactions,
      filteredRecentTransactions,
      
      // Helper methods
      formatEnglishNumber,
      formatTime,
      formatDetailedTime,
      formatRelativeTime,
      getWarehouseLabel,
      getDestinationLabel,
      getTransactionTypeLabel,
      getQuantityClass,
      getStatusClass,
      getStatusText,
      getUserRoleBadge,
      getCurrentWarehouseName,
      
      // Actions
      refreshDashboard,
      handleWarehouseChange
    };
  }
};
</script>
<style scoped>
/* Custom scrollbar for dark mode */
.dark ::-webkit-scrollbar {
  width: 10px;
}

.dark ::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 5px;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Smooth transitions */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Loading spinner */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Hover effects for cards */
.hover-lift:hover {
  transform: translateY(-2px);
}

/* Gradient border for cards */
.gradient-border {
  position: relative;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(135deg, #f59e0b, #f97316) border-box;
  border: 2px solid transparent;
}

.dark .gradient-border {
  background: linear-gradient(#1f2937, #1f2937) padding-box,
              linear-gradient(135deg, #f59e0b, #f97316) border-box;
}

/* Button disabled state */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Table row hover effect */
tr {
  transition: background-color 0.15s ease-in-out;
}

/* Status badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
}

/* Type icons */
.type-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  width: 2rem;
  height: 2rem;
}

/* Responsive table cells */
@media (max-width: 768px) {
  .table-cell {
    min-width: 120px;
  }
}
</style>
