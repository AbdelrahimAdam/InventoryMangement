<template>
  <div class="hidden lg:flex h-full">
    <!-- Desktop Sidebar -->
    <DesktopSidebar />
    
    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <!-- Desktop Header -->
      <DesktopHeader />
      
      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-4">
        <div class="max-w-full mx-auto">
          <router-view v-memo="[route.path]" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import DesktopSidebar from '@/layouts/DesktopSidebar.vue'
import DesktopHeader from '@/components/DesktopHeader.vue'
</script>