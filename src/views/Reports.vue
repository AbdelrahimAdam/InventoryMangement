<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-full mx-auto px-3 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo and Title -->
          <div class="flex items-center space-x-2 space-x-reverse">
            <router-link to="/" class="flex items-center space-x-2 space-x-reverse hover:opacity-80 transition-opacity">
              <div class="h-10 w-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span class="text-white font-bold text-lg">م</span>
              </div>
              <div class="hidden sm:block">
                <h1 class="text-lg font-bold text-gray-900 dark:text-white">لوحة التقارير والإحصائيات</h1>
                <p class="text-xs text-gray-500 dark:text-gray-400">نظام إدارة المخزون الذكي</p>
              </div>
            </router-link>
          </div>

          <!-- Desktop Actions -->
          <div class="hidden sm:flex items-center gap-3 space-x-reverse">
            <button 
              @click="exportToExcel"
              class="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:-translate-y-0.5"
            >
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              تصدير إلى Excel
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      <!-- Filters Section -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <select 
              v-model="selectedItem"
              @change="applyFilters"
              class="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm transition-all duration-200"
            >
              <option value="">جميع الأصناف</option>
              <option v-for="item in filteredItemsByWarehouse" :key="item.id" :value="item.id">
                {{ item.name }} ({{ item.code }})
              </option>
            </select>
          </div>

          <!-- Bottle Size Filter -->
          <div class="relative">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <span class="inline-flex items-center">
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                حجم الزجاجة
              </span>
            </label>
            <select 
              v-model="selectedBottleSize"
              @change="applyFilters"
              class="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm transition-all duration-200"
            >
              <option value="">جميع الأحجام</option>
              <option value="30ml">30 مل</option>
              <option value="50ml">50 مل</option>
              <option value="100ml">100 مل</option>
              <option value="45ml">45 مل</option>
              <option value="60ml">60 مل</option>
              <option value="75ml">75 مل</option>
              <option value="90ml">90 مل</option>
              <option value="120ml">120 مل</option>
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
                @input="handleSearch"
                placeholder="ابحث عن صنف، كود، لون، مورد..."
                class="w-full px-4 py-3 pr-12 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm transition-all duration-200"
              />
              <svg class="absolute right-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Price Management Section -->
      <div class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-2xl shadow-lg border border-yellow-200 dark:border-yellow-800 p-4 sm:p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">إدارة الأسعار حسب الحجم</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">الأسعار الحالية للسوق المصري (ج.م)</p>
          </div>
          <button 
            @click="showPriceManager = !showPriceManager"
            class="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center text-sm"
          >
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ showPriceManager ? 'إخفاء الأسعار' : 'إدارة الأسعار' }}
          </button>
        </div>

        <!-- Price Statistics -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow border border-gray-200 dark:border-gray-700">
            <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 truncate">متوسط 30 مل</div>
            <div class="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 truncate">
              {{ formatCurrencyCompact(calculateAveragePriceBySize('30ml')) }}
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow border border-gray-200 dark:border-gray-700">
            <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 truncate">متوسط 50 مل</div>
            <div class="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400 truncate">
              {{ formatCurrencyCompact(calculateAveragePriceBySize('50ml')) }}
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow border border-gray-200 dark:border-gray-700">
            <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 truncate">متوسط 100 مل</div>
            <div class="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400 truncate">
              {{ formatCurrencyCompact(calculateAveragePriceBySize('100ml')) }}
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow border border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
            <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 truncate">قيمة المخزون</div>
            <div class="text-lg sm:text-xl font-bold text-yellow-600 dark:text-yellow-400 truncate">
              {{ formatCurrencyCompact(summary.totalValue) }}
            </div>
          </div>
        </div>

        <!-- Price Manager -->
        <div v-if="showPriceManager" class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <!-- Quick Price Update -->
          <div v-if="selectedItem" class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <div class="text-sm text-blue-900 dark:text-blue-300">تحديث سعر الصنف المحدد</div>
              <div class="text-xs text-blue-700 dark:text-blue-400 truncate">{{ selectedItemText }}</div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label class="block text-xs text-gray-700 dark:text-gray-300 mb-1">الحجم</label>
                <select v-model="newPrice.size" class="w-full px-2 py-1 text-xs border rounded">
                  <option value="30ml">30 مل</option>
                  <option value="50ml">50 مل</option>
                  <option value="100ml">100 مل</option>
                </select>
              </div>
              
              <div>
                <label class="block text-xs text-gray-700 dark:text-gray-300 mb-1">السعر (ج.م)</label>
                <input 
                  type="number" 
                  v-model.number="newPrice.price"
                  placeholder="السعر"
                  class="w-full px-2 py-1 text-xs border rounded"
                />
              </div>
              
              <div class="flex items-end">
                <button 
                  @click="addPriceForSelectedItem"
                  class="w-full px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded hover:from-green-600 hover:to-emerald-600"
                >
                  حفظ السعر
                </button>
              </div>
            </div>
          </div>
          
          <!-- Current Prices Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full text-xs">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-2 py-1 text-right">العطر</th>
                  <th class="px-2 py-1 text-center">30 مل</th>
                  <th class="px-2 py-1 text-center">50 مل</th>
                  <th class="px-2 py-1 text-center">100 مل</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(price, perfumeKey) in Object.entries(perfumePrices).slice(0, 5)" :key="perfumeKey">
                  <td class="px-2 py-1 truncate max-w-[100px]">{{ price[1].name }}</td>
                  <td class="px-2 py-1 text-center">
                    <span v-if="price[1].sizePrices['30ml']" class="text-blue-600 dark:text-blue-400">
                      {{ formatCurrency(price[1].sizePrices['30ml']) }}
                    </span>
                    <span v-else class="text-gray-400">—</span>
                  </td>
                  <td class="px-2 py-1 text-center">
                    <span v-if="price[1].sizePrices['50ml']" class="text-green-600 dark:text-green-400">
                      {{ formatCurrency(price[1].sizePrices['50ml']) }}
                    </span>
                    <span v-else class="text-gray-400">—</span>
                  </td>
                  <td class="px-2 py-1 text-center">
                    <span v-if="price[1].sizePrices['100ml']" class="text-purple-600 dark:text-purple-400">
                      {{ formatCurrency(price[1].sizePrices['100ml']) }}
                    </span>
                    <span v-else class="text-gray-400">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Stats Cards - FIXED FOR MOBILE -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <!-- Total Items -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center ml-2 shadow-lg">
              <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 truncate">إجمالي الأصناف</p>
              <p class="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate" :title="formatNumber(filteredInventory.length)">
                {{ formatNumberCompact(filteredInventory.length) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Total Quantity -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center ml-2 shadow-lg">
              <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 truncate">الكمية الإجمالية</p>
              <p class="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate" :title="formatNumber(summary.totalQuantity)">
                {{ formatNumberCompact(summary.totalQuantity) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Total Value - FIXED LONG NUMBERS -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center ml-2 shadow-lg">
              <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 truncate">القيمة الإجمالية</p>
              <p class="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate" :title="formatCurrency(summary.totalValue)">
                {{ formatCurrencyCompact(summary.totalValue) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Average Price -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center ml-2 shadow-lg">
              <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 truncate">متوسط السعر</p>
              <p class="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate" :title="formatCurrency(summary.averagePrice)">
                {{ formatCurrencyCompact(summary.averagePrice) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Inventory Table -->
        <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">تفاصيل المخزون المفلتر</h3>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">الصنف</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">المخزن</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">الكمية</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">السعر/وحدة</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">القيمة</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="item in filteredInventory.slice(0, 10)" :key="item.id" 
                    class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td class="px-4 py-3">
                    <div class="font-medium text-gray-900 dark:text-white text-sm">{{ item.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.code }} - {{ item.color }}</div>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {{ getWarehouseLabel(item.warehouse_id) }}
                  </td>
                  <td class="px-4 py-3">
                    <span :class="[
                      'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
                      getQuantityClass(item.remaining_quantity)
                    ]">
                      {{ formatNumber(item.remaining_quantity) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm font-bold text-blue-600 dark:text-blue-400">
                    {{ formatCurrency(getItemPrice(item)) }}
                  </td>
                  <td class="px-4 py-3 text-sm font-bold text-green-600 dark:text-green-400">
                    {{ formatCurrency(item.remaining_quantity * getItemPrice(item)) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Transactions Summary -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">الحركات الحديثة</h3>
          
          <div class="space-y-3">
            <div v-for="transaction in recentFilteredTransactions.slice(0, 8)" :key="transaction.id" 
                 class="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
              <div class="flex items-start">
                <div :class="[
                  'h-8 w-8 rounded-lg flex items-center justify-center mr-3',
                  transaction.type === 'ADD' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300' :
                  transaction.type === 'TRANSFER' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300' :
                  'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300'
                ]">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="transaction.type === 'ADD'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    <path v-if="transaction.type === 'TRANSFER'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                    <path v-if="transaction.type === 'DISPATCH'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1">
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ transaction.item_name }}</h4>
                    <span class="text-xs font-medium" 
                          :class="transaction.type === 'ADD' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'">
                      {{ transaction.type === 'ADD' ? '+' : '' }}{{ formatNumber(transaction.total_delta) }}
                    </span>
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ formatTime(transaction.timestamp) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cash Flow Analysis -->
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl shadow-lg border border-green-200 dark:border-green-800 p-4 sm:p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">تحليل التدفق النقدي</h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">الإيرادات</h4>
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p class="text-xl font-bold text-green-600 dark:text-green-400 truncate">
              {{ formatCurrencyCompact(cashFlowAnalysis.cashIn) }}
            </p>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">المصروفات</h4>
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p class="text-xl font-bold text-red-600 dark:text-red-400 truncate">
              {{ formatCurrencyCompact(cashFlowAnalysis.cashOut) }}
            </p>
          </div>

          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-4 shadow border border-blue-200 dark:border-blue-800">
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">صافي التدفق</h4>
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <p :class="[
              'text-xl font-bold truncate',
              cashFlowAnalysis.netCashFlow >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            ]">
              {{ formatCurrencyCompact(cashFlowAnalysis.netCashFlow) }}
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted, reactive } from 'vue';
import { useStore } from 'vuex';
import * as XLSX from 'xlsx';

export default {
  name: 'Reports',
  setup() {
    const store = useStore();
    
    // Refs
    const selectedWarehouse = ref('');
    const selectedItem = ref('');
    const selectedBottleSize = ref('');
    const searchQuery = ref('');
    const showPriceManager = ref(false);
    
    // Price management
    const newPrice = reactive({
      size: '50ml',
      price: 0
    });
    
    const perfumePrices = ref({});

    // Load prices from localStorage
    const loadPricesFromStorage = () => {
      try {
        const stored = localStorage.getItem('perfume_prices');
        if (stored) {
          perfumePrices.value = JSON.parse(stored);
        } else {
          // Initialize empty if no stored prices
          perfumePrices.value = {};
        }
      } catch (error) {
        console.error('Error loading prices:', error);
        perfumePrices.value = {};
      }
    };

    // Save prices to localStorage
    const savePricesToStorage = () => {
      try {
        localStorage.setItem('perfume_prices', JSON.stringify(perfumePrices.value));
      } catch (error) {
        console.error('Error saving prices:', error);
      }
    };

    // Format numbers for mobile (compact)
    const formatNumberCompact = (num) => {
      if (num === undefined || num === null) return '0';
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return num.toString();
    };

    // Format currency for mobile (compact)
    const formatCurrencyCompact = (amount) => {
      if (amount === undefined || amount === null) return '0 ج.م';
      
      if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + 'M ج.م';
      }
      if (amount >= 1000) {
        return (amount / 1000).toFixed(1) + 'K ج.م';
      }
      return new Intl.NumberFormat('en-US').format(amount) + ' ج.م';
    };

    // Format full number (for tooltips)
    const formatNumber = (num) => {
      if (num === undefined || num === null) return '0';
      return new Intl.NumberFormat('en-US').format(num);
    };

    // Format full currency (for tooltips)
    const formatCurrency = (amount) => {
      if (amount === undefined || amount === null) return '0 ج.م';
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount) + ' ج.م';
    };

    // Format time
    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return '';
      }
    };

    // Extract size from item
    const extractSizeFromItem = (item) => {
      if (!item) return '50ml';
      
      // Check item name, code, and notes for size patterns
      const text = `${item.name || ''} ${item.code || ''} ${item.notes || ''}`.toLowerCase();
      
      if (text.includes('100ml') || text.includes('100 مل') || text.includes('100')) return '100ml';
      if (text.includes('50ml') || text.includes('50 مل') || text.includes('50')) return '50ml';
      if (text.includes('30ml') || text.includes('30 مل') || text.includes('30')) return '30ml';
      if (text.includes('45ml') || text.includes('45 مل') || text.includes('45')) return '45ml';
      if (text.includes('60ml') || text.includes('60 مل') || text.includes('60')) return '60ml';
      if (text.includes('75ml') || text.includes('75 مل') || text.includes('75')) return '75ml';
      if (text.includes('90ml') || text.includes('90 مل') || text.includes('90')) return '90ml';
      if (text.includes('120ml') || text.includes('120 مل') || text.includes('120')) return '120ml';
      
      return '50ml'; // Default
    };

    // Get item price based on size
    const getItemPrice = (item) => {
      if (!item) return 50; // Fallback to old average
      
      const size = extractSizeFromItem(item);
      
      // Try to find this specific item in price list
      const itemKey = item.name?.toLowerCase().replace(/\s+/g, '_');
      if (itemKey && perfumePrices.value[itemKey]) {
        const perfume = perfumePrices.value[itemKey];
        if (perfume.sizePrices && perfume.sizePrices[size]) {
          return perfume.sizePrices[size];
        }
      }
      
      // Fallback to size-based defaults for Egyptian market
      const sizeDefaults = {
        '30ml': 1200,
        '45ml': 1800,
        '50ml': 2000,
        '60ml': 2400,
        '75ml': 3000,
        '90ml': 3600,
        '100ml': 4000,
        '120ml': 4800
      };
      
      return sizeDefaults[size] || 2000;
    };

    // Calculate average price by size
    const calculateAveragePriceBySize = (size) => {
      const prices = Object.values(perfumePrices.value)
        .map(p => p.sizePrices?.[size])
        .filter(p => p && p > 0);
      
      if (prices.length === 0) {
        // Return Egyptian market default averages
        const defaults = {
          '30ml': 1200,
          '50ml': 2000,
          '100ml': 4000
        };
        return defaults[size] || 2000;
      }
      
      const sum = prices.reduce((a, b) => a + b, 0);
      return Math.round(sum / prices.length);
    };

    // Add price for selected item
    const addPriceForSelectedItem = () => {
      if (!selectedItem.value || !newPrice.price || newPrice.price <= 0) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'الرجاء اختيار صنف وإدخال سعر صحيح'
        });
        return;
      }
      
      // Find the item
      const item = allUniqueItems.value.find(i => i.id === selectedItem.value);
      if (!item) return;
      
      const perfumeKey = item.name.toLowerCase().replace(/\s+/g, '_');
      
      if (!perfumePrices.value[perfumeKey]) {
        perfumePrices.value[perfumeKey] = {
          name: item.name,
          sizePrices: {},
          lastUpdated: new Date().toISOString()
        };
      }
      
      perfumePrices.value[perfumeKey].sizePrices[newPrice.size] = parseInt(newPrice.price);
      perfumePrices.value[perfumeKey].lastUpdated = new Date().toISOString();
      
      savePricesToStorage();
      
      store.dispatch('showNotification', {
        type: 'success',
        message: `تم تحديث سعر ${newPrice.size} لـ ${item.name} إلى ${formatCurrency(newPrice.price)}`
      });
      
      newPrice.price = 0;
      newPrice.size = '50ml';
    };

    // Getters from store
    const accessibleWarehouses = computed(() => store.getters.accessibleWarehouses || []);
    const allInventory = computed(() => store.state.inventory || []);
    const recentTransactions = computed(() => store.state.recentTransactions || []);
    
    // All unique items for dropdown
    const allUniqueItems = computed(() => {
      const itemsMap = new Map();
      (allInventory.value || []).forEach(item => {
        if (item && item.id && !itemsMap.has(item.id)) {
          itemsMap.set(item.id, {
            id: item.id,
            name: item.name || '',
            code: item.code || '',
            warehouse_id: item.warehouse_id || ''
          });
        }
      });
      return Array.from(itemsMap.values());
    });

    // Items filtered by selected warehouse
    const filteredItemsByWarehouse = computed(() => {
      if (!selectedWarehouse.value) return allUniqueItems.value;
      return (allUniqueItems.value || []).filter(item => item.warehouse_id === selectedWarehouse.value);
    });

    // Selected item text for display
    const selectedItemText = computed(() => {
      if (!selectedItem.value) return '';
      const item = (allUniqueItems.value || []).find(i => i.id === selectedItem.value);
      return item ? `${item.name} (${item.code})` : '';
    });

    // Filtered inventory based on all filters
    const filteredInventory = computed(() => {
      let inventory = allInventory.value || [];
      
      // Filter by warehouse
      if (selectedWarehouse.value) {
        inventory = inventory.filter(item => item.warehouse_id === selectedWarehouse.value);
      }
      
      // Filter by specific item
      if (selectedItem.value) {
        inventory = inventory.filter(item => item.id === selectedItem.value);
      }
      
      // Filter by bottle size
      if (selectedBottleSize.value) {
        inventory = inventory.filter(item => {
          const size = extractSizeFromItem(item);
          return size === selectedBottleSize.value;
        });
      }
      
      // Filter by search query
      if (searchQuery.value) {
        const searchLower = searchQuery.value.toLowerCase();
        inventory = inventory.filter(item =>
          (item.name?.toLowerCase() || '').includes(searchLower) ||
          (item.code?.toLowerCase() || '').includes(searchLower) ||
          (item.color?.toLowerCase() || '').includes(searchLower) ||
          (item.supplier?.toLowerCase() || '').includes(searchLower)
        );
      }
      
      return inventory;
    });

    // Recent filtered transactions
    const recentFilteredTransactions = computed(() => {
      return (recentTransactions.value || [])
        .sort((a, b) => {
          try {
            const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || Date.now());
            const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || Date.now());
            return dateB - dateA;
          } catch (error) {
            return 0;
          }
        });
    });

    // Summary statistics using REAL DATA from filtered inventory
    const summary = computed(() => {
      const inventory = filteredInventory.value || [];
      
      // Calculate total value and quantity with dynamic pricing
      const totalQuantity = inventory.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0);
      const totalValue = inventory.reduce((sum, item) => {
        const quantity = item.remaining_quantity || 0;
        const price = getItemPrice(item); // Dynamic price based on size
        return sum + (quantity * price);
      }, 0);
      
      const averagePrice = totalQuantity > 0 ? Math.round(totalValue / totalQuantity) : 0;
      
      return {
        totalItems: inventory.length,
        totalQuantity,
        totalValue,
        averagePrice
      };
    });

    // Cash flow analysis using REAL DATA
    const cashFlowAnalysis = computed(() => {
      const transactions = recentFilteredTransactions.value || [];
      
      const cashIn = transactions
        .filter(t => t.type === 'DISPATCH')
        .reduce((sum, t) => {
          // Estimate price based on transaction description
          const description = `${t.item_name || ''}`.toLowerCase();
          let price = 2000; // Default
          if (description.includes('100ml') || description.includes('100')) price = 4000;
          else if (description.includes('50ml') || description.includes('50')) price = 2000;
          else if (description.includes('30ml') || description.includes('30')) price = 1200;
          
          return sum + (Math.abs(t.total_delta || 0) * price);
        }, 0);
      
      const cashOut = transactions
        .filter(t => t.type === 'ADD')
        .reduce((sum, t) => {
          const description = `${t.item_name || ''}`.toLowerCase();
          let price = 2000;
          if (description.includes('100ml') || description.includes('100')) price = 4000;
          else if (description.includes('50ml') || description.includes('50')) price = 2000;
          else if (description.includes('30ml') || description.includes('30')) price = 1200;
          
          return sum + (Math.abs(t.total_delta || 0) * price);
        }, 0);
      
      const netCashFlow = cashIn - cashOut;
      
      return {
        cashIn,
        cashOut,
        netCashFlow
      };
    });

    // Helper functions
    const getWarehouseLabel = (warehouseId) => {
      if (!warehouseId) return '';
      return store.getters.getWarehouseLabel(warehouseId) || warehouseId;
    };

    const getQuantityClass = (quantity) => {
      if (!quantity || quantity === 0) return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      if (quantity < 10) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      if (quantity < 50) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
    };

    // Apply filters
    const applyFilters = () => {
      // Filters are reactive, no need for additional logic
    };

    const handleSearch = () => {
      applyFilters();
    };

    // Export to Excel
    const exportToExcel = () => {
      try {
        const wb = XLSX.utils.book_new();
        
        // Inventory data
        const inventoryHeaders = [
          'اسم الصنف',
          'الكود',
          'اللون',
          'المخزن',
          'الكمية',
          'حجم الزجاجة',
          'سعر الوحدة (ج.م)',
          'القيمة الإجمالية (ج.م)'
        ];
        
        const inventoryData = filteredInventory.value.map(item => [
          item.name || '',
          item.code || '',
          item.color || '',
          getWarehouseLabel(item.warehouse_id),
          item.remaining_quantity || 0,
          extractSizeFromItem(item),
          getItemPrice(item),
          (item.remaining_quantity || 0) * getItemPrice(item)
        ]);
        
        const inventoryWs = XLSX.utils.aoa_to_sheet([inventoryHeaders, ...inventoryData]);
        XLSX.utils.book_append_sheet(wb, inventoryWs, 'المخزون');
        
        // Summary data
        const summaryData = [
          ['تقرير المخزون', '', '', ''],
          ['تاريخ التصدير', new Date().toLocaleDateString('ar-EG'), '', ''],
          ['', '', '', ''],
          ['المخزن المحدد', selectedWarehouse.value ? getWarehouseLabel(selectedWarehouse.value) : 'جميع المخازن', '', ''],
          ['الصنف المحدد', selectedItemText.value || 'جميع الأصناف', '', ''],
          ['حجم الزجاجة', selectedBottleSize.value || 'جميع الأحجام', '', ''],
          ['', '', '', ''],
          ['إجمالي الأصناف', summary.value.totalItems, '', ''],
          ['الكمية الإجمالية', summary.value.totalQuantity, '', ''],
          ['القيمة الإجمالية', summary.value.totalValue, 'ج.م', ''],
          ['متوسط السعر', summary.value.averagePrice, 'ج.م', '']
        ];
        
        const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summaryWs, 'ملخص');
        
        // Save file
        const filename = `تقرير_المخزون_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, filename);
        
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم تصدير التقرير إلى Excel: ${filename}`
        });
        
      } catch (error) {
        console.error('Error exporting to Excel:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تصدير التقرير'
        });
      }
    };

    // Initialize on mount
    onMounted(() => {
      loadPricesFromStorage();
    });

    return {
      // Refs
      selectedWarehouse,
      selectedItem,
      selectedBottleSize,
      searchQuery,
      showPriceManager,
      newPrice,
      perfumePrices,
      
      // Computed
      accessibleWarehouses,
      allUniqueItems,
      filteredItemsByWarehouse,
      selectedItemText,
      filteredInventory,
      recentFilteredTransactions,
      summary,
      cashFlowAnalysis,
      
      // Methods
      formatNumber,
      formatNumberCompact,
      formatCurrency,
      formatCurrencyCompact,
      formatTime,
      getWarehouseLabel,
      getQuantityClass,
      applyFilters,
      handleSearch,
      exportToExcel,
      extractSizeFromItem,
      getItemPrice,
      calculateAveragePriceBySize,
      addPriceForSelectedItem
    };
  }
};
</script>

<style scoped>
/* Mobile optimizations */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.min-w-0 {
  min-width: 0;
}

/* Responsive table */
@media (max-width: 640px) {
  table {
    font-size: 0.75rem;
  }
  
  .text-xs {
    font-size: 0.65rem;
  }
}
</style>