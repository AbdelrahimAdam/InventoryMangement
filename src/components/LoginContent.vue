<template>
  <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
    <div class="text-center mb-8">
      <div class="h-16 w-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">تسجيل الدخول</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">أدخل بيانات الدخول للوصول إلى النظام</p>
    </div>
    
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
          اسم المستخدم
        </label>
        <input
          type="text"
          class="w-full px-4 py-3 text-right border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="أدخل اسم المستخدم"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
          كلمة المرور
        </label>
        <input
          type="password"
          class="w-full px-4 py-3 text-right border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="أدخل كلمة المرور"
        />
      </div>
      
      <button 
        @click="$emit('login')"
        class="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors mt-6"
      >
        تسجيل الدخول
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginContent',
  emits: ['login']
}
</script>
