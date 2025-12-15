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
  startAfter
} from 'firebase/firestore';
import {
  InventoryService,
  WAREHOUSE_LABELS,
  DESTINATION_LABELS,
  FIELD_LABELS,
  TRANSACTION_TYPES
} from '@/services/inventoryService';
import UserService from '@/services/UserService';

// Performance constants - UPDATED WITH CACHE MANAGEMENT
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
  
  // 🔥 NEW: Cache Management Constants
  CACHE_MAX_SIZE_MB: 4,              // Maximum cache size (4MB)
  CACHE_WARNING_SIZE_MB: 3,          // Warning level (3MB)
  CACHE_AGGRESSIVE_CLEANUP_MB: 3.5,  // Aggressive cleanup threshold
  CACHE_MAX_ITEMS: 100,              // Maximum items in cache
  CACHE_MAX_SEARCHES: 20,            // Maximum cached searches
  CACHE_COMPRESSION_THRESHOLD: 1024 * 1024, // 1MB compression threshold
  CACHE_ROTATION_ENABLED: true,      // Enable FIFO rotation
  CACHE_LRU_ENABLED: true            // Enable LRU cleanup
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

// 🔥 NEW: Helper function to estimate object size
const estimateObjectSize = (obj) => {
  try {
    return new Blob([JSON.stringify(obj)]).size;
  } catch {
    return 0;
  }
};

// 🔥 NEW: Helper to compress item data (remove non-essential fields)
const compressItemData = (item) => {
  if (!item) return item;
  
  // Return only essential fields
  return {
    id: item.id,
    name: item.name,
    code: item.code,
    remaining_quantity: item.remaining_quantity,
    warehouse_id: item.warehouse_id,
    color: item.color,
    supplier: item.supplier,
    item_location: item.item_location,
    // Skip large/less important fields to save space
    // cartons_count: item.cartons_count,
    // per_carton_count: item.per_carton_count,
    // single_bottles_count: item.single_bottles_count,
    // total_added: item.total_added,
    // notes: item.notes,
    // photo_url: item.photo_url,
    // created_at: item.created_at,
    // updated_at: item.updated_at
  };
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

    // 🔥 UPDATED: Performance cache with size tracking
    cache: {
      warehouseLabels: {},
      stats: null,
      statsTimestamp: null,
      itemCache: {}, // Now with size tracking and access info
      itemCacheTimestamp: null,
      transactionItems: [],
      transactionItemsTimestamp: null,
      recentInventory: [],           // Separate cache for recent items
      recentInventoryTimestamp: null,
      
      // 🔥 NEW: Cache management metadata
      cacheStats: {
        totalSize: 0, // in bytes
        itemCount: 0,
        lastCleanup: Date.now(),
        cleanupCount: 0,
        rotationCount: 0,
        pinnedItems: new Set(), // Items to never auto-remove
        frequentlyAccessed: {}, // itemId -> accessCount
        lastAccessed: {} // itemId -> timestamp
      }
    },

    // Loading states
    inventoryLoading: false,
    transactionsLoading: false,
    
    isFetchingInventory: false,

    // Pagination support
    inventoryPagination: {
      lastDoc: null,
      hasMore: false
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

    // 🔥 UPDATED: SET_INVENTORY with FIFO rotation check
    SET_INVENTORY(state, inventory) {
      // Limit to 100 items maximum
      const newInventory = Array.isArray(inventory) ? inventory.slice(0, PERFORMANCE_CONFIG.INVENTORY_PAGE_SIZE) : [];
      
      // Check if we need FIFO rotation (removing old items)
      if (state.inventory.length >= PERFORMANCE_CONFIG.INVENTORY_PAGE_SIZE) {
        console.log('🔄 Performing FIFO rotation: removing oldest 100 items');
        
        // Remove old items from itemCache
        const oldItems = state.inventory.slice(PERFORMANCE_CONFIG.INVENTORY_PAGE_SIZE);
        oldItems.forEach(oldItem => {
          if (oldItem.id && state.cache.itemCache[oldItem.id]) {
            // Only remove if not pinned and not frequently accessed
            const isPinned = state.cache.cacheStats.pinnedItems.has(oldItem.id);
            const isFrequent = state.cache.cacheStats.frequentlyAccessed[oldItem.id] > 5;
            
            if (!isPinned && !isFrequent) {
              const itemSize = estimateObjectSize(state.cache.itemCache[oldItem.id].data);
              state.cache.cacheStats.totalSize -= itemSize;
              delete state.cache.itemCache[oldItem.id];
              delete state.cache.cacheStats.frequentlyAccessed[oldItem.id];
              delete state.cache.cacheStats.lastAccessed[oldItem.id];
              state.cache.cacheStats.itemCount--;
            }
          }
        });
        
        state.cache.cacheStats.rotationCount++;
      }
      
      state.inventory = newInventory;
      state.inventoryLastFetched = Date.now();
      
      // 🔥 Check cache size and perform cleanup if needed
      if (state.cache.cacheStats.totalSize > PERFORMANCE_CONFIG.CACHE_WARNING_SIZE_MB * 1024 * 1024) {
        console.warn(`⚠️ Cache size warning: ${(state.cache.cacheStats.totalSize / 1024 / 1024).toFixed(2)}MB`);
        // Trigger cleanup in next tick to avoid blocking UI
        setTimeout(() => {
          this.commit('PERFORM_CACHE_CLEANUP');
        }, 0);
      }
    },

    APPEND_TO_INVENTORY(state, newItems) {
      if (Array.isArray(newItems)) {
        const existingIds = new Set(state.inventory.map(item => item.id));
        const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));
        
        // Keep only last 100 items (FIFO)
        const allItems = [...state.inventory, ...uniqueNewItems];
        const newTotal = allItems.length;
        
        if (newTotal > PERFORMANCE_CONFIG.INVENTORY_PAGE_SIZE) {
          // Remove oldest items (FIFO)
          const itemsToRemove = allItems.slice(0, newTotal - PERFORMANCE_CONFIG.INVENTORY_PAGE_SIZE);
          itemsToRemove.forEach(item => {
            if (item.id && state.cache.itemCache[item.id]) {
              const isPinned = state.cache.cacheStats.pinnedItems.has(item.id);
              const isFrequent = state.cache.cacheStats.frequentlyAccessed[item.id] > 3;
              
              if (!isPinned && !isFrequent) {
                const itemSize = estimateObjectSize(state.cache.itemCache[item.id].data);
                state.cache.cacheStats.totalSize -= itemSize;
                delete state.cache.itemCache[item.id];
                state.cache.cacheStats.itemCount--;
              }
            }
          });
        }
        
        state.inventory = allItems.slice(-PERFORMANCE_CONFIG.INVENTORY_PAGE_SIZE);
        state.inventoryLastFetched = Date.now();
      }
    },

    SET_INVENTORY_LAST_FETCHED(state, timestamp) {
      state.inventoryLastFetched = timestamp;
    },

    // 🔥 UPDATED: ADD_ITEM with cache size tracking
    ADD_ITEM(state, item) {
      if (item && typeof item === 'object') {
        // Add to beginning (most recent)
        state.inventory.unshift(item);
        
        // Keep only 100 items (FIFO)
        if (state.inventory.length > PERFORMANCE_CONFIG.INVENTORY_PAGE_SIZE) {
          const removedItem = state.inventory.pop();
          // Clean up cache for removed item if not important
          if (removedItem.id && state.cache.itemCache[removedItem.id]) {
            const isPinned = state.cache.cacheStats.pinnedItems.has(removedItem.id);
            if (!isPinned) {
              const itemSize = estimateObjectSize(state.cache.itemCache[removedItem.id].data);
              state.cache.cacheStats.totalSize -= itemSize;
              delete state.cache.itemCache[removedItem.id];
              state.cache.cacheStats.itemCount--;
            }
          }
        }
        
        if (item.id) {
          // Compress item data to save space
          const compressedItem = compressItemData(item);
          const itemSize = estimateObjectSize(compressedItem);
          
          state.cache.itemCache[item.id] = {
            data: compressedItem,
            timestamp: Date.now(),
            size: itemSize
          };
          
          state.cache.cacheStats.totalSize += itemSize;
          state.cache.cacheStats.itemCount++;
          
          // Track access
          state.cache.cacheStats.lastAccessed[item.id] = Date.now();
          state.cache.cacheStats.frequentlyAccessed[item.id] = 
            (state.cache.cacheStats.frequentlyAccessed[item.id] || 0) + 1;
        }
      }
    },

    // 🔥 UPDATED: UPDATE_ITEM with cache management
    UPDATE_ITEM(state, updatedItem) {
      if (!updatedItem || !updatedItem.id) return;

      const index = state.inventory.findIndex(item => item.id === updatedItem.id);
      if (index !== -1) {
        state.inventory.splice(index, 1, updatedItem);
      } else {
        // If not found, add as new item at beginning
        state.inventory.unshift(updatedItem);
        // Keep only 100 items
        if (state.inventory.length > PERFORMANCE_CONFIG.INVENTORY_PAGE_SIZE) {
          const removedItem = state.inventory.pop();
          if (removedItem.id && state.cache.itemCache[removedItem.id]) {
            const isPinned = state.cache.cacheStats.pinnedItems.has(removedItem.id);
            if (!isPinned) {
              const itemSize = estimateObjectSize(state.cache.itemCache[removedItem.id].data);
              state.cache.cacheStats.totalSize -= itemSize;
              delete state.cache.itemCache[removedItem.id];
              state.cache.cacheStats.itemCount--;
            }
          }
        }
      }
      
      // Update cache with compressed data
      const compressedItem = compressItemData(updatedItem);
      const newSize = estimateObjectSize(compressedItem);
      const oldSize = state.cache.itemCache[updatedItem.id]?.size || 0;
      
      state.cache.itemCache[updatedItem.id] = {
        data: compressedItem,
        timestamp: Date.now(),
        size: newSize
      };
      
      state.cache.cacheStats.totalSize += (newSize - oldSize);
      state.cache.cacheStats.lastAccessed[updatedItem.id] = Date.now();
      state.cache.cacheStats.frequentlyAccessed[updatedItem.id] = 
        (state.cache.cacheStats.frequentlyAccessed[updatedItem.id] || 0) + 1;
    },

    REMOVE_ITEM(state, itemId) {
      state.inventory = state.inventory.filter(item => item.id !== itemId);
      
      // Remove from cache and update stats
      if (state.cache.itemCache[itemId]) {
        const itemSize = state.cache.itemCache[itemId].size || 0;
        state.cache.cacheStats.totalSize -= itemSize;
        state.cache.cacheStats.itemCount--;
        delete state.cache.cacheStats.frequentlyAccessed[itemId];
        delete state.cache.cacheStats.lastAccessed[itemId];
        state.cache.cacheStats.pinnedItems.delete(itemId);
      }
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

    // 🔥 UPDATED: SET_TRANSACTION_ITEMS_CACHE with size tracking
    SET_TRANSACTION_ITEMS_CACHE(state, { items, timestamp }) {
      const oldSize = estimateObjectSize(state.cache.transactionItems);
      const newSize = estimateObjectSize(items);
      
      state.cache.transactionItems = items;
      state.cache.transactionItemsTimestamp = timestamp;
      
      // Update cache size
      state.cache.cacheStats.totalSize += (newSize - oldSize);
      
      // Check if we need cleanup
      if (state.cache.cacheStats.totalSize > PERFORMANCE_CONFIG.CACHE_AGGRESSIVE_CLEANUP_MB * 1024 * 1024) {
        this.commit('PERFORM_AGGRESSIVE_CLEANUP');
      }
    },

    SET_INVENTORY_PAGINATION(state, { lastDoc, hasMore }) {
      state.inventoryPagination.lastDoc = lastDoc;
      state.inventoryPagination.hasMore = hasMore;
    },

    RESET_INVENTORY_PAGINATION(state) {
      state.inventoryPagination = {
        lastDoc: null,
        hasMore: false
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

    // 🔥 UPDATED: SET_STATS_CACHE with size tracking
    SET_STATS_CACHE(state, { stats, timestamp }) {
      const oldSize = estimateObjectSize(state.cache.stats);
      const newSize = estimateObjectSize(stats);
      
      state.cache.stats = stats;
      state.cache.statsTimestamp = timestamp;
      state.cache.cacheStats.totalSize += (newSize - oldSize);
    },

    // 🔥 UPDATED: CACHE_ITEM with LRU and size management
    CACHE_ITEM(state, { itemId, itemData }) {
      if (itemId && itemData) {
        // Check if we need to make space first (LRU)
        if (state.cache.cacheStats.itemCount >= PERFORMANCE_CONFIG.CACHE_MAX_ITEMS) {
          this.commit('REMOVE_LEAST_RECENTLY_USED_ITEMS', 10);
        }
        
        // Check cache size
        if (state.cache.cacheStats.totalSize > PERFORMANCE_CONFIG.CACHE_MAX_SIZE_MB * 1024 * 1024 * 0.9) {
          this.commit('PERFORM_CACHE_CLEANUP');
        }
        
        // Compress data before caching
        const compressedData = compressItemData(itemData);
        const itemSize = estimateObjectSize(compressedData);
        
        // Remove old entry if exists
        const oldEntry = state.cache.itemCache[itemId];
        if (oldEntry) {
          state.cache.cacheStats.totalSize -= oldEntry.size || 0;
          state.cache.cacheStats.itemCount--;
        }
        
        // Add new entry
        state.cache.itemCache[itemId] = {
          data: compressedData,
          timestamp: Date.now(),
          size: itemSize
        };
        
        state.cache.cacheStats.totalSize += itemSize;
        state.cache.cacheStats.itemCount++;
        state.cache.cacheStats.lastAccessed[itemId] = Date.now();
      }
    },

    REMOVE_ITEM_FROM_CACHE(state, itemId) {
      if (state.cache.itemCache[itemId]) {
        const itemSize = state.cache.itemCache[itemId].size || 0;
        state.cache.cacheStats.totalSize -= itemSize;
        state.cache.cacheStats.itemCount--;
        delete state.cache.cacheStats.frequentlyAccessed[itemId];
        delete state.cache.cacheStats.lastAccessed[itemId];
        state.cache.cacheStats.pinnedItems.delete(itemId);
      }
      delete state.cache.itemCache[itemId];
    },

    // 🔥 UPDATED: SET_RECENT_INVENTORY_CACHE with FIFO rotation
    SET_RECENT_INVENTORY_CACHE(state, { items, timestamp }) {
      // Store only limited items in cache
      const limitedItems = items.slice(0, PERFORMANCE_CONFIG.RECENT_ITEMS_LIMIT);
      
      // Calculate size and manage FIFO
      const oldSize = estimateObjectSize(state.cache.recentInventory);
      const newSize = estimateObjectSize(limitedItems);
      
      // Update cache stats
      state.cache.cacheStats.totalSize += (newSize - oldSize);
      
      state.cache.recentInventory = limitedItems;
      state.cache.recentInventoryTimestamp = timestamp;
    },

    // 🔥 NEW: Clear cache with size reset
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
        recentInventoryTimestamp: null,
        cacheStats: {
          totalSize: 0,
          itemCount: 0,
          lastCleanup: Date.now(),
          cleanupCount: state.cache.cacheStats.cleanupCount + 1,
          rotationCount: 0,
          pinnedItems: new Set(),
          frequentlyAccessed: {},
          lastAccessed: {}
        }
      };
      state.inventoryLastFetched = null;
    },

    // 🔥 NEW: PERFORM_CACHE_CLEANUP - Smart cleanup at 3MB
    PERFORM_CACHE_CLEANUP(state) {
      const now = Date.now();
      const ONE_HOUR = 60 * 60 * 1000;
      const ONE_DAY = 24 * ONE_HOUR;
      
      console.log('🧹 Performing smart cache cleanup...');
      
      let removedCount = 0;
      let freedSize = 0;
      
      // 1. Clean old search cache (older than 1 hour)
      if (state.cache.transactionItemsTimestamp && 
          (now - state.cache.transactionItemsTimestamp) > ONE_HOUR) {
        const oldSize = estimateObjectSize(state.cache.transactionItems);
        freedSize += oldSize;
        state.cache.transactionItems = [];
        state.cache.transactionItemsTimestamp = null;
        removedCount++;
      }
      
      // 2. Clean old recent inventory cache (older than 30 minutes)
      if (state.cache.recentInventoryTimestamp && 
          (now - state.cache.recentInventoryTimestamp) > (30 * 60 * 1000)) {
        const oldSize = estimateObjectSize(state.cache.recentInventory);
        freedSize += oldSize;
        state.cache.recentInventory = [];
        state.cache.recentInventoryTimestamp = null;
        removedCount++;
      }
      
      // 3. Clean old item cache using LRU (Least Recently Used)
      const itemEntries = Object.entries(state.cache.itemCache);
      if (itemEntries.length > PERFORMANCE_CONFIG.CACHE_MAX_ITEMS * 0.7) {
        // Sort by last accessed time (oldest first)
        const sortedItems = itemEntries
          .map(([id, data]) => ({
            id,
            ...data,
            lastAccessed: state.cache.cacheStats.lastAccessed[id] || data.timestamp,
            accessCount: state.cache.cacheStats.frequentlyAccessed[id] || 0,
            isPinned: state.cache.cacheStats.pinnedItems.has(id)
          }))
          .sort((a, b) => {
            // Keep pinned items
            if (a.isPinned && !b.isPinned) return 1;
            if (!a.isPinned && b.isPinned) return -1;
            
            // Sort by last accessed, then access count
            const timeDiff = a.lastAccessed - b.lastAccessed;
            if (timeDiff !== 0) return timeDiff;
            return a.accessCount - b.accessCount;
          });
        
        // Remove 20% of least used items
        const removeCount = Math.floor(sortedItems.length * 0.2);
        for (let i = 0; i < removeCount; i++) {
          const item = sortedItems[i];
          if (!item.isPinned) { // Don't remove pinned items
            freedSize += item.size || 0;
            delete state.cache.itemCache[item.id];
            delete state.cache.cacheStats.frequentlyAccessed[item.id];
            delete state.cache.cacheStats.lastAccessed[item.id];
            state.cache.cacheStats.itemCount--;
            removedCount++;
          }
        }
      }
      
      // Update total size
      state.cache.cacheStats.totalSize -= freedSize;
      state.cache.cacheStats.lastCleanup = now;
      state.cache.cacheStats.cleanupCount++;
      
      console.log(`✅ Cache cleanup: removed ${removedCount} items, freed ${(freedSize / 1024).toFixed(2)}KB`);
    },

    // 🔥 NEW: PERFORM_AGGRESSIVE_CLEANUP - At 3.5MB
    PERFORM_AGGRESSIVE_CLEANUP(state) {
      console.warn('🚨 Performing aggressive cache cleanup!');
      
      // Clear all non-essential caches
      const oldStatsSize = estimateObjectSize(state.cache.stats);
      const oldTransactionSize = estimateObjectSize(state.cache.transactionItems);
      const oldRecentSize = estimateObjectSize(state.cache.recentInventory);
      
      state.cache.stats = null;
      state.cache.statsTimestamp = null;
      state.cache.transactionItems = [];
      state.cache.transactionItemsTimestamp = null;
      state.cache.recentInventory = [];
      state.cache.recentInventoryTimestamp = null;
      
      // Clear least used item cache (keep only pinned and frequently accessed)
      const itemEntries = Object.entries(state.cache.itemCache);
      let keptItems = 0;
      
      for (const [itemId, itemData] of itemEntries) {
        const isPinned = state.cache.cacheStats.pinnedItems.has(itemId);
        const isFrequent = (state.cache.cacheStats.frequentlyAccessed[itemId] || 0) > 10;
        const isRecent = (Date.now() - (state.cache.cacheStats.lastAccessed[itemId] || 0)) < (60 * 60 * 1000);
        
        if (!isPinned && !isFrequent && !isRecent) {
          state.cache.cacheStats.totalSize -= itemData.size || 0;
          delete state.cache.itemCache[itemId];
          delete state.cache.cacheStats.frequentlyAccessed[itemId];
          delete state.cache.cacheStats.lastAccessed[itemId];
          state.cache.cacheStats.itemCount--;
        } else {
          keptItems++;
        }
      }
      
      // Update total size
      state.cache.cacheStats.totalSize -= (oldStatsSize + oldTransactionSize + oldRecentSize);
      state.cache.cacheStats.lastCleanup = Date.now();
      state.cache.cacheStats.cleanupCount++;
      
      console.log(`🚨 Aggressive cleanup: kept ${keptItems} essential items`);
    },

    // 🔥 NEW: REMOVE_LEAST_RECENTLY_USED_ITEMS - LRU implementation
    REMOVE_LEAST_RECENTLY_USED_ITEMS(state, count = 10) {
      const itemEntries = Object.entries(state.cache.itemCache);
      
      if (itemEntries.length === 0) return;
      
      // Sort by last accessed time (oldest first)
      const sortedItems = itemEntries
        .map(([id, data]) => ({
          id,
          ...data,
          lastAccessed: state.cache.cacheStats.lastAccessed[id] || data.timestamp,
          isPinned: state.cache.cacheStats.pinnedItems.has(id)
        }))
        .sort((a, b) => {
          // Keep pinned items
          if (a.isPinned && !b.isPinned) return 1;
          if (!a.isPinned && b.isPinned) return -1;
          return a.lastAccessed - b.lastAccessed;
        });
      
      // Remove specified number of least recently used items
      const removeCount = Math.min(count, sortedItems.length);
      let freedSize = 0;
      
      for (let i = 0; i < removeCount; i++) {
        const item = sortedItems[i];
        if (!item.isPinned) { // Don't remove pinned items
          freedSize += item.size || 0;
          delete state.cache.itemCache[item.id];
          delete state.cache.cacheStats.frequentlyAccessed[item.id];
          delete state.cache.cacheStats.lastAccessed[item.id];
          state.cache.cacheStats.itemCount--;
        }
      }
      
      state.cache.cacheStats.totalSize -= freedSize;
      console.log(`🔄 LRU cleanup: removed ${removeCount} items, freed ${(freedSize / 1024).toFixed(2)}KB`);
    },

    // 🔥 NEW: PIN_ITEM - Mark item as important (won't be auto-removed)
    PIN_ITEM(state, itemId) {
      state.cache.cacheStats.pinnedItems.add(itemId);
      console.log(`📌 Item ${itemId} pinned to cache`);
    },

    // 🔥 NEW: UNPIN_ITEM - Remove item from pinned list
    UNPIN_ITEM(state, itemId) {
      state.cache.cacheStats.pinnedItems.delete(itemId);
      console.log(`📌 Item ${itemId} unpinned from cache`);
    },

    // 🔥 NEW: TRACK_ITEM_ACCESS - Update access tracking for LRU
    TRACK_ITEM_ACCESS(state, itemId) {
      state.cache.cacheStats.lastAccessed[itemId] = Date.now();
      state.cache.cacheStats.frequentlyAccessed[itemId] = 
        (state.cache.cacheStats.frequentlyAccessed[itemId] || 0) + 1;
    },

    // 🔥 NEW: GET_CACHE_STATS - For monitoring
    UPDATE_CACHE_STATS(state) {
      // This is called by getters, just ensuring stats are updated
      if (state.cache.cacheStats.totalSize > PERFORMANCE_CONFIG.CACHE_MAX_SIZE_MB * 1024 * 1024) {
        console.error(`❌ Cache exceeded limit: ${(state.cache.cacheStats.totalSize / 1024 / 1024).toFixed(2)}MB`);
        this.commit('PERFORM_AGGRESSIVE_CLEANUP');
      }
    }
  },

  actions: {
    // ✅ SMART SEARCH - Now with cache access tracking
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

        // Track access to these items
        localResults.forEach(item => {
          if (item.id) commit('TRACK_ITEM_ACCESS', item.id);
        });

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
            // Track access
            cachedResults.forEach(item => {
              if (item.id) commit('TRACK_ITEM_ACCESS', item.id);
            });
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
            
            // Cache each item individually with compression
            commit('CACHE_ITEM', {
              itemId: doc.id,
              itemData: convertedItem
            });
            
            // Track access
            commit('TRACK_ITEM_ACCESS', doc.id);
            
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
              
              // Cache these items with compression
              filteredItems.forEach(item => {
                commit('CACHE_ITEM', {
                  itemId: item.id,
                  itemData: item
                });
                commit('TRACK_ITEM_ACCESS', item.id);
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
        
        // Track access
        fallbackResults.forEach(item => {
          if (item.id) commit('TRACK_ITEM_ACCESS', item.id);
        });
        
        return fallbackResults;
      }
    },

    // ✅ SMART GET ITEM - Now with cache access tracking
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
          commit('TRACK_ITEM_ACCESS', item.id);
          return item;
        }

        // 2. SECOND: Check item cache
        const cacheEntry = state.cache.itemCache[itemId];
        const cacheDuration = 10 * 60 * 1000;
        
        if (cacheEntry && (Date.now() - cacheEntry.timestamp) < cacheDuration) {
          console.log('✅ Item found in cache');
          commit('TRACK_ITEM_ACCESS', itemId);
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

              // Cache with compression
              commit('CACHE_ITEM', {
                itemId: itemId,
                itemData: convertedItem
              });
              
              commit('TRACK_ITEM_ACCESS', itemId);

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

              // Cache with compression
              commit('CACHE_ITEM', {
                itemId: doc.id,
                itemData: convertedItem
              });
              
              commit('TRACK_ITEM_ACCESS', doc.id);

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

              // Cache with compression
              commit('CACHE_ITEM', {
                itemId: doc.id,
                itemData: convertedItem
              });
              
              commit('TRACK_ITEM_ACCESS', doc.id);

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
          commit('TRACK_ITEM_ACCESS', foundItem.id);
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
        
        // Track access to these items
        localItems.forEach(item => {
          if (item.id) commit('TRACK_ITEM_ACCESS', item.id);
        });
        
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
            
            // Cache with compression
            commit('CACHE_ITEM', {
              itemId: doc.id,
              itemData: convertedItem
            });
            
            // Track access
            commit('TRACK_ITEM_ACCESS', doc.id);
            
            return convertedItem;
          });

          console.log(`✅ Found ${items.length} items in warehouse ${warehouseId}`);
          return items;

        } catch (error) {
          console.warn('Using alternative query...', error);
          
          // Fallback: Use recent inventory and filter
          const recentItems = state.inventory.filter(item => item.warehouse_id === warehouseId);
          recentItems.forEach(item => {
            if (item.id) commit('TRACK_ITEM_ACCESS', item.id);
          });
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

    // 🔥 UPDATED: fetchRecentInventory - Now with cache management
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
          const item = InventoryService.convertForDisplay({
            id: doc.id,
            ...data
          });
          
          // Cache with compression
          commit('CACHE_ITEM', {
            itemId: doc.id,
            itemData: item
          });
          
          // Track access
          commit('TRACK_ITEM_ACCESS', doc.id);
          
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

        // 🔥 This will trigger FIFO rotation if needed
        commit('SET_INVENTORY', inventory);
        
        // Cache the recent inventory
        commit('SET_RECENT_INVENTORY_CACHE', {
          items: inventory,
          timestamp: Date.now()
        });
        
        console.log('✅ Recent inventory ready with', inventory.length, 'items');
        
        // Check cache size after loading
        if (state.cache.cacheStats.totalSize > PERFORMANCE_CONFIG.CACHE_WARNING_SIZE_MB * 1024 * 1024) {
          console.warn(`Cache size after load: ${(state.cache.cacheStats.totalSize / 1024 / 1024).toFixed(2)}MB`);
          setTimeout(() => {
            commit('PERFORM_CACHE_CLEANUP');
          }, 1000);
        }
        
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

    // 🔥 NEW: Refresh inventory with cache management
    async refreshInventoryWithCacheManagement({ commit, dispatch, state }) {
      console.log('🔄 Refreshing inventory with cache management...');
      
      // Check current cache size
      const currentSizeMB = state.cache.cacheStats.totalSize / 1024 / 1024;
      console.log(`Current cache size: ${currentSizeMB.toFixed(2)}MB`);
      
      // If cache is too large, perform cleanup first
      if (currentSizeMB > PERFORMANCE_CONFIG.CACHE_AGGRESSIVE_CLEANUP_MB) {
        console.warn('Cache too large, performing aggressive cleanup before refresh');
        commit('PERFORM_AGGRESSIVE_CLEANUP');
      } else if (currentSizeMB > PERFORMANCE_CONFIG.CACHE_WARNING_SIZE_MB) {
        console.log('Cache large, performing normal cleanup');
        commit('PERFORM_CACHE_CLEANUP');
      }
      
      // Force refresh by clearing timestamp
      commit('SET_INVENTORY_LAST_FETCHED', null);
      
      // Fetch fresh data (this will trigger FIFO rotation)
      const result = await dispatch('fetchRecentInventory');
      
      // Save to localStorage with error handling
      try {
        await dispatch('saveCacheToStorage');
      } catch (error) {
        console.warn('Could not save cache to storage:', error);
        // If quota error, clear some cache
        if (error.name === 'QuotaExceededError') {
          commit('PERFORM_AGGRESSIVE_CLEANUP');
        }
      }
      
      return result;
    },

    // 🔥 NEW: Save cache to localStorage with compression
    async saveCacheToStorage({ state }) {
      try {
        // Prepare minimal cache data for storage
        const storageData = {
          // Store only essential data
          pinnedItems: Array.from(state.cache.cacheStats.pinnedItems),
          frequentlyAccessed: Object.entries(state.cache.cacheStats.frequentlyAccessed)
            .filter(([_, count]) => count > 5)
            .reduce((obj, [id, count]) => {
              obj[id] = count;
              return obj;
            }, {}),
          // Store only essential item data
          essentialItems: Object.entries(state.cache.itemCache)
            .filter(([id, data]) => {
              const isPinned = state.cache.cacheStats.pinnedItems.has(id);
              const isFrequent = (state.cache.cacheStats.frequentlyAccessed[id] || 0) > 10;
              const isRecent = (Date.now() - data.timestamp) < (24 * 60 * 60 * 1000);
              return isPinned || isFrequent || isRecent;
            })
            .slice(0, 50) // Only store top 50 essential items
            .reduce((obj, [id, data]) => {
              obj[id] = {
                data: data.data,
                timestamp: data.timestamp
              };
              return obj;
            }, {}),
          timestamp: Date.now(),
          version: '2.0'
        };
        
        const dataStr = JSON.stringify(storageData);
        const size = new Blob([dataStr]).size;
        
        if (size > 4.5 * 1024 * 1024) {
          console.warn('Cache data too large, compressing further...');
          // Remove less important data
          storageData.essentialItems = {};
          storageData.frequentlyAccessed = {};
          
          const compressedStr = JSON.stringify(storageData);
          const compressedSize = new Blob([compressedStr]).size;
          
          if (compressedSize > 4.5 * 1024 * 1024) {
            throw new Error('Cache data still too large after compression');
          }
        }
        
        localStorage.setItem('inventory_cache', dataStr);
        console.log(`💾 Cache saved to storage (${(size / 1024).toFixed(2)}KB)`);
        
      } catch (error) {
        console.error('Error saving cache to storage:', error);
        
        if (error.name === 'QuotaExceededError') {
          console.error('🚨 Storage quota exceeded! Clearing old cache data...');
          
          // Clear some localStorage data
          const keysToKeep = ['inventory_cache', 'user', 'auth'];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!keysToKeep.includes(key)) {
              localStorage.removeItem(key);
            }
          }
          
          // Try again with minimal data
          const minimalData = {
            pinnedItems: Array.from(state.cache.cacheStats.pinnedItems),
            timestamp: Date.now(),
            version: '2.0'
          };
          
          localStorage.setItem('inventory_cache', JSON.stringify(minimalData));
        }
      }
    },

    // 🔥 NEW: Load cache from localStorage
    async loadCacheFromStorage({ commit }) {
      try {
        const cached = localStorage.getItem('inventory_cache');
        if (!cached) {
          console.log('No cache found in storage');
          return;
        }
        
        const data = JSON.parse(cached);
        
        // Restore pinned items
        if (data.pinnedItems && Array.isArray(data.pinnedItems)) {
          data.pinnedItems.forEach(itemId => {
            commit('PIN_ITEM', itemId);
          });
        }
        
        // Restore frequently accessed tracking
        if (data.frequentlyAccessed) {
          Object.entries(data.frequentlyAccessed).forEach(([itemId, count]) => {
            if (itemId && typeof count === 'number') {
              // This will be used when items are re-cached
              // Access tracking will be restored as items are loaded
            }
          });
        }
        
        console.log('📂 Cache metadata loaded from storage');
        
      } catch (error) {
        console.error('Error loading cache from storage:', error);
        // Clear corrupted cache
        localStorage.removeItem('inventory_cache');
      }
    },

    // 🔥 NEW: Get cache statistics
    async getCacheStats({ state }) {
      const totalSizeMB = state.cache.cacheStats.totalSize / 1024 / 1024;
      
      return {
        totalSize: `${totalSizeMB.toFixed(2)} MB`,
        itemCount: state.cache.cacheStats.itemCount,
        pinnedItems: state.cache.cacheStats.pinnedItems.size,
        frequentlyAccessed: Object.keys(state.cache.cacheStats.frequentlyAccessed).length,
        lastCleanup: new Date(state.cache.cacheStats.lastCleanup).toLocaleString(),
        cleanupCount: state.cache.cacheStats.cleanupCount,
        rotationCount: state.cache.cacheStats.rotationCount,
        status: totalSizeMB > PERFORMANCE_CONFIG.CACHE_AGGRESSIVE_CLEANUP_MB ? 'critical' :
                totalSizeMB > PERFORMANCE_CONFIG.CACHE_WARNING_SIZE_MB ? 'warning' : 'healthy'
      };
    },

    // 🔥 NEW: Manual cache cleanup
    async cleanupCache({ commit }, { aggressive = false }) {
      if (aggressive) {
        commit('PERFORM_AGGRESSIVE_CLEANUP');
      } else {
        commit('PERFORM_CACHE_CLEANUP');
      }
      
      console.log('🧹 Cache manually cleaned');
      return true;
    },

    // 🔥 NEW: Pin item to cache (prevent auto-removal)
    async pinItemToCache({ commit }, itemId) {
      commit('PIN_ITEM', itemId);
      return true;
    },

    // 🔥 NEW: Unpin item from cache
    async unpinItemFromCache({ commit }, itemId) {
      commit('UNPIN_ITEM', itemId);
      return true;
    },

    // Keep original fetchInventoryOnce for backward compatibility
    async fetchInventoryOnce({ dispatch }) {
      console.log('📦 Using fetchRecentInventory instead of fetchInventoryOnce');
      return await dispatch('fetchRecentInventory');
    },

    // 🔥 NEW: Force refresh inventory with cache management
    async forceRefreshInventory({ dispatch }) {
      console.log('🔄 Force refreshing inventory...');
      return await dispatch('refreshInventoryWithCacheManagement');
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

    // 🔥 UPDATED: searchItems with cache access tracking
    async searchItems({ state, dispatch, commit }, { searchTerm, limitResults = 5 }) {
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

        // Track access to found items
        localResults.forEach(item => {
          if (item.id) commit('TRACK_ITEM_ACCESS', item.id);
        });

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

    async getItemsByIds({ dispatch, commit }, itemIds) {
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

        // Track access to all retrieved items
        validResults.forEach(item => {
          if (item.id) commit('TRACK_ITEM_ACCESS', item.id);
        });

        console.log(`✅ Got ${validResults.length} items`);
        return validResults;

      } catch (error) {
        console.error('❌ Error getting multiple items:', error);
        return [];
      }
    },

    // 🔥 UPDATED: clearItemCache with stats reset
    clearItemCache({ commit }) {
      commit('CLEAR_CACHE');
      console.log('🧹 Item cache cleared with stats reset');
    },

    // All other actions remain exactly the same...
    // [The rest of your actions stay UNCHANGED - including showNotification, initializeAuth, loadUserProfile, login, logout, etc.]
    // I'm omitting them here for brevity, but they should remain in your code exactly as they are

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
              // 🔥 NEW: Load cache from storage on auth initialization
              await dispatch('loadCacheFromStorage');
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

        // Load warehouses and RECENT inventory
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

    // [All other existing actions remain exactly the same...]
    // Only showing a few for example:

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
        // Save cache before logout
        await dispatch('saveCacheToStorage');
        
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

    // [Include ALL your existing actions here without modification]
    // They should remain exactly as they are in your current code

    // 🔥 NEW: Compatibility wrapper for old refreshInventory
    async refreshInventory({ dispatch }) {
      console.log('🔄 Using new cache-managed refresh');
      return await dispatch('refreshInventoryWithCacheManagement');
    },

    // Keep old fetchInventory for compatibility
    async fetchInventory({ dispatch }) {
      console.log('📦 Fetching inventory...');
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
    hasMoreInventory: state => state.inventoryPagination.hasMore,
    
    // 🔥 UPDATED: getCachedItem with cache stats update
    getCachedItem: (state) => (itemId) => {
      const cacheEntry = state.cache.itemCache[itemId];
      const cacheDuration = 10 * 60 * 1000;
      
      if (cacheEntry && (Date.now() - cacheEntry.timestamp) < cacheDuration) {
        // Update cache stats when item is accessed
        state.cache.cacheStats.lastAccessed[itemId] = Date.now();
        state.cache.cacheStats.frequentlyAccessed[itemId] = 
          (state.cache.cacheStats.frequentlyAccessed[itemId] || 0) + 1;
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
    
    // 🔥 NEW: Cache statistics getter
    cacheStats: (state) => {
      const totalSizeMB = state.cache.cacheStats.totalSize / 1024 / 1024;
      
      return {
        totalSize: `${totalSizeMB.toFixed(2)} MB`,
        itemCount: state.cache.cacheStats.itemCount,
        pinnedItems: state.cache.cacheStats.pinnedItems.size,
        frequentlyAccessed: Object.keys(state.cache.cacheStats.frequentlyAccessed).length,
        lastCleanup: new Date(state.cache.cacheStats.lastCleanup).toLocaleString(),
        cleanupCount: state.cache.cacheStats.cleanupCount,
        rotationCount: state.cache.cacheStats.rotationCount,
        health: totalSizeMB > PERFORMANCE_CONFIG.CACHE_AGGRESSIVE_CLEANUP_MB ? 'critical' :
                totalSizeMB > PERFORMANCE_CONFIG.CACHE_WARNING_SIZE_MB ? 'warning' : 'healthy'
      };
    },
    
    // 🔥 NEW: Check if item is pinned
    isItemPinned: (state) => (itemId) => {
      return state.cache.cacheStats.pinnedItems.has(itemId);
    },
    
    // 🔥 NEW: Get cache health status
    cacheHealth: (state) => {
      const totalSizeMB = state.cache.cacheStats.totalSize / 1024 / 1024;
      if (totalSizeMB > PERFORMANCE_CONFIG.CACHE_AGGRESSIVE_CLEANUP_MB) return 'critical';
      if (totalSizeMB > PERFORMANCE_CONFIG.CACHE_WARNING_SIZE_MB) return 'warning';
      return 'healthy';
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
