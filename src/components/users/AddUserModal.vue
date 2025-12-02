<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md rtl">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">إضافة مستخدم جديد</h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Name -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل الاسم الكامل"
          >
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="example@company.com"
          >
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="كلمة المرور المؤقتة"
          >
        </div>

        <!-- Role -->
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700 mb-1">الدور</label>
          <select
            id="role"
            v-model="form.role"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">اختر الدور</option>
            <option value="company_manager">مدير الشركة</option>
            <option value="warehouse_manager">مدير المخازن</option>
          </select>
        </div>

        <!-- Phone -->
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="01XXXXXXXXX"
          >
        </div>

        <!-- Status -->
        <div>
          <label class="flex items-center space-x-2 space-x-reverse">
            <input
              v-model="form.isActive"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            >
            <span class="text-sm text-gray-700">حساب نشط</span>
          </label>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <!-- Actions -->
        <div class="flex space-x-3 space-x-reverse pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            إلغاء
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span v-if="loading">جاري الإضافة...</span>
            <span v-else>إضافة المستخدم</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'AddUserModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'success'],
  setup(props, { emit }) {
    const store = useStore()
    
    const loading = ref(false)
    const error = ref('')
    
    const form = reactive({
      name: '',
      email: '',
      password: '',
      role: '',
      phone: '',
      isActive: true
    })

    // Reset form when modal opens/closes
    watch(() => props.isOpen, (newVal) => {
      if (newVal) {
        resetForm()
      }
    })

    const resetForm = () => {
      Object.assign(form, {
        name: '',
        email: '',
        password: '',
        role: '',
        phone: '',
        isActive: true
      })
      error.value = ''
    }

    const generatePassword = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
      let password = ''
      for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      form.password = password
    }

    const handleSubmit = async () => {
      if (!form.name || !form.email || !form.password || !form.role) {
        error.value = 'جميع الحقول المطلوبة يجب ملؤها'
        return
      }

      if (form.password.length < 6) {
        error.value = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
        return
      }

      loading.value = true
      error.value = ''

      try {
        // Simulate API call - replace with actual Firebase Auth creation
        const userData = {
          id: Date.now().toString(),
          name: form.name,
          email: form.email,
          role: form.role,
          phone: form.phone,
          isActive: form.isActive,
          createdAt: new Date().toISOString(),
          createdBy: store.state.user?.uid || 'system'
        }

        // Dispatch to Vuex store
        await store.dispatch('addUser', userData)
        
        emit('success')
        emit('close')
        
        // Show success message (you might want to use a toast notification here)
        console.log('User added successfully:', userData)
        
      } catch (err) {
        console.error('Error adding user:', err)
        error.value = 'فشل في إضافة المستخدم. يرجى المحاولة مرة أخرى.'
      } finally {
        loading.value = false
      }
    }

    // Generate initial password when component mounts
    generatePassword()

    return {
      form,
      loading,
      error,
      handleSubmit,
      generatePassword
    }
  }
}
</script>

<style scoped>
.rtl {
  direction: rtl;
}

.space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}
</style>