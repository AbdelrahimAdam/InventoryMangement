<template>
  <div>
    <!-- Dashboard Link -->
    <router-link 
      to="/" 
      class="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group border border-transparent"
      :class="getLinkClasses('/')"
      :title="collapsed ? 'لوحة التحكم' : ''"
    >
      <svg class="w-4 h-4" :class="{'ml-3': !collapsed}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>
      <span v-if="!collapsed" class="mr-2">لوحة التحكم</span>
    </router-link>

    <!-- Warehouse Management (Superadmin only) -->
    <router-link 
      v-if="canManageWarehouses"
      to="/warehouses" 
      class="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group border border-transparent"
      :class="getLinkClasses('/warehouses')"
      :title="collapsed ? 'إدارة المخازن' : ''"
    >
      <svg class="w-4 h-4" :class="{'ml-3': !collapsed}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
      </svg>
      <span v-if="!collapsed" class="mr-2">إدارة المخازن</span>
    </router-link>

    <!-- User Management (Superadmin only) -->
    <router-link 
      v-if="canManageUsers"
      to="/users" 
      class="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group border border-transparent"
      :class="getLinkClasses('/users')"
      :title="collapsed ? 'إدارة المستخدمين' : ''"
    >
      <svg class="w-4 h-4" :class="{'ml-3': !collapsed}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
      <span v-if="!collapsed" class="mr-2">إدارة المستخدمين</span>
    </router-link>

    <!-- Inventory Link -->
    <router-link 
      to="/inventory" 
      class="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group border border-transparent"
      :class="getLinkClasses('/inventory', true)"
      :title="collapsed ? 'الأصناف' : ''"
    >
      <svg class="w-4 h-4" :class="{'ml-3': !collapsed}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
      </svg>
      <span v-if="!collapsed" class="mr-2">الأصناف</span>
    </router-link>

    <!-- Transactions Link -->
    <router-link 
      to="/transactions" 
      class="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group border border-transparent"
      :class="getLinkClasses('/transactions')"
      :title="collapsed ? 'سجل الحركات' : ''"
    >
      <svg class="w-4 h-4" :class="{'ml-3': !collapsed}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
      <span v-if="!collapsed" class="mr-2">سجل الحركات</span>
    </router-link>

    <!-- Reports Link -->
    <router-link 
      v-if="canViewReports"
      to="/reports" 
      class="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group border border-transparent"
      :class="getLinkClasses('/reports')"
      :title="collapsed ? 'التقارير' : ''"
    >
      <svg class="w-4 h-4" :class="{'ml-3': !collapsed}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
      <span v-if="!collapsed" class="mr-2">التقارير</span>
    </router-link>

    <!-- Profile Link -->
    <router-link 
      to="/profile" 
      class="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group border border-transparent"
      :class="getLinkClasses('/profile')"
      :title="collapsed ? 'إعدادات الحساب' : ''"
    >
      <svg class="w-4 h-4" :class="{'ml-3': !collapsed}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
      <span v-if="!collapsed" class="mr-2">إعدادات الحساب</span>
    </router-link>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: 'SidebarNavLinks',
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const store = useStore()
    const route = useRoute()
    
    const userRole = computed(() => store.getters.userRole)
    
    const canManageUsers = computed(() => store.getters.canManageUsers)
    const canManageWarehouses = computed(() => store.getters.canManageWarehouses)
    const canViewReports = computed(() => {
      const role = userRole.value
      return ['superadmin', 'company_manager'].includes(role)
    })
    
    const getLinkClasses = (path, isIncludes = false) => {
      const isActive = isIncludes ? route.path.includes(path) : route.path === path
      return {
        'bg-gradient-to-l from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/10 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 shadow-sm': isActive,
        'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600': !isActive,
        'justify-center': props.collapsed
      }
    }
    
    return {
      canManageUsers,
      canManageWarehouses,
      canViewReports,
      getLinkClasses
    }
  }
}
</script>