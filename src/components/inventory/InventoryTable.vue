<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
    <!-- Header Section -->
    <div class="relative overflow-hidden bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 shadow-lg">
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="relative max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div class="text-center lg:text-right">
            <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">
              📊 سجل حركات المخزون
            </h1>
            <p class="text-sm sm:text-base text-white/90 max-w-2xl lg:mr-auto lg:ml-0">
              تتبع كامل لتاريخ جميع الحركات في نظام المخزون
            </p>
          </div>
          
          <div class="flex items-center justify-center lg:justify-start gap-3">
            <button
              @click="refreshData"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <svg :class="['w-4 h-4 ml-2', loading ? 'animate-spin' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ loading ? 'جاري التحديث...' : 'تحديث' }}
            </button>
            
            <button
              @click="exportToExcel"
              :disabled="exporting || !filteredTransactions.length"
              class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="exporting" class="w-4 h-4 ml-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <svg v-else class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              {{ exporting ? 'جاري التصدير...' : 'تصدير Excel' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- Total Transactions -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-orange-100 dark:border-gray-700 p-4 transform hover:-translate-y-1 transition-transform duration-300">
          <div class="flex items-center justify-between mb-3">
            <div class="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <svg class="w-5 h-5 text-orange-500 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <span class="text-xs font-semibold px-2 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
              إجمالي
            </span>
          </div>
          <div class="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {{ totalTransactions.toLocaleString('ar-EG') }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            إجمالي الحركات
          </div>
        </div>

        <!-- Add Transactions -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-green-100 dark:border-gray-700 p-4 transform hover:-translate-y-1 transition-transform duration-300">
          <div class="flex items-center justify-between mb-3">
            <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <svg class="w-5 h-5 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </div>
            <span class="text-xs font-semibold px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
              إضافة
            </span>
          </div>
          <div class="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {{ transactionStats.added.toLocaleString('ar-EG') }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            عملية إضافة
          </div>
        </div>

        <!-- Transfer Transactions -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-blue-100 dark:border-gray-700 p-4 transform hover:-translate-y-1 transition-transform duration-300">
          <div class="flex items-center justify-between mb-3">
            <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <svg class="w-5 h-5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
            </div>
            <span class="text-xs font-semibold px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              نقل
            </span>
          </div>
          <div class="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {{ transactionStats.transferred.toLocaleString('ar-EG') }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            عملية نقل
          </div>
        </div>

        <!-- Dispatch Transactions -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-purple-100 dark:border-gray-700 p-4 transform hover:-translate-y-1 transition-transform duration-300">
          <div class="flex items-center justify-between mb-3">
            <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <svg class="w-5 h-5 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </div>
            <span class="text-xs font-semibold px-2 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
              صرف
            </span>
          </div>
          <div class="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {{ transactionStats.dispatched.toLocaleString('ar-EG') }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            عملية صرف
          </div>
        </div>
      </div>

      <!-- Filters Panel -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-orange-100 dark:border-gray-700 p-4 mb-6">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="lg:col-span-2">
            <label class="block text-sm font-semibold text-orange-600 dark:text-orange-400 mb-2">
              🔍 بحث متقدم
            </label>
            <div class="relative">
              <input
                v-model="filters.search"
                type="text"
                placeholder="ابحث بالاسم، الكود، اللون، أو ملاحظات..."
                class="w-full px-4 py-3 pl-12 bg-gray-50 dark:bg-gray-700 border border-orange-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300"
              >
              <svg class="absolute left-4 top-3.5 w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Transaction Type -->
          <div>
            <label class="block text-sm font-semibold text-orange-600 dark:text-orange-400 mb-2">
              📊 نوع الحركة
            </label>
            <select
              v-model="filters.type"
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-orange-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300"
            >
              <option value="">جميع الأنواع</option>
              <option value="ADD">إضافة</option>
              <option value="TRANSFER">نقل</option>
              <option value="DISPATCH">صرف</option>
            </select>
          </div>

          <!-- Date Range -->
          <div>
            <label class="block text-sm font-semibold text-orange-600 dark:text-orange-400 mb-2">
              📅 الفترة الزمنية
            </label>
            <select
              v-model="filters.dateRange"
              @change="handleDateRangeChange"
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-orange-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300"
            >
              <option value="">الكل</option>
              <option value="today">اليوم</option>
              <option value="week">الأسبوع الماضي</option>
              <option value="month">الشهر الماضي</option>
              <option value="custom">مخصص</option>
            </select>
          </div>
        </div>

        <!-- Custom Date Range -->
        <div v-if="filters.dateRange === 'custom'" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label class="block text-sm text-orange-600 dark:text-orange-400 mb-2">من تاريخ</label>
            <input
              type="date"
              v-model="filters.startDate"
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-orange-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm text-orange-600 dark:text-orange-400 mb-2">إلى تاريخ</label>
            <input
              type="date"
              v-model="filters.endDate"
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-orange-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <!-- Reset Filters Button -->
        <div class="mt-4 pt-4 border-t border-orange-100 dark:border-gray-700">
          <button
            @click="resetFilters"
            class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-medium flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            إعادة تعيين الفلاتر
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400 font-medium">جاري تحميل تاريخ الحركات...</p>
        <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">يرجى الانتظار</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-red-100 dark:bg-red-800 rounded-lg">
              <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-1">حدث خطأ</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ error }}</p>
            </div>
          </div>
          <button @click="error = ''" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Transactions Content -->
      <div v-else>
        <!-- Desktop Table View -->
        <div class="hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-orange-100 dark:border-gray-700 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full min-w-[1000px]">
              <thead class="bg-orange-50 dark:bg-gray-700/50">
                <tr>
                  <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                    الصنف / الصورة
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                    نوع الحركة
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                    من
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                    إلى
                  </th>
                  <th class="px6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                    التفاصيل
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                    الكمية
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                    التاريخ والوقت
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <!-- Empty State -->
                <tr v-if="filteredTransactions.length === 0">
                  <td colspan="8" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center">
                      <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </div>
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">لا توجد حركات</h3>
                      <p class="text-gray-600 dark:text-gray-400 max-w-md">
                        {{ filters.search ? 'لم يتم العثور على حركات مطابقة للبحث' : 'لم يتم تسجيل أي حركات حتى الآن' }}
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Transaction Rows -->
                <tr 
                  v-for="transaction in paginatedTransactions" 
                  :key="transaction.id"
                  class="hover:bg-orange-50/50 dark:hover:bg-gray-700/30 transition-colors duration-150 group"
                >
                  <!-- Item with Photo -->
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-4">
                      <!-- Photo Container -->
                      <div class="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 flex-shrink-0 group-hover:border-orange-300 transition-colors duration-200">
                        <!-- Item Photo from transaction -->
                        <img 
                          v-if="getItemPhoto(transaction)"
                          :src="getItemPhoto(transaction)" 
                          :alt="transaction.item_name"
                          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          @error="handleImageError"
                          loading="lazy"
                        >
                        <!-- Fallback Photo -->
                        <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400/20 to-yellow-400/20">
                          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                        </div>
                      </div>
                      
                      <!-- Item Info -->
                      <div class="min-w-0 flex-1">
                        <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-1 truncate">
                          {{ transaction.item_name || 'غير محدد' }}
                        </h3>
                        <div class="flex items-center gap-2 mb-1">
                          <span class="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                            {{ transaction.item_code || 'بدون كود' }}
                          </span>
                          <span v-if="transaction.item_color" class="text-xs text-gray-600 dark:text-gray-400">
                            {{ transaction.item_color }}
                          </span>
                        </div>
                        <div v-if="transaction.notes" class="text-xs text-gray-500 dark:text-gray-500 line-clamp-1">
                          {{ transaction.notes }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Transaction Type -->
                  <td class="px-6 py-4">
                    <span :class="getTransactionTypeClass(transaction.type)" 
                          class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold">
                      <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="transaction.type === 'ADD'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        <path v-if="transaction.type === 'TRANSFER'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                        <path v-if="transaction.type === 'DISPATCH'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      {{ getTransactionTypeLabel(transaction.type) }}
                    </span>
                  </td>

                  <!-- From Warehouse -->
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 dark:text-white font-medium" :title="transaction.from_warehouse || 'N/A'">
                      {{ getWarehouseLabel(transaction.from_warehouse) || '-' }}
                    </div>
                  </td>

                  <!-- To Warehouse -->
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 dark:text-white font-medium" :title="transaction.to_warehouse || 'N/A'">
                      {{ getWarehouseLabel(transaction.to_warehouse) || '-' }}
                    </div>
                  </td>

                  <!-- Details -->
                  <td class="px-6 py-4">
                    <div class="space-y-1">
                      <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        <span>{{ transaction.user_name || 'مستخدم غير معروف' }}</span>
                      </div>
                      <div v-if="transaction.photo_changed" class="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span>تم تغيير الصورة</span>
                      </div>
                    </div>
                  </td>

                  <!-- Quantity -->
                  <td class="px-6 py-4">
                    <div class="text-center">
                      <div :class="getQuantityClass(transaction.total_delta)" class="text-lg font-bold mb-1">
                        {{ transaction.total_delta > 0 ? '+' : '' }}{{ Math.abs(transaction.total_delta) }}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-500 flex items-center justify-center gap-2">
                        <span class="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                          {{ Math.abs(transaction.cartons_delta) }} × {{ transaction.per_carton_updated }}
                        </span>
                        <span>+</span>
                        <span>{{ Math.abs(transaction.single_delta) }}</span>
                      </div>
                      <div v-if="transaction.new_remaining !== undefined" class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        الرصيد: {{ transaction.new_remaining }}
                      </div>
                    </div>
                  </td>

                  <!-- Date & Time -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">
                      {{ formatDate(transaction.timestamp) }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatTime(transaction.timestamp) }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {{ formatRelativeTime(transaction.timestamp) }}
                    </div>
                  </td>

                  <!-- Actions -->
                  <td class="px-6 py-4">
                    <button
                      @click="viewTransactionDetails(transaction)"
                      class="inline-flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-medium group/btn"
                      title="عرض التفاصيل"
                    >
                      <svg class="w-4 h-4 ml-1 group-hover/btn:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      عرض
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Desktop Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              عرض {{ startIndex + 1 }} - {{ Math.min(endIndex, filteredTransactions.length) }} من {{ filteredTransactions.length }}
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-3 py-1.5 rounded-lg border border-orange-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-50 dark:hover:bg-gray-700 transition-all duration-300 font-medium"
              >
                السابق
              </button>
              <div class="flex items-center gap-1">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    'w-8 h-8 rounded-lg transition-all duration-300 text-sm font-medium',
                    currentPage === page 
                      ? 'bg-yellow-500 text-white border border-yellow-500 shadow-lg' 
                      : 'border border-orange-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700'
                  ]"
                >
                  {{ page }}
                </button>
              </div>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1.5 rounded-lg border border-orange-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-50 dark:hover:bg-gray-700 transition-all duration-300 font-medium"
              >
                التالي
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Cards View -->
        <div class="lg:hidden space-y-4">
          <!-- Empty State Mobile -->
          <div v-if="filteredTransactions.length === 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-orange-100 dark:border-gray-700 p-8 text-center">
            <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4 inline-flex">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">لا توجد حركات</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              {{ filters.search ? 'لم يتم العثور على حركات مطابقة للبحث' : 'لم يتم تسجيل أي حركات حتى الآن' }}
            </p>
            <button
              @click="resetFilters"
              class="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-300 font-medium"
              v-if="filters.search || filters.type"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>

          <!-- Mobile Transaction Cards -->
          <div 
            v-for="transaction in paginatedTransactions" 
            :key="transaction.id"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-orange-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <!-- Card Header -->
            <div class="p-4 border-b border-orange-100 dark:border-gray-700 bg-orange-50 dark:bg-gray-700/50">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <!-- Item Photo -->
                  <div class="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                    <img 
                      v-if="getItemPhoto(transaction)"
                      :src="getItemPhoto(transaction)" 
                      :alt="transaction.item_name"
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                      loading="lazy"
                    >
                    <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400/20 to-yellow-400/20">
                      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-1">
                      {{ transaction.item_name || 'غير محدد' }}
                    </h3>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-mono bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                        {{ transaction.item_code || 'بدون كود' }}
                      </span>
                      <span :class="getTransactionTypeClass(transaction.type, true)" 
                            class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        {{ getTransactionTypeLabel(transaction.type) }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <span class="text-xs text-gray-500 dark:text-gray-500">
                  {{ formatDateShort(transaction.timestamp) }}
                </span>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-4">
              <!-- Warehouses -->
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="space-y-1">
                  <p class="text-xs text-gray-500 dark:text-gray-400">من</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ getWarehouseLabel(transaction.from_warehouse) || '-' }}
                  </p>
                </div>
                <div class="space-y-1">
                  <p class="text-xs text-gray-500 dark:text-gray-400">إلى</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ getWarehouseLabel(transaction.to_warehouse) || '-' }}
                  </p>
                </div>
              </div>

              <!-- Quantity Details -->
              <div class="mb-4">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">تفاصيل الكمية</p>
                <div class="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <div class="text-center">
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">الإجمالي</p>
                    <div :class="getQuantityClass(transaction.total_delta)" class="text-xl font-bold">
                      {{ transaction.total_delta > 0 ? '+' : '' }}{{ Math.abs(transaction.total_delta) }}
                    </div>
                  </div>
                  <div class="text-center">
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">الكراتين</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">
                      {{ Math.abs(transaction.cartons_delta) }} × {{ transaction.per_carton_updated }}
                    </p>
                  </div>
                  <div class="text-center">
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">الفردي</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">
                      {{ Math.abs(transaction.single_delta) }}
                    </p>
                  </div>
                </div>
                <div v-if="transaction.new_remaining !== undefined" class="text-center mt-2">
                  <p class="text-xs text-gray-500 dark:text-gray-400">الرصيد الجديد</p>
                  <p class="text-sm font-bold text-gray-900 dark:text-white">
                    {{ transaction.new_remaining }}
                  </p>
                </div>
              </div>

              <!-- Notes & User -->
              <div class="space-y-2">
                <div v-if="transaction.notes" class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                  <p class="font-medium mb-1">ملاحظات:</p>
                  <p class="text-xs">{{ transaction.notes }}</p>
                </div>
                <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                  <span>{{ transaction.user_name || 'مستخدم غير معروف' }}</span>
                  <span>{{ formatTime(transaction.timestamp) }}</span>
                </div>
              </div>
            </div>

            <!-- Card Footer -->
            <div class="p-4 border-t border-orange-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
              <button
                @click="viewTransactionDetails(transaction)"
                class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white rounded-lg transition-all duration-300 font-medium"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                عرض التفاصيل الكاملة
              </button>
            </div>
          </div>

          <!-- Mobile Pagination -->
          <div v-if="totalPages > 1" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-orange-100 dark:border-gray-700 p-4">
            <div class="flex items-center justify-between">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-4 py-2 rounded-lg border border-orange-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-50 dark:hover:bg-gray-700 transition-all duration-300 font-medium text-sm"
              >
                السابق
              </button>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                صفحة {{ currentPage }} من {{ totalPages }}
              </span>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 rounded-lg border border-orange-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-50 dark:hover:bg-gray-700 transition-all duration-300 font-medium text-sm"
              >
                التالي
              </button>
            </div>
            <div class="text-center text-xs text-gray-500 dark:text-gray-500 mt-2">
              عرض {{ startIndex + 1 }} - {{ Math.min(endIndex, filteredTransactions.length) }} من {{ filteredTransactions.length }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction Details Modal -->
    <div v-if="selectedTransaction" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <!-- Modal Header -->
        <div class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div :class="getTransactionTypeClass(selectedTransaction.type, true)" 
                    class="w-12 h-12 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="selectedTransaction.type === 'ADD'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  <path v-if="selectedTransaction.type === 'TRANSFER'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                  <path v-if="selectedTransaction.type === 'DISPATCH'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">تفاصيل الحركة</h2>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ getTransactionTypeLabel(selectedTransaction.type) }} - {{ selectedTransaction.item_name }}
                </p>
              </div>
            </div>
            <button 
              @click="selectedTransaction = null" 
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Content -->
        <div class="overflow-y-auto p-6" style="max-height: calc(90vh - 140px)">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Column: Item Info -->
            <div class="space-y-6">
              <!-- Item Photo -->
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <div class="flex items-center gap-4 mb-4">
                  <div class="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700">
                    <img 
                      v-if="getItemPhoto(selectedTransaction)"
                      :src="getItemPhoto(selectedTransaction)" 
                      :alt="selectedTransaction.item_name"
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                    >
                    <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400/20 to-yellow-400/20">
                      <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {{ selectedTransaction.item_name }}
                    </h3>
                    <div class="space-y-1">
                      <div class="flex items-center gap-2">
                        <span class="text-sm font-mono bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                          {{ selectedTransaction.item_code || 'بدون كود' }}
                        </span>
                        <span v-if="selectedTransaction.item_color" class="text-sm text-gray-600 dark:text-gray-400">
                          {{ selectedTransaction.item_color }}
                        </span>
                      </div>
                      <div v-if="selectedTransaction.photo_changed" class="flex items-center gap-1 text-sm text-orange-600 dark:text-orange-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span>تم تغيير صورة الصنف</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Warehouses -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">من</p>
                  <p class="text-lg font-bold text-gray-900 dark:text-white">
                    {{ getWarehouseLabel(selectedTransaction.from_warehouse) || '-' }}
                  </p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">إلى</p>
                  <p class="text-lg font-bold text-gray-900 dark:text-white">
                    {{ getWarehouseLabel(selectedTransaction.to_warehouse) || '-' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Right Column: Transaction Details -->
            <div class="space-y-6">
              <!-- Quantity Details -->
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">تفاصيل الكمية</h3>
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="text-center">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">الكراتين</p>
                    <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {{ Math.abs(selectedTransaction.cartons_delta) }}
                    </p>
                  </div>
                  <div class="text-center">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">في الكرتونة</p>
                    <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {{ selectedTransaction.per_carton_updated }}
                    </p>
                  </div>
                  <div class="text-center">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">الفردي</p>
                    <p class="text-2xl font-bold text-green-600 dark:text-green-400">
                      {{ Math.abs(selectedTransaction.single_delta) }}
                    </p>
                  </div>
                  <div class="text-center">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">الإجمالي</p>
                    <div :class="getQuantityClass(selectedTransaction.total_delta)" class="text-2xl font-bold">
                      {{ selectedTransaction.total_delta > 0 ? '+' : '' }}{{ Math.abs(selectedTransaction.total_delta) }}
                    </div>
                  </div>
                </div>
                <div v-if="selectedTransaction.new_remaining !== undefined" class="text-center">
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">الرصيد الجديد بعد الحركة</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ selectedTransaction.new_remaining }}
                  </p>
                </div>
              </div>

              <!-- Date & User -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">التاريخ والوقت</p>
                  <p class="text-gray-900 dark:text-white font-medium">{{ formatDate(selectedTransaction.timestamp) }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatTime(selectedTransaction.timestamp) }}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">المستخدم</p>
                  <p class="text-gray-900 dark:text-white font-medium">{{ selectedTransaction.user_name || 'غير معروف' }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">محرر الحركة</p>
                </div>
              </div>

              <!-- Notes -->
              <div v-if="selectedTransaction.notes" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">ملاحظات</p>
                <p class="text-gray-900 dark:text-white whitespace-pre-wrap">{{ selectedTransaction.notes }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="sticky bottom-0 border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
          <div class="flex justify-end gap-3">
            <button
              @click="selectedTransaction = null"
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-medium"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="exporting" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500 mb-4"></div>
          <p class="text-lg font-semibold text-gray-900 dark:text-white mb-2">جاري تصدير البيانات...</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">يرجى الانتظار</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { utils, writeFile } from 'xlsx';

export default {
  name: 'TransactionHistory',
  
  setup() {
    const store = useStore();
    
    // Reactive state
    const loading = ref(false);
    const error = ref('');
    const selectedTransaction = ref(null);
    const exporting = ref(false);
    const currentPage = ref(1);
    const itemsPerPage = ref(20);
    const filters = ref({
      search: '',
      type: '',
      dateRange: '',
      startDate: '',
      endDate: ''
    });

    // Helper functions
    const getTransactionTypeLabel = (type) => {
      const types = {
        'ADD': 'إضافة',
        'TRANSFER': 'نقل',
        'DISPATCH': 'صرف',
        'UPDATE': 'تحديث',
        'DELETE': 'حذف'
      };
      return types[type] || type;
    };

    const getTransactionTypeClass = (type, isBackground = false) => {
      if (isBackground) {
        const classes = {
          'ADD': 'bg-green-500',
          'TRANSFER': 'bg-blue-500',
          'DISPATCH': 'bg-purple-500',
          'UPDATE': 'bg-yellow-500',
          'DELETE': 'bg-red-500'
        };
        return classes[type] || 'bg-gray-500';
      } else {
        const classes = {
          'ADD': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800',
          'TRANSFER': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
          'DISPATCH': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
          'UPDATE': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800',
          'DELETE': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
        };
        return classes[type] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600';
      }
    };

    const getQuantityClass = (delta) => {
      if (delta > 0) return 'text-green-600 dark:text-green-400';
      if (delta < 0) return 'text-red-600 dark:text-red-400';
      return 'text-gray-600 dark:text-gray-400';
    };

    const formatDate = (timestamp) => {
      if (!timestamp) return '-';
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        if (isNaN(date.getTime())) return '-';
        
        return date.toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      } catch (err) {
        console.error('Error formatting date:', err);
        return '-';
      }
    };

    const formatDateShort = (timestamp) => {
      if (!timestamp) return '-';
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        if (isNaN(date.getTime())) return '-';
        
        return date.toLocaleDateString('ar-EG', {
          month: '2-digit',
          day: '2-digit'
        });
      } catch (err) {
        return '-';
      }
    };

    const formatTime = (timestamp) => {
      if (!timestamp) return '-';
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        if (isNaN(date.getTime())) return '-';
        
        return date.toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      } catch (err) {
        return '-';
      }
    };

    const formatRelativeTime = (timestamp) => {
      if (!timestamp) return '-';
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'الآن';
        if (diffMins < 60) return `قبل ${diffMins} دقيقة`;
        if (diffHours < 24) return `قبل ${diffHours} ساعة`;
        if (diffDays === 1) return 'أمس';
        if (diffDays < 7) return `قبل ${diffDays} أيام`;
        
        return formatDate(date);
      } catch (e) {
        return '-';
      }
    };

    const getWarehouseLabel = (warehouseId) => {
      if (!warehouseId) return '-';
      const label = store.getters.getWarehouseLabel(warehouseId);
      return label || warehouseId;
    };

    // Get item photo from transaction or inventory
    const getItemPhoto = (transaction) => {
      // First check if transaction has photo_url
      if (transaction.photo_url) {
        return transaction.photo_url;
      }
      
      // Try to find item in inventory to get its photo
      if (transaction.item_id) {
        const inventory = store.state.inventory || [];
        const item = inventory.find(item => item.id === transaction.item_id);
        if (item && item.photo_url) {
          return item.photo_url;
        }
      }
      
      return null;
    };

    const handleImageError = (event) => {
      const img = event.target;
      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMTZMNC42ODYgMTUuMzE0QzQuODgyIDExLjUwNyA4LjA5MyA5IDEyIDlDMTUuOTA3IDkgMTkuMTE4IDExLjUwNyAxOS4zMTQgMTUuMzE0TDIwIDE2TTggMjFIMTZNNSAxNEgxOU0xMiAxN0MxMiAxNy41NTIyOCAxMS41NTIzIDE4IDExIDE4QzEwLjQ0NzcgMTggMTAgMTcuNTUyMyAxMCAxN0MxMCAxNi40NDc3IDEwLjQ0NzcgMTYgMTEgMTZDMTEuNTUyMyAxNiAxMiAxNi40NDc3IDEyIDE3WiIgc3Ryb2tlPSI2QjcyOEQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
      img.onerror = null;
    };

    // Date range handler
    const handleDateRangeChange = () => {
      const today = new Date();
      switch (filters.value.dateRange) {
        case 'today':
          filters.value.startDate = today.toISOString().split('T')[0];
          filters.value.endDate = today.toISOString().split('T')[0];
          break;
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          filters.value.startDate = weekAgo.toISOString().split('T')[0];
          filters.value.endDate = today.toISOString().split('T')[0];
          break;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(today.getMonth() - 1);
          filters.value.startDate = monthAgo.toISOString().split('T')[0];
          filters.value.endDate = today.toISOString().split('T')[0];
          break;
        case 'custom':
          // Keep existing dates or clear them
          break;
        default:
          filters.value.startDate = '';
          filters.value.endDate = '';
      }
    };

    // Computed properties
    const transactionsData = computed(() => {
      try {
        return store.state.transactions || [];
      } catch {
        return [];
      }
    });

    const totalTransactions = computed(() => transactionsData.value.length);

    // Transaction statistics
    const transactionStats = computed(() => {
      const trans = transactionsData.value;
      return {
        added: trans.filter(t => t.type === 'ADD').length,
        transferred: trans.filter(t => t.type === 'TRANSFER').length,
        dispatched: trans.filter(t => t.type === 'DISPATCH').length
      };
    });

    // Filter transactions
    const filteredTransactions = computed(() => {
      try {
        let filtered = [...transactionsData.value];
        
        // Type filter
        if (filters.value.type) {
          filtered = filtered.filter(t => t.type === filters.value.type);
        }
        
        // Search filter
        if (filters.value.search) {
          const searchTerm = filters.value.search.toLowerCase();
          filtered = filtered.filter(t => {
            const fromWarehouse = getWarehouseLabel(t.from_warehouse) || '';
            const toWarehouse = getWarehouseLabel(t.to_warehouse) || '';
            const notes = t.notes || '';
            const type = getTransactionTypeLabel(t.type) || '';
            const itemName = t.item_name || '';
            const itemCode = t.item_code || '';
            const userName = t.user_name || '';
            
            return fromWarehouse.toLowerCase().includes(searchTerm) ||
                   toWarehouse.toLowerCase().includes(searchTerm) ||
                   notes.toLowerCase().includes(searchTerm) ||
                   type.toLowerCase().includes(searchTerm) ||
                   itemName.toLowerCase().includes(searchTerm) ||
                   itemCode.toLowerCase().includes(searchTerm) ||
                   userName.toLowerCase().includes(searchTerm);
          });
        }
        
        // Date filter
        if (filters.value.startDate) {
          const startDate = new Date(filters.value.startDate);
          startDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(t => {
            if (!t.timestamp) return false;
            const date = t.timestamp.toDate ? t.timestamp.toDate() : new Date(t.timestamp);
            return date >= startDate;
          });
        }
        
        if (filters.value.endDate) {
          const endDate = new Date(filters.value.endDate);
          endDate.setHours(23, 59, 59, 999);
          filtered = filtered.filter(t => {
            if (!t.timestamp) return false;
            const date = t.timestamp.toDate ? t.timestamp.toDate() : new Date(t.timestamp);
            return date <= endDate;
          });
        }
        
        // Sort by date descending
        return filtered.sort((a, b) => {
          const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
          const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
          return dateB - dateA;
        });
      } catch {
        return [];
      }
    });

    // Pagination
    const totalPages = computed(() => {
      return Math.ceil(filteredTransactions.value.length / itemsPerPage.value);
    });

    const startIndex = computed(() => {
      return (currentPage.value - 1) * itemsPerPage.value;
    });

    const endIndex = computed(() => {
      return startIndex.value + itemsPerPage.value;
    });

    const paginatedTransactions = computed(() => {
      return filteredTransactions.value.slice(startIndex.value, endIndex.value);
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

    // Methods
    const refreshData = async () => {
      try {
        loading.value = true;
        error.value = '';
        await store.dispatch('getRecentTransactions');
      } catch (err) {
        error.value = 'فشل في تحديث البيانات';
        console.error('Error refreshing data:', err);
      } finally {
        loading.value = false;
      }
    };

    const exportToExcel = async () => {
      try {
        exporting.value = true;
        const data = filteredTransactions.value;
        
        if (data.length === 0) {
          error.value = 'لا توجد بيانات للتصدير';
          exporting.value = false;
          return;
        }

        // Prepare Excel data
        const excelData = data.map((transaction, index) => ({
          '#': index + 1,
          'نوع الحركة': getTransactionTypeLabel(transaction.type),
          'اسم الصنف': transaction.item_name || '-',
          'كود الصنف': transaction.item_code || '-',
          'من مخزن': getWarehouseLabel(transaction.from_warehouse) || '-',
          'إلى مخزن': getWarehouseLabel(transaction.to_warehouse) || '-',
          'الكراتين': Math.abs(transaction.cartons_delta),
          'في الكرتونة': transaction.per_carton_updated,
          'الفردي': Math.abs(transaction.single_delta),
          'الكمية الإجمالية': transaction.total_delta > 0 ? `+${Math.abs(transaction.total_delta)}` : `-${Math.abs(transaction.total_delta)}`,
          'الرصيد الجديد': transaction.new_remaining || '-',
          'المستخدم': transaction.user_name || 'غير معروف',
          'التاريخ': formatDate(transaction.timestamp),
          'الوقت': formatTime(transaction.timestamp),
          'ملاحظات': transaction.notes || '-'
        }));

        // Create worksheet
        const ws = utils.json_to_sheet(excelData);
        
        // Create workbook
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'سجل الحركات');
        
        // Generate filename
        const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const filename = `سجل_حركات_المخزون_${timestamp}.xlsx`;
        
        // Write file
        writeFile(wb, filename);
        
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم تصدير ${data.length} حركة بنجاح`
        });
        
      } catch (err) {
        console.error('Error exporting data:', err);
        error.value = 'فشل في تصدير الملف';
        
        store.dispatch('showNotification', {
          type: 'error',
          message: 'فشل في تصدير الملف'
        });
        
      } finally {
        exporting.value = false;
      }
    };

    const viewTransactionDetails = (transaction) => {
      selectedTransaction.value = transaction;
    };

    const resetFilters = () => {
      filters.value = {
        search: '',
        type: '',
        dateRange: '',
        startDate: '',
        endDate: ''
      };
      currentPage.value = 1;
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    // Watch for filter changes to reset page
    watch(() => [filters.value.search, filters.value.type, filters.value.startDate, filters.value.endDate], () => {
      currentPage.value = 1;
    });

    // Lifecycle
    onMounted(() => {
      refreshData();
    });

    return {
      // State
      loading,
      error,
      selectedTransaction,
      filters,
      exporting,
      currentPage,
      
      // Computed
      totalTransactions,
      transactionStats,
      filteredTransactions,
      paginatedTransactions,
      totalPages,
      startIndex,
      endIndex,
      visiblePages,
      
      // Methods
      getTransactionTypeLabel,
      getTransactionTypeClass,
      getQuantityClass,
      formatDate,
      formatDateShort,
      formatTime,
      formatRelativeTime,
      getWarehouseLabel,
      getItemPhoto,
      handleImageError,
      handleDateRangeChange,
      refreshData,
      exportToExcel,
      viewTransactionDetails,
      resetFilters,
      nextPage,
      prevPage
    };
  }
};
</script>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Custom scrollbar */
.table-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(251, 191, 36, 0.5) transparent;
}

.table-scroll::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-scroll::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

.table-scroll::-webkit-scrollbar-thumb {
  background: rgba(251, 191, 36, 0.5);
  border-radius: 4px;
}

.table-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(251, 191, 36, 0.7);
}

.dark .table-scroll::-webkit-scrollbar-thumb {
  background: rgba(251, 191, 36, 0.3);
}

.dark .table-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(251, 191, 36, 0.5);
}

/* Line clamp utility */
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

/* Animation for loading spinner */
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

/* Responsive table */
@media (max-width: 1024px) {
  .table-responsive {
    -webkit-overflow-scrolling: touch;
  }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  button {
    min-height: 44px;
  }
  
  input, 
  select {
    font-size: 16px;
  }
}

/* Hover effects */
.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.dark .hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
}

/* Gradient text for important information */
.gradient-text {
  background: linear-gradient(45deg, #f97316, #fbbf24);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Glass morphism effect */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Smooth image loading */
img {
  transition: transform 0.3s ease;
}

img:hover {
  transform: scale(1.05);
}

/* Table row hover effect */
tr:hover {
  background-color: rgba(254, 215, 170, 0.1);
}

.dark tr:hover {
  background-color: rgba(254, 215, 170, 0.05);
}

/* Card hover effect */
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(249, 115, 22, 0.1), 0 10px 10px -5px rgba(249, 115, 22, 0.04);
}

/* Loading skeleton animation */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.loading-skeleton {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

.dark .loading-skeleton {
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

/* Focus styles for accessibility */
*:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

*:focus-visible {
  outline: 2px solid #f59e0b;
  outline-offset: 2px;
}

.dark *:focus-visible {
  outline-color: #fbbf24;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  .bg-gradient-to-br {
    background: white !important;
  }
  
  .shadow-lg, .shadow-xl, .shadow-2xl {
    box-shadow: none !important;
  }
  
  table {
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
}
</style>
