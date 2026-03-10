<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 pb-16 sm:pb-0">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="w-full px-3 sm:px-4 lg:px-6">
        <div class="flex justify-between items-center h-14 sm:h-16">
          <div class="flex items-center space-x-2 space-x-reverse">
            <router-link to="/" class="flex items-center space-x-2 space-x-reverse hover:opacity-80 transition-opacity">
              <div class="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-xs sm:text-sm">م</span>
              </div>
              <div class="hidden sm:block">
                <h1 class="text-lg font-bold text-gray-900 dark:text-white">نظام الفواتير</h1>
                <p class="text-xs text-gray-500 dark:text-gray-400">إدارة الفواتير الضريبية</p>
              </div>
              <div class="sm:hidden">
                <h1 class="text-sm font-bold text-gray-900 dark:text-white">الفواتير</h1>
              </div>
            </router-link>
          </div>

          <div class="flex items-center space-x-2 space-x-reverse">
            <div class="hidden md:flex items-center space-x-2 space-x-reverse text-sm">
              <span class="text-gray-600 dark:text-gray-300">{{ userName }}</span>
              <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-xs">
                {{ userRole }}
              </span>
            </div>

            <div class="flex items-center space-x-1 sm:space-x-2 space-x-reverse">
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

              <router-link 
                to="/dispatch" 
                class="inline-flex items-center p-2 sm:px-4 sm:py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-medium rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-colors duration-200"
              >
                <svg class="w-4 h-4 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                <span class="hidden sm:inline">صرف المخزون</span>
                <span class="sm:hidden">صرف</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="w-full px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
      <!-- Hidden reactive dependency – forces parent to re‑render when filteredInvoices changes -->
      <span style="display: none;">{{ filteredInvoices?.length || 0 }}</span>

      <!-- Header with title and action buttons -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h2 class="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">نظام الفواتير الضريبية</h2>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">نظام فواتير متوافق مع مصلحة الضرائب المصرية</p>
          </div>

          <div class="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
            <button @click="createNewInvoice" class="btn-primary flex-1 sm:flex-none">
              <svg class="w-4 h-4 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span class="whitespace-nowrap">فاتورة جديدة</span>
            </button>
            <button @click="exportToExcel" :disabled="(filteredInvoices?.length || 0) === 0" class="btn-secondary flex-1 sm:flex-none">
              <svg class="w-4 h-4 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span class="hidden sm:inline">تصدير Excel</span>
              <span class="sm:hidden">Excel</span>
            </button>
            <button @click="exportToPDFBulk" :disabled="(filteredInvoices?.length || 0) === 0" class="btn-success flex-1 sm:flex-none">
              <svg class="w-4 h-4 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span class="hidden sm:inline">تصدير PDF</span>
              <span class="sm:hidden">PDF</span>
            </button>
          </div>
        </div>

        <!-- Stats Cards (using precomputed stats from store) -->
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div class="stat-card">
            <div class="stat-icon bg-blue-100 dark:bg-blue-900">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">إجمالي الفواتير</p>
              <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{{ invoiceStats.totalInvoices }}</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon bg-green-100 dark:bg-green-900">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">إجمالي المبيعات</p>
              <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(invoiceStats.totalSales) }}</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon bg-yellow-100 dark:bg-yellow-900">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">العملاء</p>
              <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{{ invoiceStats.uniqueCustomers }}</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon bg-purple-100 dark:bg-purple-900">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">الضريبة</p>
              <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(invoiceStats.totalTax) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Invoice Form -->
      <InvoiceForm
        v-if="showForm"
        :editing-invoice="editingInvoice"
        :warehouses="warehouses"
        @cancel="cancelForm"
        @saved="handleFormSaved"
      />

      <!-- Invoice List – with forced key that changes when filteredInvoices updates -->
      <InvoiceList
        v-else
        :key="renderKey"
        :filtered-invoices="filteredInvoices || []"
        :paginated-invoices="paginatedInvoices || []"
        :total-pages="totalPages || 0"
        :start-index="startIndex || 0"
        :end-index="endIndex || 0"
        :current-page="currentPage || 1"
        :search-term="invoiceSearchTerm || ''"
        :status-filter="invoiceStatusFilter || ''"
        :type-filter="invoiceTypeFilter || ''"
        @update:searchTerm="val => invoiceSearchTerm = val"
        @update:statusFilter="val => invoiceStatusFilter = val"
        @update:typeFilter="val => invoiceTypeFilter = val"
        @filter="filterInvoices"
        @prev-page="prevPage"
        @next-page="nextPage"
        @view="viewInvoice"
        @print="printInvoice"
        @export-pdf="exportSingleInvoicePDF"
        @edit="editInvoice"
        @delete="deleteInvoice"
        @create="createNewInvoice"
        @export-excel="exportToExcel"
      />

      <!-- Invoice Detail Modal -->
      <InvoiceDetailModal
        v-if="showDetailModal"
        :invoice="selectedInvoice"
        :warehouses="warehouses"
        @close="closeDetailModal"
        @edit="editInvoice"
        @print="printInvoice"
        @export-pdf="exportSingleInvoicePDF"
      />
    </main>

    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 lg:p-8 flex flex-col items-center mx-4 max-w-sm w-full">
        <div class="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-blue-600 mb-3 sm:mb-4"></div>
        <p class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm text-center">جاري تحميل البيانات...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import InvoiceList from '@/components/invoices/InvoiceList.vue';
import InvoiceForm from '@/components/invoices/InvoiceForm.vue';
import InvoiceDetailModal from '@/components/invoices/InvoiceDetailModal.vue';
import { useInvoiceList } from '@/composables/useInvoiceList';
import { useInvoiceForm } from '@/composables/useInvoiceForm';
import html2pdf from 'html2pdf.js';
import { formatCurrency, formatDate } from '@/utils/helpers';

const store = useStore();

// ========== User info ==========
const userName = computed(() => store.getters.userName || '');
const userRole = computed(() => store.getters.userRole || '');

// ========== Warehouses ==========
const warehouses = computed(() => store.state.warehouses || []);

// ========== Precomputed invoice stats from store ==========
const invoiceStats = computed(() => store.state.invoiceStats || {
  totalInvoices: 0,
  totalSales: 0,
  totalTax: 0,
  uniqueCustomers: 0
});

// ========== Invoice List ==========
// ✅ CORRECT DESTRUCTURING – using 'filteredInvoices' directly (not alias)
const {
  loading: listLoading,
  filteredInvoices,        // ← now correctly matches composable export
  paginatedInvoices,
  totalPages,
  startIndex,
  endIndex,
  currentPage,
  invoiceSearchTerm,
  invoiceStatusFilter,
  invoiceTypeFilter,
  filterInvoices,
  nextPage,
  prevPage,
  deleteInvoice: deleteInvoiceAction,
  exportToExcel,
  loadInvoices
} = useInvoiceList();

// ========== Force re‑render when filteredInvoices changes ==========
const renderKey = ref(0);
watch(filteredInvoices, () => {
  renderKey.value += 1;
}, { deep: true, immediate: true });

// ========== Invoice Form ==========
const {
  editingInvoice,
  saving,
  showForm,
  createNewInvoice,
  editInvoice: formEditInvoice,
  cancelInvoiceForm
} = useInvoiceForm();

// ========== Detail Modal ==========
const showDetailModal = ref(false);
const selectedInvoice = ref(null);

// ========== Combined loading ==========
const loading = computed(() => listLoading.value || saving.value);

// ========== Form handlers ==========
const cancelForm = () => {
  cancelInvoiceForm();
};

const handleFormSaved = async (result) => {
  console.log('Form saved with result:', result);
  await loadInvoices(true);
  cancelForm();
  store.dispatch('showNotification', { type: 'success', message: result?.message || 'تم حفظ الفاتورة بنجاح' });
};

// ========== List actions ==========
const editInvoice = (invoice) => {
  formEditInvoice(invoice);
};

const deleteInvoice = async (invoiceId) => {
  await deleteInvoiceAction(invoiceId);
};

const viewInvoice = (invoice) => {
  selectedInvoice.value = invoice;
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedInvoice.value = null;
};

// ========== Generate professional invoice HTML ==========
const generateInvoiceHTML = (invoice) => {
  return `
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>فاتورة #${invoice.invoiceNumber}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background: white;
          color: black;
          margin: 0;
          padding: 20px;
          direction: rtl;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border: 1px solid #ddd;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 15px;
        }
        .header h1 {
          color: #1e3a8a;
          margin: 0;
          font-size: 28px;
        }
        .header h2 {
          color: #2563eb;
          margin: 5px 0 0;
          font-size: 20px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
          background: #f9fafb;
          padding: 15px;
          border-radius: 8px;
        }
        .info-item {
          margin-bottom: 8px;
        }
        .info-label {
          font-weight: bold;
          color: #4b5563;
          font-size: 14px;
        }
        .info-value {
          color: #111827;
          font-size: 16px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th {
          background: #3b82f6;
          color: white;
          padding: 10px;
          text-align: center;
          font-weight: bold;
        }
        td {
          border: 1px solid #d1d5db;
          padding: 8px;
          text-align: center;
          color: #111827;
        }
        .totals {
          margin-top: 20px;
          text-align: left;
        }
        .totals div {
          margin-bottom: 5px;
        }
        .totals .final {
          font-size: 18px;
          font-weight: bold;
          color: #059669;
          border-top: 2px solid #059669;
          padding-top: 10px;
        }
        .notes {
          margin-top: 30px;
          padding: 15px;
          background: #f3f4f6;
          border-radius: 8px;
          color: #374151;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <h1>فاتورة ضريبية</h1>
          <h2>رقم: ${invoice.invoiceNumber}</h2>
        </div>
        
        <div class="info-grid">
          <div>
            <div class="info-item"><span class="info-label">العميل:</span> <span class="info-value">${invoice.customer.name}</span></div>
            <div class="info-item"><span class="info-label">الهاتف:</span> <span class="info-value">${invoice.customer.phone}</span></div>
            ${invoice.customer.taxId ? `<div class="info-item"><span class="info-label">الرقم الضريبي:</span> <span class="info-value">${invoice.customer.taxId}</span></div>` : ''}
          </div>
          <div>
            <div class="info-item"><span class="info-label">التاريخ:</span> <span class="info-value">${formatDate(invoice.date)}</span></div>
            <div class="info-item"><span class="info-label">طريقة الدفع:</span> <span class="info-value">${invoice.paymentMethod === 'cash' ? 'نقدي' : invoice.paymentMethod === 'bank' ? 'تحويل بنكي' : invoice.paymentMethod === 'check' ? 'شيك' : 'آجل'}</span></div>
            <div class="info-item"><span class="info-label">الحالة:</span> <span class="info-value">${invoice.status === 'draft' ? 'مسودة' : invoice.status === 'issued' ? 'صادرة' : invoice.status === 'paid' ? 'مدفوعة' : 'ملغية'}</span></div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>الصنف</th>
              <th>الكود</th>
              <th>السعر</th>
              <th>الكمية</th>
              <th>الخصم %</th>
              <th>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.code}</td>
                <td>${formatCurrency(item.unitPrice)}</td>
                <td>${item.quantity}</td>
                <td>${item.discount}%</td>
                <td>${formatCurrency(item.total)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div>المجموع: ${formatCurrency(invoice.subtotal)}</div>
          <div>الخصم الكلي: -${formatCurrency(invoice.discount)}</div>
          ${invoice.type === 'B2B' || invoice.type === 'B2C' ? `<div>الضريبة (14%): +${formatCurrency(invoice.taxAmount)}</div>` : ''}
          <div class="final">الإجمالي النهائي: ${formatCurrency(invoice.totalAmount)}</div>
        </div>

        ${invoice.notes ? `<div class="notes"><strong>ملاحظات:</strong> ${invoice.notes}</div>` : ''}

        <div class="footer">
          شكراً لتعاملكم معنا
        </div>
      </div>
    </body>
    </html>
  `;
};

// ========== Print ==========
const printInvoice = (invoice) => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(generateInvoiceHTML(invoice));
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

// ========== PDF Export ==========
const exportSingleInvoicePDF = async (invoice) => {
  const element = document.createElement('div');
  element.innerHTML = generateInvoiceHTML(invoice);
  html2pdf().from(element).set({
    margin: 0.5,
    filename: `فاتورة_${invoice.invoiceNumber}.pdf`,
    html2canvas: { scale: 2, backgroundColor: '#ffffff' },
    jsPDF: { orientation: 'portrait', unit: 'in', format: 'a4', compressPDF: true }
  }).save();
};

const exportToPDFBulk = async () => {
  if ((filteredInvoices.value?.length || 0) === 0) return;
  store.dispatch('showNotification', { type: 'info', message: 'جاري تجهيز ملف PDF للفواتير المحددة...' });
  exportSingleInvoicePDF(filteredInvoices.value[0]);
};

// ========== Load initial data ==========
onMounted(() => {
  if (warehouses.value.length === 0) {
    store.dispatch('loadWarehouses');
  }
  loadInvoices();
});
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