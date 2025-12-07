<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <!-- Mobile Header -->
    <header class="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div class="px-4 py-3">
        <div class="flex items-center justify-between">
          <!-- Sidebar Toggle -->
          <button @click="toggleSidebar" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <svg class="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!sidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Logo & Title -->
          <div class="flex items-center">
            <div class="h-10 w-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="mr-3">
              <h1 class="text-lg font-bold text-gray-900 dark:text-white">لوحة التحكم</h1>
              <p class="text-xs text-gray-600 dark:text-gray-400">{{ getUserRoleName }}</p>
            </div>
          </div>

          <!-- User Menu -->
          <div class="flex items-center space-x-3 rtl:space-x-reverse">
            <!-- Notification Bell -->
            <button @click="toggleNotifications" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative">
              <svg class="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span v-if="notificationCount > 0" class="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- Dark Mode Toggle -->
            <button @click="toggleDarkMode" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg v-if="isDarkMode" class="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              <svg v-else class="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Sidebar Overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 z-40" @click="sidebarOpen = false">
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
    </div>

    <!-- Sidebar -->
    <aside :class="['fixed top-0 right-0 h-full z-50 w-64 transform transition-transform duration-300 ease-in-out', 
                    sidebarOpen ? 'translate-x-0' : 'translate-x-full']">
      <div class="h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col shadow-2xl">
        <!-- Sidebar Header -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-800">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">القائمة</h2>
            <button @click="sidebarOpen = false" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg class="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <!-- User Info -->
          <div class="flex items-center mb-6">
            <div class="h-12 w-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {{ userName.charAt(0) }}
            </div>
            <div class="mr-3">
              <h3 class="font-bold text-gray-900 dark:text-white">{{ userName }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ getUserRoleName }}</p>
            </div>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="flex-1 overflow-y-auto px-4 py-2">
          <!-- Dashboard -->
          <router-link to="/dashboard" @click="sidebarOpen = false" 
                       :class="['flex items-center p-3 rounded-xl mb-2 transition-colors', 
                               $route.path === '/dashboard' 
                                 ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                                 : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300']">
            <svg class="h-5 w-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span>الرئيسية</span>
          </router-link>

          <!-- Inventory -->
          <router-link to="/inventory" @click="sidebarOpen = false"
                       :class="['flex items-center p-3 rounded-xl mb-2 transition-colors', 
                               $route.path.startsWith('/inventory') 
                                 ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                                 : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300']">
            <svg class="h-5 w-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
            </svg>
            <span>المخزون</span>
          </router-link>

          <!-- Transactions -->
          <router-link to="/transactions" @click="sidebarOpen = false"
                       :class="['flex items-center p-3 rounded-xl mb-2 transition-colors', 
                               $route.path === '/transactions' 
                                 ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                                 : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300']">
            <svg class="h-5 w-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <span>الحركات</span>
          </router-link>

          <!-- Transfers -->
          <router-link v-if="canModifyItems" to="/transfers" @click="sidebarOpen = false"
                       :class="['flex items-center p-3 rounded-xl mb-2 transition-colors', 
                               $route.path === '/transfers' 
                                 ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                                 : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300']">
            <svg class="h-5 w-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
            <span>النقل بين المخازن</span>
          </router-link>

          <!-- Dispatch -->
          <router-link v-if="canModifyItems && canDispatch" to="/dispatch" @click="sidebarOpen = false"
                       :class="['flex items-center p-3 rounded-xl mb-2 transition-colors', 
                               $route.path === '/dispatch' 
                                 ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                                 : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300']">
            <svg class="h-5 w-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m6 4l4-4m0 0l4 4m-4-4v12"/>
            </svg>
            <span>الصرف الخارجي</span>
          </router-link>

          <!-- Reports -->
          <router-link v-if="canViewReports" to="/reports" @click="sidebarOpen = false"
                       :class="['flex items-center p-3 rounded-xl mb-2 transition-colors', 
                               $route.path === '/reports' 
                                 ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                                 : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300']">
            <svg class="h-5 w-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span>التقارير</span>
          </router-link>

          <!-- Warehouses -->
          <router-link v-if="canManageUsers" to="/warehouses" @click="sidebarOpen = false"
                       :class="['flex items-center p-3 rounded-xl mb-2 transition-colors', 
                               $route.path === '/warehouses' 
                                 ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                                 : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300']">
            <svg class="h-5 w-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            <span>المخازن</span>
          </router-link>

          <!-- Users -->
          <router-link v-if="canManageUsers" to="/users" @click="sidebarOpen = false"
                       :class="['flex items-center p-3 rounded-xl mb-2 transition-colors', 
                               $route.path === '/users' 
                                 ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                                 : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300']">
            <svg class="h-5 w-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-6.197a6 6 0 00-9-5.197M9 10h.01"/>
            </svg>
            <span>المستخدمين</span>
          </router-link>

          <!-- Settings -->
          <router-link to="/settings" @click="sidebarOpen = false"
                       :class="['flex items-center p-3 rounded-xl mb-2 transition-colors', 
                               $route.path === '/settings' 
                                 ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                                 : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300']">
            <svg class="h-5 w-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>الإعدادات</span>
          </router-link>
        </nav>

        <!-- Sidebar Footer -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-800">
          <button @click="logout" class="w-full flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:shadow-lg transition-all">
            <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            تسجيل الخروج
          </button>
          
          <div class="mt-4 text-center">
            <p class="text-xs text-gray-500 dark:text-gray-400">
              نظام إدارة المخازن
              <br>
              الإصدار 1.0.0
            </p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Navigation Toast -->
    <div v-if="navigationError" class="fixed top-20 right-4 left-4 z-50 animate-slide-down">
      <div class="bg-gradient-to-r from-red-500/90 to-pink-500/90 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between backdrop-blur-md border border-white/20">
        <div class="flex items-center">
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="flex-1">{{ navigationError }}</span>
        </div>
        <button @click="navigationError = ''" class="ml-4 hover:text-red-100 transition-colors">
          <svg class="h-5 w-5 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="pb-20 px-4">
      <!-- Welcome Card -->
      <div class="mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-xl p-6">
        <div class="text-white">
          <h2 class="text-xl font-bold mb-2">مرحباً، {{ userName }}</h2>
          <p class="text-blue-100 opacity-90 text-sm">آخر تحديث: {{ formatTime(lastUpdate) }}</p>
          <div class="mt-4 flex items-center space-x-4 rtl:space-x-reverse">
            <button @click="refreshData" :disabled="loading" 
                    class="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all">
              <svg :class="{'animate-spin': loading}" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <span class="text-sm">تحديث</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Grid - 4 Cards -->
      <div class="grid grid-cols-2 gap-4 mt-6">
        <!-- Total Items -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition-shadow"
             @click="navigateTo('/inventory')">
          <div class="flex items-center mb-3">
            <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
              <svg class="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <span class="text-xs text-green-600 dark:text-green-400 ml-auto">{{ statsPercentage.totalItems > 0 ? '+' : '' }}{{ statsPercentage.totalItems }}%</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ formatNumber(dashboardStats.totalItems) }}</h3>
          <p class="text-xs text-gray-600 dark:text-gray-400">الأصناف</p>
        </div>

        <!-- Total Quantity -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition-shadow"
             @click="navigateTo('/inventory?view=quantities')">
          <div class="flex items-center mb-3">
            <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
              <svg class="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="text-xs text-green-600 dark:text-green-400 ml-auto">{{ statsPercentage.totalQuantity > 0 ? '+' : '' }}{{ statsPercentage.totalQuantity }}%</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ formatNumber(dashboardStats.totalQuantity) }}</h3>
          <p class="text-xs text-gray-600 dark:text-gray-400">الكمية</p>
        </div>

        <!-- Low Stock -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition-shadow"
             @click="navigateTo('/inventory?status=low')">
          <div class="flex items-center mb-3">
            <div class="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg mr-3">
              <svg class="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="text-xs text-orange-600 dark:text-orange-400 ml-auto">{{ statsPercentage.lowStockItems > 0 ? '+' : '' }}{{ statsPercentage.lowStockItems }}%</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ formatNumber(dashboardStats.lowStockItems) }}</h3>
          <p class="text-xs text-gray-600 dark:text-gray-400">منخفضة</p>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition-shadow"
             @click="navigateTo('/transactions')">
          <div class="flex items-center mb-3">
            <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
              <svg class="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <span class="text-xs text-green-600 dark:text-green-400 ml-auto">{{ statsPercentage.recentTransactions > 0 ? '+' : '' }}{{ statsPercentage.recentTransactions }}%</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ formatNumber(dashboardStats.recentTransactions) }}</h3>
          <p class="text-xs text-gray-600 dark:text-gray-400">حركات</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">إجراءات سريعة</h3>
        <div class="grid grid-cols-2 gap-3">
          <button v-if="canModifyItems" @click="navigateTo('/inventory/add')" 
                  class="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium py-3 rounded-xl shadow-lg flex items-center justify-center hover:shadow-xl transition-all">
            <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            إضافة صنف
          </button>

          <button v-if="canModifyItems" @click="navigateTo('/transfers')"
                  class="bg-gradient-to-r from-green-600 to-emerald-500 text-white font-medium py-3 rounded-xl shadow-lg flex items-center justify-center hover:shadow-xl transition-all">
            <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
            نقل مخزون
          </button>

          <button v-if="canModifyItems && canDispatch" @click="navigateTo('/dispatch')"
                  class="bg-gradient-to-r from-orange-600 to-amber-500 text-white font-medium py-3 rounded-xl shadow-lg flex items-center justify-center hover:shadow-xl transition-all">
            <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m6 4l4-4m0 0l4 4m-4-4v12"/>
            </svg>
            صرف خارجي
          </button>

          <button v-if="canViewReports" @click="navigateTo('/reports')"
                  class="bg-gradient-to-r from-purple-600 to-violet-500 text-white font-medium py-3 rounded-xl shadow-lg flex items-center justify-center hover:shadow-xl transition-all">
            <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            التقارير
          </button>

          <button v-else @click="exportData"
                  class="bg-gradient-to-r from-purple-600 to-violet-500 text-white font-medium py-3 rounded-xl shadow-lg flex items-center justify-center hover:shadow-xl transition-all">
            <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            تصدير
          </button>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="mt-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">آخر الحركات</h3>
          <a @click="navigateTo('/transactions')" class="text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
            عرض الكل
          </a>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow">
          <div v-if="recentTransactionsLoading" class="p-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">جاري التحميل...</p>
          </div>

          <div v-else-if="recentTransactions.length === 0" class="p-8 text-center">
            <svg class="h-12 w-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">لا توجد حركات حديثة</p>
            <button @click="navigateTo('/transactions')" class="mt-4 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              عرض جميع الحركات
            </button>
          </div>

          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <div v-for="transaction in recentTransactions.slice(0, 5)" :key="transaction.id" 
                 class="p-4 flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                 @click="viewTransaction(transaction)">
              <div :class="getTransactionColor(transaction.type)" class="h-10 w-10 rounded-lg flex items-center justify-center mr-3">
                <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ getTransactionLabel(transaction.type) }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(transaction.timestamp) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ transaction.quantity || 0 }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">وحدة</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- My Warehouses -->
      <div v-if="accessibleWarehouses.length > 0" class="mt-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">مخازني</h3>
          <a v-if="canManageUsers" @click="navigateTo('/warehouses')" class="text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
            إدارة المخازن
          </a>
        </div>
        <div class="space-y-3">
          <div v-for="warehouse in accessibleWarehouses.slice(0, 3)" :key="warehouse.id" 
               class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition-shadow"
               @click="navigateToWarehouse(warehouse.id)">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center">
                <div class="h-8 w-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                  {{ warehouse.name_ar.charAt(0) }}
                </div>
                <span class="font-medium text-gray-900 dark:text-white">{{ warehouse.name_ar }}</span>
              </div>
              <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full">
                {{ getWarehouseStats(warehouse.id).items }} أصناف
              </span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-blue-500 h-2 rounded-full" :style="{ width: getWarehouseFillPercentage(warehouse.id) + '%' }"></div>
            </div>
            <div class="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
              <span>{{ formatNumber(getWarehouseStats(warehouse.id).quantity) }} وحدة</span>
              <span>{{ getWarehouseFillPercentage(warehouse.id) }}% إشغال</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40">
      <div class="flex justify-around py-3">
        <a @click="navigateTo('/dashboard')" 
           :class="{'text-blue-600 dark:text-blue-400': $route.path === '/dashboard', 'text-gray-600 dark:text-gray-400': $route.path !== '/dashboard'}"
           class="flex flex-col items-center cursor-pointer">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span class="text-xs mt-1">الرئيسية</span>
        </a>

        <a @click="navigateTo('/inventory')" 
           :class="{'text-blue-600 dark:text-blue-400': $route.path.startsWith('/inventory'), 'text-gray-600 dark:text-gray-400': !$route.path.startsWith('/inventory')}"
           class="flex flex-col items-center cursor-pointer">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
          </svg>
          <span class="text-xs mt-1">المخزون</span>
        </a>

        <a @click="toggleSidebar" 
           class="flex flex-col items-center cursor-pointer">
          <div class="h-10 w-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-lg -mt-4">
            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </div>
        </a>

        <a @click="navigateTo('/transactions')" 
           :class="{'text-blue-600 dark:text-blue-400': $route.path === '/transactions', 'text-gray-600 dark:text-gray-400': $route.path !== '/transactions'}"
           class="flex flex-col items-center cursor-pointer">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <span class="text-xs mt-1">الحركات</span>
        </a>

        <a @click="exportData" 
           class="flex flex-col items-center cursor-pointer text-gray-600 dark:text-gray-400">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span class="text-xs mt-1">تصدير</span>
        </a>
      </div>
    </nav>

    <!-- Notifications Dropdown -->
    <div v-if="showNotifications" class="fixed inset-0 z-50" @click="showNotifications = false">
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl max-h-80 overflow-y-auto"
           @click.stop>
        <div class="p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">الإشعارات</h3>
            <button @click="showNotifications = false" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg class="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div v-if="notificationCount === 0" class="text-center py-8">
            <p class="text-gray-600 dark:text-gray-400">لا توجد إشعارات جديدة</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="notification in lowStockNotifications" :key="notification.id" 
                 class="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/30"
                 @click="navigateTo('/inventory?status=low')">
              <div class="flex items-start">
                <svg class="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">تحذير المخزون</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ notification.message }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '../firebase/config';

export default {
  name: 'MobileDashboard',
  
  data() {
    return {
      sidebarOpen: false,
      isDarkMode: false,
      loading: false,
      showNotifications: false,
      lastUpdate: new Date(),
      navigationError: '',
      statsPercentage: {
        totalItems: 12,
        totalQuantity: 8,
        lowStockItems: 3,
        recentTransactions: 15
      }
    };
  },
  
  computed: {
    userRole() {
      return this.$store.getters.userRole;
    },
    
    userName() {
      return this.$store.getters.userName || 'مستخدم';
    },
    
    dashboardStats() {
      return this.$store.getters.dashboardStats || {
        totalItems: 0,
        totalQuantity: 0,
        lowStockItems: 0,
        recentTransactions: 0
      };
    },
    
    recentTransactions() {
      return this.$store.state.recentTransactions || [];
    },
    
    recentTransactionsLoading() {
      return this.$store.state.recentTransactionsLoading || false;
    },
    
    inventory() {
      return this.$store.state.inventory || [];
    },
    
    accessibleWarehouses() {
      return this.$store.getters.accessibleWarehouses || [];
    },
    
    canModifyItems() {
      return this.$store.getters.canEdit || false;
    },
    
    canDispatch() {
      return this.$store.getters.canDispatch || false;
    },
    
    canManageUsers() {
      return this.$store.getters.canManageUsers || false;
    },
    
    canViewReports() {
      return this.$store.getters.userRole === 'superadmin' || 
             this.$store.getters.userRole === 'company_manager';
    },
    
    notificationCount() {
      return this.dashboardStats.lowStockItems || 0;
    },
    
    getUserRoleName() {
      const roles = {
        superadmin: 'المشرف العام',
        warehouse_manager: 'مدير المخازن',
        company_manager: 'مدير الشركة',
        user: 'مستخدم'
      };
      return roles[this.userRole] || 'مستخدم';
    },
    
    lowStockNotifications() {
      const lowStockItems = this.inventory.filter(item => 
        (item.remaining_quantity || 0) < 10 && (item.remaining_quantity || 0) > 0
      ).slice(0, 5);
      
      return lowStockItems.map(item => ({
        id: item.id,
        message: `الصنف ${item.name || item.code} منخفض المخزون (${item.remaining_quantity} وحدة)`
      }));
    }
  },
  
  created() {
    // Check theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    }
    
    // Update time every minute
    setInterval(() => {
      this.lastUpdate = new Date();
    }, 60000);
    
    // Listen for auth state changes
    this.$store.watch(
      state => state.user,
      (newUser, oldUser) => {
        if (!newUser && oldUser) {
          // User logged out
          this.$router.push('/login');
        }
      }
    );
  },
  
  mounted() {
    console.log('MobileDashboard mounted');
    this.refreshData();
  },
  
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      document.documentElement.classList.toggle('dark', this.isDarkMode);
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    },
    
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
    },
    
    async refreshData() {
      this.loading = true;
      try {
        await this.$store.dispatch('getRecentTransactions');
        this.lastUpdate = new Date();
        this.showSuccess('تم تحديث البيانات بنجاح');
      } catch (error) {
        console.error('Error refreshing data:', error);
        this.showError('حدث خطأ في تحديث البيانات');
      } finally {
        this.loading = false;
      }
    },
    
    async navigateTo(path) {
      try {
        // Close sidebar if open
        if (this.sidebarOpen) {
          this.sidebarOpen = false;
        }
        
        // Check if user has permission for the route
        const canAccess = await this.checkRoutePermission(path);
        if (!canAccess) {
          this.navigationError = 'ليس لديك صلاحية للوصول إلى هذه الصفحة';
          setTimeout(() => {
            this.navigationError = '';
          }, 3000);
          return;
        }
        
        // Navigate using Vue Router
        await this.$router.push(path);
        
      } catch (error) {
        console.error('Navigation error:', error);
        
        if (error.name !== 'NavigationDuplicated') {
          this.navigationError = 'حدث خطأ في التنقل إلى الصفحة';
          setTimeout(() => {
            this.navigationError = '';
          }, 3000);
        }
      }
    },
    
    async checkRoutePermission(path) {
      try {
        // Check if user is authenticated
        if (!auth.currentUser) {
          return false;
        }
        
        // Public routes
        if (['/login', '/register', '/forgot-password'].includes(path)) {
          return true;
        }
        
        // Get user role from store
        const userRole = this.$store.getters.userRole;
        if (!userRole) {
          return false;
        }
        
        // Check role-based access
        if (path.includes('/admin') && !['superadmin', 'company_manager'].includes(userRole)) {
          return false;
        }
        
        if (path.includes('/users') && !['superadmin'].includes(userRole)) {
          return false;
        }
        
        if (path.includes('/warehouses') && !['superadmin', 'company_manager'].includes(userRole)) {
          return false;
        }
        
        return true;
        
      } catch (error) {
        console.error('Permission check error:', error);
        return false;
      }
    },
    
    async logout() {
      try {
        await this.$store.dispatch('logout');
        await this.$router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
        this.showError('حدث خطأ في تسجيل الخروج');
      }
    },
    
    exportData() {
      this.showInfo('جاري تصدير البيانات...');
      // Implement export logic here
      setTimeout(() => {
        this.showSuccess('تم تصدير البيانات بنجاح');
      }, 1500);
    },
    
    navigateToWarehouse(warehouseId) {
      this.navigateTo(`/inventory?warehouse=${warehouseId}`);
    },
    
    viewTransaction(transaction) {
      this.navigateTo(`/transactions/${transaction.id}`);
    },
    
    getWarehouseStats(warehouseId) {
      const items = this.inventory.filter(item => item.warehouse_id === warehouseId);
      return {
        items: items.length,
        quantity: items.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0)
      };
    },
    
    getWarehouseFillPercentage(warehouseId) {
      const warehouse = this.accessibleWarehouses.find(w => w.id === warehouseId);
      if (!warehouse?.capacity) return 0;
      
      const items = this.getWarehouseStats(warehouseId).items;
      return Math.min(Math.round((items / warehouse.capacity) * 100), 100);
    },
    
    formatNumber(num) {
      const number = Number(num) || 0;
      return new Intl.NumberFormat('ar-EG').format(number);
    },
    
    formatTime(date) {
      if (!date) return '';
      try {
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleTimeString('ar-EG', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
      } catch (error) {
        return '';
      }
    },
    
    getTransactionColor(type) {
      const colors = {
        add: 'bg-gradient-to-r from-emerald-500 to-green-600',
        transfer: 'bg-gradient-to-r from-blue-500 to-cyan-600',
        dispatch: 'bg-gradient-to-r from-orange-500 to-amber-600',
        receive: 'bg-gradient-to-r from-violet-500 to-purple-600'
      };
      return colors[type] || 'bg-gradient-to-r from-gray-500 to-gray-600';
    },
    
    getTransactionLabel(type) {
      const labels = {
        add: 'إضافة صنف',
        transfer: 'نقل بين مخازن',
        dispatch: 'صرف خارجي',
        receive: 'استلام صنف'
      };
      return labels[type] || type;
    },
    
    showSuccess(message) {
      this.$store.dispatch('showNotification', {
        type: 'success',
        message: message
      });
    },
    
    showError(message) {
      this.$store.dispatch('showNotification', {
        type: 'error',
        message: message
      });
    },
    
    showInfo(message) {
      this.$store.dispatch('showNotification', {
        type: 'info',
        message: message
      });
    }
  }
};
</script>

<style scoped>
/* Animation for sidebar */
.transform {
  transition: transform 0.3s ease-in-out;
}

.translate-x-full {
  transform: translateX(100%);
}

.translate-x-0 {
  transform: translateX(0);
}

/* Animation for notifications */
.animate-slide-down {
  animation: slide-down 0.3s ease-out;
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

/* Safe area for mobile navigation */
@supports (padding: max(0px)) {
  .fixed.bottom-0 {
    padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
  }
}

/* Active navigation states */
.text-blue-600 {
  color: #2563eb;
}

.dark .text-blue-400 {
  color: #60a5fa;
}

/* Loading spinner */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Hover effects */
.cursor-pointer:hover {
  opacity: 0.9;
}

/* Scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.dark .overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}
</style>
