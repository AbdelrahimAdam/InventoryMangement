<template>
  <div id="app" dir="rtl" class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-all duration-300">
    <!-- Show loading while initializing -->
    <div v-if="initializing" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400 font-medium">جاري التحميل...</p>
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
          <!-- Mobile Header - Clean & Compact -->
          <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 safe-area-top shadow-sm">
            <div class="px-4 py-3">
              <div class="flex items-center justify-between">
                <!-- Left: Menu button and logo -->
                <div class="flex items-center gap-2">
                  <button 
                    @click="toggleMobileMenu"
                    class="p-2 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 hover:from-blue-100 hover:to-blue-200 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-200 touch-target shadow-sm hover:shadow"
                    :aria-label="mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'"
                    :aria-expanded="mobileMenuOpen"
                    aria-controls="mobile-menu"
                  >
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <router-link 
                    to="/" 
                    class="flex items-center gap-2 touch-target" 
                    @click="closeAllMenus"
                    aria-label="الرئيسية"
                  >
                    <div class="h-9 w-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div class="text-right">
                      <h1 class="text-sm font-bold text-gray-900 dark:text-white leading-tight">نظام إدارة المخازن</h1>
                      <p class="text-[11px] text-blue-500 dark:text-blue-400 font-medium">الإصدار الذهبي</p>
                    </div>
                  </router-link>
                </div>

                <!-- Right: Dark mode and Notifications -->
                <div class="flex items-center gap-1">
                  <button 
                    @click="toggleDarkMode"
                    class="p-2 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 hover:from-blue-100 hover:to-blue-200 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-200 touch-target shadow-sm hover:shadow"
                    :aria-label="isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'"
                  >
                    <svg v-if="isDarkMode" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
                    </svg>
                    <svg v-else class="w-4 h-4 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                    </svg>
                  </button>

                  <button 
                    @click="handleNotifications"
                    class="relative p-2 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 hover:from-blue-100 hover:to-blue-200 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-200 touch-target shadow-sm hover:shadow"
                    aria-label="الإشعارات"
                  >
                    <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0.538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                    <span 
                      v-if="notificationCount > 0" 
                      class="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-br from-red-500 to-pink-500 text-white text-[10px] rounded-full flex items-center justify-center border border-white dark:border-gray-900 font-bold"
                    >
                      {{ notificationCount > 9 ? '9+' : notificationCount }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          <!-- Mobile Menu Overlay -->
          <div 
            v-if="mobileMenuOpen" 
            class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300"
            @click="closeAllMenus"
            aria-hidden="true"
          ></div>

          <!-- Mobile Menu Drawer - Apple Style -->
          <div 
            v-if="mobileMenuOpen"
            id="mobile-menu"
            class="fixed inset-y-0 right-0 z-50 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl transform transition-all duration-300 ease-out"
            :class="mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'"
            role="dialog"
            aria-modal="true"
            aria-label="القائمة الرئيسية"
          >
            <div class="h-full flex flex-col overflow-hidden">
              <!-- User Profile Header -->
              <div class="px-6 py-5 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-gray-800/50 dark:to-gray-900/50">
                <div class="flex items-center">
                  <div class="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg ml-3">
                    <span class="text-white font-bold text-base">
                      {{ getUserInitials(userProfile?.name || userProfile?.email) }}
                    </span>
                  </div>
                  <div class="text-right flex-1 min-w-0">
                    <p class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ userProfile?.name || userProfile?.email }}</p>
                    <p class="text-xs text-blue-500 dark:text-blue-400 font-medium truncate">{{ userProfile?.email }}</p>
                  </div>
                  <span 
                    :class="['inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm', roleBadgeClass]"
                    aria-label="دور المستخدم"
                  >
                    {{ getRoleName(userRole) }}
                  </span>
                </div>
              </div>

              <!-- Navigation Links - Apple Style -->
              <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto" aria-label="روابط التنقل">
                <router-link 
                  to="/" 
                  @click="closeAllMenus"
                  class="flex items-center px-4 py-3 rounded-xl mx-2 transition-all duration-200 group touch-target"
                  :class="{
                    'bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-200/50 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 shadow-sm': $route.path === '/',
                    'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:shadow-sm': $route.path !== '/'
                  }"
                  :aria-current="$route.path === '/' ? 'page' : null"
                >
                  <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center ml-3 group-hover:from-blue-500/30 group-hover:to-blue-500/20 transition-all duration-200">
                    <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                  </div>
                  <div class="text-right flex-1">
                    <p class="text-sm font-medium">لوحة التحكم</p>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">نظرة عامة على النظام</p>
                  </div>
                </router-link>

                <!-- Quick Actions Section -->
                <div class="px-4 pt-2">
                  <p class="text-xs font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider mb-3">
                    ⚡ إجراءات سريعة
                  </p>
                  <div class="grid grid-cols-2 gap-2 px-2">
                    <button 
                      @click="openAddItemModal"
                      class="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-gray-800/50 dark:to-gray-900/50 hover:from-blue-100 hover:to-blue-200/50 dark:hover:from-gray-700 dark:hover:to-gray-800/50 border border-blue-200/50 dark:border-blue-800/50 transition-all duration-200 touch-target shadow-sm hover:shadow group"
                      aria-label="إضافة صنف جديد"
                    >
                      <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-2 shadow-sm group-hover:shadow transition-all duration-200">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/>
                        </svg>
                      </div>
                      <span class="text-xs font-medium text-gray-700 dark:text-gray-300">إضافة صنف</span>
                    </button>

                    <button 
                      @click="openTransferModal"
                      class="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-gray-800/50 dark:to-gray-900/50 hover:from-blue-100 hover:to-blue-200/50 dark:hover:from-gray-700 dark:hover:to-gray-800/50 border border-blue-200/50 dark:border-blue-800/50 transition-all duration-200 touch-target shadow-sm hover:shadow group"
                      aria-label="نقل بين المخازن"
                    >
                      <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-2 shadow-sm group-hover:shadow transition-all duration-200">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                        </svg>
                      </div>
                      <span class="text-xs font-medium text-gray-700 dark:text-gray-300">نقل مخزون</span>
                    </button>

                    <button 
                      @click="openDispatchModal"
                      class="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-gray-800/50 dark:to-gray-900/50 hover:from-blue-100 hover:to-blue-200/50 dark:hover:from-gray-700 dark:hover:to-gray-800/50 border border-blue-200/50 dark:border-blue-800/50 transition-all duration-200 touch-target shadow-sm hover:shadow group"
                      aria-label="صرف إلى خارجي"
                    >
                      <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-2 shadow-sm group-hover:shadow transition-all duration-200">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                      </div>
                      <span class="text-xs font-medium text-gray-700 dark:text-gray-300">صرف خارجي</span>
                    </button>

                    <button 
                      v-if="canManageWarehouses"
                      @click="openAddWarehouseModal"
                      class="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-gray-800/50 dark:to-gray-900/50 hover:from-blue-100 hover:to-blue-200/50 dark:hover:from-gray-700 dark:hover:to-gray-800/50 border border-blue-200/50 dark:border-blue-800/50 transition-all duration-200 touch-target shadow-sm hover:shadow group"
                      aria-label="إضافة مخزن جديد"
                    >
                      <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-2 shadow-sm group-hover:shadow transition-all duration-200">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                      </div>
                      <span class="text-xs font-medium text-gray-700 dark:text-gray-300">إضافة مخزن</span>
                    </button>
                  </div>
                </div>

                <!-- Main Navigation -->
                <div class="px-4 pt-4">
                  <p class="text-xs font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider mb-3">
                    📂 التنقل الرئيسي
                  </p>
                  <div class="space-y-1">
                    <router-link 
                      to="/users" 
                      @click="closeAllMenus"
                      class="flex items-center px-4 py-3 rounded-xl mx-2 transition-all duration-200 group touch-target"
                      :class="{
                        'bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-200/50 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 shadow-sm': $route.path === '/users',
                        'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:shadow-sm': $route.path !== '/users'
                      }"
                    >
                      <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center ml-3 group-hover:from-blue-500/30 group-hover:to-blue-500/20 transition-all duration-200">
                        <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <div class="text-right flex-1">
                        <p class="text-sm font-medium">إدارة المستخدمين</p>
                        <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">إدارة صلاحيات وصول المستخدمين</p>
                      </div>
                    </router-link>

                    <router-link 
                      to="/transactions" 
                      @click="closeAllMenus"
                      class="flex items-center px-4 py-3 rounded-xl mx-2 transition-all duration-200 group touch-target"
                      :class="{
                        'bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-200/50 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 shadow-sm': $route.path === '/transactions',
                        'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:shadow-sm': $route.path !== '/transactions'
                      }"
                    >
                      <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center ml-3 group-hover:from-blue-500/30 group-hover:to-blue-500/20 transition-all duration-200">
                        <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                      </div>
                      <div class="text-right flex-1">
                        <p class="text-sm font-medium">سجل الحركات</p>
                        <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">تاريخ كامل لعمليات المخزون</p>
                      </div>
                    </router-link>

                    <router-link 
                      v-if="canViewReports"
                      to="/reports" 
                      @click="closeAllMenus"
                      class="flex items-center px-4 py-3 rounded-xl mx-2 transition-all duration-200 group touch-target"
                      :class="{
                        'bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-200/50 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 shadow-sm': $route.path === '/reports',
                        'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:shadow-sm': $route.path !== '/reports'
                      }"
                    >
                      <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center ml-3 group-hover:from-blue-500/30 group-hover:to-blue-500/20 transition-all duration-200">
                        <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a22 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                      </div>
                      <div class="text-right flex-1">
                        <p class="text-sm font-medium">التقارير</p>
                        <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">تحليلات وإحصائيات المخزون</p>
                      </div>
                    </router-link>

                    <router-link 
                      v-if="canManageWarehouses"
                      to="/warehouses" 
                      @click="closeAllMenus"
                      class="flex items-center px-4 py-3 rounded-xl mx-2 transition-all duration-200 group touch-target"
                      :class="{
                        'bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-200/50 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 shadow-sm': $route.path === '/warehouses',
                        'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:shadow-sm': $route.path !== '/warehouses'
                      }"
                    >
                      <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center ml-3 group-hover:from-blue-500/30 group-hover:to-blue-500/20 transition-all duration-200">
                        <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                      </div>
                      <div class="text-right flex-1">
                        <p class="text-sm font-medium">إدارة المخازن</p>
                        <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">تحكم كامل في المخازن</p>
                      </div>
                    </router-link>

                    <router-link 
                      to="/profile" 
                      @click="closeAllMenus"
                      class="flex items-center px-4 py-3 rounded-xl mx-2 transition-all duration-200 group touch-target"
                      :class="{
                        'bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-200/50 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 shadow-sm': $route.path === '/profile',
                        'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:shadow-sm': $route.path !== '/profile'
                      }"
                    >
                      <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center ml-3 group-hover:from-blue-500/30 group-hover:to-blue-500/20 transition-all duration-200">
                        <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                      </div>
                      <div class="text-right flex-1">
                        <p class="text-sm font-medium">إعدادات الحساب</p>
                        <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">تخصيص حسابك الشخصي</p>
                      </div>
                    </router-link>
                  </div>
                </div>
              </nav>

              <!-- Logout Button -->
              <div class="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50">
                <button 
                  @click="logout"
                  class="w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-br from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition-all duration-200 touch-target shadow-md hover:shadow-lg active:scale-[0.98]"
                  aria-label="تسجيل خروج"
                >
                  <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  تسجيل خروج
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- Router view with proper spacing -->
          <div 
            ref="contentArea"
            class="flex-1 overflow-y-auto smooth-scroll"
            :class="{
              'pt-16 lg:pt-0': isAuthenticated && $route.path !== '/login',
              'pb-20 lg:pb-0': showBottomNav
            }"
          >
            <router-view />
          </div>

          <!-- Mobile Bottom Navigation - Clean & Modern -->
          <nav 
            v-if="isAuthenticated && showBottomNav" 
            class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 safe-area-bottom shadow-lg"
            aria-label="التنقل السفلي"
          >
            <div class="flex justify-around p-2">
              <router-link
                to="/" 
                class="flex flex-col items-center p-2 flex-1 transition-all duration-200 touch-target rounded-xl"
                :class="{
                  'text-blue-600 dark:text-blue-400': $route.path === '/',
                  'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400': $route.path !== '/'
                }"
                @click="closeAllMenus"
                :aria-current="$route.path === '/' ? 'page' : null"
              >
                <div class="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200"
                  :class="{
                    'bg-gradient-to-br from-blue-500/20 to-blue-500/10 border border-blue-200/50 dark:border-blue-800/50 shadow-sm': $route.path === '/',
                    'hover:bg-gray-100/50 dark:hover:bg-gray-800/50': $route.path !== '/'
                  }"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                </div>
                <span class="text-[10px] font-medium mt-1">الرئيسية</span>
              </router-link>

              <button 
                v-if="canModifyItems"
                @click="openAddItemModal" 
                class="flex flex-col items-center p-2 flex-1 transition-all duration-200 touch-target rounded-xl group"
                aria-label="إضافة صنف جديد"
              >
                <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/>
                  </svg>
                </div>
                <span class="text-[10px] font-medium mt-1 text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400">إضافة</span>
              </button>

              <router-link 
                to="/inventory" 
                class="flex flex-col items-center p-2 flex-1 transition-all duration-200 touch-target rounded-xl"
                :class="{
                  'text-blue-600 dark:text-blue-400': $route.path === '/inventory',
                  'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400': $route.path !== '/inventory'
                }"
                @click="closeAllMenus"
              >
                <div class="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200"
                  :class="{
                    'bg-gradient-to-br from-blue-500/20 to-blue-500/10 border border-blue-200/50 dark:border-blue-800/50 shadow-sm': $route.path === '/inventory',
                    'hover:bg-gray-100/50 dark:hover:bg-gray-800/50': $route.path !== '/inventory'
                  }"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                </div>
                <span class="text-[10px] font-medium mt-1">المخزون</span>
              </router-link>

              <router-link 
                to="/transactions" 
                class="flex flex-col items-center p-2 flex-1 transition-all duration-200 touch-target rounded-xl"
                :class="{
                  'text-blue-600 dark:text-blue-400': $route.path === '/transactions',
                  'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400': $route.path !== '/transactions'
                }"
                @click="closeAllMenus"
              >
                <div class="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200"
                  :class="{
                    'bg-gradient-to-br from-blue-500/20 to-blue-500/10 border border-blue-200/50 dark:border-blue-800/50 shadow-sm': $route.path === '/transactions',
                    'hover:bg-gray-100/50 dark:hover:bg-gray-800/50': $route.path !== '/transactions'
                  }"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <span class="text-[10px] font-medium mt-1">الحركات</span>
              </router-link>
            </div>
          </nav>
        </div>

        <!-- User Management Modal (Integrated) -->
        <UserManagementModal
          v-if="showUserManagementModal"
          :isOpen="showUserManagementModal"
          :user="editingUser"
          @close="closeUserManagementModal"
          @save="handleUserSave"
        />

        <!-- Warehouse Selection Modal (Modern Mobile Design) -->
        <div 
          v-if="showWarehouseSelectionModal"
          class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300"
        >
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] flex flex-col overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-gray-800/50 dark:to-gray-900/50">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  اختيار المخازن
                </h2>
                <button 
                  @click="closeWarehouseSelectionModal"
                  class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  aria-label="إغلاق"
                >
                  <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p class="text-xs text-blue-500 dark:text-blue-400 mt-1">
                اختر المخازن التي يمكن للمستخدم الوصول إليها
              </p>
            </div>

            <!-- Quick Actions -->
            <div class="px-6 py-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/30">
              <div class="flex gap-2">
                <button
                  @click="toggleAllWarehousesSelection"
                  class="flex-1 px-3 py-2 text-xs font-medium rounded-xl border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                >
                  {{ allWarehousesSelected ? 'إلغاء الكل' : 'اختيار الكل' }}
                </button>
                <button
                  v-if="canManageWarehouses"
                  @click="openAddWarehouseFromSelection"
                  class="flex-1 px-3 py-2 text-xs font-medium rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center gap-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  مخزن جديد
                </button>
              </div>
            </div>

            <!-- Warehouse List - Thin Scrollable Cards -->
            <div class="flex-1 overflow-y-auto py-2">
              <!-- Loading State -->
              <div v-if="loadingWarehouses" class="py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p class="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">جاري تحميل المخازن...</p>
              </div>

              <!-- Empty State -->
              <div v-else-if="filteredWarehouses.length === 0" class="py-8 text-center">
                <svg class="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">لا توجد مخازن</h3>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">ابدأ بإضافة مخازن جديدة</p>
              </div>

              <!-- Warehouse Cards - Thin Design -->
              <div v-else class="space-y-1 px-2">
                <div 
                  v-for="warehouse in filteredWarehouses" 
                  :key="warehouse.id"
                  class="group"
                >
                  <label 
                    class="flex items-center p-3 rounded-xl transition-all duration-200 cursor-pointer"
                    :class="{
                      'bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200/50 dark:border-blue-800/50': selectedWarehouses.includes(warehouse.id),
                      'hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent': !selectedWarehouses.includes(warehouse.id)
                    }"
                  >
                    <div class="flex items-center h-5">
                      <input
                        type="checkbox"
                        :value="warehouse.id"
                        v-model="selectedWarehouses"
                        class="h-4 w-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                      />
                    </div>
                    
                    <!-- Warehouse Content - Compact -->
                    <div class="mr-3 flex-1">
                      <div class="flex justify-between items-center">
                        <div>
                          <div class="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                            <svg v-if="warehouse.type === 'primary'" class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                            </svg>
                            <svg v-else class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                            </svg>
                            {{ warehouse.name_ar }}
                          </div>
                          <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ warehouse.name_en }}</div>
                        </div>
                        
                        <!-- Quick Actions -->
                        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            @click.stop="editWarehouseFromSelection(warehouse)"
                            class="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            title="تعديل"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <!-- Warehouse Details - Compact -->
                      <div class="flex items-center gap-2 mt-1.5">
                        <span v-if="warehouse.location" class="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                          📍 {{ warehouse.location }}
                        </span>
                        <span v-if="warehouse.capacity" class="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                          📦 {{ warehouse.capacity }}
                        </span>
                        <span class="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                          {{ warehouse.type === 'primary' ? 'رئيسي' : 'صرف' }}
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Selection Summary -->
            <div 
              v-if="selectedWarehouses.length > 0"
              class="px-6 py-3 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <span class="text-white text-xs font-bold">{{ selectedWarehouses.length }}</span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-green-700 dark:text-green-300">تم الاختيار</p>
                    <p class="text-xs text-green-600 dark:text-green-400">
                      {{ getSelectedWarehouseNames().slice(0, 2).join('، ') }}
                      <span v-if="selectedWarehouses.length > 2"> +{{ selectedWarehouses.length - 2 }} أخرى</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="px-6 py-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <div class="flex gap-3">
                <button
                  @click="closeWarehouseSelectionModal"
                  class="flex-1 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
                >
                  إلغاء
                </button>
                <button
                  @click="confirmWarehouseSelection"
                  class="flex-1 py-2.5 px-4 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg active:scale-[0.98]"
                  :disabled="selectedWarehouses.length === 0"
                  :class="{ 'opacity-50 cursor-not-allowed': selectedWarehouses.length === 0 }"
                >
                  تأكيد ({{ selectedWarehouses.length }})
                </button>
              </div>
            </div>
          </div>
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
import UserManagementModal from '@/components/UserManagementModal.vue';

export default {
  name: 'App',
  components: {
    UserManagementModal
  },
  
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    
    // Refs
    const initializing = ref(true);
    const mobileMenuOpen = ref(false);
    const isDarkMode = ref(false);
    const showUserManagementModal = ref(false);
    const editingUser = ref(null);
    const showWarehouseSelectionModal = ref(false);
    const selectedWarehouses = ref([]);
    const loadingWarehouses = ref(false);
    
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

    const allWarehouses = computed(() => {
      return store.state.warehouses || [];
    });

    const filteredWarehouses = computed(() => {
      return allWarehouses.value;
    });

    const allWarehousesSelected = computed(() => {
      return selectedWarehouses.value.length === allWarehouses.value.length;
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
      if (!name) return 'مخ';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const roleBadgeClass = computed(() => {
      const classes = {
        superadmin: 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-sm',
        warehouse_manager: 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-sm',
        company_manager: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm'
      };
      return classes[userRole.value] || 'bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-sm';
    });

    // Dark mode
    const initializeDarkMode = () => {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      document.documentElement.classList.add('theme-transition');
      
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        isDarkMode.value = true;
        document.documentElement.classList.add('dark');
      } else {
        isDarkMode.value = false;
        document.documentElement.classList.remove('dark');
      }
      
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
      }, 300);
    };

    const toggleDarkMode = () => {
      document.documentElement.classList.add('theme-transition');
      
      isDarkMode.value = !isDarkMode.value;
      if (isDarkMode.value) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
      }, 300);
    };

    // Menu handlers
    const closeAllMenus = () => {
      mobileMenuOpen.value = false;
    };

    const toggleMobileMenu = async () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;
      
      if (mobileMenuOpen.value) {
        document.body.classList.add('menu-open');
        await nextTick();
      } else {
        document.body.classList.remove('menu-open');
      }
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

    const openUserManagementModal = (user = null) => {
      editingUser.value = user;
      showUserManagementModal.value = true;
      closeAllMenus();
    };

    const closeUserManagementModal = () => {
      showUserManagementModal.value = false;
      editingUser.value = null;
    };

    const handleUserSave = (userData) => {
      // Handle user save (can be implemented based on your needs)
      console.log('User saved:', userData);
    };

    // Warehouse selection modal
    const openWarehouseSelectionModal = (preselected = []) => {
      selectedWarehouses.value = [...preselected];
      loadWarehouses();
      showWarehouseSelectionModal.value = true;
    };

    const closeWarehouseSelectionModal = () => {
      showWarehouseSelectionModal.value = false;
      selectedWarehouses.value = [];
    };

    const toggleAllWarehousesSelection = () => {
      if (allWarehousesSelected.value) {
        selectedWarehouses.value = [];
      } else {
        selectedWarehouses.value = allWarehouses.value.map(w => w.id);
      }
    };

    const openAddWarehouseFromSelection = () => {
      closeWarehouseSelectionModal();
      setTimeout(() => {
        openAddWarehouseModal();
      }, 300);
    };

    const editWarehouseFromSelection = (warehouse) => {
      closeWarehouseSelectionModal();
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('edit-warehouse', { detail: { warehouse } }));
      }, 300);
    };

    const confirmWarehouseSelection = () => {
      // Emit event with selected warehouses
      window.dispatchEvent(new CustomEvent('warehouses-selected', { 
        detail: { warehouses: selectedWarehouses.value } 
      }));
      closeWarehouseSelectionModal();
    };

    const getSelectedWarehouseNames = () => {
      return selectedWarehouses.value
        .map(warehouseId => {
          const warehouse = allWarehouses.value.find(w => w.id === warehouseId);
          return warehouse ? warehouse.name_ar : warehouseId;
        });
    };

    const loadWarehouses = async () => {
      if (allWarehouses.value.length === 0) {
        loadingWarehouses.value = true;
        try {
          await store.dispatch('loadWarehouses');
        } catch (error) {
          console.error('Error loading warehouses:', error);
        } finally {
          loadingWarehouses.value = false;
        }
      }
    };

    // Utilities
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

    // Lifecycle
    onMounted(async () => {
      try {
        await store.dispatch('initializeAuth');
        
        if (store.getters.isAuthenticated) {
          await store.dispatch('loadWarehouses');
        }
        
        initializeDarkMode();
        
        // Listen for system theme changes
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleThemeChange = (e) => {
          if (!localStorage.getItem('theme')) {
            document.documentElement.classList.add('theme-transition');
            if (e.matches) {
              document.documentElement.classList.add('dark');
              isDarkMode.value = true;
            } else {
              document.documentElement.classList.remove('dark');
              isDarkMode.value = false;
            }
            setTimeout(() => {
              document.documentElement.classList.remove('theme-transition');
            }, 300);
          }
        };
        
        darkModeMediaQuery.addEventListener('change', handleThemeChange);
        
        // Listen for events from UserManagementModal
        window.addEventListener('open-warehouse-selection', (event) => {
          openWarehouseSelectionModal(event.detail?.preselected || []);
        });

        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            closeAllMenus();
            closeWarehouseSelectionModal();
            closeUserManagementModal();
          }
        });
        
        return () => {
          darkModeMediaQuery.removeEventListener('change', handleThemeChange);
          document.removeEventListener('keydown', handleThemeChange);
          window.removeEventListener('open-warehouse-selection', handleThemeChange);
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
      isDarkMode,
      showUserManagementModal,
      editingUser,
      showWarehouseSelectionModal,
      selectedWarehouses,
      loadingWarehouses,
      
      // Computed
      isAuthenticated,
      isPublicRoute,
      showBottomNav,
      notificationCount,
      userRole,
      userProfile,
      canModifyItems,
      canManageUsers,
      canManageWarehouses,
      canViewReports,
      allWarehouses,
      filteredWarehouses,
      allWarehousesSelected,
      
      // Methods
      getRoleName,
      getUserInitials,
      roleBadgeClass,
      toggleDarkMode,
      closeAllMenus,
      toggleMobileMenu,
      handleNotifications,
      openAddItemModal,
      openTransferModal,
      openDispatchModal,
      openAddWarehouseModal,
      openUserManagementModal,
      closeUserManagementModal,
      handleUserSave,
      openWarehouseSelectionModal,
      closeWarehouseSelectionModal,
      toggleAllWarehousesSelection,
      openAddWarehouseFromSelection,
      editWarehouseFromSelection,
      confirmWarehouseSelection,
      getSelectedWarehouseNames,
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
  --header-height: 64px;
  --bottom-nav-height: 64px;
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

/* Smooth scrolling */
.smooth-scroll {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.smooth-scroll::-webkit-scrollbar {
  width: 6px;
}

.smooth-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.smooth-scroll::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 3px;
}

.smooth-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
}

.dark .smooth-scroll::-webkit-scrollbar-thumb {
  background: rgba(96, 165, 250, 0.3);
}

.dark .smooth-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(96, 165, 250, 0.5);
}

/* Focus styles for accessibility */
:focus-visible {
  outline: 2px solid rgba(59, 130, 246, 0.5);
  outline-offset: 2px;
  border-radius: 0.75rem;
}

/* Smooth transitions */
* {
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Prevent body scroll when menu is open */
body.menu-open {
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
}

/* Theme transition */
.theme-transition * {
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Button active state */
button:active,
[role="button"]:active,
a:active {
  transform: scale(0.96);
}

/* Glass morphism effects */
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark .glass {
  background: rgba(17, 24, 39, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  
  .text-\[11px\] {
    font-size: 0.6875rem;
    line-height: 0.875rem;
  }
  
  .text-\[10px\] {
    font-size: 0.625rem;
    line-height: 0.75rem;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .bg-blue-50 {
    background-color: #eff6ff;
  }
  
  .dark .bg-gray-900\/95 {
    background-color: rgba(3, 7, 18, 0.95);
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
  
  .smooth-scroll {
    scroll-behavior: auto;
  }
}

/* Print styles */
@media print {
  .lg\\:hidden,
  .fixed {
    display: none !important;
  }
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
  background-color: rgba(59, 130, 246, 0.3);
  color: inherit;
}

.dark ::selection {
  background-color: rgba(96, 165, 250, 0.5);
}

/* Custom scrollbar for menu */
#mobile-menu div[class*="overflow-y-auto"]::-webkit-scrollbar {
  width: 4px;
}

#mobile-menu div[class*="overflow-y-auto"]::-webkit-scrollbar-track {
  background: transparent;
}

#mobile-menu div[class*="overflow-y-auto"]::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.2);
  border-radius: 2px;
}

.dark #mobile-menu div[class*="overflow-y-auto"]::-webkit-scrollbar-thumb {
  background: rgba(96, 165, 250, 0.2);
}

/* Warehouse modal scrollable area */
.fixed.inset-0.z-\[60\] .max-h-\[85vh\] div[class*="overflow-y-auto"]::-webkit-scrollbar {
  width: 4px;
}

.fixed.inset-0.z-\[60\] .max-h-\[85vh\] div[class*="overflow-y-auto"]::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 2px;
}

.fixed.inset-0.z-\[60\] .max-h-\[85vh\] div[class*="overflow-y-auto"]::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.4);
  border-radius: 2px;
}

.dark .fixed.inset-0.z-\[60\] .max-h-\[85vh\] div[class*="overflow-y-auto"]::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.dark .fixed.inset-0.z-\[60\] .max-h-\[85vh\] div[class*="overflow-y-auto"]::-webkit-scrollbar-thumb {
  background: rgba(96, 165, 250, 0.4);
}

/* Warehouse card hover effect */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

/* Modal backdrop blur */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Card hover lift effect */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.dark .hover-lift:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* Gradient text animation */
.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Modal entrance animation */
@keyframes modal-entrance {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.fixed.inset-0.z-\[60\] > div {
  animation: modal-entrance 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Checkbox custom styling */
input[type="checkbox"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
}

/* Custom focus ring for checkboxes */
input[type="checkbox"]:focus {
  ring-width: 2px;
  ring-color: rgba(59, 130, 246, 0.5);
  ring-offset-width: 2px;
}

/* Thin card design */
.space-y-1 > .group {
  margin-bottom: 2px;
}

/* Optimize for mobile touch */
@media (max-width: 640px) {
  .fixed.inset-0.z-\[60\] > div {
    width: 100%;
    max-width: 100%;
    margin: 0;
    border-radius: 0;
    max-height: 100vh;
  }
  
  .fixed.inset-0.z-\[60\] {
    padding: 0;
  }
  
  .max-h-\[85vh\] {
    max-height: 90vh;
  }
}
</style>