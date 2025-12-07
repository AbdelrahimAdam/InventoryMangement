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
      <MobileLayout v-if="isMobile" />

      <!-- Desktop Layout -->
      <DesktopLayout v-else />
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
    <div class="bg-gray-800 text-white text-xs p-2 rounded-lg opacity-75">
      <div class="grid grid-cols-2 gap-1">
        <span>النظام:</span>
        <span>{{ isMobile ? 'جوال' : 'سطح مكتب' }}</span>
        <span>الحالة:</span>
        <span>{{ isAuthenticated ? 'مسجل' : 'غير مسجل' }}</span>
        <span>المستخدم:</span>
        <span class="truncate max-w-[100px]">{{ userName || '---' }}</span>
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
    
    // Check if mobile
    const checkIfMobile = () => {
      isMobile.value = window.innerWidth < 1024;
      console.log('Device check:', isMobile.value ? 'Mobile' : 'Desktop', window.innerWidth);
    };
    
    // Handle authentication and routing
    const handleAuthAndRouting = () => {
      console.log('Auth state changed:', {
        isAuthenticated: isAuthenticated.value,
        currentRoute: route.path,
        routeName: route.name,
        userProfile: userProfile.value
      });
      
      // If not authenticated and trying to access protected route
      if (!isAuthenticated.value && route.meta?.requiresAuth) {
        console.log('Not authenticated, redirecting to login');
        router.replace('/login');
        return;
      }
      
      // If authenticated and trying to access login page
      if (isAuthenticated.value && route.name === 'Login') {
        console.log('Already authenticated, redirecting to dashboard');
        router.replace('/dashboard');
        return;
      }
      
      // If authenticated but user profile is not loaded yet
      if (isAuthenticated.value && !userProfile.value) {
        console.log('Authenticated but profile not loaded, staying on current page');
        // The profile will load automatically via the auth listener
        return;
      }
      
      // If authenticated and user profile is loaded but inactive
      if (isAuthenticated.value && userProfile.value && userProfile.value.is_active === false) {
        console.log('User account is inactive');
        // The store will handle logout automatically
        return;
      }
      
      console.log('Auth and routing check passed');
    };
    
    // Initialize the app
    const initializeApp = async () => {
      console.log('Starting app initialization...');
      
      try {
        // Check if mobile
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        
        // Initialize authentication via store
        console.log('Initializing auth via store...');
        await store.dispatch('initializeAuth');
        
        console.log('Auth initialization complete', {
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
        
        // Initial check
        setTimeout(() => {
          handleAuthAndRouting();
        }, 100);
        
      } catch (error) {
        console.error('App initialization error:', error);
        showToast('حدث خطأ في تحميل النظام', 'error');
      } finally {
        setTimeout(() => {
          initializing.value = false;
          console.log('App initialization complete');
          
          // Show welcome message if authenticated
          if (isAuthenticated.value && userName.value) {
            showToast(`مرحباً ${userName.value}!`, 'success');
          }
        }, 500);
      }
    };
    
    // Lifecycle
    onMounted(async () => {
      await initializeApp();
    });
    
    onUnmounted(() => {
      window.removeEventListener('resize', checkIfMobile);
    });
    
    return {
      // State
      initializing,
      isMobile,
      toast,
      isDevelopment,
      
      // Computed
      isAuthenticated,
      userName,
      userRole,
      toastClasses,
      
      // Methods
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
</style>