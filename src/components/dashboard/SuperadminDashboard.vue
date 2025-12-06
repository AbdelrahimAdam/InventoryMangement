<template>
  <div class="sky-background">
    <!-- Animated Background Elements -->
    <div class="clouds">
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
      <div class="cloud cloud-3"></div>
    </div>

    <div class="celestial-body" :class="{ 'moon-mode': isDarkMode }">
      <div class="sun" v-if="!isDarkMode"></div>
      <div class="moon" v-else>
        <div class="moon-crater"></div>
        <div class="moon-crater small"></div>
        <div class="moon-crater"></div>
      </div>
    </div>

    <div v-if="isDarkMode" class="stars">
      <div v-for="n in 50" :key="n" class="star" :style="{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${1 + Math.random() * 2}s`
      }"></div>
    </div>

    <!-- Main Content -->
    <div class="dashboard-container">
      <!-- Desktop Header -->
      <header class="glass-header">
        <div class="header-content">
          <!-- Logo -->
          <router-link to="/" class="logo-container">
            <div class="logo-icon">
              <span class="logo-text">م</span>
            </div>
            <div class="logo-text-container">
              <h1 class="logo-title">لوحة التحكم الرئيسية</h1>
              <p class="logo-subtitle">نظام إدارة المخزون المتكامل</p>
            </div>
          </router-link>

          <!-- User Controls -->
          <div class="user-controls">
            <!-- Theme Toggle -->
            <button @click="toggleDarkMode" class="theme-toggle">
              <svg v-if="isDarkMode" class="sun-icon" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" fill="currentColor"/>
                <line x1="12" y1="1" x2="12" y2="4" stroke="currentColor" stroke-width="2"/>
                <line x1="12" y1="20" x2="12" y2="23" stroke="currentColor" stroke-width="2"/>
                <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" stroke="currentColor" stroke-width="2"/>
                <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2"/>
                <line x1="1" y1="12" x2="4" y2="12" stroke="currentColor" stroke-width="2"/>
                <line x1="20" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2"/>
                <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" stroke="currentColor" stroke-width="2"/>
                <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2"/>
              </svg>
              <svg v-else class="moon-icon" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/>
              </svg>
            </button>

            <!-- Notifications -->
            <div class="notifications-container">
              <button @click="toggleNotifications" class="notifications-btn" :class="{ 'has-notifications': notificationCount > 0 }">
                <svg class="bell-icon" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" 
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span v-if="notificationCount > 0" class="notification-badge">
                  {{ notificationCount > 9 ? '9+' : notificationCount }}
                </span>
              </button>
            </div>

            <!-- User Profile -->
            <div class="user-profile-container">
              <button @click="toggleUserMenu" class="user-profile-btn">
                <div class="user-avatar" :style="{ background: userAvatarColor }">
                  {{ getUserInitials(userName) }}
                </div>
                <div class="user-info">
                  <p class="user-name">{{ userName }}</p>
                  <p class="user-role">{{ getRoleName(userRole) }}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Welcome Banner -->
      <div class="welcome-banner">
        <div class="welcome-content">
          <div class="welcome-text">
            <h2>مرحباً، {{ userName }}! 👋</h2>
            <p>هذه نظرة عامة على أداء نظام المخزون</p>
          </div>
          <div class="welcome-stats">
            <div class="stat-item">
              <span class="stat-label">آخر تحديث</span>
              <span class="stat-value">{{ formatTime(lastUpdate) }}</span>
            </div>
            <button @click="refreshData" class="refresh-btn" :disabled="loading">
              <svg :class="{'animate-spin': loading}" class="refresh-icon" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              تحديث البيانات
            </button>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Content -->
      <div class="main-dashboard-content">
        <!-- Stats Grid - 4 Modern Cards -->
        <div class="stats-grid">
          <!-- Total Items Card -->
          <div class="stat-card" @mouseenter="hoverCard('total')" @mouseleave="resetCard">
            <div class="stat-icon-wrapper" :class="{ 'hovered': hoveredCard === 'total' }">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
                        fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
            </div>
            <div class="stat-content">
              <div class="stat-header">
                <h3 class="stat-title">إجمالي الأصناف</h3>
                <span class="stat-change" :class="statsChange.totalItems >= 0 ? 'positive' : 'negative'">
                  <svg v-if="statsChange.totalItems >= 0" class="change-icon" viewBox="0 0 24 24">
                    <polyline points="18 15 12 9 6 15" fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <svg v-else class="change-icon" viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9" fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  {{ Math.abs(statsChange.totalItems) }}%
                </span>
              </div>
              <p class="stat-value">{{ formatNumber(dashboardStats.totalItems) }}</p>
              <p class="stat-description">صنف في النظام</p>
            </div>
            <div class="stat-sparkline">
              <div class="sparkline-bar" v-for="(value, index) in sparklineData.total" 
                   :key="index" :style="{ height: `${value}%` }"></div>
            </div>
          </div>

          <!-- Total Quantity Card -->
          <div class="stat-card" @mouseenter="hoverCard('quantity')" @mouseleave="resetCard">
            <div class="stat-icon-wrapper" :class="{ 'hovered': hoveredCard === 'quantity' }">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                        fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
            </div>
            <div class="stat-content">
              <div class="stat-header">
                <h3 class="stat-title">إجمالي الكمية</h3>
                <span class="stat-change" :class="statsChange.totalQuantity >= 0 ? 'positive' : 'negative'">
                  <svg v-if="statsChange.totalQuantity >= 0" class="change-icon" viewBox="0 0 24 24">
                    <polyline points="18 15 12 9 6 15" fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <svg v-else class="change-icon" viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9" fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  {{ Math.abs(statsChange.totalQuantity) }}%
                </span>
              </div>
              <p class="stat-value">{{ formatNumber(dashboardStats.totalQuantity) }}</p>
              <p class="stat-description">وحدة متاحة</p>
            </div>
            <div class="stat-sparkline">
              <div class="sparkline-bar" v-for="(value, index) in sparklineData.quantity" 
                   :key="index" :style="{ height: `${value}%` }"></div>
            </div>
          </div>

          <!-- Low Stock Card -->
          <div class="stat-card warning" @mouseenter="hoverCard('low')" @mouseleave="resetCard">
            <div class="stat-icon-wrapper" :class="{ 'hovered': hoveredCard === 'low' }">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                        fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
            </div>
            <div class="stat-content">
              <div class="stat-header">
                <h3 class="stat-title">أصناف منخفضة</h3>
                <span class="stat-change" :class="statsChange.lowStockItems >= 0 ? 'negative' : 'positive'">
                  <svg v-if="statsChange.lowStockItems >= 0" class="change-icon" viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9" fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <svg v-else class="change-icon" viewBox="0 0 24 24">
                    <polyline points="18 15 12 9 6 15" fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  {{ Math.abs(statsChange.lowStockItems) }}
                </span>
              </div>
              <p class="stat-value">{{ formatNumber(dashboardStats.lowStockItems) }}</p>
              <p class="stat-description">أقل من 10 وحدات</p>
            </div>
            <div class="stat-sparkline">
              <div class="sparkline-bar" v-for="(value, index) in sparklineData.low" 
                   :key="index" :style="{ height: `${value}%` }"></div>
            </div>
          </div>

          <!-- Recent Activity Card -->
          <div class="stat-card" @mouseenter="hoverCard('activity')" @mouseleave="resetCard">
            <div class="stat-icon-wrapper" :class="{ 'hovered': hoveredCard === 'activity' }">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                        fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
            </div>
            <div class="stat-content">
              <div class="stat-header">
                <h3 class="stat-title">الحركات اليوم</h3>
                <span class="stat-change" :class="statsChange.recentTransactions >= 0 ? 'positive' : 'negative'">
                  <svg v-if="statsChange.recentTransactions >= 0" class="change-icon" viewBox="0 0 24 24">
                    <polyline points="18 15 12 9 6 15" fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <svg v-else class="change-icon" viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9" fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  {{ Math.abs(statsChange.recentTransactions) }}%
                </span>
              </div>
              <p class="stat-value">{{ formatNumber(dashboardStats.recentTransactions) }}</p>
              <p class="stat-description">عملية خلال 24 ساعة</p>
            </div>
            <div class="stat-sparkline">
              <div class="sparkline-bar" v-for="(value, index) in sparklineData.activity" 
                   :key="index" :style="{ height: `${value}%` }"></div>
            </div>
          </div>
        </div>

        <!-- Charts and Data Section -->
        <div class="dashboard-section">
          <!-- Recent Transactions -->
          <div class="section-card">
            <div class="section-header">
              <h3>آخر الحركات</h3>
              <router-link to="/transactions" class="view-all-link">عرض الكل</router-link>
            </div>
            <div class="transactions-list">
              <div v-if="recentTransactionsLoading" class="loading-state">
                <div class="spinner"></div>
                <p>جاري تحميل الحركات...</p>
              </div>
              <div v-else-if="recentTransactions.length === 0" class="empty-state">
                <svg class="empty-icon" viewBox="0 0 24 24">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                        fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
                <p>لا توجد حركات حديثة</p>
              </div>
              <div v-else class="transactions-items">
                <div v-for="transaction in recentTransactions.slice(0, 5)" :key="transaction.id" 
                     class="transaction-item">
                  <div class="transaction-type" :class="transaction.type">
                    <div class="type-icon">
                      <svg v-if="transaction.type === 'add'" viewBox="0 0 24 24">
                        <path d="M12 4v16m8-8H4" fill="none" stroke="currentColor" stroke-width="2"/>
                      </svg>
                      <svg v-else-if="transaction.type === 'transfer'" viewBox="0 0 24 24">
                        <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" fill="none" stroke="currentColor" stroke-width="2"/>
                      </svg>
                      <svg v-else viewBox="0 0 24 24">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m6 4l4-4m0 0l4 4m-4-4v12" fill="none" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </div>
                    <span class="type-label">{{ getTransactionLabel(transaction.type) }}</span>
                  </div>
                  <div class="transaction-details">
                    <p class="item-name">{{ transaction.item_name || 'غير معروف' }}</p>
                    <p class="item-code">{{ transaction.item_code }}</p>
                  </div>
                  <div class="transaction-info">
                    <p class="quantity">{{ transaction.quantity }} وحدة</p>
                    <p class="time">{{ formatTime(transaction.timestamp) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Warehouse Distribution -->
          <div class="section-card">
            <div class="section-header">
              <h3>توزيع المخزون</h3>
              <div class="legend">
                <div class="legend-item">
                  <span class="legend-color" style="background: #f59e0b"></span>
                  <span class="legend-label">نشط</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color" style="background: #3b82f6"></span>
                  <span class="legend-label">متوسط</span>
                </div>
              </div>
            </div>
            <div class="warehouse-distribution">
              <div v-for="warehouse in warehouseStats" :key="warehouse.id" class="warehouse-bar">
                <div class="warehouse-info">
                  <span class="warehouse-name">{{ warehouse.name }}</span>
                  <span class="warehouse-stats">{{ warehouse.items }} أصناف</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ 
                    width: `${warehouse.fillPercentage}%`,
                    background: warehouse.fillPercentage >= 80 ? '#f59e0b' : '#3b82f6'
                  }"></div>
                </div>
                <div class="warehouse-quantity">{{ formatNumber(warehouse.quantity) }} وحدة</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions-section">
          <h3>إجراءات سريعة</h3>
          <div class="action-buttons">
            <button v-if="canModifyItems" @click="openAddItemModal" class="action-btn primary">
              <div class="action-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 4v16m8-8H4" fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <span>إضافة صنف جديد</span>
            </button>

            <button v-if="canModifyItems" @click="openTransferModal" class="action-btn secondary">
              <div class="action-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <span>نقل بين المخازن</span>
            </button>

            <button v-if="canModifyItems && canDispatch" @click="openDispatchModal" class="action-btn warning">
              <div class="action-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m6 4l4-4m0 0l4 4m-4-4v12" fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <span>صرف إلى خارجي</span>
            </button>

            <button @click="exportReport" class="action-btn info">
              <div class="action-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                        fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <span>تصدير تقرير</span>
            </button>
          </div>
        </div>

        <!-- Mobile Bottom Navigation -->
        <div class="mobile-nav" v-if="isMobile">
          <router-link to="/dashboard" class="nav-item active">
            <svg class="nav-icon" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span>الرئيسية</span>
          </router-link>
          
          <router-link to="/inventory" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
            </svg>
            <span>المخزون</span>
          </router-link>
          
          <router-link to="/transactions" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <span>الحركات</span>
          </router-link>
          
          <router-link to="/profile" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span>الحساب</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'AnalyticsDashboard',
  
  setup() {
    const store = useStore();
    const router = useRouter();
    
    // State
    const isDarkMode = ref(false);
    const loading = ref(false);
    const hoveredCard = ref(null);
    const lastUpdate = ref(new Date());
    
    // Computed properties
    const userRole = computed(() => store.getters.userRole);
    const userName = computed(() => store.getters.userName);
    const dashboardStats = computed(() => store.getters.dashboardStats);
    const recentTransactions = computed(() => store.state.recentTransactions);
    const recentTransactionsLoading = computed(() => store.state.recentTransactionsLoading);
    
    const canModifyItems = computed(() => store.getters.canEdit);
    const canDispatch = computed(() => store.getters.canDispatch);
    
    // Mock sparkline data
    const sparklineData = ref({
      total: [30, 45, 35, 50, 40, 55, 60],
      quantity: [40, 35, 45, 50, 55, 60, 65],
      low: [20, 25, 30, 35, 40, 45, 50],
      activity: [10, 15, 12, 18, 20, 22, 25]
    });
    
    // Mock stats change
    const statsChange = ref({
      totalItems: 12,
      totalQuantity: 8,
      lowStockItems: -3,
      recentTransactions: 15
    });
    
    // Mock warehouse stats
    const warehouseStats = computed(() => {
      const warehouses = store.state.warehouses || [];
      return warehouses.slice(0, 4).map(warehouse => ({
        id: warehouse.id,
        name: warehouse.name_ar || warehouse.name,
        items: Math.floor(Math.random() * 50) + 20,
        quantity: Math.floor(Math.random() * 1000) + 500,
        fillPercentage: Math.floor(Math.random() * 30) + 50
      }));
    });
    
    const notificationCount = computed(() => {
      return store.getters.dashboardStats?.lowStockItems || 0;
    });
    
    const userAvatarColor = computed(() => {
      const colors = {
        superadmin: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        warehouse_manager: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        company_manager: 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
      };
      return colors[userRole.value] || 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    });
    
    // Check if mobile
    const isMobile = computed(() => window.innerWidth < 768);
    
    // Methods
    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
      document.documentElement.classList.toggle('dark', isDarkMode.value);
      localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
    };
    
    const toggleUserMenu = () => {
      // Implement user menu toggle
    };
    
    const toggleNotifications = () => {
      // Implement notifications toggle
    };
    
    const hoverCard = (card) => {
      hoveredCard.value = card;
    };
    
    const resetCard = () => {
      hoveredCard.value = null;
    };
    
    const refreshData = async () => {
      loading.value = true;
      try {
        await store.dispatch('getRecentTransactions');
        lastUpdate.value = new Date();
      } catch (error) {
        console.error('Error refreshing data:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const formatNumber = (num) => {
      return new Intl.NumberFormat('ar-EG').format(num);
    };
    
    const formatTime = (date) => {
      if (!date) return '';
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    };
    
    const getRoleName = (role) => {
      const names = {
        superadmin: 'المشرف العام',
        warehouse_manager: 'مدير المخازن',
        company_manager: 'مدير الشركة'
      };
      return names[role] || role;
    };
    
    const getUserInitials = (name) => {
      if (!name) return '??';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };
    
    const getTransactionLabel = (type) => {
      const labels = {
        add: 'إضافة',
        transfer: 'نقل',
        dispatch: 'صرف'
      };
      return labels[type] || type;
    };
    
    const openAddItemModal = () => {
      // Implement modal opening
    };
    
    const openTransferModal = () => {
      // Implement modal opening
    };
    
    const openDispatchModal = () => {
      // Implement modal opening
    };
    
    const exportReport = () => {
      // Implement export functionality
    };
    
    // Lifecycle
    onMounted(() => {
      // Load initial data
      store.dispatch('getRecentTransactions');
      
      // Check theme
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDarkMode.value = true;
        document.documentElement.classList.add('dark');
      }
      
      // Check if mobile
      window.addEventListener('resize', () => {
        // Handle resize if needed
      });
    });
    
    return {
      // State
      isDarkMode,
      loading,
      hoveredCard,
      lastUpdate,
      sparklineData,
      statsChange,
      
      // Computed
      userRole,
      userName,
      dashboardStats,
      recentTransactions,
      recentTransactionsLoading,
      canModifyItems,
      canDispatch,
      warehouseStats,
      notificationCount,
      userAvatarColor,
      isMobile,
      
      // Methods
      toggleDarkMode,
      toggleUserMenu,
      toggleNotifications,
      hoverCard,
      resetCard,
      refreshData,
      formatNumber,
      formatTime,
      getRoleName,
      getUserInitials,
      getTransactionLabel,
      openAddItemModal,
      openTransferModal,
      openDispatchModal,
      exportReport
    };
  }
};
</script>

<style scoped>
/* Sky Background */
.sky-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%);
  transition: background 1s ease;
}

.dark .sky-background {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
}

/* Clouds */
.clouds {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  box-shadow: 0 8px 32px rgba(255, 255, 255, 0.3);
}

.dark .cloud {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(255, 255, 255, 0.1);
}

.cloud-1 {
  width: 200px;
  height: 80px;
  top: 10%;
  left: 5%;
  animation: floatCloud 60s linear infinite;
}

.cloud-2 {
  width: 150px;
  height: 60px;
  top: 30%;
  right: 10%;
  animation: floatCloud 40s linear infinite reverse;
}

.cloud-3 {
  width: 180px;
  height: 70px;
  bottom: 20%;
  left: 20%;
  animation: floatCloud 50s linear infinite;
}

@keyframes floatCloud {
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(calc(100vw + 100px));
  }
}

/* Celestial Body */
.celestial-body {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  z-index: 1;
}

.sun {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 50%;
  box-shadow: 0 0 40px #f59e0b;
  animation: pulseSun 4s ease-in-out infinite;
}

.moon {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
  border-radius: 50%;
  box-shadow: 0 0 30px #94a3b8;
  position: relative;
}

.moon-crater {
  position: absolute;
  background: rgba(148, 163, 184, 0.3);
  border-radius: 50%;
}

.moon-crater:nth-child(1) {
  width: 15px;
  height: 15px;
  top: 15px;
  left: 15px;
}

.moon-crater.small {
  width: 10px;
  height: 10px;
  bottom: 20px;
  right: 20px;
}

.moon-crater:nth-child(3) {
  width: 12px;
  height: 12px;
  bottom: 10px;
  left: 10px;
}

@keyframes pulseSun {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Stars */
.stars {
  position: absolute;
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: twinkle 2s infinite;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}

/* Dashboard Container */
.dashboard-container {
  position: relative;
  min-height: 100vh;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
}

.dark .dashboard-container {
  background: rgba(0, 0, 0, 0.2);
}

/* Glass Header */
.glass-header {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.dark .glass-header {
  background: rgba(15, 23, 42, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.logo-text {
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
}

.logo-title {
  font-size: 1.125rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.dark .logo-title {
  color: #f3f4f6;
}

.logo-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.dark .logo-subtitle {
  color: #9ca3af;
}

/* User Controls */
.user-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-toggle {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.theme-toggle:hover {
  background: rgba(0, 0, 0, 0.05);
}

.dark .theme-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}

.sun-icon, .moon-icon {
  width: 20px;
  height: 20px;
  color: #6b7280;
}

.dark .sun-icon, .dark .moon-icon {
  color: #9ca3af;
}

.sun-icon {
  color: #f59e0b;
}

/* Notifications */
.notifications-container {
  position: relative;
}

.notifications-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s;
  position: relative;
}

.notifications-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.dark .notifications-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.has-notifications .bell-icon {
  color: #ef4444;
  animation: bellRing 0.5s ease;
}

.bell-icon {
  width: 20px;
  height: 20px;
  color: #6b7280;
}

.dark .bell-icon {
  color: #9ca3af;
}

.notification-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #ef4444;
  color: white;
  font-size: 0.625rem;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
}

@keyframes bellRing {
  0%, 100% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(15deg);
  }
  75% {
    transform: rotate(-15deg);
  }
}

/* User Profile */
.user-profile-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  padding: 0.25rem;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-profile-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.dark .user-profile-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-info {
  text-align: right;
}

.user-name {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .user-name {
  color: #f3f4f6;
}

.user-role {
  margin: 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .user-role {
  color: #9ca3af;
}

/* Welcome Banner */
.welcome-banner {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 16px;
  margin: 1.5rem auto;
  max-width: 1400px;
  padding: 1.5rem;
}

.dark .welcome-banner {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-text h2 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
}

.dark .welcome-text h2 {
  color: #f3f4f6;
}

.welcome-text p {
  margin: 0;
  color: #6b7280;
}

.dark .welcome-text p {
  color: #9ca3af;
}

.welcome-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .stat-label {
  color: #9ca3af;
}

.stat-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .stat-value {
  color: #f3f4f6;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-icon {
  width: 16px;
  height: 16px;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Main Dashboard Content */
.main-dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem 2rem;
}

/* Stats Grid - 4 Modern Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.dark .stat-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.dark .stat-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.stat-card.warning {
  border-color: rgba(245, 158, 11, 0.3);
}

.stat-icon-wrapper {
  flex-shrink: 0;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.stat-card.warning .stat-icon {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%);
}

.stat-icon svg {
  width: 24px;
  height: 24px;
  color: #f59e0b;
}

.stat-card.warning .stat-icon svg {
  color: #ef4444;
}

.stat-icon-wrapper.hovered .stat-icon {
  transform: scale(1.1) rotate(5deg);
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.stat-card.warning .stat-icon-wrapper.hovered .stat-icon {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.stat-icon-wrapper.hovered .stat-icon svg {
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.stat-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
}

.dark .stat-title {
  color: #9ca3af;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.stat-change.positive {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.stat-change.negative {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.change-icon {
  width: 12px;
  height: 12px;
}

.stat-value {
  margin: 0 0 0.25rem;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
}

.dark .stat-value {
  color: #f3f4f6;
}

.stat-card.warning .stat-value {
  color: #ef4444;
}

.stat-description {
  margin: 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .stat-description {
  color: #9ca3af;
}

.stat-sparkline {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding: 0 1.5rem 0.5rem;
  opacity: 0.3;
}

.sparkline-bar {
  width: 6px;
  background: linear-gradient(to top, #f59e0b, transparent);
  border-radius: 3px 3px 0 0;
  transition: height 0.3s ease;
}

.stat-card.warning .sparkline-bar {
  background: linear-gradient(to top, #ef4444, transparent);
}

/* Dashboard Section */
.dashboard-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 1024px) {
  .dashboard-section {
    grid-template-columns: 1fr 1fr;
  }
}

.section-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
}

.dark .section-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .section-header h3 {
  color: #f3f4f6;
}

.view-all-link {
  font-size: 0.875rem;
  color: #3b82f6;
  text-decoration: none;
}

.view-all-link:hover {
  text-decoration: underline;
}

.legend {
  display: flex;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .legend-label {
  color: #9ca3af;
}

/* Transactions List */
.transactions-list {
  min-height: 300px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top-color: #f59e0b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-state p {
  margin: 0;
  color: #6b7280;
}

.dark .loading-state p {
  color: #9ca3af;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: 1rem;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: #d1d5db;
}

.dark .empty-icon {
  color: #4b5563;
}

.empty-state p {
  margin: 0;
  color: #6b7280;
}

.dark .empty-state p {
  color: #9ca3af;
}

.transactions-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(249, 250, 251, 0.5);
  border-radius: 12px;
  transition: background-color 0.2s;
}

.dark .transaction-item {
  background: rgba(31, 41, 55, 0.5);
}

.transaction-item:hover {
  background: rgba(249, 250, 251, 0.8);
}

.dark .transaction-item:hover {
  background: rgba(31, 41, 55, 0.8);
}

.transaction-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  min-width: 100px;
}

.transaction-type.add {
  background: rgba(16, 185, 129, 0.1);
  color: #047857;
}

.transaction-type.transfer {
  background: rgba(59, 130, 246, 0.1);
  color: #1d4ed8;
}

.transaction-type.dispatch {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.type-icon {
  width: 20px;
  height: 20px;
}

.type-label {
  font-size: 0.75rem;
  font-weight: 600;
}

.transaction-details {
  flex: 1;
}

.item-name {
  margin: 0 0 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .item-name {
  color: #f3f4f6;
}

.item-code {
  margin: 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .item-code {
  color: #9ca3af;
}

.transaction-info {
  text-align: right;
}

.quantity {
  margin: 0 0 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .quantity {
  color: #f3f4f6;
}

.time {
  margin: 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .time {
  color: #9ca3af;
}

/* Warehouse Distribution */
.warehouse-distribution {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.warehouse-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.warehouse-info {
  flex: 1;
  min-width: 120px;
}

.warehouse-name {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.dark .warehouse-name {
  color: #f3f4f6;
}

.warehouse-stats {
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .warehouse-stats {
  color: #9ca3af;
}

.progress-bar {
  flex: 2;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.dark .progress-bar {
  background: #374151;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.warehouse-quantity {
  min-width: 80px;
  text-align: right;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .warehouse-quantity {
  color: #f3f4f6;
}

/* Quick Actions */
.quick-actions-section {
  margin-bottom: 2rem;
}

.quick-actions-section h3 {
  margin: 0 0 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .quick-actions-section h3 {
  color: #f3f4f6;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  text-align: right;
}

.dark .action-btn {
  background: #1f2937;
}

.action-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-icon svg {
  width: 20px;
  height: 20px;
  color: white;
}

.action-btn.primary .action-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.action-btn.secondary .action-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.action-btn.warning .action-icon {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.action-btn.info .action-icon {
  background: linear-gradient(135deg, #10b981 0%, #047857 100%);
}

.action-btn span {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
  flex: 1;
}

.dark .action-btn span {
  color: #f3f4f6;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.dark .action-btn:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

/* Mobile Navigation */
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-around;
  padding: 0.75rem 0;
  z-index: 1000;
}

.dark .mobile-nav {
  background: #1f2937;
  border-top: 1px solid #374151;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  text-decoration: none;
  color: #6b7280;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.dark .nav-item {
  color: #9ca3af;
}

.nav-item.active {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.nav-item span {
  font-size: 0.625rem;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .welcome-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .welcome-stats {
    width: 100%;
    justify-content: space-between;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    grid-template-columns: 1fr;
  }
  
  .main-dashboard-content {
    padding-bottom: 5rem;
  }
}

/* Print Styles */
@media print {
  .glass-header,
  .mobile-nav,
  .action-buttons,
  .refresh-btn,
  .theme-toggle,
  .notifications-btn,
  .user-profile-btn {
    display: none !important;
  }
  
  .sky-background {
    background: white !important;
  }
  
  .clouds, .celestial-body, .stars {
    display: none !important;
  }
  
  .dashboard-container {
    background: white !important;
  }
  
  .stat-card, .section-card {
    break-inside: avoid;
    page-break-inside: avoid;
    border: 1px solid #e5e7eb !important;
    background: white !important;
  }
}
</style>