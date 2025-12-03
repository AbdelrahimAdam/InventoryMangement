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
          <header class="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
            <div class="px-4 py-3">
              <div class="flex items-center justify-between">
                <!-- Left: Menu button and logo -->
                <div class="flex items-center space-x-3 space-x-reverse">
                  <button 
                    @click="toggleMobileMenu"
                    class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    aria-label="فتح القائمة"
                  >
                    <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <router-link to="/" class="flex items-center space-x-2 space-x-reverse" @click="mobileMenuOpen = false">
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
                    :aria-label="isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'"
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
                    class="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    aria-label="الإشعارات"
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
              <!-- Search Bar -->
              <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div class="relative">
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    v-model="mobileSearchTerm"
                    @input="handleMobileSearch"
                    @keyup.enter="handleMobileSearchEnter"
                    placeholder="ابحث عن صنف..."
                    class="block w-full pr-10 pl-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    aria-label="بحث عن صنف"
                  />
                </div>
              </div>

              <!-- User Profile Info -->
              <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center shadow-sm ml-3">
                    <span class="text-white font-medium text-sm">
                      {{ getUserInitials(userProfile?.name || userProfile?.email) }}
                    </span>
                  </div>
                  <div class="text-right flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ userProfile?.name || userProfile?.email }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ getRoleName(userRole) }}</p>
                  </div>
                  <span :class="['inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', roleBadgeClass]">
                    {{ getRoleName(userRole) }}
                  </span>
                </div>
              </div>

              <!-- Navigation Links -->
              <div class="px-4 py-3 space-y-1">
                <router-link 
                  to="/" 
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200"
                  :class="{'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/', 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/'}"
                  aria-current="page"
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
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200"
                  :class="{'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400': $route.path === '/warehouses', 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/warehouses'}"
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
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200"
                  :class="{'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/users', 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/users'}"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  إدارة المستخدمين
                </router-link>

                <!-- Quick Actions -->
                <div v-if="canModifyItems" class="pt-2 pb-1 px-3">
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    إجراءات سريعة
                  </p>
                  <div class="space-y-1">
                    <button 
                      @click="openAddItemModal"
                      class="w-full flex items-center px-3 py-3 rounded-lg text-base font-medium text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors duration-200"
                    >
                      <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      إضافة صنف جديد
                    </button>

                    <button 
                      @click="openTransferModal"
                      class="w-full flex items-center px-3 py-3 rounded-lg text-base font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
                    >
                      <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                      </svg>
                      نقل بين المخازن
                    </button>

                    <button 
                      @click="openDispatchModal"
                      class="w-full flex items-center px-3 py-3 rounded-lg text-base font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors duration-200"
                    >
                      <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      صرف إلى خارجي
                    </button>

                    <!-- Add Warehouse Button for Super Admin -->
                    <button 
                      v-if="canManageWarehouses"
                      @click="openAddWarehouseModal"
                      class="w-full flex items-center px-3 py-3 rounded-lg text-base font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                    >
                      <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      إضافة مخزن جديد
                    </button>
                  </div>
                </div>

                <!-- Other Navigation Links -->
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

                <router-link 
                  to="/profile" 
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200"
                  :class="{'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/profile', 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/profile'}"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  إعدادات الحساب
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

          <!-- Mobile Stats Bar -->
          <div v-if="dashboardStats && $route.path === '/'" class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div class="flex overflow-x-auto scrollbar-hide px-4 py-2">
              <div class="flex-shrink-0 px-3 text-center border-l border-gray-200 dark:border-gray-700 first:border-l-0">
                <div class="text-xs text-gray-500 dark:text-gray-400">الأصناف</div>
                <div class="text-sm font-bold text-gray-900 dark:text-white">{{ dashboardStats.totalItems || 0 }}</div>
              </div>
              <div class="flex-shrink-0 px-3 text-center border-l border-gray-200 dark:border-gray-700">
                <div class="text-xs text-gray-500 dark:text-gray-400">الكمية</div>
                <div class="text-sm font-bold text-gray-900 dark:text-white">{{ formatNumber(dashboardStats.totalQuantity) || 0 }}</div>
              </div>
              <div class="flex-shrink-0 px-3 text-center border-l border-gray-200 dark:border-gray-700">
                <div class="text-xs text-gray-500 dark:text-gray-400">قليلة</div>
                <div class="text-sm font-bold text-red-600 dark:text-red-400">{{ dashboardStats.lowStockItems || 0 }}</div>
              </div>
              <div class="flex-shrink-0 px-3 text-center border-l border-gray-200 dark:border-gray-700">
                <div class="text-xs text-gray-500 dark:text-gray-400">الحركات</div>
                <div class="text-sm font-bold text-gray-900 dark:text-white">{{ dashboardStats.recentTransactions || 0 }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <!-- On desktop: Dashboard.vue handles everything -->
        <!-- On mobile: Dashboard.vue handles content, App.vue handles mobile header -->
        <div class="flex-1 flex flex-col overflow-hidden" :class="{'lg:pt-0': isAuthenticated}">
          <!-- Router view - Dashboard.vue will render here -->
          <div class="flex-1 overflow-y-auto" :class="{'pt-[70px] lg:pt-0': isAuthenticated && $route.path !== '/login'}">
            <router-view />
          </div>

          <!-- Mobile Bottom Navigation (only shown on mobile) -->
          <div v-if="isAuthenticated && showBottomNav" class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe">
            <div class="flex justify-around p-2">
              <router-link 
                to="/" 
                class="flex flex-col items-center p-2 flex-1 transition-colors duration-200"
                :class="{'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg': $route.path === '/'}"
                @click="mobileMenuOpen = false"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <span class="text-xs mt-1">الرئيسية</span>
              </router-link>

              <button 
                v-if="canModifyItems"
                @click="openAddItemModal" 
                class="flex flex-col items-center p-2 flex-1 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors duration-200"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span class="text-xs mt-1">إضافة</span>
              </button>

              <router-link 
                to="/transactions" 
                class="flex flex-col items-center p-2 flex-1 transition-colors duration-200"
                :class="{'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg': $route.path === '/transactions'}"
                @click="mobileMenuOpen = false"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <span class="text-xs mt-1">الحركات</span>
              </router-link>

              <button 
                @click="toggleProfileMenu" 
                class="flex flex-col items-center p-2 flex-1 transition-colors duration-200"
                :class="{'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg': profileMenuOpen}"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span class="text-xs mt-1">حسابي</span>
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { debounce } from 'lodash';

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
    const mobileSearchTerm = ref('');

    // Check authentication status
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    
    // Check if current route is public
    const isPublicRoute = computed(() => {
      const publicRoutes = ['Login', 'Unauthorized', 'NotFound'];
      return publicRoutes.includes(route.name);
    });
    
    // Show bottom nav on dashboard pages
    const showBottomNav = computed(() => {
      const hideBottomNavRoutes = ['/login', '/unauthorized', '/notfound'];
      return !hideBottomNavRoutes.includes(route.path) && isAuthenticated.value;
    });
    
    // Get user info for permissions
    const userRole = computed(() => store.getters.userRole);
    const userProfile = computed(() => store.state.userProfile);
    const dashboardStats = computed(() => store.getters.dashboardStats);
    
    // Notification count from store
    const notificationCount = computed(() => store.getters.dashboardStats?.lowStockItems || 0);
    
    // Permissions from store getters
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
    const canViewReports = computed(() => store.getters.userRole === 'superadmin' || store.getters.userRole === 'company_manager');

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

    const showNotifications = () => {
      // Navigate to transactions page or show notifications panel
      router.push('/transactions');
      mobileMenuOpen.value = false;
    };

    const openAddItemModal = () => {
      mobileMenuOpen.value = false;
      window.dispatchEvent(new CustomEvent('open-add-item-modal'));
    };

    const openTransferModal = () => {
      mobileMenuOpen.value = false;
      window.dispatchEvent(new CustomEvent('open-transfer-modal'));
    };

    const openDispatchModal = () => {
      mobileMenuOpen.value = false;
      window.dispatchEvent(new CustomEvent('open-dispatch-modal'));
    };

    const openAddWarehouseModal = () => {
      mobileMenuOpen.value = false;
      window.dispatchEvent(new CustomEvent('open-add-warehouse-modal'));
    };

    // Handle mobile search
    const handleMobileSearch = debounce(() => {
      // Dispatch search event to be handled by inventory components
      window.dispatchEvent(new CustomEvent('mobile-search', { 
        detail: { searchTerm: mobileSearchTerm.value } 
      }));
    }, 300);

    const handleMobileSearchEnter = () => {
      // Navigate to inventory page with search term if not already there
      if (route.path !== '/') {
        router.push('/');
      }
      // Trigger search immediately on enter
      window.dispatchEvent(new CustomEvent('mobile-search', { 
        detail: { searchTerm: mobileSearchTerm.value, immediate: true } 
      }));
    };

    // Format numbers
    const formatNumber = (num) => {
      if (!num && num !== 0) return '0';
      return new Intl.NumberFormat('ar-EG').format(num);
    };

    // Fixed logout function
    const logout = async () => {
      try {
        mobileMenuOpen.value = false;
        profileMenuOpen.value = false;
        
        // Clear state via Vuex
        await store.dispatch('logout');
        
        // Use router for clean navigation
        router.push('/login');
        
      } catch (error) {
        console.error('Logout error:', error);
        router.push('/login');
      }
    };

    onMounted(async () => {
      try {
        // Initialize authentication
        await store.dispatch('initializeAuth');
        
        // Load warehouses if authenticated
        if (store.getters.isAuthenticated) {
          await store.dispatch('loadWarehouses');
        }
        
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

        // Listen for keyboard events for accessibility
        document.addEventListener('keydown', (e) => {
          // Close menus on escape
          if (e.key === 'Escape') {
            mobileMenuOpen.value = false;
            profileMenuOpen.value = false;
          }
        });

      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
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
      isPublicRoute,
      showBottomNav,
      mobileMenuOpen,
      profileMenuOpen,
      isDarkMode,
      mobileSearchTerm,
      notificationCount,
      dashboardStats,
      userRole,
      userProfile,
      canModifyItems,
      canManageUsers,
      canManageWarehouses,
      canViewReports,
      getRoleName,
      getUserInitials,
      roleBadgeClass,
      toggleDarkMode,
      toggleMobileMenu,
      toggleProfileMenu,
      showNotifications,
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
/* Safe area padding for mobile navigation */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 0.5rem);
}

/* Improved touch targets for mobile */
@media (max-width: 768px) {
  button, 
  [role="button"],
  a {
    min-height: 44px;
    min-width: 44px;
  }
  
  .flex.items-center.px-3.py-3 {
    min-height: 48px;
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
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

/* Hide mobile elements on desktop */
@media (min-width: 1024px) {
  .lg\:hidden {
    display: none !important;
  }
  
  .lg\:pt-0 {
    padding-top: 0 !important;
  }
}

/* Mobile scrollbar hide */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Prevent body scroll when menu is open */
body:has(.mobile-menu-open) {
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
}

/* Improved z-index layering */
#app {
  isolation: isolate;
}

.fixed {
  z-index: 50;
}

.bg-black.bg-opacity-50 {
  z-index: 40;
}

/* Better responsive typography */
@media (max-width: 640px) {
  .text-base {
    font-size: 0.9375rem;
  }
  
  .text-xs {
    font-size: 0.75rem;
  }
}

/* Touch feedback for buttons */
button:active,
[role="button"]:active {
  transform: scale(0.98);
}
</style>