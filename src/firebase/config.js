// src/firebase/config.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDxpbXvFH6UvfE2I6OJ_wNFnA889Zu-NEQ",
  authDomain: "monofia-inventory.firebaseapp.com",
  projectId: "monofia-inventory",
  storageBucket: "monofia-inventory.firebasestorage.app",
  messagingSenderId: "788480597316",
  appId: "1:788480597316:web:776a05277fb4e60806cb11"
};

// Firebase services
let app = null;
let auth = null;
let db = null;
let storage = null;
let isInitialized = false;
let initializationPromise = null;
let initializationError = null; // Add this back

/**
 * Simple Firebase initialization WITHOUT offline persistence
 */
export async function initializeFirebase() {
  if (isInitialized) {
    console.log('✅ Firebase already initialized');
    return { app, auth, db, storage };
  }

  if (initializationPromise) {
    console.log('⏳ Firebase initialization in progress...');
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      console.log('🔥 Initializing Firebase...');

      // Initialize Firebase app
      app = initializeApp(firebaseConfig);
      console.log('✅ Firebase app initialized');

      // Initialize services
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);

      // Set default language (Arabic)
      auth.languageCode = 'ar';
      console.log('✅ Firebase services initialized');

      // IMPORTANT: Offline persistence is DISABLED to prevent DataCloneError
      console.log('⚠️ Offline persistence disabled to prevent IndexedDB errors');

      // Mark as initialized
      isInitialized = true;
      initializationError = null;
      
      console.log('🎉 Firebase fully initialized and ready');
      
      return { app, auth, db, storage };
      
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error);
      initializationError = error;
      isInitialized = false;
      throw error;
    } finally {
      initializationPromise = null;
    }
  })();

  return initializationPromise;
}

/**
 * Clear IndexedDB cache (optional, for manual cleanup)
 */
export async function clearCorruptedIndexedDB() {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return;
  }

  try {
    console.log('🧹 Clearing IndexedDB cache...');
    
    // List of possible Firestore database names
    const dbNames = [
      'firestore/[DEFAULT]/monofia-inventory/main',
      'firestore/[DEFAULT]/monofia-inventory',
      'firestore',
      'firestore-v9'
    ];

    for (const dbName of dbNames) {
      try {
        const deleteReq = window.indexedDB.deleteDatabase(dbName);
        await new Promise((resolve, reject) => {
          deleteReq.onsuccess = resolve;
          deleteReq.onerror = reject;
          deleteReq.onblocked = () => {
            console.log(`Database ${dbName} is blocked, closing connections...`);
            resolve();
          };
        });
        console.log(`🧹 Cleared IndexedDB database: ${dbName}`);
      } catch (e) {
        // Ignore errors for non-existent databases
      }
    }

    // Also clear localStorage cache
    try {
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.includes('firestore') || key.includes('firebase')) {
          localStorage.removeItem(key);
        }
      }
      console.log('🧹 Cleared Firebase-related localStorage items');
    } catch (e) {
      // Ignore localStorage errors
    }
    
  } catch (error) {
    console.warn('⚠️ Error clearing IndexedDB:', error.message);
  }
}

/**
 * Emergency reset
 */
export async function emergencyReset() {
  console.log('🚨 Performing emergency reset...');
  
  // Clear all Firebase data
  await clearCorruptedIndexedDB();
  
  // Reset variables
  app = null;
  auth = null;
  db = null;
  storage = null;
  isInitialized = false;
  initializationPromise = null;
  initializationError = null;
  
  console.log('✅ Emergency reset complete');
}

/**
 * Initialize with retry
 */
export async function initializeWithRetry(maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Initialization attempt ${attempt}/${maxRetries}`);
      return await initializeFirebase();
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      if (attempt === maxRetries) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }
}

/**
 * Check if Firebase is initialized
 */
export function isFirebaseInitialized() {
  return isInitialized;
}

/**
 * Get Firebase services
 */
export function getFirebaseServices() {
  if (!isInitialized) {
    console.warn('⚠️ Firebase not initialized. Call initializeFirebase() first.');
    return null;
  }
  return { app, auth, db, storage };
}

/**
 * Get initialization error if any
 */
export function getInitializationError() {
  return initializationError;
}

/**
 * Check if persistence is enabled (always false in this version)
 */
export function isPersistenceEnabled() {
  return false;
}

/**
 * Reset Firebase
 */
export function resetFirebase() {
  app = null;
  auth = null;
  db = null;
  storage = null;
  isInitialized = false;
  initializationPromise = null;
  initializationError = null;
  console.log('🧹 Firebase reset');
}

/**
 * Initialize Firebase automatically (for backward compatibility)
 */
try {
  // Auto-initialize in production, but allow manual initialization in development
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    initializeWithRetry(2).catch(error => {
      console.warn('⚠️ Auto-initialization failed, Firebase will be initialized on demand:', error.message);
    });
  }
} catch (error) {
  console.warn('⚠️ Auto-initialization setup failed:', error.message);
}

// Export services (will be null until initialized)
export { app, auth, db, storage };

// Export initialization status
export const isFirebaseReady = isInitialized;

// Re-export commonly used Firebase functions for convenience
export { 
  // Auth functions
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';

export {
  // Firestore functions
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp
} from 'firebase/firestore';

// Default export for backward compatibility
export default {
  // Services
  app,
  auth,
  db,
  storage,
  
  // Initialization functions
  initializeFirebase,
  initializeWithRetry,
  isFirebaseInitialized,
  getFirebaseServices,
  resetFirebase,
  emergencyReset,
  getInitializationError,
  clearCorruptedIndexedDB,
  
  // Status
  isFirebaseReady,
  isPersistenceEnabled,
  
  // Config
  firebaseConfig
};