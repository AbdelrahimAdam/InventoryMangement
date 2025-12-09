<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Main Container -->
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <!-- Header -->
      <div class="mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              المخزون
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              إدارة وتتبع جميع الأصناف في النظام
            </p>
          </div>

          <div class="flex items-center gap-3">
            <button
              @click="refreshData"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              تحديث
            </button>

            <button
              v-if="canExport"
              @click="exportInventory"
              :disabled="exporting"
              class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="exporting" class="w-4 h-4 ml-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <svg v-else class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              {{ exporting ? 'جاري التصدير...' : 'تصدير' }}
            </button>

            <button 
              v-if="canAddItem"
              @click="showAddModal = true"
              class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-colors duration-150"
            >
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              إضافة صنف
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center ml-3">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div class="flex-1 text-right">
              <p class="text-sm text-gray-500 dark:text-gray-400">الأصناف</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">{{ stats.totalItems || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center ml-3">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1 text-right">
              <p class="text-sm text-gray-500 dark:text-gray-400">الكمية</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">{{ stats.totalQuantity || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center ml-3">
              <svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1 text-right">
              <p class="text-sm text-gray-500 dark:text-gray-400">قليلة</p>
              <p class="text-lg font-bold text-red-600 dark:text-red-400">{{ stats.lowStockItems || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center ml-3">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div class="flex-1 text-right">
              <p class="text-sm text-gray-500 dark:text-gray-400">الحركات</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">{{ stats.recentTransactions || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Warehouse Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المخزن</label>
            <select
              v-model="selectedWarehouse"
              @change="handleFilterChange"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع المخازن</option>
              <option v-for="warehouse in accessibleWarehouses" :key="warehouse.id" :value="warehouse.id">
                {{ warehouse.name_ar }}
              </option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الحالة</label>
            <select
              v-model="statusFilter"
              @change="handleFilterChange"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع الحالات</option>
              <option value="in_stock">متوفر</option>
              <option value="low_stock">كمية قليلة</option>
              <option value="out_of_stock">غير متوفر</option>
            </select>
          </div>

          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">بحث</label>
            <div class="relative">
              <input
                type="text"
                v-model="searchTerm"
                @input="handleSearchInput"
                placeholder="ابحث بالاسم، الكود، المورد..."
                class="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !paginatedItems.length" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">جاري تحميل البيانات...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-lg mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{{ error }}</span>
          </div>
          <button @click="error = ''" class="text-red-600 hover:text-red-800">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Inventory Table -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Desktop Table -->
        <div class="hidden lg:block overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
              <tr>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الصورة</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الاسم والكود</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">اللون</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">المخزن</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">المورد</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الكميات</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">المتبقي</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الحالة</th>
                <th v-if="showActions" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="paginatedItems.length === 0">
                <td :colspan="showActions ? 9 : 8" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  <div class="flex flex-col items-center">
                    <svg class="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
                    </svg>
                    <h3 class="text-lg font-medium mb-2">لا توجد أصناف</h3>
                    <p class="text-sm">{{ searchTerm ? 'لم يتم العثور على أصناف مطابقة للبحث' : 'لم يتم إضافة أي أصناف بعد.' }}</p>
                  </div>
                </td>
              </tr>

              <tr 
                v-for="item in paginatedItems" 
                :key="item.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
              >
                <!-- Photo -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex justify-center">
                    <div class="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                      <img 
                        v-if="item.photo_url"
                        :src="item.photo_url" 
                        :alt="item.name"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                        loading="lazy"
                        @load="imageLoaded[item.id] = true"
                      >
                      <div v-else class="w-full h-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Name and Code -->
                <td class="px-6 py-4">
                  <div class="min-w-0">
                    <div class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ item.name }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span class="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {{ item.code }}
                      </span>
                    </div>
                    <div v-if="item.item_location" class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                      <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <span class="truncate">{{ item.item_location }}</span>
                    </div>
                  </div>
                </td>

                <!-- Color -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">{{ item.color || '-' }}</div>
                </td>

                <!-- Warehouse -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">{{ getWarehouseLabel(item.warehouse_id) }}</div>
                </td>

                <!-- Supplier -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white truncate max-w-[150px]">
                    {{ item.supplier || '-' }}
                  </div>
                </td>

                <!-- Quantities -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm space-y-1">
                    <div class="flex items-center justify-between">
                      <span class="text-gray-500 dark:text-gray-400 text-xs">كراتين:</span>
                      <span class="text-gray-900 dark:text-white font-medium">{{ item.cartons_count || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-gray-500 dark:text-gray-400 text-xs">في الكرتونة:</span>
                      <span class="text-gray-900 dark:text-white font-medium">{{ item.per_carton_count || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-gray-500 dark:text-gray-400 text-xs">فردي:</span>
                      <span class="text-gray-900 dark:text-white font-medium">{{ item.single_bottles_count || 0 }}</span>
                    </div>
                  </div>
                </td>

                <!-- Remaining Quantity -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-center">
                    <div :class="getQuantityClass(item.remaining_quantity)" class="text-lg font-bold">
                      {{ item.remaining_quantity }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      من {{ item.total_added }}
                    </div>
                  </div>
                </td>

                <!-- Status -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStockStatusClass(item.remaining_quantity)" 
                        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium">
                    {{ getStockStatus(item.remaining_quantity) }}
                  </span>
                </td>

                <!-- Actions -->
                <td v-if="showActions" class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <button
                      @click="handleEdit(item)"
                      v-if="canEditItem(item)"
                      class="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/20 transition-colors duration-150"
                      title="تعديل"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>

                    <button
                      @click="handleTransfer(item)"
                      v-if="canTransferItem(item)"
                      class="p-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/20 transition-colors duration-150"
                      title="نقل"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                      </svg>
                    </button>

                    <button
                      @click="handleDispatch(item)"
                      v-if="canDispatchItem(item)"
                      class="p-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/20 transition-colors duration-150"
                      title="صرف"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              عرض {{ startIndex + 1 }} - {{ Math.min(endIndex, filteredItems.length) }} من {{ filteredItems.length }}
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                السابق
              </button>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                الصفحة {{ currentPage }} من {{ totalPages }}
              </span>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                التالي
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Cards -->
        <div class="lg:hidden">
          <div v-if="paginatedItems.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
            <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
            </svg>
            <h3 class="text-lg font-medium mb-2">لا توجد أصناف</h3>
            <p class="text-sm">{{ searchTerm ? 'لم يتم العثور على أصناف مطابقة للبحث' : 'لم يتم إضافة أي أصناف بعد.' }}</p>
          </div>

          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <div 
              v-for="item in paginatedItems" 
              :key="item.id"
              class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
            >
              <div class="flex gap-4">
                <!-- Photo -->
                <div class="flex-shrink-0">
                  <div class="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <img 
                      v-if="item.photo_url"
                      :src="item.photo_url" 
                      :alt="item.name"
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                      loading="lazy"
                      @load="imageLoaded[item.id] = true"
                    >
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Item Details -->
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start mb-1">
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ item.name }}</h3>
                    <span :class="getQuantityClass(item.remaining_quantity)" class="text-lg font-bold">
                      {{ item.remaining_quantity }}
                    </span>
                  </div>

                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                      {{ item.code }}
                    </span>
                    <span :class="getStockStatusClass(item.remaining_quantity)" class="text-xs px-2 py-0.5 rounded-full">
                      {{ getStockStatus(item.remaining_quantity) }}
                    </span>
                  </div>

                  <div class="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <div class="flex items-center gap-2">
                      <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      </svg>
                      <span class="truncate">{{ getWarehouseLabel(item.warehouse_id) }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                      </svg>
                      <span>اللون: {{ item.color || 'بدون' }}</span>
                    </div>
                    <div v-if="item.supplier" class="flex items-center gap-2">
                      <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                      <span class="truncate">المورد: {{ item.supplier }}</span>
                    </div>
                  </div>

                  <!-- Mobile Actions -->
                  <div v-if="showActions" class="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div class="flex justify-between gap-2">
                      <button 
                        v-if="canEditItem(item)"
                        @click="handleEdit(item)"
                        class="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/20 transition-colors"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        تعديل
                      </button>

                      <button 
                        @click="handleTransfer(item)"
                        v-if="canTransferItem(item)"
                        class="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-medium rounded-lg hover:bg-green-100 dark:hover:bg-green-800/20 transition-colors"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                        </svg>
                        نقل
                      </button>

                      <button 
                        @click="handleDispatch(item)"
                        v-if="canDispatchItem(item)"
                        class="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/20 transition-colors"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                        صرف
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mobile Pagination -->
            <div v-if="totalPages > 1" class="p-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                السابق
              </button>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ currentPage }} / {{ totalPages }}
              </span>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                التالي
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Add Button -->
    <button 
      v-if="canAddItem && showActions"
      @click="showAddModal = true"
      class="fixed bottom-6 left-6 z-40 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-purple-600 transition-colors duration-150 lg:hidden"
      title="إضافة صنف"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
      </svg>
    </button>

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
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, reactive, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { debounce } from 'lodash';
import AddItemModal from '@/components/inventory/AddItemModal.vue';
import DispatchModal from '@/components/inventory/DispatchModal.vue';
import EditItemModal from '@/components/inventory/EditItemModal.vue';
import TransferModal from '@/components/inventory/TransferModal.vue';

export default {
  name: 'InventoryTable',
  components: {
    AddItemModal,
    DispatchModal,
    EditItemModal,
    TransferModal
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    
    // State - Minimal and efficient
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
    const imageLoaded = reactive({});
    const exporting = ref(false);
    const currentPage = ref(1);
    const itemsPerPage = ref(20);
    const searchTimeout = ref(null);
    
    // Computed properties
    const userRole = computed(() => store.getters.userRole);
    const userProfile = computed(() => store.state.userProfile);
    const inventory = computed(() => store.state.inventory || []);
    const stats = computed(() => store.getters.inventoryStats || {});
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
    
    // Filtered items - OPTIMIZED VERSION
    const filteredItems = computed(() => {
      if (!inventory.value.length) return [];
      
      let filtered = inventory.value; // Reference, not copy
      
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
      
      // Apply search filter (optimized)
      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase();
        filtered = filtered.filter(item => 
          (item.name || '').toLowerCase().includes(term) ||
          (item.code || '').toLowerCase().includes(term)
        );
      }
      
      return filtered;
    });
    
    // Pagination
    const totalPages = computed(() => {
      return Math.ceil(filteredItems.value.length / itemsPerPage.value);
    });

    const startIndex = computed(() => {
      return (currentPage.value - 1) * itemsPerPage.value;
    });

    const endIndex = computed(() => {
      return startIndex.value + itemsPerPage.value;
    });

    const paginatedItems = computed(() => {
      return filteredItems.value.slice(startIndex.value, endIndex.value);
    });
    
    // Helper Methods
    const getWarehouseLabel = (warehouseId) => {
      const warehouse = allWarehouses.value.find(w => w.id === warehouseId);
      return warehouse ? warehouse.name_ar : 'غير معروف';
    };
    
    const getStockStatus = (quantity) => {
      if (quantity === 0) return 'نفذ';
      if (quantity < 10) return 'قليل';
      return 'متوفر';
    };
    
    const getStockStatusClass = (quantity) => {
      if (quantity === 0) return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800';
      if (quantity < 10) return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-800';
      return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800';
    };

    const getQuantityClass = (quantity) => {
      if (quantity === 0) return 'text-red-600 dark:text-red-400';
      if (quantity < 10) return 'text-orange-600 dark:text-orange-400';
      return 'text-green-600 dark:text-green-400';
    };
    
    const handleImageError = (event) => {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMTZMNC42ODYgMTUuMzE0QzQuODgyIDExLjUwNyA4LjA5MyA5IDEyIDlDMTUuOTA3IDkgMTkuMTE4IDExLjUwNyAxOS4zMTQgMTUuMzE0TDIwIDE2TTggMjFIMTZNNSAxNEgxOU0xMiAxN0MxMiAxNy41NTIyOCAxMS41NTIzIDE4IDExIDE4QzEwLjQ0NzcgMTggMTAgMTcuNTUyMyAxMCAxN0MxMCAxNi40NDc3IDEwLjQ0NzcgMTYgMTEgMTZDMTEuNTUyMyAxNiAxMiAxNi40NDc3IDEyIDE3WiIgc3Ryb2tlPSI2QjcyOEQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
    };
    
    // Action Methods - OPTIMIZED
    const handleFilterChange = () => {
      currentPage.value = 1; // Reset to first page on filter change
    };
    
    const handleSearchInput = debounce(() => {
      currentPage.value = 1;
    }, 300);
    
    // OPTIMIZED: Add item without refreshing entire page
    const handleItemSaved = async (newItem) => {
      showAddModal.value = false;
      
      // OPTIMISTIC UPDATE: Add to local state immediately
      store.commit('ADD_INVENTORY_ITEM', newItem);
      
      // Show success message
      store.dispatch('showNotification', {
        type: 'success',
        message: `تم إضافة "${newItem.name}" بنجاح`
      });
      
      // Don't refresh entire data - just update locally
      // The Firestore listener will sync automatically in background
    };
    
    // Handle edit success
    const handleItemUpdated = async (updatedItem) => {
      showEditModal.value = false;
      selectedItemForEdit.value = null;
      
      // Update local state
      store.commit('UPDATE_INVENTORY_ITEM', updatedItem);
      
      store.dispatch('showNotification', {
        type: 'success',
        message: 'تم تحديث الصنف بنجاح'
      });
    };
    
    // Handle transfer success
    const handleTransferSuccess = async (result) => {
      showTransferModal.value = false;
      selectedItemForTransfer.value = null;
      
      // Update local state
      if (result.sourceItem) {
        store.commit('UPDATE_INVENTORY_ITEM', result.sourceItem);
      }
      if (result.targetItem) {
        store.commit('UPDATE_INVENTORY_ITEM', result.targetItem);
      }
      
      store.dispatch('showNotification', {
        type: 'success',
        message: 'تم النقل بنجاح'
      });
    };
    
    // Handle dispatch success
    const handleDispatchSuccess = async (updatedItem) => {
      showDispatchModal.value = false;
      selectedItemForDispatch.value = null;
      
      // Update local state
      store.commit('UPDATE_INVENTORY_ITEM', updatedItem);
      
      store.dispatch('showNotification', {
        type: 'success',
        message: 'تم الصرف بنجاح'
      });
    };
    
    // Refresh data - OPTIMIZED VERSION
    const refreshData = async () => {
      try {
        loading.value = true;
        error.value = '';
        
        // Only fetch fresh data, don't reset everything
        await store.dispatch('fetchInventory');
        
        // Update stats
        store.dispatch('calculateInventoryStats');
        
      } catch (err) {
        console.error('Error refreshing data:', err);
        error.value = 'حدث خطأ في تحديث البيانات';
      } finally {
        loading.value = false;
      }
    };
    
    // Export to Excel
    const exportInventory = async () => {
      try {
        exporting.value = true;
        const data = filteredItems.value;
        
        if (data.length === 0) {
          error.value = 'لا توجد بيانات للتصدير';
          return;
        }

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
          'الحالة'
        ];
        
        const csvData = data.map(item => [
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
          getStockStatus(item.remaining_quantity)
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
        
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم تصدير ${data.length} صنف بنجاح`
        });
        
      } catch (err) {
        console.error('Export error:', err);
        error.value = 'فشل في تصدير الملف';
      } finally {
        exporting.value = false;
      }
    };
    
    // Action handlers
    const handleTransfer = (item) => {
      if (!canTransferItem(item)) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية النقل من هذا المخزن'
        });
        return;
      }
      selectedItemForTransfer.value = item;
      showTransferModal.value = true;
    };
    
    const handleDispatch = (item) => {
      if (!canDispatchItem(item)) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية الصرف من هذا المخزن'
        });
        return;
      }
      selectedItemForDispatch.value = item;
      showDispatchModal.value = true;
    };
    
    const handleEdit = (item) => {
      if (!canEditItem(item)) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية التعديل على هذا المخزن'
        });
        return;
      }
      selectedItemForEdit.value = item;
      showEditModal.value = true;
    };
    
    // Pagination methods
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    // Lifecycle
    onMounted(() => {
      // Set default warehouse if user only has access to one
      if (accessibleWarehouses.value.length === 1) {
        selectedWarehouse.value = accessibleWarehouses.value[0].id;
      }
      
      // Check if we should open add modal from route
      if (route.name === 'AddInventory') {
        showAddModal.value = true;
      }
      
      // Initial data load
      refreshData();
    });
    
    // Cleanup
    onUnmounted(() => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }
    });
    
    // Watch for filter changes to reset pagination
    watch(() => [searchTerm.value, statusFilter.value, selectedWarehouse.value], () => {
      currentPage.value = 1;
    }, { deep: false }); // Shallow watch for performance
    
    // Preload images for visible items
    watch(paginatedItems, (items) => {
      items.forEach(item => {
        if (item.photo_url && !imageLoaded[item.id]) {
          const img = new Image();
          img.src = item.photo_url;
          img.onload = () => {
            imageLoaded[item.id] = true;
          };
        }
      });
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
      imageLoaded,
      exporting,
      currentPage,
      
      // Computed
      userRole,
      userProfile,
      inventory,
      stats,
      accessibleWarehouses,
      allWarehouses,
      canAddItem,
      canExport,
      showActions,
      readonly,
      filteredItems,
      paginatedItems,
      totalPages,
      startIndex,
      endIndex,
      
      // Helper Methods
      getWarehouseLabel,
      getStockStatus,
      getStockStatusClass,
      getQuantityClass,
      handleImageError,
      
      // Permission Methods
      canEditItem,
      canTransferItem,
      canDispatchItem,
      
      // Action Methods
      handleFilterChange,
      handleSearchInput,
      refreshData,
      exportInventory,
      handleTransfer,
      handleDispatch,
      handleEdit,
      handleItemSaved,
      handleItemUpdated,
      handleTransferSuccess,
      handleDispatchSuccess,
      nextPage,
      prevPage
    };
  }
};
</script>

<style scoped>
/* Performance-optimized CSS */
.container {
  max-width: 100%;
}

/* Optimize table rendering */
table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}

/* Reduce animations for performance */
.transition-colors {
  transition-property: background-color, border-color, color;
  transition-duration: 150ms;
}

/* Optimize hover states */
.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.dark .hover\:bg-gray-700\/50:hover {
  background-color: rgba(55, 65, 81, 0.5);
}

/* Improve touch targets on mobile */
@media (max-width: 768px) {
  button {
    min-height: 44px;
  }
}

/* Optimize scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #6b7280;
}

/* Sticky table headers */
.sticky {
  position: sticky;
  z-index: 10;
}

/* Image optimization */
img {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .transition-colors,
  .animate-spin {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  table {
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
  }
}
</style>