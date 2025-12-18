<template>
  <div class="lg:hidden h-full flex flex-col">
    <!-- Mobile Header -->
    <MobileHeader @toggle-menu="toggleMobileMenu" />

    <!-- Mobile Sidebar Overlay -->
    <transition name="fade">
      <div 
        v-if="mobileMenuOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        @click="mobileMenuOpen = false"
      ></div>
    </transition>

    <!-- Mobile Sidebar -->
    <transition name="slide">
      <MobileSidebar v-if="mobileMenuOpen" @close="mobileMenuOpen = false" />
    </transition>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 safe-bottom">
      <div class="max-w-full mx-auto">
        <!-- ✅ UPDATED: Firebase & Store Status for Mobile -->
        <div v-if="showFirebaseStatus" class="px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <!-- Network Status -->
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

              <!-- ✅ ADDED: Data Load Status -->
              <div v-if="transactionsLoading" class="flex items-center gap-1 text-blue-600">
                <svg class="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <span>جاري التحميل...</span>
              </div>

              <!-- ✅ ADDED: Transaction Stats -->
              <div v-if="transactionStats.total > 0 && !transactionsLoading" class="flex items-center gap-1 text-purple-600">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <span class="english-numbers">{{ transactionStats.total }}</span>
              </div>
            </div>

            <!-- ✅ ADDED: Today's Transactions Count -->
            <div class="flex items-center gap-2">
              <div v-if="transactionStats.total > 0" class="flex items-center gap-1">
                <span class="text-gray-500 text-xs">اليوم:</span>
                <div class="flex gap-1">
                  <span v-if="transactionStats.add > 0" class="text-green-600 english-numbers">{{ transactionStats.add }}</span>
                  <span v-if="transactionStats.transfer > 0" class="text-purple-600 english-numbers">+{{ transactionStats.transfer }}</span>
                  <span v-if="transactionStats.dispatch > 0" class="text-red-600 english-numbers">+{{ transactionStats.dispatch }}</span>
                </div>
              </div>
              <span v-else class="text-gray-500 english-numbers">{{ firebaseReads }} قراءة</span>
            </div>
          </div>
        </div>

        <!-- ✅ ADDED: Data Loading States -->
        <div v-if="!transactionsLoaded && route.name === 'Transactions'" class="p-4">
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <div class="animate-pulse w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">جاري تحميل الحركات...</p>
                  <p class="text-xs text-gray-500 dark:text-gray-500">قد يستغرق بضع ثوانٍ</p>
                </div>
              </div>
              <button 
                @click="refreshTransactions"
                :disabled="transactionsLoading"
                class="px-3 py-1.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors disabled:opacity-50"
              >
                <svg :class="['w-3 h-3', transactionsLoading ? 'animate-spin' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div class="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-500" :style="{ width: `${loadingProgress}%` }"></div>
            </div>
          </div>
        </div>

        <!-- ✅ ADDED: Error State -->
        <div v-if="transactionsError && route.name === 'Transactions'" class="p-4">
          <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0">
                <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-red-800 dark:text-red-300">خطأ في تحميل البيانات</p>
                <p class="text-xs text-red-600 dark:text-red-400 mt-1">{{ transactionsError }}</p>
              </div>
              <button 
                @click="refreshTransactions"
                class="flex-shrink-0 px-3 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>

        <!-- Router View -->
        <router-view />
      </div>
    </main>

    <!-- Mobile Bottom Navigation -->
    <MobileBottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import MobileHeader from '@/components/layout/MobileHeader.vue'
import MobileSidebar from '@/components/layout/MobileSidebar.vue'
import MobileBottomNav from '@/components/layout/MobileBottomNav.vue'

const store = useStore()
const route = useRoute()

// Refs
const mobileMenuOpen = ref(false)
const showFirebaseStatus = ref(true)
const isOffline = ref(!navigator.onLine)
const firebaseReads = ref(0)
const loadingProgress = ref(0)

// Store getters
const transactionsLoading = computed(() => store.state.transactionsLoading)
const transactionsLoaded = computed(() => store.state.transactions.length > 0)
const transactionStats = computed(() => store.state.transactionStats || {
  total: 0,
  add: 0,
  transfer: 0,
  dispatch: 0,
  update: 0,
  delete: 0
})
const transactionsError = computed(() => store.state.inventoryError)

// Methods
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const refreshTransactions = async () => {
  try {
    await store.dispatch('fetchTransactions')
    store.dispatch('showNotification', {
      type: 'success',
      message: 'تم تحديث الحركات بنجاح',
      duration: 2000
    })
  } catch (error) {
    store.dispatch('showNotification', {
      type: 'error',
      message: 'حدث خطأ أثناء تحديث الحركات',
      duration: 3000
    })
  }
}

// Simulate loading progress
watch(transactionsLoading, (loading) => {
  if (loading) {
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      loadingProgress.value = Math.min(progress, 90)
      if (progress >= 90 || !transactionsLoading.value) {
        clearInterval(interval)
        loadingProgress.value = 100
        setTimeout(() => {
          loadingProgress.value = 0
        }, 500)
      }
    }, 200)
  }
})

onMounted(() => {
  // Load Firebase reads count
  const today = new Date().toDateString()
  const storedReads = JSON.parse(localStorage.getItem('firebase_reads_count') || '{}')
  firebaseReads.value = storedReads[today] || 0
  
  // Listen to network changes
  window.addEventListener('online', () => {
    isOffline.value = false
    // Auto-refresh when coming back online
    if (route.name === 'Transactions') {
      setTimeout(() => {
        refreshTransactions()
      }, 1000)
    }
  })
  
  window.addEventListener('offline', () => {
    isOffline.value = true
    store.dispatch('showNotification', {
      type: 'warning',
      message: 'تم فقدان الاتصال بالإنترنت',
      duration: 3000
    })
  })

  // Auto-load transactions on mobile for better UX
  if (store.getters.isAuthenticated && !transactionsLoaded.value) {
    setTimeout(() => {
      store.dispatch('fetchTransactions')
    }, 500)
  }
})

// Watch route changes
watch(() => route.name, (newRoute) => {
  // Auto-hide mobile menu on route change
  mobileMenuOpen.value = false
  
  // Auto-load data for specific routes
  if (newRoute === 'Transactions' && !transactionsLoading.value && !transactionsLoaded.value) {
    setTimeout(() => {
      store.dispatch('fetchTransactions')
    }, 300)
  }
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

/* English numbers styling */
.english-numbers {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  font-feature-settings: "lnum";
  font-variant-numeric: lining-nums;
  direction: ltr;
  display: inline-block;
}
</style>