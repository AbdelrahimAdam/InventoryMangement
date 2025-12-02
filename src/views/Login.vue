<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <!-- App Version -->
    <div class="absolute bottom-8 right-8 text-sm text-gray-400">
      v{{ appVersion }}
    </div>

    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
      <!-- Header with Logo -->
      <div class="text-center">
        <div class="flex items-center justify-center mb-6">
          <div class="h-20 w-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">
          نظام إدارة المخزون
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          منظمة مونوفيا
        </p>
        <p class="mt-1 text-xs text-gray-500">
          تسجيل الدخول للوصول إلى النظام
        </p>
      </div>

      <!-- Error message -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-sm text-red-600 text-right">{{ error }}</p>
        </div>
      </div>

      <!-- Welcome message -->
      <div v-if="showWelcomeMessage" class="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <p class="text-sm text-indigo-700 flex-1 text-right">
            مرحباً بعودتك! آخر دخول: <span class="font-semibold">{{ lastLoginTime }}</span>
          </p>
          <button @click="showWelcomeMessage = false" class="text-indigo-400 hover:text-indigo-600 mr-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Login Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin" novalidate>
        <div class="space-y-4">
          <!-- Email Input -->
          <div>
            <label for="email-address" class="block text-sm font-medium text-gray-700 mb-2 text-right">
              البريد الإلكتروني
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="form.email"
                :class="{
                  'border-red-300 focus:ring-red-500 focus:border-red-500': errors.email,
                  'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500': !errors.email
                }"
                class="block w-full pr-10 pl-3 py-3 border text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                placeholder="your@email.com"
                @blur="validateEmail"
              >
            </div>
            <p v-if="errors.email" class="mt-2 text-sm text-red-600 text-right">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password Input -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label for="password" class="block text-sm font-medium text-gray-700 text-right">
                كلمة المرور
              </label>
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="text-sm text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                {{ showPassword ? 'إخفاء' : 'إظهار' }}
              </button>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
              </div>
              <input
                id="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                v-model="form.password"
                :class="{
                  'border-red-300 focus:ring-red-500 focus:border-red-500': errors.password,
                  'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500': !errors.password
                }"
                class="block w-full pr-10 pl-3 py-3 border text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                placeholder="••••••••"
                @blur="validatePassword"
              >
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 left-0 pl-3 flex items-center"
              >
                <svg v-if="showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-2 text-sm text-red-600 text-right">
              {{ errors.password }}
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              v-model="rememberMe"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            >
            <label for="remember-me" class="mr-2 block text-sm text-gray-900">
              تذكرني
            </label>
          </div>

          <div class="text-sm">
            <a href="#" @click.prevent="showForgotPassword = true" class="font-medium text-indigo-600 hover:text-indigo-500">
              نسيت كلمة المرور؟
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            :class="{
              'opacity-50 cursor-not-allowed': loading,
              'hover:shadow-lg hover:shadow-indigo-500/25': !loading
            }"
            class="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري التحقق...
            </span>
            <span v-else class="flex items-center">
              <svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              تسجيل الدخول
            </span>
          </button>
        </div>

        <!-- Support Information -->
        <div class="mt-8 pt-8 border-t border-gray-200">
          <div class="text-center">
            <p class="text-sm text-gray-600">
              للحصول على مساعدة، يرجى التواصل مع
              <a href="mailto:support@monofia.com" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                الدعم الفني
              </a>
            </p>
            <p class="text-xs text-gray-500 mt-2">
              آخر تحديث: {{ currentDate }}
            </p>
          </div>
        </div>
      </form>

      <!-- Forgot Password Modal -->
      <div v-if="showForgotPassword" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">استعادة كلمة المرور</h3>
            <button @click="showForgotPassword = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <p class="text-sm text-gray-600 mb-4">
            يرجى إدخال بريدك الإلكتروني لإرسال رابط استعادة كلمة المرور.
          </p>
          <div class="space-y-3">
            <input
              type="email"
              v-model="forgotPasswordEmail"
              placeholder="your@email.com"
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              @click="handleForgotPassword"
              class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              إرسال رابط الاستعادة
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',
  setup() {
    const store = useStore();
    const router = useRouter();
    
    const loading = ref(false);
    const error = ref('');
    const showPassword = ref(false);
    const rememberMe = ref(false);
    const showWelcomeMessage = ref(false);
    const showForgotPassword = ref(false);
    const forgotPasswordEmail = ref('');
    
    const form = ref({
      email: '',
      password: ''
    });
    
    const errors = ref({
      email: '',
      password: ''
    });
    
    const appVersion = ref('1.0.0');
    
    const currentDate = computed(() => {
      return new Date().toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    });
    
    const lastLoginTime = computed(() => {
      const lastLogin = localStorage.getItem('lastLogin');
      if (lastLogin) {
        return new Date(lastLogin).toLocaleTimeString('ar-SA', {
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      return '--:--';
    });
    
    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!form.value.email.trim()) {
        errors.value.email = 'البريد الإلكتروني مطلوب';
      } else if (!emailRegex.test(form.value.email)) {
        errors.value.email = 'البريد الإلكتروني غير صالح';
      } else {
        errors.value.email = '';
      }
    };
    
    const validatePassword = () => {
      if (!form.value.password.trim()) {
        errors.value.password = 'كلمة المرور مطلوبة';
      } else if (form.value.password.length < 6) {
        errors.value.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
      } else {
        errors.value.password = '';
      }
    };
    
    const handleLogin = async () => {
      validateEmail();
      validatePassword();
      
      if (errors.value.email || errors.value.password) {
        error.value = 'يرجى تصحيح الأخطاء في النموذج';
        return;
      }
      
      loading.value = true;
      error.value = '';
      
      try {
        // Add delay to simulate server connection
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Call login action
        const response = await store.dispatch('login', {
          ...form.value,
          rememberMe: rememberMe.value
        });
        
        // Save login time
        localStorage.setItem('lastLogin', new Date().toISOString());
        
        // Save remember me if selected
        if (rememberMe.value) {
          localStorage.setItem('rememberedEmail', form.value.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        console.log('Login successful, redirecting to dashboard...');
        
        // Redirect to home page
        setTimeout(() => {
          router.push('/');
        }, 100);
        
      } catch (err) {
        console.error('Login error details:', err);
        
        if (err.response?.status === 401) {
          error.value = 'بيانات الدخول غير صحيحة. يرجى المحاولة مرة أخرى.';
        } else if (err.response?.status === 429) {
          error.value = 'عدد محاولات الدخول كثيرة. يرجى الانتظار قليلاً.';
        } else if (err.message && err.message.includes('Network')) {
          error.value = 'تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.';
        } else {
          error.value = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقاً.';
        }
        
        // Reset password for safety
        form.value.password = '';
        
      } finally {
        loading.value = false;
      }
    };
    
    const handleForgotPassword = async () => {
      if (!forgotPasswordEmail.value.trim()) {
        alert('يرجى إدخال البريد الإلكتروني');
        return;
      }
      
      // Simulate password reset email
      alert(`تم إرسال رابط استعادة كلمة المرور إلى: ${forgotPasswordEmail.value}`);
      showForgotPassword.value = false;
      forgotPasswordEmail.value = '';
    };
    
    onMounted(() => {
      // Check for saved email
      const savedEmail = localStorage.getItem('rememberedEmail');
      if (savedEmail) {
        form.value.email = savedEmail;
        rememberMe.value = true;
      }
      
      // Check for last login
      if (localStorage.getItem('lastLogin')) {
        showWelcomeMessage.value = true;
      }
      
      // Auto focus email field
      setTimeout(() => {
        document.getElementById('email-address')?.focus();
      }, 100);
    });
    
    return {
      loading,
      error,
      form,
      errors,
      showPassword,
      rememberMe,
      showWelcomeMessage,
      showForgotPassword,
      forgotPasswordEmail,
      appVersion,
      currentDate,
      lastLoginTime,
      validateEmail,
      validatePassword,
      handleLogin,
      handleForgotPassword
    };
  }
};
</script>

<style scoped>
/* Responsive improvements */
@media (max-width: 640px) {
  .max-w-md {
    max-width: 100%;
  }
}

/* Interaction effects */
button:active {
  transform: translateY(0);
}

/* Accessibility improvements */
input:focus {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Arabic font improvements */
* {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  letter-spacing: -0.01em;
}

/* Icon styling improvements */
svg {
  flex-shrink: 0;
}
</style>