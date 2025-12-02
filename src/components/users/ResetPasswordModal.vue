<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg w-full max-w-md rtl">
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">إعادة تعيين كلمة المرور</h2>
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
        <div v-if="user" class="text-center">
          <div class="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="text-indigo-600 font-medium text-lg">
              {{ getUserInitials(user.name || user.email) }}
            </span>
          </div>
          <h3 class="text-lg font-medium text-gray-900">{{ user.name || user.email }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ user.email }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            كلمة المرور الجديدة <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            v-model="newPassword"
            class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
            placeholder="أدخل كلمة المرور الجديدة"
          />
          <div class="mt-2">
            <button
              type="button"
              @click="generatePassword"
              class="text-sm text-indigo-600 hover:text-indigo-800"
            >
              توليد كلمة مرور عشوائية
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            يجب أن تكون كلمة المرور 6 أحرف على الأقل. سيتمكن المستخدم من تغييرها بعد الدخول.
          </p>
        </div>

        <!-- Password Strength Indicator -->
        <div v-if="newPassword" class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-gray-700">قوة كلمة المرور:</span>
            <span class="text-sm font-medium" :class="passwordStrengthClass">{{ passwordStrengthText }}</span>
          </div>
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              class="h-full transition-all duration-300"
              :class="passwordStrengthClass"
              :style="{ width: passwordStrengthPercentage + '%' }"
            ></div>
          </div>
          <ul class="text-xs text-gray-600 space-y-1 list-disc pr-5">
            <li :class="hasLength ? 'text-green-600' : ''">8 أحرف على الأقل</li>
            <li :class="hasUppercase ? 'text-green-600' : ''">حرف كبير واحد على الأقل</li>
            <li :class="hasLowercase ? 'text-green-600' : ''">حرف صغير واحد على الأقل</li>
            <li :class="hasNumber ? 'text-green-600' : ''">رقم واحد على الأقل</li>
            <li :class="hasSpecialChar ? 'text-green-600' : ''">رمز خاص واحد على الأقل</li>
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
            </svg>
            {{ loading ? 'جاري التحديث...' : 'تحديث كلمة المرور' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  name: 'ResetPasswordModal',
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
  emits: ['close', 'reset'],
  setup(props, { emit }) {
    const loading = ref(false);
    const errorMessage = ref('');
    const newPassword = ref('');

    // Password strength calculation
    const passwordStrength = computed(() => {
      if (!newPassword.value) return 0;
      
      let strength = 0;
      const password = newPassword.value;
      
      if (password.length >= 8) strength += 20;
      if (/[A-Z]/.test(password)) strength += 20;
      if (/[a-z]/.test(password)) strength += 20;
      if (/[0-9]/.test(password)) strength += 20;
      if (/[^A-Za-z0-9]/.test(password)) strength += 20;
      
      return strength;
    });

    const passwordStrengthPercentage = computed(() => Math.min(passwordStrength.value, 100));
    
    const passwordStrengthText = computed(() => {
      const strength = passwordStrength.value;
      if (strength < 40) return 'ضعيفة';
      if (strength < 60) return 'متوسطة';
      if (strength < 80) return 'جيدة';
      return 'قوية جداً';
    });

    const passwordStrengthClass = computed(() => {
      const strength = passwordStrength.value;
      if (strength < 40) return 'bg-red-500 text-red-500';
      if (strength < 60) return 'bg-yellow-500 text-yellow-500';
      if (strength < 80) return 'bg-blue-500 text-blue-500';
      return 'bg-green-500 text-green-500';
    });

    const hasLength = computed(() => newPassword.value.length >= 8);
    const hasUppercase = computed(() => /[A-Z]/.test(newPassword.value));
    const hasLowercase = computed(() => /[a-z]/.test(newPassword.value));
    const hasNumber = computed(() => /[0-9]/.test(newPassword.value));
    const hasSpecialChar = computed(() => /[^A-Za-z0-9]/.test(newPassword.value));

    const isFormValid = computed(() => {
      return newPassword.value.length >= 6;
    });

    const getUserInitials = (name) => {
      if (!name) return '?';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const generatePassword = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      let password = '';
      for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      newPassword.value = password;
    };

    const resetForm = () => {
      newPassword.value = '';
      errorMessage.value = '';
      loading.value = false;
    };

    const handleSubmit = async () => {
      if (!isFormValid.value || !props.user) return;

      loading.value = true;
      errorMessage.value = '';

      try {
        emit('reset', {
          userId: props.user.id,
          newPassword: newPassword.value
        });
      } catch (error) {
        console.error('Error in password reset:', error);
        errorMessage.value = error.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور';
      } finally {
        loading.value = false;
      }
    };

    watch(() => props.isOpen, (newVal) => {
      if (newVal) {
        resetForm();
        generatePassword();
      }
    });

    return {
      loading,
      errorMessage,
      newPassword,
      passwordStrengthPercentage,
      passwordStrengthText,
      passwordStrengthClass,
      hasLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
      isFormValid,
      getUserInitials,
      generatePassword,
      handleSubmit
    };
  }
};
</script>