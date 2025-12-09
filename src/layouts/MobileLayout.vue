<template>
  <div class="lg:hidden h-full flex flex-col">
    <!-- Mobile Header -->
    <MobileHeader />
    
    <!-- Mobile Sidebar Overlay -->
    <transition name="fade">
      <div 
        v-if="mobileMenuOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        @click="closeMobileMenu"
      ></div>
    </transition>

    <!-- Mobile Sidebar -->
    <transition name="slide">
      <MobileSidebar v-if="mobileMenuOpen" @close="closeMobileMenu" />
    </transition>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div class="max-w-full mx-auto">
        <router-view v-memo="[route.path]" />
      </div>
    </main>

    <!-- Bottom Navigation -->
    <MobileBottomNav />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import MobileHeader from '@/components/MobileHeader.vue'
import MobileSidebar from '@/layouts/MobileSidebar.vue'
import MobileBottomNav from '@/layouts/MobileBottomNav.vue'
import { useMobileMenu } from '@/composables/useMobileMenu'

const store = useStore()
const route = useRoute()
const { mobileMenuOpen, closeMobileMenu } = useMobileMenu()
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>