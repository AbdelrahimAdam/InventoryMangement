<template>
  <div class="flex items-center" :class="{'justify-center': collapsed}">
    <div class="h-9 w-9 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center shadow-sm" :class="{'ml-3': !collapsed}">
      <span class="text-white font-medium text-xs">
        {{ userInitials }}
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
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const store = useStore()

const userProfile = computed(() => store.state.userProfile)
const userRole = computed(() => store.getters.userRole)

const userName = computed(() => {
  return userProfile.value?.name || userProfile.value?.email || 'مستخدم'
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

const userInitials = computed(() => {
  const name = userName.value
  if (!name || name === 'مستخدم') return 'م'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
})
</script>