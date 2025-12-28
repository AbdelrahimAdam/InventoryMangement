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
  increment,
  Timestamp
} from 'firebase/firestore';
import {
  InventoryService,
  WAREHOUSE_LABELS,
  DESTINATION_LABELS,
  FIELD_LABELS,
  TRANSACTION_TYPES
} from '@/services/inventoryService';
import * as XLSX from 'xlsx';

// Performance configuration - UPDATED for Spark Plan
const PERFORMANCE_CONFIG = {
  INITIAL_LOAD: 50,
  SCROLL_LOAD: 20,
  SEARCH_LIMIT: 50,
  CACHE_DURATION: 30 * 60 * 1000,
  INVOICE_LOAD_LIMIT: 100
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

// Track active real-time listeners to prevent zombies
const activeListeners = new Map();

export default createStore({
  state: () => ({
    user: null,
    userProfile: null,
    loading: false,
    authError: null,
    warehouses: [],
    warehousesLoaded: false,
    inventory: [],
    inventoryLoaded: false,
    inventoryLoading: false,
    inventoryError: null,
    pagination: {
      lastDoc: null,
      hasMore: true,
      currentPage: 0,
      totalLoaded: 0,
      isFetching: false
    },
    filters: {
      warehouse: '',
      search: '',
      searchField: 'name'
    },
    transactions: [],
    recentTransactions: [],
    transactionsLoading: false,
    itemHistory: [],
    notifications: [],
    notificationTimeouts: {},
    realtimeMode: true,
    realtimeListeners: [],
    operationLoading: false,
    operationError: null,
    requiresCompositeIndex: false,
    allUsers: [],
    usersLoading: false,
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
      }
    },
    fieldMappings: FIELD_MAPPINGS,
    inventoryLastFetched: null,
    isFetchingInventory: false,
    isRefreshingSilently: false,
    recentTransactionsLoading: false,
    activeItemListeners: new Set(), // Track item listeners
    
    // Invoice System State
    invoices: [],
    invoicesLoaded: false,
    invoicesLoading: false,
    invoicesError: null,
    invoiceFilters: {
      search: '',
      status: '',
      type: '',
      dateFrom: '',
      dateTo: ''
    },
    invoicePagination: {
      lastDoc: null,
      hasMore: true,
      currentPage: 0,
      totalLoaded: 0,
      isFetching: false
    },
    invoiceStats: {
      totalInvoices: 0,
      totalSales: 0,
      totalTax: 0,
      uniqueCustomers: 0,
      lastUpdated: null
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
    SET_AUTH_ERROR(state, error) {
      state.authError = error;
    },
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
    SET_WAREHOUSES(state, warehouses) {
      state.warehouses = warehouses;
      state.warehousesLoaded = true;
      state.cache.warehouseLabels = {};
      warehouses.forEach(w => {
        state.cache.warehouseLabels[w.id] = w.name_ar;
      });
    },
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
        if (state.recentTransactions.length > 50) {
          state.recentTransactions = state.recentTransactions.slice(0, 50);
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
    SET_ITEM_HISTORY(state, history) {
      state.itemHistory = history;
    },
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
    SET_REALTIME_MODE(state, mode) {
      state.realtimeMode = mode;
    },
    ADD_REALTIME_LISTENER(state, listener) {
      state.realtimeListeners.push(listener);
    },
    CLEAR_REALTIME_LISTENERS(state) {
      // Clean up all active listeners
      state.realtimeListeners.forEach(unsubscribe => {
        try {
          if (typeof unsubscribe === 'function') {
            unsubscribe();
          }
        } catch (error) {
          console.warn('Error unsubscribing listener:', error);
        }
      });
      state.realtimeListeners = [];
      
      // Clean up tracked item listeners
      state.activeItemListeners.clear();
    },
    SET_OPERATION_LOADING(state, loading) {
      state.operationLoading = loading;
    },
    SET_OPERATION_ERROR(state, error) {
      state.operationError = error;
    },
    CLEAR_OPERATION_ERROR(state) {
      state.operationError = null;
    },
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
    SET_REQUIRES_COMPOSITE_INDEX(state, value) {
      state.requiresCompositeIndex = value;
    },
    SET_ALL_USERS(state, users) {
      state.allUsers = users;
    },
    SET_USERS_LOADING(state, loading) {
      state.usersLoading = loading;
    },
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
    ADD_ITEM_LISTENER(state, itemId) {
      state.activeItemListeners.add(itemId);
    },
    REMOVE_ITEM_LISTENER(state, itemId) {
      state.activeItemListeners.delete(itemId);
    },
    CLEAR_ITEM_LISTENERS(state) {
      state.activeItemListeners.clear();
    },
    
    // Invoice System Mutations
    SET_INVOICES(state, invoices) {
      state.invoices = invoices;
    },
    ADD_INVOICE(state, invoice) {
      state.invoices.unshift(invoice);
    },
    UPDATE_INVOICE(state, updatedInvoice) {
      const index = state.invoices.findIndex(inv => inv.id === updatedInvoice.id);
      if (index !== -1) {
        state.invoices.splice(index, 1, updatedInvoice);
      } else {
        state.invoices.unshift(updatedInvoice);
      }
    },
    REMOVE_INVOICE(state, invoiceId) {
      state.invoices = state.invoices.filter(inv => inv.id !== invoiceId);
    },
    SET_INVOICES_LOADING(state, loading) {
      state.invoicesLoading = loading;
    },
    SET_INVOICES_LOADED(state, loaded) {
      state.invoicesLoaded = loaded;
    },
    SET_INVOICES_ERROR(state, error) {
      state.invoicesError = error;
    },
    SET_INVOICE_FILTERS(state, filters) {
      state.invoiceFilters = { ...state.invoiceFilters, ...filters };
    },
    CLEAR_INVOICE_FILTERS(state) {
      state.invoiceFilters = {
        search: '',
        status: '',
        type: '',
        dateFrom: '',
        dateTo: ''
      };
    },
    SET_INVOICE_PAGINATION(state, pagination) {
      state.invoicePagination = { ...state.invoicePagination, ...pagination };
    },
    RESET_INVOICE_PAGINATION(state) {
      state.invoicePagination = {
        lastDoc: null,
        hasMore: true,
        currentPage: 0,
        totalLoaded: 0,
        isFetching: false
      };
    },
    SET_INVOICE_STATS(state, stats) {
      state.invoiceStats = { ...state.invoiceStats, ...stats };
    },
    CALCULATE_INVOICE_STATS(state) {
      const validInvoices = state.invoices.filter(inv => inv.status !== 'cancelled');
      
      const totalInvoices = validInvoices.length;
      const totalSales = validInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
      const totalTax = validInvoices
        .filter(inv => inv.type === 'B2B' || inv.type === 'B2C')
        .reduce((sum, inv) => sum + (inv.taxAmount || 0), 0);
      
      const customers = new Set();
      validInvoices.forEach(inv => {
        if (inv.customer?.phone) {
          customers.add(inv.customer.phone);
        }
      });
      
      state.invoiceStats = {
        totalInvoices,
        totalSales,
        totalTax,
        uniqueCustomers: customers.size,
        lastUpdated: new Date()
      };
    },
    
    RESET_STATE(state) {
      Object.values(state.notificationTimeouts).forEach(timeoutId => {
        clearTimeout(timeoutId);
      });

      state.inventory = [];
      state.inventoryLoaded = false;
      state.transactions = [];
      state.recentTransactions = [];
      state.itemHistory = [];
      state.warehouses = [];
      state.warehousesLoaded = false;
      state.notifications = [];
      state.notificationTimeouts = {};
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
        statsTimestamp: null,
        dashboardCounts: {
          totalItems: 0,
          totalQuantity: 0,
          lowStockItems: 0,
          lastUpdated: null
        }
      };
      state.invoices = [];
      state.invoicesLoaded = false;
      state.invoiceFilters = {
        search: '',
        status: '',
        type: '',
        dateFrom: '',
        dateTo: ''
      };
      state.invoiceStats = {
        totalInvoices: 0,
        totalSales: 0,
        totalTax: 0,
        uniqueCustomers: 0,
        lastUpdated: null
      };
      
      // Clean up all listeners
      state.realtimeListeners.forEach(unsubscribe => {
        try {
          if (typeof unsubscribe === 'function') {
            unsubscribe();
          }
        } catch (error) {
          console.warn('Error unsubscribing listener:', error);
        }
      });
      state.realtimeListeners = [];
      state.activeItemListeners.clear();
    }
  },

  actions: {
    // ✅ FIXED: Get REAL total item count (Spark Plan optimized)
    async getTotalItemCount({ state }, warehouseId = 'all') {
      try {
        console.log(`📊 Getting total item count for ${warehouseId === 'all' ? 'all warehouses' : 'warehouse ' + warehouseId}`);

        const itemsRef = collection(db, 'items');

        if (warehouseId === 'all') {
          // Count ALL items - NO limit(0)!
          const q = query(itemsRef);
          const snapshot = await getCountFromServer(q);
          return snapshot.data().count;
        } else {
          // Count items in specific warehouse - NO limit(0)!
          const q = query(
            itemsRef,
            where('warehouse_id', '==', warehouseId)
          );
          const snapshot = await getCountFromServer(q);
          return snapshot.data().count;
        }
      } catch (error) {
        console.error('❌ Error getting total item count:', error);
        const items = state.inventory;
        const filteredItems = warehouseId === 'all' 
          ? items 
          : items.filter(item => item.warehouse_id === warehouseId);
        return filteredItems.length;
      }
    },

    // ✅ FIXED: Get low stock count
    async getLowStockCount({ state }, warehouseId = 'all') {
      try {
        console.log(`📊 Getting low stock count for ${warehouseId === 'all' ? 'all warehouses' : 'warehouse ' + warehouseId}`);

        const itemsRef = collection(db, 'items');

        if (warehouseId === 'all') {
          const q = query(
            itemsRef,
            where('remaining_quantity', '<', 10),
            where('remaining_quantity', '>', 0)
          );
          const snapshot = await getCountFromServer(q);
          return snapshot.data().count;
        } else {
          const q = query(
            itemsRef,
            where('warehouse_id', '==', warehouseId),
            where('remaining_quantity', '<', 10),
            where('remaining_quantity', '>', 0)
          );
          const snapshot = await getCountFromServer(q);
          return snapshot.data().count;
        }
      } catch (error) {
        console.error('❌ Error getting low stock count:', error);
        const items = state.inventory;
        const filteredItems = warehouseId === 'all' 
          ? items 
          : items.filter(item => item.warehouse_id === warehouseId);
        return filteredItems.filter(item => (item.remaining_quantity || 0) < 10 && (item.remaining_quantity || 0) > 0).length;
      }
    },

    // ✅ FIXED: Get out of stock count
    async getOutOfStockCount({ state }, warehouseId = 'all') {
      try {
        const itemsRef = collection(db, 'items');

        if (warehouseId === 'all') {
          const q = query(
            itemsRef,
            where('remaining_quantity', '==', 0)
          );
          const snapshot = await getCountFromServer(q);
          return snapshot.data().count;
        } else {
          const q = query(
            itemsRef,
            where('warehouse_id', '==', warehouseId),
            where('remaining_quantity', '==', 0)
          );
          const snapshot = await getCountFromServer(q);
          return snapshot.data().count;
        }
      } catch (error) {
        console.error('❌ Error getting out of stock count:', error);
        const items = state.inventory;
        const filteredItems = warehouseId === 'all' 
          ? items 
          : items.filter(item => item.warehouse_id === warehouseId);
        return filteredItems.filter(item => (item.remaining_quantity || 0) === 0).length;
      }
    },

    // ✅ FIXED: Get total quantity sum
    async getTotalQuantitySum({ state }, warehouseId = 'all') {
      try {
        console.log(`📊 Getting total quantity sum for ${warehouseId === 'all' ? 'all warehouses' : 'warehouse ' + warehouseId}`);

        if (warehouseId === 'all') {
          return state.inventory.reduce((sum, item) => 
            sum + (item.remaining_quantity || 0), 0
          );
        } else {
          const warehouseItems = state.inventory.filter(item => 
            item.warehouse_id === warehouseId
          );
          return warehouseItems.reduce((sum, item) => 
            sum + (item.remaining_quantity || 0), 0
          );
        }
      } catch (error) {
        console.error('❌ Error getting total quantity sum:', error);
        return 0;
      }
    },

    // ✅ FIXED: Refresh dashboard counts
    async refreshDashboardCounts({ commit, state, dispatch }, warehouseId = 'all') {
      try {
        console.log('🔄 Refreshing dashboard counts...');

        const cache = state.cache.dashboardCounts;
        const cacheExpiry = 5 * 60 * 1000;

        if (cache.lastUpdated && (Date.now() - new Date(cache.lastUpdated).getTime()) < cacheExpiry) {
          console.log('📦 Using cached dashboard counts');
          return cache;
        }

        const totalItems = await dispatch('getTotalItemCount', warehouseId);
        const lowStockItems = await dispatch('getLowStockCount', warehouseId);
        const totalQuantity = await dispatch('getTotalQuantitySum', warehouseId);

        const counts = {
          totalItems,
          totalQuantity,
          lowStockItems,
          lastUpdated: new Date()
        };

        commit('SET_DASHBOARD_COUNTS', counts);
        console.log('✅ Dashboard counts refreshed:', counts);
        return counts;

      } catch (error) {
        console.error('❌ Error refreshing dashboard counts:', error);
        const items = state.inventory;
        const filteredItems = warehouseId === 'all' 
          ? items 
          : items.filter(item => item.warehouse_id === warehouseId);

        const fallbackCounts = {
          totalItems: filteredItems.length,
          totalQuantity: filteredItems.reduce((sum, item) => 
            sum + (item.remaining_quantity || 0), 0
          ),
          lowStockItems: filteredItems.filter(item => 
            (item.remaining_quantity || 0) < 10 && (item.remaining_quantity || 0) > 0
          ).length,
          lastUpdated: new Date()
        };

        return fallbackCounts;
      }
    },

    async getDashboardStats({ dispatch }, warehouseId = 'all') {
      try {
        const counts = await dispatch('refreshDashboardCounts', warehouseId);
        return {
          ...counts,
          recentTransactions: 0
        };
      } catch (error) {
        console.error('❌ Error getting dashboard stats:', error);
        throw error;
      }
    },

    async getAllWarehousesSummary({ dispatch, getters }) {
      try {
        const warehouses = getters.warehouses;
        const summary = {
          totalItems: 0,
          totalQuantity: 0,
          lowStockItems: 0,
          warehouseCount: warehouses.length,
          lastUpdated: new Date()
        };

        for (const warehouse of warehouses) {
          const counts = await dispatch('refreshDashboardCounts', warehouse.id);
          summary.totalItems += counts.totalItems;
          summary.totalQuantity += counts.totalQuantity;
          summary.lowStockItems += counts.lowStockItems;
        }

        return summary;
      } catch (error) {
        console.error('❌ Error getting all warehouses summary:', error);
        throw error;
      }
    },

    async searchItemsForTransactions({ state }, { searchTerm, limitResults = 20 }) {
      try {
        console.log('🔍 REAL-TIME SEARCH:', searchTerm);
        if (!searchTerm || searchTerm.trim().length < 2) {
          return [];
        }
        const term = searchTerm.trim().toLowerCase();
        console.log('⚡ Searching Firestore directly...');
        const itemsRef = collection(db, 'items');
        let firestoreQuery;
        const searchPromises = [];
        const codeQuery = query(
          itemsRef,
          where('code', '>=', term),
          where('code', '<=', term + '\uf8ff'),
          orderBy('code'),
          limit(limitResults)
        );
        searchPromises.push(getDocs(codeQuery));
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
        const results = await Promise.allSettled(searchPromises);
        const allItems = new Map();
        for (const result of results) {
          if (result.status === 'fulfilled' && !result.value.empty) {
            result.value.docs.forEach(doc => {
              if (!allItems.has(doc.id)) {
                const itemData = doc.data();
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
        let firestoreResults = Array.from(allItems.values());
        firestoreResults.sort((a, b) => {
          const aCodeMatch = a.code?.toLowerCase().startsWith(term) ? 0 : 1;
          const bCodeMatch = b.code?.toLowerCase().startsWith(term) ? 0 : 1;
          if (aCodeMatch !== bCodeMatch) return aCodeMatch - bCodeMatch;
          const aNameMatch = a.name?.toLowerCase().includes(term) ? 0 : 1;
          const bNameMatch = b.name?.toLowerCase().includes(term) ? 0 : 1;
          return aNameMatch - bNameMatch;
        });
        firestoreResults = firestoreResults.slice(0, limitResults);
        console.log(`✅ Found ${firestoreResults.length} items in Firestore search`);
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
        if (itemId) {
          try {
            const itemDoc = await getDoc(doc(db, 'items', itemId));
            if (itemDoc.exists()) {
              const itemData = itemDoc.data();
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

    async loadAllInventory({ commit, state, dispatch }, { forceRefresh = false } = {}) {
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

        const itemsRef = collection(db, 'items');
        let itemsQuery;

        if (state.userProfile.role === 'superadmin' || state.userProfile.role === 'company_manager') {
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
            itemsQuery = query(
              itemsRef,
              orderBy('name'),
              limit(PERFORMANCE_CONFIG.INITIAL_LOAD)
            );
          } else {
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

        const inventory = snapshot.docs.map(doc => {
          const data = doc.data();
          return InventoryService.convertForDisplay({
            id: doc.id,
            ...data
          });
        });

        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        commit('SET_PAGINATION', {
          lastDoc,
          hasMore: snapshot.size === PERFORMANCE_CONFIG.INITIAL_LOAD,
          totalLoaded: inventory.length
        });

        commit('SET_INVENTORY', inventory);
        commit('SET_INVENTORY_LOADED', true);

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

        const newItems = snapshot.docs.map(doc => {
          const data = doc.data();
          return InventoryService.convertForDisplay({
            id: doc.id,
            ...data
          });
        });

        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        const totalLoaded = state.pagination.totalLoaded + newItems.length;

        commit('APPEND_INVENTORY', newItems);
        commit('SET_PAGINATION', {
          lastDoc,
          hasMore: snapshot.size === PERFORMANCE_CONFIG.SCROLL_LOAD,
          totalLoaded,
          currentPage: state.pagination.currentPage + 1
        });

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

    async loadWarehouseItems({ commit, state, dispatch }, { warehouseId, limit = 50, lastDoc = null } = {}) {
      try {
        if (!warehouseId) {
          throw new Error('معرف المخزن مطلوب');
        }

        console.log(`🔄 Loading warehouse items (${warehouseId})...`);

        if (state.user && state.userProfile?.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
            if (!allowedWarehouses.includes(warehouseId)) {
              throw new Error('ليس لديك صلاحية للوصول إلى هذا المخزن');
            }
          }
        }

        const itemsRef = collection(db, 'items');
        let itemsQuery;

        if (lastDoc) {
          itemsQuery = query(
            itemsRef,
            where('warehouse_id', '==', warehouseId),
            orderBy('created_at', 'desc'),
            startAfter(lastDoc),
            limit(limit)
          );
        } else {
          itemsQuery = query(
            itemsRef,
            where('warehouse_id', '==', warehouseId),
            orderBy('created_at', 'desc'),
            limit(limit)
          );
        }

        const snapshot = await getDocs(itemsQuery);
        console.log(`✅ Loaded ${snapshot.size} items from warehouse ${warehouseId}`);

        const items = snapshot.docs.map(doc => {
          const itemData = doc.data();
          return InventoryService.convertForDisplay({
            id: doc.id,
            ...itemData
          });
        });

        const newLastDoc = snapshot.docs[snapshot.docs.length - 1];
        const hasMore = snapshot.size === limit;

        return {
          items,
          lastDoc: newLastDoc,
          hasMore
        };

      } catch (error) {
        console.error('❌ Error loading warehouse items:', error);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'خطأ في تحميل الأصناف من المخزن'
        });
        
        const localItems = state.inventory.filter(item => item.warehouse_id === warehouseId);
        return {
          items: localItems.slice(0, limit),
          lastDoc: null,
          hasMore: false
        };
      }
    },

    async loadMoreWarehouseItems({ commit, state, dispatch }, { warehouseId, currentItems = [] }) {
      if (state.pagination.isFetching) {
        return { items: [], hasMore: false };
      }

      commit('SET_PAGINATION', { isFetching: true });

      try {
        console.log(`📥 Loading more items from warehouse ${warehouseId}...`);

        const lastItem = currentItems[currentItems.length - 1];
        let lastDoc = null;

        if (lastItem) {
          const itemRef = doc(db, 'items', lastItem.id);
          lastDoc = await getDoc(itemRef);
        }

        const result = await dispatch('loadWarehouseItems', {
          warehouseId,
          limit: PERFORMANCE_CONFIG.SCROLL_LOAD,
          lastDoc: lastItem ? lastDoc : null
        });

        if (result.items.length > 0) {
          const allItems = [...currentItems, ...result.items];
          
          const newIds = new Set(result.items.map(item => item.id));
          const existingIds = new Set(state.inventory.map(item => item.id));
          const itemsToAdd = result.items.filter(item => !existingIds.has(item.id));
          
          if (itemsToAdd.length > 0) {
            commit('APPEND_INVENTORY', itemsToAdd);
          }

          commit('SET_PAGINATION', {
            lastDoc: result.lastDoc,
            hasMore: result.hasMore,
            totalLoaded: state.pagination.totalLoaded + result.items.length,
            isFetching: false
          });

          return {
            items: result.items,
            allItems,
            hasMore: result.hasMore
          };
        } else {
          commit('SET_PAGINATION', { 
            hasMore: false, 
            isFetching: false 
          });
          
          return { items: [], allItems: currentItems, hasMore: false };
        }

      } catch (error) {
        console.error('❌ Error loading more warehouse items:', error);
        commit('SET_PAGINATION', { isFetching: false });
        
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تحميل المزيد من الأصناف'
        });
        
        return { items: [], allItems: currentItems, hasMore: false };
      }
    },

    async resetWarehousePagination({ commit }) {
      commit('RESET_PAGINATION');
    },

    // ✅ FIXED: Get warehouse items count
    async getWarehouseItemsCount({ state }, warehouseId) {
      try {
        const itemsRef = collection(db, 'items');
        const q = query(
          itemsRef,
          where('warehouse_id', '==', warehouseId)
        );
        const snapshot = await getCountFromServer(q);
        return snapshot.data().count;
      } catch (error) {
        console.error('❌ Error counting warehouse items:', error);
        const localCount = state.inventory.filter(item => item.warehouse_id === warehouseId).length;
        return localCount;
      }
    },

    // 🔥 Setup real-time updates with zombie prevention
    async setupRealtimeUpdatesForInventory({ commit, state, dispatch }) {
      if (!state.realtimeMode || state.inventory.length === 0) return;

      try {
        console.log('🔴 Setting up real-time updates for inventory...');

        // Clean up existing listeners first
        commit('CLEAR_REALTIME_LISTENERS');

        // Setup listeners with proper cleanup tracking
        const listeners = state.inventory.map(item => {
          // Check if already listening to this item
          if (state.activeItemListeners.has(item.id)) {
            console.log(`⚠️ Already listening to item ${item.id}, skipping...`);
            return null;
          }

          const itemRef = doc(db, 'items', item.id);

          const unsubscribe = onSnapshot(itemRef, (docSnapshot) => {
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
              commit('REMOVE_INVENTORY_ITEM', item.id);
              commit('CLEAR_ITEM_CACHE', item.id);
              commit('REMOVE_ITEM_LISTENER', item.id);
            }
          }, (error) => {
            console.error(`❌ Real-time error for item ${item.id}:`, error);
            commit('REMOVE_ITEM_LISTENER', item.id);
          });

          // Track this listener
          commit('ADD_ITEM_LISTENER', item.id);
          return unsubscribe;
        }).filter(Boolean); // Remove null entries

        // Store valid listeners
        listeners.forEach(listener => commit('ADD_REALTIME_LISTENER', listener));

        console.log(`✅ Real-time updates set up for ${listeners.length} items`);

      } catch (error) {
        console.error('❌ Error setting up real-time updates:', error);
      }
    },

    async setupRealtimeUpdatesForItems({ commit, state }, itemIds) {
      if (!state.realtimeMode || !itemIds || itemIds.length === 0) return;

      try {
        console.log(`🔴 Setting up real-time for ${itemIds.length} items`);

        const listeners = itemIds.map(itemId => {
          // Skip if already listening
          if (state.activeItemListeners.has(itemId)) {
            return null;
          }

          const itemRef = doc(db, 'items', itemId);

          const unsubscribe = onSnapshot(itemRef, (docSnapshot) => {
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
              commit('REMOVE_ITEM_LISTENER', itemId);
            }
          });

          commit('ADD_ITEM_LISTENER', itemId);
          return unsubscribe;
        }).filter(Boolean);

        listeners.forEach(listener => commit('ADD_REALTIME_LISTENER', listener));

      } catch (error) {
        console.error('❌ Error setting up real-time updates for items:', error);
      }
    },

    async searchInventory({ commit, state, dispatch }, searchParams) {
      commit('SET_INVENTORY_LOADING', true);
      commit('SET_INVENTORY_ERROR', null);
      commit('RESET_PAGINATION');

      try {
        const { search, warehouse, searchField = 'name' } = searchParams || {};

        commit('SET_FILTERS', { search, warehouse, searchField });

        if (!state.userProfile) {
          throw new Error('User not authenticated');
        }

        const itemsRef = collection(db, 'items');
        let itemsQuery;

        if (state.userProfile.role === 'superadmin' || state.userProfile.role === 'company_manager') {
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

        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        commit('SET_PAGINATION', {
          lastDoc,
          hasMore: snapshot.size === (search ? PERFORMANCE_CONFIG.SEARCH_LIMIT : PERFORMANCE_CONFIG.INITIAL_LOAD),
          totalLoaded: inventory.length
        });

        commit('SET_INVENTORY', inventory);
        commit('SET_INVENTORY_LOADED', true);

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

    async clearFiltersAndShowAll({ dispatch }) {
      await dispatch('searchInventory', {});
    },

    async refreshInventory({ dispatch }) {
      console.log('🔄 Refreshing inventory...');
      await dispatch('clearRealtimeUpdates');
      return await dispatch('loadAllInventory', { forceRefresh: true });
    },

    async clearRealtimeUpdates({ commit }) {
      console.log('🧹 Clearing real-time listeners...');
      commit('CLEAR_REALTIME_LISTENERS');
    },

    async getItem({ commit, state, dispatch }, itemId) {
      try {
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

        if (!itemData.name?.trim() || !itemData.code?.trim() || !itemData.warehouse_id) {
          throw new Error('جميع الحقول المطلوبة يجب أن تكون مملوءة (الاسم، الكود، المخزن)');
        }

        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
            if (!allowedWarehouses.includes(itemData.warehouse_id)) {
              throw new Error('ليس لديك صلاحية لإضافة أصناف في هذا المخزن');
            }
          }
        }

        const totalQuantity = InventoryService.calculateTotalQuantity(
          itemData.cartons_count || 0,
          itemData.per_carton_count || 12,
          itemData.single_bottles_count || 0
        );

        if (totalQuantity <= 0 && isAddingCartons) {
          throw new Error('يجب إدخال كمية صحيحة');
        }

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

        const docRef = await addDoc(collection(db, 'items'), cleanData);

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

        const itemRef = doc(db, 'items', itemId);
        const itemDoc = await getDoc(itemRef);

        if (!itemDoc.exists()) {
          throw new Error('الصنف غير موجود');
        }

        const existingItem = itemDoc.data();

        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          const warehouseId = itemData.warehouse_id || existingItem.warehouse_id;
          if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
            if (!allowedWarehouses.includes(warehouseId)) {
              throw new Error('ليس لديك صلاحية لتعديل أصناف في هذا المخزن');
            }
          }
        }

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

        await updateDoc(itemRef, updateData);

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

    async deleteItem({ commit, state, dispatch }, itemId) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        if (state.userProfile.role === 'superadmin') {
        } else if (state.userProfile.role === 'warehouse_manager') {
          const canDelete = state.userProfile.permissions?.includes('full_access') || 
                           state.userProfile.permissions?.includes('delete_items');
          if (!canDelete) {
            throw new Error('ليس لديك صلاحية لحذف الأصناف');
          }
        } else {
          throw new Error('ليس لديك صلاحية لحذف الأصناف');
        }

        const itemRef = doc(db, 'items', itemId);
        const itemDoc = await getDoc(itemRef);

        if (!itemDoc.exists()) {
          throw new Error('الصنف غير موجود');
        }

        const itemData = itemDoc.data();

        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
            if (!allowedWarehouses.includes(itemData.warehouse_id)) {
              throw new Error('ليس لديك صلاحية لحذف أصناف من هذا المخزن');
            }
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
          timestamp: serverTimestamp(),
          notes: 'حذف الصنف نهائياً',
          created_by: state.userProfile?.name || state.user?.email || 'نظام'
        };

        await addDoc(collection(db, 'transactions'), transactionData);

        await deleteDoc(itemRef);

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

    async transferItem({ commit, state, dispatch }, transferData) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        if (!['superadmin', 'warehouse_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لنقل الأصناف');
        }

        if (!transferData.item_id || !transferData.from_warehouse_id || !transferData.to_warehouse_id) {
          throw new Error('بيانات النقل غير مكتملة');
        }

        if (transferData.from_warehouse_id === transferData.to_warehouse_id) {
          throw new Error('لا يمكن نقل الصنف إلى نفس المخزن');
        }

        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
            if (!allowedWarehouses.includes(transferData.from_warehouse_id) ||
                !allowedWarehouses.includes(transferData.to_warehouse_id)) {
              throw new Error('ليس لديك صلاحية للنقل من/إلى هذه المخازن');
            }
          }
        }

        const itemRef = doc(db, 'items', transferData.item_id);
        const itemDoc = await getDoc(itemRef);

        if (!itemDoc.exists()) {
          throw new Error('الصنف غير موجود');
        }

        const itemData = itemDoc.data();

        if (itemData.warehouse_id !== transferData.from_warehouse_id) {
          throw new Error('الصنف ليس في المخزن المصدر المحدد');
        }

        const availableQuantity = itemData.remaining_quantity || 0;
        const transferQuantity = (transferData.cartons_count || 0) * (transferData.per_carton_count || 0) + 
                                (transferData.single_bottles_count || 0);

        if (transferQuantity > availableQuantity) {
          throw new Error('الكمية المطلوبة للنقل أكبر من الكمية المتاحة');
        }

        const newQuantity = availableQuantity - transferQuantity;

        const updateData = {
          warehouse_id: transferData.to_warehouse_id,
          remaining_quantity: newQuantity,
          updated_at: serverTimestamp(),
          updated_by: state.user.uid
        };

        await updateDoc(itemRef, updateData);

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

    async dispatchItem({ commit, state, dispatch }, dispatchData) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        if (!['superadmin', 'warehouse_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لصرف الأصناف');
        }

        if (!dispatchData.item_id || !dispatchData.from_warehouse_id || !dispatchData.destination) {
          throw new Error('بيانات الصرف غير مكتملة');
        }

        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
            if (!allowedWarehouses.includes(dispatchData.from_warehouse_id)) {
              throw new Error('ليس لديك صلاحية للصرف من هذا المخزن');
            }
          }
        }

        const itemRef = doc(db, 'items', dispatchData.item_id);
        const itemDoc = await getDoc(itemRef);

        if (!itemDoc.exists()) {
          throw new Error('الصنف غير موجود');
        }

        const itemData = itemDoc.data();

        if (itemData.warehouse_id !== dispatchData.from_warehouse_id) {
          throw new Error('الصنف ليس في المخزن المصدر المحدد');
        }

        const availableQuantity = itemData.remaining_quantity || 0;
        const dispatchQuantity = (dispatchData.cartons_count || 0) * (dispatchData.per_carton_count || 0) + 
                               (dispatchData.single_bottles_count || 0);

        if (dispatchQuantity > availableQuantity) {
          throw new Error('الكمية المطلوبة للصرف أكبر من الكمية المتاحة');
        }

        const newQuantity = availableQuantity - dispatchQuantity;

        const updateData = {
          remaining_quantity: newQuantity,
          updated_at: serverTimestamp(),
          updated_by: state.user.uid
        };

        await updateDoc(itemRef, updateData);

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

    async initializeAuth({ commit, dispatch }) {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            commit('SET_USER', user);

            try {
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

                await dispatch('loadWarehouses');
                await dispatch('loadAllInventory');
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
            commit('RESET_STATE');
            commit('SET_USER', null);
            commit('SET_USER_PROFILE', null);
          }
          resolve();
        });
      });
    },

    async login({ commit, dispatch }, { email, password }) {
      commit('SET_LOADING', true);
      commit('SET_AUTH_ERROR', null);

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

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

    removeNotification({ commit }, notificationId) {
      commit('REMOVE_NOTIFICATION', notificationId);
    },

    clearNotifications({ commit }) {
      commit('CLEAR_NOTIFICATIONS');
    },

    async searchItems({ state, dispatch }, { searchTerm, limitResults = 5 }) {
      try {
        console.log('🔍 General search:', searchTerm);
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
          console.log('✅ Items found in loaded inventory:', localResults.length);
          return localResults;
        }
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

        const { createUserWithEmailAndPassword } = await import('firebase/auth');
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);

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

        await deleteDoc(doc(db, 'users', userId));

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

        const itemsRef = collection(db, 'items');
        const q = query(itemsRef, where('warehouse_id', '==', warehouseId), limit(1));
        const itemsSnapshot = await getDocs(q);

        if (!itemsSnapshot.empty) {
          throw new Error('لا يمكن حذف المخزن لأنه يحتوي على أصناف. يجب نقل الأصناف أولاً.');
        }

        const warehouseRef = doc(db, 'warehouses', warehouseId);
        await deleteDoc(warehouseRef);

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
      return await dispatch('loadAllInventory');
    },

    async fetchInventoryOnce({ dispatch }) {
      console.log('📦 Using loadAllInventory');
      return await dispatch('loadAllInventory');
    },

    // ============================================
    // INVOICE SYSTEM ACTIONS
    // ============================================

    async loadAllInvoices({ commit, state, dispatch }, { forceRefresh = false } = {}) {
      if (state.invoicesLoading) {
        console.log('Invoice load already in progress');
        return state.invoices;
      }

      if (state.invoicesLoaded && !forceRefresh) {
        console.log('Invoices already loaded');
        return state.invoices;
      }

      commit('SET_INVOICES_LOADING', true);
      commit('SET_INVOICES_ERROR', null);
      commit('RESET_INVOICE_PAGINATION');

      try {
        console.log('🔄 Loading ALL invoices...');

        if (!state.userProfile) {
          throw new Error('User not authenticated');
        }

        // Check user permissions based on Firebase rules
        if (!['superadmin', 'warehouse_manager', 'company_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لعرض الفواتير');
        }

        const invoicesRef = collection(db, 'invoices');
        const q = query(
          invoicesRef,
          orderBy('createdAt', 'desc'),
          limit(PERFORMANCE_CONFIG.INVOICE_LOAD_LIMIT)
        );

        const snapshot = await getDocs(q);
        console.log(`✅ Initial invoices loaded: ${snapshot.size} invoices`);

        const invoices = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date?.toDate?.() || data.date
          };
        });

        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        commit('SET_INVOICE_PAGINATION', {
          lastDoc,
          hasMore: snapshot.size === PERFORMANCE_CONFIG.INVOICE_LOAD_LIMIT,
          totalLoaded: invoices.length
        });

        commit('SET_INVOICES', invoices);
        commit('SET_INVOICES_LOADED', true);
        commit('CALCULATE_INVOICE_STATS');

        console.log(`🎉 Invoices loaded successfully: ${invoices.length} invoices`);
        return invoices;

      } catch (error) {
        console.error('❌ Error loading invoices:', error);
        commit('SET_INVOICES_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تحميل الفواتير'
        });

        return [];
      } finally {
        commit('SET_INVOICES_LOADING', false);
      }
    },

    async searchInvoices({ commit, state, dispatch }, searchParams) {
      commit('SET_INVOICES_LOADING', true);
      commit('SET_INVOICES_ERROR', null);
      commit('RESET_INVOICE_PAGINATION');

      try {
        const { search, status, type, dateFrom, dateTo } = searchParams || {};

        commit('SET_INVOICE_FILTERS', { search, status, type, dateFrom, dateTo });

        if (!state.userProfile) {
          throw new Error('User not authenticated');
        }

        if (!['superadmin', 'warehouse_manager', 'company_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لعرض الفواتير');
        }

        const invoicesRef = collection(db, 'invoices');
        let invoicesQuery;

        // Start with base query
        if (search && search.length >= 2) {
          // Search by invoice number or customer name
          invoicesQuery = query(
            invoicesRef,
            orderBy('invoiceNumber'),
            limit(PERFORMANCE_CONFIG.SEARCH_LIMIT)
          );
        } else {
          invoicesQuery = query(
            invoicesRef,
            orderBy('createdAt', 'desc'),
            limit(PERFORMANCE_CONFIG.INVOICE_LOAD_LIMIT)
          );
        }

        const snapshot = await getDocs(invoicesQuery);
        console.log(`🔍 Invoice search found: ${snapshot.size} invoices`);

        // Apply filters locally
        let invoices = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date?.toDate?.() || data.date
          };
        });

        // Apply search filter
        if (search && search.length >= 2) {
          const searchLower = search.toLowerCase();
          invoices = invoices.filter(invoice => 
            invoice.invoiceNumber.toString().includes(searchLower) ||
            invoice.customer?.name?.toLowerCase().includes(searchLower) ||
            invoice.customer?.phone?.includes(searchLower)
          );
        }

        // Apply status filter
        if (status) {
          invoices = invoices.filter(invoice => invoice.status === status);
        }

        // Apply type filter
        if (type) {
          invoices = invoices.filter(invoice => invoice.type === type);
        }

        // Apply date filters
        if (dateFrom) {
          const fromDate = new Date(dateFrom);
          invoices = invoices.filter(invoice => {
            const invoiceDate = invoice.date instanceof Date ? invoice.date : new Date(invoice.date);
            return invoiceDate >= fromDate;
          });
        }

        if (dateTo) {
          const toDate = new Date(dateTo);
          toDate.setHours(23, 59, 59, 999);
          invoices = invoices.filter(invoice => {
            const invoiceDate = invoice.date instanceof Date ? invoice.date : new Date(invoice.date);
            return invoiceDate <= toDate;
          });
        }

        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        commit('SET_INVOICE_PAGINATION', {
          lastDoc,
          hasMore: snapshot.size === (search ? PERFORMANCE_CONFIG.SEARCH_LIMIT : PERFORMANCE_CONFIG.INVOICE_LOAD_LIMIT),
          totalLoaded: invoices.length
        });

        commit('SET_INVOICES', invoices);
        commit('SET_INVOICES_LOADED', true);
        commit('CALCULATE_INVOICE_STATS');

        return invoices;

      } catch (error) {
        console.error('❌ Error searching invoices:', error);
        commit('SET_INVOICES_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في البحث عن الفواتير'
        });

        return [];
      } finally {
        commit('SET_INVOICES_LOADING', false);
      }
    },

    async createInvoice({ commit, state, dispatch }, invoiceData) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        // Check user permissions based on Firebase rules
        if (!['superadmin', 'warehouse_manager', 'company_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لإنشاء فواتير');
        }

        // Validate required fields
        if (!invoiceData.customer?.name?.trim() || !invoiceData.customer?.phone?.trim()) {
          throw new Error('جميع الحقول المطلوبة يجب أن تكون مملوءة (اسم العميل، الهاتف)');
        }

        if (!invoiceData.items || invoiceData.items.length === 0) {
          throw new Error('يجب إضافة أصناف على الأقل للفاتورة');
        }

        if (!invoiceData.warehouseId) {
          throw new Error('يجب تحديد المخزن');
        }

        // Validate phone number
        const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
        if (!phoneRegex.test(invoiceData.customer.phone)) {
          throw new Error('يرجى إدخال رقم هاتف صحيح (مثال: 01012345678)');
        }

        // Validate tax ID for B2B invoices
        if (invoiceData.type === 'B2B' && (!invoiceData.customer.taxId || invoiceData.customer.taxId.length < 9)) {
          throw new Error('يرجى إدخال رقم ضريبي صالح (9 أرقام على الأقل) للفواتير الضريبية');
        }

        // Calculate totals
        const subtotal = invoiceData.items.reduce((sum, item) => {
          const price = item.unitPrice || 0;
          const quantity = item.quantity || 0;
          return sum + (price * quantity);
        }, 0);

        const discount = invoiceData.items.reduce((sum, item) => {
          const price = item.unitPrice || 0;
          const quantity = item.quantity || 0;
          const discountPercent = item.discount || 0;
          return sum + ((price * quantity) * (discountPercent / 100));
        }, 0);

        const tax = (invoiceData.type === 'B2B' || invoiceData.type === 'B2C') ? (subtotal - discount) * 0.14 : 0;
        const total = subtotal - discount + tax;

        // Generate invoice number
        const lastInvoice = state.invoices[0];
        const lastNumber = lastInvoice ? lastInvoice.invoiceNumber : 0;
        const invoiceNumber = lastNumber + 1;

        // Prepare invoice data for Firestore
        const cleanInvoiceData = {
          invoiceNumber,
          type: invoiceData.type,
          paymentMethod: invoiceData.paymentMethod,
          customer: {
            name: invoiceData.customer.name.trim(),
            phone: invoiceData.customer.phone.trim(),
            taxId: invoiceData.customer.taxId?.trim() || '',
            address: invoiceData.customer.address?.trim() || ''
          },
          items: invoiceData.items.map(item => ({
            id: item.id,
            name: item.name,
            code: item.code,
            unitPrice: Number(item.unitPrice) || 0,
            quantity: Number(item.quantity) || 0,
            discount: Number(item.discount) || 0,
            total: Number(item.total) || 0,
            warehouseId: item.warehouseId
          })),
          warehouseId: invoiceData.warehouseId,
          notes: invoiceData.notes?.trim() || '',
          status: 'draft',
          subtotal,
          discount,
          taxAmount: tax,
          totalAmount: total,
          date: Timestamp.now(),
          createdBy: state.userProfile?.name || state.user?.email || 'نظام',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };

        // Create invoice document
        const docRef = await addDoc(collection(db, 'invoices'), cleanInvoiceData);

        // Update inventory quantities
        const batch = writeBatch(db);
        
        for (const item of invoiceData.items) {
          if (item.id) {
            const itemRef = doc(db, 'items', item.id);
            batch.update(itemRef, {
              remaining_quantity: increment(-(item.quantity || 0))
            });
          }
        }

        await batch.commit();

        // Create transaction record for inventory update
        const transactionData = {
          type: 'INVOICE',
          item_id: invoiceData.items[0]?.id || 'multiple',
          item_name: `فاتورة #${invoiceNumber}`,
          item_code: `INV-${invoiceNumber}`,
          from_warehouse: invoiceData.warehouseId,
          to_warehouse: null,
          cartons_delta: 0,
          per_carton_updated: 0,
          single_delta: 0,
          total_delta: -invoiceData.items.reduce((sum, item) => sum + (item.quantity || 0), 0),
          new_remaining: 0, // Will be updated by real-time listeners
          user_id: state.user.uid,
          timestamp: Timestamp.now(),
          notes: `فاتورة مبيعات #${invoiceNumber} - ${invoiceData.customer.name}`,
          created_by: state.userProfile?.name || state.user?.email || 'نظام'
        };

        await addDoc(collection(db, 'transactions'), transactionData);

        const newInvoice = {
          id: docRef.id,
          ...cleanInvoiceData
        };

        commit('ADD_INVOICE', newInvoice);
        commit('ADD_RECENT_TRANSACTION', transactionData);
        commit('CALCULATE_INVOICE_STATS');

        dispatch('showNotification', {
          type: 'success',
          message: `تم إنشاء الفاتورة #${invoiceNumber} بنجاح`
        });

        return { success: true, invoiceId: docRef.id, invoiceNumber };

      } catch (error) {
        console.error('❌ Error creating invoice:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في إنشاء الفاتورة'
        });

        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async updateInvoice({ commit, state, dispatch }, { invoiceId, invoiceData }) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        // Check user permissions based on Firebase rules
        if (!['superadmin', 'warehouse_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لتعديل الفواتير');
        }

        // Get existing invoice
        const invoiceRef = doc(db, 'invoices', invoiceId);
        const invoiceDoc = await getDoc(invoiceRef);

        if (!invoiceDoc.exists()) {
          throw new Error('الفاتورة غير موجودة');
        }

        const existingInvoice = invoiceDoc.data();

        // Only allow updates to draft invoices
        if (existingInvoice.status !== 'draft') {
          throw new Error('لا يمكن تعديل فاتورة غير مسودة');
        }

        // Validate required fields
        if (!invoiceData.customer?.name?.trim() || !invoiceData.customer?.phone?.trim()) {
          throw new Error('جميع الحقول المطلوبة يجب أن تكون مملوءة (اسم العميل، الهاتف)');
        }

        if (!invoiceData.items || invoiceData.items.length === 0) {
          throw new Error('يجب إضافة أصناف على الأقل للفاتورة');
        }

        if (!invoiceData.warehouseId) {
          throw new Error('يجب تحديد المخزن');
        }

        // Calculate new totals
        const subtotal = invoiceData.items.reduce((sum, item) => {
          const price = item.unitPrice || 0;
          const quantity = item.quantity || 0;
          return sum + (price * quantity);
        }, 0);

        const discount = invoiceData.items.reduce((sum, item) => {
          const price = item.unitPrice || 0;
          const quantity = item.quantity || 0;
          const discountPercent = item.discount || 0;
          return sum + ((price * quantity) * (discountPercent / 100));
        }, 0);

        const tax = (invoiceData.type === 'B2B' || invoiceData.type === 'B2C') ? (subtotal - discount) * 0.14 : 0;
        const total = subtotal - discount + tax;

        // Prepare update data
        const updateData = {
          type: invoiceData.type,
          paymentMethod: invoiceData.paymentMethod,
          customer: {
            name: invoiceData.customer.name.trim(),
            phone: invoiceData.customer.phone.trim(),
            taxId: invoiceData.customer.taxId?.trim() || '',
            address: invoiceData.customer.address?.trim() || ''
          },
          items: invoiceData.items.map(item => ({
            id: item.id,
            name: item.name,
            code: item.code,
            unitPrice: Number(item.unitPrice) || 0,
            quantity: Number(item.quantity) || 0,
            discount: Number(item.discount) || 0,
            total: Number(item.total) || 0,
            warehouseId: item.warehouseId
          })),
          warehouseId: invoiceData.warehouseId,
          notes: invoiceData.notes?.trim() || '',
          subtotal,
          discount,
          taxAmount: tax,
          totalAmount: total,
          updatedAt: Timestamp.now()
        };

        await updateDoc(invoiceRef, updateData);

        const updatedInvoice = {
          id: invoiceId,
          ...existingInvoice,
          ...updateData
        };

        commit('UPDATE_INVOICE', updatedInvoice);
        commit('CALCULATE_INVOICE_STATS');

        dispatch('showNotification', {
          type: 'success',
          message: `تم تحديث الفاتورة #${existingInvoice.invoiceNumber} بنجاح`
        });

        return { success: true, invoiceId };

      } catch (error) {
        console.error('❌ Error updating invoice:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في تحديث الفاتورة'
        });

        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async deleteInvoice({ commit, state, dispatch }, invoiceId) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        // Check user permissions based on Firebase rules
        if (!['superadmin', 'warehouse_manager', 'company_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لحذف الفواتير');
        }

        // Get existing invoice
        const invoiceRef = doc(db, 'invoices', invoiceId);
        const invoiceDoc = await getDoc(invoiceRef);

        if (!invoiceDoc.exists()) {
          throw new Error('الفاتورة غير موجودة');
        }

        const existingInvoice = invoiceDoc.data();

        // Only allow deletion of draft invoices
        if (existingInvoice.status !== 'draft') {
          throw new Error('لا يمكن حذف فاتورة غير مسودة');
        }

        const confirmDelete = confirm('هل أنت متأكد من حذف هذه الفاتورة؟');
        if (!confirmDelete) {
          return { success: false, message: 'تم إلغاء العملية' };
        }

        // First, restore inventory quantities
        if (existingInvoice.items && Array.isArray(existingInvoice.items)) {
          const batch = writeBatch(db);
          
          for (const item of existingInvoice.items) {
            if (item.id) {
              const itemRef = doc(db, 'items', item.id);
              batch.update(itemRef, {
                remaining_quantity: increment(item.quantity || 0)
              });
            }
          }
          
          await batch.commit();
        }

        // Delete the invoice
        await deleteDoc(invoiceRef);

        commit('REMOVE_INVOICE', invoiceId);
        commit('CALCULATE_INVOICE_STATS');

        dispatch('showNotification', {
          type: 'success',
          message: `تم حذف الفاتورة #${existingInvoice.invoiceNumber} بنجاح`
        });

        return { success: true, message: 'تم حذف الفاتورة بنجاح' };

      } catch (error) {
        console.error('❌ Error deleting invoice:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في حذف الفاتورة'
        });

        return { success: false, error: error.message };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async updateInvoiceStatus({ commit, state, dispatch }, { invoiceId, status }) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        // Check user permissions based on Firebase rules
        if (!['superadmin', 'warehouse_manager', 'company_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لتغيير حالة الفواتير');
        }

        const invoiceRef = doc(db, 'invoices', invoiceId);
        const invoiceDoc = await getDoc(invoiceRef);

        if (!invoiceDoc.exists()) {
          throw new Error('الفاتورة غير موجودة');
        }

        const existingInvoice = invoiceDoc.data();

        await updateDoc(invoiceRef, {
          status,
          updatedAt: Timestamp.now()
        });

        const updatedInvoice = {
          id: invoiceId,
          ...existingInvoice,
          status
        };

        commit('UPDATE_INVOICE', updatedInvoice);
        commit('CALCULATE_INVOICE_STATS');

        const statusLabels = {
          'draft': 'مسودة',
          'issued': 'صادرة',
          'paid': 'مدفوعة',
          'cancelled': 'ملغية'
        };

        dispatch('showNotification', {
          type: 'success',
          message: `تم تغيير حالة الفاتورة #${existingInvoice.invoiceNumber} إلى ${statusLabels[status] || status}`
        });

        return { success: true, invoiceId };

      } catch (error) {
        console.error('❌ Error updating invoice status:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في تغيير حالة الفاتورة'
        });

        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async getInvoiceById({ commit, state, dispatch }, invoiceId) {
      try {
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        if (!['superadmin', 'warehouse_manager', 'company_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لعرض الفواتير');
        }

        const invoiceRef = doc(db, 'invoices', invoiceId);
        const invoiceDoc = await getDoc(invoiceRef);

        if (!invoiceDoc.exists()) {
          throw new Error('الفاتورة غير موجودة');
        }

        const invoiceData = invoiceDoc.data();
        
        return {
          id: invoiceDoc.id,
          ...invoiceData,
          date: invoiceData.date?.toDate?.() || invoiceData.date
        };

      } catch (error) {
        console.error('❌ Error getting invoice:', error);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'خطأ في تحميل الفاتورة'
        });
        throw error;
      }
    },

    async exportInvoicesToExcel({ state, dispatch }, { filters = {} } = {}) {
      try {
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        if (!['superadmin', 'company_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لتصدير الفواتير');
        }

        // Get filtered invoices
        let invoicesToExport = state.invoices;

        // Apply filters if provided
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          invoicesToExport = invoicesToExport.filter(invoice => 
            invoice.invoiceNumber.toString().includes(searchLower) ||
            invoice.customer?.name?.toLowerCase().includes(searchLower) ||
            invoice.customer?.phone?.includes(searchLower)
          );
        }

        if (filters.status) {
          invoicesToExport = invoicesToExport.filter(invoice => invoice.status === filters.status);
        }

        if (filters.type) {
          invoicesToExport = invoicesToExport.filter(invoice => invoice.type === filters.type);
        }

        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          invoicesToExport = invoicesToExport.filter(invoice => {
            const invoiceDate = invoice.date instanceof Date ? invoice.date : new Date(invoice.date);
            return invoiceDate >= fromDate;
          });
        }

        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          toDate.setHours(23, 59, 59, 999);
          invoicesToExport = invoicesToExport.filter(invoice => {
            const invoiceDate = invoice.date instanceof Date ? invoice.date : new Date(invoice.date);
            return invoiceDate <= toDate;
          });
        }

        if (invoicesToExport.length === 0) {
          dispatch('showNotification', {
            type: 'warning',
            message: 'لا توجد فواتير للتصدير'
          });
          return;
        }

        // Prepare data for Excel
        const exportData = invoicesToExport.map(invoice => {
          const invoiceDate = invoice.date instanceof Date ? invoice.date : new Date(invoice.date);
          
          return {
            'رقم الفاتورة': invoice.invoiceNumber,
            'التاريخ': invoiceDate.toLocaleDateString('ar-EG'),
            'نوع الفاتورة': getInvoiceTypeLabel(invoice.type),
            'حالة الفاتورة': getInvoiceStatusLabel(invoice.status),
            'اسم العميل': invoice.customer.name,
            'هاتف العميل': invoice.customer.phone,
            'الرقم الضريبي': invoice.customer.taxId || '',
            'عدد الأصناف': invoice.items?.length || 0,
            'المجموع': invoice.subtotal || 0,
            'الخصم': invoice.discount || 0,
            'الضريبة': invoice.taxAmount || 0,
            'الإجمالي': invoice.totalAmount || 0,
            'طريقة الدفع': getPaymentMethodLabel(invoice.paymentMethod),
            'ملاحظات': invoice.notes || ''
          };
        });

        // Create workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Set column widths
        const wscols = [
          { wch: 12 }, // رقم الفاتورة
          { wch: 12 }, // التاريخ
          { wch: 15 }, // نوع الفاتورة
          { wch: 12 }, // حالة الفاتورة
          { wch: 20 }, // اسم العميل
          { wch: 15 }, // هاتف العميل
          { wch: 15 }, // الرقم الضريبي
          { wch: 10 }, // عدد الأصناف
          { wch: 15 }, // المجموع
          { wch: 15 }, // الخصم
          { wch: 15 }, // الضريبة
          { wch: 15 }, // الإجمالي
          { wch: 10 }, // طريقة الدفع
          { wch: 30 }  // ملاحظات
        ];
        ws['!cols'] = wscols;

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'الفواتير');

        // Generate filename with current date
        const filename = `الفواتير_${new Date().toISOString().split('T')[0]}.xlsx`;

        // Download file
        XLSX.writeFile(wb, filename);

        dispatch('showNotification', {
          type: 'success',
          message: `تم تصدير ${exportData.length} فاتورة بنجاح`
        });

      } catch (error) {
        console.error('❌ Error exporting invoices:', error);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في تصدير الفواتير'
        });
      }
    },

    async refreshInvoices({ dispatch }) {
      console.log('🔄 Refreshing invoices...');
      return await dispatch('loadAllInvoices', { forceRefresh: true });
    },

    async clearInvoiceFilters({ commit, dispatch }) {
      commit('CLEAR_INVOICE_FILTERS');
      await dispatch('loadAllInvoices');
    }
  },

  getters: {
    isAuthenticated: state => !!state.user,
    userRole: state => state.userProfile?.role || '',
    userName: state => state.userProfile?.name || '',
    userProfile: state => state.userProfile,
    allowedWarehouses: state => Array.isArray(state.userProfile?.allowed_warehouses) ? 
      state.userProfile.allowed_warehouses : [],
    userPermissions: state => Array.isArray(state.userProfile?.permissions) ? 
      state.userProfile.permissions : [],
    authError: state => state.authError,
    operationError: state => state.operationError,
    operationLoading: state => state.operationLoading,
    inventoryError: state => state.inventoryError,
    fieldMappings: state => state.fieldMappings || FIELD_MAPPINGS,
    getArabicLabel: (state) => (fieldName) => {
      const mappings = state.fieldMappings || FIELD_MAPPINGS;
      return mappings.englishToArabic[fieldName] || fieldName;
    },
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
    warehouses: state => state.warehouses,
    warehousesLoaded: state => state.warehousesLoaded,
    primaryWarehouses: state => state.warehouses.filter(w => w.type === 'primary' || !w.type),
    dispatchWarehouses: state => state.warehouses.filter(w => w.type === 'dispatch'),
    mainWarehouse: state => state.warehouses.find(w => w.is_main) || null,
    transactions: state => state.transactions,
    transactionsItems: state => Array.isArray(state.transactions) ? state.transactions : [],
    recentTransactions: state => state.recentTransactions,
    transactionsLoading: state => state.transactionsLoading,
    recentTransactionsLoading: state => state.recentTransactionsLoading,
    notifications: state => state.notifications,
    requiresCompositeIndex: state => state.requiresCompositeIndex,
    allUsers: state => state.allUsers,
    usersLoading: state => state.usersLoading,
    
    // Invoice System Getters
    invoices: state => state.invoices,
    invoicesItems: state => Array.isArray(state.invoices) ? state.invoices : [],
    invoicesCount: state => state.invoices.length,
    invoicesLoading: state => state.invoicesLoading,
    invoicesLoaded: state => state.invoicesLoaded,
    invoicesError: state => state.invoicesError,
    invoiceStats: state => state.invoiceStats,
    filteredInvoices: (state) => {
      let filtered = [...state.invoices];

      // Apply search filter
      if (state.invoiceFilters.search) {
        const searchLower = state.invoiceFilters.search.toLowerCase();
        filtered = filtered.filter(invoice => 
          invoice.invoiceNumber.toString().includes(searchLower) ||
          invoice.customer?.name?.toLowerCase().includes(searchLower) ||
          invoice.customer?.phone?.includes(searchLower)
        );
      }

      // Apply status filter
      if (state.invoiceFilters.status) {
        filtered = filtered.filter(invoice => invoice.status === state.invoiceFilters.status);
      }

      // Apply type filter
      if (state.invoiceFilters.type) {
        filtered = filtered.filter(invoice => invoice.type === state.invoiceFilters.type);
      }

      // Apply date filters
      if (state.invoiceFilters.dateFrom) {
        const fromDate = new Date(state.invoiceFilters.dateFrom);
        filtered = filtered.filter(invoice => {
          const invoiceDate = invoice.date instanceof Date ? invoice.date : new Date(invoice.date);
          return invoiceDate >= fromDate;
        });
      }

      if (state.invoiceFilters.dateTo) {
        const toDate = new Date(state.invoiceFilters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(invoice => {
          const invoiceDate = invoice.date instanceof Date ? invoice.date : new Date(invoice.date);
          return invoiceDate <= toDate;
        });
      }

      return filtered;
    },
    hasInvoiceFilters: (state) => {
      return !!state.invoiceFilters.search || 
             !!state.invoiceFilters.status || 
             !!state.invoiceFilters.type || 
             !!state.invoiceFilters.dateFrom || 
             !!state.invoiceFilters.dateTo;
    },
    canManageInvoices: (state) => {
      if (!state.userProfile) return false;
      return ['superadmin', 'warehouse_manager', 'company_manager'].includes(state.userProfile.role);
    },
    canCreateInvoice: (state) => {
      if (!state.userProfile) return false;
      return ['superadmin', 'warehouse_manager', 'company_manager'].includes(state.userProfile.role);
    },
    canEditInvoice: (state) => {
      if (!state.userProfile) return false;
      return ['superadmin', 'warehouse_manager'].includes(state.userProfile.role);
    },
    canDeleteInvoice: (state) => {
      if (!state.userProfile) return false;
      return ['superadmin', 'warehouse_manager', 'company_manager'].includes(state.userProfile.role);
    },
    canExportInvoices: (state) => {
      if (!state.userProfile) return false;
      return ['superadmin', 'company_manager'].includes(state.userProfile.role);
    },

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
      return accessible.filter(w => w.type === 'primary' || !w.type);
    },
    accessibleDispatchWarehouses: (state, getters) => {
      const accessible = getters.accessibleWarehouses;
      return accessible.filter(w => w.type === 'dispatch');
    },
    dispatchFromWarehouses: (state, getters) => {
      const warehouses = Array.isArray(state.warehouses) ? state.warehouses : [];
      if (!warehouses.length || !state.warehousesLoaded) return [];
      
      const primaryWarehouses = warehouses.filter(w => w.type === 'primary' || !w.type);
      
      if (!state.user) {
        return primaryWarehouses;
      }
      
      const role = getters.userRole;
      if (role === 'superadmin') {
        return primaryWarehouses;
      }
      
      if (role === 'warehouse_manager') {
        const allowedWarehouses = getters.allowedWarehouses;
        if (allowedWarehouses.length > 0) {
          if (allowedWarehouses.includes('all')) {
            return primaryWarehouses;
          }
          return primaryWarehouses.filter(w =>
            allowedWarehouses.includes(w.id)
          );
        }
      }
      
      return [];
    },
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
    getUserDisplayName: (state, getters) => (userId) => {
      if (!userId) return 'نظام';
      if (userId === state.user?.uid) {
        return state.userProfile?.name || state.user?.email || 'نظام';
      }
      return getters.getUserNameById(userId) || userId;
    },
    getTransactionStats: (state) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

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
    filteredTransactions: (state) => (filters = {}) => {
      let filtered = [...state.transactions];

      if (filters.search) {
        const term = filters.search.toLowerCase();
        filtered = filtered.filter(transaction => 
          (transaction.item_name?.toLowerCase() || '').includes(term) ||
          (transaction.item_code?.toLowerCase() || '').includes(term) ||
          (transaction.notes?.toLowerCase() || '').includes(term) ||
          (transaction.user_name?.toLowerCase() || '').includes(term)
        );
      }

      if (filters.type) {
        filtered = filtered.filter(transaction => transaction.type === filters.type);
      }

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
    getTransactionById: (state) => (id) => {
      return state.transactions.find(t => t.id === id);
    },
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
    getTransactionsByWarehouse: (state) => (warehouseId) => {
      return state.transactions.filter(t => 
        t.from_warehouse === warehouseId || t.to_warehouse === warehouseId
      );
    },
    getTransactionsByItem: (state) => (itemId) => {
      return state.transactions.filter(t => t.item_id === itemId);
    },
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
    getCachedItem: (state) => (itemId) => {
      const cached = state.cache.itemDetails[itemId];
      if (cached && (Date.now() - cached.timestamp) < PERFORMANCE_CONFIG.CACHE_DURATION) {
        return cached.data;
      }
      return null;
    },
    getAllWarehouses: (state) => {
      return state.warehouses.map(w => ({
        id: w.id,
        name: w.name_ar || w.name,
        location: w.location || '',
        code: w.code || '',
        type: w.type || 'primary'
      }));
    },
    getInvoiceById: (state) => (invoiceId) => {
      return state.invoices.find(inv => inv.id === invoiceId);
    },
    getInvoiceTypeLabel: () => (type) => {
      const labels = {
        'B2B': 'فاتورة ضريبية (B2B)',
        'B2C': 'فاتورة ضريبية (B2C)',
        'simplified': 'فاتورة مبسطة'
      };
      return labels[type] || type;
    },
    getInvoiceStatusLabel: () => (status) => {
      const labels = {
        'draft': 'مسودة',
        'issued': 'صادرة',
        'paid': 'مدفوعة',
        'cancelled': 'ملغية'
      };
      return labels[status] || status;
    }
  }
});

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

// Helper functions for invoice system
function getInvoiceTypeLabel(type) {
  const labels = {
    'B2B': 'فاتورة ضريبية (B2B)',
    'B2C': 'فاتورة ضريبية (B2C)',
    'simplified': 'فاتورة مبسطة'
  };
  return labels[type] || type;
}

function getInvoiceStatusLabel(status) {
  const labels = {
    'draft': 'مسودة',
    'issued': 'صادرة',
    'paid': 'مدفوعة',
    'cancelled': 'ملغية'
  };
  return labels[status] || status;
}

function getPaymentMethodLabel(method) {
  const labels = {
    'cash': 'نقدي',
    'bank': 'تحويل بنكي',
    'check': 'شيك',
    'credit': 'آجل'
  };
  return labels[method] || method;
}                                     
