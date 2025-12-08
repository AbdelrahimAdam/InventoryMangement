<template>
  <div class="h-full flex flex-col">
    <!-- Header with Actions -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">الأصناف والمخزون</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">إدارة وتتبع جميع الأصناف في المخزون</p>
      </div>
      <div class="flex items-center space-x-3 space-x-reverse">
        <button class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
          تصدير البيانات
        </button>
        <button class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          فلترة
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
          <div class="relative">
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input
              type="search"
              placeholder="ابحث عن صنف بالاسم أو الرمز..."
              class="w-full pr-10 pl-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        <select class="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">جميع الفئات</option>
          <option value="electronics">إلكترونيات</option>
          <option value="tools">أدوات</option>
          <option value="materials">مواد أولية</option>
        </select>
        <select class="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">جميع المخازن</option>
          <option value="main">المخزن الرئيسي</option>
          <option value="branch1">الفرع الأول</option>
        </select>
      </div>
    </div>

    <!-- Items List -->
    <div class="flex-1 overflow-y-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-for="item in inventoryItems" :key="item.id" 
             class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
             @click="viewItemDetails(item)">
          <div class="p-4">
            <!-- Item Header -->
            <div class="flex items-start justify-between mb-3">
              <div>
                <span :class="['px-2 py-1 text-xs font-medium rounded-full', item.stockStatus === 'low' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400']">
                  {{ item.stockStatus === 'low' ? 'منخفض' : 'متوفر' }}
                </span>
              </div>
              <button class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                </svg>
              </button>
            </div>
            
            <!-- Item Details -->
            <div class="space-y-2">
              <div class="flex items-center space-x-2 space-x-reverse">
                <div class="h-10 w-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                  </svg>
                </div>
                <div class="flex-1 text-right">
                  <h3 class="font-bold text-gray-900 dark:text-white truncate">{{ item.name }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.code }}</p>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div class="text-right">
                  <p class="text-gray-500 dark:text-gray-400">الكمية</p>
                  <p class="font-bold text-gray-900 dark:text-white">{{ item.quantity }}</p>
                </div>
                <div class="text-right">
                  <p class="text-gray-500 dark:text-gray-400">السعر</p>
                  <p class="font-bold text-gray-900 dark:text-white">{{ item.price }} ر.س</p>
                </div>
              </div>
              
              <!-- Stock Bar -->
              <div class="pt-2">
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="text-gray-500 dark:text-gray-400">المخزون</span>
                  <span class="font-medium">{{ item.stockPercentage }}%</span>
                </div>
                <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div :class="['h-full rounded-full', item.stockStatus === 'low' ? 'bg-red-500' : 'bg-green-500']" 
                       :style="{ width: item.stockPercentage + '%' }"></div>
                </div>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex space-x-2 space-x-reverse">
              <button class="flex-1 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">
                تعديل
              </button>
              <button class="flex-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                حركة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InventoryContent',
  data() {
    return {
      inventoryItems: [
        {
          id: 1,
          name: 'لابتوب ديل XPS 13',
          code: 'IT-001',
          quantity: 15,
          price: '4,200',
          stockStatus: 'low',
          stockPercentage: 30
        },
        {
          id: 2,
          name: 'هاتف آيفون 14 برو',
          code: 'MB-001',
          quantity: 42,
          price: '5,800',
          stockStatus: 'good',
          stockPercentage: 85
        },
        {
          id: 3,
          name: 'شاشة سامسونج 32 بوصة',
          code: 'MN-001',
          quantity: 8,
          price: '1,200',
          stockStatus: 'low',
          stockPercentage: 20
        },
        {
          id: 4,
          name: 'طابعة ليزر HP',
          code: 'PR-001',
          quantity: 25,
          price: '900',
          stockStatus: 'good',
          stockPercentage: 70
        },
        {
          id: 5,
          name: 'كاميرا كانون EOS R5',
          code: 'CM-001',
          quantity: 12,
          price: '12,500',
          stockStatus: 'good',
          stockPercentage: 60
        },
        {
          id: 6,
          name: 'مايكروفون Blue Yeti',
          code: 'AU-001',
          quantity: 5,
          price: '1,800',
          stockStatus: 'low',
          stockPercentage: 15
        },
        {
          id: 7,
          name: 'لوحة مفاتيح ميكانيكية',
          code: 'AC-001',
          quantity: 35,
          price: '450',
          stockStatus: 'good',
          stockPercentage: 90
        },
        {
          id: 8,
          name: 'ماوس لاسلكي Logitech',
          code: 'AC-002',
          quantity: 18,
          price: '280',
          stockStatus: 'good',
          stockPercentage: 65
        }
      ]
    }
  },
  methods: {
    viewItemDetails(item) {
      alert(`عرض تفاصيل: ${item.name}\nالكمية: ${item.quantity}\nالسعر: ${item.price} ر.س`);
    }
  }
}
</script>
