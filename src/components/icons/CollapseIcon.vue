<template>
  <div>
    <!-- Logout Button -->
    <button class="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
      <LogoutIcon size="sm" color="danger" />
      <span class="text-sm font-medium">تسجيل الخروج</span>
    </button>

    <!-- Close Button -->
    <button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
      <CloseIcon size="md" color="gray" aria-label="إغلاق النافذة" />
    </button>

    <!-- Collapse Toggle -->
    <button 
      @click="toggleCollapse"
      class="flex items-center justify-between w-full p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
      :aria-expanded="!isCollapsed"
    >
      <span>القائمة</span>
      <CollapseIcon 
        :collapsed="isCollapsed"
        size="sm"
        color="gray"
        :aria-label-collapsed="'فتح القائمة'"
        :aria-label-expanded="'طي القائمة'"
      />
    </button>
  </div>
</template>

<script>
import { LogoutIcon, CloseIcon, CollapseIcon } from '@/icons';

export default {
  components: {
    LogoutIcon,
    CloseIcon,
    CollapseIcon
  },
  data() {
    return {
      isCollapsed: false
    }
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    }
  }
}
</script>