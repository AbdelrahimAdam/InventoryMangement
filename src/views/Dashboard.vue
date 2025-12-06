<template>
  <div class="sky-background">
    <!-- Animated Clouds -->
    <div class="clouds">
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
      <div class="cloud cloud-3"></div>
      <div class="cloud cloud-4"></div>
    </div>

    <!-- Floating Sun/Moon -->
    <div class="celestial-body" :class="{ 'moon-mode': isDarkMode }">
      <div class="sun" v-if="!isDarkMode"></div>
      <div class="moon" v-else>
        <div class="moon-crater"></div>
        <div class="moon-crater small"></div>
        <div class="moon-crater"></div>
      </div>
    </div>

    <!-- Stars for night mode -->
    <div v-if="isDarkMode" class="stars">
      <div v-for="n in 50" :key="n" class="star" :style="{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${1 + Math.random() * 2}s`
      }"></div>
    </div>

    <!-- Main Dashboard Content -->
    <div class="dashboard-container">
      <!-- Desktop Header with Glass Effect -->
      <header class="glass-header">
        <div class="header-content">
          <!-- Logo -->
          <router-link to="/" class="logo-container">
            <div class="logo-icon">
              <span class="logo-text">م</span>
            </div>
            <div class="logo-text-container">
              <h1 class="logo-title">نظام إدارة المخزون</h1>
              <p class="logo-subtitle">منظمة مونوفيا</p>
            </div>
          </router-link>

          <!-- User Controls -->
          <div class="user-controls">
            <!-- Theme Toggle -->
            <button 
              @click="toggleDarkMode"
              class="theme-toggle"
              :title="isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'"
            >
              <div class="theme-toggle-inner">
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
              </div>
            </button>

            <!-- Notifications -->
            <div class="notifications-container">
              <button 
                @click="toggleNotifications"
                class="notifications-btn"
                :class="{ 'has-notifications': notificationCount > 0 }"
              >
                <svg class="bell-icon" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" 
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span v-if="notificationCount > 0" class="notification-badge">
                  {{ notificationCount > 9 ? '9+' : notificationCount }}
                </span>
              </button>
              
              <!-- Notifications Dropdown -->
              <div v-if="showNotificationsDropdown" class="notifications-dropdown">
                <div class="notifications-header">
                  <h3>الإشعارات</h3>
                  <button @click="markAllAsRead" class="mark-read-btn">تحديد الكل كمقروء</button>
                </div>
                <div class="notifications-list">
                  <div v-if="notificationCount === 0" class="no-notifications">
                    لا توجد إشعارات جديدة
                  </div>
                  <div v-else class="notification-item" 
                       v-for="notification in lowStockNotifications" 
                       :key="notification.id">
                    <div class="notification-icon">
                      <svg class="warning-icon" viewBox="0 0 24 24">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" 
                              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <div class="notification-content">
                      <p class="notification-title">تحذير المخزون</p>
                      <p class="notification-message">الصنف {{ notification.itemName }} منخفض المخزون</p>
                      <p class="notification-time">{{ notification.time }}</p>
                    </div>
                  </div>
                </div>
              </div>
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
                <svg class="chevron-icon" viewBox="0 0 24 24" :class="{ 'rotate-180': showUserMenu }">
                  <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>

              <!-- User Menu Dropdown -->
              <div v-if="showUserMenu" class="user-menu-dropdown">
                <div class="user-menu-header">
                  <div class="menu-avatar" :style="{ background: userAvatarColor }">
                    {{ getUserInitials(userName) }}
                  </div>
                  <div class="menu-user-info">
                    <p class="menu-user-name">{{ userName }}</p>
                    <p class="menu-user-email">{{ userProfile?.email }}</p>
                    <span class="menu-user-role" :style="{ background: roleBadgeColor }">
                      {{ getRoleName(userRole) }}
                    </span>
                  </div>
                </div>
                <div class="user-menu-items">
                  <router-link to="/profile" @click="showUserMenu = false" class="menu-item">
                    <svg class="menu-icon" viewBox="0 0 24 24">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" 
                            fill="none" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <span>الملف الشخصي</span>
                  </router-link>
                  <button @click="logout" class="menu-item logout-item">
                    <svg class="menu-icon" viewBox="0 0 24 24">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" 
                            fill="none" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <span>تسجيل خروج</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Role Info Banner -->
      <div class="role-banner">
        <div class="role-banner-content">
          <div class="role-info">
            <svg class="role-icon" viewBox="0 0 24 24">
              <path d="M12 15l8.385-8.415a2.1 2.1 0 00-2.97-2.97L9 12v3h3z" fill="none" stroke="currentColor" stroke-width="2"/>
              <path d="M18 10l4-4-4-4M2 22h20M3 9.172a4 4 0 015.656 0L9 10.172l5.656-5.656a4 4 0 115.656 5.656L14.828 16l-5.656 5.656a4 4 0 01-5.656 0z" 
                    fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
            <div>
              <h3>دورك الحالي: {{ getRoleDescription(userRole) }}</h3>
              <p>المخازن المسموحة: {{ allowedWarehousesText }}</p>
            </div>
          </div>
          <div class="permission-badges">
            <span v-if="canModifyItems" class="permission-badge edit-badge">
              <svg class="badge-icon" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
              تعديل المخزون
            </span>
            <span v-if="canManageUsers" class="permission-badge user-badge">
              <svg class="badge-icon" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" fill="none" stroke="currentColor" stroke-width="2"/>
                <circle cx="9" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
              إدارة المستخدمين
            </span>
            <span v-if="canViewReports" class="permission-badge report-badge">
              <svg class="badge-icon" viewBox="0 0 24 24">
                <path d="M21 21H3V3h8l2 2h8v16z" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M7 11h10M7 15h6M7 7h10" fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
              عرض التقارير
            </span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Sidebar -->
        <aside class="sidebar">
          <!-- Navigation -->
          <nav class="sidebar-nav">
            <h3 class="sidebar-title">
              <svg class="nav-icon" viewBox="0 0 24 24">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                      fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
              القائمة الرئيسية
            </h3>
            <div class="nav-items">
              <router-link 
                v-for="nav in filteredNavLinks" 
                :key="nav.path"
                :to="nav.path"
                class="nav-item"
                :class="{ 'active': $route.path === nav.path }"
                @click="closeAllMenus"
              >
                <svg class="nav-item-icon" viewBox="0 0 24 24">
                  <path :d="nav.icon" fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span class="nav-item-text">{{ nav.title }}</span>
              </router-link>
            </div>
          </nav>

          <!-- Quick Actions -->
          <div class="quick-actions">
            <h3 class="sidebar-title">
              <svg class="nav-icon" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
              إجراءات سريعة
            </h3>
            <div class="action-buttons">
              <button v-if="canModifyItems" @click="openAddItemModal" class="action-btn add-item-btn">
                <div class="action-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 5v14m7-7H5" fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <span>إضافة صنف جديد</span>
              </button>
              
              <button v-if="canModifyItems" @click="openTransferModal" class="action-btn transfer-btn">
                <div class="action-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <span>نقل بين المخازن</span>
              </button>
              
              <button v-if="canModifyItems && canDispatch" @click="openDispatchModal" class="action-btn dispatch-btn">
                <div class="action-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m6 4l4-4m0 0l4 4m-4-4v12" fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <span>صرف إلى خارجي</span>
              </button>
              
              <button v-if="canManageUsers" @click="openAddUserModal" class="action-btn add-user-btn">
                <div class="action-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" fill="none" stroke="currentColor" stroke-width="2"/>
                    <path d="M16 19h6m-3-3v6" fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <span>إضافة مستخدم جديد</span>
              </button>
            </div>
          </div>

          <!-- Warehouses -->
          <div v-if="accessibleWarehouses.length > 0" class="warehouses-section">
            <h3 class="sidebar-title">
              <svg class="nav-icon" viewBox="0 0 24 24">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                      fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
              المخازن المتاحة
            </h3>
            <div class="warehouse-list">
              <button 
                v-for="warehouse in accessibleWarehouses" 
                :key="warehouse.id"
                @click="selectWarehouse(warehouse.id)"
                class="warehouse-item"
                :class="{ 'selected': selectedWarehouse === warehouse.id }"
              >
                <div class="warehouse-icon">
                  <span>{{ warehouse.name_ar.charAt(0) }}</span>
                </div>
                <div class="warehouse-info">
                  <p class="warehouse-name">{{ warehouse.name_ar }}</p>
                  <p class="warehouse-type">{{ warehouse.type === 'primary' ? 'مخزن رئيسي' : 'موقع صرف' }}</p>
                </div>
                <div v-if="selectedWarehouse === warehouse.id" class="selected-indicator"></div>
              </button>
            </div>
          </div>
        </aside>

        <!-- Dashboard Content -->
        <main class="dashboard-main">
          <!-- Stats Cards -->
          <div class="stats-grid">
            <div class="stat-card" @mouseenter="hoverCard('total')" @mouseleave="resetCard">
              <div class="stat-icon" :class="{ 'hovered': hoveredCard === 'total' }">
                <svg viewBox="0 0 24 24">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
                        fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="stat-content">
                <h4 class="stat-title">إجمالي الأصناف</h4>
                <p class="stat-value">{{ dashboardStats.totalItems }}</p>
              </div>
              <div class="stat-trend">+{{ recentActivity.added }} اليوم</div>
            </div>

            <div class="stat-card" @mouseenter="hoverCard('quantity')" @mouseleave="resetCard">
              <div class="stat-icon" :class="{ 'hovered': hoveredCard === 'quantity' }">
                <svg viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                        fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="stat-content">
                <h4 class="stat-title">إجمالي الكمية</h4>
                <p class="stat-value">{{ formatNumber(dashboardStats.totalQuantity) }}</p>
              </div>
              <div class="stat-trend">+{{ recentActivity.transferred }} نقل</div>
            </div>

            <div class="stat-card warning" @mouseenter="hoverCard('low')" @mouseleave="resetCard">
              <div class="stat-icon" :class="{ 'hovered': hoveredCard === 'low' }">
                <svg viewBox="0 0 24 24">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" 
                        fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="stat-content">
                <h4 class="stat-title">أصناف قليلة</h4>
                <p class="stat-value">{{ dashboardStats.lowStockItems }}</p>
              </div>
              <div class="stat-trend">تحتاج إعادة تعبئة</div>
            </div>

            <div class="stat-card" @mouseenter="hoverCard('activity')" @mouseleave="resetCard">
              <div class="stat-icon" :class="{ 'hovered': hoveredCard === 'activity' }">
                <svg viewBox="0 0 24 24">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                        fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="stat-content">
                <h4 class="stat-title">الحركات اليوم</h4>
                <p class="stat-value">{{ dashboardStats.recentTransactions }}</p>
              </div>
              <div class="stat-trend">-{{ recentActivity.dispatched }} صرف</div>
            </div>
          </div>

          <!-- Inventory Section -->
          <div class="inventory-section">
            <div class="section-header">
              <div class="header-left">
                <h2>المخزون الحالي</h2>
                <p>عرض جميع الأصناف في النظام</p>
              </div>
              <div class="header-controls">
                <div class="search-box">
                  <svg class="search-icon" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                          fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <input 
                    type="text" 
                    v-model="searchTerm"
                    @input="handleSearch"
                    placeholder="ابحث عن صنف..."
                    class="search-input"
                  />
                </div>
                <select 
                  v-model="selectedWarehouse"
                  @change="handleWarehouseChange"
                  class="warehouse-select"
                >
                  <option value="">جميع المخازن</option>
                  <option v-for="warehouse in accessibleWarehouses" 
                          :key="warehouse.id" 
                          :value="warehouse.id">
                    {{ warehouse.name_ar }}
                  </option>
                </select>
                <button v-if="canModifyItems" @click="openAddItemModal" class="add-btn">
                  <svg class="add-icon" viewBox="0 0 24 24">
                    <path d="M12 4v16m8-8H4" fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  إضافة صنف
                </button>
              </div>
            </div>

            <!-- Inventory Table -->
            <div v-if="loading" class="loading-state">
              <div class="loading-spinner"></div>
              <p>جاري تحميل البيانات...</p>
            </div>

            <div v-else-if="transformedInventory.length > 0" class="inventory-table-container">
              <InventoryTable 
                :items="transformedInventory"
                :readonly="!canModifyItems"
                :user-role="userRole"
                @transfer="openTransferModalForItem"
                @dispatch="openDispatchModalForItem"
              />
            </div>

            <div v-else class="empty-state">
              <svg class="empty-icon" viewBox="0 0 24 24">
                <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" 
                      fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
              <h3>لا توجد بيانات</h3>
              <p>لم يتم إضافة أي أصناف بعد.</p>
              <button v-if="canModifyItems" @click="openAddItemModal" class="empty-action-btn">
                إضافة صنف جديد
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Modals -->
    <AddItemModal 
      v-if="showAddItemModal"
      :isOpen="showAddItemModal"
      @close="showAddItemModal = false"
      @success="handleItemAdded"
    />

    <TransferModal 
      v-if="showTransferModal"
      :isOpen="showTransferModal"
      @close="showTransferModal = false"
      @success="handleTransferSuccess"
    />

    <DispatchModal 
      v-if="showDispatchModal"
      :isOpen="showDispatchModal"
      @close="showDispatchModal = false"
      @success="handleDispatchSuccess"
    />

    <!-- User Management Modal -->
    <AddUserModal
      v-if="showAddUserModal"
      :isOpen="showAddUserModal"
      @close="showAddUserModal = false"
      @save="handleUserAdded"
    />

    <!-- Edit User Modal -->
    <AddUserModal
      v-if="showUserModal"
      :isOpen="showUserModal"
      :user="selectedUser"
      @close="closeUserModal"
      @save="handleUserSave"
    />

    <WarehouseModal
      v-if="showWarehouseModal"
      :isOpen="showWarehouseModal"
      :warehouse="selectedWarehouseData"
      @close="closeWarehouseModal"
      @save="handleWarehouseSave"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { debounce } from 'lodash';

// Import components
import AddItemModal from '@/components/inventory/AddItemModal.vue';
import TransferModal from '@/components/inventory/TransferModal.vue';
import DispatchModal from '@/components/inventory/DispatchModal.vue';
import InventoryTable from '@/components/inventory/InventoryTable.vue';
import AddUserModal from '@/components/users/AddUserModal.vue';
import WarehouseModal from '@/components/WarehouseModal.vue';

// Import services and constants
import UserService from '@/services/UserService';
import { WAREHOUSE_LABELS } from '@/services/inventoryService';

export default {
  name: 'SkyDashboard',
  components: {
    AddItemModal,
    TransferModal,
    DispatchModal,
    InventoryTable,
    AddUserModal,
    WarehouseModal
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    
    // State
    const isDarkMode = ref(false);
    const showUserMenu = ref(false);
    const showNotificationsDropdown = ref(false);
    const selectedWarehouse = ref('');
    const searchTerm = ref('');
    const loading = ref(true);
    const hoveredCard = ref(null);
    
    // Modal states
    const showAddItemModal = ref(false);
    const showTransferModal = ref(false);
    const showDispatchModal = ref(false);
    const showUserModal = ref(false);
    const showAddUserModal = ref(false);
    const showWarehouseModal = ref(false);
    const selectedItemForAction = ref(null);
    const selectedUser = ref(null);
    const selectedWarehouseData = ref(null);

    // Navigation links
    const navigationLinks = [
      {
        path: '/',
        title: 'لوحة التحكم',
        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
        roles: ['superadmin', 'warehouse_manager', 'company_manager'],
        show: true
      },
      {
        path: '/warehouses',
        title: 'إدارة المخازن',
        icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
        roles: ['superadmin'],
        show: true
      },
      {
        path: '/users',
        title: 'إدارة المستخدمين',
        icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
        roles: ['superadmin'],
        show: true
      },
      {
        path: '/transactions',
        title: 'سجل الحركات',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
        roles: ['superadmin', 'warehouse_manager', 'company_manager'],
        show: true
      },
      {
        path: '/reports',
        title: 'التقارير',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        roles: ['superadmin', 'company_manager'],
        show: true
      }
    ];

    // Computed properties
    const userProfile = computed(() => store.state.userProfile);
    const userRole = computed(() => store.getters.userRole);
    const userName = computed(() => store.getters.userName);
    const dashboardStats = computed(() => store.getters.dashboardStats);
    const inventory = computed(() => store.state.inventory || []);
    
    // Permission checks based on Firebase rules
    const canModifyItems = computed(() => {
      const role = store.getters.userRole;
      const profile = store.state.userProfile;
      
      // Superadmin always has permission (matches Firebase rules)
      if (role === 'superadmin') return true;
      
      // Warehouse manager has permission if they have allowed warehouses
      if (role === 'warehouse_manager') {
        const hasWarehouses = profile?.allowed_warehouses?.length > 0;
        const hasPermission = profile?.permissions?.includes('full_access') || 
                              profile?.permissions?.includes('manage_inventory');
        return hasWarehouses && hasPermission;
      }
      
      return false;
    });
    
    const canDispatch = computed(() => {
      const role = store.getters.userRole;
      const profile = store.state.userProfile;
      
      if (role === 'superadmin') return true;
      if (role === 'warehouse_manager') {
        return profile?.permissions?.includes('dispatch_items') || 
               profile?.permissions?.includes('full_access');
      }
      return false;
    });
    
    const canManageUsers = computed(() => store.getters.userRole === 'superadmin');
    const canManageWarehouses = computed(() => store.getters.userRole === 'superadmin');
    const canViewReports = computed(() => {
      const role = store.getters.userRole;
      return ['superadmin', 'company_manager'].includes(role);
    });
    
    const accessibleWarehouses = computed(() => {
      const warehouses = store.state.warehouses || [];
      
      if (warehouses.length === 0) {
        return Object.keys(WAREHOUSE_LABELS).map(id => ({
          id: id,
          name_ar: WAREHOUSE_LABELS[id],
          name_en: id,
          type: id.includes('dispatch') ? 'dispatch' : 'primary'
        }));
      }
      
      // Filter based on user permissions
      const userRole = store.getters.userRole;
      const allowedWarehouses = store.state.userProfile?.allowed_warehouses || [];
      
      if (userRole === 'superadmin') return warehouses;
      if (userRole === 'company_manager') return warehouses;
      if (userRole === 'warehouse_manager') {
        if (allowedWarehouses.includes('all')) return warehouses;
        return warehouses.filter(w => allowedWarehouses.includes(w.id));
      }
      
      return [];
    });
    
    const notificationCount = computed(() => {
      return store.getters.dashboardStats?.lowStockItems || 0;
    });
    
    const lowStockNotifications = computed(() => {
      const lowStockItems = inventory.value.filter(item => 
        (item.remaining_quantity || 0) < 10 && (item.remaining_quantity || 0) > 0
      );
      
      return lowStockItems.slice(0, 5).map(item => ({
        id: item.id,
        itemName: item.name || item.الاسم || 'غير معروف',
        time: 'قبل قليل'
      }));
    });

    const filteredNavLinks = computed(() => {
      const userRole = store.getters.userRole;
      return navigationLinks.filter(link => link.roles.includes(userRole) && link.show);
    });

    // Filter inventory based on search and warehouse selection
    const filteredInventory = computed(() => {
      let filtered = [...inventory.value];
      
      // Apply warehouse filter
      if (selectedWarehouse.value) {
        filtered = filtered.filter(item => 
          (item.warehouse_id || item.المخزن_id) === selectedWarehouse.value
        );
      }
      
      // Apply search filter
      if (searchTerm.value.trim()) {
        const term = searchTerm.value.toLowerCase().trim();
        filtered = filtered.filter(item => {
          const name = (item.name || item.الاسم || '').toLowerCase();
          const code = (item.code || item.الكود || '').toLowerCase();
          const color = (item.color || item.اللون || '').toLowerCase();
          const supplier = (item.supplier || item.المورد || '').toLowerCase();
          
          return name.includes(term) || 
                 code.includes(term) || 
                 color.includes(term) ||
                 supplier.includes(term);
        });
      }
      
      return filtered;
    });

    // Transform inventory for table
    const transformedInventory = computed(() => {
      return filteredInventory.value.map(item => ({
        id: item.id,
        name: item.name || item.الاسم || 'غير محدد',
        code: item.code || item.الكود || '-',
        color: item.color || item.اللون || '-',
        warehouse_id: item.warehouse_id || item.المخزن_id,
        supplier: item.supplier || item.المورد || '-',
        item_location: item.item_location || item.مكان_الصنف || '-',
        cartons_count: item.cartons_count || item.كراتين || 0,
        per_carton_count: item.per_carton_count || item.في_الكرتونة || 0,
        single_bottles_count: item.single_bottles_count || item.فردي || 0,
        total_added: item.total_added || item.المضاف || 0,
        remaining_quantity: item.remaining_quantity || item.الكميه_المتبقيه || 0,
        updated_at: item.updated_at || item.آخر_تحديث || new Date()
      }));
    });

    const allowedWarehousesText = computed(() => {
      if (userRole.value === 'superadmin') return 'جميع المخازن';
      if (userRole.value === 'company_manager') return 'جميع المخازن (قراءة فقط)';
      
      const warehouses = userProfile.value?.allowed_warehouses || [];
      if (warehouses.length === 0) return 'لا توجد مخازن محددة';
      if (warehouses.includes('all')) return 'جميع المخازن';
      
      return warehouses.map(id => WAREHOUSE_LABELS[id] || id).join('، ');
    });

    // Avatar and badge colors
    const userAvatarColor = computed(() => {
      const colors = {
        superadmin: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        warehouse_manager: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        company_manager: 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
      };
      return colors[userRole.value] || 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    });

    const roleBadgeColor = computed(() => {
      const colors = {
        superadmin: '#f59e0b',
        warehouse_manager: '#3b82f6',
        company_manager: '#10b981'
      };
      return colors[userRole.value] || '#6b7280';
    });

    // Recent activity
    const recentActivity = computed(() => {
      const transactions = store.state.recentTransactions || [];
      return {
        added: transactions.filter(t => t.type === 'add').length,
        transferred: transactions.filter(t => t.type === 'transfer').length,
        dispatched: transactions.filter(t => t.type === 'dispatch').length
      };
    });

    // Helper functions
    const getRoleName = (role) => {
      const names = {
        superadmin: 'المشرف العام',
        warehouse_manager: 'مدير المخازن',
        company_manager: 'مدير الشركة'
      };
      return names[role] || role;
    };

    const getRoleDescription = (role) => {
      const descriptions = {
        superadmin: 'المشرف العام - صلاحيات كاملة',
        warehouse_manager: 'مدير المخازن - إدارة المخزون',
        company_manager: 'مدير الشركة - عرض التقارير'
      };
      return descriptions[role] || 'مستخدم عادي';
    };

    const getUserInitials = (name) => {
      if (!name) return '?';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const formatNumber = (num) => {
      return new Intl.NumberFormat('ar-EG').format(num);
    };

    // Event handlers
    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
      if (isDarkMode.value) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    };

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value;
      showNotificationsDropdown.value = false;
    };

    const toggleNotifications = () => {
      showNotificationsDropdown.value = !showNotificationsDropdown.value;
      showUserMenu.value = false;
    };

    const markAllAsRead = () => {
      // Implement notification marking logic
      console.log('Mark all as read');
    };

    const closeAllMenus = () => {
      showUserMenu.value = false;
      showNotificationsDropdown.value = false;
    };

    const selectWarehouse = (warehouseId) => {
      selectedWarehouse.value = warehouseId;
    };

    const handleSearch = debounce(() => {
      // Search is handled in computed property
    }, 300);

    const handleWarehouseChange = () => {
      // Warehouse change is handled in computed property
    };

    const hoverCard = (card) => {
      hoveredCard.value = card;
    };

    const resetCard = () => {
      hoveredCard.value = null;
    };

    // Modal handlers
    const openAddItemModal = () => {
      if (!canModifyItems.value) {
        alert('ليس لديك صلاحية لإضافة أصناف. يرجى التواصل مع المشرف العام.');
        return;
      }
      showAddItemModal.value = true;
    };

    const openTransferModal = () => {
      if (!canModifyItems.value) {
        alert('ليس لديك صلاحية لنقل الأصناف. يرجى التواصل مع المشرف العام.');
        return;
      }
      showTransferModal.value = true;
    };

    const openDispatchModal = () => {
      if (!canModifyItems.value || !canDispatch.value) {
        alert('ليس لديك صلاحية لصرف الأصناف. يرجى التواصل مع المشرف العام.');
        return;
      }
      showDispatchModal.value = true;
    };

    const openTransferModalForItem = (item) => {
      selectedItemForAction.value = item;
      showTransferModal.value = true;
    };

    const openDispatchModalForItem = (item) => {
      selectedItemForAction.value = item;
      showDispatchModal.value = true;
    };

    const openAddUserModal = () => {
      if (!canManageUsers.value) return;
      showAddUserModal.value = true;
    };

    const closeUserModal = () => {
      showUserModal.value = false;
      selectedUser.value = null;
    };

    // Handle user operations with Firebase rules compliance
    const handleUserSave = async (userData) => {
      try {
        if (!canManageUsers.value) {
          throw new Error('ليس لديك صلاحية لإدارة المستخدمين');
        }

        // Use store dispatch which uses UserService and respects Firebase rules
        const result = await store.dispatch('createUser', userData);
        
        if (result.success) {
          closeUserModal();
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Error saving user:', error);
      }
    };

    const handleUserAdded = () => {
      showAddUserModal.value = false;
    };

    const handleItemAdded = () => {
      showAddItemModal.value = false;
    };

    const handleTransferSuccess = () => {
      showTransferModal.value = false;
      selectedItemForAction.value = null;
    };

    const handleDispatchSuccess = () => {
      showDispatchModal.value = false;
      selectedItemForAction.value = null;
    };

    const handleWarehouseSave = async (warehouseData) => {
      try {
        // Refresh warehouses list
        await store.dispatch('loadWarehouses');
        showWarehouseModal.value = false;
      } catch (error) {
        console.error('Error saving warehouse:', error);
      }
    };

    const logout = async () => {
      try {
        await store.dispatch('logout');
        router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    // Lifecycle
    onMounted(() => {
      // Load warehouses
      store.dispatch('loadWarehouses');
      
      // Check theme
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDarkMode.value = true;
        document.documentElement.classList.add('dark');
      }
      
      // Set default warehouse
      if (accessibleWarehouses.value.length > 0) {
        selectedWarehouse.value = accessibleWarehouses.value[0].id;
      }
      
      // Subscribe to real-time data
      store.dispatch('subscribeToInventory');
      store.dispatch('subscribeToTransactions');
      
      // Set loading to false
      setTimeout(() => {
        loading.value = false;
      }, 1000);
    });

    // Watch for route changes
    watch(() => route.path, () => {
      closeAllMenus();
    });

    // Watch for inventory changes
    watch(() => inventory.value, () => {
      if (loading.value && inventory.value.length > 0) {
        loading.value = false;
      }
    }, { immediate: true });

    // Close menus when clicking outside
    onMounted(() => {
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-profile-container')) {
          showUserMenu.value = false;
        }
        if (!e.target.closest('.notifications-container')) {
          showNotificationsDropdown.value = false;
        }
      });
    });

    onUnmounted(() => {
      document.removeEventListener('click', () => {});
    });

    return {
      // State
      isDarkMode,
      showUserMenu,
      showNotificationsDropdown,
      selectedWarehouse,
      searchTerm,
      loading,
      hoveredCard,
      
      // Modal states
      showAddItemModal,
      showTransferModal,
      showDispatchModal,
      showUserModal,
      showAddUserModal,
      showWarehouseModal,
      
      // Computed
      userProfile,
      userRole,
      userName,
      dashboardStats,
      transformedInventory,
      canModifyItems,
      canDispatch,
      canManageUsers,
      canManageWarehouses,
      canViewReports,
      accessibleWarehouses,
      notificationCount,
      lowStockNotifications,
      filteredNavLinks,
      allowedWarehousesText,
      userAvatarColor,
      roleBadgeColor,
      recentActivity,
      
      // Methods
      getRoleName,
      getRoleDescription,
      getUserInitials,
      formatNumber,
      toggleDarkMode,
      toggleUserMenu,
      toggleNotifications,
      markAllAsRead,
      closeAllMenus,
      selectWarehouse,
      handleSearch,
      handleWarehouseChange,
      hoverCard,
      resetCard,
      openAddItemModal,
      openTransferModal,
      openDispatchModal,
      openTransferModalForItem,
      openDispatchModalForItem,
      openAddUserModal,
      closeUserModal,
      handleUserSave,
      handleUserAdded,
      handleItemAdded,
      handleTransferSuccess,
      handleDispatchSuccess,
      handleWarehouseSave,
      logout
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
  background: linear-gradient(135deg, 
    var(--sky-light, #e0f2fe) 0%, 
    var(--sky-mid, #bae6fd) 50%, 
    var(--sky-dark, #7dd3fc) 100%);
  transition: background 1s ease;
}

.dark .sky-background {
  background: linear-gradient(135deg, 
    var(--night-dark, #0f172a) 0%, 
    var(--night-mid, #1e293b) 50%, 
    var(--night-light, #334155) 100%);
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
  width: 300px;
  height: 100px;
  top: 20%;
  left: 10%;
  animation: floatCloud 60s linear infinite;
}

.cloud-2 {
  width: 200px;
  height: 70px;
  top: 40%;
  right: 20%;
  animation: floatCloud 40s linear infinite reverse;
}

.cloud-3 {
  width: 150px;
  height: 50px;
  top: 60%;
  left: 30%;
  animation: floatCloud 50s linear infinite;
}

.cloud-4 {
  width: 250px;
  height: 80px;
  bottom: 20%;
  right: 10%;
  animation: floatCloud 70s linear infinite reverse;
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
  width: 80px;
  height: 80px;
  z-index: 1;
}

.sun {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 50%;
  box-shadow: 0 0 60px #f59e0b, 0 0 100px #fbbf24;
  animation: pulseSun 4s ease-in-out infinite;
}

.moon {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
  border-radius: 50%;
  box-shadow: 0 0 40px #94a3b8;
  position: relative;
  animation: rotateMoon 120s linear infinite;
}

.moon-crater {
  position: absolute;
  background: rgba(148, 163, 184, 0.3);
  border-radius: 50%;
}

.moon-crater:nth-child(1) {
  width: 20px;
  height: 20px;
  top: 20px;
  left: 20px;
}

.moon-crater:nth-child(2) {
  width: 15px;
  height: 15px;
  bottom: 30px;
  right: 25px;
}

.moon-crater:nth-child(3) {
  width: 25px;
  height: 25px;
  bottom: 15px;
  left: 15px;
}

@keyframes pulseSun {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 60px #f59e0b, 0 0 100px #fbbf24;
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 80px #f59e0b, 0 0 140px #fbbf24;
  }
}

@keyframes rotateMoon {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
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
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
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
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
}

.dark .glass-header {
  background: rgba(15, 23, 42, 0.8);
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
  gap: 1rem;
  text-decoration: none;
  color: inherit;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
}

.logo-text {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.logo-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.dark .logo-title {
  color: #f3f4f6;
}

.logo-subtitle {
  font-size: 0.875rem;
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
  gap: 1.5rem;
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

.theme-toggle-inner {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sun-icon {
  width: 24px;
  height: 24px;
  color: #f59e0b;
}

.moon-icon {
  width: 24px;
  height: 24px;
  color: #94a3b8;
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
  width: 24px;
  height: 24px;
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
  font-size: 0.75rem;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
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

.notifications-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  z-index: 1000;
  overflow: hidden;
}

.dark .notifications-dropdown {
  background: #1f2937;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.notifications-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dark .notifications-header {
  border-bottom: 1px solid #374151;
}

.notifications-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .notifications-header h3 {
  color: #f3f4f6;
}

.mark-read-btn {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
}

.mark-read-btn:hover {
  text-decoration: underline;
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s;
}

.dark .notification-item {
  border-bottom: 1px solid #374151;
}

.notification-item:hover {
  background: #f9fafb;
}

.dark .notification-item:hover {
  background: #374151;
}

.notification-icon {
  flex-shrink: 0;
}

.warning-icon {
  width: 20px;
  height: 20px;
  color: #f59e0b;
}

.notification-content {
  flex: 1;
}

.notification-title {
  margin: 0 0 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .notification-title {
  color: #f3f4f6;
}

.notification-message {
  margin: 0 0 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .notification-message {
  color: #9ca3af;
}

.notification-time {
  margin: 0;
  font-size: 0.75rem;
  color: #9ca3af;
}

.no-notifications {
  padding: 2rem 1rem;
  text-align: center;
  color: #6b7280;
}

.dark .no-notifications {
  color: #9ca3af;
}

/* User Profile */
.user-profile-container {
  position: relative;
}

.user-profile-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 24px;
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
  width: 40px;
  height: 40px;
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

.chevron-icon {
  width: 20px;
  height: 20px;
  color: #6b7280;
  transition: transform 0.2s;
}

.dark .chevron-icon {
  color: #9ca3af;
}

.chevron-icon.rotate-180 {
  transform: rotate(180deg);
}

.user-menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 280px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  z-index: 1000;
  overflow: hidden;
}

.dark .user-menu-dropdown {
  background: #1f2937;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.user-menu-header {
  padding: 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.dark .user-menu-header {
  border-bottom: 1px solid #374151;
}

.menu-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
}

.menu-user-info {
  flex: 1;
}

.menu-user-name {
  margin: 0 0 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .menu-user-name {
  color: #f3f4f6;
}

.menu-user-email {
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .menu-user-email {
  color: #9ca3af;
}

.menu-user-role {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.user-menu-items {
  padding: 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  width: 100%;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  color: #1f2937;
  text-decoration: none;
  transition: background-color 0.2s;
}

.dark .menu-item {
  color: #f3f4f6;
}

.menu-item:hover {
  background: #f3f4f6;
}

.dark .menu-item:hover {
  background: #374151;
}

.menu-icon {
  width: 18px;
  height: 18px;
  color: #6b7280;
}

.dark .menu-icon {
  color: #9ca3af;
}

.logout-item {
  color: #ef4444;
}

.logout-item .menu-icon {
  color: #ef4444;
}

/* Role Banner */
.role-banner {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  margin: 1.5rem auto;
  max-width: 1400px;
  overflow: hidden;
}

.dark .role-banner {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.7) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.role-banner-content {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.role-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.role-icon {
  width: 32px;
  height: 32px;
  color: #f59e0b;
}

.role-info h3 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .role-info h3 {
  color: #f3f4f6;
}

.role-info p {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .role-info p {
  color: #9ca3af;
}

.permission-badges {
  display: flex;
  gap: 0.75rem;
}

.permission-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge-icon {
  width: 16px;
  height: 16px;
}

.edit-badge {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.user-badge {
  background: rgba(59, 130, 246, 0.1);
  color: #1d4ed8;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.report-badge {
  background: rgba(16, 185, 129, 0.1);
  color: #047857;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

/* Main Content */
.main-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
}

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-nav, .quick-actions, .warehouses-section {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
}

.dark .sidebar-nav,
.dark .quick-actions,
.dark .warehouses-section {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .sidebar-title {
  color: #f3f4f6;
}

.nav-icon {
  width: 18px;
  height: 18px;
  color: #6b7280;
}

.dark .nav-icon {
  color: #9ca3af;
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  text-decoration: none;
  color: #6b7280;
  transition: all 0.2s;
}

.dark .nav-item {
  color: #9ca3af;
}

.nav-item:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.dark .nav-item:hover {
  background: #374151;
  color: #f3f4f6;
}

.nav-item.active {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
  border-left: 3px solid #f59e0b;
}

.nav-item-icon {
  width: 18px;
  height: 18px;
}

.nav-item-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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
  width: 100%;
}

.dark .action-btn {
  background: #1f2937;
}

.action-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-icon svg {
  width: 18px;
  height: 18px;
  color: white;
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

.add-item-btn .action-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.transfer-btn .action-icon {
  background: linear-gradient(135deg, #10b981 0%, #047857 100%);
}

.dispatch-btn .action-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.add-user-btn .action-icon {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.dark .action-btn:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.warehouse-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.warehouse-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.warehouse-item:hover {
  background: #f3f4f6;
}

.dark .warehouse-item:hover {
  background: #374151;
}

.warehouse-item.selected {
  background: rgba(245, 158, 11, 0.1);
  border-left: 3px solid #f59e0b;
}

.warehouse-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.warehouse-info {
  flex: 1;
  text-align: right;
}

.warehouse-name {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
}

.dark .warehouse-name {
  color: #f3f4f6;
}

.warehouse-type {
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .warehouse-type {
  color: #9ca3af;
}

.selected-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f59e0b;
}

/* Dashboard Main */
.dashboard-main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
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

.stat-card.warning:hover {
  box-shadow: 0 20px 40px rgba(245, 158, 11, 0.1);
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

.stat-icon svg {
  width: 24px;
  height: 24px;
  color: #f59e0b;
}

.stat-icon.hovered {
  transform: scale(1.1) rotate(5deg);
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.stat-icon.hovered svg {
  color: white;
}

.warning .stat-icon {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%);
}

.warning .stat-icon svg {
  color: #ef4444;
}

.warning .stat-icon.hovered {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.stat-content {
  flex: 1;
}

.stat-title {
  margin: 0 0 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.dark .stat-title {
  color: #9ca3af;
}

.stat-value {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
}

.dark .stat-value {
  color: #f3f4f6;
}

.warning .stat-value {
  color: #ef4444;
}

.stat-trend {
  font-size: 0.75rem;
  color: #6b7280;
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.dark .stat-trend {
  color: #9ca3af;
  background: rgba(255, 255, 255, 0.1);
}

/* Inventory Section */
.inventory-section {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
}

.dark .inventory-section {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.header-left h2 {
  margin: 0 0 0.25rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.dark .header-left h2 {
  color: #f3f4f6;
}

.header-left p {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .header-left p {
  color: #9ca3af;
}

.header-controls {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.search-box {
  position: relative;
  width: 240px;
}

.search-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #6b7280;
  pointer-events: none;
}

.dark .search-icon {
  color: #9ca3af;
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
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.warehouse-select {
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  color: #1f2937;
  cursor: pointer;
  min-width: 160px;
  transition: all 0.2s;
}

.dark .warehouse-select {
  background: #374151;
  border-color: #4b5563;
  color: #f3f4f6;
}

.warehouse-select:focus {
  outline: none;
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.add-icon {
  width: 18px;
  height: 18px;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid #f3f4f6;
  border-top-color: #f59e0b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p {
  margin: 0;
  color: #6b7280;
}

.dark .loading-state p {
  color: #9ca3af;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  gap: 1rem;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: #d1d5db;
}

.dark .empty-icon {
  color: #4b5563;
}

.empty-state h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.dark .empty-state h3 {
  color: #f3f4f6;
}

.empty-state p {
  margin: 0;
  color: #6b7280;
}

.dark .empty-state p {
  color: #9ca3af;
}

.empty-action-btn {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.empty-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

/* Inventory Table Container */
.inventory-table-container {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.dark .inventory-table-container {
  border-color: #374151;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .user-controls {
    justify-content: space-between;
  }
  
  .role-banner-content {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .permission-badges {
    flex-wrap: wrap;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    width: 100%;
  }
}

/* Variables for theme switching */
:root {
  --sky-light: #e0f2fe;
  --sky-mid: #bae6fd;
  --sky-dark: #7dd3fc;
  --night-dark: #0f172a;
  --night-mid: #1e293b;
  --night-light: #334155;
}

.dark {
  --sky-light: #0f172a;
  --sky-mid: #1e293b;
  --sky-dark: #334155;
  --night-dark: #0f172a;
  --night-mid: #1e293b;
  --night-light: #334155;
}
</style>
