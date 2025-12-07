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
      </div>
    </div>

    <!-- Main Content -->
    <div class="dashboard-container">
      <!-- Desktop Header -->
      <header class="glass-header">
        <div class="header-content">
          <!-- Logo -->
          <router-link to="/" class="logo-container">
            <div class="logo-icon" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);">
              <span class="logo-text">م</span>
            </div>
            <div class="logo-text-container">
              <h1 class="logo-title">إدارة المخزون</h1>
              <p class="logo-subtitle">مدير المخازن - صلاحيات محدودة</p>
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

            <!-- Notifications -->
            <div class="notifications-container">
              <button @click="toggleNotifications" class="notifications-btn" :class="{ 'has-notifications': lowStockCount > 0 }">
                <svg class="bell-icon" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" 
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span v-if="lowStockCount > 0" class="notification-badge">
                  {{ lowStockCount > 9 ? '9+' : lowStockCount }}
                </span>
              </button>
            </div>

            <!-- User Profile -->
            <div class="user-profile-container">
              <button @click="toggleUserMenu" class="user-profile-btn">
                <div class="user-avatar" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);">
                  {{ getUserInitials(userName) }}
                </div>
                <div class="user-info">
                  <p class="user-name">{{ userName }}</p>
                  <p class="user-role">مدير المخازن</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Warehouse Info Banner -->
      <div class="warehouse-banner">
        <div class="banner-content">
          <div class="warehouse-info">
            <svg class="warehouse-icon" viewBox="0 0 24 24">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                    fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
            <div>
              <h3>المخازن المسموحة لك</h3>
              <div class="warehouse-tags">
                <span v-for="warehouse in allowedWarehouses" :key="warehouse.id" class="warehouse-tag">
                  {{ warehouse.name }}
                </span>
                <span v-if="allowedWarehouses.length === 0" class="no-warehouses">
                  لا توجد مخازن مسموحة
                </span>
              </div>
            </div>
          </div>
          <div class="permission-info">
            <span class="permission-badge">
              <svg class="badge-icon" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                      fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
              صلاحيات محدودة
            </span>
            <button @click="refreshData" class="refresh-btn small" :disabled="loading">
              <svg :class="{'animate-spin': loading}" class="refresh-icon" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              تحديث
            </button>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Content -->
      <div class="main-dashboard-content">
        <!-- Stats Grid - 4 Modern Cards -->
        <div class="stats-grid">
          <!-- My Warehouse Items -->
          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
                      fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="stat-content">
              <h3 class="stat-title">أصناف مخازني</h3>
              <p class="stat-value">{{ formatNumber(myWarehouseStats.totalItems) }}</p>
              <p class="stat-description">في {{ myWarehouseStats.warehouseCount }} مخزن</p>
            </div>
            <div class="stat-trend">
              <span class="trend-up">+{{ myWarehouseStats.recentAdded }} اليوم</span>
            </div>
          </div>

          <!-- My Warehouse Quantity -->
          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                      fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="stat-content">
              <h3 class="stat-title">إجمالي الكمية</h3>
              <p class="stat-value">{{ formatNumber(myWarehouseStats.totalQuantity) }}</p>
              <p class="stat-description">وحدة متاحة</p>
            </div>
            <div class="stat-trend">
              <span class="trend-up">+{{ myWarehouseStats.recentQuantity }} اليوم</span>
            </div>
          </div>

          <!-- Low Stock in My Warehouses -->
          <div class="stat-card warning">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                      fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="stat-content">
              <h3 class="stat-title">منخفضة المخزون</h3>
              <p class="stat-value">{{ formatNumber(myWarehouseStats.lowStockItems) }}</p>
              <p class="stat-description">تحتاج إعادة تعبئة</p>
            </div>
            <div class="stat-trend">
              <span class="trend-down">{{ myWarehouseStats.lowStockChange }} تغيير</span>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                      fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="stat-content">
              <h3 class="stat-title">نشاطي اليوم</h3>
              <p class="stat-value">{{ formatNumber(myWarehouseStats.todayTransactions) }}</p>
              <p class="stat-description">عملية تمت</p>
            </div>
            <div class="stat-trend">
              <span class="trend-up">+{{ myWarehouseStats.transactionChange }}%</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions-section">
          <h3>إجراءات سريعة</h3>
          <div class="action-buttons">
            <button @click="openAddItemModal" class="action-btn primary" :disabled="!canModifyItems">
              <div class="action-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 4v16m8-8H4" fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <span>إضافة صنف جديد</span>
              <span class="action-badge" v-if="!canModifyItems">غير مسموح</span>
            </button>

            <button @click="openTransferModal" class="action-btn secondary" :disabled="!canModifyItems">
              <div class="action-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <span>نقل بين المخازن</span>
              <span class="action-badge" v-if="!canModifyItems">غير مسموح</span>
            </button>

            <button @click="openDispatchModal" class="action-btn warning" :disabled="!canDispatch">
              <div class="action-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m6 4l4-4m0 0l4 4m-4-4v12" fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <span>صرف إلى خارجي</span>
              <span class="action-badge" v-if="!canDispatch">غير مسموح</span>
            </button>

            <button @click="exportMyData" class="action-btn info">
              <div class="action-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                        fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <span>تصدير بياناتي</span>
            </button>
          </div>
        </div>

        <!-- My Warehouses Section -->
        <div class="my-warehouses-section">
          <div class="section-card">
            <div class="section-header">
              <h3>مخازني</h3>
              <div class="warehouse-selector">
                <select v-model="selectedWarehouse" class="warehouse-select">
                  <option value="">جميع المخازن</option>
                  <option v-for="warehouse in allowedWarehouses" :key="warehouse.id" :value="warehouse.id">
                    {{ warehouse.name }}
                  </option>
                </select>
              </div>
            </div>
            
            <div v-if="allowedWarehouses.length === 0" class="empty-state">
              <svg class="empty-icon" viewBox="0 0 24 24">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                      fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
              <h4>لا توجد مخازن مسموحة</h4>
              <p>يرجى التواصل مع المشرف العام لإضافة مخازن إلى صلاحياتك.</p>
            </div>
            
            <div v-else class="warehouses-grid">
              <div v-for="warehouse in warehouseDetails" :key="warehouse.id" 
                   class="warehouse-card" :class="{ 'selected': selectedWarehouse === warehouse.id }"
                   @click="selectWarehouse(warehouse.id)">
                <div class="warehouse-header">
                  <div class="warehouse-icon">
                    <span>{{ warehouse.name.charAt(0) }}</span>
                  </div>
                  <div class="warehouse-status" :class="warehouse.status"></div>
                </div>
                <div class="warehouse-content">
                  <h4>{{ warehouse.name }}</h4>
                  <div class="warehouse-stats">
                    <div class="stat">
                      <span class="stat-label">الأصناف</span>
                      <span class="stat-value">{{ warehouse.itemsCount }}</span>
                    </div>
                    <div class="stat">
                      <span class="stat-label">الكمية</span>
                      <span class="stat-value">{{ formatNumber(warehouse.totalQuantity) }}</span>
                    </div>
                  </div>
                  <div class="warehouse-progress">
                    <div class="progress-label">نسبة الإشغال</div>
                    <div class="progress-bar">
                      <div class="progress-fill" :style="{ width: `${warehouse.fillPercentage}%` }"></div>
                    </div>
                    <div class="progress-value">{{ warehouse.fillPercentage }}%</div>
                  </div>
                </div>
                <div class="warehouse-actions">
                  <button @click.stop="viewWarehouseItems(warehouse.id)" class="view-btn">
                    <svg class="view-icon" viewBox="0 0 24 24">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" fill="none" stroke="currentColor" stroke-width="2"/>
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                            fill="none" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    عرض
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- My Inventory -->
        <div class="inventory-section">
          <div class="section-card">
            <div class="section-header">
              <div class="header-left">
                <h3>مخزوني</h3>
                <p class="section-subtitle" v-if="selectedWarehouse">
                  {{ getWarehouseName(selectedWarehouse) }}
                </p>
                <p class="section-subtitle" v-else>
                  جميع المخازن المسموحة
                </p>
              </div>
              <div class="header-right">
                <div class="search-box">
                  <input type="text" v-model="searchTerm" placeholder="ابحث في المخزون..." class="search-input">
                  <svg class="search-icon" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                          fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <div class="inventory-summary">
                  <span class="summary-item">
                    <span class="summary-label">عرض</span>
                    <span class="summary-value">{{ filteredInventory.length }}</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div v-if="loading" class="loading-state">
              <div class="spinner"></div>
              <p>جاري تحميل المخزون...</p>
            </div>
            
            <div v-else-if="filteredInventory.length === 0" class="empty-state">
              <svg class="empty-icon" viewBox="0 0 24 24">
                <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" 
                      fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
              <h4>لا توجد أصناف</h4>
              <p v-if="searchTerm">لم يتم العثور على أصناف تطابق بحثك.</p>
              <p v-else>لا توجد أصناف في المخازن المسموحة لك.</p>
              <button v-if="canModifyItems" @click="openAddItemModal" class="add-item-btn">
                إضافة صنف جديد
              </button>
            </div>
            
            <div v-else class="inventory-grid">
              <div v-for="item in paginatedItems" :key="item.id" class="inventory-item-card">
                <div class="item-header">
                  <div class="item-code">{{ item.code }}</div>
                  <div class="item-status" :class="getItemStatus(item.remaining_quantity)">
                    {{ getItemStatusText(item.remaining_quantity) }}
                  </div>
                </div>
                <div class="item-content">
                  <h4 class="item-name">{{ item.name }}</h4>
                  <div class="item-details">
                    <div class="detail">
                      <span class="detail-label">اللون</span>
                      <span class="detail-value">{{ item.color }}</span>
                    </div>
                    <div class="detail">
                      <span class="detail-label">المورد</span>
                      <span class="detail-value">{{ item.supplier || '-' }}</span>
                    </div>
                    <div class="detail">
                      <span class="detail-label">الموقع</span>
                      <span class="detail-value">{{ item.item_location || '-' }}</span>
                    </div>
                  </div>
                  <div class="item-quantity">
                    <div class="quantity-info">
                      <span class="quantity-label">الكمية المتاحة</span>
                      <span class="quantity-value" :class="getQuantityClass(item.remaining_quantity)">
                        {{ formatNumber(item.remaining_quantity) }}
                      </span>
                    </div>
                    <div class="quantity-breakdown" v-if="showBreakdown">
                      <div class="breakdown-item">
                        <span class="breakdown-label">كرتون</span>
                        <span class="breakdown-value">{{ item.cartons_count || 0 }}</span>
                      </div>
                      <div class="breakdown-item">
                        <span class="breakdown-label">فردي</span>
                        <span class="breakdown-value">{{ item.single_bottles_count || 0 }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="item-actions">
                  <button @click="editItem(item)" class="action-btn small" :disabled="!canModifyItems">
                    <svg class="action-icon" viewBox="0 0 24 24">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" fill="none" stroke="currentColor" stroke-width="2"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" fill="none" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    تعديل
                  </button>
                  <button @click="transferItem(item)" class="action-btn small secondary" :disabled="!canModifyItems">
                    <svg class="action-icon" viewBox="0 0 24 24">
                      <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" fill="none" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    نقل
                  </button>
                  <button @click="dispatchItem(item)" class="action-btn small warning" :disabled="!canDispatch">
                    <svg class="action-icon" viewBox="0 0 24 24">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m6 4l4-4m0 0l4 4m-4-4v12" fill="none" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    صرف
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Pagination -->
            <div v-if="filteredInventory.length > itemsPerPage" class="pagination">
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

        <!-- Mobile Bottom Navigation -->
        <div class="mobile-nav" v-if="isMobile">
          <router-link to="/dashboard" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span>الرئيسية</span>
          </router-link>
          
          <router-link to="/inventory" class="nav-item active">
            <svg class="nav-icon" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"/>
            </svg>
            <span>مخزوني</span>
          </router-link>
          
          <router-link to="/transactions" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <span>حركاتي</span>
          </router-link>
          
          <router-link to="/profile" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span>حسابي</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'WarehouseManagerDashboard',
  
  setup() {
    const store = useStore();
    const router = useRouter();
    
    // State
    const isDarkMode = ref(false);
    const loading = ref(false);
    const selectedWarehouse = ref('');
    const searchTerm = ref('');
    const currentPage = ref(1);
    const itemsPerPage = 12;
    const showBreakdown = ref(false);
    
    // Computed properties
    const userRole = computed(() => store.getters.userRole);
    const userName = computed(() => store.getters.userName);
    const canModifyItems = computed(() => store.getters.canEdit);
    const canDispatch = computed(() => store.getters.canDispatch);
    const allowedWarehouseIds = computed(() => store.getters.allowedWarehouses);
    const inventory = computed(() => store.state.inventory || []);
    const warehouses = computed(() => store.state.warehouses || []);
    
    // Allowed warehouses for this user
    const allowedWarehouses = computed(() => {
      const allowedIds = allowedWarehouseIds.value;
      if (!allowedIds || allowedIds.length === 0) return [];
      
      if (allowedIds.includes('all')) {
        return warehouses.value;
      }
      
      return warehouses.value.filter(w => allowedIds.includes(w.id));
    });
    
    // My warehouse stats
    const myWarehouseStats = computed(() => {
      const myItems = filteredInventory.value;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const recentAdded = myItems.filter(item => {
        const addedDate = new Date(item.created_at || item.updated_at);
        return addedDate >= today;
      }).length;
      
      const recentQuantity = myItems
        .filter(item => {
          const addedDate = new Date(item.created_at || item.updated_at);
          return addedDate >= today;
        })
        .reduce((sum, item) => sum + (item.total_added || 0), 0);
      
      const lowStockItems = myItems.filter(item => (item.remaining_quantity || 0) < 10 && (item.remaining_quantity || 0) > 0).length;
      
      // Mock today transactions
      const todayTransactions = Math.floor(Math.random() * 10) + 5;
      
      return {
        totalItems: myItems.length,
        warehouseCount: allowedWarehouses.value.length,
        totalQuantity: myItems.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0),
        recentAdded,
        recentQuantity,
        lowStockItems,
        lowStockChange: -2,
        todayTransactions,
        transactionChange: 15
      };
    });
    
    // Low stock count for notifications
    const lowStockCount = computed(() => {
      return myWarehouseStats.value.lowStockItems;
    });
    
    // Warehouse details for cards
    const warehouseDetails = computed(() => {
      return allowedWarehouses.value.map(warehouse => {
        const warehouseItems = inventory.value.filter(item => item.warehouse_id === warehouse.id);
        const itemsCount = warehouseItems.length;
        const totalQuantity = warehouseItems.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0);
        
        // Calculate fill percentage based on capacity
        const capacity = warehouse.capacity || 100;
        const fillPercentage = Math.min(Math.round((itemsCount / capacity) * 100), 100);
        
        return {
          id: warehouse.id,
          name: warehouse.name_ar || warehouse.name,
          status: fillPercentage >= 80 ? 'high' : fillPercentage >= 50 ? 'medium' : 'low',
          itemsCount,
          totalQuantity,
          fillPercentage
        };
      });
    });
    
    // Filtered inventory based on selected warehouse and search
    const filteredInventory = computed(() => {
      let items = [...inventory.value];
      
      // Filter by allowed warehouses
      const allowedIds = allowedWarehouseIds.value;
      if (allowedIds && allowedIds.length > 0 && !allowedIds.includes('all')) {
        items = items.filter(item => allowedIds.includes(item.warehouse_id));
      }
      
      // Filter by selected warehouse
      if (selectedWarehouse.value) {
        items = items.filter(item => item.warehouse_id === selectedWarehouse.value);
      }
      
      // Apply search filter
      if (searchTerm.value.trim()) {
        const term = searchTerm.value.toLowerCase().trim();
        items = items.filter(item => 
          (item.name || '').toLowerCase().includes(term) ||
          (item.code || '').toLowerCase().includes(term) ||
          (item.color || '').toLowerCase().includes(term) ||
          (item.supplier || '').toLowerCase().includes(term) ||
          (item.item_location || '').toLowerCase().includes(term)
        );
      }
      
      return items;
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
    
    const toggleNotifications = () => {
      // Implement notifications toggle
    };
    
    const toggleUserMenu = () => {
      // Implement user menu toggle
    };
    
    const refreshData = async () => {
      loading.value = true;
      try {
        await store.dispatch('subscribeToInventory');
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Error refreshing data:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const selectWarehouse = (warehouseId) => {
      if (selectedWarehouse.value === warehouseId) {
        selectedWarehouse.value = '';
      } else {
        selectedWarehouse.value = warehouseId;
      }
      currentPage.value = 1;
    };
    
    const viewWarehouseItems = (warehouseId) => {
      selectedWarehouse.value = warehouseId;
      // Scroll to inventory section
      const inventorySection = document.querySelector('.inventory-section');
      if (inventorySection) {
        inventorySection.scrollIntoView({ behavior: 'smooth' });
      }
    };
    
    const openAddItemModal = () => {
      if (!canModifyItems.value) {
        alert('ليس لديك صلاحية لإضافة أصناف. يرجى التواصل مع المشرف العام.');
        return;
      }
      // Implement modal opening
      console.log('Opening add item modal');
    };
    
    const openTransferModal = () => {
      if (!canModifyItems.value) {
        alert('ليس لديك صلاحية لنقل الأصناف. يرجى التواصل مع المشرف العام.');
        return;
      }
      // Implement modal opening
      console.log('Opening transfer modal');
    };
    
    const openDispatchModal = () => {
      if (!canDispatch.value) {
        alert('ليس لديك صلاحية لصرف الأصناف. يرجى التواصل مع المشرف العام.');
        return;
      }
      // Implement modal opening
      console.log('Opening dispatch modal');
    };
    
    const editItem = (item) => {
      if (!canModifyItems.value) {
        alert('ليس لديك صلاحية لتعديل الأصناف. يرجى التواصل مع المشرف العام.');
        return;
      }
      console.log('Editing item:', item.id);
    };
    
    const transferItem = (item) => {
      if (!canModifyItems.value) {
        alert('ليس لديك صلاحية لنقل الأصناف. يرجى التواصل مع المشرف العام.');
        return;
      }
      console.log('Transferring item:', item.id);
    };
    
    const dispatchItem = (item) => {
      if (!canDispatch.value) {
        alert('ليس لديك صلاحية لصرف الأصناف. يرجى التواصل مع المشرف العام.');
        return;
      }
      console.log('Dispatching item:', item.id);
    };
    
    const exportMyData = () => {
      console.log('Exporting my data...');
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
    
    const getWarehouseName = (warehouseId) => {
      const warehouse = warehouses.value.find(w => w.id === warehouseId);
      return warehouse ? warehouse.name_ar : warehouseId;
    };
    
    const getItemStatus = (quantity) => {
      if (quantity === 0) return 'out';
      if (quantity < 5) return 'critical';
      if (quantity < 10) return 'low';
      return 'normal';
    };
    
    const getItemStatusText = (quantity) => {
      if (quantity === 0) return 'نفذ';
      if (quantity < 5) return 'حرج';
      if (quantity < 10) return 'منخفض';
      return 'طبيعي';
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
      
      // Load initial data
      refreshData();
    });
    
    return {
      // State
      isDarkMode,
      loading,
      selectedWarehouse,
      searchTerm,
      currentPage,
      showBreakdown,
      
      // Computed
      userRole,
      userName,
      canModifyItems,
      canDispatch,
      allowedWarehouses,
      myWarehouseStats,
      lowStockCount,
      warehouseDetails,
      filteredInventory,
      totalPages,
      paginatedItems,
      isMobile,
      
      // Methods
      toggleDarkMode,
      toggleNotifications,
      toggleUserMenu,
      refreshData,
      selectWarehouse,
      viewWarehouseItems,
      openAddItemModal,
      openTransferModal,
      openDispatchModal,
      editItem,
      transferItem,
      dispatchItem,
      exportMyData,
      prevPage,
      nextPage,
      formatNumber,
      getWarehouseName,
      getItemStatus,
      getItemStatusText,
      getQuantityClass,
      getUserInitials
    };
  }
};
</script>

<style scoped>
/* Import base styles from first dashboard */
/* Only unique styles are shown here */

/* Warehouse Banner */
.warehouse-banner {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  margin: 1.5rem auto;
  max-width: 1400px;
  padding: 1rem;
}

.dark .warehouse-banner {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.warehouse-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.warehouse-icon {
  width: 32px;
  height: 32px;
  color: #3b82f6;
  flex-shrink: 0;
}

.warehouse-info h3 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .warehouse-info h3 {
  color: #f3f4f6;
}

.warehouse-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.warehouse-tag {
  padding: 0.25rem 0.75rem;
  background: rgba(59, 130, 246, 0.1);
  color: #1d4ed8;
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
}

.no-warehouses {
  color: #6b7280;
  font-size: 0.875rem;
}

.dark .no-warehouses {
  color: #9ca3af;
}

.permission-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.permission-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  color: #1d4ed8;
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge-icon {
  width: 16px;
  height: 16px;
}

.refresh-btn.small {
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

.refresh-btn.small:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.refresh-btn.small:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Action Badge */
.action-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  border-radius: 10px;
}

/* My Warehouses Section */
.warehouse-selector {
  min-width: 200px;
}

.warehouse-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  color: #1f2937;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .warehouse-select {
  background: #374151;
  border-color: #4b5563;
  color: #f3f4f6;
}

.warehouse-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.warehouses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.warehouse-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dark .warehouse-card {
  background: rgba(15, 23, 42, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.warehouse-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.dark .warehouse-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.warehouse-card.selected {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

.dark .warehouse-card.selected {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.warehouse-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.warehouse-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
}

.warehouse-status {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.warehouse-status.high {
  background: #ef4444;
}

.warehouse-status.medium {
  background: #f59e0b;
}

.warehouse-status.low {
  background: #10b981;
}

.warehouse-content h4 {
  margin: 0 0 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .warehouse-content h4 {
  color: #f3f4f6;
}

.warehouse-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .stat-label {
  color: #9ca3af;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .stat-value {
  color: #f3f4f6;
}

.warehouse-progress {
  margin-bottom: 1.5rem;
}

.progress-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.dark .progress-label {
  color: #9ca3af;
}

.progress-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.dark .progress-bar {
  background: #374151;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 4px;
  transition: width 1s ease;
}

.progress-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  text-align: right;
}

.dark .progress-value {
  color: #f3f4f6;
}

.warehouse-actions {
  display: flex;
  justify-content: flex-end;
}

.view-btn {
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

.view-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.view-icon {
  width: 16px;
  height: 16px;
}

/* Inventory Grid */
.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.inventory-item-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.dark .inventory-item-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.inventory-item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.dark .inventory-item-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.item-code {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
}

.dark .item-code {
  color: #9ca3af;
  background: #374151;
}

.item-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.item-status.out {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.item-status.critical {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.item-status.low {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.item-status.normal {
  background: rgba(16, 185, 129, 0.1);
  color: #047857;
}

.item-content h4 {
  margin: 0 0 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
}

.dark .item-content h4 {
  color: #f3f4f6;
}

.item-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .detail-label {
  color: #9ca3af;
}

.detail-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
}

.dark .detail-value {
  color: #f3f4f6;
}

.item-quantity {
  margin-bottom: 1.5rem;
}

.quantity-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.quantity-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .quantity-label {
  color: #9ca3af;
}

.quantity-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.quantity-normal {
  color: #10b981;
}

.quantity-low {
  color: #f59e0b;
}

.quantity-critical {
  color: #ef4444;
}

.quantity-out {
  color: #6b7280;
}

.quantity-breakdown {
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
}

.dark .quantity-breakdown {
  background: #374151;
}

.breakdown-item {
  flex: 1;
  text-align: center;
}

.breakdown-label {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.dark .breakdown-label {
  color: #9ca3af;
}

.breakdown-value {
  display: block;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .breakdown-value {
  color: #f3f4f6;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn.small {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.small:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.small:not(:disabled):hover {
  transform: translateY(-2px);
}

.action-btn.small.primary {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.action-btn.small.primary:not(:disabled):hover {
  background: rgba(245, 158, 11, 0.2);
}

.action-btn.small.secondary {
  background: rgba(16, 185, 129, 0.1);
  color: #047857;
}

.action-btn.small.secondary:not(:disabled):hover {
  background: rgba(16, 185, 129, 0.2);
}

.action-btn.small.warning {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.action-btn.small.warning:not(:disabled):hover {
  background: rgba(239, 68, 68, 0.2);
}

.action-icon {
  width: 14px;
  height: 14px;
}

/* Search Box */
.search-box {
  position: relative;
  width: 250px;
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
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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

/* Inventory Summary */
.inventory-summary {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border-radius: 8px;
}

.dark .summary-item {
  background: #374151;
}

.summary-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .summary-label {
  color: #9ca3af;
}

.summary-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .summary-value {
  color: #f3f4f6;
}

/* Add Item Button */
.add-item-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-item-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .banner-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .permission-info {
    width: 100%;
    justify-content: space-between;
  }
  
  .warehouses-grid {
    grid-template-columns: 1fr;
  }
  
  .inventory-grid {
    grid-template-columns: 1fr;
  }
  
  .header-right {
    flex-direction: column;
    gap: 1rem;
  }
  
  .search-box {
    width: 100%;
  }
}

/* Print Styles */
@media print {
  .glass-header,
  .mobile-nav,
  .warehouse-banner,
  .quick-actions-section,
  .item-actions,
  .pagination,
  .add-item-btn {
    display: none !important;
  }
  
  .inventory-item-card {
    break-inside: avoid;
    page-break-inside: avoid;
    border: 1px solid #e5e7eb !important;
  }
  
  .warehouse-card {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
</style>