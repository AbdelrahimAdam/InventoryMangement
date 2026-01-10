<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <!-- رأس المودال -->
      <div class="modal-header">
        <h2 class="modal-title">إضافة صنف جديد</h2>
        <button 
          @click="closeModal"
          class="modal-close-btn"
          type="button"
        >
          <svg class="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- محتوى المودال -->
      <div class="modal-body">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- قسم رفع الصورة -->
          <div class="form-group">
            <label class="form-label">
              صورة الصنف
            </label>
            <div class="photo-upload-container">
              <!-- معاينة الصورة -->
              <div class="photo-preview-wrapper">
                <div 
                  v-if="previewPhoto" 
                  class="photo-preview"
                  :style="{ backgroundImage: `url(${previewPhoto})` }"
                  @click="openFilePicker"
                >
                  <div class="photo-overlay">
                    <svg class="photo-edit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                </div>
                <div 
                  v-else 
                  class="photo-placeholder"
                  @click="openFilePicker"
                >
                  <svg class="photo-placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span class="photo-placeholder-text">انقر لاختيار صورة</span>
                </div>
              </div>

              <!-- أزرار رفع الصورة -->
              <div class="photo-actions">
                <input
                  type="file"
                  ref="fileInput"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileUpload"
                />
                <button
                  type="button"
                  @click="openFilePicker"
                  class="photo-action-btn"
                >
                  <svg class="photo-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  اختيار صورة
                </button>
                <button
                  type="button"
                  @click="handlePasteFromClipboard"
                  class="photo-action-btn"
                  :disabled="clipboardLoading"
                >
                  <svg v-if="clipboardLoading" class="spinner spinner-xs" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="photo-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                  {{ clipboardLoading ? 'جاري اللصق...' : 'لصق من الحافظة' }}
                </button>
                <button
                  v-if="previewPhoto"
                  type="button"
                  @click="removePhoto"
                  class="photo-action-btn photo-action-btn-danger"
                >
                  <svg class="photo-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  إزالة الصورة
                </button>
              </div>

              <!-- معلومات الصورة -->
              <div v-if="selectedFile" class="photo-info">
                <p class="photo-info-text">
                  {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
                </p>
              </div>
            </div>
          </div>

          <!-- حقل الاسم -->
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
              ref="nameInput"
              @keydown="handleKeyDown($event, 'codeInput')"
            />
          </div>

          <!-- حقل الكود واللون -->
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
                ref="codeInput"
                @keydown="handleKeyDown($event, 'colorInput')"
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
                ref="colorInput"
                @keydown="handleKeyDown($event, 'warehouseSelect')"
              />
            </div>
          </div>

          <!-- اختيار المخزن -->
          <div class="form-group">
            <label class="form-label">
              المخزن <span class="required-star">*</span>
            </label>
            <select
              v-model="formData.warehouse_id"
              class="form-select"
              required
              ref="warehouseSelect"
            >
              <option value="">اختر المخزن</option>
              <option v-for="warehouse in accessibleWarehouses" :key="warehouse.id" :value="warehouse.id">
                {{ warehouse.name_ar }}
              </option>
            </select>
          </div>

          <!-- حقل المورد والمكان -->
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
                ref="supplierInput"
                @keydown="handleKeyDown($event, 'locationInput')"
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
                ref="locationInput"
                @keydown="handleKeyDown($event, 'cartonsCountInput')"
              />
            </div>
          </div>

          <!-- اختيار طريقة الإضافة -->
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

          <!-- حقول الكراتين (ظرفية) -->
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
                ref="cartonsCountInput"
                @keydown="handleKeyDown($event, 'perCartonInput')"
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
                ref="perCartonInput"
                @keydown="handleKeyDown($event, 'singleBottlesInput')"
              />
            </div>
          </div>

          <!-- حقل القزاز الفردي (ظرفي) -->
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
              ref="singleBottlesInput"
              @keydown="handleKeyDown($event, 'notesInput')"
            />
          </div>

          <!-- حقل الملاحظات -->
          <div class="form-group">
            <label class="form-label">
              ملاحظات
            </label>
            <textarea
              v-model="formData.notes"
              rows="2"
              class="form-textarea"
              placeholder="ملاحظات إضافية (اختياري)"
              ref="notesInput"
            ></textarea>
          </div>

          <!-- قسم الملخص -->
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

          <!-- تحذير الصنف الموجود -->
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
              <p v-if="existingItem.photo_url">يوجد صورة مرفقة سابقاً</p>
            </div>
          </div>

          <!-- خطأ في العملية -->
          <div v-if="storeOperationError" class="alert alert-danger">
            <p class="alert-message">{{ storeOperationError }}</p>
          </div>

          <!-- رسالة النجاح -->
          <div v-if="successMessage" class="alert alert-success">
            <p class="alert-message">{{ successMessage }}</p>
          </div>

          <!-- رسالة الخطأ -->
          <div v-if="errorMessage" class="alert alert-danger">
            <p class="alert-message">{{ errorMessage }}</p>
          </div>

          <!-- أزرار الإجراءات (ثابتة في الأسفل) -->
          <div class="modal-footer">
            <div class="flex gap-2">
              <button
                type="button"
                @click="closeModal"
                class="btn-secondary"
              >
                إغلاق
              </button>
              <button
                type="button"
                @click="resetForm"
                class="btn-secondary"
                :disabled="loading || storeOperationLoading || uploadingPhoto"
              >
                مسح النموذج
              </button>
              <button
                type="submit"
                :disabled="loading || storeOperationLoading || !isFormValid || uploadingPhoto"
                class="btn-primary"
                ref="submitButton"
              >
                <svg v-if="loading || storeOperationLoading || uploadingPhoto" class="spinner spinner-sm" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                {{ (loading || storeOperationLoading || uploadingPhoto) ? 'جاري الحفظ...' : (existingItem ? 'تحديث الكميات' : 'إضافة الصنف') }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, nextTick } from 'vue';
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
    
    // Refs
    const loading = ref(false);
    const errorMessage = ref('');
    const successMessage = ref('');
    const addMode = ref('both');
    const existingItem = ref(null);
    const uploadingPhoto = ref(false);
    const clipboardLoading = ref(false);
    const selectedFile = ref(null);
    const previewPhoto = ref('');
    const fileInput = ref(null);
    const isFormResetting = ref(false);
    
    // Form field refs
    const nameInput = ref(null);
    const codeInput = ref(null);
    const colorInput = ref(null);
    const warehouseSelect = ref(null);
    const supplierInput = ref(null);
    const locationInput = ref(null);
    const cartonsCountInput = ref(null);
    const perCartonInput = ref(null);
    const singleBottlesInput = ref(null);
    const notesInput = ref(null);
    const submitButton = ref(null);

    // Form data
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
      notes: '',
      photo_url: null
    });

    // Computed properties
    const accessibleWarehouses = computed(() => store.getters.accessibleWarehouses || []);
    const storeOperationLoading = computed(() => store.state.operationLoading);
    const storeOperationError = computed(() => store.state.operationError);
    const currentUser = computed(() => store.state.user);
    const currentUserId = computed(() => store.state.user?.uid);
    const userProfile = computed(() => store.state.userProfile);
    
    // Warehouse label helper
    const getWarehouseLabel = (warehouseId) => {
      if (!warehouseId) return '';
      const warehouse = accessibleWarehouses.value.find(w => w.id === warehouseId);
      return warehouse ? warehouse.name_ar || warehouse.name : warehouseId;
    };

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

    // CRITICAL FIX: Proper isAddingCartons logic that matches store expectations
    const isAddingCartons = computed(() => {
      // User is adding cartons if they entered cartons_count > 0
      return formData.value.cartons_count > 0;
    });

    const isFormValid = computed(() => {
      if (isFormResetting.value) return false;
      
      // Basic required fields
      if (!formData.value.name?.trim()) return false;
      if (!formData.value.code?.trim()) return false;
      if (!formData.value.color?.trim()) return false;
      if (!formData.value.warehouse_id) return false;
      
      // Quantity validation based on mode
      if (addMode.value === 'cartons') {
        if (formData.value.cartons_count <= 0) return false;
        if (formData.value.per_carton_count <= 0) return false;
      } else if (addMode.value === 'single') {
        if (formData.value.single_bottles_count <= 0) return false;
      } else if (addMode.value === 'both') {
        const hasCartons = formData.value.cartons_count > 0 && formData.value.per_carton_count > 0;
        const hasSingles = formData.value.single_bottles_count > 0;
        if (!hasCartons && !hasSingles) return false;
      }
      
      // For new items (not updating existing), ensure total quantity > 0
      if (!existingItem.value && totalQuantity.value <= 0) {
        return false;
      }
      
      return true;
    });

    // Watchers
    watch(() => props.isOpen, (newVal) => {
      if (newVal) {
        // Auto-focus on name field
        setTimeout(() => {
          if (nameInput.value) {
            nameInput.value.focus();
          }
        }, 100);
        
        // Set default warehouse if not set
        if (accessibleWarehouses.value.length > 0 && !formData.value.warehouse_id) {
          formData.value.warehouse_id = accessibleWarehouses.value[0].id;
        }
      }
    });

    watch(accessibleWarehouses, (newWarehouses) => {
      if (newWarehouses.length > 0 && !formData.value.warehouse_id) {
        formData.value.warehouse_id = newWarehouses[0].id;
      }
    }, { immediate: true });

    // SIMPLIFIED: Existing item checker that works with store's logic
    const checkExistingItem = async () => {
      if (isFormResetting.value) return;
      
      const cleanName = formData.value.name?.trim() || '';
      const cleanCode = formData.value.code?.trim() || '';
      const cleanColor = formData.value.color?.trim() || '';
      const cleanWarehouseId = formData.value.warehouse_id;
      
      // We need all 4 fields to search
      if (!cleanName || !cleanCode || !cleanColor || !cleanWarehouseId) {
        existingItem.value = null;
        return;
      }

      try {
        // Check in local inventory first (fastest)
        const localInventory = store.state.inventory || [];
        const foundItem = localInventory.find(item => {
          const itemName = item.name?.trim().toLowerCase() || '';
          const itemCode = item.code?.trim().toLowerCase() || '';
          const itemColor = item.color?.trim().toLowerCase() || '';
          
          return itemName === cleanName.toLowerCase() && 
                 itemCode === cleanCode.toLowerCase() && 
                 itemColor === cleanColor.toLowerCase() && 
                 item.warehouse_id === cleanWarehouseId;
        });

        if (foundItem) {
          console.log('✅ Found existing item in local inventory:', foundItem);
          existingItem.value = foundItem;
          
          // Auto-fill photo if available
          if (foundItem.photo_url && !previewPhoto.value) {
            previewPhoto.value = foundItem.photo_url;
          }
          
          successMessage.value = '⚠️ تم العثور على صنف موجود. سيتم تحديث الكميات.';
        } else {
          console.log('❌ No existing item found');
          existingItem.value = null;
          successMessage.value = '';
        }
      } catch (error) {
        console.error('Error checking existing item:', error);
        existingItem.value = null;
      }
    };

    // Debounced existing item checker
    const checkExistingItemDebounced = debounce(checkExistingItem, 500);

    watch([
      () => formData.value.name,
      () => formData.value.code,
      () => formData.value.color,
      () => formData.value.warehouse_id
    ], () => {
      if (formData.value.name) formData.value.name = formData.value.name.trimStart();
      if (formData.value.code) formData.value.code = formData.value.code.trimStart();
      if (formData.value.color) formData.value.color = formData.value.color.trimStart();
      
      checkExistingItemDebounced();
    });

    // Methods
    const closeModal = () => {
      emit('close');
      resetForm();
    };

    const handleKeyDown = (event, nextFieldRef) => {
      if (event.key === ' ') return;
      
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        focusNextField(nextFieldRef);
      }
    };

    const resetForm = () => {
      isFormResetting.value = true;
      
      const currentWarehouseId = formData.value.warehouse_id;
      
      formData.value = {
        name: '',
        code: '',
        color: '',
        warehouse_id: currentWarehouseId || (accessibleWarehouses.value.length > 0 ? accessibleWarehouses.value[0].id : ''),
        supplier: '',
        item_location: '',
        cartons_count: 0,
        per_carton_count: 12,
        single_bottles_count: 0,
        notes: '',
        photo_url: null
      };
      
      addMode.value = 'both';
      errorMessage.value = '';
      successMessage.value = '';
      existingItem.value = null;
      selectedFile.value = null;
      previewPhoto.value = '';
      
      store.dispatch('clearOperationError');
      
      nextTick(() => {
        isFormResetting.value = false;
        if (nameInput.value) {
          nameInput.value.focus();
        }
      });
    };

    const clearFormAfterSuccess = () => {
      isFormResetting.value = true;
      
      const currentWarehouseId = formData.value.warehouse_id;
      
      formData.value = {
        name: '',
        code: '',
        color: '',
        warehouse_id: currentWarehouseId,
        supplier: '',
        item_location: '',
        cartons_count: 0,
        per_carton_count: 12,
        single_bottles_count: 0,
        notes: '',
        photo_url: null
      };
      
      addMode.value = 'both';
      errorMessage.value = '';
      successMessage.value = '';
      existingItem.value = null;
      selectedFile.value = null;
      previewPhoto.value = '';
      
      store.dispatch('clearOperationError');
      
      nextTick(() => {
        isFormResetting.value = false;
        if (nameInput.value) {
          nameInput.value.focus();
        }
      });
    };

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 بايت';
      const k = 1024;
      const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const openFilePicker = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        errorMessage.value = 'يرجى اختيار ملف صورة فقط';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        errorMessage.value = 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت';
        return;
      }

      selectedFile.value = file;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        previewPhoto.value = e.target.result;
      };
      reader.readAsDataURL(file);

      if (fileInput.value) {
        fileInput.value.value = '';
      }
    };

    const removePhoto = () => {
      selectedFile.value = null;
      previewPhoto.value = '';
      formData.value.photo_url = null;
    };

    const handlePasteFromClipboard = async () => {
      clipboardLoading.value = true;
      errorMessage.value = '';

      try {
        if (!navigator.clipboard || !navigator.clipboard.read) {
          errorMessage.value = 'ميزة لصق الصور من الحافظة غير مدعومة في هذا المتصفح';
          return;
        }

        const clipboardItems = await navigator.clipboard.read();
        
        for (const clipboardItem of clipboardItems) {
          const imageTypes = clipboardItem.types.filter(type => type.startsWith('image/'));
          
          if (imageTypes.length > 0) {
            const imageType = imageTypes[0];
            const blob = await clipboardItem.getType(imageType);
            
            const file = new File([blob], `صورة-ملصقة-${Date.now()}.${imageType.split('/')[1]}`, { type: imageType });
            selectedFile.value = file;
            
            const reader = new FileReader();
            reader.onload = (e) => {
              previewPhoto.value = e.target.result;
            };
            reader.readAsDataURL(blob);
            
            successMessage.value = 'تم لصق الصورة من الحافظة بنجاح';
            break;
          }
        }

        if (!selectedFile.value) {
          errorMessage.value = 'لا توجد صورة في الحافظة';
        }
      } catch (error) {
        console.error('خطأ في اللصق من الحافظة:', error);
        errorMessage.value = 'حدث خطأ أثناء لصق الصورة من الحافظة. تأكد من وجود صورة في الحافظة وأنك قد منحت الإذن للوصول إلى الحافظة.';
      } finally {
        clipboardLoading.value = false;
      }
    };

    const uploadPhotoToStorage = async () => {
      if (!selectedFile.value) return null;

      uploadingPhoto.value = true;

      try {
        // In real app, upload to Firebase Storage
        // For now, return base64 data URL
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target.result);
          };
          reader.readAsDataURL(selectedFile.value);
        });
      } catch (error) {
        console.error('خطأ في رفع الصورة:', error);
        errorMessage.value = 'حدث خطأ أثناء رفع الصورة';
        return null;
      } finally {
        uploadingPhoto.value = false;
      }
    };

    const validateForm = () => {
      errorMessage.value = '';
      store.dispatch('clearOperationError');

      // Basic validations
      if (!formData.value.name.trim()) {
        errorMessage.value = 'يرجى إدخال اسم الصنف';
        if (nameInput.value) nameInput.value.focus();
        return false;
      }
      if (!formData.value.code.trim()) {
        errorMessage.value = 'يرجى إدخال كود الصنف';
        if (codeInput.value) codeInput.value.focus();
        return false;
      }
      if (!formData.value.color.trim()) {
        errorMessage.value = 'يرجى إدخال لون الصنف';
        if (colorInput.value) colorInput.value.focus();
        return false;
      }
      if (!formData.value.warehouse_id) {
        errorMessage.value = 'يرجى اختيار المخزن';
        if (warehouseSelect.value) warehouseSelect.value.focus();
        return false;
      }

      // Authentication check
      if (!currentUserId.value) {
        errorMessage.value = 'يجب تسجيل الدخول أولاً';
        return false;
      }

      // Permission check
      const userRole = userProfile.value?.role || '';
      if (!['superadmin', 'warehouse_manager'].includes(userRole)) {
        errorMessage.value = 'ليس لديك صلاحية لإضافة أصناف';
        return false;
      }

      // Quantity validation based on mode
      if (addMode.value === 'cartons') {
        if (formData.value.cartons_count <= 0) {
          errorMessage.value = 'يرجى إدخال عدد كراتين صحيح';
          if (cartonsCountInput.value) cartonsCountInput.value.focus();
          return false;
        }
        if (formData.value.per_carton_count <= 0) {
          errorMessage.value = 'يرجى إدخال عدد صحيح في الكرتونة';
          if (perCartonInput.value) perCartonInput.value.focus();
          return false;
        }
      } else if (addMode.value === 'single') {
        if (formData.value.single_bottles_count <= 0) {
          errorMessage.value = 'يرجى إدخال عدد فردي صحيح';
          if (singleBottlesInput.value) singleBottlesInput.value.focus();
          return false;
        }
      } else if (addMode.value === 'both') {
        const cartonsValid = formData.value.cartons_count > 0 && formData.value.per_carton_count > 0;
        const singleValid = formData.value.single_bottles_count > 0;
        
        if (!cartonsValid && !singleValid) {
          errorMessage.value = 'يرجى إدخال كميات صحيحة إما في الكراتين أو الفردي';
          return false;
        }
      }

      // For new items, ensure total quantity > 0
      if (!existingItem.value && totalQuantity.value <= 0) {
        errorMessage.value = 'يرجى إدخال كمية صحيحة للإضافة';
        return false;
      }

      return true;
    };

    const focusNextField = (fieldRef) => {
      const field = {
        nameInput,
        codeInput,
        colorInput,
        warehouseSelect,
        supplierInput,
        locationInput,
        cartonsCountInput,
        perCartonInput,
        singleBottlesInput,
        notesInput,
        submitButton
      }[fieldRef];
      
      if (field && field.value) {
        field.value.focus();
      }
    };

    // CRITICAL FIX: Updated handleSubmit with proper store integration
    const handleSubmit = async () => {
      if (!validateForm()) return;

      loading.value = true;
      errorMessage.value = '';
      successMessage.value = '';

      try {
        console.log('🚀 SUBMIT STARTED =================================');
        console.log('📋 Form data:', formData.value);
        console.log('🔍 Existing item:', existingItem.value);
        console.log('🎯 isAddingCartons:', isAddingCartons.value);

        // Handle photo upload
        let photoUrl = null;
        
        if (selectedFile.value && previewPhoto.value.startsWith('data:image/')) {
          photoUrl = await uploadPhotoToStorage();
          console.log('📸 New photo uploaded (base64)');
        } else if (existingItem.value?.photo_url) {
          photoUrl = existingItem.value.photo_url;
          console.log('🖼️ Using existing item photo');
        } else if (previewPhoto.value && !previewPhoto.value.startsWith('http')) {
          photoUrl = previewPhoto.value;
          console.log('📋 Using preview photo (base64)');
        }

        // Prepare item data for store
        const itemData = {
          name: formData.value.name.trim(),
          code: formData.value.code.trim(),
          color: formData.value.color.trim(),
          warehouse_id: formData.value.warehouse_id,
          cartons_count: Number(formData.value.cartons_count) || 0,
          per_carton_count: Number(formData.value.per_carton_count) || 12,
          single_bottles_count: Number(formData.value.single_bottles_count) || 0,
          supplier: formData.value.supplier?.trim() || null,
          item_location: formData.value.item_location?.trim() || null,
          notes: formData.value.notes?.trim() || null,
          photo_url: photoUrl || null,
          created_by: currentUserId.value,
          updated_by: currentUserId.value
        };

        // CRITICAL: Add existing item ID if found
        if (existingItem.value && existingItem.value.id) {
          itemData.existingItemId = existingItem.value.id;
          itemData.isUpdatingExisting = true;
          console.log('🔄 Will update existing item ID:', existingItem.value.id);
        } else {
          console.log('➕ Will create new item');
        }

        console.log('📦 Prepared itemData for store:', {
          ...itemData,
          created_by: 'HIDDEN',
          updated_by: 'HIDDEN',
          photo_url: itemData.photo_url ? 'EXISTS' : 'null'
        });

        // Call store action with CORRECT parameters
        console.log('📤 Dispatching to store with isAddingCartons:', isAddingCartons.value);
        
        const result = await store.dispatch('addInventoryItem', {
          itemData,
          isAddingCartons: isAddingCartons.value  // CRITICAL: Use computed property
        });

        console.log('✅ Store action result:', result);

        if (!result) {
          throw new Error('No result returned from store action');
        }

        // Success message based on result type
        if (result.type === 'updated') {
          successMessage.value = '✅ تم تحديث الصنف بنجاح!';
          if (result.cartonsAdded > 0) {
            successMessage.value += ` تمت إضافة ${result.cartonsAdded} وحدة.`;
          }
          if (result.convertedCartons > 0) {
            successMessage.value += ` تم تحويل ${result.convertedCartons} كرتون من القزاز الفردي.`;
          }
        } else if (result.type === 'created') {
          successMessage.value = '✅ تم إضافة الصنف الجديد بنجاح!';
          if (result.convertedCartons > 0) {
            successMessage.value += ` تم تحويل ${result.convertedCartons} كرتون من القزاز الفردي.`;
          }
        } else if (result.success) {
          successMessage.value = '✅ تم حفظ التغييرات بنجاح!';
        }

        // Emit success to parent (Inventory component)
        emit('success', result);

        // Clear form after success
        setTimeout(() => {
          clearFormAfterSuccess();
        }, 1500);
        
      } catch (error) {
        console.error('❌ ERROR in handleSubmit:', error);
        
        if (error.message?.includes('PERMISSION_DENIED')) {
          errorMessage.value = 'ليس لديك صلاحية للقيام بهذه العملية';
        } else if (error.message?.includes('يجب تسجيل الدخول')) {
          errorMessage.value = 'يجب تسجيل الدخول أولاً';
        } else if (error.message?.includes('صلاحية')) {
          errorMessage.value = 'ليس لديك صلاحية لإضافة أصناف';
        } else if (error.message?.includes('مطلوب') || error.message?.includes('الحقل')) {
          errorMessage.value = error.message;
        } else if (storeOperationError.value) {
          errorMessage.value = storeOperationError.value;
        } else {
          errorMessage.value = `❌ حدث خطأ: ${error.message || 'خطأ غير معروف'}`;
        }
      } finally {
        loading.value = false;
        console.log('🏁 SUBMIT COMPLETED ===============================');
      }
    };

    // Debounce helper
    function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

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
      uploadingPhoto,
      clipboardLoading,
      selectedFile,
      previewPhoto,
      fileInput,
      nameInput,
      codeInput,
      colorInput,
      warehouseSelect,
      supplierInput,
      locationInput,
      cartonsCountInput,
      perCartonInput,
      singleBottlesInput,
      notesInput,
      submitButton,
      closeModal,
      handleSubmit,
      resetForm,
      clearFormAfterSuccess,
      formatFileSize,
      openFilePicker,
      handleFileUpload,
      handlePasteFromClipboard,
      removePhoto,
      focusNextField,
      handleKeyDown,
      getWarehouseLabel
    };
  }
};
</script>

<style scoped>
/* خلفية المودال */
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

/* محتوى المودال */
.modal-content {
  background-color: white;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 32rem;
  max-height: 90vh;
  overflow-y: auto;
  direction: rtl;
}

.dark .modal-content {
  background-color: #1f2937;
}

/* رأس المودال */
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
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* جسم المودال */
.modal-body {
  padding: 1rem;
  max-height: calc(90vh - 130px);
  overflow-y: auto;
}

/* تذييل المودال */
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

/* عناصر النموذج */
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
  font-size: 0.875rem;
  white-space: normal;
  word-wrap: break-word;
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
  min-height: 5rem;
}

/* تسمية النموذج */
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
  margin-right: 0.125rem;
}

/* مجموعة النموذج */
.form-group {
  margin-bottom: 1rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

/* تخطيط الشبكة */
.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.gap-4 {
  gap: 1rem;
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* قسم رفع الصورة */
.photo-upload-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.photo-preview-wrapper {
  width: 100%;
  max-width: 12rem;
  margin: 0 auto;
}

.photo-preview {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 0.5rem;
  border: 2px dashed #d1d5db;
  cursor: pointer;
  overflow: hidden;
}

.photo-preview:hover .photo-overlay {
  opacity: 1;
}

.photo-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.photo-edit-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: white;
}

.photo-placeholder {
  width: 100%;
  padding: 2rem 1rem;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.photo-placeholder:hover {
  border-color: #f59e0b;
  background-color: #fffbeb;
}

.dark .photo-placeholder:hover {
  border-color: #fbbf24;
  background-color: rgba(120, 53, 15, 0.1);
}

.photo-placeholder-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: #9ca3af;
  margin-bottom: 0.5rem;
}

.photo-placeholder-text {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
}

.dark .photo-placeholder-text {
  color: #9ca3af;
}

/* أزرار الصورة */
.photo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.photo-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  border: none;
}

.dark .photo-action-btn {
  background-color: #374151;
  border-color: #4b5563;
  color: #d1d5db;
}

.photo-action-btn:hover:not(:disabled) {
  background-color: #e5e7eb;
  border-color: #9ca3af;
}

.dark .photo-action-btn:hover:not(:disabled) {
  background-color: #4b5563;
  border-color: #6b7280;
}

.photo-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.photo-action-btn-danger {
  color: #dc2626;
  background-color: #fee2e2;
  border-color: #fecaca;
}

.dark .photo-action-btn-danger {
  color: #f87171;
  background-color: rgba(127, 29, 29, 0.2);
  border-color: #7f1d1d;
}

.photo-action-btn-danger:hover {
  background-color: #fecaca;
  border-color: #fca5a5;
}

.dark .photo-action-btn-danger:hover {
  background-color: #7f1d1d;
  border-color: #ef4444;
}

.photo-action-icon {
  width: 1rem;
  height: 1rem;
}

/* معلومات الصورة */
.photo-info {
  text-align: center;
  margin-top: 0.25rem;
}

.photo-info-text {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.dark .photo-info-text {
  color: #9ca3af;
}

/* إدخال الملف المخفي */
.hidden {
  display: none;
}

/* أزرار الوضع */
.mode-btn {
  flex: 1;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
}

.mode-btn-active {
  background-color: #fef3c7;
  color: #92400e;
  border: 1px solid #f59e0b;
}

.dark .mode-btn-active {
  background-color: rgba(120, 53, 15, 0.3);
  color: #fbbf24;
  border-color: #f59e0b;
}

.mode-btn-inactive {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.dark .mode-btn-inactive {
  background-color: #374151;
  color: #d1d5db;
  border-color: #4b5563;
}

.mode-btn-inactive:hover {
  background-color: #e5e7eb;
  border-color: #9ca3af;
}

.dark .mode-btn-inactive:hover {
  background-color: #4b5563;
  border-color: #6b7280;
}

/* أدوات المرونة */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

.space-x-2 > * + * {
  margin-right: 0.5rem;
}

.space-x-reverse {
  flex-direction: row-reverse;
}

@media (min-width: 640px) {
  .sm\:flex-row {
    flex-direction: row;
  }
  
  .sm\:space-y-0 > * + * {
    margin-top: 0;
  }
  
  .sm\:space-x-2 > * + * {
    margin-right: 0.5rem;
  }
  
  .sm\:space-x-reverse {
    flex-direction: row-reverse;
  }
}

/* الأزرار */
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
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(to right, #d97706, #ea580c);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 0.5rem 1rem;
  background-color: #e5e7eb;
  color: #1f2937;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  white-space: nowrap;
}

.dark .btn-secondary {
  background-color: #374151;
  color: #e5e7eb;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #d1d5db;
}

.dark .btn-secondary:hover:not(:disabled) {
  background-color: #4b5563;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* أداة الفجوة */
.gap-2 {
  gap: 0.5rem;
}

/* أنماط التنبيهات */
.alert {
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid;
  margin: 0.5rem 0;
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
  font-size: 0.875rem;
  display: flex;
  align-items: center;
}

.alert-message {
  font-size: 0.875rem;
  margin: 0;
  margin-top: 0.25rem;
}

.alert-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-left: 0.5rem;
}

/* المغزل */
.spinner {
  animation: spin 1s linear infinite;
}

.spinner-sm {
  width: 1rem;
  height: 1rem;
  margin-left: 0.25rem;
}

.spinner-xs {
  width: 0.75rem;
  height: 0.75rem;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* أدوات النص */
.text-sm {
  font-size: 0.875rem;
}

.font-medium {
  font-weight: 500;
}

.border-t {
  border-top: 1px solid #d1d5db;
}

.dark .border-t {
  border-top-color: #4b5563;
}

.pt-1 {
  padding-top: 0.25rem;
}

.mt-1 {
  margin-top: 0.25rem;
}

/* أدوات العمود */
.col-span-full {
  grid-column: 1 / -1;
}

/* التعديلات المتجاوبة */
@media (max-width: 640px) {
  .modal-content {
    margin: 0.5rem;
    max-height: 95vh;
    max-width: calc(100% - 1rem);
  }
  
  .modal-body {
    max-height: calc(95vh - 130px);
  }
  
  .grid-cols-1.md\:grid-cols-2 {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .photo-actions {
    flex-direction: column;
  }
  
  .photo-action-btn {
    width: 100%;
    justify-content: center;
  }
  
  .modal-footer {
    margin-bottom: -0.5rem;
    margin-right: -0.5rem;
    margin-left: -0.5rem;
    padding: 0.75rem;
  }
  
  .modal-footer .flex {
    flex-direction: column;
  }
  
  .modal-footer .btn-secondary,
  .modal-footer .btn-primary {
    width: 100%;
  }
}

/* أنماط الأيقونات */
.w-4 {
  width: 1rem;
}

.h-4 {
  height: 1rem;
}

.ml-1 {
  margin-right: 0.25rem;
}
</style>
