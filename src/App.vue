<template>
  <div id="app" dir="rtl" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Loading Screen -->
    <div v-if="initializing" class="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400 font-medium">جاري تحميل النظام...</p>
      </div>
    </div>

    <!-- Main App -->
    <div v-else class="h-screen flex flex-col">
      <!-- Public Routes (Login, 404, etc.) -->
      <template v-if="isPublicRoute">
        <div class="flex-1 overflow-y-auto">
          <router-view />
        </div>
      </template>

      <!-- Authenticated Layout -->
      <template v-else>
        <!-- Mobile Sidebar Overlay -->
        <transition name="fade">
          <div 
            v-if="mobileSidebarOpen"
            class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            @click="mobileSidebarOpen = false"
          ></div>
        </transition>

        <!-- Desktop Sidebar -->
        <aside class="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-xl">
          <!-- Sidebar Header -->
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <router-link to="/" class="flex items-center space-x-3 space-x-reverse">
              <div class="h-12 w-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
              </div>
              <div>
                <h1 class="text-lg font-bold text-gray-900 dark:text-white">نظام المخزون</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">إدارة المخزون الذكي</p>
              </div>
            </router-link>
          </div>

          <!-- User Profile -->
          <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
            <div class="flex items-center">
              <div class="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm ml-3">
                <span class="text-white font-semibold text-sm">
                  {{ getUserInitials(userProfile?.name || userProfile?.email) }}
                </span>
              </div>
              <div class="flex-1 text-right">
                <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {{ userProfile?.name || userProfile?.email }}
                </p>
                <p class="text-xs text-primary-600 dark:text-primary-400 font-medium">
                  {{ getRoleName(userRole) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Navigation Menu -->
          <nav class="flex-1 overflow-y-auto p-4 space-y-2">
            <!-- Main Navigation -->
            <div class="space-y-1">
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
                التنقل الرئيسي
              </p>
              
              <router-link 
                to="/" 
                class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:translate-x-[-2px] group"
                :class="{
                  'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm': $route.path === '/',
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': $route.path !== '/'
                }"
              >
                <svg class="w-5 h-5 ml-3" :class="{'text-primary-600 dark:text-primary-400': $route.path === '/', 'text-gray-500 dark:text-gray-400': $route.path !== '/'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                لوحة التحكم
                <span v-if="$route.path === '/'" class="mr-auto h-2 w-2 bg-primary-500 rounded-full"></span>
              </router-link>

              <router-link 
                to="/inventory" 
                class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:translate-x-[-2px] group"
                :class="{
                  'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm': $route.path.includes('/inventory'),
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': !$route.path.includes('/inventory')
                }"
              >
                <svg class="w-5 h-5 ml-3" :class="{'text-primary-600 dark:text-primary-400': $route.path.includes('/inventory'), 'text-gray-500 dark:text-gray-400': !$route.path.includes('/inventory')}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
                الأصناف والمخزون
                <span v-if="$route.path.includes('/inventory')" class="mr-auto h-2 w-2 bg-primary-500 rounded-full"></span>
              </router-link>

              <router-link 
                to="/transactions" 
                class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:translate-x-[-2px] group"
                :class="{
                  'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm': $route.path.includes('/transactions'),
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': !$route.path.includes('/transactions')
                }"
              >
                <svg class="w-5 h-5 ml-3" :class="{'text-blue-600 dark:text-blue-400': $route.path.includes('/transactions'), 'text-gray-500 dark:text-gray-400': !$route.path.includes('/transactions')}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                سجل الحركات
                <span v-if="$route.path.includes('/transactions')" class="mr-auto h-2 w-2 bg-blue-500 rounded-full"></span>
              </router-link>
            </div>

            <!-- Management Section -->
            <div v-if="canManageWarehouses || canManageUsers" class="space-y-1 mt-6">
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
                إدارة النظام
              </p>
              
              <router-link 
                v-if="canManageWarehouses"
                to="/warehouses" 
                class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:translate-x-[-2px] group"
                :class="{
                  'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 shadow-sm': $route.path.includes('/warehouses'),
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': !$route.path.includes('/warehouses')
                }"
              >
                <svg class="w-5 h-5 ml-3" :class="{'text-green-600 dark:text-green-400': $route.path.includes('/warehouses'), 'text-gray-500 dark:text-gray-400': !$route.path.includes('/warehouses')}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                إدارة المخازن
                <span v-if="$route.path.includes('/warehouses')" class="mr-auto h-2 w-2 bg-green-500 rounded-full"></span>
              </router-link>

              <router-link 
                v-if="canManageUsers"
                to="/users" 
                class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:translate-x-[-2px] group"
                :class="{
                  'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 shadow-sm': $route.path.includes('/users'),
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': !$route.path.includes('/users')
                }"
              >
                <svg class="w-5 h-5 ml-3" :class="{'text-purple-600 dark:text-purple-400': $route.path.includes('/users'), 'text-gray-500 dark:text-gray-400': !$route.path.includes('/users')}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                إدارة المستخدمين
                <span v-if="$route.path.includes('/users')" class="mr-auto h-2 w-2 bg-purple-500 rounded-full"></span>
              </router-link>
            </div>

            <!-- Quick Actions -->
            <div v-if="canModifyItems" class="mt-8">
              <div class="bg-gradient-to-r from-primary-500/10 to-primary-600/10 dark:from-primary-900/20 dark:to-primary-800/20 p-4 rounded-xl border border-primary-200 dark:border-primary-800/30">
                <p class="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-3">
                  ⚡ إجراءات سريعة
                </p>
                <button 
                  @click="openAddItemModal"
                  class="w-full flex items-center justify-center px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
                >
                  <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  إضافة صنف جديد
                </button>
              </div>
            </div>
          </nav>

          <!-- Sidebar Footer -->
          <div class="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <router-link 
              to="/profile" 
              class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 group"
            >
              <svg class="w-5 h-5 ml-3 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              الإعدادات والملف الشخصي
            </router-link>

            <button 
              @click="logout"
              class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 group"
            >
              <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              تسجيل الخروج
            </button>
          </div>
        </aside>

        <!-- Mobile Layout -->
        <div class="lg:hidden flex-1 flex flex-col relative">
          <!-- Mobile Sidebar -->
          <transition name="slide">
            <aside 
              v-if="mobileSidebarOpen"
              class="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto"
            >
              <div class="h-full flex flex-col">
                <!-- Mobile Sidebar Header -->
                <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/10">
                  <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center space-x-3 space-x-reverse">
                      <div class="h-12 w-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                        </svg>
                      </div>
                      <div>
                        <h1 class="text-lg font-bold text-gray-900 dark:text-white">نظام المخزون</h1>
                        <p class="text-sm text-gray-600 dark:text-gray-400">الجوال</p>
                      </div>
                    </div>
                    <button 
                      @click="mobileSidebarOpen = false"
                      class="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50"
                    >
                      <svg class="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>

                  <!-- User Info -->
                  <div class="flex items-center p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <div class="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm ml-3">
                      <span class="text-white font-semibold text-sm">
                        {{ getUserInitials(userProfile?.name || userProfile?.email) }}
                      </span>
                    </div>
                    <div class="flex-1 text-right">
                      <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {{ userProfile?.name || userProfile?.email }}
                      </p>
                      <p class="text-xs text-primary-600 dark:text-primary-400 font-medium">
                        {{ getRoleName(userRole) }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Mobile Navigation -->
                <nav class="flex-1 p-4 space-y-1">
                  <router-link 
                    to="/" 
                    @click="mobileSidebarOpen = false"
                    class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                    :class="{
                      'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300': $route.path === '/',
                      'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': $route.path !== '/'
                    }"
                  >
                    <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                    لوحة التحكم
                  </router-link>

                  <router-link 
                    to="/inventory" 
                    @click="mobileSidebarOpen = false"
                    class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                    :class="{
                      'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300': $route.path.includes('/inventory'),
                      'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': !$route.path.includes('/inventory')
                    }"
                  >
                    <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                    </svg>
                    الأصناف والمخزون
                  </router-link>

                  <router-link 
                    to="/transactions" 
                    @click="mobileSidebarOpen = false"
                    class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                    :class="{
                      'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300': $route.path.includes('/transactions'),
                      'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': !$route.path.includes('/transactions')
                    }"
                  >
                    <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    سجل الحركات
                  </router-link>

                  <!-- Quick Action -->
                  <button 
                    v-if="canModifyItems"
                    @click="openAddItemModal"
                    class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-all duration-200 mt-4"
                  >
                    <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    إضافة صنف جديد
                  </button>
                </nav>

                <!-- Mobile Sidebar Footer -->
                <div class="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <button 
                    @click="toggleDarkMode"
                    class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  >
                    <svg v-if="isDarkMode" class="w-5 h-5 ml-3 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
                    </svg>
                    <svg v-else class="w-5 h-5 ml-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                    </svg>
                    {{ isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي' }}
                  </button>

                  <button 
                    @click="logout"
                    class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    تسجيل الخروج
                  </button>
                </div>
              </div>
            </aside>
          </transition>

          <!-- Mobile Header -->
          <header class="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div class="px-4 py-3">
              <div class="flex items-center justify-between">
                <!-- Menu Button -->
                <button 
                  @click="mobileSidebarOpen = true"
                  class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  aria-label="فتح القائمة"
                >
                  <svg class="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                </button>

                <!-- Page Title -->
                <div class="flex-1 text-center px-2">
                  <h1 class="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {{ getPageTitle(route.name) }}
                  </h1>
                  <p v-if="currentWarehouse" class="text-xs text-primary-600 dark:text-primary-400 truncate">
                    {{ currentWarehouse.name }}
                  </p>
                </div>

                <!-- Header Actions -->
                <div class="flex items-center space-x-2 space-x-reverse">
                  <!-- Search Button -->
                  <button 
                    @click="toggleSearch"
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    aria-label="بحث"
                  >
                    <svg class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </button>

                  <!-- Notifications -->
                  <button 
                    @click="showNotifications"
                    class="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    aria-label="الإشعارات"
                  >
                    <svg class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                    <span v-if="notificationCount > 0" class="absolute -top-1 -left-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {{ notificationCount > 9 ? '9+' : notificationCount }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Search Bar -->
              <transition name="slide-down">
                <div v-if="showMobileSearch" class="mt-3">
                  <div class="relative">
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                    </div>
                    <input
                      type="search"
                      v-model="searchTerm"
                      @input="handleSearch"
                      placeholder="ابحث عن صنف، رقم، حركة..."
                      class="w-full pr-10 pl-3 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      autocomplete="off"
                    />
                  </div>
                </div>
              </transition>
            </div>

            <!-- Dashboard Stats (only on dashboard) -->
            <div v-if="dashboardStats && $route.path === '/'" class="px-4 pb-3">
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/10 p-3 rounded-xl border border-primary-100 dark:border-primary-900/20">
                  <div class="flex items-center">
                    <div class="h-10 w-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center ml-3">
                      <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                      </svg>
                    </div>
                    <div class="text-right flex-1">
                      <p class="text-xs text-gray-600 dark:text-gray-400">إجمالي الأصناف</p>
                      <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatNumber(dashboardStats.totalItems) || 0 }}</p>
                    </div>
                  </div>
                </div>

                <div class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-900/20">
                  <div class="flex items-center">
                    <div class="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center ml-3">
                      <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                      </svg>
                    </div>
                    <div class="text-right flex-1">
                      <p class="text-xs text-gray-600 dark:text-gray-400">الحركات اليوم</p>
                      <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatNumber(dashboardStats.recentTransactions) || 0 }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <!-- Mobile Main Content Area - FIXED SCROLLING -->
          <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <!-- Special handling for Item Details page -->
            <div v-if="$route.name === 'ItemDetails'" class="h-full">
              <div class="h-full overflow-y-auto pb-20">
                <router-view />
              </div>
            </div>
            <!-- Special handling for Add Item page -->
            <div v-else-if="$route.name === 'AddItem'" class="h-full">
              <div class="h-full overflow-y-auto pb-20">
                <div class="p-4">
                  <router-view />
                </div>
              </div>
            </div>
            <!-- Normal pages -->
            <div v-else class="p-4">
              <router-view />
            </div>
          </main>

          <!-- Mobile Bottom Navigation - FIXED POSITION -->
          <div v-if="showBottomNav" class="sticky bottom-0 z-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg pb-safe">
            <div class="grid grid-cols-4 gap-1 p-2">
              <!-- Home Button -->
              <router-link 
                to="/" 
                class="flex flex-col items-center p-2 rounded-lg transition-all duration-200"
                :class="{
                  'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20': $route.path === '/',
                  'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/'
                }"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <span class="text-xs mt-1">الرئيسية</span>
              </router-link>

              <!-- Inventory Button -->
              <router-link 
                to="/inventory" 
                class="flex flex-col items-center p-2 rounded-lg transition-all duration-200"
                :class="{
                  'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20': $route.path.includes('/inventory'),
                  'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700': !$route.path.includes('/inventory')
                }"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
                <span class="text-xs mt-1">الأصناف</span>
              </router-link>

              <!-- Quick Add Button (Middle) -->
              <button 
                v-if="canModifyItems"
                @click="openAddItemModal"
                class="flex flex-col items-center p-2 rounded-lg bg-gradient-to-b from-primary-600 to-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <div class="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mb-1">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </div>
                <span class="text-xs">إضافة</span>
              </button>
              <div v-else class="p-2"></div>

              <!-- Transactions Button -->
              <router-link 
                to="/transactions" 
                class="flex flex-col items-center p-2 rounded-lg transition-all duration-200"
                :class="{
                  'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20': $route.path.includes('/transactions'),
                  'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700': !$route.path.includes('/transactions')
                }"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <span class="text-xs mt-1">الحركات</span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Desktop Content Area -->
        <div class="hidden lg:flex flex-1 flex-col">
          <!-- Desktop Header -->
          <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div class="px-8 py-4">
              <div class="flex items-center justify-between">
                <!-- Page Title and Breadcrumb -->
                <div>
                  <div class="flex items-center space-x-2 space-x-reverse">
                    <h1 class="text-xl font-bold text-gray-900 dark:text-white">
                      {{ getPageTitle(route.name) }}
                    </h1>
                    <span v-if="currentWarehouse" class="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full">
                      {{ currentWarehouse.name }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {{ getPageDescription(route.name) }}
                  </p>
                </div>

                <!-- Desktop Actions -->
                <div class="flex items-center space-x-4 space-x-reverse">
                  <!-- Search -->
                  <div class="relative w-96">
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                    </div>
                    <input
                      type="search"
                      v-model="searchTerm"
                      @input="handleSearch"
                      placeholder="ابحث عن صنف، رقم، حركة، مستخدم..."
                      class="w-full pr-10 pl-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      autocomplete="off"
                    />
                  </div>

                  <!-- Dark Mode Toggle -->
                  <button 
                    @click="toggleDarkMode"
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    :aria-label="isDarkMode ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'"
                  >
                    <svg v-if="isDarkMode" class="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
                    </svg>
                    <svg v-else class="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                    </svg>
                  </button>

                  <!-- Notifications -->
                  <button 
                    @click="showNotifications"
                    class="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    aria-label="الإشعارات"
                  >
                    <svg class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                    <span v-if="notificationCount > 0" class="absolute -top-1 -left-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {{ notificationCount > 9 ? '9+' : notificationCount }}
                    </span>
                  </button>

                  <!-- Profile Menu -->
                  <div class="relative">
                    <button 
                      @click="toggleProfileMenu"
                      class="flex items-center space-x-2 space-x-reverse p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <div class="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                        <span class="text-white text-sm font-medium">
                          {{ getUserInitials(userProfile?.name || userProfile?.email) }}
                        </span>
                      </div>
                      <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                      </svg>
                    </button>
                    
                    <!-- Profile Dropdown -->
                    <transition name="fade">
                      <div 
                        v-if="profileMenuOpen"
                        class="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                      >
                        <router-link 
                          to="/profile"
                          class="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          @click="profileMenuOpen = false"
                        >
                          <svg class="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          </svg>
                          الملف الشخصي
                        </router-link>
                        <button 
                          @click="logout"
                          class="w-full flex items-center px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <svg class="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                          </svg>
                          تسجيل الخروج
                        </button>
                      </div>
                    </transition>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <!-- Desktop Main Content - FIXED SCROLLING -->
          <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <!-- Special handling for Item Details page -->
            <div v-if="$route.name === 'ItemDetails'" class="h-full">
              <div class="h-full overflow-y-auto p-8">
                <router-view />
              </div>
            </div>
            <!-- Special handling for Add Item page -->
            <div v-else-if="$route.name === 'AddItem'" class="h-full">
              <div class="h-full overflow-y-auto p-8">
                <router-view />
              </div>
            </div>
            <!-- Normal pages -->
            <div v-else class="p-8">
              <router-view />
            </div>
          </main>
        </div>
      </template>
    </div>

    <!-- Global Click Handler to Close Profile Menu -->
    <div v-if="profileMenuOpen" class="fixed inset-0 z-40" @click="profileMenuOpen = false"></div>
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
    
    // Refs
    const initializing = ref(true);
    const mobileSidebarOpen = ref(false);
    const profileMenuOpen = ref(false);
    const isDarkMode = ref(false);
    const searchTerm = ref('');
    const showMobileSearch = ref(false);
    
    // Computed
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const isPublicRoute = computed(() => {
      const publicRoutes = ['Login', 'Unauthorized', 'NotFound'];
      return publicRoutes.includes(route.name);
    });
    const showBottomNav = computed(() => {
      const hideRoutes = ['/login', '/unauthorized', '/notfound'];
      return isAuthenticated.value && !hideRoutes.includes(route.path);
    });
    const userRole = computed(() => store.getters.userRole);
    const userProfile = computed(() => store.state.userProfile);
    const dashboardStats = computed(() => store.getters.dashboardStats);
    const currentWarehouse = computed(() => store.state.currentWarehouse);
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
    
    // Helper Functions
    const getPageTitle = (routeName) => {
      const titles = {
        'Dashboard': 'لوحة التحكم',
        'Inventory': 'الأصناف والمخزون',
        'ItemDetails': 'تفاصيل الصنف',
        'AddItem': 'إضافة صنف جديد',
        'EditItem': 'تعديل الصنف',
        'Transactions': 'سجل الحركات',
        'Warehouses': 'إدارة المخازن',
        'Users': 'إدارة المستخدمين',
        'Reports': 'التقارير والإحصائيات',
        'Profile': 'الملف الشخصي',
        'Settings': 'الإعدادات'
      };
      return titles[routeName] || 'نظام المخزون';
    };
    
    const getPageDescription = (routeName) => {
      const descriptions = {
        'Dashboard': 'نظرة عامة على المخزون والحركات',
        'Inventory': 'إدارة وتتبع جميع الأصناف',
        'ItemDetails': 'عرض وتعديل بيانات الصنف',
        'AddItem': 'إضافة صنف جديد إلى المخزون',
        'Transactions': 'سجل كافة الحركات والتعديلات',
        'Warehouses': 'إدارة المخازن والفروع',
        'Users': 'إدارة صلاحيات المستخدمين',
        'Reports': 'تقارير وإحصائيات مفصلة'
      };
      return descriptions[routeName] || 'نظام إدارة المخزون المتكامل';
    };
    
    const getRoleName = (role) => {
      const names = {
        superadmin: 'المشرف العام',
        warehouse_manager: 'مدير المخازن',
        company_manager: 'مدير الشركة',
        employee: 'موظف',
        viewer: 'مشاهد'
      };
      return names[role] || role;
    };
    
    const getUserInitials = (name) => {
      if (!name || typeof name !== 'string') return 'م';
      const parts = name.trim().split(' ');
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };
    
    const formatNumber = (num) => {
      if (num === null || num === undefined) return '0';
      return new Intl.NumberFormat('ar-EG').format(num);
    };
    
    // Dark Mode
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
    
    // Navigation Functions
    const toggleProfileMenu = () => {
      profileMenuOpen.value = !profileMenuOpen.value;
    };
    
    const toggleSearch = () => {
      showMobileSearch.value = !showMobileSearch.value;
    };
    
    const showNotifications = () => {
      router.push('/transactions');
      mobileSidebarOpen.value = false;
      profileMenuOpen.value = false;
    };
    
    const openAddItemModal = () => {
      mobileSidebarOpen.value = false;
      profileMenuOpen.value = false;
      // Navigate to add item page or open modal
      if (route.path === '/inventory') {
        router.push('/inventory/add');
      } else {
        window.dispatchEvent(new CustomEvent('open-add-item-modal'));
      }
    };
    
    // Search Handler
    const handleSearch = debounce(() => {
      if (!searchTerm.value.trim()) return;
      
      // Dispatch search event
      window.dispatchEvent(new CustomEvent('global-search', {
        detail: { term: searchTerm.value }
      }));
      
      // Navigate to inventory if not already there
      if (!route.path.includes('/inventory')) {
        router.push('/inventory');
      }
    }, 500);
    
    // Logout
    const logout = async () => {
      try {
        mobileSidebarOpen.value = false;
        profileMenuOpen.value = false;
        
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
        // Initialize authentication
        await store.dispatch('initializeAuth');
        
        // Load initial data if authenticated
        if (store.getters.isAuthenticated) {
          await store.dispatch('loadWarehouses');
          await store.dispatch('loadDashboardStats');
        }
        
        // Initialize dark mode
        initializeDarkMode();
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          if (!localStorage.getItem('theme')) {
            isDarkMode.value = e.matches;
            if (e.matches) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
          // Close menus on Escape
          if (e.key === 'Escape') {
            mobileSidebarOpen.value = false;
            profileMenuOpen.value = false;
            showMobileSearch.value = false;
          }
          
          // Ctrl/Cmd + K for search
          if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (window.innerWidth >= 1024) {
              document.querySelector('input[type="search"]')?.focus();
            } else {
              showMobileSearch.value = true;
            }
          }
          
          // Ctrl/Cmd + B for sidebar (mobile)
          if ((e.ctrlKey || e.metaKey) && e.key === 'b' && window.innerWidth < 1024) {
            e.preventDefault();
            mobileSidebarOpen.value = !mobileSidebarOpen.value;
          }
        });
        
        // Close profile menu on outside click
        document.addEventListener('click', (e) => {
          const profileButton = document.querySelector('[aria-label*="profile"]');
          if (profileMenuOpen.value && profileButton && !profileButton.contains(e.target)) {
            profileMenuOpen.value = false;
          }
        });
        
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setTimeout(() => {
          initializing.value = false;
        }, 500);
      }
    });
    
    // Watchers
    watch(() => route.path, () => {
      mobileSidebarOpen.value = false;
      profileMenuOpen.value = false;
      showMobileSearch.value = false;
      searchTerm.value = '';
    });
    
    watch(() => route.name, () => {
      // Scroll to top on route change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Return all reactive values
    return {
      // Refs
      initializing,
      mobileSidebarOpen,
      profileMenuOpen,
      isDarkMode,
      searchTerm,
      showMobileSearch,
      
      // Computed
      isAuthenticated,
      isPublicRoute,
      showBottomNav,
      userRole,
      userProfile,
      dashboardStats,
      currentWarehouse,
      notificationCount,
      canModifyItems,
      canManageUsers,
      canManageWarehouses,
      
      // Methods
      getPageTitle,
      getPageDescription,
      getRoleName,
      getUserInitials,
      formatNumber,
      toggleDarkMode,
      toggleProfileMenu,
      toggleSearch,
      showNotifications,
      openAddItemModal,
      handleSearch,
      logout,
      router
    };
  }
};
</script>

<style scoped>
/* Safe area for mobile bottom navigation */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 8px);
}

/* Animation classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  max-height: 100px;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

/* Improved scroll behavior */
.overflow-y-auto {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

/* Better focus styles */
:focus-visible {
  outline: 2px solid #eab308;
  outline-offset: 2px;
  border-radius: 0.375rem;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-track {
  background: #374151;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Touch improvements */
@media (max-width: 768px) {
  button,
  [role="button"],
  a {
    min-height: 44px;
    min-width: 44px;
  }
  
  input,
  select,
  textarea {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

/* Responsive typography */
@media (max-width: 640px) {
  .text-lg {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
  
  .text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  
  .text-xs {
    font-size: 0.75rem;
    line-height: 1rem;
  }
}

/* Z-index layering */
#app {
  isolation: isolate;
}

.fixed,
.sticky {
  position: fixed;
  z-index: 50;
}

.bg-black.bg-opacity-50 {
  z-index: 40;
}

header.sticky {
  z-index: 30;
}

.pb-safe {
  z-index: 20;
}

/* Button press effect */
button:active {
  transform: scale(0.98);
  transition: transform 0.1s ease;
}

/* Gradient borders */
.border-gradient {
  border-image: linear-gradient(to right, #f59e0b, #f97316) 1;
}

/* Smooth transitions */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

/* Improved shadows */
.shadow-lg {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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

/* Improved responsive grids */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }
  
  .grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.25rem;
  }
}

/* Card styles */
.rounded-xl {
  border-radius: 0.75rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

/* Focus within for better accessibility */
.focus-within\:ring-2:focus-within {
  --tw-ring-color: #eab308;
  --tw-ring-offset-width: 2px;
}

/* Print styles */
@media print {
  header,
  aside,
  .pb-safe {
    display: none !important;
  }
  
  main {
    padding: 0 !important;
    margin: 0 !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .bg-gray-50 {
    background-color: #ffffff;
  }
  
  .dark .bg-gray-900 {
    background-color: #000000;
  }
  
  .border-gray-200 {
    border-color: #000000;
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
    scroll-behavior: auto !important;
  }
}
</style>