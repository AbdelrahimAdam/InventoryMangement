<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">إدارة المستخدمين</h2>
          <p class="text-sm text-gray-600 mt-1">إدارة صلاحيات المستخدمين والمخازن</p>
        </div>
        <button 
          @click="showAddUserModal = true"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
          :disabled="!canCreateUsers"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          إضافة مستخدم جديد
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white shadow rounded-lg p-4">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-blue-100">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div class="mr-3">
            <p class="text-sm text-gray-500">إجمالي المستخدمين</p>
            <p class="text-2xl font-semibold text-gray-900">{{ users.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-4">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-green-100">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="mr-3">
            <p class="text-sm text-gray-500">المستخدمين النشطين</p>
            <p class="text-2xl font-semibold text-gray-900">{{ activeUsersCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-4">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-purple-100">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div class="mr-3">
            <p class="text-sm text-gray-500">مديري المخازن</p>
            <p class="text-2xl font-semibold text-gray-900">{{ warehouseManagersCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-4">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-orange-100">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="mr-3">
            <p class="text-sm text-gray-500">المشرفين</p>
            <p class="text-2xl font-semibold text-gray-900">{{ superAdminsCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white shadow rounded-lg p-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">جاري تحميل بيانات المستخدمين...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="text-sm font-medium text-red-800">خطأ في تحميل البيانات</h3>
          <p class="text-sm text-red-700 mt-1">{{ error }}</p>
          <button @click="loadUsers" class="mt-2 text-sm font-medium text-red-600 hover:text-red-500">
            المحاولة مرة أخرى
          </button>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 class="text-lg font-medium text-gray-900">المستخدمين المسجلين</h3>
          <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="بحث بالبريد أو الاسم أو الدور..."
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1"
            >
            <div class="flex gap-2">
              <select
                v-model="roleFilter"
                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">كل الأدوار</option>
                <option value="superadmin">المشرف العام</option>
                <option value="warehouse_manager">مدير المخازن</option>
                <option value="company_manager">مدير الشركة</option>
              </select>
              <select
                v-model="statusFilter"
                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">كل الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop Table -->
      <div v-if="filteredUsers.length > 0" class="hidden md:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المستخدم</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الدور</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المخازن المسموحة</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الإنشاء</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span class="text-indigo-600 font-medium text-sm">
                      {{ getUserInitials(user.name || user.email) }}
                    </span>
                  </div>
                  <div class="mr-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name || 'بدون اسم' }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                    <div v-if="user.phone" class="text-xs text-gray-400">{{ user.phone }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getRoleBadgeClass(user.role)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ getRoleDisplayName(user.role) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs">
                  <span v-if="user.allowed_warehouses && user.allowed_warehouses.length > 0">
                    <div class="flex flex-wrap gap-1">
                      <span v-for="warehouse in getWarehouseNames(user.allowed_warehouses)" :key="warehouse" 
                            class="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-800">
                        {{ warehouse }}
                      </span>
                    </div>
                  </span>
                  <span v-else class="text-gray-400">جميع المخازن</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ user.is_active ? 'نشط' : 'غير نشط' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3 space-x-reverse">
                <button
                  @click="editUser(user)"
                  :disabled="!canEditUser(user)"
                  class="text-indigo-600 hover:text-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  تعديل
                </button>
                <button
                  v-if="user.id !== currentUserId && user.role !== 'superadmin'"
                  @click="confirmDeleteUser(user)"
                  class="text-red-600 hover:text-red-900 transition-colors duration-200"
                >
                  حذف
                </button>
                <button
                  v-if="user.id !== currentUserId"
                  @click="resetPassword(user)"
                  class="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                >
                  إعادة تعيين كلمة المرور
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div v-if="filteredUsers.length > 0" class="md:hidden">
        <div v-for="user in filteredUsers" :key="user.id" class="border-b border-gray-200 p-4">
          <div class="flex justify-between items-start mb-2">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-indigo-600 font-medium text-xs">
                  {{ getUserInitials(user.name || user.email) }}
                </span>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">{{ user.name || 'بدون اسم' }}</div>
                <div class="text-sm text-gray-500">{{ user.email }}</div>
              </div>
            </div>
            <div class="flex flex-col items-end gap-1">
              <span :class="getRoleBadgeClass(user.role)" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium">
                {{ getRoleDisplayName(user.role) }}
              </span>
              <span :class="user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium">
                {{ user.is_active ? 'نشط' : 'غير نشط' }}
              </span>
            </div>
          </div>
          
          <div class="text-sm text-gray-600 mb-2">
            <span v-if="user.allowed_warehouses && user.allowed_warehouses.length > 0">
              <div class="font-medium mb-1">المخازن المسموحة:</div>
              <div class="flex flex-wrap gap-1">
                <span v-for="warehouse in getWarehouseNames(user.allowed_warehouses)" :key="warehouse" 
                      class="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-800">
                  {{ warehouse }}
                </span>
              </div>
            </span>
          </div>
          
          <div class="text-xs text-gray-500 mb-3">
            أنشئ في: {{ formatDate(user.created_at) }}
          </div>
          
          <div class="flex flex-wrap gap-2">
            <button
              @click="editUser(user)"
              :disabled="!canEditUser(user)"
              class="text-indigo-600 hover:text-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed text-sm transition-colors duration-200"
            >
              تعديل
            </button>
            <button
              v-if="user.id !== currentUserId && user.role !== 'superadmin'"
              @click="confirmDeleteUser(user)"
              class="text-red-600 hover:text-red-900 text-sm transition-colors duration-200"
            >
              حذف
            </button>
            <button
              v-if="user.id !== currentUserId"
              @click="resetPassword(user)"
              class="text-blue-600 hover:text-blue-900 text-sm transition-colors duration-200"
            >
              إعادة تعيين كلمة المرور
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredUsers.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          {{ searchQuery || roleFilter || statusFilter ? 'لم يتم العثور على مستخدمين' : 'لا يوجد مستخدمين' }}
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ searchQuery || roleFilter || statusFilter ? 'جرب مصطلحات بحث مختلفة' : 'ابدأ بإضافة أول مستخدم للنظام' }}
        </p>
        <button
          v-if="!searchQuery && canCreateUsers"
          @click="showAddUserModal = true"
          class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
        >
          إضافة مستخدم جديد
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="filteredUsers.length > itemsPerPage" class="px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            عرض <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
            إلى <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }}</span>
            من <span class="font-medium">{{ filteredUsers.length }}</span> مستخدم
          </div>
          <div class="flex gap-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              السابق
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage * itemsPerPage >= filteredUsers.length"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              التالي
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <UserModal
      :isOpen="showAddUserModal || showEditUserModal"
      :user="editingUser"
      @close="closeModal"
      @save="handleSaveUser"
    />

    <!-- Reset Password Modal -->
    <ResetPasswordModal
      :isOpen="showResetPasswordModal"
      :user="userToResetPassword"
      @close="closeResetPasswordModal"
      @reset="handleResetPassword"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-if="userToDelete"
      :isOpen="!!userToDelete"
      title="تأكيد الحذف"
      :message="`هل أنت متأكد من رغبتك في حذف المستخدم ${userToDelete.email}؟`"
      confirmText="حذف"
      cancelText="إلغاء"
      variant="danger"
      @confirm="deleteUser"
      @cancel="userToDelete = null"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import UserModal from './UserModal.vue';
import ResetPasswordModal from './ResetPasswordModal.vue';
import ConfirmModal from '@/components/shared/ConfirmModal.vue';

export default {
  name: 'UserManagement',
  components: { UserModal, ResetPasswordModal, ConfirmModal },
  setup() {
    const store = useStore();

    const showAddUserModal = ref(false);
    const showEditUserModal = ref(false);
    const showResetPasswordModal = ref(false);
    const editingUser = ref(null);
    const userToDelete = ref(null);
    const userToResetPassword = ref(null);
    const searchQuery = ref('');
    const roleFilter = ref('');
    const statusFilter = ref('');
    const users = ref([]);
    const loading = ref(true);
    const error = ref('');
    const currentPage = ref(1);
    const itemsPerPage = 10;

    // Computed properties
    const currentUserId = computed(() => store.state.user?.uid);
    const canCreateUsers = computed(() => store.getters.userRole === 'superadmin');
    const warehouses = computed(() => store.state.warehouses);

    const activeUsersCount = computed(() => 
      users.value.filter(u => u.is_active).length
    );

    const warehouseManagersCount = computed(() => 
      users.value.filter(u => u.role === 'warehouse_manager').length
    );

    const superAdminsCount = computed(() => 
      users.value.filter(u => u.role === 'superadmin').length
    );

    const filteredUsers = computed(() => {
      let filtered = users.value;

      // Apply search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(u =>
          u.email.toLowerCase().includes(query) ||
          (u.name && u.name.toLowerCase().includes(query)) ||
          (u.role && getRoleDisplayName(u.role).toLowerCase().includes(query)) ||
          (u.phone && u.phone.includes(query))
        );
      }

      // Apply role filter
      if (roleFilter.value) {
        filtered = filtered.filter(u => u.role === roleFilter.value);
      }

      // Apply status filter
      if (statusFilter.value) {
        filtered = filtered.filter(u => 
          statusFilter.value === 'active' ? u.is_active : !u.is_active
        );
      }

      return filtered;
    });

    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredUsers.value.slice(start, end);
    });

    // Helper functions
    const getRoleDisplayName = (role) => ({
      superadmin: 'المشرف العام',
      warehouse_manager: 'مدير المخازن',
      company_manager: 'مدير الشركة'
    }[role] || role);

    const getRoleBadgeClass = (role) => ({
      superadmin: 'bg-purple-100 text-purple-800',
      warehouse_manager: 'bg-blue-100 text-blue-800',
      company_manager: 'bg-green-100 text-green-800'
    }[role] || 'bg-gray-100 text-gray-800');

    const getUserInitials = (name) => {
      if (!name) return '?';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const getWarehouseNames = (warehouseIds) => {
      return warehouseIds.map(id => {
        const warehouse = warehouses.value.find(w => w.id === id);
        return warehouse ? warehouse.name_ar : id;
      });
    };

    const formatDate = (date) => {
      if (!date) return '-';
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const canEditUser = (user) => {
      // Superadmin can edit all users except themselves (for role changes)
      if (store.getters.userRole === 'superadmin') {
        return user.id !== currentUserId.value || user.role !== 'superadmin';
      }
      return false;
    };

    // Data loading
    const loadUsers = async () => {
      if (store.getters.userRole !== 'superadmin') {
        error.value = 'ليس لديك صلاحية لعرض المستخدمين';
        loading.value = false;
        return;
      }

      loading.value = true;
      error.value = '';
      
      try {
        users.value = await store.dispatch('loadAllUsers');
        console.log('Users loaded successfully:', users.value);
      } catch (err) {
        console.error('Error loading users:', err);
        error.value = err.message || 'فشل في تحميل المستخدمين';
        users.value = [];
      } finally {
        loading.value = false;
      }
    };

    // User actions
    const editUser = (user) => {
      if (!canEditUser(user)) {
        alert('ليس لديك صلاحية لتعديل هذا المستخدم');
        return;
      }
      editingUser.value = { ...user };
      showEditUserModal.value = true;
    };

    const confirmDeleteUser = (user) => { 
      if (user.id === currentUserId.value) {
        alert('لا يمكن حذف حسابك الشخصي');
        return;
      }
      if (user.role === 'superadmin') {
        alert('لا يمكن حذف حساب المشرف العام');
        return;
      }
      userToDelete.value = user; 
    };

    const resetPassword = (user) => {
      userToResetPassword.value = user;
      showResetPasswordModal.value = true;
    };

    const deleteUser = async () => {
      if (!userToDelete.value) return;
      
      try {
        await store.dispatch('deleteUser', userToDelete.value.id);
        await loadUsers(); // Refresh users list
        alert('تم حذف المستخدم بنجاح');
      } catch (err) {
        console.error('Error deleting user:', err);
        alert(`خطأ في حذف المستخدم: ${err.message}`);
      } finally {
        userToDelete.value = null;
      }
    };

    // Modal handling
    const closeModal = () => {
      showAddUserModal.value = false;
      showEditUserModal.value = false;
      editingUser.value = null;
    };

    const closeResetPasswordModal = () => {
      showResetPasswordModal.value = false;
      userToResetPassword.value = null;
    };

    const handleSaveUser = async (userData) => {
      try {
        if (userData.id) {
          // Update existing user
          await store.dispatch('updateUser', {
            userId: userData.id,
            userData: userData
          });
          alert('تم تحديث المستخدم بنجاح');
        } else {
          // Create new user
          const password = userData.password;
          delete userData.password;
          
          const newUser = await store.dispatch('createUser', {
            userData,
            password
          });
          
          alert(`تم إنشاء المستخدم ${newUser.name} بنجاح\nالبريد: ${newUser.email}\nكلمة المرور: ${password}`);
        }
        
        await loadUsers(); // Refresh users list
        closeModal();
      } catch (err) {
        console.error('Error saving user:', err);
        alert(`خطأ في حفظ المستخدم: ${err.message}`);
      }
    };

    const handleResetPassword = async (data) => {
      try {
        await store.dispatch('updateUserPassword', {
          userId: data.userId,
          newPassword: data.newPassword
        });
        
        alert('تم إعادة تعيين كلمة المرور بنجاح');
        closeResetPasswordModal();
      } catch (err) {
        console.error('Error resetting password:', err);
        alert(`خطأ في إعادة تعيين كلمة المرور: ${err.message}`);
      }
    };

    // Watchers
    watch([searchQuery, roleFilter, statusFilter], () => {
      currentPage.value = 1; // Reset to first page when filters change
    });

    // Lifecycle
    onMounted(() => {
      if (store.getters.userRole === 'superadmin') {
        loadUsers();
      }
    });

    return {
      showAddUserModal,
      showEditUserModal,
      showResetPasswordModal,
      editingUser,
      userToDelete,
      userToResetPassword,
      searchQuery,
      roleFilter,
      statusFilter,
      users: paginatedUsers,
      filteredUsers,
      loading,
      error,
      currentPage,
      itemsPerPage,
      currentUserId,
      canCreateUsers,
      activeUsersCount,
      warehouseManagersCount,
      superAdminsCount,
      getRoleDisplayName,
      getRoleBadgeClass,
      getUserInitials,
      getWarehouseNames,
      formatDate,
      canEditUser,
      editUser,
      confirmDeleteUser,
      resetPassword,
      deleteUser,
      closeModal,
      closeResetPasswordModal,
      handleSaveUser,
      handleResetPassword
    };
  }
};
</script>