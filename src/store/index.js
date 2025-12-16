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
  serverTimestamp,
  startAfter,
  onSnapshot  // 🔥 ADDED for real-time
} from 'firebase/firestore';
import {
  InventoryService,
  WAREHOUSE_LABELS,
  DESTINATION_LABELS,
  FIELD_LABELS,
  TRANSACTION_TYPES
} from '@/services/inventoryService';
import UserService from '@/services/UserService';

// Performance constants - UPDATED
const PERFORMANCE_CONFIG = {
  INVENTORY_PAGE_SIZE: 100,           // Load only 100 items max
  RECENT_ITEMS_LIMIT: 50,            // Store only 50 in cache
  TRANSACTIONS_PAGE_SIZE: 30,
  RECENT_TRANSACTIONS_LIMIT: 20,
  NOTIFICATION_LIMIT: 100,
  CACHE_DURATION: 10 * 60 * 1000,    // 10 minutes
  DEBOUNCE_DELAY: 300,
  ITEM_SEARCH_LIMIT: 10,
  TRANSACTION_SEARCH_LIMIT: 20,
  RECENT_DAYS_LIMIT: 30,             // Load items from last 30 days
  REALTIME_UPDATE_LIMIT: 100,        // Max items for real-time updates
  REALTIME_DAYS_BACK: 7              // Listen to items changed in last 7 days
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

    // Inventory - Will only contain recent 100 items
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
      transactionItemsTimestamp: null,
      recentInventory: [],           // Separate cache for recent items
      recentInventoryTimestamp: null
    },

    // Loading states
    inventoryLoading: false,
    transactionsLoading: false,
    
    isFetchingInventory: false,

    // Pagination support
    inventoryPagination: {
      lastDoc: null,
      hasMore: false                 // Changed to false - we won't paginate recent items
    },

    // 🔥 NEW: Real-time tracking
    realtimeListeners: {
      inventory: null,
      recentTransactions: null
    },
    
    lastInventoryUpdate: null,
    realtimeMode: false,
    realtimeError: null
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
      // Limit to 100 items maximum
      state.inventory = Array.isArray(inventory) ? inventory.slice(0, 100) : [];
      state.inventoryLastFetched = Date.now();
    },

    APPEND_TO_INVENTORY(state, newItems) {
      if (Array.isArray(newItems)) {
        const existingIds = new Set(state.inventory.map(item => item.id));
        const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));
        
        // Keep only last 100 items
        const allItems = [...state.inventory, ...uniqueNewItems];
        state.inventory = allItems.slice(-100); // Keep only last 100
        
        state.inventoryLastFetched = Date.now();
      }
    },

    SET_INVENTORY_LAST_FETCHED(state, timestamp) {
      state.inventoryLastFetched = timestamp;
    },

    ADD_ITEM(state, item) {
      if (item && typeof item === 'object') {
        // Add to beginning (most recent)
        state.inventory.unshift(item);
        
        // Keep only 100 items
        if (state.inventory.length > 100) {
          state.inventory = state.inventory.slice(0, 100);
        }
        
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
      } else {
        // If not found in recent 100, add as new item at beginning
        state.inventory.unshift(updatedItem);
        // Keep only 100 items
        if (state.inventory.length > 100) {
          state.inventory = state.inventory.slice(0, 100);
        }
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

    SET_INVENTORY_PAGINATION(state, { lastDoc, hasMore }) {
      state.inventoryPagination.lastDoc = lastDoc;
      state.inventoryPagination.hasMore = hasMore;
    },

    RESET_INVENTORY_PAGINATION(state) {
      state.inventoryPagination = {
        lastDoc: null,
        hasMore: false  // Changed to false - no pagination for recent items
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

    SET_RECENT_INVENTORY_CACHE(state, { items, timestamp }) {
      // Store only 50 items in cache
      state.cache.recentInventory = items.slice(0, PERFORMANCE_CONFIG.RECENT_ITEMS_LIMIT);
      state.cache.recentInventoryTimestamp = timestamp;
    },

    CLEAR_CACHE(state) {
      state.cache = {
        warehouseLabels: {},
        stats: null,
        statsTimestamp: null,
        itemCache: {},
        itemCacheTimestamp: null,
        transactionItems: [],
        transactionItemsTimestamp: null,
        recentInventory: [],
        recentInventoryTimestamp: null
      };
      state.inventoryLastFetched = null;
    },

    // 🔥 NEW: Real-time mutations
    SET_REALTIME_MODE(state, mode) {
      state.realtimeMode = mode;
    },

    SET_INVENTORY_LISTENER(state, listener) {
      if (state.realtimeListeners.inventory) {
        // Clean up old listener
        state.realtimeListeners.inventory();
      }
      state.realtimeListeners.inventory = listener;
    },

    SET_TRANSACTIONS_LISTENER(state, listener) {
      if (state.realtimeListeners.recentTransactions) {
        state.realtimeListeners.recentTransactions();
      }
      state.realtimeListeners.recentTransactions = listener;
    },

    SET_LAST_INVENTORY_UPDATE(state, timestamp) {
      state.lastInventoryUpdate = timestamp;
    },

    CLEAR_REALTIME_LISTENERS(state) {
      if (state.realtimeListeners.inventory) {
        state.realtimeListeners.inventory();
        state.realtimeListeners.inventory = null;
      }
      if (state.realtimeListeners.recentTransactions) {
        state.realtimeListeners.recentTransactions();
        state.realtimeListeners.recentTransactions = null;
      }
    },

    SET_REALTIME_ERROR(state, error) {
      state.realtimeError = error;
    }
  },

  actions: {
    // ✅ FIXED: SMART SEARCH - Now properly searches in store AND Firestore
    async searchItemsForTransactions({ commit, state, dispatch }, { searchTerm, limitResults = 20 }) {
      try {
        console.log('🔍 SMART SEARCH for transactions:', searchTerm);

        if (!searchTerm || searchTerm.trim().length < 2) {
          return [];
        }

        const term = searchTerm.trim().toLowerCase();

        // 1. FIRST: Search in loaded inventory (100 recent items)
        const localResults = state.inventory.filter(item =>
          item.name?.toLowerCase().includes(term) ||
          item.code?.toLowerCase().includes(term) ||
          item.color?.toLowerCase().includes(term) ||
          item.supplier?.toLowerCase().includes(term)
        ).slice(0, limitResults);

        if (localResults.length >= limitResults) {
          console.log('✅ Items found in recent inventory:', localResults.length);
          return localResults;
        }

        // 2. SECOND: Check cache (5 minute cache)
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
            console.log('✅ Using cached transaction items:', cachedResults.length);
            return cachedResults;
          }
        }

        // 3. THIRD: ⚡ GO DIRECTLY TO FIRESTORE (Smart search)
        console.log('⚡ Item not in cache. Searching Firestore directly...');
        
        const itemsRef = collection(db, 'items');
        let q;
        
        // Smart query selection based on search term
        if (term.length <= 3) {
          // Short search - likely a code
          q = query(
            itemsRef,
            where('code', '>=', term),
            where('code', '<=', term + '\uf8ff'),
            orderBy('code'),
            limit(limitResults)
          );
        } else {
          // Longer search - likely a name
          q = query(
            itemsRef,
            where('name', '>=', term),
            where('name', '<=', term + '\uf8ff'),
            orderBy('name'),
            limit(limitResults)
          );
        }

        try {
          const snapshot = await getDocs(q);
          
          if (snapshot.empty) {
            console.log('❌ No items found in Firestore');
            return localResults;
          }

          // Filter by warehouse permissions
          const validItems = snapshot.docs.filter(doc => {
            if (state.userProfile.role === 'superadmin') return true;
            
            const itemData = doc.data();
            const allowedWarehouses = state.userProfile.allowed_warehouses || [];
            
            if (allowedWarehouses.includes('all')) return true;
            return allowedWarehouses.includes(itemData.warehouse_id);
          }).map(doc => {
            const itemData = doc.data();
            const convertedItem = InventoryService.convertForDisplay({
              id: doc.id,
              ...itemData
            });
            
            // Cache each item individually
            commit('CACHE_ITEM', {
              itemId: doc.id,
              itemData: convertedItem
            });
            
            return convertedItem;
          });

          console.log(`✅ Found ${validItems.length} items in Firestore (${snapshot.size} reads)`);

          // Cache the search results
          commit('SET_TRANSACTION_ITEMS_CACHE', {
            items: validItems,
            timestamp: Date.now()
          });

          return validItems;

        } catch (error) {
          // Handle composite index errors
          if (error.code === 'failed-precondition') {
            console.warn('Using alternative search method...');
            
            // Alternative: Try searching all items with limit
            const itemsRef = collection(db, 'items');
            const q = query(itemsRef, limit(50));
            
            const snapshot = await getDocs(q);
            const allItems = snapshot.docs.map(doc => {
              const itemData = doc.data();
              return {
                id: doc.id,
                ...itemData,
                _display: InventoryService.convertForDisplay({
                  id: doc.id,
                  ...itemData
                })
              };
            });

            // Filter client-side
            const filteredItems = allItems.filter(item => {
              // Search filter
              const matchesSearch = 
                item.name?.toLowerCase().includes(term) ||
                item.code?.toLowerCase().includes(term);
              
              // Permission filter
              if (!matchesSearch) return false;
              
              if (state.userProfile.role === 'superadmin') return true;
              
              const allowedWarehouses = state.userProfile.allowed_warehouses || [];
              if (allowedWarehouses.includes('all')) return true;
              return allowedWarehouses.includes(item.warehouse_id);
            }).map(item => item._display).slice(0, limitResults);

            if (filteredItems.length > 0) {
              console.log(`✅ Found ${filteredItems.length} items (alternative search)`);
              
              // Cache these items
              filteredItems.forEach(item => {
                commit('CACHE_ITEM', {
                  itemId: item.id,
                  itemData: item
                });
              });
              
              return filteredItems;
            }
          }
          
          throw error;
        }

      } catch (error) {
        console.error('❌ Error in smart search:', error);
        
        // Fallback to local inventory (100 recent items)
        const term = searchTerm?.trim().toLowerCase() || '';
        const fallbackResults = state.inventory.filter(item =>
          item.name?.toLowerCase().includes(term) ||
          item.code?.toLowerCase().includes(term)
        ).slice(0, 10);
        
        return fallbackResults;
      }
    },

    // ✅ FIXED: SMART GET ITEM - Now properly searches in store
    async getItemById({ commit, state, dispatch }, { itemId, itemCode, itemName }) {
      try {
        console.log('🔍 SMART GET ITEM:', { itemId, itemCode, itemName });

        if (!itemId && !itemCode && !itemName) {
          throw new Error('معرف الصنف أو الكود أو الاسم مطلوب');
        }

        // 1. FIRST: Check loaded inventory (100 recent items)
        let item = state.inventory.find(i => 
          i.id === itemId || 
          (itemCode && i.code === itemCode) ||
          (itemName && i.name === itemName)
        );

        if (item) {
          console.log('✅ Item found in recent inventory');
          return item;
        }

        // 2. SECOND: Check item cache
        const cacheEntry = state.cache.itemCache[itemId];
        const cacheDuration = 10 * 60 * 1000;
        
        if (cacheEntry && (Date.now() - cacheEntry.timestamp) < cacheDuration) {
          console.log('✅ Item found in cache');
          return cacheEntry.data;
        }

        // 3. THIRD: ⚡ GO DIRECTLY TO FIRESTORE!
        console.log('⚡ Item not in cache. Fetching from Firestore directly...');
        
        // Try by ID first (1 read)
        if (itemId) {
          try {
            const itemDoc = await getDoc(doc(db, 'items', itemId));
            
            if (itemDoc.exists()) {
              const itemData = itemDoc.data();
              
              // Check permissions
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

        // Try by code (5 reads max)
        if (itemCode) {
          const itemsRef = collection(db, 'items');
          const q = query(
            itemsRef,
            where('code', '==', itemCode),
            limit(5)
          );
          
          const snapshot = await getDocs(q);
          
          if (!snapshot.empty) {
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

        // Try by name (10 reads max)
        if (itemName && itemName.length >= 3) {
          const itemsRef = collection(db, 'items');
          const q = query(
            itemsRef,
            where('name', '>=', itemName),
            where('name', '<=', itemName + '\uf8ff'),
            limit(10)
          );
          
          const snapshot = await getDocs(q);
          
          if (!snapshot.empty) {
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

        // Last resort: Use smart search
        console.log('🔄 Trying smart search as last resort...');
        const searchResults = await dispatch('searchItemsForTransactions', {
          searchTerm: itemCode || itemName || '',
          limitResults: 10
        });
        
        if (searchResults.length > 0) {
          const foundItem = searchResults[0];
          console.log('✅ Item found through smart search');
          return foundItem;
        }

        throw new Error('الصنف غير موجود في المخزون');

      } catch (error) {
        console.error('❌ Error getting item:', error);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'خطأ في العثور على الصنف'
        });
        return null;
      }
    },

    // Get items from specific warehouse (LIMITED TO RECENT)
    async getItemsFromWarehouse({ state, dispatch, commit }, { warehouseId, limitResults = 20 }) {
      try {
        console.log('🔄 Getting recent items from warehouse:', warehouseId);

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

        // First, check loaded inventory (100 recent items)
        const localItems = state.inventory.filter(item => item.warehouse_id === warehouseId);
        if (localItems.length >= limitResults) {
          console.log('✅ Found items in recent inventory:', localItems.length);
          return localItems.slice(0, limitResults);
        }

        // Query Firestore for RECENT items only
        const itemsRef = collection(db, 'items');
        
        try {
          // Try to get recent items first
          const q = query(
            itemsRef,
            where('warehouse_id', '==', warehouseId),
            orderBy('name'),
            limit(limitResults)
          );

          const snapshot = await getDocs(q);
          const items = snapshot.docs.map(doc => {
            const itemData = doc.data();
            const convertedItem = InventoryService.convertForDisplay({
              id: doc.id,
              ...itemData
            });
            
            commit('CACHE_ITEM', {
              itemId: doc.id,
              itemData: convertedItem
            });
            
            return convertedItem;
          });

          console.log(`✅ Found ${items.length} items in warehouse ${warehouseId}`);
          return items;

        } catch (error) {
          console.warn('Using alternative query...', error);
          
          // Fallback: Use recent inventory and filter
          const recentItems = state.inventory.filter(item => item.warehouse_id === warehouseId);
          return recentItems.slice(0, limitResults);
        }

      } catch (error) {
        console.error('❌ Error getting items from warehouse:', error);
        
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'خطأ في تحميل الأصناف من المخزن'
        });
        return [];
      }
    },

    // Get all warehouses for the current user
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

    // 🔥 FIXED: fetchRecentInventory - SIMPLIFIED to load ANY 100 items
    async fetchRecentInventory({ commit, state, dispatch }) {
      if (state.isFetchingInventory) {
        console.log('Inventory fetch already in progress, skipping...');
        return state.inventory;
      }

      const now = Date.now();
      const cacheDuration = PERFORMANCE_CONFIG.CACHE_DURATION;
      
      // Check cache first
      if (state.inventoryLastFetched && 
          (now - state.inventoryLastFetched) < cacheDuration && 
          state.inventory.length > 0) {
        console.log('Using cached inventory (fetched less than 10 minutes ago)');
        return state.inventory;
      }

      commit('SET_IS_FETCHING_INVENTORY', true);
      commit('SET_INVENTORY_LOADING', true);
      commit('RESET_INVENTORY_PAGINATION');
      
      try {
        if (!state.userProfile) {
          console.log('Cannot load inventory: User not authenticated');
          commit('SET_INVENTORY', []);
          return [];
        }

        let itemsQuery;
        const itemsRef = collection(db, 'items');

        // SIMPLIFIED: Just load 100 items by name or code
        if (state.userProfile.role === 'superadmin' || state.userProfile.role === 'company_manager') {
          // Superadmins and company managers: Load any 100 items
          itemsQuery = query(
            itemsRef,
            orderBy('name'),
            limit(PERFORMANCE_CONFIG.INVENTORY_PAGE_SIZE)
          );
        } else if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];

          if (allowedWarehouses.length === 0) {
            console.log('No warehouses assigned to this warehouse manager');
            commit('SET_INVENTORY', []);
            return [];
          }

          if (allowedWarehouses.includes('all')) {
            itemsQuery = query(
              itemsRef,
              orderBy('name'),
              limit(PERFORMANCE_CONFIG.INVENTORY_PAGE_SIZE)
            );
          } else {
            try {
              // Try to get items from allowed warehouses
              itemsQuery = query(
                itemsRef,
                where('warehouse_id', 'in', allowedWarehouses.slice(0, 10)),
                orderBy('name'),
                limit(PERFORMANCE_CONFIG.INVENTORY_PAGE_SIZE)
              );
            } catch (error) {
              if (error.code === 'failed-precondition') {
                console.warn('Composite index required. Loading all items then filtering...');
                commit('SET_REQUIRES_COMPOSITE_INDEX', true);
                itemsQuery = query(
                  itemsRef,
                  orderBy('name'),
                  limit(PERFORMANCE_CONFIG.INVENTORY_PAGE_SIZE * 2)
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
        console.log('✅ Recent inventory loaded:', snapshot.size, 'items');

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

        // Client-side filtering for warehouse managers
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

        // No pagination for recent items
        commit('SET_INVENTORY_PAGINATION', {
          lastDoc: null,
          hasMore: false
        });

        commit('SET_INVENTORY', inventory);
        
        // Cache the recent inventory
        commit('SET_RECENT_INVENTORY_CACHE', {
          items: inventory,
          timestamp: Date.now()
        });
        
        console.log('✅ Recent inventory ready with', inventory.length, 'items');
        return inventory;

      } catch (error) {
        console.error('❌ Error loading recent inventory:', error);

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

    // 🔥 FIXED: Keep original fetchInventoryOnce for backward compatibility
    async fetchInventoryOnce({ dispatch }) {
      console.log('📦 Using fetchRecentInventory instead of fetchInventoryOnce');
      return await dispatch('fetchRecentInventory');
    },

    // 🔥 NEW: Force refresh inventory
    async forceRefreshInventory({ commit, dispatch }) {
      console.log('🔄 Force refreshing inventory...');
      commit('SET_INVENTORY_LAST_FETCHED', null);
      commit('CLEAR_CACHE');
      return await dispatch('fetchRecentInventory');
    },

    // Remove loadMoreInventory since we don't paginate recent items
    async loadMoreInventory({ commit, state }) {
      console.log('⚠️ Pagination disabled for recent inventory');
      commit('SET_INVENTORY_PAGINATION', {
        lastDoc: null,
        hasMore: false
      });
      return [];
    },

    // 🔥 FIXED: searchItems - Now properly searches in loaded inventory
    async searchItems({ state, dispatch }, { searchTerm, limitResults = 5 }) {
      try {
        console.log('🔍 General search in recent items:', searchTerm);

        if (!searchTerm || searchTerm.trim().length < 2) {
          return [];
        }

        const term = searchTerm.trim().toLowerCase();

        // Search in loaded inventory
        const localResults = state.inventory.filter(item => 
          item.name?.toLowerCase().includes(term) || 
          item.code?.toLowerCase().includes(term) ||
          item.color?.toLowerCase().includes(term)
        ).slice(0, limitResults);

        if (localResults.length > 0) {
          console.log('✅ Items found in loaded inventory:', localResults.length);
          return localResults;
        }

        // If not found in loaded items, use the smart search for transactions
        return await dispatch('searchItemsForTransactions', {
          searchTerm: searchTerm,
          limitResults: limitResults
        });

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

    // 🔥 UPDATED: Initialize auth with real-time support
    async initializeAuth({ commit, dispatch }) {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            commit('SET_USER', user);
            try {
              await dispatch('loadUserProfile', user);
              // Enable real-time mode after profile loaded
              await dispatch('enableRealtimeMode');
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
            // Disable real-time mode on logout
            dispatch('disableRealtimeMode');
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

        // Load warehouses and RECENT inventory
        await dispatch('loadWarehouses');
        await dispatch('fetchRecentInventory'); // 🔥 Changed to fetchRecentInventory
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

        // Enable real-time mode after login
        await dispatch('enableRealtimeMode');

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
        // Disable real-time mode first
        dispatch('disableRealtimeMode');
        
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
        commit('RESET_INVENTORY_PAGINATION');
        commit('SET_REALTIME_MODE', false);

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

    // 🔥 NEW: Enable real-time mode
    async enableRealtimeMode({ commit, dispatch, state }) {
      if (state.realtimeMode) {
        console.log('🟢 Real-time mode already active');
        return;
      }
      
      try {
        console.log('🔴 Activating real-time mode...');
        
        // First, check if user has permission
        if (!state.userProfile) {
          console.warn('Cannot enable real-time: User not authenticated');
          return;
        }
        
        // Enable real-time listeners
        await dispatch('setupRealtimeListeners');
        
        commit('SET_REALTIME_MODE', true);
        
        dispatch('showNotification', {
          type: 'success',
          message: 'تم تفعيل التحديث الفوري للمخزون'
        });
        
        console.log('✅ Real-time mode activated');
        
      } catch (error) {
        console.error('❌ Error enabling real-time mode:', error);
        commit('SET_REALTIME_ERROR', error.message);
        
        dispatch('showNotification', {
          type: 'warning',
          message: 'تعذر تفعيل التحديث الفوري. سيتم تحديث البيانات يدوياً.'
        });
      }
    },

    // 🔥 NEW: Disable real-time mode
    disableRealtimeMode({ commit, state }) {
      if (!state.realtimeMode) return;
      
      console.log('🔴 Disabling real-time mode...');
      commit('CLEAR_REALTIME_LISTENERS');
      commit('SET_REALTIME_MODE', false);
      commit('SET_REALTIME_ERROR', null);
      console.log('✅ Real-time mode disabled');
    },

    // 🔥 NEW: Smart real-time listeners
    async setupRealtimeListeners({ commit, state, dispatch }) {
      try {
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }
        
        if (state.realtimeListeners.inventory) {
          console.log('Real-time listeners already active');
          return;
        }
        
        console.log('🔴 Setting up real-time listeners...');
        
        // 1. Listen to RECENTLY MODIFIED items only (last 7 days)
        // This is the key to saving reads - we only listen to items that have changed recently
        const daysBack = PERFORMANCE_CONFIG.REALTIME_DAYS_BACK;
        const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
        
        const itemsRef = collection(db, 'items');
        
        let inventoryQuery;
        
        if (state.userProfile.role === 'superadmin' || state.userProfile.role === 'company_manager') {
          // Listen to all items modified in last 7 days
          inventoryQuery = query(
            itemsRef,
            where('updated_at', '>=', cutoffDate),
            orderBy('updated_at', 'desc'),
            limit(PERFORMANCE_CONFIG.REALTIME_UPDATE_LIMIT)
          );
        } else if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (allowedWarehouses.length === 0) return;
          
          if (allowedWarehouses.includes('all')) {
            inventoryQuery = query(
              itemsRef,
              where('updated_at', '>=', cutoffDate),
              orderBy('updated_at', 'desc'),
              limit(PERFORMANCE_CONFIG.REALTIME_UPDATE_LIMIT)
            );
          } else {
            // Limited to allowed warehouses
            try {
              inventoryQuery = query(
                itemsRef,
                where('warehouse_id', 'in', allowedWarehouses.slice(0, 10)),
                where('updated_at', '>=', cutoffDate),
                orderBy('updated_at', 'desc'),
                limit(PERFORMANCE_CONFIG.REALTIME_UPDATE_LIMIT)
              );
            } catch (error) {
              if (error.code === 'failed-precondition') {
                // Fallback: Just listen to all items from allowed warehouses
                console.warn('Using simplified real-time query (no date filter)');
                inventoryQuery = query(
                  itemsRef,
                  where('warehouse_id', 'in', allowedWarehouses.slice(0, 10)),
                  limit(PERFORMANCE_CONFIG.REALTIME_UPDATE_LIMIT)
                );
              } else {
                throw error;
              }
            }
          }
        } else {
          return;
        }
        
        // Set up inventory listener
        const inventoryUnsubscribe = onSnapshot(
          inventoryQuery,
          (snapshot) => {
            console.log('🟢 Real-time inventory update received:', snapshot.docChanges().length, 'changes');
            
            let hasImportantChanges = false;
            
            snapshot.docChanges().forEach((change) => {
              const itemData = change.doc.data();
              const itemId = change.doc.id;
              
              // Convert for display
              const convertedItem = InventoryService.convertForDisplay({
                id: itemId,
                ...itemData
              });
              
              // Update cache
              commit('CACHE_ITEM', {
                itemId: itemId,
                itemData: convertedItem
              });
              
              // Update state based on change type
              if (change.type === 'added') {
                console.log('➕ Item added:', convertedItem.name);
                commit('ADD_ITEM', convertedItem);
                hasImportantChanges = true;
              } else if (change.type === 'modified') {
                console.log('✏️ Item modified:', convertedItem.name);
                commit('UPDATE_ITEM', convertedItem);
                hasImportantChanges = true;
              } else if (change.type === 'removed') {
                console.log('➖ Item removed:', itemId);
                commit('REMOVE_ITEM', itemId);
                hasImportantChanges = true;
              }
            });
            
            if (hasImportantChanges) {
              commit('SET_LAST_INVENTORY_UPDATE', Date.now());
              
              // Show notification for important changes
              if (snapshot.docChanges().length > 0) {
                dispatch('showNotification', {
                  type: 'info',
                  message: `تم تحديث ${snapshot.docChanges().length} عنصر في المخزون`
                });
              }
            }
          },
          (error) => {
            console.error('❌ Real-time inventory error:', error);
            commit('SET_REALTIME_ERROR', error.message);
            
            dispatch('showNotification', {
              type: 'warning',
              message: 'تم تعطيل التحديث الفوري مؤقتاً'
            });
            
            // Auto-disable real-time on error
            commit('SET_REALTIME_MODE', false);
          }
        );
        
        commit('SET_INVENTORY_LISTENER', inventoryUnsubscribe);
        
        // 2. Listen to recent transactions (last 24 hours)
        // This helps catch changes that might not be in our 7-day window
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const transactionsRef = collection(db, 'transactions');
        
        const transactionsQuery = query(
          transactionsRef,
          where('timestamp', '>=', oneDayAgo),
          orderBy('timestamp', 'desc'),
          limit(PERFORMANCE_CONFIG.RECENT_TRANSACTIONS_LIMIT)
        );
        
        const transactionsUnsubscribe = onSnapshot(
          transactionsQuery,
          (snapshot) => {
            console.log('🟢 Real-time transactions update:', snapshot.size, 'transactions');
            
            const newTransactions = snapshot.docs.map(doc => {
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
            
            commit('SET_RECENT_TRANSACTIONS', newTransactions);
            
            // Check if any transaction affects items not in our recent list
            // If so, we might want to refresh those items
            const affectedItemIds = new Set();
            newTransactions.forEach(tx => {
              if (tx.item_id && !state.inventory.find(item => item.id === tx.item_id)) {
                affectedItemIds.add(tx.item_id);
              }
            });
            
            // If we have affected items not in recent list, fetch them
            if (affectedItemIds.size > 0) {
              console.log(`🔄 ${affectedItemIds.size} items affected by transactions but not in recent list`);
              // We could optionally fetch these items here
            }
          },
          (error) => {
            console.error('❌ Real-time transactions error:', error);
          }
        );
        
        commit('SET_TRANSACTIONS_LISTENER', transactionsUnsubscribe);
        
        console.log('✅ Real-time listeners activated successfully');
        
      } catch (error) {
        console.error('❌ Error setting up real-time listeners:', error);
        commit('SET_REALTIME_ERROR', error.message);
        throw error;
      }
    },

    // All other actions remain the same...
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

        // With real-time mode, we don't need to manually refresh
        // The listener will automatically update the inventory

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

        // Real-time listener will automatically update

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

        // Real-time listener will automatically update

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

        // Real-time listener will pick up the update

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

        // Real-time listener will remove it from the list

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

    // ... continue with all other existing actions (createWarehouse, updateWarehouse, etc.)
    // The rest of your existing actions remain unchanged...

    // 🔥 NEW: Manually refresh if real-time fails
    async manualRefreshInventory({ dispatch, state }) {
      if (state.realtimeMode) {
        console.log('Real-time mode active, no need for manual refresh');
        return;
      }
      
      console.log('🔄 Manual refresh requested');
      await dispatch('forceRefreshInventory');
    },

    // 🔥 NEW: Check real-time status
    async checkRealtimeStatus({ state, commit }) {
      if (!state.realtimeMode && state.userProfile) {
        console.log('🔄 Real-time not active, attempting to enable...');
        await this.dispatch('enableRealtimeMode');
      }
      return state.realtimeMode;
    }
  },

  getters: {
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
    inventoryItems: state => Array.isArray(state.inventory) ? state.inventory : [],
    inventoryLoading: state => state.inventoryLoading,
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
    },

    // 🔥 NEW: Real-time getters
    isRealtimeActive: state => state.realtimeMode,
    lastUpdateTime: state => state.lastInventoryUpdate,
    realtimeError: state => state.realtimeError,
    
    // Real-time status message
    realtimeStatus: (state) => {
      if (!state.user) return 'غير متصل';
      if (state.realtimeMode) return 'متصل - تحديث فوري';
      if (state.realtimeError) return `خطأ: ${state.realtimeError}`;
      return 'غير نشط - تحديث يدوي';
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
