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
                <h1 class="text-lg font-bold text-gray-900 dark:text-white">إدارة المستخدمين</h1>
                <p class="text-xs text-gray-500 dark:text-gray-400">نظام إدارة المخزون</p>
              </div>
            </router-link>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-3 space-x-reverse">
            <button 
              @click="showAddModal = true"
              class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
            >
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              مستخدم جديد
            </button>
            
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

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center ml-4">
              <svg class="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 3.714a6 6 0 00-13 0"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">إجمالي المستخدمين</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(totalUsers) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center ml-4">
              <svg class="h-6 w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">نشطين</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(activeUsers) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center ml-4">
              <svg class="h-6 w-6 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">مديري المخازن</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(warehouseManagers) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center ml-4">
              <svg class="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A7.968 7.968 0 015 16c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8c0-1.104.188-2.169.535-3.164"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">آخر تسجيل</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">{{ lastLoginTime }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex-1">
            <div class="relative">
              <input
                type="text"
                v-model="searchTerm"
                @input="handleSearch"
                placeholder="ابحث باسم المستخدم، البريد الإلكتروني، أو الدور..."
                class="w-full pr-12 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="flex space-x-3 space-x-reverse">
            <!-- Role Filter -->
            <select 
              v-model="roleFilter"
              @change="handleFilter"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع الأدوار</option>
              <option value="superadmin">المشرف العام</option>
              <option value="warehouse_manager">مدير المخازن</option>
              <option value="company_manager">مدير الشركة</option>
            </select>

            <!-- Status Filter -->
            <select 
              v-model="statusFilter"
              @change="handleFilter"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع الحالات</option>
              <option value="active">نشيط</option>
              <option value="inactive">غير نشيط</option>
            </select>

            <!-- Refresh Button -->
            <button 
              @click="refreshData"
              class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              :disabled="loading"
            >
              <svg 
                :class="['w-5 h-5', loading ? 'animate-spin' : '']" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">قائمة المستخدمين</h2>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatNumber(filteredUsers.length) }} مستخدم
            </div>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-700 dark:text-gray-300">جاري تحميل البيانات...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-8 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mb-4">
            <svg class="w-8 h-8 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <p class="text-red-700 dark:text-red-300 mb-4">{{ error }}</p>
          <button 
            @click="refreshData"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            إعادة المحاولة
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredUsers.length === 0" class="p-8 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">لا توجد مستخدمين</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">
            {{ searchTerm ? 'لم يتم العثور على مستخدمين مطابقين للبحث' : 'لم يتم العثور على أي مستخدمين' }}
          </p>
          <button 
            @click="showAddModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            إضافة أول مستخدم
          </button>
        </div>

        <!-- Table Content -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  #
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  المستخدم
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  البريد الإلكتروني
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الدور
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  المخازن المسموحة
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الحالة
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  آخر تسجيل
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              <tr v-for="(user, index) in paginatedUsers" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ startIndex + index + 1 }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center ml-3">
                      <span class="text-white font-medium text-sm">{{ getUserInitials(user.name) }}</span>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</div>
                      <div v-if="user.phone" class="text-xs text-gray-500 dark:text-gray-400">{{ user.phone }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ user.email }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getRoleBadgeClass(user.role)">
                    {{ getRoleText(user.role) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                    <span v-if="user.allowed_warehouses && user.allowed_warehouses.length > 0">
                      {{ user.allowed_warehouses.length }} مخزن
                    </span>
                    <span v-else class="text-gray-500 dark:text-gray-400">غير محدد</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(user)">
                    {{ getStatusText(user) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(user.last_login) || 'لم يسجل دخول' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2 space-x-reverse">
                    <!-- Edit -->
                    <button 
                      @click="editUser(user)"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title="تعديل"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>

                    <!-- Reset Password -->
                    <button 
                      @click="resetPassword(user)"
                      class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      title="إعادة تعيين كلمة المرور"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-6a3 3 0 110-6 3 3 0 010 6zm2 7a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </button>

                    <!-- Deactivate/Activate -->
                    <button 
                      v-if="user.id !== currentUserId"
                      @click="toggleUserStatus(user)"
                      :class="getStatusButtonClass(user)"
                      :title="user.is_active ? 'تعطيل' : 'تفعيل'"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="user.is_active" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </button>

                    <!-- Delete -->
                    <button 
                      v-if="user.id !== currentUserId && user.role !== 'superadmin'"
                      @click="deleteUser(user)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="حذف"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredUsers.length > 0 && totalPages > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            عرض <span class="font-medium">{{ startIndex + 1 }}</span> إلى 
            <span class="font-medium">{{ Math.min(endIndex, filteredUsers.length) }}</span> من 
            <span class="font-medium">{{ formatNumber(filteredUsers.length) }}</span> نتيجة
          </div>
          
          <div class="flex space-x-2 space-x-reverse">
            <button 
              @click="prevPage" 
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              السابق
            </button>
            
            <div class="flex space-x-1 space-x-reverse">
              <button 
                v-for="page in visiblePages" 
                :key="page"
                @click="goToPage(page)"
                class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
                :class="page === currentPage 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              التالي
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modals -->
    <AddUserModal 
      v-if="showAddModal"
      :show="showAddModal"
      @close="showAddModal = false"
      @saved="handleUserAdded"
    />
    
    <UserModal 
      v-if="showEditModal"
      :show="showEditModal"
      :user-id="selectedUserId"
      @close="showEditModal = false"
      @saved="handleUserUpdated"
    />
    
    <ResetPasswordModal 
      v-if="showResetPasswordModal"
      :show="showResetPasswordModal"
      :user-id="selectedUserId"
      @close="showResetPasswordModal = false"
      @saved="handlePasswordReset"
    />

    <!-- Loading Overlay -->
    <div v-if="operationLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-8 flex flex-col items-center shadow-xl">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-700 dark:text-gray-300 font-medium">جاري المعالجة...</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">يرجى الانتظار</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import AddUserModal from '@/components/users/AddUserModal.vue';
import UserModal from '@/components/users/UserModal.vue';
import ResetPasswordModal from '@/components/users/ResetPasswordModal.vue';

export default {
  name: 'Users',
  components: {
    AddUserModal,
    UserModal,
    ResetPasswordModal
  },
  setup() {
    const store = useStore();
    
    // State
    const loading = ref(false);
    const error = ref('');
    const showAddModal = ref(false);
    const showEditModal = ref(false);
    const showResetPasswordModal = ref(false);
    const selectedUserId = ref(null);
    const searchTerm = ref('');
    const roleFilter = ref('');
    const statusFilter = ref('');
    
    // Pagination
    const currentPage = ref(1);
    const itemsPerPage = 10;
    
    // Mock data - replace with actual data from store
    const users = ref([]);
    
    // Computed properties
    const currentUserId = computed(() => store.state.user?.uid);
    const operationLoading = computed(() => store.state.operationLoading);
    
    const filteredUsers = computed(() => {
      let filtered = [...users.value];
      
      // Apply search filter
      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase();
        filtered = filtered.filter(user => 
          user.name?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.phone?.toLowerCase().includes(term)
        );
      }
      
      // Apply role filter
      if (roleFilter.value) {
        filtered = filtered.filter(user => user.role === roleFilter.value);
      }
      
      // Apply status filter
      if (statusFilter.value) {
        if (statusFilter.value === 'active') {
          filtered = filtered.filter(user => user.is_active !== false);
        } else if (statusFilter.value === 'inactive') {
          filtered = filtered.filter(user => user.is_active === false);
        }
      }
      
      return filtered;
    });
    
    const totalUsers = computed(() => users.value.length);
    const activeUsers = computed(() => users.value.filter(user => user.is_active !== false).length);
    const warehouseManagers = computed(() => users.value.filter(user => user.role === 'warehouse_manager').length);
    const lastLoginTime = computed(() => {
      const lastLogin = users.value
        .filter(user => user.last_login)
        .sort((a, b) => new Date(b.last_login) - new Date(a.last_login))[0];
      
      return lastLogin ? formatTimeAgo(lastLogin.last_login) : 'لا يوجد';
    });
    
    // Pagination
    const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage));
    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
    const endIndex = computed(() => startIndex.value + itemsPerPage);
    const paginatedUsers = computed(() => 
      filteredUsers.value.slice(startIndex.value, endIndex.value)
    );
    
    const visiblePages = computed(() => {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
      let end = Math.min(totalPages.value, start + maxVisible - 1);
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    });
    
    // Methods
    const formatNumber = (num) => {
      return new Intl.NumberFormat('ar-EG').format(num || 0);
    };
    
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
    
    const formatTimeAgo = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffMins < 1) return 'الآن';
      if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
      if (diffHours < 24) return `منذ ${diffHours} ساعة`;
      if (diffDays < 7) return `منذ ${diffDays} يوم`;
      return formatDate(dateString);
    };
    
    const getUserInitials = (name) => {
      if (!name) return '??';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };
    
    const getRoleText = (role) => {
      const roles = {
        superadmin: 'المشرف العام',
        warehouse_manager: 'مدير المخازن',
        company_manager: 'مدير الشركة'
      };
      return roles[role] || role;
    };
    
    const getRoleBadgeClass = (role) => {
      const classes = {
        superadmin: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white',
        warehouse_manager: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
        company_manager: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white'
      };
      return classes[role] || 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    };
    
    const getStatusText = (user) => {
      return user.is_active === false ? 'غير نشيط' : 'نشيط';
    };
    
    const getStatusBadgeClass = (user) => {
      return user.is_active === false 
        ? 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        : 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    };
    
    const getStatusButtonClass = (user) => {
      return user.is_active === false
        ? 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
        : 'text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300';
    };
    
    const handleSearch = () => {
      currentPage.value = 1;
    };
    
    const handleFilter = () => {
      currentPage.value = 1;
    };
    
    const refreshData = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        // Use store action to load users
        const loadedUsers = await store.dispatch('loadAllUsers');
        users.value = loadedUsers || [];
      } catch (err) {
        error.value = err.message || 'حدث خطأ في تحميل المستخدمين';
        // Fallback to mock data for development
        users.value = getMockUsers();
      } finally {
        loading.value = false;
      }
    };
    
    const editUser = (user) => {
      selectedUserId.value = user.id;
      showEditModal.value = true;
    };
    
    const resetPassword = (user) => {
      selectedUserId.value = user.id;
      showResetPasswordModal.value = true;
    };
    
    const toggleUserStatus = async (user) => {
      const newStatus = !user.is_active;
      const confirmMessage = newStatus 
        ? `هل تريد تفعيل المستخدم "${user.name}"؟`
        : `هل تريد تعطيل المستخدم "${user.name}"؟`;
      
      if (!confirm(confirmMessage)) return;
      
      try {
        await store.dispatch('updateUser', {
          userId: user.id,
          userData: { is_active: newStatus }
        });
        
        alert(`تم ${newStatus ? 'تفعيل' : 'تعطيل'} المستخدم بنجاح`);
        refreshData();
      } catch (err) {
        alert(err.message || 'حدث خطأ في تحديث حالة المستخدم');
      }
    };
    
    const deleteUser = async (user) => {
      if (!confirm(`هل أنت متأكد من حذف المستخدم "${user.name}"؟\nهذا الإجراء لا يمكن التراجع عنه.`)) {
        return;
      }
      
      try {
        await store.dispatch('deleteUser', user.id);
        alert('تم حذف المستخدم بنجاح');
        refreshData();
      } catch (err) {
        alert(err.message || 'حدث خطأ في حذف المستخدم');
      }
    };
    
    const handleUserAdded = () => {
      showAddModal.value = false;
      alert('تم إضافة المستخدم بنجاح');
      refreshData();
    };
    
    const handleUserUpdated = () => {
      showEditModal.value = false;
      alert('تم تحديث المستخدم بنجاح');
      refreshData();
    };
    
    const handlePasswordReset = () => {
      showResetPasswordModal.value = false;
      alert('تم إعادة تعيين كلمة المرور بنجاح');
    };
    
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };
    
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };
    
    const goToPage = (page) => {
      currentPage.value = page;
    };
    
    // Mock data function
    const getMockUsers = () => {
      return [
        {
          id: '1',
          name: 'المشرف العام',
          email: 'superadmin@monofia.com',
          role: 'superadmin',
          allowed_warehouses: ['main_warehouse', 'tera_warehouse', 'shobeen_warehouse', 'hyper_warehouse'],
          is_active: true,
          phone: '+201234567890',
          last_login: new Date('2024-01-15T10:30:00')
        },
        {
          id: '2',
          name: 'مدير المخازن',
          email: 'warehouse@monofia.com',
          role: 'warehouse_manager',
          allowed_warehouses: ['main_warehouse', 'tera_warehouse'],
          is_active: true,
          phone: '+201112223344',
          last_login: new Date('2024-01-14T14:20:00')
        },
        {
          id: '3',
          name: 'مدير الشركة',
          email: 'company@monofia.com',
          role: 'company_manager',
          allowed_warehouses: [],
          is_active: true,
          phone: '+201556667788',
          last_login: new Date('2024-01-13T09:15:00')
        },
        {
          id: '4',
          name: 'محمد أحمد',
          email: 'mohamed@monofia.com',
          role: 'warehouse_manager',
          allowed_warehouses: ['shobeen_warehouse', 'hyper_warehouse'],
          is_active: false,
          phone: '+201998887766',
          last_login: new Date('2023-12-20T11:45:00')
        }
      ];
    };
    
    onMounted(() => {
      refreshData();
    });
    
    return {
      // State
      loading,
      error,
      showAddModal,
      showEditModal,
      showResetPasswordModal,
      selectedUserId,
      searchTerm,
      roleFilter,
      statusFilter,
      currentPage,
      users,
      
      // Computed
      currentUserId,
      operationLoading,
      filteredUsers,
      totalUsers,
      activeUsers,
      warehouseManagers,
      lastLoginTime,
      paginatedUsers,
      totalPages,
      startIndex,
      endIndex,
      visiblePages,
      
      // Methods
      formatNumber,
      formatDate,
      getUserInitials,
      getRoleText,
      getRoleBadgeClass,
      getStatusText,
      getStatusBadgeClass,
      getStatusButtonClass,
      handleSearch,
      handleFilter,
      refreshData,
      editUser,
      resetPassword,
      toggleUserStatus,
      deleteUser,
      handleUserAdded,
      handleUserUpdated,
      handlePasswordReset,
      prevPage,
      nextPage,
      goToPage
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