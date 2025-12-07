// src/main.js - Fixed with Auth Flow Control
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './styles/globals.css';

// Firebase imports
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

// ==================== 🚨 FIX: Control Variables ====================
let isAuthInitialized = false;
let authPromiseResolve;
const authPromise = new Promise(resolve => {
  authPromiseResolve = resolve;
});

// ==================== 1. Loading Screen ====================
function showLoadingScreen(message = 'جاري التحقق من المصادقة...') {
  const appEl = document.getElementById('app');
  if (!appEl) return;
  
  appEl.innerHTML = `
    <div id="auth-loading" style="
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
      z-index: 9999;
      font-family: system-ui;
    ">
      <div style="text-align: center; padding: 20px;">
        <div style="
          width: 60px;
          height: 60px;
          border: 4px solid #e0e0e0;
          border-top-color: #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        "></div>
        <h3 style="color: #2c3e50; margin-bottom: 10px;">نظام إدارة المخازن</h3>
        <p style="color: #7f8c8d;">${message}</p>
      </div>
      <style>
        @keyframes spin { to { transform: rotate(360deg); } }
      </style>
    </div>
  `;
}

// ==================== 2. Initialize Firebase Auth FIRST ====================
function initializeFirebaseAuth() {
  return new Promise((resolve) => {
    console.log('🔐 Initializing Firebase auth...');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      isAuthInitialized = true;
      
      console.log('✅ Firebase auth state resolved:', user ? user.email : 'No user');
      
      if (user) {
        // User is logged in (persisted session)
        console.log('🔓 User has active session, auto-login enabled');
        
        try {
          // Set user in store
          store.commit('SET_USER', user);
          
          // Load user profile from Firestore
          await store.dispatch('loadUserProfile', user);
          
          console.log('✅ Auto-login successful:', {
            email: user.email,
            role: store.state.userProfile?.role
          });
          
          resolve({ user, autoLogin: true });
        } catch (error) {
          console.error('❌ Failed to load user profile:', error);
          store.commit('SET_USER', null);
          resolve({ user: null, autoLogin: false });
        }
      } else {
        // No user logged in
        console.log('👤 No active session, user needs to login');
        store.commit('SET_USER', null);
        store.commit('SET_USER_PROFILE', null);
        resolve({ user: null, autoLogin: false });
      }
      
      unsubscribe();
      authPromiseResolve();
    }, (error) => {
      console.error('❌ Firebase auth error:', error);
      isAuthInitialized = true;
      store.commit('SET_USER', null);
      resolve({ user: null, autoLogin: false });
      authPromiseResolve();
    });
  });
}

// ==================== 3. Check Route Access ====================
function shouldRedirectToLogin(currentRoute, isAuthenticated) {
  const publicRoutes = ['/login', '/register', '/forgot-password', '/unauthorized'];
  const isPublicRoute = publicRoutes.includes(currentRoute.path);
  
  // If not authenticated and trying to access private route
  if (!isAuthenticated && !isPublicRoute) {
    return '/login';
  }
  
  // If authenticated and trying to access login page
  if (isAuthenticated && currentRoute.path === '/login') {
    return '/dashboard';
  }
  
  return null;
}

// ==================== 4. Main App Initialization ====================
async function initializeApp() {
  try {
    // Step 1: Show loading immediately
    showLoadingScreen();
    
    // Step 2: Initialize Firebase auth
    const { user, autoLogin } = await initializeFirebaseAuth();
    
    // Step 3: Wait for auth to fully initialize
    await authPromise;
    
    // Step 4: Get current state
    const isAuthenticated = !!user;
    const currentRoute = router.currentRoute.value;
    
    console.log('📊 Initial state check:', {
      route: currentRoute.path,
      isAuthenticated,
      autoLogin,
      userRole: store.state.userProfile?.role
    });
    
    // Step 5: Check if redirect is needed
    const redirectPath = shouldRedirectToLogin(currentRoute, isAuthenticated);
    
    // Step 6: Create and configure Vue app
    const app = createApp(App);
    app.use(store);
    app.use(router);
    
    // Step 7: Set global flag
    window.appInitialized = true;
    
    // Step 8: Mount app
    app.mount('#app');
    
    // Step 9: Handle redirects AFTER mount
    if (redirectPath) {
      console.log(`🔄 Redirecting from ${currentRoute.path} to ${redirectPath}`);
      
      // Small delay to ensure app is ready
      setTimeout(() => {
        router.replace(redirectPath).then(() => {
          console.log('✅ Redirect completed');
          
          // Remove loading screen after successful redirect
          setTimeout(() => {
            const loadingEl = document.getElementById('auth-loading');
            if (loadingEl) loadingEl.style.display = 'none';
          }, 500);
        });
      }, 100);
    } else {
      // No redirect needed, just remove loading
      setTimeout(() => {
        const loadingEl = document.getElementById('auth-loading');
        if (loadingEl) loadingEl.style.display = 'none';
        console.log('✅ App loaded successfully');
      }, 500);
    }
    
    // Step 10: Add auth state listener for future changes
    onAuthStateChanged(auth, (newUser) => {
      if (!newUser && isAuthenticated && !['/login', '/unauthorized'].includes(router.currentRoute.value.path)) {
        console.log('👋 User logged out, redirecting to login');
        router.replace('/login');
      }
    });
    
    return { app, router, store };
    
  } catch (error) {
    console.error('❌ Failed to initialize app:', error);
    showErrorScreen(error);
    throw error;
  }
}

// ==================== 5. Error Screen ====================
function showErrorScreen(error) {
  const appEl = document.getElementById('app');
  if (!appEl) return;
  
  appEl.innerHTML = `
    <div style="padding: 40px; text-align: center;">
      <h2 style="color: #e74c3c;">خطأ في التحميل</h2>
      <p>${error.message || 'حدث خطأ غير معروف'}</p>
      <button onclick="window.location.reload()" style="
        padding: 10px 20px;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 5px;
        margin: 10px;
        cursor: pointer;
      ">
        إعادة تحميل
      </button>
      <button onclick="localStorage.clear(); sessionStorage.clear(); window.location.reload()" style="
        padding: 10px 20px;
        background: #e74c3c;
        color: white;
        border: none;
        border-radius: 5px;
        margin: 10px;
        cursor: pointer;
      ">
        مسح التخزين وإعادة تحميل
      </button>
    </div>
  `;
}

// ==================== 🚀 START THE APP ====================
initializeApp().catch(console.error);

// ==================== Global Helpers ====================
if (import.meta.env.DEV) {
  window.debugAuth = {
    getState: () => ({
      firebaseUser: auth.currentUser,
      storeUser: store.state.user,
      isAuthenticated: store.getters.isAuthenticated,
      initialized: isAuthInitialized
    }),
    simulateLogin: (email) => {
      console.log('Simulating login for:', email);
      store.commit('SET_USER', { email });
    },
    simulateLogout: () => {
      console.log('Simulating logout');
      store.commit('SET_USER', null);
      router.push('/login');
    }
  };
}

// ==================== Export for Testing ====================
export { initializeApp };