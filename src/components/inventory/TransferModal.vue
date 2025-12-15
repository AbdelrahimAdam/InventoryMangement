<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl rtl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="sticky top-0 bg-white dark:bg-gray-800 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">نقل الأصناف بين المخازن</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">اختر الصنف من القائمة وأدخل كمية النقل</p>
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

        <!-- Access Control Warning -->
        <div v-if="!isSuperadmin && !canPerformTransfer" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-yellow-400 dark:text-yellow-300 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div class="flex-1">
              <p class="text-sm text-yellow-800 dark:text-yellow-300">
                يمكنك فقط عرض البيانات. لنقل الأصناف يجب أن تكون مشرف عام أو مدير مخازن مع صلاحية النقل.
              </p>
            </div>
          </div>
        </div>

        <!-- Step 1: Source Warehouse Selection -->
        <div>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <span class="h-6 w-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-xs ml-2">1</span>
            اختر المخزن المصدر
          </h4>
          <select
            v-model="formData.from_warehouse_id"
            @change="onSourceWarehouseChange"
            required
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            :disabled="loading || (!isSuperadmin && !canViewTransfer)"
          >
            <option value="" class="text-gray-500 dark:text-gray-400">اختر المخزن المصدر</option>
            <option 
              v-for="warehouse in accessiblePrimaryWarehouses" 
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
          <div v-if="formData.from_warehouse_id" class="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span>المخزن: {{ getWarehouseName(formData.from_warehouse_id) }}</span>
            <span v-if="getWarehouseType(formData.from_warehouse_id)" class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
              {{ getWarehouseType(formData.from_warehouse_id) }}
            </span>
          </div>
          
          <!-- Warehouse Access Indicator (not for superadmin) -->
          <div v-if="formData.from_warehouse_id && userProfile?.role === 'warehouse_manager' && !isSuperadmin" class="mt-2">
            <div v-if="hasAccessToSelectedWarehouse" class="text-xs px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full inline-flex items-center">
              <svg class="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              لديك صلاحية النقل من هذا المخزن
            </div>
            <div v-else class="text-xs px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 rounded-full inline-flex items-center">
              <svg class="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              ليس لديك صلاحية النقل من هذا المخزن
            </div>
          </div>
          
          <!-- Superadmin Access Indicator -->
          <div v-if="formData.from_warehouse_id && isSuperadmin" class="mt-2">
            <div class="text-xs px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 rounded-full inline-flex items-center">
              <svg class="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
              </svg>
              وصول كامل كمشرف عام
            </div>
          </div>
        </div>

        <!-- Step 2: Item Selection -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <span class="h-6 w-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-xs ml-2">2</span>
              اختر الصنف المراد نقله
            </h4>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ combinedItems.length }} صنف متاح
              <span v-if="liveSearchResults.length > 0" class="text-blue-600 dark:text-blue-400">
                ({{ liveSearchResults.length }} من البحث المباشر)
              </span>
            </div>
          </div>

          <!-- Search Input with Live Search Indicator -->
          <div class="relative mb-4">
            <input
              v-model="searchTerm"
              @input="handleSearch"
              type="text"
              placeholder="ابحث عن صنف بالاسم أو الكود..."
              class="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              :disabled="loading || !formData.from_warehouse_id || (!isSuperadmin && !canViewTransfer)"
            >
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <!-- Live Search Indicator -->
            <div v-if="isLiveSearching" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div class="w-4 h-4 animate-pulse rounded-full bg-blue-500"></div>
            </div>
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
                v-for="item in combinedItems"
                :key="item.id"
                :class="[
                  'grid grid-cols-12 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150',
                  selectedItem?.id === item.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : '',
                  item.isLiveSearchResult ? 'bg-green-50/30 dark:bg-green-900/5 border-green-100 dark:border-green-800' : ''
                ]"
              >
                <!-- Item Name and Details -->
                <div class="col-span-5 p-3">
                  <div class="font-medium text-sm text-gray-900 dark:text-white flex items-center">
                    {{ item.name }}
                    <!-- Live Search Badge -->
                    <span v-if="item.isLiveSearchResult" class="text-xs bg-blue-500 text-white px-1 py-0.5 rounded mr-2">
                      🔍
                    </span>
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex flex-wrap gap-2">
                    <span v-if="item.color">{{ item.color }}</span>
                    <span v-if="item.supplier" class="text-gray-400 dark:text-gray-500">المورد: {{ item.supplier }}</span>
                    <span v-if="item.isLiveSearchResult" class="text-blue-600 dark:text-blue-400">تم العثور عبر البحث المباشر</span>
                  </div>
                </div>

                <!-- Item Code -->
                <div class="col-span-2 p-3 text-center">
                  <span class="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">{{ item.code }}</span>
                </div>

                <!-- Available Quantity -->
                <div class="col-span-2 p-3 text-center">
                  <span :class="[
                    'text-sm font-medium',
                    getStockClass(item.remaining_quantity)
                  ]">
                    {{ item.remaining_quantity }}
                  </span>
                </div>

                <!-- Action Button -->
                <div class="col-span-3 p-3 text-center">
                  <button
                    @click="selectItem(item)"
                    :disabled="loading || (!isSuperadmin && !canPerformTransfer) || item.remaining_quantity <= 0"
                    :class="[
                      'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-200',
                      selectedItem?.id === item.id
                        ? 'bg-blue-600 dark:bg-blue-700 text-white'
                        : item.remaining_quantity <= 0 || (!isSuperadmin && !canPerformTransfer)
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50'
                    ]"
                  >
                    {{ selectedItem?.id === item.id ? 'محدد' : 'اختر' }}
                  </button>
                </div>
              </div>

              <!-- Live Search Loading State -->
              <div v-if="isLiveSearching && combinedItems.length === 0" class="p-8 text-center">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p class="text-sm text-gray-600 dark:text-gray-400">جاري البحث عن الأصناف...</p>
              </div>

              <!-- Empty State -->
              <div v-if="combinedItems.length === 0 && !isLiveSearching" class="p-8 text-center">
                <svg class="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
                </svg>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {{ formData.from_warehouse_id ? 'لا توجد أصناف مطابقة للبحث' : 'يرجى اختيار مخزن مصدر أولاً' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Item Details -->
        <div v-if="selectedItem" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div class="flex items-center justify-between mb-3">
            <h5 class="text-sm font-medium text-blue-800 dark:text-blue-300">الصنف المحدد</h5>
            <div class="flex items-center gap-2">
              <span v-if="selectedItem.isLiveSearchResult" class="text-xs px-2 py-1 bg-blue-500 text-white rounded-full">
                تم العثور عبر البحث المباشر
              </span>
              <button
                @click="clearSelection"
                class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                :disabled="loading || (!isSuperadmin && !canPerformTransfer)"
              >
                إلغاء التحديد
              </button>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <div class="text-xs text-blue-600 dark:text-blue-400">الاسم</div>
              <div class="text-sm font-medium text-blue-900 dark:text-blue-200">{{ selectedItem.name }}</div>
            </div>
            <div>
              <div class="text-xs text-blue-600 dark:text-blue-400">الكود</div>
              <div class="text-sm font-medium text-blue-900 dark:text-blue-200">{{ selectedItem.code }}</div>
            </div>
            <div>
              <div class="text-xs text-blue-600 dark:text-blue-400">المخزن الحالي</div>
              <div class="text-sm font-medium text-blue-900 dark:text-blue-200">{{ getWarehouseName(selectedItem.warehouse_id) }}</div>
            </div>
            <div>
              <div class="text-xs text-blue-600 dark:text-blue-400">الكمية المتاحة</div>
              <div class="text-sm font-medium" :class="getStockClass(selectedItem.remaining_quantity)">
                {{ selectedItem.remaining_quantity }}
              </div>
            </div>
            <div class="col-span-2">
              <div class="text-xs text-blue-600 dark:text-blue-400">التفاصيل</div>
              <div class="text-xs text-blue-900 dark:text-blue-200 mt-1">
                {{ selectedItem.cartons_count }} كرتونة × {{ selectedItem.per_carton_count }} + {{ selectedItem.single_bottles_count }} فردي
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Transfer Details (Only for authorized users) -->
        <div v-if="selectedItem && (isSuperadmin || canPerformTransfer)">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <span class="h-6 w-6 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center text-xs ml-2">3</span>
            أدخل تفاصيل النقل
          </h4>

          <div class="space-y-4">
            <!-- Destination Warehouse Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                المخزن الهدف
                <span class="text-xs font-normal text-gray-500 dark:text-gray-400">
                  (اختر مخزن مختلف عن المصدر)
                </span>
              </label>
              <select
                v-model="formData.to_warehouse_id"
                required
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                :disabled="loading"
              >
                <option value="" class="text-gray-500 dark:text-gray-400">اختر المخزن الهدف</option>
                <option 
                  v-for="warehouse in availableDestinationWarehouses" 
                  :key="warehouse.id" 
                  :value="warehouse.id"
                  :disabled="warehouse.id === formData.from_warehouse_id"
                  class="text-gray-900 dark:text-white"
                >
                  {{ warehouse.name_ar }}
                  <span v-if="warehouse.is_main" class="text-yellow-600 dark:text-yellow-400 text-xs mr-1">⭐</span>
                  <span v-if="warehouse.id === formData.from_warehouse_id" class="text-red-500 dark:text-red-400 text-xs">
                    (نفس المخزن)
                  </span>
                </option>
              </select>
              <div v-if="formData.to_warehouse_id" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ getWarehouseName(formData.to_warehouse_id) }}
              </div>
            </div>

            <!-- Quantity Inputs -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الكمية المراد نقلها
                <span class="text-xs font-normal text-gray-500 dark:text-gray-400">
                  (الحد الأقصى: {{ selectedItem.remaining_quantity }})
                </span>
              </label>
              
              <div class="grid grid-cols-2 gap-3">
                <!-- Cartons -->
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">كراتين</label>
                  <div class="flex items-center space-x-2">
                    <button
                      @click="decreaseCartons"
                      :disabled="loading || formData.cartons_count <= 0"
                      class="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                      </svg>
                    </button>
                    <input
                      v-model.number="formData.cartons_count"
                      type="number"
                      :max="selectedItem.cartons_count"
                      min="0"
                      :disabled="loading"
                      class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-center text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      @input="validateCartons"
                    >
                    <button
                      @click="increaseCartons"
                      :disabled="loading || formData.cartons_count >= selectedItem.cartons_count"
                      class="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                    </button>
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    متاح: {{ selectedItem.cartons_count }} كرتونة
                  </div>
                </div>

                <!-- Single Bottles -->
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">فردي</label>
                  <div class="flex items-center space-x-2">
                    <button
                      @click="decreaseSingleBottles"
                      :disabled="loading || formData.single_bottles_count <= 0"
                      class="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                      </svg>
                    </button>
                    <input
                      v-model.number="formData.single_bottles_count"
                      type="number"
                      :max="selectedItem.single_bottles_count"
                      min="0"
                      :disabled="loading"
                      class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-center text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      @input="validateSingleBottles"
                    >
                    <button
                      @click="increaseSingleBottles"
                      :disabled="loading || formData.single_bottles_count >= selectedItem.single_bottles_count"
                      class="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                    </button>
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    متاح: {{ selectedItem.single_bottles_count }} فردي
                  </div>
                </div>
              </div>

              <!-- Summary -->
              <div class="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div class="text-center">
                    <div class="text-gray-600 dark:text-gray-400">الكراتين</div>
                    <div class="font-semibold text-blue-600 dark:text-blue-400">
                      {{ formData.cartons_count }} × {{ selectedItem.per_carton_count }} = {{ formData.cartons_count * selectedItem.per_carton_count }}
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="text-gray-600 dark:text-gray-400">الفردي</div>
                    <div class="font-semibold text-blue-600 dark:text-blue-400">
                      {{ formData.single_bottles_count }}
                    </div>
                  </div>
                  <div class="col-span-2 text-center pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div class="text-gray-600 dark:text-gray-400">الإجمالي</div>
                    <div class="text-lg font-bold" :class="getStockClass(totalRequestedQuantity)">
                      {{ totalRequestedQuantity }} / {{ selectedItem.remaining_quantity }}
                    </div>
                  </div>
                </div>
                
                <!-- Validation Message -->
                <div v-if="validationMessage" class="mt-2 text-center">
                  <div :class="[
                    'text-xs font-medium px-3 py-1 rounded-full',
                    validationMessage.type === 'error' 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' 
                      : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  ]">
                    {{ validationMessage.text }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ملاحظات</label>
              <textarea
                v-model="formData.notes"
                rows="2"
                :disabled="loading"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="أضف أي ملاحظات حول عملية النقل..."
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7l4-4m0 0l4 4m-4-4v18m0 0l-4-4m4 4l4-4"/>
            </svg>
            <span>{{ loading ? 'جاري النقل...' : 'تأكيد النقل' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'TransferModal',
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
    
    // State
    const loading = ref(false)
    const error = ref('')
    const successMessage = ref('')
    const selectedItem = ref(null)
    const searchTerm = ref('')
    
    // Live Search State
    const isLiveSearching = ref(false)
    const liveSearchResults = reactive([])
    const liveSearchTimeout = ref(null)

    // Form Data - EXACTLY MATCHING STORE EXPECTATIONS
    const formData = reactive({
      item_id: '',
      from_warehouse_id: '',
      to_warehouse_id: '',
      cartons_count: 0,
      per_carton_count: 0,
      single_bottles_count: 0,
      notes: ''
    })

    // Computed properties
    const userProfile = computed(() => store.state.userProfile)
    const warehouses = computed(() => store.state.warehouses || [])
    const inventory = computed(() => store.state.inventory || [])
    
    // Check if user is superadmin
    const isSuperadmin = computed(() => {
      return userProfile.value?.role === 'superadmin'
    })
    
    // All users can VIEW the modal
    const canViewTransfer = computed(() => {
      return store.getters.canViewTransfers || true
    })
    
    // Only superadmin and warehouse managers with transfer permission can PERFORM transfer
    const canPerformTransfer = computed(() => {
      return store.getters.canTransfer || false
    })
    
    // Source warehouses: ONLY PRIMARY warehouses (for transfer between primary warehouses)
    const accessiblePrimaryWarehouses = computed(() => {
      return store.getters.accessiblePrimaryWarehouses || []
    })
    
    // Combined items (local + live search results)
    const combinedItems = computed(() => {
      const combined = []
      
      // Add items from the selected source warehouse
      if (formData.from_warehouse_id) {
        const localItems = inventory.value.filter(item => 
          item.warehouse_id === formData.from_warehouse_id && 
          item.remaining_quantity > 0
        )
        combined.push(...localItems)
      }
      
      // Add live search results that aren't already in local inventory
      liveSearchResults.forEach(liveItem => {
        if (!combined.some(item => item.id === liveItem.id)) {
          // Only include items from the selected warehouse or if no warehouse is selected
          if (!formData.from_warehouse_id || liveItem.warehouse_id === formData.from_warehouse_id) {
            // Only include items with remaining quantity > 0
            if (liveItem.remaining_quantity > 0) {
              // Mark as live search result for styling
              combined.push({
                ...liveItem,
                isLiveSearchResult: true
              })
            }
          }
        }
      })
      
      // Filter by search term if provided
      if (!searchTerm.value.trim()) {
        return combined
      }
      
      const term = searchTerm.value.toLowerCase().trim()
      return combined.filter(item => {
        const name = (item.name || '').toLowerCase()
        const code = (item.code || '').toLowerCase()
        const color = (item.color || '').toLowerCase()
        const supplier = (item.supplier || '').toLowerCase()
        
        return name.includes(term) || 
               code.includes(term) || 
               color.includes(term) ||
               supplier.includes(term)
      })
    })

    // Available destination warehouses (primary warehouses excluding source)
    const availableDestinationWarehouses = computed(() => {
      if (!formData.from_warehouse_id) return []
      return accessiblePrimaryWarehouses.value.filter(warehouse => 
        warehouse.id !== formData.from_warehouse_id
      )
    })

    // Warehouse access check
    const hasAccessToSelectedWarehouse = computed(() => {
      if (!userProfile.value || !formData.from_warehouse_id) return false
      
      // SUPERADMIN BYPASS - FULL ACCESS
      if (isSuperadmin.value) return true
      
      if (userProfile.value.role === 'warehouse_manager') {
        const allowedWarehouses = userProfile.value.allowed_warehouses || []
        return allowedWarehouses.includes('all') || allowedWarehouses.includes(formData.from_warehouse_id)
      }
      
      // Other users can view but not transfer
      return true
    })

    const isWarehouseAccessible = (warehouseId) => {
      if (!userProfile.value) return true // Public can view all
      
      // SUPERADMIN BYPASS - ACCESS TO ALL WAREHOUSES
      if (isSuperadmin.value) return true
      
      if (userProfile.value.role === 'warehouse_manager') {
        const allowedWarehouses = userProfile.value.allowed_warehouses || []
        return allowedWarehouses.includes('all') || allowedWarehouses.includes(warehouseId)
      }
      
      // Other users can view but not access for transfer
      return true
    }

    // Quantity calculations
    const itemsPerCarton = computed(() => {
      return selectedItem.value?.per_carton_count || 1
    })

    const totalRequestedQuantity = computed(() => {
      return (formData.cartons_count * itemsPerCarton.value) + formData.single_bottles_count
    })

    const validationMessage = computed(() => {
      if (!selectedItem.value) {
        return { type: 'error', text: '❗ اختر صنفاً للنقل' }
      }

      const availableQuantity = selectedItem.value.remaining_quantity
      
      if (totalRequestedQuantity.value === 0) {
        return { type: 'error', text: '❗ حدد كمية للنقل' }
      }
      
      if (totalRequestedQuantity.value > availableQuantity) {
        return { type: 'error', text: `❌ ${totalRequestedQuantity.value} > ${availableQuantity}` }
      }
      
      if (formData.cartons_count > selectedItem.value.cartons_count) {
        return { type: 'error', text: `❌ كراتين: ${formData.cartons_count} > ${selectedItem.value.cartons_count}` }
      }
      
      if (formData.single_bottles_count > selectedItem.value.single_bottles_count) {
        return { type: 'error', text: `❌ فردي: ${formData.single_bottles_count} > ${selectedItem.value.single_bottles_count}` }
      }
      
      if (!formData.to_warehouse_id) {
        return { type: 'error', text: '❗ اختر المخزن الهدف' }
      }

      if (formData.from_warehouse_id === formData.to_warehouse_id) {
        return { type: 'error', text: '❌ لا يمكن النقل إلى نفس المخزن' }
      }

      return { type: 'success', text: `✅ ${totalRequestedQuantity.value} / ${availableQuantity} - جاهز للنقل` }
    })

    // Submit button disabled logic
    const isSubmitDisabled = computed(() => {
      if (loading.value) return true
      
      // SUPERADMIN CAN SUBMIT WITH MINIMAL VALIDATION
      if (isSuperadmin.value) {
        return !selectedItem.value || 
               !formData.to_warehouse_id || 
               !formData.from_warehouse_id ||
               totalRequestedQuantity.value <= 0
      }
      
      // Regular users have stricter checks
      return !selectedItem.value || 
             !formData.to_warehouse_id || 
             !formData.from_warehouse_id || 
             !canPerformTransfer.value ||
             totalRequestedQuantity.value > (selectedItem.value?.remaining_quantity || 0) ||
             totalRequestedQuantity.value <= 0 ||
             !hasAccessToSelectedWarehouse.value ||
             validationMessage.value?.type === 'error'
    })

    // Helper functions
    const getWarehouseName = (warehouseId) => {
      const warehouse = warehouses.value.find(w => w.id === warehouseId)
      return warehouse ? warehouse.name_ar : warehouseId
    }
    
    const getWarehouseType = (warehouseId) => {
      const warehouse = warehouses.value.find(w => w.id === warehouseId)
      if (!warehouse) return ''
      if (warehouse.is_main) return 'رئيسي ⭐'
      if (warehouse.type === 'primary') return 'مخزن رئيسي'
      if (warehouse.type === 'dispatch') return 'موقع صرف 🚚'
      return warehouse.type || ''
    }
    
    const getStockClass = (quantity) => {
      if (quantity === 0) return 'text-red-600 dark:text-red-400'
      if (quantity < 10) return 'text-yellow-600 dark:text-yellow-400'
      return 'text-green-600 dark:text-green-400'
    }

    // Live Search Functions
    const performLiveSearch = async (searchTermValue) => {
      if (!searchTermValue || searchTermValue.trim().length < 2) {
        liveSearchResults.length = 0 // Clear results
        isLiveSearching.value = false
        return
      }
      
      isLiveSearching.value = true
      
      try {
        console.log('🔍 Performing live search in transfer for:', searchTermValue)
        
        // Use the store action to search Firestore directly
        const searchResults = await store.dispatch('searchItemsForTransactions', {
          searchTerm: searchTermValue,
          limitResults: 50
        })
        
        console.log('✅ Live search results in transfer:', searchResults.length, 'items')
        
        // Update live search results
        liveSearchResults.length = 0 // Clear previous results
        searchResults.forEach(item => {
          liveSearchResults.push(item)
        })
        
      } catch (error) {
        console.error('❌ Error in live search:', error)
        store.dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في البحث عن الأصناف'
        })
      } finally {
        isLiveSearching.value = false
      }
    }
    
    // Handle search input with live search
    const handleSearch = () => {
      // Clear any existing timeout
      if (liveSearchTimeout.value) {
        clearTimeout(liveSearchTimeout.value)
      }
      
      // Debounce the live search
      liveSearchTimeout.value = setTimeout(() => {
        if (searchTerm.value && searchTerm.value.trim().length >= 2) {
          performLiveSearch(searchTerm.value.trim())
        } else {
          // Clear live search results if search term is too short
          liveSearchResults.length = 0
          isLiveSearching.value = false
        }
      }, 300)
    }

    // Methods
    const resetForm = () => {
      Object.assign(formData, {
        item_id: '',
        from_warehouse_id: '',
        to_warehouse_id: '',
        cartons_count: 0,
        per_carton_count: 0,
        single_bottles_count: 0,
        notes: ''
      })
      selectedItem.value = null
      error.value = ''
      successMessage.value = ''
      searchTerm.value = ''
      liveSearchResults.length = 0
      isLiveSearching.value = false
    }

    const closeModal = () => {
      if (!loading.value) {
        resetForm()
        emit('close')
      }
    }

    const onSourceWarehouseChange = () => {
      selectedItem.value = null
      formData.item_id = ''
      searchTerm.value = ''
      liveSearchResults.length = 0
      isLiveSearching.value = false
      error.value = ''
    }

    const selectItem = (item) => {
      if (!isSuperadmin.value && !canPerformTransfer.value) {
        error.value = 'ليس لديك صلاحية لاختيار الأصناف للنقل'
        return
      }
      
      if (selectedItem.value?.id === item.id) {
        selectedItem.value = null
        formData.item_id = ''
      } else {
        selectedItem.value = item
        formData.item_id = item.id
        formData.from_warehouse_id = item.warehouse_id
        formData.per_carton_count = item.per_carton_count || 12
        
        // Set default quantities
        formData.cartons_count = Math.min(1, item.cartons_count || 0)
        formData.single_bottles_count = Math.min(1, item.single_bottles_count || 0)
        
        // Reset destination
        formData.to_warehouse_id = ''
      }
    }

    const clearSelection = () => {
      selectedItem.value = null
      formData.item_id = ''
      formData.cartons_count = 0
      formData.single_bottles_count = 0
    }

    // Quantity adjustment methods
    const increaseCartons = () => {
      if (!selectedItem.value) return
      const max = selectedItem.value.cartons_count || 0
      if (formData.cartons_count < max) {
        formData.cartons_count++
      }
    }

    const decreaseCartons = () => {
      if (formData.cartons_count > 0) {
        formData.cartons_count--
      }
    }

    const increaseSingleBottles = () => {
      if (!selectedItem.value) return
      const max = selectedItem.value.single_bottles_count || 0
      if (formData.single_bottles_count < max) {
        formData.single_bottles_count++
      }
    }

    const decreaseSingleBottles = () => {
      if (formData.single_bottles_count > 0) {
        formData.single_bottles_count--
      }
    }

    const validateCartons = () => {
      if (!selectedItem.value) return
      const max = selectedItem.value.cartons_count || 0
      if (formData.cartons_count > max) {
        formData.cartons_count = max
      }
      if (formData.cartons_count < 0) {
        formData.cartons_count = 0
      }
    }

    const validateSingleBottles = () => {
      if (!selectedItem.value) return
      const max = selectedItem.value.single_bottles_count || 0
      if (formData.single_bottles_count > max) {
        formData.single_bottles_count = max
      }
      if (formData.single_bottles_count < 0) {
        formData.single_bottles_count = 0
      }
    }

    // Watch for prop changes
    watch(() => props.isOpen, (newVal) => {
      if (newVal) {
        resetForm()
        if (props.item) {
          if (isSuperadmin.value || canPerformTransfer.value) {
            selectItem(props.item)
          }
        }
      }
    })

    watch(() => props.item, (newItem) => {
      if (newItem && props.isOpen && (isSuperadmin.value || canPerformTransfer.value)) {
        selectItem(newItem)
      }
    })

    // Watch quantity changes
    watch(() => formData.cartons_count, validateCartons)
    watch(() => formData.single_bottles_count, validateSingleBottles)

    // Watch search term changes to clear live search results when cleared
    watch(searchTerm, (newValue) => {
      if (!newValue || newValue.trim().length < 2) {
        liveSearchResults.length = 0
        isLiveSearching.value = false
      }
    })

    const handleSubmit = async () => {
      // Reset messages
      error.value = ''
      successMessage.value = ''
      
      // Check if user can perform transfer
      if (!isSuperadmin.value && !canPerformTransfer.value) {
        error.value = 'ليس لديك صلاحية لنقل الأصناف'
        return
      }

      // Validation
      const errors = []
      
      if (!formData.from_warehouse_id) {
        errors.push('يرجى اختيار المخزن المصدر')
      }
      
      if (!formData.to_warehouse_id) {
        errors.push('يرجى اختيار المخزن الهدف')
      }
      
      if (formData.from_warehouse_id === formData.to_warehouse_id) {
        errors.push('لا يمكن النقل إلى نفس المخزن')
      }
      
      if (!selectedItem.value) {
        errors.push('يرجى اختيار صنف للنقل')
      }
      
      if (!formData.item_id) {
        errors.push('معرف الصنف مطلوب')
      }
      
      if (totalRequestedQuantity.value <= 0) {
        errors.push('يرجى إدخال كمية صحيحة للنقل')
      }
      
      // SUPERADMIN BYPASSES QUANTITY LIMIT CHECKS!
      if (!isSuperadmin.value) {
        const maxQuantity = selectedItem.value?.remaining_quantity || 0
        if (totalRequestedQuantity.value > maxQuantity) {
          errors.push(`الكمية المطلوبة (${totalRequestedQuantity.value}) تتجاوز الكمية المتاحة (${maxQuantity})`)
        }
      }
      
      if (!isSuperadmin.value && !canPerformTransfer.value) {
        errors.push('ليس لديك صلاحية لنقل الأصناف')
      }
      
      if (!isSuperadmin.value && userProfile.value?.role === 'warehouse_manager' && !hasAccessToSelectedWarehouse.value) {
        errors.push('ليس لديك صلاحية للنقل من هذا المخزن')
      }
      
      if (errors.length > 0) {
        error.value = errors.join('، ')
        return
      }

      loading.value = true

      try {
        // Prepare transfer data EXACTLY as the store expects
        const transferData = {
          // REQUIRED FIELDS
          item_id: formData.item_id,
          from_warehouse_id: formData.from_warehouse_id,
          to_warehouse_id: formData.to_warehouse_id,
          
          // QUANTITY FIELDS (store uses these for transaction)
          cartons_count: formData.cartons_count || 0,
          per_carton_count: formData.per_carton_count || selectedItem.value?.per_carton_count || 12,
          single_bottles_count: formData.single_bottles_count || 0,
          
          // ADDITIONAL INFO
          notes: formData.notes || 'نقل بين المخازن',
          
          // ITEM DETAILS (for transaction record)
          item_name: selectedItem.value.name,
          item_code: selectedItem.value.code,
          item_color: selectedItem.value.color,
          
          // WAREHOUSE NAMES (for transaction record)
          from_warehouse_name: getWarehouseName(formData.from_warehouse_id),
          to_warehouse_name: getWarehouseName(formData.to_warehouse_id),
          
          // USER INFO
          user_id: store.state.user?.uid,
          user_role: userProfile.value?.role,
          user_name: userProfile.value?.name
        }

        console.log('📦 DEBUG - Transfer data being sent:', {
          item_id: transferData.item_id,
          from_warehouse_id: transferData.from_warehouse_id,
          to_warehouse_id: transferData.to_warehouse_id,
          cartons_count: transferData.cartons_count,
          single_bottles_count: transferData.single_bottles_count,
          total_quantity: totalRequestedQuantity.value,
          hasFields: {
            item_id: !!transferData.item_id,
            from_warehouse_id: !!transferData.from_warehouse_id,
            to_warehouse_id: !!transferData.to_warehouse_id,
            cartons_count: !!transferData.cartons_count,
            single_bottles_count: !!transferData.single_bottles_count
          }
        })

        // Use the store transfer action
        const result = await store.dispatch('transferItem', transferData)

        if (result?.id) {
          successMessage.value = 'تم نقل الصنف بنجاح'
          
          // Reset form after successful transfer
          resetForm()
          
          // Emit success and close after delay
          setTimeout(() => {
            emit('success', result)
            emit('close')
          }, 1500)
        } else {
          throw new Error('فشل في عملية النقل')
        }
        
      } catch (err) {
        console.error('❌ Transfer Modal - Error:', err)
        error.value = err.message || 'فشل في عملية النقل. يرجى المحاولة مرة أخرى.'
        
        // More detailed error message
        if (err.message.includes('غير مكتملة')) {
          error.value = 'بيانات النقل غير مكتملة. يرجى التحقق من جميع الحقول المطلوبة.'
        }
      } finally {
        loading.value = false
      }
    }

    // Cleanup on unmount
    onUnmounted(() => {
      if (liveSearchTimeout.value) {
        clearTimeout(liveSearchTimeout.value)
      }
    })

    return {
      // State
      formData,
      loading,
      error,
      successMessage,
      selectedItem,
      searchTerm,
      
      // Live Search State
      isLiveSearching,
      liveSearchResults,
      
      // Computed
      userProfile,
      warehouses,
      isSuperadmin,
      accessiblePrimaryWarehouses,
      availableDestinationWarehouses,
      canViewTransfer,
      canPerformTransfer,
      hasAccessToSelectedWarehouse,
      combinedItems,
      totalRequestedQuantity,
      validationMessage,
      isSubmitDisabled,
      
      // Methods
      selectItem,
      clearSelection,
      onSourceWarehouseChange,
      increaseCartons,
      decreaseCartons,
      increaseSingleBottles,
      decreaseSingleBottles,
      validateCartons,
      validateSingleBottles,
      getWarehouseName,
      getWarehouseType,
      getStockClass,
      isWarehouseAccessible,
      handleSearch,
      handleSubmit,
      closeModal
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

/* Live search indicator animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
