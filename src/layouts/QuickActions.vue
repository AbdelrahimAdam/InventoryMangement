<template>
  <div>
    <!-- Quick Actions Section -->
    <div v-if="!collapsed" class="mt-4 mb-2">
      <p class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
        إجراءات سريعة
      </p>
      <div class="space-y-1.5">
        <!-- Add Item Button -->
        <router-link 
          to="/inventory/add"
          class="w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent bg-gradient-to-l from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/10 hover:from-yellow-100 hover:to-yellow-50 dark:hover:from-yellow-900/30 dark:hover:to-yellow-900/20 text-yellow-700 dark:text-yellow-300 hover:border-yellow-300 dark:hover:border-yellow-700 shadow-sm"
        >
          <svg class="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span class="mr-2">إضافة صنف</span>
        </router-link>

        <!-- Transfer Button -->
        <router-link 
          to="/transfers"
          class="w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent bg-gradient-to-l from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 hover:from-blue-100 hover:to-blue-50 dark:hover:from-blue-900/30 dark:hover:to-blue-900/20 text-blue-700 dark:text-blue-300 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm"
        >
          <svg class="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
          </svg>
          <span class="mr-2">نقل</span>
        </router-link>

        <!-- Dispatch Button -->
        <router-link 
          v-if="canDispatch"
          to="/dispatch"
          class="w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent bg-gradient-to-l from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 hover:from-green-100 hover:to-green-50 dark:hover:from-green-900/30 dark:hover:to-green-900/20 text-green-700 dark:text-green-300 hover:border-green-300 dark:hover:border-green-700 shadow-sm"
        >
          <svg class="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span class="mr-2">صرف</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'QuickActions',
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const store = useStore();
    
    // Store getters
    const userRole = computed(() => store.getters.userRole);
    const userPermissions = computed(() => store.getters.userPermissions || []);
    const allowedWarehouses = computed(() => store.getters.allowedWarehouses || []);
    
    // Permission checks
    const canModifyItems = computed(() => {
      const role = userRole.value;
      if (role === 'superadmin') return true;
      
      if (role === 'warehouse_manager') {
        const hasWarehouses = allowedWarehouses.value.length > 0;
        const hasPermission = userPermissions.value.includes('full_access') || 
                            userPermissions.value.includes('manage_inventory');
        return hasWarehouses && hasPermission;
      }
      
      return false;
    });
    
    const canDispatch = computed(() => store.getters.canDispatch);
    
    return {
      canModifyItems,
      canDispatch
    };
  }
};
</script>