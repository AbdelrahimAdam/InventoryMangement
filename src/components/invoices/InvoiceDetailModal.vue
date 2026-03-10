<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">تفاصيل الفاتورة #{{ invoice.invoiceNumber }}</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="p-6 space-y-6">
        <!-- Customer Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">اسم العميل</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ invoice.customer.name }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">رقم الهاتف</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ invoice.customer.phone }}</p>
          </div>
          <div v-if="invoice.customer.taxId">
            <p class="text-sm text-gray-500 dark:text-gray-400">الرقم الضريبي</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ invoice.customer.taxId }}</p>
          </div>
          <div v-if="invoice.customer.address">
            <p class="text-sm text-gray-500 dark:text-gray-400">العنوان</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ invoice.customer.address }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">التاريخ</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ formatDate(invoice.date) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">طريقة الدفع</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ getPaymentMethodLabel(invoice.paymentMethod) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">الحالة</p>
            <span class="px-2 py-1 text-xs rounded-full" :class="getInvoiceStatusClass(invoice.status)">
              {{ getInvoiceStatusLabel(invoice.status) }}
            </span>
          </div>
        </div>

        <!-- Items Table -->
        <div>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">الأصناف</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700">
              <thead class="bg-blue-600 text-white">
                <tr>
                  <th class="px-4 py-3 text-right text-xs font-medium">الصنف</th>
                  <th class="px-4 py-3 text-right text-xs font-medium">الكود</th>
                  <th class="px-4 py-3 text-right text-xs font-medium">اللون</th>
                  <th class="px-4 py-3 text-right text-xs font-medium">السعر</th>
                  <th class="px-4 py-3 text-right text-xs font-medium">الكمية</th>
                  <th class="px-4 py-3 text-right text-xs font-medium">الخصم %</th>
                  <th class="px-4 py-3 text-right text-xs font-medium">الإجمالي</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="item in invoice.items" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ item.name }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ item.code }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ item.color || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ formatCurrency(item.unitPrice) }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ item.quantity }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ item.discount }}%</td>
                  <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(item.total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Totals -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
          <div class="flex justify-end text-sm">
            <span class="text-gray-600 dark:text-gray-400 ml-4">المجموع:</span>
            <span class="font-medium text-gray-900 dark:text-white w-32 text-left">{{ formatCurrency(invoice.subtotal) }}</span>
          </div>
          <div class="flex justify-end text-sm">
            <span class="text-gray-600 dark:text-gray-400 ml-4">الخصم:</span>
            <span class="font-medium text-red-600 dark:text-red-400 w-32 text-left">-{{ formatCurrency(invoice.discount) }}</span>
          </div>
          <div v-if="invoice.type === 'B2B' || invoice.type === 'B2C'" class="flex justify-end text-sm">
            <span class="text-gray-600 dark:text-gray-400 ml-4">الضريبة (14%):</span>
            <span class="font-medium text-gray-900 dark:text-white w-32 text-left">+{{ formatCurrency(invoice.taxAmount) }}</span>
          </div>
          <div class="flex justify-end text-base font-bold mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span class="text-gray-900 dark:text-white ml-4">الإجمالي النهائي:</span>
            <span class="text-green-600 dark:text-green-400 w-32 text-left">{{ formatCurrency(invoice.totalAmount) }}</span>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="invoice.notes" class="text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
          <span class="font-medium">ملاحظات:</span> {{ invoice.notes }}
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-2 space-x-reverse pt-4 border-t border-gray-200 dark:border-gray-700">
          <button @click="$emit('print', invoice)" class="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">طباعة</button>
          <button @click="$emit('export-pdf', invoice)" class="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700">تصدير PDF</button>
          <button v-if="invoice.status === 'draft'" @click="$emit('edit', invoice)" class="px-4 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">تعديل</button>
          <button @click="$emit('close')" class="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">إغلاق</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatCurrency, formatDate, getPaymentMethodLabel, getInvoiceStatusLabel, getInvoiceStatusClass } from '@/utils/helpers';

defineProps({
  invoice: { type: Object, required: true }
});

defineEmits(['close', 'edit', 'print', 'export-pdf']);
</script>