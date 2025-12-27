<template>
  <aside class="fixed top-0 right-0 z-50 h-full w-4/5 max-w-sm bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto border-l border-gray-200 dark:border-gray-700">
    <!-- Sidebar Header -->
    <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-3 space-x-reverse">
          <div class="h-10 w-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
            <span class="text-white font-bold text-sm">م</span>
          </div>
          <div>
            <h1 class="text-base font-bold text-gray-900 dark:text-white">نظام المخزون</h1>
            <p class="text-xs text-gray-600 dark:text-gray-400">البران للعطور</p>
          </div>
        </div>
        <button 
          @click="$emit('close')"
          class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- User Info -->
      <div class="flex items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div class="h-9 w-9 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center shadow-sm ml-3">
          <span class="text-white font-medium text-xs">
            {{ getUserInitials() }}
          </span>
        </div>
        <div class="text-right flex-1">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
            {{ userName }}
          </p>
          <p class="text-xs text-gray-600 dark:text-gray-400 truncate">
            {{ roleName }}
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation Links -->
    <div class="p-4 space-y-1">
      <!-- Dashboard Link -->
      <router-link 
        to="/" 
        @click="$emit('close')"
        class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent"
        :class="{
          'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 shadow-sm': $route.path === '/', 
          'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600': $route.path !== '/'
        }"
      >
        <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        لوحة التحكم
      </router-link>

      <!-- Warehouse Management (Superadmin only) -->
      <router-link 
        v-if="canManageWarehouses"
        to="/warehouses" 
        @click="$emit('close')"
        class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent"
        :class="{
          'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 shadow-sm': $route.path === '/warehouses', 
          'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600': $route.path !== '/warehouses'
        }"
      >
        <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
        إدارة المخازن
      </router-link>

      <!-- User Management (Superadmin only) -->
      <router-link 
        v-if="canManageUsers"
        to="/users" 
        @click="$emit('close')"
        class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent"
        :class="{
          'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 shadow-sm': $route.path === '/users', 
          'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600': $route.path !== '/users'
        }"
      >
        <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        إدارة المستخدمين
      </router-link>

      <!-- Inventory Link -->
      <router-link 
        to="/inventory" 
        @click="$emit('close')"
        class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent"
        :class="{
          'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 shadow-sm': $route.path.includes('/inventory'), 
          'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600': !$route.path.includes('/inventory')
        }"
      >
        <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
        </svg>
        الأصناف
      </router-link>

      <!-- Transactions Link -->
      <router-link 
        to="/transactions" 
        @click="$emit('close')"
        class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent"
        :class="{
          'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 shadow-sm': $route.path === '/transactions', 
          'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600': $route.path !== '/transactions'
        }"
      >
        <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        سجل الحركات
      </router-link>

      <!-- Invoices Link -->
      <router-link 
        v-if="canManageInvoices"
        to="/invoices" 
        @click="$emit('close')"
        class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent"
        :class="{
          'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 shadow-sm': $route.path.includes('/invoices'), 
          'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600': !$route.path.includes('/invoices')
        }"
      >
        <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
        </svg>
        الفواتير
      </router-link>

      <!-- Reports Link -->
      <router-link 
        v-if="canViewReports"
        to="/reports" 
        @click="$emit('close')"
        class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent"
        :class="{
          'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 shadow-sm': $route.path === '/reports', 
          'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600': $route.path !== '/reports'
        }"
      >
        <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        التقارير
      </router-link>

      <!-- Profile Link -->
      <router-link 
        to="/profile" 
        @click="$emit('close')"
        class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent"
        :class="{
          'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 shadow-sm': $route.path === '/profile', 
          'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600': $route.path !== '/profile'
        }"
      >
        <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        إعدادات الحساب
      </router-link>

      <!-- Quick Actions Section -->
      <div v-if="canModifyItems" class="mt-6 mb-2">
        <p class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
          إجراءات سريعة
        </p>
        <div class="space-y-2">
          <!-- Add Item Button -->
          <router-link 
            to="/inventory/add"
            @click="$emit('close')"
            class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent bg-gradient-to-l from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/10 hover:from-yellow-100 hover:to-yellow-50 dark:hover:from-yellow-900/30 dark:hover:to-yellow-900/20 text-yellow-700 dark:text-yellow-300 hover:border-yellow-300 dark:hover:border-yellow-700 shadow-sm"
          >
            <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            إضافة صنف جديد
          </router-link>

          <!-- Transfer Button -->
          <router-link 
            v-if="canTransfer"
            to="/transfers"
            @click="$emit('close')"
            class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent bg-gradient-to-l from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 hover:from-blue-100 hover:to-blue-50 dark:hover:from-blue-900/30 dark:hover:to-blue-900/20 text-blue-700 dark:text-blue-300 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm"
          >
            <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
            نقل بين المخازن
          </router-link>

          <!-- Dispatch Button -->
          <router-link 
            v-if="canDispatch"
            to="/dispatch"
            @click="$emit('close')"
            class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent bg-gradient-to-l from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 hover:from-green-100 hover:to-green-50 dark:hover:from-green-900/30 dark:hover:to-green-900/20 text-green-700 dark:text-green-300 hover:border-green-300 dark:hover:border-green-700 shadow-sm"
          >
            <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            صرف خارجي
          </router-link>

          <!-- Create Invoice Button -->
          <router-link 
            v-if="canCreateInvoice"
            to="/invoices/create"
            @click="$emit('close')"
            class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent bg-gradient-to-l from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 hover:from-purple-100 hover:to-purple-50 dark:hover:from-purple-900/30 dark:hover:to-purple-900/20 text-purple-700 dark:text-purple-300 hover:border-purple-300 dark:hover:border-purple-700 shadow-sm"
          >
            <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            إنشاء فاتورة
          </router-link>
        </div>
      </div>

      <!-- Logout Button -->
      <button 
        @click="handleLogout"
        class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mt-4 border border-transparent bg-gradient-to-l from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 hover:from-red-100 hover:to-red-50 dark:hover:from-red-900/30 dark:hover:to-red-900/20 text-red-700 dark:text-red-300 hover:border-red-300 dark:hover:border-red-700 shadow-sm"
      >
        <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        تسجيل خروج
      </button>
    </div>

    <!-- Footer Info -->
    <div class="mt-6 p-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>الإصدار 1.0.0</span>
        <span>{{ currentTime }}</span>
      </div>
    </div>
  </aside>
</template>

<script>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'MobileSidebar',
  emits: ['close'],
  setup(props, { emit }) {
    const store = useStore();
    const router = useRouter();
    
    // Time state
    const currentTime = ref('');
    
    // Update time function
    const updateTime = () => {
      const now = new Date();
      currentTime.value = now.toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    };
    
    // Start time updates
    onMounted(() => {
      updateTime();
      const timeInterval = setInterval(updateTime, 60000);
      
      onUnmounted(() => {
        clearInterval(timeInterval);
      });
    });
    
    // Store getters with proper error handling
    const userProfile = computed(() => store.getters.userProfile || {});
    const user = computed(() => store.state.user);
    const userRole = computed(() => store.getters.userRole || '');
    const allowedWarehouses = computed(() => {
      try {
        return store.getters.allowedWarehouses || [];
      } catch {
        return [];
      }
    });
    const userPermissions = computed(() => {
      try {
        return store.getters.userPermissions || [];
      } catch {
        return [];
      }
    });
    
    const userName = computed(() => {
      return userProfile.value?.name || userProfile.value?.email || user.value?.email || 'مستخدم';
    });
    
    const roleName = computed(() => {
      const names = {
        superadmin: 'المشرف العام',
        warehouse_manager: 'مدير المخازن',
        company_manager: 'مدير الشركة',
        user: 'مستخدم'
      };
      return names[userRole.value] || 'مستخدم';
    });
    
    const getUserInitials = () => {
      const name = userName.value;
      if (!name || name === 'مستخدم') return 'م';
      
      // Extract Arabic initials
      const arabicName = name.trim();
      if (arabicName.length === 0) return 'م';
      
      // Take the first character
      return arabicName.charAt(0);
    };
    
    // Permission getters - using store getters directly
    const canManageWarehouses = computed(() => store.getters.canManageWarehouses || false);
    const canManageUsers = computed(() => store.getters.canManageUsers || false);
    const canTransfer = computed(() => store.getters.canTransfer || false);
    const canDispatch = computed(() => store.getters.canDispatch || false);
    
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
    
    const canViewReports = computed(() => store.getters.canViewReports || false);
    
    // Invoice permissions
    const canManageInvoices = computed(() => store.getters.canManageInvoices || false);
    const canCreateInvoice = computed(() => store.getters.canCreateInvoice || false);
    const canEditInvoice = computed(() => store.getters.canEditInvoice || false);
    const canDeleteInvoice = computed(() => store.getters.canDeleteInvoice || false);
    const canExportInvoices = computed(() => store.getters.canExportInvoices || false);
    
    const handleLogout = async () => {
      try {
        emit('close');
        await store.dispatch('logout');
        router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ أثناء تسجيل الخروج'
        });
      }
    };
    
    return {
      // State
      currentTime,
      
      // User info
      userName,
      roleName,
      getUserInitials,
      
      // Permissions
      canManageWarehouses,
      canManageUsers,
      canModifyItems,
      canTransfer,
      canDispatch,
      canViewReports,
      canManageInvoices,
      canCreateInvoice,
      canEditInvoice,
      canDeleteInvoice,
      canExportInvoices,
      
      // Actions
      handleLogout
    };
  }
};
</script>

<style scoped>
/* Custom animations */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}

/* Enhanced hover effects */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.dark .hover-lift:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.dark .custom-scrollbar::-webkit-scrollbar-track {
  background: #374151;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Smooth transitions */
.transition-all {
  transition: all 0.3s ease;
}

/* RTL specific styles */
[dir="rtl"] .space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

/* Responsive improvements */
@media (max-width: 640px) {
  .p-4 {
    padding: 1rem;
  }
  
  .text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  
  .space-y-1 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));
    margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));
  }
}
</style>