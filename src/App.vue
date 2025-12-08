<template>
  <div id="app" dir="rtl" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Global Notifications -->
    <div v-if="notifications.length > 0" class="fixed top-4 left-4 right-4 z-50 space-y-2">
      <transition-group name="notification">
        <!-- Notification items remain the same -->
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          :class="[
            'p-4 rounded-lg shadow-lg border transform transition-all duration-300',
            notification.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200' :
            notification.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200' :
            notification.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200' :
            'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
          ]"
        >
          <!-- Notification content -->
        </div>
      </transition-group>
    </div>

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
                  <p v-if="currentWarehouseName" class="text-xs text-yellow-600 dark:text-yellow-400 truncate">
                    {{ currentWarehouseName }}
                  </p>
                </div>

                <!-- Right: Actions -->
                <div class="flex items-center space-x-2 space-x-reverse">
                  <button 
                    @click="toggleDarkMode"
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <!-- Dark mode icon -->
                  </button>

                  <button 
                    @click="showNotifications"
                    class="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <!-- Notification icon -->
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
                <!-- Logo and close button -->
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center space-x-3 space-x-reverse">
                    <div class="h-10 w-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                      <span class="text-white font-bold text-sm">م</span>
                    </div>
                    <div>
                      <h1 class="text-base font-bold text-gray-900 dark:text-white">نظام المخزون</h1>
                      <p class="text-xs text-gray-500 dark:text-gray-400">مونوفيا</p>
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

              <!-- Navigation Links (MOVED FROM DASHBOARD) -->
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
                      class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                      </svg>
                      نقل بين المخازن
                    </button>

                    <!-- Dispatch Button -->
                    <button 
                      @click="openDispatchModal"
                      class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    >
                      <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      صرف إلى خارجي
                    </button>

                    <!-- Add Warehouse Button -->
                    <button 
                      v-if="canManageWarehouses"
                      @click="openAddWarehouseModal"
                      class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      إضافة مخزن جديد
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
          <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <router-view />
          </main>

          <!-- Mobile Bottom Navigation -->
          <div v-if="showBottomNav" class="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe">
            <div class="grid grid-cols-4 gap-1 p-2">
              <!-- Home -->
              <router-link 
                to="/" 
                class="flex flex-col items-center p-2 rounded-lg transition-colors"
                :class="{'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20': $route.path === '/', 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700': $route.path !== '/'}"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <span class="text-xs mt-1">الرئيسية</span>
              </router-link>

              <!-- Inventory -->
              <router-link 
                to="/inventory" 
                class="flex flex-col items-center p-2 rounded-lg transition-colors"
                :class="{'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20': $route.path.includes('/inventory'), 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700': !$route.path.includes('/inventory')}"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
                <span class="text-xs mt-1">الأصناف</span>
              </router-link>

              <!-- Quick Add -->
              <button 
                v-if="canModifyItems"
                @click="openAddItemModal" 
                class="flex flex-col items-center p-2 rounded-lg bg-gradient-to-b from-yellow-500 to-orange-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <div class="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mb-1">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </div>
                <span class="text-xs">إضافة</span>
              </button>
              <div v-else class="p-2"></div>

              <!-- Profile -->
              <button 
                @click="toggleProfileMenu" 
                class="flex flex-col items-center p-2 rounded-lg transition-colors"
                :class="{'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20': profileMenuOpen, 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700': !profileMenuOpen}"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span class="text-xs mt-1">حسابي</span>
              </button>
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
          <aside class="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
            <!-- Sidebar Header -->
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center space-x-3 space-x-reverse">
                <div class="h-12 w-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span class="text-white font-bold text-lg">م</span>
                </div>
                <div>
                  <h1 class="text-xl font-bold text-gray-900 dark:text-white">نظام المخزون</h1>
                  <p class="text-sm text-gray-500 dark:text-gray-400">مونوفيا</p>
                </div>
              </div>
            </div>

            <!-- User Profile -->
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center">
                <div class="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center shadow-sm ml-3">
                  <span class="text-white font-medium text-sm">
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

            <!-- Navigation Links (MOVED FROM DASHBOARD) -->
            <div class="flex-1 p-6 space-y-2 overflow-y-auto">
              <!-- Dashboard Link -->
              <router-link 
                to="/" 
                class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                :class="{'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/', 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': $route.path !== '/'}"
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
                class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                :class="{'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400': $route.path === '/warehouses', 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': $route.path !== '/warehouses'}"
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
                class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                :class="{'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/users', 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': $route.path !== '/users'}"
              >
                <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                إدارة المستخدمين
              </router-link>

              <!-- Inventory Link -->
              <router-link 
                to="/inventory" 
                class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                :class="{'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path.includes('/inventory'), 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': !$route.path.includes('/inventory')}"
              >
                <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
                الأصناف
              </router-link>

              <!-- Transactions Link -->
              <router-link 
                to="/transactions" 
                class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                :class="{'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/transactions', 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': $route.path !== '/transactions'}"
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
                class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                :class="{'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/reports', 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': $route.path !== '/reports'}"
              >
                <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                التقارير
              </router-link>

              <!-- Profile Link -->
              <router-link 
                to="/profile" 
                class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                :class="{'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400': $route.path === '/profile', 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50': $route.path !== '/profile'}"
              >
                <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                إعدادات الحساب
              </router-link>

              <!-- Quick Actions Section -->
              <div v-if="canModifyItems" class="mt-6 mb-4">
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                  إجراءات سريعة
                </p>
                <div class="space-y-2">
                  <!-- Add Item Button -->
                  <button 
                    @click="openAddItemModal"
                    class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                  >
                    <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    إضافة صنف جديد
                  </button>

                  <!-- Transfer Button -->
                  <button 
                    @click="openTransferModal"
                    class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  >
                    <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                    </svg>
                    نقل بين المخازن
                  </button>

                  <!-- Dispatch Button -->
                  <button 
                    @click="openDispatchModal"
                    class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                  >
                    <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    صرف إلى خارجي
                  </button>

                  <!-- Add Warehouse Button -->
                  <button 
                    v-if="canManageWarehouses"
                    @click="openAddWarehouseModal"
                    class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    إضافة مخزن جديد
                  </button>
                </div>
              </div>

              <!-- Logout Button -->
              <button 
                @click="logout"
                class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-4"
              >
                <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                تسجيل خروج
              </button>
            </div>
          </aside>

          <!-- Main Content Area -->
          <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Desktop Header -->
            <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div class="flex items-center justify-between">
                <!-- Page Title -->
                <div>
                  <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ getPageTitle() }}
                  </h1>
                  <p v-if="currentWarehouseName" class="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                    {{ currentWarehouseName }}
                  </p>
                </div>

                <!-- Header Actions -->
                <div class="flex items-center space-x-4 space-x-reverse">
                  <!-- Search -->
                  <div class="relative w-64">
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                    </div>
                    <input
                      type="search"
                      placeholder="ابحث عن صنف، حركة، أو مستخدم..."
                      class="block w-full pr-10 pl-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>

                  <!-- Dark Mode -->
                  <button 
                    @click="toggleDarkMode"
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <!-- Dark mode icon -->
                  </button>

                  <!-- Notifications -->
                  <button 
                    @click="showNotifications"
                    class="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <!-- Notification icon -->
                  </button>
                </div>
              </div>
            </header>

            <!-- Main Content -->
            <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
              <router-view />
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
