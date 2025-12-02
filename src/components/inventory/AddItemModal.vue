<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <h2 class="modal-title">إضافة صنف جديد</h2>
        <button 
          @click="closeModal"
          class="modal-close-btn"
        >
          <svg class="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Scrollable Content -->
      <div class="modal-body">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Name Field -->
          <div class="form-group">
            <label class="form-label">
              الاسم <span class="required-star">*</span>
            </label>
            <input
              type="text"
              required
              v-model="formData.name"
              class="form-input"
              placeholder="أدخل اسم الصنف"
            />
          </div>

          <!-- Code and Color Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label">
                الكود <span class="required-star">*</span>
              </label>
              <input
                type="text"
                required
                v-model="formData.code"
                class="form-input"
                placeholder="كود الصنف"
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                اللون <span class="required-star">*</span>
              </label>
              <input
                type="text"
                required
                v-model="formData.color"
                class="form-input"
                placeholder="لون الصنف"
              />
            </div>
          </div>

          <!-- Warehouse Selection -->
          <div class="form-group">
            <label class="form-label">
              المخزن <span class="required-star">*</span>
            </label>
            <select
              v-model="formData.warehouse_id"
              class="form-select"
              required
            >
              <option value="">اختر المخزن</option>
              <option v-for="warehouse in accessibleWarehouses" :key="warehouse.id" :value="warehouse.id">
                {{ warehouse.name_ar }}
              </option>
            </select>
          </div>

          <!-- Supplier and Location Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label">
                المورد
              </label>
              <input
                type="text"
                v-model="formData.supplier"
                class="form-input"
                placeholder="اسم المورد"
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                مكان الصنف
              </label>
              <input
                type="text"
                v-model="formData.item_location"
                class="form-input"
                placeholder="مكان الصنف داخل المخزن"
              />
            </div>
          </div>

          <!-- Add Mode Selection -->
          <div class="form-group">
            <label class="form-label">
              طريقة الإضافة
            </label>
            <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 sm:space-x-reverse mb-4">
              <button
                type="button"
                @click="addMode = 'cartons'"
                :class="['mode-btn', addMode === 'cartons' ? 'mode-btn-active' : 'mode-btn-inactive']"
              >
                كراتين
              </button>
              <button
                type="button"
                @click="addMode = 'single'"
                :class="['mode-btn', addMode === 'single' ? 'mode-btn-active' : 'mode-btn-inactive']"
              >
                فردي
              </button>
              <button
                type="button"
                @click="addMode = 'both'"
                :class="['mode-btn', addMode === 'both' ? 'mode-btn-active' : 'mode-btn-inactive']"
              >
                الاثنين معاً
              </button>
            </div>
          </div>

          <!-- Cartons Fields (Conditional) -->
          <div v-if="addMode === 'cartons' || addMode === 'both'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label">
                عدد الكراتين <span class="required-star">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                v-model.number="formData.cartons_count"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                عدد في الكرتونة <span class="required-star">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                v-model.number="formData.per_carton_count"
                class="form-input"
              />
            </div>
          </div>

          <!-- Single Bottles Field (Conditional) -->
          <div v-if="addMode === 'single' || addMode === 'both'" class="form-group">
            <label class="form-label">
              عدد القزاز الفردي <span class="required-star">*</span>
            </label>
            <input
              type="number"
              min="0"
              required
              v-model.number="formData.single_bottles_count"
              class="form-input"
            />
          </div>

          <!-- Notes Field -->
          <div class="form-group">
            <label class="form-label">
              ملاحظات
            </label>
            <textarea
              v-model="formData.notes"
              rows="2"
              class="form-textarea"
              placeholder="ملاحظات إضافية (اختياري)"
            ></textarea>
          </div>

          <!-- Summary Section -->
          <div v-if="showSummary" class="alert alert-info">
            <h4 class="alert-title">ملخص الكمية:</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div v-if="addMode === 'cartons' || addMode === 'both'">
                الكراتين: {{ formData.cartons_count }} × {{ formData.per_carton_count }} = {{ cartonsTotal }}
              </div>
              <div v-if="addMode === 'single' || addMode === 'both'">
                الفردي: {{ formData.single_bottles_count }}
              </div>
              <div class="col-span-full border-t pt-1 font-medium mt-1">
                الإجمالي: {{ totalQuantity }}
              </div>
            </div>
          </div>

          <!-- Existing Item Warning -->
          <div v-if="existingItem && !storeOperationError" class="alert alert-warning">
            <div class="flex items-center">
              <svg class="alert-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              <h4 class="alert-title">تم العثور على صنف موجود</h4>
            </div>
            <p class="alert-message">
              يوجد بالفعل صنف بنفس الاسم واللون والكود في هذا المخزن. سيتم تحديث الكميات بدلاً من إنشاء صنف جديد.
            </p>
            <div class="mt-2 text-sm">
              <p>الكمية الحالية: {{ existingItem.remaining_quantity }}</p>
              <p>الكمية المضافة سابقاً: {{ existingItem.total_added }}</p>
            </div>
          </div>

          <!-- Store Operation Error -->
          <div v-if="storeOperationError" class="alert alert-danger">
            <p class="alert-message">{{ storeOperationError }}</p>
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="alert alert-success">
            <p class="alert-message">{{ successMessage }}</p>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="alert alert-danger">
            <p class="alert-message">{{ errorMessage }}</p>
          </div>

          <!-- Action Buttons (Fixed at bottom) -->
          <div class="modal-footer">
            <div class="flex gap-2">
              <button
                type="button"
                @click="closeModal"
                class="btn-secondary"
              >
                إلغاء
              </button>
              <button
                type="submit"
                :disabled="loading || storeOperationLoading || !isFormValid"
                class="btn-primary"
              >
                <svg v-if="loading || storeOperationLoading" class="spinner spinner-sm" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                {{ (loading || storeOperationLoading) ? 'جاري الحفظ...' : (existingItem ? 'تحديث الكميات' : 'إضافة الصنف') }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'AddItemModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close', 'success'],
  setup(props, { emit }) {
    const store = useStore();
    
    const loading = ref(false);
    const errorMessage = ref('');
    const successMessage = ref('');
    const addMode = ref('both');
    const existingItem = ref(null);
    
    const formData = ref({
      name: '',
      code: '',
      color: '',
      warehouse_id: '',
      supplier: '',
      item_location: '',
      cartons_count: 0,
      per_carton_count: 12,
      single_bottles_count: 0,
      notes: ''
    });

    // Computed properties
    const accessibleWarehouses = computed(() => store.getters.accessibleWarehouses);
    const storeOperationLoading = computed(() => store.state.operationLoading);
    const storeOperationError = computed(() => store.state.operationError);
    const currentUser = computed(() => store.state.user);
    const currentUserId = computed(() => store.state.user?.uid);
    const userProfile = computed(() => store.state.userProfile);

    const cartonsTotal = computed(() => {
      return formData.value.cartons_count * formData.value.per_carton_count;
    });

    const totalQuantity = computed(() => {
      const cartonsQuantity = cartonsTotal.value;
      const singleQuantity = formData.value.single_bottles_count || 0;
      return cartonsQuantity + singleQuantity;
    });

    const showSummary = computed(() => {
      return totalQuantity.value > 0;
    });

    const isFormValid = computed(() => {
      if (!formData.value.name.trim()) return false;
      if (!formData.value.code.trim()) return false;
      if (!formData.value.color.trim()) return false;
      if (!formData.value.warehouse_id) return false;
      
      // Check mode-specific validation
      if (addMode.value === 'cartons') {
        return formData.value.cartons_count > 0 && formData.value.per_carton_count > 0;
      } else if (addMode.value === 'single') {
        return formData.value.single_bottles_count > 0;
      } else if (addMode.value === 'both') {
        return totalQuantity.value > 0;
      }
      
      return false;
    });

    const isAddingCartonsComputed = computed(() => {
      return (addMode.value === 'cartons' || addMode.value === 'both') && formData.value.cartons_count > 0;
    });

    // Watchers
    watch(() => props.isOpen, (newVal) => {
      if (newVal) {
        resetForm();
        
        // Set default warehouse if accessible warehouses exist
        if (accessibleWarehouses.value.length > 0) {
          const mainWarehouse = store.getters.mainWarehouse;
          formData.value.warehouse_id = mainWarehouse?.id || accessibleWarehouses.value[0].id;
        }
      }
    });

    watch(accessibleWarehouses, (newWarehouses) => {
      if (newWarehouses.length > 0 && !formData.value.warehouse_id) {
        const mainWarehouse = store.getters.mainWarehouse;
        formData.value.warehouse_id = mainWarehouse?.id || newWarehouses[0].id;
      }
    });

    // Watch for form changes to check for existing items
    watch([() => formData.value.name, () => formData.value.code, () => formData.value.color, () => formData.value.warehouse_id], 
      async ([name, code, color, warehouseId]) => {
        if (name && code && color && warehouseId) {
          await checkExistingItem();
        } else {
          existingItem.value = null;
        }
      }, 
      { immediate: true }
    );

    // Methods
    const closeModal = () => {
      emit('close');
      resetForm();
    };

    const resetForm = () => {
      formData.value = {
        name: '',
        code: '',
        color: '',
        warehouse_id: accessibleWarehouses.value.length > 0 ? 
          (store.getters.mainWarehouse?.id || accessibleWarehouses.value[0].id) : '',
        supplier: '',
        item_location: '',
        cartons_count: 0,
        per_carton_count: 12,
        single_bottles_count: 0,
        notes: ''
      };
      addMode.value = 'both';
      errorMessage.value = '';
      successMessage.value = '';
      existingItem.value = null;
      store.dispatch('clearOperationError');
    };

    const checkExistingItem = async () => {
      if (!formData.value.name || !formData.value.code || !formData.value.color || !formData.value.warehouse_id) {
        existingItem.value = null;
        return;
      }

      try {
        // Dispatch action to check for existing item
        const result = await store.dispatch('checkExistingItem', {
          name: formData.value.name.trim(),
          code: formData.value.code.trim(),
          color: formData.value.color.trim(),
          warehouse_id: formData.value.warehouse_id
        });

        if (result && result.exists && result.item) {
          existingItem.value = result.item;
        } else {
          existingItem.value = null;
        }
      } catch (error) {
        console.error('Error checking existing item:', error);
        existingItem.value = null;
      }
    };

    const validateForm = () => {
      errorMessage.value = '';
      store.dispatch('clearOperationError');

      if (!formData.value.name.trim()) {
        errorMessage.value = 'يرجى إدخال اسم الصنف';
        return false;
      }
      if (!formData.value.code.trim()) {
        errorMessage.value = 'يرجى إدخال كود الصنف';
        return false;
      }
      if (!formData.value.color.trim()) {
        errorMessage.value = 'يرجى إدخال لون الصنف';
        return false;
      }
      if (!formData.value.warehouse_id) {
        errorMessage.value = 'يرجى اختيار المخزن';
        return false;
      }

      // Check if user is logged in
      if (!currentUserId.value) {
        errorMessage.value = 'يجب تسجيل الدخول أولاً';
        return false;
      }

      // Check user permissions
      if (!store.getters.canEdit) {
        errorMessage.value = 'ليس لديك صلاحية لإضافة أصناف';
        return false;
      }

      // Mode-specific validation
      if (addMode.value === 'cartons') {
        if (!formData.value.cartons_count || formData.value.cartons_count <= 0) {
          errorMessage.value = 'يرجى إدخال عدد كراتين صحيح';
          return false;
        }
        if (!formData.value.per_carton_count || formData.value.per_carton_count <= 0) {
          errorMessage.value = 'يرجى إدخال عدد صحيح في الكرتونة';
          return false;
        }
      } else if (addMode.value === 'single') {
        if (!formData.value.single_bottles_count || formData.value.single_bottles_count <= 0) {
          errorMessage.value = 'يرجى إدخال عدد فردي صحيح';
          return false;
        }
      } else if (addMode.value === 'both') {
        const cartonsValid = formData.value.cartons_count && formData.value.cartons_count > 0 && 
                           formData.value.per_carton_count && formData.value.per_carton_count > 0;
        const singleValid = formData.value.single_bottles_count && formData.value.single_bottles_count > 0;
        
        if (!cartonsValid && !singleValid) {
          errorMessage.value = 'يرجى إدخال كميات صحيحة إما في الكراتين أو الفردي';
          return false;
        }
      }

      if (totalQuantity.value <= 0) {
        errorMessage.value = 'يرجى إدخال كمية صحيحة';
        return false;
      }

      return true;
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;

      loading.value = true;
      errorMessage.value = '';
      successMessage.value = '';

      try {
        // Prepare item data properly
        const userId = currentUserId.value;
        
        if (!userId) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        // Use the computed property instead of creating a new variable with same name
        const addingCartons = isAddingCartonsComputed.value;

        // Prepare the item data object
        const itemData = {
          name: formData.value.name.trim(),
          code: formData.value.code.trim(),
          color: formData.value.color.trim(),
          warehouse_id: formData.value.warehouse_id,
          cartons_count: formData.value.cartons_count || 0,
          per_carton_count: formData.value.per_carton_count || (addingCartons ? 12 : 1),
          single_bottles_count: formData.value.single_bottles_count || 0,
          supplier: formData.value.supplier?.trim() || '',
          item_location: formData.value.item_location?.trim() || '',
          notes: formData.value.notes?.trim() || ''
        };

        console.log('Submitting item with data:', {
          itemData,
          userId,
          addingCartons,
          existingItem: existingItem.value
        });

        // Call the atomic action with correct parameters
        const result = await store.dispatch('addInventoryItemAtomic', {
          itemData,
          userId,
          isAddingCartons: addingCartons
        });

        console.log('Item operation completed:', result);

        // Show success message
        if (result?.type === 'created') {
          successMessage.value = 'تم إضافة الصنف الجديد بنجاح!';
        } else if (result?.type === 'updated') {
          successMessage.value = 'تم تحديث الكميات بنجاح!';
        } else {
          successMessage.value = 'تم حفظ التغييرات بنجاح!';
        }

        // Wait a moment to show success message, then close modal
        setTimeout(() => {
          emit('success', result || { type: existingItem.value ? 'updated' : 'created' });
          closeModal();
        }, 1500);
        
      } catch (error) {
        console.error('Error in handleSubmit:', error);
        
        // Show appropriate error message
        if (error.message?.includes('يجب تسجيل الدخول')) {
          errorMessage.value = 'يجب تسجيل الدخول أولاً';
        } else if (error.message?.includes('صلاحية')) {
          errorMessage.value = 'ليس لديك صلاحية لإضافة أصناف. يرجى التواصل مع المشرف.';
        } else if (error.message?.includes('مطلوب') || error.message?.includes('الحقل')) {
          errorMessage.value = error.message;
        } else if (error.message?.includes('الشبكة') || error.message?.includes('الاتصال')) {
          errorMessage.value = 'خطأ في الاتصال بالشبكة. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.';
        } else if (storeOperationError.value) {
          // Use store error if available
          errorMessage.value = storeOperationError.value;
        } else {
          errorMessage.value = `حدث خطأ أثناء حفظ الصنف: ${error.message || 'خطأ غير معروف'}`;
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      errorMessage,
      successMessage,
      addMode,
      existingItem,
      formData,
      accessibleWarehouses,
      storeOperationLoading,
      storeOperationError,
      cartonsTotal,
      totalQuantity,
      showSummary,
      isFormValid,
      closeModal,
      handleSubmit
    };
  }
};
</script>

<style scoped>
/* Modal overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
}

.dark .modal-overlay {
  background-color: rgba(0, 0, 0, 0.7);
}

/* Modal content */
.modal-content {
  background-color: white;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 28rem;
  max-height: 90vh;
  overflow-y: auto;
  direction: rtl;
}

.dark .modal-content {
  background-color: #1f2937;
}

/* Modal header */
.modal-header {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .modal-header {
  background-color: #1f2937;
  border-bottom-color: #374151;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .modal-title {
  color: #f3f4f6;
}

.modal-close-btn {
  padding: 0.25rem;
  border-radius: 0.375rem;
  color: #6b7280;
  transition: background-color 0.2s;
}

.modal-close-btn:hover {
  background-color: #f3f4f6;
}

.dark .modal-close-btn:hover {
  background-color: #374151;
}

.modal-close-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Modal body */
.modal-body {
  padding: 1rem;
}

/* Modal footer */
.modal-footer {
  position: sticky;
  bottom: 0;
  background-color: white;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 1rem;
  margin-bottom: -1rem;
  margin-right: -1rem;
  margin-left: -1rem;
  padding-bottom: 1rem;
}

.dark .modal-footer {
  background-color: #1f2937;
  border-top-color: #374151;
}

/* Form elements */
.form-input,
.form-select,
.form-textarea {
  text-align: right;
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: white;
  color: #1f2937;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.dark .form-input,
.dark .form-select,
.dark .form-textarea {
  background-color: #1f2937;
  border-color: #4b5563;
  color: #f3f4f6;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: transparent;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.5);
}

.form-textarea {
  resize: vertical;
}

/* Form label */
.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.dark .form-label {
  color: #d1d5db;
}

.required-star {
  color: #ef4444;
}

/* Mode buttons */
.mode-btn {
  flex: 1;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.mode-btn-active {
  background-color: #fef3c7;
  color: #92400e;
}

.dark .mode-btn-active {
  background-color: rgba(120, 53, 15, 0.2);
  color: #fbbf24;
}

.mode-btn-inactive {
  background-color: #f3f4f6;
  color: #374151;
}

.dark .mode-btn-inactive {
  background-color: #374151;
  color: #d1d5db;
}

.mode-btn-inactive:hover {
  background-color: #e5e7eb;
}

.dark .mode-btn-inactive:hover {
  background-color: #4b5563;
}

/* Buttons */
.btn-primary {
  flex: 1;
  padding: 0.5rem 1rem;
  background: linear-gradient(to right, #f59e0b, #f97316);
  color: white;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.btn-primary:hover {
  background: linear-gradient(to right, #d97706, #ea580c);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  flex: 1;
  padding: 0.5rem 1rem;
  background-color: #e5e7eb;
  color: #1f2937;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.dark .btn-secondary {
  background-color: #374151;
  color: #e5e7eb;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}

.dark .btn-secondary:hover {
  background-color: #4b5563;
}

/* Alert styles */
.alert {
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid;
}

.alert-info {
  background-color: #eff6ff;
  border-color: #bfdbfe;
  color: #1e40af;
}

.dark .alert-info {
  background-color: rgba(30, 58, 138, 0.2);
  border-color: #1e3a8a;
  color: #93c5fd;
}

.alert-warning {
  background-color: #fefce8;
  border-color: #fef08a;
  color: #854d0e;
}

.dark .alert-warning {
  background-color: rgba(120, 53, 15, 0.2);
  border-color: #78350f;
  color: #fde68a;
}

.alert-danger {
  background-color: #fef2f2;
  border-color: #fecaca;
  color: #991b1b;
}

.dark .alert-danger {
  background-color: rgba(127, 29, 29, 0.2);
  border-color: #7f1d1d;
  color: #fca5a5;
}

.alert-success {
  background-color: #f0fdf4;
  border-color: #bbf7d0;
  color: #166534;
}

.dark .alert-success {
  background-color: rgba(6, 78, 59, 0.2);
  border-color: #064e3b;
  color: #a7f3d0;
}

.alert-title {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.alert-message {
  font-size: 0.875rem;
}

.alert-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-left: 0.5rem;
}

/* Spinner */
.spinner {
  animation: spin 1s linear infinite;
  border-radius: 9999px;
  border-width: 2px;
  border-style: solid;
  border-color: currentColor;
  border-top-color: transparent;
}

.spinner-sm {
  width: 1rem;
  height: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .modal-content {
    margin: 0.5rem;
    max-height: 95vh;
  }
  
  .grid-cols-1.md\:grid-cols-2 {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>