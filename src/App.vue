<template>
  <!-- Mobile Layout -->
  <MobileLayout v-if="isMobile && !initializing" />

  <!-- Desktop Layout -->
  <DesktopLayout v-else-if="!initializing" />

  <!-- Loading State -->
  <div v-else class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400 font-medium">جاري تحميل النظام...</p>
    </div>
  </div>

  <!-- Debug Panel (Development Only) -->
  <div v-if="isDevelopment && !initializing" class="fixed bottom-20 right-4 z-50">
    <button 
      @click="toggleDebugPanel"
      class="bg-gray-800 text-white p-2 rounded-full shadow-lg"
      aria-label="فتح لوحة التصحيح"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
      </svg>
    </button>
    
    <div v-if="showDebugPanel" class="absolute bottom-full right-0 mb-2 bg-gray-900 text-white rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-auto">
      <div class="flex justify-between items-center mb-3">
        <h3 class="font-bold">لوحة التصحيح</h3>
        <button @click="toggleDebugPanel" class="text-gray-400 hover:text-white">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <div class="space-y-3 text-sm">
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-gray-800 p-2 rounded">
            <p class="text-gray-400">النظام</p>
            <p>{{ isMobile ? 'جوال' : 'سطح مكتب' }}</p>
          </div>
          <div class="bg-gray-800 p-2 rounded">
            <p class="text-gray-400">المسار</p>
            <p class="truncate">{{ currentRoutePath }}</p>
          </div>
        </div>
        
        <div class="bg-gray-800 p-2 rounded">
          <p class="text-gray-400">معلومات المستخدم</p>
          <p v-if="userName">{{ userName }}</p>
          <p v-else class="text-gray-500">غير مسجل</p>
        </div>
        
        <div class="space-y-2">
          <button @click="testNavigation" class="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded text-sm">
            اختبار التنقل
          </button>
          <button @click="reloadApp" class="w-full bg-yellow-600 hover:bg-yellow-700 p-2 rounded text-sm">
            إعادة تحميل
          </button>
          <button @click="clearCache" class="w-full bg-red-600 hover:bg-red-700 p-2 rounded text-sm">
            مسح الذاكرة
          </button>
        </div>
        
        <div class="bg-gray-800 p-2 rounded">
          <p class="text-gray-400 mb-1">سجل الأحداث</p>
          <div class="space-y-1 max-h-32 overflow-y-auto">
            <div v-for="(log, index) in debugLogs" :key="index" class="text-xs p-1 bg-gray-700 rounded">
              {{ log }}
            </div>
          </div>
        </div>
      </div>
    </div>
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
    
    // Development mode check
    const isDevelopment = ref(process.env.NODE_ENV === 'development');
    
    // Toast notification
    const toast = ref({
      show: false,
      message: '',
      type: 'info'
    });
    
    // Debug logs
    const debugLogs = ref([]);
    
    // Add debug log
    const addDebugLog = (message) => {
      if (!isDevelopment.value) return;
      
      const timestamp = new Date().toLocaleTimeString('ar-EG');
      debugLogs.value.unshift(`[${timestamp}] ${message}`);
      
      // Keep only last 10 logs
      if (debugLogs.value.length > 10) {
        debugLogs.value = debugLogs.value.slice(0, 10);
      }
    };
    
    // Show toast
    const showToast = (message, type = 'info', duration = 3000) => {
      toast.value = {
        show: true,
        message,
        type
      };
      
      addDebugLog(`Toast: ${message}`);
      
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
    
    // Check if mobile with debounce
    const checkIfMobile = () => {
      isMobile.value = window.innerWidth < 1024;
      addDebugLog(`Device check: ${isMobile.value ? 'Mobile' : 'Desktop'} (${window.innerWidth}px)`);
    };
    
    // Handle online/offline status
    const updateOnlineStatus = () => {
      const isOnline = navigator.onLine;
      addDebugLog(`Network: ${isOnline ? 'Online' : 'Offline'}`);
      
      if (!isOnline) {
        showToast('أنت غير متصل بالإنترنت', 'warning', 5000);
      } else if (initializing.value === false) {
        showToast('تم استعادة الاتصال بالإنترنت', 'success');
      }
    };
    
    // Test navigation
    const testNavigation = async () => {
      addDebugLog('Testing navigation to /test');
      try {
        await router.push('/test');
        showToast('✅ اختبار التنقل ناجح', 'success');
      } catch (error) {
        addDebugLog(`Navigation test failed: ${error.message}`);
        showToast('❌ فشل اختبار التنقل', 'error');
      }
    };
    
    // Reload app
    const reloadApp = () => {
      addDebugLog('Reloading application');
      showToast('جاري إعادة تحميل التطبيق...', 'info');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    };
    
    // Clear cache
    const clearCache = async () => {
      try {
        // Clear localStorage
        localStorage.clear();
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        // Clear IndexedDB (if used)
        if ('indexedDB' in window) {
          const databases = await window.indexedDB.databases();
          databases.forEach(db => {
            if (db.name) window.indexedDB.deleteDatabase(db.name);
          });
        }
        
        // Clear service worker cache
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
        }
        
        addDebugLog('Cache cleared successfully');
        showToast('✅ تم مسح الذاكرة المؤقتة', 'success');
        
        // Reload after clearing cache
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        
      } catch (error) {
        addDebugLog(`Cache clear failed: ${error.message}`);
        showToast('❌ فشل في مسح الذاكرة المؤقتة', 'error');
      }
    };
    
    // Toggle debug panel
    const toggleDebugPanel = () => {
      showDebugPanel.value = !showDebugPanel.value;
      addDebugLog(`Debug panel ${showDebugPanel.value ? 'opened' : 'closed'}`);
    };
    
    // Handle authentication state changes
    const setupAuthListener = () => {
      const unsubscribe = store.subscribe((mutation, state) => {
        addDebugLog(`Store mutation: ${mutation.type}`);
        
        if (mutation.type === 'SET_AUTH_STATE') {
          const isAuthenticated = state.isAuthenticated;
          const currentRoute = router.currentRoute.value;
          
          addDebugLog(`Auth state changed: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`);
          
          // Handle logout
          if (!isAuthenticated && !currentRoute.meta?.public) {
            addDebugLog('User logged out, redirecting to login');
            router.push('/login');
          }
          
          // Handle login
          if (isAuthenticated && currentRoute.name === 'Login') {
            addDebugLog('User logged in, redirecting to dashboard');
            router.push('/dashboard');
          }
        }
        
        // Handle loading states
        if (mutation.type.includes('LOADING')) {
          addDebugLog(`Loading: ${mutation.payload || mutation.type}`);
        }
        
        // Handle errors
        if (mutation.type.includes('ERROR')) {
          const errorMessage = mutation.payload?.message || 'حدث خطأ غير معروف';
          addDebugLog(`Error: ${errorMessage}`);
          showToast(errorMessage, 'error');
        }
      });
      
      // Store unsubscribe for cleanup
      store.state.unsubscribeAuthListener = unsubscribe;
    };
    
    // Handle route changes
    const setupRouteWatcher = () => {
      watch(
        () => route.path,
        (newPath, oldPath) => {
          addDebugLog(`Route changed: ${oldPath} → ${newPath}`);
          
          // Update page title
          if (route.meta?.title) {
            document.title = `${route.meta.title} - نظام إدارة المخازن`;
          }
          
          // Scroll to top on route change (except for hash links)
          if (!route.hash) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        },
        { immediate: true }
      );
    };
    
    // Handle visibility change (tab switching)
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      addDebugLog(`App ${isVisible ? 'visible' : 'hidden'}`);
      
      if (isVisible) {
        // Refresh data when app becomes visible again
        store.dispatch('refreshData').catch(console.error);
      }
    };
    
    // Handle beforeunload (save state)
    const handleBeforeUnload = (event) => {
      // Save any unsaved data to localStorage
      const unsavedChanges = store.state.unsavedChanges;
      if (unsavedChanges) {
        event.preventDefault();
        event.returnValue = 'لديك تغييرات غير محفوظة. هل تريد المتابعة؟';
        return event.returnValue;
      }
    };
    
    // Lifecycle
    onMounted(async () => {
      addDebugLog('App mounting...');
      
      try {
        // Initialize auth
        addDebugLog('Initializing authentication...');
        await store.dispatch('initializeAuth');
        addDebugLog('Authentication initialized');
        
        // Check if mobile
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        
        // Set up event listeners
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        // Set up auth listener
        setupAuthListener();
        
        // Set up route watcher
        setupRouteWatcher();
        
        // Check initial online status
        updateOnlineStatus();
        
        // Add initial debug info
        addDebugLog(`App initialized - Mobile: ${isMobile.value}, Authenticated: ${store.getters.isAuthenticated}`);
        addDebugLog(`Current route: ${route.path}`);
        
        // Show welcome message if authenticated
        if (store.getters.isAuthenticated) {
          const userName = store.getters.userName;
          if (userName) {
            setTimeout(() => {
              showToast(`مرحباً ${userName}!`, 'success');
            }, 1000);
          }
        }
        
      } catch (error) {
        console.error('App initialization error:', error);
        addDebugLog(`Initialization error: ${error.message}`);
        showToast('حدث خطأ في تحميل النظام', 'error');
      } finally {
        setTimeout(() => {
          initializing.value = false;
          addDebugLog('App initialization complete');
        }, 500);
      }
    });
    
    onUnmounted(() => {
      addDebugLog('App unmounting...');
      
      // Remove event listeners
      window.removeEventListener('resize', checkIfMobile);
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Unsubscribe from store
      if (store.state.unsubscribeAuthListener) {
        store.state.unsubscribeAuthListener();
      }
    });
    
    // Computed properties
    const currentRoutePath = computed(() => route.path);
    const userName = computed(() => store.getters.userName);
    
    return {
      // State
      initializing,
      isMobile,
      showDebugPanel,
      isDevelopment,
      toast,
      debugLogs,
      
      // Computed
      currentRoutePath,
      userName,
      toastClasses,
      
      // Methods
      testNavigation,
      reloadApp,
      clearCache,
      toggleDebugPanel,
      hideToast
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

/* Custom scrollbar */
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
  
  /* Improve scrolling on mobile */
  .overflow-auto,
  .overflow-y-auto {
    -webkit-overflow-scrolling: touch;
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

/* iOS specific fixes */
@supports (-webkit-touch-callout: none) {
  .min-h-screen {
    min-height: -webkit-fill-available;
  }
  
  /* Fix for Safari 100vh bug */
  .h-screen {
    height: -webkit-fill-available;
  }
}

/* Debug panel animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --sky-light: #ffffff;
    --sky-mid: #cccccc;
    --sky-dark: #999999;
  }
}

/* Reduced transparency */
@media (prefers-reduced-transparency: reduce) {
  .bg-white\/90,
  .bg-gray-900\/90,
  .backdrop-blur-lg {
    background-color: rgba(255, 255, 255, 1) !important;
    backdrop-filter: none !important;
  }
  
  .dark .bg-white\/90,
  .dark .bg-gray-900\/90 {
    background-color: rgba(17, 24, 39, 1) !important;
  }
}

/* Mobile orientation warnings */
@media (orientation: portrait) and (max-width: 768px) {
  .orientation-warning {
    display: none; /* You can add orientation warning if needed */
  }
}

@media (orientation: landscape) and (max-height: 500px) {
  /* Adjust layout for landscape mobile */
  .mobile-layout {
    max-height: 100vh;
    overflow-y: auto;
  }
}
</style>