<template>
  <div id="app" dir="rtl" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Global Notifications - Lazy Loaded -->
    <div v-if="showNotifications && notifications.length > 0" 
         class="fixed top-4 left-4 right-4 z-50 space-y-2 max-w-md mx-auto">
      <transition-group name="notification">
        <div 
          v-for="notification in notifications.slice(0, 3)" 
          :key="notification.id"
          :class="[
            'p-4 rounded-lg shadow-lg border transform transition-all duration-300',
            notification.type === 'error' ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200' :
            notification.type === 'success' ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200' :
            notification.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200' :
            'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
          ]"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 v-if="notification.title" class="font-semibold mb-1 text-sm">{{ notification.title }}</h3>
              <p class="text-sm">{{ notification.message }}</p>
            </div>
            <button 
              @click="removeNotification(notification.id)"
              class="mr-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex-shrink-0"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Ultra Minimal Loading Screen -->
    <div v-if="showLoadingScreen" class="fixed inset-0 z-50 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div class="flex flex-col items-center justify-center h-full">
        <!-- Lightweight Loading Indicator -->
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400 font-medium text-sm">جاري التحميل...</p>
      </div>
    </div>

    <!-- Main app content -->
    <div v-else class="h-screen flex flex-col">
      <!-- Check if current route is public -->
      <template v-if="isPublicRoute || isMobileRoute">
        <!-- Public pages - minimal rendering -->
        <router-view />
      </template>

      <!-- Authenticated layout -->
      <template v-else>
        <!-- Mobile Layout -->
        <div v-if="isMobile" class="lg:hidden h-full flex flex-col">
          <!-- Deferred Mobile Header -->
          <MobileHeader v-if="showMobileHeader" @toggle-menu="toggleMobileMenu" />

          <!-- Mobile Sidebar Overlay -->
          <transition name="fade">
            <div 
              v-if="mobileMenuOpen"
              class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              @click="mobileMenuOpen = false"
            ></div>
          </transition>

          <!-- Lazy Load Mobile Sidebar -->
          <transition name="slide">
            <MobileSidebar v-if="mobileMenuOpen" @close="mobileMenuOpen = false" />
          </transition>

          <!-- Main Content -->
          <main class="flex-1 overflow-y-auto">
            <router-view />
          </main>

          <!-- Deferred Mobile Bottom Navigation -->
          <MobileBottomNav v-if="showMobileNav" />
        </div>

        <!-- Desktop Layout -->
        <div v-else class="hidden lg:flex h-full">
          <!-- Deferred Desktop Sidebar -->
          <DesktopSidebar v-if="showDesktopSidebar" :collapsed="sidebarCollapsed" @toggle="toggleSidebar" />

          <!-- Main Content Area -->
          <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Deferred Desktop Header -->
            <DesktopHeader v-if="showDesktopHeader" @toggle-sidebar="toggleSidebar" />

            <!-- Main Content -->
            <main class="flex-1 overflow-y-auto">
              <router-view />
            </main>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default {
  name: 'App',
  components: {
    // Lazy load components for better performance
    MobileHeader: () => import('@/components/layout/MobileHeader.vue'),
    MobileSidebar: () => import('@/components/layout/MobileSidebar.vue'),
    MobileBottomNav: () => import('@/components/layout/MobileBottomNav.vue'),
    DesktopSidebar: () => import('@/components/layout/DesktopSidebar.vue'),
    DesktopHeader: () => import('@/components/layout/DesktopHeader.vue')
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    
    // Ultra lightweight refs
    const showLoadingScreen = ref(true);
    const mobileMenuOpen = ref(false);
    const sidebarCollapsed = ref(false);
    const isMobile = ref(false);
    
    // Deferred component loading flags
    const showNotifications = ref(false);
    const showMobileHeader = ref(false);
    const showMobileNav = ref(false);
    const showDesktopSidebar = ref(false);
    const showDesktopHeader = ref(false);
    
    // Store getters
    const notifications = computed(() => store.state.notifications || []);
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    
    // Computed properties
    const isPublicRoute = computed(() => {
      const publicRoutes = ['Login', 'Unauthorized', 'NotFound'];
      return publicRoutes.includes(route.name);
    });

    const isMobileRoute = computed(() => {
      return route.name === 'MobileLogin' || route.name === 'MobileUnauthorized';
    });

    // Methods
    const removeNotification = (notificationId) => {
      store.commit('REMOVE_NOTIFICATION', notificationId);
    };

    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value;
      localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value.toString());
    };

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;
    };

    // 🔥 ULTRA FAST INITIALIZATION
    const initializeApp = async () => {
      console.time('AppInitialization');
      
      // Step 1: Initialize theme immediately (0ms)
      initializeTheme();
      
      // Step 2: Initialize auth with minimal blocking (50ms max)
      await Promise.race([
        store.dispatch('initializeAuth'),
        new Promise(resolve => setTimeout(resolve, 50))
      ]);
      
      // Step 3: Show authenticated UI immediately
      if (isAuthenticated.value) {
        // Load critical data in background without blocking
        loadCriticalDataInBackground();
        
        // Deferred loading of UI components
        setTimeout(() => {
          showMobileHeader.value = true;
          showMobileNav.value = true;
          showDesktopSidebar.value = true;
          showDesktopHeader.value = true;
          showNotifications.value = true;
        }, 100);
        
        // Welcome message (optional, can be removed)
        if (!localStorage.getItem('welcomeShown')) {
          setTimeout(() => {
            store.dispatch('showNotification', {
              type: 'success',
              message: 'مرحباً بك في نظام المخزون!',
              duration: 2000
            });
            localStorage.setItem('welcomeShown', 'true');
          }, 500);
        }
      }
      
      // Step 4: Hide loading screen quickly
      setTimeout(() => {
        showLoadingScreen.value = false;
        console.timeEnd('AppInitialization');
      }, 300); // Maximum 300ms loading screen
    };

    // 🔥 Load critical data in background
    const loadCriticalDataInBackground = () => {
      // Start loading immediately but don't wait
      setTimeout(async () => {
        try {
          // Load warehouses first (smallest dataset)
          await store.dispatch('loadWarehouses');
          
          // Load minimal inventory data
          await store.dispatch('loadAllInventory', { 
            forceRefresh: false,
            batchSize: 30 // Load only 30 items initially
          });
          
          // Load recent transactions
          await store.dispatch('getRecentTransactions');
          
          console.log('✅ Critical data loaded in background');
          
        } catch (error) {
          console.warn('Background data loading failed:', error.message);
        }
      }, 10); // Start after 10ms
    };

    // 🔥 Optimized theme initialization
    const initializeTheme = () => {
      // Check if theme is saved
      const savedTheme = localStorage.getItem('theme');
      
      // Apply theme immediately without media query
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // Use system preference but don't wait for media query
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.documentElement.classList.add('dark');
        }
      }
      
      // Listen for theme changes (deferred)
      setTimeout(() => {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          if (!localStorage.getItem('theme')) {
            if (e.matches) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
        });
      }, 1000); // Defer this to after initial load
    };

    onMounted(async () => {
      console.time('AppMount');
      
      // Initialize app immediately
      initializeApp();
      
      // Check mobile (non-blocking)
      setTimeout(() => {
        isMobile.value = window.innerWidth < 1024;
        window.addEventListener('resize', checkMobile);
      }, 50);
      
      // Initialize sidebar state (non-blocking)
      setTimeout(() => {
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState !== null) {
          sidebarCollapsed.value = savedState === 'true';
        }
      }, 50);
      
      console.timeEnd('AppMount');
    });

    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile);
    });

    // Close mobile menu when route changes
    watch(() => route.path, () => {
      mobileMenuOpen.value = false;
    });

    // Check mobile on resize (debounced)
    let resizeTimeout;
    const checkMobile = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        isMobile.value = window.innerWidth < 1024;
      }, 100);
    };

    return {
      // Refs
      showLoadingScreen,
      mobileMenuOpen,
      sidebarCollapsed,
      isMobile,
      showNotifications,
      showMobileHeader,
      showMobileNav,
      showDesktopSidebar,
      showDesktopHeader,
      
      // Computed
      isAuthenticated,
      isPublicRoute,
      isMobileRoute,
      notifications,
      
      // Methods
      removeNotification,
      toggleSidebar,
      toggleMobileMenu
    };
  }
};
</script>

<style>
/* Critical CSS - Inline for fastest loading */
#app {
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Mobile sidebar animation */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Fade animation for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Notification animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.25s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Performance optimizations */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Optimize scroll performance */
main {
  -webkit-overflow-scrolling: touch;
  overflow-anchor: none;
}

/* Reduce motion where supported */
@media (prefers-reduced-motion: reduce) {
  .slide-enter-active,
  .slide-leave-active,
  .fade-enter-active,
  .fade-leave-active,
  .notification-enter-active,
  .notification-leave-active {
    transition: none !important;
  }
  
  .notification-enter-from,
  .notification-leave-to {
    transform: none !important;
  }
}

/* Print styles */
@media print {
  #app {
    background: white !important;
  }
  
  .no-print {
    display: none !important;
  }
}

/* Optimize for mobile */
@media (max-width: 640px) {
  #app {
    font-size: 14px;
  }
}

/* Ensure proper stacking context */
.fixed {
  isolation: isolate;
}

/* Dark mode optimizations */
.dark {
  color-scheme: dark;
}
</style>
