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
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
            <DialogPanel class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <!-- Header -->
              <div class="bg-white px-6 py-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <DialogTitle class="text-lg font-semibold text-gray-900">تعديل الصنف</DialogTitle>
                  <button
                    type="button"
                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    @click="closeModal"
                  >
                    <span class="sr-only">إغلاق</span>
                    <XIcon class="h-6 w-6" />
                  </button>
                </div>
              </div>

              <!-- Form -->
              <form @submit.prevent="handleSubmit" class="bg-white px-6 py-4">
                <div class="space-y-4">
                  <!-- Name -->
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">اسم الصنف</label>
                    <input
                      type="text"
                      id="name"
                      v-model="formData.name"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="أدخل اسم الصنف"
                    />
                  </div>

                  <!-- Code -->
                  <div>
                    <label for="code" class="block text-sm font-medium text-gray-700 mb-1">الكود</label>
                    <input
                      type="text"
                      id="code"
                      v-model="formData.code"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="أدخل كود الصنف"
                    />
                  </div>

                  <!-- Color -->
                  <div>
                    <label for="color" class="block text-sm font-medium text-gray-700 mb-1">اللون</label>
                    <input
                      type="text"
                      id="color"
                      v-model="formData.color"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="أدخل اللون"
                    />
                  </div>

                  <!-- Quantity -->
                  <div>
                    <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1">الكمية</label>
                    <input
                      type="number"
                      id="quantity"
                      v-model="formData.quantity"
                      required
                      min="0"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="أدخل الكمية"
                    />
                  </div>

                  <!-- Price -->
                  <div>
                    <label for="price" class="block text-sm font-medium text-gray-700 mb-1">السعر</label>
                    <input
                      type="number"
                      id="price"
                      v-model="formData.price"
                      required
                      min="0"
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="أدخل السعر"
                    />
                  </div>

                  <!-- Warehouse -->
                  <div>
                    <label for="warehouse" class="block text-sm font-medium text-gray-700 mb-1">المخزن</label>
                    <select
                      id="warehouse"
                      v-model="formData.warehouse_id"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    >
                      <option value="">اختر المخزن</option>
                      <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
                        {{ warehouse.name_ar }}
                      </option>
                    </select>
                  </div>

                  <!-- Description -->
                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                    <textarea
                      id="description"
                      v-model="formData.description"
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="أدخل وصف الصنف"
                    ></textarea>
                  </div>
                </div>

                <!-- Actions -->
                <div class="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 sm:space-x-reverse gap-3">
                  <button
                    type="button"
                    @click="closeModal"
                    class="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                  >
                    <span v-if="loading">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    حفظ التغييرات
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
import { ref, watch, reactive } from 'vue';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import { XIcon } from '@heroicons/vue/outline';
import { useStore } from 'vuex';

export default {
  name: 'EditItemModal',
  components: {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    XIcon
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
  emits: ['close', 'success'],
  setup(props, { emit }) {
    const store = useStore();
    const loading = ref(false);

    const formData = reactive({
      name: '',
      code: '',
      color: '',
      quantity: 0,
      price: 0,
      warehouse_id: '',
      description: ''
    });

    const warehouses = ref([]);

    // Watch for item prop changes
    watch(() => props.item, (newItem) => {
      if (newItem) {
        Object.assign(formData, {
          name: newItem.name || '',
          code: newItem.code || '',
          color: newItem.color || '',
          quantity: newItem.quantity || 0,
          price: newItem.price || 0,
          warehouse_id: newItem.warehouse_id || '',
          description: newItem.description || ''
        });
      }
    }, { immediate: true });

    // Fetch warehouses
    const fetchWarehouses = async () => {
      try {
        warehouses.value = await store.dispatch('fetchWarehouses');
      } catch (error) {
        console.error('Error fetching warehouses:', error);
      }
    };

    fetchWarehouses();

    const closeModal = () => {
      emit('close');
    };

    const handleSubmit = async () => {
      if (loading.value) return;

      loading.value = true;
      try {
        await store.dispatch('updateInventoryItem', {
          id: props.item.id,
          ...formData
        });
        
        emit('success');
        closeModal();
      } catch (error) {
        console.error('Error updating item:', error);
        // You can add toast notification here
      } finally {
        loading.value = false;
      }
    };

    return {
      formData,
      loading,
      warehouses,
      closeModal,
      handleSubmit
    };
  }
};
</script>