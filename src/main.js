// src/main.js - Production Ready for Vue CLI
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './styles/globals.css';

// Import Firebase
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

// Import Performance Directives and Services
import { lazyImageDirective } from './directives/lazyImage';

console.log('🚀 Starting Warehouse Management System...');

// ==================== REGISTER SERVICE WORKER ====================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(reg => console.log('✔ Service Worker registered:', reg))
      .catch(err => console.error('❌ Service Worker registration failed:', err));
  });
}

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

// ==================== 2. INITIALIZE FIREBASE AUTH ====================
async function initializeFirebaseAuth() {
  return new Promise((resolve, reject) => {
    console.log('🔐 Initializing Firebase authentication...');

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
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
        console.error('❌ Firebase auth error:', error);
        store.commit('SET_USER', null);
        reject(error);
      }
    );
  });
}

// ==================== 3. INITIALIZE APP ====================
async function initializeApp() {
  try {
    showLoadingScreen();

    const authResult = await initializeFirebaseAuth();

    const app = createApp(App);
    app.use(store);
    app.use(router);

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

// ==================== 4. START APP ====================
initializeApp().catch(console.error);

// ==================== 5. GLOBAL HELPERS ====================
if (process.env.NODE_ENV === 'development') {
  window.debug = {
    auth: () => ({
      currentUser: auth.currentUser,
      storeUser: store.state.user,
      isAuthenticated: store.getters.isAuthenticated
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
    }
  };
}

// ==================== 6. OFFLINE SUPPORT ====================
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
});

// ==================== 7. MEMORY MANAGEMENT ====================
// Clean up on page unload
window.addEventListener('beforeunload', () => {
  // Clear any temporary data
  sessionStorage.removeItem('temp_inventory_data');
  console.log('🧹 Cleaning up before unload');
});

// ==================== 8. ERROR BOUNDARY ====================
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
