<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Search Status Indicator -->
    <div v-if="searchTerm && searchTerm.length >= 2" class="fixed top-4 right-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-2">
          <div v-if="isLiveSearching" class="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span class="text-sm">جاري البحث...</span>
          </div>
          <div v-else-if="searchResults.length > 0" class="flex items-center gap-2 text-green-600 dark:text-green-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-sm">تم العثور على {{ searchResults.length }} نتيجة</span>
            <span v-if="showDebug" class="text-xs text-gray-500">({{ cacheStatus }})</span>
          </div>
          <div v-else class="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-sm">لم يتم العثور على نتائج</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="max-w-full mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-6">
      <!-- Page Header -->
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
            <!-- User and Warehouse Info -->
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
              <!-- Search Debug Info -->
              <span v-if="searchTerm && searchTerm.length >= 2" class="flex items-center gap-1 text-xs">
                <span :class="{
                  'text-green-600 dark:text-green-400': searchResults.length > 0,
                  'text-yellow-600 dark:text-yellow-400': searchResults.length === 0
                }">
                  {{ searchResults.length }} نتيجة بحث
                </span>
                <span v-if="showDebug" class="text-gray-500">• {{ cacheStatus }}</span>
              </span>
            </div>
            <!-- Mobile Description -->
            <p class="text-xs text-gray-600 dark:text-gray-400 block sm:hidden">
              إدارة المخزون
            </p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
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
            v-if="hasMore && !loading && !isSearchMode && (displayedItems || []).length > 0"
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

          <!-- Debug Search Button -->
          <button
            v-if="showDebug"
            @click="forceRefreshSearch"
            :disabled="isLiveSearching"
            class="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors duration-200 disabled:opacity-50 text-sm sm:text-base"
          >
            <svg class="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
            </svg>
            <span class="text-xs sm:text-sm">تجديد البحث</span>
          </button>

          <!-- Debug Toggle Button -->
          <button
            @click="showDebug = !showDebug"
            :class="{
              'bg-purple-600 dark:bg-purple-700 text-white': showDebug,
              'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300': !showDebug
            }"
            class="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-purple-600 dark:hover:bg-purple-600 hover:text-white transition-colors duration-200 text-sm sm:text-base"
            title="عرض معلومات التصحيح"
          >
            <svg class="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
            </svg>
            <span class="text-xs sm:text-sm">{{ showDebug ? 'إخفاء التفاصيل' : 'تفاصيل البحث' }}</span>
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
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

      <!-- FILTERS AND SEARCH SECTION -->
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

        <!-- Filters and Search Content -->
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
                    :placeholder="`ابحث بـ${searchableFields.map(f => arabicFieldLabels[f] || f).join('، ')}...`"
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
                    @click="clearSearch"
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
                    جاري البحث في جميع الأصناف...
                  </div>
                  <div v-else-if="searchTerm.length > 0 && searchTerm.length < 2" class="absolute left-0 right-0 -bottom-6 text-xs text-yellow-600 dark:text-yellow-400">
                    ⓘ اكتب حرفين على الأقل للبحث
                  </div>
                  <div v-else-if="searchResults.length > 0" class="absolute left-0 right-0 -bottom-6 text-xs text-green-600 dark:text-green-400">
                    ✓ تم العثور على {{ searchResults.length }} نتيجة في جميع المخازن
                  </div>
                </div>
              </div>
            </div>

            <!-- Enhanced Search Information -->
            <div v-if="searchTerm && searchTerm.length >= 2" class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <!-- Search Tips -->
                <div class="text-xs text-blue-700 dark:text-blue-300">
                  <span class="font-semibold">نصائح البحث:</span>
                  <ul class="mt-1 space-y-1">
                    <li class="flex items-center gap-1">
                      <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {{ searchTips }}
                    </li>
                    <li class="flex items-center gap-1">
                      <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      البحث في جميع المخازن
                    </li>
                    <li v-if="normalizedSearchTerm !== searchTerm.toLowerCase()" class="flex items-center gap-1">
                      <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      النص المعياري: "{{ normalizedSearchTerm }}"
                    </li>
                  </ul>
                </div>
                
                <!-- Search Performance Stats -->
                <div v-if="showDebug" class="text-xs">
                  <span class="font-semibold text-purple-600 dark:text-purple-400">أداء البحث:</span>
                  <ul class="mt-1 space-y-1 text-gray-600 dark:text-gray-400">
                    <li class="flex justify-between">
                      <span>متوسط السرعة:</span>
                      <span class="font-mono">{{ searchStats.avgResponseTime }}ms</span>
                    </li>
                    <li class="flex justify-between">
                      <span>نسبة الكاش:</span>
                      <span class="font-mono">{{ searchStats.cacheHitRate }}%</span>
                    </li>
                    <li class="flex justify-between">
                      <span>حالة البحث:</span>
                      <span :class="{
                        'text-green-600 dark:text-green-400': cacheStatus === 'نتائج مخزنة',
                        'text-blue-600 dark:text-blue-400': cacheStatus === 'بحث مباشر'
                      }" class="font-semibold">
                        {{ cacheStatus }}
                      </span>
                    </li>
                    <li class="flex justify-between">
                      <span>عدد عمليات البحث:</span>
                      <span class="font-mono">{{ searchStats.totalSearches }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Active Filters -->
            <div v-if="hasActiveFilters" class="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-yellow-800 dark:text-yellow-300">الفلاتر النشطة:</span>
                <button
                  @click="clearAllFilters"
                  class="text-xs text-yellow-700 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 underline flex items-center gap-1"
                >
                  مسح الكل
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <div class="flex flex-wrap gap-2 mt-2">
                <!-- Warehouse Filter Badge -->
                <span v-if="selectedWarehouse" class="inline-flex items-center gap-1 px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-300 rounded-full">
                  مخزن: {{ getWarehouseLabel(selectedWarehouse) }}
                  <button @click="selectedWarehouse = ''" class="hover:text-yellow-900 dark:hover:text-yellow-100">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </span>
                <!-- Status Filter Badge -->
                <span v-if="statusFilter" class="inline-flex items-center gap-1 px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-300 rounded-full">
                  حالة: {{ getStatusLabel(statusFilter) }}
                  <button @click="statusFilter = ''" class="hover:text-yellow-900 dark:hover:text-yellow-100">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </span>
                <!-- Search Filter Badge -->
                <span v-if="searchTerm && searchTerm.length >= 2" class="inline-flex items-center gap-1 px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-300 rounded-full">
                  بحث: "{{ searchTerm }}"
                  <button @click="clearSearch" class="hover:text-yellow-900 dark:hover:text-yellow-100">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Table Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Table Header with Results Summary -->
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h2 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">قائمة الأصناف</h2>
            <!-- Loading Indicator -->
            <div v-if="loading || inventoryLoading" class="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs">
              <svg class="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              جاري التحميل...
            </div>
          </div>
          <!-- Results Summary -->
          <div class="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <span>{{ formatNumber((displayedItems || []).length) }} نتيجة</span>
            <span v-if="searchTerm && searchTerm.length >= 2 && searchResults.length > 0" class="text-green-600 dark:text-green-400">
              ✓ ({{ searchResults.length }} نتيجة بحث)
            </span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && (displayedItems || []).length === 0" class="p-8 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
          </div>
          <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">
            {{ searchTerm && searchTerm.length >= 2 ? 'لم يتم العثور على نتائج' : 'لا توجد أصناف' }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
            {{ searchTerm && searchTerm.length >= 2 ? 'جرب تغيير كلمات البحث أو الفلاتر' : 'ابدأ بإضافة أصناف جديدة إلى المخزون' }}
          </p>
          <button
            v-if="canAddItem && showActions && !readonly"
            @click="showAddModal = true"
            class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-colors duration-200 text-sm"
          >
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            إضافة صنف جديد
          </button>
        </div>

        <!-- Loading Skeleton -->
        <div v-else-if="loading && (displayedItems || []).length === 0" class="p-4 space-y-3">
          <div class="animate-pulse flex space-x-4">
            <div class="flex-1 space-y-3">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>

        <!-- Data Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الكود
                </th>
                <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الصنف
                </th>
                <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  المخزن
                </th>
                <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الكمية المتبقية
                </th>
                <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الحالة
                </th>
                <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  آخر تحديث
                </th>
                <th v-if="showActions" scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="item in displayedItems" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                <td class="px-4 py-3 whitespace-nowrap text-xs font-medium text-gray-900 dark:text-white">
                  {{ item.code || '--' }}
                </td>
                <td class="px-4 py-3 text-xs text-gray-900 dark:text-white">
                  <div class="font-medium">{{ item.name || '--' }}</div>
                  <div v-if="item.color" class="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1 mt-1">
                    <span class="w-3 h-3 rounded-full border" :style="{ backgroundColor: getColorHex(item.color) }"></span>
                    {{ item.color }}
                  </div>
                  <div v-if="item.supplier" class="text-gray-500 dark:text-gray-400 text-xs">
                    {{ item.supplier }}
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                  {{ getWarehouseLabel(item.warehouse_id) || '--' }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div :class="getQuantityClass(item.remaining_quantity || 0)" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold">
                    {{ formatNumber(item.remaining_quantity || 0) }}
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span :class="getStockStatusClass(item.remaining_quantity || 0)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                    {{ getStockStatus(item.remaining_quantity || 0) }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                  {{ formatRelativeTime(item.updated_at || item.created_at) }}
                </td>
                <td v-if="showActions" class="px-4 py-3 whitespace-nowrap text-xs font-medium">
                  <div class="flex items-center gap-2 justify-end">
                    <button
                      @click="showItemDetails(item)"
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      title="تفاصيل"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </button>
                    <button
                      v-if="canTransferItem(item) && !readonly"
                      @click="handleTransfer(item)"
                      class="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
                      title="نقل"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                      </svg>
                    </button>
                    <button
                      v-if="canDispatchItem(item) && !readonly"
                      @click="handleDispatch(item)"
                      class="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors"
                      title="صرف"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                    </button>
                    <button
                      v-if="canEditItem(item) && !readonly"
                      @click="handleEdit(item)"
                      class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
                      title="تعديل"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button
                      v-if="canDeleteItem(item)"
                      @click="handleDelete(item)"
                      class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                      title="حذف"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Load More Button at Bottom -->
        <div v-if="hasMore && !loading && !isSearchMode && (displayedItems || []).length > 0" class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-center">
          <button
            @click="loadMoreItems"
            :disabled="loadingMore || isFetchingMore"
            class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <svg v-if="loadingMore || isFetchingMore" class="w-4 h-4 ml-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <svg v-else class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            {{ (loadingMore || isFetchingMore) ? 'جاري التحميل...' : 'تحميل المزيد' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Import Modals -->
    <AddItemModal 
      v-if="showAddModal" 
      @close="showAddModal = false" 
      @saved="handleItemSaved"
    />
    
    <EditItemModal 
      v-if="showEditModal" 
      :item="selectedItemForEdit"
      @close="showEditModal = false" 
      @updated="handleItemUpdated"
    />
    
    <TransferModal 
      v-if="showTransferModal" 
      :item="selectedItemForTransfer"
      @close="showTransferModal = false" 
      @success="handleTransferSuccess"
    />
    
    <DispatchModal 
      v-if="showDispatchModal" 
      :item="selectedItemForDispatch"
      @close="showDispatchModal = false" 
      @success="handleDispatchSuccess"
    />
    
    <ItemDetailsModal 
      v-if="showDetailsModal" 
      :item="selectedItem"
      @close="closeDetailsModal"
      @edit="handleEdit"
      @transfer="handleTransfer"
      @dispatch="handleDispatch"
      @delete="handleDelete"
      :canEdit="canEditItem(selectedItem)"
      :canTransfer="canTransferItem(selectedItem)"
      :canDispatch="canDispatchItem(selectedItem)"
      :canDelete="canDeleteItem(selectedItem)"
      :readonly="readonly"
    />
    
    <ConfirmDeleteModal 
      v-if="showDeleteConfirm" 
      :item="itemToDelete"
      @close="showDeleteConfirm = false" 
      @confirm="confirmDelete"
      :loading="deleteLoading"
    />
  </div>
</template>
<script>
import { ref, computed, onMounted, watch, onUnmounted, nextTick } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { debounce } from 'lodash';
import * as XLSX from 'xlsx';

// Import your modals
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

// Local Arabic normalization function (copied from store logic)
function normalizeArabicText(text) {
  if (!text || typeof text !== 'string') return '';

  // Convert to string and trim
  text = String(text).trim();

  // Normalize Unicode to combine characters
  text = text.normalize('NFC');

  // Remove all diacritics and special characters
  const diacriticsRegex = /[\u064B-\u065F\u0670\u0640\u0652\u0651\u064E\u064F\u064D\u0650\u0657\u0656\u0653\u0654\u0655]/g;
  text = text.replace(diacriticsRegex, '');

  // Comprehensive Arabic character normalization
  const arabicNormalizationMap = {
    // Alif variations
    'إ': 'ا', 'أ': 'ا', 'آ': 'ا', 'ٱ': 'ا', 'ٲ': 'ا', 'ٳ': 'ا',
    // Ya variations
    'ى': 'ي', 'ئ': 'ي', 'ۍ': 'ي', 'ێ': 'ي', 'ې': 'ي', 'ۑ': 'ي',
    // Ta marbuta
    'ة': 'ه',
    // Waw variations
    'ؤ': 'و', 'ۄ': 'و', 'ۅ': 'و', 'ۆ': 'و', 'ۇ': 'و', 'ۈ': 'و', 'ۉ': 'و', 'ۊ': 'و', 'ۋ': 'و',
    // Kaf variations
    'ك': 'ك', 'ڪ': 'ك', 'ګ': 'ك', 'ڬ': 'ك', 'ڭ': 'ك', 'ڮ': 'ك',
    // Hamza variations
    'ء': '', 'ٔ': '', 'ٕ': '', 'ٖ': '', 'ٗ': '',
    // Tatweel (kashida)
    'ـ': '',
    // Persian characters
    'گ': 'ك', 'چ': 'ج', 'پ': 'ب', 'ژ': 'ز',
    // Other Arabic variations
    'ڀ': 'ب', 'ٻ': 'ب', 'ڃ': 'ج', 'ڄ': 'ج', 'څ': 'ج', 'چ': 'ج', 'ڇ': 'ج',
    'ډ': 'د', 'ڊ': 'د', 'ڋ': 'د', 'ڌ': 'د', 'ڍ': 'د', 'ڎ': 'د', 'ڏ': 'د', 'ڐ': 'د',
    'ڑ': 'ر', 'ڒ': 'ر', 'ړ': 'ر', 'ڔ': 'ر', 'ڕ': 'ر', 'ږ': 'ر', 'ڗ': 'ر', 'ژ': 'ر',
    'ڙ': 'ر', 'ښ': 'س', 'ڛ': 'س', 'ڜ': 'س', 'ڝ': 'ص', 'ڞ': 'ص',
    'ڟ': 'ط', 'ڠ': 'ع', 'ڡ': 'ف', 'ڢ': 'ف', 'ڣ': 'ف', 'ڤ': 'ف', 'ڥ': 'ف', 'ڦ': 'ف',
    'ڧ': 'ق', 'ڨ': 'ق', 'ک': 'ك', 'ڪ': 'ك', 'ګ': 'ك', 'ڬ': 'ك', 'ڭ': 'ك', 'ڮ': 'ك',
    'ڰ': 'ل', 'ڱ': 'ل', 'ڲ': 'ل', 'ڳ': 'ل', 'ڴ': 'ل',
    'ڵ': 'ل', 'ڶ': 'ل', 'ڷ': 'ل', 'ڸ': 'ل', 'ڹ': 'ن', 'ں': 'ن', 'ڻ': 'ن', 'ڼ': 'ن',
    'ڽ': 'ن', 'ھ': 'ه', 'ۀ': 'ه', 'ہ': 'ه', 'ۂ': 'ه', 'ۃ': 'ه', 'ۄ': 'و', 'ۅ': 'و',
    'ۆ': 'و', 'ۇ': 'و', 'ۈ': 'و', 'ۉ': 'و', 'ۊ': 'و', 'ۋ': 'و', 'ی': 'ي', 'ۍ': 'ي',
    'ێ': 'ي', 'ې': 'ي', 'ۑ': 'ي'
  };

  // Apply character replacements
  Object.keys(arabicNormalizationMap).forEach(key => {
    const regex = new RegExp(key, 'g');
    text = text.replace(regex, arabicNormalizationMap[key]);
  });

  // Remove any remaining non-Arabic characters (keep spaces and numbers)
  text = text.replace(/[^\u0621-\u064A\u0660-\u0669\u0671-\u06D3\s0-9]/g, '');

  // Remove extra spaces and normalize
  text = text.replace(/\s+/g, ' ').trim().toLowerCase();

  return text;
}

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
    // ============================================
    // VUE STORE & ROUTER SETUP
    // ============================================
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    
    // ============================================
    // STATE MANAGEMENT
    // ============================================
    
    // Loading States
    const loading = ref(false);
    const loadingMore = ref(false);
    const refreshing = ref(false);
    const exporting = ref(false);
    const deleteLoading = ref(false);
    
    // Modal States
    const showAddModal = ref(false);
    const showEditModal = ref(false);
    const showTransferModal = ref(false);
    const showDispatchModal = ref(false);
    const showDetailsModal = ref(false);
    const showDeleteConfirm = ref(false);
    
    // Item States
    const selectedItemForEdit = ref(null);
    const selectedItemForTransfer = ref(null);
    const selectedItemForDispatch = ref(null);
    const selectedItem = ref(null);
    const itemToDelete = ref(null);
    
    // UI States
    const showFilters = ref(false);
    const showActionMenu = ref(null);
    const error = ref('');
    const exportProgress = ref('');
    
    // Filter States
    const searchTerm = ref('');
    const statusFilter = ref('');
    const selectedWarehouse = ref('');
    
    // Search & Performance
    const useLiveSearch = ref(true);
    const showDebug = ref(false);
    
    // Virtual Scrolling
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
    
    // UI Performance
    const lastUpdate = ref(Date.now());
    const isDataFresh = ref(false);
    
    // ============================================
    // STORE COMPUTED PROPERTIES WITH ENHANCEMENTS
    // ============================================
    
    // User & Auth
    const user = computed(() => store.state.user);
    const userProfile = computed(() => store.state.userProfile);
    const userRole = computed(() => userProfile.value?.role || '');
    
    // Search Results from Store
    const searchResults = computed(() => store.state.search?.results || []);
    const isLiveSearching = computed(() => store.state.search?.loading || false);
    const searchQuery = computed(() => store.state.search?.query || '');
    
    // Inventory & Filtering
    const allInventory = computed(() => store.state.inventory || []);
    const inventoryLoading = computed(() => store.state.inventoryLoading);
    const inventoryLoaded = computed(() => store.state.inventoryLoaded);
    
    // Apply local warehouse filter to inventory
    const filteredInventory = computed(() => {
      let items = allInventory.value;
      
      if (selectedWarehouse.value) {
        items = items.filter(item => item.warehouse_id === selectedWarehouse.value);
      }
      
      // Apply status filter
      if (statusFilter.value) {
        items = items.filter(item => {
          const quantity = item.remaining_quantity || 0;
          if (statusFilter.value === 'in_stock') return quantity >= 10;
          if (statusFilter.value === 'low_stock') return quantity > 0 && quantity < 10;
          if (statusFilter.value === 'out_of_stock') return quantity === 0;
          return true;
        });
      }
      
      return items;
    });
    
    // Search Mode Detection
    const isSearchMode = computed(() => {
      return searchTerm.value && searchTerm.value.length >= 2 && searchResults.value.length > 0;
    });
    
    // Final Displayed Items (Search results OR filtered inventory)
    const displayedItems = computed(() => {
      return isSearchMode.value ? searchResults.value : filteredInventory.value;
    });
    
    // Warehouses
    const accessibleWarehouses = computed(() => store.getters.accessibleWarehouses || []);
    const allWarehouses = computed(() => store.getters.warehouses || []);
    const allUsers = computed(() => store.state.allUsers || []);
    
    // Pagination
    const hasMore = computed(() => store.getters.hasMore);
    const isFetchingMore = computed(() => store.state.pagination?.isFetching || false);
    const totalLoaded = computed(() => store.state.pagination?.totalLoaded || 0);
    
    // ============================================
    // ENHANCED STORE INTEGRATION - NEW COMPUTED PROPERTIES
    // ============================================
    
    // Arabic normalization
    const normalizedSearchTerm = computed(() => 
      searchTerm.value ? normalizeArabicText(searchTerm.value) : ''
    );
    
    // Arabic field labels from store
    const arabicFieldLabels = computed(() => {
      const mappings = store.state.fieldMappings?.englishToArabic || {};
      return Object.entries(mappings).reduce((acc, [en, ar]) => {
        acc[en] = ar;
        return acc;
      }, {});
    });
    
    // Searchable fields from store mappings
    const searchableFields = computed(() => {
      const arabicToEnglish = store.state.fieldMappings?.arabicToEnglish || {};
      const fields = Object.values(arabicToEnglish).filter(field => 
        ['name', 'code', 'color', 'supplier', 'item_location'].includes(field)
      );
      // Default fallback
      return fields.length > 0 ? fields : ['name', 'code', 'color', 'supplier', 'item_location'];
    });
    
    // Search performance stats
    const searchPerformance = computed(() => store.state.searchPerformance || {
      searches: 0,
      avgResponseTime: 0,
      cacheHitRate: 0,
      successRate: 1,
      lastSearchDuration: 0
    });
    
    // Search cache status
    const cacheStatus = computed(() => {
      if (!searchTerm.value || searchTerm.value.length < 2) return 'غير نشط';
      return store.state.search.source === 'cache' ? 'نتائج مخزنة' : 'بحث مباشر';
    });
    
    // Search statistics with Arabic field info
    const searchStats = computed(() => ({
      avgResponseTime: searchPerformance.value?.avgResponseTime?.toFixed(2) || '0',
      cacheHitRate: ((searchPerformance.value?.cacheHitRate || 0) * 100).toFixed(0),
      totalSearches: searchPerformance.value?.searches || 0,
      lastSearchSource: store.state.search.source || 'none',
      lastSearchTime: store.state.search.timestamp,
      cacheStatus: cacheStatus.value,
      normalizedTerm: normalizedSearchTerm.value
    }));
    
    // Search tips with Arabic field names
    const searchTips = computed(() => {
      if (!searchableFields.value.length) return 'البحث في جميع الحقول';
      
      const fieldsInArabic = searchableFields.value.map(field => 
        arabicFieldLabels.value[field] || field
      ).join('، ');
      
      return `البحث يشمل: ${fieldsInArabic}`;
    });
    
    // Real-time search availability
    const realTimeSearchAvailable = computed(() => 
      searchTerm.value && 
      searchTerm.value.length >= 2 &&
      searchResults.value.length > 0 && 
      store.state.search.source === 'firebase'
    );
    
    // ============================================
    // COMPUTED STATISTICS
    // ============================================
    
    // Current User Info
    const currentUserInfo = computed(() => {
      if (userProfile.value?.name) return userProfile.value.name;
      if (user.value?.displayName) return user.value.displayName;
      if (userProfile.value?.email) return userProfile.value.email.split('@')[0];
      if (user.value?.email) return user.value.email.split('@')[0];
      return 'مستخدم النظام';
    });
    
    // Quantity Statistics
    const totalQuantity = computed(() => {
      return displayedItems.value.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0);
    });
    
    const lowStockCount = computed(() => {
      return displayedItems.value.filter(item => {
        const quantity = item.remaining_quantity || 0;
        return quantity > 0 && quantity < 10;
      }).length;
    });
    
    const warehouseCount = computed(() => {
      const warehouses = new Set(displayedItems.value.map(item => item.warehouse_id));
      return warehouses.size;
    });
    
    // Filter Status
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
    
    // Permissions
    const canAddItem = computed(() => {
      return userRole.value === 'superadmin' ||
             (userRole.value === 'warehouse_manager' && 
              store.getters.allowedWarehouses?.length > 0);
    });
    
    const showActions = computed(() => userRole.value !== 'viewer');
    const readonly = computed(() => userRole.value === 'viewer');
    
    // ============================================
    // VIRTUAL SCROLLING COMPUTED PROPERTIES
    // ============================================
    
    const visibleItems = computed(() => {
      const start = Math.max(0, visibleStartIndex.value - scrollBuffer);
      const end = Math.min(displayedItems.value.length, visibleStartIndex.value + visibleItemCount + scrollBuffer);
      return displayedItems.value.slice(start, end);
    });
    
    const mobileVisibleItems = computed(() => {
      const start = Math.max(0, mobileVisibleStartIndex.value - scrollBuffer);
      const end = Math.min(displayedItems.value.length, mobileVisibleStartIndex.value + mobileVisibleItemCount + scrollBuffer);
      return displayedItems.value.slice(start, end);
    });
    
    // ============================================
    // ENHANCED SEARCH HANDLER WITH STORE TRACKING
    // ============================================
    
    const handleLiveSearch = debounce(async () => {
      const term = searchTerm.value.trim();
      
      if (term.length === 0) {
        await store.dispatch('clearSearch');
        resetScrollPositions();
        return;
      }
      
      // Minimum 2 characters for search
      if (term.length < 2) {
        await store.dispatch('clearSearch');
        return;
      }
      
      try {
        console.log(`🚀 [ENHANCED STORE SEARCH] Triggering store search for: "${term}"`);
        
        const searchStartTime = performance.now();
        
        // Use store's SPARK search system
        const results = await store.dispatch('searchInventorySpark', {
          searchQuery: term,
          warehouseId: selectedWarehouse.value || 'all',
          limit: 30,
          strategy: 'parallel'
        });
        
        const duration = performance.now() - searchStartTime;
        
        console.log(`✅ [ENHANCED STORE SEARCH] Completed in ${duration.toFixed(2)}ms: ${results.length} results`);
        
        // Update freshness
        isDataFresh.value = true;
        lastUpdate.value = Date.now();
        
        // Reset scroll positions
        resetScrollPositions();
        
        // Show notification with enhanced info
        if (results.length > 0) {
          const source = store.state.search.source || 'local';
          const sourceText = source === 'cache' ? 'مخزنة' : 
                           source === 'firebase' ? 'مباشرة' : 
                           source === 'local' ? 'محلية' : 'غير معروفة';
          
          store.dispatch('showNotification', {
            type: 'success',
            message: `تم العثور على ${results.length} نتيجة للبحث: "${term}" (مصدر: ${sourceText})`,
            duration: 3000
          });
        } else {
          store.dispatch('showNotification', {
            type: 'info',
            message: 'لم يتم العثور على نتائج للبحث في جميع المخازن',
            duration: 2000
          });
        }
        
      } catch (error) {
        console.error('❌ [ENHANCED STORE SEARCH] Error:', error);
        
        store.dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في البحث. جاري استخدام المخزون المحلي.',
          duration: 5000
        });
        
        // Fallback: Clear store search
        await store.dispatch('clearSearch');
      }
    }, 500);
    
    // ============================================
    // FILTER HANDLERS - INTEGRATED WITH STORE
    // ============================================
    
    const handleWarehouseChange = async () => {
      // Reset scroll positions
      resetScrollPositions();
      
      // If we have a search term, re-run search with new warehouse filter
      if (searchTerm.value.trim() && searchTerm.value.trim().length >= 2) {
        await handleLiveSearch();
      }
    };
    
    const handleFilterChange = () => {
      resetScrollPositions();
    };
    
    const clearSearch = async () => {
      searchTerm.value = '';
      await store.dispatch('clearSearch');
      resetScrollPositions();
    };
    
    const clearWarehouseFilter = async () => {
      selectedWarehouse.value = '';
      resetScrollPositions();
      
      // If we have a search term, re-run search without warehouse filter
      if (searchTerm.value.trim() && searchTerm.value.trim().length >= 2) {
        await handleLiveSearch();
      }
    };
    
    const clearAllFilters = async () => {
      searchTerm.value = '';
      statusFilter.value = '';
      selectedWarehouse.value = '';
      showFilters.value = false;
      
      // Clear store search
      await store.dispatch('clearSearch');
      
      resetScrollPositions();
    };
    
    const resetScrollPositions = () => {
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
    // ENHANCED DATA LOADING METHODS
    // ============================================
    
    const loadInitialData = async () => {
      try {
        loading.value = true;
        
        // Step 1: Load essential data in parallel
        const loadPromises = [
          store.dispatch('loadWarehouses'),
          store.dispatch('loadUsers')
        ];
        
        await Promise.all(loadPromises);
        
        // Step 2: Check for route parameters
        const routeWarehouseId = route.params.warehouseId || route.query.warehouse;
        if (routeWarehouseId) {
          // Verify warehouse is accessible
          const warehouseExists = accessibleWarehouses.value.some(w => w.id === routeWarehouseId);
          if (warehouseExists) {
            selectedWarehouse.value = routeWarehouseId;
          }
        }
        
        // Step 3: Load inventory via store
        console.log('🔄 Loading inventory via store...');
        await store.dispatch('loadAllInventory', { 
          forceRefresh: true
        });
        
        isDataFresh.value = true;
        lastUpdate.value = Date.now();
        
        // Step 4: Initialize virtual scrolling
        await nextTick();
        resetScrollPositions();
        
        // Step 5: Pre-calculate row heights
        setTimeout(() => {
          if (scrollContainer.value) {
            calculateVisibleItems();
          }
          if (mobileScrollContainer.value) {
            calculateMobileVisibleItems();
          }
        }, 100);
        
      } catch (error) {
        console.error('❌ Error in loadInitialData:', error);
        
        error.value = 'فشل تحميل البيانات. الرجاء التحقق من اتصال الإنترنت والمحاولة مرة أخرى.';
        
        store.dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تحميل البيانات. جاري إعادة المحاولة...'
        });
        
        // Auto-retry after 5 seconds
        setTimeout(() => {
          if (!inventoryLoaded.value) {
            loadInitialData();
          }
        }, 5000);
        
      } finally {
        loading.value = false;
      }
    };
    
    const loadMoreItems = async () => {
      // Only load more if not in search mode
      if (isSearchMode.value) {
        return;
      }
      
      if (hasMore.value && !isFetchingMore.value && !loadingMore.value) {
        try {
          loadingMore.value = true;
          console.log('📥 Loading more items via store...');
          
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
        } finally {
          loadingMore.value = false;
        }
      }
    };
    
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
    // ENHANCED ITEM ACTION HANDLERS
    // ============================================
    
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
    
    // Item details
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
    
    // Action handlers
    const toggleActionMenu = (itemId) => {
      showActionMenu.value = showActionMenu.value === itemId ? null : itemId;
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
    
    // Modal success handlers
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
        message: 'تم النقل بين المخازن بنجاح!'
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
        message: 'تم الصرف الخارجي بنجاح!'
      });
    };
    
    // ============================================
    // ENHANCED HELPER FUNCTIONS WITH ARABIC SUPPORT
    // ============================================
    
    // Formatting
    const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num || 0);
    
    const getWarehouseLabel = (warehouseId) => {
      if (!warehouseId) return 'غير معروف';
      return store.getters.getWarehouseLabel ? store.getters.getWarehouseLabel(warehouseId) : warehouseId;
    };
    
    const getUserName = (userId) => {
      if (!userId) return 'نظام';
      if (userId === user.value?.uid) return currentUserInfo.value;
      
      const userObj = allUsers.value.find(u => u.id === userId);
      if (userObj) return userObj.name || userObj.email || userId;
      
      return userId;
    };
    
    const getLastActionUser = (item) => getUserName(item.updated_by || item.created_by);
    
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
    // ENHANCED EXCEL EXPORT WITH ARABIC FIELD NAMES
    // ============================================
    const exportToExcel = async () => {
      if (displayedItems.value.length === 0) {
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
        
        displayedItems.value.forEach((item, index) => {
          exportProgress.value = `جاري تجهير العنصر ${index + 1} من ${displayedItems.value.length}`;
          
          const warehouseId = item.warehouse_id;
          if (!itemsByWarehouse[warehouseId]) {
            itemsByWarehouse[warehouseId] = [];
          }
          
          const createdByName = item.created_by_name || getUserName(item.created_by) || 'غير معروف';
          const updatedByName = item.updated_by_name || getUserName(item.updated_by) || createdByName || 'غير معروف';
          
          // Use Arabic field names from store mappings
          const fieldLabels = arabicFieldLabels.value;
          
          itemsByWarehouse[warehouseId].push({
            [fieldLabels.code || 'الكود']: item.code || '',
            [fieldLabels.name || 'اسم الصنف']: item.name || '',
            [fieldLabels.color || 'اللون']: item.color || '',
            'المخزن': getWarehouseLabel(item.warehouse_id),
            [fieldLabels.item_location || 'مكان التخزين']: item.item_location || '',
            [fieldLabels.supplier || 'المورد']: item.supplier || '',
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
        
        // Add search statistics sheet
        const statsData = [{
          'إجمالي الأصناف': displayedItems.value.length,
          'إجمالي الكمية': totalQuantity.value,
          'الأصناف قليلة المخزون': lowStockCount.value,
          'عدد المخازن': warehouseCount.value,
          'تاريخ التصدير': new Date().toLocaleDateString('ar-EG'),
          'تم التصدير بواسطة': currentUserInfo.value,
          'مصدر البيانات': isSearchMode.value ? 'بحث شامل' : 'بيانات مخزنة',
          'حالة البحث': cacheStatus.value,
          'متوسط سرعة البحث': `${searchStats.value.avgResponseTime}ms`,
          'نسبة استخدام الكاش': `${searchStats.value.cacheHitRate}%`
        }];
        
        const statsWs = XLSX.utils.json_to_sheet(statsData);
        XLSX.utils.book_append_sheet(wb, statsWs, 'الملخص والإحصائيات');
        
        // Add search details if in search mode
        if (isSearchMode.value && searchTerm.value) {
          const searchDetailsData = [{
            'كلمة البحث': searchTerm.value,
            'البحث المعياري': normalizedSearchTerm.value,
            'عدد النتائج': searchResults.value.length,
            'مصدر النتائج': store.state.search.source,
            'الوقت المستغرق': searchPerformance.value.lastSearchDuration?.toFixed(2) + 'ms',
            'تاريخ البحث': formatDate(store.state.search.timestamp),
            'الحقول المستهدفة': searchableFields.value.map(f => arabicFieldLabels.value[f] || f).join(', ')
          }];
          
          const searchWs = XLSX.utils.json_to_sheet(searchDetailsData);
          XLSX.utils.book_append_sheet(wb, searchWs, 'تفاصيل البحث');
        }
        
        // Add data by warehouse
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
          message: `تم تصدير ${displayedItems.value.length} صنف إلى ${Object.keys(itemsByWarehouse).length + 2} صفحة في ملف Excel بنجاح`
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
    // VIRTUAL SCROLLING METHODS
    // ============================================
    
    const calculateVisibleItems = () => {
      if (!scrollContainer.value) return;
      
      const container = scrollContainer.value;
      const scrollTop = container.scrollTop;
      const clientHeight = container.clientHeight;
      
      // Calculate approximate row height
      const rows = container.querySelectorAll('tbody tr');
      let rowHeight = 80; // Default fallback
      
      if (rows.length > 0) {
        const sampleRows = Math.min(5, rows.length);
        let totalHeight = 0;
        for (let i = 0; i < sampleRows; i++) {
          const rect = rows[i].getBoundingClientRect();
          totalHeight += rect.height;
        }
        rowHeight = Math.floor(totalHeight / sampleRows);
      }
      
      // Calculate visible range with buffer
      const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - scrollBuffer);
      const endIndex = Math.min(
        displayedItems.value.length,
        startIndex + Math.ceil(clientHeight / rowHeight) + (scrollBuffer * 2)
      );
      
      // Only update if the change is significant
      const newIndex = Math.max(0, startIndex);
      if (Math.abs(newIndex - visibleStartIndex.value) > scrollBuffer / 2) {
        visibleStartIndex.value = newIndex;
      }
      
      return { startIndex, endIndex, rowHeight };
    };
    
    const onScroll = () => {
      if (!scrollContainer.value) return;
      
      const now = Date.now();
      
      // Throttle scroll events for performance
      if (now - lastScrollTime.value < SCROLL_THROTTLE_DELAY) {
        return;
      }
      lastScrollTime.value = now;
      
      // Clear any existing throttle timeout
      if (scrollThrottle.value) {
        cancelAnimationFrame(scrollThrottle.value);
      }
      
      // Use requestAnimationFrame for smoother performance
      scrollThrottle.value = requestAnimationFrame(() => {
        const container = scrollContainer.value;
        if (!container) return;
        
        // Calculate visible items
        calculateVisibleItems();
        
        // Check if we need to load more items (near bottom 20%)
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const scrollBottom = scrollTop + clientHeight;
        
        // Load more when we're within 3 screen heights from the bottom
        const loadMoreThreshold = scrollHeight - (clientHeight * 3);
        
        if (scrollBottom > loadMoreThreshold && 
            hasMore.value && 
            !isSearchMode.value && 
            !loadingMore.value && 
            !isFetchingMore.value) {
          loadMoreItems();
        }
        
        scrollThrottle.value = null;
      });
    };
    
    const calculateMobileVisibleItems = () => {
      if (!mobileScrollContainer.value) return;
      
      const container = mobileScrollContainer.value;
      const scrollTop = container.scrollTop;
      const clientHeight = container.clientHeight;
      
      // Calculate approximate card height for mobile
      const cards = container.querySelectorAll('div[data-mobile-card]');
      let cardHeight = 120; // Default mobile card height
      
      if (cards.length > 0) {
        const sampleCards = Math.min(3, cards.length);
        let totalHeight = 0;
        for (let i = 0; i < sampleCards; i++) {
          const rect = cards[i].getBoundingClientRect();
          totalHeight += rect.height;
        }
        cardHeight = Math.floor(totalHeight / sampleCards);
      }
      
      // Calculate visible range with buffer
      const startIndex = Math.max(0, Math.floor(scrollTop / cardHeight) - scrollBuffer);
      const endIndex = Math.min(
        displayedItems.value.length,
        startIndex + Math.ceil(clientHeight / cardHeight) + (scrollBuffer * 2)
      );
      
      // Only update if the change is significant
      const newIndex = Math.max(0, startIndex);
      if (Math.abs(newIndex - mobileVisibleStartIndex.value) > scrollBuffer / 2) {
        mobileVisibleStartIndex.value = newIndex;
      }
      
      return { startIndex, endIndex, cardHeight };
    };
    
    const onMobileScroll = () => {
      if (!mobileScrollContainer.value) return;
      
      const now = Date.now();
      
      // Throttle scroll events
      if (now - lastScrollTime.value < SCROLL_THROTTLE_DELAY) {
        return;
      }
      lastScrollTime.value = now;
      
      if (scrollThrottle.value) {
        cancelAnimationFrame(scrollThrottle.value);
      }
      
      scrollThrottle.value = requestAnimationFrame(() => {
        const container = mobileScrollContainer.value;
        if (!container) return;
        
        // Calculate visible items
        calculateMobileVisibleItems();
        
        // Check if we need to load more items
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const scrollBottom = scrollTop + clientHeight;
        
        // Load more when we're within 2 screen heights from the bottom
        const loadMoreThreshold = scrollHeight - (clientHeight * 2);
        
        if (scrollBottom > loadMoreThreshold && 
            hasMore.value && 
            !isSearchMode.value && 
            !loadingMore.value && 
            !isFetchingMore.value) {
          loadMoreItems();
        }
        
        scrollThrottle.value = null;
      });
    };
    
    // ============================================
    // ENHANCED DEBUG METHODS
    // ============================================
    
    const forceRefreshSearch = async () => {
      console.log('🔍 DEBUG: Force refreshing search...');
      await handleLiveSearch.flush();
    };
    
    // ============================================
    // ENHANCED WATCHERS
    // ============================================
    
    // Watch for loading state changes
    watch(inventoryLoading, (newVal) => {
      if (!newVal && inventoryLoaded.value) {
        loading.value = false;
        
        // Update data freshness
        isDataFresh.value = true;
        lastUpdate.value = Date.now();
        
        // Recalculate virtual scrolling after data loads
        nextTick(() => {
          if (scrollContainer.value) {
            calculateVisibleItems();
          }
        });
      }
    });
    
    // Watch for search results from store
    watch(searchResults, (newResults) => {
      if (newResults && newResults.length > 0) {
        console.log(`🔍 Store search results updated: ${newResults.length} items`);
        
        // Mark as fresh search data
        isDataFresh.value = true;
        lastUpdate.value = Date.now();
        
        // Reset scroll positions for search results
        resetScrollPositions();
        
        // Update virtual scrolling for search results
        nextTick(() => {
          if (scrollContainer.value) calculateVisibleItems();
          if (mobileScrollContainer.value) calculateMobileVisibleItems();
        });
      }
    });
    
    // Watch for search query changes
    watch(searchTerm, (newTerm) => {
      if (newTerm && newTerm.length >= 2) {
        // Use store's search system
        handleLiveSearch();
      } else if (!newTerm || newTerm.length === 0) {
        // Clear store search
        store.dispatch('clearSearch');
      }
    });
    
    // Watch for route changes
    watch(() => route.params.warehouseId, (newWarehouseId) => {
      if (newWarehouseId && accessibleWarehouses.value.some(w => w.id === newWarehouseId)) {
        // Clear any existing search when changing warehouses via route
        if (searchTerm.value) {
          clearSearch();
        }
        
        selectedWarehouse.value = newWarehouseId;
      }
    });
    
    // ============================================
    // LIFECYCLE HOOKS
    // ============================================
    
    onMounted(async () => {
      console.log('📱 Inventory Production mounted with ENHANCED STORE INTEGRATION');
      
      // Set up resize observer
      const resizeObserver = new ResizeObserver(() => {
        if (scrollContainer.value) calculateVisibleItems();
        if (mobileScrollContainer.value) calculateMobileVisibleItems();
      });
      
      if (scrollContainer.value) {
        resizeObserver.observe(scrollContainer.value);
      }
      if (mobileScrollContainer.value) {
        resizeObserver.observe(mobileScrollContainer.value);
      }
      
      window.__inventoryResizeObserver = resizeObserver;
      
      // Load initial data
      await loadInitialData();
    });
    
    onUnmounted(() => {
      console.log('🧹 Cleaning up Inventory Production');
      
      // Cleanup resize observer
      if (window.__inventoryResizeObserver) {
        window.__inventoryResizeObserver.disconnect();
        delete window.__inventoryResizeObserver;
      }
      
      // Cleanup scroll throttle
      if (scrollThrottle.value) {
        cancelAnimationFrame(scrollThrottle.value);
      }
      
      // Cleanup debounced functions
      handleLiveSearch.cancel();
      
      // Reset store state
      store.dispatch('clearSearch');
    });
    
    // ============================================
    // RETURN ALL REACTIVE VALUES AND METHODS
    // ============================================
    
    return {
      // State
      loading,
      loadingMore,
      showAddModal,
      showEditModal,
      showTransferModal,
      showDispatchModal,
      showDetailsModal,
      showDeleteConfirm,
      selectedItemForEdit,
      selectedItemForTransfer,
      selectedItemForDispatch,
      selectedItem,
      itemToDelete,
      exporting,
      deleteLoading,
      refreshing,
      exportProgress,
      error,
      
      // Local filters
      searchTerm,
      statusFilter,
      selectedWarehouse,
      
      // Mobile UI
      showFilters,
      showActionMenu,
      
      // Search & Performance
      useLiveSearch,
      showDebug,
      
      // Virtual scrolling refs
      scrollContainer,
      mobileScrollContainer,
      
      // Enhanced Store Computed Properties
      arabicFieldLabels,
      searchableFields,
      searchPerformance,
      searchStats,
      cacheStatus,
      searchTips,
      normalizedSearchTerm,
      realTimeSearchAvailable,
      
      // Computed
      userRole,
      userProfile,
      displayedItems,
      accessibleWarehouses,
      allWarehouses,
      allUsers,
      inventoryLoading,
      inventoryLoaded,
      hasMore,
      isFetchingMore,
      totalLoaded,
      currentUserInfo,
      canAddItem,
      showActions,
      readonly,
      searchResults,
      isLiveSearching,
      isSearchMode,
      totalQuantity,
      lowStockCount,
      warehouseCount,
      hasActiveFilters,
      activeFilterCount,
      visibleItems,
      mobileVisibleItems,
      
      // Methods
      formatNumber,
      getWarehouseLabel,
      getUserName,
      getLastActionUser,
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
      
      // Filter handlers
      handleLiveSearch,
      handleWarehouseChange,
      handleFilterChange,
      clearSearch,
      clearWarehouseFilter,
      clearAllFilters,
      resetScrollPositions,
      
      // Data loading
      loadMoreItems,
      refreshData,
      
      // Excel export
      exportToExcel,
      
      // UI actions
      toggleActionMenu,
      showItemDetails,
      closeDetailsModal,
      canEditItem,
      canTransferItem,
      canDispatchItem,
      canDeleteItem,
      handleTransfer,
      handleDispatch,
      handleEdit,
      handleDelete,
      confirmDelete,
      handleItemSaved,
      handleItemUpdated,
      handleTransferSuccess,
      handleDispatchSuccess,
      
      // Enhanced debug methods
      forceRefreshSearch,
      
      // Virtual scrolling
      onScroll,
      onMobileScroll,
      
      // Timestamps
      lastUpdate,
      isDataFresh
    };
  }
};
</script>                                                                                                
<style scoped>
/* Enhanced Custom Scrollbar */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 6px;
  margin: 4px;
}

::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 6px;
  border: 2px solid #f1f5f9;
}

::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

::-webkit-scrollbar-thumb:active {
  background: #475569;
}

.dark ::-webkit-scrollbar-track {
  background: #1e293b;
}

.dark ::-webkit-scrollbar-thumb {
  background: #475569;
  border-color: #1e293b;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

.dark ::-webkit-scrollbar-thumb:active {
  background: #94a3b8;
}

/* Smooth Table Transitions */
.table-transition-enter-active,
.table-transition-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.table-transition-enter-from,
.table-transition-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Card Hover Effects */
.hover-card {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.dark .hover-card:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3),
              0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

/* Loading Animations */
@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

.shimmer-effect {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

.dark .shimmer-effect {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0) 100%
  );
}

/* Status Indicators with Animation */
.status-pulse {
  position: relative;
}

.status-pulse::after {
  content: '';
  position: absolute;
  top: 50%;
  left: -12px;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }
  50% {
    opacity: 0.7;
    transform: translateY(-50%) scale(1.2);
  }
}

.status-in-stock::after {
  background-color: #10b981;
  box-shadow: 0 0 0 rgba(16, 185, 129, 0.4);
  animation: pulse 2s infinite,
             glow-green 2s infinite alternate;
}

.status-low-stock::after {
  background-color: #f59e0b;
  box-shadow: 0 0 0 rgba(245, 158, 11, 0.4);
  animation: pulse 2s infinite,
             glow-orange 2s infinite alternate;
}

.status-out-of-stock::after {
  background-color: #ef4444;
  box-shadow: 0 0 0 rgba(239, 68, 68, 0.4);
  animation: pulse 2s infinite,
             glow-red 2s infinite alternate;
}

@keyframes glow-green {
  from { box-shadow: 0 0 0 rgba(16, 185, 129, 0.4); }
  to { box-shadow: 0 0 10px rgba(16, 185, 129, 0.6); }
}

@keyframes glow-orange {
  from { box-shadow: 0 0 0 rgba(245, 158, 11, 0.4); }
  to { box-shadow: 0 0 10px rgba(245, 158, 11, 0.6); }
}

@keyframes glow-red {
  from { box-shadow: 0 0 0 rgba(239, 68, 68, 0.4); }
  to { box-shadow: 0 0 10px rgba(239, 68, 68, 0.6); }
}

/* Responsive Typography */
@media (max-width: 640px) {
  .responsive-text {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  
  .responsive-heading {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
}

/* Touch-friendly Elements */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 0.75rem;
}

.touch-target-sm {
  min-height: 36px;
  min-width: 36px;
  padding: 0.5rem;
}

/* Focus States */
.focus-ring:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.5);
  transition: box-shadow 0.2s ease;
}

.dark .focus-ring:focus {
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.7);
}

/* Print Optimizations */
@media print {
  .print-hidden {
    display: none !important;
  }
  
  .print-only {
    display: block !important;
  }
  
  .print-break-inside-avoid {
    break-inside: avoid;
  }
  
  .print-page-break-before {
    page-break-before: always;
  }
  
  .print-page-break-after {
    page-break-after: always;
  }
  
  .print-table {
    border-collapse: collapse;
    width: 100%;
  }
  
  .print-table th,
  .print-table td {
    border: 1px solid #000;
    padding: 8px;
    text-align: right;
  }
  
  .print-table th {
    background-color: #f3f4f6;
    font-weight: bold;
  }
}

/* Loading Skeleton */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 0.375rem;
}

.dark .skeleton {
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
}

/* Gradient Borders */
.gradient-border {
  position: relative;
  border-radius: 0.75rem;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(to right, #3b82f6, #8b5cf6) border-box;
  border: 2px solid transparent;
}

.dark .gradient-border {
  background: linear-gradient(#1f2937, #1f2937) padding-box,
              linear-gradient(to right, #3b82f6, #8b5cf6) border-box;
}

/* Mobile Optimization */
@media (max-width: 768px) {
  .mobile-scroll-container {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }
  
  .mobile-no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .mobile-no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .mobile-tap-highlight {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
  }
  
  .mobile-tap-highlight:active {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .dark .mobile-tap-highlight:active {
    background-color: rgba(255, 255, 255, 0.05);
  }
}

/* Smooth Transitions */
.smooth-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.smooth-transition-fast {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.smooth-transition-slow {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in-right {
  animation: slideInRight 0.3s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}
</style>