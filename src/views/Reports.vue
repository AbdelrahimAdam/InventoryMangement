<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center h-auto sm:h-16 py-3 sm:py-0">
          <!-- Navigation -->
          <div class="flex items-center space-x-4 space-x-reverse mb-3 sm:mb-0">
            <router-link to="/" class="flex items-center space-x-2 space-x-reverse hover:opacity-80 transition-opacity">
              <div class="h-8 w-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">م</span>
              </div>
              <div>
                <h1 class="text-lg font-bold text-gray-900 dark:text-white">التقارير والإحصائيات</h1>
                <p class="text-xs text-gray-500 dark:text-gray-400">نظام إدارة المخزون</p>
              </div>
            </router-link>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap items-center gap-3 space-x-reverse">
            <select 
              v-model="reportPeriod"
              @change="changePeriod"
              class="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="today">اليوم</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
              <option value="quarter">هذا الربع</option>
              <option value="year">هذه السنة</option>
              <option value="custom">مخصص</option>
            </select>
            
            <button 
              @click="exportReport"
              class="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              تصدير التقرير
            </button>
            
            <router-link 
              to="/" 
              class="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              الرئيسية
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Warehouse Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">فلترة حسب المخزن</label>
            <select 
              v-model="selectedWarehouse"
              @change="applyFilters"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="">جميع المخازن</option>
              <option v-for="warehouse in accessibleWarehouses" :key="warehouse.id" :value="warehouse.id">
                {{ warehouse.name_ar }}
              </option>
            </select>
          </div>

          <!-- Item Type Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">فلترة حسب النوع</label>
            <select 
              v-model="selectedItemType"
              @change="applyFilters"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="">جميع الأصناف</option>
              <option value="low_stock">قليلة المخزون (&lt; 10)</option>
              <option value="out_of_stock">منتهية المخزون</option>
              <option value="high_value">عالية القيمة</option>
              <option value="recently_added">مضافة مؤخراً</option>
            </select>
          </div>

          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">بحث</label>
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                @input="applyFilters"
                placeholder="ابحث عن صنف، كود، لون..."
                class="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
              <svg class="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Custom Date Range -->
        <div v-if="reportPeriod === 'custom'" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">تحديد الفترة المخصصة</h3>
            <div class="flex flex-col sm:flex-row gap-3">
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">من:</label>
                <input 
                  type="date" 
                  v-model="customDateFrom"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full"
                >
              </div>
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">إلى:</label>
                <input 
                  type="date" 
                  v-model="customDateTo"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full"
                >
              </div>
              <button 
                @click="applyCustomDate"
                class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                تطبيق
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- Total Items -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center ml-4">
              <svg class="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">إجمالي الأصناف</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(summary.totalItems) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ summary.uniqueItems }} صنف فريد</p>
            </div>
          </div>
        </div>

        <!-- Total Transactions -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center ml-4">
              <svg class="h-6 w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">إجمالي الحركات</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(summary.totalTransactions) }}</p>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded">
                  +{{ summary.addTransactions }}
                </span>
                <span class="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 rounded">
                  ↔{{ summary.transferTransactions }}
                </span>
                <span class="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded">
                  →{{ summary.dispatchTransactions }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Value -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center ml-4">
              <svg class="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">القيمة الإجمالية</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(summary.totalValue) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatNumber(summary.totalQuantity) }} وحدة</p>
            </div>
          </div>
        </div>

        <!-- Low Stock Items -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center ml-4">
              <svg class="h-6 w-6 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">أصناف قليلة</p>
              <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ formatNumber(summary.lowStockItems) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ summary.outOfStockItems }} منتهية</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Warehouse Distribution Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">توزيع المخزون حسب المخازن</h3>
            <select 
              v-model="distributionType"
              @change="updateWarehouseDistribution"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="quantity">حسب الكمية</option>
              <option value="value">حسب القيمة</option>
              <option value="items">حسب عدد الأصناف</option>
            </select>
          </div>
          
          <div class="h-64">
            <canvas ref="warehouseChart"></canvas>
          </div>
          
          <div class="mt-6 space-y-3">
            <div v-for="warehouse in warehouseDistribution" :key="warehouse.id" class="flex items-center">
              <div class="w-32 text-sm text-gray-600 dark:text-gray-400 truncate">{{ warehouse.name }}</div>
              <div class="flex-1 ml-4">
                <div class="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    :style="{ width: warehouse.percentage + '%' }"
                    class="absolute h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  ></div>
                </div>
              </div>
              <div class="w-20 text-right text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                {{ formatNumber(warehouse.value) }}
                <span v-if="distributionType === 'value'">ج.م</span>
                <span v-else-if="distributionType === 'quantity'">وحدة</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Transactions by Type Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">الحركات حسب النوع</h3>
            <select 
              v-model="transactionsPeriod"
              @change="updateTransactionsChart"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="today">اليوم</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
            </select>
          </div>
          
          <div class="h-64">
            <canvas ref="transactionsChart"></canvas>
          </div>
          
          <div class="mt-6 grid grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ summary.addTransactions }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">إضافة</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ summary.transferTransactions }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">نقل</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ summary.dispatchTransactions }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">صرف</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Items and Monthly Trends -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Top Items by Value -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">أعلى الأصناف قيمة</h3>
            <span class="text-sm text-gray-500 dark:text-gray-400">أعلى 10 أصناف</span>
          </div>
          
          <div class="space-y-4">
            <div v-for="(item, index) in topItemsByValue" :key="item.id" class="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-200">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                {{ index + 1 }}
              </div>
              <div class="ml-4 flex-1">
                <div class="flex items-center justify-between">
                  <h4 class="font-medium text-gray-900 dark:text-white truncate">{{ item.name }}</h4>
                  <span class="text-sm font-bold text-yellow-600 dark:text-yellow-400">{{ formatCurrency(item.value) }}</span>
                </div>
                <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span class="ml-3">{{ item.code }}</span>
                  <span class="ml-3">{{ item.color }}</span>
                  <span class="ml-3">{{ getWarehouseLabel(item.warehouse_id) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Monthly Trends -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">الاتجاهات الشهرية</h3>
            <select 
              v-model="trendType"
              @change="updateMonthlyTrends"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="transactions">الحركات</option>
              <option value="quantity">الكميات</option>
              <option value="value">القيمة</option>
            </select>
          </div>
          
          <div class="h-64">
            <canvas ref="trendsChart"></canvas>
          </div>
          
          <div class="mt-4 grid grid-cols-2 gap-4">
            <div class="text-center p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
              <div class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ monthlyStats.changePercentage }}%</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">نسبة التغيير</div>
            </div>
            <div class="text-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
              <div class="text-lg font-bold text-green-600 dark:text-green-400">{{ formatNumber(monthlyStats.average) }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">المتوسط الشهري</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Low Stock Items -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">الأصناف قليلة المخزون</h3>
            <span class="text-sm text-red-600 dark:text-red-400">{{ lowStockItems.length }} صنف</span>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الصنف</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">المخزن</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">المتبقي</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الحالة</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="item in lowStockItems.slice(0, 5)" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.code }} - {{ item.color }}</div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ getWarehouseLabel(item.warehouse_id) }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <span :class="item.remaining_quantity === 0 ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'">
                      {{ formatNumber(item.remaining_quantity) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span :class="[
                      'px-2 py-1 text-xs rounded-full',
                      item.remaining_quantity === 0 ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200' :
                      item.remaining_quantity < 5 ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200' :
                      'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200'
                    ]">
                      {{ item.remaining_quantity === 0 ? 'منتهي' : item.remaining_quantity < 5 ? 'حرج' : 'منخفض' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <router-link 
            v-if="lowStockItems.length > 5"
            to="/inventory?filter=low_stock"
            class="block mt-4 text-center px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300"
          >
            عرض جميع الأصناف قليلة المخزون ({{ lowStockItems.length }})
          </router-link>
        </div>

        <!-- Recent Transactions -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">آخر الحركات</h3>
            <router-link to="/transactions" class="text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300">
              عرض الكل
            </router-link>
          </div>
          
          <div class="space-y-4">
            <div v-for="transaction in recentTransactions.slice(0, 5)" :key="transaction.id" class="flex items-start p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-200">
              <div :class="[
                'h-10 w-10 rounded-lg flex items-center justify-center',
                transaction.type === 'ADD' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300' :
                transaction.type === 'TRANSFER' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300' :
                'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300'
              ]">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="transaction.type === 'ADD'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  <path v-if="transaction.type === 'TRANSFER'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                  <path v-if="transaction.type === 'DISPATCH'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
              </div>
              <div class="ml-4 flex-1">
                <div class="flex items-center justify-between">
                  <h4 class="font-medium text-gray-900 dark:text-white truncate">{{ transaction.item_name }}</h4>
                  <span class="text-sm font-bold" :class="transaction.type === 'ADD' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'">
                    +{{ formatNumber(transaction.total_delta) }}
                  </span>
                </div>
                <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span v-if="transaction.from_warehouse" class="ml-3">من {{ getWarehouseLabel(transaction.from_warehouse) }}</span>
                  <span v-if="transaction.to_warehouse" class="ml-3">إلى {{ getWarehouseLabel(transaction.to_warehouse) }}</span>
                  <span class="ml-3">{{ formatTime(transaction.timestamp) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-8 flex flex-col items-center shadow-xl">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mb-4"></div>
        <p class="text-gray-700 dark:text-gray-300">جاري تحميل التقارير...</p>
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
    const transactionsPeriod = ref('month');
    const trendType = ref('transactions');
    const selectedWarehouse = ref('');
    const selectedItemType = ref('');
    const searchQuery = ref('');
    const customDateFrom = ref('');
    const customDateTo = ref('');
    
    // Chart refs
    const warehouseChart = ref(null);
    const transactionsChart = ref(null);
    const trendsChart = ref(null);
    
    // Chart instances
    let warehouseChartInstance = null;
    let transactionsChartInstance = null;
    let trendsChartInstance = null;
    
    // Computed properties
    const userRole = computed(() => store.getters.userRole);
    const accessibleWarehouses = computed(() => store.getters.accessibleWarehouses);
    const allInventory = computed(() => store.state.inventory || []);
    const allTransactions = computed(() => store.state.transactions || []);
    const recentTransactions = computed(() => store.state.recentTransactions || []);
    
    // Filtered inventory based on selected filters
    const filteredInventory = computed(() => {
      let inventory = allInventory.value;
      
      // Filter by warehouse
      if (selectedWarehouse.value) {
        inventory = inventory.filter(item => item.warehouse_id === selectedWarehouse.value);
      }
      
      // Filter by item type
      if (selectedItemType.value) {
        switch (selectedItemType.value) {
          case 'low_stock':
            inventory = inventory.filter(item => (item.remaining_quantity || 0) < 10);
            break;
          case 'out_of_stock':
            inventory = inventory.filter(item => (item.remaining_quantity || 0) === 0);
            break;
          case 'high_value':
            // Assuming average value per item is 50 EGP
            inventory = inventory.filter(item => ((item.remaining_quantity || 0) * 50) > 1000);
            break;
          case 'recently_added':
            // Filter items added in last 7 days (mock logic)
            const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            inventory = inventory.filter(item => {
              const itemDate = new Date(item.created_at || item.updated_at || Date.now());
              return itemDate > oneWeekAgo;
            });
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
    
    // Filtered transactions based on date period
    const filteredTransactions = computed(() => {
      let transactions = allTransactions.value;
      
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
    
    // Summary statistics
    const summary = computed(() => {
      const inventory = filteredInventory.value;
      const transactions = filteredTransactions.value;
      
      // Calculate unique items by name+code+color
      const uniqueItemsMap = new Map();
      inventory.forEach(item => {
        const key = `${item.name}_${item.code}_${item.color}`;
        if (!uniqueItemsMap.has(key)) {
          uniqueItemsMap.set(key, item);
        }
      });
      
      // Calculate total value (assuming average value per item is 50 EGP)
      const totalValue = inventory.reduce((sum, item) => {
        const quantity = item.remaining_quantity || 0;
        return sum + (quantity * 50); // 50 EGP per item average
      }, 0);
      
      // Calculate total quantity
      const totalQuantity = inventory.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0);
      
      // Calculate transactions by type
      const addTransactions = transactions.filter(t => t.type === 'ADD').length;
      const transferTransactions = transactions.filter(t => t.type === 'TRANSFER').length;
      const dispatchTransactions = transactions.filter(t => t.type === 'DISPATCH').length;
      
      return {
        totalItems: inventory.length,
        uniqueItems: uniqueItemsMap.size,
        totalTransactions: transactions.length,
        addTransactions,
        transferTransactions,
        dispatchTransactions,
        totalValue,
        totalQuantity,
        lowStockItems: inventory.filter(item => (item.remaining_quantity || 0) < 10).length,
        outOfStockItems: inventory.filter(item => (item.remaining_quantity || 0) === 0).length,
        highValueItems: inventory.filter(item => ((item.remaining_quantity || 0) * 50) > 1000).length
      };
    });
    
    // Low stock items
    const lowStockItems = computed(() => {
      return filteredInventory.value
        .filter(item => (item.remaining_quantity || 0) < 10)
        .sort((a, b) => (a.remaining_quantity || 0) - (b.remaining_quantity || 0));
    });
    
    // Top items by value
    const topItemsByValue = computed(() => {
      return filteredInventory.value
        .map(item => ({
          ...item,
          value: (item.remaining_quantity || 0) * 50 // 50 EGP per item average
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
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
            value = items.reduce((sum, item) => sum + ((item.remaining_quantity || 0) * 50), 0);
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
      
      // Sort by value descending
      return distribution.sort((a, b) => b.value - a.value);
    });
    
    // Monthly trends data
    const monthlyStats = computed(() => {
      const transactions = filteredTransactions.value;
      
      // Group by month
      const monthlyData = {};
      transactions.forEach(transaction => {
        const date = transaction.timestamp?.toDate ? transaction.timestamp.toDate() : new Date(transaction.timestamp);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            transactions: 0,
            quantity: 0,
            value: 0
          };
        }
        
        monthlyData[monthKey].transactions += 1;
        monthlyData[monthKey].quantity += (transaction.total_delta || 0);
        monthlyData[monthKey].value += ((transaction.total_delta || 0) * 50); // 50 EGP per item average
      });
      
      // Calculate statistics
      const months = Object.keys(monthlyData);
      const currentMonth = months[months.length - 1];
      const previousMonth = months[months.length - 2];
      
      const currentValue = monthlyData[currentMonth]?.[trendType.value] || 0;
      const previousValue = monthlyData[previousMonth]?.[trendType.value] || 0;
      
      const changePercentage = previousValue > 0 
        ? Math.round(((currentValue - previousValue) / previousValue) * 100)
        : currentValue > 0 ? 100 : 0;
      
      const average = months.length > 0
        ? Math.round(Object.values(monthlyData).reduce((sum, data) => sum + data[trendType.value], 0) / months.length)
        : 0;
      
      return {
        changePercentage,
        average,
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
      updateWarehouseChart();
    };
    
    const updateTransactionsChart = () => {
      updateCharts();
    };
    
    const updateMonthlyTrends = () => {
      updateTrendsChart();
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
      const backgroundColors = [
        'rgba(59, 130, 246, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(6, 182, 212, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ];
      
      warehouseChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: distributionType.value === 'quantity' ? 'الكمية' : 
                   distributionType.value === 'value' ? 'القيمة (ج.م)' : 'عدد الأصناف',
            data,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
            borderWidth: 1,
            borderRadius: 6
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
    
    const createTransactionsChart = () => {
      if (transactionsChartInstance) {
        transactionsChartInstance.destroy();
      }
      
      const ctx = transactionsChart.value?.getContext('2d');
      if (!ctx) return;
      
      const transactions = filteredTransactions.value;
      const addCount = transactions.filter(t => t.type === 'ADD').length;
      const transferCount = transactions.filter(t => t.type === 'TRANSFER').length;
      const dispatchCount = transactions.filter(t => t.type === 'DISPATCH').length;
      
      transactionsChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['إضافة', 'نقل', 'صرف'],
          datasets: [{
            data: [addCount, transferCount, dispatchCount],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(139, 92, 246, 0.8)',
              'rgba(239, 68, 68, 0.8)'
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(139, 92, 246, 1)',
              'rgba(239, 68, 68, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              rtl: true,
              labels: {
                font: {
                  family: 'Cairo, sans-serif'
                },
                padding: 20
              }
            },
            tooltip: {
              rtl: true,
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${formatNumber(value)} (${percentage}%)`;
                }
              }
            }
          },
          cutout: '60%'
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
        
        // Mock data for trends - in real app, you would aggregate actual data
        const baseValue = trendType.value === 'transactions' ? 100 :
                         trendType.value === 'quantity' ? 500 :
                         trendType.value === 'value' ? 25000 : 100;
        
        // Add some variation
        const variation = Math.random() * 40 - 20; // -20% to +20%
        const value = Math.round(baseValue * (1 + variation / 100));
        data.push(value);
      }
      
      trendsChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: months,
          datasets: [{
            label: trendType.value === 'transactions' ? 'عدد الحركات' :
                   trendType.value === 'quantity' ? 'الكميات' : 'القيمة (ج.م)',
            data,
            borderColor: 'rgb(245, 158, 11)',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
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
                display: false
              },
              ticks: {
                font: {
                  family: 'Cairo, sans-serif'
                }
              }
            },
            y: {
              beginAtZero: false,
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
      createTransactionsChart();
      createTrendsChart();
    };
    
    const updateWarehouseChart = () => {
      createWarehouseChart();
    };
    
    const updateTrendsChart = () => {
      createTrendsChart();
    };
    
    const exportReport = () => {
      const reportData = {
        period: reportPeriod.value,
        summary: summary.value,
        filters: {
          warehouse: selectedWarehouse.value,
          itemType: selectedItemType.value,
          search: searchQuery.value
        },
        timestamp: new Date().toISOString()
      };
      
      // Create downloadable JSON file
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `تقرير_المخزون_${new Date().toISOString().split('T')[0]}.json`;
      
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
    
    const loadReportData = () => {
      // Data is already loaded from store subscriptions
      // We just need to update charts when data changes
      updateCharts();
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
      if (transactionsChartInstance) {
        transactionsChartInstance.destroy();
      }
      if (trendsChartInstance) {
        trendsChartInstance.destroy();
      }
    });
    
    // Watch for data changes
    watch(() => [allInventory.value, allTransactions.value], () => {
      updateCharts();
    }, { deep: true });
    
    return {
      // Refs
      loading,
      reportPeriod,
      distributionType,
      transactionsPeriod,
      trendType,
      selectedWarehouse,
      selectedItemType,
      searchQuery,
      customDateFrom,
      customDateTo,
      warehouseChart,
      transactionsChart,
      trendsChart,
      
      // Computed
      userRole,
      accessibleWarehouses,
      summary,
      lowStockItems,
      topItemsByValue,
      warehouseDistribution,
      monthlyStats,
      recentTransactions,
      
      // Methods
      formatNumber,
      formatCurrency,
      formatTime,
      getWarehouseLabel,
      changePeriod,
      applyCustomDate,
      applyFilters,
      updateWarehouseDistribution,
      updateTransactionsChart,
      updateMonthlyTrends,
      exportReport
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
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
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

/* Chart tooltip fix */
.chartjs-tooltip {
  font-family: 'Cairo', sans-serif !important;
  text-align: right !important;
}

/* Responsive table */
@media (max-width: 640px) {
  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}

/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Focus styles */
:focus {
  outline: none;
}

:focus-visible {
  outline: 2px solid #f59e0b;
  outline-offset: 2px;
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

/* Hover effects */
.hover-lift {
  transition: transform 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
}

/* Glass effect */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.dark .glass {
  background: rgba(0, 0, 0, 0.1);
}
</style>
