<template>
  <!-- Only the InventoryTable component taking full space -->
  <InventoryTable />
</template>

<script>
import { ref, computed, onMounted, watch, reactive, onUnmounted, nextTick } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { debounce } from 'lodash';
import AddItemModal from '@/components/inventory/AddItemModal.vue';
import DispatchModal from '@/components/inventory/DispatchModal.vue';
import EditItemModal from '@/components/inventory/EditItemModal.vue';
import TransferModal from '@/components/inventory/TransferModal.vue';

// Local storage cache for offline/one-time data
const LOCAL_STORAGE_KEYS = {
  INVENTORY: 'inventory_cache',
  WAREHOUSES: 'warehouses_cache',
  LAST_REFRESH: 'last_refresh_timestamp',
  CACHE_VERSION: 'cache_version_2.0'
};

// Performance monitoring class
class PerformanceMonitor {
  constructor() {
    this.startTime = performance.now();
    this.memorySnapshots = [];
  }

  start() {
    this.startTime = performance.now();
  }

  end() {
    return performance.now() - this.startTime;
  }

  getMemoryUsage() {
    if (window.performance && window.performance.memory) {
      return Math.round(window.performance.memory.usedJSHeapSize / 1048576); // MB
    }
    return 0;
  }
}

export default {
  name: 'Dashboard',
  components: {
    AddItemModal,
    DispatchModal,
    EditItemModal,
    TransferModal
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const performanceMonitor = new PerformanceMonitor();
    
    // State - simplified since we're only managing the InventoryTable
    const loading = ref(false);
    const error = ref('');
    const showAddModal = ref(false);
    const showEditModal = ref(false);
    const showTransferModal = ref(false);
    const showDispatchModal = ref(false);
    const showDetailsModal = ref(false);
    const showDeleteConfirm = ref(false);
    const searchTerm = ref('');
    const statusFilter = ref('');
    const selectedWarehouse = ref('');
    const selectedItemForEdit = ref(null);
    const selectedItemForTransfer = ref(null);
    const selectedItemForDispatch = ref(null);
    const selectedItem = ref(null);
    const itemToDelete = ref(null);
    const deleteLoading = ref(false);
    const imageLoaded = reactive({});
    const searchTimeout = ref(null);
    const exporting = ref(false);
    const currentPage = ref(1);
    const itemsPerPage = ref(30);
    const lastRefreshTime = ref(null);
    const isCachedData = ref(false);
    const performanceStats = ref(null);
    const hoveredRow = ref(null);
    const userNamesCache = reactive({});
    const firestoreUnsubscribes = reactive([]);
    const individualListeners = reactive({});
    
    // Computed properties
    const userRole = computed(() => store.getters.userRole);
    const userProfile = computed(() => store.state.userProfile);
    const inventory = computed(() => store.state.inventory || []);
    const accessibleWarehouses = computed(() => store.getters.accessibleWarehouses || []);
    const allWarehouses = computed(() => store.state.warehouses || []);
    const currentUser = computed(() => store.state.user);
    
    // Current user info
    const currentUserInfo = computed(() => {
      if (userProfile.value?.name) {
        return userProfile.value.name;
      }
      
      if (currentUser.value?.displayName) {
        return currentUser.value.displayName;
      }
      
      if (userProfile.value?.email) {
        return userProfile.value.email.split('@')[0];
      }
      
      if (currentUser.value?.email) {
        return currentUser.value.email.split('@')[0];
      }
      
      return 'مستخدم النظام';
    });
    
    // Permissions
    const canAddItem = computed(() => {
      return userRole.value === 'superadmin' || 
             (userRole.value === 'warehouse_manager' && userProfile.value?.allowed_warehouses?.length > 0);
    });
    
    const canEdit = computed(() => {
      return userRole.value === 'superadmin' || userRole.value === 'warehouse_manager';
    });
    
    const canExport = computed(() => {
      return userRole.value === 'superadmin' || userRole.value === 'company_manager';
    });
    
    const showActions = computed(() => {
      return userRole.value !== 'viewer';
    });
    
    const readonly = computed(() => {
      return userRole.value === 'viewer';
    });
    
    const canEditItem = (item) => {
      if (!canEdit.value) return false;
      
      if (userRole.value === 'warehouse_manager') {
        const allowedWarehouses = userProfile.value?.allowed_warehouses || [];
        return allowedWarehouses.includes(item.warehouse_id);
      }
      
      return true;
    };
    
    const canTransferItem = (item) => {
      return canEditItem(item);
    };
    
    const canDispatchItem = (item) => {
      return canEditItem(item);
    };
    
    const canDeleteItem = (item) => {
      return canEditItem(item);
    };
    
    // Load from local storage cache
    const loadFromCache = () => {
      try {
        const cachedInventory = localStorage.getItem(LOCAL_STORAGE_KEYS.INVENTORY);
        const cachedWarehouses = localStorage.getItem(LOCAL_STORAGE_KEYS.WAREHOUSES);
        const lastRefresh = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_REFRESH);
        
        if (cachedInventory) {
          const inventoryData = JSON.parse(cachedInventory);
          if (inventoryData.data && inventoryData.timestamp) {
            const cacheAge = Date.now() - inventoryData.timestamp;
            if (cacheAge < 60 * 60 * 1000) {
              store.commit('SET_INVENTORY', inventoryData.data);
              isCachedData.value = true;
              console.log('📦 Loaded inventory from cache');
            }
          }
        }
        
        if (cachedWarehouses) {
          const warehousesData = JSON.parse(cachedWarehouses);
          if (warehousesData.data && warehousesData.timestamp) {
            store.commit('SET_WAREHOUSES', warehousesData.data);
            store.commit('SET_WAREHOUSES_LOADED', true);
          }
        }
        
        if (lastRefresh) {
          lastRefreshTime.value = parseInt(lastRefresh);
        }
      } catch (error) {
        console.warn('Error loading from cache:', error);
      }
    };
    
    // Save to local storage cache
    const saveToCache = (key, data) => {
      try {
        const cacheData = {
          data,
          timestamp: Date.now(),
          version: LOCAL_STORAGE_KEYS.CACHE_VERSION
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
      } catch (error) {
        console.warn('Error saving to cache:', error);
      }
    };
    
    // FIREBASE OPTIMIZATIONS
    const loadInitialInventory = async () => {
      try {
        console.log('🚀 Loading initial inventory data...');
        loading.value = true;
        
        const { db } = await import('@/firebase/config');
        const { collection, query, limit, getDocs, orderBy } = await import('firebase/firestore');
        
        const itemsQuery = query(
          collection(db, 'items'),
          orderBy('updated_at', 'desc'),
          limit(100)
        );
        
        const snapshot = await getDocs(itemsQuery);
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log(`✅ Loaded ${items.length} items initially`);
        
        store.commit('SET_INVENTORY', items);
        store.commit('SET_INVENTORY_LOADED', true);
        
        saveToCache(LOCAL_STORAGE_KEYS.INVENTORY, items);
        localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_REFRESH, Date.now().toString());
        
        lastRefreshTime.value = Date.now();
        isCachedData.value = false;
        
        setupIndividualListeners(items);
        
        return items;
      } catch (err) {
        console.error('❌ Error loading initial inventory:', err);
        error.value = 'حدث خطأ في تحميل البيانات';
        throw err;
      } finally {
        loading.value = false;
      }
    };
    
    // Set up individual document listeners
    const setupIndividualListeners = (items) => {
      cleanupIndividualListeners();
      
      console.log('🎯 Setting up individual document listeners...');
      
      items.slice(0, 50).forEach(item => {
        setupIndividualItemListener(item.id);
      });
    };
    
    // Set up listener for a single item
    const setupIndividualItemListener = (itemId) => {
      if (individualListeners[itemId]) {
        return;
      }
      
      (async () => {
        try {
          const { db } = await import('@/firebase/config');
          const { doc, onSnapshot } = await import('firebase/firestore');
          
          const itemRef = doc(db, 'items', itemId);
          
          const unsubscribe = onSnapshot(itemRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
              const updatedItem = {
                id: docSnapshot.id,
                ...docSnapshot.data()
              };
              
              console.log(`📝 Item updated: ${updatedItem.name}`);
              
              const existingItemIndex = store.state.inventory.findIndex(item => item.id === itemId);
              
              if (existingItemIndex !== -1) {
                const existingItem = store.state.inventory[existingItemIndex];
                const mergedItem = {
                  ...existingItem,
                  ...updatedItem,
                  stock_status: existingItem.stock_status || getStockStatus(updatedItem.remaining_quantity)
                };
                
                store.commit('UPDATE_ITEM', mergedItem);
                saveToCache(LOCAL_STORAGE_KEYS.INVENTORY, store.state.inventory);
              }
            }
          }, (error) => {
            console.error(`❌ Error listening to item ${itemId}:`, error);
            delete individualListeners[itemId];
          });
          
          individualListeners[itemId] = unsubscribe;
          firestoreUnsubscribes.push(unsubscribe);
          
        } catch (error) {
          console.error(`❌ Error setting up listener for item ${itemId}:`, error);
        }
      })();
    };
    
    // Clean up individual document listeners
    const cleanupIndividualListeners = () => {
      console.log('🧹 Cleaning up individual listeners...');
      
      Object.values(individualListeners).forEach(unsubscribe => {
        if (unsubscribe && typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
      
      Object.keys(individualListeners).forEach(key => {
        delete individualListeners[key];
      });
      
      firestoreUnsubscribes.forEach(unsubscribe => {
        if (unsubscribe && typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
      
      firestoreUnsubscribes.length = 0;
    };
    
    // Load more items
    const loadMoreInventory = async () => {
      try {
        const { db } = await import('@/firebase/config');
        const { collection, query, limit, getDocs, orderBy, startAfter } = await import('firebase/firestore');
        
        const lastItem = inventory.value[inventory.value.length - 1];
        
        let itemsQuery;
        if (lastItem?.updated_at) {
          itemsQuery = query(
            collection(db, 'items'),
            orderBy('updated_at', 'desc'),
            startAfter(lastItem.updated_at),
            limit(50)
          );
        } else {
          itemsQuery = query(
            collection(db, 'items'),
            orderBy('updated_at', 'desc'),
            limit(50)
          );
        }
        
        const snapshot = await getDocs(itemsQuery);
        const newItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log(`📦 Loaded ${newItems.length} more items`);
        
        if (newItems.length > 0) {
          store.commit('ADD_ITEMS', newItems);
          
          newItems.forEach(item => {
            setupIndividualItemListener(item.id);
          });
          
          saveToCache(LOCAL_STORAGE_KEYS.INVENTORY, store.state.inventory);
        }
        
        measurePerformance();
        
      } catch (err) {
        console.error('❌ Error loading more inventory:', err);
        error.value = 'حدث خطأ في تحميل المزيد من الأصناف';
        
        store.dispatch('showNotification', {
          type: 'error',
          message: 'فشل في تحميل المزيد من الأصناف'
        });
      }
    };
    
    // Refresh data
    const refreshData = async () => {
      try {
        performanceMonitor.start();
        
        console.log('🔄 Refreshing inventory data...');
        
        cleanupIndividualListeners();
        await loadInitialInventory();
        
        store.dispatch('showNotification', {
          type: 'success',
          message: 'تم تحديث البيانات بنجاح'
        });
        
        measurePerformance();
        
      } catch (err) {
        console.error('❌ Error refreshing data:', err);
        error.value = 'حدث خطأ في تحديث البيانات';
        
        store.dispatch('showNotification', {
          type: 'error',
          message: 'فشل في تحديث البيانات'
        });
      }
    };
    
    // Filtered items
    const filteredItems = computed(() => {
      let filtered = [...inventory.value];
      
      if (selectedWarehouse.value) {
        filtered = filtered.filter(item => item.warehouse_id === selectedWarehouse.value);
      }
      
      if (statusFilter.value) {
        filtered = filtered.filter(item => {
          const quantity = item.remaining_quantity || 0;
          if (statusFilter.value === 'in_stock') return quantity >= 10;
          if (statusFilter.value === 'low_stock') return quantity > 0 && quantity < 10;
          if (statusFilter.value === 'out_of_stock') return quantity === 0;
          return true;
        });
      }
      
      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase();
        filtered = filtered.filter(item => 
          item.name?.toLowerCase().includes(term) ||
          item.code?.toLowerCase().includes(term) ||
          item.color?.toLowerCase().includes(term) ||
          item.supplier?.toLowerCase().includes(term) ||
          item.item_location?.toLowerCase().includes(term)
        );
      }
      
      return filtered.sort((a, b) => {
        const nameA = a.name?.toLowerCase() || '';
        const nameB = b.name?.toLowerCase() || '';
        return nameA.localeCompare(nameB, 'ar');
      });
    });
    
    // Pagination
    const totalPages = computed(() => {
      return Math.ceil(filteredItems.value.length / itemsPerPage.value);
    });

    const startIndex = computed(() => {
      return (currentPage.value - 1) * itemsPerPage.value;
    });

    const endIndex = computed(() => {
      return startIndex.value + itemsPerPage.value;
    });

    const paginatedItems = computed(() => {
      return filteredItems.value.slice(startIndex.value, endIndex.value);
    });

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
    
    // Helper Methods
    const formatNumber = (num) => {
      return new Intl.NumberFormat('ar-EG').format(num || 0);
    };
    
    const getWarehouseLabel = (warehouseId) => {
      const warehouse = allWarehouses.value.find(w => w.id === warehouseId);
      return warehouse ? warehouse.name_ar : warehouseId;
    };
    
    const getStockStatus = (quantity) => {
      if (quantity === 0) return 'نفذ';
      if (quantity < 10) return 'قليل';
      return 'متوفر';
    };
    
    const getStockStatusClass = (quantity) => {
      if (quantity === 0) return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800 shadow-sm';
      if (quantity < 10) return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-800 shadow-sm';
      return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800 shadow-sm';
    };

    const getQuantityClass = (quantity) => {
      if (quantity === 0) return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10';
      if (quantity < 10) return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/10';
      return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10';
    };
    
    const getColorHex = (colorName) => {
      const colorMap = {
        'أحمر': '#ef4444',
        'أزرق': '#3b82f6',
        'أخضر': '#10b981',
        'أصفر': '#f59e0b',
        'أسود': '#000000',
        'أبيض': '#ffffff',
        'رمادي': '#6b7280',
        'بني': '#92400e',
        'وردي': '#ec4899',
        'برتقالي': '#f97316',
        'بنفسجي': '#8b5cf6',
        'ذهبي': '#d97706',
        'فضي': '#9ca3af'
      };
      return colorMap[colorName] || '#6b7280';
    };
    
    const formatDate = (date) => {
      if (!date) return '-';
      try {
        const dateObj = date.toDate ? date.toDate() : new Date(date);
        if (isNaN(dateObj.getTime())) return '-';
        
        return dateObj.toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      } catch (e) {
        return '-';
      }
    };
    
    const formatRelativeTime = (date) => {
      if (!date) return '-';
      try {
        const dateObj = date.toDate ? date.toDate() : new Date(date);
        const now = new Date();
        const diffMs = now - dateObj;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'الآن';
        if (diffMins < 60) return `قبل ${diffMins} دقيقة`;
        if (diffHours < 24) return `قبل ${diffHours} ساعة`;
        if (diffDays === 1) return 'أمس';
        if (diffDays < 7) return `قبل ${diffDays} أيام`;
        
        return formatDate(date);
      } catch (e) {
        return '-';
      }
    };
    
    const formatTimeAgo = (timestamp) => {
      if (!timestamp) return '';
      const now = Date.now();
      const diffMs = now - timestamp;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      
      if (diffMins < 1) return 'الآن';
      if (diffMins < 60) return `قبل ${diffMins} دقيقة`;
      if (diffHours < 24) return `قبل ${diffHours} ساعة`;
      
      return new Date(timestamp).toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    const getPlaceholderImage = () => {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMTZMNC42ODYgMTUuMzE0QzQuODgyIDExLjUwNyA4LjA5MyA5IDEyIDlDMTUuOTA3IDkgMTkuMTE4IDExLjUwNyAxOS4zMTQgMTUuMzE0TDIwIDE2TTggMjFIMTZNNSAxNEgxOU0xMiAxN0MxMiAxNy41NTIyOCAxMS41NTIzIDE4IDExIDE4QzEwLjQ0NzcgMTggMTAgMTcuNTUyMyAxMCAxN0MxMCAxNi40NDc3IDEwLjQ0NzcgMTYgMTEgMTZDMTEuNTUyMyAxNiAxMiAxNi40NDc3IDEyIDE3WiIgc3Ryb2tlPSI2QjcyOEQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
    };
    
    const handleImageError = (event) => {
      event.target.src = getPlaceholderImage();
      event.target.onerror = null;
    };
    
    const getLastActionUser = (item) => {
      if (!item) return 'غير معروف';
      
      if (item.last_updated_by_name) {
        return item.last_updated_by_name;
      }
      
      if (item.last_updated_by && typeof item.last_updated_by === 'string' && item.last_updated_by !== 'O5Rg9HxDH8Nk3LY9G5onMgc2vN12') {
        return item.last_updated_by;
      }
      
      if (item.updated_by && typeof item.updated_by === 'string' && item.updated_by !== 'O5Rg9HxDH8Nk3LY9G5onMgc2vN12') {
        return item.updated_by;
      }
      
      if (item.created_by && typeof item.created_by === 'string' && item.created_by !== 'O5Rg9HxDH8Nk3LY9G5onMgc2vN12') {
        return item.created_by;
      }
      
      return currentUserInfo.value;
    };
    
    // Performance monitoring
    const measurePerformance = () => {
      const loadTime = (performanceMonitor.end() / 1000).toFixed(2);
      const memoryUsage = performanceMonitor.getMemoryUsage();
      
      performanceStats.value = {
        itemCount: inventory.value.length,
        loadTime,
        memoryUsage
      };
    };
    
    // Action Methods
    const handleFilterChange = () => {
      currentPage.value = 1;
    };
    
    const handleSearch = debounce(() => {
      currentPage.value = 1;
    }, 300);
    
    const updateWarehouseFilter = () => {
      currentPage.value = 1;
    };
    
    const updateStatusFilter = () => {
      currentPage.value = 1;
    };
    
    const showItemDetails = (item) => {
      selectedItem.value = item;
      showDetailsModal.value = true;
      hoveredRow.value = null;
    };
    
    const closeDetailsModal = () => {
      showDetailsModal.value = false;
      selectedItem.value = null;
    };
    
    const exportInventory = async () => {
      try {
        exporting.value = true;
        const data = filteredItems.value;
        
        if (data.length === 0) {
          error.value = 'لا توجد بيانات للتصدير';
          return;
        }

        const headers = [
          'الصورة',
          'اسم الصنف',
          'الكود',
          'اللون',
          'المخزن',
          'المورد',
          'مكان الصنف',
          'عدد الكراتين',
          'عدد في الكرتونة',
          'عدد القطع الفردية',
          'المجموع المضاف',
          'المجموع المتبقي',
          'الحالة',
          'تاريخ التحديث',
          'آخر تحديث بواسطة'
        ];
        
        const csvData = data.map(item => [
          item.photo_url || '',
          item.name || '',
          item.code || '',
          item.color || '',
          getWarehouseLabel(item.warehouse_id) || '',
          item.supplier || '',
          item.item_location || '',
          item.cartons_count || 0,
          item.per_carton_count || 0,
          item.single_bottles_count || 0,
          item.total_added || 0,
          item.remaining_quantity || 0,
          getStockStatus(item.remaining_quantity),
          formatDate(item.updated_at),
          getLastActionUser(item)
        ]);

        const csvContent = [
          '\uFEFF' + headers.join(','),
          ...csvData.map(row => row.map(field => `"${field}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `مخزون-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم تصدير ${data.length} صنف بنجاح`
        });
        
      } catch (err) {
        error.value = 'فشل في تصدير الملف: ' + err.message;
        
        store.dispatch('showNotification', {
          type: 'error',
          message: 'فشل في تصدير الملف'
        });
      } finally {
        exporting.value = false;
      }
    };
    
    const handleTransfer = (item) => {
      if (!canTransferItem(item)) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية النقل من هذا المخزن'
        });
        return;
      }
      selectedItemForTransfer.value = item;
      showTransferModal.value = true;
      showDetailsModal.value = false;
      hoveredRow.value = null;
    };
    
    const handleDispatch = (item) => {
      if (!canDispatchItem(item)) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية الصرف من هذا المخزن'
        });
        return;
      }
      selectedItemForDispatch.value = item;
      showDispatchModal.value = true;
      showDetailsModal.value = false;
      hoveredRow.value = null;
    };
    
    const handleEdit = (item) => {
      if (!canEditItem(item)) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية التعديل على هذا المخزن'
        });
        return;
      }
      selectedItemForEdit.value = item;
      showEditModal.value = true;
      showDetailsModal.value = false;
      hoveredRow.value = null;
    };
    
    const handleDelete = (item) => {
      if (!canDeleteItem(item)) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية الحذف من هذا المخزن'
        });
        return;
      }
      
      itemToDelete.value = item;
      showDeleteConfirm.value = true;
      hoveredRow.value = null;
    };
    
    const confirmDelete = async () => {
      try {
        deleteLoading.value = true;
        
        const { db } = await import('@/firebase/config');
        const { doc, deleteDoc, collection, addDoc } = await import('firebase/firestore');
        
        const itemRef = doc(db, 'items', itemToDelete.value.id);
        
        const transactionData = {
          type: 'DELETE',
          item_id: itemToDelete.value.id,
          item_name: itemToDelete.value.name,
          item_code: itemToDelete.value.code,
          item_color: itemToDelete.value.color,
          from_warehouse: itemToDelete.value.warehouse_id,
          cartons_delta: 0,
          single_delta: 0,
          total_delta: -itemToDelete.value.remaining_quantity,
          user_id: currentUser.value?.uid,
          user_name: currentUserInfo.value,
          user_email: currentUser.value?.email || userProfile.value?.email,
          user_role: userRole.value,
          timestamp: new Date(),
          notes: `تم حذف الصنف "${itemToDelete.value.name}" (${itemToDelete.value.code}) من المخزن ${getWarehouseLabel(itemToDelete.value.warehouse_id)}`
        };
        
        await addDoc(collection(db, 'transactions'), transactionData);
        await deleteDoc(itemRef);
        
        if (individualListeners[itemToDelete.value.id]) {
          individualListeners[itemToDelete.value.id]();
          delete individualListeners[itemToDelete.value.id];
        }
        
        store.commit('REMOVE_ITEM', itemToDelete.value.id);
        saveToCache(LOCAL_STORAGE_KEYS.INVENTORY, store.state.inventory);
        
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم حذف الصنف "${itemToDelete.value.name}" بنجاح`
        });
        
        showDeleteConfirm.value = false;
        itemToDelete.value = null;
        
      } catch (err) {
        console.error('❌ Error deleting item:', err);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'فشل في حذف الصنف: ' + err.message
        });
      } finally {
        deleteLoading.value = false;
      }
    };
    
    const handleItemSaved = async (result) => {
      await refreshData();
      
      store.dispatch('showNotification', {
        type: 'success',
        message: result?.type === 'created' 
          ? 'تم إضافة الصنف الجديد بنجاح!' 
          : 'تم تحديث الكميات بنجاح!'
      });
    };
    
    const closeAddModal = () => {
      showAddModal.value = false;
    };
    
    const handleItemUpdated = () => {
      showEditModal.value = false;
      selectedItemForEdit.value = null;
      refreshData();
    };
    
    const handleTransferSuccess = () => {
      showTransferModal.value = false;
      selectedItemForTransfer.value = null;
      refreshData();
    };
    
    const handleDispatchSuccess = () => {
      showDispatchModal.value = false;
      selectedItemForDispatch.value = null;
      refreshData();
    };
    
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    // Cleanup images
    const cleanupImages = () => {
      Object.keys(imageLoaded).forEach(key => {
        delete imageLoaded[key];
      });
    };
    
    // Lifecycle
    onMounted(() => {
      performanceMonitor.start();
      
      console.log('🏁 Dashboard component mounted');
      
      loadFromCache();
      
      if (accessibleWarehouses.value.length === 1) {
        selectedWarehouse.value = accessibleWarehouses.value[0].id;
      }
      
      if (route.name === 'AddInventory') {
        showAddModal.value = true;
      }
      
      if (!isCachedData.value || !store.state.inventory.length) {
        (async () => {
          try {
            await loadInitialInventory();
          } catch (err) {
            console.error('❌ Error in initial load:', err);
          }
        })();
      } else {
        setupIndividualListeners(inventory.value.slice(0, 50));
      }
      
      measurePerformance();
      
      // Pre-load images for visible items
      const preloadImages = () => {
        paginatedItems.value.forEach(item => {
          if (item.photo_url && !imageLoaded[item.id]) {
            const img = new Image();
            img.src = item.photo_url;
            img.onload = () => {
              imageLoaded[item.id] = true;
            };
            img.onerror = () => {
              imageLoaded[item.id] = false;
            };
          }
        });
      };
      
      preloadImages();
    });
    
    // Clean up on unmount
    onUnmounted(() => {
      console.log('🧹 Cleaning up Dashboard component...');
      
      cleanupIndividualListeners();
      
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }
      
      cleanupImages();
    });
    
    // Watch for paginated items changes
    watch(paginatedItems, (newItems) => {
      newItems.forEach(item => {
        if (item.photo_url && !imageLoaded[item.id]) {
          const img = new Image();
          img.src = item.photo_url;
          img.onload = () => {
            imageLoaded[item.id] = true;
          };
          img.onerror = () => {
            imageLoaded[item.id] = false;
          };
        }
      });
    });
    
    // Watch for filter changes
    watch(() => [searchTerm.value, statusFilter.value, selectedWarehouse.value], () => {
      currentPage.value = 1;
    });
    
    return {
      // State
      loading,
      error,
      showAddModal,
      showEditModal,
      showTransferModal,
      showDispatchModal,
      showDetailsModal,
      showDeleteConfirm,
      searchTerm,
      statusFilter,
      selectedWarehouse,
      selectedItemForEdit,
      selectedItemForTransfer,
      selectedItemForDispatch,
      selectedItem,
      itemToDelete,
      deleteLoading,
      imageLoaded,
      exporting,
      currentPage,
      lastRefreshTime,
      isCachedData,
      performanceStats,
      hoveredRow,
      
      // Computed
      userRole,
      userProfile,
      inventory,
      accessibleWarehouses,
      allWarehouses,
      canAddItem,
      canExport,
      showActions,
      readonly,
      filteredItems,
      paginatedItems,
      totalPages,
      startIndex,
      endIndex,
      visiblePages,
      currentUserInfo,
      
      // Helper Methods
      formatNumber,
      getWarehouseLabel,
      getStockStatus,
      getStockStatusClass,
      getQuantityClass,
      getColorHex,
      formatDate,
      formatRelativeTime,
      formatTimeAgo,
      getPlaceholderImage,
      getLastActionUser,
      handleImageError,
      
      // Permission Methods
      canEditItem,
      canTransferItem,
      canDispatchItem,
      canDeleteItem,
      
      // Action Methods
      handleFilterChange,
      handleSearch,
      updateWarehouseFilter,
      updateStatusFilter,
      showItemDetails,
      closeDetailsModal,
      refreshData,
      loadMoreInventory,
      exportInventory,
      handleTransfer,
      handleDispatch,
      handleEdit,
      handleDelete,
      confirmDelete,
      handleItemSaved,
      closeAddModal,
      handleItemUpdated,
      handleTransferSuccess,
      handleDispatchSuccess,
      nextPage,
      prevPage
    };
  }
};
</script>

<style scoped>
/* Minimal styles for the dashboard */
.container {
  width: 100%;
  height: 100%;
}

/* Ensure the InventoryTable takes full space */
:deep(.inventory-table) {
  height: 100%;
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

/* Dark mode scrollbar */
@media (prefers-color-scheme: dark) {
  ::-webkit-scrollbar-track {
    background: #2d3748;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #4a5568;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #718096;
  }
}

/* Performance stats styling */
.performance-stats {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 0.75rem;
}

/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Image loading animation */
.image-loading {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .container {
    padding: 0.5rem;
  }
  
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  .container {
    overflow: visible !important;
    height: auto !important;
  }
}
</style>
