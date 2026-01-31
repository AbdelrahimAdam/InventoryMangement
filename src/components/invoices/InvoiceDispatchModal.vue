<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
    
    <!-- Modal -->
    <div class="relative min-h-screen flex items-center justify-center p-4">
      <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              صرف فاتورة #{{ invoice?.invoiceNumber }}
            </h3>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Content -->
        <div class="p-6">
          <!-- Invoice Info -->
          <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">العميل</p>
                <p class="font-medium">{{ invoice?.customer?.name }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ invoice?.customer?.phone }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">المخزن</p>
                <p class="font-medium">{{ getWarehouseLabel(invoice?.warehouseId) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">إجمالي الفاتورة</p>
                <p class="font-medium text-green-600 dark:text-green-400">{{ formatCurrency(invoice?.totalAmount || 0) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">عدد الأصناف</p>
                <p class="font-medium">{{ invoice?.items?.length || 0 }} صنف</p>
              </div>
            </div>
          </div>
          
          <!-- Items List -->
          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">أصناف الفاتورة</h4>
            <div class="space-y-3">
              <div v-for="item in invoice?.items || []" :key="item.id" class="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <p class="font-medium">{{ item.name }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ item.code }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-medium">{{ formatCurrency(item.total || 0) }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ item.quantity }} × {{ formatCurrency(item.unitPrice || 0) }}</p>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <div>
                    <span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                      متوفر: {{ getItemAvailableQuantity(item.id) }}
                    </span>
                  </div>
                  <div>
                    <span class="text-sm text-gray-600 dark:text-gray-400">الخصم: {{ item.discount }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Dispatch Options -->
          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">خيارات الصرف</h4>
            <div class="space-y-4">
              <!-- Destination -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">وجهة الصرف</label>
                <select v-model="dispatchData.destination" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                  <option value="external_wharehouse">صرف خارجي</option>
                  <option value="dubi_factory">مصنع دبي</option>
                  <option value="factory">مصنع البران</option>
                  <option value="dispat_item">موقع صرف</option>
                  <option value="zahra">صرف الي مخزن الزهراء</option>
                  <option value="ghabashi">مخزن الغباشي</option>
                </select>
              </div>
              
              <!-- Notes -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ملاحظات</label>
                <textarea v-model="dispatchData.notes" rows="2" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" placeholder="ملاحظات إضافية..."></textarea>
              </div>
              
              <!-- Dispatch Method -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">طريقة الصرف</label>
                <div class="flex space-x-4 space-x-reverse">
                  <label class="flex items-center">
                    <input type="radio" v-model="dispatchMethod" value="single" class="mr-2">
                    <span>صرف صنف فردي</span>
                  </label>
                  <label class="flex items-center">
                    <input type="radio" v-model="dispatchMethod" value="bulk" class="mr-2">
                    <span>صرف جميع الأصناف</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="sticky bottom-0 bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex justify-end space-x-3 space-x-reverse">
            <button @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
              إلغاء
            </button>
            <button 
              @click="dispatchInvoice" 
              :disabled="dispatching"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <svg v-if="dispatching" class="animate-spin h-4 w-4 ml-2 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ dispatching ? 'جاري الصرف...' : 'تأكيد الصرف' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'InvoiceDispatchModal',
  props: {
    isOpen: Boolean,
    invoice: Object
  },
  emits: ['close', 'success'],
  
  setup(props, { emit }) {
    const store = useStore();
    const dispatchData = ref({
      destination: 'external_wharehouse',
      notes: `صرف فاتورة #${props.invoice?.invoiceNumber || ''}`
    });
    const dispatchMethod = ref('bulk');
    const dispatching = ref(false);
    
    const getWarehouseLabel = (warehouseId) => {
      const warehouses = store.state.warehouses || [];
      const warehouse = warehouses.find(w => w.id === warehouseId);
      return warehouse ? warehouse.name_ar : warehouseId;
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
    
    const getItemAvailableQuantity = (itemId) => {
      const inventory = store.state.inventory || [];
      const item = inventory.find(i => i.id === itemId);
      return item ? item.remaining_quantity : 0;
    };
    
    const dispatchInvoice = async () => {
      if (!props.invoice || !props.invoice.items || props.invoice.items.length === 0) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'لا توجد أصناف للصرف'
        });
        return;
      }
      
      try {
        dispatching.value = true;
        
        if (dispatchMethod.value === 'single') {
          // For single item dispatch, you might want to add item selection
          // For now, we'll dispatch the first item
          const item = props.invoice.items[0];
          
          const result = await store.dispatch('dispatchInvoiceItem', {
            invoiceId: props.invoice.id,
            invoiceNumber: props.invoice.invoiceNumber,
            itemId: item.id,
            itemName: item.name,
            itemCode: item.code,
            quantity: item.quantity,
            warehouseId: props.invoice.warehouseId,
            destination: dispatchData.value.destination,
            destinationId: dispatchData.value.destination,
            notes: dispatchData.value.notes,
            customerName: props.invoice.customer.name,
            customerPhone: props.invoice.customer.phone
          });
          
          if (result.success) {
            emit('success', result);
            emit('close');
          }
          
        } else {
          // Bulk dispatch all items
          const items = props.invoice.items.map(item => ({
            id: item.id,
            name: item.name,
            code: item.code,
            quantity: item.quantity
          }));
          
          const result = await store.dispatch('dispatchInvoiceBulk', {
            invoiceId: props.invoice.id,
            invoiceNumber: props.invoice.invoiceNumber,
            items: items,
            warehouseId: props.invoice.warehouseId,
            destination: dispatchData.value.destination,
            destinationId: dispatchData.value.destination,
            notes: dispatchData.value.notes,
            customerName: props.invoice.customer.name,
            customerPhone: props.invoice.customer.phone
          });
          
          if (result.success) {
            emit('success', result);
            emit('close');
          }
        }
        
      } catch (error) {
        console.error('Error dispatching invoice:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في صرف الفاتورة'
        });
      } finally {
        dispatching.value = false;
      }
    };
    
    return {
      dispatchData,
      dispatchMethod,
      dispatching,
      getWarehouseLabel,
      formatCurrency,
      getItemAvailableQuantity,
      dispatchInvoice
    };
  }
};
</script>