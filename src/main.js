// src/main.js - Production Ready
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Import global CSS
import './styles/globals.css';

// Import Firebase
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

// Import directives
import { lazyImageDirective } from './directives/lazyImage';

// Performance monitoring
const APP_START_TIME = performance.now();

// ==================== CONFIGURATION ====================
const APP_CONFIG = {
  name: 'نظام إدارة المخازن',
  version: '1.0.0',
  debug: process.env.NODE_ENV === 'development',
  offlineSupport: true
};

console.log(`🚀 ${APP_CONFIG.name} v${APP_CONFIG.version} - ${process.env.NODE_ENV} mode`);

// ==================== PERFORMANCE HELPERS ====================
const performanceMonitor = {
  startTime: APP_START_TIME,
  
  mark(name) {
    if (APP_CONFIG.debug) {
      performance.mark(name);
    }
  },
  
  measure(name, startMark, endMark) {
    if (APP_CONFIG.debug) {
      performance.measure(name, startMark, endMark);
    }
  },
  
  logMetrics() {
    if (APP_CONFIG.debug && window.performance) {
      const metrics = performance.getEntriesByType('navigation')[0];
      if (metrics) {
        console.group('📊 Performance Metrics');
        console.log('Initial Load:', Math.round(performance.now() - this.startTime) + 'ms');
        console.log('TTFB:', Math.round(metrics.responseStart - metrics.requestStart) + 'ms');
        console.log('DOM Ready:', Math.round(metrics.domContentLoadedEventEnd - metrics.domContentLoadedEventStart) + 'ms');
        console.log('Full Load:', Math.round(metrics.loadEventEnd - metrics.loadEventStart) + 'ms');
        console.groupEnd();
      }
    }
  }
};

// ==================== SERVICE WORKER MANAGEMENT ====================
const setupServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    const handleServiceWorker = async () => {
      try {
        // Check if we have an update available
        const registration = await navigator.serviceWorker.ready;
        
        if (registration.waiting) {
          // New service worker is waiting
          console.log('🔄 New service worker waiting');
          
          // Send skip waiting message
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          
          // Reload page when new service worker takes control
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
          });
        }
        
        // Check for updates periodically
        if (APP_CONFIG.offlineSupport) {
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000); // Check every hour
        }
      } catch (error) {
        console.warn('⚠️ Service Worker management error:', error);
      }
    };

    if (navigator.serviceWorker.controller) {
      handleServiceWorker();
    }

    // Listen for new service worker installation
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 Service Worker controller changed');
    });
  }
};

// ==================== FIREBASE AUTH INITIALIZATION ====================
const initializeAuth = () => {
  performanceMonitor.mark('auth-start');
  
  return new Promise((resolve) => {
    console.log('🔐 Initializing authentication...');
    
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        performanceMonitor.measure('auth-load', 'auth-start', 'auth-end');
        
        try {
          if (user) {
            // User is signed in
            await store.dispatch('auth/setUser', { user, fetchProfile: true });
            console.log('✅ User authenticated:', user.email);
            resolve({ user, authenticated: true });
          } else {
            // No user signed in
            store.commit('auth/CLEAR_USER');
            console.log('ℹ️ No authenticated user');
            resolve({ user: null, authenticated: false });
          }
        } catch (error) {
          console.error('❌ Auth initialization error:', error);
          store.commit('auth/CLEAR_USER');
          resolve({ user: null, authenticated: false });
        } finally {
          unsubscribe();
        }
      },
      (error) => {
        console.error('❌ Firebase auth error:', error);
        store.commit('auth/CLEAR_USER');
        resolve({ user: null, authenticated: false });
        unsubscribe();
      }
    );
  });
};

// ==================== APPLICATION INITIALIZATION ====================
const initializeApp = async () => {
  try {
    performanceMonitor.mark('app-init-start');
    
    // 1. Initialize Firebase Auth
    const authState = await initializeAuth();
    
    // 2. Create Vue app instance
    const app = createApp(App);
    
    // 3. Configure global error handler
    app.config.errorHandler = (err, vm, info) => {
      console.error('💥 Vue Error:', { error: err, component: vm?.$options?.name, info });
      
      // Don't show notification for navigation errors
      if (err.message && err.message.includes('navigation')) return;
      
      store.dispatch('notification/show', {
        type: 'error',
        title: 'خطأ في النظام',
        message: 'حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.',
        duration: 5000
      });
    };
    
    // 4. Enable performance tracking in development
    app.config.performance = APP_CONFIG.debug;
    
    // 5. Register global directives
    app.directive('lazy-image', lazyImageDirective);
    
    // 6. Use plugins
    app.use(store);
    app.use(router);
    
    // 7. Mount the app
    app.mount('#app');
    
    performanceMonitor.mark('app-init-end');
    performanceMonitor.measure('app-initialization', 'app-init-start', 'app-init-end');
    
    console.log('✅ Application initialized successfully');
    
    // 8. Set up service worker
    setupServiceWorker();
    
    // 9. Log performance metrics
    setTimeout(() => {
      performanceMonitor.logMetrics();
    }, 1000);
    
    return { app, router, store, authState };
  } catch (error) {
    console.error('💥 Failed to initialize application:', error);
    
    // Show error screen
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.innerHTML = `
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
          font-family: 'Tajawal', system-ui;
          z-index: 9999;
        ">
          <div style="max-width: 500px;">
            <div style="font-size: 80px; margin-bottom: 20px;">⚠️</div>
            <h2 style="color: #dc2626; margin-bottom: 15px; font-weight: 700;">
              فشل في تحميل النظام
            </h2>
            <p style="color: #4b5563; margin-bottom: 25px; line-height: 1.6;">
              تعذر تحميل نظام إدارة المخازن. قد يكون السبب اتصال إنترنت ضعيف أو مشكلة في الخادم.
            </p>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
              <button onclick="window.location.reload()" style="
                padding: 12px 24px;
                background: #3b82f6;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
                font-weight: 500;
                transition: background 0.3s;
              " onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
                🔄 إعادة التحميل
              </button>
              <button onclick="localStorage.clear(); sessionStorage.clear(); window.location.reload()" style="
                padding: 12px 24px;
                background: #f3f4f6;
                color: #374151;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.3s;
              " onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'">
                🧹 مسح التخزين
              </button>
            </div>
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
              إذا استمرت المشكلة، يرجى التواصل مع الدعم الفني.
            </p>
          </div>
        </div>
      `;
    }
    
    throw error;
  }
};

// ==================== OFFLINE / ONLINE HANDLERS ====================
const setupNetworkHandlers = () => {
  if (APP_CONFIG.offlineSupport) {
    window.addEventListener('offline', () => {
      console.log('📶 Application is offline');
      store.dispatch('notification/show', {
        type: 'warning',
        title: 'الاتصال بالإنترنت',
        message: 'أنت غير متصل بالإنترنت. يتم استخدام البيانات المخزنة محلياً.',
        duration: 4000
      });
    });
    
    window.addEventListener('online', () => {
      console.log('📶 Application is back online');
      store.dispatch('notification/show', {
        type: 'success',
        title: 'الاتصال بالإنترنت',
        message: 'تم استعادة الاتصال. يتم تحديث البيانات.',
        duration: 3000
      });
      
      // Sync data when back online
      setTimeout(() => {
        store.dispatch('sync/checkForUpdates');
      }, 1000);
    });
  }
};

// ==================== GLOBAL ERROR HANDLING ====================
const setupGlobalErrorHandlers = () => {
  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    console.error('🌍 Uncaught error:', event.error);
    
    // Ignore chunk loading errors (handled by Vue Router)
    if (event.error && event.error.toString().includes('ChunkLoadError')) {
      return;
    }
    
    store.dispatch('notification/show', {
      type: 'error',
      title: 'خطأ غير متوقع',
      message: 'حدث خطأ في النظام. الرجاء تحديث الصفحة.',
      duration: 6000
    });
  });
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('🌍 Unhandled promise rejection:', event.reason);
    
    // Ignore navigation errors
    if (event.reason && (
      event.reason.toString().includes('navigation') ||
      event.reason.toString().includes('NavigationDuplicated')
    )) {
      return;
    }
    
    store.dispatch('notification/show', {
      type: 'error',
      title: 'خطأ في المعالجة',
      message: 'حدث خطأ أثناء تنفيذ العملية. الرجاء المحاولة مرة أخرى.',
      duration: 5000
    });
  });
  
  // Handle page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // App became visible again
      store.dispatch('sync/checkForUpdates');
    }
  });
};

// ==================== DEBUG TOOLS (Development Only) ====================
if (APP_CONFIG.debug) {
  window.$app = {
    version: APP_CONFIG.version,
    getAuthState: () => ({
      currentUser: auth.currentUser,
      storeUser: store.state.auth.user,
      isAuthenticated: store.getters['auth/isAuthenticated']
    }),
    getStore: () => store.state,
    getRouter: () => router,
    performance: performanceMonitor,
    
    // Debug helpers
    clearCache: () => {
      localStorage.clear();
      sessionStorage.clear();
      console.log('🧹 Cache cleared');
      window.location.reload();
    },
    
    forceUpdate: () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(reg => {
          if (reg) reg.update();
        });
      }
    }
  };
  
  console.log('🔧 Debug tools available at window.$app');
}

// ==================== START APPLICATION ====================
// Start the app initialization
initializeApp().then(() => {
  console.log('🎉 Application started successfully');
  
  // Set up network handlers
  setupNetworkHandlers();
  
  // Set up global error handlers
  setupGlobalErrorHandlers();
  
  // Log memory usage periodically in development
  if (APP_CONFIG.debug && 'memory' in performance) {
    setInterval(() => {
      const memory = performance.memory;
      console.log(`💾 Memory: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB / ${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`);
    }, 60000);
  }
}).catch(error => {
  console.error('💥 Application failed to start:', error);
});

// ==================== CLEANUP ON UNLOAD ====================
window.addEventListener('beforeunload', () => {
  // Clean up temporary data
  const tempKeys = Object.keys(sessionStorage).filter(key => key.startsWith('temp_'));
  tempKeys.forEach(key => sessionStorage.removeItem(key));
  
  // Cancel any pending requests
  if (window.activeRequests) {
    Object.values(window.activeRequests).forEach(controller => controller.abort());
  }
  
  console.log('🧹 Cleaning up before unload');
});

// Export for testing if needed
export { initializeApp, setupServiceWorker };
