<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 pb-16 sm:pb-0">
    <!-- Header - Enhanced for Mobile -->
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="w-full px-3 sm:px-4 lg:px-6">
        <div class="flex justify-between items-center h-14 sm:h-16">
          <!-- Logo and Title - Mobile Optimized -->
          <div class="flex items-center space-x-2 space-x-reverse">
            <router-link to="/" class="flex items-center space-x-2 space-x-reverse hover:opacity-80 transition-opacity">
              <div class="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-xs sm:text-sm">م</span>
              </div>
              <div class="hidden sm:block">
                <h1 class="text-lg font-bold text-gray-900 dark:text-white">صرف المخزون</h1>
                <p class="text-xs text-gray-500 dark:text-gray-400">نظام إدارة المخزون والفواتير</p>
              </div>
              <div class="sm:hidden">
                <h1 class="text-sm font-bold text-gray-900 dark:text-white">صرف المخزون</h1>
              </div>
            </router-link>
          </div>

          <!-- User Actions - Mobile Optimized -->
          <div class="flex items-center space-x-2 space-x-reverse">
            <!-- User Info - Desktop Only -->
            <div class="hidden md:flex items-center space-x-2 space-x-reverse text-sm">
              <span class="text-gray-600 dark:text-gray-300">{{ userName }}</span>
              <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-xs">
                {{ userRole }}
              </span>
            </div>

            <!-- Buttons - Mobile Optimized -->
            <div class="flex items-center space-x-1 sm:space-x-2 space-x-reverse">
              <!-- Inventory Button - Icon only on mobile -->
              <router-link 
                to="/inventory" 
                class="inline-flex items-center p-2 sm:px-4 sm:py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                :title="'المخزون'"
              >
                <svg class="w-4 h-4 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
                <span class="hidden sm:inline">المخزون</span>
              </router-link>

              <!-- Invoice System Toggle Button - Mobile Optimized -->
              <button 
                @click="toggleInvoiceSystem"
                :class="[
                  'inline-flex items-center p-2 sm:px-4 sm:py-2 text-sm font-medium rounded-lg transition-colors duration-200 whitespace-nowrap',
                  showInvoiceSystem 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                    : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600'
                ]"
                style="display: inline-flex !important;"
              >
                <svg class="w-4 h-4 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span class="hidden sm:inline">{{ showInvoiceSystem ? 'العودة للصرف' : 'نظام الفواتير' }}</span>
                <span class="sm:hidden">{{ showInvoiceSystem ? 'عودة' : 'فواتير' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="w-full px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
      <!-- ============================================ -->
      <!-- INVOICE SYSTEM SECTION (When toggled ON) - MOBILE OPTIMIZED -->
      <!-- ============================================ -->
      <div v-if="showInvoiceSystem">
        <!-- Invoice System Header - Mobile Optimized -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h2 class="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">نظام الفواتير الضريبية</h2>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">نظام فواتير متوافق مع مصلحة الضرائب المصرية</p>
            </div>

            <!-- Action Buttons - Stacked on Mobile -->
            <div class="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
              <button @click="createNewInvoice" class="btn-primary flex-1 sm:flex-none">
                <svg class="w-4 h-4 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span class="whitespace-nowrap">فاتورة جديدة</span>
              </button>
              <button @click="exportInvoicesToExcel" :disabled="invoices.length === 0" class="btn-secondary flex-1 sm:flex-none">
                <svg class="w-4 h-4 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span class="hidden sm:inline">تصدير Excel</span>
                <span class="sm:hidden">Excel</span>
              </button>
              <button @click="exportToPDF" :disabled="invoices.length === 0" class="btn-success flex-1 sm:flex-none">
                <svg class="w-4 h-4 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span class="hidden sm:inline">تصدير PDF</span>
                <span class="sm:hidden">PDF</span>
              </button>
            </div>
          </div>

          <!-- Quick Stats - Responsive Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div class="stat-card">
              <div class="stat-icon bg-blue-100 dark:bg-blue-900">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">إجمالي الفواتير</p>
                <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{{ totalInvoices }}</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon bg-green-100 dark:bg-green-900">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">إجمالي المبيعات</p>
                <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(totalSales) }}</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon bg-yellow-100 dark:bg-yellow-900">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">العملاء</p>
                <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{{ uniqueCustomers }}</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon bg-purple-100 dark:bg-purple-900">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <div>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">الضريبة</p>
                <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(totalTax) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Invoice Creation/Editing Form - MOBILE OPTIMIZED -->
        <div v-if="showInvoiceForm" class="invoice-form-container bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-4 sm:mb-6 max-w-full mx-auto">
          <!-- Form Header - Mobile Optimized -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 z-10 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="min-w-0 flex-1">
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {{ editingInvoice ? 'تعديل فاتورة #' + editingInvoice.invoiceNumber : 'إنشاء فاتورة جديدة' }}
                </h3>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">املأ بيانات الفاتورة وإضافة الأصناف</p>
              </div>
              <button @click="cancelInvoiceForm" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 flex-shrink-0 ml-2">
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Main Form Content - Mobile Optimized -->
          <div class="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(100vh-180px)]">
            <!-- Step 1: Invoice Type and Customer Information - Fixed Width -->
            <div>
              <h4 class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center">
                <span class="h-5 w-5 sm:h-6 sm:w-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-xs ml-1 sm:ml-2">1</span>
                <span class="truncate">معلومات الفاتورة والعميل</span>
              </h4>
              
              <div class="invoice-form-grid max-w-4xl mx-auto">
                <!-- Invoice Type -->
                <div class="lg:col-span-2 form-field-full">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">نوع الفاتورة *</label>
                  <select v-model="invoiceForm.type" @change="onInvoiceTypeChange" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white max-w-full">
                    <option value="B2B">فاتورة ضريبية (B2B) - نشاط تجاري</option>
                    <option value="B2C">فاتورة ضريبية (B2C) - مستهلك نهائي</option>
                    <option value="simplified">فاتورة مبسطة</option>
                  </select>
                </div>

                <!-- Payment Method -->
                <div class="form-field-container">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">طريقة الدفع *</label>
                  <select v-model="invoiceForm.paymentMethod" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white max-w-full">
                    <option value="cash">نقدي</option>
                    <option value="bank">تحويل بنكي</option>
                    <option value="check">شيك</option>
                    <option value="credit">آجل</option>
                  </select>
                </div>

                <!-- Customer Name -->
                <div class="form-field-container">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">اسم العميل *</label>
                  <input v-model="invoiceForm.customer.name" type="text" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white max-w-full" placeholder="اسم العميل الكامل" required>
                </div>

                <!-- Customer Phone -->
                <div class="form-field-container">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">رقم الهاتف *</label>
                  <input v-model="invoiceForm.customer.phone" type="tel" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white max-w-full" placeholder="01XXXXXXXXX" required>
                </div>

                <!-- Tax ID (for B2B only) -->
                <div v-if="invoiceForm.type === 'B2B'" class="lg:col-span-2 form-field-full">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">الرقم الضريبي *</label>
                  <input v-model="invoiceForm.customer.taxId" type="text" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white max-w-full" placeholder="الرقم الضريبي (14 رقم)" pattern="[0-9]{14}" required>
                </div>

                <!-- Customer Address -->
                <div class="lg:col-span-2 form-field-full">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">العنوان</label>
                  <input v-model="invoiceForm.customer.address" type="text" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white max-w-full" placeholder="عنوان العميل">
                </div>

                <!-- Notes -->
                <div class="lg:col-span-2 form-field-full">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">ملاحظات</label>
                  <textarea v-model="invoiceForm.notes" rows="2" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white max-w-full" placeholder="ملاحظات إضافية..."></textarea>
                </div>
              </div>
            </div>

            <!-- Step 2: Warehouse Selection - Optimized -->
            <div>
              <h4 class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center">
                <span class="h-5 w-5 sm:h-6 sm:w-6 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center text-xs ml-1 sm:ml-2">2</span>
                اختر المخزن
              </h4>
              
              <div class="warehouse-select-container max-w-4xl mx-auto">
                <select 
                  v-model="selectedWarehouseForInvoice" 
                  @change="loadWarehouseItems" 
                  class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white max-w-full" 
                  required
                  :disabled="availableWarehouses.length === 0"
                >
                  <option value="">اختر مخزن</option>
                  <option 
                    v-for="warehouse in availableWarehouses" 
                    :key="warehouse.id" 
                    :value="warehouse.id"
                  >
                    {{ warehouse.name_ar }}
                  </option>
                </select>
                
                <!-- Warehouse Info -->
                <div v-if="selectedWarehouseForInvoice" class="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 sm:gap-2">
                  <span>المخزن: {{ getWarehouseLabel(selectedWarehouseForInvoice) }}</span>
                  <span v-if="totalItemsInWarehouse > 0" class="text-green-600 dark:text-green-400">
                    ({{ totalItemsInWarehouse }} صنف متاح)
                  </span>
                </div>
                
                <!-- Error message if no warehouses available -->
                <div v-if="availableWarehouses.length === 0" class="mt-2 text-xs px-2 sm:px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 rounded-full inline-flex items-center">
                  <svg class="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                  ليس لديك صلاحية للوصول إلى أي مخزن
                </div>
              </div>
            </div>

            <!-- Step 3: Add Items - Mobile Optimized with SPARK Search -->
            <div>
              <div class="flex items-center justify-between mb-2 sm:mb-3">
                <h4 class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <span class="h-5 w-5 sm:h-6 sm:w-6 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 rounded-full flex items-center justify-center text-xs ml-1 sm:ml-2">3</span>
                  إضافة الأصناف للفاتورة
                </h4>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ filteredSearchResults.length }} صنف متطابق
                </div>
              </div>

              <!-- Search Items - Enhanced with SPARK Search System -->
              <div class="relative mb-3 sm:mb-4 max-w-4xl mx-auto">
                <input 
                  v-model="itemSearch" 
                  @input="debouncedSearchItems"
                  type="text" 
                  class="search-input"
                  placeholder="ابحث عن صنف بالاسم، الكود، اللون، المورد، المخزن..."
                  :disabled="!selectedWarehouseForInvoice"
                >
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg class="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                <div v-if="searchingItems" class="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <div class="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              </div>

              <!-- Search Stats and Source -->
              <div v-if="itemSearch.trim() && filteredSearchResults.length > 0" class="search-stats-container max-w-4xl mx-auto">
                <span>🔍 بحث: "{{ itemSearch }}"</span>
                <span>•</span>
                <span>تم العثور على {{ filteredSearchResults.length }} صنف</span>
                <span v-if="lastSearchSource" class="flex items-center gap-1">
                  • <span class="search-source-badge">
                    {{ getSearchSourceLabel(lastSearchSource) }}
                  </span>
                </span>
                <span v-if="searchingItems" class="flex items-center gap-1">
                  • <span class="animate-pulse text-blue-500">جاري البحث...</span>
                </span>
              </div>

              <!-- Available Items Grid - Enhanced with SPARK Search -->
              <div v-if="filteredSearchResults.length > 0" class="search-results-grid max-w-6xl mx-auto">
                <div 
                  v-for="item in filteredSearchResults" 
                  :key="item.id"
                  @click="addItemToInvoice(item)"
                  class="search-result-card"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <!-- Item Name and Code -->
                      <div class="flex items-start gap-2">
                        <p class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">{{ item.name }}</p>
                        <span v-if="item.code" class="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full flex-shrink-0">
                          {{ item.code }}
                        </span>
                      </div>
                      
                      <!-- Item Details -->
                      <div class="mt-2 flex items-center flex-wrap gap-1">
                        <span :class="['text-xs px-1.5 sm:px-2 py-0.5 rounded', getQuantityClass(item.remaining_quantity)]">
                          {{ formatNumber(item.remaining_quantity) }} متبقي
                        </span>
                        <span class="text-xs text-blue-600 dark:text-blue-400 font-medium truncate">
                          السعر: {{ formatCurrency(item.sale_price || item.unitPrice || 0) }}
                        </span>
                      </div>
                      
                      <!-- Warehouse and Additional Details -->
                      <div v-if="item.warehouse_id || item.color || item.supplier" class="mt-2 flex items-center flex-wrap gap-1">
                        <span v-if="item.warehouse_id" class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded truncate">
                          {{ getWarehouseLabel(item.warehouse_id) }}
                        </span>
                        <span v-if="item.color" class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                          {{ item.color }}
                        </span>
                        <span v-if="item.supplier" class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded truncate">
                          {{ item.supplier }}
                        </span>
                      </div>
                    </div>
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Search Results Empty State -->
              <div v-else-if="itemSearch.trim() && !searchingItems" class="search-empty-state max-w-4xl mx-auto">
                <svg class="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1M9 7h6"/>
                </svg>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 sm:mt-3">لا توجد أصناف مطابقة</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  لم يتم العثور على أصناف تطابق "{{ itemSearch }}"
                </p>
                <div class="mt-3 text-xs text-gray-500 dark:text-gray-400 text-right">
                  <p class="font-medium mb-1">جرب البحث بـ:</p>
                  <ul class="space-y-1">
                    <li>• الاسم: {{ itemSearch }} الأحمر</li>
                    <li>• الكود: INV-{{ itemSearch.toUpperCase() }}</li>
                    <li>• المورد: {{ itemSearch }}</li>
                    <li>• المخزن: {{ getWarehouseLabel(selectedWarehouseForInvoice) }}</li>
                  </ul>
                </div>
              </div>

              <!-- Please Select Warehouse -->
              <div v-else-if="!selectedWarehouseForInvoice" class="search-empty-state max-w-4xl mx-auto">
                <svg class="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 sm:mt-3">اختر مخزن أولاً</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  يرجى اختيار مخزن لعرض الأصناف المتاحة
                </p>
              </div>

              <!-- Empty Warehouse -->
              <div v-else-if="selectedWarehouseForInvoice && filteredSearchResults.length === 0 && !itemSearch.trim()" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 sm:p-6 text-center max-w-4xl mx-auto">
                <svg class="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-yellow-400 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1M9 7h6"/>
                </svg>
                <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-300 mt-2 sm:mt-3">المخزن فارغ</h4>
                <p class="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  لا توجد أصناف متاحة في مخزن {{ getWarehouseLabel(selectedWarehouseForInvoice) }}
                </p>
                <div class="mt-3">
                  <button @click="searchAllWarehouses = !searchAllWarehouses" class="text-xs px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                    {{ searchAllWarehouses ? 'البحث في المخزن الحالي فقط' : 'البحث في جميع المخازن' }}
                  </button>
                </div>
              </div>

              <!-- Search Tips -->
              <div v-if="!itemSearch.trim() && selectedWarehouseForInvoice" class="search-tips-container max-w-4xl mx-auto">
                <p class="search-tips-title">💡 نصائح البحث:</p>
                <ul class="search-tips-list">
                  <li class="search-tip-item">• ابحث بالاسم، الكود، اللون، المورد، أو المخزن</li>
                  <li class="search-tip-item">• البحث يدعم اللغة العربية والإنجليزية</li>
                  <li class="search-tip-item">• أدخل 2 أحرف على الأقل للبدء</li>
                  <li class="search-tip-item">• البحث الذكي يتطابق مع أي جزء من الاسم</li>
                  <li v-if="searchAllWarehouses" class="search-tip-item search-tip-highlight">
                    • البحث حالياً يشمل جميع المخازن
                  </li>
                </ul>
              </div>
            </div>

            <!-- Selected Items Section - Mobile Optimized -->
            <div v-if="invoiceForm.items.length > 0">
              <h4 class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center">
                <span class="h-5 w-5 sm:h-6 sm:w-6 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full flex items-center justify-center text-xs ml-1 sm:ml-2">4</span>
                الأصناف المحددة
                <span class="text-xs text-gray-500 dark:text-gray-400 mr-1 sm:mr-2">({{ invoiceForm.items.length }} صنف)</span>
              </h4>

              <!-- Selected Items Table - Mobile Optimized -->
              <div class="selected-items-container border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden max-w-full mx-auto">
                <!-- Table Header - Hidden on Mobile, Card View Instead -->
                <div class="hidden sm:grid sm:grid-cols-12 bg-gray-50 dark:bg-gray-900 text-xs font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <div class="col-span-4 p-3">الصنف</div>
                  <div class="col-span-2 p-3 text-center">السعر</div>
                  <div class="col-span-2 p-3 text-center">الكمية</div>
                  <div class="col-span-2 p-3 text-center">الخصم %</div>
                  <div class="col-span-2 p-3 text-center">الإجراءات</div>
                </div>

                <!-- Table Body - Mobile Card View -->
                <div class="max-h-60 overflow-y-auto p-1 sm:p-0">
                  <!-- Mobile Card View -->
                  <div class="sm:hidden space-y-2">
                    <div
                      v-for="(item, index) in invoiceForm.items"
                      :key="item.id"
                      class="selected-item-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-3"
                    >
                      <!-- Item Header -->
                      <div class="flex justify-between items-start mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ item.name }}</p>
                          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{{ item.code }}</p>
                          <div v-if="item.warehouseId" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            المخزن: {{ getWarehouseLabel(item.warehouseId) }}
                          </div>
                        </div>
                        <button @click="removeItem(index)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-2 flex-shrink-0">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>

                      <!-- Carton Info -->
                      <div v-if="item.per_carton_count > 1" class="mb-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                        {{ item.cartons_count || 0 }} كرتون + {{ item.single_bottles_count || 0 }} فردي
                        ({{ item.per_carton_count }} لكل كرتون)
                      </div>

                      <!-- Carton Control -->
                      <div v-if="item.per_carton_count > 1" class="mb-3">
                        <div class="flex justify-between items-center">
                          <span class="text-xs text-gray-500 dark:text-gray-400">التحكم بالكرتون:</span>
                          <div class="flex items-center space-x-1 space-x-reverse">
                            <button @click="decreaseCarton(index)" 
                              class="w-6 h-6 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs"
                              :disabled="item.cartons_count <= 0">
                              -
                            </button>
                            <span class="text-xs px-2">{{ item.cartons_count || 0 }} كرتون</span>
                            <button @click="increaseCarton(index)" 
                              class="w-6 h-6 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs"
                              :disabled="(item.cartons_count + 1) * item.per_carton_count + item.single_bottles_count > item.maxQuantity">
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- Item Controls - Mobile Optimized -->
                      <div class="grid grid-cols-2 gap-3 text-sm">
                        <!-- Price -->
                        <div>
                          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">السعر</label>
                          <input 
                            v-model.number="item.unitPrice" 
                            type="number" 
                            min="0" 
                            step="0.01"
                            @change="updateItemTotal(index)"
                            class="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          >
                        </div>

                        <!-- Quantity -->
                        <div>
                          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">الكمية</label>
                          <div class="flex items-center space-x-1 space-x-reverse">
                            <button @click="decreaseQuantity(index)" 
                              class="w-7 h-7 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                              :disabled="item.quantity <= 1">
                              -
                            </button>
                            <input 
                              v-model.number="item.quantity" 
                              type="number" 
                              min="1" 
                              :max="item.maxQuantity"
                              @change="validateItemQuantity(index)"
                              class="flex-1 px-2 py-1.5 border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm text-center focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                            <button @click="increaseQuantity(index)" 
                              class="w-7 h-7 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                              :disabled="item.quantity >= item.maxQuantity">
                              +
                            </button>
                          </div>
                          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                            متوفر: {{ formatNumber(item.maxQuantity) }}
                          </div>
                        </div>

                        <!-- Discount -->
                        <div>
                          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">الخصم %</label>
                          <input 
                            v-model.number="item.discount" 
                            type="number" 
                            min="0" 
                            max="100"
                            step="0.1"
                            @change="updateItemTotal(index)"
                            class="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          >
                          <div v-if="item.discount > 0" class="text-xs text-red-600 dark:text-red-400 mt-1 text-center">
                            خصم {{ item.discount }}%
                          </div>
                        </div>

                        <!-- Total -->
                        <div>
                          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">الإجمالي</label>
                          <div class="text-sm font-medium text-gray-900 dark:text-white text-center">
                            {{ formatCurrency(item.total || 0) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Desktop Table View -->
                  <div class="hidden sm:block">
                    <div
                      v-for="(item, index) in invoiceForm.items"
                      :key="item.id"
                      class="dispatch-table-row grid grid-cols-12 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    >
                      <!-- Item Name and Details -->
                      <div class="col-span-4 p-3">
                        <div class="font-medium text-sm text-gray-900 dark:text-white truncate">{{ item.name }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{{ item.code }}</div>
                        <div v-if="item.warehouseId" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          المخزن: {{ getWarehouseLabel(item.warehouseId) }}
                        </div>
                        <!-- Carton Info for Desktop -->
                        <div v-if="item.per_carton_count > 1" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {{ item.cartons_count || 0 }} كرتون + {{ item.single_bottles_count || 0 }} فردي
                          ({{ item.per_carton_count }} لكل كرتون)
                        </div>
                      </div>

                      <!-- Unit Price -->
                      <div class="col-span-2 p-3">
                        <input 
                          v-model.number="item.unitPrice" 
                          type="number" 
                          min="0" 
                          step="0.01"
                          @change="updateItemTotal(index)"
                          class="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm text-center focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                      </div>

                      <!-- Quantity -->
                      <div class="col-span-2 p-3">
                        <div class="flex items-center justify-center space-x-2 space-x-reverse">
                          <button @click="decreaseQuantity(index)" 
                            class="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            :disabled="item.quantity <= 1">
                            -
                          </button>
                          <input 
                            v-model.number="item.quantity" 
                            type="number" 
                            min="1" 
                            :max="item.maxQuantity"
                            @change="validateItemQuantity(index)"
                            class="w-16 px-2 py-1.5 border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm text-center focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          >
                          <button @click="increaseQuantity(index)" 
                            class="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            :disabled="item.quantity >= item.maxQuantity">
                            +
                          </button>
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                          متوفر: {{ formatNumber(item.maxQuantity) }}
                        </div>
                        <!-- Carton Control for Desktop -->
                        <div v-if="item.per_carton_count > 1" class="mt-2 flex justify-center items-center space-x-1 space-x-reverse">
                          <button @click="decreaseCarton(index)" 
                            class="w-6 h-6 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs"
                            :disabled="item.cartons_count <= 0">
                            -
                          </button>
                          <span class="text-xs px-2">{{ item.cartons_count || 0 }} كرتون</span>
                          <button @click="increaseCarton(index)" 
                            class="w-6 h-6 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs"
                            :disabled="(item.cartons_count + 1) * item.per_carton_count + item.single_bottles_count > item.maxQuantity">
                            +
                          </button>
                        </div>
                      </div>

                      <!-- Discount -->
                      <div class="col-span-2 p-3">
                        <input 
                          v-model.number="item.discount" 
                          type="number" 
                          min="0" 
                          max="100"
                          step="0.1"
                          @change="updateItemTotal(index)"
                          class="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm text-center focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                        <div v-if="item.discount > 0" class="text-xs text-red-600 dark:text-red-400 mt-1 text-center">
                          خصم {{ item.discount }}%
                        </div>
                      </div>

                      <!-- Actions -->
                      <div class="col-span-2 p-3 text-center">
                        <button @click="removeItem(index)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Items Total -->
                <div class="bg-gray-50 dark:bg-gray-800 p-3 border-t border-gray-200 dark:border-gray-700">
                  <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-600 dark:text-gray-400">إجمالي الأصناف:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(subtotal) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 5: Invoice Summary - Mobile Optimized -->
            <div v-if="invoiceForm.items.length > 0">
              <h4 class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center">
                <span class="h-5 w-5 sm:h-6 sm:w-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center text-xs ml-1 sm:ml-2">5</span>
                ملخص الفاتورة
              </h4>

              <div class="invoice-summary-card max-w-4xl mx-auto">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <!-- Invoice Details -->
                  <div>
                    <h5 class="text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-300 mb-2 sm:mb-4">تفاصيل الفاتورة</h5>
                    <div class="space-y-2 sm:space-y-3">
                      <div class="flex justify-between">
                        <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">عدد الأصناف:</span>
                        <span class="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{{ invoiceForm.items.length }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">إجمالي الكميات:</span>
                        <span class="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{{ totalQuantity }}</span>
                      </div>
                      <div v-if="hasCartonItems" class="flex justify-between">
                        <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">إجمالي الكراتين:</span>
                        <span class="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{{ totalCartons }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">المخزن:</span>
                        <span class="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">{{ getWarehouseLabel(selectedWarehouseForInvoice) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">طريقة الدفع:</span>
                        <span class="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                          {{ invoiceForm.paymentMethod === 'cash' ? 'نقدي' : 
                             invoiceForm.paymentMethod === 'bank' ? 'تحويل بنكي' : 
                             invoiceForm.paymentMethod === 'check' ? 'شيك' : 'آجل' }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Invoice Totals -->
                  <div>
                    <h5 class="text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-300 mb-2 sm:mb-4">الحسابات</h5>
                    <div class="space-y-2 sm:space-y-3">
                      <div class="flex justify-between">
                        <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">المجموع:</span>
                        <span class="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{{ formatCurrency(subtotal) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">الخصم:</span>
                        <span class="text-sm sm:text-base font-medium text-red-600 dark:text-red-400">-{{ formatCurrency(totalDiscount) }}</span>
                      </div>
                      <div v-if="invoiceForm.type === 'B2B' || invoiceForm.type === 'B2C'" class="flex justify-between">
                        <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">الضريبة (14%):</span>
                        <span class="text-sm sm:text-base font-medium text-gray-900 dark:text-white">+{{ formatCurrency(taxAmount) }}</span>
                      </div>
                      <div class="flex justify-between pt-2 sm:pt-3 border-t border-blue-200 dark:border-blue-700">
                        <span class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">الإجمالي النهائي:</span>
                        <span class="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">{{ formatCurrency(totalAmount) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Items Selected Message -->
            <div v-else class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 sm:p-6 text-center max-w-4xl mx-auto">
              <svg class="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-yellow-400 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-300 mt-2 sm:mt-3">لم يتم إضافة أصناف</h4>
              <p class="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                يرجى إضافة أصناف للفاتورة قبل المتابعة
              </p>
            </div>
          </div>

          <!-- Fixed Footer - Mobile Optimized -->
          <div class="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 z-20">
            <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 space-x-reverse">
              <button
                type="button"
                @click="cancelInvoiceForm"
                :disabled="saving"
                class="order-2 sm:order-1 px-4 py-2.5 sm:flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                @click="saveAndPrint"
                :disabled="!canSaveInvoice || saving"
                :class="[
                  'order-1 sm:order-2 px-4 py-2.5 sm:flex-1 text-sm font-medium text-white rounded-lg transition-all duration-200 flex items-center justify-center',
                  (!canSaveInvoice || saving)
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 dark:from-purple-600 dark:to-indigo-700 dark:hover:from-purple-700 dark:hover:to-indigo-800'
                ]"
              >
                <svg v-if="saving" class="animate-spin h-4 w-4 ml-2 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                </svg>
                <span>{{ saving ? 'جاري الحفظ...' : 'حفظ وطباعة' }}</span>
              </button>
              <button
                type="submit"
                @click="saveInvoice"
                :disabled="!canSaveInvoice || saving"
                :class="[
                  'order-3 px-4 py-2.5 sm:flex-1 text-sm font-medium text-white rounded-lg transition-all duration-200 flex items-center justify-center',
                  (!canSaveInvoice || saving)
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-600 dark:to-emerald-700 dark:hover:from-green-700 dark:hover:to-emerald-800'
                ]"
              >
                <svg v-if="saving" class="animate-spin h-4 w-4 ml-2 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>{{ saving ? 'جاري الحفظ...' : 'حفظ الفاتورة' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Invoices List (When not in create/edit mode) - Mobile Optimized -->
        <div v-if="!showInvoiceForm" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <!-- List Header with Filters - Mobile Optimized -->
          <div class="p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div>
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">الفواتير المسجلة</h3>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">إجمالي {{ filteredInvoices.length }} فاتورة</p>
              </div>

              <!-- Filters - Stacked on Mobile -->
              <div class="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
                <div class="relative flex-1 min-w-0">
                  <input 
                    v-model="invoiceSearchTerm" 
                    @input="filterInvoices" 
                    type="text" 
                    class="w-full px-3 py-2.5 pr-9 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="بحث..."
                  >
                  <svg class="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>

                <select v-model="invoiceStatusFilter" @change="filterInvoices" class="input-field text-sm py-2.5">
                  <option value="">جميع الحالات</option>
                  <option value="draft">مسودة</option>
                  <option value="issued">صادرة</option>
                  <option value="paid">مدفوعة</option>
                  <option value="cancelled">ملغية</option>
                </select>

                <select v-model="invoiceTypeFilter" @change="filterInvoices" class="input-field text-sm py-2.5">
                  <option value="">جميع الأنواع</option>
                  <option value="B2B">B2B</option>
                  <option value="B2C">B2C</option>
                  <option value="simplified">مبسطة</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Invoices Table - Mobile Optimized -->
          <div class="overflow-x-auto">
            <!-- Desktop Table -->
            <table class="hidden sm:table min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">رقم الفاتورة</th>
                  <th class="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">التاريخ</th>
                  <th class="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">العميل</th>
                  <th class="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">النوع</th>
                  <th class="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">المبلغ</th>
                  <th class="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الحالة</th>
                  <th class="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الإجراءات</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="invoice in paginatedInvoices" :key="invoice.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">#{{ invoice.invoiceNumber }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ invoice.items?.length || 0 }} صنف</div>
                  </td>
                  <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">{{ formatDate(invoice.date) }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(invoice.date) }}</div>
                  </td>
                  <td class="px-4 lg:px-6 py-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]">{{ invoice.customer.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ invoice.customer.phone }}</div>
                    <div v-if="invoice.customer.taxId" class="text-xs text-blue-600 dark:text-blue-400 truncate max-w-[150px]">
                      ضريبي: {{ invoice.customer.taxId }}
                    </div>
                  </td>
                  <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs rounded-full" :class="getInvoiceTypeClass(invoice.type)">
                      {{ getInvoiceTypeLabel(invoice.type) }}
                    </span>
                  </td>
                  <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(invoice.totalAmount) }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ invoice.paymentMethod === 'cash' ? 'نقدي' : 
                         invoice.paymentMethod === 'bank' ? 'بنكي' : 
                         invoice.paymentMethod === 'check' ? 'شيك' : 'آجل' }}
                    </div>
                  </td>
                  <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs rounded-full" :class="getInvoiceStatusClass(invoice.status)">
                      {{ getInvoiceStatusLabel(invoice.status) }}
                    </span>
                  </td>
                  <td class="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center space-x-1 space-x-reverse">
                      <button @click="viewInvoice(invoice)" class="action-btn text-blue-600 dark:text-blue-400" title="عرض التفاصيل">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </button>
                      <button @click="printInvoice(invoice)" class="action-btn text-green-600 dark:text-green-400" title="طباعة الفاتورة">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                        </svg>
                      </button>
                      <button @click="exportInvoicePDF(invoice)" class="action-btn text-purple-600 dark:text-purple-400" title="تصدير PDF">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </button>
                      <button @click="editInvoice(invoice)" v-if="invoice.status === 'draft'" class="action-btn text-yellow-600 dark:text-yellow-400" title="تعديل الفاتورة">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button @click="deleteInvoice(invoice.id)" v-if="invoice.status === 'draft'" class="action-btn text-red-600 dark:text-red-400" title="حذف الفاتورة">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Mobile Cards View -->
            <div class="sm:hidden p-3">
              <div class="space-y-3">
                <div 
                  v-for="invoice in paginatedInvoices" 
                  :key="invoice.id" 
                  class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-150"
                >
                  <!-- Header -->
                  <div class="flex justify-between items-start mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center space-x-2 space-x-reverse">
                        <span class="text-sm font-bold text-gray-900 dark:text-white">#{{ invoice.invoiceNumber }}</span>
                        <span class="px-2 py-0.5 text-xs rounded-full" :class="getInvoiceTypeClass(invoice.type)">
                          {{ getInvoiceTypeLabel(invoice.type) }}
                        </span>
                        <span class="px-2 py-0.5 text-xs rounded-full" :class="getInvoiceStatusClass(invoice.status)">
                          {{ getInvoiceStatusLabel(invoice.status) }}
                        </span>
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {{ formatDate(invoice.date) }} - {{ formatTime(invoice.date) }}
                      </div>
                    </div>
                  </div>

                  <!-- Details -->
                  <div class="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">العميل</div>
                      <div class="font-medium text-gray-900 dark:text-white truncate">{{ invoice.customer.name }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">{{ invoice.customer.phone }}</div>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">المبلغ</div>
                      <div class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(invoice.totalAmount) }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        {{ invoice.paymentMethod === 'cash' ? 'نقدي' : 
                           invoice.paymentMethod === 'bank' ? 'بنكي' : 
                           invoice.paymentMethod === 'check' ? 'شيك' : 'آجل' }}
                      </div>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">الأصناف</div>
                      <div class="font-medium text-gray-900 dark:text-white">{{ invoice.items?.length || 0 }} صنف</div>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">المخزن</div>
                      <div class="font-medium text-gray-900 dark:text-white truncate">{{ getWarehouseLabel(invoice.warehouseId) }}</div>
                    </div>
                  </div>

                  <!-- Actions - Mobile Optimized -->
                  <div class="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div class="flex items-center space-x-2 space-x-reverse">
                      <button @click="viewInvoice(invoice)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-xs sm:text-sm flex items-center p-1">
                        <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        عرض
                      </button>
                      <button @click="printInvoice(invoice)" class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-xs sm:text-sm flex items-center p-1">
                        <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                        </svg>
                        طباعة
                      </button>
                    </div>
                    <div class="flex items-center space-x-1 space-x-reverse">
                      <button @click="exportInvoicePDF(invoice)" class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 p-1" title="تصدير PDF">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </button>
                      <button @click="editInvoice(invoice)" v-if="invoice.status === 'draft'" class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 p-1" title="تعديل">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button @click="deleteInvoice(invoice.id)" v-if="invoice.status === 'draft'" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1" title="حذف">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredInvoices.length === 0" class="text-center py-8 sm:py-12">
            <svg class="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <h3 class="mt-2 text-sm sm:text-base font-medium text-gray-900 dark:text-white">لا توجد فواتير</h3>
            <p class="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {{ invoiceSearchTerm ? 'لم يتم العثور على فواتير مطابقة للبحث' : 'ابدأ بإنشاء فاتورتك الأولى' }}
            </p>
            <div class="mt-4 sm:mt-6">
              <button @click="createNewInvoice" class="btn-primary">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                إنشاء فاتورة جديدة
              </button>
            </div>
          </div>

          <!-- Pagination - Mobile Optimized -->
          <div v-if="filteredInvoices.length > 0" class="pagination-container">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
              <div class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center sm:text-right">
                عرض <span class="font-medium">{{ startInvoiceIndex + 1 }}</span> إلى <span class="font-medium">{{ endInvoiceIndex }}</span> من <span class="font-medium">{{ filteredInvoices.length }}</span> فاتورة
              </div>
              <div class="flex items-center justify-center space-x-2">
                <button @click="prevInvoicePage" :disabled="currentPage === 1" class="pagination-btn text-xs sm:text-sm px-2.5 sm:px-3 py-1.5">
                  السابق
                </button>
                <span class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 min-w-[80px] sm:min-w-[100px] text-center">
                  صفحة {{ currentPage }} من {{ totalPages }}
                </span>
                <button @click="nextInvoicePage" :disabled="currentPage >= totalPages" class="pagination-btn text-xs sm:text-sm px-2.5 sm:px-3 py-1.5">
                  التالي
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================ -->
      <!-- ORIGINAL DISPATCH SECTION (When Invoice System is OFF) - FIXED -->
      <!-- ============================================ -->
      <div v-else>
        <!-- Stats Cards - Mobile Optimized -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center">
              <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center ml-2 sm:ml-3 lg:ml-4">
                <svg class="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
              </div>
              <div>
                <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">إجمالي عمليات الصرف</p>
                <p class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(totalDispatches) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center">
              <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center ml-2 sm:ml-3 lg:ml-4">
                <svg class="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">صرف هذا الشهر</p>
                <p class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(monthlyDispatches) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center">
              <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center ml-2 sm:ml-3 lg:ml-4">
                <svg class="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">قيمة الصرف</p>
                <p class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(totalDispatchValue) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Create Dispatch Section - Mobile Optimized - FIXED LAYOUT -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4 lg:mb-6">
            <div>
              <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">إنشاء صرف جديد</h2>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">صرف أصناف من المخازن إلى خارج النظام</p>
            </div>

            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <!-- Search Box with SPARK Search System -->
              <div class="relative flex-1 min-w-0">
                <input
                  type="text"
                  v-model="searchTerm"
                  @input="handleDispatchSearch"
                  placeholder="ابحث عن صنف بالاسم، الكود، اللون، المورد..."
                  class="w-full px-3 sm:px-4 py-2.5 pr-9 sm:pr-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :disabled="loading"
                >
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg class="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                <div v-if="searchingDispatchItems" class="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <div class="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              </div>

              <!-- Warehouse Filter for Available Items -->
              <select
                v-model="selectedWarehouse"
                @change="updateAvailableItems"
                class="px-3 sm:px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 min-h-[44px] min-w-[150px] sm:min-w-[180px]"
                :disabled="loading || !availableWarehousesForDispatch.length"
              >
                <option value="">جميع المخازن</option>
                <option 
                  v-for="warehouse in availableWarehousesForDispatch" 
                  :key="warehouse.id" 
                  :value="warehouse.id"
                >
                  {{ warehouse.name_ar }}
                </option>
              </select>

              <button 
                v-if="canPerformDispatch"
                @click="showDispatchModal = true"
                :disabled="loading || availableItems.length === 0"
                class="inline-flex items-center justify-center px-3 sm:px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                <svg class="w-4 h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span class="hidden sm:inline">إنشاء صرف جديد</span>
                <span class="sm:hidden">صرف جديد</span>
              </button>
            </div>
          </div>

          <!-- Search Stats and Source for Dispatch -->
          <div v-if="searchTerm.trim() && filteredDispatchItems.length > 0" class="search-stats-container max-w-full mx-auto mb-3">
            <span>🔍 بحث: "{{ searchTerm }}"</span>
            <span>•</span>
            <span>تم العثور على {{ filteredDispatchItems.length }} صنف</span>
            <span v-if="lastDispatchSearchSource" class="flex items-center gap-1">
              • <span class="search-source-badge">
                {{ getSearchSourceLabel(lastDispatchSearchSource) }}
              </span>
            </span>
            <span v-if="searchingDispatchItems" class="flex items-center gap-1">
              • <span class="animate-pulse text-blue-500">جاري البحث...</span>
            </span>
          </div>

          <!-- Available Items - FIXED GRID LAYOUT -->
          <div v-if="availableItems.length > 0" class="mt-3 sm:mt-4">
            <div class="flex items-center justify-between mb-2 sm:mb-3">
              <h3 class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                {{ selectedWarehouse ? `الأصناف المتاحة في ${getWarehouseLabel(selectedWarehouse)}` : 'جميع الأصناف المتاحة' }}
                <span class="text-xs text-gray-500">({{ availableItems.length }} صنف)</span>
              </h3>
              <div class="flex items-center space-x-1 sm:space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <span>المعروض: {{ Math.min(8, availableItems.length) }} من {{ availableItems.length }}</span>
              </div>
            </div>

            <!-- FIXED: Items organized in responsive grid -->
            <div class="available-items-grid-fixed grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              <div 
                v-for="item in displayedAvailableItems" 
                :key="item.id"
                class="p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm active:scale-98 h-full"
                @click="selectItemForDispatch(item)"
              >
                <div class="flex flex-col h-full">
                  <!-- Item Header -->
                  <div class="flex-1">
                    <div class="flex justify-between items-start mb-2">
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ item.name }}</p>
                        <div v-if="item.code" class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{{ item.code }}</div>
                      </div>
                      <svg class="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </div>
                    
                    <!-- Item Details -->
                    <div class="space-y-2">
                      <!-- FIXED: Quantity display in RED -->
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded whitespace-nowrap">
                          {{ formatNumber(item.remaining_quantity || item.quantity || 0) }} متبقي
                        </span>
                        <span v-if="item.color" class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {{ item.color }}
                        </span>
                      </div>
                      
                      <!-- Warehouse Info -->
                      <div v-if="item.warehouse_id" class="text-xs text-gray-500 dark:text-gray-400 truncate">
                        مخزن: {{ getWarehouseLabel(item.warehouse_id) }}
                      </div>
                      
                      <!-- Supplier Info -->
                      <div v-if="item.supplier" class="text-xs text-gray-500 dark:text-gray-400 truncate">
                        مورد: {{ item.supplier }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="availableItems.length > 8" class="text-center mt-3 sm:mt-4">
              <button 
                @click="showAllItems = !showAllItems"
                class="text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg transition-colors"
              >
                {{ showAllItems ? 'عرض أقل' : `عرض المزيد (+${availableItems.length - 8})` }}
              </button>
            </div>
          </div>

          <div v-else-if="!loading" class="text-center py-6 sm:py-8">
            <div class="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-3 sm:mb-4">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1M9 7h6"/>
              </svg>
            </div>
            <p class="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
              {{ selectedWarehouse ? 'لا توجد أصناف في هذا المخزن' : 'لا توجد أصناف متاحة' }}
            </p>
          </div>

          <div v-else class="text-center py-4 sm:py-6">
            <div class="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-blue-200 border-t-blue-600 mx-auto mb-2 sm:mb-3"></div>
            <p class="text-gray-500 dark:text-gray-400 text-xs">جاري تحميل الأصناف...</p>
          </div>
        </div>

        <!-- Dispatch History - Mobile Optimized - FIXED LAYOUT -->
        <div class="dispatch-table-container bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6 sm:mb-8">
          <div class="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
              <div>
                <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">سجل عمليات الصرف</h2>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">جميع عمليات الصرف المسجلة في النظام</p>
              </div>

              <div class="filters-container flex flex-wrap gap-2">
                <!-- Search History -->
                <div class="relative flex-1 sm:flex-initial min-w-0">
                  <input
                    type="text"
                    v-model="historySearch"
                    @input="applyHistoryFilters"
                    placeholder="بحث في السجل..."
                    class="w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-9 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                  <svg class="absolute right-2.5 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>

                <!-- Warehouse Filter -->
                <select
                  v-model="historyWarehouseFilter"
                  @change="applyHistoryFilters"
                  class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-[120px] sm:min-w-[150px]"
                >
                  <option value="">جميع المخازن</option>
                  <option v-for="warehouse in availableWarehousesForDispatch" :key="warehouse.id" :value="warehouse.id">
                    {{ warehouse.name_ar }}
                  </option>
                </select>

                <!-- Date Filter -->
                <select
                  v-model="dateFilter"
                  @change="applyHistoryFilters"
                  class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-[120px] sm:min-w-[140px]"
                >
                  <option value="all">جميع الفترات</option>
                  <option value="today">اليوم</option>
                  <option value="week">هذا الأسبوع</option>
                  <option value="month">هذا الشهر</option>
                  <option value="custom">فترة مخصصة</option>
                </select>

                <!-- Export Button -->
                <button 
                  v-if="canExport"
                  @click="exportDispatches"
                  :disabled="filteredDispatchHistory.length === 0"
                  class="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <span class="hidden sm:inline">تصدير Excel</span>
                  <span class="inline sm:hidden">تصدير</span>
                </button>
              </div>
            </div>

            <!-- Active Filters Badges -->
            <div v-if="hasFilters" class="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-700">
              <div class="flex flex-wrap items-center gap-1 sm:gap-2">
                <span class="text-xs text-gray-600 dark:text-gray-400">الفلاتر النشطة:</span>

                <span v-if="historySearch" class="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                  بحث: "{{ historySearch }}"
                  <button @click="historySearch = ''; applyHistoryFilters()" class="mr-1 hover:text-blue-900 dark:hover:text-blue-200">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                </span>

                <span v-if="historyWarehouseFilter" class="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300">
                  مخزن: {{ getWarehouseLabel(historyWarehouseFilter) }}
                  <button @click="historyWarehouseFilter = ''; applyHistoryFilters()" class="mr-1 hover:text-indigo-900 dark:hover:text-indigo-200">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                </span>

                <span v-if="dateFilter !== 'all'" class="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300">
                  فترة: {{ getDateFilterLabel(dateFilter) }}
                  <button @click="dateFilter = 'all'; customDateFrom = ''; customDateTo = ''; applyHistoryFilters()" class="mr-1 hover:text-yellow-900 dark:hover:text-yellow-200">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                </span>

                <button 
                  v-if="hasFilters"
                  @click="clearHistoryFilters"
                  class="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  إعادة تعيين
                </button>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="p-6 sm:p-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
            <p class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">جاري تحميل البيانات...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredDispatchHistory.length === 0" class="p-4 sm:p-6 lg:p-8 text-center">
            <div class="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-3 sm:mb-4">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </div>
            <h3 class="text-sm sm:text-base lg:text-lg font-medium text-gray-900 dark:text-white mb-1 sm:mb-2">لا توجد عمليات صرف</h3>
            <p class="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
              {{ hasFilters ? 'لا توجد عمليات صرف تطابق التصفية المحددة' : 'لم يتم تسجيل أي عمليات صرف حتى الآن' }}
            </p>
            <button 
              v-if="canPerformDispatch"
              @click="showDispatchModal = true"
              class="px-3 sm:px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 min-h-[40px] sm:min-h-[44px]"
            >
              إنشاء أول صرف
            </button>
          </div>

          <!-- Table Content -->
          <div v-else class="w-full overflow-hidden">
            <!-- Desktop Table -->
            <div class="hidden lg:block">
              <!-- Fixed Table Headers -->
              <div class="dispatch-table-header">
                <div class="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider min-w-[800px]">
                  <div class="col-span-2 text-right px-2">التاريخ والوقت</div>
                  <div class="col-span-2 text-right px-2">الصنف</div>
                  <div class="col-span-1 text-right px-2">الكمية</div>
                  <div class="col-span-2 text-right px-2">من مخزن</div>
                  <div class="col-span-2 text-right px-2">إلى</div>
                  <div class="col-span-1 text-right px-2">القيمة</div>
                  <div class="col-span-1 text-right px-2">بواسطة</div>
                  <div class="col-span-1 text-right px-2">الإجراءات</div>
                </div>
              </div>

              <!-- Scrollable Table Body -->
              <div class="overflow-x-auto" style="max-height: calc(100vh - 400px); min-height: 200px;">
                <div class="min-w-full">
                  <div 
                    v-if="filteredDispatchHistory.length === 0 && !loading"
                    class="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <svg class="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    <p class="mt-2 text-sm">لا توجد عمليات صرف</p>
                  </div>
                  
                  <div 
                    v-for="dispatch in paginatedHistory" 
                    :key="dispatch.id" 
                    class="dispatch-table-row grid grid-cols-12 gap-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 border-b border-gray-100 dark:border-gray-700 min-w-[800px]"
                  >
                    <!-- Date & Time -->
                    <div class="col-span-2 px-2">
                      <div class="text-sm text-gray-900 dark:text-white">{{ formatDate(dispatch.timestamp) }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(dispatch.timestamp) }}</div>
                    </div>

                    <!-- Item -->
                    <div class="col-span-2 px-2">
                      <div class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ dispatch.item_name || 'غير محدد' }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ dispatch.item_code || 'N/A' }}</div>
                    </div>

                    <!-- Quantity - FIXED: Red color for dispatch quantity -->
                    <div class="col-span-1 px-2">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                        {{ formatNumber(Math.abs(dispatch.quantity || dispatch.total_delta || 0)) }}
                      </span>
                    </div>

                    <!-- From Warehouse -->
                    <div class="col-span-2 px-2 text-sm text-gray-900 dark:text-white truncate">
                      {{ getWarehouseLabel(dispatch.from_warehouse) || 'غير محدد' }}
                    </div>

                    <!-- Destination -->
                    <div class="col-span-2 px-2 text-sm text-gray-900 dark:text-white truncate">
                      {{ getDestinationLabel(dispatch.destination || dispatch.to_warehouse) || 'خارج النظام' }}
                    </div>

                    <!-- Value -->
                    <div class="col-span-1 px-2 text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ formatCurrency(calculateDispatchValue(dispatch)) }}
                    </div>

                    <!-- User -->
                    <div class="col-span-1 px-2 text-sm text-gray-500 dark:text-gray-400 truncate">
                      {{ dispatch.user_name || dispatch.created_by || 'مستخدم النظام' }}
                    </div>

                    <!-- Actions -->
                    <div class="col-span-1 px-2">
                      <div class="flex items-center space-x-1 space-x-reverse">
                        <button 
                          @click="viewDispatchDetails(dispatch)"
                          class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                          title="عرض التفاصيل"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        </button>
                        <button 
                          @click="printDispatch(dispatch)"
                          class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 hover:bg-green-50 dark:hover:bg-green-900/30 rounded"
                          title="طباعة"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mobile Cards View -->
            <div class="lg:hidden">
              <div class="p-2 sm:p-3 lg:p-4">
                <div class="space-y-2 sm:space-y-3">
                  <div 
                    v-for="dispatch in paginatedHistory" 
                    :key="dispatch.id" 
                    class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow duration-150"
                  >
                    <!-- Header -->
                    <div class="flex justify-between items-start mb-2 sm:mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                      <div class="min-w-0 flex-1">
                        <div class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ dispatch.item_name }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatDate(dispatch.timestamp) }} - {{ formatTime(dispatch.timestamp) }}</div>
                      </div>
                      <!-- FIXED: Red color for dispatch quantity -->
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                        {{ formatNumber(Math.abs(dispatch.quantity || dispatch.total_delta || 0)) }}
                      </span>
                    </div>

                    <!-- Details Grid -->
                    <div class="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">من مخزن</div>
                        <div class="font-medium text-gray-900 dark:text-white truncate">{{ getWarehouseLabel(dispatch.from_warehouse) }}</div>
                      </div>
                      <div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">إلى</div>
                        <div class="font-medium text-gray-900 dark:text-white truncate">{{ getDestinationLabel(dispatch.destination || dispatch.to_warehouse) }}</div>
                      </div>
                      <div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">القيمة</div>
                        <div class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(calculateDispatchValue(dispatch)) }}</div>
                      </div>
                      <div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">بواسطة</div>
                        <div class="font-medium text-gray-900 dark:text-white truncate">{{ dispatch.user_name || dispatch.created_by || 'مستخدم النظام' }}</div>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-between items-center mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        {{ dispatch.item_code }}
                      </div>
                      <div class="flex items-center space-x-2 sm:space-x-3 space-x-reverse">
                        <button 
                          @click="viewDispatchDetails(dispatch)"
                          class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-xs sm:text-sm flex items-center p-1"
                        >
                          <svg class="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                          تفاصيل
                        </button>
                        <button 
                          @click="printDispatch(dispatch)"
                          class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-xs sm:text-sm flex items-center p-1"
                        >
                          <svg class="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                          </svg>
                          طباعة
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalHistoryPages > 1" class="pagination-container">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-right">
                  عرض {{ startIndex + 1 }} - {{ Math.min(endIndex, filteredDispatchHistory.length) }} من {{ filteredDispatchHistory.length }}
                </div>
                <div class="flex items-center justify-center space-x-2">
                  <button 
                    @click="prevPage"
                    :disabled="currentHistoryPage === 1"
                    class="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[34px] sm:min-h-[36px] min-w-[70px] sm:min-w-[80px]"
                  >
                    السابق
                  </button>
                  <span class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 min-w-[80px] sm:min-w-[100px] text-center">
                    صفحة {{ currentHistoryPage }} من {{ totalHistoryPages }}
                  </span>
                  <button 
                    @click="nextPage"
                    :disabled="currentHistoryPage === totalHistoryPages"
                    class="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[34px] sm:min-h-[36px] min-w-[70px] sm:min-w-[80px]"
                  >
                    التالي
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Dispatch Modal -->
    <DispatchModal 
      v-if="showDispatchModal"
      :isOpen="showDispatchModal"
      :item="selectedItemForDispatch"
      @close="handleModalClose"
      @success="handleDispatchSuccess"
    />

    <!-- Loading Overlay -->
    <div v-if="loading && !showDispatchModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 lg:p-8 flex flex-col items-center mx-4 max-w-sm w-full">
        <div class="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-blue-600 mb-3 sm:mb-4"></div>
        <p class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm text-center">جاري تحميل البيانات...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  doc,
  updateDoc,
  increment,
  writeBatch,
  deleteDoc,
  Timestamp,
  getDocs,
  addDoc
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import DispatchModal from '@/components/inventory/DispatchModal.vue';

export default {
  name: 'DispatchPageWithInvoices',
  
  components: {
    DispatchModal
  },
  
  setup() {
    const store = useStore();
    
    // ============================================
    // SECTION 1: ORIGINAL DISPATCH SYSTEM STATE
    // ============================================
    const loading = ref(false);
    const showDispatchModal = ref(false);
    const selectedWarehouse = ref('');
    const selectedItemForDispatch = ref(null);
    const searchTerm = ref('');
    const historySearch = ref('');
    const historyWarehouseFilter = ref('');
    const dateFilter = ref('all');
    const customDateFrom = ref('');
    const customDateTo = ref('');
    const currentHistoryPage = ref(1);
    const itemsPerPage = ref(10);
    const showAllItems = ref(false);
    const searchTimeout = ref(null);
    const realtimeUnsubscribe = ref(null);
    
    // ============================================
    // SECTION 2: INVOICE SYSTEM STATE WITH SPARK SEARCH
    // ============================================
    const showInvoiceSystem = ref(false);
    const showInvoiceForm = ref(false);
    const saving = ref(false);
    const invoiceSearchTerm = ref('');
    const invoiceStatusFilter = ref('');
    const invoiceTypeFilter = ref('');
    const itemSearch = ref('');
    const currentPage = ref(1);
    const itemsPerPageInvoices = ref(10);
    const selectedWarehouseForInvoice = ref('');
    
    // SPARK Search specific state for invoice
    const searchingItems = ref(false);
    const searchResults = ref([]);
    const lastSearchSource = ref('');
    const searchAllWarehouses = ref(false);
    const searchDebounceTimeout = ref(null);
    
    // SPARK Search specific state for dispatch
    const searchingDispatchItems = ref(false);
    const filteredDispatchItems = ref([]);
    const lastDispatchSearchSource = ref('');
    const dispatchSearchDebounceTimeout = ref(null);
    
    // Invoice Form State
    const invoiceForm = ref({
      type: 'B2B',
      paymentMethod: 'cash',
      customer: {
        name: '',
        phone: '',
        taxId: '',
        address: ''
      },
      items: [],
      notes: '',
      warehouseId: '',
      status: 'draft'
    });
    
    const editingInvoice = ref(null);
    const invoices = ref([]);
    
    // ============================================
    // SECTION 3: COMPUTED PROPERTIES FROM STORE
    // ============================================
    // User properties from store
    const userRole = computed(() => store.getters.userRole || '');
    const userName = computed(() => store.getters.userName || '');
    const userProfile = computed(() => store.getters.userProfile || {});
    
    // Store state getters
    const allInventory = computed(() => store.state.inventory || []);
    const allTransactions = computed(() => store.state.transactions || []);
    const allWarehouses = computed(() => store.state.warehouses || []);
    
    // ✅ CORRECTED: Get dispatch transactions by filtering store transactions
    const dispatchTransactions = computed(() => {
      return allTransactions.value.filter(t => t.type === 'DISPATCH');
    });
    
    // ✅ CORRECTED: Use transactions loading state
    const dispatchHistoryLoading = computed(() => store.state.transactionsLoading || false);
    
    // Store getters
    const canExport = computed(() => userRole.value === 'superadmin' || userRole.value === 'company_manager');
    
    // Use accessibleWarehouses getter
    const accessibleWarehouses = computed(() => store.getters.accessibleWarehouses || []);
    
    // For invoice system: show all warehouses that the user has access to
    const availableWarehouses = computed(() => accessibleWarehouses.value);
    
    // For dispatch system: show only primary warehouses that the user has access to
    const availableWarehousesForDispatch = computed(() => {
      return accessibleWarehouses.value.filter(warehouse => 
        warehouse.type === 'primary' || !warehouse.type
      );
    });
    
    const canViewDispatches = computed(() => store.getters.isAuthenticated);
    
    // Check if user can dispatch based on permissions
    const canPerformDispatch = computed(() => {
      return store.getters.canDispatch || 
             userRole.value === 'superadmin' || 
             userRole.value === 'warehouse_manager';
    });
    
    // ============================================
    // SECTION 4: SPARK SEARCH COMPUTED PROPERTIES
    // ============================================
    const filteredSearchResults = computed(() => {
      if (!searchResults.value.length) {
        return [];
      }
      
      if (!selectedWarehouseForInvoice.value || searchAllWarehouses.value) {
        return searchResults.value;
      }
      
      return searchResults.value.filter(item => {
        return item.warehouse_id === selectedWarehouseForInvoice.value;
      });
    });
    
    const totalItemsInWarehouse = computed(() => {
      if (!selectedWarehouseForInvoice.value) return 0;
      
      return allInventory.value.filter(item => 
        item.remaining_quantity > 0 && 
        item.warehouse_id === selectedWarehouseForInvoice.value
      ).length;
    });
    
    // ============================================
    // SECTION 5: UPDATED DISPATCH COMPUTED PROPERTIES
    // ============================================
    // ✅ CORRECTED: Use filtered dispatch transactions
    const dispatchHistory = computed(() => dispatchTransactions.value);
    
    // Stats
    const totalDispatches = computed(() => dispatchTransactions.value.length);
    
    const monthlyDispatches = computed(() => {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      return dispatchTransactions.value.filter(t => {
        try {
          const dispatchDate = t.timestamp?.toDate ? t.timestamp.toDate() : new Date(t.timestamp);
          return dispatchDate >= oneMonthAgo;
        } catch (error) {
          return false;
        }
      }).length;
    });
    
    // ✅ UPDATED: Calculate total dispatched quantity using the same store logic
    const totalDispatchedQuantity = computed(() => {
      return dispatchTransactions.value.reduce((total, dispatch) => {
        return total + calculateDispatchQuantity(dispatch);
      }, 0);
    });
    
    const totalDispatchValue = computed(() => {
      return dispatchTransactions.value.reduce((total, dispatch) => {
        return total + calculateDispatchValue(dispatch);
      }, 0);
    });
    
    // Available items with SPARK search and warehouse filtering
    const availableItems = computed(() => {
      let items = allInventory.value.filter(item => item.remaining_quantity > 0);
      
      if (selectedWarehouse.value) {
        items = items.filter(item => item.warehouse_id === selectedWarehouse.value);
      }
      
      if (searchTerm.value.trim()) {
        // If we have search results from SPARK, use them
        if (filteredDispatchItems.value.length > 0) {
          return filteredDispatchItems.value;
        }
        
        // Otherwise perform basic local search
        const term = searchTerm.value.toLowerCase().trim();
        items = items.filter(item => 
          item.name?.toLowerCase().includes(term) ||
          item.code?.toLowerCase().includes(term) ||
          item.color?.toLowerCase().includes(term) ||
          item.supplier?.toLowerCase().includes(term)
        );
      }
      
      return items.sort((a, b) => b.remaining_quantity - a.remaining_quantity);
    });
    
    // Display limited or all available items
    const displayedAvailableItems = computed(() => {
      if (showAllItems.value) {
        return availableItems.value;
      }
      return availableItems.value.slice(0, 8);
    });
    
    // ✅ UPDATED: Filter dispatch history from transactions
    const filteredDispatchHistory = computed(() => {
      let filtered = [...dispatchTransactions.value];
      
      if (historySearch.value.trim()) {
        const term = historySearch.value.toLowerCase().trim();
        filtered = filtered.filter(d => 
          d.item_name?.toLowerCase().includes(term) ||
          d.item_code?.toLowerCase().includes(term) ||
          d.destination?.toLowerCase().includes(term) ||
          d.notes?.toLowerCase().includes(term)
        );
      }
      
      if (historyWarehouseFilter.value) {
        filtered = filtered.filter(d => d.from_warehouse === historyWarehouseFilter.value);
      }
      
      if (dateFilter.value !== 'all') {
        const now = new Date();
        let startDate;
        
        switch (dateFilter.value) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'custom':
            if (customDateFrom.value && customDateTo.value) {
              const start = new Date(customDateFrom.value);
              const end = new Date(customDateTo.value);
              end.setHours(23, 59, 59, 999);
              
              return filtered.filter(d => {
                try {
                  const dispatchDate = d.timestamp?.toDate ? d.timestamp.toDate() : new Date(d.timestamp);
                  return dispatchDate >= start && dispatchDate <= end;
                } catch (error) {
                  return false;
                }
              });
            }
            break;
        }
        
        if (startDate) {
          filtered = filtered.filter(d => {
            try {
              const dispatchDate = d.timestamp?.toDate ? d.timestamp.toDate() : new Date(d.timestamp);
              return dispatchDate >= startDate;
            } catch (error) {
              return false;
            }
          });
        }
      }
      
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
    
    // Pagination for history
    const totalHistoryPages = computed(() => Math.ceil(filteredDispatchHistory.value.length / itemsPerPage.value));
    
    const startIndex = computed(() => (currentHistoryPage.value - 1) * itemsPerPage.value);
    
    const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredDispatchHistory.value.length));
    
    const paginatedHistory = computed(() => filteredDispatchHistory.value.slice(startIndex.value, endIndex.value));
    
    // Check if any filters are active
    const hasFilters = computed(() => historySearch.value.trim() || historyWarehouseFilter.value || dateFilter.value !== 'all');
    
    // ============================================
    // SECTION 6: INVOICE SYSTEM COMPUTED PROPERTIES
    // ============================================
    const totalInvoices = computed(() => invoices.value.length);
    
    const totalSales = computed(() => {
      return invoices.value
        .filter(inv => inv.status !== 'cancelled')
        .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    });
    
    const totalTax = computed(() => {
      return invoices.value
        .filter(inv => inv.status !== 'cancelled' && (inv.type === 'B2B' || inv.type === 'B2C'))
        .reduce((sum, inv) => sum + (inv.taxAmount || 0), 0);
    });
    
    const uniqueCustomers = computed(() => {
      const customers = new Set();
      invoices.value.forEach(inv => {
        if (inv.customer?.phone) {
          customers.add(inv.customer.phone);
        }
      });
      return customers.size;
    });
    
    const filteredInvoices = computed(() => {
      let filtered = [...invoices.value];
      
      if (invoiceSearchTerm.value) {
        const term = invoiceSearchTerm.value.toLowerCase();
        filtered = filtered.filter(inv => 
          inv.invoiceNumber.toString().includes(term) ||
          inv.customer.name.toLowerCase().includes(term) ||
          inv.customer.phone.includes(term)
        );
      }
      
      if (invoiceStatusFilter.value) {
        filtered = filtered.filter(inv => inv.status === invoiceStatusFilter.value);
      }
      
      if (invoiceTypeFilter.value) {
        filtered = filtered.filter(inv => inv.type === invoiceTypeFilter.value);
      }
      
      return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    });
    
    const totalPages = computed(() => Math.ceil(filteredInvoices.value.length / itemsPerPageInvoices.value));
    
    const startInvoiceIndex = computed(() => (currentPage.value - 1) * itemsPerPageInvoices.value);
    
    const endInvoiceIndex = computed(() => Math.min(startInvoiceIndex.value + itemsPerPageInvoices.value, filteredInvoices.value.length));
    
    const paginatedInvoices = computed(() => filteredInvoices.value.slice(startInvoiceIndex.value, endInvoiceIndex.value));
    
    // Invoice Form Calculations
    const subtotal = computed(() => {
      return invoiceForm.value.items.reduce((sum, item) => {
        const price = item.unitPrice || 0;
        const quantity = item.quantity || 0;
        return sum + (price * quantity);
      }, 0);
    });
    
    const totalDiscount = computed(() => {
      return invoiceForm.value.items.reduce((sum, item) => {
        const price = item.unitPrice || 0;
        const quantity = item.quantity || 0;
        const discount = item.discount || 0;
        return sum + ((price * quantity) * (discount / 100));
      }, 0);
    });
    
    const taxAmount = computed(() => {
      if (invoiceForm.value.type === 'B2B' || invoiceForm.value.type === 'B2C') {
        return (subtotal.value - totalDiscount.value) * 0.14; // 14% VAT for Egypt
      }
      return 0;
    });
    
    const totalAmount = computed(() => {
      return subtotal.value - totalDiscount.value + taxAmount.value;
    });
    
    const totalQuantity = computed(() => {
      return invoiceForm.value.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    });
    
    // New computed properties for carton logic
    const hasCartonItems = computed(() => {
      return invoiceForm.value.items.some(item => item.per_carton_count > 1);
    });
    
    const totalCartons = computed(() => {
      return invoiceForm.value.items.reduce((sum, item) => sum + (item.cartons_count || 0), 0);
    });
    
    const totalSingles = computed(() => {
      return invoiceForm.value.items.reduce((sum, item) => sum + (item.single_bottles_count || 0), 0);
    });
    
    const canSaveInvoice = computed(() => {
      return invoiceForm.value.customer.name.trim() !== '' &&
             invoiceForm.value.customer.phone.trim() !== '' &&
             invoiceForm.value.items.length > 0 &&
             selectedWarehouseForInvoice.value !== '';
    });
    
    // ============================================
    // SECTION 7: UPDATED UTILITY FUNCTIONS
    // ============================================
    const formatNumber = (num) => {
      if (num === undefined || num === null) return '0';
      return new Intl.NumberFormat('en-US').format(num);
    };
    
    const formatCurrency = (amount) => {
      if (amount === undefined || amount === null) return '0 ج.م';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
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
    
    const formatDateTime = (timestamp) => {
      if (!timestamp) return '-';
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString('ar-EG', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return '-';
      }
    };
    
    const getWarehouseLabel = (warehouseId) => {
      if (!warehouseId) return '';
      const warehouse = allWarehouses.value.find(w => w.id === warehouseId);
      return warehouse ? warehouse.name_ar : warehouseId;
    };
    
    const getDestinationLabel = (destinationId) => {
      if (!destinationId) return '';
      const destination = allWarehouses.value.find(w => w.id === destinationId);
      return destination ? destination.name_ar : destinationId;
    };
    
    const getDateFilterLabel = (filter) => {
      const labels = {
        'today': 'اليوم',
        'week': 'هذا الأسبوع',
        'month': 'هذا الشهر',
        'custom': 'مخصص'
      };
      return labels[filter] || filter;
    };
    
    const getSearchSourceLabel = (source) => {
      const labels = {
        'cache': 'ذاكرة التخزين',
        'firebase': 'القاعدة الكاملة',
        'local_fallback': 'بحث محلي',
        'warehouse_load': 'تحميل من المخزن'
      };
      return labels[source] || source;
    };
    
    // ✅ UPDATED: Calculate dispatch quantity using the same store logic
    const calculateDispatchQuantity = (dispatch) => {
      // Try multiple possible quantity fields in order of priority
      let quantity = 0;
      
      if (dispatch.quantity !== undefined && dispatch.quantity !== null) {
        quantity = Math.abs(dispatch.quantity);
      } else if (dispatch.total_delta !== undefined && dispatch.total_delta !== null) {
        quantity = Math.abs(dispatch.total_delta);
      } else if (dispatch.cartons_count !== undefined && dispatch.per_carton_count !== undefined) {
        // Calculate from cartons using same store calculation method
        quantity = Math.abs((dispatch.cartons_count || 0) * (dispatch.per_carton_count || 12)) + 
                   Math.abs(dispatch.single_bottles_count || 0);
      } else if (dispatch.detailedUpdate?.remaining_quantity !== undefined) {
        quantity = Math.abs(dispatch.detailedUpdate.remaining_quantity);
      }
      
      return quantity;
    };
    
    const calculateDispatchValue = (dispatch) => {
      const quantity = calculateDispatchQuantity(dispatch);
      // Use a reasonable default price per item
      const pricePerItem = 50; // أو استخدم سعر الصنف الفعلي إذا كان متوفرًا
      return quantity * pricePerItem;
    };
    
    // ✅ UPDATED: Get dispatch quantity class - ALWAYS RED for dispatch
    const getDispatchQuantityClass = (dispatch) => {
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300';
    };
    
    // ✅ UPDATED: Helper to get quantity for display - use the same calculation
    const getDispatchQuantity = (dispatch) => {
      return calculateDispatchQuantity(dispatch);
    };
    
    // ✅ UPDATED: Get quantity class for items - RED for low quantity
    const getQuantityClass = (quantity) => {
      if (quantity < 10) return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300';
      if (quantity < 50) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300';
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300';
    };
    
    // Invoice specific utility functions
    const getInvoiceTypeLabel = (type) => {
      const labels = {
        'B2B': 'فاتورة ضريبية (B2B)',
        'B2C': 'فاتورة ضريبية (B2C)',
        'simplified': 'فاتورة مبسطة',
        'export': 'فاتورة تصدير'
      };
      return labels[type] || type;
    };
    
    const getInvoiceTypeClass = (type) => {
      const classes = {
        'B2B': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300',
        'B2C': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300',
        'simplified': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300',
        'export': 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300'
      };
      return classes[type] || 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300';
    };
    
    const getInvoiceStatusLabel = (status) => {
      const labels = {
        'draft': 'مسودة',
        'issued': 'صادرة',
        'paid': 'مدفوعة',
        'cancelled': 'ملغية'
      };
      return labels[status] || status;
    };
    
    const getInvoiceStatusClass = (status) => {
      const classes = {
        'draft': 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300',
        'issued': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300',
        'paid': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300',
        'cancelled': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
      };
      return classes[status] || 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300';
    };
    
    // ============================================
    // SECTION 8: SPARK SEARCH FUNCTIONS FOR INVOICE
    // ============================================
    const debouncedSearchItems = () => {
      if (searchDebounceTimeout.value) {
        clearTimeout(searchDebounceTimeout.value);
      }
      
      searchDebounceTimeout.value = setTimeout(() => {
        searchItemsWithSpark();
      }, 300);
    };
    
    const searchItemsWithSpark = async () => {
      if (!itemSearch.value.trim() || itemSearch.value.trim().length < 2) {
        searchResults.value = [];
        lastSearchSource.value = '';
        return;
      }

      searchingItems.value = true;

      try {
        console.log(`🔍 SPARK Searching for invoice: "${itemSearch.value}"`);
        
        const searchQuery = itemSearch.value.trim();
        const warehouseId = searchAllWarehouses.value ? null : selectedWarehouseForInvoice.value;
        
        let results = [];
        let source = '';
        
        if (store.dispatch && typeof store.dispatch === 'function') {
          try {
            const searchResult = await store.dispatch('searchInventorySpark', {
              searchQuery,
              warehouseId,
              limit: 100,
              strategy: 'firebase_first'
            });
            
            results = searchResult || [];
            source = 'firebase';
            
            if (results.length === 0) {
              console.log('Firebase search returned empty, trying local search...');
              const localResults = await store.dispatch('searchLocalSpark', {
                query: searchQuery,
                warehouseId,
                limit: 50
              });
              
              if (localResults && localResults.length > 0) {
                results = localResults;
                source = 'local_fallback';
              }
            }
          } catch (error) {
            console.error('SPARK search error:', error);
            
            const localResults = await store.dispatch('searchLocalSpark', {
              query: searchQuery,
              warehouseId,
              limit: 50
            });
            
            results = localResults || [];
            source = 'local_fallback';
          }
        } else {
          results = performBasicLocalSearch(searchQuery, warehouseId);
          source = 'cache';
        }
        
        searchResults.value = results.map(item => {
          return {
            id: item.id,
            name: item.name || '',
            code: item.code || '',
            color: item.color || '',
            supplier: item.supplier || '',
            warehouse_id: item.warehouse_id || '',
            remaining_quantity: item.remaining_quantity || 0,
            sale_price: item.sale_price || item.unitPrice || 0,
            cartons_count: item.cartons_count || 0,
            single_bottles_count: item.single_bottles_count || 0,
            per_carton_count: item.per_carton_count || item.items_per_carton || 12, // Dynamic value from database
            item_location: item.item_location || '',
            notes: item.notes || '',
            updated_at: item.updated_at || null
          };
        });
        
        lastSearchSource.value = source;
        
        console.log(`✅ SPARK Search completed: Found ${searchResults.value.length} items from ${source}`);
        
      } catch (error) {
        console.error('❌ Error in SPARK search:', error);
        
        searchResults.value = performBasicLocalSearch(itemSearch.value.trim(), selectedWarehouseForInvoice.value);
        lastSearchSource.value = 'cache';
        
        store.dispatch('showNotification', {
          type: 'warning',
          message: 'البحث المحدود - استخدمنا البيانات المحلية'
        });
      } finally {
        searchingItems.value = false;
      }
    };
    
    // ============================================
    // SECTION 8B: SPARK SEARCH FUNCTIONS FOR DISPATCH
    // ============================================
    const handleDispatchSearch = () => {
      if (dispatchSearchDebounceTimeout.value) {
        clearTimeout(dispatchSearchDebounceTimeout.value);
      }
      
      dispatchSearchDebounceTimeout.value = setTimeout(() => {
        searchDispatchItemsWithSpark();
      }, 300);
    };
    
    const searchDispatchItemsWithSpark = async () => {
      if (!searchTerm.value.trim() || searchTerm.value.trim().length < 2) {
        filteredDispatchItems.value = [];
        lastDispatchSearchSource.value = '';
        return;
      }

      searchingDispatchItems.value = true;

      try {
        console.log(`🔍 SPARK Searching for dispatch: "${searchTerm.value}"`);
        
        const searchQuery = searchTerm.value.trim();
        const warehouseId = selectedWarehouse.value;
        
        let results = [];
        let source = '';
        
        if (store.dispatch && typeof store.dispatch === 'function') {
          try {
            const searchResult = await store.dispatch('searchInventorySpark', {
              searchQuery,
              warehouseId,
              limit: 100,
              strategy: 'firebase_first'
            });
            
            results = searchResult || [];
            source = 'firebase';
            
            if (results.length === 0) {
              console.log('Firebase search returned empty, trying local search...');
              const localResults = await store.dispatch('searchLocalSpark', {
                query: searchQuery,
                warehouseId,
                limit: 50
              });
              
              if (localResults && localResults.length > 0) {
                results = localResults;
                source = 'local_fallback';
              }
            }
          } catch (error) {
            console.error('SPARK search error for dispatch:', error);
            
            const localResults = await store.dispatch('searchLocalSpark', {
              query: searchQuery,
              warehouseId,
              limit: 50
            });
            
            results = localResults || [];
            source = 'local_fallback';
          }
        } else {
          results = performBasicLocalSearch(searchQuery, warehouseId);
          source = 'cache';
        }
        
        filteredDispatchItems.value = results.map(item => {
          return {
            id: item.id,
            name: item.name || '',
            code: item.code || '',
            color: item.color || '',
            supplier: item.supplier || '',
            warehouse_id: item.warehouse_id || '',
            remaining_quantity: item.remaining_quantity || 0,
            sale_price: item.sale_price || item.unitPrice || 0,
            cartons_count: item.cartons_count || 0,
            single_bottles_count: item.single_bottles_count || 0,
            per_carton_count: item.per_carton_count || 12,
            item_location: item.item_location || '',
            notes: item.notes || '',
            updated_at: item.updated_at || null
          };
        });
        
        lastDispatchSearchSource.value = source;
        
        console.log(`✅ SPARK Dispatch Search completed: Found ${filteredDispatchItems.value.length} items from ${source}`);
        
      } catch (error) {
        console.error('❌ Error in SPARK dispatch search:', error);
        
        filteredDispatchItems.value = performBasicLocalSearch(searchTerm.value.trim(), selectedWarehouse.value);
        lastDispatchSearchSource.value = 'cache';
        
        store.dispatch('showNotification', {
          type: 'warning',
          message: 'البحث المحدود - استخدمنا البيانات المحلية'
        });
      } finally {
        searchingDispatchItems.value = false;
      }
    };
    
    const performBasicLocalSearch = (searchQuery, warehouseId) => {
      let items = allInventory.value.filter(item => item.remaining_quantity > 0);
      
      if (warehouseId) {
        items = items.filter(item => item.warehouse_id === warehouseId);
      }
      
      if (searchQuery) {
        const term = searchQuery.toLowerCase().trim();
        items = items.filter(item => 
          item.name?.toLowerCase().includes(term) ||
          item.code?.toLowerCase().includes(term) ||
          item.color?.toLowerCase().includes(term) ||
          item.supplier?.toLowerCase().includes(term)
        );
      }
      
      // For invoice, filter out already selected items
      if (invoiceForm.value.items) {
        const currentItemIds = new Set(invoiceForm.value.items.map(item => item.id));
        items = items.filter(item => !currentItemIds.has(item.id));
      }
      
      return items.sort((a, b) => b.remaining_quantity - a.remaining_quantity);
    };
    
    const loadWarehouseItems = async () => {
      if (!selectedWarehouseForInvoice.value) {
        searchResults.value = [];
        return;
      }

      if (itemSearch.value.trim() && itemSearch.value.trim().length >= 2) {
        await searchItemsWithSpark();
        return;
      }

      searchingItems.value = true;

      try {
        console.log(`📦 Loading items for warehouse: ${selectedWarehouseForInvoice.value}`);
        
        let results = [];
        
        if (store.dispatch && typeof store.dispatch === 'function') {
          try {
            const searchResult = await store.dispatch('searchFirebaseSparkEnhanced', {
              query: '',
              warehouseId: selectedWarehouseForInvoice.value,
              limit: 200
            });
            
            results = searchResult || [];
            lastSearchSource.value = 'warehouse_load';
          } catch (error) {
            console.error('Error loading warehouse items with SPARK:', error);
            results = performBasicLocalSearch('', selectedWarehouseForInvoice.value);
            lastSearchSource.value = 'cache';
          }
        } else {
          results = performBasicLocalSearch('', selectedWarehouseForInvoice.value);
          lastSearchSource.value = 'cache';
        }
        
        searchResults.value = results;
        
        console.log(`✅ Loaded ${results.length} items from warehouse`);
        
      } catch (error) {
        console.error('❌ Error loading warehouse items:', error);
        searchResults.value = [];
      } finally {
        searchingItems.value = false;
      }
    };
    
    // ============================================
    // SECTION 9: UPDATED DISPATCH ACTIONS WITH STORE
    // ============================================
    const selectItemForDispatch = (item) => {
      if (!canPerformDispatch.value) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية لإجراء عمليات الصرف'
        });
        return;
      }
      selectedItemForDispatch.value = item;
      showDispatchModal.value = true;
    };
    
    const updateAvailableItems = () => {
      selectedItemForDispatch.value = null;
      // Clear search results when warehouse changes
      filteredDispatchItems.value = [];
      searchTerm.value = '';
    };
    
    const handleModalClose = () => {
      showDispatchModal.value = false;
      selectedItemForDispatch.value = null;
    };
    
    const handleDispatchSuccess = async (dispatchData) => {
      try {
        console.log('🚀 Starting dispatch from page with data:', dispatchData);
        console.log('📋 Complete dispatch data received:', dispatchData);
        
        // ✅ FIXED: Check for all possible field names
        // Get item ID from multiple possible fields
        const itemId = dispatchData.item_id || dispatchData.id;
        if (!itemId) {
          console.error('Missing item_id/id. Data:', dispatchData);
          throw new Error('معرف الصنف (item_id أو id) مفقود');
        }
        
        // Get from warehouse ID from multiple possible fields
        const fromWarehouseId = dispatchData.from_warehouse_id || dispatchData.sourceWarehouse;
        if (!fromWarehouseId) {
          console.error('Missing from_warehouse_id/sourceWarehouse. Data:', dispatchData);
          throw new Error('المخزن المصدر (from_warehouse_id أو sourceWarehouse) مفقود');
        }
        
        // Get destination from multiple possible fields
        let destination = dispatchData.destination;
        if (!destination) {
          destination = getDestinationLabel(dispatchData.destination_id) || 
                       getDestinationLabel(dispatchData.destinationBranch) ||
                       'موقع صرف';
        }
        
        const destinationId = dispatchData.destination_id || dispatchData.destinationBranch || 'external';
        
        // Get additional required data
        const itemName = dispatchData.item_name || selectedItemForDispatch.value?.name || 'صنف غير محدد';
        const itemCode = dispatchData.item_code || selectedItemForDispatch.value?.code || '';
        const fromWarehouseName = dispatchData.from_warehouse_name || getWarehouseLabel(fromWarehouseId);
        
        // Validate required fields
        const missingFields = [];
        if (!itemId) missingFields.push('item_id أو id');
        if (!fromWarehouseId) missingFields.push('from_warehouse_id أو sourceWarehouse');
        if (!destination) missingFields.push('destination أو destination_id أو destinationBranch');
        
        if (missingFields.length > 0) {
          console.error('❌ Missing required fields:', missingFields);
          console.error('Received data:', dispatchData);
          throw new Error(`بيانات الصرف غير مكتملة. الحقول المفقودة: ${missingFields.join('، ')}`);
        }

        // Prepare dispatch payload EXACTLY as store expects
        const dispatchPayload = {
          // REQUIRED FIELDS (must match store validation)
          item_id: itemId,
          from_warehouse_id: fromWarehouseId,
          destination: destination,
          
          // Detailed quantities (match store field names)
          cartons_count: dispatchData.cartons_count || 0,
          single_bottles_count: dispatchData.single_bottles_count || 0,
          per_carton_count: dispatchData.per_carton_count || 12,
          quantity: dispatchData.quantity || 0,
          
          // Additional data (match store field names)
          item_name: itemName,
          item_code: itemCode,
          from_warehouse_name: fromWarehouseName,
          destination_id: destinationId,
          notes: dispatchData.notes || 'صرف من خلال نظام الصرف',
          priority: dispatchData.priority || 'normal'
        };

        console.log('📤 Sending to store dispatchItem with payload:', dispatchPayload);
        
        // Call store dispatch action with properly formatted payload
        const result = await store.dispatch('dispatchItem', dispatchPayload);

        if (result?.success) {
          console.log('✅ Dispatch successful:', result);
          
          showDispatchModal.value = false;
          selectedItemForDispatch.value = null;
          currentHistoryPage.value = 1;
          
          store.dispatch('showNotification', {
            type: 'success',
            title: 'تم الصرف بنجاح',
            message: result.message || `تم صرف ${result.detailedUpdate?.remaining_quantity || 0} وحدة بنجاح`
          });
          
          // ✅ NEW: Refresh transactions from store (includes dispatch history)
          await store.dispatch('fetchTransactions');
          
          return result;
        } else {
          const errorMsg = result?.message || result?.error || 'فشل في عملية الصرف';
          throw new Error(errorMsg);
        }
        
      } catch (error) {
        console.error('❌ Error in dispatch:', error);
        console.error('Error details:', error.stack);
        
        // Show detailed error message
        let errorMessage = error.message || 'حدث خطأ في عملية الصرف';
        
        // Add more context for common errors
        if (error.message.includes('بيانات الصرف غير مكتملة')) {
          errorMessage += ' - يرجى التحقق من بيانات الصرف المطلوبة';
        } else if (error.message.includes('ليس لديك صلاحية')) {
          errorMessage += ' - يرجى التحقق من صلاحيات المستخدم';
        }
        
        store.dispatch('showNotification', {
          type: 'error',
          title: 'فشل الصرف',
          message: errorMessage
        });
        
        throw error; // Re-throw to let component handle it if needed
      }
    };
    
    const handleSearch = () => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }
      searchTimeout.value = setTimeout(() => {
        // Search is handled by computed property
      }, 300);
    };
    
    const applyHistoryFilters = () => {
      currentHistoryPage.value = 1;
      console.log('Applying filters:', {
        search: historySearch.value,
        warehouse: historyWarehouseFilter.value,
        dateFilter: dateFilter.value,
        history: filteredDispatchHistory.value.length
      });
    };
    
    const clearHistoryFilters = () => {
      historySearch.value = '';
      historyWarehouseFilter.value = '';
      dateFilter.value = 'all';
      customDateFrom.value = '';
      customDateTo.value = '';
      applyHistoryFilters();
    };
    
    const nextPage = () => {
      if (currentHistoryPage.value < totalHistoryPages.value) {
        currentHistoryPage.value++;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    const prevPage = () => {
      if (currentHistoryPage.value > 1) {
        currentHistoryPage.value--;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    // ✅ UPDATED: View dispatch details with better quantity display
    const viewDispatchDetails = (dispatch) => {
      const quantity = calculateDispatchQuantity(dispatch);
      const details = `
تفاصيل الصرف:

• الصنف: ${dispatch.item_name || 'غير محدد'}
• الكود: ${dispatch.item_code || 'N/A'}
• الكمية: ${quantity} وحدة
• من مخزن: ${getWarehouseLabel(dispatch.from_warehouse)}
• إلى: ${getDestinationLabel(dispatch.destination || dispatch.to_warehouse)}
• التاريخ: ${formatDateTime(dispatch.timestamp)}
• القيمة: ${formatCurrency(calculateDispatchValue(dispatch))}
• تم بواسطة: ${dispatch.user_name || dispatch.created_by || 'مستخدم النظام'}
• الملاحظات: ${dispatch.notes || 'لا توجد ملاحظات'}
      `;
      
      alert(details);
    };
    
    // ✅ UPDATED: Print dispatch with better quantity display
    const printDispatch = (dispatch) => {
      const printWindow = window.open('', '_blank');
      const quantity = calculateDispatchQuantity(dispatch);
      const printContent = `
        <html dir="rtl">
        <head>
          <title>طباعة صرف ${dispatch.item_name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap');
            body { font-family: 'Cairo', sans-serif; padding: 20px; background: white; color: black; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 15px; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #333; }
            .details { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
            .details th, .details td { padding: 8px 12px; border: 1px solid #ddd; text-align: right; }
            .details th { background-color: #f5f5f5; font-weight: bold; color: #333; }
            .signature { margin-top: 50px; padding-top: 20px; border-top: 2px solid #333; }
            .signature-section { display: flex; justify-content: space-between; margin-top: 30px; }
            .signature-box { width: 45%; text-align: center; }
            @media print { 
              body { padding: 10px; margin: 0; }
              .no-print { display: none !important; }
              @page { margin: 0.5in; }
            }
            .company-info { margin-bottom: 20px; text-align: center; font-size: 12px; color: #666; }
            .logo { width: 80px; height: 80px; background: #4f46e5; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 32px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">م</div>
            <div class="company-info">
              <div>نظام إدارة المخزون</div>
              <div>سند صرف مخزون</div>
              <div>${new Date().toLocaleDateString('ar-EG')}</div>
            </div>
          </div>
          
          <table class="details">
            <tr>
              <th>رقم العملية</th>
              <td>${dispatch.id || 'N/A'}</td>
            </tr>
            <tr>
              <th>اسم الصنف</th>
              <td>${dispatch.item_name || 'غير محدد'}</td>
            </tr>
            <tr>
              <th>كود الصنف</th>
              <td>${dispatch.item_code || 'N/A'}</td>
            </tr>
            <tr>
              <th>الكمية</th>
              <td>${quantity} وحدة</td>
            </tr>
            <tr>
              <th>من مخزن</th>
              <td>${getWarehouseLabel(dispatch.from_warehouse)}</td>
            </tr>
            <tr>
              <th>إلى</th>
              <td>${getDestinationLabel(dispatch.destination || dispatch.to_warehouse)}</td>
            </tr>
            <tr>
              <th>تاريخ الصرف</th>
              <td>${formatDateTime(dispatch.timestamp)}</td>
            </tr>
            <tr>
              <th>القيمة التقديرية</th>
              <td>${formatCurrency(calculateDispatchValue(dispatch))}</td>
            </tr>
            <tr>
              <th>تم بواسطة</th>
              <td>${dispatch.user_name || dispatch.created_by || 'مستخدم النظام'}</td>
            </tr>
            <tr>
              <th>ملاحظات</th>
              <td>${dispatch.notes || 'لا توجد ملاحظات'}</td>
            </tr>
          </table>
          
          <div class="signature">
            <div class="signature-section">
              <div class="signature-box">
                <p>توقيع المستلم:</p>
                <p style="margin-top: 60px;">___________________</p>
              </div>
              <div class="signature-box">
                <p>توقيع المسؤول:</p>
                <p style="margin-top: 60px;">___________________</p>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 30px; font-size: 10px; text-align: center; color: #999;">
            تم الإنشاء بواسطة نظام إدارة المخزون | ${new Date().toLocaleString('ar-EG')}
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => {
                window.close();
              }, 1000);
            }
          <\/script>
        </body>
        </html>
      `;
      
      printWindow.document.write(printContent);
      printWindow.document.close();
    };
    
    const exportDispatches = async () => {
      try {
        loading.value = true;
        
        const exportData = filteredDispatchHistory.value.map(dispatch => ({
          'رقم العملية': dispatch.id || '',
          'التاريخ': formatDate(dispatch.timestamp),
          'الوقت': formatTime(dispatch.timestamp),
          'اسم الصنف': dispatch.item_name || '',
          'كود الصنف': dispatch.item_code || '',
          'الكمية': calculateDispatchQuantity(dispatch),
          'من مخزن': getWarehouseLabel(dispatch.from_warehouse),
          'إلى': getDestinationLabel(dispatch.destination || dispatch.to_warehouse),
          'القيمة': calculateDispatchValue(dispatch),
          'تم بواسطة': dispatch.user_name || dispatch.created_by || 'مستخدم النظام',
          'ملاحظات': dispatch.notes || ''
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
          { wch: 15 },
          { wch: 12 },
          { wch: 10 },
          { wch: 25 },
          { wch: 15 },
          { wch: 10 },
          { wch: 20 },
          { wch: 20 },
          { wch: 15 },
          { wch: 15 },
          { wch: 30 }
        ];
        ws['!cols'] = wscols;
        
        XLSX.utils.book_append_sheet(wb, ws, 'عمليات الصرف');
        
        const filename = `عمليات_الصرف_${new Date().toISOString().split('T')[0]}.xlsx`;
        
        XLSX.writeFile(wb, filename);
        
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم تصدير ${exportData.length} عملية صرف بنجاح`
        });
        
      } catch (error) {
        console.error('Error exporting dispatches:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تصدير البيانات'
        });
      } finally {
        loading.value = false;
      }
    };
    
    // ✅ CORRECTED: Remove non-existent loadDispatchHistory function
    // The computed property filteredDispatchHistory handles filtering automatically
    
    // ============================================
    // SECTION 10: INVOICE SYSTEM ACTIONS WITH UPDATED CARTON LOGIC
    // ============================================
    const toggleInvoiceSystem = () => {
      showInvoiceSystem.value = !showInvoiceSystem.value;
      if (showInvoiceSystem.value) {
        loadInvoices();
      }
    };
    
    const createNewInvoice = () => {
      invoiceForm.value = {
        type: 'B2B',
        paymentMethod: 'cash',
        customer: {
          name: '',
          phone: '',
          taxId: '',
          address: ''
        },
        items: [],
        notes: '',
        warehouseId: '',
        status: 'draft'
      };
      selectedWarehouseForInvoice.value = '';
      itemSearch.value = '';
      searchResults.value = [];
      lastSearchSource.value = '';
      searchAllWarehouses.value = false;
      editingInvoice.value = null;
      showInvoiceForm.value = true;
    };
    
    const editInvoice = (invoice) => {
      invoiceForm.value = {
        ...invoice,
        customer: { ...invoice.customer },
        items: invoice.items.map(item => ({ ...item }))
      };
      selectedWarehouseForInvoice.value = invoice.warehouseId;
      itemSearch.value = '';
      searchResults.value = [];
      lastSearchSource.value = '';
      editingInvoice.value = invoice;
      showInvoiceForm.value = true;
      loadWarehouseItems();
    };
    
    const cancelInvoiceForm = () => {
      showInvoiceForm.value = false;
      invoiceForm.value = {
        type: 'B2B',
        paymentMethod: 'cash',
        customer: {
          name: '',
          phone: '',
          taxId: '',
          address: ''
        },
        items: [],
        notes: '',
        warehouseId: '',
        status: 'draft'
      };
      selectedWarehouseForInvoice.value = '';
      itemSearch.value = '';
      searchResults.value = [];
      lastSearchSource.value = '';
      searchAllWarehouses.value = false;
      editingInvoice.value = null;
    };
    
    const onInvoiceTypeChange = () => {
      if (invoiceForm.value.type !== 'B2B') {
        invoiceForm.value.customer.taxId = '';
      }
    };
    
    // UPDATED: Add item to invoice with dynamic carton logic
    const addItemToInvoice = (item) => {
      const existingItemIndex = invoiceForm.value.items.findIndex(i => i.id === item.id);
      
      if (existingItemIndex !== -1) {
        const existingItem = invoiceForm.value.items[existingItemIndex];
        
        // Check if we can add more quantity
        const availableCartons = Math.floor(item.remaining_quantity / (item.per_carton_count || 12));
        const availableSingles = item.remaining_quantity % (item.per_carton_count || 12);
        
        const currentTotalQuantity = existingItem.cartons_count * existingItem.per_carton_count + existingItem.single_bottles_count;
        const newTotalQuantity = currentTotalQuantity + 1;
        
        if (newTotalQuantity <= item.remaining_quantity) {
          // Increase quantity by 1 unit
          const newCartonsCount = Math.floor(newTotalQuantity / (item.per_carton_count || 12));
          const newSinglesCount = newTotalQuantity % (item.per_carton_count || 12);
          
          existingItem.quantity = newTotalQuantity;
          existingItem.cartons_count = newCartonsCount;
          existingItem.single_bottles_count = newSinglesCount;
          
          updateItemTotal(existingItemIndex);
          store.dispatch('showNotification', {
            type: 'success',
            message: `تم زيادة كمية ${item.name}`
          });
        } else {
          store.dispatch('showNotification', {
            type: 'warning',
            message: 'لا يمكن إضافة كمية أكثر من المتاح في المخزن'
          });
        }
      } else {
        // Add new item with carton logic
        const perCartonCount = item.per_carton_count || item.items_per_carton || 12;
        const availableCartons = Math.floor(item.remaining_quantity / perCartonCount);
        const availableSingles = item.remaining_quantity % perCartonCount;
        
        // Start with 1 unit
        const initialQuantity = 1;
        const initialCartons = Math.floor(initialQuantity / perCartonCount);
        const initialSingles = initialQuantity % perCartonCount;
        
        invoiceForm.value.items.push({
          id: item.id,
          name: item.name,
          code: item.code,
          unitPrice: item.sale_price || item.unitPrice || 0,
          quantity: initialQuantity,
          cartons_count: initialCartons,
          single_bottles_count: initialSingles,
          per_carton_count: perCartonCount,
          discount: 0,
          total: item.sale_price || item.unitPrice || 0,
          maxQuantity: item.remaining_quantity,
          availableCartons: availableCartons,
          availableSingles: availableSingles,
          warehouseId: item.warehouse_id,
          color: item.color,
          supplier: item.supplier,
          originalItem: item
        });
        
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم إضافة ${item.name} إلى الفاتورة`
        });
      }
      
      // Remove from search results
      searchResults.value = searchResults.value.filter(i => i.id !== item.id);
      
      if (itemSearch.value.trim() && itemSearch.value.trim().length >= 2) {
        searchItemsWithSpark();
      } else {
        loadWarehouseItems();
      }
    };
    
    const removeItem = (index) => {
      const itemName = invoiceForm.value.items[index].name;
      const removedItem = invoiceForm.value.items[index];
      
      invoiceForm.value.items.splice(index, 1);
      
      if (itemSearch.value.trim() && itemSearch.value.trim().length >= 2) {
        searchItemsWithSpark();
      } else {
        loadWarehouseItems();
      }
      
      store.dispatch('showNotification', {
        type: 'info',
        message: `تم إزالة ${itemName} من الفاتورة`
      });
    };
    
    // UPDATED: Quantity control functions with carton logic
    const increaseQuantity = (index) => {
      const item = invoiceForm.value.items[index];
      const perCarton = item.per_carton_count || 12;
      
      // Calculate total quantity in units
      const currentTotalUnits = item.cartons_count * perCarton + item.single_bottles_count;
      
      if (currentTotalUnits < item.maxQuantity) {
        // Increase by 1 unit
        const newTotalUnits = currentTotalUnits + 1;
        
        item.quantity = newTotalUnits;
        item.cartons_count = Math.floor(newTotalUnits / perCarton);
        item.single_bottles_count = newTotalUnits % perCarton;
        
        updateItemTotal(index);
      } else {
        store.dispatch('showNotification', {
          type: 'warning',
          message: 'لا يمكن إضافة كمية أكثر من المتاح في المخزن'
        });
      }
    };
    
    const decreaseQuantity = (index) => {
      const item = invoiceForm.value.items[index];
      const perCarton = item.per_carton_count || 12;
      
      // Calculate total quantity in units
      const currentTotalUnits = item.cartons_count * perCarton + item.single_bottles_count;
      
      if (currentTotalUnits > 1) {
        // Decrease by 1 unit
        const newTotalUnits = currentTotalUnits - 1;
        
        item.quantity = newTotalUnits;
        item.cartons_count = Math.floor(newTotalUnits / perCarton);
        item.single_bottles_count = newTotalUnits % perCarton;
        
        updateItemTotal(index);
      }
    };
    
    // Carton control functions
    const increaseCarton = (index) => {
      const item = invoiceForm.value.items[index];
      const perCarton = item.per_carton_count || 12;
      
      const newCartons = item.cartons_count + 1;
      const newTotalUnits = newCartons * perCarton + item.single_bottles_count;
      
      if (newTotalUnits <= item.maxQuantity) {
        item.cartons_count = newCartons;
        item.quantity = newTotalUnits;
        updateItemTotal(index);
      }
    };
    
    const decreaseCarton = (index) => {
      const item = invoiceForm.value.items[index];
      const perCarton = item.per_carton_count || 12;
      
      if (item.cartons_count > 0) {
        const newCartons = item.cartons_count - 1;
        const newTotalUnits = newCartons * perCarton + item.single_bottles_count;
        
        item.cartons_count = newCartons;
        item.quantity = newTotalUnits;
        updateItemTotal(index);
      }
    };
    
    // UPDATED: Validate item quantity with carton logic
    const validateItemQuantity = (index) => {
      const item = invoiceForm.value.items[index];
      const perCarton = item.per_carton_count || 12;
      
      // Convert quantity to total units
      const totalUnits = item.quantity;
      
      if (totalUnits > item.maxQuantity) {
        item.quantity = item.maxQuantity;
        
        // Recalculate cartons and singles
        item.cartons_count = Math.floor(item.maxQuantity / perCarton);
        item.single_bottles_count = item.maxQuantity % perCarton;
        
        store.dispatch('showNotification', {
          type: 'warning',
          message: 'تم ضبط الكمية إلى الحد الأقصى المتاح'
        });
      }
      
      if (totalUnits < 1) {
        item.quantity = 1;
        item.cartons_count = Math.floor(1 / perCarton);
        item.single_bottles_count = 1 % perCarton;
      } else {
        // Recalculate cartons and singles based on validated quantity
        item.cartons_count = Math.floor(totalUnits / perCarton);
        item.single_bottles_count = totalUnits % perCarton;
      }
      
      updateItemTotal(index);
    };
    
    const updateItemTotal = (index) => {
      const item = invoiceForm.value.items[index];
      const price = item.unitPrice || 0;
      const quantity = item.quantity || 0;
      const discount = item.discount || 0;
      
      const subtotal = price * quantity;
      const discountAmount = subtotal * (discount / 100);
      item.total = subtotal - discountAmount;
    };
    
    const filterInvoices = () => {
      currentPage.value = 1;
    };
    
    const nextInvoicePage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    const prevInvoicePage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    const viewInvoice = (invoice) => {
      const invoiceSubtotal = invoice.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      const invoiceDiscount = invoice.items.reduce((sum, item) => sum + ((item.unitPrice * item.quantity) * (item.discount / 100)), 0);
      const invoiceTax = (invoice.type === 'B2B' || invoice.type === 'B2C') ? (invoiceSubtotal - invoiceDiscount) * 0.14 : 0;
      const invoiceTotal = invoiceSubtotal - invoiceDiscount + invoiceTax;
      
      const details = `
تفاصيل الفاتورة:

• رقم الفاتورة: ${invoice.invoiceNumber}
• نوع الفاتورة: ${getInvoiceTypeLabel(invoice.type)}
• تاريخ الفاتورة: ${formatDate(invoice.date)}
• حالة الفاتورة: ${getInvoiceStatusLabel(invoice.status)}
• طريقة الدفع: ${invoice.paymentMethod === 'cash' ? 'نقدي' : 
                 invoice.paymentMethod === 'bank' ? 'تحويل بنكي' : 
                 invoice.paymentMethod === 'check' ? 'شيك' : 'آجل'}

معلومات العميل:
• الاسم: ${invoice.customer.name}
• الهاتف: ${invoice.customer.phone}
${invoice.customer.taxId ? `• الرقم الضريبي: ${invoice.customer.taxId}\n` : ''}${invoice.customer.address ? `• العنوان: ${invoice.customer.address}\n` : ''}
الأصناف:
${invoice.items.map((item, i) => `${i + 1}. ${item.name} (${item.code}) - ${item.quantity} × ${formatCurrency(item.unitPrice)} = ${formatCurrency(item.total)}`).join('\n')}

المجموع: ${formatCurrency(invoiceSubtotal)}
الخصم: ${formatCurrency(invoiceDiscount)}
${invoice.type === 'B2B' || invoice.type === 'B2C' ? `الضريبة (14%): ${formatCurrency(invoiceTax)}\n` : ''}الإجمالي النهائي: ${formatCurrency(invoiceTotal)}

ملاحظات: ${invoice.notes || 'لا توجد ملاحظات'}
      `;
      
      alert(details);
    };
    
    const printInvoice = (invoice) => {
      const printWindow = window.open('', '_blank');
      
      const invoiceSubtotal = invoice.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      const invoiceDiscount = invoice.items.reduce((sum, item) => sum + ((item.unitPrice * item.quantity) * (item.discount / 100)), 0);
      const invoiceTax = (invoice.type === 'B2B' || invoice.type === 'B2C') ? (invoiceSubtotal - invoiceDiscount) * 0.14 : 0;
      const invoiceTotal = invoiceSubtotal - invoiceDiscount + invoiceTax;
      
      const printContent = `
        <html dir="rtl">
        <head>
          <title>فاتورة ${invoice.invoiceNumber}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap');
            body { font-family: 'Cairo', sans-serif; padding: 20px; background: white; color: black; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 15px; }
            .company-info { margin-bottom: 20px; }
            .invoice-title { font-size: 28px; font-weight: bold; color: #333; margin-bottom: 10px; }
            .invoice-number { font-size: 18px; color: #666; margin-bottom: 10px; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .detail-box { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
            .detail-box h3 { margin-top: 0; color: #333; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th { background-color: #f5f5f5; padding: 10px; text-align: right; border: 1px solid #ddd; }
            .items-table td { padding: 10px; border: 1px solid #ddd; text-align: right; }
            .totals { margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 5px; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .total-final { font-size: 24px; font-weight: bold; color: #2e7d32; border-top: 2px solid #333; padding-top: 15px; margin-top: 15px; }
            .signature-section { margin-top: 50px; padding-top: 20px; border-top: 2px solid #333; }
            .signature-box { width: 45%; display: inline-block; text-align: center; }
            .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
            @media print { 
              body { padding: 10px; margin: 0; }
              .no-print { display: none !important; }
              @page { margin: 0.5in; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-info">
              <h1 class="invoice-title">فاتورة ضريبية</h1>
              <div class="invoice-number">رقم الفاتورة: ${invoice.invoiceNumber}</div>
              <div>تاريخ الفاتورة: ${formatDate(invoice.date)}</div>
              <div>نوع الفاتورة: ${getInvoiceTypeLabel(invoice.type)}</div>
            </div>
          </div>
          
          <div class="details-grid">
            <div class="detail-box">
              <h3>البائع (المورد)</h3>
              <div><strong>الاسم:</strong> شركة البران للعطور</div>
              <div><strong>السجل التجاري:</strong> 789456123</div>
              <div><strong>الرقم الضريبي:</strong> 123-456-789</div>
              <div><strong>العنوان:</strong> القاهرة، مصر</div>
              <div><strong>الهاتف:</strong> 01001234567</div>
            </div>
            
            <div class="detail-box">
              <h3>المشتري (العميل)</h3>
              <div><strong>الاسم:</strong> ${invoice.customer.name}</div>
              ${invoice.customer.taxId ? `<div><strong>الرقم الضريبي:</strong> ${invoice.customer.taxId}</div>` : ''}
              <div><strong>الهاتف:</strong> ${invoice.customer.phone}</div>
              ${invoice.customer.address ? `<div><strong>العنوان:</strong> ${invoice.customer.address}</div>` : ''}
              <div><strong>طريقة الدفع:</strong> ${invoice.paymentMethod === 'cash' ? 'نقدي' : 
                 invoice.paymentMethod === 'bank' ? 'تحويل بنكي' : 
                 invoice.paymentMethod === 'check' ? 'شيك' : 'آجل'}</div>
            </div>
          </div>
          
          <h3>تفاصيل الأصناف</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>اسم الصنف</th>
                <th>الكود</th>
                <th>الكمية</th>
                <th>سعر الوحدة</th>
                <th>الخصم %</th>
                <th>الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.name}</td>
                  <td>${item.code}</td>
                  <td>${item.quantity}</td>
                  <td>${formatCurrency(item.unitPrice)}</td>
                  <td>${item.discount}%</td>
                  <td>${formatCurrency(item.total)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div class="total-row">
              <span>المجموع:</span>
              <span>${formatCurrency(invoiceSubtotal)}</span>
            </div>
            <div class="total-row">
              <span>الخصم:</span>
              <span style="color: red;">-${formatCurrency(invoiceDiscount)}</span>
            </div>
            ${invoice.type === 'B2B' || invoice.type === 'B2C' ? `
            <div class="total-row">
              <span>الضريبة المضافة (14%):</span>
              <span>+${formatCurrency(invoiceTax)}</span>
            </div>
            ` : ''}
            <div class="total-row total-final">
              <span>الإجمالي النهائي:</span>
              <span>${formatCurrency(invoiceTotal)}</span>
            </div>
          </div>
          
          ${invoice.notes ? `
          <div style="margin-top: 30px; padding: 15px; background-color: #f0f0f0; border-radius: 5px;">
            <strong>ملاحظات:</strong> ${invoice.notes}
          </div>
          ` : ''}
          
          <div class="signature-section">
            <div class="signature-box">
              <p>توقيع البائع:</p>
              <p style="margin-top: 60px;">___________________</p>
            </div>
            <div class="signature-box">
              <p>توقيع المشتري:</p>
              <p style="margin-top: 60px;">___________________</p>
            </div>
          </div>
          
          <div class="footer">
            <p>شكراً لتعاملكم معنا</p>
            <p>تم الإنشاء بواسطة نظام إدارة المخزون والفواتير | ${new Date().toLocaleString('ar-EG')}</p>
            <p>هذه الفاتورة متوافقة مع لوائح مصلحة الضرائب المصرية</p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => {
                window.close();
              }, 1000);
            }
          <\/script>
        </body>
        </html>
      `;
      
      printWindow.document.write(printContent);
      printWindow.document.close();
    };
    
    const exportInvoicePDF = async (invoice) => {
      try {
        loading.value = true;
        
        const invoiceSubtotal = invoice.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        const invoiceDiscount = invoice.items.reduce((sum, item) => sum + ((item.unitPrice * item.quantity) * (item.discount / 100)), 0);
        const invoiceTax = (invoice.type === 'B2B' || invoice.type === 'B2C') ? (invoiceSubtotal - invoiceDiscount) * 0.14 : 0;
        const invoiceTotal = invoiceSubtotal - invoiceDiscount + invoiceTax;
        
        const element = document.createElement('div');
        element.innerHTML = `
          <div dir="rtl" style="font-family: 'Cairo', sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 15px;">
              <div style="margin-bottom: 20px;">
                <h1 style="font-size: 28px; font-weight: bold; color: #333; margin-bottom: 10px;">فاتورة ضريبية</h1>
                <div style="font-size: 18px; color: #666; margin-bottom: 10px;">رقم الفاتورة: ${invoice.invoiceNumber}</div>
                <div>تاريخ الفاتورة: ${formatDate(invoice.date)}</div>
                <div>نوع الفاتورة: ${getInvoiceTypeLabel(invoice.type)}</div>
              </div>
            </div>
            
            <!-- Company and Customer Info -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
              <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
                <h3 style="margin-top: 0; color: #333;">البائع (المورد)</h3>
                <div><strong>الاسم:</strong> شركة البران للعطور</div>
                <div><strong>السجل التجاري:</strong> 789456123</div>
                <div><strong>الرقم الضريبي:</strong> 123-456-789</div>
                <div><strong>العنوان:</strong> القاهرة، مصر</div>
                <div><strong>الهاتف:</strong> 01001234567</div>
              </div>
              
              <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
                <h3 style="margin-top: 0; color: #333;">المشتري (العميل)</h3>
                <div><strong>الاسم:</strong> ${invoice.customer.name}</div>
                ${invoice.customer.taxId ? `<div><strong>الرقم الضريبي:</strong> ${invoice.customer.taxId}</div>` : ''}
                <div><strong>الهاتف:</strong> ${invoice.customer.phone}</div>
                ${invoice.customer.address ? `<div><strong>العنوان:</strong> ${invoice.customer.address}</div>` : ''}
                <div><strong>طريقة الدفع:</strong> ${invoice.paymentMethod === 'cash' ? 'نقدي' : 
                   invoice.paymentMethod === 'bank' ? 'تحويل بنكي' : 
                   invoice.paymentMethod === 'check' ? 'شيك' : 'آجل'}</div>
              </div>
            </div>
            
            <!-- Items Table -->
            <h3 style="color: #333;">تفاصيل الأصناف</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #ddd;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">#</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">اسم الصنف</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">الكود</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">الكمية</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">سعر الوحدة</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">الخصم %</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map((item, index) => `
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${index + 1}</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${item.name}</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${item.code}</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${item.quantity}</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${formatCurrency(item.unitPrice)}</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${item.discount}%</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${formatCurrency(item.total)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <!-- Totals -->
            <div style="margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>المجموع:</span>
                <span>${formatCurrency(invoiceSubtotal)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>الخصم:</span>
                <span style="color: red;">-${formatCurrency(invoiceDiscount)}</span>
              </div>
              ${invoice.type === 'B2B' || invoice.type === 'B2C' ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>الضريبة المضافة (14%):</span>
                <span>+${formatCurrency(invoiceTax)}</span>
              </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 2px solid #333; font-size: 24px; font-weight: bold; color: #2e7d32;">
                <span>الإجمالي النهائي:</span>
                <span>${formatCurrency(invoiceTotal)}</span>
              </div>
            </div>
            
            ${invoice.notes ? `
            <div style="margin-top: 30px; padding: 15px; background-color: #f0f0f0; border-radius: 5px;">
              <strong>ملاحظات:</strong> ${invoice.notes}
            </div>
            ` : ''}
            
            <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #333;">
              <div style="display: flex; justify-content: space-between;">
                <div style="width: 45%; text-align: center;">
                  <p>توقيع البائع:</p>
                  <p style="margin-top: 60px;">___________________</p>
                </div>
                <div style="width: 45%; text-align: center;">
                  <p>توقيع المشتري:</p>
                  <p style="margin-top: 60px;">___________________</p>
                </div>
              </div>
            </div>
            
            <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
              <p>شكراً لتعاملكم معنا</p>
              <p>تم الإنشاء بواسطة نظام إدارة المخزون والفواتير | ${new Date().toLocaleString('ar-EG')}</p>
              <p>هذه الفاتورة متوافقة مع لوائح مصلحة الضرائب المصرية</p>
            </div>
          </div>
        `;
        
        const opt = {
          margin: [10, 10, 10, 10],
          filename: `فاتورة_${invoice.invoiceNumber}_${new Date().toISOString().split('T')[0]}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: true,
            allowTaint: true
          },
          jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
          },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        
        await html2pdf().set(opt).from(element).save();
        
        store.dispatch('showNotification', {
          type: 'success',
          message: 'تم تصدير الفاتورة كملف PDF بنجاح'
        });
        
      } catch (error) {
        console.error('Error exporting invoice to PDF:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تصدير الفاتورة كملف PDF'
        });
      } finally {
        loading.value = false;
      }
    };
    
    const exportToPDF = async () => {
      try {
        loading.value = true;
        
        if (invoices.value.length === 0) {
          store.dispatch('showNotification', {
            type: 'warning',
            message: 'لا توجد فواتير للتصدير'
          });
          return;
        }
        
        const element = document.createElement('div');
        element.innerHTML = `
          <div dir="rtl" style="font-family: 'Cairo', sans-serif; padding: 20px; max-width: 1200px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 15px;">
              <h1 style="font-size: 28px; font-weight: bold; color: #333; margin-bottom: 10px;">تقرير جميع الفواتير</h1>
              <div style="color: #666; font-size: 16px;">تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</div>
              <div style="color: #666; font-size: 14px;">إجمالي عدد الفواتير: ${invoices.value.length}</div>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #ddd;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">#</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">رقم الفاتورة</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">التاريخ</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">العميل</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">النوع</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">المبلغ</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">الحالة</th>
                </tr>
              </thead>
              <tbody>
                ${invoices.value.map((invoice, index) => {
                  const invoiceSubtotal = invoice.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
                  const invoiceDiscount = invoice.items.reduce((sum, item) => sum + ((item.unitPrice * item.quantity) * (item.discount / 100)), 0);
                  const invoiceTax = (invoice.type === 'B2B' || invoice.type === 'B2C') ? (invoiceSubtotal - invoiceDiscount) * 0.14 : 0;
                  const invoiceTotal = invoiceSubtotal - invoiceDiscount + invoiceTax;
                  
                  return `
                    <tr>
                      <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${index + 1}</td>
                      <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${invoice.invoiceNumber}</td>
                      <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${formatDate(invoice.date)}</td>
                      <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${invoice.customer.name}</td>
                      <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${getInvoiceTypeLabel(invoice.type)}</td>
                      <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${formatCurrency(invoiceTotal)}</td>
                      <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${getInvoiceStatusLabel(invoice.status)}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
            
            <div style="margin-top: 40px; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
              <h3 style="color: #333; margin-bottom: 20px;">إحصائيات الفواتير</h3>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                <div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>إجمالي عدد الفواتير:</span>
                    <span style="font-weight: bold;">${totalInvoices.value}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>إجمالي المبيعات:</span>
                    <span style="font-weight: bold;">${formatCurrency(totalSales.value)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>إجمالي الضريبة:</span>
                    <span style="font-weight: bold;">${formatCurrency(totalTax.value)}</span>
                  </div>
                </div>
                <div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>عدد العملاء:</span>
                    <span style="font-weight: bold;">${uniqueCustomers.value}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>متوسط قيمة الفاتورة:</span>
                    <span style="font-weight: bold;">${formatCurrency(totalSales.value / (totalInvoices.value || 1))}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>آخر تحديث:</span>
                    <span style="font-weight: bold;">${new Date().toLocaleString('ar-EG')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
              <p>تم الإنشاء بواسطة نظام إدارة المخزون والفواتير</p>
              <p>جميع الحقوق محفوظة © ${new Date().getFullYear()}</p>
            </div>
          </div>
        `;
        
        const opt = {
          margin: [10, 10, 10, 10],
          filename: `تقرير_الفواتير_${new Date().toISOString().split('T')[0]}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: true,
            allowTaint: true
          },
          jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'landscape',
            compress: true
          },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        
        await html2pdf().set(opt).from(element).save();
        
        store.dispatch('showNotification', {
          type: 'success',
          message: 'تم تصدير جميع الفواتير كملف PDF بنجاح'
        });
        
      } catch (error) {
        console.error('Error exporting invoices to PDF:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تصدير الفواتير كملف PDF'
        });
      } finally {
        loading.value = false;
      }
    };
    
    const exportInvoicesToExcel = () => {
      try {
        loading.value = true;
        
        if (invoices.value.length === 0) {
          store.dispatch('showNotification', {
            type: 'warning',
            message: 'لا توجد فواتير للتصدير'
          });
          return;
        }
        
        const exportData = invoices.value.map(invoice => {
          const invoiceSubtotal = invoice.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
          const invoiceDiscount = invoice.items.reduce((sum, item) => sum + ((item.unitPrice * item.quantity) * (item.discount / 100)), 0);
          const invoiceTax = (invoice.type === 'B2B' || invoice.type === 'B2C') ? (invoiceSubtotal - invoiceDiscount) * 0.14 : 0;
          const invoiceTotal = invoiceSubtotal - invoiceDiscount + invoiceTax;
          
          return {
            'رقم الفاتورة': invoice.invoiceNumber,
            'تاريخ الفاتورة': formatDate(invoice.date),
            'نوع الفاتورة': getInvoiceTypeLabel(invoice.type),
            'حالة الفاتورة': getInvoiceStatusLabel(invoice.status),
            'اسم العميل': invoice.customer.name,
            'هاتف العميل': invoice.customer.phone,
            'الرقم الضريبي': invoice.customer.taxId || '',
            'عنوان العميل': invoice.customer.address || '',
            'طريقة الدفع': invoice.paymentMethod === 'cash' ? 'نقدي' : 
                           invoice.paymentMethod === 'bank' ? 'تحويل بنكي' : 
                           invoice.paymentMethod === 'check' ? 'شيك' : 'آجل',
            'عدد الأصناف': invoice.items?.length || 0,
            'المجموع': invoiceSubtotal,
            'الخصم': invoiceDiscount,
            'الضريبة': invoiceTax,
            'الإجمالي النهائي': invoiceTotal,
            'ملاحظات': invoice.notes || ''
          };
        });
        
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);
        
        const wscols = [
          { wch: 15 }, // رقم الفاتورة
          { wch: 12 }, // تاريخ الفاتورة
          { wch: 20 }, // نوع الفاتورة
          { wch: 15 }, // حالة الفاتورة
          { wch: 25 }, // اسم العميل
          { wch: 15 }, // هاتف العميل
          { wch: 20 }, // الرقم الضريبي
          { wch: 30 }, // عنوان العميل
          { wch: 15 }, // طريقة الدفع
          { wch: 12 }, // عدد الأصناف
          { wch: 15 }, // المجموع
          { wch: 15 }, // الخصم
          { wch: 15 }, // الضريبة
          { wch: 18 }, // الإجمالي النهائي
          { wch: 30 }  // ملاحظات
        ];
        ws['!cols'] = wscols;
        
        XLSX.utils.book_append_sheet(wb, ws, 'الفواتير');
        
        const filename = `الفواتير_${new Date().toISOString().split('T')[0]}.xlsx`;
        
        XLSX.writeFile(wb, filename);
        
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم تصدير ${exportData.length} فاتورة بنجاح`
        });
        
      } catch (error) {
        console.error('Error exporting invoices to Excel:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تصدير الفواتير'
        });
      } finally {
        loading.value = false;
      }
    };
    
    const saveInvoice = async () => {
      if (!canSaveInvoice.value) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'يرجى ملء جميع البيانات المطلوبة'
        });
        return;
      }

      saving.value = true;

      try {
        // Validate customer phone
        const phone = invoiceForm.value.customer.phone.replace(/\D/g, '');
        if (phone.length < 10) {
          store.dispatch('showNotification', {
            type: 'error',
            message: 'رقم الهاتف غير صحيح'
          });
          saving.value = false;
          return;
        }

        // Validate tax ID for B2B invoices
        if (invoiceForm.value.type === 'B2B' && invoiceForm.value.customer.taxId) {
          const taxId = invoiceForm.value.customer.taxId.replace(/\D/g, '');
          if (taxId.length !== 14) {
            store.dispatch('showNotification', {
              type: 'error',
              message: 'الرقم الضريبي يجب أن يكون 14 رقمًا'
            });
            saving.value = false;
            return;
          }
        }

        // Validate items
        if (invoiceForm.value.items.length === 0) {
          store.dispatch('showNotification', {
            type: 'error',
            message: 'يرجى إضافة أصناف إلى الفاتورة'
          });
          saving.value = false;
          return;
        }

        // Validate warehouse
        if (!selectedWarehouseForInvoice.value) {
          store.dispatch('showNotification', {
            type: 'error',
            message: 'يرجى اختيار مخزن'
          });
          saving.value = false;
          return;
        }

        // Calculate totals
        const subtotal = invoiceForm.value.items.reduce((sum, item) => {
          return sum + ((item.unitPrice || 0) * (item.quantity || 0));
        }, 0);

        const totalDiscount = invoiceForm.value.items.reduce((sum, item) => {
          const itemSubtotal = (item.unitPrice || 0) * (item.quantity || 0);
          return sum + (itemSubtotal * ((item.discount || 0) / 100));
        }, 0);

        const taxAmount = (invoiceForm.value.type === 'B2B' || invoiceForm.value.type === 'B2C') ? (subtotal - totalDiscount) * 0.14 : 0;
        const totalAmount = subtotal - totalDiscount + taxAmount;

        // Generate invoice number
        const timestamp = new Date().getTime();
        const invoiceNumber = editingInvoice.value ? editingInvoice.value.invoiceNumber : `INV-${timestamp.toString().slice(-8)}`;

        // Prepare invoice data
        const invoiceData = {
          invoiceNumber,
          type: invoiceForm.value.type,
          paymentMethod: invoiceForm.value.paymentMethod,
          customer: {
            name: invoiceForm.value.customer.name.trim(),
            phone: invoiceForm.value.customer.phone.trim(),
            taxId: invoiceForm.value.customer.taxId.trim(),
            address: invoiceForm.value.customer.address.trim()
          },
          items: invoiceForm.value.items.map(item => ({
            id: item.id,
            name: item.name,
            code: item.code || '',
            unitPrice: item.unitPrice || 0,
            quantity: item.quantity || 0,
            discount: item.discount || 0,
            total: item.total || 0,
            cartons_count: item.cartons_count || 0,
            single_bottles_count: item.single_bottles_count || 0,
            per_carton_count: item.per_carton_count || 12,
            warehouseId: item.warehouseId || selectedWarehouseForInvoice.value
          })),
          notes: invoiceForm.value.notes.trim(),
          warehouseId: selectedWarehouseForInvoice.value,
          status: editingInvoice.value ? editingInvoice.value.status : 'draft',
          date: editingInvoice.value ? editingInvoice.value.date : new Date().toISOString(),
          subtotal,
          totalDiscount,
          taxAmount,
          totalAmount,
          createdBy: userName.value,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Save to Firebase
        if (editingInvoice.value) {
          // Update existing invoice
          const invoiceDoc = doc(db, 'invoices', editingInvoice.value.id);
          await updateDoc(invoiceDoc, invoiceData);
          
          store.dispatch('showNotification', {
            type: 'success',
            message: 'تم تحديث الفاتورة بنجاح'
          });
        } else {
          // Create new invoice
          const invoicesRef = collection(db, 'invoices');
          await addDoc(invoicesRef, invoiceData);
          
          store.dispatch('showNotification', {
            type: 'success',
            message: 'تم حفظ الفاتورة بنجاح'
          });
        }

        // Reset form and reload invoices
        showInvoiceForm.value = false;
        invoiceForm.value = {
          type: 'B2B',
          paymentMethod: 'cash',
          customer: {
            name: '',
            phone: '',
            taxId: '',
            address: ''
          },
          items: [],
          notes: '',
          warehouseId: '',
          status: 'draft'
        };
        selectedWarehouseForInvoice.value = '';
        editingInvoice.value = null;
        loadInvoices();

      } catch (error) {
        console.error('Error saving invoice:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في حفظ الفاتورة'
        });
      } finally {
        saving.value = false;
      }
    };
    
    const saveAndPrint = async () => {
      await saveInvoice();
      if (!saving.value) {
        // Find the newly created/updated invoice
        const latestInvoice = invoices.value[0];
        if (latestInvoice) {
          setTimeout(() => {
            printInvoice(latestInvoice);
          }, 500);
        }
      }
    };
    
    const deleteInvoice = async (invoiceId) => {
      if (!confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
        return;
      }

      try {
        loading.value = true;
        
        const invoiceDoc = doc(db, 'invoices', invoiceId);
        await deleteDoc(invoiceDoc);
        
        invoices.value = invoices.value.filter(inv => inv.id !== invoiceId);
        
        store.dispatch('showNotification', {
          type: 'success',
          message: 'تم حذف الفاتورة بنجاح'
        });
        
      } catch (error) {
        console.error('Error deleting invoice:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في حذف الفاتورة'
        });
      } finally {
        loading.value = false;
      }
    };
    
    const loadInvoices = async () => {
      try {
        loading.value = true;
        
        const invoicesRef = collection(db, 'invoices');
        const q = query(
          invoicesRef,
          orderBy('createdAt', 'desc'),
          limit(100)
        );
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          invoices.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          loading.value = false;
        });
        
        // Store unsubscribe function
        onUnmounted(() => {
          if (unsubscribe) unsubscribe();
        });
        
      } catch (error) {
        console.error('Error loading invoices:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تحميل الفواتير'
        });
        loading.value = false;
      }
    };
    
    // ============================================
    // SECTION 11: LIFE CYCLE HOOKS
    // ============================================
    onMounted(async () => {
      // Load initial data
      try {
        loading.value = true;
        
        // Ensure store has latest data
        await Promise.all([
          store.dispatch('fetchInventory'),
          store.dispatch('fetchTransactions'),
          store.dispatch('fetchWarehouses')
        ]);
        
        console.log('✅ Store data loaded successfully');
        console.log('📊 Inventory items:', allInventory.value.length);
        console.log('📊 Transaction items:', allTransactions.value.length);
        console.log('📊 Warehouse items:', allWarehouses.value.length);
        console.log('📊 Dispatch transactions:', dispatchTransactions.value.length);
        
      } catch (error) {
        console.error('❌ Error loading initial data:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تحميل البيانات الأولية'
        });
      } finally {
        loading.value = false;
      }
    });
    
    onUnmounted(() => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }
      if (searchDebounceTimeout.value) {
        clearTimeout(searchDebounceTimeout.value);
      }
      if (dispatchSearchDebounceTimeout.value) {
        clearTimeout(dispatchSearchDebounceTimeout.value);
      }
      if (realtimeUnsubscribe.value) {
        realtimeUnsubscribe.value();
      }
    });
    
    // Watch for user authentication changes
    watch(
      () => store.getters.isAuthenticated,
      (isAuthenticated) => {
        if (isAuthenticated) {
          // User is authenticated, refresh data
          store.dispatch('fetchInventory');
          store.dispatch('fetchTransactions');
          store.dispatch('fetchWarehouses');
        }
      }
    );
    
    // Watch for warehouse selection in dispatch
    watch(selectedWarehouse, () => {
      updateAvailableItems();
    });
    
    // Watch for warehouse selection in invoice
    watch(selectedWarehouseForInvoice, () => {
      loadWarehouseItems();
    });
    
    // Watch for search term in dispatch
    watch(searchTerm, () => {
      handleDispatchSearch();
    });
    
    // Watch for search term in invoice
    watch(itemSearch, () => {
      debouncedSearchItems();
    });
    
    // Watch for invoice system toggle
    watch(showInvoiceSystem, (newValue) => {
      if (newValue) {
        loadInvoices();
      }
    });
    
    // Return all reactive properties and methods
    return {
      // State
      loading,
      showDispatchModal,
      selectedWarehouse,
      selectedItemForDispatch,
      searchTerm,
      historySearch,
      historyWarehouseFilter,
      dateFilter,
      customDateFrom,
      customDateTo,
      currentHistoryPage,
      itemsPerPage,
      showAllItems,
      showInvoiceSystem,
      showInvoiceForm,
      saving,
      invoiceSearchTerm,
      invoiceStatusFilter,
      invoiceTypeFilter,
      itemSearch,
      currentPage,
      itemsPerPageInvoices,
      selectedWarehouseForInvoice,
      searchingItems,
      searchResults,
      lastSearchSource,
      searchAllWarehouses,
      searchingDispatchItems,
      filteredDispatchItems,
      lastDispatchSearchSource,
      invoiceForm,
      editingInvoice,
      invoices,
      
      // Computed
      userRole,
      userName,
      userProfile,
      dispatchTransactions,
      dispatchHistoryLoading,
      canExport,
      accessibleWarehouses,
      availableWarehouses,
      availableWarehousesForDispatch,
      canViewDispatches,
      canPerformDispatch,
      filteredSearchResults,
      totalItemsInWarehouse,
      dispatchHistory,
      totalDispatches,
      monthlyDispatches,
      totalDispatchedQuantity,
      totalDispatchValue,
      availableItems,
      displayedAvailableItems,
      filteredDispatchHistory,
      totalHistoryPages,
      startIndex,
      endIndex,
      paginatedHistory,
      hasFilters,
      totalInvoices,
      totalSales,
      totalTax,
      uniqueCustomers,
      filteredInvoices,
      totalPages,
      startInvoiceIndex,
      endInvoiceIndex,
      paginatedInvoices,
      subtotal,
      totalDiscount,
      taxAmount,
      totalAmount,
      totalQuantity,
      hasCartonItems,
      totalCartons,
      totalSingles,
      canSaveInvoice,
      
      // Methods
      formatNumber,
      formatCurrency,
      formatDate,
      formatTime,
      formatDateTime,
      getWarehouseLabel,
      getDestinationLabel,
      getDateFilterLabel,
      getSearchSourceLabel,
      calculateDispatchQuantity,
      calculateDispatchValue,
      getDispatchQuantityClass,
      getDispatchQuantity,
      getQuantityClass,
      getInvoiceTypeLabel,
      getInvoiceTypeClass,
      getInvoiceStatusLabel,
      getInvoiceStatusClass,
      selectItemForDispatch,
      updateAvailableItems,
      handleModalClose,
      handleDispatchSuccess,
      handleSearch,
      applyHistoryFilters,
      clearHistoryFilters,
      nextPage,
      prevPage,
      viewDispatchDetails,
      printDispatch,
      exportDispatches,
      toggleInvoiceSystem,
      createNewInvoice,
      editInvoice,
      cancelInvoiceForm,
      onInvoiceTypeChange,
      debouncedSearchItems,
      searchItemsWithSpark,
      handleDispatchSearch,
      searchDispatchItemsWithSpark,
      loadWarehouseItems,
      addItemToInvoice,
      removeItem,
      increaseQuantity,
      decreaseQuantity,
      increaseCarton,
      decreaseCarton,
      validateItemQuantity,
      updateItemTotal,
      filterInvoices,
      nextInvoicePage,
      prevInvoicePage,
      viewInvoice,
      printInvoice,
      exportInvoicePDF,
      exportToPDF,
      exportInvoicesToExcel,
      saveInvoice,
      saveAndPrint,
      deleteInvoice,
      loadInvoices
    };
  }
};
</script>

<style scoped>
/* ============================================ */
/* MOBILE-FIRST RESPONSIVE STYLES */
/* ============================================ */

/* Base Styles */
.min-h-screen {
  min-height: 100vh;
}

/* Header Styles */
.sticky {
  position: sticky;
}

/* Button Styles */
.btn-primary {
  @apply inline-flex items-center px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap;
}

.btn-secondary {
  @apply inline-flex items-center px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap;
}

.btn-success {
  @apply inline-flex items-center px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap;
}

/* Stat Cards */
.stat-card {
  @apply bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 flex items-center space-x-2 sm:space-x-3 space-x-reverse hover:shadow-md transition-shadow duration-200;
}

.stat-icon {
  @apply h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center flex-shrink-0;
}

/* Form Styles */
.input-field {
  @apply w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white;
}

.invoice-form-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4;
}

.form-field-container {
  @apply sm:col-span-1;
}

.form-field-full {
  @apply lg:col-span-2;
}

/* Search Input */
.search-input {
  @apply w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-10 pr-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400;
}

/* Search Stats */
.search-stats-container {
  @apply flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3 sm:mb-4;
}

.search-source-badge {
  @apply px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-xs font-medium;
}

/* Search Results Grid */
.search-results-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 max-h-[300px] overflow-y-auto p-1;
}

.search-result-card {
  @apply p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm active:scale-98;
}

/* Empty States */
.search-empty-state {
  @apply text-center py-6 sm:py-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg;
}

/* Search Tips */
.search-tips-container {
  @apply mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg;
}

.search-tips-title {
  @apply text-xs font-medium text-blue-700 dark:text-blue-300 mb-2 flex items-center;
}

.search-tips-list {
  @apply space-y-1 text-xs text-blue-600 dark:text-blue-400;
}

.search-tip-item {
  @apply flex items-start;
}

.search-tip-highlight {
  @apply text-green-600 dark:text-green-400 font-medium;
}

/* Selected Items */
.selected-items-container {
  @apply border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden;
}

.selected-item-card {
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-3;
}

.dispatch-table-row {
  @apply hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150;
}

/* Invoice Summary */
.invoice-summary-card {
  @apply bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6;
}

/* Pagination */
.pagination-container {
  @apply px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700;
}

.pagination-btn {
  @apply px-2.5 sm:px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed;
}

/* Filters Container */
.filters-container {
  @apply flex flex-wrap items-center gap-2;
}

/* Action Buttons */
.action-btn {
  @apply p-1 sm:p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-150;
}

/* Available Items Grid */
.available-items-grid-fixed {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3;
}

/* Dispatch Table */
.dispatch-table-container {
  @apply bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden;
}

.dispatch-table-header {
  @apply bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600;
}

/* Animation Utilities */
.scale-98 {
  transform: scale(0.98);
}

/* Responsive Text */
@media (max-width: 640px) {
  .text-xs-mobile {
    font-size: 0.75rem;
  }
  
  .text-sm-mobile {
    font-size: 0.875rem;
  }
}

/* Print Styles */
@media print {
  .no-print {
    display: none !important;
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
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

/* Hover Effects */
.hover-lift {
  transition: transform 0.2s ease-in-out;
}

.hover-lift:hover {
  transform: translateY(-2px);
}

/* Loading Spinner */
.spinner {
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

/* Transition Utilities */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

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

/* Mobile Optimizations */
@media (max-width: 640px) {
  .invoice-form-container {
    max-height: calc(100vh - 120px) !important;
  }
  
  .search-results-grid {
    max-height: 200px !important;
  }
  
  .dispatch-table-row {
    grid-template-columns: repeat(1, 1fr) !important;
    gap: 0.5rem !important;
  }
}

/* Dark Mode Overrides */
.dark .bg-gray-50 {
  background-color: #111827 !important;
}

.dark .bg-gray-100 {
  background-color: #1f2937 !important;
}

.dark .text-gray-600 {
  color: #d1d5db !important;
}

.dark .border-gray-200 {
  border-color: #374151 !important;
}

/* Invoice Form Specific */
.warehouse-select-container {
  @apply max-w-4xl mx-auto;
}

/* Carton Styles */
.carton-control {
  @apply flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg;
}

/* Responsive Table Fixes */
@media (max-width: 1024px) {
  .dispatch-table-header {
    display: none !important;
  }
  
  .dispatch-table-row {
    display: flex !important;
    flex-direction: column !important;
    gap: 0.75rem !important;
    padding: 1rem !important;
  }
}

/* Invoice Print Optimizations */
@media print {
  body {
    background: white !important;
    color: black !important;
    font-size: 12pt !important;
  }
  
  .invoice-form-container,
  .dispatch-table-container,
  .no-print {
    display: none !important;
  }
  
  .print-only {
    display: block !important;
  }
}

/* Utility Classes */
.whitespace-nowrap {
  white-space: nowrap;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.min-w-0 {
  min-width: 0;
}

.flex-1 {
  flex: 1 1 0%;
}

/* Z-index Management */
.z-10 {
  z-index: 10;
}

.z-20 {
  z-index: 20;
}

.z-50 {
  z-index: 50;
}

/* Loading Overlay */
.fixed.inset-0 {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

/* Animation Delays */
.delay-75 {
  animation-delay: 75ms;
}

.delay-100 {
  animation-delay: 100ms;
}

.delay-150 {
  animation-delay: 150ms;
}

/* Smooth Transitions */
.smooth-transition {
  @apply transition-all duration-300 ease-in-out;
}

/* Card Hover Effects */
.hover-card {
  @apply transition-all duration-200 hover:shadow-lg hover:-translate-y-1;
}

/* Gradient Backgrounds */
.gradient-primary {
  @apply bg-gradient-to-r from-blue-600 to-indigo-600;
}

.gradient-success {
  @apply bg-gradient-to-r from-green-600 to-emerald-600;
}

.gradient-warning {
  @apply bg-gradient-to-r from-yellow-600 to-orange-600;
}

/* Invoice Status Badges */
.invoice-status-badge {
  @apply px-2 py-1 rounded-full text-xs font-medium;
}

/* Mobile Touch Targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Responsive Grid Adjustments */
@media (min-width: 640px) and (max-width: 767px) {
  .sm-grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .md-grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Custom Invoice Styles */
.invoice-header {
  @apply bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6 rounded-t-xl;
}

.invoice-item-row {
  @apply hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors duration-150;
}

/* Dispatch Specific Styles */
.dispatch-quantity-badge {
  @apply bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 px-2 py-1 rounded-full text-xs font-medium;
}

/* Search Highlight */
.search-highlight {
  @apply bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-200;
}

/* Loading States */
.loading-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.dark .loading-shimmer {
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200% 100%;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Custom Responsive Breakpoints */
@media (max-width: 380px) {
  .xs-flex-col {
    flex-direction: column;
  }
  
  .xs-w-full {
    width: 100%;
  }
}

/* Print Optimization */
.print-optimized {
  @media print {
    color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}

/* Accessibility */
.focus-visible {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

/* Invoice Form Specific */
.invoice-form-step {
  @apply mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700;
}

.step-number {
  @apply h-6 w-6 sm:h-7 sm:w-7 rounded-full flex items-center justify-center text-xs font-bold;
}

/* Carton Information */
.carton-info {
  @apply text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded;
}

/* Responsive Invoice Table */
@media (max-width: 767px) {
  .invoice-table-mobile {
    display: block;
  }
  
  .invoice-table-desktop {
    display: none;
  }
}

@media (min-width: 768px) {
  .invoice-table-mobile {
    display: none;
  }
  
  .invoice-table-desktop {
    display: table;
  }
}

/* SPARK Search Specific */
.spark-search-indicator {
  @apply absolute top-1/2 transform -translate-y-1/2 left-3 text-blue-500;
}

.spark-search-loading {
  @apply animate-pulse text-blue-500 text-xs;
}

/* Dispatch History Filters */
.active-filter-badge {
  @apply inline-flex items-center px-2 py-1 rounded-full text-xs font-medium;
}

/* Invoice Payment Methods */
.payment-method-badge {
  @apply px-2 py-1 rounded-full text-xs font-medium;
}

.payment-cash {
  @apply bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300;
}

.payment-bank {
  @apply bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300;
}

.payment-check {
  @apply bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300;
}

.payment-credit {
  @apply bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300;
}

/* Warehouse Labels */
.warehouse-label {
  @apply text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 truncate;
}

/* Item Quantity Indicators */
.quantity-low {
  @apply bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300;
}

.quantity-medium {
  @apply bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300;
}

.quantity-high {
  @apply bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300;
}

/* Animation for Notifications */
.notification-slide {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Smooth Fade Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Modal Backdrop */
.modal-backdrop {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

/* Responsive Modal */
@media (max-width: 640px) {
  .modal-content {
    @apply mx-4 max-w-full;
  }
}

/* Invoice Total Highlight */
.invoice-total-highlight {
  @apply text-lg sm:text-xl font-bold text-green-600 dark:text-green-400;
}

/* Dispatch Value Display */
.dispatch-value {
  @apply font-medium text-gray-900 dark:text-white;
}

/* Custom Border Utilities */
.border-hairline {
  border-width: 0.5px;
}

/* Responsive Padding Utilities */
.p-responsive {
  @apply px-3 sm:px-4 lg:px-6;
}

/* Mobile Bottom Safe Area */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 1rem);
}

/* Invoice Items Scroll Container */
.invoice-items-scroll {
  max-height: 400px;
  overflow-y: auto;
}

@media (max-width: 640px) {
  .invoice-items-scroll {
    max-height: 300px;
  }
}

/* Dispatch History Table Container */
.dispatch-history-container {
  max-height: 600px;
  overflow-y: auto;
}

@media (max-width: 1024px) {
  .dispatch-history-container {
    max-height: 500px;
  }
}

/* Search Results Scroll */
.search-results-scroll {
  max-height: 400px;
  overflow-y: auto;
}

/* Custom Scrollbar for Search */
.search-results-scroll::-webkit-scrollbar {
  width: 4px;
}

.search-results-scroll::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

/* Invoice Form Scroll */
.invoice-form-scroll {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

/* Responsive Text Sizes */
.text-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

.text-responsive-lg {
  @apply text-sm sm:text-base lg:text-lg;
}

.text-responsive-xl {
  @apply text-base sm:text-lg lg:text-xl;
}

/* Grid Responsive Utilities */
.grid-responsive {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4;
}

/* Flex Responsive Utilities */
.flex-responsive {
  @apply flex flex-col sm:flex-row;
}

/* Space Responsive Utilities */
.space-responsive-x {
  @apply space-x-0 sm:space-x-2 lg:space-x-4;
}

.space-responsive-y {
  @apply space-y-2 sm:space-y-3 lg:space-y-4;
}

/* Gap Responsive Utilities */
.gap-responsive {
  @apply gap-2 sm:gap-3 lg:gap-4;
}

/* Margin Responsive Utilities */
.m-responsive {
  @apply m-2 sm:m-3 lg:m-4;
}

.mx-responsive {
  @apply mx-2 sm:mx-3 lg:mx-4;
}

.my-responsive {
  @apply my-2 sm:my-3 lg:my-4;
}

.mt-responsive {
  @apply mt-2 sm:mt-3 lg:mt-4;
}

.mb-responsive {
  @apply mb-2 sm:mb-3 lg:mb-4;
}

.ml-responsive {
  @apply ml-2 sm:ml-3 lg:ml-4;
}

.mr-responsive {
  @apply mr-2 sm:mr-3 lg:mr-4;
}

/* Padding Responsive Utilities */
.p-responsive {
  @apply p-2 sm:p-3 lg:p-4;
}

.px-responsive {
  @apply px-2 sm:px-3 lg:px-4;
}

.py-responsive {
  @apply py-2 sm:py-3 lg:py-4;
}

.pt-responsive {
  @apply pt-2 sm:pt-3 lg:pt-4;
}

.pb-responsive {
  @apply pb-2 sm:pb-3 lg:pb-4;
}

.pl-responsive {
  @apply pl-2 sm:pl-3 lg:pl-4;
}

.pr-responsive {
  @apply pr-2 sm:pr-3 lg:pr-4;
}

/* Width Responsive Utilities */
.w-responsive {
  @apply w-full sm:w-auto;
}

.min-w-responsive {
  @apply min-w-0 sm:min-w-[200px] lg:min-w-[250px];
}

.max-w-responsive {
  @apply max-w-full sm:max-w-md lg:max-w-lg;
}

/* Height Responsive Utilities */
.h-responsive {
  @apply h-auto sm:h-[300px] lg:h-[400px];
}

.min-h-responsive {
  @apply min-h-[200px] sm:min-h-[300px] lg:min-h-[400px];
}

.max-h-responsive {
  @apply max-h-[300px] sm:max-h-[400px] lg:max-h-[500px];
}

/* Border Radius Responsive Utilities */
.rounded-responsive {
  @apply rounded-lg sm:rounded-xl lg:rounded-2xl;
}

/* Shadow Responsive Utilities */
.shadow-responsive {
  @apply shadow-sm sm:shadow-md lg:shadow-lg;
}

/* Opacity Responsive Utilities */
.opacity-responsive {
  @apply opacity-75 sm:opacity-90 lg:opacity-100;
}

/* Transition Duration Responsive Utilities */
.duration-responsive {
  @apply duration-200 sm:duration-300 lg:duration-500;
}

/* Z-index Responsive Utilities */
.z-responsive {
  @apply z-10 sm:z-20 lg:z-30;
}

/* Invoice Form Steps Responsive */
.invoice-step-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

.invoice-step-number-responsive {
  @apply h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-xs sm:text-sm;
}

/* Carton Controls Responsive */
.carton-controls-responsive {
  @apply text-xs sm:text-sm;
}

.carton-button-responsive {
  @apply w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-xs sm:text-sm;
}

/* Invoice Summary Responsive */
.invoice-summary-responsive {
  @apply text-sm sm:text-base lg:text-lg;
}

.invoice-total-responsive {
  @apply text-base sm:text-lg lg:text-xl;
}

/* Action Buttons Responsive */
.action-buttons-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

.action-icon-responsive {
  @apply w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5;
}

/* Pagination Responsive */
.pagination-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

.pagination-button-responsive {
  @apply px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 text-xs sm:text-sm;
}

/* Filters Responsive */
.filters-responsive {
  @apply text-xs sm:text-sm;
}

.filter-input-responsive {
  @apply px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5 text-xs sm:text-sm;
}

/* Table Responsive */
.table-header-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

.table-cell-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Badge Responsive */
.badge-responsive {
  @apply text-xs sm:text-sm;
}

/* Loading Spinner Responsive */
.spinner-responsive {
  @apply h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8;
}

/* Notification Responsive */
.notification-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Modal Responsive */
.modal-responsive {
  @apply p-3 sm:p-4 lg:p-6;
}

.modal-title-responsive {
  @apply text-sm sm:text-base lg:text-lg;
}

.modal-content-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Form Label Responsive */
.form-label-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

.form-input-responsive {
  @apply px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5 text-xs sm:text-sm lg:text-base;
}

/* Button Group Responsive */
.button-group-responsive {
  @apply flex flex-col sm:flex-row gap-2;
}

.button-responsive {
  @apply px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 text-xs sm:text-sm lg:text-base;
}

/* Stats Card Responsive */
.stats-card-responsive {
  @apply p-3 sm:p-4 lg:p-6;
}

.stats-title-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

.stats-value-responsive {
  @apply text-lg sm:text-xl lg:text-2xl;
}

/* Search Bar Responsive */
.search-bar-responsive {
  @apply px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 text-xs sm:text-sm lg:text-base;
}

.search-icon-responsive {
  @apply h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5;
}

/* Invoice Items Table Responsive */
.invoice-items-table-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

.invoice-item-quantity-responsive {
  @apply w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-xs sm:text-sm;
}

/* Carton Info Responsive */
.carton-info-responsive {
  @apply text-xs sm:text-sm;
}

.carton-count-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Warehouse Select Responsive */
.warehouse-select-responsive {
  @apply px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 text-xs sm:text-sm lg:text-base;
}

/* Customer Info Responsive */
.customer-info-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

.customer-input-responsive {
  @apply px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 text-xs sm:text-sm lg:text-base;
}

/* Notes Textarea Responsive */
.notes-textarea-responsive {
  @apply px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 text-xs sm:text-sm lg:text-base;
}

/* Print Button Responsive */
.print-button-responsive {
  @apply px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 text-xs sm:text-sm lg:text-base;
}

/* Export Button Responsive */
.export-button-responsive {
  @apply px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 text-xs sm:text-sm lg:text-base;
}

/* Save Button Responsive */
.save-button-responsive {
  @apply px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 text-xs sm:text-sm lg:text-base;
}

/* Cancel Button Responsive */
.cancel-button-responsive {
  @apply px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 text-xs sm:text-sm lg:text-base;
}

/* View Button Responsive */
.view-button-responsive {
  @apply px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 text-xs sm:text-sm lg:text-base;
}

/* Edit Button Responsive */
.edit-button-responsive {
  @apply px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 text-xs sm:text-sm lg:text-base;
}

/* Delete Button Responsive */
.delete-button-responsive {
  @apply px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 text-xs sm:text-sm lg:text-base;
}

/* Invoice Status Responsive */
.invoice-status-responsive {
  @apply px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 text-xs sm:text-sm;
}

/* Invoice Type Responsive */
.invoice-type-responsive {
  @apply px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 text-xs sm:text-sm;
}

/* Payment Method Responsive */
.payment-method-responsive {
  @apply px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 text-xs sm:text-sm;
}

/* Quantity Badge Responsive */
.quantity-badge-responsive {
  @apply px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 text-xs sm:text-sm;
}

/* Value Display Responsive */
.value-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Date Display Responsive */
.date-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Time Display Responsive */
.time-display-responsive {
  @apply text-xs sm:text-sm;
}

/* User Display Responsive */
.user-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Notes Display Responsive */
.notes-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Code Display Responsive */
.code-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Name Display Responsive */
.name-display-responsive {
  @apply text-sm sm:text-base lg:text-lg;
}

/* Address Display Responsive */
.address-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Phone Display Responsive */
.phone-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Tax ID Display Responsive */
.taxid-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Item Code Display Responsive */
.item-code-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Item Name Display Responsive */
.item-name-display-responsive {
  @apply text-sm sm:text-base lg:text-lg;
}

/* Item Price Display Responsive */
.item-price-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Item Discount Display Responsive */
.item-discount-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Item Total Display Responsive */
.item-total-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Subtotal Display Responsive */
.subtotal-display-responsive {
  @apply text-sm sm:text-base lg:text-lg;
}

/* Discount Display Responsive */
.discount-display-responsive {
  @apply text-sm sm:text-base lg:text-lg;
}

/* Tax Display Responsive */
.tax-display-responsive {
  @apply text-sm sm:text-base lg:text-lg;
}

/* Total Display Responsive */
.total-display-responsive {
  @apply text-base sm:text-lg lg:text-xl;
}

/* Carton Display Responsive */
.carton-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Singles Display Responsive */
.singles-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Per Carton Display Responsive */
.per-carton-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Available Display Responsive */
.available-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Max Quantity Display Responsive */
.max-quantity-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Current Quantity Display Responsive */
.current-quantity-display-responsive {
  @apply text-sm sm:text-base lg:text-lg;
}

/* Unit Price Display Responsive */
.unit-price-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Discount Percent Display Responsive */
.discount-percent-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Item Total Price Display Responsive */
.item-total-price-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Invoice Number Display Responsive */
.invoice-number-display-responsive {
  @apply text-sm sm:text-base lg:text-lg;
}

/* Invoice Date Display Responsive */
.invoice-date-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Invoice Status Badge Responsive */
.invoice-status-badge-responsive {
  @apply px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 text-xs sm:text-sm;
}

/* Invoice Type Badge Responsive */
.invoice-type-badge-responsive {
  @apply px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 text-xs sm:text-sm;
}

/* Payment Method Badge Responsive */
.payment-method-badge-responsive {
  @apply px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 text-xs sm:text-sm;
}

/* Customer Name Display Responsive */
.customer-name-display-responsive {
  @apply text-sm sm:text-base lg:text-lg;
}

/* Customer Phone Display Responsive */
.customer-phone-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Customer Tax ID Display Responsive */
.customer-taxid-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Customer Address Display Responsive */
.customer-address-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Invoice Notes Display Responsive */
.invoice-notes-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Warehouse Name Display Responsive */
.warehouse-name-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Created By Display Responsive */
.created-by-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Updated At Display Responsive */
.updated-at-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Items Count Display Responsive */
.items-count-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Total Quantity Display Responsive */
.total-quantity-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Cartons Count Display Responsive */
.cartons-count-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Singles Count Display Responsive */
.singles-count-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Search Term Display Responsive */
.search-term-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Search Results Count Display Responsive */
.search-results-count-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Search Source Display Responsive */
.search-source-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Search Tips Display Responsive */
.search-tips-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Search Stats Display Responsive */
.search-stats-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Filter Badge Display Responsive */
.filter-badge-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Active Filter Display Responsive */
.active-filter-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Pagination Info Display Responsive */
.pagination-info-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Page Number Display Responsive */
.page-number-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Total Pages Display Responsive */
.total-pages-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Showing Display Responsive */
.showing-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Total Items Display Responsive */
.total-items-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Start Index Display Responsive */
.start-index-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* End Index Display Responsive */
.end-index-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Loading Message Display Responsive */
.loading-message-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Error Message Display Responsive */
.error-message-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Success Message Display Responsive */
.success-message-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Warning Message Display Responsive */
.warning-message-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Info Message Display Responsive */
.info-message-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Empty State Message Display Responsive */
.empty-state-message-display-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Form Error Message Display Responsive */
.form-error-message-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Validation Message Display Responsive */
.validation-message-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Help Text Display Responsive */
.help-text-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Tooltip Display Responsive */
.tooltip-display-responsive {
  @apply text-xs sm:text-sm;
}

/* Placeholder Text Responsive */
.placeholder-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Required Indicator Responsive */
.required-indicator-responsive {
  @apply text-xs sm:text-sm;
}

/* Optional Indicator Responsive */
.optional-indicator-responsive {
  @apply text-xs sm:text-sm;
}

/* Field Label Responsive */
.field-label-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

/* Field Description Responsive */
.field-description-responsive {
  @apply text-xs sm:text-sm;
}

/* Field Error Responsive */
.field-error-responsive {
  @apply text-xs sm:text-sm;
}

/* Field Success Responsive */
.field-success-responsive {
  @apply text-xs sm:text-sm;
}

/* Field Warning Responsive */
.field-warning-responsive {
  @apply text-xs sm:text-sm;
}

/* Field Info Responsive */
.field-info-responsive {
  @apply text-xs sm:text-sm;
}

/* Form Group Responsive */
.form-group-responsive {
  @apply space-y-1 sm:space-y-2 lg:space-y-3;
}

/* Form Row Responsive */
.form-row-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Form Column Responsive */
.form-column-responsive {
  @apply flex-1 min-w-0;
}

/* Form Actions Responsive */
.form-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Form Action Button Responsive */
.form-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Modal Actions Responsive */
.modal-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Modal Action Button Responsive */
.modal-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Dialog Actions Responsive */
.dialog-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Dialog Action Button Responsive */
.dialog-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Alert Actions Responsive */
.alert-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Alert Action Button Responsive */
.alert-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Notification Actions Responsive */
.notification-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Notification Action Button Responsive */
.notification-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Card Actions Responsive */
.card-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Card Action Button Responsive */
.card-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Table Actions Responsive */
.table-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Table Action Button Responsive */
.table-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* List Actions Responsive */
.list-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* List Action Button Responsive */
.list-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Grid Actions Responsive */
.grid-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Grid Action Button Responsive */
.grid-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Footer Actions Responsive */
.footer-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Footer Action Button Responsive */
.footer-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Header Actions Responsive */
.header-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Header Action Button Responsive */
.header-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Sidebar Actions Responsive */
.sidebar-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Sidebar Action Button Responsive */
.sidebar-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Navigation Actions Responsive */
.navigation-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Navigation Action Button Responsive */
.navigation-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Breadcrumb Actions Responsive */
.breadcrumb-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Breadcrumb Action Button Responsive */
.breadcrumb-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Tab Actions Responsive */
.tab-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Tab Action Button Responsive */
.tab-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Accordion Actions Responsive */
.accordion-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Accordion Action Button Responsive */
.accordion-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Carousel Actions Responsive */
.carousel-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Carousel Action Button Responsive */
.carousel-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Slider Actions Responsive */
.slider-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Slider Action Button Responsive */
.slider-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Range Actions Responsive */
.range-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Range Action Button Responsive */
.range-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Progress Actions Responsive */
.progress-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Progress Action Button Responsive */
.progress-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Spinner Actions Responsive */
.spinner-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Spinner Action Button Responsive */
.spinner-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Loading Actions Responsive */
.loading-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Loading Action Button Responsive */
.loading-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Error Actions Responsive */
.error-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Error Action Button Responsive */
.error-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Empty Actions Responsive */
.empty-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Empty Action Button Responsive */
.empty-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Success Actions Responsive */
.success-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Success Action Button Responsive */
.success-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Warning Actions Responsive */
.warning-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Warning Action Button Responsive */
.warning-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Info Actions Responsive */
.info-actions-responsive {
  @apply flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4;
}

/* Info Action Button Responsive */
.info-action-button-responsive {
  @apply flex-1 sm:flex-none;
}

/* Dark Mode Specific Responsive Utilities */
@media (prefers-color-scheme: dark) {
  .dark\:text-responsive {
    @apply text-xs sm:text-sm lg:text-base;
  }
  
  .dark\:bg-responsive {
    @apply bg-gray-800 sm:bg-gray-900 lg:bg-gray-950;
  }
  
  .dark\:border-responsive {
    @apply border-gray-700 sm:border-gray-600 lg:border-gray-500;
  }
}

/* Print Specific Responsive Utilities */
@media print {
  .print\:text-responsive {
    @apply text-xs sm:text-sm lg:text-base;
  }
  
  .print\:hidden-responsive {
    @apply hidden sm:block lg:hidden;
  }
  
  .print\:block-responsive {
    @apply block sm:hidden lg:block;
  }
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .high-contrast {
    border-width: 2px;
  }
  
  .high-contrast-text {
    font-weight: bold;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .transition-all,
  .transition-colors,
  .transition-shadow,
  .transition-transform {
    transition: none !important;
  }
  
  .animate-spin,
  .animate-pulse,
  .animate-bounce {
    animation: none !important;
  }
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .touch\:min-h-12 {
    min-height: 3rem;
  }
  
  .touch\:min-w-12 {
    min-width: 3rem;
  }
  
  .touch\:text-lg {
    font-size: 1.125rem;
  }
  
  .touch\:gap-4 {
    gap: 1rem;
  }
  
  .touch\:p-4 {
    padding: 1rem;
  }
}

/* Very Small Screens (below 320px) */
@media (max-width: 319px) {
  .xxs\:flex-col {
    flex-direction: column;
  }
  
  .xxs\:text-2xs {
    font-size: 0.625rem;
  }
  
  .xxs\:p-1 {
    padding: 0.25rem;
  }
  
  .xxs\:gap-1 {
    gap: 0.25rem;
  }
}

/* Large Screens (above 1920px) */
@media (min-width: 1921px) {
  .\32xl\:max-w-8xl {
    max-width: 90rem;
  }
  
  .\32xl\:text-2xl {
    font-size: 1.5rem;
  }
  
  .\32xl\:p-12 {
    padding: 3rem;
  }
  
  .\32xl\:gap-8 {
    gap: 2rem;
  }
}

/* Ultra Wide Screens (above 2560px) */
@media (min-width: 2561px) {
  .\33xl\:max-w-9xl {
    max-width: 100rem;
  }
  
  .\33xl\:text-3xl {
    font-size: 1.875rem;
  }
  
  .\33xl\:p-16 {
    padding: 4rem;
  }
  
  .\33xl\:gap-10 {
    gap: 2.5rem;
  }
}

/* Portrait Mode Optimization */
@media (orientation: portrait) {
  .portrait\:flex-col {
    flex-direction: column;
  }
  
  .portrait\:h-auto {
    height: auto;
  }
  
  .portrait\:w-full {
    width: 100%;
  }
}

/* Landscape Mode Optimization */
@media (orientation: landscape) {
  .landscape\:flex-row {
    flex-direction: row;
  }
  
  .landscape\:h-screen {
    height: 100vh;
  }
  
  .landscape\:w-auto {
    width: auto;
  }
}

/* Custom Breakpoint for Invoice Form */
@media (max-width: 480px) {
  .invoice-form-xs\:grid-cols-1 {
    grid-template-columns: 1fr !important;
  }
  
  .invoice-form-xs\:text-xs {
    font-size: 0.75rem !important;
  }
  
  .invoice-form-xs\:p-2 {
    padding: 0.5rem !important;
  }
}

/* Custom Breakpoint for Dispatch Table */
@media (max-width: 600px) {
  .dispatch-table-sm\:hidden {
    display: none !important;
  }
  
  .dispatch-table-sm\:block {
    display: block !important;
  }
  
  .dispatch-table-sm\:text-xs {
    font-size: 0.75rem !important;
  }
}

/* Custom Breakpoint for Search Results */
@media (max-width: 420px) {
  .search-results-xs\:grid-cols-1 {
    grid-template-columns: 1fr !important;
  }
  
  .search-results-xs\:max-h-40 {
    max-height: 10rem !important;
  }
}

/* Custom Breakpoint for Carton Controls */
@media (max-width: 380px) {
  .carton-controls-xs\:flex-col {
    flex-direction: column !important;
  }
  
  .carton-controls-xs\:items-stretch {
    align-items: stretch !important;
  }
  
  .carton-controls-xs\:gap-1 {
    gap: 0.25rem !important;
  }
}

/* Final Mobile Optimizations */
@media (max-width: 640px) {
  .mobile\:pb-16 {
    padding-bottom: 4rem !important;
  }
  
  .mobile\:sticky {
    position: sticky !important;
  }
  
  .mobile\:top-0 {
    top: 0 !important;
  }
  
  .mobile\:z-50 {
    z-index: 50 !important;
  }
  
  .mobile\:overflow-x-auto {
    overflow-x: auto !important;
  }
  
  .mobile\:flex-nowrap {
    flex-wrap: nowrap !important;
  }
  
  .mobile\:space-x-2 {
    gap: 0.5rem !important;
  }
  
  .mobile\:text-center {
    text-align: center !important;
  }
  
  .mobile\:truncate {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }
}

/* Performance Optimizations */
.will-change-transform {
  will-change: transform;
}

.will-change-opacity {
  will-change: opacity;
}

.backface-hidden {
  backface-visibility: hidden;
}

.transform-gpu {
  transform: translateZ(0);
}

/* Accessibility Improvements */
.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus\:ring-blue-500:focus {
  --tw-ring-color: rgb(59 130 246);
}

/* Final Utility Classes */
.inset-shadow {
  box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
}

.glow {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
}

/* Invoice Specific */
.invoice-border {
  border: 2px solid #e5e7eb;
}

.dark .invoice-border {
  border-color: #4b5563;
}

.invoice-header-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.invoice-total-gradient {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

/* Dispatch Specific */
.dispatch-warning {
  border-left: 4px solid #f59e0b;
}

.dispatch-danger {
  border-left: 4px solid #ef4444;
}

.dispatch-success {
  border-left: 4px solid #10b981;
}

/* Animation for Success */
@keyframes successPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.success-pulse {
  animation: successPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Smooth transitions for all interactive elements */
button, 
a, 
input, 
select, 
textarea {
  @apply transition-all duration-200;
}

/* Ensure proper spacing for mobile touch targets */
button, 
a {
  @apply min-h-[44px] min-w-[44px];
}

/* Improve readability on mobile */
@media (max-width: 640px) {
  p, span, div {
    line-height: 1.5;
  }
  
  h1, h2, h3, h4, h5, h6 {
    line-height: 1.3;
  }
}

/* Ensure proper contrast in dark mode */
.dark {
  color-scheme: dark;
}

.dark body {
  background-color: #111827;
  color: #f9fafb;
}

/* Print optimizations */
@media print {
  body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  
  .break-inside-avoid {
    break-inside: avoid;
  }
  
  .break-before-page {
    break-before: page;
  }
  
  .break-after-page {
    break-after: page;
  }
}
</style>
