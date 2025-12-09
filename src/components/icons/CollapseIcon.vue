<template>
  <svg class="w-4 h-4 text-gray-600 dark:text-gray-400 transform transition-transform" 
       :class="{'rotate-180': collapsed}" 
       fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
  </svg>
</template>

<script>
export default {
  name: 'CollapseIcon',
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  }
}
</script>