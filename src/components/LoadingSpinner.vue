<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">جاري التحميل...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner'
}
</script>