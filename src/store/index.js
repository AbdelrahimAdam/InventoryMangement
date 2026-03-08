// store/index.js 
import { createStore } from 'vuex';
import { 
  auth, 
  db, 
  initializeFirebase,  
  isFirebaseInitialized  
} from '@/firebase/config';
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
  Timestamp,
  // ✅ ADD THIS IMPORT
  runTransaction  // For atomic operations
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
// FIREBASE INITIALIZATION UTILITY
// ============================================
/**
 * Ensures Firebase is fully initialized before performing operations
 * @returns {Promise<Object>} Firebase services
 */
async function ensureFirebaseReady() {
  try {
    console.log('⏳ Ensuring Firebase is ready...');

    // Check if Firebase is already initialized
    if (isFirebaseInitialized()) {
      console.log('✅ Firebase is already initialized');
      return { auth, db };
    }

    // If not initialized, initialize it
    console.log('🔥 Initializing Firebase...');
    const services = await initializeFirebase();
    console.log('✅ Firebase initialized successfully');
    return services;

  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    throw new Error('Firebase is not available. Please try again.');
  }
}

/**
 * Get Firestore database with safety check
 * @returns {Promise<Object>} Firestore database instance
 */
async function getFirestoreDb() {
  await ensureFirebaseReady();
  if (!db) {
    throw new Error('Firestore database not available');
  }
  return db;
}

/**
 * Get Firebase auth with safety check
 * @returns {Promise<Object>} Firebase auth instance
 */
async function getFirebaseAuth() {
  await ensureFirebaseReady();
  if (!auth) {
    throw new Error('Firebase authentication not available');
  }
  return auth;
}

/**
 * Ensures all required item fields are present with proper defaults
 * @param {Object} item - The item object to complete
 * @returns {Object} - Complete item object with all fields
 */
function ensureCompleteItemFields(item) {
  if (!item) return null;
  
  // Define all possible fields with defaults
  const completeItem = {
    id: item.id || '',
    name: item.name || '',
    code: item.code || '',
    color: item.color || '',
    supplier: item.supplier || '',
    warehouse_id: item.warehouse_id || '',
    item_location: item.item_location || '',
    notes: item.notes || '',
    barcode: item.barcode || '',
    sku: item.sku || '',
    category: item.category || '',
    // Quantity fields
    cartons_count: Number(item.cartons_count) || 0,
    per_carton_count: Number(item.per_carton_count) || 12,
    single_bottles_count: Number(item.single_bottles_count) || 0,
    total_added: Number(item.total_added) || 0,
    remaining_quantity: Number(item.remaining_quantity) || 0,
    // Timestamps
    created_at: item.created_at || null,
    updated_at: item.updated_at || null,
    created_by: item.created_by || '',
    updated_by: item.updated_by || '',
    // Photo
    photo_url: item.photo_url || '',
    // Include any other fields from the original item
    ...item
  };
  
  // Ensure calculated fields are correct
  if (completeItem.remaining_quantity === 0 && 
      (completeItem.cartons_count > 0 || completeItem.single_bottles_count > 0)) {
    completeItem.remaining_quantity = (completeItem.cartons_count * completeItem.per_carton_count) + 
                                       completeItem.single_bottles_count;
  }
  
  return completeItem;
}

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
// ENHANCED ARABIC MATCHING WITH SCORING
// ============================================
function matchArabicTextWithScore(item, searchTerm, fields) {
  if (!searchTerm || !item) return { matched: false, score: 0 };

  const preparedSearchTerm = normalizeArabicText(searchTerm);
  let bestScore = 0;
  let matched = false;

  // Define all possible searchable fields
  const allSearchFields = [
    'name', 'code', 'color', 'supplier', 'item_location',
    'warehouse_id', 'notes', 'barcode', 'sku', 'category'
  ];

  // Use provided fields or all search fields
  const searchFields = fields && fields.length > 0 ? fields : allSearchFields;

  for (const field of searchFields) {
    const fieldValue = item[field];
    if (!fieldValue) continue;

    const preparedFieldValue = normalizeArabicText(fieldValue.toString());
    let fieldScore = 0;

    // 1. EXACT MATCH (highest score: 100)
    if (preparedFieldValue === preparedSearchTerm) {
      fieldScore = 100;
      matched = true;
    }

    // 2. STARTS WITH (score: 80-95 based on field importance)
    else if (preparedFieldValue.startsWith(preparedSearchTerm)) {
      fieldScore = 85;
      // Bonus for important fields
      if (field === 'code') fieldScore = 95;
      if (field === 'name') fieldScore = 90;
      matched = true;
    }

    // 3. CONTAINS (score: 60-85)
    else if (preparedFieldValue.includes(preparedSearchTerm)) {
      fieldScore = 70;
      // Bonus for important fields
      if (field === 'name') fieldScore = 85;
      if (field === 'code') fieldScore = 80;
      if (field === 'supplier') fieldScore = 75;
      matched = true;
    }

    // 4. WORD-BY-WORD MATCHING (for multi-word searches)
    else if (preparedSearchTerm.includes(' ')) {
      const searchWords = preparedSearchTerm.split(/\s+/);
      const fieldWords = preparedFieldValue.split(/\s+/);

      let matchedWords = 0;
      for (const searchWord of searchWords) {
        for (const fieldWord of fieldWords) {
          if (fieldWord.includes(searchWord)) {
            matchedWords++;
            break;
          }
        }
      }

      // Score based on percentage of words matched
      if (matchedWords > 0) {
        const matchRatio = matchedWords / searchWords.length;
        fieldScore = Math.floor(40 + (matchRatio * 40)); // 40-80 range
        if (field === 'name') fieldScore += 10;
        matched = true;
      }
    }

    // 5. PARTIAL WORD MATCHING (fuzzy)
    else if (preparedSearchTerm.length >= 2) {
      // Check if search term appears within words
      const fieldWords = preparedFieldValue.split(/\s+/);
      for (const fieldWord of fieldWords) {
        if (fieldWord.includes(preparedSearchTerm)) {
          fieldScore = 50;
          if (field === 'name') fieldScore = 60;
          matched = true;
          break;
        }
      }

      // Character-by-character similarity for short terms
      if (!matched && preparedSearchTerm.length >= 3) {
        const similarity = calculateArabicSimilarity(preparedFieldValue, preparedSearchTerm);
        if (similarity > 0.7) {
          fieldScore = Math.floor(similarity * 60); // 42-60 range
          if (field === 'name') fieldScore += 10;
          matched = true;
        }
      }
    }

    // Update best score if this field scored higher
    if (fieldScore > bestScore) {
      bestScore = fieldScore;
    }
  }

  // Apply bonuses
  if (matched) {
    // Bonus for quantity availability
    const quantity = item.remaining_quantity || 0;
    if (quantity > 0) {
      bestScore += Math.min(quantity / 10, 5); // Up to 5 points for quantity
    }

    // Bonus for recent updates
    if (item.updated_at) {
      const updateDate = item.updated_at.toDate ? item.updated_at.toDate() : new Date(item.updated_at);
      const daysAgo = (Date.now() - updateDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysAgo < 7) {
        bestScore += 5; // Recent items get bonus
      }
    }

    // Bonus for exact code match
    if (item.code && normalizeArabicText(item.code) === preparedSearchTerm) {
      bestScore += 15;
    }
  }

  return { matched, score: bestScore };
}

// ============================================
// IMPROVED ARABIC SIMILARITY CALCULATION
// ============================================
function calculateArabicSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;

  const prep1 = normalizeArabicText(str1);
  const prep2 = normalizeArabicText(str2);

  // Quick checks
  if (prep1 === prep2) return 1.0;
  if (prep1.includes(prep2) || prep2.includes(prep1)) return 0.9;

  // Calculate Levenshtein-like similarity for Arabic
  const len1 = prep1.length;
  const len2 = prep2.length;
  const maxLen = Math.max(len1, len2);

  if (maxLen === 0) return 1.0;

  // Count matching characters in order
  let matches = 0;
  let i = 0, j = 0;

  while (i < len1 && j < len2) {
    if (prep1[i] === prep2[j]) {
      matches++;
      i++;
      j++;
    } else if (len1 > len2) {
      i++;
    } else {
      j++;
    }
  }

  // Calculate similarity ratio
  return matches / maxLen;
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
  const otherFields = [
    'color', 'supplier', 'item_location', 'warehouse_id', 
    'notes', 'category', 'barcode', 'sku'
  ];

  otherFields.forEach(field => {
    if (item[field] && normalizeArabicText(item[field]).includes(normalizedSearchTerm)) {
      score += weights.OTHER_FIELDS;
    }
  });

  // Bonus for items with higher quantity (better availability)
  const quantity = item.remaining_quantity || 0;
  if (quantity > 0) {
    score += Math.min(quantity, weights.QUANTITY_BONUS);
  }

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
    score += 25; // Increased bonus for longer searches
  }

  // Bonus for exact matches in any field
  const allFields = ['name', 'code', 'color', 'supplier', 'item_location'];
  const hasExactMatch = allFields.some(field => 
    item[field] && normalizeArabicText(item[field]) === normalizedSearchTerm
  );

  if (hasExactMatch) {
    score += 30;
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
// ENHANCED FUZZY LOCAL SEARCH
// ============================================
function fuzzyLocalSearch(items, searchTerm, warehouseId, limit) {
  const normalizedTerm = normalizeArabicText(searchTerm);
  const terms = normalizedTerm.split(' ');

  const scoredItems = [];

  for (const item of items) {
    // Check warehouse filter
    if (warehouseId && warehouseId !== 'all' && item.warehouse_id !== warehouseId) {
      continue;
    }

    // Get match score using enhanced matching
    const { matched, score } = matchArabicTextWithScore(item, searchTerm, [
      'name', 'code', 'color', 'supplier', 'item_location'
    ]);

    if (matched && score > 30) { // Minimum score threshold
      scoredItems.push({ item, score });
    }
  }

  // Sort by score and limit
  scoredItems.sort((a, b) => b.score - a.score);
  return scoredItems.slice(0, limit).map(scored => scored.item);
}

// ============================================
// ENHANCED FIREBASE SEARCH ACTION WITH INITIALIZATION WAIT
// ============================================
async function searchFirebaseSpark({ state }, { query, warehouseId, limit }) {
  try {
    console.log(`🌐 SPARK Firebase search for: "${query}"`);

    // ✅ CRITICAL: Wait for Firebase to be fully initialized
    console.log('⏳ Ensuring Firebase is ready for Firebase search...');
    await ensureFirebaseReady();
    console.log('✅ Firebase ready for Firebase search');

    // Validate Firebase
    if (!db) {
      console.error('❌ Firebase not available after wait');
      return [];
    }

    const searchTerm = normalizeArabicText(query);

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
          firestoreLimit(Math.min(limit || SPARK_CONFIG.MAX_RESULTS, 50))
        );
      } else {
        itemsQuery = firestoreQuery(
          itemsRef,
          orderBy('updated_at', 'desc'),
          firestoreLimit(Math.min(limit || SPARK_CONFIG.MAX_RESULTS, 50))
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
            firestoreLimit(Math.min(limit || SPARK_CONFIG.MAX_RESULTS, 50))
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
            firestoreLimit(Math.min(limit || SPARK_CONFIG.MAX_RESULTS, 50))
          );
        } else {
          try {
            itemsQuery = firestoreQuery(
              itemsRef,
              where('warehouse_id', 'in', validIds),
              orderBy('updated_at', 'desc'),
              firestoreLimit(Math.min(limit || SPARK_CONFIG.MAX_RESULTS, 40))
            );
          } catch (inError) {
            console.warn('"in" query failed, using single warehouse:', inError);
            itemsQuery = firestoreQuery(
              itemsRef,
              where('warehouse_id', '==', validIds[0]),
              orderBy('updated_at', 'desc'),
              firestoreLimit(Math.min(limit || SPARK_CONFIG.MAX_RESULTS, 50))
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

    // Process items
    const allItems = [];
    snapshot.forEach(doc => {
      try {
        const data = doc.data();

        const item = {
          id: doc.id,
          name: data.name || '',
          code: data.code || '',
          color: data.color || '',
          supplier: data.supplier || '',
          warehouse_id: data.warehouse_id || '',
          remaining_quantity: data.remaining_quantity || 0,
          updated_at: data.updated_at,
          // Include additional fields for better search
          item_location: data.item_location || '',
          notes: data.notes || '',
          barcode: data.barcode || '',
          sku: data.sku || '',
          category: data.category || ''
        };

        allItems.push(item);
      } catch (docError) {
        console.warn('⚠️ Error processing document:', docError);
      }
    });

    console.log(`✅ SPARK Processed ${allItems.length} items from Firebase`);

    // Filter and score items
    searchResults = [];
    for (const item of allItems) {
      if (searchResults.length >= SPARK_CONFIG.MAX_RESULTS * 3) break;

      // Warehouse filter
      if (warehouseId && warehouseId !== 'all' && item.warehouse_id !== warehouseId) {
        continue;
      }

      // Search filter with scoring
      const { matched, score } = matchArabicTextWithScore(item, query, [
        'name', 'code', 'color', 'supplier', 'item_location',
        'notes', 'barcode', 'sku', 'category'
      ]);

      if (matched && score > 30) { // Minimum threshold
        searchResults.push({ item, score });
      }
    }

    console.log(`🔍 SPARK Found ${searchResults.length} matching items`);

    // Sort by score and limit
    searchResults.sort((a, b) => b.score - a.score);
    const finalResults = searchResults
      .slice(0, Math.min(limit || SPARK_CONFIG.MAX_RESULTS, SPARK_CONFIG.MAX_RESULTS))
      .map(scored => scored.item);

    console.log(`🎯 SPARK Returning ${finalResults.length} relevant items`);
    return finalResults;

  } catch (error) {
    console.error('❌ SPARK Firebase search error:', error);
    return [];
  }
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

    const rawSearchTerm = searchQuery.trim();
    const targetWarehouse = warehouseId || state.warehouseFilter || 'all';

    commit('SET_SEARCH_LOADING', true);
    commit('SET_SEARCH_QUERY', rawSearchTerm);

    console.log(`🚀 SPARK Search: "${rawSearchTerm}" (warehouse: ${targetWarehouse}) | Strategy: ${strategy}`);

    // ✅ CRITICAL: Wait for Firebase to be fully initialized before any search
    console.log('⏳ Ensuring Firebase is ready for main search...');
    await ensureFirebaseReady();
    console.log('✅ Firebase ready for main search');

    // Check cache first
    const cacheKey = getCacheKey(rawSearchTerm, targetWarehouse, limit);
    const cachedResults = searchCache.get(cacheKey);

    if (cachedResults) {
      console.log(`✅ Using cached results for: "${rawSearchTerm}"`);
      commit('SET_SEARCH_RESULTS', {
        results: cachedResults.slice(0, limit),
        source: 'cache',
        query: rawSearchTerm
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
          searchTerm: rawSearchTerm,
          targetWarehouse,
          limit
        });
        break;

      case 'local_first':
        results = await dispatch('searchLocalFirstSpark', {
          searchTerm: rawSearchTerm,
          targetWarehouse,
          limit
        });
        break;

      case 'firebase_first':
        results = await dispatch('searchFirebaseFirstSpark', {
          searchTerm: rawSearchTerm,
          targetWarehouse,
          limit
        });
        break;

      default:
        results = await dispatch('searchHybridSpark', {
          searchTerm: rawSearchTerm,
          targetWarehouse,
          limit
        });
    }

    // Cache results if we found any
    if (results.length > 0) {
      searchCache.set(cacheKey, results);
      console.log(`💾 Cached ${results.length} results for: "${rawSearchTerm}"`);
    }

    // Determine source
    const source = results.length > 0 ? 'spark_hybrid' : 'none';

    // Update state
    commit('SET_SEARCH_RESULTS', {
      results: results.slice(0, limit),
      source,
      query: rawSearchTerm
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

    const firebasePromise = dispatch('searchFirebaseSparkEnhanced', {
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
    const firebaseResults = await dispatch('searchFirebaseSparkEnhanced', {
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
    const firebaseResults = await dispatch('searchFirebaseSparkEnhanced', {
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
// ENHANCED LOCAL SEARCH WITH COMPLETE FIELDS
// ============================================
async searchLocalSpark({ state }, {
  query,
  warehouseId,
  limit = SPARK_CONFIG.MAX_RESULTS
}) {
  if (!query || query.trim().length < 2) return [];

  const searchTerm = query.trim();

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

  console.log(`🔎 SPARK Local search for: "${searchTerm}" in ${items.length} items`);

  // Use enhanced fuzzy search with scoring
  const matches = fuzzyLocalSearch(items, searchTerm, warehouseId, limit * 2);

  console.log(`📍 SPARK Local search found ${matches.length} matches`);

  // FIXED: Ensure complete fields for all matches
  const completeMatches = matches.map(item => {
    return ensureCompleteItemFields(item);
  });

  // Sort by relevance
  return removeDuplicatesAndSortByRelevance(completeMatches, searchTerm, limit);
},

// ============================================
// ENHANCED FIREBASE SEARCH WITH COMPLETE FIELDS
// ============================================
async searchFirebaseSparkEnhanced({ state }, { query, warehouseId, limit }) {
  try {
    console.log(`🌐 SPARK Firebase Enhanced search for: "${query}"`);

    // ✅ CRITICAL: Wait for Firebase to be fully initialized
    console.log('⏳ Ensuring Firebase is ready for Firebase search...');
    await ensureFirebaseReady();
    console.log('✅ Firebase ready for Firebase search');

    // Validate Firebase
    if (!db) {
      console.error('❌ Firebase not available after wait');
      return [];
    }

    const rawSearchTerm = query.trim();
    const searchTerm = normalizeArabicText(rawSearchTerm);
    
    console.log(`🔤 Search debugging:`);
    console.log(`  Raw search term: "${rawSearchTerm}"`);
    console.log(`  Normalized term: "${searchTerm}"`);
    console.log(`  Search length: ${searchTerm.length}`);

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
          firestoreLimit(Math.min((limit || SPARK_CONFIG.MAX_RESULTS) * 3, 150))
        );
      } else {
        itemsQuery = firestoreQuery(
          itemsRef,
          orderBy('updated_at', 'desc'),
          firestoreLimit(Math.min((limit || SPARK_CONFIG.MAX_RESULTS) * 3, 150))
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
            firestoreLimit(Math.min((limit || SPARK_CONFIG.MAX_RESULTS) * 3, 150))
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
            firestoreLimit(Math.min((limit || SPARK_CONFIG.MAX_RESULTS) * 3, 150))
          );
        } else {
          try {
            itemsQuery = firestoreQuery(
              itemsRef,
              where('warehouse_id', 'in', validIds),
              orderBy('updated_at', 'desc'),
              firestoreLimit(Math.min((limit || SPARK_CONFIG.MAX_RESULTS) * 3, 120))
            );
          } catch (inError) {
            console.warn('"in" query failed, using single warehouse:', inError);
            itemsQuery = firestoreQuery(
              itemsRef,
              where('warehouse_id', '==', validIds[0]),
              orderBy('updated_at', 'desc'),
              firestoreLimit(Math.min((limit || SPARK_CONFIG.MAX_RESULTS) * 3, 150))
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

    // Process items with COMPLETE FIELDS
    const allItems = [];
    snapshot.forEach(doc => {
      try {
        const data = doc.data();
        
        // CREATE COMPLETE ITEM WITH ALL FIELDS
        const item = ensureCompleteItemFields({
          ...data,
          id: doc.id
        });

        allItems.push(item);
      } catch (docError) {
        console.warn('⚠️ Error processing document:', docError);
      }
    });

    console.log(`✅ SPARK Processed ${allItems.length} COMPLETE items from Firebase`);

    // DEBUG: Check first few items for Arabic text
    if (allItems.length > 0 && searchTerm) {
      console.log('🔍 DEBUG: Checking Arabic text normalization:');
      for (let i = 0; i < Math.min(3, allItems.length); i++) {
        const item = allItems[i];
        const normalizedName = normalizeArabicText(item.name);
        const normalizedCode = normalizeArabicText(item.code);
        console.log(`  Item ${i} (${item.id}):`);
        console.log(`    Original Name: "${item.name}"`);
        console.log(`    Normalized Name: "${normalizedName}"`);
        console.log(`    Original Code: "${item.code}"`);
        console.log(`    Normalized Code: "${normalizedCode}"`);
        console.log(`    Cartons: ${item.cartons_count}, Singles: ${item.single_bottles_count}`);
        console.log(`    Search Term: "${searchTerm}"`);
        console.log(`    Name contains search: ${normalizedName.includes(searchTerm)}`);
        console.log(`    Code contains search: ${normalizedCode.includes(searchTerm)}`);
      }
    }

    // Filter and score items with IMPROVED Arabic matching
    searchResults = [];
    for (const item of allItems) {
      if (searchResults.length >= SPARK_CONFIG.MAX_RESULTS * 3) break;

      // Warehouse filter
      if (warehouseId && warehouseId !== 'all' && item.warehouse_id !== warehouseId) {
        continue;
      }

      // IMPROVED: Use enhanced Arabic matching with multiple approaches
      let matched = false;
      let score = 0;

      // Approach 1: Check code first (most important)
      if (item.code) {
        const normalizedCode = normalizeArabicText(item.code);
        if (normalizedCode === searchTerm) {
          score = 100; // Exact code match
          matched = true;
        } else if (normalizedCode.includes(searchTerm)) {
          score = 80; // Code contains search term
          matched = true;
        } else if (searchTerm.includes(normalizedCode)) {
          score = 60; // Search term contains code (partial)
          matched = true;
        }
      }

      // Approach 2: Check name (if code didn't match or needs boosting)
      if (!matched || score < 70) {
        if (item.name) {
          const normalizedName = normalizeArabicText(item.name);
          if (normalizedName === searchTerm) {
            score = Math.max(score, 90); // Exact name match
            matched = true;
          } else if (normalizedName.includes(searchTerm)) {
            score = Math.max(score, 70); // Name contains search term
            matched = true;
          } else if (searchTerm.includes(normalizedName)) {
            score = Math.max(score, 50); // Search term contains name
            matched = true;
          } else {
            // Try word-by-word matching for multi-word searches
            const searchWords = searchTerm.split(/\s+/).filter(w => w.length > 1);
            const nameWords = normalizedName.split(/\s+/);
            
            let wordMatches = 0;
            for (const searchWord of searchWords) {
              for (const nameWord of nameWords) {
                if (nameWord.includes(searchWord)) {
                  wordMatches++;
                  break;
                }
              }
            }
            
            if (wordMatches > 0) {
              const matchPercentage = wordMatches / searchWords.length;
              score = Math.max(score, Math.floor(30 + (matchPercentage * 40)));
              matched = true;
            }
          }
        }
      }

      // Approach 3: Check other fields
      if (!matched || score < 40) {
        const otherFields = ['color', 'supplier', 'item_location', 'notes', 'barcode', 'sku', 'category'];
        for (const field of otherFields) {
          const fieldValue = item[field];
          if (fieldValue) {
            const normalizedFieldValue = normalizeArabicText(fieldValue);
            if (normalizedFieldValue.includes(searchTerm)) {
              score = Math.max(score, 40);
              matched = true;
              break;
            }
          }
        }
      }

      // FIXED: LOWER threshold from 30 to 15 for better Arabic matching
      if (matched && score > 15) {
        searchResults.push({ item, score });
      }
    }

    console.log(`🔍 SPARK Found ${searchResults.length} matching items`);

    // Sort by score and limit
    searchResults.sort((a, b) => b.score - a.score);
    const finalResults = searchResults
      .slice(0, Math.min(limit || SPARK_CONFIG.MAX_RESULTS, SPARK_CONFIG.MAX_RESULTS))
      .map(scored => scored.item);

    console.log(`🎯 SPARK Returning ${finalResults.length} relevant items`);
    
    // DEBUG: Show what we're returning
    if (finalResults.length > 0) {
      console.log('📋 Results summary:');
      finalResults.forEach((item, index) => {
        const normalizedName = normalizeArabicText(item.name);
        const normalizedCode = normalizeArabicText(item.code);
        console.log(`  ${index + 1}. "${item.name}" -> "${normalizedName}" | "${item.code}" -> "${normalizedCode}"`);
        console.log(`     Cartons: ${item.cartons_count}, Singles: ${item.single_bottles_count}, Total: ${item.total_added}`);
      });
    }

    return finalResults;

  } catch (error) {
    console.error('❌ SPARK Firebase search error:', error);
    return [];
  }
},

// ============================================
// LEGACY COMPATIBILITY - Keep original function
// ============================================
async searchFirebaseSpark({ state }, { query, warehouseId, limit }) {
  // Redirect to enhanced version
  return await this.searchFirebaseSparkEnhanced({ state }, { query, warehouseId, limit });
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
    // NEW: UPDATE ITEM QUANTITIES ACTION
    // ============================================
    async updateItemQuantities({ commit, state, dispatch }, {
      itemId,
      existingItem,
      newQuantities,
      isAddingCartons = true
    }) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        console.log('🔄 Updating item quantities:', { itemId, existingItem, newQuantities });

        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        if (!['superadmin', 'warehouse_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لتحديث الكميات');
        }

        if (!itemId || !existingItem) {
          throw new Error('بيانات التحديث غير مكتملة');
        }

        // Check warehouse access
        const warehouseId = existingItem.warehouse_id;
        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
            if (!allowedWarehouses.includes(warehouseId)) {
              throw new Error('ليس لديك صلاحية للتحديث في هذا المخزن');
            }
          }
        }

        // Get the current item from Firestore
        const itemRef = doc(db, 'items', itemId);
        const itemDoc = await getDoc(itemRef);

        if (!itemDoc.exists()) {
          throw new Error('الصنف غير موجود');
        }

        const currentItem = itemDoc.data();

        // Calculate new quantities
        const cartonsCount = newQuantities.cartons_count || 0;
        const perCartonCount = newQuantities.per_carton_count || 12;
        const singleBottlesCount = newQuantities.single_bottles_count || 0;

        // Calculate the added quantity
        const addedCartonsQuantity = cartonsCount * perCartonCount;
        const addedTotalQuantity = addedCartonsQuantity + singleBottlesCount;

        if (addedTotalQuantity <= 0) {
          throw new Error('يجب إدخال كمية صحيحة للإضافة');
        }

        // Calculate new totals
        const currentRemaining = currentItem.remaining_quantity || 0;
        const currentTotalAdded = currentItem.total_added || 0;

        const newRemaining = currentRemaining + addedTotalQuantity;
        const newTotalAdded = currentTotalAdded + addedTotalQuantity;

        // Update data
        const updateData = {
          cartons_count: (currentItem.cartons_count || 0) + cartonsCount,
          per_carton_count: perCartonCount, // Use the new per_carton_count
          single_bottles_count: (currentItem.single_bottles_count || 0) + singleBottlesCount,
          remaining_quantity: newRemaining,
          total_added: newTotalAdded,
          updated_at: serverTimestamp(),
          updated_by: state.user.uid
        };

        // Optional fields update if provided
        if (newQuantities.supplier !== undefined) {
          updateData.supplier = newQuantities.supplier?.trim() || '';
        }

        if (newQuantities.item_location !== undefined) {
          updateData.item_location = newQuantities.item_location?.trim() || '';
        }

        if (newQuantities.notes !== undefined) {
          updateData.notes = newQuantities.notes?.trim() || '';
        }

        // Update the item
        await updateDoc(itemRef, updateData);

        // Create transaction record
        const transactionData = {
          type: TRANSACTION_TYPES.ADD,
          item_id: itemId,
          item_name: currentItem.name,
          item_code: currentItem.code,
          from_warehouse: null,
          to_warehouse: warehouseId,
          cartons_delta: cartonsCount,
          per_carton_updated: perCartonCount,
          single_delta: singleBottlesCount,
          total_delta: addedTotalQuantity,
          new_remaining: newRemaining,
          user_id: state.user.uid,
          timestamp: serverTimestamp(),
          notes: newQuantities.notes || `إضافة كميات للصنف: ${cartonsCount} كراتين، ${singleBottlesCount} فردي`,
          created_by: state.userProfile?.name || state.user?.email || 'نظام'
        };

        await addDoc(collection(db, 'transactions'), transactionData);

        // Create item history record
        const itemHistoryData = {
          item_id: itemId,
          warehouse_id: warehouseId,
          change_type: 'UPDATE',
          old_quantity: currentRemaining,
          new_quantity: newRemaining,
          quantity_delta: addedTotalQuantity,
          user_id: state.user.uid,
          timestamp: serverTimestamp(),
          details: {
            name: currentItem.name,
            code: currentItem.code,
            color: currentItem.color,
            cartons_added: cartonsCount,
            per_carton: perCartonCount,
            single_added: singleBottlesCount,
            total_added: addedTotalQuantity,
            notes: newQuantities.notes
          }
        };

        await addDoc(collection(db, 'item_history'), itemHistoryData);

        // Update local state
        const updatedItem = {
          id: itemId,
          ...currentItem,
          ...updateData
        };

        const convertedItem = InventoryService.convertForDisplay(updatedItem);
        commit('UPDATE_INVENTORY_ITEM', convertedItem);
        commit('ADD_RECENT_TRANSACTION', transactionData);

        dispatch('showNotification', {
          type: 'success',
          message: `تم تحديث كميات الصنف "${currentItem.name}" بنجاح. تمت إضافة ${addedTotalQuantity} وحدة`
        });

        return {
          success: true,
          type: 'updated',
          item: convertedItem,
          addedQuantity: addedTotalQuantity,
          newRemaining: newRemaining
        };

      } catch (error) {
        console.error('❌ Error updating item quantities:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في تحديث الكميات'
        });

        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },
// ============================================
// UPDATED: ADD INVENTORY ITEM ACTION (WITH NAME+CODE+COLOR MATCHING)
// ============================================
async addInventoryItem({ commit, state, dispatch }, { itemData, isAddingCartons = true }) {
  commit('SET_OPERATION_LOADING', true);
  commit('CLEAR_OPERATION_ERROR');

  try {
    console.log('🔄 addInventoryItem called with:', {
      itemData: { 
        name: itemData.name,
        code: itemData.code,
        color: itemData.color,
        warehouse_id: itemData.warehouse_id,
        cartons_count: itemData.cartons_count,
        single_bottles_count: itemData.single_bottles_count
      },
      isAddingCartons
    });

    // 🔴 VALIDATION 1: User authentication
    if (!state.userProfile) {
      throw new Error('يجب تسجيل الدخول أولاً');
    }
    if (!['superadmin', 'warehouse_manager'].includes(state.userProfile.role)) {
      throw new Error('ليس لديك صلاحية لإضافة أصناف');
    }
    if (!state.user?.uid) {
      throw new Error('معرف المستخدم غير متوفر');
    }

    // 🔴 VALIDATION 2: Required fields
    if (!itemData.name?.trim() || !itemData.code?.trim() || !itemData.warehouse_id || !itemData.color?.trim()) {
      throw new Error('جميع الحقول المطلوبة يجب أن تكون مملوءة (الاسم، الكود، اللون، المخزن)');
    }

    // 🔴 VALIDATION 3: Warehouse access
    const warehouseId = itemData.warehouse_id;
    if (state.userProfile.role === 'warehouse_manager') {
      const allowedWarehouses = state.userProfile.allowed_warehouses || [];
      if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
        if (!allowedWarehouses.includes(warehouseId)) {
          throw new Error('ليس لديك صلاحية لإضافة/تعديل أصناف في هذا المخزن');
        }
      }
    }

    // ============================================
    // 🔴 STEP 1: CHECK FOR EXISTING ITEM WITH SAME NAME, CODE, COLOR IN SAME WAREHOUSE
    // ============================================
    console.log('🔍 Checking for existing item with same name, code, color in warehouse...');
    
    let existingItem = null;
    let existingItemId = null;
    
    const cleanedData = {
      name: itemData.name.trim(),
      code: itemData.code.trim(),
      color: itemData.color.trim(),
      warehouse_id: warehouseId
    };

    console.log('🔍 Searching for item with:', cleanedData);

    try {
      // Query Firestore for exact match: name + code + color + warehouse
      const itemsRef = collection(db, 'items');
      const q = query(
        itemsRef,
        where('name', '==', cleanedData.name),
        where('code', '==', cleanedData.code),
        where('color', '==', cleanedData.color),
        where('warehouse_id', '==', cleanedData.warehouse_id),
        limit(1)
      );
      
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        existingItem = snapshot.docs[0].data();
        existingItemId = snapshot.docs[0].id;
        console.log('✅ Found existing item with same name+code+color+warehouse:', {
          id: existingItemId,
          name: existingItem.name,
          code: existingItem.code,
          color: existingItem.color,
          warehouse: existingItem.warehouse_id,
          cartons_count: existingItem.cartons_count,
          per_carton_count: existingItem.per_carton_count,
          single_bottles_count: existingItem.single_bottles_count,
          total_added: existingItem.total_added,
          remaining_quantity: existingItem.remaining_quantity
        });
      } else {
        console.log('📭 No existing item found - will create new item');
      }
    } catch (error) {
      console.error('❌ Error checking existing item:', error.message);
      console.log('⚠️ Will create new item due to check error');
    }

    // ============================================
    // 🔴 STEP 2: BUSINESS LOGIC CALCULATIONS
    // ============================================
    
    let result;
    let totalQuantity = 0; // 🔴 DECLARE THIS AT THE TOP
    let additionalCartonsFromSingles = 0; // 🔴 DECLARE THIS AT THE TOP
    let isCreatingNewItem = false;
    
    if (existingItem && existingItemId) {
      console.log('🔄 UPDATING existing item with ID:', existingItemId);
      
      // Get the item reference
      const itemRef = doc(db, 'items', existingItemId);
      
      // 🔴 BUSINESS RULE 1: عدد الكراتين - OLD + NEW (only if adding cartons)
      const newCartonsCount = Number(itemData.cartons_count) || 0;
      const currentCartonsCount = Number(existingItem.cartons_count) || 0;
      let finalCartonsCount = currentCartonsCount;
      
      if (isAddingCartons && newCartonsCount > 0) {
        finalCartonsCount = currentCartonsCount + newCartonsCount;
        console.log(`➕ عدد الكراتين: ${currentCartonsCount} + ${newCartonsCount} = ${finalCartonsCount}`);
      }
      
      // 🔴 BUSINESS RULE 2: عدد في الكرتونه - REPLACE OLD WITH NEW (only if user provides)
      const currentPerCarton = Number(existingItem.per_carton_count) || 12;
      const newPerCartonCount = Number(itemData.per_carton_count) || 0;
      let finalPerCartonCount = currentPerCarton;
      
      if (newPerCartonCount > 0) {
        finalPerCartonCount = newPerCartonCount;
        console.log(`🔄 عدد في الكرتونه: ${currentPerCarton} → ${newPerCartonCount}`);
      }
      
      // 🔴 BUSINESS RULE 3: عدد القزاز الفردي - REPLACE OLD WITH NEW (user enters new total)
      const currentSingleBottlesCount = Number(existingItem.single_bottles_count) || 0;
      const newSingleBottlesCount = Number(itemData.single_bottles_count) || 0;
      let finalSingleBottlesCount = currentSingleBottlesCount;
      
      // If user provided a value (including zero), replace the old value
      if (itemData.single_bottles_count !== undefined) {
        finalSingleBottlesCount = newSingleBottlesCount;
        console.log(`🔄 عدد القزاز الفردي: ${currentSingleBottlesCount} → ${newSingleBottlesCount}`);
      }
      
      // 🔴 BUSINESS RULE 4: Convert single bottles to cartons if they complete a full carton
      if (finalSingleBottlesCount >= finalPerCartonCount) {
        additionalCartonsFromSingles = Math.floor(finalSingleBottlesCount / finalPerCartonCount);
        finalSingleBottlesCount = finalSingleBottlesCount % finalPerCartonCount;
        finalCartonsCount += additionalCartonsFromSingles;
        
        console.log(`🔄 Converting single bottles to cartons: added ${additionalCartonsFromSingles} cartons, remaining singles: ${finalSingleBottlesCount}`);
      }
      
      // 🔴 BUSINESS RULE 5: Calculate quantities
      const currentRemaining = Number(existingItem.remaining_quantity) || 0;
      const currentTotalAdded = Number(existingItem.total_added) || 0;
      
      // Calculate quantity from NEW cartons only (not from conversion)
      const oldCartonsQuantity = currentCartonsCount * currentPerCarton;
      const newCartonsQuantity = finalCartonsCount * finalPerCartonCount;
      const cartonsQuantityAdded = Math.max(0, newCartonsQuantity - oldCartonsQuantity);
      
      // Calculate new totals
      totalQuantity = (finalCartonsCount * finalPerCartonCount) + finalSingleBottlesCount;
      const newTotalAdded = currentTotalAdded + cartonsQuantityAdded; // Only add carton increases
      
      console.log('📊 BUSINESS LOGIC RESULTS:', {
        finalCartons: finalCartonsCount,
        finalPerCarton: finalPerCartonCount,
        finalSingle: finalSingleBottlesCount,
        newRemaining: totalQuantity,
        cartonsQuantityAdded,
        newTotalAdded: newTotalAdded
      });
      
      // Prepare update data
      const updateData = {
        cartons_count: finalCartonsCount,
        per_carton_count: finalPerCartonCount,
        single_bottles_count: finalSingleBottlesCount,
        remaining_quantity: totalQuantity,
        updated_at: serverTimestamp(),
        updated_by: state.user.uid
      };
      
      // Only update total_added if carton quantity was added
      if (cartonsQuantityAdded > 0) {
        updateData.total_added = newTotalAdded;
      }
      
      // Update optional fields if provided
      if (itemData.supplier !== undefined) {
        updateData.supplier = itemData.supplier?.trim() || null;
      }
      
      if (itemData.item_location !== undefined) {
        updateData.item_location = itemData.item_location?.trim() || null;
      }
      
      if (itemData.notes !== undefined) {
        updateData.notes = itemData.notes?.trim() || null;
      }
      
      if (itemData.photo_url !== undefined) {
        updateData.photo_url = itemData.photo_url;
      }
      
      // 🔴 CRITICAL: Preserve original matching fields
      updateData.name = cleanedData.name;
      updateData.code = cleanedData.code;
      updateData.color = cleanedData.color;
      updateData.warehouse_id = cleanedData.warehouse_id;
      updateData.created_by = existingItem.created_by || state.user.uid;
      
      console.log('💾 Update data for existing item:', updateData);
      
      // Update the item in Firestore
      await updateDoc(itemRef, updateData);
      
      // Create transaction record if quantity was added
      if (cartonsQuantityAdded > 0) {
        const transactionData = {
          type: 'ADD',
          item_id: existingItemId,
          item_name: cleanedData.name,
          item_code: cleanedData.code,
          from_warehouse: null,
          to_warehouse: warehouseId,
          cartons_delta: newCartonsCount,
          per_carton_updated: finalPerCartonCount,
          single_delta: newSingleBottlesCount - currentSingleBottlesCount,
          total_delta: cartonsQuantityAdded,
          new_remaining: totalQuantity,
          user_id: state.user.uid,
          timestamp: serverTimestamp(),
          notes: itemData.notes || `إضافة كميات: ${newCartonsCount} كراتين`,
          created_by: state.userProfile?.name || state.user?.email || 'نظام'
        };
        
        await addDoc(collection(db, 'transactions'), transactionData);
        commit('ADD_RECENT_TRANSACTION', transactionData);
      }
      
      // Create item history record
      const itemHistoryData = {
        item_id: existingItemId,
        warehouse_id: warehouseId,
        change_type: 'UPDATE',
        old_quantity: currentRemaining,
        new_quantity: totalQuantity,
        quantity_delta: cartonsQuantityAdded,
        user_id: state.user.uid,
        timestamp: serverTimestamp(),
        details: {
          name: cleanedData.name,
          code: cleanedData.code,
          color: cleanedData.color,
          old_cartons: currentCartonsCount,
          new_cartons: finalCartonsCount,
          old_per_carton: currentPerCarton,
          new_per_carton: finalPerCartonCount,
          old_single: currentSingleBottlesCount,
          new_single: finalSingleBottlesCount,
          single_bottles_converted_to_cartons: additionalCartonsFromSingles,
          cartons_added: newCartonsCount,
          cartons_quantity_added: cartonsQuantityAdded,
          notes: itemData.notes
        }
      };
      
      await addDoc(collection(db, 'item_history'), itemHistoryData);
      
      // 🔴 CRITICAL FIX: Create COMPLETE updated item WITHOUT InventoryService.convertForDisplay
      const updatedItem = {
        id: existingItemId,
        // Keep all existing fields
        ...existingItem,
        // Add updated fields
        ...updateData,
        // Ensure these critical fields are included
        cartons_count: finalCartonsCount,
        per_carton_count: finalPerCartonCount,
        single_bottles_count: finalSingleBottlesCount,
        remaining_quantity: totalQuantity,
        total_added: newTotalAdded,
        // Timestamps
        updated_at: updateData.updated_at
      };
      
      console.log('📤 COMPLETE updated item to return:', {
        ...updatedItem,
        created_by: 'HIDDEN',
        updated_by: 'HIDDEN'
      });
      
      // 🔴 FIX: Update local Vuex state with COMPLETE item WITHOUT reloading all inventory
      commit('UPDATE_INVENTORY_ITEM', updatedItem);
      
      result = {
        success: true,
        type: 'updated',
        item: updatedItem,  // Return the complete item
        cartonsAdded: cartonsQuantityAdded,
        newRemaining: totalQuantity,
        convertedCartons: additionalCartonsFromSingles,
        message: `تم تحديث الصنف "${cleanedData.name}" بنجاح`
      };
      
    } else {
      // ============================================
      // 🔴 CREATE NEW ITEM (no existing match found)
      // ============================================
      console.log('➕ CREATING new item (no matching name+code+color found)');
      isCreatingNewItem = true;
      
      // Calculate quantities for new item
      const cartonsCount = Number(itemData.cartons_count) || 0;
      const perCartonCount = Number(itemData.per_carton_count) || 12;
      const singleBottlesCount = Number(itemData.single_bottles_count) || 0;
      
      // Convert single bottles to cartons if complete
      let finalCartonsCount = cartonsCount;
      let finalSingleBottlesCount = singleBottlesCount;
      additionalCartonsFromSingles = 0; // 🔴 RE-ASSIGN VALUE HERE
      
      if (singleBottlesCount >= perCartonCount) {
        additionalCartonsFromSingles = Math.floor(singleBottlesCount / perCartonCount);
        finalSingleBottlesCount = singleBottlesCount % perCartonCount;
        finalCartonsCount += additionalCartonsFromSingles;
        
        console.log(`🔄 Converting single bottles for new item: ${singleBottlesCount} → ${additionalCartonsFromSingles} cartons + ${finalSingleBottlesCount} singles`);
      }
      
      // Calculate total quantity
      totalQuantity = (finalCartonsCount * perCartonCount) + finalSingleBottlesCount;
      
      if (totalQuantity <= 0) {
        throw new Error('يجب إدخال كمية صحيحة للإضافة (أكبر من صفر)');
      }
      
      // Prepare data for new item
      const newItemData = {
        name: cleanedData.name,
        code: cleanedData.code,
        color: cleanedData.color,
        warehouse_id: warehouseId,
        cartons_count: finalCartonsCount,
        per_carton_count: perCartonCount,
        single_bottles_count: finalSingleBottlesCount,
        supplier: itemData.supplier?.trim() || null,
        item_location: itemData.item_location?.trim() || null,
        notes: itemData.notes?.trim() || null,
        photo_url: itemData.photo_url || null,
        remaining_quantity: totalQuantity,
        total_added: totalQuantity,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        created_by: state.user.uid,
        updated_by: state.user.uid
      };
      
      console.log('💾 New item data:', newItemData);
      
      // Add new item to Firestore
      const docRef = await addDoc(collection(db, 'items'), newItemData);
      
      // Create transaction record
      const transactionData = {
        type: 'ADD',
        item_id: docRef.id,
        item_name: cleanedData.name,
        item_code: cleanedData.code,
        from_warehouse: null,
        to_warehouse: warehouseId,
        cartons_delta: finalCartonsCount,
        per_carton_updated: perCartonCount,
        single_delta: finalSingleBottlesCount,
        total_delta: totalQuantity,
        new_remaining: totalQuantity,
        user_id: state.user.uid,
        timestamp: serverTimestamp(),
        notes: additionalCartonsFromSingles > 0 ? 
          `إضافة جديدة (تحويل ${additionalCartonsFromSingles} كرتون من القزاز الفردي)` : 
          'عملية إضافة جديدة',
        created_by: state.userProfile?.name || state.user?.email || 'نظام'
      };
      
      await addDoc(collection(db, 'transactions'), transactionData);
      
      // 🔴 CRITICAL FIX: Create COMPLETE new item WITHOUT InventoryService.convertForDisplay
      const newItem = {
        id: docRef.id,
        ...newItemData
      };
      
      console.log('📤 COMPLETE new item to return:', {
        ...newItem,
        created_by: 'HIDDEN',
        updated_by: 'HIDDEN'
      });
      
      // 🔴 FIX: Add to local state with COMPLETE item WITHOUT reloading all inventory
      commit('UPDATE_INVENTORY_ITEM', newItem);
      commit('ADD_RECENT_TRANSACTION', transactionData);
      
      result = { 
        success: true,
        type: 'created',
        id: docRef.id, 
        item: newItem,  // Return the complete item
        convertedCartons: additionalCartonsFromSingles,
        message: additionalCartonsFromSingles > 0 ? 
          `تم إضافة صنف جديد ${cleanedData.name} مع تحويل ${additionalCartonsFromSingles} كرتون من القزاز الفردي` :
          `تم إضافة صنف جديد ${cleanedData.name}`
      };
    }

    // 🔴 FIX: Show notification WITHOUT calling refreshInventorySilently
    // Now we can safely use additionalCartonsFromSingles and totalQuantity
    let successMessage = '';
    
    if (result.type === 'updated') {
      successMessage = `✅ تم تحديث كميات الصنف "${cleanedData.name}" بنجاح. تمت إضافة ${result.cartonsAdded || 0} وحدة`;
    } else if (isCreatingNewItem) {
      if (additionalCartonsFromSingles > 0) {
        successMessage = `✅ تم إضافة الصنف "${cleanedData.name}" بنجاح. تم تحويل ${additionalCartonsFromSingles} كرتون من القزاز الفردي`;
      } else {
        successMessage = `✅ تم إضافة الصنف "${cleanedData.name}" بنجاح. الكمية المضافة: ${totalQuantity} وحدة`;
      }
    }
    
    dispatch('showNotification', {
      type: 'success',
      message: successMessage
    });

    return result;

  } catch (error) {
    console.error('❌ Error adding inventory item:', error);
    commit('SET_OPERATION_ERROR', error.message);

    dispatch('showNotification', {
      type: 'error',
      message: error.message || 'حدث خطأ غير متوقع أثناء إضافة/تعديث الصنف'
    });

    throw error;
  } finally {
    commit('SET_OPERATION_LOADING', false);
  }
},
    // ============================================
    // EXISTING ACTIONS (PRESERVED)
    // ============================================
    
     async clearOperationError({ commit }) {
    commit('CLEAR_OPERATION_ERROR');
  },

  async refreshInventorySilently({ commit, state, dispatch }) {
    try {
      commit('SET_IS_REFRESHING_SILENTLY', true);
      console.log('🔄 تحديث المخزون بصمت...');
      
      // استخدم الإجراء الحالي مع إضافة تحديث خفي
      await dispatch('loadAllInventory', { forceRefresh: true });
      
      console.log('✅ تم تحديث المخزون بصمت');
    } catch (error) {
      console.warn('⚠️ تعذر تحديث المخزون بصمت:', error.message);
      // تجاهل الأخطاء في التحديث الصامت
    } finally {
      commit('SET_IS_REFRESHING_SILENTLY', false);
    }
  },
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
    const dispatchWarehouses = snapshot.docs.map(doc => {
      const data = doc.data();
      const warehouseId = doc.id;
      
      // تحديد الاسم العربي بناءً على معرف المخزن
      let arabicName = data.name_ar || data.name || warehouseId;
      
      if (warehouseId === 'dubi_factory') {
        arabicName = 'مصنع دبي';
      } 
      else if (warehouseId === 'external_wharehouse') {
        arabicName = 'صرف خارجي';
      }
      else if (warehouseId === 'factory') {
        arabicName = 'مصنع البران';
      }
      else if (warehouseId === 'dispat_item') {
        arabicName = 'موقع صرف';
      }
      
      // إرجاع البيانات مع name_ar المحدث
      return {
        id: warehouseId,
        name_ar: arabicName, // هذا هو التغيير الوحيد
        ...data
      };
    });

    console.log(`✅ Dispatch warehouses loaded: ${dispatchWarehouses.length}`);
    return dispatchWarehouses;

  } catch (error) {
    console.error('❌ Error loading dispatch warehouses:', error);
    return [];
  }
},

   async getTotalItemCount({ state }, warehouseId = 'all') {
  try {
    console.log(`📊 Getting total item count from local data for ${warehouseId === 'all' ? 'all warehouses' : 'warehouse ' + warehouseId}`);
    
    const inventory = state.inventory;
    const filteredItems = warehouseId === 'all' 
      ? inventory 
      : inventory.filter(item => item.warehouse_id === warehouseId);
    
    return filteredItems.length;
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
    console.log(`📊 Getting low stock count from local data for ${warehouseId === 'all' ? 'all warehouses' : 'warehouse ' + warehouseId}`);
    
    const inventory = state.inventory;
    const filteredItems = warehouseId === 'all' 
      ? inventory 
      : inventory.filter(item => item.warehouse_id === warehouseId);
    
    return filteredItems.filter(item => 
      (item.remaining_quantity || 0) < 10 && (item.remaining_quantity || 0) > 0
    ).length;
  } catch (error) {
    console.error('❌ Error getting low stock count:', error);
    const items = state.inventory;
    const filteredItems = warehouseId === 'all' 
      ? items 
      : items.filter(item => item.warehouse_id === warehouseId);
    return filteredItems.filter(item => 
      (item.remaining_quantity || 0) < 10 && (item.remaining_quantity || 0) > 0
    ).length;
  }
},
    async getOutOfStockCount({ state }, warehouseId = 'all') {
  try {
    console.log(`📊 Getting out of stock count from local data for ${warehouseId === 'all' ? 'all warehouses' : 'warehouse ' + warehouseId}`);
    
    const inventory = state.inventory;
    const filteredItems = warehouseId === 'all' 
      ? inventory 
      : inventory.filter(item => item.warehouse_id === warehouseId);
    
    return filteredItems.filter(item => (item.remaining_quantity || 0) === 0).length;
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
    console.log(`📊 Getting total quantity sum from local data for ${warehouseId === 'all' ? 'all warehouses' : 'warehouse ' + warehouseId}`);
    
    const inventory = state.inventory;
    const filteredItems = warehouseId === 'all' 
      ? inventory 
      : inventory.filter(item => item.warehouse_id === warehouseId);
    
    return filteredItems.reduce((sum, item) => 
      sum + (item.remaining_quantity || 0), 0
    );
  } catch (error) {
    console.error('❌ Error getting total quantity sum:', error);
    const inventory = state.inventory;
    const filteredItems = warehouseId === 'all' 
      ? inventory 
      : inventory.filter(item => item.warehouse_id === warehouseId);
    return filteredItems.reduce((sum, item) => 
      sum + (item.remaining_quantity || 0), 0
    );
  }
},

   async refreshDashboardCounts({ commit, state, dispatch }, warehouseId = 'all') {
  try {
    console.log('🔄 Refreshing dashboard counts from local data...');
    
    // Use local inventory data instead of Firebase queries
    const inventory = state.inventory;
    const filteredInventory = warehouseId === 'all' 
      ? inventory 
      : inventory.filter(item => item.warehouse_id === warehouseId);
    
    const totalItems = filteredInventory.length;
    const totalQuantity = filteredInventory.reduce((sum, item) => 
      sum + (item.remaining_quantity || 0), 0
    );
    const lowStockItems = filteredInventory.filter(item => 
      (item.remaining_quantity || 0) < 10 && (item.remaining_quantity || 0) > 0
    ).length;
    
    const counts = {
      totalItems,
      totalQuantity,
      lowStockItems,
      lastUpdated: new Date()
    };
    
    console.log('✅ Dashboard counts calculated from local data:', counts);
    return counts;
    
  } catch (error) {
    console.error('❌ Error calculating dashboard counts:', error);
    
    // Fallback to basic calculation
    const inventory = state.inventory;
    const filteredInventory = warehouseId === 'all' 
      ? inventory 
      : inventory.filter(item => item.warehouse_id === warehouseId);
    
    const fallbackCounts = {
      totalItems: filteredInventory.length,
      totalQuantity: filteredInventory.reduce((sum, item) => 
        sum + (item.remaining_quantity || 0), 0
      ),
      lowStockItems: filteredInventory.filter(item => 
        (item.remaining_quantity || 0) < 10 && (item.remaining_quantity || 0) > 0
      ).length,
      lastUpdated: new Date()
    };
    
    return fallbackCounts;
  }
},

    async getDashboardStats({ state, dispatch }, warehouseId = 'all') {
  try {
    const counts = await dispatch('refreshDashboardCounts', warehouseId);
    return {
      ...counts,
      recentTransactions: 0 // Or calculate from state.recentTransactions
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

    // 🔴 CRITICAL: Ensure Firebase is initialized
    console.log('⏳ Ensuring Firebase is ready...');
    await ensureFirebaseReady();
    console.log('✅ Firebase ready');

    if (!state.userProfile) {
      throw new Error('User not authenticated');
    }

    if (!db) {
      throw new Error('Database not available');
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
        // 🔴 FIX: Handle "in" query limitations
        const warehouseIds = allowedWarehouses.slice(0, 10);
        
        if (warehouseIds.length === 1) {
          itemsQuery = query(
            itemsRef,
            where('warehouse_id', '==', warehouseIds[0]),
            orderBy('name'),
            limit(PERFORMANCE_CONFIG.INITIAL_LOAD)
          );
        } else {
          try {
            itemsQuery = query(
              itemsRef,
              where('warehouse_id', 'in', warehouseIds),
              orderBy('name'),
              limit(PERFORMANCE_CONFIG.INITIAL_LOAD)
            );
          } catch (inError) {
            console.warn('"in" query failed, using first warehouse:', inError);
            itemsQuery = query(
              itemsRef,
              where('warehouse_id', '==', warehouseIds[0]),
              orderBy('name'),
              limit(PERFORMANCE_CONFIG.INITIAL_LOAD)
            );
          }
        }
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

    // 🔴 FIX: Handle lastDoc serialization safely
    let lastDoc = null;
    if (snapshot.docs.length > 0) {
      const lastSnapshot = snapshot.docs[snapshot.docs.length - 1];
      // Create a minimal, serializable representation
      lastDoc = lastSnapshot;
    }

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

    // 🔴 FIX: Handle IndexedDB serialization errors
    if (error.name === 'DataCloneError' || error.message.includes('could not be cloned')) {
      console.warn('🔧 IndexedDB serialization error detected');
      dispatch('showNotification', {
        type: 'warning',
        message: 'جارٍ إصلاح مخزن البيانات المحلي...'
      });
      
      // Try to clear corrupted data
      try {
        localStorage.removeItem('firestore/indexeddb/persistence');
      } catch (e) {
        console.warn('Could not clear localStorage:', e);
      }
    } else {
      dispatch('showNotification', {
        type: 'error',
        message: 'خطأ في تحميل المخزون'
      });
    }

    return [];
  } finally {
    commit('SET_INVENTORY_LOADING', false);
  }
},

async loadMoreInventory({ commit, state, dispatch }) {
  if (!state.pagination.hasMore || state.pagination.isFetching) {
    console.log('⏹️ Not loading more: hasMore =', state.pagination.hasMore, 'isFetching =', state.pagination.isFetching);
    return [];
  }

  commit('SET_PAGINATION', { isFetching: true });

  try {
    console.log('📥 Loading more inventory items...');

    // 🔴 CRITICAL: Ensure Firebase is initialized
    console.log('⏳ Ensuring Firebase is ready for loadMore...');
    await ensureFirebaseReady();
    console.log('✅ Firebase ready for loadMore');

    if (!state.userProfile) {
      console.log('⚠️ User not authenticated');
      return [];
    }

    if (!db) {
      console.error('❌ Database not available');
      return [];
    }

    // 🔴 CRITICAL FIX: Validate and handle lastDoc safely
    let startAfterDoc = null;
    if (state.pagination.lastDoc) {
      try {
        // Ensure lastDoc is a valid DocumentSnapshot
        if (state.pagination.lastDoc && typeof state.pagination.lastDoc === 'object') {
          startAfterDoc = state.pagination.lastDoc;
        } else {
          console.warn('⚠️ Invalid lastDoc format, resetting pagination');
          commit('SET_PAGINATION', { 
            lastDoc: null, 
            hasMore: true,
            isFetching: false 
          });
          return [];
        }
      } catch (docError) {
        console.warn('⚠️ Error processing lastDoc:', docError);
        commit('SET_PAGINATION', { 
          lastDoc: null, 
          hasMore: true,
          isFetching: false 
        });
        return [];
      }
    }

    const itemsRef = collection(db, 'items');
    let itemsQuery;

    if (state.userProfile.role === 'superadmin' || state.userProfile.role === 'company_manager') {
      itemsQuery = query(
        itemsRef,
        orderBy('name'),
        ...(startAfterDoc ? [startAfter(startAfterDoc)] : []),
        limit(PERFORMANCE_CONFIG.SCROLL_LOAD)
      );
    } else if (state.userProfile.role === 'warehouse_manager') {
      const allowedWarehouses = state.userProfile.allowed_warehouses || [];

      if (allowedWarehouses.includes('all')) {
        itemsQuery = query(
          itemsRef,
          orderBy('name'),
          ...(startAfterDoc ? [startAfter(startAfterDoc)] : []),
          limit(PERFORMANCE_CONFIG.SCROLL_LOAD)
        );
      } else {
        // 🔴 FIX: Handle "in" query limitations
        const warehouseIds = allowedWarehouses.slice(0, 10);
        
        if (warehouseIds.length === 1) {
          itemsQuery = query(
            itemsRef,
            where('warehouse_id', '==', warehouseIds[0]),
            orderBy('name'),
            ...(startAfterDoc ? [startAfter(startAfterDoc)] : []),
            limit(PERFORMANCE_CONFIG.SCROLL_LOAD)
          );
        } else {
          try {
            itemsQuery = query(
              itemsRef,
              where('warehouse_id', 'in', warehouseIds),
              orderBy('name'),
              ...(startAfterDoc ? [startAfter(startAfterDoc)] : []),
              limit(PERFORMANCE_CONFIG.SCROLL_LOAD)
            );
          } catch (inError) {
            console.warn('"in" query failed, using single warehouse:', inError);
            itemsQuery = query(
              itemsRef,
              where('warehouse_id', '==', warehouseIds[0]),
              orderBy('name'),
              ...(startAfterDoc ? [startAfter(startAfterDoc)] : []),
              limit(PERFORMANCE_CONFIG.SCROLL_LOAD)
            );
          }
        }
      }
    } else {
      console.log('🚫 User role not authorized for pagination');
      return [];
    }

    console.log('🔍 Executing paginated query...');
    let snapshot;
    try {
      snapshot = await getDocs(itemsQuery);
      console.log(`✅ Paginated query returned ${snapshot.size} documents`);
    } catch (queryError) {
      console.error('❌ Paginated query failed:', queryError);
      
      // 🔴 FIX: Handle specific Firestore errors
      if (queryError.code === 'failed-precondition' || queryError.message.includes('index')) {
        console.log('🔄 Index missing or query error, falling back to simple query');
        // Fallback query without startAfter
        const fallbackQuery = query(
          itemsRef,
          orderBy('name'),
          limit(PERFORMANCE_CONFIG.SCROLL_LOAD)
        );
        snapshot = await getDocs(fallbackQuery);
      } else {
        throw queryError;
      }
    }

    if (snapshot.empty) {
      console.log('📭 No more items to load');
      commit('SET_PAGINATION', { 
        hasMore: false, 
        isFetching: false 
      });
      return [];
    }

    const newItems = snapshot.docs.map(doc => {
      const data = doc.data();
      return InventoryService.convertForDisplay({
        id: doc.id,
        ...data
      });
    });

    // 🔴 FIX: Handle last document safely
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    const totalLoaded = state.pagination.totalLoaded + newItems.length;

    console.log(`📥 Loaded ${newItems.length} more items, total now: ${totalLoaded}`);

    // Append new items to inventory (prevent duplicates)
    const existingIds = new Set(state.inventory.map(item => item.id));
    const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));
    
    if (uniqueNewItems.length > 0) {
      commit('APPEND_INVENTORY', uniqueNewItems);
    }

    // Update pagination state
    commit('SET_PAGINATION', {
      lastDoc,
      hasMore: snapshot.size === PERFORMANCE_CONFIG.SCROLL_LOAD,
      totalLoaded,
      currentPage: state.pagination.currentPage + 1,
      isFetching: false
    });

    if (state.realtimeMode) {
      await dispatch('setupOptimizedRealtimeUpdates', newItems.map(item => item.id));
    }

    return newItems;

  } catch (error) {
    console.error('❌ Error loading more inventory:', error);
    
    // 🔴 CRITICAL FIX: Handle IndexedDB serialization errors
    if (error.name === 'DataCloneError' || error.message.includes('could not be cloned')) {
      console.warn('🔄 IndexedDB serialization error detected, resetting pagination...');
      
      // Clear problematic pagination state
      commit('SET_PAGINATION', { 
        lastDoc: null, 
        hasMore: true,
        isFetching: false,
        currentPage: 0
      });
      
      // Try again with clean state
      return await dispatch('loadMoreInventory');
    }

    // Handle other errors
    dispatch('showNotification', {
      type: 'error',
      message: 'خطأ في تحميل المزيد من العناصر. جاري إعادة المحاولة...'
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

    // 🔴 FIX: Ensure Firebase is initialized
    await ensureFirebaseReady();

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
        orderBy('name'), // 🔴 FIX: Use a consistent field
        startAfter(lastDoc),
        limit(limit)
      );
    } else {
      itemsQuery = query(
        itemsRef,
        where('warehouse_id', '==', warehouseId),
        orderBy('name'), // 🔴 FIX: Use a consistent field
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
    
    // 🔴 FIX: Handle serialization errors
    if (error.name === 'DataCloneError' || error.message.includes('could not be cloned')) {
      console.warn('🔄 IndexedDB serialization error in warehouse items');
      // Return empty results to prevent UI breakage
      return {
        items: [],
        lastDoc: null,
        hasMore: false
      };
    }
    
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

    // 🔴 FIX: Handle serialization errors
    if (error.name === 'DataCloneError' || error.message.includes('could not be cloned')) {
      console.warn('🔄 IndexedDB serialization error in loadMoreWarehouseItems');
      return { items: [], allItems: currentItems, hasMore: false };
    }

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

// ============================================
// UPDATED: UPDATE ITEM ACTION (WITH VALIDATION FIX)
// ============================================
async updateItem({ commit, state, dispatch }, { itemId, itemData }) {
  commit('SET_OPERATION_LOADING', true);
  commit('CLEAR_OPERATION_ERROR');

  console.log('🔄 Updating item via store:', { itemId, itemData });

  try {
    // 🔴 VALIDATION 1: Authentication
    if (!state.userProfile) {
      throw new Error('يجب تسجيل الدخول أولاً');
    }
    
    if (!['superadmin', 'warehouse_manager'].includes(state.userProfile.role)) {
      throw new Error('ليس لديك صلاحية لتعديل الأصناف');
    }

    // 🔴 VALIDATION 2: Required fields - FIXED: Check for empty strings properly
    console.log('🔍 Validation debug:', {
      name: itemData.name,
      nameTrimmed: itemData.name?.trim(),
      hasName: !!itemData.name?.trim(),
      code: itemData.code,
      codeTrimmed: itemData.code?.trim(),
      hasCode: !!itemData.code?.trim(),
      color: itemData.color,
      colorTrimmed: itemData.color?.trim(),
      hasColor: !!itemData.color?.trim(),
      warehouse_id: itemData.warehouse_id,
      warehouse_idType: typeof itemData.warehouse_id,
      hasWarehouseId: !!itemData.warehouse_id,
      isWarehouseIdEmptyString: itemData.warehouse_id === ''
    });

    // Check each field separately for better error messages
    const missingFields = [];
    
    if (!itemData.name?.trim()) {
      missingFields.push('الاسم');
    }
    
    if (!itemData.code?.trim()) {
      missingFields.push('الكود');
    }
    
    if (!itemData.color?.trim()) {
      missingFields.push('اللون');
    }
    
    // 🔴 FIXED: Check if warehouse_id exists and is not empty string
    if (!itemData.warehouse_id || itemData.warehouse_id.trim() === '') {
      missingFields.push('المخزن');
    }
    
    if (missingFields.length > 0) {
      throw new Error(`الحقول التالية مطلوبة: ${missingFields.join('، ')}`);
    }

    // 🔴 VALIDATION 3: Warehouse access
    const warehouseId = itemData.warehouse_id;
    if (state.userProfile.role === 'warehouse_manager') {
      const allowedWarehouses = state.userProfile.allowed_warehouses || [];
      if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
        if (!allowedWarehouses.includes(warehouseId)) {
          throw new Error('ليس لديك صلاحية لتعديل أصناف في هذا المخزن');
        }
      }
    }

    // 🔴 CRITICAL: Wait for Firebase initialization
    console.log('⏳ Ensuring Firebase is ready for update...');
    try {
      await ensureFirebaseReady();
      console.log('✅ Firebase ready for update');
    } catch (firebaseError) {
      console.error('❌ Firebase initialization failed:', firebaseError);
      throw new Error('Firebase غير متوفر. يرجى المحاولة مرة أخرى.');
    }

    if (!db) {
      throw new Error('Firestore database not available');
    }

    // Import Firestore functions inside the action
    const firebaseFirestore = await import('firebase/firestore');
    const {
      doc,
      getDoc,
      updateDoc,
      addDoc,
      collection,
      serverTimestamp,
      Timestamp
    } = firebaseFirestore;

    // ========== GET EXISTING ITEM ==========
    const itemRef = doc(db, 'items', itemId);
    let itemDoc;
    let existingItem;
    
    try {
      itemDoc = await getDoc(itemRef);
      
      if (!itemDoc.exists()) {
        throw new Error('الصنف غير موجود');
      }

      existingItem = itemDoc.data();
      
      // 🔴 CRITICAL FIX: Convert Firestore Timestamps to plain objects
      existingItem = JSON.parse(JSON.stringify(existingItem, (key, value) => {
        if (value && typeof value === 'object' && value.toDate) {
          // Convert Firestore Timestamp to ISO string
          return value.toDate().toISOString();
        }
        if (value && typeof value === 'object' && value._seconds !== undefined && value._nanoseconds !== undefined) {
          // Handle raw Firestore Timestamp object
          return new Date(value._seconds * 1000).toISOString();
        }
        return value;
      }));
      
      console.log('📋 Existing item data:', {
        id: itemId,
        name: existingItem.name,
        code: existingItem.code,
        warehouse_id: existingItem.warehouse_id,
        cartons: existingItem.cartons_count,
        singles: existingItem.single_bottles_count,
        per_carton: existingItem.per_carton_count,
        total: existingItem.remaining_quantity
      });
    } catch (docError) {
      console.error('❌ Error getting item document:', docError);
      throw new Error('فشل في تحميل بيانات الصنف');
    }

    // ========== CALCULATE NEW QUANTITIES ==========
    const newCartonsCount = Number(itemData.cartons_count) || Number(existingItem.cartons_count) || 0;
    const newPerCartonCount = Number(itemData.per_carton_count) || Number(existingItem.per_carton_count) || 12;
    const newSingleBottlesCount = Number(itemData.single_bottles_count) || Number(existingItem.single_bottles_count) || 0;
    
    // 🔴 BUSINESS RULE: Convert single bottles to cartons if complete
    let finalCartonsCount = newCartonsCount;
    let finalSingleBottlesCount = newSingleBottlesCount;
    let additionalCartonsFromSingles = 0;
    
    if (finalSingleBottlesCount >= newPerCartonCount) {
      additionalCartonsFromSingles = Math.floor(finalSingleBottlesCount / newPerCartonCount);
      finalSingleBottlesCount = finalSingleBottlesCount % newPerCartonCount;
      finalCartonsCount += additionalCartonsFromSingles;
      
      console.log(`🔄 Converting single bottles to cartons: added ${additionalCartonsFromSingles} cartons, remaining singles: ${finalSingleBottlesCount}`);
    }
    
    // Calculate total quantity
    const newTotalQuantity = (finalCartonsCount * newPerCartonCount) + finalSingleBottlesCount;
    
    // Calculate old total quantity
    const oldCartons = Number(existingItem.cartons_count) || 0;
    const oldPerCarton = Number(existingItem.per_carton_count) || 12;
    const oldSingles = Number(existingItem.single_bottles_count) || 0;
    const oldTotalQuantity = (oldCartons * oldPerCarton) + oldSingles;
    
    // Calculate quantity change
    const quantityDiff = newTotalQuantity - oldTotalQuantity;

    console.log('📊 Quantity calculations:', {
      old: { cartons: oldCartons, singles: oldSingles, per_carton: oldPerCarton, total: oldTotalQuantity },
      new: { cartons: finalCartonsCount, singles: finalSingleBottlesCount, per_carton: newPerCartonCount, total: newTotalQuantity },
      diff: quantityDiff,
      convertedCartons: additionalCartonsFromSingles
    });

    // ========== PREPARE UPDATE DATA ==========
    const updateData = {
      // 🔴 REQUIRED FIELDS
      name: itemData.name.trim(),
      code: itemData.code.trim(),
      color: itemData.color.trim(),
      warehouse_id: warehouseId.trim(), // Ensure trimmed
      
      // 🔴 QUANTITY FIELDS
      cartons_count: finalCartonsCount,
      per_carton_count: newPerCartonCount,
      single_bottles_count: finalSingleBottlesCount,
      remaining_quantity: newTotalQuantity,
      
      // 🔴 Only update total_added if quantity increased
      ...(quantityDiff > 0 && {
        total_added: (Number(existingItem.total_added) || 0) + quantityDiff
      }),
      
      // 🔴 OPTIONAL FIELDS - preserve existing values if not provided
      supplier: itemData.supplier?.trim() || existingItem.supplier || '',
      item_location: itemData.item_location?.trim() || existingItem.item_location || '',
      notes: itemData.notes?.trim() || existingItem.notes || '',
      photo_url: itemData.photo_url || existingItem.photo_url || '',
      
      // 🔴 TIMESTAMPS - Use Firestore serverTimestamp
      updated_at: serverTimestamp(),
      updated_by: state.user.uid
    };

    console.log('💾 Update data for item:', updateData);

    // ========== UPDATE IN FIRESTORE ==========
    try {
      await updateDoc(itemRef, updateData);
      console.log('✅ Item updated in Firestore successfully');
    } catch (updateError) {
      console.error('❌ Error updating item in Firestore:', updateError);
      throw new Error('فشل في تحديث الصنف في قاعدة البيانات');
    }

    // ========== CREATE TRANSACTION IF QUANTITY CHANGED ==========
    if (quantityDiff !== 0 || existingItem.warehouse_id !== warehouseId) {
      try {
        const transactionData = {
          type: 'UPDATE',
          item_id: itemId,
          item_name: updateData.name,
          item_code: updateData.code,
          from_warehouse: existingItem.warehouse_id !== warehouseId ? existingItem.warehouse_id : null,
          to_warehouse: warehouseId,
          cartons_delta: finalCartonsCount - oldCartons,
          per_carton_updated: newPerCartonCount,
          single_delta: finalSingleBottlesCount - oldSingles,
          total_delta: quantityDiff,
          new_remaining: newTotalQuantity,
          user_id: state.user.uid,
          timestamp: serverTimestamp(),
          notes: itemData.notes?.trim() || `تعديل الصنف${additionalCartonsFromSingles > 0 ? ` (تحويل ${additionalCartonsFromSingles} كرتون من القزاز الفردي)` : ''}`,
          created_by: state.userProfile?.name || state.user?.email || 'نظام'
        };

        await addDoc(collection(db, 'transactions'), transactionData);
        
        // 🔴 FIX: Create a plain JavaScript object for Vuex
        const transactionForVuex = {
          ...transactionData,
          id: `temp_${Date.now()}`,
          timestamp: new Date().toISOString(),
          created_at: new Date().toISOString()
        };
        
        commit('ADD_RECENT_TRANSACTION', transactionForVuex);
        console.log('✅ Transaction recorded successfully');
      } catch (transactionError) {
        console.warn('⚠️ Could not create transaction record:', transactionError);
        // Don't fail the whole operation if transaction recording fails
      }
    }

    // ========== CREATE ITEM HISTORY RECORD ==========
    try {
      const itemHistoryData = {
        item_id: itemId,
        warehouse_id: warehouseId,
        change_type: 'UPDATE',
        old_quantity: oldTotalQuantity,
        new_quantity: newTotalQuantity,
        quantity_delta: quantityDiff,
        user_id: state.user.uid,
        timestamp: serverTimestamp(),
        details: {
          name: updateData.name,
          code: updateData.code,
          color: updateData.color,
          old_cartons: oldCartons,
          new_cartons: finalCartonsCount,
          old_per_carton: oldPerCarton,
          new_per_carton: newPerCartonCount,
          old_single: oldSingles,
          new_single: finalSingleBottlesCount,
          single_bottles_converted_to_cartons: additionalCartonsFromSingles,
          notes: itemData.notes
        }
      };

      await addDoc(collection(db, 'item_history'), itemHistoryData);
      console.log('✅ Item history recorded successfully');
    } catch (historyError) {
      console.warn('⚠️ Could not create item history:', historyError);
      // Don't fail the whole operation if history recording fails
    }

    // ========== UPDATE LOCAL STATE WITHOUT RELOADING INVENTORY ==========
    const updatedItem = {
      id: itemId,
      // Keep existing fields that might not be in updateData
      created_at: existingItem.created_at,
      created_by: existingItem.created_by,
      // Add updated fields
      ...updateData,
      // Ensure total_added is included
      total_added: updateData.total_added !== undefined ? updateData.total_added : Number(existingItem.total_added) || 0,
      // Convert serverTimestamp to plain date
      updated_at: new Date().toISOString()
    };

    // 🔴 CRITICAL FIX: Remove any non-serializable properties
    const cleanUpdatedItem = JSON.parse(JSON.stringify(updatedItem));

    console.log('📤 Clean updated item for Vuex state:', {
      ...cleanUpdatedItem,
      created_by: 'HIDDEN',
      updated_by: 'HIDDEN'
    });

    // 🔴 CRITICAL FIX: Update single item in Vuex state WITHOUT reloading all inventory
    commit('UPDATE_INVENTORY_ITEM', cleanUpdatedItem);

    // 🔴 FIXED: Show success notification WITHOUT calling refreshInventorySilently
    let successMessage = `✅ تم تحديث الصنف "${updateData.name}" بنجاح`;
    
    if (additionalCartonsFromSingles > 0) {
      successMessage += ` (تم تحويل ${additionalCartonsFromSingles} كرتون من القزاز الفردي)`;
    }
    
    if (quantityDiff > 0) {
      successMessage += ` - تمت إضافة ${quantityDiff} وحدة`;
    } else if (quantityDiff < 0) {
      successMessage += ` - تم خصم ${Math.abs(quantityDiff)} وحدة`;
    }

    dispatch('showNotification', {
      type: 'success',
      message: successMessage
    });

    console.log('✅ Item update process completed successfully:', {
      id: itemId,
      name: updateData.name,
      cartons: finalCartonsCount,
      singles: finalSingleBottlesCount,
      total: newTotalQuantity,
      converted: additionalCartonsFromSingles
    });

    return { 
      success: true, 
      item: cleanUpdatedItem,
      message: 'تم تحديث الصنف بنجاح'
    };

  } catch (error) {
    console.error('❌ Error updating item:', error);
    console.error('Error stack:', error.stack);
    
    commit('SET_OPERATION_ERROR', error.message);

    dispatch('showNotification', {
      type: 'error',
      message: error.message || 'حدث خطأ في تحديث الصنف'
    });

    return { 
      success: false, 
      error: error.message 
    };
  } finally {
    commit('SET_OPERATION_LOADING', false);
  }
},
// ============================================
// TRANSFER ITEM ACTION (WITH COMPLETE TRANSACTION RECORDING)
// ============================================
async transferItem({ commit, state, dispatch }, transferData) {
  commit('SET_OPERATION_LOADING', true);
  commit('CLEAR_OPERATION_ERROR');

  try {
    console.log('🔄 START TRANSFER:', {
      item_id: transferData.item_id,
      from_warehouse: transferData.from_warehouse_id,
      to_warehouse: transferData.to_warehouse_id,
      cartons: transferData.cartons_count,
      singles: transferData.single_bottles_count
    });

    // ========== VALIDATION ==========
    if (!state.userProfile) {
      throw new Error('يجب تسجيل الدخول أولاً');
    }

    if (!['superadmin', 'warehouse_manager'].includes(state.userProfile.role)) {
      throw new Error('ليس لديك صلاحية لنقل الأصناف');
    }

    // Validate required fields
    if (!transferData.item_id || !transferData.from_warehouse_id || !transferData.to_warehouse_id) {
      throw new Error('بيانات النقل غير مكتملة (معرف الصنف، المخزن المصدر، المخزن الهدف)');
    }

    if (transferData.from_warehouse_id === transferData.to_warehouse_id) {
      throw new Error('لا يمكن نقل الصنف إلى نفس المخزن');
    }

    // Check warehouse access
    if (state.userProfile.role === 'warehouse_manager') {
      const allowedWarehouses = state.userProfile.allowed_warehouses || [];
      if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
        if (!allowedWarehouses.includes(transferData.from_warehouse_id) ||
            !allowedWarehouses.includes(transferData.to_warehouse_id)) {
          throw new Error('ليس لديك صلاحية للنقل من/إلى هذه المخازن');
        }
      }
    }

    // ========== ATOMIC TRANSACTION ==========
    console.log('⚡ Starting atomic transaction for transfer...');
    
    const result = await runTransaction(db, async (transaction) => {
      // ========== STEP 1: GET SOURCE ITEM ==========
      const sourceItemRef = doc(db, 'items', transferData.item_id);
      const sourceItemDoc = await transaction.get(sourceItemRef);
      
      if (!sourceItemDoc.exists()) {
        throw new Error('الصنف غير موجود في المصدر');
      }

      const sourceItem = sourceItemDoc.data();
      console.log('📦 Source item data:', {
        id: transferData.item_id,
        name: sourceItem.name,
        code: sourceItem.code,
        color: sourceItem.color,
        warehouse: sourceItem.warehouse_id,
        cartons: sourceItem.cartons_count,
        singles: sourceItem.single_bottles_count,
        per_carton: sourceItem.per_carton_count,
        total: sourceItem.remaining_quantity
      });

      // Verify source warehouse matches
      if (sourceItem.warehouse_id !== transferData.from_warehouse_id) {
        throw new Error(`الصنف ليس في المخزن المصدر المحدد. يوجد في: ${sourceItem.warehouse_id}`);
      }

      // ========== STEP 2: VALIDATE QUANTITIES ==========
      const currentCartons = Number(sourceItem.cartons_count) || 0;
      const currentSingles = Number(sourceItem.single_bottles_count) || 0;
      const perCarton = Number(sourceItem.per_carton_count) || 12;
      
      const transferCartons = Number(transferData.cartons_count) || 0;
      const transferSingles = Number(transferData.single_bottles_count) || 0;
      
      console.log('🔢 Quantity validation:', {
        current: { cartons: currentCartons, singles: currentSingles },
        transfer: { cartons: transferCartons, singles: transferSingles },
        perCarton: perCarton
      });

      // Validate cartons
      if (transferCartons > currentCartons) {
        throw new Error(`عدد الكرتونات المطلوبة (${transferCartons}) أكبر من المتاح (${currentCartons})`);
      }
      
      // Validate singles
      if (transferSingles > currentSingles) {
        throw new Error(`عدد القزاز الفردي المطلوب (${transferSingles}) أكبر من المتاح (${currentSingles})`);
      }

      // Calculate total quantities
      const transferTotalQuantity = (transferCartons * perCarton) + transferSingles;
      const currentTotalQuantity = (currentCartons * perCarton) + currentSingles;
      
      if (transferTotalQuantity <= 0) {
        throw new Error('يجب إدخال كمية صحيحة للنقل (أكبر من صفر)');
      }

      if (transferTotalQuantity > currentTotalQuantity) {
        throw new Error(`الكمية المطلوبة للنقل (${transferTotalQuantity}) أكبر من الكمية المتاحة (${currentTotalQuantity})`);
      }

      // ========== STEP 3: UPDATE SOURCE ITEM (REDUCE) ==========
      const newSourceCartons = currentCartons - transferCartons;
      const newSourceSingles = currentSingles - transferSingles;
      const newSourceTotal = (newSourceCartons * perCarton) + newSourceSingles;

      console.log('📉 Source item update:', {
        before: { cartons: currentCartons, singles: currentSingles, total: currentTotalQuantity },
        after: { cartons: newSourceCartons, singles: newSourceSingles, total: newSourceTotal }
      });

      // Update source item
      transaction.update(sourceItemRef, {
        cartons_count: newSourceCartons,
        single_bottles_count: newSourceSingles,
        remaining_quantity: newSourceTotal,
        updated_at: serverTimestamp(),
        updated_by: state.user.uid
      });

      // ========== STEP 4: CHECK DESTINATION ITEM (SAME LOGIC AS addInventoryItem) ==========
      console.log('🔍 Checking for existing item in destination...');
      
      // Clean data for comparison (same as addInventoryItem)
      const cleanedData = {
        name: sourceItem.name.trim(),
        code: sourceItem.code.trim(),
        color: sourceItem.color?.trim() || '',
        warehouse_id: transferData.to_warehouse_id
      };

      console.log('🔍 Looking for item with:', cleanedData);

      // Query for existing item in destination (SAME LOGIC AS addInventoryItem)
      const itemsRef = collection(db, 'items');
      const destQuery = query(
        itemsRef,
        where('name', '==', cleanedData.name),
        where('code', '==', cleanedData.code),
        where('color', '==', cleanedData.color),
        where('warehouse_id', '==', cleanedData.warehouse_id),
        limit(1)
      );
      
      const destSnapshot = await getDocs(destQuery);
      let destItemRef;
      let isNewItem = false;
      let existingDestinationItem = null;

      if (!destSnapshot.empty) {
        // ✅ ITEM EXISTS IN DESTINATION - UPDATE IT (SAME BUSINESS LOGIC AS addInventoryItem)
        destItemRef = doc(db, 'items', destSnapshot.docs[0].id);
        existingDestinationItem = destSnapshot.docs[0].data();
        
        console.log('✅ Found existing item in destination:', {
          id: destSnapshot.docs[0].id,
          cartons: existingDestinationItem.cartons_count,
          singles: existingDestinationItem.single_bottles_count,
          per_carton: existingDestinationItem.per_carton_count
        });

        // Get current destination quantities
        const destCartons = Number(existingDestinationItem.cartons_count) || 0;
        const destSingles = Number(existingDestinationItem.single_bottles_count) || 0;
        const destPerCarton = Number(existingDestinationItem.per_carton_count) || perCarton;
        
        // 🔴 BUSINESS RULE: عدد الكراتين - ADD TRANSFER CARTONS TO EXISTING
        const newDestCartons = destCartons + transferCartons;
        
        // 🔴 BUSINESS RULE: عدد في الكرتونه - KEEP DESTINATION'S PER_CARTON (unless source is different?)
        // For now, keep destination's per_carton_count
        const finalPerCarton = destPerCarton;
        
        // 🔴 BUSINESS RULE: عدد القزاز الفردي - ADD TRANSFER SINGLES TO EXISTING
        const newDestSingles = destSingles + transferSingles;
        
        // 🔴 BUSINESS RULE: Convert single bottles to cartons if they complete a full carton
        let additionalCartonsFromSingles = 0;
        let finalDestSingles = newDestSingles;
        let finalDestCartons = newDestCartons;
        
        if (finalDestSingles >= finalPerCarton) {
          additionalCartonsFromSingles = Math.floor(finalDestSingles / finalPerCarton);
          finalDestSingles = finalDestSingles % finalPerCarton;
          finalDestCartons += additionalCartonsFromSingles;
          
          console.log(`🔄 Converting singles to cartons in destination: ${additionalCartonsFromSingles} cartons added`);
        }
        
        // Calculate new total
        const newDestTotal = (finalDestCartons * finalPerCarton) + finalDestSingles;
        
        console.log('📈 Destination item update:', {
          before: { cartons: destCartons, singles: destSingles, total: (destCartons * destPerCarton) + destSingles },
          after: { cartons: finalDestCartons, singles: finalDestSingles, total: newDestTotal },
          added: { cartons: transferCartons, singles: transferSingles },
          converted: additionalCartonsFromSingles
        });

        // Prepare update data (SAME STRUCTURE AS addInventoryItem)
        const updateData = {
          cartons_count: finalDestCartons,
          per_carton_count: finalPerCarton,
          single_bottles_count: finalDestSingles,
          remaining_quantity: newDestTotal,
          updated_at: serverTimestamp(),
          updated_by: state.user.uid
        };

        // Update total_added only if carton quantity was added
        const cartonsQuantityAdded = transferCartons * finalPerCarton;
        if (cartonsQuantityAdded > 0) {
          updateData.total_added = (existingDestinationItem.total_added || 0) + cartonsQuantityAdded;
        }
        
        // Update optional fields from source if destination doesn't have them
        if (!existingDestinationItem.supplier && sourceItem.supplier) {
          updateData.supplier = sourceItem.supplier.trim();
        }
        
        if (!existingDestinationItem.item_location && sourceItem.item_location) {
          updateData.item_location = sourceItem.item_location.trim();
        }
        
        if (!existingDestinationItem.notes && sourceItem.notes) {
          updateData.notes = sourceItem.notes.trim();
        }

        transaction.update(destItemRef, updateData);

      } else {
        // ❌ ITEM DOESN'T EXIST IN DESTINATION - CREATE NEW (SAME LOGIC AS addInventoryItem)
        console.log('➕ Creating new item in destination (no matching item found)');
        
        destItemRef = doc(collection(db, 'items'));
        isNewItem = true;
        
        // Calculate quantities for new item
        let finalTransferCartons = transferCartons;
        let finalTransferSingles = transferSingles;
        let additionalCartonsFromSingles = 0;
        
        // 🔴 BUSINESS RULE: Convert single bottles to cartons if complete
        if (finalTransferSingles >= perCarton) {
          additionalCartonsFromSingles = Math.floor(finalTransferSingles / perCarton);
          finalTransferSingles = finalTransferSingles % perCarton;
          finalTransferCartons += additionalCartonsFromSingles;
          
          console.log(`🔄 Converting singles for new item: ${finalTransferSingles} → ${additionalCartonsFromSingles} cartons + ${finalTransferSingles} singles`);
        }
        
        // Calculate total quantity
        const destTotalQuantity = (finalTransferCartons * perCarton) + finalTransferSingles;
        
        // Prepare new item data (SAME STRUCTURE AS addInventoryItem)
        const newItemData = {
          name: cleanedData.name,
          code: cleanedData.code,
          color: cleanedData.color,
          warehouse_id: cleanedData.warehouse_id,
          cartons_count: finalTransferCartons,
          per_carton_count: perCarton,
          single_bottles_count: finalTransferSingles,
          supplier: sourceItem.supplier?.trim() || null,
          item_location: sourceItem.item_location?.trim() || null,
          notes: sourceItem.notes?.trim() || null,
          photo_url: sourceItem.photo_url || null,
          remaining_quantity: destTotalQuantity,
          total_added: destTotalQuantity,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
          created_by: state.user.uid,
          updated_by: state.user.uid
        };

        console.log('📝 New destination item data:', newItemData);
        
        transaction.set(destItemRef, newItemData);
      }

      // ========== STEP 5: CREATE TRANSACTION RECORD ==========
      const transactionRef = doc(collection(db, 'transactions'));
      
      // 🔴 CRITICAL FIX: Add quantity fields for display in transactions page
      const transactionRecord = {
        type: TRANSACTION_TYPES.TRANSFER,
        
        // 🔴 QUANTITY FIELDS ADDED HERE
        quantity: transferTotalQuantity, // For display in transactions table
        total_delta: transferTotalQuantity, // For display in transactions table
        new_remaining: newSourceTotal, // For display in transactions table
        
        // Source item info
        source_item_id: transferData.item_id,
        item_name: sourceItem.name,
        item_code: sourceItem.code,
        item_color: sourceItem.color || '',
        
        // Warehouse info
        from_warehouse: transferData.from_warehouse_id,
        to_warehouse: transferData.to_warehouse_id,
        
        // Detailed transfer quantities
        cartons_transferred: transferCartons,
        per_carton_count: perCarton,
        singles_transferred: transferSingles,
        total_quantity_transferred: transferTotalQuantity,
        
        // Source item before/after
        source_before: {
          cartons_count: currentCartons,
          single_bottles_count: currentSingles,
          remaining_quantity: currentTotalQuantity
        },
        source_after: {
          cartons_count: newSourceCartons,
          single_bottles_count: newSourceSingles,
          remaining_quantity: newSourceTotal
        },
        
        // Destination info
        destination_item_id: destItemRef.id,
        is_new_destination_item: isNewItem,
        destination_item_exists: !!existingDestinationItem,
        
        // User info
        user_id: state.user.uid,
        user_name: state.userProfile?.name || state.user?.email,
        user_role: state.userProfile?.role,
        user_email: state.user?.email,
        
        // Timestamps
        timestamp: serverTimestamp(),
        created_at: serverTimestamp(),
        
        // Metadata
        notes: transferData.notes || 'نقل بين المخازن',
        transfer_type: 'warehouse_transfer',
        detailed_breakdown: true,
        atomic_operation: true,
        
        // Additional info
        source_warehouse_name: transferData.from_warehouse_name || '',
        destination_warehouse_name: transferData.to_warehouse_name || '',
        created_by: state.userProfile?.name || state.user?.email || 'نظام'
      };

      transaction.set(transactionRef, transactionRecord);

      // ========== STEP 6: CREATE ITEM HISTORY RECORDS ==========
      // Source item history
      const sourceHistoryRef = doc(collection(db, 'item_history'));
      const sourceHistoryData = {
        item_id: transferData.item_id,
        warehouse_id: transferData.from_warehouse_id,
        change_type: 'TRANSFER_OUT',
        
        // Detailed quantity changes
        old_cartons: currentCartons,
        old_single_bottles: currentSingles,
        old_quantity: currentTotalQuantity,
        
        new_cartons: newSourceCartons,
        new_single_bottles: newSourceSingles,
        new_quantity: newSourceTotal,
        
        cartons_delta: -transferCartons,
        single_bottles_delta: -transferSingles,
        quantity_delta: -transferTotalQuantity,
        
        // Transfer details
        transfer_to_warehouse: transferData.to_warehouse_id,
        transfer_to_item_id: destItemRef.id,
        
        // User info
        user_id: state.user.uid,
        user_name: state.userProfile?.name || state.user?.email,
        timestamp: serverTimestamp(),
        
        details: {
          name: sourceItem.name,
          code: sourceItem.code,
          color: sourceItem.color,
          notes: transferData.notes,
          transaction_id: transactionRef.id
        }
      };
      
      transaction.set(sourceHistoryRef, sourceHistoryData);

      // Destination item history
      const destHistoryRef = doc(collection(db, 'item_history'));
      const destHistoryData = {
        item_id: destItemRef.id,
        warehouse_id: transferData.to_warehouse_id,
        change_type: isNewItem ? 'CREATE' : 'TRANSFER_IN',
        
        // For existing items, track before/after
        ...(existingDestinationItem ? {
          old_cartons: existingDestinationItem.cartons_count || 0,
          old_single_bottles: existingDestinationItem.single_bottles_count || 0,
          old_quantity: existingDestinationItem.remaining_quantity || 0
        } : {}),
        
        // Transfer details
        transfer_from_warehouse: transferData.from_warehouse_id,
        transfer_from_item_id: transferData.item_id,
        
        // User info
        user_id: state.user.uid,
        user_name: state.userProfile?.name || state.user?.email,
        timestamp: serverTimestamp(),
        
        details: {
          name: sourceItem.name,
          code: sourceItem.code,
          color: sourceItem.color,
          cartons_received: transferCartons,
          singles_received: transferSingles,
          total_received: transferTotalQuantity,
          notes: transferData.notes,
          transaction_id: transactionRef.id,
          is_new_item: isNewItem
        }
      };
      
      transaction.set(destHistoryRef, destHistoryData);

      // Return comprehensive result
      return {
        sourceItemId: transferData.item_id,
        destItemId: destItemRef.id,
        isNewItem: isNewItem,
        transferTotalQuantity,
        sourceUpdate: {
          cartons_count: newSourceCartons,
          single_bottles_count: newSourceSingles,
          remaining_quantity: newSourceTotal
        },
        transactionId: transactionRef.id,
        transactionData: transactionRecord,
        existingDestinationItem: existingDestinationItem
      };
    });

    // ========== UPDATE LOCAL VUEX STATE ==========
    console.log('✅ Atomic transaction completed successfully');
    
    // 1. Update source item in local inventory
    const sourceIndex = state.inventory.findIndex(item => item.id === transferData.item_id);
    if (sourceIndex !== -1) {
      const updatedSourceItem = {
        ...state.inventory[sourceIndex],
        cartons_count: result.sourceUpdate.cartons_count,
        single_bottles_count: result.sourceUpdate.single_bottles_count,
        remaining_quantity: result.sourceUpdate.remaining_quantity,
        updated_at: new Date()
      };
      
      commit('UPDATE_INVENTORY_ITEM', updatedSourceItem);
    }
    
    // 2. 🔴 CRITICAL FIX: Create complete transaction object with quantity for Vuex state
    const transactionForState = {
      id: result.transactionId,
      ...result.transactionData,
      timestamp: new Date(),
      created_at: new Date(),
      
      // 🔴 Ensure quantity fields are included for display
      quantity: result.transferTotalQuantity,
      total_delta: result.transferTotalQuantity,
      new_remaining: result.sourceUpdate.remaining_quantity,
      
      // Additional fields for display
      display_quantity: `${result.transferTotalQuantity} وحدة`,
      display_type: 'نقل بين مخازن'
    };
    
    // Add transaction to main transactions list AND recent transactions
    commit('ADD_TRANSACTION', transactionForState);
    
    // Also add to recent transactions
    commit('ADD_RECENT_TRANSACTION', transactionForState);

    // 3. Show success notification
    const message = result.isNewItem 
      ? `تم إنشاء صنف جديد في المخزن الهدف وتم نقل ${result.transferTotalQuantity} وحدة`
      : `تم نقل ${result.transferTotalQuantity} وحدة إلى المخزن الهدف بنجاح`;

    dispatch('showNotification', {
      type: 'success',
      title: 'تم النقل بنجاح',
      message: message,
      icon: 'check-circle',
      timeout: 5000
    });

    // 4. Log detailed transfer info
    console.log('📊 Transfer completed successfully:', {
      sourceItem: transferData.item_id,
      destinationItem: result.destItemId,
      isNewItem: result.isNewItem,
      quantityTransferred: result.transferTotalQuantity,
      transactionId: result.transactionId,
      transactionAddedToState: true,
      quantityInTransaction: result.transferTotalQuantity
    });

    return {
      success: true,
      message: 'تم النقل بنجاح',
      transactionId: result.transactionId,
      transferTotalQuantity: result.transferTotalQuantity,
      sourceItemId: transferData.item_id,
      destinationItemId: result.destItemId,
      isNewDestinationItem: result.isNewItem,
      details: result.transactionData
    };

  } catch (error) {
    console.error('❌ TRANSFER FAILED:', error);
    console.error('Error stack:', error.stack);
    
    commit('SET_OPERATION_ERROR', error.message);
    
    // Detailed error notification
    let errorMessage = error.message;
    if (error.message.includes('ليس لديك صلاحية')) {
      errorMessage = 'ليس لديك صلاحية لإجراء عملية النقل.';
    } else if (error.message.includes('الصنف ليس في المخزن المصدر')) {
      errorMessage = 'الصنف المحدد ليس في المخزن المصدر. ربما تم نقله مؤخراً.';
    } else if (error.message.includes('أكبر من المتاح')) {
      errorMessage = 'الكمية المطلوبة تتجاوز الكمية المتاحة.';
    }

    dispatch('showNotification', {
      type: 'error',
      title: 'فشل النقل',
      message: errorMessage,
      icon: 'alert-circle',
      timeout: 7000
    });

    return {
      success: false,
      message: errorMessage,
      error: error
    };
  } finally {
    commit('SET_OPERATION_LOADING', false);
  }
},
// ============================================
// SIMPLE LOAD MORE TRANSACTIONS ACTION
// ============================================
async loadMoreTransactions({ commit, state, dispatch }) {
  if (state.pagination.isFetching) {
    return [];
  }

  commit('SET_PAGINATION', { isFetching: true });

  try {
    console.log('📥 Loading more transactions (simple method)...');

    // Get all transactions and filter client-side
    const transactionsRef = collection(db, 'transactions');
    const allDocs = await getDocs(transactionsRef);
    
    // Convert to array and sort by timestamp
    const allTransactions = allDocs.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).sort((a, b) => {
      const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
      const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
      return dateB - dateA;
    });

    // Calculate what to show
    const currentCount = state.transactions.length;
    const newTransactions = allTransactions.slice(currentCount, currentCount + PERFORMANCE_CONFIG.SCROLL_LOAD);

    if (newTransactions.length === 0) {
      console.log('📭 No more transactions to load');
      commit('SET_PAGINATION', { 
        hasMore: false, 
        isFetching: false 
      });
      return [];
    }

    // Add new transactions
    const updatedTransactions = [...state.transactions, ...newTransactions];
    commit('SET_TRANSACTIONS', updatedTransactions);
    
    // Update pagination
    const hasMore = currentCount + newTransactions.length < allTransactions.length;
    commit('SET_PAGINATION', {
      hasMore: hasMore,
      isFetching: false,
      totalLoaded: updatedTransactions.length
    });

    console.log(`✅ Loaded ${newTransactions.length} more transactions (total: ${updatedTransactions.length}, hasMore: ${hasMore})`);

    return newTransactions;

  } catch (error) {
    console.error('❌ Error loading more transactions:', error);
    
    commit('SET_PAGINATION', { 
      isFetching: false 
    });
    
    dispatch('showNotification', {
      type: 'error',
      message: 'خطأ في تحميل المزيد من الحركات'
    });

    return [];
  }
},

// ============================================
// LOAD ITEMS FROM A SPECIFIC WAREHOUSE (PAGINATED)
// ============================================
async loadWarehouseItems({ commit, state, dispatch }, { warehouseId, limit = 50, lastDoc = null } = {}) {
  try {
    if (!warehouseId) {
      throw new Error('معرف المخزن مطلوب');
    }

    console.log(`🔄 Loading warehouse items (${warehouseId})...`);

    // 🔴 CRITICAL: Ensure Firebase is ready (optional, but keep for safety)
    await ensureFirebaseReady();

    if (!db) {
      throw new Error('Firestore database not available');
    }

    // Check user permissions
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
      // Ensure lastDoc is a valid DocumentSnapshot
      let lastSnapshot = lastDoc;
      if (typeof lastDoc === 'string') {
        // If it's a string ID, get the document snapshot
        lastSnapshot = await getDoc(doc(db, 'items', lastDoc));
      }

      itemsQuery = query(
        itemsRef,
        where('warehouse_id', '==', warehouseId),
        orderBy('name'), // Use a consistent field for ordering
        startAfter(lastSnapshot),
        limit(limit)
      );
    } else {
      itemsQuery = query(
        itemsRef,
        where('warehouse_id', '==', warehouseId),
        orderBy('name'),
        limit(limit)
      );
    }

    const snapshot = await getDocs(itemsQuery);
    console.log(`✅ Loaded ${snapshot.size} items from warehouse ${warehouseId}`);

    const items = snapshot.docs.map(doc => {
      const itemData = doc.data();
      // Use InventoryService to ensure all fields are present
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
    
    // Handle serialization errors
    if (error.name === 'DataCloneError' || error.message.includes('could not be cloned')) {
      console.warn('🔄 IndexedDB serialization error in warehouse items');
      return {
        items: [],
        lastDoc: null,
        hasMore: false
      };
    }
    
    dispatch('showNotification', {
      type: 'error',
      message: error.message || 'خطأ في تحميل الأصناف من المخزن'
    });

    // Fallback to local inventory if available
    const localItems = state.inventory.filter(item => item.warehouse_id === warehouseId);
    return {
      items: localItems.slice(0, limit),
      lastDoc: null,
      hasMore: false
    };
  }
}
// ============================================
// SETUP REAL-TIME TRANSACTIONS
// ============================================
async setupRealtimeTransactions({ commit, state }) {
  if (state.realtimeListeners.length > 0) {
    console.log('⚠️ Real-time transactions already set up');
    return;
  }

  try {
    console.log('🔴 Setting up real-time transactions...');

    const transactionsRef = collection(db, 'transactions');
    const q = query(
      transactionsRef,
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      commit('SET_TRANSACTIONS', transactions);
      
      // Add recent transactions
      const recentTransactions = transactions.slice(0, 30);
      commit('SET_RECENT_TRANSACTIONS', recentTransactions);
    });

    commit('ADD_REALTIME_LISTENER', unsubscribe);
    console.log('✅ Real-time transactions set up successfully');

  } catch (error) {
    console.error('❌ Error setting up real-time transactions:', error);
  }
},
    
// ============================================
// SIMPLE CREATE USER ACTION (EXACT MATCH TO MODAL)
// ============================================
async createUser({ commit, state, dispatch }, userData) {
  commit('SET_OPERATION_LOADING', true);
  commit('CLEAR_OPERATION_ERROR');

  try {
    console.log('🔄 CREATE USER - SIMPLE MATCH:', {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      permissions: userData.permissions?.length || 0,
      warehouses: userData.allowedWarehouses?.length || 0,
      allWarehouses: userData.allWarehouses
    });

    // 🔴 1. ONLY SUPERADMIN CAN CREATE USERS
    if (state.userProfile?.role !== 'superadmin') {
      throw new Error('فقط المشرف العام يمكنه إنشاء مستخدمين');
    }

    // 🔴 2. CHECK REQUIRED FIELDS
    if (!userData.name?.trim() || !userData.email?.trim() || !userData.role) {
      throw new Error('الاسم والبريد والدور مطلوبون');
    }

    // 🔴 3. CHECK EMAIL
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('البريد الإلكتروني غير صالح');
    }

    // Check if email exists
    const usersRef = collection(db, 'users');
    const emailQuery = query(usersRef, where('email', '==', userData.email.toLowerCase().trim()), limit(1));
    const emailSnapshot = await getDocs(emailQuery);
    
    if (!emailSnapshot.empty) {
      throw new Error('البريد الإلكتروني مستخدم بالفعل');
    }

    // 🔴 4. CHECK WAREHOUSES (from modal's checkboxes)
    let allowedWarehouses = {};
    
    if (userData.allWarehouses === true) {
      allowedWarehouses = { all: true };
    } else if (userData.allowedWarehouses && Array.isArray(userData.allowedWarehouses) && userData.allowedWarehouses.length > 0) {
      userData.allowedWarehouses.forEach(warehouseId => {
        allowedWarehouses[warehouseId] = true;
      });
    } else {
      throw new Error('يجب تحديد المخازن المسموح بها');
    }

    console.log('🏭 Warehouse access:', allowedWarehouses);

    // 🔴 5. CHECK PERMISSIONS (from modal's checkboxes)
    const permissions = userData.permissions || [];
    
    if (permissions.length === 0) {
      throw new Error('يجب تحديد صلاحيات للمستخدم');
    }

    console.log('🔑 Permissions from modal:', permissions);

    // 🔴 6. ALWAYS ADD VIEW PERMISSIONS (default for all users)
    const defaultViewPermissions = [
      'view_items',      // View items in allowed warehouses
      'view_invoices',   // View invoices
      'view_reports',    // View reports
      'view_movements'   // View item movements
    ];

    // Combine selected + default view permissions
    const allPermissions = [...new Set([...defaultViewPermissions, ...permissions])];

    console.log('✅ Final permissions:', {
      selected: permissions.length,
      defaults: defaultViewPermissions.length,
      total: allPermissions.length
    });

    // 🔴 7. CREATE FIREBASE AUTH USER
    const { createUserWithEmailAndPassword } = await import('firebase/auth');

    let password = userData.password;
    if (!password || password === 'auto') {
      // Simple password generation
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      password = Array.from(crypto.getRandomValues(new Uint32Array(10)))
        .map(value => chars[value % chars.length])
        .join('');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
    const firebaseUser = userCredential.user;

    // 🔴 8. SAVE USER TO FIRESTORE (EXACT MATCH TO MODAL DATA)
    const userDoc = {
      // Basic info (from modal)
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      role: userData.role,
      
      // Permissions (from modal checkboxes + defaults)
      permissions: allPermissions,
      
      // Warehouses (from modal checkboxes)
      allowed_warehouses: allowedWarehouses,
      
      // Contact info (from modal)
      phone: userData.phone || '',
      phoneCountryCode: userData.phoneCountryCode || '+966',
      
      // Account settings (from modal)
      is_active: userData.isActive !== false,
      two_factor_enabled: userData.twoFactorEnabled || false,
      
      // Notes (from modal)
      notes: userData.notes || '',
      
      // Timestamps
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      created_by: state.user.uid,
      created_by_name: state.userProfile?.name || state.user?.email,
      
      // Simple metadata
      last_login: null,
      login_count: 0
    };

    console.log('💾 Saving user to Firestore...');
    await setDoc(doc(db, 'users', firebaseUser.uid), userDoc);

    // 🔴 9. UPDATE LOCAL STATE
    const newUser = {
      id: firebaseUser.uid,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      permissions: allPermissions,
      allowed_warehouses: allowedWarehouses,
      is_active: userData.isActive !== false,
      created_at: new Date().toISOString()
    };

    commit('SET_ALL_USERS', [...state.allUsers, newUser]);

    // 🔴 10. SHOW SUCCESS
    const warehouseText = userData.allWarehouses ? 
      'جميع المخازن' : 
      `${Object.keys(allowedWarehouses).length} مخزن`;

    dispatch('showNotification', {
      type: 'success',
      message: `تم إنشاء ${userData.name}<br>الصلاحيات: ${permissions.length}<br>المخازن: ${warehouseText}`,
      timeout: 8000,
      html: true
    });

    // 🔴 11. RETURN RESULT (exact match what modal expects)
    return {
      success: true,
      user: newUser,
      password: userData.sendWelcomeEmail ? null : password,
      message: 'تم إنشاء المستخدم بنجاح'
    };

  } catch (error) {
    console.error('❌ CREATE USER ERROR:', error);

    let errorMessage = error.message;
    
    // Simple Arabic error messages
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'البريد مستخدم بالفعل';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'بريد غير صالح';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'كلمة مرور ضعيفة';
    }

    commit('SET_OPERATION_ERROR', errorMessage);

    dispatch('showNotification', {
      type: 'error',
      message: errorMessage,
      timeout: 5000
    });

    return {
      success: false,
      message: errorMessage
    };
  } finally {
    commit('SET_OPERATION_LOADING', false);
  }
},
// ============================================
// SIMPLE UPDATE USER ACTION (EXACT MATCH TO MODAL)
// ============================================
async updateUser({ commit, state, dispatch }, { userId, userData }) {
  commit('SET_OPERATION_LOADING', true);
  commit('CLEAR_OPERATION_ERROR');

  try {
    console.log('🔄 UPDATE USER - SIMPLE:', {
      userId,
      name: userData.name,
      role: userData.role,
      permissions: userData.permissions?.length || 0
    });

    // 🔴 1. CHECK PERMISSIONS
    if (state.userProfile?.role !== 'superadmin') {
      throw new Error('فقط المشرف العام يمكنه تعديل المستخدمين');
    }

    // 🔴 2. GET EXISTING USER
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('المستخدم غير موجود');
    }

    const existingUser = userDoc.data();

    // 🔴 3. PREPARE UPDATE DATA (EXACT FROM MODAL)
    const updateData = {
      updated_at: serverTimestamp(),
      updated_by: state.user.uid
    };

    // Add fields from modal
    if (userData.name !== undefined) updateData.name = userData.name.trim();
    if (userData.role !== undefined) updateData.role = userData.role;
    if (userData.phone !== undefined) updateData.phone = userData.phone;
    if (userData.isActive !== undefined) updateData.is_active = userData.isActive;
    if (userData.notes !== undefined) updateData.notes = userData.notes;

    // 🔴 4. HANDLE PERMISSIONS (from modal checkboxes)
    if (userData.permissions !== undefined) {
      const defaultViewPermissions = ['view_items', 'view_invoices', 'view_reports', 'view_movements'];
      const allPermissions = [...new Set([...defaultViewPermissions, ...userData.permissions])];
      updateData.permissions = allPermissions;
    }

    // 🔴 5. HANDLE WAREHOUSES (from modal checkboxes)
    if (userData.allowedWarehouses !== undefined || userData.allWarehouses !== undefined) {
      let allowedWarehouses = {};
      
      if (userData.allWarehouses === true) {
        allowedWarehouses = { all: true };
      } else if (userData.allowedWarehouses && Array.isArray(userData.allowedWarehouses)) {
        userData.allowedWarehouses.forEach(warehouseId => {
          allowedWarehouses[warehouseId] = true;
        });
      }
      
      updateData.allowed_warehouses = allowedWarehouses;
    }

    console.log('💾 Updating user with:', updateData);

    // 🔴 6. UPDATE FIRESTORE
    await updateDoc(userRef, updateData);

    // 🔴 7. UPDATE LOCAL STATE
    const updatedUser = { ...existingUser, ...updateData, id: userId };
    const updatedUsers = state.allUsers.map(user => 
      user.id === userId ? updatedUser : user
    );
    
    commit('SET_ALL_USERS', updatedUsers);

    // 🔴 8. SHOW SUCCESS
    dispatch('showNotification', {
      type: 'success',
      message: `تم تحديث ${userData.name || 'المستخدم'}`,
      timeout: 5000
    });

    return {
      success: true,
      user: updatedUser
    };

  } catch (error) {
    console.error('❌ UPDATE ERROR:', error);
    
    commit('SET_OPERATION_ERROR', error.message);
    
    dispatch('showNotification', {
      type: 'error',
      message: error.message || 'فشل التحديث',
      timeout: 5000
    });

    return {
      success: false,
      message: error.message
    };
  } finally {
    commit('SET_OPERATION_LOADING', false);
  }
},    
// ============================================
// GET DISPATCH WAREHOUSES ACTION - DATABASE ONLY
// ============================================
async getDispatchWarehouses({ dispatch }) {
  try {
    console.log('🔄 Fetching dispatch warehouses from database...');
    
    // 🔴 CRITICAL: Ensure Firebase is ready
    console.log('⏳ Ensuring Firebase is ready for dispatch warehouses...');
    await ensureFirebaseReady();
    console.log('✅ Firebase ready for dispatch warehouses');

    if (!db) {
      console.error('❌ Firestore database not available');
      throw new Error('Firestore database not available');
    }

    // Import Firestore functions
    const firebaseFirestore = await import('firebase/firestore');
    const {
      collection,
      query,
      where,
      orderBy,
      getDocs
    } = firebaseFirestore;

    // Query ONLY dispatch warehouses (type === 'dispatch')
    const warehousesRef = collection(db, 'warehouses');
    const q = query(
      warehousesRef,
      where('type', '==', 'dispatch'), // 🔴 Only fetch dispatch type
      orderBy('name_ar') // Optional: order by Arabic name
    );

    console.log('🔍 Executing dispatch warehouses query...');
    const snapshot = await getDocs(q);
    console.log(`📊 Found ${snapshot.size} dispatch warehouses in database`);
    
    // Map results from database WITHOUT hardcoding
    const dispatchWarehouses = [];
    
    snapshot.forEach(doc => {
      try {
        const data = doc.data();
        const warehouseId = doc.id;
        
        // 🔴 DEBUG: Log what we're getting from database
        console.log(`📋 Warehouse ${warehouseId}:`, {
          name_ar: data.name_ar,
          name: data.name,
          type: data.type,
          is_active: data.is_active
        });
        
        // 🔴 Use ONLY database values, NO hardcoding
        const arabicName = data.name_ar || data.name || warehouseId;
        
        // Return complete warehouse data from database
        const warehouse = {
          id: warehouseId,
          name_ar: arabicName, // From database
          name: data.name || '', // From database
          type: data.type || 'dispatch', // Should be 'dispatch' from query
          location: data.location || '',
          is_active: data.is_active !== false,
          is_main: data.is_main || false,
          created_at: data.created_at,
          updated_at: data.updated_at,
          // Include all other fields from database
          ...data
        };
        
        dispatchWarehouses.push(warehouse);
      } catch (docError) {
        console.warn(`⚠️ Error processing warehouse document ${doc.id}:`, docError);
      }
    });

    console.log(`✅ Dispatch warehouses loaded from database: ${dispatchWarehouses.length}`);
    
    // Debug log to verify data
    if (dispatchWarehouses.length > 0) {
      console.log('🎯 Final dispatch warehouses list:', 
        dispatchWarehouses.map(w => ({ 
          id: w.id, 
          name_ar: w.name_ar,
          name: w.name,
          type: w.type,
          is_active: w.is_active
        }))
      );
    } else {
      console.warn('⚠️ No dispatch warehouses found in database with type="dispatch"');
      
      // Optional: Check if there are any warehouses at all
      const allWarehousesRef = collection(db, 'warehouses');
      const allSnapshot = await getDocs(query(allWarehousesRef, limit(10)));
      
      const allWarehouses = allSnapshot.docs.map(doc => ({
        id: doc.id,
        name_ar: doc.data().name_ar,
        name: doc.data().name,
        type: doc.data().type || 'not specified'
      }));
      
      console.log('📊 First 10 warehouses in database (all types):', allWarehouses);
    }
    
    return dispatchWarehouses;

  } catch (error) {
    console.error('❌ Error loading dispatch warehouses:', error);
    console.error('Error stack:', error.stack);
    
    // Show a helpful error message
    dispatch('showNotification', {
      type: 'error',
      message: `خطأ في تحميل مخازن الصرف: ${error.message || 'يرجى التحقق من اتصال الإنترنت'}`
    });
    
    return [];
  }
},

// ============================================
// ENHANCED DISPATCH ITEM ACTION WITH UTF-8 SUPPORT
// ============================================
async dispatchItem({ commit, state, dispatch }, dispatchData) {
  commit('SET_OPERATION_LOADING', true);
  commit('CLEAR_OPERATION_ERROR');

  try {
    console.log('🚀 Starting dispatch with enhanced UTF-8 support:', {
      item_id: dispatchData.item_id,
      destination: dispatchData.destination,
      from_warehouse_id: dispatchData.from_warehouse_id,
      cartons_count: dispatchData.cartons_count,
      single_bottles_count: dispatchData.single_bottles_count
    });

    // 🔴 VALIDATION: User authentication
    if (!state.userProfile) {
      throw new Error('يجب تسجيل الدخول أولاً');
    }

    if (!['superadmin', 'warehouse_manager'].includes(state.userProfile.role)) {
      throw new Error('ليس لديك صلاحية لصرف الأصناف');
    }

    // 🔴 VALIDATION: Required fields
    const requiredFields = [
      { field: dispatchData.item_id, name: 'معرف الصنف' },
      { field: dispatchData.from_warehouse_id, name: 'المخزن المصدر' },
      { field: dispatchData.destination, name: 'الوجهة' },
      { field: dispatchData.destination_id, name: 'معرف الوجهة' }
    ];

    const missingFields = requiredFields.filter(f => !f.field);
    if (missingFields.length > 0) {
      throw new Error(`بيانات الصرف غير مكتملة: ${missingFields.map(f => f.name).join('، ')}`);
    }

    // 🔴 VALIDATION: Warehouse access
    if (state.userProfile.role === 'warehouse_manager') {
      const allowedWarehouses = state.userProfile.allowed_warehouses || [];
      if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
        if (!allowedWarehouses.includes(dispatchData.from_warehouse_id)) {
          throw new Error('ليس لديك صلاحية للصرف من هذا المخزن');
        }
      }
    }

    // 🔴 ENSURE FIREBASE IS READY
    console.log('⏳ Ensuring Firebase is ready for dispatch...');
    await ensureFirebaseReady();
    console.log('✅ Firebase ready for dispatch');
    
    if (!db) {
      throw new Error('Firestore database not available');
    }

    // ========== ARABIC TEXT NORMALIZATION ==========
    const normalizeArabic = (text) => {
      if (!text || typeof text !== 'string') return '';
      // Ensure UTF-8 encoding
      return text.trim();
    };

    // Prepare normalized Arabic data
    const normalizedData = {
      // Essential fields
      item_id: dispatchData.item_id,
      from_warehouse_id: dispatchData.from_warehouse_id,
      destination: normalizeArabic(dispatchData.destination || 'dispat_item'),
      destination_id: dispatchData.destination_id,
      
      // 🔴 CRITICAL: Arabic text with UTF-8
      item_name: normalizeArabic(dispatchData.item_name || ''),
      from_warehouse_name: normalizeArabic(dispatchData.from_warehouse_name || ''),
      notes: normalizeArabic(dispatchData.notes || ''),
      
      // Quantity fields
      quantity: Number(dispatchData.quantity) || 0,
      cartons_count: Number(dispatchData.cartons_count) || 0,
      per_carton_count: Number(dispatchData.per_carton_count) || 12,
      single_bottles_count: Number(dispatchData.single_bottles_count) || 0,
      
      // Optional fields with normalization
      color: normalizeArabic(dispatchData.color || ''),
      supplier: normalizeArabic(dispatchData.supplier || ''),
      priority: normalizeArabic(dispatchData.priority || 'normal'),
      item_location: normalizeArabic(dispatchData.item_location || '')
    };

    console.log('📤 Normalized dispatch data:', normalizedData);

    // ========== ATOMIC TRANSACTION ==========
    const result = await runTransaction(db, async (transaction) => {
      // Get item document
      const itemRef = doc(db, 'items', normalizedData.item_id);
      const itemDoc = await transaction.get(itemRef);
      
      if (!itemDoc.exists()) {
        throw new Error('الصنف غير موجود في المخزن المصدر');
      }

      const itemData = itemDoc.data();

      // Verify item is in correct warehouse
      if (itemData.warehouse_id !== normalizedData.from_warehouse_id) {
        throw new Error(`الصنف ليس في المخزن المصدر المحدد. يوجد في: ${itemData.warehouse_id}`);
      }

      // Get current quantities
      const currentCartons = Number(itemData.cartons_count) || 0;
      const currentSingles = Number(itemData.single_bottles_count) || 0;
      const perCarton = normalizedData.per_carton_count;
      
      // Use detailed quantities if provided
      let dispatchCartons = normalizedData.cartons_count;
      let dispatchSingles = normalizedData.single_bottles_count;
      let dispatchTotal = normalizedData.quantity;

      // Calculate from total if detailed not provided
      if (!dispatchCartons && !dispatchSingles && dispatchTotal > 0) {
        dispatchCartons = Math.floor(dispatchTotal / perCarton);
        dispatchSingles = dispatchTotal % perCarton;
      }

      console.log('📊 Quantity calculations:', {
        current: { cartons: currentCartons, singles: currentSingles, perCarton: perCarton },
        dispatch: { cartons: dispatchCartons, singles: dispatchSingles, total: dispatchTotal }
      });

      // Validate quantities
      if (dispatchTotal <= 0) {
        throw new Error('يجب إدخال كمية صحيحة للصرف (أكبر من صفر)');
      }

      const currentTotal = (currentCartons * perCarton) + currentSingles;
      if (dispatchTotal > currentTotal) {
        throw new Error(`الكمية المطلوبة للصرف (${dispatchTotal}) أكبر من الكمية المتاحة (${currentTotal})`);
      }

      // Calculate new quantities
      let newCartons = currentCartons;
      let newSingles = currentSingles;
      let remainingSinglesToDispatch = dispatchSingles;

      // 1. Use available single bottles first
      if (remainingSinglesToDispatch > 0 && newSingles > 0) {
        const singlesToUse = Math.min(newSingles, remainingSinglesToDispatch);
        newSingles -= singlesToUse;
        remainingSinglesToDispatch -= singlesToUse;
      }

      // 2. Break cartons for remaining singles
      if (remainingSinglesToDispatch > 0) {
        const cartonsToBreak = Math.ceil(remainingSinglesToDispatch / perCarton);
        if (newCartons < cartonsToBreak) {
          throw new Error(`لا يوجد عدد كافٍ من الكرتونات للأكياس الفردية`);
        }
        newCartons -= cartonsToBreak;
        const bottlesFromBrokenCartons = cartonsToBreak * perCarton;
        newSingles += bottlesFromBrokenCartons - remainingSinglesToDispatch;
      }

      // 3. Remove whole cartons
      if (dispatchCartons > 0) {
        if (newCartons < dispatchCartons) {
          throw new Error(`لا يوجد عدد كافٍ من الكرتونات`);
        }
        newCartons -= dispatchCartons;
      }

      // Ensure non-negative values
      newCartons = Math.max(0, newCartons);
      newSingles = Math.max(0, newSingles);

      const newTotal = (newCartons * perCarton) + newSingles;

      console.log('🔄 Quantity update:', {
        previous: { cartons: currentCartons, singles: currentSingles, total: currentTotal },
        dispatch: { cartons: dispatchCartons, singles: dispatchSingles, total: dispatchTotal },
        new: { cartons: newCartons, singles: newSingles, total: newTotal }
      });

      // Update item
      transaction.update(itemRef, {
        cartons_count: newCartons,
        single_bottles_count: newSingles,
        remaining_quantity: newTotal,
        updated_at: serverTimestamp(),
        updated_by: state.user.uid
      });

      // ========== CREATE TRANSACTION RECORD WITH ARABIC SUPPORT ==========
      const transactionRef = doc(collection(db, 'transactions'));
      
      // 🔴 FIXED: Create complete transaction data with proper Arabic encoding
      const transactionData = {
        type: TRANSACTION_TYPES.DISPATCH,
        
        // Item identification
        item_id: normalizedData.item_id,
        item_name: normalizedData.item_name,
        item_code: itemData.code || '',
        color: normalizedData.color,
        
        // Warehouse info
        from_warehouse: normalizedData.from_warehouse_id,
        from_warehouse_name: normalizedData.from_warehouse_name,
        destination: normalizedData.destination,
        destination_id: normalizedData.destination_id,
        
        // Quantity info (for display in transactions page)
        quantity: dispatchTotal, // 🔴 هذا الحقل ضروري للعرض في صفحة الحركات
        total_delta: dispatchTotal, // 🔴 هذا أيضاً مهم
        new_remaining: newTotal, // 🔴 هذا يظهر الكمية الجديدة
        
        // Detailed quantities
        cartons_count: dispatchCartons,
        per_carton_count: perCarton,
        single_bottles_count: dispatchSingles,
        
        // Previous and new state
        previous_cartons: currentCartons,
        previous_single_bottles: currentSingles,
        previous_quantity: currentTotal,
        
        new_cartons: newCartons,
        new_single_bottles: newSingles,
        new_quantity: newTotal,
        
        // User info
        user_id: state.user.uid,
        user_name: normalizeArabic(state.userProfile?.name || ''),
        user_role: state.userProfile?.role || '',
        user_email: state.user?.email || '',
        
        // Timestamps
        timestamp: serverTimestamp(),
        created_at: serverTimestamp(),
        
        // Metadata
        notes: normalizedData.notes,
        priority: normalizedData.priority,
        status: 'completed',
        created_by: normalizeArabic(state.userProfile?.name || state.user?.email || 'نظام'),
        
        // 🔴 CRITICAL: Add these fields for proper display
        display_type: 'صرف',
        display_quantity: `${dispatchTotal} وحدة`,
        display_destination: normalizedData.destination,
        
        // Technical metadata
        atomic_operation: true,
        detailed_breakdown_applied: true,
        utf8_encoded: true
      };

      transaction.set(transactionRef, transactionData);

      // ========== CREATE ITEM HISTORY RECORD ==========
      const historyRef = doc(collection(db, 'item_history'));
      const historyData = {
        item_id: normalizedData.item_id,
        warehouse_id: normalizedData.from_warehouse_id,
        change_type: 'DISPATCH',
        
        // Quantity changes
        old_quantity: currentTotal,
        new_quantity: newTotal,
        quantity_delta: -dispatchTotal,
        
        old_cartons: currentCartons,
        new_cartons: newCartons,
        cartons_delta: -dispatchCartons,
        
        old_single_bottles: currentSingles,
        new_single_bottles: newSingles,
        single_bottles_delta: -dispatchSingles,
        
        // Dispatch details
        destination: normalizedData.destination,
        destination_id: normalizedData.destination_id,
        
        // User info
        user_id: state.user.uid,
        user_name: normalizeArabic(state.userProfile?.name || ''),
        timestamp: serverTimestamp(),
        
        details: {
          name: normalizedData.item_name,
          code: itemData.code || '',
          color: normalizedData.color,
          notes: normalizedData.notes,
          priority: normalizedData.priority,
          transaction_id: transactionRef.id,
          per_carton: perCarton,
          detailed_dispatch: true
        }
      };
      
      transaction.set(historyRef, historyData);

      return {
        transactionId: transactionRef.id,
        transactionData: transactionData,
        dispatchTotal: dispatchTotal,
        newTotal: newTotal,
        detailedUpdate: {
          cartons_count: newCartons,
          single_bottles_count: newSingles,
          per_carton_count: perCarton,
          remaining_quantity: newTotal
        }
      };
    });

    // ========== UPDATE LOCAL STATE ==========
    console.log('✅ Transaction completed successfully');
    
    // Update local inventory
    const inventoryIndex = state.inventory.findIndex(item => item.id === normalizedData.item_id);
    if (inventoryIndex !== -1) {
      const updatedItem = {
        ...state.inventory[inventoryIndex],
        cartons_count: result.detailedUpdate.cartons_count,
        single_bottles_count: result.detailedUpdate.single_bottles_count,
        remaining_quantity: result.detailedUpdate.remaining_quantity,
        updated_at: new Date()
      };
      
      commit('UPDATE_INVENTORY_ITEM', updatedItem);
    }

    // 🔴 FIXED: Create transaction object with all required fields for Vuex
    const transactionForState = {
      id: result.transactionId,
      ...result.transactionData,
      timestamp: new Date(),
      created_at: new Date(),
      
      // 🔴 Ensure these fields are present for display
      quantity: result.dispatchTotal,
      total_delta: result.dispatchTotal,
      new_remaining: result.newTotal,
      
      // Display fields
      display_quantity: `${result.dispatchTotal} وحدة`,
      display_type: 'صرف',
      display_destination: normalizedData.destination
    };

    // Add to transactions
    commit('ADD_TRANSACTION', transactionForState);
    commit('ADD_RECENT_TRANSACTION', transactionForState);

    // Show success notification
    dispatch('showNotification', {
      type: 'success',
      title: 'تم الصرف بنجاح',
      message: `تم صرف ${result.dispatchTotal} وحدة من "${normalizedData.item_name}" إلى ${normalizedData.destination}`,
      icon: 'check-circle',
      timeout: 5000
    });

    // Log success
    console.log('📊 Dispatch completed successfully:', {
      item: normalizedData.item_name,
      quantity: result.dispatchTotal,
      destination: normalizedData.destination,
      transactionId: result.transactionId
    });

    return {
      success: true,
      message: 'تم الصرف بنجاح',
      transactionId: result.transactionId,
      newQuantity: result.newTotal,
      detailedUpdate: result.detailedUpdate
    };

  } catch (error) {
    console.error('❌ Dispatch failed:', error);
    
    commit('SET_OPERATION_ERROR', error.message);
    
    dispatch('showNotification', {
      type: 'error',
      title: 'فشل الصرف',
      message: error.message || 'حدث خطأ أثناء عملية الصرف',
      icon: 'alert-circle',
      timeout: 7000
    });

    return {
      success: false,
      message: error.message || 'فشل الصرف'
    };
  } finally {
    commit('SET_OPERATION_LOADING', false);
  }
},
// ============================================
// DELETE ITEM ACTION (SPARK PLAN COMPATIBLE)
// ============================================
async deleteItem({ commit, state, dispatch }, itemId) {
  commit('SET_OPERATION_LOADING', true);
  commit('CLEAR_OPERATION_ERROR');

  try {
    console.log(`🗑️ DELETE Item Action - SPARK Plan: ${itemId}`);

    // 🔴 VALIDATION 1: Authentication
    if (!state.userProfile) {
      throw new Error('يجب تسجيل الدخول أولاً');
    }

    // 🔴 VALIDATION 2: Only superadmin can delete
    if (state.userProfile.role !== 'superadmin') {
      throw new Error('فقط المشرف العام يمكنه حذف الأصناف');
    }

    if (!itemId) {
      throw new Error('معرف الصنف مطلوب');
    }

    // 🔴 CRITICAL: Ensure Firebase is ready
    console.log('⏳ Ensuring Firebase is ready for delete...');
    await ensureFirebaseReady();
    console.log('✅ Firebase ready for delete');

    if (!db) {
      throw new Error('Firestore database not available');
    }

    // 🔴 DYNAMIC IMPORT (same as other actions)
    const firebaseFirestore = await import('firebase/firestore');
    const {
      doc,
      getDoc,
      deleteDoc,
      addDoc,
      collection,
      serverTimestamp,
      writeBatch
    } = firebaseFirestore;

    // ========== STEP 1: GET ITEM DETAILS ==========
    const itemRef = doc(db, 'items', itemId);
    const itemDoc = await getDoc(itemRef);
    
    if (!itemDoc.exists()) {
      throw new Error('الصنف غير موجود');
    }

    const itemData = itemDoc.data();
    const itemName = itemData.name || 'غير معروف';
    const warehouseId = itemData.warehouse_id;

    console.log('📋 Item to delete:', {
      id: itemId,
      name: itemName,
      code: itemData.code,
      warehouse: warehouseId,
      quantity: itemData.remaining_quantity
    });

    // ========== STEP 2: USER CONFIRMATION (via modal - already handled) ==========
    // The ConfirmDeleteModal already shows confirmation, so just proceed

    // ========== STEP 3: CREATE BATCH OPERATION ==========
    const batch = writeBatch(db);

    // 3A. DELETE THE ITEM
    batch.delete(itemRef);

    // 3B. CREATE TRANSACTION RECORD
    const transactionRef = doc(collection(db, 'transactions'));
    const transactionData = {
      type: 'DELETE',
      item_id: itemId,
      item_name: itemName,
      item_code: itemData.code || '',
      color: itemData.color || '',
      from_warehouse: warehouseId,
      to_warehouse: null,
      previous_quantity: itemData.remaining_quantity || 0,
      previous_cartons: itemData.cartons_count || 0,
      previous_single_bottles: itemData.single_bottles_count || 0,
      quantity: -(itemData.remaining_quantity || 0), // Negative for delete
      total_delta: -(itemData.remaining_quantity || 0),
      new_remaining: 0,
      user_id: state.user.uid,
      user_name: state.userProfile?.name || '',
      user_role: state.userProfile?.role || '',
      user_email: state.user?.email || '',
      timestamp: serverTimestamp(),
      created_at: serverTimestamp(),
      notes: `حذف الصنف "${itemName}"`,
      created_by: state.userProfile?.name || state.user?.email || 'نظام',
      
      // Display fields for transactions page
      display_type: 'حذف',
      display_quantity: `${itemData.remaining_quantity || 0} وحدة`,
      display_destination: 'حذف نهائي',
      
      // Technical metadata
      atomic_operation: true,
      detailed_breakdown_applied: true
    };
    
    batch.set(transactionRef, transactionData);

    // 3C. CREATE ITEM HISTORY RECORD
    const historyRef = doc(collection(db, 'item_history'));
    const historyData = {
      item_id: itemId,
      warehouse_id: warehouseId,
      change_type: 'DELETE',
      old_quantity: itemData.remaining_quantity || 0,
      new_quantity: 0,
      quantity_delta: -(itemData.remaining_quantity || 0),
      old_cartons: itemData.cartons_count || 0,
      new_cartons: 0,
      cartons_delta: -(itemData.cartons_count || 0),
      old_single_bottles: itemData.single_bottles_count || 0,
      new_single_bottles: 0,
      single_bottles_delta: -(itemData.single_bottles_count || 0),
      user_id: state.user.uid,
      user_name: state.userProfile?.name || '',
      timestamp: serverTimestamp(),
      details: {
        name: itemName,
        code: itemData.code,
        color: itemData.color,
        supplier: itemData.supplier,
        notes: 'حذف نهائي للصنف من النظام',
        transaction_id: transactionRef.id
      }
    };
    
    batch.set(historyRef, historyData);

    // ========== STEP 4: EXECUTE BATCH ==========
    await batch.commit();
    console.log('✅ Batch operations committed successfully');

    // ========== STEP 5: UPDATE LOCAL STATE ==========
    
    // 5A. Remove from main inventory
    commit('REMOVE_INVENTORY_ITEM', itemId);
    
    // 5B. Update search results if item is there
    if (state.search.results.length > 0) {
      const updatedSearchResults = state.search.results.filter(item => item.id !== itemId);
      if (updatedSearchResults.length !== state.search.results.length) {
        commit('SET_SEARCH_RESULTS', {
          results: updatedSearchResults,
          source: state.search.source,
          query: state.search.query
        });
      }
    }
    
    // 5C. Create transaction object for Vuex state
    const transactionForState = {
      id: transactionRef.id,
      ...transactionData,
      timestamp: new Date(),
      created_at: new Date(),
      
      // Ensure display fields
      display_quantity: `${itemData.remaining_quantity || 0} وحدة`,
      display_type: 'حذف',
      display_destination: 'حذف نهائي'
    };
    
    // Add to transactions and recent transactions
    commit('ADD_TRANSACTION', transactionForState);
    commit('ADD_RECENT_TRANSACTION', transactionForState);

    // ========== STEP 6: SHOW SUCCESS ==========
    dispatch('showNotification', {
      type: 'success',
      title: 'تم الحذف بنجاح',
      message: `تم حذف الصنف "${itemName}" من النظام`,
      icon: 'check-circle',
      timeout: 5000
    });

    // ========== STEP 7: LOG SUCCESS ==========
    console.log('📊 Delete completed successfully:', {
      itemId,
      itemName,
      quantityDeleted: itemData.remaining_quantity || 0,
      transactionId: transactionRef.id
    });

    return {
      success: true,
      message: 'تم حذف الصنف بنجاح',
      itemId,
      itemName,
      transactionId: transactionRef.id
    };

  } catch (error) {
    console.error('❌ DELETE Item Error:', error);
    console.error('Error stack:', error.stack);
    
    commit('SET_OPERATION_ERROR', error.message);
    
    // 🔴 USER-FRIENDLY ERROR MESSAGES
    let errorMessage = error.message;
    
    if (error.code === 'permission-denied') {
      errorMessage = 'ليس لديك صلاحية لحذف الأصناف';
    } else if (error.code === 'not-found') {
      errorMessage = 'الصنف غير موجود أو تم حذفه بالفعل';
    } else if (error.message.includes('network') || error.message.includes('اتصال')) {
      errorMessage = 'فشل الاتصال. يرجى التحقق من اتصال الإنترنت';
    }

    dispatch('showNotification', {
      type: 'error',
      title: 'فشل الحذف',
      message: errorMessage,
      icon: 'alert-circle',
      timeout: 7000
    });

    return {
      success: false,
      message: errorMessage,
      error: error
    };
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

    // ============================================
    // INVOICE DISPATCH ACTIONS (Store-Compatible)
    // ============================================

    async dispatchInvoiceItem({ commit, state, dispatch }, {
      invoiceId,
      invoiceNumber,
      itemId,
      itemName,
      itemCode,
      quantity,
      warehouseId,
      destination,
      destinationId,
      notes = '',
      customerName = '',
      customerPhone = ''
    }) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        console.log('📄 Invoice dispatch with store-compatible logic:', {
          invoiceId,
          invoiceNumber,
          itemId,
          itemName,
          quantity,
          warehouseId,
          destination
        });

        // 🔴 VALIDATION 1: Authentication
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        if (!['superadmin', 'warehouse_manager', 'company_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لصرف فواتير');
        }

        // 🔴 VALIDATION 2: Required fields
        if (!invoiceId || !itemId || !quantity || !warehouseId || !destination) {
          throw new Error('بيانات الصرف غير مكتملة');
        }

        if (quantity <= 0) {
          throw new Error('يجب إدخال كمية صحيحة للصرف (أكبر من صفر)');
        }

        // 🔴 VALIDATION 3: Warehouse access
        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
            if (!allowedWarehouses.includes(warehouseId)) {
              throw new Error('ليس لديك صلاحية للصرف من هذا المخزن');
            }
          }
        }

        // 🔴 ENSURE FIREBASE IS READY
        console.log('⏳ Ensuring Firebase is ready for invoice dispatch...');
        await ensureFirebaseReady();
        console.log('✅ Firebase ready for invoice dispatch');
        
        if (!db) {
          throw new Error('Firestore database not available');
        }

        // Import Firestore functions
        const firebaseFirestore = await import('firebase/firestore');
        const {
          doc,
          getDoc,
          updateDoc,
          addDoc,
          collection,
          serverTimestamp,
          increment
        } = firebaseFirestore;

        // ========== STEP 1: GET ITEM DETAILS FOR CONVERSION ==========
        const itemRef = doc(db, 'items', itemId);
        const itemDoc = await getDoc(itemRef);
        
        if (!itemDoc.exists()) {
          throw new Error('الصنف غير موجود في المخزن');
        }

        const itemData = itemDoc.data();

        // Verify item is in correct warehouse
        if (itemData.warehouse_id !== warehouseId) {
          throw new Error(`الصنف ليس في المخزن المحدد. يوجد في: ${itemData.warehouse_id}`);
        }

        // ========== STEP 2: CONVERT INVOICE QUANTITY TO STORE FORMAT ==========
        const currentCartons = Number(itemData.cartons_count) || 0;
        const currentSingles = Number(itemData.single_bottles_count) || 0;
        const perCarton = Number(itemData.per_carton_count) || 12;
        
        // Calculate how many cartons and singles to dispatch
        const dispatchQuantity = Number(quantity);
        const currentTotal = (currentCartons * perCarton) + currentSingles;
        
        // Validate available quantity
        if (dispatchQuantity > currentTotal) {
          throw new Error(`الكمية المطلوبة للصرف (${dispatchQuantity}) أكبر من الكمية المتاحة (${currentTotal})`);
        }

        // Convert total quantity to cartons + singles (store format)
        let dispatchCartons = Math.floor(dispatchQuantity / perCarton);
        let dispatchSingles = dispatchQuantity % perCarton;

        console.log('🔄 Invoice to store conversion:', {
          invoiceQuantity: dispatchQuantity,
          perCarton,
          storeFormat: {
            cartons: dispatchCartons,
            singles: dispatchSingles,
            total: (dispatchCartons * perCarton) + dispatchSingles
          }
        });

        // ========== STEP 3: USE STORE'S DISPATCH LOGIC ==========
        // Call the store's dispatchItem action with converted quantities
        const dispatchResult = await dispatch('dispatchItem', {
          item_id: itemId,
          destination: destination,
          destination_id: destinationId || destination,
          from_warehouse_id: warehouseId,
          from_warehouse_name: '', // Can be fetched from warehouses if needed
          item_name: itemName || itemData.name,
          item_code: itemCode || itemData.code,
          color: itemData.color || '',
          supplier: itemData.supplier || '',
          cartons_count: dispatchCartons,
          single_bottles_count: dispatchSingles,
          per_carton_count: perCarton,
          quantity: dispatchQuantity,
          notes: `صرف للفاتورة #${invoiceNumber || invoiceId} - ${customerName ? `العميل: ${customerName}` : ''} ${notes}`,
          priority: 'normal',
          item_location: itemData.item_location || ''
        });

        if (!dispatchResult.success) {
          throw new Error(dispatchResult.message || 'فشل عملية الصرف من المخزن');
        }

        // ========== STEP 4: UPDATE INVOICE STATUS ==========
        const invoiceRef = doc(db, 'invoices', invoiceId);
        
        // Get current invoice data
        const invoiceDoc = await getDoc(invoiceRef);
        if (!invoiceDoc.exists()) {
          console.warn('⚠️ Invoice document not found, creating dispatch record only');
        } else {
          const existingInvoice = invoiceDoc.data();
          
          // Create dispatch record
          const dispatchRecord = {
            id: dispatchResult.transactionId,
            type: 'dispatch',
            item_id: itemId,
            item_name: itemName || itemData.name,
            item_code: itemCode || itemData.code,
            quantity: dispatchQuantity,
            cartons: dispatchCartons,
            singles: dispatchSingles,
            per_carton: perCarton,
            destination: destination,
            destination_id: destinationId || destination,
            dispatched_by: state.userProfile?.name || state.user?.email,
            dispatched_at: serverTimestamp(),
            notes: notes,
            transaction_id: dispatchResult.transactionId,
            status: 'completed'
          };

          // Update invoice with dispatch record
          const invoiceUpdateData = {
            dispatches: [...(existingInvoice.dispatches || []), dispatchRecord],
            updated_at: serverTimestamp(),
            last_dispatch_at: serverTimestamp(),
            dispatch_status: 'partially_dispatched'
          };

          await updateDoc(invoiceRef, invoiceUpdateData);

          // Update local invoice state
          const updatedInvoice = {
            ...existingInvoice,
            ...invoiceUpdateData,
            id: invoiceId
          };
          
          commit('UPDATE_INVOICE', updatedInvoice);
        }

        // ========== STEP 5: CREATE INVOICE-SPECIFIC TRANSACTION ==========
        const invoiceTransactionRef = doc(collection(db, 'transactions'));
        const invoiceTransactionData = {
          type: 'INVOICE_DISPATCH',
          invoice_id: invoiceId,
          invoice_number: invoiceNumber || invoiceId,
          item_id: itemId,
          item_name: itemName || itemData.name,
          item_code: itemCode || itemData.code,
          from_warehouse: warehouseId,
          destination: destination,
          destination_id: destinationId || destination,
          quantity: dispatchQuantity,
          cartons_count: dispatchCartons,
          single_bottles_count: dispatchSingles,
          per_carton_count: perCarton,
          customer_name: customerName,
          customer_phone: customerPhone,
          user_id: state.user.uid,
          user_name: state.userProfile?.name || '',
          user_role: state.userProfile?.role || '',
          timestamp: serverTimestamp(),
          created_at: serverTimestamp(),
          notes: `صرف للفاتورة #${invoiceNumber || invoiceId}${customerName ? ` - العميل: ${customerName}` : ''}`,
          created_by: state.userProfile?.name || state.user?.email || 'نظام',
          // Link to store dispatch transaction
          dispatch_transaction_id: dispatchResult.transactionId,
          // Display fields
          display_type: 'صرف فاتورة',
          display_quantity: `${dispatchQuantity} وحدة`,
          display_destination: destination
        };

        await setDoc(invoiceTransactionRef, invoiceTransactionData);

        // ========== STEP 6: UPDATE LOCAL STATE ==========
        // Update transaction in local state
        const transactionForState = {
          id: invoiceTransactionRef.id,
          ...invoiceTransactionData,
          timestamp: new Date(),
          created_at: new Date()
        };
        
        commit('ADD_TRANSACTION', transactionForState);
        commit('ADD_RECENT_TRANSACTION', transactionForState);

        // Refresh inventory silently
        await dispatch('refreshInventorySilently');

        // ========== STEP 7: SHOW SUCCESS ==========
        const successMessage = `تم صرف ${dispatchQuantity} وحدة من "${itemName || itemData.name}" للفاتورة #${invoiceNumber || invoiceId}`;
        
        dispatch('showNotification', {
          type: 'success',
          title: 'تم صرف الفاتورة بنجاح',
          message: successMessage,
          icon: 'check-circle',
          timeout: 5000
        });

        return {
          success: true,
          message: successMessage,
          invoiceId: invoiceId,
          itemId: itemId,
          quantityDispatched: dispatchQuantity,
          dispatchTransactionId: dispatchResult.transactionId,
          invoiceTransactionId: invoiceTransactionRef.id
        };

      } catch (error) {
        console.error('❌ Invoice dispatch failed:', error);
        
        commit('SET_OPERATION_ERROR', error.message);
        
        // User-friendly error messages
        let errorMessage = error.message;
        if (error.message.includes('ليس لديك صلاحية')) {
          errorMessage = 'ليس لديك صلاحية لصرف فواتير';
        } else if (error.message.includes('أكبر من المتاح')) {
          errorMessage = 'الكمية المطلوبة تتجاوز الكمية المتاحة';
        }

        dispatch('showNotification', {
          type: 'error',
          title: 'فشل صرف الفاتورة',
          message: errorMessage,
          icon: 'alert-circle',
          timeout: 7000
        });

        return {
          success: false,
          message: errorMessage
        };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    // ============================================
    // BULK INVOICE DISPATCH (Multiple Items)
    // Uses store logic internally but keeps invoice interface
    // ============================================
    async dispatchInvoiceBulk({ commit, state, dispatch }, {
      invoiceId,
      invoiceNumber,
      items, // Array of { id, name, code, quantity }
      warehouseId,
      destination,
      destinationId,
      notes = '',
      customerName = '',
      customerPhone = ''
    }) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        console.log('📦 Bulk invoice dispatch:', {
          invoiceId,
          invoiceNumber,
          itemsCount: items.length,
          totalQuantity: items.reduce((sum, item) => sum + (item.quantity || 0), 0)
        });

        // 🔴 VALIDATION
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        if (!['superadmin', 'warehouse_manager', 'company_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لصرف فواتير');
        }

        if (!invoiceId || !items || items.length === 0 || !warehouseId || !destination) {
          throw new Error('بيانات الصرف غير مكتملة');
        }

        // 🔴 ENSURE FIREBASE IS READY
        await ensureFirebaseReady();
        
        if (!db) {
          throw new Error('Firestore database not available');
        }

        const importFirebase = await import('firebase/firestore');
        const {
          doc,
          getDoc,
          updateDoc,
          addDoc,
          collection,
          serverTimestamp,
          writeBatch
        } = importFirebase;

        const results = [];
        const invoiceRef = doc(db, 'invoices', invoiceId);
        const invoiceDoc = await getDoc(invoiceRef);
        const existingInvoice = invoiceDoc.exists() ? invoiceDoc.data() : null;
        const invoiceDispatches = existingInvoice?.dispatches || [];

        // Process each item
        for (const item of items) {
          try {
            // Get item details for conversion
            const itemRef = doc(db, 'items', item.id);
            const itemDoc = await getDoc(itemRef);
            
            if (!itemDoc.exists()) {
              results.push({
                itemId: item.id,
                success: false,
                error: 'الصنف غير موجود'
              });
              continue;
            }

            const itemData = itemDoc.data();
            
            // Verify warehouse
            if (itemData.warehouse_id !== warehouseId) {
              results.push({
                itemId: item.id,
                success: false,
                error: `الصنف ليس في المخزن ${warehouseId}`
              });
              continue;
            }

            // Convert invoice quantity to store format
            const perCarton = Number(itemData.per_carton_count) || 12;
            const dispatchQuantity = Number(item.quantity) || 0;
            
            if (dispatchQuantity <= 0) {
              results.push({
                itemId: item.id,
                success: false,
                error: 'كمية غير صالحة'
              });
              continue;
            }

            // Convert to cartons + singles
            const dispatchCartons = Math.floor(dispatchQuantity / perCarton);
            const dispatchSingles = dispatchQuantity % perCarton;

            // Use store's dispatch logic
            const dispatchResult = await dispatch('dispatchItem', {
              item_id: item.id,
              destination: destination,
              destination_id: destinationId || destination,
              from_warehouse_id: warehouseId,
              item_name: item.name || itemData.name,
              item_code: item.code || itemData.code,
              cartons_count: dispatchCartons,
              single_bottles_count: dispatchSingles,
              per_carton_count: perCarton,
              quantity: dispatchQuantity,
              notes: `صرف جماعي للفاتورة #${invoiceNumber || invoiceId} - ${notes}`
            });

            if (dispatchResult.success) {
              // Create dispatch record for invoice
              const dispatchRecord = {
                id: dispatchResult.transactionId,
                type: 'dispatch',
                item_id: item.id,
                item_name: item.name || itemData.name,
                item_code: item.code || itemData.code,
                quantity: dispatchQuantity,
                cartons: dispatchCartons,
                singles: dispatchSingles,
                per_carton: perCarton,
                destination: destination,
                destination_id: destinationId || destination,
                dispatched_by: state.userProfile?.name || state.user?.email,
                dispatched_at: serverTimestamp(),
                transaction_id: dispatchResult.transactionId,
                status: 'completed'
              };

              invoiceDispatches.push(dispatchRecord);

              results.push({
                itemId: item.id,
                success: true,
                quantity: dispatchQuantity,
                transactionId: dispatchResult.transactionId
              });
            } else {
              results.push({
                itemId: item.id,
                success: false,
                error: dispatchResult.message
              });
            }

          } catch (itemError) {
            console.error(`❌ Error processing item ${item.id}:`, itemError);
            results.push({
              itemId: item.id,
              success: false,
              error: itemError.message
            });
          }
        }

        // Update invoice if it exists
        if (existingInvoice) {
          await updateDoc(invoiceRef, {
            dispatches: invoiceDispatches,
            updated_at: serverTimestamp(),
            last_dispatch_at: serverTimestamp(),
            dispatch_status: invoiceDispatches.length > 0 ? 'partially_dispatched' : 'not_dispatched'
          });

          // Update local state
          const updatedInvoice = {
            ...existingInvoice,
            dispatches: invoiceDispatches,
            id: invoiceId
          };
          
          commit('UPDATE_INVOICE', updatedInvoice);
        }

        // Create summary transaction
        const successfulItems = results.filter(r => r.success);
        if (successfulItems.length > 0) {
          const totalQuantity = successfulItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
          
          const transactionRef = doc(collection(db, 'transactions'));
          const transactionData = {
            type: 'INVOICE_BULK_DISPATCH',
            invoice_id: invoiceId,
            invoice_number: invoiceNumber || invoiceId,
            from_warehouse: warehouseId,
            destination: destination,
            destination_id: destinationId || destination,
            total_quantity: totalQuantity,
            items_count: successfulItems.length,
            items: successfulItems.map(item => ({
              id: item.itemId,
              quantity: item.quantity
            })),
            user_id: state.user.uid,
            user_name: state.userProfile?.name || '',
            user_role: state.userProfile?.role || '',
            timestamp: serverTimestamp(),
            created_at: serverTimestamp(),
            notes: `صرف جماعي للفاتورة #${invoiceNumber || invoiceId} - ${notes}`,
            created_by: state.userProfile?.name || state.user?.email || 'نظام',
            display_type: 'صرف فاتورة جماعي',
            display_quantity: `${totalQuantity} وحدة`,
            display_destination: destination
          };

          await setDoc(transactionRef, transactionData);

          // Update local state
          const transactionForState = {
            id: transactionRef.id,
            ...transactionData,
            timestamp: new Date(),
            created_at: new Date()
          };
          
          commit('ADD_TRANSACTION', transactionForState);
          commit('ADD_RECENT_TRANSACTION', transactionForState);
        }

        // Refresh inventory
        await dispatch('refreshInventorySilently');

        // Show results
        const successCount = successfulItems.length;
        const totalDispatched = successfulItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
        
        let message = `تم صرف ${successCount} أصناف (${totalDispatched} وحدة)`;
        if (results.length > successCount) {
          message += ` - فشل ${results.length - successCount} أصناف`;
        }

        dispatch('showNotification', {
          type: successCount > 0 ? 'success' : 'warning',
          title: successCount > 0 ? 'تم الصرف' : 'فشل جزئي',
          message: message,
          icon: successCount > 0 ? 'check-circle' : 'alert-circle',
          timeout: 6000
        });

        return {
          success: successCount > 0,
          message: message,
          results: results,
          totalDispatched: totalDispatched,
          successfulCount: successCount
        };

      } catch (error) {
        console.error('❌ Bulk invoice dispatch failed:', error);
        
        commit('SET_OPERATION_ERROR', error.message);
        
        dispatch('showNotification', {
          type: 'error',
          title: 'فشل الصرف الجماعي',
          message: error.message || 'حدث خطأ في الصرف الجماعي',
          icon: 'alert-circle',
          timeout: 7000
        });

        return {
          success: false,
          message: error.message
        };
      } finally {
        commit('SET_OPERATION_LOADING', false);
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

    // ============================================
    // ✅ FIREBASE FIRESTORE GETTERS - ADDED
    // ============================================
    firestore: () => db, // Provides the Firebase Firestore instance
    firestoreDb: () => db, // Alias for firestore
    db: () => db, // Another alias for convenience
    firebaseAuth: () => auth, // Provides Firebase Auth instance
    auth: () => auth, // Alias for firebaseAuth

    // ============================================
    // Enhanced Search Getters
    // ============================================
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
  },

// ============================================
// ✅ NEW TRANSACTIONS-RELATED GETTERS
// ============================================
getWarehouseArabicName: (state) => (warehouseId, warehouseData = null) => {
  if (!warehouseId || warehouseId === 'undefined') return 'غير محدد';
  
  // If warehouseData is provided, use it
  if (warehouseData && warehouseData.name_ar) {
    return warehouseData.name_ar;
  }
  
  // Find in warehouses array
  const warehouse = state.warehouses.find(w => w.id === warehouseId);
  if (warehouse) {
    return warehouse.name_ar || warehouse.name || warehouseId;
  }
  
  // Check dispatch locations (warehouses with type='dispatch')
  const dispatchLocation = state.warehouses.find(w => 
    w.type === 'dispatch' && w.id === warehouseId
  );
  
  if (dispatchLocation) {
    return dispatchLocation.name_ar || dispatchLocation.name || warehouseId;
  }
  
  // Check common warehouse mappings
  const commonWarehouses = {
    'dubi_factory': 'مصنع دبي',
    'external_wharehouse': 'صرف خارجي',
    'factory': 'مصنع البران',
    'dispat_item': 'موقع صرف',
    'zahra': 'صرف الي مخزن الزهراء',
    'ghabashi': 'مخزن الغباشي',
    'al_ghabashi': 'مخزن الغباشي',
    'main': 'المخزن الرئيسي',
    'primary': 'المخزن الرئيسي'
  };
  
  if (commonWarehouses[warehouseId]) {
    return commonWarehouses[warehouseId];
  }
  
  return warehouseId;
},

getDispatchDestinationName: (state, getters) => (transaction) => {
  if (!transaction || transaction.type !== 'DISPATCH') return '';
  
  // Priority 1: Check ALL possible destination fields
  const possibleDestinationIds = [
    transaction.destination_id,
    transaction.destination,
    transaction.to_warehouse,
    transaction.warehouse_id,
    transaction.location
  ].filter(id => id && typeof id === 'string');
  
  // Check each ID against warehouses array
  for (const destId of possibleDestinationIds) {
    // First, check if it's a direct warehouse ID
    const warehouse = state.warehouses?.find(w => w.id === destId);
    if (warehouse) {
      return warehouse.name_ar || warehouse.name || destId;
    }
    
    // Check if it's a partial match (case insensitive)
    const partialMatch = state.warehouses?.find(w => 
      w.id.toLowerCase().includes(destId.toLowerCase()) ||
      (w.name_ar && w.name_ar.toLowerCase().includes(destId.toLowerCase())) ||
      (w.name_en && w.name_en.toLowerCase().includes(destId.toLowerCase()))
    );
    
    if (partialMatch) {
      return partialMatch.name_ar || partialMatch.name || destId;
    }
  }
  
  // Priority 2: Check if transaction has direct Arabic name
  if (transaction.destination && typeof transaction.destination === 'string') {
    const arabicRegex = /[\u0600-\u06FF]/;
    if (arabicRegex.test(transaction.destination)) {
      return transaction.destination;
    }
  }
  
  // Priority 3: Check notes for destination
  if (transaction.notes) {
    // Look for destination patterns in Arabic
    const arabicPatterns = [
      /إلى[:\s]+(.+?)(?:\n|$|\.|,|;)/i,
      /لـ[:\s]+(.+?)(?:\n|$|\.|,|;)/i,
      /الوجهة[:\s]+(.+?)(?:\n|$|\.|,|;)/i,
      /موقع[:\s]+(.+?)(?:\n|$|\.|,|;)/i,
      /صرف[:\s]+(.+?)(?:\n|$|\.|,|;)/i,
      /ل[:\s]+(.+?)(?:\n|$|\.|,|;)/i
    ];
    
    // Also check for English patterns
    const englishPatterns = [
      /to[:\s]+(.+?)(?:\n|$|\.|,|;)/i,
      /destination[:\s]+(.+?)(?:\n|$|\.|,|;)/i,
      /dest[:\s]+(.+?)(?:\n|$|\.|,|;)/i,
      /location[:\s]+(.+?)(?:\n|$|\.|,|;)/i
    ];
    
    const allPatterns = [...arabicPatterns, ...englishPatterns];
    
    for (const pattern of allPatterns) {
      const match = transaction.notes.match(pattern);
      if (match && match[1]) {
        const destination = match[1].trim();
        
        // Try to match the extracted destination with warehouses
        const matchedWarehouse = state.warehouses?.find(w => 
          w.name_ar === destination || 
          w.name_en === destination ||
          w.id === destination
        );
        
        if (matchedWarehouse) {
          return matchedWarehouse.name_ar || matchedWarehouse.name || destination;
        }
        
        return destination;
      }
    }
  }
  
  // Priority 4: Special handling for common dispatch destinations
  const dispatchWarehouseMapping = {
    'dubi_factory': 'مصنع دبي',
    'external_wharehouse': 'صرف خارجي',
    'factory': 'مصنع البران',
    'dispat_item': 'موقع صرف',
    'zahra': 'صرف الي مخزن الزهراء',
    'dispatch': 'موقع صرف',
    'external': 'صرف خارجي',
    'factory_dispatch': 'مصنع البران',
    'dubi': 'مصنع دبي',
    'external_warehouse': 'صرف خارجي',
    'dispat': 'موقع صرف',
    'item_dispatch': 'موقع صرف'
  };
  
  // Check all possible IDs against the mapping
  const allIds = [
    transaction.destination_id,
    transaction.destination,
    transaction.to_warehouse
  ].filter(id => id);
  
  for (const id of allIds) {
    if (dispatchWarehouseMapping[id]) {
      return dispatchWarehouseMapping[id];
    }
    
    // Case insensitive check
    const lowerId = id.toLowerCase();
    for (const [key, value] of Object.entries(dispatchWarehouseMapping)) {
      if (lowerId.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerId)) {
        return value;
      }
    }
  }
  
  // Priority 5: Check if it's a warehouse with type='dispatch'
  const dispatchWarehouses = state.warehouses?.filter(w => w.type === 'dispatch') || [];
  for (const warehouse of dispatchWarehouses) {
    // Check if any ID matches this warehouse
    const allTransactionIds = [
      transaction.destination_id,
      transaction.destination,
      transaction.to_warehouse
    ];
    
    for (const id of allTransactionIds) {
      if (id && warehouse.id === id) {
        return warehouse.name_ar || warehouse.name || id;
      }
    }
  }
  
  // Fallback options
  if (transaction.destination_id) {
    return `صرف إلى ${transaction.destination_id}`;
  }
  
  if (transaction.destination) {
    return `صرف إلى ${transaction.destination}`;
  }
  
  if (transaction.to_warehouse) {
    return `صرف إلى ${transaction.to_warehouse}`;
  }
  
  return 'موقع صرف';
},

getTransactionTypeLabel: () => (type) => {
  const labels = {
    'ADD': 'إضافة',
    'TRANSFER': 'تحويل',
    'DISPATCH': 'صرف',
    'UPDATE': 'تحديث',
    'DELETE': 'حذف'
  };
  return labels[type] || type;
},

getUserRoleLabel: () => (role) => {
  const labels = {
    'superadmin': 'مدير عام',
    'company_manager': 'مدير شركة',
    'warehouse_manager': 'مدير مستودع',
    'staff': 'موظف'
  };
  return labels[role] || role || 'غير معروف';
},

// Enhanced filtered transactions with all filters
filteredTransactions: (state, getters) => (filters = {}) => {
  let filtered = [...state.transactions];

  // Apply search filter
  if (filters.search && filters.search.length >= 2) {
    const term = filters.search.toLowerCase();
    filtered = filtered.filter(transaction => 
      (transaction.item_name?.toLowerCase() || '').includes(term) ||
      (transaction.item_code?.toLowerCase() || '').includes(term) ||
      (transaction.notes?.toLowerCase() || '').includes(term) ||
      (transaction.user_name?.toLowerCase() || '').includes(term) ||
      (transaction.created_by?.toLowerCase() || '').includes(term)
    );
  }

  // Apply type filter
  if (filters.type) {
    filtered = filtered.filter(transaction => transaction.type === filters.type);
  }

  // Apply warehouse filter
  if (filters.warehouse) {
    filtered = filtered.filter(transaction => 
      transaction.from_warehouse === filters.warehouse || 
      transaction.to_warehouse === filters.warehouse ||
      transaction.destination_id === filters.warehouse
    );
  }

  // Apply date filter
  if (filters.dateFrom || filters.dateTo) {
    const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const toDate = filters.dateTo ? new Date(filters.dateTo) : null;
    if (toDate) toDate.setHours(23, 59, 59, 999);
    
    filtered = filtered.filter(transaction => {
      if (!transaction.timestamp) return false;
      try {
        const transDate = transaction.timestamp?.toDate ? 
          transaction.timestamp.toDate() : new Date(transaction.timestamp);
        
        if (fromDate && transDate < fromDate) return false;
        if (toDate && transDate > toDate) return false;
        return true;
      } catch {
        return false;
      }
    });
  }

  // Sort by date (newest first)
  filtered.sort((a, b) => {
    const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
    const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
    return dateB - dateA;
  });

  return filtered;
},

// Transaction stats
getTransactionStats: (state) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

// Helper to get transaction quantity
getTransactionQuantity: () => (transaction) => {
  const quantity = 
    transaction.quantity || 
    transaction.qty || 
    transaction.total_delta || 
    transaction.total_quantity || 
    transaction.delta_quantity || 
    0;
  
  // For DISPATCH type, show negative value
  if (transaction.type === 'DISPATCH' && quantity > 0) {
    return -Math.abs(quantity);
  }
  
  // For ADD type, ensure positive
  if (transaction.type === 'ADD' && quantity < 0) {
    return Math.abs(quantity);
  }
  
  return quantity;
}
}
});
