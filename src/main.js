// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './styles/globals.css';

// Import router setup function
import { setupRouter } from './router';

// Create the app
console.log('🚀 Starting Vue application...');

const app = createApp(App);

// Use plugins
app.use(store);
app.use(router);

// Setup router with store BEFORE mounting
// This is CRITICAL for the router guard to work
setupRouter(store);

// Log initial store state
console.log('Store initial state:', {
  isAuthenticated: store.getters.isAuthenticated,
  user: store.state.user,
  userProfile: store.state.userProfile
});

// Global error handler for Vue
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err, info);
  
  // Show user-friendly error message
  if (store && store.dispatch) {
    store.dispatch('showNotification', {
      type: 'error',
      message: 'حدث خطأ في النظام. يرجى المحاولة مرة أخرى.'
    });
  }
};

// Global warning handler
app.config.warnHandler = (msg, vm, trace) => {
  console.warn('Vue Warning:', msg, trace);
};

// Make router and store available globally for debugging (development only)
if (process.env.NODE_ENV === 'development') {
  window.vueApp = app;
  window.vueRouter = router;
  window.vueStore = store;
  
  // Helper function to check auth state
  window.checkAuth = () => {
    console.log('Auth State:', {
      isAuthenticated: store.getters.isAuthenticated,
      user: store.state.user,
      userProfile: store.state.userProfile,
      userRole: store.getters.userRole,
      userName: store.getters.userName
    });
  };
  
  // Helper function to force logout
  window.forceLogout = () => {
    console.log('Forcing logout...');
    store.dispatch('logout').then(() => {
      console.log('Logged out successfully');
      router.push('/login');
    });
  };
  
  // Helper function to force login redirect
  window.goToLogin = () => {
    console.log('Redirecting to login...');
    router.push('/login');
  };
  
  // Helper function to check current route
  window.checkRoute = () => {
    console.log('Current Route:', {
      path: router.currentRoute.value.path,
      name: router.currentRoute.value.name,
      meta: router.currentRoute.value.meta
    });
  };
}

// Mount the app
console.log('Mounting Vue app...');

app.mount('#app');

console.log('✅ Vue app mounted successfully');

// Post-mount initialization
window.addEventListener('load', () => {
  console.log('Window loaded, checking authentication...');
  
  // Check if user is trying to access a protected route without auth
  const currentRoute = router.currentRoute.value;
  const isAuthenticated = store.getters.isAuthenticated;
  
  console.log('Post-mount check:', {
    currentRoute: currentRoute.path,
    isAuthenticated: isAuthenticated,
    routeRequiresAuth: currentRoute.meta?.requiresAuth
  });
  
  // If not authenticated and on a protected route, redirect to login
  if (!isAuthenticated && currentRoute.meta?.requiresAuth) {
    console.log('Redirecting to login (post-mount check)');
    router.replace('/login');
  }
  
  // If authenticated and on login page, redirect to dashboard
  if (isAuthenticated && currentRoute.name === 'Login') {
    console.log('Redirecting to dashboard (post-mount check)');
    router.replace('/dashboard');
  }
});

// Register service worker for PWA
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    console.log('Registering Service Worker...');
    
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.log('✅ Service Worker registered:', registration);
        
        // Check for updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) return;
          
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('🔄 New content available; please refresh.');
                
                // Show update notification
                if (store && store.dispatch) {
                  store.dispatch('showNotification', {
                    type: 'info',
                    message: 'تحديث جديد متاح. يرجى تحديث الصفحة.',
                    duration: 10000,
                    action: {
                      label: 'تحديث',
                      handler: () => window.location.reload()
                    }
                  });
                }
              }
            }
          };
        };
      })
      .catch(error => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}

// Global PWA install prompt handler
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('🔔 PWA install prompt available');
  e.preventDefault();
  deferredPrompt = e;
  
  // Show install prompt notification
  if (store && store.dispatch) {
    store.dispatch('showNotification', {
      type: 'info',
      message: 'يمكنك تثبيت هذا التطبيق على جهازك!',
      duration: 8000,
      action: {
        label: 'تثبيت',
        handler: () => {
          if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(choiceResult => {
              if (choiceResult.outcome === 'accepted') {
                console.log('✅ User accepted PWA install');
                store.dispatch('showNotification', {
                  type: 'success',
                  message: 'تم تثبيت التطبيق بنجاح!'
                });
              } else {
                console.log('❌ User dismissed PWA install');
              }
              deferredPrompt = null;
            });
          }
        }
      }
    });
  }
});

window.addEventListener('appinstalled', () => {
  console.log('✅ PWA installed successfully');
  deferredPrompt = null;
  
  if (store && store.dispatch) {
    store.dispatch('showNotification', {
      type: 'success',
      message: 'تم تثبيت التطبيق بنجاح!'
    });
  }
});

// Make install function globally available
window.installPWA = () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    
    deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ User accepted PWA install');
        if (store && store.dispatch) {
          store.dispatch('showNotification', {
            type: 'success',
            message: 'تم تثبيت التطبيق بنجاح!'
          });
        }
      } else {
        console.log('❌ User dismissed PWA install');
      }
      deferredPrompt = null;
    });
  }
};

// Handle online/offline events
window.addEventListener('online', () => {
  console.log('🌐 App is online');
  if (store && store.dispatch) {
    store.dispatch('showNotification', {
      type: 'success',
      message: 'تم استعادة الاتصال بالإنترنت',
      duration: 3000
    });
  }
});

window.addEventListener('offline', () => {
  console.log('📴 App is offline');
  if (store && store.dispatch) {
    store.dispatch('showNotification', {
      type: 'warning',
      message: 'أنت غير متصل بالإنترنت',
      duration: 5000
    });
  }
});

// Handle visibility change (tab switching)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('👁️ App is hidden');
  } else {
    console.log('👁️ App is visible');
    // Refresh data when app becomes visible
    if (store && store.dispatch && store.getters.isAuthenticated) {
      setTimeout(() => {
        store.dispatch('getRecentTransactions').catch(console.error);
      }, 1000);
    }
  }
});

// Log app lifecycle events
console.log('🎉 Application initialized successfully');
console.log('Environment:', process.env.NODE_ENV);
console.log('Base URL:', process.env.BASE_URL);
console.log('App version:', process.env.VUE_APP_VERSION || '1.0.0');

// Global keyboard shortcuts (for development)
if (process.env.NODE_ENV === 'development') {
  document.addEventListener('keydown', (e) => {
    // Ctrl + Shift + L to force logout
    if (e.ctrlKey && e.shiftKey && e.key === 'L') {
      e.preventDefault();
      console.log('Dev shortcut: Force logout');
      window.forceLogout();
    }
    
    // Ctrl + Shift + I to check auth
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      console.log('Dev shortcut: Check auth');
      window.checkAuth();
    }
    
    // Ctrl + Shift + R to check route
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
      e.preventDefault();
      console.log('Dev shortcut: Check route');
      window.checkRoute();
    }
  });
}