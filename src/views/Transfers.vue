<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Navigation -->
          <div class="flex items-center space-x-4 space-x-reverse">
            <router-link to="/" class="flex items-center space-x-2 space-x-reverse hover:opacity-80 transition-opacity">
              <div class="h-8 w-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">م</span>
              </div>
              <div>
                <h1 class="text-lg font-bold text-gray-900 dark:text-white">نقل المخزون</h1>
                <p class="text-xs text-gray-500 dark:text-gray-400">نظام المخزون</p>
              </div>
            </router-link>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-3 space-x-reverse">
            <button 
              v-if="canTransfer"
              @click="showTransferModal = true"
              :disabled="loading"
              class="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
              <span class="hidden sm:inline">نقل جديد</span>
              <span class="inline sm:hidden">نقل</span>
            </button>
            
            <router-link 
              to="/inventory" 
              class="inline-flex items-center px-3 sm:px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 min-h-[44px]"
            >
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              <span class="hidden sm:inline">المخزون</span>
              <span class="inline sm:hidden">مخزن</span>
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div class="flex items-center">
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center ml-2 sm:ml-4">
              <svg class="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">إجمالي النقل</p>
              <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(stats.totalTransfers) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div class="flex items-center">
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center ml-2 sm:ml-4">
              <svg class="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">مكتمل</p>
              <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(stats.completed) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div class="flex items-center">
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center ml-2 sm:ml-4">
              <svg class="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">قيد الانتظار</p>
              <p class="text-xl sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ formatNumber(stats.pending) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div class="flex items-center">
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center ml-2 sm:ml-4">
              <svg class="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">إجمالي القيمة</p>
              <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(stats.totalValue) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="w-full">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3">تصفية النتائج</h2>
            <div class="flex flex-wrap gap-2 sm:gap-4">
              <div class="relative flex-1 min-w-[140px]">
                <input 
                  type="date" 
                  v-model="filters.dateFrom"
                  class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
                >
                <label class="absolute -top-2 right-2 px-1 text-xs bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  من تاريخ
                </label>
              </div>
              
              <div class="relative flex-1 min-w-[140px]">
                <input 
                  type="date" 
                  v-model="filters.dateTo"
                  class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
                >
                <label class="absolute -top-2 right-2 px-1 text-xs bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  إلى تاريخ
                </label>
              </div>
              
              <select v-model="filters.status" class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px] min-w-[120px]">
                <option value="">جميع الحالات</option>
                <option value="pending">قيد الانتظار</option>
                <option value="approved">مقبول</option>
                <option value="completed">مكتمل</option>
                <option value="rejected">مرفوض</option>
              </select>
              
              <select v-model="filters.sourceWarehouse" class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px] min-w-[120px]">
                <option value="">المخزن المصدر</option>
                <option v-for="warehouse in accessibleWarehouses" :key="warehouse.id" :value="warehouse.id">
                  {{ warehouse.name_ar }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="flex gap-2 sm:gap-3 mt-2 sm:mt-0">
            <button @click="refreshData" class="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
            
            <button @click="exportData" class="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm min-h-[44px]" :disabled="filteredTransfers.length === 0">
              <svg class="w-5 h-5 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span class="hidden sm:inline">تصدير</span>
              <span class="inline sm:hidden">تصدير</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Transfers Table -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">سجل النقل</h2>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">جميع عمليات النقل المسجلة في النظام</p>
            </div>
            <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              إجمالي {{ formatNumber(filteredTransfers.length) }} عملية نقل
            </div>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-700 dark:text-gray-300 text-sm">جاري تحميل البيانات...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredTransfers.length === 0" class="p-6 sm:p-8 text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
            <svg class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
          </div>
          <h3 class="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">لا توجد عمليات نقل</h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">
            {{ hasFilters ? 'لا توجد عمليات نقل تطابق التصفية المحددة' : 'لم يتم تسجيل أي عمليات نقل حتى الآن' }}
          </p>
          <button 
            v-if="canTransfer"
            @click="showTransferModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm min-h-[44px]"
          >
            إنشاء أول نقل
          </button>
        </div>

        <!-- Desktop Table View -->
        <div v-else class="hidden lg:block">
          <div class="w-full overflow-x-auto">
            <div class="min-w-full inline-block align-middle">
              <!-- Fixed Header -->
              <div class="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div class="grid grid-cols-12 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <div class="col-span-2 p-3 text-right">رقم النقل</div>
                  <div class="col-span-2 p-3 text-right">التاريخ</div>
                  <div class="col-span-2 p-3 text-right">من مخزن</div>
                  <div class="col-span-2 p-3 text-right">إلى مخزن</div>
                  <div class="col-span-1 p-3 text-right">الكمية</div>
                  <div class="col-span-1 p-3 text-right">الحالة</div>
                  <div class="col-span-2 p-3 text-right">الإجراءات</div>
                </div>
              </div>

              <!-- Scrollable Body -->
              <div class="max-h-[calc(100vh-400px)] overflow-y-auto">
                <div class="divide-y divide-gray-200 dark:divide-gray-700">
                  <div 
                    v-for="transfer in paginatedTransfers" 
                    :key="transfer.id" 
                    class="grid grid-cols-12 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
                  >
                    <!-- Transfer ID -->
                    <div class="col-span-2 p-3 text-sm font-medium text-gray-900 dark:text-white">
                      #{{ transfer.id?.substring(0, 8) || 'N/A' }}
                    </div>
                    
                    <!-- Date -->
                    <div class="col-span-2 p-3">
                      <div class="text-sm text-gray-900 dark:text-white">{{ formatDate(transfer.timestamp) }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(transfer.timestamp) }}</div>
                    </div>
                    
                    <!-- Source Warehouse -->
                    <div class="col-span-2 p-3 text-sm text-gray-900 dark:text-white truncate">
                      {{ getWarehouseLabel(transfer.from_warehouse) }}
                    </div>
                    
                    <!-- Destination Warehouse -->
                    <div class="col-span-2 p-3 text-sm text-gray-900 dark:text-white truncate">
                      {{ getWarehouseLabel(transfer.to_warehouse) }}
                    </div>
                    
                    <!-- Quantity -->
                    <div class="col-span-1 p-3">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                        {{ formatNumber(Math.abs(transfer.total_delta)) }}
                      </span>
                    </div>
                    
                    <!-- Status -->
                    <div class="col-span-1 p-3">
                      <span :class="getStatusBadgeClass(transfer.status)">
                        {{ getStatusText(transfer.status) }}
                      </span>
                    </div>
                    
                    <!-- Actions -->
                    <div class="col-span-2 p-3">
                      <div class="flex items-center space-x-2 space-x-reverse">
                        <button 
                          @click="viewTransferDetails(transfer)"
                          class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="عرض التفاصيل"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        </button>
                        <button 
                          v-if="canApprove(transfer)"
                          @click="approveTransfer(transfer)"
                          class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="قبول النقل"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                        </button>
                        <button 
                          v-if="canReject(transfer)"
                          @click="rejectTransfer(transfer)"
                          class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="رفض النقل"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
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
        <div v-else class="lg:hidden">
          <div class="max-h-[calc(100vh-400px)] overflow-y-auto p-2 sm:p-4">
            <div class="space-y-3">
              <div 
                v-for="transfer in paginatedTransfers" 
                :key="transfer.id" 
                class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-150"
              >
                <!-- Header -->
                <div class="flex justify-between items-start mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                  <div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">#{{ transfer.id?.substring(0, 6) || 'N/A' }}</div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(transfer.timestamp) }} - {{ formatTime(transfer.timestamp) }}</div>
                  </div>
                  <span :class="getStatusBadgeClass(transfer.status)">
                    {{ getStatusText(transfer.status) }}
                  </span>
                </div>
                
                <!-- Details Grid -->
                <div class="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">من مخزن</div>
                    <div class="font-medium text-gray-900 dark:text-white">{{ getWarehouseLabel(transfer.from_warehouse) }}</div>
                  </div>
                  <div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">إلى مخزن</div>
                    <div class="font-medium text-gray-900 dark:text-white">{{ getWarehouseLabel(transfer.to_warehouse) }}</div>
                  </div>
                  <div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">الكمية</div>
                    <div class="font-medium text-gray-900 dark:text-white">{{ formatNumber(Math.abs(transfer.total_delta)) }}</div>
                  </div>
                  <div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">المنتقل</div>
                    <div class="font-medium text-gray-900 dark:text-white">{{ transfer.item_name }}</div>
                  </div>
                </div>
                
                <!-- Actions -->
                <div class="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ transfer.item_code }}
                  </div>
                  <div class="flex items-center space-x-3 space-x-reverse">
                    <button 
                      @click="viewTransferDetails(transfer)"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-xs sm:text-sm flex items-center"
                    >
                      <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      تفاصيل
                    </button>
                    <button 
                      v-if="canApprove(transfer)"
                      @click="approveTransfer(transfer)"
                      class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-xs sm:text-sm flex items-center"
                    >
                      <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      قبول
                    </button>
                    <button 
                      v-if="canReject(transfer)"
                      @click="rejectTransfer(transfer)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-xs sm:text-sm flex items-center"
                    >
                      <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                      رفض
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div v-if="filteredTransfers.length > 0 && totalPages > 1" class="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-right">
              عرض <span class="font-medium">{{ startIndex + 1 }}</span> إلى 
              <span class="font-medium">{{ Math.min(endIndex, filteredTransfers.length) }}</span> من 
              <span class="font-medium">{{ filteredTransfers.length }}</span> نتيجة
            </div>
            
            <div class="flex items-center justify-center space-x-2">
              <button 
                @click="prevPage" 
                :disabled="currentPage === 1"
                class="px-3 py-1.5 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[36px] min-w-[80px]"
              >
                السابق
              </button>
              
              <div class="flex items-center space-x-1">
                <button 
                  v-for="page in visiblePages" 
                  :key="page"
                  @click="goToPage(page)"
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm"
                  :class="page === currentPage 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
                >
                  {{ page }}
                </button>
              </div>
              
              <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages"
                class="px-3 py-1.5 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[36px] min-w-[80px]"
              >
                التالي
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Transfer Modal -->
    <TransferModal 
      v-if="showTransferModal"
      :isOpen="showTransferModal"
      @close="showTransferModal = false"
      @success="handleTransferCreated"
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
import TransferModal from '@/components/inventory/TransferModal.vue';

export default {
  name: 'Transfers',
  components: {
    TransferModal
  },
  setup() {
    const store = useStore();
    
    const loading = ref(false);
    const showTransferModal = ref(false);
    
    // Pagination
    const currentPage = ref(1);
    const itemsPerPage = 10;
    
    // Filters
    const filters = ref({
      dateFrom: '',
      dateTo: '',
      status: '',
      sourceWarehouse: '',
      search: ''
    });
    
    // Stats
    const stats = ref({
      totalTransfers: 0,
      completed: 0,
      pending: 0,
      totalValue: 0
    });
    
    // Computed properties from store
    const userRole = computed(() => store.getters.userRole);
    const userName = computed(() => store.getters.userName);
    const userProfile = computed(() => store.state.userProfile);
    const allTransactions = computed(() => store.state.transactions || []);
    const allWarehouses = computed(() => store.state.warehouses || []);
    
    // Check permissions
    const canTransfer = computed(() => {
      if (!userProfile.value) return false;
      if (userRole.value === 'superadmin') return true;
      if (userRole.value === 'warehouse_manager') {
        return userProfile.value.permissions?.includes('full_access') || 
               userProfile.value.permissions?.includes('transfer_items');
      }
      return false;
    });
    
    const canExport = computed(() => {
      return userRole.value === 'superadmin' || userRole.value === 'company_manager';
    });
    
    // Accessible warehouses based on role
    const accessibleWarehouses = computed(() => {
      if (!allWarehouses.value) return [];
      
      if (userRole.value === 'superadmin') {
        return allWarehouses.value.filter(w => w.type === 'primary');
      }
      
      if (userRole.value === 'warehouse_manager') {
        const allowedWarehouses = userProfile.value?.allowed_warehouses || [];
        if (allowedWarehouses.length === 0) return [];
        
        if (allowedWarehouses.includes('all')) {
          return allWarehouses.value.filter(w => w.type === 'primary');
        }
        
        return allWarehouses.value.filter(w => 
          w.type === 'primary' && allowedWarehouses.includes(w.id)
        );
      }
      
      if (userRole.value === 'company_manager') {
        return allWarehouses.value.filter(w => w.type === 'primary');
      }
      
      return [];
    });
    
    // Get transfer transactions (type = 'TRANSFER')
    const transfers = computed(() => {
      return (allTransactions.value || []).filter(t => t.type === 'TRANSFER');
    });
    
    // Filtered transfers
    const filteredTransfers = computed(() => {
      let filtered = [...transfers.value];
      
      // Filter by date
      if (filters.value.dateFrom) {
        const dateFrom = new Date(filters.value.dateFrom);
        filtered = filtered.filter(transfer => {
          try {
            const transferDate = transfer.timestamp?.toDate ? transfer.timestamp.toDate() : new Date(transfer.timestamp);
            return transferDate >= dateFrom;
          } catch (error) {
            return false;
          }
        });
      }
      
      if (filters.value.dateTo) {
        const dateTo = new Date(filters.value.dateTo);
        dateTo.setHours(23, 59, 59, 999);
        filtered = filtered.filter(transfer => {
          try {
            const transferDate = transfer.timestamp?.toDate ? transfer.timestamp.toDate() : new Date(transfer.timestamp);
            return transferDate <= dateTo;
          } catch (error) {
            return false;
          }
        });
      }
      
      // Filter by status
      if (filters.value.status) {
        filtered = filtered.filter(transfer => transfer.status === filters.value.status);
      }
      
      // Filter by source warehouse
      if (filters.value.sourceWarehouse) {
        filtered = filtered.filter(transfer => 
          transfer.from_warehouse === filters.value.sourceWarehouse
        );
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
    
    // Calculate stats
    const calculateStats = () => {
      stats.value.totalTransfers = transfers.value.length;
      stats.value.completed = transfers.value.filter(t => t.status === 'completed' || !t.status).length;
      stats.value.pending = transfers.value.filter(t => t.status === 'pending').length;
      
      // Calculate total value (assuming average value per item)
      const averageValuePerItem = 50;
      stats.value.totalValue = transfers.value.reduce((sum, transfer) => {
        const quantity = Math.abs(transfer.total_delta || 0);
        return sum + (quantity * averageValuePerItem);
      }, 0);
    };
    
    // Pagination computed
    const totalTransfers = computed(() => filteredTransfers.value.length);
    const totalPages = computed(() => Math.ceil(totalTransfers.value / itemsPerPage));
    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
    const endIndex = computed(() => startIndex.value + itemsPerPage);
    const paginatedTransfers = computed(() => 
      filteredTransfers.value.slice(startIndex.value, endIndex.value)
    );
    
    const hasFilters = computed(() => {
      return filters.value.dateFrom || filters.value.dateTo || 
             filters.value.status || filters.value.sourceWarehouse;
    });
    
    const visiblePages = computed(() => {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
      let end = Math.min(totalPages.value, start + maxVisible - 1);
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
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
    
    const getWarehouseLabel = (warehouseId) => {
      if (!warehouseId) return '';
      const warehouse = allWarehouses.value.find(w => w.id === warehouseId);
      return warehouse ? warehouse.name_ar : warehouseId;
    };
    
    const getStatusText = (status) => {
      const statusMap = {
        pending: 'قيد الانتظار',
        approved: 'مقبول',
        completed: 'مكتمل',
        rejected: 'مرفوض'
      };
      return statusMap[status] || 'مكتمل';
    };
    
    const getStatusBadgeClass = (status) => {
      const classes = {
        pending: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        approved: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        completed: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        rejected: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      };
      return classes[status] || 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    };
    
    const canApprove = (transfer) => {
      return userRole.value === 'superadmin' && transfer.status === 'pending';
    };
    
    const canReject = (transfer) => {
      return userRole.value === 'superadmin' && transfer.status === 'pending';
    };
    
    // Actions
    const loadData = async () => {
      loading.value = true;
      try {
        console.log('Loading transfers data...');
        
        // Wait for store to load data
        if (allTransactions.value.length === 0) {
          console.log('Waiting for store data to load...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Calculate stats
        calculateStats();
        
        console.log(`Loaded ${transfers.value.length} transfers`);
        
      } catch (error) {
        console.error('Error loading data:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تحميل البيانات'
        });
      } finally {
        loading.value = false;
      }
    };
    
    const refreshData = () => {
      currentPage.value = 1;
      loadData();
    };
    
    const exportData = async () => {
      try {
        loading.value = true;
        
        const exportData = filteredTransfers.value.map(transfer => ({
          'رقم النقل': transfer.id?.substring(0, 8) || '',
          'التاريخ': formatDate(transfer.timestamp),
          'الوقت': formatTime(transfer.timestamp),
          'اسم الصنف': transfer.item_name || '',
          'كود الصنف': transfer.item_code || '',
          'الكمية': Math.abs(transfer.total_delta || 0),
          'من مخزن': getWarehouseLabel(transfer.from_warehouse),
          'إلى مخزن': getWarehouseLabel(transfer.to_warehouse),
          'الحالة': getStatusText(transfer.status),
          'ملاحظات': transfer.notes || ''
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
          { wch: 12 },
          { wch: 12 },
          { wch: 10 },
          { wch: 25 },
          { wch: 15 },
          { wch: 10 },
          { wch: 20 },
          { wch: 20 },
          { wch: 15 },
          { wch: 30 }
        ];
        ws['!cols'] = wscols;
        
        XLSX.utils.book_append_sheet(wb, ws, 'عمليات النقل');
        
        const filename = `عمليات_النقل_${new Date().toISOString().split('T')[0]}.xlsx`;
        
        XLSX.writeFile(wb, filename);
        
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم تصدير ${exportData.length} عملية نقل بنجاح`
        });
        
      } catch (error) {
        console.error('Error exporting data:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تصدير البيانات'
        });
      } finally {
        loading.value = false;
      }
    };
    
    const viewTransferDetails = (transfer) => {
      alert(`تفاصيل النقل:\n\nالصنف: ${transfer.item_name}\nالكمية: ${Math.abs(transfer.total_delta)}\nمن: ${getWarehouseLabel(transfer.from_warehouse)}\nإلى: ${getWarehouseLabel(transfer.to_warehouse)}\nالحالة: ${getStatusText(transfer.status)}\nالتاريخ: ${formatDate(transfer.timestamp)} ${formatTime(transfer.timestamp)}`);
    };
    
    const approveTransfer = async (transfer) => {
      if (!confirm('هل أنت متأكد من قبول هذا النقل؟')) return;
      
      try {
        // Update transfer status in store
        await store.dispatch('approveTransfer', transfer.id);
        
        store.dispatch('showNotification', {
          type: 'success',
          message: 'تم قبول النقل بنجاح'
        });
        
        loadData();
      } catch (error) {
        console.error('Error approving transfer:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في قبول النقل'
        });
      }
    };
    
    const rejectTransfer = async (transfer) => {
      if (!confirm('هل أنت متأكد من رفض هذا النقل؟')) return;
      
      try {
        // Update transfer status in store
        await store.dispatch('rejectTransfer', transfer.id);
        
        store.dispatch('showNotification', {
          type: 'success',
          message: 'تم رفض النقل بنجاح'
        });
        
        loadData();
      } catch (error) {
        console.error('Error rejecting transfer:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في رفض النقل'
        });
      }
    };
    
    const handleTransferCreated = () => {
      showTransferModal.value = false;
      
      store.dispatch('showNotification', {
        type: 'success',
        message: 'تم إنشاء النقل بنجاح'
      });
      
      // Refresh data
      loadData();
      currentPage.value = 1;
    };
    
    // Pagination methods
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };
    
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };
    
    const goToPage = (page) => {
      currentPage.value = page;
    };
    
    // Watch filters for changes
    watch(filters, () => {
      currentPage.value = 1;
    }, { deep: true });
    
    // Watch store data for changes
    watch(() => allTransactions.value, () => {
      console.log('Transactions updated, recalculating stats...');
      calculateStats();
    }, { deep: true });
    
    // Lifecycle
    onMounted(() => {
      console.log('Transfers page mounted');
      
      // Check permissions
      if (!canTransfer.value) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية للوصول إلى صفحة النقل'
        });
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
        return;
      }
      
      // Load initial data
      loadData();
    });
    
    return {
      // State
      loading,
      showTransferModal,
      filters,
      stats,
      currentPage,
      
      // Computed
      userName,
      userRole,
      canTransfer,
      canExport,
      accessibleWarehouses,
      transfers,
      filteredTransfers,
      paginatedTransfers,
      totalTransfers,
      totalPages,
      startIndex,
      endIndex,
      hasFilters,
      visiblePages,
      
      // Methods
      formatNumber,
      formatCurrency,
      formatDate,
      formatTime,
      getWarehouseLabel,
      getStatusText,
      getStatusBadgeClass,
      canApprove,
      canReject,
      refreshData,
      exportData,
      viewTransferDetails,
      approveTransfer,
      rejectTransfer,
      handleTransferCreated,
      prevPage,
      nextPage,
      goToPage
    };
  }
};
</script>

<style scoped>
/* Custom styles for RTL support */
.space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

/* Fixed header for desktop table */
.sticky {
  position: sticky;
  z-index: 10;
}

/* Scrollable table body */
.max-h-\[calc\(100vh-400px\)\] {
  max-height: calc(100vh - 400px);
  overflow-y: auto;
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

/* Loading animation */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
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

/* Ensure modal backdrop has proper z-index */
.fixed.inset-0 {
  z-index: 9999;
}

/* Responsive text sizes */
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
}

/* Grid column responsiveness for desktop table */
@media (min-width: 1024px) {
  .grid-cols-12 > .col-span-1 {
    grid-column: span 1 / span 1;
  }
  
  .grid-cols-12 > .col-span-2 {
    grid-column: span 2 / span 2;
  }
}

/* Text truncation for table cells */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Smooth transitions */
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-shadow {
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Scrollbar styling */
.max-h-\[calc\(100vh-400px\)\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-\[calc\(100vh-400px\)\]::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.max-h-\[calc\(100vh-400px\)\]::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.max-h-\[calc\(100vh-400px\)\]::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.dark .max-h-\[calc\(100vh-400px\)\]::-webkit-scrollbar-track {
  background: #374151;
}

.dark .max-h-\[calc\(100vh-400px\)\]::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark .max-h-\[calc\(100vh-400px\)\]::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Card hover effects for mobile view */
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
