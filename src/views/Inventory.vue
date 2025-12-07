<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
    <!-- Integrated Layout - No duplicate header -->
    <main class="pt-16 lg:pt-0 pb-20 lg:pb-0">
      <div class="container mx-auto px-4 py-4 sm:px-6 sm:py-6">
        <!-- Stats Cards - 4 small cards side by side -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
          <!-- Total Items Card -->
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-3 sm:p-4 hover:shadow-md transition-all duration-200 group">
            <div class="flex items-center">
              <div class="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center ml-2 sm:ml-3 group-hover:from-blue-500/30 group-hover:to-blue-500/20 transition-all duration-200">
                <svg class="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
              <div class="flex-1 text-right">
                <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">الأصناف</p>
                <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{{ formatNumber(stats.totalItems) }}</p>
              </div>
            </div>
          </div>

          <!-- Total Quantity Card -->
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-3 sm:p-4 hover:shadow-md transition-all duration-200 group">
            <div class="flex items-center">
              <div class="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center ml-2 sm:ml-3 group-hover:from-green-500/30 group-hover:to-green-500/20 transition-all duration-200">
                <svg class="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="flex-1 text-right">
                <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">الكمية</p>
                <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{{ formatNumber(stats.totalQuantity) }}</p>
              </div>
            </div>
          </div>

          <!-- Low Stock Card -->
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-3 sm:p-4 hover:shadow-md transition-all duration-200 group">
            <div class="flex items-center">
              <div class="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-500/10 flex items-center justify-center ml-2 sm:ml-3 group-hover:from-orange-500/30 group-hover:to-orange-500/20 transition-all duration-200">
                <svg class="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="flex-1 text-right">
                <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">قليلة</p>
                <p class="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400">{{ formatNumber(stats.lowStockItems) }}</p>
              </div>
            </div>
          </div>

          <!-- Recent Transactions Card -->
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-3 sm:p-4 hover:shadow-md transition-all duration-200 group">
            <div class="flex items-center">
              <div class="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/10 flex items-center justify-center ml-2 sm:ml-3 group-hover:from-purple-500/30 group-hover:to-purple-500/20 transition-all duration-200">
                <svg class="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <div class="flex-1 text-right">
                <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">الحركات</p>
                <p class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{{ formatNumber(stats.recentTransactions) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions Bar -->
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
          <!-- Warehouse Filter -->
          <div v-if="accessibleWarehouses.length > 0" class="relative flex-1">
            <select 
              v-model="selectedWarehouse" 
              @change="updateWarehouseFilter"
              class="w-full appearance-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
            >
              <option value="">جميع المخازن</option>
              <option v-for="warehouse in accessibleWarehouses" :key="warehouse.id" :value="warehouse.id">
                {{ warehouse.name_ar }}
              </option>
            </select>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <!-- Add Item Button -->
            <button 
              v-if="canAddItem"
              @click="showAddModal = true"
              class="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2.5 bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
            >
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/>
              </svg>
              <span class="hidden sm:inline">إضافة صنف</span>
              <span class="sm:hidden">إضافة</span>
            </button>

            <!-- Export Button -->
            <button 
              v-if="canExport"
              @click="exportInventory"
              class="p-2.5 sm:hidden bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-sm"
              title="تصدير"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </button>

            <button 
              v-if="canExport"
              @click="exportInventory"
              class="hidden sm:inline-flex items-center px-3 py-2.5 bg-gradient-to-br from-green-500 to-emerald-500 text-white text-sm font-medium rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-sm active:scale-[0.98]"
            >
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              تصدير
            </button>

            <!-- Refresh Button -->
            <button 
              @click="refreshData"
              class="p-2.5 sm:hidden bg-gray-200/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300/80 dark:hover:bg-gray-600/80 transition-all duration-200"
              :disabled="loading"
              title="تحديث"
            >
              <svg 
                :class="['w-4 h-4', loading ? 'animate-spin' : '']" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>

            <button 
              @click="refreshData"
              class="hidden sm:inline-flex items-center px-3 py-2.5 bg-gray-200/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300/80 dark:hover:bg-gray-600/80 transition-all duration-200 active:scale-[0.98]"
              :disabled="loading"
            >
              <svg 
                :class="['w-4 h-4 ml-2', loading ? 'animate-spin' : '']" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <span class="hidden sm:inline">تحديث</span>
            </button>
          </div>
        </div>

        <!-- Search and Status Filters -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-300/50 dark:border-gray-600/50 p-3 sm:p-4 mb-3 sm:mb-4">
          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Search Input -->
            <div class="flex-1">
              <div class="relative">
                <input
                  type="text"
                  v-model="searchTerm"
                  @input="handleSearch"
                  placeholder="ابحث باسم الصنف، الكود، اللون، أو المورد..."
                  class="w-full pr-10 pl-4 py-2.5 sm:py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm backdrop-blur-sm transition-all duration-200"
                >
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg class="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Status Filter -->
            <select 
              v-model="statusFilter"
              @change="updateStatusFilter"
              class="flex-1 sm:flex-none px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm backdrop-blur-sm transition-all duration-200"
            >
              <option value="">جميع الحالات</option>
              <option value="in_stock">متوفر</option>
              <option value="low_stock">كمية قليلة</option>
              <option value="out_of_stock">غير متوفر</option>
            </select>
          </div>
        </div>

        <!-- Mobile Grid View for Small Screens -->
        <div class="lg:hidden space-y-2">
          <!-- Loading State -->
          <div v-if="loading" class="p-6 text-center rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p class="text-sm text-gray-700 dark:text-gray-300">جاري تحميل البيانات...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="p-4 rounded-xl bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50">
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredItems.length === 0" class="p-6 text-center rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full mb-3">
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
              </svg>
            </div>
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">لا توجد بيانات</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ searchTerm ? 'لم يتم العثور على أصناف مطابقة للبحث' : 'لم يتم إضافة أي أصناف بعد.' }}
            </p>
          </div>

          <!-- Mobile Items Grid with Photo Support -->
          <div v-else>
            <div 
              v-for="item in filteredItems"
              :key="item.id"
              class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-4 hover:shadow-md transition-all duration-200"
            >
              <!-- Item Header with Photo -->
              <div class="flex gap-3 mb-3">
                <!-- Photo Container -->
                <div v-if="item.photo_url" class="flex-shrink-0">
                  <div class="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-700">
                    <img 
                      :src="item.photo_url" 
                      :alt="item.name"
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                      loading="lazy"
                    >
                    <div v-if="!imageLoaded[item.id]" class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                      <svg class="w-6 h-6 text-gray-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <!-- Item Details -->
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start">
                    <div class="flex-1 min-w-0">
                      <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-1 truncate">{{ item.name }}</h3>
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                          {{ item.code }}
                        </span>
                        <span :class="getStockStatusClass(item.remaining_quantity)" class="text-xs px-2 py-0.5 rounded-full">
                          {{ getStockStatus(item.remaining_quantity) }}
                        </span>
                      </div>
                    </div>
                    <span :class="getQuantityClass(item.remaining_quantity)" class="text-lg font-bold ml-2">
                      {{ item.remaining_quantity }}
                    </span>
                  </div>
                  
                  <!-- Item Details -->
                  <div class="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <div class="flex items-center gap-2">
                      <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      </svg>
                      <span class="truncate">{{ getWarehouseLabel(item.warehouse_id) }} • {{ item.item_location || 'بدون مكان' }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                      </svg>
                      <span>اللون: {{ item.color || 'بدون' }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                      <span class="truncate">المورد: {{ item.supplier || 'بدون' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div v-if="showActions && !readonly && userRole !== 'viewer'" class="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                <div class="flex justify-between gap-2">
                  <button 
                    v-if="canEditItem(item)"
                    @click="handleEdit(item)"
                    class="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-yellow-50/80 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-xs font-medium rounded-lg hover:bg-yellow-100/80 dark:hover:bg-yellow-800/20 transition-colors"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    تعديل
                  </button>
                  
                  <button 
                    @click="handleTransfer(item)"
                    v-if="canTransferItem(item)"
                    class="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-50/80 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-lg hover:bg-blue-100/80 dark:hover:bg-blue-800/20 transition-colors"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                    </svg>
                    نقل
                  </button>
                  
                  <button 
                    @click="handleDispatch(item)"
                    v-if="canDispatchItem(item)"
                    class="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-purple-50/80 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-lg hover:bg-purple-100/80 dark:hover:bg-purple-800/20 transition-colors"
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

        <!-- Desktop Table View with Photo Support -->
        <div class="hidden lg:block bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          <!-- Table Header -->
          <div class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200/50 dark:border-gray-700/50">
            <div class="grid grid-cols-13 gap-2 px-4 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300">
              <div class="col-span-1 text-center">الصورة</div>
              <div class="col-span-2">الاسم والتفاصيل</div>
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

          <!-- Table Body -->
          <div class="table-body max-h-[calc(100vh-400px)] min-h-[300px] overflow-y-auto">
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

            <!-- Items List with Photos -->
            <div v-else>
              <div 
                v-for="item in filteredItems"
                :key="item.id"
                class="grid grid-cols-13 gap-2 px-4 py-3 border-b border-gray-100/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-750 transition-colors duration-200"
              >
                <!-- Photo -->
                <div class="col-span-1 flex items-center justify-center">
                  <div v-if="item.photo_url" class="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-700">
                    <img 
                      :src="item.photo_url" 
                      :alt="item.name"
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                      loading="lazy"
                      @load="imageLoaded[item.id] = true"
                    >
                    <div v-if="!imageLoaded[item.id]" class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                      <svg class="w-6 h-6 text-gray-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                  </div>
                  <div v-else class="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border border-gray-200/50 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                </div>

                <!-- Item Name and Details -->
                <div class="col-span-2">
                  <div class="font-medium text-sm text-gray-900 dark:text-white mb-1 truncate">
                    {{ item.name }}
                  </div>
                  <div v-if="item.item_location" class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span class="truncate">{{ item.item_location }}</span>
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
                  <div class="text-sm text-gray-600 dark:text-gray-400 truncate px-2">{{ item.supplier || '-' }}</div>
                </div>

                <!-- Location -->
                <div class="col-span-1 text-center">
                  <div class="text-sm text-gray-600 dark:text-gray-400 truncate px-2">{{ item.item_location || '-' }}</div>
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
                      class="p-1.5 bg-blue-50/80 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100/80 dark:hover:bg-blue-800/20 transition-colors"
                      title="نقل"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                      </svg>
                    </button>

                    <button 
                      @click="handleDispatch(item)"
                      class="p-1.5 bg-purple-50/80 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 rounded-lg hover:bg-purple-100/80 dark:hover:bg-purple-800/20 transition-colors"
                      title="صرف"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                    </button>

                    <button 
                      v-if="canEditItem(item)"
                      @click="handleEdit(item)"
                      class="p-1.5 bg-yellow-50/80 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-300 rounded-lg hover:bg-yellow-100/80 dark:hover:bg-yellow-800/20 transition-colors"
                      title="تعديل"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>

                    <button 
                      v-if="canDeleteItem(item)"
                      @click="handleDelete(item)"
                      class="p-1.5 bg-red-50/80 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-100/80 dark:hover:bg-red-800/20 transition-colors"
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

        <!-- Results Count -->
        <div v-if="filteredItems.length > 0" class="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-200/50 dark:border-gray-700/50 gap-3 mt-4">
          <div class="text-sm text-gray-700 dark:text-gray-300 text-center sm:text-right">
            عرض <span class="font-medium">{{ filteredItems.length }}</span> نتيجة
          </div>
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

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-200/50 dark:border-gray-700/50">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
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
          <p class="text-gray-700 dark:text-gray-300 mb-2">
            هل أنت متأكد من حذف الصنف:
          </p>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
            <div class="flex items-center gap-3 mb-2">
              <div v-if="itemToDelete?.photo_url" class="w-10 h-10 rounded overflow-hidden border border-gray-200 dark:border-gray-600">
                <img :src="itemToDelete.photo_url" :alt="itemToDelete?.name" class="w-full h-full object-cover">
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ itemToDelete?.name }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ itemToDelete?.code }} - {{ itemToDelete?.color }}</p>
              </div>
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <p>المخزن: {{ getWarehouseLabel(itemToDelete?.warehouse_id) }}</p>
              <p>الكمية المتبقية: {{ itemToDelete?.remaining_quantity }}</p>
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

    <!-- Loading Overlay -->
    <div v-if="operationLoading || deleteLoading" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl p-6 sm:p-8 flex flex-col items-center shadow-2xl m-4 border border-gray-200/50 dark:border-gray-700/50">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-700 dark:text-gray-300 font-medium">جاري المعالجة...</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">يرجى الانتظار</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, reactive } from 'vue';
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
    const showDeleteConfirm = ref(false);
    const searchTerm = ref('');
    const statusFilter = ref('');
    const selectedWarehouse = ref('');
    const selectedItemForEdit = ref(null);
    const selectedItemForTransfer = ref(null);
    const selectedItemForDispatch = ref(null);
    const itemToDelete = ref(null);
    const deleteLoading = ref(false);
    const imageLoaded = reactive({});
    const searchTimeout = ref(null);
    
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
    
    // Filtered items with photo support
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
          item.supplier?.toLowerCase().includes(term) ||
          item.item_location?.toLowerCase().includes(term)
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
    
    const handleImageError = (event) => {
      const img = event.target;
      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMTZMNC42ODYgMTUuMzE0QzQuODgyIDExLjUwNyA4LjA5MyA5IDEyIDlDMTUuOTA3IDkgMTkuMTE4IDExLjUwNyAxOS4zMTQgMTUuMzE0TDIwIDE2TTggMjFIMTZNNSAxNEgxOU0xMiAxN0MxMiAxNy41NTIyOCAxMS41NTIzIDE4IDExIDE4QzEwLjQ0NzcgMTggMTAgMTcuNTUyMyAxMCAxN0MxMCAxNi40NDc3IDEwLjQ0NzcgMTYgMTEgMTZDMTEuNTUyMyAxNiAxMiAxNi40NDc3IDEyIDE3WiIgc3Ryb2tlPSI2QjcyOEQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
      img.onerror = null; // Prevent infinite loop
    };
    
    // Action Methods
    const updateWarehouseFilter = () => {
      store.dispatch('updateFilters', { warehouse: selectedWarehouse.value });
    };
    
    const updateStatusFilter = () => {
      // Status filter is local to this component
    };
    
    const handleSearch = () => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }
      
      searchTimeout.value = setTimeout(() => {
        store.dispatch('updateFilters', { search: searchTerm.value });
      }, 300);
    };
    
    const refreshData = async () => {
      try {
        loading.value = true;
        searchTerm.value = '';
        statusFilter.value = '';
        selectedWarehouse.value = '';
        error.value = '';
        
        // Clear store filters
        store.dispatch('updateFilters', { search: '', warehouse: '' });
        
        // Refresh subscriptions
        await store.dispatch('subscribeToInventory');
        await store.dispatch('getRecentTransactions');
        
        // Reset image loaded state
        Object.keys(imageLoaded).forEach(key => {
          delete imageLoaded[key];
        });
        
      } catch (err) {
        error.value = 'حدث خطأ في تحديث البيانات: ' + err.message;
      } finally {
        loading.value = false;
      }
    };
    
    const exportInventory = () => {
      try {
        const headers = [
          'الصورة',
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
          item.photo_url || '',
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
    
    const handleDelete = (item) => {
      if (!canDeleteItem(item)) {
        store.dispatch('showNotification', {
          type: 'error',
          message: 'ليس لديك صلاحية الحذف من هذا المخزن'
        });
        return;
      }
      
      if (item.remaining_quantity > 0) {
        const confirmMessage = `هل أنت متأكد من حذف الصنف "${item.name}" (${item.code})؟ 
        
        ⚠️ يوجد ${item.remaining_quantity} قطعة متبقية في المخزون.
        
        سيتم حذف الصنف نهائياً مع جميع سجلاته.`;
        
        if (!confirm(confirmMessage)) {
          return;
        }
      }
      
      itemToDelete.value = item;
      showDeleteConfirm.value = true;
    };
    
    const confirmDelete = async () => {
      try {
        deleteLoading.value = true;
        
        // Import the inventory service
        const { deleteItem } = await import('@/services/inventoryService');
        
        // Call delete from inventory service
        const result = await deleteItem(itemToDelete.value.id, store.state.user?.uid);
        
        if (result.success) {
          store.dispatch('showNotification', {
            type: 'success',
            message: `تم حذف الصنف "${itemToDelete.value.name}" بنجاح`
          });
          
          // Refresh data
          await refreshData();
        } else {
          throw new Error(result.error || 'فشل في حذف الصنف');
        }
      } catch (err) {
        console.error('Error deleting item:', err);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'فشل في حذف الصنف: ' + err.message
        });
      } finally {
        deleteLoading.value = false;
        showDeleteConfirm.value = false;
        itemToDelete.value = null;
      }
    };
    
    const handleItemSaved = () => {
      showAddModal.value = false;
      refreshData();
    };
    
    const handleItemUpdated = () => {
      showEditModal.value = false;
      selectedItemForEdit.value = null;
      refreshData();
    };
    
    const handleTransferSuccess = () => {
      showTransferModal.value = false;
      selectedItemForTransfer.value = null;
      refreshData();
    };
    
    const handleDispatchSuccess = () => {
      showDispatchModal.value = false;
      selectedItemForDispatch.value = null;
      refreshData();
    };
    
    // Lifecycle
    onMounted(() => {
      // Set initial warehouse filter based on user's allowed warehouses
      if (accessibleWarehouses.value.length === 1) {
        selectedWarehouse.value = accessibleWarehouses.value[0].id;
        updateWarehouseFilter();
      }
      
      // Check if we're in add mode from route
      if (route.name === 'AddInventory') {
        showAddModal.value = true;
      }
      
      // Initialize image loaded state
      inventory.value.forEach(item => {
        if (item.photo_url) {
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
    
    // Watch for inventory changes to update image loaded state
    watch(inventory, (newInventory) => {
      newInventory.forEach(item => {
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
    
    return {
      // State
      loading,
      error,
      showAddModal,
      showEditModal,
      showTransferModal,
      showDispatchModal,
      showDeleteConfirm,
      searchTerm,
      statusFilter,
      selectedWarehouse,
      selectedItemForEdit,
      selectedItemForTransfer,
      selectedItemForDispatch,
      itemToDelete,
      deleteLoading,
      imageLoaded,
      
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
      handleImageError,
      
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
      confirmDelete,
      handleItemSaved,
      handleItemUpdated,
      handleTransferSuccess,
      handleDispatchSuccess
    };
  }
};
</script>

<style scoped>
/* Responsive container */
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

/* Main content spacing for mobile navigation */
main {
  padding-top: 4rem; /* 64px for header */
  padding-bottom: 5rem; /* 80px for bottom nav */
}

@media (min-width: 1024px) {
  main {
    padding-top: 0;
    padding-bottom: 0;
  }
}

/* Custom scrollbar for table body */
.table-body {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.table-body::-webkit-scrollbar {
  width: 6px;
}

.table-body::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.dark .table-body::-webkit-scrollbar-track {
  background: rgba(31, 41, 55, 0.5);
}

.table-body::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.dark .table-body::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.5);
}

.table-body::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.8);
}

.dark .table-body::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.8);
}

/* Sticky header */
.sticky {
  position: -webkit-sticky;
  position: sticky;
}

/* Table cell consistency */
.grid > div {
  min-height: 2.5rem;
  display: flex;
  align-items: center;
}

/* Button hover effects */
button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}

/* RTL support */
[dir="rtl"] .space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

/* Dark mode adjustments */
.dark .bg-gray-750 {
  background-color: #2d3748;
}

/* Loading spinner */
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

/* Modal transitions */
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
  
  main {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
}

/* Glass morphism effects */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Gradient backgrounds */
.bg-gradient-to-br {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Mobile touch optimization */
@media (max-width: 640px) {
  .table-body {
    max-height: calc(100vh - 400px);
  }
  
  button, 
  select,
  input {
    min-height: 44px;
  }
}

/* Hover effects */
.hover\:shadow-md:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark .hover\:shadow-md:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Active state for buttons */
.active\:scale-\[0\.98\]:active {
  transform: scale(0.98);
}

/* Image loading animation */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Responsive image container */
.img-container {
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.dark .img-container {
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200% 100%;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Grid columns for responsive layout */
.grid-cols-13 {
  grid-template-columns: repeat(13, minmax(0, 1fr));
}

/* Ensure images maintain aspect ratio */
img {
  max-width: 100%;
  height: auto;
  object-fit: cover;
}

/* Truncate text for long content */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Responsive font sizes for mobile */
@media (max-width: 640px) {
  .text-xs-mobile {
    font-size: 0.75rem;
  }
  
  .text-sm-mobile {
    font-size: 0.875rem;
  }
}
</style>