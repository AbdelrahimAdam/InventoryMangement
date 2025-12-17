<template>
  <div class="space-y-4 lg:space-y-6">
    <!-- Header with Filter -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 lg:mb-6">
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">لوحة التحكم</h1>
        <p class="text-sm lg:text-base text-gray-500 dark:text-gray-400">نظرة عامة على المخزون والحركات</p>
      </div>
      
      <!-- Warehouse Filter -->
      <div class="w-full lg:w-auto">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تصفية حسب المخزن</label>
        <div class="flex gap-3">
          <select 
            v-model="selectedWarehouse"
            @change="handleWarehouseChange"
            class="w-full lg:w-64 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
          >
            <option value="all">جميع المخازن</option>
            <option 
              v-for="warehouse in warehouses" 
              :key="warehouse.id" 
              :value="warehouse.id"
            >
              {{ warehouse.name_ar || warehouse.name }}
            </option>
          </select>
          
          <button
            @click="refreshDashboard"
            :disabled="loading"
            class="px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-else>تحديث</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
      <!-- Total Items -->
      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-200 hover:shadow-md">
        <div class="px-3 py-4 lg:px-4 lg:py-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
              <svg class="h-5 w-5 lg:h-6 lg:w-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div class="mr-3 lg:mr-4">
              <dt class="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">إجمالي الأصناف</dt>
              <dd class="mt-1 text-lg lg:text-2xl font-semibold text-gray-900 dark:text-white">{{ formatEnglishNumber(filteredStats.totalItems) }}</dd>
              <div v-if="selectedWarehouse !== 'all'" class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                <span v-if="statsLoading" class="animate-pulse">جاري التحميل...</span>
                <span v-else>من أصل {{ formatEnglishNumber(safeDashboardStats.totalItems) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Total Quantity -->
      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-200 hover:shadow-md">
        <div class="px-3 py-4 lg:px-4 lg:py-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <svg class="h-5 w-5 lg:h-6 lg:w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="mr-3 lg:mr-4">
              <dt class="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">إجمالي الكمية</dt>
              <dd class="mt-1 text-lg lg:text-2xl font-semibold text-gray-900 dark:text-white">{{ formatEnglishNumber(filteredStats.totalQuantity) }}</dd>
              <div v-if="selectedWarehouse !== 'all'" class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                <span v-if="statsLoading" class="animate-pulse">جاري التحميل...</span>
                <span v-else>من أصل {{ formatEnglishNumber(safeDashboardStats.totalQuantity) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Low Stock Items -->
      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-200 hover:shadow-md">
        <div class="px-3 py-4 lg:px-4 lg:py-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <svg class="h-5 w-5 lg:h-6 lg:w-6 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="mr-3 lg:mr-4">
              <dt class="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">أصناف قليلة</dt>
              <dd class="mt-1 text-lg lg:text-2xl font-semibold text-red-600 dark:text-red-400">{{ formatEnglishNumber(filteredStats.lowStockItems) }}</dd>
              <div v-if="selectedWarehouse !== 'all'" class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                <span v-if="statsLoading" class="animate-pulse">جاري التحميل...</span>
                <span v-else>من أصل {{ formatEnglishNumber(safeDashboardStats.lowStockItems) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-200 hover:shadow-md">
        <div class="px-3 py-4 lg:px-4 lg:py-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <svg class="h-5 w-5 lg:h-6 lg:w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div class="mr-3 lg:mr-4">
              <dt class="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">الحركات اليوم</dt>
              <dd class="mt-1 text-lg lg:text-2xl font-semibold text-gray-900 dark:text-white">{{ formatEnglishNumber(todayTransactionsCount) }}</dd>
              <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                آخر تحديث: {{ lastUpdatedTime }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
      <!-- View Full Inventory -->
      <router-link 
        to="/inventory" 
        class="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg p-5 lg:p-6 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 transform"
      >
        <div class="flex items-center">
          <div class="h-12 w-12 lg:h-14 lg:w-14 rounded-lg bg-white/20 flex items-center justify-center">
            <svg class="h-6 w-6 lg:h-7 lg:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <div class="mr-4">
            <h3 class="text-lg lg:text-xl font-bold">المخزون الكامل</h3>
            <p class="text-blue-100 text-sm lg:text-base mt-1">عرض جميع الأصناف مع تفاصيل كاملة</p>
          </div>
          <svg class="h-5 w-5 lg:h-6 lg:w-6 mr-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </router-link>

      <!-- View Reports -->
      <router-link 
        to="/reports" 
        class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-5 lg:p-6 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 transform"
      >
        <div class="flex items-center">
          <div class="h-12 w-12 lg:h-14 lg:w-14 rounded-lg bg-white/20 flex items-center justify-center">
            <svg class="h-6 w-6 lg:h-7 lg:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div class="mr-4">
            <h3 class="text-lg lg:text-xl font-bold">التقارير والإحصائيات</h3>
            <p class="text-purple-100 text-sm lg:text-base mt-1">تحليل كامل للأداء والحركات</p>
          </div>
          <svg class="h-5 w-5 lg:h-6 lg:w-6 mr-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </router-link>

      <!-- Quick Add Item -->
      <router-link 
        v-if="canModifyItems"
        to="/inventory/add" 
        class="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg p-5 lg:p-6 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 transform"
      >
        <div class="flex items-center">
          <div class="h-12 w-12 lg:h-14 lg:w-14 rounded-lg bg-white/20 flex items-center justify-center">
            <svg class="h-6 w-6 lg:h-7 lg:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
          </div>
          <div class="mr-4">
            <h3 class="text-lg lg:text-xl font-bold">إضافة صنف جديد</h3>
            <p class="text-green-100 text-sm lg:text-base mt-1">إضافة صنف جديد إلى المخزون</p>
          </div>
          <svg class="h-5 w-5 lg:h-6 lg:w-6 mr-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </router-link>
    </div>

    <!-- Recent Inventory Preview -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 lg:mb-6">
        <div>
          <h2 class="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">آخر الأصناف المضافة</h2>
          <p class="text-xs lg:text-sm text-gray-500 dark:text-gray-400">أحدث 5 أصناف تمت إضافتها للمخزون</p>
        </div>
        
        <router-link 
          to="/inventory"
          class="inline-flex items-center text-sm lg:text-base font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors duration-200"
        >
          عرض الكل
          <svg class="h-4 w-4 lg:h-5 lg:w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">جاري تحميل البيانات...</p>
      </div>

      <!-- Inventory Preview Table -->
      <div v-else-if="filteredRecentInventory.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الصنف</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الكود</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">المخزن</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الكمية</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الحالة</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="item in filteredRecentInventory" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
              <td class="px-4 py-3">
                <div class="flex items-center">
                  <div v-if="item.photo_url" class="h-8 w-8 lg:h-10 lg:w-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex-shrink-0 ml-3">
                    <img :src="item.photo_url" :alt="item.name" class="h-full w-full object-cover">
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.name || 'غير محدد' }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.color || '-' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                  {{ item.code || '-' }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ getWarehouseLabel(item.warehouse_id) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span :class="getQuantityClass(item.remaining_quantity)" class="font-bold">
                  {{ formatEnglishNumber(item.remaining_quantity || 0) }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span :class="getStatusClass(item.remaining_quantity)" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium">
                  {{ getStatusText(item.remaining_quantity) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8 lg:py-12">
        <svg class="mx-auto h-10 w-10 lg:h-12 lg:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">لا توجد بيانات</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">لم يتم إضافة أي أصناف بعد.</p>
      </div>
    </div>

    <!-- Recent Transactions Table with Additional Information -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 lg:mb-6">
        <div>
          <h2 class="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">آخر الحركات</h2>
          <p class="text-xs lg:text-sm text-gray-500 dark:text-gray-400">أحدث الحركات في النظام مع تفاصيل كاملة</p>
        </div>
        
        <router-link 
          to="/reports"
          class="inline-flex items-center text-sm lg:text-base font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors duration-200"
        >
          عرض الكل
          <svg class="h-4 w-4 lg:h-5 lg:w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">جاري تحميل الحركات...</p>
      </div>

      <!-- Recent Transactions Table -->
      <div v-else-if="filteredRecentTransactions.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">نوع الحركة</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الصنف</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الكمية</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">المخزن / الوجهة</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">المستخدم</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الوقت</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ملاحظات</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="transaction in filteredRecentTransactions.slice(0, 10)" 
              :key="transaction.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <!-- Type Column -->
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <div :class="[
                    'h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ml-2',
                    transaction.type === 'ADD' ? 'bg-blue-100 dark:bg-blue-900/20' :
                    transaction.type === 'TRANSFER' ? 'bg-purple-100 dark:bg-purple-900/20' :
                    'bg-red-100 dark:bg-red-900/20'
                  ]">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="transaction.type === 'ADD'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      <path v-if="transaction.type === 'TRANSFER'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                      <path v-if="transaction.type === 'DISPATCH'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                  </div>
                  <span :class="[
                    'text-sm font-medium',
                    transaction.type === 'ADD' ? 'text-blue-600 dark:text-blue-300' :
                    transaction.type === 'TRANSFER' ? 'text-purple-600 dark:text-purple-300' :
                    'text-red-600 dark:text-red-300'
                  ]">
                    {{ getTransactionTypeLabel(transaction.type) }}
                  </span>
                </div>
              </td>
              
              <!-- Item Column -->
              <td class="px-4 py-3">
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ transaction.item_name || 'غير معروف' }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    {{ transaction.item_code || '' }}
                  </span>
                </div>
              </td>
              
              <!-- Quantity Column -->
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex flex-col items-end">
                  <span :class="[
                    'text-lg font-bold',
                    transaction.type === 'ADD' ? 'text-green-600 dark:text-green-400' :
                    transaction.type === 'DISPATCH' ? 'text-red-600 dark:text-red-400' :
                    'text-gray-600 dark:text-gray-400'
                  ]">
                    {{ transaction.type === 'ADD' ? '+' : '' }}{{ formatEnglishNumber(transaction.total_delta || 0) }}
                  </span>
                  <div class="flex gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <span v-if="transaction.cartons_delta > 0">
                      {{ formatEnglishNumber(transaction.cartons_delta) }} ك
                    </span>
                    <span v-if="transaction.single_delta > 0">
                      +{{ formatEnglishNumber(transaction.single_delta) }} فردي
                    </span>
                  </div>
                  <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    متبقي: {{ formatEnglishNumber(transaction.new_remaining || 0) }}
                  </div>
                </div>
              </td>
              
              <!-- Warehouse/Destination Column -->
              <td class="px-4 py-3">
                <div class="flex flex-col">
                  <template v-if="transaction.type === 'TRANSFER'">
                    <div class="flex items-center text-sm">
                      <svg class="h-4 w-4 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                      </svg>
                      <span class="text-gray-600 dark:text-gray-300">{{ getWarehouseLabel(transaction.from_warehouse) }}</span>
                    </div>
                    <div class="flex items-center text-sm mt-1">
                      <svg class="h-4 w-4 text-green-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                      </svg>
                      <span class="text-green-600 dark:text-green-400">{{ getWarehouseLabel(transaction.to_warehouse) }}</span>
                    </div>
                  </template>
                  <template v-else-if="transaction.type === 'DISPATCH'">
                    <div class="flex items-center text-sm">
                      <svg class="h-4 w-4 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                      </svg>
                      <span class="text-gray-600 dark:text-gray-300">{{ getWarehouseLabel(transaction.from_warehouse) }}</span>
                    </div>
                    <div class="flex items-center text-sm mt-1">
                      <svg class="h-4 w-4 text-red-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      <span class="text-red-600 dark:text-red-400">{{ getDestinationLabel(transaction.destination) }}</span>
                    </div>
                  </template>
                  <template v-else-if="transaction.type === 'ADD'">
                    <div class="flex items-center text-sm">
                      <svg class="h-4 w-4 text-green-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                      </svg>
                      <span class="text-green-600 dark:text-green-400">{{ getWarehouseLabel(transaction.to_warehouse) }}</span>
                    </div>
                  </template>
                  <template v-else>
                    <span class="text-sm text-gray-500 dark:text-gray-400">-</span>
                  </template>
                </div>
              </td>
              
              <!-- User Column -->
              <td class="px-4 py-3">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ml-2">
                    <svg class="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ transaction.created_by || 'نظام' }}
                    </span>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ getUserRoleBadge(transaction.created_by) }}
                    </div>
                  </div>
                </div>
              </td>
              
              <!-- Time Column -->
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex flex-col items-end">
                  <span class="text-sm text-gray-900 dark:text-white">
                    {{ formatDetailedTime(transaction.timestamp) }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatRelativeTime(transaction.timestamp) }}
                  </span>
                </div>
              </td>
              
              <!-- Notes Column -->
              <td class="px-4 py-3">
                <div class="max-w-xs">
                  <span class="text-sm text-gray-600 dark:text-gray-400 truncate block" :title="transaction.notes">
                    {{ transaction.notes || '-' }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty Transactions State -->
      <div v-else class="text-center py-8">
        <svg class="mx-auto h-10 w-10 lg:h-12 lg:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">لا توجد حركات</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">لم تتم أي حركات في هذا المخزن.</p>
      </div>
    </div>
    
    <!-- Cache Management Section (Debug) -->
    <div v-if="showCacheDebug" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">إدارة الذاكرة المؤقتة</h2>
        <button @click="toggleCacheDebug" class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          إخفاء
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">معلومات الذاكرة</h3>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">حجم الذاكرة:</span>
              <span :class="cacheHealth === 'critical' ? 'text-red-600 font-bold' : cacheHealth === 'warning' ? 'text-orange-600' : 'text-green-600'">
                {{ cacheStats.totalSize }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">عدد الأصناف:</span>
              <span class="text-gray-800 dark:text-gray-200">{{ formatEnglishNumber(cacheStats.itemCount) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">الحالة:</span>
              <span :class="cacheHealth === 'critical' ? 'text-red-600 font-bold' : cacheHealth === 'warning' ? 'text-orange-600' : 'text-green-600'">
                {{ cacheHealth === 'critical' ? 'حرجة' : cacheHealth === 'warning' ? 'تحذير' : 'جيدة' }}
              </span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الإجراءات</h3>
          <div class="space-y-2">
            <button 
              @click="cleanupCache(false)"
              class="w-full px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
              :disabled="cacheLoading"
            >
              تنظيف الذاكرة
            </button>
            <button 
              @click="cleanupCache(true)"
              class="w-full px-3 py-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
              :disabled="cacheLoading"
            >
              تنظيف قوي
            </button>
            <button 
              @click="refreshCache"
              class="w-full px-3 py-2 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors"
              :disabled="cacheLoading"
            >
              تحديث البيانات
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="cacheMessage" class="mt-3 p-2 rounded text-sm" :class="cacheMessage.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'">
        {{ cacheMessage.text }}
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
    const statsLoading = ref(false);
    const showCacheDebug = ref(false);
    const cacheLoading = ref(false);
    const cacheMessage = ref(null);
    const selectedWarehouse = ref('all');
    const dashboardStatsCache = ref(null);
    let cacheMessageTimeout = null;

    // Computed properties with safe defaults
    const userRole = computed(() => store.getters.userRole || '');
    
    // Today's transactions count
    const todayTransactionsCount = computed(() => {
      return store.getters.getTodayTransactions?.length || 0;
    });
    
    // Last updated time
    const lastUpdatedTime = computed(() => {
      const todayTransactions = store.getters.getTodayTransactions;
      if (!todayTransactions || todayTransactions.length === 0) {
        return 'لا توجد حركات اليوم';
      }
      
      const lastTransaction = todayTransactions[0];
      if (!lastTransaction.timestamp) return 'غير متاح';
      
      try {
        const date = lastTransaction.timestamp?.toDate ? 
          lastTransaction.timestamp.toDate() : new Date(lastTransaction.timestamp);
        return formatDetailedTime(date);
      } catch (error) {
        return 'غير متاح';
      }
    });
    
    // Safe dashboard stats with default values
    const safeDashboardStats = computed(() => {
      try {
        // Use the new REAL stats function
        return store.getters.dashboardRealStats('all') || {
          totalItems: 0,
          totalQuantity: 0,
          lowStockItems: 0,
          lastUpdated: new Date()
        };
      } catch (error) {
        console.error('Error getting dashboard stats:', error);
        return {
          totalItems: 0,
          totalQuantity: 0,
          lowStockItems: 0,
          lastUpdated: new Date()
        };
      }
    });
    
    // Filtered stats based on selected warehouse - USING NEW STORE ACTIONS
    const filteredStats = computed(() => {
      if (!dashboardStatsCache.value) {
        return {
          totalItems: 0,
          totalQuantity: 0,
          lowStockItems: 0,
          recentTransactions: 0
        };
      }
      
      return dashboardStatsCache.value;
    });
    
    // Cache statistics
    const cacheStats = computed(() => {
      try {
        return store.getters.cacheStats || {
          totalSize: '0 MB',
          itemCount: 0,
          pinnedItems: 0,
          frequentlyAccessed: 0,
          lastCleanup: '',
          cleanupCount: 0,
          rotationCount: 0,
          status: 'healthy'
        };
      } catch (error) {
        return {
          totalSize: '0 MB',
          itemCount: 0,
          pinnedItems: 0,
          frequentlyAccessed: 0,
          lastCleanup: '',
          cleanupCount: 0,
          rotationCount: 0,
          status: 'healthy'
        };
      }
    });
    
    const cacheHealth = computed(() => {
      try {
        return store.getters.cacheHealth || 'healthy';
      } catch (error) {
        return 'healthy';
      }
    });
    
    // Warehouses list
    const warehouses = computed(() => {
      try {
        return store.getters.warehouses || [];
      } catch (error) {
        console.error('Error getting warehouses:', error);
        return [];
      }
    });
    
    // Access inventory items correctly
    const inventoryItems = computed(() => {
      try {
        const inventory = store.getters.inventoryItems;
        return Array.isArray(inventory) ? inventory : [];
      } catch (error) {
        console.error('Error getting inventory items:', error);
        return [];
      }
    });
    
    // Access transactions correctly
    const recentStoreTransactions = computed(() => {
      try {
        const items = store.getters.recentTransactions;
        return Array.isArray(items) ? items : [];
      } catch (error) {
        console.error('Error getting recent transactions:', error);
        return [];
      }
    });
    
    // Permission check
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

    // Recent inventory (last 5 items sorted by date)
    const recentInventory = computed(() => {
      try {
        const items = inventoryItems.value;
        if (!Array.isArray(items) || items.length === 0) return [];
        
        return [...items]
          .filter(item => item && typeof item === 'object')
          .sort((a, b) => {
            try {
              const dateA = new Date(a.updated_at || a.created_at || 0);
              const dateB = new Date(b.updated_at || b.created_at || 0);
              return dateB - dateA;
            } catch (error) {
              return 0;
            }
          })
          .slice(0, 5);
      } catch (error) {
        console.error('Error getting recent inventory:', error);
        return [];
      }
    });

    // Filtered recent inventory based on selected warehouse
    const filteredRecentInventory = computed(() => {
      if (selectedWarehouse.value === 'all') {
        return recentInventory.value;
      }
      
      return recentInventory.value.filter(item => item.warehouse_id === selectedWarehouse.value);
    });

    // Recent transactions
    const recentTransactions = computed(() => {
      try {
        const items = recentStoreTransactions.value;
        if (!Array.isArray(items) || items.length === 0) return [];
        
        return [...items]
          .filter(transaction => transaction && typeof transaction === 'object')
          .sort((a, b) => {
            try {
              const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
              const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
              return dateB - dateA;
            } catch (error) {
              return 0;
            }
          });
      } catch (error) {
        console.error('Error getting recent transactions:', error);
        return [];
      }
    });

    // Filtered recent transactions based on selected warehouse
    const filteredRecentTransactions = computed(() => {
      if (selectedWarehouse.value === 'all') {
        return recentTransactions.value;
      }
      
      return recentTransactions.value.filter(transaction => 
        transaction.from_warehouse === selectedWarehouse.value || 
        transaction.to_warehouse === selectedWarehouse.value
      );
    });

    // Helper functions
    const formatEnglishNumber = (num) => {
      if (isNaN(num) || num === null || num === undefined) return '0';
      return new Intl.NumberFormat('en-US').format(num);
    };

    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        
        if (diffMins < 60) {
          return `منذ ${diffMins} دقيقة`;
        } else if (diffHours < 24) {
          return `منذ ${diffHours} ساعة`;
        } else {
          return date.toLocaleDateString('ar-EG');
        }
      } catch (error) {
        return '';
      }
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
        
        if (diffMins < 1) {
          return 'الآن';
        } else if (diffMins < 60) {
          return `قبل ${diffMins} دقيقة`;
        } else if (diffHours < 24) {
          return `قبل ${diffHours} ساعة`;
        } else if (diffDays === 1) {
          return 'أمس';
        } else if (diffDays < 7) {
          return `قبل ${diffDays} أيام`;
        } else {
          return date.toLocaleDateString('ar-EG');
        }
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
      if (!quantity || quantity === 0) return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      if (quantity < 5) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
    };

    const getStatusText = (quantity) => {
      if (!quantity || quantity === 0) return 'منتهي';
      if (quantity < 5) return 'حرج';
      return 'جيد';
    };

    const getUserRoleBadge = (userName) => {
      // This is a simplified version - in a real app, you would get the actual role
      if (userName?.includes('admin') || userName?.includes('مشرف')) {
        return 'مشرف';
      }
      return 'مستخدم';
    };

    // 🔥 NEW FUNCTION: Load dashboard stats using new store actions
    const loadDashboardStats = async (warehouseId = 'all') => {
      statsLoading.value = true;
      try {
        console.log(`📊 Loading dashboard stats for: ${warehouseId}`);
        
        if (warehouseId === 'all') {
          // Use the new store action for all warehouses
          const counts = await store.dispatch('refreshDashboardCounts', 'all');
          
          // Get today's transactions count
          const todayTransactions = store.getters.getTodayTransactions || [];
          
          dashboardStatsCache.value = {
            ...counts,
            recentTransactions: todayTransactions.length
          };
        } else {
          // For specific warehouse, use the new store action
          const counts = await store.dispatch('refreshDashboardCounts', warehouseId);
          
          // Filter today's transactions for this warehouse
          const todayTransactions = store.getters.getTodayTransactions || [];
          const warehouseTodayTransactions = todayTransactions.filter(transaction => 
            transaction.from_warehouse === warehouseId || 
            transaction.to_warehouse === warehouseId
          );
          
          dashboardStatsCache.value = {
            ...counts,
            recentTransactions: warehouseTodayTransactions.length
          };
        }
        
        console.log('✅ Dashboard stats loaded:', dashboardStatsCache.value);
      } catch (error) {
        console.error('❌ Error loading dashboard stats:', error);
        
        // Fallback to calculated stats
        const inventory = inventoryItems.value;
        const filteredInventory = warehouseId === 'all' 
          ? inventory 
          : inventory.filter(item => item.warehouse_id === warehouseId);
        
        const todayTransactions = store.getters.getTodayTransactions || [];
        const warehouseTodayTransactions = warehouseId === 'all' 
          ? todayTransactions 
          : todayTransactions.filter(transaction => 
              transaction.from_warehouse === warehouseId || 
              transaction.to_warehouse === warehouseId
            );
        
        dashboardStatsCache.value = {
          totalItems: filteredInventory.length,
          totalQuantity: filteredInventory.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0),
          lowStockItems: filteredInventory.filter(item => (item.remaining_quantity || 0) < 10).length,
          recentTransactions: warehouseTodayTransactions.length,
          lastUpdated: new Date()
        };
      } finally {
        statsLoading.value = false;
      }
    };

    // Cache management functions
    const toggleCacheDebug = () => {
      showCacheDebug.value = !showCacheDebug.value;
    };

    const showCacheMessage = (text, type = 'success') => {
      if (cacheMessageTimeout) {
        clearTimeout(cacheMessageTimeout);
      }
      
      cacheMessage.value = { text, type };
      
      cacheMessageTimeout = setTimeout(() => {
        cacheMessage.value = null;
      }, 5000);
    };

    const cleanupCache = async (aggressive = false) => {
      cacheLoading.value = true;
      try {
        await store.dispatch('cleanupCache', { aggressive });
        showCacheMessage(
          aggressive ? 'تم التنظيف القوي للذاكرة المؤقتة' : 'تم تنظيف الذاكرة المؤقتة',
          'success'
        );
      } catch (error) {
        console.error('Error cleaning cache:', error);
        showCacheMessage('حدث خطأ في تنظيف الذاكرة المؤقتة', 'error');
      } finally {
        cacheLoading.value = false;
      }
    };

    const refreshCache = async () => {
      cacheLoading.value = true;
      loading.value = true;
      try {
        await store.dispatch('refreshInventoryWithCacheManagement');
        await store.dispatch('getRecentTransactions');
        showCacheMessage('تم تحديث البيانات بنجاح', 'success');
      } catch (error) {
        console.error('Error refreshing data:', error);
        showCacheMessage('حدث خطأ في تحديث البيانات', 'error');
      } finally {
        cacheLoading.value = false;
        loading.value = false;
      }
    };

    // Refresh dashboard function - UPDATED to use new stats function
    const refreshDashboard = async () => {
      loading.value = true;
      try {
        // Refresh transactions
        await store.dispatch('getRecentTransactions');
        
        // Refresh dashboard stats
        await loadDashboardStats(selectedWarehouse.value);
        
        // If specific warehouse selected, refresh inventory data
        if (selectedWarehouse.value !== 'all') {
          await store.dispatch('loadAllInventory', { forceRefresh: true });
        }
      } catch (error) {
        console.error('Error refreshing dashboard:', error);
      } finally {
        loading.value = false;
      }
    };

    // Handle warehouse change
    const handleWarehouseChange = async () => {
      loading.value = true;
      try {
        await loadDashboardStats(selectedWarehouse.value);
      } catch (error) {
        console.error('Error changing warehouse:', error);
      } finally {
        loading.value = false;
      }
    };

    // Load data function
    const loadDashboardData = async () => {
      loading.value = true;
      
      try {
        // Load recent transactions
        const recentTransactionsPromise = store.dispatch('getRecentTransactions');
        
        // Load dashboard stats
        const statsPromise = loadDashboardStats(selectedWarehouse.value);
        
        // Set timeout to prevent hanging
        const timeoutPromise = new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 3000);
        });
        
        // Wait for all promises
        await Promise.race([Promise.all([recentTransactionsPromise, statsPromise]), timeoutPromise]);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        loading.value = false;
      }
    };

    // Watch for warehouse filter changes
    watch(selectedWarehouse, async (newValue) => {
      // Update stats automatically when filter changes
      if (!loading.value) {
        console.log('Warehouse filter changed to:', newValue);
        await loadDashboardStats(newValue);
      }
    });

    onMounted(async () => {
      console.log('Dashboard mounted');
      
      try {
        await loadDashboardData();
      } catch (error) {
        console.error('Error in dashboard mounted:', error);
        loading.value = false;
      }
      
      // Show cache debug if health is critical
      if (cacheHealth.value === 'critical') {
        showCacheDebug.value = true;
      }
    });

    onUnmounted(() => {
      if (cacheMessageTimeout) {
        clearTimeout(cacheMessageTimeout);
        cacheMessageTimeout = null;
      }
    });

    return {
      // State
      loading,
      statsLoading,
      showCacheDebug,
      cacheLoading,
      cacheMessage,
      selectedWarehouse,
      
      // Computed
      userRole,
      todayTransactionsCount,
      lastUpdatedTime,
      safeDashboardStats,
      filteredStats,
      cacheStats,
      cacheHealth,
      warehouses,
      canModifyItems,
      recentInventory,
      filteredRecentInventory,
      recentTransactions,
      filteredRecentTransactions,
      
      // Helper methods
      formatEnglishNumber,
      formatTime,
      formatDetailedTime,
      formatRelativeTime,
      getWarehouseLabel,
      getDestinationLabel,
      getTransactionTypeLabel,
      getQuantityClass,
      getStatusClass,
      getStatusText,
      getUserRoleBadge,
      
      // Actions
      toggleCacheDebug,
      cleanupCache,
      refreshCache,
      refreshDashboard,
      handleWarehouseChange
    };
  }
};
</script>

<style scoped>
/* Custom scrollbar for dark mode */
.dark ::-webkit-scrollbar {
  width: 10px;
}

.dark ::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 5px;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Smooth transitions */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Loading spinner */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Hover effects for cards */
.hover-lift:hover {
  transform: translateY(-2px);
}

/* Gradient border for cards */
.gradient-border {
  position: relative;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(135deg, #f59e0b, #f97316) border-box;
  border: 2px solid transparent;
}

.dark .gradient-border {
  background: linear-gradient(#1f2937, #1f2937) padding-box,
              linear-gradient(135deg, #f59e0b, #f97316) border-box;
}

/* Button disabled state */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Table row hover effect */
tr {
  transition: background-color 0.15s ease-in-out;
}

/* Status badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
}

/* Type icons */
.type-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  width: 2rem;
  height: 2rem;
}

/* Responsive table cells */
@media (max-width: 768px) {
  .table-cell {
    min-width: 120px;
  }
}

/* Pulse animation for loading */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>
