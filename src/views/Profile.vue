<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Navigation -->
          <div class="flex items-center space-x-4 space-x-reverse">
            <router-link to="/" class="flex items-center space-x-2 space-x-reverse hover:opacity-80 transition-opacity">
              <div class="h-8 w-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">م</span>
              </div>
              <div>
                <h1 class="text-lg font-bold text-gray-900 dark:text-white">الملف الشخصي</h1>
                <p class="text-xs text-gray-500 dark:text-gray-400">نظام إدارة المخزون</p>
              </div>
            </router-link>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-3 space-x-reverse">
            <router-link 
              to="/" 
              class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              الرئيسية
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Profile Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Profile Header -->
        <div class="px-6 py-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
          <div class="flex flex-col md:flex-row md:items-center gap-6">
            <div class="flex-shrink-0">
              <div class="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <span class="text-white text-2xl font-bold">{{ getUserInitials(userProfile?.name) }}</span>
              </div>
            </div>
            
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ userProfile?.name }}</h2>
              <p class="text-gray-600 dark:text-gray-400 mt-1">{{ userProfile?.email }}</p>
              
              <div class="flex flex-wrap gap-3 mt-4">
                <span :class="roleBadgeClass">
                  {{ getRoleText(userRole) }}
                </span>
                
                <span class="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <svg class="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ userProfile?.is_active === false ? 'غير نشيط' : 'نشيط' }}
                </span>
                
                <span v-if="lastLogin" class="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  <svg class="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  آخر تسجيل: {{ lastLogin }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Content -->
        <div class="px-6 py-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Personal Information -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                <svg class="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                المعلومات الشخصية
              </h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">اسم المستخدم</label>
                  <div class="text-gray-900 dark:text-white">{{ user?.email?.split('@')[0] || userProfile?.name }}</div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">البريد الإلكتروني</label>
                  <div class="text-gray-900 dark:text-white">{{ userProfile?.email }}</div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">رقم الهاتف</label>
                  <div class="text-gray-900 dark:text-white">{{ userProfile?.phone || 'غير محدد' }}</div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">تاريخ التسجيل</label>
                  <div class="text-gray-900 dark:text-white">{{ formatDate(userProfile?.created_at) }}</div>
                </div>
              </div>
            </div>

            <!-- Account Information -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                <svg class="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                معلومات الحساب
              </h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">الدور</label>
                  <div class="text-gray-900 dark:text-white">{{ getRoleDescription(userRole) }}</div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">الصلاحيات</label>
                  <div class="text-gray-900 dark:text-white">{{ getPermissionsDescription(userRole) }}</div>
                </div>
                
                <div v-if="userRole === 'warehouse_manager'">
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">المخازن المسموحة</label>
                  <div class="text-gray-900 dark:text-white">
                    <div v-if="allowedWarehouses.length > 0">
                      <div v-for="warehouse in allowedWarehouses" :key="warehouse.id" class="mb-1">
                        • {{ getWarehouseLabel(warehouse) }}
                      </div>
                    </div>
                    <div v-else class="text-gray-500 dark:text-gray-400">
                      لا توجد مخازن مخصصة
                    </div>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">آخر تسجيل دخول</label>
                  <div class="text-gray-900 dark:text-white">{{ formatDate(userProfile?.last_login) || 'غير متوفر' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Section -->
          <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <svg class="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-6a3 3 0 110-6 3 3 0 010 6zm2 7a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              الأمان والحماية
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Change Password -->
              <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">تغيير كلمة المرور</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  قم بتغيير كلمة المرور الخاصة بك بشكل دوري للحفاظ على أمان حسابك
                </p>
                <button 
                  @click="showChangePasswordModal = true"
                  class="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                  </svg>
                  تغيير كلمة المرور
                </button>
              </div>

              <!-- Session Management -->
              <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">إدارة الجلسات</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  عرض وإدارة جميع جلسات تسجيل الدخول النشطة على جهازك
                </p>
                <button 
                  @click="manageSessions"
                  class="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                  </svg>
                  إدارة الجلسات
                </button>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div class="flex flex-wrap gap-4">
              <button 
                @click="editProfile"
                class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
              >
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                تعديل المعلومات
              </button>
              
              <button 
                @click="logoutAllDevices"
                class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-sm"
              >
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                تسجيل خروج من جميع الأجهزة
              </button>
              
              <button 
                @click="logout"
                class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-sm"
              >
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                تسجيل خروج
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Change Password Modal -->
    <ResetPasswordModal 
      v-if="showChangePasswordModal"
      :show="showChangePasswordModal"
      :user-id="currentUserId"
      @close="showChangePasswordModal = false"
      @saved="handlePasswordChanged"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ResetPasswordModal from '@/components/users/ResetPasswordModal.vue';

export default {
  name: 'Profile',
  components: {
    ResetPasswordModal
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    
    const showChangePasswordModal = ref(false);
    
    // Computed properties
    const user = computed(() => store.state.user);
    const userProfile = computed(() => store.state.userProfile);
    const userRole = computed(() => store.getters.userRole);
    const currentUserId = computed(() => user.value?.uid);
    
    const allowedWarehouses = computed(() => {
      const warehouseIds = userProfile.value?.allowed_warehouses || [];
      const warehouses = store.state.warehouses || [];
      return warehouses.filter(w => warehouseIds.includes(w.id));
    });
    
    const lastLogin = computed(() => {
      if (!userProfile.value?.last_login) return null;
      const date = new Date(userProfile.value.last_login);
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    });
    
    const roleBadgeClass = computed(() => {
      const classes = {
        superadmin: 'px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white',
        warehouse_manager: 'px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
        company_manager: 'px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white'
      };
      return classes[userRole.value] || 'px-3 py-1 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    });
    
    // Methods
    const getUserInitials = (name) => {
      if (!name) return '?';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };
    
    const getRoleText = (role) => {
      const roles = {
        superadmin: 'المشرف العام',
        warehouse_manager: 'مدير المخازن',
        company_manager: 'مدير الشركة'
      };
      return roles[role] || 'مستخدم';
    };
    
    const getRoleDescription = (role) => {
      const descriptions = {
        superadmin: 'صلاحيات كاملة على النظام',
        warehouse_manager: 'إدارة المخزون في المخازن المسموحة',
        company_manager: 'عرض التقارير ومراقبة المخزون'
      };
      return descriptions[role] || 'مستخدم عادي';
    };
    
    const getPermissionsDescription = (role) => {
      const permissions = {
        superadmin: 'جميع الصلاحيات',
        warehouse_manager: 'إدارة المخزون، النقل، الصرف في المخازن المسموحة',
        company_manager: 'عرض المخزون، التقارير، الإحصائيات'
      };
      return permissions[role] || 'صلاحيات محدودة';
    };
    
    const getWarehouseLabel = (warehouse) => {
      return warehouse.name_ar || warehouse.id;
    };
    
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    const editProfile = () => {
      // Navigate to edit profile or show modal
      alert('ميزة تعديل الملف الشخصي قريباً...');
    };
    
    const manageSessions = () => {
      alert('ميزة إدارة الجلسات قريباً...');
    };
    
    const logoutAllDevices = async () => {
      if (confirm('هل تريد تسجيل الخروج من جميع الأجهزة؟\nسيتم تسجيل خروجك من جميع الجلسات النشطة.')) {
        try {
          // Implement logout from all devices
          alert('تم تسجيل الخروج من جميع الأجهزة');
        } catch (error) {
          console.error('Error logging out from all devices:', error);
          alert('حدث خطأ أثناء تسجيل الخروج من جميع الأجهزة');
        }
      }
    };
    
    const logout = async () => {
      if (confirm('هل تريد تسجيل الخروج؟')) {
        try {
          await store.dispatch('logout');
          router.push('/login');
        } catch (error) {
          console.error('Logout error:', error);
          alert('حدث خطأ أثناء تسجيل الخروج');
        }
      }
    };
    
    const handlePasswordChanged = () => {
      showChangePasswordModal.value = false;
      alert('تم تغيير كلمة المرور بنجاح');
    };
    
    return {
      // State
      showChangePasswordModal,
      
      // Computed
      user,
      userProfile,
      userRole,
      currentUserId,
      allowedWarehouses,
      lastLogin,
      roleBadgeClass,
      
      // Methods
      getUserInitials,
      getRoleText,
      getRoleDescription,
      getPermissionsDescription,
      getWarehouseLabel,
      formatDate,
      editProfile,
      manageSessions,
      logoutAllDevices,
      logout,
      handlePasswordChanged
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Cairo', sans-serif;
}

.space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}
</style>