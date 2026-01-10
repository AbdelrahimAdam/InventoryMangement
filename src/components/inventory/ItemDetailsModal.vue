<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
    
    <div class="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-hidden">
      <!-- Close Button -->
      <button 
        @click="$emit('close')"
        class="absolute top-4 left-4 z-10 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-110 active:scale-95 transition-all duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <!-- Modal Content -->
      <div class="h-full overflow-y-auto p-4 md:p-6">
        <div v-if="item" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Left Column: Image & Basic Info -->
          <div class="space-y-6">
            <!-- Item Image -->
            <div class="relative h-64 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <img 
                v-if="item.photo_url"
                :src="formatPhotoUrl(item.photo_url)" 
                :alt="item.name"
                class="w-full h-full object-cover"
                @error="handleImageError"
              >
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>

              <!-- Status Badge -->
              <div class="absolute top-4 right-4">
                <span :class="getStockStatusClass(item.remaining_quantity || 0)" 
                  class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-md">
                  {{ getStockStatus(item.remaining_quantity || 0) }}
                </span>
              </div>
            </div>

            <!-- Basic Information -->
            <div class="space-y-4">
              <div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ item.name || 'بدون اسم' }}</h2>
                <div class="flex items-center gap-3 mt-2">
                  <span class="text-sm font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-lg">
                    {{ item.code || 'بدون كود' }}
                  </span>
                  <span v-if="item.color" class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div class="w-4 h-4 rounded-full border border-gray-300" 
                      :style="{ backgroundColor: getColorHex(item.color) }"></div>
                    {{ item.color }}
                  </span>
                </div>
              </div>

              <!-- Quick Stats -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">المخزن</p>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ warehouseLabel }}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">الكمية الحالية</p>
                  <p :class="getQuantityClass(item.remaining_quantity || 0)" class="text-2xl font-bold">
                    {{ formatNumber(item.remaining_quantity || 0) }}
                  </p>
                </div>
              </div>

              <!-- Business Logic Summary -->
              <div v-if="showBusinessLogic" class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p class="text-sm font-medium text-blue-800 dark:text-blue-300">معلومات التخزين</p>
                </div>
                <div class="grid grid-cols-2 gap-2 text-xs">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">إجمالي المضافة:</span>
                    <span class="font-medium">{{ formatNumber(item.total_added || 0) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">نسبة الباقي:</span>
                    <span :class="getPercentageClass(remainingPercentage)" class="font-medium">
                      {{ remainingPercentage }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Detailed Information -->
          <div class="space-y-6">
            <!-- Details Grid -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Warehouse Details -->
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                <div class="flex items-center gap-1 mb-1">
                  <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  <p class="text-sm text-gray-500 dark:text-gray-400">المخزن</p>
                </div>
                <p class="text-gray-900 dark:text-white font-medium truncate">{{ warehouseLabel }}</p>
              </div>

              <!-- Supplier Details -->
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                <div class="flex items-center gap-1 mb-1">
                  <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  <p class="text-sm text-gray-500 dark:text-gray-400">المورد</p>
                </div>
                <p class="text-gray-900 dark:text-white font-medium truncate">{{ supplierName }}</p>
              </div>

              <!-- Carton Details -->
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                <div class="flex items-center gap-1 mb-1">
                  <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                  <p class="text-sm text-gray-500 dark:text-gray-400">الكراتين</p>
                </div>
                <p class="text-gray-900 dark:text-white font-medium">{{ formatNumber(item.cartons_count || 0) }}</p>
              </div>

              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                <div class="flex items-center gap-1 mb-1">
                  <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                  <p class="text-sm text-gray-500 dark:text-gray-400">في الكرتونة</p>
                </div>
                <p class="text-gray-900 dark:text-white font-medium">{{ formatNumber(item.per_carton_count || 0) }}</p>
              </div>

              <!-- Single Bottles -->
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                <div class="flex items-center gap-1 mb-1">
                  <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                  <p class="text-sm text-gray-500 dark:text-gray-400">الفردي</p>
                </div>
                <p class="text-gray-900 dark:text-white font-medium">{{ formatNumber(item.single_bottles_count || 0) }}</p>
              </div>

              <!-- Total Added -->
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                <div class="flex items-center gap-1 mb-1">
                  <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p class="text-sm text-gray-500 dark:text-gray-400">المجموع المضاف</p>
                </div>
                <p class="text-gray-900 dark:text-white font-medium">{{ formatNumber(item.total_added || 0) }}</p>
              </div>

              <!-- Created By -->
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                <div class="flex items-center gap-1 mb-1">
                  <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  <p class="text-sm text-gray-500 dark:text-gray-400">أنشئ بواسطة</p>
                </div>
                <p class="text-gray-900 dark:text-white font-medium truncate">{{ createdByName }}</p>
              </div>

              <!-- Updated By -->
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-200">
                <div class="flex items-center gap-1 mb-1">
                  <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  <p class="text-sm text-gray-500 dark:text-gray-400">آخر تحديث بواسطة</p>
                </div>
                <p class="text-gray-900 dark:text-white font-medium truncate">{{ updatedByName }}</p>
              </div>
            </div>

            <!-- Optional Fields -->
            <div v-if="item.item_location || item.notes || item.category" class="space-y-4">
              <!-- Location -->
              <div v-if="item.item_location" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  </svg>
                  <p class="text-sm text-gray-500 dark:text-gray-400">مكان التخزين</p>
                </div>
                <p class="text-gray-800 dark:text-gray-300 font-medium">{{ item.item_location }}</p>
              </div>

              <!-- Category -->
              <div v-if="item.category" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                  <p class="text-sm text-gray-500 dark:text-gray-400">الفئة</p>
                </div>
                <p class="text-gray-800 dark:text-gray-300 font-medium">{{ getCategoryLabel(item.category) }}</p>
              </div>

              <!-- Notes Section -->
              <div v-if="item.notes" class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <p class="text-sm text-yellow-700 dark:text-yellow-300 font-medium">ملاحظات</p>
                </div>
                <p class="text-gray-800 dark:text-gray-300 whitespace-pre-line">{{ item.notes }}</p>
              </div>
            </div>

            <!-- Last Update Info -->
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">تاريخ الإنشاء</p>
                  <p class="text-gray-900 dark:text-white font-medium">{{ formatDate(item.created_at) }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">آخر تحديث</p>
                  <p class="text-gray-900 dark:text-white font-medium">{{ formatDate(item.updated_at) }}</p>
                </div>
              </div>
              <div v-if="lastTransaction" class="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                <p class="text-xs text-blue-700 dark:text-blue-300">
                  آخر عملية: {{ lastTransaction.type_label }} {{ formatRelativeTime(lastTransaction.timestamp) }}
                </p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div v-if="showActions" class="grid grid-cols-2 gap-3">
              <button 
                v-if="canEditItem"
                @click="handleAction('edit')"
                :disabled="actionLoading || !canPerformAction('edit')"
                class="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="actionLoading && actionType === 'edit'" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                {{ actionLoading && actionType === 'edit' ? 'جاري التحميل...' : 'تعديل' }}
              </button>

              <button 
                v-if="canTransferItem"
                @click="handleAction('transfer')"
                :disabled="actionLoading || !canPerformAction('transfer')"
                class="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="actionLoading && actionType === 'transfer'" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                </svg>
                {{ actionLoading && actionType === 'transfer' ? 'جاري التحميل...' : 'نقل' }}
              </button>

              <button 
                v-if="canDispatchItem"
                @click="handleAction('dispatch')"
                :disabled="actionLoading || !canPerformAction('dispatch')"
                class="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="actionLoading && actionType === 'dispatch'" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                {{ actionLoading && actionType === 'dispatch' ? 'جاري التحميل...' : 'صرف' }}
              </button>

              <button 
                v-if="canDeleteItem"
                @click="handleAction('delete')"
                :disabled="actionLoading || !canPerformAction('delete')"
                class="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="actionLoading && actionType === 'delete'" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                {{ actionLoading && actionType === 'delete' ? 'جاري التحميل...' : 'حذف' }}
              </button>
            </div>

            <!-- Action Disabled Reasons -->
            <div v-if="showActions && hasDisabledActions" class="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-xs text-red-700 dark:text-red-300">
                  {{ getActionDisabledMessage() }}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-else class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mb-4"></div>
          <p class="text-gray-600 dark:text-gray-400">جاري تحميل التفاصيل...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch, onMounted } from 'vue';
import { useStore } from 'vuex';

// Import store constants
const WAREHOUSE_LABELS = {
  main_warehouse: 'مخزن شارع الشيخ',
  tera_warehouse: 'مخزن الترعه',
  shobeen_warehouse: 'مخزن موقف شبين',
  hyper_warehouse: 'مخزن هايبر التهامي',
  matbaa_warehouse: 'مخزن المطبعه',
  ghabashi_warehouse: 'مخزن الغباشي'
};

const CATEGORY_LABELS = {
  beverages: 'مشروبات',
  food: 'مواد غذائية',
  snacks: 'سناكس',
  household: 'منظفات ومنتجات منزلية',
  personal_care: 'العناية الشخصية'
};

const TRANSACTION_TYPES = {
  ADD: 'ADD',
  TRANSFER: 'TRANSFER',
  DISPATCH: 'DISPATCH',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  INVOICE: 'INVOICE'
};

const TRANSACTION_TYPE_LABELS = {
  'ADD': 'إضافة',
  'TRANSFER': 'نقل',
  'DISPATCH': 'صرف',
  'UPDATE': 'تحديث',
  'DELETE': 'حذف',
  'INVOICE': 'فاتورة'
};

export default {
  name: 'ItemDetailsModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    item: {
      type: Object,
      default: () => ({})
    },
    canEditItem: {
      type: Boolean,
      default: false
    },
    canTransferItem: {
      type: Boolean,
      default: false
    },
    canDispatchItem: {
      type: Boolean,
      default: false
    },
    canDeleteItem: {
      type: Boolean,
      default: false
    },
    warehouseLabel: {
      type: [String, Function],
      default: 'غير معروف'
    },
    getWarehouseLabel: {
      type: Function,
      default: () => 'غير معروف'
    }
  },
  emits: ['close', 'edit', 'transfer', 'dispatch', 'delete'],
  
  setup(props, { emit }) {
    const store = useStore();
    
    // State
    const actionLoading = ref(false);
    const actionType = ref('');
    const usersLoaded = ref(false);
    const lastTransaction = ref(null);
    const isLoadingTransaction = ref(false);
    
    // Load data when modal opens
    onMounted(() => {
      if (props.isOpen) {
        loadAdditionalData();
      }
    });
    
    // Watch for modal opening
    watch(() => props.isOpen, async (isOpen) => {
      if (isOpen) {
        await loadAdditionalData();
      } else {
        // Reset state when modal closes
        actionLoading.value = false;
        actionType.value = '';
        lastTransaction.value = null;
      }
    });
    
    // Load additional data (users and last transaction)
    const loadAdditionalData = async () => {
      if (!props.item?.id) return;
      
      try {
        // Load users for superadmins
        if (!usersLoaded.value && store.getters.userRole === 'superadmin') {
          await store.dispatch('loadUsers');
          usersLoaded.value = true;
        }
        
        // Load last transaction for this item
        await loadLastTransaction();
        
      } catch (error) {
        console.warn('Could not load additional data:', error);
      }
    };
    
    // Load last transaction for the item (using store's logic)
    const loadLastTransaction = async () => {
      if (!props.item?.id || isLoadingTransaction.value) return;
      
      isLoadingTransaction.value = true;
      try {
        // Get recent transactions from store and filter for this item
        const recentTransactions = store.state.recentTransactions || [];
        const itemTransactions = recentTransactions.filter(transaction => 
          transaction.item_id === props.item.id
        );
        
        if (itemTransactions.length > 0) {
          const latestTransaction = itemTransactions[0];
          lastTransaction.value = {
            ...latestTransaction,
            type_label: TRANSACTION_TYPE_LABELS[latestTransaction.type] || latestTransaction.type,
            timestamp: latestTransaction.timestamp?.toDate?.() || new Date(latestTransaction.timestamp)
          };
        }
      } catch (error) {
        console.warn('Could not load last transaction:', error);
      } finally {
        isLoadingTransaction.value = false;
      }
    };
    
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
    
    // Computed properties with store business logic
    const warehouseLabel = computed(() => {
      if (typeof props.warehouseLabel === 'string') {
        return props.warehouseLabel;
      }
      if (props.item?.warehouse_id && typeof props.getWarehouseLabel === 'function') {
        return props.getWarehouseLabel(props.item.warehouse_id);
      }
      return WAREHOUSE_LABELS[props.item?.warehouse_id] || props.item?.warehouse_id || 'غير معروف';
    });
    
    const showActions = computed(() => {
      return props.canEditItem || props.canTransferItem || props.canDispatchItem || props.canDeleteItem;
    });
    
    const hasDisabledActions = computed(() => {
      return !canPerformAction('edit') || !canPerformAction('transfer') || 
             !canPerformAction('dispatch') || !canPerformAction('delete');
    });
    
    const showBusinessLogic = computed(() => {
      return props.item?.total_added > 0 || props.item?.remaining_quantity !== undefined;
    });
    
    const remainingPercentage = computed(() => {
      if (!props.item?.total_added || props.item.total_added === 0) return 0;
      const percentage = (props.item.remaining_quantity / props.item.total_added) * 100;
      return Math.round(percentage);
    });
    
    // Get current user profile
    const userProfile = computed(() => store.state.userProfile || {});
    
    // Function to get user name from ID (using store getter)
    const getUserName = (userId) => {
      if (!userId) return 'نظام';
      
      // Use store getter for user display name
      return store.getters.getUserDisplayName(userId);
    };
    
    // Get created by name
    const createdByName = computed(() => {
      if (props.item.created_by_name) {
        return props.item.created_by_name;
      }
      return getUserName(props.item.created_by);
    });
    
    // Get updated by name
    const updatedByName = computed(() => {
      if (props.item.updated_by_name) {
        return props.item.updated_by_name;
      }
      const updatedBy = props.item.updated_by || props.item.created_by;
      return getUserName(updatedBy);
    });
    
    // Get supplier name
    const supplierName = computed(() => {
      return props.item.supplier || 'غير محدد';
    });
    
    // Methods
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
      if (quantity === 0) return 'text-red-600 dark:text-red-400';
      if (quantity < 10) return 'text-orange-600 dark:text-orange-400';
      return 'text-green-600 dark:text-green-400';
    };
    
    const getPercentageClass = (percentage) => {
      if (percentage <= 10) return 'text-red-600 dark:text-red-400';
      if (percentage <= 30) return 'text-orange-600 dark:text-orange-400';
      return 'text-green-600 dark:text-green-400';
    };
    
    const getColorHex = (colorName) => {
      return colorMap[colorName] || '#6b7280';
    };
    
    const formatDate = (date) => {
      if (!date) return '-';
      try {
        const dateObj = date.toDate ? date.toDate() : new Date(date);
        if (isNaN(dateObj.getTime())) return '-';
        
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
    
    const formatRelativeTime = (timestamp) => {
      if (!timestamp) return '';
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'الآن';
        if (diffMins < 60) return `قبل ${diffMins} دقيقة`;
        if (diffHours < 24) return `قبل ${diffHours} ساعة`;
        if (diffDays < 7) return `قبل ${diffDays} يوم`;
        return formatDate(timestamp);
      } catch (e) {
        return '';
      }
    };
    
    const formatNumber = (num) => {
      return new Intl.NumberFormat('ar-EG').format(num);
    };
    
    const getCategoryLabel = (category) => {
      return CATEGORY_LABELS[category] || category;
    };
    
    const getTransactionTypeLabel = (type) => {
      return TRANSACTION_TYPE_LABELS[type] || type;
    };
    
    const formatPhotoUrl = (photoUrl) => {
      if (!photoUrl) return '';
      
      // Firebase Storage URL
      if (photoUrl.startsWith('https://firebasestorage.googleapis.com')) {
        return photoUrl;
      }
      
      // Base64 Data URL
      if (photoUrl.startsWith('data:image/')) {
        return photoUrl;
      }
      
      // Raw base64 string
      if (typeof photoUrl === 'string' && photoUrl.length > 100) {
        let mimeType = 'image/jpeg';
        if (photoUrl.includes('iVBORw')) mimeType = 'image/png';
        if (photoUrl.includes('R0lGOD')) mimeType = 'image/gif';
        if (photoUrl.includes('UklGR')) mimeType = 'image/webp';
        
        return `data:${mimeType};base64,${photoUrl}`;
      }
      
      return photoUrl;
    };
    
    const handleImageError = (event) => {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMTZMNC42ODYgMTUuMzE0QzQuODgyIDExLjUwNyA4LjA5MyA5IDEyIDlDMTUuOTA3IDkgMTkuMTE4IDExLjUwNyAxOS4zMTQgMTUuMzE0TDIwIDE2TTggMjFIMTZNNSAxNEgxOU0xMiAxN0MxMiAxNy41NTIyOCAxMS41NTIzIDE4IDExIDE4QzEwLjQ0NzcgMTggMTAgMTcuNTUyMyAxMCAxN0MxMCAxNi40NDc3IDEwLjQ0NzcgMTYgMTEgMTZDMTEuNTUyMyAxNiAxMiAxNi40NDc3IDEyIDE3WiIgc3Ryb2tlPSI2QjcyOEQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
    };
    
    // Business logic checks from store
    const canPerformAction = (action) => {
      if (!props.item) return false;
      
      switch (action) {
        case 'edit':
          return props.canEditItem && hasWarehouseAccess();
        case 'transfer':
          return props.canTransferItem && hasWarehouseAccess() && hasSufficientQuantity();
        case 'dispatch':
          return props.canDispatchItem && hasWarehouseAccess() && hasSufficientQuantity();
        case 'delete':
          return props.canDeleteItem && hasWarehouseAccess();
        default:
          return false;
      }
    };
    
    const hasWarehouseAccess = () => {
      if (!userProfile.value) return false;
      
      const role = userProfile.value.role;
      const allowedWarehouses = userProfile.value.allowed_warehouses || [];
      
      if (role === 'superadmin') return true;
      if (role === 'warehouse_manager') {
        if (allowedWarehouses.includes('all')) return true;
        return allowedWarehouses.includes(props.item.warehouse_id);
      }
      
      return false;
    };
    
    const hasSufficientQuantity = () => {
      const quantity = props.item.remaining_quantity || 0;
      return quantity > 0;
    };
    
    const getActionDisabledMessage = () => {
      if (!props.item) return '';
      
      const messages = [];
      
      if (!hasWarehouseAccess()) {
        messages.push('ليس لديك صلاحية في هذا المخزن');
      }
      
      if (props.item.remaining_quantity <= 0 && 
          (props.canTransferItem || props.canDispatchItem)) {
        messages.push('الكمية غير متوفرة');
      }
      
      return messages.join('، ');
    };
    
    const handleAction = async (type) => {
      if (actionLoading.value || !canPerformAction(type)) return;
      
      try {
        actionLoading.value = true;
        actionType.value = type;
        
        // Emit the action with the item
        emit(type, props.item);
        
        // Close the modal after a short delay
        setTimeout(() => {
          emit('close');
        }, 300);
        
      } catch (error) {
        console.error(`Error in ${type} action:`, error);
      } finally {
        actionLoading.value = false;
        actionType.value = '';
      }
    };

    return {
      // State
      actionLoading,
      actionType,
      lastTransaction,
      
      // Computed
      warehouseLabel,
      showActions,
      hasDisabledActions,
      showBusinessLogic,
      remainingPercentage,
      createdByName,
      updatedByName,
      supplierName,
      
      // Methods
      getStockStatus,
      getStockStatusClass,
      getQuantityClass,
      getPercentageClass,
      getColorHex,
      formatDate,
      formatRelativeTime,
      formatNumber,
      getCategoryLabel,
      getTransactionTypeLabel,
      formatPhotoUrl,
      handleImageError,
      handleAction,
      canPerformAction,
      getActionDisabledMessage
    };
  }
};
</script>

<style scoped>
.fixed {
  isolation: isolate;
}

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

.transition-colors {
  transition-property: background-color, border-color, color;
  transition-duration: 200ms;
}

.transition-all {
  transition-property: all;
  transition-duration: 200ms;
}

.bg-black\/50 {
  background-color: rgba(0, 0, 0, 0.5);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

.hover\:scale-110:hover {
  transform: scale(1.1);
}

.active\:scale-95:active {
  transform: scale(0.95);
}

.max-h-\[90vh\] {
  max-height: 90vh;
}

/* Ensure buttons are touch-friendly on mobile */
button {
  min-height: 44px;
  min-width: 44px;
}

@media (max-width: 768px) {
  .p-4 {
    padding: 1rem;
  }
  
  .md\:p-6 {
    padding: 1.5rem;
  }
  
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  .h-64 {
    height: 200px;
  }
  
  .text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }
}

/* Enhanced focus states */
button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.5);
}

.dark button:focus {
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.7);
}

/* Smooth scroll for modal content */
.overflow-y-auto {
  scroll-behavior: smooth;
}

/* Custom scrollbar for modal */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.dark .overflow-y-auto::-webkit-scrollbar-track {
  background: #374151;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
