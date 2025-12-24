<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Main content -->
    <div class="max-w-full mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
      <!-- Page Header - Fixed for Mobile -->
      <div class="mb-4">
        <div class="flex flex-col">
          <!-- Top Row: User Info and Actions -->
          <div class="flex items-center justify-between mb-3">
            <!-- User Info -->
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                  {{ currentUserInfo }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  <span v-if="selectedWarehouse" class="flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                    {{ getWarehouseLabel(selectedWarehouse) }}
                  </span>
                  <span v-else>جميع المخازن</span>
                </p>
              </div>
            </div>

            <!-- Last Update and Status -->
            <div class="flex flex-col items-end">
              <div class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <span v-if="isDataFresh" class="flex items-center gap-1">
                  <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  مباشرة
                </span>
                <span v-else class="flex items-center gap-1">
                  <span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  مخزنة
                </span>
                <span>{{ formatTime(lastUpdate) }}</span>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ filteredItems.length }} عنصر
              </p>
            </div>
          </div>

          <!-- Title and Main Actions -->
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">
                المخزون
              </h1>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                إدارة وتتبع جميع الأصناف في النظام
              </p>
            </div>

            <!-- Desktop Action Buttons -->
            <div class="hidden lg:flex flex-wrap gap-2">
              <!-- Export to Excel Button -->
              <button
                v-if="filteredItems.length > 0"
                @click="exportToExcel"
                :disabled="exporting"
                class="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <svg v-if="!exporting" class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <svg v-else class="w-4 h-4 ml-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                {{ exporting ? 'جاري التصدير...' : 'تصدير Excel' }}
              </button>

              <!-- Refresh Button -->
              <button
                @click="refreshData"
                :disabled="refreshing"
                class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <svg v-if="refreshing" class="w-4 h-4 ml-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <svg v-else class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                {{ refreshing ? 'جاري التحديث...' : 'تحديث' }}
              </button>

              <!-- Load More Button -->
              <button
                v-if="hasMore && !loading && !useLiveSearch"
                @click="loadMoreItems"
                :disabled="loadingMore"
                class="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <svg v-if="loadingMore" class="w-4 h-4 ml-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <svg v-else class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                {{ loadingMore ? 'جاري التحميل...' : 'تحميل المزيد' }}
              </button>

              <!-- Add Item Button -->
              <button 
                v-if="canAddItem && showActions && !readonly"
                @click="showAddModal = true"
                class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-colors duration-200 text-sm"
              >
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                إضافة صنف
              </button>
            </div>

            <!-- Mobile Action Buttons (Icons only) -->
            <div class="flex lg:hidden items-center gap-2">
              <button
                v-if="filteredItems.length > 0"
                @click="exportToExcel"
                :disabled="exporting"
                class="p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/30 transition-colors duration-200 disabled:opacity-50"
                title="تصدير Excel"
              >
                <svg v-if="!exporting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>

              <button
                @click="refreshData"
                :disabled="refreshing"
                class="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
                title="تحديث"
              >
                <svg v-if="refreshing" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>

              <button 
                v-if="canAddItem && showActions && !readonly"
                @click="showAddModal = true"
                class="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors duration-200"
                title="إضافة صنف"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 hover:shadow-md transition-shadow duration-200 cursor-default">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center ml-2">
              <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div class="flex-1 text-right">
              <p class="text-xs text-gray-500 dark:text-gray-400">الأصناف</p>
              <p class="text-base font-bold text-gray-900 dark:text-white">{{ formatNumber(filteredItems.length) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 hover:shadow-md transition-shadow duration-200 cursor-default">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center ml-2">
              <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1 text-right">
              <p class="text-xs text-gray-500 dark:text-gray-400">إجمالي الكمية</p>
              <p class="text-base font-bold text-gray-900 dark:text-white">{{ formatNumber(totalQuantity) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 hover:shadow-md transition-shadow duration-200 cursor-default">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center ml-2">
              <svg class="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1 text-right">
              <p class="text-xs text-gray-500 dark:text-gray-400">قليلة المخزون</p>
              <p class="text-base font-bold text-red-600 dark:text-red-400">{{ formatNumber(lowStockCount) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 hover:shadow-md transition-shadow duration-200 cursor-default">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center ml-2">
              <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div class="flex-1 text-right">
              <p class="text-xs text-gray-500 dark:text-gray-400">من المخازن</p>
              <p class="text-base font-bold text-gray-900 dark:text-white">{{ formatNumber(warehouseCount) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Section - Mobile Optimized -->
      <div class="mb-4">
        <!-- Mobile Filters Toggle -->
        <button
          @click="showMobileFilters = !showMobileFilters"
          class="w-full lg:hidden flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-3"
        >
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
            </svg>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">فلاتر البحث</span>
          </div>
          <svg :class="['w-5 h-5 text-gray-400 transition-transform duration-200', showMobileFilters ? 'rotate-180' : '']" 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        <!-- Mobile Filters Content -->
        <div v-if="showMobileFilters" class="lg:hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4 space-y-4">
          <!-- Search Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">بحث سريع</label>
            <div class="relative">
              <input
                type="text"
                v-model="searchTerm"
                @input="handleLiveSearch"
                placeholder="ابحث باسم الصنف، الكود، اللون..."
                class="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 hover:border-yellow-400 transition-colors duration-200 text-sm"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Warehouse Filter -->
          <div v-if="accessibleWarehouses.length > 0">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المخزن</label>
            <select
              v-model="selectedWarehouse"
              @change="handleWarehouseChange"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 hover:border-yellow-400 transition-colors duration-200 text-sm"
            >
              <option value="">جميع المخازن</option>
              <option v-for="warehouse in accessibleWarehouses" :key="warehouse.id" :value="warehouse.id">
                {{ warehouse.name_ar }}
              </option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">حالة المخزون</label>
            <select
              v-model="statusFilter"
              @change="handleFilterChange"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 hover:border-yellow-400 transition-colors duration-200 text-sm"
            >
              <option value="">جميع الحالات</option>
              <option value="in_stock">متوفر</option>
              <option value="low_stock">كمية قليلة</option>
              <option value="out_of_stock">غير متوفر</option>
            </select>
          </div>

          <!-- Active Filters Display -->
          <div v-if="hasActiveFilters" class="pt-3 border-t border-gray-200 dark:border-gray-700">
            <div class="flex flex-wrap gap-2">
              <span v-if="selectedWarehouse" 
                    class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                <span>المخزن:</span>
                <span class="font-medium">{{ getWarehouseLabel(selectedWarehouse) }}</span>
                <button @click="selectedWarehouse = ''" class="text-blue-600 hover:text-blue-800">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </span>
              <span v-if="statusFilter" 
                    class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                <span>الحالة:</span>
                <span class="font-medium">{{ getStatusLabel(statusFilter) }}</span>
                <button @click="statusFilter = ''" class="text-green-600 hover:text-green-800">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </span>
              <span v-if="searchTerm" 
                    class="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded-full">
                <span>البحث:</span>
                <span class="font-medium">{{ searchTerm }}</span>
                <button @click="searchTerm = ''" class="text-yellow-600 hover:text-yellow-800">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </span>
            </div>
            <button 
              v-if="hasActiveFilters" 
              @click="clearAllFilters"
              class="mt-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 underline"
            >
              مسح كل الفلاتر
            </button>
          </div>
        </div>

        <!-- Desktop Filters -->
        <div class="hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Warehouse Filter -->
            <div v-if="accessibleWarehouses.length > 0">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المخزن</label>
              <select
                v-model="selectedWarehouse"
                @change="handleWarehouseChange"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 hover:border-yellow-400 transition-colors duration-200"
              >
                <option value="">جميع المخازن</option>
                <option v-for="warehouse in accessibleWarehouses" :key="warehouse.id" :value="warehouse.id">
                  {{ warehouse.name_ar }}
                </option>
              </select>
            </div>

            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">حالة المخزون</label>
              <select
                v-model="statusFilter"
                @change="handleFilterChange"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 hover:border-yellow-400 transition-colors duration-200"
              >
                <option value="">جميع الحالات</option>
                <option value="in_stock">متوفر</option>
                <option value="low_stock">كمية قليلة</option>
                <option value="out_of_stock">غير متوفر</option>
              </select>
            </div>

            <!-- Search Input -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">بحث سريع</label>
              <div class="relative">
                <input
                  type="text"
                  v-model="searchTerm"
                  @input="handleLiveSearch"
                  placeholder="ابحث باسم الصنف، الكود، اللون، المورد، أو مكان التخزين..."
                  class="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 hover:border-yellow-400 transition-colors duration-200"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Filters Display for Desktop -->
          <div v-if="hasActiveFilters" class="mt-4 flex flex-wrap gap-2">
            <span v-if="selectedWarehouse" 
                  class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full">
              <span>المخزن:</span>
              <span class="font-medium">{{ getWarehouseLabel(selectedWarehouse) }}</span>
              <button @click="selectedWarehouse = ''" class="text-blue-600 hover:text-blue-800">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </span>
            <span v-if="statusFilter" 
                  class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full">
              <span>الحالة:</span>
              <span class="font-medium">{{ getStatusLabel(statusFilter) }}</span>
              <button @click="statusFilter = ''" class="text-green-600 hover:text-green-800">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </span>
            <span v-if="searchTerm" 
                  class="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-sm rounded-full">
              <span>البحث:</span>
              <span class="font-medium">{{ searchTerm }}</span>
              <button @click="searchTerm = ''" class="text-yellow-600 hover:text-yellow-800">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </span>
            <button 
              v-if="hasActiveFilters" 
              @click="clearAllFilters"
              class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 underline"
            >
              مسح كل الفلاتر
            </button>
          </div>
        </div>
      </div>

      <!-- Search Mode Indicator -->
      <div v-if="useLiveSearch" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 p-3 rounded-lg mb-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <span class="text-sm">وضع البحث الفوري: عرض {{ liveSearchResults.length }} نتيجة</span>
          </div>
          <button 
            @click="resetToNormalView"
            class="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors duration-200"
          >
            العودة للعرض العادي
          </button>
        </div>
      </div>

      <!-- Export Progress -->
      <div v-if="exporting" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 p-3 rounded-lg mb-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 ml-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span class="text-sm">جاري تجهيز ملف Excel...</span>
          </div>
          <span class="text-sm">{{ exportProgress }}</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !filteredItems.length" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">جاري تحميل المخزون...</p>
        <p v-if="totalLoaded > 0" class="text-sm text-gray-500 mt-2">تم تحميل {{ totalLoaded }} عنصر</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-lg mb-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{{ error }}</span>
          </div>
          <button @click="error = ''" class="text-red-600 hover:text-red-800">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Inventory Items -->
      <div v-else>
        <!-- Desktop Table -->
        <div class="hidden lg:block">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      الصورة
                    </th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      الاسم والكود
                    </th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      اللون
                    </th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      المخزن
                    </th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      المورد
                    </th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      الكميات
                    </th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      المتبقي
                    </th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th v-if="showActions && !readonly && userRole !== 'viewer'" 
                        class="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="item in visibleItems" 
                      :key="item.id"
                      class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                      @click="showItemDetails(item)">
                    <!-- Photo -->
                    <td class="px-4 py-3">
                      <div class="flex justify-center">
                        <div class="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                          <img 
                            :src="item.photo_url || getPlaceholderImage()" 
                            :alt="item.name"
                            class="w-full h-full object-cover"
                            @error="handleImageError"
                          >
                        </div>
                      </div>
                    </td>

                    <!-- Name and Code -->
                    <td class="px-4 py-3">
                      <div class="min-w-0 max-w-xs">
                        <div class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {{ item.name }}
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span class="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
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
                    <td class="px-4 py-3">
                      <div class="flex items-center justify-center">
                        <div class="flex items-center gap-2 px-2 py-1 rounded-full bg-gray-50 dark:bg-gray-700">
                          <div v-if="item.color" class="w-3 h-3 rounded-full border border-gray-300"
                            :style="{ backgroundColor: getColorHex(item.color) }"></div>
                          <span class="text-xs text-gray-900 dark:text-white">
                            {{ item.color || '-' }}
                          </span>
                        </div>
                      </div>
                    </td>

                    <!-- Warehouse -->
                    <td class="px-4 py-3">
                      <div class="text-center">
                        <span class="text-xs text-gray-900 dark:text-white px-2 py-1 rounded-full bg-gray-50 dark:bg-gray-700">
                          {{ getWarehouseLabel(item.warehouse_id) }}
                        </span>
                      </div>
                    </td>

                    <!-- Supplier -->
                    <td class="px-4 py-3">
                      <div class="max-w-[120px] mx-auto">
                        <span class="text-xs text-gray-900 dark:text-white truncate block px-2 py-1 rounded-full bg-gray-50 dark:bg-gray-700">
                          {{ item.supplier || '-' }}
                        </span>
                      </div>
                    </td>

                    <!-- Quantities -->
                    <td class="px-4 py-3">
                      <div class="text-xs space-y-1 max-w-[120px] mx-auto">
                        <div class="flex items-center justify-between px-2 py-1 rounded-full bg-gray-50 dark:bg-gray-700">
                          <span class="text-gray-500 dark:text-gray-400">كراتين:</span>
                          <span class="text-gray-900 dark:text-white font-medium">{{ item.cartons_count || 0 }}</span>
                        </div>
                        <div class="flex items-center justify-between px-2 py-1 rounded-full bg-gray-50 dark:bg-gray-700">
                          <span class="text-gray-500 dark:text-gray-400">في الكرتونة:</span>
                          <span class="text-gray-900 dark:text-white font-medium">{{ item.per_carton_count || 0 }}</span>
                        </div>
                        <div class="flex items-center justify-between px-2 py-1 rounded-full bg-gray-50 dark:bg-gray-700">
                          <span class="text-gray-500 dark:text-gray-400">فردي:</span>
                          <span class="text-gray-900 dark:text-white font-medium">{{ item.single_bottles_count || 0 }}</span>
                        </div>
                      </div>
                    </td>

                    <!-- Remaining Quantity -->
                    <td class="px-4 py-3">
                      <div class="text-center">
                        <div :class="getQuantityClass(item.remaining_quantity)" 
                             class="text-base font-bold px-3 py-2 rounded-full inline-flex flex-col items-center gap-1">
                          <span>{{ item.remaining_quantity }}</span>
                          <div class="text-xs text-gray-500 dark:text-gray-400">
                            من {{ item.total_added }}
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- Status -->
                    <td class="px-4 py-3">
                      <div class="flex justify-center">
                        <span :class="getStockStatusClass(item.remaining_quantity)" 
                              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold">
                          {{ getStockStatus(item.remaining_quantity) }}
                        </span>
                      </div>
                    </td>

                    <!-- Actions -->
                    <td v-if="showActions && !readonly && userRole !== 'viewer'" class="px-4 py-3">
                      <div class="flex items-center justify-center gap-2">
                        <button
                          @click.stop="handleEdit(item)"
                          v-if="canEditItem(item)"
                          class="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/20 transition-colors duration-200"
                          title="تعديل"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Load More for Desktop -->
            <div v-if="hasMore && !loadingMore && !useLiveSearch && filteredItems.length > 0" class="p-4 text-center border-t border-gray-200 dark:border-gray-700">
              <button
                @click="loadMoreItems"
                :disabled="loadingMore"
                class="inline-flex items-center px-6 py-2.5 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="loadingMore" class="w-4 h-4 ml-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <svg v-else class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                {{ loadingMore ? 'جاري التحميل...' : 'تحميل المزيد من العناصر' }}
              </button>
            </div>

            <!-- End of List for Desktop -->
            <div v-if="!hasMore && filteredItems.length > 0 && !useLiveSearch" class="p-4 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
              <p class="text-sm">تم عرض جميع العناصر ({{ filteredItems.length }} عنصر)</p>
            </div>

            <!-- Empty State for Desktop -->
            <div v-if="filteredItems.length === 0 && !loading" class="p-8 text-center text-gray-500 dark:text-gray-400">
              <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
              </svg>
              <h3 class="text-lg font-medium mb-2">لا توجد أصناف</h3>
              <p class="text-sm">{{ searchTerm ? 'لم يتم العثور على أصناف مطابقة للبحث' : 'لم يتم إضافة أي أصناف بعد.' }}</p>
            </div>
          </div>
        </div>

        <!-- Mobile Items Grid -->
        <div class="lg:hidden">
          <div class="grid grid-cols-1 gap-3">
            <div 
              v-for="item in mobileVisibleItems" 
              :key="item.id"
              class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
              @click="showItemDetails(item)"
            >
              <div class="p-4">
                <!-- Top Row: Image and Basic Info -->
                <div class="flex gap-3">
                  <!-- Image -->
                  <div class="flex-shrink-0">
                    <div class="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                      <img 
                        :src="item.photo_url || getPlaceholderImage()" 
                        :alt="item.name"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                      >
                    </div>
                  </div>
                  
                  <!-- Item Details -->
                  <div class="flex-1 min-w-0">
                    <!-- Name and Code -->
                    <div class="mb-2">
                      <h3 class="text-sm font-bold text-gray-900 dark:text-white truncate mb-1">{{ item.name }}</h3>
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                          {{ item.code }}
                        </span>
                        <span v-if="item.color" class="text-xs text-gray-500 dark:text-gray-400">
                          {{ item.color }}
                        </span>
                      </div>
                    </div>
                    
                    <!-- Warehouse and Location -->
                    <div class="mb-2">
                      <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                        <span class="truncate">{{ getWarehouseLabel(item.warehouse_id) }}</span>
                      </div>
                      <div v-if="item.item_location" class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mt-1">
                        <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        </svg>
                        <span class="truncate">{{ item.item_location }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Bottom Row: Quantity and Status -->
                <div class="mt-3 flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <!-- Quantity -->
                  <div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">الكمية المتبقية</div>
                    <div :class="getQuantityClass(item.remaining_quantity)" class="text-lg font-bold">
                      {{ item.remaining_quantity }}
                    </div>
                  </div>
                  
                  <!-- Status and Supplier -->
                  <div class="text-right">
                    <div class="mb-1">
                      <span :class="getStockStatusClass(item.remaining_quantity)" class="text-xs px-3 py-1 rounded-full">
                        {{ getStockStatus(item.remaining_quantity) }}
                      </span>
                    </div>
                    <div v-if="item.supplier" class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px] ml-auto">
                      {{ item.supplier }}
                    </div>
                  </div>
                </div>
                
                <!-- Quick Actions -->
                <div v-if="showActions && !readonly && userRole !== 'viewer' && canEditItem(item)" 
                     class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div class="flex gap-2">
                    <button 
                      @click.stop="handleEdit(item)"
                      class="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/20 transition-colors"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                      تعديل
                    </button>
                    <button 
                      @click.stop="handleTransfer(item)"
                      v-if="canTransferItem(item)"
                      class="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-medium rounded-lg hover:bg-green-100 dark:hover:bg-green-800/20 transition-colors"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                      </svg>
                      نقل
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Load More Button for Mobile -->
          <div v-if="hasMore && !loadingMore && !useLiveSearch && mobileVisibleItems.length > 0" class="mt-4 text-center">
            <button
              @click="loadMoreItems"
              :disabled="loading || loadingMore"
              class="w-full px-4 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loadingMore ? 'جاري التحميل...' : 'تحميل المزيد من العناصر' }}
            </button>
          </div>

          <!-- Empty State for Mobile -->
          <div v-if="filteredItems.length === 0 && !loading" class="text-center py-12">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">لا توجد أصناف</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ searchTerm || hasActiveFilters ? 'لم يتم العثور على أصناف مطابقة' : 'لم يتم إضافة أي أصناف بعد' }}
            </p>
            <button 
              v-if="hasActiveFilters"
              @click="clearAllFilters"
              class="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              مسح الفلاتر
            </button>
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

// Click outside directive for dropdowns
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

// Local storage cache keys
const CACHE_KEYS = {
  INVENTORY: 'inventory_cache_v2',
  WAREHOUSES: 'warehouses_cache_v2',
  LAST_UPDATE: 'inventory_last_update',
  CACHE_TTL: 30 * 60 * 1000 // 30 minutes
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
    const loadingMore = ref(false);
    const error = ref('');
    const showAddModal = ref(false);
    const showEditModal = ref(false);
    const showTransferModal = ref(false);
    const showDispatchModal = ref(false);
    const showDetailsModal = ref(false);
    const showDeleteConfirm = ref(false);
    const searchTerm = ref('');
    const statusFilter = ref('');
    const selectedWarehouse = ref('');
    const selectedItemForEdit = ref(null);
    const selectedItemForTransfer = ref(null);
    const selectedItemForDispatch = ref(null);
    const selectedItem = ref(null);
    const itemToDelete = ref(null);
    const exporting = ref(false);
    const deleteLoading = ref(false);
    const refreshing = ref(false);
    const exportProgress = ref('');
    
    // Mobile filters state
    const showMobileFilters = ref(false);
    
    // Live search state
    const useLiveSearch = ref(false);
    const liveSearchResults = ref([]);
    const isLiveSearching = ref(false);
    const searchTimeout = ref(null);
    
    // Virtual scrolling state
    const scrollContainer = ref(null);
    const mobileScrollContainer = ref(null);
    const visibleStartIndex = ref(0);
    const mobileVisibleStartIndex = ref(0);
    const visibleItemCount = 50;
    const mobileVisibleItemCount = 20;
    const scrollBuffer = 20;
    const lastScrollTime = ref(0);
    const SCROLL_THROTTLE_DELAY = 16;
    
    // UI state
    const showActionMenu = ref(null);
    const lastUpdate = ref(Date.now());
    const isDataFresh = ref(false);
    
    // Computed properties
    const userRole = computed(() => store.getters.userRole);
    const userProfile = computed(() => store.state.userProfile);
    const inventory = computed(() => store.state.inventory || []);
    const accessibleWarehouses = computed(() => store.getters.accessibleWarehouses || []);
    const allWarehouses = computed(() => store.state.warehouses || []);
    const currentUser = computed(() => store.state.user);
    const inventoryLoading = computed(() => store.state.inventoryLoading);
    const hasMore = computed(() => store.state.pagination?.hasMore || false);
    const totalLoaded = computed(() => store.state.pagination?.totalLoaded || 0);
    
    // Current user info
    const currentUserInfo = computed(() => {
      if (userProfile.value?.name) return userProfile.value.name;
      if (currentUser.value?.displayName) return currentUser.value.displayName;
      if (userProfile.value?.email) return userProfile.value.email.split('@')[0];
      if (currentUser.value?.email) return currentUser.value.email.split('@')[0];
      return 'مستخدم النظام';
    });
    
    // Permissions
    const canAddItem = computed(() => {
      return userRole.value === 'superadmin' || 
             (userRole.value === 'warehouse_manager' && userProfile.value?.allowed_warehouses?.length > 0);
    });
    
    const showActions = computed(() => {
      return userRole.value !== 'viewer';
    });
    
    const readonly = computed(() => {
      return userRole.value === 'viewer';
    });
    
    const canEditItem = (item) => {
      if (userRole.value === 'superadmin') return true;
      if (userRole.value !== 'warehouse_manager') return false;
      
      const allowedWarehouses = userProfile.value?.allowed_warehouses || [];
      return allowedWarehouses.includes(item.warehouse_id) || allowedWarehouses.includes('all');
    };
    
    const canTransferItem = (item) => {
      return canEditItem(item);
    };
    
    const canDispatchItem = (item) => {
      return canEditItem(item);
    };
    
    const canDeleteItem = (item) => {
      return canEditItem(item) && userRole.value === 'superadmin';
    };
    
    // Stats computed
    const totalQuantity = computed(() => {
      return filteredItems.value.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0);
    });
    
    const lowStockCount = computed(() => {
      return filteredItems.value.filter(item => {
        const quantity = item.remaining_quantity || 0;
        return quantity > 0 && quantity < 10;
      }).length;
    });
    
    const warehouseCount = computed(() => {
      const warehouses = new Set(filteredItems.value.map(item => item.warehouse_id));
      return warehouses.size;
    });
    
    const hasActiveFilters = computed(() => {
      return selectedWarehouse.value || statusFilter.value || searchTerm.value;
    });
    
    // Filtered items
    const filteredItems = computed(() => {
      if (useLiveSearch.value) {
        return liveSearchResults.value;
      } else {
        let filtered = [...inventory.value];
        
        if (selectedWarehouse.value) {
          filtered = filtered.filter(item => item.warehouse_id === selectedWarehouse.value);
        }
        
        if (statusFilter.value) {
          filtered = filtered.filter(item => {
            const quantity = item.remaining_quantity || 0;
            if (statusFilter.value === 'in_stock') return quantity >= 10;
            if (statusFilter.value === 'low_stock') return quantity > 0 && quantity < 10;
            if (statusFilter.value === 'out_of_stock') return quantity === 0;
            return true;
          });
        }
        
        if (searchTerm.value) {
          const term = searchTerm.value.toLowerCase();
          filtered = filtered.filter(item => 
            item.name?.toLowerCase().includes(term) ||
            item.code?.toLowerCase().includes(term) ||
            item.color?.toLowerCase().includes(term) ||
            item.supplier?.toLowerCase().includes(term) ||
            item.item_location?.toLowerCase().includes(term)
          );
        }
        
        return filtered.sort((a, b) => {
          const nameA = a.name?.toLowerCase() || '';
          const nameB = b.name?.toLowerCase() || '';
          return nameA.localeCompare(nameB, 'ar');
        });
      }
    });
    
    // Visible items for virtual scrolling
    const visibleItems = computed(() => {
      const start = Math.max(0, visibleStartIndex.value - scrollBuffer);
      const end = Math.min(filteredItems.value.length, visibleStartIndex.value + visibleItemCount + scrollBuffer);
      return filteredItems.value.slice(start, end);
    });
    
    const mobileVisibleItems = computed(() => {
      const start = Math.max(0, mobileVisibleStartIndex.value - scrollBuffer);
      const end = Math.min(filteredItems.value.length, mobileVisibleStartIndex.value + mobileVisibleItemCount + scrollBuffer);
      return filteredItems.value.slice(start, end);
    });
    
    // Color mapping
    const colorMap = {
      'أحمر': '#ef4444',
      'أزرق': '#3b82f6',
      'أخضر': '#10b981',
      'أصفر': '#f59e0b',
      'أسود': '#000000',
      'أبيض': '#ffffff',
      'رمادي': '#6b7280',
      'بني': '#92400e',
      'وردي': '#ec4899',
      'برتقالي': '#f97316',
      'بنفسجي': '#8b5cf6',
      'ذهبي': '#d97706',
      'فضي': '#9ca3af'
    };
    
    // Helper Methods
    const formatNumber = (num) => {
      const englishDigits = new Intl.NumberFormat('en-US').format(num || 0);
      return englishDigits;
    };
    
    const getWarehouseLabel = (warehouseId) => {
      const warehouse = allWarehouses.value.find(w => w.id === warehouseId);
      return warehouse ? warehouse.name_ar : warehouseId;
    };
    
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
      if (quantity === 0) return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800';
      if (quantity < 10) return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-800';
      return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800';
    };

    const getQuantityClass = (quantity) => {
      if (quantity === 0) return 'text-red-600 dark:text-red-400';
      if (quantity < 10) return 'text-orange-600 dark:text-orange-400';
      return 'text-green-600 dark:text-green-400';
    };
    
    const getColorHex = (colorName) => {
      return colorMap[colorName] || '#6b7280';
    };
    
    const formatDate = (date) => {
      if (!date) return '-';
      try {
        const dateObj = date.toDate ? date.toDate() : new Date(date);
        if (isNaN(dateObj.getTime())) return '-';
        
        return dateObj.toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return '-';
      }
    };
    
    const formatRelativeTime = (date) => {
      if (!date) return '-';
      try {
        const dateObj = date.toDate ? date.toDate() : new Date(date);
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
        
        return formatDate(date);
      } catch (e) {
        return '-';
      }
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
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    const getPlaceholderImage = () => {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMTZMNC42ODYgMTUuMzE0QzQuODgyIDExLjUwNyA4LjA5MyA5IDEyIDlDMTUuOTA3IDkgMTkuMTE4IDExLjUwNyAxOS4zMTQgMTUuMzE0TDIwIDE2TTggMjFIMTZNNSAxNEgxOU0xMiAxN0MxMiAxNy41NTIyOCAxMS41NTIzIDE4IDExIDE4QzEwLjQ0NzcgMTggMTAgMTcuNTUyMyAxMCAxN0MxMCAxNi40NDc3IDEwLjQ0NzcgMTYgMTEgMTZDMTEuNTUyMyAxNiAxMiAxNi40NDc3IDEyIDE3WiIgc3Ryb2tlPSI2QjcyOEQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
    };
    
    const handleImageError = (event) => {
      event.target.src = getPlaceholderImage();
      event.target.onerror = null;
    };
    
    // Cache Management
    const loadFromCache = () => {
      try {
        const cached = localStorage.getItem(CACHE_KEYS.INVENTORY);
        const lastUpdateCache = localStorage.getItem(CACHE_KEYS.LAST_UPDATE);
        
        if (cached && lastUpdateCache) {
          const cacheAge = Date.now() - parseInt(lastUpdateCache);
          if (cacheAge < CACHE_KEYS.CACHE_TTL) {
            const data = JSON.parse(cached);
            store.commit('SET_INVENTORY', data);
            isDataFresh.value = false;
            return true;
          }
        }
      } catch (error) {
        console.warn('Error loading from cache:', error);
      }
      return false;
    };
    
    const saveToCache = () => {
      try {
        localStorage.setItem(CACHE_KEYS.INVENTORY, JSON.stringify(inventory.value));
        localStorage.setItem(CACHE_KEYS.LAST_UPDATE, Date.now().toString());
      } catch (error) {
        console.warn('Error saving to cache:', error);
      }
    };
    
    // Virtual scrolling handlers
    const onScroll = () => {
      if (!scrollContainer.value) return;
      
      const now = Date.now();
      if (now - lastScrollTime.value < SCROLL_THROTTLE_DELAY) {
        return;
      }
      
      lastScrollTime.value = now;
      
      requestAnimationFrame(() => {
        const scrollTop = scrollContainer.value.scrollTop;
        const rowHeight = 80;
        const newStartIndex = Math.floor(scrollTop / rowHeight);
        
        if (Math.abs(newStartIndex - visibleStartIndex.value) > scrollBuffer / 2) {
          visibleStartIndex.value = newStartIndex;
        }
        
        if (!useLiveSearch.value) {
          const scrollBottom = scrollContainer.value.scrollHeight - scrollTop - scrollContainer.value.clientHeight;
          if (scrollBottom < 500 && hasMore.value && !loadingMore.value) {
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
        
        if (!useLiveSearch.value) {
          const scrollBottom = mobileScrollContainer.value.scrollHeight - scrollTop - mobileScrollContainer.value.clientHeight;
          if (scrollBottom < 500 && hasMore.value && !loadingMore.value) {
            loadMoreItems();
          }
        }
      });
    };
    
    // Live search with debouncing
    const handleLiveSearch = debounce(async () => {
      if (!searchTerm.value.trim()) {
        resetToNormalView();
        return;
      }
      
      await performLiveSearch();
    }, 300);
    
    const performLiveSearch = async () => {
      if (!searchTerm.value.trim()) {
        resetToNormalView();
        return;
      }
      
      isLiveSearching.value = true;
      useLiveSearch.value = true;
      
      try {
        const results = await store.dispatch('searchItemsForTransactions', {
          searchTerm: searchTerm.value.trim(),
          limitResults: 200
        });
        
        let filteredResults = results;
        if (selectedWarehouse.value) {
          filteredResults = results.filter(item => item.warehouse_id === selectedWarehouse.value);
        }
        
        if (statusFilter.value) {
          filteredResults = filteredResults.filter(item => {
            const quantity = item.remaining_quantity || 0;
            if (statusFilter.value === 'in_stock') return quantity >= 10;
            if (statusFilter.value === 'low_stock') return quantity > 0 && quantity < 10;
            if (statusFilter.value === 'out_of_stock') return quantity === 0;
            return true;
          });
        }
        
        liveSearchResults.value = filteredResults;
        
        visibleStartIndex.value = 0;
        mobileVisibleStartIndex.value = 0;
        
      } catch (error) {
        console.error('❌ Error in live search:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في البحث الفوري'
        });
        
        useLiveSearch.value = false;
      } finally {
        isLiveSearching.value = false;
      }
    };
    
    const handleWarehouseChange = async () => {
      visibleStartIndex.value = 0;
      mobileVisibleStartIndex.value = 0;
      
      if (useLiveSearch.value && searchTerm.value.trim()) {
        await performLiveSearch();
      } else if (selectedWarehouse.value) {
        await loadItemsFromSelectedWarehouse();
      }
      
      // Close mobile filters
      if (window.innerWidth < 1024) {
        showMobileFilters.value = false;
      }
    };
    
    const loadItemsFromSelectedWarehouse = async () => {
      if (!selectedWarehouse.value) {
        resetToNormalView();
        return;
      }
      
      isLiveSearching.value = true;
      useLiveSearch.value = true;
      
      try {
        const results = await store.dispatch('getItemsFromWarehouse', {
          warehouseId: selectedWarehouse.value,
          limitResults: 500
        });
        
        let filteredResults = results;
        if (statusFilter.value) {
          filteredResults = results.filter(item => {
            const quantity = item.remaining_quantity || 0;
            if (statusFilter.value === 'in_stock') return quantity >= 10;
            if (statusFilter.value === 'low_stock') return quantity > 0 && quantity < 10;
            if (statusFilter.value === 'out_of_stock') return quantity === 0;
            return true;
          });
        }
        
        if (searchTerm.value.trim()) {
          const term = searchTerm.value.toLowerCase();
          filteredResults = filteredResults.filter(item => 
            item.name?.toLowerCase().includes(term) ||
            item.code?.toLowerCase().includes(term) ||
            item.color?.toLowerCase().includes(term) ||
            item.supplier?.toLowerCase().includes(term) ||
            item.item_location?.toLowerCase().includes(term)
          );
        }
        
        liveSearchResults.value = filteredResults;
        
      } catch (error) {
        console.error('❌ Error loading items from warehouse:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تحميل الأصناف من المخزن'
        });
        
        useLiveSearch.value = false;
      } finally {
        isLiveSearching.value = false;
      }
    };
    
    const resetToNormalView = () => {
      useLiveSearch.value = false;
      liveSearchResults.value = [];
      searchTerm.value = '';
      
      visibleStartIndex.value = 0;
      mobileVisibleStartIndex.value = 0;
    };
    
    const clearAllFilters = () => {
      selectedWarehouse.value = '';
      statusFilter.value = '';
      searchTerm.value = '';
      showMobileFilters.value = false;
      resetToNormalView();
    };
    
    const handleFilterChange = () => {
      visibleStartIndex.value = 0;
      mobileVisibleStartIndex.value = 0;
      
      if (useLiveSearch.value) {
        if (searchTerm.value.trim()) {
          performLiveSearch();
        } else if (selectedWarehouse.value) {
          loadItemsFromSelectedWarehouse();
        }
      }
      
      // Close mobile filters
      if (window.innerWidth < 1024) {
        setTimeout(() => {
          showMobileFilters.value = false;
        }, 500);
      }
    };
    
    // IMPROVED Excel Export with Multiple Sheets by Warehouse
    const exportToExcel = async () => {
      if (filteredItems.value.length === 0) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'لا توجد بيانات للتصدير'
        });
        return;
      }

      exporting.value = true;
      exportProgress.value = 'جاري تجهير البيانات...';
      
      try {
        // Group items by warehouse
        const itemsByWarehouse = {};
        filteredItems.value.forEach(item => {
          const warehouseId = item.warehouse_id;
          if (!itemsByWarehouse[warehouseId]) {
            itemsByWarehouse[warehouseId] = [];
          }
          itemsByWarehouse[warehouseId].push(item);
        });

        // Create workbook
        const wb = XLSX.utils.book_new();
        
        // Create summary sheet
        const summaryData = [];
        let totalItems = 0;
        let totalQuantitySum = 0;
        let lowStockItems = 0;
        
        // Prepare summary data
        Object.keys(itemsByWarehouse).forEach(warehouseId => {
          const warehouseItems = itemsByWarehouse[warehouseId];
          const warehouseQuantity = warehouseItems.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0);
          const warehouseLowStock = warehouseItems.filter(item => {
            const quantity = item.remaining_quantity || 0;
            return quantity > 0 && quantity < 10;
          }).length;
          
          summaryData.push({
            'المخزن': getWarehouseLabel(warehouseId),
            'عدد الأصناف': warehouseItems.length,
            'إجمالي الكمية': warehouseQuantity,
            'الأصناف قليلة المخزون': warehouseLowStock,
            'نسبة المخزون': `${warehouseLowStock > 0 ? '⚠️' : '✅'} ${warehouseLowStock} من ${warehouseItems.length}`
          });
          
          totalItems += warehouseItems.length;
          totalQuantitySum += warehouseQuantity;
          lowStockItems += warehouseLowStock;
        });
        
        // Add total row to summary
        summaryData.push({
          'المخزن': 'الإجمالي',
          'عدد الأصناف': totalItems,
          'إجمالي الكمية': totalQuantitySum,
          'الأصناف قليلة المخزون': lowStockItems,
          'نسبة المخزون': `${lowStockItems > 0 ? '⚠️' : '✅'} ${lowStockItems} من ${totalItems}`
        });
        
        const summaryWs = XLSX.utils.json_to_sheet(summaryData);
        
        // Style summary sheet
        const summaryColWidths = [
          { wch: 25 }, // المخزن
          { wch: 15 }, // عدد الأصناف
          { wch: 15 }, // إجمالي الكمية
          { wch: 20 }, // الأصناف قليلة المخزون
          { wch: 25 }  // نسبة المخزون
        ];
        summaryWs['!cols'] = summaryColWidths;
        
        XLSX.utils.book_append_sheet(wb, summaryWs, 'ملخص المخازن');
        
        // Create a sheet for each warehouse
        let sheetIndex = 1;
        for (const [warehouseId, items] of Object.entries(itemsByWarehouse)) {
          exportProgress.value = `جاري إنشاء صفحة ${sheetIndex}: ${getWarehouseLabel(warehouseId)}`;
          
          const warehouseData = items.map((item, index) => {
            return {
              'م': index + 1,
              'الكود': item.code || '',
              'اسم الصنف': item.name || '',
              'اللون': item.color || '',
              'مكان التخزين': item.item_location || '',
              'المورد': item.supplier || '',
              'عدد الكراتين': item.cartons_count || 0,
              'عدد في الكرتونة': item.per_carton_count || 0,
              'عدد القطع الفردية': item.single_bottles_count || 0,
              'الكمية الإجمالية المضافة': item.total_added || 0,
              'الكمية المتبقية': item.remaining_quantity || 0,
              'الحالة': getStockStatus(item.remaining_quantity || 0),
              'أنشئ بواسطة': item.created_by_name || 'غير معروف',
              'تم التحديث بواسطة': item.updated_by_name || item.created_by_name || 'غير معروف',
              'تاريخ الإنشاء': formatDate(item.created_at),
              'آخر تحديث': formatDate(item.updated_at)
            };
          });
          
          const ws = XLSX.utils.json_to_sheet(warehouseData);
          
          // Add column widths
          const colWidths = [
            { wch: 5 },  // م
            { wch: 15 }, // الكود
            { wch: 25 }, // اسم الصنف
            { wch: 12 }, // اللون
            { wch: 20 }, // مكان التخزين
            { wch: 20 }, // المورد
            { wch: 12 }, // عدد الكراتين
            { wch: 12 }, // عدد في الكرتونة
            { wch: 12 }, // عدد القطع الفردية
            { wch: 15 }, // الكمية الإجمالية المضافة
            { wch: 12 }, // الكمية المتبقية
            { wch: 10 }, // الحالة
            { wch: 20 }, // أنشئ بواسطة
            { wch: 20 }, // تم التحديث بواسطة
            { wch: 20 }, // تاريخ الإنشاء
            { wch: 20 }  // آخر تحديث
          ];
          ws['!cols'] = colWidths;
          
          // Truncate sheet name if too long
          const sheetName = getWarehouseLabel(warehouseId).substring(0, 31);
          XLSX.utils.book_append_sheet(wb, ws, sheetName);
          sheetIndex++;
        }
        
        exportProgress.value = 'جاري حفظ الملف...';
        
        // Generate filename with timestamp
        const timestamp = new Date().toISOString().split('T')[0];
        const fileName = `مخزون-${timestamp}.xlsx`;
        
        // Save file
        XLSX.writeFile(wb, fileName);
        
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم تصدير ${filteredItems.value.length} صنف إلى ${Object.keys(itemsByWarehouse).length} صفحة في ملف Excel`
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
    
    // Data refresh
    const refreshData = async () => {
      try {
        refreshing.value = true;
        await store.dispatch('refreshAllData');
        lastUpdate.value = Date.now();
        isDataFresh.value = true;
        saveToCache();
        
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
    
    // Load more items
    const loadMoreItems = async () => {
      if (hasMore.value && !loadingMore.value && !useLiveSearch.value) {
        try {
          loadingMore.value = true;
          await store.dispatch('loadMoreInventory');
          saveToCache();
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
    
    // UI Actions
    const toggleActionMenu = (itemId) => {
      showActionMenu.value = showActionMenu.value === itemId ? null : itemId;
    };
    
    const showItemDetails = (item) => {
      selectedItem.value = item;
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
      selectedItemForEdit.value = item;
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
      itemToDelete.value = item;
      showDeleteConfirm.value = true;
      showActionMenu.value = null;
    };
    
    const confirmDelete = async () => {
      try {
        deleteLoading.value = true;
        await store.dispatch('deleteInventoryItem', itemToDelete.value.id);
        
        store.dispatch('showNotification', {
          type: 'success',
          message: 'تم حذف الصنف بنجاح!'
        });
        
        if (showDetailsModal.value && selectedItem.value?.id === itemToDelete.value.id) {
          closeDetailsModal();
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
      saveToCache();
      
      store.dispatch('showNotification', {
        type: 'success',
        message: 'تم إضافة الصنف بنجاح!'
      });
    };
    
    const handleItemUpdated = () => {
      showEditModal.value = false;
      selectedItemForEdit.value = null;
      saveToCache();
      
      store.dispatch('showNotification', {
        type: 'success',
        message: 'تم تحديث الصنف بنجاح!'
      });
    };
    
    const handleTransferSuccess = () => {
      showTransferModal.value = false;
      selectedItemForTransfer.value = null;
      saveToCache();
      
      store.dispatch('showNotification', {
        type: 'success',
        message: 'تم نقل الصنف بنجاح!'
      });
    };
    
    const handleDispatchSuccess = () => {
      showDispatchModal.value = false;
      selectedItemForDispatch.value = null;
      saveToCache();
      
      store.dispatch('showNotification', {
        type: 'success',
        message: 'تم صرف الصنف بنجاح!'
      });
    };
    
    const getLastActionUser = (item) => {
      if (!item) return 'غير معروف';
      
      if (item.updated_by_name && item.updated_by_name !== 'O5Rg9HxDH8Nk3LY9G5onMgc2vN12') {
        return item.updated_by_name;
      }
      
      if (item.created_by_name && item.created_by_name !== 'O5Rg9HxDH8Nk3LY9G5onMgc2vN12') {
        return item.created_by_name;
      }
      
      return currentUserInfo.value;
    };
    
    // Lifecycle
    onMounted(() => {
      // Load from cache first
      const fromCache = loadFromCache();
      
      if (!store.state.inventoryLoaded || fromCache) {
        loading.value = true;
        
        // Load fresh data in background
        store.dispatch('loadAllInventory').then(() => {
          isDataFresh.value = true;
          lastUpdate.value = Date.now();
          saveToCache();
        }).catch(error => {
          console.error('❌ Error loading inventory:', error);
          error.value = 'حدث خطأ في تحميل البيانات';
        }).finally(() => {
          loading.value = false;
        });
      }
      
      if (allWarehouses.value.length === 0) {
        store.dispatch('loadWarehouses');
      }
      
      if (accessibleWarehouses.value.length === 1) {
        selectedWarehouse.value = accessibleWarehouses.value[0].id;
      }
      
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
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }
      
      if (scrollContainer.value) {
        scrollContainer.value.removeEventListener('scroll', onScroll);
      }
      
      if (mobileScrollContainer.value) {
        mobileScrollContainer.value.removeEventListener('scroll', onMobileScroll);
      }
    });
    
    watch(() => [searchTerm.value, statusFilter.value, selectedWarehouse.value], () => {
      handleFilterChange();
    });
    
    watch(() => filteredItems.value.length, () => {
      // Reset scroll position when filters change
      visibleStartIndex.value = 0;
      mobileVisibleStartIndex.value = 0;
    });
    
    return {
      // State
      loading,
      loadingMore,
      error,
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
      showMobileFilters,
      
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
      inventory,
      accessibleWarehouses,
      canAddItem,
      showActions,
      readonly,
      filteredItems,
      visibleItems,
      mobileVisibleItems,
      currentUserInfo,
      inventoryLoading,
      hasMore,
      totalLoaded,
      
      // Stats
      totalQuantity,
      lowStockCount,
      warehouseCount,
      hasActiveFilters,
      
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
    };
  }
};
</script>

<style scoped>
/* Mobile optimizations */
@media (max-width: 768px) {
  .grid-cols-1 {
    grid-template-columns: 1fr;
  }
  
  /* Ensure buttons are touch-friendly */
  button {
    min-height: 44px;
  }
  
  /* Better text truncation */
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  /* Smooth scrolling */
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
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

/* Smooth transitions */
.transition-colors {
  transition-property: background-color, border-color, color;
  transition-duration: 200ms;
}

.transition-all {
  transition-property: all;
  transition-duration: 200ms;
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

/* Better focus states for accessibility */
button:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Scrollbar styling */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.overflow-x-auto::-webkit-scrollbar {
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

.dark .overflow-x-auto::-webkit-scrollbar-track {
  background: #374151;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb {
  background: #4b5563;
}

/* Image optimization */
img {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

/* Reduce motion support */
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

/* Fix for very small screens */
@media (max-width: 400px) {
  .hidden.xs\:inline {
    display: none;
  }
  
  /* Adjust padding for small screens */
  .p-4 {
    padding: 0.75rem;
  }
  
  /* Smaller font sizes */
  .text-lg {
    font-size: 1.125rem;
  }
  
  .text-sm {
    font-size: 0.75rem;
  }
  
  .text-xs {
    font-size: 0.625rem;
  }
}

/* Ensure proper spacing */
.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

/* Improve hover states */
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Active state for mobile */
.active\:scale-95:active {
  transform: scale(0.95);
}

/* Modal z-index fix */
.fixed {
  isolation: isolate;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
}

/* Memory optimization */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Fix modal scrolling on mobile */
@media (max-width: 768px) {
  body.modal-open {
    overflow: hidden;
    position: fixed;
    width: 100%;
    height: 100%;
  }
}

/* Optimize for low-end devices */
@media (max-width: 768px) and (max-device-width: 1024px) {
  /* Reduce animations on mobile */
  .transition-colors {
    transition-duration: 150ms;
  }
}
</style>