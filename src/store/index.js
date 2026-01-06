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

// Performance configuration
const PERFORMANCE_CONFIG = {
  INITIAL_LOAD: 50,
  SCROLL_LOAD: 20,
  SEARCH_LIMIT: 25,
  INVOICE_LOAD_LIMIT: 100,
  SEARCH_DEBOUNCE: 300,
  MIN_SEARCH_CHARS: 2,
  MAX_REALTIME_LISTENERS: 30,
  BATCH_SIZE: 10
};

// Search configuration
const SEARCH_CONFIG = {
  FIELDS: ['name', 'code', 'color', 'supplier', 'item_location', 'warehouse_id'],
  MAX_RESULTS: 25
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

// ============================================
// SPARK PLAN ENHANCED CONFIGURATION
// ============================================
const SPARK_CONFIG = {
  // Performance
  MAX_RESULTS: 25,
  LOCAL_SEARCH_LIMIT: 200,
  INITIAL_DISPLAY_LIMIT: 15,
  
  // Caching
  CACHE_TTL: 300000, // 5 minutes
  MAX_CACHE_ENTRIES: 100,
  CACHE_CLEANUP_INTERVAL: 30000, // 30 seconds
  
  // Timing
  SEARCH_DEBOUNCE: 400,
  ARTIFICIAL_DELAY: 50,
  PARALLEL_TIMEOUT: 5000,
  
  // Fields
  FIELD_LIMITS: ['name', 'code', 'color', 'supplier'],
  RELEVANCE_WEIGHTS: {
    CODE_EXACT: 1000,
    CODE_STARTS: 500,
    NAME_EXACT: 400,
    NAME_STARTS: 300,
    NAME_CONTAINS: 200,
    OTHER_FIELDS: 100,
    QUANTITY_BONUS: 50,
    RECENCY_BONUS: 50
  }
};

// SPARK ENHANCED SEARCH CACHE
class SearchCache {
  constructor() {
    this.cache = new Map();
    this.accessLog = new Map();
    this.size = 0;
    this.maxSize = SPARK_CONFIG.MAX_CACHE_ENTRIES;
    this.cleanupTimer = null;
  }
  
  get(key) {
    const entry = this.cache.get(key);
    if (entry) {
      // Update access time
      this.accessLog.set(key, Date.now());
      return entry.results;
    }
    return null;
  }
  
  set(key, results) {
    // Cleanup if needed
    if (this.size >= this.maxSize) {
      this.cleanup();
    }
    
    const entry = {
      results,
      timestamp: Date.now(),
      size: JSON.stringify(results).length
    };
    
    this.cache.set(key, entry);
    this.accessLog.set(key, Date.now());
    this.size++;
    
    // Schedule cleanup
    this.scheduleCleanup();
  }
  
  cleanup() {
    const now = Date.now();
    const toDelete = [];
    
    // Remove expired entries
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > SPARK_CONFIG.CACHE_TTL) {
        toDelete.push(key);
      }
    }
    
    // If still over limit, remove least recently used
    if (this.size - toDelete.length > this.maxSize) {
      const lruEntries = Array.from(this.accessLog.entries())
        .sort((a, b) => a[1] - b[1])
        .slice(0, this.maxSize / 2);
      
      lruEntries.forEach(([key]) => {
        if (!toDelete.includes(key)) {
          toDelete.push(key);
        }
      });
    }
    
    // Delete entries
    toDelete.forEach(key => {
      this.cache.delete(key);
      this.accessLog.delete(key);
      this.size--;
    });
    
    if (toDelete.length > 0) {
      console.log(`🧹 SPARK Cache cleaned: removed ${toDelete.length} entries`);
    }
  }
  
  scheduleCleanup() {
    if (this.cleanupTimer) clearTimeout(this.cleanupTimer);
    this.cleanupTimer = setTimeout(() => this.cleanup(), SPARK_CONFIG.CACHE_CLEANUP_INTERVAL);
  }
  
  clear() {
    const oldSize = this.size;
    this.cache.clear();
    this.accessLog.clear();
    this.size = 0;
    if (this.cleanupTimer) {
      clearTimeout(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    console.log(`🧹 SPARK Cache cleared: ${oldSize} entries removed`);
    return oldSize;
  }
}

// Initialize SPARK cache
const searchCache = new SearchCache();

// Helper: Get cache key
const getCacheKey = (searchTerm, warehouseId, limit = SPARK_CONFIG.MAX_RESULTS) => {
  return `${warehouseId || 'all'}:${searchTerm.toLowerCase().trim()}:${limit}:${Date.now() % 10000}`;
};

// ============================================
// ENHANCED ARABIC TEXT NORMALIZATION FUNCTION
// ============================================
function normalizeArabicText(text) {
  if (!text || typeof text !== 'string') return '';
  
  // Convert to string and trim
  text = String(text).trim();
  
  // Normalize Unicode to combine characters
  text = text.normalize('NFC');
  
  // Remove all diacritics and special characters
  const diacriticsRegex = /[\u064B-\u065F\u0670\u0640\u0652\u0651\u064E\u064F\u064D\u0650\u0657\u0656\u0653\u0654\u0655]/g;
  text = text.replace(diacriticsRegex, '');
  
  // Comprehensive Arabic character normalization
  const arabicNormalizationMap = {
    // Alif variations
    'إ': 'ا', 'أ': 'ا', 'آ': 'ا', 'ٱ': 'ا', 'ٲ': 'ا', 'ٳ': 'ا',
    // Ya variations
    'ى': 'ي', 'ئ': 'ي', 'ۍ': 'ي', 'ێ': 'ي', 'ې': 'ي', 'ۑ': 'ي',
    // Ta marbuta
    'ة': 'ه',
    // Waw variations
    'ؤ': 'و', 'ۄ': 'و', 'ۅ': 'و', 'ۆ': 'و', 'ۇ': 'و', 'ۈ': 'و', 'ۉ': 'و', 'ۊ': 'و', 'ۋ': 'و',
    // Kaf variations
    'ك': 'ك', 'ڪ': 'ك', 'ګ': 'ك', 'ڬ': 'ك', 'ڭ': 'ك', 'ڮ': 'ك',
    // Hamza variations
    'ء': '', 'ٔ': '', 'ٕ': '', 'ٖ': '', 'ٗ': '',
    // Tatweel (kashida)
    'ـ': '',
    // Persian characters
    'گ': 'ك', 'چ': 'ج', 'پ': 'ب', 'ژ': 'ز',
    // Other Arabic variations
    'ڀ': 'ب', 'ٻ': 'ب', 'ڃ': 'ج', 'ڄ': 'ج', 'څ': 'ج', 'چ': 'ج', 'ڇ': 'ج',
    'ډ': 'د', 'ڊ': 'د', 'ڋ': 'د', 'ڌ': 'د', 'ڍ': 'د', 'ڎ': 'د', 'ڏ': 'د', 'ڐ': 'د',
    'ڑ': 'ر', 'ڒ': 'ر', 'ړ': 'ر', 'ڔ': 'ر', 'ڕ': 'ر', 'ږ': 'ر', 'ڗ': 'ر', 'ژ': 'ر',
    'ڙ': 'ر', 'ښ': 'س', 'ڛ': 'س', 'ڜ': 'س', 'ڝ': 'ص', 'ڞ': 'ص',
    'ڟ': 'ط', 'ڠ': 'ع', 'ڡ': 'ف', 'ڢ': 'ف', 'ڣ': 'ف', 'ڤ': 'ف', 'ڥ': 'ف', 'ڦ': 'ف',
    'ڧ': 'ق', 'ڨ': 'ق', 'ک': 'ك', 'ڪ': 'ك', 'ګ': 'ك', 'ڬ': 'ك', 'ڭ': 'ك', 'ڮ': 'ك',
    'ڰ': 'ل', 'ڱ': 'ل', 'ڲ': 'ل', 'ڳ': 'ل', 'ڴ': 'ل',
    'ڵ': 'ل', 'ڶ': 'ل', 'ڷ': 'ل', 'ڸ': 'ل', 'ڹ': 'ن', 'ں': 'ن', 'ڻ': 'ن', 'ڼ': 'ن',
    'ڽ': 'ن', 'ھ': 'ه', 'ۀ': 'ه', 'ہ': 'ه', 'ۂ': 'ه', 'ۃ': 'ه', 'ۄ': 'و', 'ۅ': 'و',
    'ۆ': 'و', 'ۇ': 'و', 'ۈ': 'و', 'ۉ': 'و', 'ۊ': 'و', 'ۋ': 'و', 'ی': 'ي', 'ۍ': 'ي',
    'ێ': 'ي', 'ې': 'ي', 'ۑ': 'ي'
  };
  
  // Apply character replacements
  Object.keys(arabicNormalizationMap).forEach(key => {
    const regex = new RegExp(key, 'g');
    text = text.replace(regex, arabicNormalizationMap[key]);
  });
  
  // Remove any remaining non-Arabic characters (keep spaces and numbers)
  text = text.replace(/[^\u0621-\u064A\u0660-\u0669\u0671-\u06D3\s0-9]/g, '');
  
  // Remove extra spaces and normalize
  text = text.replace(/\s+/g, ' ').trim().toLowerCase();
  
  return text;
}

// ============================================
// ENHANCED ARABIC MATCHING FUNCTION
// ============================================
function matchArabicText(item, searchTerm, fields) {
  if (!searchTerm || !item) return false;
  
  const normalizedSearchTerm = normalizeArabicText(searchTerm);
  
  for (const field of fields) {
    const fieldValue = item[field];
    if (fieldValue) {
      const normalizedFieldValue = normalizeArabicText(fieldValue.toString());
      
      // Check for exact match
      if (normalizedFieldValue === normalizedSearchTerm) {
        return true;
      }
      
      // Check for starts with
      if (normalizedFieldValue.startsWith(normalizedSearchTerm)) {
        return true;
      }
      
      // Check for contains
      if (normalizedFieldValue.includes(normalizedSearchTerm)) {
        return true;
      }
      
      // Check for word-by-word matching
      const fieldWords = normalizedFieldValue.split(/\s+/);
      const searchWords = normalizedSearchTerm.split(/\s+/);
      
      // Check if all search words are present in field words
      const allWordsMatch = searchWords.every(searchWord => 
        fieldWords.some(fieldWord => fieldWord.includes(searchWord))
      );
      
      if (allWordsMatch) {
        return true;
      }
      
      // Check for partial word matching
      const fieldWordsJoined = fieldWords.join('');
      if (fieldWordsJoined.includes(normalizedSearchTerm)) {
        return true;
      }
      
      // Enhanced: Check for character similarity (fuzzy matching)
      if (normalizedSearchTerm.length >= 3) {
        const similarity = calculateArabicSimilarity(normalizedFieldValue, normalizedSearchTerm);
        if (similarity > 0.7) {
          return true;
        }
      }
    }
  }
  
  return false;
}

// ============================================
// ARABIC SIMILARITY CALCULATION
// ============================================
function calculateArabicSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  
  // Convert to arrays of characters
  const chars1 = str1.split('');
  const chars2 = str2.split('');
  
  // Calculate intersection
  const intersection = chars1.filter(char => chars2.includes(char)).length;
  
  // Calculate union
  const union = new Set([...chars1, ...chars2]).size;
  
  // Return Jaccard similarity coefficient
  return union > 0 ? intersection / union : 0;
}

// ============================================
// ENHANCED RELEVANCE SCORE CALCULATION
// ============================================
function calculateRelevanceScore(item, searchTerm) {
  let score = 0;
  const normalizedSearchTerm = normalizeArabicText(searchTerm);
  const weights = SPARK_CONFIG.RELEVANCE_WEIGHTS;

  // Code exact match (highest priority)
  if (item.code && normalizeArabicText(item.code) === normalizedSearchTerm) {
    score += weights.CODE_EXACT;
  }

  // Code starts with search term
  if (item.code && normalizeArabicText(item.code).startsWith(normalizedSearchTerm)) {
    score += weights.CODE_STARTS;
  }

  // Name exact match
  if (item.name && normalizeArabicText(item.name) === normalizedSearchTerm) {
    score += weights.NAME_EXACT;
  }

  // Name starts with search term
  if (item.name && normalizeArabicText(item.name).startsWith(normalizedSearchTerm)) {
    score += weights.NAME_STARTS;
  }

  // Name contains search term
  if (item.name && normalizeArabicText(item.name).includes(normalizedSearchTerm)) {
    score += weights.NAME_CONTAINS;
  }

  // Other fields contain search term
  const otherFields = [item.color, item.supplier, item.item_location];
  otherFields.forEach(field => {
    if (field && normalizeArabicText(field).includes(normalizedSearchTerm)) {
      score += weights.OTHER_FIELDS;
    }
  });

  // Bonus for items with higher quantity (better availability)
  score += Math.min(item.remaining_quantity || 0, weights.QUANTITY_BONUS);

  // Bonus for recently updated items
  if (item.updated_at) {
    const updateDate = item.updated_at.toDate ? item.updated_at.toDate() : new Date(item.updated_at);
    const daysSinceUpdate = (Date.now() - updateDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 7) {
      score += weights.RECENCY_BONUS;
    }
  }

  // Additional weight for search term length
  if (searchTerm.length >= 4) {
    score += 20;
  }

  return score;
}

// ============================================
// ENHANCED RESULT MERGING AND DEDUPLICATION
// ============================================
function removeDuplicatesAndSortByRelevance(items, searchTerm, limit) {
  const seen = new Set();
  const uniqueItems = [];

  for (const item of items) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      uniqueItems.push(item);
    }
  }

  // Sort by relevance score (descending)
  uniqueItems.sort((a, b) => {
    const scoreA = calculateRelevanceScore(a, searchTerm);
    const scoreB = calculateRelevanceScore(b, searchTerm);
    return scoreB - scoreA;
  });

  return uniqueItems.slice(0, limit);
}

// ============================================
// SMART RESULT MERGING FUNCTION
// ============================================
function mergeSearchResults(localResults, firebaseResults, searchTerm, limit) {
  const allResults = new Map();
  const maxAge = Date.now() - (60 * 60 * 1000); // 1 hour

  // Add Firebase results first (more current)
  firebaseResults.forEach(item => {
    if (item.updated_at) {
      const updated = item.updated_at.toDate ? item.updated_at.toDate() : new Date(item.updated_at);
      if (updated.getTime() > maxAge) {
        item._freshness = 1.0;
      } else {
        item._freshness = 0.5;
      }
    } else {
      item._freshness = 0.3;
    }
    
    item._source = 'firebase';
    allResults.set(item.id, item);
  });

  // Add/update with local results
  localResults.forEach(item => {
    const existing = allResults.get(item.id);
    if (existing) {
      // Update if local is more recent or has more data
      if (item.remaining_quantity !== undefined && existing.remaining_quantity === undefined) {
        existing.remaining_quantity = item.remaining_quantity;
      }
      existing._hasLocal = true;
    } else {
      item._source = 'local';
      item._freshness = 0.2;
      allResults.set(item.id, item);
    }
  });

  // Calculate final relevance
  const finalResults = Array.from(allResults.values())
    .map(item => ({
      ...item,
      _finalScore: calculateRelevanceScore(item, searchTerm) * (item._freshness || 0.5)
    }))
    .sort((a, b) => b._finalScore - a._finalScore)
    .slice(0, limit)
    .map(item => {
      // Remove internal scoring fields
      const { _relevance, _freshness, _source, _hasLocal, _finalScore, ...cleanItem } = item;
      return cleanItem;
    });

  return finalResults;
}

// ============================================
// FUZZY LOCAL SEARCH FALLBACK
// ============================================
function fuzzyLocalSearch(items, searchTerm, warehouseId, limit) {
  const normalizedTerm = normalizeArabicText(searchTerm);
  const terms = normalizedTerm.split(' ');
  
  return items.filter(item => {
    // Check warehouse
    if (warehouseId && warehouseId !== 'all' && item.warehouse_id !== warehouseId) {
      return false;
    }
    
    // Fuzzy match across multiple fields
    const fields = ['name', 'code', 'color', 'supplier'];
    for (const field of fields) {
      const value = item[field];
      if (value) {
        const normalizedValue = normalizeArabicText(value.toString());
        
        // Check for term inclusion
        if (terms.every(term => normalizedValue.includes(term))) {
          return true;
        }
        
        // Check for partial matches
        if (terms.some(term => normalizedValue.includes(term))) {
          return true;
        }
        
        // Check for character similarity (simple fuzzy)
        if (calculateArabicSimilarity(normalizedTerm, normalizedValue) > 0.6) {
          return true;
        }
      }
    }
    
    return false;
  }).slice(0, limit);
}

// Helper function to get auth error message
function getAuthErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'البريد الإلكتروني غير صالح';
    case 'auth/user-disabled':
      return 'الحساب معطل';
    case 'auth/user-not-found':
      return 'المستخدم غير موجود';
    case 'auth/wrong-password':
      return 'كلمة المرور غير صحيحة';
    case 'auth/email-already-in-use':
      return 'البريد الإلكتروني مستخدم بالفعل';
    case 'auth/weak-password':
      return 'كلمة المرور ضعيفة';
    case 'auth/operation-not-allowed':
      return 'العملية غير مسموح بها';
    case 'auth/too-many-requests':
      return 'تم محاولة الدخول مرات عديدة. الرجاء المحاولة لاحقاً';
    case 'auth/network-request-failed':
      return 'خطأ في الاتصال بالشبكة';
    default:
      return 'حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى';
  }
}

// Helper function to get invoice type label
function getInvoiceTypeLabel(type) {
  const labels = {
    'B2B': 'فاتورة ضريبية (B2B)',
    'B2C': 'فاتورة ضريبية (B2C)',
    'simplified': 'فاتورة مبسطة'
  };
  return labels[type] || type;
}

// Helper function to get invoice status label
function getInvoiceStatusLabel(status) {
  const labels = {
    'draft': 'مسودة',
    'issued': 'صادرة',
    'paid': 'مدفوعة',
    'cancelled': 'ملغية'
  };
  return labels[status] || status;
}

// Helper function to get payment method label
function getPaymentMethodLabel(method) {
  const labels = {
    'cash': 'نقدي',
    'credit': 'آجل',
    'bank_transfer': 'تحويل بنكي',
    'check': 'شيك'
  };
  return labels[method] || method;
}

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
    fieldMappings: FIELD_MAPPINGS,
    inventoryLastFetched: null,
    isFetchingInventory: false,
    isRefreshingSilently: false,
    recentTransactionsLoading: false,
    activeItemListeners: new Set(),

    // Search State
    search: {
      query: '',
      results: [],
      loading: false,
      error: null,
      source: 'none',
      timestamp: null,
      suggestions: []
    },
    warehouseFilter: '',

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
    },
    
    // SPARK Performance Monitoring
    searchPerformance: {
      searches: 0,
      avgResponseTime: 0,
      cacheHitRate: 0,
      successRate: 1,
      lastSearchDuration: 0
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
      if (typeof listener === 'function') {
        state.realtimeListeners.push(listener);
      }
    },
    CLEAR_REALTIME_LISTENERS(state) {
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

    // Search Mutations
    SET_SEARCH_QUERY(state, query) {
      state.search.query = query;
    },
    SET_SEARCH_RESULTS(state, { results, source, query }) {
      state.search.results = results;
      state.search.source = source;
      state.search.timestamp = new Date();
      state.search.loading = false;
    },
    SET_SEARCH_LOADING(state, loading) {
      state.search.loading = loading;
    },
    SET_SEARCH_ERROR(state, error) {
      state.search.error = error;
    },
    CLEAR_SEARCH(state) {
      state.search.results = [];
      state.search.query = '';
      state.search.loading = false;
      state.search.error = null;
      state.search.source = 'none';
      state.search.suggestions = [];
    },
    SET_WAREHOUSE_FILTER(state, warehouseId) {
      state.warehouseFilter = warehouseId;
      state.filters.warehouse = warehouseId;
    },
    SET_SEARCH_SUGGESTIONS(state, suggestions) {
      state.search.suggestions = suggestions;
    },
    
    // Performance Monitoring Mutations
    UPDATE_SEARCH_PERFORMANCE(state, { duration, cacheHit = false }) {
      state.searchPerformance.searches++;
      state.searchPerformance.lastSearchDuration = duration;
      state.searchPerformance.avgResponseTime = 
        (state.searchPerformance.avgResponseTime * (state.searchPerformance.searches - 1) + duration) / 
        state.searchPerformance.searches;
      
      const totalHits = state.searchPerformance.cacheHitRate * (state.searchPerformance.searches - 1);
      state.searchPerformance.cacheHitRate = (totalHits + (cacheHit ? 1 : 0)) / state.searchPerformance.searches;
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
      state.search = {
        query: '',
        results: [],
        loading: false,
        error: null,
        source: 'none',
        timestamp: null,
        suggestions: []
      };
      state.warehouseFilter = '';
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
      state.searchPerformance = {
        searches: 0,
        avgResponseTime: 0,
        cacheHitRate: 0,
        successRate: 1,
        lastSearchDuration: 0
      };

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
    // ============================================
    // SPARK ENHANCED SMART ARABIC SEARCH
    // ============================================
    async searchInventorySpark({ commit, state, dispatch }, {
      searchQuery,
      warehouseId = null,
      limit = SPARK_CONFIG.MAX_RESULTS,
      strategy = 'parallel'
    }) {
      const startTime = performance.now();
      
      try {
        // Validation
        if (!searchQuery || searchQuery.trim().length < 2) {
          commit('SET_SEARCH_RESULTS', { results: [], source: 'min_length', query: '' });
          return [];
        }

        const searchTerm = searchQuery.trim();
        const targetWarehouse = warehouseId || state.warehouseFilter || 'all';

        commit('SET_SEARCH_LOADING', true);
        commit('SET_SEARCH_QUERY', searchTerm);

        console.log(`🚀 SPARK Search: "${searchTerm}" (warehouse: ${targetWarehouse}) | Strategy: ${strategy}`);

        // Check cache first
        const cacheKey = getCacheKey(searchTerm, targetWarehouse, limit);
        const cachedResults = searchCache.get(cacheKey);
        
        if (cachedResults) {
          console.log(`✅ Using cached results for: "${searchTerm}"`);
          commit('SET_SEARCH_RESULTS', {
            results: cachedResults.slice(0, limit),
            source: 'cache',
            query: searchTerm
          });
          commit('SET_SEARCH_LOADING', false);
          
          const duration = performance.now() - startTime;
          commit('UPDATE_SEARCH_PERFORMANCE', { duration, cacheHit: true });
          
          return cachedResults.slice(0, limit);
        }

        let results = [];
        
        // Choose search strategy
        switch(strategy) {
          case 'parallel':
            results = await dispatch('searchParallelSpark', {
              searchTerm,
              targetWarehouse,
              limit
            });
            break;
            
          case 'local_first':
            results = await dispatch('searchLocalFirstSpark', {
              searchTerm,
              targetWarehouse,
              limit
            });
            break;
            
          case 'firebase_first':
            results = await dispatch('searchFirebaseFirstSpark', {
              searchTerm,
              targetWarehouse,
              limit
            });
            break;
            
          default:
            results = await dispatch('searchHybridSpark', {
              searchTerm,
              targetWarehouse,
              limit
            });
        }

        // Cache results if we found any
        if (results.length > 0) {
          searchCache.set(cacheKey, results);
          console.log(`💾 Cached ${results.length} results for: "${searchTerm}"`);
        }

        // Determine source
        const source = results.length > 0 ? 'spark_hybrid' : 'none';

        // Update state
        commit('SET_SEARCH_RESULTS', {
          results: results.slice(0, limit),
          source,
          query: searchTerm
        });

        const duration = performance.now() - startTime;
        commit('UPDATE_SEARCH_PERFORMANCE', { duration, cacheHit: false });
        
        console.log(`🎯 SPARK Search completed in ${duration.toFixed(2)}ms: ${results.length} results`);
        return results;

      } catch (error) {
        console.error('❌ SPARK Search error:', error);
        commit('SET_SEARCH_ERROR', error.message);
        
        const duration = performance.now() - startTime;
        commit('UPDATE_SEARCH_PERFORMANCE', { duration, cacheHit: false });
        
        // Fallback to local fuzzy search
        try {
          const fallbackResults = fuzzyLocalSearch(state.inventory, searchQuery, warehouseId, limit);
          commit('SET_SEARCH_RESULTS', {
            results: fallbackResults,
            source: 'fallback',
            query: searchQuery
          });
          return fallbackResults;
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          commit('SET_SEARCH_RESULTS', { results: [], source: 'error', query: searchQuery });
          return [];
        }
      } finally {
        commit('SET_SEARCH_LOADING', false);
      }
    },

    // ============================================
    // PARALLEL SEARCH STRATEGY
    // ============================================
    async searchParallelSpark({ state, dispatch }, {
      searchTerm,
      targetWarehouse,
      limit
    }) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), SPARK_CONFIG.PARALLEL_TIMEOUT);
      
      try {
        // Start both searches in parallel
        const localPromise = dispatch('searchLocalSpark', {
          query: searchTerm,
          warehouseId: targetWarehouse,
          limit: Math.min(limit, SPARK_CONFIG.LOCAL_SEARCH_LIMIT)
        });
        
        const firebasePromise = dispatch('searchFirebaseSpark', {
          query: searchTerm,
          warehouseId: targetWarehouse,
          limit
        });
        
        // Wait for both with timeout
        const [localResults, firebaseResults] = await Promise.race([
          Promise.all([localPromise, firebasePromise]),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Search timeout')), SPARK_CONFIG.PARALLEL_TIMEOUT)
          )
        ]);
        
        clearTimeout(timeoutId);
        
        // Smart merging
        return mergeSearchResults(localResults, firebaseResults, searchTerm, limit);
        
      } catch (error) {
        clearTimeout(timeoutId);
        console.warn('Parallel search failed:', error.message);
        
        // Fallback to local-only search
        return await dispatch('searchLocalSpark', {
          query: searchTerm,
          warehouseId: targetWarehouse,
          limit
        });
      }
    },

    // ============================================
    // LOCAL-FIRST SEARCH STRATEGY
    // ============================================
    async searchLocalFirstSpark({ state, dispatch }, {
      searchTerm,
      targetWarehouse,
      limit
    }) {
      try {
        // Get local results first
        const localResults = await dispatch('searchLocalSpark', {
          query: searchTerm,
          warehouseId: targetWarehouse,
          limit: Math.min(limit * 2, SPARK_CONFIG.LOCAL_SEARCH_LIMIT)
        });
        
        // If we have enough local results, return them
        if (localResults.length >= limit) {
          console.log(`✅ Local-first: Found ${localResults.length} local results`);
          return removeDuplicatesAndSortByRelevance(localResults, searchTerm, limit);
        }
        
        // Otherwise, get Firebase results
        const firebaseResults = await dispatch('searchFirebaseSpark', {
          query: searchTerm,
          warehouseId: targetWarehouse,
          limit: limit - localResults.length
        });
        
        // Merge results
        const allResults = [...localResults, ...firebaseResults];
        return removeDuplicatesAndSortByRelevance(allResults, searchTerm, limit);
        
      } catch (error) {
        console.warn('Local-first search failed:', error.message);
        throw error;
      }
    },

    // ============================================
    // FIREBASE-FIRST SEARCH STRATEGY
    // ============================================
    async searchFirebaseFirstSpark({ state, dispatch }, {
      searchTerm,
      targetWarehouse,
      limit
    }) {
      try {
        // Get Firebase results first
        const firebaseResults = await dispatch('searchFirebaseSpark', {
          query: searchTerm,
          warehouseId: targetWarehouse,
          limit
        });
        
        // If we have enough Firebase results, return them
        if (firebaseResults.length >= limit) {
          console.log(`✅ Firebase-first: Found ${firebaseResults.length} Firebase results`);
          return removeDuplicatesAndSortByRelevance(firebaseResults, searchTerm, limit);
        }
        
        // Otherwise, get local results
        const localResults = await dispatch('searchLocalSpark', {
          query: searchTerm,
          warehouseId: targetWarehouse,
          limit: limit - firebaseResults.length
        });
        
        // Merge results
        const allResults = [...firebaseResults, ...localResults];
        return removeDuplicatesAndSortByRelevance(allResults, searchTerm, limit);
        
      } catch (error) {
        console.warn('Firebase-first search failed:', error.message);
        throw error;
      }
    },

    // ============================================
    // HYBRID SEARCH STRATEGY (AUTO-DETECT)
    // ============================================
    async searchHybridSpark({ state, dispatch }, {
      searchTerm,
      targetWarehouse,
      limit
    }) {
      // Auto-detect strategy based on conditions
      let strategy = 'parallel';
      
      if (state.inventory.length > SPARK_CONFIG.LOCAL_SEARCH_LIMIT * 2) {
        // Large local inventory, prefer local-first
        strategy = 'local_first';
      } else if (!state.inventoryLoaded || state.inventory.length === 0) {
        // No local inventory, use Firebase-first
        strategy = 'firebase_first';
      } else if (searchTerm.length <= 3) {
        // Short search term, use parallel for speed
        strategy = 'parallel';
      }
      
      return await dispatch('searchInventorySpark', {
        searchQuery: searchTerm,
        warehouseId: targetWarehouse,
        limit,
        strategy
      });
    },

    // ============================================
    // ENHANCED LOCAL SEARCH
    // ============================================
    async searchLocalSpark({ state }, {
      query,
      warehouseId,
      limit = SPARK_CONFIG.MAX_RESULTS
    }) {
      if (!query || query.trim().length < 2) return [];

      const searchTerm = query.trim();
      const normalizedSearchTerm = normalizeArabicText(searchTerm);
      const SEARCH_FIELDS = SPARK_CONFIG.FIELD_LIMITS;

      // Get inventory with limits
      let items = [...state.inventory];
      
      // Early exit if too many items
      if (items.length > SPARK_CONFIG.LOCAL_SEARCH_LIMIT) {
        items = items.slice(0, SPARK_CONFIG.LOCAL_SEARCH_LIMIT);
        console.log(`⚠️ Limiting local search to ${SPARK_CONFIG.LOCAL_SEARCH_LIMIT} items`);
      }

      // Apply warehouse filter if specified
      if (warehouseId && warehouseId !== 'all') {
        items = items.filter(i => i.warehouse_id === warehouseId);
      }

      // Early exit if no items
      if (items.length === 0) return [];

      console.log(`🔎 SPARK Local search scanning ${items.length} items`);

      // Optimized search with early exit
      const matches = [];
      const maxMatches = Math.min(limit * 3, 50);
      
      for (const item of items) {
        if (matches.length >= maxMatches) break;
        
        let matched = false;
        
        // Check each search field
        for (const field of SEARCH_FIELDS) {
          const value = item[field];
          if (!value) continue;

          const normalizedValue = normalizeArabicText(value.toString());

          // Quick checks in order of performance
          if (normalizedValue.includes(normalizedSearchTerm)) {
            matched = true;
            break;
          }
          
          if (normalizedValue.startsWith(normalizedSearchTerm)) {
            matched = true;
            break;
          }
          
          // Only do word matching for longer searches
          if (searchTerm.length > 2) {
            const fieldWords = normalizedValue.split(/\s+/);
            const searchWords = normalizedSearchTerm.split(/\s+/);
            
            // Check first word match
            if (searchWords.length > 0) {
              const firstSearchWord = searchWords[0];
              if (fieldWords.some(word => word.includes(firstSearchWord))) {
                matched = true;
                break;
              }
            }
          }
        }
        
        if (matched) {
          matches.push(item);
        }
      }

      console.log(`📍 SPARK Local search found ${matches.length} matches`);

      return removeDuplicatesAndSortByRelevance(matches, searchTerm, limit);
    },

    // ============================================
    // ENHANCED FIREBASE SEARCH
    // ============================================
    async searchFirebaseSpark({ state }, { query, warehouseId, limit }) {
      try {
        console.log(`🌐 SPARK Firebase search for: "${query}"`);
        
        // Validate Firebase
        if (!db) {
          console.error('❌ Firebase not available');
          return [];
        }

        const searchTerm = normalizeArabicText(query.toLowerCase());
        
        // Check permissions
        const role = state.userProfile?.role || '';
        const profileWarehouses = state.userProfile?.allowed_warehouses || [];
        
        let canAccessAll = false;
        let allowedWarehouseIds = [];
        
        if (role === 'superadmin' || role === 'company_manager') {
          canAccessAll = true;
        } else if (role === 'warehouse_manager' && Array.isArray(profileWarehouses)) {
          if (profileWarehouses.includes('all')) {
            canAccessAll = true;
          } else {
            allowedWarehouseIds = profileWarehouses.filter(id => 
              typeof id === 'string' && id.trim() !== '' && id !== 'all'
            ).slice(0, 10);
          }
        }

        // Dynamic import
        const firebaseFirestore = await import('firebase/firestore');
        const {
          collection,
          query: firestoreQuery,
          where,
          orderBy,
          limit: firestoreLimit,
          getDocs
        } = firebaseFirestore;

        const itemsRef = collection(db, 'items');
        let itemsQuery;
        let searchResults = [];

        // Build optimized query
        if (canAccessAll) {
          // Superadmin or company manager
          if (warehouseId && warehouseId !== 'all') {
            itemsQuery = firestoreQuery(
              itemsRef,
              where('warehouse_id', '==', warehouseId),
              orderBy('updated_at', 'desc'),
              firestoreLimit(Math.min(limit || SPARK_CONFIG.MAX_RESULTS, 30))
            );
          } else {
            itemsQuery = firestoreQuery(
              itemsRef,
              orderBy('updated_at', 'desc'),
              firestoreLimit(Math.min(limit || SPARK_CONFIG.MAX_RESULTS, 30))
            );
          }
        } else if (allowedWarehouseIds.length > 0) {
          // Warehouse manager
          if (warehouseId && warehouseId !== 'all') {
            if (allowedWarehouseIds.includes(warehouseId)) {
              itemsQuery = firestoreQuery(
                itemsRef,
                where('warehouse_id', '==', warehouseId),
                orderBy('updated_at', 'desc'),
                firestoreLimit(Math.min(limit || SPARK_CONFIG.MAX_RESULTS, 30))
              );
            } else {
              console.warn('Warehouse not in allowed list');
              return [];
            }
          } else {
            // Multiple warehouses - limit to prevent "in" query issues
            const validIds = allowedWarehouseIds.slice(0, 5);
            
            if (validIds.length === 1) {
              itemsQuery = firestoreQuery(
                itemsRef,
                where('warehouse_id', '==', validIds[0]),
                orderBy('updated_at', 'desc'),
                firestoreLimit(Math.min(limit || SPARK_CONFIG.MAX_RESULTS, 30))
              );
            } else {
              try {
                itemsQuery = firestoreQuery(
                  itemsRef,
                  where('warehouse_id', 'in', validIds),
                  orderBy('updated_at', 'desc'),
                  firestoreLimit(Math.min(limit || SPARK_CONFIG.MAX_RESULTS, 25))
                );
              } catch (inError) {
                console.warn('"in" query failed, using single warehouse:', inError);
                itemsQuery = firestoreQuery(
                  itemsRef,
                  where('warehouse_id', '==', validIds[0]),
                  orderBy('updated_at', 'desc'),
                  firestoreLimit(Math.min(limit || SPARK_CONFIG.MAX_RESULTS, 30))
                );
              }
            }
          }
        } else {
          console.log('⚠️ User has no accessible warehouses');
          return [];
        }

        // Execute with timeout protection
        let snapshot;
        try {
          snapshot = await getDocs(itemsQuery);
          console.log(`📊 SPARK Firebase query returned ${snapshot.size} documents`);
        } catch (queryError) {
          console.error('❌ SPARK Firestore query failed:', queryError);
          return [];
        }

        if (!snapshot || snapshot.empty) {
          console.log('📭 No items found in Firebase');
          return [];
        }

        // Process with limits
        const allItems = [];
        snapshot.forEach(doc => {
          if (allItems.length >= SPARK_CONFIG.MAX_RESULTS * 3) return;
          
          try {
            const data = doc.data();
            
            // Minimal field extraction
            const item = {
              id: doc.id,
              name: data.name || '',
              code: data.code || '',
              color: data.color || '',
              supplier: data.supplier || '',
              warehouse_id: data.warehouse_id || '',
              remaining_quantity: data.remaining_quantity || 0,
              updated_at: data.updated_at
            };
            
            // Only add essential optional fields
            if (data.item_location) item.item_location = data.item_location;
            if (data.photo_url) item.photo_url = data.photo_url;
            
            allItems.push(item);
          } catch (docError) {
            console.warn('⚠️ Error processing document:', docError);
          }
        });

        console.log(`✅ SPARK Processed ${allItems.length} items from Firebase`);

        // Filter with early exit
        searchResults = [];
        const searchFields = SPARK_CONFIG.FIELD_LIMITS;
        
        for (const item of allItems) {
          if (searchResults.length >= SPARK_CONFIG.MAX_RESULTS * 2) break;
          
          // Warehouse filter
          if (warehouseId && warehouseId !== 'all' && item.warehouse_id !== warehouseId) {
            continue;
          }
          
          // Search filter
          let matched = false;
          for (const field of searchFields) {
            const fieldValue = item[field];
            if (!fieldValue) continue;

            const normalizedValue = normalizeArabicText(fieldValue.toString());
            
            if (normalizedValue.includes(searchTerm)) {
              matched = true;
              break;
            }
          }
          
          if (matched) {
            searchResults.push(item);
          }
        }

        console.log(`🔍 SPARK Found ${searchResults.length} matching items`);

        // Apply relevance with strict limits
        const finalResults = removeDuplicatesAndSortByRelevance(
          searchResults,
          query,
          Math.min(limit || SPARK_CONFIG.MAX_RESULTS, SPARK_CONFIG.MAX_RESULTS)
        );

        console.log(`🎯 SPARK Returning ${finalResults.length} relevant items`);
        return finalResults;

      } catch (error) {
        console.error('❌ SPARK Firebase search error:', error);
        return [];
      }
    },

    // ============================================
    // SPARK OPTIMIZED LIVE SEARCH
    // ============================================
    async searchInventoryLive({ commit, dispatch, state }, {
      searchQuery,
      warehouseId = null,
      limit = SPARK_CONFIG.MAX_RESULTS,
      showImmediateResults = true
    }) {
      if (!searchQuery || searchQuery.trim().length < 2) {
        commit('SET_SEARCH_RESULTS', { results: [], source: 'none', query: '' });
        return [];
      }

      commit('SET_SEARCH_LOADING', true);
      const searchTerm = searchQuery.trim();
      const targetWarehouse = warehouseId || state.warehouseFilter || 'all';

      try {
        console.log(`⚡ SPARK Live search: "${searchTerm}"`);

        // Check cache first
        const cacheKey = getCacheKey(searchTerm, targetWarehouse);
        const cachedData = searchCache.get(cacheKey);
        
        if (cachedData) {
          console.log(`⚡ Using cached live results for: "${searchTerm}"`);
          commit('SET_SEARCH_RESULTS', {
            results: cachedData.slice(0, SPARK_CONFIG.MAX_RESULTS),
            source: 'cache',
            query: searchTerm
          });
          commit('SET_SEARCH_LOADING', false);
          return cachedData.slice(0, SPARK_CONFIG.MAX_RESULTS);
        }

        let immediateResults = [];
        let finalResults = [];

        // PHASE 1: IMMEDIATE LOCAL RESULTS
        if (showImmediateResults && Array.isArray(state.inventory) && state.inventory.length > 0) {
          try {
            console.log('🚀 Getting SPARK immediate local results...');
            
            // Quick local search with small limit
            immediateResults = await dispatch('searchLocalSpark', {
              query: searchTerm,
              warehouseId: targetWarehouse,
              limit: Math.min(10, SPARK_CONFIG.INITIAL_DISPLAY_LIMIT)
            });

            if (immediateResults.length > 0) {
              console.log(`⚡ SPARK Immediate results: ${immediateResults.length} items`);
              
              commit('SET_SEARCH_RESULTS', {
                results: immediateResults.slice(0, SPARK_CONFIG.INITIAL_DISPLAY_LIMIT),
                source: 'spark_local',
                query: searchTerm
              });
              
              // If we have enough results, cache and return early
              if (immediateResults.length >= SPARK_CONFIG.INITIAL_DISPLAY_LIMIT) {
                console.log('✅ Enough immediate results, caching and returning');
                
                searchCache.set(cacheKey, immediateResults);
                
                commit('SET_SEARCH_LOADING', false);
                return immediateResults;
              }
            }
          } catch (localError) {
            console.warn('SPARK Local immediate results failed:', localError);
          }
        }

        // PHASE 2: COMPREHENSIVE SPARK SEARCH
        console.log('🔄 Performing SPARK comprehensive search...');
        
        // Add artificial delay for better UX
        await new Promise(resolve => setTimeout(resolve, SPARK_CONFIG.ARTIFICIAL_DELAY));
        
        finalResults = await dispatch('searchInventorySpark', {
          searchQuery: searchTerm,
          warehouseId: targetWarehouse,
          limit: limit
        });

        // PHASE 3: UPDATE WITH FINAL RESULTS
        if (finalResults.length > 0) {
          console.log(`🎯 SPARK Final results: ${finalResults.length} items`);
          
          // Cache final results
          searchCache.set(cacheKey, finalResults);
          
          commit('SET_SEARCH_RESULTS', {
            results: finalResults.slice(0, SPARK_CONFIG.MAX_RESULTS),
            source: 'spark_hybrid',
            query: searchTerm
          });
        } else if (immediateResults.length > 0) {
          // Keep immediate results
          console.log('📱 Keeping SPARK immediate local results');
          commit('SET_SEARCH_RESULTS', {
            results: immediateResults.slice(0, SPARK_CONFIG.INITIAL_DISPLAY_LIMIT),
            source: 'spark_local',
            query: searchTerm
          });
        } else {
          // No results
          console.log('📭 No SPARK results found');
          commit('SET_SEARCH_RESULTS', {
            results: [],
            source: 'none',
            query: searchTerm
          });
        }

        return finalResults.length > 0 ? finalResults : immediateResults;

      } catch (error) {
        console.error('❌ SPARK Enhanced live search failed:', error);
        
        // Fallback to local only
        try {
          const fallbackResults = await dispatch('searchLocalSpark', {
            query: searchTerm,
            warehouseId: targetWarehouse,
            limit: SPARK_CONFIG.INITIAL_DISPLAY_LIMIT
          });
          
          commit('SET_SEARCH_RESULTS', {
            results: fallbackResults.slice(0, SPARK_CONFIG.INITIAL_DISPLAY_LIMIT),
            source: 'spark_local_fallback',
            query: searchTerm
          });
          
          return fallbackResults;
        } catch (fallbackError) {
          console.error('SPARK Fallback also failed:', fallbackError);
          commit('SET_SEARCH_RESULTS', { results: [], source: 'error', query: searchTerm });
          return [];
        }
      } finally {
        commit('SET_SEARCH_LOADING', false);
      }
    },

    // ============================================
    // CACHE MANAGEMENT
    // ============================================
    clearSearchCache({ commit }) {
      const clearedCount = searchCache.clear();
      console.log(`🧹 Cleared ${clearedCount} cache entries`);
      commit('SET_SEARCH_RESULTS', { results: [], source: 'none', query: '' });
    },

    // ============================================
    // LEGACY COMPATIBILITY ACTIONS
    // ============================================
    async searchInventorySmart({ dispatch }, params) {
      return await dispatch('searchInventorySpark', params);
    },

    async searchLocalInventorySpark({ dispatch }, params) {
      return await dispatch('searchLocalSpark', params);
    },

    async searchFirebaseInventorySpark({ dispatch }, params) {
      return await dispatch('searchFirebaseSpark', params);
    },

    async searchFirebaseInventorySmartLegacy({ dispatch }, params) {
      return await dispatch('searchFirebaseSpark', params);
    },

    async searchInventoryEnhanced({ dispatch }, params) {
      return await dispatch('searchInventorySpark', params);
    },

    async searchLocalInventory({ dispatch }, params) {
      return await dispatch('searchLocalSpark', params);
    },

    async searchFirebaseInventory({ dispatch }, params) {
      return await dispatch('searchFirebaseSpark', params);
    },

    async searchItemsForTransactions({ dispatch }, params) {
      return await dispatch('searchInventorySpark', {
        searchQuery: params.searchTerm,
        warehouseId: params.warehouseId,
        limit: params.limitResults || 20
      });
    },

    async searchItemsForTransactionsEnhanced({ dispatch }, params) {
      return await dispatch('searchInventorySpark', {
        searchQuery: params.searchTerm,
        warehouseId: params.warehouseId,
        limit: params.limitResults || 20
      });
    },

    async searchItems({ dispatch }, params) {
      return await dispatch('searchInventorySpark', {
        searchQuery: params.searchTerm,
        limit: params.limitResults || 5
      });
    },

    async searchInventoryDirect({ dispatch }, params) {
      return await dispatch('searchInventorySpark', {
        searchQuery: params.query || params.searchTerm,
        warehouseId: params.warehouseId,
        limit: params.limit || params.limitResults || SPARK_CONFIG.MAX_RESULTS
      });
    },

    // ============================================
    // UTILITY ACTIONS
    // ============================================
    async setWarehouseFilter({ commit, state, dispatch }, warehouseId) {
      commit('SET_WAREHOUSE_FILTER', warehouseId);

      if (state.search.query && state.search.query.length >= PERFORMANCE_CONFIG.MIN_SEARCH_CHARS) {
        await dispatch('searchInventorySpark', {
          searchQuery: state.search.query,
          warehouseId
        });
      }
    },

    async clearSearch({ commit }) {
      commit('CLEAR_SEARCH');
    },

    async testFirebaseConnection({ state }) {
      try {
        console.log('🔧 Testing Firebase connection...');
        
        if (!db) {
          console.error('❌ db is undefined');
          return false;
        }
        
        const firebaseFirestore = await import('firebase/firestore');
        const { collection, query, limit, getDocs } = firebaseFirestore;
        
        const testRef = collection(db, 'items');
        const testQuery = query(testRef, limit(1));
        const snapshot = await getDocs(testQuery);
        
        console.log(`✅ Firebase test: ${snapshot.empty ? 'Connected (no items)' : 'Connected with items'}`);
        return true;
      } catch (error) {
        console.error('❌ Firebase connection test failed:', error);
        return false;
      }
    },

    // ============================================
    // EXISTING ACTIONS (PRESERVED)
    // ============================================
    // All existing actions from the original code are preserved below
    // Only search-related actions have been enhanced
    // The rest of the actions remain exactly as in your original code

    async loadInventoryWithWarehouse({ commit, state, dispatch }, { 
      warehouseId = null,
      forceRefresh = false 
    } = {}) {
      commit('SET_INVENTORY_LOADING', true);

      try {
        const targetWarehouse = warehouseId || state.warehouseFilter;

        if (targetWarehouse) {
          commit('SET_WAREHOUSE_FILTER', targetWarehouse);
        }

        let itemsQuery;
        const itemsRef = collection(db, 'items');

        if (targetWarehouse && targetWarehouse !== 'all') {
          itemsQuery = query(
            itemsRef,
            where('warehouse_id', '==', targetWarehouse),
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

        const snapshot = await getDocs(itemsQuery);
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
          await dispatch('setupOptimizedRealtimeUpdates', inventory.map(item => item.id));
        }

        return inventory;

      } catch (error) {
        console.error('❌ Error loading inventory with warehouse filter:', error);
        commit('SET_INVENTORY_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_INVENTORY_LOADING', false);
      }
    },

    async setupOptimizedRealtimeUpdates({ commit, state }, itemIds) {
      if (!state.realtimeMode || !itemIds || itemIds.length === 0) return;

      try {
        console.log(`🔴 Setting up optimized real-time for ${itemIds.length} items`);

        const limitedItemIds = itemIds.slice(0, PERFORMANCE_CONFIG.MAX_REALTIME_LISTENERS);

        state.realtimeListeners.forEach(listener => {
          try {
            if (typeof listener === 'function') {
              listener();
            }
          } catch (error) {
            console.warn('Error unsubscribing listener:', error);
          }
        });
        state.realtimeListeners = [];
        state.activeItemListeners.clear();

        if (limitedItemIds.length <= PERFORMANCE_CONFIG.BATCH_SIZE) {
          const itemsRef = collection(db, 'items');
          const q = query(
            itemsRef,
            where('__name__', 'in', limitedItemIds)
          );

          const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach(change => {
              if (change.type === 'modified' || change.type === 'added') {
                const data = change.doc.data();
                const updatedItem = InventoryService.convertForDisplay({
                  id: change.doc.id,
                  ...data
                });

                commit('UPDATE_INVENTORY_ITEM', updatedItem);
              } else if (change.type === 'removed') {
                commit('REMOVE_INVENTORY_ITEM', change.doc.id);
              }
            });
          });

          commit('ADD_REALTIME_LISTENER', unsubscribe);

        } else {
          const listeners = limitedItemIds.map(itemId => {
            const itemRef = doc(db, 'items', itemId);

            const unsubscribe = onSnapshot(itemRef, (docSnapshot) => {
              if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                const updatedItem = InventoryService.convertForDisplay({
                  id: docSnapshot.id,
                  ...data
                });

                commit('UPDATE_INVENTORY_ITEM', updatedItem);
              } else {
                commit('REMOVE_INVENTORY_ITEM', itemId);
                commit('REMOVE_ITEM_LISTENER', itemId);
              }
            });

            return unsubscribe;
          });

          listeners.forEach(listener => commit('ADD_REALTIME_LISTENER', listener));
        }

        console.log(`✅ Optimized real-time updates set up for ${limitedItemIds.length} items`);

      } catch (error) {
        console.error('❌ Error setting up optimized real-time updates:', error);
      }
    },

    async loadWarehousesEnhanced({ commit, dispatch }) {
      try {
        console.log('🔄 Loading warehouses with enhanced filtering...');

        const warehousesRef = collection(db, 'warehouses');
        const q = query(warehousesRef, orderBy('name_ar'));
        const snapshot = await getDocs(q);

        const warehouses = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(warehouse => {
            return warehouse.type !== 'dispatch';
          });

        commit('SET_WAREHOUSES', warehouses);
        console.log(`✅ Warehouses loaded: ${warehouses.length} (dispatch warehouses excluded)`);

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

    async getDispatchWarehouses({ dispatch }) {
      try {
        const warehousesRef = collection(db, 'warehouses');
        const q = query(
          warehousesRef,
          where('type', '==', 'dispatch')
        );

        const snapshot = await getDocs(q);
        const dispatchWarehouses = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log(`✅ Dispatch warehouses loaded: ${dispatchWarehouses.length}`);
        return dispatchWarehouses;

      } catch (error) {
        console.error('❌ Error loading dispatch warehouses:', error);
        return [];
      }
    },

    async getTotalItemCount({ state }, warehouseId = 'all') {
      try {
        console.log(`📊 Getting total item count for ${warehouseId === 'all' ? 'all warehouses' : 'warehouse ' + warehouseId}`);

        const itemsRef = collection(db, 'items');

        if (warehouseId === 'all') {
          const q = query(itemsRef);
          const snapshot = await getCountFromServer(q);
          return snapshot.data().count;
        } else {
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

    async refreshDashboardCounts({ commit, state, dispatch }, warehouseId = 'all') {
      try {
        console.log('🔄 Refreshing dashboard counts...');

        const totalItems = await dispatch('getTotalItemCount', warehouseId);
        const lowStockItems = await dispatch('getLowStockCount', warehouseId);
        const totalQuantity = await dispatch('getTotalQuantitySum', warehouseId);

        const counts = {
          totalItems,
          totalQuantity,
          lowStockItems,
          lastUpdated: new Date()
        };

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
            where('name', '==', itemName),
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
        console.log('🔄 Using direct search...');
        const searchTerm = itemCode || itemName || '';
        if (searchTerm.length >= 2) {
          const searchResults = await dispatch('searchInventorySpark', {
            searchQuery: searchTerm,
            limitResults: 10
          });
          if (searchResults.length > 0) {
            const foundItem = searchResults[0];
            console.log('✅ Item found through direct search');
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
          await dispatch('setupOptimizedRealtimeUpdates', inventory.map(item => item.id));
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
          await dispatch('setupOptimizedRealtimeUpdates', newItems.map(item => item.id));
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

    async setupRealtimeUpdatesForInventory({ commit, state, dispatch }) {
      if (!state.realtimeMode || state.inventory.length === 0) return;

      try {
        console.log('🔴 Setting up real-time updates for inventory...');

        commit('CLEAR_REALTIME_LISTENERS');

        const listeners = state.inventory.map(item => {
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
            } else {
              commit('REMOVE_INVENTORY_ITEM', item.id);
              commit('REMOVE_ITEM_LISTENER', item.id);
            }
          }, (error) => {
            console.error(`❌ Real-time error for item ${item.id}:`, error);
            commit('REMOVE_ITEM_LISTENER', item.id);
          });

          commit('ADD_ITEM_LISTENER', item.id);
          return unsubscribe;
        }).filter(Boolean);

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
            } else {
              commit('REMOVE_INVENTORY_ITEM', itemId);
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

        // Use enhanced search
        if (search && search.length >= PERFORMANCE_CONFIG.MIN_SEARCH_CHARS) {
          const results = await dispatch('searchInventorySpark', {
            searchQuery: search,
            warehouseId: warehouse
          });

          commit('SET_INVENTORY', results);
          commit('SET_INVENTORY_LOADED', true);
          commit('SET_PAGINATION', {
            hasMore: false,
            totalLoaded: results.length
          });

          return results;
        }

        // Original logic for non-search queries
        const itemsRef = collection(db, 'items');
        let itemsQuery;

        if (state.userProfile.role === 'superadmin' || state.userProfile.role === 'company_manager') {
          if (warehouse) {
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
            if (warehouse) {
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

            if (warehouse && warehousesFilter.includes(warehouse)) {
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
          hasMore: snapshot.size === PERFORMANCE_CONFIG.INITIAL_LOAD,
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

    async loadWarehouses({ dispatch }) {
      try {
        console.log('🔄 Loading warehouses...');

        const warehousesRef = collection(db, 'warehouses');
        const q = query(warehousesRef, orderBy('name_ar'));
        const snapshot = await getDocs(q);

        const warehouses = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

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

                await dispatch('loadWarehousesEnhanced');
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

      // ============================================
    // USER PROFILE ACTION 
    // ============================================
    async loadUserProfile({ commit, state, dispatch }) {
      try {
        console.log('🔄 Loading user profile...');
        
        if (!state.user || !state.user.uid) {
          console.log('❌ No user found');
          return null;
        }
        
        // Get user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', state.user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('✅ User profile loaded:', userData);
          
          // Save user profile to state
          const userProfile = {
            id: state.user.uid,
            email: state.user.email,
            name: userData.name || state.user.displayName || state.user.email.split('@')[0],
            role: userData.role || 'viewer',
            permissions: userData.permissions || [],
            allowed_warehouses: userData.allowed_warehouses || [],
            is_active: userData.is_active !== false,
            profile_complete: userData.profile_complete || false,
            createdAt: userData.createdAt || new Date(),
            lastLogin: new Date()
          };
          
          commit('SET_USER_PROFILE', userProfile);
          return userProfile;
          
        } else {
          console.log('⚠️ User document not found, creating default profile');
          
          // Create default profile
          const defaultProfile = {
            id: state.user.uid,
            email: state.user.email,
            name: state.user.displayName || state.user.email.split('@')[0],
            role: 'viewer',
            permissions: [],
            allowed_warehouses: [],
            is_active: true,
            profile_complete: false,
            createdAt: new Date(),
            lastLogin: new Date()
          };
          
          // Save default profile to Firestore
          await setDoc(doc(db, 'users', state.user.uid), defaultProfile, { merge: true });
          
          commit('SET_USER_PROFILE', defaultProfile);
          return defaultProfile;
        }
        
      } catch (error) {
        console.error('❌ Error loading user profile:', error);
        
        // Create a minimal profile as fallback
        const fallbackProfile = {
          id: state.user?.uid,
          email: state.user?.email,
          name: state.user?.displayName || state.user?.email?.split('@')[0] || 'مستخدم',
          role: 'viewer',
          permissions: [],
          allowed_warehouses: [],
          is_active: true,
          profile_complete: false,
          createdAt: new Date(),
          lastLogin: new Date()
        };
        
        commit('SET_USER_PROFILE', fallbackProfile);
        return fallbackProfile;
      }
    },
    
        // ============================================
    // LOAD USERS ACTION 
    // ============================================
       async loadUsers({ commit, state, dispatch }) {
      try {
        console.log('🔄 Loading all users...');
        
        if (state.userProfile?.role !== 'superadmin') {
          console.log('⚠️ User is not superadmin, skipping users load');
          return [];
        }
        
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('created_at', 'desc'));
        const snapshot = await getDocs(q);
        
        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log(`✅ Users loaded: ${users.length}`);
        commit('SET_ALL_USERS', users);
        return users;
        
      } catch (error) {
        console.error('❌ Error loading users:', error);
        
        // Only show notification if user is admin
        if (state.userProfile?.role === 'superadmin') {
          dispatch('showNotification', {
            type: 'error',
            message: error.message || 'خطأ في تحميل المستخدمين'
          });
        }
        
        return [];
      }
    },
   showNotification({ commit }, notification) {
  if (!notification?.message) return;

  let duration = NOTIFICATION_CONFIG.DEFAULT_DURATION;
  if (notification.type === 'error') {
    duration = NOTIFICATION_CONFIG.ERROR_DURATION;
  } else if (notification.type === 'success') {
    duration = NOTIFICATION_CONFIG.SUCCESS_DURATION;
  }

  const finalNotification = {
    id: Date.now().toString(),
    type: 'info',
    duration,
    ...notification,
    timestamp: new Date()
  };

  const timeoutId = setTimeout(() => {
    commit('REMOVE_NOTIFICATION', finalNotification.id);
  }, duration);

  commit('ADD_NOTIFICATION', { 
    notification: finalNotification, 
    timeoutId 
  });
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

        if (search && search.length >= 2) {
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

        let invoices = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date?.toDate?.() || data.date
          };
        });

        if (search && search.length >= 2) {
          const searchLower = search.toLowerCase();
          invoices = invoices.filter(invoice => 
            invoice.invoiceNumber.toString().includes(searchLower) ||
            invoice.customer?.name?.toLowerCase().includes(searchLower) ||
            invoice.customer?.phone?.includes(searchLower)
          );
        }

        if (status) {
          invoices = invoices.filter(invoice => invoice.status === status);
        }

        if (type) {
          invoices = invoices.filter(invoice => invoice.type === type);
        }

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

        if (!['superadmin', 'warehouse_manager', 'company_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لإنشاء فواتير');
        }

        if (!invoiceData.customer?.name?.trim() || !invoiceData.customer?.phone?.trim()) {
          throw new Error('جميع الحقول المطلوبة يجب أن تكون مملوءة (اسم العميل، الهاتف)');
        }

        if (!invoiceData.items || invoiceData.items.length === 0) {
          throw new Error('يجب إضافة أصناف على الأقل للفاتورة');
        }

        if (!invoiceData.warehouseId) {
          throw new Error('يجب تحديد المخزن');
        }

        const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
        if (!phoneRegex.test(invoiceData.customer.phone)) {
          throw new Error('يرجى إدخال رقم هاتف صحيح (مثال: 01012345678)');
        }

        if (invoiceData.type === 'B2B' && (!invoiceData.customer.taxId || invoiceData.customer.taxId.length < 9)) {
          throw new Error('يرجى إدخال رقم ضريبي صالح (9 أرقام على الأقل) للفواتير الضريبية');
        }

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

        const lastInvoice = state.invoices[0];
        const lastNumber = lastInvoice ? lastInvoice.invoiceNumber : 0;
        const invoiceNumber = lastNumber + 1;

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

        const docRef = await addDoc(collection(db, 'invoices'), cleanInvoiceData);

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
          new_remaining: 0,
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

        if (!['superadmin', 'warehouse_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لتعديل الفواتير');
        }

        const invoiceRef = doc(db, 'invoices', invoiceId);
        const invoiceDoc = await getDoc(invoiceRef);

        if (!invoiceDoc.exists()) {
          throw new Error('الفاتورة غير موجودة');
        }

        const existingInvoice = invoiceDoc.data();

        if (existingInvoice.status !== 'draft') {
          throw new Error('لا يمكن تعديل فاتورة غير مسودة');
        }

        if (!invoiceData.customer?.name?.trim() || !invoiceData.customer?.phone?.trim()) {
          throw new Error('جميع الحقول المطلوبة يجب أن تكون مملوءة (اسم العميل، الهاتف)');
        }

        if (!invoiceData.items || invoiceData.items.length === 0) {
          throw new Error('يجب إضافة أصناف على الأقل للفاتورة');
        }

        if (!invoiceData.warehouseId) {
          throw new Error('يجب تحديد المخزن');
        }

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

        if (!['superadmin', 'warehouse_manager', 'company_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لحذف الفواتير');
        }

        const invoiceRef = doc(db, 'invoices', invoiceId);
        const invoiceDoc = await getDoc(invoiceRef);

        if (!invoiceDoc.exists()) {
          throw new Error('الفاتورة غير موجودة');
        }

        const existingInvoice = invoiceDoc.data();

        if (existingInvoice.status !== 'draft') {
          throw new Error('لا يمكن حذف فاتورة غير مسودة');
        }

        const confirmDelete = confirm('هل أنت متأكد من حذف هذه الفاتورة؟');
        if (!confirmDelete) {
          return { success: false, message: 'تم إلغاء العملية' };
        }

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

    async getInvoiceById({ state, dispatch }, invoiceId) {
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

        let invoicesToExport = state.invoices;

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

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);

        const wscols = [
          { wch: 12 },
          { wch: 12 },
          { wch: 15 },
          { wch: 12 },
          { wch: 20 },
          { wch: 15 },
          { wch: 15 },
          { wch: 10 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 10 },
          { wch: 30 }
        ];
        ws['!cols'] = wscols;

        XLSX.utils.book_append_sheet(wb, ws, 'الفواتير');

        const filename = `الفواتير_${new Date().toISOString().split('T')[0]}.xlsx`;

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

    // Enhanced Search Getters
    searchQuery: state => state.search.query,
    searchResults: state => state.search.results,
    searchLoading: state => state.search.loading,
    searchError: state => state.search.error,
    searchSource: state => state.search.source,
    searchSuggestions: state => state.search.suggestions,
    warehouseFilter: state => state.warehouseFilter,

    // Enhanced Filtered Inventory
    filteredInventoryEnhanced: (state, getters) => {
      let inventory = state.inventory;

      if (state.warehouseFilter && state.warehouseFilter !== 'all') {
        inventory = inventory.filter(item => item.warehouse_id === state.warehouseFilter);
      }

      if (state.search.query && state.search.query.length >= PERFORMANCE_CONFIG.MIN_SEARCH_CHARS) {
        if (state.search.results.length > 0 && 
            state.search.source !== 'none' &&
            Date.now() - new Date(state.search.timestamp).getTime() < 10000) {
          return state.search.results;
        }

        const searchTerm = state.search.query.toLowerCase();
        inventory = inventory.filter(item => 
          item.name?.toLowerCase().includes(searchTerm) ||
          item.code?.toLowerCase().includes(searchTerm) ||
          item.color?.toLowerCase().includes(searchTerm) ||
          item.supplier?.toLowerCase().includes(searchTerm)
        );
      }

      return inventory;
    },

    // Warehouse-aware statistics
    warehouseStats: (state) => (warehouseId) => {
      const inventory = warehouseId === 'all' 
        ? state.inventory 
        : state.inventory.filter(item => item.warehouse_id === warehouseId);

      const totalItems = inventory.length;
      const totalQuantity = inventory.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0);
      const lowStockItems = inventory.filter(item => (item.remaining_quantity || 0) < 10 && (item.remaining_quantity || 0) > 0).length;
      const outOfStockItems = inventory.filter(item => (item.remaining_quantity || 0) === 0).length;

      return {
        totalItems,
        totalQuantity,
        lowStockItems,
        outOfStockItems,
        lastUpdated: new Date()
      };
    },

    // Enhanced warehouse filtering
    primaryWarehousesFiltered: (state, getters) => {
      return getters.accessibleWarehouses.filter(w => 
        w.type === 'primary' || !w.type
      );
    },

    dispatchWarehousesFiltered: (state, getters) => {
      return getters.accessibleWarehouses.filter(w => w.type === 'dispatch');
    },

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

      if (state.invoiceFilters.search) {
        const searchLower = state.invoiceFilters.search.toLowerCase();
        filtered = filtered.filter(invoice => 
          invoice.invoiceNumber.toString().includes(searchLower) ||
          invoice.customer?.name?.toLowerCase().includes(searchLower) ||
          invoice.customer?.phone?.includes(searchLower)
        );
      }

      if (state.invoiceFilters.status) {
        filtered = filtered.filter(invoice => invoice.status === state.invoiceFilters.status);
      }

      if (state.invoiceFilters.type) {
        filtered = filtered.filter(invoice => invoice.type === state.invoiceFilters.type);
      }

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

    // FIXED: Remove cache reference since state.cache doesn't exist
    dashboardRealStats: (state) => (warehouseId = 'all') => {
      // Calculate real-time stats without cache
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

    // FIXED: Get warehouse label from warehouses array, not from non-existent cache
    getWarehouseLabel: (state) => (warehouseId) => {
      if (!warehouseId) return '';

      // Find warehouse in the warehouses array
      const warehouse = state.warehouses.find(w => w.id === warehouseId);

      // Return Arabic name if available, otherwise return warehouseId
      return warehouse?.name_ar || warehouse?.name || warehouseId;
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

    // FIXED: Remove cache reference for item details
    getCachedItem: (state) => (itemId) => {
      // Simply return the item from inventory if found
      return state.inventory.find(item => item.id === itemId) || null;
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
    },

    // ============================================
    // NEW GETTERS ADDED AS REQUESTED
    // ============================================

    // Note: primaryWarehouses and dispatchWarehouses already exist above
    // Note: accessibleWarehouses already exists above with different logic
    // Note: canManageUsers already exists above

    // Add any missing getters from your request that don't already exist:
    getRealTimeSearchAvailable: (state) => {
      return state.search.query && 
             state.search.query.length >= PERFORMANCE_CONFIG.MIN_SEARCH_CHARS &&
             state.search.results.length > 0 && 
             state.search.source === 'firebase';
    },

    getManualLoadStatus: (state) => {
      return {
        hasMore: state.pagination.hasMore,
        isFetchingMore: state.pagination.isFetching,
        totalLoaded: state.pagination.totalLoaded,
        nextBatchSize: PERFORMANCE_CONFIG.SCROLL_LOAD,
        canLoadMore: state.pagination.hasMore && !state.pagination.isFetching
      };
    },

    getFilteredSearchSuggestions: (state) => {
      if (!state.search.query || state.search.query.length < PERFORMANCE_CONFIG.MIN_SEARCH_CHARS) {
        return [];
      }

      const query = state.search.query.toLowerCase();
      return state.search.suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(query)
      ).slice(0, 10);
    },

    getSearchStats: (state) => {
      const localResults = state.inventory.filter(item => 
        state.search.query && 
        state.search.query.length >= PERFORMANCE_CONFIG.MIN_SEARCH_CHARS &&
        (
          item.name?.toLowerCase().includes(state.search.query.toLowerCase()) ||
          item.code?.toLowerCase().includes(state.search.query.toLowerCase()) ||
          item.color?.toLowerCase().includes(state.search.query.toLowerCase()) ||
          item.supplier?.toLowerCase().includes(state.search.query.toLowerCase())
        )
      ).length;

      return {
        localResults,
        firebaseResults: state.search.results.length,
        queryLength: state.search.query?.length || 0,
        isSearching: state.search.loading,
        lastSearchSource: state.search.source
      };
    },

    getWarehouseSearchResults: (state) => {
      if (!state.search.query || state.search.query.length < PERFORMANCE_CONFIG.MIN_SEARCH_CHARS) {
        return [];
      }

      const query = state.search.query.toLowerCase();
      const recentFirebaseResults = state.search.results.length > 0 && 
                                    state.search.source === 'firebase';

      if (recentFirebaseResults) {
        return state.search.results;
      }

      return state.inventory.filter(item => 
        item.name?.toLowerCase().includes(query) ||
        item.code?.toLowerCase().includes(query) ||
        item.color?.toLowerCase().includes(query) ||
        item.supplier?.toLowerCase().includes(query)
      );
    },

    getSearchReady: (state) => {
      return state.inventoryLoaded || 
             (state.search.query && 
              state.search.query.length >= PERFORMANCE_CONFIG.MIN_SEARCH_CHARS &&
              state.search.results.length > 0);
    }
  }
});