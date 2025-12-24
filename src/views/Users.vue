<template>
  <div class="user-management" :class="{ 'dark-mode': isDarkMode }">
    <!-- Loading Overlay -->
    <div v-if="loading && !error" class="loading-overlay">
      <div class="spinner-container">
        <div class="spinner"></div>
        <p class="loading-text">جاري تحميل بيانات المستخدمين...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-container">
      <div class="error-card">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h2>حدث خطأ</h2>
        <p class="error-message">{{ error }}</p>
        <div class="error-actions">
          <button @click="loadUsers" class="btn-primary">
            <i class="fas fa-redo"></i> إعادة المحاولة
          </button>
          <button @click="$router.push('/dashboard')" class="btn-secondary">
            <i class="fas fa-home"></i> العودة للرئيسية
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="!loading && !error" class="main-content">
      <!-- Header -->
      <div class="header-section">
        <div class="header-content">
          <div class="header-info">
            <h1 class="page-title">
              <i class="fas fa-users-cog"></i> إدارة المستخدمين
            </h1>
            <p class="page-subtitle">
              إدارة مستخدمي النظام، الصلاحيات، والمخازن
            </p>
          </div>
          <div class="header-actions">
            <button @click="toggleTheme" class="theme-toggle" :title="isDarkMode ? 'الوضع الفاتح' : 'الوضع الداكن'">
              <i :class="themeIcon"></i>
            </button>
            <button @click="exportUsers" class="btn-info" :disabled="exporting">
              <i class="fas" :class="exporting ? 'fa-spinner fa-spin' : 'fa-file-export'"></i>
              {{ exporting ? 'جاري التصدير...' : 'تصدير' }}
            </button>
            <button @click="showCreateModal = true" class="btn-success">
              <i class="fas fa-user-plus"></i> إضافة مستخدم جديد
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon total-users">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-content">
              <h3>إجمالي المستخدمين</h3>
              <p class="stat-number">{{ stats.totalUsers }}</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon active-users">
              <i class="fas fa-user-check"></i>
            </div>
            <div class="stat-content">
              <h3>المستخدمين النشطين</h3>
              <p class="stat-number">{{ stats.activeUsers }}</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon inactive-users">
              <i class="fas fa-user-times"></i>
            </div>
            <div class="stat-content">
              <h3>المستخدمين المعطلين</h3>
              <p class="stat-number">{{ stats.inactiveUsers }}</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon superadmins">
              <i class="fas fa-crown"></i>
            </div>
            <div class="stat-content">
              <h3>المشرفين العامين</h3>
              <p class="stat-number">{{ stats.superadmins }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="filters-section">
        <div class="filters-grid">
          <!-- Search -->
          <div class="filter-group">
            <label for="search">
              <i class="fas fa-search"></i> بحث
            </label>
            <div class="search-input">
              <input
                type="text"
                id="search"
                v-model="filters.search"
                placeholder="ابحث بالاسم، البريد، أو الدور..."
                @input="debouncedSearch"
              >
              <button v-if="filters.search" @click="clearSearch" class="clear-search">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>

          <!-- Role Filter -->
          <div class="filter-group">
            <label for="roleFilter">
              <i class="fas fa-user-tag"></i> الدور
            </label>
            <select id="roleFilter" v-model="filters.role" @change="applyFilters">
              <option value="">جميع الأدوار</option>
              <option value="superadmin">مشرف عام</option>
              <option value="company_manager">مدير شركة</option>
              <option value="warehouse_manager">مدير مخزن</option>
            </select>
          </div>

          <!-- Status Filter -->
          <div class="filter-group">
            <label for="statusFilter">
              <i class="fas fa-toggle-on"></i> الحالة
            </label>
            <select id="statusFilter" v-model="filters.status" @change="applyFilters">
              <option value="">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </select>
          </div>

          <!-- Warehouse Filter -->
          <div class="filter-group">
            <label for="warehouseFilter">
              <i class="fas fa-warehouse"></i> المخزن
            </label>
            <select id="warehouseFilter" v-model="filters.warehouse" @change="applyFilters">
              <option value="">جميع المخازن</option>
              <option value="all">جميع المخازن</option>
              <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
                {{ warehouse.name_ar || warehouse.name }}
              </option>
            </select>
          </div>

          <!-- Date Range -->
          <div class="filter-group date-range">
            <label>
              <i class="fas fa-calendar-alt"></i> الفترة الزمنية
            </label>
            <div class="date-inputs">
              <input
                type="date"
                v-model="filters.startDate"
                :max="filters.endDate"
                @change="applyFilters"
                :title="'من ' + formatDateDisplay(filters.startDate)"
              >
              <span class="date-separator">إلى</span>
              <input
                type="date"
                v-model="filters.endDate"
                :min="filters.startDate"
                :max="today"
                @change="applyFilters"
                :title="'إلى ' + formatDateDisplay(filters.endDate)"
              >
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <div class="bulk-actions-container">
            <button @click="showBulkActions = !showBulkActions" class="btn-secondary">
              <i class="fas fa-bars"></i> إجراءات جماعية
            </button>
            
            <div v-if="showBulkActions" class="bulk-actions-dropdown">
              <button @click="bulkActivate" :disabled="selectedUsers.length === 0" class="bulk-action-btn">
                <i class="fas fa-check-circle"></i> تفعيل المحددين
              </button>
              <button @click="bulkDeactivate" :disabled="selectedUsers.length === 0" class="bulk-action-btn">
                <i class="fas fa-times-circle"></i> تعطيل المحددين
              </button>
              <button @click="bulkDelete" :disabled="selectedUsers.length === 0" class="bulk-action-btn danger">
                <i class="fas fa-trash-alt"></i> حذف المحددين
              </button>
              <button @click="exportSelected" :disabled="selectedUsers.length === 0" class="bulk-action-btn info">
                <i class="fas fa-file-export"></i> تصدير المحددين
              </button>
            </div>
          </div>

          <button @click="refreshData" :disabled="refreshing" class="btn-info">
            <i class="fas" :class="refreshing ? 'fa-spinner fa-spin' : 'fa-redo'"></i>
            {{ refreshing ? 'جاري التحديث...' : 'تحديث' }}
          </button>
        </div>
      </div>

      <!-- Users Table -->
      <div class="table-section">
        <div class="table-header">
          <div class="table-info">
            <h3>
              <i class="fas fa-list"></i> قائمة المستخدمين
              <span class="table-count">({{ filteredUsers.length }} مستخدم)</span>
            </h3>
            <div class="selection-info" v-if="selectedUsers.length > 0">
              <i class="fas fa-check-circle"></i>
              تم تحديد {{ selectedUsers.length }} مستخدم
              <button @click="clearSelection" class="clear-selection">
                إلغاء التحديد
              </button>
            </div>
          </div>
          <div class="table-actions">
            <button @click="toggleAllSelection" class="select-all-btn">
              <i class="fas" :class="allSelected ? 'fa-check-square' : 'fa-square'"></i>
              {{ allSelected ? 'إلغاء تحديد الكل' : 'تحديد الكل' }}
            </button>
            <div class="view-options">
              <button @click="viewMode = 'grid'" :class="{ 'active': viewMode === 'grid' }" class="view-btn">
                <i class="fas fa-th-large"></i>
              </button>
              <button @click="viewMode = 'list'" :class="{ 'active': viewMode === 'list' }" class="view-btn">
                <i class="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Grid View -->
        <div v-if="viewMode === 'grid' && filteredUsers.length > 0" class="users-grid">
          <div
            v-for="user in paginatedUsers"
            :key="user.id"
            class="user-card"
            :class="{ 
              'selected': selectedUsers.includes(user.id),
              'inactive': !user.is_active
            }"
          >
            <!-- Card Header -->
            <div class="card-header">
              <div class="user-avatar-section">
                <div class="user-avatar" :style="getAvatarStyle(user)">
                  {{ getUserInitials(user) }}
                </div>
                <div class="user-status" :class="{ 'online': user.is_active, 'offline': !user.is_active }">
                  <i class="fas fa-circle"></i>
                </div>
              </div>
              <div class="user-actions">
                <button @click.stop="toggleUserSelection(user.id)" class="select-user-btn">
                  <i class="fas" :class="selectedUsers.includes(user.id) ? 'fa-check-square' : 'fa-square'"></i>
                </button>
                <div class="dropdown">
                  <button @click.stop="toggleDropdown(user.id)" class="dropdown-toggle">
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                  <div v-if="activeDropdown === user.id" class="dropdown-menu">
                    <button @click="editUser(user)" class="dropdown-item">
                      <i class="fas fa-edit"></i> تعديل
                    </button>
                    <button @click="viewUserProfile(user)" class="dropdown-item">
                      <i class="fas fa-eye"></i> عرض التفاصيل
                    </button>
                    <button 
                      @click="toggleUserStatus(user)" 
                      :class="{ 'danger': user.is_active }" 
                      class="dropdown-item"
                    >
                      <i :class="user.is_active ? 'fas fa-user-times' : 'fas fa-user-check'"></i>
                      {{ user.is_active ? 'تعطيل' : 'تفعيل' }}
                    </button>
                    <button @click="openDeleteModal(user)" class="dropdown-item danger">
                      <i class="fas fa-trash-alt"></i> حذف
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Body -->
            <div class="card-body">
              <div class="user-info">
                <h4 class="user-name">{{ user.name }}</h4>
                <p class="user-email">{{ user.email }}</p>
                
                <div class="user-meta">
                  <span class="user-role" :class="user.role">
                    <i :class="getRoleIcon(user.role)"></i>
                    {{ getRoleName(user.role) }}
                  </span>
                  <span class="user-date">
                    <i class="fas fa-calendar"></i>
                    {{ formatDate(user.created_at) }}
                  </span>
                </div>

                <div class="user-stats">
                  <div class="stat-item">
                    <i class="fas fa-warehouse"></i>
                    <span>{{ getUserWarehouseCount(user) }} مخزن</span>
                  </div>
                  <div class="stat-item">
                    <i class="fas fa-shield-alt"></i>
                    <span>{{ getUserPermissionsCount(user) }} صلاحية</span>
                  </div>
                </div>

                <div v-if="user.allowed_warehouses" class="warehouses-preview">
                  <div class="warehouses-label">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>المخازن المسموحة:</span>
                  </div>
                  <div class="warehouses-list">
                    <span v-if="user.allowed_warehouses.includes('all')" class="warehouse-tag all">
                      جميع المخازن
                    </span>
                    <template v-else>
                      <span 
                        v-for="warehouseId in user.allowed_warehouses.slice(0, 2)" 
                        :key="warehouseId" 
                        class="warehouse-tag"
                      >
                        {{ getWarehouseName(warehouseId) }}
                      </span>
                      <span 
                        v-if="user.allowed_warehouses.length > 2" 
                        class="warehouse-tag more"
                      >
                        +{{ user.allowed_warehouses.length - 2 }} أخرى
                      </span>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Footer -->
            <div class="card-footer">
              <button @click="impersonateUser(user)" class="btn-secondary btn-sm" :disabled="user.id === currentUserId">
                <i class="fas fa-user-secret"></i> الدخول كمستخدم
              </button>
              <button @click="resetPassword(user)" class="btn-info btn-sm">
                <i class="fas fa-key"></i> إعادة تعيين كلمة المرور
              </button>
            </div>
          </div>
        </div>

        <!-- Table View -->
        <div v-else-if="viewMode === 'list' && filteredUsers.length > 0" class="users-table-container">
          <table class="users-table">
            <thead>
              <tr>
                <th class="select-column">
                  <input 
                    type="checkbox" 
                    :checked="allSelected" 
                    @change="toggleAllSelection"
                    class="select-checkbox"
                  >
                </th>
                <th class="user-column">المستخدم</th>
                <th class="role-column">الدور</th>
                <th class="warehouses-column">المخازن</th>
                <th class="status-column">الحالة</th>
                <th class="date-column">تاريخ الإنشاء</th>
                <th class="actions-column">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="user in paginatedUsers" 
                :key="user.id"
                :class="{ 
                  'selected': selectedUsers.includes(user.id),
                  'inactive': !user.is_active
                }"
              >
                <!-- Select Checkbox -->
                <td class="select-cell">
                  <input 
                    type="checkbox" 
                    :checked="selectedUsers.includes(user.id)" 
                    @change="toggleUserSelection(user.id)"
                    class="select-checkbox"
                  >
                </td>

                <!-- User Info -->
                <td class="user-cell">
                  <div class="user-info-row">
                    <div class="user-avatar-sm" :style="getAvatarStyle(user)">
                      {{ getUserInitials(user) }}
                    </div>
                    <div class="user-details">
                      <div class="user-name-row">
                        <h5 class="user-name">{{ user.name }}</h5>
                        <span v-if="user.id === currentUserId" class="current-user-badge">
                          <i class="fas fa-user"></i> أنت
                        </span>
                      </div>
                      <p class="user-email">{{ user.email }}</p>
                      <div class="user-meta-row">
                        <span class="last-login" v-if="user.last_login">
                          <i class="fas fa-sign-in-alt"></i>
                          آخر دخول: {{ formatTimeAgo(user.last_login) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Role -->
                <td class="role-cell">
                  <span class="role-badge" :class="user.role">
                    <i :class="getRoleIcon(user.role)"></i>
                    {{ getRoleName(user.role) }}
                  </span>
                  <div class="permissions-count" v-if="user.permissions">
                    <i class="fas fa-shield-alt"></i>
                    {{ user.permissions.length }} صلاحية
                  </div>
                </td>

                <!-- Warehouses -->
                <td class="warehouses-cell">
                  <div v-if="user.allowed_warehouses" class="warehouses-list-table">
                    <div v-if="user.allowed_warehouses.includes('all')" class="all-warehouses">
                      <i class="fas fa-check-circle"></i>
                      جميع المخازن
                    </div>
                    <template v-else>
                      <div class="warehouses-count">
                        <i class="fas fa-warehouse"></i>
                        {{ user.allowed_warehouses.length }} مخزن
                      </div>
                      <div class="warehouses-preview-table">
                        <span 
                          v-for="warehouseId in user.allowed_warehouses.slice(0, 3)" 
                          :key="warehouseId"
                          class="warehouse-tag-sm"
                        >
                          {{ getWarehouseName(warehouseId) }}
                        </span>
                        <span 
                          v-if="user.allowed_warehouses.length > 3" 
                          class="warehouse-more"
                        >
                          +{{ user.allowed_warehouses.length - 3 }}
                        </span>
                      </div>
                    </template>
                  </div>
                  <div v-else class="no-warehouses">
                    <i class="fas fa-exclamation-circle"></i>
                    لا توجد مخازن
                  </div>
                </td>

                <!-- Status -->
                <td class="status-cell">
                  <div class="status-indicator" :class="{ 'active': user.is_active }">
                    <i class="fas fa-circle"></i>
                    <span>{{ user.is_active ? 'نشط' : 'معطل' }}</span>
                  </div>
                  <button 
                    @click="toggleUserStatus(user)" 
                    class="status-toggle-btn btn-sm"
                    :class="{ 'danger': user.is_active, 'success': !user.is_active }"
                  >
                    <i :class="user.is_active ? 'fas fa-toggle-off' : 'fas fa-toggle-on'"></i>
                    {{ user.is_active ? 'تعطيل' : 'تفعيل' }}
                  </button>
                </td>

                <!-- Date -->
                <td class="date-cell">
                  <div class="date-display">
                    <i class="fas fa-calendar"></i>
                    {{ formatDate(user.created_at) }}
                  </div>
                  <div class="time-ago" v-if="user.created_at">
                    {{ formatTimeAgo(user.created_at) }}
                  </div>
                </td>

                <!-- Actions -->
                <td class="actions-cell">
                  <div class="action-buttons">
                    <button @click="editUser(user)" class="action-btn edit" title="تعديل">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button @click="viewUserProfile(user)" class="action-btn view" title="عرض التفاصيل">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button 
                      @click="impersonateUser(user)" 
                      class="action-btn impersonate" 
                      title="الدخول كمستخدم"
                      :disabled="user.id === currentUserId"
                    >
                      <i class="fas fa-user-secret"></i>
                    </button>
                    <button @click="resetPassword(user)" class="action-btn reset" title="إعادة تعيين كلمة المرور">
                      <i class="fas fa-key"></i>
                    </button>
                    <button @click="openDeleteModal(user)" class="action-btn delete" title="حذف">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <div class="empty-state-icon">
            <i class="fas fa-users-slash"></i>
          </div>
          <h3>لا توجد نتائج</h3>
          <p>لا توجد مستخدمين تطابق معايير البحث</p>
          <button @click="clearFilters" class="btn-primary">
            <i class="fas fa-times"></i> مسح الفلاتر
          </button>
        </div>

        <!-- Pagination -->
        <div v-if="filteredUsers.length > 0" class="pagination-section">
          <div class="pagination-info">
            عرض {{ (currentPage - 1) * itemsPerPage + 1 }} إلى {{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }} من {{ filteredUsers.length }} مستخدم
          </div>
          
          <div class="pagination-controls">
            <select v-model="itemsPerPage" @change="itemsPerPage = parseInt($event.target.value)" class="page-size-select">
              <option value="10">10 لكل صفحة</option>
              <option value="25">25 لكل صفحة</option>
              <option value="50">50 لكل صفحة</option>
              <option value="100">100 لكل صفحة</option>
            </select>

            <button 
              @click="prevPage" 
              :disabled="currentPage === 1" 
              class="pagination-btn prev"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
            
            <div class="page-numbers">
              <button 
                v-for="page in visiblePages" 
                :key="page"
                @click="goToPage(page)"
                :class="{ 'active': currentPage === page, 'disabled': page === '...' }"
                class="page-number"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="nextPage" 
              :disabled="currentPage === totalPages" 
              class="pagination-btn next"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    
    <!-- Add/Edit User Modal (Using External Component) -->
    <AddUserModal
      v-if="showCreateModal"
      :auto-open="true"
      :edit-user="editingUser"
      @success="handleUserSuccess"
      @closed="closeUserModal"
      @completed="handleUserCompleted"
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteModalVisible" class="modal-overlay" @click.self="cancelDelete">
      <div class="modal-container delete-modal">
        <div class="modal-content">
          <div class="modal-header danger">
            <h2><i class="fas fa-exclamation-triangle"></i> تأكيد الحذف</h2>
          </div>
          
          <div class="modal-body">
            <div class="delete-warning">
              <i class="fas fa-trash-alt"></i>
              <h3>هل أنت متأكد من حذف المستخدم؟</h3>
              <p v-if="userToDelete">
                هذا الإجراء سيحذف المستخدم <strong>{{ userToDelete.name }}</strong> (<strong>{{ userToDelete.email }}</strong>) نهائياً.
              </p>
              <p v-if="selectedUsers.length > 1 && !userToDelete" class="bulk-delete-warning">
                <i class="fas fa-exclamation-circle"></i>
                سيتم حذف <strong>{{ selectedUsers.length }}</strong> مستخدمين.
              </p>
              <div class="warning-list">
                <p><i class="fas fa-exclamation-circle"></i> لا يمكن التراجع عن هذا الإجراء</p>
                <p><i class="fas fa-history"></i> سيتم حفظ سجل الحذف في السجلات</p>
                <p><i class="fas fa-ban"></i> المستخدم لن يتمكن من تسجيل الدخول</p>
              </div>
            </div>

            <div class="delete-actions">
              <button @click="cancelDelete" class="btn-secondary">
                <i class="fas fa-times"></i> إلغاء
              </button>
              <button @click="confirmDelete" class="btn-danger" :disabled="deleting">
                <i class="fas" :class="deleting ? 'fa-spinner fa-spin' : 'fa-trash-alt'"></i>
                {{ deleting ? 'جاري الحذف...' : 'حذف' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reset Password Modal -->
    <div v-if="showResetPasswordModal" class="modal-overlay" @click.self="cancelResetPassword">
      <div class="modal-container">
        <div class="modal-content">
          <div class="modal-header">
            <h2><i class="fas fa-key"></i> إعادة تعيين كلمة المرور</h2>
            <button @click="cancelResetPassword" class="modal-close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="reset-info">
              <i class="fas fa-user-shield"></i>
              <h3>إعادة تعيين كلمة المرور للمستخدم</h3>
              <p v-if="userToReset">
                ستقوم بإعادة تعيين كلمة مرور المستخدم <strong>{{ userToReset.name }}</strong> (<strong>{{ userToReset.email }}</strong>)
              </p>
            </div>

            <div class="reset-options">
              <div class="option-group">
                <label class="option-label">
                  <input
                    type="radio"
                    v-model="resetMethod"
                    value="auto"
                    checked
                  >
                  <span class="radio-custom"></span>
                  <div class="option-content">
                    <h4>توليد تلقائي</h4>
                    <p>توليد كلمة مرور قوية عشوائية وإرسالها بالبريد</p>
                  </div>
                </label>

                <label class="option-label">
                  <input
                    type="radio"
                    v-model="resetMethod"
                    value="manual"
                  >
                  <span class="radio-custom"></span>
                  <div class="option-content">
                    <h4>تعيين يدوي</h4>
                    <p>تعيين كلمة مرور محددة</p>
                  </div>
                </label>
              </div>

              <div v-if="resetMethod === 'manual'" class="manual-password">
                <div class="form-group">
                  <label for="newPassword">
                    <i class="fas fa-key"></i> كلمة المرور الجديدة
                  </label>
                  <div class="password-input">
                    <input
                      :type="showNewPassword ? 'text' : 'password'"
                      id="newPassword"
                      v-model="newPassword"
                      placeholder="أدخل كلمة المرور الجديدة"
                      required
                      minlength="8"
                    >
                    <button
                      type="button"
                      @click="showNewPassword = !showNewPassword"
                      class="password-toggle"
                    >
                      <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                  <div class="password-strength" :class="newPasswordStrength.class">
                    <div class="strength-bar">
                      <div class="strength-fill" :style="{ width: newPasswordStrength.percentage + '%' }"></div>
                    </div>
                    <span>{{ newPasswordStrength.text }}</span>
                  </div>
                </div>

                <div class="form-group">
                  <label for="confirmNewPassword">
                    <i class="fas fa-key"></i> تأكيد كلمة المرور
                  </label>
                  <div class="password-input">
                    <input
                      :type="showConfirmNewPassword ? 'text' : 'password'"
                      id="confirmNewPassword"
                      v-model="confirmNewPassword"
                      placeholder="أعد إدخال كلمة المرور الجديدة"
                      required
                    >
                    <button
                      type="button"
                      @click="showConfirmNewPassword = !showConfirmNewPassword"
                      class="password-toggle"
                    >
                      <i :class="showConfirmNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                  <span v-if="passwordMatchError" class="error-message">{{ passwordMatchError }}</span>
                </div>
              </div>

              <div class="notification-option">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="sendResetNotification">
                  <span class="checkbox-custom"></span>
                  <div class="checkbox-content">
                    <h4>إرسال إشعار للمستخدم</h4>
                    <p>إرسال بريد إلكتروني للمستخدم يحتوي على كلمة المرور الجديدة</p>
                  </div>
                </label>
              </div>
            </div>

            <div class="reset-actions">
              <button @click="cancelResetPassword" class="btn-secondary">
                <i class="fas fa-times"></i> إلغاء
              </button>
              <button @click="confirmResetPassword" class="btn-primary" :disabled="resetting">
                <i class="fas" :class="resetting ? 'fa-spinner fa-spin' : 'fa-key'"></i>
                {{ resetting ? 'جاري إعادة التعيين...' : 'إعادة تعيين' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Impersonate Confirmation Modal -->
    <div v-if="showImpersonateModal" class="modal-overlay" @click.self="cancelImpersonate">
      <div class="modal-container">
        <div class="modal-content">
          <div class="modal-header warning">
            <h2><i class="fas fa-user-secret"></i> الدخول كمستخدم</h2>
          </div>
          
          <div class="modal-body">
            <div class="impersonate-warning">
              <i class="fas fa-exclamation-triangle"></i>
              <h3>هل تريد الدخول كمستخدم آخر؟</h3>
              <p v-if="userToImpersonate">
                ستقوم بتسجيل الدخول كمستخدم <strong>{{ userToImpersonate.name }}</strong> (<strong>{{ userToImpersonate.email }}</strong>)
              </p>
              <div class="warning-list">
                <p><i class="fas fa-shield-alt"></i> ستفقد صلاحياتك كمدير مؤقتاً</p>
                <p><i class="fas fa-history"></i> سيتم تسجيل هذا الإجراء في السجلات</p>
                <p><i class="fas fa-sign-out-alt"></i> يمكنك الرجوع لحسابك في أي وقت</p>
              </div>
            </div>

            <div class="impersonate-actions">
              <button @click="cancelImpersonate" class="btn-secondary">
                <i class="fas fa-times"></i> إلغاء
              </button>
              <button @click="confirmImpersonate" class="btn-warning">
                <i class="fas fa-user-secret"></i> متابعة والدخول
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div v-if="toast.show" class="toast-container" :class="toast.type">
      <div class="toast-content">
        <i :class="toast.icon"></i>
        <p>{{ toast.message }}</p>
      </div>
      <button @click="hideToast" class="toast-close">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import AddUserModal from '@/components/users/AddUserModal.vue'

export default {
  name: 'UserManagement',
  
  components: {
    AddUserModal
  },
  
  data() {
    return {
      loading: true,
      error: null,
      refreshing: false,
      exporting: false,
      deleting: false,
      resetting: false,
      
      // View Mode
      viewMode: 'grid',
      isDarkMode: false,
      
      // Filters
      filters: {
        search: '',
        role: '',
        status: '',
        warehouse: '',
        startDate: '',
        endDate: ''
      },
      
      // Selected Users
      selectedUsers: [],
      showBulkActions: false,
      activeDropdown: null,
      
      // Pagination
      currentPage: 1,
      itemsPerPage: 25,
      
      // Modals
      showCreateModal: false,
      editingUser: null,
      deleteModalVisible: false,
      userToDelete: null,
      showResetPasswordModal: false,
      userToReset: null,
      showImpersonateModal: false,
      userToImpersonate: null,
      
      // Reset Password
      resetMethod: 'auto',
      newPassword: '',
      confirmNewPassword: '',
      showNewPassword: false,
      showConfirmNewPassword: false,
      sendResetNotification: true,
      passwordMatchError: '',
      
      // Toast
      toast: {
        show: false,
        type: 'success',
        message: '',
        icon: 'fas fa-check-circle'
      },
      
      // Debounce search
      searchTimeout: null
    }
  },
  
  computed: {
    ...mapState(['allUsers', 'warehouses', 'user']),
    ...mapGetters(['primaryWarehouses', 'dispatchWarehouses']),
    
    // Current User ID
    currentUserId() {
      return this.user?.uid
    },
    
    // Theme
    themeIcon() {
      return this.isDarkMode ? 'fas fa-sun' : 'fas fa-moon'
    },
    
    // Today's date for date picker max
    today() {
      return new Date().toISOString().split('T')[0]
    },
    
    // User Statistics
    stats() {
      const stats = {
        totalUsers: this.allUsers.length,
        activeUsers: 0,
        inactiveUsers: 0,
        superadmins: 0,
        companyManagers: 0,
        warehouseManagers: 0
      }
      
      this.allUsers.forEach(user => {
        if (user.is_active !== false) {
          stats.activeUsers++
        } else {
          stats.inactiveUsers++
        }
        
        switch (user.role) {
          case 'superadmin':
            stats.superadmins++
            break
          case 'company_manager':
            stats.companyManagers++
            break
          case 'warehouse_manager':
            stats.warehouseManagers++
            break
        }
      })
      
      return stats
    },
    
    // Filtered Users
    filteredUsers() {
      let filtered = [...this.allUsers]
      
      // Search filter
      if (this.filters.search) {
        const searchTerm = this.filters.search.toLowerCase()
        filtered = filtered.filter(user => 
          (user.name?.toLowerCase() || '').includes(searchTerm) ||
          (user.email?.toLowerCase() || '').includes(searchTerm) ||
          (user.role?.toLowerCase() || '').includes(searchTerm)
        )
      }
      
      // Role filter
      if (this.filters.role) {
        filtered = filtered.filter(user => user.role === this.filters.role)
      }
      
      // Status filter
      if (this.filters.status) {
        const isActive = this.filters.status === 'active'
        filtered = filtered.filter(user => 
          (user.is_active !== false) === isActive
        )
      }
      
      // Warehouse filter
      if (this.filters.warehouse) {
        if (this.filters.warehouse === 'all') {
          filtered = filtered.filter(user => 
            user.allowed_warehouses?.includes('all')
          )
        } else {
          filtered = filtered.filter(user => 
            user.allowed_warehouses?.includes(this.filters.warehouse)
          )
        }
      }
      
      // Date filter
      if (this.filters.startDate) {
        const startDate = new Date(this.filters.startDate)
        filtered = filtered.filter(user => {
          if (!user.created_at) return false
          const userDate = user.created_at.toDate ? user.created_at.toDate() : new Date(user.created_at)
          return userDate >= startDate
        })
      }
      
      if (this.filters.endDate) {
        const endDate = new Date(this.filters.endDate)
        endDate.setHours(23, 59, 59, 999)
        filtered = filtered.filter(user => {
          if (!user.created_at) return false
          const userDate = user.created_at.toDate ? user.created_at.toDate() : new Date(user.created_at)
          return userDate <= endDate
        })
      }
      
      return filtered.sort((a, b) => {
        // Sort by creation date (newest first)
        const dateA = a.created_at?.toDate ? a.created_at.toDate() : new Date(a.created_at || 0)
        const dateB = b.created_at?.toDate ? b.created_at.toDate() : new Date(b.created_at || 0)
        return dateB - dateA
      })
    },
    
    // Pagination
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredUsers.slice(start, end)
    },
    
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage)
    },
    
    visiblePages() {
      const pages = []
      const maxVisible = 5
      
      if (this.totalPages <= maxVisible) {
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i)
        }
      } else {
        let start = Math.max(1, this.currentPage - 2)
        let end = Math.min(this.totalPages, start + maxVisible - 1)
        
        if (end - start + 1 < maxVisible) {
          start = end - maxVisible + 1
        }
        
        if (start > 1) {
          pages.push(1)
          if (start > 2) pages.push('...')
        }
        
        for (let i = start; i <= end; i++) {
          pages.push(i)
        }
        
        if (end < this.totalPages) {
          if (end < this.totalPages - 1) pages.push('...')
          pages.push(this.totalPages)
        }
      }
      
      return pages
    },
    
    // Selection
    allSelected() {
      return this.filteredUsers.length > 0 && 
             this.selectedUsers.length === this.filteredUsers.length
    },
    
    // Password Strength
    newPasswordStrength() {
      return this.calculatePasswordStrength(this.newPassword)
    }
  },
  
  methods: {
    ...mapActions([
      'loadAllUsers',
      'deleteUser',
      'updateUserStatus',
      'showNotification'
    ]),
    
    // Initialization
    async init() {
      try {
        this.loading = true
        this.error = null
        
        // Load theme preference
        this.loadThemePreference()
        
        // Load data
        await this.loadAllUsers()
        
        // Initialize date filters (last 30 days)
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 30)
        
        this.filters.endDate = endDate.toISOString().split('T')[0]
        this.filters.startDate = startDate.toISOString().split('T')[0]
        
      } catch (error) {
        console.error('Error initializing user management:', error)
        this.error = 'فشل في تحميل بيانات المستخدمين. يرجى المحاولة مرة أخرى.'
        this.showToast('حدث خطأ في تحميل البيانات', 'error')
      } finally {
        this.loading = false
      }
    },
    
    // Theme Management
    loadThemePreference() {
      const savedTheme = localStorage.getItem('theme')
      this.isDarkMode = savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
      this.applyTheme()
    },
    
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light')
      this.applyTheme()
    },
    
    applyTheme() {
      if (this.isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }
    },
    
    // Data Management
    async refreshData() {
      try {
        this.refreshing = true
        await this.loadAllUsers()
        this.showToast('تم تحديث البيانات بنجاح', 'success')
      } catch (error) {
        console.error('Error refreshing data:', error)
        this.showToast('فشل في تحديث البيانات', 'error')
      } finally {
        this.refreshing = false
      }
    },
    
    // User Display Helpers
    getUserInitials(user) {
      const name = user.name || user.email
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },
    
    getAvatarStyle(user) {
      const colors = [
        '#4CAF50', '#2196F3', '#FF9800', '#E91E63',
        '#9C27B0', '#673AB7', '#3F51B5', '#00BCD4'
      ]
      const name = user.name || user.email
      const hash = name.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + acc
      }, 0)
      const colorIndex = hash % colors.length
      return {
        backgroundColor: colors[colorIndex],
        color: '#FFFFFF'
      }
    },
    
    getRoleName(role) {
      const roles = {
        'superadmin': 'مشرف عام',
        'company_manager': 'مدير شركة',
        'warehouse_manager': 'مدير مخزن'
      }
      return roles[role] || role
    },
    
    getRoleIcon(role) {
      const icons = {
        'superadmin': 'fas fa-crown',
        'company_manager': 'fas fa-user-tie',
        'warehouse_manager': 'fas fa-warehouse'
      }
      return icons[role] || 'fas fa-user'
    },
    
    getWarehouseName(warehouseId) {
      const warehouse = this.warehouses.find(w => w.id === warehouseId)
      return warehouse ? (warehouse.name_ar || warehouse.name) : warehouseId
    },
    
    getUserWarehouseCount(user) {
      if (!user.allowed_warehouses) return 0
      if (user.allowed_warehouses.includes('all')) return 'جميع'
      return user.allowed_warehouses.length
    },
    
    getUserPermissionsCount(user) {
      if (!user.permissions) return 0
      if (user.permissions.includes('full_access')) return 'كاملة'
      return user.permissions.length
    },
    
    // Formatting
    formatDate(date) {
      if (!date) return 'غير محدد'
      
      try {
        const dateObj = date.toDate ? date.toDate() : new Date(date)
        return new Intl.DateTimeFormat('ar-SA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(dateObj)
      } catch {
        return 'غير محدد'
      }
    },
    
    formatDateDisplay(dateString) {
      if (!dateString) return 'غير محدد'
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('ar-SA').format(date)
    },
    
    formatTimeAgo(date) {
      if (!date) return 'غير معروف'
      
      try {
        const now = new Date()
        const past = date.toDate ? date.toDate() : new Date(date)
        const diffMs = now - past
        const diffSec = Math.floor(diffMs / 1000)
        const diffMin = Math.floor(diffSec / 60)
        const diffHour = Math.floor(diffMin / 60)
        const diffDay = Math.floor(diffHour / 24)
        
        if (diffDay > 30) return this.formatDate(date)
        if (diffDay > 0) return `قبل ${diffDay} يوم`
        if (diffHour > 0) return `قبل ${diffHour} ساعة`
        if (diffMin > 0) return `قبل ${diffMin} دقيقة`
        return 'الآن'
      } catch {
        return 'غير معروف'
      }
    },
    
    // Search and Filters
    debouncedSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.applyFilters()
      }, 300)
    },
    
    applyFilters() {
      this.currentPage = 1
    },
    
    clearSearch() {
      this.filters.search = ''
      this.applyFilters()
    },
    
    clearFilters() {
      this.filters = {
        search: '',
        role: '',
        status: '',
        warehouse: '',
        startDate: '',
        endDate: ''
      }
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)
      this.filters.endDate = endDate.toISOString().split('T')[0]
      this.filters.startDate = startDate.toISOString().split('T')[0]
      this.applyFilters()
    },
    
    // Selection Management
    toggleUserSelection(userId) {
      const index = this.selectedUsers.indexOf(userId)
      if (index === -1) {
        this.selectedUsers.push(userId)
      } else {
        this.selectedUsers.splice(index, 1)
      }
    },
    
    toggleAllSelection() {
      if (this.allSelected) {
        this.selectedUsers = []
      } else {
        this.selectedUsers = this.filteredUsers.map(user => user.id)
      }
    },
    
    clearSelection() {
      this.selectedUsers = []
    },
    
    // Dropdown Management
    toggleDropdown(userId) {
      this.activeDropdown = this.activeDropdown === userId ? null : userId
    },
    
    // User Actions
    editUser(user) {
      this.editingUser = user
      this.showCreateModal = true
      this.activeDropdown = null
    },
    
    viewUserProfile(user) {
      this.$router.push(`/profile/${user.id}`)
    },
    
    async toggleUserStatus(user) {
      try {
        const newStatus = !user.is_active
        const confirmMessage = newStatus 
          ? `هل تريد تفعيل المستخدم "${user.name}"؟`
          : `هل تريد تعطيل المستخدم "${user.name}"؟`
        
        if (!confirm(confirmMessage)) return
        
        await this.updateUserStatus({
          userId: user.id,
          isActive: newStatus
        })
        
        this.showToast(
          `تم ${newStatus ? 'تفعيل' : 'تعطيل'} المستخدم بنجاح`,
          'success'
        )
        
      } catch (error) {
        console.error('Error toggling user status:', error)
        this.showToast('فشل في تغيير حالة المستخدم', 'error')
      }
    },
    
    openDeleteModal(user = null) {
      const hasUserToDelete = user !== null
      const hasSelectedUsers = this.selectedUsers.length > 0
      
      if (!hasUserToDelete && !hasSelectedUsers) {
        return
      }
      
      if (!hasUserToDelete && hasSelectedUsers) {
        const selectedUserObjects = this.allUsers.filter(u => this.selectedUsers.includes(u.id))
        if (selectedUserObjects.length === 0) {
          return
        }
      }
      
      this.userToDelete = user
      this.deleteModalVisible = true
      this.activeDropdown = null
    },
    
    cancelDelete() {
      this.userToDelete = null
      this.deleteModalVisible = false
    },
    
    async confirmDelete() {
      try {
        this.deleting = true
        
        const usersToDelete = this.userToDelete 
          ? [this.userToDelete] 
          : this.allUsers.filter(user => this.selectedUsers.includes(user.id))
        
        if (usersToDelete.length > 1) {
          const confirmMessage = `هل أنت متأكد من حذف ${usersToDelete.length} مستخدمين؟\n\n` +
            usersToDelete.slice(0, 3).map(u => `• ${u.name} (${u.email})`).join('\n') +
            (usersToDelete.length > 3 ? `\n• +${usersToDelete.length - 3} مستخدمين آخرين` : '')
          
          if (!confirm(confirmMessage)) {
            this.cancelDelete()
            return
          }
        }
        
        const deletePromises = usersToDelete.map(user => 
          this.deleteUser(user.id).catch(error => {
            console.error(`Error deleting user ${user.id}:`, error)
            return { success: false, user, error }
          })
        )
        
        const results = await Promise.all(deletePromises)
        
        const failedDeletions = results.filter(r => !r.success)
        
        if (failedDeletions.length > 0) {
          const failedNames = failedDeletions.map(f => f.user.name).join(', ')
          this.showToast(`فشل حذف بعض المستخدمين: ${failedNames}`, 'error')
        } else {
          const message = usersToDelete.length === 1 
            ? `تم حذف المستخدم "${usersToDelete[0].name}" بنجاح`
            : `تم حذف ${usersToDelete.length} مستخدمين بنجاح`
          
          this.showToast(message, 'success')
        }
        
        this.selectedUsers = this.selectedUsers.filter(id => 
          !usersToDelete.some(user => user.id === id)
        )
        
      } catch (error) {
        console.error('Error confirming delete:', error)
        this.showToast('حدث خطأ أثناء حذف المستخدمين', 'error')
      } finally {
        this.deleting = false
        this.cancelDelete()
      }
    },
    
    // Bulk Actions
    async bulkActivate() {
      if (this.selectedUsers.length === 0) return
      
      try {
        const confirmMessage = `هل تريد تفعيل ${this.selectedUsers.length} مستخدمين؟`
        if (!confirm(confirmMessage)) return
        
        const activatePromises = this.selectedUsers.map(userId => 
          this.updateUserStatus({ userId, isActive: true })
        )
        
        await Promise.all(activatePromises)
        
        this.showToast(
          `تم تفعيل ${this.selectedUsers.length} مستخدمين بنجاح`,
          'success'
        )
        
        this.clearSelection()
        
      } catch (error) {
        console.error('Error bulk activating users:', error)
        this.showToast('فشل في تفعيل المستخدمين', 'error')
      }
    },
    
    async bulkDeactivate() {
      if (this.selectedUsers.length === 0) return
      
      try {
        const confirmMessage = `هل تريد تعطيل ${this.selectedUsers.length} مستخدمين؟`
        if (!confirm(confirmMessage)) return
        
        const deactivatePromises = this.selectedUsers.map(userId => 
          this.updateUserStatus({ userId, isActive: false })
        )
        
        await Promise.all(deactivatePromises)
        
        this.showToast(
          `تم تعطيل ${this.selectedUsers.length} مستخدمين بنجاح`,
          'success'
        )
        
        this.clearSelection()
        
      } catch (error) {
        console.error('Error bulk deactivating users:', error)
        this.showToast('فشل في تعطيل المستخدمين', 'error')
      }
    },
    
    bulkDelete() {
      if (this.selectedUsers.length === 0) return
      
      const usersToDelete = this.allUsers.filter(user => 
        this.selectedUsers.includes(user.id)
      )
      
      this.userToDelete = null
      this.openDeleteModal()
    },
    
    // Reset Password
    resetPassword(user) {
      this.userToReset = user
      this.resetMethod = 'auto'
      this.newPassword = ''
      this.confirmNewPassword = ''
      this.showNewPassword = false
      this.showConfirmNewPassword = false
      this.sendResetNotification = true
      this.passwordMatchError = ''
      this.showResetPasswordModal = true
      this.activeDropdown = null
    },
    
    cancelResetPassword() {
      this.userToReset = null
      this.showResetPasswordModal = false
    },
    
    async confirmResetPassword() {
      try {
        if (this.resetMethod === 'manual') {
          if (!this.newPassword || !this.confirmNewPassword) {
            this.passwordMatchError = 'يجب إدخال كلمة المرور وتأكيدها'
            return
          }
          
          if (this.newPassword !== this.confirmNewPassword) {
            this.passwordMatchError = 'كلمات المرور غير متطابقة'
            return
          }
          
          if (this.newPasswordStrength.class === 'weak') {
            this.passwordMatchError = 'كلمة المرور ضعيفة جداً'
            return
          }
        }
        
        this.resetting = true
        
        const password = this.resetMethod === 'auto' 
          ? this.generateRandomPassword()
          : this.newPassword
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        let message = `تم إعادة تعيين كلمة مرور المستخدم "${this.userToReset.name}"`
        
        if (this.resetMethod === 'auto') {
          message += `. كلمة المرور الجديدة: ${password}`
          if (this.sendResetNotification) {
            message += ' (تم إرسالها بالبريد)'
          }
        }
        
        this.showToast(message, 'success')
        
        this.cancelResetPassword()
        
      } catch (error) {
        console.error('Error resetting password:', error)
        this.showToast('فشل في إعادة تعيين كلمة المرور', 'error')
      } finally {
        this.resetting = false
      }
    },
    
    generateRandomPassword() {
      const length = 12
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
      let password = ''
      for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length))
      }
      return password
    },
    
    calculatePasswordStrength(password) {
      if (!password) return { class: 'weak', percentage: 0, text: 'ضعيفة' }
      
      let strength = 0
      if (password.length >= 8) strength += 25
      if (/[A-Z]/.test(password)) strength += 25
      if (/[0-9]/.test(password)) strength += 25
      if (/[^A-Za-z0-9]/.test(password)) strength += 25
      
      if (strength >= 75) return { class: 'strong', percentage: 100, text: 'قوية' }
      if (strength >= 50) return { class: 'medium', percentage: 66, text: 'متوسطة' }
      return { class: 'weak', percentage: 33, text: 'ضعيفة' }
    },
    
    // Impersonation
    impersonateUser(user) {
      if (user.id === this.currentUserId) {
        this.showToast('لا يمكنك الدخول كمستخدم نفسك', 'warning')
        return
      }
      
      this.userToImpersonate = user
      this.showImpersonateModal = true
      this.activeDropdown = null
    },
    
    cancelImpersonate() {
      this.userToImpersonate = null
      this.showImpersonateModal = false
    },
    
    confirmImpersonate() {
      this.showToast(`تم الدخول كمستخدم ${this.userToImpersonate.name}`, 'success')
      this.cancelImpersonate()
    },
    
    // User Modal Management
    closeUserModal() {
      this.showCreateModal = false
      this.editingUser = null
    },
    
    handleUserSuccess({ user, password, isEdit }) {
      const message = isEdit 
        ? `تم تحديث المستخدم "${user.name}" بنجاح`
        : `تم إنشاء المستخدم "${user.name}" بنجاح`
      
      this.showToast(message, 'success')
      
      if (password) {
        this.showToast(`كلمة المرور للمستخدم: ${password}`, 'info')
      }
      
      this.closeUserModal()
      this.refreshData()
    },
    
    handleUserCompleted() {
      this.closeUserModal()
    },
    
    // Export
    async exportUsers() {
      try {
        this.exporting = true
        
        const exportData = this.filteredUsers.map(user => ({
          'الاسم': user.name,
          'البريد الإلكتروني': user.email,
          'الدور': this.getRoleName(user.role),
          'الحالة': user.is_active !== false ? 'نشط' : 'معطل',
          'المخازن المسموحة': user.allowed_warehouses?.includes('all') 
            ? 'جميع المخازن' 
            : (user.allowed_warehouses?.map(id => this.getWarehouseName(id)).join(', ') || 'لا توجد'),
          'الصلاحيات': user.permissions?.includes('full_access')
            ? 'صلاحية كاملة'
            : (user.permissions?.length || 0) + ' صلاحية',
          'تاريخ الإنشاء': this.formatDate(user.created_at),
          'آخر تحديث': user.updated_at ? this.formatDate(user.updated_at) : 'غير متاح',
          'آخر دخول': user.last_login ? this.formatDate(user.last_login) : 'غير متاح',
          'ملاحظات': user.notes || ''
        }))
        
        const headers = Object.keys(exportData[0])
        const csvContent = [
          headers.join(','),
          ...exportData.map(row => 
            headers.map(header => `"${row[header] || ''}"`).join(',')
          )
        ].join('\n')
        
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        
        link.setAttribute('href', url)
        link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        this.showToast(`تم تصدير ${exportData.length} مستخدم`, 'success')
        
      } catch (error) {
        console.error('Error exporting users:', error)
        this.showToast('فشل في تصدير البيانات', 'error')
      } finally {
        this.exporting = false
      }
    },
    
    async exportSelected() {
      if (this.selectedUsers.length === 0) return
      
      const originalFilters = { ...this.filters }
      this.filters = {
        ...this.filters,
        search: '',
        role: '',
        status: '',
        warehouse: ''
      }
      
      await this.$nextTick()
      
      await this.exportUsers()
      
      this.filters = originalFilters
    },
    
    // Pagination
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    
    goToPage(page) {
      if (page !== '...') {
        this.currentPage = page
      }
    },
    
    // Toast Notifications
    showToast(message, type = 'success') {
      this.toast = {
        show: true,
        type,
        message,
        icon: type === 'success' ? 'fas fa-check-circle' : 
              type === 'error' ? 'fas fa-exclamation-circle' : 
              type === 'warning' ? 'fas fa-exclamation-triangle' :
              'fas fa-info-circle'
      }
      
      setTimeout(() => {
        this.hideToast()
      }, 5000)
    },
    
    hideToast() {
      this.toast.show = false
    },
    
    // Load users for error retry
    async loadUsers() {
      await this.init()
    }
  },
  
  created() {
    this.init()
  },
  
  mounted() {
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.dropdown')) {
        this.activeDropdown = null
      }
    })
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.isDarkMode = e.matches
        this.applyTheme()
      }
    })
  },
  
  beforeDestroy() {
    this.closeUserModal()
    this.cancelDelete()
    this.cancelResetPassword()
    this.cancelImpersonate()
  }
}
</script>

<style scoped>
/* Base Layout */
.user-management {
  min-height: 100vh;
  background: var(--bg-primary, #f5f5f5);
  color: var(--text-primary, #333);
  transition: all 0.3s ease;
  font-family: 'Tajawal', 'Segoe UI', sans-serif;
  direction: rtl;
}

.user-management.dark-mode {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --bg-card: #2d2d2d;
  --bg-input: #3d3d3d;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --text-muted: #888888;
  --border-color: #404040;
  --shadow-color: rgba(0, 0, 0, 0.3);
  --success-color: #4CAF50;
  --warning-color: #FF9800;
  --error-color: #f44336;
  --info-color: #2196F3;
  --primary-color: #2196F3;
  --secondary-color: #FF9800;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.spinner-container {
  text-align: center;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.loading-text {
  font-size: 1.125rem;
  font-weight: 500;
}

/* Error State */
.error-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.error-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 20px var(--shadow-color);
}

.error-icon {
  font-size: 4rem;
  color: var(--error-color);
  margin-bottom: 1.5rem;
}

.error-card h2 {
  margin: 0 0 1rem;
  color: var(--text-primary);
}

.error-message {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* Main Content */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
}

/* Header Section */
.header-section {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-info {
  flex: 1;
  min-width: 300px;
}

.page-title {
  font-size: 2rem;
  margin: 0 0 0.5rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-subtitle {
  color: var(--text-secondary);
  margin: 0;
  font-size: 1.125rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.theme-toggle {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  width: 45px;
  height: 45px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.3s;
  flex-shrink: 0;
}

.theme-toggle:hover {
  background: var(--primary-color);
  color: white;
  transform: rotate(15deg);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: 0 2px 8px var(--shadow-color);
  transition: transform 0.3s;
  min-width: 0;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  min-width: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: white;
}

.total-users { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.active-users { background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%); }
.inactive-users { background: linear-gradient(135deg, #f44336 0%, #c62828 100%); }
.superadmins { background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); }

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-content h3 {
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-number {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
}

/* Filters Section */
.filters-section {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.filter-group input,
.filter-group select {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-input);
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: all 0.3s;
  width: 100%;
  min-width: 0;
}

.filter-group input:focus,
.filter-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

/* Search Input */
.search-input {
  position: relative;
  width: 100%;
}

.search-input input {
  width: 100%;
  padding-left: 2.5rem;
}

.search-input::before {
  content: '\f002';
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

.clear-search {
  position: absolute;
  left: 2.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  z-index: 1;
}

/* Date Range */
.date-range .date-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.date-inputs input {
  flex: 1;
  min-width: 120px;
}

.date-separator {
  color: var(--text-secondary);
  font-size: 0.875rem;
  white-space: nowrap;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.bulk-actions-container {
  position: relative;
}

.bulk-actions-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem;
  margin-top: 0.5rem;
  box-shadow: 0 4px 12px var(--shadow-color);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 200px;
}

.bulk-action-btn {
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  text-align: right;
  color: var(--text-primary);
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.bulk-action-btn:hover:not(:disabled) {
  background: var(--bg-input);
}

.bulk-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bulk-action-btn.danger {
  color: var(--error-color);
}

.bulk-action-btn.info {
  color: var(--info-color);
}

/* Buttons */
.btn-primary,
.btn-secondary,
.btn-success,
.btn-info,
.btn-danger,
.btn-warning {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
  border: none;
  font-size: 0.95rem;
  white-space: nowrap;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color) 0%, #1976D2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--bg-input);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--border-color, #e0e0e0);
  transform: translateY(-2px);
}

.btn-success {
  background: linear-gradient(135deg, var(--success-color) 0%, #388E3C 100%);
  color: white;
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.btn-info {
  background: linear-gradient(135deg, var(--info-color) 0%, #0D47A1 100%);
  color: white;
}

.btn-info:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.btn-danger {
  background: linear-gradient(135deg, var(--error-color) 0%, #c62828 100%);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}

.btn-warning {
  background: linear-gradient(135deg, var(--warning-color) 0%, #ef6c00 100%);
  color: white;
}

.btn-warning:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Table Section */
.table-section {
  background: var(--bg-card);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.table-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.table-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.table-info h3 {
  margin: 0;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.table-count {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: normal;
}

.selection-info {
  background: rgba(33, 150, 243, 0.1);
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.clear-selection {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 0.875rem;
  text-decoration: underline;
  padding: 0.25rem;
  white-space: nowrap;
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.select-all-btn {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  white-space: nowrap;
}

.view-options {
  display: flex;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
}

.view-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 40px;
}

.view-btn.active {
  background: var(--primary-color);
  color: white;
}

.view-btn:hover:not(.active) {
  background: var(--bg-card);
}

/* Users Grid View */
.users-grid {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.user-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  min-height: 400px;
}

.user-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.user-card.selected {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

.user-card.inactive {
  opacity: 0.7;
  background: rgba(0, 0, 0, 0.05);
}

.dark .user-card.inactive {
  background: rgba(255, 255, 255, 0.05);
}

/* Card Header */
.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
}

.user-avatar-section {
  position: relative;
  flex-shrink: 0;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.user-status {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 16px;
  height: 16px;
  border: 2px solid var(--bg-card);
  border-radius: 50%;
}

.user-status.online {
  background: var(--success-color);
}

.user-status.offline {
  background: var(--error-color);
}

.user-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.select-user-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
}

.dropdown {
  position: relative;
}

.dropdown-toggle {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
}

.dropdown-menu {
  position: absolute;
  left: 0;
  top: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem;
  min-width: 160px;
  box-shadow: 0 4px 12px var(--shadow-color);
  z-index: 100;
}

.dropdown-item {
  background: none;
  border: none;
  color: var(--text-primary);
  padding: 0.75rem 1rem;
  text-align: right;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 6px;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.dropdown-item:hover {
  background: var(--bg-input);
}

.dropdown-item.danger {
  color: var(--error-color);
}

/* Card Body */
.card-body {
  padding: 1.5rem;
  flex: 1;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

.user-name {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
  line-height: 1.4;
}

.user-email {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.4;
}

.user-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.user-role {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.user-role.superadmin { background: rgba(255, 152, 0, 0.1); color: #ff9800; }
.user-role.company_manager { background: rgba(33, 150, 243, 0.1); color: #2196f3; }
.user-role.warehouse_manager { background: rgba(76, 175, 80, 0.1); color: #4caf50; }

.user-date {
  color: var(--text-secondary);
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.user-stats {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  white-space: nowrap;
}

.warehouses-preview {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
}

.warehouses-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  white-space: nowrap;
}

.warehouses-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.warehouse-tag {
  background: var(--bg-input);
  color: var(--text-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  white-space: nowrap;
}

.warehouse-tag.all {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.warehouse-tag.more {
  background: var(--primary-color);
  color: white;
}

/* Card Footer */
.card-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Users Table View */
.users-table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.users-table th {
  padding: 1rem;
  text-align: right;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-input);
  border-bottom: 1px solid var(--border-color);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.users-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  vertical-align: top;
}

.users-table tbody tr:hover {
  background: var(--bg-input);
}

.users-table tbody tr.selected {
  background: rgba(33, 150, 243, 0.05);
}

.users-table tbody tr.inactive {
  opacity: 0.7;
  background: rgba(0, 0, 0, 0.02);
}

.dark .users-table tbody tr.inactive {
  background: rgba(255, 255, 255, 0.02);
}

/* Table Cells */
.select-column {
  width: 40px;
}

.select-cell {
  text-align: center;
}

.select-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.user-column {
  min-width: 250px;
}

.user-info-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.user-avatar-sm {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
}

.user-name {
  margin: 0;
  font-size: 1rem;
  color: var(--text-primary);
  line-height: 1.4;
}

.current-user-badge {
  background: rgba(33, 150, 243, 0.1);
  color: var(--primary-color);
  padding: 0.125rem 0.5rem;
  border-radius: 20px;
  font-size: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
}

.user-email {
  margin: 0 0 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.4;
}

.user-meta-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.last-login {
  color: var(--text-secondary);
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
}

.role-column {
  min-width: 150px;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  white-space: nowrap;
}

.permissions-count {
  color: var(--text-secondary);
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
}

.warehouses-column {
  min-width: 200px;
}

.warehouses-list-table {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.all-warehouses {
  color: var(--success-color);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.warehouses-count {
  color: var(--text-secondary);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.warehouses-preview-table {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.warehouse-tag-sm {
  background: var(--bg-input);
  color: var(--text-primary);
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  white-space: nowrap;
}

.warehouse-more {
  color: var(--text-secondary);
  font-size: 0.75rem;
  white-space: nowrap;
}

.no-warehouses {
  color: var(--text-secondary);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.status-column {
  min-width: 120px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  white-space: nowrap;
}

.status-indicator.active {
  color: var(--success-color);
}

.status-indicator:not(.active) {
  color: var(--error-color);
}

.status-toggle-btn {
  background: none;
  border: 1px solid var(--border-color);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
}

.status-toggle-btn.success {
  color: var(--success-color);
  border-color: var(--success-color);
}

.status-toggle-btn.danger {
  color: var(--error-color);
  border-color: var(--error-color);
}

.date-column {
  min-width: 150px;
}

.date-display {
  color: var(--text-primary);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  white-space: nowrap;
}

.time-ago {
  color: var(--text-secondary);
  font-size: 0.75rem;
  white-space: nowrap;
}

.actions-column {
  min-width: 200px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn.edit:hover {
  background: var(--info-color);
  color: white;
}

.action-btn.view:hover {
  background: var(--success-color);
  color: white;
}

.action-btn.impersonate:hover:not(:disabled) {
  background: var(--warning-color);
  color: white;
}

.action-btn.impersonate:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.reset:hover {
  background: var(--primary-color);
  color: white;
}

.action-btn.delete:hover {
  background: var(--error-color);
  color: white;
}

/* Empty State */
.empty-state {
  padding: 4rem 2rem;
  text-align: center;
}

.empty-state-icon {
  font-size: 4rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem;
  color: var(--text-primary);
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

/* Pagination */
.pagination-section {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-info {
  color: var(--text-secondary);
  font-size: 0.875rem;
  white-space: nowrap;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.page-size-select {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  min-width: 120px;
}

.pagination-btn {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--primary-color);
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.page-number {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.page-number:hover:not(.disabled) {
  background: var(--primary-color);
  color: white;
}

.page-number.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.page-number.disabled {
  background: none;
  border: none;
  cursor: default;
}

/* Modals */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

.modal-container {
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
}

.modal-content {
  background: var(--bg-card);
  border-radius: 12px;
  box-shadow: 0 4px 20px var(--shadow-color);
  animation: slideUp 0.3s ease;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.modal-header h2 {
  margin: 0;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  flex-shrink: 0;
}

.modal-header.danger {
  background: rgba(244, 67, 54, 0.1);
  border-bottom-color: var(--error-color);
}

.modal-header.warning {
  background: rgba(255, 152, 0, 0.1);
  border-bottom-color: var(--warning-color);
}

.modal-body {
  padding: 1.5rem;
  max-height: calc(90vh - 120px);
  overflow-y: auto;
}

/* Delete Modal */
.delete-warning {
  text-align: center;
  margin-bottom: 2rem;
}

.delete-warning i {
  font-size: 4rem;
  color: var(--error-color);
  margin-bottom: 1rem;
}

.delete-warning h3 {
  margin: 0 0 1rem;
  color: var(--text-primary);
  line-height: 1.4;
}

.delete-warning p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.4;
}

.bulk-delete-warning {
  background: rgba(255, 152, 0, 0.1);
  color: var(--warning-color);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  line-height: 1.4;
}

.warning-list {
  background: var(--bg-input);
  border-radius: 8px;
  padding: 1rem;
  text-align: right;
}

.warning-list p {
  margin: 0.5rem 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1.4;
}

.delete-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Reset Password Modal */
.reset-info {
  text-align: center;
  margin-bottom: 2rem;
}

.reset-info i {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.reset-info h3 {
  margin: 0 0 0.5rem;
  color: var(--text-primary);
  line-height: 1.4;
}

.reset-info p {
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}

.reset-options {
  margin-bottom: 2rem;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.option-label {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.option-label:hover {
  border-color: var(--primary-color);
}

.option-label input {
  display: none;
}

.radio-custom {
  width: 20px;
  height: 20px;
  min-width: 20px;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.option-label input:checked + .radio-custom {
  border-color: var(--primary-color);
}

.option-label input:checked + .radio-custom::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--primary-color);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.option-content {
  flex: 1;
  min-width: 0;
}

.option-content h4 {
  margin: 0 0 0.25rem;
  color: var(--text-primary);
  font-size: 0.875rem;
  line-height: 1.4;
}

.option-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.75rem;
  line-height: 1.4;
}

.manual-password {
  background: var(--bg-input);
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.password-input {
  position: relative;
}

.password-input input {
  width: 100%;
  padding-left: 2.5rem;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 0.875rem;
}

.password-toggle {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
}

.password-strength {
  margin-top: 0.5rem;
  font-size: 0.75rem;
}

.strength-bar {
  height: 4px;
  background: var(--border-color);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s;
}

.password-strength.weak .strength-fill {
  background: var(--error-color);
  width: 33%;
}

.password-strength.medium .strength-fill {
  background: var(--warning-color);
  width: 66%;
}

.password-strength.strong .strength-fill {
  background: var(--success-color);
  width: 100%;
}

.error-message {
  color: var(--error-color);
  font-size: 0.75rem;
}

.notification-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-input);
  border-radius: 8px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  width: 100%;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  min-width: 20px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  position: relative;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.checkbox-label input {
  display: none;
}

.checkbox-label input:checked + .checkbox-custom {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.checkbox-label input:checked + .checkbox-custom::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-content {
  flex: 1;
  min-width: 0;
}

.checkbox-content h4 {
  margin: 0 0 0.25rem;
  color: var(--text-primary);
  font-size: 0.875rem;
  line-height: 1.4;
}

.checkbox-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.75rem;
  line-height: 1.4;
}

.reset-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
}

/* Impersonate Modal */
.impersonate-warning {
  text-align: center;
  margin-bottom: 2rem;
}

.impersonate-warning i {
  font-size: 4rem;
  color: var(--warning-color);
  margin-bottom: 1rem;
}

.impersonate-warning h3 {
  margin: 0 0 1rem;
  color: var(--text-primary);
  line-height: 1.4;
}

.impersonate-warning p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.4;
}

.impersonate-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Toast */
.toast-container {
  position: fixed;
  bottom: 2rem;
  left: 1rem;
  right: 1rem;
  max-width: 400px;
  margin: 0 auto;
  background: var(--bg-card);
  border-radius: 12px;
  box-shadow: 0 4px 20px var(--shadow-color);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: slideUp 0.3s ease;
  z-index: 2000;
}

.toast-container.success {
  border-right: 4px solid var(--success-color);
}

.toast-container.error {
  border-right: 4px solid var(--error-color);
}

.toast-container.warning {
  border-right: 4px solid var(--warning-color);
}

.toast-container.info {
  border-right: 4px solid var(--info-color);
}

.toast-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
}

.toast-content i {
  font-size: 1.5rem;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.toast-container.success .toast-content i { color: var(--success-color); }
.toast-container.error .toast-content i { color: var(--error-color); }
.toast-container.warning .toast-content i { color: var(--warning-color); }
.toast-container.info .toast-content i { color: var(--info-color); }

.toast-content p {
  margin: 0;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  margin-top: -0.25rem;
  flex-shrink: 0;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 1200px) {
  .users-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 992px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: flex-start;
  }
  
  .filters-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .users-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .bulk-actions-dropdown {
    position: static;
    margin-top: 1rem;
    width: 100%;
  }
  
  .table-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .table-actions {
    justify-content: space-between;
    width: 100%;
  }
  
  .users-table {
    min-width: 1000px;
  }
  
  .pagination-section {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .pagination-controls {
    justify-content: center;
    width: 100%;
  }
  
  .modal-container {
    margin: 0.5rem;
  }
}

@media (max-width: 576px) {
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-actions button {
    width: 100%;
    justify-content: center;
  }
  
  .theme-toggle {
    align-self: flex-end;
  }
  
  .user-actions {
    flex-direction: column;
    align-items: flex-end;
  }
  
  .card-footer {
    flex-direction: column;
  }
  
  .action-buttons {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .delete-actions,
  .reset-actions,
  .impersonate-actions {
    flex-direction: column;
  }
  
  .delete-actions button,
  .reset-actions button,
  .impersonate-actions button {
    width: 100%;
    justify-content: center;
  }
  
  .date-inputs {
    flex-direction: column;
  }
  
  .date-separator {
    text-align: center;
  }
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .btn-primary,
  .btn-secondary,
  .btn-success,
  .btn-info,
  .btn-danger,
  .btn-warning,
  .btn-sm,
  .select-all-btn,
  .view-btn,
  .select-user-btn,
  .dropdown-toggle,
  .dropdown-item,
  .bulk-action-btn,
  .status-toggle-btn,
  .action-btn,
  .pagination-btn,
  .page-number,
  .modal-close,
  .password-toggle,
  .toast-close {
    min-height: 44px;
    min-width: 44px;
  }
  
  .dropdown-item,
  .bulk-action-btn {
    padding: 1rem;
  }
  
  .user-card,
  .checkbox-item,
  .option-label {
    min-height: 44px;
  }
  
  .checkbox-custom,
  .radio-custom {
    min-width: 24px;
    min-height: 24px;
  }
  
  input[type="checkbox"],
  input[type="radio"] {
    min-width: 24px;
    min-height: 24px;
  }
}

/* Print Styles */
@media print {
  .user-management {
    background: white !important;
    color: black !important;
  }
  
  .no-print {
    display: none !important;
  }
  
  .header-actions,
  .theme-toggle,
  .quick-actions,
  .table-actions,
  .dropdown,
  .card-footer,
  .action-buttons,
  .pagination-section,
  .modal-overlay {
    display: none !important;
  }
  
  .stats-grid,
  .users-grid {
    break-inside: avoid;
  }
  
  .user-card {
    border: 1px solid #ddd !important;
    box-shadow: none !important;
    break-inside: avoid;
    margin-bottom: 1rem;
  }
  
  .users-table {
    width: 100%;
    border: 1px solid #ddd;
  }
  
  .users-table th,
  .users-table td {
    border: 1px solid #ddd;
    padding: 0.5rem;
  }
}
</style>
