<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center h-auto sm:h-16 py-3 sm:py-0">
          <!-- Navigation -->
          <div class="flex items-center space-x-4 space-x-reverse mb-3 sm:mb-0">
            <router-link to="/" class="flex items-center space-x-2 space-x-reverse hover:opacity-80 transition-opacity">
              <div class="h-10 w-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span class="text-white font-bold text-lg">م</span>
              </div>
              <div>
                <h1 class="text-xl font-bold text-gray-900 dark:text-white">لوحة التقارير والإحصائيات</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">نظام إدارة المخزون الذكي</p>
              </div>
            </router-link>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap items-center gap-3 space-x-reverse">
            <div class="relative">
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <select 
                v-model="reportPeriod"
                @change="changePeriod"
                class="w-full sm:w-48 pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm"
              >
                <option value="today">اليوم</option>
                <option value="week">هذا الأسبوع</option>
                <option value="month" selected>هذا الشهر</option>
                <option value="quarter">هذا الربع</option>
                <option value="year">هذه السنة</option>
                <option value="custom">فترة مخصصة</option>
              </select>
            </div>
            
            <button 
              @click="exportReport"
              class="inline-flex items-center justify-center w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:-translate-y-0.5"
            >
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              تصدير التقرير
            </button>
            
            <button 
              @click="resetFilters"
              class="inline-flex items-center justify-center w-full sm:w-auto px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              إعادة الضبط
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Advanced Filters Section -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">فلاتر التقرير</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">قم بتخصيص التقرير حسب المخزن أو الصنف أو التاريخ</p>
          </div>
          
          <!-- Active Filters Badges -->
          <div class="flex flex-wrap gap-2 mt-4 md:mt-0">
            <span v-if="selectedWarehouse" class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
              {{ getWarehouseLabel(selectedWarehouse) }}
              <button @click="selectedWarehouse = ''" class="mr-1 hover:text-blue-900">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>
            </span>
            
            <span v-if="selectedItem" class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
              {{ selectedItemText }}
              <button @click="selectedItem = ''" class="mr-1 hover:text-purple-900">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>
            </span>
            
            <span v-if="selectedItemType" class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
              {{ getItemTypeLabel(selectedItemType) }}
              <button @click="selectedItemType = ''" class="mr-1 hover:text-yellow-900">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <!-- Warehouse Filter -->
          <div class="relative">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <span class="inline-flex items-center">
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                المخزن
              </span>
            </label>
            <select 
              v-model="selectedWarehouse"
              @change="applyFilters"
              class="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm transition-all duration-200"
            >
              <option value="">جميع المخازن</option>
              <option v-for="warehouse in accessibleWarehouses" :key="warehouse.id" :value="warehouse.id">
                {{ warehouse.name_ar }}
              </option>
            </select>
          </div>

          <!-- Item Filter -->
          <div class="relative">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <span class="inline-flex items-center">
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                الصنف
              </span>
            </label>
            <div class="relative">
              <select 
                v-model="selectedItem"
                @change="applyFilters"
                class="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm transition-all duration-200"
              >
                <option value="">جميع الأصناف</option>
                <optgroup v-if="selectedWarehouse" label="أصناف المخزن المحدد">
                  <option v-for="item in filteredItemsByWarehouse" :key="item.id" :value="item.id">
                    {{ item.name }} ({{ item.code }})
                  </option>
                </optgroup>
                <optgroup label="جميع الأصناف">
                  <option v-for="item in allUniqueItems" :key="item.id" :value="item.id">
                    {{ item.name }} ({{ item.code }})
                  </option>
                </optgroup>
              </select>
              <div class="absolute left-3 top-3">
                <svg v-if="selectedItem" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Item Type Filter -->
          <div class="relative">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <span class="inline-flex items-center">
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                نوع الصنف
              </span>
            </label>
            <select 
              v-model="selectedItemType"
              @change="applyFilters"
              class="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm transition-all duration-200"
            >
              <option value="">جميع الأنواع</option>
              <option value="low_stock">قليلة المخزون (&lt; 10)</option>
              <option value="out_of_stock">منتهية المخزون</option>
              <option value="high_value">عالية القيمة</option>
              <option value="recently_added">مضافة مؤخراً</option>
              <option value="fast_moving">سريعة الحركة</option>
              <option value="slow_moving">بطيئة الحركة</option>
            </select>
          </div>

          <!-- Search -->
          <div class="relative">
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
                v-model="searchQuery"
                @input="applyFilters"
                placeholder="ابحث عن صنف، كود، لون، مورد..."
                class="w-full px-4 py-3 pr-12 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm transition-all duration-200"
              />
              <svg class="absolute right-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Custom Date Range -->
        <div v-if="reportPeriod === 'custom'" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">تحديد الفترة المخصصة</h3>
            <div class="flex flex-col sm:flex-row gap-3">
              <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">من:</label>
                <input 
                  type="date" 
                  v-model="customDateFrom"
                  class="px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
              </div>
              <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">إلى:</label>
                <input 
                  type="date" 
                  v-model="customDateTo"
                  class="px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
              </div>
              <button 
                @click="applyCustomDate"
                class="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                تطبيق الفترة
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard Header with Active Filter Info -->
      <div v-if="hasActiveFilters" class="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 class="text-lg font-bold text-blue-900 dark:text-blue-300">
              <span v-if="selectedWarehouse && selectedItem">
                تقرير المخزن: {{ getWarehouseLabel(selectedWarehouse) }} - الصنف: {{ selectedItemText }}
              </span>
              <span v-else-if="selectedWarehouse">
                تقرير المخزن: {{ getWarehouseLabel(selectedWarehouse) }}
              </span>
              <span v-else-if="selectedItem">
                تقرير الصنف: {{ selectedItemText }}
              </span>
            </h3>
            <p class="text-sm text-blue-700 dark:text-blue-400 mt-1">
              عرض البيانات المفلترة حسب التحديدات الحالية
              <span v-if="filteredInventory.length > 0" class="font-bold">
                • {{ filteredInventory.length }} صنف
              </span>
            </p>
          </div>
          <div class="mt-3 md:mt-0">
            <button @click="resetFilters" class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
              <svg class="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              إلغاء التصفية
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Items -->
        <div class="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/10 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="h-14 w-14 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center ml-4 shadow-lg">
              <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">إجمالي الأصناف</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(summary.totalItems) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">{{ summary.uniqueItems }} صنف فريد</p>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-500 dark:text-gray-400">في المخزن المحدد</span>
              <span class="font-semibold text-blue-600 dark:text-blue-400">{{ filteredInventory.length }}</span>
            </div>
          </div>
        </div>

        <!-- Total Transactions -->
        <div class="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/10 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="h-14 w-14 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center ml-4 shadow-lg">
              <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">إجمالي الحركات</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(summary.totalTransactions) }}</p>
              <div class="flex items-center gap-2 mt-2">
                <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-lg">
                  +{{ summary.addTransactions }}
                </span>
                <span class="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-lg">
                  ↔{{ summary.transferTransactions }}
                </span>
                <span class="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg">
                  →{{ summary.dispatchTransactions }}
                </span>
              </div>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div class="text-xs text-gray-500 dark:text-gray-400">
              في الفترة: {{ getPeriodLabel() }}
            </div>
          </div>
        </div>

        <!-- Total Value -->
        <div class="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/10 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="h-14 w-14 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center ml-4 shadow-lg">
              <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">القيمة الإجمالية</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(summary.totalValue) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">{{ formatNumber(summary.totalQuantity) }} وحدة</p>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div class="text-xs">
              <span class="text-gray-500 dark:text-gray-400">متوسط السعر:</span>
              <span class="font-semibold text-purple-600 dark:text-purple-400 mr-1">
                {{ formatCurrency(summary.averagePrice) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Low Stock Items -->
        <div class="bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-red-900/10 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="h-14 w-14 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center ml-4 shadow-lg">
              <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">أصناف قليلة</p>
              <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ formatNumber(summary.lowStockItems) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">{{ summary.outOfStockItems }} منتهية</p>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-500 dark:text-gray-400">نسبة المخزون المنخفض</span>
              <span class="font-semibold text-red-600 dark:text-red-400">
                {{ summary.lowStockPercentage }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <!-- Warehouse Distribution Chart -->
        <div class="xl:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-3">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">توزيع المخزون حسب المخازن</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">توزيع الكمية والقيمة عبر المخازن المختلفة</p>
            </div>
            <select 
              v-model="distributionType"
              @change="updateWarehouseDistribution"
              class="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="quantity">حسب الكمية</option>
              <option value="value">حسب القيمة</option>
              <option value="items">حسب عدد الأصناف</option>
            </select>
          </div>
          
          <div class="h-72">
            <canvas ref="warehouseChart"></canvas>
          </div>
          
          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="warehouse in warehouseDistribution.slice(0, 4)" :key="warehouse.id" 
                 class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{{ warehouse.name }}</span>
                <span class="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {{ formatNumber(warehouse.value) }}
                  <span v-if="distributionType === 'value'">ج.م</span>
                  <span v-else-if="distributionType === 'quantity'">وحدة</span>
                </span>
              </div>
              <div class="relative h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div 
                  :style="{ width: warehouse.percentage + '%' }"
                  class="absolute h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                ></div>
              </div>
              <div class="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{{ warehouse.itemsCount }} صنف</span>
                <span>{{ warehouse.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Item Performance Gauge -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">أداء الصنف المحدد</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1" v-if="selectedItem">
              تحليل أداء {{ selectedItemText }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1" v-else>
              حدد صنفاً لعرض أدائه
            </p>
          </div>
          
          <div class="h-48 flex items-center justify-center">
            <div v-if="selectedItem" class="text-center">
              <div class="relative inline-block">
                <div class="h-32 w-32 rounded-full border-8"
                     :class="[
                       itemPerformance.score >= 80 ? 'border-green-500' :
                       itemPerformance.score >= 60 ? 'border-yellow-500' :
                       'border-red-500'
                     ]">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div>
                      <div class="text-3xl font-bold"
                           :class="[
                             itemPerformance.score >= 80 ? 'text-green-600 dark:text-green-400' :
                             itemPerformance.score >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                             'text-red-600 dark:text-red-400'
                           ]">
                        {{ itemPerformance.score }}%
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">معدل الأداء</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4 grid grid-cols-2 gap-3">
                <div class="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ itemPerformance.movementRate }}</div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">معدل الحركة</div>
                </div>
                <div class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div class="text-lg font-bold text-green-600 dark:text-green-400">{{ itemPerformance.stockDays }} يوم</div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">مخزون متبقي</div>
                </div>
              </div>
            </div>
            <div v-else class="text-center">
              <div class="h-32 w-32 mx-auto rounded-full border-8 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <p class="text-gray-500 dark:text-gray-400 mt-4">اختر صنفاً لعرض أدائه</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Data Tables -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <!-- Top Items by Value -->
        <div class="xl:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">أعلى الأصناف قيمة</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">الأصناف الأعلى قيمة في المخزون</p>
            </div>
            <select 
              v-model="topItemsFilter"
              @change="updateTopItems"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="value">حسب القيمة</option>
              <option value="quantity">حسب الكمية</option>
              <option value="turnover">حسب معدل الدوران</option>
            </select>
          </div>
          
          <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">الترتيب</th>
                  <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">الصنف</th>
                  <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">المخزن</th>
                  <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">الكمية</th>
                  <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">القيمة</th>
                  <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">الحالة</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(item, index) in topItemsByValue.slice(0, 8)" :key="item.id" 
                    class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                      {{ index + 1 }}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-semibold text-gray-900 dark:text-white">{{ item.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.code }} - {{ item.color }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ getWarehouseLabel(item.warehouse_id) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                          :class="[
                            item.remaining_quantity < 10 ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                            item.remaining_quantity < 50 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                            'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          ]">
                      {{ formatNumber(item.remaining_quantity) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-yellow-600 dark:text-yellow-400">
                    {{ formatCurrency(item.value) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                          :class="[
                            item.remaining_quantity === 0 ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                            item.remaining_quantity < 5 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                            'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          ]">
                      {{ item.remaining_quantity === 0 ? 'منتهي' : item.remaining_quantity < 5 ? 'حرج' : 'جيد' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">النشاط الأخير</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">آخر 10 حركات في النظام</p>
            </div>
            <span class="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
              {{ filteredTransactions.length }} حركة
            </span>
          </div>
          
          <div class="space-y-4">
            <div v-for="transaction in recentFilteredTransactions.slice(0, 10)" :key="transaction.id" 
                 class="flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200 hover:shadow-sm">
              <div :class="[
                'h-12 w-12 rounded-xl flex items-center justify-center shadow-sm',
                transaction.type === 'ADD' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300' :
                transaction.type === 'TRANSFER' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300' :
                'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300'
              ]">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="transaction.type === 'ADD'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  <path v-if="transaction.type === 'TRANSFER'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                  <path v-if="transaction.type === 'DISPATCH'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
              </div>
              <div class="mr-4 flex-1">
                <div class="flex items-center justify-between mb-1">
                  <h4 class="font-semibold text-gray-900 dark:text-white truncate">{{ transaction.item_name }}</h4>
                  <span class="text-sm font-bold" 
                        :class="transaction.type === 'ADD' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'">
                    {{ transaction.type === 'ADD' ? '+' : '' }}{{ formatNumber(transaction.total_delta) }}
                  </span>
                </div>
                <div class="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 gap-2">
                  <span v-if="transaction.from_warehouse" class="inline-flex items-center">
                    <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                    </svg>
                    {{ getWarehouseLabel(transaction.from_warehouse) }}
                  </span>
                  <span v-if="transaction.to_warehouse" class="inline-flex items-center">
                    <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                    {{ getWarehouseLabel(transaction.to_warehouse) }}
                  </span>
                  <span class="inline-flex items-center">
                    <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {{ formatTime(transaction.timestamp) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Trends Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-3">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">الاتجاهات الشهرية</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">تحليل أداء المخزون خلال آخر 6 أشهر</p>
          </div>
          <div class="flex items-center gap-3">
            <select 
              v-model="trendType"
              @change="updateMonthlyTrends"
              class="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="transactions">الحركات</option>
              <option value="quantity">الكميات</option>
              <option value="value">القيمة</option>
            </select>
            <button @click="exportTrendData" class="px-4 py-2.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200">
              تصدير البيانات
            </button>
          </div>
        </div>
        
        <div class="h-80">
          <canvas ref="trendsChart"></canvas>
        </div>
        
        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
            <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">متوسط الشهر الحالي</div>
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ formatNumber(monthlyStats.currentAverage) }}</div>
          </div>
          <div class="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl">
            <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">نسبة التغيير</div>
            <div class="text-2xl font-bold" 
                 :class="monthlyStats.changePercentage >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              {{ monthlyStats.changePercentage >= 0 ? '+' : '' }}{{ monthlyStats.changePercentage }}%
            </div>
          </div>
          <div class="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
            <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">إجمالي الفترة</div>
            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ formatNumber(monthlyStats.total) }}</div>
          </div>
        </div>
      </div>
    </main>

    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center shadow-2xl">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600 mb-4"></div>
        <p class="text-gray-700 dark:text-gray-300 font-medium">جاري تحميل التقارير...</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">الرجاء الانتظار</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

export default {
  name: 'Reports',
  setup() {
    const store = useStore();
    
    // Refs
    const loading = ref(false);
    const reportPeriod = ref('month');
    const distributionType = ref('quantity');
    const trendType = ref('transactions');
    const selectedWarehouse = ref('');
    const selectedItem = ref('');
    const selectedItemType = ref('');
    const searchQuery = ref('');
    const customDateFrom = ref('');
    const customDateTo = ref('');
    const topItemsFilter = ref('value');
    
    // Chart refs
    const warehouseChart = ref(null);
    const transactionsChart = ref(null);
    const trendsChart = ref(null);
    
    // Chart instances
    let warehouseChartInstance = null;
    let transactionsChartInstance = null;
    let trendsChartInstance = null;
    
    // Computed properties
    const accessibleWarehouses = computed(() => store.getters.accessibleWarehouses);
    const allInventory = computed(() => store.state.inventory || []);
    const allTransactions = computed(() => store.state.transactions || []);
    const recentTransactions = computed(() => store.state.recentTransactions || []);
    
    // All unique items for dropdown
    const allUniqueItems = computed(() => {
      const itemsMap = new Map();
      allInventory.value.forEach(item => {
        if (!itemsMap.has(item.id)) {
          itemsMap.set(item.id, {
            id: item.id,
            name: item.name,
            code: item.code,
            warehouse_id: item.warehouse_id
          });
        }
      });
      return Array.from(itemsMap.values());
    });
    
    // Items filtered by selected warehouse
    const filteredItemsByWarehouse = computed(() => {
      if (!selectedWarehouse.value) return [];
      return allUniqueItems.value.filter(item => item.warehouse_id === selectedWarehouse.value);
    });
    
    // Selected item text for display
    const selectedItemText = computed(() => {
      if (!selectedItem.value) return '';
      const item = allUniqueItems.value.find(i => i.id === selectedItem.value);
      return item ? `${item.name} (${item.code})` : '';
    });
    
    // Check if any filters are active
    const hasActiveFilters = computed(() => {
      return selectedWarehouse.value || selectedItem.value || selectedItemType.value || searchQuery.value;
    });
    
    // Filtered inventory based on selected filters
    const filteredInventory = computed(() => {
      let inventory = allInventory.value;
      
      // Filter by warehouse
      if (selectedWarehouse.value) {
        inventory = inventory.filter(item => item.warehouse_id === selectedWarehouse.value);
      }
      
      // Filter by specific item
      if (selectedItem.value) {
        inventory = inventory.filter(item => item.id === selectedItem.value);
      }
      
      // Filter by item type
      if (selectedItemType.value) {
        switch (selectedItemType.value) {
          case 'low_stock':
            inventory = inventory.filter(item => (item.remaining_quantity || 0) < 10 && (item.remaining_quantity || 0) > 0);
            break;
          case 'out_of_stock':
            inventory = inventory.filter(item => (item.remaining_quantity || 0) === 0);
            break;
          case 'high_value':
            inventory = inventory.filter(item => ((item.remaining_quantity || 0) * 50) > 1000);
            break;
          case 'recently_added':
            const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            inventory = inventory.filter(item => {
              const itemDate = new Date(item.created_at || item.updated_at || Date.now());
              return itemDate > oneWeekAgo;
            });
            break;
          case 'fast_moving':
            // Mock logic for fast moving items
            inventory = inventory.filter(item => (item.remaining_quantity || 0) < 20);
            break;
          case 'slow_moving':
            // Mock logic for slow moving items
            inventory = inventory.filter(item => (item.remaining_quantity || 0) > 100);
            break;
        }
      }
      
      // Filter by search query
      if (searchQuery.value) {
        const searchLower = searchQuery.value.toLowerCase();
        inventory = inventory.filter(item =>
          (item.name?.toLowerCase().includes(searchLower)) ||
          (item.code?.toLowerCase().includes(searchLower)) ||
          (item.color?.toLowerCase().includes(searchLower)) ||
          (item.supplier?.toLowerCase().includes(searchLower))
        );
      }
      
      return inventory;
    });
    
    // Filtered transactions with item filtering
    const filteredTransactions = computed(() => {
      let transactions = allTransactions.value;
      
      // Filter by warehouse if selected
      if (selectedWarehouse.value) {
        transactions = transactions.filter(t => 
          t.from_warehouse === selectedWarehouse.value || 
          t.to_warehouse === selectedWarehouse.value ||
          t.warehouse_id === selectedWarehouse.value
        );
      }
      
      // Filter by specific item if selected
      if (selectedItem.value) {
        const item = allInventory.value.find(i => i.id === selectedItem.value);
        if (item) {
          transactions = transactions.filter(t => 
            t.item_name === item.name || 
            t.item_code === item.code
          );
        }
      }
      
      // Filter by date period
      const now = new Date();
      let startDate;
      
      switch (reportPeriod.value) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        case 'custom':
          if (customDateFrom.value && customDateTo.value) {
            startDate = new Date(customDateFrom.value);
            const endDate = new Date(customDateTo.value);
            return transactions.filter(t => {
              const transDate = t.timestamp?.toDate ? t.timestamp.toDate() : new Date(t.timestamp);
              return transDate >= startDate && transDate <= endDate;
            });
          }
          break;
      }
      
      if (startDate) {
        return transactions.filter(t => {
          const transDate = t.timestamp?.toDate ? t.timestamp.toDate() : new Date(t.timestamp);
          return transDate >= startDate;
        });
      }
      
      return transactions;
    });
    
    // Recent filtered transactions
    const recentFilteredTransactions = computed(() => {
      return filteredTransactions.value
        .sort((a, b) => {
          const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
          const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
          return dateB - dateA;
        })
        .slice(0, 10);
    });
    
    // Summary statistics
    const summary = computed(() => {
      const inventory = filteredInventory.value;
      const transactions = filteredTransactions.value;
      
      // Calculate unique items
      const uniqueItemsMap = new Map();
      inventory.forEach(item => {
        const key = `${item.name}_${item.code}_${item.color}`;
        if (!uniqueItemsMap.has(key)) {
          uniqueItemsMap.set(key, item);
        }
      });
      
      // Calculate total value and quantity
      const totalQuantity = inventory.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0);
      const totalValue = inventory.reduce((sum, item) => {
        const quantity = item.remaining_quantity || 0;
        const price = item.price || 50; // Default price if not available
        return sum + (quantity * price);
      }, 0);
      
      // Calculate transactions by type
      const addTransactions = transactions.filter(t => t.type === 'ADD').length;
      const transferTransactions = transactions.filter(t => t.type === 'TRANSFER').length;
      const dispatchTransactions = transactions.filter(t => t.type === 'DISPATCH').length;
      
      // Calculate low stock items
      const lowStockItems = inventory.filter(item => (item.remaining_quantity || 0) < 10 && (item.remaining_quantity || 0) > 0).length;
      const outOfStockItems = inventory.filter(item => (item.remaining_quantity || 0) === 0).length;
      const lowStockPercentage = inventory.length > 0 ? Math.round((lowStockItems / inventory.length) * 100) : 0;
      const averagePrice = inventory.length > 0 ? totalValue / totalQuantity : 0;
      
      return {
        totalItems: inventory.length,
        uniqueItems: uniqueItemsMap.size,
        totalTransactions: transactions.length,
        addTransactions,
        transferTransactions,
        dispatchTransactions,
        totalValue,
        totalQuantity,
        lowStockItems,
        outOfStockItems,
        lowStockPercentage,
        averagePrice
      };
    });
    
    // Top items by value with filtering
    const topItemsByValue = computed(() => {
      let items = filteredInventory.value;
      
      // Apply sorting based on filter
      if (topItemsFilter.value === 'quantity') {
        items = items.sort((a, b) => (b.remaining_quantity || 0) - (a.remaining_quantity || 0));
      } else if (topItemsFilter.value === 'turnover') {
        // Mock turnover calculation
        items = items.sort((a, b) => {
          const turnoverA = (a.turnover_rate || Math.random() * 100);
          const turnoverB = (b.turnover_rate || Math.random() * 100);
          return turnoverB - turnoverA;
        });
      } else {
        // Default: sort by value
        items = items.sort((a, b) => {
          const valueA = (a.remaining_quantity || 0) * (a.price || 50);
          const valueB = (b.remaining_quantity || 0) * (b.price || 50);
          return valueB - valueA;
        });
      }
      
      return items.slice(0, 10).map(item => ({
        ...item,
        value: (item.remaining_quantity || 0) * (item.price || 50)
      }));
    });
    
    // Item performance for selected item
    const itemPerformance = computed(() => {
      if (!selectedItem.value) {
        return {
          score: 0,
          movementRate: 0,
          stockDays: 0
        };
      }
      
      const item = filteredInventory.value.find(i => i.id === selectedItem.value);
      if (!item) {
        return {
          score: 0,
          movementRate: 0,
          stockDays: 0
        };
      }
      
      // Mock performance calculation
      const transactions = filteredTransactions.value.filter(t => 
        t.item_name === item.name || 
        t.item_code === item.code
      );
      
      const movementRate = transactions.length;
      const stockDays = item.remaining_quantity * 30; // Mock: assuming 30 days per unit
      const score = Math.min(100, Math.round((movementRate * 10) + (item.remaining_quantity > 0 ? 50 : 0)));
      
      return {
        score,
        movementRate,
        stockDays
      };
    });
    
    // Warehouse distribution
    const warehouseDistribution = computed(() => {
      const inventory = filteredInventory.value;
      const warehouses = accessibleWarehouses.value;
      
      const distribution = warehouses
        .filter(w => w.type === 'primary')
        .map(warehouse => {
          const items = inventory.filter(item => item.warehouse_id === warehouse.id);
          let value = 0;
          
          if (distributionType.value === 'quantity') {
            value = items.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0);
          } else if (distributionType.value === 'value') {
            value = items.reduce((sum, item) => {
              return sum + ((item.remaining_quantity || 0) * (item.price || 50));
            }, 0);
          } else {
            value = items.length;
          }
          
          return {
            id: warehouse.id,
            name: warehouse.name_ar,
            value: value,
            itemsCount: items.length
          };
        })
        .filter(item => item.value > 0);
      
      // Calculate percentages
      const total = distribution.reduce((sum, item) => sum + item.value, 0);
      distribution.forEach(item => {
        item.percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
      });
      
      return distribution.sort((a, b) => b.value - a.value);
    });
    
    // Monthly trends data
    const monthlyStats = computed(() => {
      const transactions = filteredTransactions.value;
      
      // Group by month for last 6 months
      const monthlyData = {};
      const now = new Date();
      
      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        monthlyData[monthKey] = {
          transactions: 0,
          quantity: 0,
          value: 0
        };
      }
      
      // Fill with actual data
      transactions.forEach(transaction => {
        const date = transaction.timestamp?.toDate ? transaction.timestamp.toDate() : new Date(transaction.timestamp);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].transactions += 1;
          monthlyData[monthKey].quantity += (transaction.total_delta || 0);
          monthlyData[monthKey].value += ((transaction.total_delta || 0) * 50);
        }
      });
      
      // Calculate statistics
      const months = Object.keys(monthlyData);
      const currentMonthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
      const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const previousMonthKey = `${previousMonth.getFullYear()}-${previousMonth.getMonth() + 1}`;
      
      const currentValue = monthlyData[currentMonthKey]?.[trendType.value] || 0;
      const previousValue = monthlyData[previousMonthKey]?.[trendType.value] || 0;
      
      const changePercentage = previousValue > 0 
        ? Math.round(((currentValue - previousValue) / previousValue) * 100)
        : currentValue > 0 ? 100 : 0;
      
      const average = months.length > 0
        ? Math.round(Object.values(monthlyData).reduce((sum, data) => sum + data[trendType.value], 0) / months.length)
        : 0;
      
      const total = Object.values(monthlyData).reduce((sum, data) => sum + data[trendType.value], 0);
      
      return {
        changePercentage,
        currentAverage: currentValue,
        average,
        total,
        monthlyData
      };
    });
    
    // Methods
    const formatNumber = (num) => {
      return new Intl.NumberFormat('ar-EG').format(num || 0);
    };
    
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount || 0);
    };
    
    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 60) {
        return `منذ ${diffMins} دقيقة`;
      } else if (diffHours < 24) {
        return `منذ ${diffHours} ساعة`;
      } else if (diffDays < 7) {
        return `منذ ${diffDays} يوم`;
      } else {
        return date.toLocaleDateString('ar-EG');
      }
    };
    
    const getWarehouseLabel = (warehouseId) => {
      return store.getters.getWarehouseLabel(warehouseId);
    };
    
    const getItemTypeLabel = (type) => {
      const labels = {
        'low_stock': 'قليلة المخزون',
        'out_of_stock': 'منتهية المخزون',
        'high_value': 'عالية القيمة',
        'recently_added': 'مضافة مؤخراً',
        'fast_moving': 'سريعة الحركة',
        'slow_moving': 'بطيئة الحركة'
      };
      return labels[type] || type;
    };
    
    const getPeriodLabel = () => {
      const labels = {
        'today': 'اليوم',
        'week': 'هذا الأسبوع',
        'month': 'هذا الشهر',
        'quarter': 'هذا الربع',
        'year': 'هذه السنة',
        'custom': 'فترة مخصصة'
      };
      return labels[reportPeriod.value] || reportPeriod.value;
    };
    
    const resetFilters = () => {
      selectedWarehouse.value = '';
      selectedItem.value = '';
      selectedItemType.value = '';
      searchQuery.value = '';
      reportPeriod.value = 'month';
      updateCharts();
    };
    
    const changePeriod = () => {
      if (reportPeriod.value === 'custom') {
        const today = new Date();
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        
        customDateFrom.value = lastMonth.toISOString().split('T')[0];
        customDateTo.value = today.toISOString().split('T')[0];
      } else {
        updateCharts();
      }
    };
    
    const applyCustomDate = () => {
      if (customDateFrom.value && customDateTo.value) {
        updateCharts();
      }
    };
    
    const applyFilters = () => {
      updateCharts();
    };
    
    const updateWarehouseDistribution = () => {
      updateCharts();
    };
    
    const updateTopItems = () => {
      // This will automatically update the computed property
    };
    
    const updateMonthlyTrends = () => {
      updateCharts();
    };
    
    // Chart functions
    const createWarehouseChart = () => {
      if (warehouseChartInstance) {
        warehouseChartInstance.destroy();
      }
      
      const ctx = warehouseChart.value?.getContext('2d');
      if (!ctx) return;
      
      const labels = warehouseDistribution.value.map(w => w.name);
      const data = warehouseDistribution.value.map(w => w.value);
      
      // Generate gradient colors
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.2)');
      
      warehouseChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: distributionType.value === 'quantity' ? 'الكمية' : 
                   distributionType.value === 'value' ? 'القيمة (ج.م)' : 'عدد الأصناف',
            data,
            backgroundColor: gradient,
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              rtl: true,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              titleColor: '#1f2937',
              bodyColor: '#4b5563',
              borderColor: '#e5e7eb',
              borderWidth: 1,
              callbacks: {
                label: (context) => {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  label += formatNumber(context.parsed.y);
                  if (distributionType.value === 'value') {
                    label += ' ج.م';
                  } else if (distributionType.value === 'quantity') {
                    label += ' وحدة';
                  }
                  return label;
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                font: {
                  family: 'Cairo, sans-serif'
                }
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                callback: function(value) {
                  return formatNumber(value);
                }
              }
            }
          }
        }
      });
    };
    
    const createTrendsChart = () => {
      if (trendsChartInstance) {
        trendsChartInstance.destroy();
      }
      
      const ctx = trendsChart.value?.getContext('2d');
      if (!ctx) return;
      
      // Generate last 6 months data
      const months = [];
      const data = [];
      const now = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('ar-EG', { month: 'long' });
        months.push(monthName);
        
        // Get actual data from monthlyStats
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        const monthData = monthlyStats.value.monthlyData[monthKey];
        const value = monthData ? monthData[trendType.value] : 0;
        data.push(value);
      }
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
      gradient.addColorStop(1, 'rgba(245, 158, 11, 0.05)');
      
      trendsChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: months,
          datasets: [{
            label: trendType.value === 'transactions' ? 'عدد الحركات' :
                   trendType.value === 'quantity' ? 'الكميات' : 'القيمة (ج.م)',
            data,
            borderColor: 'rgb(245, 158, 11)',
            backgroundColor: gradient,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgb(245, 158, 11)',
            pointBorderColor: 'white',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              rtl: true,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              titleColor: '#1f2937',
              bodyColor: '#4b5563',
              borderColor: '#e5e7eb',
              borderWidth: 1,
              callbacks: {
                label: (context) => {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  label += formatNumber(context.parsed.y);
                  if (trendType.value === 'value') {
                    label += ' ج.م';
                  } else if (trendType.value === 'quantity') {
                    label += ' وحدة';
                  }
                  return label;
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                font: {
                  family: 'Cairo, sans-serif'
                }
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                callback: function(value) {
                  return formatNumber(value);
                }
              }
            }
          }
        }
      });
    };
    
    const updateCharts = () => {
      createWarehouseChart();
      createTrendsChart();
    };
    
    const exportReport = () => {
      const reportData = {
        period: reportPeriod.value,
        filters: {
          warehouse: selectedWarehouse.value,
          warehouseName: selectedWarehouse.value ? getWarehouseLabel(selectedWarehouse.value) : '',
          item: selectedItem.value,
          itemName: selectedItemText.value,
          itemType: selectedItemType.value,
          search: searchQuery.value
        },
        summary: summary.value,
        inventory: filteredInventory.value,
        transactions: filteredTransactions.value,
        timestamp: new Date().toISOString()
      };
      
      // Create downloadable JSON file
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `تقرير_المخزون_${selectedWarehouse.value ? getWarehouseLabel(selectedWarehouse.value).replace(/\s+/g, '_') : 'الكل'}_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      // Show success notification
      store.dispatch('showNotification', {
        type: 'success',
        message: 'تم تصدير التقرير بنجاح'
      });
    };
    
    const exportTrendData = () => {
      const trendData = {
        period: reportPeriod.value,
        trendType: trendType.value,
        data: monthlyStats.value.monthlyData,
        summary: {
          changePercentage: monthlyStats.value.changePercentage,
          average: monthlyStats.value.average,
          total: monthlyStats.value.total
        },
        timestamp: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(trendData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', `اتجاهات_المخزون_${new Date().toISOString().split('T')[0]}.json`);
      linkElement.click();
    };
    
    onMounted(() => {
      // Load recent transactions if not already loaded
      if (recentTransactions.value.length === 0) {
        store.dispatch('getRecentTransactions');
      }
      
      // Initialize charts
      setTimeout(() => {
        updateCharts();
      }, 100);
    });
    
    onUnmounted(() => {
      // Clean up chart instances
      if (warehouseChartInstance) {
        warehouseChartInstance.destroy();
      }
      if (trendsChartInstance) {
        trendsChartInstance.destroy();
      }
    });
    
    // Watch for data changes
    watch(() => [allInventory.value, allTransactions.value], () => {
      updateCharts();
    }, { deep: true });
    
    // Watch for filter changes
    watch(() => [selectedWarehouse.value, selectedItem.value, selectedItemType.value, searchQuery.value], () => {
      updateCharts();
    });
    
    return {
      // Refs
      loading,
      reportPeriod,
      distributionType,
      trendType,
      selectedWarehouse,
      selectedItem,
      selectedItemType,
      searchQuery,
      customDateFrom,
      customDateTo,
      topItemsFilter,
      warehouseChart,
      trendsChart,
      
      // Computed
      accessibleWarehouses,
      allUniqueItems,
      filteredItemsByWarehouse,
      selectedItemText,
      hasActiveFilters,
      summary,
      topItemsByValue,
      itemPerformance,
      warehouseDistribution,
      monthlyStats,
      recentFilteredTransactions,
      filteredInventory,
      
      // Methods
      formatNumber,
      formatCurrency,
      formatTime,
      getWarehouseLabel,
      getItemTypeLabel,
      getPeriodLabel,
      resetFilters,
      changePeriod,
      applyCustomDate,
      applyFilters,
      updateWarehouseDistribution,
      updateTopItems,
      updateMonthlyTrends,
      exportReport,
      exportTrendData
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap');

body {
  font-family: 'Cairo', sans-serif;
}

.space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
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

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, #f59e0b, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Glass effect */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark .glass {
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Card hover effects */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .mobile-stack {
    flex-direction: column !important;
  }
  
  .mobile-full {
    width: 100% !important;
  }
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
</style>
