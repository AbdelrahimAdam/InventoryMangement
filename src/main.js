// src/main.js - Production Ready for Vue CLI
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './styles/globals.css';

// Import Firebase - Use the new initialization pattern
import { 
  auth, 
  db, 
  isFirebaseInitialized, 
  initializeFirebase,
  getInitializationError 
} from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

// Import Performance Directives and Services
import { lazyImageDirective } from './directives/lazyImage';

console.log('🚀 Starting Warehouse Management System...');

// ==================== 1. SHOW LOADING SCREEN ====================
function showLoadingScreen() {
  const appEl = document.getElementById('app');
  if (!appEl) return;

  appEl.innerHTML = `
    <div id="app-loading" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Tajawal', sans-serif;
    ">
      <div style="text-align: center; max-width: 90%;">
        <div style="
          width: 80px;
          height: 80px;
          border: 6px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1.5s linear infinite;
          margin: 0 auto 30px;
        "></div>

        <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 10px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
          نظام إدارة المخازن
        </h1>

        <p style="font-size: 16px; opacity: 0.9; margin-bottom: 40px;">
          جاري تحميل النظام...
        </p>

        <div style="
          width: 200px;
          height: 4px;
          background: rgba(255,255,255,0.2);
          border-radius: 2px;
          margin: 0 auto;
          overflow: hidden;
        ">
          <div id="progress-bar" style="
            width: 30%;
            height: 100%;
            background: white;
            border-radius: 2px;
            animation: progress 2s ease-in-out infinite;
          "></div>
        </div>

        <p style="font-size: 12px; opacity: 0.7; margin-top: 30px;">
          الإصدار 1.0.0 | Monofia Inventory
        </p>
      </div>
      <style>
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes progress {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(250%); }
        }
      </style>
    </div>
  `;
}

// ==================== 2. WAIT FOR FIREBASE INITIALIZATION ====================
async function waitForFirebaseInitialization() {
  console.log('🔥 Checking Firebase initialization...');
  
  // Check if Firebase is already initialized
  if (isFirebaseInitialized()) {
    console.log('✅ Firebase already initialized');
    return true;
  }
  
  // Try to initialize Firebase
  try {
    console.log('🔄 Initializing Firebase...');
    await initializeFirebase();
    
    // Verify services are available
    if (!db || !auth) {
      throw new Error('Firebase services not available after initialization');
    }
    
    console.log('✅ Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    
    // Try to get initialization error
    const initError = getInitializationError();
    if (initError) {
      console.error('Initialization error details:', initError);
    }
    
    throw new Error(`Firebase initialization failed: ${error.message}`);
  }
}

// ==================== 3. INITIALIZE FIREBASE AUTH ====================
async function initializeFirebaseAuth() {
  return new Promise((resolve, reject) => {
    console.log('🔐 Initializing Firebase authentication...');
    
    // First, ensure Firebase services are available
    if (!db || !auth) {
      console.error('❌ Firebase services not available');
      reject(new Error('Firebase services not available'));
      return;
    }
    
    console.log('📦 Firestore DB status:', db ? 'Available ✅' : 'Missing ❌');
    console.log('👤 Firebase Auth status:', auth ? 'Available ✅' : 'Missing ❌');

    // Set timeout for auth initialization
    const authTimeout = setTimeout(() => {
      console.log('⚠️ Auth initialization timeout, proceeding without user');
      resolve({ user: null, isAuthenticated: false });
    }, 8000); // 8 second timeout

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        clearTimeout(authTimeout);
        console.log('✅ Firebase auth state:', user ? `User: ${user.email}` : 'No user');

        if (user) {
          try {
            store.commit('SET_USER', user);
            await store.dispatch('loadUserProfile', user);
            console.log('✅ User profile loaded');
            resolve({ user, isAuthenticated: true });
          } catch (error) {
            console.error('❌ Failed to load user profile:', error);
            store.commit('SET_USER', null);
            resolve({ user: null, isAuthenticated: false });
          }
        } else {
          store.commit('SET_USER', null);
          store.commit('SET_USER_PROFILE', null);
          resolve({ user: null, isAuthenticated: false });
        }

        unsubscribe();
      },
      (error) => {
        clearTimeout(authTimeout);
        console.error('❌ Firebase auth error:', error);
        store.commit('SET_USER', null);
        reject(error);
      }
    );
  });
}

// ==================== 4. INITIALIZE APP ====================
async function initializeApp() {
  try {
    showLoadingScreen();

    // CRITICAL: Wait for Firebase to initialize first
    console.log('🔄 Step 1: Initializing Firebase...');
    await waitForFirebaseInitialization();
    
    console.log('🔄 Step 2: Initializing Firebase auth...');
    const authResult = await initializeFirebaseAuth();

    console.log('🔄 Step 3: Creating Vue app...');
    const app = createApp(App);
    app.use(store);
    app.use(router);

    // ==================== PROVIDE FIRESTORE DB TO ALL COMPONENTS ====================
    // Make db available globally so all components can access it
    app.config.globalProperties.$db = db;
    app.config.globalProperties.$auth = auth;
    
    // Also provide via Vue's dependency injection system
    app.provide('firebaseDb', db);
    app.provide('firebaseAuth', auth);
    
    console.log('🔥 Firebase services provided to app:');
    console.log('  - Firestore DB:', db ? 'Available ✅' : 'Missing ❌');
    console.log('  - Firebase Auth:', auth ? 'Available ✅' : 'Missing ❌');
    console.log('  - Firebase Initialized:', isFirebaseInitialized() ? 'Yes ✅' : 'No ❌');

    // ==================== REGISTER PERFORMANCE DIRECTIVES ====================
    // Register lazy image directive
    app.directive('lazy-image', lazyImageDirective);

    // Global error handler
    app.config.errorHandler = (err, vm, info) => {
      console.error('Vue Error:', err, info);
      store.dispatch('showNotification', {
        type: 'error',
        message: 'حدث خطأ في النظام'
      });
    };

    // Performance monitoring
    app.config.performance = true;

    console.log('🔄 Step 4: Mounting app...');
    app.mount('#app');

    // Remove loading screen
    setTimeout(() => {
      const loadingEl = document.getElementById('app-loading');
      if (loadingEl) {
        loadingEl.style.opacity = '0';
        loadingEl.style.transition = 'opacity 0.3s ease';
        setTimeout(() => loadingEl.remove(), 300);
      }
    }, 500);

    console.log('✅ App initialized successfully');
    console.log('📊 Initial auth state:', {
      isAuthenticated: authResult.isAuthenticated,
      user: authResult.user?.email
    });

    // ==================== SETUP PERFORMANCE MONITORING ====================
    if (process.env.NODE_ENV === 'development') {
      // Monitor initial load performance
      const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
      console.log(`⚡ Initial app load time: ${loadTime}ms`);
      
      // Monitor memory usage
      if ('memory' in window.performance) {
        setInterval(() => {
          const memory = window.performance.memory;
          console.log(`💾 Memory: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB / ${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`);
        }, 30000);
      }
    }

    return { app, router, store };
  } catch (error) {
    console.error('❌ Failed to initialize app:', error);

    const appEl = document.getElementById('app');
    if (appEl) {
      appEl.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #f8f9fa;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          text-align: center;
          font-family: system-ui;
        ">
          <div style="max-width: 500px;">
            <h2 style="color: #e74c3c; margin-bottom: 20px;">⚠️ خطأ في التحميل</h2>
            <p style="margin-bottom: 20px; color: #666;">${error.message || 'حدث خطأ في تحميل التطبيق'}</p>
            <div style="margin-bottom: 20px; padding: 15px; background: #fff3cd; border-radius: 5px; color: #856404;">
              <strong>تفاصيل الخطأ:</strong><br>
              ${error.toString()}
            </div>
            <button onclick="window.location.reload()" style="
              padding: 12px 24px;
              background: #3498db;
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 16px;
              cursor: pointer;
              margin: 5px;
            ">
              🔄 إعادة التحميل
            </button>
          </div>
        </div>
      `;
    }

    throw error;
  }
}

// ==================== 5. START APP ====================
initializeApp().catch(console.error);

// ==================== 6. GLOBAL HELPERS ====================
if (process.env.NODE_ENV === 'development') {
  window.debug = {
    auth: () => ({
      currentUser: auth?.currentUser,
      storeUser: store.state.user,
      isAuthenticated: store.getters.isAuthenticated
    }),
    db: () => db,
    firebaseStatus: () => ({
      db: db ? 'Initialized ✅' : 'Not initialized ❌',
      auth: auth ? 'Initialized ✅' : 'Not initialized ❌',
      firestoreAvailable: typeof db === 'object' && db !== null,
      authAvailable: typeof auth === 'object' && auth !== null,
      isInitialized: isFirebaseInitialized(),
      initError: getInitializationError?.() || null
    }),
    store: () => store.state,
    reload: () => window.location.reload(),
    // Performance testing helpers
    clearCache: () => {
      localStorage.clear();
      sessionStorage.clear();
      console.log('🧹 Cache cleared');
    },
    measurePerformance: () => {
      const metrics = window.performance.getEntriesByType('navigation')[0];
      console.log('📊 Performance Metrics:', {
        'DOM Load': metrics.domComplete - metrics.domInteractive,
        'Page Load': metrics.loadEventEnd - metrics.loadEventStart,
        'Total Load': metrics.loadEventEnd - metrics.fetchStart
      });
    },
    // Firebase debug helper
    testFirebase: async () => {
      try {
        const { collection, getDocs, limit, query } = await import('firebase/firestore');
        
        if (!db) {
          console.error('❌ Firebase DB is not available');
          return null;
        }
        
        const testRef = collection(db, 'items');
        const testQuery = query(testRef, limit(1));
        const snapshot = await getDocs(testQuery);
        console.log('✅ Firebase test successful. Items count:', snapshot.size);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error('❌ Firebase test failed:', error);
        return null;
      }
    },
    // Search debug helper
    debugSearch: async (searchTerm) => {
      try {
        console.log('🔍 Debugging search for:', searchTerm);
        const results = await store.dispatch('searchInventorySpark', {
          searchQuery: searchTerm,
          limit: 5
        });
        console.log('Search results:', results);
        return results;
      } catch (error) {
        console.error('Search debug error:', error);
        return null;
      }
    },
    // Reinitialize Firebase (useful for testing)
    reinitializeFirebase: async () => {
      try {
        console.log('🔄 Reinitializing Firebase...');
        await initializeFirebase();
        console.log('✅ Firebase reinitialized');
        return true;
      } catch (error) {
        console.error('❌ Failed to reinitialize Firebase:', error);
        return false;
      }
    }
  };
}

// ==================== 7. OFFLINE SUPPORT ====================
// Listen for offline/online events
window.addEventListener('offline', () => {
  console.log('📶 App is offline');
  store.dispatch('showNotification', {
    type: 'warning',
    message: 'أنت غير متصل بالإنترنت. يتم عرض البيانات المحفوظة.',
    duration: 5000
  });
});

window.addEventListener('online', () => {
  console.log('📶 App is online');
  store.dispatch('showNotification', {
    type: 'success',
    message: 'تم استعادة الاتصال بالإنترنت. يتم تحديث البيانات.',
    duration: 3000
  });
  
  // Refresh data when coming back online
  if (store.state.user) {
    setTimeout(() => {
      store.dispatch('refreshInventory');
      store.dispatch('getRecentTransactions');
    }, 2000);
  }
});

// ==================== 8. MEMORY MANAGEMENT ====================
// Clean up on page unload
window.addEventListener('beforeunload', () => {
  // Clear any temporary data
  sessionStorage.removeItem('temp_inventory_data');
  console.log('🧹 Cleaning up before unload');
});

// ==================== 9. ERROR BOUNDARY ====================
// Global error listener for unhandled errors
window.addEventListener('error', (event) => {
  console.error('🌍 Global error:', event.error);
  
  // Don't show notification for chunk loading errors (users can refresh)
  if (event.error && event.error.toString().includes('ChunkLoadError')) {
    return;
  }
  
  store.dispatch('showNotification', {
    type: 'error',
    message: 'حدث خطأ غير متوقع. الرجاء تحديث الصفحة.',
    duration: 10000
  });
});

// Handle promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('🌍 Unhandled promise rejection:', event.reason);
  
  // Ignore navigation aborted errors
  if (event.reason && event.reason.toString().includes('navigation aborted')) {
    return;
  }
  
  store.dispatch('showNotification', {
    type: 'error',
    message: 'حدث خطأ في المعالجة. الرجاء المحاولة مرة أخرى.',
    duration: 8000
  });
});

console.log('📄 Main.js loaded successfully');