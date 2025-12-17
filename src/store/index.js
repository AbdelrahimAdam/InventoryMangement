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
  serverTimestamp,
  getCountFromServer,
  select
} from 'firebase/firestore';
import {
  InventoryService,
  WAREHOUSE_LABELS,
  DESTINATION_LABELS,
  FIELD_LABELS,
  TRANSACTION_TYPES
} from '@/services/inventoryService';
import UserService from '@/services/UserService';

// Performance configuration - UPDATED for Spark Plan
const PERFORMANCE_CONFIG = {
  INITIAL_LOAD: 50,
  SCROLL_LOAD: 20,
  SEARCH_LIMIT: 50,
  TRANSACTIONS_LIMIT: 100,
  CACHE_DURATION: 30 * 60 * 1000
};

// Notification configuration
const NOTIFICATION_CONFIG = {
  DEFAULT_DURATION: 3000,
  ERROR_DURATION: 5000,
  SUCCESS_DURATION: 2000,
  MAX_NOTIFICATIONS: 10
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
    // User state
    user: null,
    userProfile: null,
    loading: false,
    authError: null,

    // Warehouses
    warehouses: [],
    warehousesLoaded: false,

    // Inventory
    inventory: [],
    inventoryLoaded: false,
    inventoryLoading: false,
    inventoryError: null,

    // Pagination
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

    // Transactions - UPDATED
    transactions: [],
    recentTransactions: [],
    transactionsLoading: false,
    transactionStats: {
      total: 0,
      add: 0,
      transfer: 0,
      dispatch: 0,
      update: 0,
      delete: 0,
      lastUpdated: null
    },

    // Item history
    itemHistory: [],

    // Notifications
    notifications: [],
    notificationTimeouts: {},

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
    userCache: {}, // ✅ ADDED: Cache for user names

    // Cache
    cache: {
      warehouseLabels: {},
      itemDetails: {},
      stats: null,
      statsTimestamp: null,
      dashboardCounts: {
        totalItems: 0,
        totalQuantity: 0,
        lowStockItems: 0,
        lastUpdated: null
      },
      transactions: null,
      transactionsTimestamp: null
    },

    // Additional states
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

    // ✅ ADDED: User cache mutation
    CACHE_USER_NAME(state, { userId, userName }) {
      state.userCache[userId] = userName;
    },

    // Inventory mutations
    SET_INVENTORY(state, inventory) {
      state.inventory = inventory;
    },

    APPEND_INVENTORY(state, items) {
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

      state.cache.warehouseLabels = {};
      warehouses.forEach(w => {
        state.cache.warehouseLabels[w.id] = w.name_ar;
      });
    },

    // ✅ ADDED: Transaction stats mutation
    SET_TRANSACTION_STATS(state, stats) {
      state.transactionStats = {
        ...state.transactionStats,
        ...stats,
        lastUpdated: new Date()
      };
    },

    // Transaction mutations
    SET_TRANSACTIONS(state, transactions) {
      state.transactions = transactions;
      
      // Auto-calculate stats when transactions are set
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayTransactions = transactions.filter(t => {
        if (!t.timestamp) return false;
        try {
          const transDate = t.timestamp?.toDate ? t.timestamp.toDate() : new Date(t.timestamp);
          return transDate >= today;
        } catch {
          return false;
        }
      });
      
      const stats = {
        total: transactions.length,
        add: todayTransactions.filter(t => t.type === 'ADD').length,
        transfer: todayTransactions.filter(t => t.type === 'TRANSFER').length,
        dispatch: todayTransactions.filter(t => t.type === 'DISPATCH').length,
        update: todayTransactions.filter(t => t.type === 'UPDATE').length,
        delete: todayTransactions.filter(t => t.type === 'DELETE').length
      };
      
      state.transactionStats = { ...stats, lastUpdated: new Date() };
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

        // Update stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        try {
          const transDate = transaction.timestamp?.toDate ? 
            transaction.timestamp.toDate() : new Date(transaction.timestamp);
          
          if (transDate >= today) {
            const type = transaction.type;
            if (type === 'ADD') state.transactionStats.add++;
            else if (type === 'TRANSFER') state.transactionStats.transfer++;
            else if (type === 'DISPATCH') state.transactionStats.dispatch++;
            else if (type === 'UPDATE') state.transactionStats.update++;
            else if (type === 'DELETE') state.transactionStats.delete++;
          }
          state.transactionStats.total++;
          state.transactionStats.lastUpdated = new Date();
        } catch (error) {
          console.error('Error updating transaction stats:', error);
        }

        // Keep recent transactions limited
        if (state.recentTransactions.length > 50) {
          state.recentTransactions = state.recentTransactions.slice(0, 50);
        }
        
        // Keep all transactions limited
        if (state.transactions.length > 500) {
          state.transactions = state.transactions.slice(0, 500);
        }
      }
    },

    ADD_RECENT_TRANSACTION(state, transaction) {
      if (transaction) {
        state.recentTransactions.unshift(transaction);
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
    ADD_NOTIFICATION(state, { notification, timeoutId }) {
      notification.id = Date.now().toString();
      notification.timestamp = new Date();
      notification.timeoutId = timeoutId;
      state.notifications.unshift(notification);

      if (timeoutId) {
        state.notificationTimeouts[notification.id] = timeoutId;
      }

      if (state.notifications.length > NOTIFICATION_CONFIG.MAX_NOTIFICATIONS) {
        const removed = state.notifications.pop();
        if (removed.timeoutId) {
          clearTimeout(removed.timeoutId);
          delete state.notificationTimeouts[removed.id];
        }
      }
    },

    REMOVE_NOTIFICATION(state, notificationId) {
      if (state.notificationTimeouts[notificationId]) {
        clearTimeout(state.notificationTimeouts[notificationId]);
        delete state.notificationTimeouts[notificationId];
      }

      state.notifications = state.notifications.filter(n => n.id !== notificationId);
    },

    CLEAR_NOTIFICATIONS(state) {
      Object.values(state.notificationTimeouts).forEach(timeoutId => {
        clearTimeout(timeoutId);
      });
      state.notificationTimeouts = {};
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

    SET_DASHBOARD_COUNTS(state, { totalItems, totalQuantity, lowStockItems, lastUpdated }) {
      state.cache.dashboardCounts = {
        totalItems,
        totalQuantity,
        lowStockItems,
        lastUpdated
      };
    },

    // Users management
    SET_REQUIRES_COMPOSITE_INDEX(state, value) {
      state.requiresCompositeIndex = value;
    },

    SET_ALL_USERS(state, users) {
      state.allUsers = users;
      
      // ✅ ADDED: Cache user names when loading all users
      users.forEach(user => {
        if (user.id && user.name) {
          state.userCache[user.id] = user.name;
        }
      });
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
      // Clear notification timeouts
      Object.values(state.notificationTimeouts).forEach(timeoutId => {
        clearTimeout(timeoutId);
      });

      state.inventory = [];
      state.inventoryLoaded = false;
      state.transactions = [];
      state.recentTransactions = [];
      state.transactionStats = {
        total: 0,
        add: 0,
        transfer: 0,
        dispatch: 0,
        update: 0,
        delete: 0,
        lastUpdated: null
      };
      state.itemHistory = [];
      state.warehouses = [];
      state.warehousesLoaded = false;
      state.notifications = [];
      state.notificationTimeouts = {};
      state.allUsers = [];
      state.userCache = {}; // ✅ ADDED: Clear user cache
      state.filters = {
        warehouse: '',
        search: '',
        searchField: 'name'
      };
      state.cache = {
        warehouseLabels: {},
        itemDetails: {},
        stats: null,
        statsTimestamp: null,
        dashboardCounts: {
          totalItems: 0,
          totalQuantity: 0,
          lowStockItems: 0,
          lastUpdated: null
        },
        transactions: null,
        transactionsTimestamp: null
      };
      state.realtimeListeners.forEach(unsubscribe => unsubscribe());
      state.realtimeListeners = [];
    }
  },

  actions: {
    // ✅ ADDED: Get user name by ID (with caching)
    async getUserName({ commit, state, dispatch }, userId) {
      if (!userId) return 'نظام';
      
      // Check cache first
      if (state.userCache[userId]) {
        return state.userCache[userId];
      }
      
      // Check if user is in allUsers
      const userFromAllUsers = state.allUsers.find(u => u.id === userId);
      if (userFromAllUsers && userFromAllUsers.name) {
        commit('CACHE_USER_NAME', { userId, userName: userFromAllUsers.name });
        return userFromAllUsers.name;
      }
      
      // If it's the current user
      if (state.user?.uid === userId && state.userProfile?.name) {
        commit('CACHE_USER_NAME', { userId, userName: state.userProfile.name });
        return state.userProfile.name;
      }
      
      try {
        // Fetch from Firestore
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userName = userDoc.data().name || userId;
          commit('CACHE_USER_NAME', { userId, userName });
          return userName;
        }
      } catch (error) {
        console.warn('Could not fetch user name:', error);
      }
      
      return userId; // Fallback to user ID
    },

    // ✅ ADDED: Process transactions with user names
    async processTransactionsWithUserNames({ dispatch, state }, transactions) {
      const processedTransactions = [];
      
      for (const transaction of transactions) {
        const processedTransaction = { ...transaction };
        
        // Get user name if user_id exists
        if (transaction.user_id) {
          const userName = await dispatch('getUserName', transaction.user_id);
          processedTransaction.created_by = userName;
        } else if (transaction.created_by && transaction.created_by.includes('@')) {
          // If created_by is an email, try to get name
          const user = state.allUsers.find(u => u.email === transaction.created_by);
          if (user) {
            processedTransaction.created_by = user.name;
          }
        }
        
        processedTransactions.push(processedTransaction);
      }
      
      return processedTransactions;
    },

    // ✅ ADDED: Enhanced fetch transactions with user names
    async fetchTransactions({ commit, dispatch }) {
      commit('SET_TRANSACTIONS_LOADING', true);

      try {
        console.log('🔄 Loading transactions...');
        
        if (!auth.currentUser) {
          console.log('⚠️ No user logged in');
          commit('SET_TRANSACTIONS', []);
          return [];
        }

        const transactionsQuery = query(
          collection(db, 'transactions'),
          orderBy('timestamp', 'desc'),
          limit(100)
        );

        const snapshot = await getDocs(transactionsQuery);
        console.log(`📊 Found ${snapshot.size} transactions`);
        
        let transactions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Process transactions to get user names
        transactions = await dispatch('processTransactionsWithUserNames', transactions);

        // Calculate today's date for stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayTransactions = transactions.filter(t => {
          if (!t.timestamp) return false;
          try {
            const transDate = t.timestamp?.toDate ? t.timestamp.toDate() : new Date(t.timestamp);
            return transDate >= today;
          } catch {
            return false;
          }
        });

        const stats = {
          total: transactions.length,
          add: todayTransactions.filter(t => t.type === 'ADD').length,
          transfer: todayTransactions.filter(t => t.type === 'TRANSFER').length,
          dispatch: todayTransactions.filter(t => t.type === 'DISPATCH').length,
          update: todayTransactions.filter(t => t.type === 'UPDATE').length,
          delete: todayTransactions.filter(t => t.type === 'DELETE').length,
          lastUpdated: new Date()
        };

        commit('SET_TRANSACTIONS', transactions);
        commit('SET_TRANSACTION_STATS', stats);
        
        console.log('✅ Transactions loaded successfully');
        return transactions;

      } catch (error) {
        console.error('❌ Error loading transactions:', error);
        commit('SET_TRANSACTIONS', []);
        commit('SET_TRANSACTION_STATS', {
          total: 0,
          add: 0,
          transfer: 0,
          dispatch: 0,
          update: 0,
          delete: 0,
          lastUpdated: null
        });
        
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تحميل الحركات'
        });
        return [];
      } finally {
        commit('SET_TRANSACTIONS_LOADING', false);
      }
    },

    // ✅ ADDED: Enhanced load recent transactions
    async getRecentTransactions({ commit, dispatch }) {
      try {
        console.log('🔄 Loading recent transactions...');
        
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const transactionsQuery = query(
          collection(db, 'transactions'),
          where('timestamp', '>=', oneDayAgo),
          orderBy('timestamp', 'desc'),
          limit(30)
        );

        const snapshot = await getDocs(transactionsQuery);
        let transactions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Process transactions to get user names
        transactions = await dispatch('processTransactionsWithUserNames', transactions);

        commit('SET_RECENT_TRANSACTIONS', transactions);
        console.log('✅ Recent transactions loaded:', transactions.length);
        return transactions;

      } catch (error) {
        console.error('❌ Error loading recent transactions:', error);
        return [];
      }
    },

    // ✅ ADDED: Enhanced initialize auth with user name caching
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
                
                // Cache current user's name
                commit('CACHE_USER_NAME', { 
                  userId: user.uid, 
                  userName: userProfile.name || user.email 
                });

                // Load warehouses
                await dispatch('loadWarehouses');

                // Load all users (for user name cache)
                if (userProfile.role === 'superadmin') {
                  await dispatch('loadAllUsers');
                }

                // Load ALL inventory
                await dispatch('loadAllInventory');

                // Load transactions
                await dispatch('fetchTransactions');
                await dispatch('getRecentTransactions');

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

    // 🔥 Enhanced add transaction with user name
    async addTransaction({ commit, state, dispatch }, transactionData) {
      try {
        if (!state.user || !state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        // Add user name to transaction data
        const transactionWithUser = {
          ...transactionData,
          user_id: state.user.uid,
          created_by: state.userProfile.name || state.user.email,
          timestamp: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'transactions'), transactionWithUser);
        
        const newTransaction = {
          id: docRef.id,
          ...transactionWithUser,
          created_by: state.userProfile.name || state.user.email // Ensure name is stored
        };

        // Add to Vuex store
        commit('ADD_TRANSACTION', newTransaction);
        
        // Also add to recent transactions
        commit('ADD_RECENT_TRANSACTION', newTransaction);

        return { success: true, transaction: newTransaction };
        
      } catch (error) {
        console.error('❌ Error adding transaction:', error);
        dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ أثناء إضافة الحركة'
        });
        throw error;
      }
    },

    // 🔥 Enhanced inventory operations with user names in transactions
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

        // ✅ UPDATED: Create transaction record with user name
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
          user_name: state.userProfile?.name || state.user?.email, // ✅ ADDED: User name
          timestamp: serverTimestamp(),
          notes: cleanData.notes || 'عملية إضافة جديدة',
          created_by: state.userProfile?.name || state.user?.email // ✅ Use name instead of email
        };

        await addDoc(collection(db, 'transactions'), transactionData);

        // Convert for display and update store
        const newItem = InventoryService.convertForDisplay({
          id: docRef.id,
          ...cleanData
        });

        // ✅ Process transaction to ensure user name is included
        const processedTransaction = {
          ...transactionData,
          created_by: state.userProfile?.name || state.user?.email
        };
        
        commit('ADD_RECENT_TRANSACTION', processedTransaction);
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

    // ✅ UPDATED: Enhanced update item with user name in transaction
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

        // ✅ UPDATED: Create transaction record with user name
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
            user_name: state.userProfile?.name || state.user?.email, // ✅ ADDED: User name
            timestamp: serverTimestamp(),
            notes: `تعديل الصنف: ${updateData.notes || ''}`.trim(),
            created_by: state.userProfile?.name || state.user?.email // ✅ Use name instead of email
          };

          await addDoc(collection(db, 'transactions'), transactionData);
          
          // ✅ Process transaction to ensure user name is included
          const processedTransaction = {
            ...transactionData,
            created_by: state.userProfile?.name || state.user?.email
          };
          commit('ADD_RECENT_TRANSACTION', processedTransaction);
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

    // ✅ UPDATED: Enhanced transfer item with user name in transaction
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

        // ✅ UPDATED: Create transaction record with user name
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
          user_name: state.userProfile?.name || state.user?.email, // ✅ ADDED: User name
          timestamp: serverTimestamp(),
          notes: transferData.notes || 'نقل بين المخازن',
          created_by: state.userProfile?.name || state.user?.email // ✅ Use name instead of email
        };

        await addDoc(collection(db, 'transactions'), transactionData);

        // Update store with the modified item
        const updatedItem = InventoryService.convertForDisplay({
          id: transferData.item_id,
          ...itemData,
          ...updateData
        });

        // ✅ Process transaction to ensure user name is included
        const processedTransaction = {
          ...transactionData,
          created_by: state.userProfile?.name || state.user?.email
        };
        
        commit('UPDATE_INVENTORY_ITEM', updatedItem);
        commit('ADD_RECENT_TRANSACTION', processedTransaction);

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

    // ✅ UPDATED: Enhanced dispatch item with user name in transaction
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

        // ✅ UPDATED: Create transaction record with user name
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
          user_name: state.userProfile?.name || state.user?.email, // ✅ ADDED: User name
          timestamp: serverTimestamp(),
          notes: dispatchData.notes || 'صرف إلى عميل',
          created_by: state.userProfile?.name || state.user?.email // ✅ Use name instead of email
        };

        await addDoc(collection(db, 'transactions'), transactionData);

        // Update store with the modified item
        const updatedItem = InventoryService.convertForDisplay({
          id: dispatchData.item_id,
          ...itemData,
          ...updateData
        });

        // ✅ Process transaction to ensure user name is included
        const processedTransaction = {
          ...transactionData,
          created_by: state.userProfile?.name || state.user?.email
        };
        
        commit('UPDATE_INVENTORY_ITEM', updatedItem);
        commit('ADD_RECENT_TRANSACTION', processedTransaction);

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

    // 🔥 Enhanced load warehouses (separate regular from dispatch)
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

    // ✅ ADDED: Enhanced delete item with user name in transaction
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

        // ✅ UPDATED: Create transaction record with user name
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
          user_name: state.userProfile?.name || state.user?.email, // ✅ ADDED: User name
          timestamp: serverTimestamp(),
          notes: 'حذف الصنف نهائياً',
          created_by: state.userProfile?.name || state.user?.email // ✅ Use name instead of email
        };

        await addDoc(collection(db, 'transactions'), transactionData);

        // Delete the item
        await deleteDoc(itemRef);

        // ✅ Process transaction to ensure user name is included
        const processedTransaction = {
          ...transactionData,
          created_by: state.userProfile?.name || state.user?.email
        };
        
        // Update store
        commit('REMOVE_INVENTORY_ITEM', itemId);
        commit('CLEAR_ITEM_CACHE', itemId);
        commit('ADD_RECENT_TRANSACTION', processedTransaction);

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

    // 🔥 Show notification
    showNotification({ commit, state }, notification) {
      if (!notification?.message) return;

      let duration = NOTIFICATION_CONFIG.DEFAULT_DURATION;
      if (notification.type === 'error') {
        duration = NOTIFICATION_CONFIG.ERROR_DURATION;
      } else if (notification.type === 'success') {
        duration = NOTIFICATION_CONFIG.SUCCESS_DURATION;
      }

      const finalNotification = {
        type: 'info',
        duration,
        ...notification
      };

      const timeoutId = setTimeout(() => {
        commit('REMOVE_NOTIFICATION', finalNotification.id);
      }, duration);

      commit('ADD_NOTIFICATION', { 
        notification: finalNotification, 
        timeoutId 
      });
    },

    // 🔥 Enhanced load all users for user name caching
    async loadAllUsers({ commit, state, dispatch }) {
      try {
        if (state.userProfile?.role !== 'superadmin') {
          // Still load users for caching, but don't throw error
          console.log('Loading users for caching only');
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
        console.log('✅ Users loaded for caching:', users.length);
        return users;
      } catch (error) {
        console.error('❌ Error loading users:', error);
        return [];
      } finally {
        commit('SET_USERS_LOADING', false);
      }
    },

    // 🔥 The rest of your existing actions remain the same...
    // [Include all other actions from your original code here]
    // Only the actions above have been modified
    
    // ... [All other existing actions remain unchanged]

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
    
    // ✅ UPDATED: Regular warehouses only (not dispatch warehouses)
    regularWarehouses: state => state.warehouses.filter(w => w.type !== 'dispatch'),
    
    primaryWarehouses: state => state.warehouses.filter(w => w.type === 'primary'),
    dispatchWarehouses: state => state.warehouses.filter(w => w.type === 'dispatch'),
    mainWarehouse: state => state.warehouses.find(w => w.is_main) || null,

    // ====== TRANSACTIONS ======
    transactions: state => state.transactions,
    transactionStats: state => state.transactionStats,
    transactionsItems: state => Array.isArray(state.transactions) ? state.transactions : [],
    recentTransactions: state => state.recentTransactions,
    transactionsLoading: state => state.transactionsLoading,
    recentTransactionsLoading: state => state.recentTransactionsLoading,

    // ✅ ADDED: Get user name from cache
    getUserNameById: (state) => (userId) => {
      if (!userId) return 'نظام';
      return state.userCache[userId] || userId;
    },

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

    // ✅ UPDATED: Regular warehouses only for filtering
    accessibleRegularWarehouses: (state, getters) => {
      const accessible = getters.accessibleWarehouses;
      return accessible.filter(w => w.type !== 'dispatch');
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
      
      return [];
    },

    // ====== FILTERED INVENTORY ======
    filteredInventory: (state, getters) => {
      let inventory = state.inventory;

      if (state.filters.warehouse) {
        inventory = inventory.filter(item => item.warehouse_id === state.filters.warehouse);
      }

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

    dashboardRealStats: (state) => (warehouseId = 'all') => {
      const cache = state.cache.dashboardCounts;
      if (cache.lastUpdated && (Date.now() - new Date(cache.lastUpdated).getTime()) < 5 * 60 * 1000) {
        return {
          totalItems: cache.totalItems,
          totalQuantity: cache.totalQuantity,
          lowStockItems: cache.lowStockItems,
          lastUpdated: cache.lastUpdated
        };
      }

      const inventory = state.inventory;
      const filteredInventory = warehouseId === 'all' 
        ? inventory 
        : inventory.filter(item => item.warehouse_id === warehouseId);

      return {
        totalItems: filteredInventory.length,
        totalQuantity: filteredInventory.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0),
        lowStockItems: filteredInventory.filter(item => (item.remaining_quantity || 0) < 10).length,
        lastUpdated: new Date()
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

    // ✅ UPDATED: Get user display name using cache
    getUserDisplayName: (state, getters) => (userId) => {
      if (!userId) return 'نظام';
      if (userId === state.user?.uid) {
        return state.userProfile?.name || state.user?.email || 'نظام';
      }
      return getters.getUserNameById(userId) || userId;
    },

    // ====== TRANSACTION STATISTICS ======
    getTransactionStats: (state) => {
      return state.transactionStats;
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
          (transaction.created_by?.toLowerCase() || '').includes(term) ||
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
    },

    // ✅ ADDED: Get regular warehouses only
    getRegularWarehouses: (state) => {
      return state.warehouses
        .filter(w => w.type !== 'dispatch')
        .map(w => ({
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