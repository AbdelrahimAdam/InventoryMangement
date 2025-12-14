import { createStore } from 'vuex';
import { auth, db } from '@/firebase/config';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  orderBy,
  writeBatch,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import {
  InventoryService,
  WAREHOUSE_LABELS,
  DESTINATION_LABELS,
  FIELD_LABELS,
  TRANSACTION_TYPES
} from '@/services/inventoryService';
import UserService from '@/services/UserService';

// Performance constants
const PERFORMANCE_CONFIG = {
  INVENTORY_PAGE_SIZE: 100, // ✅ INCREASED: Load more items initially
  TRANSACTIONS_PAGE_SIZE: 30,
  RECENT_TRANSACTIONS_LIMIT: 20,
  NOTIFICATION_LIMIT: 100,
  CACHE_DURATION: 10 * 60 * 1000, // ✅ INCREASED: 10 minutes cache
  DEBOUNCE_DELAY: 300,
  ITEM_SEARCH_LIMIT: 10,
  TRANSACTION_SEARCH_LIMIT: 20
};

// Field name mapping
const FIELD_MAPPINGS = {
  arabicToEnglish: {
    'الاسم': 'name',
    'الكود': 'code',
    'اللون': 'color',
    'المخزن_id': 'warehouse_id',
    'المخزن': 'warehouse_id',
    'عدد_الكراتين': 'cartons_count',
    'عدد_في_الكرتونه': 'per_carton_count',
    'عدد_القزاز_الفردي': 'single_bottles_count',
    'الكميه_المضافه': 'total_added',
    'الكميه_المتبقيه': 'remaining_quantity',
    'المورد': 'supplier',
    'مكان_الصنف': 'item_location'
  },
  englishToArabic: FIELD_LABELS
};

export default createStore({
  state: () => ({
    user: null,
    userProfile: null,
    loading: false,

    // Warehouses
    warehouses: [],
    warehousesLoaded: false,
    warehousesCacheTimestamp: null,

    // Inventory
    inventory: [],
    inventoryLastFetched: null,

    // Transactions
    transactions: [],

    // Recent transactions (limited)
    recentTransactions: [],
    recentTransactionsLoading: false,

    itemHistory: [],

    // Filters with debounce support
    filters: {
      warehouse: '',
      search: '',
      lastUpdate: 0
    },

    authError: null,
    operationLoading: false,
    operationError: null,
    fieldMappings: FIELD_MAPPINGS,

    // Notifications with limit
    notifications: [],

    requiresCompositeIndex: false,
    allUsers: [],
    usersLoading: false,

    // Performance cache
    cache: {
      warehouseLabels: {},
      stats: null,
      statsTimestamp: null,
      itemCache: {},
      itemCacheTimestamp: null,
      transactionItems: [],
      transactionItemsTimestamp: null
    },

    // Loading states
    inventoryLoading: false,
    transactionsLoading: false,
    
    isFetchingInventory: false,

    // ✅ NEW: Pagination support
    inventoryPagination: {
      lastDoc: null,
      hasMore: true
    }
  }),

  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },

    SET_USER_PROFILE(state, profile) {
      state.userProfile = profile;
    },

    SET_LOADING(state, loading) {
      state.loading = loading;
    },

    SET_OPERATION_LOADING(state, loading) {
      state.operationLoading = loading;
    },

    SET_OPERATION_ERROR(state, error) {
      state.operationError = error;
    },

    SET_WAREHOUSES(state, warehouses) {
      state.warehouses = warehouses;
      state.warehousesCacheTimestamp = Date.now();

      state.cache.warehouseLabels = {};
      warehouses.forEach(w => {
        state.cache.warehouseLabels[w.id] = w.name_ar;
      });
    },

    SET_WAREHOUSES_LOADED(state, loaded) {
      state.warehousesLoaded = loaded;
    },

    SET_INVENTORY(state, inventory) {
      state.inventory = Array.isArray(inventory) ? inventory : [];
      state.inventoryLastFetched = Date.now();
    },

    // ✅ NEW: Append to inventory (for pagination)
    APPEND_TO_INVENTORY(state, newItems) {
      if (Array.isArray(newItems)) {
        // Filter out duplicates
        const existingIds = new Set(state.inventory.map(item => item.id));
        const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));
        state.inventory.push(...uniqueNewItems);
        state.inventoryLastFetched = Date.now();
      }
    },

    SET_INVENTORY_LAST_FETCHED(state, timestamp) {
      state.inventoryLastFetched = timestamp;
    },

    ADD_ITEM(state, item) {
      if (item && typeof item === 'object') {
        state.inventory.push(item);
        if (item.id) {
          state.cache.itemCache[item.id] = {
            data: item,
            timestamp: Date.now()
          };
        }
      }
    },

    UPDATE_ITEM(state, updatedItem) {
      if (!updatedItem || !updatedItem.id) return;

      const index = state.inventory.findIndex(item => item.id === updatedItem.id);
      if (index !== -1) {
        state.inventory.splice(index, 1, updatedItem);
      }
      
      state.cache.itemCache[updatedItem.id] = {
        data: updatedItem,
        timestamp: Date.now()
      };
    },

    REMOVE_ITEM(state, itemId) {
      state.inventory = state.inventory.filter(item => item.id !== itemId);
      delete state.cache.itemCache[itemId];
    },

    SET_INVENTORY_LOADING(state, loading) {
      state.inventoryLoading = loading;
    },

    SET_IS_FETCHING_INVENTORY(state, fetching) {
      state.isFetchingInventory = fetching;
    },

    SET_TRANSACTIONS(state, transactions) {
      state.transactions = Array.isArray(transactions) ? transactions : [];
    },

    SET_TRANSACTIONS_LOADING(state, loading) {
      state.transactionsLoading = loading;
    },

    ADD_TRANSACTION(state, transaction) {
      if (transaction && typeof transaction === 'object') {
        state.transactions.unshift(transaction);
      }
    },

    SET_ITEM_HISTORY(state, history) {
      state.itemHistory = Array.isArray(history) ? history : [];
    },

    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters, lastUpdate: Date.now() };
    },

    UPDATE_WAREHOUSE(state, updatedWarehouse) {
      if (!updatedWarehouse || !updatedWarehouse.id) return;

      const index = state.warehouses.findIndex(w => w.id === updatedWarehouse.id);
      if (index !== -1) {
        state.warehouses.splice(index, 1, updatedWarehouse);
      } else {
        state.warehouses.push(updatedWarehouse);
      }
      state.cache.warehouseLabels[updatedWarehouse.id] = updatedWarehouse.name_ar;
    },

    REMOVE_WAREHOUSE(state, warehouseId) {
      state.warehouses = state.warehouses.filter(w => w.id !== warehouseId);
      delete state.cache.warehouseLabels[warehouseId];
    },

    SET_AUTH_ERROR(state, error) {
      state.authError = error;
    },

    CLEAR_OPERATION_ERROR(state) {
      state.operationError = null;
    },

    SET_TRANSACTION_ITEMS_CACHE(state, { items, timestamp }) {
      state.cache.transactionItems = items;
      state.cache.transactionItemsTimestamp = timestamp;
    },

    // ✅ NEW: Pagination mutations
    SET_INVENTORY_PAGINATION(state, { lastDoc, hasMore }) {
      state.inventoryPagination.lastDoc = lastDoc;
      state.inventoryPagination.hasMore = hasMore;
    },

    RESET_INVENTORY_PAGINATION(state) {
      state.inventoryPagination = {
        lastDoc: null,
        hasMore: true
      };
    },

    ADD_NOTIFICATION(state, notification) {
      notification.id = Date.now().toString();
      notification.timestamp = new Date();
      state.notifications.unshift(notification);

      if (state.notifications.length > PERFORMANCE_CONFIG.NOTIFICATION_LIMIT) {
        state.notifications = state.notifications.slice(0, PERFORMANCE_CONFIG.NOTIFICATION_LIMIT);
      }

      setTimeout(() => {
        const index = state.notifications.findIndex(n => n.id === notification.id);
        if (index !== -1) {
          state.notifications.splice(index, 1);
        }
      }, 5000);
    },

    REMOVE_NOTIFICATION(state, notificationId) {
      state.notifications = state.notifications.filter(n => n.id !== notificationId);
    },

    CLEAR_NOTIFICATIONS(state) {
      state.notifications = [];
    },

    SET_RECENT_TRANSACTIONS(state, transactions) {
      state.recentTransactions = Array.isArray(transactions) ? transactions : [];
    },

    SET_RECENT_TRANSACTIONS_LOADING(state, loading) {
      state.recentTransactionsLoading = loading;
    },

    ADD_RECENT_TRANSACTION(state, transaction) {
      if (transaction && typeof transaction === 'object') {
        state.recentTransactions.unshift(transaction);
        if (state.recentTransactions.length > PERFORMANCE_CONFIG.RECENT_TRANSACTIONS_LIMIT) {
          state.recentTransactions = state.recentTransactions.slice(0, PERFORMANCE_CONFIG.RECENT_TRANSACTIONS_LIMIT);
        }
      }
    },

    SET_REQUIRES_COMPOSITE_INDEX(state, value) {
      state.requiresCompositeIndex = value;
    },

    SET_ALL_USERS(state, users) {
      state.allUsers = Array.isArray(users) ? users : [];
    },

    SET_USERS_LOADING(state, loading) {
      state.usersLoading = loading;
    },

    SET_STATS_CACHE(state, { stats, timestamp }) {
      state.cache.stats = stats;
      state.cache.statsTimestamp = timestamp;
    },

    CACHE_ITEM(state, { itemId, itemData }) {
      if (itemId && itemData) {
        state.cache.itemCache[itemId] = {
          data: itemData,
          timestamp: Date.now()
        };
      }
    },

    REMOVE_ITEM_FROM_CACHE(state, itemId) {
      delete state.cache.itemCache[itemId];
    },

    CLEAR_CACHE(state) {
      state.cache = {
        warehouseLabels: {},
        stats: null,
        statsTimestamp: null,
        itemCache: {},
        itemCacheTimestamp: null,
        transactionItems: [],
        transactionItemsTimestamp: null
      };
      state.inventoryLastFetched = null;
    }
  },

  actions: {
    // ✅ RESTORED: fetchInventoryOnce - One-time fetch for ALL items
    async fetchInventoryOnce({ commit, state, dispatch }) {
      // Prevent multiple simultaneous fetches
      if (state.isFetchingInventory) {
        console.log('Inventory fetch already in progress, skipping...');
        return state.inventory;
      }

      // Check cache: if inventory was fetched less than 10 minutes ago, skip
      const now = Date.now();
      const cacheDuration = PERFORMANCE_CONFIG.CACHE_DURATION;
      
      if (state.inventoryLastFetched && 
          (now - state.inventoryLastFetched) < cacheDuration && 
          state.inventory.length > 0) {
        console.log('Using cached inventory (fetched less than 10 minutes ago)');
        return state.inventory;
      }

      commit('SET_IS_FETCHING_INVENTORY', true);
      commit('SET_INVENTORY_LOADING', true);
      commit('RESET_INVENTORY_PAGINATION'); // Reset pagination on fresh load
      
      try {
        if (!state.userProfile) {
          console.log('Cannot load inventory: User not authenticated');
          commit('SET_INVENTORY', []);
          return [];
        }

        let itemsQuery;
        const itemsRef = collection(db, 'items');

        if (state.userProfile.role === 'superadmin' || state.userProfile.role === 'company_manager') {
          // Load ALL items for superadmin/company_manager
          itemsQuery = query(
            itemsRef,
            orderBy('warehouse_id'),
            orderBy('name'),
            limit(PERFORMANCE_CONFIG.INVENTORY_PAGE_SIZE) // Load 100 items initially
          );
        } else if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];

          if (allowedWarehouses.length === 0) {
            console.log('No warehouses assigned to this warehouse manager');
            commit('SET_INVENTORY', []);
            return [];
          }

          if (allowedWarehouses.includes('all')) {
            // If user has access to all warehouses
            itemsQuery = query(
              itemsRef,
              orderBy('warehouse_id'),
              orderBy('name'),
              limit(PERFORMANCE_CONFIG.INVENTORY_PAGE_SIZE)
            );
          } else {
            try {
              // Try to filter by allowed warehouses
              itemsQuery = query(
                itemsRef,
                where('warehouse_id', 'in', allowedWarehouses.slice(0, 10)),
                orderBy('warehouse_id'),
                orderBy('name'),
                limit(PERFORMANCE_CONFIG.INVENTORY_PAGE_SIZE)
              );
            } catch (error) {
              if (error.code === 'failed-precondition') {
                console.warn('Composite index required. Loading all items then filtering...');
                commit('SET_REQUIRES_COMPOSITE_INDEX', true);
                itemsQuery = query(
                  itemsRef,
                  orderBy('warehouse_id'),
                  orderBy('name'),
                  limit(PERFORMANCE_CONFIG.INVENTORY_PAGE_SIZE * 2) // Load more to compensate
                );
              } else {
                throw error;
              }
            }
          }
        } else {
          console.log('User role not authorized for inventory access');
          commit('SET_INVENTORY', []);
          return [];
        }

        const snapshot = await getDocs(itemsQuery);
        console.log('✅ Inventory ONE-TIME fetch completed:', snapshot.size, 'items');

        let inventory = snapshot.docs.map(doc => {
          const data = doc.data();
          const item = InventoryService.convertForDisplay({
            id: doc.id,
            ...data
          });
          
          commit('CACHE_ITEM', {
            itemId: doc.id,
            itemData: item
          });
          
          return item;
        });

        // Client-side filtering for warehouse managers without composite index
        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
            if (allowedWarehouses.length > 10 || state.requiresCompositeIndex) {
              inventory = inventory.filter(item => 
                allowedWarehouses.includes(item.warehouse_id)
              );
            }
          }
        }

        console.log('✅ Inventory filtered:', inventory.length, 'items');
        
        // Set pagination data
        if (snapshot.docs.length > 0) {
          const lastDoc = snapshot.docs[snapshot.docs.length - 1];
          const hasMore = snapshot.size === PERFORMANCE_CONFIG.INVENTORY_PAGE_SIZE;
          
          commit('SET_INVENTORY_PAGINATION', {
            lastDoc,
            hasMore
          });
        }

        commit('SET_INVENTORY', inventory);
        return inventory;

      } catch (error) {
        console.error('❌ Error loading inventory:', error);

        if (error.code === 'failed-precondition') {
          commit('SET_REQUIRES_COMPOSITE_INDEX', true);
          dispatch('showNotification', {
            type: 'warning',
            title: 'تحذير الفهرس',
            message: 'يجب إنشاء فهرس مركب لتحسين الأداء. راجع وحدة التحكم في Firebase.'
          });
        } else if (error.code === 'permission-denied') {
          dispatch('showNotification', {
            type: 'error',
            message: 'ليس لديك صلاحية لعرض المخزون'
          });
        } else {
          dispatch('showNotification', {
            type: 'error',
            message: 'خطأ في تحميل المخزون'
          });
        }

        commit('SET_INVENTORY', []);
        return [];
      } finally {
        commit('SET_INVENTORY_LOADING', false);
        commit('SET_IS_FETCHING_INVENTORY', false);
      }
    },

    // ✅ NEW: Load more items (pagination)
    async loadMoreInventory({ commit, state, dispatch }) {
      if (!state.inventoryPagination.hasMore || state.isFetchingInventory) {
        console.log('No more items to load or already fetching');
        return [];
      }

      commit('SET_IS_FETCHING_INVENTORY', true);
      commit('SET_INVENTORY_LOADING', true);
      
      try {
        if (!state.userProfile || !state.inventoryPagination.lastDoc) {
          return [];
        }

        let itemsQuery;
        const itemsRef = collection(db, 'items');

        if (state.userProfile.role === 'superadmin' || state.userProfile.role === 'company_manager') {
          itemsQuery = query(
            itemsRef,
            orderBy('warehouse_id'),
            orderBy('name'),
            startAfter(state.inventoryPagination.lastDoc),
            limit(PERFORMANCE_CONFIG.INVENTORY_PAGE_SIZE)
          );
        } else if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];

          if (allowedWarehouses.includes('all')) {
            itemsQuery = query(
              itemsRef,
              orderBy('warehouse_id'),
              orderBy('name'),
              startAfter(state.inventoryPagination.lastDoc),
              limit(PERFORMANCE_CONFIG.INVENTORY_PAGE_SIZE)
            );
          } else {
            try {
              itemsQuery = query(
                itemsRef,
                where('warehouse_id', 'in', allowedWarehouses.slice(0, 10)),
                orderBy('warehouse_id'),
                orderBy('name'),
                startAfter(state.inventoryPagination.lastDoc),
                limit(PERFORMANCE_CONFIG.INVENTORY_PAGE_SIZE)
              );
            } catch (error) {
              if (error.code === 'failed-precondition') {
                itemsQuery = query(
                  itemsRef,
                  orderBy('warehouse_id'),
                  orderBy('name'),
                  startAfter(state.inventoryPagination.lastDoc),
                  limit(PERFORMANCE_CONFIG.INVENTORY_PAGE_SIZE * 2)
                );
              } else {
                throw error;
              }
            }
          }
        } else {
          return [];
        }

        const snapshot = await getDocs(itemsQuery);
        console.log('✅ Loaded more items:', snapshot.size, 'items');

        let newItems = snapshot.docs.map(doc => {
          const data = doc.data();
          const item = InventoryService.convertForDisplay({
            id: doc.id,
            ...data
          });
          
          commit('CACHE_ITEM', {
            itemId: doc.id,
            itemData: item
          });
          
          return item;
        });

        // Client-side filtering
        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
            if (allowedWarehouses.length > 10 || state.requiresCompositeIndex) {
              newItems = newItems.filter(item => 
                allowedWarehouses.includes(item.warehouse_id)
              );
            }
          }
        }

        // Update pagination
        if (snapshot.docs.length > 0) {
          const lastDoc = snapshot.docs[snapshot.docs.length - 1];
          const hasMore = snapshot.size === PERFORMANCE_CONFIG.INVENTORY_PAGE_SIZE;
          
          commit('SET_INVENTORY_PAGINATION', {
            lastDoc,
            hasMore
          });
        } else {
          commit('SET_INVENTORY_PAGINATION', {
            lastDoc: null,
            hasMore: false
          });
        }

        // Append to existing inventory
        commit('APPEND_TO_INVENTORY', newItems);
        
        console.log('✅ Total items in inventory:', state.inventory.length);
        return newItems;

      } catch (error) {
        console.error('❌ Error loading more inventory:', error);
        return [];
      } finally {
        commit('SET_INVENTORY_LOADING', false);
        commit('SET_IS_FETCHING_INVENTORY', false);
      }
    },

    // Keep original fetchInventory for operations that need to refresh data
    async fetchInventory({ dispatch }) {
      console.log('Fetching inventory (force refresh)...');
      return await dispatch('fetchInventoryOnce');
    },

    // ✅ Force refresh inventory (ignores cache)
    async refreshInventory({ commit, dispatch }) {
      commit('SET_INVENTORY_LAST_FETCHED', null);
      commit('CLEAR_CACHE');
      return await dispatch('fetchInventoryOnce');
    },

    // ✅ Enhanced getItemById for transactions
    async getItemById({ commit, state, dispatch }, { itemId, itemCode, itemName }) {
      try {
        console.log('🔍 Searching item for transaction...', { itemId, itemCode, itemName });

        if (!itemId && !itemCode && !itemName) {
          throw new Error('معرف الصنف أو الكود أو الاسم مطلوب');
        }

        // 1. FIRST: Check memory cache (already loaded items in inventory)
        let item = state.inventory.find(i => 
          i.id === itemId || 
          (itemCode && i.code === itemCode) ||
          (itemName && i.name === itemName)
        );

        if (item) {
          console.log('✅ Item found in memory cache (loaded inventory)');
          return item;
        }

        // 2. SECOND: Check item cache (previously fetched items)
        const cacheEntry = state.cache.itemCache[itemId];
        const cacheDuration = 10 * 60 * 1000;
        
        if (cacheEntry && (Date.now() - cacheEntry.timestamp) < cacheDuration) {
          console.log('✅ Item found in cache');
          return cacheEntry.data;
        }

        // 3. THIRD: Try loading from all warehouses
        console.log('🔄 Item not in cache. Searching ALL warehouses...');
        
        // Try by ID first (most efficient - 1 read)
        if (itemId) {
          try {
            const itemDoc = await getDoc(doc(db, 'items', itemId));
            
            if (itemDoc.exists()) {
              const itemData = itemDoc.data();
              
              // Check warehouse permission for transactions
              if (state.userProfile.role === 'warehouse_manager') {
                const allowedWarehouses = state.userProfile.allowed_warehouses || [];
                if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
                  if (!allowedWarehouses.includes(itemData.warehouse_id)) {
                    throw new Error('ليس لديك صلاحية للوصول إلى هذا الصنف من هذا المخزن');
                  }
                }
              }
              
              const convertedItem = InventoryService.convertForDisplay({
                id: itemDoc.id,
                ...itemData
              });

              commit('CACHE_ITEM', {
                itemId: itemId,
                itemData: convertedItem
              });

              console.log('✅ Item fetched from Firestore by ID (1 read)');
              return convertedItem;
            }
          } catch (error) {
            console.log('Item not found by ID:', error.message);
          }
        }

        // 4. FOURTH: Try by code across ALL warehouses
        if (itemCode) {
          const itemsRef = collection(db, 'items');
          const q = query(
            itemsRef,
            where('code', '==', itemCode),
            limit(PERFORMANCE_CONFIG.TRANSACTION_SEARCH_LIMIT)
          );
          
          const snapshot = await getDocs(q);
          
          if (!snapshot.empty) {
            // Filter by warehouse permissions if needed
            const validItems = snapshot.docs.filter(doc => {
              if (state.userProfile.role === 'superadmin') return true;
              
              const itemData = doc.data();
              const allowedWarehouses = state.userProfile.allowed_warehouses || [];
              
              if (allowedWarehouses.includes('all')) return true;
              return allowedWarehouses.includes(itemData.warehouse_id);
            });
            
            if (validItems.length > 0) {
              const doc = validItems[0];
              const itemData = doc.data();
              const convertedItem = InventoryService.convertForDisplay({
                id: doc.id,
                ...itemData
              });

              commit('CACHE_ITEM', {
                itemId: doc.id,
                itemData: convertedItem
              });

              console.log(`✅ Item found by code: ${validItems.length} results`);
              return convertedItem;
            }
          }
        }

        // 5. FIFTH: Try by name prefix search across ALL warehouses
        if (itemName && itemName.length >= 2) {
          const itemsRef = collection(db, 'items');
          const q = query(
            itemsRef,
            where('name', '>=', itemName),
            where('name', '<=', itemName + '\uf8ff'),
            limit(PERFORMANCE_CONFIG.TRANSACTION_SEARCH_LIMIT)
          );
          
          const snapshot = await getDocs(q);
          
          if (!snapshot.empty) {
            // Filter by warehouse permissions if needed
            const validItems = snapshot.docs.filter(doc => {
              if (state.userProfile.role === 'superadmin') return true;
              
              const itemData = doc.data();
              const allowedWarehouses = state.userProfile.allowed_warehouses || [];
              
              if (allowedWarehouses.includes('all')) return true;
              return allowedWarehouses.includes(itemData.warehouse_id);
            });
            
            if (validItems.length > 0) {
              const doc = validItems[0];
              const itemData = doc.data();
              const convertedItem = InventoryService.convertForDisplay({
                id: doc.id,
                ...itemData
              });

              commit('CACHE_ITEM', {
                itemId: doc.id,
                itemData: convertedItem
              });

              console.log(`✅ Item found by name: ${validItems.length} results`);
              return convertedItem;
            }
          }
        }

        // 6. SIXTH: Try loading more inventory items
        console.log('🔄 Loading more items to find the requested item...');
        await dispatch('loadMoreInventory');
        
        // Check again after loading more
        item = state.inventory.find(i => 
          i.id === itemId || 
          (itemCode && i.code === itemCode) ||
          (itemName && i.name === itemName)
        );

        if (item) {
          console.log('✅ Item found after loading more items');
          return item;
        }

        throw new Error('الصنف غير موجود في المخزون المتاح أو ليس لديك صلاحية للوصول إليه');

      } catch (error) {
        console.error('❌ Error getting item:', error);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'خطأ في العثور على الصنف'
        });
        return null;
      }
    },

    // ✅ Search items for transactions (across ALL warehouses)
    async searchItemsForTransactions({ state, dispatch }, { searchTerm, limitResults = 10 }) {
      try {
        console.log('🔍 Searching items for transactions:', searchTerm);

        if (!searchTerm || searchTerm.trim().length < 2) {
          // If no search term, return cached/loaded items
          const localItems = state.inventory.slice(0, limitResults);
          return localItems;
        }

        const term = searchTerm.trim().toLowerCase();

        // 1. Search in loaded inventory first (no reads)
        const localResults = state.inventory.filter(item =>
          item.name?.toLowerCase().includes(term) ||
          item.code?.toLowerCase().includes(term) ||
          item.color?.toLowerCase().includes(term) ||
          item.supplier?.toLowerCase().includes(term)
        ).slice(0, limitResults);

        if (localResults.length >= limitResults) {
          console.log('✅ Items found in loaded inventory:', localResults.length);
          return localResults;
        }

        // 2. Check cache (5 minute cache for transaction searches)
        const cacheDuration = 5 * 60 * 1000;
        if (state.cache.transactionItemsTimestamp && 
            (Date.now() - state.cache.transactionItemsTimestamp) < cacheDuration &&
            state.cache.transactionItems.length > 0) {
          
          const cachedResults = state.cache.transactionItems.filter(item =>
            item.name?.toLowerCase().includes(term) ||
            item.code?.toLowerCase().includes(term) ||
            item.color?.toLowerCase().includes(term)
          ).slice(0, limitResults);
          
          if (cachedResults.length > 0) {
            console.log('✅ Using cached transaction items');
            return cachedResults;
          }
        }

        // 3. Search in Firestore across ALL warehouses
        const itemsRef = collection(db, 'items');
        
        const queries = [];
        
        // Query for code
        queries.push(
          query(
            itemsRef,
            where('code', '>=', term),
            where('code', '<=', term + '\uf8ff'),
            limit(limitResults)
          )
        );
        
        // Query for name
        queries.push(
          query(
            itemsRef,
            where('name', '>=', term),
            where('name', '<=', term + '\uf8ff'),
            limit(limitResults)
          )
        );

        const resultsSet = new Set();
        const allResults = [];

        for (const q of queries) {
          try {
            const snapshot = await getDocs(q);
            
            snapshot.docs.forEach(doc => {
              const itemId = doc.id;
              
              if (!resultsSet.has(itemId)) {
                resultsSet.add(itemId);
                
                const itemData = doc.data();
                
                // Filter by warehouse permissions
                if (state.userProfile.role === 'warehouse_manager') {
                  const allowedWarehouses = state.userProfile.allowed_warehouses || [];
                  if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
                    if (!allowedWarehouses.includes(itemData.warehouse_id)) {
                      return;
                    }
                  }
                }
                
                const convertedItem = InventoryService.convertForDisplay({
                  id: doc.id,
                  ...itemData
                });
                
                allResults.push(convertedItem);
              }
            });
          } catch (error) {
            if (error.code === 'failed-precondition') {
              console.warn('Composite index may be required for this search');
            } else {
              console.error('Search query error:', error);
            }
          }
        }

        // Sort by name for better UX
        const sortedResults = allResults.sort((a, b) => 
          a.name?.localeCompare(b.name || '') || 0
        ).slice(0, limitResults);
        
        console.log(`✅ Items found in Firestore: ${sortedResults.length}`);

        // Update cache
        commit('SET_TRANSACTION_ITEMS_CACHE', {
          items: sortedResults,
          timestamp: Date.now()
        });

        // Also cache individual items
        sortedResults.forEach(item => {
          commit('CACHE_ITEM', {
            itemId: item.id,
            itemData: item
          });
        });

        return sortedResults;

      } catch (error) {
        console.error('❌ Error searching items for transactions:', error);
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في البحث عن الأصناف'
        });
        
        // Fallback to local inventory
        const term = searchTerm?.trim().toLowerCase() || '';
        const fallbackResults = state.inventory.filter(item =>
          item.name?.toLowerCase().includes(term) ||
          item.code?.toLowerCase().includes(term)
        ).slice(0, 10);
        
        return fallbackResults;
      }
    },

    // ✅ Get items from specific warehouse (for transfers)
    async getItemsFromWarehouse({ state, dispatch }, { warehouseId, limitResults = 20 }) {
      try {
        console.log('🔄 Getting items from warehouse:', warehouseId);

        if (!warehouseId) {
          throw new Error('معرف المخزن مطلوب');
        }

        // Check warehouse permission
        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
            if (!allowedWarehouses.includes(warehouseId)) {
              throw new Error('ليس لديك صلاحية للوصول إلى هذا المخزن');
            }
          }
        }

        // First, check loaded inventory
        const localItems = state.inventory.filter(item => item.warehouse_id === warehouseId);
        if (localItems.length >= limitResults) {
          console.log('✅ Found items in loaded inventory:', localItems.length);
          return localItems.slice(0, limitResults);
        }

        // If not enough, query Firestore
        const itemsRef = collection(db, 'items');
        
        const q = query(
          itemsRef,
          where('warehouse_id', '==', warehouseId),
          orderBy('name'),
          limit(limitResults)
        );

        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => {
          const itemData = doc.data();
          return InventoryService.convertForDisplay({
            id: doc.id,
            ...itemData
          });
        });

        console.log(`✅ Found ${items.length} items in warehouse ${warehouseId}`);
        
        // Cache these items
        items.forEach(item => {
          commit('CACHE_ITEM', {
            itemId: item.id,
            itemData: item
          });
        });

        return items;

      } catch (error) {
        console.error('❌ Error getting items from warehouse:', error);
        
        if (error.code === 'failed-precondition') {
          // Fallback to searching all items and filtering client-side
          console.warn('Using client-side filtering for warehouse items...');
          
          const allItems = await dispatch('searchItemsForTransactions', {
            searchTerm: '',
            limitResults: 50
          });
          
          return allItems.filter(item => item.warehouse_id === warehouseId);
        }
        
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'خطأ في تحميل الأصناف من المخزن'
        });
        return [];
      }
    },

    // ✅ Get all warehouses for the current user
    async getAvailableWarehousesForTransactions({ getters }) {
      try {
        console.log('🔄 Getting available warehouses for transactions...');
        
        const accessibleWarehouses = getters.accessibleWarehouses;
        const accessiblePrimaryWarehouses = getters.accessiblePrimaryWarehouses;
        
        return {
          all: accessibleWarehouses,
          primary: accessiblePrimaryWarehouses,
          dispatch: getters.accessibleDispatchWarehouses
        };
        
      } catch (error) {
        console.error('Error getting available warehouses:', error);
        return { all: [], primary: [], dispatch: [] };
      }
    },

    async searchItems({ state, dispatch }, { searchTerm, limitResults = 5 }) {
      try {
        console.log('🔍 Searching items:', searchTerm);

        if (!searchTerm || searchTerm.trim().length < 2) {
          return [];
        }

        const term = searchTerm.trim().toLowerCase();

        const localResults = state.inventory.filter(item => 
          item.name?.toLowerCase().includes(term) || 
          item.code?.toLowerCase().includes(term) ||
          item.color?.toLowerCase().includes(term)
        ).slice(0, limitResults);

        if (localResults.length > 0) {
          console.log('✅ Items found in local inventory:', localResults.length);
          return localResults;
        }

        const itemsRef = collection(db, 'items');
        
        const queries = [
          query(
            itemsRef,
            where('code', '>=', term),
            where('code', '<=', term + '\uf8ff'),
            limit(limitResults)
          ),
          query(
            itemsRef,
            where('name', '>=', term),
            where('name', '<=', term + '\uf8ff'),
            limit(limitResults)
          )
        ];

        const resultsSet = new Set();
        const allResults = [];

        for (const q of queries) {
          try {
            const snapshot = await getDocs(q);
            snapshot.docs.forEach(doc => {
              const itemId = doc.id;
              if (!resultsSet.has(itemId)) {
                resultsSet.add(itemId);
                const itemData = doc.data();
                
                if (state.userProfile.role === 'warehouse_manager') {
                  const allowedWarehouses = state.userProfile.allowed_warehouses || [];
                  if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
                    if (!allowedWarehouses.includes(itemData.warehouse_id)) {
                      return;
                    }
                  }
                }
                
                allResults.push({
                  id: doc.id,
                  ...itemData,
                  _display: InventoryService.convertForDisplay({
                    id: doc.id,
                    ...itemData
                  })
                });
              }
            });
          } catch (error) {
            if (error.code === 'failed-precondition') {
              console.warn('Composite index may be required for this search');
            } else {
              throw error;
            }
          }
        }

        const limitedResults = allResults.slice(0, limitResults);
        
        console.log(`✅ Items found in Firestore: ${limitedResults.length}`);
        
        limitedResults.forEach(item => {
          state.cache.itemCache[item.id] = {
            data: item._display,
            timestamp: Date.now()
          };
        });

        return limitedResults.map(item => item._display);

      } catch (error) {
        console.error('❌ Error searching items:', error);
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في البحث عن الأصناف'
        });
        return [];
      }
    },

    async getItemsByIds({ dispatch }, itemIds) {
      try {
        console.log('🔍 Getting multiple items:', itemIds.length);

        if (!Array.isArray(itemIds) || itemIds.length === 0) {
          return [];
        }

        const batchLimit = 10;
        const limitedIds = itemIds.slice(0, batchLimit);

        const promises = limitedIds.map(id => 
          dispatch('getItemById', { itemId: id })
        );

        const results = await Promise.all(promises);
        const validResults = results.filter(item => item !== null);

        console.log(`✅ Got ${validResults.length} items`);
        return validResults;

      } catch (error) {
        console.error('❌ Error getting multiple items:', error);
        return [];
      }
    },

    clearItemCache({ commit }) {
      commit('CLEAR_CACHE');
      console.log('🧹 Item cache cleared');
    },

    showNotification({ commit, getters }, notification) {
      if (!notification?.message) {
        console.warn('Invalid notification:', notification);
        return;
      }

      const finalNotification = {
        type: 'info',
        title: '',
        message: '',
        duration: 5000,
        ...notification
      };

      commit('ADD_NOTIFICATION', finalNotification);

      if (finalNotification.type === 'error') {
        console.error('Notification Error:', finalNotification.message);
      }
    },

    async initializeAuth({ commit, dispatch }) {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            commit('SET_USER', user);
            try {
              await dispatch('loadUserProfile', user);
            } catch (error) {
              console.error('Error in auth initialization:', error);
              commit('SET_AUTH_ERROR', 'فشل في تحميل بيانات المستخدم');
            }
          } else {
            commit('SET_USER', null);
            commit('SET_USER_PROFILE', null);
            commit('SET_INVENTORY', []);
            commit('SET_TRANSACTIONS', []);
            commit('SET_ITEM_HISTORY', []);
            commit('SET_RECENT_TRANSACTIONS', []);
            commit('SET_WAREHOUSES_LOADED', false);
            commit('SET_REQUIRES_COMPOSITE_INDEX', false);
            commit('CLEAR_CACHE');
          }
          resolve();
        });
      });
    },

    async loadUserProfile({ commit, dispatch }, user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (!userDoc.exists()) {
          const tempProfile = {
            email: user.email,
            name: user.email.split('@')[0],
            role: 'pending',
            allowed_warehouses: [],
            permissions: ['view_reports'],
            is_active: false,
            profile_complete: false,
            needs_approval: true,
            created_at: new Date()
          };

          await setDoc(doc(db, 'users', user.uid), tempProfile);
          commit('SET_USER_PROFILE', tempProfile);

          dispatch('showNotification', {
            type: 'warning',
            message: 'حسابك قيد المراجعة. يرجى الانتظار حتى يتم تفعيله من قبل المشرف.'
          });

          await dispatch('notifyAdminAboutPendingUser', {
            userId: user.uid,
            userEmail: user.email
          });

          return;
        }

        const userProfile = userDoc.data();

        if (userProfile.is_active === false) {
          dispatch('showNotification', {
            type: 'error',
            message: 'حسابك غير نشط. يرجى التواصل مع المشرف.'
          });
          await dispatch('logout');
          return;
        }

        commit('SET_USER_PROFILE', userProfile);

        dispatch('showNotification', {
          type: 'success',
          message: `مرحباً ${userProfile.name}! تم تسجيل الدخول بنجاح.`
        });

        // Load warehouses and data
        await dispatch('loadWarehouses');
        await dispatch('fetchInventoryOnce'); // ✅ RESTORED: Load all items on login
        await dispatch('fetchTransactions');
        dispatch('getRecentTransactions');

      } catch (error) {
        console.error('Error loading user profile:', error);
        dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تحميل بيانات المستخدم'
        });
        await dispatch('logout');
      }
    },

    async notifyAdminAboutPendingUser({ dispatch }, { userId, userEmail }) {
      try {
        const notificationRef = doc(collection(db, 'admin_notifications'));
        await setDoc(notificationRef, {
          type: 'new_user_pending',
          user_id: userId,
          user_email: userEmail,
          timestamp: new Date(),
          message: 'مستخدم جديد يحتاج إلى التفعيل',
          read: false
        });
      } catch (error) {
        console.error('Error notifying admin:', error);
      }
    },

    async login({ commit, dispatch }, { email, password }) {
      commit('SET_LOADING', true);
      commit('SET_AUTH_ERROR', null);

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await dispatch('loadUserProfile', user);
        commit('SET_USER', user);

        return user;

      } catch (error) {
        const errorMessage = getAuthErrorMessage(error.code);
        commit('SET_AUTH_ERROR', errorMessage);

        dispatch('showNotification', {
          type: 'error',
          message: errorMessage
        });

        throw new Error(errorMessage);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async logout({ commit, dispatch }) {
      try {
        await signOut(auth);
        commit('SET_USER', null);
        commit('SET_USER_PROFILE', null);
        commit('SET_INVENTORY', []);
        commit('SET_TRANSACTIONS', []);
        commit('SET_ITEM_HISTORY', []);
        commit('SET_RECENT_TRANSACTIONS', []);
        commit('SET_AUTH_ERROR', null);
        commit('SET_OPERATION_ERROR', null);
        commit('SET_WAREHOUSES_LOADED', false);
        commit('SET_REQUIRES_COMPOSITE_INDEX', false);
        commit('CLEAR_CACHE');
        commit('SET_INVENTORY_LAST_FETCHED', null);
        commit('RESET_INVENTORY_PAGINATION'); // Reset pagination

        dispatch('showNotification', {
          type: 'info',
          message: 'تم تسجيل الخروج بنجاح'
        });

      } catch (error) {
        console.error('Logout error:', error);
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تسجيل الخروج'
        });
        throw error;
      }
    },

    async fetchTransactions({ commit, state, dispatch }) {
      commit('SET_TRANSACTIONS_LOADING', true);
      
      try {
        if (!state.userProfile) {
          console.log('Cannot load transactions: User not authenticated');
          commit('SET_TRANSACTIONS', []);
          return [];
        }

        const transactionsQuery = query(
          collection(db, 'transactions'),
          orderBy('timestamp', 'desc'),
          limit(PERFORMANCE_CONFIG.TRANSACTIONS_PAGE_SIZE)
        );

        const snapshot = await getDocs(transactionsQuery);
        console.log('Transactions loaded via getDocs:', snapshot.size, 'transactions');

        const transactions = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            _display: {
              from_warehouse: WAREHOUSE_LABELS[data.from_warehouse] || data.from_warehouse,
              to_warehouse: WAREHOUSE_LABELS[data.to_warehouse] ||
                           DESTINATION_LABELS[data.to_warehouse] ||
                           data.to_warehouse,
            }
          };
        });

        console.log('Transactions processed:', transactions.length);
        commit('SET_TRANSACTIONS', transactions);
        return transactions;

      } catch (error) {
        console.error('Error loading transactions:', error);
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تحميل الحركات'
        });
        commit('SET_TRANSACTIONS', []);
        return [];
      } finally {
        commit('SET_TRANSACTIONS_LOADING', false);
      }
    },

    async getRecentTransactions({ commit, dispatch, state }) {
      commit('SET_RECENT_TRANSACTIONS_LOADING', true);

      try {
        if (!state.userProfile) {
          console.log('Cannot load recent transactions: User not authenticated');
          return [];
        }

        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const transactionsQuery = query(
          collection(db, 'transactions'),
          where('timestamp', '>=', oneDayAgo),
          orderBy('timestamp', 'desc'),
          limit(PERFORMANCE_CONFIG.RECENT_TRANSACTIONS_LIMIT)
        );

        const snapshot = await getDocs(transactionsQuery);
        const transactions = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            _display: {
              from_warehouse: state.cache.warehouseLabels[data.from_warehouse] || 
                            WAREHOUSE_LABELS[data.from_warehouse] || 
                            data.from_warehouse,
              to_warehouse: state.cache.warehouseLabels[data.to_warehouse] ||
                           WAREHOUSE_LABELS[data.to_warehouse] ||
                           DESTINATION_LABELS[data.to_warehouse] ||
                           data.to_warehouse,
            }
          };
        });

        console.log('Recent transactions loaded:', transactions.length);
        commit('SET_RECENT_TRANSACTIONS', transactions);

        return transactions;

      } catch (error) {
        console.error('Error loading recent transactions:', error);
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تحميل الحركات الحديثة'
        });
        return [];
      } finally {
        commit('SET_RECENT_TRANSACTIONS_LOADING', false);
      }
    },

    async loadWarehouses({ commit, dispatch, state }) {
      try {
        if (state.warehousesLoaded && 
            state.warehousesCacheTimestamp && 
            Date.now() - state.warehousesCacheTimestamp < PERFORMANCE_CONFIG.CACHE_DURATION) {
          console.log('Using cached warehouses');
          return state.warehouses;
        }

        console.log('Loading warehouses from Firestore...');

        await dispatch('initializeDefaultWarehouses');
        await dispatch('fetchWarehouses');

        commit('SET_WAREHOUSES_LOADED', true);
        console.log('Warehouses loaded successfully');

        return state.warehouses;

      } catch (error) {
        console.error('Error loading warehouses:', error);
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تحميل المخازن'
        });
        commit('SET_WAREHOUSES_LOADED', false);
        return [];
      }
    },

    async fetchWarehouses({ commit, state, dispatch }) {
      try {
        if (!state.userProfile) {
          console.log('Cannot load warehouses: User not authenticated');
          return [];
        }

        console.log('Loading warehouses via getDocs...');
        const warehousesQuery = query(
          collection(db, 'warehouses'),
          orderBy('name_ar')
        );

        const snapshot = await getDocs(warehousesQuery);
        const warehouses = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log('Warehouses loaded:', warehouses.length);
        commit('SET_WAREHOUSES', warehouses);
        
        return warehouses;

      } catch (error) {
        console.error('Error loading warehouses:', error);
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تحميل المخازن'
        });
        return [];
      }
    },

    async initializeDefaultWarehouses({ commit, dispatch }) {
      try {
        console.log('Checking/initializing default warehouses...');

        const defaultWarehouses = [
          {
            id: 'main_warehouse',
            name_ar: 'مخزن شارع الشيخ',
            name_en: 'Main Warehouse',
            type: 'primary',
            is_main: true,
            status: 'active',
            capacity: 1000,
            location: 'شارع الشيخ، المنوفية',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 'tera_warehouse',
            name_ar: 'مخزن الترعه',
            name_en: 'Teraa Warehouse',
            type: 'primary',
            status: 'active',
            capacity: 800,
            location: 'الترعة، المنوفية',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 'shobeen_warehouse',
            name_ar: 'مخزن موقف شبين',
            name_en: 'Shobeen Warehouse',
            type: 'primary',
            status: 'active',
            capacity: 600,
            location: 'موقف شبين، المنوفية',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 'hyper_warehouse',
            name_ar: 'مخزن هايبر التهامي',
            name_en: 'Hyper El Tahamy Warehouse',
            type: 'primary',
            status: 'active',
            capacity: 500,
            location: 'هايبر التهامي، المنوفية',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 'matbaa_warehouse',
            name_ar: 'مخزن المطبعه',
            name_en: 'Matbaa Warehouse',
            type: 'primary',
            status: 'active',
            capacity: 400,
            location: 'المطبعة، المنوفية',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 'ghabashi_warehouse',
            name_ar: 'مخزن الغباشي',
            name_en: 'Ghabashi Warehouse',
            type: 'primary',
            status: 'active',
            capacity: 300,
            location: 'الغباشي، المنوفية',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 'factory',
            name_ar: 'صرف الي مصنع البران',
            name_en: 'Al Bran Factory Dispatch',
            type: 'dispatch',
            status: 'active',
            description: 'مصنع البران للتصنيع',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 'zahra',
            name_ar: 'صرف الي مخزن الزهراء',
            name_en: 'Al Zahra Warehouse Dispatch',
            type: 'dispatch',
            status: 'active',
            description: 'مخزن الزهراء للتوزيع',
            created_at: new Date(),
            updated_at: new Date()
          }
        ];

        const batch = writeBatch(db);
        let needsInitialization = false;

        for (const warehouse of defaultWarehouses) {
          const warehouseRef = doc(db, 'warehouses', warehouse.id);
          const warehouseDoc = await getDoc(warehouseRef);

          if (!warehouseDoc.exists()) {
            needsInitialization = true;
            batch.set(warehouseRef, warehouse);
            console.log(`Adding warehouse: ${warehouse.name_ar}`);
          }
        }

        if (needsInitialization) {
          await batch.commit();
          console.log('Default warehouses initialized successfully');

          dispatch('showNotification', {
            type: 'success',
            message: 'تم تهيئة المخازن الافتراضية'
          });
        } else {
          console.log('Warehouses already exist, skipping initialization');
        }

      } catch (error) {
        console.error('Error initializing default warehouses:', error);
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تهيئة المخازن الافتراضية'
        });
        throw error;
      }
    },

    async addInventoryItem({ commit, dispatch, state }, { itemData, isAddingCartons = true }) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }
        if (!['superadmin', 'warehouse_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لإضافة أصناف');
        }
        if (!state.user?.uid) {
          throw new Error('معرف المستخدم غير متوفر');
        }

        if (!itemData.name?.trim() || !itemData.code?.trim() || !itemData.color?.trim() || !itemData.warehouse_id) {
          throw new Error('جميع الحقول المطلوبة يجب أن تكون مملوءة (الاسم، الكود، اللون، المخزن)');
        }

        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (!allowedWarehouses.includes(itemData.warehouse_id)) {
            throw new Error('ليس لديك صلاحية لإضافة أصناف في هذا المخزن');
          }
        }

        const totalQuantity = InventoryService.calculateTotalQuantity(
          itemData.cartons_count,
          itemData.per_carton_count,
          itemData.single_bottles_count
        );

        if (totalQuantity <= 0) {
          throw new Error('يجب إدخال كمية صحيحة');
        }

        const cleanedData = {
          name: itemData.name.trim(),
          code: itemData.code.trim(),
          color: itemData.color.trim(),
          warehouse_id: itemData.warehouse_id,
          cartons_count: Number(itemData.cartons_count) || 0,
          per_carton_count: Number(itemData.per_carton_count) || 12,
          single_bottles_count: Number(itemData.single_bottles_count) || 0,
          supplier: itemData.supplier?.trim() || '',
          item_location: itemData.item_location?.trim() || '',
          notes: itemData.notes?.trim() || ''
        };

        const result = await InventoryService.addOrUpdateItem(
          cleanedData,
          state.user.uid,
          isAddingCartons
        );

        await dispatch('refreshInventory');

        commit('ADD_RECENT_TRANSACTION', {
          type: TRANSACTION_TYPES.ADD,
          item_id: result.id,
          timestamp: new Date(),
          notes: cleanedData.notes || 'عملية إضافة'
        });

        dispatch('showNotification', {
          type: 'success',
          message: `تم ${result.type === 'created' ? 'إضافة' : 'تحديث'} الصنف "${cleanedData.name}" بنجاح`
        });

        return result;

      } catch (error) {
        console.error('Error adding inventory item:', error);
        const errorMessage = error.message || 'حدث خطأ غير متوقع أثناء إضافة الصنف';
        commit('SET_OPERATION_ERROR', errorMessage);

        dispatch('showNotification', {
          type: 'error',
          message: errorMessage
        });

        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async transferItem({ commit, dispatch, state }, transferData) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }
        if (!['superadmin', 'warehouse_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لنقل الأصناف');
        }
        if (!state.user?.uid) {
          throw new Error('معرف المستخدم غير متوفر');
        }

        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          
          if (!allowedWarehouses.includes(transferData.from_warehouse_id)) {
            throw new Error('ليس لديك صلاحية للنقل من هذا المخزن');
          }
          
          if (!allowedWarehouses.includes(transferData.to_warehouse_id)) {
            throw new Error('ليس لديك صلاحية للنقل إلى هذا المخزن');
          }
        }

        const result = await InventoryService.transferItem(transferData, state.user.uid);

        await dispatch('refreshInventory');

        commit('ADD_RECENT_TRANSACTION', {
          type: TRANSACTION_TYPES.TRANSFER,
          item_id: transferData.itemId,
          timestamp: new Date(),
          notes: 'نقل بين المخازن'
        });

        dispatch('showNotification', {
          type: 'success',
          message: 'تم نقل الصنف بنجاح'
        });

        return result;

      } catch (error) {
        console.error('Error transferring item:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ أثناء نقل الصنف'
        });

        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async dispatchItem({ commit, dispatch, state }, dispatchData) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        const canDispatch = state.userProfile.role === 'superadmin' || 
                           (state.userProfile.role === 'warehouse_manager' && 
                            state.userProfile.permissions?.includes('dispatch_items'));

        if (!canDispatch) {
          throw new Error('ليس لديك صلاحية لصرف الأصناف');
        }

        if (!state.user?.uid) {
          throw new Error('معرف المستخدم غير متوفر');
        }

        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (!allowedWarehouses.includes(dispatchData.from_warehouse_id)) {
            throw new Error('ليس لديك صلاحية للصرف من هذا المخزن');
          }
        }

        const result = await InventoryService.dispatchItem(dispatchData, state.user.uid);

        await dispatch('refreshInventory');

        commit('ADD_RECENT_TRANSACTION', {
          type: TRANSACTION_TYPES.DISPATCH,
          item_id: dispatchData.itemId,
          timestamp: new Date(),
          notes: 'صرف إلى خارجي'
        });

        dispatch('showNotification', {
          type: 'success',
          message: 'تم صرف الصنف بنجاح'
        });

        return result;

      } catch (error) {
        console.error('Error dispatching item:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ أثناء صرف الصنف'
        });

        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async updateItem({ commit, dispatch, state }, { itemId, itemData }) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        if (!['superadmin', 'warehouse_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لتعديل الأصناف');
        }

        if (!state.user?.uid) {
          throw new Error('معرف المستخدم غير متوفر');
        }

        const itemRef = doc(db, 'items', itemId);
        const itemDoc = await getDoc(itemRef);

        if (!itemDoc.exists()) {
          throw new Error('الصنف غير موجود');
        }

        const existingItem = itemDoc.data();

        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          const warehouseId = itemData.warehouse_id || existingItem.warehouse_id;
          if (allowedWarehouses.length > 0 && !allowedWarehouses.includes(warehouseId)) {
            throw new Error('ليس لديك صلاحية لتعديل أصناف في هذا المخزن');
          }
        }

        const name = itemData.name?.trim() || existingItem.name;
        const code = itemData.code?.trim() || existingItem.code;
        const color = itemData.color?.trim() || existingItem.color;
        const warehouse_id = itemData.warehouse_id || existingItem.warehouse_id;

        if (!name || !code || !color || !warehouse_id) {
          throw new Error('جميع الحقول المطلوبة يجب أن تكون مملوءة (الاسم، الكود، اللون، المخزن)');
        }

        const newCartonsCount = Number(itemData.cartons_count) || existingItem.cartons_count || 0;
        const newPerCartonCount = Number(itemData.per_carton_count) || existingItem.per_carton_count || 12;
        const newSingleBottlesCount = Number(itemData.single_bottles_count) || existingItem.single_bottles_count || 0;
        const newTotalQuantity = InventoryService.calculateTotalQuantity(
          newCartonsCount,
          newPerCartonCount,
          newSingleBottlesCount
        );

        if (newTotalQuantity < 0) {
          throw new Error('يجب أن تكون الكمية أكبر من أو تساوي صفر');
        }

        const updateData = {
          name: name,
          code: code,
          color: color,
          warehouse_id: warehouse_id,
          cartons_count: newCartonsCount,
          per_carton_count: newPerCartonCount,
          single_bottles_count: newSingleBottlesCount,
          remaining_quantity: newTotalQuantity,
          total_added: itemData.total_added || existingItem.total_added,
          supplier: itemData.supplier?.trim() || existingItem.supplier || '',
          item_location: itemData.item_location?.trim() || existingItem.item_location || '',
          notes: itemData.notes?.trim() || existingItem.notes || '',
          photo_url: itemData.photo_url || existingItem.photo_url || '',
          updated_at: new Date().toISOString(),
          updated_by: state.user.uid
        };

        const quantityDiff = newTotalQuantity - (existingItem.remaining_quantity || 0);

        await updateDoc(itemRef, updateData);

        if (quantityDiff !== 0 || existingItem.warehouse_id !== warehouse_id) {
          const transactionData = {
            type: 'UPDATE',
            item_id: itemId,
            item_name: updateData.name,
            item_code: updateData.code,
            from_warehouse: existingItem.warehouse_id !== warehouse_id ? existingItem.warehouse_id : null,
            to_warehouse: warehouse_id,
            cartons_delta: newCartonsCount - (existingItem.cartons_count || 0),
            per_carton_updated: newPerCartonCount,
            single_delta: newSingleBottlesCount - (existingItem.single_bottles_count || 0),
            total_delta: quantityDiff,
            new_remaining: newTotalQuantity,
            user_id: state.user.uid,
            timestamp: new Date(),
            notes: `تعديل الصنف: ${itemData.notes || ''}`.trim(),
            photo_changed: !!itemData.photo_url && itemData.photo_url !== existingItem.photo_url
          };

          await addDoc(collection(db, 'transactions'), transactionData);
        }

        await dispatch('refreshInventory');

        dispatch('showNotification', {
          type: 'success',
          message: `تم تحديث الصنف "${updateData.name}" بنجاح`
        });

        return { success: true, data: updateData };

      } catch (error) {
        console.error('Error updating item:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في تحديث الصنف'
        });

        return { success: false, error: error.message };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async deleteItem({ commit, dispatch, state }, itemId) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        if (state.userProfile.role === 'superadmin') {
          // Superadmin can delete any item
        } else if (state.userProfile.role === 'warehouse_manager') {
          const canDelete = state.userProfile.permissions?.includes('full_access') || 
                           state.userProfile.permissions?.includes('delete_items');
          if (!canDelete) {
            throw new Error('ليس لديك صلاحية لحذف الأصناف');
          }
        } else {
          throw new Error('ليس لديك صلاحية لحذف الأصناف');
        }

        if (!state.user?.uid) {
          throw new Error('معرف المستخدم غير متوفر');
        }

        const itemRef = doc(db, 'items', itemId);
        const itemDoc = await getDoc(itemRef);

        if (!itemDoc.exists()) {
          throw new Error('الصنف غير موجود');
        }

        const itemData = itemDoc.data();

        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (allowedWarehouses.length > 0 && !allowedWarehouses.includes(itemData.warehouse_id)) {
            throw new Error('ليس لديك صلاحية لحذف أصناف من هذا المخزن');
          }
        }

        const transactionData = {
          type: 'DELETE',
          item_id: itemId,
          item_name: itemData.name,
          item_code: itemData.code,
          from_warehouse: itemData.warehouse_id,
          to_warehouse: null,
          cartons_delta: -(itemData.cartons_count || 0),
          per_carton_updated: itemData.per_carton_count || 12,
          single_delta: -(itemData.single_bottles_count || 0),
          total_delta: -(itemData.remaining_quantity || 0),
          new_remaining: 0,
          user_id: state.user.uid,
          timestamp: new Date(),
          notes: 'حذف الصنف نهائياً',
          photo_changed: false
        };

        await addDoc(collection(db, 'transactions'), transactionData);

        await deleteDoc(itemRef);

        commit('REMOVE_ITEM_FROM_CACHE', itemId);

        await dispatch('refreshInventory');

        dispatch('showNotification', {
          type: 'success',
          message: `تم حذف الصنف "${itemData.name}" بنجاح`
        });

        return { 
          success: true, 
          message: 'تم حذف الصنف بنجاح' 
        };

      } catch (error) {
        console.error('Error deleting item:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في حذف الصنف'
        });

        return { 
          success: false, 
          error: error.message || 'حدث خطأ في حذف الصنف' 
        };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async createWarehouse({ commit, dispatch, state }, warehouseData) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (state.userProfile?.role !== 'superadmin') {
          throw new Error('ليس لديك صلاحية لإضافة مخازن');
        }

        if (!warehouseData.name_ar?.trim()) {
          throw new Error('اسم المخزن (عربي) مطلوب');
        }

        if (!warehouseData.type) {
          throw new Error('نوع المخزن مطلوب');
        }

        const newWarehouse = {
          name_ar: warehouseData.name_ar.trim(),
          name_en: warehouseData.name_en?.trim() || '',
          type: warehouseData.type,
          status: warehouseData.status || 'active',
          capacity: warehouseData.capacity ? parseInt(warehouseData.capacity) : null,
          location: warehouseData.location?.trim() || '',
          description: warehouseData.description?.trim() || '',
          is_main: warehouseData.is_main || false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        if (newWarehouse.is_main) {
          const existingMainWarehouse = state.warehouses.find(w => w.is_main);
          if (existingMainWarehouse && existingMainWarehouse.id !== warehouseData.id) {
            throw new Error('يوجد بالفعل مخزن رئيسي في النظام');
          }
        }

        const warehouseRef = await addDoc(collection(db, 'warehouses'), newWarehouse);

        await dispatch('fetchWarehouses');

        dispatch('showNotification', {
          type: 'success',
          message: `تم إضافة المخزن "${newWarehouse.name_ar}" بنجاح`
        });

        return { success: true, id: warehouseRef.id, data: newWarehouse };

      } catch (error) {
        console.error('Error creating warehouse:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في إضافة المخزن'
        });

        return { success: false, error: error.message };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async updateWarehouse({ commit, dispatch, state }, { warehouseId, warehouseData }) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (state.userProfile?.role !== 'superadmin') {
          throw new Error('ليس لديك صلاحية لتعديل المخازن');
        }

        const warehouseRef = doc(db, 'warehouses', warehouseId);
        const warehouseDoc = await getDoc(warehouseRef);

        if (!warehouseDoc.exists()) {
          throw new Error('المخزن غير موجود');
        }

        const existingWarehouse = warehouseDoc.data();

        if (!warehouseData.name_ar?.trim()) {
          throw new Error('اسم المخزن (عربي) مطلوب');
        }

        const updateData = {
          name_ar: warehouseData.name_ar.trim(),
          name_en: warehouseData.name_en?.trim() || existingWarehouse.name_en,
          type: warehouseData.type || existingWarehouse.type,
          status: warehouseData.status || existingWarehouse.status,
          capacity: warehouseData.capacity ? parseInt(warehouseData.capacity) : existingWarehouse.capacity,
          location: warehouseData.location?.trim() || existingWarehouse.location,
          description: warehouseData.description?.trim() || existingWarehouse.description,
          is_main: warehouseData.is_main !== undefined ? warehouseData.is_main : existingWarehouse.is_main,
          updated_at: new Date().toISOString()
        };

        if (updateData.is_main && !existingWarehouse.is_main) {
          const existingMainWarehouse = state.warehouses.find(w => w.is_main && w.id !== warehouseId);
          if (existingMainWarehouse) {
            throw new Error('يوجد بالفعل مخزن رئيسي في النظام');
          }
        }

        await updateDoc(warehouseRef, updateData);

        if (existingWarehouse.is_main && !updateData.is_main) {
          const newMainWarehouse = state.warehouses.find(w => w.is_main && w.id !== warehouseId);
          if (!newMainWarehouse) {
            throw new Error('يجب أن يكون هناك مخزن رئيسي واحد على الأقل في النظام');
          }
        }

        await dispatch('fetchWarehouses');

        dispatch('showNotification', {
          type: 'success',
          message: `تم تحديث المخزن "${updateData.name_ar}" بنجاح`
        });

        return { success: true, data: updateData };

      } catch (error) {
        console.error('Error updating warehouse:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في تحديث المخزن'
        });

        return { success: false, error: error.message };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async deleteWarehouse({ commit, dispatch, state }, warehouseId) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (state.userProfile?.role !== 'superadmin') {
          throw new Error('ليس لديك صلاحية لحذف المخازن');
        }

        const warehouseRef = doc(db, 'warehouses', warehouseId);
        const warehouseDoc = await getDoc(warehouseRef);

        if (!warehouseDoc.exists()) {
          throw new Error('المخزن غير موجود');
        }

        const warehouseData = warehouseDoc.data();

        if (warehouseData.is_main) {
          throw new Error('لا يمكن حذف المخزن الرئيسي');
        }

        const itemsQuery = query(
          collection(db, 'items'),
          where('warehouse_id', '==', warehouseId),
          limit(1)
        );

        const itemsSnapshot = await getDocs(itemsQuery);
        if (!itemsSnapshot.empty) {
          throw new Error('لا يمكن حذف المخزن لأنه يحتوي على أصناف. يرجى نقل أو حذف الأصناف أولاً.');
        }

        const fromTransactionsQuery = query(
          collection(db, 'transactions'),
          where('from_warehouse', '==', warehouseId),
          limit(1)
        );

        const fromTransactionsSnapshot = await getDocs(fromTransactionsQuery);
        if (!fromTransactionsSnapshot.empty) {
          throw new Error('لا يمكن حذف المخزن لأنه مرتبط بحركات سابقة كمصدر.');
        }

        const toTransactionsQuery = query(
          collection(db, 'transactions'),
          where('to_warehouse', '==', warehouseId),
          limit(1)
        );

        const toTransactionsSnapshot = await getDocs(toTransactionsQuery);
        if (!toTransactionsSnapshot.empty) {
          throw new Error('لا يمكن حذف المخزن لأنه مرتبط بحركات سابقة كوجهة.');
        }

        await deleteDoc(warehouseRef);

        await dispatch('fetchWarehouses');

        dispatch('showNotification', {
          type: 'success',
          message: `تم حذف المخزن "${warehouseData.name_ar}" بنجاح`
        });

        return { 
          success: true, 
          message: 'تم حذف المخزن بنجاح' 
        };

      } catch (error) {
        console.error('Error deleting warehouse:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في حذف المخزن'
        });

        return { 
          success: false, 
          error: error.message || 'حدث خطأ في حذف المخزن' 
        };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async loadAllUsers({ commit, dispatch, getters }) {
      commit('SET_USERS_LOADING', true);

      try {
        if (!getters.canManageUsers) {
          throw new Error('ليس لديك صلاحية لعرض المستخدمين');
        }

        const result = await UserService.getUsers();

        if (result.success) {
          commit('SET_ALL_USERS', result.data);
          return result.data;
        } else {
          throw new Error(result.error || 'فشل في تحميل المستخدمين');
        }
      } catch (error) {
        console.error('Error loading users:', error);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في تحميل المستخدمين'
        });
        throw error;
      } finally {
        commit('SET_USERS_LOADING', false);
      }
    },

    async createUser({ commit, dispatch, getters, state }, userData) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        const currentUser = state.user;
        const currentUserProfile = state.userProfile;

        if (!currentUser || !currentUserProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        if (currentUserProfile.role !== 'superadmin') {
          throw new Error('ليس لديك صلاحية لإضافة مستخدمين');
        }

        const superadminCredentials = {
          uid: currentUser.uid,
          email: currentUser.email,
          role: currentUserProfile.role
        };

        const result = await UserService.createUser(userData, superadminCredentials);

        if (result.success) {
          dispatch('showNotification', {
            type: 'success',
            message: result.message || `تم إضافة المستخدم "${userData.name}" بنجاح`
          });

          return { success: true, data: result.data, message: result.message };
        } else {
          throw new Error(result.error || 'فشل في إنشاء المستخدم');
        }
      } catch (error) {
        console.error('Error creating user:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في إضافة المستخدم'
        });

        return { success: false, error: error.message };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async updateUser({ commit, dispatch, getters }, { userId, userData }) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!getters.canManageUsers) {
          throw new Error('ليس لديك صلاحية لتحديث المستخدمين');
        }

        const result = await UserService.updateUser(userId, userData);

        if (result.success) {
          if (userId === getters.user?.uid) {
            const updatedProfile = {
              ...getters.userProfile,
              ...userData
            };
            commit('SET_USER_PROFILE', updatedProfile);
          }

          dispatch('showNotification', {
            type: 'success',
            message: result.message || 'تم تحديث المستخدم بنجاح'
          });

          return { success: true, data: result.data, message: result.message };
        } else {
          throw new Error(result.error || 'فشل في تحديث المستخدم');
        }
      } catch (error) {
        console.error('Error updating user:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في تحديث المستخدم'
        });

        return { success: false, error: error.message };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async deleteUser({ commit, dispatch, getters }, userId) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!getters.canManageUsers) {
          throw new Error('ليس لديك صلاحية لحذف المستخدمين');
        }

        const result = await UserService.deleteUser(userId);

        if (result.success) {
          dispatch('showNotification', {
            type: 'success',
            message: result.message || 'تم حذف المستخدم بنجاح'
          });

          return { success: true, message: result.message };
        } else {
          throw new Error(result.error || 'فشل في حذف المستخدم');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في حذف المستخدم'
        });

        return { success: false, error: error.message };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async updateUserStatus({ commit, dispatch, getters }, { userId, isActive }) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!getters.canManageUsers) {
          throw new Error('ليس لديك صلاحية لتغيير حالة المستخدمين');
        }

        const result = await UserService.updateUserStatus(userId, isActive);

        if (result.success) {
          dispatch('showNotification', {
            type: 'success',
            message: result.message || `تم ${isActive ? 'تفعيل' : 'تعطيل'} المستخدم بنجاح`
          });

          return { success: true, message: result.message };
        } else {
          throw new Error(result.error || 'فشل في تغيير حالة المستخدم');
        }
      } catch (error) {
        console.error('Error updating user status:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في تغيير حالة المستخدم'
        });

        return { success: false, error: error.message };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async getUserStats({ commit, dispatch, getters }) {
      try {
        if (!getters.canManageUsers) {
          throw new Error('ليس لديك صلاحية لعرض إحصائيات المستخدمين');
        }

        const result = await UserService.getUserStats();

        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.error || 'فشل في تحميل إحصائيات المستخدمين');
        }
      } catch (error) {
        console.error('Error loading user stats:', error);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في تحميل إحصائيات المستخدمين'
        });
        throw error;
      }
    },

    updateFilters({ commit }, filters) {
      commit('SET_FILTERS', filters);
    },

    removeNotification({ commit }, notificationId) {
      commit('REMOVE_NOTIFICATION', notificationId);
    },

    clearNotifications({ commit }) {
      commit('CLEAR_NOTIFICATIONS');
    },

    clearOperationError({ commit }) {
      commit('CLEAR_OPERATION_ERROR');
    }
  },

  getters: {
    // User-related getters
    isAuthenticated: state => !!state.user,
    userRole: state => state.userProfile?.role || '',
    userName: state => state.userProfile?.name || state.userProfile?.email?.split('@')[0] || '',
    allowedWarehouses: state => Array.isArray(state.userProfile?.allowed_warehouses) ? state.userProfile.allowed_warehouses : [],
    userPermissions: state => Array.isArray(state.userProfile?.permissions) ? state.userProfile.permissions : [],
    authError: state => state.authError,
    operationError: state => state.operationError,
    operationLoading: state => state.operationLoading,
    fieldMappings: state => state.fieldMappings || FIELD_MAPPINGS,
    warehousesLoaded: state => state.warehousesLoaded,
    notifications: state => Array.isArray(state.notifications) ? state.notifications : [],
    recentTransactions: state => Array.isArray(state.recentTransactions) ? state.recentTransactions : [],
    recentTransactionsLoading: state => state.recentTransactionsLoading,
    requiresCompositeIndex: state => state.requiresCompositeIndex,
    allUsers: state => Array.isArray(state.allUsers) ? state.allUsers : [],
    usersLoading: state => state.usersLoading,

    // Inventory getters
    inventoryItems: state => Array.isArray(state.inventory) ? state.inventory : [],
    inventoryLoading: state => state.inventoryLoading,
    
    // ✅ NEW: Check if has more items to load
    hasMoreInventory: state => state.inventoryPagination.hasMore,

    getCachedItem: (state) => (itemId) => {
      const cacheEntry = state.cache.itemCache[itemId];
      const cacheDuration = 10 * 60 * 1000;
      
      if (cacheEntry && (Date.now() - cacheEntry.timestamp) < cacheDuration) {
        return cacheEntry.data;
      }
      return null;
    },

    transactionsItems: state => Array.isArray(state.transactions) ? state.transactions : [],
    transactionsLoading: state => state.transactionsLoading,

    canEdit: (state, getters) => {
      const role = getters.userRole;
      return ['superadmin', 'warehouse_manager'].includes(role);
    },

    canDelete: (state, getters) => {
      const role = getters.userRole;
      if (role === 'superadmin') return true;
      if (role === 'warehouse_manager') {
        const permissions = getters.userPermissions;
        return permissions.includes('full_access') || permissions.includes('delete_items');
      }
      return false;
    },

    canManageUsers: state => state.userProfile?.role === 'superadmin',
    canManageWarehouses: state => state.userProfile?.role === 'superadmin',

    canDispatch: (state, getters) => {
      const role = getters.userRole;
      if (role === 'superadmin') return true;
      if (role === 'warehouse_manager') {
        const permissions = getters.userPermissions;
        return permissions.includes('dispatch_items');
      }
      return false;
    },

    mainWarehouse: state => {
      const warehouses = Array.isArray(state.warehouses) ? state.warehouses : [];
      return warehouses.find(w => w.is_main) || null;
    },
    primaryWarehouses: state => {
      const warehouses = Array.isArray(state.warehouses) ? state.warehouses : [];
      return warehouses.filter(w => w.type === 'primary');
    },
    dispatchWarehouses: state => {
      const warehouses = Array.isArray(state.warehouses) ? state.warehouses : [];
      return warehouses.filter(w => w.type === 'dispatch');
    },

    accessibleWarehouses: (state, getters) => {
      const warehouses = Array.isArray(state.warehouses) ? state.warehouses : [];
      if (!warehouses.length || !state.warehousesLoaded) return [];

      const role = getters.userRole;
      if (role === 'superadmin') {
        return warehouses;
      }

      if (role === 'warehouse_manager') {
        const allowedWarehouses = getters.allowedWarehouses;
        if (allowedWarehouses.length > 0) {
          if (allowedWarehouses.includes('all')) {
            return warehouses;
          }
          const accessiblePrimary = warehouses.filter(w => 
            w.type === 'primary' && allowedWarehouses.includes(w.id)
          );
          const accessibleDispatch = warehouses.filter(w => w.type === 'dispatch');
          return [...accessiblePrimary, ...accessibleDispatch];
        }
      }

      if (role === 'company_manager') {
        return warehouses;
      }

      return [];
    },

    accessiblePrimaryWarehouses: (state, getters) => {
      const accessible = getters.accessibleWarehouses;
      return accessible.filter(w => w.type === 'primary');
    },

    accessibleDispatchWarehouses: (state, getters) => {
      const accessible = getters.accessibleWarehouses;
      return accessible.filter(w => w.type === 'dispatch');
    },

    dispatchFromWarehouses: (state, getters) => {
      const warehouses = Array.isArray(state.warehouses) ? state.warehouses : [];
      if (!warehouses.length || !state.warehousesLoaded) return [];

      const role = getters.userRole;
      if (role === 'superadmin') {
        return warehouses.filter(w => w.type === 'primary');
      }

      if (role === 'warehouse_manager') {
        const allowedWarehouses = getters.allowedWarehouses;
        if (allowedWarehouses.length > 0) {
          if (allowedWarehouses.includes('all')) {
            return warehouses.filter(w => w.type === 'primary');
          }
          return warehouses.filter(w => 
            w.type === 'primary' && allowedWarehouses.includes(w.id)
          );
        }
      }

      return [];
    },

    filteredInventory: (state, getters) => {
      const inventory = getters.inventoryItems;
      if (!inventory.length) return [];

      let filtered = inventory;

      const role = getters.userRole;
      if (role === 'warehouse_manager' || role === 'company_manager') {
        const allowedWarehouses = getters.allowedWarehouses;
        if (allowedWarehouses.length > 0) {
          filtered = filtered.filter(item => allowedWarehouses.includes(item.warehouse_id));
        }
      }

      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase();
        filtered = filtered.filter(item =>
          item.name?.toLowerCase().includes(searchLower) ||
          item.code?.toLowerCase().includes(searchLower) ||
          item.color?.toLowerCase().includes(searchLower) ||
          item.supplier?.toLowerCase().includes(searchLower) ||
          item.item_location?.toLowerCase().includes(searchLower)
        );
      }

      if (state.filters.warehouse) {
        filtered = filtered.filter(item => item.warehouse_id === state.filters.warehouse);
      }

      return filtered;
    },

    dashboardStats: (state, getters) => {
      if (state.cache.stats && 
          state.cache.statsTimestamp && 
          Date.now() - state.cache.statsTimestamp < PERFORMANCE_CONFIG.CACHE_DURATION) {
        return state.cache.stats;
      }

      const inventory = getters.filteredInventory;
      const recentTransactions = getters.recentTransactions;

      const totalItems = inventory.length;
      const totalQuantity = inventory.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0);
      const lowStockItems = inventory.filter(item => (item.remaining_quantity || 0) < 10).length;
      const outOfStockItems = inventory.filter(item => (item.remaining_quantity || 0) === 0).length;

      const averageValuePerItem = 50;
      const estimatedValue = totalQuantity * averageValuePerItem;

      const recentTransactionsCount = recentTransactions.length;

      const addTransactions = recentTransactions.filter(t => t.type === TRANSACTION_TYPES.ADD).length;
      const transferTransactions = recentTransactions.filter(t => t.type === TRANSACTION_TYPES.TRANSFER).length;
      const dispatchTransactions = recentTransactions.filter(t => t.type === TRANSACTION_TYPES.DISPATCH).length;

      const stats = {
        totalItems,
        totalQuantity,
        lowStockItems,
        outOfStockItems,
        estimatedValue,
        recentTransactions: recentTransactionsCount,
        addTransactions,
        transferTransactions,
        dispatchTransactions,
        transactionsByType: {
          add: addTransactions,
          transfer: transferTransactions,
          dispatch: dispatchTransactions
        }
      };

      state.cache.stats = stats;
      state.cache.statsTimestamp = Date.now();

      return stats;
    },

    getArabicLabel: (state) => (fieldName) => {
      const mappings = state.fieldMappings || FIELD_MAPPINGS;
      return mappings.englishToArabic[fieldName] || fieldName;
    },

    getWarehouseLabel: (state) => (warehouseId) => {
      if (!warehouseId) return '';

      if (state.cache.warehouseLabels[warehouseId]) {
        return state.cache.warehouseLabels[warehouseId];
      }

      const warehouses = Array.isArray(state.warehouses) ? state.warehouses : [];
      const warehouse = warehouses.find(w => w.id === warehouseId);
      return warehouse ? warehouse.name_ar : warehouseId;
    },

    getDestinationLabel: () => (destinationId) => {
      return DESTINATION_LABELS[destinationId] || destinationId;
    },

    getWarehouseById: (state) => (warehouseId) => {
      const warehouses = Array.isArray(state.warehouses) ? state.warehouses : [];
      return warehouses.find(w => w.id === warehouseId) || null;
    }
  }
});

// Helper function for auth error messages
function getAuthErrorMessage(errorCode) {
  const errorMessages = {
    'auth/invalid-email': 'البريد الإلكتروني غير صحيح',
    'auth/user-disabled': 'هذا الحساب معطل',
    'auth/user-not-found': 'لا يوجد حساب بهذا البريد الإلكتروني',
    'auth/wrong-password': 'كلمة المرور غير صحيحة',
    'auth/email-already-in-use': 'هذا البريد الإلكتروني مستخدم بالفعل',
    'auth/weak-password': 'كلمة المرور ضعيفة',
    'auth/network-request-failed': 'خطأ في الاتصال بالشبكة',
    'auth/too-many-requests': 'محاولات تسجيل دخول كثيرة. يرجى المحاولة لاحقاً',
    'auth/configuration-not-found': 'خطأ في إعدادات النظام'
  };

  return errorMessages[errorCode] || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى';
}
