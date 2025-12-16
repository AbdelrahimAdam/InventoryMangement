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
  onSnapshot
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
    }
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
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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
          timestamp: new Date(),
          notes: cleanData.notes || 'عملية إضافة جديدة'
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
          updated_at: new Date().toISOString(),
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
            timestamp: new Date(),
            notes: `تعديل الصنف: ${updateData.notes || ''}`.trim()
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
          timestamp: new Date(),
          notes: 'حذف الصنف نهائياً'
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

    // 🔥 Transfer item
    async transferItem({ commit, state, dispatch }, transferData) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        // ... existing transfer logic ...
        // (Keep your existing transferItem implementation)
        
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

    // 🔥 Dispatch item
    async dispatchItem({ commit, state, dispatch }, dispatchData) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        // ... existing dispatch logic ...
        // (Keep your existing dispatchItem implementation)
        
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

    // 🔥 Initialize default warehouses (if needed)
    async initializeDefaultWarehouses({ commit, dispatch }) {
      try {
        // ... your existing initializeDefaultWarehouses logic ...
        // (Keep your existing implementation)
        
      } catch (error) {
        console.error('Error initializing default warehouses:', error);
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تهيئة المخازن الافتراضية'
        });
        throw error;
      }
    },

    // 🔥 User management actions (keep existing)
    async loadAllUsers({ commit, dispatch, getters }) {
      // ... existing loadAllUsers logic ...
    },

    async createUser({ commit, dispatch, getters, state }, userData) {
      // ... existing createUser logic ...
    },

    async updateUser({ commit, dispatch, getters }, { userId, userData }) {
      // ... existing updateUser logic ...
    },

    async deleteUser({ commit, dispatch, getters }, userId) {
      // ... existing deleteUser logic ...
    },

    async updateUserStatus({ commit, dispatch, getters }, { userId, isActive }) {
      // ... existing updateUserStatus logic ...
    },

    async getUserStats({ commit, dispatch, getters }) {
      // ... existing getUserStats logic ...
    }
  },

  getters: {
    // Authentication
    isAuthenticated: state => !!state.user,
    userRole: state => state.userProfile?.role || '',
    userName: state => state.userProfile?.name || '',
    userProfile: state => state.userProfile,
    allowedWarehouses: state => Array.isArray(state.userProfile?.allowed_warehouses) ? 
      state.userProfile.allowed_warehouses : [],
    userPermissions: state => Array.isArray(state.userProfile?.permissions) ? 
      state.userProfile.permissions : [],

    // Inventory
    allInventory: state => state.inventory,
    inventoryCount: state => state.inventory.length,
    isLoading: state => state.inventoryLoading,
    isLoaded: state => state.inventoryLoaded,
    hasMore: state => state.pagination.hasMore,
    isFetchingMore: state => state.pagination.isFetching,
    totalLoaded: state => state.pagination.totalLoaded,

    // Filtered inventory (client-side filtering for display)
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

    // Warehouses
    warehouses: state => state.warehouses,
    warehousesLoaded: state => state.warehousesLoaded,
    primaryWarehouses: state => state.warehouses.filter(w => w.type === 'primary'),
    dispatchWarehouses: state => state.warehouses.filter(w => w.type === 'dispatch'),
    mainWarehouse: state => state.warehouses.find(w => w.is_main) || null,

    // Transactions
    transactions: state => state.transactions,
    recentTransactions: state => state.recentTransactions,
    transactionsLoading: state => state.transactionsLoading,

    // Notifications
    notifications: state => state.notifications,

    // Errors
    authError: state => state.authError,
    operationError: state => state.operationError,
    operationLoading: state => state.operationLoading,
    inventoryError: state => state.inventoryError,

    // Permissions
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
        return permissions.includes('dispatch_items');
      }
      return false;
    },

    // Warehouse access
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

    // Dashboard stats
    dashboardStats: (state, getters) => {
      const inventory = getters.filteredInventory;
      
      return {
        totalItems: inventory.length,
        totalQuantity: inventory.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0),
        lowStockItems: inventory.filter(item => (item.remaining_quantity || 0) < 10).length,
        outOfStockItems: inventory.filter(item => (item.remaining_quantity || 0) === 0).length,
        recentTransactions: state.recentTransactions.length
      };
    },

    // Get warehouse name by ID
    getWarehouseName: (state) => (warehouseId) => {
      if (!warehouseId) return '';
      return state.cache.warehouseLabels[warehouseId] || warehouseId;
    },

    // Get item from cache
    getCachedItem: (state) => (itemId) => {
      const cached = state.cache.itemDetails[itemId];
      if (cached && (Date.now() - cached.timestamp) < PERFORMANCE_CONFIG.CACHE_DURATION) {
        return cached.data;
      }
      return null;
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
