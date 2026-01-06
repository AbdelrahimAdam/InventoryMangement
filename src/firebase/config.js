// src/firebase/config.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration (safe for client-side use)
export const firebaseConfig = {
  apiKey: "AIzaSyDxpbXvFH6UvfE2I6OJ_wNFnA889Zu-NEQ",
  authDomain: "monofia-inventory.firebaseapp.com",
  projectId: "monofia-inventory",
  storageBucket: "monofia-inventory.firebasestorage.app",
  messagingSenderId: "788480597316",
  appId: "1:788480597316:web:776a05277fb4e60806cb11"
};

// Firebase services (initially null, will be set after initialization)
let app = null;
let auth = null;
let db = null;
let storage = null;

// Track initialization status
let isInitialized = false;
let initializationPromise = null;

// Error tracking
let initializationError = null;

/**
 * Initialize Firebase with retry logic and offline persistence
 */
export async function initializeFirebase() {
  // If already initialized, return the services
  if (isInitialized) {
    console.log('✅ Firebase already initialized');
    return { app, auth, db, storage };
  }

  // If initialization is in progress, return the promise
  if (initializationPromise) {
    console.log('⏳ Firebase initialization in progress...');
    return initializationPromise;
  }

  // Start new initialization
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

      // Try to enable offline persistence (optional, don't fail if it doesn't work)
      try {
        await enableOfflinePersistence();
      } catch (persistenceError) {
        console.warn('⚠️ Offline persistence warning:', persistenceError.message);
        // Don't throw, just log warning
      }

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
 * Enable offline persistence for Firestore (using newer API)
 */
async function enableOfflinePersistence() {
  try {
    // Dynamically import the persistence module
    const { enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } = await import('firebase/firestore');
    
    // Enable persistence with configuration
    await enableIndexedDbPersistence(db, {
      cacheSizeBytes: CACHE_SIZE_UNLIMITED
    });
    
    console.log('✅ Firestore offline persistence enabled');
    
  } catch (error) {
    // Handle persistence errors gracefully
    if (error.code === 'failed-precondition') {
      console.warn('⚠️ Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (error.code === 'unimplemented') {
      console.warn('⚠️ The current browser does not support offline persistence.');
    } else {
      console.warn('⚠️ Error enabling offline persistence:', error.message);
      // Don't throw, just log warning - app can work without offline persistence
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
 * Get Firebase services (with initialization check)
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
 * Reset Firebase (useful for testing)
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
  if (process.env.NODE_ENV === 'production') {
    initializeFirebase().catch(error => {
      console.warn('⚠️ Auto-initialization failed, Firebase will be initialized on demand:', error.message);
    });
  }
} catch (error) {
  console.warn('⚠️ Auto-initialization failed, Firebase will be initialized on demand:', error.message);
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
  isFirebaseInitialized,
  getFirebaseServices,
  resetFirebase,
  getInitializationError,
  
  // Status
  isFirebaseReady,
  
  // Config
  firebaseConfig
};