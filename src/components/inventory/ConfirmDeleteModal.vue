<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>

    <div class="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">تأكيد الحذف</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">سيتم حذف الصنف نهائياً</p>
          </div>
        </div>

        <!-- Item Details -->
        <div class="mb-6">
          <p class="text-gray-700 dark:text-gray-300 mb-3">
            هل أنت متأكد من حذف الصنف:
          </p>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
            <div class="flex items-center gap-3 mb-2">
              <div v-if="item?.photo_url" class="w-10 h-10 rounded overflow-hidden border border-gray-200 dark:border-gray-600">
                <img :src="item.photo_url" :alt="item?.name" class="w-full h-full object-cover">
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-medium text-gray-900 dark:text-white truncate">{{ item?.name }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ item?.code }} - {{ item?.color }}</p>
              </div>
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>المخزن: {{ warehouseLabel }}</p>
              <p>الكمية المتبقية: {{ item?.remaining_quantity }}</p>
              <p>آخر تحديث بواسطة: {{ lastActionUser }}</p>
            </div>
          </div>
          <p class="text-sm text-red-600 dark:text-red-400 mt-3">
            ⚠️ هذا الإجراء لا يمكن التراجع عنه.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button
            @click="$emit('confirm')"
            :disabled="loading"
            class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span>{{ loading ? 'جاري الحذف...' : 'نعم، احذف' }}</span>
          </button>
          <button
            @click="$emit('close')"
            :disabled="loading"
            class="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2.5 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'ConfirmDeleteModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    item: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    warehouseLabel: {
      type: Function,
      default: () => 'غير معروف'
    },
    getLastActionUser: {
      type: Function,
      default: () => 'غير معروف'
    }
  },
  emits: ['confirm', 'close'],
  setup(props) {
    const lastActionUser = computed(() => {
      if (!props.item) return 'غير معروف';
      return props.getLastActionUser(props.item);
    });

    return {
      lastActionUser
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

.bg-black\/50 {
  background-color: rgba(0, 0, 0, 0.5);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

@media (max-width: 768px) {
  .p-4 {
    padding: 1rem;
  }
  
  .p-6 {
    padding: 1.5rem;
  }
  
  button {
    min-height: 44px;
  }
}
</style>
