<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <!-- Page Header -->
      <div class="mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">المخزون</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">إدارة وتتبع جميع الأصناف في النظام</p>
            <!-- Cache Status Indicator -->
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xs text-gray-500 dark:text-gray-400">
                آخر تحديث: {{ lastRefreshTime ? formatTimeAgo(lastRefreshTime) : 'قيد التحميل...' }}
              </span>
              <span v-if="isCachedData" class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded">
                بيانات مخزنة محلياً
              </span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- Load More Button -->
            <button
              v-if="hasMore && !loading"
              @click="loadMoreInventory"
              :disabled="loadingMore"
              class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="loadingMore" class="w-4 h-4 ml-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <svg v-else class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              {{ loadingMore ? 'جاري التحميل...' : 'تحميل المزيد' }}
            </button>

            <!-- Refresh Button -->
            <button
              @click="refreshData"
              :disabled="loading || refreshing"
              class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="refreshing" class="w-4 h-4 ml-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <svg v-else class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ refreshing ? 'جاري التحديث...' : 'تحديث' }}
            </button>

            <!-- Export Button -->
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

            <!-- Add Item Button -->
            <button 
              v-if="canAddItem && showActions"
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

      <!-- Performance Stats -->
      <div v-if="performanceStats" class="mb-4 flex flex-wrap gap-2 text-xs">
        <span class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
          {{ performanceStats.itemCount }} صنف
        </span>
        <span class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
          {{ performanceStats.loadTime }} ثانية للتحميل
        </span>
        <span class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
          {{ performanceStats.memoryUsage }} ميجابايت
        </span>
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
        <p v-if="loadingProgress" class="text-sm text-gray-500 mt-2">{{ loadingProgress }}</p>
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
          <table class="w-full min-w-[1300px]">
            <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
              <tr>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap border-b border-gray-200 dark:border-gray-600">الصورة</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap border-b border-gray-200 dark:border-gray-600">الاسم والكود</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap border-b border-gray-200 dark:border-gray-600">اللون</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap border-b border-gray-200 dark:border-gray-600">المخزن</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap border-b border-gray-200 dark:border-gray-600">المورد</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap border-b border-gray-200 dark:border-gray-600">الكميات</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap border-b border-gray-200 dark:border-gray-600">المتبقي</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap border-b border-gray-200 dark:border-gray-600">الحالة</th>
                <th v-if="showActions" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap border-b border-gray-200 dark:border-gray-600">آخر تحديث</th>
                <th v-if="showActions" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap border-b border-gray-200 dark:border-gray-600">الإجراءات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="paginatedItems.length === 0">
                <td :colspan="showActions ? 10 : 8" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
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
                class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 group"
              >
                <!-- Photo -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex justify-center">
                    <div class="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 cursor-pointer"
                      @click="showItemDetails(item)">
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
                      <div v-if="!imageLoaded[item.id]" class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                        <div class="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Name and Code -->
                <td class="px-6 py-4">
                  <div class="min-w-0">
                    <div class="text-sm font-medium text-gray-900 dark:text-white truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                      @click="showItemDetails(item)">
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
                  <div class="flex items-center gap-2">
                    <div v-if="item.color" class="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"
                      :style="{ backgroundColor: getColorHex(item.color) }"></div>
                    <span class="text-sm text-gray-900 dark:text-white">{{ item.color || '-' }}</span>
                  </div>
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

                <!-- Last Updated -->
                <td v-if="showActions" class="px-6 py-4 whitespace-nowrap">
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    <div class="mb-1">{{ formatRelativeTime(item.updated_at) }}</div>
                    <div class="flex items-center gap-1 text-[11px]">
                      <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      <span>{{ getLastActionUser(item) }}</span>
                    </div>
                  </div>
                </td>

                <!-- Actions -->
                <td v-if="showActions" class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <!-- View Details Button -->
                    <button
                      @click="showItemDetails(item)"
                      class="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors duration-150 group/view"
                      title="عرض التفاصيل"
                    >
                      <svg class="w-4 h-4 group-hover/view:scale-110 transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </button>

                    <!-- More Actions Dropdown -->
                    <div class="relative">
                      <button
                        @click="toggleActionMenu(item.id)"
                        class="p-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-150"
                        title="المزيد من الإجراءات"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                        </svg>
                      </button>

                      <!-- Action Dropdown Menu -->
                      <div v-if="showActionMenu === item.id" 
                        class="absolute left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-30"
                        v-click-outside="() => showActionMenu = null">

                        <!-- Edit Option -->
                        <button
                          v-if="canEditItem(item)"
                          @click="handleEdit(item)"
                          class="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-150"
                        >
                          <svg class="w-4 h-4 ml-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                          تعديل الصنف
                        </button>

                        <!-- Transfer Option -->
                        <button
                          v-if="canTransferItem(item)"
                          @click="handleTransfer(item)"
                          class="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-150"
                        >
                          <svg class="w-4 h-4 ml-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                          </svg>
                          نقل بين المخازن
                        </button>

                        <!-- Dispatch Option -->
                        <button
                          v-if="canDispatchItem(item)"
                          @click="handleDispatch(item)"
                          class="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-150"
                        >
                          <svg class="w-4 h-4 ml-2 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                          </svg>
                          صرف إلى خارجي
                        </button>

                        <!-- Divider -->
                        <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                        <!-- Delete Option -->
                        <button
                          v-if="canDeleteItem(item)"
                          @click="handleDelete(item)"
                          class="w-full flex items-center px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                        >
                          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                          حذف الصنف
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Desktop Pagination -->
        <div v-if="totalPages > 1 && paginatedItems.length > 0" class="hidden lg:flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
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
            <div class="flex items-center gap-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'w-8 h-8 rounded-lg transition-colors text-sm',
                  currentPage === page 
                  ? 'bg-blue-600 text-white border border-blue-600' 
                  : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                {{ page }}
              </button>
            </div>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              التالي
            </button>
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
              <div class="flex gap-4 mb-3">
                <!-- Photo -->
                <div class="flex-shrink-0">
                  <div class="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"
                       @click="showItemDetails(item)">
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
                <div class="flex-1 min-w-0" @click="showItemDetails(item)">
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
                </div>
              </div>

              <!-- Last Updated on Mobile -->
              <div class="mb-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                <span>{{ formatRelativeTime(item.updated_at) }}</span>
                <span>{{ getLastActionUser(item) }}</span>
              </div>

              <!-- Mobile Actions - Optimized for touch -->
              <div v-if="showActions" class="pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                <div class="grid grid-cols-4 gap-2">
                  <button 
                    v-if="canEditItem(item)"
                    @click.stop="handleEdit(item)"
                    class="flex items-center justify-center gap-1 px-2 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/20 transition-colors active:scale-95"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    <span class="hidden xs:inline">تعديل</span>
                  </button>

                  <button 
                    @click.stop="handleTransfer(item)"
                    v-if="canTransferItem(item)"
                    class="flex items-center justify-center gap-1 px-2 py-2.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-medium rounded-lg hover:bg-green-100 dark:hover:bg-green-800/20 transition-colors active:scale-95"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                    </svg>
                    <span class="hidden xs:inline">نقل</span>
                  </button>

                  <button 
                    @click.stop="handleDispatch(item)"
                    v-if="canDispatchItem(item)"
                    class="flex items-center justify-center gap-1 px-2 py-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/20 transition-colors active:scale-95"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    <span class="hidden xs:inline">صرف</span>
                  </button>

                  <button 
                    v-if="canDeleteItem(item)"
                    @click.stop="handleDelete(item)"
                    class="flex items-center justify-center gap-1 px-2 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-800/20 transition-colors active:scale-95"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    <span class="hidden xs:inline">حذف</span>
                  </button>
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

            <!-- Load More Mobile -->
            <div v-if="hasMore && !loading" class="p-4 text-center border-t border-gray-200 dark:border-gray-700">
              <button
                @click="loadMoreInventory"
                :disabled="loadingMore"
                class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="loadingMore" class="w-4 h-4 inline ml-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                {{ loadingMore ? 'جاري تحميل المزيد...' : 'تحميل المزيد من الأصناف' }}
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
      class="fixed bottom-6 left-6 z-40 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-purple-600 transition-colors duration-150 lg:hidden active:scale-95"
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

    <!-- Item Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeDetailsModal"></div>

      <div class="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-hidden">
        <!-- Close Button -->
        <button 
          @click="closeDetailsModal"
          class="absolute top-4 left-4 z-10 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <!-- Modal Content -->
        <div class="h-full overflow-y-auto p-4 md:p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Column: Image & Basic Info -->
            <div class="space-y-6">
              <!-- Item Image -->
              <div class="relative h-64 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <img 
                  v-if="selectedItem?.photo_url"
                  :src="selectedItem.photo_url" 
                  :alt="selectedItem?.name"
                  class="w-full h-full object-cover"
                >
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>

                <!-- Status Badge -->
                <div class="absolute top-4 right-4">
                  <span :class="getStockStatusClass(selectedItem?.remaining_quantity || 0)" 
                    class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold">
                    {{ getStockStatus(selectedItem?.remaining_quantity || 0) }}
                  </span>
                </div>
              </div>

              <!-- Basic Information -->
              <div class="space-y-4">
                <div>
                  <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ selectedItem?.name }}</h2>
                  <div class="flex items-center gap-3 mt-2">
                    <span class="text-sm font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-lg">
                      {{ selectedItem?.code }}
                    </span>
                    <span v-if="selectedItem?.color" class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div class="w-4 h-4 rounded-full border border-gray-300" 
                        :style="{ backgroundColor: getColorHex(selectedItem?.color) }"></div>
                      {{ selectedItem?.color }}
                    </span>
                  </div>
                </div>

                <!-- Quick Stats -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">المخزن</p>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ getWarehouseLabel(selectedItem?.warehouse_id) }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">الكمية الحالية</p>
                    <p :class="getQuantityClass(selectedItem?.remaining_quantity || 0)" class="text-2xl font-bold">
                      {{ selectedItem?.remaining_quantity }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Detailed Information -->
            <div class="space-y-6">
              <!-- Details Grid -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">المورد</p>
                  <p class="text-gray-900 dark:text-white font-medium">{{ selectedItem?.supplier || 'غير محدد' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">مكان التخزين</p>
                  <p class="text-gray-900 dark:text-white font-medium">{{ selectedItem?.item_location || 'غير محدد' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">الكراتين</p>
                  <p class="text-gray-900 dark:text-white font-medium">{{ selectedItem?.cartons_count || 0 }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">في الكرتونة</p>
                  <p class="text-gray-900 dark:text-white font-medium">{{ selectedItem?.per_carton_count || 0 }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">الفردي</p>
                  <p class="text-gray-900 dark:text-white font-medium">{{ selectedItem?.single_bottles_count || 0 }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">المجموع المضاف</p>
                  <p class="text-gray-900 dark:text-white font-medium">{{ selectedItem?.total_added || 0 }}</p>
                </div>
              </div>

              <!-- Last Update Info -->
              <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">آخر تحديث</p>
                    <p class="text-gray-900 dark:text-white font-medium">{{ formatDate(selectedItem?.updated_at) }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">آخر إجراء بواسطة</p>
                    <p class="text-gray-900 dark:text-white font-medium">{{ getLastActionUser(selectedItem) }}</p>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div v-if="showActions" class="grid grid-cols-2 gap-3">
                <button 
                  v-if="canEditItem(selectedItem)"
                  @click="handleEdit(selectedItem)"
                  class="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-150"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  تعديل
                </button>

                <button 
                  v-if="canTransferItem(selectedItem)"
                  @click="handleTransfer(selectedItem)"
                  class="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-150"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                  </svg>
                  نقل
                </button>

                <button 
                  v-if="canDispatchItem(selectedItem)"
                  @click="handleDispatch(selectedItem)"
                  class="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-150"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  صرف
                </button>

                <button 
                  v-if="canDeleteItem(selectedItem)"
                  @click="handleDelete(selectedItem)"
                  class="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-150"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showDeleteConfirm = false"></div>

      <div class="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">تأكيد الحذف</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">سيتم حذف الصنف نهائياً</p>
            </div>
          </div>

          <div class="mb-6">
            <p class="text-gray-700 dark:text-gray-300 mb-3">
              هل أنت متأكد من حذف الصنف:
            </p>
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
              <div class="flex items-center gap-3 mb-2">
                <div v-if="itemToDelete?.photo_url" class="w-10 h-10 rounded overflow-hidden border border-gray-200 dark:border-gray-600">
                  <img :src="itemToDelete.photo_url" :alt="itemToDelete?.name" class="w-full h-full object-cover">
                </div>
                <div class="min-w-0 flex-1">
                  <p class="font-medium text-gray-900 dark:text-white truncate">{{ itemToDelete?.name }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ itemToDelete?.code }} - {{ itemToDelete?.color }}</p>
                </div>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>المخزن: {{ getWarehouseLabel(itemToDelete?.warehouse_id) }}</p>
                <p>الكمية المتبقية: {{ itemToDelete?.remaining_quantity }}</p>
                <p>آخر تحديث بواسطة: {{ getLastActionUser(itemToDelete) }}</p>
              </div>
            </div>
            <p class="text-sm text-red-600 dark:text-red-400 mt-3">
              ⚠️ هذا الإجراء لا يمكن التراجع عنه.
            </p>
          </div>

          <div class="flex gap-3">
            <button
              @click="confirmDelete"
              :disabled="deleteLoading"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="deleteLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <span>{{ deleteLoading ? 'جاري الحذف...' : 'نعم، احذف' }}</span>
            </button>
            <button
              @click="showDeleteConfirm = false"
              :disabled="deleteLoading"
              class="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2.5 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, reactive, onUnmounted, nextTick } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { debounce } from 'lodash';
import AddItemModal from '@/components/inventory/AddItemModal.vue';
import DispatchModal from '@/components/inventory/DispatchModal.vue';
import EditItemModal from '@/components/inventory/EditItemModal.vue';
import TransferModal from '@/components/inventory/TransferModal.vue';

// Local storage cache for offline/one-time data
const LOCAL_STORAGE_KEYS = {
  INVENTORY: 'inventory_cache',
  WAREHOUSES: 'warehouses_cache',
  LAST_REFRESH: 'last_refresh_timestamp',
  CACHE_VERSION: 'cache_version_1.0'
};

// Performance monitoring class
class PerformanceMonitor {
  constructor() {
    this.startTime = performance.now();
    this.memorySnapshots = [];
  }

  start() {
    this.startTime = performance.now();
  }

  end() {
    return performance.now() - this.startTime;
  }

  getMemoryUsage() {
    if (window.performance && window.performance.memory) {
      return Math.round(window.performance.memory.usedJSHeapSize / 1048576); // MB
    }
    return 0;
  }
}

// Click outside directive for dropdowns
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  }
};

export default {
  name: 'InventoryTable',
  components: {
    AddItemModal,
    DispatchModal,
    EditItemModal,
    TransferModal
  },
  directives: {
    'click-outside': vClickOutside
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const performanceMonitor = new PerformanceMonitor();
    
    // State
    const loading = ref(false);
    const loadingMore = ref(false);
    const loadingProgress = ref('');
    const error = ref('');
    const showAddModal = ref(false);
    const showEditModal = ref(false);
    const showTransferModal = ref(false);
    const showDispatchModal = ref(false);
    const showDetailsModal = ref(false);
    const showDeleteConfirm = ref(false);
    const searchTerm = ref('');
    const statusFilter = ref('');
    const selectedWarehouse = ref('');
    const selectedItemForEdit = ref(null);
    const selectedItemForTransfer = ref(null);
    const selectedItemForDispatch = ref(null);
    const selectedItem = ref(null);
    const itemToDelete = ref(null);
    const imageLoaded = reactive({});
    const exporting = ref(false);
    const deleteLoading = ref(false);
    const currentPage = ref(1);
    const itemsPerPage = ref(50); // Optimized for mobile performance
    const searchTimeout = ref(null);
    const showActionMenu = ref(null);
    const lastRefreshTime = ref(null);
    const isCachedData = ref(false);
    const performanceStats = ref(null);
    const userNamesCache = reactive({}); // Cache for user names
    
    // Color mapping
    const colorMap = {
      'أحمر': '#ef4444',
      'أزرق': '#3b82f6',
      'أخضر': '#10b981',
      'أصفر': '#f59e0b',
      'أسود': '#000000',
      'أبيض': '#ffffff',
      'رمادي': '#6b7280',
      'بني': '#92400e',
      'وردي': '#ec4899',
      'برتقالي': '#f97316',
      'بنفسجي': '#8b5cf6',
      'ذهبي': '#d97706',
      'فضي': '#9ca3af'
    };
    
    // Computed properties
    const userRole = computed(() => store.getters.userRole);
    const userProfile = computed(() => store.state.userProfile);
    const inventory = computed(() => store.state.inventory || []);
    const accessibleWarehouses = computed(() => store.getters.accessibleWarehouses || []);
    const allWarehouses = computed(() => store.state.warehouses || []);
    const transactions = computed(() => store.state.transactions || []);
    const currentUser = computed(() => store.state.user);
    const refreshing = computed(() => store.state.refreshing);
    const hasMore = computed(() => store.state.pagination.hasMore);
    
    // Current user info with caching
    const currentUserInfo = computed(() => {
      if (userProfile.value?.name) {
        return userProfile.value.name;
      }
      
      if (currentUser.value?.displayName) {
        return currentUser.value.displayName;
      }
      
      if (userProfile.value?.email) {
        return userProfile.value.email.split('@')[0];
      }
      
      if (currentUser.value?.email) {
        return currentUser.value.email.split('@')[0];
      }
      
      return 'مستخدم النظام';
    });
    
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
    
    const canDeleteItem = (item) => {
      return canEditItem(item);
    };
    
    // Load from local storage cache
    const loadFromCache = () => {
      try {
        const cachedInventory = localStorage.getItem(LOCAL_STORAGE_KEYS.INVENTORY);
        const cachedWarehouses = localStorage.getItem(LOCAL_STORAGE_KEYS.WAREHOUSES);
        const lastRefresh = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_REFRESH);
        
        if (cachedInventory) {
          const inventoryData = JSON.parse(cachedInventory);
          if (inventoryData.data && inventoryData.timestamp) {
            const cacheAge = Date.now() - inventoryData.timestamp;
            // Use cache if less than 1 hour old
            if (cacheAge < 60 * 60 * 1000) {
              store.commit('SET_INVENTORY', inventoryData.data);
              isCachedData.value = true;
              console.log('Loaded inventory from cache');
            }
          }
        }
        
        if (cachedWarehouses) {
          const warehousesData = JSON.parse(cachedWarehouses);
          if (warehousesData.data && warehousesData.timestamp) {
            store.commit('SET_WAREHOUSES', warehousesData.data);
            store.commit('SET_WAREHOUSES_LOADED', true);
          }
        }
        
        if (lastRefresh) {
          lastRefreshTime.value = parseInt(lastRefresh);
        }
      } catch (error) {
        console.warn('Error loading from cache:', error);
      }
    };
    
    // Save to local storage cache
    const saveToCache = (key, data) => {
      try {
        const cacheData = {
          data,
          timestamp: Date.now(),
          version: LOCAL_STORAGE_KEYS.CACHE_VERSION
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
      } catch (error) {
        console.warn('Error saving to cache:', error);
      }
    };
    
    // Filtered items with memoization
    const filteredItems = computed(() => {
      if (!inventory.value.length) return [];
      
      let filtered = inventory.value;
      
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
          (item.name || '').toLowerCase().includes(term) ||
          (item.code || '').toLowerCase().includes(term) ||
          (item.supplier || '').toLowerCase().includes(term) ||
          (item.color || '').toLowerCase().includes(term)
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
    
    const getColorHex = (colorName) => {
      return colorMap[colorName] || '#6b7280';
    };
    
    const formatDate = (date) => {
      if (!date) return '-';
      try {
        const dateObj = date.toDate ? date.toDate() : new Date(date);
        return dateObj.toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return '-';
      }
    };
    
    const formatRelativeTime = (date) => {
      if (!date) return '-';
      try {
        const dateObj = date.toDate ? date.toDate() : new Date(date);
        const now = new Date();
        const diffMs = now - dateObj;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'الآن';
        if (diffMins < 60) return `قبل ${diffMins} دقيقة`;
        if (diffHours < 24) return `قبل ${diffHours} ساعة`;
        if (diffDays === 1) return 'أمس';
        if (diffDays < 7) return `قبل ${diffDays} أيام`;
        
        return formatDate(date);
      } catch (e) {
        return '-';
      }
    };
    
    const formatTimeAgo = (timestamp) => {
      if (!timestamp) return '';
      const now = Date.now();
      const diffMs = now - timestamp;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      
      if (diffMins < 1) return 'الآن';
      if (diffMins < 60) return `قبل ${diffMins} دقيقة`;
      if (diffHours < 24) return `قبل ${diffHours} ساعة`;
      
      return new Date(timestamp).toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    // Get user name from cache or fetch it
    const getUserName = async (userId) => {
      if (!userId) return 'غير معروف';
      
      // Check cache first
      if (userNamesCache[userId]) {
        return userNamesCache[userId];
      }
      
      // If it's the current user, return cached info
      if (userId === currentUser.value?.uid) {
        userNamesCache[userId] = currentUserInfo.value;
        return currentUserInfo.value;
      }
      
      try {
        // Try to get from user profile
        const userProfile = await store.dispatch('getUserProfile', userId);
        if (userProfile?.name) {
          userNamesCache[userId] = userProfile.name;
          return userProfile.name;
        }
        
        // Try to get from Firebase Auth
        const { getAuth } = await import('firebase/auth');
        const auth = getAuth();
        const user = auth.currentUser;
        if (user?.uid === userId && user.displayName) {
          userNamesCache[userId] = user.displayName;
          return user.displayName;
        }
        
        // Fallback to email or "مستخدم النظام"
        const email = userProfile?.email || user?.email;
        if (email) {
          const name = email.split('@')[0];
          userNamesCache[userId] = name;
          return name;
        }
        
        return 'مستخدم النظام';
      } catch (error) {
        console.warn('Error fetching user name:', error);
        return 'مستخدم النظام';
      }
    };
    
    const getLastActionUser = (item) => {
      if (!item) return 'غير معروف';
      
      // Check for cached user name in item
      if (item.last_updated_by_name) {
        return item.last_updated_by_name;
      }
      
      // Try to get from item fields
      if (item.last_updated_by && typeof item.last_updated_by === 'string' && item.last_updated_by !== 'O5Rg9HxDH8Nk3LY9G5onMgc2vN12') {
        return item.last_updated_by;
      }
      
      if (item.updated_by && typeof item.updated_by === 'string' && item.updated_by !== 'O5Rg9HxDH8Nk3LY9G5onMgc2vN12') {
        return item.updated_by;
      }
      
      if (item.created_by && typeof item.created_by === 'string' && item.created_by !== 'O5Rg9HxDH8Nk3LY9G5onMgc2vN12') {
        return item.created_by;
      }
      
      // Check transactions
      const itemTransaction = transactions.value
        .filter(t => t.item_id === item.id)
        .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))[0];
      
      if (itemTransaction?.user_name && typeof itemTransaction.user_name === 'string' && itemTransaction.user_name !== 'O5Rg9HxDH8Nk3LY9G5onMgc2vN12') {
        return itemTransaction.user_name;
      }
      
      return currentUserInfo.value;
    };
    
    const handleImageError = (event) => {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMTZMNC42ODYgMTUuMzE0QzQuODgyIDExLjUwNyA4LjA5MyA5IDEyIDlDMTUuOTA3IDkgMTkuMTE4IDExLjUwNyAxOS4zMTQgMTUuMzE0TDIwIDE2TTggMjFIMTZNNSAxNEgxOU0xMiAxN0MxMiAxNy41NTIyOCAxMS41NTIzIDE4IDExIDE4QzEwLjQ0NzcgMTggMTAgMTcuNTUyMyAxMCAxN0MxMCAxNi40NDc3IDEwLjQ0NzcgMTYgMTEgMTZDMTEuNTUyMyAxNiAxMiAxNi40NDc3IDEyIDE3WiIgc3Ryb2tlPSI2QjcyOEQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
    };
    
    // Performance monitoring
    const measurePerformance = () => {
      const loadTime = (performanceMonitor.end() / 1000).toFixed(2);
      const memoryUsage = performanceMonitor.getMemoryUsage();
      
      performanceStats.value = {
        itemCount: inventory.value.length,
        loadTime,
        memoryUsage
      };
    };
    
    // Action Methods
    const handleFilterChange = () => {
      currentPage.value = 1;
      measurePerformance();
    };
    
    const handleSearchInput = debounce(() => {
      currentPage.value = 1;
    }, 300);
    
    const toggleActionMenu = (itemId) => {
      showActionMenu.value = showActionMenu.value === itemId ? null : itemId;
    };
    
    const showItemDetails = (item) => {
      selectedItem.value = item;
      showDetailsModal.value = true;
      showActionMenu.value = null;
    };
    
    const closeDetailsModal = () => {
      showDetailsModal.value = false;
      selectedItem.value = null;
    };
    
    const refreshData = async () => {
      try {
        performanceMonitor.start();
        await store.dispatch('refreshAllData');
        lastRefreshTime.value = Date.now();
        isCachedData.value = false;
        
        // Save to cache
        saveToCache(LOCAL_STORAGE_KEYS.INVENTORY, store.state.inventory);
        saveToCache(LOCAL_STORAGE_KEYS.WAREHOUSES, store.state.warehouses);
        localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_REFRESH, lastRefreshTime.value.toString());
        
        store.dispatch('showNotification', {
          type: 'success',
          message: 'تم تحديث البيانات بنجاح'
        });
        
        measurePerformance();
        
      } catch (err) {
        console.error('Error refreshing data:', err);
        error.value = 'حدث خطأ في تحديث البيانات';
        
        store.dispatch('showNotification', {
          type: 'error',
          message: 'فشل في تحديث البيانات'
        });
      }
    };
    
    const loadMoreInventory = async () => {
      try {
        loadingMore.value = true;
        loadingProgress.value = 'جاري تحميل المزيد من الأصناف...';
        
        await store.dispatch('loadMoreInventory');
        
        // Update cache with new data
        saveToCache(LOCAL_STORAGE_KEYS.INVENTORY, store.state.inventory);
        
        measurePerformance();
        
      } catch (err) {
        console.error('Error loading more inventory:', err);
        error.value = 'حدث خطأ في تحميل المزيد من الأصناف';
      } finally {
        loadingMore.value = false;
        loadingProgress.value = '';
      }
    };
    
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
          'الحالة',
          'آخر تحديث',
          'آخر تحديث بواسطة'
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
          getStockStatus(item.remaining_quantity),
          formatDate(item.updated_at),
          getLastActionUser(item)
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
        
        store.dispatch('showNotification', {
          type: 'error',
          message: 'فشل في تصدير الملف'
        });
      } finally {
        exporting.value = false;
      }
    };
    
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
      showDetailsModal.value = false;
      showActionMenu.value = null;
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
      showDetailsModal.value = false;
      showActionMenu.value = null;
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
      showDetailsModal.value = false;
      showActionMenu.value = null;
    };
    
    const handleDelete = (item) => {
      if (!canDeleteItem(item)) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية الحذف من هذا المخزن'
        });
        return;
      }
      itemToDelete.value = item;
      showDeleteConfirm.value = true;
      showActionMenu.value = null;
    };
    
    const confirmDelete = async () => {
      try {
        deleteLoading.value = true;
        
        const { db } = await import('@/firebase/config');
        const { doc, deleteDoc, collection, addDoc } = await import('firebase/firestore');
        
        const itemRef = doc(db, 'items', itemToDelete.value.id);
        
        // Create transaction record with user name
        const transactionData = {
          type: 'DELETE',
          item_id: itemToDelete.value.id,
          item_name: itemToDelete.value.name,
          item_code: itemToDelete.value.code,
          item_color: itemToDelete.value.color,
          from_warehouse: itemToDelete.value.warehouse_id,
          cartons_delta: 0,
          single_delta: 0,
          total_delta: -itemToDelete.value.remaining_quantity,
          user_id: currentUser.value?.uid,
          user_name: currentUserInfo.value, // Store the readable name
          user_email: currentUser.value?.email || userProfile.value?.email,
          user_role: userRole.value,
          timestamp: new Date(),
          notes: `تم حذف الصنف "${itemToDelete.value.name}" (${itemToDelete.value.code}) من المخزن ${getWarehouseLabel(itemToDelete.value.warehouse_id)}`
        };
        
        // Add transaction first
        await addDoc(collection(db, 'transactions'), transactionData);
        
        // Then delete the item
        await deleteDoc(itemRef);
        
        // Update local store with optimistic update
        store.commit('REMOVE_ITEM', itemToDelete.value.id);
        
        // Update cache
        saveToCache(LOCAL_STORAGE_KEYS.INVENTORY, store.state.inventory);
        
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم حذف الصنف "${itemToDelete.value.name}" بنجاح`
        });
        
        showDeleteConfirm.value = false;
        itemToDelete.value = null;
        
      } catch (err) {
        console.error('Error deleting item:', err);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'فشل في حذف الصنف: ' + err.message
        });
      } finally {
        deleteLoading.value = false;
      }
    };
    
    const handleItemSaved = async (newItem) => {
      showAddModal.value = false;
      
      // Add with user info
      const itemWithUser = {
        ...newItem,
        last_updated_by: currentUserInfo.value,
        last_updated_by_name: currentUserInfo.value,
        updated_by: currentUserInfo.value,
        updated_at: new Date()
      };
      
      store.commit('ADD_ITEM', itemWithUser);
      
      // Update cache
      saveToCache(LOCAL_STORAGE_KEYS.INVENTORY, store.state.inventory);
      
      store.dispatch('showNotification', {
        type: 'success',
        message: `تم إضافة "${newItem.name}" بنجاح`
      });
    };
    
    const handleItemUpdated = async (updatedItem) => {
      showEditModal.value = false;
      selectedItemForEdit.value = null;
      
      // Update with user info
      const itemWithUser = {
        ...updatedItem,
        last_updated_by: currentUserInfo.value,
        last_updated_by_name: currentUserInfo.value,
        updated_by: currentUserInfo.value,
        updated_at: new Date()
      };
      
      store.commit('UPDATE_ITEM', itemWithUser);
      
      // Update cache
      saveToCache(LOCAL_STORAGE_KEYS.INVENTORY, store.state.inventory);
      
      store.dispatch('showNotification', {
        type: 'success',
        message: 'تم تحديث الصنف بنجاح'
      });
    };
    
    const handleTransferSuccess = async (result) => {
      showTransferModal.value = false;
      selectedItemForTransfer.value = null;
      
      // Update with user info
      if (result.sourceItem) {
        const sourceItemWithUser = {
          ...result.sourceItem,
          last_updated_by: currentUserInfo.value,
          last_updated_by_name: currentUserInfo.value,
          updated_by: currentUserInfo.value,
          updated_at: new Date()
        };
        store.commit('UPDATE_ITEM', sourceItemWithUser);
      }
      
      if (result.targetItem) {
        const targetItemWithUser = {
          ...result.targetItem,
          last_updated_by: currentUserInfo.value,
          last_updated_by_name: currentUserInfo.value,
          updated_by: currentUserInfo.value,
          updated_at: new Date()
        };
        store.commit('UPDATE_ITEM', targetItemWithUser);
      }
      
      // Update cache
      saveToCache(LOCAL_STORAGE_KEYS.INVENTORY, store.state.inventory);
      
      store.dispatch('showNotification', {
        type: 'success',
        message: 'تم النقل بنجاح'
      });
    };
    
    const handleDispatchSuccess = async (updatedItem) => {
      showDispatchModal.value = false;
      selectedItemForDispatch.value = null;
      
      // Update with user info
      const itemWithUser = {
        ...updatedItem,
        last_updated_by: currentUserInfo.value,
        last_updated_by_name: currentUserInfo.value,
        updated_by: currentUserInfo.value,
        updated_at: new Date()
      };
      
      store.commit('UPDATE_ITEM', itemWithUser);
      
      // Update cache
      saveToCache(LOCAL_STORAGE_KEYS.INVENTORY, store.state.inventory);
      
      store.dispatch('showNotification', {
        type: 'success',
        message: 'تم الصرف بنجاح'
      });
    };
    
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
    
    // Optimistic updates for better performance
    const optimisticUpdate = (itemId, updates) => {
      const itemIndex = store.state.inventory.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        const updatedItem = {
          ...store.state.inventory[itemIndex],
          ...updates,
          last_updated_by: currentUserInfo.value,
          last_updated_by_name: currentUserInfo.value,
          updated_at: new Date()
        };
        
        store.commit('UPDATE_ITEM', updatedItem);
        return updatedItem;
      }
      return null;
    };
    
    // Cleanup images from memory when component unmounts
    const cleanupImages = () => {
      Object.keys(imageLoaded).forEach(key => {
        delete imageLoaded[key];
      });
    };
    
    // Lifecycle
    onMounted(async () => {
      performanceMonitor.start();
      
      // Load from cache first
      loadFromCache();
      
      if (accessibleWarehouses.value.length === 1) {
        selectedWarehouse.value = accessibleWarehouses.value[0].id;
      }
      
      if (route.name === 'AddInventory') {
        showAddModal.value = true;
      }
      
      // Load fresh data if cache is old or doesn't exist
      if (!isCachedData.value || !store.state.inventory.length) {
        try {
          loading.value = true;
          loadingProgress.value = 'جاري تحميل البيانات...';
          
          await store.dispatch('loadAllInitialData');
          
          // Save to cache
          saveToCache(LOCAL_STORAGE_KEYS.INVENTORY, store.state.inventory);
          saveToCache(LOCAL_STORAGE_KEYS.WAREHOUSES, store.state.warehouses);
          localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_REFRESH, Date.now().toString());
          
          lastRefreshTime.value = Date.now();
          isCachedData.value = false;
          
        } catch (err) {
          console.error('Error loading data:', err);
          error.value = 'حدث خطأ في تحميل البيانات';
        } finally {
          loading.value = false;
          loadingProgress.value = '';
        }
      }
      
      measurePerformance();
      
      // Close dropdown when clicking outside
      const handleClickOutside = (event) => {
        if (showActionMenu.value && !event.target.closest('.relative')) {
          showActionMenu.value = null;
        }
      };
      
      document.addEventListener('click', handleClickOutside);
      
      onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside);
        if (searchTimeout.value) {
          clearTimeout(searchTimeout.value);
        }
        cleanupImages();
      });
    });
    
    watch(() => [searchTerm.value, statusFilter.value, selectedWarehouse.value], () => {
      currentPage.value = 1;
    });
    
    // Preload images for visible items only
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
      loadingMore,
      loadingProgress,
      error,
      showAddModal,
      showEditModal,
      showTransferModal,
      showDispatchModal,
      showDetailsModal,
      showDeleteConfirm,
      searchTerm,
      statusFilter,
      selectedWarehouse,
      selectedItemForEdit,
      selectedItemForTransfer,
      selectedItemForDispatch,
      selectedItem,
      itemToDelete,
      imageLoaded,
      exporting,
      deleteLoading,
      currentPage,
      showActionMenu,
      lastRefreshTime,
      isCachedData,
      performanceStats,
      
      // Computed
      userRole,
      userProfile,
      inventory,
      accessibleWarehouses,
      allWarehouses,
      canAddItem,
      canExport,
      showActions,
      filteredItems,
      paginatedItems,
      totalPages,
      startIndex,
      endIndex,
      visiblePages,
      currentUserInfo,
      refreshing,
      hasMore,
      
      // Helper Methods
      getWarehouseLabel,
      getStockStatus,
      getStockStatusClass,
      getQuantityClass,
      getColorHex,
      formatDate,
      formatRelativeTime,
      formatTimeAgo,
      getLastActionUser,
      handleImageError,
      
      // Permission Methods
      canEditItem,
      canTransferItem,
      canDispatchItem,
      canDeleteItem,
      
      // Action Methods
      handleFilterChange,
      handleSearchInput,
      toggleActionMenu,
      showItemDetails,
      closeDetailsModal,
      refreshData,
      loadMoreInventory,
      exportInventory,
      handleTransfer,
      handleDispatch,
      handleEdit,
      handleDelete,
      confirmDelete,
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
/* Performance optimized styles */
table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}

/* Static header styling */
thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f9fafb;
}

.dark thead {
  background-color: #374151;
}

/* Reduced animations */
.transition-colors {
  transition-property: background-color, border-color, color;
  transition-duration: 150ms;
}

/* Optimized hover states */
.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.dark .hover\:bg-gray-700\/50:hover {
  background-color: rgba(55, 65, 81, 0.5);
}

/* Scrollbar optimization */
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

/* Image optimization */
img {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

/* Mobile touch targets */
@media (max-width: 768px) {
  button {
    min-height: 44px;
  }
  
  /* Optimize modal for mobile */
  .max-h-\[90vh\] {
    max-height: 85vh;
  }
  
  /* Ensure buttons are properly spaced */
  .grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  
  /* Make sure text doesn't overflow */
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .transition-colors,
  .animate-spin {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}

/* Table cell alignment fix */
.whitespace-nowrap {
  white-space: nowrap;
}

/* Ensure text doesn't overflow in table cells */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Modal z-index fix */
.fixed {
  isolation: isolate;
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

/* Optimize for mobile */
@media (max-width: 640px) {
  .text-xs {
    font-size: 11px;
  }
  
  .min-w-\[1300px\] {
    min-width: auto;
  }
  
  /* Better button sizing for mobile */
  .py-2\.5 {
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
  }
  
  /* Hide text on very small screens, show only icons */
  @media (max-width: 400px) {
    .hidden.xs\:inline {
      display: none;
    }
    
    .grid-cols-4 button {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }
  }
}

/* Dark mode optimizations */
.dark .border-gray-200 {
  border-color: #374151;
}

.dark .bg-gray-50 {
  background-color: #111827;
}

/* Clickable cursor */
.cursor-pointer {
  cursor: pointer;
}

/* Smooth transitions */
.group-hover\/view\:scale-110:hover {
  transform: scale(1.1);
  transition: transform 150ms ease;
}

/* Virtual scrolling for large datasets */
.virtual-scroll-container {
  will-change: transform;
}

/* Optimize paint and composite layers */
.optimize-paint {
  will-change: transform, opacity;
}

/* Memory optimization for images */
img[loading="lazy"] {
  content-visibility: auto;
}

/* Optimize for low-end devices */
@media (max-width: 768px) and (max-device-width: 1024px) {
  * {
    -webkit-tap-highlight-color: transparent;
  }
  
  /* Reduce animations on mobile */
  .transition-colors {
    transition-duration: 100ms;
  }
  
  /* Add active state for mobile buttons */
  .active\:scale-95:active {
    transform: scale(0.95);
  }
}

/* Fix modal scrolling on mobile */
@media (max-width: 768px) {
  .overflow-y-auto {
    -webkit-overflow-scrolling: touch;
  }
  
  /* Prevent body scroll when modal is open */
  body.modal-open {
    overflow: hidden;
  }
}

/* Better touch feedback */
button:active {
  opacity: 0.8;
}

/* Ensure proper spacing in mobile cards */
.space-y-1 > * + * {
  margin-top: 0.25rem;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

/* Fix for iOS Safari input zoom */
@media screen and (max-width: 768px) {
  input, select, textarea {
    font-size: 16px;
  }
}
</style>
