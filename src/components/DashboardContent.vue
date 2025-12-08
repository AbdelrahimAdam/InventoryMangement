<template>
  <div class="space-y-6">
    <!-- Welcome Card -->
    <div class="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-lg">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-2">مرحباً بك، أحمد 👋</h1>
          <p class="text-primary-100">إدارة المخزون أصبحت أسهل مع نظامنا الذكي</p>
        </div>
        <div class="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="h-12 w-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center ml-3">
            <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
          </div>
          <div class="text-right flex-1">
            <p class="text-sm text-gray-500 dark:text-gray-400">إجمالي الأصناف</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">1,250</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center ml-3">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <div class="text-right flex-1">
            <p class="text-sm text-gray-500 dark:text-gray-400">الحركات اليوم</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">42</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center ml-3">
            <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <div class="text-right flex-1">
            <p class="text-sm text-gray-500 dark:text-gray-400">منخفضة المخزون</p>
            <p class="text-2xl font-bold text-red-600 dark:text-red-400">18</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center ml-3">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="text-right flex-1">
            <p class="text-sm text-gray-500 dark:text-gray-400">متوفرة</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">95%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">أحدث الحركات</h2>
        <button class="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
          عرض الكل
        </button>
      </div>
      
      <div class="space-y-4">
        <div v-for="item in recentActivities" :key="item.id" class="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
          <div :class="['h-10 w-10 rounded-lg flex items-center justify-center', item.bgColor]">
            <svg class="w-5 h-5" :class="item.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
            </svg>
          </div>
          <div class="flex-1 text-right mr-3">
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ item.title }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ item.description }}</p>
          </div>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ item.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardContent',
  data() {
    return {
      recentActivities: [
        {
          id: 1,
          title: 'إضافة صنف جديد',
          description: 'تم إضافة كمية 50 من المنتج A',
          time: 'قبل 5 دقائق',
          icon: 'M12 4v16m8-8H4',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          iconColor: 'text-green-600 dark:text-green-400'
        },
        {
          id: 2,
          title: 'تعديل كمية',
          description: 'تم تعديل كمية المنتج B إلى 120',
          time: 'قبل 30 دقيقة',
          icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          iconColor: 'text-blue-600 dark:text-blue-400'
        },
        {
          id: 3,
          title: 'صرف إلى عميل',
          description: 'تم صرف 10 وحدات من المنتج C',
          time: 'قبل ساعة',
          icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
          bgColor: 'bg-orange-100 dark:bg-orange-900/30',
          iconColor: 'text-orange-600 dark:text-orange-400'
        }
      ]
    }
  }
}
</script>
