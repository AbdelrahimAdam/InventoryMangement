<template>
  <div class="lg:hidden h-full flex flex-col">
    <!-- Mobile Header -->
    <MobileHeader @toggle-menu="$emit('toggle-menu')" />

    <!-- Mobile Sidebar Overlay -->
    <transition name="fade">
      <div 
        v-if="mobileMenuOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        @click="$emit('close-menu')"
      ></div>
    </transition>

    <!-- Mobile Sidebar -->
    <transition name="slide">
      <MobileSidebar v-if="mobileMenuOpen" @close="$emit('close-menu')" />
    </transition>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 safe-bottom">
      <div class="max-w-full mx-auto">
        <!-- Firebase Status for Mobile -->
        <div v-if="showFirebaseStatus" class="px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <div v-if="isOffline" class="flex items-center gap-1 text-amber-600">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <span>بدون اتصال</span>
              </div>
              <div v-else class="flex items-center gap-1 text-green-600">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>متصل</span>
              </div>
            </div>
            <span class="text-gray-500">{{ firebaseReads }} قراءة</span>
          </div>
        </div>
        
        <router-view v-memo="[route.path]" />
      </div>
    </main>

    <!-- Mobile Bottom Navigation -->
    <MobileBottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MobileHeader from '@/components/layout/MobileHeader.vue'
import MobileSidebar from '@/components/layout/MobileSidebar.vue'
import MobileBottomNav from '@/components/layout/MobileBottomNav.vue'

const route = useRoute()
const mobileMenuOpen = ref(false)
const showFirebaseStatus = ref(true)
const isOffline = ref(!navigator.onLine)
const firebaseReads = ref(0)

onMounted(() => {
  // Load Firebase reads count
  const today = new Date().toDateString()
  const storedReads = JSON.parse(localStorage.getItem('firebase_reads_count') || '{}')
  firebaseReads.value = storedReads[today] || 0
  
  // Listen to network changes
  window.addEventListener('online', () => {
    isOffline.value = false
  })
  
  window.addEventListener('offline', () => {
    isOffline.value = true
  })
})
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

/* Safe area for mobile bottom nav */
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}
</style>