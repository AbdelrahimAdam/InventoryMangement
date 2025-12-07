<template>
  <!-- Loading State -->
  <div v-if="initializing" class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400 font-medium">جاري تحميل النظام...</p>
    </div>
  </div>

  <!-- Main App Content -->
  <div v-else>
    <!-- Authenticated User - Show Layouts -->
    <template v-if="isAuthenticated">
      <!-- Mobile Layout -->
      <div v-if="isMobile" class="mobile-scroll-container">
        <MobileLayout />
      </div>

      <!-- Desktop Layout -->
      <div v-else class="desktop-scroll-container">
        <DesktopLayout />
      </div>
    </template>

    <!-- Not Authenticated - Show Router View (Login Page) -->
    <router-view v-else />
  </div>

  <!-- Toast Notification -->
  <div v-if="toast.show" class="fixed top-4 right-4 left-4 z-50 md:right-auto md:left-1/2 md:-translate-x-1/2 md:w-96">
    <div :class="toastClasses" class="text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between animate-slide-down">
      <span class="flex-1">{{ toast.message }}</span>
      <button @click="hideToast" class="ml-4">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </div>

  <!-- Development Tools -->
  <div v-if="isDevelopment && !initializing" class="fixed bottom-4 right-4 z-50">
    <button @click="toggleDebugPanel" class="bg-gray-800 text-white p-2 rounded-lg opacity-75 hover:opacity-100">
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
      </svg>
    </button>
    
    <div v-if="showDebugPanel" class="absolute bottom-full right-0 mb-2 bg-gray-900 text-white rounded-lg p-4 w-80 max-h-96 overflow-auto">
      <div class="space-y-3 text-sm">
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-gray-800 p-2 rounded">
            <p class="text-gray-400">النظام</p>
            <p>{{ isMobile ? 'جوال' : 'سطح مكتب' }}</p>
          </div>
          <div class="bg-gray-800 p-2 rounded">
            <p class="text-gray-400">الحالة</p>
            <p :class="isAuthenticated ? 'text-green-400' : 'text-red-400'">
              {{ isAuthenticated ? 'مسجل' : 'غير مسجل' }}
            </p>
          </div>
        </div>
        
        <div class="bg-gray-800 p-2 rounded">
          <p class="text-gray-400">المستخدم</p>
          <p>{{ userName || '---' }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ userRole || '---' }}</p>
        </div>
        
        <div class="bg-gray-800 p-2 rounded">
          <p class="text-gray-400">المسار</p>
          <p class="truncate">{{ currentRoutePath }}</p>
        </div>
        
        <div class="space-y-2">
          <button @click="forceLoginRedirect" class="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded text-sm">
            إجبار تسجيل الدخول
          </button>
          <button @click="clearAuthAndReload" class="w-full bg-red-600 hover:bg-red-700 p-2 rounded text-sm">
            مسح المصادقة وإعادة التحميل
          </button>
          <button @click="toggleDebugPanel" class="w-full bg-gray-700 hover:bg-gray-600 p-2 rounded text-sm">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import MobileLayout from '@/layouts/MobileLayout.vue';
import DesktopLayout from '@/layouts/DesktopLayout.vue';

export default {
  name: 'App',
  components: {
    MobileLayout,
    DesktopLayout
  },
  
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    
    const initializing = ref(true);
    const isMobile = ref(false);
    const showDebugPanel = ref(false);
    
    // Toast notification
    const toast = ref({
      show: false,
      message: '',
      type: 'info'
    });
    
    // Development mode check
    const isDevelopment = ref(process.env.NODE_ENV === 'development');
    
    // Computed properties
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const userProfile = computed(() => store.state.userProfile);
    const userName = computed(() => store.getters.userName);
    const userRole = computed(() => store.getters.userRole);
    const currentRoutePath = computed(() => route.path);
    
    // Show toast
    const showToast = (message, type = 'info', duration = 3000) => {
      toast.value = {
        show: true,
        message,
        type
      };
      
      setTimeout(() => {
        if (toast.value.message === message) {
          toast.value.show = false;
        }
      }, duration);
    };
    
    // Hide toast
    const hideToast = () => {
      toast.value.show = false;
    };
    
    // Toast classes
    const toastClasses = computed(() => {
      const classes = {
        info: 'bg-blue-500',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500'
      };
      return classes[toast.value.type] || 'bg-blue-500';
    });
    
    // Check if mobile with improved detection
    const checkIfMobile = () => {
      const width = window.innerWidth;
      isMobile.value = width < 1024;
      console.log('Device check:', isMobile.value ? 'Mobile' : 'Desktop', width);
      
      // Update body class for mobile-specific styles
      if (isMobile.value) {
        document.body.classList.add('is-mobile');
        document.body.classList.remove('is-desktop');
      } else {
        document.body.classList.add('is-desktop');
        document.body.classList.remove('is-mobile');
      }
    };
    
    // Toggle debug panel
    const toggleDebugPanel = () => {
      showDebugPanel.value = !showDebugPanel.value;
    };
    
    // Force login redirect (for debugging)
    const forceLoginRedirect = () => {
      if (isAuthenticated.value) {
        store.dispatch('logout').then(() => {
          router.push('/login');
          showToast('تم تسجيل الخروج والإعادة إلى صفحة الدخول', 'success');
        });
      } else {
        router.push('/login');
        showToast('تم التوجيه إلى صفحة الدخول', 'info');
      }
    };
    
    // Clear auth data and reload
    const clearAuthAndReload = () => {
      try {
        // Clear Firebase auth data
        Object.keys(localStorage).forEach(key => {
          if (key.includes('firebase:authUser') || key.includes('firebase:host:')) {
            localStorage.removeItem(key);
          }
        });
        
        // Clear app auth data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        sessionStorage.clear();
        
        // Clear store state
        store.commit('SET_USER', null);
        store.commit('SET_USER_PROFILE', null);
        store.commit('SET_AUTH_STATE', false);
        
        showToast('تم مسح بيانات المصادقة', 'success');
        
        // Reload page
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
        
      } catch (error) {
        console.error('Clear auth error:', error);
        showToast('خطأ في مسح البيانات', 'error');
      }
    };
    
    // Handle authentication and routing - FIXED VERSION
    const handleAuthAndRouting = () => {
      console.log('🔐 Auth check:', {
        isAuthenticated: isAuthenticated.value,
        currentRoute: route.path,
        routeName: route.name,
        routeMeta: route.meta
      });
      
      // CRITICAL FIX: If not authenticated AND not on login page, redirect to login
      if (!isAuthenticated.value && route.name !== 'Login') {
        console.log('🔴 Not authenticated, redirecting to login');
        router.replace('/login');
        return;
      }
      
      // If authenticated AND on login page, redirect to dashboard
      if (isAuthenticated.value && route.name === 'Login') {
        console.log('🟢 Authenticated, redirecting from login to dashboard');
        router.replace('/dashboard');
        return;
      }
      
      // If authenticated but user profile is not loaded yet
      if (isAuthenticated.value && !userProfile.value) {
        console.log('🟡 Authenticated but profile not loaded');
        // Profile will load via auth listener
        return;
      }
      
      // If authenticated and user profile is loaded but inactive
      if (isAuthenticated.value && userProfile.value && userProfile.value.is_active === false) {
        console.log('🔴 User account is inactive, logging out');
        store.dispatch('logout');
        router.replace('/login');
        return;
      }
      
      console.log('✅ Auth and routing check passed');
    };
    
    // Initialize the app with FIXED authentication handling
    const initializeApp = async () => {
      console.log('🚀 Starting app initialization...');
      
      try {
        // Check if mobile
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        
        // CRITICAL FIX: Clear any Firebase auth persistence on initial load
        // This forces login page on first load
        if (sessionStorage.getItem('app_first_load') === null) {
          console.log('🔄 First app load - clearing auth persistence');
          
          // Clear any Firebase auth in localStorage
          Object.keys(localStorage).forEach(key => {
            if (key.includes('firebase:authUser')) {
              localStorage.removeItem(key);
              console.log('Cleared Firebase key:', key);
            }
          });
          
          sessionStorage.setItem('app_first_load', 'true');
        }
        
        // Initialize authentication via store
        console.log('Initializing auth via store...');
        await store.dispatch('initializeAuth');
        
        console.log('Auth initialization complete:', {
          isAuthenticated: isAuthenticated.value,
          hasUser: !!store.state.user,
          hasProfile: !!userProfile.value
        });
        
        // Watch for authentication changes
        watch(isAuthenticated, (newVal, oldVal) => {
          console.log('Authentication state changed:', { old: oldVal, new: newVal });
          handleAuthAndRouting();
        }, { immediate: true });
        
        // Watch for route changes
        watch(() => route.path, (newPath, oldPath) => {
          console.log('Route changed:', { from: oldPath, to: newPath });
          handleAuthAndRouting();
        });
        
        // Initial check with timeout to ensure router is ready
        setTimeout(() => {
          handleAuthAndRouting();
        }, 200);
        
      } catch (error) {
        console.error('❌ App initialization error:', error);
        showToast('حدث خطأ في تحميل النظام', 'error');
        
        // On error, ensure we're on login page
        if (route.name !== 'Login') {
          router.replace('/login');
        }
      } finally {
        setTimeout(() => {
          initializing.value = false;
          console.log('✅ App initialization complete');
          
          // Show welcome message if authenticated
          if (isAuthenticated.value && userName.value) {
            setTimeout(() => {
              showToast(`مرحباً ${userName.value}!`, 'success');
            }, 1000);
          }
        }, 500);
      }
    };
    
    // Handle keyboard shortcuts for development
    const handleKeyPress = (e) => {
      // Ctrl+Shift+D to toggle debug panel
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        showDebugPanel.value = !showDebugPanel.value;
      }
      
      // Ctrl+Shift+L to force logout
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        forceLoginRedirect();
      }
    };
    
    // Handle visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated.value) {
        // Refresh data when app becomes visible
        console.log('App became visible, refreshing data...');
        store.dispatch('getRecentTransactions').catch(console.error);
      }
    };
    
    // Lifecycle
    onMounted(async () => {
      console.log('📱 App component mounted');
      
      // Add event listeners
      document.addEventListener('keydown', handleKeyPress);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Initialize app
      await initializeApp();
    });
    
    onUnmounted(() => {
      console.log('👋 App component unmounted');
      window.removeEventListener('resize', checkIfMobile);
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    });
    
    return {
      // State
      initializing,
      isMobile,
      toast,
      isDevelopment,
      showDebugPanel,
      
      // Computed
      isAuthenticated,
      userName,
      userRole,
      currentRoutePath,
      toastClasses,
      
      // Methods
      hideToast,
      toggleDebugPanel,
      forceLoginRedirect,
      clearAuthAndReload
    };
  }
};
</script>

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

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
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

/* === SEPARATE MOBILE & DESKTOP SCROLLING === */

/* Mobile-specific scrolling */
.mobile-scroll-container {
  height: 100vh;
  height: -webkit-fill-available; /* iOS Safari fix */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  scroll-behavior: smooth;
  overscroll-behavior-y: contain; /* Prevent pull-to-refresh on mobile */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* Mobile scrollbar (thin and hidden by default) */
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

/* Desktop scrolling */
.desktop-scroll-container {
  min-height: 100vh;
  overflow-y: auto;
  scroll-behavior: smooth;
}

/* Desktop scrollbar */
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

.desktop-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

.dark .desktop-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Safe area for mobile */
.fixed.top-0 {
  padding-top: env(safe-area-inset-top);
}

.fixed.bottom-0 {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Smooth transitions */
* {
  transition: background-color 0.2s ease, 
              border-color 0.2s ease, 
              color 0.2s ease,
              transform 0.2s ease;
}

/* Global scrollbar fallback */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.5);
}

/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
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

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
}

/* Animations */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animated-gradient {
  background-size: 200% 200%;
  animation: gradient 15s ease infinite;
}

@keyframes slide-down {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out;
}

/* Cloud animations */
@keyframes floatCloud {
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(calc(100vw + 100px));
  }
}

/* Sun pulse animation */
@keyframes pulseSun {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 60px #f59e0b, 0 0 100px #fbbf24;
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 80px #f59e0b, 0 0 140px #fbbf24;
  }
}

/* Moon rotation */
@keyframes rotateMoon {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Star twinkle */
@keyframes twinkle {
  0%, 100% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Bell ring animation */
@keyframes bellRing {
  0%, 100% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(15deg);
  }
  75% {
    transform: rotate(-15deg);
  }
}

/* Loading spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Mobile-specific optimizations */
@media (max-width: 640px) {
  /* Improve touch targets */
  button, 
  [role="button"],
  .touch-target {
    min-height: 44px;
    min-width: 44px;
  }
  
  /* Prevent text selection on interactive elements */
  button, a {
    user-select: none;
    -webkit-user-select: none;
  }
  
  /* Mobile body class */
  body.is-mobile {
    overflow: hidden; /* Prevent body scrolling on mobile */
    position: fixed;
    width: 100%;
    height: 100%;
  }
  
  /* Fix for mobile address bar */
  .mobile-scroll-container {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* Desktop-specific optimizations */
@media (min-width: 1024px) {
  body.is-desktop {
    overflow: auto;
  }
  
  /* Desktop hover effects */
  button:hover {
    transform: translateY(-1px);
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
  
  .animate-slide-down,
  .animated-gradient {
    animation: none !important;
  }
}

/* iOS specific fixes */
@supports (-webkit-touch-callout: none) {
  .min-h-screen {
    min-height: -webkit-fill-available;
  }
  
  /* Fix for Safari 100vh bug */
  .h-screen {
    height: -webkit-fill-available;
  }
  
  /* Prevent elastic scrolling on iOS */
  .mobile-scroll-container {
    -webkit-overflow-scrolling: touch;
    overflow-y: scroll;
    overscroll-behavior-y: none;
  }
}

/* Android Chrome specific fixes */
@supports (padding: max(0px)) {
  .mobile-scroll-container {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }
}

/* Mobile tap highlight */
button, 
[role="button"],
.touch-target {
  -webkit-tap-highlight-color: rgba(59, 130, 246, 0.3);
}

/* Disabled state */
button:disabled,
[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Focus ring for accessibility */
.focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Print optimizations */
@media print {
  body {
    color: #000 !important;
    background: #fff !important;
  }
  
  .no-print {
    display: none !important;
  }
  
  a[href]:after {
    content: " (" attr(href) ")";
  }
  
  .mobile-scroll-container,
  .desktop-scroll-container {
    position: static;
    height: auto;
    overflow: visible;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  :root {
    --sky-light: #ffffff;
    --sky-mid: #dddddd;
    --sky-dark: #aaaaaa;
  }
  
  button {
    border: 2px solid currentColor;
  }
}

/* Reduced transparency */
@media (prefers-reduced-transparency: reduce) {
  .bg-white\/90,
  .bg-gray-900\/90 {
    background-color: rgba(255, 255, 255, 1) !important;
  }
  
  .dark .bg-white\/90,
  .dark .bg-gray-900\/90 {
    background-color: rgba(17, 24, 39, 1) !important;
  }
}

/* Mobile orientation handling */
@media (orientation: portrait) and (max-width: 768px) {
  .mobile-scroll-container {
    /* Optimize for portrait */
  }
}

@media (orientation: landscape) and (max-height: 500px) {
  .mobile-scroll-container {
    /* Optimize for landscape mobile */
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* Fix for Firefox scrollbar */
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