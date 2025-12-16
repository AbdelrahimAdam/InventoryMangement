<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <main class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">📊 سجل حركات المخزون</h1>
          <p class="text-gray-600 dark:text-gray-400">تتبع كامل لتاريخ جميع الحركات في نظام المخزون</p>
        </div>
        <div class="flex items-center gap-3 flex-wrap">
          <!-- Live Update Toggle -->
          <button 
            @click="toggleLiveUpdates"
            :class="[
              'inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
              liveUpdatesEnabled 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/40' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
          >
            <div :class="['w-2 h-2 rounded-full mr-2', liveUpdatesEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400']"></div>
            {{ liveUpdatesEnabled ? 'تحديث مباشر مفعل' : 'تفعيل التحديث المباشر' }}
          </button>
          
          <!-- Refresh Button -->
          <button 
            @click="manualRefresh"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors duration-200 disabled:opacity-50"
          >
            <svg :class="['w-4 h-4 mr-2', loading ? 'animate-spin' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            تحديث
          </button>
          
          <!-- Export Button -->
          <button 
            v-if="canExport"
            @click="exportTransactions"
            class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            تصدير Excel
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- Total Transactions Card -->
        <div class="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center ml-3 shadow-md">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">إجمالي الحركات</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ formatNumber(transactionStats.total) }}</p>
            </div>
          </div>
          <div class="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <svg v-if="statsLoading" class="w-3 h-3 animate-spin mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {{ liveStats.updated ? 'بيانات مباشرة' : 'بيانات مخزنة' }}
          </div>
        </div>

        <!-- Add Transactions Card -->
        <div class="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center ml-3 shadow-md">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">الإضافات اليوم</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ formatNumber(transactionStats.add) }}</p>
            </div>
          </div>
          <div class="mt-1 text-xs text-green-600 dark:text-green-400">
            +{{ transactionStats.add }} اليوم
          </div>
        </div>

        <!-- Transfer Transactions Card -->
        <div class="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center ml-3 shadow-md">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">التحويلات اليوم</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ formatNumber(transactionStats.transfer) }}</p>
            </div>
          </div>
          <div class="mt-1 text-xs text-purple-600 dark:text-purple-400">
            +{{ transactionStats.transfer }} اليوم
          </div>
        </div>

        <!-- Dispatch Transactions Card -->
        <div class="bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-red-900/10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center ml-3 shadow-md">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">الصرفيات اليوم</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ formatNumber(transactionStats.dispatch) }}</p>
            </div>
          </div>
          <div class="mt-1 text-xs text-red-600 dark:text-red-400">
            +{{ transactionStats.dispatch }} اليوم
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <!-- Search Box -->
          <div class="lg:w-1/3">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <span class="inline-flex items-center">
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                بحث متقدم
              </span>
            </label>
            <div class="relative">
              <input
                type="text"
                v-model="searchTerm"
                @input="handleSearch"
                placeholder="ابحث باسم المنتج، الكود، الملاحظات..."
                class="w-full px-4 py-3 pr-12 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
              >
              <svg class="absolute right-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Date Range Filters -->
          <div class="lg:w-1/3">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <span class="inline-flex items-center">
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                نطاق التاريخ
              </span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="relative">
                <input 
                  type="date" 
                  v-model="dateFrom"
                  class="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                <label class="absolute -top-2 right-2 px-1 text-xs bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">من</label>
              </div>
              <div class="relative">
                <input 
                  type="date" 
                  v-model="dateTo"
                  class="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                <label class="absolute -top-2 right-2 px-1 text-xs bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">إلى</label>
              </div>
            </div>
          </div>

          <!-- Type Filter -->
          <div class="lg:w-1/3">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <span class="inline-flex items-center">
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                نوع الحركة
              </span>
            </label>
            <select 
              v-model="typeFilter"
              @change="handleFilter"
              class="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع الأنواع</option>
              <option value="ADD">إضافة</option>
              <option value="TRANSFER">تحويل</option>
              <option value="DISPATCH">صرف</option>
              <option value="UPDATE">تحديث</option>
              <option value="DELETE">حذف</option>
            </select>
          </div>
        </div>

        <!-- Active Filters Badges -->
        <div v-if="hasActiveFilters" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">الفلاتر النشطة:</span>
            
            <span v-if="searchTerm" class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
              بحث: "{{ searchTerm }}"
              <button @click="searchTerm = ''" class="mr-1 hover:text-blue-900">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>
            </span>
            
            <span v-if="typeFilter" class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
              نوع: {{ getTypeLabel(typeFilter) }}
              <button @click="typeFilter = ''" class="mr-1 hover:text-purple-900">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>
            </span>
            
            <span v-if="dateFrom || dateTo" class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
              تاريخ: {{ formatDateRange(dateFrom, dateTo) }}
              <button @click="dateFrom = ''; dateTo = ''" class="mr-1 hover:text-yellow-900">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>
            </span>
            
            <button 
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              إعادة تعيين
            </button>
          </div>
        </div>
      </div>

      <!-- Transaction Table Container -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Table Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">سجل الحركات</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">عرض وتتبع جميع عمليات المخزون</p>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full font-medium">
                {{ formatNumber(filteredTransactions.length) }} حركة
              </span>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                تم التصفية: {{ filterPercentage }}%
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-700 dark:text-gray-300 font-medium">جاري تحميل البيانات...</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">الرجاء الانتظار</p>
        </div>

        <!-- Transactions Table -->
        <div v-else class="overflow-x-auto">
          <!-- Fixed Table Headers -->
          <div class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div class="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <div class="col-span-2">التاريخ والوقت</div>
              <div class="col-span-2">نوع الحركة</div>
              <div class="col-span-2">المنتج</div>
              <div class="col-span-1">الكمية</div>
              <div class="col-span-2">من/إلى مستودع</div>
              <div class="col-span-2">المستخدم</div>
              <div class="col-span-1">الملاحظات</div>
            </div>
          </div>
          
          <!-- Scrollable Table Body -->
          <div class="max-h-[500px] overflow-y-auto">
            <div v-if="displayedTransactions.length === 0" class="p-8 text-center">
              <div class="text-gray-400 dark:text-gray-500 mb-4">
                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <p class="text-gray-600 dark:text-gray-400 font-medium">لا توجد حركات</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">لم يتم العثور على أي حركات مطابقة للفلاتر</p>
            </div>
            
            <div v-else>
              <div 
                v-for="(transaction, index) in displayedTransactions" 
                :key="transaction.id || index"
                class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
              >
                <!-- Date & Time -->
                <div class="col-span-2">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatTransactionDate(transaction) }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatTransactionTime(transaction) }}
                  </div>
                </div>
                
                <!-- Transaction Type -->
                <div class="col-span-2">
                  <span :class="getTypeBadgeClass(transaction.type)">
                    {{ getTypeLabel(transaction.type) }}
                  </span>
                </div>
                
                <!-- Product -->
                <div class="col-span-2">
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ transaction.item_name || 'غير محدد' }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ transaction.item_code || 'لا يوجد كود' }}
                  </div>
                </div>
                
                <!-- Quantity -->
                <div class="col-span-1">
                  <span :class="getQuantityClass(transaction.type)">
                    {{ formatNumber(transaction.total_quantity || transaction.total_delta || 0) }}
                  </span>
                </div>
                
                <!-- Warehouses -->
                <div class="col-span-2">
                  <div v-if="transaction.type === 'TRANSFER'" class="space-y-1">
                    <div class="text-xs text-gray-500 dark:text-gray-400">من:</div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ getWarehouseName(transaction.from_warehouse || transaction.from_warehouse_id) }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">إلى:</div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ getWarehouseName(transaction.to_warehouse || transaction.to_warehouse_id) }}
                    </div>
                  </div>
                  <div v-else-if="transaction.type === 'DISPATCH'">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ getWarehouseName(transaction.from_warehouse || transaction.from_warehouse_id) }}
                    </div>
                  </div>
                  <div v-else>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ getWarehouseName(transaction.to_warehouse || transaction.to_warehouse_id) }}
                    </div>
                  </div>
                </div>
                
                <!-- User -->
                <div class="col-span-2">
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ transaction.user_name || 'مستخدم غير معروف' }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ getUserRoleLabel(transaction.user_role) }}
                  </div>
                </div>
                
                <!-- Notes -->
                <div class="col-span-1">
                  <div v-if="transaction.notes" class="relative group">
                    <button 
                      @click="showNotes(transaction)"
                      class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      عرض
                    </button>
                  </div>
                  <span v-else class="text-xs text-gray-400">-</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Notes Modal -->
    <div v-if="selectedNotes" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">الملاحظات</h3>
          <button @click="selectedNotes = null" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="px-6 py-4">
          <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ selectedNotes }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import * as XLSX from 'xlsx';

export default {
  name: 'Transactions',
  setup() {
    const store = useStore();
    
    // Refs for local component state
    const searchTerm = ref('');
    const dateFrom = ref('');
    const dateTo = ref('');
    const typeFilter = ref('');
    const liveUpdatesEnabled = ref(true);
    const statsLoading = ref(false);
    const selectedNotes = ref(null);

    // 🔥 Use store getters for warehouse labels and stats
    const userRole = computed(() => store.getters.userRole);
    const canExport = computed(() => {
      return userRole.value === 'superadmin' || userRole.value === 'company_manager';
    });
    
    // 🔥 Use store data
    const allTransactions = computed(() => store.state.transactions || []);
    const loading = computed(() => store.state.transactionsLoading);
    
    // 🔥 Use the new store getter for warehouse label
    const getWarehouseName = (warehouseId) => {
      if (!warehouseId) return 'غير محدد';
      return store.getters.getWarehouseLabel(warehouseId);
    };
    
    // 🔥 Use the new store getter for transaction stats
    const transactionStats = computed(() => {
      return store.getters.getTransactionStats;
    });

    // 🔥 Calculate live stats from store
    const liveStats = computed(() => {
      const stats = transactionStats.value;
      return {
        add: stats.add,
        transfer: stats.transfer,
        dispatch: stats.dispatch,
        updated: true
      };
    });

    // 🔥 Filtered transactions computed property
    const filteredTransactions = computed(() => {
      let filtered = [...allTransactions.value];
      
      // Apply search filter
      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase();
        filtered = filtered.filter(transaction => 
          (transaction.item_name?.toLowerCase() || '').includes(term) ||
          (transaction.item_code?.toLowerCase() || '').includes(term) ||
          (transaction.notes?.toLowerCase() || '').includes(term) ||
          (transaction.user_name?.toLowerCase() || '').includes(term)
        );
      }
      
      // Apply type filter
      if (typeFilter.value) {
        filtered = filtered.filter(transaction => transaction.type === typeFilter.value);
      }
      
      // Apply date range filter
      if (dateFrom.value) {
        const fromDate = new Date(dateFrom.value);
        filtered = filtered.filter(transaction => {
          const transDate = getTransactionTime(transaction);
          return transDate >= fromDate;
        });
      }
      
      if (dateTo.value) {
        const toDate = new Date(dateTo.value);
        toDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(transaction => {
          const transDate = getTransactionTime(transaction);
          return transDate <= toDate;
        });
      }
      
      return filtered;
    });
    
    // Display only the most recent transactions
    const displayedTransactions = computed(() => {
      return filteredTransactions.value.slice(0, 100);
    });
    
    const totalTransactions = computed(() => allTransactions.value.length);
    
    const hasActiveFilters = computed(() => {
      return searchTerm.value || typeFilter.value || dateFrom.value || dateTo.value;
    });
    
    const filterPercentage = computed(() => {
      if (allTransactions.value.length === 0) return 0;
      const percentage = Math.round((filteredTransactions.value.length / allTransactions.value.length) * 100);
      return 100 - percentage;
    });

    // Helper function to get transaction time (handles Firebase timestamps)
    const getTransactionTime = (transaction) => {
      if (!transaction.timestamp) return new Date(0);
      try {
        // Handle Firebase Timestamp
        if (transaction.timestamp?.toDate) {
          return transaction.timestamp.toDate();
        }
        // Handle regular date string
        return new Date(transaction.timestamp);
      } catch {
        return new Date(0);
      }
    };

    // Methods
    const formatNumber = (num) => {
      if (num === undefined || num === null) return '0';
      return new Intl.NumberFormat('ar-SA').format(num);
    };
    
    const getTypeLabel = (type) => {
      const labels = {
        'ADD': 'إضافة',
        'TRANSFER': 'تحويل',
        'DISPATCH': 'صرف',
        'UPDATE': 'تحديث',
        'DELETE': 'حذف'
      };
      return labels[type] || type;
    };
    
    const getTypeBadgeClass = (type) => {
      const classes = {
        'ADD': 'inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
        'TRANSFER': 'inline-flex px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
        'DISPATCH': 'inline-flex px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
        'UPDATE': 'inline-flex px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
        'DELETE': 'inline-flex px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
      };
      return classes[type] || 'inline-flex px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    };
    
    const getQuantityClass = (type) => {
      const classes = {
        'ADD': 'text-green-600 dark:text-green-400 font-medium',
        'TRANSFER': 'text-purple-600 dark:text-purple-400 font-medium',
        'DISPATCH': 'text-red-600 dark:text-red-400 font-medium'
      };
      return classes[type] || 'text-gray-700 dark:text-gray-300 font-medium';
    };
    
    const getUserRoleLabel = (role) => {
      const labels = {
        'superadmin': 'مدير عام',
        'company_manager': 'مدير شركة',
        'warehouse_manager': 'مدير مستودع',
        'staff': 'موظف'
      };
      return labels[role] || role || 'غير معروف';
    };
    
    const formatTransactionDate = (transaction) => {
      const date = getTransactionTime(transaction);
      return date.toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' });
    };
    
    const formatTransactionTime = (transaction) => {
      const date = getTransactionTime(transaction);
      return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    };
    
    const formatDateRange = (from, to) => {
      if (!from && !to) return '';
      const format = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' });
      };
      
      if (from && to) {
        return `${format(from)} - ${format(to)}`;
      } else if (from) {
        return `من ${format(from)}`;
      } else {
        return `إلى ${format(to)}`;
      }
    };
    
    const handleSearch = () => {
      // Search is handled by computed property
    };
    
    const handleFilter = () => {
      // Filter is handled by computed property
    };
    
    const clearFilters = () => {
      searchTerm.value = '';
      typeFilter.value = '';
      dateFrom.value = '';
      dateTo.value = '';
    };
    
    const showNotes = (transaction) => {
      selectedNotes.value = transaction.notes;
    };

    // 🔥 Manual refresh using store actions
    const manualRefresh = async () => {
      statsLoading.value = true;
      try {
        // Use store actions to refresh data
        await store.dispatch('fetchTransactions');
        
        // Show notification through store
        store.dispatch('showNotification', {
          type: 'success',
          message: 'تم تحديث البيانات بنجاح'
        });
        
      } catch (error) {
        console.error('Error refreshing data:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ أثناء تحديث البيانات'
        });
      } finally {
        statsLoading.value = false;
      }
    };

    // 🔥 Toggle live updates
    const toggleLiveUpdates = () => {
      liveUpdatesEnabled.value = !liveUpdatesEnabled.value;
      
      // Update store real-time mode
      store.commit('SET_REALTIME_MODE', liveUpdatesEnabled.value);
      
      store.dispatch('showNotification', {
        type: 'info',
        message: liveUpdatesEnabled.value ? 'تم تفعيل التحديث المباشر' : 'تم إيقاف التحديث المباشر'
      });
    };

    // 🔥 Export transactions to Excel
    const exportTransactions = () => {
      try {
        // Set loading state through store
        store.commit('SET_TRANSACTIONS_LOADING', true);
        
        // Create workbook
        const wb = XLSX.utils.book_new();
        
        // Prepare data for export using store data
        const exportData = filteredTransactions.value.slice(0, 1000).map(transaction => {
          const fromWarehouseId = transaction.from_warehouse || transaction.from_warehouse_id;
          const toWarehouseId = transaction.to_warehouse || transaction.to_warehouse_id;
          
          return {
            'التاريخ': transaction.timestamp ? 
              getTransactionTime(transaction).toLocaleDateString('ar-SA') : '',
            'الوقت': transaction.timestamp ? 
              getTransactionTime(transaction).toLocaleTimeString('ar-SA') : '',
            'نوع الحركة': getTypeLabel(transaction.type),
            'اسم المنتج': transaction.item_name || '',
            'كود المنتج': transaction.item_code || '',
            'الكمية': transaction.total_quantity || transaction.total_delta || 0,
            'من مستودع': getWarehouseName(fromWarehouseId),
            'إلى مستودع': getWarehouseName(toWarehouseId),
            'المستخدم': transaction.user_name || '',
            'ملاحظات': transaction.notes || '',
            'صلاحية المستخدم': getUserRoleLabel(transaction.user_role)
          };
        });
        
        // Convert to worksheet
        const ws = XLSX.utils.json_to_sheet(exportData);
        
        // Add to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'الحركات');
        
        // Generate filename
        const filename = `حركات_المخزون_${new Date().toISOString().split('T')[0]}.xlsx`;
        
        // Save file
        XLSX.writeFile(wb, filename);
        
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم تصدير ${exportData.length} حركة إلى ملف Excel بنجاح`
        });
        
      } catch (error) {
        console.error('Error exporting transactions:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ أثناء تصدير الحركات'
        });
      } finally {
        store.commit('SET_TRANSACTIONS_LOADING', false);
      }
    };

    // 🔥 Initial data load using store actions
    const loadInitialData = async () => {
      try {
        statsLoading.value = true;
        
        // Use store actions to load data
        await store.dispatch('fetchTransactions');
        
        // Load warehouses if not already loaded
        if (!store.state.warehousesLoaded) {
          await store.dispatch('loadWarehouses');
        }
        
        // Enable real-time updates if configured
        if (store.state.realtimeMode) {
          liveUpdatesEnabled.value = true;
        }
        
      } catch (error) {
        console.error('Error loading initial data:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ أثناء تحميل البيانات'
        });
      } finally {
        statsLoading.value = false;
      }
    };
    
    onMounted(() => {
      loadInitialData();
    });
    
    onUnmounted(() => {
      // Cleanup if needed
    });
    
    return {
      // State
      searchTerm,
      dateFrom,
      dateTo,
      typeFilter,
      liveUpdatesEnabled,
      liveStats,
      statsLoading,
      selectedNotes,
      
      // Computed
      displayedTransactions,
      filteredTransactions,
      totalTransactions,
      canExport,
      hasActiveFilters,
      filterPercentage,
      loading,
      transactionStats,
      
      // Methods
      formatNumber,
      getTypeLabel,
      getTypeBadgeClass,
      getQuantityClass,
      getUserRoleLabel,
      formatTransactionDate,
      formatTransactionTime,
      formatDateRange,
      handleSearch,
      handleFilter,
      clearFilters,
      manualRefresh,
      toggleLiveUpdates,
      exportTransactions,
      getWarehouseName,
      getTransactionTime,
      showNotes
    };
  }
};
</script>

<style scoped>
/* RTL Support */
body, .text-right {
  text-align: right;
  direction: rtl;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 8px;
  border: 2px solid #f1f1f1;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-color: #374151;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
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

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Card hover effects */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Fixed header styling */
.sticky {
  position: -webkit-sticky;
  position: sticky;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .mobile-stack {
    flex-direction: column !important;
  }
  
  .mobile-full {
    width: 100% !important;
  }
  
  .grid-cols-12 {
    grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
  }
  
  .col-span-1, .col-span-2, .col-span-3, .col-span-4, .col-span-6 {
    grid-column: span 3 !important;
  }
}
</style>
