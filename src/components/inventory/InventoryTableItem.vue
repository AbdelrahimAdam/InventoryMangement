<template>
  <div 
    class="group bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 transition-all duration-200 hover:shadow-md hover:border-yellow-300 dark:hover:border-yellow-700"
  >
    <div class="grid grid-cols-12 gap-2 items-center">
      <!-- Item Name -->
      <div class="col-span-4">
        <div class="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">{{ item.name }}</div>
        <div v-if="item.supplier && item.supplier !== '-'" class="text-xs text-gray-600 dark:text-gray-400 truncate mt-0.5">
          {{ item.supplier }}
        </div>
      </div>
      
      <!-- Code -->
      <div class="col-span-2">
        <div class="text-xs lg:text-sm text-gray-700 dark:text-gray-300 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg inline-block">
          {{ item.code }}
        </div>
      </div>
      
      <!-- Color -->
      <div class="col-span-2">
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: item.color }" v-if="item.color && item.color !== '-'"></div>
          <span class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ item.color }}</span>
        </div>
      </div>
      
      <!-- Warehouse -->
      <div class="col-span-2">
        <span class="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300">
          {{ getWarehouseName(item.warehouse_id) }}
        </span>
      </div>
      
      <!-- Quantity -->
      <div class="col-span-1">
        <span :class="[
          'text-sm font-bold px-2 py-1 rounded-lg',
          item.remaining_quantity < 10 ? 'bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 text-red-700 dark:text-red-300' :
          item.remaining_quantity < 50 ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 text-yellow-700 dark:text-yellow-300' :
          'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 text-green-700 dark:text-green-300'
        ]">
          {{ formatNumber(item.remaining_quantity) }}
        </span>
      </div>
      
      <!-- Actions -->
      <div class="col-span-1">
        <div class="flex items-center justify-center space-x-1 space-x-reverse">
          <button 
            v-if="canModifyItems"
            @click="handleTransfer"
            class="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors duration-200"
            title="نقل"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
          </button>
          
          <button 
            v-if="canModifyItems"
            @click="handleDispatch"
            class="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 transition-colors duration-200"
            title="صرف"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Additional Details (shown on hover) -->
    <div class="mt-2 pt-2 border-t border-gray-100 dark:border-gray-600 hidden group-hover:block transition-all duration-200">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-gray-600 dark:text-gray-400">
        <div>
          <span class="font-medium">الكراتين:</span>
          <span class="mr-1">{{ item.cartons_count }}</span>
        </div>
        <div>
          <span class="font-medium">في الكرتونة:</span>
          <span class="mr-1">{{ item.per_carton_count }}</span>
        </div>
        <div>
          <span class="font-medium">الفردي:</span>
          <span class="mr-1">{{ item.single_bottles_count }}</span>
        </div>
        <div>
          <span class="font-medium">آخر تحديث:</span>
          <span class="mr-1">{{ formatDate(item.updated_at) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InventoryTableItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    warehouses: {
      type: Array,
      default: () => []
    },
    canModifyItems: {
      type: Boolean,
      default: false
    }
  },
  emits: ['transfer', 'dispatch'],
  setup(props, { emit }) {
    const formatNumber = (num) => {
      if (isNaN(num) || num === null || num === undefined) return '0';
      return new Intl.NumberFormat('ar-EG').format(num);
    };
    
    const formatDate = (dateString) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch {
        return 'غير معروف';
      }
    };
    
    const getWarehouseName = (warehouseId) => {
      const warehouse = props.warehouses.find(w => w.id === warehouseId);
      return warehouse?.name_ar || 'غير محدد';
    };
    
    const handleTransfer = () => {
      emit('transfer', props.item);
    };
    
    const handleDispatch = () => {
      emit('dispatch', props.item);
    };
    
    return {
      formatNumber,
      formatDate,
      getWarehouseName,
      handleTransfer,
      handleDispatch
    };
  }
});
</script>
