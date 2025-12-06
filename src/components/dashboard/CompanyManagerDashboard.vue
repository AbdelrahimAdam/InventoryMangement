<template>
  <div class="sky-background">
    <!-- Animated Background Elements -->
    <div class="clouds">
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
    </div>

    <div class="celestial-body" :class="{ 'moon-mode': isDarkMode }">
      <div class="sun" v-if="!isDarkMode"></div>
      <div class="moon" v-else>
        <div class="moon-crater"></div>
        <div class="moon-crater small"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="dashboard-container">
      <!-- Desktop Header -->
      <header class="glass-header">
        <div class="header-content">
          <!-- Logo -->
          <router-link to="/" class="logo-container">
            <div class="logo-icon" style="background: linear-gradient(135deg, #10b981 0%, #047857 100%);">
              <span class="logo-text">م</span>
            </div>
            <div class="logo-text-container">
              <h1 class="logo-title">لوحة التقارير والمشاهدات</h1>
              <p class="logo-subtitle">مدير الشركة - وضع العرض فقط</p>
            </div>
          </router-link>

          <!-- User Controls -->
          <div class="user-controls">
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

            <!-- Export Menu -->
            <div class="export-menu">
              <button @click="toggleExportMenu" class="export-btn">
                <svg class="export-icon" viewBox="0 0 24 24">
                  <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                        fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
                تصدير
              </button>
              <div v-if="showExportMenu" class="export-dropdown">
                <button @click="exportToExcel" class="export-option">
                  <svg class="option-icon" viewBox="0 0 24 24">
                    <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                          fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  تصدير Excel
                </button>
                <button @click="exportToCSV" class="export-option">
                  <svg class="option-icon" viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                          fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  تصدير CSV
                </button>
                <button @click="printReport" class="export-option">
                  <svg class="option-icon" viewBox="0 0 24 24">
                    <path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" 
                          fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  طباعة التقرير
                </button>
              </div>
            </div>

            <!-- User Profile -->
            <div class="user-profile-container">
              <div class="user-profile-btn">
                <div class="user-avatar" style="background: linear-gradient(135deg, #10b981 0%, #047857 100%);">
                  {{ getUserInitials(userName) }}
                </div>
                <div class="user-info">
                  <p class="user-name">{{ userName }}</p>
                  <p class="user-role">مدير الشركة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Read-Only Notice -->
      <div class="readonly-notice">
        <div class="notice-content">
          <svg class="notice-icon" viewBox="0 0 24 24">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
          <div class="notice-text">
            <h3>وضع العرض فقط</h3>
            <p>لديك صلاحية عرض البيانات والتقارير فقط. يرجى التواصل مع المشرف العام لتعديل الصلاحيات.</p>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Content -->
      <div class="main-dashboard-content">
        <!-- Stats Grid - 4 Modern Cards -->
        <div class="stats-grid">
          <!-- Total Items Card -->
          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
                      fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="stat-content">
              <h3 class="stat-title">إجمالي الأصناف</h3>
              <p class="stat-value">{{ formatNumber(dashboardStats.totalItems) }}</p>
              <p class="stat-description">صنف في النظام</p>
            </div>
            <div class="stat-trend">
              <span class="trend-up">+{{ formatNumber(recentStats.totalItemsAdded) }} هذا الشهر</span>
            </div>
          </div>

          <!-- Total Quantity Card -->
          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                      fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="stat-content">
              <h3 class="stat-title">إجمالي الكمية</h3>
              <p class="stat-value">{{ formatNumber(dashboardStats.totalQuantity) }}</p>
              <p class="stat-description">وحدة متاحة</p>
            </div>
            <div class="stat-trend">
              <span class="trend-up">+{{ formatNumber(recentStats.quantityAdded) }} هذا الشهر</span>
            </div>
          </div>

          <!-- Low Stock Card -->
          <div class="stat-card warning">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                      fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="stat-content">
              <h3 class="stat-title">أصناف منخفضة</h3>
              <p class="stat-value">{{ formatNumber(dashboardStats.lowStockItems) }}</p>
              <p class="stat-description">أقل من 10 وحدات</p>
            </div>
            <div class="stat-trend">
              <span class="trend-down">{{ formatNumber(recentStats.lowStockChange) }} تغيير</span>
            </div>
          </div>

          <!-- Inventory Value Card -->
          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                      fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="stat-content">
              <h3 class="stat-title">قيمة المخزون</h3>
              <p class="stat-value">{{ formatCurrency(dashboardStats.estimatedValue) }}</p>
              <p class="stat-description">جنيه مصري</p>
            </div>
            <div class="stat-trend">
              <span class="trend-up">+{{ formatCurrency(recentStats.valueChange) }} هذا الشهر</span>
            </div>
          </div>
        </div>

        <!-- Filters Section -->
        <div class="filters-section">
          <div class="filter-card">
            <h3>تصفية البيانات</h3>
            <div class="filter-grid">
              <div class="filter-group">
                <label>المخزن</label>
                <select v-model="filters.warehouse" class="filter-select">
                  <option value="">جميع المخازن</option>
                  <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
                    {{ warehouse.name_ar }}
                  </option>
                </select>
              </div>
              <div class="filter-group">
                <label>حالة المخزون</label>
                <select v-model="filters.stockStatus" class="filter-select">
                  <option value="">الكل</option>
                  <option value="low">منخفض (أقل من 10)</option>
                  <option value="critical">حرج (أقل من 5)</option>
                  <option value="out">نفذ من المخزون</option>
                </select>
              </div>
              <div class="filter-group">
                <label>تاريخ التحديث</label>
                <select v-model="filters.updatePeriod" class="filter-select">
                  <option value="">الكل</option>
                  <option value="today">اليوم</option>
                  <option value="week">آخر أسبوع</option>
                  <option value="month">آخر شهر</option>
                </select>
              </div>
              <div class="filter-group">
                <label>بحث</label>
                <div class="search-wrapper">
                  <input type="text" v-model="filters.search" placeholder="ابحث عن صنف..." class="search-input">
                  <svg class="search-icon" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                          fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Warehouse Distribution -->
        <div class="warehouse-distribution-section">
          <div class="section-card">
            <div class="section-header">
              <h3>توزيع المخزون على المخازن</h3>
              <div class="section-actions">
                <button @click="refreshData" class="action-btn small" :disabled="loading">
                  <svg :class="{'animate-spin': loading}" class="action-icon" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  تحديث
                </button>
              </div>
            </div>
            <div class="warehouse-chart">
              <div class="chart-container">
                <div class="chart-bars">
                  <div v-for="warehouse in warehouseDistribution" :key="warehouse.id" class="chart-bar-wrapper">
                    <div class="chart-bar-label">{{ warehouse.name }}</div>
                    <div class="chart-bar">
                      <div class="bar-fill" :style="{ height: `${warehouse.percentage}%` }"></div>
                    </div>
                    <div class="chart-bar-value">{{ warehouse.percentage }}%</div>
                  </div>
                </div>
                <div class="chart-legend">
                  <div class="legend-item">
                    <span class="legend-color" style="background: #f59e0b"></span>
                    <span>نسبة الأصناف</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Inventory Table -->
        <div class="inventory-section">
          <div class="section-card">
            <div class="section-header">
              <div class="header-left">
                <h3>المخزون الحالي</h3>
                <p class="section-subtitle">عرض {{ filteredInventory.length }} من {{ totalItems }} صنف</p>
              </div>
              <div class="header-right">
                <div class="summary-stats">
                  <div class="summary-stat">
                    <span class="stat-label">متوسط الكمية</span>
                    <span class="stat-value">{{ formatNumber(averageQuantity) }}</span>
                  </div>
                  <div class="summary-stat">
                    <span class="stat-label">أصناف محدثة</span>
                    <span class="stat-value">{{ recentlyUpdated }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="loading" class="loading-state">
              <div class="spinner"></div>
              <p>جاري تحميل بيانات المخزون...</p>
            </div>
            
            <div v-else-if="filteredInventory.length === 0" class="empty-state">
              <svg class="empty-icon" viewBox="0 0 24 24">
                <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" 
                      fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
              <h4>لا توجد بيانات</h4>
              <p>لم يتم العثور على أصناف تطابق معايير البحث.</p>
              <button @click="clearFilters" class="clear-filters-btn">مسح الفلاتر</button>
            </div>
            
            <div v-else class="inventory-table-container">
              <div class="table-responsive">
                <table class="inventory-table">
                  <thead>
                    <tr>
                      <th>الكود</th>
                      <th>الاسم</th>
                      <th>اللون</th>
                      <th>المخزن</th>
                      <th>المورد</th>
                      <th>الكمية</th>
                      <th>آخر تحديث</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in paginatedItems" :key="item.id">
                      <td>{{ item.code }}</td>
                      <td>{{ item.name }}</td>
                      <td>
                        <span class="color-badge" :style="{ background: getColorHex(item.color) }">
                          {{ item.color }}
                        </span>
                      </td>
                      <td>{{ getWarehouseName(item.warehouse_id) }}</td>
                      <td>{{ item.supplier || '-' }}</td>
                      <td>
                        <span :class="getQuantityClass(item.remaining_quantity)">
                          {{ formatNumber(item.remaining_quantity) }}
                        </span>
                      </td>
                      <td>{{ formatDate(item.updated_at) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Pagination -->
              <div class="pagination">
                <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">
                  <svg class="pagination-icon" viewBox="0 0 24 24">
                    <path d="M15 19l-7-7 7-7" fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
                <span class="pagination-info">صفحة {{ currentPage }} من {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">
                  <svg class="pagination-icon" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Bottom Navigation -->
        <div class="mobile-nav" v-if="isMobile">
          <router-link to="/dashboard" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span>الرئيسية</span>
          </router-link>
          
          <router-link to="/reports" class="nav-item active">
            <svg class="nav-icon" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <span>التقارير</span>
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
  name: 'CompanyManagerDashboard',
  
  setup() {
    const store = useStore();
    const router = useRouter();
    
    // State
    const isDarkMode = ref(false);
    const loading = ref(false);
    const showExportMenu = ref(false);
    const currentPage = ref(1);
    const itemsPerPage = 10;
    
    // Filters
    const filters = ref({
      warehouse: '',
      search: '',
      stockStatus: '',
      updatePeriod: ''
    });
    
    // Computed properties
    const userRole = computed(() => store.getters.userRole);
    const userName = computed(() => store.getters.userName);
    const dashboardStats = computed(() => store.getters.dashboardStats);
    const inventory = computed(() => store.state.inventory || []);
    const warehouses = computed(() => store.state.warehouses || []);
    
    // Mock recent stats
    const recentStats = ref({
      totalItemsAdded: 24,
      quantityAdded: 150,
      lowStockChange: -3,
      valueChange: 12500
    });
    
    // Filtered inventory
    const filteredInventory = computed(() => {
      let items = [...inventory.value];
      
      // Apply warehouse filter
      if (filters.value.warehouse) {
        items = items.filter(item => item.warehouse_id === filters.value.warehouse);
      }
      
      // Apply search filter
      if (filters.value.search) {
        const searchLower = filters.value.search.toLowerCase();
        items = items.filter(item => 
          (item.name || '').toLowerCase().includes(searchLower) ||
          (item.code || '').toLowerCase().includes(searchLower) ||
          (item.color || '').toLowerCase().includes(searchLower) ||
          (item.supplier || '').toLowerCase().includes(searchLower)
        );
      }
      
      // Apply stock status filter
      if (filters.value.stockStatus === 'low') {
        items = items.filter(item => (item.remaining_quantity || 0) < 10 && (item.remaining_quantity || 0) > 0);
      } else if (filters.value.stockStatus === 'critical') {
        items = items.filter(item => (item.remaining_quantity || 0) < 5 && (item.remaining_quantity || 0) > 0);
      } else if (filters.value.stockStatus === 'out') {
        items = items.filter(item => (item.remaining_quantity || 0) === 0);
      }
      
      // Apply update period filter
      if (filters.value.updatePeriod) {
        const now = new Date();
        let cutoffDate = new Date();
        
        if (filters.value.updatePeriod === 'today') {
          cutoffDate.setDate(now.getDate() - 1);
        } else if (filters.value.updatePeriod === 'week') {
          cutoffDate.setDate(now.getDate() - 7);
        } else if (filters.value.updatePeriod === 'month') {
          cutoffDate.setMonth(now.getMonth() - 1);
        }
        
        items = items.filter(item => {
          const updatedDate = new Date(item.updated_at || item.created_at);
          return updatedDate >= cutoffDate;
        });
      }
      
      return items;
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
            items: 0,
            quantity: 0
          };
        }
        distribution[warehouseId].items++;
        distribution[warehouseId].quantity += item.remaining_quantity || 0;
      });
      
      const totalItems = inventory.value.length;
      
      return Object.values(distribution)
        .map(warehouse => ({
          ...warehouse,
          percentage: totalItems > 0 ? Math.round((warehouse.items / totalItems) * 100) : 0
        }))
        .sort((a, b) => b.items - a.items)
        .slice(0, 5);
    });
    
    // Statistics
    const totalItems = computed(() => inventory.value.length);
    const averageQuantity = computed(() => {
      if (filteredInventory.value.length === 0) return 0;
      const total = filteredInventory.value.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0);
      return Math.round(total / filteredInventory.value.length);
    });
    
    const recentlyUpdated = computed(() => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return filteredInventory.value.filter(item => {
        const updatedDate = new Date(item.updated_at || item.created_at);
        return updatedDate >= weekAgo;
      }).length;
    });
    
    // Pagination
    const totalPages = computed(() => Math.ceil(filteredInventory.value.length / itemsPerPage));
    
    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredInventory.value.slice(start, end);
    });
    
    // Check if mobile
    const isMobile = computed(() => window.innerWidth < 768);
    
    // Methods
    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
      document.documentElement.classList.toggle('dark', isDarkMode.value);
      localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
    };
    
    const toggleExportMenu = () => {
      showExportMenu.value = !showExportMenu.value;
    };
    
    const refreshData = async () => {
      loading.value = true;
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error refreshing data:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const exportToExcel = () => {
      console.log('Exporting to Excel...');
      showExportMenu.value = false;
    };
    
    const exportToCSV = () => {
      console.log('Exporting to CSV...');
      showExportMenu.value = false;
    };
    
    const printReport = () => {
      window.print();
      showExportMenu.value = false;
    };
    
    const clearFilters = () => {
      filters.value = {
        warehouse: '',
        search: '',
        stockStatus: '',
        updatePeriod: ''
      };
      currentPage.value = 1;
    };
    
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };
    
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };
    
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
    
    const formatDate = (date) => {
      if (!date) return '';
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString('ar-EG');
    };
    
    const getWarehouseName = (warehouseId) => {
      const warehouse = warehouses.value.find(w => w.id === warehouseId);
      return warehouse ? warehouse.name_ar : warehouseId;
    };
    
    const getColorHex = (colorName) => {
      const colors = {
        'أحمر': '#ef4444',
        'أزرق': '#3b82f6',
        'أخضر': '#10b981',
        'أصفر': '#f59e0b',
        'أسود': '#000000',
        'أبيض': '#ffffff',
        'رمادي': '#6b7280',
        'بنفسجي': '#8b5cf6'
      };
      return colors[colorName] || '#6b7280';
    };
    
    const getQuantityClass = (quantity) => {
      if (quantity === 0) return 'quantity-out';
      if (quantity < 5) return 'quantity-critical';
      if (quantity < 10) return 'quantity-low';
      return 'quantity-normal';
    };
    
    const getUserInitials = (name) => {
      if (!name) return '??';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };
    
    // Lifecycle
    onMounted(() => {
      // Check theme
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDarkMode.value = true;
        document.documentElement.classList.add('dark');
      }
    });
    
    // Close export menu when clicking outside
    onMounted(() => {
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.export-menu')) {
          showExportMenu.value = false;
        }
      });
    });
    
    return {
      // State
      isDarkMode,
      loading,
      showExportMenu,
      currentPage,
      filters,
      
      // Computed
      userRole,
      userName,
      dashboardStats,
      inventory,
      warehouses,
      recentStats,
      filteredInventory,
      warehouseDistribution,
      totalItems,
      averageQuantity,
      recentlyUpdated,
      totalPages,
      paginatedItems,
      isMobile,
      
      // Methods
      toggleDarkMode,
      toggleExportMenu,
      refreshData,
      exportToExcel,
      exportToCSV,
      printReport,
      clearFilters,
      prevPage,
      nextPage,
      formatNumber,
      formatCurrency,
      formatDate,
      getWarehouseName,
      getColorHex,
      getQuantityClass,
      getUserInitials
    };
  }
};
</script>

<style scoped>
/* Import base styles from first dashboard */
/* Only unique styles are shown here */

/* Read-Only Notice */
.readonly-notice {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 12px;
  margin: 1.5rem auto;
  max-width: 1400px;
  padding: 1rem;
}

.dark .readonly-notice {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.notice-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.notice-icon {
  width: 24px;
  height: 24px;
  color: #f59e0b;
  flex-shrink: 0;
  margin-top: 2px;
}

.notice-text h3 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .notice-text h3 {
  color: #f3f4f6;
}

.notice-text p {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .notice-text p {
  color: #9ca3af;
}

/* Export Menu */
.export-menu {
  position: relative;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #10b981 0%, #047857 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.export-icon {
  width: 16px;
  height: 16px;
}

.export-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 180px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  z-index: 1000;
  overflow: hidden;
}

.dark .export-dropdown {
  background: #1f2937;
  border-color: #374151;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.export-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  width: 100%;
  background: none;
  border: none;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  font-size: 0.875rem;
  color: #1f2937;
  transition: background-color 0.2s;
}

.dark .export-option {
  color: #f3f4f6;
  border-bottom-color: #374151;
}

.export-option:last-child {
  border-bottom: none;
}

.export-option:hover {
  background: #f9fafb;
}

.dark .export-option:hover {
  background: #374151;
}

.option-icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
}

.dark .option-icon {
  color: #9ca3af;
}

/* Stats Grid */
.stat-trend {
  margin-top: 0.5rem;
}

.trend-up, .trend-down {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

.trend-up {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.trend-down {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

/* Filters Section */
.filters-section {
  margin-bottom: 2rem;
}

.filter-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
}

.dark .filter-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.filter-card h3 {
  margin: 0 0 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .filter-card h3 {
  color: #f3f4f6;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.dark .filter-group label {
  color: #9ca3af;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  color: #1f2937;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .filter-select {
  background: #374151;
  border-color: #4b5563;
  color: #f3f4f6;
}

.filter-select:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.search-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  color: #1f2937;
  transition: all 0.2s;
}

.dark .search-input {
  background: #374151;
  border-color: #4b5563;
  color: #f3f4f6;
}

.search-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.search-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #6b7280;
  pointer-events: none;
}

.dark .search-icon {
  color: #9ca3af;
}

/* Warehouse Chart */
.warehouse-chart {
  margin-top: 1.5rem;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  height: 200px;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .chart-bars {
  border-bottom-color: #374151;
}

.chart-bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.chart-bar-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
}

.dark .chart-bar-label {
  color: #9ca3af;
}

.chart-bar {
  width: 40px;
  height: 150px;
  background: #f3f4f6;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.dark .chart-bar {
  background: #374151;
}

.bar-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, #f59e0b, #fbbf24);
  border-radius: 4px 4px 0 0;
  transition: height 1s ease;
}

.chart-bar-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .chart-bar-value {
  color: #f3f4f6;
}

.chart-legend {
  display: flex;
  justify-content: center;
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

.legend-item span {
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .legend-item span {
  color: #9ca3af;
}

/* Section Actions */
.section-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn.small {
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

.action-btn.small:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.action-btn.small:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-icon {
  width: 16px;
  height: 16px;
}

/* Summary Stats */
.summary-stats {
  display: flex;
  gap: 1.5rem;
}

.summary-stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
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

/* Inventory Table */
.inventory-table-container {
  margin-top: 1.5rem;
}

.table-responsive {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.dark .table-responsive {
  border-color: #374151;
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.inventory-table thead {
  background: #f9fafb;
}

.dark .inventory-table thead {
  background: #374151;
}

.inventory-table th {
  padding: 1rem;
  text-align: right;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.dark .inventory-table th {
  color: #9ca3af;
  border-bottom-color: #374151;
}

.inventory-table td {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
}

.dark .inventory-table td {
  color: #f3f4f6;
  border-bottom-color: #374151;
}

.inventory-table tbody tr:hover {
  background: #f9fafb;
}

.dark .inventory-table tbody tr:hover {
  background: #374151;
}

.inventory-table tbody tr:last-child td {
  border-bottom: none;
}

/* Color Badge */
.color-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  min-width: 60px;
  text-align: center;
}

/* Quantity Classes */
.quantity-normal {
  color: #10b981;
  font-weight: 600;
}

.quantity-low {
  color: #f59e0b;
  font-weight: 600;
}

.quantity-critical {
  color: #ef4444;
  font-weight: 600;
}

.quantity-out {
  color: #6b7280;
  font-weight: 600;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .pagination-btn {
  background: #1f2937;
  border-color: #374151;
  color: #9ca3af;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #10b981;
  color: #10b981;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-icon {
  width: 16px;
  height: 16px;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .pagination-info {
  color: #9ca3af;
}

/* Clear Filters Button */
.clear-filters-btn {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-filters-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .filter-grid {
    grid-template-columns: 1fr;
  }
  
  .summary-stats {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .chart-bars {
    gap: 0.5rem;
  }
  
  .chart-bar {
    width: 30px;
  }
  
  .inventory-table {
    font-size: 0.75rem;
  }
  
  .inventory-table th,
  .inventory-table td {
    padding: 0.75rem 0.5rem;
  }
}

/* Print Styles */
@media print {
  .glass-header,
  .mobile-nav,
  .export-menu,
  .section-actions,
  .pagination,
  .clear-filters-btn {
    display: none !important;
  }
  
  .readonly-notice {
    border: 1px solid #e5e7eb !important;
  }
  
  .filter-card {
    break-inside: avoid;
    page-break-inside: avoid;
  }
  
  .inventory-table {
    border: 1px solid #e5e7eb !important;
  }
}
</style>