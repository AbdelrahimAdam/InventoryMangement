<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl rtl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">صرف أصناف للفروع</h3>
            <p class="text-sm text-gray-500 mt-1">اختر الصنف من القائمة وأدخل كمية الصرف</p>
          </div>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
        <!-- Step 1: Warehouse Selection -->
        <div>
          <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <span class="h-6 w-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs ml-2">1</span>
            اختر المخزن المصدر
          </h4>
          <select
            v-model="form.sourceWarehouse"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            @change="onWarehouseChange"
          >
            <option value="">اختر المخزن المصدر</option>
            <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
              {{ warehouse.name_ar }}
            </option>
          </select>
        </div>

        <!-- Step 2: Destination Selection -->
        <div>
          <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <span class="h-6 w-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs ml-2">2</span>
            اختر الفرع المستلم
          </h4>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="destination in destinations"
              :key="destination.id"
              @click="form.destinationBranch = destination.id"
              :class="[
                'p-3 border rounded-lg text-sm transition-all duration-200',
                form.destinationBranch === destination.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ destination.name_ar }}
            </button>
          </div>
        </div>

        <!-- Step 3: Item Selection -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-medium text-gray-700 flex items-center">
              <span class="h-6 w-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs ml-2">3</span>
              اختر الصنف المراد صرفه
            </h4>
            <div class="text-xs text-gray-500">
              {{ filteredItems.length }} صنف متاح
            </div>
          </div>

          <!-- Search Input -->
          <div class="relative mb-4">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="ابحث عن صنف بالاسم أو الكود..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Items Table -->
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <!-- Table Header -->
            <div class="grid grid-cols-12 bg-gray-50 text-xs font-medium text-gray-600 border-b border-gray-200">
              <div class="col-span-5 p-3">الصنف</div>
              <div class="col-span-2 p-3 text-center">الكود</div>
              <div class="col-span-2 p-3 text-center">المتاح</div>
              <div class="col-span-3 p-3 text-center">الإجراء</div>
            </div>

            <!-- Table Body -->
            <div class="max-h-60 overflow-y-auto">
              <div
                v-for="item in filteredItems"
                :key="item.id"
                :class="[
                  'grid grid-cols-12 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150',
                  selectedItem?.id === item.id ? 'bg-blue-50 border-blue-200' : ''
                ]"
              >
                <!-- Item Name and Details -->
                <div class="col-span-5 p-3">
                  <div class="font-medium text-sm text-gray-900">{{ item.الاسم || item.name }}</div>
                  <div class="text-xs text-gray-500 mt-1">
                    <span v-if="item.اللون || item.color" class="ml-2">{{ item.اللون || item.color }}</span>
                    <span v-if="item.المورد || item.supplier" class="text-gray-400">المورد: {{ item.المورد || item.supplier }}</span>
                  </div>
                </div>

                <!-- Item Code -->
                <div class="col-span-2 p-3 text-center">
                  <span class="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">{{ item.الكود || item.code }}</span>
                </div>

                <!-- Available Quantity -->
                <div class="col-span-2 p-3 text-center">
                  <span :class="[
                    'text-sm font-medium',
                    getStockClass(item.الكميه_المتبقيه || item.remaining_quantity)
                  ]">
                    {{ item.الكميه_المتبقيه || item.remaining_quantity }}
                  </span>
                </div>

                <!-- Action Button -->
                <div class="col-span-3 p-3 text-center">
                  <button
                    @click="selectItem(item)"
                    :class="[
                      'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-200',
                      selectedItem?.id === item.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    ]"
                  >
                    {{ selectedItem?.id === item.id ? 'محدد' : 'اختر' }}
                  </button>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="filteredItems.length === 0" class="p-8 text-center">
                <svg class="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
                </svg>
                <p class="text-sm text-gray-500 mt-2">لا توجد أصناف مطابقة للبحث</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Item Details -->
        <div v-if="selectedItem" class="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div class="flex items-center justify-between mb-3">
            <h5 class="text-sm font-medium text-blue-800">الصنف المحدد</h5>
            <button
              @click="clearSelection"
              class="text-xs text-blue-600 hover:text-blue-800"
            >
              إلغاء التحديد
            </button>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <div class="text-xs text-blue-600">الاسم</div>
              <div class="text-sm font-medium text-blue-900">{{ selectedItem.الاسم || selectedItem.name }}</div>
            </div>
            <div>
              <div class="text-xs text-blue-600">الكود</div>
              <div class="text-sm font-medium text-blue-900">{{ selectedItem.الكود || selectedItem.code }}</div>
            </div>
            <div>
              <div class="text-xs text-blue-600">المخزن الحالي</div>
              <div class="text-sm font-medium text-blue-900">{{ getWarehouseName(selectedItem.المخزن_id || selectedItem.warehouse_id) }}</div>
            </div>
            <div>
              <div class="text-xs text-blue-600">الكمية المتاحة</div>
              <div class="text-sm font-medium" :class="getStockClass(selectedItem.الكميه_المتبقيه || selectedItem.remaining_quantity)">
                {{ selectedItem.الكميه_المتبقيه || selectedItem.remaining_quantity }}
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Quantity and Details -->
        <div v-if="selectedItem">
          <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <span class="h-6 w-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs ml-2">4</span>
            أدخل تفاصيل الصرف
          </h4>

          <div class="space-y-4">
            <!-- Quantity Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                الكمية المراد صرفها
                <span class="text-xs font-normal text-gray-500">
                  (الحد الأقصى: {{ selectedItem.الكميه_المتبقيه || selectedItem.remaining_quantity }})
                </span>
              </label>
              <div class="flex items-center space-x-3 space-x-reverse">
                <button
                  @click="decreaseQuantity"
                  :disabled="form.quantity <= 1"
                  class="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                  </svg>
                </button>
                <input
                  v-model.number="form.quantity"
                  type="number"
                  :max="selectedItem.الكميه_المتبقيه || selectedItem.remaining_quantity"
                  min="1"
                  required
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-medium"
                >
                <button
                  @click="increaseQuantity"
                  :disabled="form.quantity >= (selectedItem.الكميه_المتبقيه || selectedItem.remaining_quantity)"
                  class="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </button>
              </div>
              <div class="flex items-center justify-between mt-2">
                <span class="text-xs text-gray-500">
                  سيتبقى بعد الصرف: {{ (selectedItem.الكميه_المتبقيه || selectedItem.remaining_quantity) - form.quantity }}
                </span>
                <button
                  @click="form.quantity = selectedItem.الكميه_المتبقيه || selectedItem.remaining_quantity"
                  class="text-xs text-blue-600 hover:text-blue-800"
                >
                  استخدام الكل
                </button>
              </div>
            </div>

            <!-- Priority Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">أولوية الصرف</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="priorityOption in priorityOptions"
                  :key="priorityOption.value"
                  @click="form.priority = priorityOption.value"
                  :class="[
                    'p-3 border rounded-lg text-sm transition-all duration-200 flex items-center justify-center space-x-2 space-x-reverse',
                    form.priority === priorityOption.value
                      ? priorityOption.borderClass + ' ' + priorityOption.bgClass + ' ' + priorityOption.textClass
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                  ]"
                >
                  <span :class="priorityOption.iconClass">{{ priorityOption.icon }}</span>
                  <span>{{ priorityOption.label }}</span>
                </button>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ملاحظات</label>
              <textarea
                v-model="form.notes"
                rows="2"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="أضف أي ملاحظات حول عملية الصرف..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-red-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Fixed Footer -->
      <div class="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
        <div class="flex space-x-3 space-x-reverse">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            إلغاء
          </button>
          <button
            type="submit"
            @click="handleSubmit"
            :disabled="loading || !selectedItem || !form.destinationBranch || !form.sourceWarehouse || form.quantity > (selectedItem?.الكميه_المتبقيه || selectedItem?.remaining_quantity || 0)"
            class="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            <svg v-if="loading" class="animate-spin h-4 w-4 ml-2 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span>{{ loading ? 'جاري الصرف...' : 'تأكيد الصرف' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'DispatchModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'success'],
  setup(props, { emit }) {
    const store = useStore()
    
    const loading = ref(false)
    const error = ref('')
    const selectedItem = ref(null)
    const searchTerm = ref('')
    
    const form = reactive({
      sourceWarehouse: '',
      destinationBranch: '',
      quantity: 1,
      notes: '',
      priority: 'normal'
    })

    // Constants
    const destinations = [
      { id: 'مصنع البران', name_ar: 'مصنع البران', icon: '🏭' },
      { id: 'مخزن الزهراء', name_ar: 'مخزن الزهراء', icon: '🏪' }
    ]

    const priorityOptions = [
      { 
        value: 'normal', 
        label: 'عادية', 
        icon: '⏱️',
        bgClass: 'bg-blue-50',
        borderClass: 'border-blue-300',
        textClass: 'text-blue-700',
        iconClass: 'text-blue-500'
      },
      { 
        value: 'high', 
        label: 'عالية', 
        icon: '⚠️',
        bgClass: 'bg-orange-50',
        borderClass: 'border-orange-300',
        textClass: 'text-orange-700',
        iconClass: 'text-orange-500'
      },
      { 
        value: 'urgent', 
        label: 'عاجلة', 
        icon: '🚨',
        bgClass: 'bg-red-50',
        borderClass: 'border-red-300',
        textClass: 'text-red-700',
        iconClass: 'text-red-500'
      }
    ]

    // Computed properties
    const warehouses = computed(() => store.state.warehouses || [])
    const inventory = computed(() => store.state.inventory || [])
    
    const availableItems = computed(() => {
      if (!form.sourceWarehouse) {
        return []
      }
      return inventory.value.filter(item => 
        (item.المخزن_id || item.warehouse_id) === form.sourceWarehouse && 
        (item.الكميه_المتبقيه || item.remaining_quantity) > 0
      )
    })

    const filteredItems = computed(() => {
      if (!searchTerm.value.trim()) {
        return availableItems.value
      }
      
      const term = searchTerm.value.toLowerCase().trim()
      return availableItems.value.filter(item => {
        const name = (item.الاسم || item.name || '').toLowerCase()
        const code = (item.الكود || item.code || '').toLowerCase()
        const color = (item.اللون || item.color || '').toLowerCase()
        const supplier = (item.المورد || item.supplier || '').toLowerCase()
        
        return name.includes(term) || 
               code.includes(term) || 
               color.includes(term) ||
               supplier.includes(term)
      })
    })

    // Helper functions
    const getWarehouseName = (warehouseId) => {
      const warehouse = warehouses.value.find(w => w.id === warehouseId)
      return warehouse ? warehouse.name_ar : warehouseId
    }

    const getStockClass = (quantity) => {
      if (quantity === 0) return 'text-red-600'
      if (quantity < 10) return 'text-yellow-600'
      return 'text-green-600'
    }

    // Methods
    const resetForm = () => {
      Object.assign(form, {
        sourceWarehouse: '',
        destinationBranch: '',
        quantity: 1,
        notes: '',
        priority: 'normal'
      })
      selectedItem.value = null
      error.value = ''
      searchTerm.value = ''
    }

    const selectItem = (item) => {
      if (selectedItem.value?.id === item.id) {
        selectedItem.value = null
      } else {
        selectedItem.value = item
        form.quantity = 1
      }
    }

    const clearSelection = () => {
      selectedItem.value = null
    }

    const onWarehouseChange = () => {
      selectedItem.value = null
      searchTerm.value = ''
    }

    const increaseQuantity = () => {
      const max = selectedItem.value?.الكميه_المتبقيه || selectedItem.value?.remaining_quantity || 0
      if (form.quantity < max) {
        form.quantity++
      }
    }

    const decreaseQuantity = () => {
      if (form.quantity > 1) {
        form.quantity--
      }
    }

    // Watch for prop changes
    watch(() => props.isOpen, (newVal) => {
      if (newVal) {
        resetForm()
        if (props.item) {
          selectItem(props.item)
          form.sourceWarehouse = props.item.المخزن_id || props.item.warehouse_id
        }
      }
    })

    watch(() => props.item, (newItem) => {
      if (newItem && props.isOpen) {
        selectItem(newItem)
        form.sourceWarehouse = newItem.المخزن_id || newItem.warehouse_id
      }
    })

    // Watch quantity changes
    watch(() => form.quantity, (newQuantity) => {
      if (selectedItem.value) {
        const max = selectedItem.value.الكميه_المتبقيه || selectedItem.value.remaining_quantity || 0
        if (newQuantity > max) {
          form.quantity = max
        } else if (newQuantity < 1) {
          form.quantity = 1
        }
      }
    })

    const handleSubmit = async () => {
      // Validation
      if (!form.sourceWarehouse) {
        error.value = 'يرجى اختيار المخزن المصدر'
        return
      }

      if (!form.destinationBranch) {
        error.value = 'يرجى اختيار الفرع المستلم'
        return
      }

      if (!selectedItem.value) {
        error.value = 'يرجى اختيار صنف للصرف'
        return
      }

      if (!form.quantity || form.quantity <= 0) {
        error.value = 'يرجى إدخال كمية صحيحة'
        return
      }

      const maxQuantity = selectedItem.value.الكميه_المتبقيه || selectedItem.value.remaining_quantity || 0
      if (form.quantity > maxQuantity) {
        error.value = `الكمية المطلوبة (${form.quantity}) تتجاوز الكمية المتاحة (${maxQuantity})`
        return
      }

      loading.value = true
      error.value = ''

      try {
        // Prepare dispatch data
        const dispatchData = {
          item_id: selectedItem.value.id,
          from_warehouse: form.sourceWarehouse,
          to_destination: form.destinationBranch,
          quantity: form.quantity,
          cartons: 0, // You might want to calculate this based on your business logic
          single_bottles: form.quantity, // Adjust based on your needs
          notes: form.notes,
          priority: form.priority
        }

        console.log('Dispatching item with data:', dispatchData)

        // Use the store dispatch action
        const result = await store.dispatch('dispatchItem', dispatchData)

        if (result?.success) {
          // Show success message
          console.log('Dispatch completed successfully:', result)
          
          // Reset form after successful dispatch
          resetForm()
          
          // Emit success and close
          emit('success', result)
          setTimeout(() => {
            emit('close')
          }, 500)
        } else {
          throw new Error('فشل في عملية الصرف')
        }
        
      } catch (err) {
        console.error('Error creating dispatch:', err)
        error.value = err.message || 'فشل في عملية الصرف. يرجى المحاولة مرة أخرى.'
      } finally {
        loading.value = false
      }
    }

    return {
      // State
      form,
      loading,
      error,
      selectedItem,
      searchTerm,
      
      // Computed
      warehouses,
      destinations,
      priorityOptions,
      availableItems,
      filteredItems,
      
      // Methods
      selectItem,
      clearSelection,
      onWarehouseChange,
      increaseQuantity,
      decreaseQuantity,
      getWarehouseName,
      getStockClass,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.rtl {
  direction: rtl;
}

.space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

/* Custom scrollbar */
.max-h-60::-webkit-scrollbar {
  width: 6px;
}

.max-h-60::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.max-h-60::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.max-h-60::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Ensure consistent heights */
.max-h-\[90vh\] {
  max-height: 90vh;
}

.max-h-\[calc\(90vh-180px\)\] {
  max-height: calc(90vh - 180px);
}

/* Smooth transitions */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}
</style>   