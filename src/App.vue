<template>
  <div id="app" dir="rtl" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Show loading while initializing -->
    <div v-if="initializing" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">جاري التحميل...</p>
      </div>
    </div>

    <!-- Main app content -->
    <div v-else class="flex flex-col min-h-screen">
      <!-- If user is authenticated, show the authenticated layout -->
      <template v-if="isAuthenticated">
        <!-- Fixed Header for Mobile -->
        <div class="lg:hidden fixed top-0 left-0 right-0 z-50">
          <header class="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
            <div class="px-4 py-3">
              <div class="flex items-center justify-between">
                <!-- Left: Menu button and logo -->
                <div class="flex items-center space-x-3 space-x-reverse">
                  <button 
                    @click="toggleMobileMenu"
                    class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <router-link to="/" class="flex items-center space-x-2 space-x-reverse">
                    <div class="h-8 w-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                      <span class="text-white font-bold text-sm">م</span>
                    </div>
                    <div>
                      <h1 class="text-sm font-bold text-gray-900 dark:text-white">نظام المخزون</h1>
                      <p class="text-xs text-gray-500 dark:text-gray-400">مونوفيا</p>
                    </div>
                  </router-link>
                </div>

                <!-- Right: Dark mode and Notifications -->
                <div class="flex items-center space-x-2 space-x-reverse">
                  <button 
                    @click="toggleDarkMode"
                    class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <svg v-if="isDarkMode" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
                    </svg>
                    <svg v-else class="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                    </svg>
                  </button>

                  <button 
                    class="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                    <span v-if="notificationCount > 0" class="absolute -top-1 -left-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {{ notificationCount > 9 ? '9+' : notificationCount }}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Mobile Menu Dropdown -->
            <div v-if="mobileMenuOpen" class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
              <div class="px-4 py-3 space-y-2">
                <router-link 
                  to="/" 
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200"
                  :class="{'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/', 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/'}"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                  لوحة التحكم
                </router-link>

                <router-link 
                  v-if="canManageUsers"
                  to="/users" 
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200"
                  :class="{'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/users', 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/users'}"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  إدارة المستخدمين
                </router-link>

                <router-link 
                  to="/transactions" 
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200"
                  :class="{'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/transactions', 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/transactions'}"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  سجل الحركات
                </router-link>

                <router-link 
                  v-if="canViewReports"
                  to="/reports" 
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200"
                  :class="{'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/reports', 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/reports'}"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                  التقارير
                </router-link>

                <button 
                  @click="logout"
                  class="w-full flex items-center px-3 py-3 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  تسجيل خروج
                </button>
              </div>
            </div>
          </header>
        </div>

        <!-- Main Content Area -->
        <main class="flex-1 flex flex-col overflow-hidden" :class="{'pt-16 lg:pt-0': isAuthenticated}">
          <!-- Router view with proper scrolling -->
          <div class="flex-1 overflow-hidden">
            <router-view />
          </div>
        </main>

        <!-- Fixed Bottom Navigation for Mobile -->
        <div class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe">
          <div class="flex justify-around p-2">
            <router-link 
              to="/" 
              class="flex flex-col items-center p-2 flex-1"
              :class="{'text-yellow-600 dark:text-yellow-400': $route.path === '/'}"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              <span class="text-xs mt-1">الرئيسية</span>
            </router-link>

            <button 
              v-if="canModifyItems"
              @click="openAddItemModal" 
              class="flex flex-col items-center p-2 flex-1 text-yellow-600 dark:text-yellow-400"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span class="text-xs mt-1">إضافة</span>
            </button>

            <router-link 
              v-if="canManageUsers"
              to="/users" 
              class="flex flex-col items-center p-2 flex-1"
              :class="{'text-yellow-600 dark:text-yellow-400': $route.path === '/users'}"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span class="text-xs mt-1">المستخدمين</span>
            </router-link>

            <button 
              @click="toggleProfileMenu" 
              class="flex flex-col items-center p-2 flex-1"
              :class="{'text-yellow-600 dark:text-yellow-400': profileMenuOpen}"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span class="text-xs mt-1">حسابي</span>
            </button>
          </div>
        </div>
      </template>
      
      <!-- If not authenticated, show public pages (login, etc.) -->
      <template v-else>
        <router-view />
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const store = useStore();
    const route = useRoute();
    
    const initializing = ref(true);
    const mobileMenuOpen = ref(false);
    const profileMenuOpen = ref(false);
    const isDarkMode = ref(false);
    const notificationCount = ref(3); // Example count

    // Check authentication status
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    
    // Get user info for permissions
    const userRole = computed(() => store.getters.userRole);
    const userProfile = computed(() => store.state.userProfile);
    
    // Permissions
    const canModifyItems = computed(() => {
      const role = userRole.value;
      const profile = userProfile.value;
      
      if (role === 'superadmin') return true;
      
      if (role === 'warehouse_manager') {
        const hasWarehouses = profile?.allowed_warehouses?.length > 0;
        const hasPermission = profile?.permissions?.includes('full_access') || 
                              profile?.permissions?.includes('manage_inventory');
        return hasWarehouses && hasPermission;
      }
      
      return false;
    });
    
    const canManageUsers = computed(() => userRole.value === 'superadmin');
    const canViewReports = computed(() => ['superadmin', 'company_manager'].includes(userRole.value));

    // Initialize dark mode
    const initializeDarkMode = () => {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        isDarkMode.value = true;
        document.documentElement.classList.add('dark');
      } else {
        isDarkMode.value = false;
        document.documentElement.classList.remove('dark');
      }
    };

    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
      if (isDarkMode.value) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    };

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;
      if (profileMenuOpen.value) profileMenuOpen.value = false;
    };

    const toggleProfileMenu = () => {
      profileMenuOpen.value = !profileMenuOpen.value;
      if (mobileMenuOpen.value) mobileMenuOpen.value = false;
    };

    const openAddItemModal = () => {
      // This will be handled by the Dashboard component
      // Emit an event or use a global event bus
      window.dispatchEvent(new CustomEvent('open-add-item-modal'));
    };

    const logout = async () => {
      try {
        await store.dispatch('logout');
        mobileMenuOpen.value = false;
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    onMounted(async () => {
      try {
        await store.dispatch('initializeAuth');
        await store.dispatch('loadWarehouses');
        
        // Initialize dark mode
        initializeDarkMode();
        
        // Listen for dark mode changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          if (!localStorage.getItem('theme')) {
            if (e.matches) {
              document.documentElement.classList.add('dark');
              isDarkMode.value = true;
            } else {
              document.documentElement.classList.remove('dark');
              isDarkMode.value = false;
            }
          }
        });
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        // Small delay to ensure smooth transition
        setTimeout(() => {
          initializing.value = false;
        }, 300);
      }
    });

    // Close mobile menu when route changes
    watch(() => route.path, () => {
      mobileMenuOpen.value = false;
      profileMenuOpen.value = false;
    });

    return {
      initializing,
      isAuthenticated,
      mobileMenuOpen,
      profileMenuOpen,
      isDarkMode,
      notificationCount,
      canModifyItems,
      canManageUsers,
      canViewReports,
      toggleDarkMode,
      toggleMobileMenu,
      toggleProfileMenu,
      openAddItemModal,
      logout
    };
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap');

* {
  font-family: 'Tajawal', Arial, sans-serif;
  box-sizing: border-box;
}

/* Reset and base styles */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Safe area padding for mobile navigation */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}

/* Fix for iOS Safari 100vh issue */
@supports (-webkit-touch-callout: none) {
  .min-h-screen {
    min-height: -webkit-fill-available;
  }
}

/* Improved scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Mobile navigation item styles */
.fixed.bottom-0 a,
.fixed.bottom-0 button {
  transition: all 0.2s ease;
}

.fixed.bottom-0 a.router-link-active,
.fixed.bottom-0 button.active {
  color: #f59e0b;
}

/* Loading animations */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Form improvements for mobile */
input, textarea, select {
  font-size: 16px !important;
}

/* Better focus styles */
:focus-visible {
  outline: 2px solid #f59e0b;
  outline-offset: 2px;
}

/* Utility classes */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>