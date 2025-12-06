<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
    <!-- Animated Background Elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 dark:bg-yellow-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/3 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10">
      <!-- Header -->
      <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Navigation -->
            <div class="flex items-center space-x-4 space-x-reverse">
              <router-link to="/" class="group flex items-center space-x-3 space-x-reverse hover:opacity-80 transition-all duration-300">
                <div class="relative">
                  <div class="h-10 w-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <span class="text-white font-bold text-sm">م</span>
                  </div>
                  <div class="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                </div>
                <div>
                  <h1 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                    إدارة المستخدمين
                  </h1>
                  <p class="text-xs text-gray-500 dark:text-gray-400">نظام إدارة المخزون المتكامل</p>
                </div>
              </router-link>
            </div>

            <!-- User Info and Actions -->
            <div class="flex items-center space-x-3 space-x-reverse">
              <!-- User Stats -->
              <div class="hidden md:flex items-center space-x-2 space-x-reverse px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <span class="text-xs text-gray-600 dark:text-gray-300">
                  <span class="font-bold text-purple-600 dark:text-purple-400">{{ userStats.total }}</span> مستخدم
                </span>
                <div class="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                <span class="text-xs text-gray-600 dark:text-gray-300">
                  <span class="font-bold text-green-600 dark:text-green-400">{{ userStats.active }}</span> نشط
                </span>
              </div>

              <!-- Add User Button -->
              <button 
                @click="openAddUserModal"
                class="group relative inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                :disabled="loading"
              >
                <div class="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <svg class="w-4 h-4 ml-2 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span class="relative z-10">مستخدم جديد</span>
              </button>
              
              <!-- Dashboard Button -->
              <router-link 
                to="/" 
                class="group inline-flex items-center px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-gray-200 dark:border-gray-600"
              >
                <svg class="w-4 h-4 ml-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <span class="group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">الرئيسية</span>
              </router-link>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">إجمالي المستخدمين</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white mt-2">{{ userStats.total }}</p>
              </div>
              <div class="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
            </div>
            <div class="mt-4">
              <div class="flex items-center text-sm text-green-600 dark:text-green-400">
                <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd"/>
                </svg>
                <span>+{{ userStats.thisMonth }} هذا الشهر</span>
              </div>
            </div>
          </div>

          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">المستخدمين النشطين</p>
                <p class="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">{{ userStats.active }}</p>
              </div>
              <div class="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <div class="mt-4">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ Math.round((userStats.active / userStats.total) * 100) || 0 }}% من إجمالي المستخدمين
              </div>
            </div>
          </div>

          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">مديري المخازن</p>
                <p class="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">{{ userStats.warehouseManagers }}</p>
              </div>
              <div class="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
            </div>
            <div class="mt-4">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ Math.round((userStats.warehouseManagers / userStats.total) * 100) || 0 }}% من إجمالي المستخدمين
              </div>
            </div>
          </div>

          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">المستخدمين المعطلين</p>
                <p class="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">{{ userStats.inactive }}</p>
              </div>
              <div class="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                </svg>
              </div>
            </div>
            <div class="mt-4">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ Math.round((userStats.inactive / userStats.total) * 100) || 0 }}% من إجمالي المستخدمين
              </div>
            </div>
          </div>
        </div>

        <!-- Search and Filter Bar -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6 border border-gray-200/50 dark:border-gray-700/50">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">قائمة المستخدمين</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">إدارة جميع حسابات المستخدمين في النظام</p>
            </div>

            <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <!-- Search Input -->
              <div class="relative flex-grow">
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                <input
                  type="text"
                  v-model="searchTerm"
                  @input="handleSearch"
                  placeholder="ابحث عن مستخدم بالاسم أو البريد..."
                  class="w-full pr-10 pl-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  :disabled="loading"
                />
              </div>

              <!-- Role Filter -->
              <select
                v-model="roleFilter"
                @change="loadUsers"
                class="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                :disabled="loading"
              >
                <option value="">جميع الأدوار</option>
                <option value="superadmin">المشرف العام</option>
                <option value="warehouse_manager">مدير المخازن</option>
                <option value="company_manager">مدير الشركة</option>
              </select>

              <!-- Status Filter -->
              <select
                v-model="statusFilter"
                @change="loadUsers"
                class="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                :disabled="loading"
              >
                <option value="">جميع الحالات</option>
                <option value="active">نشط فقط</option>
                <option value="inactive">معطل فقط</option>
              </select>

              <!-- Refresh Button -->
              <button
                @click="loadUsers"
                :disabled="loading"
                class="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                تحديث
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading && users.length === 0" class="text-center py-12">
          <div class="inline-flex flex-col items-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p class="text-gray-600 dark:text-gray-400">جاري تحميل بيانات المستخدمين...</p>
          </div>
        </div>

        <!-- Users Table -->
        <div v-else class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    المستخدم
                  </th>
                  <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    الدور
                  </th>
                  <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    تاريخ الإنشاء
                  </th>
                  <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="h-10 w-10 rounded-xl bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center ml-3">
                        <span class="text-sm font-bold text-purple-600 dark:text-purple-400">
                          {{ getUserInitials(user.name) }}
                        </span>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                        <div v-if="user.phone" class="text-xs text-gray-400 dark:text-gray-500">{{ user.phone }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="getRoleBadgeClass(user.role)">
                      {{ getRoleName(user.role) }}
                    </span>
                    <div v-if="user.role === 'warehouse_manager' && user.allowed_warehouses" class="mt-1">
                      <div class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {{ user.allowed_warehouses.length }} مخزن
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <span :class="['inline-flex items-center px-3 py-1 rounded-full text-xs font-medium', 
                                   user.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                                   'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400']">
                        <span class="w-2 h-2 rounded-full mr-1" :class="user.is_active ? 'bg-green-500' : 'bg-red-500'"></span>
                        {{ user.is_active ? 'نشط' : 'غير نشط' }}
                      </span>
                    </div>
                    <div v-if="user.last_login" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      آخر دخول: {{ formatDate(user.last_login) }}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(user.created_at) }}
                  </td>
                  <td class="px-6 py-4 text-sm font-medium">
                    <div class="flex items-center justify-end space-x-2 space-x-reverse">
                      <button
                        @click="editUser(user)"
                        class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors duration-200 p-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg"
                        title="تعديل"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      
                      <button
                        @click="toggleUserStatus(user)"
                        :title="user.is_active ? 'تعطيل المستخدم' : 'تفعيل المستخدم'"
                        :class="['p-1 rounded-lg transition-colors duration-200', 
                                user.is_active ? 'text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' :
                                                'text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20']"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path v-if="user.is_active" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </button>
                      
                      <button
                        v-if="user.role !== 'superadmin'"
                        @click="deleteUser(user)"
                        class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
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

          <!-- Empty State -->
          <div v-if="!loading && filteredUsers.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">لا توجد نتائج</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ searchTerm ? 'لم يتم العثور على مستخدمين يطابقون بحثك.' : 'لا توجد مستخدمين في النظام حتى الآن.' }}
            </p>
            <div class="mt-6">
              <button
                type="button"
                @click="openAddUserModal"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900"
              >
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                إضافة مستخدم جديد
              </button>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="filteredUsers.length > 0" class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700 dark:text-gray-300">
                عرض <span class="font-bold">{{ filteredUsers.length }}</span> من <span class="font-bold">{{ users.length }}</span> مستخدم
              </div>
              <div class="flex items-center space-x-2 space-x-reverse">
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="px-3 py-1 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  :class="currentPage === 1 ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
                >
                  السابق
                </button>
                <span class="text-sm text-gray-700 dark:text-gray-300">
                  صفحة {{ currentPage }} من {{ totalPages }}
                </span>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  :class="currentPage === totalPages ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
                >
                  التالي
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Add/Edit User Modal -->
    <AddUserModal 
      v-if="showUserModal"
      :isOpen="showUserModal"
      :user="selectedUser"
      @close="closeUserModal"
      @save="handleUserSave"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { debounce } from 'lodash';
import AddUserModal from '@/components/users/AddUserModal.vue';

export default {
  name: 'UserManagementPage',
  components: {
    AddUserModal
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    
    const loading = ref(true);
    const users = ref([]);
    const searchTerm = ref('');
    const roleFilter = ref('');
    const statusFilter = ref('');
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const totalPages = ref(1);
    const showUserModal = ref(false);
    const selectedUser = ref(null);
    
    // User statistics
    const userStats = ref({
      total: 0,
      active: 0,
      inactive: 0,
      warehouseManagers: 0,
      companyManagers: 0,
      thisMonth: 0
    });

    // Check if user has permission to manage users
    const canManageUsers = computed(() => {
      return store.getters.canManageUsers;
    });

    // Load users from store
    const loadUsers = async () => {
      if (!canManageUsers.value) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية لإدارة المستخدمين'
        });
        router.push('/');
        return;
      }

      loading.value = true;
      try {
        const result = await store.dispatch('loadAllUsers');
        if (result) {
          users.value = result;
          calculateUserStats();
        }
      } catch (error) {
        console.error('Error loading users:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في تحميل المستخدمين'
        });
      } finally {
        loading.value = false;
      }
    };

    // Calculate user statistics
    const calculateUserStats = () => {
      const stats = {
        total: users.value.length,
        active: 0,
        inactive: 0,
        warehouseManagers: 0,
        companyManagers: 0,
        thisMonth: 0
      };

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      users.value.forEach(user => {
        if (user.is_active !== false) {
          stats.active++;
        } else {
          stats.inactive++;
        }

        if (user.role === 'warehouse_manager') {
          stats.warehouseManagers++;
        } else if (user.role === 'company_manager') {
          stats.companyManagers++;
        }

        // Count users created this month
        if (user.created_at) {
          const createdDate = new Date(user.created_at);
          if (createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear) {
            stats.thisMonth++;
          }
        }
      });

      userStats.value = stats;
    };

    // Filter users based on search and filters
    const filteredUsers = computed(() => {
      let filtered = [...users.value];

      // Apply role filter
      if (roleFilter.value) {
        filtered = filtered.filter(user => user.role === roleFilter.value);
      }

      // Apply status filter
      if (statusFilter.value === 'active') {
        filtered = filtered.filter(user => user.is_active !== false);
      } else if (statusFilter.value === 'inactive') {
        filtered = filtered.filter(user => user.is_active === false);
      }

      // Apply search filter
      if (searchTerm.value.trim()) {
        const term = searchTerm.value.toLowerCase().trim();
        filtered = filtered.filter(user => 
          (user.name || '').toLowerCase().includes(term) ||
          (user.email || '').toLowerCase().includes(term) ||
          (user.phone || '').toLowerCase().includes(term)
        );
      }

      // Apply pagination
      const startIndex = (currentPage.value - 1) * itemsPerPage.value;
      const endIndex = startIndex + itemsPerPage.value;
      totalPages.value = Math.ceil(filtered.length / itemsPerPage.value);

      return filtered.slice(startIndex, endIndex);
    });

    // Helper functions
    const getUserInitials = (name) => {
      if (!name) return '??';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const getRoleName = (role) => {
      const roles = {
        superadmin: 'المشرف العام',
        warehouse_manager: 'مدير المخازن',
        company_manager: 'مدير الشركة'
      };
      return roles[role] || role;
    };

    const getRoleBadgeClass = (role) => {
      const classes = {
        superadmin: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        warehouse_manager: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        company_manager: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      };
      return classes[role] || 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'غير محدد';
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    // User actions
    const openAddUserModal = () => {
      if (!canManageUsers.value) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية لإضافة مستخدمين'
        });
        return;
      }
      selectedUser.value = null;
      showUserModal.value = true;
    };

    const editUser = (user) => {
      if (!canManageUsers.value) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية لتعديل المستخدمين'
        });
        return;
      }
      selectedUser.value = { ...user };
      showUserModal.value = true;
    };

    const closeUserModal = () => {
      showUserModal.value = false;
      selectedUser.value = null;
    };

    const handleUserSave = async () => {
      await loadUsers();
      closeUserModal();
    };

    const toggleUserStatus = async (user) => {
      if (!canManageUsers.value) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية لتغيير حالة المستخدمين'
        });
        return;
      }

      if (user.role === 'superadmin' && user.id === store.state.user?.uid) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'لا يمكن تعطيل حساب المشرف العام الحالي'
        });
        return;
      }

      const newStatus = !user.is_active;
      const confirmMessage = newStatus 
        ? `هل أنت متأكد من تفعيل المستخدم "${user.name}"؟`
        : `هل أنت متأكد من تعطيل المستخدم "${user.name}"؟`;

      if (!confirm(confirmMessage)) {
        return;
      }

      try {
        const result = await store.dispatch('updateUserStatus', {
          userId: user.id,
          isActive: newStatus
        });

        if (result.success) {
          await loadUsers();
        }
      } catch (error) {
        console.error('Error toggling user status:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في تغيير حالة المستخدم'
        });
      }
    };

    const deleteUser = async (user) => {
      if (!canManageUsers.value) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية لحذف المستخدمين'
        });
        return;
      }

      if (user.role === 'superadmin') {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'لا يمكن حذف مشرف عام'
        });
        return;
      }

      if (user.id === store.state.user?.uid) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'لا يمكن حذف حسابك الشخصي'
        });
        return;
      }

      if (!confirm(`هل أنت متأكد من حذف المستخدم "${user.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
        return;
      }

      try {
        const result = await store.dispatch('deleteUser', user.id);
        
        if (result.success) {
          await loadUsers();
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في حذف المستخدم'
        });
      }
    };

    // Pagination
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    // Search with debounce
    const handleSearch = debounce(() => {
      currentPage.value = 1;
    }, 300);

    // Initialize
    onMounted(async () => {
      if (!canManageUsers.value) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية للوصول إلى هذه الصفحة'
        });
        router.push('/');
        return;
      }

      await loadUsers();
    });

    return {
      // State
      loading,
      users,
      searchTerm,
      roleFilter,
      statusFilter,
      currentPage,
      totalPages,
      showUserModal,
      selectedUser,
      userStats,
      
      // Computed
      filteredUsers,
      canManageUsers,
      
      // Methods
      loadUsers,
      getUserInitials,
      getRoleName,
      getRoleBadgeClass,
      formatDate,
      openAddUserModal,
      editUser,
      closeUserModal,
      handleUserSave,
      toggleUserStatus,
      deleteUser,
      nextPage,
      prevPage,
      handleSearch
    };
  }
};
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

/* Smooth transitions */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

/* Fix for RTL */
.rtl {
  direction: rtl;
}

/* Loading spinner animation */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Hover effects */
.hover-lift {
  transition: transform 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
}

/* Glass effect */
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark .glass {
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
