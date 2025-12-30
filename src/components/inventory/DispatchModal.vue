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
              {{ filteredItems.length }} صنف متاح
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <!-- Loading Indicator -->
            <div v-if="isSearching" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div class="w-4 h-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
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
                v-for="item in filteredItems"
                :key="item.id"
                :class="[
                  'grid grid-cols-12 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150',
                  selectedItem?.id === item.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''
                ]"
              >
                <!-- Item Name and Details -->
                <div class="col-span-5 p-3">
                  <div class="font-medium text-sm text-gray-900 dark:text-white">
                    {{ item.name }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex flex-wrap gap-2">
                    <span v-if="item.color">{{ item.color }}</span>
                    <span v-if="item.supplier" class="text-gray-400 dark:text-gray-500">المورد: {{ item.supplier }}</span>
                    <span v-if="item.item_location" class="text-gray-400 dark:text-gray-500">مكان: {{ item.item_location }}</span>
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
                    :disabled="loading || (!isSuperadmin && !canPerformDispatch) || item.remaining_quantity <= 0"
                    :class="[
                      'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-200',
                      selectedItem?.id === item.id
                        ? 'bg-blue-600 dark:bg-blue-700 text-white'
                        : item.remaining_quantity <= 0 || (!isSuperadmin && !canPerformDispatch)
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50'
                    ]"
                  >
                    {{ selectedItem?.id === item.id ? 'محدد' : 'اختر' }}
                  </button>
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="isSearching && filteredItems.length === 0" class="p-8 text-center">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p class="text-sm text-gray-600 dark:text-gray-400">جاري البحث عن الأصناف...</p>
              </div>

              <!-- Empty State -->
              <div v-if="filteredItems.length === 0 && !isSearching" class="p-8 text-center">
                <svg class="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
                </svg>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {{ form.sourceWarehouse ? 'لا توجد أصناف مطابقة للبحث' : 'يرجى اختيار مخزن أولاً' }}
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
              <div class="text-sm font-medium text-blue-900 dark:text-blue-200">{{ selectedItem.name }}</div>
            </div>
            <div>
              <div class="text-xs text-blue-600 dark:text-blue-400">الكود</div>
              <div class="text-sm font-medium text-blue-900 dark:text-blue-200">{{ selectedItem.code }}</div>
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
              <div class="text-sm font-medium" :class="getStockClass(selectedItem.remaining_quantity)">
                {{ selectedItem.remaining_quantity }}
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
                  (الحد الأقصى: {{ selectedItem.remaining_quantity }})
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
                  :max="selectedItem.remaining_quantity"
                  min="1"
                  required
                  :disabled="loading"
                  class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                <button
                  @click="increaseQuantity"
                  :disabled="loading || form.quantity >= selectedItem.remaining_quantity"
                  class="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </button>
              </div>
              <div class="flex items-center justify-between mt-2">
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  سيتبقى بعد الصرف: {{ selectedItem.remaining_quantity - form.quantity }}
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
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
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
    
    // State
    const loading = ref(false)
    const error = ref('')
    const successMessage = ref('')
    const selectedItem = ref(null)
    const searchTerm = ref('')
    const dispatchWarehouses = ref([])
    
    // Search State
    const isSearching = ref(false)
    const searchTimeout = ref(null)

    // Form
    const form = reactive({
      sourceWarehouse: '',
      destinationBranch: '',
      quantity: 1,
      notes: '',
      priority: 'normal'
    })

    // Priority options
    const priorityOptions = [
      { 
        value: 'normal', 
        label: 'عادية', 
        icon: '⏱️',
        bgClass: 'bg-blue-50 dark:bg-blue-900/30',
        borderClass: 'border-blue-300 dark:border-blue-700',
        textClass: 'text-blue-700 dark:text-blue-300',
        iconClass: 'text-blue-500 dark:text-blue-400'
      },
      { 
        value: 'high', 
        label: 'عالية', 
        icon: '⚠️',
        bgClass: 'bg-orange-50 dark:bg-orange-900/30',
        borderClass: 'border-orange-300 dark:border-orange-700',
        textClass: 'text-orange-700 dark:text-orange-300',
        iconClass: 'text-orange-500 dark:text-orange-400'
      },
      { 
        value: 'urgent', 
        label: 'عاجلة', 
        icon: '🚨',
        bgClass: 'bg-red-50 dark:bg-red-900/30',
        borderClass: 'border-red-300 dark:border-red-700',
        textClass: 'text-red-700 dark:text-red-300',
        iconClass: 'text-red-500 dark:text-red-400'
      }
    ]

    // Search configuration - EXACTLY matches store's SEARCH_CONFIG.FIELDS
    const SEARCH_FIELDS = ['name', 'code', 'color', 'supplier', 'item_location', 'warehouse_id']
    const MIN_SEARCH_CHARS = 2
    const SEARCH_DEBOUNCE = 300

    // Computed properties
    const userProfile = computed(() => store.state.userProfile)
    const warehouses = computed(() => store.state.warehouses || [])
    const inventory = computed(() => store.state.inventory || [])
    
    // Get source warehouses that the user can dispatch FROM
    const accessibleSourceWarehouses = computed(() => {
      try {
        const allWarehouses = warehouses.value
        
        if (!userProfile.value) return []
        
        // SUPERADMIN: Can dispatch from any primary warehouse
        if (isSuperadmin.value) {
          return allWarehouses.filter(w => 
            w.status === 'active' && 
            (w.type === 'primary' || !w.type)
          )
        }
        
        // WAREHOUSE MANAGER: Can dispatch only from allowed warehouses
        if (userProfile.value.role === 'warehouse_manager') {
          const allowedWarehouses = userProfile.value.allowed_warehouses || []
          
          if (allowedWarehouses.length === 0) return []
          
          // If manager has "all" access
          if (allowedWarehouses.includes('all')) {
            return allWarehouses.filter(w => 
              w.status === 'active' && 
              (w.type === 'primary' || !w.type)
            )
          }
          
          // Filter by allowed warehouses
          return allWarehouses.filter(w => 
            w.status === 'active' && 
            (w.type === 'primary' || !w.type) &&
            allowedWarehouses.includes(w.id)
          )
        }
        
        // COMPANY MANAGER and others: Can dispatch from all active primary warehouses
        if (['company_manager', 'superadmin'].includes(userProfile.value.role)) {
          return allWarehouses.filter(w => 
            w.status === 'active' && 
            (w.type === 'primary' || !w.type)
          )
        }
        
        return []
      } catch (err) {
        console.error('Error getting accessible source warehouses:', err)
        return []
      }
    })
    
    // Get dispatch destinations
    const dispatchDestinations = computed(() => {
      try {
        return dispatchWarehouses.value
          .filter(w => w.status !== 'inactive')
          .map(w => {
            // Choose icon based on name or ID
            let icon = '📍' // default icon
            const nameLower = w.name_ar?.toLowerCase() || w.name?.toLowerCase() || ''
            const idLower = w.id?.toLowerCase() || ''
            
            if (nameLower.includes('مصنع') || idLower.includes('factory')) {
              icon = '🏭'
            } else if (nameLower.includes('مخزن') || idLower.includes('warehouse')) {
              icon = '🏪'
            } else if (nameLower.includes('فرع') || idLower.includes('branch')) {
              icon = '🏬'
            } else if (nameLower.includes('محل') || idLower.includes('shop')) {
              icon = '🏪'
            } else if (nameLower.includes('مكتب') || idLower.includes('office')) {
              icon = '🏢'
            } else if (nameLower.includes('سوبرماركت') || nameLower.includes('هايبر')) {
              icon = '🛒'
            } else if (nameLower.includes('عميل') || nameLower.includes('customer')) {
              icon = '👤'
            } else if (nameLower.includes('شركة') || nameLower.includes('company')) {
              icon = '🏢'
            }
            
            return {
              id: w.id,
              name_ar: w.name_ar || w.name || w.id,
              icon: icon,
              description: w.description,
              location: w.location,
              type: w.type || 'dispatch'
            }
          })
      } catch (err) {
        console.error('Error getting dispatch destinations:', err)
        return []
      }
    })
    
    // Check if user is superadmin
    const isSuperadmin = computed(() => {
      return userProfile.value?.role === 'superadmin'
    })
    
    // All users can VIEW the modal
    const canViewDispatch = computed(() => {
      if (!userProfile.value) return false
      return userProfile.value.is_active === true
    })
    
    // Only superadmin and warehouse managers with dispatch permission can PERFORM dispatch
    const canPerformDispatch = computed(() => {
      if (!userProfile.value) return false
      
      if (isSuperadmin.value) return true
      
      // Warehouse managers need permission
      if (userProfile.value.role === 'warehouse_manager') {
        return userProfile.value.permissions?.includes('dispatch_items') || 
               userProfile.value.permissions?.includes('full_access')
      }
      
      // Company managers can also dispatch
      if (userProfile.value.role === 'company_manager') {
        return true
      }
      
      return false
    })
    
    // Check if user has access to selected warehouse for dispatch
    const hasAccessToSelectedWarehouse = computed(() => {
      if (!userProfile.value || !form.sourceWarehouse) return false
      
      if (isSuperadmin.value) return true
      
      // Warehouse managers can only dispatch from allowed warehouses
      if (userProfile.value.role === 'warehouse_manager') {
        const allowedWarehouses = userProfile.value.allowed_warehouses || []
        return allowedWarehouses.includes('all') || allowedWarehouses.includes(form.sourceWarehouse)
      }
      
      // Company managers can dispatch from all warehouses
      if (userProfile.value.role === 'company_manager') {
        return true
      }
      
      return false
    })

    // Available items in selected warehouse
    const availableItems = computed(() => {
      if (!form.sourceWarehouse) {
        return []
      }
      
      return inventory.value.filter(item => 
        item.warehouse_id === form.sourceWarehouse && 
        item.remaining_quantity > 0
      )
    })

    // **COMPREHENSIVE SEARCH FUNCTION - MATCHES STORE'S LOGIC**
    const searchLocalInventory = () => {
      if (!searchTerm.value || searchTerm.value.trim().length < MIN_SEARCH_CHARS) {
        return availableItems.value
      }
      
      const searchTermLower = searchTerm.value.toLowerCase().trim()
      
      // Search across ALL fields exactly like the store does
      return availableItems.value.filter(item => {
        return SEARCH_FIELDS.some(field => {
          const value = item[field]
          if (!value) return false
          
          const fieldValue = String(value).toLowerCase()
          
          // Exact match
          if (fieldValue === searchTermLower) return true
          
          // Starts with
          if (fieldValue.startsWith(searchTermLower)) return true
          
          // Contains
          if (fieldValue.includes(searchTermLower)) return true
          
          // Multi-word fuzzy matching (like store does)
          const itemWords = fieldValue.split(/\s+/)
          const searchWords = searchTermLower.split(/\s+/)
          
          return searchWords.some(searchWord =>
            itemWords.some(itemWord => itemWord.includes(searchWord))
          )
        })
      })
    }

    // Filtered items with comprehensive search
    const filteredItems = computed(() => {
      const results = searchLocalInventory()
      
      // Sort by relevance - EXACTLY like store's logic
      return results.sort((a, b) => {
        const searchTermLower = searchTerm.value?.toLowerCase() || ''
        
        // 1. Exact code match gets highest priority
        if (a.code?.toLowerCase() === searchTermLower) return -1
        if (b.code?.toLowerCase() === searchTermLower) return 1
        
        // 2. Exact name match
        if (a.name?.toLowerCase() === searchTermLower) return -1
        if (b.name?.toLowerCase() === searchTermLower) return 1
        
        // 3. Code starts with search term
        const aCodeStarts = a.code?.toLowerCase().startsWith(searchTermLower)
        const bCodeStarts = b.code?.toLowerCase().startsWith(searchTermLower)
        if (aCodeStarts && !bCodeStarts) return -1
        if (!aCodeStarts && bCodeStarts) return 1
        
        // 4. Name starts with search term
        const aNameStarts = a.name?.toLowerCase().startsWith(searchTermLower)
        const bNameStarts = b.name?.toLowerCase().startsWith(searchTermLower)
        if (aNameStarts && !bNameStarts) return -1
        if (!aNameStarts && bNameStarts) return 1
        
        // 5. Other fields match
        const aOtherMatch = a.color?.toLowerCase().includes(searchTermLower) || 
                           a.supplier?.toLowerCase().includes(searchTermLower) ||
                           a.item_location?.toLowerCase().includes(searchTermLower)
        const bOtherMatch = b.color?.toLowerCase().includes(searchTermLower) || 
                           b.supplier?.toLowerCase().includes(searchTermLower) ||
                           b.item_location?.toLowerCase().includes(searchTermLower)
        if (aOtherMatch && !bOtherMatch) return -1
        if (!aOtherMatch && bOtherMatch) return 1
        
        // 6. Sort by remaining quantity (higher first)
        return (b.remaining_quantity || 0) - (a.remaining_quantity || 0)
      })
    })

    // Submit button disabled logic
    const isSubmitDisabled = computed(() => {
      if (loading.value) return true
      
      if (isSuperadmin.value) {
        return !selectedItem.value || 
               !form.destinationBranch || 
               !form.sourceWarehouse ||
               form.quantity <= 0
      }
      
      return !selectedItem.value || 
             !form.destinationBranch || 
             !form.sourceWarehouse || 
             !canPerformDispatch.value ||
             form.quantity > (selectedItem.value?.remaining_quantity || 0) ||
             form.quantity <= 0 ||
             !hasAccessToSelectedWarehouse.value
    })

    // Helper functions
    const getWarehouseName = (warehouseId) => {
      const warehouse = warehouses.value.find(w => w.id === warehouseId)
      return warehouse ? warehouse.name_ar : warehouseId
    }
    
    const getWarehouseIcon = (warehouse) => {
      const nameLower = warehouse.name_ar?.toLowerCase() || warehouse.name?.toLowerCase() || ''
      const idLower = warehouse.id?.toLowerCase() || ''
      
      if (nameLower.includes('مصنع') || idLower.includes('factory')) return '🏭'
      if (nameLower.includes('مخزن') || idLower.includes('warehouse')) return '🏪'
      if (nameLower.includes('فرع') || idLower.includes('branch')) return '🏬'
      if (nameLower.includes('محل') || idLower.includes('shop')) return '🏪'
      if (nameLower.includes('مكتب') || idLower.includes('office')) return '🏢'
      if (nameLower.includes('سوبرماركت') || nameLower.includes('هايبر')) return '🛒'
      if (nameLower.includes('عميل') || nameLower.includes('customer')) return '👤'
      if (nameLower.includes('شركة') || nameLower.includes('company')) return '🏢'
      return '📍'
    }
    
    const getWarehouseType = (warehouseId) => {
      const warehouse = warehouses.value.find(w => w.id === warehouseId)
      if (!warehouse) return ''
      if (warehouse.is_main) return 'رئيسي ⭐'
      if (warehouse.type === 'primary') return 'مخزن رئيسي'
      if (warehouse.type === 'dispatch') return 'موقع صرف 🚚'
      return warehouse.type || ''
    }
    
    const getDestinationName = (destinationId) => {
      const destination = dispatchDestinations.value.find(d => d.id === destinationId)
      return destination ? destination.name_ar : destinationId
    }

    const getStockClass = (quantity) => {
      if (quantity === 0) return 'text-red-600 dark:text-red-400'
      if (quantity < 10) return 'text-yellow-600 dark:text-yellow-400'
      return 'text-green-600 dark:text-green-400'
    }
    
    // Check if warehouse is accessible for dispatch
    const isWarehouseAccessible = (warehouseId) => {
      if (!userProfile.value) return false
      
      if (isSuperadmin.value) return true
      
      // Warehouse managers can only access allowed warehouses
      if (userProfile.value.role === 'warehouse_manager') {
        const allowedWarehouses = userProfile.value.allowed_warehouses || []
        return allowedWarehouses.includes('all') || allowedWarehouses.includes(warehouseId)
      }
      
      // Company managers can access all warehouses
      if (userProfile.value.role === 'company_manager') {
        return true
      }
      
      return false
    }

    // Debounced search handler
    const debouncedSearch = debounce(() => {
      isSearching.value = false
    }, SEARCH_DEBOUNCE)
    
    // Handle search input
    const handleSearch = () => {
      // Clear any existing timeout
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
      }
      
      isSearching.value = true
      
      // Debounce the search
      searchTimeout.value = setTimeout(() => {
        isSearching.value = false
      }, SEARCH_DEBOUNCE)
    }

    // Load dispatch warehouses directly from Firestore
    const loadDispatchWarehouses = async () => {
      try {
        console.log('🔄 Loading dispatch warehouses...')
        
        // Use store action
        const warehouses = await store.dispatch('getDispatchWarehouses')
        if (warehouses && warehouses.length > 0) {
          dispatchWarehouses.value = warehouses
          console.log('✅ Dispatch warehouses loaded:', warehouses.length)
          return
        }
        
        // Fallback
        const allWarehouses = warehouses.value
        const dispatchWarehousesFiltered = allWarehouses.filter(w => 
          w.type === 'dispatch' && w.status !== 'inactive'
        )
        
        dispatchWarehouses.value = dispatchWarehousesFiltered
        console.log('⚠️ Using fallback dispatch warehouses:', dispatchWarehousesFiltered.length)
        
      } catch (error) {
        console.error('❌ Error loading dispatch warehouses:', error)
        const allWarehouses = warehouses.value
        const dispatchWarehousesFiltered = allWarehouses.filter(w => 
          w.type === 'dispatch' && w.status !== 'inactive'
        )
        dispatchWarehouses.value = dispatchWarehousesFiltered
      }
    }

    // Methods
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
      isSearching.value = false
    }

    const closeModal = () => {
      if (!loading.value) {
        resetForm()
        emit('close')
      }
    }

    const selectItem = (item) => {
      if (!isSuperadmin.value && !canPerformDispatch.value) {
        error.value = 'ليس لديك صلاحية لاختيار الأصناف للصرف'
        return
      }
      
      if (selectedItem.value?.id === item.id) {
        selectedItem.value = null
      } else {
        selectedItem.value = item
        form.quantity = Math.min(1, item.remaining_quantity || 1)
      }
    }

    const clearSelection = () => {
      selectedItem.value = null
    }

    const onWarehouseChange = () => {
      selectedItem.value = null
      searchTerm.value = ''
      error.value = ''
    }

    const increaseQuantity = () => {
      if (!isSuperadmin.value && !canPerformDispatch.value) {
        error.value = 'ليس لديك صلاحية لتعديل الكميات'
        return
      }
      
      const max = selectedItem.value?.remaining_quantity || 0
      if (form.quantity < max) {
        form.quantity++
      }
    }

    const decreaseQuantity = () => {
      if (!isSuperadmin.value && !canPerformDispatch.value) {
        error.value = 'ليس لديك صلاحية لتعديل الكميات'
        return
      }
      
      if (form.quantity > 1) {
        form.quantity--
      }
    }
    
    const setMaxQuantity = () => {
      if (!isSuperadmin.value && !canPerformDispatch.value) {
        error.value = 'ليس لديك صلاحية لتعديل الكميات'
        return
      }
      
      const max = selectedItem.value?.remaining_quantity || 0
      form.quantity = max
    }

    // Watch for prop changes
    watch(() => props.isOpen, (newVal) => {
      if (newVal) {
        resetForm()
        
        // Load dispatch warehouses when modal opens
        if (dispatchWarehouses.value.length === 0) {
          loadDispatchWarehouses()
        }
        
        if (props.item && (isSuperadmin.value || canPerformDispatch.value)) {
          selectItem(props.item)
          form.sourceWarehouse = props.item.warehouse_id
        }
      }
    })

    watch(() => props.item, (newItem) => {
      if (newItem && props.isOpen && (isSuperadmin.value || canPerformDispatch.value)) {
        selectItem(newItem)
        form.sourceWarehouse = newItem.warehouse_id
      }
    })

    // Watch quantity changes
    watch(() => form.quantity, (newQuantity) => {
      if (selectedItem.value) {
        const max = selectedItem.value.remaining_quantity || 0
        if (newQuantity > max) {
          form.quantity = max
        } else if (newQuantity < 1) {
          form.quantity = 1
        }
      }
    })

    const handleSubmit = async () => {
      // Reset messages
      error.value = ''
      successMessage.value = ''
      
      // Check if user can perform dispatch
      if (!isSuperadmin.value && !canPerformDispatch.value) {
        error.value = 'ليس لديك صلاحية لصرف الأصناف'
        return
      }
      
      // Check if user has access to selected warehouse
      if (!isSuperadmin.value && userProfile.value?.role === 'warehouse_manager' && !hasAccessToSelectedWarehouse.value) {
        error.value = 'ليس لديك صلاحية للصرف من هذا المخزن'
        return
      }

      // Validation
      const errors = []
      
      if (!form.sourceWarehouse) {
        errors.push('يرجى اختيار المخزن المصدر')
      }
      
      if (!form.destinationBranch) {
        errors.push('يرجى اختيار الوجهة')
      }
      
      // Check if destination exists
      const destinationExists = dispatchDestinations.value.some(d => d.id === form.destinationBranch)
      if (!destinationExists) {
        errors.push('الوجهة المحددة غير موجودة أو غير نشطة')
      }
      
      if (!selectedItem.value) {
        errors.push('يرجى اختيار صنف للصرف')
      }
      
      if (!form.quantity || form.quantity <= 0) {
        errors.push('يرجى إدخال كمية صحيحة')
      }
      
      // Check quantity limit for non-superadmin users
      if (!isSuperadmin.value) {
        const maxQuantity = selectedItem.value?.remaining_quantity || 0
        if (form.quantity > maxQuantity) {
          errors.push(`الكمية المطلوبة (${form.quantity}) تتجاوز الكمية المتاحة (${maxQuantity})`)
        }
      }
      
      if (errors.length > 0) {
        error.value = errors.join('، ')
        return
      }

      loading.value = true

      try {
        // Get destination name
        const destination = dispatchDestinations.value.find(d => d.id === form.destinationBranch)
        const destinationName = destination ? destination.name_ar : form.destinationBranch

        // Prepare dispatch data
        const dispatchData = {
          item_id: selectedItem.value.id,
          from_warehouse_id: form.sourceWarehouse,
          destination: destinationName,
          
          // Quantity fields
          cartons_count: 0,
          per_carton_count: 12,
          single_bottles_count: form.quantity,
          
          // Additional info
          notes: form.notes || 'إرسال إلى فرع',
          priority: form.priority,
          
          // Optional but good to have
          item_name: selectedItem.value.name,
          item_code: selectedItem.value.code,
          from_warehouse_name: getWarehouseName(form.sourceWarehouse),
          destination_id: form.destinationBranch,
          destination_name: destinationName,
          
          // User info
          user_id: store.state.user?.uid,
          user_role: userProfile.value?.role,
          user_name: userProfile.value?.name
        }

        console.log('📦 Dispatching item:', {
          item_id: dispatchData.item_id,
          from_warehouse_id: dispatchData.from_warehouse_id,
          destination: dispatchData.destination,
          quantity: dispatchData.single_bottles_count
        })

        // Use the store dispatch action
        const result = await store.dispatch('dispatchItem', dispatchData)

        if (result?.success) {
          successMessage.value = 'تم صرف الصنف بنجاح'
          
          // Reset form after successful dispatch
          resetForm()
          
          // Emit success and close after delay
          setTimeout(() => {
            emit('success', result)
            emit('close')
          }, 1500)
        } else {
          throw new Error(result?.error || 'فشل في عملية الصرف')
        }
        
      } catch (err) {
        console.error('❌ Dispatch Modal - Error:', err)
        error.value = err.message || 'فشل في عملية الصرف. يرجى المحاولة مرة أخرى.'
        
        // More detailed error message
        if (err.message.includes('غير مكتملة')) {
          error.value = 'بيانات الإرسال غير مكتملة. يرجى التحقق من جميع الحويد المطلوبة.'
        } else if (err.message.includes('صلاحية')) {
          error.value = 'ليس لديك الصلاحية لإجراء هذه العملية'
        }
      } finally {
        loading.value = false
      }
    }

    // Load dispatch warehouses when component is mounted
    onMounted(async () => {
      try {
        // Load dispatch warehouses
        await loadDispatchWarehouses()
        
        console.log('Dispatch Modal mounted', {
          dispatchWarehousesCount: dispatchWarehouses.value.length,
          accessibleSourceWarehousesCount: accessibleSourceWarehouses.value.length,
          userRole: userProfile.value?.role,
          canPerformDispatch: canPerformDispatch.value
        })
      } catch (error) {
        console.log('Could not load dispatch warehouses:', error.message)
      }
    })
    
    // Cleanup on unmount
    onUnmounted(() => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
      }
    })

    return {
      // State
      form,
      loading,
      error,
      successMessage,
      selectedItem,
      searchTerm,
      dispatchWarehouses,
      
      // Search State
      isSearching,
      
      // Computed
      userProfile,
      warehouses,
      isSuperadmin,
      dispatchDestinations,
      accessibleSourceWarehouses,
      priorityOptions,
      availableItems,
      filteredItems,
      canViewDispatch,
      canPerformDispatch,
      hasAccessToSelectedWarehouse,
      isSubmitDisabled,
      
      // Methods
      selectItem,
      clearSelection,
      onWarehouseChange,
      increaseQuantity,
      decreaseQuantity,
      setMaxQuantity,
      getWarehouseName,
      getWarehouseType,
      getDestinationName,
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
