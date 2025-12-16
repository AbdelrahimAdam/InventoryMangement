<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4 space-x-reverse">
            <router-link to="/" class="flex items-center space-x-2 space-x-reverse hover:opacity-80 transition-opacity">
              <div class="h-8 w-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">م</span>
              </div>
              <div>
                <h1 class="text-lg font-bold text-gray-900 dark:text-white">صرف المخزون</h1>
                <p class="text-xs text-gray-500 dark:text-gray-400">نظام إدارة المخزون</p>
              </div>
            </router-link>
          </div>

          <div class="flex items-center space-x-3 space-x-reverse">
            <div class="hidden md:flex items-center space-x-2 space-x-reverse text-sm">
              <span class="text-gray-600 dark:text-gray-300">{{ userName }}</span>
              <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-xs">
                {{ userRole }}
              </span>
            </div>
            
            <router-link 
              to="/inventory" 
              class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              المخزون
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main class="w-full px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center ml-2 sm:ml-4">
              <svg class="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">إجمالي عمليات الصرف</p>
              <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(totalDispatches) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center ml-2 sm:ml-4">
              <svg class="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">صرف هذا الشهر</p>
              <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(monthlyDispatches) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center ml-2 sm:ml-4">
              <svg class="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">قيمة الصرف</p>
              <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(totalDispatchValue) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Dispatch Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">إنشاء صرف جديد</h2>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">صرف أصناف من المخازن إلى خارج النظام</p>
          </div>
          
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <!-- Search Box -->
            <div class="relative flex-1 min-w-[200px]">
              <input
                type="text"
                v-model="searchTerm"
                @input="handleSearch"
                placeholder="ابحث عن صنف..."
                class="w-full px-4 py-2.5 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                :disabled="loading"
              >
              <svg class="absolute right-3 top-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            
            <!-- Warehouse Filter for Available Items -->
            <select
              v-model="selectedWarehouse"
              @change="updateAvailableItems"
              class="px-3 sm:px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 min-h-[44px] min-w-[180px]"
              :disabled="loading || !dispatchFromWarehouses.length"
            >
              <option value="">جميع المخازن</option>
              <option v-for="warehouse in dispatchFromWarehouses" :key="warehouse.id" :value="warehouse.id">
                {{ warehouse.name_ar }}
              </option>
            </select>
            
            <button 
              v-if="canPerformDispatch"
              @click="showDispatchModal = true"
              :disabled="loading || availableItems.length === 0"
              class="inline-flex items-center justify-center px-3 sm:px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[140px]"
            >
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span class="hidden sm:inline">إنشاء صرف جديد</span>
              <span class="inline sm:hidden">صرف جديد</span>
            </button>
          </div>
        </div>

        <!-- Available Items -->
        <div v-if="availableItems.length > 0" class="mt-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ selectedWarehouse ? `الأصناف المتاحة في ${getWarehouseLabel(selectedWarehouse)}` : 'جميع الأصناف المتاحة' }}
              <span class="text-xs text-gray-500">({{ availableItems.length }} صنف)</span>
            </h3>
            <div class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <span>المعروض: {{ Math.min(8, availableItems.length) }} من {{ availableItems.length }}</span>
            </div>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
            <div 
              v-for="item in displayedAvailableItems" 
              :key="item.id"
              class="p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm"
              @click="selectItemForDispatch(item)"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ item.name }}</p>
                  <div class="flex items-center flex-wrap gap-1 sm:gap-2 mt-1">
                    <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{{ item.code }}</span>
                    <span class="text-xs px-1.5 py-0.5 rounded" 
                          :class="getQuantityClass(item.remaining_quantity)">
                      {{ formatNumber(item.remaining_quantity) }} متبقي
                    </span>
                    <span v-if="item.warehouse_id" class="text-xs text-gray-500 dark:text-gray-400">
                      {{ getWarehouseLabel(item.warehouse_id) }}
                    </span>
                  </div>
                </div>
                <svg class="w-4 h-4 text-gray-400 flex-shrink-0 mr-1 sm:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div v-if="availableItems.length > 8" class="text-center mt-4">
            <button 
              @click="showAllItems = !showAllItems"
              class="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg transition-colors"
            >
              {{ showAllItems ? 'عرض أقل' : `عرض المزيد (+${availableItems.length - 8})` }}
            </button>
          </div>
        </div>
        
        <div v-else-if="!loading" class="text-center py-8">
          <div class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
            <svg class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
            </svg>
          </div>
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            {{ selectedWarehouse ? 'لا توجد أصناف في هذا المخزن' : 'لا توجد أصناف متاحة' }}
          </p>
        </div>
        
        <div v-else class="text-center py-6">
          <div class="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600 mx-auto mb-3"></div>
          <p class="text-gray-500 dark:text-gray-400 text-xs">جاري تحميل الأصناف...</p>
        </div>
      </div>

      <!-- Dispatch History -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <div class="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            <div>
              <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">سجل عمليات الصرف</h2>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">جميع عمليات الصرف المسجلة في النظام</p>
            </div>
            
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <!-- Search History -->
              <div class="relative flex-1 sm:flex-initial min-w-[200px]">
                <input
                  type="text"
                  v-model="historySearch"
                  @input="applyHistoryFilters"
                  placeholder="بحث في السجل..."
                  class="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                <svg class="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              
              <!-- Warehouse Filter -->
              <select
                v-model="historyWarehouseFilter"
                @change="applyHistoryFilters"
                class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm min-w-[150px]"
              >
                <option value="">جميع المخازن</option>
                <option v-for="warehouse in dispatchFromWarehouses" :key="warehouse.id" :value="warehouse.id">
                  {{ warehouse.name_ar }}
                </option>
              </select>
              
              <!-- Date Filter -->
              <select
                v-model="dateFilter"
                @change="applyHistoryFilters"
                class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm min-w-[140px]"
              >
                <option value="all">جميع الفترات</option>
                <option value="today">اليوم</option>
                <option value="week">هذا الأسبوع</option>
                <option value="month">هذا الشهر</option>
                <option value="custom">فترة مخصصة</option>
              </select>
              
              <!-- Custom Date Range -->
              <div v-if="dateFilter === 'custom'" class="flex flex-wrap items-center gap-2">
                <input 
                  type="date" 
                  v-model="customDateFrom"
                  @change="applyHistoryFilters"
                  class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm min-w-[120px]"
                >
                <span class="text-gray-500 dark:text-gray-400 text-xs">إلى</span>
                <input 
                  type="date" 
                  v-model="customDateTo"
                  @change="applyHistoryFilters"
                  class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm min-w-[120px]"
                >
              </div>
              
              <!-- Export Button -->
              <button 
                v-if="canExport"
                @click="exportDispatches"
                :disabled="filteredDispatchHistory.length === 0"
                class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <span class="hidden sm:inline">تصدير Excel</span>
                <span class="inline sm:hidden">تصدير</span>
              </button>
            </div>
          </div>
          
          <!-- Active Filters Badges -->
          <div v-if="hasFilters" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs text-gray-600 dark:text-gray-400">الفلاتر النشطة:</span>
              
              <span v-if="historySearch" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                بحث: "{{ historySearch }}"
                <button @click="historySearch = ''; applyHistoryFilters()" class="mr-1 hover:text-blue-900 dark:hover:text-blue-200">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </span>
              
              <span v-if="historyWarehouseFilter" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300">
                مخزن: {{ getWarehouseLabel(historyWarehouseFilter) }}
                <button @click="historyWarehouseFilter = ''; applyHistoryFilters()" class="mr-1 hover:text-indigo-900 dark:hover:text-indigo-200">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </span>
              
              <span v-if="dateFilter !== 'all'" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300">
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
                class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-700 dark:text-gray-300 text-sm">جاري تحميل البيانات...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredDispatchHistory.length === 0" class="p-6 sm:p-8 text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
            <svg class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </div>
          <h3 class="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">لا توجد عمليات صرف</h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">
            {{ hasFilters ? 'لا توجد عمليات صرف تطابق التصفية المحددة' : 'لم يتم تسجيل أي عمليات صرف حتى الآن' }}
          </p>
          <button 
            v-if="canPerformDispatch"
            @click="showDispatchModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm min-h-[44px]"
          >
            إنشاء أول صرف
          </button>
        </div>

        <!-- Table Content -->
        <div v-else class="w-full overflow-hidden">
          <!-- Desktop Table -->
          <div class="hidden lg:block">
            <!-- Fixed Table Headers -->
            <div class="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div class="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                <div class="col-span-2 text-right">التاريخ والوقت</div>
                <div class="col-span-2 text-right">الصنف</div>
                <div class="col-span-2 text-right">من مخزن</div>
                <div class="col-span-1 text-right">إلى</div>
                <div class="col-span-1 text-right">الكمية</div>
                <div class="col-span-1 text-right">القيمة</div>
                <div class="col-span-1 text-right">بواسطة</div>
                <div class="col-span-2 text-right">الإجراءات</div>
              </div>
            </div>
            
            <!-- Scrollable Table Body -->
            <div class="overflow-y-auto" style="max-height: calc(100vh - 400px);">
              <div class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <div 
                  v-for="dispatch in paginatedHistory" 
                  :key="dispatch.id" 
                  class="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 border-b border-gray-100 dark:border-gray-700"
                >
                  <!-- Date & Time -->
                  <div class="col-span-2">
                    <div class="text-sm text-gray-900 dark:text-white">{{ formatDate(dispatch.timestamp) }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(dispatch.timestamp) }}</div>
                  </div>
                  
                  <!-- Item -->
                  <div class="col-span-2">
                    <div class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ dispatch.item_name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ dispatch.item_code }}</div>
                  </div>
                  
                  <!-- From Warehouse -->
                  <div class="col-span-2 text-sm text-gray-900 dark:text-white truncate">
                    {{ getWarehouseLabel(dispatch.from_warehouse) }}
                  </div>
                  
                  <!-- Destination -->
                  <div class="col-span-1 text-sm text-gray-900 dark:text-white truncate">
                    {{ getDestinationLabel(dispatch.destination || dispatch.to_warehouse) }}
                  </div>
                  
                  <!-- Quantity -->
                  <div class="col-span-1">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap" 
                          :class="getDispatchQuantityClass(dispatch.total_delta)">
                      {{ formatNumber(Math.abs(dispatch.total_delta)) }}
                    </span>
                  </div>
                  
                  <!-- Value -->
                  <div class="col-span-1 text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ formatCurrency(calculateDispatchValue(dispatch)) }}
                  </div>
                  
                  <!-- User -->
                  <div class="col-span-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                    {{ dispatch.user_name || dispatch.created_by || 'مستخدم النظام' }}
                  </div>
                  
                  <!-- Actions -->
                  <div class="col-span-2">
                    <div class="flex items-center space-x-2 space-x-reverse">
                      <button 
                        @click="viewDispatchDetails(dispatch)"
                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                        title="عرض التفاصيل"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </button>
                      <button 
                        @click="printDispatch(dispatch)"
                        class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 hover:bg-green-50 dark:hover:bg-green-900/30 rounded"
                        title="طباعة"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div class="p-2 sm:p-4">
              <div class="space-y-3">
                <div 
                  v-for="dispatch in paginatedHistory" 
                  :key="dispatch.id" 
                  class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-150"
                >
                  <!-- Header -->
                  <div class="flex justify-between items-start mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ dispatch.item_name }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatDate(dispatch.timestamp) }} - {{ formatTime(dispatch.timestamp) }}</div>
                    </div>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap" 
                          :class="getDispatchQuantityClass(dispatch.total_delta)">
                      {{ formatNumber(Math.abs(dispatch.total_delta)) }}
                    </span>
                  </div>
                  
                  <!-- Details Grid -->
                  <div class="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">من مخزن</div>
                      <div class="font-medium text-gray-900 dark:text-white">{{ getWarehouseLabel(dispatch.from_warehouse) }}</div>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">إلى</div>
                      <div class="font-medium text-gray-900 dark:text-white">{{ getDestinationLabel(dispatch.destination || dispatch.to_warehouse) }}</div>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">القيمة</div>
                      <div class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(calculateDispatchValue(dispatch)) }}</div>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">بواسطة</div>
                      <div class="font-medium text-gray-900 dark:text-white">{{ dispatch.user_name || dispatch.created_by || 'مستخدم النظام' }}</div>
                    </div>
                  </div>
                  
                  <!-- Actions -->
                  <div class="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ dispatch.item_code }}
                    </div>
                    <div class="flex items-center space-x-3 space-x-reverse">
                      <button 
                        @click="viewDispatchDetails(dispatch)"
                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center p-1"
                      >
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        تفاصيل
                      </button>
                      <button 
                        @click="printDispatch(dispatch)"
                        class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-sm flex items-center p-1"
                      >
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div v-if="totalHistoryPages > 1" class="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-right">
                عرض {{ startIndex + 1 }} - {{ Math.min(endIndex, filteredDispatchHistory.length) }} من {{ filteredDispatchHistory.length }}
              </div>
              <div class="flex items-center justify-center space-x-2">
                <button 
                  @click="prevPage"
                  :disabled="currentHistoryPage === 1"
                  class="px-3 py-1.5 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[36px] min-w-[80px]"
                >
                  السابق
                </button>
                <span class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 min-w-[100px] text-center">
                  صفحة {{ currentHistoryPage }} من {{ totalHistoryPages }}
                </span>
                <button 
                  @click="nextPage"
                  :disabled="currentHistoryPage === totalHistoryPages"
                  class="px-3 py-1.5 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[36px] min-w-[80px]"
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
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 flex flex-col items-center">
        <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-700 dark:text-gray-300 text-sm">جاري تحميل البيانات...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import * as XLSX from 'xlsx';
import DispatchModal from '@/components/inventory/DispatchModal.vue';
import { collection, query, where, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/config';

export default {
  name: 'DispatchPage',
  
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
    
    // Computed properties from store
    const userRole = computed(() => store.getters.userRole);
    const userName = computed(() => store.getters.userName);
    const userProfile = computed(() => store.state.userProfile);
    const allInventory = computed(() => store.state.inventory || []);
    const allTransactions = computed(() => store.state.transactions || []);
    const allWarehouses = computed(() => store.state.warehouses || []);
    
    // Store getters
    const canExport = computed(() => userRole.value === 'superadmin' || userRole.value === 'company_manager');
    const dispatchFromWarehouses = computed(() => store.getters.dispatchFromWarehouses || []);
    const canViewDispatches = computed(() => {
      // All authenticated users can view dispatches
      return store.getters.isAuthenticated;
    });
    
    // Check if user can perform dispatch (only superadmin)
    const canPerformDispatch = computed(() => {
      return userRole.value === 'superadmin';
    });
    
    // Dispatch transactions (type = 'DISPATCH')
    const dispatchTransactions = computed(() => {
      return (allTransactions.value || []).filter(t => t.type === 'DISPATCH');
    });
    
    // Stats
    const totalDispatches = computed(() => {
      return dispatchTransactions.value.length;
    });
    
    const monthlyDispatches = computed(() => {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      return dispatchTransactions.value.filter(t => {
        try {
          const dispatchDate = t.timestamp?.toDate ? t.timestamp.toDate() : new Date(t.timestamp);
          return dispatchDate >= oneMonthAgo;
        } catch (error) {
          return false;
        }
      }).length;
    });
    
    const totalDispatchValue = computed(() => {
      return dispatchTransactions.value.reduce((total, dispatch) => {
        return total + calculateDispatchValue(dispatch);
      }, 0);
    });
    
    // Available items with search and warehouse filtering
    const availableItems = computed(() => {
      let items = allInventory.value.filter(item => item.remaining_quantity > 0);
      
      // Filter by warehouse
      if (selectedWarehouse.value) {
        items = items.filter(item => item.warehouse_id === selectedWarehouse.value);
      }
      
      // Filter by search term
      if (searchTerm.value.trim()) {
        const term = searchTerm.value.toLowerCase().trim();
        items = items.filter(item => 
          item.name?.toLowerCase().includes(term) ||
          item.code?.toLowerCase().includes(term) ||
          item.color?.toLowerCase().includes(term) ||
          item.supplier?.toLowerCase().includes(term)
        );
      }
      
      // Sort by quantity descending
      return items.sort((a, b) => b.remaining_quantity - a.remaining_quantity);
    });
    
    // Display limited or all available items
    const displayedAvailableItems = computed(() => {
      if (showAllItems.value) {
        return availableItems.value;
      }
      return availableItems.value.slice(0, 8);
    });
    
    // Filter dispatch history
    const filteredDispatchHistory = computed(() => {
      let filtered = [...dispatchTransactions.value];
      
      // Filter by search
      if (historySearch.value.trim()) {
        const term = historySearch.value.toLowerCase().trim();
        filtered = filtered.filter(d => 
          d.item_name?.toLowerCase().includes(term) ||
          d.item_code?.toLowerCase().includes(term) ||
          d.destination?.toLowerCase().includes(term) ||
          d.notes?.toLowerCase().includes(term)
        );
      }
      
      // Filter by warehouse
      if (historyWarehouseFilter.value) {
        filtered = filtered.filter(d => d.from_warehouse === historyWarehouseFilter.value);
      }
      
      // Filter by date
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
                } catch (error) {
                  return false;
                }
              });
            }
            break;
        }
        
        if (startDate) {
          filtered = filtered.filter(d => {
            try {
              const dispatchDate = d.timestamp?.toDate ? d.timestamp.toDate() : new Date(d.timestamp);
              return dispatchDate >= startDate;
            } catch (error) {
              return false;
            }
          });
        }
      }
      
      // Sort by date (newest first)
      filtered.sort((a, b) => {
        try {
          const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
          const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
          return dateB - dateA;
        } catch (error) {
          return 0;
        }
      });
      
      return filtered;
    });
    
    // Pagination for history
    const totalHistoryPages = computed(() => {
      return Math.ceil(filteredDispatchHistory.value.length / itemsPerPage.value);
    });
    
    const startIndex = computed(() => {
      return (currentHistoryPage.value - 1) * itemsPerPage.value;
    });
    
    const endIndex = computed(() => {
      return Math.min(startIndex.value + itemsPerPage.value, filteredDispatchHistory.value.length);
    });
    
    const paginatedHistory = computed(() => {
      return filteredDispatchHistory.value.slice(startIndex.value, endIndex.value);
    });
    
    // Check if any filters are active
    const hasFilters = computed(() => {
      return historySearch.value.trim() || historyWarehouseFilter.value || dateFilter.value !== 'all';
    });
    
    // Helper functions
    const formatNumber = (num) => {
      if (num === undefined || num === null) return '0';
      return new Intl.NumberFormat('en-US').format(num);
    };
    
    const formatCurrency = (amount) => {
      if (amount === undefined || amount === null) return '0 ج.م';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };
    
    const formatDate = (timestamp) => {
      if (!timestamp) return '-';
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      } catch (error) {
        return '-';
      }
    };
    
    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return '';
      }
    };
    
    const formatDateTime = (timestamp) => {
      if (!timestamp) return '-';
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString('ar-EG', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return '-';
      }
    };
    
    const getWarehouseLabel = (warehouseId) => {
      if (!warehouseId) return '';
      const warehouse = allWarehouses.value.find(w => w.id === warehouseId);
      return warehouse ? warehouse.name_ar : warehouseId;
    };
    
    const getDestinationLabel = (destinationId) => {
      if (!destinationId) return '';
      const destination = allWarehouses.value.find(w => w.id === destinationId);
      return destination ? destination.name_ar : destinationId;
    };
    
    const getDateFilterLabel = (filter) => {
      const labels = {
        'today': 'اليوم',
        'week': 'هذا الأسبوع',
        'month': 'هذا الشهر',
        'custom': 'مخصص'
      };
      return labels[filter] || filter;
    };
    
    const calculateDispatchValue = (dispatch) => {
      const quantity = Math.abs(dispatch.total_delta || 0);
      const pricePerItem = 50; // Default price
      return quantity * pricePerItem;
    };
    
    const getDispatchQuantityClass = (quantity) => {
      const qty = Math.abs(quantity || 0);
      if (qty < 10) return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300';
      if (qty < 50) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300';
      return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300';
    };
    
    const getQuantityClass = (quantity) => {
      if (quantity < 10) return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300';
      if (quantity < 50) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300';
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300';
    };
    
    // Actions
    const selectItemForDispatch = (item) => {
      if (!canPerformDispatch.value) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية لإجراء عمليات الصرف'
        });
        return;
      }
      selectedItemForDispatch.value = item;
      showDispatchModal.value = true;
    };
    
    const updateAvailableItems = () => {
      selectedItemForDispatch.value = null;
    };
    
    const handleModalClose = () => {
      showDispatchModal.value = false;
      selectedItemForDispatch.value = null;
    };
    
    const handleDispatchSuccess = () => {
      showDispatchModal.value = false;
      selectedItemForDispatch.value = null;
      
      // Reset to first page after successful dispatch
      currentHistoryPage.value = 1;
      
      // Show success message
      store.dispatch('showNotification', {
        type: 'success',
        message: 'تمت عملية الصرف بنجاح'
      });
    };
    
    // Debounced search
    const handleSearch = () => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }
      searchTimeout.value = setTimeout(() => {
        // Search is handled by computed property
      }, 300);
    };
    
    const applyHistoryFilters = () => {
      currentHistoryPage.value = 1;
    };
    
    const clearHistoryFilters = () => {
      historySearch.value = '';
      historyWarehouseFilter.value = '';
      dateFilter.value = 'all';
      customDateFrom.value = '';
      customDateTo.value = '';
      applyHistoryFilters();
    };
    
    const nextPage = () => {
      if (currentHistoryPage.value < totalHistoryPages.value) {
        currentHistoryPage.value++;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    const prevPage = () => {
      if (currentHistoryPage.value > 1) {
        currentHistoryPage.value--;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    const viewDispatchDetails = (dispatch) => {
      const details = `
تفاصيل الصرف:

• الصنف: ${dispatch.item_name}
• الكود: ${dispatch.item_code || 'N/A'}
• الكمية: ${Math.abs(dispatch.total_delta)} وحدة
• من مخزن: ${getWarehouseLabel(dispatch.from_warehouse)}
• إلى: ${getDestinationLabel(dispatch.destination || dispatch.to_warehouse)}
• التاريخ: ${formatDateTime(dispatch.timestamp)}
• القيمة: ${formatCurrency(calculateDispatchValue(dispatch))}
• تم بواسطة: ${dispatch.user_name || dispatch.created_by || 'مستخدم النظام'}
• الملاحظات: ${dispatch.notes || 'لا توجد ملاحظات'}
      `;
      
      alert(details);
    };
    
    const printDispatch = (dispatch) => {
      const printWindow = window.open('', '_blank');
      const printContent = `
        <html dir="rtl">
        <head>
          <title>طباعة صرف ${dispatch.item_name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap');
            body { font-family: 'Cairo', sans-serif; padding: 20px; background: white; color: black; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 15px; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #333; }
            .details { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
            .details th, .details td { padding: 8px 12px; border: 1px solid #ddd; text-align: right; }
            .details th { background-color: #f5f5f5; font-weight: bold; color: #333; }
            .signature { margin-top: 50px; padding-top: 20px; border-top: 2px solid #333; }
            .signature-section { display: flex; justify-content: space-between; margin-top: 30px; }
            .signature-box { width: 45%; text-align: center; }
            @media print { 
              body { padding: 10px; margin: 0; }
              .no-print { display: none !important; }
              @page { margin: 0.5in; }
            }
            .company-info { margin-bottom: 20px; text-align: center; font-size: 12px; color: #666; }
            .logo { width: 80px; height: 80px; background: #4f46e5; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 32px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">م</div>
            <div class="company-info">
              <div>نظام إدارة المخزون</div>
              <div>سند صرف مخزون</div>
              <div>${new Date().toLocaleDateString('ar-EG')}</div>
            </div>
          </div>
          
          <table class="details">
            <tr>
              <th>رقم العملية</th>
              <td>${dispatch.id || 'N/A'}</td>
            </tr>
            <tr>
              <th>اسم الصنف</th>
              <td>${dispatch.item_name}</td>
            </tr>
            <tr>
              <th>كود الصنف</th>
              <td>${dispatch.item_code || 'N/A'}</td>
            </tr>
            <tr>
              <th>الكمية</th>
              <td>${Math.abs(dispatch.total_delta)} وحدة</td>
            </tr>
            <tr>
              <th>من مخزن</th>
              <td>${getWarehouseLabel(dispatch.from_warehouse)}</td>
            </tr>
            <tr>
              <th>إلى</th>
              <td>${getDestinationLabel(dispatch.destination || dispatch.to_warehouse)}</td>
            </tr>
            <tr>
              <th>تاريخ الصرف</th>
              <td>${formatDateTime(dispatch.timestamp)}</td>
            </tr>
            <tr>
              <th>القيمة التقديرية</th>
              <td>${formatCurrency(calculateDispatchValue(dispatch))}</td>
            </tr>
            <tr>
              <th>تم بواسطة</th>
              <td>${dispatch.user_name || dispatch.created_by || 'مستخدم النظام'}</td>
            </tr>
            <tr>
              <th>ملاحظات</th>
              <td>${dispatch.notes || 'لا توجد ملاحظات'}</td>
            </tr>
          </table>
          
          <div class="signature">
            <div class="signature-section">
              <div class="signature-box">
                <p>توقيع المستلم:</p>
                <p style="margin-top: 60px;">___________________</p>
              </div>
              <div class="signature-box">
                <p>توقيع المسؤول:</p>
                <p style="margin-top: 60px;">___________________</p>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 30px; font-size: 10px; text-align: center; color: #999;">
            تم الإنشاء بواسطة نظام إدارة المخزون | ${new Date().toLocaleString('ar-EG')}
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => {
                window.close();
              }, 1000);
            }
          <\/script>
        </body>
        </html>
      `;
      
      printWindow.document.write(printContent);
      printWindow.document.close();
    };
    
    const exportDispatches = async () => {
      try {
        loading.value = true;
        
        const exportData = filteredDispatchHistory.value.map(dispatch => ({
          'رقم العملية': dispatch.id || '',
          'التاريخ': formatDate(dispatch.timestamp),
          'الوقت': formatTime(dispatch.timestamp),
          'اسم الصنف': dispatch.item_name || '',
          'كود الصنف': dispatch.item_code || '',
          'الكمية': Math.abs(dispatch.total_delta || 0),
          'من مخزن': getWarehouseLabel(dispatch.from_warehouse),
          'إلى': getDestinationLabel(dispatch.destination || dispatch.to_warehouse),
          'القيمة': calculateDispatchValue(dispatch),
          'تم بواسطة': dispatch.user_name || dispatch.created_by || 'مستخدم النظام',
          'ملاحظات': dispatch.notes || ''
        }));
        
        if (exportData.length === 0) {
          store.dispatch('showNotification', {
            type: 'warning',
            message: 'لا توجد بيانات للتصدير'
          });
          return;
        }
        
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);
        
        const wscols = [
          { wch: 15 },
          { wch: 12 },
          { wch: 10 },
          { wch: 25 },
          { wch: 15 },
          { wch: 10 },
          { wch: 20 },
          { wch: 20 },
          { wch: 15 },
          { wch: 15 },
          { wch: 30 }
        ];
        ws['!cols'] = wscols;
        
        XLSX.utils.book_append_sheet(wb, ws, 'عمليات الصرف');
        
        const filename = `عمليات_الصرف_${new Date().toISOString().split('T')[0]}.xlsx`;
        
        XLSX.writeFile(wb, filename);
        
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم تصدير ${exportData.length} عملية صرف بنجاح`
        });
        
      } catch (error) {
        console.error('Error exporting dispatches:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تصدير البيانات'
        });
      } finally {
        loading.value = false;
      }
    };
    
    // Setup real-time updates for dispatch transactions
    const setupRealtimeUpdates = () => {
      try {
        const transactionsRef = collection(db, 'transactions');
        const q = query(
          transactionsRef,
          where('type', '==', 'DISPATCH'),
          orderBy('timestamp', 'desc'),
          limit(100)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const transactions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          // Store will handle updating the transactions array
          // The computed dispatchTransactions will automatically update
          
          // Show notification for new dispatches
          if (transactions.length > 0 && dispatchTransactions.value.length > 0) {
            const latestTransaction = transactions[0];
            const isNew = !dispatchTransactions.value.find(t => t.id === latestTransaction.id);
            
            if (isNew && !showDispatchModal.value) {
              store.dispatch('showNotification', {
                type: 'info',
                message: `صرف جديد: ${latestTransaction.item_name} - ${Math.abs(latestTransaction.total_delta)} وحدة`,
                duration: 5000
              });
            }
          }
        });

        realtimeUnsubscribe.value = unsubscribe;
      } catch (error) {
        console.error('Error setting up real-time dispatch updates:', error);
      }
    };
    
    // Load initial data
    const loadInitialData = async () => {
      loading.value = true;
      try {
        console.log('Dispatch page: Loading initial data...');
        
        // Check view permissions
        if (!canViewDispatches.value) {
          store.dispatch('showNotification', {
            type: 'error',
            message: 'يجب تسجيل الدخول لعرض صفحة الصرف'
          });
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }
        
        // Wait for store to load data
        if (!store.state.warehousesLoaded || store.state.warehouses.length === 0) {
          await store.dispatch('loadWarehouses');
        }
        
        if (store.state.transactions.length === 0) {
          await store.dispatch('fetchTransactions');
        }
        
        // Auto-select warehouse if only one available
        if (dispatchFromWarehouses.value.length === 1) {
          selectedWarehouse.value = dispatchFromWarehouses.value[0].id;
        }
        
        // Setup real-time updates
        setupRealtimeUpdates();
        
      } catch (error) {
        console.error('Error loading dispatch data:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تحميل بيانات الصرف'
        });
      } finally {
        loading.value = false;
      }
    };
    
    onMounted(() => {
      console.log('Dispatch page mounted');
      
      // Load initial data
      loadInitialData();
    });
    
    onUnmounted(() => {
      // Cleanup
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }
      if (realtimeUnsubscribe.value) {
        realtimeUnsubscribe.value();
      }
    });
    
    // Watch for store data updates
    watch(() => [allInventory.value, allTransactions.value], () => {
      // Data updates are handled by real-time listener
    }, { deep: true });
    
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
      dispatchFromWarehouses,
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
      
      formatNumber,
      formatCurrency,
      formatDate,
      formatTime,
      getWarehouseLabel,
      getDestinationLabel,
      getDispatchQuantityClass,
      getQuantityClass,
      getDateFilterLabel,
      selectItemForDispatch,
      updateAvailableItems,
      handleModalClose,
      handleDispatchSuccess,
      handleSearch,
      applyHistoryFilters,
      clearHistoryFilters,
      nextPage,
      prevPage,
      viewDispatchDetails,
      printDispatch,
      exportDispatches,
      calculateDispatchValue
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Cairo', sans-serif;
}

.space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Loading animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Fix for RTL direction */
[dir="rtl"] {
  text-align: right;
}

/* Ensure proper spacing for RTL */
.ml-2 {
  margin-left: 0.5rem;
}

.ml-4 {
  margin-left: 1rem;
}

.ml-3 {
  margin-left: 0.75rem;
}

.mr-auto {
  margin-right: auto;
}

/* Enhanced hover effects */
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Mobile Optimizations */
@media (max-width: 640px) {
  .text-base {
    font-size: 0.875rem;
  }
  
  .text-lg {
    font-size: 1rem;
  }
  
  .text-xl {
    font-size: 1.25rem;
  }
  
  .text-2xl {
    font-size: 1.5rem;
  }
  
  .min-h-\[44px\] {
    min-height: 44px;
  }
  
  .min-h-\[36px\] {
    min-height: 36px;
  }
  
  .p-3 {
    padding: 0.75rem;
  }
  
  .p-4 {
    padding: 1rem;
  }
}

/* Tablet Optimizations */
@media (min-width: 641px) and (max-width: 768px) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .xl\:grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Desktop Optimizations */
@media (min-width: 1024px) {
  /* Static table header with scrollable body */
  .overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
  }
  
  /* Ensure table cells have consistent heights */
  .grid > div {
    min-height: 56px;
  }
}

/* Dark mode improvements */
.dark .text-gray-900 {
  color: #f9fafb;
}

.dark .text-gray-700 {
  color: #d1d5db;
}

.dark .text-gray-500 {
  color: #9ca3af;
}

.dark .border-gray-700 {
  border-color: #4b5563;
}

.dark .bg-gray-800 {
  background-color: #1f2937;
}

.dark .bg-gray-900 {
  background-color: #111827;
}

/* Disabled state improvements */
.disabled\:opacity-50:disabled {
  opacity: 0.5;
}

.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}

/* Focus styles for accessibility */
button:focus, select:focus, input:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Touch target improvements for mobile */
@media (max-width: 768px) {
  button, 
  a, 
  select, 
  input[type="button"], 
  input[type="submit"] {
    min-height: 44px;
  }
  
  .space-y-3 > * + * {
    margin-top: 0.75rem;
  }
}

/* Performance optimizations */
.hover\:bg-gray-50, .hover\:bg-gray-800 {
  will-change: background-color;
}

.animate-spin {
  will-change: transform;
}

/* Text truncation for table cells */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Ensure modal backdrop has proper z-index */
.fixed.inset-0 {
  z-index: 9999;
}

/* Responsive table grid columns */
.grid-cols-12 > .col-span-1 {
  grid-column: span 1 / span 1;
}
.grid-cols-12 > .col-span-2 {
  grid-column: span 2 / span 2;
}
.grid-cols-12 > .col-span-3 {
  grid-column: span 3 / span 3;
}

/* English numbers style */
.english-numbers {
  font-feature-settings: "lnum";
  font-variant-numeric: lining-nums;
}

/* Sticky table headers */
.sticky {
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Improved hover states for interactive elements */
.hover\:border-blue-300:hover {
  border-color: #93c5fd;
}

.dark .hover\:border-blue-500:hover {
  border-color: #3b82f6;
}
</style>
