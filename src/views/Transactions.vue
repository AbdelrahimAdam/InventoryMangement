<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <main class="max-w-full mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">📊 سجل حركات المخزون</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">تتبع كامل لتاريخ جميع الحركات في نظام المخزون</p>
        </div>
        <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
          <!-- Live Update Toggle -->
          <button 
            @click="toggleLiveUpdates"
            :class="[
              'inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200',
              liveUpdatesEnabled 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/40' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
          >
            <div :class="['w-2 h-2 rounded-full ml-1 sm:mr-2', liveUpdatesEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400']"></div>
            <span class="hidden sm:inline">{{ liveUpdatesEnabled ? 'تحديث مباشر مفعل' : 'تفعيل التحديث المباشر' }}</span>
            <span class="sm:hidden">{{ liveUpdatesEnabled ? 'مباشر' : 'يدوي' }}</span>
          </button>

          <!-- Refresh Button -->
          <button 
            @click="manualRefresh"
            :disabled="loading"
            class="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors duration-200 disabled:opacity-50"
          >
            <svg :class="['w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:mr-2', loading ? 'animate-spin' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span class="hidden sm:inline">تحديث</span>
          </button>

          <!-- Export Button -->
          <button 
            v-if="canExport"
            @click="exportTransactions"
            class="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span class="hidden sm:inline">تصدير Excel</span>
            <span class="sm:hidden">تصدير</span>
          </button>
        </div>
      </div>

      <!-- Stats Cards - Updated for Mobile -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <!-- Total Transactions Card -->
        <div class="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center ml-2 sm:ml-3 shadow-md">
              <svg class="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">إجمالي الحركات</p>
              <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white english-numbers">{{ formatNumber(transactionStats.total) }}</p>
            </div>
          </div>
          <div class="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <svg v-if="statsLoading" class="w-3 h-3 animate-spin ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {{ liveStats.updated ? 'بيانات مباشرة' : 'بيانات مخزنة' }}
          </div>
        </div>

        <!-- Add Transactions Card -->
        <div class="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center ml-2 sm:ml-3 shadow-md">
              <svg class="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">الإضافات اليوم</p>
              <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white english-numbers">{{ formatNumber(transactionStats.add) }}</p>
            </div>
          </div>
          <div class="mt-1 text-xs text-green-600 dark:text-green-400 english-numbers">
            +{{ transactionStats.add }} اليوم
          </div>
        </div>

        <!-- Transfer Transactions Card -->
        <div class="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center ml-2 sm:ml-3 shadow-md">
              <svg class="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">التحويلات اليوم</p>
              <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white english-numbers">{{ formatNumber(transactionStats.transfer) }}</p>
            </div>
          </div>
          <div class="mt-1 text-xs text-purple-600 dark:text-purple-400 english-numbers">
            +{{ transactionStats.transfer }} اليوم
          </div>
        </div>

        <!-- Dispatch Transactions Card -->
        <div class="bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-red-900/10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center ml-2 sm:ml-3 shadow-md">
              <svg class="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">الصرفيات اليوم</p>
              <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white english-numbers">{{ formatNumber(transactionStats.dispatch) }}</p>
            </div>
          </div>
          <div class="mt-1 text-xs text-red-600 dark:text-red-400 english-numbers">
            +{{ transactionStats.dispatch }} اليوم
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
          <!-- Search Box -->
          <div class="lg:w-1/4">
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
                class="w-full px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 text-sm sm:text-base"
              >
              <svg class="absolute right-3 top-2.5 sm:right-4 sm:top-3.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Warehouse Filter -->
          <div class="lg:w-1/4">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <span class="inline-flex items-center">
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                تصفية بالمخزن
              </span>
            </label>
            <select 
              v-model="warehouseFilter"
              @change="handleWarehouseFilter"
              class="w-full px-4 py-2 sm:py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            >
              <option value="">جميع المخازن</option>
              <option 
                v-for="warehouse in accessibleWarehouses" 
                :key="warehouse.id" 
                :value="warehouse.id"
              >
                {{ warehouse.name_ar || warehouse.name }}
              </option>
            </select>
          </div>

          <!-- Date Range Filters -->
          <div class="lg:w-1/4">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <span class="inline-flex items-center">
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                نطاق التاريخ
              </span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div class="relative">
                <input 
                  type="date" 
                  v-model="dateFrom"
                  class="w-full px-4 py-2 sm:py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                <label class="absolute -top-2 right-2 px-1 text-xs bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">من</label>
              </div>
              <div class="relative">
                <input 
                  type="date" 
                  v-model="dateTo"
                  class="w-full px-4 py-2 sm:py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                <label class="absolute -top-2 right-2 px-1 text-xs bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">إلى</label>
              </div>
            </div>
          </div>

          <!-- Type Filter -->
          <div class="lg:w-1/4">
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
              class="w-full px-4 py-2 sm:py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
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
        <div v-if="hasActiveFilters" class="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">الفلاتر النشطة:</span>

            <span v-if="searchTerm" class="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
              بحث: "{{ searchTerm }}"
              <button @click="searchTerm = ''" class="mr-1 hover:text-blue-900">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>
            </span>

            <span v-if="warehouseFilter" class="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
              مخزن: {{ getWarehouseName(warehouseFilter) }}
              <button @click="warehouseFilter = ''" class="mr-1 hover:text-indigo-900">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>
            </span>

            <span v-if="typeFilter" class="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
              نوع: {{ getTypeLabel(typeFilter) }}
              <button @click="typeFilter = ''" class="mr-1 hover:text-purple-900">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>
            </span>

            <span v-if="dateFrom || dateTo" class="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
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
              class="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
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
        <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">سجل الحركات</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">عرض وتتبع جميع عمليات المخزون</p>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs px-2 py-1 sm:px-3 sm:py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full font-medium english-numbers">
                {{ formatNumber(filteredTransactions.length) }} حركة
              </span>
              <div class="text-sm text-gray-500 dark:text-gray-400 english-numbers">
                تم التصفية: {{ filterPercentage }}%
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="transactionsLoading" class="p-6 sm:p-8 text-center">
          <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
          <p class="text-gray-700 dark:text-gray-300 font-medium">جاري تحميل البيانات...</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">الرجاء الانتظار</p>
        </div>

        <!-- Error State -->
        <div v-else-if="transactionsError" class="p-6 sm:p-8 text-center">
          <div class="text-red-500 dark:text-red-400 mb-4">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p class="text-gray-700 dark:text-gray-300 font-medium mb-2">حدث خطأ في تحميل البيانات</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ transactionsError }}</p>
          <button 
            @click="manualRefresh"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            إعادة المحاولة
          </button>
        </div>

        <!-- Transactions Table -->
        <div v-else class="overflow-x-auto">
          <!-- Desktop View -->
          <div class="hidden lg:block">
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
                    <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {{ formatRelativeTime(transaction.timestamp) }}
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
                    <span :class="getQuantityClass(transaction.type)" class="english-numbers">
                      {{ formatNumber(transaction.total_delta || transaction.total_quantity || 0) }}
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
                      {{ transaction.created_by || transaction.user_name || 'مستخدم غير معروف' }}
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

          <!-- Mobile & Tablet View -->
          <div class="lg:hidden">
            <div v-if="displayedTransactions.length === 0" class="p-6 text-center">
              <div class="text-gray-400 dark:text-gray-500 mb-4">
                <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <p class="text-gray-600 dark:text-gray-400 font-medium">لا توجد حركات</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">لم يتم العثور على أي حركات مطابقة للفلاتر</p>
            </div>

            <div v-else class="space-y-3 p-4">
              <div 
                v-for="(transaction, index) in displayedTransactions" 
                :key="transaction.id || index"
                class="bg-gray-50 dark:bg-gray-750 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <!-- Header Row -->
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <span :class="getTypeBadgeClass(transaction.type)">
                      {{ getTypeLabel(transaction.type) }}
                    </span>
                  </div>
                  <div class="text-left">
                    <span :class="getQuantityClass(transaction.type)" class="text-lg font-bold english-numbers">
                      {{ formatNumber(transaction.total_delta || transaction.total_quantity || 0) }}
                    </span>
                  </div>
                </div>

                <!-- Date & Time -->
                <div class="mb-3">
                  <div class="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span>{{ formatTransactionDate(transaction) }}</span>
                  </div>
                  <div class="flex items-center text-sm text-gray-500 dark:text-gray-500">
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>{{ formatTransactionTime(transaction) }}</span>
                    <span class="mr-2 text-xs text-gray-400">•</span>
                    <span class="text-xs">{{ formatRelativeTime(transaction.timestamp) }}</span>
                  </div>
                </div>

                <!-- Product Info -->
                <div class="mb-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div class="font-medium text-gray-900 dark:text-white mb-1">
                    {{ transaction.item_name || 'غير محدد' }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    كود: {{ transaction.item_code || 'لا يوجد' }}
                  </div>
                </div>

                <!-- Warehouse Info -->
                <div class="mb-3">
                  <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">المخزن:</div>
                  <div v-if="transaction.type === 'TRANSFER'" class="space-y-2">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 text-red-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                      </svg>
                      <span class="text-sm">{{ getWarehouseName(transaction.from_warehouse || transaction.from_warehouse_id) }}</span>
                    </div>
                    <div class="flex items-center">
                      <svg class="w-4 h-4 text-green-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                      </svg>
                      <span class="text-sm">{{ getWarehouseName(transaction.to_warehouse || transaction.to_warehouse_id) }}</span>
                    </div>
                  </div>
                  <div v-else-if="transaction.type === 'DISPATCH'" class="flex items-center">
                    <svg class="w-4 h-4 text-gray-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                    </svg>
                    <span class="text-sm">{{ getWarehouseName(transaction.from_warehouse || transaction.from_warehouse_id) }}</span>
                  </div>
                  <div v-else class="flex items-center">
                    <svg class="w-4 h-4 text-green-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                    </svg>
                    <span class="text-sm">{{ getWarehouseName(transaction.to_warehouse || transaction.to_warehouse_id) }}</span>
                  </div>
                </div>

                <!-- User Info -->
                <div class="mb-3 flex items-center">
                  <div class="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ml-2">
                    <svg class="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ transaction.created_by || transaction.user_name || 'مستخدم غير معروف' }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ getUserRoleLabel(transaction.user_role) }}
                    </div>
                  </div>
                </div>

                <!-- Notes -->
                <div v-if="transaction.notes">
                  <button 
                    @click="showNotes(transaction)"
                    class="w-full text-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                  >
                    عرض الملاحظات
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Notes Modal -->
    <div v-if="selectedNotes" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">الملاحظات</h3>
          <button @click="selectedNotes = null" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="px-6 py-4 overflow-y-auto max-h-[60vh]">
          <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ selectedNotes }}</p>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            @click="selectedNotes = null"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';
import * as XLSX from 'xlsx';
import { collection, query, orderBy, limit, onSnapshot, getDocs, where } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { debounce } from 'lodash';

export default {
  name: 'Transactions',
  setup() {
    const store = useStore();
    
    // Refs for local component state
    const searchTerm = ref('');
    const dateFrom = ref('');
    const dateTo = ref('');
    const typeFilter = ref('');
    const warehouseFilter = ref('');
    const liveUpdatesEnabled = ref(true);
    const statsLoading = ref(false);
    const selectedNotes = ref(null);
    const filterTimeout = ref(null);
    const dataCache = ref(null);
    const lastFetchTime = ref(0);
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
    const transactionsRef = ref(null);
    
    // Use Vuex state and getters
    const userRole = computed(() => store.getters.userRole);
    const canExport = computed(() => {
      return userRole.value === 'superadmin' || userRole.value === 'company_manager';
    });
    
    // Use store data
    const allTransactions = computed(() => store.state.transactions || []);
    const transactionsLoading = computed(() => store.state.transactionsLoading);
    const transactionStats = computed(() => store.state.transactionStats || {
      total: 0,
      add: 0,
      transfer: 0,
      dispatch: 0,
      update: 0,
      delete: 0
    });
    
    const accessibleWarehouses = computed(() => store.getters.accessibleWarehouses);
    
    // Calculate live stats from store
    const liveStats = computed(() => {
      return {
        add: transactionStats.value.add,
        transfer: transactionStats.value.transfer,
        dispatch: transactionStats.value.dispatch,
        updated: true
      };
    });

    // Use store's filteredTransactions getter
    const filteredTransactions = computed(() => {
      return store.getters.filteredTransactions({
        search: searchTerm.value,
        type: typeFilter.value,
        dateFrom: dateFrom.value,
        dateTo: dateTo.value
      });
    });
    
    // Display only the most recent transactions
    const displayedTransactions = computed(() => {
      // Apply warehouse filter if selected
      let transactions = filteredTransactions.value;
      
      if (warehouseFilter.value) {
        transactions = transactions.filter(transaction => {
          const fromWarehouse = transaction.from_warehouse || transaction.from_warehouse_id;
          const toWarehouse = transaction.to_warehouse || transaction.to_warehouse_id;
          
          return fromWarehouse === warehouseFilter.value || toWarehouse === warehouseFilter.value;
        });
      }
      
      return transactions.slice(0, 100);
    });
    
    const totalTransactions = computed(() => allTransactions.value.length);
    
    const hasActiveFilters = computed(() => {
      return searchTerm.value || typeFilter.value || warehouseFilter.value || dateFrom.value || dateTo.value;
    });
    
    const filterPercentage = computed(() => {
      if (allTransactions.value.length === 0) return 0;
      const percentage = Math.round((displayedTransactions.value.length / allTransactions.value.length) * 100);
      return 100 - percentage;
    });

    // Helper function to get transaction time
    const getTransactionTime = (transaction) => {
      if (!transaction.timestamp) return new Date(0);
      try {
        if (transaction.timestamp?.toDate) {
          return transaction.timestamp.toDate();
        }
        return new Date(transaction.timestamp);
      } catch {
        return new Date(0);
      }
    };

    // Arabic months for custom date formatting
    const arabicMonths = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];

    const arabicDays = [
      'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'
    ];

    // Methods
    const formatNumber = (num) => {
      if (num === undefined || num === null) return '0';
      return new Intl.NumberFormat('en-US').format(num);
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
        'ADD': 'inline-flex px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
        'TRANSFER': 'inline-flex px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
        'DISPATCH': 'inline-flex px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
        'UPDATE': 'inline-flex px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
        'DELETE': 'inline-flex px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
      };
      return classes[type] || 'inline-flex px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
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
    
    const getWarehouseName = (warehouseId) => {
      if (!warehouseId) return 'غير محدد';
      return store.getters.getWarehouseLabel(warehouseId);
    };
    
    // Date formatting functions
    const formatTransactionDate = (transaction) => {
      const date = getTransactionTime(transaction);
      const day = date.getDate();
      const month = arabicMonths[date.getMonth()];
      const dayOfWeek = arabicDays[date.getDay()];
      
      return `${day} ${month}، ${dayOfWeek}`;
    };
    
    const formatTransactionTime = (transaction) => {
      const date = getTransactionTime(transaction);
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'مساءً' : 'صباحاً';
      const displayHours = hours % 12 || 12;
      
      return `الساعة ${displayHours}:${minutes} ${ampm}`;
    };
    
    // Relative time formatting
    const formatRelativeTime = (timestamp) => {
      const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp || 0);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffMins < 1) {
        return 'الآن';
      } else if (diffMins < 60) {
        return `قبل ${diffMins} دقيقة`;
      } else if (diffHours < 24) {
        return `قبل ${diffHours} ساعة`;
      } else if (diffDays === 1) {
        return 'أمس';
      } else if (diffDays < 7) {
        return `قبل ${diffDays} يوم`;
      } else if (diffDays < 30) {
        return `قبل ${Math.floor(diffDays / 7)} أسبوع`;
      } else {
        return formatTransactionDate({ timestamp: date });
      }
    };
    
    const formatDateRange = (from, to) => {
      if (!from && !to) return '';
      const format = (dateStr) => {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = arabicMonths[date.getMonth()];
        return `${day} ${month}`;
      };
      
      if (from && to) {
        return `${format(from)} - ${format(to)}`;
      } else if (from) {
        return `من ${format(from)}`;
      } else {
        return `إلى ${format(to)}`;
      }
    };
    
    // Debounced search
    const handleSearch = debounce(() => {
      // Search is handled by computed property through store getter
    }, 300);
    
    const handleFilter = () => {
      // Filter is handled by computed property
    };
    
    const handleWarehouseFilter = () => {
      // Warehouse filter is handled by computed property
    };
    
    const clearFilters = () => {
      searchTerm.value = '';
      typeFilter.value = '';
      warehouseFilter.value = '';
      dateFrom.value = '';
      dateTo.value = '';
    };
    
    const showNotes = (transaction) => {
      selectedNotes.value = transaction.notes;
    };

    // Check cache first
    const loadFromCache = () => {
      try {
        const cached = localStorage.getItem('transactions_cache');
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const now = Date.now();
          if (now - timestamp < CACHE_DURATION) {
            dataCache.value = data;
            lastFetchTime.value = timestamp;
            store.commit('SET_TRANSACTIONS', data);
            return true;
          }
        }
      } catch (error) {
        console.error('Error loading from cache:', error);
      }
      return false;
    };

    // Save to cache
    const saveToCache = (data) => {
      try {
        const cacheData = {
          data,
          timestamp: Date.now()
        };
        localStorage.setItem('transactions_cache', JSON.stringify(cacheData));
        dataCache.value = data;
        lastFetchTime.value = cacheData.timestamp;
      } catch (error) {
        console.error('Error saving to cache:', error);
      }
    };

    // Smart data loading with cache checking
    const loadTransactionsFromFirestore = async () => {
      try {
        // Check cache first
        if (loadFromCache()) {
          console.log('✅ Loaded transactions from cache');
          return;
        }

        console.log('📡 Fetching transactions from Firestore...');
        statsLoading.value = true;
        store.commit('SET_TRANSACTIONS_LOADING', true);
        
        // Get transactions from Firestore
        const transactionsQuery = query(
          collection(db, 'transactions'),
          orderBy('timestamp', 'desc'),
          limit(100)
        );
        
        const snapshot = await getDocs(transactionsQuery);
        console.log(`📊 Found ${snapshot.size} transactions`);
        
        const transactions = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data
          };
        });
        
        // Save to Vuex store
        store.commit('SET_TRANSACTIONS', transactions);
        
        // Save to cache
        saveToCache(transactions);
        
        console.log('✅ Successfully loaded all transactions');
        
      } catch (error) {
        console.error('❌ Error loading transactions:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ أثناء تحميل الحركات'
        });
      } finally {
        statsLoading.value = false;
        store.commit('SET_TRANSACTIONS_LOADING', false);
      }
    };

    // Manual refresh
    const manualRefresh = async () => {
      statsLoading.value = true;
      try {
        // Clear cache and force refresh
        localStorage.removeItem('transactions_cache');
        await loadTransactionsFromFirestore();
        
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

    // Toggle live updates
    const toggleLiveUpdates = () => {
      liveUpdatesEnabled.value = !liveUpdatesEnabled.value;
      
      if (liveUpdatesEnabled.value) {
        setupRealtimeTransactions();
        store.dispatch('showNotification', {
          type: 'info',
          message: 'تم تفعيل التحديث المباشر'
        });
      } else {
        if (transactionsRef.value) {
          transactionsRef.value();
          transactionsRef.value = null;
        }
        store.dispatch('showNotification', {
          type: 'info',
          message: 'تم إيقاف التحديث المباشر'
        });
      }
    };

    // Export transactions to Excel
    const exportTransactions = () => {
      try {
        store.commit('SET_TRANSACTIONS_LOADING', true);
        
        const wb = XLSX.utils.book_new();
        
        const exportData = displayedTransactions.value.slice(0, 1000).map(transaction => {
          const fromWarehouseId = transaction.from_warehouse || transaction.from_warehouse_id;
          const toWarehouseId = transaction.to_warehouse || transaction.to_warehouse_id;
          
          return {
            'التاريخ': formatTransactionDate(transaction),
            'الوقت': formatTransactionTime(transaction),
            'نوع الحركة': getTypeLabel(transaction.type),
            'اسم المنتج': transaction.item_name || '',
            'كود المنتج': transaction.item_code || '',
            'الكمية': transaction.total_delta || transaction.total_quantity || 0,
            'من مستودع': getWarehouseName(fromWarehouseId),
            'إلى مستودع': getWarehouseName(toWarehouseId),
            'المستخدم': transaction.created_by || transaction.user_name || '',
            'ملاحظات': transaction.notes || '',
            'صلاحية المستخدم': getUserRoleLabel(transaction.user_role)
          };
        });
        
        const ws = XLSX.utils.json_to_sheet(exportData);
        
        // Add auto-filter
        const range = XLSX.utils.decode_range(ws['!ref']);
        ws['!autofilter'] = { ref: XLSX.utils.encode_range(range) };
        
        XLSX.utils.book_append_sheet(wb, ws, 'الحركات');
        
        const filename = `حركات_المخزون_${new Date().toISOString().split('T')[0]}.xlsx`;
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

    // Setup real-time transactions listener
    const setupRealtimeTransactions = () => {
      if (!liveUpdatesEnabled.value) return;

      try {
        const q = query(
          collection(db, 'transactions'),
          orderBy('timestamp', 'desc'),
          limit(50)
        );

        transactionsRef.value = onSnapshot(q, (snapshot) => {
          const transactions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          // Merge with existing data, avoiding duplicates
          const existingIds = new Set(allTransactions.value.map(t => t.id));
          const newTransactions = transactions.filter(t => !existingIds.has(t.id));
          
          if (newTransactions.length > 0) {
            // Update Vuex store with new transactions
            const updatedTransactions = [...newTransactions, ...allTransactions.value]
              .sort((a, b) => {
                const dateA = getTransactionTime(a);
                const dateB = getTransactionTime(b);
                return dateB - dateA;
              })
              .slice(0, 500);
            
            store.commit('SET_TRANSACTIONS', updatedTransactions);
            
            // Update cache
            saveToCache(updatedTransactions);
            
            // Show notification for new transactions
            const latestTransaction = newTransactions[0];
            store.dispatch('showNotification', {
              type: 'info',
              message: `حركة جديدة: ${getTypeLabel(latestTransaction.type)} - ${latestTransaction.item_name}`,
              duration: 3000
            });
          }
        });

      } catch (error) {
        console.error('Error setting up real-time transactions:', error);
      }
    };

    // Initial data load
    const loadInitialData = async () => {
      try {
        statsLoading.value = true;
        
        // Load warehouses if not already loaded
        if (!store.state.warehousesLoaded) {
          await store.dispatch('loadWarehouses');
        }
        
        // Load transactions with smart caching
        await loadTransactionsFromFirestore();
        
        // Enable real-time updates by default
        setupRealtimeTransactions();
        
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

    // Watch for warehouse changes
    watch(warehouseFilter, (newWarehouse) => {
      // This filter is handled in displayedTransactions computed property
    });
    
    onMounted(() => {
      loadInitialData();
    });
    
    onUnmounted(() => {
      // Cleanup
      if (filterTimeout.value) {
        clearTimeout(filterTimeout.value);
      }
      if (transactionsRef.value) {
        transactionsRef.value();
      }
    });
    
    return {
      // State
      searchTerm,
      dateFrom,
      dateTo,
      typeFilter,
      warehouseFilter,
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
      transactionsLoading,
      transactionStats,
      accessibleWarehouses,
      
      // Methods
      formatNumber,
      getTypeLabel,
      getTypeBadgeClass,
      getQuantityClass,
      getUserRoleLabel,
      getWarehouseName,
      formatTransactionDate,
      formatTransactionTime,
      formatRelativeTime,
      formatDateRange,
      handleSearch,
      handleFilter,
      handleWarehouseFilter,
      clearFilters,
      manualRefresh,
      toggleLiveUpdates,
      exportTransactions,
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

/* English numbers styling */
.english-numbers {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  font-feature-settings: "lnum";
  font-variant-numeric: lining-nums;
  direction: ltr;
  display: inline-block;
}

/* Force English numbers in inputs and selects */
input, select {
  font-feature-settings: "lnum";
  font-variant-numeric: lining-nums;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
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

/* Force LTR for numbers in quantity cells */
.quantity-cell {
  direction: ltr;
  text-align: right;
  font-family: 'Courier New', monospace;
}

/* Responsive adjustments for mobile cards */
@media (max-width: 640px) {
  /* Make cards compact on mobile */
  .grid-cols-2 > div {
    min-height: 100px;
  }
  
  .p-3 {
    padding: 0.75rem;
  }
  
  .h-10 {
    height: 2.5rem;
  }
  
  .w-10 {
    width: 2.5rem;
  }
  
  .ml-2 {
    margin-left: 0.5rem;
  }
  
  .text-lg {
    font-size: 1.125rem;
  }
  
  .mobile-stack {
    flex-direction: column !important;
  }
  
  .mobile-full {
    width: 100% !important;
  }
  
  /* Adjust grid for mobile */
  .grid-cols-12 {
    grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
  }
  
  .col-span-1, .col-span-2, .col-span-3, .col-span-4, .col-span-6 {
    grid-column: span 1 !important;
  }
  
  /* Better spacing on mobile */
  .p-4 {
    padding: 1rem;
  }
  
  .px-6 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  /* Smaller text on mobile */
  .text-xl {
    font-size: 1.25rem;
  }
}

@media (max-width: 768px) and (min-width: 641px) {
  /* Tablet adjustments */
  .grid-cols-12 {
    grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
  }
  
  .col-span-2 {
    grid-column: span 3 !important;
  }
  
  .col-span-1 {
    grid-column: span 1 !important;
  }
}

/* Dark mode adjustments */
.dark .hover\:bg-gray-750:hover {
  background-color: rgba(55, 65, 81, 0.5);
}

/* Ensure numbers in stats cards are English */
.text-xl.font-bold {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

/* Mobile card shadow */
@media (max-width: 640px) {
  .shadow-xl {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
}

/* Touch-friendly buttons on mobile */
@media (max-width: 640px) {
  button {
    min-height: 40px;
  }
  
  .py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
}

/* Prevent horizontal overflow on mobile */
@media (max-width: 640px) {
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }
}

/* Better modal for mobile */
@media (max-width: 640px) {
  .fixed.inset-0 {
    padding: 0.5rem;
  }
  
  .max-w-md {
    width: 95%;
  }
}

/* Improved spacing for filter badges on mobile */
@media (max-width: 640px) {
  .gap-2 {
    gap: 0.5rem;
  }
}

/* Optimize table display on small screens */
@media (max-width: 1024px) {
  .hidden-lg\:block {
    display: block !important;
  }
  
  .lg\:hidden {
    display: none !important;
  }
}

/* Mobile card specific improvements */
@media (max-width: 640px) {
  /* Compact card content */
  .card-content {
    padding: 0.5rem;
  }
  
  /* Smaller icons on mobile */
  .card-icon {
    width: 2rem;
    height: 2rem;
  }
  
  /* Better text hierarchy */
  .card-title {
    font-size: 0.75rem;
    line-height: 1;
  }
  
  .card-value {
    font-size: 1.125rem;
    line-height: 1.2;
  }
  
  /* Reduce spacing between cards */
  .card-grid-mobile {
    gap: 0.5rem;
  }
}

/* Enhanced mobile responsiveness */
@media (max-width: 640px) {
  /* Stack filters vertically on mobile */
  .lg\:flex-row {
    flex-direction: column;
  }
  
  .lg\:w-1\/4 {
    width: 100%;
  }
  
  /* Improve filter dropdowns on mobile */
  select {
    font-size: 0.875rem;
  }
  
  /* Better date input on mobile */
  input[type="date"] {
    font-size: 0.875rem;
  }
}

/* Performance optimizations */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Optimize animations */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>