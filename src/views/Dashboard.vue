<template>
  <div class="space-y-4 lg:space-y-6">
    <!-- Stats Overview -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-200 hover:shadow-md">
        <div class="px-3 py-4 lg:px-4 lg:py-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
              <svg class="h-5 w-5 lg:h-6 lg:w-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div class="mr-3 lg:mr-4">
              <dt class="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">إجمالي الأصناف</dt>
              <dd class="mt-1 text-lg lg:text-2xl font-semibold text-gray-900 dark:text-white">{{ dashboardStats?.totalItems || 0 }}</dd>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-200 hover:shadow-md">
        <div class="px-3 py-4 lg:px-4 lg:py-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <svg class="h-5 w-5 lg:h-6 lg:w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="mr-3 lg:mr-4">
              <dt class="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">إجمالي الكمية</dt>
              <dd class="mt-1 text-lg lg:text-2xl font-semibold text-gray-900 dark:text-white">{{ formatNumber(dashboardStats?.totalQuantity || 0) }}</dd>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-200 hover:shadow-md">
        <div class="px-3 py-4 lg:px-4 lg:py-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <svg class="h-5 w-5 lg:h-6 lg:w-6 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="mr-3 lg:mr-4">
              <dt class="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">أصناف قليلة</dt>
              <dd class="mt-1 text-lg lg:text-2xl font-semibold text-red-600 dark:text-red-400">{{ dashboardStats?.lowStockItems || 0 }}</dd>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-200 hover:shadow-md">
        <div class="px-3 py-4 lg:px-4 lg:py-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <svg class="h-5 w-5 lg:h-6 lg:w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div class="mr-3 lg:mr-4">
              <dt class="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">الحركات اليوم</dt>
              <dd class="mt-1 text-lg lg:text-2xl font-semibold text-gray-900 dark:text-white">{{ dashboardStats?.recentTransactions || 0 }}</dd>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
      <!-- View Full Inventory -->
      <router-link 
        to="/inventory" 
        class="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg p-5 lg:p-6 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 transform"
      >
        <div class="flex items-center">
          <div class="h-12 w-12 lg:h-14 lg:w-14 rounded-lg bg-white/20 flex items-center justify-center">
            <svg class="h-6 w-6 lg:h-7 lg:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <div class="mr-4">
            <h3 class="text-lg lg:text-xl font-bold">المخزون الكامل</h3>
            <p class="text-blue-100 text-sm lg:text-base mt-1">عرض جميع الأصناف مع تفاصيل كاملة</p>
          </div>
          <svg class="h-5 w-5 lg:h-6 lg:w-6 mr-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </router-link>

      <!-- View Reports -->
      <router-link 
        to="/reports" 
        class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-5 lg:p-6 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 transform"
      >
        <div class="flex items-center">
          <div class="h-12 w-12 lg:h-14 lg:w-14 rounded-lg bg-white/20 flex items-center justify-center">
            <svg class="h-6 w-6 lg:h-7 lg:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div class="mr-4">
            <h3 class="text-lg lg:text-xl font-bold">التقارير والإحصائيات</h3>
            <p class="text-purple-100 text-sm lg:text-base mt-1">تحليل كامل للأداء والحركات</p>
          </div>
          <svg class="h-5 w-5 lg:h-6 lg:w-6 mr-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </router-link>

      <!-- Quick Add Item -->
      <router-link 
        v-if="canModifyItems"
        to="/inventory/add" 
        class="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg p-5 lg:p-6 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 transform"
      >
        <div class="flex items-center">
          <div class="h-12 w-12 lg:h-14 lg:w-14 rounded-lg bg-white/20 flex items-center justify-center">
            <svg class="h-6 w-6 lg:h-7 lg:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
          </div>
          <div class="mr-4">
            <h3 class="text-lg lg:text-xl font-bold">إضافة صنف جديد</h3>
            <p class="text-green-100 text-sm lg:text-base mt-1">إضافة صنف جديد إلى المخزون</p>
          </div>
          <svg class="h-5 w-5 lg:h-6 lg:w-6 mr-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </router-link>
    </div>

    <!-- Recent Inventory Preview -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 lg:mb-6">
        <div>
          <h2 class="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">آخر الأصناف المضافة</h2>
          <p class="text-xs lg:text-sm text-gray-500 dark:text-gray-400">أحدث 5 أصناف تمت إضافتها للمخزون</p>
        </div>
        
        <router-link 
          to="/inventory"
          class="inline-flex items-center text-sm lg:text-base font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors duration-200"
        >
          عرض الكل
          <svg class="h-4 w-4 lg:h-5 lg:w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">جاري تحميل البيانات...</p>
      </div>

      <!-- Inventory Preview Table -->
      <div v-else-if="recentInventory.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الصنف</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الكود</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">المخزن</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الكمية</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الحالة</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="item in recentInventory" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
              <td class="px-4 py-3">
                <div class="flex items-center">
                  <div v-if="item.photo_url" class="h-8 w-8 lg:h-10 lg:w-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex-shrink-0 ml-3">
                    <img :src="item.photo_url" :alt="item.name" class="h-full w-full object-cover">
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.name || 'غير محدد' }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.color || '-' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                  {{ item.code || '-' }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ getWarehouseLabel(item.warehouse_id) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span :class="getQuantityClass(item.remaining_quantity)" class="font-bold">
                  {{ formatNumber(item.remaining_quantity || 0) }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span :class="getStatusClass(item.remaining_quantity)" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium">
                  {{ getStatusText(item.remaining_quantity) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8 lg:py-12">
        <svg class="mx-auto h-10 w-10 lg:h-12 lg:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">لا توجد بيانات</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">لم يتم إضافة أي أصناف بعد.</p>
      </div>
    </div>

    <!-- Recent Transactions Preview -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 lg:mb-6">
        <div>
          <h2 class="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">آخر الحركات</h2>
          <p class="text-xs lg:text-sm text-gray-500 dark:text-gray-400">أحدث 5 حركات في النظام</p>
        </div>
        
        <router-link 
          to="/reports"
          class="inline-flex items-center text-sm lg:text-base font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors duration-200"
        >
          عرض الكل
          <svg class="h-4 w-4 lg:h-5 lg:w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </router-link>
      </div>

      <!-- Recent Transactions List -->
      <div v-if="recentTransactions.length > 0" class="space-y-3">
        <div 
          v-for="transaction in recentTransactions.slice(0, 5)" 
          :key="transaction.id"
          class="flex items-center p-3 lg:p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
        >
          <div :class="[
            'h-10 w-10 lg:h-12 lg:w-12 rounded-lg flex items-center justify-center flex-shrink-0 ml-3',
            transaction.type === 'ADD' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300' :
            transaction.type === 'TRANSFER' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300' :
            'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300'
          ]">
            <svg class="h-5 w-5 lg:h-6 lg:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="transaction.type === 'ADD'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              <path v-if="transaction.type === 'TRANSFER'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              <path v-if="transaction.type === 'DISPATCH'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <p class="text-sm lg:text-base font-medium text-gray-900 dark:text-white truncate">
                {{ transaction.item_name || 'غير معروف' }}
              </p>
              <span class="text-sm lg:text-base font-bold" 
                    :class="transaction.type === 'ADD' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'">
                {{ transaction.type === 'ADD' ? '+' : '' }}{{ formatNumber(transaction.total_delta || 0) }}
              </span>
            </div>
            <div class="flex items-center text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-1">
              <span class="truncate">
                {{ formatTime(transaction.timestamp) }}
              </span>
              <span class="mx-2">•</span>
              <span class="truncate">
                {{ getTransactionTypeLabel(transaction.type) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty Transactions State -->
      <div v-else class="text-center py-8">
        <svg class="mx-auto h-10 w-10 lg:h-12 lg:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">لا توجد حركات</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">لم تتم أي حركات اليوم.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Dashboard',
  setup() {
    const store = useStore();
    const router = useRouter();
    
    const loading = ref(true);

    // Computed properties
    const userRole = computed(() => store.getters.userRole || '');
    const dashboardStats = computed(() => store.getters.dashboardStats || {});
    const inventory = computed(() => store.state.inventory || []);
    const transactions = computed(() => store.state.transactions || []);
    const recentStoreTransactions = computed(() => store.state.recentTransactions || []);
    
    // Permission check
    const canModifyItems = computed(() => {
      const role = userRole.value;
      const userProfile = store.state.userProfile || {};
      
      if (role === 'superadmin') return true;
      
      if (role === 'warehouse_manager') {
        const allowedWarehouses = userProfile?.allowed_warehouses || [];
        const hasWarehouses = allowedWarehouses.length > 0;
        const hasPermission = userProfile?.permissions?.includes('full_access') || 
                              userProfile?.permissions?.includes('manage_inventory') ||
                              userProfile?.permissions?.includes('add_items');
        return hasWarehouses && hasPermission;
      }
      
      return false;
    });

    // Recent inventory (last 5 items sorted by date)
    const recentInventory = computed(() => {
      return [...inventory.value]
        .sort((a, b) => {
          const dateA = new Date(a.updated_at || a.created_at || 0);
          const dateB = new Date(b.updated_at || b.created_at || 0);
          return dateB - dateA;
        })
        .slice(0, 5);
    });

    // Recent transactions
    const recentTransactions = computed(() => {
      return [...recentStoreTransactions.value]
        .sort((a, b) => {
          try {
            const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
            const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
            return dateB - dateA;
          } catch (error) {
            return 0;
          }
        })
        .slice(0, 5);
    });

    // Helper functions
    const formatNumber = (num) => {
      if (isNaN(num) || num === null || num === undefined) return '0';
      return new Intl.NumberFormat('ar-EG').format(num);
    };

    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        
        if (diffMins < 60) {
          return `منذ ${diffMins} دقيقة`;
        } else if (diffHours < 24) {
          return `منذ ${diffHours} ساعة`;
        } else {
          return date.toLocaleDateString('ar-EG');
        }
      } catch (error) {
        return '';
      }
    };

    const getWarehouseLabel = (warehouseId) => {
      if (!warehouseId) return '';
      return store.getters.getWarehouseLabel(warehouseId) || warehouseId;
    };

    const getTransactionTypeLabel = (type) => {
      const labels = {
        'ADD': 'إضافة',
        'TRANSFER': 'نقل',
        'DISPATCH': 'صرف',
        'UPDATE': 'تحديث',
        'DELETE': 'حذف'
      };
      return labels[type] || type;
    };

    const getQuantityClass = (quantity) => {
      if (!quantity || quantity === 0) return 'text-red-600 dark:text-red-400';
      if (quantity < 10) return 'text-orange-600 dark:text-orange-400';
      return 'text-green-600 dark:text-green-400';
    };

    const getStatusClass = (quantity) => {
      if (!quantity || quantity === 0) return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      if (quantity < 5) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
    };

    const getStatusText = (quantity) => {
      if (!quantity || quantity === 0) return 'منتهي';
      if (quantity < 5) return 'حرج';
      return 'جيد';
    };

    onMounted(() => {
      console.log('Dashboard mounted');
      
      // ⚠️ CRITICAL FIX: DO NOT subscribe to anything here!
      // The store already has listeners from auth initialization
      
      // Just check if we have data
      if (inventory.value.length === 0 || recentStoreTransactions.value.length === 0) {
        console.log('Waiting for store data...');
        
        // Load recent transactions (one-time query, not listener)
        store.dispatch('getRecentTransactions');
        
        // Wait for data to load
        setTimeout(() => {
          loading.value = false;
        }, 1500);
      } else {
        loading.value = false;
      }
    });

    return {
      // State
      loading,
      
      // Computed
      userRole,
      dashboardStats,
      canModifyItems,
      recentInventory,
      recentTransactions,
      
      // Helper methods
      formatNumber,
      formatTime,
      getWarehouseLabel,
      getTransactionTypeLabel,
      getQuantityClass,
      getStatusClass,
      getStatusText
    };
  }
};
</script>

<style scoped>
/* Custom scrollbar for dark mode */
.dark ::-webkit-scrollbar {
  width: 10px;
}

.dark ::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 5px;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Smooth transitions */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Loading spinner */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Hover effects for cards */
.hover-lift:hover {
  transform: translateY(-2px);
}

/* Gradient border for cards */
.gradient-border {
  position: relative;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(135deg, #f59e0b, #f97316) border-box;
  border: 2px solid transparent;
}

.dark .gradient-border {
  background: linear-gradient(#1f2937, #1f2937) padding-box,
              linear-gradient(135deg, #f59e0b, #f97316) border-box;
}
</style>
