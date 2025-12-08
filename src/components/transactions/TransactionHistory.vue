<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Main content integrated with app layout -->
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <!-- Page Header -->
      <div class="mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              سجل الحركات
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              تتبع جميع حركات الأصناف في النظام
            </p>
          </div>
          
          <div class="flex items-center gap-3">
            <button
              @click="refreshData"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              تحديث
            </button>
            
            <button
              @click="exportData"
              :disabled="!filteredTransactions.length || exporting"
              class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="exporting" class="w-4 h-4 ml-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <svg v-else class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              {{ exporting ? 'جاري التصدير...' : 'تصدير' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Filters Section Only -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-2">
            <input
              type="text"
              v-model="filters.search"
              placeholder="ابحث في الحركات..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          
          <div>
            <select
              v-model="filters.type"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="">جميع الأنواع</option>
              <option value="ADD">إضافة</option>
              <option value="TRANSFER">نقل</option>
              <option value="DISPATCH">صرف</option>
            </select>
          </div>
          
          <div>
            <select
              v-model="filters.dateRange"
              @change="handleDateRangeChange"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="">الفترة الزمنية</option>
              <option value="today">اليوم</option>
              <option value="week">الأسبوع</option>
              <option value="month">الشهر</option>
              <option value="custom">مخصص</option>
            </select>
          </div>
        </div>
        
        <!-- Custom Date Range -->
        <div v-if="filters.dateRange === 'custom'" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2">من تاريخ</label>
            <input
              type="date"
              v-model="filters.startDate"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2">إلى تاريخ</label>
            <input
              type="date"
              v-model="filters.endDate"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">جاري تحميل البيانات...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-lg mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{{ error }}</span>
          </div>
          <button @click="error = ''" class="text-red-600 hover:text-red-800">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Transactions Table Container -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Desktop Table -->
        <div class="hidden lg:block overflow-x-auto">
          <table class="w-full min-w-[800px]">
            <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
              <tr>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">النوع</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">من</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">إلى</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">الصنف</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">الكمية</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">التاريخ</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">الإجراءات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="filteredTransactions.length === 0">
                <td colspan="7" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  <div class="flex flex-col items-center">
                    <svg class="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    <h3 class="text-lg font-medium mb-2">لا توجد حركات</h3>
                    <p class="text-sm">لم يتم تسجيل أي حركات حتى الآن.</p>
                  </div>
                </td>
              </tr>
              
              <tr 
                v-for="transaction in paginatedTransactions" 
                :key="transaction.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getTransactionTypeClass(transaction.type)" 
                        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium">
                    {{ getTransactionType(transaction.type) }}
                  </span>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white font-medium">
                    {{ getWarehouseLabel(transaction.from_warehouse) || '-' }}
                  </div>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white font-medium">
                    {{ getWarehouseLabel(transaction.to_warehouse) || '-' }}
                  </div>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white font-medium">
                    {{ transaction.item_name || '-' }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ transaction.item_code || '' }}
                  </div>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-bold" :class="getQuantityClass(transaction)">
                    {{ getTotalQuantity(transaction) }}
                  </div>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {{ formatDate(transaction.timestamp) }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatTime(transaction.timestamp) }}
                  </div>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    @click.stop="viewTransactionDetails(transaction)"
                    class="inline-flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    title="عرض التفاصيل"
                  >
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    عرض
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Desktop Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky bottom-0">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              عرض {{ startIndex + 1 }} - {{ Math.min(endIndex, filteredTransactions.length) }} من {{ filteredTransactions.length }}
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                السابق
              </button>
              <div class="flex items-center gap-1">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    'w-8 h-8 rounded-lg transition-colors text-sm',
                    currentPage === page 
                      ? 'bg-yellow-600 text-white border border-yellow-600' 
                      : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  ]"
                >
                  {{ page }}
                </button>
              </div>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                التالي
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Cards -->
        <div class="lg:hidden">
          <div v-if="filteredTransactions.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
            <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <h3 class="text-lg font-medium mb-2">لا توجد حركات</h3>
            <p class="text-sm">لم يتم تسجيل أي حركات حتى الآن.</p>
          </div>
          
          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700 max-h-[calc(100vh-300px)] overflow-y-auto">
            <div 
              v-for="transaction in paginatedTransactions" 
              :key="transaction.id"
              class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
            >
              <div class="flex justify-between items-start mb-3">
                <span :class="getTransactionTypeClass(transaction.type)" 
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium">
                  {{ getTransactionType(transaction.type) }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDateShort(transaction.timestamp) }}
                </span>
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">الصنف:</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ transaction.item_name || '-' }}</span>
                </div>
                
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">الكمية:</span>
                  <span class="text-sm font-bold" :class="getQuantityClass(transaction)">
                    {{ getTotalQuantity(transaction) }}
                  </span>
                </div>
                
                <div v-if="transaction.from_warehouse" class="flex items-center justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">من:</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ getWarehouseLabel(transaction.from_warehouse) }}</span>
                </div>
                
                <div v-if="transaction.to_warehouse" class="flex items-center justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">إلى:</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ getWarehouseLabel(transaction.to_warehouse) }}</span>
                </div>
              </div>
              
              <div class="mt-4">
                <button
                  @click.stop="viewTransactionDetails(transaction)"
                  class="w-full inline-flex items-center justify-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  title="عرض التفاصيل"
                >
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  عرض التفاصيل
                </button>
              </div>
            </div>
            
            <!-- Mobile Pagination -->
            <div v-if="totalPages > 1" class="p-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky bottom-0">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                السابق
              </button>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ currentPage }} / {{ totalPages }}
              </span>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                التالي
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction Details Modal -->
    <div v-if="selectedTransaction" 
         class="fixed inset-0 z-50 flex items-center justify-center p-4"
         @click.self="selectedTransaction = null">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click.self="selectedTransaction = null"></div>
      
      <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <!-- Header -->
        <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-xl z-20">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">تفاصيل الحركة</h2>
            <button 
              @click="selectedTransaction = null" 
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Content -->
        <div class="p-6 space-y-6">
          <!-- Transaction Type -->
          <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div :class="getTransactionTypeClass(selectedTransaction.type, true)" 
                  class="w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="selectedTransaction.type === 'ADD'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                <path v-if="selectedTransaction.type === 'TRANSFER'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                <path v-if="selectedTransaction.type === 'DISPATCH'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </div>
            <div class="min-w-0">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">نوع الحركة</div>
              <div class="text-lg font-bold text-gray-900 dark:text-white">{{ getTransactionType(selectedTransaction.type) }}</div>
            </div>
          </div>

          <!-- Warehouses -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="selectedTransaction.from_warehouse" class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">من</div>
              <div class="text-lg font-bold text-gray-900 dark:text-white">{{ getWarehouseLabel(selectedTransaction.from_warehouse) }}</div>
            </div>
            <div v-if="selectedTransaction.to_warehouse" class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">إلى</div>
              <div class="text-lg font-bold text-gray-900 dark:text-white">{{ getWarehouseLabel(selectedTransaction.to_warehouse) }}</div>
            </div>
          </div>

          <!-- Item Details -->
          <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-3">تفاصيل الصنف</div>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">اسم الصنف:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ selectedTransaction.item_name || '-' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">كود الصنف:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ selectedTransaction.item_code || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- Quantity Details -->
          <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-3">تفاصيل الكمية</div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">الكراتين</div>
                <div class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ Math.abs(selectedTransaction.cartons_delta) || 0 }}</div>
              </div>
              <div class="text-center">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">الفردي</div>
                <div class="text-lg font-bold text-green-600 dark:text-green-400">{{ Math.abs(selectedTransaction.single_delta) || 0 }}</div>
              </div>
              <div class="text-center">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">في الكرتونة</div>
                <div class="text-lg font-bold text-purple-600 dark:text-purple-400">{{ selectedTransaction.per_carton_updated || 1 }}</div>
              </div>
              <div class="text-center">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">الإجمالي</div>
                <div class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ getTotalQuantity(selectedTransaction) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Date and Notes -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">التاريخ والوقت</div>
              <div class="text-gray-900 dark:text-white">{{ formatDate(selectedTransaction.timestamp) }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ formatTime(selectedTransaction.timestamp) }}</div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">ملاحظات</div>
              <div class="text-gray-900 dark:text-white whitespace-pre-wrap break-words">
                {{ selectedTransaction.notes || 'لا توجد ملاحظات' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'TransactionHistory',
  
  setup() {
    const store = useStore()
    
    // Reactive state
    const loading = ref(false)
    const error = ref('')
    const selectedTransaction = ref(null)
    const exporting = ref(false)
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const filters = ref({
      search: '',
      type: '',
      dateRange: '',
      startDate: '',
      endDate: ''
    })

    // Helper functions
    const getTransactionType = (type) => {
      const types = {
        'ADD': 'إضافة',
        'TRANSFER': 'نقل',
        'DISPATCH': 'صرف'
      }
      return types[type] || type
    }

    const getTransactionTypeClass = (type, isBackground = false) => {
      if (isBackground) {
        const classes = {
          'ADD': 'bg-green-600',
          'TRANSFER': 'bg-blue-600',
          'DISPATCH': 'bg-orange-600'
        }
        return classes[type] || 'bg-gray-600'
      } else {
        const classes = {
          'ADD': 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800',
          'TRANSFER': 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800',
          'DISPATCH': 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-800'
        }
        return classes[type] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
      }
    }

    const getQuantityClass = (transaction) => {
      const quantity = getTotalQuantity(transaction)
      if (transaction.type === 'ADD') return 'text-green-600 dark:text-green-400'
      if (transaction.type === 'DISPATCH') return 'text-orange-600 dark:text-orange-400'
      return 'text-blue-600 dark:text-blue-400'
    }

    const getTotalQuantity = (transaction) => {
      return Math.abs(transaction.cartons_delta * (transaction.per_carton_updated || 1) + transaction.single_delta)
    }

    const formatDate = (timestamp) => {
      if (!timestamp) return '-'
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        if (isNaN(date.getTime())) return '-'
        
        return date.toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
      } catch (err) {
        console.error('Error formatting date:', err)
        return '-'
      }
    }

    const formatTime = (timestamp) => {
      if (!timestamp) return '-'
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        if (isNaN(date.getTime())) return '-'
        
        return date.toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      } catch (err) {
        return '-'
      }
    }

    const formatDateShort = (timestamp) => {
      if (!timestamp) return '-'
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        if (isNaN(date.getTime())) return '-'
        
        return date.toLocaleDateString('ar-EG', {
          month: '2-digit',
          day: '2-digit'
        })
      } catch (err) {
        return '-'
      }
    }

    const getWarehouseLabel = (warehouseId) => {
      if (!warehouseId) return '-'
      const label = store.getters.getWarehouseLabel(warehouseId)
      return label || warehouseId
    }

    // Date range handler
    const handleDateRangeChange = () => {
      const today = new Date()
      switch (filters.value.dateRange) {
        case 'today':
          filters.value.startDate = today.toISOString().split('T')[0]
          filters.value.endDate = today.toISOString().split('T')[0]
          break
        case 'week':
          const weekAgo = new Date(today)
          weekAgo.setDate(today.getDate() - 7)
          filters.value.startDate = weekAgo.toISOString().split('T')[0]
          filters.value.endDate = today.toISOString().split('T')[0]
          break
        case 'month':
          const monthAgo = new Date(today)
          monthAgo.setMonth(today.getMonth() - 1)
          filters.value.startDate = monthAgo.toISOString().split('T')[0]
          filters.value.endDate = today.toISOString().split('T')[0]
          break
        case 'custom':
          // Keep existing dates or clear them
          break
        default:
          filters.value.startDate = ''
          filters.value.endDate = ''
      }
    }

    // Computed properties
    const transactionsData = computed(() => {
      try {
        return store.state.transactions || []
      } catch {
        return []
      }
    })

    // Filter transactions
    const filteredTransactions = computed(() => {
      try {
        let filtered = [...transactionsData.value]
        
        // Type filter
        if (filters.value.type) {
          filtered = filtered.filter(t => t.type === filters.value.type)
        }
        
        // Search filter
        if (filters.value.search) {
          const searchTerm = filters.value.search.toLowerCase()
          filtered = filtered.filter(t => {
            const fromWarehouse = getWarehouseLabel(t.from_warehouse) || ''
            const toWarehouse = getWarehouseLabel(t.to_warehouse) || ''
            const notes = t.notes || ''
            const type = getTransactionType(t.type) || ''
            const itemName = t.item_name || ''
            const itemCode = t.item_code || ''
            
            return fromWarehouse.toLowerCase().includes(searchTerm) ||
                   toWarehouse.toLowerCase().includes(searchTerm) ||
                   notes.toLowerCase().includes(searchTerm) ||
                   type.toLowerCase().includes(searchTerm) ||
                   itemName.toLowerCase().includes(searchTerm) ||
                   itemCode.toLowerCase().includes(searchTerm)
          })
        }
        
        // Date filter
        if (filters.value.startDate) {
          const startDate = new Date(filters.value.startDate)
          startDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter(t => {
            if (!t.timestamp) return false
            const date = t.timestamp.toDate ? t.timestamp.toDate() : new Date(t.timestamp)
            return date >= startDate
          })
        }
        
        if (filters.value.endDate) {
          const endDate = new Date(filters.value.endDate)
          endDate.setHours(23, 59, 59, 999)
          filtered = filtered.filter(t => {
            if (!t.timestamp) return false
            const date = t.timestamp.toDate ? t.timestamp.toDate() : new Date(t.timestamp)
            return date <= endDate
          })
        }
        
        // Sort by date descending
        return filtered.sort((a, b) => {
          const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0)
          const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0)
          return dateB - dateA
        })
      } catch {
        return []
      }
    })

    // Pagination
    const totalPages = computed(() => {
      return Math.ceil(filteredTransactions.value.length / itemsPerPage.value)
    })

    const startIndex = computed(() => {
      return (currentPage.value - 1) * itemsPerPage.value
    })

    const endIndex = computed(() => {
      return startIndex.value + itemsPerPage.value
    })

    const paginatedTransactions = computed(() => {
      return filteredTransactions.value.slice(startIndex.value, endIndex.value)
    })

    const visiblePages = computed(() => {
      const pages = []
      const maxVisible = 5
      let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
      let end = Math.min(totalPages.value, start + maxVisible - 1)
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    })

    // Methods
    const refreshData = async () => {
      try {
        loading.value = true
        error.value = ''
        await store.dispatch('getRecentTransactions')
      } catch (err) {
        error.value = 'فشل في تحديث البيانات'
        console.error('Error refreshing data:', err)
      } finally {
        loading.value = false
      }
    }

    const exportData = async () => {
      try {
        exporting.value = true
        const data = filteredTransactions.value
        
        if (data.length === 0) {
          error.value = 'لا توجد بيانات للتصدير'
          return
        }

        const headers = ['النوع', 'من', 'إلى', 'الصنف', 'الكمية', 'التاريخ', 'الوقت', 'ملاحظات']
        const csvData = data.map(transaction => [
          getTransactionType(transaction.type),
          getWarehouseLabel(transaction.from_warehouse) || '-',
          getWarehouseLabel(transaction.to_warehouse) || '-',
          transaction.item_name || '-',
          getTotalQuantity(transaction),
          formatDate(transaction.timestamp),
          formatTime(transaction.timestamp),
          transaction.notes || '-'
        ])

        const csvContent = [
          '\uFEFF' + headers.join(','),
          ...csvData.map(row => row.map(field => `"${field}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `حركات_المخزون_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم تصدير ${data.length} حركة بنجاح`
        })
        
      } catch (err) {
        error.value = 'فشل في تصدير الملف'
        console.error('Error exporting data:', err)
      } finally {
        exporting.value = false
      }
    }

    const viewTransactionDetails = (transaction) => {
      selectedTransaction.value = transaction
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    // Watch for filter changes to reset page
    watch(() => [filters.value.search, filters.value.type, filters.value.startDate, filters.value.endDate], () => {
      currentPage.value = 1
    })

    // Lifecycle
    onMounted(() => {
      refreshData()
    })

    return {
      // State
      loading,
      error,
      selectedTransaction,
      filters,
      exporting,
      currentPage,
      
      // Computed
      filteredTransactions,
      paginatedTransactions,
      totalPages,
      startIndex,
      endIndex,
      visiblePages,
      
      // Methods
      getTransactionType,
      getTransactionTypeClass,
      getQuantityClass,
      getTotalQuantity,
      formatDate,
      formatTime,
      formatDateShort,
      getWarehouseLabel,
      handleDateRangeChange,
      refreshData,
      exportData,
      viewTransactionDetails,
      nextPage,
      prevPage
    }
  }
}
</script>

<style scoped>
/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scrollbar styling */
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

/* Mobile touch improvements */
@media (max-width: 768px) {
  button {
    min-height: 44px;
  }
  
  input, 
  select {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

/* Table responsive adjustments */
@media (max-width: 1024px) {
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
  }
}

/* Fix table header and pagination sticking */
.sticky {
  position: sticky;
  z-index: 10;
}

/* Ensure table rows have consistent height */
tr {
  height: 64px;
}

/* Fix modal z-index conflicts */
.fixed {
  isolation: isolate;
}

/* Better mobile card spacing */
@media (max-width: 1024px) {
  .lg\\:hidden > div {
    min-height: 200px;
  }
}

/* Prevent text overflow in table cells */
.whitespace-nowrap {
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Ensure table cells have proper padding */
td, th {
  padding: 0.75rem 1.5rem;
}

/* Fix mobile scrolling */
@media (max-width: 768px) {
  .max-h-\\[calc\\(100vh-300px\\)\\] {
    max-height: calc(100vh - 300px) !important;
  }
}

/* Improve button touch targets on mobile */
button:not(.disabled) {
  cursor: pointer;
}

/* Fix RTL text alignment */
.text-right {
  text-align: right;
}

/* Ensure modal backdrop covers everything */
.absolute.inset-0 {
  z-index: 40;
}

/* Fix modal content z-index */
.relative.w-full.max-w-2xl {
  z-index: 50;
}
</style>
