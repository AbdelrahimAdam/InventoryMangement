
<template>
  <div class="flex-1 overflow-hidden flex flex-col">
    <!-- Desktop Header Only (hidden on mobile) -->
    <header class="hidden lg:block bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-full mx-auto px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Left side: Logo -->
          <div class="flex items-center space-x-3 space-x-reverse">
            <router-link to="/" class="flex items-center space-x-3 space-x-reverse">
              <div class="flex-shrink-0">
                <div class="h-9 w-9 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                  <span class="text-white font-bold text-sm">م</span>
                </div>
              </div>
              <div>
                <h1 class="text-lg font-bold text-gray-900 dark:text-white leading-tight">نظام إدارة المخزون</h1>
                <p class="text-xs text-gray-500 dark:text-gray-400">منظمة مونوفيا</p>
              </div>
            </router-link>
          </div>

          <!-- Right Side Controls -->
          <div class="flex items-center space-x-4 space-x-reverse">
            <!-- Dark/Light Mode Toggle -->
            <button 
              @click="toggleDarkMode"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              :title="isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'"
            >
              <svg v-if="isDarkMode" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
              </svg>
              <svg v-else class="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
              </svg>
            </button>

            <!-- Notifications -->
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

            <!-- User Profile -->
            <div class="flex items-center space-x-3 space-x-reverse">
              <!-- Desktop User Info -->
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ userName }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">{{ userProfile?.email }}</p>
              </div>

              <!-- User Dropdown Trigger -->
              <div class="relative">
                <button 
                  @click="toggleUserMenu"
                  class="flex items-center space-x-2 space-x-reverse focus:outline-none"
                >
                  <span :class="['inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200', roleBadgeClass]">
                    {{ getRoleName(userRole) }}
                  </span>
                  <div class="h-9 w-9 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center shadow-sm">
                    <span class="text-white font-medium text-sm">
                      {{ getUserInitials(userName) }}
                    </span>
                  </div>
                </button>

                <!-- User Dropdown Menu -->
                <div v-if="showUserMenu" class="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ userName }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ userProfile?.email }}</p>
                    <div class="mt-1">
                      <span :class="['inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', roleBadgeClass]">
                        {{ getRoleName(userRole) }}
                      </span>
                    </div>
                  </div>
                  <div class="py-1">
                    <router-link 
                      to="/profile"
                      @click="showUserMenu = false"
                      class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      إعدادات الحساب
                    </router-link>
                    <button 
                      @click="logout"
                      class="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
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
          </div>
        </div>
      </div>
    </header>

    <!-- Role Information Banner (Desktop only) -->
    <div class="hidden lg:block bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 border-b border-yellow-100 dark:border-gray-700">
      <div class="max-w-full mx-auto px-6 lg:px-8 py-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2 space-x-reverse">
            <span class="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              <span class="font-bold">دورك الحالي:</span> {{ getRoleDescription(userRole) }}
            </span>
            <div class="w-px h-4 bg-yellow-200 dark:bg-gray-600"></div>
            <div class="text-xs text-yellow-600 dark:text-yellow-400">
              المخازن المسموحة: {{ allowedWarehousesText }}
            </div>
          </div>
          <div class="flex space-x-2 space-x-reverse">
            <span v-if="canModifyItems" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              <svg class="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
              </svg>
              تعديل المخزون
            </span>
            <span v-if="canManageUsers" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
              <svg class="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
              </svg>
              إدارة المستخدمين
            </span>
            <span v-if="canViewReports" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <svg class="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              عرض التقارير
            </span>
            <span v-if="canManageWarehouses" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              إدارة المخازن
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content with Sidebar -->
    <div class="flex-1 overflow-hidden">
      <div class="max-w-full mx-auto h-full px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div class="flex flex-col lg:flex-row gap-4 lg:gap-6 h-full">
          <!-- Sidebar (Desktop only) -->
          <aside class="hidden lg:block lg:w-1/4 xl:w-1/5">
            <div class="sticky top-6 h-[calc(100vh-9rem)] overflow-y-auto">
              <div class="space-y-6 pb-6">
                <!-- Navigation Sidebar Component -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                    <svg class="w-4 h-4 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                    </svg>
                    القائمة الرئيسية
                  </h3>
                  <div class="space-y-1">
                    <template v-for="nav in filteredNavLinks" :key="nav.path">
                      <router-link 
                        v-if="nav.show"
                        :to="nav.path" 
                        class="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        :class="[
                          $route.path === nav.path 
                            ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        ]"
                      >
                        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="nav.icon" />
                        </svg>
                        {{ nav.title }}
                      </router-link>
                    </template>
                  </div>
                </div>

                <!-- Quick Actions Sidebar Component -->
                <div v-if="canModifyItems || canManageWarehouses" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                    <svg class="w-4 h-4 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    إجراءات سريعة
                  </h3>
                  <div class="space-y-2">
                    <button 
                      v-if="canModifyItems"
                      @click="openAddItemModal"
                      class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors duration-200 group"
                    >
                      <div class="flex items-center">
                        <div class="h-8 w-8 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-3">
                          <svg class="w-4 h-4 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                          </svg>
                        </div>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">إضافة صنف جديد</span>
                      </div>
                      <svg class="w-4 h-4 text-gray-400 group-hover:text-yellow-500 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>

                    <button 
                      v-if="canModifyItems"
                      @click="openTransferModal"
                      class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200 group"
                    >
                      <div class="flex items-center">
                        <div class="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                          <svg class="w-4 h-4 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                          </svg>
                        </div>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">نقل بين المخازن</span>
                      </div>
                      <svg class="w-4 h-4 text-gray-400 group-hover:text-green-500 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>

                    <button 
                      v-if="canModifyItems"
                      @click="openDispatchModal"
                      class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors duration-200 group"
                    >
                      <div class="flex items-center">
                        <div class="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center mr-3">
                          <svg class="w-4 h-4 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                          </svg>
                        </div>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">صرف إلى خارجي</span>
                      </div>
                      <svg class="w-4 h-4 text-gray-400 group-hover:text-orange-500 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>

                    <!-- Add User Button for Super Admin -->
                    <button 
                      v-if="canManageUsers"
                      @click="openAddUserModal"
                      class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 group"
                    >
                      <div class="flex items-center">
                        <div class="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                          <svg class="w-4 h-4 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                          </svg>
                        </div>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">إضافة مستخدم جديد</span>
                      </div>
                      <svg class="w-4 h-4 text-gray-400 group-hover:text-blue-500 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>

                    <!-- Add Warehouse Button for Super Admin -->
                    <button 
                      v-if="canManageWarehouses"
                      @click="openAddWarehouseModal"
                      class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-200 group"
                    >
                      <div class="flex items-center">
                        <div class="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                          <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                          </svg>
                        </div>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">إضافة مخزن جديد</span>
                      </div>
                      <svg class="w-4 h-4 text-gray-400 group-hover:text-indigo-500 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Warehouse Selector Sidebar Component -->
                <div v-if="accessibleWarehouses.length > 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                    <svg class="w-4 h-4 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                    المخازن المتاحة
                  </h3>
                  <div class="space-y-2">
                    <button 
                      v-for="warehouse in accessibleWarehouses" 
                      :key="warehouse.id"
                      @click="() => selectWarehouse(warehouse.id)"
                      class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group"
                      :class="{'bg-yellow-50 dark:bg-yellow-900/20': selectedWarehouse === warehouse.id}"
                    >
                      <div class="flex items-center">
                        <div class="h-6 w-6 rounded-md bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-2">
                          <span class="text-xs text-yellow-600 dark:text-yellow-300 font-medium">{{ warehouse.name_ar.charAt(0) }}</span>
                        </div>
                        <span class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ warehouse.name_ar }}</span>
                        <span v-if="warehouse.is_main" class="mr-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">رئيسي</span>
                      </div>
                      <span v-if="selectedWarehouse === warehouse.id" class="h-2 w-2 rounded-full bg-yellow-500"></span>
                    </button>
                  </div>
                  <button 
                    v-if="canManageWarehouses"
                    @click="$router.push('/warehouses')"
                    class="w-full mt-4 flex items-center justify-center p-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors duration-200"
                  >
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    </svg>
                    إدارة المخازن
                  </button>
                </div>
              </div>
            </div>
          </aside>
          
          <!-- Main Content Area -->
          <main class="w-full lg:w-3/4 xl:w-4/5 h-full overflow-hidden">
            <!-- Content with proper scrolling -->
            <div class="h-full overflow-y-auto pb-16 lg:pb-0">
              <!-- Dynamic Content based on route -->
              <router-view v-if="$route.path !== '/'" />

              <!-- Dashboard Home -->
              <div v-else class="space-y-4 lg:space-y-6">
                <!-- Stats Overview -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
                  <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-200 hover:shadow-md">
                    <div class="px-3 py-4 lg:px-4 lg:py-5">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                          <svg class="h-5 w-5 lg:h-6 lg:w-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                          </svg>
                        </div>
                        <div class="mr-3 lg:mr-4">
                          <dt class="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">إجمالي الأصناف</dt>
                          <dd class="mt-1 text-lg lg:text-2xl font-semibold text-gray-900 dark:text-white">{{ dashboardStats.totalItems }}</dd>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-200 hover:shadow-md">
                    <div class="px-3 py-4 lg:px-4 lg:py-5">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <svg class="h-5 w-5 lg:h-6 lg:w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        </div>
                        <div class="mr-3 lg:mr-4">
                          <dt class="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">إجمالي الكمية</dt>
                          <dd class="mt-1 text-lg lg:text-2xl font-semibold text-gray-900 dark:text-white">{{ formatNumber(dashboardStats.totalQuantity) }}</dd>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-200 hover:shadow-md">
                    <div class="px-3 py-4 lg:px-4 lg:py-5">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                          <svg class="h-5 w-5 lg:h-6 lg:w-6 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        </div>
                        <div class="mr-3 lg:mr-4">
                          <dt class="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">أصناف قليلة</dt>
                          <dd class="mt-1 text-lg lg:text-2xl font-semibold text-red-600 dark:text-red-400">{{ dashboardStats.lowStockItems }}</dd>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-200 hover:shadow-md">
                    <div class="px-3 py-4 lg:px-4 lg:py-5">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <svg class="h-5 w-5 lg:h-6 lg:w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                          </svg>
                        </div>
                        <div class="mr-3 lg:mr-4">
                          <dt class="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">الحركات اليوم</dt>
                          <dd class="mt-1 text-lg lg:text-2xl font-semibold text-gray-900 dark:text-white">{{ dashboardStats.recentTransactions }}</dd>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Search and Filter Bar -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
                  <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 lg:mb-6">
                    <div>
                      <h2 class="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">المخزون الحالي</h2>
                      <p class="text-xs lg:text-sm text-gray-500 dark:text-gray-400">عرض جميع الأصناف في النظام</p>
                    </div>

                    <div class="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                      <!-- Search Input -->
                      <div class="relative flex-grow">
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                          </svg>
                        </div>
                        <input
                          type="text"
                          v-model="searchTerm"
                          @input="handleSearch"
                          placeholder="ابحث عن صنف..."
                          class="block w-full pr-10 pl-3 py-2 text-sm lg:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
                        />
                      </div>

                      <!-- Filter by Warehouse -->
                      <select
                        v-model="selectedWarehouse"
                        @change="handleWarehouseChange"
                        class="block w-full lg:w-auto pl-3 pr-10 py-2 text-sm lg:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
                        :disabled="loading || accessibleWarehouses.length === 0"
                      >
                        <option value="">جميع المخازن</option>
                        <option v-for="warehouse in accessibleWarehouses" :key="warehouse.id" :value="warehouse.id">
                          {{ warehouse.name_ar }}
                        </option>
                      </select>

                      <!-- Add Item Button -->
                      <button 
                        v-if="canModifyItems"
                        @click="openAddItemModal"
                        class="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm lg:text-base"
                      >
                        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        <span class="hidden lg:inline">إضافة صنف</span>
                        <span class="lg:hidden">إضافة</span>
                      </button>
                    </div>
                  </div>

                  <!-- Loading State -->
                  <div v-if="loading" class="text-center py-8">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
                    <p class="mt-2 text-gray-600 dark:text-gray-400">جاري تحميل البيانات...</p>
                  </div>

                  <!-- Integrated InventoryTable Component -->
                  <div v-else-if="transformedInventory.length > 0" class="overflow-x-auto">
                    <InventoryTable 
                      :items="transformedInventory"
                      :readonly="!canModifyItems"
                      :user-role="userRole"
                      @transfer="openTransferModalForItem"
                      @dispatch="openDispatchModalForItem"
                    />
                  </div>

                  <!-- Pagination Info -->
                  <div v-if="transformedInventory.length > 0" class="mt-4 text-xs lg:text-sm text-gray-700 dark:text-gray-400">
                    عرض {{ transformedInventory.length }} من {{ inventory.length }} صنف
                  </div>

                  <!-- Empty State -->
                  <div v-else-if="!loading" class="text-center py-8 lg:py-12">
                    <svg class="mx-auto h-10 w-10 lg:h-12 lg:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">لا توجد بيانات</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">لم يتم إضافة أي أصناف بعد.</p>
                    <button 
                      v-if="canModifyItems" 
                      @click="openAddItemModal" 
                      class="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors duration-200 shadow-md text-sm lg:text-base"
                    >
                      إضافة صنف جديد
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>

    <!-- Inventory Modals -->
    <AddItemModal 
      v-if="showAddItemModal"
      :isOpen="showAddItemModal"
      @close="showAddItemModal = false"
      @success="handleItemAdded"
    />

    <TransferModal 
      v-if="showTransferModal"
      :isOpen="showTransferModal"
      @close="showTransferModal = false"
      @success="handleTransferSuccess"
    />

    <DispatchModal 
      v-if="showDispatchModal"
      :isOpen="showDispatchModal"
      @close="showDispatchModal = false"
      @success="handleDispatchSuccess"
    />

    <!-- User Management Modal -->
    <UserModal
      v-if="showUserModal"
      :isOpen="showUserModal"
      :user="selectedUser"
      @close="closeUserModal"
      @save="handleUserSave"
    />

    <!-- Add User Modal -->
    <AddUserModal
      v-if="showAddUserModal"
      :isOpen="showAddUserModal"
      @close="showAddUserModal = false"
      @success="handleUserAdded"
    />

    <!-- Warehouse Management Modal -->
    <WarehouseModal
      v-if="showWarehouseModal"
      :isOpen="showWarehouseModal"
      :warehouse="selectedWarehouseData"
      @close="closeWarehouseModal"
      @save="handleWarehouseSave"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { debounce } from 'lodash';

// Import inventory components
import AddItemModal from '@/components/inventory/AddItemModal.vue';
import TransferModal from '@/components/inventory/TransferModal.vue';
import DispatchModal from '@/components/inventory/DispatchModal.vue';
import InventoryTable from '@/components/inventory/InventoryTable.vue';
import UserModal from '@/components/users/UserModal.vue';
import AddUserModal from '@/components/users/AddUserModal.vue';

// Import Warehouse Modal
import WarehouseModal from '@/components/WarehouseModal.vue';

// Import services
import UserService from '@/services/UserService';

// Import constants from inventory service
import { WAREHOUSE_LABELS } from '@/services/inventoryService';

export default {
  name: 'Dashboard',
  components: {
    AddItemModal,
    TransferModal,
    DispatchModal,
    InventoryTable,
    UserModal,
    AddUserModal,
    WarehouseModal
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    
    const isDarkMode = ref(false);
    const showUserMenu = ref(false);
    const selectedWarehouse = ref('');
    const searchTerm = ref('');
    const loading = ref(true);
    
    // Modal states
    const showAddItemModal = ref(false);
    const showTransferModal = ref(false);
    const showDispatchModal = ref(false);
    const showUserModal = ref(false);
    const showAddUserModal = ref(false);
    const showWarehouseModal = ref(false);
    const selectedItemForAction = ref(null);
    const selectedUser = ref(null);
    const selectedWarehouseData = ref(null);

    // Users management state
    const users = ref([]);
    const loadingUsers = ref(false);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const searchUserTerm = ref('');

    // Navigation links based on user role
    const navigationLinks = [
      {
        path: '/',
        title: 'لوحة التحكم',
        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
        roles: ['superadmin', 'warehouse_manager', 'company_manager'],
        show: true
      },
      {
        path: '/warehouses',
        title: 'إدارة المخازن',
        icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
        roles: ['superadmin'],
        show: true
      },
      {
        path: '/users',
        title: 'إدارة المستخدمين',
        icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
        roles: ['superadmin'],
        show: true
      },
      {
        path: '/transactions',
        title: 'سجل الحركات',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
        roles: ['superadmin', 'warehouse_manager', 'company_manager'],
        show: true
      },
      {
        path: '/reports',
        title: 'التقارير',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        roles: ['superadmin', 'company_manager'],
        show: true
      }
    ];

    // Filter navigation links based on user role
    const filteredNavLinks = computed(() => {
      const userRole = store.getters.userRole;
      return navigationLinks.filter(link => {
        return link.roles.includes(userRole) && link.show;
      });
    });

    // Computed properties
    const userProfile = computed(() => store.state.userProfile);
    const userRole = computed(() => store.getters.userRole);
    const userName = computed(() => store.getters.userName);
    const dashboardStats = computed(() => store.getters.dashboardStats);
    const inventory = computed(() => store.state.inventory || []);
    
    // Permission getters
    const canModifyItems = computed(() => {
      const role = store.getters.userRole;
      const profile = store.state.userProfile;
      
      // Superadmin always has permission
      if (role === 'superadmin') return true;
      
      // Warehouse manager has permission if they have allowed warehouses
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
    
    const accessibleWarehouses = computed(() => {
      // Get warehouses from Vuex store
      const warehouses = store.state.warehouses || [];
      
      // If no warehouses in store, try to get from constants
      if (warehouses.length === 0) {
        console.warn('No warehouses found in store. Using fallback data.');
        return Object.keys(WAREHOUSE_LABELS).map(id => ({
          id: id,
          name_ar: WAREHOUSE_LABELS[id],
          name_en: id
        }));
      }
      
      return warehouses;
    });
    
    const notificationCount = computed(() => store.getters.dashboardStats?.lowStockItems || 0);

    // Filtered inventory based on search and warehouse selection
    const filteredInventory = computed(() => {
      let filtered = [...inventory.value];
      
      // Apply warehouse filter
      if (selectedWarehouse.value) {
        filtered = filtered.filter(item => 
          (item.warehouse_id || item.المخزن_id) === selectedWarehouse.value
        );
      }
      
      // Apply search filter
      if (searchTerm.value.trim()) {
        const term = searchTerm.value.toLowerCase().trim();
        filtered = filtered.filter(item => {
          const name = (item.name || item.الاسم || '').toLowerCase();
          const code = (item.code || item.الكود || '').toLowerCase();
          const color = (item.color || item.اللون || '').toLowerCase();
          const supplier = (item.supplier || item.المورد || '').toLowerCase();
          
          return name.includes(term) || 
                 code.includes(term) || 
                 color.includes(term) ||
                 supplier.includes(term);
        });
      }
      
      return filtered;
    });

    // Transform inventory data to match InventoryTable component structure
    const transformedInventory = computed(() => {
      return filteredInventory.value.map(item => ({
        id: item.id,
        name: item.name || item.الاسم || 'غير محدد',
        code: item.code || item.الكود || '-',
        color: item.color || item.اللون || '-',
        warehouse_id: item.warehouse_id || item.المخزن_id,
        supplier: item.supplier || item.المورد || '-',
        item_location: item.item_location || item.مكان_الصنف || '-',
        cartons_count: item.cartons_count || item.كراتين || 0,
        per_carton_count: item.per_carton_count || item.في_الكرتونة || 0,
        single_bottles_count: item.single_bottles_count || item.فردي || 0,
        total_added: item.total_added || item.المضاف || 0,
        remaining_quantity: item.remaining_quantity || item.الكميه_المتبقيه || 0,
        updated_at: item.updated_at || item.آخر_تحديث || new Date()
      }));
    });

    const allowedWarehousesText = computed(() => {
      if (userRole.value === 'superadmin') return 'جميع المخازن';
      if (userRole.value === 'company_manager') return 'جميع المخازن (قراءة فقط)';
      
      const warehouses = userProfile.value?.allowed_warehouses || [];
      if (warehouses.length === 0) return 'لا توجد مخازن محددة';
      
      return warehouses.map(id => {
        return WAREHOUSE_LABELS[id] || id;
      }).join('، ');
    });

    const roleBadgeClass = computed(() => {
      const classes = {
        superadmin: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
        warehouse_manager: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
        company_manager: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
      };
      return classes[userRole.value] || 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    });

    // User Management Functions
    const loadUsers = async (page = 1, search = '') => {
      if (!canManageUsers.value) return;
      
      loadingUsers.value = true;
      try {
        const params = {
          page,
          limit: 10
        };
        
        if (search) {
          params.search = search;
        }
        
        const response = await UserService.getUsers(params);
        users.value = response.data || [];
        currentPage.value = response.currentPage || page;
        totalPages.value = response.totalPages || 1;
      } catch (error) {
        console.error('Error loading users:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في تحميل المستخدمين'
        });
      } finally {
        loadingUsers.value = false;
      }
    };

    const openAddUserModal = () => {
      if (!canManageUsers.value) return;
      selectedUser.value = null;
      showAddUserModal.value = true;
    };

    const openEditUserModal = (user) => {
      if (!canManageUsers.value) return;
      selectedUser.value = user;
      showUserModal.value = true;
    };

    const closeUserModal = () => {
      showUserModal.value = false;
      selectedUser.value = null;
    };

    const handleUserSave = async (userData) => {
      try {
        loading.value = true;
        
        if (userData.id) {
          // Update existing user
          await UserService.updateUser(userData.id, userData);
          store.dispatch('showNotification', {
            type: 'success',
            message: 'تم تحديث المستخدم بنجاح'
          });
        } else {
          // Create new user
          await UserService.createUser(userData);
          store.dispatch('showNotification', {
            type: 'success',
            message: 'تم إضافة المستخدم بنجاح'
          });
        }
        
        // Refresh users list
        await loadUsers(currentPage.value, searchUserTerm.value);
        closeUserModal();
        
      } catch (error) {
        console.error('Error saving user:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في حفظ المستخدم'
        });
      } finally {
        loading.value = false;
      }
    };

    const handleUserAdded = () => {
      showAddUserModal.value = false;
      // Refresh users list if on users page
      if (route.path === '/users') {
        loadUsers(currentPage.value, searchUserTerm.value);
      }
      store.dispatch('showNotification', {
        type: 'success',
        message: 'تم إضافة المستخدم بنجاح'
      });
    };

    const handleDeleteUser = async (userId) => {
      if (!canManageUsers.value) return;
      
      if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
        return;
      }
      
      try {
        await UserService.deleteUser(userId);
        store.dispatch('showNotification', {
          type: 'success',
          message: 'تم حذف المستخدم بنجاح'
        });
        
        // Refresh users list
        await loadUsers(currentPage.value, searchUserTerm.value);
      } catch (error) {
        console.error('Error deleting user:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في حذف المستخدم'
        });
      }
    };

    const handleToggleUserStatus = async (userId, isActive) => {
      if (!canManageUsers.value) return;
      
      try {
        await UserService.updateUserStatus(userId, isActive);
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم ${isActive ? 'تفعيل' : 'تعطيل'} المستخدم بنجاح`
        });
        
        // Refresh users list
        await loadUsers(currentPage.value, searchUserTerm.value);
      } catch (error) {
        console.error('Error updating user status:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في تحديث حالة المستخدم'
        });
      }
    };

    // Warehouse Management Functions
    const openAddWarehouseModal = () => {
      if (!canManageWarehouses.value) return;
      selectedWarehouseData.value = null;
      showWarehouseModal.value = true;
    };

    const openEditWarehouseModal = (warehouse) => {
      if (!canManageWarehouses.value) return;
      selectedWarehouseData.value = warehouse;
      showWarehouseModal.value = true;
    };

    const closeWarehouseModal = () => {
      showWarehouseModal.value = false;
      selectedWarehouseData.value = null;
    };

    const handleWarehouseSave = async (warehouseData) => {
      try {
        // Refresh warehouses list
        await store.dispatch('loadWarehouses');
        
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم ${warehouseData.id ? 'تحديث' : 'إضافة'} المخزن "${warehouseData.name_ar}" بنجاح`
        });
        
        closeWarehouseModal();
        
      } catch (error) {
        console.error('Error saving warehouse:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في حفظ المخزن'
        });
      }
    };

    // Helper functions
    const getRoleName = (role) => {
      const names = {
        superadmin: 'المشرف العام',
        warehouse_manager: 'مدير المخازن',
        company_manager: 'مدير الشركة'
      };
      return names[role] || role;
    };

    const getRoleDescription = (role) => {
      const descriptions = {
        superadmin: 'المشرف العام - صلاحيات كاملة',
        warehouse_manager: 'مدير المخازن - إدارة المخزون',
        company_manager: 'مدير الشركة - عرض التقارير'
      };
      return descriptions[role] || 'مستخدم عادي';
    };

    const getUserInitials = (name) => {
      if (!name) return '?';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const formatNumber = (num) => {
      return new Intl.NumberFormat('ar-EG').format(num);
    };

    const getWarehouseLabel = (warehouseId) => {
      return WAREHOUSE_LABELS[warehouseId] || warehouseId;
    };

    // Warehouse selection
    const selectWarehouse = (warehouseId) => {
      selectedWarehouse.value = warehouseId;
    };

    // Search handler with debounce
    const handleSearch = debounce(() => {
      // Search is handled in computed property
    }, 300);

    const handleWarehouseChange = () => {
      // Warehouse change is handled in computed property
    };

    // Modal handlers
    const openAddItemModal = () => {
      if (!canModifyItems.value) {
        alert('ليس لديك صلاحية لإضافة أصناف. يرجى التواصل مع المشرف العام.');
        return;
      }
      showAddItemModal.value = true;
    };

    const openTransferModal = () => {
      if (!canModifyItems.value) {
        alert('ليس لديك صلاحية لنقل الأصناف. يرجى التواصل مع المشرف العام.');
        return;
      }
      showTransferModal.value = true;
    };

    const openDispatchModal = () => {
      if (!canModifyItems.value) {
        alert('ليس لديك صلاحية لصرف الأصناف. يرجى التواصل مع المشرف العام.');
        return;
      }
      showDispatchModal.value = true;
    };

    const openTransferModalForItem = (item) => {
      selectedItemForAction.value = item;
      showTransferModal.value = true;
    };

    const openDispatchModalForItem = (item) => {
      selectedItemForAction.value = item;
      showDispatchModal.value = true;
    };

    const handleItemAdded = () => {
      showAddItemModal.value = false;
      // Inventory will update automatically via subscription
    };

    const handleTransferSuccess = () => {
      showTransferModal.value = false;
      selectedItemForAction.value = null;
      // Inventory will update automatically via subscription
    };

    const handleDispatchSuccess = () => {
      showDispatchModal.value = false;
      selectedItemForAction.value = null;
      // Inventory will update automatically via subscription
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

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value;
    };

    const showNotifications = () => {
      // Navigate to low stock items or show notification panel
      console.log('Showing notifications...');
    };

    const logout = async () => {
      try {
        await store.dispatch('logout');
        router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      // Load warehouses
      store.dispatch('loadWarehouses');
      
      // Check for saved theme preference
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDarkMode.value = true;
        document.documentElement.classList.add('dark');
      }
      
      // Set default warehouse if accessible warehouses exist
      if (accessibleWarehouses.value.length > 0) {
        const mainWarehouse = store.getters.mainWarehouse;
        selectedWarehouse.value = mainWarehouse?.id || accessibleWarehouses.value[0].id;
      }
      
      // Subscribe to real-time data
      console.log('Starting inventory subscription...');
      store.dispatch('subscribeToInventory');
      store.dispatch('subscribeToTransactions');
      
      // Set loading to false after a short delay (data will load via subscription)
      setTimeout(() => {
        loading.value = false;
      }, 1000);
    });

    // Watch for route changes
    watch(() => route.path, () => {
      showUserMenu.value = false;
    });

    // Watch for inventory changes to stop loading
    watch(() => inventory.value, () => {
      if (loading.value && inventory.value.length > 0) {
        loading.value = false;
      }
    }, { immediate: true });

    // Listen for add item modal event from App.vue
    window.addEventListener('open-add-item-modal', () => {
      openAddItemModal();
    });

    // Listen for add warehouse modal event
    window.addEventListener('open-add-warehouse-modal', () => {
      if (canManageWarehouses.value) {
        openAddWarehouseModal();
      }
    });

    onUnmounted(() => {
      window.removeEventListener('open-add-item-modal', () => {});
      window.removeEventListener('open-add-warehouse-modal', () => {});
    });

    return {
      isDarkMode,
      showUserMenu,
      selectedWarehouse,
      searchTerm,
      loading,
      notificationCount,
      showAddItemModal,
      showTransferModal,
      showDispatchModal,
      showUserModal,
      showAddUserModal,
      showWarehouseModal,
      selectedItemForAction,
      selectedUser,
      selectedWarehouseData,
      users,
      loadingUsers,
      currentPage,
      totalPages,
      searchUserTerm,
      filteredNavLinks,
      userProfile,
      userRole,
      userName,
      dashboardStats,
      inventory,
      filteredInventory,
      transformedInventory,
      canModifyItems,
      canManageUsers,
      canManageWarehouses,
      canViewReports,
      accessibleWarehouses,
      allowedWarehousesText,
      roleBadgeClass,
      getRoleName,
      getRoleDescription,
      getUserInitials,
      formatNumber,
      getWarehouseLabel,
      loadUsers,
      openAddUserModal,
      openEditUserModal,
      closeUserModal,
      handleUserSave,
      handleUserAdded,
      handleDeleteUser,
      handleToggleUserStatus,
      openAddWarehouseModal,
      openEditWarehouseModal,
      closeWarehouseModal,
      handleWarehouseSave,
      selectWarehouse,
      handleSearch,
      handleWarehouseChange,
      openAddItemModal,
      openTransferModal,
      openDispatchModal,
      openTransferModalForItem,
      openDispatchModalForItem,
      handleItemAdded,
      handleTransferSuccess,
      handleDispatchSuccess,
      toggleDarkMode,
      toggleUserMenu,
      showNotifications,
      logout
    };
  }
};
</script>

<style scoped>
/* Custom scrollbar for dark mode */
.dark ::-webkit-scrollbar {
  width: 10px;
}

.dark ::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 5px;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Sidebar scrollbar */
aside ::-webkit-scrollbar {
  width: 6px;
}

aside ::-webkit-scrollbar-track {
  background: transparent;
}

aside ::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.dark aside ::-webkit-scrollbar-thumb {
  background: #4b5563;
}

/* Smooth transitions */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

/* Fix for RTL direction */
.rtl {
  direction: rtl;
}

/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Loading spinner */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Ensure proper scrolling on mobile */
@media (max-width: 1023px) {
  .pb-16 {
    padding-bottom: 70px;
  }
}
</style>
   
       
      
      
         
        
    
      

    
       
    

    
      
      
      

 
