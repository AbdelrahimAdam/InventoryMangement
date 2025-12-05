<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-3 md:p-4 lg:p-6 font-tajawal" dir="rtl">
    <!-- Authentication Check -->
    <div v-if="!isAuthenticated" class="flex items-center justify-center min-h-screen p-4">
      <div class="text-center text-white p-6 md:p-8 bg-gray-800/70 backdrop-blur-lg rounded-2xl border border-white/10 max-w-md w-full mx-4">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
          <span class="text-2xl">🔐</span>
        </div>
        <h2 class="text-xl md:text-2xl font-bold mb-3">يجب تسجيل الدخول</h2>
        <p class="text-gray-300 mb-6 text-sm md:text-base">يجب تسجيل الدخول للوصول إلى سجل الحركات</p>
        <router-link 
          to="/login" 
          class="inline-block w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium text-sm md:text-base"
        >
          تسجيل الدخول
        </router-link>
      </div>
    </div>

    <!-- Main Content when authenticated -->
    <div v-else class="max-w-7xl mx-auto">
      <!-- Header -->
      <header class="mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl shadow-xl border-0 relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400"></div>
        <div class="relative p-5 md:p-6">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
            <div class="flex items-center gap-3 md:gap-4">
              <div class="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg border border-white/30">
                <span class="text-2xl md:text-3xl font-bold text-white">📊</span>
              </div>
              <div>
                <h1 class="text-xl md:text-2xl font-black text-white mb-1 font-tajawal">
                  سجل الحركات
                </h1>
                <p class="text-sm md:text-base text-white/90 font-medium font-tajawal">
                  نظام متكامل لتتبع حركات الأصناف
                </p>
              </div>
            </div>
            <div class="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-end items-center w-full md:w-auto">
              <button
                @click="refreshData"
                :disabled="loading"
                class="flex-1 md:flex-none bg-white/20 backdrop-blur text-white font-bold rounded-xl px-4 py-2.5 md:px-5 md:py-3 flex items-center gap-2 hover:bg-white/30 disabled:bg-white/10 disabled:text-white/50 transition-all duration-200 text-sm md:text-base border border-white/30 min-w-[120px] justify-center"
              >
                <span class="text-base">🔄</span>
                <span class="whitespace-nowrap">تحديث</span>
              </button>
              <button
                @click="exportData"
                :disabled="!transactionsData.length || exporting"
                class="flex-1 md:flex-none bg-white/20 backdrop-blur text-white font-bold rounded-xl px-4 py-2.5 md:px-5 md:py-3 flex items-center gap-2 hover:bg-white/30 disabled:bg-white/10 disabled:text-white/50 transition-all duration-200 text-sm md:text-base border border-white/30 min-w-[120px] justify-center"
              >
                <span v-if="exporting" class="animate-spin">⏳</span>
                <span v-else class="text-base">📥</span>
                <span class="whitespace-nowrap">{{ exporting ? 'جاري التصدير' : 'تصدير' }}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12 md:py-16">
        <div class="inline-block animate-spin rounded-full h-14 w-14 md:h-16 md:w-16 border-4 border-white/30 border-t-white mb-6"></div>
        <p class="text-white text-lg md:text-xl">جاري تحميل البيانات...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 md:p-5 rounded-xl shadow-lg mb-6">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="text-xl md:text-2xl">⚠️</span>
            <span class="text-sm md:text-base">{{ error }}</span>
          </div>
          <button @click="error = ''" class="text-white/80 hover:text-white text-xl md:text-2xl shrink-0">
            ✕
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else class="space-y-6">
        <!-- Stats Summary -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-4 md:p-5 text-white">
            <div class="text-xs md:text-sm opacity-90 mb-2">إجمالي الحركات</div>
            <div class="text-2xl md:text-3xl font-bold">{{ filteredTransactions.length }}</div>
          </div>
          <div class="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-4 md:p-5 text-white">
            <div class="text-xs md:text-sm opacity-90 mb-2">الإضافات</div>
            <div class="text-2xl md:text-3xl font-bold">{{ stats.added }}</div>
          </div>
          <div class="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-4 md:p-5 text-white">
            <div class="text-xs md:text-sm opacity-90 mb-2">التحويلات</div>
            <div class="text-2xl md:text-3xl font-bold">{{ stats.transferred }}</div>
          </div>
          <div class="bg-gradient-to-r from-orange-600 to-orange-800 rounded-xl p-4 md:p-5 text-white">
            <div class="text-xs md:text-sm opacity-90 mb-2">الصرف</div>
            <div class="text-2xl md:text-3xl font-bold">{{ stats.dispatched }}</div>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-gray-800/70 backdrop-blur rounded-xl p-4 md:p-5 border border-gray-700/50">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
            <div class="md:col-span-2">
              <input
                type="text"
                v-model="filters.search"
                placeholder="🔍 ابحث في الحركات..."
                class="w-full p-3 md:p-3.5 bg-gray-700/50 rounded-xl border-2 border-blue-600/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-white placeholder-gray-400 text-sm md:text-base"
              />
            </div>
            <div>
              <select
                v-model="filters.type"
                class="w-full p-3 md:p-3.5 bg-gray-700/50 rounded-xl border-2 border-purple-600/50 text-white text-sm md:text-base"
              >
                <option value="">جميع الأنواع</option>
                <option value="ADD">إضافة</option>
                <option value="TRANSFER">تحويل</option>
                <option value="DISPATCH">صرف</option>
              </select>
            </div>
            <div>
              <select
                v-model="filters.dateRange"
                @change="handleDateRangeChange"
                class="w-full p-3 md:p-3.5 bg-gray-700/50 rounded-xl border-2 border-blue-600/50 text-white text-sm md:text-base"
              >
                <option value="">الفترة الزمنية</option>
                <option value="today">اليوم</option>
                <option value="week">الأسبوع</option>
                <option value="month">الشهر</option>
                <option value="custom">مخصص</option>
              </select>
            </div>
          </div>
          
          <!-- Custom Date Range - Only show when custom is selected -->
          <div v-if="filters.dateRange === 'custom'" class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">من تاريخ</label>
              <input
                type="date"
                v-model="filters.startDate"
                class="w-full p-3 md:p-3.5 bg-gray-700/50 rounded-xl border-2 border-blue-600/50 text-white text-sm md:text-base"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">إلى تاريخ</label>
              <input
                type="date"
                v-model="filters.endDate"
                class="w-full p-3 md:p-3.5 bg-gray-700/50 rounded-xl border-2 border-blue-600/50 text-white text-sm md:text-base"
              />
            </div>
          </div>
        </div>

        <!-- Transactions Table/Cards -->
        <div class="bg-gray-800/70 backdrop-blur rounded-xl border border-gray-700/50 overflow-hidden">
          <!-- Desktop View -->
          <div class="hidden lg:block">
            <div class="overflow-x-auto">
              <table class="w-full min-w-[800px]">
                <thead class="bg-gradient-to-r from-blue-600 to-purple-600">
                  <tr>
                    <th class="p-4 text-white font-bold text-sm md:text-base text-center min-w-[100px]">النوع</th>
                    <th class="p-4 text-white font-bold text-sm md:text-base text-center min-w-[120px]">من</th>
                    <th class="p-4 text-white font-bold text-sm md:text-base text-center min-w-[120px]">إلى</th>
                    <th class="p-4 text-white font-bold text-sm md:text-base text-center min-w-[100px]">الكمية</th>
                    <th class="p-4 text-white font-bold text-sm md:text-base text-center min-w-[150px]">التاريخ</th>
                    <th class="p-4 text-white font-bold text-sm md:text-base text-center min-w-[200px]">ملاحظات</th>
                    <th class="p-4 text-white font-bold text-sm md:text-base text-center min-w-[100px]">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredTransactions.length === 0">
                    <td colspan="7" class="p-8 md:p-10 text-center text-gray-400">
                      <div class="py-8 md:py-10">
                        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700/50 flex items-center justify-center">
                          <span class="text-2xl">📭</span>
                        </div>
                        <h3 class="text-lg md:text-xl font-bold mb-2">لا توجد حركات</h3>
                        <p class="text-sm md:text-base">لم يتم تسجيل أي حركات حتى الآن.</p>
                      </div>
                    </td>
                  </tr>
                  <tr 
                    v-for="transaction in paginatedTransactions" 
                    :key="transaction.id"
                    class="border-b border-gray-700/50 hover:bg-blue-900/20 transition-colors duration-150"
                  >
                    <td class="p-4 text-center">
                      <span :class="getTransactionTypeClass(transaction.type)" 
                            class="inline-flex items-center px-3 py-1.5 rounded-full text-xs md:text-sm font-medium">
                        {{ getTransactionType(transaction.type) }}
                      </span>
                    </td>
                    <td class="p-4 text-center">
                      <div class="text-gray-300 text-sm md:text-base font-medium">
                        {{ getWarehouseLabel(transaction.from_warehouse) || '-' }}
                      </div>
                    </td>
                    <td class="p-4 text-center">
                      <div class="text-gray-300 text-sm md:text-base font-medium">
                        {{ getWarehouseLabel(transaction.to_warehouse) || '-' }}
                      </div>
                    </td>
                    <td class="p-4 text-center">
                      <div class="text-blue-400 font-bold text-sm md:text-base">
                        {{ Math.abs(transaction.cartons_delta * (transaction.per_carton_updated || 1) + transaction.single_delta).toLocaleString() }}
                      </div>
                    </td>
                    <td class="p-4 text-center">
                      <div class="text-gray-300 text-xs md:text-sm">
                        {{ formatDate(transaction.timestamp) }}
                      </div>
                    </td>
                    <td class="p-4 text-center max-w-[200px]">
                      <div class="text-gray-300 text-sm md:text-base truncate" :title="transaction.notes">
                        {{ transaction.notes || '-' }}
                      </div>
                    </td>
                    <td class="p-4 text-center">
                      <button
                        @click.stop="viewTransactionDetails(transaction)"
                        class="p-2 md:p-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105"
                        title="عرض التفاصيل"
                      >
                        <span class="text-sm md:text-base">👁️</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex items-center justify-between p-4 border-t border-gray-700/50">
              <div class="text-sm text-gray-400">
                عرض {{ startIndex + 1 }} - {{ Math.min(endIndex, filteredTransactions.length) }} من {{ filteredTransactions.length }}
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="px-3 py-1.5 rounded-lg bg-gray-700/50 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600/50 transition-colors"
                >
                  السابق
                </button>
                <div class="flex items-center gap-1">
                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="currentPage = page"
                    :class="[
                      'w-8 h-8 rounded-lg transition-colors',
                      currentPage === page 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                        : 'bg-gray-700/30 text-gray-300 hover:bg-gray-600/50'
                    ]"
                  >
                    {{ page }}
                  </button>
                </div>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1.5 rounded-lg bg-gray-700/50 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600/50 transition-colors"
                >
                  التالي
                </button>
              </div>
            </div>
          </div>

          <!-- Mobile View -->
          <div class="lg:hidden">
            <div v-if="filteredTransactions.length === 0" class="p-6 md:p-8 text-center text-gray-400">
              <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-700/50 flex items-center justify-center">
                <span class="text-2xl">📭</span>
              </div>
              <h3 class="text-lg font-bold mb-2">لا توجد حركات</h3>
              <p class="text-sm">لم يتم تسجيل أي حركات حتى الآن.</p>
            </div>
            
            <div v-else class="space-y-3 p-4">
              <!-- Mobile Search -->
              <div class="mb-4">
                <input
                  type="text"
                  v-model="filters.search"
                  placeholder="🔍 ابحث..."
                  class="w-full p-3 bg-gray-700/50 rounded-xl border-2 border-blue-600/50 focus:border-blue-500 text-white placeholder-gray-400 text-sm"
                />
              </div>
              
              <!-- Mobile Cards -->
              <div 
                v-for="transaction in paginatedTransactions" 
                :key="transaction.id"
                class="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 active:bg-blue-900/20 transition-colors"
                @click="viewTransactionDetails(transaction)"
              >
                <div class="flex justify-between items-start mb-3">
                  <span :class="getTransactionTypeClass(transaction.type)" 
                        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium">
                    {{ getTransactionType(transaction.type) }}
                  </span>
                  <span class="text-xs text-gray-400 font-medium">
                    {{ formatDateShort(transaction.timestamp) }}
                  </span>
                </div>
                
                <div class="space-y-2 text-sm">
                  <div v-if="transaction.from_warehouse" class="flex items-center gap-2">
                    <span class="text-gray-400 w-8">من:</span>
                    <span class="text-gray-300 font-medium">{{ getWarehouseLabel(transaction.from_warehouse) }}</span>
                  </div>
                  <div v-if="transaction.to_warehouse" class="flex items-center gap-2">
                    <span class="text-gray-400 w-8">إلى:</span>
                    <span class="text-gray-300 font-medium">{{ getWarehouseLabel(transaction.to_warehouse) }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-400 w-8">الكمية:</span>
                    <span class="text-blue-400 font-bold">
                      {{ Math.abs(transaction.cartons_delta * (transaction.per_carton_updated || 1) + transaction.single_delta) }}
                    </span>
                  </div>
                </div>
                
                <!-- Quick Actions -->
                <div class="mt-4 pt-3 border-t border-gray-700/50 flex justify-end">
                  <button
                    @click.stop="viewTransactionDetails(transaction)"
                    class="text-blue-400 text-sm font-medium flex items-center gap-1"
                  >
                    التفاصيل
                    <span class="text-base">→</span>
                  </button>
                </div>
              </div>
              
              <!-- Mobile Pagination -->
              <div v-if="totalPages > 1" class="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/50">
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="px-4 py-2 rounded-lg bg-gray-700/50 text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  السابق
                </button>
                <span class="text-sm text-gray-400">
                  {{ currentPage }} / {{ totalPages }}
                </span>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="px-4 py-2 rounded-lg bg-gray-700/50 text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  التالي
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction Details Modal -->
    <transition name="fade">
      <div v-if="selectedTransaction" 
           class="fixed inset-0 z-50 flex items-center justify-center p-4"
           @click="selectedTransaction = null">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="selectedTransaction = null"></div>
        
        <div class="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl" @click.stop>
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-5 md:p-6">
            <div class="flex justify-between items-center">
              <h2 class="text-lg md:text-xl font-bold text-white">تفاصيل الحركة</h2>
              <button 
                @click="selectedTransaction = null" 
                class="text-white/80 hover:text-white text-xl md:text-2xl p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
          
          <!-- Content -->
          <div class="bg-gradient-to-br from-gray-800 to-gray-900 p-5 md:p-6 overflow-y-auto max-h-[70vh]">
            <div v-if="selectedTransaction" class="space-y-4 md:space-y-5">
              <!-- Transaction Type -->
              <div class="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl">
                <div class="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
                  <span class="text-white text-xl">↔</span>
                </div>
                <div class="min-w-0">
                  <div class="text-sm text-gray-400 mb-1">نوع الحركة</div>
                  <div class="text-lg font-bold text-white truncate">{{ getTransactionType(selectedTransaction.type) }}</div>
                </div>
              </div>

              <!-- Warehouses -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div v-if="selectedTransaction.from_warehouse" class="p-4 bg-gray-800/50 rounded-xl">
                  <div class="text-sm text-gray-400 mb-2">من</div>
                  <div class="text-lg font-bold text-amber-400 truncate">{{ getWarehouseLabel(selectedTransaction.from_warehouse) }}</div>
                </div>
                <div v-if="selectedTransaction.to_warehouse" class="p-4 bg-gray-800/50 rounded-xl">
                  <div class="text-sm text-gray-400 mb-2">إلى</div>
                  <div class="text-lg font-bold text-green-400 truncate">{{ getWarehouseLabel(selectedTransaction.to_warehouse) }}</div>
                </div>
              </div>

              <!-- Quantity Details -->
              <div class="p-4 bg-gray-800/50 rounded-xl">
                <div class="text-sm text-gray-400 mb-3">تفاصيل الكمية</div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div class="text-center">
                    <div class="text-xs text-gray-400 mb-1">الكراتين</div>
                    <div class="text-xl font-bold text-blue-400">{{ Math.abs(selectedTransaction.cartons_delta) || 0 }}</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xs text-gray-400 mb-1">الفردي</div>
                    <div class="text-xl font-bold text-green-400">{{ Math.abs(selectedTransaction.single_delta) || 0 }}</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xs text-gray-400 mb-1">في الكرتونة</div>
                    <div class="text-xl font-bold text-purple-400">{{ selectedTransaction.per_carton_updated || 1 }}</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xs text-gray-400 mb-1">الإجمالي</div>
                    <div class="text-xl font-bold text-white">
                      {{ Math.abs(selectedTransaction.cartons_delta * (selectedTransaction.per_carton_updated || 1) + selectedTransaction.single_delta) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Date and Notes -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div class="p-4 bg-gray-800/50 rounded-xl">
                  <div class="text-sm text-gray-400 mb-2">التاريخ والوقت</div>
                  <div class="text-white text-sm md:text-base">{{ formatDate(selectedTransaction.timestamp) }}</div>
                </div>
                <div class="p-4 bg-gray-800/50 rounded-xl">
                  <div class="text-sm text-gray-400 mb-2">ملاحظات</div>
                  <div class="text-white text-sm md:text-base whitespace-pre-wrap break-words">
                    {{ selectedTransaction.notes || 'لا توجد ملاحظات' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'TransactionHistory',
  
  setup() {
    const store = useStore()
    
    // Reactive state
    const loading = ref(false)
    const error = ref('')
    const selectedTransaction = ref(null)
    const exporting = ref(false)
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const filters = ref({
      search: '',
      type: '',
      dateRange: '',
      startDate: '',
      endDate: ''
    })

    // Helper functions
    const getTransactionType = (type) => {
      const types = {
        'ADD': 'إضافة',
        'TRANSFER': 'تحويل',
        'DISPATCH': 'صرف'
      }
      return types[type] || type
    }

    const getTransactionTypeClass = (type) => {
      const classes = {
        'ADD': 'bg-green-500/20 text-green-300 border border-green-500/30',
        'TRANSFER': 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
        'DISPATCH': 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
      }
      return classes[type] || 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
    }

    const formatDate = (timestamp) => {
      if (!timestamp) return '-'
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        if (isNaN(date.getTime())) return '-'
        
        return date.toLocaleString('ar-EG', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      } catch (err) {
        console.error('Error formatting date:', err)
        return '-'
      }
    }

    const formatDateShort = (timestamp) => {
      if (!timestamp) return '-'
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        if (isNaN(date.getTime())) return '-'
        
        return date.toLocaleString('ar-EG', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      } catch (err) {
        return '-'
      }
    }

    const getWarehouseLabel = (warehouseId) => {
      if (!warehouseId) return '-'
      const label = store.getters.getWarehouseLabel(warehouseId)
      return label || warehouseId
    }

    // Date range handler
    const handleDateRangeChange = () => {
      const today = new Date()
      switch (filters.value.dateRange) {
        case 'today':
          filters.value.startDate = today.toISOString().split('T')[0]
          filters.value.endDate = today.toISOString().split('T')[0]
          break
        case 'week':
          const weekAgo = new Date(today)
          weekAgo.setDate(today.getDate() - 7)
          filters.value.startDate = weekAgo.toISOString().split('T')[0]
          filters.value.endDate = today.toISOString().split('T')[0]
          break
        case 'month':
          const monthAgo = new Date(today)
          monthAgo.setMonth(today.getMonth() - 1)
          filters.value.startDate = monthAgo.toISOString().split('T')[0]
          filters.value.endDate = today.toISOString().split('T')[0]
          break
        case 'custom':
          // Keep existing dates or clear them
          break
        default:
          filters.value.startDate = ''
          filters.value.endDate = ''
      }
    }

    // Computed properties
    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    
    const transactionsData = computed(() => {
      try {
        return store.state.transactions || []
      } catch {
        return []
      }
    })

    // Calculate statistics
    const stats = computed(() => {
      try {
        const trans = transactionsData.value
        return {
          added: trans.filter(t => t.type === 'ADD').length,
          transferred: trans.filter(t => t.type === 'TRANSFER').length,
          dispatched: trans.filter(t => t.type === 'DISPATCH').length
        }
      } catch {
        return { added: 0, transferred: 0, dispatched: 0 }
      }
    })

    // Filter transactions
    const filteredTransactions = computed(() => {
      try {
        let filtered = [...transactionsData.value]
        
        // Type filter
        if (filters.value.type) {
          filtered = filtered.filter(t => t.type === filters.value.type)
        }
        
        // Search filter
        if (filters.value.search) {
          const searchTerm = filters.value.search.toLowerCase()
          filtered = filtered.filter(t => {
            const fromWarehouse = getWarehouseLabel(t.from_warehouse) || ''
            const toWarehouse = getWarehouseLabel(t.to_warehouse) || ''
            const notes = t.notes || ''
            const type = getTransactionType(t.type) || ''
            
            return fromWarehouse.toLowerCase().includes(searchTerm) ||
                   toWarehouse.toLowerCase().includes(searchTerm) ||
                   notes.toLowerCase().includes(searchTerm) ||
                   type.toLowerCase().includes(searchTerm)
          })
        }
        
        // Date filter
        if (filters.value.startDate) {
          const startDate = new Date(filters.value.startDate)
          startDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter(t => {
            if (!t.timestamp) return false
            const date = t.timestamp.toDate ? t.timestamp.toDate() : new Date(t.timestamp)
            return date >= startDate
          })
        }
        
        if (filters.value.endDate) {
          const endDate = new Date(filters.value.endDate)
          endDate.setHours(23, 59, 59, 999)
          filtered = filtered.filter(t => {
            if (!t.timestamp) return false
            const date = t.timestamp.toDate ? t.timestamp.toDate() : new Date(t.timestamp)
            return date <= endDate
          })
        }
        
        // Sort by date descending
        return filtered.sort((a, b) => {
          const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0)
          const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0)
          return dateB - dateA
        })
      } catch {
        return []
      }
    })

    // Pagination
    const totalPages = computed(() => {
      return Math.ceil(filteredTransactions.value.length / itemsPerPage.value)
    })

    const startIndex = computed(() => {
      return (currentPage.value - 1) * itemsPerPage.value
    })

    const endIndex = computed(() => {
      return startIndex.value + itemsPerPage.value
    })

    const paginatedTransactions = computed(() => {
      return filteredTransactions.value.slice(startIndex.value, endIndex.value)
    })

    const visiblePages = computed(() => {
      const pages = []
      const maxVisible = 5
      let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
      let end = Math.min(totalPages.value, start + maxVisible - 1)
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    })

    // Methods
    const refreshData = async () => {
      try {
        loading.value = true
        error.value = ''
        await store.dispatch('getRecentTransactions')
      } catch (err) {
        error.value = 'فشل في تحديث البيانات: ' + (err.message || 'خطأ غير معروف')
      } finally {
        loading.value = false
      }
    }

    const exportData = async () => {
      try {
        exporting.value = true
        const data = filteredTransactions.value
        
        if (data.length === 0) {
          error.value = 'لا توجد بيانات للتصدير'
          return
        }

        const headers = ['النوع', 'من', 'إلى', 'الكمية', 'التاريخ', 'ملاحظات']
        const csvData = data.map(transaction => [
          getTransactionType(transaction.type),
          getWarehouseLabel(transaction.from_warehouse) || '-',
          getWarehouseLabel(transaction.to_warehouse) || '-',
          Math.abs(transaction.cartons_delta * (transaction.per_carton_updated || 1) + transaction.single_delta),
          formatDate(transaction.timestamp),
          transaction.notes || '-'
        ])

        const csvContent = [
          '\uFEFF' + headers.join(','),
          ...csvData.map(row => row.map(field => `"${field}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `حركات-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        store.dispatch('showNotification', {
          type: 'success',
          message: `تم تصدير ${data.length} حركة بنجاح`
        })
        
      } catch (err) {
        error.value = 'فشل في تصدير الملف: ' + err.message
      } finally {
        exporting.value = false
      }
    }

    const viewTransactionDetails = (transaction) => {
      selectedTransaction.value = transaction
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    // Watch for filter changes to reset page
    watch(() => [filters.value.search, filters.value.type, filters.value.startDate, filters.value.endDate], () => {
      currentPage.value = 1
    })

    // Lifecycle
    onMounted(() => {
      if (isAuthenticated.value) {
        refreshData()
      }
    })

    return {
      // State
      loading,
      error,
      selectedTransaction,
      filters,
      exporting,
      currentPage,
      
      // Computed
      isAuthenticated,
      transactionsData,
      stats,
      filteredTransactions,
      paginatedTransactions,
      totalPages,
      startIndex,
      endIndex,
      visiblePages,
      
      // Methods
      getTransactionType,
      getTransactionTypeClass,
      formatDate,
      formatDateShort,
      getWarehouseLabel,
      handleDateRangeChange,
      refreshData,
      exportData,
      viewTransactionDetails,
      nextPage,
      prevPage
    }
  }
}
</script>

<style scoped>
.font-tajawal {
  font-family: 'Tajawal', 'Amiri', sans-serif;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Improved scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.8);
}

/* Responsive text truncation */
.truncate-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Mobile touch improvements */
@media (max-width: 768px) {
  button, 
  .clickable {
    min-height: 44px;
    min-width: 44px;
  }
  
  input, 
  select {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
</style> 