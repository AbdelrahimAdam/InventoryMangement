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
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
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
    
    const initializing = ref(true);
    const isMobile = ref(false);
    
    // Check if mobile
    const checkIfMobile = () => {
      isMobile.value = window.innerWidth < 1024;
    };
    
    // Lifecycle
    onMounted(async () => {
      try {
        // Initialize auth
        await store.dispatch('initializeAuth');
        
        // Check if mobile
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        
        // Set up auth state listener
        const unsubscribe = store.subscribe((mutation, state) => {
          if (mutation.type === 'SET_AUTH_STATE') {
            if (!state.isAuthenticated && !router.currentRoute.value.meta?.public) {
              router.push('/login');
            }
          }
        });
        
        // Store unsubscribe for cleanup
        store.state.unsubscribeAuthListener = unsubscribe;
        
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setTimeout(() => {
          initializing.value = false;
        }, 500);
      }
    });
    
    onUnmounted(() => {
      window.removeEventListener('resize', checkIfMobile);
      if (store.state.unsubscribeAuthListener) {
        store.state.unsubscribeAuthListener();
      }
    });
    
    return {
      initializing,
      isMobile
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
</style>