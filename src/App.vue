<template>
  <div id="app" dir="rtl" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Loading Screen -->
    <div v-if="initializing" class="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400 font-medium">جاري تحميل النظام...</p>
      </div>
    </div>

    <!-- Main App Content -->
    <div v-else class="h-screen flex flex-col">
      <!-- Check if user is authenticated - for demo, we'll show authenticated view -->
      <template v-if="isAuthenticated">
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
            <div class="flex items-center space-x-3 space-x-reverse cursor-pointer" @click="navigateTo('/')">
              <div class="h-12 w-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
              </div>
              <div>
                <h1 class="text-lg font-bold text-gray-900 dark:text-white">نظام المخزون</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">إدارة المخزون الذكي</p>
              </div>
            </div>
          </div>

          <!-- User Profile -->
          <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
            <div class="flex items-center">
              <div class="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm ml-3">
                <span class="text-white font-semibold text-sm">
                  {{ getUserInitials() }}
                </span>
              </div>
              <div class="flex-1 text-right">
                <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {{ userProfile?.name || 'مدير النظام' }}
                </p>
                <p class="text-xs text-primary-600 dark:text-primary-400 font-medium">
                  {{ getRoleName() }}
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
              
              <button 
                @click="navigateTo('/')"
                class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:translate-x-[-2px] group w-full text-right"
                :class="{
                  'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm': currentRoute === '/',
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': currentRoute !== '/'
                }"
              >
                <svg class="w-5 h-5 ml-3" :class="{'text-primary-600 dark:text-primary-400': currentRoute === '/', 'text-gray-500 dark:text-gray-400': currentRoute !== '/'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                لوحة التحكم
                <span v-if="currentRoute === '/'" class="mr-auto h-2 w-2 bg-primary-500 rounded-full"></span>
              </button>

              <button 
                @click="navigateTo('/inventory')"
                class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:translate-x-[-2px] group w-full text-right"
                :class="{
                  'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm': currentRoute === '/inventory',
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': currentRoute !== '/inventory'
                }"
              >
                <svg class="w-5 h-5 ml-3" :class="{'text-primary-600 dark:text-primary-400': currentRoute === '/inventory', 'text-gray-500 dark:text-gray-400': currentRoute !== '/inventory'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
                الأصناف والمخزون
                <span v-if="currentRoute === '/inventory'" class="mr-auto h-2 w-2 bg-primary-500 rounded-full"></span>
              </button>

              <button 
                @click="navigateTo('/transactions')"
                class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:translate-x-[-2px] group w-full text-right"
                :class="{
                  'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm': currentRoute === '/transactions',
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': currentRoute !== '/transactions'
                }"
              >
                <svg class="w-5 h-5 ml-3" :class="{'text-blue-600 dark:text-blue-400': currentRoute === '/transactions', 'text-gray-500 dark:text-gray-400': currentRoute !== '/transactions'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                سجل الحركات
                <span v-if="currentRoute === '/transactions'" class="mr-auto h-2 w-2 bg-blue-500 rounded-full"></span>
              </button>
            </div>

            <!-- Quick Actions -->
            <div class="mt-8">
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
            <button 
              @click="navigateTo('/profile')"
              class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 group text-right"
            >
              <svg class="w-5 h-5 ml-3 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              الإعدادات والملف الشخصي
            </button>

            <button 
              @click="logout"
              class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 group text-right"
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
                        {{ getUserInitials() }}
                      </span>
                    </div>
                    <div class="flex-1 text-right">
                      <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {{ userProfile?.name || 'مدير النظام' }}
                      </p>
                      <p class="text-xs text-primary-600 dark:text-primary-400 font-medium">
                        {{ getRoleName() }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Mobile Navigation -->
                <nav class="flex-1 p-4 space-y-1">
                  <button 
                    @click="navigateTo('/')"
                    class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-right"
                    :class="{
                      'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300': currentRoute === '/',
                      'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': currentRoute !== '/'
                    }"
                  >
                    <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                    لوحة التحكم
                  </button>

                  <button 
                    @click="navigateTo('/inventory')"
                    class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-right"
                    :class="{
                      'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300': currentRoute === '/inventory',
                      'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': currentRoute !== '/inventory'
                    }"
                  >
                    <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                    </svg>
                    الأصناف والمخزون
                  </button>

                  <button 
                    @click="navigateTo('/transactions')"
                    class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-right"
                    :class="{
                      'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300': currentRoute === '/transactions',
                      'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': currentRoute !== '/transactions'
                    }"
                  >
                    <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    سجل الحركات
                  </button>

                  <!-- Quick Action -->
                  <button 
                    @click="openAddItemModal"
                    class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-all duration-200 mt-4 text-right"
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
                    class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 text-right"
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
                    class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-right"
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
                    {{ getPageTitle() }}
                  </h1>
                  <p v-if="currentWarehouse" class="text-xs text-primary-600 dark:text-primary-400 truncate">
                    {{ currentWarehouse?.name || 'المخزن الرئيسي' }}
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
            <div v-if="currentRoute === '/'" class="px-4 pb-3">
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
                      <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatNumber(1250) }}</p>
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
                      <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatNumber(42) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <!-- Mobile Main Content Area - FIXED SCROLLING -->
          <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <!-- Content based on current route -->
            <div class="h-full pb-20">
              <div v-if="currentRoute === '/'" class="p-4">
                <DashboardContent />
              </div>
              <div v-else-if="currentRoute === '/inventory'" class="h-full">
                <InventoryContent />
              </div>
              <div v-else-if="currentRoute === '/transactions'" class="p-4">
                <TransactionsContent />
              </div>
              <div v-else-if="currentRoute === '/profile'" class="p-4">
                <ProfileContent />
              </div>
              <div v-else class="p-4">
                <NotFoundContent />
              </div>
            </div>
          </main>

          <!-- Mobile Bottom Navigation - FIXED POSITION -->
          <div class="sticky bottom-0 z-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg pb-safe">
            <div class="grid grid-cols-4 gap-1 p-2">
              <!-- Home Button -->
              <button 
                @click="navigateTo('/')"
                class="flex flex-col items-center p-2 rounded-lg transition-all duration-200"
                :class="{
                  'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20': currentRoute === '/',
                  'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700': currentRoute !== '/'
                }"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <span class="text-xs mt-1">الرئيسية</span>
              </button>

              <!-- Inventory Button -->
              <button 
                @click="navigateTo('/inventory')"
                class="flex flex-col items-center p-2 rounded-lg transition-all duration-200"
                :class="{
                  'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20': currentRoute === '/inventory',
                  'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700': currentRoute !== '/inventory'
                }"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
                <span class="text-xs mt-1">الأصناف</span>
              </button>

              <!-- Quick Add Button (Middle) -->
              <button 
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

              <!-- Transactions Button -->
              <button 
                @click="navigateTo('/transactions')"
                class="flex flex-col items-center p-2 rounded-lg transition-all duration-200"
                :class="{
                  'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20': currentRoute === '/transactions',
                  'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700': currentRoute !== '/transactions'
                }"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <span class="text-xs mt-1">الحركات</span>
              </button>
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
                      {{ getPageTitle() }}
                    </h1>
                    <span class="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full">
                      {{ currentWarehouse?.name || 'المخزن الرئيسي' }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {{ getPageDescription() }}
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
                </div>
              </div>
            </div>
          </header>

          <!-- Desktop Main Content - FIXED SCROLLING -->
          <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <!-- Content based on current route -->
            <div v-if="currentRoute === '/'" class="p-8">
              <DashboardContent />
            </div>
            <div v-else-if="currentRoute === '/inventory'" class="h-full">
              <div class="h-full overflow-y-auto p-8">
                <InventoryContent />
              </div>
            </div>
            <div v-else-if="currentRoute === '/transactions'" class="p-8">
              <TransactionsContent />
            </div>
            <div v-else-if="currentRoute === '/profile'" class="p-8">
              <ProfileContent />
            </div>
            <div v-else class="p-8">
              <NotFoundContent />
            </div>
          </main>
        </div>
      </template>
      
      <!-- If not authenticated, show login screen -->
      <template v-else>
        <div class="flex-1 flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-primary-900/20">
          <LoginContent @login="handleLogin" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import DashboardContent from './components/DashboardContent.vue';
import InventoryContent from './components/InventoryContent.vue';
import TransactionsContent from './components/TransactionsContent.vue';
import ProfileContent from './components/ProfileContent.vue';
import LoginContent from './components/LoginContent.vue';
import NotFoundContent from './components/NotFoundContent.vue';

export default {
  name: 'App',
  
  components: {
    DashboardContent,
    InventoryContent,
    TransactionsContent,
    ProfileContent,
    LoginContent,
    NotFoundContent
  },
  
  setup() {
    // Refs
    const initializing = ref(true);
    const mobileSidebarOpen = ref(false);
    const isDarkMode = ref(false);
    const searchTerm = ref('');
    const showMobileSearch = ref(false);
    const currentRoute = ref('/');
    const isAuthenticated = ref(true); // Demo: set to true to show authenticated view
    
    // Demo data
    const userProfile = ref({
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      role: 'superadmin'
    });
    
    const currentWarehouse = ref({
      id: 1,
      name: 'المخزن الرئيسي',
      location: 'الرياض'
    });
    
    const notificationCount = ref(3);
    
    // Helper Functions
    const getPageTitle = () => {
      const titles = {
        '/': 'لوحة التحكم',
        '/inventory': 'الأصناف والمخزون',
        '/transactions': 'سجل الحركات',
        '/profile': 'الملف الشخصي'
      };
      return titles[currentRoute.value] || 'نظام المخزون';
    };
    
    const getPageDescription = () => {
      const descriptions = {
        '/': 'نظرة عامة على المخزون والحركات',
        '/inventory': 'إدارة وتتبع جميع الأصناف',
        '/transactions': 'سجل كافة الحركات والتعديلات',
        '/profile': 'إدارة حسابك وإعدادات النظام'
      };
      return descriptions[currentRoute.value] || 'نظام إدارة المخزون المتكامل';
    };
    
    const getRoleName = () => {
      const role = userProfile.value.role;
      const names = {
        superadmin: 'المشرف العام',
        warehouse_manager: 'مدير المخازن',
        company_manager: 'مدير الشركة',
        employee: 'موظف',
        viewer: 'مشاهد'
      };
      return names[role] || role;
    };
    
    const getUserInitials = () => {
      const name = userProfile.value.name || 'مدير النظام';
      const parts = name.trim().split(' ');
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };
    
    const formatNumber = (num) => {
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
    const navigateTo = (route) => {
      currentRoute.value = route;
      mobileSidebarOpen.value = false;
      showMobileSearch.value = false;
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const toggleSearch = () => {
      showMobileSearch.value = !showMobileSearch.value;
    };
    
    const showNotifications = () => {
      navigateTo('/transactions');
      alert('تم فتح سجل الحركات لعرض الإشعارات');
    };
    
    const openAddItemModal = () => {
      mobileSidebarOpen.value = false;
      alert('فتح نافذة إضافة صنف جديد');
    };
    
    // Search Handler
    const handleSearch = () => {
      if (searchTerm.value.trim()) {
        alert(`بحث عن: ${searchTerm.value}`);
      }
    };
    
    // Auth Functions
    const handleLogin = () => {
      isAuthenticated.value = true;
      navigateTo('/');
    };
    
    const logout = () => {
      isAuthenticated.value = false;
      currentRoute.value = '/';
      mobileSidebarOpen.value = false;
      alert('تم تسجيل الخروج بنجاح');
    };
    
    // Lifecycle
    onMounted(() => {
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
      
      // Simulate loading
      setTimeout(() => {
        initializing.value = false;
      }, 1000);
    });
    
    return {
      // Refs
      initializing,
      mobileSidebarOpen,
      isDarkMode,
      searchTerm,
      showMobileSearch,
      currentRoute,
      isAuthenticated,
      userProfile,
      currentWarehouse,
      notificationCount,
      
      // Methods
      getPageTitle,
      getPageDescription,
      getRoleName,
      getUserInitials,
      formatNumber,
      toggleDarkMode,
      navigateTo,
      toggleSearch,
      showNotifications,
      openAddItemModal,
      handleSearch,
      handleLogin,
      logout
    };
  }
};
</script>

<style>
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

/* Tailwind classes for demo */
.bg-primary-50 { background-color: #fefce8; }
.dark .bg-primary-50 { background-color: #1c1917; }
.bg-primary-100 { background-color: #fef9c3; }
.dark .bg-primary-100 { background-color: #292524; }
.bg-primary-500 { background-color: #eab308; }
.bg-primary-600 { background-color: #ca8a04; }
.bg-primary-700 { background-color: #a16207; }
.bg-primary-900 { background-color: #713f12; }
.dark .bg-primary-900 { background-color: #fef9c3; }

.text-primary-300 { color: #fde047; }
.dark .text-primary-300 { color: #fef08a; }
.text-primary-400 { color: #facc15; }
.dark .text-primary-400 { color: #fde047; }
.text-primary-500 { color: #eab308; }
.text-primary-600 { color: #ca8a04; }
.text-primary-700 { color: #a16207; }
.dark .text-primary-700 { color: #fef9c3; }

.bg-blue-50 { background-color: #eff6ff; }
.dark .bg-blue-50 { background-color: #1e3a8a; }
.text-blue-400 { color: #60a5fa; }
.dark .text-blue-400 { color: #93c5fd; }
.text-blue-600 { color: #2563eb; }

.bg-red-50 { background-color: #fef2f2; }
.dark .bg-red-50 { background-color: #7f1d1d; }
.text-red-400 { color: #f87171; }
.dark .text-red-400 { color: #fca5a5; }
.text-red-600 { color: #dc2626; }

.bg-gray-50 { background-color: #f9fafb; }
.dark .bg-gray-50 { background-color: #111827; }
.bg-gray-100 { background-color: #f3f4f6; }
.dark .bg-gray-100 { background-color: #1f2937; }
.bg-gray-200 { background-color: #e5e7eb; }
.dark .bg-gray-200 { background-color: #374151; }
.bg-gray-700 { background-color: #374151; }
.dark .bg-gray-700 { background-color: #e5e7eb; }
.bg-gray-800 { background-color: #1f2937; }
.dark .bg-gray-800 { background-color: #f3f4f6; }
.bg-gray-900 { background-color: #111827; }
.dark .bg-gray-900 { background-color: #f9fafb; }

.text-gray-300 { color: #d1d5db; }
.dark .text-gray-300 { color: #4b5563; }
.text-gray-400 { color: #9ca3af; }
.dark .text-gray-400 { color: #6b7280; }
.text-gray-500 { color: #6b7280; }
.dark .text-gray-500 { color: #9ca3af; }
.text-gray-600 { color: #4b5563; }
.dark .text-gray-600 { color: #d1d5db; }
.text-gray-700 { color: #374151; }
.dark .text-gray-700 { color: #e5e7eb; }
.text-gray-900 { color: #111827; }
.dark .text-gray-900 { color: #f9fafb; }

.border-gray-200 { border-color: #e5e7eb; }
.dark .border-gray-200 { border-color: #374151; }
.border-gray-700 { border-color: #374151; }
.dark .border-gray-700 { border-color: #e5e7eb; }

.space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

.ml-3 { margin-left: 0.75rem; }
.ml-2 { margin-left: 0.5rem; }
.mr-auto { margin-right: auto; }

.shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
.shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
.shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }

.rounded-lg { border-radius: 0.5rem; }
.rounded-xl { border-radius: 0.75rem; }

.grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.gap-1 { gap: 0.25rem; }
.gap-3 { gap: 0.75rem; }

.transform { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }
.hover\:scale-105:hover { --tw-scale-x: 1.05; --tw-scale-y: 1.05; }
.active\:scale-95:active { --tw-scale-x: 0.95; --tw-scale-y: 0.95; }

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
</style>