<template>
  <div class="hidden lg:flex h-full relative isolate">
    <!-- Far background layer - creates deep, atmospheric distance -->
    <div class="fixed inset-0 -z-20">
      <div class="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-100/50 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"></div>
      <!-- Soft, distant radial glows - barely perceptible, professional -->
      <div class="absolute top-0 left-0 w-full h-full">
        <div class="absolute top-20 left-[10%] w-[40rem] h-[40rem] bg-blue-50/20 dark:bg-blue-900/5 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-0 right-[5%] w-[35rem] h-[35rem] bg-purple-50/15 dark:bg-purple-900/4 rounded-full blur-[120px]"></div>
        <div class="absolute top-1/3 right-1/4 w-[30rem] h-[30rem] bg-indigo-50/10 dark:bg-indigo-900/3 rounded-full blur-[120px]"></div>
      </div>
    </div>

    <!-- Desktop Sidebar - with subtle elevation shadow -->
    <DesktopSidebar class="relative z-10 shadow-[4px_0_25px_-8px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_25px_-8px_rgba(0,0,0,0.2)]" />
    
    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden relative z-10 bg-transparent">
      <!-- Desktop Header -->
      <DesktopHeader />
      
      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-5 lg:p-6">
        <!-- Content card - elevated, floating effect with soft shadows -->
        <div class="max-w-full mx-auto relative group">
          <!-- Background layer with subtle blur and elevation -->
          <div class="absolute inset-0 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02),0_10px_25px_-5px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_15px_-3px_rgba(0,0,0,0.1),0_10px_25px_-5px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-shadow duration-300"></div>
          <!-- Edge highlight for subtle 3D effect -->
          <div class="absolute inset-0 rounded-2xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.03)] pointer-events-none"></div>
          <!-- Content -->
          <div class="relative px-5 py-4 lg:px-6 lg:py-5">
            <router-view v-memo="[route.path]" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import DesktopSidebar from '@/layouts/DesktopSidebar.vue'
import DesktopHeader from '@/components/DesktopHeader.vue'
</script>

<style scoped>
/* 
 * Professional depth system:
 * - 3-layer background creates far/mid/near perception
 * - Ultra-soft color palette stays business-appropriate
 * - Subtle glass morphism with minimal blur
 * - Floating card with dual-shadow system
 */

/* Smooth depth transitions */
.relative {
  transition: background-color 0.4s ease, box-shadow 0.3s ease;
}

/* Enhanced floating effect on scroll/use */
.group:hover .absolute:first-child {
  box-shadow: 0 15px 30px -10px rgba(0,0,0,0.03), 0 25px 40px -15px rgba(0,0,0,0.02);
  backdrop-filter: blur(8px);
}

:global(.dark) .group:hover .absolute:first-child {
  box-shadow: 0 15px 30px -10px rgba(0,0,0,0.2), 0 25px 40px -15px rgba(0,0,0,0.15);
}

/* Maintain readability - no heavy blur */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Optional: subtle noise texture for depth (minimal opacity) */
/*
.isolate::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  background-image: radial-gradient(rgba(0,0,0,0.01) 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.2;
  z-index: 30;
}
*/
</style>
