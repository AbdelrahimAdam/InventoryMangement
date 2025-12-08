<template>
  <div id="app" dir="rtl" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Loading -->
    <div v-if="initializing" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">جاري التحميل...</p>
      </div>
    </div>

    <!-- Main app -->
    <div v-else class="h-screen flex flex-col">
      <!-- Public routes -->
      <template v-if="isPublicRoute">
        <div class="flex-1 overflow-y-auto">
          <router-view />
        </div>
      </template>

      <!-- Authenticated layout -->
      <template v-else>
        <!-- Desktop Sidebar -->
        <aside class="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-lg">
          <!-- Sidebar Header -->
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <router-link to="/" class="flex items-center space-x-3 space-x-reverse">
              <div class="h-12 w-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                <span class="text-white font-bold text-lg">م</span>
              </div>
              <div>
                <h1 class="text-lg font-bold text-gray-900 dark:text-white">نظام المخزون</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">مونوفيا</p>
              </div>
            </router-link>
          </div>

          <!-- User Profile -->
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center">
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
            </div>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 overflow-y-auto p-4 space-y-2">
            <!-- Main Navigation -->
            <div class="space-y-1">
              <router-link 
                to="/" 
                class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
                :class="{
                  'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-r-4 border-primary-500': $route.path === '/',
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/'
                }"
              >
                <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                لوحة التحكم
                <span v-if="$route.path === '/'" class="absolute left-4 h-2 w-2 bg-primary-500 rounded-full"></span>
              </router-link>

              <!-- Inventory -->
              <router-link 
                to="/inventory" 
                class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
                :class="{
                  'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-r-4 border-primary-500': $route.path.includes('/inventory'),
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': !$route.path.includes('/inventory')
                }"
              >
                <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
                الأصناف
                <span v-if="$route.path.includes('/inventory')" class="absolute left-4 h-2 w-2 bg-primary-500 rounded-full"></span>
              </router-link>
            </div>

            <!-- Quick Actions -->
            <div v-if="canModifyItems" class="mt-4">
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-4">
                إجراءات سريعة
              </p>
              <div class="space-y-2">
                <button 
                  @click="openAddItemModal"
                  class="w-full flex items-center px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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
              @click="toggleDarkMode"
              class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
              تسجيل خروج
            </button>
          </div>
        </aside>

        <!-- Mobile Layout -->
        <div class="lg:hidden flex-1 flex flex-col">
          <!-- Mobile Overlay for sidebar -->
          <transition name="fade">
            <div 
              v-if="mobileSidebarOpen"
              class="fixed inset-0 z-40"
              @click="mobileSidebarOpen = false"
            >
              <div class="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>
          </transition>

          <!-- Mobile Sidebar -->
          <transition name="slide">
            <aside 
              v-if="mobileSidebarOpen"
              class="fixed top-0 right-0 z-50 h-full w-64 bg-white dark:bg-gray-800 shadow-xl"
            >
              <div class="h-full flex flex-col">
                <!-- Sidebar Header -->
                <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center space-x-3 space-x-reverse">
                      <div class="h-10 w-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm">
                        <span class="text-white font-bold text-sm">م</span>
                      </div>
                      <div>
                        <h1 class="text-base font-bold text-gray-900 dark:text-white">نظام المخزون</h1>
                        <p class="text-xs text-gray-500 dark:text-gray-400">مونوفيا</p>
                      </div>
                    </div>
                    <button 
                      @click="mobileSidebarOpen = false"
                      class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>

                  <!-- User Profile -->
                  <div class="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <div class="h-9 w-9 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center shadow-sm ml-3">
                      <span class="text-white font-medium text-xs">
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
                  </div>
                </div>

                <!-- Mobile Navigation -->
                <nav class="flex-1 overflow-y-auto p-4">
                  <div class="space-y-1">
                    <router-link 
                      to="/" 
                      @click="mobileSidebarOpen = false"
                      class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                      :class="{
                        'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-r-4 border-primary-500': $route.path === '/',
                        'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/'
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
                        'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-r-4 border-primary-500': $route.path.includes('/inventory'),
                        'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': !$route.path.includes('/inventory')
                      }"
                    >
                      <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                      </svg>
                      الأصناف
                    </router-link>

                    <!-- Quick Add Button -->
                    <button 
                      v-if="canModifyItems"
                      @click="openAddItemModal"
                      class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                    >
                      <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      إضافة صنف جديد
                    </button>
                  </div>
                </nav>

                <!-- Mobile Sidebar Footer -->
                <div class="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <button 
                    @click="toggleDarkMode"
                    class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                    تسجيل خروج
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
                  class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <svg class="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                </button>

                <!-- Page Title -->
                <div class="flex-1 text-center">
                  <h1 class="text-lg font-bold text-gray-900 dark:text-white">
                    {{ getPageTitle(route.name) }}
                  </h1>
                </div>

                <!-- Notifications -->
                <button 
                  @click="showNotifications"
                  class="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <svg class="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                  </svg>
                  <span v-if="notificationCount > 0" class="absolute -top-1 -left-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {{ notificationCount > 9 ? '9+' : notificationCount }}
                  </span>
                </button>
              </div>
            </div>
          </header>

          <!-- Main Content Area - FIXED SCROLLING ISSUE -->
          <main class="flex-1 overflow-y-auto">
            <!-- Scrollable content wrapper -->
            <div class="min-h-full">
              <!-- Special handling for item details page -->
              <template v-if="$route.name === 'ItemDetails'">
                <!-- Full-screen scrollable item details -->
                <div class="h-full overflow-y-auto">
                  <router-view />
                </div>
              </template>
              <template v-else>
                <!-- Normal page layout -->
                <div class="p-4">
                  <router-view />
                </div>
              </template>
            </div>
          </main>

          <!-- Mobile Bottom Navigation - ONLY FOR INVENTORY -->
          <div v-if="$route.name === 'Inventory' || $route.name === 'ItemDetails'" class="sticky bottom-0 z-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg pb-safe">
            <div class="grid grid-cols-3 gap-1 p-2">
              <!-- Back Button (only on details page) -->
              <button 
                v-if="$route.name === 'ItemDetails'"
                @click="router.back()"
                class="flex flex-col items-center p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                <span class="text-xs mt-1">رجوع</span>
              </button>
              <div v-else class="p-3"></div> <!-- Spacer -->

              <!-- Quick Add Button -->
              <button 
                v-if="canModifyItems"
                @click="openAddItemModal"
                class="flex flex-col items-center p-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-colors shadow-lg"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span class="text-xs mt-1">إضافة صنف</span>
              </button>

              <!-- Search Button -->
              <button 
                @click="openSearch"
                class="flex flex-col items-center p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <span class="text-xs mt-1">بحث</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Desktop Content Area -->
        <div class="hidden lg:flex flex-1 flex-col">
          <!-- Desktop Header -->
          <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div class="px-6 py-4">
              <div class="flex items-center justify-between">
                <!-- Page Title and Breadcrumb -->
                <div>
                  <h1 class="text-xl font-bold text-gray-900 dark:text-white">
                    {{ getPageTitle(route.name) }}
                  </h1>
                  <p v-if="currentWarehouse" class="text-sm text-primary-600 dark:text-primary-400 mt-1">
                    {{ currentWarehouse.name }}
                  </p>
                </div>

                <!-- Desktop Actions -->
                <div class="flex items-center space-x-4 space-x-reverse">
                  <!-- Search -->
                  <div class="relative">
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="ابحث عن صنف..."
                      class="w-64 pr-10 pl-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <!-- Quick Add Button -->
                  <button 
                    v-if="canModifyItems"
                    @click="openAddItemModal"
                    class="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    إضافة صنف
                  </button>
                </div>
              </div>
            </div>
          </header>

          <!-- Desktop Main Content - FIXED SCROLLING -->
          <main class="flex-1 overflow-y-auto">
            <!-- Special handling for item details -->
            <template v-if="$route.name === 'ItemDetails'">
              <div class="h-full overflow-y-auto p-6">
                <router-view />
              </div>
            </template>
            <template v-else>
              <div class="p-6">
                <router-view />
              </div>
            </template>
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

export default {
  name: 'App',
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    
    const initializing = ref(true);
    const mobileSidebarOpen = ref(false);
    const isDarkMode = ref(false);

    // Check authentication
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    
    // Check if public route
    const isPublicRoute = computed(() => {
      const publicRoutes = ['Login', 'Unauthorized', 'NotFound'];
      return publicRoutes.includes(route.name);
    });
    
    // Get user info
    const userRole = computed(() => store.getters.userRole);
    const userProfile = computed(() => store.state.userProfile);
    const currentWarehouse = computed(() => store.state.currentWarehouse);
    const notificationCount = computed(() => store.getters.dashboardStats?.lowStockItems || 0);
    
    // Permissions
    const canModifyItems = computed(() => {
      const role = userRole.value;
      if (role === 'superadmin') return true;
      if (role === 'warehouse_manager') {
        const profile = userProfile.value;
        const hasWarehouses = profile?.allowed_warehouses?.length > 0;
        const hasPermission = profile?.permissions?.includes('full_access') || 
                              profile?.permissions?.includes('manage_inventory');
        return hasWarehouses && hasPermission;
      }
      return false;
    });

    // Helper functions
    const getPageTitle = (routeName) => {
      const titles = {
        'Dashboard': 'لوحة التحكم',
        'Inventory': 'الأصناف',
        'ItemDetails': 'تفاصيل الصنف',
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

    const showNotifications = () => {
      router.push('/transactions');
      mobileSidebarOpen.value = false;
    };

    const openAddItemModal = () => {
      mobileSidebarOpen.value = false;
      // Dispatch event for modals to handle
      window.dispatchEvent(new CustomEvent('open-add-item-modal'));
    };

    const openSearch = () => {
      // Focus on search input if exists, otherwise show search modal
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="بحث"]');
      if (searchInput) {
        searchInput.focus();
      } else {
        // Show search modal or navigate to search page
        router.push('/inventory?search=true');
      }
    };

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
        
        // Handle dark mode changes
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

        // Close sidebar on escape
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

    // Close sidebar on route change
    watch(() => route.path, () => {
      mobileSidebarOpen.value = false;
    });

    return {
      initializing,
      isAuthenticated,
      isPublicRoute,
      mobileSidebarOpen,
      isDarkMode,
      notificationCount,
      userRole,
      userProfile,
      currentWarehouse,
      canModifyItems,
      getPageTitle,
      getRoleName,
      getUserInitials,
      toggleDarkMode,
      showNotifications,
      openAddItemModal,
      openSearch,
      logout,
      router
    };
  }
};
</script>

<style scoped>
/* Safe area for mobile */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* Smooth transitions */
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
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Fix scrolling issues */
.overflow-y-auto {
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
}

/* Better touch targets */
button,
[role="button"] {
  min-height: 44px;
  min-width: 44px;
}

/* Focus styles */
:focus-visible {
  outline: 2px solid #eab308;
  outline-offset: 2px;
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

/* Fix for item details page */
.item-details-container {
  height: 100vh;
  overflow-y: auto;
}

/* Responsive improvements */
@media (max-width: 640px) {
  .item-details-container {
    height: calc(100vh - 60px); /* Account for header */
  }
}

/* Z-index layers */
aside {
  z-index: 50;
}

header {
  z-index: 40;
}

.pb-safe {
  z-index: 30;
}

/* Prevent body scroll when sidebar is open */
body.sidebar-open {
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
}

/* Animation for active state */
.border-r-4 {
  border-right-width: 4px;
  border-right-style: solid;
}

/* Gradient backgrounds */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Responsive typography */
@media (max-width: 640px) {
  h1 {
    font-size: 1.25rem;
  }
  
  .text-sm {
    font-size: 0.875rem;
  }
  
  .text-xs {
    font-size: 0.75rem;
  }
}

/* Button press effect */
button:active {
  transform: scale(0.98);
  transition: transform 0.1s ease;
}

/* Card styles */
.rounded-xl {
  border-radius: 0.75rem;
}

/* Shadow depths */
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
