<template>
  <div class="invoice-form-container bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-4 sm:mb-6 max-w-full mx-auto">
    <!-- Form Header -->
    <div class="sticky top-0 bg-white dark:bg-gray-800 z-10 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="min-w-0 flex-1">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
            {{ editingInvoice ? 'تعديل فاتورة #' + editingInvoice.invoiceNumber : 'إنشاء فاتورة جديدة' }}
          </h3>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">املأ بيانات الفاتورة وإضافة الأصناف</p>
        </div>
        <button @click="$emit('cancel')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 flex-shrink-0 ml-2">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Main Form Content -->
    <div class="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)]">
      <!-- Step 1: Invoice Type and Customer -->
      <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sm:p-6">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
          <span class="h-6 w-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-xs ml-2">1</span>
          معلومات الفاتورة والعميل
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Invoice Type -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نوع الفاتورة *</label>
            <select v-model="invoiceForm.type" @change="onInvoiceTypeChange" class="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="B2B">فاتورة ضريبية (B2B) - نشاط تجاري</option>
              <option value="B2C">فاتورة ضريبية (B2C) - مستهلك نهائي</option>
              <option value="simplified">فاتورة مبسطة</option>
            </select>
          </div>

          <!-- Payment Method -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">طريقة الدفع *</label>
            <select v-model="invoiceForm.paymentMethod" class="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="cash">نقدي</option>
              <option value="bank">تحويل بنكي</option>
              <option value="check">شيك</option>
              <option value="credit">آجل</option>
            </select>
          </div>

          <!-- Customer Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اسم العميل *</label>
            <input v-model="invoiceForm.customer.name" type="text" class="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="اسم العميل الكامل" required />
          </div>

          <!-- Customer Phone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رقم الهاتف *</label>
            <input v-model="invoiceForm.customer.phone" type="tel" class="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="01XXXXXXXXX" required />
          </div>

          <!-- Tax ID (for B2B) -->
          <div v-if="invoiceForm.type === 'B2B'" class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الرقم الضريبي *</label>
            <input v-model="invoiceForm.customer.taxId" type="text" class="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="الرقم الضريبي (14 رقم)" pattern="[0-9]{14}" required />
          </div>

          <!-- Customer Address -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">العنوان</label>
            <input v-model="invoiceForm.customer.address" type="text" class="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="عنوان العميل" />
          </div>

          <!-- Notes -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ملاحظات</label>
            <textarea v-model="invoiceForm.notes" rows="2" class="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="ملاحظات إضافية..."></textarea>
          </div>
        </div>
      </div>

      <!-- Step 2: Warehouse Selection -->
      <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sm:p-6">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
          <span class="h-6 w-6 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center text-xs ml-2">2</span>
          اختر المخزن
        </h4>
        <div class="max-w-md">
          <select
            v-model="selectedWarehouseForInvoice"
            @change="loadWarehouseItems"
            class="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            :disabled="warehouses.length === 0"
          >
            <option value="">اختر مخزن</option>
            <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
              {{ warehouse.name_ar }}
            </option>
          </select>
          <p v-if="selectedWarehouseForInvoice" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span class="font-medium">المخزن المحدد:</span> {{ getWarehouseLabel(selectedWarehouseForInvoice) }}
          </p>
        </div>
      </div>

      <!-- Step 3: Add Items -->
      <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sm:p-6">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
          <span class="h-6 w-6 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 rounded-full flex items-center justify-center text-xs ml-2">3</span>
          إضافة الأصناف
        </h4>

        <!-- Search Input -->
        <div class="relative mb-4 max-w-md">
          <input
            v-model="itemSearch"
            @input="debouncedSearchItems"
            type="text"
            class="w-full px-3 py-2.5 pr-9 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="ابحث عن صنف..."
            :disabled="!selectedWarehouseForInvoice"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div v-if="searchingItems" class="absolute inset-y-0 left-0 pl-3 flex items-center">
            <div class="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        </div>

        <!-- Search Results Grid -->
        <div v-if="filteredSearchResults.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          <div
            v-for="item in filteredSearchResults"
            :key="item.id"
            @click="addItemToInvoice(item)"
            class="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm cursor-pointer transition-all"
          >
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ item.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ item.code }}</p>
              </div>
              <span :class="['text-xs px-2 py-1 rounded-full', getQuantityClass(item.remaining_quantity)]">
                {{ formatNumber(item.remaining_quantity) }}
              </span>
            </div>
            <div class="mt-2 text-xs text-gray-600 dark:text-gray-300">
              <span class="block">السعر: {{ formatCurrency(item.sale_price || 0) }}</span>
              <span v-if="item.color" class="block">اللون: {{ item.color }}</span>
              <span v-if="item.supplier" class="block">المورد: {{ item.supplier }}</span>
            </div>
          </div>
        </div>
        <p v-else-if="itemSearch && !searchingItems" class="text-sm text-gray-500 dark:text-gray-400 mt-2">لا توجد نتائج</p>
      </div>

      <!-- Step 4: Selected Items -->
      <div v-if="invoiceForm.items.length > 0" class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sm:p-6">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
          <span class="h-6 w-6 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full flex items-center justify-center text-xs ml-2">4</span>
          الأصناف المحددة ({{ invoiceForm.items.length }})
        </h4>

        <div class="space-y-4">
          <div
            v-for="(item, index) in invoiceForm.items"
            :key="item.id"
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div class="flex justify-between items-start mb-3">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ item.name }} ({{ item.code }})</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">المخزن: {{ getWarehouseLabel(item.warehouseId) }}</p>
              </div>
              <button @click="removeItem(index)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <!-- Carton controls if needed -->
            <div v-if="item.per_carton_count > 1" class="flex items-center space-x-2 space-x-reverse mb-3">
              <span class="text-xs text-gray-500 dark:text-gray-400">الكرتون:</span>
              <button @click="decreaseCarton(index)" class="w-6 h-6 border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs" :disabled="item.cartons_count <= 0">-</button>
              <span class="text-xs">{{ item.cartons_count }}</span>
              <button @click="increaseCarton(index)" class="w-6 h-6 border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs" :disabled="(item.cartons_count + 1) * item.per_carton_count + item.single_bottles_count > item.maxQuantity">+</button>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <!-- Price -->
              <div>
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">السعر</label>
                <input v-model.number="item.unitPrice" type="number" min="0" step="0.01" @change="updateItemTotal(index)" class="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>
              <!-- Quantity -->
              <div>
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">الكمية</label>
                <div class="flex items-center space-x-1 space-x-reverse">
                  <button @click="decreaseQuantity(index)" class="w-7 h-7 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm" :disabled="item.quantity <= 1">-</button>
                  <input v-model.number="item.quantity" type="number" min="1" :max="item.maxQuantity" @change="validateItemQuantity(index)" class="w-16 px-1 py-1.5 border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm text-center" />
                  <button @click="increaseQuantity(index)" class="w-7 h-7 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm" :disabled="item.quantity >= item.maxQuantity">+</button>
                  <button @click="setMaxQuantityForItem(index)" class="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-700">الحد الأقصى</button>
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">متوفر: {{ formatNumber(item.maxQuantity) }}</div>
              </div>
              <!-- Discount -->
              <div>
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">الخصم %</label>
                <input v-model.number="item.discount" type="number" min="0" max="100" step="0.1" @change="updateItemTotal(index)" class="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>
              <!-- Total -->
              <div>
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">الإجمالي</label>
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(item.total || 0) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Items Total -->
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm font-medium">
          <span class="text-gray-600 dark:text-gray-400">إجمالي الأصناف:</span>
          <span class="text-gray-900 dark:text-white">{{ formatCurrency(subtotal) }}</span>
        </div>
      </div>

      <!-- Step 5: Summary -->
      <div v-if="invoiceForm.items.length > 0" class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sm:p-6">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
          <span class="h-6 w-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center text-xs ml-2">5</span>
          ملخص الفاتورة
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-2">تفاصيل الفاتورة</h5>
            <dl class="space-y-2 text-sm">
              <div class="flex justify-between">
                <dt class="text-gray-500 dark:text-gray-400">عدد الأصناف:</dt>
                <dd class="font-medium text-gray-900 dark:text-white">{{ invoiceForm.items.length }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-500 dark:text-gray-400">إجمالي الكميات:</dt>
                <dd class="font-medium text-gray-900 dark:text-white">{{ totalQuantity }}</dd>
              </div>
              <div v-if="hasCartonItems" class="flex justify-between">
                <dt class="text-gray-500 dark:text-gray-400">إجمالي الكراتين:</dt>
                <dd class="font-medium text-gray-900 dark:text-white">{{ totalCartons }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-500 dark:text-gray-400">المخزن:</dt>
                <dd class="font-medium text-gray-900 dark:text-white truncate">{{ getWarehouseLabel(selectedWarehouseForInvoice) }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-500 dark:text-gray-400">طريقة الدفع:</dt>
                <dd class="font-medium text-gray-900 dark:text-white">{{ getPaymentMethodLabel(invoiceForm.paymentMethod) }}</dd>
              </div>
            </dl>
          </div>
          <div>
            <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-2">الحسابات</h5>
            <dl class="space-y-2 text-sm">
              <div class="flex justify-between">
                <dt class="text-gray-500 dark:text-gray-400">المجموع:</dt>
                <dd class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(subtotal) }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-500 dark:text-gray-400">الخصم:</dt>
                <dd class="font-medium text-red-600 dark:text-red-400">-{{ formatCurrency(totalDiscount) }}</dd>
              </div>
              <div v-if="invoiceForm.type === 'B2B' || invoiceForm.type === 'B2C'" class="flex justify-between">
                <dt class="text-gray-500 dark:text-gray-400">الضريبة (14%):</dt>
                <dd class="font-medium text-gray-900 dark:text-white">+{{ formatCurrency(taxAmount) }}</dd>
              </div>
              <div class="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <dt class="text-base font-bold text-gray-900 dark:text-white">الإجمالي النهائي:</dt>
                <dd class="text-lg font-bold text-green-600 dark:text-green-400">{{ formatCurrency(totalAmount) }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Buttons -->
    <div class="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 z-20">
      <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
        <button type="button" @click="$emit('cancel')" :disabled="saving" class="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 order-2 sm:order-1">
          إلغاء
        </button>
        <button type="button" @click="handleSaveAndPrint" :disabled="!canSave || saving" class="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 flex items-center justify-center gap-2">
          <svg v-if="saving" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span>{{ saving ? 'جاري الحفظ...' : 'حفظ وطباعة' }}</span>
        </button>
        <button type="button" @click="handleSave" :disabled="!canSave || saving" class="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed order-3 flex items-center justify-center gap-2">
          <svg v-if="saving" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span>{{ saving ? 'جاري الحفظ...' : 'حفظ الفاتورة' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useInvoiceForm } from '@/composables/useInvoiceForm';
import { getPaymentMethodLabel } from '@/utils/helpers';

const props = defineProps({
  editingInvoice: { type: Object, default: null },
  warehouses: { type: Array, required: true }
});

const emit = defineEmits(['cancel', 'saved']);

const {
  invoiceForm,
  saving,
  itemSearch,
  searchingItems,
  searchResults,
  lastSearchSource,
  searchAllWarehouses,
  selectedWarehouseForInvoice,
  subtotal,
  totalDiscount,
  taxAmount,
  totalAmount,
  totalQuantity,
  hasCartonItems,
  totalCartons,
  totalSingles,
  canSave,
  addItemToInvoice,
  removeItem,
  increaseCarton,
  decreaseCarton,
  increaseQuantity,
  decreaseQuantity,
  setMaxQuantityForItem,
  validateItemQuantity,
  updateItemTotal,
  debouncedSearchItems,
  loadWarehouseItems,
  onInvoiceTypeChange,
  editInvoice,
  formatNumber,
  formatCurrency,
  getQuantityClass,
  getSearchSourceLabel,
  saveInvoice,
  saveAndPrint
} = useInvoiceForm();

// Populate form when editingInvoice changes
watch(() => props.editingInvoice, (val) => {
  if (val) editInvoice(val);
}, { immediate: true });

const handleSave = async () => {
  const result = await saveInvoice();
  if (result?.success) emit('saved', result);
};

const handleSaveAndPrint = async () => {
  const result = await saveAndPrint();
  if (result?.success) emit('saved', result);
};

// Filtered search results
const filteredSearchResults = computed(() => {
  if (!searchResults.value.length) return [];
  if (!selectedWarehouseForInvoice.value || searchAllWarehouses.value) {
    return searchResults.value;
  }
  return searchResults.value.filter(item => item.warehouse_id === selectedWarehouseForInvoice.value);
});

const getWarehouseLabel = (warehouseId) => {
  const warehouse = props.warehouses.find(w => w.id === warehouseId);
  return warehouse ? warehouse.name_ar : warehouseId;
};
</script>


<style scoped>
/* Fixed layout styles */

/* Main container padding for mobile save button */
.min-h-screen {
  padding-bottom: 64px; /* Space for mobile save button */
}

@media (min-width: 640px) {
  .min-h-screen {
    padding-bottom: 0;
  }
}

/* Invoice Form Grid - Fixed width constraints */
.invoice-form-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto;
}

.form-field-container {
  @apply w-full;
}

.form-field-full {
  @apply lg:col-span-2 w-full;
}

/* Dispatch items grid - Fixed layout */
.available-items-grid-fixed {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
}

@media (max-width: 640px) {
  .available-items-grid-fixed {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .available-items-grid-fixed {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .available-items-grid-fixed {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1025px) {
  .available-items-grid-fixed {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Quantity label - Always RED for dispatch */
.quantity-red {
  @apply bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300;
}

.quantity-label {
  @apply inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300;
}

/* Search input constraints */
.search-input-constrained {
  @apply max-w-4xl mx-auto;
}

/* Mobile save button fix */
@media (max-width: 640px) {
  .mobile-save-button-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 40;
    background: white;
    padding: 12px;
    border-top: 1px solid #e5e7eb;
  }
}

/* Search result card - FIXED: removed invalid active:scale-98 */
.search-result-card {
  @apply p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm active:scale-95;
}

/* Ensure buttons are visible on mobile */
button, 
.btn-primary,
.btn-secondary,
.btn-success,
.input-field,
select,
.pagination-btn,
.search-input {
  min-height: 44px;
  min-width: 44px;
}

/* Z-index fixes for mobile */
.z-20 {
  z-index: 20;
}

.z-30 {
  z-index: 30;
}

.z-40 {
  z-index: 40;
}

.z-50 {
  z-index: 50;
}

/* Custom max-width constraints */
.max-w-constrained {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

/* Grid layout improvements */
.grid-improved {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

@media (max-width: 640px) {
  .grid-improved {
    grid-template-columns: 1fr;
  }
}

/* Dispatch table improvements */
.dispatch-table-row {
  @apply grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150;
}

.dispatch-table-header {
  @apply sticky top-0 z-10 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700;
}

/* Search results improvements */
.search-results-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3;
}

/* Search empty state */
.search-empty-state {
  @apply text-center py-8 sm:py-12 border border-gray-200 dark:border-gray-700 rounded-lg;
}

/* Warehouse select container */
.warehouse-select-container {
  @apply max-w-4xl mx-auto;
}

/* Invoice summary card */
.invoice-summary-card {
  @apply bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 sm:p-6;
}

/* Search stats container */
.search-stats-container {
  @apply flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3;
}

.search-source-badge {
  @apply px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded text-xs;
}

/* Search tips container */
.search-tips-container {
  @apply bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 mt-3;
}

.search-tips-title {
  @apply text-xs font-medium text-gray-700 dark:text-gray-300 mb-2;
}

.search-tips-list {
  @apply space-y-1 text-xs text-gray-600 dark:text-gray-400;
}

.search-tip-item {
  @apply list-disc list-inside;
}

.search-tip-highlight {
  @apply text-blue-600 dark:text-blue-400 font-medium;
}

/* Selected items container */
.selected-items-container {
  @apply border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden max-w-full mx-auto;
}

/* Selected item card */
.selected-item-card {
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-3;
}

/* Pagination container */
.pagination-container {
  @apply px-3 sm:px-4 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700;
}

/* Action buttons */
.action-btn {
  @apply p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors;
}

/* Stat card */
.stat-card {
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4;
}

.stat-icon {
  @apply h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center flex-shrink-0;
}

/* Form fields */
.input-field {
  @apply px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

/* Buttons */
.btn-primary {
  @apply inline-flex items-center px-3 sm:px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px];
}

.btn-secondary {
  @apply inline-flex items-center px-3 sm:px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px];
}

.btn-success {
  @apply inline-flex items-center px-3 sm:px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px];
}

/* Search input */
.search-input {
  @apply w-full px-3 sm:px-4 py-2.5 pr-9 sm:pr-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

/* Pagination button */
.pagination-btn {
  @apply px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[34px] sm:min-h-[36px] min-w-[70px] sm:min-w-[80px];
}

/* Filters container */
.filters-container {
  @apply flex flex-wrap gap-2;
}

/* Dispatch table container */
.dispatch-table-container {
  @apply bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6 sm:mb-8;
}

/* Invoice form container */
.invoice-form-container {
  @apply bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-4 sm:mb-6 max-w-full mx-auto;
}

/* Input width constraints */
.input-constrained {
  max-width: 100%;
}

@media (min-width: 768px) {
  .input-constrained {
    max-width: 400px;
  }
}

/* Card hover effects */
.card-hover {
  @apply transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5;
}

/* Loading states */
.loading-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
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
}

/* RTL specific adjustments */
[dir="rtl"] .space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
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

/* Animation utilities */
.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

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

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive typography */
.responsive-text {
  font-size: clamp(0.875rem, 2vw, 1rem);
}

.responsive-heading {
  font-size: clamp(1.25rem, 3vw, 1.5rem);
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  button,
  .search-result-card,
  .available-item-card {
    min-height: 48px;
  }
  
  input,
  select,
  textarea {
    font-size: 16px; /* Prevents iOS zoom on focus */
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .search-input,
  .input-field {
    border: 2px solid currentColor;
  }
  
  button {
    border: 2px solid currentColor;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Dark mode improvements */
@media (prefers-color-scheme: dark) {
  .search-input {
    background-color: #374151;
    border-color: #4b5563;
    color: #f3f4f6;
  }
  
  .search-input::placeholder {
    color: #9ca3af;
  }
}

/* Custom utilities for layout */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid-center {
  display: grid;
  place-items: center;
}

.truncate-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.truncate-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom shadows for elevation */
.shadow-elevation-1 {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.shadow-elevation-2 {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.shadow-elevation-3 {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* Gradient backgrounds */
.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-gradient-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.bg-gradient-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.bg-gradient-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

/* Status indicators */
.status-indicator {
  @apply inline-block h-2 w-2 rounded-full mr-2;
}

.status-active {
  @apply bg-green-500;
}

.status-inactive {
  @apply bg-gray-400;
}

.status-pending {
  @apply bg-yellow-500;
}

.status-error {
  @apply bg-red-500;
}

/* Badge variants */
.badge {
  @apply inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium;
}

.badge-primary {
  @apply bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300;
}

.badge-success {
  @apply bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300;
}

.badge-warning {
  @apply bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300;
}

.badge-danger {
  @apply bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300;
}

.badge-info {
  @apply bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300;
}

/* Loading skeleton */
.skeleton {
  @apply animate-pulse bg-gray-200 dark:bg-gray-700 rounded;
}

.skeleton-text {
  @apply h-4 bg-gray-200 dark:bg-gray-700 rounded;
}

.skeleton-card {
  @apply animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32;
}

/* Focus styles for accessibility */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900;
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

/* Custom borders */
.border-subtle {
  @apply border-gray-200 dark:border-gray-700;
}

.border-emphasis {
  @apply border-gray-300 dark:border-gray-600;
}

/* Custom opacity */
.opacity-hover:hover {
  opacity: 0.9;
}

.opacity-disabled {
  opacity: 0.5;
}

/* Custom cursor */
.cursor-grab {
  cursor: grab;
}

.cursor-grabbing {
  cursor: grabbing;
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

/* Custom width utilities */
.w-responsive {
  @apply w-full sm:w-auto;
}

/* Custom height utilities */
.h-responsive {
  @apply h-auto sm:h-64 lg:h-96;
}

/* Custom min-height utilities */
.min-h-responsive {
  @apply min-h-[150px] sm:min-h-[200px] lg:min-h-[300px];
}

/* Custom gap utilities */
.gap-responsive {
  @apply gap-2 sm:gap-3 lg:gap-4;
}

/* Custom margin utilities */
.margin-responsive {
  @apply my-3 sm:my-4 lg:my-6;
}

/* Custom padding utilities */
.padding-responsive {
  @apply p-3 sm:p-4 lg:p-6;
}

/* Custom text utilities */
.text-responsive {
  @apply text-xs sm:text-sm lg:text-base;
}

.text-responsive-heading {
  @apply text-lg sm:text-xl lg:text-2xl;
}

/* Custom grid utilities */
.grid-responsive {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4;
}

/* Custom flex utilities */
.flex-responsive {
  @apply flex flex-col sm:flex-row;
}

/* Custom container utilities */
.container-constrained {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

/* Custom position utilities */
.sticky-header {
  @apply sticky top-0 z-40;
}

.sticky-footer {
  @apply sticky bottom-0 z-40;
}

/* Custom overflow utilities */
.overflow-touch {
  -webkit-overflow-scrolling: touch;
}

/* Custom transform utilities */
.transform-gpu {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

/* Custom filter utilities */
.filter-blur {
  backdrop-filter: blur(8px);
}

/* Custom background utilities */
.bg-blur {
  @apply bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm;
}

/* Custom shadow utilities */
.shadow-inset {
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}

/* Custom border radius utilities */
.rounded-inherit {
  border-radius: inherit;
}

/* Custom z-index utilities */
.z-dropdown {
  z-index: 1000;
}

.z-modal {
  z-index: 2000;
}

.z-tooltip {
  z-index: 3000;
}

/* Custom visibility utilities */
.visibility-hidden {
  visibility: hidden;
}

.visibility-visible {
  visibility: visible;
}

/* Custom pointer events utilities */
.pointer-events-none {
  pointer-events: none;
}

.pointer-events-auto {
  pointer-events: auto;
}

/* Custom user select utilities */
.user-select-none {
  user-select: none;
}

.user-select-text {
  user-select: text;
}

/* Custom resize utilities */
.resize-none {
  resize: none;
}

.resize-vertical {
  resize: vertical;
}

.resize-horizontal {
  resize: horizontal;
}

/* Custom whitespace utilities */
.whitespace-normal {
  white-space: normal;
}

.whitespace-nowrap {
  white-space: nowrap;
}

.whitespace-pre {
  white-space: pre;
}

.whitespace-pre-line {
  white-space: pre-line;
}

.whitespace-pre-wrap {
  white-space: pre-wrap;
}

/* Custom word break utilities */
.break-normal {
  overflow-wrap: normal;
  word-break: normal;
}

.break-words {
  overflow-wrap: break-word;
}

.break-all {
  word-break: break-all;
}

/* Custom content utilities */
.content-empty:empty::before {
  content: '—';
  color: #9ca3af;
}

/* Custom list utilities */
.list-inside {
  list-style-position: inside;
}

.list-outside {
  list-style-position: outside;
}

/* Custom table utilities */
.table-auto {
  table-layout: auto;
}

.table-fixed {
  table-layout: fixed;
}

/* Custom caption utilities */
.caption-top {
  caption-side: top;
}

.caption-bottom {
  caption-side: bottom;
}

/* Custom border collapse utilities */
.border-collapse {
  border-collapse: collapse;
}

.border-separate {
  border-collapse: separate;
}

/* Custom border spacing utilities */
.border-spacing-0 {
  border-spacing: 0;
}

.border-spacing-2 {
  border-spacing: 0.5rem;
}

/* Custom mix blend mode utilities */
.mix-blend-normal {
  mix-blend-mode: normal;
}

.mix-blend-multiply {
  mix-blend-mode: multiply;
}

.mix-blend-screen {
  mix-blend-mode: screen;
}

.mix-blend-overlay {
  mix-blend-mode: overlay;
}

.mix-blend-darken {
  mix-blend-mode: darken;
}

.mix-blend-lighten {
  mix-blend-mode: lighten;
}

.mix-blend-color-dodge {
  mix-blend-mode: color-dodge;
}

.mix-blend-color-burn {
  mix-blend-mode: color-burn;
}

.mix-blend-hard-light {
  mix-blend-mode: hard-light;
}

.mix-blend-soft-light {
  mix-blend-mode: soft-light;
}

.mix-blend-difference {
  mix-blend-mode: difference;
}

.mix-blend-exclusion {
  mix-blend-mode: exclusion;
}

.mix-blend-hue {
  mix-blend-mode: hue;
}

.mix-blend-saturation {
  mix-blend-mode: saturation;
}

.mix-blend-color {
  mix-blend-mode: color;
}

.mix-blend-luminosity {
  mix-blend-mode: luminosity;
}

/* Custom background blend mode utilities */
.bg-blend-normal {
  background-blend-mode: normal;
}

.bg-blend-multiply {
  background-blend-mode: multiply;
}

.bg-blend-screen {
  background-blend-mode: screen;
}

.bg-blend-overlay {
  background-blend-mode: overlay;
}

.bg-blend-darken {
  background-blend-mode: darken;
}

.bg-blend-lighten {
  background-blend-mode: lighten;
}

.bg-blend-color-dodge {
  background-blend-mode: color-dodge;
}

.bg-blend-color-burn {
  background-blend-mode: color-burn;
}

.bg-blend-hard-light {
  background-blend-mode: hard-light;
}

.bg-blend-soft-light {
  background-blend-mode: soft-light;
}

.bg-blend-difference {
  background-blend-mode: difference;
}

.bg-blend-exclusion {
  background-blend-mode: exclusion;
}

.bg-blend-hue {
  background-blend-mode: hue;
}

.bg-blend-saturation {
  background-blend-mode: saturation;
}

.bg-blend-color {
  background-blend-mode: color;
}

.bg-blend-luminosity {
  background-blend-mode: luminosity;
}
</style>