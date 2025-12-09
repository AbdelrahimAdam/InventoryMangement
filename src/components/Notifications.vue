<template>
  <div v-if="hasNotifications" class="fixed top-4 left-4 right-4 z-50 space-y-2 max-w-md mx-auto">
    <transition-group name="notification">
      <div 
        v-for="notification in visibleNotifications" 
        :key="notification.id"
        :class="[
          'p-4 rounded-lg shadow-lg border transform transition-all duration-300',
          notificationClasses[notification.type]
        ]"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 v-if="notification.title" class="font-semibold mb-1 text-sm">{{ notification.title }}</h3>
            <p class="text-sm">{{ notification.message }}</p>
          </div>
          <button 
            @click="removeNotification(notification.id)"
            class="mr-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex-shrink-0"
          >
            <CloseIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import CloseIcon from '@/components/icons/CloseIcon.vue'

const store = useStore()

const notificationClasses = {
  error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 shadow-red-200/20 dark:shadow-red-900/20',
  success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 shadow-green-200/20 dark:shadow-green-900/20',
  warning: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 shadow-yellow-200/20 dark:shadow-yellow-900/20',
  info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 shadow-blue-200/20 dark:shadow-blue-900/20'
}

const notifications = computed(() => store.state.notifications || [])
const visibleNotifications = computed(() => notifications.value.slice(0, 3))
const hasNotifications = computed(() => notifications.value.length > 0)

const removeNotification = (id) => {
  store.commit('REMOVE_NOTIFICATION', id)
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>