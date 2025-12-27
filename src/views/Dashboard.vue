<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Header Section (Optimized) -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
          <div>
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">لوحة تحكم المخازن</h1>
            <p class="text-blue-100 dark:text-blue-200 opacity-90 text-sm sm:text-base">نظرة شاملة على أداء المخازن والحركات اليومية</p>
          </div>
          
          <!-- Time and Date (Optimized) -->
          <div class="flex items-center gap-3 sm:gap-4 bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 sm:py-3">
            <div class="text-center">
              <div class="text-lg sm:text-xl lg:text-2xl font-bold">{{ currentTime }}</div>
              <div class="text-xs sm:text-sm opacity-90">{{ currentDate }}</div>
            </div>
            <div class="h-8 sm:h-10 w-px bg-white/20"></div>
            <div class="text-center">
              <div class="text-xs sm:text-sm opacity-90">آخر تحديث</div>
              <div class="font-medium text-sm sm:text-base">{{ formatRelativeTime(lastUpdated) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
      <!-- Loading Overlay -->
      <div v-if="initialLoading" class="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 z-50 flex flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">جاري تحميل البيانات...</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">يرجى الانتظار</p>
      </div>

      <!-- Warehouse Filter Section (Optimized) -->
      <div class="mb-6 sm:mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            <div>
              <h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">تصفية حسب المخزن</h2>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">اختر مخزن لعرض إحصائياته وحركاته</p>
            </div>
            
            <div class="flex gap-2 sm:gap-3">
              <select 
                v-model="selectedWarehouse"
                @change="handleWarehouseChange"
                :disabled="warehousesLoading"
                class="flex-1 min-w-[160px] sm:min-w-[200px] px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none text-sm sm:text-base"
              >
                <option value="all">🏢 جميع المخازن</option>
                <option 
                  v-for="warehouse in warehouses" 
                  :key="warehouse.id" 
                  :value="warehouse.id"
                  class="py-2"
                >
                  📦 {{ warehouse.name_ar || warehouse.name }}
                </option>
              </select>
              
              <button
                @click="refreshDashboard"
                :disabled="loading || statsLoading || loadMoreLoading || warehousesLoading"
                class="px-3 sm:px-5 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg sm:rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
              >
                <svg v-if="loading || statsLoading" class="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-else class="text-xs sm:text-base">🔄 تحديث</span>
              </button>
            </div>
          </div>
          
          <!-- Warehouse Info (Optimized) -->
          <div v-if="selectedWarehouse !== 'all'" class="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div class="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:rounded-xl">
              <div class="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
                <svg class="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <div class="min-w-0">
                <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">المخزن المحدد</div>
                <div class="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate">{{ getWarehouseLabel(selectedWarehouse) }}</div>
              </div>
            </div>
            
            <div class="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg sm:rounded-xl">
              <div class="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-green-100 dark:bg-green-800 flex items-center justify-center flex-shrink-0">
                <svg class="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="min-w-0">
                <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">النسبة من الكلية</div>
                <div class="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                  {{ allWarehouseStats.totalQuantity > 0 ? ((dashboardStats.totalQuantity / allWarehouseStats.totalQuantity) * 100).toFixed(1) : '0' }}%
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg sm:rounded-xl">
              <div class="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-purple-100 dark:bg-purple-800 flex items-center justify-center flex-shrink-0">
                <svg class="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="min-w-0">
                <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">آخر نشاط</div>
                <div class="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate">{{ lastActivityTime }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Stats Grid (Optimized with skeleton loading) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <!-- Total Items Card -->
        <div class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-start justify-between">
            <div class="min-w-0 flex-1">
              <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">إجمالي الأصناف</p>
              <div v-if="statsLoading" class="h-7 sm:h-8 w-20 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <p v-else class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {{ formatEnglishNumber(dashboardStats.totalItems) }}
              </p>
              <div v-if="selectedWarehouse !== 'all' && allWarehouseStats.totalItems > 0" class="mt-1 sm:mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span class="inline-flex items-center gap-1">
                  <svg class="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                  {{ ((dashboardStats.totalItems / allWarehouseStats.totalItems) * 100).toFixed(1) }}% من المجموع
                </span>
              </div>
            </div>
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center flex-shrink-0">
              <svg class="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
          </div>
          <div class="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between text-xs sm:text-sm">
              <span class="text-gray-500 dark:text-gray-400">متوسط الكمية لكل صنف</span>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ dashboardStats.totalItems > 0 ? Math.round(dashboardStats.totalQuantity / dashboardStats.totalItems) : 0 }}
              </span>
            </div>
          </div>
        </div>

        <!-- Total Quantity Card -->
        <div class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-start justify-between">
            <div class="min-w-0 flex-1">
              <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">إجمالي الكمية</p>
              <div v-if="statsLoading" class="h-7 sm:h-8 w-20 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <p v-else class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {{ formatEnglishNumber(dashboardStats.totalQuantity) }}
              </p>
              <div class="mt-1 sm:mt-2">
                <div class="grid grid-cols-2 gap-1 sm:gap-2">
                  <span class="inline-flex items-center gap-1 text-xs sm:text-sm">
                    <div class="h-2 w-2 rounded-full bg-green-500"></div>
                    <span class="truncate">كراتين: {{ formatEnglishNumber(totalCartons) }}</span>
                  </span>
                  <span class="inline-flex items-center gap-1 text-xs sm:text-sm">
                    <div class="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span class="truncate">فردي: {{ formatEnglishNumber(totalSingles) }}</span>
                  </span>
                </div>
              </div>
            </div>
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
              <svg class="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between text-xs sm:text-sm">
              <span class="text-gray-500 dark:text-gray-400">قيمة تقديرية</span>
              <span class="font-medium text-green-600 dark:text-green-400">
                {{ formatEnglishNumber(Math.round(dashboardStats.totalQuantity * 25)) }} جنيه
              </span>
            </div>
          </div>
        </div>

        <!-- Stock Status Card -->
        <div class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-start justify-between">
            <div class="min-w-0 flex-1">
              <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">حالة المخزون</p>
              <div v-if="statsLoading" class="h-7 sm:h-8 w-20 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div v-else>
                <div class="flex items-baseline gap-2">
                  <span class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                    {{ formatEnglishNumber(dashboardStats.lowStockItems) }}
                  </span>
                  <span class="text-xs sm:text-sm text-red-600 dark:text-red-400">قليلة</span>
                </div>
                <div class="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <span class="inline-flex items-center gap-1">
                    <svg class="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    {{ formatEnglishNumber(outOfStockItems) }} منتهية
                  </span>
                </div>
              </div>
            </div>
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-orange-100 dark:bg-orange-900 flex items-center justify-center flex-shrink-0">
              <svg class="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
            <div class="text-xs sm:text-sm">
              <div class="flex items-center justify-between mb-1">
                <span class="text-gray-500 dark:text-gray-400">نسبة المخزون الجيد</span>
                <span class="font-medium text-green-600 dark:text-green-400">
                  {{ stockHealthPercentage }}%
                </span>
              </div>
              <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  :class="stockHealthColor"
                  class="h-full rounded-full transition-all duration-500"
                  :style="{ width: stockHealthPercentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Today's Activity Card -->
        <div class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-start justify-between">
            <div class="min-w-0 flex-1">
              <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">نشاط اليوم</p>
              <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {{ formatEnglishNumber(todayTransactions.length) }}
              </p>
              <div class="mt-1 sm:mt-2 grid grid-cols-3 gap-1 sm:gap-2">
                <div class="text-center">
                  <div class="h-5 w-5 sm:h-6 sm:w-6 mx-auto rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-1">
                    <span class="text-xs font-bold text-green-600 dark:text-green-400">+</span>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ todayAddCount }}</span>
                </div>
                <div class="text-center">
                  <div class="h-5 w-5 sm:h-6 sm:w-6 mx-auto rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-1">
                    <span class="text-xs font-bold text-blue-600 dark:text-blue-400">↔</span>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ todayTransferCount }}</span>
                </div>
                <div class="text-center">
                  <div class="h-5 w-5 sm:h-6 sm:w-6 mx-auto rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-1">
                    <span class="text-xs font-bold text-purple-600 dark:text-purple-400">→</span>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ todayDispatchCount }}</span>
                </div>
              </div>
            </div>
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
              <svg class="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
          </div>
          <div class="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between text-xs sm:text-sm">
              <span class="text-gray-500 dark:text-gray-400">آخر حركة</span>
              <span class="font-medium text-gray-900 dark:text-white truncate">{{ lastTransactionTime }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Warehouse Statistics Section -->
      <div v-if="selectedWarehouse === 'all'" class="mb-6 sm:mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
          <h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">إحصائيات جميع المخازن</h2>
          
          <div v-if="warehouseStatsLoading" class="py-6 sm:py-8 text-center">
            <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">جاري تحميل إحصائيات المخازن...</p>
          </div>
          
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th class="px-3 py-2 sm:px-4 sm:py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    المخزن
                  </th>
                  <th class="px-3 py-2 sm:px-4 sm:py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    إجمالي الأصناف
                  </th>
                  <th class="px-3 py-2 sm:px-4 sm:py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    إجمالي الكمية
                  </th>
                  <th class="px-3 py-2 sm:px-4 sm:py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    الأصناف قليلة المخزون
                  </th>
                  <th class="px-3 py-2 sm:px-4 sm:py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    الأصناف المنتهية
                  </th>
                  <th class="px-3 py-2 sm:px-4 sm:py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    نسبة المخزون الجيد
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(stats, warehouseId) in allWarehousesStats" :key="warehouseId" 
                    class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <td class="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                    <div class="flex items-center min-w-0">
                      <div class="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                        <svg class="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                      </div>
                      <div class="min-w-0">
                        <div class="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {{ getWarehouseLabel(warehouseId) }}
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {{ formatEnglishNumber(stats.totalItems) }} صنف
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                    <div class="text-sm font-bold text-gray-900 dark:text-white">
                      {{ formatEnglishNumber(stats.totalItems) }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ allWarehouseStats.totalItems > 0 ? ((stats.totalItems / allWarehouseStats.totalItems) * 100).toFixed(1) : '0' }}%
                    </div>
                  </td>
                  <td class="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                    <div class="text-sm font-bold text-gray-900 dark:text-white">
                      {{ formatEnglishNumber(stats.totalQuantity) }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ allWarehouseStats.totalQuantity > 0 ? ((stats.totalQuantity / allWarehouseStats.totalQuantity) * 100).toFixed(1) : '0' }}%
                    </div>
                  </td>
                  <td class="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                    <div class="text-sm font-medium" :class="stats.lowStockItems > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'">
                      {{ formatEnglishNumber(stats.lowStockItems) }}
                    </div>
                  </td>
                  <td class="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                    <div class="text-sm font-medium" :class="stats.outOfStockItems > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'">
                      {{ formatEnglishNumber(stats.outOfStockItems) }}
                    </div>
                  </td>
                  <td class="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                    <div class="flex items-center gap-1 sm:gap-2">
                      <div class="flex-1 min-w-[60px] sm:min-w-[80px]">
                        <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            :class="getHealthColorClass(stats.healthPercentage)"
                            class="h-full rounded-full"
                            :style="{ width: stats.healthPercentage + '%' }"
                          ></div>
                        </div>
                      </div>
                      <span class="text-sm font-medium" :class="getHealthTextClass(stats.healthPercentage)">
                        {{ stats.healthPercentage }}%
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <td class="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                    <div class="text-sm font-bold text-gray-900 dark:text-white">المجموع الكلي</div>
                  </td>
                  <td class="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                    <div class="text-sm font-bold text-gray-900 dark:text-white">
                      {{ formatEnglishNumber(allWarehouseStats.totalItems) }}
                    </div>
                  </td>
                  <td class="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                    <div class="text-sm font-bold text-gray-900 dark:text-white">
                      {{ formatEnglishNumber(allWarehouseStats.totalQuantity) }}
                    </div>
                  </td>
                  <td class="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                    <div class="text-sm font-bold text-orange-600 dark:text-orange-400">
                      {{ formatEnglishNumber(allWarehouseStats.lowStockItems) }}
                    </div>
                  </td>
                  <td class="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                    <div class="text-sm font-bold text-red-600 dark:text-red-400">
                      {{ formatEnglishNumber(allWarehouseStats.outOfStockItems) }}
                    </div>
                  </td>
                  <td class="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                    <div class="flex items-center gap-1 sm:gap-2">
                      <div class="flex-1 min-w-[60px] sm:min-w-[80px]">
                        <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            :class="stockHealthColor"
                            class="h-full rounded-full"
                            :style="{ width: stockHealthPercentage + '%' }"
                          ></div>
                        </div>
                      </div>
                      <span class="text-sm font-bold" :class="getHealthTextClass(stockHealthPercentage)">
                        {{ stockHealthPercentage }}%
                      </span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Recent Items -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <!-- Quick Actions -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700 h-full">
            <h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">الإجراءات السريعة</h2>
            <div class="space-y-2 sm:space-y-3">
              <router-link 
                to="/inventory"
                class="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 group"
              >
                <div class="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                  <svg class="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">المخزون الكامل</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 truncate">عرض جميع الأصناف</div>
                </div>
                <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </router-link>

              <router-link 
                to="/reports"
                class="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 group"
              >
                <div class="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                  <svg class="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">التقارير</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 truncate">تحليل كامل للأداء</div>
                </div>
                <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </router-link>

              <router-link 
                v-if="canModifyItems"
                to="/inventory/add"
                class="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 group"
              >
                <div class="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                  <svg class="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">إضافة صنف</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 truncate">إضافة صنف جديد</div>
                </div>
                <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </router-link>

              <router-link 
                to="/transactions"
                class="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 group"
              >
                <div class="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                  <svg class="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">الحركات</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 truncate">سجل الحركات الكامل</div>
                </div>
                <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Recent Items -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700 h-full">
            <div class="flex items-center justify-between mb-4 sm:mb-6">
              <div class="min-w-0">
                <h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">آخر الأصناف المضافة</h2>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">أحدث 8 أصناف {{ selectedWarehouse !== 'all' ? 'في المخزن المحدد' : 'في النظام' }}</p>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span class="text-xs px-2 py-1 rounded-full" :class="recentItemsStatusClass">
                  {{ recentItemsCount }} صنف
                </span>
              </div>
            </div>

            <div v-if="loading" class="text-center py-6 sm:py-8">
              <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">جاري تحميل الأصناف...</p>
            </div>

            <div v-else-if="filteredRecentInventory.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div 
                v-for="item in filteredRecentInventory" 
                :key="item.id"
                class="group bg-gray-50 dark:bg-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-md cursor-pointer"
                @click="openItemModal(item)"
              >
                <div class="flex items-start gap-2 sm:gap-3">
                  <div class="relative flex-shrink-0">
                    <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-600">
                      <img 
                        v-if="item.photo_url" 
                        :src="item.photo_url" 
                        :alt="item.name"
                        class="h-full w-full object-cover"
                        @error="handleImageError"
                      >
                      <div v-else class="h-full w-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                        <svg class="h-4 w-4 sm:h-6 sm:w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </div>
                    </div>
                    <span :class="getStatusClass(item.remaining_quantity)" 
                          class="absolute -top-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 rounded-full border-2 border-white dark:border-gray-800"></span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between">
                      <h3 class="font-medium text-gray-900 dark:text-white truncate text-sm sm:text-base">{{ item.name }}</h3>
                      <span :class="getQuantityClass(item.remaining_quantity)" class="font-bold text-base sm:text-lg flex-shrink-0 ml-2">
                        {{ formatEnglishNumber(item.remaining_quantity) }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-xs font-mono bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded truncate">
                        {{ item.code }}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {{ item.color || 'بدون لون' }}
                      </span>
                    </div>
                    <div class="flex items-center justify-between mt-2">
                      <span class="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {{ getWarehouseLabel(item.warehouse_id) }}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {{ formatRelativeTime(item.created_at || item.updated_at) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-6 sm:py-8">
              <svg class="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">لا توجد أصناف</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">لم يتم إضافة أي أصناف بعد.</p>
            </div>

            <!-- Load More Button -->
            <div v-if="hasMoreItems && !loading" class="mt-4 sm:mt-6 text-center">
              <button
                @click="loadMoreItems"
                :disabled="loadMoreLoading"
                class="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg sm:rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto text-sm sm:text-base"
              >
                <svg v-if="loadMoreLoading" class="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-else>⬇️ تحميل المزيد (50 صنف)</span>
              </button>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                تم تحميل {{ totalLoadedItems }} من أصل {{ totalItemsCount }} صنف
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between mb-4 sm:mb-6">
          <div class="min-w-0">
            <h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">آخر الحركات</h2>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">أحدث 10 حركات {{ selectedWarehouse !== 'all' ? 'في المخزن المحدد' : 'في النظام' }}</p>
          </div>
          <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div class="flex items-center gap-1 sm:gap-2">
              <div class="h-2 w-2 rounded-full bg-green-500"></div>
              <span class="text-xs text-gray-500 dark:text-gray-400">إضافة</span>
            </div>
            <div class="flex items-center gap-1 sm:gap-2">
              <div class="h-2 w-2 rounded-full bg-blue-500"></div>
              <span class="text-xs text-gray-500 dark:text-gray-400">نقل</span>
            </div>
            <div class="flex items-center gap-1 sm:gap-2">
              <div class="h-2 w-2 rounded-full bg-purple-500"></div>
              <span class="text-xs text-gray-500 dark:text-gray-400">صرف</span>
            </div>
          </div>
        </div>

        <div v-if="loading" class="text-center py-6 sm:py-8">
          <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">جاري تحميل الحركات...</p>
        </div>

        <div v-else-if="filteredRecentTransactions.length > 0" class="space-y-3 sm:space-y-4">
          <div 
            v-for="transaction in filteredRecentTransactions.slice(0, 10)" 
            :key="transaction.id"
            class="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
          >
            <!-- Transaction Icon -->
            <div :class="[
              'h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center flex-shrink-0',
              transaction.type === 'ADD' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' :
              transaction.type === 'TRANSFER' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' :
              'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
            ]">
              <svg class="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="transaction.type === 'ADD'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                <path v-if="transaction.type === 'TRANSFER'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                <path v-if="transaction.type === 'DISPATCH'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </div>

            <!-- Transaction Details -->
            <div class="flex-1 min-w-0">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                <div class="min-w-0">
                  <h4 class="font-medium text-gray-900 dark:text-white truncate text-sm sm:text-base">{{ transaction.item_name }}</h4>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ transaction.item_code }}</span>
                    <span class="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 truncate">
                      {{ getTransactionTypeLabel(transaction.type) }}
                    </span>
                  </div>
                </div>
                <span :class="[
                  'font-bold text-base sm:text-lg flex-shrink-0',
                  transaction.type === 'ADD' ? 'text-green-600 dark:text-green-400' :
                  'text-red-600 dark:text-red-400'
                ]">
                  {{ transaction.type === 'ADD' ? '+' : '' }}{{ formatEnglishNumber(transaction.total_delta || 0) }}
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 sm:mt-3">
                <div class="flex items-center gap-1 sm:gap-2">
                  <svg class="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                    <template v-if="transaction.type === 'TRANSFER'">
                      من {{ getWarehouseLabel(transaction.from_warehouse) }} → إلى {{ getWarehouseLabel(transaction.to_warehouse) }}
                    </template>
                    <template v-else-if="transaction.type === 'DISPATCH'">
                      من {{ getWarehouseLabel(transaction.from_warehouse) }} → {{ getDestinationLabel(transaction.destination) }}
                    </template>
                    <template v-else>
                      {{ getWarehouseLabel(transaction.to_warehouse) }}
                    </template>
                  </span>
                </div>

                <div class="flex items-center gap-1 sm:gap-2">
                  <svg class="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{{ transaction.created_by || 'نظام' }}</span>
                </div>

                <div class="flex items-center gap-1 sm:gap-2">
                  <svg class="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                    {{ formatDetailedTime(transaction.timestamp) }}
                    <span class="text-xs text-gray-500">({{ formatRelativeTime(transaction.timestamp) }})</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-6 sm:py-8">
          <svg class="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">لا توجد حركات</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">لم تتم أي حركات في هذا المخزن.</p>
        </div>
      </div>
    </div>

    <!-- Item Details Modal -->
    <div v-if="showItemModal" class="fixed inset-0 z-50 overflow-y-auto">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeItemModal"></div>

      <!-- Modal Container -->
      <div class="flex min-h-full items-center justify-center p-2 sm:p-4">
        <!-- Modal Content -->
        <div class="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden transition-all duration-300 transform scale-100">
          <!-- Modal Header -->
          <div class="sticky top-0 z-10 bg-white dark:bg-gray-800 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 sm:gap-3 min-w-0">
                <div class="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                  <svg class="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                </div>
                <div class="min-w-0">
                  <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">تفاصيل الصنف</h2>
                  <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">المعلومات الكاملة عن الصنف المحدد</p>
                </div>
              </div>
              <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <!-- Edit Button -->
                <button 
                  v-if="canModifyItems"
                  @click="editItem"
                  class="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-1 sm:gap-2 text-sm"
                >
                  <svg class="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  تعديل
                </button>
                <!-- Close Button -->
                <button 
                  @click="closeItemModal"
                  class="p-1.5 sm:p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <svg class="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="px-3 sm:px-6 py-4 sm:py-5 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div v-if="modalLoading" class="py-12 sm:py-20 text-center">
              <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-400">جاري تحميل تفاصيل الصنف...</p>
            </div>

            <div v-else-if="selectedItem" class="space-y-4 sm:space-y-6">
              <!-- Item Header -->
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <!-- Item Image -->
                <div class="lg:col-span-1">
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6 h-full flex flex-col items-center justify-center">
                    <div class="relative w-32 h-32 sm:w-48 sm:h-48 rounded-xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg mb-3 sm:mb-4">
                      <img 
                        v-if="selectedItem.photo_url" 
                        :src="selectedItem.photo_url" 
                        :alt="selectedItem.name"
                        class="w-full h-full object-cover"
                        @error="handleModalImageError"
                      >
                      <div v-else class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                        <svg class="h-12 w-12 sm:h-20 sm:w-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </div>
                      <div :class="[
                        'absolute top-2 sm:top-3 right-2 sm:right-3 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold',
                        selectedItem.remaining_quantity === 0 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        selectedItem.remaining_quantity < 10 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      ]">
                        {{ selectedItem.remaining_quantity === 0 ? 'منتهي' : 
                           selectedItem.remaining_quantity < 10 ? 'قليل' : 'متوفر' }}
                      </div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2" :class="getQuantityClass(selectedItem.remaining_quantity)">
                        {{ formatEnglishNumber(selectedItem.remaining_quantity) }}
                      </div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">الكمية المتاحة</p>
                    </div>
                  </div>
                </div>

                <!-- Item Info -->
                <div class="lg:col-span-2">
                  <div class="space-y-4 sm:space-y-6">
                    <!-- Basic Info -->
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6">
                      <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">المعلومات الأساسية</h3>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">اسم الصنف</label>
                          <p class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">{{ selectedItem.name }}</p>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">الكود</label>
                          <p class="text-base sm:text-lg font-mono font-bold text-blue-600 dark:text-blue-400 truncate">{{ selectedItem.code }}</p>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">اللون</label>
                          <div class="flex items-center gap-2">
                            <div 
                              v-if="selectedItem.color" 
                              class="h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0"
                              :style="{ backgroundColor: selectedItem.color }"
                            ></div>
                            <span class="text-gray-900 dark:text-white truncate">{{ selectedItem.color || 'بدون لون' }}</span>
                          </div>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">الحجم</label>
                          <p class="text-gray-900 dark:text-white truncate">{{ selectedItem.size || 'غير محدد' }}</p>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">المخزن</label>
                          <div class="flex items-center gap-2">
                            <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                            </svg>
                            <span class="text-gray-900 dark:text-white truncate">{{ getWarehouseLabel(selectedItem.warehouse_id) }}</span>
                          </div>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">آخر تحديث</label>
                          <div class="flex items-center gap-2">
                            <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span class="text-gray-900 dark:text-white truncate">{{ formatRelativeTime(selectedItem.updated_at || selectedItem.created_at) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Quantity Details -->
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6">
                      <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">تفاصيل الكمية</h3>
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        <div class="text-center">
                          <div class="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2">
                            {{ formatEnglishNumber(selectedItem.cartons_count || 0) }}
                          </div>
                          <p class="text-sm text-gray-500 dark:text-gray-400">عدد الكراتين</p>
                          <div class="text-xs text-gray-400 mt-1">
                            × {{ selectedItem.per_carton_count || 12 }} لكل كرتون
                          </div>
                        </div>
                        <div class="text-center">
                          <div class="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1 sm:mb-2">
                            {{ formatEnglishNumber(selectedItem.single_bottles_count || 0) }}
                          </div>
                          <p class="text-sm text-gray-500 dark:text-gray-400">عدد الفردي</p>
                        </div>
                        <div class="text-center">
                          <div class="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1 sm:mb-2">
                            {{ formatEnglishNumber(selectedItem.remaining_quantity) }}
                          </div>
                          <p class="text-sm text-gray-500 dark:text-gray-400">المجموع الكلي</p>
                          <div class="text-xs text-gray-400 mt-1">
                            {{ calculateTotalQuantity(selectedItem) }} وحدة
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Additional Info -->
                    <div v-if="selectedItem.description || selectedItem.notes" class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6">
                      <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">معلومات إضافية</h3>
                      <div class="space-y-3 sm:space-y-4">
                        <div v-if="selectedItem.description">
                          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">الوصف</label>
                          <p class="text-gray-900 dark:text-white whitespace-pre-line break-words">{{ selectedItem.description }}</p>
                        </div>
                        <div v-if="selectedItem.notes">
                          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">ملاحظات</label>
                          <p class="text-gray-900 dark:text-white whitespace-pre-line break-words">{{ selectedItem.notes }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recent Transactions for this item -->
              <div v-if="itemTransactions.length > 0" class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6">
                <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">آخر الحركات لهذا الصنف</h3>
                <div class="space-y-2 sm:space-y-3">
                  <div 
                    v-for="trans in itemTransactions.slice(0, 5)" 
                    :key="trans.id"
                    class="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-600"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div :class="[
                          'h-7 w-7 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center flex-shrink-0',
                          trans.type === 'ADD' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' :
                          trans.type === 'TRANSFER' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' :
                          'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                        ]">
                          <svg class="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path v-if="trans.type === 'ADD'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                            <path v-if="trans.type === 'TRANSFER'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                            <path v-if="trans.type === 'DISPATCH'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                          </svg>
                        </div>
                        <div class="min-w-0">
                          <span class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ getTransactionTypeLabel(trans.type) }}</span>
                          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {{ formatDetailedTime(trans.timestamp) }} 
                            ({{ formatRelativeTime(trans.timestamp) }})
                          </p>
                        </div>
                      </div>
                      <div class="text-right flex-shrink-0 ml-2">
                        <span :class="[
                          'font-bold text-sm sm:text-base',
                          trans.type === 'ADD' ? 'text-green-600 dark:text-green-400' :
                          'text-red-600 dark:text-red-400'
                        ]">
                          {{ trans.type === 'ADD' ? '+' : '' }}{{ formatEnglishNumber(trans.total_delta || 0) }}
                        </span>
                        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {{ trans.created_by || 'نظام' }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="sticky bottom-0 bg-white dark:bg-gray-800 px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
              <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                {{ selectedItem ? `معرف الصنف: ${selectedItem.id}` : '' }}
              </div>
              <div class="flex items-center gap-2 sm:gap-3">
                <button
                  @click="closeItemModal"
                  class="px-3 sm:px-5 py-1.5 sm:py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm sm:text-base"
                >
                  إغلاق
                </button>
                <router-link 
                  v-if="selectedItem"
                  :to="`/inventory/${selectedItem.id}`"
                  class="px-3 sm:px-5 py-1.5 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                >
                  <svg class="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  عرض كامل التفاصيل
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Dashboard',
  setup() {
    const store = useStore();
    const router = useRouter();
    
    const loading = ref(true);
    const initialLoading = ref(true);
    const statsLoading = ref(false);
    const warehouseStatsLoading = ref(false);
    const loadMoreLoading = ref(false);
    const warehousesLoading = ref(false);
    const selectedWarehouse = ref('all');
    const currentTime = ref('');
    const currentDate = ref('');
    const lastUpdated = ref(new Date());
    
    // Modal state
    const showItemModal = ref(false);
    const selectedItem = ref(null);
    const modalLoading = ref(false);
    const itemTransactions = ref([]);
    
    // Store stats
    const dashboardStats = ref({
      totalItems: 0,
      totalQuantity: 0,
      lowStockItems: 0,
      outOfStockItems: 0,
      lastUpdated: null
    });
    
    const allWarehouseStats = ref({
      totalItems: 0,
      totalQuantity: 0,
      lowStockItems: 0,
      outOfStockItems: 0
    });

    // Warehouse-specific stats
    const allWarehousesStats = ref({});

    // Computed properties
    const userRole = computed(() => store.getters.userRole || '');
    
    const warehouses = computed(() => {
      try {
        return store.getters.warehouses || [];
      } catch (error) {
        console.error('Error getting warehouses:', error);
        return [];
      }
    });
    
    const inventoryItems = computed(() => {
      try {
        const inventory = store.getters.inventoryItems || [];
        return Array.isArray(inventory) ? inventory : [];
      } catch (error) {
        console.error('Error getting inventory items:', error);
        return [];
      }
    });
    
    const recentStoreTransactions = computed(() => {
      try {
        const items = store.getters.recentTransactions || [];
        return Array.isArray(items) ? items : [];
      } catch (error) {
        console.error('Error getting recent transactions:', error);
        return [];
      }
    });
    
    // Pagination getters
    const hasMoreItems = computed(() => store.getters.hasMore || false);
    const totalLoadedItems = computed(() => store.getters.totalLoaded || 0);
    const isFetchingMore = computed(() => store.getters.isFetchingMore || false);
    
    const canModifyItems = computed(() => {
      try {
        const role = userRole.value;
        const userProfile = store.state.userProfile || {};
        
        if (role === 'superadmin') return true;
        
        if (role === 'warehouse_manager') {
          const allowedWarehouses = userProfile?.allowed_warehouses || [];
          const hasWarehouses = allowedWarehouses.length > 0;
          const hasPermission = userProfile?.permissions?.includes('full_access') || 
                                userProfile?.permissions?.includes('manage_inventory') ||
                                userProfile?.permissions?.includes('add_items');
          return hasWarehouses && hasPermission;
        }
        
        return false;
      } catch (error) {
        console.error('Error checking permissions:', error);
        return false;
      }
    });

    // Get total items count from store action
    const totalItemsCount = ref(0);
    
    // Today's transactions
    const todayTransactions = computed(() => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      return recentStoreTransactions.value.filter(transaction => {
        try {
          if (!transaction.timestamp) return false;
          const transDate = transaction.timestamp?.toDate ? 
            transaction.timestamp.toDate() : new Date(transaction.timestamp);
          return transDate >= today;
        } catch (error) {
          return false;
        }
      });
    });

    const todayAddCount = computed(() => {
      return todayTransactions.value.filter(t => t.type === 'ADD').length;
    });

    const todayTransferCount = computed(() => {
      return todayTransactions.value.filter(t => t.type === 'TRANSFER').length;
    });

    const todayDispatchCount = computed(() => {
      return todayTransactions.value.filter(t => t.type === 'DISPATCH').length;
    });

    const lastTransactionTime = computed(() => {
      if (todayTransactions.value.length === 0) return 'لا توجد حركات';
      const last = todayTransactions.value[0];
      try {
        const date = last.timestamp?.toDate ? 
          last.timestamp.toDate() : new Date(last.timestamp);
        return formatRelativeTime(date);
      } catch (error) {
        return 'غير معروف';
      }
    });

    const lastActivityTime = computed(() => {
      const transactions = filteredRecentTransactions.value;
      if (transactions.length === 0) return 'لا يوجد نشاط';
      return formatRelativeTime(transactions[0]?.timestamp);
    });

    // Filter inventory based on selected warehouse
    const filteredInventory = computed(() => {
      if (selectedWarehouse.value === 'all') {
        return inventoryItems.value;
      }
      return inventoryItems.value.filter(item => item.warehouse_id === selectedWarehouse.value);
    });

    // Recent inventory (last 8 items, filtered by warehouse)
    const filteredRecentInventory = computed(() => {
      const items = filteredInventory.value;
      if (!Array.isArray(items) || items.length === 0) return [];
      
      return [...items]
        .filter(item => item && typeof item === 'object')
        .sort((a, b) => {
          try {
            const dateA = new Date(a.created_at || a.updated_at || 0);
            const dateB = new Date(b.created_at || b.updated_at || 0);
            return dateB - dateA;
          } catch (error) {
            return 0;
          }
        })
        .slice(0, 8);
    });

    const recentItemsCount = computed(() => filteredRecentInventory.value.length);

    const recentItemsStatusClass = computed(() => {
      const count = recentItemsCount.value;
      if (count === 0) return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
      if (count < 4) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300';
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300';
    });

    // Filter transactions based on selected warehouse
    const filteredRecentTransactions = computed(() => {
      if (selectedWarehouse.value === 'all') {
        return recentStoreTransactions.value;
      }
      
      return recentStoreTransactions.value.filter(transaction => 
        transaction.from_warehouse === selectedWarehouse.value || 
        transaction.to_warehouse === selectedWarehouse.value
      );
    });

    // Calculate stock totals
    const totalCartons = computed(() => {
      return filteredInventory.value.reduce((sum, item) => {
        return sum + (item.cartons_count || 0) * (item.per_carton_count || 12);
      }, 0);
    });

    const totalSingles = computed(() => {
      return filteredInventory.value.reduce((sum, item) => sum + (item.single_bottles_count || 0), 0);
    });

    const outOfStockItems = computed(() => {
      return filteredInventory.value.filter(item => (item.remaining_quantity || 0) === 0).length;
    });

    const stockHealthPercentage = computed(() => {
      const total = dashboardStats.value.totalItems;
      const healthy = total - dashboardStats.value.lowStockItems - outOfStockItems.value;
      return total > 0 ? Math.round((healthy / total) * 100) : 0;
    });

    const stockHealthColor = computed(() => {
      const percentage = stockHealthPercentage.value;
      if (percentage >= 80) return 'bg-green-500';
      if (percentage >= 60) return 'bg-yellow-500';
      return 'bg-red-500';
    });

    // Helper functions
    const formatEnglishNumber = (num) => {
      if (isNaN(num) || num === null || num === undefined) return '0';
      return new Intl.NumberFormat('en-US').format(num);
    };

    const formatDetailedTime = (timestamp) => {
      if (!timestamp) return '';
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      } catch (error) {
        return '';
      }
    };

    const formatRelativeTime = (timestamp) => {
      if (!timestamp) return '';
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMins < 1) return 'الآن';
        if (diffMins < 60) return `قبل ${diffMins} دقيقة`;
        if (diffHours < 24) return `قبل ${diffHours} ساعة`;
        if (diffDays === 1) return 'أمس';
        if (diffDays < 7) return `قبل ${diffDays} أيام`;
        return date.toLocaleDateString('ar-EG');
      } catch (error) {
        return '';
      }
    };

    const getWarehouseLabel = (warehouseId) => {
      if (!warehouseId) return '';
      try {
        return store.getters.getWarehouseLabel(warehouseId) || warehouseId;
      } catch (error) {
        return warehouseId;
      }
    };

    const getDestinationLabel = (destinationId) => {
      if (!destinationId) return '';
      try {
        return store.getters.getDestinationLabel(destinationId) || destinationId;
      } catch (error) {
        return destinationId;
      }
    };

    const getTransactionTypeLabel = (type) => {
      const labels = {
        'ADD': 'إضافة',
        'TRANSFER': 'نقل',
        'DISPATCH': 'صرف',
        'UPDATE': 'تحديث',
        'DELETE': 'حذف'
      };
      return labels[type] || type;
    };

    const getQuantityClass = (quantity) => {
      if (!quantity || quantity === 0) return 'text-red-600 dark:text-red-400';
      if (quantity < 10) return 'text-orange-600 dark:text-orange-400';
      return 'text-green-600 dark:text-green-400';
    };

    const getStatusClass = (quantity) => {
      if (!quantity || quantity === 0) return 'bg-red-500';
      if (quantity < 5) return 'bg-orange-500';
      return 'bg-green-500';
    };

    const getHealthColorClass = (percentage) => {
      if (percentage >= 80) return 'bg-green-500';
      if (percentage >= 60) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    const getHealthTextClass = (percentage) => {
      if (percentage >= 80) return 'text-green-600 dark:text-green-400';
      if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
      return 'text-red-600 dark:text-red-400';
    };

    const calculateTotalQuantity = (item) => {
      const cartons = item.cartons_count || 0;
      const perCarton = item.per_carton_count || 12;
      const singles = item.single_bottles_count || 0;
      return (cartons * perCarton) + singles;
    };

    const handleImageError = (event) => {
      event.target.style.display = 'none';
      event.target.parentElement.classList.add('bg-gray-200', 'dark:bg-gray-700');
    };

    const handleModalImageError = (event) => {
      event.target.style.display = 'none';
      event.target.parentElement.classList.add('bg-gray-200', 'dark:bg-gray-700');
    };

    // Modal functions
    const openItemModal = async (item) => {
      selectedItem.value = item;
      modalLoading.value = true;
      showItemModal.value = true;
      
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Load item transactions
      try {
        // Filter transactions for this specific item
        itemTransactions.value = recentStoreTransactions.value.filter(trans => 
          trans.item_id === item.id || trans.item_code === item.code
        ).slice(0, 10);
      } catch (error) {
        console.error('Error loading item transactions:', error);
        itemTransactions.value = [];
      } finally {
        modalLoading.value = false;
      }
    };

    const closeItemModal = () => {
      showItemModal.value = false;
      selectedItem.value = null;
      itemTransactions.value = [];
      
      // Restore body scroll
      document.body.style.overflow = '';
    };

    const editItem = () => {
      if (selectedItem.value) {
        router.push(`/inventory/edit/${selectedItem.value.id}`);
      }
    };

    // Update time
    const updateTime = () => {
      const now = new Date();
      currentTime.value = now.toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      currentDate.value = now.toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    // Load statistics for a specific warehouse
    const loadWarehouseStats = async (warehouseId) => {
      try {
        const inventory = inventoryItems.value;
        const warehouseInventory = warehouseId === 'all' 
          ? inventory 
          : inventory.filter(item => item.warehouse_id === warehouseId);
        
        const totalQuantity = warehouseInventory.reduce((sum, item) => {
          const cartons = item.cartons_count || 0;
          const perCarton = item.per_carton_count || 12;
          const singles = item.single_bottles_count || 0;
          return sum + (cartons * perCarton) + singles;
        }, 0);
        
        const lowStockItems = warehouseInventory.filter(item => {
          const remaining = item.remaining_quantity || 0;
          return remaining < 10 && remaining > 0;
        }).length;
        
        const outOfStockItems = warehouseInventory.filter(item => {
          const remaining = item.remaining_quantity || 0;
          return remaining === 0;
        }).length;
        
        const healthyItems = warehouseInventory.length - lowStockItems - outOfStockItems;
        const healthPercentage = warehouseInventory.length > 0 
          ? Math.round((healthyItems / warehouseInventory.length) * 100) 
          : 0;
        
        return {
          totalItems: warehouseInventory.length,
          totalQuantity: totalQuantity,
          lowStockItems: lowStockItems,
          outOfStockItems: outOfStockItems,
          healthPercentage: healthPercentage,
          lastUpdated: new Date()
        };
      } catch (error) {
        console.error('Error loading warehouse stats:', error);
        return {
          totalItems: 0,
          totalQuantity: 0,
          lowStockItems: 0,
          outOfStockItems: 0,
          healthPercentage: 0,
          lastUpdated: new Date()
        };
      }
    };

    // Load statistics for all warehouses
    const loadAllWarehousesStats = async () => {
      warehouseStatsLoading.value = true;
      try {
        const warehousesList = warehouses.value;
        const stats = {};
        
        // Load stats for each warehouse
        for (const warehouse of warehousesList) {
          stats[warehouse.id] = await loadWarehouseStats(warehouse.id);
        }
        
        allWarehousesStats.value = stats;
      } catch (error) {
        console.error('Error loading all warehouses stats:', error);
        allWarehousesStats.value = {};
      } finally {
        warehouseStatsLoading.value = false;
      }
    };

    // Load dashboard stats
    const loadDashboardStats = async (warehouseId = 'all') => {
      statsLoading.value = true;
      try {
        console.log(`📊 Loading dashboard stats for: ${warehouseId}`);
        
        // Get REAL total count from store action
        if (warehouseId === 'all') {
          totalItemsCount.value = await store.dispatch('getTotalItemCount', 'all');
        } else {
          totalItemsCount.value = await store.dispatch('getTotalItemCount', warehouseId);
        }
        
        // Load stats for the selected warehouse
        const selectedStats = await loadWarehouseStats(warehouseId);
        dashboardStats.value = selectedStats;
        
        // Load "all" stats for comparison
        const allStats = await loadWarehouseStats('all');
        allWarehouseStats.value = allStats;
        
        // Load stats for all warehouses if "all" is selected
        if (warehouseId === 'all') {
          await loadAllWarehousesStats();
        }
        
        console.log('✅ Dashboard stats loaded:', dashboardStats.value);
        console.log(`📦 Total items in system: ${totalItemsCount.value}`);
        console.log(`📦 Total loaded items: ${totalLoadedItems.value}`);
        
        lastUpdated.value = new Date();
        
      } catch (error) {
        console.error('❌ Error loading dashboard stats:', error);
        
        // Fallback to calculated stats
        const inventory = filteredInventory.value;
        
        const totalQuantity = inventory.reduce((sum, item) => {
          const cartons = item.cartons_count || 0;
          const perCarton = item.per_carton_count || 12;
          const singles = item.single_bottles_count || 0;
          return sum + (cartons * perCarton) + singles;
        }, 0);
        
        const lowStockItems = inventory.filter(item => {
          const remaining = item.remaining_quantity || 0;
          return remaining < 10 && remaining > 0;
        }).length;
        
        const outOfStockItems = inventory.filter(item => {
          const remaining = item.remaining_quantity || 0;
          return remaining === 0;
        }).length;
        
        dashboardStats.value = {
          totalItems: inventory.length,
          totalQuantity: totalQuantity,
          lowStockItems: lowStockItems,
          outOfStockItems: outOfStockItems,
          lastUpdated: new Date()
        };
        
        // For "all" comparison
        if (warehouseId !== 'all') {
          const allInventory = inventoryItems.value;
          
          const allTotalQuantity = allInventory.reduce((sum, item) => {
            const cartons = item.cartons_count || 0;
            const perCarton = item.per_carton_count || 12;
            const singles = item.single_bottles_count || 0;
            return sum + (cartons * perCarton) + singles;
          }, 0);
          
          const allLowStockItems = allInventory.filter(item => {
            const remaining = item.remaining_quantity || 0;
            return remaining < 10 && remaining > 0;
          }).length;
          
          const allOutOfStockItems = allInventory.filter(item => {
            const remaining = item.remaining_quantity || 0;
            return remaining === 0;
          }).length;
          
          allWarehouseStats.value = {
            totalItems: allInventory.length,
            totalQuantity: allTotalQuantity,
            lowStockItems: allLowStockItems,
            outOfStockItems: allOutOfStockItems
          };
        }
      } finally {
        statsLoading.value = false;
      }
    };

    // Load more items (50 per click - optimized for performance)
    const loadMoreItems = async () => {
      if (loadMoreLoading.value || isFetchingMore.value) return;
      
      loadMoreLoading.value = true;
      try {
        console.log('📥 Loading 50 more items...');
        
        // Use the store's loadMoreInventory action
        const newItems = await store.dispatch('loadMoreInventory');
        
        console.log(`✅ Loaded: ${newItems.length} items`);
        console.log(`📦 Total loaded items now: ${totalLoadedItems.value}`);
        
        // Refresh dashboard stats after loading more items
        await loadDashboardStats(selectedWarehouse.value);
        
      } catch (error) {
        console.error('❌ Error loading more items:', error);
      } finally {
        loadMoreLoading.value = false;
      }
    };

    const refreshDashboard = async () => {
      loading.value = true;
      try {
        // Reset pagination and load all fresh data
        await store.dispatch('loadAllInventory', { forceRefresh: true });
        
        // Refresh transactions
        await store.dispatch('getRecentTransactions');
        
        // Get total item count
        totalItemsCount.value = await store.dispatch('getTotalItemCount', selectedWarehouse.value === 'all' ? 'all' : selectedWarehouse.value);
        
        // Refresh dashboard stats
        await loadDashboardStats(selectedWarehouse.value);
        
        console.log('🔄 Dashboard refreshed successfully');
        console.log(`📦 Total items in system: ${totalItemsCount.value}`);
        console.log(`📦 Total items loaded: ${totalLoadedItems.value}`);
        console.log(`📊 Total transactions loaded: ${recentStoreTransactions.value.length}`);
        
      } catch (error) {
        console.error('Error refreshing dashboard:', error);
      } finally {
        loading.value = false;
      }
    };

    const handleWarehouseChange = async () => {
      loading.value = true;
      try {
        console.log(`🏢 Warehouse changed to: ${selectedWarehouse.value}`);
        
        // Get total items count for the selected warehouse
        totalItemsCount.value = await store.dispatch('getTotalItemCount', selectedWarehouse.value === 'all' ? 'all' : selectedWarehouse.value);
        
        // Load dashboard stats
        await loadDashboardStats(selectedWarehouse.value);
        
        console.log(`📦 Filtered inventory count: ${filteredInventory.value.length}`);
        console.log(`📊 Filtered transactions count: ${filteredRecentTransactions.value.length}`);
        console.log(`📦 Total items in warehouse: ${totalItemsCount.value}`);
        
      } catch (error) {
        console.error('Error changing warehouse:', error);
      } finally {
        loading.value = false;
      }
    };

    // Check authentication before loading data
    const checkAuthAndLoadData = async () => {
      try {
        // Check if user is authenticated
        const isAuthenticated = store.getters.isAuthenticated;
        const user = store.state.user;
        
        console.log('🔍 Checking authentication...');
        console.log('Is authenticated:', isAuthenticated);
        console.log('User:', user);
        
        if (!isAuthenticated || !user) {
          console.log('⚠️ User not authenticated, redirecting to login...');
          await router.push('/login');
          return;
        }
        
        await loadDashboardData();
      } catch (error) {
        console.error('❌ Error in authentication check:', error);
        await router.push('/login');
      }
    };

    const loadDashboardData = async () => {
      initialLoading.value = true;
      console.log('🚀 Loading dashboard data...');
      
      try {
        // Load warehouses first
        console.log('🏢 Loading warehouses...');
        warehousesLoading.value = true;
        await store.dispatch('loadWarehouses');
        warehousesLoading.value = false;
        
        // Load initial inventory (50 items)
        console.log('📦 Loading initial inventory (50 items)...');
        await store.dispatch('loadAllInventory', { forceRefresh: true, batchSize: 50 });
        
        // Get total item count
        console.log('📊 Getting total item count...');
        totalItemsCount.value = await store.dispatch('getTotalItemCount', 'all');
        
        // Load recent transactions
        console.log('📊 Loading recent transactions...');
        await store.dispatch('getRecentTransactions', { limit: 50 });
        
        // Load dashboard stats
        console.log('📈 Loading dashboard stats...');
        await loadDashboardStats(selectedWarehouse.value);
        
        // Log success information
        console.log('✅ Dashboard data loaded successfully!');
        console.log(`📦 Total items in system: ${totalItemsCount.value}`);
        console.log(`📦 Total items loaded: ${totalLoadedItems.value}`);
        console.log(`📊 Total transactions: ${recentStoreTransactions.value.length}`);
        console.log(`🏢 Total warehouses: ${warehouses.value.length}`);
        
      } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
        
        // Check if error is authentication-related
        if (error.message.includes('not authenticated') || error.message.includes('permission-denied')) {
          console.log('🔒 Authentication error detected, redirecting to login...');
          await router.push('/login');
          return;
        }
      } finally {
        initialLoading.value = false;
        loading.value = false;
      }
    };

    // Handle escape key to close modal
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showItemModal.value) {
        closeItemModal();
      }
    };

    // Initialize
    onMounted(async () => {
      console.log('🚀 Dashboard mounted');
      
      // Start time update
      updateTime();
      const timeInterval = setInterval(updateTime, 60000);
      
      // Add event listener for escape key
      document.addEventListener('keydown', handleEscapeKey);
      
      try {
        // Check authentication first
        await checkAuthAndLoadData();
      } catch (error) {
        console.error('❌ Error in dashboard mounted:', error);
        initialLoading.value = false;
        loading.value = false;
      }
      
      onUnmounted(() => {
        clearInterval(timeInterval);
        document.removeEventListener('keydown', handleEscapeKey);
        
        // Ensure body scroll is restored
        document.body.style.overflow = '';
      });
    });

    // Watch for warehouse filter changes
    watch(selectedWarehouse, async (newValue) => {
      if (!loading.value) {
        console.log('🏢 Warehouse filter changed to:', newValue);
        console.log(`📦 Filtered items: ${filteredInventory.value.length}`);
        console.log(`📊 Filtered transactions: ${filteredRecentTransactions.value.length}`);
        await loadDashboardStats(newValue);
      }
    });

    // Watch for inventory changes to update stats
    watch(inventoryItems, async () => {
      if (!loading.value && !statsLoading.value) {
        console.log('🔄 Inventory changed, updating stats...');
        console.log(`📦 New total items loaded: ${inventoryItems.value.length}`);
        await loadDashboardStats(selectedWarehouse.value);
      }
    }, { deep: true });

    // Watch for pagination changes
    watch(totalLoadedItems, (newCount) => {
      console.log(`📦 Total loaded items updated: ${newCount}`);
    });

    return {
      // State
      loading,
      initialLoading,
      statsLoading,
      warehouseStatsLoading,
      loadMoreLoading,
      warehousesLoading,
      selectedWarehouse,
      currentTime,
      currentDate,
      lastUpdated,
      
      // Modal state
      showItemModal,
      selectedItem,
      modalLoading,
      itemTransactions,
      
      // Stats
      dashboardStats,
      allWarehouseStats,
      allWarehousesStats,
      
      // Computed
      userRole,
      warehouses,
      canModifyItems,
      filteredRecentInventory,
      filteredRecentTransactions,
      todayTransactions,
      todayAddCount,
      todayTransferCount,
      todayDispatchCount,
      lastTransactionTime,
      lastActivityTime,
      recentItemsCount,
      recentItemsStatusClass,
      totalCartons,
      totalSingles,
      outOfStockItems,
      stockHealthPercentage,
      stockHealthColor,
      hasMoreItems,
      totalLoadedItems,
      totalItemsCount,
      isFetchingMore,
      
      // Helper methods
      formatEnglishNumber,
      formatDetailedTime,
      formatRelativeTime,
      getWarehouseLabel,
      getDestinationLabel,
      getTransactionTypeLabel,
      getQuantityClass,
      getStatusClass,
      getHealthColorClass,
      getHealthTextClass,
      calculateTotalQuantity,
      handleImageError,
      handleModalImageError,
      
      // Modal functions
      openItemModal,
      closeItemModal,
      editItem,
      
      // Actions
      refreshDashboard,
      handleWarehouseChange,
      loadMoreItems
    };
  }
};
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}

/* Card hover effects */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.dark .hover-lift:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.dark .custom-scrollbar::-webkit-scrollbar-track {
  background: #374151;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Loading skeleton animation */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}

.dark .skeleton {
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
}

/* Status indicators */
.status-dot {
  position: relative;
}

.status-dot::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid white;
}

.dark .status-dot::after {
  border-color: #1f2937;
}

/* Modal backdrop blur effect */
.modal-backdrop {
  backdrop-filter: blur(4px);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .stat-card {
    padding: 1rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .action-button {
    padding: 0.75rem;
  }
  
  /* Modal responsive */
  .modal-content {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
}

/* Smooth transitions */
.transition-all {
  transition: all 0.3s ease;
}

/* Enhanced cursor pointer */
.cursor-pointer {
  cursor: pointer;
}

/* Disabled state */
.disabled\:opacity-50:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Focus rings */
.focus-ring:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}

/* Card shadows */
.card-shadow {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.card-shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.dark .card-shadow {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
}

.dark .card-shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
}

/* Truncation for mobile */
.truncate-mobile {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .truncate-mobile {
    max-width: 150px;
  }
}
</style>
