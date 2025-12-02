<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg w-full max-w-2xl rtl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">
          {{ user ? 'تعديل المستخدم' : 'إضافة مستخدم جديد' }}
        </h2>
        <button 
          @click="$emit('close')"
          class="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
        >
          <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Basic Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              الاسم الكامل <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              v-model="formData.name"
              class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
              placeholder="أدخل الاسم الكامل"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني <span class="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              v-model="formData.email"
              :readonly="!!user"
              class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
              placeholder="example@company.com"
              :class="{ 'bg-gray-100': !!user }"
            />
          </div>
        </div>

        <!-- Phone and Status -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              رقم الهاتف
            </label>
            <input
              type="tel"
              v-model="formData.phone"
              class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
              placeholder="01XXXXXXXXX"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">حالة الحساب</label>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="formData.is_active" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              <span class="mr-3 text-sm font-medium text-gray-700">
                {{ formData.is_active ? 'نشط' : 'غير نشط' }}
              </span>
            </label>
          </div>
        </div>

        <!-- Role Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            الدور <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label 
              v-for="role in availableRoles" 
              :key="role.value"
              class="relative flex cursor-pointer rounded-lg border p-4 focus:outline-none transition-colors duration-200"
              :class="{
                'border-indigo-600 bg-indigo-50': formData.role === role.value,
                'border-gray-300 bg-white': formData.role !== role.value
              }"
            >
              <input
                type="radio"
                :value="role.value"
                v-model="formData.role"
                :disabled="user?.role === 'superadmin'"
                class="sr-only"
              />
              <div class="flex w-full items-center justify-between">
                <div class="flex items-center">
                  <div class="text-sm">
                    <div class="font-medium text-gray-900">{{ role.name }}</div>
                    <div class="text-gray-500 text-xs mt-1">{{ role.description }}</div>
                  </div>
                </div>
                <svg v-if="formData.role === role.value" class="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
            </label>
          </div>
          <p v-if="user?.role === 'superadmin'" class="text-sm text-gray-500 mt-2">
            لا يمكن تغيير دور المشرف العام
          </p>
        </div>

        <!-- Password (only for new users) -->
        <div v-if="!user">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            كلمة المرور <span class="text-red-500">*</span>
            <span class="text-xs text-gray-500">(سيستخدمها المستخدم للدخول)</span>
          </label>
          <div class="flex gap-3">
            <input
              type="text"
              required
              v-model="formData.password"
              class="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
              placeholder="كلمة المرور المؤقتة"
            />
            <button
              type="button"
              @click="generatePassword"
              class="px-4 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
            >
              توليد عشوائي
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            يجب أن تكون كلمة المرور 6 أحرف على الأقل
          </p>
        </div>

        <!-- Warehouse Permissions -->
        <div v-if="formData.role === 'warehouse_manager'">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            المخازن المسموحة <span class="text-red-500">*</span>
            <span class="text-xs text-gray-500 block mt-1">اختر المخازن التي يمكن للمستخدم الوصول إليها</span>
          </label>
          
          <!-- Loading State -->
          <div v-if="loadingWarehouses" class="text-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
            <p class="text-sm text-gray-500 mt-2">جاري تحميل المخازن...</p>
          </div>

          <!-- Warehouses List -->
          <div v-else class="space-y-3">
            <div class="flex items-center justify-between mb-2">
              <div class="text-sm text-gray-600">
                {{ primaryWarehouses.length }} مخزن متاح
              </div>
              <button
                type="button"
                @click="toggleAllWarehouses"
                class="text-sm text-indigo-600 hover:text-indigo-800"
              >
                {{ formData.allowed_warehouses.length === primaryWarehouses.length ? 'إلغاء الكل' : 'اختيار الكل' }}
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label 
                v-for="warehouse in primaryWarehouses" 
                :key="warehouse.id"
                class="relative flex items-start p-3 border rounded-lg transition-colors duration-200"
                :class="{
                  'border-indigo-300 bg-indigo-50': formData.allowed_warehouses.includes(warehouse.id),
                  'border-gray-200 bg-white hover:bg-gray-50': !formData.allowed_warehouses.includes(warehouse.id)
                }"
              >
                <div class="flex items-center h-5">
                  <input
                    type="checkbox"
                    :value="warehouse.id"
                    v-model="formData.allowed_warehouses"
                    class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>
                <div class="mr-3 text-sm">
                  <div class="font-medium text-gray-900">{{ warehouse.name_ar }}</div>
                  <div class="text-gray-500 text-xs mt-1">{{ warehouse.name_en }}</div>
                </div>
              </label>
            </div>
          </div>

          <!-- No Warehouses Message -->
          <div v-if="!loadingWarehouses && primaryWarehouses.length === 0" class="text-center py-4 border border-gray-200 rounded-lg">
            <svg class="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            <p class="text-sm text-gray-500 mt-2">لا توجد مخازن متاحة</p>
          </div>

          <p v-if="formData.allowed_warehouses.length === 0 && primaryWarehouses.length > 0" class="text-red-500 text-sm mt-2">
            يجب اختيار مخزن واحد على الأقل لمدير المخازن
          </p>
        </div>

        <!-- Permissions Summary -->
        <div v-if="formData.role" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 class="text-sm font-medium text-gray-900 mb-2">ملخص الصلاحيات:</h4>
          <ul class="text-sm text-gray-600 space-y-1">
            <li v-for="permission in getRolePermissions(formData.role)" :key="permission" class="flex items-center">
              <svg class="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {{ permission }}
            </li>
          </ul>
        </div>

        <!-- Validation Errors -->
        <div v-if="validationErrors.length > 0" class="bg-red-50 border border-red-200 rounded-md p-4">
          <h4 class="text-sm font-medium text-red-800 mb-2">خطأ في التحقق:</h4>
          <ul class="text-sm text-red-700 list-disc pr-5 space-y-1">
            <li v-for="error in validationErrors" :key="error">{{ error }}</li>
          </ul>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-4">
          <p class="text-sm text-red-700">{{ errorMessage }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 py-3 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            إلغاء
          </button>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ loading ? 'جاري الحفظ...' : (user ? 'تحديث' : 'إضافة') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'UserModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    user: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const store = useStore();
    
    const loading = ref(false);
    const loadingWarehouses = ref(false);
    const errorMessage = ref('');
    const validationErrors = ref([]);
    
    const formData = ref({
      name: '',
      email: '',
      role: 'company_manager',
      is_active: true,
      phone: '',
      allowed_warehouses: [],
      password: ''
    });

    const availableRoles = ref([
      {
        value: 'superadmin',
        name: 'المشرف العام',
        description: 'صلاحيات كاملة على النظام'
      },
      {
        value: 'warehouse_manager',
        name: 'مدير المخازن',
        description: 'إدارة المخزون والحركات في المخازن المحددة'
      },
      {
        value: 'company_manager',
        name: 'مدير الشركة',
        description: 'عرض التقارير والبيانات (قراءة فقط)'
      }
    ]);

    // Computed properties
    const primaryWarehouses = computed(() => {
      const warehouses = store.state.warehouses || [];
      return warehouses.filter(w => w.type === 'primary');
    });

    const isFormValid = computed(() => {
      validationErrors.value = [];

      if (!formData.value.name.trim()) {
        validationErrors.value.push('الاسم الكامل مطلوب');
      }

      if (!formData.value.email.trim()) {
        validationErrors.value.push('البريد الإلكتروني مطلوب');
      } else if (!isValidEmail(formData.value.email)) {
        validationErrors.value.push('صيغة البريد الإلكتروني غير صحيحة');
      }

      if (!formData.value.role) {
        validationErrors.value.push('الدور مطلوب');
      }

      if (!props.user && !formData.value.password) {
        validationErrors.value.push('كلمة المرور مطلوبة');
      } else if (!props.user && formData.value.password.length < 6) {
        validationErrors.value.push('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      }

      if (formData.value.role === 'warehouse_manager' && formData.value.allowed_warehouses.length === 0) {
        validationErrors.value.push('يجب اختيار مخزن واحد على الأقل لمدير المخازن');
      }

      if (formData.value.phone && !isValidPhone(formData.value.phone)) {
        validationErrors.value.push('رقم الهاتف غير صحيح');
      }

      return validationErrors.value.length === 0;
    });

    // Helper functions
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const isValidPhone = (phone) => {
      const phoneRegex = /^01[0-9]{9}$/;
      return phoneRegex.test(phone);
    };

    const getRolePermissions = (role) => {
      const permissions = {
        superadmin: [
          'الوصول الكامل إلى جميع المخازن',
          'إدارة المستخدمين والأدوار',
          'إنشاء وتعديل وحذف الأصناف',
          'إدارة الحركات والنقل',
          'تصدير التقارير والبيانات',
          'إعدادات النظام'
        ],
        warehouse_manager: [
          'الوصول إلى المخازن المحددة فقط',
          'إنشاء وتعديل الأصناف في المخازن المسموحة',
          'إدارة الحركات والنقل بين المخازن المسموحة',
          'عرض التقارير للمخازن المسموحة',
          'تصدير بيانات المخازن المسموحة'
        ],
        company_manager: [
          'عرض جميع البيانات للقراءة فقط',
          'تصفية البيانات والتقارير',
          'تصدير التقارير والبيانات',
          'لا يمكن التعديل أو الحذف'
        ]
      };
      return permissions[role] || [];
    };

    const generatePassword = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      let password = '';
      for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      formData.value.password = password;
    };

    const toggleAllWarehouses = () => {
      if (formData.value.allowed_warehouses.length === primaryWarehouses.value.length) {
        formData.value.allowed_warehouses = [];
      } else {
        formData.value.allowed_warehouses = primaryWarehouses.value.map(w => w.id);
      }
    };

    const resetForm = () => {
      formData.value = {
        name: '',
        email: '',
        role: 'company_manager',
        is_active: true,
        phone: '',
        allowed_warehouses: [],
        password: ''
      };
      errorMessage.value = '';
      validationErrors.value = [];
    };

    // Load warehouses if not already loaded
    const ensureWarehousesLoaded = async () => {
      if (primaryWarehouses.value.length === 0) {
        loadingWarehouses.value = true;
        try {
          await store.dispatch('loadWarehouses');
        } catch (error) {
          console.error('Error loading warehouses:', error);
          errorMessage.value = 'خطأ في تحميل المخازن';
        } finally {
          loadingWarehouses.value = false;
        }
      }
    };

    const handleSubmit = async () => {
      if (!isFormValid.value) return;

      loading.value = true;
      errorMessage.value = '';

      try {
        // Prepare user data
        const userData = {
          name: formData.value.name.trim(),
          email: formData.value.email.trim(),
          role: formData.value.role,
          is_active: formData.value.is_active,
          phone: formData.value.phone.trim(),
          allowed_warehouses: formData.value.role === 'warehouse_manager' 
            ? formData.value.allowed_warehouses 
            : [],
          updated_at: new Date()
        };

        // If editing existing user, preserve the created_at date and id
        if (props.user) {
          userData.id = props.user.id;
          userData.created_at = props.user.created_at;
        } else {
          userData.created_at = new Date();
          userData.password = formData.value.password;
        }

        emit('save', userData);
        
      } catch (error) {
        console.error('Error in form submission:', error);
        errorMessage.value = error.message || 'حدث خطأ أثناء حفظ المستخدم';
      } finally {
        loading.value = false;
      }
    };

    watch(() => props.isOpen, async (newVal) => {
      if (newVal) {
        resetForm();
        
        // Generate password for new users
        if (!props.user) {
          generatePassword();
        }
        
        // Load warehouses when modal opens
        await ensureWarehousesLoaded();
        
        if (props.user) {
          // Edit mode - populate form with user data
          formData.value = {
            name: props.user.name || '',
            email: props.user.email || '',
            role: props.user.role || 'company_manager',
            is_active: props.user.is_active !== false,
            phone: props.user.phone || '',
            allowed_warehouses: props.user.allowed_warehouses || []
          };
        }
      }
    });

    watch(() => formData.value.role, (newRole) => {
      // Reset allowed_warehouses when role changes away from warehouse_manager
      if (newRole !== 'warehouse_manager') {
        formData.value.allowed_warehouses = [];
      }
    });

    onMounted(async () => {
      // Ensure warehouses are loaded when component mounts
      await ensureWarehousesLoaded();
    });

    return {
      loading,
      loadingWarehouses,
      errorMessage,
      validationErrors,
      formData,
      availableRoles,
      primaryWarehouses,
      isFormValid,
      getRolePermissions,
      generatePassword,
      toggleAllWarehouses,
      handleSubmit
    };
  }
};
</script>