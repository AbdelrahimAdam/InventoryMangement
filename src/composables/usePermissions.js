import { computed } from 'vue'
import { useStore } from 'vuex'

export function usePermissions() {
  const store = useStore()
  
  // Cache permission checks
  const userRole = computed(() => store.getters.userRole)
  const allowedWarehouses = computed(() => store.getters.allowedWarehouses || [])
  const userPermissions = computed(() => store.getters.userPermissions || [])
  
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
  
  const canManageUsers = computed(() => userRole.value === 'superadmin')
  const canManageWarehouses = computed(() => userRole.value === 'superadmin')
  const canDispatch = computed(() => {
    const role = userRole.value
    return role === 'superadmin' || 
           role === 'warehouse_manager' || 
           userPermissions.value.includes('dispatch_items')
  })
  
  const canViewReports = computed(() => {
    const role = userRole.value
    return ['superadmin', 'company_manager'].includes(role)
  })
  
  const initializePermissions = async () => {
    // Load permissions if needed
  }
  
  return {
    userRole,
    canModifyItems,
    canManageUsers,
    canManageWarehouses,
    canDispatch,
    canViewReports,
    initializePermissions
  }
}