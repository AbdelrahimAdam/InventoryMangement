<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl rtl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="sticky top-0 bg-white dark:bg-gray-800 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ preSelectedItem ? 'صرف سريع' : 'صرف أصناف للفروع' }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ preSelectedItem ? 'أدخل تفاصيل الصرف' : 'اختر الصنف من القائمة وأدخل كمية الصرف' }}
            </p>
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

        <!-- Pre-selected Item Display -->
        <div v-if="preSelectedItem" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div class="flex items-center justify-between mb-3">
            <h5 class="text-sm font-medium text-blue-800 dark:text-blue-300">الصنف المحدد للصرف السريع</h5>
            <button
              @click="clearSelection"
              class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              :disabled="loading"
            >
              تغيير الصنف
            </button>
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            <div>
              <div class="text-xs text-blue-600 dark:text-blue-400">الاسم</div>
              <div class="text-sm font-medium text-blue-900 dark:text-blue-200">{{ preSelectedItem.name || preSelectedItem.item_name }}</div>
            </div>
            <div>
              <div class="text-xs text-blue-600 dark:text-blue-400">الكود</div>
              <div class="text-sm font-medium text-blue-900 dark:text-blue-200">{{ preSelectedItem.code || preSelectedItem.item_code }}</div>
            </div>
            <div>
              <div class="text-xs text-blue-600 dark:text-blue-400">اللون</div>
              <div class="text-sm font-medium text-blue-900 dark:text-blue-200">{{ preSelectedItem.color || '---' }}</div>
            </div>
            <div>
              <div class="text-xs text-blue-600 dark:text-blue-400">المخزن</div>
              <div class="text-sm font-medium text-blue-900 dark:text-blue-200">{{ getWarehouseName(preSelectedItem.warehouse_id) }}</div>
            </div>
            <!-- QUANTITY DISPLAY - GREEN for existing quantity -->
            <div>
              <div class="text-xs text-blue-600 dark:text-blue-400">الكمية المتاحة</div>
              <div class="text-sm font-medium text-green-600 dark:text-green-400">
                {{ preSelectedItem.remaining_quantity || preSelectedItem.quantity || 0 }}
              </div>
            </div>
            <div>
              <div class="text-xs text-blue-600 dark:text-blue-400">المورد</div>
              <div class="text-sm font-medium text-blue-900 dark:text-blue-200">{{ preSelectedItem.supplier || '---' }}</div>
            </div>
          </div>
        </div>

        <!-- Step 1: Warehouse Selection (Only show if no pre-selected item) -->
        <div v-if="!preSelectedItem">
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
              class="text-gray-900 dark:text-white"
            >
              {{ warehouse.name_ar }}
            </option>
          </select>
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
          
          <!-- Selected Destination Info -->
          <div v-if="form.destinationBranch" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span class="font-medium">الوجهة المحددة:</span> {{ getDestinationName(form.destinationBranch) }}
          </div>
        </div>

        <!-- Step 3: Item Selection (Only show if no pre-selected item) -->
        <div v-if="!preSelectedItem && form.sourceWarehouse">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <span class="h-6 w-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-xs ml-2">3</span>
              اختر الصنف المراد صرفه
            </h4>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ searchResults.length }} صنف متاح
            </div>
          </div>

          <!-- Search Input -->
          <div class="relative mb-4">
            <input
              v-model="searchTerm"
              @input="handleSearch"
              type="text"
              placeholder="ابحث عن صنف..."
              class="w-full pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              :disabled="loading || !form.sourceWarehouse || (!isSuperadmin && !canViewDispatch)"
            >
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 1114 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Items List -->
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div class="max-h-60 overflow-y-auto">
              <div
                v-for="item in searchResults"
                :key="item.id"
                @click="selectItem(item)"
                :class="[
                  'p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 cursor-pointer',
                  selectedItem?.id === item.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''
                ]"
                :disabled="loading || (!isSuperadmin && !canPerformDispatch) || (item.remaining_quantity || item.quantity || 0) <= 0"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="font-medium text-sm text-gray-900 dark:text-white">{{ item.name || item.item_name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ item.code || item.item_code }}</div>
                    <div class="flex items-center justify-between mt-2">
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        المخزن: {{ getWarehouseName(item.warehouse_id) }}
                      </div>
                      <!-- QUANTITY DISPLAY - GREEN for existing quantity -->
                      <span class="text-sm font-medium text-green-600 dark:text-green-400">
                        {{ item.remaining_quantity || item.quantity || 0 }} متبقي
                      </span>
                    </div>
                  </div>
                  <svg class="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Quantity and Details (Show when item is selected) -->
        <div v-if="(selectedItem || preSelectedItem) && (isSuperadmin || canPerformDispatch)">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <span class="h-6 w-6 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center text-xs ml-2">
              {{ preSelectedItem ? '2' : '4' }}
            </span>
            أدخل تفاصيل الصرف
          </h4>

          <div class="space-y-4">
            <!-- Quantity Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الكمية المراد صرفها
                <span class="text-xs font-normal text-gray-500 dark:text-gray-400">
                  (الحد الأقصى: {{ currentItem.remaining_quantity || currentItem.quantity || 0 }})
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
                  :max="currentItem.remaining_quantity || currentItem.quantity || 0"
                  min="1"
                  step="1"
                  required
                  :disabled="loading"
                  class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  @input="updateQuantity"
                >
                <button
                  @click="increaseQuantity"
                  :disabled="loading || form.quantity >= (currentItem.remaining_quantity || currentItem.quantity || 0)"
                  class="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </button>
              </div>
              
              <!-- Quantity Summary -->
              <div class="flex items-center justify-between mt-2">
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  <!-- Existing quantity in GREEN -->
                  <span class="text-green-600 dark:text-green-400 font-medium">
                    متبقي: {{ (currentItem.remaining_quantity || currentItem.quantity || 0) - form.quantity }}
                  </span>
                </div>
                <button
                  @click="setMaxQuantity"
                  :disabled="loading"
                  class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50"
                >
                  استخدام الكل
                </button>
              </div>
              
              <!-- Dispatched quantity in RED -->
              <div class="mt-2 text-sm">
                <span class="text-gray-600 dark:text-gray-400">سيتم صرف:</span>
                <span class="font-medium text-red-600 dark:text-red-400 mr-1">
                  {{ form.quantity }} وحدة
                </span>
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
    const isSearching = ref(false)
    const searchResults = ref([])
    const dispatchWarehouses = ref([])
    const searchTimeout = ref(null)

    // Store the pre-selected item from props
    const preSelectedItem = ref(props.item)

    // Computed properties
    const userProfile = computed(() => store.state.userProfile || {})
    const warehouses = computed(() => store.state.warehouses || [])
    const inventory = computed(() => store.state.inventory || [])
    const branches = computed(() => store.state.branches || [])
    
    // Check if user is superadmin
    const isSuperadmin = computed(() => {
      return userProfile.value?.role === 'superadmin'
    })

    // Current item (either pre-selected or selected)
    const currentItem = computed(() => preSelectedItem.value || selectedItem.value)

    // Compute dispatch destinations
    const dispatchDestinations = computed(() => {
      if (dispatchWarehouses.value.length > 0) {
        return dispatchWarehouses.value.map(warehouse => ({
          ...warehouse,
          icon: '🏢'
        }))
      }
      
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
             (userProfile.value?.role === 'company_manager')
    })

    // Get stock class for styling - UPDATED: Green for existing quantity
    const getStockClass = (quantity) => {
      return 'text-green-600 dark:text-green-400'
    }

    // Select item function
    const selectItem = (item) => {
      if ((!isSuperadmin.value && !canPerformDispatch.value) || 
          (item.remaining_quantity || item.quantity || 0) <= 0) {
        return
      }
      selectedItem.value = item
      form.quantity = 1
      
      // Auto-set source warehouse if not set
      if (!form.sourceWarehouse && item.warehouse_id) {
        form.sourceWarehouse = item.warehouse_id
      }
    }

    // Update quantity
    const updateQuantity = () => {
      if (!currentItem.value) return
      const maxQuantity = currentItem.value.remaining_quantity || currentItem.value.quantity || 0
      if (form.quantity > maxQuantity) {
        form.quantity = maxQuantity
      }
      if (form.quantity < 1 && maxQuantity > 0) {
        form.quantity = 1
      }
    }

    // Quantity helper functions
    const increaseQuantity = () => {
      if (!currentItem.value) return
      const maxQuantity = currentItem.value.remaining_quantity || currentItem.value.quantity || 0
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
      if (!currentItem.value) return
      const maxQuantity = currentItem.value.remaining_quantity || currentItem.value.quantity || 0
      form.quantity = maxQuantity
    }

    // Search function
    const handleSearch = () => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
      }
      
      searchTimeout.value = setTimeout(() => {
        performSearch()
      }, 300)
    }

    const performSearch = () => {
      const term = searchTerm.value.trim().toLowerCase()
      
      if (!term || !form.sourceWarehouse) {
        searchResults.value = []
        return
      }

      // Filter items from selected warehouse
      const warehouseItems = inventory.value.filter(item => 
        item.warehouse_id === form.sourceWarehouse &&
        (item.remaining_quantity || item.quantity || 0) > 0
      )

      // Search in warehouse items
      searchResults.value = warehouseItems.filter(item => {
        return (
          item.name?.toLowerCase().includes(term) ||
          item.item_name?.toLowerCase().includes(term) ||
          item.code?.toLowerCase().includes(term) ||
          item.item_code?.toLowerCase().includes(term) ||
          item.color?.toLowerCase().includes(term) ||
          item.supplier?.toLowerCase().includes(term)
        )
      }).slice(0, 20)
    }

    const onWarehouseChange = () => {
      selectedItem.value = null
      searchTerm.value = ''
      searchResults.value = []
      error.value = ''
      
      if (form.sourceWarehouse) {
        // Load items from selected warehouse
        const warehouseItems = inventory.value.filter(item => 
          item.warehouse_id === form.sourceWarehouse &&
          (item.remaining_quantity || item.quantity || 0) > 0
        ).slice(0, 20)
        
        searchResults.value = warehouseItems
      }
    }

    // Clear selection
    const clearSelection = () => {
      selectedItem.value = null
      preSelectedItem.value = null
      form.sourceWarehouse = ''
      form.destinationBranch = ''
      form.quantity = 1
      searchTerm.value = ''
      searchResults.value = []
      error.value = ''
      successMessage.value = ''
    }

    // Handle submit
    const handleSubmit = async () => {
      error.value = ''
      successMessage.value = ''
      
      // Validation
      if (!currentItem.value) {
        error.value = 'يرجى اختيار صنف للصرف'
        return
      }

      if (!form.destinationBranch) {
        error.value = 'يرجى اختيار الوجهة'
        return
      }

      if (!form.quantity || form.quantity <= 0) {
        error.value = 'يرجى إدخال كمية صحيحة'
        return
      }

      const availableQuantity = currentItem.value.remaining_quantity || currentItem.value.quantity || 0
      if (form.quantity > availableQuantity) {
        error.value = `الكمية المطلوبة (${form.quantity}) تتجاوز الكمية المتاحة (${availableQuantity})`
        return
      }
      
      const currentItemObj = currentItem.value
      const totalToDispatch = form.quantity
      
      // Get item details
      const itemId = currentItemObj.id
      const itemName = currentItemObj.name || currentItemObj.item_name || 'بدون اسم'
      const itemCode = currentItemObj.code || currentItemObj.item_code || 'بدون كود'
      const fromWarehouseId = form.sourceWarehouse || currentItemObj.warehouse_id
      
      if (!itemId) {
        error.value = 'معرف الصنف غير صالح'
        return
      }

      loading.value = true

      try {
        // Prepare dispatch data
        const dispatchData = {
          item_id: itemId,
          from_warehouse_id: fromWarehouseId,
          destination: 'dispat_item',
          destination_id: form.destinationBranch,
          
          quantity: totalToDispatch,
          cartons_count: 0,
          per_carton_count: 12,
          single_bottles_count: totalToDispatch,
          
          item_name: itemName,
          item_code: itemCode,
          color: currentItemObj.color || '',
          
          from_warehouse_name: getWarehouseName(fromWarehouseId),
          
          notes: form.notes || `صرف إلى ${getDestinationName(form.destinationBranch)}`,
          priority: form.priority,
          supplier: currentItemObj.supplier || ''
        }

        console.log('📤 Sending dispatch:', dispatchData)

        // Call store dispatch
        const result = await store.dispatch('dispatchItem', dispatchData)

        if (result?.success) {
          // Calculate new quantity
          const newQuantity = availableQuantity - totalToDispatch
          
          successMessage.value = `تم صرف ${totalToDispatch} وحدة بنجاح`
          
          // Create result for emit
          const completeResult = {
            success: true,
            message: result.message || 'تم الصرف بنجاح',
            transactionId: result.transactionId,
            newQuantity: result.newQuantity || newQuantity,
            
            item_id: itemId,
            id: itemId,
            item_name: itemName,
            item_code: itemCode,
            
            quantity: totalToDispatch,
            from_warehouse_id: fromWarehouseId,
            destination: form.destinationBranch,
            destination_name: getDestinationName(form.destinationBranch),
            
            ...(result.detailedUpdate && { detailedUpdate: result.detailedUpdate })
          }

          // Reset and close
          resetForm()
          
          setTimeout(() => {
            emit('success', completeResult)
            emit('close')
          }, 1500)
          
        } else {
          const errorMessage = result?.message || result?.error || 'فشل في عملية الصرف'
          throw new Error(`${errorMessage}`)
        }
        
      } catch (err) {
        console.error('❌ Dispatch error:', err)
        
        // User-friendly error messages
        if (err.message.includes('تتجاوز')) {
          error.value = err.message
        } else if (err.message.includes('ليس لديك صلاحية')) {
          error.value = 'ليس لديك صلاحية للصرف من هذا المخزن'
        } else if (err.message.includes('الصنف ليس في المخزن')) {
          error.value = 'الصنف لم يعد موجوداً في المخزن المحدد'
        } else {
          error.value = `خطأ: ${err.message}`
        }
        
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
      preSelectedItem.value = null
      error.value = ''
      successMessage.value = ''
      
      searchTerm.value = ''
      searchResults.value = []
    }

    // Load dispatch warehouses when modal opens
    const loadDispatchWarehouses = async () => {
      if (dispatchWarehouses.value.length === 0) {
        try {
          let warehouses = []
          
          try {
            warehouses = await store.dispatch('getDispatchWarehouses')
          } catch (error) {
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
        }
      }
    }

    // Watch for modal opening
    watch(() => props.isOpen, (isOpen) => {
      if (isOpen) {
        resetForm()
        preSelectedItem.value = props.item
        
        // If item is passed, auto-set warehouse
        if (preSelectedItem.value && preSelectedItem.value.warehouse_id) {
          form.sourceWarehouse = preSelectedItem.value.warehouse_id
          form.quantity = 1
        }
        
        loadDispatchWarehouses()
      }
    })

    // Watch for item prop changes
    watch(() => props.item, (newItem) => {
      preSelectedItem.value = newItem
      if (preSelectedItem.value && preSelectedItem.value.warehouse_id) {
        form.sourceWarehouse = preSelectedItem.value.warehouse_id
        form.quantity = 1
      }
    })

    onUnmounted(() => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
      }
    })

    // Submit button disabled state
    const isSubmitDisabled = computed(() => {
      if (loading.value) return true
      if (!currentItem.value || !form.destinationBranch || form.quantity <= 0) {
        return true
      }
      const available = currentItem.value.remaining_quantity || currentItem.value.quantity || 0
      if (form.quantity > available) {
        return true
      }
      if (!isSuperadmin.value && !canPerformDispatch.value) {
        return true
      }
      return false
    })

    // Modal control
    const closeModal = () => {
      if (!loading.value) {
        resetForm()
        emit('close')
      }
    }

    return {
      // Form and state
      form,
      loading,
      error,
      successMessage,
      selectedItem,
      preSelectedItem,
      currentItem,
      searchTerm,
      isSearching,
      searchResults,
      
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
      
      // Methods
      selectItem,
      clearSelection,
      onWarehouseChange,
      increaseQuantity,
      decreaseQuantity,
      setMaxQuantity,
      updateQuantity,
      getWarehouseName,
      getDestinationName,
      getStockClass,
      handleSearch,
      handleSubmit,
      
      // Computed for submit button
      isSubmitDisabled,
      
      // Modal control
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
