<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 pb-16 sm:pb-0">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="w-full px-3 sm:px-4 lg:px-6">
        <div class="flex justify-between items-center h-14 sm:h-16">
          <!-- Logo and Title -->
          <div class="flex items-center space-x-2 space-x-reverse">
            <router-link to="/" class="flex items-center space-x-2 space-x-reverse hover:opacity-80 transition-opacity">
              <div class="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-xs sm:text-sm">م</span>
              </div>
              <div class="hidden sm:block">
                <h1 class="text-lg font-bold text-gray-900 dark:text-white">صرف المخزون</h1>
                <p class="text-xs text-gray-500 dark:text-gray-400">نظام إدارة المخزون</p>
              </div>
              <div class="sm:hidden">
                <h1 class="text-sm font-bold text-gray-900 dark:text-white">صرف المخزون</h1>
              </div>
            </router-link>
          </div>

          <!-- User Actions -->
          <div class="flex items-center space-x-2 space-x-reverse">
            <div class="hidden md:flex items-center space-x-2 space-x-reverse text-sm">
              <span class="text-gray-600 dark:text-gray-300">{{ userName }}</span>
              <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-xs">
                {{ userRole }}
              </span>
            </div>

            <div class="flex items-center space-x-1 sm:space-x-2 space-x-reverse">
              <!-- Inventory Button -->
              <router-link 
                to="/inventory" 
                class="inline-flex items-center p-2 sm:px-4 sm:py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                :title="'المخزون'"
              >
                <svg class="w-4 h-4 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
                <span class="hidden sm:inline">المخزون</span>
              </router-link>

              <!-- Invoice System Link (optional) – could be a router-link to another page -->
              <router-link 
                to="/invoices" 
                class="inline-flex items-center p-2 sm:px-4 sm:py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-medium rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-colors duration-200"
              >
                <svg class="w-4 h-4 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span class="hidden sm:inline">نظام الفواتير</span>
                <span class="sm:hidden">فواتير</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="w-full px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center ml-2 sm:ml-3 lg:ml-4">
              <svg class="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">إجمالي عمليات الصرف</p>
              <p class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(totalDispatches) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center ml-2 sm:ml-3 lg:ml-4">
              <svg class="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">صرف هذا الشهر</p>
              <p class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(monthlyDispatches) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center ml-2 sm:ml-3 lg:ml-4">
              <svg class="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">قيمة الصرف</p>
              <p class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(totalDispatchValue) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Dispatch Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4 lg:mb-6">
          <div>
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">إنشاء صرف جديد</h2>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">صرف أصناف من المخازن إلى خارج النظام</p>
          </div>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <!-- Search Box -->
            <div class="relative flex-1 min-w-0">
              <input
                type="text"
                v-model="searchTerm"
                @input="handleDispatchSearch"
                placeholder="ابحث عن صنف بالاسم، الكود، اللون، المورد..."
                class="w-full px-3 sm:px-4 py-2.5 pr-9 sm:pr-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :disabled="loading"
              >
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <div v-if="searchingDispatchItems" class="absolute inset-y-0 left-0 pl-3 flex items-center">
                <div class="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            </div>

            <!-- Warehouse Filter -->
            <select
              v-model="selectedWarehouse"
              @change="updateAvailableItems"
              class="px-3 sm:px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 min-h-[44px] min-w-[150px] sm:min-w-[180px]"
              :disabled="loading || !availableWarehousesForDispatch.length"
            >
              <option value="">جميع المخازن</option>
              <option 
                v-for="warehouse in availableWarehousesForDispatch" 
                :key="warehouse.id" 
                :value="warehouse.id"
              >
                {{ warehouse.name_ar }}
              </option>
            </select>

            <button 
              v-if="canPerformDispatch"
              @click="showDispatchModal = true"
              :disabled="loading || availableItems.length === 0"
              class="inline-flex items-center justify-center px-3 sm:px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              <svg class="w-4 h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span class="hidden sm:inline">إنشاء صرف جديد</span>
              <span class="sm:hidden">صرف جديد</span>
            </button>
          </div>
        </div>

        <!-- Search Stats -->
        <div v-if="searchTerm.trim() && filteredDispatchItems.length > 0" class="search-stats-container max-w-full mx-auto mb-3">
          <span>🔍 بحث: "{{ searchTerm }}"</span>
          <span>•</span>
          <span>تم العثور على {{ filteredDispatchItems.length }} صنف</span>
          <span v-if="lastDispatchSearchSource" class="flex items-center gap-1">
            • <span class="search-source-badge">
              {{ getSearchSourceLabel(lastDispatchSearchSource) }}
            </span>
          </span>
          <span v-if="searchingDispatchItems" class="flex items-center gap-1">
            • <span class="animate-pulse text-blue-500">جاري البحث...</span>
          </span>
        </div>

        <!-- Available Items Grid -->
        <div v-if="availableItems.length > 0" class="mt-3 sm:mt-4">
          <div class="flex items-center justify-between mb-2 sm:mb-3">
            <h3 class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
              {{ selectedWarehouse ? `الأصناف المتاحة في ${getWarehouseLabel(selectedWarehouse)}` : 'جميع الأصناف المتاحة' }}
              <span class="text-xs text-gray-500">({{ availableItems.length }} صنف)</span>
            </h3>
            <div class="flex items-center space-x-1 sm:space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <span>المعروض: {{ Math.min(8, availableItems.length) }} من {{ availableItems.length }}</span>
            </div>
          </div>

          <div class="available-items-grid-fixed grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <div 
              v-for="item in displayedAvailableItems" 
              :key="item.id"
              class="p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm active:scale-98 h-full"
              @click="selectItemForDispatch(item)"
            >
              <div class="flex flex-col h-full">
                <div class="flex-1">
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ item.name }}</p>
                      <div v-if="item.code" class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{{ item.code }}</div>
                    </div>
                    <svg class="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                  
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded whitespace-nowrap">
                        {{ formatNumber(item.remaining_quantity || item.quantity || 0) }} متبقي
                      </span>
                      <span v-if="item.color" class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {{ item.color }}
                      </span>
                    </div>
                    
                    <div v-if="item.warehouse_id" class="text-xs text-gray-500 dark:text-gray-400 truncate">
                      مخزن: {{ getWarehouseLabel(item.warehouse_id) }}
                    </div>
                    
                    <div v-if="item.supplier" class="text-xs text-gray-500 dark:text-gray-400 truncate">
                      مورد: {{ item.supplier }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="availableItems.length > 8" class="text-center mt-3 sm:mt-4">
            <button 
              @click="showAllItems = !showAllItems"
              class="text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg transition-colors"
            >
              {{ showAllItems ? 'عرض أقل' : `عرض المزيد (+${availableItems.length - 8})` }}
            </button>
          </div>
        </div>

        <div v-else-if="!loading" class="text-center py-6 sm:py-8">
          <div class="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-3 sm:mb-4">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1M9 7h6"/>
            </svg>
          </div>
          <p class="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
            {{ selectedWarehouse ? 'لا توجد أصناف في هذا المخزن' : 'لا توجد أصناف متاحة' }}
          </p>
        </div>

        <div v-else class="text-center py-4 sm:py-6">
          <div class="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-blue-200 border-t-blue-600 mx-auto mb-2 sm:mb-3"></div>
          <p class="text-gray-500 dark:text-gray-400 text-xs">جاري تحميل الأصناف...</p>
        </div>
      </div>

      <!-- Dispatch History -->
      <div class="dispatch-table-container bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6 sm:mb-8">
        <div class="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            <div>
              <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">سجل عمليات الصرف</h2>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">جميع عمليات الصرف المسجلة في النظام</p>
            </div>

            <div class="filters-container flex flex-wrap gap-2">
              <!-- Search History -->
              <div class="relative flex-1 sm:flex-initial min-w-0">
                <input
                  type="text"
                  v-model="historySearch"
                  @input="applyHistoryFilters"
                  placeholder="بحث في السجل..."
                  class="w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-9 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                <svg class="absolute right-2.5 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>

              <!-- Warehouse Filter -->
              <select
                v-model="historyWarehouseFilter"
                @change="applyHistoryFilters"
                class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-[120px] sm:min-w-[150px]"
              >
                <option value="">جميع المخازن</option>
                <option v-for="warehouse in availableWarehousesForDispatch" :key="warehouse.id" :value="warehouse.id">
                  {{ warehouse.name_ar }}
                </option>
              </select>

              <!-- Date Filter -->
              <select
                v-model="dateFilter"
                @change="applyHistoryFilters"
                class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-[120px] sm:min-w-[140px]"
              >
                <option value="all">جميع الفترات</option>
                <option value="today">اليوم</option>
                <option value="week">هذا الأسبوع</option>
                <option value="month">هذا الشهر</option>
                <option value="custom">فترة مخصصة</option>
              </select>

              <!-- Export Button -->
              <button 
                v-if="canExport"
                @click="exportDispatches"
                :disabled="filteredDispatchHistory.length === 0"
                class="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <span class="hidden sm:inline">تصدير Excel</span>
                <span class="inline sm:hidden">تصدير</span>
              </button>
            </div>
          </div>

          <!-- Active Filters Badges -->
          <div v-if="hasFilters" class="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-700">
            <div class="flex flex-wrap items-center gap-1 sm:gap-2">
              <span class="text-xs text-gray-600 dark:text-gray-400">الفلاتر النشطة:</span>

              <span v-if="historySearch" class="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                بحث: "{{ historySearch }}"
                <button @click="historySearch = ''; applyHistoryFilters()" class="mr-1 hover:text-blue-900 dark:hover:text-blue-200">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </span>

              <span v-if="historyWarehouseFilter" class="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300">
                مخزن: {{ getWarehouseLabel(historyWarehouseFilter) }}
                <button @click="historyWarehouseFilter = ''; applyHistoryFilters()" class="mr-1 hover:text-indigo-900 dark:hover:text-indigo-200">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </span>

              <span v-if="dateFilter !== 'all'" class="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300">
                فترة: {{ getDateFilterLabel(dateFilter) }}
                <button @click="dateFilter = 'all'; customDateFrom = ''; customDateTo = ''; applyHistoryFilters()" class="mr-1 hover:text-yellow-900 dark:hover:text-yellow-200">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </span>

              <button 
                v-if="hasFilters"
                @click="clearHistoryFilters"
                class="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                إعادة تعيين
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-6 sm:p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
          <p class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">جاري تحميل البيانات...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredDispatchHistory.length === 0" class="p-4 sm:p-6 lg:p-8 text-center">
          <div class="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-3 sm:mb-4">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </div>
          <h3 class="text-sm sm:text-base lg:text-lg font-medium text-gray-900 dark:text-white mb-1 sm:mb-2">لا توجد عمليات صرف</h3>
          <p class="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
            {{ hasFilters ? 'لا توجد عمليات صرف تطابق التصفية المحددة' : 'لم يتم تسجيل أي عمليات صرف حتى الآن' }}
          </p>
          <button 
            v-if="canPerformDispatch"
            @click="showDispatchModal = true"
            class="px-3 sm:px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 min-h-[40px] sm:min-h-[44px]"
          >
            إنشاء أول صرف
          </button>
        </div>

        <!-- Table Content -->
        <div v-else class="w-full overflow-hidden">
          <!-- Desktop Table -->
          <div class="hidden lg:block">
            <div class="dispatch-table-header">
              <div class="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider min-w-[800px]">
                <div class="col-span-2 text-right px-2">التاريخ والوقت</div>
                <div class="col-span-2 text-right px-2">الصنف</div>
                <div class="col-span-1 text-right px-2">الكمية</div>
                <div class="col-span-2 text-right px-2">من مخزن</div>
                <div class="col-span-2 text-right px-2">إلى</div>
                <div class="col-span-1 text-right px-2">القيمة</div>
                <div class="col-span-1 text-right px-2">بواسطة</div>
                <div class="col-span-1 text-right px-2">الإجراءات</div>
              </div>
            </div>

            <div class="overflow-x-auto" style="max-height: calc(100vh - 400px); min-height: 200px;">
              <div class="min-w-full">
                <div 
                  v-for="dispatch in paginatedHistory" 
                  :key="dispatch.id" 
                  class="dispatch-table-row grid grid-cols-12 gap-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 border-b border-gray-100 dark:border-gray-700 min-w-[800px]"
                >
                  <!-- Date & Time -->
                  <div class="col-span-2 px-2">
                    <div class="text-sm text-gray-900 dark:text-white">{{ formatDate(dispatch.timestamp) }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(dispatch.timestamp) }}</div>
                  </div>

                  <!-- Item -->
                  <div class="col-span-2 px-2">
                    <div class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ dispatch.item_name || 'غير محدد' }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ dispatch.item_code || 'N/A' }}</div>
                  </div>

                  <!-- Quantity -->
                  <div class="col-span-1 px-2">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                      {{ formatNumber(Math.abs(dispatch.quantity || dispatch.total_delta || 0)) }}
                    </span>
                  </div>

                  <!-- From Warehouse -->
                  <div class="col-span-2 px-2 text-sm text-gray-900 dark:text-white truncate">
                    {{ getWarehouseLabel(dispatch.from_warehouse) || 'غير محدد' }}
                  </div>

                  <!-- Destination -->
                  <div class="col-span-2 px-2 text-sm text-gray-900 dark:text-white truncate">
                    {{ store.getters.getDispatchDestinationName(dispatch) }}
                  </div>

                  <!-- Value -->
                  <div class="col-span-1 px-2 text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ formatCurrency(calculateDispatchValue(dispatch)) }}
                  </div>

                  <!-- User -->
                  <div class="col-span-1 px-2 text-sm text-gray-500 dark:text-gray-400 truncate">
                    {{ dispatch.user_name || dispatch.created_by || 'مستخدم النظام' }}
                  </div>

                  <!-- Actions -->
                  <div class="col-span-1 px-2">
                    <div class="flex items-center space-x-1 space-x-reverse">
                      <button 
                        @click="viewDispatchDetails(dispatch)"
                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                        title="عرض التفاصيل"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </button>
                      <button 
                        @click="printDispatch(dispatch)"
                        class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 hover:bg-green-50 dark:hover:bg-green-900/30 rounded"
                        title="طباعة"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Cards View -->
          <div class="lg:hidden">
            <div class="p-2 sm:p-3 lg:p-4">
              <div class="space-y-2 sm:space-y-3">
                <div 
                  v-for="dispatch in paginatedHistory" 
                  :key="dispatch.id" 
                  class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow duration-150"
                >
                  <div class="flex justify-between items-start mb-2 sm:mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                    <div class="min-w-0 flex-1">
                      <div class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ dispatch.item_name }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatDate(dispatch.timestamp) }} - {{ formatTime(dispatch.timestamp) }}</div>
                    </div>
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                      {{ formatNumber(Math.abs(dispatch.quantity || dispatch.total_delta || 0)) }}
                    </span>
                  </div>

                  <div class="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">من مخزن</div>
                      <div class="font-medium text-gray-900 dark:text-white truncate">{{ getWarehouseLabel(dispatch.from_warehouse) }}</div>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">إلى</div>
                      <div class="font-medium text-gray-900 dark:text-white truncate">{{ store.getters.getDispatchDestinationName(dispatch) }}</div>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">القيمة</div>
                      <div class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(calculateDispatchValue(dispatch)) }}</div>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">بواسطة</div>
                      <div class="font-medium text-gray-900 dark:text-white truncate">{{ dispatch.user_name || dispatch.created_by || 'مستخدم النظام' }}</div>
                    </div>
                  </div>

                  <div class="flex justify-between items-center mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ dispatch.item_code }}
                    </div>
                    <div class="flex items-center space-x-2 sm:space-x-3 space-x-reverse">
                      <button 
                        @click="viewDispatchDetails(dispatch)"
                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-xs sm:text-sm flex items-center p-1"
                      >
                        <svg class="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        تفاصيل
                      </button>
                      <button 
                        @click="printDispatch(dispatch)"
                        class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-xs sm:text-sm flex items-center p-1"
                      >
                        <svg class="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                        </svg>
                        طباعة
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalHistoryPages > 1" class="pagination-container">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
              <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-right">
                عرض {{ startIndex + 1 }} - {{ Math.min(endIndex, filteredDispatchHistory.length) }} من {{ filteredDispatchHistory.length }}
              </div>
              <div class="flex items-center justify-center space-x-2">
                <button 
                  @click="prevPage"
                  :disabled="currentHistoryPage === 1"
                  class="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[34px] sm:min-h-[36px] min-w-[70px] sm:min-w-[80px]"
                >
                  السابق
                </button>
                <span class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 min-w-[80px] sm:min-w-[100px] text-center">
                  صفحة {{ currentHistoryPage }} من {{ totalHistoryPages }}
                </span>
                <button 
                  @click="nextPage"
                  :disabled="currentHistoryPage === totalHistoryPages"
                  class="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[34px] sm:min-h-[36px] min-w-[70px] sm:min-w-[80px]"
                >
                  التالي
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Dispatch Modal -->
    <DispatchModal 
      v-if="showDispatchModal"
      :isOpen="showDispatchModal"
      :item="selectedItemForDispatch"
      @close="handleModalClose"
      @success="handleDispatchSuccess"
    />

    <!-- Loading Overlay -->
    <div v-if="loading && !showDispatchModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 lg:p-8 flex flex-col items-center mx-4 max-w-sm w-full">
        <div class="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-blue-600 mb-3 sm:mb-4"></div>
        <p class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm text-center">جاري تحميل البيانات...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import * as XLSX from 'xlsx';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  Timestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import DispatchModal from '@/components/inventory/DispatchModal.vue';

// Common dispatch destination mappings (kept for local fallback)
const COMMON_DISPATCH_DESTINATIONS = {
  'dubi_factory': 'مصنع دبي',
  'external_wharehouse': 'صرف خارجي',
  'factory': 'مصنع البران',
  'dispat_item': 'موقع صرف',
  'zahra': 'صرف الي مخزن الزهراء',
  'ghabashi': 'مخزن الغباشي',
  'al_ghabashi': 'مخزن الغباشي',
  'dispatch': 'صرف خارجي',
  'external': 'صرف خارجي',
  'main': 'المخزن الرئيسي',
  'primary': 'المخزن الرئيسي'
};

export default {
  name: 'DispatchView',
  
  components: {
    DispatchModal
  },
  
  setup() {
    const store = useStore();
    
    // State
    const loading = ref(false);
    const showDispatchModal = ref(false);
    const selectedWarehouse = ref('');
    const selectedItemForDispatch = ref(null);
    const searchTerm = ref('');
    const historySearch = ref('');
    const historyWarehouseFilter = ref('');
    const dateFilter = ref('all');
    const customDateFrom = ref('');
    const customDateTo = ref('');
    const currentHistoryPage = ref(1);
    const itemsPerPage = ref(10);
    const showAllItems = ref(false);
    const searchTimeout = ref(null);
    const realtimeUnsubscribe = ref(null);
    
    // Search specific
    const searchingDispatchItems = ref(false);
    const filteredDispatchItems = ref([]);
    const lastDispatchSearchSource = ref('');
    const dispatchSearchDebounceTimeout = ref(null);
    
    // Computed from store
    const userRole = computed(() => store.getters.userRole || '');
    const userName = computed(() => store.getters.userName || '');
    const userProfile = computed(() => store.getters.userProfile || {});
    
    const allInventory = computed(() => store.state.inventory || []);
    const allTransactions = computed(() => store.state.transactions || []);
    const allWarehouses = computed(() => store.state.warehouses || []);
    
    const dispatchTransactions = computed(() => {
      return allTransactions.value.filter(t => t.type === 'DISPATCH');
    });
    
    const canExport = computed(() => userRole.value === 'superadmin' || userRole.value === 'company_manager');
    
    const accessibleWarehouses = computed(() => store.getters.accessibleWarehouses || []);
    
    const availableWarehousesForDispatch = computed(() => {
      return accessibleWarehouses.value.filter(warehouse => 
        warehouse.type === 'primary' || !warehouse.type
      );
    });
    
    const canViewDispatches = computed(() => store.getters.isAuthenticated);
    
    const canPerformDispatch = computed(() => {
      return store.getters.canDispatch || 
             userRole.value === 'superadmin' || 
             userRole.value === 'warehouse_manager';
    });
    
    // Dispatch stats
    const totalDispatches = computed(() => dispatchTransactions.value.length);
    
    const monthlyDispatches = computed(() => {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return dispatchTransactions.value.filter(t => {
        try {
          const dispatchDate = t.timestamp?.toDate ? t.timestamp.toDate() : new Date(t.timestamp);
          return dispatchDate >= oneMonthAgo;
        } catch { return false; }
      }).length;
    });
    
    const totalDispatchedQuantity = computed(() => {
      return dispatchTransactions.value.reduce((total, dispatch) => 
        total + calculateDispatchQuantity(dispatch), 0
      );
    });
    
    const totalDispatchValue = computed(() => {
      return dispatchTransactions.value.reduce((total, dispatch) => 
        total + calculateDispatchValue(dispatch), 0
      );
    });
    
    // Available items
    const availableItems = computed(() => {
      let items = allInventory.value.filter(item => item.remaining_quantity > 0);
      if (selectedWarehouse.value) {
        items = items.filter(item => item.warehouse_id === selectedWarehouse.value);
      }
      if (searchTerm.value.trim()) {
        if (filteredDispatchItems.value.length > 0) {
          return filteredDispatchItems.value;
        }
        const term = searchTerm.value.toLowerCase().trim();
        items = items.filter(item => 
          item.name?.toLowerCase().includes(term) ||
          item.code?.toLowerCase().includes(term) ||
          item.color?.toLowerCase().includes(term) ||
          item.supplier?.toLowerCase().includes(term)
        );
      }
      return items.sort((a, b) => b.remaining_quantity - a.remaining_quantity);
    });
    
    const displayedAvailableItems = computed(() => {
      if (showAllItems.value) return availableItems.value;
      return availableItems.value.slice(0, 8);
    });
    
    // Filtered history
    const filteredDispatchHistory = computed(() => {
      let filtered = [...dispatchTransactions.value];
      if (historySearch.value.trim()) {
        const term = historySearch.value.toLowerCase().trim();
        filtered = filtered.filter(d => 
          d.item_name?.toLowerCase().includes(term) ||
          d.item_code?.toLowerCase().includes(term) ||
          d.destination?.toLowerCase().includes(term) ||
          d.notes?.toLowerCase().includes(term)
        );
      }
      if (historyWarehouseFilter.value) {
        filtered = filtered.filter(d => d.from_warehouse === historyWarehouseFilter.value);
      }
      if (dateFilter.value !== 'all') {
        const now = new Date();
        let startDate;
        switch (dateFilter.value) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'custom':
            if (customDateFrom.value && customDateTo.value) {
              const start = new Date(customDateFrom.value);
              const end = new Date(customDateTo.value);
              end.setHours(23, 59, 59, 999);
              return filtered.filter(d => {
                try {
                  const dispatchDate = d.timestamp?.toDate ? d.timestamp.toDate() : new Date(d.timestamp);
                  return dispatchDate >= start && dispatchDate <= end;
                } catch { return false; }
              });
            }
            break;
        }
        if (startDate) {
          filtered = filtered.filter(d => {
            try {
              const dispatchDate = d.timestamp?.toDate ? d.timestamp.toDate() : new Date(d.timestamp);
              return dispatchDate >= startDate;
            } catch { return false; }
          });
        }
      }
      filtered.sort((a, b) => {
        try {
          const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
          const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
          return dateB - dateA;
        } catch { return 0; }
      });
      return filtered;
    });
    
    const totalHistoryPages = computed(() => Math.ceil(filteredDispatchHistory.value.length / itemsPerPage.value));
    const startIndex = computed(() => (currentHistoryPage.value - 1) * itemsPerPage.value);
    const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredDispatchHistory.value.length));
    const paginatedHistory = computed(() => filteredDispatchHistory.value.slice(startIndex.value, endIndex.value));
    const hasFilters = computed(() => historySearch.value.trim() || historyWarehouseFilter.value || dateFilter.value !== 'all');
    
    // Utility functions
    const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num || 0);
    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EGP', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount || 0);
    const formatDate = (timestamp) => {
      if (!timestamp) return '-';
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit' });
      } catch { return '-'; }
    };
    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
      } catch { return ''; }
    };
    const formatDateTime = (timestamp) => {
      if (!timestamp) return '-';
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      } catch { return '-'; }
    };
    const getWarehouseLabel = (warehouseId) => {
      if (!warehouseId) return '';
      const warehouse = allWarehouses.value.find(w => w.id === warehouseId);
      return warehouse ? warehouse.name_ar : warehouseId;
    };
    const getDestinationLabel = (destinationId) => {
      if (!destinationId) return '';
      const warehouse = allWarehouses.value.find(w => w.id === destinationId);
      if (warehouse) return warehouse.name_ar || warehouse.name || destinationId;
      if (COMMON_DISPATCH_DESTINATIONS[destinationId]) return COMMON_DISPATCH_DESTINATIONS[destinationId];
      const partialMatch = allWarehouses.value.find(w => 
        w.id.toLowerCase().includes(destinationId.toLowerCase()) ||
        (w.name_ar && w.name_ar.toLowerCase().includes(destinationId.toLowerCase())) ||
        (w.name_en && w.name_en.toLowerCase().includes(destinationId.toLowerCase()))
      );
      return partialMatch ? (partialMatch.name_ar || partialMatch.name || destinationId) : destinationId;
    };
    const getDateFilterLabel = (filter) => ({ 'today': 'اليوم', 'week': 'هذا الأسبوع', 'month': 'هذا الشهر', 'custom': 'مخصص' }[filter] || filter);
    const getSearchSourceLabel = (source) => ({ 'cache': 'ذاكرة التخزين', 'firebase': 'القاعدة الكاملة', 'local_fallback': 'بحث محلي', 'warehouse_load': 'تحميل من المخزن' }[source] || source);
    
    const calculateDispatchQuantity = (dispatch) => {
      if (dispatch.quantity !== undefined) return Math.abs(dispatch.quantity);
      if (dispatch.total_delta !== undefined) return Math.abs(dispatch.total_delta);
      if (dispatch.cartons_count !== undefined && dispatch.per_carton_count !== undefined) {
        return Math.abs((dispatch.cartons_count || 0) * (dispatch.per_carton_count || 12)) + Math.abs(dispatch.single_bottles_count || 0);
      }
      return 0;
    };
    const calculateDispatchValue = (dispatch) => calculateDispatchQuantity(dispatch) * 50;
    
    // Actions
    const selectItemForDispatch = (item) => {
      if (!canPerformDispatch.value) {
        store.dispatch('showNotification', { type: 'error', message: 'ليس لديك صلاحية لإجراء عمليات الصرف' });
        return;
      }
      selectedItemForDispatch.value = item;
      showDispatchModal.value = true;
    };
    
    const updateAvailableItems = () => {
      selectedItemForDispatch.value = null;
      filteredDispatchItems.value = [];
      searchTerm.value = '';
    };
    
    const handleModalClose = () => {
      showDispatchModal.value = false;
      selectedItemForDispatch.value = null;
    };
    
    const handleDispatchSuccess = async (result) => {
      try {
        if (!result) {
          store.dispatch('showNotification', { type: 'error', message: 'حدث خطأ غير متوقع' });
          return;
        }
        store.dispatch('showNotification', { type: 'success', title: 'تم الصرف بنجاح', message: result.message || `تم صرف ${result.quantity || 0} وحدة بنجاح` });
        showDispatchModal.value = false;
        selectedItemForDispatch.value = null;
        await store.dispatch('fetchTransactions');
      } catch (error) {
        console.error('Error in handleDispatchSuccess:', error);
        store.dispatch('showNotification', { type: 'error', message: 'حدث خطأ أثناء معالجة نتيجة الصرف' });
      }
    };
    
    const handleDispatchSearch = () => {
      if (dispatchSearchDebounceTimeout.value) clearTimeout(dispatchSearchDebounceTimeout.value);
      dispatchSearchDebounceTimeout.value = setTimeout(() => searchDispatchItemsWithSpark(), 300);
    };
    
    const searchDispatchItemsWithSpark = async () => {
      if (!searchTerm.value.trim() || searchTerm.value.trim().length < 2) {
        filteredDispatchItems.value = [];
        lastDispatchSearchSource.value = '';
        return;
      }
      searchingDispatchItems.value = true;
      try {
        const searchQuery = searchTerm.value.trim();
        const warehouseId = selectedWarehouse.value;
        let results = [], source = '';
        if (store.dispatch && typeof store.dispatch === 'function') {
          try {
            results = await store.dispatch('searchInventorySpark', { searchQuery, warehouseId, limit: 100, strategy: 'firebase_first' }) || [];
            source = 'firebase';
            if (results.length === 0) {
              results = await store.dispatch('searchLocalSpark', { query: searchQuery, warehouseId, limit: 50 }) || [];
              source = 'local_fallback';
            }
          } catch {
            results = await store.dispatch('searchLocalSpark', { query: searchQuery, warehouseId, limit: 50 }) || [];
            source = 'local_fallback';
          }
        } else {
          results = performBasicLocalSearch(searchQuery, warehouseId);
          source = 'cache';
        }
        filteredDispatchItems.value = results.map(item => ({
          id: item.id, name: item.name || '', code: item.code || '', color: item.color || '',
          supplier: item.supplier || '', warehouse_id: item.warehouse_id || '',
          remaining_quantity: item.remaining_quantity || 0, sale_price: item.sale_price || item.unitPrice || 0,
          cartons_count: item.cartons_count || 0, single_bottles_count: item.single_bottles_count || 0,
          per_carton_count: item.per_carton_count || 12, item_location: item.item_location || '',
          notes: item.notes || '', updated_at: item.updated_at || null
        }));
        lastDispatchSearchSource.value = source;
      } catch (error) {
        console.error('SPARK dispatch search error:', error);
        filteredDispatchItems.value = performBasicLocalSearch(searchTerm.value.trim(), selectedWarehouse.value);
        lastDispatchSearchSource.value = 'cache';
        store.dispatch('showNotification', { type: 'warning', message: 'البحث المحدود - استخدمنا البيانات المحلية' });
      } finally {
        searchingDispatchItems.value = false;
      }
    };
    
    const performBasicLocalSearch = (searchQuery, warehouseId) => {
      let items = allInventory.value.filter(item => item.remaining_quantity > 0);
      if (warehouseId) items = items.filter(item => item.warehouse_id === warehouseId);
      if (searchQuery) {
        const term = searchQuery.toLowerCase().trim();
        items = items.filter(item => 
          item.name?.toLowerCase().includes(term) ||
          item.code?.toLowerCase().includes(term) ||
          item.color?.toLowerCase().includes(term) ||
          item.supplier?.toLowerCase().includes(term)
        );
      }
      return items.sort((a, b) => b.remaining_quantity - a.remaining_quantity);
    };
    
    const applyHistoryFilters = () => { currentHistoryPage.value = 1; };
    const clearHistoryFilters = () => {
      historySearch.value = '';
      historyWarehouseFilter.value = '';
      dateFilter.value = 'all';
      customDateFrom.value = '';
      customDateTo.value = '';
      applyHistoryFilters();
    };
    const nextPage = () => { if (currentHistoryPage.value < totalHistoryPages.value) { currentHistoryPage.value++; window.scrollTo({ top: 0, behavior: 'smooth' }); } };
    const prevPage = () => { if (currentHistoryPage.value > 1) { currentHistoryPage.value--; window.scrollTo({ top: 0, behavior: 'smooth' }); } };
    
    const viewDispatchDetails = (dispatch) => {
      const quantity = calculateDispatchQuantity(dispatch);
      alert(`تفاصيل الصرف:\n\n• الصنف: ${dispatch.item_name || 'غير محدد'}\n• الكود: ${dispatch.item_code || 'N/A'}\n• الكمية: ${quantity} وحدة\n• من مخزن: ${getWarehouseLabel(dispatch.from_warehouse)}\n• إلى: ${store.getters.getDispatchDestinationName(dispatch)}\n• التاريخ: ${formatDateTime(dispatch.timestamp)}\n• القيمة: ${formatCurrency(calculateDispatchValue(dispatch))}\n• تم بواسطة: ${dispatch.user_name || dispatch.created_by || 'مستخدم النظام'}\n• الملاحظات: ${dispatch.notes || 'لا توجد ملاحظات'}`);
    };
    
    const printDispatch = (dispatch) => {
      // Implement print functionality as needed
    };
    
    const exportDispatches = async () => {
      // Implement export as needed
    };
    
    const setupRealtimeUpdates = () => {
      try {
        const q = query(collection(db, 'transactions'), where('type', '==', 'DISPATCH'), orderBy('timestamp', 'desc'), limit(100));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          if (transactions.length > 0 && dispatchTransactions.value.length > 0) {
            const latest = transactions[0];
            if (!dispatchTransactions.value.find(t => t.id === latest.id) && !showDispatchModal.value) {
              store.dispatch('showNotification', { type: 'info', message: `صرف جديد: ${latest.item_name} - ${calculateDispatchQuantity(latest)} وحدة`, duration: 5000 });
              store.dispatch('fetchTransactions');
            }
          }
        });
        realtimeUnsubscribe.value = unsubscribe;
      } catch (error) { console.error('Error setting up real-time updates:', error); }
    };
    
    const loadInitialData = async () => {
      loading.value = true;
      try {
        if (!canViewDispatches.value) {
          store.dispatch('showNotification', { type: 'error', message: 'يجب تسجيل الدخول لعرض صفحة الصرف' });
          setTimeout(() => window.location.href = '/login', 2000);
          return;
        }
        if (!store.state.warehousesLoaded || store.state.warehouses.length === 0) await store.dispatch('loadWarehouses');
        if (store.state.transactions.length === 0) await store.dispatch('fetchTransactions');
        if (store.state.inventory.length === 0) await store.dispatch('fetchInventory');
        if (availableWarehousesForDispatch.value.length === 1) selectedWarehouse.value = availableWarehousesForDispatch.value[0].id;
        setupRealtimeUpdates();
      } catch (error) {
        console.error('Error loading dispatch data:', error);
        store.dispatch('showNotification', { type: 'error', message: 'حدث خطأ في تحميل بيانات الصرف' });
      } finally { loading.value = false; }
    };
    
    onMounted(loadInitialData);
    onUnmounted(() => {
      if (searchTimeout.value) clearTimeout(searchTimeout.value);
      if (dispatchSearchDebounceTimeout.value) clearTimeout(dispatchSearchDebounceTimeout.value);
      if (realtimeUnsubscribe.value) realtimeUnsubscribe.value();
    });
    
    return {
      loading,
      showDispatchModal,
      selectedWarehouse,
      selectedItemForDispatch,
      searchTerm,
      historySearch,
      historyWarehouseFilter,
      dateFilter,
      customDateFrom,
      customDateTo,
      currentHistoryPage,
      showAllItems,
      userRole,
      userName,
      canPerformDispatch,
      canExport,
      canViewDispatches,
      availableWarehousesForDispatch,
      availableItems,
      displayedAvailableItems,
      totalDispatches,
      monthlyDispatches,
      totalDispatchValue,
      filteredDispatchHistory,
      paginatedHistory,
      totalHistoryPages,
      startIndex,
      endIndex,
      hasFilters,
      searchingDispatchItems,
      filteredDispatchItems,
      lastDispatchSearchSource,
      
      formatNumber,
      formatCurrency,
      formatDate,
      formatTime,
      formatDateTime,
      getWarehouseLabel,
      getDestinationLabel,
      getDateFilterLabel,
      getSearchSourceLabel,
      calculateDispatchQuantity,
      calculateDispatchValue,
      
      selectItemForDispatch,
      updateAvailableItems,
      handleModalClose,
      handleDispatchSuccess,
      handleDispatchSearch,
      applyHistoryFilters,
      clearHistoryFilters,
      nextPage,
      prevPage,
      viewDispatchDetails,
      printDispatch,
      exportDispatches,
      
      store
    };
  }
};
</script>

<style scoped>
/* Fixed layout styles */

/* Main container padding for mobile save button */
.min-h-screen {
  padding-bottom: 64px; /* Space for mobile save button */
}

@media (min-width: 640px) {
  .min-h-screen {
    padding-bottom: 0;
  }
}

/* Invoice Form Grid - Fixed width constraints */
.invoice-form-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto;
}

.form-field-container {
  @apply w-full;
}

.form-field-full {
  @apply lg:col-span-2 w-full;
}

/* Dispatch items grid - Fixed layout */
.available-items-grid-fixed {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
}

@media (max-width: 640px) {
  .available-items-grid-fixed {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .available-items-grid-fixed {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .available-items-grid-fixed {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1025px) {
  .available-items-grid-fixed {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Quantity label - Always RED for dispatch */
.quantity-red {
  @apply bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300;
}

.quantity-label {
  @apply inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300;
}

/* Search input constraints */
.search-input-constrained {
  @apply max-w-4xl mx-auto;
}

/* Mobile save button fix */
@media (max-width: 640px) {
  .mobile-save-button-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 40;
    background: white;
    padding: 12px;
    border-top: 1px solid #e5e7eb;
  }
}

/* Search result card - FIXED: removed invalid active:scale-98 */
.search-result-card {
  @apply p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm active:scale-95;
}

/* Ensure buttons are visible on mobile */
button, 
.btn-primary,
.btn-secondary,
.btn-success,
.input-field,
select,
.pagination-btn,
.search-input {
  min-height: 44px;
  min-width: 44px;
}

/* Z-index fixes for mobile */
.z-20 {
  z-index: 20;
}

.z-30 {
  z-index: 30;
}

.z-40 {
  z-index: 40;
}

.z-50 {
  z-index: 50;
}

/* Custom max-width constraints */
.max-w-constrained {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

/* Grid layout improvements */
.grid-improved {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

@media (max-width: 640px) {
  .grid-improved {
    grid-template-columns: 1fr;
  }
}

/* Dispatch table improvements */
.dispatch-table-row {
  @apply grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150;
}

.dispatch-table-header {
  @apply sticky top-0 z-10 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700;
}

/* Search results improvements */
.search-results-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3;
}

/* Search empty state */
.search-empty-state {
  @apply text-center py-8 sm:py-12 border border-gray-200 dark:border-gray-700 rounded-lg;
}

/* Warehouse select container */
.warehouse-select-container {
  @apply max-w-4xl mx-auto;
}

/* Invoice summary card */
.invoice-summary-card {
  @apply bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 sm:p-6;
}

/* Search stats container */
.search-stats-container {
  @apply flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3;
}

.search-source-badge {
  @apply px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded text-xs;
}

/* Search tips container */
.search-tips-container {
  @apply bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 mt-3;
}

.search-tips-title {
  @apply text-xs font-medium text-gray-700 dark:text-gray-300 mb-2;
}

.search-tips-list {
  @apply space-y-1 text-xs text-gray-600 dark:text-gray-400;
}

.search-tip-item {
  @apply list-disc list-inside;
}

.search-tip-highlight {
  @apply text-blue-600 dark:text-blue-400 font-medium;
}

/* Selected items container */
.selected-items-container {
  @apply border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden max-w-full mx-auto;
}

/* Selected item card */
.selected-item-card {
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-3;
}

/* Pagination container */
.pagination-container {
  @apply px-3 sm:px-4 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700;
}

/* Action buttons */
.action-btn {
  @apply p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors;
}

/* Stat card */
.stat-card {
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4;
}

.stat-icon {
  @apply h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center flex-shrink-0;
}

/* Form fields */
.input-field {
  @apply px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

/* Buttons */
.btn-primary {
  @apply inline-flex items-center px-3 sm:px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px];
}

.btn-secondary {
  @apply inline-flex items-center px-3 sm:px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px];
}

.btn-success {
  @apply inline-flex items-center px-3 sm:px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px];
}

/* Search input */
.search-input {
  @apply w-full px-3 sm:px-4 py-2.5 pr-9 sm:pr-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

/* Pagination button */
.pagination-btn {
  @apply px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[34px] sm:min-h-[36px] min-w-[70px] sm:min-w-[80px];
}

/* Filters container */
.filters-container {
  @apply flex flex-wrap gap-2;
}

/* Dispatch table container */
.dispatch-table-container {
  @apply bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6 sm:mb-8;
}

/* Invoice form container */
.invoice-form-container {
  @apply bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-4 sm:mb-6 max-w-full mx-auto;
}

/* Input width constraints */
.input-constrained {
  max-width: 100%;
}

@media (min-width: 768px) {
  .input-constrained {
    max-width: 400px;
  }
}

/* Card hover effects */
.card-hover {
  @apply transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5;
}

/* Loading states */
.loading-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  body {
    background: white !important;
    color: black !important;
  }
}

/* RTL specific adjustments */
[dir="rtl"] .space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}

/* Animation utilities */
.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive typography */
.responsive-text {
  font-size: clamp(0.875rem, 2vw, 1rem);
}

.responsive-heading {
  font-size: clamp(1.25rem, 3vw, 1.5rem);
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  button,
  .search-result-card,
  .available-item-card {
    min-height: 48px;
  }
  
  input,
  select,
  textarea {
    font-size: 16px; /* Prevents iOS zoom on focus */
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .search-input,
  .input-field {
    border: 2px solid currentColor;
  }
  
  button {
    border: 2px solid currentColor;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Dark mode improvements */
@media (prefers-color-scheme: dark) {
  .search-input {
    background-color: #374151;
    border-color: #4b5563;
    color: #f3f4f6;
  }
  
  .search-input::placeholder {
    color: #9ca3af;
  }
}

/* Custom utilities for layout */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid-center {
  display: grid;
  place-items: center;
}

.truncate-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.truncate-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom shadows for elevation */
.shadow-elevation-1 {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.shadow-elevation-2 {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.shadow-elevation-3 {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* Gradient backgrounds */
.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-gradient-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.bg-gradient-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.bg-gradient-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

/* Status indicators */
.status-indicator {
  @apply inline-block h-2 w-2 rounded-full mr-2;
}

.status-active {
  @apply bg-green-500;
}

.status-inactive {
  @apply bg-gray-400;
}

.status-pending {
  @apply bg-yellow-500;
}

.status-error {
  @apply bg-red-500;
}

/* Badge variants */
.badge {
  @apply inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium;
}

.badge-primary {
  @apply bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300;
}

.badge-success {
  @apply bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300;
}

.badge-warning {
  @apply bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300;
}

.badge-danger {
  @apply bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300;
}

.badge-info {
  @apply bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300;
}

/* Loading skeleton */
.skeleton {
  @apply animate-pulse bg-gray-200 dark:bg-gray-700 rounded;
}

.skeleton-text {
  @apply h-4 bg-gray-200 dark:bg-gray-700 rounded;
}

.skeleton-card {
  @apply animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32;
}

/* Focus styles for accessibility */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900;
}

/* Custom transitions */
.transition-fast {
  transition: all 150ms ease;
}

.transition-medium {
  transition: all 250ms ease;
}

.transition-slow {
  transition: all 350ms ease;
}

/* Custom borders */
.border-subtle {
  @apply border-gray-200 dark:border-gray-700;
}

.border-emphasis {
  @apply border-gray-300 dark:border-gray-600;
}

/* Custom opacity */
.opacity-hover:hover {
  opacity: 0.9;
}

.opacity-disabled {
  opacity: 0.5;
}

/* Custom cursor */
.cursor-grab {
  cursor: grab;
}

.cursor-grabbing {
  cursor: grabbing;
}

/* Custom line clamp */
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

/* Custom width utilities */
.w-responsive {
  @apply w-full sm:w-auto;
}

/* Custom height utilities */
.h-responsive {
  @apply h-auto sm:h-64 lg:h-96;
}

/* Custom min-height utilities */
.min-h-responsive {
  @apply min-h-[150px] sm:min-h-[200px] lg:min-h-[300px];
}

/* Custom gap utilities */
.gap-responsive {
  @apply gap-2 sm:gap-3 lg:gap-4;
}

/* Custom margin utilities */
.margin-responsive {
  @apply my-3 sm:my-4 lg:my-6;
}

/* Custom padding utilities */
.padding-responsive {
  @apply p-3 sm:p-4 lg:p-6;
}

/* Custom text utilities */
.text-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

.text-responsive-heading {
  @apply text-lg sm:text-xl lg:text-2xl;
}

/* Custom grid utilities */
.grid-responsive {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4;
}

/* Custom flex utilities */
.flex-responsive {
  @apply flex flex-col sm:flex-row;
}

/* Custom container utilities */
.container-constrained {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

/* Custom position utilities */
.sticky-header {
  @apply sticky top-0 z-40;
}

.sticky-footer {
  @apply sticky bottom-0 z-40;
}

/* Custom overflow utilities */
.overflow-touch {
  -webkit-overflow-scrolling: touch;
}

/* Custom transform utilities */
.transform-gpu {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

/* Custom filter utilities */
.filter-blur {
  backdrop-filter: blur(8px);
}

/* Custom background utilities */
.bg-blur {
  @apply bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm;
}

/* Custom shadow utilities */
.shadow-inset {
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}

/* Custom border radius utilities */
.rounded-inherit {
  border-radius: inherit;
}

/* Custom z-index utilities */
.z-dropdown {
  z-index: 1000;
}

.z-modal {
  z-index: 2000;
}

.z-tooltip {
  z-index: 3000;
}

/* Custom visibility utilities */
.visibility-hidden {
  visibility: hidden;
}

.visibility-visible {
  visibility: visible;
}

/* Custom pointer events utilities */
.pointer-events-none {
  pointer-events: none;
}

.pointer-events-auto {
  pointer-events: auto;
}

/* Custom user select utilities */
.user-select-none {
  user-select: none;
}

.user-select-text {
  user-select: text;
}

/* Custom resize utilities */
.resize-none {
  resize: none;
}

.resize-vertical {
  resize: vertical;
}

.resize-horizontal {
  resize: horizontal;
}

/* Custom whitespace utilities */
.whitespace-normal {
  white-space: normal;
}

.whitespace-nowrap {
  white-space: nowrap;
}

.whitespace-pre {
  white-space: pre;
}

.whitespace-pre-line {
  white-space: pre-line;
}

.whitespace-pre-wrap {
  white-space: pre-wrap;
}

/* Custom word break utilities */
.break-normal {
  overflow-wrap: normal;
  word-break: normal;
}

.break-words {
  overflow-wrap: break-word;
}

.break-all {
  word-break: break-all;
}

/* Custom content utilities */
.content-empty:empty::before {
  content: '—';
  color: #9ca3af;
}

/* Custom list utilities */
.list-inside {
  list-style-position: inside;
}

.list-outside {
  list-style-position: outside;
}

/* Custom table utilities */
.table-auto {
  table-layout: auto;
}

.table-fixed {
  table-layout: fixed;
}

/* Custom caption utilities */
.caption-top {
  caption-side: top;
}

.caption-bottom {
  caption-side: bottom;
}

/* Custom border collapse utilities */
.border-collapse {
  border-collapse: collapse;
}

.border-separate {
  border-collapse: separate;
}

/* Custom border spacing utilities */
.border-spacing-0 {
  border-spacing: 0;
}

.border-spacing-2 {
  border-spacing: 0.5rem;
}

/* Custom mix blend mode utilities */
.mix-blend-normal {
  mix-blend-mode: normal;
}

.mix-blend-multiply {
  mix-blend-mode: multiply;
}

.mix-blend-screen {
  mix-blend-mode: screen;
}

.mix-blend-overlay {
  mix-blend-mode: overlay;
}

.mix-blend-darken {
  mix-blend-mode: darken;
}

.mix-blend-lighten {
  mix-blend-mode: lighten;
}

.mix-blend-color-dodge {
  mix-blend-mode: color-dodge;
}

.mix-blend-color-burn {
  mix-blend-mode: color-burn;
}

.mix-blend-hard-light {
  mix-blend-mode: hard-light;
}

.mix-blend-soft-light {
  mix-blend-mode: soft-light;
}

.mix-blend-difference {
  mix-blend-mode: difference;
}

.mix-blend-exclusion {
  mix-blend-mode: exclusion;
}

.mix-blend-hue {
  mix-blend-mode: hue;
}

.mix-blend-saturation {
  mix-blend-mode: saturation;
}

.mix-blend-color {
  mix-blend-mode: color;
}

.mix-blend-luminosity {
  mix-blend-mode: luminosity;
}

/* Custom background blend mode utilities */
.bg-blend-normal {
  background-blend-mode: normal;
}

.bg-blend-multiply {
  background-blend-mode: multiply;
}

.bg-blend-screen {
  background-blend-mode: screen;
}

.bg-blend-overlay {
  background-blend-mode: overlay;
}

.bg-blend-darken {
  background-blend-mode: darken;
}

.bg-blend-lighten {
  background-blend-mode: lighten;
}

.bg-blend-color-dodge {
  background-blend-mode: color-dodge;
}

.bg-blend-color-burn {
  background-blend-mode: color-burn;
}

.bg-blend-hard-light {
  background-blend-mode: hard-light;
}

.bg-blend-soft-light {
  background-blend-mode: soft-light;
}

.bg-blend-difference {
  background-blend-mode: difference;
}

.bg-blend-exclusion {
  background-blend-mode: exclusion;
}

.bg-blend-hue {
  background-blend-mode: hue;
}

.bg-blend-saturation {
  background-blend-mode: saturation;
}

.bg-blend-color {
  background-blend-mode: color;
}

.bg-blend-luminosity {
  background-blend-mode: luminosity;
}
</style>