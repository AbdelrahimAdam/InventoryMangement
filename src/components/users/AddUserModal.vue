<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl rtl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
          {{ user ? 'تعديل المستخدم' : 'إضافة مستخدم جديد' }}
        </h2>
        <button 
          @click="$emit('close')"
          class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
        >
          <svg class="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Basic Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              الاسم الكامل <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              v-model="formData.name"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="أدخل الاسم الكامل"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              البريد الإلكتروني <span class="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              v-model="formData.email"
              :readonly="!!user"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="example@company.com"
              :class="{ 'bg-gray-100 dark:bg-gray-800': !!user }"
            />
          </div>
        </div>

        <!-- Phone and Status -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              رقم الهاتف
            </label>
            <input
              type="tel"
              v-model="formData.phone"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="01XXXXXXXXX"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">حالة الحساب</label>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="formData.is_active" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              <span class="mr-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ formData.is_active ? 'نشط' : 'غير نشط' }}
              </span>
            </label>
          </div>
        </div>

        <!-- Role Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            الدور <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label 
              v-for="role in availableRoles" 
              :key="role.value"
              class="relative flex cursor-pointer rounded-lg border p-4 focus:outline-none transition-colors duration-200"
              :class="{
                'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20': formData.role === role.value,
                'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700': formData.role !== role.value
              }"
            >
              <input
                type="radio"
                :value="role.value"
                v-model="formData.role"
                :disabled="user?.role === 'superadmin'"
                class="sr-only"
              />
              <div class="flex w-full items-center justify-between">
                <div class="flex items-center">
                  <div class="text-sm">
                    <div class="font-medium text-gray-900 dark:text-white">{{ role.name }}</div>
                    <div class="text-gray-500 dark:text-gray-400 text-xs mt-1">{{ role.description }}</div>
                  </div>
                </div>
                <svg v-if="formData.role === role.value" class="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
            </label>
          </div>
          <p v-if="user?.role === 'superadmin'" class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            لا يمكن تغيير دور المشرف العام
          </p>
        </div>

        <!-- Warehouse Access Control -->
        <div v-if="formData.role === 'warehouse_manager'">
          <div class="flex justify-between items-center mb-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              المخازن المسموحة <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-2">
              <button
                type="button"
                @click="toggleAllWarehouses"
                class="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                {{ formData.allowed_warehouses.length === allWarehouses.length ? 'إلغاء الكل' : 'اختيار الكل' }}
              </button>
              <button
                type="button"
                @click="manageWarehouses"
                class="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200 flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                إدارة المخازن
              </button>
            </div>
          </div>
          
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
            اختر المخازن التي يمكن للمستخدم الوصول إليها. سيتمكن المستخدم من إجراء جميع العمليات في المخازن المختارة.
          </p>

          <!-- Loading State -->
          <div v-if="loadingWarehouses" class="text-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">جاري تحميل المخازن...</p>
          </div>

          <!-- Warehouses Grid -->
          <div v-else class="space-y-3">
            <!-- Primary Warehouses -->
            <div v-if="primaryWarehouses.length > 0">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">المخازن الرئيسية</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label 
                  v-for="warehouse in primaryWarehouses" 
                  :key="warehouse.id"
                  class="relative flex items-start p-3 border rounded-lg transition-colors duration-200 group"
                  :class="{
                    'border-blue-300 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20': formData.allowed_warehouses.includes(warehouse.id),
                    'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600': !formData.allowed_warehouses.includes(warehouse.id)
                  }"
                >
                  <div class="flex items-center h-5">
                    <input
                      type="checkbox"
                      :value="warehouse.id"
                      v-model="formData.allowed_warehouses"
                      class="h-4 w-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  </div>
                  <div class="mr-3 text-sm flex-1">
                    <div class="flex justify-between items-start">
                      <div>
                        <div class="font-medium text-gray-900 dark:text-white">{{ warehouse.name_ar }}</div>
                        <div class="text-gray-500 dark:text-gray-400 text-xs mt-1">{{ warehouse.name_en }}</div>
                      </div>
                      <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          @click.stop="editWarehouse(warehouse)"
                          class="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                          title="تعديل"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div class="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <span>السعة: {{ warehouse.capacity || 'غير محددة' }}</span>
                      <span>•</span>
                      <span>الموقع: {{ warehouse.location || 'غير محدد' }}</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Dispatch Warehouses -->
            <div v-if="dispatchWarehouses.length > 0">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">مواقع الصرف</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label 
                  v-for="warehouse in dispatchWarehouses" 
                  :key="warehouse.id"
                  class="relative flex items-start p-3 border rounded-lg transition-colors duration-200"
                  :class="{
                    'border-purple-300 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/20': formData.allowed_warehouses.includes(warehouse.id),
                    'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600': !formData.allowed_warehouses.includes(warehouse.id)
                  }"
                >
                  <div class="flex items-center h-5">
                    <input
                      type="checkbox"
                      :value="warehouse.id"
                      v-model="formData.allowed_warehouses"
                      class="h-4 w-4 text-purple-600 dark:text-purple-400 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500 dark:focus:ring-purple-400"
                    />
                  </div>
                  <div class="mr-3 text-sm">
                    <div class="font-medium text-gray-900 dark:text-white">{{ warehouse.name_ar }}</div>
                    <div class="text-gray-500 dark:text-gray-400 text-xs mt-1">{{ warehouse.description || warehouse.name_en }}</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Warehouse Access Summary -->
            <div v-if="formData.allowed_warehouses.length > 0" 
                 class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-sm text-green-700 dark:text-green-300">
                  تم اختيار {{ formData.allowed_warehouses.length }} مخزن
                </span>
              </div>
              <div class="mt-2 text-xs text-green-600 dark:text-green-400">
                <span>المخازن المختارة:</span>
                <span class="mr-2 font-medium">
                  {{ getSelectedWarehouseNames().join('، ') }}
                </span>
              </div>
            </div>
          </div>

          <!-- No Warehouses Message -->
          <div v-if="!loadingWarehouses && allWarehouses.length === 0" class="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">لا توجد مخازن</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">ابدأ بإضافة مخازن جديدة للنظام.</p>
            <div class="mt-4">
              <button
                type="button"
                @click="addNewWarehouse"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
              >
                <svg class="ml-2 -mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                إضافة مخزن جديد
              </button>
            </div>
          </div>
        </div>

        <!-- Permissions Management -->
        <div v-if="formData.role">
          <div class="flex justify-between items-center mb-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              إدارة الصلاحيات
            </label>
            <button
              type="button"
              @click="toggleAllPermissions"
              class="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              {{ allPermissionsSelected ? 'إلغاء الكل' : 'اختيار الكل' }}
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="permissionGroup in permissionGroups" :key="permissionGroup.category">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ permissionGroup.label }}</h4>
              <div class="space-y-2">
                <label 
                  v-for="permission in permissionGroup.permissions" 
                  :key="permission.value"
                  class="flex items-center p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  :class="{
                    'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20': formData.permissions.includes(permission.value),
                    'border-gray-200 dark:border-gray-700': !formData.permissions.includes(permission.value)
                  }"
                >
                  <input
                    type="checkbox"
                    :value="permission.value"
                    v-model="formData.permissions"
                    class="h-4 w-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                  <div class="mr-3 text-sm">
                    <div class="font-medium text-gray-700 dark:text-gray-300">{{ permission.name }}</div>
                    <div class="text-gray-500 dark:text-gray-400 text-xs mt-1">{{ permission.description }}</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Quick Permission Sets -->
          <div class="mt-4 flex gap-2 flex-wrap">
            <button
              type="button"
              @click="applyPermissionSet('view_only')"
              class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              صلاحيات مشاهدة فقط
            </button>
            <button
              type="button"
              @click="applyPermissionSet('basic_operations')"
              class="px-3 py-1 text-sm border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
            >
              عمليات أساسية
            </button>
            <button
              type="button"
              @click="applyPermissionSet('full_access')"
              class="px-3 py-1 text-sm border border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
            >
              صلاحيات كاملة
            </button>
            <button
              type="button"
              @click="applyPermissionSet('warehouse_manager')"
              class="px-3 py-1 text-sm border border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200"
            >
              مدير مخازن نموذجي
            </button>
          </div>
        </div>

        <!-- Password (only for new users) -->
        <div v-if="!user" class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              كلمة المرور <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-2">
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="text-sm px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
              >
                {{ showPassword ? 'إخفاء' : 'إظهار' }}
              </button>
              <button
                type="button"
                @click="generateStrongPassword"
                class="text-sm px-2 py-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                توليد قوي
              </button>
            </div>
          </div>
          
          <div class="flex gap-3">
            <input
              :type="showPassword ? 'text' : 'password'"
              required
              v-model="formData.password"
              class="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="كلمة المرور المؤقتة"
            />
            <button
              type="button"
              @click="generatePassword"
              class="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
            >
              توليد عشوائي
            </button>
          </div>
          
          <!-- Password Strength Indicator -->
          <div class="mt-2">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-gray-500 dark:text-gray-400">قوة كلمة المرور:</span>
              <span class="text-xs font-medium" :class="passwordStrength.color">
                {{ passwordStrength.label }}
              </span>
            </div>
            <div class="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                class="h-full transition-all duration-300" 
                :class="passwordStrength.color"
                :style="{ width: passwordStrength.percentage + '%' }"
              ></div>
            </div>
          </div>
          
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
            يجب أن تكون كلمة المرور 8 أحرف على الأقل وتحتوي على حروف وأرقام
          </p>
          
          <!-- Temporary Password Display -->
          <div v-if="formData.password" class="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <span class="text-sm font-medium text-yellow-800 dark:text-yellow-300">كلمة المرور المؤقتة</span>
            </div>
            <div class="flex items-center gap-2">
              <code class="flex-1 font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                {{ formData.password }}
              </code>
              <button
                type="button"
                @click="copyPassword"
                class="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                title="نسخ"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </button>
            </div>
            <p class="text-xs text-yellow-700 dark:text-yellow-400 mt-2">
              سيتم إرسال هذه الكلمة إلى المستخدم. يجب عليه تغييرها عند أول دخول.
            </p>
          </div>
        </div>

        <!-- User Summary -->
        <div v-if="formData.role" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-3">ملخص المستخدم:</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="text-xs text-blue-600 dark:text-blue-400 mb-1">الدور والصلاحيات</div>
              <div class="text-sm text-blue-700 dark:text-blue-300">
                {{ getRoleDisplay(formData.role) }}
              </div>
              <div class="mt-1 text-xs text-blue-600 dark:text-blue-400">
                {{ formData.permissions.length }} صلاحية محددة
              </div>
            </div>
            <div>
              <div class="text-xs text-blue-600 dark:text-blue-400 mb-1">الوصول إلى المخازن</div>
              <div class="text-sm text-blue-700 dark:text-blue-300">
                {{ formData.allowed_warehouses.length }} مخزن
              </div>
              <div v-if="formData.allowed_warehouses.length > 0" class="mt-1 text-xs text-blue-600 dark:text-blue-400 truncate">
                {{ getSelectedWarehouseNames().slice(0, 2).join('، ') }}
                <span v-if="formData.allowed_warehouses.length > 2">وآخرون</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Validation Errors -->
        <div v-if="validationErrors.length > 0" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <h4 class="text-sm font-medium text-red-800 dark:text-red-300 mb-2">خطأ في التحقق:</h4>
          <ul class="text-sm text-red-700 dark:text-red-300 list-disc pr-5 space-y-1">
            <li v-for="error in validationErrors" :key="error">{{ error }}</li>
          </ul>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-sm text-red-700 dark:text-red-300">{{ errorMessage }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
          >
            إلغاء
          </button>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ loading ? 'جاري الحفظ...' : (user ? 'تحديث المستخدم' : 'إضافة مستخدم') }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Warehouse Management Modal -->
  <WarehouseModal
    v-if="showWarehouseModal"
    :warehouse="editingWarehouse"
    @close="closeWarehouseModal"
    @save="handleWarehouseSave"
  />
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { auth, db, firebaseConfig } from '@/firebase/config'; // Make sure firebaseConfig is exported
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import WarehouseModal from '@/components/WarehouseModal.vue';

// 🔥 SECONDARY AUTH SETUP - FIXES AUTO-LOGIN ISSUE 🔥
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Create a secondary Firebase app instance
// This prevents Firebase from auto-logging us in when we create a new user
let secondaryAuth;

// Check if firebaseConfig is available
if (firebaseConfig && Object.keys(firebaseConfig).length > 0) {
  try {
    const secondaryApp = initializeApp(firebaseConfig, "Secondary");
    secondaryAuth = getAuth(secondaryApp);
    console.log('✅ Secondary auth initialized successfully for user creation');
  } catch (error) {
    console.error('Failed to initialize secondary auth:', error);
    // Fall back to main auth if secondary fails
    secondaryAuth = auth;
  }
} else {
  console.warn('Firebase config not found, using main auth as fallback');
  secondaryAuth = auth;
}
// 🔥 END OF SECONDARY AUTH SETUP 🔥

export default {
  name: 'AddUserModal',
  components: {
    WarehouseModal
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    user: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save', 'warehouse-updated', 'success'],
  setup(props, { emit }) {
    const store = useStore();
    
    const loading = ref(false);
    const loadingWarehouses = ref(false);
    const errorMessage = ref('');
    const validationErrors = ref([]);
    const showPassword = ref(false);
    const showWarehouseModal = ref(false);
    const editingWarehouse = ref(null);
    
    const formData = ref({
      name: '',
      email: '',
      role: 'company_manager',
      is_active: true,
      phone: '',
      allowed_warehouses: [],
      permissions: [],
      password: ''
    });

    const availableRoles = ref([
      {
        value: 'superadmin',
        name: 'المشرف العام',
        description: 'صلاحيات كاملة على النظام'
      },
      {
        value: 'warehouse_manager',
        name: 'مدير المخازن',
        description: 'إدارة المخزون والحركات في المخازن المحددة'
      },
      {
        value: 'company_manager',
        name: 'مدير الشركة',
        description: 'عرض التقارير والبيانات (قراءة فقط)'
      }
    ]);

    const permissionGroups = ref([
      {
        category: 'inventory',
        label: 'إدارة المخزون',
        permissions: [
          { value: 'manage_inventory', name: 'إدارة المخزون', description: 'إضافة وتعديل المخزون' },
          { value: 'create_transfers', name: 'إنشاء التحويلات', description: 'نقل المخزون بين المخازن' },
          { value: 'dispatch_items', name: 'صرف الأصناف', description: 'صرف الأصناف للخارج' },
          { value: 'update_items', name: 'تحديث الأصناف', description: 'تعديل بيانات الأصناف' },
          { value: 'delete_items', name: 'حذف الأصناف', description: 'إزالة الأصناف من النظام' }
        ]
      },
      {
        category: 'reports',
        label: 'التقارير والمتابعة',
        permissions: [
          { value: 'view_reports', name: 'عرض التقارير', description: 'مشاهدة تقارير المخزون' },
          { value: 'export_data', name: 'تصدير البيانات', description: 'تصدير البيانات إلى Excel' },
          { value: 'view_analytics', name: 'عرض التحليلات', description: 'مشاهدة الإحصائيات والتحليلات' }
        ]
      },
      {
        category: 'system',
        label: 'إدارة النظام',
        permissions: [
          { value: 'manage_warehouses', name: 'إدارة المخازن', description: 'إضافة وتعديل المخازن' },
          { value: 'manage_users', name: 'إدارة المستخدمين', description: 'إضافة وتعديل المستخدمين' },
          { value: 'system_settings', name: 'إعدادات النظام', description: 'تعديل إعدادات النظام' }
        ]
      },
      {
        category: 'advanced',
        label: 'صلاحيات متقدمة',
        permissions: [
          { value: 'audit_logs', name: 'سجلات المراجعة', description: 'مشاهدة سجلات النظام' },
          { value: 'backup_restore', name: 'النسخ الاحتياطي', description: 'النسخ والاستعادة' },
          { value: 'full_access', name: 'وصول كامل', description: 'جميع الصلاحيات بدون قيود' }
        ]
      }
    ]);

    // Computed properties
    const allWarehouses = computed(() => {
      return store.state.warehouses || [];
    });

    const primaryWarehouses = computed(() => {
      return allWarehouses.value.filter(w => w.type === 'primary');
    });

    const dispatchWarehouses = computed(() => {
      return allWarehouses.value.filter(w => w.type === 'dispatch');
    });

    const allPermissionsSelected = computed(() => {
      const allPermissions = permissionGroups.value.flatMap(group => 
        group.permissions.map(p => p.value)
      );
      return allPermissions.every(permission => 
        formData.value.permissions.includes(permission)
      );
    });

    const passwordStrength = computed(() => {
      const password = formData.value.password || '';
      let score = 0;
      
      if (password.length >= 8) score += 1;
      if (/[A-Z]/.test(password)) score += 1;
      if (/[a-z]/.test(password)) score += 1;
      if (/\d/.test(password)) score += 1;
      if (/[^A-Za-z0-9]/.test(password)) score += 1;
      
      const percentage = (score / 5) * 100;
      
      if (score <= 1) return { label: 'ضعيفة', color: 'bg-red-500', percentage };
      if (score <= 3) return { label: 'متوسطة', color: 'bg-yellow-500', percentage };
      return { label: 'قوية', color: 'bg-green-500', percentage };
    });

    const isFormValid = computed(() => {
      validationErrors.value = [];

      if (!formData.value.name.trim()) {
        validationErrors.value.push('الاسم الكامل مطلوب');
      }

      if (!formData.value.email.trim()) {
        validationErrors.value.push('البريد الإلكتروني مطلوب');
      } else if (!isValidEmail(formData.value.email)) {
        validationErrors.value.push('صيغة البريد الإلكتروني غير صحيحة');
      }

      if (!formData.value.role) {
        validationErrors.value.push('الدور مطلوب');
      }

      if (!props.user && !formData.value.password) {
        validationErrors.value.push('كلمة المرور مطلوبة');
      } else if (!props.user && formData.value.password.length < 8) {
        validationErrors.value.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      }

      if (formData.value.role === 'warehouse_manager' && formData.value.allowed_warehouses.length === 0) {
        validationErrors.value.push('يجب اختيار مخزن واحد على الأقل لمدير المخازن');
      }

      if (formData.value.phone && !isValidPhone(formData.value.phone)) {
        validationErrors.value.push('رقم الهاتف غير صحيح');
      }

      // Check if user has basic permissions for their role
      if (formData.value.role === 'warehouse_manager' && formData.value.permissions.length === 0) {
        validationErrors.value.push('يجب تحديد صلاحيات على الأقل لمدير المخازن');
      }

      return validationErrors.value.length === 0;
    });

    // Helper functions
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const isValidPhone = (phone) => {
      const phoneRegex = /^01[0-9]{9}$/;
      return phoneRegex.test(phone);
    };

    const getRoleDisplay = (role) => {
      const roleMap = {
        superadmin: 'المشرف العام',
        warehouse_manager: 'مدير المخازن',
        company_manager: 'مدير الشركة'
      };
      return roleMap[role] || role;
    };

    const getSelectedWarehouseNames = () => {
      return formData.value.allowed_warehouses
        .map(warehouseId => {
          const warehouse = allWarehouses.value.find(w => w.id === warehouseId);
          return warehouse ? warehouse.name_ar : warehouseId;
        });
    };

    const generatePassword = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let password = '';
      for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      formData.value.password = password;
    };

    const generateStrongPassword = () => {
      const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const lowercase = 'abcdefghijklmnopqrstuvwxyz';
      const numbers = '0123456789';
      const symbols = '!@#$%^&*';
      
      let password = '';
      
      // Ensure at least one of each type
      password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
      password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
      password += numbers.charAt(Math.floor(Math.random() * numbers.length));
      password += symbols.charAt(Math.floor(Math.random() * symbols.length));
      
      // Fill the rest
      const allChars = uppercase + lowercase + numbers + symbols;
      for (let i = 4; i < 12; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
      }
      
      // Shuffle the password
      formData.value.password = password.split('').sort(() => Math.random() - 0.5).join('');
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const copyPassword = async () => {
      try {
        await navigator.clipboard.writeText(formData.value.password);
        store.dispatch('showNotification', {
          type: 'success',
          message: 'تم نسخ كلمة المرور'
        });
      } catch (err) {
        console.error('Failed to copy password:', err);
      }
    };

    const toggleAllWarehouses = () => {
      if (formData.value.allowed_warehouses.length === allWarehouses.value.length) {
        formData.value.allowed_warehouses = [];
      } else {
        formData.value.allowed_warehouses = allWarehouses.value.map(w => w.id);
      }
    };

    const toggleAllPermissions = () => {
      if (allPermissionsSelected.value) {
        formData.value.permissions = [];
      } else {
        const allPermissions = permissionGroups.value.flatMap(group => 
          group.permissions.map(p => p.value)
        );
        formData.value.permissions = [...allPermissions];
      }
    };

    const applyPermissionSet = (setName) => {
      const permissionSets = {
        view_only: ['view_reports', 'export_data'],
        basic_operations: ['manage_inventory', 'create_transfers', 'dispatch_items', 'view_reports'],
        full_access: ['full_access'],
        warehouse_manager: ['manage_inventory', 'create_transfers', 'dispatch_items', 'update_items', 'view_reports', 'export_data']
      };
      
      formData.value.permissions = permissionSets[setName] || [];
    };

    const manageWarehouses = () => {
      // Emit event to parent to show warehouse management
      emit('warehouse-updated');
      store.dispatch('showNotification', {
        type: 'info',
        message: 'يمكنك إدارة المخازن من قائمة المخازن في الشريط الجانبي'
      });
    };

    const addNewWarehouse = () => {
      editingWarehouse.value = null;
      showWarehouseModal.value = true;
    };

    const editWarehouse = (warehouse) => {
      editingWarehouse.value = warehouse;
      showWarehouseModal.value = true;
    };

    const closeWarehouseModal = () => {
      showWarehouseModal.value = false;
      editingWarehouse.value = null;
    };

    const handleWarehouseSave = async (warehouseData) => {
      try {
        // Reload warehouses after save
        await store.dispatch('loadWarehouses');
        
        // If the warehouse was added to allowed_warehouses, update the form
        if (formData.value.allowed_warehouses.includes(warehouseData.id)) {
          const index = formData.value.allowed_warehouses.indexOf(warehouseData.id);
          if (index > -1) {
            formData.value.allowed_warehouses[index] = warehouseData.id;
          }
        }
        
        closeWarehouseModal();
      } catch (error) {
        console.error('Error handling warehouse save:', error);
      }
    };

    const resetForm = () => {
      formData.value = {
        name: '',
        email: '',
        role: 'company_manager',
        is_active: true,
        phone: '',
        allowed_warehouses: [],
        permissions: [],
        password: ''
      };
      errorMessage.value = '';
      validationErrors.value = [];
      showPassword.value = false;
    };

    // Load warehouses if not already loaded
    const ensureWarehousesLoaded = async () => {
      if (allWarehouses.value.length === 0) {
        loadingWarehouses.value = true;
        try {
          await store.dispatch('loadWarehouses');
        } catch (error) {
          console.error('Error loading warehouses:', error);
          errorMessage.value = 'خطأ في تحميل المخازن';
        } finally {
          loadingWarehouses.value = false;
        }
      }
    };

   const handleSubmit = async () => {
  if (!isFormValid.value) return;

  loading.value = true;
  errorMessage.value = '';
  validationErrors.value = [];

  try {
    console.log('=== DEBUG: Starting user submission ===');

    // Get current user ID (must be superadmin)
    const currentUser = store.state.user;
    if (!currentUser || !currentUser.uid) {
      throw new Error('يجب تسجيل الدخول أولاً');
    }

    // Prepare user data EXACTLY as Firestore rules expect
    const userData = {
      name: formData.value.name.trim(),
      email: formData.value.email.trim().toLowerCase(),
      role: formData.value.role,
      is_active: formData.value.is_active !== false,
      phone: formData.value.phone.trim() || '',
      allowed_warehouses: formData.value.role === 'warehouse_manager' 
        ? formData.value.allowed_warehouses 
        : [],
      permissions: Array.isArray(formData.value.permissions) 
        ? formData.value.permissions 
        : [],
      // REQUIRED FIELDS for Firestore rules validation
      profile_complete: true,
      email_verified: false,
      created_by: currentUser.uid,
      last_login: null
    };

    console.log('User data prepared:', userData);

    let result;
    let userId;
    
    if (props.user) {
      // UPDATE EXISTING USER
      console.log('Updating existing user:', props.user.id);
      userId = props.user.id;
      
      // For updates, only include fields that can be updated
      const updateData = { 
        name: userData.name,
        email: userData.email,
        role: userData.role,
        is_active: userData.is_active,
        phone: userData.phone,
        allowed_warehouses: userData.allowed_warehouses,
        permissions: userData.permissions
      };
      
      // Update via store
      result = await store.dispatch('updateUser', {
        userId: userId,
        userData: updateData
      });
      
      if (!result.success) {
        throw new Error(result.error || 'فشل في تحديث المستخدم');
      }
      
      store.dispatch('showNotification', {
        type: 'success',
        message: 'تم تحديث المستخدم بنجاح'
      });
      
    } else {
      // CREATE NEW USER
      console.log('Creating new user...');
      
      // Validate password
      if (!formData.value.password) {
        throw new Error('كلمة المرور مطلوبة');
      }
      
      if (formData.value.password.length < 8) {
        throw new Error('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      }

      // 🔥 FIXED: Use secondaryAuth to prevent auto-login 🔥
      console.log('Creating Firebase Auth user with email:', userData.email);
      console.log('Using secondary auth to prevent auto-login...');
      
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth, // ← CHANGED FROM auth TO secondaryAuth
        userData.email,
        formData.value.password
      );
      
      userId = userCredential.user.uid;
      console.log('✅ Firebase Auth user created with ID:', userId);
      
      // Add ID fields - CRITICAL for Firestore rules
      userData.id = userId;
      userData.uid = userId; // Required for Firestore rules to work
      
      console.log('Final user data with IDs:', userData);

      // Check if db is available
      if (!db) {
        throw new Error('Firestore database not initialized');
      }
      
      // Save to Firestore
      console.log('Saving to Firestore at path: users/', userId);
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, userData);
      console.log('✅ User saved successfully to Firestore');
      
      // 🔥 Clean up secondary auth session 🔥
      try {
        await secondaryAuth.signOut();
        console.log('✅ Cleaned up secondary auth session');
      } catch (signOutError) {
        console.log('Secondary auth cleanup:', signOutError);
      }
      
      // Success notification
      const resultData = {
        ...userData,
        temporary_password: formData.value.password
      };
      
      store.dispatch('showNotification', {
        type: 'success',
        message: `تم إضافة المستخدم "${userData.name}" بنجاح`
      });
      
      result = { success: true, data: resultData };
    }

    // Emit success and close modal
    if (result && result.success) {
      emit('save', result.data || userData);
      emit('success', result.data || userData);
      
      setTimeout(() => {
        emit('close');
        resetForm();
      }, 1000);
    }
    
  } catch (error) {
    console.error('❌ Error in form submission:', error);
    console.error('Error name:', error.name);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    let errorMsg = error.message || 'حدث خطأ أثناء حفظ المستخدم';
    
    // Handle specific Firebase errors
    if (error.code === 'auth/email-already-in-use') {
      errorMsg = 'البريد الإلكتروني مستخدم بالفعل';
    } else if (error.code === 'auth/invalid-email') {
      errorMsg = 'صيغة البريد الإلكتروني غير صحيحة';
    } else if (error.code === 'auth/weak-password') {
      errorMsg = 'كلمة المرور ضعيفة جداً. يجب أن تكون 8 أحرف على الأقل';
    } else if (error.code === 'permission-denied' || error.code === 'firestore/permission-denied') {
      errorMsg = 'صلاحيات غير كافية. تحقق من أنك مسجل كـ مشرف عام';
    } else if (error.message.includes('indexOf')) {
      errorMsg = 'خطأ في إنشاء مسار المستخدم. يرجى المحاولة مرة أخرى';
    } else if (error.message.includes('Firestore database not initialized')) {
      errorMsg = 'خطأ في تهيئة قاعدة البيانات. يرجى تحديث الصفحة';
    } else if (error.message.includes('secondaryAuth is not defined')) {
      errorMsg = 'خطأ في تهيئة النظام. يرجى تحديث الصفحة وإعادة المحاولة';
    }
    
    errorMessage.value = errorMsg;
    validationErrors.value = [errorMsg];
    
    store.dispatch('showNotification', {
      type: 'error',
      message: errorMsg
    });
  } finally {
    loading.value = false;
  }
};
    watch(() => props.isOpen, async (newVal) => {
      if (newVal) {
        resetForm();
        
        if (!props.user) {
          generateStrongPassword();
          // Set default permissions based on role
          applyPermissionSet('warehouse_manager');
        }
        
        await ensureWarehousesLoaded();
        
        if (props.user) {
          // Edit mode - populate form with user data
          formData.value = {
            name: props.user.name || '',
            email: props.user.email || '',
            role: props.user.role || 'company_manager',
            is_active: props.user.is_active !== false,
            phone: props.user.phone || '',
            allowed_warehouses: props.user.allowed_warehouses || [],
            permissions: props.user.permissions || []
          };
          
          // Don't show password for existing users
          delete formData.value.password;
        }
      }
    });

    watch(() => formData.value.role, (newRole) => {
      // Reset allowed_warehouses when role changes away from warehouse_manager
      if (newRole !== 'warehouse_manager') {
        formData.value.allowed_warehouses = [];
      }
      
      // Apply default permission sets based on role
      if (newRole === 'company_manager') {
        applyPermissionSet('view_only');
      } else if (newRole === 'warehouse_manager') {
        applyPermissionSet('warehouse_manager');
      } else if (newRole === 'superadmin') {
        applyPermissionSet('full_access');
      }
    });

    onMounted(async () => {
      await ensureWarehousesLoaded();
    });

    return {
      loading,
      loadingWarehouses,
      errorMessage,
      validationErrors,
      showPassword,
      showWarehouseModal,
      editingWarehouse,
      formData,
      availableRoles,
      permissionGroups,
      allWarehouses,
      primaryWarehouses,
      dispatchWarehouses,
      allPermissionsSelected,
      passwordStrength,
      isFormValid,
      getRoleDisplay,
      getSelectedWarehouseNames,
      generatePassword,
      generateStrongPassword,
      togglePasswordVisibility,
      copyPassword,
      toggleAllWarehouses,
      toggleAllPermissions,
      applyPermissionSet,
      manageWarehouses,
      addNewWarehouse,
      editWarehouse,
      closeWarehouseModal,
      handleWarehouseSave,
      handleSubmit
    };
  }
};
</script>