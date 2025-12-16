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
  startAfter,
  onSnapshot,
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

// Performance configuration
const PERFORMANCE_CONFIG = {
  INITIAL_LOAD: 200,             // Initial load items
  SCROLL_LOAD: 50,               // Load more on scroll
  SEARCH_LIMIT: 100,             // Search results limit
  CACHE_DURATION: 30 * 60 * 1000 // 30 minutes cache
};

// Field name mapping (from older version)
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
    // User state
    user: null,
    userProfile: null,
    loading: false,
    authError: null,

    // Warehouses
    warehouses: [],
    warehousesLoaded: false,

    // Inventory - ALL items
    inventory: [],
    inventoryLoaded: false,
    inventoryLoading: false,
    inventoryError: null,
    
    // Pagination for infinite scroll
    pagination: {
      lastDoc: null,
      hasMore: true,
      currentPage: 0,
      totalLoaded: 0,
      isFetching: false
    },

    // Filters
    filters: {
      warehouse: '',
      search: '',
      searchField: 'name'
    },

    // Transactions
    transactions: [],
    recentTransactions: [],
    transactionsLoading: false,

    // Item history
    itemHistory: [],

    // Notifications
    notifications: [],

    // Real-time
    realtimeMode: true,
    realtimeListeners: [],
    
    // Operation states
    operationLoading: false,
    operationError: null,

    // Users management
    requiresCompositeIndex: false,
    allUsers: [],
    usersLoading: false,

    // Minimal cache for frequently accessed items
    cache: {
      warehouseLabels: {},
      itemDetails: {}, // Only cache individual items when accessed
      stats: null,
      statsTimestamp: null
    },

    // Additional states from older version
    fieldMappings: FIELD_MAPPINGS,
    inventoryLastFetched: null,
    isFetchingInventory: false,
    isRefreshingSilently: false,
    recentTransactionsLoading: false
  }),

  mutations: {
    // User mutations
    SET_USER(state, user) {
      state.user = user;
    },

    SET_USER_PROFILE(state, profile) {
      state.userProfile = profile;
    },

    SET_LOADING(state, loading) {
      state.loading = loading;
    },

    SET_AUTH_ERROR(state, error) {
      state.authError = error;
    },

    // Inventory mutations
    SET_INVENTORY(state, inventory) {
      state.inventory = inventory;
    },

    APPEND_INVENTORY(state, items) {
      // Remove duplicates before appending
      const existingIds = new Set(state.inventory.map(item => item.id));
      const newItems = items.filter(item => !existingIds.has(item.id));
      state.inventory.push(...newItems);
      state.pagination.totalLoaded = state.inventory.length;
    },

    UPDATE_INVENTORY_ITEM(state, updatedItem) {
      const index = state.inventory.findIndex(item => item.id === updatedItem.id);
      if (index !== -1) {
        state.inventory.splice(index, 1, updatedItem);
      } else {
        // Add new item at the beginning
        state.inventory.unshift(updatedItem);
        state.pagination.totalLoaded++;
      }
    },

    REMOVE_INVENTORY_ITEM(state, itemId) {
      state.inventory = state.inventory.filter(item => item.id !== itemId);
      state.pagination.totalLoaded = state.inventory.length;
    },

    SET_INVENTORY_LOADING(state, loading) {
      state.inventoryLoading = loading;
    },

    SET_INVENTORY_LOADED(state, loaded) {
      state.inventoryLoaded = loaded;
    },

    SET_INVENTORY_ERROR(state, error) {
      state.inventoryError = error;
    },

    // Pagination mutations
    SET_PAGINATION(state, pagination) {
      state.pagination = { ...state.pagination, ...pagination };
    },

    RESET_PAGINATION(state) {
      state.pagination = {
        lastDoc: null,
        hasMore: true,
        currentPage: 0,
        totalLoaded: 0,
        isFetching: false
      };
    },

    // Filter mutations
    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters };
    },

    CLEAR_FILTERS(state) {
      state.filters = {
        warehouse: '',
        search: '',
        searchField: 'name'
      };
    },

    // Warehouse mutations
    SET_WAREHOUSES(state, warehouses) {
      state.warehouses = warehouses;
      state.warehousesLoaded = true;
      
      // Update warehouse labels cache
      state.cache.warehouseLabels = {};
      warehouses.forEach(w => {
        state.cache.warehouseLabels[w.id] = w.name_ar;
      });
    },

    // Transaction mutations
    SET_TRANSACTIONS(state, transactions) {
      state.transactions = transactions;
    },

    SET_RECENT_TRANSACTIONS(state, transactions) {
      state.recentTransactions = transactions;
    },

    SET_TRANSACTIONS_LOADING(state, loading) {
      state.transactionsLoading = loading;
    },

    ADD_TRANSACTION(state, transaction) {
      if (transaction) {
        state.transactions.unshift(transaction);
        state.recentTransactions.unshift(transaction);
        
        // Keep recent transactions limited
        if (state.recentTransactions.length > 50) {
          state.recentTransactions = state.recentTransactions.slice(0, 50);
        }
      }
    },

    ADD_RECENT_TRANSACTION(state, transaction) {
      if (transaction) {
        state.recentTransactions.unshift(transaction);
        
        // Keep recent transactions limited
        if (state.recentTransactions.length > 50) {
          state.recentTransactions = state.recentTransactions.slice(0, 50);
        }
      }
    },

    // Item history
    SET_ITEM_HISTORY(state, history) {
      state.itemHistory = history;
    },

    // Notifications
    ADD_NOTIFICATION(state, notification) {
      notification.id = Date.now().toString();
      notification.timestamp = new Date();
      state.notifications.unshift(notification);

      if (state.notifications.length > 20) {
        state.notifications = state.notifications.slice(0, 20);
      }
    },

    REMOVE_NOTIFICATION(state, notificationId) {
      state.notifications = state.notifications.filter(n => n.id !== notificationId);
    },

    CLEAR_NOTIFICATIONS(state) {
      state.notifications = [];
    },

    // Real-time mutations
    SET_REALTIME_MODE(state, mode) {
      state.realtimeMode = mode;
    },

    ADD_REALTIME_LISTENER(state, listener) {
      state.realtimeListeners.push(listener);
    },

    CLEAR_REALTIME_LISTENERS(state) {
      state.realtimeListeners.forEach(unsubscribe => unsubscribe());
      state.realtimeListeners = [];
    },

    // Operation states
    SET_OPERATION_LOADING(state, loading) {
      state.operationLoading = loading;
    },

    SET_OPERATION_ERROR(state, error) {
      state.operationError = error;
    },

    CLEAR_OPERATION_ERROR(state) {
      state.operationError = null;
    },

    // Cache mutations
    CACHE_ITEM_DETAIL(state, { itemId, itemData }) {
      state.cache.itemDetails[itemId] = {
        data: itemData,
        timestamp: Date.now()
      };
    },

    CLEAR_ITEM_CACHE(state, itemId) {
      delete state.cache.itemDetails[itemId];
    },

    SET_STATS_CACHE(state, { stats, timestamp }) {
      state.cache.stats = stats;
      state.cache.statsTimestamp = timestamp;
    },

    // Users management
    SET_REQUIRES_COMPOSITE_INDEX(state, value) {
      state.requiresCompositeIndex = value;
    },

    SET_ALL_USERS(state, users) {
      state.allUsers = users;
    },

    SET_USERS_LOADING(state, loading) {
      state.usersLoading = loading;
    },

    // Additional mutations from older version
    SET_INVENTORY_LAST_FETCHED(state, timestamp) {
      state.inventoryLastFetched = timestamp;
    },

    SET_IS_FETCHING_INVENTORY(state, fetching) {
      state.isFetchingInventory = fetching;
    },

    SET_IS_REFRESHING_SILENTLY(state, refreshing) {
      state.isRefreshingSilently = refreshing;
    },

    SET_RECENT_TRANSACTIONS_LOADING(state, loading) {
      state.recentTransactionsLoading = loading;
    },

    // Reset all data on logout
    RESET_STATE(state) {
      state.inventory = [];
      state.inventoryLoaded = false;
      state.transactions = [];
      state.recentTransactions = [];
      state.itemHistory = [];
      state.warehouses = [];
      state.warehousesLoaded = false;
      state.notifications = [];
      state.allUsers = [];
      state.filters = {
        warehouse: '',
        search: '',
        searchField: 'name'
      };
      state.cache = {
        warehouseLabels: {},
        itemDetails: {},
        stats: null,
        statsTimestamp: null
      };
      state.realtimeListeners.forEach(unsubscribe => unsubscribe());
      state.realtimeListeners = [];
    }
  },

  actions: {
    // 🔥 REAL-TIME SEARCH FUNCTION (from older version)
    async searchItemsForTransactions({ state }, { searchTerm, limitResults = 20 }) {
      try {
        console.log('🔍 REAL-TIME SEARCH:', searchTerm);
        if (!searchTerm || searchTerm.trim().length < 2) {
          return [];
        }
        const term = searchTerm.trim().toLowerCase();
        // Always search Firestore directly for real-time results
        console.log('⚡ Searching Firestore directly...');
        const itemsRef = collection(db, 'items');
        let firestoreQuery;
        // Try multiple search strategies
        const searchPromises = [];
        // Strategy 1: Search by code (exact match first)
        const codeQuery = query(
          itemsRef,
          where('code', '>=', term),
          where('code', '<=', term + '\uf8ff'),
          orderBy('code'),
          limit(limitResults)
        );
        searchPromises.push(getDocs(codeQuery));
        // Strategy 2: Search by name (for longer searches)
        if (term.length > 3) {
          const nameQuery = query(
            itemsRef,
            where('name', '>=', term),
            where('name', '<=', term + '\uf8ff'),
            orderBy('name'),
            limit(limitResults)
          );
          searchPromises.push(getDocs(nameQuery));
        }
        // Execute all search strategies
        const results = await Promise.allSettled(searchPromises);
        // Combine results from all strategies
        const allItems = new Map(); // Use Map to avoid duplicates by ID
        for (const result of results) {
          if (result.status === 'fulfilled' && !result.value.empty) {
            result.value.docs.forEach(doc => {
              if (!allItems.has(doc.id)) {
                const itemData = doc.data();
                // Check warehouse permissions for logged in users only
                if (!state.user || state.userProfile.role === 'superadmin' ||
                    state.userProfile.role === 'company_manager' ||
                    (state.userProfile.role === 'warehouse_manager' &&
                     (state.userProfile.allowed_warehouses?.includes('all') ||
                      state.userProfile.allowed_warehouses?.includes(itemData.warehouse_id)))) {
                  allItems.set(doc.id, InventoryService.convertForDisplay({
                    id: doc.id,
                    ...itemData
                  }));
                }
              }
            });
          }
        }
        // Convert Map to array and sort by relevance
        let firestoreResults = Array.from(allItems.values());
        // Sort by relevance: exact code matches first, then name matches
        firestoreResults.sort((a, b) => {
          const aCodeMatch = a.code?.toLowerCase().startsWith(term) ? 0 : 1;
          const bCodeMatch = b.code?.toLowerCase().startsWith(term) ? 0 : 1;
          if (aCodeMatch !== bCodeMatch) return aCodeMatch - bCodeMatch;
          const aNameMatch = a.name?.toLowerCase().includes(term) ? 0 : 1;
          const bNameMatch = b.name?.toLowerCase().includes(term) ? 0 : 1;
          return aNameMatch - bNameMatch;
        });
        // Limit results
        firestoreResults = firestoreResults.slice(0, limitResults);
        console.log(`✅ Found ${firestoreResults.length} items in Firestore search`);
        // If no results in Firestore, check local cache as fallback
        if (firestoreResults.length === 0) {
          const localResults = state.inventory.filter(item =>
            item.name?.toLowerCase().includes(term) ||
            item.code?.toLowerCase().includes(term) ||
            item.color?.toLowerCase().includes(term) ||
            item.supplier?.toLowerCase().includes(term)
          ).slice(0, limitResults);
          console.log('📦 Using local inventory as fallback:', localResults.length);
          return localResults;
        }
        return firestoreResults;
      } catch (error) {
        console.error('❌ Error in real-time search:', error);
        // Fallback to local search on error
        const term = searchTerm?.trim().toLowerCase() || '';
        const fallbackResults = state.inventory.filter(item =>
          item.name?.toLowerCase().includes(term) ||
          item.code?.toLowerCase().includes(term) ||
          item.color?.toLowerCase().includes(term)
        ).slice(0, 10);
        console.log('🔄 Fallback to local search due to error:', error.message);
        return fallbackResults;
      }
    },

    // 🔥 Get item by ID with real-time search
    async getItemById({ state, dispatch }, { itemId, itemCode, itemName }) {
      try {
        console.log('🔍 GET ITEM (Real-time):', { itemId, itemCode, itemName });
        if (!itemId && !itemCode && !itemName) {
          throw new Error('معرف الصنف أو الكود أو الاسم مطلوب');
        }
        // First, check local inventory
        let item = state.inventory.find(i =>
          i.id === itemId ||
          (itemCode && i.code === itemCode) ||
          (itemName && i.name === itemName)
        );
        if (item) {
          console.log('✅ Item found in recent inventory');
          return item;
        }
        console.log('⚡ Item not in recent inventory. Searching Firestore...');
        // If we have an ID, try to get the item directly
        if (itemId) {
          try {
            const itemDoc = await getDoc(doc(db, 'items', itemId));
            if (itemDoc.exists()) {
              const itemData = itemDoc.data();
              // Check warehouse permissions only for logged in users
              if (state.user && state.userProfile?.role === 'warehouse_manager') {
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
              console.log('✅ Item fetched from Firestore by ID');
              return convertedItem;
            }
          } catch (error) {
            console.log('Item not found by ID:', error.message);
          }
        }
        // If we have a code, search by code
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
              // Allow public access for viewing
              if (!state.user) return true;
              const itemData = doc.data();
              if (state.userProfile.role === 'superadmin') return true;
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
              console.log(`✅ Item found by code`);
              return convertedItem;
            }
          }
        }
        // If we have a name, search by name
        if (itemName && itemName.length >= 2) {
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
              // Allow public access for viewing
              if (!state.user) return true;
              const itemData = doc.data();
              if (state.userProfile.role === 'superadmin') return true;
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
              console.log(`✅ Item found by name`);
              return convertedItem;
            }
          }
        }
        // If nothing found, use the real-time search
        console.log('🔄 Using real-time search...');
        const searchTerm = itemCode || itemName || '';
        if (searchTerm.length >= 2) {
          const searchResults = await dispatch('searchItemsForTransactions', {
            searchTerm: searchTerm,
            limitResults: 10
          });
          if (searchResults.length > 0) {
            const foundItem = searchResults[0];
            console.log('✅ Item found through real-time search');
            return foundItem;
          }
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

    // 🔥 Get items from warehouse
    async getItemsFromWarehouse({ state, dispatch }, { warehouseId, limitResults = 20 }) {
      try {
        console.log('🔄 Getting items from warehouse (real-time):', warehouseId);
        if (!warehouseId) {
          throw new Error('معرف المخزن مطلوب');
        }
        // Allow public viewing, only check permissions for logged in users
        if (state.user && state.userProfile?.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
            if (!allowedWarehouses.includes(warehouseId)) {
              throw new Error('ليس لديك صلاحية للوصول إلى هذا المخزن');
            }
          }
        }
        const localItems = state.inventory.filter(item => item.warehouse_id === warehouseId);
        if (localItems.length >= limitResults) {
          console.log('✅ Found items in recent inventory:', localItems.length);
          return localItems.slice(0, limitResults);
        }
        // Always try to get fresh data from Firestore
        const itemsRef = collection(db, 'items');
        try {
          const q = query(
            itemsRef,
            where('warehouse_id', '==', warehouseId),
            orderBy('createdAt', 'desc'),
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
          return items;
        } catch (error) {
          console.warn('Using alternative query...', error);
          // Try without orderBy if it fails
          const q = query(
            itemsRef,
            where('warehouse_id', '==', warehouseId),
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
          // Sort locally by createdAt desc
          items.sort((a, b) => {
            const dateA = a.createdAt || a.created_at || 0;
            const dateB = b.createdAt || b.created_at || 0;
            return new Date(dateB) - new Date(dateA);
          });
          return items;
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

    // 🔥 MAIN ACTION: Load ALL inventory with pagination
    async loadAllInventory({ commit, state, dispatch }, { forceRefresh = false } = {}) {
      // Don't reload if already loading or loaded (unless forced)
      if (state.inventoryLoading) {
        console.log('Inventory load already in progress');
        return state.inventory;
      }

      if (state.inventoryLoaded && !forceRefresh) {
        console.log('Inventory already loaded');
        return state.inventory;
      }

      commit('SET_INVENTORY_LOADING', true);
      commit('SET_INVENTORY_ERROR', null);
      commit('RESET_PAGINATION');

      try {
        console.log('🔄 Loading ALL inventory...');

        if (!state.userProfile) {
          throw new Error('User not authenticated');
        }

        // Build query based on user role and permissions
        const itemsRef = collection(db, 'items');
        let itemsQuery;

        if (state.userProfile.role === 'superadmin' || state.userProfile.role === 'company_manager') {
          // Superadmins and company managers see ALL items
          itemsQuery = query(
            itemsRef,
            orderBy('name'),
            limit(PERFORMANCE_CONFIG.INITIAL_LOAD)
          );
        } else if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          
          if (allowedWarehouses.length === 0) {
            throw new Error('No warehouses assigned to this manager');
          }

          if (allowedWarehouses.includes('all')) {
            // Has access to all warehouses
            itemsQuery = query(
              itemsRef,
              orderBy('name'),
              limit(PERFORMANCE_CONFIG.INITIAL_LOAD)
            );
          } else {
            // Limited to specific warehouses
            itemsQuery = query(
              itemsRef,
              where('warehouse_id', 'in', allowedWarehouses.slice(0, 10)),
              orderBy('name'),
              limit(PERFORMANCE_CONFIG.INITIAL_LOAD)
            );
          }
        } else {
          throw new Error('User role not authorized for inventory access');
        }

        const snapshot = await getDocs(itemsQuery);
        console.log(`✅ Initial inventory loaded: ${snapshot.size} items`);

        // Process items
        const inventory = snapshot.docs.map(doc => {
          const data = doc.data();
          return InventoryService.convertForDisplay({
            id: doc.id,
            ...data
          });
        });

        // Set pagination state
        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        commit('SET_PAGINATION', {
          lastDoc,
          hasMore: snapshot.size === PERFORMANCE_CONFIG.INITIAL_LOAD,
          totalLoaded: inventory.length
        });

        // Set inventory
        commit('SET_INVENTORY', inventory);
        commit('SET_INVENTORY_LOADED', true);

        // Setup real-time updates for ALL loaded items
        if (state.realtimeMode) {
          await dispatch('setupRealtimeUpdatesForInventory');
        }

        console.log(`🎉 Inventory loaded successfully: ${inventory.length} items`);
        return inventory;

      } catch (error) {
        console.error('❌ Error loading inventory:', error);
        commit('SET_INVENTORY_ERROR', error.message);
        
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تحميل المخزون'
        });
        
        return [];
      } finally {
        commit('SET_INVENTORY_LOADING', false);
      }
    },

    // 🔥 Load more items (for infinite scroll)
    async loadMoreInventory({ commit, state, dispatch }) {
      if (!state.pagination.hasMore || state.pagination.isFetching) {
        return [];
      }

      commit('SET_PAGINATION', { isFetching: true });

      try {
        console.log('📥 Loading more inventory items...');

        if (!state.userProfile || !state.pagination.lastDoc) {
          return [];
        }

        const itemsRef = collection(db, 'items');
        let itemsQuery;

        if (state.userProfile.role === 'superadmin' || state.userProfile.role === 'company_manager') {
          itemsQuery = query(
            itemsRef,
            orderBy('name'),
            startAfter(state.pagination.lastDoc),
            limit(PERFORMANCE_CONFIG.SCROLL_LOAD)
          );
        } else if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          
          if (allowedWarehouses.includes('all')) {
            itemsQuery = query(
              itemsRef,
              orderBy('name'),
              startAfter(state.pagination.lastDoc),
              limit(PERFORMANCE_CONFIG.SCROLL_LOAD)
            );
          } else {
            itemsQuery = query(
              itemsRef,
              where('warehouse_id', 'in', allowedWarehouses.slice(0, 10)),
              orderBy('name'),
              startAfter(state.pagination.lastDoc),
              limit(PERFORMANCE_CONFIG.SCROLL_LOAD)
            );
          }
        } else {
          return [];
        }

        const snapshot = await getDocs(itemsQuery);
        console.log(`📥 Loaded ${snapshot.size} more items`);

        if (snapshot.empty) {
          commit('SET_PAGINATION', { hasMore: false });
          return [];
        }

        // Process new items
        const newItems = snapshot.docs.map(doc => {
          const data = doc.data();
          return InventoryService.convertForDisplay({
            id: doc.id,
            ...data
          });
        });

        // Update state
        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        const totalLoaded = state.pagination.totalLoaded + newItems.length;
        
        commit('APPEND_INVENTORY', newItems);
        commit('SET_PAGINATION', {
          lastDoc,
          hasMore: snapshot.size === PERFORMANCE_CONFIG.SCROLL_LOAD,
          totalLoaded,
          currentPage: state.pagination.currentPage + 1
        });

        // Setup real-time updates for new items
        if (state.realtimeMode) {
          await dispatch('setupRealtimeUpdatesForItems', newItems.map(item => item.id));
        }

        return newItems;

      } catch (error) {
        console.error('❌ Error loading more inventory:', error);
        
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تحميل المزيد من العناصر'
        });
        
        return [];
      } finally {
        commit('SET_PAGINATION', { isFetching: false });
      }
    },

    // 🔥 Setup real-time updates for ALL inventory items
    async setupRealtimeUpdatesForInventory({ commit, state, dispatch }) {
      if (!state.realtimeMode || state.inventory.length === 0) return;

      try {
        console.log('🔴 Setting up real-time updates for inventory...');

        // Setup listener for each item in inventory
        const listeners = state.inventory.map(item => {
          const itemRef = doc(db, 'items', item.id);
          
          return onSnapshot(itemRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              const updatedItem = InventoryService.convertForDisplay({
                id: docSnapshot.id,
                ...data
              });

              // Update in Vuex store
              commit('UPDATE_INVENTORY_ITEM', updatedItem);

              // Cache the updated item
              commit('CACHE_ITEM_DETAIL', {
                itemId: docSnapshot.id,
                itemData: updatedItem
              });
            } else {
              // Item was deleted
              commit('REMOVE_INVENTORY_ITEM', item.id);
              commit('CLEAR_ITEM_CACHE', item.id);
            }
          }, (error) => {
            console.error(`❌ Real-time error for item ${item.id}:`, error);
          });
        });

        // Store listeners
        listeners.forEach(listener => commit('ADD_REALTIME_LISTENER', listener));

        console.log(`✅ Real-time updates set up for ${listeners.length} items`);

      } catch (error) {
        console.error('❌ Error setting up real-time updates:', error);
      }
    },

    // 🔥 Setup real-time updates for specific items
    async setupRealtimeUpdatesForItems({ commit, state }, itemIds) {
      if (!state.realtimeMode || !itemIds || itemIds.length === 0) return;

      try {
        console.log(`🔴 Setting up real-time for ${itemIds.length} items`);

        const listeners = itemIds.map(itemId => {
          const itemRef = doc(db, 'items', itemId);
          
          return onSnapshot(itemRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              const updatedItem = InventoryService.convertForDisplay({
                id: docSnapshot.id,
                ...data
              });

              commit('UPDATE_INVENTORY_ITEM', updatedItem);
              commit('CACHE_ITEM_DETAIL', {
                itemId: docSnapshot.id,
                itemData: updatedItem
              });
            } else {
              commit('REMOVE_INVENTORY_ITEM', itemId);
              commit('CLEAR_ITEM_CACHE', itemId);
            }
          });
        });

        listeners.forEach(listener => commit('ADD_REALTIME_LISTENER', listener));

      } catch (error) {
        console.error('❌ Error setting up real-time updates for items:', error);
      }
    },

    // 🔥 Search inventory
    async searchInventory({ commit, state, dispatch }, searchParams) {
      commit('SET_INVENTORY_LOADING', true);
      commit('SET_INVENTORY_ERROR', null);
      commit('RESET_PAGINATION');

      try {
        const { search, warehouse, searchField = 'name' } = searchParams || {};
        
        // Update filters
        commit('SET_FILTERS', { search, warehouse, searchField });

        if (!state.userProfile) {
          throw new Error('User not authenticated');
        }

        const itemsRef = collection(db, 'items');
        let itemsQuery;

        // Build base query with permissions
        if (state.userProfile.role === 'superadmin' || state.userProfile.role === 'company_manager') {
          if (search && search.length >= 2) {
            // Search with text
            itemsQuery = query(
              itemsRef,
              where(searchField, '>=', search.toLowerCase()),
              where(searchField, '<=', search.toLowerCase() + '\uf8ff'),
              orderBy(searchField),
              limit(PERFORMANCE_CONFIG.SEARCH_LIMIT)
            );
          } else if (warehouse) {
            // Filter by warehouse
            itemsQuery = query(
              itemsRef,
              where('warehouse_id', '==', warehouse),
              orderBy('name'),
              limit(PERFORMANCE_CONFIG.INITIAL_LOAD)
            );
          } else {
            // All items
            itemsQuery = query(
              itemsRef,
              orderBy('name'),
              limit(PERFORMANCE_CONFIG.INITIAL_LOAD)
            );
          }
        } else if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          
          if (allowedWarehouses.includes('all')) {
            if (search && search.length >= 2) {
              itemsQuery = query(
                itemsRef,
                where(searchField, '>=', search.toLowerCase()),
                where(searchField, '<=', search.toLowerCase() + '\uf8ff'),
                orderBy(searchField),
                limit(PERFORMANCE_CONFIG.SEARCH_LIMIT)
              );
            } else if (warehouse) {
              itemsQuery = query(
                itemsRef,
                where('warehouse_id', '==', warehouse),
                orderBy('name'),
                limit(PERFORMANCE_CONFIG.INITIAL_LOAD)
              );
            } else {
              itemsQuery = query(
                itemsRef,
                orderBy('name'),
                limit(PERFORMANCE_CONFIG.INITIAL_LOAD)
              );
            }
          } else {
            // Limited warehouses
            const warehousesFilter = allowedWarehouses.slice(0, 10);
            
            if (search && search.length >= 2) {
              itemsQuery = query(
                itemsRef,
                where('warehouse_id', 'in', warehousesFilter),
                where(searchField, '>=', search.toLowerCase()),
                where(searchField, '<=', search.toLowerCase() + '\uf8ff'),
                orderBy(searchField),
                limit(PERFORMANCE_CONFIG.SEARCH_LIMIT)
              );
            } else if (warehouse && warehousesFilter.includes(warehouse)) {
              itemsQuery = query(
                itemsRef,
                where('warehouse_id', '==', warehouse),
                orderBy('name'),
                limit(PERFORMANCE_CONFIG.INITIAL_LOAD)
              );
            } else {
              itemsQuery = query(
                itemsRef,
                where('warehouse_id', 'in', warehousesFilter),
                orderBy('name'),
                limit(PERFORMANCE_CONFIG.INITIAL_LOAD)
              );
            }
          }
        } else {
          throw new Error('User role not authorized');
        }

        const snapshot = await getDocs(itemsQuery);
        console.log(`🔍 Search found: ${snapshot.size} items`);

        const inventory = snapshot.docs.map(doc => {
          const data = doc.data();
          return InventoryService.convertForDisplay({
            id: doc.id,
            ...data
          });
        });

        // Set pagination
        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        commit('SET_PAGINATION', {
          lastDoc,
          hasMore: snapshot.size === (search ? PERFORMANCE_CONFIG.SEARCH_LIMIT : PERFORMANCE_CONFIG.INITIAL_LOAD),
          totalLoaded: inventory.length
        });

        // Set inventory
        commit('SET_INVENTORY', inventory);
        commit('SET_INVENTORY_LOADED', true);

        // Setup real-time updates
        if (state.realtimeMode) {
          await dispatch('setupRealtimeUpdatesForInventory');
        }

        return inventory;

      } catch (error) {
        console.error('❌ Error searching inventory:', error);
        commit('SET_INVENTORY_ERROR', error.message);
        
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في البحث'
        });
        
        return [];
      } finally {
        commit('SET_INVENTORY_LOADING', false);
      }
    },

    // 🔥 Clear filters and show all
    async clearFiltersAndShowAll({ dispatch }) {
      await dispatch('searchInventory', {});
    },

    // 🔥 Refresh inventory (force reload)
    async refreshInventory({ dispatch }) {
      console.log('🔄 Refreshing inventory...');
      await dispatch('clearRealtimeUpdates');
      return await dispatch('loadAllInventory', { forceRefresh: true });
    },

    // 🔥 Clear real-time updates
    async clearRealtimeUpdates({ commit }) {
      console.log('🧹 Clearing real-time listeners...');
      commit('CLEAR_REALTIME_LISTENERS');
    },

    // 🔥 Get single item with cache
    async getItem({ commit, state, dispatch }, itemId) {
      try {
        // Check cache first
        const cachedItem = state.cache.itemDetails[itemId];
        if (cachedItem && (Date.now() - cachedItem.timestamp) < PERFORMANCE_CONFIG.CACHE_DURATION) {
          return cachedItem.data;
        }

        console.log(`🔍 Getting item from Firestore: ${itemId}`);

        const itemDoc = await getDoc(doc(db, 'items', itemId));
        
        if (!itemDoc.exists()) {
          throw new Error('الصنف غير موجود');
        }

        const data = itemDoc.data();
        
        // Check permissions
        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
            if (!allowedWarehouses.includes(data.warehouse_id)) {
              throw new Error('ليس لديك صلاحية للوصول إلى هذا الصنف');
            }
          }
        }

        const item = InventoryService.convertForDisplay({
          id: itemDoc.id,
          ...data
        });

        // Cache the item
        commit('CACHE_ITEM_DETAIL', {
          itemId: itemDoc.id,
          itemData: item
        });

        return item;

      } catch (error) {
        console.error('❌ Error getting item:', error);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'خطأ في تحميل الصنف'
        });
        throw error;
      }
    },

    // 🔥 Add new item
    async addInventoryItem({ commit, state, dispatch }, { itemData, isAddingCartons = true }) {
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

        // Validate required fields
        if (!itemData.name?.trim() || !itemData.code?.trim() || !itemData.warehouse_id) {
          throw new Error('جميع الحقول المطلوبة يجب أن تكون مملوءة (الاسم، الكود، المخزن)');
        }

        // Check warehouse permissions
        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
            if (!allowedWarehouses.includes(itemData.warehouse_id)) {
              throw new Error('ليس لديك صلاحية لإضافة أصناف في هذا المخزن');
            }
          }
        }

        // Calculate total quantity
        const totalQuantity = InventoryService.calculateTotalQuantity(
          itemData.cartons_count || 0,
          itemData.per_carton_count || 12,
          itemData.single_bottles_count || 0
        );

        if (totalQuantity <= 0 && isAddingCartons) {
          throw new Error('يجب إدخال كمية صحيحة');
        }

        // Prepare data
        const cleanData = {
          name: itemData.name.trim(),
          code: itemData.code.trim(),
          color: itemData.color?.trim() || '',
          warehouse_id: itemData.warehouse_id,
          cartons_count: Number(itemData.cartons_count) || 0,
          per_carton_count: Number(itemData.per_carton_count) || 12,
          single_bottles_count: Number(itemData.single_bottles_count) || 0,
          supplier: itemData.supplier?.trim() || '',
          item_location: itemData.item_location?.trim() || '',
          notes: itemData.notes?.trim() || '',
          remaining_quantity: totalQuantity,
          total_added: totalQuantity,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
          created_by: state.user.uid,
          updated_by: state.user.uid
        };

        // Add to Firestore
        const docRef = await addDoc(collection(db, 'items'), cleanData);
        
        // Create transaction record
        const transactionData = {
          type: TRANSACTION_TYPES.ADD,
          item_id: docRef.id,
          item_name: cleanData.name,
          item_code: cleanData.code,
          from_warehouse: null,
          to_warehouse: cleanData.warehouse_id,
          cartons_delta: cleanData.cartons_count,
          per_carton_updated: cleanData.per_carton_count,
          single_delta: cleanData.single_bottles_count,
          total_delta: totalQuantity,
          new_remaining: totalQuantity,
          user_id: state.user.uid,
          timestamp: serverTimestamp(),
          notes: cleanData.notes || 'عملية إضافة جديدة',
          created_by: state.userProfile?.name || state.user?.email || 'نظام'
        };

        await addDoc(collection(db, 'transactions'), transactionData);

        // Convert for display and update store
        const newItem = InventoryService.convertForDisplay({
          id: docRef.id,
          ...cleanData
        });

        commit('ADD_RECENT_TRANSACTION', transactionData);
        commit('UPDATE_INVENTORY_ITEM', newItem);
        commit('CACHE_ITEM_DETAIL', {
          itemId: docRef.id,
          itemData: newItem
        });

        dispatch('showNotification', {
          type: 'success',
          message: `تم إضافة الصنف "${cleanData.name}" بنجاح`
        });

        return { id: docRef.id, item: newItem, type: 'created' };

      } catch (error) {
        console.error('❌ Error adding inventory item:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ غير متوقع أثناء إضافة الصنف'
        });

        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    // 🔥 Update existing item
    async updateItem({ commit, state, dispatch }, { itemId, itemData }) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }
        if (!['superadmin', 'warehouse_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لتعديل الأصناف');
        }

        // Get existing item
        const itemRef = doc(db, 'items', itemId);
        const itemDoc = await getDoc(itemRef);

        if (!itemDoc.exists()) {
          throw new Error('الصنف غير موجود');
        }

        const existingItem = itemDoc.data();

        // Check warehouse permissions
        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          const warehouseId = itemData.warehouse_id || existingItem.warehouse_id;
          if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
            if (!allowedWarehouses.includes(warehouseId)) {
              throw new Error('ليس لديك صلاحية لتعديل أصناف في هذا المخزن');
            }
          }
        }

        // Calculate new quantities
        const newCartonsCount = Number(itemData.cartons_count) || existingItem.cartons_count || 0;
        const newPerCartonCount = Number(itemData.per_carton_count) || existingItem.per_carton_count || 12;
        const newSingleBottlesCount = Number(itemData.single_bottles_count) || existingItem.single_bottles_count || 0;
        const newTotalQuantity = InventoryService.calculateTotalQuantity(
          newCartonsCount,
          newPerCartonCount,
          newSingleBottlesCount
        );

        const oldTotalQuantity = existingItem.remaining_quantity || 0;
        const quantityDiff = newTotalQuantity - oldTotalQuantity;

        // Prepare update data
        const updateData = {
          name: itemData.name?.trim() || existingItem.name,
          code: itemData.code?.trim() || existingItem.code,
          color: itemData.color?.trim() || existingItem.color || '',
          warehouse_id: itemData.warehouse_id || existingItem.warehouse_id,
          cartons_count: newCartonsCount,
          per_carton_count: newPerCartonCount,
          single_bottles_count: newSingleBottlesCount,
          remaining_quantity: newTotalQuantity,
          total_added: existingItem.total_added + Math.max(0, quantityDiff),
          supplier: itemData.supplier?.trim() || existingItem.supplier || '',
          item_location: itemData.item_location?.trim() || existingItem.item_location || '',
          notes: itemData.notes?.trim() || existingItem.notes || '',
          updated_at: serverTimestamp(),
          updated_by: state.user.uid
        };

        // Update in Firestore
        await updateDoc(itemRef, updateData);

        // Create transaction record if quantity changed
        if (quantityDiff !== 0 || existingItem.warehouse_id !== updateData.warehouse_id) {
          const transactionData = {
            type: 'UPDATE',
            item_id: itemId,
            item_name: updateData.name,
            item_code: updateData.code,
            from_warehouse: existingItem.warehouse_id !== updateData.warehouse_id ? existingItem.warehouse_id : null,
            to_warehouse: updateData.warehouse_id,
            cartons_delta: newCartonsCount - (existingItem.cartons_count || 0),
            per_carton_updated: newPerCartonCount,
            single_delta: newSingleBottlesCount - (existingItem.single_bottles_count || 0),
            total_delta: quantityDiff,
            new_remaining: newTotalQuantity,
            user_id: state.user.uid,
            timestamp: serverTimestamp(),
            notes: `تعديل الصنف: ${updateData.notes || ''}`.trim(),
            created_by: state.userProfile?.name || state.user?.email || 'نظام'
          };

          await addDoc(collection(db, 'transactions'), transactionData);
          commit('ADD_RECENT_TRANSACTION', transactionData);
        }

        // Update store
        const updatedItem = InventoryService.convertForDisplay({
          id: itemId,
          ...updateData
        });

        commit('UPDATE_INVENTORY_ITEM', updatedItem);
        commit('CACHE_ITEM_DETAIL', {
          itemId: itemId,
          itemData: updatedItem
        });

        dispatch('showNotification', {
          type: 'success',
          message: `تم تحديث الصنف "${updateData.name}" بنجاح`
        });

        return { success: true, item: updatedItem };

      } catch (error) {
        console.error('❌ Error updating item:', error);
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

    // 🔥 Delete item
    async deleteItem({ commit, state, dispatch }, itemId) {
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

        // Get item first for transaction record
        const itemRef = doc(db, 'items', itemId);
        const itemDoc = await getDoc(itemRef);

        if (!itemDoc.exists()) {
          throw new Error('الصنف غير موجود');
        }

        const itemData = itemDoc.data();

        // Check warehouse permissions for warehouse managers
        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
            if (!allowedWarehouses.includes(itemData.warehouse_id)) {
              throw new Error('ليس لديك صلاحية لحذف أصناف من هذا المخزن');
            }
          }
        }

        // Create transaction record before deletion
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
          timestamp: serverTimestamp(),
          notes: 'حذف الصنف نهائياً',
          created_by: state.userProfile?.name || state.user?.email || 'نظام'
        };

        await addDoc(collection(db, 'transactions'), transactionData);

        // Delete the item
        await deleteDoc(itemRef);

        // Update store
        commit('REMOVE_INVENTORY_ITEM', itemId);
        commit('CLEAR_ITEM_CACHE', itemId);
        commit('ADD_RECENT_TRANSACTION', transactionData);

        dispatch('showNotification', {
          type: 'success',
          message: `تم حذف الصنف "${itemData.name}" بنجاح`
        });

        return { success: true, message: 'تم حذف الصنف بنجاح' };

      } catch (error) {
        console.error('❌ Error deleting item:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في حذف الصنف'
        });

        return { success: false, error: error.message };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    // 🔥 Transfer item (COMPLETE IMPLEMENTATION)
    async transferItem({ commit, state, dispatch }, transferData) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        // Check permissions
        if (!['superadmin', 'warehouse_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لنقل الأصناف');
        }

        // Validate required fields
        if (!transferData.item_id || !transferData.from_warehouse_id || !transferData.to_warehouse_id) {
          throw new Error('بيانات النقل غير مكتملة');
        }

        if (transferData.from_warehouse_id === transferData.to_warehouse_id) {
          throw new Error('لا يمكن نقل الصنف إلى نفس المخزن');
        }

        // Check warehouse permissions for warehouse managers
        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
            if (!allowedWarehouses.includes(transferData.from_warehouse_id) ||
                !allowedWarehouses.includes(transferData.to_warehouse_id)) {
              throw new Error('ليس لديك صلاحية للنقل من/إلى هذه المخازن');
            }
          }
        }

        // Get the item from Firestore
        const itemRef = doc(db, 'items', transferData.item_id);
        const itemDoc = await getDoc(itemRef);

        if (!itemDoc.exists()) {
          throw new Error('الصنف غير موجود');
        }

        const itemData = itemDoc.data();

        // Verify item is in the source warehouse
        if (itemData.warehouse_id !== transferData.from_warehouse_id) {
          throw new Error('الصنف ليس في المخزن المصدر المحدد');
        }

        // Check if there's enough quantity to transfer
        const availableQuantity = itemData.remaining_quantity || 0;
        const transferQuantity = (transferData.cartons_count || 0) * (transferData.per_carton_count || 0) + 
                                (transferData.single_bottles_count || 0);
        
        if (transferQuantity > availableQuantity) {
          throw new Error('الكمية المطلوبة للنقل أكبر من الكمية المتاحة');
        }

        // Calculate new quantities
        const newQuantity = availableQuantity - transferQuantity;

        // Update the item in Firestore
        const updateData = {
          warehouse_id: transferData.to_warehouse_id,
          remaining_quantity: newQuantity,
          updated_at: serverTimestamp(),
          updated_by: state.user.uid
        };

        await updateDoc(itemRef, updateData);

        // Create transaction record
        const transactionData = {
          type: TRANSACTION_TYPES.TRANSFER,
          item_id: transferData.item_id,
          item_name: itemData.name,
          item_code: itemData.code,
          from_warehouse: transferData.from_warehouse_id,
          to_warehouse: transferData.to_warehouse_id,
          cartons_delta: transferData.cartons_count || 0,
          per_carton_updated: transferData.per_carton_count || itemData.per_carton_count || 12,
          single_delta: transferData.single_bottles_count || 0,
          total_delta: transferQuantity,
          new_remaining: newQuantity,
          user_id: state.user.uid,
          timestamp: serverTimestamp(),
          notes: transferData.notes || 'نقل بين المخازن',
          created_by: state.userProfile?.name || state.user?.email || 'نظام'
        };

        await addDoc(collection(db, 'transactions'), transactionData);

        // Update store with the modified item
        const updatedItem = InventoryService.convertForDisplay({
          id: transferData.item_id,
          ...itemData,
          ...updateData
        });

        commit('UPDATE_INVENTORY_ITEM', updatedItem);
        commit('ADD_RECENT_TRANSACTION', transactionData);

        dispatch('showNotification', {
          type: 'success',
          message: `تم نقل الصنف "${itemData.name}" بنجاح من المخزن`
        });

        return { success: true, item: updatedItem };

      } catch (error) {
        console.error('❌ Error transferring item:', error);
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

    // 🔥 Dispatch item (COMPLETE IMPLEMENTATION)
    async dispatchItem({ commit, state, dispatch }, dispatchData) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        // Check permissions
        if (!['superadmin', 'warehouse_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لصرف الأصناف');
        }

        // Validate required fields
        if (!dispatchData.item_id || !dispatchData.from_warehouse_id || !dispatchData.destination) {
          throw new Error('بيانات الصرف غير مكتملة');
        }

        // Check warehouse permissions for warehouse managers
        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
            if (!allowedWarehouses.includes(dispatchData.from_warehouse_id)) {
              throw new Error('ليس لديك صلاحية للصرف من هذا المخزن');
            }
          }
        }

        // Get the item from Firestore
        const itemRef = doc(db, 'items', dispatchData.item_id);
        const itemDoc = await getDoc(itemRef);

        if (!itemDoc.exists()) {
          throw new Error('الصنف غير موجود');
        }

        const itemData = itemDoc.data();

        // Verify item is in the source warehouse
        if (itemData.warehouse_id !== dispatchData.from_warehouse_id) {
          throw new Error('الصنف ليس في المخزن المصدر المحدد');
        }

        // Check if there's enough quantity to dispatch
        const availableQuantity = itemData.remaining_quantity || 0;
        const dispatchQuantity = (dispatchData.cartons_count || 0) * (dispatchData.per_carton_count || 0) + 
                               (dispatchData.single_bottles_count || 0);
        
        if (dispatchQuantity > availableQuantity) {
          throw new Error('الكمية المطلوبة للصرف أكبر من الكمية المتاحة');
        }

        // Calculate new quantity
        const newQuantity = availableQuantity - dispatchQuantity;

        // Update the item in Firestore
        const updateData = {
          remaining_quantity: newQuantity,
          updated_at: serverTimestamp(),
          updated_by: state.user.uid
        };

        await updateDoc(itemRef, updateData);

        // Create transaction record
        const transactionData = {
          type: TRANSACTION_TYPES.DISPATCH,
          item_id: dispatchData.item_id,
          item_name: itemData.name,
          item_code: itemData.code,
          from_warehouse: dispatchData.from_warehouse_id,
          destination: dispatchData.destination,
          cartons_delta: dispatchData.cartons_count || 0,
          per_carton_updated: dispatchData.per_carton_count || itemData.per_carton_count || 12,
          single_delta: dispatchData.single_bottles_count || 0,
          total_delta: dispatchQuantity,
          new_remaining: newQuantity,
          user_id: state.user.uid,
          timestamp: serverTimestamp(),
          notes: dispatchData.notes || 'صرف إلى عميل',
          created_by: state.userProfile?.name || state.user?.email || 'نظام'
        };

        await addDoc(collection(db, 'transactions'), transactionData);

        // Update store with the modified item
        const updatedItem = InventoryService.convertForDisplay({
          id: dispatchData.item_id,
          ...itemData,
          ...updateData
        });

        commit('UPDATE_INVENTORY_ITEM', updatedItem);
        commit('ADD_RECENT_TRANSACTION', transactionData);

        dispatch('showNotification', {
          type: 'success',
          message: `تم صرف الصنف "${itemData.name}" بنجاح`
        });

        return { success: true, item: updatedItem };

      } catch (error) {
        console.error('❌ Error dispatching item:', error);
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

    // 🔥 Load warehouses
    async loadWarehouses({ commit, dispatch }) {
      try {
        console.log('🔄 Loading warehouses...');

        const warehousesRef = collection(db, 'warehouses');
        const q = query(warehousesRef, orderBy('name_ar'));
        const snapshot = await getDocs(q);

        const warehouses = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        commit('SET_WAREHOUSES', warehouses);
        console.log(`✅ Warehouses loaded: ${warehouses.length}`);

        return warehouses;

      } catch (error) {
        console.error('❌ Error loading warehouses:', error);
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تحميل المخازن'
        });
        return [];
      }
    },

    // 🔥 Load transactions
    async fetchTransactions({ commit, dispatch }) {
      commit('SET_TRANSACTIONS_LOADING', true);
      
      try {
        if (!auth.currentUser) {
          return [];
        }

        const transactionsQuery = query(
          collection(db, 'transactions'),
          orderBy('timestamp', 'desc'),
          limit(100)
        );

        const snapshot = await getDocs(transactionsQuery);
        const transactions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        commit('SET_TRANSACTIONS', transactions);
        return transactions;

      } catch (error) {
        console.error('Error loading transactions:', error);
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تحميل الحركات'
        });
        return [];
      } finally {
        commit('SET_TRANSACTIONS_LOADING', false);
      }
    },

    // 🔥 Load recent transactions
    async getRecentTransactions({ commit, dispatch }) {
      try {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const transactionsQuery = query(
          collection(db, 'transactions'),
          where('timestamp', '>=', oneDayAgo),
          orderBy('timestamp', 'desc'),
          limit(30)
        );

        const snapshot = await getDocs(transactionsQuery);
        const transactions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        commit('SET_RECENT_TRANSACTIONS', transactions);
        return transactions;

      } catch (error) {
        console.error('Error loading recent transactions:', error);
        return [];
      }
    },

    // 🔥 Initialize authentication
    async initializeAuth({ commit, dispatch }) {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            commit('SET_USER', user);
            
            try {
              // Load user profile
              const userDoc = await getDoc(doc(db, 'users', user.uid));
              if (userDoc.exists()) {
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

                // Load warehouses
                await dispatch('loadWarehouses');

                // Load ALL inventory
                await dispatch('loadAllInventory');

                // Load transactions
                await dispatch('fetchTransactions');
                dispatch('getRecentTransactions');

                dispatch('showNotification', {
                  type: 'success',
                  message: `مرحباً ${userProfile.name}! تم تسجيل الدخول بنجاح.`
                });
              }
            } catch (error) {
              console.error('Error in auth initialization:', error);
              commit('SET_AUTH_ERROR', 'فشل في تحميل بيانات المستخدم');
            }
          } else {
            // User logged out
            commit('RESET_STATE');
            commit('SET_USER', null);
            commit('SET_USER_PROFILE', null);
          }
          resolve();
        });
      });
    },

    // 🔥 Login
    async login({ commit, dispatch }, { email, password }) {
      commit('SET_LOADING', true);
      commit('SET_AUTH_ERROR', null);

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // User profile will be loaded by the auth state change listener
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

    // 🔥 Logout
    async logout({ commit, dispatch }) {
      try {
        await signOut(auth);
        commit('RESET_STATE');
        commit('SET_AUTH_ERROR', null);
        commit('SET_OPERATION_ERROR', null);

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

    // 🔥 Show notification
    showNotification({ commit }, notification) {
      if (!notification?.message) return;

      const finalNotification = {
        type: 'info',
        duration: 3000,
        ...notification
      };

      commit('ADD_NOTIFICATION', finalNotification);
    },

    // 🔥 Remove notification
    removeNotification({ commit }, notificationId) {
      commit('REMOVE_NOTIFICATION', notificationId);
    },

    // 🔥 Clear notifications
    clearNotifications({ commit }) {
      commit('CLEAR_NOTIFICATIONS');
    },

    // 🔥 Additional actions from older version
    async searchItems({ state, dispatch }, { searchTerm, limitResults = 5 }) {
      try {
        console.log('🔍 General search:', searchTerm);
        if (!searchTerm || searchTerm.trim().length < 2) {
          return [];
        }
        const term = searchTerm.trim().toLowerCase();
        // First check local inventory for quick results
        const localResults = state.inventory.filter(item =>
          item.name?.toLowerCase().includes(term) ||
          item.code?.toLowerCase().includes(term) ||
          item.color?.toLowerCase().includes(term)
        ).slice(0, limitResults);
        if (localResults.length > 0) {
          console.log('✅ Items found in loaded inventory:', localResults.length);
          return localResults;
        }
        // If not found locally, search Firestore directly
        console.log('🔄 Item not in local cache, searching Firestore...');
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
        console.log('🔍 Getting multiple items (real-time):', itemIds.length);
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

    async refreshInventorySilently({ commit, state, dispatch }) {
      if (state.isRefreshingSilently) {
        return;
      }
      commit('SET_IS_REFRESHING_SILENTLY', true);
      try {
        console.log('🔄 Silently refreshing inventory cache...');
       
        const itemsRef = collection(db, 'items');
        const q = query(
          itemsRef,
          orderBy('name'),
          limit(PERFORMANCE_CONFIG.INITIAL_LOAD)
        );
       
        const snapshot = await getDocs(q);
        const inventory = snapshot.docs.map(doc => {
          const data = doc.data();
          return InventoryService.convertForDisplay({
            id: doc.id,
            ...data
          });
        });
       
        // Get last document for pagination
        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
       
        commit('SET_INVENTORY', inventory);
        commit('SET_PAGINATION', {
          lastDoc,
          hasMore: snapshot.size === PERFORMANCE_CONFIG.INITIAL_LOAD,
          totalLoaded: inventory.length
        });
       
        console.log('✅ Inventory cache silently refreshed');
       
      } catch (error) {
        console.log('Silent refresh failed:', error.message);
      } finally {
        commit('SET_IS_REFRESHING_SILENTLY', false);
      }
    },

    // 🔥 Get item history
    async getItemHistory({ commit, dispatch }, itemId) {
      try {
        if (!itemId) {
          throw new Error('معرف الصنف مطلوب');
        }
        const transactionsRef = collection(db, 'transactions');
        const q = query(
          transactionsRef,
          where('item_id', '==', itemId),
          orderBy('timestamp', 'desc'),
          limit(50)
        );
        const snapshot = await getDocs(q);
        const history = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        commit('SET_ITEM_HISTORY', history);
        console.log('✅ Item history loaded:', history.length);
        return history;
      } catch (error) {
        console.error('❌ Error loading item history:', error);
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تحميل تاريخ الصنف'
        });
        return [];
      }
    },

    // 🔥 User management actions
    async loadAllUsers({ commit, state, dispatch }) {
      try {
        if (state.userProfile?.role !== 'superadmin') {
          throw new Error('ليس لديك صلاحية لعرض المستخدمين');
        }
        commit('SET_USERS_LOADING', true);
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('created_at', 'desc'));
        const snapshot = await getDocs(q);
        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        commit('SET_ALL_USERS', users);
        console.log('✅ Users loaded:', users.length);
        return users;
      } catch (error) {
        console.error('❌ Error loading users:', error);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'خطأ في تحميل المستخدمين'
        });
        return [];
      } finally {
        commit('SET_USERS_LOADING', false);
      }
    },

    async createUser({ commit, state, dispatch }, userData) {
      try {
        if (state.userProfile?.role !== 'superadmin') {
          throw new Error('ليس لديك صلاحية لإنشاء مستخدمين');
        }
        commit('SET_OPERATION_LOADING', true);
        
        // Create user in Firebase Auth first
        const { createUserWithEmailAndPassword } = await import('firebase/auth');
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        
        // Create user profile in Firestore
        const userProfile = {
          name: userData.name,
          email: userData.email,
          role: userData.role || 'warehouse_manager',
          allowed_warehouses: userData.allowed_warehouses || [],
          permissions: userData.permissions || ['view_reports'],
          is_active: true,
          profile_complete: true,
          created_at: serverTimestamp(),
          created_by: state.userProfile?.name || state.user?.email
        };
        
        await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);
        
        dispatch('showNotification', {
          type: 'success',
          message: `تم إنشاء المستخدم "${userData.name}" بنجاح`
        });
        
        await dispatch('loadAllUsers');
        return { success: true, userId: userCredential.user.uid };
      } catch (error) {
        console.error('❌ Error creating user:', error);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'خطأ في إنشاء المستخدم'
        });
        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async updateUser({ commit, state, dispatch }, { userId, userData }) {
      try {
        if (state.userProfile?.role !== 'superadmin') {
          throw new Error('ليس لديك صلاحية لتعديل المستخدمين');
        }
        commit('SET_OPERATION_LOADING', true);
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          ...userData,
          updated_at: serverTimestamp(),
          updated_by: state.userProfile?.name || state.user?.email
        });
        dispatch('showNotification', {
          type: 'success',
          message: `تم تحديث بيانات المستخدم بنجاح`
        });
        await dispatch('loadAllUsers');
        return true;
      } catch (error) {
        console.error('❌ Error updating user:', error);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'خطأ في تحديث بيانات المستخدم'
        });
        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async deleteUser({ commit, state, dispatch }, userId) {
      try {
        if (state.userProfile?.role !== 'superadmin') {
          throw new Error('ليس لديك صلاحية لحذف المستخدمين');
        }
        commit('SET_OPERATION_LOADING', true);
        
        const confirmDelete = confirm('هل أنت متأكد من حذف هذا المستخدم؟');
        if (!confirmDelete) return;
        
        // Delete user from Firestore
        await deleteDoc(doc(db, 'users', userId));
        
        // Try to delete from Auth (admin only)
        try {
          await auth.currentUser?.delete();
        } catch (authError) {
          console.log('Cannot delete from Auth, only from Firestore:', authError.message);
        }
        
        dispatch('showNotification', {
          type: 'success',
          message: 'تم حذف المستخدم بنجاح'
        });
        
        await dispatch('loadAllUsers');
        return true;
      } catch (error) {
        console.error('❌ Error deleting user:', error);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'خطأ في حذف المستخدم'
        });
        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async updateUserStatus({ commit, state, dispatch }, { userId, isActive }) {
      try {
        if (state.userProfile?.role !== 'superadmin') {
          throw new Error('ليس لديك صلاحية لتغيير حالة المستخدم');
        }
        commit('SET_OPERATION_LOADING', true);
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          is_active: isActive,
          updated_at: serverTimestamp(),
          updated_by: state.userProfile?.name || state.user?.email
        });
        dispatch('showNotification', {
          type: 'success',
          message: `تم ${isActive ? 'تفعيل' : 'تعطيل'} المستخدم بنجاح`
        });
        await dispatch('loadAllUsers');
        return true;
      } catch (error) {
        console.error('❌ Error updating user status:', error);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'خطأ في تغيير حالة المستخدم'
        });
        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async getUserStats({ commit, state, dispatch }) {
      try {
        if (state.userProfile?.role !== 'superadmin') {
          throw new Error('ليس لديك صلاحية لعرض إحصائيات المستخدمين');
        }
        
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const itemsSnapshot = await getDocs(collection(db, 'items'));
        const transactionsSnapshot = await getDocs(collection(db, 'transactions'));
        
        const totalUsers = usersSnapshot.size;
        const activeUsers = usersSnapshot.docs.filter(doc => doc.data().is_active === true).length;
        const totalItems = itemsSnapshot.size;
        const totalTransactions = transactionsSnapshot.size;
        
        // Count transactions by type
        const transactionsByType = {};
        transactionsSnapshot.docs.forEach(doc => {
          const type = doc.data().type;
          transactionsByType[type] = (transactionsByType[type] || 0) + 1;
        });
        
        return {
          totalUsers,
          activeUsers,
          inactiveUsers: totalUsers - activeUsers,
          totalItems,
          totalTransactions,
          transactionsByType,
          averageTransactionsPerUser: totalUsers > 0 ? (totalTransactions / totalUsers).toFixed(2) : 0
        };
      } catch (error) {
        console.error('❌ Error getting user stats:', error);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'خطأ في تحميل إحصائيات المستخدمين'
        });
        return null;
      }
    },

    // 🔥 Warehouse management actions
    async addWarehouse({ commit, state, dispatch }, warehouseData) {
      try {
        if (state.userProfile?.role !== 'superadmin') {
          throw new Error('ليس لديك صلاحية لإضافة مخازن');
        }
        commit('SET_OPERATION_LOADING', true);
        
        const warehouseToAdd = {
          ...warehouseData,
          is_active: true,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
          created_by: state.userProfile?.name || state.user?.email
        };
        
        const docRef = await addDoc(collection(db, 'warehouses'), warehouseToAdd);
        
        const newWarehouse = {
          id: docRef.id,
          ...warehouseToAdd
        };
        
        commit('SET_WAREHOUSES', [...state.warehouses, newWarehouse]);
        
        dispatch('showNotification', {
          type: 'success',
          message: `تم إضافة المخزن "${warehouseData.name_ar}" بنجاح`
        });
        
        return newWarehouse;
      } catch (error) {
        console.error('❌ Error adding warehouse:', error);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'خطأ في إضافة المخزن'
        });
        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async updateWarehouse({ commit, state, dispatch }, { warehouseId, warehouseData }) {
      try {
        if (state.userProfile?.role !== 'superadmin') {
          throw new Error('ليس لديك صلاحية لتعديل المخازن');
        }
        commit('SET_OPERATION_LOADING', true);
        
        const warehouseRef = doc(db, 'warehouses', warehouseId);
        await updateDoc(warehouseRef, {
          ...warehouseData,
          updated_at: serverTimestamp(),
          updated_by: state.userProfile?.name || state.user?.email
        });
        
        // Update in local state
        const updatedWarehouses = state.warehouses.map(w => 
          w.id === warehouseId ? { ...w, ...warehouseData } : w
        );
        commit('SET_WAREHOUSES', updatedWarehouses);
        
        dispatch('showNotification', {
          type: 'success',
          message: `تم تحديث المخزن بنجاح`
        });
        
        return true;
      } catch (error) {
        console.error('❌ Error updating warehouse:', error);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'خطأ في تحديث المخزن'
        });
        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async deleteWarehouse({ commit, state, dispatch }, { warehouseId, warehouseName }) {
      try {
        if (state.userProfile?.role !== 'superadmin') {
          throw new Error('ليس لديك صلاحية لحذف المخازن');
        }
        commit('SET_OPERATION_LOADING', true);
        
        const confirmDelete = confirm(`هل أنت متأكد من حذف المخزن "${warehouseName}"؟`);
        if (!confirmDelete) return;
        
        // Check if there are items in this warehouse
        const itemsRef = collection(db, 'items');
        const q = query(itemsRef, where('warehouse_id', '==', warehouseId), limit(1));
        const itemsSnapshot = await getDocs(q);
        
        if (!itemsSnapshot.empty) {
          throw new Error('لا يمكن حذف المخزن لأنه يحتوي على أصناف. يجب نقل الأصناف أولاً.');
        }
        
        const warehouseRef = doc(db, 'warehouses', warehouseId);
        await deleteDoc(warehouseRef);
        
        // Update in local state
        const updatedWarehouses = state.warehouses.filter(w => w.id !== warehouseId);
        commit('SET_WAREHOUSES', updatedWarehouses);
        
        dispatch('showNotification', {
          type: 'success',
          message: `تم حذف المخزن "${warehouseName}" بنجاح`
        });
        
        return true;
      } catch (error) {
        console.error('❌ Error deleting warehouse:', error);
        commit('SET_OPERATION_ERROR', error.message);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'خطأ في حذف المخزن'
        });
        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    // 🔥 Additional utility actions
    async notifyAdminAboutPendingUser({ state }, { userId, userEmail }) {
      try {
        const adminsRef = collection(db, 'users');
        const q = query(adminsRef, where('role', '==', 'superadmin'));
        const snapshot = await getDocs(q);
        
        const notifications = snapshot.docs.map(doc => ({
          to: doc.id,
          type: 'pending_user',
          title: 'مستخدم جديد يحتاج الموافقة',
          message: `المستخدم ${userEmail} يحتاج الموافقة على حسابه`,
          data: { userId, userEmail },
          created_at: serverTimestamp(),
          read: false,
          created_by: 'system'
        }));
        
        const batch = writeBatch(db);
        notifications.forEach(notification => {
          const notificationRef = doc(collection(db, 'notifications'));
          batch.set(notificationRef, notification);
        });
        
        await batch.commit();
        console.log('✅ Admin notified about pending user');
      } catch (error) {
        console.error('❌ Error notifying admin:', error);
      }
    },

    async logError({ }, errorData) {
      try {
        await addDoc(collection(db, 'error_logs'), {
          ...errorData,
          timestamp: serverTimestamp(),
          user_agent: navigator.userAgent,
          url: window.location.href
        });
      } catch (error) {
        console.error('Failed to log error:', error);
      }
    },

    // 🔥 Alias actions for compatibility
    async fetchInventory({ dispatch }) {
      console.log('📦 Fetching inventory...');
      return await dispatch('loadAllInventory');
    },

    async fetchInventoryOnce({ dispatch }) {
      console.log('📦 Using loadAllInventory');
      return await dispatch('loadAllInventory');
    }
  },

  getters: {
    // ====== AUTHENTICATION ======
    isAuthenticated: state => !!state.user,
    userRole: state => state.userProfile?.role || '',
    userName: state => state.userProfile?.name || '',
    userProfile: state => state.userProfile,
    allowedWarehouses: state => Array.isArray(state.userProfile?.allowed_warehouses) ? 
      state.userProfile.allowed_warehouses : [],
    userPermissions: state => Array.isArray(state.userProfile?.permissions) ? 
      state.userProfile.permissions : [],

    // ====== ERRORS ======
    authError: state => state.authError,
    operationError: state => state.operationError,
    operationLoading: state => state.operationLoading,
    inventoryError: state => state.inventoryError,

    // ====== FIELD MAPPINGS ======
    fieldMappings: state => state.fieldMappings || FIELD_MAPPINGS,
    getArabicLabel: (state) => (fieldName) => {
      const mappings = state.fieldMappings || FIELD_MAPPINGS;
      return mappings.englishToArabic[fieldName] || fieldName;
    },

    // ====== INVENTORY ======
    allInventory: state => state.inventory,
    inventoryItems: state => Array.isArray(state.inventory) ? state.inventory : [],
    inventoryCount: state => state.inventory.length,
    isLoading: state => state.inventoryLoading,
    isLoaded: state => state.inventoryLoaded,
    inventoryLoading: state => state.inventoryLoading,
    hasMore: state => state.pagination.hasMore,
    inventoryHasMore: state => state.pagination.hasMore,
    isFetchingMore: state => state.pagination.isFetching,
    totalLoaded: state => state.pagination.totalLoaded,

    // ====== WAREHOUSES ======
    warehouses: state => state.warehouses,
    warehousesLoaded: state => state.warehousesLoaded,
    primaryWarehouses: state => state.warehouses.filter(w => w.type === 'primary'),
    dispatchWarehouses: state => state.warehouses.filter(w => w.type === 'dispatch'),
    mainWarehouse: state => state.warehouses.find(w => w.is_main) || null,

    // ====== TRANSACTIONS ======
    transactions: state => state.transactions,
    transactionsItems: state => Array.isArray(state.transactions) ? state.transactions : [],
    recentTransactions: state => state.recentTransactions,
    transactionsLoading: state => state.transactionsLoading,
    recentTransactionsLoading: state => state.recentTransactionsLoading,

    // ====== NOTIFICATIONS ======
    notifications: state => state.notifications,

    // ====== USERS ======
    requiresCompositeIndex: state => state.requiresCompositeIndex,
    allUsers: state => state.allUsers,
    usersLoading: state => state.usersLoading,

    // ====== PERMISSIONS ======
    canEdit: (state, getters) => {
      return ['superadmin', 'warehouse_manager'].includes(getters.userRole);
    },
    canDelete: (state, getters) => {
      if (getters.userRole === 'superadmin') return true;
      if (getters.userRole === 'warehouse_manager') {
        const permissions = getters.userPermissions;
        return permissions.includes('full_access') || permissions.includes('delete_items');
      }
      return false;
    },
    canManageUsers: state => state.userProfile?.role === 'superadmin',
    canManageWarehouses: state => state.userProfile?.role === 'superadmin',
    canDispatch: (state, getters) => {
      if (getters.userRole === 'superadmin') return true;
      if (getters.userRole === 'warehouse_manager') {
        const permissions = getters.userPermissions;
        return permissions.includes('full_access') || permissions.includes('dispatch_items');
      }
      return false;
    },
    canTransfer: (state, getters) => {
      if (!state.user) return false;
      const role = getters.userRole;
      if (role === 'superadmin') return true;
      if (role === 'warehouse_manager') {
        const permissions = getters.userPermissions;
        return permissions.includes('full_access') || permissions.includes('transfer_items');
      }
      return false;
    },
    canViewTransfers: () => true,
    canViewDispatch: () => true,
    canViewItems: () => true,
    canViewTransactions: () => true,
    canViewReports: (state, getters) => {
      if (!state.user) return false;
      const role = getters.userRole;
      return ['superadmin', 'company_manager'].includes(role);
    },

    // ====== WAREHOUSE ACCESS ======
    accessibleWarehouses: (state, getters) => {
      if (!state.warehousesLoaded) return [];

      const role = getters.userRole;
      if (role === 'superadmin' || role === 'company_manager') {
        return state.warehouses;
      }

      if (role === 'warehouse_manager') {
        const allowedWarehouses = getters.allowedWarehouses;
        if (allowedWarehouses.length === 0) return [];
        
        if (allowedWarehouses.includes('all')) {
          return state.warehouses;
        }
        
        return state.warehouses.filter(w => allowedWarehouses.includes(w.id));
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
      // For public users, show all primary warehouses
      if (!state.user) {
        return warehouses.filter(w => w.type === 'primary');
      }
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
      // For other users, return empty
      return [];
    },

    // ====== FILTERED INVENTORY ======
    filteredInventory: (state, getters) => {
      let inventory = state.inventory;

      // Apply warehouse filter
      if (state.filters.warehouse) {
        inventory = inventory.filter(item => item.warehouse_id === state.filters.warehouse);
      }

      // Apply search filter (client-side for quick updates)
      if (state.filters.search && state.filters.search.length >= 2) {
        const searchLower = state.filters.search.toLowerCase();
        const searchField = state.filters.searchField;
        
        inventory = inventory.filter(item => {
          if (searchField === 'name') {
            return item.name?.toLowerCase().includes(searchLower);
          } else if (searchField === 'code') {
            return item.code?.toLowerCase().includes(searchLower);
          } else if (searchField === 'color') {
            return item.color?.toLowerCase().includes(searchLower);
          } else if (searchField === 'supplier') {
            return item.supplier?.toLowerCase().includes(searchLower);
          }
          // Default: search all fields
          return item.name?.toLowerCase().includes(searchLower) ||
                 item.code?.toLowerCase().includes(searchLower) ||
                 item.color?.toLowerCase().includes(searchLower) ||
                 item.supplier?.toLowerCase().includes(searchLower);
        });
      }

      return inventory;
    },

    // ====== DASHBOARD STATS ======
    dashboardStats: (state, getters) => {
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
      
      return {
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
    },

    // ====== WAREHOUSE LABELS ======
    getWarehouseLabel: (state) => (warehouseId) => {
      if (!warehouseId) return '';
      return state.cache.warehouseLabels[warehouseId] || warehouseId;
    },

    getDestinationLabel: () => (destinationId) => {
      return DESTINATION_LABELS[destinationId] || destinationId;
    },

    getWarehouseById: (state) => (warehouseId) => {
      const warehouses = Array.isArray(state.warehouses) ? state.warehouses : [];
      return warehouses.find(w => w.id === warehouseId) || null;
    },

    getUserNameById: (state) => (userId) => {
      const allUsers = Array.isArray(state.allUsers) ? state.allUsers : [];
      const user = allUsers.find(u => u.id === userId);
      return user ? user.name : userId;
    },

    // ====== USER DISPLAY NAME ======
    getUserDisplayName: (state, getters) => (userId) => {
      if (!userId) return 'نظام';
      if (userId === state.user?.uid) {
        return state.userProfile?.name || state.user?.email || 'نظام';
      }
      return getters.getUserNameById(userId) || userId;
    },

    // ====== TRANSACTION STATISTICS ======
    getTransactionStats: (state) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Handle empty transactions array
      if (!state.transactions || state.transactions.length === 0) {
        return {
          total: 0,
          today: 0,
          add: 0,
          transfer: 0,
          dispatch: 0,
          update: 0,
          delete: 0,
          lastUpdated: null
        };
      }
      
      const todayTransactions = state.transactions.filter(t => {
        if (!t.timestamp) return false;
        
        try {
          const transDate = t.timestamp?.toDate ? t.timestamp.toDate() : new Date(t.timestamp);
          return transDate >= today;
        } catch {
          return false;
        }
      });
      
      const addCount = todayTransactions.filter(t => t.type === 'ADD').length;
      const transferCount = todayTransactions.filter(t => t.type === 'TRANSFER').length;
      const dispatchCount = todayTransactions.filter(t => t.type === 'DISPATCH').length;
      const updateCount = todayTransactions.filter(t => t.type === 'UPDATE').length;
      const deleteCount = todayTransactions.filter(t => t.type === 'DELETE').length;
      
      return {
        total: state.transactions.length,
        today: todayTransactions.length,
        add: addCount,
        transfer: transferCount,
        dispatch: dispatchCount,
        update: updateCount,
        delete: deleteCount,
        lastUpdated: state.transactions.length > 0 ? 
          (state.transactions[0].timestamp?.toDate ? 
           state.transactions[0].timestamp.toDate() : 
           new Date(state.transactions[0].timestamp)) : 
          null
      };
    },

    // ====== TRANSACTION TYPE LABEL ======
    getTransactionTypeLabel: () => (type) => {
      const labels = {
        'ADD': 'Addition',
        'TRANSFER': 'Transfer',
        'DISPATCH': 'Dispatch',
        'UPDATE': 'Update',
        'DELETE': 'Delete'
      };
      return labels[type] || type;
    },

    // ====== FILTERED TRANSACTIONS ======
    filteredTransactions: (state) => (filters = {}) => {
      let filtered = [...state.transactions];
      
      // Apply search filter
      if (filters.search) {
        const term = filters.search.toLowerCase();
        filtered = filtered.filter(transaction => 
          (transaction.item_name?.toLowerCase() || '').includes(term) ||
          (transaction.item_code?.toLowerCase() || '').includes(term) ||
          (transaction.notes?.toLowerCase() || '').includes(term) ||
          (transaction.user_name?.toLowerCase() || '').includes(term)
        );
      }
      
      // Apply type filter
      if (filters.type) {
        filtered = filtered.filter(transaction => transaction.type === filters.type);
      }
      
      // Apply date range filter
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        filtered = filtered.filter(transaction => {
          if (!transaction.timestamp) return false;
          try {
            const transDate = transaction.timestamp?.toDate ? 
              transaction.timestamp.toDate() : new Date(transaction.timestamp);
            return transDate >= fromDate;
          } catch {
            return false;
          }
        });
      }
      
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(transaction => {
          if (!transaction.timestamp) return false;
          try {
            const transDate = transaction.timestamp?.toDate ? 
              transaction.timestamp.toDate() : new Date(transaction.timestamp);
            return transDate <= toDate;
          } catch {
            return false;
          }
        });
      }
      
      return filtered;
    },

    // ====== GET TRANSACTION BY ID ======
    getTransactionById: (state) => (id) => {
      return state.transactions.find(t => t.id === id);
    },

    // ====== TODAY'S TRANSACTIONS ======
    getTodayTransactions: (state) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return state.transactions.filter(t => {
        if (!t.timestamp) return false;
        try {
          const transDate = t.timestamp?.toDate ? t.timestamp.toDate() : new Date(t.timestamp);
          return transDate >= today;
        } catch {
          return false;
        }
      });
    },

    // ====== TRANSACTIONS BY WAREHOUSE ======
    getTransactionsByWarehouse: (state) => (warehouseId) => {
      return state.transactions.filter(t => 
        t.from_warehouse === warehouseId || t.to_warehouse === warehouseId
      );
    },

    // ====== TRANSACTIONS BY ITEM ======
    getTransactionsByItem: (state) => (itemId) => {
      return state.transactions.filter(t => t.item_id === itemId);
    },

    // ====== TRANSACTION COUNTS BY TYPE ======
    getTransactionCountsByType: (state) => {
      const counts = {
        ADD: 0,
        TRANSFER: 0,
        DISPATCH: 0,
        UPDATE: 0,
        DELETE: 0
      };
      
      state.transactions.forEach(t => {
        if (t.type && counts[t.type] !== undefined) {
          counts[t.type]++;
        }
      });
      
      return counts;
    },

    // ====== CACHED ITEM ======
    getCachedItem: (state) => (itemId) => {
      const cached = state.cache.itemDetails[itemId];
      if (cached && (Date.now() - cached.timestamp) < PERFORMANCE_CONFIG.CACHE_DURATION) {
        return cached.data;
      }
      return null;
    },

    // ====== GET ALL WAREHOUSES FORMATTED ======
    getAllWarehouses: (state) => {
      return state.warehouses.map(w => ({
        id: w.id,
        name: w.name_ar || w.name,
        location: w.location || '',
        code: w.code || '',
        type: w.type || 'primary'
      }));
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
