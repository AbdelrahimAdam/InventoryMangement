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
                {{ (displayedItems || []).length }} عنصر • {{ formatTime(lastUpdate) }}
              </span>
              <!-- Live Search Indicator -->
              <span v-if="isLiveSearching && searchTerm.length >= 3" class="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                <span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                بحث مباشر...
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
            v-if="(displayedItems || []).length > 0"
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
            v-if="hasMore && !loading && !useLiveSearch && (displayedItems || []).length > 0"
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
              <p class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{{ formatNumber((displayedItems || []).length) }}</p>
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
              <div v-if="(accessibleWarehouses || []).length > 0" class="order-1">
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
                    @input="handleLiveSearch"
                    placeholder="ابحث بأي حقل (كتابة تبدأ البحث)..."
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
                  <!-- Search Info -->
                  <div v-if="isLiveSearching" class="absolute left-0 right-0 -bottom-6 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <svg class="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    جاري البحث...
                  </div>
                  <div v-else-if="searchTerm.length > 0 && searchTerm.length < 2" class="absolute left-0 right-0 -bottom-6 text-xs text-yellow-600 dark:text-yellow-400">
                    ⓘ اكتب حرفين على الأقل للبحث
                  </div>
                  <div v-else-if="useLiveSearch && (liveSearchResults || []).length > 0" class="absolute left-0 right-0 -bottom-6 text-xs text-green-600 dark:text-green-400">
                    ✓ تم العثور على {{ (liveSearchResults || []).length }} نتيجة
                  </div>
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
          <div v-if="useLiveSearch && (liveSearchResults || []).length > 0" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 p-3 sm:p-4 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <span class="text-sm">نتائج البحث المباشر: {{ (liveSearchResults || []).length }} عنصر</span>
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
      <div v-if="loading && !displayedItems.length" class="text-center py-8 sm:py-12">
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

      <!-- Inventory Table Container -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Desktop Table with Virtual Scrolling -->
        <div class="hidden lg:block">
          <div
            class="overflow-x-auto relative"
            :style="{ maxHeight: 'calc(100vh - 400px)' }"
            @scroll="onScroll"
            ref="scrollContainer"
          >
            <table class="w-full">
              <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0 z-20">
                <tr>
                  <th class="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500 whitespace-nowrap">
                    الصورة
                  </th>
                  <th class="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500 whitespace-nowrap">
                    <div class="flex flex-col items-center justify-center">
                      <span>الاسم والكود</span>
                      <span class="text-xs text-gray-500 dark:text-gray-400 font-normal">(انقر للتفاصيل)</span>
                    </div>
                  </th>
                  <th class="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500 whitespace-nowrap">
                    اللون
                  </th>
                  <th class="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500 whitespace-nowrap">
                    المخزن
                  </th>
                  <th class="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500 whitespace-nowrap">
                    المورد
                  </th>
                  <th class="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500 whitespace-nowrap">
                    <div class="flex flex-col items-center justify-center">
                      <span>الكميات</span>
                      <span class="text-xs text-gray-500 dark:text-gray-400 font-normal">كراتين/في الكرتونة/فردي</span>
                    </div>
                  </th>
                  <th class="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500 whitespace-nowrap">
                    <div class="flex flex-col items-center justify-center">
                      <span>المتبقي</span>
                      <span class="text-xs text-gray-500 dark:text-gray-400 font-normal">من المجموع</span>
                    </div>
                  </th>
                  <th class="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500 whitespace-nowrap">
                    الحالة
                  </th>
                  <th v-if="showActions && !readonly && userRole !== 'viewer'"
                      class="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500 whitespace-nowrap">
                    الإجراءات
                  </th>
                  <th v-else
                      class="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500 whitespace-nowrap">
                    آخر تحديث
                  </th>
                </tr>
              </thead>
              <tbody>
                <!-- Virtual Scrolling - Only render visible rows -->
                <tr v-for="item in visibleItems"
                    :key="item.id"
                    class="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                    :style="{ transform: 'translateY(0)' }"
                >
                  <!-- Photo -->
                  <td class="px-4 sm:px-6 py-3 sm:py-4">
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
                  <td class="px-4 sm:px-6 py-3 sm:py-4">
                    <div class="min-w-0 max-w-xs">
                      <div class="text-sm font-semibold text-gray-900 dark:text-white truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        @click="showItemDetails(item)">
                        {{ item.name }}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span class="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {{ item.code }}
                        </span>
                      </div>
                      <div v-if="item.item_location" class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                        <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        </svg>
                        <span class="truncate">{{ item.item_location }}</span>
                      </div>
                    </div>
                  </td>

                  <!-- Color -->
                  <td class="px-4 sm:px-6 py-3 sm:py-4">
                    <div class="flex items-center justify-center">
                      <div class="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gray-50 dark:bg-gray-700">
                        <div v-if="item.color" class="w-3 h-3 rounded-full border border-gray-300"
                          :style="{ backgroundColor: getColorHex(item.color) }"></div>
                        <span class="text-xs sm:text-sm text-gray-900 dark:text-white">
                          {{ item.color || '-' }}
                        </span>
                      </div>
                    </div>
                  </td>

                  <!-- Warehouse -->
                  <td class="px-4 sm:px-6 py-3 sm:py-4">
                    <div class="text-center">
                      <span class="text-xs sm:text-sm text-gray-900 dark:text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gray-50 dark:bg-gray-700">
                        {{ getWarehouseLabel(item.warehouse_id) }}
                      </span>
                    </div>
                  </td>

                  <!-- Supplier -->
                  <td class="px-4 sm:px-6 py-3 sm:py-4">
                    <div class="max-w-[120px] sm:max-w-[150px] mx-auto">
                      <span class="text-xs sm:text-sm text-gray-900 dark:text-white truncate block px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gray-50 dark:bg-gray-700">
                        {{ item.supplier || '-' }}
                      </span>
                    </div>
                  </td>

                  <!-- Quantities -->
                  <td class="px-4 sm:px-6 py-3 sm:py-4">
                    <div class="text-xs sm:text-sm space-y-1 max-w-[120px] sm:max-w-[150px] mx-auto">
                      <div class="flex items-center justify-between px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gray-50 dark:bg-gray-700">
                        <span class="text-gray-500 dark:text-gray-400 text-xs">كراتين:</span>
                        <span class="text-gray-900 dark:text-white font-medium">{{ item.cartons_count || 0 }}</span>
                      </div>
                      <div class="flex items-center justify-between px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gray-50 dark:bg-gray-700">
                        <span class="text-gray-500 dark:text-gray-400 text-xs">في الكرتونة:</span>
                        <span class="text-gray-900 dark:text-white font-medium">{{ item.per_carton_count || 0 }}</span>
                      </div>
                      <div class="flex items-center justify-between px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gray-50 dark:bg-gray-700">
                        <span class="text-gray-500 dark:text-gray-400 text-xs">فردي:</span>
                        <span class="text-gray-900 dark:text-white font-medium">{{ item.single_bottles_count || 0 }}</span>
                      </div>
                    </div>
                  </td>

                  <!-- Remaining Quantity -->
                  <td class="px-4 sm:px-6 py-3 sm:py-4">
                    <div class="text-center">
                      <div :class="getQuantityClass(item.remaining_quantity)"
                           class="text-base sm:text-lg font-bold px-3 py-2 sm:px-4 sm:py-2.5 rounded-full inline-flex flex-col items-center gap-1">
                        <span>{{ item.remaining_quantity }}</span>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          من {{ item.total_added }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Status -->
                  <td class="px-4 sm:px-6 py-3 sm:py-4">
                    <div class="flex justify-center">
                      <span :class="getStockStatusClass(item.remaining_quantity)"
                            class="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-sm">
                        {{ getStockStatus(item.remaining_quantity) }}
                      </span>
                    </div>
                  </td>

                  <!-- Actions or Updated Date -->
                  <td class="px-4 sm:px-6 py-3 sm:py-4">
                    <div v-if="showActions && !readonly && userRole !== 'viewer'" class="flex items-center justify-center gap-1 sm:gap-2">
                      <!-- View Details Button -->
                      <button
                        @click="showItemDetails(item)"
                        class="p-1.5 sm:p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/20 hover:scale-110 transition-all duration-200"
                        title="عرض التفاصيل"
                      >
                        <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </button>

                      <!-- More Actions Dropdown -->
                      <div class="relative">
                        <button
                          @click="toggleActionMenu(item.id)"
                          class="p-1.5 sm:p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-150"
                          title="المزيد من الإجراءات"
                        >
                          <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div v-else class="text-center">
                      <span class="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gray-50 dark:bg-gray-700">
                        {{ formatDate(item.updated_at) }}
                      </span>
                    </div>
                  </td>
                </tr>

                <!-- Empty State -->
                <tr v-if="visibleItems.length === 0 && !loading">
                  <td :colspan="showActions && !readonly && userRole !== 'viewer' ? 9 : 8" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div class="flex flex-col items-center">
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
          <div v-if="!hasMore && (displayedItems || []).length > 0 && !useLiveSearch" class="p-4 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
            <p class="text-sm">تم عرض جميع العناصر ({{ (displayedItems || []).length }} عنصر)</p>
          </div>
        </div>

        <!-- Mobile Cards with Virtual Scrolling -->
        <div class="lg:hidden">
          <div
            class="overflow-y-auto"
            :style="{ maxHeight: 'calc(100vh - 320px)' }"
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
            <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
              <!-- Virtual Scrolling for Mobile - Only render visible items -->
              <div
                v-for="item in mobileVisibleItems"
                :key="item.id"
                class="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 active:bg-gray-100 dark:active:bg-gray-700"
                @click="showItemDetails(item)"
              >
                <!-- Main Row -->
                <div class="flex gap-3">
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
                    <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
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
                        <span>{{ item.color }}</span>
                      </div>
                    </div>

                    <!-- Third Row: Supplier and Location -->
                    <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <div v-if="item.supplier" class="flex items-center gap-1 truncate max-w-[120px]">
                        <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                        <span class="truncate">{{ item.supplier }}</span>
                      </div>
                      <div v-if="item.item_location" class="flex items-center gap-1 text-gray-500">
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
                     class="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between">
                  <!-- Last Updated -->
                  <div class="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
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
            <div v-if="hasMore && !loadingMore && !useLiveSearch && mobileVisibleItems.length > 0" class="p-4 text-center">
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
            <div v-if="!hasMore && (displayedItems || []).length > 0 && !useLiveSearch && mobileVisibleItems.length > 0" class="p-4 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
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
<script>
import { ref, computed, onMounted, watch, onUnmounted, nextTick } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { debounce } from 'lodash';
import * as XLSX from 'xlsx';
import AddItemModal from '@/components/inventory/AddItemModal.vue';
import DispatchModal from '@/components/inventory/DispatchModal.vue';
import EditItemModal from '@/components/inventory/EditItemModal.vue';
import TransferModal from '@/components/inventory/TransferModal.vue';
import ItemDetailsModal from '@/components/inventory/ItemDetailsModal.vue';
import ConfirmDeleteModal from '@/components/inventory/ConfirmDeleteModal.vue';

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  }
};

export default {
  name: 'InventoryProduction',
  components: {
    AddItemModal,
    DispatchModal,
    EditItemModal,
    TransferModal,
    ItemDetailsModal,
    ConfirmDeleteModal
  },
  directives: {
    'click-outside': vClickOutside
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    
    // State
    const loading = ref(false);
    const showAddModal = ref(false);
    const showEditModal = ref(false);
    const showTransferModal = ref(false);
    const showDispatchModal = ref(false);
    const showDetailsModal = ref(false);
    const showDeleteConfirm = ref(false);
    const selectedItemForEdit = ref(null);
    const selectedItemForTransfer = ref(null);
    const selectedItemForDispatch = ref(null);
    const selectedItem = ref(null);
    const itemToDelete = ref(null);
    const exporting = ref(false);
    const deleteLoading = ref(false);
    const refreshing = ref(false);
    const exportProgress = ref('');
    
    // Local filters
    const searchTerm = ref('');
    const statusFilter = ref('');
    const selectedWarehouse = ref('');
    
    // Mobile UI state
    const showFilters = ref(false);
    const showActionMenu = ref(null);
    
    // Virtual scrolling state
    const scrollContainer = ref(null);
    const mobileScrollContainer = ref(null);
    const visibleStartIndex = ref(0);
    const mobileVisibleStartIndex = ref(0);
    const visibleItemCount = 50;
    const mobileVisibleItemCount = 20;
    const scrollBuffer = 20;
    const scrollThrottle = ref(null);
    const lastScrollTime = ref(0);
    const SCROLL_THROTTLE_DELAY = 16;
    
    // UI state
    const lastUpdate = ref(Date.now());
    const isDataFresh = ref(false);
    
    // ============================================
    // CORRECTED COMPUTED PROPERTIES
    // ============================================
    
    // Store getters - CORRECT
    const userRole = computed(() => store.getters.userRole);
    const userProfile = computed(() => store.state.userProfile);
    const currentUser = computed(() => store.state.user);
    
    // Inventory - Use the enhanced filtered inventory from store
    const displayedItems = computed(() => {
      // When we have an active search, use store's search results
      if (store.state.search.query && store.state.search.query.length >= 2) {
        return store.state.search.results;
      }
      
      // Otherwise use the store's filtered inventory (which applies warehouse filter)
      return store.getters.filteredInventory || [];
    });
    
    // Warehouses - CORRECT
    const accessibleWarehouses = computed(() => store.getters.accessibleWarehouses || []);
    const allWarehouses = computed(() => store.getters.warehouses || []);
    const allUsers = computed(() => store.getters.allUsers || []);
    
    // Loading states - CORRECT
    const inventoryLoading = computed(() => store.state.inventoryLoading);
    const inventoryLoaded = computed(() => store.state.inventoryLoaded);
    
    // Pagination - CORRECT
    const hasMore = computed(() => store.getters.hasMore);
    const isFetchingMore = computed(() => store.state.pagination?.isFetching || false);
    const totalLoaded = computed(() => store.state.pagination?.totalLoaded || 0);
    
    // Current user info - CORRECT
    const currentUserInfo = computed(() => {
      if (userProfile.value?.name) return userProfile.value.name;
      if (currentUser.value?.displayName) return currentUser.value.displayName;
      if (userProfile.value?.email) return userProfile.value.email.split('@')[0];
      if (currentUser.value?.email) return currentUser.value.email.split('@')[0];
      return 'مستخدم النظام';
    });
    
    // Permissions - CORRECT
    const canAddItem = computed(() => {
      return userRole.value === 'superadmin' ||
             (userRole.value === 'warehouse_manager' && 
              store.getters.allowedWarehouses?.length > 0);
    });
    
    const showActions = computed(() => userRole.value !== 'viewer');
    const readonly = computed(() => userRole.value === 'viewer');
    
    // Permission methods
    const canEditItem = (item) => {
      if (userRole.value === 'superadmin') return true;
      if (userRole.value !== 'warehouse_manager') return false;
      
      const allowedWarehouses = store.getters.allowedWarehouses || [];
      return allowedWarehouses.includes(item.warehouse_id) || allowedWarehouses.includes('all');
    };
    
    const canTransferItem = (item) => canEditItem(item);
    const canDispatchItem = (item) => canEditItem(item);
    
    const canDeleteItem = (item) => {
      return canEditItem(item) && userRole.value === 'superadmin';
    };
    
    // Search state from store
    const useLiveSearch = computed(() => {
      return !!store.state.search.query && store.state.search.query.length >= 2;
    });
    
    const isLiveSearching = computed(() => store.state.search.loading);
    const liveSearchResults = computed(() => store.state.search.results);
    
    // ============================================
    // STATS WITH LOCAL STATUS FILTER
    // ============================================
    const totalQuantity = computed(() => {
      let items = displayedItems.value;
      
      // Apply status filter locally
      if (statusFilter.value) {
        items = items.filter(item => {
          const quantity = item.remaining_quantity || 0;
          if (statusFilter.value === 'in_stock') return quantity >= 10;
          if (statusFilter.value === 'low_stock') return quantity > 0 && quantity < 10;
          if (statusFilter.value === 'out_of_stock') return quantity === 0;
          return true;
        });
      }
      
      return items.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0);
    });
    
    const lowStockCount = computed(() => {
      let items = displayedItems.value;
      
      // Apply status filter locally
      if (statusFilter.value) {
        items = items.filter(item => {
          const quantity = item.remaining_quantity || 0;
          if (statusFilter.value === 'in_stock') return quantity >= 10;
          if (statusFilter.value === 'low_stock') return quantity > 0 && quantity < 10;
          if (statusFilter.value === 'out_of_stock') return quantity === 0;
          return true;
        });
      }
      
      return items.filter(item => {
        const quantity = item.remaining_quantity || 0;
        return quantity > 0 && quantity < 10;
      }).length;
    });
    
    const warehouseCount = computed(() => {
      const items = displayedItems.value;
      const warehouses = new Set(items.map(item => item.warehouse_id));
      return warehouses.size;
    });
    
    const hasActiveFilters = computed(() => {
      return selectedWarehouse.value || statusFilter.value || searchTerm.value;
    });
    
    const activeFilterCount = computed(() => {
      let count = 0;
      if (selectedWarehouse.value) count++;
      if (statusFilter.value) count++;
      if (searchTerm.value) count++;
      return count;
    });
    
    // ============================================
    // VISIBLE ITEMS FOR VIRTUAL SCROLLING
    // ============================================
    const visibleItems = computed(() => {
      let items = displayedItems.value;
      
      // Apply status filter locally
      if (statusFilter.value) {
        items = items.filter(item => {
          const quantity = item.remaining_quantity || 0;
          if (statusFilter.value === 'in_stock') return quantity >= 10;
          if (statusFilter.value === 'low_stock') return quantity > 0 && quantity < 10;
          if (statusFilter.value === 'out_of_stock') return quantity === 0;
          return true;
        });
      }
      
      const start = Math.max(0, visibleStartIndex.value - scrollBuffer);
      const end = Math.min(items.length, visibleStartIndex.value + visibleItemCount + scrollBuffer);
      return items.slice(start, end);
    });
    
    const mobileVisibleItems = computed(() => {
      let items = displayedItems.value;
      
      // Apply status filter locally
      if (statusFilter.value) {
        items = items.filter(item => {
          const quantity = item.remaining_quantity || 0;
          if (statusFilter.value === 'in_stock') return quantity >= 10;
          if (statusFilter.value === 'low_stock') return quantity > 0 && quantity < 10;
          if (statusFilter.value === 'out_of_stock') return quantity === 0;
          return true;
        });
      }
      
      const start = Math.max(0, mobileVisibleStartIndex.value - scrollBuffer);
      const end = Math.min(items.length, mobileVisibleStartIndex.value + mobileVisibleItemCount + scrollBuffer);
      return items.slice(start, end);
    });
    
    // ============================================
    // HELPER METHODS (UNCHANGED)
    // ============================================
    const formatNumber = (num) => {
      const englishDigits = new Intl.NumberFormat('en-US').format(num || 0);
      return englishDigits;
    };
    
    const getWarehouseLabel = (warehouseId) => {
      if (!warehouseId) return 'غير معروف';
      return store.getters.getWarehouseLabel(warehouseId) || warehouseId;
    };
    
    const getUserName = (userId) => {
      if (!userId) return 'نظام';
      if (userId === currentUser.value?.uid) return currentUserInfo.value;
      
      const user = allUsers.value.find(u => u.id === userId);
      if (user) return user.name || user.email || userId;
      
      return userId;
    };
    
    const getActionUser = (item) => {
      if (!item) return currentUserInfo.value;
      
      if (item.updated_by) {
        const userName = getUserName(item.updated_by);
        if (userName && userName !== 'O5Rg9HxDH8Nk3LY9G5onMgc2vN12') {
          return userName;
        }
      }
      
      if (item.created_by) {
        const userName = getUserName(item.created_by);
        if (userName && userName !== 'O5Rg9HxDH8Nk3LY9G5onMgc2vN12') {
          return userName;
        }
      }
      
      return currentUserInfo.value;
    };
    
    const getLastActionUser = (item) => getActionUser(item);
    
    const getStatusLabel = (status) => {
      const labels = {
        'in_stock': 'متوفر',
        'low_stock': 'كمية قليلة',
        'out_of_stock': 'غير متوفر'
      };
      return labels[status] || status;
    };
    
    const getStockStatus = (quantity) => {
      if (quantity === 0) return 'نفذ';
      if (quantity < 10) return 'قليل';
      return 'متوفر';
    };
    
    const getStockStatusClass = (quantity) => {
      if (quantity === 0) return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800 shadow-sm';
      if (quantity < 10) return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-800 shadow-sm';
      return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800 shadow-sm';
    };
    
    const getQuantityClass = (quantity) => {
      if (quantity === 0) return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10';
      if (quantity < 10) return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/10';
      return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10';
    };
    
    const colorMap = {
      'أحمر': '#ef4444', 'أزرق': '#3b82f6', 'أخضر': '#10b981',
      'أصفر': '#f59e0b', 'أسود': '#000000', 'أبيض': '#ffffff',
      'رمادي': '#6b7280', 'بني': '#92400e', 'وردي': '#ec4899',
      'برتقالي': '#f97316', 'بنفسجي': '#8b5cf6', 'ذهبي': '#d97706',
      'فضي': '#9ca3af'
    };
    
    const getColorHex = (colorName) => colorMap[colorName] || '#6b7280';
    
    const formatDate = (timestamp) => {
      if (!timestamp) return '-';
      try {
        let dateObj;
        if (timestamp.toDate) dateObj = timestamp.toDate();
        else if (timestamp instanceof Date) dateObj = timestamp;
        else dateObj = new Date(timestamp);
        
        if (isNaN(dateObj.getTime())) return '-';
        
        return dateObj.toLocaleDateString('ar-EG', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit'
        });
      } catch (e) { return '-'; }
    };
    
    const formatRelativeTime = (timestamp) => {
      if (!timestamp) return '-';
      try {
        let dateObj;
        if (timestamp.toDate) dateObj = timestamp.toDate();
        else if (timestamp instanceof Date) dateObj = timestamp;
        else dateObj = new Date(timestamp);
        
        if (isNaN(dateObj.getTime())) return '-';
        
        const now = new Date();
        const diffMs = now - dateObj;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'الآن';
        if (diffMins < 60) return `قبل ${diffMins} دقيقة`;
        if (diffHours < 24) return `قبل ${diffHours} ساعة`;
        if (diffDays === 1) return 'أمس';
        if (diffDays < 7) return `قبل ${diffDays} أيام`;
        return formatDate(timestamp);
      } catch (e) { return '-'; }
    };
    
    const formatTime = (timestamp) => {
      if (!timestamp) return 'قيد التحميل...';
      const now = Date.now();
      const diffMs = now - timestamp;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      
      if (diffMins < 1) return 'الآن';
      if (diffMins < 60) return `قبل ${diffMins} دقيقة`;
      if (diffHours < 24) return `قبل ${diffHours} ساعة`;
      
      return new Date(timestamp).toLocaleTimeString('ar-EG', {
        hour: '2-digit', minute: '2-digit'
      });
    };
    
    const getPlaceholderImage = () => {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMTZMNC42ODYgMTUuMzE0QzQuODgyIDExLjUwNyA4LjA5MyA5IDEyIDlDMTUuOTA3IDkgMTkuMTE4IDExLjUwNyAxOS4zMTQgMTUuMzE0TDIwIDE2TTggMjFIMTZNNSAxNEgxOU0xMiAxN0MxMiAxNy41NTIyOCAxMS41NTIzIDE4IDExIDE4QzEwLjQ0NzcgMTggMTAgMTcuNTUyMyAxMCAxN0MxMCAxNi40NDc3IDEwLjQ0NzcgMTYgMTEgMTZDMTEuNTUyMyAxNiAxMiAxNi40NDc3IDEyIDE3WiIgc3Ryb2tlPSI2QjcyOEQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
    };
    
    const handleImageError = (event) => {
      event.target.src = getPlaceholderImage();
      event.target.onerror = null;
    };
    
    // ============================================
    // CORRECTED LIVE SEARCH - USING STORE PROPERLY
    // ============================================
    const handleLiveSearch = debounce(async () => {
      const term = searchTerm.value.trim();
      
      if (term.length === 0) {
        resetToNormalView();
        return;
      }
      
      // Only search if we have at least 2 characters
      if (term.length < 2) {
        store.dispatch('clearSearch');
        return;
      }
      
      try {
        console.log(`🔍 Live search: "${term}"`);
        
        // CORRECT: Use the main search action from store
        const results = await store.dispatch('searchInventoryLive', {
          query: term,
          warehouseId: selectedWarehouse.value || undefined,
          limit: 50
        });
        
        console.log(`✅ Live search found: ${results?.length || 0} items`);
        
        // Data is fresh from Firestore search
        isDataFresh.value = true;
        lastUpdate.value = Date.now();
        
        // Reset scroll positions
        visibleStartIndex.value = 0;
        mobileVisibleStartIndex.value = 0;
        if (scrollContainer.value) {
          scrollContainer.value.scrollTop = 0;
        }
        if (mobileScrollContainer.value) {
          mobileScrollContainer.value.scrollTop = 0;
        }
        
        // Show notification
        if (results && results.length > 0) {
          store.dispatch('showNotification', {
            type: 'success',
            message: `تم العثور على ${results.length} نتيجة للبحث: "${term}"`
          });
        } else {
          store.dispatch('showNotification', {
            type: 'info',
            message: 'لم يتم العثور على نتائج للبحث'
          });
        }
        
      } catch (error) {
        console.error('❌ Error in live search:', error);
        
        store.dispatch('showNotification', {
          type: 'error',
          message: 'فشل البحث المباشر. جاري استخدام البيانات المحلية'
        });
        
        // Reset to local view
        store.dispatch('clearSearch');
      }
    }, 300);
    
    // ============================================
    // CORRECTED LOAD MORE ITEMS
    // ============================================
    const loadMoreItems = async () => {
      // Only load more if not in live search mode
      if (useLiveSearch.value) {
        return;
      }
      
      if (hasMore.value && !isFetchingMore.value) {
        try {
          console.log('📥 Loading more items...');
          
          // CORRECT: Use the store action
          await store.dispatch('loadMoreInventory');
          
          console.log('✅ Loaded more items successfully');
          
          // After loading, ensure virtual scrolling updates
          await nextTick();
          
        } catch (error) {
          console.error('❌ Error loading more items:', error);
          store.dispatch('showNotification', {
            type: 'error',
            message: 'خطأ في تحميل المزيد من العناصر'
          });
        }
      }
    };
    
    // ============================================
    // CORRECTED FILTER HANDLERS
    // ============================================
    const handleWarehouseChange = async () => {
      // CORRECT: Use the store action
      await store.dispatch('setWarehouseFilter', selectedWarehouse.value || '');
      
      // Reset scroll positions
      visibleStartIndex.value = 0;
      mobileVisibleStartIndex.value = 0;
      if (scrollContainer.value) {
        scrollContainer.value.scrollTop = 0;
      }
      if (mobileScrollContainer.value) {
        mobileScrollContainer.value.scrollTop = 0;
      }
      
      // If we're in live search mode, re-run search with new warehouse filter
      if (useLiveSearch.value && searchTerm.value.trim()) {
        await handleLiveSearch();
      }
    };
    
    const handleFilterChange = () => {
      // Reset scroll positions
      visibleStartIndex.value = 0;
      mobileVisibleStartIndex.value = 0;
      if (scrollContainer.value) {
        scrollContainer.value.scrollTop = 0;
      }
      if (mobileScrollContainer.value) {
        mobileScrollContainer.value.scrollTop = 0;
      }
      
      // If we have a search term, trigger live search
      if (searchTerm.value.trim() && searchTerm.value.trim().length >= 2) {
        handleLiveSearch();
      }
    };
    
    const resetToNormalView = () => {
      searchTerm.value = '';
      statusFilter.value = '';
      showFilters.value = false;
      
      // CORRECT: Clear search in store
      store.dispatch('clearSearch');
      
      // Reset warehouse filter if needed
      if (selectedWarehouse.value) {
        selectedWarehouse.value = '';
        store.dispatch('setWarehouseFilter', '');
      }
      
      // Reset scroll positions
      visibleStartIndex.value = 0;
      mobileVisibleStartIndex.value = 0;
      if (scrollContainer.value) {
        scrollContainer.value.scrollTop = 0;
      }
      if (mobileScrollContainer.value) {
        mobileScrollContainer.value.scrollTop = 0;
      }
    };
    
    const clearAllFilters = () => {
      selectedWarehouse.value = '';
      statusFilter.value = '';
      searchTerm.value = '';
      showFilters.value = false;
      
      // Clear store filters and search
      store.dispatch('clearSearch');
      store.dispatch('setWarehouseFilter', '');
      
      // Reset scroll positions
      visibleStartIndex.value = 0;
      mobileVisibleStartIndex.value = 0;
      if (scrollContainer.value) {
        scrollContainer.value.scrollTop = 0;
      }
      if (mobileScrollContainer.value) {
        mobileScrollContainer.value.scrollTop = 0;
      }
    };
    
    // ============================================
    // DATA REFRESH - CORRECTED
    // ============================================
    const refreshData = async () => {
      try {
        refreshing.value = true;
        
        // Force refresh from store
        await store.dispatch('loadAllInventory', { forceRefresh: true });
        
        lastUpdate.value = Date.now();
        isDataFresh.value = true;
        
        // If we have a search term, refresh search results
        if (searchTerm.value.trim() && searchTerm.value.trim().length >= 2) {
          await handleLiveSearch();
        }
        
        store.dispatch('showNotification', {
          type: 'success',
          message: 'تم تحديث البيانات بنجاح'
        });
        
      } catch (error) {
        console.error('❌ Error refreshing data:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تحديث البيانات'
        });
      } finally {
        refreshing.value = false;
      }
    };
    
    // ============================================
    // EXCEL EXPORT - CORRECTED
    // ============================================
    const exportToExcel = async () => {
      let items = displayedItems.value;
      
      // Apply status filter locally
      if (statusFilter.value) {
        items = items.filter(item => {
          const quantity = item.remaining_quantity || 0;
          if (statusFilter.value === 'in_stock') return quantity >= 10;
          if (statusFilter.value === 'low_stock') return quantity > 0 && quantity < 10;
          if (statusFilter.value === 'out_of_stock') return quantity === 0;
          return true;
        });
      }
      
      if (items.length === 0) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'لا توجد بيانات للتصدير'
        });
        return;
      }
      
      exporting.value = true;
      exportProgress.value = 'جاري تجهير البيانات...';
      
      try {
        const itemsByWarehouse = {};
        
        items.forEach((item, index) => {
          exportProgress.value = `جاري تجهير العنصر ${index + 1} من ${items.length}`;
          
          const warehouseId = item.warehouse_id;
          if (!itemsByWarehouse[warehouseId]) {
            itemsByWarehouse[warehouseId] = [];
          }
          
          const createdByName = item.created_by_name || getUserName(item.created_by) || 'غير معروف';
          const updatedByName = item.updated_by_name || getUserName(item.updated_by) || createdByName || 'غير معروف';
          
          itemsByWarehouse[warehouseId].push({
            'الكود': item.code || '',
            'اسم الصنف': item.name || '',
            'اللون': item.color || '',
            'المخزن': getWarehouseLabel(item.warehouse_id),
            'مكان التخزين': item.item_location || '',
            'المورد': item.supplier || '',
            'عدد الكراتين': item.cartons_count || 0,
            'عدد في الكرتونة': item.per_carton_count || 0,
            'عدد القطع الفردية': item.single_bottles_count || 0,
            'الكمية الإجمالية المضافة': item.total_added || 0,
            'الكمية المتبقية': item.remaining_quantity || 0,
            'الحالة': getStockStatus(item.remaining_quantity || 0),
            'أنشئ بواسطة': createdByName,
            'تم التحديث بواسطة': updatedByName,
            'تاريخ الإنشاء': formatDate(item.created_at),
            'آخر تحديث': formatDate(item.updated_at)
          });
        });
        
        exportProgress.value = 'جاري إنشاء ملف Excel...';
        
        const wb = XLSX.utils.book_new();
        
        const summaryData = [{
          'إجمالي الأصناف': items.length,
          'إجمالي الكمية': items.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0),
          'الأصناف قليلة المخزون': items.filter(item => {
            const quantity = item.remaining_quantity || 0;
            return quantity > 0 && quantity < 10;
          }).length,
          'عدد المخازن': Object.keys(itemsByWarehouse).length,
          'تاريخ التصدير': new Date().toLocaleDateString('ar-EG'),
          'تم التصدير بواسطة': currentUserInfo.value,
          'مصدر البيانات': useLiveSearch.value ? 'بحث مباشر' : 'بيانات مخزنة'
        }];
        
        const summaryWs = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summaryWs, 'الملخص');
        
        Object.keys(itemsByWarehouse).forEach((warehouseId, index) => {
          const warehouseItems = itemsByWarehouse[warehouseId];
          const warehouseName = getWarehouseLabel(warehouseId).replace(/[^\w\u0600-\u06FF\s]/g, '').trim();
          const sheetName = warehouseName || `المخزن ${index + 1}`;
          
          if (warehouseItems.length > 0) {
            const ws = XLSX.utils.json_to_sheet(warehouseItems);
            
            const colWidths = [
              { wch: 12 }, { wch: 20 }, { wch: 12 }, { wch: 15 },
              { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 12 },
              { wch: 12 }, { wch: 15 }, { wch: 12 }, { wch: 10 },
              { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 18 }
            ];
            ws['!cols'] = colWidths;
            
            const safeSheetName = sheetName.slice(0, 31);
            XLSX.utils.book_append_sheet(wb, ws, safeSheetName);
          }
        });
        
        exportProgress.value = 'جاري حفظ الملف...';
        
        const timestamp = new Date().toISOString().split('T')[0];
        const warehouseName = selectedWarehouse.value
          ? getWarehouseLabel(selectedWarehouse.value).replace(/\s+/g, '-')
          : 'جميع-المخازن';
        const searchInfo = searchTerm.value ? `-بحث-${searchTerm.value.substring(0, 10)}` : '';
        const fileName = `مخزون-${warehouseName}${searchInfo}-${timestamp}.xlsx`;
        
        XLSX.writeFile(wb, fileName);
        
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم تصدير ${items.length} صنف إلى ${Object.keys(itemsByWarehouse).length} صفحة في ملف Excel بنجاح`
        });
        
      } catch (error) {
        console.error('❌ Error exporting to Excel:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تصدير البيانات إلى Excel'
        });
      } finally {
        exporting.value = false;
        exportProgress.value = '';
      }
    };
    
    // ============================================
    // UI ACTION HANDLERS (UNCHANGED)
    // ============================================
    const toggleActionMenu = (itemId) => {
      showActionMenu.value = showActionMenu.value === itemId ? null : itemId;
    };
    
    const showItemDetails = (item) => {
      selectedItem.value = {
        ...item,
        warehouse_name: getWarehouseLabel(item.warehouse_id),
        created_by_name: item.created_by_name || getUserName(item.created_by),
        updated_by_name: item.updated_by_name || getUserName(item.updated_by) || getUserName(item.created_by)
      };
      showDetailsModal.value = true;
      showActionMenu.value = null;
    };
    
    const closeDetailsModal = () => {
      showDetailsModal.value = false;
      selectedItem.value = null;
    };
    
    const handleTransfer = (item) => {
      if (!canTransferItem(item)) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية النقل من هذا المخزن'
        });
        return;
      }
      selectedItemForTransfer.value = item;
      showTransferModal.value = true;
      showDetailsModal.value = false;
      showActionMenu.value = null;
    };
    
    const handleDispatch = (item) => {
      if (!canDispatchItem(item)) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية الصرف من هذا المخزن'
        });
        return;
      }
      selectedItemForDispatch.value = item;
      showDispatchModal.value = true;
      showDetailsModal.value = false;
      showActionMenu.value = null;
    };
    
    const handleEdit = (item) => {
      if (!canEditItem(item)) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية التعديل على هذا المخزن'
        });
        return;
      }
      selectedItemForEdit.value = {
        ...item,
        warehouse_name: getWarehouseLabel(item.warehouse_id)
      };
      showEditModal.value = true;
      showDetailsModal.value = false;
      showActionMenu.value = null;
    };
    
    const handleDelete = (item) => {
      if (!canDeleteItem(item)) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية حذف هذا الصنف'
        });
        return;
      }
      itemToDelete.value = {
        ...item,
        warehouse_name: getWarehouseLabel(item.warehouse_id),
        created_by_name: item.created_by_name || getUserName(item.created_by),
        updated_by_name: item.updated_by_name || getUserName(item.updated_by) || getUserName(item.created_by)
      };
      showDeleteConfirm.value = true;
      showActionMenu.value = null;
    };
    
    const confirmDelete = async () => {
      try {
        deleteLoading.value = true;
        await store.dispatch('deleteItem', itemToDelete.value.id);
        
        store.dispatch('showNotification', {
          type: 'success',
          message: 'تم حذف الصنف بنجاح!'
        });
        
        if (showDetailsModal.value && selectedItem.value?.id === itemToDelete.value.id) {
          closeDetailsModal();
        }
        
        if (searchTerm.value.trim()) {
          await handleLiveSearch();
        }
        
        showDeleteConfirm.value = false;
        itemToDelete.value = null;
        
      } catch (error) {
        console.error('❌ Error deleting item:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في حذف الصنف'
        });
      } finally {
        deleteLoading.value = false;
      }
    };
    
    const handleItemSaved = async () => {
      showAddModal.value = false;
      
      if (searchTerm.value.trim()) {
        await handleLiveSearch();
      }
      
      store.dispatch('showNotification', {
        type: 'success',
        message: 'تم إضافة الصنف بنجاح!'
      });
    };
    
    const handleItemUpdated = async () => {
      showEditModal.value = false;
      selectedItemForEdit.value = null;
      
      if (searchTerm.value.trim()) {
        await handleLiveSearch();
      }
      
      store.dispatch('showNotification', {
        type: 'success',
        message: 'تم تحديث الصنف بنجاح!'
      });
    };
    
    const handleTransferSuccess = async () => {
      showTransferModal.value = false;
      selectedItemForTransfer.value = null;
      
      if (searchTerm.value.trim()) {
        await handleLiveSearch();
      }
      
      store.dispatch('showNotification', {
        type: 'success',
        message: 'تم نقل الصنف بنجاح!'
      });
    };
    
    const handleDispatchSuccess = async () => {
      showDispatchModal.value = false;
      selectedItemForDispatch.value = null;
      
      if (searchTerm.value.trim()) {
        await handleLiveSearch();
      }
      
      store.dispatch('showNotification', {
        type: 'success',
        message: 'تم صرف الصنف بنجاح!'
      });
    };
    
    // ============================================
    // VIRTUAL SCROLLING HANDLERS (UNCHANGED)
    // ============================================
    const onScroll = () => {
      if (!scrollContainer.value) return;
      
      const now = Date.now();
      if (now - lastScrollTime.value < SCROLL_THROTTLE_DELAY) {
        return;
      }
      
      lastScrollTime.value = now;
      
      if (scrollThrottle.value) {
        cancelAnimationFrame(scrollThrottle.value);
      }
      
      scrollThrottle.value = requestAnimationFrame(() => {
        const scrollTop = scrollContainer.value.scrollTop;
        const rowHeight = 80;
        const newStartIndex = Math.floor(scrollTop / rowHeight);
        
        if (Math.abs(newStartIndex - visibleStartIndex.value) > scrollBuffer / 2) {
          visibleStartIndex.value = newStartIndex;
        }
        
        // Load more when near bottom (only if not in live search mode)
        if (!useLiveSearch.value) {
          const scrollBottom = scrollContainer.value.scrollHeight - scrollTop - scrollContainer.value.clientHeight;
          if (scrollBottom < 500 && hasMore.value && !isFetchingMore.value && inventoryLoaded.value) {
            loadMoreItems();
          }
        }
      });
    };
    
    const onMobileScroll = () => {
      if (!mobileScrollContainer.value) return;
      
      const now = Date.now();
      if (now - lastScrollTime.value < SCROLL_THROTTLE_DELAY) {
        return;
      }
      
      lastScrollTime.value = now;
      
      requestAnimationFrame(() => {
        const scrollTop = mobileScrollContainer.value.scrollTop;
        const rowHeight = 120;
        const newStartIndex = Math.floor(scrollTop / rowHeight);
        
        if (Math.abs(newStartIndex - mobileVisibleStartIndex.value) > scrollBuffer / 2) {
          mobileVisibleStartIndex.value = newStartIndex;
        }
        
        // Load more when near bottom (only if not in live search mode)
        if (!useLiveSearch.value) {
          const scrollBottom = mobileScrollContainer.value.scrollHeight - scrollTop - mobileScrollContainer.value.clientHeight;
          if (scrollBottom < 500 && hasMore.value && !isFetchingMore.value && inventoryLoaded.value) {
            loadMoreItems();
          }
        }
      });
    };
    
    // ============================================
    // LIFECYCLE HOOKS - CORRECTED
    // ============================================
    onMounted(() => {
      // Set initial loading
      loading.value = true;
      
      // Load initial data
      store.dispatch('loadAllInventory').then(() => {
        isDataFresh.value = true;
        lastUpdate.value = Date.now();
        
        // Setup real-time updates
        if (store.state.realtimeMode) {
          store.dispatch('setupRealtimeUpdatesForInventory');
        }
        
        // Reset scroll positions
        visibleStartIndex.value = 0;
        mobileVisibleStartIndex.value = 0;
        
        // Load users if admin
        if (userRole.value === 'superadmin') {
          store.dispatch('loadAllUsers');
        }
        
      }).catch(error => {
        console.error('❌ Error loading inventory:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تحميل البيانات'
        });
      }).finally(() => {
        loading.value = false;
      });
      
      // Load warehouses
      if (allWarehouses.value.length === 0) {
        store.dispatch('loadWarehousesEnhanced');
      }
      
      // Auto-select warehouse if only one accessible
      if (accessibleWarehouses.value.length === 1) {
        selectedWarehouse.value = accessibleWarehouses.value[0].id;
        store.dispatch('setWarehouseFilter', selectedWarehouse.value);
      }
      
      // Show add modal if route is AddInventory
      if (route.name === 'AddInventory') {
        showAddModal.value = true;
      }
      
      // Setup scroll listeners
      nextTick(() => {
        if (scrollContainer.value) {
          scrollContainer.value.addEventListener('scroll', onScroll, { passive: true });
        }
        if (mobileScrollContainer.value) {
          mobileScrollContainer.value.addEventListener('scroll', onMobileScroll, { passive: true });
        }
      });
    });
    
    onUnmounted(() => {
      if (scrollContainer.value) {
        scrollContainer.value.removeEventListener('scroll', onScroll);
      }
      
      if (mobileScrollContainer.value) {
        mobileScrollContainer.value.removeEventListener('scroll', onMobileScroll);
      }
      
      if (scrollThrottle.value) {
        cancelAnimationFrame(scrollThrottle.value);
      }
      
      // Clear store listeners
      store.commit('CLEAR_REALTIME_LISTENERS');
    });
    
    // ============================================
    // WATCHERS - CORRECTED
    // ============================================
    watch([searchTerm, statusFilter], () => {
      handleFilterChange();
    });
    
    watch(selectedWarehouse, () => {
      handleWarehouseChange();
    });
    
    // Watch for store search results changes
    watch(() => store.state.search.results, () => {
      visibleStartIndex.value = 0;
      mobileVisibleStartIndex.value = 0;
    });
    
    // ============================================
    // RETURN ALL PROPERTIES
    // ============================================
    return {
      // State
      loading,
      showAddModal,
      showEditModal,
      showTransferModal,
      showDispatchModal,
      showDetailsModal,
      showDeleteConfirm,
      searchTerm,
      statusFilter,
      selectedWarehouse,
      selectedItemForEdit,
      selectedItemForTransfer,
      selectedItemForDispatch,
      selectedItem,
      itemToDelete,
      exporting,
      deleteLoading,
      refreshing,
      exportProgress,
      
      // Mobile UI State
      showFilters,
      
      // UI State
      showActionMenu,
      lastUpdate,
      isDataFresh,
      
      // Refs
      scrollContainer,
      mobileScrollContainer,
      
      // Computed
      userRole,
      userProfile,
      displayedItems,
      visibleItems,
      mobileVisibleItems,
      currentUserInfo,
      accessibleWarehouses,
      canAddItem,
      showActions,
      readonly,
      inventoryLoading,
      hasMore,
      isFetchingMore,
      totalLoaded,
      inventoryLoaded,
      
      // Search state
      useLiveSearch,
      isLiveSearching,
      liveSearchResults,
      
      // Stats
      totalQuantity,
      lowStockCount,
      warehouseCount,
      hasActiveFilters,
      activeFilterCount,
      
      // Helper Methods
      formatNumber,
      getWarehouseLabel,
      getStatusLabel,
      getStockStatus,
      getStockStatusClass,
      getQuantityClass,
      getColorHex,
      formatDate,
      formatRelativeTime,
      formatTime,
      getPlaceholderImage,
      handleImageError,
      getLastActionUser,
      
      // Excel Export
      exportToExcel,
      
      // Permission Methods
      canEditItem,
      canTransferItem,
      canDispatchItem,
      canDeleteItem,
      
      // Action Methods
      handleFilterChange,
      handleWarehouseChange,
      handleLiveSearch,
      resetToNormalView,
      clearAllFilters,
      refreshData,
      loadMoreItems,
      toggleActionMenu,
      showItemDetails,
      closeDetailsModal,
      handleTransfer,
      handleDispatch,
      handleEdit,
      handleDelete,
      confirmDelete,
      handleItemSaved,
      handleItemUpdated,
      handleTransferSuccess,
      handleDispatchSuccess,
      
      // Virtual scrolling methods
      onScroll,
      onMobileScroll
    };
  }
};
</script>

<style scoped>
/* Performance optimized styles */
table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}
/* Static header styling */
thead {
  position: sticky;
  top: 0;
  z-index: 20;
  background-color: #f9fafb;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.dark thead {
  background-color: rgba(55, 65, 81, 0.95);
}
/* Reduced animations */
.transition-colors {
  transition-property: background-color, border-color, color;
  transition-duration: 200ms;
}
.transition-all {
  transition-property: all;
  transition-duration: 200ms;
}
/* Optimized hover states */
.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}
.dark .hover\:bg-gray-700\/50:hover {
  background-color: rgba(55, 65, 81, 0.5);
}
/* Scrollbar optimization */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
  -webkit-overflow-scrolling: touch;
}
.overflow-x-auto::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
.dark .overflow-x-auto::-webkit-scrollbar-track {
  background: #374151;
}
.dark .overflow-x-auto::-webkit-scrollbar-thumb {
  background: #4b5563;
}
.dark .overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
/* Image optimization */
img {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  content-visibility: auto;
}
/* Mobile touch targets */
@media (max-width: 768px) {
  button {
    min-height: 40px;
  }
 
  input, select, textarea {
    font-size: 16px; /* Prevent iOS zoom */
  }
 
  /* Make sure text doesn't overflow */
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
 
  /* Better virtual scrolling performance on mobile */
  .overflow-y-auto {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
 
  /* Compact mobile layout */
  .grid-cols-2 > * {
    padding: 0.5rem;
  }
 
  /* Responsive text sizes */
  .text-xs {
    font-size: 0.7rem;
  }
 
  .text-sm {
    font-size: 0.8rem;
  }
 
  /* Adjust spacing for mobile */
  .gap-2 {
    gap: 0.5rem;
  }
 
  .gap-3 {
    gap: 0.75rem;
  }
 
  .p-3 {
    padding: 0.75rem;
  }
 
  /* Better touch feedback */
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
/* Table cell alignment fix */
.whitespace-nowrap {
  white-space: nowrap;
}
/* Ensure text doesn't overflow in table cells */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* Modal z-index fix */
.fixed {
  isolation: isolate;
}
/* Virtual scrolling optimization */
.virtual-scroll-container {
  will-change: transform;
  contain: content;
}
/* Optimize paint and composite layers */
tbody tr {
  will-change: transform, opacity;
  backface-visibility: hidden;
}
/* Loading animation */
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
/* Pulse animation */
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
/* Ensure smooth scrolling on the entire page */
.min-h-screen {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
/* Better touch feedback for mobile */
@media (max-width: 768px) {
  .active\:scale-95:active {
    transform: scale(0.95);
  }
 
  .hover\:scale-110:hover {
    transform: scale(1.1);
  }
 
  /* Compact card layout */
  .max-w-\[100px\] {
    max-width: 100px;
  }
 
  .max-w-\[120px\] {
    max-width: 120px;
  }
 
  .max-w-\[180px\] {
    max-width: 180px;
  }
}
/* Dark mode optimizations */
.dark .border-gray-200 {
  border-color: #374151;
}
.dark .bg-gray-50 {
  background-color: rgba(17, 24, 39, 0.5);
}
/* Clickable cursor */
.cursor-pointer {
  cursor: pointer;
}
/* Smooth transitions for hover effects */
.group-hover\:scale-105 {
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
/* Memory optimization */
* {
  -webkit-tap-highlight-color: transparent;
}
/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
 
  table {
    border-collapse: collapse;
  }
 
  th, td {
    border: 1px solid #ddd;
  }
}
/* Optimize for low-end devices */
@media (max-width: 768px) and (max-device-width: 1024px) {
  /* Add active state for mobile buttons */
  .active\:scale-95:active {
    transform: scale(0.95);
  }
 
  /* Reduce animations on mobile */
  .transition-colors {
    transition-duration: 150ms;
  }
 
  /* Optimize images for mobile */
  img {
    max-width: 100%;
    height: auto;
  }
}
/* Fix modal scrolling on mobile */
@media (max-width: 768px) {
  /* Prevent body scroll when modal is open */
  body.modal-open {
    overflow: hidden;
    position: fixed;
    width: 100%;
    height: 100%;
  }
 
  /* Improve virtual scrolling container height */
  [style*="max-height: calc(100vh - 320px)"] {
    max-height: calc(100vh - 280px) !important;
  }
}
/* Ensure proper spacing in mobile cards */
.space-y-1 > * + * {
  margin-top: 0.25rem;
}
.space-y-2 > * + * {
  margin-top: 0.5rem;
}
/* Performance warning for large datasets */
@media (max-width: 768px) {
  .performance-warning {
    display: none; /* Hide on mobile if needed */
  }
}
/* Optimize dropdown menus */
.absolute {
  z-index: 9999;
}
/* Better focus states for accessibility */
button:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
/* Improve virtual scrolling performance */
[style*="transform: translateY"] {
  will-change: transform;
}
/* Responsive utility classes */
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
}
/* Rotate transition for filters */
.rotate-180 {
  transform: rotate(180deg);
}
/* Compact mobile filters */
@media (max-width: 768px) {
  .order-1 {
    order: 1;
  }
 
  .order-2 {
    order: 2;
  }
 
  .order-3 {
    order: 3;
  }
 
  /* Adjust filter select height */
  select {
    min-height: 42px;
  }
 
  /* Compact buttons */
  button {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}
/* Virtual scrolling specific styles */
[style*="transform: translateY"] {
  will-change: transform;
  contain: layout style paint;
}
/* Optimize virtual scrolling rows */
tbody tr {
  contain-intrinsic-size: 80px;
  content-visibility: auto;
}
/* Mobile card virtualization */
.lg\:hidden > div > div > div {
  contain-intrinsic-size: 120px;
  content-visibility: auto;
}
/* Smooth scroll behavior */
.overflow-y-auto {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
/* Search info styling */
.text-yellow-600 {
  color: #d97706;
}
.dark .text-yellow-400 {
  color: #fbbf24;
}
/* Live search indicator */
.text-blue-600 {
  color: #2563eb;
}
.dark .text-blue-400 {
  color: #60a5fa;
}
</style>

