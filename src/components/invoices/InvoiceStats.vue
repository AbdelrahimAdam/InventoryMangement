<template>
  <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
    <div class="stat-card">
      <div class="stat-icon bg-blue-100 dark:bg-blue-900">
        <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">إجمالي الفواتير</p>
        <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{{ formatNumber(totalInvoices) }}</p>
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
        <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(totalSales) }}</p>
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
        <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{{ formatNumber(uniqueCustomers) }}</p>
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
        <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(totalTax) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  invoices: { type: Array, required: true }
});

const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num || 0);
const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EGP', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount || 0);

const totalInvoices = computed(() => props.invoices.length);
const totalSales = computed(() =>
  props.invoices.filter(inv => inv.status !== 'cancelled')
    .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0)
);
const totalTax = computed(() =>
  props.invoices.filter(inv => inv.status !== 'cancelled' && (inv.type === 'B2B' || inv.type === 'B2C'))
    .reduce((sum, inv) => sum + (inv.taxAmount || 0), 0)
);
const uniqueCustomers = computed(() => new Set(props.invoices.map(inv => inv.customer?.phone)).size);
</script>

<style scoped>
.stat-card {
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4;
}
.stat-icon {
  @apply h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center flex-shrink-0;
}
</style>