<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg w-full max-w-2xl rtl flex flex-col" style="height: 90vh;">
      <!-- Fixed Header -->
      <div class="flex justify-between items-center p-4 border-b shrink-0 bg-white">
        <h2 class="text-lg font-semibold text-gray-800">نقل الأصناف بين المخازن</h2>
        <button 
          @click="closeModal"
          class="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
        >
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Main Content Area - Properly structured -->
      <div class="flex-1 overflow-hidden flex flex-col">
        <!-- Scrollable Content Area -->
        <div class="flex-1 overflow-y-auto min-h-0">
          <div class="p-4 space-y-4">
            <!-- Search and Filter -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  v-model="searchTerm"
                  placeholder="ابحث بالاسم، الكود، اللون..."
                  class="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <select
                  v-model="filterWarehouse"
                  class="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">جميع المخازن</option>
                  <option v-for="warehouse in primaryWarehouses" :key="warehouse.id" :value="warehouse.id">
                    {{ warehouse.name_ar }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Items Table Container -->
            <div class="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <!-- Fixed Table Header -->
              <div class="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
                <div class="grid grid-cols-12 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div class="col-span-1 px-2 py-3 text-center">
                    ✓
                  </div>
                  <div class="col-span-7 px-2 py-3 text-right">
                    الصنف
                  </div>
                  <div class="col-span-2 px-2 py-3 text-right">
                    المخزن
                  </div>
                  <div class="col-span-2 px-2 py-3 text-center">
                    المتوفر
                  </div>
                </div>
              </div>

              <!-- Scrollable Table Body -->
              <div class="overflow-y-auto" :style="{ maxHeight: selectedItem ? '150px' : '250px', minHeight: '100px' }">
                <!-- Empty State -->
                <div v-if="filteredItems.length === 0" class="text-center py-8 text-gray-500 text-sm">
                  <svg class="mx-auto h-10 w-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"></path>
                  </svg>
                  <p class="font-medium">لا توجد أصناف متاحة للنقل</p>
                  <p class="text-xs mt-1">قم بتعديل البحث أو الفلتر</p>
                </div>

                <!-- Items List -->
                <div v-else>
                  <div 
                    v-for="item in filteredItems" 
                    :key="item.id"
                    @click="selectItem(item)"
                    :class="[
                      'grid grid-cols-12 cursor-pointer transition-colors duration-150 text-sm border-b border-gray-100 hover:bg-gray-50',
                      selectedItem?.id === item.id 
                        ? 'bg-blue-50 border-r-2 border-r-blue-500' 
                        : ''
                    ]"
                  >
                    <!-- Checkbox -->
                    <div class="col-span-1 px-2 py-3 flex items-center justify-center">
                      <input
                        type="radio"
                        :value="item.id"
                        v-model="formData.item_id"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    
                    <!-- Item Details -->
                    <div class="col-span-7 px-2 py-3">
                      <div class="space-y-1">
                        <div class="font-medium text-gray-900 line-clamp-1">
                          {{ item.name }}
                        </div>
                        <div class="text-gray-500 text-xs line-clamp-1">
                          {{ item.code }} - {{ item.color }}
                        </div>
                        <div class="text-gray-400 text-xs">
                          {{ item.cartons_count }}×{{ item.per_carton_count }} + {{ item.single_bottles_count }} فردي
                        </div>
                      </div>
                    </div>
                    
                    <!-- Warehouse -->
                    <div class="col-span-2 px-2 py-3 flex items-center text-gray-500 text-xs">
                      {{ getWarehouseShortName(getWarehouseName(item.warehouse_id)) }}
                    </div>
                    
                    <!-- Quantity -->
                    <div class="col-span-2 px-2 py-3 flex items-center justify-center font-semibold text-sm"
                      :class="getQuantityClass(item.remaining_quantity)">
                      {{ item.remaining_quantity }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Transfer Details - Collapsible on Mobile -->
            <div v-if="selectedItem" class="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
              <!-- Collapsible Header for Mobile -->
              <button 
                @click="isDetailsExpanded = !isDetailsExpanded"
                class="w-full flex justify-between items-center p-3 bg-blue-100 hover:bg-blue-200 transition-colors duration-200 sm:hidden"
              >
                <span class="text-sm font-semibold text-blue-800">تفاصيل النقل</span>
                <svg 
                  :class="['w-5 h-5 text-blue-600 transform transition-transform duration-200', isDetailsExpanded ? 'rotate-180' : '']" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <!-- Transfer Details Content -->
              <div :class="['sm:block', isDetailsExpanded ? 'block' : 'hidden']">
                <div class="p-3 space-y-3">
                  <h3 class="text-sm font-semibold text-blue-800 hidden sm:block">تفاصيل النقل</h3>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <!-- Source Info -->
                    <div class="space-y-2">
                      <div class="flex justify-between items-center">
                        <span class="text-xs sm:text-sm text-gray-600">من المخزن:</span>
                        <span class="font-medium text-xs sm:text-sm text-gray-900">{{ getWarehouseName(selectedItem.warehouse_id) }}</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-xs sm:text-sm text-gray-600">المتاح:</span>
                        <span class="font-medium text-xs sm:text-sm text-gray-900">{{ selectedItem.remaining_quantity }}</span>
                      </div>
                      <div class="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                        <div class="text-center p-2 bg-blue-100 rounded">
                          <div class="text-gray-600">الكراتين</div>
                          <div class="font-bold text-blue-700">{{ selectedItem.cartons_count }}</div>
                        </div>
                        <div class="text-center p-2 bg-blue-100 rounded">
                          <div class="text-gray-600">الفردي</div>
                          <div class="font-bold text-blue-700">{{ selectedItem.single_bottles_count }}</div>
                        </div>
                      </div>
                    </div>

                    <!-- Transfer Inputs -->
                    <div class="space-y-2">
                      <div class="grid grid-cols-2 gap-2">
                        <div>
                          <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">كراتين</label>
                          <input
                            type="number"
                            min="0"
                            :max="selectedItem.cartons_count"
                            v-model.number="formData.cartons"
                            class="w-full p-1 sm:p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            @change="validateQuantities"
                          />
                          <div class="text-xs text-gray-500 mt-1">حد: {{ selectedItem.cartons_count }}</div>
                        </div>
                        <div>
                          <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">فردي</label>
                          <input
                            type="number"
                            min="0"
                            :max="selectedItem.single_bottles_count"
                            v-model.number="formData.single_bottles"
                            class="w-full p-1 sm:p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            @change="validateQuantities"
                          />
                          <div class="text-xs text-gray-500 mt-1">حد: {{ selectedItem.single_bottles_count }}</div>
                        </div>
                      </div>
                      
                      <div>
                        <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">إلى المخزن</label>
                        <select
                          v-model="formData.to_warehouse"
                          required
                          class="w-full p-1 sm:p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">اختر المخزن</option>
                          <option 
                            v-for="warehouse in availableDestinationWarehouses" 
                            :key="warehouse.id" 
                            :value="warehouse.id"
                          >
                            {{ getWarehouseShortName(warehouse.name_ar) }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <!-- Summary and Validation -->
                  <div class="pt-2 border-t border-blue-200">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div class="text-xs sm:text-sm">
                        <span class="text-gray-600">الإجمالي:</span>
                        <span class="font-bold mx-1" :class="getQuantityClass(totalRequestedQuantity)">
                          {{ totalRequestedQuantity }}
                        </span>
                        <span class="text-gray-400">/ {{ selectedItem.remaining_quantity }}</span>
                      </div>
                      <div v-if="validationMessage" 
                           class="px-2 py-1 rounded text-xs font-medium whitespace-nowrap mt-1 sm:mt-0"
                           :class="validationMessage.type === 'error' 
                             ? 'bg-red-100 text-red-700 border border-red-200' 
                             : 'bg-green-100 text-green-700 border border-green-200'">
                        {{ validationMessage.text }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notes Section -->
            <div v-if="selectedItem" class="sm:block" :class="isDetailsExpanded ? 'block' : 'hidden sm:block'">
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">ملاحظات (اختياري)</label>
              <textarea
                v-model="formData.notes"
                rows="2"
                class="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أضف ملاحظات حول عملية النقل..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Fixed Action Buttons - ALWAYS VISIBLE -->
        <div class="p-3 border-t bg-white shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div class="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              @click="closeModal"
              class="py-2.5 px-3 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex-1 min-h-[44px]"
            >
              إلغاء
            </button>
            <button
              type="button"
              @click="handleSubmit"
              :disabled="loading || !isFormValid"
              class="py-2.5 px-3 text-sm font-medium bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 flex-1 min-h-[44px]"
            >
              <svg v-if="loading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7l4-4m0 0l4 4m-4-4v18m0 0l-4-4m4 4l4-4"></path>
              </svg>
              {{ loading ? 'جاري النقل...' : 'تأكيد النقل' }}
            </button>
          </div>
          
          <!-- Validation Status Bar -->
          <div v-if="selectedItem && !isFormValid" class="mt-2 text-xs text-center text-red-600 bg-red-50 p-1.5 rounded border border-red-200">
            ❌ املأ جميع الحقول المطلوبة بشكل صحيح
          </div>
          <div v-else-if="selectedItem && isFormValid" class="mt-2 text-xs text-center text-green-600 bg-green-50 p-1.5 rounded border border-green-200">
            ✅ جاهز للنقل - {{ totalRequestedQuantity }} وحدة
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'TransferModal',
  props: {
    isOpen: Boolean,
    item: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'success'],
  setup(props, { emit }) {
    const store = useStore();
    
    const loading = ref(false);
    const searchTerm = ref('');
    const filterWarehouse = ref('');
    const isDetailsExpanded = ref(true); // Default to expanded on desktop
    
    const formData = ref({
      item_id: '',
      from_warehouse: '',
      to_warehouse: '',
      cartons: 0,
      single_bottles: 0,
      notes: ''
    });

    // Computed properties
    const primaryWarehouses = computed(() => 
      store.state.warehouses.filter(w => w.type === 'primary')
    );

    const inventory = computed(() => store.state.inventory || []);

    const availableItems = computed(() => {
      return inventory.value.filter(item => item.remaining_quantity > 0);
    });

    const filteredItems = computed(() => {
      let items = availableItems.value;

      // Apply search filter
      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase();
        items = items.filter(item => 
          (item.name?.toLowerCase().includes(term) ||
          item.code?.toLowerCase().includes(term) ||
          item.color?.toLowerCase().includes(term) ||
          item.supplier?.toLowerCase().includes(term)) &&
          item.remaining_quantity > 0
        );
      }

      // Apply warehouse filter
      if (filterWarehouse.value) {
        items = items.filter(item => item.warehouse_id === filterWarehouse.value);
      }

      return items;
    });

    const selectedItem = computed(() => {
      if (formData.value.item_id) {
        return inventory.value.find(item => item.id === formData.value.item_id);
      }
      return null;
    });

    const availableDestinationWarehouses = computed(() => {
      if (!selectedItem.value) return [];
      return primaryWarehouses.value.filter(warehouse => 
        warehouse.id !== selectedItem.value.warehouse_id
      );
    });

    const itemsPerCarton = computed(() => {
      return selectedItem.value?.per_carton_count || 1;
    });

    const totalRequestedQuantity = computed(() => {
      return (formData.value.cartons * itemsPerCarton.value) + formData.value.single_bottles;
    });

    const validationMessage = computed(() => {
      if (!selectedItem.value) return null;

      const availableQuantity = selectedItem.value.remaining_quantity;
      
      if (totalRequestedQuantity.value === 0) {
        return { type: 'error', text: '❗ حدد كمية' };
      }
      
      if (totalRequestedQuantity.value > availableQuantity) {
        return { type: 'error', text: `❌ ${totalRequestedQuantity.value} > ${availableQuantity}` };
      }
      
      if (formData.value.cartons > selectedItem.value.cartons_count) {
        return { type: 'error', text: `❌ كراتين: ${formData.value.cartons} > ${selectedItem.value.cartons_count}` };
      }
      
      if (formData.value.single_bottles > selectedItem.value.single_bottles_count) {
        return { type: 'error', text: `❌ فردي: ${formData.value.single_bottles} > ${selectedItem.value.single_bottles_count}` };
      }
      
      if (!formData.value.to_warehouse) {
        return { type: 'error', text: '❗ اختر المخزن' };
      }

      if (formData.value.from_warehouse === formData.value.to_warehouse) {
        return { type: 'error', text: '❌ نفس المخزن' };
      }

      return { type: 'success', text: `✅ ${totalRequestedQuantity.value} / ${availableQuantity}` };
    });

    const isFormValid = computed(() => {
      return selectedItem.value && 
             formData.value.to_warehouse && 
             totalRequestedQuantity.value > 0 && 
             validationMessage.value?.type === 'success';
    });

    // Methods
    const getQuantityClass = (quantity) => {
      if (quantity === 0) return 'text-red-600';
      if (quantity < 10) return 'text-orange-600';
      return 'text-green-600';
    };

    const getWarehouseName = (warehouseId) => {
      const warehouse = store.state.warehouses.find(w => w.id === warehouseId);
      return warehouse ? warehouse.name_ar : warehouseId;
    };

    const getWarehouseShortName = (warehouseName) => {
      const shortNames = {
        'مخزن شارع الشيخ': 'الشيخ',
        'مخزن الترعه': 'الترعه',
        'مخزن موقف شبين': 'شبين',
        'مخزن هايبر التهامي': 'التهامي',
        'مخزن المنوفية': 'المنوفية',
        'مخزن الزهراء': 'الزهراء',
        'مصنع البران': 'البران'
      };
      return shortNames[warehouseName] || (warehouseName ? warehouseName.substring(0, 8) : '');
    };

    const selectItem = (item) => {
      formData.value.item_id = item.id;
      formData.value.from_warehouse = item.warehouse_id;
      formData.value.cartons = Math.min(1, item.cartons_count);
      formData.value.single_bottles = Math.min(1, item.single_bottles_count);
      formData.value.to_warehouse = '';
      // Auto-expand details when item is selected on mobile
      if (window.innerWidth < 640) {
        isDetailsExpanded.value = true;
      }
    };

    const validateQuantities = () => {
      if (!selectedItem.value) return;

      // Ensure cartons don't exceed available
      if (formData.value.cartons > selectedItem.value.cartons_count) {
        formData.value.cartons = selectedItem.value.cartons_count;
      }

      // Ensure single bottles don't exceed available
      if (formData.value.single_bottles > selectedItem.value.single_bottles_count) {
        formData.value.single_bottles = selectedItem.value.single_bottles_count;
      }

      // Ensure values are not negative
      if (formData.value.cartons < 0) formData.value.cartons = 0;
      if (formData.value.single_bottles < 0) formData.value.single_bottles = 0;

      // Ensure total doesn't exceed available quantity
      const total = (formData.value.cartons * itemsPerCarton.value) + formData.value.single_bottles;
      if (total > selectedItem.value.remaining_quantity) {
        // Adjust cartons down first
        const maxCartons = Math.floor(selectedItem.value.remaining_quantity / itemsPerCarton.value);
        if (maxCartons < formData.value.cartons) {
          formData.value.cartons = maxCartons;
          formData.value.single_bottles = selectedItem.value.remaining_quantity - (formData.value.cartons * itemsPerCarton.value);
        } else {
          // Adjust single bottles
          const maxSingle = selectedItem.value.remaining_quantity - (formData.value.cartons * itemsPerCarton.value);
          if (maxSingle < formData.value.single_bottles) {
            formData.value.single_bottles = maxSingle;
          }
        }
      }
    };

    const closeModal = () => {
      emit('close');
      resetForm();
    };

    const resetForm = () => {
      formData.value = {
        item_id: '',
        from_warehouse: '',
        to_warehouse: '',
        cartons: 0,
        single_bottles: 0,
        notes: ''
      };
      searchTerm.value = '';
      filterWarehouse.value = '';
      isDetailsExpanded.value = window.innerWidth >= 640; // Expanded on desktop, collapsed on mobile by default
    };

    const handleSubmit = async () => {
      if (!store.state.user || !selectedItem.value || !isFormValid.value) {
        return;
      }

      if (formData.value.from_warehouse === formData.value.to_warehouse) {
        alert('❌ لا يمكن النقل إلى نفس المخزن');
        return;
      }

      // Final validation
      if (totalRequestedQuantity.value <= 0) {
        alert('❗ يجب تحديد كمية للنقل');
        return;
      }

      if (totalRequestedQuantity.value > selectedItem.value.remaining_quantity) {
        alert('❌ الكمية المطلوبة تتجاوز الكمية المتاحة');
        return;
      }

      // Confirm with user
      if (!confirm(`هل أنت متأكد من نقل ${totalRequestedQuantity.value} وحدة من "${selectedItem.value.name}"؟`)) {
        return;
      }

      loading.value = true;
      try {
        const transferData = {
          item_id: formData.value.item_id,
          from_warehouse: formData.value.from_warehouse,
          to_warehouse: formData.value.to_warehouse,
          cartons: formData.value.cartons,
          single_bottles: formData.value.single_bottles,
          notes: formData.value.notes,
          total_quantity: totalRequestedQuantity.value,
          item_name: selectedItem.value.name,
          item_code: selectedItem.value.code,
          item_color: selectedItem.value.color
        };

        await store.dispatch('transferItem', transferData);
        
        emit('success');
        closeModal();
      } catch (error) {
        console.error('Error transferring item:', error);
        alert(`❌ خطأ في النقل: ${error.message || 'حدث خطأ غير متوقع'}`);
      } finally {
        loading.value = false;
      }
    };

    // Initialize based on screen size
    if (typeof window !== 'undefined') {
      isDetailsExpanded.value = window.innerWidth >= 640;
    }

    // Watchers
    watch(() => props.isOpen, (newVal) => {
      if (newVal) {
        resetForm();
        if (props.item) {
          selectItem(props.item);
        }
      }
    });

    watch(() => formData.value.cartons, () => {
      validateQuantities();
    });

    watch(() => formData.value.single_bottles, () => {
      validateQuantities();
    });

    watch(() => selectedItem.value, (newItem) => {
      if (newItem) {
        validateQuantities();
      }
    });

    return {
      loading,
      formData,
      searchTerm,
      filterWarehouse,
      isDetailsExpanded,
      primaryWarehouses,
      availableItems,
      filteredItems,
      selectedItem,
      availableDestinationWarehouses,
      totalRequestedQuantity,
      validationMessage,
      isFormValid,
      getQuantityClass,
      getWarehouseName,
      getWarehouseShortName,
      selectItem,
      validateQuantities,
      closeModal,
      handleSubmit
    };
  }
};
</script>

<style scoped>
/* Custom styles for better RTL support */
input, select, textarea {
  text-align: right;
  direction: rtl;
}

/* Modal container fixed height */
[style*="height: 90vh"] {
  height: 90vh !important;
  max-height: 90vh !important;
}

/* Ensure proper flex layout for the modal */
.flex-col {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* Main content area */
.flex-1 {
  flex: 1 1 0%;
  min-height: 0;
}

.overflow-hidden {
  overflow: hidden;
}

/* Scrollable content area */
.overflow-y-auto {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  flex: 1;
}

.min-h-0 {
  min-height: 0;
}

/* Adjust table height when details are shown */
[style*="max-height: 150px"] {
  max-height: 150px !important;
}

[style*="max-height: 250px"] {
  max-height: 250px !important;
}

/* Scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Fixed action buttons container - ALWAYS VISIBLE */
.shrink-0 {
  flex-shrink: 0;
}

/* Shadow above buttons to indicate they're fixed */
.shadow-\[0_-4px_6px_-1px_rgba\(0\2c 0\2c 0\2c 0\.1\)\] {
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Button styling */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Ensure buttons have minimum touch target size */
.min-h-\[44px\] {
  min-height: 44px;
}

/* Mobile responsive adjustments */
@media (max-width: 640px) {
  /* Reduce padding for mobile */
  .p-4 {
    padding: 0.75rem;
  }
  
  .p-3 {
    padding: 0.5rem;
  }
  
  /* Adjust spacing */
  .space-y-4 > * + * {
    margin-top: 0.75rem;
  }
  
  /* Smaller text on mobile */
  .text-sm {
    font-size: 0.8125rem;
  }
  
  .text-xs {
    font-size: 0.75rem;
  }
  
  /* Adjust table columns for mobile */
  .col-span-7 {
    grid-column: span 6 / span 6;
  }
  
  .col-span-2 {
    grid-column: span 3 / span 3;
  }
  
  /* Make notes section collapsible */
  .hidden {
    display: none;
  }
  
  .block {
    display: block;
  }
  
  /* Ensure buttons stack vertically and are fully visible */
  .flex-col {
    flex-direction: column;
  }
  
  .gap-2 {
    gap: 0.5rem;
  }
  
  /* Increase touch targets */
  button, input, select {
    min-height: 44px;
  }
  
  /* Reduce modal padding on very small screens */
  @media (max-height: 600px) {
    .p-4 {
      padding: 0.5rem;
    }
    
    [style*="max-height: 150px"] {
      max-height: 120px !important;
    }
    
    [style*="max-height: 250px"] {
      max-height: 180px !important;
    }
  }
}

/* Desktop styles */
@media (min-width: 640px) {
  .sm\:block {
    display: block !important;
  }
  
  .sm\:hidden {
    display: none !important;
  }
  
  .sm\:flex-row {
    flex-direction: row;
  }
}

/* Improve touch targets */
button, 
input[type="radio"],
input[type="number"],
select {
  min-height: 44px;
}

/* Line clamping for text */
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

/* Loading animation */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Focus styles */
.focus\:ring-blue-500:focus {
  --tw-ring-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 0 3px var(--tw-ring-color);
}

/* Gradient button hover effect */
.bg-gradient-to-r {
  background-size: 200% 200%;
  transition: background-position 0.3s ease;
}

.bg-gradient-to-r:hover:not(:disabled) {
  background-position: right center;
}

/* Ensure z-index for sticky header */
.sticky {
  z-index: 10;
}

/* Smooth transitions */
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Print styles */
@media print {
  .fixed {
    position: static;
  }
  
  button {
    display: none;
  }
}
</style>