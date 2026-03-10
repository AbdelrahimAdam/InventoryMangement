import { computed } from 'vue';

export function useInvoiceStats(invoices) {
  const totalInvoices = computed(() => invoices.value.length);
  const totalSales = computed(() =>
    invoices.value.filter(inv => inv.status !== 'cancelled')
      .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0)
  );
  const totalTax = computed(() =>
    invoices.value.filter(inv => inv.status !== 'cancelled' && (inv.type === 'B2B' || inv.type === 'B2C'))
      .reduce((sum, inv) => sum + (inv.taxAmount || 0), 0)
  );
  const uniqueCustomers = computed(() => new Set(invoices.value.map(inv => inv.customer?.phone)).size);

  return {
    totalInvoices,
    totalSales,
    totalTax,
    uniqueCustomers
  };
}