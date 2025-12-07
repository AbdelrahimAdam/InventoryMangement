<template>
  <div class="sky-dashboard">
    <!-- Sky Background with Animated Clouds -->
    <div class="sky-background">
      <div class="clouds-container">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
        <div class="cloud cloud-4"></div>
        <div class="cloud cloud-5"></div>
        <div class="cloud cloud-6"></div>
      </div>
      <div class="sun"></div>
    </div>

    <!-- Stars for night effect -->
    <div class="stars-container">
      <div class="star" v-for="star in stars" :key="star.id" :style="star.style"></div>
    </div>

    <!-- Welcome Banner -->
    <div class="mb-8 relative z-10">
      <div class="sky-banner rounded-2xl shadow-xl p-8 backdrop-blur-xl bg-gradient-to-r from-sky-500/90 to-cyan-500/90 border border-white/20">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div>
            <h2 class="text-3xl font-bold text-white mb-2 drop-shadow-lg">مرحباً، {{ userName }} 👋</h2>
            <p class="text-blue-50 opacity-90">لوحة تحكم نظام إدارة المخزون</p>
            <div class="mt-4 flex flex-wrap items-center gap-4">
              <div class="flex items-center text-blue-50 bg-white/10 px-3 py-1 rounded-lg">
                <svg class="w-5 h-5 ml-1 drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm">النظام يعمل بشكل طبيعي</span>
              </div>
              <div class="flex items-center text-blue-50 bg-white/10 px-3 py-1 rounded-lg">
                <svg class="w-5 h-5 ml-1 drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm">{{ accessibleWarehouses.length }} مخازن نشطة</span>
              </div>
              <div class="flex items-center text-blue-50 bg-white/10 px-3 py-1 rounded-lg">
                <svg class="w-5 h-5 ml-1 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-sm">{{ currentTime }}</span>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap gap-3">
            <button 
              @click="refreshData" 
              :disabled="loading"
              :class="{'opacity-50 cursor-not-allowed': loading}"
              class="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm flex items-center border border-white/30 hover:border-white/40 shadow-lg hover:shadow-xl"
            >
              <svg :class="{'animate-spin': loading}" class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ loading ? 'جاري التحديث...' : 'تحديث البيانات' }}
            </button>
            
            <button 
              v-if="canModifyItems"
              @click="navigateTo('/inventory/add')"
              class="px-6 py-3 bg-emerald-500/90 hover:bg-emerald-600/90 text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm flex items-center border border-emerald-400/50 hover:border-emerald-400/70 shadow-lg hover:shadow-xl"
            >
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              إضافة صنف جديد
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Grid - Sky Themed Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10">
      <!-- Total Items Card -->
      <div class="sky-card morning-sky rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 backdrop-blur-md" 
           @click="navigateTo('/inventory')"
           role="button"
           tabindex="0"
           @keydown.enter="navigateTo('/inventory')"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-gradient-to-br from-sky-500/80 to-blue-600/80 rounded-xl backdrop-blur-sm border border-white/20">
            <svg class="w-6 h-6 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <div class="flex items-center space-x-2 rtl:space-x-reverse">
            <span class="text-sm font-medium text-green-300 drop-shadow">{{ statsPercentage.totalItems > 0 ? '+' : '' }}{{ statsPercentage.totalItems }}%</span>
            <svg v-if="statsPercentage.totalItems > 0" class="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
            </svg>
            <svg v-else class="w-4 h-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
          </div>
        </div>
        <h3 class="text-2xl font-bold text-white mb-2 drop-shadow">{{ formatNumber(dashboardStats.totalItems) }}</h3>
        <p class="text-sky-100 opacity-90">إجمالي الأصناف</p>
        <div class="mt-3 text-xs text-sky-200/70">انقر للعرض التفصيلي</div>
      </div>

      <!-- Total Quantity Card -->
      <div class="sky-card day-sky rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 backdrop-blur-md"
           @click="navigateTo('/inventory?view=quantities')"
           role="button"
           tabindex="0"
           @keydown.enter="navigateTo('/inventory?view=quantities')"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-gradient-to-br from-emerald-500/80 to-green-600/80 rounded-xl backdrop-blur-sm border border-white/20">
            <svg class="w-6 h-6 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="flex items-center space-x-2 rtl:space-x-reverse">
            <span class="text-sm font-medium text-green-300 drop-shadow">{{ statsPercentage.totalQuantity > 0 ? '+' : '' }}{{ statsPercentage.totalQuantity }}%</span>
            <svg v-if="statsPercentage.totalQuantity > 0" class="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
            </svg>
            <svg v-else class="w-4 h-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
          </div>
        </div>
        <h3 class="text-2xl font-bold text-white mb-2 drop-shadow">{{ formatNumber(dashboardStats.totalQuantity) }}</h3>
        <p class="text-emerald-100 opacity-90">إجمالي الكمية</p>
        <div class="mt-3 text-xs text-emerald-200/70">{{ dashboardStats.estimatedValue ? `قيمة تقريبية: ${formatNumber(dashboardStats.estimatedValue)} ج.م` : 'انقر للعرض التفصيلي' }}</div>
      </div>

      <!-- Low Stock Card -->
      <div class="sky-card sunset-sky rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 backdrop-blur-md"
           @click="navigateTo('/inventory?status=low')"
           role="button"
           tabindex="0"
           @keydown.enter="navigateTo('/inventory?status=low')"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-gradient-to-br from-orange-500/80 to-amber-600/80 rounded-xl backdrop-blur-sm border border-white/20">
            <svg class="w-6 h-6 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="flex items-center space-x-2 rtl:space-x-reverse">
            <span class="text-sm font-medium text-orange-300 drop-shadow">{{ statsPercentage.lowStockItems > 0 ? '+' : '' }}{{ statsPercentage.lowStockItems }}%</span>
            <svg v-if="statsPercentage.lowStockItems > 0" class="w-4 h-4 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
            </svg>
            <svg v-else class="w-4 h-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
          </div>
        </div>
        <h3 class="text-2xl font-bold text-white mb-2 drop-shadow">{{ formatNumber(dashboardStats.lowStockItems) }}</h3>
        <p class="text-orange-100 opacity-90">أصناف منخفضة</p>
        <div v-if="dashboardStats.outOfStockItems > 0" class="mt-2 text-xs text-red-300">
          {{ dashboardStats.outOfStockItems }} أصناف نفذت
        </div>
      </div>

      <!-- Recent Activity Card -->
      <div class="sky-card twilight-sky rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 backdrop-blur-md"
           @click="navigateTo('/transactions')"
           role="button"
           tabindex="0"
           @keydown.enter="navigateTo('/transactions')"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-gradient-to-br from-violet-500/80 to-purple-600/80 rounded-xl backdrop-blur-sm border border-white/20">
            <svg class="w-6 h-6 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div class="flex items-center space-x-2 rtl:space-x-reverse">
            <span class="text-sm font-medium text-purple-300 drop-shadow">{{ statsPercentage.recentTransactions > 0 ? '+' : '' }}{{ statsPercentage.recentTransactions }}%</span>
            <svg v-if="statsPercentage.recentTransactions > 0" class="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
            </svg>
            <svg v-else class="w-4 h-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
          </div>
        </div>
        <h3 class="text-2xl font-bold text-white mb-2 drop-shadow">{{ formatNumber(dashboardStats.recentTransactions) }}</h3>
        <p class="text-violet-100 opacity-90">الحركات اليوم</p>
        <div class="mt-3 flex items-center justify-between text-xs">
          <span class="text-emerald-300">{{ dashboardStats.transactionsByType?.add || 0 }} إضافة</span>
          <span class="text-blue-300">{{ dashboardStats.transactionsByType?.transfer || 0 }} نقل</span>
          <span class="text-orange-300">{{ dashboardStats.transactionsByType?.dispatch || 0 }} صرف</span>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
      <!-- Recent Transactions -->
      <div class="cloud-card rounded-2xl shadow-xl p-6 backdrop-blur-md border border-white/20 bg-gradient-to-br from-white/10 to-blue-50/5">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-white drop-shadow">آخر الحركات</h3>
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <div 
              @click="navigateTo('/transactions')"
              class="text-sm text-sky-300 hover:text-sky-200 cursor-pointer hover:underline transition-colors flex items-center"
            >
              عرض الكل
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </div>
            <button 
              @click="refreshRecentTransactions"
              :disabled="recentTransactionsLoading"
              class="text-sm text-sky-300 hover:text-sky-200 transition-colors"
            >
              <svg :class="{'animate-spin': recentTransactionsLoading}" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="space-y-4">
          <div v-if="recentTransactionsLoading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400 mx-auto"></div>
            <p class="mt-2 text-sm text-sky-200 opacity-80">جاري تحميل الحركات...</p>
          </div>
          
          <div v-else-if="recentTransactions.length === 0" class="text-center py-8">
            <svg class="h-12 w-12 text-sky-300/50 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <p class="mt-2 text-sm text-sky-200 opacity-80">لا توجد حركات حديثة</p>
            <button 
              @click="navigateTo('/transactions')"
              class="mt-4 px-4 py-2 text-sm bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 rounded-lg transition-colors"
            >
              عرض جميع الحركات
            </button>
          </div>
          
          <div v-else class="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            <div 
              v-for="transaction in recentTransactions.slice(0, 8)" 
              :key="transaction.id" 
              class="flex items-center p-4 hover:bg-white/10 rounded-xl transition-all duration-300 cursor-pointer group backdrop-blur-sm border border-white/5 hover:border-white/20"
              @click="viewTransaction(transaction)"
            >
              <div :class="getTransactionColor(transaction.type)" class="h-12 w-12 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform">
                <svg class="h-6 w-6 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="transaction.type === 'add'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  <path v-else-if="transaction.type === 'transfer'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                  <path v-else-if="transaction.type === 'dispatch'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-white group-hover:text-sky-200 transition-colors truncate">
                  {{ getTransactionLabel(transaction.type) }}
                </h4>
                <p class="text-sm text-sky-200/80 truncate">
                  {{ formatDateTime(transaction.timestamp) }}
                </p>
                <p v-if="transaction.notes" class="text-xs text-sky-200/60 truncate">
                  {{ transaction.notes }}
                </p>
              </div>
              <div class="text-right ml-4">
                <p class="font-medium text-white group-hover:text-sky-200 transition-colors">
                  {{ transaction.quantity || 0 }} وحدة
                </p>
                <p class="text-sm text-sky-200/80 truncate max-w-[100px]">
                  {{ transaction.item_code || transaction.item_id || 'N/A' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Warehouse Distribution -->
      <div class="cloud-card rounded-2xl shadow-xl p-6 backdrop-blur-md border border-white/20 bg-gradient-to-br from-white/10 to-blue-50/5">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-white drop-shadow">توزيع المخزون</h3>
          <div 
            @click="navigateTo('/warehouses')"
            class="text-sm text-sky-300 hover:text-sky-200 cursor-pointer hover:underline transition-colors flex items-center"
          >
            إدارة المخازن
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </div>
        </div>
        
        <div class="space-y-4">
          <div v-if="warehouseStats.length === 0" class="text-center py-8">
            <svg class="h-12 w-12 text-sky-300/50 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            <p class="mt-2 text-sm text-sky-200 opacity-80">لا توجد مخازن متاحة</p>
          </div>
          
          <div v-else>
            <div 
              v-for="warehouse in warehouseStats.slice(0, 5)" 
              :key="warehouse.id" 
              class="space-y-2 cursor-pointer hover:bg-white/10 p-4 rounded-xl transition-all duration-300 group backdrop-blur-sm border border-white/5 hover:border-white/20"
              @click="navigateToWarehouse(warehouse.id)"
            >
              <div class="flex justify-between items-center">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2 rtl:space-x-reverse">
                    <span class="font-medium text-white group-hover:text-sky-200 transition-colors truncate">
                      {{ warehouse.name }}
                    </span>
                    <span v-if="warehouse.is_main" class="text-xs bg-emerald-500/20 text-emrade text-emerald-300 px-2 py-0.5 rounded">
                      رئيسي
                    </span>
                    <span v-if="warehouse.type === 'dispatch'" class="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded">
                      صرف
                    </span>
                  </div>
                  <p v-if="warehouse.location" class="text-xs text-sky-200/60 truncate mt-1">
                    {{ warehouse.location }}
                  </p>
                </div>
                <span class="text-sky-200/80 text-sm whitespace-nowrap ml-4">{{ warehouse.items }} أصناف</span>
              </div>
              
              <div class="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
                <div class="h-2 rounded-full transition-all duration-500 group-hover:h-3" :style="{ 
                  width: warehouse.percentage + '%', 
                  background: `linear-gradient(to right, ${warehouse.color}80, ${warehouse.color})`,
                  boxShadow: `0 0 20px ${warehouse.color}40`
                }"></div>
              </div>
              
              <div class="flex justify-between text-xs">
                <span class="text-sky-200/80">{{ formatNumber(warehouse.quantity) }} وحدة</span>
                <span class="text-white font-medium">{{ warehouse.percentage }}%</span>
              </div>
            </div>
            
            <div v-if="warehouseStats.length > 5" class="text-center pt-4">
              <button 
                @click="navigateTo('/warehouses')"
                class="text-sm text-sky-300 hover:text-sky-200 transition-colors"
              >
                عرض {{ warehouseStats.length - 5 }} مخزن إضافي
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-8">
      <h3 class="text-lg font-bold text-white mb-6 drop-shadow relative z-10">الإجراءات السريعة</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <!-- Add Item Button -->
        <button 
          v-if="canModifyItems" 
          @click="navigateTo('/inventory/add')"
          class="sky-action-btn morning-action text-white font-medium py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 flex items-center justify-center cursor-pointer backdrop-blur-md border border-white/20 hover:-translate-y-1"
          :disabled="!canModifyItems"
        >
          <svg class="h-6 w-6 ml-2 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <div class="text-right">
            <div class="font-bold">إضافة صنف</div>
            <div class="text-sm opacity-80">إضافة صنف جديد للمخزون</div>
          </div>
        </button>

        <!-- Reports Button -->
        <button 
          @click="navigateTo('/reports')"
          v-if="canViewReports"
          class="sky-action-btn day-action text-white font-medium py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 flex items-center justify-center cursor-pointer backdrop-blur-md border border-white/20 hover:-translate-y-1"
          :disabled="!canViewReports"
        >
          <svg class="h-6 w-6 ml-2 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <div class="text-right">
            <div class="font-bold">التقارير</div>
            <div class="text-sm opacity-80">تقارير المخزون والإحصائيات</div>
          </div>
        </button>

        <!-- Transfer Button -->
        <button 
          @click="navigateTo('/transfers')"
          v-if="canModifyItems"
          class="sky-action-btn twilight-action text-white font-medium py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 flex items-center justify-center cursor-pointer backdrop-blur-md border border-white/20 hover:-translate-y-1"
          :disabled="!canModifyItems"
        >
          <svg class="h-6 w-6 ml-2 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
          </svg>
          <div class="text-right">
            <div class="font-bold">نقل المخزون</div>
            <div class="text-sm opacity-80">نقل الأصناف بين المخازن</div>
          </div>
        </button>

        <!-- Dispatch Button -->
        <button 
          @click="navigateTo('/dispatch')"
          v-if="canDispatch"
          class="sky-action-btn sunset-action text-white font-medium py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 flex items-center justify-center cursor-pointer backdrop-blur-md border border-white/20 hover:-translate-y-1"
          :disabled="!canDispatch"
        >
          <svg class="h-6 w-6 ml-2 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m6 4l4-4m0 0l4 4m-4-4v12"/>
          </svg>
          <div class="text-right">
            <div class="font-bold">صرف خارجي</div>
            <div class="text-sm opacity-80">صرف الأصناف للخارج</div>
          </div>
        </button>
      </div>
    </div>

    <!-- Additional Actions -->
    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
      <button 
        @click="navigateTo('/inventory')"
        class="cloud-action-btn text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-md border border-white/20 hover:-translate-y-0.5"
      >
        <svg class="h-5 w-5 ml-2 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
        </svg>
        <div class="text-right">
          <div>عرض المخزون</div>
        </div>
      </button>

      <button 
        @click="navigateTo('/users')"
        v-if="canManageUsers"
        class="cloud-action-btn text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-md border border-white/20 hover:-translate-y-0.5"
        :disabled="!canManageUsers"
      >
        <svg class="h-5 w-5 ml-2 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-6.197a6 6 0 00-9-5.197M9 10h.01"/>
        </svg>
        <div class="text-right">
          <div>إدارة المستخدمين</div>
        </div>
      </button>

      <button 
        @click="navigateTo('/warehouses')"
        v-if="canManageUsers"
        class="cloud-action-btn text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-md border border-white/20 hover:-translate-y-0.5"
        :disabled="!canManageUsers"
      >
        <svg class="h-5 w-5 ml-2 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
        <div class="text-right">
          <div>إدارة المخازن</div>
        </div>
      </button>

      <button 
        @click="navigateTo('/profile')"
        class="cloud-action-btn text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-md border border-white/20 hover:-translate-y-0.5"
      >
        <svg class="h-5 w-5 ml-2 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
        <div class="text-right">
          <div>الملف الشخصي</div>
        </div>
      </button>
    </div>

    <!-- Navigation Error Toast -->
    <div v-if="navigationError" class="fixed bottom-4 right-4 left-4 md:right-auto md:left-1/2 md:-translate-x-1/2 md:w-96 z-50 animate-slide-down">
      <div class="bg-gradient-to-r from-red-500/90 to-pink-500/90 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between backdrop-blur-md border border-white/20">
        <div class="flex items-center">
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="flex-1">{{ navigationError }}</span>
        </div>
        <button @click="navigationError = ''" class="ml-4 hover:text-red-100 transition-colors">
          <svg class="h-5 w-5 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkyDashboard',
  
  data() {
    return {
      navigationError: '',
      currentTime: '',
      timeInterval: null,
      stars: []
    };
  },
  
  computed: {
    // Store getters
    loading() {
      return this.$store.state.loading;
    },
    
    recentTransactionsLoading() {
      return this.$store.state.recentTransactionsLoading;
    },
    
    userRole() {
      return this.$store.getters.userRole;
    },
    
    userName() {
      return this.$store.getters.userName || 'مستخدم';
    },
    
    dashboardStats() {
      return this.$store.getters.dashboardStats || {
        totalItems: 0,
        totalQuantity: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        estimatedValue: 0,
        recentTransactions: 0,
        transactionsByType: {
          add: 0,
          transfer: 0,
          dispatch: 0
        }
      };
    },
    
    recentTransactions() {
      return this.$store.state.recentTransactions || [];
    },
    
    accessibleWarehouses() {
      return this.$store.getters.accessibleWarehouses || [];
    },
    
    inventory() {
      return this.$store.state.inventory || [];
    },
    
    canModifyItems() {
      return this.$store.getters.canEdit || false;
    },
    
    canDispatch() {
      return this.$store.getters.canDispatch || false;
    },
    
    canManageUsers() {
      return this.$store.getters.canManageUsers || false;
    },
    
    canViewReports() {
      return this.$store.getters.userRole === 'superadmin' || 
             this.$store.getters.userRole === 'company_manager';
    },
    
    // Warehouse stats with store data
    warehouseStats() {
      const warehouses = this.accessibleWarehouses.slice(0, 6);
      const colors = ['#fbbf24', '#60a5fa', '#34d399', '#a78bfa', '#ec4899', '#8b5cf6'];
      
      return warehouses.map((warehouse, index) => {
        const warehouseItems = this.inventory.filter(item => item.warehouse_id === warehouse.id);
        const totalItems = this.inventory.length;
        const totalQuantity = warehouseItems.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0);
        
        return {
          id: warehouse.id,
          name: warehouse.name_ar || warehouse.name || `مخزن ${index + 1}`,
          location: warehouse.location,
          type: warehouse.type,
          is_main: warehouse.is_main,
          items: warehouseItems.length,
          quantity: totalQuantity,
          percentage: totalItems > 0 ? Math.round((warehouseItems.length / totalItems) * 100) : 0,
          color: colors[index] || '#94a3b8'
        };
      }).sort((a, b) => b.percentage - a.percentage);
    },
    
    // Stats percentage changes (simulated)
    statsPercentage() {
      return {
        totalItems: 12,
        totalQuantity: 8,
        lowStockItems: 3,
        recentTransactions: 15
      };
    }
  },
  
  created() {
    this.createStars();
    this.updateCurrentTime();
    this.timeInterval = setInterval(this.updateCurrentTime, 60000); // Update every minute
  },
  
  mounted() {
    console.log('SkyDashboard mounted');
    this.refreshData();
  },
  
  beforeUnmount() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  },
  
  methods: {
    createStars() {
      const starsArray = [];
      for (let i = 0; i < 30; i++) {
        starsArray.push({
          id: i,
          style: {
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            animationDelay: `${Math.random() * 5}s`
          }
        });
      }
      this.stars = starsArray;
    },
    
    updateCurrentTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    },
    
    async refreshData() {
      try {
        await this.$store.dispatch('getRecentTransactions');
        this.showSuccess('تم تحديث البيانات بنجاح');
      } catch (error) {
        console.error('Error refreshing data:', error);
        this.showError('حدث خطأ في تحديث البيانات');
      }
    },
    
    async refreshRecentTransactions() {
      try {
        await this.$store.dispatch('getRecentTransactions');
        this.showSuccess('تم تحديث الحركات بنجاح');
      } catch (error) {
        console.error('Error refreshing recent transactions:', error);
        this.showError('حدث خطأ في تحديث الحركات');
      }
    },
    
    async navigateTo(path) {
      try {
        console.log('Navigating to:', path);
        
        // Check if user has permission for the route
        const canAccess = await this.checkRoutePermission(path);
        if (!canAccess) {
          this.navigationError = 'ليس لديك صلاحية للوصول إلى هذه الصفحة';
          setTimeout(() => {
            this.navigationError = '';
          }, 5000);
          return;
        }
        
        // Navigate using Vue Router
        this.$router.push(path);
        
      } catch (error) {
        console.error('Navigation error:', error);
        
        if (error.name !== 'NavigationDuplicated') {
          this.navigationError = 'حدث خطأ في التنقل إلى الصفحة';
          setTimeout(() => {
            this.navigationError = '';
          }, 5000);
        }
      }
    },
    
    async checkRoutePermission(path) {
      try {
        // Resolve the route
        const route = this.$router.resolve(path).route;
        
        // No restrictions
        if (!route.meta?.allowedRoles) {
          return true;
        }
        
        // Check user role
        const userRole = this.$store.getters.userRole;
        if (!userRole) {
          return false;
        }
        
        // Check if role is allowed
        const allowedRoles = route.meta.allowedRoles;
        if (!allowedRoles.includes(userRole)) {
          return false;
        }
        
        // Additional checks for warehouse managers
        if (userRole === 'warehouse_manager') {
          const allowedWarehouses = this.$store.state.userProfile?.allowed_warehouses || [];
          
          // Check warehouse-specific permissions
          if (path.includes('/inventory')) {
            if (allowedWarehouses.length === 0) {
              return false;
            }
          }
          
          // Check if route requires dispatch permission
          if (path.includes('/dispatch')) {
            if (!this.$store.getters.canDispatch) {
              return false;
            }
          }
        }
        
        return true;
        
      } catch (error) {
        console.error('Permission check error:', error);
        return false;
      }
    },
    
    navigateToWarehouse(warehouseId) {
      this.navigateTo(`/inventory?warehouse=${warehouseId}`);
    },
    
    viewTransaction(transaction) {
      this.navigateTo(`/transactions/${transaction.id}`);
    },
    
    formatNumber(num) {
      const number = Number(num) || 0;
      return new Intl.NumberFormat('ar-EG').format(number);
    },
    
    formatDateTime(date) {
      if (!date) return '';
      try {
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleString('ar-EG', {
          dateStyle: 'short',
          timeStyle: 'short'
        });
      } catch (error) {
        return '';
      }
    },
    
    getTransactionColor(type) {
      const colors = {
        add: 'bg-gradient-to-br from-emerald-500/80 to-green-600/80',
        transfer: 'bg-gradient-to-br from-blue-500/80 to-cyan-600/80',
        dispatch: 'bg-gradient-to-br from-orange-500/80 to-amber-600/80',
        receive: 'bg-gradient-to-br from-violet-500/80 to-purple-600/80'
      };
      return colors[type] || 'bg-gradient-to-br from-gray-500/80 to-gray-600/80';
    },
    
    getTransactionLabel(type) {
      const labels = {
        add: 'إضافة صنف',
        transfer: 'نقل بين مخازن',
        dispatch: 'صرف خارجي',
        receive: 'استلام صنف'
      };
      return labels[type] || type;
    },
    
    showSuccess(message) {
      this.$store.dispatch('showNotification', {
        type: 'success',
        message: message
      });
    },
    
    showError(message) {
      this.$store.dispatch('showNotification', {
        type: 'error',
        message: message
      });
    },
    
    showInfo(message) {
      this.$store.dispatch('showNotification', {
        type: 'info',
        message: message
      });
    },
    
    exportReport() {
      this.showInfo('جاري تصدير التقرير...');
      setTimeout(() => {
        this.showSuccess('تم تصدير التقرير بنجاح');
      }, 1500);
    },
    
    printDashboard() {
      window.print();
    }
  }
};
</script>

<style scoped>
.sky-dashboard {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  background: linear-gradient(180deg, #0c3a65 0%, #1e3a8a 25%, #3b82f6 50%, #60a5fa 75%, #93c5fd 100%);
  background-size: 100% 400%;
  animation: skyGradient 30s ease infinite;
  padding: 1rem;
}

.sky-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
}

.clouds-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.cloud {
  position: absolute;
  background: white;
  border-radius: 1000px;
  opacity: 0.7;
  filter: blur(20px);
  animation: floatCloud 60s linear infinite;
}

.cloud-1 {
  width: 300px;
  height: 100px;
  top: 10%;
  left: -300px;
  animation-delay: 0s;
}

.cloud-2 {
  width: 200px;
  height: 80px;
  top: 30%;
  left: -200px;
  animation-delay: 15s;
  animation-duration: 45s;
}

.cloud-3 {
  width: 250px;
  height: 90px;
  top: 50%;
  left: -250px;
  animation-delay: 30s;
  animation-duration: 50s;
}

.cloud-4 {
  width: 180px;
  height: 70px;
  top: 70%;
  left: -180px;
  animation-delay: 45s;
  animation-duration: 55s;
}

.cloud-5 {
  width: 220px;
  height: 85px;
  top: 20%;
  left: -220px;
  animation-delay: 60s;
  animation-duration: 65s;
}

.cloud-6 {
  width: 280px;
  height: 95px;
  top: 40%;
  left: -280px;
  animation-delay: 75s;
  animation-duration: 70s;
}

.sun {
  position: absolute;
  top: 20%;
  right: 10%;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, #ffd700 30%, #ff8c00 100%);
  border-radius: 50%;
  filter: blur(2px);
  box-shadow: 0 0 100px 50px rgba(255, 215, 0, 0.5);
  animation: sunGlow 8s ease-in-out infinite;
}

.stars-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
}

.star {
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: twinkle 4s ease-in-out infinite;
  filter: blur(1px);
}

.sky-banner {
  position: relative;
  overflow: hidden;
}

.sky-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

.sky-card {
  position: relative;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.sky-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: 0.5s;
}

.sky-card:hover::before {
  left: 100%;
}

.morning-sky {
  background: linear-gradient(135deg, rgba(255, 200, 100, 0.2), rgba(100, 180, 255, 0.3));
  box-shadow: 0 20px 40px rgba(100, 180, 255, 0.3);
}

.day-sky {
  background: linear-gradient(135deg, rgba(100, 200, 255, 0.2), rgba(50, 150, 250, 0.3));
  box-shadow: 0 20px 40px rgba(50, 150, 250, 0.3);
}

.sunset-sky {
  background: linear-gradient(135deg, rgba(255, 150, 50, 0.2), rgba(200, 100, 50, 0.3));
  box-shadow: 0 20px 40px rgba(255, 150, 50, 0.3);
}

.twilight-sky {
  background: linear-gradient(135deg, rgba(150, 100, 255, 0.2), rgba(100, 50, 200, 0.3));
  box-shadow: 0 20px 40px rgba(150, 100, 255, 0.3);
}

.cloud-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.cloud-card::after {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: linear-gradient(45deg, 
    rgba(255,255,255,0.1) 0%,
    rgba(255,255,255,0.05) 25%,
    transparent 50%,
    rgba(255,255,255,0.05) 75%,
    rgba(255,255,255,0.1) 100%);
  z-index: -1;
  filter: blur(20px);
  animation: cloudShift 15s ease-in-out infinite;
}

.sky-action-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.sky-action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: 0.5s;
}

.sky-action-btn:hover::before {
  left: 100%;
}

.morning-action {
  background: linear-gradient(135deg, rgba(255, 200, 100, 0.4), rgba(255, 150, 50, 0.6));
}

.day-action {
  background: linear-gradient(135deg, rgba(100, 200, 255, 0.4), rgba(50, 150, 250, 0.6));
}

.sunset-action {
  background: linear-gradient(135deg, rgba(255, 150, 50, 0.4), rgba(255, 100, 50, 0.6));
}

.twilight-action {
  background: linear-gradient(135deg, rgba(150, 100, 255, 0.4), rgba(100, 50, 200, 0.6));
}

.night-action {
  background: linear-gradient(135deg, rgba(50, 50, 150, 0.4), rgba(20, 20, 100, 0.6));
}

.midnight-action {
  background: linear-gradient(135deg, rgba(30, 30, 80, 0.4), rgba(10, 10, 50, 0.6));
}

.cloud-action-btn {
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(200,200,255,0.2));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* Animations */
@keyframes skyGradient {
  0%, 100% { background-position: 0% 0%; }
  25% { background-position: 100% 25%; }
  50% { background-position: 100% 50%; }
  75% { background-position: 0% 75%; }
}

@keyframes floatCloud {
  0% {
    transform: translateX(0) translateY(0);
  }
  50% {
    transform: translateX(100vw) translateY(-20px);
  }
  100% {
    transform: translateX(200vw) translateY(0);
  }
}

@keyframes sunGlow {
  0%, 100% {
    box-shadow: 0 0 100px 50px rgba(255, 215, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 120px 60px rgba(255, 215, 0, 0.7);
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes cloudShift {
  0%, 100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(5px, -5px);
  }
  50% {
    transform: translate(-5px, 5px);
  }
  75% {
    transform: translate(5px, 5px);
  }
}

@keyframes slide-down {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Enhanced blur effects for better performance */
.sky-card,
.cloud-card,
.sky-action-btn,
.cloud-action-btn {
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

/* Accessibility improvements */
.sky-card:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

button:disabled:hover {
  box-shadow: none !important;
}

button:disabled:hover::before {
  left: -100%;
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out;
}

/* Scrollbar styling */
.cloud-card .space-y-4::-webkit-scrollbar {
  width: 6px;
}

.cloud-card .space-y-4::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.cloud-card .space-y-4::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.cloud-card .space-y-4::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

/* Responsive design */
@media (max-width: 768px) {
  .sky-dashboard {
    padding: 0.5rem;
  }
  
  .sky-banner {
    padding: 1.5rem;
  }
  
  .sky-banner h2 {
    font-size: 1.5rem;
  }
  
  .grid-cols-4, .grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  .cloud {
    display: none;
  }
  
  .sun {
    display: none;
  }
}

@media (max-width: 1024px) {
  .lg\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
}

/* Print styles */
@media print {
  .sky-dashboard {
    background: white !important;
  }
  
  .sky-background,
  .stars-container,
  .cloud-card::after,
  .sky-card::before,
  .sky-action-btn::before,
  .sun,
  .cloud {
    display: none !important;
  }
  
  button {
    display: none !important;
  }
  
  .sky-banner,
  .sky-card,
  .cloud-card {
    background: white !important;
    color: black !important;
    box-shadow: none !important;
    border: 1px solid #e5e7eb !important;
  }
  
  .text-white {
    color: black !important;
  }
  
  .drop-shadow {
    filter: none !important;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .sky-dashboard,
  .cloud,
  .sun,
  .star,
  .sky-card::before,
  .sky-action-btn::before,
  .sky-banner::before,
  .cloud-card::after {
    animation: none !important;
  }
  
  .sky-card:hover,
  .sky-action-btn:hover {
    transform: none !important;
  }
  
  .animate-slide-down {
    animation: none !important;
  }
}
</style>