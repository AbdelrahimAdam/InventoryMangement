<template>
  <!-- Loading State with Firebase Integration -->
  <div v-if="initializing" class="firebase-loading-screen">
    <div class="loading-content">
      <div class="firebase-spinner"></div>
      <h1>نظام إدارة المخازن</h1>
      <p>جاري الاتصال بالخادم...</p>
      <div class="loading-progress">
        <div class="progress-bar"></div>
      </div>
      <div class="loading-details">
        <p class="text-sm opacity-70">{{ loadingMessage }}</p>
        <p class="text-xs opacity-50 mt-2">الإصدار 1.0.0</p>
      </div>
    </div>
    
    <!-- Error retry button (hidden by default) -->
    <div v-if="showRetryButton" class="error-retry">
      <button @click="retryInitialization" class="retry-btn">
        🔄 إعادة المحاولة
      </button>
      <button @click="forceLoginPage" class="force-login-btn">
        🔓 الدخول يدوياً
      </button>
    </div>
  </div>

  <!-- Main App Content -->
  <div v-else>
    <!-- Authenticated User - Show Layouts -->
    <template v-if="isAuthenticated && userProfile">
      <!-- Mobile Layout -->
      <div v-if="isMobile" class="mobile-scroll-container">
        <MobileDashboard />
      </div>

      <!-- Desktop Layout -->
      <div v-else class="desktop-scroll-container">
        <DesktopLayout />
      </div>
    </template>

    <!-- Not Authenticated or Profile Not Loaded - Show Login -->
    <router-view v-else />
  </div>

  <!-- Global Toast Notification -->
  <div v-if="toast.show" class="global-toast">
    <div :class="['toast-content', toast.type]">
      <div class="toast-icon">
        <svg v-if="toast.type === 'success'" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <svg v-if="toast.type === 'error'" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <svg v-if="toast.type === 'warning'" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <svg v-if="toast.type === 'info'" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <span class="toast-message">{{ toast.message }}</span>
      <button @click="hideToast" class="toast-close">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </div>

  <!-- Development Tools Panel -->
  <div v-if="isDevelopment && !initializing && isAuthenticated" class="dev-tools">
    <button @click="toggleDevTools" class="dev-tools-toggle">
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
      </svg>
    </button>

    <div v-if="showDevTools" class="dev-tools-panel">
      <div class="dev-tools-header">
        <h3>🛠️ أدوات التطوير</h3>
        <button @click="toggleDevTools" class="close-btn">✕</button>
      </div>
      
      <div class="dev-tools-content">
        <div class="info-grid">
          <div class="info-item">
            <span class="label">الحالة:</span>
            <span :class="['value', isAuthenticated ? 'text-green-500' : 'text-red-500']">
              {{ isAuthenticated ? 'مسجل' : 'غير مسجل' }}
            </span>
          </div>
          <div class="info-item">
            <span class="label">المستخدم:</span>
            <span class="value">{{ userName || '---' }}</span>
          </div>
          <div class="info-item">
            <span class="label">الدور:</span>
            <span class="value">{{ userRole || '---' }}</span>
          </div>
          <div class="info-item">
            <span class="label">المسار:</span>
            <span class="value">{{ currentRoutePath }}</span>
          </div>
          <div class="info-item">
            <span class="label">الجوال:</span>
            <span class="value">{{ isMobile ? 'نعم' : 'لا' }}</span>
          </div>
        </div>

        <div class="action-buttons">
          <button @click="forceLogout" class="action-btn logout-btn">
            تسجيل الخروج
          </button>
          <button @click="clearAllData" class="action-btn clear-btn">
            مسح الكل
          </button>
          <button @click="simulateSuperadmin" class="action-btn admin-btn">
            محاكاة مشرف
          </button>
          <button @click="refreshAllData" class="action-btn refresh-btn">
            تحديث البيانات
          </button>
        </div>

        <div class="firebase-info">
          <h4>معلومات Firebase:</h4>
          <p class="text-xs">{{ firebaseUserInfo }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Network Status Indicator -->
  <div v-if="!isOnline" class="network-status offline">
    <div class="flex items-center">
      <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span>أنت غير متصل بالإنترنت</span>
    </div>
  </div>
  <div v-else-if="isOnline && networkRestored" class="network-status online">
    <div class="flex items-center">
      <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span>تم استعادة الاتصال</span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import MobileLayout from '@/layouts/MobileLayout.vue';
import DesktopLayout from '@/layouts/DesktopLayout.vue';

// Firebase imports
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'App',
  components: {
    MobileDashboard,
    DesktopLayout
  },
  
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    
    // State
    const initializing = ref(true);
    const isMobile = ref(false);
    const showDevTools = ref(false);
    const isOnline = ref(navigator.onLine);
    const networkRestored = ref(false);
    const showRetryButton = ref(false);
    const loadingMessage = ref('جاري التحقق من المصادقة...');
    const firebaseInitialized = ref(false);
    
    // Toast notification
    const toast = ref({
      show: false,
      message: '',
      type: 'info'
    });
    
    // Development mode
    const isDevelopment = ref(process.env.NODE_ENV === 'development');
    
    // Computed properties
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const userProfile = computed(() => store.state.userProfile);
    const userName = computed(() => store.getters.userName);
    const userRole = computed(() => store.getters.userRole);
    const currentRoutePath = computed(() => route.path);
    
    const firebaseUserInfo = computed(() => {
      const user = auth.currentUser;
      if (!user) return 'لا يوجد مستخدم في Firebase';
      return `البريد: ${user.email} | UID: ${user.uid.substring(0, 8)}...`;
    });
    
    // Toast methods
    const showToast = (message, type = 'info', duration = 3000) => {
      toast.value = {
        show: true,
        message,
        type
      };
      
      if (duration > 0) {
        setTimeout(() => {
          if (toast.value.message === message) {
            toast.value.show = false;
          }
        }, duration);
      }
    };
    
    const hideToast = () => {
      toast.value.show = false;
    };
    
    // Device detection
    const checkIfMobile = () => {
      const width = window.innerWidth;
      isMobile.value = width < 1024;
      
      // Update body classes
      document.body.classList.toggle('is-mobile', isMobile.value);
      document.body.classList.toggle('is-desktop', !isMobile.value);
    };
    
    // Firebase authentication initialization
    const initializeFirebaseAuth = () => {
      return new Promise((resolve, reject) => {
        console.log('🔐 Starting Firebase authentication...');
        
        // Set timeout for Firebase auth
        const authTimeout = setTimeout(() => {
          console.warn('⚠️ Firebase auth timeout - proceeding without auth');
          showRetryButton.value = true;
          resolve(null);
        }, 10000); // 10 seconds timeout
        
        const unsubscribe = onAuthStateChanged(
          auth,
          async (user) => {
            clearTimeout(authTimeout);
            unsubscribe();
            
            console.log('✅ Firebase auth state changed:', user ? user.email : 'No user');
            firebaseInitialized.value = true;
            
            if (user) {
              try {
                // Set user in store
                store.commit('SET_USER', user);
                
                // Load user profile
                loadingMessage.value = 'جاري تحميل بيانات المستخدم...';
                await store.dispatch('loadUserProfile', user);
                
                console.log('✅ User authenticated:', user.email);
                showToast(`مرحباً ${store.getters.userName}!`, 'success');
                resolve(user);
              } catch (error) {
                console.error('❌ Failed to load user profile:', error);
                store.commit('SET_USER', null);
                showToast('خطأ في تحميل بيانات المستخدم', 'error');
                resolve(null);
              }
            } else {
              store.commit('SET_USER', null);
              store.commit('SET_USER_PROFILE', null);
              console.log('👤 No user authenticated');
              resolve(null);
            }
          },
          (error) => {
            clearTimeout(authTimeout);
            unsubscribe();
            console.error('❌ Firebase auth error:', error);
            firebaseInitialized.value = false;
            showRetryButton.value = true;
            showToast('خطأ في المصادقة', 'error');
            reject(error);
          }
        );
      });
    };
    
    // Handle authentication and routing
    const handleAuthAndRouting = () => {
      console.log('🔄 Auth routing check:', {
        isAuthenticated: isAuthenticated.value,
        hasProfile: !!userProfile.value,
        currentRoute: route.path,
        routeName: route.name
      });
      
      // CRITICAL: Prevent infinite redirect loop
      if (route.path === '/login' && isAuthenticated.value && userProfile.value) {
        console.log('✅ Already authenticated, redirecting to dashboard');
        router.replace('/dashboard');
        return;
      }
      
      if (route.meta?.requiresAuth && !isAuthenticated.value && route.path !== '/login') {
        console.log('🔒 Not authenticated, redirecting to login');
        router.replace('/login');
        return;
      }
      
      if (isAuthenticated.value && userProfile.value?.is_active === false) {
        console.log('🚫 User inactive, logging out');
        store.dispatch('logout');
        router.replace('/login');
        return;
      }
    };
    
    // Initialize the application
    const initializeApp = async () => {
      console.log('🚀 Starting app initialization...');
      
      try {
        // Check device type
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        
        // Initialize Firebase auth
        loadingMessage.value = 'جاري التحقق من المصادقة...';
        await initializeFirebaseAuth();
        
        // Initialize auth listener for future changes
        onAuthStateChanged(auth, (user) => {
          console.log('👁️ Auth state changed:', user ? user.email : 'No user');
          if (!user && isAuthenticated.value) {
            console.log('👋 User signed out, redirecting to login');
            store.commit('SET_USER', null);
            store.commit('SET_USER_PROFILE', null);
            router.replace('/login');
          }
        });
        
        // Initial auth routing check
        handleAuthAndRouting();
        
        // Watch for auth changes
        watch(isAuthenticated, handleAuthAndRouting);
        
        // Watch for route changes
        watch(() => route.path, () => {
          setTimeout(handleAuthAndRouting, 100);
        });
        
        console.log('✅ App initialized successfully');
        
      } catch (error) {
        console.error('❌ App initialization failed:', error);
        showToast('خطأ في تحميل التطبيق', 'error');
        
        // Ensure we can still navigate to login
        if (route.path !== '/login') {
          router.replace('/login');
        }
        
        showRetryButton.value = true;
      } finally {
        // Small delay for better UX
        setTimeout(() => {
          initializing.value = false;
          console.log('🏁 App ready');
        }, 500);
      }
    };
    
    // Retry initialization
    const retryInitialization = async () => {
      showRetryButton.value = false;
      initializing.value = true;
      loadingMessage.value = 'إعادة المحاولة...';
      
      // Clear any cached data
      localStorage.removeItem('firebase:authUser:monofia-inventory');
      sessionStorage.clear();
      
      setTimeout(async () => {
        await initializeApp();
      }, 1000);
    };
    
    // Force login page
    const forceLoginPage = () => {
      store.commit('SET_USER', null);
      store.commit('SET_USER_PROFILE', null);
      initializing.value = false;
      router.replace('/login');
    };
    
    // Development tools methods
    const toggleDevTools = () => {
      showDevTools.value = !showDevTools.value;
    };
    
    const forceLogout = async () => {
      try {
        await store.dispatch('logout');
        showToast('تم تسجيل الخروج', 'success');
        router.replace('/login');
      } catch (error) {
        console.error('Logout error:', error);
        showToast('خطأ في تسجيل الخروج', 'error');
      }
    };
    
    const clearAllData = () => {
      try {
        // Clear localStorage
        localStorage.clear();
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        // Clear store
        store.commit('SET_USER', null);
        store.commit('SET_USER_PROFILE', null);
        store.commit('SET_INVENTORY', []);
        store.commit('SET_RECENT_TRANSACTIONS', []);
        
        // Clear Firebase auth
        auth.signOut();
        
        showToast('تم مسح جميع البيانات', 'success');
        
        // Reload page
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
        
      } catch (error) {
        console.error('Clear data error:', error);
        showToast('خطأ في مسح البيانات', 'error');
      }
    };
    
    const simulateSuperadmin = () => {
      store.commit('SET_USER_PROFILE', {
        role: 'superadmin',
        name: 'المشرف العام',
        email: 'admin@example.com',
        is_active: true,
        permissions: ['full_access'],
        allowed_warehouses: ['all']
      });
      showToast('تم تعيينك كمشرف عام', 'success');
    };
    
    const refreshAllData = async () => {
      try {
        if (isAuthenticated.value) {
          await store.dispatch('getRecentTransactions');
          showToast('تم تحديث البيانات', 'success');
        }
      } catch (error) {
        console.error('Refresh error:', error);
        showToast('خطأ في تحديث البيانات', 'error');
      }
    };
    
    // Network status
    const updateNetworkStatus = () => {
      const wasOnline = isOnline.value;
      isOnline.value = navigator.onLine;
      
      if (!wasOnline && isOnline.value) {
        networkRestored.value = true;
        showToast('تم استعادة الاتصال بالإنترنت', 'success', 2000);
        setTimeout(() => networkRestored.value = false, 3000);
      } else if (wasOnline && !isOnline.value) {
        showToast('فقدت الاتصال بالإنترنت', 'warning', 0);
      }
    };
    
    // Keyboard shortcuts
    const handleKeyPress = (e) => {
      // Ctrl+Shift+D: Toggle dev tools
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggleDevTools();
      }
      
      // Ctrl+Shift+L: Force logout
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        forceLogout();
      }
      
      // Ctrl+Shift+R: Refresh data
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        refreshAllData();
      }
    };
    
    // Visibility change handler
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated.value) {
        console.log('App became visible, refreshing data...');
        refreshAllData();
      }
    };
    
    // Lifecycle
    onMounted(async () => {
      console.log('📱 App component mounted');
      
      // Event listeners
      window.addEventListener('online', updateNetworkStatus);
      window.addEventListener('offline', updateNetworkStatus);
      document.addEventListener('keydown', handleKeyPress);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Initialize app
      await initializeApp();
    });
    
    onUnmounted(() => {
      console.log('👋 App component unmounted');
      window.removeEventListener('resize', checkIfMobile);
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    });
    
    return {
      // State
      initializing,
      isMobile,
      toast,
      isDevelopment,
      showDevTools,
      isOnline,
      networkRestored,
      showRetryButton,
      loadingMessage,
      
      // Computed
      isAuthenticated,
      userProfile,
      userName,
      userRole,
      currentRoutePath,
      firebaseUserInfo,
      
      // Methods
      hideToast,
      toggleDevTools,
      forceLogout,
      clearAllData,
      simulateSuperadmin,
      refreshAllData,
      retryInitialization,
      forceLoginPage
    };
  }
};
</script>

<style scoped>
/* Loading Screen Styles */
.firebase-loading-screen {
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
}

.loading-content {
  text-align: center;
  max-width: 90%;
}

.firebase-spinner {
  width: 80px;
  height: 80px;
  border: 6px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
  margin: 0 auto 30px;
}

.loading-content h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.loading-content p {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 40px;
}

.loading-progress {
  width: 200px;
  height: 4px;
  background: rgba(255,255,255,0.2);
  border-radius: 2px;
  margin: 0 auto;
  overflow: hidden;
}

.progress-bar {
  width: 30%;
  height: 100%;
  background: white;
  border-radius: 2px;
  animation: progress 2s ease-in-out infinite;
}

.loading-details {
  margin-top: 30px;
  font-size: 14px;
}

.error-retry {
  margin-top: 30px;
  display: flex;
  gap: 10px;
}

.retry-btn, .force-login-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.retry-btn {
  background: white;
  color: #667eea;
}

.force-login-btn {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.force-login-btn:hover {
  background: rgba(255,255,255,0.3);
}

/* Toast Notification Styles */
.global-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  left: 20px;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

@media (min-width: 640px) {
  .global-toast {
    right: auto;
    left: 50%;
    transform: translateX(-50%);
    width: 400px;
  }
}

.toast-content {
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.toast-content.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.toast-content.error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.toast-content.warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.toast-content.info {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.toast-icon {
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  font-weight: 500;
}

.toast-close {
  flex-shrink: 0;
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  opacity: 0.8;
  padding: 4px;
  border-radius: 4px;
}

.toast-close:hover {
  opacity: 1;
  background: rgba(255,255,255,0.1);
}

/* Dev Tools Styles */
.dev-tools {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
}

.dev-tools-toggle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(17, 24, 39, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.dev-tools-toggle:hover {
  background: rgba(31, 41, 55, 0.9);
  transform: scale(1.1);
}

.dev-tools-panel {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 320px;
  background: rgba(17, 24, 39, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  overflow: hidden;
}

.dev-tools-header {
  padding: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dev-tools-header h3 {
  color: white;
  font-weight: 600;
  font-size: 16px;
}

.close-btn {
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
}

.close-btn:hover {
  color: white;
}

.dev-tools-content {
  padding: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.info-item {
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 8px 12px;
}

.info-item .label {
  display: block;
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 2px;
}

.info-item .value {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: white;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 20px;
}

.action-btn {
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.3);
}

.clear-btn {
  background: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
}

.clear-btn:hover {
  background: rgba(139, 92, 246, 0.3);
}

.admin-btn {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.admin-btn:hover {
  background: rgba(16, 185, 129, 0.3);
}

.refresh-btn {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.refresh-btn:hover {
  background: rgba(59, 130, 246, 0.3);
}

.firebase-info {
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 12px;
}

.firebase-info h4 {
  color: rgba(255,255,255,0.8);
  font-size: 14px;
  margin-bottom: 8px;
}

.firebase-info p {
  color: rgba(255,255,255,0.6);
  word-break: break-all;
}

/* Network Status Styles */
.network-status {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 12px 20px;
  text-align: center;
  z-index: 1001;
  font-weight: 500;
  animation: slideDown 0.3s ease;
}

.network-status.offline {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.network-status.online {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

/* Animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes progress {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(250%); }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .firebase-spinner {
    width: 60px;
    height: 60px;
  }
  
  .loading-content h1 {
    font-size: 22px;
  }
  
  .dev-tools-panel {
    width: calc(100vw - 40px);
    right: -10px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    grid-template-columns: 1fr;
  }
}

/* Desktop optimizations */
@media (min-width: 1024px) {
  .firebase-spinner {
    width: 100px;
    height: 100px;
  }
  
  .loading-content h1 {
    font-size: 32px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .dev-tools-panel {
    background: rgba(31, 41, 55, 0.95);
  }
}

/* Safe area support */
@supports (padding: max(0px)) {
  .global-toast {
    top: max(20px, env(safe-area-inset-top));
  }
  
  .network-status {
    padding-top: max(12px, env(safe-area-inset-top));
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }
}
</style>

<style>
/* Import Arabic font */
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap');

/* Base styles */
* {
  font-family: 'Tajawal', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Global styles */
:root {
  --sky-light: #e0f2fe;
  --sky-mid: #bae6fd;
  --sky-dark: #7dd3fc;
  --night-dark: #0f172a;
  --night-mid: #1e293b;
  --night-light: #334155;
}

.dark {
  --sky-light: #0f172a;
  --sky-mid: #1e293b;
  --sky-dark: #334155;
}

/* Mobile & Desktop scrolling containers */
.mobile-scroll-container {
  height: 100vh;
  height: -webkit-fill-available;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  overscroll-behavior-y: contain;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.desktop-scroll-container {
  min-height: 100vh;
  overflow-y: auto;
  scroll-behavior: smooth;
}

/* Scrollbar styles */
.mobile-scroll-container::-webkit-scrollbar {
  width: 3px;
}

.mobile-scroll-container::-webkit-scrollbar-track {
  background: transparent;
}

.mobile-scroll-container::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 1.5px;
}

.dark .mobile-scroll-container::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.3);
}

.desktop-scroll-container::-webkit-scrollbar {
  width: 8px;
}

.desktop-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.desktop-scroll-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.dark .desktop-scroll-container::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark .desktop-scroll-container::-webkit-scrollbar-thumb {
  background: #4b5563;
}

/* Safe area for mobile */
@supports (padding: max(0px)) {
  .fixed.top-0 {
    padding-top: max(0px, env(safe-area-inset-top));
  }
  
  .fixed.bottom-0 {
    padding-bottom: max(0px, env(safe-area-inset-bottom));
  }
}

/* Smooth transitions */
* {
  transition: background-color 0.2s ease, 
              border-color 0.2s ease, 
              color 0.2s ease;
}

/* Focus styles */
:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 0.5rem;
}

/* RTL specific */
[dir="rtl"] {
  text-align: right;
}

/* iOS specific fixes */
@supports (-webkit-touch-callout: none) {
  .min-h-screen {
    min-height: -webkit-fill-available;
  }
  
  .h-screen {
    height: -webkit-fill-available;
  }
}

/* Mobile optimizations */
@media (max-width: 640px) {
  button, 
  [role="button"],
  .touch-target {
    min-height: 44px;
    min-width: 44px;
  }
  
  body.is-mobile {
    overflow: hidden;
    position: fixed;
    width: 100%;
    height: 100%;
  }
}

/* Performance optimizations */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Firefox scrollbar fixes */
@-moz-document url-prefix() {
  .mobile-scroll-container {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
  }
  
  .desktop-scroll-container {
    scrollbar-width: auto;
    scrollbar-color: #c1c1c1 #f1f1f1;
  }
  
  .dark .desktop-scroll-container {
    scrollbar-color: #4b5563 #1f2937;
  }
}
</style>