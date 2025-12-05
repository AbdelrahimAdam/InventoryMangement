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
        <!-- MOBILE ONLY: Header and Navigation -->
        <div class="lg:hidden">
          <!-- Mobile Header -->
          <header class="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 safe-area-top">
            <div class="px-4 py-3">
              <div class="flex items-center justify-between">
                <!-- Left: Menu button and logo -->
                <div class="flex items-center gap-3">
                  <button 
                    @click="toggleMobileMenu"
                    class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 touch-target"
                    :aria-label="mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'"
                    :aria-expanded="mobileMenuOpen"
                    aria-controls="mobile-menu"
                  >
                    <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <router-link 
                    to="/" 
                    class="flex items-center gap-2 touch-target" 
                    @click="closeAllMenus"
                    aria-label="الرئيسية"
                  >
                    <div class="h-10 w-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                      <span class="text-white font-bold text-base">م</span>
                    </div>
                    <div class="text-right">
                      <h1 class="text-sm font-bold text-gray-900 dark:text-white leading-tight">نظام المخزون</h1>
                      <p class="text-xs text-gray-500 dark:text-gray-400">مونوفيا</p>
                    </div>
                  </router-link>
                </div>

                <!-- Right: Dark mode and Notifications -->
                <div class="flex items-center gap-2">
                  <button 
                    @click="toggleDarkMode"
                    class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 touch-target"
                    :aria-label="isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'"
                  >
                    <svg v-if="isDarkMode" class="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
                    </svg>
                    <svg v-else class="w-6 h-6 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                    </svg>
                  </button>

                  <button 
                    @click="handleNotifications"
                    class="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 touch-target"
                    aria-label="الإشعارات"
                  >
                    <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0.538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                    <span 
                      v-if="notificationCount > 0" 
                      class="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800"
                    >
                      {{ notificationCount > 9 ? '9+' : notificationCount }}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Mobile Stats Bar (only on dashboard) -->
            <div v-if="dashboardStats && $route.path === '/'" class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm px-4 py-3">
              <div class="flex overflow-x-auto scrollbar-hide gap-4">
                <div class="flex-shrink-0 text-center">
                  <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">الأصناف</div>
                  <div class="text-sm font-bold text-gray-900 dark:text-white">{{ dashboardStats.totalItems || 0 }}</div>
                </div>
                <div class="flex-shrink-0 text-center">
                  <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">الكمية</div>
                  <div class="text-sm font-bold text-gray-900 dark:text-white">{{ formatNumber(dashboardStats.totalQuantity) || 0 }}</div>
                </div>
                <div class="flex-shrink-0 text-center">
                  <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">قليلة</div>
                  <div class="text-sm font-bold text-red-600 dark:text-red-400">{{ dashboardStats.lowStockItems || 0 }}</div>
                </div>
                <div class="flex-shrink-0 text-center">
                  <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">الحركات</div>
                  <div class="text-sm font-bold text-gray-900 dark:text-white">{{ dashboardStats.recentTransactions || 0 }}</div>
                </div>
              </div>
            </div>
          </header>

          <!-- Mobile Menu Overlay -->
          <div 
            v-if="mobileMenuOpen" 
            class="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
            @click="closeAllMenus"
            aria-hidden="true"
          ></div>

          <!-- Mobile Menu Drawer -->
          <div 
            v-if="mobileMenuOpen"
            id="mobile-menu"
            class="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out"
            :class="mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'"
            role="dialog"
            aria-modal="true"
            aria-label="القائمة الرئيسية"
          >
            <div class="h-full flex flex-col overflow-y-auto pt-[var(--header-height)]">
              <!-- Search Bar -->
              <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div class="relative">
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </div>
                  <input
                    ref="mobileSearchInput"
                    type="text"
                    v-model="mobileSearchTerm"
                    @input="handleMobileSearch"
                    @keyup.enter="handleMobileSearchEnter"
                    placeholder="ابحث عن صنف..."
                    class="block w-full pr-10 pl-3 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    aria-label="بحث عن صنف"
                  />
                </div>
              </div>

              <!-- User Profile Info -->
              <div class="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center">
                  <div class="h-12 w-12 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center shadow-sm ml-3">
                    <span class="text-white font-medium text-base">
                      {{ getUserInitials(userProfile?.name || userProfile?.email) }}
                    </span>
                  </div>
                  <div class="text-right flex-1 min-w-0">
                    <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ userProfile?.name || userProfile?.email }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ userProfile?.email }}</p>
                  </div>
                  <span 
                    :class="['inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold', roleBadgeClass]"
                    aria-label="دور المستخدم"
                  >
                    {{ getRoleName(userRole) }}
                  </span>
                </div>
              </div>

              <!-- Navigation Links -->
              <nav class="flex-1 px-4 py-3 space-y-1 overflow-y-auto" aria-label="روابط التنقل">
                <router-link 
                  to="/" 
                  @click="closeAllMenus"
                  class="flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200 touch-target"
                  :class="{
                    'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/',
                    'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/'
                  }"
                  :aria-current="$route.path === '/' ? 'page' : null"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                  لوحة التحكم
                </router-link>

                <!-- Warehouse Management Link (Superadmin) -->
                <router-link 
                  v-if="canManageWarehouses"
                  to="/warehouses" 
                  @click="closeAllMenus"
                  class="flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200 touch-target"
                  :class="{
                    'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400': $route.path === '/warehouses',
                    'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/warehouses'
                  }"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  إدارة المخازن
                </router-link>

                <!-- User Management Link (Superadmin) -->
                <router-link 
                  v-if="canManageUsers"
                  to="/users" 
                  @click="closeAllMenus"
                  class="flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200 touch-target"
                  :class="{
                    'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/users',
                    'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/users'
                  }"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  إدارة المستخدمين
                </router-link>

                <!-- Quick Actions Section -->
                <div v-if="canModifyItems" class="pt-4 pb-2">
                  <div class="px-3 mb-2">
                    <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      إجراءات سريعة
                    </p>
                  </div>
                  <div class="space-y-1">
                    <button 
                      @click="openAddItemModal"
                      class="w-full flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200 touch-target hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                      aria-label="إضافة صنف جديد"
                    >
                      <svg class="w-5 h-5 ml-3 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      <span class="text-yellow-600 dark:text-yellow-400">إضافة صنف جديد</span>
                    </button>

                    <button 
                      @click="openTransferModal"
                      class="w-full flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200 touch-target hover:bg-green-50 dark:hover:bg-green-900/20"
                      aria-label="نقل بين المخازن"
                    >
                      <svg class="w-5 h-5 ml-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                      </svg>
                      <span class="text-green-600 dark:text-green-400">نقل بين المخازن</span>
                    </button>

                    <button 
                      @click="openDispatchModal"
                      class="w-full flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200 touch-target hover:bg-orange-50 dark:hover:bg-orange-900/20"
                      aria-label="صرف إلى خارجي"
                    >
                      <svg class="w-5 h-5 ml-3 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      <span class="text-orange-600 dark:text-orange-400">صرف إلى خارجي</span>
                    </button>

                    <!-- Add Warehouse Button for Super Admin -->
                    <button 
                      v-if="canManageWarehouses"
                      @click="openAddWarehouseModal"
                      class="w-full flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200 touch-target hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      aria-label="إضافة مخزن جديد"
                    >
                      <svg class="w-5 h-5 ml-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      <span class="text-blue-600 dark:text-blue-400">إضافة مخزن جديد</span>
                    </button>
                  </div>
                </div>

                <!-- Other Navigation Links -->
                <router-link 
                  to="/transactions" 
                  @click="closeAllMenus"
                  class="flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200 touch-target"
                  :class="{
                    'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/transactions',
                    'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/transactions'
                  }"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  سجل الحركات
                </router-link>

                <router-link 
                  v-if="canViewReports"
                  to="/reports" 
                  @click="closeAllMenus"
                  class="flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200 touch-target"
                  :class="{
                    'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/reports',
                    'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/reports'
                  }"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a22 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                  التقارير
                </router-link>

                <router-link 
                  to="/profile" 
                  @click="closeAllMenus"
                  class="flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200 touch-target"
                  :class="{
                    'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/profile',
                    'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/profile'
                  }"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  إعدادات الحساب
                </router-link>
              </nav>

              <!-- Logout Button -->
              <div class="p-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  @click="logout"
                  class="w-full flex items-center justify-center px-3 py-3 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 touch-target"
                  aria-label="تسجيل خروج"
                >
                  <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  تسجيل خروج
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- Router view -->
          <div 
            class="flex-1 overflow-y-auto"
            :class="{
              'pt-[70px] lg:pt-0': isAuthenticated && $route.path !== '/login',
              'pb-[70px] lg:pb-0': showBottomNav
            }"
          >
            <router-view />
          </div>

          <!-- Mobile Bottom Navigation -->
          <nav 
            v-if="isAuthenticated && showBottomNav" 
            class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-bottom"
            aria-label="التنقل السفلي"
          >
            <div class="flex justify-around p-2">
              <router-link
                to="/" 
                class="flex flex-col items-center p-3 flex-1 transition-colors duration-200 touch-target rounded-lg"
                :class="{
                  'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20': $route.path === '/',
                  'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/'
                }"
                @click="closeAllMenus"
                :aria-current="$route.path === '/' ? 'page' : null"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <span class="text-xs mt-1">الرئيسية</span>
              </router-link>

              <button 
                v-if="canModifyItems"
                @click="openAddItemModal" 
                class="flex flex-col items-center p-3 flex-1 transition-colors duration-200 touch-target rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                aria-label="إضافة صنف جديد"
              >
                <div class="relative">
                  <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </div>
                <span class="text-xs mt-1 text-yellow-600 dark:text-yellow-400">إضافة</span>
              </button>

              <router-link 
                to="/transactions" 
                class="flex flex-col items-center p-3 flex-1 transition-colors duration-200 touch-target rounded-lg"
                :class="{
                  'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20': $route.path === '/transactions',
                  'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/transactions'
                }"
                @click="closeAllMenus"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <span class="text-xs mt-1">الحركات</span>
              </router-link>

              <button 
                @click="toggleProfileMenu"
                class="flex flex-col items-center p-3 flex-1 transition-colors duration-200 touch-target rounded-lg"
                :class="{
                  'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20': profileMenuOpen,
                  'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700': !profileMenuOpen
                }"
                :aria-label="profileMenuOpen ? 'إغلاق قائمة الحساب' : 'فتح قائمة الحساب'"
                :aria-expanded="profileMenuOpen"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span class="text-xs mt-1">حسابي</span>
              </button>
            </div>
          </nav>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { debounce } from 'lodash';

export default {
  name: 'App',
  
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    
    // Refs
    const initializing = ref(true);
    const mobileMenuOpen = ref(false);
    const profileMenuOpen = ref(false);
    const isDarkMode = ref(false);
    const mobileSearchTerm = ref('');
    const mobileSearchInput = ref(null);
    
    // Computed
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    
    const isPublicRoute = computed(() => {
      const publicRoutes = ['Login', 'Unauthorized', 'NotFound'];
      return publicRoutes.includes(route.name);
    });
    
    const showBottomNav = computed(() => {
      const hideBottomNavRoutes = ['/login', '/unauthorized', '/notfound'];
      return !hideBottomNavRoutes.includes(route.path) && isAuthenticated.value;
    });
    
    const userRole = computed(() => store.getters.userRole);
    const userProfile = computed(() => store.state.userProfile);
    const dashboardStats = computed(() => store.getters.dashboardStats);
    
    const notificationCount = computed(() => {
      return store.getters.dashboardStats?.lowStockItems || 0;
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
    const canViewReports = computed(() => {
      return store.getters.userRole === 'superadmin' || 
             store.getters.userRole === 'company_manager';
    });

    // Helper functions
    const getRoleName = (role) => {
      const names = {
        superadmin: 'المشرف العام',
        warehouse_manager: 'مدير المخازن',
        company_manager: 'مدير الشركة'
      };
      return names[role] || role;
    };

    const getUserInitials = (name) => {
      if (!name) return '؟';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const roleBadgeClass = computed(() => {
      const classes = {
        superadmin: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
        warehouse_manager: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
        company_manager: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
      };
      return classes[userRole.value] || 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    });

    // Dark mode
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

    // Menu handlers
    const closeAllMenus = () => {
      mobileMenuOpen.value = false;
      profileMenuOpen.value = false;
    };

    const toggleMobileMenu = async () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;
      profileMenuOpen.value = false;
      
      // Update body class for scroll prevention
      if (mobileMenuOpen.value) {
        document.body.classList.add('menu-open');
        await nextTick();
        if (mobileSearchInput.value) {
          mobileSearchInput.value.focus();
        }
      } else {
        document.body.classList.remove('menu-open');
      }
    };

    const toggleProfileMenu = () => {
      profileMenuOpen.value = !profileMenuOpen.value;
      mobileMenuOpen.value = false;
    };

    const handleNotifications = () => {
      router.push('/transactions');
      closeAllMenus();
    };

    // Modal handlers
    const openAddItemModal = () => {
      closeAllMenus();
      window.dispatchEvent(new CustomEvent('open-add-item-modal'));
    };

    const openTransferModal = () => {
      closeAllMenus();
      window.dispatchEvent(new CustomEvent('open-transfer-modal'));
    };

    const openDispatchModal = () => {
      closeAllMenus();
      window.dispatchEvent(new CustomEvent('open-dispatch-modal'));
    };

    const openAddWarehouseModal = () => {
      closeAllMenus();
      window.dispatchEvent(new CustomEvent('open-add-warehouse-modal'));
    };

    // Search handlers
    const handleMobileSearch = debounce(() => {
      window.dispatchEvent(new CustomEvent('mobile-search', { 
        detail: { searchTerm: mobileSearchTerm.value } 
      }));
    }, 300);

    const handleMobileSearchEnter = () => {
      if (route.path !== '/') {
        router.push('/');
      }
      window.dispatchEvent(new CustomEvent('mobile-search', { 
        detail: { searchTerm: mobileSearchTerm.value, immediate: true } 
      }));
    };

    // Utilities
    const formatNumber = (num) => {
      if (num === null || num === undefined) return '0';
      return new Intl.NumberFormat('ar-EG').format(num);
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

    // Calculate header height for CSS variable
    const updateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        const height = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    };

    // Lifecycle
    onMounted(async () => {
      try {
        // Initialize auth
        await store.dispatch('initializeAuth');
        
        // Load warehouses if authenticated
        if (store.getters.isAuthenticated) {
          await store.dispatch('loadWarehouses');
        }
        
        // Initialize dark mode
        initializeDarkMode();
        
        // Update header height on mount and resize
        updateHeaderHeight();
        window.addEventListener('resize', updateHeaderHeight);
        
        // Listen for system theme changes
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleThemeChange = (e) => {
          if (!localStorage.getItem('theme')) {
            if (e.matches) {
              document.documentElement.classList.add('dark');
              isDarkMode.value = true;
            } else {
              document.documentElement.classList.remove('dark');
              isDarkMode.value = false;
            }
          }
        };
        
        darkModeMediaQuery.addEventListener('change', handleThemeChange);
        
        // Keyboard navigation
        const handleKeyDown = (e) => {
          if (e.key === 'Escape') {
            closeAllMenus();
          }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        
        // Cleanup function
        return () => {
          darkModeMediaQuery.removeEventListener('change', handleThemeChange);
          document.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('resize', updateHeaderHeight);
          document.body.classList.remove('menu-open');
        };
        
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setTimeout(() => {
          initializing.value = false;
        }, 500);
      }
    });

    // Watch route changes
    watch(() => route.path, () => {
      closeAllMenus();
      mobileSearchTerm.value = '';
    });

    // Watch for auth changes
    watch(isAuthenticated, (newVal) => {
      if (!newVal && !isPublicRoute.value) {
        router.push('/login');
      }
    });

    // Watch menu state to prevent body scroll
    watch(mobileMenuOpen, (newVal) => {
      if (newVal) {
        document.body.classList.add('menu-open');
      } else {
        document.body.classList.remove('menu-open');
      }
    });

    return {
      // Refs
      initializing,
      mobileMenuOpen,
      profileMenuOpen,
      isDarkMode,
      mobileSearchTerm,
      mobileSearchInput,
      
      // Computed
      isAuthenticated,
      isPublicRoute,
      showBottomNav,
      notificationCount,
      dashboardStats,
      userRole,
      userProfile,
      canModifyItems,
      canManageUsers,
      canManageWarehouses,
      canViewReports,
      
      // Methods
      getRoleName,
      getUserInitials,
      roleBadgeClass,
      toggleDarkMode,
      closeAllMenus,
      toggleMobileMenu,
      toggleProfileMenu,
      handleNotifications,
      openAddItemModal,
      openTransferModal,
      openDispatchModal,
      openAddWarehouseModal,
      handleMobileSearch,
      handleMobileSearchEnter,
      formatNumber,
      logout
    };
  }
};
</script>

<style scoped>
/* CSS Variables for consistency */
:root {
  --safe-area-inset-top: env(safe-area-inset-top, 0px);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
  --safe-area-inset-left: env(safe-area-inset-left, 0px);
  --safe-area-inset-right: env(safe-area-inset-right, 0px);
  --header-height: 70px; /* Default, updated by JS */
}

/* Safe area padding */
.safe-area-top {
  padding-top: var(--safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: var(--safe-area-inset-bottom);
}

/* Touch target sizing */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

@media (min-width: 1024px) {
  .touch-target {
    min-height: 32px;
    min-width: 32px;
  }
}

/* Focus styles for accessibility */
:focus-visible {
  outline: 2px solid #f59e0b;
  outline-offset: 2px;
  border-radius: 0.375rem;
}

/* Smooth transitions */
* {
  transition: background-color 0.2s ease, 
              border-color 0.2s ease, 
              color 0.2s ease,
              transform 0.2s ease,
              opacity 0.2s ease;
}

/* Hide scrollbar but keep functionality */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Prevent body scroll when menu is open */
body.menu-open {
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
}

/* Mobile menu animation */
.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-slide-enter-from,
.menu-slide-leave-to {
  transform: translateX(100%);
}

/* Button active state */
button:active,
[role="button"]:active {
  transform: scale(0.98);
}

/* Responsive typography */
@media (max-width: 640px) {
  .text-base {
    font-size: 0.9375rem;
    line-height: 1.375rem;
  }
  
  .text-xs {
    font-size: 0.75rem;
    line-height: 1rem;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .bg-yellow-50 {
    background-color: #fff8e1;
  }
  
  .dark .bg-yellow-900\/20 {
    background-color: rgba(120, 53, 15, 0.3);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Print styles */
@media print {
  .lg\\:hidden,
  .fixed {
    display: none !important;
  }
}

/* Dark mode specific styles */
.dark .scrollbar-hide::-webkit-scrollbar-track {
  background: #374151;
}

.dark .scrollbar-hide::-webkit-scrollbar-thumb {
  background: #4b5563;
}

/* Improved focus for RTL */
[dir="rtl"] :focus-visible {
  outline-offset: -2px;
}

/* Performance optimizations */
.will-change-transform {
  will-change: transform;
}

.will-change-opacity {
  will-change: opacity;
}

/* Selection styles */
::selection {
  background-color: rgba(245, 158, 11, 0.3);
  color: inherit;
}

.dark ::selection {
  background-color: rgba(245, 158, 11, 0.5);
}

/* Fixed positioning for mobile layout */
.fixed-header-content {
  position: fixed;
  top: var(--header-height, 70px);
  left: 0;
  right: 0;
  bottom: var(--bottom-nav-height, 70px);
  overflow-y: auto;
}

/* Ensure content doesn't hide behind fixed elements */
.content-area {
  padding-top: var(--header-height, 70px);
  padding-bottom: var(--bottom-nav-height, 70px);
}

/* Z-index layering */
.z-header {
  z-index: 50;
}

.z-menu {
  z-index: 40;
}

.z-overlay {
  z-index: 30;
}

.z-content {
  z-index: 10;
}
</style>

       

     
             









