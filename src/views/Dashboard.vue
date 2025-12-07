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
        <div class="cloud cloud-7"></div>
      </div>
      <div class="sun"></div>
    </div>

    <!-- Welcome Banner -->
    <div class="mb-8 relative z-10">
      <div class="sky-banner rounded-2xl shadow-xl p-8 backdrop-blur-xl bg-gradient-to-r from-sky-500/90 to-cyan-500/90 border border-white/20">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-3xl font-bold text-white mb-2 drop-shadow-lg">مرحباً، {{ userName }} 👋</h2>
            <p class="text-blue-50 opacity-90">هذه نظرة عامة على أداء نظام المخزون</p>
            <div class="mt-4 flex items-center space-x-6 rtl:space-x-reverse">
              <div class="flex items-center text-blue-50">
                <svg class="w-5 h-5 ml-1 drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm">النظام يعمل بشكل طبيعي</span>
              </div>
              <div class="flex items-center text-blue-50">
                <svg class="w-5 h-5 ml-1 drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm">{{ accessibleWarehouses.length }} مخازن نشطة</span>
              </div>
            </div>
          </div>
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
        </div>
      </div>
    </div>

    <!-- Stats Grid - Sky Themed Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10">
      <!-- Total Items Card -->
      <div class="sky-card morning-sky rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 backdrop-blur-md">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-gradient-to-br from-sky-500/80 to-blue-600/80 rounded-xl backdrop-blur-sm border border-white/20">
            <svg class="w-6 h-6 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <span class="text-sm font-medium text-green-300 drop-shadow">+12%</span>
        </div>
        <h3 class="text-2xl font-bold text-white mb-2 drop-shadow">{{ formatNumber(dashboardStats.totalItems) }}</h3>
        <p class="text-sky-100 opacity-90">إجمالي الأصناف</p>
      </div>

      <!-- Total Quantity Card -->
      <div class="sky-card day-sky rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 backdrop-blur-md">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-gradient-to-br from-emerald-500/80 to-green-600/80 rounded-xl backdrop-blur-sm border border-white/20">
            <svg class="w-6 h-6 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <span class="text-sm font-medium text-green-300 drop-shadow">+8%</span>
        </div>
        <h3 class="text-2xl font-bold text-white mb-2 drop-shadow">{{ formatNumber(dashboardStats.totalQuantity) }}</h3>
        <p class="text-emerald-100 opacity-90">إجمالي الكمية</p>
      </div>

      <!-- Low Stock Card -->
      <div class="sky-card sunset-sky rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 backdrop-blur-md">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-gradient-to-br from-orange-500/80 to-amber-600/80 rounded-xl backdrop-blur-sm border border-white/20">
            <svg class="w-6 h-6 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <span class="text-sm font-medium text-orange-300 drop-shadow">+3</span>
        </div>
        <h3 class="text-2xl font-bold text-white mb-2 drop-shadow">{{ formatNumber(dashboardStats.lowStockItems) }}</h3>
        <p class="text-orange-100 opacity-90">أصناف منخفضة</p>
      </div>

      <!-- Recent Activity Card -->
      <div class="sky-card twilight-sky rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 backdrop-blur-md">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-gradient-to-br from-violet-500/80 to-purple-600/80 rounded-xl backdrop-blur-sm border border-white/20">
            <svg class="w-6 h-6 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <span class="text-sm font-medium text-purple-300 drop-shadow">+15%</span>
        </div>
        <h3 class="text-2xl font-bold text-white mb-2 drop-shadow">{{ formatNumber(dashboardStats.recentTransactions) }}</h3>
        <p class="text-violet-100 opacity-90">الحركات اليوم</p>
      </div>
    </div>

    <!-- Charts and Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
      <!-- Recent Transactions -->
      <div class="cloud-card rounded-2xl shadow-xl p-6 backdrop-blur-md border border-white/20 bg-gradient-to-br from-white/10 to-blue-50/5">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-white drop-shadow">آخر الحركات</h3>
          <div 
            @click="navigateTo('/transactions')"
            class="text-sm text-sky-300 hover:text-sky-200 cursor-pointer hover:underline transition-colors"
          >
            عرض الكل
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
          </div>
          <div v-else class="space-y-4">
            <div 
              v-for="transaction in recentTransactions.slice(0, 6)" 
              :key="transaction.id" 
              class="flex items-center p-4 hover:bg-white/10 rounded-xl transition-all duration-300 cursor-pointer group backdrop-blur-sm border border-white/5 hover:border-white/20"
              @click="viewTransaction(transaction)"
            >
              <div :class="getTransactionColor(transaction.type)" class="h-12 w-12 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform">
                <svg class="h-6 w-6 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-white group-hover:text-sky-200 transition-colors">{{ getTransactionLabel(transaction.type) }}</h4>
                <p class="text-sm text-sky-200/80">{{ formatDateTime(transaction.timestamp) }}</p>
              </div>
              <div class="text-right">
                <p class="font-medium text-white group-hover:text-sky-200 transition-colors">{{ transaction.quantity || 0 }} وحدة</p>
                <p class="text-sm text-sky-200/80">{{ transaction.item_code || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Warehouse Distribution -->
      <div class="cloud-card rounded-2xl shadow-xl p-6 backdrop-blur-md border border-white/20 bg-gradient-to-br from-white/10 to-blue-50/5">
        <h3 class="text-lg font-bold text-white drop-shadow mb-6">توزيع المخزون</h3>
        <div class="space-y-4">
          <div 
            v-for="warehouse in warehouseStats" 
            :key="warehouse.id" 
            class="space-y-2 cursor-pointer hover:bg-white/10 p-4 rounded-xl transition-all duration-300 group backdrop-blur-sm border border-white/5 hover:border-white/20"
            @click="navigateToWarehouse(warehouse.id)"
          >
            <div class="flex justify-between text-sm">
              <span class="font-medium text-white group-hover:text-sky-200 transition-colors">{{ warehouse.name }}</span>
              <span class="text-sky-200/80">{{ warehouse.items }} أصناف</span>
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
        </div>
      </div>
    </div>

    <!-- Quick Actions Row -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
      <button 
        v-if="canModifyItems" 
        @click="navigateTo('/inventory/add')"
        @touchstart="handleTouch($event, () => navigateTo('/inventory/add'))"
        class="sky-action-btn morning-action text-white font-medium py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 flex items-center justify-center cursor-pointer backdrop-blur-md border border-white/20 hover:-translate-y-1"
        :class="{'opacity-50 cursor-not-allowed': !canModifyItems}"
        :disabled="!canModifyItems"
      >
        <svg class="h-5 w-5 ml-2 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        إضافة صنف جديد
      </button>

      <button 
        @click="navigateTo('/reports')"
        @touchstart="handleTouch($event, () => navigateTo('/reports'))"
        v-if="canViewReports"
        class="sky-action-btn day-action text-white font-medium py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 flex items-center justify-center cursor-pointer backdrop-blur-md border border-white/20 hover:-translate-y-1"
        :class="{'opacity-50 cursor-not-allowed': !canViewReports}"
        :disabled="!canViewReports"
      >
        <svg class="h-5 w-5 ml-2 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        عرض التقارير
      </button>

      <button 
        v-else
        @click="exportReport"
        @touchstart="handleTouch($event, exportReport)"
        class="sky-action-btn sunset-action text-white font-medium py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 flex items-center justify-center cursor-pointer backdrop-blur-md border border-white/20 hover:-translate-y-1"
      >
        <svg class="h-5 w-5 ml-2 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        تصدير تقرير
      </button>

      <button 
        @click="navigateTo('/transfers')"
        @touchstart="handleTouch($event, () => navigateTo('/transfers'))"
        v-if="canModifyItems"
        class="sky-action-btn twilight-action text-white font-medium py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 flex items-center justify-center cursor-pointer backdrop-blur-md border border-white/20 hover:-translate-y-1"
        :class="{'opacity-50 cursor-not-allowed': !canModifyItems}"
        :disabled="!canModifyItems"
      >
        <svg class="h-5 w-5 ml-2 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
        </svg>
        نقل المخزون
      </button>

      <button 
        @click="navigateTo('/dispatch')"
        @touchstart="handleTouch($event, () => navigateTo('/dispatch'))"
        v-else-if="canDispatch"
        class="sky-action-btn night-action text-white font-medium py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 flex items-center justify-center cursor-pointer backdrop-blur-md border border-white/20 hover:-translate-y-1"
        :class="{'opacity-50 cursor-not-allowed': !canDispatch}"
        :disabled="!canDispatch"
      >
        <svg class="h-5 w-5 ml-2 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m6 4l4-4m0 0l4 4m-4-4v12"/>
        </svg>
        صرف خارجي
      </button>

      <button 
        @click="printDashboard"
        @touchstart="handleTouch($event, printDashboard)"
        v-else
        class="sky-action-btn midnight-action text-white font-medium py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 flex items-center justify-center cursor-pointer backdrop-blur-md border border-white/20 hover:-translate-y-1"
      >
        <svg class="h-5 w-5 ml-2 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
        </svg>
        طباعة اللوحة
      </button>
    </div>

    <!-- Additional Actions -->
    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
      <button 
        @click="navigateTo('/inventory')"
        @touchstart="handleTouch($event, () => navigateTo('/inventory'))"
        class="cloud-action-btn text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-md border border-white/20 hover:-translate-y-0.5"
      >
        <svg class="h-5 w-5 ml-2 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
        </svg>
        عرض المخزون
      </button>

      <button 
        @click="navigateTo('/users')"
        @touchstart="handleTouch($event, () => navigateTo('/users'))"
        v-if="canManageUsers"
        class="cloud-action-btn text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-md border border-white/20 hover:-translate-y-0.5"
        :class="{'opacity-50 cursor-not-allowed': !canManageUsers}"
        :disabled="!canManageUsers"
      >
        <svg class="h-5 w-5 ml-2 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-6.197a6 6 0 00-9-5.197M9 10h.01"/>
        </svg>
        إدارة المستخدمين
      </button>

      <button 
        @click="navigateTo('/warehouses')"
        @touchstart="handleTouch($event, () => navigateTo('/warehouses'))"
        v-if="canManageUsers"
        class="cloud-action-btn text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-md border border-white/20 hover:-translate-y-0.5"
        :class="{'opacity-50 cursor-not-allowed': !canManageUsers}"
        :disabled="!canManageUsers"
      >
        <svg class="h-5 w-5 ml-2 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
        إدارة المخازن
      </button>

      <button 
        @click="navigateTo('/profile')"
        @touchstart="handleTouch($event, () => navigateTo('/profile'))"
        class="cloud-action-btn text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-md border border-white/20 hover:-translate-y-0.5"
      >
        <svg class="h-5 w-5 ml-2 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
        الملف الشخصي
      </button>
    </div>

    <!-- Stars for night effect -->
    <div class="stars-container">
      <div class="star" v-for="star in stars" :key="star.id" :style="star.style"></div>
    </div>

    <!-- Toast for navigation errors -->
    <div v-if="navigationError" class="fixed bottom-4 right-4 left-4 md:right-auto md:left-1/2 md:-translate-x-1/2 md:w-96 z-50">
      <div class="bg-gradient-to-r from-red-500/90 to-pink-500/90 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between animate-slide-down backdrop-blur-md border border-white/20">
        <span class="flex-1">{{ navigationError }}</span>
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';

export default {
  name: 'SkyDashboard',
  
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    
    // State
    const loading = ref(false);
    const navigationError = ref('');
    const stars = ref([]);
    
    // Create stars for night effect
    const createStars = () => {
      const starsArray = [];
      for (let i = 0; i < 50; i++) {
        starsArray.push({
          id: i,
          style: {
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            animationDelay: `${Math.random() * 5}s`
          }
        });
      }
      return starsArray;
    };
    
    // Computed properties
    const userRole = computed(() => store.getters.userRole);
    const userName = computed(() => store.getters.userName);
    const dashboardStats = computed(() => store.getters.dashboardStats || {
      totalItems: 0,
      totalQuantity: 0,
      lowStockItems: 0,
      recentTransactions: 0
    });
    const recentTransactions = computed(() => store.state.recentTransactions || []);
    const recentTransactionsLoading = computed(() => store.state.recentTransactionsLoading || false);
    const inventory = computed(() => store.state.inventory || []);
    const accessibleWarehouses = computed(() => store.getters.accessibleWarehouses || []);
    
    const canModifyItems = computed(() => store.getters.canEdit || false);
    const canDispatch = computed(() => store.getters.canDispatch || false);
    const canManageUsers = computed(() => store.getters.canManageUsers || false);
    const canViewReports = computed(() => {
      const role = store.getters.userRole;
      return ['superadmin', 'company_manager'].includes(role);
    });
    
    // Warehouse stats for chart
    const warehouseStats = computed(() => {
      const warehouses = accessibleWarehouses.value.slice(0, 4);
      const colors = ['#fbbf24', '#60a5fa', '#34d399', '#a78bfa'];
      
      return warehouses.map((warehouse, index) => {
        const warehouseItems = inventory.value.filter(item => item.warehouse_id === warehouse.id);
        const totalItems = inventory.value.length;
        
        return {
          id: warehouse.id,
          name: warehouse.name_ar || warehouse.name,
          items: warehouseItems.length,
          quantity: warehouseItems.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0),
          percentage: totalItems > 0 ? Math.round((warehouseItems.length / totalItems) * 100) : 0,
          color: colors[index] || '#94a3b8'
        };
      });
    });
    
    // Methods
    const handleTouch = (event, handler) => {
      event.preventDefault();
      event.stopPropagation();
      
      // Add visual feedback
      const target = event.currentTarget;
      target.classList.add('active-touch');
      setTimeout(() => {
        target.classList.remove('active-touch');
      }, 200);
      
      if (typeof handler === 'function') {
        handler();
      }
    };
    
    const navigateTo = async (path) => {
      try {
        console.log('Navigating to:', path);
        
        // Check if user has permission for the route
        const canAccess = await checkRoutePermission(path);
        if (!canAccess) {
          navigationError.value = 'ليس لديك صلاحية للوصول إلى هذه الصفحة';
          setTimeout(() => {
            navigationError.value = '';
          }, 3000);
          return;
        }
        
        // Navigate
        await router.push(path);
        
      } catch (error) {
        console.error('Navigation error:', error);
        
        if (error.name !== 'NavigationDuplicated') {
          navigationError.value = 'حدث خطأ في التنقل إلى الصفحة';
          setTimeout(() => {
            navigationError.value = '';
          }, 3000);
        }
      }
    };
    
    const checkRoutePermission = async (path) => {
      try {
        // Check route meta permissions
        const routeRecord = router.resolve(path).route;
        
        // No restrictions
        if (!routeRecord.meta?.allowedRoles) {
          return true;
        }
        
        // Check user role
        const userRole = store.getters.userRole;
        if (!userRole) {
          return false;
        }
        
        // Check if role is allowed
        const allowedRoles = routeRecord.meta.allowedRoles;
        if (!allowedRoles.includes(userRole)) {
          return false;
        }
        
        // Check specific permissions
        if (routeRecord.meta.permissions) {
          const permission = routeRecord.meta.permissions[userRole];
          if (permission === 'none') {
            return false;
          }
        }
        
        // Additional checks for warehouse managers
        if (userRole === 'warehouse_manager') {
          const allowedWarehouses = store.state.userProfile?.allowed_warehouses || [];
          
          if (path.includes('/inventory') && allowedWarehouses.length === 0) {
            return false;
          }
        }
        
        return true;
        
      } catch (error) {
        console.error('Permission check error:', error);
        return false;
      }
    };
    
    const refreshData = async () => {
      if (loading.value) return;
      
      loading.value = true;
      try {
        await store.dispatch('getRecentTransactions');
        
        // Show success feedback
        const event = new CustomEvent('show-toast', {
          detail: {
            message: 'تم تحديث البيانات بنجاح',
            type: 'success'
          }
        });
        window.dispatchEvent(event);
        
      } catch (error) {
        console.error('Error refreshing data:', error);
        
        const event = new CustomEvent('show-toast', {
          detail: {
            message: 'حدث خطأ في تحديث البيانات',
            type: 'error'
          }
        });
        window.dispatchEvent(event);
        
      } finally {
        loading.value = false;
      }
    };
    
    const exportReport = async () => {
      try {
        // Show loading
        const loadingEvent = new CustomEvent('show-toast', {
          detail: {
            message: 'جاري تصدير التقرير...',
            type: 'info'
          }
        });
        window.dispatchEvent(loadingEvent);
        
        // Simulate export process
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success
        const successEvent = new CustomEvent('show-toast', {
          detail: {
            message: 'تم تصدير التقرير بنجاح',
            type: 'success'
          }
        });
        window.dispatchEvent(successEvent);
        
      } catch (error) {
        console.error('Export error:', error);
        
        const errorEvent = new CustomEvent('show-toast', {
          detail: {
            message: 'حدث خطأ في تصدير التقرير',
            type: 'error'
          }
        });
        window.dispatchEvent(errorEvent);
      }
    };
    
    const printDashboard = () => {
      window.print();
    };
    
    const viewTransaction = (transaction) => {
      console.log('View transaction:', transaction);
      // Could navigate to transaction details if implemented
    };
    
    const navigateToWarehouse = (warehouseId) => {
      navigateTo(`/inventory?warehouse=${warehouseId}`);
    };
    
    const formatNumber = (num) => {
      const number = Number(num) || 0;
      return new Intl.NumberFormat('ar-EG').format(number);
    };
    
    const formatDateTime = (date) => {
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
    };
    
    const getTransactionColor = (type) => {
      const colors = {
        add: 'bg-gradient-to-br from-emerald-500/80 to-green-600/80',
        transfer: 'bg-gradient-to-br from-blue-500/80 to-cyan-600/80',
        dispatch: 'bg-gradient-to-br from-orange-500/80 to-amber-600/80',
        receive: 'bg-gradient-to-br from-violet-500/80 to-purple-600/80'
      };
      return colors[type] || 'bg-gradient-to-br from-gray-500/80 to-gray-600/80';
    };
    
    const getTransactionLabel = (type) => {
      const labels = {
        add: 'إضافة',
        transfer: 'نقل',
        dispatch: 'صرف',
        receive: 'استلام'
      };
      return labels[type] || type;
    };
    
    // Listen for toast events
    const handleToastEvent = (event) => {
      console.log('Toast event received:', event.detail);
    };
    
    // Lifecycle
    onMounted(() => {
      console.log('Sky Dashboard mounted');
      
      // Load initial data
      refreshData();
      
      // Create stars
      stars.value = createStars();
      
      // Listen for toast events
      window.addEventListener('show-toast', handleToastEvent);
    });
    
    onUnmounted(() => {
      window.removeEventListener('show-toast', handleToastEvent);
    });
    
    return {
      // State
      loading,
      navigationError,
      stars,
      
      // Computed
      userRole,
      userName,
      dashboardStats,
      recentTransactions,
      recentTransactionsLoading,
      accessibleWarehouses,
      canModifyItems,
      canDispatch,
      canManageUsers,
      canViewReports,
      warehouseStats,
      
      // Methods
      handleTouch,
      navigateTo,
      refreshData,
      exportReport,
      printDashboard,
      viewTransaction,
      navigateToWarehouse,
      formatNumber,
      formatDateTime,
      getTransactionColor,
      getTransactionLabel
    };
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
  background: linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.7));
}

.cloud-2 {
  width: 200px;
  height: 80px;
  top: 30%;
  left: -200px;
  animation-delay: 15s;
  animation-duration: 45s;
  background: linear-gradient(to right, rgba(255,255,255,0.8), rgba(255,255,255,0.6));
}

.cloud-3 {
  width: 250px;
  height: 90px;
  top: 50%;
  left: -250px;
  animation-delay: 30s;
  animation-duration: 50s;
  background: linear-gradient(to right, rgba(255,255,255,0.85), rgba(255,255,255,0.65));
}

.cloud-4 {
  width: 180px;
  height: 70px;
  top: 70%;
  left: -180px;
  animation-delay: 45s;
  animation-duration: 55s;
  background: linear-gradient(to right, rgba(255,255,255,0.75), rgba(255,255,255,0.55));
}

.cloud-5 {
  width: 220px;
  height: 85px;
  top: 20%;
  left: -220px;
  animation-delay: 60s;
  animation-duration: 65s;
  background: linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0.75));
}

.cloud-6 {
  width: 280px;
  height: 95px;
  top: 40%;
  left: -280px;
  animation-delay: 75s;
  animation-duration: 70s;
  background: linear-gradient(to right, rgba(255,255,255,0.8), rgba(255,255,255,0.6));
}

.cloud-7 {
  width: 150px;
  height: 60px;
  top: 80%;
  left: -150px;
  animation-delay: 90s;
  animation-duration: 40s;
  background: linear-gradient(to right, rgba(255,255,255,0.7), rgba(255,255,255,0.5));
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

/* Touch feedback */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.active-touch {
  transform: scale(0.98);
  opacity: 0.9;
}

/* Disabled state */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button:disabled:hover {
  transform: none !important;
  box-shadow: none !important;
}

button:disabled:hover::before {
  left: -100%;
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out;
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
  .sky-action-btn::before {
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

/* Mobile optimizations */
@media (max-width: 768px) {
  .grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .md\:grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .lg\:grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .cloud {
    display: none;
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

/* Enhanced blur effects for better performance */
.sky-card,
.cloud-card,
.sky-action-btn,
.cloud-action-btn {
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

/* Smooth scrolling */
.sky-dashboard {
  scroll-behavior: smooth;
}

/* Hover effects for interactive elements */
.sky-card:hover,
.cloud-card:hover,
.sky-action-btn:not(:disabled):hover,
.cloud-action-btn:not(:disabled):hover {
  transform: translateY(-4px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}
</style>