<template>
  <div class="space-y-4">
    <!-- Stats Overview - Updated to match new layout style -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
      <!-- Total Items Card -->
      <div class="bg-gradient-to-bl from-white to-yellow-50 dark:from-gray-800 dark:to-yellow-900/10 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
        <div class="px-3 py-3 lg:px-4 lg:py-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-9 w-9 lg:h-10 lg:w-10 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg">
              <svg class="h-4 w-4 lg:h-5 lg:w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div class="mr-3 lg:mr-4 flex-1">
              <dt class="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">إجمالي الأصناف</dt>
              <dd class="mt-1 text-base lg:text-xl font-bold text-gray-800 dark:text-gray-100">{{ formatNumber(dashboardStats?.totalItems || 0) }}</dd>
            </div>
          </div>
        </div>
      </div>

      <!-- Total Quantity Card -->
      <div class="bg-gradient-to-bl from-white to-green-50 dark:from-gray-800 dark:to-green-900/10 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
        <div class="px-3 py-3 lg:px-4 lg:py-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-9 w-9 lg:h-10 lg:w-10 rounded-xl bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center shadow-lg">
              <svg class="h-4 w-4 lg:h-5 lg:w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="mr-3 lg:mr-4 flex-1">
              <dt class="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">إجمالي الكمية</dt>
              <dd class="mt-1 text-base lg:text-xl font-bold text-gray-800 dark:text-gray-100">{{ formatNumber(dashboardStats?.totalQuantity || 0) }}</dd>
            </div>
          </div>
        </div>
      </div>

      <!-- Low Stock Items Card -->
      <div class="bg-gradient-to-bl from-white to-orange-50 dark:from-gray-800 dark:to-orange-900/10 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
        <div class="px-3 py-3 lg:px-4 lg:py-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-9 w-9 lg:h-10 lg:w-10 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center shadow-lg">
              <svg class="h-4 w-4 lg:h-5 lg:w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="mr-3 lg:mr-4 flex-1">
              <dt class="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">أصناف قليلة</dt>
              <dd class="mt-1 text-base lg:text-xl font-bold text-red-600 dark:text-red-400">{{ formatNumber(dashboardStats?.lowStockItems || 0) }}</dd>
            </div>
          </div>
        </div>
      </div>

      <!-- Today's Transactions Card -->
      <div class="bg-gradient-to-bl from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/10 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
        <div class="px-3 py-3 lg:px-4 lg:py-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-9 w-9 lg:h-10 lg:w-10 rounded-xl bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center shadow-lg">
              <svg class="h-4 w-4 lg:h-5 lg:w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div class="mr-3 lg:mr-4 flex-1">
              <dt class="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">الحركات اليوم</dt>
              <dd class="mt-1 text-base lg:text-xl font-bold text-gray-800 dark:text-gray-100">{{ formatNumber(dashboardStats?.recentTransactions || 0) }}</dd>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions Bar -->
    <div v-if="canModifyItems" class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-xl border border-yellow-200 dark:border-yellow-800 shadow-sm p-3">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center space-x-2 space-x-reverse">
          <div class="h-8 w-8 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-800 dark:text-gray-200">إجراءات سريعة</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400">أداء المهام بسرعة وسهولة</p>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-2">
          <!-- Add Item Button -->
          <router-link 
            to="/inventory/add"
            class="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
          >
            <svg class="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            إضافة صنف
          </router-link>
          
          <!-- Transfer Button -->
          <router-link 
            to="/transfers"
            class="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
          >
            <svg class="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
            نقل أصناف
          </router-link>
          
          <!-- Dispatch Button -->
          <router-link 
            to="/dispatch"
            class="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
          >
            <svg class="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            صرف خارجي
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main Content Card -->
    <div class="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
      <!-- Header with Search and Filters -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 lg:mb-6">
        <div class="flex-1">
          <h2 class="text-base lg:text-lg font-bold text-gray-800 dark:text-gray-100">المخزون الحالي</h2>
          <p class="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-0.5">عرض الأصناف في المخزون</p>
        </div>

        <div class="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
          <!-- Search Input -->
          <div class="relative flex-grow">
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input
              type="text"
              v-model="searchTerm"
              @input="handleSearch"
              placeholder="ابحث عن صنف..."
              class="block w-full pr-10 pl-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm transition-all duration-200"
            />
          </div>

          <!-- Filter by Warehouse -->
          <select
            v-model="selectedWarehouse"
            @change="handleWarehouseChange"
            class="block w-full lg:w-auto pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm transition-all duration-200 appearance-none"
            :disabled="loading || !accessibleWarehouses || accessibleWarehouses.length === 0"
          >
            <option value="">جميع المخازن</option>
            <option v-for="warehouse in accessibleWarehouses" :key="warehouse.id" :value="warehouse.id">
              {{ warehouse.name_ar }}
            </option>
          </select>

          <!-- View All Button -->
          <router-link 
            to="/inventory"
            class="inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 shadow-sm text-sm"
          >
            <svg class="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
            عرض الكل
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-flex items-center justify-center">
          <div class="relative">
            <div class="w-12 h-12 rounded-full border-2 border-yellow-200"></div>
            <div class="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin"></div>
          </div>
        </div>
        <p class="mt-3 text-sm text-gray-600 dark:text-gray-400 font-medium">جاري تحميل البيانات...</p>
      </div>

      <!-- Inventory Table or Empty State -->
      <div v-else>
        <!-- Table Header -->
        <div v-if="transformedInventory.length > 0" class="mb-4">
          <div class="grid grid-cols-12 gap-2 px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600 text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300">
            <div class="col-span-4">اسم الصنف</div>
            <div class="col-span-2">الكود</div>
            <div class="col-span-2">اللون</div>
            <div class="col-span-2">المخزن</div>
            <div class="col-span-1">الكمية</div>
            <div class="col-span-1 text-center">الإجراءات</div>
          </div>
        </div>

        <!-- Inventory Items -->
        <div v-if="transformedInventory.length > 0" class="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          <div 
            v-for="item in transformedInventory.slice(0, 10)" 
            :key="item.id"
            class="group bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 transition-all duration-200 hover:shadow-md hover:border-yellow-300 dark:hover:border-yellow-700"
          >
            <div class="grid grid-cols-12 gap-2 items-center">
              <!-- Item Name -->
              <div class="col-span-4">
                <div class="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">{{ item.name }}</div>
                <div v-if="item.supplier && item.supplier !== '-'" class="text-xs text-gray-600 dark:text-gray-400 truncate mt-0.5">
                  {{ item.supplier }}
                </div>
              </div>
              
              <!-- Code -->
              <div class="col-span-2">
                <div class="text-xs lg:text-sm text-gray-700 dark:text-gray-300 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg inline-block">
                  {{ item.code }}
                </div>
              </div>
              
              <!-- Color -->
              <div class="col-span-2">
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: item.color }" v-if="item.color && item.color !== '-'"></div>
                  <span class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ item.color }}</span>
                </div>
              </div>
              
              <!-- Warehouse -->
              <div class="col-span-2">
                <span class="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300">
                  {{ getWarehouseName(item.warehouse_id) }}
                </span>
              </div>
              
              <!-- Quantity -->
              <div class="col-span-1">
                <span :class="[
                  'text-sm font-bold px-2 py-1 rounded-lg',
                  item.remaining_quantity < 10 ? 'bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 text-red-700 dark:text-red-300' :
                  item.remaining_quantity < 50 ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 text-yellow-700 dark:text-yellow-300' :
                  'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 text-green-700 dark:text-green-300'
                ]">
                  {{ formatNumber(item.remaining_quantity) }}
                </span>
              </div>
              
              <!-- Actions -->
              <div class="col-span-1">
                <div class="flex items-center justify-center space-x-1 space-x-reverse">
                  <!-- Transfer Button -->
                  <router-link
                    v-if="canModifyItems"
                    :to="'/transfers'"
                    class="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors duration-200"
                    title="نقل"
                    @click="setSelectedItem(item)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                    </svg>
                  </router-link>
                  
                  <!-- Dispatch Button -->
                  <router-link
                    v-if="canModifyItems"
                    :to="'/dispatch'"
                    class="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 transition-colors duration-200"
                    title="صرف"
                    @click="setSelectedItem(item)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                  </router-link>
                </div>
              </div>
            </div>
            
            <!-- Additional Details (shown on hover) -->
            <div class="mt-2 pt-2 border-t border-gray-100 dark:border-gray-600 hidden group-hover:block transition-all duration-200">
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div>
                  <span class="font-medium">الكراتين:</span>
                  <span class="mr-1">{{ item.cartons_count }}</span>
                </div>
                <div>
                  <span class="font-medium">في الكرتونة:</span>
                  <span class="mr-1">{{ item.per_carton_count }}</span>
                </div>
                <div>
                  <span class="font-medium">الفردي:</span>
                  <span class="mr-1">{{ item.single_bottles_count }}</span>
                </div>
                <div>
                  <span class="font-medium">آخر تحديث:</span>
                  <span class="mr-1">{{ formatDate(item.updated_at) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination Info -->
        <div v-if="transformedInventory.length > 0" class="mt-4 flex items-center justify-between">
          <div class="text-xs text-gray-600 dark:text-gray-400">
            عرض {{ Math.min(transformedInventory.length, 10) }} من {{ transformedInventory.length }} صنف
            <span v-if="transformedInventory.length > 10" class="text-yellow-600 dark:text-yellow-400"> (عرض 10 فقط)</span>
          </div>
          
          <!-- View All Button -->
          <router-link 
            to="/inventory"
            class="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 shadow-sm text-sm"
          >
            <svg class="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
            عرض كل الأصناف
          </router-link>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8 lg:py-12">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
            </svg>
          </div>
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">لا توجد بيانات</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">لم يتم إضافة أي أصناف بعد.</p>
          
          <div class="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
            <router-link 
              v-if="canModifyItems" 
              to="/inventory/add"
              class="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-md text-sm"
            >
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              إضافة صنف جديد
            </router-link>
            
            <button 
              @click="refreshData"
              class="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 shadow-sm text-sm"
            >
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              تحديث البيانات
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Transactions Section -->
    <div v-if="recentTransactions.length > 0" class="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-base lg:text-lg font-bold text-gray-800 dark:text-gray-100">آخر الحركات</h2>
          <p class="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-0.5">آخر 5 عمليات في النظام</p>
        </div>
        
        <router-link 
          to="/transactions"
          class="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 shadow-sm text-sm"
        >
          <svg class="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
          عرض الكل
        </router-link>
      </div>
      
      <div class="space-y-2">
        <div 
          v-for="transaction in recentTransactions.slice(0, 5)" 
          :key="transaction.id"
          class="bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 transition-all duration-200 hover:shadow-md"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3 space-x-reverse">
              <div :class="[
                'h-8 w-8 rounded-lg flex items-center justify-center',
                transaction.type === 'add' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                transaction.type === 'transfer' ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                'bg-gradient-to-r from-red-400 to-red-500'
              ]">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="transaction.type === 'add'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  <path v-else-if="transaction.type === 'transfer'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
              </div>
              
              <div>
                <div class="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {{ getTransactionTypeLabel(transaction.type) }}
                </div>
                <div class="text-xs text-gray-600 dark:text-gray-400">
                  {{ transaction.item_name || 'صنف غير محدد' }}
                </div>
              </div>
            </div>
            
            <div class="text-right">
              <div class="text-sm font-bold" :class="[
                transaction.type === 'add' ? 'text-green-600 dark:text-green-400' :
                transaction.type === 'transfer' ? 'text-blue-600 dark:text-blue-400' :
                'text-red-600 dark:text-red-400'
              ]">
                {{ transaction.type === 'add' ? '+' : transaction.type === 'transfer' ? '↔' : '-' }}{{ formatNumber(transaction.quantity) }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {{ formatTimeAgo(transaction.created_at) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { debounce } from 'lodash';

export default {
  name: 'Dashboard',
  setup() {
    const store = useStore();
    const router = useRouter();
    
    const selectedWarehouse = ref('');
    const searchTerm = ref('');
    const loading = ref(true);
    
    // Computed properties with safe defaults
    const userRole = computed(() => store.getters.userRole || '');
    const userProfile = computed(() => store.state.userProfile || {});
    const dashboardStats = computed(() => store.getters.dashboardStats || {});
    const inventory = computed(() => store.state.inventory || []);
    const warehouses = computed(() => store.state.warehouses || []);
    const transactions = computed(() => store.state.transactions || []);
    
    // Permission getters
    const canModifyItems = computed(() => {
      const role = userRole.value;
      const profile = userProfile.value;
      
      if (role === 'superadmin') return true;
      
      if (role === 'warehouse_manager') {
        const hasWarehouses = profile?.allowed_warehouses?.length > 0;
        const hasPermission = profile?.permissions?.includes('full_access') || 
                              profile?.permissions?.includes('manage_inventory');
        return hasWarehouses && hasPermission;
      }
      
      return false;
    });
    
    // Get accessible warehouses based on user role
    const accessibleWarehouses = computed(() => {
      const role = userRole.value;
      const profile = userProfile.value;
      
      if (role === 'superadmin') {
        return warehouses.value;
      }
      
      if (role === 'warehouse_manager') {
        const allowedIds = profile?.allowed_warehouses || [];
        return warehouses.value.filter(w => allowedIds.includes(w.id));
      }
      
      return [];
    });
    
    // Filtered inventory based on search and warehouse selection
    const filteredInventory = computed(() => {
      let filtered = [...inventory.value];
      
      // Apply warehouse filter
      if (selectedWarehouse.value) {
        filtered = filtered.filter(item => 
          (item.warehouse_id || item.المخزن_id) === selectedWarehouse.value
        );
      }
      
      // Apply search filter
      if (searchTerm.value.trim()) {
        const term = searchTerm.value.toLowerCase().trim();
        filtered = filtered.filter(item => {
          const name = (item.name || item.الاسم || '').toLowerCase();
          const code = (item.code || item.الكود || '').toLowerCase();
          const color = (item.color || item.اللون || '').toLowerCase();
          const supplier = (item.supplier || item.المورد || '').toLowerCase();
          
          return name.includes(term) || 
                 code.includes(term) || 
                 color.includes(term) ||
                 supplier.includes(term);
        });
      }
      
      return filtered;
    });

    // Transform inventory data
    const transformedInventory = computed(() => {
      return filteredInventory.value.map(item => ({
        id: item.id || item.ID,
        name: item.name || item.الاسم || 'غير محدد',
        code: item.code || item.الكود || '-',
        color: item.color || item.اللون || '-',
        warehouse_id: item.warehouse_id || item.المخزن_id,
        supplier: item.supplier || item.المورد || '-',
        item_location: item.item_location || item.مكان_الصنف || '-',
        cartons_count: item.cartons_count || item.كراتين || 0,
        per_carton_count: item.per_carton_count || item.في_الكرتونة || 0,
        single_bottles_count: item.single_bottles_count || item.فردي || 0,
        total_added: item.total_added || item.المضاف || 0,
        remaining_quantity: item.remaining_quantity || item.الكميه_المتبقيه || 0,
        updated_at: item.updated_at || item.آخر_تحديث || new Date()
      }));
    });
    
    // Recent transactions for dashboard
    const recentTransactions = computed(() => {
      return transactions.value.slice(0, 10).map(transaction => ({
        id: transaction.id || transaction.ID,
        type: transaction.type || transaction.النوع || 'add',
        item_name: transaction.item_name || transaction.اسم_الصنف || '',
        quantity: transaction.quantity || transaction.الكمية || 0,
        from_warehouse: transaction.from_warehouse || transaction.من_المخزن,
        to_warehouse: transaction.to_warehouse || transaction.الى_المخزن,
        created_at: transaction.created_at || transaction.تاريخ_الحركة || new Date(),
        user_name: transaction.user_name || transaction.اسم_المستخدم || ''
      }));
    });

    // Helper functions
    const formatNumber = (num) => {
      if (isNaN(num) || num === null || num === undefined) return '0';
      return new Intl.NumberFormat('ar-EG').format(num);
    };
    
    const formatDate = (dateString) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch {
        return 'غير معروف';
      }
    };
    
    const formatTimeAgo = (dateString) => {
      try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'الآن';
        if (diffMins < 60) return `قبل ${diffMins} دقيقة`;
        if (diffHours < 24) return `قبل ${diffHours} ساعة`;
        if (diffDays < 7) return `قبل ${diffDays} يوم`;
        return formatDate(dateString);
      } catch {
        return 'غير معروف';
      }
    };
    
    const getWarehouseName = (warehouseId) => {
      const warehouse = warehouses.value.find(w => w.id === warehouseId);
      return warehouse?.name_ar || 'غير محدد';
    };
    
    const getTransactionTypeLabel = (type) => {
      const labels = {
        'add': 'إضافة صنف',
        'transfer': 'نقل بين المخازن',
        'dispatch': 'صرف خارجي',
        'edit': 'تعديل صنف',
        'delete': 'حذف صنف'
      };
      return labels[type] || 'حركة';
    };

    // Search handler with debounce
    const handleSearch = debounce(() => {
      // Search is handled in computed property
    }, 300);

    const handleWarehouseChange = () => {
      // Warehouse change is handled in computed property
    };
    
    const refreshData = async () => {
      loading.value = true;
      try {
        await store.dispatch('fetchDashboardStats');
        await store.dispatch('fetchInventory');
        await store.dispatch('fetchTransactions');
      } catch (error) {
        console.error('Error refreshing data:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'فشل في تحديث البيانات'
        });
      } finally {
        loading.value = false;
      }
    };
    
    const setSelectedItem = (item) => {
      // Store the selected item for transfers/dispatch
      store.commit('SET_SELECTED_ITEM', item);
    };

    onMounted(async () => {
      try {
        // Set default warehouse if accessible warehouses exist
        if (accessibleWarehouses.value && accessibleWarehouses.value.length > 0) {
          const mainWarehouse = store.getters.mainWarehouse;
          selectedWarehouse.value = mainWarehouse?.id || accessibleWarehouses.value[0]?.id || '';
        }
        
        // Load dashboard data
        await Promise.all([
          store.dispatch('fetchDashboardStats'),
          store.dispatch('fetchInventory'),
          store.dispatch('fetchTransactions')
        ]);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'فشل في تحميل بيانات لوحة التحكم'
        });
      } finally {
        setTimeout(() => {
          loading.value = false;
        }, 500);
      }
    });

    onUnmounted(() => {
      // Cleanup if needed
    });

    return {
      // Refs
      selectedWarehouse,
      searchTerm,
      loading,
      
      // Computed
      userRole,
      dashboardStats,
      inventory,
      transformedInventory,
      recentTransactions,
      canModifyItems,
      accessibleWarehouses,
      
      // Methods
      formatNumber,
      formatDate,
      formatTimeAgo,
      getWarehouseName,
      getTransactionTypeLabel,
      handleSearch,
      handleWarehouseChange,
      refreshData,
      setSelectedItem
    };
  }
};
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Smooth transitions */
.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(243, 244, 246, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.7);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.8);
}

.dark ::-webkit-scrollbar-track {
  background: rgba(31, 41, 55, 0.5);
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.7);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.8);
}

/* Improve button press feedback */
button:active {
  transform: scale(0.98);
}

/* Better focus states */
button:focus-visible,
[role="button"]:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 2px solid #f59e0b;
  outline-offset: 2px;
  border-radius: 0.75rem;
}

/* Gradient background animations */
.bg-gradient-to-r,
.bg-gradient-to-l,
.bg-gradient-to-br,
.bg-gradient-to-bl {
  background-size: 200% 200%;
}

/* Hover effects */
.hover\:scale-\[1\.02\]:hover {
  transform: scale(1.02);
}

/* Glassmorphism effects */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
</style>
