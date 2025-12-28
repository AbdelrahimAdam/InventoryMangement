<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Main content -->
    <div class="max-w-full mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-6">
      <!-- Page Header - Mobile Optimized -->
      <div class="mb-4 sm:mb-6">
        <div class="flex flex-col gap-3 sm:gap-4">
          <!-- Top row: Title and User Info -->
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate max-w-[180px] sm:max-w-none">
                المخزون
              </h1>
              <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 hidden sm:block">
                إدارة وتتبع جميع الأصناف في النظام
              </p>
            </div>
            
            <!-- User and Warehouse Info - Mobile Optimized -->
            <div class="flex flex-col items-end gap-1">
              <!-- Current User -->
              <div class="flex items-center gap-1">
                <svg class="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span class="text-xs text-gray-700 dark:text-gray-300 truncate max-w-[100px] sm:max-w-none">
                  {{ currentUserInfo }}
                </span>
              </div>
              
              <!-- Warehouse Info -->
              <div v-if="selectedWarehouse" class="flex items-center gap-1">
                <svg class="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                <span class="text-xs text-gray-700 dark:text-gray-300 truncate max-w-[100px] sm:max-w-none">
                  {{ getWarehouseLabel(selectedWarehouse) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Performance Indicator -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500 dark:text-gray-400">
                <span v-if="isDataFresh" class="flex items-center gap-1">
                  <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  مباشر
                </span>
                <span v-else class="flex items-center gap-1">
                  <span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  مخزن
                </span>
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400 hidden xs:inline">
                {{ filteredItems.length }} عنصر • {{ formatTime(lastUpdate) }}
              </span>
            </div>
            
            <!-- Mobile Description -->
            <p class="text-xs text-gray-600 dark:text-gray-400 block sm:hidden">
              إدارة المخزون
            </p>
          </div>
        </div>
      </div>

      <!-- Action Buttons - Mobile Optimized -->
      <div class="mb-4 sm:mb-6">
        <div class="flex flex-wrap gap-2 sm:gap-3">
          <!-- Export to Excel Button -->
          <button
            v-if="filteredItems.length > 0"
            @click="exportToExcel"
            :disabled="exporting"
            class="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex-1 sm:flex-none min-w-0"
          >
            <svg v-if="!exporting" class="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <svg v-else class="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 animate-spin flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span class="truncate text-xs sm:text-sm">{{ exporting ? 'جاري التصدير...' : 'تصدير' }}</span>
          </button>

          <!-- Refresh Button -->
          <button
            @click="refreshData"
            :disabled="refreshing"
            class="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex-1 sm:flex-none min-w-0"
          >
            <svg v-if="refreshing" class="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 animate-spin flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <svg v-else class="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span class="truncate text-xs sm:text-sm">{{ refreshing ? 'جاري التحديث...' : 'تحديث' }}</span>
          </button>

          <!-- Load More Button -->
          <button
            v-if="hasMore && !loading && !useSmartSearch && filteredItems.length > 0"
            @click="loadMoreItems"
            :disabled="loadingMore"
            class="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex-1 sm:flex-none min-w-0"
          >
            <svg v-if="loadingMore" class="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 animate-spin flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <svg v-else class="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span class="truncate text-xs sm:text-sm">{{ loadingMore ? 'جاري التحميل...' : 'تحميل المزيد' }}</span>
          </button>

          <!-- Add Item Button -->
          <button 
            v-if="canAddItem && showActions && !readonly"
            @click="showAddModal = true"
            class="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-colors duration-200 text-sm sm:text-base flex-1 sm:flex-none min-w-0"
          >
            <svg class="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span class="truncate text-xs sm:text-sm">إضافة صنف</span>
          </button>
        </div>
      </div>

      <!-- Stats Cards - Mobile Optimized -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2 sm:p-4 hover:shadow-md transition-shadow duration-200 cursor-default">
          <div class="flex items-center">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center ml-2 sm:ml-3 flex-shrink-0">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div class="flex-1 text-right mr-1 sm:mr-2">
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">الأصناف</p>
              <p class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{{ formatNumber(filteredItems.length) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2 sm:p-4 hover:shadow-md transition-shadow duration-200 cursor-default">
          <div class="flex items-center">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center ml-2 sm:ml-3 flex-shrink-0">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1 text-right mr-1 sm:mr-2">
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">الإجمالي</p>
              <p class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{{ formatNumber(totalQuantity) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2 sm:p-4 hover:shadow-md transition-shadow duration-200 cursor-default">
          <div class="flex items-center">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center ml-2 sm:ml-3 flex-shrink-0">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1 text-right mr-1 sm:mr-2">
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">قليلة</p>
              <p class="text-base sm:text-lg font-bold text-red-600 dark:text-red-400">{{ formatNumber(lowStockCount) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2 sm:p-4 hover:shadow-md transition-shadow duration-200 cursor-default">
          <div class="flex items-center">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center ml-2 sm:ml-3 flex-shrink-0">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div class="flex-1 text-right mr-1 sm:mr-2">
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">المخازن</p>
              <p class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{{ formatNumber(warehouseCount) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- FILTERS AND SEARCH SECTION - COLLAPSIBLE ON MOBILE -->
      <div class="mb-4 sm:mb-6">
        <!-- Collapsible Header for Mobile -->
        <div class="lg:hidden mb-3">
          <button 
            @click="showFilters = !showFilters"
            class="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
              <span class="font-medium text-gray-700 dark:text-gray-300">
                الفلاتر والبحث
              </span>
              <span v-if="hasActiveFilters" class="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-yellow-500 text-white rounded-full">
                {{ activeFilterCount }}
              </span>
            </div>
            <svg class="w-5 h-5 text-gray-500 transition-transform duration-200" :class="{'rotate-180': showFilters}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>

        <!-- Filters and Search Content - Collapsible on Mobile, Always visible on Desktop -->
        <div :class="{'hidden lg:block': !showFilters, 'block': showFilters}" class="space-y-4">
          <!-- Main Filters Card -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
              <!-- Warehouse Filter -->
              <div v-if="accessibleWarehouses.length > 0" class="order-1">
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المخزن</label>
                <select
                  v-model="selectedWarehouse"
                  @change="handleWarehouseChange"
                  class="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 hover:border-yellow-400 transition-colors duration-200"
                >
                  <option value="">جميع المخازن</option>
                  <option v-for="warehouse in accessibleWarehouses" :key="warehouse.id" :value="warehouse.id">
                    {{ warehouse.name_ar }}
                  </option>
                </select>
              </div>

              <!-- Status Filter -->
              <div class="order-2">
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الحالة</label>
                <select
                  v-model="statusFilter"
                  @change="handleFilterChange"
                  class="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 hover:border-yellow-400 transition-colors duration-200"
                >
                  <option value="">الكل</option>
                  <option value="in_stock">متوفر</option>
                  <option value="low_stock">قليل</option>
                  <option value="out_of_stock">نفذ</option>
                </select>
              </div>

              <!-- Search Input -->
              <div class="md:col-span-2 order-3 md:order-3">
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">بحث سريع</label>
                <div class="relative">
                  <input
                    type="text"
                    v-model="searchTerm"
                    @input="handleSmartSearch"
                    placeholder="ابحث بأي حقل - اكتب 3 أحرف على الأقل..."
                    class="w-full px-3 py-2 pr-8 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 hover:border-yellow-400 transition-colors duration-200"
                  />
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </div>
                  <!-- Clear Search Button -->
                  <button 
                    v-if="searchTerm"
                    @click="searchTerm = ''; resetToNormalView()"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Active Filters -->
            <div v-if="hasActiveFilters" class="mt-3 sm:mt-4 flex flex-wrap gap-1 sm:gap-2">
              <span v-if="selectedWarehouse" 
                    class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                <span class="hidden xs:inline">المخزن:</span>
                <span class="font-medium truncate max-w-[80px]">{{ getWarehouseLabel(selectedWarehouse) }}</span>
                <button @click="selectedWarehouse = ''" class="text-blue-600 hover:text-blue-800">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </span>
              <span v-if="statusFilter" 
                    class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                <span class="hidden xs:inline">الحالة:</span>
                <span class="font-medium">{{ getStatusLabel(statusFilter) }}</span>
                <button @click="statusFilter = ''" class="text-green-600 hover:text-green-800">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </span>
              <span v-if="searchTerm" 
                    class="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded-full">
                <span class="hidden xs:inline">البحث:</span>
                <span class="font-medium truncate max-w-[60px]">{{ searchTerm }}</span>
                <button @click="searchTerm = ''" class="text-yellow-600 hover:text-yellow-800">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </span>
              <button 
                v-if="hasActiveFilters" 
                @click="clearAllFilters"
                class="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 underline"
              >
                مسح الكل
              </button>
            </div>
          </div>

          <!-- Search Mode Indicator -->
          <div v-if="useSmartSearch" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 p-3 sm:p-4 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <span class="text-sm">نتائج البحث الذكي: {{ smartSearchResults.length }}</span>
              </div>
              <button 
                @click="resetToNormalView"
                class="text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors duration-200"
              >
                عودة للعرض العادي
              </button>
            </div>
          </div>

          <!-- Export Progress -->
          <div v-if="exporting" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 p-3 sm:p-4 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <span class="text-sm">جاري تجهير Excel...</span>
              </div>
              <span class="text-xs">{{ exportProgress }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !filteredItems.length" class="text-center py-8 sm:py-12">
        <div class="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-yellow-600 mb-3 sm:mb-4"></div>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">جاري تحميل المخزون...</p>
        <p v-if="totalLoaded > 0" class="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">تم تحميل {{ totalLoaded }} عنصر</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-sm">{{ error }}</span>
          </div>
          <button @click="error = ''" class="text-red-600 hover:text-red-800">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Inventory Table Container - FIXED -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Desktop Table with Virtual Scrolling - FIXED LAYOUT -->
        <div class="hidden lg:block">
          <div 
            class="overflow-x-auto overflow-y-auto relative virtual-scroll-container" 
            :style="{ maxHeight: 'calc(100vh - 400px)' }"
            @scroll="onScroll"
            ref="scrollContainer"
          >
            <table class="w-full table-fixed">
              <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0 z-20">
                <tr>
                  <th class="w-20 px-3 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500">
                    الصورة
                  </th>
                  <th class="w-48 px-3 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500">
                    <div class="flex flex-col items-center justify-center">
                      <span class="truncate">الاسم والكود</span>
                      <span class="text-xs text-gray-500 dark:text-gray-300 font-normal">(انقر للتفاصيل)</span>
                    </div>
                  </th>
                  <th class="w-32 px-3 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500">
                    اللون
                  </th>
                  <th class="w-40 px-3 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500">
                    المخزن
                  </th>
                  <th class="w-40 px-3 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500">
                    المورد
                  </th>
                  <th class="w-48 px-3 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500">
                    <div class="flex flex-col items-center justify-center">
                      <span class="truncate">الكميات</span>
                      <span class="text-xs text-gray-500 dark:text-gray-300 font-normal">كراتين/في الكرتونة/فردي</span>
                    </div>
                  </th>
                  <th class="w-40 px-3 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500">
                    <div class="flex flex-col items-center justify-center">
                      <span class="truncate">المتبقي</span>
                      <span class="text-xs text-gray-500 dark:text-gray-300 font-normal">من المجموع</span>
                    </div>
                  </th>
                  <th class="w-32 px-3 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500">
                    الحالة
                  </th>
                  <th v-if="showActions && !readonly && userRole !== 'viewer'" 
                      class="w-40 px-3 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500">
                    الإجراءات
                  </th>
                  <th v-else 
                      class="w-40 px-3 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500">
                    آخر تحديث
                  </th>
                </tr>
              </thead>
              <tbody :style="{ height: `${filteredItems.length * 80}px`, position: 'relative' }">
                <!-- Virtual Scrolling - Only render visible rows -->
                <tr 
                  v-for="item in visibleItems" 
                  :key="item.id"
                  class="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 absolute left-0 right-0"
                  :style="{ 
                    height: '80px',
                    top: `${item.virtualIndex * 80}px`
                  }"
                >
                  <!-- Photo -->
                  <td class="w-20 px-3 py-3 text-center align-middle">
                    <div class="flex justify-center">
                      <div class="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 cursor-pointer hover:scale-105 transition-transform duration-200"
                        @click="showItemDetails(item)">
                        <img 
                          :src="item.photo_url || getPlaceholderImage()" 
                          :alt="item.name"
                          class="w-full h-full object-cover"
                          @error="handleImageError"
                          loading="lazy"
                        >
                        <div v-if="item.photo_url" class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
                      </div>
                    </div>
                  </td>

                  <!-- Name and Code -->
                  <td class="w-48 px-3 py-3 text-center align-middle">
                    <div class="flex flex-col items-center justify-center space-y-1 max-w-full overflow-hidden">
                      <div class="text-sm font-semibold text-gray-900 dark:text-white truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 w-full"
                        @click="showItemDetails(item)">
                        {{ item.name }}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        <span class="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded truncate inline-block max-w-full">
                          {{ item.code }}
                        </span>
                      </div>
                      <div v-if="item.item_location" class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 w-full justify-center">
                        <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        </svg>
                        <span class="truncate max-w-[180px]">{{ item.item_location }}</span>
                      </div>
                    </div>
                  </td>

                  <!-- Color -->
                  <td class="w-32 px-3 py-3 text-center align-middle">
                    <div class="flex items-center justify-center w-full">
                      <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-700 max-w-full">
                        <div v-if="item.color" class="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                          :style="{ backgroundColor: getColorHex(item.color) }"></div>
                        <span class="text-sm text-gray-900 dark:text-white truncate max-w-[80px]">
                          {{ item.color || '-' }}
                        </span>
                      </div>
                    </div>
                  </td>

                  <!-- Warehouse -->
                  <td class="w-40 px-3 py-3 text-center align-middle">
                    <span class="text-sm text-gray-900 dark:text-white px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-700 inline-block truncate max-w-full">
                      {{ getWarehouseLabel(item.warehouse_id) }}
                    </span>
                  </td>

                  <!-- Supplier -->
                  <td class="w-40 px-3 py-3 text-center align-middle">
                    <span class="text-sm text-gray-900 dark:text-white truncate max-w-full px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-700 inline-block">
                      {{ item.supplier || '-' }}
                    </span>
                  </td>

                  <!-- Quantities -->
                  <td class="w-48 px-3 py-3 text-center align-middle">
                    <div class="text-sm space-y-1 w-full px-2">
                      <div class="flex items-center justify-between px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-700 w-full">
                        <span class="text-gray-500 dark:text-gray-400 text-xs truncate">كراتين:</span>
                        <span class="text-gray-900 dark:text-white font-medium truncate ml-2">{{ item.cartons_count || 0 }}</span>
                      </div>
                      <div class="flex items-center justify-between px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-700 w-full">
                        <span class="text-gray-500 dark:text-gray-400 text-xs truncate">في الكرتونة:</span>
                        <span class="text-gray-900 dark:text-white font-medium truncate ml-2">{{ item.per_carton_count || 0 }}</span>
                      </div>
                      <div class="flex items-center justify-between px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-700 w-full">
                        <span class="text-gray-500 dark:text-gray-400 text-xs truncate">فردي:</span>
                        <span class="text-gray-900 dark:text-white font-medium truncate ml-2">{{ item.single_bottles_count || 0 }}</span>
                      </div>
                    </div>
                  </td>

                  <!-- Remaining Quantity -->
                  <td class="w-40 px-3 py-3 text-center align-middle">
                    <div :class="getQuantityClass(item.remaining_quantity)" 
                         class="text-lg font-bold px-4 py-2.5 rounded-full inline-flex flex-col items-center justify-center gap-1 min-w-[120px] max-w-full">
                      <span class="truncate w-full">{{ item.remaining_quantity }}</span>
                      <div class="text-xs text-gray-500 dark:text-gray-300 truncate w-full">
                        من {{ item.total_added }}
                      </div>
                    </div>
                  </td>

                  <!-- Status -->
                  <td class="w-32 px-3 py-3 text-center align-middle">
                    <span :class="getStockStatusClass(item.remaining_quantity)" 
                          class="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-bold shadow-sm min-w-[90px] max-w-full truncate">
                      {{ getStockStatus(item.remaining_quantity) }}
                    </span>
                  </td>

                  <!-- Actions or Updated Date -->
                  <td class="w-40 px-3 py-3 text-center align-middle">
                    <div v-if="showActions && !readonly && userRole !== 'viewer'" class="flex items-center justify-center gap-2 w-full">
                      <!-- View Details Button -->
                      <button
                        @click="showItemDetails(item)"
                        class="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/20 hover:scale-110 transition-all duration-200 flex-shrink-0"
                        title="عرض التفاصيل"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </button>

                      <!-- More Actions Dropdown -->
                      <div class="relative">
                        <button
                          @click="toggleActionMenu(item.id)"
                          class="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-150 flex-shrink-0"
                          title="المزيد من الإجراءات"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                          </svg>
                        </button>

                        <!-- Action Dropdown Menu -->
                        <div v-if="showActionMenu === item.id" 
                          class="absolute left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-30"
                          v-click-outside="() => showActionMenu = null">

                          <!-- Edit Option -->
                          <button
                            v-if="canEditItem(item)"
                            @click="handleEdit(item)"
                            class="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-150"
                          >
                            <svg class="w-4 h-4 ml-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            تعديل الصنف
                          </button>

                          <!-- Transfer Option -->
                          <button
                            v-if="canTransferItem(item)"
                            @click="handleTransfer(item)"
                            class="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-150"
                          >
                            <svg class="w-4 h-4 ml-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                            </svg>
                            نقل بين المخازن
                          </button>

                          <!-- Dispatch Option -->
                          <button
                            v-if="canDispatchItem(item)"
                            @click="handleDispatch(item)"
                            class="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-150"
                          >
                            <svg class="w-4 h-4 ml-2 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                            </svg>
                            صرف إلى خارجي
                          </button>

                          <!-- Divider -->
                          <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                          <!-- Delete Option -->
                          <button
                            v-if="canDeleteItem(item)"
                            @click="handleDelete(item)"
                            class="w-full flex items-center px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                          >
                            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            حذف الصنف
                          </button>
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-center w-full">
                      <span class="text-sm text-gray-500 dark:text-gray-300 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-700 truncate inline-block max-w-full">
                        {{ formatDate(item.updated_at) }}
                      </span>
                    </div>
                  </td>
                </tr>

                <!-- Empty State -->
                <tr v-if="visibleItems.length === 0 && !loading" 
                    class="absolute inset-0">
                  <td :colspan="showActions && !readonly && userRole !== 'viewer' ? 9 : 8" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div class="flex flex-col items-center justify-center h-full">
                      <svg class="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
                      </svg>
                      <h3 class="text-lg font-medium mb-2">لا توجد أصناف</h3>
                      <p class="text-sm">{{ searchTerm ? 'لم يتم العثور على أصناف مطابقة للبحث' : 'لم يتم إضافة أي أصناف بعد.' }}</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Loading More Indicator -->
          <div v-if="loadingMore" class="p-4 text-center text-blue-600 dark:text-blue-400 border-t border-gray-200 dark:border-gray-700">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p class="text-sm">جاري تحميل المزيد من العناصر...</p>
          </div>

          <!-- End of List Indicator -->
          <div v-if="!hasMore && filteredItems.length > 0 && !useSmartSearch" class="p-4 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
            <p class="text-sm">تم عرض جميع العناصر ({{ filteredItems.length }} عنصر)</p>
          </div>
        </div>

        <!-- Mobile Cards with Virtual Scrolling -->
        <div class="lg:hidden">
          <div 
            class="overflow-y-auto virtual-scroll-container"
            :style="{ maxHeight: 'calc(100vh - 320px)', height: `${filteredItems.length * 120}px` }"
            @scroll="onMobileScroll"
            ref="mobileScrollContainer"
          >
            <div v-if="mobileVisibleItems.length === 0 && !loading" class="p-6 text-center text-gray-500 dark:text-gray-400">
              <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
              </svg>
              <h3 class="text-lg font-medium mb-2">لا توجد أصناف</h3>
              <p class="text-sm">{{ searchTerm ? 'لم يتم العثور على أصناف مطابقة للبحث' : 'لم يتم إضافة أي أصناف بعد.' }}</p>
            </div>

            <div v-else class="relative" :style="{ height: `${filteredItems.length * 120}px` }">
              <!-- Virtual Scrolling for Mobile - Only render visible items -->
              <div 
                v-for="item in mobileVisibleItems" 
                :key="item.id"
                class="absolute left-0 right-0 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 active:bg-gray-100 dark:active:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
                :style="{ 
                  height: '120px',
                  top: `${item.virtualIndex * 120}px`
                }"
                @click="showItemDetails(item)"
              >
                <!-- Main Row -->
                <div class="flex gap-3 h-full">
                  <!-- Photo -->
                  <div class="flex-shrink-0">
                    <div class="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                      <img 
                        :src="item.photo_url || getPlaceholderImage()" 
                        :alt="item.name"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                        loading="lazy"
                      >
                    </div>
                  </div>

                  <!-- Item Details -->
                  <div class="flex-1 min-w-0">
                    <!-- First Row: Name and Quantity -->
                    <div class="flex justify-between items-start mb-1">
                      <div class="min-w-0">
                        <h3 class="text-sm font-bold text-gray-900 dark:text-white truncate mb-1">
                          {{ item.name }}
                        </h3>
                        <div class="flex items-center gap-1">
                          <span class="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded">
                            {{ item.code }}
                          </span>
                          <span :class="getStockStatusClass(item.remaining_quantity)" 
                                class="text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                            {{ getStockStatus(item.remaining_quantity) }}
                          </span>
                        </div>
                      </div>
                      <div :class="getQuantityClass(item.remaining_quantity)" 
                           class="text-lg font-bold px-3 py-1.5 rounded-lg">
                        {{ item.remaining_quantity }}
                      </div>
                    </div>

                    <!-- Second Row: Warehouse and Color -->
                    <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 mb-2">
                      <div class="flex items-center gap-1">
                        <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        </svg>
                        <span class="truncate max-w-[100px]">
                          {{ getWarehouseLabel(item.warehouse_id) }}
                        </span>
                      </div>
                      <div v-if="item.color" class="flex items-center gap-1">
                        <div class="w-3 h-3 rounded-full border border-gray-300"
                          :style="{ backgroundColor: getColorHex(item.color) }"></div>
                        <span class="truncate max-w-[60px]">{{ item.color }}</span>
                      </div>
                    </div>

                    <!-- Third Row: Supplier and Location -->
                    <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                      <div v-if="item.supplier" class="flex items-center gap-1 truncate max-w-[120px]">
                        <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                        <span class="truncate">{{ item.supplier }}</span>
                      </div>
                      <div v-if="item.item_location" class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        </svg>
                        <span class="truncate max-w-[80px]">{{ item.item_location }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Quick Actions Bar -->
                <div v-if="showActions && !readonly && userRole !== 'viewer'" 
                     class="mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between">
                  <!-- Last Updated -->
                  <div class="text-xs text-gray-500 dark:text-gray-300 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>{{ formatRelativeTime(item.updated_at) }}</span>
                  </div>
                  
                  <!-- Quick Action Buttons -->
                  <div class="flex items-center gap-1">
                    <button 
                      v-if="canEditItem(item)"
                      @click.stop="handleEdit(item)"
                      class="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/20 transition-colors"
                      title="تعديل"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    
                    <button 
                      v-if="canTransferItem(item)"
                      @click.stop="handleTransfer(item)"
                      class="p-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/20 transition-colors"
                      title="نقل"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                      </svg>
                    </button>
                    
                    <button 
                      v-if="canDeleteItem(item)"
                      @click.stop="handleDelete(item)"
                      class="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-800/20 transition-colors"
                      title="حذف"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Load More Button for Mobile -->
            <div v-if="hasMore && !loadingMore && !useSmartSearch && mobileVisibleItems.length > 0" class="p-4 text-center">
              <button
                @click="loadMoreItems"
                :disabled="loading || loadingMore"
                class="w-full px-4 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                تحميل المزيد من العناصر
              </button>
            </div>

            <!-- Loading More Indicator for Mobile -->
            <div v-if="loadingMore" class="p-4 text-center text-blue-600 dark:text-blue-400 border-t border-gray-200 dark:border-gray-700">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p class="text-sm">جاري تحميل المزيد...</p>
            </div>

            <!-- End of List for Mobile -->
            <div v-if="!hasMore && filteredItems.length > 0 && !useSmartSearch && mobileVisibleItems.length > 0" class="p-4 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
              <p class="text-sm">تم عرض جميع العناصر</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Button for Mobile -->
    <button 
      v-if="canAddItem && showActions && !readonly"
      @click="showAddModal = true"
      class="fixed bottom-6 left-6 z-40 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-purple-600 hover:scale-110 active:scale-95 transition-all duration-200 lg:hidden"
      title="إضافة صنف"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
      </svg>
    </button>

    <!-- Modals -->
    <AddItemModal 
      v-if="showAddModal"
      :isOpen="showAddModal"
      @close="showAddModal = false"
      @success="handleItemSaved"
    />

    <DispatchModal 
      v-if="showDispatchModal"
      :isOpen="showDispatchModal"
      :item="selectedItemForDispatch"
      @close="showDispatchModal = false"
      @success="handleDispatchSuccess"
    />

    <EditItemModal 
      v-if="showEditModal"
      :isOpen="showEditModal"
      :item="selectedItemForEdit"
      @close="showEditModal = false"
      @success="handleItemUpdated"
    />

    <TransferModal 
      v-if="showTransferModal"
      :isOpen="showTransferModal"
      :item="selectedItemForTransfer"
      @close="showTransferModal = false"
      @success="handleTransferSuccess"
    />

    <!-- Item Details Modal -->
    <ItemDetailsModal
      v-if="showDetailsModal"
      :isOpen="showDetailsModal"
      :item="selectedItem"
      @close="closeDetailsModal"
      @edit="handleEdit"
      @transfer="handleTransfer"
      @dispatch="handleDispatch"
      @delete="handleDelete"
      :canEditItem="canEditItem"
      :canTransferItem="canTransferItem"
      :canDispatchItem="canDispatchItem"
      :canDeleteItem="canDeleteItem"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmDeleteModal
      v-if="showDeleteConfirm"
      :isOpen="showDeleteConfirm"
      :item="itemToDelete"
      :loading="deleteLoading"
      @confirm="confirmDelete"
      @close="showDeleteConfirm = false"
      :warehouseLabel="getWarehouseLabel"
      :getLastActionUser="getLastActionUser"
    />
  </div>
</template>

<!-- باقي الكود كما هو دون تغيير -->
<script>
// ... كل كود JavaScript يبقى كما هو بدون تغييرات ...
</script>

<style scoped>
/* Enhanced performance optimized styles */
table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  table-layout: fixed; /* FIX: استخدام تخطيط ثابت */
}

/* Static header styling with backdrop blur */
thead {
  position: sticky;
  top: 0;
  z-index: 20;
  background-color: #f9fafb;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.dark thead {
  background-color: rgba(31, 41, 55, 0.95);
}

/* FIX: إصلاح محاذاة الجدول */
th, td {
  text-align: center;
  vertical-align: middle;
  padding: 12px 8px; /* FIX: تباعد أفضل */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* FIX: عرض أعمدة محدد */
.w-20 { width: 80px; min-width: 80px; max-width: 80px; }
.w-32 { width: 128px; min-width: 128px; max-width: 128px; }
.w-40 { width: 160px; min-width: 160px; max-width: 160px; }
.w-48 { width: 192px; min-width: 192px; max-width: 192px; }

/* FIX: تحسين تباين الألوان في الوضع الداكن */
.dark .text-gray-400,
.dark .text-gray-500 {
  color: #9ca3af; /* FIX: لون أكثر وضوحاً في الوضع الداكن */
}

.dark .text-gray-300 {
  color: #d1d5db; /* FIX: لون أكثر وضوحاً */
}

/* Virtual scrolling optimization */
.virtual-scroll-container {
  will-change: transform;
  contain: strict;
  content-visibility: auto;
}

/* Enhanced transitions */
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Optimized hover states */
.hover\:bg-gray-50:hover {
  background-color: rgba(249, 250, 251, 0.9);
}

.dark .hover\:bg-gray-700\/50:hover {
  background-color: rgba(55, 65, 81, 0.5);
}

/* Enhanced scrollbar optimization */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #94a3b8 #f1f5f9;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

.overflow-x-auto::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

.dark .overflow-x-auto::-webkit-scrollbar-track {
  background: #1e293b;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb {
  background: #475569;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Image optimization */
img {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  content-visibility: auto;
  loading: lazy;
}

/* Mobile touch targets optimization */
@media (max-width: 768px) {
  button {
    min-height: 44px;
    min-width: 44px;
  }
  
  input, select, textarea {
    font-size: 16px;
  }
  
  /* Virtual scrolling optimization for mobile */
  .lg\:hidden > div {
    will-change: transform;
  }
  
  /* Better virtual scrolling performance */
  .virtual-scroll-container {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }
  
  /* Responsive text sizes */
  .text-xs {
    font-size: 0.75rem;
  }
  
  .text-sm {
    font-size: 0.875rem;
  }
  
  /* Enhanced touch feedback */
  .active\:scale-95:active {
    transform: scale(0.95);
  }
  
  .active\:bg-gray-100:active {
    background-color: #f3f4f6;
  }
  
  .dark .active\:bg-gray-700:active {
    background-color: #374151;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .transition-colors,
  .transition-all,
  .animate-spin,
  .hover\:scale-110,
  .active\:scale-95 {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    transform: none !important;
  }
}

/* Table cell optimization */
.whitespace-nowrap {
  white-space: nowrap;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Ensure smooth scrolling */
.min-h-screen {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Virtual scrolling specific optimizations */
tbody {
  position: relative;
}

/* Optimize animations */
.animate-spin {
  animation: spin 1s linear infinite;
  animation-timing-function: linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

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

/* Dark mode optimizations */
.dark .border-gray-200 {
  border-color: #374151;
}

.dark .bg-gray-50 {
  background-color: rgba(17, 24, 39, 0.5);
}

/* Clickable optimization */
.cursor-pointer {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

/* Memory optimization */
* {
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;
}

/* Print styles optimization */
@media print {
  .no-print {
    display: none !important;
  }
  
  table {
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    page-break-inside: avoid;
  }
}

/* Accessibility focus states */
button:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  ring-width: 2px;
}

/* Rotate transition optimization */
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Loading state optimization */
.text-center {
  text-align: center;
}

.inline-block {
  display: inline-block;
}

/* Responsive grid optimization */
.grid-cols-2 > * {
  min-width: 0;
}

/* Smooth transform optimization */
.transform {
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* Virtual scrolling height calculation */
[style*="max-height: calc(100vh - 320px)"] {
  max-height: calc(100vh - 300px) !important;
}

/* Optimize modal scrolling on mobile */
@media (max-width: 768px) {
  body.modal-open {
    overflow: hidden;
    position: fixed;
    width: 100%;
    height: 100%;
  }
  
  /* Improve virtual scrolling container */
  .virtual-scroll-container {
    max-height: calc(100vh - 280px) !important;
  }
}

/* Performance warnings */
.performance-warning {
  display: none;
}

/* Optimize dropdown menus */
.absolute {
  z-index: 9999;
  will-change: transform;
}

/* Better table layout */
table {
  table-layout: auto;
}

@media (min-width: 1024px) {
  table {
    table-layout: fixed;
  }
}

/* Compact mobile optimization */
@media (max-width: 640px) {
  .hidden.xs\:inline {
    display: none;
  }
  
  .xs\:inline {
    display: inline;
  }
  
  .block.sm\:hidden {
    display: block;
  }
  
  /* Compact spacing */
  .gap-2 {
    gap: 0.5rem;
  }
  
  .gap-3 {
    gap: 0.75rem;
  }
  
  .p-3 {
    padding: 0.75rem;
  }
}

/* Optimize filter select */
select {
  min-height: 42px;
  cursor: pointer;
}

/* Virtual scrolling performance enhancements */
tbody tr {
  contain-intrinsic-size: 80px;
  content-visibility: auto;
}

@media (max-width: 1024px) {
  tbody tr {
    contain-intrinsic-size: 120px;
  }
}

/* Smooth scroll behavior */
.overflow-y-auto {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

/* Optimize fixed button */
.fixed {
  isolation: isolate;
  z-index: 40;
}

/* Loading spinner optimization */
.inline-block.animate-spin {
  animation: spin 1s linear infinite;
  will-change: transform;
}

/* Ensure proper text rendering */
.text-gray-900 {
  color: #111827;
}

.dark .text-white {
  color: #ffffff;
}

/* Optimize table cell padding */
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

/* Mobile card optimization */
@media (max-width: 768px) {
  .max-w-\[100px\] {
    max-width: 100px;
  }
  
  .max-w-\[120px\] {
    max-width: 120px;
  }
  
  .max-w-\[150px\] {
    max-width: 150px;
  }
  
  /* Better card layout */
  .flex-col {
    flex-direction: column;
  }
  
  .space-y-1 > * + * {
    margin-top: 0.25rem;
  }
  
  .space-y-2 > * + * {
    margin-top: 0.5rem;
  }
}

/* Virtual row positioning */
[style*="transform: translateY"] {
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
}

/* Ensure table cells don't overflow */
td {
  overflow: hidden;
}

/* Optimize modal performance */
.fixed.inset-0 {
  will-change: transform;
  backface-visibility: hidden;
}

/* Table row display for virtual scrolling */
tbody tr {
  display: table-row;
}

/* Ensure proper table cell display */
td {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}

/* Fix virtual scrolling table layout */
.virtual-scroll-container table {
  display: table;
}

.virtual-scroll-container thead,
.virtual-scroll-container tbody {
  display: table-row-group;
}

/* Ensure proper column widths */
th, td {
  min-width: 0;
  max-width: 100%;
}

/* Table cell alignment fixes */
.align-middle {
  vertical-align: middle !important;
}

.text-center {
  text-align: center !important;
}

/* Fix for absolute positioned rows in virtual scrolling */
tbody tr.absolute {
  display: flex;
  align-items: center;
  width: 100%;
}

tbody tr.absolute td {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* Responsive table adjustments */
@media (min-width: 1024px) {
  th, td {
    text-align: center;
    vertical-align: middle;
  }
  
  /* Ensure all table cells have consistent padding */
  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .py-3 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
}

/* Fix table header alignment */
thead tr th {
  text-align: center;
  vertical-align: middle;
}

/* Ensure table cells are properly sized */
table {
  width: 100%;
  table-layout: auto;
}

@media (min-width: 1024px) {
  table {
    table-layout: fixed;
  }
  
  /* Set specific column widths for better alignment */
  th:nth-child(1), td:nth-child(1) { width: 80px; } /* الصورة */
  th:nth-child(2), td:nth-child(2) { width: 180px; } /* الاسم والكود */
  th:nth-child(3), td:nth-child(3) { width: 100px; } /* اللون */
  th:nth-child(4), td:nth-child(4) { width: 120px; } /* المخزن */
  th:nth-child(5), td:nth-child(5) { width: 120px; } /* المورد */
  th:nth-child(6), td:nth-child(6) { width: 150px; } /* الكميات */
  th:nth-child(7), td:nth-child(7) { width: 120px; } /* المتبقي */
  th:nth-child(8), td:nth-child(8) { width: 100px; } /* الحالة */
  th:nth-child(9), td:nth-child(9) { width: 120px; } /* الإجراءات/آخر تحديث */
}

/* Center content in table cells */
td > div,
td > span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

/* Fix for text alignment in table cells */
td .text-sm,
td .text-xs {
  text-align: center;
  width: 100%;
}

/* Ensure buttons in table cells are centered */
td .flex {
  justify-content: center;
}

/* Fix for virtual scrolling absolute positioning */
tbody {
  position: relative;
  display: block;
}

tbody tr.absolute {
  display: table-row;
  position: absolute;
  left: 0;
  right: 0;
}

tbody tr.absolute td {
  display: table-cell;
  vertical-align: middle;
}

/* Fix for table responsiveness */
@media (max-width: 1024px) {
  .lg\:hidden .virtual-scroll-container table {
    display: table;
    width: 100%;
  }
}

/* Improve table header visibility */
thead th {
  background-color: #f9fafb;
  position: sticky;
  top: 0;
  z-index: 10;
}

.dark thead th {
  background-color: rgba(31, 41, 55, 0.95);
}

/* Fix table border and spacing */
table {
  border-collapse: collapse;
}

th, td {
  border-bottom: 1px solid #e5e7eb;
}

.dark th, .dark td {
  border-bottom: 1px solid #374151;
}

/* Ensure consistent row height */
tbody tr {
  height: 80px;
}

/* Fix for mobile virtual scrolling */
.lg\:hidden .virtual-scroll-container {
  position: relative;
}

.lg\:hidden .virtual-scroll-container > div {
  position: relative;
}

/* Improve table readability */
td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Center align all table content */
table {
  text-align: center;
}

th, td {
  text-align: center;
  vertical-align: middle;
}

/* FIX: إصلاح تداخل النص في الخلايا */
td > div {
  max-width: 100%;
  overflow: hidden;
}

/* FIX: تحسين عرض النصوص الطويلة */
.truncate {
  max-width: 100%;
  display: inline-block;
  vertical-align: middle;
}

/* FIX: تحسين محاذاة العناصر داخل الخلايا */
.flex.items-center {
  flex-wrap: nowrap;
}

/* FIX: منع تداخل النصوص */
.min-w-0 {
  min-width: 0;
}

/* FIX: تحسين تخطيط الجدول للشاشات الكبيرة */
@media (min-width: 1536px) {
  .w-20 { width: 100px; }
  .w-32 { width: 150px; }
  .w-40 { width: 180px; }
  .w-48 { width: 220px; }
}
</style>
