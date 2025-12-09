<template>
  <header class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-4 py-2.5 shadow-sm">
    <div class="flex items-center justify-between">
      <!-- Breadcrumb and Title -->
      <div class="flex items-center space-x-3 space-x-reverse">
        <button 
          @click="$emit('toggle-sidebar')"
          class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm lg:hidden"
        >
          <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div>
          <h1 class="text-lg font-bold text-gray-800 dark:text-gray-100">
            {{ pageTitle }}
          </h1>
          <div class="flex items-center space-x-2 space-x-reverse mt-0.5">
            <p v-if="currentWarehouseName" class="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full">
              {{ currentWarehouseName }}
            </p>
            <span v-if="userRole" class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              {{ roleName }}
            </span>
          </div>
        </div>
      </div>

      <!-- Header Actions -->
      <div class="flex items-center space-x-2 space-x-reverse">
        <!-- Search -->
        <div class="relative hidden md:block">
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input
            type="search"
            placeholder="ابحث..."
            class="w-48 pr-9 pl-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 backdrop-blur-sm shadow-sm"
          />
        </div>

        <!-- Dark Mode -->
        <button 
          @click="toggleDarkMode"
          class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
          title="تبديل الوضع"
        >
          <svg v-if="isDarkMode" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
          </svg>
          <svg v-else class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
          </svg>
        </button>

        <!-- Notifications -->
        <button 
          @click="showNotifications"
          class="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
          title="الإشعارات"
        >
          <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <span v-if="realNotificationCount > 0" class="absolute -top-0.5 -left-0.5 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-md">
            {{ realNotificationCount > 9 ? '9+' : realNotificationCount }}
          </span>
        </button>

        <!-- User Profile Dropdown -->
        <div class="relative" ref="profileDropdown">
          <button 
            @click="toggleProfileMenu"
            class="flex items-center space-x-2 space-x-reverse p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-600 shadow-sm"
          >
            <div class="h-7 w-7 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
              <span class="text-white text-xs font-medium">
                {{ getUserInitials() }}
              </span>
            </div>
            <div class="text-right hidden md:block">
              <p class="text-xs font-medium text-gray-800 dark:text-gray-100">
                {{ userName }}
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                {{ roleName }}
              </p>
            </div>
            <svg class="w-3 h-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <div 
            v-if="profileMenuOpen"
            class="absolute left-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
          >
            <router-link 
              to="/profile" 
              @click="closeProfileMenu"
              class="flex items-center px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <svg class="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              إعدادات الحساب
            </router-link>
            <button 
              @click="handleLogout"
              class="w-full flex items-center px-3 py-2 text-xs text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
            >
              <svg class="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              تسجيل خروج
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'DesktopHeader',
  emits: ['toggle-sidebar'],
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    
    const profileMenuOpen = ref(false)
    const profileDropdown = ref(null)
    
    const notifications = computed(() => store.state.notifications || [])
    const userProfile = computed(() => store.state.userProfile)
    const user = computed(() => store.state.user)
    const userRole = computed(() => store.getters.userRole)
    
    const realNotificationCount = computed(() => notifications.value.length)
    const currentWarehouseName = computed(() => {
      const mainWarehouse = store.getters.mainWarehouse
      return mainWarehouse?.name_ar || ''
    })
    
    const isDarkMode = computed(() => {
      return document.documentElement.classList.contains('dark')
    })
    
    const pageTitle = computed(() => {
      const titles = {
        'Dashboard': 'لوحة التحكم',
        'Inventory': 'الأصناف',
        'ItemDetails': 'تفاصيل الصنف',
        'AddInventory': 'إضافة صنف جديد',
        'Transactions': 'سجل الحركات',
        'Warehouses': 'المخازن',
        'Users': 'المستخدمين',
        'Reports': 'التقارير',
        'Profile': 'الملف الشخصي',
        'Transfers': 'نقل المخزون',
        'Dispatch': 'الصرف الخارجي'
      }
      return titles[route.name] || 'نظام المخزون'
    })
    
    const userName = computed(() => {
      return userProfile.value?.name || userProfile.value?.email || user.value?.email || 'مستخدم'
    })
    
    const roleName = computed(() => {
      const names = {
        superadmin: 'المشرف العام',
        warehouse_manager: 'مدير المخازن',
        company_manager: 'مدير الشركة',
        user: 'مستخدم'
      }
      return names[userRole.value] || 'مستخدم'
    })
    
    const getUserInitials = () => {
      const name = userName.value
      if (!name || name === 'مستخدم') return 'م'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    }
    
    const toggleDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark')
      if (isDark) {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      } else {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      }
    }
    
    const showNotifications = () => {
      router.push('/transactions')
    }
    
    const handleLogout = async () => {
      try {
        closeProfileMenu()
        await store.dispatch('logout')
        router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
        router.push('/login')
      }
    }
    
    const toggleProfileMenu = () => {
      profileMenuOpen.value = !profileMenuOpen.value
    }
    
    const closeProfileMenu = () => {
      profileMenuOpen.value = false
    }
    
    // Handle click outside
    const handleClickOutside = (event) => {
      if (profileDropdown.value && !profileDropdown.value.contains(event.target)) {
        closeProfileMenu()
      }
    }
    
    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape' && profileMenuOpen.value) {
        closeProfileMenu()
      }
    }
    
    onMounted(() => {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('click', handleClickOutside)
    })
    
    onUnmounted(() => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('click', handleClickOutside)
    })
    
    return {
      // Refs
      profileMenuOpen,
      profileDropdown,
      
      // Computed
      pageTitle,
      currentWarehouseName,
      realNotificationCount,
      isDarkMode,
      userName,
      roleName,
      
      // Methods
      getUserInitials,
      toggleDarkMode,
      showNotifications,
      handleLogout,
      toggleProfileMenu,
      closeProfileMenu
    }
  }
}
</script>