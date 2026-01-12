<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
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
            <!-- Step 1: Invoice Type and Customer Information - Optimized Width -->
            <div>
              <h4 class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center">
                <span class="h-5 w-5 sm:h-6 sm:w-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-xs ml-1 sm:ml-2">1</span>
                <span class="truncate">معلومات الفاتورة والعميل</span>
              </h4>
              
              <div class="invoice-form-grid">
                <!-- Invoice Type -->
                <div class="lg:col-span-2 form-field-full">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">نوع الفاتورة *</label>
                  <select v-model="invoiceForm.type" @change="onInvoiceTypeChange" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white max-w-md mx-auto lg:mx-0">
                    <option value="B2B">فاتورة ضريبية (B2B) - نشاط تجاري</option>
                    <option value="B2C">فاتورة ضريبية (B2C) - مستهلك نهائي</option>
                    <option value="simplified">فاتورة مبسطة</option>
                  </select>
                </div>

                <!-- Payment Method -->
                <div class="form-field-container">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">طريقة الدفع *</label>
                  <select v-model="invoiceForm.paymentMethod" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="cash">نقدي</option>
                    <option value="bank">تحويل بنكي</option>
                    <option value="check">شيك</option>
                    <option value="credit">آجل</option>
                  </select>
                </div>

                <!-- Customer Name -->
                <div class="form-field-container">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">اسم العميل *</label>
                  <input v-model="invoiceForm.customer.name" type="text" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="اسم العميل الكامل" required>
                </div>

                <!-- Customer Phone -->
                <div class="form-field-container">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">رقم الهاتف *</label>
                  <input v-model="invoiceForm.customer.phone" type="tel" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="01XXXXXXXXX" required>
                </div>

                <!-- Tax ID (for B2B only) -->
                <div v-if="invoiceForm.type === 'B2B'" class="lg:col-span-2 form-field-full">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">الرقم الضريبي *</label>
                  <input v-model="invoiceForm.customer.taxId" type="text" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white max-w-md" placeholder="الرقم الضريبي (14 رقم)" pattern="[0-9]{14}" required>
                </div>

                <!-- Customer Address -->
                <div class="lg:col-span-2 form-field-full">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">العنوان</label>
                  <input v-model="invoiceForm.customer.address" type="text" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="عنوان العميل">
                </div>

                <!-- Notes -->
                <div class="lg:col-span-2 form-field-full">
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">ملاحظات</label>
                  <textarea v-model="invoiceForm.notes" rows="2" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="ملاحظات إضافية..."></textarea>
                </div>
              </div>
            </div>

            <!-- Step 2: Warehouse Selection - Optimized -->
            <div>
              <h4 class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center">
                <span class="h-5 w-5 sm:h-6 sm:w-6 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center text-xs ml-1 sm:ml-2">2</span>
                اختر المخزن
              </h4>
              
              <div class="warehouse-select-container">
                <select 
                  v-model="selectedWarehouseForInvoice" 
                  @change="loadWarehouseItems" 
                  class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
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
              <div class="relative mb-3 sm:mb-4">
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
              <div v-if="itemSearch.trim() && filteredSearchResults.length > 0" class="search-stats-container">
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
              <div v-if="filteredSearchResults.length > 0" class="search-results-grid">
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
              <div v-else-if="itemSearch.trim() && !searchingItems" class="search-empty-state">
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
              <div v-else-if="!selectedWarehouseForInvoice" class="search-empty-state">
                <svg class="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 sm:mt-3">اختر مخزن أولاً</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  يرجى اختيار مخزن لعرض الأصناف المتاحة
                </p>
              </div>

              <!-- Empty Warehouse -->
              <div v-else-if="selectedWarehouseForInvoice && filteredSearchResults.length === 0 && !itemSearch.trim()" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 sm:p-6 text-center">
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
              <div v-if="!itemSearch.trim() && selectedWarehouseForInvoice" class="search-tips-container">
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
              <div class="selected-items-container border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
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

              <div class="invoice-summary-card">
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
            <div v-else class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 sm:p-6 text-center">
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
          <div class="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
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

        <!-- Create Dispatch Section - Mobile Optimized - FIXED QUANTITY DISPLAY -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4 lg:mb-6">
            <div>
              <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">إنشاء صرف جديد</h2>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">صرف أصناف من المخازن إلى خارج النظام</p>
            </div>

            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <!-- Search Box -->
              <div class="relative flex-1 min-w-0">
                <input
                  type="text"
                  v-model="searchTerm"
                  @input="handleSearch"
                  placeholder="ابحث عن صنف..."
                  class="w-full px-3 sm:px-4 py-2.5 pr-9 sm:pr-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :disabled="loading"
                >
                <svg class="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
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

          <!-- Available Items - FIXED QUANTITY DISPLAY -->
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

            <div class="available-items-grid">
              <div 
                v-for="item in displayedAvailableItems" 
                :key="item.id"
                class="p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm active:scale-98"
                @click="selectItemForDispatch(item)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <p class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">{{ item.name }}</p>
                    <div class="flex items-center flex-wrap gap-1 sm:gap-2 mt-1">
                      <span v-if="item.code" class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 sm:px-2 py-0.5 rounded truncate">{{ item.code }}</span>
                      <!-- FIXED: Direct quantity display with fallback -->
                      <span class="text-xs px-1 sm:px-1.5 py-0.5 rounded whitespace-nowrap" 
                            :class="getQuantityClass(item.remaining_quantity || item.quantity || 0)">
                        {{ formatNumber(item.remaining_quantity || item.quantity || 0) }} متبقي
                      </span>
                    </div>
                  </div>
                  <svg class="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0 mr-1 sm:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
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

        <!-- Dispatch History - Mobile Optimized - FIXED QUANTITY DISPLAY -->
        <div class="dispatch-table-container bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6 sm:mb-8">
          <div class="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
              <div>
                <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">سجل عمليات الصرف</h2>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">جميع عمليات الصرف المسجلة في النظام</p>
              </div>

              <div class="filters-container">
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

                <!-- Custom Date Range -->
                <div v-if="dateFilter === 'custom'" class="flex flex-wrap items-center gap-1 sm:gap-2">
                  <input 
                    type="date" 
                    v-model="customDateFrom"
                    @change="applyHistoryFilters"
                    class="px-2 sm:px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-[110px] sm:min-w-[120px]"
                  >
                  <span class="text-gray-500 dark:text-gray-400 text-xs">إلى</span>
                  <input 
                    type="date" 
                    v-model="customDateTo"
                    @change="applyHistoryFilters"
                    class="px-2 sm:px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-[110px] sm:min-w-[120px]"
                  >
                </div>

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

                    <!-- Quantity - FIXED: Direct quantity display with multiple fallbacks -->
                    <div class="col-span-1 px-2">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap" 
                            :class="getDispatchQuantityClass(dispatch.quantity || dispatch.total_delta || 0)">
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
                      <!-- FIXED: Direct quantity display -->
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap" 
                            :class="getDispatchQuantityClass(dispatch.quantity || dispatch.total_delta || 0)">
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
import DispatchModal from '@/components/inventory/DispatchModal.vue';
import { collection, query, where, orderBy, limit, getDocs, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp, writeBatch, increment } from 'firebase/firestore';
import { db } from '@/firebase/config';

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
    
    // SPARK Search specific state
    const searchingItems = ref(false);
    const searchResults = ref([]);
    const lastSearchSource = ref('');
    const searchAllWarehouses = ref(false);
    const searchDebounceTimeout = ref(null);
    
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
    
    // ✅ NEW: Dispatch history from store
    const dispatchHistory = computed(() => store.state.dispatchHistory || []);
    const dispatchHistoryLoading = computed(() => store.state.dispatchHistoryLoading || false);
    
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
    // SECTION 5: ORIGINAL DISPATCH COMPUTED PROPERTIES
    // ============================================
    // ✅ UPDATED: Use store dispatchHistory instead of filtering transactions
    const dispatchTransactions = computed(() => {
      return dispatchHistory.value;
    });
    
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
    
    const totalDispatchValue = computed(() => {
      return dispatchTransactions.value.reduce((total, dispatch) => {
        return total + calculateDispatchValue(dispatch);
      }, 0);
    });
    
    // Available items with search and warehouse filtering
    const availableItems = computed(() => {
      let items = allInventory.value.filter(item => item.remaining_quantity > 0);
      
      if (selectedWarehouse.value) {
        items = items.filter(item => item.warehouse_id === selectedWarehouse.value);
      }
      
      if (searchTerm.value.trim()) {
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
    
    // ✅ UPDATED: Filter dispatch history - Use store dispatchHistory
    const filteredDispatchHistory = computed(() => {
      let filtered = [...dispatchHistory.value];
      
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
    
    // ✅ UPDATED: Calculate dispatch value with better quantity detection
    const calculateDispatchValue = (dispatch) => {
      // Try multiple possible quantity fields in order of priority
      let quantity = 0;
      
      if (dispatch.quantity !== undefined && dispatch.quantity !== null) {
        quantity = Math.abs(dispatch.quantity);
      } else if (dispatch.total_delta !== undefined && dispatch.total_delta !== null) {
        quantity = Math.abs(dispatch.total_delta);
      } else if (dispatch.cartons_count !== undefined && dispatch.per_carton_count !== undefined) {
        // Calculate from cartons
        quantity = Math.abs((dispatch.cartons_count || 0) * (dispatch.per_carton_count || 12)) + 
                   Math.abs(dispatch.single_bottles_count || 0);
      } else if (dispatch.detailedUpdate?.remaining_quantity !== undefined) {
        quantity = Math.abs(dispatch.detailedUpdate.remaining_quantity);
      }
      
      // Use a reasonable default price per item
      const pricePerItem = 50; // أو استخدم سعر الصنف الفعلي إذا كان متوفرًا
      return quantity * pricePerItem;
    };
    
    // ✅ UPDATED: Get dispatch quantity class with better quantity detection
    const getDispatchQuantityClass = (dispatch) => {
      let quantity = 0;
      
      if (dispatch.quantity !== undefined && dispatch.quantity !== null) {
        quantity = Math.abs(dispatch.quantity);
      } else if (dispatch.total_delta !== undefined && dispatch.total_delta !== null) {
        quantity = Math.abs(dispatch.total_delta);
      } else if (typeof dispatch === 'number') {
        quantity = Math.abs(dispatch);
      } else if (dispatch?.detailedUpdate?.remaining_quantity !== undefined) {
        quantity = Math.abs(dispatch.detailedUpdate.remaining_quantity);
      }
      
      if (quantity < 10) return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300';
      if (quantity < 50) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300';
      return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300';
    };
    
    // ✅ UPDATED: Helper to get quantity for display
    const getDispatchQuantity = (dispatch) => {
      if (dispatch.quantity !== undefined && dispatch.quantity !== null) {
        return Math.abs(dispatch.quantity);
      } else if (dispatch.total_delta !== undefined && dispatch.total_delta !== null) {
        return Math.abs(dispatch.total_delta);
      } else if (dispatch?.detailedUpdate?.remaining_quantity !== undefined) {
        return Math.abs(dispatch.detailedUpdate.remaining_quantity);
      } else if (dispatch.cartons_count !== undefined && dispatch.per_carton_count !== undefined) {
        return Math.abs((dispatch.cartons_count || 0) * (dispatch.per_carton_count || 12)) + 
               Math.abs(dispatch.single_bottles_count || 0);
      }
      return 0;
    };
    
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
    // SECTION 8: SPARK SEARCH FUNCTIONS
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
        console.log(`🔍 SPARK Searching for: "${itemSearch.value}"`);
        
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
            per_carton_count: item.per_carton_count || 12,
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
      
      const currentItemIds = new Set(invoiceForm.value.items.map(item => item.id));
      items = items.filter(item => !currentItemIds.has(item.id));
      
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
    // SECTION 9: UPDATED DISPATCH ACTIONS WITH STORE - FIXED VERSION
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
    };
    
    const handleModalClose = () => {
      showDispatchModal.value = false;
      selectedItemForDispatch.value = null;
    };
    
    // ✅ UPDATED FIXED VERSION: handleDispatchSuccess with better error handling
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
          
          // ✅ NEW: Refresh dispatch history from store
          await loadDispatchHistory();
          
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
      const quantity = getDispatchQuantity(dispatch);
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
      const quantity = getDispatchQuantity(dispatch);
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
          'الكمية': getDispatchQuantity(dispatch),
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
    
    // ============================================
    // SECTION 10: NEW DISPATCH HISTORY LOADING FUNCTION
    // ============================================
    const loadDispatchHistory = async () => {
      try {
        console.log('🔄 Loading dispatch history from store...');
        
        // Use store action to load dispatch history
        await store.dispatch('loadDispatchHistory', {
          search: historySearch.value.trim(),
          warehouse: historyWarehouseFilter.value,
          dateFrom: dateFilter.value === 'custom' ? customDateFrom.value : '',
          dateTo: dateFilter.value === 'custom' ? customDateTo.value : ''
        });
        
        console.log(`✅ Dispatch history loaded: ${dispatchHistory.value.length} records`);
        
      } catch (error) {
        console.error('❌ Error loading dispatch history:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تحميل سجل الصرف'
        });
      }
    };
    
    // ============================================
    // SECTION 11: INVOICE SYSTEM ACTIONS (ALL REMAIN THE SAME)
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
    
    const addItemToInvoice = (item) => {
      const existingItemIndex = invoiceForm.value.items.findIndex(i => i.id === item.id);
      
      if (existingItemIndex !== -1) {
        const existingItem = invoiceForm.value.items[existingItemIndex];
        if (existingItem.quantity < item.remaining_quantity) {
          existingItem.quantity++;
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
        invoiceForm.value.items.push({
          id: item.id,
          name: item.name,
          code: item.code,
          unitPrice: item.sale_price || item.unitPrice || 0,
          quantity: 1,
          discount: 0,
          total: item.sale_price || item.unitPrice || 0,
          maxQuantity: item.remaining_quantity,
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
    
    const increaseQuantity = (index) => {
      const item = invoiceForm.value.items[index];
      if (item.quantity < item.maxQuantity) {
        item.quantity++;
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
      if (item.quantity > 1) {
        item.quantity--;
        updateItemTotal(index);
      }
    };
    
    const validateItemQuantity = (index) => {
      const item = invoiceForm.value.items[index];
      if (item.quantity > item.maxQuantity) {
        item.quantity = item.maxQuantity;
        store.dispatch('showNotification', {
          type: 'warning',
          message: 'تم ضبط الكمية إلى الحد الأقصى المتاح'
        });
      }
      if (item.quantity < 1) {
        item.quantity = 1;
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
          <div dir="rtl" style="font-family: 'Cairo', sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
            <h1 style="text-align: center; font-size: 28px; font-weight: bold; color: #333; margin-bottom: 30px;">
              تقرير الفواتير
            </h1>
            <div style="text-align: center; color: #666; margin-bottom: 20px;">
              <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
              <p>إجمالي الفواتير: ${invoices.value.length}</p>
              <p>إجمالي المبيعات: ${formatCurrency(totalSales.value)}</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 30px;">
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center;">
                <div style="font-size: 20px; font-weight: bold; color: #333;">${totalInvoices.value}</div>
                <div style="font-size: 12px; color: #666;">إجمالي الفواتير</div>
              </div>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center;">
                <div style="font-size: 20px; font-weight: bold; color: #333;">${formatCurrency(totalSales.value)}</div>
                <div style="font-size: 12px; color: #666;">إجمالي المبيعات</div>
              </div>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center;">
                <div style="font-size: 20px; font-weight: bold; color: #333;">${uniqueCustomers.value}</div>
                <div style="font-size: 12px; color: #666;">العملاء</div>
              </div>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center;">
                <div style="font-size: 20px; font-weight: bold; color: #333;">${formatCurrency(totalTax.value)}</div>
                <div style="font-size: 12px; color: #666;">الضريبة</div>
              </div>
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
              قائمة الفواتير
            </h2>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #ddd;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">رقم الفاتورة</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">التاريخ</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">العميل</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">النوع</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">المبلغ</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">الحالة</th>
                </tr>
              </thead>
              <tbody>
                ${filteredInvoices.value.map(invoice => {
                  const invoiceSubtotal = invoice.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
                  const invoiceDiscount = invoice.items.reduce((sum, item) => sum + ((item.unitPrice * item.quantity) * (item.discount / 100)), 0);
                  const invoiceTax = (invoice.type === 'B2B' || invoice.type === 'B2C') ? (invoiceSubtotal - invoiceDiscount) * 0.14 : 0;
                  const invoiceTotal = invoiceSubtotal - invoiceDiscount + invoiceTax;
                  
                  return `
                    <tr>
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
            
            <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
              <p>تم الإنشاء بواسطة نظام إدارة المخزون والفواتير</p>
              <p>${new Date().toLocaleString('ar-EG')}</p>
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
            orientation: 'portrait',
            compress: true
          },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        
        await html2pdf().set(opt).from(element).save();
        
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم تصدير ${filteredInvoices.value.length} فاتورة كملف PDF بنجاح`
        });
        
      } catch (error) {
        console.error('Error exporting to PDF:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تصدير التقرير كملف PDF'
        });
      } finally {
        loading.value = false;
      }
    };
    
    const deleteInvoice = async (invoiceId) => {
      if (!confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) return;
      
      try {
        loading.value = true;
        
        const invoice = invoices.value.find(inv => inv.id === invoiceId);
        if (invoice && invoice.items) {
          const batch = writeBatch(db);
          
          for (const item of invoice.items) {
            if (item.id) {
              const itemRef = doc(db, 'items', item.id);
              batch.update(itemRef, {
                remaining_quantity: increment(item.quantity || 0)
              });
            }
          }
          
          await batch.commit();
        }
        
        const invoiceRef = doc(db, 'invoices', invoiceId);
        await deleteDoc(invoiceRef);
        
        await loadInvoices();
        
        store.dispatch('showNotification', {
          type: 'success',
          message: 'تم حذف الفاتورة بنجاح'
        });
        
      } catch (error) {
        console.error('Error deleting invoice:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ أثناء حذف الفاتورة'
        });
      } finally {
        loading.value = false;
      }
    };
    
    const saveInvoice = async () => {
      if (!canSaveInvoice.value) return;
      
      try {
        saving.value = true;
        
        if (invoiceForm.value.type === 'B2B' && (!invoiceForm.value.customer.taxId || invoiceForm.value.customer.taxId.length < 9)) {
          store.dispatch('showNotification', {
            type: 'error',
            message: 'يرجى إدخال رقم ضريبي صالح (9 أرقام على الأقل)'
          });
          saving.value = false;
          return;
        }
        
        const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
        if (!phoneRegex.test(invoiceForm.value.customer.phone)) {
          store.dispatch('showNotification', {
            type: 'error',
            message: 'يرجى إدخال رقم هاتف صحيح (مثال: 01012345678)'
          });
          saving.value = false;
          return;
        }
        
        const subtotal = invoiceForm.value.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        const discount = invoiceForm.value.items.reduce((sum, item) => sum + ((item.unitPrice * item.quantity) * (item.discount / 100)), 0);
        const tax = (invoiceForm.value.type === 'B2B' || invoiceForm.value.type === 'B2C') ? (subtotal - discount) * 0.14 : 0;
        const total = subtotal - discount + tax;
        
        const invoiceData = {
          ...invoiceForm.value,
          warehouseId: selectedWarehouseForInvoice.value,
          subtotal,
          discount,
          taxAmount: tax,
          totalAmount: total,
          date: Timestamp.now(),
          createdBy: userProfile.value?.name || userName.value,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };
        
        let invoiceId;
        
        if (editingInvoice.value) {
          const invoiceRef = doc(db, 'invoices', editingInvoice.value.id);
          await updateDoc(invoiceRef, invoiceData);
          invoiceId = editingInvoice.value.id;
          
          store.dispatch('showNotification', {
            type: 'success',
            message: 'تم تحديث الفاتورة بنجاح'
          });
        } else {
          const lastInvoice = invoices.value[0];
          const lastNumber = lastInvoice ? lastInvoice.invoiceNumber : 0;
          const invoiceNumber = lastNumber + 1;
          
          invoiceData.invoiceNumber = invoiceNumber;
          const docRef = await addDoc(collection(db, 'invoices'), invoiceData);
          invoiceId = docRef.id;
          
          store.dispatch('showNotification', {
            type: 'success',
            message: `تم إنشاء الفاتورة #${invoiceNumber} بنجاح`
          });
        }
        
        for (const item of invoiceForm.value.items) {
          try {
            await store.dispatch('dispatchItem', {
              item_id: item.id,
              from_warehouse_id: selectedWarehouseForInvoice.value,
              from_warehouse_name: getWarehouseLabel(selectedWarehouseForInvoice.value),
              destination: `فاتورة #${invoiceData.invoiceNumber}`,
              destination_id: invoiceId,
              quantity: item.quantity,
              item_name: item.name,
              item_code: item.code,
              notes: `صرف عبر فاتورة #${invoiceData.invoiceNumber} - عميل: ${invoiceForm.value.customer.name}`,
              priority: 'normal'
            });
          } catch (dispatchError) {
            console.error(`Error dispatching item ${item.name}:`, dispatchError);
            store.dispatch('showNotification', {
              type: 'error',
              message: `خطأ في صرف الصنف ${item.name}: ${dispatchError.message}`
            });
          }
        }
        
        cancelInvoiceForm();
        await loadInvoices();
        
        // ✅ NEW: Refresh dispatch history from store when invoice creates dispatches
        await loadDispatchHistory();
        
      } catch (error) {
        console.error('Error saving invoice:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ أثناء حفظ الفاتورة'
        });
      } finally {
        saving.value = false;
      }
    };
    
    const saveAndPrint = async () => {
      await saveInvoice();
    };
    
    const exportInvoicesToExcel = async () => {
      try {
        loading.value = true;
        
        const exportData = filteredInvoices.value.map(invoice => {
          const invoiceSubtotal = invoice.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
          const invoiceDiscount = invoice.items.reduce((sum, item) => sum + ((item.unitPrice * item.quantity) * (item.discount / 100)), 0);
          const invoiceTax = (invoice.type === 'B2B' || invoice.type === 'B2C') ? (invoiceSubtotal - invoiceDiscount) * 0.14 : 0;
          const invoiceTotal = invoiceSubtotal - invoiceDiscount + invoiceTax;
          
          return {
            'رقم الفاتورة': invoice.invoiceNumber,
            'التاريخ': formatDate(invoice.date),
            'نوع الفاتورة': getInvoiceTypeLabel(invoice.type),
            'حالة الفاتورة': getInvoiceStatusLabel(invoice.status),
            'اسم العميل': invoice.customer.name,
            'هاتف العميل': invoice.customer.phone,
            'الرقم الضريبي': invoice.customer.taxId || '',
            'عدد الأصناف': invoice.items?.length || 0,
            'المجموع': invoiceSubtotal,
            'الخصم': invoiceDiscount,
            'الضريبة': invoiceTax,
            'الإجمالي': invoiceTotal,
            'طريقة الدفع': invoice.paymentMethod === 'cash' ? 'نقدي' : 
                           invoice.paymentMethod === 'bank' ? 'بنكي' : 
                           invoice.paymentMethod === 'check' ? 'شيك' : 'آجل',
            'ملاحظات': invoice.notes || ''
          };
        });
        
        if (exportData.length === 0) {
          store.dispatch('showNotification', {
            type: 'warning',
            message: 'لا توجد فواتير للتصدير'
          });
          return;
        }
        
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);
        
        const wscols = [
          { wch: 12 },
          { wch: 12 },
          { wch: 15 },
          { wch: 12 },
          { wch: 20 },
          { wch: 15 },
          { wch: 15 },
          { wch: 10 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 10 },
          { wch: 30 }
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
        console.error('Error exporting invoices:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تصدير الفواتير'
        });
      } finally {
        loading.value = false;
      }
    };
    
    // ============================================
    // SECTION 12: DATA LOADING FUNCTIONS
    // ============================================
    const loadInvoices = async () => {
      try {
        loading.value = true;
        
        const q = query(collection(db, 'invoices'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        invoices.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate?.() || doc.data().date
        }));
        
      } catch (error) {
        console.error('Error loading invoices:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تحميل الفواتير'
        });
      } finally {
        loading.value = false;
      }
    };
    
    const setupRealtimeUpdates = () => {
      try {
        const transactionsRef = collection(db, 'transactions');
        const q = query(
          transactionsRef,
          where('type', '==', 'DISPATCH'),
          orderBy('timestamp', 'desc'),
          limit(100)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const transactions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          if (transactions.length > 0 && dispatchTransactions.value.length > 0) {
            const latestTransaction = transactions[0];
            const isNew = !dispatchTransactions.value.find(t => t.id === latestTransaction.id);
            
            if (isNew && !showDispatchModal.value) {
              store.dispatch('showNotification', {
                type: 'info',
                message: `صرف جديد: ${latestTransaction.item_name} - ${Math.abs(latestTransaction.total_delta)} وحدة`,
                duration: 5000
              });
              
              // ✅ NEW: Refresh dispatch history when new dispatch arrives
              loadDispatchHistory();
            }
          }
        });

        realtimeUnsubscribe.value = unsubscribe;
      } catch (error) {
        console.error('Error setting up real-time dispatch updates:', error);
      }
    };
    
    const diagnoseDispatchIssues = () => {
      console.log('=== Dispatch System Diagnostics ===');
      console.log('1. User Info:', {
        role: userRole.value,
        canViewDispatches: canViewDispatches.value,
        canPerformDispatch: canPerformDispatch.value
      });
      
      console.log('2. Store State:', {
        warehouses: store.state.warehouses?.length || 0,
        transactions: store.state.transactions?.length || 0,
        inventory: store.state.inventory?.length || 0,
        dispatchHistory: store.state.dispatchHistory?.length || 0
      });
      
      console.log('3. Available Warehouses:', availableWarehousesForDispatch.value);
      console.log('4. Selected Warehouse:', selectedWarehouse.value);
      
      console.log('5. Dispatch History:', {
        storeHistory: dispatchHistory.value?.length || 0,
        filteredHistory: filteredDispatchHistory.value?.length || 0
      });
      
      console.log('6. Search Term:', searchTerm.value);
      console.log('7. Available Items:', availableItems.value?.length || 0);
      
      if (dispatchTransactions.value.length > 0) {
        console.log('Sample Dispatch Data:', dispatchTransactions.value.slice(0, 3));
      }
      
      console.log('=== End Diagnostics ===');
    };
    
    const loadInitialData = async () => {
      loading.value = true;
      try {
        console.log('Dispatch page: Loading initial data...');
        
        if (!canViewDispatches.value) {
          store.dispatch('showNotification', {
            type: 'error',
            message: 'يجب تسجيل الدخول لعرض صفحة الصرف'
          });
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }
        
        if (!store.state.warehousesLoaded || store.state.warehouses.length === 0) {
          await store.dispatch('loadWarehouses');
        }
        
        // ✅ NEW: Load dispatch history from store
        await loadDispatchHistory();
        
        if (store.state.inventory.length === 0) {
          await store.dispatch('fetchInventory');
        }
        
        if (availableWarehousesForDispatch.value.length === 1) {
          selectedWarehouse.value = availableWarehousesForDispatch.value[0].id;
        }
        
        console.log('Dispatch history loaded:', dispatchHistory.value.length);
        console.log('Filtered history:', filteredDispatchHistory.value.length);
        
        diagnoseDispatchIssues();
        
        setupRealtimeUpdates();
        
      } catch (error) {
        console.error('Error loading dispatch data:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تحميل بيانات الصرف'
        });
      } finally {
        loading.value = false;
      }
    };
    
    // ============================================
    // SECTION 13: LIFECYCLE HOOKS AND WATCHERS
    // ============================================
    onMounted(() => {
      console.log('Dispatch page with invoices mounted');
      loadInitialData();
    });
    
    onUnmounted(() => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }
      if (searchDebounceTimeout.value) {
        clearTimeout(searchDebounceTimeout.value);
      }
      if (realtimeUnsubscribe.value) {
        realtimeUnsubscribe.value();
      }
    });
    
    // ✅ NEW: Watch for dispatch history filters and reload data
    watch([historySearch, historyWarehouseFilter, dateFilter, customDateFrom, customDateTo], () => {
      if (dateFilter.value === 'custom' && (!customDateFrom.value || !customDateTo.value)) {
        return;
      }
      loadDispatchHistory();
    });
    
    // Watch for warehouse changes to reload items
    watch(selectedWarehouseForInvoice, () => {
      if (selectedWarehouseForInvoice.value) {
        if (itemSearch.value.trim()) {
          searchItemsWithSpark();
        } else {
          loadWarehouseItems();
        }
      } else {
        searchResults.value = [];
      }
    });
    
    watch(searchAllWarehouses, () => {
      if (itemSearch.value.trim() && itemSearch.value.trim().length >= 2) {
        searchItemsWithSpark();
      } else if (selectedWarehouseForInvoice.value) {
        loadWarehouseItems();
      }
    });
    
    watch(() => allInventory.value, () => {
      if (selectedWarehouseForInvoice.value) {
        if (itemSearch.value.trim()) {
          searchItemsWithSpark();
        } else {
          loadWarehouseItems();
        }
      }
    }, { deep: true });
    
    return {
      // Original dispatch state
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
      showAllItems,
      userRole,
      userName,
      canPerformDispatch,
      canExport,
      canViewDispatches,
      availableWarehousesForDispatch,
      availableItems,
      displayedAvailableItems,
      totalDispatches,
      monthlyDispatches,
      totalDispatchValue,
      filteredDispatchHistory,
      paginatedHistory,
      totalHistoryPages,
      startIndex,
      endIndex,
      hasFilters,
      
      // Invoice system state with SPARK search
      showInvoiceSystem,
      showInvoiceForm,
      saving,
      invoiceSearchTerm,
      invoiceStatusFilter,
      invoiceTypeFilter,
      itemSearch,
      currentPage,
      selectedWarehouseForInvoice,
      invoiceForm,
      editingInvoice,
      invoices,
      availableWarehouses,
      
      // SPARK Search specific
      searchingItems,
      filteredSearchResults,
      totalItemsInWarehouse,
      lastSearchSource,
      searchAllWarehouses,
      
      // ✅ NEW: Dispatch history loading state
      dispatchHistoryLoading,
      
      // Computed properties
      totalInvoices,
      totalSales,
      totalTax,
      uniqueCustomers,
      filteredInvoices,
      paginatedInvoices,
      totalPages,
      startInvoiceIndex: startInvoiceIndex,
      endInvoiceIndex: endInvoiceIndex,
      subtotal,
      totalDiscount,
      taxAmount,
      totalAmount,
      totalQuantity,
      canSaveInvoice,
      
      // Utility functions
      formatNumber,
      formatCurrency,
      formatDate,
      formatTime,
      formatDateTime,
      getWarehouseLabel,
      getDestinationLabel,
      getDateFilterLabel,
      getSearchSourceLabel,
      calculateDispatchValue,
      getDispatchQuantityClass,
      getDispatchQuantity,
      getQuantityClass,
      getInvoiceTypeLabel,
      getInvoiceTypeClass,
      getInvoiceStatusLabel,
      getInvoiceStatusClass,
      
      // Original dispatch actions
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
      
      // Invoice system actions with SPARK search
      toggleInvoiceSystem,
      createNewInvoice,
      editInvoice,
      cancelInvoiceForm,
      onInvoiceTypeChange,
      loadWarehouseItems,
      debouncedSearchItems,
      addItemToInvoice,
      removeItem,
      increaseQuantity,
      decreaseQuantity,
      validateItemQuantity,
      updateItemTotal,
      filterInvoices,
      nextInvoicePage,
      prevInvoicePage,
      viewInvoice,
      printInvoice,
      exportInvoicePDF,
      exportToPDF,
      deleteInvoice,
      saveInvoice,
      saveAndPrint,
      exportInvoicesToExcel
    };
  }
};
</script>
<style scoped>
/* Mobile-optimized styles for invoice section with SPARK Search */
@media (max-width: 640px) {
  .mobile\:text-xs {
    font-size: 0.75rem;
  }
  
  .mobile\:text-sm {
    font-size: 0.875rem;
  }
  
  .mobile\:p-2 {
    padding: 0.5rem;
  }
  
  .mobile\:p-3 {
    padding: 0.75rem;
  }
  
  .mobile\:space-y-2 > * + * {
    margin-top: 0.5rem;
  }
  
  .mobile\:grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .mobile\:flex-col {
    flex-direction: column;
  }
  
  .mobile\:items-stretch {
    align-items: stretch;
  }
  
  .mobile\:min-h-10 {
    min-height: 2.5rem;
  }
  
  .mobile\:min-w-0 {
    min-width: 0;
  }
  
  .mobile\:truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

/* Touch-friendly buttons for mobile */
@media (max-width: 768px) {
  button, 
  .btn-primary,
  .btn-secondary,
  .btn-success,
  .input-field,
  select,
  .pagination-btn,
  .search-input {
    min-height: 44px; /* Minimum touch target size */
    min-width: 44px;
  }
  
  .action-btn {
    padding: 0.5rem;
  }
}

/* Improved mobile scrolling for search results */
@media (max-width: 768px) {
  .mobile-scroll {
    -webkit-overflow-scrolling: touch;
    overflow-x: auto;
  }
  
  .mobile-no-scroll {
    overflow: hidden;
  }
  
  /* Adjust search results grid for mobile */
  .search-results-grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 0.5rem;
  }
}

/* Mobile-specific optimizations for SPARK Search */
@media (max-width: 640px) {
  .mobile-hide {
    display: none;
  }
  
  .mobile-show {
    display: block;
  }
  
  .mobile-stack {
    flex-direction: column;
  }
  
  .mobile-center {
    text-align: center;
  }
  
  .mobile-full-width {
    width: 100%;
  }
  
  .mobile-mt-2 {
    margin-top: 0.5rem;
  }
  
  .mobile-mb-2 {
    margin-bottom: 0.5rem;
  }
  
  .mobile-px-3 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  
  .mobile-py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  
  /* Adjust search stats for mobile */
  .search-stats-mobile {
    font-size: 0.7rem;
    gap: 0.25rem;
  }
  
  /* Search source badge mobile */
  .search-source-badge {
    padding: 0.125rem 0.375rem;
    font-size: 0.65rem;
  }
}

/* Custom styles for the integrated system */
.stat-card {
  @apply bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 flex items-center space-x-3 sm:space-x-4 space-x-reverse hover:shadow-md transition-shadow duration-200;
}

.stat-icon {
  @apply h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center flex-shrink-0;
}

.btn-primary {
  @apply inline-flex items-center justify-center px-3 sm:px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply inline-flex items-center justify-center px-3 sm:px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-success {
  @apply inline-flex items-center justify-center px-3 sm:px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed;
}

.input-field {
  @apply w-full px-3 sm:px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors;
}

/* SPARK Search specific input styles */
.search-input {
  @apply w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2.5 sm:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400;
}

.action-btn {
  @apply p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors;
}

.pagination-btn {
  @apply px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors;
}

/* SPARK Search specific styles */
.search-source-badge {
  @apply px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-xs;
}

.search-stats-container {
  @apply mb-2 text-xs text-gray-500 dark:text-gray-400 flex items-center flex-wrap gap-2;
}

.search-loading-indicator {
  @apply absolute inset-y-0 left-0 pl-3 flex items-center;
}

.search-loading-spinner {
  @apply animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full;
}

.search-results-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6;
}

.search-result-card {
  @apply p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm active:scale-98;
}

.search-empty-state {
  @apply bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 text-center;
}

.search-tips-container {
  @apply mt-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg;
}

.search-tips-title {
  @apply font-medium mb-1 flex items-center gap-1;
}

.search-tips-list {
  @apply space-y-1 text-right;
}

.search-tip-item {
  @apply text-xs;
}

.search-tip-highlight {
  @apply text-blue-600 dark:text-blue-400;
}

/* Additional custom styles */
.hover\:scale-102:hover {
  transform: scale(1.02);
}

.transition-all-200 {
  transition: all 200ms ease;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}

/* RTL specific adjustments */
[dir="rtl"] .space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
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
  
  .print\:shadow-none {
    box-shadow: none !important;
  }
  
  .print\:border {
    border: 1px solid #000 !important;
  }
  
  /* Hide search interface when printing */
  .search-interface {
    display: none !important;
  }
}

/* Loading animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Active state for touch devices */
.active\:scale-98:active {
  transform: scale(0.98);
}

/* Focus states for accessibility */
.focus-visible\:ring-2:focus-visible {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2;
}

/* Custom grid for responsive layouts */
.grid-responsive {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4;
}

/* Badge variants for SPARK Search */
.badge-primary {
  @apply inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300;
}

.badge-success {
  @apply inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300;
}

.badge-warning {
  @apply inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300;
}

.badge-danger {
  @apply inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300;
}

.badge-info {
  @apply inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300;
}

/* Card hover effects for search results */
.card-hover {
  @apply transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5;
}

/* Table row hover */
.table-row-hover {
  @apply transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800/50;
}

/* Gradient backgrounds */
.bg-gradient-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-gradient-invoice {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.bg-gradient-dispatch {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.bg-gradient-search {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

/* Custom animations for SPARK Search */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.shimmer-effect {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

/* Responsive table container */
.table-container {
  @apply overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700;
}

/* Custom select styling */
.custom-select {
  @apply appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

/* Loading spinner */
.spinner {
  @apply animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-500;
}

/* Custom shadow for elevation */
.elevation-1 {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.elevation-2 {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.elevation-3 {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* Responsive text truncation */
.truncate-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Invoice status indicators */
.status-dot {
  @apply inline-block h-2 w-2 rounded-full mr-2;
}

.status-dot-draft {
  @apply bg-gray-400;
}

.status-dot-issued {
  @apply bg-blue-500;
}

.status-dot-paid {
  @apply bg-green-500;
}

.status-dot-cancelled {
  @apply bg-red-500;
}

/* Search status indicators */
.status-dot-searching {
  @apply bg-yellow-500 animate-pulse;
}

.status-dot-loaded {
  @apply bg-green-500;
}

/* Responsive padding utilities */
.responsive-padding {
  @apply px-3 sm:px-4 lg:px-6;
}

/* Custom border radius */
.rounded-inherit {
  border-radius: inherit;
}

/* Custom z-index layers */
.z-dropdown {
  z-index: 1000;
}

.z-modal {
  z-index: 2000;
}

.z-tooltip {
  z-index: 3000;
}

.z-search {
  z-index: 1500;
}

/* Invoice type indicators */
.invoice-type-b2b {
  @apply border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20;
}

.invoice-type-b2c {
  @apply border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20;
}

.invoice-type-simplified {
  @apply border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20;
}

/* Search result item indicators */
.search-item-highlight {
  @apply border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20;
}

.search-item-new {
  @apply border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20;
}

/* Responsive typography */
.responsive-heading {
  @apply text-lg sm:text-xl lg:text-2xl font-bold;
}

.responsive-subheading {
  @apply text-sm sm:text-base lg:text-lg font-semibold;
}

.responsive-body {
  @apply text-xs sm:text-sm lg:text-base;
}

/* SPARK Search specific typography */
.search-stats-text {
  @apply text-xs sm:text-sm text-gray-500 dark:text-gray-400;
}

.search-source-text {
  @apply text-xs font-medium;
}

/* Custom transitions */
.transition-fast {
  transition: all 150ms ease;
}

.transition-medium {
  transition: all 250ms ease;
}

.transition-slow {
  transition: all 350ms ease;
}

/* Focus ring for keyboard navigation */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900;
}

/* Custom opacity utilities */
.opacity-hover:hover {
  opacity: 0.9;
}

.opacity-disabled {
  opacity: 0.5;
}

/* Responsive gap utilities */
.gap-responsive {
  @apply gap-2 sm:gap-3 lg:gap-4;
}

/* Custom line clamp */
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

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

/* Custom border utilities */
.border-subtle {
  @apply border-gray-200 dark:border-gray-700;
}

.border-emphasis {
  @apply border-gray-300 dark:border-gray-600;
}

/* Search item border utilities */
.border-search-item {
  @apply border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500;
}

/* Responsive margin utilities */
.margin-responsive {
  @apply my-3 sm:my-4 lg:my-6;
}

/* Custom width utilities */
.w-responsive {
  @apply w-full sm:w-auto;
}

/* Invoice form validation styles */
.input-error {
  @apply border-red-500 focus:border-red-500 focus:ring-red-500;
}

.input-success {
  @apply border-green-500 focus:border-green-500 focus:ring-green-500;
}

/* Search input validation */
.search-input-valid {
  @apply border-green-500 focus:border-green-500 focus:ring-green-500;
}

.search-input-loading {
  @apply border-blue-500 focus:border-blue-500 focus:ring-blue-500;
}

/* Responsive height utilities */
.h-responsive {
  @apply h-auto sm:h-64 lg:h-96;
}

/* Custom cursor utilities */
.cursor-grab {
  cursor: grab;
}

.cursor-grabbing {
  cursor: grabbing;
}

.cursor-search {
  cursor: text;
}

.cursor-add-item {
  cursor: pointer;
}

/* Responsive min-height utilities */
.min-h-responsive {
  @apply min-h-[150px] sm:min-h-[200px] lg:min-h-[300px];
}

/* SPARK Search results min-height */
.min-h-search-results {
  min-height: 200px;
}

/* Invoice print styles */
@media print {
  .invoice-print {
    font-family: 'Cairo', sans-serif;
    font-size: 12pt;
  }
  
  .invoice-print * {
    color: #000 !important;
    background: #fff !important;
  }
  
  .invoice-print table {
    page-break-inside: avoid;
  }
  
  .invoice-print .page-break {
    page-break-before: always;
  }
  
  /* Hide search interface when printing */
  .search-interface,
  .search-input,
  .search-results,
  .search-stats {
    display: none !important;
  }
}

/* Performance optimizations for SPARK Search */
.lazy-load {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.lazy-load.loaded {
  opacity: 1;
  transform: translateY(0);
}

/* Virtual scrolling for search results */
.virtual-scroll-container {
  @apply overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700;
  height: 400px;
}

.virtual-scroll-item {
  position: absolute;
  width: 100%;
}

/* Optimize table rendering */
.table-fixed-layout {
  table-layout: fixed;
}

/* Reduce paint operations */
.transform-gpu {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

/* Optimize shadows */
.optimized-shadow {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* SPARK Search form optimizations */
.search-form-section {
  @apply transition-all duration-200 ease-in-out;
}

.search-form-loading {
  @apply opacity-50 pointer-events-none;
}

/* Data loading optimizations */
.skeleton-loader {
  @apply animate-pulse bg-gray-200 dark:bg-gray-700 rounded;
}

.skeleton-loader-search {
  @apply animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg h-20;
}

/* Optimize modal rendering */
.modal-backdrop {
  @apply fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300;
}

.modal-content {
  @apply transform transition-all duration-300 ease-out;
}

/* Invoice card styling */
.invoice-card {
  @apply bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 hover:shadow-md transition-shadow duration-200;
}

.invoice-card-header {
  @apply flex justify-between items-start mb-2 sm:mb-3;
}

.invoice-card-title {
  @apply text-base sm:text-lg font-semibold text-gray-900 dark:text-white;
}

.invoice-card-subtitle {
  @apply text-xs sm:text-sm text-gray-500 dark:text-gray-400;
}

.invoice-card-content {
  @apply space-y-1 sm:space-y-2;
}

.invoice-card-footer {
  @apply flex justify-between items-center mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-700;
}

/* Search result card styling */
.search-result-card-header {
  @apply flex items-center justify-between;
}

.search-result-card-title {
  @apply text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate;
}

.search-result-card-details {
  @apply mt-2 flex items-center flex-wrap gap-1;
}

.search-result-card-meta {
  @apply mt-2 flex items-center flex-wrap gap-1;
}

/* Responsive invoice grid */
.invoice-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4;
}

/* PDF export styles */
.pdf-export-container {
  @apply hidden print:block;
}

/* Invoice summary card */
.invoice-summary-card {
  @apply bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg sm:rounded-xl border border-blue-200 dark:border-blue-700 p-3 sm:p-4 lg:p-5;
}

.invoice-summary-title {
  @apply text-base sm:text-lg font-bold text-blue-900 dark:text-blue-300 mb-3 sm:mb-4;
}

.invoice-summary-item {
  @apply flex justify-between items-center py-2;
}

.invoice-summary-total {
  @apply text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-300 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-blue-200 dark:border-blue-700;
}

/* SPARK Search summary card */
.search-summary-card {
  @apply bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg sm:rounded-xl border border-purple-200 dark:border-purple-700 p-3 sm:p-4;
}

.search-summary-title {
  @apply text-sm sm:text-base font-bold text-purple-900 dark:text-purple-300 mb-2 sm:mb-3;
}

.search-summary-stats {
  @apply flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm;
}

/* Dispatch details card */
.dispatch-details-card {
  @apply bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-5;
}

.dispatch-details-title {
  @apply text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4;
}

.dispatch-details-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4;
}

.dispatch-details-item {
  @apply space-y-1;
}

.dispatch-details-label {
  @apply text-xs sm:text-sm text-gray-500 dark:text-gray-400;
}

.dispatch-details-value {
  @apply font-medium text-gray-900 dark:text-white;
}

/* Performance notice */
.performance-notice {
  @apply text-xs text-gray-500 dark:text-gray-400 italic;
}

/* Optimized button styles for search */
.optimized-btn {
  @apply transform-gpu transition-transform duration-200 hover:scale-105 active:scale-95;
}

.search-btn {
  @apply transform-gpu transition-all duration-200 hover:scale-102 active:scale-98;
}

/* Invoice actions toolbar */
.invoice-actions-toolbar {
  @apply flex items-center space-x-1 sm:space-x-2 space-x-reverse bg-gray-50 dark:bg-gray-800 rounded-lg p-1 sm:p-2;
}

/* Search actions toolbar */
.search-actions-toolbar {
  @apply flex items-center space-x-1 sm:space-x-2 space-x-reverse bg-purple-50 dark:bg-purple-900/20 rounded-lg p-1 sm:p-2;
}

/* Data table optimizations */
.optimized-table {
  @apply w-full divide-y divide-gray-200 dark:divide-gray-700;
}

.optimized-table th {
  @apply px-3 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-800 sticky top-0;
}

.optimized-table td {
  @apply px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 dark:text-white;
}

/* Lazy loading for search images */
.lazy-image {
  @apply opacity-0 transition-opacity duration-300;
}

.lazy-image.loaded {
  @apply opacity-100;
}

/* SPARK Search print optimization */
@media print {
  .print-optimize * {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  
  .break-inside-avoid {
    break-inside: avoid;
  }
  
  /* Hide search interface completely */
  .search-section,
  [class*="search-"],
  [class*="spark-"] {
    display: none !important;
  }
}

/* Responsive SPARK Search form */
@media (max-width: 768px) {
  .search-form-responsive {
    @apply space-y-3;
  }
  
  .search-form-responsive .grid {
    @apply grid-cols-1 gap-3;
  }
  
  .search-input-responsive {
    @apply text-sm;
  }
  
  .search-btn-responsive {
    @apply w-full justify-center;
  }
}

/* SPARK Search system optimizations */
.search-system-optimized {
  @apply transition-opacity duration-300;
}

.search-system-loading {
  @apply opacity-50 pointer-events-none;
}

/* Loading state optimizations for search */
.loading-state-optimized {
  @apply animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800;
}

.search-loading-state {
  @apply animate-pulse bg-gradient-to-r from-purple-200 to-indigo-200 dark:from-purple-800 dark:to-indigo-800;
}

/* Export button optimizations */
.export-btn-optimized {
  @apply relative overflow-hidden;
}

.export-btn-optimized::after {
  content: '';
  @apply absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full;
  animation: shimmer 2s infinite;
}

.search-btn-optimized {
  @apply relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white;
}

.search-btn-optimized::after {
  content: '';
  @apply absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

/* Search transition effects */
.search-transition-enter-active,
.search-transition-leave-active {
  transition: all 0.3s ease;
}

.search-transition-enter-from,
.search-transition-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.search-transition-enter-to,
.search-transition-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Item transition effects */
.item-transition-enter-active,
.item-transition-leave-active {
  transition: all 0.2s ease;
}

.item-transition-enter-from,
.item-transition-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.item-transition-enter-to,
.item-transition-leave-from {
  opacity: 1;
  transform: scale(1);
}

/* Search result animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}

/* Responsive animation delays */
@media (max-width: 640px) {
  .fade-in-up {
    animation-duration: 0.2s;
  }
}

/* Search overlay styles */
.search-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center;
}

.search-overlay-content {
  @apply bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 mx-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto;
}

/* Keyboard navigation for search */
.search-keyboard-nav:focus {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2;
}

/* Accessibility improvements */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .search-input {
    border: 2px solid currentColor;
  }
  
  .search-result-card {
    border: 2px solid currentColor;
  }
}

/* Reduce motion preferences */
@media (prefers-reduced-motion: reduce) {
  .animate-spin,
  .animate-pulse,
  .animate-slide-in,
  .fade-in-up,
  .shimmer-effect {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Dark mode specific search improvements */
@media (prefers-color-scheme: dark) {
  .search-input {
    background-color: #374151;
    border-color: #4b5563;
    color: #f3f4f6;
  }
  
  .search-input::placeholder {
    color: #9ca3af;
  }
  
  .search-result-card:hover {
    background-color: #4b5563;
    border-color: #60a5fa;
  }
  
  .search-tips-container {
    background-color: #1f2937;
    border-color: #374151;
  }
}

/* Light mode specific search improvements */
@media (prefers-color-scheme: light) {
  .search-input {
    background-color: #ffffff;
    border-color: #d1d5db;
    color: #111827;
  }
  
  .search-input::placeholder {
    color: #6b7280;
  }
  
  .search-result-card:hover {
    background-color: #f3f4f6;
    border-color: #3b82f6;
  }
  
  .search-tips-container {
    background-color: #f9fafb;
    border-color: #e5e7eb;
  }
}

/* Print mode improvements */
@media print {
  .no-print-search {
    display: none !important;
  }
  
  .search-section {
    break-inside: avoid;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .search-result-card {
    padding: 1rem;
    min-height: 80px;
  }
  
  .search-input {
    font-size: 16px; /* Prevent iOS zoom on focus */
  }
  
  .search-btn {
    min-height: 48px;
    min-width: 48px;
  }
}

/* High DPI screen optimizations */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .search-loading-spinner {
    border-width: 3px;
  }
}

/* Wide screen optimizations */
@media (min-width: 1920px) {
  .search-results-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1.5rem;
  }
  
  .search-result-card {
    padding: 1.5rem;
  }
}

/* Small screen optimizations */
@media (max-width: 360px) {
  .search-stats-container {
    font-size: 0.65rem;
  }
  
  .search-source-badge {
    padding: 0.125rem 0.25rem;
    font-size: 0.6rem;
  }
  
  .search-result-card {
    padding: 0.75rem;
  }
}

/* Landscape mode optimizations */
@media (max-height: 500px) and (orientation: landscape) {
  .search-results-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    max-height: 250px;
    overflow-y: auto;
  }
}

/* Loading skeleton for search */
.search-skeleton {
  @apply animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-20 mb-3;
}

.search-skeleton-title {
  @apply h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2;
}

.search-skeleton-details {
  @apply h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2;
}

/* Smooth scrolling for search results */
.search-results-container {
  scroll-behavior: smooth;
}

/* Focus styles for accessibility */
.search-result-card:focus-visible {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2;
}

/* Loading overlay for search */
.search-loading-overlay {
  @apply absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-10;
}

/* Empty search state */
.search-empty-state-icon {
  @apply mx-auto h-12 w-12 text-gray-400 dark:text-gray-500;
}

.search-empty-state-title {
  @apply mt-3 text-sm font-medium text-gray-900 dark:text-white;
}

.search-empty-state-description {
  @apply mt-1 text-xs text-gray-500 dark:text-gray-400;
}

/* Search filter styles */
.search-filter-badge {
  @apply inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300;
}

.search-filter-remove {
  @apply mr-1 hover:text-blue-900 dark:hover:text-blue-200 cursor-pointer;
}

/* Search pagination */
.search-pagination {
  @apply flex items-center justify-center space-x-2 mt-4;
}

.search-pagination-btn {
  @apply px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed;
}

.search-pagination-info {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

/* Search result counter */
.search-result-counter {
  @apply text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300;
}

/* Search highlight animation */
@keyframes highlight {
  0% {
    background-color: rgba(59, 130, 246, 0.1);
  }
  100% {
    background-color: transparent;
  }
}

.search-highlight {
  animation: highlight 1s ease-out;
}

/* Responsive search tips */
@media (max-width: 480px) {
  .search-tips-list {
    font-size: 0.7rem;
  }
  
  .search-tip-item {
    line-height: 1.4;
  }
}

/* Search performance warning */
.search-performance-warning {
  @apply text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg mt-2;
}

/* Search connection status */
.search-connection-status {
  @apply inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full;
}

.search-connection-online {
  @apply bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300;
}

.search-connection-offline {
  @apply bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300;
}

.search-connection-slow {
  @apply bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300;
}

/* Search type indicators */
.search-type-indicator {
  @apply inline-block w-2 h-2 rounded-full mr-1;
}

.search-type-firebase {
  @apply bg-blue-500;
}

.search-type-cache {
  @apply bg-green-500;
}

.search-type-local {
  @apply bg-yellow-500;
}

/* Search animation delays for staggered loading */
.search-item-delay-1 {
  animation-delay: 0.1s;
}

.search-item-delay-2 {
  animation-delay: 0.2s;
}

.search-item-delay-3 {
  animation-delay: 0.3s;
}

.search-item-delay-4 {
  animation-delay: 0.4s;
}

.search-item-delay-5 {
  animation-delay: 0.5s;
}
</style>


