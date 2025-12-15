<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Main content integrated with app layout -->
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <!-- Page Header -->
      <div class="mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              المخزون
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              إدارة وتتبع جميع الأصناف في النظام
            </p>
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
            <!-- Refresh Button -->
            <button
              @click="refreshData"
              :disabled="loading || refreshing"
              class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
              class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
              v-if="canAddItem && showActions && !readonly"
              @click="showAddModal = true"
              class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-colors duration-200"
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

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow duration-200 cursor-default">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center ml-3">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div class="flex-1 text-right">
              <p class="text-sm text-gray-500 dark:text-gray-400">الأصناف</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatNumber(stats.totalItems) }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow duration-200 cursor-default">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center ml-3">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1 text-right">
              <p class="text-sm text-gray-500 dark:text-gray-400">الكمية</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatNumber(stats.totalQuantity) }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow duration-200 cursor-default">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center ml-3">
              <svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1 text-right">
              <p class="text-sm text-gray-500 dark:text-gray-400">قليلة</p>
              <p class="text-lg font-bold text-red-600 dark:text-red-400">{{ formatNumber(stats.lowStockItems) }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow duration-200 cursor-default">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center ml-3">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div class="flex-1 text-right">
              <p class="text-sm text-gray-500 dark:text-gray-400">الحركات</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatNumber(stats.recentTransactions) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Warehouse Filter -->
          <div v-if="accessibleWarehouses.length > 0">
            <select
              v-model="selectedWarehouse"
              @change="handleFilterChange"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 hover:border-yellow-400 transition-colors duration-200"
            >
              <option value="">جميع المخازن</option>
              <option v-for="warehouse in accessibleWarehouses" :key="warehouse.id" :value="warehouse.id">
                {{ warehouse.name_ar }}
              </option>
            </select>
          </div>
          
          <!-- Status Filter -->
          <div>
            <select
              v-model="statusFilter"
              @change="handleFilterChange"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 hover:border-yellow-400 transition-colors duration-200"
            >
              <option value="">جميع الحالات</option>
              <option value="in_stock">متوفر</option>
              <option value="low_stock">كمية قليلة</option>
              <option value="out_of_stock">غير متوفر</option>
            </select>
          </div>
          
          <!-- Search Input -->
          <div class="md:col-span-2">
            <div class="relative">
              <input
                type="text"
                v-model="searchTerm"
                @input="handleSearch"
                placeholder="ابحث باسم الصنف، الكود، اللون، أو المورد..."
                class="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 hover:border-yellow-400 transition-colors duration-200"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <!-- Live Search Indicator -->
              <div v-if="isLiveSearching" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div class="w-4 h-4 animate-pulse rounded-full bg-blue-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !paginatedItems.length" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mb-4"></div>
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

      <!-- Inventory Table Container -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Desktop Table -->
        <div class="hidden lg:block">
          <div class="overflow-x-auto relative" style="max-height: calc(100vh - 400px);">
            <!-- Table with fixed header -->
            <table class="w-full min-w-[1200px]">
              <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0 z-20">
                <tr>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500">
                    <div class="flex flex-col items-center justify-center">
                      <span>الصورة</span>
                    </div>
                  </th>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500">
                    <div class="flex flex-col items-center justify-center">
                      <span>الاسم والكود</span>
                      <span class="text-xs text-gray-500 dark:text-gray-400 font-normal">(انقر لعرض التفاصيل)</span>
                    </div>
                  </th>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500">
                    <div class="flex flex-col items-center justify-center">
                      <span>اللون</span>
                    </div>
                  </th>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500">
                    <div class="flex flex-col items-center justify-center">
                      <span>المخزن</span>
                    </div>
                  </th>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500">
                    <div class="flex flex-col items-center justify-center">
                      <span>المورد</span>
                    </div>
                  </th>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500">
                    <div class="flex flex-col items-center justify-center">
                      <span>الكميات</span>
                      <span class="text-xs text-gray-500 dark:text-gray-400 font-normal">(كراتين/في الكرتونة/فردي)</span>
                    </div>
                  </th>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500">
                    <div class="flex flex-col items-center justify-center">
                      <span>المتبقي</span>
                      <span class="text-xs text-gray-500 dark:text-gray-400 font-normal">من المجموع المضاف</span>
                    </div>
                  </th>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500">
                    <div class="flex flex-col items-center justify-center">
                      <span>الحالة</span>
                      <span class="text-xs text-gray-500 dark:text-gray-400 font-normal">(متوفر/قليل/نفذ)</span>
                    </div>
                  </th>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500">
                    <div class="flex flex-col items-center justify-center">
                      <span>أنشئ بواسطة</span>
                      <span class="text-xs text-gray-500 dark:text-gray-400 font-normal">آخر تحديث بواسطة</span>
                    </div>
                  </th>
                  <th v-if="showActions && !readonly && userRole !== 'viewer'" 
                      class="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500">
                    <div class="flex flex-col items-center justify-center">
                      <span>الإجراءات</span>
                      <span class="text-xs text-gray-500 dark:text-gray-400 font-normal">(نقل/صرف/تعديل)</span>
                    </div>
                  </th>
                  <th v-else 
                      class="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-yellow-500">
                    <div class="flex flex-col items-center justify-center">
                      <span>آخر تحديث</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-if="paginatedItems.length === 0 && !isLiveSearching">
                  <td :colspan="showActions && !readonly && userRole !== 'viewer' ? 10 : 9" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div class="flex flex-col items-center">
                      <svg class="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
                      </svg>
                      <h3 class="text-lg font-medium mb-2">لا توجد أصناف</h3>
                      <p class="text-sm">{{ searchTerm ? 'لم يتم العثور على أصناف مطابقة للبحث' : 'لم يتم إضافة أي أصناف بعد.' }}</p>
                    </div>
                  </td>
                </tr>
                
                <!-- Live Search Loading -->
                <tr v-if="isLiveSearching && paginatedItems.length === 0">
                  <td :colspan="showActions && !readonly && userRole !== 'viewer' ? 10 : 9" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div class="flex flex-col items-center">
                      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                      <p class="text-gray-600 dark:text-gray-400">جاري البحث عن الأصناف...</p>
                    </div>
                  </td>
                </tr>
                
                <tr 
                  v-for="item in paginatedItems" 
                  :key="item.id"
                  class="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 hover:shadow-sm"
                  :class="{
                    'bg-blue-50/50 dark:bg-blue-900/10': hoveredRow === item.id,
                    'bg-amber-50/30 dark:bg-amber-900/5': isLowStock(item.remaining_quantity),
                    'bg-green-50/30 dark:bg-green-900/5': item.isLiveSearchResult
                  }"
                  @mouseenter="hoveredRow = item.id"
                  @mouseleave="hoveredRow = null"
                >
                  <!-- Photo -->
                  <td class="px-6 py-4">
                    <div class="flex justify-center">
                      <div class="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 group-hover:scale-105 transition-transform duration-200">
                        <img 
                          :src="item.photo_url || getPlaceholderImage()" 
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
                        <!-- Live Search Badge -->
                        <div v-if="item.isLiveSearchResult" class="absolute top-0 right-0">
                          <span class="text-xs bg-blue-500 text-white px-1 py-0.5 rounded-bl">
                            🔍
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Name and Code -->
                  <td class="px-6 py-4">
                    <div class="min-w-0">
                      <div class="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 cursor-pointer hover:underline"
                        @click="showItemDetails(item)">
                        {{ item.name }}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span class="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 transition-colors duration-200">
                          {{ item.code }}
                        </span>
                      </div>
                      <div v-if="item.item_location" class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                        <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span class="truncate group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200">
                          {{ item.item_location }}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Color -->
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-center">
                      <div class="relative group/color">
                        <span class="text-sm text-gray-900 dark:text-white px-2 py-1 rounded bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-200">
                          {{ item.color || '-' }}
                        </span>
                        <div v-if="item.color" class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/color:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                          {{ item.color }}
                          <div class="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Warehouse -->
                  <td class="px-6 py-4">
                    <div class="text-center">
                      <span class="text-sm text-gray-900 dark:text-white px-2 py-1 rounded bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-200">
                        {{ getWarehouseLabel(item.warehouse_id) }}
                      </span>
                    </div>
                  </td>
                  
                  <!-- Supplier -->
                  <td class="px-6 py-4">
                    <div class="relative group/supplier">
                      <span class="text-sm text-gray-900 dark:text-white truncate block max-w-[150px] mx-auto px-2 py-1 rounded bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-200">
                        {{ item.supplier || '-' }}
                      </span>
                      <div v-if="item.supplier" class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/supplier:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30 max-w-xs">
                        {{ item.supplier }}
                        <div class="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Quantities -->
                  <td class="px-6 py-4">
                    <div class="text-sm space-y-1 max-w-[150px] mx-auto">
                      <div class="flex items-center justify-between px-2 py-1 rounded bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-200">
                        <span class="text-gray-500 dark:text-gray-400 text-xs">كراتين:</span>
                        <span class="text-gray-900 dark:text-white font-medium">{{ item.cartons_count || 0 }}</span>
                      </div>
                      <div class="flex items-center justify-between px-2 py-1 rounded bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-200">
                        <span class="text-gray-500 dark:text-gray-400 text-xs">في الكرتونة:</span>
                        <span class="text-gray-900 dark:text-white font-medium">{{ item.per_carton_count || 0 }}</span>
                      </div>
                      <div class="flex items-center justify-between px-2 py-1 rounded bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-200">
                        <span class="text-gray-500 dark:text-gray-400 text-xs">فردي:</span>
                        <span class="text-gray-900 dark:text-white font-medium">{{ item.single_bottles_count || 0 }}</span>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Remaining Quantity -->
                  <td class="px-6 py-4">
                    <div class="text-center">
                      <div :class="getQuantityClass(item.remaining_quantity)" 
                           class="text-lg font-bold px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:scale-105 transition-all duration-200">
                        {{ item.remaining_quantity }}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2 py-1 rounded bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-200">
                        من {{ item.total_added }}
                      </div>
                    </div>
                  </td>
                  
                  <!-- Status -->
                  <td class="px-6 py-4">
                    <div class="flex justify-center">
                      <span :class="getStockStatusClass(item.remaining_quantity)" 
                            class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold group-hover:scale-105 transition-transform duration-200 shadow-sm">
                        {{ getStockStatus(item.remaining_quantity) }}
                      </span>
                    </div>
                  </td>
                  
                  <!-- Created By / Updated By -->
                  <td class="px-6 py-4">
                    <div class="text-center space-y-1">
                      <div class="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 rounded bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-200">
                        <span class="block truncate" title="أنشئ بواسطة: {{ item.created_by || 'غير معروف' }}">
                          أنشئ: {{ getShortName(item.created_by) || 'غير معروف' }}
                        </span>
                      </div>
                      <div v-if="item.updated_by && item.updated_by !== item.created_by" 
                           class="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 rounded bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-200">
                        <span class="block truncate" title="آخر تحديث بواسطة: {{ item.updated_by }}">
                          عدل: {{ getShortName(item.updated_by) }}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Actions or Updated Date -->
                  <td class="px-6 py-4">
                    <div v-if="showActions && !readonly && userRole !== 'viewer'" class="flex items-center justify-center gap-2">
                      <button
                        @click="handleTransfer(item)"
                        v-if="canTransferItem(item)"
                        class="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/20 hover:scale-110 transition-all duration-200 group/transfer"
                        title="نقل بين المخازن"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                        </svg>
                        <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/transfer:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                          نقل
                          <div class="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </button>
                      
                      <button
                        @click="handleDispatch(item)"
                        v-if="canDispatchItem(item)"
                        class="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/20 hover:scale-110 transition-all duration-200 group/dispatch"
                        title="صرف إلى خارجي"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                        <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/dispatch:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                          صرف
                          <div class="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </button>
                      
                      <button
                        v-if="canEditItem(item)"
                        @click="handleEdit(item)"
                        class="p-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-300 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-800/20 hover:scale-110 transition-all duration-200 group/edit"
                        title="تعديل الصنف"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/edit:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                          تعديل
                          <div class="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </button>
                    </div>
                    <div v-else class="text-center">
                      <span class="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 rounded bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-200">
                        {{ formatDate(item.updated_at) }}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Desktop Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky bottom-0 z-10">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              عرض {{ startIndex + 1 }} - {{ Math.min(endIndex, filteredItems.length) }} من {{ filteredItems.length }}
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-yellow-500 transition-colors duration-200"
              >
                السابق
              </button>
              <div class="flex items-center gap-1">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    'w-10 h-10 rounded-lg transition-all duration-200 text-sm font-medium',
                    currentPage === page 
                      ? 'bg-yellow-600 text-white border border-yellow-600 shadow-sm hover:shadow' 
                      : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-yellow-400'
                  ]"
                >
                  {{ page }}
                </button>
              </div>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-yellow-500 transition-colors duration-200"
              >
                التالي
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Cards -->
        <div class="lg:hidden">
          <div v-if="paginatedItems.length === 0 && !isLiveSearching" class="p-6 text-center text-gray-500 dark:text-gray-400">
            <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
            </svg>
            <h3 class="text-lg font-medium mb-2">لا توجد أصناف</h3>
            <p class="text-sm">{{ searchTerm ? 'لم يتم العثور على أصناف مطابقة للبحث' : 'لم يتم إضافة أي أصناف بعد.' }}</p>
          </div>
          
          <div v-if="isLiveSearching && paginatedItems.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p class="text-gray-600 dark:text-gray-400">جاري البحث عن الأصناف...</p>
          </div>
          
          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <div 
              v-for="item in paginatedItems" 
              :key="item.id"
              class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
              :class="{
                'bg-green-50/30 dark:bg-green-900/5': item.isLiveSearchResult
              }"
            >
              <div class="flex gap-4 mb-3">
                <!-- Photo -->
                <div class="flex-shrink-0">
                  <div class="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <img 
                      :src="item.photo_url || getPlaceholderImage()" 
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
                    <!-- Live Search Badge -->
                    <div v-if="item.isLiveSearchResult" class="absolute top-0 right-0">
                      <span class="text-xs bg-blue-500 text-white px-1 py-0.5 rounded-bl">
                        🔍
                      </span>
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
                  
                  <!-- Created By Info -->
                  <div class="mb-2">
                    <div class="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      <span class="truncate" title="أنشئ بواسطة: {{ item.created_by || 'غير معروف' }}">
                        {{ getShortName(item.created_by) || 'غير معروف' }}
                      </span>
                    </div>
                    <div v-if="item.updated_by && item.updated_by !== item.created_by" 
                         class="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                      <span class="truncate" title="آخر تحديث بواسطة: {{ item.updated_by }}">
                        {{ getShortName(item.updated_by) }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="space-y-1 text-xs text-gray-600 dark:text-gray-400">
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
                <div class="grid grid-cols-3 gap-2">
                  <button 
                    v-if="canEditItem(item)"
                    @click="handleEdit(item)"
                    class="flex items-center justify-center gap-1 px-2 py-2.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-xs font-medium rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-800/20 active:scale-95 transition-all duration-200"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    <span class="hidden xs:inline">تعديل</span>
                  </button>
                  
                  <button 
                    @click="handleTransfer(item)"
                    v-if="canTransferItem(item)"
                    class="flex items-center justify-center gap-1 px-2 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/20 active:scale-95 transition-all duration-200"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                    </svg>
                    <span class="hidden xs:inline">نقل</span>
                  </button>
                  
                  <button 
                    @click="handleDispatch(item)"
                    v-if="canDispatchItem(item)"
                    class="flex items-center justify-center gap-1 px-2 py-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/20 active:scale-95 transition-all duration-200"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    <span class="hidden xs:inline">صرف</span>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Mobile Pagination -->
            <div v-if="totalPages > 1" class="p-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm active:scale-95 transition-transform duration-200"
              >
                السابق
              </button>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ currentPage }} / {{ totalPages }}
              </span>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm active:scale-95 transition-transform duration-200"
              >
                التالي
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Button -->
    <button 
      v-if="canAddItem && showActions && !readonly"
      @click="showAddModal = true"
      class="fixed bottom-6 left-6 z-40 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-purple-600 hover:scale-110 active:scale-95 transition-all duration-200 lg:hidden"
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
          class="absolute top-4 left-4 z-10 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-110 active:scale-95 transition-all duration-200"
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
                    class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-md">
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
                  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">المخزن</p>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ getWarehouseLabel(selectedItem?.warehouse_id) }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
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
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">المورد</p>
                  <p class="text-gray-900 dark:text-white font-medium">{{ selectedItem?.supplier || 'غير محدد' }}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">مكان التخزين</p>
                  <p class="text-gray-900 dark:text-white font-medium">{{ selectedItem?.item_location || 'غير محدد' }}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">الكراتين</p>
                  <p class="text-gray-900 dark:text-white font-medium">{{ selectedItem?.cartons_count || 0 }}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">في الكرتونة</p>
                  <p class="text-gray-900 dark:text-white font-medium">{{ selectedItem?.per_carton_count || 0 }}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">الفردي</p>
                  <p class="text-gray-900 dark:text-white font-medium">{{ selectedItem?.single_bottles_count || 0 }}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">المجموع المضاف</p>
                  <p class="text-gray-900 dark:text-white font-medium">{{ selectedItem?.total_added || 0 }}</p>
                </div>
              </div>

              <!-- User Action History -->
              <div class="space-y-4">
                <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200">
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">أنشئ بواسطة</p>
                        <p class="text-gray-900 dark:text-white font-medium">{{ selectedItem?.created_by || currentUserInfo }}</p>
                      </div>
                      <div class="text-right">
                        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">تاريخ الإنشاء</p>
                        <p class="text-gray-900 dark:text-white font-medium">{{ formatDate(selectedItem?.created_at) }}</p>
                      </div>
                    </div>
                    
                    <div v-if="selectedItem?.updated_by" class="flex items-center justify-between border-t border-blue-100 dark:border-blue-800 pt-3">
                      <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">آخر تحديث بواسطة</p>
                        <p class="text-gray-900 dark:text-white font-medium">{{ selectedItem?.updated_by }}</p>
                      </div>
                      <div class="text-right">
                        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">تاريخ التحديث</p>
                        <p class="text-gray-900 dark:text-white font-medium">{{ formatDate(selectedItem?.updated_at) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div v-if="showActions" class="grid grid-cols-2 gap-3">
                <button 
                  v-if="canEditItem(selectedItem)"
                  @click="handleEdit(selectedItem)"
                  class="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  تعديل
                </button>

                <button 
                  v-if="canTransferItem(selectedItem)"
                  @click="handleTransfer(selectedItem)"
                  class="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                  </svg>
                  نقل
                </button>

                <button 
                  v-if="canDispatchItem(selectedItem)"
                  @click="handleDispatch(selectedItem)"
                  class="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  صرف
                </button>

                <button 
                  v-if="canDeleteItem(selectedItem)"
                  @click="handleDelete(selectedItem)"
                  class="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium hover:scale-105 active:scale-95 transition-all duration-200"
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
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click.self="showDeleteConfirm = false"></div>
      
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
                <p>أنشئ بواسطة: {{ itemToDelete?.created_by || currentUserInfo }}</p>
                <p v-if="itemToDelete?.updated_by && itemToDelete?.updated_by !== itemToDelete?.created_by">
                  آخر تحديث بواسطة: {{ itemToDelete?.updated_by }}
                </p>
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
              class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <svg v-if="deleteLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <span>{{ deleteLoading ? 'جاري الحذف...' : 'نعم، احذف' }}</span>
            </button>
            <button
              @click="showDeleteConfirm = false"
              :disabled="deleteLoading"
              class="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2.5 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all duration-200"
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
import { ref, computed, onMounted, watch, reactive, onUnmounted } from 'vue';
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
    const performanceMonitor = new PerformanceMonitor();
    
    // State
    const loading = ref(false);
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
    const deleteLoading = ref(false);
    const imageLoaded = reactive({});
    const searchTimeout = ref(null);
    const exporting = ref(false);
    const currentPage = ref(1);
    const itemsPerPage = ref(30);
    const lastRefreshTime = ref(null);
    const isCachedData = ref(false);
    const performanceStats = ref(null);
    const hoveredRow = ref(null);
    const userNamesCache = reactive({});
    const isLiveSearching = ref(false);
    const liveSearchResults = reactive([]);
    const liveSearchTimeout = ref(null);
    const refreshing = ref(false);
    
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
    const stats = computed(() => store.getters.dashboardStats || {});
    const operationLoading = computed(() => store.state.operationLoading);
    const operationError = computed(() => store.state.operationError);
    const accessibleWarehouses = computed(() => store.getters.accessibleWarehouses || []);
    const allWarehouses = computed(() => store.state.warehouses || []);
    const currentUser = computed(() => store.state.user);
    
    // Current user info
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
    
    // Combined inventory (local + live search results)
    const combinedInventory = computed(() => {
      const combined = [...inventory.value];
      
      // Add live search results that aren't already in local inventory
      liveSearchResults.forEach(liveItem => {
        if (!combined.some(item => item.id === liveItem.id)) {
          // Mark as live search result for styling
          combined.push({
            ...liveItem,
            isLiveSearchResult: true
          });
        }
      });
      
      return combined;
    });
    
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
              console.log('✅ Loaded inventory from cache');
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
        console.warn('❌ Error loading from cache:', error);
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
        console.warn('❌ Error saving to cache:', error);
      }
    };
    
    // Perform live search from Firestore
    const performLiveSearch = async (searchTermValue) => {
      if (!searchTermValue || searchTermValue.trim().length < 2) {
        liveSearchResults.length = 0; // Clear results
        isLiveSearching.value = false;
        return;
      }
      
      isLiveSearching.value = true;
      
      try {
        console.log('🔍 Performing live search for:', searchTermValue);
        
        // Use the store action to search Firestore directly
        const searchResults = await store.dispatch('searchItems', {
          searchTerm: searchTermValue,
          limitResults: 50
        });
        
        console.log('✅ Live search results:', searchResults.length, 'items');
        
        // Update live search results
        liveSearchResults.length = 0; // Clear previous results
        searchResults.forEach(item => {
          liveSearchResults.push(item);
        });
        
      } catch (error) {
        console.error('❌ Error in live search:', error);
        store.dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في البحث عن الأصناف'
        });
      } finally {
        isLiveSearching.value = false;
      }
    };
    
    // Debounced live search
    const debouncedLiveSearch = debounce((term) => {
      performLiveSearch(term);
    }, 500);
    
    // Filtered items with memoization
    const filteredItems = computed(() => {
      let filtered = [...combinedInventory.value];
      
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
      
      // Sort by name
      return filtered.sort((a, b) => {
        const nameA = a.name?.toLowerCase() || '';
        const nameB = b.name?.toLowerCase() || '';
        return nameA.localeCompare(nameB, 'ar');
      });
    });
    
    // Check if item is low stock
    const isLowStock = (quantity) => {
      return quantity > 0 && quantity < 10;
    };
    
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
    const formatNumber = (num) => {
      return new Intl.NumberFormat('ar-EG').format(num || 0);
    };
    
    const getWarehouseLabel = (warehouseId) => {
      const warehouse = allWarehouses.value.find(w => w.id === warehouseId);
      return warehouse ? warehouse.name_ar : warehouseId;
    };
    
    const getStockStatus = (quantity) => {
      if (quantity === 0) return 'نفذ';
      if (quantity < 10) return 'قليل';
      return 'متوفر';
    };
    
    const getStockStatusClass = (quantity) => {
      if (quantity === 0) return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800 shadow-sm';
      if (quantity < 10) return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-800 shadow-sm';
      return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800 shadow-sm';
    };

    const getQuantityClass = (quantity) => {
      if (quantity === 0) return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10';
      if (quantity < 10) return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/10';
      return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10';
    };
    
    const getColorHex = (colorName) => {
      return colorMap[colorName] || '#6b7280';
    };
    
    const getShortName = (fullName) => {
      if (!fullName) return '';
      // Take first 15 characters
      if (fullName.length > 15) {
        return fullName.substring(0, 15) + '...';
      }
      return fullName;
    };
    
    const formatDate = (date) => {
      if (!date) return '-';
      try {
        const dateObj = date.toDate ? date.toDate() : new Date(date);
        if (isNaN(dateObj.getTime())) return '-';
        
        return dateObj.toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
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
    
    const getPlaceholderImage = () => {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMTZMNC42ODYgMTUuMzE0QzQuODgyIDExLjUwNyA4LjA5MyA5IDEyIDlDMTUuOTA3IDkgMTkuMTE4IDExLjUwNyAxOS4zMTQgMTUuMzE0TDIwIDE2TTggMjFIMTZNNSAxNEgxOU0xMiAxN0MxMiAxNy41NTIyOCAxMS41NTIzIDE4IDExIDE4QzEwLjQ0NzcgMTggMTAgMTcuNTUyMyAxMCAxN0MxMCAxNi40NDc3IDEwLjQ0NzcgMTYgMTEgMTZDMTEuNTUyMyAxNiAxMiAxNi40NDc3IDEyIDE3WiIgc3Ryb2tlPSI2QjcyOEQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
    };
    
    const handleImageError = (event) => {
      event.target.src = getPlaceholderImage();
      event.target.onerror = null;
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
      
      return currentUserInfo.value;
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
    
    const handleSearch = () => {
      currentPage.value = 1;
      
      // Clear any existing timeout
      if (liveSearchTimeout.value) {
        clearTimeout(liveSearchTimeout.value);
      }
      
      // Debounce the live search
      liveSearchTimeout.value = setTimeout(() => {
        if (searchTerm.value && searchTerm.value.trim().length >= 2) {
          debouncedLiveSearch(searchTerm.value.trim());
        } else {
          // Clear live search results if search term is too short
          liveSearchResults.length = 0;
          isLiveSearching.value = false;
        }
      }, 300);
    };
    
    const updateWarehouseFilter = () => {
      store.dispatch('updateFilters', { warehouse: selectedWarehouse.value });
      currentPage.value = 1;
    };
    
    const updateStatusFilter = () => {
      currentPage.value = 1;
    };
    
    const showItemDetails = (item) => {
      selectedItem.value = item;
      showDetailsModal.value = true;
      hoveredRow.value = null;
    };
    
    const closeDetailsModal = () => {
      showDetailsModal.value = false;
      selectedItem.value = null;
    };
    
    const refreshData = async () => {
      try {
        performanceMonitor.start();
        refreshing.value = true;
        
        // Clear error
        error.value = '';
        
        console.log('🔄 Starting data refresh...');
        
        // Refresh inventory using the new one-time fetch
        await store.dispatch('refreshInventory');
        
        // Load warehouses if not already loaded
        if (!allWarehouses.value.length) {
          await store.dispatch('loadWarehouses');
        }
        
        // Load recent transactions
        await store.dispatch('getRecentTransactions');
        
        // Save to cache
        saveToCache(LOCAL_STORAGE_KEYS.INVENTORY, store.state.inventory);
        saveToCache(LOCAL_STORAGE_KEYS.WAREHOUSES, store.state.warehouses);
        localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_REFRESH, Date.now().toString());
        
        lastRefreshTime.value = Date.now();
        isCachedData.value = false;
        
        console.log('✅ Data refreshed successfully');
        
        store.dispatch('showNotification', {
          type: 'success',
          message: 'تم تحديث البيانات بنجاح'
        });
        
        measurePerformance();
        
      } catch (err) {
        console.error('❌ Error refreshing data:', err);
        error.value = 'حدث خطأ في تحديث البيانات: ' + (err.message || 'خطأ غير معروف');
        
        store.dispatch('showNotification', {
          type: 'error',
          message: 'فشل في تحديث البيانات'
        });
      } finally {
        refreshing.value = false;
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
          'تاريخ التحديث',
          'أنشئ بواسطة',
          'آخر تحديث بواسطة'
        ];
        
        const csvData = data.map(item => [
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
          formatDate(item.updated_at),
          item.created_by || currentUserInfo.value,
          item.updated_by || ''
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
        error.value = 'فشل في تصدير الملف: ' + err.message;
        
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
      hoveredRow.value = null;
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
      hoveredRow.value = null;
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
      hoveredRow.value = null;
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
      hoveredRow.value = null;
    };
    
    const confirmDelete = async () => {
      try {
        deleteLoading.value = true;
        
        await store.dispatch('deleteItem', {
          itemId: itemToDelete.value.id,
          itemName: itemToDelete.value.name
        });
        
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم حذف الصنف "${itemToDelete.value.name}" بنجاح`
        });
        
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
    
    const handleItemSaved = async () => {
      showAddModal.value = false;
      
      // Refresh data to show the new item
      await refreshData();
      
      store.dispatch('showNotification', {
        type: 'success',
        message: 'تم إضافة/تحديث الصنف بنجاح!'
      });
    };
    
    const closeAddModal = () => {
      showAddModal.value = false;
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
    
    // Cleanup images from memory when component unmounts
    const cleanupImages = () => {
      Object.keys(imageLoaded).forEach(key => {
        delete imageLoaded[key];
      });
    };
    
    // Lifecycle
    onMounted(() => {
      performanceMonitor.start();
      
      // Load from cache first
      loadFromCache();
      
      if (accessibleWarehouses.value.length === 1) {
        selectedWarehouse.value = accessibleWarehouses.value[0].id;
        updateWarehouseFilter();
      }
      
      if (route.name === 'AddInventory') {
        showAddModal.value = true;
      }
      
      // Load fresh data if cache is old or doesn't exist
      if (!isCachedData.value || !store.state.inventory.length) {
        (async () => {
          try {
            loading.value = true;
            loadingProgress.value = 'جاري تحميل البيانات...';
            
            console.log('📥 Loading fresh inventory data...');
            
            // Use fetchInventoryOnce for initial load
            await store.dispatch('fetchInventoryOnce');
            
            // Load warehouses if not loaded
            if (!allWarehouses.value.length) {
              await store.dispatch('loadWarehouses');
            }
            
            // Load recent transactions
            await store.dispatch('getRecentTransactions');
            
            // Save to cache
            saveToCache(LOCAL_STORAGE_KEYS.INVENTORY, store.state.inventory);
            saveToCache(LOCAL_STORAGE_KEYS.WAREHOUSES, store.state.warehouses);
            localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_REFRESH, Date.now().toString());
            
            lastRefreshTime.value = Date.now();
            isCachedData.value = false;
            
            console.log('✅ Initial data loaded successfully');
            
          } catch (err) {
            console.error('❌ Error loading data:', err);
            error.value = 'حدث خطأ في تحميل البيانات';
          } finally {
            loading.value = false;
            loadingProgress.value = '';
          }
        })();
      }
      
      measurePerformance();
      
      // Pre-load images for visible items only
      const preloadImages = () => {
        paginatedItems.value.forEach(item => {
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
      
      // Initial preload
      preloadImages();
    });
    
    // Clean up on unmount
    onUnmounted(() => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }
      if (liveSearchTimeout.value) {
        clearTimeout(liveSearchTimeout.value);
      }
      cleanupImages();
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
    
    // Optimized watch for paginated items changes
    watch(paginatedItems, (newItems) => {
      // Preload images for new items
      newItems.forEach(item => {
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
    });
    
    // Watch for filter changes to reset page
    watch(() => [searchTerm.value, statusFilter.value, selectedWarehouse.value], () => {
      currentPage.value = 1;
    });
    
    // Watch for search term changes to trigger live search
    watch(searchTerm, (newValue) => {
      if (newValue && newValue.trim().length >= 2) {
        // Clear any existing timeout
        if (liveSearchTimeout.value) {
          clearTimeout(liveSearchTimeout.value);
        }
        
        // Set a new timeout for live search
        liveSearchTimeout.value = setTimeout(() => {
          performLiveSearch(newValue.trim());
        }, 500);
      } else {
        // Clear live search results if search term is too short
        liveSearchResults.length = 0;
        isLiveSearching.value = false;
      }
    });
    
    return {
      // State
      loading,
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
      deleteLoading,
      imageLoaded,
      exporting,
      currentPage,
      lastRefreshTime,
      isCachedData,
      performanceStats,
      hoveredRow,
      isLiveSearching,
      refreshing,
      
      // Computed
      userRole,
      userProfile,
      inventory: combinedInventory,
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
      paginatedItems,
      totalPages,
      startIndex,
      endIndex,
      visiblePages,
      currentUserInfo,
      
      // Helper Methods
      formatNumber,
      getWarehouseLabel,
      getStockStatus,
      getStockStatusClass,
      getQuantityClass,
      getColorHex,
      getShortName,
      formatDate,
      formatRelativeTime,
      formatTimeAgo,
      getPlaceholderImage,
      getLastActionUser,
      handleImageError,
      isLowStock,
      
      // Permission Methods
      canEditItem,
      canTransferItem,
      canDispatchItem,
      canDeleteItem,
      
      // Action Methods
      handleFilterChange,
      handleSearch,
      updateWarehouseFilter,
      updateStatusFilter,
      showItemDetails,
      closeDetailsModal,
      refreshData,
      exportInventory,
      handleTransfer,
      handleDispatch,
      handleEdit,
      handleDelete,
      confirmDelete,
      handleItemSaved,
      closeAddModal,
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
/* Enhanced table styling */
table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}

/* Fixed header with enhanced styling */
thead {
  position: sticky;
  top: 0;
  z-index: 20;
  background-color: #f9fafb;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.dark thead {
  background-color: rgba(55, 65, 81, 0.95);
}

/* Enhanced hover effects */
.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.dark .hover\:bg-gray-700\/50:hover {
  background-color: rgba(55, 65, 81, 0.5);
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Enhanced scrollbar styling */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.overflow-x-auto::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark .overflow-x-auto::-webkit-scrollbar-track {
  background: #374151;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Enhanced table cell styling */
td, th {
  padding: 1rem 1.5rem;
}

th {
  font-weight: 600;
  letter-spacing: 0.025em;
}

/* Center alignment for table headers */
th div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Enhanced focus styles */
.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.5);
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-yellow-500:focus {
  --tw-ring-color: rgba(245, 158, 11, 0.5);
}

.focus\:border-yellow-500:focus {
  border-color: #f59e0b;
}

/* Enhanced button hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

.hover\:scale-110:hover {
  transform: scale(1.1);
}

.active\:scale-95:active {
  transform: scale(0.95);
}

/* Enhanced tooltip styling */
[class*="group-hover/"] .opacity-0 {
  transition: opacity 0.2s ease-in-out;
}

[class*="group-hover/"]:hover .opacity-100 {
  opacity: 1;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  button {
    min-height: 44px;
  }
  
  input, 
  select {
    font-size: 16px;
  }
  
  /* Better mobile card spacing */
  .p-4 {
    padding: 1rem;
  }
  
  /* Enhanced mobile button grid */
  .grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  
  /* Hide text on very small screens, show only icons */
  @media (max-width: 400px) {
    .hidden.xs\:inline {
      display: none;
    }
    
    .grid-cols-3 button {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }
  }
}

/* Fix iOS Safari input zoom */
@media screen and (max-width: 768px) {
  input, select, textarea {
    font-size: 16px;
  }
}

/* Animation optimizations */
.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .transition-all,
  .transition-colors,
  .animate-spin,
  .animate-pulse,
  .hover\:scale-105,
  .hover\:scale-110,
  .active\:scale-95 {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    transform: none !important;
  }
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  .bg-white,
  .bg-gray-50 {
    background-color: white !important;
  }
  
  .text-gray-900,
  .text-gray-700 {
    color: black !important;
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
}

/* Performance optimizations */
.will-change-transform {
  will-change: transform;
}

/* Content visibility for offscreen elements */
.offscreen-content {
  content-visibility: auto;
  contain-intrinsic-size: 1px 5000px;
}

/* Ensure table rows have proper height */
tr {
  min-height: 64px;
}

/* Fix modal z-index conflicts */
.fixed {
  isolation: isolate;
}

/* Enhanced border styling */
.border-b-2 {
  border-bottom-width: 2px;
}

/* Enhanced shadow effects */
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.hover\:shadow:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Text truncation for long content */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* RTL text alignment fix */
.text-center {
  text-align: center;
}

/* Enhanced image rendering */
img {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

/* Touch feedback for mobile */
@media (hover: none) and (pointer: coarse) {
  button:active {
    opacity: 0.7;
  }
  
  .hover\:scale-105,
  .hover\:scale-110 {
    transition: none;
  }
}

/* Fixed header enhancement for sticky scrolling */
.sticky {
  position: sticky;
  z-index: 10;
}

/* Ensure proper stacking context */
.relative {
  position: relative;
}

/* Enhanced backdrop blur for fixed elements */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Improved contrast for better readability */
.dark .text-gray-300 {
  color: #d1d5db;
}

.dark .text-gray-400 {
  color: #9ca3af;
}

/* Enhanced disabled state */
.disabled\:opacity-50:disabled {
  opacity: 0.5;
}

.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}

/* Grid improvements for responsive design */
.grid {
  display: grid;
}

/* Flex improvements */
.flex {
  display: flex;
}

/* Ensure proper overflow handling */
.overflow-hidden {
  overflow: hidden;
}

.overflow-y-auto {
  overflow-y: auto;
}

/* Enhanced border radius */
.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-xl {
  border-radius: 0.75rem;
}

/* Improved color transitions for dark mode */
.dark .bg-gray-800 {
  background-color: #1f2937;
}

.dark .border-gray-700 {
  border-color: #374151;
}

/* Gradient backgrounds */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Enhanced shadow depth */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Improved focus outline for accessibility */
:focus-visible {
  outline: 2px solid #f59e0b;
  outline-offset: 2px;
}

/* Smooth scrolling for the table container */
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}

/* Ensure proper text wrapping */
.whitespace-nowrap {
  white-space: nowrap;
}

/* Enhanced hover border effects */
.hover\:border-yellow-400:hover {
  border-color: #fbbf24;
}

.hover\:border-yellow-500:hover {
  border-color: #f59e0b;
}

/* Additional hover effects for better UX */
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Improved button active states */
button:active {
  transform: scale(0.98);
}

/* Enhanced table row hover effects */
tr:hover td {
  transition: all 0.2s ease;
}

/* Better spacing for table cells */
td:first-child,
th:first-child {
  padding-left: 1.5rem;
}

td:last-child,
th:last-child {
  padding-right: 1.5rem;
}

/* Improved modal scrolling */
.max-h-\[90vh\] {
  max-height: 90vh;
}

/* Better text contrast in dark mode */
.dark .text-white {
  color: #ffffff;
}

.dark .text-gray-100 {
  color: #f3f4f6;
}

/* Enhanced group hover effects */
.group:hover .group-hover\:bg-blue-100 {
  background-color: #dbeafe;
}

.dark .group:hover .group-hover\:bg-blue-900\/20 {
  background-color: rgba(30, 64, 175, 0.2);
}

/* Improved transition timing */
.duration-200 {
  transition-duration: 200ms;
}

.duration-150 {
  transition-duration: 150ms;
}
</style>
