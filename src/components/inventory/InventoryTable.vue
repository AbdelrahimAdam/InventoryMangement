<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <main class="pt-4 lg:pt-6">
      <!-- Action Bar - Minimal and Compact -->
      <div class="container mx-auto px-3 lg:px-4 mb-4 lg:mb-6">
        <div class="flex flex-col lg:flex-row gap-3">
          <!-- Left Side: Filters -->
          <div class="flex-1 flex flex-col sm:flex-row gap-3">
            <!-- Warehouse Filter -->
            <div class="relative flex-1">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <select 
                v-model="selectedWarehouse" 
                @change="updateWarehouseFilter"
                class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="">جميع المخازن</option>
                <option v-for="warehouse in accessibleWarehouses" :key="warehouse.id" :value="warehouse.id">
                  {{ warehouse.name_ar }}
                </option>
              </select>
            </div>

            <!-- Status Filter -->
            <div class="relative flex-1 sm:flex-none sm:w-48">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <select 
                v-model="statusFilter"
                @change="updateStatusFilter"
                class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="">جميع الحالات</option>
                <option value="in_stock">متوفر</option>
                <option value="low_stock">كمية قليلة</option>
                <option value="out_of_stock">غير متوفر</option>
              </select>
            </div>
          </div>

          <!-- Right Side: Actions -->
          <div class="flex gap-3">
            <!-- Search -->
            <div class="relative flex-1 lg:flex-none lg:w-64">
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <input
                type="text"
                v-model="searchTerm"
                @input="handleSearch"
                placeholder="ابحث..."
                class="w-full pr-10 pl-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 transition-all duration-200"
              >
            </div>

            <!-- Export Button -->
            <button 
              v-if="canExport"
              @click="generateReport"
              :disabled="exporting"
              class="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              title="تصدير إلى Excel"
            >
              <svg v-if="exporting" class="w-4 h-4 ml-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <svg v-else class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span class="hidden lg:inline">{{ exporting ? 'جاري التصدير...' : 'تصدير Excel' }}</span>
            </button>

            <!-- Add Item Button -->
            <button 
              v-if="canAddItem"
              @click="showAddModal = true"
              class="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
              title="إضافة صنف جديد"
            >
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span class="hidden lg:inline">إضافة صنف</span>
            </button>

            <!-- Refresh Button -->
            <button 
              @click="refreshData"
              :disabled="loading"
              class="p-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 active:scale-95"
              title="تحديث البيانات"
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
          </div>
        </div>
      </div>

      <!-- Modern Data Table Container -->
      <div class="container mx-auto px-3 lg:px-4">
        <!-- Desktop Table View (hidden on mobile) -->
        <div class="hidden lg:block bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          <!-- Table Header - Sticky -->
          <div class="sticky top-0 z-20 bg-yellow-300 dark:bg-yellow-900/50 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
            <div class="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <div class="col-span-3">الصنف</div>
              <div class="col-span-1 text-center">الكود</div>
              <div class="col-span-1 text-center">اللون</div>
              <div class="col-span-2 text-center">المخزن / المورد</div>
              <div class="col-span-2 text-center">التفاصيل</div>
              <div class="col-span-1 text-center">الكمية</div>
              <div class="col-span-1 text-center">الحالة</div>
              <div class="col-span-1 text-center">الإجراءات</div>
            </div>
          </div>

          <!-- Table Body -->
          <div class="table-body max-h-[calc(100vh-200px)] min-h-[500px] overflow-y-auto bg-yellow-50 dark:bg-yellow-900/10">
            <!-- Loading State -->
            <div v-if="loading && filteredItems.length === 0" class="flex items-center justify-center p-12">
              <div class="text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                <p class="text-gray-600 dark:text-gray-400 font-medium">جاري تحميل البيانات...</p>
                <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">جاري تحميل الصفحة {{ currentPage }} من {{ totalPages }}</p>
              </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="flex items-center justify-center p-12">
              <div class="text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                  <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">حدث خطأ</h3>
                <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto">{{ error }}</p>
                <button 
                  @click="refreshData"
                  class="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  المحاولة مرة أخرى
                </button>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="filteredItems.length === 0 && !loading" class="flex items-center justify-center p-12">
              <div class="text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">لا توجد بيانات</h3>
                <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                  {{ searchTerm ? 'لم يتم العثور على أصناف مطابقة للبحث' : 'لم يتم إضافة أي أصناف بعد.' }}
                </p>
                <button 
                  v-if="canAddItem" 
                  @click="showAddModal = true" 
                  class="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  إضافة أول صنف
                </button>
              </div>
            </div>

            <!-- Items List - Desktop Table Rows -->
            <div v-else>
              <!-- Infinite Scroll Loader -->
              <div v-if="loadingMore" class="flex items-center justify-center p-4">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400"></div>
                <span class="mr-2 text-sm text-gray-600 dark:text-gray-400">جاري تحميل المزيد...</span>
              </div>

              <div 
                v-for="item in filteredItems"
                :key="item.id"
                class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100/50 dark:border-gray-700/30 hover:bg-yellow-100/50 dark:hover:bg-yellow-900/20 transition-all duration-200 group even:bg-gray-100/30 dark:even:bg-gray-700/10"
                :class="{ 'bg-blue-50/30 dark:bg-blue-900/10': selectedItemId === item.id }"
              >
                <!-- Item with Photo and Name -->
                <div class="col-span-3 flex items-center gap-4">
                  <!-- Photo Container -->
                  <div class="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-700 flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                    <img 
                      v-if="item.photo_url"
                      :src="item.photo_url" 
                      :alt="item.name"
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                      loading="lazy"
                      @load="() => handleImageLoad(item.id)"
                      v-lazy-image
                    >
                    <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-600/20">
                      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div v-if="!imageLoaded[item.id]" class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                      <div class="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                  </div>
                  
                  <!-- Item Info -->
                  <div class="min-w-0 flex-1">
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {{ item.name }}
                    </h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <span class="truncate">{{ item.item_location || 'بدون مكان' }}</span>
                    </p>
                    <div class="flex items-center gap-2 mt-1.5 text-xs text-gray-500 dark:text-gray-500">
                      <span class="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                        {{ item.cartons_count }} × {{ item.per_carton_count }}
                      </span>
                      <span class="text-gray-400">•</span>
                      <span>فردي: {{ item.single_bottles_count }}</span>
                    </div>
                  </div>
                </div>

                <!-- Item Code -->
                <div class="col-span-1 flex items-center justify-center">
                  <span class="text-sm font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg">
                    {{ item.code }}
                  </span>
                </div>

                <!-- Color -->
                <div class="col-span-1 flex items-center justify-center">
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ item.color || '-' }}</span>
                    <div v-if="item.color" class="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600" 
                         :style="{ backgroundColor: getColorHex(item.color) }"></div>
                  </div>
                </div>

                <!-- Warehouse / Supplier -->
                <div class="col-span-2">
                  <div class="text-center space-y-1.5">
                    <div class="text-sm text-gray-700 dark:text-gray-300 truncate" :title="getWarehouseLabel(item.warehouse_id)">
                      {{ getWarehouseLabel(item.warehouse_id) }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 truncate px-2" :title="item.supplier">
                      {{ item.supplier || 'بدون مورد' }}
                    </div>
                  </div>
                </div>

                <!-- Details -->
                <div class="col-span-2">
                  <div class="text-center space-y-1">
                    <div class="flex items-center justify-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span>المضاف: {{ item.total_added }}</span>
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-500">
                      آخر تحديث: {{ formatRelativeTime(item.updated_at) }}
                    </div>
                  </div>
                </div>

                <!-- Quantity -->
                <div class="col-span-1 flex items-center justify-center">
                  <div class="text-center">
                    <div :class="getQuantityClass(item.remaining_quantity)" class="text-lg font-bold">
                      {{ item.remaining_quantity }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                      من {{ item.total_added }}
                    </div>
                  </div>
                </div>

                <!-- Status -->
                <div class="col-span-1 flex items-center justify-center">
                  <span :class="getStockStatusClass(item.remaining_quantity)" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium">
                    {{ getStockStatus(item.remaining_quantity) }}
                  </span>
                </div>

                <!-- Actions -->
                <div class="col-span-1 flex items-center justify-center gap-1">
                  <!-- View Details Button -->
                  <button 
                    @click="showItemDetails(item)"
                    class="p-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group/btn"
                    title="عرض التفاصيل"
                  >
                    <svg class="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>

                  <!-- Quick Actions Menu -->
                  <div class="relative">
                    <button 
                      @click="toggleActionMenu(item.id)"
                      class="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      title="المزيد من الإجراءات"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                      </svg>
                    </button>

                    <!-- Action Dropdown Menu -->
                    <div v-if="showActionMenu === item.id && !readonly" 
                         class="absolute left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-30 animate-fade-in">
                      <button 
                        v-if="canTransferItem(item)"
                        @click="handleTransfer(item)"
                        class="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                      >
                        <svg class="w-4 h-4 ml-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                        </svg>
                        نقل بين المخازن
                      </button>
                      
                      <button 
                        v-if="canDispatchItem(item)"
                        @click="handleDispatch(item)"
                        class="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200"
                      >
                        <svg class="w-4 h-4 ml-2 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                        صرف إلى خارجي
                      </button>
                      
                      <button 
                        v-if="canEditItem(item)"
                        @click="handleEdit(item)"
                        class="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors duration-200"
                      >
                        <svg class="w-4 h-4 ml-2 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        تعديل الصنف
                      </button>
                      
                      <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                      
                      <button 
                        v-if="canDeleteItem(item)"
                        @click="handleDelete(item)"
                        class="w-full flex items-center px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                      >
                        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                        حذف الصنف
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pagination Footer -->
              <div v-if="totalPages > 1" class="sticky bottom-0 z-10 bg-yellow-300/95 dark:bg-yellow-900/70 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50">
                <div class="px-6 py-3 flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <button 
                      @click="prevPage" 
                      :disabled="currentPage === 1 || loading"
                      class="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      السابق
                    </button>
                    
                    <div class="flex items-center gap-2">
                      <span class="text-sm text-gray-600 dark:text-gray-400">الصفحة</span>
                      <input 
                        v-model="pageInput"
                        @keyup.enter="goToPage"
                        @blur="goToPage"
                        type="number"
                        min="1"
                        :max="totalPages"
                        class="w-16 px-2 py-1 text-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
                      >
                      <span class="text-sm text-gray-600 dark:text-gray-400">من {{ totalPages }}</span>
                    </div>
                    
                    <button 
                      @click="nextPage" 
                      :disabled="currentPage === totalPages || loadingMore"
                      class="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      التالي
                    </button>
                  </div>
                  
                  <div class="flex items-center gap-4">
                    <select 
                      v-model="pageSize" 
                      @change="changePageSize"
                      class="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
                    >
                      <option value="20">20 لكل صفحة</option>
                      <option value="50">50 لكل صفحة</option>
                      <option value="100">100 لكل صفحة</option>
                      <option value="200">200 لكل صفحة</option>
                    </select>
                    
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      إظهار <span class="font-semibold text-gray-900 dark:text-white">{{ showingFrom }}-{{ showingTo }}</span> 
                      من <span class="font-semibold text-gray-900 dark:text-white">{{ totalItems }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Table Footer -->
          <div v-if="!loading && filteredItems.length > 0" class="sticky bottom-0 z-10 bg-yellow-300/95 dark:bg-yellow-900/70 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50">
            <div class="px-6 py-3 flex items-center justify-between">
              <div class="text-sm text-gray-600 dark:text-gray-400">
                <div v-if="fromCache" class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>تم التحميل من التخزين المحلي</span>
                </div>
                <div v-else class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  <span>تم التحميل من السحابة</span>
                </div>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-500">
                آخر تحديث: {{ lastUpdateTime }}
                <span v-if="cacheAge" class="mr-2">(عمر التخزين: {{ formatCacheAge(cacheAge) }})</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Cards View (shown on mobile) -->
        <div class="lg:hidden">
          <!-- Mobile Loading State -->
          <div v-if="loading && filteredItems.length === 0" class="flex items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
            <div class="text-center">
              <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
              <p class="text-gray-600 dark:text-gray-400 font-medium">جاري تحميل البيانات...</p>
              <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">يرجى الانتظار</p>
            </div>
          </div>

          <!-- Mobile Error State -->
          <div v-else-if="error" class="flex items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
            <div class="text-center">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">حدث خطأ</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
              <button 
                @click="refreshData"
                class="w-full px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
              >
                المحاولة مرة أخرى
              </button>
            </div>
          </div>

          <!-- Mobile Empty State -->
          <div v-else-if="filteredItems.length === 0 && !loading" class="flex items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
            <div class="text-center">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">لا توجد بيانات</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">
                {{ searchTerm ? 'لم يتم العثور على أصناف مطابقة للبحث' : 'لم يتم إضافة أي أصناف بعد.' }}
              </p>
              <button 
                v-if="canAddItem" 
                @click="showAddModal = true" 
                class="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                إضافة أول صنف
              </button>
            </div>
          </div>

          <!-- Mobile Cards Grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Infinite Scroll Trigger -->
            <div v-if="loadingMore" class="col-span-full flex items-center justify-center p-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
              <span class="mr-2 text-sm text-gray-600 dark:text-gray-400">جاري تحميل المزيد...</span>
            </div>

            <div 
              v-for="(item, index) in filteredItems"
              :key="item.id"
              class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300"
              :class="index % 2 === 0 ? 'bg-yellow-50 dark:bg-yellow-900/10' : 'bg-gray-100 dark:bg-gray-700/10'"
            >
              <!-- Card Header -->
              <div class="p-4 border-b border-gray-200/50 dark:border-gray-700/30 bg-yellow-200 dark:bg-yellow-900/30">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <!-- Item Image -->
                    <div class="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 flex-shrink-0">
                      <img 
                        v-if="item.photo_url"
                        :src="item.photo_url" 
                        :alt="item.name"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                        loading="lazy"
                        v-lazy-image
                      >
                      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-600/20">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </div>
                    </div>
                    
                    <!-- Item Name and Code -->
                    <div>
                      <h3 class="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[150px]">
                        {{ item.name }}
                      </h3>
                      <div class="flex items-center gap-2 mt-1">
                        <span class="text-xs font-mono bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                          {{ item.code }}
                        </span>
                        <span :class="getStockStatusClass(item.remaining_quantity)" 
                              class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium">
                          {{ getStockStatus(item.remaining_quantity) }}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Quick Actions -->
                  <div class="flex items-center gap-1">
                    <button 
                      @click="showItemDetails(item)"
                      class="p-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                      title="عرض التفاصيل"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Card Body -->
              <div class="p-4">
                <!-- Basic Info Row -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="space-y-1">
                    <p class="text-xs text-gray-500 dark:text-gray-400">اللون</p>
                    <div class="flex items-center gap-2">
                      <span class="text-sm text-gray-700 dark:text-gray-300">{{ item.color || '-' }}</span>
                      <div v-if="item.color" class="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600" 
                           :style="{ backgroundColor: getColorHex(item.color) }"></div>
                    </div>
                  </div>
                  
                  <div class="space-y-1">
                    <p class="text-xs text-gray-500 dark:text-gray-400">الكمية</p>
                    <div :class="getQuantityClass(item.remaining_quantity)" class="text-lg font-bold">
                      {{ item.remaining_quantity }}
                    </div>
                  </div>
                </div>

                <!-- Warehouse Info -->
                <div class="mb-4">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">المخزن</p>
                  <p class="text-sm text-gray-700 dark:text-gray-300 truncate bg-gray-100 dark:bg-gray-700/50 px-3 py-2 rounded-lg">
                    {{ getWarehouseLabel(item.warehouse_id) }}
                  </p>
                </div>

                <!-- Supplier and Location -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="space-y-1">
                    <p class="text-xs text-gray-500 dark:text-gray-400">المورد</p>
                    <p class="text-sm text-gray-700 dark:text-gray-300 truncate">
                      {{ item.supplier || 'بدون مورد' }}
                    </p>
                  </div>
                  
                  <div class="space-y-1">
                    <p class="text-xs text-gray-500 dark:text-gray-400">المكان</p>
                    <p class="text-sm text-gray-700 dark:text-gray-300 truncate">
                      {{ item.item_location || 'بدون مكان' }}
                    </p>
                  </div>
                </div>

                <!-- Quantity Details -->
                <div class="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3 mb-4">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">تفاصيل الكمية</p>
                  <div class="grid grid-cols-3 gap-2">
                    <div class="text-center">
                      <p class="text-xs text-gray-500 dark:text-gray-400">الكراتين</p>
                      <p class="text-sm font-bold text-gray-900 dark:text-white">
                        {{ item.cartons_count }}
                      </p>
                    </div>
                    <div class="text-center">
                      <p class="text-xs text-gray-500 dark:text-gray-400">×</p>
                      <p class="text-sm font-bold text-gray-900 dark:text-white">
                        {{ item.per_carton_count }}
                      </p>
                    </div>
                    <div class="text-center">
                      <p class="text-xs text-gray-500 dark:text-gray-400">الفردي</p>
                      <p class="text-sm font-bold text-gray-900 dark:text-white">
                        {{ item.single_bottles_count }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Last Update -->
                <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                  <div class="flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>آخر تحديث: {{ formatRelativeTime(item.updated_at) }}</span>
                  </div>
                  <div class="text-xs">
                    <span class="font-semibold">المضاف:</span> {{ item.total_added }}
                  </div>
                </div>
              </div>

              <!-- Card Footer - Action Buttons -->
              <div v-if="!readonly" class="p-3 border-t border-gray-200/50 dark:border-gray-700/30 bg-gray-50 dark:bg-gray-700/20">
                <div class="flex items-center justify-between gap-2">
                  <button 
                    v-if="canTransferItem(item)"
                    @click="handleTransfer(item)"
                    class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                    </svg>
                    نقل
                  </button>
                  
                  <button 
                    v-if="canDispatchItem(item)"
                    @click="handleDispatch(item)"
                    class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-xs font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    صرف
                  </button>
                  
                  <button 
                    v-if="canEditItem(item)"
                    @click="handleEdit(item)"
                    class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white text-xs font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    تعديل
                  </button>
                </div>
              </div>
            </div>

            <!-- Mobile Pagination -->
            <div v-if="totalPages > 1" class="col-span-full mt-4">
              <div class="bg-yellow-300 dark:bg-yellow-900/50 rounded-2xl shadow-lg p-4">
                <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div class="flex items-center gap-2">
                    <button 
                      @click="prevPage" 
                      :disabled="currentPage === 1 || loading"
                      class="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      السابق
                    </button>
                    
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      الصفحة {{ currentPage }} من {{ totalPages }}
                    </div>
                    
                    <button 
                      @click="nextPage" 
                      :disabled="currentPage === totalPages || loadingMore"
                      class="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      التالي
                    </button>
                  </div>
                  
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    إظهار {{ showingFrom }}-{{ showingTo }} من {{ totalItems }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Footer -->
          <div v-if="filteredItems.length > 0" class="mt-4 p-4 bg-yellow-300 dark:bg-yellow-900/50 rounded-2xl shadow-lg">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700 dark:text-gray-300">
                <div v-if="fromCache" class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>تم التحميل من التخزين المحلي</span>
                </div>
                <div v-else class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  <span>تم التحميل من السحابة</span>
                </div>
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-400">
                {{ lastUpdateTime }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Awesome Item Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <div class="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
        <!-- Close Button -->
        <button 
          @click="closeDetailsModal"
          class="absolute top-4 left-4 z-10 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 shadow-lg"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <!-- Modal Content -->
        <div class="h-full overflow-y-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 h-full">
            <!-- Left Column: Image & Basic Info -->
            <div class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-8 lg:p-12">
              <!-- Item Image -->
              <div class="relative h-64 lg:h-80 rounded-2xl overflow-hidden shadow-2xl mb-8">
                <img 
                  v-if="selectedItem?.photo_url"
                  :src="selectedItem.photo_url" 
                  :alt="selectedItem?.name"
                  class="w-full h-full object-cover"
                  @load="detailImageLoaded = true"
                  v-lazy-image
                >
                <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-600/20">
                  <svg class="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div v-if="!detailImageLoaded" class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <div class="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
                
                <!-- Item Status Badge -->
                <div class="absolute top-4 right-4">
                  <span :class="getStockStatusClass(selectedItem?.remaining_quantity || 0)" 
                        class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {{ getStockStatus(selectedItem?.remaining_quantity || 0) }}
                  </span>
                </div>
              </div>

              <!-- Basic Information -->
              <div class="space-y-6">
                <div>
                  <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {{ selectedItem?.name }}
                  </h1>
                  <div class="flex items-center gap-3">
                    <span class="text-lg font-mono bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-lg">
                      {{ selectedItem?.code }}
                    </span>
                    <span v-if="selectedItem?.color" class="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <div class="w-4 h-4 rounded-full border border-gray-300" 
                           :style="{ backgroundColor: getColorHex(selectedItem?.color) }"></div>
                      {{ selectedItem?.color }}
                    </span>
                  </div>
                </div>

                <!-- Quick Stats -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm rounded-xl p-4">
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">المخزن</p>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ getWarehouseLabel(selectedItem?.warehouse_id) }}</p>
                  </div>
                  <div class="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm rounded-xl p-4">
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">الكمية الحالية</p>
                    <p :class="getQuantityClass(selectedItem?.remaining_quantity || 0)" class="text-2xl font-bold">
                      {{ selectedItem?.remaining_quantity }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Detailed Information -->
            <div class="p-8 lg:p-12 overflow-y-auto">
              <!-- Tabs -->
              <div class="flex border-b border-gray-200 dark:border-gray-700 mb-8">
                <button 
                  v-for="tab in tabs" 
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                    'px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2',
                    activeTab === tab.id 
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  ]"
                >
                  {{ tab.label }}
                </button>
              </div>

              <!-- Tab Content -->
              <div class="space-y-8">
                <!-- Details Tab -->
                <div v-if="activeTab === 'details'" class="space-y-6">
                  <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-1">
                      <p class="text-sm text-gray-500 dark:text-gray-400">المورد</p>
                      <p class="text-gray-900 dark:text-white font-medium">{{ selectedItem?.supplier || 'غير محدد' }}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm text-gray-500 dark:text-gray-400">مكان التخزين</p>
                      <p class="text-gray-900 dark:text-white font-medium">{{ selectedItem?.item_location || 'غير محدد' }}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm text-gray-500 dark:text-gray-400">الكراتين</p>
                      <div class="flex items-center gap-2">
                        <span class="text-gray-900 dark:text-white font-medium">{{ selectedItem?.cartons_count || 0 }}</span>
                        <span class="text-gray-500 dark:text-gray-500">×</span>
                        <span class="text-gray-900 dark:text-white font-medium">{{ selectedItem?.per_carton_count || 0 }}</span>
                        <span class="text-gray-500 dark:text-gray-500">=</span>
                        <span class="text-gray-900 dark:text-white font-bold">{{ (selectedItem?.cartons_count || 0) * (selectedItem?.per_carton_count || 0) }}</span>
                      </div>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm text-gray-500 dark:text-gray-400">الفردي</p>
                      <p class="text-gray-900 dark:text-white font-medium">{{ selectedItem?.single_bottles_count || 0 }}</p>
                    </div>
                  </div>

                  <!-- Progress Bars -->
                  <div class="space-y-4">
                    <div>
                      <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-600 dark:text-gray-400">معدل الاستخدام</span>
                        <span class="text-gray-900 dark:text-white font-medium">
                          {{ selectedItem?.total_added && selectedItem?.remaining_quantity 
                            ? Math.round((1 - (selectedItem.remaining_quantity / selectedItem.total_added)) * 100) 
                            : 0 }}%
                        </span>
                      </div>
                      <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-blue-500 to-purple-600" 
                             :style="{ width: selectedItem?.total_added && selectedItem?.remaining_quantity 
                               ? Math.round((1 - (selectedItem.remaining_quantity / selectedItem.total_added)) * 100) + '%' 
                               : '0%' }"></div>
                      </div>
                    </div>

                    <div>
                      <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-600 dark:text-gray-400">مستوى المخزون</span>
                        <span class="text-gray-900 dark:text-white font-medium">
                          {{ selectedItem?.remaining_quantity && selectedItem?.total_added 
                            ? Math.round((selectedItem.remaining_quantity / selectedItem.total_added) * 100) 
                            : 0 }}%
                        </span>
                      </div>
                      <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div :class="getProgressBarColor(selectedItem?.remaining_quantity || 0)" class="h-full"
                             :style="{ width: selectedItem?.remaining_quantity && selectedItem?.total_added 
                               ? Math.round((selectedItem.remaining_quantity / selectedItem.total_added) * 100) + '%' 
                               : '0%' }"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- History Tab -->
                <div v-if="activeTab === 'history'" class="space-y-4">
                  <div v-if="itemTransactions.length > 0">
                    <div v-for="transaction in itemTransactions" :key="transaction.id" 
                         class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                      <div :class="getTransactionIconClass(transaction.type)" 
                           class="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getTransactionIcon(transaction.type)" />
                        </svg>
                      </div>
                      <div class="flex-1">
                        <div class="flex justify-between items-start">
                          <p class="font-medium text-gray-900 dark:text-white">{{ getTransactionLabel(transaction.type) }}</p>
                          <span class="text-xs text-gray-500 dark:text-gray-500">
                            {{ formatDate(transaction.timestamp) }}
                          </span>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ transaction.notes }}</p>
                        <div class="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
                          <span>بواسطة: {{ transaction.user_name || 'غير معروف' }}</span>
                          <span v-if="transaction.user_email" class="text-xs text-gray-500 dark:text-gray-500">
                            ({{ transaction.user_email }})
                          </span>
                          <span class="flex items-center gap-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                            </svg>
                            {{ getWarehouseLabel(transaction.from_warehouse) }}
                          </span>
                        </div>
                      </div>
                      <span :class="getTransactionQuantityClass(transaction.total_delta)" 
                            class="text-sm font-bold px-2 py-1 rounded">
                        {{ transaction.total_delta > 0 ? '+' : '' }}{{ transaction.total_delta }}
                      </span>
                    </div>
                  </div>
                  <div v-else class="text-center py-8">
                    <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <p class="text-gray-500 dark:text-gray-400">لا توجد حركات سابقة</p>
                  </div>
                </div>

                <!-- Actions Tab -->
                <div v-if="activeTab === 'actions' && !readonly" class="space-y-4">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      v-if="canTransferItem(selectedItem)"
                      @click="handleTransfer(selectedItem)"
                      class="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
                    >
                      <svg class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                      </svg>
                      <span>نقل بين المخازن</span>
                    </button>

                    <button 
                      v-if="canDispatchItem(selectedItem)"
                      @click="handleDispatch(selectedItem)"
                      class="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
                    >
                      <svg class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      <span>صرف إلى خارجي</span>
                    </button>

                    <button 
                      v-if="canEditItem(selectedItem)"
                      @click="handleEdit(selectedItem)"
                      class="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
                    >
                      <svg class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                      <span>تعديل الصنف</span>
                    </button>

                    <button 
                      v-if="canDeleteItem(selectedItem)"
                      @click="handleDelete(selectedItem)"
                      class="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
                    >
                      <svg class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      <span>حذف الصنف</span>
                    </button>
                  </div>

                  <!-- Quick Stats -->
                  <div class="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                    <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">معلومات سريعة</h4>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="text-center">
                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">تاريخ الإضافة</p>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(selectedItem?.created_at) }}</p>
                      </div>
                      <div class="text-center">
                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">آخر تحديث</p>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(selectedItem?.updated_at) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
    <div v-if="operationLoading || deleteLoading" class="fixed inset-0 bg-black/50 backdrop-blur-xl flex items-center justify-center z-50">
      <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-8 flex flex-col items-center shadow-2xl m-4 border border-gray-200/50 dark:border-gray-700/50">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 dark:border-blue-400 mb-6"></div>
        <p class="text-gray-800 dark:text-gray-200 font-semibold text-lg">جاري المعالجة...</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">يرجى الانتظار</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, reactive, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { utils, writeFile } from 'xlsx';
import { debounce } from 'lodash';
import AddItemModal from '@/components/inventory/AddItemModal.vue';
import DispatchModal from '@/components/inventory/DispatchModal.vue';
import EditItemModal from '@/components/inventory/EditItemModal.vue';
import TransferModal from '@/components/inventory/TransferModal.vue';

// Custom lazy load directive
const lazyImageDirective = {
  mounted(el) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = el;
          const src = img.getAttribute('src');
          if (src && !img.loaded) {
            img.loaded = true;
            // Preload image in background
            const tempImg = new Image();
            tempImg.src = src;
            tempImg.onload = () => {
              img.src = src;
            };
          }
          observer.unobserve(el);
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0.1
    });
    
    el.imageObserver = observer;
    observer.observe(el);
  },
  unmounted(el) {
    if (el.imageObserver) {
      el.imageObserver.unobserve(el);
    }
  }
};

// Local Storage Service
const StorageService = {
  set(key, data, expiry = 5 * 60 * 1000) { // 5 minutes default
    const item = {
      data,
      expiry: Date.now() + expiry,
      timestamp: new Date().toISOString()
    };
    try {
      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },
  
  get(key) {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;
      
      const item = JSON.parse(itemStr);
      if (Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      
      return item.data;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  
  clearByPattern(pattern) {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes(pattern)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage by pattern:', error);
    }
  }
};

// Performance Metrics
const PerformanceMetrics = {
  startTime: null,
  itemsLoaded: 0,
  cacheHits: 0,
  networkRequests: 0,
  
  start() {
    this.startTime = Date.now();
    this.itemsLoaded = 0;
    this.cacheHits = 0;
    this.networkRequests = 0;
  },
  
  logCacheHit() {
    this.cacheHits++;
  },
  
  logNetworkRequest() {
    this.networkRequests++;
  },
  
  logItemsLoaded(count) {
    this.itemsLoaded = count;
  },
  
  getMetrics() {
    const loadTime = Date.now() - this.startTime;
    return {
      loadTime,
      itemsLoaded: this.itemsLoaded,
      cacheHits: this.cacheHits,
      networkRequests: this.networkRequests,
      cacheHitRate: this.itemsLoaded > 0 ? (this.cacheHits / this.itemsLoaded) * 100 : 0
    };
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
    'lazy-image': lazyImageDirective
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    
    // State
    const loading = ref(false);
    const loadingMore = ref(false);
    const error = ref('');
    const showAddModal = ref(false);
    const showEditModal = ref(false);
    const showTransferModal = ref(false);
    const showDispatchModal = ref(false);
    const showDetailsModal = ref(false);
    const searchTerm = ref('');
    const statusFilter = ref('');
    const selectedWarehouse = ref('');
    const selectedItemForEdit = ref(null);
    const selectedItemForTransfer = ref(null);
    const selectedItemForDispatch = ref(null);
    const selectedItemId = ref(null);
    const deleteLoading = ref(false);
    const exporting = ref(false);
    const lastUpdateTime = ref(new Date().toLocaleTimeString('ar-EG'));
    const imageLoaded = reactive({});
    const detailImageLoaded = ref(false);
    const showActionMenu = ref(null);
    const activeTab = ref('details');
    const searchTimeout = ref(null);
    const fromCache = ref(false);
    const cacheAge = ref(0);
    
    // Pagination State
    const currentPage = ref(1);
    const totalPages = ref(1);
    const pageSize = ref(50);
    const totalItems = ref(0);
    const pageInput = ref(1);
    
    // Performance state
    const performanceMetrics = reactive({ ...PerformanceMetrics });
    
    // Intersection Observer for infinite scroll
    const observer = ref(null);
    const lastElementRef = ref(null);
    
    // Color mapping for common colors
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
      'فضي': '#9ca3af',
      'أزرق فاتح': '#60a5fa',
      'أخضر فاتح': '#34d399',
      'أحمر فاتح': '#f87171'
    };
    
    // Tabs configuration
    const tabs = [
      { id: 'details', label: 'التفاصيل' },
      { id: 'history', label: 'سجل الحركات' },
      { id: 'actions', label: 'الإجراءات' }
    ];
    
    // Computed properties
    const userRole = computed(() => store.getters.userRole);
    const userProfile = computed(() => store.state.userProfile);
    const inventory = computed(() => store.state.inventory || []);
    const operationLoading = computed(() => store.state.operationLoading);
    const operationError = computed(() => store.state.operationError);
    const accessibleWarehouses = computed(() => store.getters.accessibleWarehouses || []);
    const allWarehouses = computed(() => store.state.warehouses || []);
    const transactions = computed(() => store.state.transactions || []);
    
    // Pagination computed
    const showingFrom = computed(() => {
      return ((currentPage.value - 1) * pageSize.value) + 1;
    });
    
    const showingTo = computed(() => {
      const to = currentPage.value * pageSize.value;
      return to > totalItems.value ? totalItems.value : to;
    });
    
    // Selected item details
    const selectedItem = computed(() => {
      return inventory.value.find(item => item.id === selectedItemId.value);
    });
    
    // Item transactions with enhanced user info
    const itemTransactions = computed(() => {
      if (!selectedItemId.value) return [];
      return transactions.value.filter(transaction => 
        transaction.item_id === selectedItemId.value
      ).sort((a, b) => {
        const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
        const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
        return dateB - dateA;
      });
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
    
    const canDeleteItem = (item) => {
      return canEditItem(item);
    };
    
    // Filtered items with pagination
    const filteredItems = computed(() => {
      let filtered = [...inventory.value];
      
      if (selectedWarehouse.value) {
        filtered = filtered.filter(item => item.warehouse_id === selectedWarehouse.value);
      }
      
      if (statusFilter.value) {
        filtered = filtered.filter(item => {
          const quantity = item.remaining_quantity || 0;
          if (statusFilter.value === 'in_stock') return quantity >= 10;
          if (statusFilter.value === 'low_stock') return quantity > 0 && quantity < 10;
          if (statusFilter.value === 'out_of_stock') return quantity === 0;
          return true;
        });
      }
      
      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase();
        filtered = filtered.filter(item => 
          item.name?.toLowerCase().includes(term) ||
          item.code?.toLowerCase().includes(term) ||
          item.color?.toLowerCase().includes(term) ||
          item.supplier?.toLowerCase().includes(term) ||
          item.item_location?.toLowerCase().includes(term)
        );
      }
      
      // Update total items for pagination
      totalItems.value = filtered.length;
      totalPages.value = Math.ceil(totalItems.value / pageSize.value);
      
      // Apply pagination
      const startIndex = (currentPage.value - 1) * pageSize.value;
      const endIndex = startIndex + pageSize.value;
      
      return filtered.slice(startIndex, endIndex);
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
    
    const getProgressBarColor = (quantity) => {
      if (quantity === 0) return 'bg-red-500';
      if (quantity < 10) return 'bg-yellow-500';
      return 'bg-green-500';
    };
    
    const formatDate = (date) => {
      if (!date) return '-';
      try {
        const dateObj = date.toDate ? date.toDate() : new Date(date);
        return new Intl.DateTimeFormat('ar-EG', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).format(dateObj);
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
    
    const formatCacheAge = (ageInSeconds) => {
      if (ageInSeconds < 60) return `${ageInSeconds} ثانية`;
      if (ageInSeconds < 3600) return `${Math.floor(ageInSeconds / 60)} دقيقة`;
      return `${Math.floor(ageInSeconds / 3600)} ساعة`;
    };
    
    const getColorHex = (colorName) => {
      return colorMap[colorName] || '#6b7280';
    };
    
    const getTransactionLabel = (type) => {
      const labels = {
        'ADD': 'إضافة',
        'EDIT': 'تعديل',
        'TRANSFER': 'نقل',
        'DISPATCH': 'صرف',
        'DELETE': 'حذف',
        'RESTOCK': 'إعادة تخزين'
      };
      return labels[type] || type;
    };
    
    const getTransactionIcon = (type) => {
      const icons = {
        'ADD': 'M12 4v16m8-8H4',
        'EDIT': 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
        'TRANSFER': 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
        'DISPATCH': 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
        'DELETE': 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
        'RESTOCK': 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
      };
      return icons[type] || 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    };
    
    const getTransactionIconClass = (type) => {
      const classes = {
        'ADD': 'bg-green-500',
        'EDIT': 'bg-yellow-500',
        'TRANSFER': 'bg-blue-500',
        'DISPATCH': 'bg-purple-500',
        'DELETE': 'bg-red-500',
        'RESTOCK': 'bg-indigo-500'
      };
      return classes[type] || 'bg-gray-500';
    };
    
    const getTransactionQuantityClass = (quantity) => {
      if (quantity > 0) return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      if (quantity < 0) return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    };
    
    const handleImageError = (event) => {
      const img = event.target;
      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMTZMNC42ODYgMTUuMzE0QzQuODgyIDExLjUwNyA4LjA5MyA5IDEyIDlDMTUuOTA3IDkgMTkuMTE4IDExLjUwNyAxOS4zMTQgMTUuMzE0TDIwIDE2TTggMjFIMTZNNSAxNEgxOU0xMiAxN0MxMiAxNy41NTIyOCAxMS41NTIzIDE4IDExIDE4QzEwLjQ0NzcgMTggMTAgMTcuNTUyMyAxMCAxN0MxMCAxNi40NDc3IDEwLjQ0NzcgMTYgMTEgMTZDMTEuNTUyMyAxNiAxMiAxNi40NDc3IDEyIDE3WiIgc3Ryb2tlPSI2QjcyOEQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
      img.onerror = null;
    };
    
    const handleImageLoad = (itemId) => {
      imageLoaded[itemId] = true;
    };
    
    const toggleActionMenu = (itemId) => {
      showActionMenu.value = showActionMenu.value === itemId ? null : itemId;
    };
    
    const showItemDetails = (item) => {
      selectedItemId.value = item.id;
      detailImageLoaded.value = false;
      activeTab.value = 'details';
      showDetailsModal.value = true;
      showActionMenu.value = null;
    };
    
    const closeDetailsModal = () => {
      showDetailsModal.value = false;
      selectedItemId.value = null;
    };
    
    // Action Methods
    const updateWarehouseFilter = () => {
      currentPage.value = 1;
      pageInput.value = 1;
      store.dispatch('updateFilters', { warehouse: selectedWarehouse.value });
    };
    
    const updateStatusFilter = () => {
      currentPage.value = 1;
      pageInput.value = 1;
    };
    
    // Debounced search with 500ms delay
    const handleSearch = debounce(() => {
      currentPage.value = 1;
      pageInput.value = 1;
      store.dispatch('updateFilters', { search: searchTerm.value });
    }, 500);
    
    // Pagination methods
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        pageInput.value = currentPage.value;
        scrollToTop();
      }
    };
    
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        pageInput.value = currentPage.value;
        scrollToTop();
      }
    };
    
    const goToPage = () => {
      let page = parseInt(pageInput.value);
      if (isNaN(page) || page < 1) page = 1;
      if (page > totalPages.value) page = totalPages.value;
      
      currentPage.value = page;
      pageInput.value = page;
      scrollToTop();
    };
    
    const changePageSize = () => {
      currentPage.value = 1;
      pageInput.value = 1;
    };
    
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // Enhanced refresh with caching
    const refreshData = async (forceRefresh = false) => {
      try {
        performanceMetrics.start();
        loading.value = true;
        fromCache.value = false;
        cacheAge.value = 0;
        
        // Reset filters
        searchTerm.value = '';
        statusFilter.value = '';
        selectedWarehouse.value = '';
        currentPage.value = 1;
        pageInput.value = 1;
        
        store.dispatch('updateFilters', { search: '', warehouse: '' });
        
        // Check cache first
        if (!forceRefresh) {
          const cacheKey = `inventory_${userRole.value}_${selectedWarehouse.value || 'all'}`;
          const cachedData = StorageService.get(cacheKey);
          
          if (cachedData && cachedData.items) {
            performanceMetrics.logCacheHit();
            fromCache.value = true;
            cacheAge.value = Math.floor((Date.now() - new Date(cachedData.timestamp).getTime()) / 1000);
            
            store.commit('SET_INVENTORY', cachedData.items);
            performanceMetrics.logItemsLoaded(cachedData.items.length);
            
            // Load fresh data in background
            setTimeout(() => loadFreshData(), 1000);
          } else {
            await loadFreshData();
          }
        } else {
          await loadFreshData();
        }
        
        // Load transactions with enhanced user info
        await loadTransactions();
        
        // Clear old image cache
        Object.keys(imageLoaded).forEach(key => {
          delete imageLoaded[key];
        });
        
        lastUpdateTime.value = new Date().toLocaleTimeString('ar-EG');
        
        // Log performance metrics
        const metrics = performanceMetrics.getMetrics();
        console.log('Performance Metrics:', metrics);
        
      } catch (err) {
        error.value = 'حدث خطأ في تحديث البيانات: ' + err.message;
        store.dispatch('showNotification', {
          type: 'error',
          message: 'فشل في تحميل البيانات'
        });
      } finally {
        loading.value = false;
      }
    };
    
    const loadFreshData = async () => {
      performanceMetrics.logNetworkRequest();
      
      try {
        const { db } = await import('@/firebase/config');
        const { collection, query, where, orderBy, limit, getDocs } = await import('firebase/firestore');
        
        let itemsQuery = query(
          collection(db, 'items'),
          orderBy('updated_at', 'desc')
        );
        
        if (selectedWarehouse.value) {
          itemsQuery = query(itemsQuery, where('warehouse_id', '==', selectedWarehouse.value));
        }
        
        // Limit initial load for performance
        itemsQuery = query(itemsQuery, limit(1000));
        
        const snapshot = await getDocs(itemsQuery);
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        performanceMetrics.logItemsLoaded(items.length);
        
        // Store in Vuex
        store.commit('SET_INVENTORY', items);
        
        // Cache the data
        const cacheKey = `inventory_${userRole.value}_${selectedWarehouse.value || 'all'}`;
        StorageService.set(cacheKey, {
          items,
          timestamp: new Date().toISOString(),
          totalCount: items.length
        }, 5 * 60 * 1000); // 5 minutes cache
        
      } catch (error) {
        console.error('Error loading fresh data:', error);
        throw error;
      }
    };
    
    const loadTransactions = async () => {
      try {
        const { db } = await import('@/firebase/config');
        const { collection, query, orderBy, limit, getDocs } = await import('firebase/firestore');
        
        const transactionsQuery = query(
          collection(db, 'transactions'),
          orderBy('timestamp', 'desc'),
          limit(100) // Limit to recent transactions
        );
        
        const snapshot = await getDocs(transactionsQuery);
        const transactions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        store.commit('SET_TRANSACTIONS', transactions);
        
      } catch (error) {
        console.error('Error loading transactions:', error);
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
    };
    
    const handleDelete = async (item) => {
      if (!canDeleteItem(item)) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية الحذف من هذا المخزن'
        });
        return;
      }
      
      const confirmMessage = item.remaining_quantity > 0 
        ? `هل أنت متأكد من حذف الصنف "${item.name}" (${item.code})؟\n\n⚠️ يوجد ${item.remaining_quantity} قطعة متبقية في المخزون.\n\nهذا الإجراء لا يمكن التراجع عنه.`
        : `هل أنت متأكد من حذف الصنف "${item.name}" (${item.code})؟\n\nهذا الإجراء لا يمكن التراجع عنه.`;
      
      if (!confirm(confirmMessage)) {
        return;
      }
      
      try {
        deleteLoading.value = true;
        
        const { db } = await import('@/firebase/config');
        const { doc, deleteDoc, collection, addDoc } = await import('firebase/firestore');
        
        const itemRef = doc(db, 'items', item.id);
        await deleteDoc(itemRef);
        
        // Enhanced transaction with user details
        const transactionData = {
          type: 'DELETE',
          item_id: item.id,
          item_name: item.name,
          item_code: item.code,
          from_warehouse: item.warehouse_id,
          to_warehouse: null,
          cartons_delta: 0,
          per_carton_updated: 0,
          single_delta: 0,
          total_delta: -item.remaining_quantity,
          new_remaining: 0,
          user_id: store.state.user?.uid,
          user_name: store.getters.userName || 'مستخدم غير معروف',
          user_email: store.state.user?.email,
          user_role: store.state.userRole,
          department: userProfile.value?.department || '',
          timestamp: new Date(),
          notes: `تم حذف الصنف نهائياً. الكمية المحذوفة: ${item.remaining_quantity}`,
          photo_url: item.photo_url || null
        };
        
        await addDoc(collection(db, 'transactions'), transactionData);
        
        // Clear cache
        StorageService.clearByPattern('inventory_');
        
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم حذف الصنف "${item.name}" بنجاح`
        });
        
        if (showDetailsModal.value) {
          closeDetailsModal();
        }
        
        // Refresh data
        refreshData(true);
        
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
    
    const handleItemSaved = () => {
      showAddModal.value = false;
      refreshData(true);
    };
    
    const handleItemUpdated = () => {
      showEditModal.value = false;
      selectedItemForEdit.value = null;
      refreshData(true);
    };
    
    const handleTransferSuccess = () => {
      showTransferModal.value = false;
      selectedItemForTransfer.value = null;
      refreshData(true);
    };
    
    const handleDispatchSuccess = () => {
      showDispatchModal.value = false;
      selectedItemForDispatch.value = null;
      refreshData(true);
    };
    
    // FIXED Excel Export Function - Simple and Reliable
    const generateReport = () => {
      try {
        exporting.value = true;
        
        const items = filteredItems.value;
        if (items.length === 0) {
          store.dispatch('showNotification', {
            type: 'warning',
            message: 'لا توجد بيانات للتصدير'
          });
          exporting.value = false;
          return;
        }
        
        // Prepare data for Excel
        const wsData = [];
        
        // Header
        wsData.push(['شركة ABC للتجارة والمقاولات - تقرير المخزون']);
        wsData.push([`تاريخ الإصدار: ${new Date().toLocaleDateString('ar-EG')}`]);
        wsData.push([`وقت الإصدار: ${new Date().toLocaleTimeString('ar-EG')}`]);
        wsData.push([`عدد الأصناف: ${items.length}`]);
        wsData.push([]);
        
        // Table Headers
        const headers = [
          'م', 'كود الصنف', 'اسم الصنف', 'اللون', 'المخزن', 
          'مكان التخزين', 'المورد', 'الكراتين', 'في الكرتونة', 
          'الفردي', 'الكمية المضافة', 'الرصيد الحالي', 'الحالة', 
          'آخر تحديث'
        ];
        wsData.push(headers);
        
        // Table Data
        items.forEach((item, index) => {
          wsData.push([
            index + 1,
            item.code || '',
            item.name || '',
            item.color || '-',
            getWarehouseLabel(item.warehouse_id) || '',
            item.item_location || '-',
            item.supplier || '-',
            item.cartons_count || 0,
            item.per_carton_count || 0,
            item.single_bottles_count || 0,
            item.total_added || 0,
            item.remaining_quantity || 0,
            getStockStatus(item.remaining_quantity),
            formatDate(item.updated_at)
          ]);
        });
        
        // Add empty row
        wsData.push([]);
        
        // Summary Statistics
        wsData.push(['إحصائيات التقرير']);
        wsData.push(['إجمالي الأصناف:', items.length]);
        wsData.push(['إجمالي الرصيد:', items.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0)]);
        
        const totalInStock = items.filter(item => (item.remaining_quantity || 0) >= 10).length;
        const totalLowStock = items.filter(item => (item.remaining_quantity || 0) > 0 && (item.remaining_quantity || 0) < 10).length;
        const totalOutOfStock = items.filter(item => (item.remaining_quantity || 0) === 0).length;
        
        wsData.push(['الأصناف المتوفرة:', totalInStock]);
        wsData.push(['الأصناف قليلة المخزون:', totalLowStock]);
        wsData.push(['الأصناف المنتهية:', totalOutOfStock]);
        
        // Create worksheet
        const ws = utils.aoa_to_sheet(wsData);
        
        // Create workbook
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'تقرير المخزون');
        
        // Generate filename
        const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const filename = `تقرير_المخزون_${timestamp}.xlsx`;
        
        // Write file - Using sync method to avoid async issues
        writeFile(wb, filename);
        
        exporting.value = false;
        
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم إنشاء التقرير "${filename}" بنجاح`
        });
        
      } catch (error) {
        console.error('Error generating report:', error);
        exporting.value = false;
        
        // Fallback to CSV
        try {
          generateCSVReport();
        } catch (csvError) {
          store.dispatch('showNotification', {
            type: 'error',
            message: 'فشل في تصدير البيانات. يرجى المحاولة مرة أخرى.'
          });
        }
      }
    };
    
    // CSV fallback function
    const generateCSVReport = () => {
      const items = filteredItems.value;
      
      // Create CSV content
      let csvContent = 'data:text/csv;charset=utf-8,\ufeff';
      
      // Headers
      const headers = ['الكود', 'الاسم', 'اللون', 'المخزن', 'المكان', 'المورد', 'الكراتين', 'في الكرتونة', 'الفردي', 'المضاف', 'المتبقي', 'الحالة'];
      csvContent += headers.join(',') + '\n';
      
      // Data
      items.forEach(item => {
        const row = [
          `"${item.code || ''}"`,
          `"${item.name || ''}"`,
          `"${item.color || ''}"`,
          `"${getWarehouseLabel(item.warehouse_id)}"`,
          `"${item.item_location || ''}"`,
          `"${item.supplier || ''}"`,
          item.cartons_count || 0,
          item.per_carton_count || 0,
          item.single_bottles_count || 0,
          item.total_added || 0,
          item.remaining_quantity || 0,
          `"${getStockStatus(item.remaining_quantity)}"`
        ];
        csvContent += row.join(',') + '\n';
      });
      
      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      
      const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
      link.setAttribute('download', `تقرير_المخزون_${timestamp}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      store.dispatch('showNotification', {
        type: 'info',
        message: 'تم تصدير البيانات بصيغة CSV'
      });
    };
    
    // Lifecycle
    onMounted(() => {
      performanceMetrics.start();
      
      if (accessibleWarehouses.value.length === 1) {
        selectedWarehouse.value = accessibleWarehouses.value[0].id;
        updateWarehouseFilter();
      }
      
      if (route.name === 'AddInventory') {
        showAddModal.value = true;
      }
      
      // Load cached data first for instant display
      refreshData(false);
      
      // Setup infinite scroll observer
      observer.value = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loadingMore.value && currentPage.value < totalPages.value) {
          loadingMore.value = true;
          setTimeout(() => {
            nextPage();
            loadingMore.value = false;
          }, 500);
        }
      }, {
        rootMargin: '100px',
        threshold: 0.1
      });
      
      // Preload images for visible items
      const preloadImages = () => {
        const visibleItems = filteredItems.value.slice(0, 10); // Preload first 10 items
        visibleItems.forEach(item => {
          if (item.photo_url && !imageLoaded[item.id]) {
            const img = new Image();
            img.src = item.photo_url;
            img.onload = () => {
              imageLoaded[item.id] = true;
            };
            img.onerror = () => {
              imageLoaded[item.id] = false;
            };
          }
        });
      };
      
      // Delay preloading to avoid blocking initial render
      setTimeout(preloadImages, 1000);
    });
    
    // Cleanup
    onUnmounted(() => {
      if (observer.value) {
        observer.value.disconnect();
      }
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }
      
      // Clean up image observers
      Object.keys(imageLoaded).forEach(key => {
        delete imageLoaded[key];
      });
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
    
    // Watch for inventory changes
    watch(inventory, (newInventory) => {
      // Update performance metrics
      performanceMetrics.logItemsLoaded(newInventory.length);
      
      // Preload images for new items
      newInventory.slice(0, 20).forEach(item => {
        if (item.photo_url && !imageLoaded[item.id]) {
          const img = new Image();
          img.src = item.photo_url;
          img.onload = () => {
            imageLoaded[item.id] = true;
          };
          img.onerror = () => {
            imageLoaded[item.id] = false;
          };
        }
      });
    }, { deep: true });
    
    // Watch for page changes
    watch(currentPage, () => {
      pageInput.value = currentPage.value;
    });
    
    // Close action menu when clicking outside
    const handleClickOutside = (event) => {
      if (showActionMenu.value && !event.target.closest('.relative')) {
        showActionMenu.value = null;
      }
    };
    
    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });
    
    return {
      // State
      loading,
      loadingMore,
      error,
      showAddModal,
      showEditModal,
      showTransferModal,
      showDispatchModal,
      showDetailsModal,
      searchTerm,
      statusFilter,
      selectedWarehouse,
      selectedItemForEdit,
      selectedItemForTransfer,
      selectedItemForDispatch,
      selectedItemId,
      deleteLoading,
      exporting,
      lastUpdateTime,
      imageLoaded,
      detailImageLoaded,
      showActionMenu,
      activeTab,
      tabs,
      fromCache,
      cacheAge,
      currentPage,
      totalPages,
      pageSize,
      totalItems,
      pageInput,
      showingFrom,
      showingTo,
      
      // Computed
      userRole,
      userProfile,
      inventory,
      operationLoading,
      operationError,
      accessibleWarehouses,
      allWarehouses,
      canAddItem,
      canExport,
      showActions,
      readonly,
      filteredItems,
      selectedItem,
      itemTransactions,
      
      // Helper Methods
      formatNumber,
      getWarehouseLabel,
      getStockStatus,
      getStockStatusClass,
      getQuantityClass,
      getProgressBarColor,
      formatDate,
      formatRelativeTime,
      formatCacheAge,
      getColorHex,
      getTransactionLabel,
      getTransactionIcon,
      getTransactionIconClass,
      getTransactionQuantityClass,
      handleImageError,
      handleImageLoad,
      
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
      handleTransfer,
      handleDispatch,
      handleEdit,
      handleDelete,
      handleItemSaved,
      handleItemUpdated,
      handleTransferSuccess,
      handleDispatchSuccess,
      toggleActionMenu,
      showItemDetails,
      closeDetailsModal,
      nextPage,
      prevPage,
      goToPage,
      changePageSize,
      
      // Export Methods
      generateReport
    };
  }
};
</script>

<style scoped>
/* Container adjustments */
.container {
  max-width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
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
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}

@media (min-width: 1536px) {
  .container {
    max-width: 1536px;
  }
}

/* Table Body with Custom Scrollbar */
.table-body {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.table-body::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-body::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

.table-body::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 4px;
}

.table-body::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.8);
}

.dark .table-body::-webkit-scrollbar-track {
  background: rgba(31, 41, 55, 0.5);
}

.dark .table-body::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.5);
}

.dark .table-body::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.8);
}

/* Sticky elements */
.sticky {
  position: -webkit-sticky;
  position: sticky;
}

/* Grid columns for table */
.grid-cols-12 {
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

/* Glass morphism effects */
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Gradient backgrounds with animation */
.bg-gradient-to-br {
  background-size: 200% 200%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Button animations */
.active\:scale-95:active {
  transform: scale(0.95);
}

/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Group hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

.group\/btn:hover .group-hover\/btn\:scale-110 {
  transform: scale(1.1);
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Dark mode specific */
.dark .bg-gray-750 {
  background-color: rgba(55, 65, 81, 0.5);
}

/* Selection styling */
::selection {
  background-color: rgba(59, 130, 246, 0.3);
}

.dark ::selection {
  background-color: rgba(59, 130, 246, 0.5);
}

/* Focus styles for accessibility */
*:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

*:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.dark *:focus-visible {
  outline-color: #60a5fa;
}

/* Responsive table height */
@media (max-height: 800px) {
  .table-body {
    max-height: calc(100vh - 180px);
  }
}

/* Arabic font optimization */
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;600;700;800&display=swap');

* {
  font-family: 'Tajawal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

/* Image loading skeleton */
img {
  transition: opacity 0.3s ease;
}

/* Smooth shadow transitions */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.dark .shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.dark .hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

/* RTL specific adjustments */
[dir="rtl"] .space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

/* Utility classes */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

/* Loading states */
.loading-skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.dark .loading-skeleton {
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200% 100%;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Custom scrollbar for modal */
.modal-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

.modal-scroll::-webkit-scrollbar {
  width: 6px;
}

.modal-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.modal-scroll::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

.modal-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

.dark .modal-scroll::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.3);
}

.dark .modal-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.5);
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .table-body {
    max-height: calc(100vh - 160px);
  }
  
  button, 
  select,
  input {
    min-height: 44px;
  }
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  .table-body {
    max-height: none !important;
    overflow: visible !important;
  }
  
  .sticky {
    position: static !important;
  }
}

/* Mobile Card Styling */
@media (max-width: 1023px) {
  .sm\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .sm\:grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

/* Zebra striping for desktop table rows */
.even\:bg-gray-100\/30:nth-child(even) {
  background-color: rgba(243, 244, 246, 0.3);
}

.dark .even\:bg-gray-700\/10:nth-child(even) {
  background-color: rgba(55, 65, 81, 0.1);
}

/* Enhanced mobile card hover effects */
.hover\:shadow-2xl:hover {
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

/* Mobile status badges */
.text-\[10px\] {
  font-size: 10px;
}

/* Card truncation improvements */
.max-w-\[150px\] {
  max-width: 150px;
}

/* Better mobile touch targets */
@media (max-width: 640px) {
  button, 
  a, 
  input, 
  select {
    min-height: 48px;
  }
  
  .text-xs {
    font-size: 0.75rem;
  }
  
  .text-sm {
    font-size: 0.875rem;
  }
}

/* Animation for card appearance */
@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid > div {
  animation: cardAppear 0.3s ease-out;
  animation-fill-mode: both;
}

.grid > div:nth-child(1) { animation-delay: 0.05s; }
.grid > div:nth-child(2) { animation-delay: 0.1s; }
.grid > div:nth-child(3) { animation-delay: 0.15s; }
.grid > div:nth-child(4) { animation-delay: 0.2s; }
.grid > div:nth-child(5) { animation-delay: 0.25s; }
.grid > div:nth-child(6) { animation-delay: 0.3s; }
.grid > div:nth-child(7) { animation-delay: 0.35s; }
.grid > div:nth-child(8) { animation-delay: 0.4s; }
}

/* Performance optimization styles */
img[v-lazy-image] {
  opacity: 0;
  transition: opacity 0.3s ease;
}

img[v-lazy-image].loaded {
  opacity: 1;
}

/* Offline indicator */
.offline-indicator {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #ef4444;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Cache status indicator */
.cache-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.cache-status.cache-hit {
  background: rgba(34, 197, 94, 0.1);
  color: #10b981;
}

/* Loading bar for infinite scroll */
.infinite-scroll-loader {
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6);
  background-size: 200% 100%;
  animation: loadingBar 1.5s infinite;
}

@keyframes loadingBar {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Optimized table row hover */
.table-row-enter-active,
.table-row-leave-active {
  transition: all 0.3s ease;
}

.table-row-enter-from,
.table-row-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Performance metrics display */
.performance-metrics {
  position: fixed;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 11px;
  z-index: 999;
  pointer-events: none;
}

/* Mobile performance optimizations */
@media (max-width: 640px) {
  .performance-metrics {
    display: none;
  }
  
  /* Reduce animations on mobile for better performance */
  * {
    animation-duration: 0.3s !important;
    transition-duration: 0.2s !important;
  }
  
  /* Optimize images for mobile */
  img {
    max-width: 100%;
    height: auto;
  }
}

/* Print optimizations */
@media print {
  .no-print {
    display: none !important;
  }
  
  .table-body {
    overflow: visible !important;
    max-height: none !important;
  }
  
  .sticky {
    position: static !important;
  }
  
  /* Ensure table prints properly */
  table {
    page-break-inside: auto;
  }
  
  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
}
</style>
