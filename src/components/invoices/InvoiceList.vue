<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
    <!-- DEBUG BAR – remove after testing -->
    <div class="p-2 bg-yellow-100 dark:bg-yellow-900 text-xs font-mono">
      📊 InvoiceList received {{ filteredInvoices.length }} invoices
      <span v-if="filteredInvoices.length > 0"> – first #{{ filteredInvoices[0]?.invoiceNumber }}</span>
    </div>

    <!-- Header with filters -->
    <div class="p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">الفواتير المسجلة</h3>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">إجمالي {{ filteredInvoices.length }} فاتورة</p>
        </div>

        <!-- Filters -->
        <div class="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
          <div class="relative flex-1 min-w-0">
            <input
              v-model="localSearchTerm"
              @input="onSearchChange"
              type="text"
              class="w-full px-3 py-2.5 pr-9 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="بحث..."
            />
            <svg class="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select v-model="localStatusFilter" @change="onFilterChange" class="input-field text-sm py-2.5">
            <option value="">جميع الحالات</option>
            <option value="draft">مسودة</option>
            <option value="issued">صادرة</option>
            <option value="paid">مدفوعة</option>
            <option value="cancelled">ملغية</option>
          </select>

          <select v-model="localTypeFilter" @change="onFilterChange" class="input-field text-sm py-2.5">
            <option value="">جميع الأنواع</option>
            <option value="B2B">B2B</option>
            <option value="B2C">B2C</option>
            <option value="simplified">مبسطة</option>
          </select>
        </div>
      </div>
    </div>

    <!-- ===== FIXED: Table hidden on mobile, visible on sm and up ===== -->
    <div class="hidden sm:block overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div class="overflow-y-auto" style="max-height: 400px;">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
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
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              <tr v-for="invoice in filteredInvoices" :key="invoice.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
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
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ getPaymentMethodLabel(invoice.paymentMethod) }}</div>
                </td>
                <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs rounded-full" :class="getInvoiceStatusClass(invoice.status)">
                    {{ getInvoiceStatusLabel(invoice.status) }}
                  </span>
                </td>
                <td class="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-1 space-x-reverse">
                    <button @click="$emit('view', invoice)" class="action-btn text-blue-600 dark:text-blue-400" title="عرض التفاصيل">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button @click="$emit('print', invoice)" class="action-btn text-green-600 dark:text-green-400" title="طباعة الفاتورة">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                    </button>
                    <button @click="$emit('export-pdf', invoice)" class="action-btn text-purple-600 dark:text-purple-400" title="تصدير PDF">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                    <button @click="$emit('edit', invoice)" v-if="invoice.status === 'draft'" class="action-btn text-yellow-600 dark:text-yellow-400" title="تعديل الفاتورة">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="$emit('delete', invoice.id)" v-if="invoice.status === 'draft'" class="action-btn text-red-600 dark:text-red-400" title="حذف الفاتورة">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Mobile Cards (scrollable) – unchanged, already hidden on sm+ -->
    <div class="sm:hidden p-3 max-h-96 overflow-y-auto">
      <div class="space-y-3">
        <div
          v-for="invoice in filteredInvoices"
          :key="invoice.id"
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-150"
        >
          <!-- Mobile card content (same as before) -->
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

          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">العميل</div>
              <div class="font-medium text-gray-900 dark:text-white truncate">{{ invoice.customer.name }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ invoice.customer.phone }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">المبلغ</div>
              <div class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(invoice.totalAmount) }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ getPaymentMethodLabel(invoice.paymentMethod) }}</div>
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

          <div class="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2 space-x-reverse">
              <button @click="$emit('view', invoice)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-xs sm:text-sm flex items-center p-1">
                <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                عرض
              </button>
              <button @click="$emit('print', invoice)" class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-xs sm:text-sm flex items-center p-1">
                <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                طباعة
              </button>
            </div>
            <div class="flex items-center space-x-1 space-x-reverse">
              <button @click="$emit('export-pdf', invoice)" class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 p-1" title="تصدير PDF">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
              <button @click="$emit('edit', invoice)" v-if="invoice.status === 'draft'" class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 p-1" title="تعديل">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button @click="$emit('delete', invoice.id)" v-if="invoice.status === 'draft'" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1" title="حذف">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredInvoices.length === 0" class="text-center py-8 sm:py-12">
      <svg class="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-sm sm:text-base font-medium text-gray-900 dark:text-white">لا توجد فواتير</h3>
      <p class="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        {{ localSearchTerm ? 'لم يتم العثور على فواتير مطابقة للبحث' : 'ابدأ بإنشاء فاتورتك الأولى' }}
      </p>
      <div class="mt-4 sm:mt-6">
        <button @click="$emit('create')" class="btn-primary">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          إنشاء فاتورة جديدة
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { formatCurrency, formatDate, formatTime, getPaymentMethodLabel, getInvoiceTypeLabel, getInvoiceTypeClass, getInvoiceStatusLabel, getInvoiceStatusClass } from '@/utils/helpers';

const props = defineProps({
  filteredInvoices: { type: Array, required: true },
  paginatedInvoices: { type: Array, default: () => [] },
  totalPages: { type: Number, default: 0 },
  startIndex: { type: Number, default: 0 },
  endIndex: { type: Number, default: 0 },
  currentPage: { type: Number, default: 1 },
  searchTerm: { type: String, default: '' },
  statusFilter: { type: String, default: '' },
  typeFilter: { type: String, default: '' }
});

const emit = defineEmits([
  'update:searchTerm',
  'update:statusFilter',
  'update:typeFilter',
  'filter',
  'view',
  'print',
  'export-pdf',
  'edit',
  'delete',
  'create'
]);

const localSearchTerm = ref(props.searchTerm);
const localStatusFilter = ref(props.statusFilter);
const localTypeFilter = ref(props.typeFilter);

watch(() => props.searchTerm, (val) => { localSearchTerm.value = val; });
watch(() => props.statusFilter, (val) => { localStatusFilter.value = val; });
watch(() => props.typeFilter, (val) => { localTypeFilter.value = val; });

// Debug watch – remove after confirming data flow
watch(() => props.filteredInvoices, (val) => {
  console.log('🔥 InvoiceList filteredInvoices prop changed – length:', val?.length);
}, { immediate: true, deep: true });

const onSearchChange = () => {
  emit('update:searchTerm', localSearchTerm.value);
  emit('filter');
};
const onFilterChange = () => {
  emit('update:statusFilter', localStatusFilter.value);
  emit('update:typeFilter', localTypeFilter.value);
  emit('filter');
};

const getWarehouseLabel = (warehouseId) => warehouseId || 'غير محدد';
</script>
<style scoped>
/* ===== Fixed layout styles (copied from original DispatchPageWithInvoices.vue) ===== */

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