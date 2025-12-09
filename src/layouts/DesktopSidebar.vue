<template>
  <aside :class="[
    'bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 shadow-lg',
    collapsed ? 'w-20' : 'w-64'
  ]">
    <!-- Sidebar Header -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-3 space-x-reverse" :class="{'justify-center': collapsed}">
        <div class="h-10 w-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
          <span class="text-white font-bold text-base">م</span>
        </div>
        <div v-if="!collapsed" class="min-w-0 flex-1">
          <h1 class="text-lg font-bold text-gray-800 dark:text-gray-100 truncate">نظام المخزون</h1>
          <p class="text-xs text-gray-600 dark:text-gray-400 truncate">البران للعطور</p>
        </div>
      </div>
    </div>

    <!-- User Profile -->
    <div class="p-3 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center" :class="{'justify-center': collapsed}">
        <div class="h-9 w-9 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center shadow-sm" :class="{'ml-3': !collapsed}">
          <span class="text-white font-medium text-xs">
            {{ getUserInitials() }}
          </span>
        </div>
        <div v-if="!collapsed" class="text-right flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
            {{ userName }}
          </p>
          <p class="text-xs text-gray-600 dark:text-gray-400 truncate">
            {{ roleName }}
          </p>
        </div>
      </div>
    </div>

    <!-- Collapse Button -->
    <div class="p-2 border-b border-gray-200 dark:border-gray-700">
      <button 
        @click="$emit('toggle')"
        class="w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center border border-gray-200 dark:border-gray-600 shadow-sm"
      >
        <CollapseIcon :collapsed="collapsed" />
        <span v-if="!collapsed" class="mr-2 text-xs text-gray-600 dark:text-gray-400">طي</span>
      </button>
    </div>

    <!-- Navigation Links -->
    <div class="flex-1 p-3 space-y-1 overflow-y-auto">
      <SidebarNavLinks :collapsed="collapsed" />
      
      <!-- Quick Actions -->
      <QuickActions v-if="canModifyItems" :collapsed="collapsed" />
      
      <!-- Logout Button -->
      <button 
        @click="handleLogout"
        class="w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mt-2 border border-transparent bg-gradient-to-l from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 hover:from-red-100 hover:to-red-50 dark:hover:from-red-900/30 dark:hover:to-red-900/20 text-red-700 dark:text-red-300 hover:border-red-300 dark:hover:border-red-700 shadow-sm"
        :class="{'justify-center': collapsed}"
        :title="collapsed ? 'تسجيل خروج' : ''"
      >
        <LogoutIcon />
        <span v-if="!collapsed" class="mr-2">تسجيل خروج</span>
      </button>
    </div>
  </aside>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import CollapseIcon from '@/components/icons/CollapseIcon.vue'
import LogoutIcon from '@/components/icons/LogoutIcon.vue'
import SidebarNavLinks from '@/components/layout/SidebarNavLinks.vue'
import QuickActions from '@/components/layout/QuickActions.vue'

export default {
  name: 'DesktopSidebar',
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle'],
  setup(props, { emit }) {
    const store = useStore()
    const router = useRouter()
    
    const userProfile = computed(() => store.state.userProfile)
    const user = computed(() => store.state.user)
    const userRole = computed(() => store.getters.userRole)
    const userPermissions = computed(() => store.getters.userPermissions || [])
    const allowedWarehouses = computed(() => store.getters.allowedWarehouses || [])
    
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
    
    const handleLogout = async () => {
      try {
        await store.dispatch('logout')
        router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
        router.push('/login')
      }
    }
    
    const toggleSidebar = () => {
      emit('toggle')
    }
    
    return {
      userName,
      roleName,
      getUserInitials,
      canModifyItems,
      handleLogout,
      toggleSidebar
    }
  }
}
</script>