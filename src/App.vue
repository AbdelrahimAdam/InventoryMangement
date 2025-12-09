<template>
  <div id="app" dir="rtl" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Global Notifications -->
    <div v-if="notifications.length > 0" class="fixed top-4 left-4 right-4 z-50 space-y-2 max-w-md mx-auto">
      <transition-group name="notification">
        <div 
          v-for="notification in notifications.slice(0, 3)" 
          :key="notification.id"
          :class="[
            'p-4 rounded-lg shadow-lg border transform transition-all duration-300',
            notification.type === 'error' ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 shadow-red-200/20 dark:shadow-red-900/20' :
            notification.type === 'success' ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 shadow-green-200/20 dark:shadow-green-900/20' :
            notification.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 shadow-yellow-200/20 dark:shadow-yellow-900/20' :
            'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 shadow-blue-200/20 dark:shadow-blue-900/20'
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

    <!-- Show loading while initializing -->
    <div v-if="initializing" class="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">جاري التحميل...</p>
      </div>
    </div>

    <!-- Main app content -->
    <div v-else class="h-screen flex flex-col">
      <!-- Check if current route is public (login, unauthorized, notfound) -->
      <template v-if="isPublicRoute">
        <!-- Public pages - show only router view -->
        <div class="flex-1 overflow-y-auto">
          <router-view />
        </div>
      </template>

      <!-- Authenticated layout -->
      <template v-else>
        <!-- Mobile Layout -->
        <div v-if="isMobile" class="lg:hidden h-full flex flex-col">
          <!-- Mobile Header -->
          <MobileHeader @toggle-menu="toggleMobileMenu" />
          
          <!-- Mobile Sidebar Overlay -->
          <transition name="fade">
            <div 
              v-if="mobileMenuOpen"
              class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              @click="mobileMenuOpen = false"
            ></div>
          </transition>

          <!-- Mobile Sidebar -->
          <transition name="slide">
            <MobileSidebar v-if="mobileMenuOpen" @close="mobileMenuOpen = false" />
          </transition>

          <!-- Mobile Main Content -->
          <main class="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div class="max-w-full mx-auto">
              <router-view />
            </div>
          </main>

          <!-- Mobile Bottom Navigation -->
          <MobileBottomNav />
        </div>

        <!-- Desktop Layout -->
        <div v-else class="hidden lg:flex h-full">
          <!-- Desktop Sidebar -->
          <DesktopSidebar :collapsed="sidebarCollapsed" @toggle="toggleSidebar" />
          
          <!-- Main Content Area -->
          <div class="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
            <!-- Desktop Header -->
            <DesktopHeader @toggle-sidebar="toggleSidebar" />
            
            <!-- Main Content -->
            <main class="flex-1 overflow-y-auto p-4">
              <div class="max-w-full mx-auto">
                <router-view />
              </div>
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
import MobileHeader from '@/components/layout/MobileHeader.vue';
import MobileSidebar from '@/components/layout/MobileSidebar.vue';
import MobileBottomNav from '@/components/layout/MobileBottomNav.vue';
import DesktopSidebar from '@/components/layout/DesktopSidebar.vue';
import DesktopHeader from '@/components/layout/DesktopHeader.vue';

export default {
  name: 'App',
  components: {
    MobileHeader,
    MobileSidebar,
    MobileBottomNav,
    DesktopSidebar,
    DesktopHeader
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    
    // Refs
    const initializing = ref(true);
    const mobileMenuOpen = ref(false);
    const sidebarCollapsed = ref(false);
    const isMobile = ref(false);
    
    // Store getters - direct access without watchers
    const notifications = computed(() => store.state.notifications || []);
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    
    // Computed properties
    const isPublicRoute = computed(() => {
      const publicRoutes = ['Login', 'Unauthorized', 'NotFound'];
      return publicRoutes.includes(route.name);
    });

    // Check mobile on mount and resize
    const checkMobile = () => {
      isMobile.value = window.innerWidth < 1024;
    };

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

    onMounted(async () => {
      try {
        // Check mobile first
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        await store.dispatch('initializeAuth');
        
        if (isAuthenticated.value) {
          // Show only one welcome notification
          if (!localStorage.getItem('welcomeShown')) {
            store.dispatch('showNotification', {
              type: 'success',
              message: 'مرحباً بك في نظام المخزون!'
            });
            localStorage.setItem('welcomeShown', 'true');
          }
        }
        
        // Initialize dark mode
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        // Initialize sidebar state
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState !== null) {
          sidebarCollapsed.value = savedState === 'true';
        }

      } catch (error) {
        console.error('App initialization error:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تحميل النظام'
        });
      } finally {
        setTimeout(() => {
          initializing.value = false;
        }, 300);
      }
    });

    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile);
    });

    // Close mobile menu when route changes
    watch(() => route.path, () => {
      mobileMenuOpen.value = false;
    });

    // Provide data to child components
    return {
      // Refs
      initializing,
      mobileMenuOpen,
      sidebarCollapsed,
      isMobile,
      
      // Computed
      isAuthenticated,
      isPublicRoute,
      notifications,
      
      // Methods
      removeNotification,
      toggleSidebar,
      toggleMobileMenu
    };
  }
};
</script>

<style scoped>
/* Mobile sidebar animation */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Fade animation for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Notification animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>