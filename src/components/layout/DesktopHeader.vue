<template>
  <header class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-4 py-2.5 shadow-sm">
    <div class="flex items-center justify-between">
      <!-- Breadcrumb and Title -->
      <div class="flex items-center space-x-3 space-x-reverse">
        <button 
          @click="$emit('toggle-sidebar')"
          class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm lg:hidden"
        >
          <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div>
          <h1 class="text-lg font-bold text-gray-800 dark:text-gray-100">
            {{ pageTitle }}
          </h1>
          <div class="flex items-center space-x-2 space-x-reverse mt-0.5">
            <p v-if="currentWarehouseName" class="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full">
              {{ currentWarehouseName }}
            </p>
            <span v-if="userRole" class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              {{ roleName }}
            </span>
          </div>
        </div>
      </div>

      <!-- Header Actions -->
      <div class="flex items-center space-x-2 space-x-reverse">
        <!-- Advanced Search with Dropdown Results -->
        <div class="relative hidden md:block">
          <div class="relative">
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input
              ref="searchInput"
              type="search"
              v-model="searchQuery"
              @input="handleSearchInput"
              @focus="showSearchResults = true"
              @blur="onSearchBlur"
              placeholder="ابحث عن صنف، كود، لون، مخزن..."
              class="w-64 pr-9 pl-3 py-2 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 backdrop-blur-sm shadow-sm transition-all duration-200"
              :class="{'border-yellow-500': searchQuery}"
            />
            
            <!-- Clear Search Button -->
            <button 
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors duration-200"
            >
              <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Search Results Dropdown -->
          <div 
            v-if="showSearchResults && searchResults.length > 0"
            class="absolute left-0 mt-1 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50"
          >
            <div class="p-2 border-b border-gray-100 dark:border-gray-700">
              <div class="flex items-center justify-between px-2 py-1">
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ searchResults.length }} نتيجة
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  في {{ searchType === 'items' ? 'الأصناف' : 'الحركات' }}
                </span>
              </div>
            </div>

            <div class="py-1">
              <!-- Switch between Items and Transactions -->
              <div class="flex border-b border-gray-100 dark:border-gray-700">
                <button 
                  @click="searchType = 'items'"
                  :class="[
                    'flex-1 px-3 py-2 text-xs font-medium transition-colors duration-200',
                    searchType === 'items' 
                      ? 'text-yellow-600 dark:text-yellow-400 border-b-2 border-yellow-500' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                  ]"
                >
                  الأصناف
                </button>
                <button 
                  @click="searchType = 'transactions'"
                  :class="[
                    'flex-1 px-3 py-2 text-xs font-medium transition-colors duration-200',
                    searchType === 'transactions' 
                      ? 'text-yellow-600 dark:text-yellow-400 border-b-2 border-yellow-500' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                  ]"
                >
                  الحركات
                </button>
              </div>

              <!-- Search Results List -->
              <div v-if="searchType === 'items'">
                <router-link 
                  v-for="item in searchResults.slice(0, 8)"
                  :key="item.id"
                  :to="`/inventory/item/${item.id}`"
                  @click="clearSearch"
                  class="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <div class="flex-shrink-0">
                    <div class="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                      </svg>
                    </div>
                  </div>
                  <div class="mr-3 flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-0.5">
                      <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {{ item.name }}
                      </h4>
                      <span class="text-xs font-bold text-yellow-600 dark:text-yellow-400 ml-1">
                        {{ item.remaining_quantity || 0 }}
                      </span>
                    </div>
                    <div class="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 gap-x-2">
                      <span>{{ item.code }}</span>
                      <span>•</span>
                      <span>{{ item.color }}</span>
                      <span>•</span>
                      <span>{{ getWarehouseLabel(item.warehouse_id) }}</span>
                    </div>
                  </div>
                </router-link>
              </div>

              <div v-else>
                <router-link 
                  v-for="transaction in searchResults.slice(0, 8)"
                  :key="transaction.id"
                  :to="`/transactions`"
                  @click="clearSearch"
                  class="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <div class="flex-shrink-0">
                    <div :class="[
                      'h-8 w-8 rounded-lg flex items-center justify-center',
                      transaction.type === 'ADD' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-300' :
                      transaction.type === 'TRANSFER' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300' :
                      'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300'
                    ]">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="transaction.type === 'ADD'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        <path v-if="transaction.type === 'TRANSFER'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                        <path v-if="transaction.type === 'DISPATCH'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                    </div>
                  </div>
                  <div class="mr-3 flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-0.5">
                      <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {{ transaction.item_name }}
                      </h4>
                      <span class="text-xs font-bold" :class="transaction.type === 'ADD' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'">
                        {{ transaction.type === 'ADD' ? '+' : '' }}{{ transaction.total_delta || 0 }}
                      </span>
                    </div>
                    <div class="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 gap-x-2">
                      <span>{{ formatTime(transaction.timestamp) }}</span>
                      <span>•</span>
                      <span v-if="transaction.from_warehouse">من {{ getWarehouseLabel(transaction.from_warehouse) }}</span>
                      <span v-if="transaction.to_warehouse">إلى {{ getWarehouseLabel(transaction.to_warehouse) }}</span>
                    </div>
                  </div>
                </router-link>
              </div>

              <!-- View All Results Link -->
              <div class="p-2 border-t border-gray-100 dark:border-gray-700">
                <router-link 
                  v-if="searchType === 'items' && searchResults.length > 8"
                  to="/inventory"
                  @click="clearSearch"
                  class="block text-center px-3 py-1.5 text-xs font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 rounded-lg transition-colors duration-200"
                >
                  عرض جميع النتائج ({{ searchResults.length }})
                </router-link>
                <router-link 
                  v-else-if="searchType === 'transactions' && searchResults.length > 8"
                  to="/transactions"
                  @click="clearSearch"
                  class="block text-center px-3 py-1.5 text-xs font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 rounded-lg transition-colors duration-200"
                >
                  عرض جميع النتائج ({{ searchResults.length }})
                </router-link>
              </div>
            </div>
          </div>

          <!-- No Results Found -->
          <div 
            v-if="showSearchResults && searchQuery && searchResults.length === 0"
            class="absolute left-0 mt-1 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50"
          >
            <div class="p-4 text-center">
              <svg class="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-sm text-gray-700 dark:text-gray-300 mb-1">لم يتم العثور على نتائج</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                جرب البحث بـ "{{ searchQuery }}"
              </p>
            </div>
          </div>
        </div>

        <!-- Dark Mode -->
        <button 
          @click="toggleDarkMode"
          class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
          title="تبديل الوضع"
        >
          <svg v-if="isDarkMode" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
          </svg>
          <svg v-else class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
          </svg>
        </button>

        <!-- Notifications -->
        <button 
          @click="showNotifications"
          class="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
          title="الإشعارات"
        >
          <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <span v-if="realNotificationCount > 0" class="absolute -top-0.5 -left-0.5 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-md">
            {{ realNotificationCount > 9 ? '9+' : realNotificationCount }}
          </span>
        </button>

        <!-- User Profile Dropdown -->
        <div class="relative" ref="profileDropdown">
          <button 
            @click="toggleProfileMenu"
            class="flex items-center space-x-2 space-x-reverse p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-600 shadow-sm"
          >
            <div class="h-7 w-7 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
              <span class="text-white text-xs font-medium">
                {{ getUserInitials() }}
              </span>
            </div>
            <div class="text-right hidden md:block">
              <p class="text-xs font-medium text-gray-800 dark:text-gray-100">
                {{ userName }}
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                {{ roleName }}
              </p>
            </div>
            <svg class="w-3 h-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <div 
            v-if="profileMenuOpen"
            class="absolute left-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
          >
            <router-link 
              to="/profile" 
              @click="closeProfileMenu"
              class="flex items-center px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <svg class="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              إعدادات الحساب
            </router-link>
            <button 
              @click="handleLogout"
              class="w-full flex items-center px-3 py-2 text-xs text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
            >
              <svg class="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              تسجيل خروج
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { debounce } from 'lodash-es'

export default {
  name: 'DesktopHeader',
  emits: ['toggle-sidebar'],
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    
    // Refs
    const profileMenuOpen = ref(false)
    const profileDropdown = ref(null)
    const searchInput = ref(null)
    const searchQuery = ref('')
    const showSearchResults = ref(false)
    const searchType = ref('items') // 'items' or 'transactions'
    
    // Computed properties
    const notifications = computed(() => store.state.notifications || [])
    const userProfile = computed(() => store.state.userProfile)
    const user = computed(() => store.state.user)
    const userRole = computed(() => store.getters.userRole)
    const allInventory = computed(() => store.state.inventory || [])
    const allTransactions = computed(() => store.state.transactions || [])
    const accessibleWarehouses = computed(() => store.getters.accessibleWarehouses || [])
    
    const realNotificationCount = computed(() => notifications.value.length)
    const currentWarehouseName = computed(() => {
      const mainWarehouse = store.getters.mainWarehouse
      return mainWarehouse?.name_ar || ''
    })
    
    const isDarkMode = computed(() => {
      return document.documentElement.classList.contains('dark')
    })
    
    const pageTitle = computed(() => {
      const titles = {
        'Dashboard': 'لوحة التحكم',
        'Inventory': 'الأصناف',
        'ItemDetails': 'تفاصيل الصنف',
        'AddInventory': 'إضافة صنف جديد',
        'Transactions': 'سجل الحركات',
        'Warehouses': 'المخازن',
        'Users': 'المستخدمين',
        'Reports': 'التقارير',
        'Profile': 'الملف الشخصي',
        'Transfers': 'نقل المخزون',
        'Dispatch': 'الصرف الخارجي'
      }
      return titles[route.name] || 'نظام المخزون'
    })
    
    const userName = computed(() => {
      return userProfile.value?.name || userProfile.value?.email || user.value?.email || 'مستخدم'
    })
    
    const roleName = computed(() => {
      const names = {
        superadmin: 'المشرف العام',
        warehouse_manager: 'مدير المخازن',
        company_manager: 'مدير الشركة',
        user: 'مستخدم'
      }
      return names[userRole.value] || 'مستخدم'
    })
    
    // Search results computed property
    const searchResults = computed(() => {
      if (!searchQuery.value.trim()) return []
      
      const query = searchQuery.value.toLowerCase().trim()
      
      if (searchType.value === 'items') {
        return allInventory.value.filter(item => {
          if (!item) return false
          
          // Check if item matches search query in multiple fields
          const matchesName = (item.name || '').toLowerCase().includes(query)
          const matchesCode = (item.code || '').toLowerCase().includes(query)
          const matchesColor = (item.color || '').toLowerCase().includes(query)
          const matchesSupplier = (item.supplier || '').toLowerCase().includes(query)
          const matchesLocation = (item.item_location || '').toLowerCase().includes(query)
          
          // Check warehouse name
          const warehouseLabel = store.getters.getWarehouseLabel(item.warehouse_id)
          const matchesWarehouse = (warehouseLabel || '').toLowerCase().includes(query)
          
          return matchesName || matchesCode || matchesColor || matchesSupplier || matchesLocation || matchesWarehouse
        })
      } else {
        return allTransactions.value.filter(transaction => {
          if (!transaction) return false
          
          const matchesItemName = (transaction.item_name || '').toLowerCase().includes(query)
          const matchesItemCode = (transaction.item_code || '').toLowerCase().includes(query)
          const matchesNotes = (transaction.notes || '').toLowerCase().includes(query)
          const matchesUserName = (transaction.user_name || '').toLowerCase().includes(query)
          
          // Check warehouse names
          const fromWarehouseLabel = store.getters.getWarehouseLabel(transaction.from_warehouse)
          const toWarehouseLabel = store.getters.getWarehouseLabel(transaction.to_warehouse)
          const matchesFromWarehouse = (fromWarehouseLabel || '').toLowerCase().includes(query)
          const matchesToWarehouse = (toWarehouseLabel || '').toLowerCase().includes(query)
          
          return matchesItemName || matchesItemCode || matchesNotes || matchesUserName || matchesFromWarehouse || matchesToWarehouse
        })
      }
    })
    
    // Methods
    const getUserInitials = () => {
      const name = userName.value
      if (!name || name === 'مستخدم') return 'م'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    }
    
    const getWarehouseLabel = (warehouseId) => {
      if (!warehouseId) return ''
      return store.getters.getWarehouseLabel(warehouseId) || warehouseId
    }
    
    const formatTime = (timestamp) => {
      if (!timestamp) return ''
      
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)
        
        if (diffMins < 60) {
          return `منذ ${diffMins} دقيقة`
        } else if (diffHours < 24) {
          return `منذ ${diffHours} ساعة`
        } else if (diffDays < 7) {
          return `منذ ${diffDays} يوم`
        } else {
          return date.toLocaleDateString('ar-EG')
        }
      } catch (error) {
        return ''
      }
    }
    
    const toggleDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark')
      if (isDark) {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      } else {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      }
    }
    
    const showNotifications = () => {
      router.push('/transactions')
    }
    
    const handleLogout = async () => {
      try {
        closeProfileMenu()
        await store.dispatch('logout')
        router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
        router.push('/login')
      }
    }
    
    const toggleProfileMenu = () => {
      profileMenuOpen.value = !profileMenuOpen.value
    }
    
    const closeProfileMenu = () => {
      profileMenuOpen.value = false
    }
    
    // Search functionality
    const handleSearchInput = debounce(() => {
      if (searchQuery.value.trim()) {
        showSearchResults.value = true
      } else {
        showSearchResults.value = false
      }
    }, 300)
    
    const clearSearch = () => {
      searchQuery.value = ''
      showSearchResults.value = false
    }
    
    const onSearchBlur = () => {
      // Small delay to allow click events on dropdown items
      setTimeout(() => {
        if (!searchQuery.value) {
          showSearchResults.value = false
        }
      }, 200)
    }
    
    // Handle click outside
    const handleClickOutside = (event) => {
      if (profileDropdown.value && !profileDropdown.value.contains(event.target)) {
        closeProfileMenu()
      }
      
      // Close search results when clicking outside
      if (searchInput.value && !searchInput.value.contains(event.target)) {
        showSearchResults.value = false
      }
    }
    
    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (profileMenuOpen.value) {
          closeProfileMenu()
        }
        if (showSearchResults.value) {
          showSearchResults.value = false
        }
      }
    }
    
    // Handle keyboard shortcuts
    const handleKeyboardShortcuts = (e) => {
      // Ctrl + K or Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        if (searchInput.value) {
          searchInput.value.focus()
          showSearchResults.value = true
        }
      }
      
      // / to focus search
      if (e.key === '/' && document.activeElement !== searchInput.value) {
        e.preventDefault()
        if (searchInput.value) {
          searchInput.value.focus()
          showSearchResults.value = true
        }
      }
    }
    
    // Watch for route changes to close search results
    watch(() => route.path, () => {
      clearSearch()
    })
    
    onMounted(() => {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('keydown', handleKeyboardShortcuts)
      document.addEventListener('click', handleClickOutside)
    })
    
    onUnmounted(() => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleKeyboardShortcuts)
      document.removeEventListener('click', handleClickOutside)
    })
    
    return {
      // Refs
      profileMenuOpen,
      profileDropdown,
      searchInput,
      searchQuery,
      showSearchResults,
      searchType,
      searchResults,
      
      // Computed
      pageTitle,
      currentWarehouseName,
      realNotificationCount,
      isDarkMode,
      userName,
      roleName,
      
      // Methods
      getUserInitials,
      getWarehouseLabel,
      formatTime,
      toggleDarkMode,
      showNotifications,
      handleLogout,
      toggleProfileMenu,
      closeProfileMenu,
      handleSearchInput,
      clearSearch,
      onSearchBlur
    }
  }
}
</script>

<style scoped>
/* Custom scrollbar for search results */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
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
  background: #6b7280;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
