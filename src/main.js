// src/main.js - Fixed Version
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './styles/globals.css';

// Import Firebase auth
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

// Create the app
console.log('🚀 Starting Vue application...');

const app = createApp(App);

// Critical: Initialize auth state BEFORE using router/plugins
let authInitialized = false;
const authPromise = new Promise((resolve) => {
  onAuthStateChanged(auth, async (user) => {
    console.log('Firebase auth state changed:', user ? user.email : 'No user');
    
    if (user) {
      // Set user in store
      store.commit('SET_USER', user);
      
      try {
        // Load user profile
        await store.dispatch('loadUserProfile', user);
        console.log('✅ User profile loaded:', store.state.userProfile);
      } catch (error) {
        console.error('Failed to load user profile:', error);
      }
    } else {
      store.commit('SET_USER', null);
      store.commit('SET_USER_PROFILE', null);
    }
    
    authInitialized = true;
    resolve();
  });
});

// Use plugins
app.use(store);
app.use(router);

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

// Make router and store available globally for debugging
if (process.env.NODE_ENV === 'development') {
  window.vueApp = app;
  window.vueRouter = router;
  window.vueStore = store;

  // Helper function to check auth state
  window.checkAuth = () => {
    console.log('🔍 Auth State Debug:', {
      isAuthenticated: store.getters.isAuthenticated,
      user: store.state.user?.email,
      userProfile: store.state.userProfile,
      userRole: store.getters.userRole,
      userName: store.getters.userName,
      firebaseUser: auth.currentUser?.email
    });
  };

  // Helper function to force logout
  window.forceLogout = async () => {
    console.log('🔄 Forcing logout...');
    try {
      await store.dispatch('logout');
      console.log('✅ Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('❌ Logout failed:', error);
    }
  };

  // Helper function to force login redirect
  window.goToLogin = () => {
    console.log('🔗 Redirecting to login...');
    router.push('/login');
  };

  // Helper function to check current route
  window.checkRoute = () => {
    const route = router.currentRoute.value;
    console.log('📍 Current Route:', {
      path: route.path,
      name: route.name,
      meta: route.meta,
      requiresAuth: route.meta?.requiresAuth,
      allowedRoles: route.meta?.allowedRoles
    });
  };

  // Helper function to simulate superadmin
  window.setSuperadmin = () => {
    store.commit('SET_USER_PROFILE', {
      role: 'superadmin',
      name: 'المشرف العام',
      email: 'admin@example.com',
      is_active: true,
      permissions: ['full_access', 'dispatch_items', 'manage_users', 'manage_warehouses'],
      allowed_warehouses: ['all'],
      profile_complete: true
    });
    console.log('👑 Set user as superadmin');
  };
}

// Async mount function
const mountApp = async () => {
  try {
    console.log('⏳ Waiting for auth initialization...');
    
    // Wait for auth to initialize (with timeout)
    await Promise.race([
      authPromise,
      new Promise(resolve => setTimeout(resolve, 3000))
    ]);
    
    console.log('✅ Auth initialized:', {
      isAuthenticated: store.getters.isAuthenticated,
      userRole: store.getters.userRole,
      firebaseUser: auth.currentUser?.email
    });
    
    // Mount the app
    console.log('📌 Mounting Vue app...');
    app.mount('#app');
    console.log('✅ Vue app mounted successfully');
    
    // Post-mount initialization
    setTimeout(() => {
      console.log('🔄 Post-mount initialization...');
      
      const currentRoute = router.currentRoute.value;
      const isAuthenticated = store.getters.isAuthenticated;
      const userProfile = store.state.userProfile;
      
      console.log('Post-mount state:', {
        currentRoute: currentRoute.path,
        routeName: currentRoute.name,
        isAuthenticated,
        userRole: userProfile?.role,
        userActive: userProfile?.is_active
      });
      
      // Handle route redirections
      if (!isAuthenticated) {
        // Not authenticated
        if (currentRoute.meta?.requiresAuth && currentRoute.name !== 'Login') {
          console.log('🔒 Redirecting to login (requires auth)');
          router.replace('/login');
        }
      } else {
        // Authenticated
        if (userProfile?.is_active === false) {
          console.log('🚫 User is inactive, logging out');
          store.dispatch('logout');
          router.replace('/login');
          return;
        }
        
        if (currentRoute.name === 'Login') {
          console.log('📊 Already authenticated, redirecting to dashboard');
          router.replace('/dashboard');
        }
        
        // Check if user can access current route
        if (currentRoute.meta?.allowedRoles && userProfile?.role) {
          const allowedRoles = currentRoute.meta.allowedRoles;
          const userRole = userProfile.role;
          
          if (!allowedRoles.includes(userRole)) {
            console.log(`🚫 User role ${userRole} not allowed for route ${currentRoute.name}`);
            router.replace('/unauthorized');
          }
        }
      }
    }, 100);
    
  } catch (error) {
    console.error('❌ Failed to mount app:', error);
    
    // Mount anyway with error state
    try {
      app.mount('#app');
      console.log('⚠️ App mounted in error recovery mode');
      
      // Show error notification
      if (store && store.dispatch) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تحميل التطبيق. يرجى تحديث الصفحة.',
          duration: 10000
        });
      }
    } catch (mountError) {
      console.error('❌ Critical: Failed to mount app even in recovery mode:', mountError);
    }
  }
};

// Start the mount process
mountApp();

// Service Worker Registration (PWA)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    console.log('🔧 Registering Service Worker...');
    
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('✅ Service Worker registered:', registration.scope);
        
        // Check for updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;
          
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('🔄 New content available');
                
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

// PWA Install Prompt
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('📱 PWA install prompt available');
  e.preventDefault();
  deferredPrompt = e;
  
  // Show install prompt after 5 seconds
  setTimeout(() => {
    if (deferredPrompt && store && store.dispatch) {
      store.dispatch('showNotification', {
        type: 'info',
        message: 'يمكنك تثبيت هذا التطبيق على جهازك!',
        duration: 10000,
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
  }, 5000);
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

// Network Status
window.addEventListener('online', () => {
  console.log('🌐 App is online');
  if (store && store.dispatch) {
    store.dispatch('showNotification', {
      type: 'success',
      message: 'تم استعادة الاتصال بالإنترنت',
      duration: 3000
    });
    
    // Refresh data
    if (store.getters.isAuthenticated) {
      setTimeout(() => {
        store.dispatch('getRecentTransactions').catch(console.error);
      }, 2000);
    }
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

// App Visibility
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('👁️ App is hidden');
  } else {
    console.log('👁️ App is visible');
    
    // Refresh when app becomes visible
    if (store && store.getters.isAuthenticated) {
      setTimeout(() => {
        store.dispatch('getRecentTransactions').catch(console.error);
      }, 1000);
    }
  }
});

// Dev Tools
if (process.env.NODE_ENV === 'development') {
  console.log('🛠️ Development mode active');
  
  document.addEventListener('keydown', (e) => {
    // Ctrl + Shift + D: Debug info
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      console.log('=== DEBUG INFO ===');
      window.checkAuth();
      window.checkRoute();
      console.log('Firebase user:', auth.currentUser);
      console.log('Store state:', {
        user: store.state.user,
        userProfile: store.state.userProfile,
        inventory: store.state.inventory?.length || 0,
        warehouses: store.state.warehouses?.length || 0
      });
      console.log('=== END DEBUG ===');
    }
    
    // Ctrl + Shift + L: Logout
    if (e.ctrlKey && e.shiftKey && e.key === 'L') {
      e.preventDefault();
      window.forceLogout();
    }
    
    // Ctrl + Shift + S: Set superadmin (dev only)
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
      e.preventDefault();
      window.setSuperadmin();
    }
  });
}

// Log app info
console.log('🎉 Application initialization complete');
console.log('Environment:', process.env.NODE_ENV);
console.log('Base URL:', import.meta.env.BASE_URL || '/');
console.log('App version:', import.meta.env.VUE_APP_VERSION || '1.0.0');

// Export for testing
export { app, router, store };