import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export function useInvoiceList() {
  const store = useStore();

  const invoiceSearchTerm = ref('');
  const invoiceStatusFilter = ref('');
  const invoiceTypeFilter = ref('');
  const currentPage = ref(1);
  const itemsPerPage = 10;

  const loading = computed(() => {
    const val = store.state.invoicesLoading || false;
    console.log('⏳ loading computed:', val);
    return val;
  });

  const allInvoices = computed(() => {
    const inv = store.state.invoices || [];
    console.log('📋 allInvoices computed – count:', inv.length, 'data:', inv);
    return inv;
  });

  const filteredInvoices = computed(() => {
    console.log('🔍 filteredInvoices computed – starting with', allInvoices.value.length, 'invoices');
    let filtered = [...allInvoices.value];
    if (invoiceSearchTerm.value) {
      const term = invoiceSearchTerm.value.toLowerCase();
      filtered = filtered.filter(inv =>
        inv.invoiceNumber?.toString().includes(term) ||
        inv.customer?.name?.toLowerCase().includes(term) ||
        inv.customer?.phone?.includes(term)
      );
    }
    if (invoiceStatusFilter.value) {
      filtered = filtered.filter(inv => inv.status === invoiceStatusFilter.value);
    }
    if (invoiceTypeFilter.value) {
      filtered = filtered.filter(inv => inv.type === invoiceTypeFilter.value);
    }
    const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log('🔍 filteredInvoices result count:', sorted.length);
    return sorted;
  });

  const totalPages = computed(() => Math.ceil(filteredInvoices.value.length / itemsPerPage));
  const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
  const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredInvoices.value.length));
  const paginatedInvoices = computed(() => {
    const slice = filteredInvoices.value.slice(startIndex.value, endIndex.value);
    console.log('📄 paginatedInvoices slice:', slice.length);
    return slice;
  });

  const loadInvoices = async (force = false) => {
    console.log('🚀 loadInvoices called, force =', force);
    try {
      const result = await store.dispatch('loadAllInvoices', { forceRefresh: force });
      console.log('📦 loadAllInvoices result:', result);
    } catch (error) {
      console.error('❌ loadInvoices error:', error);
    }
  };

  const filterInvoices = () => { 
    console.log('🎛️ filterInvoices called');
    currentPage.value = 1; 
  };
  const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
  const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };

  const deleteInvoice = async (invoiceId) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) return;
    try {
      const result = await store.dispatch('deleteInvoice', invoiceId);
      if (!result.success) {
        store.dispatch('showNotification', { type: 'error', message: result.message });
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      store.dispatch('showNotification', { type: 'error', message: error.message });
    }
  };

  const exportToExcel = () => {
    store.dispatch('exportInvoicesToExcel', {
      filters: {
        search: invoiceSearchTerm.value,
        status: invoiceStatusFilter.value,
        type: invoiceTypeFilter.value
      }
    });
  };

  onMounted(() => {
    console.log('🔄 useInvoiceList mounted, calling loadInvoices');
    loadInvoices();
  });

  return {
    loading,
    filteredInvoices,
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
    deleteInvoice,
    exportToExcel,
    loadInvoices
  };
}