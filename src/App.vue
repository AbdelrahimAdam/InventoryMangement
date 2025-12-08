<template>
  <div id="app" dir="rtl" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Global Notifications - Fixed to show only one welcome notification -->
    <div v-if="notifications.length > 0" class="fixed top-4 left-4 right-4 z-50 space-y-2 max-w-md mx-auto">
      <transition-group name="notification">
        <div 
          v-for="notification in notifications.slice(0, 3)" 
          :key="notification.id"
          :class="[
            'p-4 rounded-lg shadow-lg border transform transition-all duration-300',
            notification.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200' :
            notification.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200' :
            notification.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200' :
            'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
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
        <!-- ============================================== -->
        <!-- MOBILE ONLY LAYOUT -->
        <!-- ============================================== -->
        <div class="lg:hidden h-full flex flex-col">
          <!-- Mobile Header (Fixed at top) -->
          <header class="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div class="px-4 py-3">
              <div class="flex items-center justify-between">
                <!-- Left: Menu button -->
                <button 
                  @click="mobileMenuOpen = !mobileMenuOpen"
                  class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="القائمة"
                >
                  <svg class="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <!-- Center: Page title -->
                <div class="flex-1 text-center px-2">
                  <h1 class="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {{ getPageTitle() }}
                  </h1>
                  <p v-if="currentWarehouseName" class="text-xs text-yellow-500 dark:text-yellow-400 truncate">
                    {{ currentWarehouseName }}
                  </p>
                </div>

                <!-- Right: Actions -->
                <div class="flex items-center space-x-2 space-x-reverse">
                  <button 
                    @click="toggleDarkMode"
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg v-if="isDarkMode" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
                    </svg>
                    <svg v-else class="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                    </svg>
                  </button>

                  <button 
                    @click="showNotifications"
                    class="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                    <span v-if="realNotificationCount > 0" class="absolute -top-1 -left-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {{ realNotificationCount > 9 ? '9+' : realNotificationCount }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          <!-- Mobile Sidebar Overlay -->
          <transition name="fade">
            <div 
              v-if="mobileMenuOpen"
              class="fixed inset-0 bg-black bg-opacity-50 z-40"
              @click="mobileMenuOpen = false"
            ></div>
          </transition>

          <!-- Mobile Sidebar -->
          <transition name="slide">
            <aside 
              v-if="mobileMenuOpen"
              class="fixed top-0 right-0 z-50 h-full w-4/5 max-w-sm bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto"
            >
              <!-- Sidebar Header -->
              <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center space-x-3 space-x-reverse">
                    <div class="h-10 w-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                      <span class="text-white font-bold text-sm">م</span>
                    </div>
                    <div>
                      <h1 class="text-base font-bold text-gray-900 dark:text-white">نظام المخزون</h1>
                      <p class="text-xs text-gray-500 dark:text-gray-400">البران للعطور</p>
                    </div>
                  </div>
                  <button 
                    @click="mobileMenuOpen = false"
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- User Info -->
                <div class="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <div class="h-9 w-9 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center shadow-sm ml-3">
                    <span class="text-white font-medium text-xs">
                      {{ getUserInitials() }}
                    </span>
                  </div>
                  <div class="text-right flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ userName }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {{ roleName }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Navigation Links -->
              <div class="p-4 space-y-1">
                <!-- Dashboard Link -->
                <router-link 
                  to="/" 
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-4 py-3 rounded-xl text-sm font-medium"
                  :class="{'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/', 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/'}"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                  لوحة التحكم
                </router-link>

                <!-- Warehouse Management (Superadmin only) -->
                <router-link 
                  v-if="canManageWarehouses"
                  to="/warehouses" 
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-4 py-3 rounded-xl text-sm font-medium"
                  :class="{'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/warehouses', 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/warehouses'}"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  إدارة المخازن
                </router-link>

                <!-- User Management (Superadmin only) -->
                <router-link 
                  v-if="canManageUsers"
                  to="/users" 
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-4 py-3 rounded-xl text-sm font-medium"
                  :class="{'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/users', 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/users'}"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  إدارة المستخدمين
                </router-link>

                <!-- Inventory Link -->
                <router-link 
                  to="/inventory" 
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-4 py-3 rounded-xl text-sm font-medium"
                  :class="{'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path.includes('/inventory'), 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': !$route.path.includes('/inventory')}"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                  </svg>
                  الأصناف
                </router-link>

                <!-- Transactions Link -->
                <router-link 
                  to="/transactions" 
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-4 py-3 rounded-xl text-sm font-medium"
                  :class="{'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/transactions', 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/transactions'}"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  سجل الحركات
                </router-link>

                <!-- Reports Link -->
                <router-link 
                  v-if="canViewReports"
                  to="/reports" 
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-4 py-3 rounded-xl text-sm font-medium"
                  :class="{'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/reports', 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/reports'}"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                  التقارير
                </router-link>

                <!-- Profile Link -->
                <router-link 
                  to="/profile" 
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-4 py-3 rounded-xl text-sm font-medium"
                  :class="{'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/profile', 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/profile'}"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  إعدادات الحساب
                </router-link>

                <!-- Quick Actions Section -->
                <div v-if="canModifyItems" class="mt-4 mb-2">
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                    إجراءات سريعة
                  </p>
                  <div class="space-y-2">
                    <!-- Add Item Button -->
                    <button 
                      @click="openAddItemModal"
                      class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    >
                      <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      إضافة صنف جديد
                    </button>

                    <!-- Transfer Button -->
                    <button 
                      @click="openTransferModal"
                      class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-yellow-500 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    >
                      <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                      </svg>
                      نقل بين المخازن
                    </button>

                    <!-- Dispatch Button -->
                    <button 
                      @click="openDispatchModal"
                      class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-yellow-500 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    >
                      <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      صرف خارجي
                    </button>
                  </div>
                </div>

                <!-- Logout Button -->
                <button 
                  @click="logout"
                  class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 mt-2"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  تسجيل خروج
                </button>
              </div>
            </aside>
          </transition>

          <!-- Mobile Main Content -->
          <main class="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <router-view />
          </main>

          <!-- Mobile Bottom Navigation -->
          <div 
            ref="bottomNav"
            :class="[
              'fixed bottom-0 left-0 right-0 z-40 pb-safe transition-transform duration-300',
              bottomNavHidden ? 'translate-y-full' : 'translate-y-0'
            ]"
          >
            <!-- Glassmorphism Background with Shadow -->
            <div class="relative">
              <!-- Blurred Background -->
              <div class="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50"></div>
              
              <!-- Shadow Effect -->
              <div class="absolute inset-0 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.3)]"></div>
              
              <!-- Navigation Items -->
              <div class="relative grid grid-cols-5 gap-1 p-2">
                <!-- Home -->
                <router-link 
                  to="/" 
                  class="flex flex-col items-center p-2 rounded-xl transition-all duration-200"
                  :class="{
                    'text-yellow-600 dark:text-yellow-400 bg-white/50 dark:bg-gray-800/50 shadow-sm': $route.path === '/', 
                    'text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-gray-700/30': $route.path !== '/'
                  }"
                >
                  <div class="relative">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                    <div v-if="$route.path === '/'" class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-500 dark:bg-yellow-400 rounded-full"></div>
                  </div>
                  <span class="text-xs mt-1 font-medium">الرئيسية</span>
                </router-link>

                <!-- Inventory -->
                <router-link 
                  to="/inventory" 
                  class="flex flex-col items-center p-2 rounded-xl transition-all duration-200"
                  :class="{
                    'text-yellow-600 dark:text-yellow-400 bg-white/50 dark:bg-gray-800/50 shadow-sm': $route.path.includes('/inventory'), 
                    'text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-gray-700/30': !$route.path.includes('/inventory')
                  }"
                >
                  <div class="relative">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                    </svg>
                    <div v-if="$route.path.includes('/inventory')" class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-500 dark:bg-yellow-400 rounded-full"></div>
                  </div>
                  <span class="text-xs mt-1 font-medium">الأصناف</span>
                </router-link>

                <!-- Transactions -->
                <router-link 
                  to="/transactions" 
                  class="flex flex-col items-center p-2 rounded-xl transition-all duration-200"
                  :class="{
                    'text-yellow-600 dark:text-yellow-400 bg-white/50 dark:bg-gray-800/50 shadow-sm': $route.path === '/transactions', 
                    'text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-gray-700/30': $route.path !== '/transactions'
                  }"
                >
                  <div class="relative">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    <div v-if="$route.path === '/transactions'" class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-500 dark:bg-yellow-400 rounded-full"></div>
                  </div>
                  <span class="text-xs mt-1 font-medium">الحركات</span>
                </router-link>

                <!-- Quick Add -->
                <button 
                  v-if="canModifyItems"
                  @click="openAddItemModal" 
                  class="flex flex-col items-center p-2 rounded-xl transition-all duration-200 group"
                >
                  <div class="relative">
                    <!-- Outer Glow Effect -->
                    <div class="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-md opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    
                    <!-- Main Button -->
                    <div class="relative h-12 w-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 transform group-hover:scale-105 active:scale-95">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      
                      <!-- Inner Glow -->
                      <div class="absolute inset-0 rounded-full border-2 border-white/20"></div>
                    </div>
                    
                    <!-- Pulsing Animation -->
                    <div class="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 animate-ping opacity-20"></div>
                  </div>
                  <span class="text-xs mt-1 font-medium text-gray-700 dark:text-gray-300">إضافة</span>
                </button>
                <div v-else class="p-2"></div>

                <!-- Settings -->
                <button 
                  @click="toggleProfileMenu" 
                  class="flex flex-col items-center p-2 rounded-xl transition-all duration-200"
                  :class="{
                    'text-yellow-600 dark:text-yellow-400 bg-white/50 dark:bg-gray-800/50 shadow-sm': profileMenuOpen, 
                    'text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-gray-700/30': !profileMenuOpen
                  }"
                >
                  <div class="relative">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <div v-if="profileMenuOpen" class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-500 dark:bg-yellow-400 rounded-full"></div>
                  </div>
                  <span class="text-xs mt-1 font-medium">الإعدادات</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- ============================================== -->
        <!-- END MOBILE ONLY LAYOUT -->
        <!-- ============================================== -->

        <!-- ============================================== -->
        <!-- DESKTOP LAYOUT -->
        <!-- ============================================== -->
        <div class="hidden lg:flex h-full">
          <!-- Desktop Sidebar -->
          <aside :class="[
            'bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300',
            sidebarCollapsed ? 'w-20' : 'w-64'
          ]">
            <!-- Sidebar Header -->
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center space-x-3 space-x-reverse" :class="{'justify-center': sidebarCollapsed}">
                <div class="h-12 w-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span class="text-white font-bold text-lg">م</span>
                </div>
                <div v-if="!sidebarCollapsed" class="min-w-0 flex-1">
                  <h1 class="text-xl font-bold text-gray-900 dark:text-white truncate">نظام المخزون</h1>
                  <p class="text-sm text-gray-500 dark:text-gray-400 truncate">البران للعطور</p>
                </div>
              </div>
            </div>

            <!-- User Profile -->
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center" :class="{'justify-center': sidebarCollapsed}">
                <div class="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center shadow-sm" :class="{'ml-3': !sidebarCollapsed}">
                  <span class="text-white font-medium text-sm">
                    {{ getUserInitials() }}
                  </span>
                </div>
                <div v-if="!sidebarCollapsed" class="text-right flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ userName }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ roleName }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Collapse Button -->
            <div class="p-2 border-b border-gray-200 dark:border-gray-700">
              <button 
                @click="toggleSidebar"
                class="w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform" 
                     :class="{'rotate-180': sidebarCollapsed}" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span v-if="!sidebarCollapsed" class="mr-2 text-sm text-gray-500 dark:text-gray-400">طي</span>
              </button>
            </div>

            <!-- Navigation Links -->
            <div class="flex-1 p-4 space-y-1 overflow-y-auto">
              <!-- Dashboard Link -->
              <router-link 
                to="/" 
                class="flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
                :class="{
                  'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/', 
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': $route.path !== '/',
                  'justify-center': sidebarCollapsed
                }"
                :title="sidebarCollapsed ? 'لوحة التحكم' : ''"
              >
                <svg class="w-5 h-5" :class="{'ml-3': !sidebarCollapsed}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <span v-if="!sidebarCollapsed" class="mr-2">لوحة التحكم</span>
              </router-link>

              <!-- Warehouse Management (Superadmin only) -->
              <router-link 
                v-if="canManageWarehouses"
                to="/warehouses" 
                class="flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
                :class="{
                  'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/warehouses', 
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': $route.path !== '/warehouses',
                  'justify-center': sidebarCollapsed
                }"
                :title="sidebarCollapsed ? 'إدارة المخازن' : ''"
              >
                <svg class="w-5 h-5" :class="{'ml-3': !sidebarCollapsed}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                <span v-if="!sidebarCollapsed" class="mr-2">إدارة المخازن</span>
              </router-link>

              <!-- User Management (Superadmin only) -->
              <router-link 
                v-if="canManageUsers"
                to="/users" 
                class="flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
                :class="{
                  'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/users', 
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': $route.path !== '/users',
                  'justify-center': sidebarCollapsed
                }"
                :title="sidebarCollapsed ? 'إدارة المستخدمين' : ''"
              >
                <svg class="w-5 h-5" :class="{'ml-3': !sidebarCollapsed}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span v-if="!sidebarCollapsed" class="mr-2">إدارة المستخدمين</span>
              </router-link>

              <!-- Inventory Link -->
              <router-link 
                to="/inventory" 
                class="flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
                :class="{
                  'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path.includes('/inventory'), 
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': !$route.path.includes('/inventory'),
                  'justify-center': sidebarCollapsed
                }"
                :title="sidebarCollapsed ? 'الأصناف' : ''"
              >
                <svg class="w-5 h-5" :class="{'ml-3': !sidebarCollapsed}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
                <span v-if="!sidebarCollapsed" class="mr-2">الأصناف</span>
              </router-link>

              <!-- Transactions Link -->
              <router-link 
                to="/transactions" 
                class="flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
                :class="{
                  'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/transactions', 
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': $route.path !== '/transactions',
                  'justify-center': sidebarCollapsed
                }"
                :title="sidebarCollapsed ? 'سجل الحركات' : ''"
              >
                <svg class="w-5 h-5" :class="{'ml-3': !sidebarCollapsed}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <span v-if="!sidebarCollapsed" class="mr-2">سجل الحركات</span>
              </router-link>

              <!-- Reports Link -->
              <router-link 
                v-if="canViewReports"
                to="/reports" 
                class="flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
                :class="{
                  'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/reports', 
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': $route.path !== '/reports',
                  'justify-center': sidebarCollapsed
                }"
                :title="sidebarCollapsed ? 'التقارير' : ''"
              >
                <svg class="w-5 h-5" :class="{'ml-3': !sidebarCollapsed}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                <span v-if="!sidebarCollapsed" class="mr-2">التقارير</span>
              </router-link>

              <!-- Profile Link -->
              <router-link 
                to="/profile" 
                class="flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
                :class="{
                  'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/profile', 
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': $route.path !== '/profile',
                  'justify-center': sidebarCollapsed
                }"
                :title="sidebarCollapsed ? 'إعدادات الحساب' : ''"
              >
                <svg class="w-5 h-5" :class="{'ml-3': !sidebarCollapsed}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span v-if="!sidebarCollapsed" class="mr-2">إعدادات الحساب</span>
              </router-link>

              <!-- Quick Actions Section -->
              <div v-if="canModifyItems && !sidebarCollapsed" class="mt-6 mb-4">
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                  إجراءات سريعة
                </p>
                <div class="space-y-2">
                  <!-- Add Item Button -->
                  <button 
                    @click="openAddItemModal"
                    class="w-full flex items-center px-3 py-3 rounded-xl text-sm font-medium text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                  >
                    <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    <span class="mr-2">إضافة صنف</span>
                  </button>

                  <!-- Transfer Button -->
                  <button 
                    @click="openTransferModal"
                    class="w-full flex items-center px-3 py-3 rounded-xl text-sm font-medium text-yellow-500 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                  >
                    <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                    </svg>
                    <span class="mr-2">نقل</span>
                  </button>

                  <!-- Dispatch Button -->
                  <button 
                    @click="openDispatchModal"
                    class="w-full flex items-center px-3 py-3 rounded-xl text-sm font-medium text-yellow-500 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                  >
                    <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    <span class="mr-2">صرف</span>
                  </button>
                </div>
              </div>

              <!-- Logout Button -->
              <button 
                @click="logout"
                class="w-full flex items-center px-3 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-4"
                :class="{'justify-center': sidebarCollapsed}"
                :title="sidebarCollapsed ? 'تسجيل خروج' : ''"
              >
                <svg class="w-5 h-5" :class="{'ml-3': !sidebarCollapsed}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                <span v-if="!sidebarCollapsed" class="mr-2">تسجيل خروج</span>
              </button>
            </div>
          </aside>

          <!-- Main Content Area -->
          <div class="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
            <!-- Desktop Header -->
            <header class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div class="flex items-center justify-between">
                <!-- Breadcrumb and Title -->
                <div class="flex items-center space-x-4 space-x-reverse">
                  <button 
                    @click="toggleSidebar"
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
                  >
                    <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  
                  <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                      {{ getPageTitle() }}
                    </h1>
                    <div class="flex items-center space-x-2 space-x-reverse mt-1">
                      <p v-if="currentWarehouseName" class="text-sm text-yellow-600 dark:text-yellow-400">
                        {{ currentWarehouseName }}
                      </p>
                      <span v-if="userRole" class="text-xs px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                        {{ roleName }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Header Actions -->
                <div class="flex items-center space-x-4 space-x-reverse">
                  <!-- Search -->
                  <div class="relative hidden md:block">
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                    </div>
                    <input
                      type="search"
                      placeholder="ابحث..."
                      class="w-64 pr-10 pl-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 backdrop-blur-sm"
                    />
                  </div>

                  <!-- Dark Mode -->
                  <button 
                    @click="toggleDarkMode"
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="تبديل الوضع"
                  >
                    <svg v-if="isDarkMode" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
                    </svg>
                    <svg v-else class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                    </svg>
                  </button>

                  <!-- Notifications -->
                  <button 
                    @click="showNotifications"
                    class="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="الإشعارات"
                  >
                    <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                    <span v-if="realNotificationCount > 0" class="absolute -top-1 -left-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {{ realNotificationCount > 9 ? '9+' : realNotificationCount }}
                    </span>
                  </button>

                  <!-- User Profile Dropdown -->
                  <div class="relative">
                    <button 
                      @click="profileMenuOpen = !profileMenuOpen"
                      class="flex items-center space-x-2 space-x-reverse p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div class="h-8 w-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                        <span class="text-white text-xs font-medium">
                          {{ getUserInitials() }}
                        </span>
                      </div>
                      <div class="text-right hidden md:block">
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ userName }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          {{ roleName }}
                        </p>
                      </div>
                      <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                      </svg>
                    </button>

                    <!-- Dropdown Menu -->
                    <div 
                      v-if="profileMenuOpen"
                      class="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                      @click.self="profileMenuOpen = false"
                    >
                      <router-link 
                        to="/profile" 
                        @click="profileMenuOpen = false"
                        class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        إعدادات الحساب
                      </router-link>
                      <button 
                        @click="logout"
                        class="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                        تسجيل خروج
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <!-- Main Content -->
            <main class="flex-1 overflow-y-auto p-6">
              <div class="max-w-full mx-auto">
                <router-view />
              </div>
            </main>
          </div>
        </div>
        <!-- ============================================== -->
        <!-- END DESKTOP LAYOUT -->
        <!-- ============================================== -->
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    
    const initializing = ref(true);
    const mobileMenuOpen = ref(false);
    const profileMenuOpen = ref(false);
    const isDarkMode = ref(false);
    const sidebarCollapsed = ref(false);
    
    // Bottom navigation scroll behavior
    const bottomNavHidden = ref(false);
    const lastScrollPosition = ref(0);
    const scrollThreshold = 10;
    const touchStartY = ref(0);

    // Store data
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const user = computed(() => store.state.user);
    const userProfile = computed(() => store.state.userProfile);
    const userRole = computed(() => store.getters.userRole);
    const notifications = computed(() => store.state.notifications || []);
    const realNotificationCount = computed(() => notifications.value.length);
    const mainWarehouse = computed(() => store.getters.mainWarehouse);
    const warehouses = computed(() => store.state.warehouses || []);

    // Computed properties with safe defaults
    const userName = computed(() => {
      return userProfile.value?.name || userProfile.value?.email || user.value?.email || 'مستخدم';
    });

    const roleName = computed(() => {
      const names = {
        superadmin: 'المشرف العام',
        warehouse_manager: 'مدير المخازن',
        company_manager: 'مدير الشركة',
        user: 'مستخدم'
      };
      return names[userRole.value] || 'مستخدم';
    });

    const currentWarehouseName = computed(() => {
      if (mainWarehouse.value) {
        return mainWarehouse.value.name_ar || '';
      }
      
      const allowedWarehouses = userProfile.value?.allowed_warehouses || [];
      if (allowedWarehouses.length > 0 && warehouses.value.length > 0) {
        const firstWarehouse = warehouses.value.find(w => w.id === allowedWarehouses[0]);
        return firstWarehouse?.name_ar || '';
      }
      
      return '';
    });

    const isPublicRoute = computed(() => {
      const publicRoutes = ['Login', 'Unauthorized', 'NotFound'];
      return publicRoutes.includes(route.name);
    });
    
    const showBottomNav = computed(() => {
      const hideBottomNavRoutes = ['/login', '/unauthorized', '/notfound'];
      return !hideBottomNavRoutes.includes(route.path) && isAuthenticated.value;
    });

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
    
    const canManageUsers = computed(() => store.getters.userRole === 'superadmin');
    const canManageWarehouses = computed(() => store.getters.userRole === 'superadmin');
    const canViewReports = computed(() => {
      const role = store.getters.userRole;
      return ['superadmin', 'company_manager'].includes(role);
    });

    // Methods
    const getPageTitle = () => {
      const titles = {
        'Dashboard': 'لوحة التحكم',
        'Inventory': 'الأصناف',
        'ItemDetails': 'تفاصيل الصنف',
        'AddItem': 'إضافة صنف جديد',
        'Transactions': 'سجل الحركات',
        'Warehouses': 'المخازن',
        'Users': 'المستخدمين',
        'Reports': 'التقارير',
        'Profile': 'الملف الشخصي'
      };
      return titles[route.name] || 'نظام المخزون';
    };

    const getUserInitials = () => {
      const name = userName.value;
      if (!name || name === 'مستخدم') return 'م';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

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

    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value;
      localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value.toString());
    };

    const initializeSidebar = () => {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState !== null) {
        sidebarCollapsed.value = savedState === 'true';
      }
    };

    const toggleProfileMenu = () => {
      profileMenuOpen.value = !profileMenuOpen.value;
      if (mobileMenuOpen.value) mobileMenuOpen.value = false;
    };

    const showNotifications = () => {
      router.push('/transactions');
      mobileMenuOpen.value = false;
      profileMenuOpen.value = false;
    };

    const removeNotification = (notificationId) => {
      store.commit('REMOVE_NOTIFICATION', notificationId);
    };

    // Bottom navigation scroll handling
    const handleScroll = () => {
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      
      // Don't hide/show if the change is too small
      if (Math.abs(currentScrollPosition - lastScrollPosition.value) < scrollThreshold) {
        return;
      }
      
      // Scrolling down and past threshold - hide bottom nav
      if (currentScrollPosition > lastScrollPosition.value && currentScrollPosition > 100) {
        bottomNavHidden.value = true;
      } 
      // Scrolling up - show bottom nav
      else if (currentScrollPosition < lastScrollPosition.value) {
        bottomNavHidden.value = false;
      }
      
      lastScrollPosition.value = currentScrollPosition;
    };
    
    // Touch handling for mobile
    const handleTouchStart = (event) => {
      touchStartY.value = event.touches[0].clientY;
    };
    
    const handleTouchMove = (event) => {
      if (!touchStartY.value) return;
      
      const touchY = event.touches[0].clientY;
      const diff = touchStartY.value - touchY;
      
      // Swiping down (showing nav)
      if (diff < -50 && bottomNavHidden.value) {
        bottomNavHidden.value = false;
        touchStartY.value = null;
      }
      // Swiping up (hiding nav)
      else if (diff > 50 && !bottomNavHidden.value && window.pageYOffset > 100) {
        bottomNavHidden.value = true;
        touchStartY.value = null;
      }
    };
    
    // Reset nav when route changes
    const resetBottomNav = () => {
      bottomNavHidden.value = false;
      lastScrollPosition.value = 0;
    };

    // Modal actions
    const openAddItemModal = () => {
      mobileMenuOpen.value = false;
      profileMenuOpen.value = false;
      window.dispatchEvent(new CustomEvent('open-add-item-modal'));
    };

    const openTransferModal = () => {
      mobileMenuOpen.value = false;
      profileMenuOpen.value = false;
      window.dispatchEvent(new CustomEvent('open-transfer-modal'));
    };

    const openDispatchModal = () => {
      mobileMenuOpen.value = false;
      profileMenuOpen.value = false;
      window.dispatchEvent(new CustomEvent('open-dispatch-modal'));
    };

    const openAddWarehouseModal = () => {
      mobileMenuOpen.value = false;
      profileMenuOpen.value = false;
      window.dispatchEvent(new CustomEvent('open-add-warehouse-modal'));
    };

    const logout = async () => {
      try {
        mobileMenuOpen.value = false;
        profileMenuOpen.value = false;
        
        await store.dispatch('logout');
        router.push('/login');
        
      } catch (error) {
        console.error('Logout error:', error);
        router.push('/login');
      }
    };

    onMounted(async () => {
      try {
        await store.dispatch('initializeAuth');
        
        if (store.getters.isAuthenticated) {
          await store.dispatch('loadWarehouses');
          
          // Show only one welcome notification
          if (!localStorage.getItem('welcomeShown')) {
            store.dispatch('showNotification', {
              type: 'success',
              message: 'مرحباً بك في نظام المخزون!'
            });
            localStorage.setItem('welcomeShown', 'true');
          }
        }
        
        initializeDarkMode();
        initializeSidebar();
        
        // Add scroll event listener for bottom nav
        if (showBottomNav.value) {
          window.addEventListener('scroll', handleScroll);
          window.addEventListener('touchstart', handleTouchStart);
          window.addEventListener('touchmove', handleTouchMove);
          
          // Smooth appearance on mount
          setTimeout(() => {
            bottomNavHidden.value = false;
          }, 300);
        }

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

    // Clean up event listeners
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    });

    // Close mobile menu when route changes
    watch(() => route.path, () => {
      mobileMenuOpen.value = false;
      profileMenuOpen.value = false;
      resetBottomNav();
    });
    
    // Watch for bottom nav visibility changes
    watch(showBottomNav, (newValue) => {
      if (newValue) {
        // Bottom nav should be shown - add event listeners
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove);
        resetBottomNav();
      } else {
        // Bottom nav should be hidden - remove event listeners
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('touchstart', handleStart);
        window.removeEventListener('touchmove', handleTouchMove);
      }
    });

    // Close profile menu when clicking outside
    const handleClickOutside = (event) => {
      if (profileMenuOpen.value && !event.target.closest('.relative')) {
        profileMenuOpen.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      // Refs
      initializing,
      mobileMenuOpen,
      profileMenuOpen,
      isDarkMode,
      sidebarCollapsed,
      bottomNavHidden,
      
      // Computed
      isAuthenticated,
      user,
      userProfile,
      userRole,
      notifications,
      realNotificationCount,
      currentWarehouseName,
      userName,
      roleName,
      isPublicRoute,
      showBottomNav,
      canModifyItems,
      canManageUsers,
      canManageWarehouses,
      canViewReports,
      
      // Methods
      getPageTitle,
      getUserInitials,
      toggleDarkMode,
      toggleSidebar,
      toggleProfileMenu,
      showNotifications,
      removeNotification,
      openAddItemModal,
      openTransferModal,
      openDispatchModal,
      openAddWarehouseModal,
      logout
    };
  }
};
</script>

<style scoped>
/* Mobile sidebar animation */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
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

/* Safe area for mobile bottom nav */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* Bottom navigation animations */
.translate-y-full {
  transform: translateY(100%);
}

.translate-y-0 {
  transform: translateY(0);
}

/* Glassmorphism effects */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.backdrop-blur-xl {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Smooth glassmorphism transition */
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Notification animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Animation for notifications */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Smooth animations */
@keyframes smooth-appear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Add smooth appearance to bottom nav */
.fixed.bottom-0 {
  animation: smooth-appear 0.3s ease-out;
}

/* Improved responsive typography */
@media (max-width: 640px) {
  .text-lg {
    font-size: 1.125rem;
  }
  
  .text-sm {
    font-size: 0.875rem;
  }
  
  .text-xs {
    font-size: 0.75rem;
  }
}

/* Better focus states for accessibility */
button:focus-visible,
[role="button"]:focus-visible,
a:focus-visible {
  outline: 2px solid #f59e0b;
  outline-offset: 2px;
}

/* Smooth transitions */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

/* Mobile scrollbar improvements */
.overflow-y-auto {
  -webkit-overflow-scrolling: touch;
}

/* Enhance button press feedback */
button:active {
  transform: scale(0.98);
}

/* Gradient animation for add button */
@keyframes gradient-shift {
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

.bg-gradient-to-br {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.8);
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.5);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.8);
}

/* Tooltip styles for collapsed sidebar */
.group:hover .group-hover\:block {
  display: block;
}

/* Hover effects for sidebar items */
.hover\:bg-yellow-50:hover {
  background-color: rgba(254, 252, 232, 0.8);
}

.dark .hover\:bg-yellow-900\/20:hover {
  background-color: rgba(120, 53, 15, 0.2);
}

/* Text truncation */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Gradient backgrounds with smooth transitions */
.bg-gradient-to-b {
  background-size: 100% 200%;
  transition: background-position 0.3s ease;
}

.bg-gradient-to-b:hover {
  background-position: 0 100%;
}

/* Shadow effects */
.shadow-glow {
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
}

/* Loading spinner */
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

/* Focus styles */
.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.5);
}

.focus\:ring-yellow-500:focus {
  --tw-ring-color: rgba(245, 158, 11, 0.5);
}

.focus\:border-yellow-500:focus {
  border-color: #f59e0b;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hidden.md\:block {
    display: none !important;
  }
}

@media (min-width: 1024px) {
  .lg\:hidden {
    display: none !important;
  }
}

/* Smooth sidebar collapse */
.w-64 {
  width: 16rem;
}

.w-20 {
  width: 5rem;
}

/* Ensure content doesn't overflow */
.max-w-full {
  max-width: 100%;
}

/* Improve button accessibility */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Better image rendering */
img {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

/* Selection styles */
::selection {
  background-color: rgba(245, 158, 11, 0.3);
  color: inherit;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
