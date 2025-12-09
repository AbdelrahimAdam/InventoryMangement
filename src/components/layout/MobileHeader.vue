<template>
  <header class="sticky top-0 z-30 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="px-3 py-2.5">
      <div class="flex items-center justify-between">
        <!-- Left: Menu button -->
        <button 
          @click="$emit('toggle-menu')"
          class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
          aria-label="القائمة"
        >
          <svg class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Center: Page title -->
        <div class="flex-1 text-center px-2">
          <h1 class="text-base font-bold text-gray-800 dark:text-gray-100 truncate">
            {{ pageTitle }}
          </h1>
          <p v-if="currentWarehouseName" class="text-xs text-yellow-600 dark:text-yellow-400 truncate mt-0.5">
            {{ currentWarehouseName }}
          </p>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center space-x-1 space-x-reverse">
          <button 
            @click="toggleDarkMode"
            class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
            aria-label="تبديل الوضع"
          >
            <svg v-if="isDarkMode" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
            </svg>
            <svg v-else class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
            </svg>
          </button>

          <button 
            @click="showNotifications"
            class="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
            aria-label="الإشعارات"
          >
            <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span v-if="realNotificationCount > 0" class="absolute -top-1 -left-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-md">
              {{ realNotificationCount > 9 ? '9+' : realNotificationCount }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'MobileHeader',
  emits: ['toggle-menu'],
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    
    const notifications = computed(() => store.state.notifications || []);
    const realNotificationCount = computed(() => notifications.value.length);
    const currentWarehouseName = computed(() => {
      const mainWarehouse = store.getters.mainWarehouse;
      return mainWarehouse?.name_ar || '';
    });
    const isDarkMode = computed(() => {
      return document.documentElement.classList.contains('dark');
    });
    
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
      };
      return titles[route.name] || 'نظام المخزون';
    });
    
    const toggleDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    };
    
    const showNotifications = () => {
      router.push('/transactions');
    };
    
    const toggleMenu = () => {
      emit('toggle-menu');
    };
    
    return {
      pageTitle,
      currentWarehouseName,
      realNotificationCount,
      isDarkMode,
      toggleDarkMode,
      showNotifications,
      toggleMenu
    };
  }
};
</script>