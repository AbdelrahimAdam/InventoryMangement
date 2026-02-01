<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation Bar -->
    <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Title -->
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">📊 سجل الحركات</h1>
            </div>
          </div>

          <!-- Desktop Controls -->
          <div class="hidden md:flex items-center space-x-4">
            <button 
              @click="toggleLiveUpdates"
              :class="[
                'inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                liveUpdatesEnabled 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              ]"
            >
              <div :class="['w-2 h-2 rounded-full ml-1', liveUpdatesEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400']"></div>
              <span>{{ liveUpdatesEnabled ? 'مباشر' : 'يدوي' }}</span>
            </button>

            <button 
              @click="refreshTransactions"
              :disabled="loading"
              class="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/40 disabled:opacity-50"
            >
              <svg :class="['w-4 h-4 ml-1', loading ? 'animate-spin' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              تحديث
            </button>

            <button 
              v-if="canExport"
              @click="exportTransactions"
              class="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              تصدير Excel
            </button>
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden">
            <button 
              @click="showMobileMenu = !showMobileMenu"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
          <div class="space-y-2 px-2">
            <button 
              @click="toggleLiveUpdates"
              :class="[
                'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium',
                liveUpdatesEnabled 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              ]"
            >
              <span>التحديث المباشر</span>
              <div :class="['w-2 h-2 rounded-full', liveUpdatesEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400']"></div>
            </button>

            <button 
              @click="refreshTransactions"
              :disabled="loading"
              class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/40 disabled:opacity-50"
            >
              <span>تحديث البيانات</span>
              <svg :class="['w-4 h-4', loading ? 'animate-spin' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>

            <button 
              v-if="canExport"
              @click="exportTransactions"
              class="w-full flex items-center justify-between px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <span>تصدير Excel</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="w-full px-4 sm:px-6 lg:px-8 py-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- Total Transactions -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center ml-2">
              <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">إجمالي الحركات</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white english-numbers">{{ formatNumber(transactionStats.total) }}</p>
            </div>
          </div>
        </div>

        <!-- Add Transactions -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-lg bg-green-500 flex items-center justify-center ml-2">
              <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">الإضافات اليوم</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white english-numbers">{{ formatNumber(transactionStats.add) }}</p>
            </div>
          </div>
        </div>

        <!-- Transfer Transactions -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-lg bg-purple-500 flex items-center justify-center ml-2">
              <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">التحويلات اليوم</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white english-numbers">{{ formatNumber(transactionStats.transfer) }}</p>
            </div>
          </div>
        </div>

        <!-- Dispatch Transactions -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-lg bg-red-500 flex items-center justify-center ml-2">
              <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">الصرفيات اليوم</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white english-numbers">{{ formatNumber(transactionStats.dispatch) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              بحث
            </label>
            <div class="relative">
              <input
                type="text"
                v-model="searchTerm"
                @input="handleSearch"
                placeholder="ابحث في الحركات..."
                class="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
              <svg class="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Warehouse -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              المخزن
            </label>
            <select 
              v-model="warehouseFilter"
              @change="handleWarehouseFilter"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">جميع المخازن</option>
              <option 
                v-for="warehouse in accessibleWarehouses" 
                :key="warehouse.id" 
                :value="warehouse.id"
              >
                {{ getWarehouseArabicName(warehouse) }}
              </option>
            </select>
          </div>

          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              نوع الحركة
            </label>
            <select 
              v-model="typeFilter"
              @change="handleFilter"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">الكل</option>
              <option value="ADD">إضافة</option>
              <option value="TRANSFER">تحويل</option>
              <option value="DISPATCH">صرف</option>
              <option value="UPDATE">تحديث</option>
              <option value="DELETE">حذف</option>
            </select>
          </div>

          <!-- Date Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              التاريخ
            </label>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <input 
                  type="date" 
                  v-model="dateFrom"
                  @change="handleDateFilter"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
              </div>
              <div>
                <input 
                  type="date" 
                  v-model="dateTo"
                  @change="handleDateFilter"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Active Filters -->
        <div v-if="hasActiveFilters" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">الفلاتر النشطة:</span>
            
            <button 
              v-if="searchTerm"
              @click="searchTerm = ''"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
            >
              بحث: {{ searchTerm }}
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>

            <button 
              v-if="warehouseFilter"
              @click="warehouseFilter = ''"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300"
            >
              مخزن: {{ getWarehouseArabicName({ id: warehouseFilter }) }}
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>

            <button 
              v-if="typeFilter"
              @click="typeFilter = ''"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
            >
              نوع: {{ getTransactionTypeLabel(typeFilter) }}
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>

            <button 
              v-if="dateFrom || dateTo"
              @click="dateFrom = ''; dateTo = ''"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
            >
              تاريخ: {{ formatDateRange(dateFrom, dateTo) }}
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>

            <button 
              @click="clearFilters"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              إعادة تعيين
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">الحركات</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">إجمالي: {{ formatNumber(filteredTransactions.length) }} حركة</p>
            </div>
            <div class="mt-2 sm:mt-0">
              <div class="text-sm text-gray-500 dark:text-gray-400 english-numbers">
                تم التصفية: {{ filterPercentage }}%
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-700 dark:text-gray-300 font-medium">جاري تحميل البيانات...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-8 text-center">
          <div class="text-red-500 dark:text-red-400 mb-4">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p class="text-gray-700 dark:text-gray-300 font-medium mb-2">حدث خطأ في تحميل البيانات</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ error }}</p>
          <button 
            @click="refreshTransactions"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            إعادة المحاولة
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredTransactions.length === 0" class="p-8 text-center">
          <div class="text-gray-400 dark:text-gray-500 mb-4">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <p class="text-gray-600 dark:text-gray-400 font-medium">لا توجد حركات</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">لم يتم العثور على أي حركات مطابقة للفلاتر</p>
        </div>

        <!-- Transactions List -->
        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <!-- Mobile/Tablet View -->
          <div class="md:hidden">
            <div 
              v-for="transaction in displayedTransactions" 
              :key="'mobile-' + transaction.id"
              class="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <!-- Header -->
              <div class="flex justify-between items-start mb-3">
                <div>
                  <span :class="getTypeBadgeClass(transaction.type)">
                    {{ getTransactionTypeLabel(transaction.type) }}
                  </span>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ formatTransactionDate(transaction) }} - {{ formatTransactionTime(transaction) }}
                  </div>
                </div>
                <div class="text-left">
                  <span :class="getQuantityClass(transaction.type)" class="text-lg font-bold english-numbers">
                    {{ formatNumber(getTransactionQuantity(transaction)) }}
                  </span>
                </div>
              </div>

              <!-- Product Info -->
              <div class="mb-3">
                <div class="font-medium text-gray-900 dark:text-white">
                  {{ transaction.item_name || 'غير محدد' }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  كود: {{ transaction.item_code || 'لا يوجد' }}
                </div>
              </div>

              <!-- Warehouse Info -->
              <div class="mb-3">
                <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المخزن:</div>
                <div v-if="transaction.type === 'TRANSFER'" class="space-y-1">
                  <div class="flex items-center text-sm">
                    <svg class="w-4 h-4 text-red-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                    </svg>
                    <span>{{ getWarehouseArabicName({ id: transaction.from_warehouse || transaction.from_warehouse_id }) }}</span>
                  </div>
                  <div class="flex items-center text-sm">
                    <svg class="w-4 h-4 text-green-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                    </svg>
                    <span>{{ getWarehouseArabicName({ id: transaction.to_warehouse || transaction.to_warehouse_id }) }}</span>
                  </div>
                </div>
                <div v-else-if="transaction.type === 'DISPATCH'" class="space-y-1">
                  <div class="flex items-center text-sm">
                    <svg class="w-4 h-4 text-gray-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                    </svg>
                    <span>{{ getWarehouseArabicName({ id: transaction.from_warehouse || transaction.from_warehouse_id }) }}</span>
                  </div>
                  <div class="flex items-center text-sm text-blue-600 dark:text-blue-400">
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span>{{ getDispatchDestinationName(transaction) }}</span>
                  </div>
                </div>
                <div v-else class="flex items-center text-sm">
                  <svg class="w-4 h-4 text-green-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                  </svg>
                  <span>{{ getWarehouseArabicName({ id: transaction.to_warehouse || transaction.to_warehouse_id }) }}</span>
                </div>
              </div>

              <!-- User Info -->
              <div class="flex items-center">
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
              <div v-if="transaction.notes" class="mt-3">
                <button 
                  @click="showNotes(transaction)"
                  class="w-full text-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                >
                  عرض الملاحظات
                </button>
              </div>
            </div>
          </div>

          <!-- Desktop Table -->
          <div class="hidden md:block overflow-x-visible">
            <table class="w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-750">
                <tr>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider w-32">
                    التاريخ
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider w-24">
                    النوع
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider min-w-48">
                    المنتج
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider w-24">
                    الكمية
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider min-w-40">
                    المخزن
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider min-w-32">
                    المستخدم
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider w-20">
                    ملاحظات
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr 
                  v-for="transaction in displayedTransactions" 
                  :key="'desktop-' + transaction.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <!-- Date -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">
                      {{ formatTransactionDate(transaction) }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatTransactionTime(transaction) }}
                    </div>
                  </td>

                  <!-- Type -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getTypeBadgeClass(transaction.type)">
                      {{ getTransactionTypeLabel(transaction.type) }}
                    </span>
                  </td>

                  <!-- Product -->
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ transaction.item_name || 'غير محدد' }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ transaction.item_code || 'لا يوجد كود' }}
                    </div>
                  </td>

                  <!-- Quantity -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getQuantityClass(transaction.type)" class="english-numbers">
                      {{ formatNumber(getTransactionQuantity(transaction)) }}
                    </span>
                  </td>

                  <!-- Warehouse -->
                  <td class="px-6 py-4">
                    <div v-if="transaction.type === 'TRANSFER'" class="space-y-1">
                      <div class="flex items-center text-sm">
                        <svg class="w-4 h-4 text-red-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                        </svg>
                        <span>{{ getWarehouseArabicName({ id: transaction.from_warehouse || transaction.from_warehouse_id }) }}</span>
                      </div>
                      <div class="flex items-center text-sm">
                        <svg class="w-4 h-4 text-green-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                        </svg>
                        <span>{{ getWarehouseArabicName({ id: transaction.to_warehouse || transaction.to_warehouse_id }) }}</span>
                      </div>
                    </div>
                    <div v-else-if="transaction.type === 'DISPATCH'" class="space-y-1">
                      <div class="flex items-center text-sm">
                        <svg class="w-4 h-4 text-gray-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                        </svg>
                        <span>{{ getWarehouseArabicName({ id: transaction.from_warehouse || transaction.from_warehouse_id }) }}</span>
                      </div>
                      <div class="flex items-center text-sm text-blue-600 dark:text-blue-400">
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span>{{ getDispatchDestinationName(transaction) }}</span>
                      </div>
                    </div>
                    <div v-else class="flex items-center text-sm">
                      <svg class="w-4 h-4 text-green-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                      </svg>
                      <span>{{ getWarehouseArabicName({ id: transaction.to_warehouse || transaction.to_warehouse_id }) }}</span>
                    </div>
                  </td>

                  <!-- User -->
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ transaction.created_by || transaction.user_name || 'مستخدم غير معروف' }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ getUserRoleLabel(transaction.user_role) }}
                    </div>
                  </td>

                  <!-- Notes -->
                  <td class="px-6 py-4">
                    <div v-if="transaction.notes" class="relative">
                      <button 
                        @click="showNotes(transaction)"
                        class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        عرض
                      </button>
                    </div>
                    <span v-else class="text-xs text-gray-400">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="hasMore" class="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <button 
            @click="loadMoreTransactions"
            :disabled="loadingMore"
            class="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <svg v-if="loadingMore" class="w-4 h-4 ml-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span>{{ loadingMore ? 'جاري التحميل...' : 'تحميل المزيد' }}</span>
          </button>
        </div>
      </div>

      <!-- Info Footer -->
      <div class="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p class="english-numbers">عرض {{ displayedTransactions.length }} من {{ filteredTransactions.length }} حركة</p>
      </div>
    </main>

    <!-- Notes Modal -->
    <div v-if="selectedNotes" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full max-h-[80vh] overflow-hidden">
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
import { debounce } from 'lodash';

// Configuration
const TRANSACTION_CONFIG = {
  INITIAL_LOAD: 50,
  LOAD_MORE_BATCH: 20,
  SEARCH_DEBOUNCE: 500,
  MAX_DISPLAY: 100,
  MIN_SEARCH_CHARS: 2
};

// Arabic months for date formatting
const arabicMonths = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

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
    const selectedNotes = ref(null);
    const showMobileMenu = ref(false);
    const loadingMore = ref(false);
    const transactionsRef = ref(null);
    const lastVisibleDoc = ref(null);
    const allTransactionsLoaded = ref(false);
    
    // Use Vuex state and getters
    const userRole = computed(() => store.getters.userRole);
    const canExport = computed(() => {
      return userRole.value === 'superadmin' || userRole.value === 'company_manager';
    });
    
    // Store data
    const loading = computed(() => store.state.transactionsLoading);
    const error = computed(() => store.state.inventoryError);
    const allTransactions = computed(() => store.state.transactions || []);
    const transactionStats = computed(() => store.getters.getTransactionStats || {
      total: 0,
      today: 0,
      add: 0,
      transfer: 0,
      dispatch: 0,
      lastUpdated: null
    });
    
    const accessibleWarehouses = computed(() => store.getters.accessibleWarehouses);
    
    // Loaded transactions count
    const loadedCount = computed(() => allTransactions.value.length);
    
    // Check if search is active
    const isSearchActive = computed(() => {
      return searchTerm.value.length >= TRANSACTION_CONFIG.MIN_SEARCH_CHARS || 
             typeFilter.value || 
             warehouseFilter.value || 
             dateFrom.value || 
             dateTo.value;
    });

    // Filter transactions using store getter - إضافة فلتر المخزن
    const filteredTransactions = computed(() => {
      return store.getters.filteredTransactions({
        search: searchTerm.value,
        type: typeFilter.value,
        warehouse: warehouseFilter.value, // إضافة فلتر المخزن
        dateFrom: dateFrom.value,
        dateTo: dateTo.value
      });
    });

    // Display paginated transactions
    const displayedTransactions = computed(() => {
      if (isSearchActive.value) {
        return filteredTransactions.value.slice(0, TRANSACTION_CONFIG.MAX_DISPLAY);
      }
      return filteredTransactions.value.slice(0, TRANSACTION_CONFIG.INITIAL_LOAD);
    });
    
    const hasActiveFilters = computed(() => {
      return searchTerm.value || typeFilter.value || warehouseFilter.value || dateFrom.value || dateTo.value;
    });
    
    const filterPercentage = computed(() => {
      if (allTransactions.value.length === 0) return 0;
      const percentage = Math.round((displayedTransactions.value.length / allTransactions.value.length) * 100);
      return Math.min(100, percentage);
    });

    // Check if more transactions can be loaded
    const hasMore = computed(() => {
      return !allTransactionsLoaded.value && 
             !isSearchActive.value && 
             !loadingMore.value &&
             displayedTransactions.value.length < filteredTransactions.value.length;
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

    // Use store getters for warehouse and user info
    const getWarehouseArabicName = (warehouse) => {
      return store.getters.getWarehouseArabicName(warehouse?.id, warehouse);
    };
    
    const getDispatchDestinationName = (transaction) => {
      return store.getters.getDispatchDestinationName(transaction);
    };
    
    const getTransactionTypeLabel = (type) => {
      return store.getters.getTransactionTypeLabel(type);
    };
    
    const getUserRoleLabel = (role) => {
      return store.getters.getUserRoleLabel(role);
    };

    // Methods
    const formatNumber = (num) => {
      if (num === undefined || num === null) return '0';
      return new Intl.NumberFormat('en-US').format(num);
    };
    
    const getTypeBadgeClass = (type) => {
      const classes = {
        'ADD': 'inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
        'TRANSFER': 'inline-flex px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
        'DISPATCH': 'inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
        'UPDATE': 'inline-flex px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
        'DELETE': 'inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
      };
      return classes[type] || 'inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    };
    
    const getQuantityClass = (type) => {
      const classes = {
        'ADD': 'text-green-600 dark:text-green-400 font-medium',
        'TRANSFER': 'text-purple-600 dark:text-purple-400 font-medium',
        'DISPATCH': 'text-red-600 dark:text-red-400 font-medium'
      };
      return classes[type] || 'text-gray-700 dark:text-gray-300 font-medium';
    };
    
    // Helper function to get transaction quantity from various property names
    const getTransactionQuantity = (transaction) => {
      const quantity = 
        transaction.quantity || 
        transaction.qty || 
        transaction.total_delta || 
        transaction.total_quantity || 
        transaction.delta_quantity || 
        0;
      
      // For DISPATCH type, show negative value
      if (transaction.type === 'DISPATCH' && quantity > 0) {
        return -Math.abs(quantity);
      }
      
      // For ADD type, ensure positive
      if (transaction.type === 'ADD' && quantity < 0) {
        return Math.abs(quantity);
      }
      
      return quantity;
    };
    
    // Date formatting functions
    const formatTransactionDate = (transaction) => {
      const date = getTransactionTime(transaction);
      const day = date.getDate();
      const month = arabicMonths[date.getMonth()];
      
      return `${day} ${month}`;
    };
    
    const formatTransactionTime = (transaction) => {
      const date = getTransactionTime(transaction);
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'مساءً' : 'صباحاً';
      const displayHours = hours % 12 || 12;
      
      return `${displayHours}:${minutes} ${ampm}`;
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
      // Filtering is handled by computed property
    }, TRANSACTION_CONFIG.SEARCH_DEBOUNCE);
    
    const handleFilter = () => {
      // Filtering is handled by computed property
    };
    
    const handleWarehouseFilter = () => {
      // Filtering is handled by computed property
      // يمكنك إضافة أي منطق إضافي هنا إذا لزم الأمر
      console.log('Warehouse filter changed to:', warehouseFilter.value);
    };

    const handleDateFilter = () => {
      // Filtering is handled by computed property
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

    // Load more transactions
    const loadMoreTransactions = async () => {
      if (loadingMore.value || allTransactionsLoaded.value || isSearchActive.value) {
        return;
      }

      loadingMore.value = true;
      
      try {
        // Use store action to load more
        await store.dispatch('loadMoreTransactions');
      } catch (error) {
        console.error('❌ خطأ في تحميل المزيد من الحركات:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ أثناء تحميل المزيد من الحركات'
        });
      } finally {
        loadingMore.value = false;
      }
    };

    // Refresh transactions using store action
    const refreshTransactions = async () => {
      try {
        await store.dispatch('fetchTransactions');
        
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
          message: 'تم إوقف التحديث المباشر'
        });
      }
    };

    // Export transactions to Excel
    const exportTransactions = () => {
      try {
        const wb = XLSX.utils.book_new();
        
        const exportData = filteredTransactions.value.map(transaction => {
          const quantity = getTransactionQuantity(transaction);
          const fromWarehouseId = transaction.from_warehouse || transaction.from_warehouse_id;
          const toWarehouseId = transaction.to_warehouse || transaction.to_warehouse_id;
          
          return {
            'التاريخ': formatTransactionDate(transaction),
            'الوقت': formatTransactionTime(transaction),
            'نوع الحركة': getTransactionTypeLabel(transaction.type),
            'اسم المنتج': transaction.item_name || '',
            'كود المنتج': transaction.item_code || '',
            'الكمية': quantity,
            'من مستودع': getWarehouseArabicName({ id: fromWarehouseId }),
            'إلى مستودع': getWarehouseArabicName({ id: toWarehouseId }),
            'الوجهة': transaction.type === 'DISPATCH' ? getDispatchDestinationName(transaction) : '',
            'المستخدم': transaction.created_by || transaction.user_name || '',
            'دور المستخدم': getUserRoleLabel(transaction.user_role),
            'ملاحظات': transaction.notes || ''
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
      }
    };

    // Setup real-time transactions listener
    const setupRealtimeTransactions = () => {
      if (!liveUpdatesEnabled.value) return;

      try {
        // Use store action to setup real-time updates
        store.dispatch('setupRealtimeTransactions');
      } catch (error) {
        console.error('Error setting up real-time transactions:', error);
      }
    };

    // Initial data load
    const loadInitialData = async () => {
      try {
        // Load warehouses if not already loaded
        if (!store.state.warehousesLoaded) {
          await store.dispatch('loadWarehousesEnhanced');
        }
        
        // Load initial transactions
        await store.dispatch('fetchTransactions');
        
        // Enable real-time updates by default
        setupRealtimeTransactions();
        
      } catch (error) {
        console.error('Error loading initial data:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ أثناء تحميل البيانات'
        });
      }
    };

    // Watch for filter changes
    watch([searchTerm, typeFilter, warehouseFilter, dateFrom, dateTo], () => {
      // Filtering is handled by computed property
    });
    
    onMounted(() => {
      loadInitialData();
    });
    
    onUnmounted(() => {
      // Cleanup
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
      selectedNotes,
      showMobileMenu,
      loadingMore,
      
      // Computed
      displayedTransactions,
      filteredTransactions,
      canExport,
      hasActiveFilters,
      filterPercentage,
      loading,
      error,
      transactionStats,
      accessibleWarehouses,
      loadedCount,
      hasMore,
      isSearchActive,
      
      // Methods
      formatNumber,
      getTransactionTypeLabel,
      getTypeBadgeClass,
      getQuantityClass,
      getUserRoleLabel,
      getWarehouseArabicName,
      getDispatchDestinationName,
      formatTransactionDate,
      formatTransactionTime,
      formatDateRange,
      handleSearch,
      handleFilter,
      handleWarehouseFilter,
      handleDateFilter,
      clearFilters,
      refreshTransactions,
      toggleLiveUpdates,
      exportTransactions,
      getTransactionQuantity,
      showNotes,
      loadMoreTransactions
    };
  }
};
</script>

<style scoped>
/* RTL Support */
[dir="rtl"] {
  text-align: right;
}

/* English numbers styling */
.english-numbers {
  font-feature-settings: "lnum";
  font-variant-numeric: lining-nums;
  direction: ltr;
  display: inline-block;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

/* Responsive table */
@media (max-width: 767px) {
  .table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .mobile-padding {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  
  .mobile-text-sm {
    font-size: 0.875rem;
  }
  
  .mobile-text-xs {
    font-size: 0.75rem;
  }
}

/* Dark mode optimizations */
.dark .hover\:bg-gray-750:hover {
  background-color: rgba(55, 65, 81, 0.5);
}

/* Smooth transitions */
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

/* Ensure table takes full width */
table {
  min-width: 100%;
  table-layout: fixed;
}

/* On large screens, ensure proper spacing */
@media (min-width: 1024px) {
  .lg\:px-8 {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
</style>
