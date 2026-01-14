<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-50" @close="closeModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-2 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel 
              :class="[
                'relative transform overflow-hidden rounded-xl sm:rounded-2xl bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full',
                'mx-2 my-2 sm:my-8 max-w-full sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl max-h-[95vh] sm:max-h-[90vh] flex flex-col'
              ]"
            >
              <!-- Header - Sticky on Mobile -->
              <div class="sticky top-0 z-30 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <DialogTitle class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {{ isCreating ? 'إضافة صنف جديد' : 'تعديل الصنف' }}
                      <span v-if="selectedItem && !isCreating" class="text-xs sm:text-sm font-normal text-gray-500 dark:text-gray-400 ml-2 hidden sm:inline">
                        ({{ selectedItem.name }} - {{ selectedItem.code }})
                      </span>
                    </DialogTitle>
                    <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">
                      {{ isCreating ? 'اختر المخزن ثم ابحث عن الصنف لتحريره أو إضافة صنف جديد' : 'قم بتعديل الحقول المطلوبة فقط، سيتم حفظ التغييرات فقط' }}
                    </p>
                  </div>
                  <button
                    type="button"
                    class="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-3 flex-shrink-0"
                    @click="closeModal"
                  >
                    <span class="sr-only">إغلاق</span>
                    <XIcon class="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>
              </div>

              <!-- Mobile Tabs for Panel Switching -->
              <div v-if="showMobileTabs" class="sm:hidden border-b border-gray-200 dark:border-gray-700">
                <div class="flex">
                  <button
                    @click="activeMobileTab = 'search'"
                    :class="[
                      'flex-1 py-3 text-sm font-medium border-b-2 transition-colors',
                      activeMobileTab === 'search'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    ]"
                  >
                    <div class="flex items-center justify-center">
                      <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                      البحث
                    </div>
                  </button>
                  <button
                    @click="activeMobileTab = 'form'"
                    :class="[
                      'flex-1 py-3 text-sm font-medium border-b-2 transition-colors',
                      activeMobileTab === 'form'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    ]"
                    :disabled="!selectedWarehouseId || (!isCreating && !selectedItem)"
                  >
                    <div class="flex items-center justify-center">
                      <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                      {{ isCreating ? 'إضافة' : 'تعديل' }}
                    </div>
                  </button>
                </div>
              </div>

              <!-- Main Content - FIXED SCROLLING -->
              <div class="flex-1 min-h-0 overflow-hidden flex flex-col sm:flex-row">
                <!-- Left Panel: Warehouse Selection & Item Search -->
                <div 
                  :class="[
                    'w-full sm:w-1/3 lg:w-2/5 xl:w-1/3 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50',
                    'transition-all duration-300 ease-in-out min-h-0 flex flex-col',
                    showMobileTabs && activeMobileTab !== 'search' ? 'hidden sm:flex' : 'flex'
                  ]"
                >
                  <div class="flex-1 overflow-y-auto p-4 sm:p-6">
                    <!-- Warehouse Selection - FIXED: Now selectable -->
                    <div class="mb-6">
                      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                        <span class="h-5 w-5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-xs ml-2">1</span>
                        اختر المخزن
                      </h3>
                      <select
                        v-model="selectedWarehouseId"
                        @change="onWarehouseChange"
                        class="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors duration-200 cursor-pointer"
                      >
                        <option value="">اختر المخزن</option>
                        <option 
                          v-for="warehouse in accessibleWarehouses" 
                          :key="warehouse.id" 
                          :value="warehouse.id"
                          class="bg-white dark:bg-gray-700"
                        >
                          {{ warehouse.name_ar }}
                        </option>
                      </select>
                      <p v-if="selectedWarehouse" class="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                        <svg class="w-4 h-4 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                        <span class="truncate">{{ selectedWarehouse.name_ar }} - {{ selectedWarehouse.type === 'primary' ? 'مخزن رئيسي' : 'موقع صرف' }}</span>
                      </p>
                    </div>

                    <!-- Item Search - FIXED: Now typable -->
                    <div v-if="selectedWarehouseId" class="mb-6">
                      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                        <span class="h-5 w-5 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center text-xs ml-2">2</span>
                        ابحث عن الصنف
                      </h3>

                      <!-- Search Input with Live Search Indicator - FIXED: Removed disabled attribute -->
                      <div class="relative mb-4">
                        <input
                          v-model="searchTerm"
                          @input="handleSearch"
                          type="text"
                          placeholder="ابحث بالاسم، الكود، اللون، المورد..."
                          class="w-full pr-10 pl-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors duration-200"
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

                      <!-- Items Count & Mobile Controls -->
                      <div class="flex items-center justify-between mb-3">
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                          {{ combinedItems.length }} صنف متاح
                          <span v-if="liveSearchResults.length > 0" class="text-blue-600 dark:text-blue-400">
                            ({{ liveSearchResults.length }} من البحث المباشر)
                          </span>
                        </span>
                        <div class="flex items-center space-x-2 space-x-reverse">
                          <button
                            v-if="!isCreating && combinedItems.length > 5"
                            @click="showAllItems = !showAllItems"
                            class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30"
                          >
                            {{ showAllItems ? 'إخفاء' : 'عرض الكل' }}
                          </button>
                          <button
                            v-if="userCanEdit && isCreating"
                            @click="createNewItem"
                            class="text-xs text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 px-2 py-1 rounded hover:bg-green-50 dark:hover:bg-green-900/30 flex items-center"
                          >
                            <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                            </svg>
                            جديد
                          </button>
                        </div>
                      </div>

                      <!-- Items List with Mobile Optimized Layout -->
                      <div v-if="combinedItems.length > 0" class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <!-- Mobile Cards View -->
                        <div class="sm:hidden max-h-64 overflow-y-auto">
                          <div
                            v-for="item in (showAllItems ? combinedItems : combinedItems.slice(0, 5))"
                            :key="item.id"
                            @click="selectItemForEdit(item)"
                            :class="[
                              'p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-150',
                              selectedItem?.id === item.id ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' : '',
                              item.isLiveSearchResult ? 'bg-green-50/30 dark:bg-green-900/5 border-green-100 dark:border-green-800' : ''
                            ]"
                          >
                            <div class="flex items-start justify-between">
                              <div class="flex-1 min-w-0">
                                <div class="flex items-center">
                                  <div class="font-medium text-sm text-gray-900 dark:text-white truncate">
                                    {{ item.name }}
                                  </div>
                                  <span v-if="item.isLiveSearchResult" class="text-xs bg-blue-500 text-white px-1 py-0.5 rounded mr-2 flex-shrink-0">
                                    🔍
                                  </span>
                                </div>
                                <div class="flex items-center mt-1">
                                  <span class="text-xs font-mono bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                                    {{ item.code }}
                                  </span>
                                  <span class="text-xs text-gray-500 dark:text-gray-400 mx-2">|</span>
                                  <span class="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {{ item.color }}
                                  </span>
                                </div>
                              </div>
                              <div class="ml-3 flex-shrink-0">
                                <span :class="[
                                  'text-sm font-medium px-2 py-1 rounded',
                                  getStockClass(item.remaining_quantity).includes('red') ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                  getStockClass(item.remaining_quantity).includes('yellow') ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                                  'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                ]">
                                  {{ item.remaining_quantity }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Desktop Table View -->
                        <div class="hidden sm:block">
                          <!-- Table Header -->
                          <div class="grid grid-cols-12 bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                            <div class="col-span-5 p-3">الصنف</div>
                            <div class="col-span-3 p-3 text-center">الكود</div>
                            <div class="col-span-4 p-3 text-center">المتاح</div>
                          </div>

                          <!-- Table Body -->
                          <div class="max-h-64 overflow-y-auto">
                            <div
                              v-for="item in (showAllItems ? combinedItems : combinedItems.slice(0, 5))"
                              :key="item.id"
                              @click="selectItemForEdit(item)"
                              :class="[
                                'grid grid-cols-12 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-150',
                                selectedItem?.id === item.id ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' : '',
                                item.isLiveSearchResult ? 'bg-green-50/30 dark:bg-green-900/5 border-green-100 dark:border-green-800' : ''
                              ]"
                            >
                              <div class="col-span-5 p-3">
                                <div class="font-medium text-sm text-gray-900 dark:text-white truncate flex items-center">
                                  {{ item.name }}
                                  <span v-if="item.isLiveSearchResult" class="text-xs bg-blue-500 text-white px-1 py-0.5 rounded mr-2">
                                    🔍
                                  </span>
                                </div>
                                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                  <span class="ml-2">{{ item.color }}</span>
                                  <span v-if="item.supplier" class="text-gray-400 dark:text-gray-500 mr-2">| مورد: {{ item.supplier }}</span>
                                </div>
                              </div>
                              <div class="col-span-3 p-3 text-center">
                                <span class="text-xs font-mono bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">{{ item.code }}</span>
                              </div>
                              <div class="col-span-4 p-3 text-center">
                                <span :class="[
                                  'text-sm font-medium',
                                  getStockClass(item.remaining_quantity)
                                ]">
                                  {{ item.remaining_quantity }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Show More Indicator -->
                        <div v-if="!showAllItems && combinedItems.length > 5" 
                          @click="showAllItems = true"
                          class="p-3 text-center border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-150"
                        >
                          <span class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                            عرض {{ combinedItems.length - 5 }} صنف إضافي...
                          </span>
                        </div>
                      </div>

                      <!-- Empty State -->
                      <div v-else-if="!isLiveSearching" class="text-center py-8 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <svg class="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                        </svg>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">لا توجد أصناف في هذا المخزن</p>
                        <button
                          v-if="userCanEdit"
                          @click="createNewItem"
                          class="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                        >
                          + إضافة صنف جديد
                        </button>
                      </div>
                    </div>

                    <!-- Selected Item Info -->
                    <div v-if="selectedItem && !isCreating" class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl">
                      <div class="flex items-center justify-between mb-3">
                        <h5 class="text-sm font-medium text-blue-800 dark:text-blue-300">الصنف المحدد</h5>
                        <div class="flex items-center gap-2">
                          <button
                            @click="clearSelection"
                            class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          >
                            تغيير
                          </button>
                        </div>
                      </div>
                      <div class="space-y-2">
                        <div class="flex items-center justify-between">
                          <span class="text-xs text-blue-600 dark:text-blue-400">الاسم:</span>
                          <span class="text-sm font-medium text-blue-900 dark:text-blue-300 truncate ml-2">{{ selectedItem.name }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-xs text-blue-600 dark:text-blue-400">الكود:</span>
                          <span class="text-sm font-medium text-blue-900 dark:text-blue-300">{{ selectedItem.code }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-xs text-blue-600 dark:text-blue-400">المتاح:</span>
                          <span :class="[
                            'text-sm font-medium',
                            getStockClass(selectedItem.remaining_quantity)
                          ]">
                            {{ selectedItem.remaining_quantity }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Right Panel: Item Editing Form - FIXED SCROLLING -->
                <div 
                  :class="[
                    'w-full sm:w-2/3 lg:w-3/5 xl:w-2/3',
                    'transition-all duration-300 ease-in-out min-h-0 flex flex-col',
                    showMobileTabs && activeMobileTab !== 'form' ? 'hidden sm:flex' : 'flex'
                  ]"
                >
                  <!-- Scrollable form content -->
                  <div class="flex-1 overflow-y-auto">
                    <div class="p-4 sm:p-6">
                      <!-- Form Title -->
                      <div class="mb-6">
                        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                          <span class="h-5 w-5 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center text-xs ml-2">3</span>
                          {{ isCreating ? 'تفاصيل الصنف الجديد' : 'تعديل تفاصيل الصنف' }}
                        </h3>
                        <p v-if="!isCreating" class="text-xs text-gray-500 dark:text-gray-400">
                          قم بتعديل الحقول المطلوبة فقط. الحقول التي لم يتم تغييرها سيتم حفظها كما هي.
                        </p>
                      </div>

                      <!-- Edit Form -->
                      <form v-if="selectedWarehouseId" @submit.prevent="handleSubmit" class="space-y-6">
                        <!-- Changed Fields Indicator -->
                        <div v-if="changedFields.length > 0" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                          <div class="flex items-start">
                            <svg class="h-5 w-5 text-yellow-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <div class="text-sm">
                              <p class="font-medium text-yellow-800 dark:text-yellow-300">الحقول التي سيتم تحديثها:</p>
                              <p class="text-yellow-700 dark:text-yellow-400 mt-1 text-xs sm:text-sm">{{ changedFields.join('، ') }}</p>
                            </div>
                          </div>
                        </div>

                        <!-- Field Validation Errors -->
                        <div v-if="fieldErrors.length > 0" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                          <div class="flex items-start">
                            <ExclamationIcon class="h-5 w-5 text-red-400 flex-shrink-0 ml-2" />
                            <div class="text-sm">
                              <p class="font-medium text-red-800 dark:text-red-300">يجب تعبئة الحقول التالية:</p>
                              <ul class="list-disc mr-4 mt-1 text-red-700 dark:text-red-400 text-xs sm:text-sm">
                                <li v-for="error in fieldErrors" :key="error">{{ error }}</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <!-- Basic Information Grid -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          <!-- Name -->
                          <div class="col-span-1 md:col-span-2">
                            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              اسم الصنف <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                              <input
                                type="text"
                                id="name"
                                v-model="formData.name"
                                required
                                :class="[
                                  'w-full px-3 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm',
                                  isFieldChanged('name') ? 'border-blue-500 dark:border-blue-500' : 'border-gray-300 dark:border-gray-600',
                                  fieldValidation.name ? 'border-red-500 dark:border-red-500' : ''
                                ]"
                                placeholder="أدخل اسم الصنف"
                                @input="clearFieldError('name')"
                              />
                              <span v-if="isFieldChanged('name')" class="absolute top-1/2 transform -translate-y-1/2 left-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                            </div>
                            <p v-if="fieldValidation.name" class="text-xs text-red-600 dark:text-red-400 mt-1">{{ fieldValidation.name }}</p>
                          </div>

                          <!-- Code -->
                          <div>
                            <label for="code" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              الكود <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                              <input
                                type="text"
                                id="code"
                                v-model="formData.code"
                                :disabled="!isCreating"
                                required
                                :class="[
                                  'w-full px-3 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm',
                                  isFieldChanged('code') ? 'border-blue-500 dark:border-blue-500' : 'border-gray-300 dark:border-gray-600',
                                  fieldValidation.code ? 'border-red-500 dark:border-red-500' : ''
                                ]"
                                placeholder="أدخل كود الصنف"
                                @input="clearFieldError('code')"
                              />
                              <span v-if="isFieldChanged('code')" class="absolute top-1/2 transform -translate-y-1/2 left-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                            </div>
                            <p v-if="fieldValidation.code" class="text-xs text-red-600 dark:text-red-400 mt-1">{{ fieldValidation.code }}</p>
                            <p v-if="!isCreating" class="text-xs text-gray-500 dark:text-gray-400 mt-1">لا يمكن تغيير الكود بعد الإنشاء</p>
                          </div>

                          <!-- Color -->
                          <div>
                            <label for="color" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              اللون <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                              <input
                                type="text"
                                id="color"
                                v-model="formData.color"
                                required
                                :class="[
                                  'w-full px-3 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm',
                                  isFieldChanged('color') ? 'border-blue-500 dark:border-blue-500' : 'border-gray-300 dark:border-gray-600',
                                  fieldValidation.color ? 'border-red-500 dark:border-red-500' : ''
                                ]"
                                placeholder="أدخل اللون"
                                @input="clearFieldError('color')"
                              />
                              <span v-if="isFieldChanged('color')" class="absolute top-1/2 transform -translate-y-1/2 left-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                            </div>
                            <p v-if="fieldValidation.color" class="text-xs text-red-600 dark:text-red-400 mt-1">{{ fieldValidation.color }}</p>
                          </div>

                          <!-- Warehouse (Fixed) -->
                          <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              المخزن <span class="text-red-500">*</span>
                            </label>
                            <div :class="[
                              'px-3 py-2.5 border rounded-lg text-gray-900 dark:text-gray-300 text-sm',
                              fieldValidation.warehouse_id ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                            ]">
                              <div class="truncate">{{ selectedWarehouse?.name_ar || 'غير محدد' }}</div>
                              <span v-if="fieldValidation.warehouse_id" class="text-red-600 dark:text-red-400 text-xs block mt-1">{{ fieldValidation.warehouse_id }}</span>
                            </div>
                            <input type="hidden" v-model="formData.warehouse_id" />
                          </div>

                          <!-- Supplier -->
                          <div>
                            <label for="supplier" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              المورد
                            </label>
                            <div class="relative">
                              <input
                                type="text"
                                id="supplier"
                                v-model="formData.supplier"
                                :class="[
                                  'w-full px-3 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm',
                                  isFieldChanged('supplier') ? 'border-blue-500 dark:border-blue-500' : 'border-gray-300 dark:border-gray-600'
                                ]"
                                placeholder="أدخل اسم المورد"
                              />
                              <span v-if="isFieldChanged('supplier')" class="absolute top-1/2 transform -translate-y-1/2 left-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                            </div>
                          </div>

                          <!-- Item Location -->
                          <div>
                            <label for="item_location" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              مكان الصنف في المخزن
                            </label>
                            <div class="relative">
                              <input
                                type="text"
                                id="item_location"
                                v-model="formData.item_location"
                                :class="[
                                  'w-full px-3 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm',
                                  isFieldChanged('item_location') ? 'border-blue-500 dark:border-blue-500' : 'border-gray-300 dark:border-gray-600'
                                ]"
                                placeholder="مثال: الرف العلوي، المنطقة أ"
                              />
                              <span v-if="isFieldChanged('item_location')" class="absolute top-1/2 transform -translate-y-1/2 left-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                            </div>
                          </div>
                        </div>

                        <!-- Quantity Section -->
                        <div class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 sm:p-6">
                          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                            <svg class="w-4 h-4 ml-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                            </svg>
                            إدارة الكميات
                          </h4>

                          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                            <!-- Cartons Count -->
                            <div>
                              <label for="cartons_count" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                عدد الكراتين
                              </label>
                              <div class="relative">
                                <input
                                  type="number"
                                  id="cartons_count"
                                  v-model.number="formData.cartons_count"
                                  min="0"
                                  step="1"
                                  :class="[
                                    'w-full px-3 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm',
                                    isFieldChanged('cartons_count') ? 'border-blue-500 dark:border-blue-500' : 'border-gray-300 dark:border-gray-600'
                                  ]"
                                  placeholder="0"
                                />
                                <span v-if="isFieldChanged('cartons_count')" class="absolute top-1/2 transform -translate-y-1/2 left-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                              </div>
                            </div>

                            <!-- Per Carton Count -->
                            <div>
                              <label for="per_carton_count" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                عدد في الكرتونة
                              </label>
                              <div class="relative">
                                <input
                                  type="number"
                                  id="per_carton_count"
                                  v-model.number="formData.per_carton_count"
                                  min="1"
                                  step="1"
                                  :class="[
                                    'w-full px-3 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm',
                                    isFieldChanged('per_carton_count') ? 'border-blue-500 dark:border-blue-500' : 'border-gray-300 dark:border-gray-600'
                                  ]"
                                  placeholder="12"
                                />
                                <span v-if="isFieldChanged('per_carton_count')" class="absolute top-1/2 transform -translate-y-1/2 left-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                              </div>
                            </div>

                            <!-- Single Bottles Count -->
                            <div>
                              <label for="single_bottles_count" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                عدد القزاز الفردي
                              </label>
                              <div class="relative">
                                <input
                                  type="number"
                                  id="single_bottles_count"
                                  v-model.number="formData.single_bottles_count"
                                  min="0"
                                  step="1"
                                  :class="[
                                    'w-full px-3 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm',
                                    isFieldChanged('single_bottles_count') ? 'border-blue-500 dark:border-blue-500' : 'border-gray-300 dark:border-gray-600'
                                  ]"
                                  placeholder="0"
                                />
                                <span v-if="isFieldChanged('single_bottles_count')" class="absolute top-1/2 transform -translate-y-1/2 left-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                              </div>
                            </div>
                          </div>

                          <!-- Total Quantity Display -->
                          <div class="mt-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div class="flex items-center justify-between">
                              <div>
                                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">إجمالي الكمية</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">محسوب تلقائياً</p>
                              </div>
                              <div class="text-right">
                                <p class="text-xl sm:text-2xl font-bold" :class="isFieldChanged('cartons_count') || isFieldChanged('per_carton_count') || isFieldChanged('single_bottles_count') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'">
                                  {{ totalQuantity }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">وحدة</p>
                              </div>
                            </div>
                            <div v-if="!isCreating && originalItem" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <span :class="originalTotalQuantity === totalQuantity ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'">
                                {{ originalTotalQuantity === totalQuantity ? 'الكمية لم تتغير' : `الكمية السابقة: ${originalTotalQuantity}` }}
                              </span>
                            </div>
                          </div>
                        </div>

                        <!-- Additional Information -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          <!-- Photo URL -->
                          <div class="md:col-span-2">
                            <label for="photo_url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              رابط الصورة (اختياري)
                            </label>
                            <div class="relative">
                              <input
                                type="url"
                                id="photo_url"
                                v-model="formData.photo_url"
                                :class="[
                                  'w-full px-3 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm',
                                  isFieldChanged('photo_url') ? 'border-blue-500 dark:border-blue-500' : 'border-gray-300 dark:border-gray-600'
                                ]"
                                placeholder="https://example.com/image.jpg"
                              />
                              <span v-if="isFieldChanged('photo_url')" class="absolute top-1/2 transform -translate-y-1/2 left-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                            </div>
                            <!-- Image Preview -->
                            <div v-if="formData.photo_url" class="mt-3 flex items-center justify-center">
                              <img 
                                :src="formData.photo_url" 
                                alt="Item preview" 
                                class="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                                @error="handleImageError"
                              />
                            </div>
                          </div>

                          <!-- Notes -->
                          <div class="md:col-span-2">
                            <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              ملاحظات
                            </label>
                            <div class="relative">
                              <textarea
                                id="notes"
                                v-model="formData.notes"
                                rows="3"
                                :class="[
                                  'w-full px-3 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm',
                                  isFieldChanged('notes') ? 'border-blue-500 dark:border-blue-500' : 'border-gray-300 dark:border-gray-600'
                                ]"
                                placeholder="أي ملاحظات إضافية حول الصنف..."
                              ></textarea>
                              <span v-if="isFieldChanged('notes')" class="absolute top-3 left-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                            </div>
                          </div>
                        </div>

                        <!-- Error Message -->
                        <div v-if="error" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <div class="flex items-center">
                            <ExclamationIcon class="h-5 w-5 text-red-400 ml-2 flex-shrink-0" />
                            <p class="text-sm text-red-800 dark:text-red-300">{{ error }}</p>
                          </div>
                        </div>
                      </form>

                      <!-- No Warehouse Selected State -->
                      <div v-else class="text-center py-8 sm:py-12">
                        <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                        </svg>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">يجب اختيار المخزن أولاً لعرض نماذج التعديل</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Fixed Footer - Mobile Optimized -->
              <div class="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 sm:py-4">
                <div class="flex items-center justify-between">
                  <div class="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                    <span v-if="changedFields.length > 0">
                      {{ changedFields.length }} حقل سيتم تحديثه
                    </span>
                    <span v-else-if="selectedItem">
                      لم يتم إجراء أي تغييرات
                    </span>
                  </div>
                  <div class="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      @click="closeModal"
                      :disabled="loading"
                      class="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      إلغاء
                    </button>
                    <button
                      v-if="!isCreating && canDelete && selectedItem"
                      type="button"
                      @click="confirmDelete"
                      :disabled="loading"
                      class="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      حذف
                    </button>
                    <button
                      type="button"
                      @click="resetFormChanges"
                      :disabled="loading || changedFields.length === 0"
                      class="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      إعادة تعيين
                    </button>
                    <button
                      type="submit"
                      @click="handleSubmit"
                      :disabled="loading || !selectedWarehouseId || (!isCreating && changedFields.length === 0) || (isCreating && !formData.name.trim())"
                      class="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px] sm:min-w-[120px]"
                    >
                      <span v-if="loading">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span class="hidden sm:inline">جاري الحفظ...</span>
                      </span>
                      <span v-else>
                        {{ isCreating ? 'إضافة صنف' : 'حفظ التغييرات' }}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { ref, watch, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import { XIcon, ExclamationIcon } from '@heroicons/vue/outline';

export default {
  name: 'EditItemModalMobile',
  components: {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    XIcon,
    ExclamationIcon
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    item: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'success', 'delete'],
  setup(props, { emit }) {
    const store = useStore();
    const loading = ref(false);
    const error = ref('');
    const searchTerm = ref('');
    const showAllItems = ref(false);
    const selectedWarehouseId = ref('');
    const originalItem = ref(null);
    
    // Mobile Tabs State
    const activeMobileTab = ref('search');
    const showMobileTabs = computed(() => window.innerWidth < 640); // sm breakpoint
    
    // Live Search State
    const isLiveSearching = ref(false);
    const liveSearchResults = reactive([]);
    const liveSearchTimeout = ref(null);

    // Form Data
    const formData = reactive({
      name: '',
      code: '',
      color: '',
      warehouse_id: '',
      cartons_count: 0,
      per_carton_count: 12,
      single_bottles_count: 0,
      supplier: '',
      item_location: '',
      photo_url: '',
      notes: ''
    });

    const fieldValidation = reactive({
      name: '',
      code: '',
      color: '',
      warehouse_id: ''
    });

    // Computed properties
    const isCreating = computed(() => !props.item?.id);
    const canDelete = computed(() => store.getters.canDelete);
    const userCanEdit = computed(() => store.getters.canEdit);
    const userRole = computed(() => store.state.userProfile?.role);
    
    const accessibleWarehouses = computed(() => {
      if (userRole.value === 'warehouse_manager') {
        const allowedWarehouses = store.state.userProfile?.allowed_warehouses || [];
        if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
          return store.state.warehouses.filter(w => allowedWarehouses.includes(w.id) && w.type === 'primary');
        }
      }
      return store.state.warehouses.filter(w => w.type === 'primary');
    });

    const selectedWarehouse = computed(() => 
      accessibleWarehouses.value.find(w => w.id === selectedWarehouseId.value)
    );

    const inventory = computed(() => {
      if (!selectedWarehouseId.value) return [];
      return store.state.inventory.filter(item => 
        item.warehouse_id === selectedWarehouseId.value
      );
    });

    // Combined items (local + live search results)
    const combinedItems = computed(() => {
      const combined = [...inventory.value];
      
      liveSearchResults.forEach(liveItem => {
        if (!combined.some(item => item.id === liveItem.id)) {
          if (liveItem.warehouse_id === selectedWarehouseId.value) {
            combined.push({
              ...liveItem,
              isLiveSearchResult: true
            });
          }
        }
      });
      
      if (!searchTerm.value.trim()) {
        return combined;
      }
      
      const term = searchTerm.value.toLowerCase().trim();
      return combined.filter(item => {
        const name = (item.name || '').toLowerCase();
        const code = (item.code || '').toLowerCase();
        const color = (item.color || '').toLowerCase();
        const supplier = (item.supplier || '').toLowerCase();
        
        return name.includes(term) || 
               code.includes(term) || 
               color.includes(term) ||
               supplier.includes(term);
      });
    });

    const selectedItem = computed(() => {
      if (isCreating.value) return null;
      return props.item;
    });

    // Calculate total quantity
    const totalQuantity = computed(() => {
      const cartons = Number(formData.cartons_count) || 0;
      const perCarton = Number(formData.per_carton_count) || 12;
      const singles = Number(formData.single_bottles_count) || 0;
      return (cartons * perCarton) + singles;
    });

    const originalTotalQuantity = computed(() => {
      if (!originalItem.value) return 0;
      const cartons = Number(originalItem.value.cartons_count) || 0;
      const perCarton = Number(originalItem.value.per_carton_count) || 12;
      const singles = Number(originalItem.value.single_bottles_count) || 0;
      return (cartons * perCarton) + singles;
    });

    // Track changed fields
    const changedFields = computed(() => {
      if (!originalItem.value) return [];
      
      const changed = [];
      if (formData.name !== originalItem.value.name) changed.push('الاسم');
      if (formData.code !== originalItem.value.code) changed.push('الكود');
      if (formData.color !== originalItem.value.color) changed.push('اللون');
      if (formData.warehouse_id !== originalItem.value.warehouse_id) changed.push('المخزن');
      if (Number(formData.cartons_count) !== Number(originalItem.value.cartons_count)) changed.push('عدد الكراتين');
      if (Number(formData.per_carton_count) !== Number(originalItem.value.per_carton_count)) changed.push('عدد في الكرتونة');
      if (Number(formData.single_bottles_count) !== Number(originalItem.value.single_bottles_count)) changed.push('عدد القزاز الفردي');
      if (formData.supplier !== originalItem.value.supplier) changed.push('المورد');
      if (formData.item_location !== originalItem.value.item_location) changed.push('مكان الصنف');
      if (formData.photo_url !== originalItem.value.photo_url) changed.push('صورة الصنف');
      if (formData.notes !== originalItem.value.notes) changed.push('ملاحظات');
      
      return changed;
    });

    const fieldErrors = computed(() => {
      const errors = [];
      if (fieldValidation.name) errors.push(fieldValidation.name);
      if (fieldValidation.code) errors.push(fieldValidation.code);
      if (fieldValidation.color) errors.push(fieldValidation.color);
      if (fieldValidation.warehouse_id) errors.push(fieldValidation.warehouse_id);
      return errors;
    });

    const isFieldChanged = (fieldName) => {
      if (!originalItem.value) return false;
      return changedFields.value.some(field => 
        field === mapFieldToLabel(fieldName)
      );
    };

    const mapFieldToLabel = (fieldName) => {
      const map = {
        name: 'الاسم',
        code: 'الكود',
        color: 'اللون',
        warehouse_id: 'المخزن',
        cartons_count: 'عدد الكراتين',
        per_carton_count: 'عدد في الكرتونة',
        single_bottles_count: 'عدد القزاز الفردي',
        supplier: 'المورد',
        item_location: 'مكان الصنف',
        photo_url: 'صورة الصنف',
        notes: 'ملاحظات'
      };
      return map[fieldName] || fieldName;
    };

    // Live Search Functions
    const performLiveSearch = async (searchTermValue) => {
      if (!searchTermValue || searchTermValue.trim().length < 2) {
        liveSearchResults.length = 0 // Clear results
        isLiveSearching.value = false
        return
      }
      
      isLiveSearching.value = true
      
      try {
        console.log('🔍 Performing live search in edit modal for:', searchTermValue)
        
        const searchResults = await store.dispatch('searchItemsForTransactions', {
          searchTerm: searchTermValue,
          limitResults: 50
        })
        
        console.log('✅ Live search results in edit modal:', searchResults.length, 'items')
        
        liveSearchResults.length = 0
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
    
    const handleSearch = () => {
      if (liveSearchTimeout.value) {
        clearTimeout(liveSearchTimeout.value)
      }
      
      liveSearchTimeout.value = setTimeout(() => {
        if (searchTerm.value && searchTerm.value.trim().length >= 2) {
          performLiveSearch(searchTerm.value.trim())
        } else {
          liveSearchResults.length = 0
          isLiveSearching.value = false
        }
      }, 300)
    }

    // Helper functions
    const getStockClass = (quantity) => {
      if (quantity === 0) return 'text-red-600 dark:text-red-400';
      if (quantity < 10) return 'text-yellow-600 dark:text-yellow-400';
      return 'text-green-600 dark:text-green-400';
    };

    const resetForm = () => {
      Object.assign(formData, {
        name: '',
        code: '',
        color: '',
        warehouse_id: '',
        cartons_count: 0,
        per_carton_count: 12,
        single_bottles_count: 0,
        supplier: '',
        item_location: '',
        photo_url: '',
        notes: ''
      });
      
      Object.assign(fieldValidation, {
        name: '',
        code: '',
        color: '',
        warehouse_id: ''
      });
      
      error.value = '';
      searchTerm.value = '';
      selectedWarehouseId.value = '';
      originalItem.value = null;
      showAllItems.value = false;
      liveSearchResults.length = 0;
      isLiveSearching.value = false;
      activeMobileTab.value = 'search';
    };

    const loadItemData = (item) => {
      if (!item) return;
      
      originalItem.value = { ...item };
      
      // 🔴 CRITICAL: Always include warehouse_id in formData
      Object.assign(formData, {
        name: item.name || '',
        code: item.code || '',
        color: item.color || '',
        warehouse_id: item.warehouse_id || '',
        cartons_count: item.cartons_count || 0,
        per_carton_count: item.per_carton_count || 12,
        single_bottles_count: item.single_bottles_count || 0,
        supplier: item.supplier || '',
        item_location: item.item_location || '',
        photo_url: item.photo_url || '',
        notes: item.notes || ''
      });

      if (item.warehouse_id) {
        selectedWarehouseId.value = item.warehouse_id;
        console.log('📋 Loaded item warehouse_id:', item.warehouse_id);
      }
      
      // Switch to form tab on mobile when item is selected
      if (showMobileTabs.value) {
        activeMobileTab.value = 'form';
      }
      
      // Debug log
      console.log('🔍 loadItemData - formData.warehouse_id:', formData.warehouse_id);
    };

    const onWarehouseChange = () => {
      if (selectedWarehouseId.value) {
        // 🔴 CRITICAL: Update both formData.warehouse_id AND formData.warehouse_id
        formData.warehouse_id = selectedWarehouseId.value;
        clearFieldError('warehouse_id');
        console.log('✅ Warehouse selected:', selectedWarehouseId.value, 'set in formData:', formData.warehouse_id);
      }
      searchTerm.value = '';
      showAllItems.value = false;
      liveSearchResults.length = 0;
      isLiveSearching.value = false;
      
      if (isCreating.value && selectedWarehouseId.value) {
        createNewItem();
      }
    };

    const selectItemForEdit = (item) => {
      loadItemData(item);
      searchTerm.value = '';
      showAllItems.value = false;
      liveSearchResults.length = 0;
      isLiveSearching.value = false;
      
      // Switch to form tab on mobile
      if (showMobileTabs.value) {
        activeMobileTab.value = 'form';
      }
    };

    const createNewItem = () => {
      resetForm();
      if (selectedWarehouseId.value) {
        formData.warehouse_id = selectedWarehouseId.value;
        formData.cartons_count = 0;
        formData.per_carton_count = 12;
        formData.single_bottles_count = 0;
      }
      
      // Switch to form tab on mobile
      if (showMobileTabs.value) {
        activeMobileTab.value = 'form';
      }
    };

    const clearSelection = () => {
      resetForm();
      if (selectedWarehouseId.value) {
        formData.warehouse_id = selectedWarehouseId.value;
      }
    };

    const resetFormChanges = () => {
      if (originalItem.value) {
        loadItemData(originalItem.value);
      }
    };

    const closeModal = () => {
      resetForm();
      emit('close');
    };

    const handleImageError = (event) => {
      console.warn('Image failed to load:', event.target.src);
      event.target.style.display = 'none';
    };

    const clearFieldError = (fieldName) => {
      if (fieldValidation[fieldName]) {
        fieldValidation[fieldName] = '';
      }
    };

    const validateForm = () => {
      let isValid = true;
      
      Object.keys(fieldValidation).forEach(key => {
        fieldValidation[key] = '';
      });

      if (!formData.name.trim()) {
        fieldValidation.name = 'اسم الصنف مطلوب';
        isValid = false;
      }

      if (!formData.code.trim()) {
        fieldValidation.code = 'كود الصنف مطلوب';
        isValid = false;
      }

      if (!formData.color.trim()) {
        fieldValidation.color = 'لون الصنف مطلوب';
        isValid = false;
      }

      // 🔴 CRITICAL: Validate warehouse_id from formData, not selectedWarehouseId
      if (!formData.warehouse_id) {
        fieldValidation.warehouse_id = 'يجب اختيار المخزن';
        isValid = false;
        console.error('❌ Warehouse validation failed: formData.warehouse_id =', formData.warehouse_id);
      }

      if (totalQuantity.value < 0) {
        error.value = 'الكمية لا يمكن أن تكون سالبة';
        isValid = false;
      }

      if (formData.photo_url && !isValidUrl(formData.photo_url)) {
        error.value = 'رابط الصورة غير صالح';
        isValid = false;
      }

      return isValid;
    };

    const isValidUrl = (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    const handleSubmit = async () => {
      if (loading.value || !validateForm()) {
        console.log('Validation failed. Field errors:', fieldValidation);
        return;
      }

      loading.value = true;
      error.value = '';

      try {
        if (isCreating.value) {
          // Add new item using store action
          const itemData = {
            name: formData.name,
            code: formData.code,
            color: formData.color,
            warehouse_id: formData.warehouse_id,
            cartons_count: Number(formData.cartons_count) || 0,
            per_carton_count: Number(formData.per_carton_count) || 12,
            single_bottles_count: Number(formData.single_bottles_count) || 0,
            supplier: formData.supplier || '',
            item_location: formData.item_location || '',
            photo_url: formData.photo_url || '',
            notes: formData.notes || ''
          };

          console.log('📝 Adding new item with data:', itemData);

          const result = await store.dispatch('addInventoryItem', { 
            itemData, 
            isAddingCartons: true 
          });

          if (result && result.success) {
            emit('success', {
              type: 'created',
              message: `تم إضافة الصنف "${formData.name}" بنجاح`,
              itemId: result.id,
              itemName: formData.name
            });
            closeModal();
          } else {
            error.value = result?.message || 'حدث خطأ أثناء إضافة الصنف';
          }
        } else {
          // 🔴 CRITICAL FIX: ALWAYS include ALL required fields in update data
          // Store validation requires name, code, color, and warehouse_id to be present
          const updateData = {
            itemId: selectedItem.value.id,
            itemData: {
              // 🔴 REQUIRED FIELDS - MUST be present even if unchanged
              name: formData.name.trim(),
              code: formData.code.trim(),
              color: formData.color.trim(),
              warehouse_id: formData.warehouse_id,
              
              // 🔴 QUANTITY FIELDS - Store needs these for calculations
              cartons_count: Number(formData.cartons_count) || 0,
              per_carton_count: Number(formData.per_carton_count) || 12,
              single_bottles_count: Number(formData.single_bottles_count) || 0,
              
              // 🔴 OPTIONAL FIELDS - Include all even if unchanged or empty
              supplier: formData.supplier?.trim() || '',
              item_location: formData.item_location?.trim() || '',
              photo_url: formData.photo_url || '',
              notes: formData.notes?.trim() || ''
            }
          };

          // Debug log to verify all required fields are present
          console.log('🔍 Debug - Update data validation:', {
            hasName: !!updateData.itemData.name,
            hasCode: !!updateData.itemData.code,
            hasColor: !!updateData.itemData.color,
            hasWarehouseId: !!updateData.itemData.warehouse_id,
            warehouseId: updateData.itemData.warehouse_id,
            nameLength: updateData.itemData.name.length,
            codeLength: updateData.itemData.code.length,
            colorLength: updateData.itemData.color.length,
            formDataWarehouseId: formData.warehouse_id
          });

          console.log('📝 Updating item with FULL data:', updateData);

          const result = await store.dispatch('updateItem', updateData);

          if (result && result.success) {
            emit('success', {
              type: 'updated',
              message: result.message || `تم تحديث الصنف "${formData.name}" بنجاح`,
              changedFields: changedFields.value,
              itemId: selectedItem.value.id,
              itemName: formData.name
            });
            closeModal();
          } else {
            error.value = result?.message || 'حدث خطأ أثناء تحديث الصنف';
            // Debug log for store error
            console.error('❌ Store update error:', result?.error);
          }
        }
      } catch (err) {
        console.error('Error saving item:', err);
        error.value = err.message || 'حدث خطأ غير متوقع أثناء حفظ الصنف';
      } finally {
        loading.value = false;
      }
    };

    const confirmDelete = () => {
      if (!selectedItem.value?.id || !canDelete.value) return;

      const confirmMessage = `هل أنت متأكد من حذف الصنف "${selectedItem.value.name}"؟\nهذا الإجراء لا يمكن التراجع عنه.`;

      if (window.confirm(confirmMessage)) {
        store.dispatch('deleteItem', selectedItem.value.id);
        emit('delete', selectedItem.value.id);
        closeModal();
      }
    };

    // Watch for prop changes
    watch(() => props.item, (newItem) => {
      if (newItem && props.isOpen) {
        console.log('🔍 Modal received item:', {
          id: newItem.id,
          name: newItem.name,
          warehouse_id: newItem.warehouse_id,
          hasWarehouseId: !!newItem.warehouse_id,
          fullItem: newItem
        });
        loadItemData(newItem);
      }
    }, { immediate: true });

    watch(() => props.isOpen, (newVal) => {
      if (newVal && props.item) {
        console.log('🔍 Modal opened with item:', {
          id: props.item.id,
          name: props.item.name,
          warehouse_id: props.item.warehouse_id,
          hasWarehouseId: !!props.item.warehouse_id
        });
        loadItemData(props.item);
      } else if (!newVal) {
        resetForm();
      }
    });

    watch(searchTerm, (newValue) => {
      if (!newValue || newValue.trim().length < 2) {
        liveSearchResults.length = 0;
        isLiveSearching.value = false;
      }
    });

    // Initialize warehouses if not loaded
    onMounted(() => {
      if (store.state.warehouses.length === 0) {
        store.dispatch('loadWarehousesEnhanced');
      }
      
      // Add resize listener for mobile tabs
      window.addEventListener('resize', handleResize);
    });

    // Cleanup on unmount
    onUnmounted(() => {
      if (liveSearchTimeout.value) {
        clearTimeout(liveSearchTimeout.value);
      }
      window.removeEventListener('resize', handleResize);
    });

    const handleResize = () => {
      // Update mobile tabs visibility on resize
    };

    return {
      // State
      formData,
      loading,
      error,
      searchTerm,
      showAllItems,
      selectedWarehouseId,
      originalItem,
      fieldValidation,
      
      // Mobile Tabs
      activeMobileTab,
      showMobileTabs,
      
      // Live Search State
      isLiveSearching,
      liveSearchResults,
      
      // Computed
      isCreating,
      canDelete,
      userCanEdit,
      accessibleWarehouses,
      selectedWarehouse,
      combinedItems,
      selectedItem,
      totalQuantity,
      originalTotalQuantity,
      changedFields,
      fieldErrors,
      
      // Methods
      getStockClass,
      selectItemForEdit,
      createNewItem,
      clearSelection,
      resetFormChanges,
      closeModal,
      handleSubmit,
      confirmDelete,
      handleImageError,
      isFieldChanged,
      onWarehouseChange,
      clearFieldError,
      handleSearch
    };
  }
};
</script>

<style scoped>
/* Custom scrollbar for mobile */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Mobile touch optimization */
@media (max-width: 640px) {
  button, 
  input[type="button"],
  input[type="submit"],
  input[type="reset"] {
    min-height: 44px;
    min-width: 44px;
  }
  
  input[type="text"],
  input[type="number"],
  input[type="url"],
  textarea,
  select {
    font-size: 16px; /* Prevents iOS zoom on focus */
  }
}

/* Transition animations */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Animation for loading spinner */
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

/* Gradient button hover effect */
.bg-gradient-to-r {
  background-size: 200% 200%;
  background-position: 100% 0;
  transition: background-position 0.5s ease;
}

.bg-gradient-to-r:hover {
  background-position: 0 100%;
}

/* Focus styles for mobile */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800;
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

/* Mobile optimization for modal */
@media (max-width: 640px) {
  .max-h-\[95vh\] {
    max-height: 95vh;
  }
  
  .mx-2 {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
  
  .my-2 {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
}

/* Desktop optimization */
@media (min-width: 640px) {
  .max-h-\[90vh\] {
    max-height: 90vh;
  }
}

/* RTL support */
.rtl {
  direction: rtl;
}

.space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

/* Truncate text with ellipsis */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Smooth hover transitions */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
