<template>
  <div id="app" dir="rtl" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Show loading while initializing -->
    <div v-if="initializing" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">جاري التحميل...</p>
      </div>
    </div>

    <!-- Main app content -->
    <div v-else class="h-screen flex flex-col">
      <!-- Public routes -->
      <template v-if="isPublicRoute">
        <div class="flex-1 overflow-y-auto">
          <router-view />
        </div>
      </template>

      <!-- Authenticated layout -->
      <template v-else>
        <!-- Mobile Overlay for sidebar -->
        <div 
          v-if="mobileSidebarOpen"
          class="lg:hidden fixed inset-0 z-50"
          @click="mobileSidebarOpen = false"
        >
          <div class="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"></div>
        </div>

        <!-- Mobile Sidebar Navigation -->
        <aside 
          :class="[
            'lg:hidden fixed top-0 right-0 z-50 h-full w-80 transform transition-transform duration-300 ease-in-out',
            mobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          ]"
        >
          <div class="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl">
            <!-- Sidebar Header -->
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center space-x-3 space-x-reverse">
                  <div class="h-12 w-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                    <span class="text-white font-bold text-lg">م</span>
                  </div>
                  <div>
                    <h1 class="text-lg font-bold text-gray-900 dark:text-white">نظام المخزون</h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400">الإصدار 1.0</p>
                  </div>
                </div>
                <button 
                  @click="mobileSidebarOpen = false"
                  class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="إغلاق القائمة"
                >
                  <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <!-- User Profile -->
              <div class="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <div class="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center shadow-sm ml-3">
                  <span class="text-white font-medium text-sm">
                    {{ getUserInitials(userProfile?.name || userProfile?.email) }}
                  </span>
                </div>
                <div class="flex-1 text-right">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {{ userProfile?.name || userProfile?.email }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ getRoleName(userRole) }}
                  </p>
                </div>
                <span :class="['px-2 py-1 rounded-full text-xs font-medium', roleBadgeClass]">
                  {{ getRoleName(userRole) }}
                </span>
              </div>
            </div>

            <!-- Navigation Links -->
            <div class="flex-1 overflow-y-auto p-4 space-y-2">
              <div class="space-y-1">
                <p class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  رئيسية
                </p>
                
                <router-link 
                  to="/" 
                  @click="mobileSidebarOpen = false"
                  class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                  :class="{
                    'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-r-4 border-primary-500': $route.path === '/',
                    'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/'
                  }"
                  aria-current="page"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                  لوحة التحكم
                </router-link>

                <router-link 
                  v-if="canManageWarehouses"
                  to="/warehouses" 
                  @click="mobileSidebarOpen = false"
                  class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                  :class="{
                    'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-4 border-blue-500': $route.path === '/warehouses',
                    'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/warehouses'
                  }"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  إدارة المخازن
                </router-link>
              </div>

              <!-- Inventory Management -->
              <div class="space-y-1">
                <p class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  إدارة المخزون
                </p>
                
                <router-link 
                  to="/inventory" 
                  @click="mobileSidebarOpen = false"
                  class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                  :class="{
                    'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-r-4 border-green-500': $route.path === '/inventory',
                    'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/inventory'
                  }"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                  </svg>
                  الأصناف
                </router-link>

                <router-link 
                  to="/categories" 
                  @click="mobileSidebarOpen = false"
                  class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                  :class="{
                    'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-r-4 border-purple-500': $route.path === '/categories',
                    'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/categories'
                  }"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                  </svg>
                  التصنيفات
                </router-link>
              </div>

              <!-- Transactions & Reports -->
              <div class="space-y-1">
                <p class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  السجلات والتقارير
                </p>
                
                <router-link 
                  to="/transactions" 
                  @click="mobileSidebarOpen = false"
                  class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                  :class="{
                    'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-r-4 border-orange-500': $route.path === '/transactions',
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
                  @click="mobileSidebarOpen = false"
                  class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                  :class="{
                    'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-r-4 border-indigo-500': $route.path === '/reports',
                    'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/reports'
                  }"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                  التقارير
                </router-link>
              </div>

              <!-- User Management -->
              <div v-if="canManageUsers" class="space-y-1">
                <p class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  إدارة النظام
                </p>
                
                <router-link 
                  to="/users" 
                  @click="mobileSidebarOpen = false"
                  class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                  :class="{
                    'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-r-4 border-yellow-500': $route.path === '/users',
                    'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/users'
                  }"
                >
                  <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  إدارة المستخدمين
                </router-link>
              </div>

              <!-- Quick Actions Section -->
              <div v-if="canModifyItems" class="mt-6 p-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/10 rounded-xl">
                <p class="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-3">
                  إجراءات سريعة
                </p>
                <div class="space-y-2">
                  <button 
                    @click="openAddItemModal"
                    class="w-full flex items-center justify-center px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    إضافة صنف جديد
                  </button>
                  
                  <div class="grid grid-cols-2 gap-2">
                    <button 
                      @click="openTransferModal"
                      class="flex items-center justify-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                      </svg>
                      نقل
                    </button>
                    
                    <button 
                      @click="openDispatchModal"
                      class="flex items-center justify-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      صرف
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar Footer -->
            <div class="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <router-link 
                to="/profile" 
                @click="mobileSidebarOpen = false"
                class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                إعدادات الحساب
              </router-link>

              <button 
                @click="logout"
                class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                تسجيل خروج
              </button>
            </div>
          </div>
        </aside>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- Mobile Header -->
          <header class="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40">
            <div class="px-4 py-3">
              <div class="flex items-center justify-between">
                <!-- Left: Menu button -->
                <button 
                  @click="mobileSidebarOpen = true"
                  class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="فتح القائمة الجانبية"
                >
                  <svg class="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                </button>

                <!-- Center: Page title -->
                <div class="flex-1 text-center">
                  <h1 class="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {{ getPageTitle(route.name) }}
                  </h1>
                  <p v-if="currentWarehouse" class="text-xs text-primary-600 dark:text-primary-400">
                    {{ currentWarehouse.name }}
                  </p>
                </div>

                <!-- Right: Actions -->
                <div class="flex items-center space-x-2 space-x-reverse">
                  <button 
                    @click="toggleDarkMode"
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                    :aria-label="isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'"
                  >
                    <svg v-if="isDarkMode" class="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
                    </svg>
                    <svg v-else class="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                    </svg>
                  </button>

                  <button 
                    @click="showNotifications"
                    class="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="الإشعارات"
                  >
                    <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                    <span v-if="notificationCount > 0" class="absolute -top-1 -left-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {{ notificationCount > 9 ? '9+' : notificationCount }}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Search Bar -->
            <div v-if="showSearchBar" class="px-4 pb-3">
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
                  placeholder="ابحث عن صنف أو حركة..."
                  class="block w-full pr-10 pl-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  aria-label="بحث"
                />
              </div>
            </div>

            <!-- Dashboard Stats -->
            <div v-if="dashboardStats && $route.path === '/'" class="px-4 pb-3">
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/10 p-3 rounded-xl">
                  <div class="flex items-center">
                    <div class="h-10 w-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center ml-3">
                      <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                      </svg>
                    </div>
                    <div class="text-right">
                      <p class="text-xs text-gray-600 dark:text-gray-400">الأصناف</p>
                      <p class="text-lg font-bold text-gray-900 dark:text-white">{{ dashboardStats.totalItems || 0 }}</p>
                    </div>
                  </div>
                </div>

                <div class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-3 rounded-xl">
                  <div class="flex items-center">
                    <div class="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center ml-3">
                      <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                      </svg>
                    </div>
                    <div class="text-right">
                      <p class="text-xs text-gray-600 dark:text-gray-400">الحركات</p>
                      <p class="text-lg font-bold text-gray-900 dark:text-white">{{ dashboardStats.recentTransactions || 0 }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <!-- Main Content -->
          <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div class="p-4">
              <router-view />
            </div>
          </main>
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
    const mobileSidebarOpen = ref(false);
    const isDarkMode = ref(false);
    const mobileSearchTerm = ref('');

    // Check authentication status
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    
    // Check if current route is public
    const isPublicRoute = computed(() => {
      const publicRoutes = ['Login', 'Unauthorized', 'NotFound'];
      return publicRoutes.includes(route.name);
    });
    
    // Show search bar on specific pages
    const showSearchBar = computed(() => {
      const searchRoutes = ['/', '/inventory', '/transactions'];
      return searchRoutes.includes(route.path);
    });
    
    // Get user info
    const userRole = computed(() => store.getters.userRole);
    const userProfile = computed(() => store.state.userProfile);
    const dashboardStats = computed(() => store.getters.dashboardStats);
    const currentWarehouse = computed(() => store.state.currentWarehouse);
    
    // Notification count
    const notificationCount = computed(() => store.getters.dashboardStats?.lowStockItems || 0);
    
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
    
    const canManageUsers = computed(() => store.getters.canManageUsers);
    const canManageWarehouses = computed(() => store.getters.canManageWarehouses);
    const canViewReports = computed(() => store.getters.userRole === 'superadmin' || store.getters.userRole === 'company_manager');

    // Helper functions
    const getPageTitle = (routeName) => {
      const titles = {
        'Dashboard': 'لوحة التحكم',
        'Inventory': 'الأصناف',
        'Transactions': 'سجل الحركات',
        'Warehouses': 'المخازن',
        'Users': 'المستخدمين',
        'Reports': 'التقارير',
        'Profile': 'الملف الشخصي'
      };
      return titles[routeName] || 'نظام المخزون';
    };

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
        superadmin: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white',
        warehouse_manager: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
        company_manager: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
      };
      return classes[userRole.value] || 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    });

    // Dark mode initialization
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

    const showNotifications = () => {
      router.push('/transactions');
      mobileSidebarOpen.value = false;
    };

    const openAddItemModal = () => {
      mobileSidebarOpen.value = false;
      window.dispatchEvent(new CustomEvent('open-add-item-modal'));
    };

    const openTransferModal = () => {
      mobileSidebarOpen.value = false;
      window.dispatchEvent(new CustomEvent('open-transfer-modal'));
    };

    const openDispatchModal = () => {
      mobileSidebarOpen.value = false;
      window.dispatchEvent(new CustomEvent('open-dispatch-modal'));
    };

    // Handle mobile search
    const handleMobileSearch = debounce(() => {
      window.dispatchEvent(new CustomEvent('mobile-search', { 
        detail: { searchTerm: mobileSearchTerm.value } 
      }));
    }, 300);

    const handleMobileSearchEnter = () => {
      if (route.path !== '/inventory') {
        router.push('/inventory');
      }
      window.dispatchEvent(new CustomEvent('mobile-search', { 
        detail: { searchTerm: mobileSearchTerm.value, immediate: true } 
      }));
    };

    // Fixed logout function
    const logout = async () => {
      try {
        mobileSidebarOpen.value = false;
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
        }
        
        initializeDarkMode();
        
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

        // Close sidebar on escape key
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            mobileSidebarOpen.value = false;
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

    // Close sidebar when route changes
    watch(() => route.path, () => {
      mobileSidebarOpen.value = false;
    });

    return {
      initializing,
      isAuthenticated,
      isPublicRoute,
      showSearchBar,
      mobileSidebarOpen,
      isDarkMode,
      mobileSearchTerm,
      notificationCount,
      dashboardStats,
      userRole,
      userProfile,
      currentWarehouse,
      canModifyItems,
      canManageUsers,
      canManageWarehouses,
      canViewReports,
      getPageTitle,
      getRoleName,
      getUserInitials,
      roleBadgeClass,
      toggleDarkMode,
      showNotifications,
      openAddItemModal,
      openTransferModal,
      openDispatchModal,
      handleMobileSearch,
      handleMobileSearchEnter,
      logout
    };
  }
};
</script>

<style scoped>
/* Custom CSS variables for consistent theming */
:root {
  --primary-50: #fefce8;
  --primary-100: #fef9c3;
  --primary-500: #eab308;
  --primary-600: #ca8a04;
  --primary-900: #713f12;
}

.dark {
  --primary-50: #1c1917;
  --primary-100: #292524;
  --primary-500: #eab308;
  --primary-600: #facc15;
  --primary-900: #fef9c3;
}

/* Smooth transitions */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
}

/* Improved focus states for accessibility */
button:focus-visible,
[role="button"]:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
  border-radius: 0.5rem;
}

/* Better scrollbar for sidebar */
aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.dark aside::-webkit-scrollbar-track {
  background: #2d3748;
}

aside::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.dark aside::-webkit-scrollbar-thumb {
  background: #4a5568;
}

/* Safe area for mobile */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* Animation for sidebar */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Touch feedback */
button:active {
  transform: scale(0.98);
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

/* Prevent body scroll when sidebar is open */
body:has(.mobile-sidebar-open) {
  overflow: hidden;
}

/* Z-index layering */
#app {
  isolation: isolate;
}

.fixed {
  z-index: 50;
}

.bg-black.bg-opacity-50 {
  z-index: 40;
}

.sticky {
  z-index: 30;
}

/* Grid improvements */
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

/* Gradient borders */
.border-r-4 {
  border-right-width: 4px;
}

/* Enhanced hover effects */
.hover\:bg-gray-100:hover {
  background-color: rgba(243, 244, 246, 0.8);
}

.dark .hover\:bg-gray-700:hover {
  background-color: rgba(55, 65, 81, 0.8);
}

/* Animation for notifications */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>