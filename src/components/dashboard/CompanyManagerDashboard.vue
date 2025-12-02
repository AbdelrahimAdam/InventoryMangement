<template>
  <div class="space-y-6">
    <!-- View Only Notice -->
    <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-500 dark:text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="mr-3">
          <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-300">وضع العرض فقط</h3>
          <div class="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
            <p>لديك صلاحية عرض البيانات فقط. يرجى التواصل مع المشرف العام لتعديل الصلاحيات.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Reports and Filters -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">التقارير والبيانات</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">عرض وتحليل بيانات المخزون</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button @click="exportToExcel" 
                  class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg">
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            تصدير Excel
          </button>
          <button @click="exportToCSV" 
                  class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-md hover:shadow-lg">
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            تصدير CSV
          </button>
          <button @click="printReport" 
                  class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-md hover:shadow-lg">
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            طباعة
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">المخزن</label>
          <select v-model="filters.warehouse" 
                  class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200">
            <option value="">جميع المخازن</option>
            <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
              {{ warehouse.name_ar }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">بحث</label>
          <div class="relative">
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input v-model="filters.search" 
                   type="text" 
                   placeholder="ابحث بالاسم، الكود، أو اللون..."
                   class="w-full pr-10 pl-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">حالة المخزون</label>
          <select v-model="filters.stockStatus" 
                  class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200">
            <option value="">الكل</option>
            <option value="low">منخفض (أقل من 10)</option>
            <option value="critical">حرج (أقل من 5)</option>
            <option value="out">نفذ من المخزون</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">النوع/التصنيف</label>
          <select v-model="filters.category" 
                  class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200">
            <option value="">جميع الأنواع</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-lg bg-blue-500 dark:bg-blue-600 flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-blue-800 dark:text-blue-300">إجمالي الأصناف</p>
              <p class="text-xl font-bold text-blue-900 dark:text-blue-200">{{ stats.totalItems }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-lg bg-green-500 dark:bg-green-600 flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-green-800 dark:text-green-300">إجمالي الكمية</p>
              <p class="text-xl font-bold text-green-900 dark:text-green-200">{{ formatNumber(stats.totalQuantity) }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-lg bg-orange-500 dark:bg-orange-600 flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-orange-800 dark:text-orange-300">أصناف منخفضة</p>
              <p class="text-xl font-bold text-orange-900 dark:text-orange-200">{{ stats.lowStockItems }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-lg bg-red-500 dark:bg-red-600 flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-red-800 dark:text-red-300">نفذ من المخزون</p>
              <p class="text-xl font-bold text-red-900 dark:text-red-200">{{ stats.outOfStockItems }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Info -->
      <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center md:text-right">
            <p class="text-sm text-gray-600 dark:text-gray-400">قيمة المخزون التقريبية</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ formatCurrency(stats.estimatedValue) }}</p>
          </div>
          <div class="text-center md:text-right">
            <p class="text-sm text-gray-600 dark:text-gray-400">متوسط الكمية لكل صنف</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ formatNumber(stats.averageQuantity) }}</p>
          </div>
          <div class="text-center md:text-right">
            <p class="text-sm text-gray-600 dark:text-gray-400">أصناف تم تحديثها مؤخراً</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ stats.recentlyUpdated }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center mb-4">
        <h4 class="text-lg font-medium text-gray-900 dark:text-white">قائمة المخزون</h4>
        <span class="text-sm text-gray-600 dark:text-gray-400">
          عرض {{ filteredInventory.length }} من {{ inventory.length }} صنف
        </span>
      </div>
      
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">جاري تحميل البيانات...</p>
      </div>
      
      <div v-else-if="filteredInventory.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">لا توجد بيانات</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">لم يتم العثور على أصناف تطابق معايير البحث.</p>
      </div>
      
      <InventoryTable 
        v-else
        :items="filteredInventory" 
        :readonly="true" 
        :show-actions="false"
        :user-role="'company_manager'"
      />
    </div>

    <!-- Warehouse Distribution Chart -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">توزيع المخزون بين المخازن</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="warehouse in warehouseDistribution" :key="warehouse.id" 
             class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <span class="font-medium text-gray-900 dark:text-white">{{ warehouse.name }}</span>
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ warehouse.percentage }}%</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div class="bg-yellow-500 h-2 rounded-full" :style="{ width: warehouse.percentage + '%' }"></div>
          </div>
          <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
            <span>{{ warehouse.itemsCount }} صنف</span>
            <span>{{ formatNumber(warehouse.totalQuantity) }} وحدة</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import InventoryTable from '@/components/inventory/InventoryTable.vue';
import { ExportUtils } from '@/utils/exportUtils';

export default {
  name: 'CompanyManagerDashboard',
  components: {
    InventoryTable
  },
  setup() {
    const store = useStore();
    
    const filters = ref({
      warehouse: '',
      search: '',
      stockStatus: '',
      category: ''
    });

    const loading = ref(true);

    // Transform inventory data
    const inventory = computed(() => {
      const rawInventory = store.state.inventory || [];
      return rawInventory.map(item => ({
        id: item.id,
        name: item.name || item.الاسم || 'غير محدد',
        code: item.code || item.الكود || '-',
        color: item.color || item.اللون || '-',
        category: item.category || item.النوع || 'عام',
        warehouse_id: item.warehouse_id || item.المخزن_id,
        supplier: item.supplier || item.المورد || '-',
        item_location: item.item_location || item.مكان_الصنف || '-',
        cartons_count: item.cartons_count || item.كراتين || 0,
        per_carton_count: item.per_carton_count || item.في_الكرتونة || 0,
        single_bottles_count: item.single_bottles_count || item.فردي || 0,
        total_added: item.total_added || item.المضاف || 0,
        remaining_quantity: item.remaining_quantity || item.الكميه_المتبقيه || 0,
        unit_price: item.unit_price || item.سعر_الوحدة || 0,
        updated_at: item.updated_at || item.آخر_تحديث || new Date(),
        created_at: item.created_at || item.تاريخ_الإضافة || new Date()
      }));
    });

    const warehouses = computed(() => store.state.warehouses || []);
    
    const categories = computed(() => {
      const uniqueCategories = new Set();
      inventory.value.forEach(item => {
        if (item.category) uniqueCategories.add(item.category);
      });
      return Array.from(uniqueCategories).sort();
    });

    const filteredInventory = computed(() => {
      let items = inventory.value;

      // Apply warehouse filter
      if (filters.value.warehouse) {
        items = items.filter(item => item.warehouse_id === filters.value.warehouse);
      }

      // Apply search filter
      if (filters.value.search) {
        const searchLower = filters.value.search.toLowerCase();
        items = items.filter(item => 
          item.name?.toLowerCase().includes(searchLower) ||
          item.code?.toLowerCase().includes(searchLower) ||
          item.color?.toLowerCase().includes(searchLower) ||
          item.supplier?.toLowerCase().includes(searchLower)
        );
      }

      // Apply stock status filter
      if (filters.value.stockStatus === 'low') {
        items = items.filter(item => item.remaining_quantity < 10 && item.remaining_quantity > 0);
      } else if (filters.value.stockStatus === 'critical') {
        items = items.filter(item => item.remaining_quantity < 5 && item.remaining_quantity > 0);
      } else if (filters.value.stockStatus === 'out') {
        items = items.filter(item => item.remaining_quantity === 0);
      }

      // Apply category filter
      if (filters.value.category) {
        items = items.filter(item => item.category === filters.value.category);
      }

      return items;
    });

    // Statistics
    const stats = computed(() => {
      const items = filteredInventory.value;
      const totalItems = items.length;
      const totalQuantity = items.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0);
      const lowStockItems = items.filter(item => item.remaining_quantity < 10 && item.remaining_quantity > 0).length;
      const outOfStockItems = items.filter(item => item.remaining_quantity === 0).length;
      const averageQuantity = totalItems > 0 ? Math.round(totalQuantity / totalItems) : 0;
      const estimatedValue = items.reduce((sum, item) => {
        const price = item.unit_price || 0;
        return sum + (price * (item.remaining_quantity || 0));
      }, 0);
      
      // Count recently updated items (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentlyUpdated = items.filter(item => {
        const updatedDate = new Date(item.updated_at);
        return updatedDate >= weekAgo;
      }).length;

      return {
        totalItems,
        totalQuantity,
        lowStockItems,
        outOfStockItems,
        averageQuantity,
        estimatedValue,
        recentlyUpdated
      };
    });

    // Warehouse distribution
    const warehouseDistribution = computed(() => {
      const distribution = {};
      
      inventory.value.forEach(item => {
        const warehouseId = item.warehouse_id;
        if (!distribution[warehouseId]) {
          const warehouse = warehouses.value.find(w => w.id === warehouseId);
          distribution[warehouseId] = {
            id: warehouseId,
            name: warehouse ? warehouse.name_ar : `مخزن ${warehouseId}`,
            itemsCount: 0,
            totalQuantity: 0
          };
        }
        distribution[warehouseId].itemsCount++;
        distribution[warehouseId].totalQuantity += item.remaining_quantity || 0;
      });

      const totalItems = inventory.value.length;
      const totalQuantity = inventory.value.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0);

      return Object.values(distribution).map(warehouse => ({
        ...warehouse,
        percentage: totalItems > 0 ? Math.round((warehouse.itemsCount / totalItems) * 100) : 0,
        quantityPercentage: totalQuantity > 0 ? Math.round((warehouse.totalQuantity / totalQuantity) * 100) : 0
      })).sort((a, b) => b.itemsCount - a.itemsCount);
    });

    watch(filters, () => {
      // Handle filter changes
    }, { deep: true });

    // Formatting functions
    const formatNumber = (num) => {
      return new Intl.NumberFormat('ar-EG').format(num);
    };

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };

    // Export functions
    const exportToExcel = () => {
      const data = ExportUtils.formatInventoryForExport(filteredInventory.value);
      ExportUtils.exportToExcel(data, `inventory-report-${new Date().toISOString().split('T')[0]}`);
    };

    const exportToCSV = () => {
      const data = ExportUtils.formatInventoryForExport(filteredInventory.value);
      ExportUtils.exportToCSV(data, `inventory-report-${new Date().toISOString().split('T')[0]}`);
    };

    const printReport = () => {
      window.print();
    };

    onMounted(() => {
      // Load data if not already loaded
      if (!store.state.inventory || store.state.inventory.length === 0) {
        store.dispatch('loadInventory').finally(() => {
          loading.value = false;
        });
      } else {
        loading.value = false;
      }
    });

    return {
      filters,
      warehouses,
      categories,
      inventory,
      filteredInventory,
      loading,
      stats,
      warehouseDistribution,
      formatNumber,
      formatCurrency,
      exportToExcel,
      exportToCSV,
      printReport
    };
  }
};
</script>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
  
  body {
    background: white !important;
  }
  
  .bg-white, .bg-gray-50, .bg-gradient-to-r {
    background: white !important;
    border: 1px solid #e5e7eb !important;
  }
  
  .dark\:bg-gray-800, .dark\:bg-gray-900 {
    background: white !important;
  }
  
  .text-white, .dark\:text-white {
    color: black !important;
  }
  
  .text-gray-900, .dark\:text-gray-900 {
    color: black !important;
  }
  
  .text-gray-700, .dark\:text-gray-700 {
    color: #4b5563 !important;
  }
  
  .text-gray-500, .dark\:text-gray-500 {
    color: #6b7280 !important;
  }
  
  .shadow, .shadow-md, .shadow-lg {
    box-shadow: none !important;
  }
}
</style>