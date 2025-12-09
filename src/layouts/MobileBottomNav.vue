<template>
  <div 
    ref="bottomNav"
    :class="[
      'fixed bottom-0 left-0 right-0 z-40 pb-safe transition-transform duration-300',
      bottomNavHidden ? 'translate-y-full' : 'translate-y-0'
    ]"
  >
    <!-- Glassmorphism Background with Shadow -->
    <div class="relative">
      <!-- Blurred Background -->
      <div class="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/80 dark:border-gray-700/80"></div>
      
      <!-- Shadow Effect -->
      <div class="absolute inset-0 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.3)]"></div>
      
      <!-- Navigation Items -->
      <div class="relative grid grid-cols-5 gap-1 p-2">
        <!-- Home -->
        <router-link 
          to="/" 
          class="flex flex-col items-center p-2 rounded-xl transition-all duration-200"
          :class="getNavLinkClasses('/')"
        >
          <div class="relative">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <div v-if="$route.path === '/'" class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-500 dark:bg-yellow-400 rounded-full"></div>
          </div>
          <span class="text-xs mt-1 font-medium">الرئيسية</span>
        </router-link>

        <!-- Inventory -->
        <router-link 
          to="/inventory" 
          class="flex flex-col items-center p-2 rounded-xl transition-all duration-200"
          :class="getNavLinkClasses('/inventory', true)"
        >
          <div class="relative">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
            <div v-if="$route.path.includes('/inventory')" class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-500 dark:bg-yellow-400 rounded-full"></div>
          </div>
          <span class="text-xs mt-1 font-medium">الأصناف</span>
        </router-link>

        <!-- Transactions -->
        <router-link 
          to="/transactions" 
          class="flex flex-col items-center p-2 rounded-xl transition-all duration-200"
          :class="getNavLinkClasses('/transactions')"
        >
          <div class="relative">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <div v-if="$route.path === '/transactions'" class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-500 dark:bg-yellow-400 rounded-full"></div>
          </div>
          <span class="text-xs mt-1 font-medium">الحركات</span>
        </router-link>

        <!-- Quick Add -->
        <router-link 
          v-if="canModifyItems"
          to="/inventory/add" 
          class="flex flex-col items-center p-2 rounded-xl transition-all duration-200 group"
        >
          <div class="relative">
            <!-- Outer Glow Effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-md opacity-60 group-hover:opacity-80 transition-opacity"></div>
            
            <!-- Main Button -->
            <div class="relative h-10 w-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 transform group-hover:scale-105 active:scale-95">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              
              <!-- Inner Glow -->
              <div class="absolute inset-0 rounded-full border-2 border-white/20"></div>
            </div>
            
            <!-- Pulsing Animation -->
            <div class="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 animate-ping opacity-20"></div>
          </div>
          <span class="text-xs mt-1 font-medium text-gray-700 dark:text-gray-300">إضافة</span>
        </router-link>
        <div v-else class="p-2"></div>

        <!-- Settings -->
        <router-link 
          to="/profile" 
          class="flex flex-col items-center p-2 rounded-xl transition-all duration-200"
          :class="getNavLinkClasses('/profile')"
        >
          <div class="relative">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <div v-if="$route.path === '/profile'" class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-500 dark:bg-yellow-400 rounded-full"></div>
          </div>
          <span class="text-xs mt-1 font-medium">الإعدادات</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'MobileBottomNav',
  setup() {
    const route = useRoute()
    const store = useStore()
    const bottomNavHidden = ref(false)
    const lastScrollPosition = ref(0)
    const scrollThreshold = 10
    
    const userRole = computed(() => store.getters.userRole)
    const userPermissions = computed(() => store.getters.userPermissions || [])
    const allowedWarehouses = computed(() => store.getters.allowedWarehouses || [])
    
    const canModifyItems = computed(() => {
      const role = userRole.value
      if (role === 'superadmin') return true
      
      if (role === 'warehouse_manager') {
        const hasWarehouses = allowedWarehouses.value.length > 0
        const hasPermission = userPermissions.value.includes('full_access') || 
                            userPermissions.value.includes('manage_inventory')
        return hasWarehouses && hasPermission
      }
      
      return false
    })
    
    const getNavLinkClasses = (path, isIncludes = false) => {
      const isActive = isIncludes ? route.path.includes(path) : route.path === path
      return {
        'text-yellow-700 dark:text-yellow-300 bg-white/80 dark:bg-gray-800/80 shadow-md border border-yellow-200 dark:border-yellow-800': isActive,
        'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-600': !isActive
      }
    }
    
    const handleScroll = () => {
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop
      
      if (Math.abs(currentScrollPosition - lastScrollPosition.value) < scrollThreshold) {
        return
      }
      
      if (currentScrollPosition > lastScrollPosition.value && currentScrollPosition > 100) {
        bottomNavHidden.value = true
      } else if (currentScrollPosition < lastScrollPosition.value) {
        bottomNavHidden.value = false
      }
      
      lastScrollPosition.value = currentScrollPosition
    }
    
    onMounted(() => {
      window.addEventListener('scroll', handleScroll, { passive: true })
    })
    
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })
    
    return {
      bottomNavHidden,
      canModifyItems,
      getNavLinkClasses
    }
  }
}
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.translate-y-full {
  transform: translateY(100%);
}

.translate-y-0 {
  transform: translateY(0);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-ping {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>