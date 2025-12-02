<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 sm:px-6">
        <div class="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
          <!-- Logo and Title -->
          <div class="flex items-center space-x-3 space-x-reverse">
            <router-link to="/" class="flex items-center space-x-2 space-x-reverse hover:opacity-80 transition-opacity">
              <div class="h-10 w-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">م</span>
              </div>
              <div class="hidden sm:block">
                <h1 class="text-lg font-bold text-gray-900 dark:text-white">إدارة المخزون</h1>
                <p class="text-xs text-gray-500 dark:text-gray-400">نظام إدارة المخزون</p>
              </div>
            </router-link>
            <div class="sm:hidden">
              <h1 class="text-base font-bold text-gray-900 dark:text-white">المخزون</h1>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <!-- Warehouse Filter -->
            <div v-if="accessibleWarehouses.length > 0" class="relative flex-1 sm:flex-none">
              <select 
                v-model="selectedWarehouse" 
                @change="updateWarehouseFilter"
                class="w-full sm:w-auto appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">جميع المخازن</option>
                <option v-for="warehouse in accessibleWarehouses" :key="warehouse.id" :value="warehouse.id">
                  {{ warehouse.name_ar }}
                </option>
              </select>
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
            </div>

            <!-- Add Item Button -->
            <button 
              v-if="canAddItem"
              @click="showAddModal = true"
              class="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
            >
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span class="hidden sm:inline">إضافة صنف</span>
              <span class="sm:hidden">إضافة</span>
            </button>
            
            <!-- Back to Dashboard -->
            <router-link 
              to="/" 
              class="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              <span class="hidden sm:inline">الرئيسية</span>
              <span class="sm:hidden">رئيسية</span>
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-3 sm:p-4 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center ml-2 sm:ml-3">
              <svg class="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">إجمالي الأصناف</p>
              <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{{ formatNumber(stats.totalItems) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-3 sm:p-4 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center ml-2 sm:ml-3">
              <svg class="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">إجمالي الكمية</p>
              <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{{ formatNumber(stats.totalQuantity) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-3 sm:p-4 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center ml-2 sm:ml-3">
              <svg class="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">أصناف قليلة</p>
              <p class="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400">{{ formatNumber(stats.lowStockItems) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-3 sm:p-4 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center ml-2 sm:ml-3">
              <svg class="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">الحركات اليوم</p>
              <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{{ formatNumber(stats.recentTransactions) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4 mb-4 sm:mb-6">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-1">
            <div class="relative">
              <input
                type="text"
                v-model="searchTerm"
                @input="handleSearch"
                placeholder="ابحث باسم الصنف، الكود، اللون، أو المورد..."
                class="w-full pr-10 pl-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="flex gap-2">
            <!-- Status Filter -->
            <select 
              v-model="statusFilter"
              @change="updateStatusFilter"
              class="flex-1 sm:flex-none px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">جميع الحالات</option>
              <option value="in_stock">متوفر</option>
              <option value="low_stock">كمية قليلة</option>
              <option value="out_of_stock">غير متوفر</option>
            </select>

            <!-- Mobile Export Button -->
            <button 
              v-if="canExport"
              @click="exportInventory"
              class="sm:hidden p-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm"
              title="تصدير"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </button>

            <!-- Desktop Export Button -->
            <button 
              v-if="canExport"
              @click="exportInventory"
              class="hidden sm:inline-flex items-center px-4 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm"
            >
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              تصدير
            </button>

            <!-- Mobile Refresh Button -->
            <button 
              @click="refreshData"
              class="sm:hidden p-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              :disabled="loading"
              title="تحديث"
            >
              <svg 
                :class="['w-4 h-4', loading ? 'animate-spin' : '']" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>

            <!-- Desktop Refresh Button -->
            <button 
              @click="refreshData"
              class="hidden sm:inline-flex items-center px-4 py-2.5 sm:py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              :disabled="loading"
            >
              <svg 
                :class="['w-4 h-4 ml-2', loading ? 'animate-spin' : '']" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <span class="hidden sm:inline">تحديث</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Inventory Table with Fixed Header -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Static Table Header -->
        <div class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div class="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <div class="col-span-3">الاسم والتفاصيل</div>
            <div class="col-span-1 text-center">الكود</div>
            <div class="col-span-1 text-center">اللون</div>
            <div class="col-span-1 text-center">المخزن</div>
            <div class="col-span-1 text-center">المورد</div>
            <div class="col-span-1 text-center">المكان</div>
            <div class="col-span-1 text-center">الكمية</div>
            <div class="col-span-1 text-center">الحالة</div>
            <div v-if="showActions && !readonly && userRole !== 'viewer'" class="col-span-2 text-center">الإجراءات</div>
            <div v-else class="col-span-2 text-center">آخر تحديث</div>
          </div>
        </div>

        <!-- Scrollable Table Body -->
        <div class="table-body max-h-[calc(100vh-350px)] min-h-[300px] overflow-y-auto">
          <!-- Loading State -->
          <div v-if="loading" class="p-8 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-700 dark:text-gray-300">جاري تحميل البيانات...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="p-6 text-center">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full mb-3">
              <svg class="w-6 h-6 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <p class="text-red-700 dark:text-red-300 mb-3">{{ error }}</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredItems.length === 0" class="p-8 text-center">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full mb-3">
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
              </svg>
            </div>
            <h3 class="text-base font-medium text-gray-900 dark:text-white mb-1">لا توجد بيانات</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ searchTerm ? 'لم يتم العثور على أصناف مطابقة للبحث' : 'لم يتم إضافة أي أصناف بعد.' }}
            </p>
          </div>

          <!-- Items List -->
          <div v-else>
            <div 
              v-for="item in filteredItems"
              :key="item.id"
              class="grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
            >
              <!-- Item Name and Details -->
              <div class="col-span-3">
                <div class="font-medium text-sm text-gray-900 dark:text-white mb-1">
                  {{ item.name }}
                </div>
                <div v-if="item.item_location" class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {{ item.item_location }}
                </div>
                <div class="flex items-center gap-2 mt-1">
                  <div class="text-xs text-gray-500">
                    كراتين: {{ item.cartons_count }} × {{ item.per_carton_count }}
                  </div>
                  <div class="text-xs text-gray-500">
                    فردي: {{ item.single_bottles_count }}
                  </div>
                </div>
              </div>

              <!-- Item Code -->
              <div class="col-span-1 text-center">
                <span class="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                  {{ item.code }}
                </span>
              </div>

              <!-- Color -->
              <div class="col-span-1 text-center">
                <div class="flex items-center justify-center">
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ item.color }}</span>
                </div>
              </div>

              <!-- Warehouse -->
              <div class="col-span-1 text-center">
                <div class="text-sm text-gray-600 dark:text-gray-400">{{ getWarehouseLabel(item.warehouse_id) }}</div>
              </div>

              <!-- Supplier -->
              <div class="col-span-1 text-center">
                <div class="text-sm text-gray-600 dark:text-gray-400">{{ item.supplier || '-' }}</div>
              </div>

              <!-- Location -->
              <div class="col-span-1 text-center">
                <div class="text-sm text-gray-600 dark:text-gray-400">{{ item.item_location || '-' }}</div>
              </div>

              <!-- Quantity -->
              <div class="col-span-1 text-center">
                <div class="flex flex-col items-center">
                  <span :class="getQuantityClass(item.remaining_quantity)" class="text-sm font-medium">
                    {{ item.remaining_quantity }}
                  </span>
                  <span class="text-xs text-gray-500 mt-0.5">
                    من {{ item.total_added }}
                  </span>
                </div>
              </div>

              <!-- Status -->
              <div class="col-span-1 text-center">
                <span :class="getStockStatusClass(item.remaining_quantity)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                  {{ getStockStatus(item.remaining_quantity) }}
                </span>
              </div>

              <!-- Actions -->
              <div v-if="showActions && !readonly && userRole !== 'viewer'" class="col-span-2 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button 
                    @click="handleTransfer(item)"
                    class="p-1.5 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                    title="نقل"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                    </svg>
                  </button>
                  
                  <button 
                    @click="handleDispatch(item)"
                    class="p-1.5 bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
                    title="صرف"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                  </button>
                  
                  <button 
                    v-if="canEditItem(item)"
                    @click="handleEdit(item)"
                    class="p-1.5 bg-yellow-50 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-800 transition-colors"
                    title="تعديل"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  
                  <button 
                    v-if="canDeleteItem(item)"
                    @click="handleDelete(item)"
                    class="p-1.5 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-800 transition-colors"
                    title="حذف"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <!-- Updated Date -->
              <div v-else class="col-span-2 text-center">
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDate(item.updated_at) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredItems.length > 0" class="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 gap-3 mt-4">
        <div class="text-sm text-gray-700 dark:text-gray-300 text-center sm:text-right">
          عرض <span class="font-medium">{{ filteredItems.length }}</span> نتيجة
        </div>
      </div>
    </main>

    <!-- Modals -->
    <AddItemModal 
      v-if="showAddModal"
      :isOpen="showAddModal"
      @close="showAddModal = false"
      @success="handleItemSaved"
    />
    
    <DispatchModal 
      v-if="showDispatchModal"
      :isOpen="showDispatchModal"
      :item="selectedItemForDispatch"
      @close="showDispatchModal = false"
      @success="handleDispatchSuccess"
    />
    
    <EditItemModal 
      v-if="showEditModal"
      :isOpen="showEditModal"
      :item="selectedItemForEdit"
      @close="showEditModal = false"
      @success="handleItemUpdated"
    />
    
    <TransferModal 
      v-if="showTransferModal"
      :isOpen="showTransferModal"
      :item="selectedItemForTransfer"
      @close="showTransferModal = false"
      @success="handleTransferSuccess"
    />

    <!-- Loading Overlay -->
    <div v-if="operationLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 flex flex-col items-center shadow-xl m-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-700 dark:text-gray-300 font-medium">جاري المعالجة...</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">يرجى الانتظار</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import AddItemModal from '@/components/inventory/AddItemModal.vue';
import DispatchModal from '@/components/inventory/DispatchModal.vue';
import EditItemModal from '@/components/inventory/EditItemModal.vue';
import TransferModal from '@/components/inventory/TransferModal.vue';

export default {
  name: 'Inventory',
  components: {
    AddItemModal,
    DispatchModal,
    EditItemModal,
    TransferModal
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    
    // State
    const loading = ref(false);
    const error = ref('');
    const showAddModal = ref(false);
    const showEditModal = ref(false);
    const showTransferModal = ref(false);
    const showDispatchModal = ref(false);
    const searchTerm = ref('');
    const statusFilter = ref('');
    const selectedWarehouse = ref('');
    const selectedItemForEdit = ref(null);
    const selectedItemForTransfer = ref(null);
    const selectedItemForDispatch = ref(null);
    
    // Computed properties
    const userRole = computed(() => store.getters.userRole);
    const userProfile = computed(() => store.state.userProfile);
    const inventory = computed(() => store.state.inventory || []);
    const stats = computed(() => store.getters.dashboardStats || {});
    const operationLoading = computed(() => store.state.operationLoading);
    const operationError = computed(() => store.state.operationError);
    const accessibleWarehouses = computed(() => store.getters.accessibleWarehouses || []);
    const allWarehouses = computed(() => store.state.warehouses || []);
    
    // Permissions
    const canAddItem = computed(() => {
      return userRole.value === 'superadmin' || 
             (userRole.value === 'warehouse_manager' && userProfile.value?.allowed_warehouses?.length > 0);
    });
    
    const canEdit = computed(() => {
      return userRole.value === 'superadmin' || userRole.value === 'warehouse_manager';
    });
    
    const canExport = computed(() => {
      return userRole.value === 'superadmin' || userRole.value === 'company_manager';
    });
    
    const showActions = computed(() => {
      return userRole.value !== 'viewer';
    });
    
    const readonly = computed(() => {
      return userRole.value === 'viewer';
    });
    
    const canEditItem = (item) => {
      if (!canEdit.value) return false;
      
      // Warehouse managers can only edit items in their assigned warehouses
      if (userRole.value === 'warehouse_manager') {
        const allowedWarehouses = userProfile.value?.allowed_warehouses || [];
        return allowedWarehouses.includes(item.warehouse_id);
      }
      
      return true;
    };
    
    const canTransferItem = (item) => {
      return canEditItem(item);
    };
    
    const canDispatchItem = (item) => {
      return canEditItem(item);
    };
    
    const canDeleteItem = (item) => {
      return canEditItem(item);
    };
    
    // Filtered items
    const filteredItems = computed(() => {
      let filtered = [...inventory.value];
      
      // Apply warehouse filter
      if (selectedWarehouse.value) {
        filtered = filtered.filter(item => item.warehouse_id === selectedWarehouse.value);
      }
      
      // Apply status filter
      if (statusFilter.value) {
        filtered = filtered.filter(item => {
          const quantity = item.remaining_quantity || 0;
          if (statusFilter.value === 'in_stock') return quantity >= 10;
          if (statusFilter.value === 'low_stock') return quantity > 0 && quantity < 10;
          if (statusFilter.value === 'out_of_stock') return quantity === 0;
          return true;
        });
      }
      
      // Apply search filter
      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase();
        filtered = filtered.filter(item => 
          item.name?.toLowerCase().includes(term) ||
          item.code?.toLowerCase().includes(term) ||
          item.color?.toLowerCase().includes(term) ||
          item.supplier?.toLowerCase().includes(term)
        );
      }
      
      return filtered;
    });
    
    // Helper Methods
    const formatNumber = (num) => {
      return new Intl.NumberFormat('ar-EG').format(num || 0);
    };
    
    const getWarehouseLabel = (warehouseId) => {
      const warehouse = allWarehouses.value.find(w => w.id === warehouseId);
      return warehouse ? warehouse.name_ar : warehouseId;
    };
    
    const getStockStatus = (quantity) => {
      if (quantity === 0) return 'نفذ';
      if (quantity < 10) return 'منخفض';
      return 'متوفر';
    };
    
    const getStockStatusClass = (quantity) => {
      if (quantity === 0) return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      if (quantity < 10) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    };

    const getQuantityClass = (quantity) => {
      if (quantity === 0) return 'text-red-600 dark:text-red-400';
      if (quantity < 10) return 'text-yellow-600 dark:text-yellow-400';
      return 'text-green-600 dark:text-green-400';
    };
    
    const formatDate = (date) => {
      if (!date) return '-';
      const dateObj = date.toDate ? date.toDate() : new Date(date);
      return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(dateObj);
    };
    
    // Action Methods
    const updateWarehouseFilter = () => {
      // Filter update logic
    };
    
    const updateStatusFilter = () => {
      // Filter update logic
    };
    
    const handleSearch = () => {
      // Search logic
    };
    
    const refreshData = () => {
      searchTerm.value = '';
      statusFilter.value = '';
      selectedWarehouse.value = '';
      error.value = '';
      store.dispatch('fetchInventory');
    };
    
    const exportInventory = () => {
      try {
        const headers = [
          'اسم الصنف',
          'الكود',
          'اللون',
          'المخزن',
          'المورد',
          'مكان الصنف',
          'عدد الكراتين',
          'عدد في الكرتونة',
          'عدد القطع الفردية',
          'المجموع المضاف',
          'المجموع المتبقي',
          'الحالة',
          'تاريخ التحديث'
        ];
        
        const csvData = filteredItems.value.map(item => [
          item.name || '',
          item.code || '',
          item.color || '',
          getWarehouseLabel(item.warehouse_id) || '',
          item.supplier || '',
          item.item_location || '',
          item.cartons_count || 0,
          item.per_carton_count || 0,
          item.single_bottles_count || 0,
          item.total_added || 0,
          item.remaining_quantity || 0,
          getStockStatus(item.remaining_quantity),
          formatDate(item.updated_at)
        ]);

        const csvContent = [
          '\uFEFF' + headers.join(','),
          ...csvData.map(row => row.map(field => `"${field}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `مخزون-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (err) {
        error.value = 'فشل في تصدير الملف: ' + err.message;
      }
    };
    
    const handleTransfer = (item) => {
      if (!canTransferItem(item)) {
        alert('ليس لديك صلاحية النقل من هذا المخزن');
        return;
      }
      selectedItemForTransfer.value = item;
      showTransferModal.value = true;
    };
    
    const handleDispatch = (item) => {
      if (!canDispatchItem(item)) {
        alert('ليس لديك صلاحية الصرف من هذا المخزن');
        return;
      }
      selectedItemForDispatch.value = item;
      showDispatchModal.value = true;
    };
    
    const handleEdit = (item) => {
      if (!canEditItem(item)) {
        alert('ليس لديك صلاحية التعديل على هذا المخزن');
        return;
      }
      selectedItemForEdit.value = item;
      showEditModal.value = true;
    };
    
    const handleDelete = (item) => {
      if (!canDeleteItem(item)) {
        alert('ليس لديك صلاحية الحذف من هذا المخزن');
        return;
      }
      
      if (confirm(`هل أنت متأكد من حذف الصنف "${item.name}" (${item.code})؟`)) {
        store.dispatch('deleteInventoryItem', item.id).then(() => {
          alert('تم حذف الصنف بنجاح');
        }).catch(err => {
          error.value = 'فشل في حذف الصنف: ' + err.message;
        });
      }
    };
    
    const handleItemSaved = () => {
      showAddModal.value = false;
      alert('تم إضافة الصنف بنجاح');
    };
    
    const handleItemUpdated = () => {
      showEditModal.value = false;
      selectedItemForEdit.value = null;
      alert('تم تحديث الصنف بنجاح');
    };
    
    const handleTransferSuccess = () => {
      showTransferModal.value = false;
      selectedItemForTransfer.value = null;
      alert('تم النقل بنجاح');
    };
    
    const handleDispatchSuccess = () => {
      showDispatchModal.value = false;
      selectedItemForDispatch.value = null;
      alert('تم الصرف بنجاح');
    };
    
    // Lifecycle
    onMounted(() => {
      // Set initial warehouse filter based on user's allowed warehouses
      if (accessibleWarehouses.value.length === 1) {
        selectedWarehouse.value = accessibleWarehouses.value[0].id;
      }
      
      // Check if we're in add mode from route
      if (route.name === 'AddInventory') {
        showAddModal.value = true;
      }
    });
    
    // Watch for operation errors
    watch(operationError, (errorMsg) => {
      if (errorMsg) {
        error.value = errorMsg;
        setTimeout(() => {
          error.value = '';
          store.commit('CLEAR_OPERATION_ERROR');
        }, 5000);
      }
    });
    
    return {
      // State
      loading,
      error,
      showAddModal,
      showEditModal,
      showTransferModal,
      showDispatchModal,
      searchTerm,
      statusFilter,
      selectedWarehouse,
      selectedItemForEdit,
      selectedItemForTransfer,
      selectedItemForDispatch,
      
      // Computed
      userRole,
      userProfile,
      inventory,
      stats,
      operationLoading,
      operationError,
      accessibleWarehouses,
      allWarehouses,
      canAddItem,
      canExport,
      showActions,
      readonly,
      filteredItems,
      
      // Helper Methods
      formatNumber,
      getWarehouseLabel,
      getStockStatus,
      getStockStatusClass,
      getQuantityClass,
      formatDate,
      
      // Permission Methods
      canEditItem,
      canTransferItem,
      canDispatchItem,
      canDeleteItem,
      
      // Action Methods
      updateWarehouseFilter,
      updateStatusFilter,
      handleSearch,
      refreshData,
      exportInventory,
      handleTransfer,
      handleDispatch,
      handleEdit,
      handleDelete,
      handleItemSaved,
      handleItemUpdated,
      handleTransferSuccess,
      handleDispatchSuccess
    };
  }
};
</script>

<style scoped>
/* Responsive design adjustments */
.container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}

/* Custom scrollbar for table body */
.table-body {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

.table-body::-webkit-scrollbar {
  width: 8px;
}

.table-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.dark .table-body::-webkit-scrollbar-track {
  background: #374151;
}

.table-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.dark .table-body::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.table-body::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

.dark .table-body::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Fixed header styling */
.sticky {
  position: -webkit-sticky;
  position: sticky;
}

/* Ensure table cells have consistent heights */
.grid > div {
  min-height: 2.5rem;
  display: flex;
  align-items: center;
}

/* Button hover effects */
button {
  transition: all 0.2s ease-in-out;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}

/* RTL specific styles */
[dir="rtl"] .space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

/* Dark mode adjustments */
.dark .bg-gray-750 {
  background-color: #2d3748;
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

/* Arabic font */
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap');

* {
  font-family: 'Tajawal', sans-serif;
}

/* Animation for modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Print styles */
@media print {
  .table-body {
    max-height: none !important;
    overflow: visible !important;
  }
  
  button {
    display: none !important;
  }
}
</style>