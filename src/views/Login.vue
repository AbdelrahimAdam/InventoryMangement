<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
    <!-- Firebase Spark Plan Status -->
    <div class="absolute top-4 left-4 z-10">
      <div class="flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Firebase Spark</span>
        <div class="text-xs text-gray-500 dark:text-gray-500">{{ firebaseReads }}/يوم</div>
      </div>
    </div>

    <!-- Signature -->
    <div class="absolute bottom-4 left-4 z-10">
      <p class="text-gray-500 dark:text-gray-400 text-xs font-medium">
        برمجة : عبدالرحيم 01154088147
      </p>
    </div>

    <!-- App Version -->
    <div class="absolute bottom-4 right-4 text-xs text-gray-400 dark:text-gray-500 z-10">
      v{{ appVersion }}
    </div>

    <!-- App Name & Tagline -->
    <div class="absolute top-4 right-4 text-right z-10">
      <h1 class="text-lg font-bold text-gray-800 dark:text-white">نظام إدارة المخزون</h1>
      <p class="text-xs text-gray-600 dark:text-gray-400">إدارة المخازن الذكية</p>
    </div>

    <!-- Performance Indicators -->
    <div class="absolute top-16 left-4 flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-500">
      <div v-if="isOffline" class="flex items-center gap-1 text-amber-600 dark:text-amber-400">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
        <span>بدون اتصال</span>
      </div>
      <div v-else class="flex items-center gap-1 text-green-600 dark:text-green-400">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <span>اتصال نشط</span>
      </div>
    </div>

    <!-- Login Card -->
    <div class="relative w-full max-w-sm">
      <!-- Card Background Pattern -->
      <div class="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-3xl blur-xl dark:from-blue-900/20 dark:to-purple-900/20"></div>
      
      <div class="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        <!-- Card Header -->
        <div class="px-6 pt-8 pb-6 border-b border-gray-100 dark:border-gray-700/50">
          <div class="flex flex-col items-center mb-4">
            <!-- Animated Logo -->
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-50"></div>
              <div class="relative h-14 w-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
            </div>
            
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-4">
              تسجيل الدخول
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              أهلاً بك في لوحة التحكم
            </p>
          </div>
        </div>

        <!-- Login Form -->
        <form class="px-6 py-6" @submit.prevent="handleLogin" novalidate>
          <!-- Error Message -->
          <div v-if="authError" class="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <div class="flex items-center">
              <svg class="w-4 h-4 text-red-400 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-xs text-red-600 dark:text-red-200 text-right flex-1">{{ authError }}</p>
            </div>
          </div>

          <!-- Email Input -->
          <div class="mb-4">
            <label for="email-address" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
              البريد الإلكتروني
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                </svg>
              </div>
              <input
                id="email-address"
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                :disabled="loading"
                :class="{
                  'border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-600': errors.email,
                  'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500': !errors.email
                }"
                class="block w-full pr-10 pl-3 py-3 text-sm border text-gray-900 dark:text-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200"
                placeholder="your@email.com"
                @blur="validateEmail"
                @input="errors.email = ''"
              >
            </div>
            <p v-if="errors.email" class="mt-1 text-xs text-red-600 dark:text-red-400 text-right">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password Input -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-right">
                كلمة المرور
              </label>
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                {{ showPassword ? 'إخفاء' : 'إظهار' }}
              </button>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                </svg>
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                :disabled="loading"
                :class="{
                  'border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-600': errors.password,
                  'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500': !errors.password
                }"
                class="block w-full pr-10 pl-10 py-3 text-sm border text-gray-900 dark:text-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200"
                placeholder="••••••••"
                @blur="validatePassword"
                @input="errors.password = ''"
              >
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
              >
                <svg v-if="showPassword" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
                <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-xs text-red-600 dark:text-red-400 text-right">
              {{ errors.password }}
            </p>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
              />
              <label for="remember-me" class="mr-2 block text-xs text-gray-700 dark:text-gray-300">
                تذكرني
              </label>
            </div>

            <button
              type="button"
              @click="showForgotPassword = true"
              class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              نسيت كلمة المرور؟
            </button>
          </div>

          <!-- Login Button -->
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="loading" class="animate-spin -mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span class="flex-1">{{ loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول' }}</span>
              <svg v-if="!loading" class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </form>

        <!-- Support Footer -->
        <div class="px-6 py-4 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
          <div class="text-center">
            <p class="text-xs text-gray-600 dark:text-gray-400">
              للحصول على مساعدة، يرجى التواصل مع
              <a href="mailto:support@inventory.com" class="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                الدعم الفني
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Demo Credentials (Development Only) -->
    <div v-if="isDevelopment && !loading" class="absolute bottom-20 left-4 right-4 max-w-sm mx-auto">
      <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <h4 class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">بيانات تجريبية</h4>
        <div class="grid grid-cols-2 gap-2">
          <button
            @click="fillCredentials('superadmin')"
            class="text-xs px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors"
          >
            superadmin@inventory.com
          </button>
          <button
            @click="fillCredentials('manager')"
            class="text-xs px-3 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/50 transition-colors"
          >
            manager@inventory.com
          </button>
        </div>
        <p class="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
          كلمة المرور: <span class="font-mono">123456</span>
        </p>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotPassword" class="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-xs w-full border border-gray-200 dark:border-gray-700">
        <!-- Modal Header -->
        <div class="px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700/50">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">استعادة كلمة المرور</h3>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                سنرسل رابط إعادة التعيين إلى بريدك
              </p>
            </div>
            <button
              @click="showForgotPassword = false"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Form -->
        <div class="px-4 py-4">
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 text-right">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                v-model="forgotPasswordEmail"
                placeholder="your@email.com"
                class="block w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :disabled="resetLoading"
              />
            </div>
            
            <!-- Success Message -->
            <div v-if="resetSuccess" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 p-3 rounded-lg">
              <div class="flex items-center">
                <svg class="w-4 h-4 ml-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <p class="text-xs">تم إرسال رابط الاستعادة بنجاح</p>
              </div>
            </div>

            <!-- Reset Error -->
            <div v-if="resetError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-3 rounded-lg">
              <div class="flex items-center">
                <svg class="w-4 h-4 ml-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
                <p class="text-xs">{{ resetError }}</p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2 pt-2">
              <button
                @click="handleForgotPassword"
                :disabled="resetLoading"
                class="flex-1 px-3 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
              >
                <svg v-if="resetLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <span>{{ resetLoading ? 'جاري الإرسال...' : 'إرسال الرابط' }}</span>
              </button>
              <button
                @click="showForgotPassword = false"
                :disabled="resetLoading"
                class="flex-1 px-3 py-2.5 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Firebase Spark Plan Info -->
    <div class="absolute top-16 right-4 hidden md:block">
      <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-sm max-w-xs">
        <h4 class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">🔥 توفير Firebase Spark</h4>
        <ul class="space-y-1 text-xs text-gray-600 dark:text-gray-400">
          <li class="flex items-center gap-2">
            <svg class="w-3 h-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>تقليل القراءات بنسبة 90%</span>
          </li>
          <li class="flex items-center gap-2">
            <svg class="w-3 h-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>عمل بدون اتصال بالإنترنت</span>
          </li>
          <li class="flex items-center gap-2">
            <svg class="w-3 h-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>تحميل أسرع للمستخدمين</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',
  
  setup() {
    const store = useStore();
    const router = useRouter();
    
    // Refs
    const loading = ref(false);
    const authError = ref('');
    const showPassword = ref(false);
    const rememberMe = ref(false);
    const showForgotPassword = ref(false);
    const forgotPasswordEmail = ref('');
    const resetLoading = ref(false);
    const resetSuccess = ref(false);
    const resetError = ref('');
    const isOffline = ref(false);
    const firebaseReads = ref(0);
    
    const form = ref({
      email: '',
      password: ''
    });
    
    const errors = ref({
      email: '',
      password: ''
    });
    
    const appVersion = ref('1.0.0');
    
    // Computed
    const isDevelopment = computed(() => process.env.NODE_ENV === 'development');
    
    // Methods
    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!form.value.email.trim()) {
        errors.value.email = 'البريد الإلكتروني مطلوب';
        return false;
      } else if (!emailRegex.test(form.value.email)) {
        errors.value.email = 'البريد الإلكتروني غير صالح';
        return false;
      } else {
        errors.value.email = '';
        return true;
      }
    };
    
    const validatePassword = () => {
      if (!form.value.password.trim()) {
        errors.value.password = 'كلمة المرور مطلوبة';
        return false;
      } else if (form.value.password.length < 6) {
        errors.value.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
        return false;
      } else {
        errors.value.password = '';
        return true;
      }
    };
    
    const loadFirebaseReads = () => {
      try {
        const today = new Date().toDateString();
        const storedReads = JSON.parse(localStorage.getItem('firebase_reads_count') || '{}');
        firebaseReads.value = storedReads[today] || 0;
      } catch (error) {
        firebaseReads.value = 0;
      }
    };
    
    const checkNetworkStatus = () => {
      isOffline.value = !navigator.onLine;
    };
    
    const setupNetworkListeners = () => {
      window.addEventListener('online', () => {
        isOffline.value = false;
      });
      
      window.addEventListener('offline', () => {
        isOffline.value = true;
      });
    };
    
    const handleLogin = async () => {
      // Clear previous errors
      authError.value = '';
      resetError.value = '';
      
      // Validate form
      const isEmailValid = validateEmail();
      const isPasswordValid = validatePassword();
      
      if (!isEmailValid || !isPasswordValid) {
        authError.value = 'يرجى تصحيح الأخطاء في النموذج';
        return;
      }
      
      loading.value = true;
      
      try {
        // Save remember me preference
        if (rememberMe.value) {
          localStorage.setItem('rememberedEmail', form.value.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        // Track Firebase read for login attempt
        const today = new Date().toDateString();
        const storedReads = JSON.parse(localStorage.getItem('firebase_reads_count') || '{}');
        storedReads[today] = (storedReads[today] || 0) + 1;
        localStorage.setItem('firebase_reads_count', JSON.stringify(storedReads));
        firebaseReads.value = storedReads[today];
        
        // Call login action from store
        await store.dispatch('login', {
          email: form.value.email.trim(),
          password: form.value.password
        });
        
        // Save login time
        localStorage.setItem('lastLogin', new Date().toISOString());
        
        // Clear form
        form.value.password = '';
        
        // Redirect to dashboard with animation
        setTimeout(() => {
          router.push({ name: 'Dashboard' });
        }, 100);
        
      } catch (error) {
        console.error('Login error:', error);
        
        // Clear password for security
        form.value.password = '';
        
        // Firebase specific error handling
        if (error.code === 'auth/invalid-email') {
          authError.value = 'البريد الإلكتروني غير صحيح';
        } else if (error.code === 'auth/user-disabled') {
          authError.value = 'هذا الحساب معطل. يرجى التواصل مع المشرف';
        } else if (error.code === 'auth/user-not-found') {
          authError.value = 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني';
        } else if (error.code === 'auth/wrong-password') {
          authError.value = 'كلمة المرور غير صحيحة';
        } else if (error.code === 'auth/too-many-requests') {
          authError.value = 'تم تجاوز عدد المحاولات. يرجى المحاولة لاحقاً';
        } else if (error.code === 'auth/network-request-failed') {
          authError.value = 'فشل الاتصال بالإنترنت. يرجى التحقق من الاتصال';
          isOffline.value = true;
        } else {
          authError.value = error.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى';
        }
        
      } finally {
        loading.value = false;
      }
    };
    
    const handleForgotPassword = async () => {
      if (!forgotPasswordEmail.value.trim()) {
        resetError.value = 'يرجى إدخال البريد الإلكتروني';
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(forgotPasswordEmail.value)) {
        resetError.value = 'صيغة البريد الإلكتروني غير صحيحة';
        return;
      }
      
      resetLoading.value = true;
      resetError.value = '';
      resetSuccess.value = false;
      
      try {
        // Send password reset email via Firebase
        const { auth } = await import('@/firebase/config');
        const { sendPasswordResetEmail } = await import('firebase/auth');
        
        await sendPasswordResetEmail(auth, forgotPasswordEmail.value.trim());
        
        resetSuccess.value = true;
        forgotPasswordEmail.value = '';
        
        // Auto close after 3 seconds
        setTimeout(() => {
          showForgotPassword.value = false;
          resetSuccess.value = false;
        }, 3000);
        
      } catch (error) {
        console.error('Password reset error:', error);
        
        if (error.code === 'auth/user-not-found') {
          resetError.value = 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني';
        } else if (error.code === 'auth/invalid-email') {
          resetError.value = 'صيغة البريد الإلكتروني غير صحيحة';
        } else if (error.code === 'auth/too-many-requests') {
          resetError.value = 'تم تجاوز عدد المحاولات. يرجى المحاولة لاحقاً';
        } else if (error.code === 'auth/network-request-failed') {
          resetError.value = 'فشل الاتصال بالإنترنت. يرجى التحقق من الاتصال';
        } else {
          resetError.value = 'حدث خطأ أثناء إرسال رابط الاستعادة';
        }
        
      } finally {
        resetLoading.value = false;
      }
    };
    
    const fillCredentials = (role) => {
      if (role === 'superadmin') {
        form.value.email = 'superadmin@inventory.com';
      } else if (role === 'manager') {
        form.value.email = 'manager@inventory.com';
      }
      form.value.password = '123456';
      rememberMe.value = true;
    };
    
    // Lifecycle
    onMounted(() => {
      // Load saved email
      const savedEmail = localStorage.getItem('rememberedEmail');
      if (savedEmail) {
        form.value.email = savedEmail;
        rememberMe.value = true;
      }
      
      // Load Firebase reads
      loadFirebaseReads();
      
      // Check network status
      checkNetworkStatus();
      setupNetworkListeners();
      
      // Auto focus email field
      setTimeout(() => {
        const emailInput = document.getElementById('email-address');
        if (emailInput) {
          emailInput.focus();
        }
      }, 100);
    });
    
    onUnmounted(() => {
      // Cleanup
    });
    
    return {
      // Data
      loading,
      authError,
      form,
      errors,
      showPassword,
      rememberMe,
      showForgotPassword,
      forgotPasswordEmail,
      resetLoading,
      resetSuccess,
      resetError,
      isOffline,
      firebaseReads,
      appVersion,
      
      // Computed
      isDevelopment,
      
      // Methods
      validateEmail,
      validatePassword,
      handleLogin,
      handleForgotPassword,
      fillCredentials
    };
  }
};
</script>

<style scoped>
/* Custom styles for login page */
.min-h-screen {
  min-height: 100vh;
}

/* Gradient animation */
.bg-gradient-to-br {
  animation: gradientShift 15s ease infinite;
  background-size: 400% 400%;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Input focus styles */
input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dark input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

/* Button hover effects */
button:not(:disabled):hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .p-4 {
    padding: 1rem;
  }
  
  /* Better touch targets for mobile */
  button, input {
    min-height: 44px;
  }
}

/* Print styles */
@media print {
  .min-h-screen {
    background: white !important;
  }
  
  .absolute {
    display: none !important;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar {
  width: 8px;
}

.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6B7280;
}

/* Selection color */
::selection {
  background-color: rgba(59, 130, 246, 0.3);
}

.dark ::selection {
  background-color: rgba(59, 130, 246, 0.5);
}

/* Arabic font improvements */
* {
  font-family: 'Segoe UI', 'Tajawal', 'Arial', sans-serif;
  letter-spacing: -0.01em;
}
</style>