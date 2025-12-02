<template>
  <div class="flex justify-center items-center p-8">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    <span class="mr-3 text-gray-600">{{ message }}</span>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    message: {
      type: String,
      default: 'جاري التحميل...'
    }
  }
};
</script>