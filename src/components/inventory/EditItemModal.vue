<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-50" @close="closeModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
              <!-- Header -->
              <div class="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <DialogTitle class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ isCreating ? 'إضافة صنف جديد' : 'تعديل الصنف' }}
                  </DialogTitle>
                  <button
                    type="button"
                    class="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @click="closeModal"
                  >
                    <span class="sr-only">إغلاق</span>
                    <XIcon class="h-6 w-6" />
                  </button>
                </div>
              </div>

              <!-- Form -->
              <form @submit.prevent="handleSubmit" class="bg-white dark:bg-gray-800 px-6 py-4 max-h-[80vh] overflow-y-auto">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Name -->
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      اسم الصنف <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      v-model="formData.name"
                      required
                      :disabled="loading"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="أدخل اسم الصنف"
                    />
                  </div>

                  <!-- Code -->
                  <div>
                    <label for="code" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      الكود <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="code"
                      v-model="formData.code"
                      required
                      :disabled="loading || !isCreating"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="أدخل كود الصنف"
                    />
                  </div>

                  <!-- Color -->
                  <div>
                    <label for="color" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      اللون <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="color"
                      v-model="formData.color"
                      required
                      :disabled="loading"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="أدخل اللون"
                    />
                  </div>

                  <!-- Warehouse -->
                  <div>
                    <label for="warehouse" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      المخزن <span class="text-red-500">*</span>
                    </label>
                    <select
                      id="warehouse"
                      v-model="formData.warehouse_id"
                      required
                      :disabled="loading"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="" disabled>اختر المخزن</option>
                      <option 
                        v-for="warehouse in accessibleWarehouses" 
                        :key="warehouse.id" 
                        :value="warehouse.id"
                        class="bg-white dark:bg-gray-700"
                      >
                        {{ warehouse.name_ar }}
                      </option>
                    </select>
                  </div>

                  <!-- Cartons Count -->
                  <div>
                    <label for="cartons_count" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      عدد الكراتين
                    </label>
                    <input
                      type="number"
                      id="cartons_count"
                      v-model.number="formData.cartons_count"
                      min="0"
                      :disabled="loading"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="0"
                    />
                  </div>

                  <!-- Per Carton Count -->
                  <div>
                    <label for="per_carton_count" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      عدد في الكرتونة
                    </label>
                    <input
                      type="number"
                      id="per_carton_count"
                      v-model.number="formData.per_carton_count"
                      min="1"
                      :disabled="loading"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="12"
                    />
                  </div>

                  <!-- Single Bottles Count -->
                  <div>
                    <label for="single_bottles_count" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      عدد القزاز الفردي
                    </label>
                    <input
                      type="number"
                      id="single_bottles_count"
                      v-model.number="formData.single_bottles_count"
                      min="0"
                      :disabled="loading"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="0"
                    />
                  </div>

                  <!-- Total Quantity Display -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      إجمالي الكمية
                    </label>
                    <div class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300">
                      {{ totalQuantity || 0 }} وحدة
                    </div>
                  </div>

                  <!-- Supplier -->
                  <div>
                    <label for="supplier" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      المورد
                    </label>
                    <input
                      type="text"
                      id="supplier"
                      v-model="formData.supplier"
                      :disabled="loading"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="أدخل اسم المورد"
                    />
                  </div>

                  <!-- Item Location -->
                  <div>
                    <label for="item_location" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      مكان الصنف في المخزن
                    </label>
                    <input
                      type="text"
                      id="item_location"
                      v-model="formData.item_location"
                      :disabled="loading"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="مثال: الرف العلوي"
                    />
                  </div>

                  <!-- Photo URL -->
                  <div class="md:col-span-2">
                    <label for="photo_url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      رابط الصورة (اختياري)
                    </label>
                    <input
                      type="url"
                      id="photo_url"
                      v-model="formData.photo_url"
                      :disabled="loading"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <!-- Notes -->
                  <div class="md:col-span-2">
                    <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ملاحظات
                    </label>
                    <textarea
                      id="notes"
                      v-model="formData.notes"
                      rows="3"
                      :disabled="loading"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="أي ملاحظات إضافية..."
                    ></textarea>
                  </div>

                  <!-- Image Preview -->
                  <div v-if="formData.photo_url" class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      معاينة الصورة
                    </label>
                    <div class="mt-1 flex items-center justify-center">
                      <img 
                        :src="formData.photo_url" 
                        alt="Item preview" 
                        class="h-32 w-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                        @error="handleImageError"
                      />
                    </div>
                  </div>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div class="flex items-center">
                    <ExclamationIcon class="h-5 w-5 text-red-400 ml-2" />
                    <p class="text-sm text-red-800 dark:text-red-300">{{ error }}</p>
                  </div>
                </div>

                <!-- Actions -->
                <div class="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 sm:space-x-reverse gap-3">
                  <button
                    type="button"
                    @click="closeModal"
                    :disabled="loading"
                    class="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    إلغاء
                  </button>
                  <button
                    v-if="!isCreating && canDelete"
                    type="button"
                    @click="confirmDelete"
                    :disabled="loading"
                    class="w-full sm:w-auto px-4 py-2 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    حذف
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                  >
                    <span v-if="loading">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري الحفظ...
                    </span>
                    <span v-else>
                      {{ isCreating ? 'إضافة' : 'حفظ التغييرات' }}
                    </span>
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { ref, watch, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import { XIcon, ExclamationIcon } from '@heroicons/vue/outline';

export default {
  name: 'EditItemModal',
  components: {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    XIcon,
    ExclamationIcon
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    item: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'success', 'delete'],
  setup(props, { emit }) {
    const store = useStore();
    const loading = ref(false);
    const error = ref('');

    const formData = reactive({
      name: '',
      code: '',
      color: '',
      warehouse_id: '',
      cartons_count: 0,
      per_carton_count: 12,
      single_bottles_count: 0,
      supplier: '',
      item_location: '',
      photo_url: '',
      notes: ''
    });

    // Check if we're creating a new item
    const isCreating = computed(() => !props.item?.id);

    // Check delete permissions
    const canDelete = computed(() => store.getters.canDelete);

    // Get accessible warehouses based on user role
    const accessibleWarehouses = computed(() => {
      if (store.state.userProfile?.role === 'warehouse_manager') {
        const allowedWarehouses = store.state.userProfile.allowed_warehouses || [];
        if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
          return store.state.warehouses.filter(w => allowedWarehouses.includes(w.id));
        }
      }
      return store.state.warehouses.filter(w => w.type === 'primary');
    });

    // Calculate total quantity
    const totalQuantity = computed(() => {
      return (formData.cartons_count * formData.per_carton_count) + formData.single_bottles_count;
    });

    // Watch for item prop changes
    watch(() => props.item, (newItem) => {
      if (newItem) {
        resetForm();
        Object.assign(formData, {
          name: newItem.name || '',
          code: newItem.code || '',
          color: newItem.color || '',
          warehouse_id: newItem.warehouse_id || '',
          cartons_count: newItem.cartons_count || 0,
          per_carton_count: newItem.per_carton_count || 12,
          single_bottles_count: newItem.single_bottles_count || 0,
          supplier: newItem.supplier || '',
          item_location: newItem.item_location || '',
          photo_url: newItem.photo_url || '',
          notes: newItem.notes || ''
        });
      }
    }, { immediate: true });

    const resetForm = () => {
      Object.assign(formData, {
        name: '',
        code: '',
        color: '',
        warehouse_id: '',
        cartons_count: 0,
        per_carton_count: 12,
        single_bottles_count: 0,
        supplier: '',
        item_location: '',
        photo_url: '',
        notes: ''
      });
      error.value = '';
    };

    const closeModal = () => {
      resetForm();
      emit('close');
    };

    const handleImageError = (event) => {
      console.warn('Image failed to load:', event.target.src);
      // You could set a placeholder image here
      event.target.style.display = 'none';
    };

    const validateForm = () => {
      if (!formData.name.trim()) {
        error.value = 'اسم الصنف مطلوب';
        return false;
      }
      if (!formData.code.trim()) {
        error.value = 'كود الصنف مطلوب';
        return false;
      }
      if (!formData.color.trim()) {
        error.value = 'لون الصنف مطلوب';
        return false;
      }
      if (!formData.warehouse_id) {
        error.value = 'يجب اختيار المخزن';
        return false;
      }
      if (totalQuantity.value < 0) {
        error.value = 'الكمية لا يمكن أن تكون سالبة';
        return false;
      }
      if (formData.photo_url && !isValidUrl(formData.photo_url)) {
        error.value = 'رابط الصورة غير صالح';
        return false;
      }
      return true;
    };

    const isValidUrl = (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    const handleSubmit = async () => {
      if (loading.value || !validateForm()) return;

      loading.value = true;
      error.value = '';

      try {
        if (isCreating.value) {
          // Add new item using atomic action
          const result = await store.dispatch('addInventoryItemAtomic', {
            itemData: {
              ...formData,
              cartons_count: Number(formData.cartons_count) || 0,
              per_carton_count: Number(formData.per_carton_count) || 12,
              single_bottles_count: Number(formData.single_bottles_count) || 0
            },
            userId: store.state.user?.uid
          });

          if (result && (result.type === 'created' || result.type === 'updated')) {
            emit('success', {
              type: 'created',
              message: `تم ${result.type === 'created' ? 'إضافة' : 'تحديث'} الصنف "${formData.name}" بنجاح`
            });
            closeModal();
          }
        } else {
          // Update existing item
          const updateData = {
            id: props.item.id,
            itemData: {
              ...formData,
              cartons_count: Number(formData.cartons_count) || 0,
              per_carton_count: Number(formData.per_carton_count) || 12,
              single_bottles_count: Number(formData.single_bottles_count) || 0,
              total_added: props.item.total_added // Keep original total_added
            }
          };

          const result = await store.dispatch('updateItem', updateData);

          if (result && result.success) {
            emit('success', {
              type: 'updated',
              message: `تم تحديث الصنف "${formData.name}" بنجاح`
            });
            closeModal();
          } else {
            error.value = result?.error || 'حدث خطأ أثناء تحديث الصنف';
          }
        }
      } catch (err) {
        console.error('Error saving item:', err);
        error.value = err.message || 'حدث خطأ غير متوقع أثناء حفظ الصنف';
      } finally {
        loading.value = false;
      }
    };

    const confirmDelete = () => {
      if (!props.item?.id || !canDelete.value) return;

      const confirmMessage = `هل أنت متأكد من حذف الصنف "${props.item.name}"؟\nهذا الإجراء لا يمكن التراجع عنه.`;

      if (window.confirm(confirmMessage)) {
        emit('delete', props.item.id);
        closeModal();
      }
    };

    // Initialize warehouses if not loaded
    onMounted(() => {
      if (store.state.warehouses.length === 0) {
        store.dispatch('loadWarehouses');
      }
    });

    return {
      formData,
      loading,
      error,
      isCreating,
      canDelete,
      accessibleWarehouses,
      totalQuantity,
      closeModal,
      handleSubmit,
      confirmDelete,
      handleImageError
    };
  }
};
</script>

<style scoped>
/* Custom scrollbar for dark mode */
.dark ::-webkit-scrollbar {
  width: 8px;
}

.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Smooth transitions */
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Focus styles */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800;
}

/* Disabled state */
.disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* Animation for loading spinner */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Gradient button hover effect */
.bg-gradient-to-r {
  background-size: 200% 200%;
  background-position: 100% 0;
  transition: background-position 0.5s ease;
}

.bg-gradient-to-r:hover {
  background-position: 0 100%;
}
</style>
