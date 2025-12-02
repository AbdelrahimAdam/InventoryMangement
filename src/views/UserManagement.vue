<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
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
                <p class="text-xs text-gray-500 dark:text-gray-400">نظام المخزون</p>
              </div>
            </router-link>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-3 space-x-reverse">
            <button 
              @click="showAddModal = true"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
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
      <!-- Import your UserManagement component -->
      <UserManagement 
        @edit-user="handleEditUser"
        @add-user="showAddModal = true"
      />
    </main>

    <!-- Add User Modal -->
    <AddUserModal 
      v-if="showAddModal"
      :show="showAddModal"
      @close="showAddModal = false"
      @saved="handleUserSaved"
    />
    
    <!-- Edit User Modal -->
    <UserModal 
      v-if="showEditModal"
      :show="showEditModal"
      :user-id="selectedUserId"
      @close="showEditModal = false"
      @saved="handleUserUpdated"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import UserManagement from '@/components/users/UserManagement.vue';
import AddUserModal from '@/components/users/AddUserModal.vue';
import UserModal from '@/components/users/UserModal.vue';

export default {
  name: 'UserManagement',
  components: {
    UserManagement,
    AddUserModal,
    UserModal
  },
  setup() {
    const showAddModal = ref(false);
    const showEditModal = ref(false);
    const selectedUserId = ref(null);
    
    const handleEditUser = (userId) => {
      selectedUserId.value = userId;
      showEditModal.value = true;
    };
    
    const handleUserSaved = () => {
      showAddModal.value = false;
      // Refresh data
    };
    
    const handleUserUpdated = () => {
      showEditModal.value = false;
      // Refresh data
    };
    
    return {
      showAddModal,
      showEditModal,
      selectedUserId,
      handleEditUser,
      handleUserSaved,
      handleUserUpdated
    };
  }
};
</script>