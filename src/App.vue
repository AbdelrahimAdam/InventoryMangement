<template>
  <div id="app" dir="rtl" class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-all duration-300">
    <!-- Show loading while initializing -->
    <div v-if="initializing" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400 font-medium">جاري تحميل النظام...</p>
      </div>
    </div>

    <!-- Main app content -->
    <div v-else class="h-screen flex flex-col">
      <!-- Public routes (login, register, etc.) -->
      <template v-if="isPublicRoute">
        <!-- Public pages - full screen without navigation -->
        <div class="flex-1 overflow-y-auto">
          <router-view />
        </div>
      </template>
      
      <!-- Authenticated layout -->
      <template v-else>
        <!-- Mobile Header (only on mobile) -->
        <header v-if="isMobile" class="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
          <div class="px-4 py-3">
            <div class="flex items-center justify-between">
              <!-- Left: Menu button and logo -->
              <div class="flex items-center gap-3">
                <button 
                  @click="toggleMobileMenu"
                  class="p-2 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-gray-800 dark:to-gray-900 hover:from-blue-100 hover:to-blue-200/50 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-200"
                  :aria-label="mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'"
                  :aria-expanded="mobileMenuOpen"
                >
                  <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <router-link 
                  to="/" 
                  class="flex items-center gap-2" 
                  @click="closeAllMenus"
                >
                  <div class="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div class="text-right">
                    <h1 class="text-sm font-bold text-gray-900 dark:text-white">نظام إدارة المخازن</h1>
                    <p class="text-xs text-blue-500 dark:text-blue-400">منوفيا للعطور</p>
                  </div>
                </router-link>
              </div>

              <!-- Right: Dark mode and Notifications -->
              <div class="flex items-center gap-2">
                <button 
                  @click="toggleDarkMode"
                  class="p-2 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-gray-800 dark:to-gray-900 hover:from-blue-100 hover:to-blue-200/50 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-200"
                  :aria-label="isDarkMode ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'"
                >
                  <svg v-if="isDarkMode" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
                  </svg>
                  <svg v-else class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                  </svg>
                </button>

                <button 
                  @click="handleNotifications"
                  class="relative p-2 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-gray-800 dark:to-gray-900 hover:from-blue-100 hover:to-blue-200/50 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-200"
                  aria-label="الإشعارات"
                >
                  <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0.538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                  </svg>
                  <span 
                    v-if="notificationCount > 0" 
                    class="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 font-bold"
                  >
                    {{ notificationCount > 9 ? '9+' : notificationCount }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <!-- Desktop Sidebar (only on desktop) -->
        <aside v-else class="fixed right-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-lg z-40">
          <div class="h-full flex flex-col">
            <!-- Logo -->
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <router-link to="/" class="flex items-center gap-3">
                <div class="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div class="text-right">
                  <h1 class="text-lg font-bold text-gray-900 dark:text-white">نظام إدارة المخازن</h1>
                  <p class="text-sm text-blue-500 dark:text-blue-400">منوفيا للعطور</p>
                </div>
              </router-link>
            </div>

            <!-- User Profile -->
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center">
                <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center ml-3 shadow-md">
                  <span class="text-white font-bold text-sm">
                    {{ getUserInitials(userProfile?.name || userProfile?.email) }}
                  </span>
                </div>
                <div class="text-right flex-1">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ userProfile?.name || userProfile?.email }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ getRoleName(userRole) }}</p>
                </div>
              </div>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
              <router-link 
                to="/" 
                class="flex items-center px-3 py-3 rounded-xl transition-all duration-200 group"
                :class="{
                  'bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50': $route.path === '/',
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/'
                }"
              >
                <div class="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center ml-3">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                </div>
                <span class="text-sm font-medium">لوحة التحكم</span>
              </router-link>

              <router-link 
                to="/inventory" 
                class="flex items-center px-3 py-3 rounded-xl transition-all duration-200 group"
                :class="{
                  'bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50': $route.path === '/inventory',
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/inventory'
                }"
              >
                <div class="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center ml-3">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                </div>
                <span class="text-sm font-medium">المخزون</span>
              </router-link>

              <router-link 
                to="/transactions" 
                class="flex items-center px-3 py-3 rounded-xl transition-all duration-200 group"
                :class="{
                  'bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50': $route.path === '/transactions',
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/transactions'
                }"
              >
                <div class="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center ml-3">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <span class="text-sm font-medium">الحركات</span>
              </router-link>

              <router-link 
                v-if="canManageUsers"
                to="/users" 
                class="flex items-center px-3 py-3 rounded-xl transition-all duration-200 group"
                :class="{
                  'bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50': $route.path === '/users',
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/users'
                }"
              >
                <div class="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center ml-3">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                  </svg>
                </div>
                <span class="text-sm font-medium">المستخدمين</span>
              </router-link>

              <router-link 
                v-if="canManageWarehouses"
                to="/warehouses" 
                class="flex items-center px-3 py-3 rounded-xl transition-all duration-200 group"
                :class="{
                  'bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50': $route.path === '/warehouses',
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/warehouses'
                }"
              >
                <div class="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center ml-3">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <span class="text-sm font-medium">المخازن</span>
              </router-link>

              <router-link 
                to="/profile" 
                class="flex items-center px-3 py-3 rounded-xl transition-all duration-200 group"
                :class="{
                  'bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50': $route.path === '/profile',
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/profile'
                }"
              >
                <div class="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center ml-3">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <span class="text-sm font-medium">الملف الشخصي</span>
              </router-link>
            </nav>

            <!-- Logout Button -->
            <div class="p-4 border-t border-gray-200 dark:border-gray-700">
              <button 
                @click="logout"
                class="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                تسجيل خروج
              </button>
            </div>
          </div>
        </aside>

        <!-- Mobile Menu Overlay -->
        <div 
          v-if="mobileMenuOpen && isMobile" 
          class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300"
          @click="closeAllMenus"
        ></div>

        <!-- Mobile Menu Drawer -->
        <div 
          v-if="mobileMenuOpen && isMobile"
          class="fixed inset-y-0 right-0 z-50 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl transform transition-all duration-300 ease-out"
          :class="mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'"
        >
          <div class="h-full flex flex-col overflow-hidden">
            <!-- User Profile -->
            <div class="p-5 border-b border-gray-200/50 dark:border-gray-700/50">
              <div class="flex items-center">
                <div class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center ml-3 shadow-lg">
                  <span class="text-white font-bold text-base">
                    {{ getUserInitials(userProfile?.name || userProfile?.email) }}
                  </span>
                </div>
                <div class="text-right flex-1">
                  <p class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ userProfile?.name || userProfile?.email }}</p>
                  <p class="text-xs text-blue-500 dark:text-blue-400">{{ getRoleName(userRole) }}</p>
                </div>
              </div>
            </div>

            <!-- Navigation Links -->
            <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
              <router-link 
                to="/" 
                @click="closeAllMenus"
                class="flex items-center px-4 py-3 rounded-xl transition-all duration-200 group"
                :class="{
                  'bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50': $route.path === '/',
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/'
                }"
              >
                <div class="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center ml-3">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                </div>
                <span class="text-sm font-medium">لوحة التحكم</span>
              </router-link>

              <router-link 
                to="/inventory" 
                @click="closeAllMenus"
                class="flex items-center px-4 py-3 rounded-xl transition-all duration-200 group"
                :class="{
                  'bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50': $route.path === '/inventory',
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/inventory'
                }"
              >
                <div class="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center ml-3">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                </div>
                <span class="text-sm font-medium">المخزون</span>
              </router-link>

              <router-link 
                to="/transactions" 
                @click="closeAllMenus"
                class="flex items-center px-4 py-3 rounded-xl transition-all duration-200 group"
                :class="{
                  'bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50': $route.path === '/transactions',
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/transactions'
                }"
              >
                <div class="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center ml-3">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <span class="text-sm font-medium">الحركات</span>
              </router-link>

              <router-link 
                v-if="canManageUsers"
                to="/users" 
                @click="closeAllMenus"
                class="flex items-center px-4 py-3 rounded-xl transition-all duration-200 group"
                :class="{
                  'bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50': $route.path === '/users',
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/users'
                }"
              >
                <div class="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center ml-3">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                  </svg>
                </div>
                <span class="text-sm font-medium">المستخدمين</span>
              </router-link>

              <router-link 
                v-if="canManageWarehouses"
                to="/warehouses" 
                @click="closeAllMenus"
                class="flex items-center px-4 py-3 rounded-xl transition-all duration-200 group"
                :class="{
                  'bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50': $route.path === '/warehouses',
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/warehouses'
                }"
              >
                <div class="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center ml-3">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <span class="text-sm font-medium">المخازن</span>
              </router-link>

              <router-link 
                to="/profile" 
                @click="closeAllMenus"
                class="flex items-center px-4 py-3 rounded-xl transition-all duration-200 group"
                :class="{
                  'bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50': $route.path === '/profile',
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/profile'
                }"
              >
                <div class="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center ml-3">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <span class="text-sm font-medium">الملف الشخصي</span>
              </router-link>
            </nav>

            <!-- Logout Button -->
            <div class="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <button 
                @click="logout"
                class="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                تسجيل خروج
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- Router view with proper spacing -->
          <div 
            class="flex-1 overflow-y-auto"
            :class="{
              'pt-16 lg:pt-0': isAuthenticated,
              'pb-16 lg:pb-0': isMobile
            }"
          >
            <router-view />
          </div>

          <!-- Mobile Bottom Navigation -->
          <nav 
            v-if="isMobile && isAuthenticated && showBottomNav" 
            class="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 shadow-lg"
          >
            <div class="flex justify-around p-2">
              <router-link
                to="/" 
                class="flex flex-col items-center p-2 flex-1 transition-all duration-200 rounded-xl"
                :class="{
                  'text-blue-600 dark:text-blue-400': $route.path === '/',
                  'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400': $route.path !== '/'
                }"
                @click="closeAllMenus"
              >
                <div class="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200"
                  :class="{
                    'bg-gradient-to-br from-blue-500/20 to-blue-500/10 border border-blue-200/50 dark:border-blue-800/50': $route.path === '/',
                    'hover:bg-gray-100/50 dark:hover:bg-gray-800/50': $route.path !== '/'
                  }"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                </div>
                <span class="text-xs font-medium mt-1">الرئيسية</span>
              </router-link>

              <button 
                v-if="canModifyItems"
                @click="openAddItemModal" 
                class="flex flex-col items-center p-2 flex-1 transition-all duration-200 rounded-xl group"
              >
                <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/>
                  </svg>
                </div>
                <span class="text-xs font-medium mt-1 text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400">إضافة</span>
              </button>

              <router-link 
                to="/inventory" 
                class="flex flex-col items-center p-2 flex-1 transition-all duration-200 rounded-xl"
                :class="{
                  'text-blue-600 dark:text-blue-400': $route.path === '/inventory',
                  'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400': $route.path !== '/inventory'
                }"
                @click="closeAllMenus"
              >
                <div class="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200"
                  :class="{
                    'bg-gradient-to-br from-blue-500/20 to-blue-500/10 border border-blue-200/50 dark:border-blue-800/50': $route.path === '/inventory',
                    'hover:bg-gray-100/50 dark:hover:bg-gray-800/50': $route.path !== '/inventory'
                  }"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                </div>
                <span class="text-xs font-medium mt-1">المخزون</span>
              </router-link>

              <router-link 
                to="/transactions" 
                class="flex flex-col items-center p-2 flex-1 transition-all duration-200 rounded-xl"
                :class="{
                  'text-blue-600 dark:text-blue-400': $route.path === '/transactions',
                  'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400': $route.path !== '/transactions'
                }"
                @click="closeAllMenus"
              >
                <div class="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200"
                  :class="{
                    'bg-gradient-to-br from-blue-500/20 to-blue-500/10 border border-blue-200/50 dark:border-blue-800/50': $route.path === '/transactions',
                    'hover:bg-gray-100/50 dark:hover:bg-gray-800/50': $route.path !== '/transactions'
                  }"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <span class="text-xs font-medium mt-1">الحركات</span>
              </router-link>
            </div>
          </nav>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'App',
  
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    
    // State
    const initializing = ref(true);
    const mobileMenuOpen = ref(false);
    const isDarkMode = ref(false);
    const isMobile = ref(false);
    
    // Computed
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const userRole = computed(() => store.getters.userRole);
    const userProfile = computed(() => store.state.userProfile);
    const notificationCount = computed(() => store.getters.dashboardStats?.lowStockItems || 0);
    
    const isPublicRoute = computed(() => {
      const publicRoutes = ['Login', 'Register', 'Unauthorized', 'NotFound'];
      return publicRoutes.includes(route.name);
    });
    
    const showBottomNav = computed(() => {
      const hideBottomNavRoutes = ['/login', '/register', '/unauthorized', '/notfound'];
      return !hideBottomNavRoutes.includes(route.path) && isAuthenticated.value;
    });
    
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
    
    const canManageUsers = computed(() => store.getters.canManageUsers);
    const canManageWarehouses = computed(() => store.getters.canManageWarehouses);
    
    // Methods
    const getRoleName = (role) => {
      const names = {
        superadmin: 'المشرف العام',
        warehouse_manager: 'مدير المخازن',
        company_manager: 'مدير الشركة'
      };
      return names[role] || role;
    };
    
    const getUserInitials = (name) => {
      if (!name) return 'مخ';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
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
    };
    
    const closeAllMenus = () => {
      mobileMenuOpen.value = false;
    };
    
    const handleNotifications = () => {
      router.push('/transactions');
    };
    
    const openAddItemModal = () => {
      window.dispatchEvent(new CustomEvent('open-add-item-modal'));
    };
    
    const logout = async () => {
      try {
        closeAllMenus();
        await store.dispatch('logout');
        router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
        router.push('/login');
      }
    };
    
    // Check if mobile
    const checkIfMobile = () => {
      isMobile.value = window.innerWidth < 1024;
    };
    
    // Lifecycle
    onMounted(async () => {
      try {
        // Initialize auth
        await store.dispatch('initializeAuth');
        
        // Initialize dark mode
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
          isDarkMode.value = true;
          document.documentElement.classList.add('dark');
        }
        
        // Check if mobile
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setTimeout(() => {
          initializing.value = false;
        }, 500);
      }
    });
    
    watch(() => route.path, () => {
      closeAllMenus();
    });
    
    return {
      // State
      initializing,
      mobileMenuOpen,
      isDarkMode,
      isMobile,
      
      // Computed
      isAuthenticated,
      isPublicRoute,
      showBottomNav,
      userRole,
      userProfile,
      notificationCount,
      canModifyItems,
      canManageUsers,
      canManageWarehouses,
      
      // Methods
      getRoleName,
      getUserInitials,
      toggleDarkMode,
      toggleMobileMenu,
      closeAllMenus,
      handleNotifications,
      openAddItemModal,
      logout
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
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
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
</style>