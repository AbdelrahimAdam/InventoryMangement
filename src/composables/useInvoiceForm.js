import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { debounce } from 'lodash';

let instanceCount = 0;
export function useInvoiceForm() {
  const instanceId = ++instanceCount;
  const store = useStore();

  const invoiceForm = ref({
    type: 'B2B',
    paymentMethod: 'cash',
    customer: { name: '', phone: '', taxId: '', address: '' },
    items: [],
    notes: '',
    warehouseId: '',
    status: 'draft'
  });

  const editingInvoice = ref(null);
  const saving = ref(false);
  const showForm = ref(false);
  const itemSearch = ref('');
  const searchingItems = ref(false);
  const searchResults = ref([]);
  const lastSearchSource = ref('');
  const searchAllWarehouses = ref(false);
  const selectedWarehouseForInvoice = ref('');

  // Deep watch for debugging (optional)
  watch(invoiceForm, (newVal) => {
    console.log(`📦 [instance #${instanceId}] invoiceForm changed`);
  }, { deep: true });

  // ========== Computed Totals ==========
  const subtotal = computed(() =>
    invoiceForm.value.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
  );
  const totalDiscount = computed(() =>
    invoiceForm.value.items.reduce((sum, item) =>
      sum + ((item.unitPrice * item.quantity) * (item.discount / 100)), 0
    )
  );
  const taxAmount = computed(() =>
    (invoiceForm.value.type === 'B2B' || invoiceForm.value.type === 'B2C')
      ? (subtotal.value - totalDiscount.value) * 0.14
      : 0
  );
  const totalAmount = computed(() => subtotal.value - totalDiscount.value + taxAmount.value);
  const totalQuantity = computed(() =>
    invoiceForm.value.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
  );
  const hasCartonItems = computed(() =>
    invoiceForm.value.items.some(item => item.per_carton_count > 1)
  );
  const totalCartons = computed(() =>
    invoiceForm.value.items.reduce((sum, item) => sum + (item.cartons_count || 0), 0)
  );
  const totalSingles = computed(() =>
    invoiceForm.value.items.reduce((sum, item) => sum + (item.single_bottles_count || 0), 0)
  );

  const canSave = computed(() => {
    const missing = [];
    if (!invoiceForm.value.customer.name.trim()) missing.push('اسم العميل');
    if (!invoiceForm.value.customer.phone.trim()) missing.push('رقم الهاتف');
    if (invoiceForm.value.items.length === 0) missing.push('الأصناف');
    if (!selectedWarehouseForInvoice.value) missing.push('المخزن');
    return missing.length === 0;
  });

  // ========== Item Management ==========
  const addItemToInvoice = (item) => {
    const existingIndex = invoiceForm.value.items.findIndex(i => i.id === item.id);
    if (existingIndex !== -1) {
      const existingItem = invoiceForm.value.items[existingIndex];
      const perCarton = existingItem.per_carton_count || 12;
      const currentTotal = (existingItem.cartons_count || 0) * perCarton + (existingItem.single_bottles_count || 0);
      if (currentTotal < item.remaining_quantity) {
        const newTotal = currentTotal + 1;
        existingItem.quantity = newTotal;
        existingItem.cartons_count = Math.floor(newTotal / perCarton);
        existingItem.single_bottles_count = newTotal % perCarton;
        updateItemTotal(existingIndex);
        store.dispatch('showNotification', { type: 'success', message: `تم زيادة كمية ${item.name}` });
      } else {
        store.dispatch('showNotification', { type: 'warning', message: 'لا يمكن إضافة كمية أكثر من المتاح في المخزن' });
      }
    } else {
      const perCarton = item.per_carton_count || 12;
      invoiceForm.value.items.push({
        id: item.id,
        name: item.name,
        code: item.code,
        unitPrice: item.sale_price || item.unitPrice || 0,
        quantity: 1,
        cartons_count: 0,
        single_bottles_count: 1,
        per_carton_count: perCarton,
        discount: 0,
        total: item.sale_price || item.unitPrice || 0,
        maxQuantity: item.remaining_quantity,
        warehouseId: item.warehouse_id,
        color: item.color,
        supplier: item.supplier,
        originalItem: item
      });
      store.dispatch('showNotification', { type: 'success', message: `تم إضافة ${item.name} إلى الفاتورة` });
    }
    searchResults.value = searchResults.value.filter(i => i.id !== item.id);
    if (itemSearch.value.trim() && itemSearch.value.trim().length >= 2) debouncedSearchItems();
    else loadWarehouseItems();
  };

  const removeItem = (index) => {
    invoiceForm.value.items.splice(index, 1);
    if (itemSearch.value.trim() && itemSearch.value.trim().length >= 2) debouncedSearchItems();
    else loadWarehouseItems();
  };

  const increaseCarton = (index) => {
    const item = invoiceForm.value.items[index];
    const perCarton = item.per_carton_count || 12;
    const newCartons = (item.cartons_count || 0) + 1;
    const newTotal = newCartons * perCarton + (item.single_bottles_count || 0);
    if (newTotal <= item.maxQuantity) {
      item.cartons_count = newCartons;
      item.quantity = newTotal;
      updateItemTotal(index);
    }
  };

  const decreaseCarton = (index) => {
    const item = invoiceForm.value.items[index];
    const perCarton = item.per_carton_count || 12;
    if (item.cartons_count > 0) {
      const newCartons = item.cartons_count - 1;
      const newTotal = newCartons * perCarton + (item.single_bottles_count || 0);
      item.cartons_count = newCartons;
      item.quantity = newTotal;
      updateItemTotal(index);
    }
  };

  const increaseQuantity = (index) => {
    const item = invoiceForm.value.items[index];
    const perCarton = item.per_carton_count || 12;
    const currentTotal = (item.cartons_count || 0) * perCarton + (item.single_bottles_count || 0);
    if (currentTotal < item.maxQuantity) {
      const newTotal = currentTotal + 1;
      item.quantity = newTotal;
      item.cartons_count = Math.floor(newTotal / perCarton);
      item.single_bottles_count = newTotal % perCarton;
      updateItemTotal(index);
    } else {
      store.dispatch('showNotification', { type: 'warning', message: 'لا يمكن إضافة كمية أكثر من المتاح' });
    }
  };

  const decreaseQuantity = (index) => {
    const item = invoiceForm.value.items[index];
    const perCarton = item.per_carton_count || 12;
    const currentTotal = (item.cartons_count || 0) * perCarton + (item.single_bottles_count || 0);
    if (currentTotal > 1) {
      const newTotal = currentTotal - 1;
      item.quantity = newTotal;
      item.cartons_count = Math.floor(newTotal / perCarton);
      item.single_bottles_count = newTotal % perCarton;
      updateItemTotal(index);
    }
  };

  const setMaxQuantityForItem = (index) => {
    const item = invoiceForm.value.items[index];
    if (!item) return;
    const maxQty = item.maxQuantity || 0;
    if (maxQty <= 0) return;
    item.quantity = maxQty;
    const perCarton = item.per_carton_count || 12;
    item.cartons_count = Math.floor(maxQty / perCarton);
    item.single_bottles_count = maxQty % perCarton;
    updateItemTotal(index);
  };

  const validateItemQuantity = (index) => {
    const item = invoiceForm.value.items[index];
    const perCarton = item.per_carton_count || 12;
    const totalUnits = item.quantity || 0;
    if (totalUnits > item.maxQuantity) {
      item.quantity = item.maxQuantity;
      item.cartons_count = Math.floor(item.maxQuantity / perCarton);
      item.single_bottles_count = item.maxQuantity % perCarton;
      store.dispatch('showNotification', { type: 'warning', message: 'تم ضبط الكمية إلى الحد الأقصى المتاح' });
    } else if (totalUnits < 1) {
      item.quantity = 1;
      item.cartons_count = 0;
      item.single_bottles_count = 1;
    } else {
      item.cartons_count = Math.floor(totalUnits / perCarton);
      item.single_bottles_count = totalUnits % perCarton;
    }
    updateItemTotal(index);
  };

  const updateItemTotal = (index) => {
    const item = invoiceForm.value.items[index];
    const subtotal = item.unitPrice * item.quantity;
    item.total = subtotal - (subtotal * (item.discount / 100));
  };

  // ========== SPARK Search ==========
  const debouncedSearchItems = debounce(() => {
    searchItemsWithSpark();
  }, 300);

  const searchItemsWithSpark = async () => {
    if (!itemSearch.value.trim() || itemSearch.value.trim().length < 2) {
      searchResults.value = [];
      lastSearchSource.value = '';
      return;
    }
    searchingItems.value = true;
    try {
      const searchQuery = itemSearch.value.trim();
      const warehouseId = searchAllWarehouses.value ? null : selectedWarehouseForInvoice.value;
      let results = [], source = '';
      if (store.dispatch && typeof store.dispatch === 'function') {
        try {
          results = await store.dispatch('searchInventorySpark', {
            searchQuery,
            warehouseId,
            limit: 100,
            strategy: 'firebase_first'
          }) || [];
          source = 'firebase';
          if (results.length === 0) {
            results = await store.dispatch('searchLocalSpark', {
              query: searchQuery,
              warehouseId,
              limit: 50
            }) || [];
            source = 'local_fallback';
          }
        } catch {
          results = await store.dispatch('searchLocalSpark', {
            query: searchQuery,
            warehouseId,
            limit: 50
          }) || [];
          source = 'local_fallback';
        }
      } else {
        results = performBasicLocalSearch(searchQuery, warehouseId);
        source = 'cache';
      }
      searchResults.value = results.map(item => ({
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
        per_carton_count: item.per_carton_count || item.items_per_carton || 12,
        item_location: item.item_location || '',
        notes: item.notes || '',
        updated_at: item.updated_at || null
      }));
      lastSearchSource.value = source;
    } catch (error) {
      console.error('SPARK search error:', error);
      searchResults.value = performBasicLocalSearch(itemSearch.value.trim(), selectedWarehouseForInvoice.value);
      lastSearchSource.value = 'cache';
      store.dispatch('showNotification', { type: 'warning', message: 'البحث المحدود - استخدمنا البيانات المحلية' });
    } finally {
      searchingItems.value = false;
    }
  };

  const performBasicLocalSearch = (searchQuery, warehouseId) => {
    const allInventory = store.state.inventory || [];
    let items = allInventory.filter(item => item.remaining_quantity > 0);
    if (warehouseId) items = items.filter(item => item.warehouse_id === warehouseId);
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
      let results = [];
      if (store.dispatch && typeof store.dispatch === 'function') {
        try {
          results = await store.dispatch('searchFirebaseSparkEnhanced', {
            query: '',
            warehouseId: selectedWarehouseForInvoice.value,
            limit: 200
          }) || [];
          lastSearchSource.value = 'warehouse_load';
        } catch {
          results = performBasicLocalSearch('', selectedWarehouseForInvoice.value);
          lastSearchSource.value = 'cache';
        }
      } else {
        results = performBasicLocalSearch('', selectedWarehouseForInvoice.value);
        lastSearchSource.value = 'cache';
      }
      searchResults.value = results;
    } catch (error) {
      console.error('Error loading warehouse items:', error);
      searchResults.value = [];
    } finally {
      searchingItems.value = false;
    }
  };

  const refreshItemQuantities = () => {
    const allInventory = store.state.inventory || [];
    if (!invoiceForm.value.items.length) return;
    let updated = false;
    invoiceForm.value.items = invoiceForm.value.items.map(item => {
      const currentItem = allInventory.find(i => i.id === item.id);
      if (currentItem) {
        const newMax = currentItem.remaining_quantity || 0;
        if (item.maxQuantity !== newMax) {
          updated = true;
          if (item.quantity > newMax) {
            item.quantity = newMax;
            const perCarton = item.per_carton_count || 12;
            item.cartons_count = Math.floor(newMax / perCarton);
            item.single_bottles_count = newMax % perCarton;
          }
          item.maxQuantity = newMax;
        }
      } else {
        item.maxQuantity = 0;
        if (item.quantity > 0) {
          item.quantity = 0;
          item.cartons_count = 0;
          item.single_bottles_count = 0;
        }
        updated = true;
      }
      return item;
    });
    if (updated) {
      store.dispatch('showNotification', {
        type: 'info',
        message: 'تم تحديث الكميات المتاحة حسب آخر تحديث للمخزون'
      });
    }
  };

  watch(() => store.state.inventory, refreshItemQuantities, { deep: true });

  // ========== Form Actions ==========
  const createNewInvoice = () => {
    resetForm();
    showForm.value = true;
  };

  const editInvoice = (invoice) => {
    invoiceForm.value = {
      ...invoice,
      customer: { ...invoice.customer },
      items: invoice.items.map(item => ({ ...item }))
    };
    selectedWarehouseForInvoice.value = invoice.warehouseId;
    editingInvoice.value = invoice;
    showForm.value = true;
    loadWarehouseItems();
    refreshItemQuantities();
  };

  const cancelInvoiceForm = () => {
    resetForm();
    showForm.value = false;
  };

  const resetForm = () => {
    invoiceForm.value = {
      type: 'B2B',
      paymentMethod: 'cash',
      customer: { name: '', phone: '', taxId: '', address: '' },
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
    if (invoiceForm.value.type !== 'B2B') invoiceForm.value.customer.taxId = '';
  };

  const saveInvoice = async () => {
    if (!canSave.value) {
      const missing = [];
      if (!invoiceForm.value.customer.name.trim()) missing.push('اسم العميل');
      if (!invoiceForm.value.customer.phone.trim()) missing.push('رقم الهاتف');
      if (invoiceForm.value.items.length === 0) missing.push('الأصناف');
      if (!selectedWarehouseForInvoice.value) missing.push('المخزن');
      const message = missing.length ? `الرجاء إكمال البيانات التالية: ${missing.join('، ')}` : 'البيانات غير مكتملة';
      store.dispatch('showNotification', { type: 'error', message });
      return;
    }

    saving.value = true;
    try {
      const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
      if (!phoneRegex.test(invoiceForm.value.customer.phone)) {
        store.dispatch('showNotification', { type: 'error', message: 'يرجى إدخال رقم هاتف صحيح (مثال: 01012345678)' });
        saving.value = false;
        return;
      }
      if (invoiceForm.value.type === 'B2B' && (!invoiceForm.value.customer.taxId || invoiceForm.value.customer.taxId.length < 9)) {
        store.dispatch('showNotification', { type: 'error', message: 'يرجى إدخال رقم ضريبي صالح (9 أرقام على الأقل) للفواتير الضريبية' });
        saving.value = false;
        return;
      }

      const payload = {
        type: invoiceForm.value.type,
        paymentMethod: invoiceForm.value.paymentMethod,
        customer: { ...invoiceForm.value.customer },
        items: invoiceForm.value.items.map(item => ({
          id: item.id,
          name: item.name,
          code: item.code,
          unitPrice: Number(item.unitPrice) || 0,
          quantity: Number(item.quantity) || 0,
          discount: Number(item.discount) || 0,
          total: Number(item.total) || 0,
          warehouseId: item.warehouseId || selectedWarehouseForInvoice.value
        })),
        warehouseId: selectedWarehouseForInvoice.value,
        notes: invoiceForm.value.notes || '',
        status: 'draft',
        subtotal: subtotal.value,
        discount: totalDiscount.value,
        taxAmount: taxAmount.value,
        totalAmount: totalAmount.value
      };

      let result;
      if (editingInvoice.value) {
        result = await store.dispatch('updateInvoice', { invoiceId: editingInvoice.value.id, invoiceData: payload });
      } else {
        result = await store.dispatch('createInvoice', payload);
      }

      if (result?.success) {
        store.dispatch('showNotification', { type: 'success', message: result.message || 'تم حفظ الفاتورة بنجاح' });
        cancelInvoiceForm();
        return result;
      } else {
        throw new Error(result?.message || 'فشل حفظ الفاتورة');
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      store.dispatch('showNotification', { type: 'error', message: error.message || 'حدث خطأ أثناء حفظ الفاتورة' });
    } finally {
      saving.value = false;
    }
  };

  const saveAndPrint = async () => {
    const result = await saveInvoice();
    if (result) return result;
  };

  // ========== Utility Functions ==========
  const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num || 0);
  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EGP', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount || 0);
  const getQuantityClass = (quantity) => {
    if (quantity < 10) return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300';
    if (quantity < 50) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300';
    return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300';
  };
  const getSearchSourceLabel = (source) => ({
    cache: 'ذاكرة التخزين',
    firebase: 'القاعدة الكاملة',
    local_fallback: 'بحث محلي',
    warehouse_load: 'تحميل من المخزن'
  }[source] || source);

  return {
    invoiceForm,
    editingInvoice,
    saving,
    showForm,
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
    searchItemsWithSpark,
    performBasicLocalSearch,
    refreshItemQuantities,
    createNewInvoice,
    editInvoice,
    cancelInvoiceForm,
    onInvoiceTypeChange,
    saveInvoice,
    saveAndPrint,
    formatNumber,
    formatCurrency,
    getQuantityClass,
    getSearchSourceLabel
  };
}