<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl rtl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="sticky top-0 bg-white dark:bg-gray-800 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">صرف أصناف للفروع</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">اختر الصنف من القائمة وأدخل كمية الصرف</p>
          </div>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
        <!-- Superadmin Badge -->
        <div v-if="isSuperadmin" class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-purple-400 dark:text-purple-300 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
            </svg>
            <div class="flex-1">
              <p class="text-sm font-medium text-purple-800 dark:text-purple-300">
                وضع المشرف العام - لديك صلاحية كاملة على النظام
              </p>
            </div>
          </div>
        </div>

        <!-- Access Control Warning (for non-superadmin users) -->
        <div v-if="!isSuperadmin && !canPerformDispatch" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-yellow-400 dark:text-yellow-300 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div class="flex-1">
              <p class="text-sm text-yellow-800 dark:text-yellow-300">
                يمكنك فقط عرض البيانات. لصرف الأصناف يجب أن تكون مشرف عام أو مدير مخازن مع صلاحية الصرف.
              </p>
            </div>
          </div>
        </div>

        <!-- Step 1: Warehouse Selection -->
        <div>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <span class="h-6 w-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-xs ml-2">1</span>
            اختر المخزن المصدر
          </h4>
          <select
            v-model="form.sourceWarehouse"
            required
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            @change="onWarehouseChange"
            :disabled="loading || (!isSuperadmin && !canViewDispatch)"
          >
            <option value="" class="text-gray-500 dark:text-gray-400">اختر المخزن المصدر</option>
            <option 
              v-for="warehouse in accessibleSourceWarehouses" 
              :key="warehouse.id" 
              :value="warehouse.id"
              :disabled="!isWarehouseAccessible(warehouse.id)"
              class="text-gray-900 dark:text-white"
            >
              {{ warehouse.name_ar }}
              <span v-if="warehouse.is_main" class="text-yellow-600 dark:text-yellow-400 text-xs mr-1">⭐</span>
              <span v-if="!isWarehouseAccessible(warehouse.id) && !isSuperadmin" class="text-red-500 dark:text-red-400 text-xs">
                (غير مسموح)
              </span>
            </option>
          </select>
          
          <!-- Warehouse Info -->
          <div v-if="form.sourceWarehouse" class="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span>المخزن: {{ getWarehouseName(form.sourceWarehouse) }}</span>
            <span v-if="getWarehouseType(form.sourceWarehouse)" class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
              {{ getWarehouseType(form.sourceWarehouse) }}
            </span>
          </div>
          
          <!-- Warehouse Access Indicator (not for superadmin) -->
          <div v-if="form.sourceWarehouse && userProfile?.role === 'warehouse_manager' && !isSuperadmin" class="mt-2">
            <div v-if="hasAccessToSelectedWarehouse" class="text-xs px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full inline-flex items-center">
              <svg class="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              لديك صلاحية الصرف من هذا المخزن
            </div>
            <div v-else class="text-xs px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 rounded-full inline-flex items-center">
              <svg class="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              ليس لديك صلاحية الصرف من هذا المخزن
            </div>
          </div>
          
          <!-- Superadmin Access Indicator -->
          <div v-if="form.sourceWarehouse && isSuperadmin" class="mt-2">
            <div class="text-xs px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 rounded-full inline-flex items-center">
              <svg class="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
              </svg>
              وصول كامل كمشرف عام
            </div>
          </div>
        </div>

        <!-- Step 2: Destination Selection -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <span class="h-6 w-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-xs ml-2">2</span>
              اختر الوجهة
            </h4>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ dispatchDestinations.length }} موقع صرف
            </div>
          </div>
          
          <div v-if="dispatchDestinations.length > 0" class="grid grid-cols-2 gap-2">
            <button
              v-for="destination in dispatchDestinations"
              :key="destination.id"
              @click="form.destinationBranch = destination.id"
              :disabled="loading || (!isSuperadmin && !canViewDispatch)"
              :class="[
                'p-3 border rounded-lg text-sm transition-all duration-200 flex items-center justify-center',
                form.destinationBranch === destination.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              ]"
            >
              <span class="ml-2">{{ destination.icon }}</span>
              {{ destination.name_ar }}
            </button>
          </div>
          
          <!-- Empty state for destinations -->
          <div v-else class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
            <svg class="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3">لا توجد مواقع صرف</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              لم يتم إضافة مواقع صرف بعد. يرجى إضافة مواقع صرف من صفحة إدارة المخازن.
            </p>
          </div>
          
          <!-- Selected Destination Info -->
          <div v-if="form.destinationBranch" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span class="font-medium">الوجهة المحددة:</span> {{ getDestinationName(form.destinationBranch) }}
          </div>
        </div>

        <!-- Step 3: Item Selection -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <span class="h-6 w-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-xs ml-2">3</span>
              اختر الصنف المراد صرفه
            </h4>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ searchResults.length }} صنف متاح
              <span v-if="lastSearchStats" class="mr-2">
                (وجد {{ lastSearchStats.total }} في {{ lastSearchStats.duration }} مللي ثانية)
              </span>
            </div>
          </div>

          <!-- Search Input -->
          <div class="relative mb-4">
            <input
              v-model="searchTerm"
              @input="handleSearch"
              type="text"
              placeholder="ابحث عن صنف بالاسم، الكود، اللون، المورد، أو المكان..."
              class="w-full pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              :disabled="loading || !form.sourceWarehouse || (!isSuperadmin && !canViewDispatch)"
            >
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 1114 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <!-- Loading Indicator -->
            <div v-if="isSearching" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div class="w-4 h-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
            <!-- Clear Search Button -->
            <button 
              v-if="searchTerm" 
              @click="clearSearch"
              class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Items Table -->
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <!-- Table Header -->
            <div class="grid grid-cols-12 bg-gray-50 dark:bg-gray-900 text-xs font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <div class="col-span-5 p-3">الصنف</div>
              <div class="col-span-2 p-3 text-center">الكود</div>
              <div class="col-span-2 p-3 text-center">المتاح</div>
              <div class="col-span-3 p-3 text-center">الإجراء</div>
            </div>

            <!-- Table Body -->
            <div class="max-h-60 overflow-y-auto">
              <div
                v-for="item in searchResults"
                :key="item.id"
                :class="[
                  'grid grid-cols-12 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150',
                  selectedItem?.id === item.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''
                ]"
              >
                <!-- Item Name and Details -->
                <div class="col-span-5 p-3">
                  <div class="font-medium text-sm text-gray-900 dark:text-white">
                    {{ item.name || item.item_name || 'بدون اسم' }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex flex-wrap gap-2">
                    <span v-if="item.color">{{ item.color }}</span>
                    <span v-if="item.supplier" class="text-gray-400 dark:text-gray-500">المورد: {{ item.supplier }}</span>
                    <span v-if="item.item_location || item.location" class="text-gray-400 dark:text-gray-500">مكان: {{ item.item_location || item.location }}</span>
                    <span class="text-gray-400 dark:text-gray-500">المخزن: {{ item.warehouse_id }}</span>
                  </div>
                  <!-- Detailed Quantity Info -->
                  <div v-if="item.per_carton_count && item.cartons_count !== undefined" class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {{ item.cartons_count }} كرتون × {{ item.per_carton_count }} + {{ item.single_bottles_count }} فردي
                  </div>
                </div>

                <!-- Item Code -->
                <div class="col-span-2 p-3 text-center">
                  <span class="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">{{ item.code || item.item_code || 'بدون كود' }}</span>
                </div>

                <!-- Available Quantity -->
                <div class="col-span-2 p-3 text-center">
                  <span :class="[
                    'text-sm font-medium',
                    getStockClass(item.remaining_quantity || item.quantity || 0)
                  ]">
                    {{ item.remaining_quantity || item.quantity || 0 }}
                  </span>
                </div>

                <!-- Action Button -->
                <div class="col-span-3 p-3 text-center">
                  <button
                    @click="selectItem(item)"
                    :disabled="loading || (!isSuperadmin && !canPerformDispatch) || (item.remaining_quantity || item.quantity || 0) <= 0"
                    :class="[
                      'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-200',
                      selectedItem?.id === item.id
                        ? 'bg-blue-600 dark:bg-blue-700 text-white'
                        : (item.remaining_quantity || item.quantity || 0) <= 0 || (!isSuperadmin && !canPerformDispatch)
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50'
                    ]"
                  >
                    {{ selectedItem?.id === item.id ? 'محدد' : 'اختر' }}
                  </button>
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="isSearching && searchResults.length === 0" class="p-8 text-center">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p class="text-sm text-gray-600 dark:text-gray-400">جاري البحث عن الأصناف...</p>
              </div>

              <!-- Empty State -->
              <div v-if="searchResults.length === 0 && !isSearching" class="p-8 text-center">
                <svg class="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
                </svg>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {{ searchTerm 
                    ? 'لا توجد أصناف مطابقة للبحث' 
                    : form.sourceWarehouse 
                      ? 'ابدأ بالبحث عن الأصناف' 
                      : 'يرجى اختيار مخزن أولاً'
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Item Details -->
        <div v-if="selectedItem" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div class="flex items-center justify-between mb-3">
            <h5 class="text-sm font-medium text-blue-800 dark:text-blue-300">الصنف المحدد</h5>
            <button
              @click="clearSelection"
              class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              :disabled="loading || (!isSuperadmin && !canPerformDispatch)"
            >
              إلغاء التحديد
            </button>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <div class="text-xs text-blue-600 dark:text-blue-400">الاسم</div>
              <div class="text-sm font-medium text-blue-900 dark:text-blue-200">{{ selectedItem.name || selectedItem.item_name }}</div>
            </div>
            <div>
              <div class="text-xs text-blue-600 dark:text-blue-400">الكود</div>
              <div class="text-sm font-medium text-blue-900 dark:text-blue-200">{{ selectedItem.code || selectedItem.item_code }}</div>
            </div>
            <div>
              <div class="text-xs text-blue-600 dark:text-blue-400">اللون</div>
              <div class="text-sm font-medium text-blue-900 dark:text-blue-200">{{ selectedItem.color || '---' }}</div>
            </div>
            <div>
              <div class="text-xs text-blue-600 dark:text-blue-400">المورد</div>
              <div class="text-sm font-medium text-blue-900 dark:text-blue-200">{{ selectedItem.supplier || '---' }}</div>
            </div>
            <div>
              <div class="text-xs text-blue-600 dark:text-blue-400">المخزن الحالي</div>
              <div class="text-sm font-medium text-blue-900 dark:text-blue-200">{{ getWarehouseName(selectedItem.warehouse_id) }}</div>
            </div>
            <div>
              <div class="text-xs text-blue-600 dark:text-blue-400">الكمية المتاحة</div>
              <div class="text-sm font-medium" :class="getStockClass(selectedItem.remaining_quantity || selectedItem.quantity || 0)">
                {{ selectedItem.remaining_quantity || selectedItem.quantity || 0 }}
              </div>
            </div>
            <!-- Detailed Quantity Info -->
            <div v-if="selectedItem.per_carton_count" class="col-span-2">
              <div class="text-xs text-blue-600 dark:text-blue-400">التفصيل</div>
              <div class="text-sm font-medium text-blue-900 dark:text-blue-200">
                {{ selectedItem.cartons_count || 0 }} كرتون × {{ selectedItem.per_carton_count }} + 
                {{ selectedItem.single_bottles_count || 0 }} فردي
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Quantity and Details (Only for authorized users) -->
        <div v-if="selectedItem && (isSuperadmin || canPerformDispatch)">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <span class="h-6 w-6 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center text-xs ml-2">4</span>
            أدخل تفاصيل الصرف
          </h4>

          <div class="space-y-4">
            <!-- Quantity Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الكمية المراد صرفها
                <span class="text-xs font-normal text-gray-500 dark:text-gray-400">
                  (الحد الأقصى: {{ selectedItem.remaining_quantity || selectedItem.quantity || 0 }})
                </span>
                <span v-if="selectedItem.per_carton_count" class="text-xs font-normal text-blue-500 dark:text-blue-400">
                  • كل كرتون: {{ selectedItem.per_carton_count }}
                </span>
              </label>
              <div class="flex items-center space-x-3 space-x-reverse">
                <button
                  @click="decreaseQuantity"
                  :disabled="loading || form.quantity <= 1"
                  class="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                  </svg>
                </button>
                <input
                  v-model.number="form.quantity"
                  type="number"
                  :max="selectedItem.remaining_quantity || selectedItem.quantity || 0"
                  min="1"
                  step="1"
                  required
                  :disabled="loading"
                  class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  @input="updateQuantity"
                >
                <button
                  @click="increaseQuantity"
                  :disabled="loading || form.quantity >= (selectedItem.remaining_quantity || selectedItem.quantity || 0)"
                  class="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </button>
              </div>
              
              <!-- Quantity Breakdown -->
              <div v-if="selectedItem && selectedItem.per_carton_count && selectedItem.per_carton_count > 0" 
                   class="mt-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">تفصيل الكمية:</div>
                <div class="text-sm text-gray-800 dark:text-gray-200">
                  <span v-if="form.quantity > 0">
                    {{ Math.floor(form.quantity / (selectedItem.per_carton_count || 12)) }} كرتون × {{ selectedItem.per_carton_count || 12 }}
                    + {{ form.quantity % (selectedItem.per_carton_count || 12) }} فردي
                  </span>
                  <span v-else class="text-gray-500 dark:text-gray-400">
                    ادخل كمية لرؤية التفاصيل
                  </span>
                </div>
              </div>
              
              <div class="flex items-center justify-between mt-2">
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  سيتبقى بعد الصرف: {{ (selectedItem.remaining_quantity || selectedItem.quantity || 0) - form.quantity }}
                </span>
                <button
                  @click="setMaxQuantity"
                  :disabled="loading"
                  class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50"
                >
                  استخدام الكل
                </button>
              </div>
            </div>

            <!-- Priority Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">أولوية الصرف</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="priorityOption in priorityOptions"
                  :key="priorityOption.value"
                  @click="form.priority = priorityOption.value"
                  :disabled="loading"
                  :class="[
                    'p-3 border rounded-lg text-sm transition-all duration-200 flex items-center justify-center space-x-2 space-x-reverse',
                    form.priority === priorityOption.value
                      ? priorityOption.borderClass + ' ' + priorityOption.bgClass + ' ' + priorityOption.textClass
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 bg-white dark:bg-gray-800'
                  ]"
                >
                  <span :class="priorityOption.iconClass">{{ priorityOption.icon }}</span>
                  <span>{{ priorityOption.label }}</span>
                </button>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ملاحظات</label>
              <textarea
                v-model="form.notes"
                rows="2"
                :disabled="loading"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="أضف أي ملاحظات حول عملية الصرف..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-red-400 dark:text-red-300 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <div class="flex-1">
              <p class="text-sm text-red-600 dark:text-red-300">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-green-400 dark:text-green-300 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <p class="text-sm text-green-600 dark:text-green-300">{{ successMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Fixed Footer -->
      <div class="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
        <div class="flex space-x-3 space-x-reverse">
          <button
            type="button"
            @click="closeModal"
            :disabled="loading"
            class="flex-1 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
          >
            إغلاق
          </button>
          <button
            type="submit"
            @click="handleSubmit"
            :disabled="isSubmitDisabled"
            :class="[
              'flex-1 px-4 py-3 text-sm font-medium text-white rounded-lg transition-all duration-200 flex items-center justify-center',
              isSubmitDisabled
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 dark:from-green-600 dark:to-emerald-700 dark:hover:from-green-700 dark:hover:to-emerald-800'
            ]"
          >
            <svg v-if="loading" class="animate-spin h-4 w-4 ml-2 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span>{{ loading ? 'جاري الصرف...' : 'تأكيد الصرف' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { debounce } from 'lodash'

export default {
  name: 'DispatchModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'success'],
  setup(props, { emit }) {
    const store = useStore()
    
    // Priority options
    const priorityOptions = [
      {
        value: 'low',
        label: 'منخفضة',
        icon: '📝',
        iconClass: 'text-gray-500',
        borderClass: 'border-gray-300',
        bgClass: 'bg-gray-50 dark:bg-gray-800',
        textClass: 'text-gray-700 dark:text-gray-300'
      },
      {
        value: 'normal',
        label: 'عادية',
        icon: '⚡',
        iconClass: 'text-blue-500',
        borderClass: 'border-blue-300',
        bgClass: 'bg-blue-50 dark:bg-blue-900/30',
        textClass: 'text-blue-700 dark:text-blue-300'
      },
      {
        value: 'high',
        label: 'عالية',
        icon: '🚨',
        iconClass: 'text-red-500',
        borderClass: 'border-red-300',
        bgClass: 'bg-red-50 dark:bg-red-900/30',
        textClass: 'text-red-700 dark:text-red-300'
      }
    ]

    // Form data
    const form = reactive({
      sourceWarehouse: '',
      destinationBranch: '',
      quantity: 1,
      notes: '',
      priority: 'normal'
    })

    // State
    const loading = ref(false)
    const error = ref('')
    const successMessage = ref('')
    const selectedItem = ref(null)
    const searchTerm = ref('')
    const dispatchWarehouses = ref([])
    
    // Search State
    const isSearching = ref(false)
    const searchResults = ref([])
    const searchTimeout = ref(null)
    const lastSearchStats = ref(null)

    // Search configuration
    const MIN_SEARCH_CHARS = 1
    const SEARCH_DEBOUNCE = 300
    const MAX_RESULTS = 50
    const CACHE_TTL = 60000

    // Cache for search results
    const searchCache = ref(new Map())

    // Computed properties
    const userProfile = computed(() => store.state.userProfile || {})
    const warehouses = computed(() => store.state.warehouses || [])
    const inventory = computed(() => store.state.inventory || [])
    const branches = computed(() => store.state.branches || [])
    
    // Check if user is superadmin
    const isSuperadmin = computed(() => {
      return userProfile.value?.role === 'superadmin'
    })

    // Compute dispatch destinations
    const dispatchDestinations = computed(() => {
      // Use dispatch warehouses if available, otherwise use all warehouses
      if (dispatchWarehouses.value.length > 0) {
        return dispatchWarehouses.value.map(warehouse => ({
          ...warehouse,
          icon: '🏢'
        }))
      }
      
      // Fallback to all warehouses filtered by type
      const allWarehouses = warehouses.value || []
      return allWarehouses
        .filter(w => w.type === 'dispatch' || w.is_dispatch)
        .map(warehouse => ({
          ...warehouse,
          icon: '🏢'
        }))
    })

    // Compute accessible source warehouses
    const accessibleSourceWarehouses = computed(() => {
      if (isSuperadmin.value) {
        return warehouses.value.filter(w => w.type !== 'dispatch' && !w.is_dispatch)
      }
      
      // For non-superadmin users, filter by user's accessible warehouses
      const userWarehouseIds = userProfile.value?.accessible_warehouses || []
      return warehouses.value.filter(warehouse => 
        userWarehouseIds.includes(warehouse.id) && 
        warehouse.type !== 'dispatch' && 
        !warehouse.is_dispatch
      )
    })

    // Helper function to get warehouse name
    const getWarehouseName = (warehouseId) => {
      const warehouse = warehouses.value.find(w => w.id === warehouseId)
      return warehouse ? warehouse.name_ar : 'مخزن غير معروف'
    }

    // Helper function to get destination name
    const getDestinationName = (destinationId) => {
      const destination = dispatchDestinations.value.find(d => d.id === destinationId)
      return destination ? destination.name_ar : 'وجهة غير معروفة'
    }

    // Helper function to check warehouse access
    const isWarehouseAccessible = (warehouseId) => {
      if (isSuperadmin.value) return true
      const userWarehouseIds = userProfile.value?.accessible_warehouses || []
      return userWarehouseIds.includes(warehouseId)
    }

    // Check if user has access to selected warehouse
    const hasAccessToSelectedWarehouse = computed(() => {
      if (!form.sourceWarehouse || isSuperadmin.value) return true
      return isWarehouseAccessible(form.sourceWarehouse)
    })

    // Check if user can view dispatch
    const canViewDispatch = computed(() => {
      return isSuperadmin.value || 
             userProfile.value?.role === 'warehouse_manager' ||
             userProfile.value?.role === 'company_manager'
    })

    // Check if user can perform dispatch
    const canPerformDispatch = computed(() => {
      return isSuperadmin.value || 
             userProfile.value?.role === 'warehouse_manager' ||
             (userProfile.value?.role === 'company_manager' && 
              hasAccessToSelectedWarehouse.value)
    })

    // Get stock class for styling
    const getStockClass = (quantity) => {
      if (quantity <= 0) return 'text-red-600 dark:text-red-400'
      if (quantity <= 10) return 'text-yellow-600 dark:text-yellow-400'
      return 'text-green-600 dark:text-green-400'
    }

    // Select item function
    const selectItem = (item) => {
      if ((!isSuperadmin.value && !canPerformDispatch.value) || 
          (item.remaining_quantity || item.quantity || 0) <= 0) {
        return
      }
      selectedItem.value = item
      // Reset quantity to 1 when selecting new item
      form.quantity = 1
    }

    // Update quantity
    const updateQuantity = () => {
      // Ensure quantity doesn't exceed available
      const maxQuantity = selectedItem.value?.remaining_quantity || selectedItem.value?.quantity || 0
      if (form.quantity > maxQuantity) {
        form.quantity = maxQuantity
      }
      if (form.quantity < 1 && maxQuantity > 0) {
        form.quantity = 1
      }
    }

    // Calculate detailed dispatch breakdown
    const calculateDetailedDispatch = (currentItem, dispatchQuantity) => {
      const perCarton = currentItem.per_carton_count || 12;
      const currentCartons = currentItem.cartons_count || 0;
      const currentSingles = currentItem.single_bottles_count || 0;
      
      // Smart calculation for dispatch
      let dispatchCartons = 0;
      let dispatchSingles = 0;
      
      // Use singles first if available
      if (currentSingles > 0) {
        dispatchSingles = Math.min(currentSingles, dispatchQuantity);
      }
      
      // Calculate remaining after using singles
      let remaining = dispatchQuantity - dispatchSingles;
      
      // Use whole cartons
      if (remaining > 0) {
        const cartonsNeeded = Math.floor(remaining / perCarton);
        dispatchCartons = Math.min(cartonsNeeded, currentCartons);
        remaining -= (dispatchCartons * perCarton);
      }
      
      // If still remaining, break a carton
      if (remaining > 0 && currentCartons > dispatchCartons) {
        dispatchCartons += 1; // Break one more carton
        // Take what we need from the broken carton
        dispatchSingles += remaining;
        // What's left in the broken carton becomes new singles
        // This is handled by the store action
      }
      
      return {
        cartons: dispatchCartons,
        singles: dispatchSingles,
        perCarton: perCarton
      };
    }

    // Search function
    const searchSparkFriendly = async () => {
      const term = searchTerm.value.trim()
      
      if (term.length === 0) {
        searchResults.value = []
        lastSearchStats.value = null
        return
      }
      
      try {
        isSearching.value = true
        
        const startTime = performance.now()
        
        // Check cache first
        const cacheKey = `${form.sourceWarehouse || 'all'}:${term}`
        const cachedData = searchCache.value.get(cacheKey)
        const now = Date.now()
        
        if (cachedData && (now - cachedData.timestamp) < CACHE_TTL) {
          searchResults.value = cachedData.results.slice(0, MAX_RESULTS)
          lastSearchStats.value = {
            total: cachedData.results.length,
            duration: Math.round(performance.now() - startTime),
            source: 'cache'
          }
          isSearching.value = false
          return
        }
        
        let results = []
        let searchSource = ''
        
        // Try multiple search actions
        const searchActions = [
          'searchInventorySmart',
          'searchItemsForTransactions',
          'searchItems',
          'searchInventoryLive'
        ]
        
        for (const actionName of searchActions) {
          try {
            if (store._actions[actionName]) {
              const storeResults = await store.dispatch(actionName, {
                searchQuery: term,
                searchTerm: term,
                warehouseId: form.sourceWarehouse || 'all',
                limit: MAX_RESULTS
              })
              
              if (storeResults && storeResults.length > 0) {
                results = storeResults.filter(item => 
                  (item.remaining_quantity || item.quantity || 0) > 0
                ).slice(0, MAX_RESULTS)
                searchSource = actionName
                break
              }
            }
          } catch (storeError) {
            continue
          }
        }
        
        // If all store searches fail, use local search
        if (results.length === 0) {
          results = searchComprehensiveLocal(term)
          searchSource = 'local_comprehensive'
        }
        
        // Update cache
        if (results.length > 0) {
          searchCache.value.set(cacheKey, {
            results: results,
            timestamp: now,
            source: searchSource
          })
          
          // Clean old cache entries
          if (searchCache.value.size > 50) {
            const oldestKey = Array.from(searchCache.value.keys())[0]
            searchCache.value.delete(oldestKey)
          }
        }
        
        searchResults.value = results
        
        const searchTime = performance.now() - startTime
        lastSearchStats.value = {
          total: results.length,
          duration: Math.round(searchTime),
          source: searchSource
        }
        
      } catch (error) {
        console.error('❌ Search error:', error)
        searchResults.value = []
        lastSearchStats.value = null
      } finally {
        isSearching.value = false
      }
    }
    
    // Comprehensive local search
    const searchComprehensiveLocal = (term) => {
      const termLower = term.toLowerCase()
      
      // Get all items
      const allItems = inventory.value || []
      
      // Apply warehouse filter if specified
      let filteredItems = allItems
      if (form.sourceWarehouse) {
        filteredItems = filteredItems.filter(item => 
          item.warehouse_id === form.sourceWarehouse
        )
      }
      
      if (filteredItems.length === 0) {
        return []
      }
      
      // Define all possible search fields
      const SEARCH_FIELDS = [
        'name', 'item_name',
        'code', 'item_code',
        'color',
        'supplier',
        'item_location', 'location',
        'warehouse_id',
        'notes'
      ]
      
      // Search with fuzzy matching
      const matches = []
      
      for (const item of filteredItems) {
        let matched = false
        
        // Check each search field
        for (const field of SEARCH_FIELDS) {
          const value = item[field]
          if (!value) continue

          const stringValue = value.toString().toLowerCase()
          
          // Multiple matching strategies
          if (stringValue.includes(termLower)) {
            matched = true
            break
          }
          
          // Partial word matching
          if (termLower.length > 1) {
            const valueWords = stringValue.split(/\s+/)
            const searchWords = termLower.split(/\s+/)
            
            // Check if all search words are found in any order
            if (searchWords.every(word => 
              valueWords.some(valueWord => valueWord.includes(word))
            )) {
              matched = true
              break
            }
          }
        }
        
        if (matched) {
          matches.push(item)
          if (matches.length >= MAX_RESULTS) break
        }
      }
      
      return matches.slice(0, MAX_RESULTS)
    }
    
    // Load initial items
    const loadInitialWarehouseItems = () => {
      if (!form.sourceWarehouse) {
        searchResults.value = []
        lastSearchStats.value = null
        return
      }
      
      const allItems = inventory.value || []
      
      // Get items from selected warehouse
      const warehouseItems = allItems.filter(item => 
        item.warehouse_id === form.sourceWarehouse && 
        (item.remaining_quantity || item.quantity || 0) > 0
      ).slice(0, 20)
      
      searchResults.value = warehouseItems
      lastSearchStats.value = null
    }
    
    // Clear cache
    const clearSearchCache = () => {
      searchCache.value.clear()
    }

    // Debounced search
    const debouncedSearch = debounce(searchSparkFriendly, SEARCH_DEBOUNCE)
    
    const handleSearch = () => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
      }
      
      isSearching.value = true
      
      if (!searchTerm.value || searchTerm.value.trim().length === 0) {
        searchResults.value = []
        lastSearchStats.value = null
        isSearching.value = false
        return
      }
      
      // Start search immediately for better UX
      searchTimeout.value = setTimeout(() => {
        debouncedSearch()
      }, 150)
    }
    
    const clearSearch = () => {
      searchTerm.value = ''
      searchResults.value = []
      isSearching.value = false
      lastSearchStats.value = null
      
      if (form.sourceWarehouse) {
        loadInitialWarehouseItems()
      }
    }

    const onWarehouseChange = () => {
      selectedItem.value = null
      searchTerm.value = ''
      searchResults.value = []
      error.value = ''
      lastSearchStats.value = null
      
      // Clear cache when warehouse changes
      clearSearchCache()
      
      if (form.sourceWarehouse) {
        loadInitialWarehouseItems()
      }
    }

    // Quantity helper functions
    const increaseQuantity = () => {
      const maxQuantity = selectedItem.value?.remaining_quantity || selectedItem.value?.quantity || 0
      if (form.quantity < maxQuantity) {
        form.quantity++
      }
    }

    const decreaseQuantity = () => {
      if (form.quantity > 1) {
        form.quantity--
      }
    }

    const setMaxQuantity = () => {
      const maxQuantity = selectedItem.value?.remaining_quantity || selectedItem.value?.quantity || 0
      form.quantity = maxQuantity
    }

    // Updated handleSubmit with detailed dispatch calculation
    const handleSubmit = async () => {
      // Reset messages
      error.value = ''
      successMessage.value = ''
      
      // Validation
      const errors = []
      
      if (!form.sourceWarehouse) {
        errors.push('يرجى اختيار المخزن المصدر')
      }
      
      if (!form.destinationBranch) {
        errors.push('يرجى اختيار الوجهة')
      }
      
      if (!selectedItem.value) {
        errors.push('يرجى اختيار صنف للصرف')
      }
      
      if (!form.quantity || form.quantity <= 0) {
        errors.push('يرجى إدخال كمية صحيحة')
      }
      
      if (errors.length > 0) {
        error.value = errors.join('، ')
        return
      }

      // Use your EXISTING item data
      const currentItem = selectedItem.value
      const totalToDispatch = form.quantity
      
      // Calculate detailed breakdown using the smart calculation function
      const detailedDispatch = calculateDetailedDispatch(currentItem, totalToDispatch)
      
      const { cartons: dispatchCartons, singles: dispatchSingles, perCarton: perCarton } = detailedDispatch

      loading.value = true

      try {
        // Prepare dispatch data
        const dispatchData = {
          item_id: currentItem.id,
          from_warehouse_id: form.sourceWarehouse,
          destination: getDestinationName(form.destinationBranch),
          
          // Send detailed breakdown
          cartons_count: dispatchCartons,
          per_carton_count: perCarton,
          single_bottles_count: dispatchSingles,
          
          // Also send total for compatibility
          quantity: totalToDispatch,
          
          // Current state for store validation
          current_cartons: currentItem.cartons_count || 0,
          current_singles: currentItem.single_bottles_count || 0,
          current_total: ((currentItem.cartons_count || 0) * perCarton) + (currentItem.single_bottles_count || 0),
          
          notes: form.notes || 'صرف إلى فرع',
          priority: form.priority,
          item_name: currentItem.name || currentItem.item_name,
          item_code: currentItem.code || currentItem.item_code,
          from_warehouse_name: getWarehouseName(form.sourceWarehouse),
          destination_id: form.destinationBranch
        }
        
        // Log dispatch details for debugging
        console.log('📦 Dispatching item:', {
          item: currentItem.name || currentItem.item_name,
          total: totalToDispatch,
          cartons: dispatchCartons,
          singles: dispatchSingles,
          per_carton: perCarton,
          calculation: `(${dispatchCartons} × ${perCarton}) + ${dispatchSingles} = ${(dispatchCartons * perCarton) + dispatchSingles}`
        })

        // Use the store dispatch action
        const result = await store.dispatch('dispatchItem', dispatchData)

        if (result?.success) {
          successMessage.value = 'تم صرف الصنف بنجاح'
          
          // Show detailed confirmation
          if (dispatchCartons > 0 && dispatchSingles > 0) {
            successMessage.value += ` (${dispatchCartons} كرتون × ${perCarton} + ${dispatchSingles} فردي)`
          } else if (dispatchCartons > 0) {
            successMessage.value += ` (${dispatchCartons} كرتون × ${perCarton})`
          } else if (dispatchSingles > 0) {
            successMessage.value += ` (${dispatchSingles} فردي)`
          }
          
          // Reset form and close
          resetForm()
          setTimeout(() => {
            emit('success', result)
            emit('close')
          }, 1500)
        } else {
          throw new Error(result?.error || 'فشل في عملية الصرف')
        }
        
      } catch (err) {
        console.error('❌ Dispatch error:', err)
        error.value = err.message || 'فشل في عملية الصرف'
      } finally {
        loading.value = false
      }
    }

    const resetForm = () => {
      Object.assign(form, {
        sourceWarehouse: '',
        destinationBranch: '',
        quantity: 1,
        notes: '',
        priority: 'normal'
      })
      selectedItem.value = null
      error.value = ''
      successMessage.value = ''
      searchTerm.value = ''
      searchResults.value = []
      isSearching.value = false
      lastSearchStats.value = null
    }

    // Watch for inventory changes to update cache
    watch(() => store.state.inventory, (newInventory) => {
      if (newInventory && newInventory.length > 0) {
        // Invalidate cache when inventory updates
        clearSearchCache()
      }
    }, { deep: true })

    // Load dispatch warehouses when modal opens
    watch(() => props.isOpen, async (isOpen) => {
      if (isOpen) {
        // Reset form when modal opens
        resetForm()
        
        // Load dispatch warehouses if not already loaded
        if (dispatchWarehouses.value.length === 0) {
          try {
            loading.value = true
            
            // Try multiple ways to get dispatch warehouses
            let warehouses = []
            
            // Method 1: Use getDispatchWarehouses action
            try {
              warehouses = await store.dispatch('getDispatchWarehouses')
            } catch (error) {
              // Method 2: Filter from all warehouses
              const allWarehouses = store.state.warehouses || []
              warehouses = allWarehouses.filter(w => 
                w.type === 'dispatch' || w.is_dispatch
              )
            }
            
            if (warehouses && warehouses.length > 0) {
              dispatchWarehouses.value = warehouses
            }
          } catch (error) {
            console.error('❌ Error loading dispatch warehouses:', error)
          } finally {
            loading.value = false
          }
        }
      }
    }, { immediate: true })

    onUnmounted(() => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
      }
      debouncedSearch.cancel()
      // Clear cache to free memory
      clearSearchCache()
    })

    // Return all required properties
    return {
      // Form and state
      form,
      loading,
      error,
      successMessage,
      selectedItem,
      searchTerm,
      isSearching,
      searchResults,
      lastSearchStats,
      
      // Data
      dispatchWarehouses,
      priorityOptions,
      
      // Computed properties
      userProfile,
      warehouses,
      isSuperadmin,
      dispatchDestinations,
      accessibleSourceWarehouses,
      canViewDispatch,
      canPerformDispatch,
      hasAccessToSelectedWarehouse,
      
      // Methods
      selectItem,
      clearSelection: () => selectedItem.value = null,
      clearSearch,
      onWarehouseChange,
      increaseQuantity,
      decreaseQuantity,
      setMaxQuantity,
      updateQuantity,
      getWarehouseName,
      getWarehouseType: (warehouseId) => {
        const warehouse = warehouses.value.find(w => w.id === warehouseId)
        return warehouse?.type || ''
      },
      getDestinationName,
      getStockClass,
      isWarehouseAccessible,
      handleSearch,
      handleSubmit,
      
      // Computed for submit button
      isSubmitDisabled: computed(() => {
        if (loading.value) return true
        if (!selectedItem.value || !form.destinationBranch || !form.sourceWarehouse || form.quantity <= 0) {
          return true
        }
        // Check if quantity exceeds available
        const available = selectedItem.value.remaining_quantity || selectedItem.value.quantity || 0
        if (form.quantity > available) {
          return true
        }
        return false
      }),
      
      // Modal control
      closeModal: () => {
        if (!loading.value) {
          resetForm()
          emit('close')
        }
      }
    }
  }
}
</script>
<style scoped>
.rtl {
  direction: rtl;
}

.space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

/* Custom scrollbar for light mode */
.max-h-60::-webkit-scrollbar {
  width: 6px;
}

.max-h-60::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.max-h-60::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.max-h-60::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Custom scrollbar for dark mode */
.dark .max-h-60::-webkit-scrollbar-track {
  background: #374151;
}

.dark .max-h-60::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark .max-h-60::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Ensure consistent heights */
.max-h-\[90vh\] {
  max-height: 90vh;
}

.max-h-\[calc\(90vh-180px\)\] {
  max-height: calc(90vh - 180px);
}

/* Smooth transitions */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

/* Remove number input arrows */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* Loading indicator animation */
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
</style>
