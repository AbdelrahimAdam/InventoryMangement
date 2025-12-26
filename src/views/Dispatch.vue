<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4 space-x-reverse">
            <router-link to="/" class="flex items-center space-x-2 space-x-reverse hover:opacity-80 transition-opacity">
              <div class="h-8 w-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">م</span>
              </div>
              <div>
                <h1 class="text-lg font-bold text-gray-900 dark:text-white">صرف المخزون</h1>
                <p class="text-xs text-gray-500 dark:text-gray-400">نظام إدارة المخزون والفواتير</p>
              </div>
            </router-link>
          </div>

          <div class="flex items-center space-x-3 space-x-reverse">
            <div class="hidden md:flex items-center space-x-2 space-x-reverse text-sm">
              <span class="text-gray-600 dark:text-gray-300">{{ userName }}</span>
              <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-xs">
                {{ userRole }}
              </span>
            </div>

            <div class="flex items-center space-x-2 space-x-reverse">
              <router-link 
                to="/inventory" 
                class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
                المخزون
              </router-link>

              <!-- ====== INVOICE SYSTEM TOGGLE BUTTON ====== -->
              <!-- Make sure this button is visible by removing any conditions -->
              <button 
                @click="toggleInvoiceSystem"
                :class="[
                  'inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                  showInvoiceSystem 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                    : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600'
                ]"
                style="display: inline-flex !important;"
              >
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                {{ showInvoiceSystem ? 'العودة للصرف' : 'نظام الفواتير' }}
              </button>
              <!-- ====== END TOGGLE BUTTON ====== -->
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="w-full px-4 sm:px-6 lg:px-8 py-8">
      <!-- ============================================ -->
      <!-- INVOICE SYSTEM SECTION (When toggled ON) -->
      <!-- ============================================ -->
      <div v-if="showInvoiceSystem">
        <!-- Invoice System Header -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">نظام الفواتير الضريبية</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">نظام فواتير متوافق مع مصلحة الضرائب المصرية</p>
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
              <button @click="createNewInvoice" class="btn-primary">
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                فاتورة جديدة
              </button>
              <button @click="exportInvoicesToExcel" :disabled="invoices.length === 0" class="btn-secondary">
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                تصدير Excel
              </button>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="stat-card">
              <div class="stat-icon bg-blue-100 dark:bg-blue-900">
                <svg class="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">إجمالي الفواتير</p>
                <p class="text-xl font-bold text-gray-900 dark:text-white">{{ totalInvoices }}</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon bg-green-100 dark:bg-green-900">
                <svg class="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">إجمالي المبيعات</p>
                <p class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(totalSales) }}</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon bg-yellow-100 dark:bg-yellow-900">
                <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">العملاء</p>
                <p class="text-xl font-bold text-gray-900 dark:text-white">{{ uniqueCustomers }}</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon bg-purple-100 dark:bg-purple-900">
                <svg class="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">الضريبة</p>
                <p class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(totalTax) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Invoice Creation/Editing Form -->
        <div v-if="showInvoiceForm" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
          <!-- Form Header -->
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ editingInvoice ? 'تعديل فاتورة #' + editingInvoice.invoiceNumber : 'إنشاء فاتورة جديدة' }}
            </h3>
            <button @click="cancelInvoiceForm" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Invoice Form -->
          <div class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Invoice Details -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نوع الفاتورة *</label>
                  <select v-model="invoiceForm.type" class="input-field" @change="onInvoiceTypeChange">
                    <option value="B2B">فاتورة ضريبية (B2B) - نشاط تجاري</option>
                    <option value="B2C">فاتورة ضريبية (B2C) - مستهلك نهائي</option>
                    <option value="simplified">فاتورة مبسطة</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">طريقة الدفع *</label>
                  <select v-model="invoiceForm.paymentMethod" class="input-field">
                    <option value="cash">نقدي</option>
                    <option value="bank">تحويل بنكي</option>
                    <option value="check">شيك</option>
                    <option value="credit">آجل</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ملاحظات</label>
                  <textarea v-model="invoiceForm.notes" rows="3" class="input-field" placeholder="ملاحظات إضافية..."></textarea>
                </div>
              </div>

              <!-- Customer Information -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">اسم العميل *</label>
                  <input v-model="invoiceForm.customer.name" type="text" class="input-field" placeholder="اسم العميل الكامل" required>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">رقم الهاتف *</label>
                  <input v-model="invoiceForm.customer.phone" type="tel" class="input-field" placeholder="01XXXXXXXXX" required>
                </div>

                <div v-if="invoiceForm.type === 'B2B'">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الرقم الضريبي *</label>
                  <input v-model="invoiceForm.customer.taxId" type="text" class="input-field" placeholder="الرقم الضريبي (14 رقم)" pattern="[0-9]{14}" required>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">العنوان</label>
                  <input v-model="invoiceForm.customer.address" type="text" class="input-field" placeholder="عنوان العميل">
                </div>
              </div>
            </div>

            <!-- Warehouse Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">اختر المخزن *</label>
              <select v-model="selectedWarehouseForInvoice" @change="loadWarehouseItems" class="input-field" required>
                <option value="">اختر مخزن</option>
                <option v-for="warehouse in availableWarehouses" :key="warehouse.id" :value="warehouse.id">
                  {{ warehouse.name_ar }}
                </option>
              </select>
            </div>

            <!-- Items Section -->
            <div>
              <div class="flex justify-between items-center mb-4">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white">الأصناف</h4>
                <div class="relative">
                  <input 
                    v-model="itemSearch" 
                    @input="searchItems" 
                    type="text" 
                    class="input-field pl-10" 
                    placeholder="ابحث عن صنف..."
                    :disabled="!selectedWarehouseForInvoice"
                  >
                  <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
              </div>

              <!-- Available Items Grid -->
              <div v-if="availableItemsForInvoice.length > 0" class="mb-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div 
                    v-for="item in availableItemsForInvoice" 
                    :key="item.id"
                    @click="addItemToInvoice(item)"
                    class="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md cursor-pointer transition-all duration-200"
                  >
                    <div class="flex justify-between items-start">
                      <div class="flex-1">
                        <p class="font-medium text-gray-900 dark:text-white truncate">{{ item.name }}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ item.code }}</p>
                        <div class="mt-2 flex items-center gap-2">
                          <span class="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                            {{ getWarehouseLabel(item.warehouse_id) }}
                          </span>
                          <span :class="['text-xs px-2 py-0.5 rounded', getQuantityClass(item.remaining_quantity)]">
                            {{ formatNumber(item.remaining_quantity) }} متبقي
                          </span>
                        </div>
                      </div>
                      <svg class="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Selected Items Table -->
              <div v-if="invoiceForm.items.length > 0" class="overflow-x-auto mb-6">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300">الصنف</th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300">السعر</th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300">الكمية</th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300">الخصم %</th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300">الإجمالي</th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="(item, index) in invoiceForm.items" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="px-4 py-3">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.name }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.code }}</div>
                      </td>
                      <td class="px-4 py-3">
                        <input 
                          v-model.number="item.unitPrice" 
                          type="number" 
                          min="0" 
                          step="0.01"
                          @change="updateItemTotal(index)"
                          class="w-28 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                      </td>
                      <td class="px-4 py-3">
                        <div class="flex items-center">
                          <button @click="decreaseQuantity(index)" 
                            class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-r-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            :disabled="item.quantity <= 1">
                            -
                          </button>
                          <input 
                            v-model.number="item.quantity" 
                            type="number" 
                            min="1" 
                            :max="item.maxQuantity"
                            @change="validateItemQuantity(index)"
                            class="w-20 px-2 py-1.5 border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                          <button @click="increaseQuantity(index)" 
                            class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            :disabled="item.quantity >= item.maxQuantity">
                            +
                          </button>
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          متوفر: {{ formatNumber(item.maxQuantity) }}
                        </div>
                      </td>
                      <td class="px-4 py-3">
                        <input 
                          v-model.number="item.discount" 
                          type="number" 
                          min="0" 
                          max="100"
                          step="0.1"
                          @change="updateItemTotal(index)"
                          class="w-24 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                      </td>
                      <td class="px-4 py-3">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(item.total) }}</div>
                        <div v-if="item.discount > 0" class="text-xs text-red-600 dark:text-red-400">
                          خصم {{ item.discount }}%
                        </div>
                      </td>
                      <td class="px-4 py-3">
                        <button @click="removeItem(index)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Invoice Summary -->
            <div class="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">تفاصيل الفاتورة</h5>
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400">عدد الأصناف:</span>
                      <span class="font-medium text-gray-900 dark:text-white">{{ invoiceForm.items.length }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400">إجمالي الكميات:</span>
                      <span class="font-medium text-gray-900 dark:text-white">{{ totalQuantity }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400">المخزن:</span>
                      <span class="font-medium text-gray-900 dark:text-white">{{ getWarehouseLabel(selectedWarehouseForInvoice) }}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">الحسابات</h5>
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400">المجموع:</span>
                      <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(subtotal) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400">الخصم:</span>
                      <span class="font-medium text-red-600 dark:text-red-400">-{{ formatCurrency(totalDiscount) }}</span>
                    </div>
                    <div v-if="invoiceForm.type === 'B2B' || invoiceForm.type === 'B2C'" class="flex justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400">الضريبة (14%):</span>
                      <span class="font-medium text-gray-900 dark:text-white">+{{ formatCurrency(taxAmount) }}</span>
                    </div>
                  </div>
                </div>

                <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div class="text-center">
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">الإجمالي النهائي</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(totalAmount) }}</p>
                    <div v-if="invoiceForm.paymentMethod === 'credit'" class="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                      (آجل - سداد خلال 30 يوم)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 space-x-reverse">
              <button @click="cancelInvoiceForm" class="btn-secondary">إلغاء</button>
              <button @click="saveInvoice" :disabled="!canSaveInvoice || saving" class="btn-primary">
                <span v-if="saving" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  جاري الحفظ...
                </span>
                <span v-else>حفظ الفاتورة</span>
              </button>
              <button @click="saveAndPrint" :disabled="!canSaveInvoice" class="btn-success">
                حفظ وطباعة
              </button>
            </div>
          </div>
        </div>

        <!-- Invoices List (When not in create/edit mode) -->
        <div v-if="!showInvoiceForm" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <!-- List Header with Filters -->
          <div class="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">الفواتير المسجلة</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">إجمالي {{ filteredInvoices.length }} فاتورة</p>
              </div>

              <div class="flex flex-col sm:flex-row gap-3">
                <div class="relative">
                  <input 
                    v-model="invoiceSearchTerm" 
                    @input="filterInvoices" 
                    type="text" 
                    class="input-field pl-10" 
                    placeholder="ابحث برقم أو اسم..."
                  >
                  <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>

                <select v-model="invoiceStatusFilter" @change="filterInvoices" class="input-field">
                  <option value="">جميع الحالات</option>
                  <option value="draft">مسودة</option>
                  <option value="issued">صادرة</option>
                  <option value="paid">مدفوعة</option>
                  <option value="cancelled">ملغية</option>
                </select>

                <select v-model="invoiceTypeFilter" @change="filterInvoices" class="input-field">
                  <option value="">جميع الأنواع</option>
                  <option value="B2B">B2B</option>
                  <option value="B2C">B2C</option>
                  <option value="simplified">مبسطة</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Invoices Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">رقم الفاتورة</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">التاريخ</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">العميل</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">النوع</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">المبلغ</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الحالة</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الإجراءات</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="invoice in paginatedInvoices" :key="invoice.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">#{{ invoice.invoiceNumber }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ invoice.items?.length || 0 }} صنف</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">{{ formatDate(invoice.date) }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(invoice.date) }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ invoice.customer.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ invoice.customer.phone }}</div>
                    <div v-if="invoice.customer.taxId" class="text-xs text-blue-600 dark:text-blue-400">
                      ضريبي: {{ invoice.customer.taxId }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs rounded-full" :class="getInvoiceTypeClass(invoice.type)">
                      {{ getInvoiceTypeLabel(invoice.type) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(invoice.totalAmount) }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ invoice.paymentMethod === 'cash' ? 'نقدي' : 
                         invoice.paymentMethod === 'bank' ? 'بنكي' : 
                         invoice.paymentMethod === 'check' ? 'شيك' : 'آجل' }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs rounded-full" :class="getInvoiceStatusClass(invoice.status)">
                      {{ getInvoiceStatusLabel(invoice.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center space-x-2 space-x-reverse">
                      <button @click="viewInvoice(invoice)" class="action-btn text-blue-600 dark:text-blue-400" title="عرض التفاصيل">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </button>
                      <button @click="printInvoice(invoice)" class="action-btn text-green-600 dark:text-green-400" title="طباعة الفاتورة">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                        </svg>
                      </button>
                      <button @click="editInvoice(invoice)" v-if="invoice.status === 'draft'" class="action-btn text-yellow-600 dark:text-yellow-400" title="تعديل الفاتورة">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button @click="deleteInvoice(invoice.id)" v-if="invoice.status === 'draft'" class="action-btn text-red-600 dark:text-red-400" title="حذف الفاتورة">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-if="filteredInvoices.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">لا توجد فواتير</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ invoiceSearchTerm ? 'لم يتم العثور على فواتير تطابق بحثك' : 'ابدأ بإنشاء فاتورتك الأولى' }}
            </p>
            <div class="mt-6">
              <button @click="createNewInvoice" class="btn-primary">
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                إنشاء فاتورة جديدة
              </button>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="filteredInvoices.length > 0" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div class="text-sm text-gray-700 dark:text-gray-300">
                عرض <span class="font-medium">{{ startIndex + 1 }}</span> إلى <span class="font-medium">{{ endIndex }}</span> من <span class="font-medium">{{ filteredInvoices.length }}</span> فاتورة
              </div>
              <div class="flex items-center space-x-2">
                <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">
                  السابق
                </button>
                <span class="text-sm text-gray-700 dark:text-gray-300">
                  صفحة {{ currentPage }} من {{ totalPages }}
                </span>
                <button @click="nextPage" :disabled="currentPage >= totalPages" class="pagination-btn">
                  التالي
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================ -->
      <!-- ORIGINAL DISPATCH SECTION (When Invoice System is OFF) -->
      <!-- ============================================ -->
      <div v-else>
        <!-- Original dispatch system content -->
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center">
              <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center ml-2 sm:ml-4">
                <svg class="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
              </div>
              <div>
                <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">إجمالي عمليات الصرف</p>
                <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(totalDispatches) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center">
              <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center ml-2 sm:ml-4">
                <svg class="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">صرف هذا الشهر</p>
                <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(monthlyDispatches) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center">
              <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center ml-2 sm:ml-4">
                <svg class="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">قيمة الصرف</p>
                <p class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(totalDispatchValue) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Create Dispatch Section -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">إنشاء صرف جديد</h2>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">صرف أصناف من المخازن إلى خارج النظام</p>
            </div>

            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <!-- Search Box -->
              <div class="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  v-model="searchTerm"
                  @input="handleSearch"
                  placeholder="ابحث عن صنف..."
                  class="w-full px-4 py-2.5 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  :disabled="loading"
                >
                <svg class="absolute right-3 top-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>

              <!-- Warehouse Filter for Available Items -->
              <select
                v-model="selectedWarehouse"
                @change="updateAvailableItems"
                class="px-3 sm:px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 min-h-[44px] min-w-[180px]"
                :disabled="loading || !dispatchFromWarehouses.length"
              >
                <option value="">جميع المخازن</option>
                <option v-for="warehouse in dispatchFromWarehouses" :key="warehouse.id" :value="warehouse.id">
                  {{ warehouse.name_ar }}
                </option>
              </select>

              <button 
                v-if="canPerformDispatch"
                @click="showDispatchModal = true"
                :disabled="loading || availableItems.length === 0"
                class="inline-flex items-center justify-center px-3 sm:px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[140px]"
              >
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span class="hidden sm:inline">إنشاء صرف جديد</span>
                <span class="inline sm:hidden">صرف جديد</span>
              </button>
            </div>
          </div>

          <!-- Available Items -->
          <div v-if="availableItems.length > 0" class="mt-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ selectedWarehouse ? `الأصناف المتاحة في ${getWarehouseLabel(selectedWarehouse)}` : 'جميع الأصناف المتاحة' }}
                <span class="text-xs text-gray-500">({{ availableItems.length }} صنف)</span>
              </h3>
              <div class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <span>المعروض: {{ Math.min(8, availableItems.length) }} من {{ availableItems.length }}</span>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
              <div 
                v-for="item in displayedAvailableItems" 
                :key="item.id"
                class="p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm"
                @click="selectItemForDispatch(item)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ item.name }}</p>
                    <div class="flex items-center flex-wrap gap-1 sm:gap-2 mt-1">
                      <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{{ item.code }}</span>
                      <span class="text-xs px-1.5 py-0.5 rounded" 
                            :class="getQuantityClass(item.remaining_quantity)">
                        {{ formatNumber(item.remaining_quantity) }} متبقي
                      </span>
                      <span v-if="item.warehouse_id" class="text-xs text-gray-500 dark:text-gray-400">
                        {{ getWarehouseLabel(item.warehouse_id) }}
                      </span>
                    </div>
                  </div>
                  <svg class="w-4 h-4 text-gray-400 flex-shrink-0 mr-1 sm:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>

            <div v-if="availableItems.length > 8" class="text-center mt-4">
              <button 
                @click="showAllItems = !showAllItems"
                class="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg transition-colors"
              >
                {{ showAllItems ? 'عرض أقل' : `عرض المزيد (+${availableItems.length - 8})` }}
              </button>
            </div>
          </div>

          <div v-else-if="!loading" class="text-center py-8">
            <div class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
              <svg class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
              </svg>
            </div>
            <p class="text-gray-500 dark:text-gray-400 text-sm">
              {{ selectedWarehouse ? 'لا توجد أصناف في هذا المخزن' : 'لا توجد أصناف متاحة' }}
            </p>
          </div>

          <div v-else class="text-center py-6">
            <div class="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600 mx-auto mb-3"></div>
            <p class="text-gray-500 dark:text-gray-400 text-xs">جاري تحميل الأصناف...</p>
          </div>
        </div>

        <!-- Dispatch History -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div class="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
              <div>
                <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">سجل عمليات الصرف</h2>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">جميع عمليات الصرف المسجلة في النظام</p>
              </div>

              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                <!-- Search History -->
                <div class="relative flex-1 sm:flex-initial min-w-[200px]">
                  <input
                    type="text"
                    v-model="historySearch"
                    @input="applyHistoryFilters"
                    placeholder="بحث في السجل..."
                    class="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                  <svg class="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>

                <!-- Warehouse Filter -->
                <select
                  v-model="historyWarehouseFilter"
                  @change="applyHistoryFilters"
                  class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm min-w-[150px]"
                >
                  <option value="">جميع المخازن</option>
                  <option v-for="warehouse in dispatchFromWarehouses" :key="warehouse.id" :value="warehouse.id">
                    {{ warehouse.name_ar }}
                  </option>
                </select>

                <!-- Date Filter -->
                <select
                  v-model="dateFilter"
                  @change="applyHistoryFilters"
                  class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm min-w-[140px]"
                >
                  <option value="all">جميع الفترات</option>
                  <option value="today">اليوم</option>
                  <option value="week">هذا الأسبوع</option>
                  <option value="month">هذا الشهر</option>
                  <option value="custom">فترة مخصصة</option>
                </select>

                <!-- Custom Date Range -->
                <div v-if="dateFilter === 'custom'" class="flex flex-wrap items-center gap-2">
                  <input 
                    type="date" 
                    v-model="customDateFrom"
                    @change="applyHistoryFilters"
                    class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm min-w-[120px]"
                  >
                  <span class="text-gray-500 dark:text-gray-400 text-xs">إلى</span>
                  <input 
                    type="date" 
                    v-model="customDateTo"
                    @change="applyHistoryFilters"
                    class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm min-w-[120px]"
                  >
                </div>

                <!-- Export Button -->
                <button 
                  v-if="canExport"
                  @click="exportDispatches"
                  :disabled="filteredDispatchHistory.length === 0"
                  class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <span class="hidden sm:inline">تصدير Excel</span>
                  <span class="inline sm:hidden">تصدير</span>
                </button>
              </div>
            </div>

            <!-- Active Filters Badges -->
            <div v-if="hasFilters" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-xs text-gray-600 dark:text-gray-400">الفلاتر النشطة:</span>

                <span v-if="historySearch" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                  بحث: "{{ historySearch }}"
                  <button @click="historySearch = ''; applyHistoryFilters()" class="mr-1 hover:text-blue-900 dark:hover:text-blue-200">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                </span>

                <span v-if="historyWarehouseFilter" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300">
                  مخزن: {{ getWarehouseLabel(historyWarehouseFilter) }}
                  <button @click="historyWarehouseFilter = ''; applyHistoryFilters()" class="mr-1 hover:text-indigo-900 dark:hover:text-indigo-200">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                </span>

                <span v-if="dateFilter !== 'all'" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300">
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
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
          <div v-if="loading" class="p-8 text-center">
            <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-700 dark:text-gray-300 text-sm">جاري تحميل البيانات...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredDispatchHistory.length === 0" class="p-6 sm:p-8 text-center">
            <div class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
              <svg class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </div>
            <h3 class="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">لا توجد عمليات صرف</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">
              {{ hasFilters ? 'لا توجد عمليات صرف تطابق التصفية المحددة' : 'لم يتم تسجيل أي عمليات صرف حتى الآن' }}
            </p>
            <button 
              v-if="canPerformDispatch"
              @click="showDispatchModal = true"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm min-h-[44px]"
            >
              إنشاء أول صرف
            </button>
          </div>

          <!-- Table Content -->
          <div v-else class="w-full overflow-hidden">
            <!-- Desktop Table -->
            <div class="hidden lg:block">
              <!-- Fixed Table Headers -->
              <div class="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div class="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  <div class="col-span-2 text-right">التاريخ والوقت</div>
                  <div class="col-span-2 text-right">الصنف</div>
                  <div class="col-span-2 text-right">من مخزن</div>
                  <div class="col-span-1 text-right">إلى</div>
                  <div class="col-span-1 text-right">الكمية</div>
                  <div class="col-span-1 text-right">القيمة</div>
                  <div class="col-span-1 text-right">بواسطة</div>
                  <div class="col-span-2 text-right">الإجراءات</div>
                </div>
              </div>

              <!-- Scrollable Table Body -->
              <div class="overflow-y-auto" style="max-height: calc(100vh - 400px);">
                <div class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <div 
                    v-for="dispatch in paginatedHistory" 
                    :key="dispatch.id" 
                    class="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 border-b border-gray-100 dark:border-gray-700"
                  >
                    <!-- Date & Time -->
                    <div class="col-span-2">
                      <div class="text-sm text-gray-900 dark:text-white">{{ formatDate(dispatch.timestamp) }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(dispatch.timestamp) }}</div>
                    </div>

                    <!-- Item -->
                    <div class="col-span-2">
                      <div class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ dispatch.item_name }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ dispatch.item_code }}</div>
                    </div>

                    <!-- From Warehouse -->
                    <div class="col-span-2 text-sm text-gray-900 dark:text-white truncate">
                      {{ getWarehouseLabel(dispatch.from_warehouse) }}
                    </div>

                    <!-- Destination -->
                    <div class="col-span-1 text-sm text-gray-900 dark:text-white truncate">
                      {{ getDestinationLabel(dispatch.destination || dispatch.to_warehouse) }}
                    </div>

                    <!-- Quantity -->
                    <div class="col-span-1">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap" 
                            :class="getDispatchQuantityClass(dispatch.total_delta)">
                        {{ formatNumber(Math.abs(dispatch.total_delta)) }}
                      </span>
                    </div>

                    <!-- Value -->
                    <div class="col-span-1 text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ formatCurrency(calculateDispatchValue(dispatch)) }}
                    </div>

                    <!-- User -->
                    <div class="col-span-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                      {{ dispatch.user_name || dispatch.created_by || 'مستخدم النظام' }}
                    </div>

                    <!-- Actions -->
                    <div class="col-span-2">
                      <div class="flex items-center space-x-2 space-x-reverse">
                        <button 
                          @click="viewDispatchDetails(dispatch)"
                          class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                          title="عرض التفاصيل"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        </button>
                        <button 
                          @click="printDispatch(dispatch)"
                          class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 hover:bg-green-50 dark:hover:bg-green-900/30 rounded"
                          title="طباعة"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div class="p-2 sm:p-4">
                <div class="space-y-3">
                  <div 
                    v-for="dispatch in paginatedHistory" 
                    :key="dispatch.id" 
                    class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-150"
                  >
                    <!-- Header -->
                    <div class="flex justify-between items-start mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                      <div>
                        <div class="text-sm font-medium text-gray-900 dark:text-white">{{ dispatch.item_name }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatDate(dispatch.timestamp) }} - {{ formatTime(dispatch.timestamp) }}</div>
                      </div>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap" 
                            :class="getDispatchQuantityClass(dispatch.total_delta)">
                        {{ formatNumber(Math.abs(dispatch.total_delta)) }}
                      </span>
                    </div>

                    <!-- Details Grid -->
                    <div class="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">من مخزن</div>
                        <div class="font-medium text-gray-900 dark:text-white">{{ getWarehouseLabel(dispatch.from_warehouse) }}</div>
                      </div>
                      <div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">إلى</div>
                        <div class="font-medium text-gray-900 dark:text-white">{{ getDestinationLabel(dispatch.destination || dispatch.to_warehouse) }}</div>
                      </div>
                      <div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">القيمة</div>
                        <div class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(calculateDispatchValue(dispatch)) }}</div>
                      </div>
                      <div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">بواسطة</div>
                        <div class="font-medium text-gray-900 dark:text-white">{{ dispatch.user_name || dispatch.created_by || 'مستخدم النظام' }}</div>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        {{ dispatch.item_code }}
                      </div>
                      <div class="flex items-center space-x-3 space-x-reverse">
                        <button 
                          @click="viewDispatchDetails(dispatch)"
                          class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center p-1"
                        >
                          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                          تفاصيل
                        </button>
                        <button 
                          @click="printDispatch(dispatch)"
                          class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-sm flex items-center p-1"
                        >
                          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div v-if="totalHistoryPages > 1" class="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-right">
                  عرض {{ startIndex + 1 }} - {{ Math.min(endIndex, filteredDispatchHistory.length) }} من {{ filteredDispatchHistory.length }}
                </div>
                <div class="flex items-center justify-center space-x-2">
                  <button 
                    @click="prevPage"
                    :disabled="currentHistoryPage === 1"
                    class="px-3 py-1.5 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[36px] min-w-[80px]"
                  >
                    السابق
                  </button>
                  <span class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 min-w-[100px] text-center">
                    صفحة {{ currentHistoryPage }} من {{ totalHistoryPages }}
                  </span>
                  <button 
                    @click="nextPage"
                    :disabled="currentHistoryPage === totalHistoryPages"
                    class="px-3 py-1.5 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[36px] min-w-[80px]"
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
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 flex flex-col items-center">
        <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-700 dark:text-gray-300 text-sm">جاري تحميل البيانات...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import * as XLSX from 'xlsx';
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
    // SECTION 2: INVOICE SYSTEM STATE
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
    const availableItemsForInvoice = ref([]);
    
    // ============================================
    // SECTION 3: COMPUTED PROPERTIES FROM STORE
    // ============================================
    const userRole = computed(() => store.getters.userRole);
    const userName = computed(() => store.getters.userName);
    const userProfile = computed(() => store.getters.userProfile);
    const allInventory = computed(() => store.state.inventory || []);
    const allTransactions = computed(() => store.state.transactions || []);
    const allWarehouses = computed(() => store.state.warehouses || []);
    
    // Store getters
    const canExport = computed(() => userRole.value === 'superadmin' || userRole.value === 'company_manager');
    const dispatchFromWarehouses = computed(() => store.getters.dispatchFromWarehouses || []);
    const canViewDispatches = computed(() => store.getters.isAuthenticated);
    
    // Check if user can perform dispatch (only superadmin)
    const canPerformDispatch = computed(() => userRole.value === 'superadmin');
    
    // ============================================
    // SECTION 4: ORIGINAL DISPATCH COMPUTED PROPERTIES
    // ============================================
    // Dispatch transactions (type = 'DISPATCH')
    const dispatchTransactions = computed(() => {
      return (allTransactions.value || []).filter(t => t.type === 'DISPATCH');
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
    
    // Filter dispatch history
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
    // SECTION 5: INVOICE SYSTEM COMPUTED PROPERTIES
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
    
    const availableWarehouses = computed(() => dispatchFromWarehouses.value);
    
    // ============================================
    // SECTION 6: UTILITY FUNCTIONS
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
    
    const calculateDispatchValue = (dispatch) => {
      const quantity = Math.abs(dispatch.total_delta || 0);
      const pricePerItem = 50;
      return quantity * pricePerItem;
    };
    
    const getDispatchQuantityClass = (quantity) => {
      const qty = Math.abs(quantity || 0);
      if (qty < 10) return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300';
      if (qty < 50) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300';
      return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300';
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
    // SECTION 7: ORIGINAL DISPATCH ACTIONS
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
    
    const handleDispatchSuccess = () => {
      showDispatchModal.value = false;
      selectedItemForDispatch.value = null;
      currentHistoryPage.value = 1;
      
      store.dispatch('showNotification', {
        type: 'success',
        message: 'تمت عملية الصرف بنجاح'
      });
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
    
    const viewDispatchDetails = (dispatch) => {
      const details = `
تفاصيل الصرف:

• الصنف: ${dispatch.item_name}
• الكود: ${dispatch.item_code || 'N/A'}
• الكمية: ${Math.abs(dispatch.total_delta)} وحدة
• من مخزن: ${getWarehouseLabel(dispatch.from_warehouse)}
• إلى: ${getDestinationLabel(dispatch.destination || dispatch.to_warehouse)}
• التاريخ: ${formatDateTime(dispatch.timestamp)}
• القيمة: ${formatCurrency(calculateDispatchValue(dispatch))}
• تم بواسطة: ${dispatch.user_name || dispatch.created_by || 'مستخدم النظام'}
• الملاحظات: ${dispatch.notes || 'لا توجد ملاحظات'}
      `;
      
      alert(details);
    };
    
    const printDispatch = (dispatch) => {
      const printWindow = window.open('', '_blank');
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
              <td>${dispatch.item_name}</td>
            </tr>
            <tr>
              <th>كود الصنف</th>
              <td>${dispatch.item_code || 'N/A'}</td>
            </tr>
            <tr>
              <th>الكمية</th>
              <td>${Math.abs(dispatch.total_delta)} وحدة</td>
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
          'الكمية': Math.abs(dispatch.total_delta || 0),
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
    // SECTION 8: INVOICE SYSTEM ACTIONS
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
      availableItemsForInvoice.value = [];
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
      availableItemsForInvoice.value = [];
      editingInvoice.value = null;
    };
    
    const onInvoiceTypeChange = () => {
      if (invoiceForm.value.type !== 'B2B') {
        invoiceForm.value.customer.taxId = '';
      }
    };
    
    const loadWarehouseItems = () => {
      if (!selectedWarehouseForInvoice.value) {
        availableItemsForInvoice.value = [];
        return;
      }
      
      let items = allInventory.value.filter(item => 
        item.remaining_quantity > 0 && 
        item.warehouse_id === selectedWarehouseForInvoice.value
      );
      
      // Filter out items already in the invoice
      const currentItemIds = new Set(invoiceForm.value.items.map(item => item.id));
      items = items.filter(item => !currentItemIds.has(item.id));
      
      // Apply search filter if any
      if (itemSearch.value.trim()) {
        const term = itemSearch.value.toLowerCase().trim();
        items = items.filter(item => 
          item.name?.toLowerCase().includes(term) ||
          item.code?.toLowerCase().includes(term)
        );
      }
      
      availableItemsForInvoice.value = items.sort((a, b) => b.remaining_quantity - a.remaining_quantity);
    };
    
    const searchItems = () => {
      loadWarehouseItems();
    };
    
    const addItemToInvoice = (item) => {
      const existingItem = invoiceForm.value.items.find(i => i.id === item.id);
      
      if (existingItem) {
        // Update quantity if already exists
        existingItem.quantity = Math.min(existingItem.quantity + 1, item.remaining_quantity);
        updateItemTotal(invoiceForm.value.items.indexOf(existingItem));
      } else {
        // Add new item
        invoiceForm.value.items.push({
          id: item.id,
          name: item.name,
          code: item.code,
          unitPrice: 0,
          quantity: 1,
          discount: 0,
          total: 0,
          maxQuantity: item.remaining_quantity
        });
      }
      
      // Remove from available items
      loadWarehouseItems();
    };
    
    const removeItem = (index) => {
      invoiceForm.value.items.splice(index, 1);
      loadWarehouseItems();
    };
    
    const increaseQuantity = (index) => {
      const item = invoiceForm.value.items[index];
      if (item.quantity < item.maxQuantity) {
        item.quantity++;
        updateItemTotal(index);
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

المجموع: ${formatCurrency(subtotal.value)}
الخصم: ${formatCurrency(totalDiscount.value)}
${invoice.type === 'B2B' || invoice.type === 'B2C' ? `الضريبة (14%): ${formatCurrency(taxAmount.value)}\n` : ''}الإجمالي النهائي: ${formatCurrency(totalAmount.value)}

ملاحظات: ${invoice.notes || 'لا توجد ملاحظات'}
      `;
      
      alert(details);
    };
    
    const printInvoice = (invoice) => {
      const printWindow = window.open('', '_blank');
      
      // Calculate totals for the specific invoice
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
              <div><strong>الاسم:</strong> شركة المخازن المتحدة</div>
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
    
    const deleteInvoice = async (invoiceId) => {
      if (!confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) return;
      
      try {
        loading.value = true;
        
        // First, restore inventory quantities
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
        
        // Delete the invoice
        const invoiceRef = doc(db, 'invoices', invoiceId);
        await deleteDoc(invoiceRef);
        
        // Refresh invoices list
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
        
        // Validate required fields for B2B invoices
        if (invoiceForm.value.type === 'B2B' && (!invoiceForm.value.customer.taxId || invoiceForm.value.customer.taxId.length < 9)) {
          store.dispatch('showNotification', {
            type: 'error',
            message: 'يرجى إدخال رقم ضريبي صالح (9 أرقام على الأقل)'
          });
          saving.value = false;
          return;
        }
        
        // Validate phone number
        const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
        if (!phoneRegex.test(invoiceForm.value.customer.phone)) {
          store.dispatch('showNotification', {
            type: 'error',
            message: 'يرجى إدخال رقم هاتف صحيح (مثال: 01012345678)'
          });
          saving.value = false;
          return;
        }
        
        // Calculate totals
        const subtotal = invoiceForm.value.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        const discount = invoiceForm.value.items.reduce((sum, item) => sum + ((item.unitPrice * item.quantity) * (item.discount / 100)), 0);
        const tax = (invoiceForm.value.type === 'B2B' || invoiceForm.value.type === 'B2C') ? (subtotal - discount) * 0.14 : 0;
        const total = subtotal - discount + tax;
        
        // Prepare invoice data
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
          // Update existing invoice
          const invoiceRef = doc(db, 'invoices', editingInvoice.value.id);
          await updateDoc(invoiceRef, invoiceData);
          invoiceId = editingInvoice.value.id;
          
          store.dispatch('showNotification', {
            type: 'success',
            message: 'تم تحديث الفاتورة بنجاح'
          });
        } else {
          // Generate invoice number
          const lastInvoice = invoices.value[0];
          const lastNumber = lastInvoice ? lastInvoice.invoiceNumber : 0;
          const invoiceNumber = lastNumber + 1;
          
          // Create new invoice
          invoiceData.invoiceNumber = invoiceNumber;
          const docRef = await addDoc(collection(db, 'invoices'), invoiceData);
          invoiceId = docRef.id;
          
          store.dispatch('showNotification', {
            type: 'success',
            message: `تم إنشاء الفاتورة #${invoiceNumber} بنجاح`
          });
        }
        
        // Update inventory quantities
        const batch = writeBatch(db);
        
        for (const item of invoiceForm.value.items) {
          if (item.id) {
            const itemRef = doc(db, 'items', item.id);
            batch.update(itemRef, {
              remaining_quantity: increment(-(item.quantity || 0))
            });
          }
        }
        
        await batch.commit();
        
        // Reset form and reload invoices
        cancelInvoiceForm();
        await loadInvoices();
        
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
      // The print will be handled by the notification or user action
    };
    
    const exportInvoicesToExcel = async () => {
      try {
        loading.value = true;
        
        const exportData = filteredInvoices.value.map(invoice => ({
          'رقم الفاتورة': invoice.invoiceNumber,
          'التاريخ': formatDate(invoice.date),
          'نوع الفاتورة': getInvoiceTypeLabel(invoice.type),
          'حالة الفاتورة': getInvoiceStatusLabel(invoice.status),
          'اسم العميل': invoice.customer.name,
          'هاتف العميل': invoice.customer.phone,
          'الرقم الضريبي': invoice.customer.taxId || '',
          'عدد الأصناف': invoice.items?.length || 0,
          'المجموع': formatCurrency(invoice.subtotal || 0),
          'الخصم': formatCurrency(invoice.discount || 0),
          'الضريبة': formatCurrency(invoice.taxAmount || 0),
          'الإجمالي': formatCurrency(invoice.totalAmount || 0),
          'طريقة الدفع': invoice.paymentMethod === 'cash' ? 'نقدي' : 
                         invoice.paymentMethod === 'bank' ? 'بنكي' : 
                         invoice.paymentMethod === 'check' ? 'شيك' : 'آجل',
          'ملاحظات': invoice.notes || ''
        }));
        
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
    // SECTION 9: DATA LOADING FUNCTIONS
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

          // Show notification for new dispatches
          if (transactions.length > 0 && dispatchTransactions.value.length > 0) {
            const latestTransaction = transactions[0];
            const isNew = !dispatchTransactions.value.find(t => t.id === latestTransaction.id);
            
            if (isNew && !showDispatchModal.value) {
              store.dispatch('showNotification', {
                type: 'info',
                message: `صرف جديد: ${latestTransaction.item_name} - ${Math.abs(latestTransaction.total_delta)} وحدة`,
                duration: 5000
              });
            }
          }
        });

        realtimeUnsubscribe.value = unsubscribe;
      } catch (error) {
        console.error('Error setting up real-time dispatch updates:', error);
      }
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
        
        if (store.state.transactions.length === 0) {
          await store.dispatch('fetchTransactions');
        }
        
        if (dispatchFromWarehouses.value.length === 1) {
          selectedWarehouse.value = dispatchFromWarehouses.value[0].id;
        }
        
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
    // SECTION 10: LIFECYCLE HOOKS
    // ============================================
    onMounted(() => {
      console.log('Dispatch page with invoices mounted');
      loadInitialData();
    });
    
    onUnmounted(() => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }
      if (realtimeUnsubscribe.value) {
        realtimeUnsubscribe.value();
      }
    });
    
    watch(() => [allInventory.value, allTransactions.value], () => {
      // Data updates are handled by real-time listener
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
      dispatchFromWarehouses,
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
      
      // Invoice system state
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
      availableItemsForInvoice,
      availableWarehouses,
      
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
      calculateDispatchValue,
      getDispatchQuantityClass,
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
      
      // Invoice system actions
      toggleInvoiceSystem,
      createNewInvoice,
      editInvoice,
      cancelInvoiceForm,
      onInvoiceTypeChange,
      loadWarehouseItems,
      searchItems,
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
      deleteInvoice,
      saveInvoice,
      saveAndPrint,
      exportInvoicesToExcel
    };
  }
};
</script>

<style scoped>
/* Custom styles for the integrated system */
.stat-card {
  @apply bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex items-center space-x-4 space-x-reverse;
}

.stat-icon {
  @apply h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0;
}

.btn-primary {
  @apply inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-success {
  @apply inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed;
}

.input-field {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors;
}

.action-btn {
  @apply p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors;
}

.pagination-btn {
  @apply px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .stat-card {
    @apply p-3;
  }
  
  .stat-icon {
    @apply h-10 w-10;
  }
}

/* Ensure RTL direction for invoice system */
[dir="rtl"] .input-field,
[dir="rtl"] .btn-primary,
[dir="rtl"] .btn-secondary,
[dir="rtl"] .btn-success {
  text-align: right;
}

/* Smooth transitions for all interactive elements */
.transition-all {
  transition-property: all;
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

/* Make sure invoice toggle button is visible */
button[class*="bg-gradient-to-r"] {
  display: inline-flex !important;
  visibility: visible !important;
}
</style>