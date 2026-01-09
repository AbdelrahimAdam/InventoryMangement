<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
    
    <div class="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-hidden">
      <!-- Close Button -->
      <button 
        @click="$emit('close')"
        class="absolute top-4 left-4 z-10 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-110 active:scale-95 transition-all duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <!-- Modal Content -->
      <div class="h-full overflow-y-auto p-4 md:p-6">
        <div v-if="item" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Left Column: Image & Basic Info -->
          <div class="space-y-6">
            <!-- Item Image -->
            <div class="relative h-64 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <img 
                v-if="item.photo_url"
                :src="item.photo_url" 
                :alt="item.name"
                class="w-full h-full object-cover"
                @error="handleImageError"
              >
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>

              <!-- Status Badge -->
              <div class="absolute top-4 right-4">
                <span :class="getStockStatusClass(item.remaining_quantity || 0)" 
                  class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-md">
                  {{ getStockStatus(item.remaining_quantity || 0) }}
                </span>
              </div>
            </div>

            <!-- Basic Information -->
            <div class="space-y-4">
              <div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ item.name }}</h2>
                <div class="flex items-center gap-3 mt-2">
                  <span class="text-sm font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-lg">
                    {{ item.code }}
                  </span>
                  <span v-if="item.color" class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div class="w-4 h-4 rounded-full border border-gray-300" 
                      :style="{ backgroundColor: getColorHex(item.color) }"></div>
                    {{ item.color }}
                  </span>
                </div>
              </div>

              <!-- Quick Stats -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">المخزن</p>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ warehouseLabel }}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">الكمية الحالية</p>
                  <p :class="getQuantityClass(item.remaining_quantity || 0)" class="text-2xl font-bold">
                    {{ item.remaining_quantity }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Detailed Information -->
          <div class="space-y-6">
            <!-- Details Grid -->
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">المورد</p>
                <p class="text-gray-900 dark:text-white font-medium">{{ item.supplier || 'غير محدد' }}</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">مكان التخزين</p>
                <p class="text-gray-900 dark:text-white font-medium">{{ item.item_location || 'غير محدد' }}</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">الكراتين</p>
                <p class="text-gray-900 dark:text-white font-medium">{{ item.cartons_count || 0 }}</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">في الكرتونة</p>
                <p class="text-gray-900 dark:text-white font-medium">{{ item.per_carton_count || 0 }}</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">الفردي</p>
                <p class="text-gray-900 dark:text-white font-medium">{{ item.single_bottles_count || 0 }}</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">المجموع المضاف</p>
                <p class="text-gray-900 dark:text-white font-medium">{{ item.total_added || 0 }}</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">أنشئ بواسطة</p>
                <p class="text-gray-900 dark:text-white font-medium">{{ item.created_by_name || 'غير معروف' }}</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">آخر تحديث بواسطة</p>
                <p class="text-gray-900 dark:text-white font-medium">{{ item.updated_by_name || item.created_by_name || 'غير معروف' }}</p>
              </div>
            </div>

            <!-- Last Update Info -->
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">تاريخ الإنشاء</p>
                  <p class="text-gray-900 dark:text-white font-medium">{{ formatDate(item.created_at) }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">آخر تحديث</p>
                  <p class="text-gray-900 dark:text-white font-medium">{{ formatDate(item.updated_at) }}</p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div v-if="showActions" class="grid grid-cols-2 gap-3">
              <button 
                v-if="canEditItem"
                @click="$emit('edit', item)"
                class="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                تعديل
              </button>

              <button 
                v-if="canTransferItem"
                @click="$emit('transfer', item)"
                class="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                </svg>
                نقل
              </button>

              <button 
                v-if="canDispatchItem"
                @click="$emit('dispatch', item)"
                class="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                صرف
              </button>

              <button 
                v-if="canDeleteItem"
                @click="$emit('delete', item)"
                class="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                حذف
              </button>
            </div>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-else class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mb-4"></div>
          <p class="text-gray-600 dark:text-gray-400">جاري تحميل التفاصيل...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'ItemDetailsModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    item: {
      type: Object,
      default: null
    },
    canEditItem: {
      type: Boolean,
      default: false
    },
    canTransferItem: {
      type: Boolean,
      default: false
    },
    canDispatchItem: {
      type: Boolean,
      default: false
    },
    canDeleteItem: {
      type: Boolean,
      default: false
    },
    warehouseLabel: {
      type: Function,
      default: () => 'غير معروف'
    }
  },
  emits: ['close', 'edit', 'transfer', 'dispatch', 'delete'],
  setup(props) {
    // Color mapping
    const colorMap = {
      'أحمر': '#ef4444',
      'أزرق': '#3b82f6',
      'أخضر': '#10b981',
      'أصفر': '#f59e0b',
      'أسود': '#000000',
      'أبيض': '#ffffff',
      'رمادي': '#6b7280',
      'بني': '#92400e',
      'وردي': '#ec4899',
      'برتقالي': '#f97316',
      'بنفسجي': '#8b5cf6',
      'ذهبي': '#d97706',
      'فضي': '#9ca3af'
    };
    
    const getStockStatus = (quantity) => {
      if (quantity === 0) return 'نفذ';
      if (quantity < 10) return 'قليل';
      return 'متوفر';
    };
    
    const getStockStatusClass = (quantity) => {
      if (quantity === 0) return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800 shadow-sm';
      if (quantity < 10) return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-800 shadow-sm';
      return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800 shadow-sm';
    };

    const getQuantityClass = (quantity) => {
      if (quantity === 0) return 'text-red-600 dark:text-red-400';
      if (quantity < 10) return 'text-orange-600 dark:text-orange-400';
      return 'text-green-600 dark:text-green-400';
    };
    
    const getColorHex = (colorName) => {
      return colorMap[colorName] || '#6b7280';
    };
    
    const formatDate = (date) => {
      if (!date) return '-';
      try {
        const dateObj = date.toDate ? date.toDate() : new Date(date);
        if (isNaN(dateObj.getTime())) return '-';
        
        return dateObj.toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return '-';
      }
    };
    
    const handleImageError = (event) => {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMTZMNC42ODYgMTUuMzE0QzQuODgyIDExLjUwNyA4LjA5MyA5IDEyIDlDMTUuOTA3IDkgMTkuMTE4IDExLjUwNyAxOS4zMTQgMTUuMzE0TDIwIDE2TTggMjFIMTZNNSAxNEgxOU0xMiAxN0MxMiAxNy41NTIyOCAxMS41NTIzIDE4IDExIDE4QzEwLjQ0NzcgMTggMTAgMTcuNTUyMyAxMCAxN0MxMCAxNi40NDc3IDEwLjQ0NzcgMTYgMTEgMTZDMTEuNTUyMyAxNiAxMiAxNi40NDc3IDEyIDE3WiIgc3Ryb2tlPSI2QjcyOEQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
    };
    
    const showActions = computed(() => {
      return props.canEditItem || props.canTransferItem || props.canDispatchItem || props.canDeleteItem;
    });

    return {
      getStockStatus,
      getStockStatusClass,
      getQuantityClass,
      getColorHex,
      formatDate,
      handleImageError,
      showActions
    };
  }
};
</script>

<style scoped>
.fixed {
  isolation: isolate;
}

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

.transition-colors {
  transition-property: background-color, border-color, color;
  transition-duration: 200ms;
}

.transition-all {
  transition-property: all;
  transition-duration: 200ms;
}

.bg-black\/50 {
  background-color: rgba(0, 0, 0, 0.5);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

.hover\:scale-110:hover {
  transform: scale(1.1);
}

.active\:scale-95:active {
  transform: scale(0.95);
}

.max-h-\[90vh\] {
  max-height: 90vh;
}

@media (max-width: 768px) {
  .p-4 {
    padding: 1rem;
  }
  
  .md\:p-6 {
    padding: 1.5rem;
  }
  
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  button {
    min-height: 44px;
  }
}
</style>