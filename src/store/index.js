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

// Performance constants - SIMPLIFIED FOR REAL-TIME ONLY
const PERFORMANCE_CONFIG = {
  INVENTORY_PAGE_SIZE: 100,
  RECENT_TRANSACTIONS_LIMIT: 20,
  NOTIFICATION_LIMIT: 100,
  DEBOUNCE_DELAY: 300
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
    warehouses: [],
    warehousesLoaded: false,
    inventory: [],
    inventoryLastFetched: null,
    transactions: [],
    recentTransactions: [],
    recentTransactionsLoading: false,
    itemHistory: [],
    filters: {
      warehouse: '',
      search: '',
      lastUpdate: 0
    },
    authError: null,
    operationLoading: false,
    operationError: null,
    fieldMappings: FIELD_MAPPINGS,
    notifications: [],
    requiresCompositeIndex: false,
    allUsers: [],
    usersLoading: false,
    inventoryLoading: false,
    transactionsLoading: false,
    isFetchingInventory: false
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
    },
    SET_WAREHOUSES_LOADED(state, loaded) {
      state.warehousesLoaded = loaded;
    },
    SET_INVENTORY(state, inventory) {
      state.inventory = Array.isArray(inventory) ? inventory.slice(0, 100) : [];
      state.inventoryLastFetched = Date.now();
    },
    APPEND_TO_INVENTORY(state, newItems) {
      if (Array.isArray(newItems)) {
        const existingIds = new Set(state.inventory.map(item => item.id));
        const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));
        const allItems = [...state.inventory, ...uniqueNewItems];
        state.inventory = allItems.slice(-100);
        state.inventoryLastFetched = Date.now();
      }
    },
    SET_INVENTORY_LAST_FETCHED(state, timestamp) {
      state.inventoryLastFetched = timestamp;
    },
    ADD_ITEM(state, item) {
      if (item && typeof item === 'object') {
        state.inventory.unshift(item);
        if (state.inventory.length > 100) {
          state.inventory = state.inventory.slice(0, 100);
        }
      }
    },
    UPDATE_ITEM(state, updatedItem) {
      if (!updatedItem || !updatedItem.id) return;
      const index = state.inventory.findIndex(item => item.id === updatedItem.id);
      if (index !== -1) {
        state.inventory.splice(index, 1, updatedItem);
      } else {
        state.inventory.unshift(updatedItem);
        if (state.inventory.length > 100) {
          state.inventory = state.inventory.slice(0, 100);
        }
      }
    },
    REMOVE_ITEM(state, itemId) {
      state.inventory = state.inventory.filter(item => item.id !== itemId);
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
    },
    REMOVE_WAREHOUSE(state, warehouseId) {
      state.warehouses = state.warehouses.filter(w => w.id !== warehouseId);
    },
    SET_AUTH_ERROR(state, error) {
      state.authError = error;
    },
    CLEAR_OPERATION_ERROR(state) {
      state.operationError = null;
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
    }
  },

  actions: {
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
                // Check warehouse permissions
                if (state.userProfile.role === 'superadmin' || 
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
              
              // Check warehouse permissions
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

    async getItemsFromWarehouse({ state, dispatch }, { warehouseId, limitResults = 20 }) {
      try {
        console.log('🔄 Getting items from warehouse (real-time):', warehouseId);

        if (!warehouseId) {
          throw new Error('معرف المخزن مطلوب');
        }

        if (state.userProfile.role === 'warehouse_manager') {
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
          
          // Sort locally
          items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
          
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

    async fetchRecentInventory({ commit, state, dispatch }) {
      if (state.isFetchingInventory) {
        console.log('Inventory fetch already in progress, skipping...');
        return state.inventory;
      }

      const now = Date.now();
      const cacheDuration = 10 * 60 * 1000;
      
      if (state.inventoryLastFetched && 
          (now - state.inventoryLastFetched) < cacheDuration && 
          state.inventory.length > 0) {
        console.log('Using recently loaded inventory');
        return state.inventory;
      }

      commit('SET_IS_FETCHING_INVENTORY', true);
      commit('SET_INVENTORY_LOADING', true);
      
      try {
        if (!state.userProfile) {
          console.log('Cannot load inventory: User not authenticated');
          commit('SET_INVENTORY', []);
          return [];
        }

        let itemsQuery;
        const itemsRef = collection(db, 'items');

        if (state.userProfile.role === 'superadmin' || state.userProfile.role === 'company_manager') {
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
          return InventoryService.convertForDisplay({
            id: doc.id,
            ...data
          });
        });

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

        commit('SET_INVENTORY', inventory);
        
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

    async refreshInventory({ commit, dispatch }) {
      console.log('🔄 Refreshing inventory...');
      commit('SET_INVENTORY_LAST_FETCHED', null);
      return await dispatch('fetchRecentInventory');
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

    async showNotification({ commit, dispatch }, notification) {
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
        dispatch('logError', {
          type: 'notification_error',
          message: finalNotification.message,
          data: notification
        });
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
              dispatch('showNotification', {
                type: 'error',
                message: 'فشل في تحميل بيانات المستخدم'
              });
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
            created_at: new Date(),
            created_by: 'system'
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

        await dispatch('loadWarehouses');
        await dispatch('fetchRecentInventory');
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
        commit('SET_INVENTORY_LAST_FETCHED', null);

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

    async loadWarehouses({ commit, dispatch }) {
      try {
        console.log('🔄 Loading warehouses...');

        const warehousesRef = collection(db, 'warehouses');
        const q = query(warehousesRef);
        const snapshot = await getDocs(q);

        const warehouses = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        commit('SET_WAREHOUSES', warehouses);
        commit('SET_WAREHOUSES_LOADED', true);

        console.log('✅ Warehouses loaded:', warehouses.length);
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

    async fetchTransactions({ commit, state, dispatch }) {
      try {
        commit('SET_TRANSACTIONS_LOADING', true);

        const transactionsRef = collection(db, 'transactions');
        let q;

        if (state.userProfile.role === 'superadmin') {
          q = query(
            transactionsRef,
            orderBy('created_at', 'desc'),
            limit(100)
          );
        } else if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (allowedWarehouses.length === 0) {
            commit('SET_TRANSACTIONS', []);
            return [];
          }

          q = query(
            transactionsRef,
            where('warehouse_id', 'in', allowedWarehouses),
            orderBy('created_at', 'desc'),
            limit(100)
          );
        } else {
          commit('SET_TRANSACTIONS', []);
          return [];
        }

        const snapshot = await getDocs(q);
        const transactions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        commit('SET_TRANSACTIONS', transactions);
        console.log('✅ Transactions loaded:', transactions.length);
        return transactions;

      } catch (error) {
        console.error('❌ Error loading transactions:', error);
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

    async getRecentTransactions({ commit, state, dispatch }) {
      try {
        commit('SET_RECENT_TRANSACTIONS_LOADING', true);

        const transactionsRef = collection(db, 'transactions');
        let q;

        if (state.userProfile.role === 'superadmin') {
          q = query(
            transactionsRef,
            orderBy('created_at', 'desc'),
            limit(PERFORMANCE_CONFIG.RECENT_TRANSACTIONS_LIMIT)
          );
        } else if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (allowedWarehouses.length === 0) {
            commit('SET_RECENT_TRANSACTIONS', []);
            return [];
          }

          q = query(
            transactionsRef,
            where('warehouse_id', 'in', allowedWarehouses),
            orderBy('created_at', 'desc'),
            limit(PERFORMANCE_CONFIG.RECENT_TRANSACTIONS_LIMIT)
          );
        } else {
          commit('SET_RECENT_TRANSACTIONS', []);
          return [];
        }

        const snapshot = await getDocs(q);
        const transactions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        commit('SET_RECENT_TRANSACTIONS', transactions);
        console.log('✅ Recent transactions loaded:', transactions.length);
        return transactions;

      } catch (error) {
        console.error('❌ Error loading recent transactions:', error);
        return [];
      } finally {
        commit('SET_RECENT_TRANSACTIONS_LOADING', false);
      }
    },

    async addItem({ commit, state, dispatch }, itemData) {
      try {
        commit('SET_OPERATION_LOADING', true);
        commit('CLEAR_OPERATION_ERROR');

        if (!itemData.name || !itemData.warehouse_id) {
          throw new Error('الاسم والمخزن مطلوبان');
        }

        const itemToAdd = {
          ...itemData,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
          total_added: itemData.cartons_count * itemData.per_carton_count + itemData.single_bottles_count,
          remaining_quantity: itemData.cartons_count * itemData.per_carton_count + itemData.single_bottles_count,
          created_by: state.userProfile?.name || state.user?.email,
          updated_by: state.userProfile?.name || state.user?.email
        };

        const docRef = await addDoc(collection(db, 'items'), itemToAdd);

        const newItem = {
          id: docRef.id,
          ...itemToAdd,
          created_at: new Date(),
          updated_at: new Date()
        };

        const convertedItem = InventoryService.convertForDisplay(newItem);
        commit('ADD_ITEM', convertedItem);

        await dispatch('addTransaction', {
          type: TRANSACTION_TYPES.ADD,
          item_id: docRef.id,
          item_name: itemData.name,
          item_code: itemData.code,
          warehouse_id: itemData.warehouse_id,
          cartons_count: itemData.cartons_count,
          per_carton_count: itemData.per_carton_count,
          single_bottles_count: itemData.single_bottles_count,
          total_quantity: itemToAdd.total_added,
          remaining_quantity: itemToAdd.remaining_quantity,
          notes: itemData.notes || 'إضافة جديدة',
          created_by: state.userProfile?.name || state.user?.email
        });

        dispatch('showNotification', {
          type: 'success',
          message: `تم إضافة الصنف "${itemData.name}" بنجاح`
        });

        return convertedItem;

      } catch (error) {
        console.error('❌ Error adding item:', error);
        commit('SET_OPERATION_ERROR', error.message);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'خطأ في إضافة الصنف'
        });
        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async updateItem({ commit, state, dispatch }, { itemId, itemData }) {
      try {
        commit('SET_OPERATION_LOADING', true);
        commit('CLEAR_OPERATION_ERROR');

        if (!itemId) {
          throw new Error('معرف الصنف مطلوب');
        }

        const itemRef = doc(db, 'items', itemId);
        const itemDoc = await getDoc(itemRef);

        if (!itemDoc.exists()) {
          throw new Error('الصنف غير موجود');
        }

        const oldData = itemDoc.data();
        
        const updateData = {
          ...itemData,
          updated_at: serverTimestamp(),
          updated_by: state.userProfile?.name || state.user?.email
        };

        if (itemData.cartons_count !== undefined && itemData.per_carton_count !== undefined && itemData.single_bottles_count !== undefined) {
          updateData.total_added = itemData.cartons_count * itemData.per_carton_count + itemData.single_bottles_count;
          updateData.remaining_quantity = updateData.total_added;
        }

        await updateDoc(itemRef, updateData);

        const updatedItem = {
          id: itemId,
          ...oldData,
          ...updateData,
          updated_at: new Date()
        };

        const convertedItem = InventoryService.convertForDisplay(updatedItem);
        commit('UPDATE_ITEM', convertedItem);

        await dispatch('addTransaction', {
          type: TRANSACTION_TYPES.UPDATE,
          item_id: itemId,
          item_name: itemData.name || oldData.name,
          item_code: itemData.code || oldData.code,
          warehouse_id: itemData.warehouse_id || oldData.warehouse_id,
          cartons_count: itemData.cartons_count || oldData.cartons_count,
          per_carton_count: itemData.per_carton_count || oldData.per_carton_count,
          single_bottles_count: itemData.single_bottles_count || oldData.single_bottles_count,
          total_quantity: updatedItem.total_added || oldData.total_added,
          remaining_quantity: updatedItem.remaining_quantity || oldData.remaining_quantity,
          notes: itemData.notes || 'تحديث بيانات',
          created_by: state.userProfile?.name || state.user?.email
        });

        dispatch('showNotification', {
          type: 'success',
          message: `تم تحديث الصنف "${itemData.name || oldData.name}" بنجاح`
        });

        return convertedItem;

      } catch (error) {
        console.error('❌ Error updating item:', error);
        commit('SET_OPERATION_ERROR', error.message);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'خطأ في تحديث الصنف'
        });
        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async deleteItem({ commit, state, dispatch }, { itemId, itemName }) {
      try {
        commit('SET_OPERATION_LOADING', true);
        commit('CLEAR_OPERATION_ERROR');

        if (!itemId) {
          throw new Error('معرف الصنف مطلوب');
        }

        const confirmDelete = confirm(`هل أنت متأكد من حذف الصنف "${itemName}"؟`);
        if (!confirmDelete) return;

        const itemRef = doc(db, 'items', itemId);
        await deleteDoc(itemRef);

        commit('REMOVE_ITEM', itemId);

        await dispatch('addTransaction', {
          type: TRANSACTION_TYPES.DELETE,
          item_id: itemId,
          item_name: itemName,
          notes: 'حذف الصنف',
          created_by: state.userProfile?.name || state.user?.email
        });

        dispatch('showNotification', {
          type: 'success',
          message: `تم حذف الصنف "${itemName}" بنجاح`
        });

        return true;

      } catch (error) {
        console.error('❌ Error deleting item:', error);
        commit('SET_OPERATION_ERROR', error.message);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'خطأ في حذف الصنف'
        });
        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async addTransaction({ commit, state }, transactionData) {
      try {
        const transactionToAdd = {
          ...transactionData,
          created_at: serverTimestamp(),
          created_by: state.userProfile?.name || state.user?.email,
          user_id: state.user?.uid
        };

        const docRef = await addDoc(collection(db, 'transactions'), transactionToAdd);

        const newTransaction = {
          id: docRef.id,
          ...transactionToAdd,
          created_at: new Date()
        };

        commit('ADD_TRANSACTION', newTransaction);
        commit('ADD_RECENT_TRANSACTION', newTransaction);

        console.log('✅ Transaction added:', transactionData.type);
        return newTransaction;

      } catch (error) {
        console.error('❌ Error adding transaction:', error);
        throw error;
      }
    },

    async getItemHistory({ commit, dispatch }, itemId) {
      try {
        if (!itemId) {
          throw new Error('معرف الصنف مطلوب');
        }

        const transactionsRef = collection(db, 'transactions');
        const q = query(
          transactionsRef,
          where('item_id', '==', itemId),
          orderBy('created_at', 'desc'),
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

    async transferItem({ commit, state, dispatch }, transferData) {
      try {
        commit('SET_OPERATION_LOADING', true);
        commit('CLEAR_OPERATION_ERROR');

        if (!transferData.item_id || !transferData.from_warehouse_id || !transferData.to_warehouse_id) {
          throw new Error('بيانات النقل غير مكتملة');
        }

        if (transferData.from_warehouse_id === transferData.to_warehouse_id) {
          throw new Error('لا يمكن نقل الصنف إلى نفس المخزن');
        }

        const itemRef = doc(db, 'items', transferData.item_id);
        const itemDoc = await getDoc(itemRef);

        if (!itemDoc.exists()) {
          throw new Error('الصنف غير موجود');
        }

        const itemData = itemDoc.data();

        if (itemData.warehouse_id !== transferData.from_warehouse_id) {
          throw new Error('الصنف ليس في المخزن المصدر');
        }

        const updateData = {
          warehouse_id: transferData.to_warehouse_id,
          updated_at: serverTimestamp(),
          updated_by: state.userProfile?.name || state.user?.email
        };

        await updateDoc(itemRef, updateData);

        const updatedItem = {
          id: transferData.item_id,
          ...itemData,
          ...updateData,
          updated_at: new Date()
        };

        const convertedItem = InventoryService.convertForDisplay(updatedItem);
        commit('UPDATE_ITEM', convertedItem);

        await dispatch('addTransaction', {
          type: TRANSACTION_TYPES.TRANSFER,
          item_id: transferData.item_id,
          item_name: itemData.name,
          item_code: itemData.code,
          from_warehouse_id: transferData.from_warehouse_id,
          to_warehouse_id: transferData.to_warehouse_id,
          cartons_count: transferData.cartons_count || 0,
          per_carton_count: transferData.per_carton_count || 0,
          single_bottles_count: transferData.single_bottles_count || 0,
          total_quantity: (transferData.cartons_count || 0) * (transferData.per_carton_count || 0) + (transferData.single_bottles_count || 0),
          notes: transferData.notes || 'نقل بين المخازن',
          created_by: state.userProfile?.name || state.user?.email
        });

        dispatch('showNotification', {
          type: 'success',
          message: `تم نقل الصنف "${itemData.name}" بنجاح`
        });

        return convertedItem;

      } catch (error) {
        console.error('❌ Error transferring item:', error);
        commit('SET_OPERATION_ERROR', error.message);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'خطأ في نقل الصنف'
        });
        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async dispatchItem({ commit, state, dispatch }, dispatchData) {
      try {
        commit('SET_OPERATION_LOADING', true);
        commit('CLEAR_OPERATION_ERROR');

        if (!dispatchData.item_id || !dispatchData.from_warehouse_id || !dispatchData.destination) {
          throw new Error('بيانات الإرسال غير مكتملة');
        }

        const itemRef = doc(db, 'items', dispatchData.item_id);
        const itemDoc = await getDoc(itemRef);

        if (!itemDoc.exists()) {
          throw new Error('الصنف غير موجود');
        }

        const itemData = itemDoc.data();

        if (itemData.warehouse_id !== dispatchData.from_warehouse_id) {
          throw new Error('الصنف ليس في المخزن المصدر');
        }

        const currentQuantity = itemData.remaining_quantity || 0;
        const dispatchQuantity = (dispatchData.cartons_count || 0) * (dispatchData.per_carton_count || 0) + (dispatchData.single_bottles_count || 0);

        if (dispatchQuantity > currentQuantity) {
          throw new Error('الكمية المطلوبة أكبر من الكمية المتاحة');
        }

        const newQuantity = currentQuantity - dispatchQuantity;
        const updateData = {
          remaining_quantity: newQuantity,
          updated_at: serverTimestamp(),
          updated_by: state.userProfile?.name || state.user?.email
        };

        await updateDoc(itemRef, updateData);

        const updatedItem = {
          id: dispatchData.item_id,
          ...itemData,
          ...updateData,
          updated_at: new Date()
        };

        const convertedItem = InventoryService.convertForDisplay(updatedItem);
        commit('UPDATE_ITEM', convertedItem);

        await dispatch('addTransaction', {
          type: TRANSACTION_TYPES.DISPATCH,
          item_id: dispatchData.item_id,
          item_name: itemData.name,
          item_code: itemData.code,
          from_warehouse_id: dispatchData.from_warehouse_id,
          destination: dispatchData.destination,
          cartons_count: dispatchData.cartons_count || 0,
          per_carton_count: dispatchData.per_carton_count || 0,
          single_bottles_count: dispatchData.single_bottles_count || 0,
          total_quantity: dispatchQuantity,
          remaining_quantity: newQuantity,
          notes: dispatchData.notes || 'إرسال إلى عميل',
          created_by: state.userProfile?.name || state.user?.email
        });

        dispatch('showNotification', {
          type: 'success',
          message: `تم إرسال الصنف "${itemData.name}" بنجاح`
        });

        return convertedItem;

      } catch (error) {
        console.error('❌ Error dispatching item:', error);
        commit('SET_OPERATION_ERROR', error.message);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'خطأ في إرسال الصنف'
        });
        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async loadAllUsers({ commit, state, dispatch }) {
      try {
        if (state.userProfile.role !== 'superadmin') {
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

    async updateUser({ commit, state, dispatch }, { userId, userData }) {
      try {
        if (state.userProfile.role !== 'superadmin') {
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

    async addWarehouse({ commit, state, dispatch }, warehouseData) {
      try {
        if (state.userProfile.role !== 'superadmin') {
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
          ...warehouseToAdd,
          created_at: new Date(),
          updated_at: new Date()
        };

        commit('UPDATE_WAREHOUSE', newWarehouse);

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
        if (state.userProfile.role !== 'superadmin') {
          throw new Error('ليس لديك صلاحية لتعديل المخازن');
        }

        commit('SET_OPERATION_LOADING', true);

        const warehouseRef = doc(db, 'warehouses', warehouseId);
        await updateDoc(warehouseRef, {
          ...warehouseData,
          updated_at: serverTimestamp(),
          updated_by: state.userProfile?.name || state.user?.email
        });

        const updatedWarehouse = {
          id: warehouseId,
          ...warehouseData
        };

        commit('UPDATE_WAREHOUSE', updatedWarehouse);

        dispatch('showNotification', {
          type: 'success',
          message: `تم تحديث المخزن بنجاح`
        });

        return updatedWarehouse;

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
        if (state.userProfile.role !== 'superadmin') {
          throw new Error('ليس لديك صلاحية لحذف المخازن');
        }

        commit('SET_OPERATION_LOADING', true);

        const confirmDelete = confirm(`هل أنت متأكد من حذف المخزن "${warehouseName}"؟`);
        if (!confirmDelete) return;

        const warehouseRef = doc(db, 'warehouses', warehouseId);
        await updateDoc(warehouseRef, {
          is_active: false,
          updated_at: serverTimestamp(),
          updated_by: state.userProfile?.name || state.user?.email
        });

        commit('REMOVE_WAREHOUSE', warehouseId);

        dispatch('showNotification', {
          type: 'success',
          message: `تم حذف المخزن "${warehouseName}" بنجاح`
        });

        return true;

      } catch (error) {
        console.error('❌ Error deleting warehouse:', error);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'خطأ في حذف المخزن'
        });
        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

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

    async fetchInventory({ dispatch }) {
      console.log('📦 Fetching inventory...');
      return await dispatch('fetchRecentInventory');
    },

    async fetchInventoryOnce({ dispatch }) {
      console.log('📦 Using fetchRecentInventory');
      return await dispatch('fetchRecentInventory');
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
        return warehouses.filter(w => w.is_active !== false);
      }

      if (role === 'warehouse_manager') {
        const allowedWarehouses = getters.allowedWarehouses;
        if (allowedWarehouses.length > 0) {
          if (allowedWarehouses.includes('all')) {
            return warehouses.filter(w => w.is_active !== false);
          }
          const accessiblePrimary = warehouses.filter(w => 
            w.type === 'primary' && allowedWarehouses.includes(w.id) && w.is_active !== false
          );
          const accessibleDispatch = warehouses.filter(w => w.type === 'dispatch' && w.is_active !== false);
          return [...accessiblePrimary, ...accessibleDispatch];
        }
      }

      if (role === 'company_manager') {
        return warehouses.filter(w => w.is_active !== false);
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
        return warehouses.filter(w => w.type === 'primary' && w.is_active !== false);
      }

      if (role === 'warehouse_manager') {
        const allowedWarehouses = getters.allowedWarehouses;
        if (allowedWarehouses.length > 0) {
          if (allowedWarehouses.includes('all')) {
            return warehouses.filter(w => w.type === 'primary' && w.is_active !== false);
          }
          return warehouses.filter(w => 
            w.type === 'primary' && allowedWarehouses.includes(w.id) && w.is_active !== false
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
    getArabicLabel: (state) => (fieldName) => {
      const mappings = state.fieldMappings || FIELD_MAPPINGS;
      return mappings.englishToArabic[fieldName] || fieldName;
    },
    getWarehouseLabel: (state) => (warehouseId) => {
      if (!warehouseId) return '';
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
    getUserNameById: (state) => (userId) => {
      const allUsers = Array.isArray(state.allUsers) ? state.allUsers : [];
      const user = allUsers.find(u => u.id === userId);
      return user ? user.name : userId;
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
