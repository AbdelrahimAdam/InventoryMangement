<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg w-full max-w-md rtl">
      <div class="p-6">
        <!-- Icon -->
        <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full" :class="iconClass">
          <svg class="w-6 h-6" :class="iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="variant === 'danger'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <!-- Content -->
        <h3 class="text-lg font-medium text-gray-900 text-center mb-2">{{ title }}</h3>
        <p class="text-sm text-gray-500 text-center mb-6">{{ message }}</p>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            @click="$emit('cancel')"
            class="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            {{ cancelText }}
          </button>
          <button
            @click="$emit('confirm')"
            :class="confirmButtonClass"
            class="flex-1 py-2 px-4 rounded-md text-white hover:opacity-90 transition-colors duration-200 font-medium"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'ConfirmModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: 'تأكيد الإجراء'
    },
    message: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: 'تأكيد'
    },
    cancelText: {
      type: String,
      default: 'إلغاء'
    },
    variant: {
      type: String,
      default: 'default', // 'default' or 'danger'
      validator: (value) => ['default', 'danger'].includes(value)
    }
  },
  emits: ['confirm', 'cancel'],
  setup(props) {
    const iconClass = computed(() => {
      return props.variant === 'danger' 
        ? 'bg-red-100' 
        : 'bg-blue-100';
    });

    const iconColor = computed(() => {
      return props.variant === 'danger' 
        ? 'text-red-600' 
        : 'text-blue-600';
    });

    const confirmButtonClass = computed(() => {
      return props.variant === 'danger' 
        ? 'bg-red-600' 
        : 'bg-blue-600';
    });

    return {
      iconClass,
      iconColor,
      confirmButtonClass
    };
  }
};
</script>