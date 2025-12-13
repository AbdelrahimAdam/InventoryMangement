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
            <!-- Warehouse Filter for Available Items -->
            <select
              v-model="selectedWarehouse"
              @change="updateAvailableItems"
              class="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 min-h-[44px]"
              :disabled="loading || !dispatchFromWarehouses.length"
            >
              <option value="">اختر المخزن المصدر</option>
              <option v-for="warehouse in dispatchFromWarehouses" :key="warehouse.id" :value="warehouse.id">
                {{ warehouse.name_ar }}
              </option>
            </select>
            
            <button 
              v-if="canDispatch"
              @click="showDispatchModal = true"
              :disabled="!selectedWarehouse || loading || availableItems.length === 0"
              class="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span class="hidden sm:inline">إنشاء صرف جديد</span>
              <span class="inline sm:hidden">صرف جديد</span>
            </button>
          </div>
        </div>

        <!-- Available Items in Selected Warehouse -->
        <div v-if="selectedWarehouse && availableItems.length > 0" class="mt-4">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            الأصناف المتاحة في {{ getWarehouseLabel(selectedWarehouse) }}
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
            <div 
              v-for="item in availableItems.slice(0, 8)" 
              :key="item.id"
              class="p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 cursor-pointer border border-gray-200 dark:border-gray-600"
              @click="selectItemForDispatch(item)"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ item.name }}</p>
                  <div class="flex items-center flex-wrap gap-1 sm:gap-2 mt-1">
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ item.code }}</span>
                    <span class="text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 whitespace-nowrap">
                      {{ item.remaining_quantity }} متبقي
                    </span>
                  </div>
                </div>
                <svg class="w-4 h-4 text-gray-400 flex-shrink-0 mr-1 sm:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div v-if="availableItems.length > 8" class="text-center mt-3">
            <p class="text-xs text-gray-500 dark:text-gray-400">
              +{{ availableItems.length - 8 }} صنف إضافي
            </p>
          </div>
        </div>
        
        <div v-else-if="selectedWarehouse && !loading" class="text-center py-6">
          <div class="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-full mb-3">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
            </svg>
          </div>
          <p class="text-gray-500 dark:text-gray-400 text-sm">لا توجد أصناف في هذا المخزن</p>
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
            
            <div class="flex flex-wrap gap-2">
              <!-- Warehouse Filter -->
              <select
                v-model="historyWarehouseFilter"
                @change="applyHistoryFilters"
                class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm min-h-[36px]"
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
                class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm min-h-[36px]"
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
                  class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm min-h-[36px] min-w-[120px]"
                >
                <span class="text-gray-500 dark:text-gray-400 text-sm">إلى</span>
                <input 
                  type="date" 
                  v-model="customDateTo"
                  class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm min-h-[36px] min-w-[120px]"
                >
                <button 
                  @click="applyHistoryFilters"
                  class="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm min-h-[36px]"
                >
                  تطبيق
                </button>
              </div>
              
              <!-- Export Button -->
              <button 
                v-if="canExport"
                @click="exportDispatches"
                :disabled="filteredDispatchHistory.length === 0"
                class="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[36px]"
              >
                <span class="hidden sm:inline">تصدير Excel</span>
                <span class="inline sm:hidden">تصدير</span>
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
            v-if="canDispatch"
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
            <div class="w-full overflow-x-auto">
              <div class="min-w-full inline-block align-middle">
                <!-- Table Header - Fixed -->
                <div class="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <div class="grid grid-cols-12 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div class="col-span-2 p-3 text-right">التاريخ والوقت</div>
                    <div class="col-span-2 p-3 text-right">الصنف</div>
                    <div class="col-span-2 p-3 text-right">من مخزن</div>
                    <div class="col-span-1 p-3 text-right">إلى</div>
                    <div class="col-span-1 p-3 text-right">الكمية</div>
                    <div class="col-span-1 p-3 text-right">القيمة</div>
                    <div class="col-span-1 p-3 text-right">بواسطة</div>
                    <div class="col-span-2 p-3 text-right">الإجراءات</div>
                  </div>
                </div>

                <!-- Table Body - Scrollable -->
                <div class="max-h-[calc(100vh-400px)] overflow-y-auto">
                  <div class="divide-y divide-gray-200 dark:divide-gray-700">
                    <div 
                      v-for="dispatch in paginatedHistory" 
                      :key="dispatch.id" 
                      class="grid grid-cols-12 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
                    >
                      <!-- Date & Time -->
                      <div class="col-span-2 p-3">
                        <div class="text-sm text-gray-900 dark:text-white">{{ formatDate(dispatch.timestamp) }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(dispatch.timestamp) }}</div>
                      </div>
                      
                      <!-- Item -->
                      <div class="col-span-2 p-3">
                        <div class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ dispatch.item_name }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ dispatch.item_code }}</div>
                      </div>
                      
                      <!-- From Warehouse -->
                      <div class="col-span-2 p-3 text-sm text-gray-900 dark:text-white truncate">
                        {{ getWarehouseLabel(dispatch.from_warehouse) }}
                      </div>
                      
                      <!-- Destination -->
                      <div class="col-span-1 p-3 text-sm text-gray-900 dark:text-white truncate">
                        {{ getDestinationLabel(dispatch.to_warehouse) }}
                      </div>
                      
                      <!-- Quantity -->
                      <div class="col-span-1 p-3">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap" 
                              :class="getDispatchQuantityClass(dispatch.total_delta)">
                          {{ formatNumber(Math.abs(dispatch.total_delta)) }}
                        </span>
                      </div>
                      
                      <!-- Value -->
                      <div class="col-span-1 p-3 text-sm font-medium text-gray-900 dark:text-white truncate">
                        {{ formatCurrency(calculateDispatchValue(dispatch)) }}
                      </div>
                      
                      <!-- User -->
                      <div class="col-span-1 p-3 text-sm text-gray-500 dark:text-gray-400 truncate">
                        {{ getUsername(dispatch.user_id) }}
                      </div>
                      
                      <!-- Actions -->
                      <div class="col-span-2 p-3">
                        <div class="flex items-center space-x-2 space-x-reverse">
                          <button 
                            @click="viewDispatchDetails(dispatch)"
                            class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="عرض التفاصيل"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                          </button>
                          <button 
                            @click="printDispatch(dispatch)"
                            class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
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
            </div>
          </div>

          <!-- Mobile Cards View -->
          <div class="lg:hidden">
            <div class="max-h-[calc(100vh-400px)] overflow-y-auto p-2 sm:p-4">
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
                      <div class="font-medium text-gray-900 dark:text-white">{{ getDestinationLabel(dispatch.to_warehouse) }}</div>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">القيمة</div>
                      <div class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(calculateDispatchValue(dispatch)) }}</div>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">بواسطة</div>
                      <div class="font-medium text-gray-900 dark:text-white">{{ getUsername(dispatch.user_id) }}</div>
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
                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center"
                      >
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        تفاصيل
                      </button>
                      <button 
                        @click="printDispatch(dispatch)"
                        class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-sm flex items-center"
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
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 flex flex-col items-center">
        <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-700 dark:text-gray-300 text-sm">جاري تحميل البيانات...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import * as XLSX from 'xlsx';
import DispatchModal from '@/components/inventory/DispatchModal.vue';

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
    const historyWarehouseFilter = ref('');
    const dateFilter = ref('all');
    const customDateFrom = ref('');
    const customDateTo = ref('');
    const currentHistoryPage = ref(1);
    const itemsPerPage = ref(10);
    
    // Computed properties from store
    const userRole = computed(() => store.getters.userRole);
    const userName = computed(() => store.getters.userName);
    const userProfile = computed(() => store.state.userProfile);
    const allInventory = computed(() => store.state.inventory || []);
    const allTransactions = computed(() => store.state.transactions || []);
    const allWarehouses = computed(() => store.state.warehouses || []);
    
    // Store getters
    const canDispatch = computed(() => store.getters.canDispatch);
    const canExport = computed(() => userRole.value === 'superadmin' || userRole.value === 'company_manager');
    const dispatchFromWarehouses = computed(() => store.getters.dispatchFromWarehouses || []);
    const dispatchDestinations = computed(() => store.getters.dispatchDestinations || []);
    
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
    
    // Available items in selected warehouse
    const availableItems = computed(() => {
      if (!selectedWarehouse.value) return [];
      
      return allInventory.value.filter(item => 
        item.warehouse_id === selectedWarehouse.value && 
        item.remaining_quantity > 0
      ).sort((a, b) => b.remaining_quantity - a.remaining_quantity); // Sort by quantity descending
    });
    
    // Filter dispatch history
    const filteredDispatchHistory = computed(() => {
      let filtered = [...dispatchTransactions.value];
      
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
      return historyWarehouseFilter.value || dateFilter.value !== 'all';
    });
    
    // Helper functions
    const formatNumber = (num) => {
      if (num === undefined || num === null) return '0';
      return new Intl.NumberFormat('ar-EG').format(num);
    };
    
    const formatCurrency = (amount) => {
      if (amount === undefined || amount === null) return '0 ج.م';
      return new Intl.NumberFormat('ar-EG', {
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
    
    const getUsername = (userId) => {
      if (!userId) return 'مستخدم النظام';
      return 'مستخدم النظام'; // This should be enhanced with user lookup from store
    };
    
    const calculateDispatchValue = (dispatch) => {
      const quantity = Math.abs(dispatch.total_delta || 0);
      const pricePerItem = 50;
      return quantity * pricePerItem;
    };
    
    const getDispatchQuantityClass = (quantity) => {
      const qty = Math.abs(quantity || 0);
      if (qty < 10) return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300';
      if (qty < 50) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300';
      return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300';
    };
    
    // Actions
    const selectItemForDispatch = (item) => {
      selectedItemForDispatch.value = item;
      showDispatchModal.value = true;
    };
    
    const updateAvailableItems = () => {
      selectedItemForDispatch.value = null;
    };
    
    const handleModalClose = () => {
      showDispatchModal.value = false;
    };
    
    const handleDispatchSuccess = () => {
      showDispatchModal.value = false;
      selectedItemForDispatch.value = null;
      
      // Refresh data by resetting to first page
      currentHistoryPage.value = 1;
    };
    
    const applyHistoryFilters = () => {
      currentHistoryPage.value = 1;
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
      alert(`تفاصيل الصرف:\n\nالصنف: ${dispatch.item_name}\nالكمية: ${Math.abs(dispatch.total_delta)}\nمن: ${getWarehouseLabel(dispatch.from_warehouse)}\nإلى: ${getDestinationLabel(dispatch.to_warehouse)}\nالتاريخ: ${formatDateTime(dispatch.timestamp)}`);
    };
    
    const printDispatch = (dispatch) => {
      const printWindow = window.open('', '_blank');
      const printContent = `
        <html dir="rtl">
        <head>
          <title>طباعة صرف ${dispatch.item_name}</title>
          <style>
            body { font-family: 'Cairo', sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .details { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .details th, .details td { padding: 10px; border: 1px solid #ddd; text-align: right; }
            .details th { background-color: #f5f5f5; font-weight: bold; }
            .signature { margin-top: 50px; text-align: left; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">سند صرف</div>
            <div>نظام إدارة المخزون</div>
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
              <td>${dispatch.item_code}</td>
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
              <td>${getDestinationLabel(dispatch.to_warehouse)}</td>
            </tr>
            <tr>
              <th>تاريخ الصرف</th>
              <td>${formatDateTime(dispatch.timestamp)}</td>
            </tr>
            <tr>
              <th>القيمة</th>
              <td>${formatCurrency(calculateDispatchValue(dispatch))}</td>
            </tr>
            <tr>
              <th>تم بواسطة</th>
              <td>${getUsername(dispatch.user_id)}</td>
            </tr>
          </table>
          
          <div class="signature">
            <p>التوقيع: _______________</p>
            <p>الختم: _______________</p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 1000);
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
          'إلى': getDestinationLabel(dispatch.to_warehouse),
          'القيمة': calculateDispatchValue(dispatch),
          'تم بواسطة': getUsername(dispatch.user_id),
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
    
    // Load initial data
    const loadInitialData = async () => {
      loading.value = true;
      try {
        console.log('Dispatch page: Loading initial data...');
        
        // Wait for store to load data
        if (allInventory.value.length === 0 || allTransactions.value.length === 0) {
          console.log('Waiting for store data to load...');
          
          // The store's listeners will handle data loading
          // We'll just wait a moment for initial load
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Auto-select warehouse if only one available
        if (dispatchFromWarehouses.value.length === 1) {
          selectedWarehouse.value = dispatchFromWarehouses.value[0].id;
        }
        
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
      
      // Check permissions
      if (!canDispatch.value) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية للوصول إلى صفحة الصرف'
        });
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
        return;
      }
      
      // Load initial data
      loadInitialData();
    });
    
    // Watch for store data updates
    watch(() => [allInventory.value, allTransactions.value], () => {
      console.log('Store data updated, refreshing dispatch view');
    }, { deep: true });
    
    return {
      loading,
      showDispatchModal,
      selectedWarehouse,
      selectedItemForDispatch,
      historyWarehouseFilter,
      dateFilter,
      customDateFrom,
      customDateTo,
      currentHistoryPage,
      userRole,
      userName,
      canDispatch,
      canExport,
      dispatchFromWarehouses,
      dispatchDestinations,
      availableItems,
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
      selectItemForDispatch,
      updateAvailableItems,
      handleModalClose,
      handleDispatchSuccess,
      applyHistoryFilters,
      nextPage,
      prevPage,
      viewDispatchDetails,
      printDispatch,
      exportDispatches,
      calculateDispatchValue,
      getUsername
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
  .max-h-\[calc\(100vh-400px\)\] {
    max-height: calc(100vh - 400px);
  }
  
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
</style>
