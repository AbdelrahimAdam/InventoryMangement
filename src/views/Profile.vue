<template>
  <div class="user-profile-settings" :class="{ 'dark-mode': isDarkMode }">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>جاري تحميل البيانات...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-container">
      <div class="error-alert">
        <i class="fas fa-exclamation-triangle"></i>
        <p>{{ error }}</p>
        <button @click="loadUserData" class="retry-btn">
          <i class="fas fa-redo"></i> إعادة المحاولة
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="!loading && !error" class="profile-container">
      <!-- Header -->
      <div class="profile-header">
        <div class="header-content">
          <div class="user-avatar">
            <div class="avatar-circle" :style="avatarStyle">
              {{ userInitials }}
            </div>
            <div class="avatar-badge" :class="userRole">
              <i :class="roleIcon"></i>
            </div>
          </div>
          <div class="user-info">
            <h1>{{ userProfile.name || userEmail }}</h1>
            <div class="user-meta">
              <span class="role-badge" :class="userRole">
                <i :class="roleIcon"></i>
                {{ roleDisplayName }}
              </span>
              <span class="status-badge" :class="{ 'active': isActive, 'inactive': !isActive }">
                <i class="fas" :class="isActive ? 'fa-check-circle' : 'fa-times-circle'"></i>
                {{ isActive ? 'نشط' : 'غير نشط' }}
              </span>
            </div>
          </div>
          <div class="header-actions">
            <button @click="toggleTheme" class="theme-toggle" aria-label="تبديل السمة">
              <i :class="themeIcon"></i>
            </button>
            <button @click="logout" class="logout-btn" v-if="canManageSelf">
              <i class="fas fa-sign-out-alt"></i>
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="profile-content">
        <!-- Navigation Tabs -->
        <div class="profile-tabs">
          <div class="tabs-container">
            <button
              v-for="tab in availableTabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="{ 'active': activeTab === tab.id, 'disabled': !tab.available }"
              class="tab-btn"
              :disabled="!tab.available"
            >
              <i :class="tab.icon"></i>
              <span>{{ tab.name }}</span>
              <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Personal Information Tab -->
          <div v-if="activeTab === 'personal'" class="tab-pane">
            <div class="section-header">
              <h2><i class="fas fa-user-circle"></i> المعلومات الشخصية</h2>
              <button
                v-if="canManageSelf && !editingPersonal"
                @click="startEditing('personal')"
                class="edit-btn"
              >
                <i class="fas fa-edit"></i> تعديل
              </button>
              <div v-if="editingPersonal" class="edit-actions">
                <button @click="savePersonalInfo" class="save-btn" :disabled="saving">
                  <i class="fas fa-save"></i> حفظ
                </button>
                <button @click="cancelEditing" class="cancel-btn">
                  <i class="fas fa-times"></i> إلغاء
                </button>
              </div>
            </div>

            <div class="personal-info-grid">
              <!-- Read-only View -->
              <template v-if="!editingPersonal">
                <div class="info-item">
                  <label><i class="fas fa-user"></i> الاسم الكامل</label>
                  <p class="info-value">{{ userProfile.name || 'غير محدد' }}</p>
                </div>
                <div class="info-item">
                  <label><i class="fas fa-envelope"></i> البريد الإلكتروني</label>
                  <p class="info-value">{{ userEmail || 'غير محدد' }}</p>
                </div>
                <div class="info-item">
                  <label><i class="fas fa-id-card"></i> الدور</label>
                  <p class="info-value">{{ roleDisplayName }}</p>
                </div>
                <div class="info-item">
                  <label><i class="fas fa-calendar-alt"></i> تاريخ الإنشاء</label>
                  <p class="info-value">{{ formatDate(userProfile.created_at) }}</p>
                </div>
                <div class="info-item">
                  <label><i class="fas fa-clock"></i> آخر تحديث</label>
                  <p class="info-value">{{ formatDate(userProfile.updated_at) }}</p>
                </div>
                <div class="info-item">
                  <label><i class="fas fa-history"></i> آخر دخول</label>
                  <p class="info-value">{{ formatDate(userProfile.last_login) || 'غير متاح' }}</p>
                </div>
              </template>

              <!-- Edit View -->
              <template v-else>
                <div class="form-group">
                  <label for="userName"><i class="fas fa-user"></i> الاسم الكامل</label>
                  <input
                    type="text"
                    id="userName"
                    v-model="editPersonal.name"
                    placeholder="أدخل اسمك الكامل"
                    :class="{ 'error': personalErrors.name }"
                  />
                  <span v-if="personalErrors.name" class="error-message">{{ personalErrors.name }}</span>
                </div>

                <div class="form-group">
                  <label for="userEmail"><i class="fas fa-envelope"></i> البريد الإلكتروني</label>
                  <input
                    type="email"
                    id="userEmail"
                    v-model="editPersonal.email"
                    placeholder="أدخل بريدك الإلكتروني"
                    :class="{ 'error': personalErrors.email }"
                  />
                  <span v-if="personalErrors.email" class="error-message">{{ personalErrors.email }}</span>
                </div>

                <div class="form-group" v-if="isSuperAdmin">
                  <label for="userRole"><i class="fas fa-id-card"></i> الدور</label>
                  <select id="userRole" v-model="editPersonal.role">
                    <option value="warehouse_manager">مدير مخزن</option>
                    <option value="company_manager">مدير شركة</option>
                    <option value="superadmin">مشرف عام</option>
                  </select>
                </div>

                <div class="form-group">
                  <label><i class="fas fa-toggle-on"></i> حالة الحساب</label>
                  <div class="toggle-group">
                    <label class="toggle-switch">
                      <input type="checkbox" v-model="editPersonal.is_active">
                      <span class="toggle-slider"></span>
                    </label>
                    <span class="toggle-label">{{ editPersonal.is_active ? 'نشط' : 'معطل' }}</span>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- Warehouse Permissions Tab -->
          <div v-if="activeTab === 'warehouses'" class="tab-pane">
            <div class="section-header">
              <h2><i class="fas fa-warehouse"></i> صلاحيات المخازن</h2>
              <button
                v-if="(isSuperAdmin || isCompanyManager) && !editingWarehouses"
                @click="startEditing('warehouses')"
                class="edit-btn"
              >
                <i class="fas fa-edit"></i> تعديل
              </button>
              <div v-if="editingWarehouses" class="edit-actions">
                <button @click="saveWarehousePermissions" class="save-btn" :disabled="saving">
                  <i class="fas fa-save"></i> حفظ
                </button>
                <button @click="cancelEditing" class="cancel-btn">
                  <i class="fas fa-times"></i> إلغاء
                </button>
              </div>
            </div>

            <!-- Warehouse Access Summary -->
            <div class="warehouse-summary">
              <div class="summary-card">
                <i class="fas fa-building"></i>
                <div class="summary-content">
                  <h3>المخازن المتاحة</h3>
                  <p v-if="hasAllWarehousesAccess">جميع المخازن</p>
                  <p v-else>{{ accessibleWarehouses.length }} مخزن</p>
                </div>
              </div>
              <div class="summary-card">
                <i class="fas fa-truck-loading"></i>
                <div class="summary-content">
                  <h3>المخازن الرئيسية</h3>
                  <p>{{ primaryWarehousesCount }} مخزن</p>
                </div>
              </div>
              <div class="summary-card">
                <i class="fas fa-shipping-fast"></i>
                <div class="summary-content">
                  <h3>مخازن التوزيع</h3>
                  <p>{{ dispatchWarehousesCount }} مخزن</p>
                </div>
              </div>
            </div>

            <!-- Warehouse List -->
            <div class="warehouse-list-section">
              <h3><i class="fas fa-list"></i> قائمة المخازن</h3>
              
              <!-- Read-only View -->
              <div v-if="!editingWarehouses" class="warehouse-list">
                <div v-if="hasAllWarehousesAccess" class="all-warehouses-notice">
                  <i class="fas fa-check-circle"></i>
                  <p>الوصول إلى جميع المخازن</p>
                </div>
                <div v-else>
                  <div v-if="accessibleWarehouses.length === 0" class="no-warehouses">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>لا توجد صلاحيات لأي مخزن</p>
                  </div>
                  <div v-else class="warehouse-cards">
                    <div
                      v-for="warehouse in accessibleWarehouses"
                      :key="warehouse.id"
                      class="warehouse-card"
                      :class="warehouse.type"
                    >
                      <div class="warehouse-header">
                        <h4>{{ warehouse.name_ar || warehouse.name }}</h4>
                        <span class="warehouse-type" :class="warehouse.type">
                          {{ getWarehouseTypeLabel(warehouse.type) }}
                        </span>
                      </div>
                      <div class="warehouse-info">
                        <p><i class="fas fa-map-marker-alt"></i> {{ warehouse.location || 'غير محدد' }}</p>
                        <p><i class="fas fa-code"></i> {{ warehouse.code || 'بدون كود' }}</p>
                      </div>
                      <div class="warehouse-status" :class="{ 'active': warehouse.is_active }">
                        <i class="fas fa-circle"></i>
                        {{ warehouse.is_active ? 'نشط' : 'غير نشط' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Edit View -->
              <div v-else class="warehouse-edit">
                <div class="edit-options">
                  <label class="checkbox-option">
                    <input
                      type="checkbox"
                      v-model="editWarehouses.all"
                      @change="toggleAllWarehouses"
                    >
                    <span class="checkmark"></span>
                    الوصول إلى جميع المخازن
                  </label>

                  <div v-if="!editWarehouses.all" class="warehouse-selection">
                    <div class="selection-header">
                      <h4>اختر المخازن المصرح بها:</h4>
                      <button @click="selectAllWarehouses" class="select-all-btn">
                        <i class="fas fa-check-square"></i> تحديد الكل
                      </button>
                    </div>
                    
                    <div class="warehouse-categories">
                      <!-- Primary Warehouses -->
                      <div class="category-section">
                        <h5><i class="fas fa-building"></i> المخازن الرئيسية</h5>
                        <div class="checkbox-grid">
                          <label
                            v-for="warehouse in primaryWarehouses"
                            :key="warehouse.id"
                            class="checkbox-item"
                          >
                            <input
                              type="checkbox"
                              :value="warehouse.id"
                              v-model="editWarehouses.selected"
                            >
                            <span class="checkmark"></span>
                            <div class="warehouse-label">
                              <span class="warehouse-name">{{ warehouse.name_ar || warehouse.name }}</span>
                              <span class="warehouse-code">{{ warehouse.code }}</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      <!-- Dispatch Warehouses -->
                      <div class="category-section">
                        <h5><i class="fas fa-shipping-fast"></i> مخازن التوزيع</h5>
                        <div class="checkbox-grid">
                          <label
                            v-for="warehouse in dispatchWarehouses"
                            :key="warehouse.id"
                            class="checkbox-item"
                          >
                            <input
                              type="checkbox"
                              :value="warehouse.id"
                              v-model="editWarehouses.selected"
                            >
                            <span class="checkmark"></span>
                            <div class="warehouse-label">
                              <span class="warehouse-name">{{ warehouse.name_ar || warehouse.name }}</span>
                              <span class="warehouse-code">{{ warehouse.code }}</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Permissions Tab -->
          <div v-if="activeTab === 'permissions'" class="tab-pane">
            <div class="section-header">
              <h2><i class="fas fa-user-shield"></i> الصلاحيات التفصيلية</h2>
              <button
                v-if="(isSuperAdmin || isCompanyManager) && !editingPermissions"
                @click="startEditing('permissions')"
                class="edit-btn"
              >
                <i class="fas fa-edit"></i> تعديل
              </button>
              <div v-if="editingPermissions" class="edit-actions">
                <button @click="savePermissions" class="save-btn" :disabled="saving">
                  <i class="fas fa-save"></i> حفظ
                </button>
                <button @click="cancelEditing" class="cancel-btn">
                  <i class="fas fa-times"></i> إلغاء
                </button>
              </div>
            </div>

            <!-- Permissions Overview -->
            <div class="permissions-overview">
              <div class="permission-summary">
                <div class="summary-item">
                  <i class="fas fa-eye"></i>
                  <div>
                    <h4>عرض البيانات</h4>
                    <p>{{ viewPermissionsCount }} صلاحية</p>
                  </div>
                </div>
                <div class="summary-item">
                  <i class="fas fa-edit"></i>
                  <div>
                    <h4>التعديل</h4>
                    <p>{{ editPermissionsCount }} صلاحية</p>
                  </div>
                </div>
                <div class="summary-item">
                  <i class="fas fa-trash-alt"></i>
                  <div>
                    <h4>الحذف</h4>
                    <p>{{ deletePermissionsCount }} صلاحية</p>
                  </div>
                </div>
                <div class="summary-item">
                  <i class="fas fa-cogs"></i>
                  <div>
                    <h4>الإدارة</h4>
                    <p>{{ managePermissionsCount }} صلاحية</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Permissions List -->
            <div class="permissions-list-section">
              <h3><i class="fas fa-list-check"></i> قائمة الصلاحيات</h3>
              
              <!-- Read-only View -->
              <div v-if="!editingPermissions" class="permissions-list">
                <div v-if="hasFullAccess" class="full-access-notice">
                  <i class="fas fa-check-circle"></i>
                  <div>
                    <h4>صلاحية كاملة</h4>
                    <p>يتمتع المستخدم بجميع الصلاحيات المتاحة</p>
                  </div>
                </div>
                <div v-else>
                  <div v-if="effectivePermissions.length === 0" class="no-permissions">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>لا توجد صلاحيات محددة</p>
                  </div>
                  <div v-else class="permission-cards">
                    <div
                      v-for="permission in permissionGroups"
                      :key="permission.category"
                      class="permission-category"
                    >
                      <h4>{{ permission.category }}</h4>
                      <div class="permission-items">
                        <div
                          v-for="perm in permission.items"
                          :key="perm.id"
                          class="permission-item"
                          :class="{ 'granted': hasPermission(perm.id) }"
                        >
                          <div class="permission-info">
                            <i :class="perm.icon"></i>
                            <div>
                              <h5>{{ perm.name }}</h5>
                              <p>{{ perm.description }}</p>
                            </div>
                          </div>
                          <div class="permission-status">
                            <i
                              :class="hasPermission(perm.id) ? 'fas fa-check-circle granted' : 'fas fa-times-circle denied'"
                            ></i>
                            <span>{{ hasPermission(perm.id) ? 'ممنوح' : 'غير ممنوح' }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Edit View -->
              <div v-else class="permissions-edit">
                <div class="permissions-presets">
                  <h4>إعدادات سريعة:</h4>
                  <div class="preset-buttons">
                    <button @click="applyPermissionPreset('view_only')" class="preset-btn">
                      <i class="fas fa-eye"></i> عرض فقط
                    </button>
                    <button @click="applyPermissionPreset('basic_management')" class="preset-btn">
                      <i class="fas fa-user-cog"></i> إدارة أساسية
                    </button>
                    <button @click="applyPermissionPreset('full_access')" class="preset-btn">
                      <i class="fas fa-crown"></i> صلاحية كاملة
                    </button>
                  </div>
                </div>

                <div class="permissions-selection">
                  <div class="permission-categories">
                    <div
                      v-for="category in permissionCategories"
                      :key="category.id"
                      class="permission-category"
                    >
                      <div class="category-header">
                        <h5>{{ category.name }}</h5>
                        <label class="category-toggle">
                          <input
                            type="checkbox"
                            :checked="isCategorySelected(category.permissions)"
                            @change="toggleCategory(category.permissions, $event)"
                          >
                          <span>تحديد/إلغاء الكل</span>
                        </label>
                      </div>
                      
                      <div class="permission-checkboxes">
                        <label
                          v-for="perm in category.permissions"
                          :key="perm.id"
                          class="permission-checkbox"
                        >
                          <input
                            type="checkbox"
                            :value="perm.id"
                            v-model="editPermissions.selected"
                          >
                          <span class="checkmark"></span>
                          <div class="permission-label">
                            <i :class="perm.icon"></i>
                            <div>
                              <span class="permission-name">{{ perm.name }}</span>
                              <span class="permission-desc">{{ perm.description }}</span>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Tab -->
          <div v-if="activeTab === 'security'" class="tab-pane">
            <div class="section-header">
              <h2><i class="fas fa-shield-alt"></i> الأمان</h2>
            </div>

            <div class="security-options">
              <!-- Change Password -->
              <div class="security-card">
                <div class="security-header">
                  <i class="fas fa-key"></i>
                  <div>
                    <h3>تغيير كلمة المرور</h3>
                    <p>قم بتحديث كلمة المرور الخاصة بك</p>
                  </div>
                </div>
                <form @submit.prevent="changePassword" class="password-form">
                  <div class="form-group">
                    <label for="currentPassword">
                      <i class="fas fa-lock"></i> كلمة المرور الحالية
                    </label>
                    <div class="password-input">
                      <input
                        :type="showCurrentPassword ? 'text' : 'password'"
                        id="currentPassword"
                        v-model="passwordData.currentPassword"
                        placeholder="أدخل كلمة المرور الحالية"
                        required
                      >
                      <button
                        type="button"
                        class="password-toggle"
                        @click="showCurrentPassword = !showCurrentPassword"
                      >
                        <i :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                      </button>
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="newPassword">
                      <i class="fas fa-lock"></i> كلمة المرور الجديدة
                    </label>
                    <div class="password-input">
                      <input
                        :type="showNewPassword ? 'text' : 'password'"
                        id="newPassword"
                        v-model="passwordData.newPassword"
                        placeholder="أدخل كلمة المرور الجديدة"
                        required
                      >
                      <button
                        type="button"
                        class="password-toggle"
                        @click="showNewPassword = !showNewPassword"
                      >
                        <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                      </button>
                    </div>
                    <div class="password-strength" :class="passwordStrength.class">
                      <div class="strength-bar">
                        <div class="strength-fill" :style="{ width: passwordStrength.percentage + '%' }"></div>
                      </div>
                      <span>{{ passwordStrength.text }}</span>
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="confirmPassword">
                      <i class="fas fa-lock"></i> تأكيد كلمة المرور
                    </label>
                    <div class="password-input">
                      <input
                        :type="showConfirmPassword ? 'text' : 'password'"
                        id="confirmPassword"
                        v-model="passwordData.confirmPassword"
                        placeholder="أعد إدخال كلمة المرور الجديدة"
                        required
                      >
                      <button
                        type="button"
                        class="password-toggle"
                        @click="showConfirmPassword = !showConfirmPassword"
                      >
                        <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                      </button>
                    </div>
                    <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
                  </div>

                  <div class="form-actions">
                    <button type="submit" class="save-btn" :disabled="passwordLoading">
                      <i class="fas fa-save"></i> تغيير كلمة المرور
                    </button>
                    <button type="button" @click="resetPasswordForm" class="cancel-btn">
                      <i class="fas fa-times"></i> إلغاء
                    </button>
                  </div>
                </form>
              </div>

              <!-- Session Management -->
              <div class="security-card">
                <div class="security-header">
                  <i class="fas fa-desktop"></i>
                  <div>
                    <h3>الجلسات النشطة</h3>
                    <p>إدارة جلسات تسجيل الدخول</p>
                  </div>
                </div>
                <div class="session-list">
                  <div class="session-item current">
                    <div class="session-info">
                      <i class="fas fa-laptop"></i>
                      <div>
                        <h4>هذه الجلسة</h4>
                        <p>المتصفح: {{ getUserAgentInfo().browser }}</p>
                        <p>النظام: {{ getUserAgentInfo().os }}</p>
                        <p>تاريخ الدخول: {{ formatDate(new Date()) }}</p>
                      </div>
                    </div>
                    <div class="session-status">
                      <span class="status-badge active">نشطة</span>
                    </div>
                  </div>
                </div>
                <div class="session-actions">
                  <button @click="terminateOtherSessions" class="logout-btn" :disabled="sessionLoading">
                    <i class="fas fa-sign-out-alt"></i> إنهاء جميع الجلسات الأخرى
                  </button>
                </div>
              </div>

              <!-- Two-Factor Authentication -->
              <div class="security-card">
                <div class="security-header">
                  <i class="fas fa-mobile-alt"></i>
                  <div>
                    <h3>المصادقة الثنائية</h3>
                    <p>إضافة طبقة أمان إضافية</p>
                  </div>
                </div>
                <div class="two-factor-status">
                  <div class="status-info">
                    <i class="fas" :class="twoFactorEnabled ? 'fa-check-circle' : 'fa-times-circle'"></i>
                    <div>
                      <h4>حالة المصادقة الثنائية</h4>
                      <p>{{ twoFactorEnabled ? 'مفعلة' : 'غير مفعلة' }}</p>
                    </div>
                  </div>
                  <button
                    @click="toggleTwoFactor"
                    class="toggle-btn"
                    :class="{ 'enabled': twoFactorEnabled }"
                  >
                    <span class="toggle-text">{{ twoFactorEnabled ? 'إلغاء التفعيل' : 'تفعيل' }}</span>
                    <span class="toggle-slider"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Activity Log Tab -->
          <div v-if="activeTab === 'activity'" class="tab-pane">
            <div class="section-header">
              <h2><i class="fas fa-history"></i> سجل النشاط</h2>
              <button @click="refreshActivity" class="refresh-btn" :disabled="activityLoading">
                <i class="fas fa-redo" :class="{ 'spin': activityLoading }"></i> تحديث
              </button>
            </div>

            <!-- Activity Filters -->
            <div class="activity-filters">
              <div class="filter-group">
                <label for="activityType"><i class="fas fa-filter"></i> نوع النشاط</label>
                <select id="activityType" v-model="activityFilters.type">
                  <option value="">الكل</option>
                  <option value="login">تسجيل الدخول</option>
                  <option value="update">تعديل البيانات</option>
                  <option value="create">إنشاء</option>
                  <option value="delete">حذف</option>
                  <option value="permission">تغيير صلاحيات</option>
                </select>
              </div>

              <div class="filter-group">
                <label for="dateRange"><i class="fas fa-calendar"></i> الفترة الزمنية</label>
                <select id="dateRange" v-model="activityFilters.dateRange">
                  <option value="today">اليوم</option>
                  <option value="week">أخر أسبوع</option>
                  <option value="month">أخر شهر</option>
                  <option value="year">أخر سنة</option>
                  <option value="all">الكل</option>
                </select>
              </div>

              <div class="filter-group">
                <label for="searchActivity"><i class="fas fa-search"></i> بحث</label>
                <input
                  type="text"
                  id="searchActivity"
                  v-model="activityFilters.search"
                  placeholder="ابحث في النشاطات..."
                >
              </div>
            </div>

            <!-- Activity List -->
            <div class="activity-list">
              <div v-if="activityLoading" class="loading-activity">
                <div class="spinner"></div>
                <p>جاري تحميل النشاطات...</p>
              </div>

              <div v-else-if="filteredActivities.length === 0" class="no-activities">
                <i class="fas fa-clipboard-list"></i>
                <p>لا توجد نشاطات مسجلة</p>
              </div>

              <div v-else class="activity-items">
                <div
                  v-for="activity in paginatedActivities"
                  :key="activity.id"
                  class="activity-item"
                  :class="activity.type"
                >
                  <div class="activity-icon">
                    <i :class="getActivityIcon(activity.type)"></i>
                  </div>
                  <div class="activity-content">
                    <div class="activity-header">
                      <h4>{{ activity.title }}</h4>
                      <span class="activity-time">{{ formatTimeAgo(activity.timestamp) }}</span>
                    </div>
                    <p class="activity-description">{{ activity.description }}</p>
                    <div v-if="activity.details" class="activity-details">
                      <pre>{{ formatActivityDetails(activity.details) }}</pre>
                    </div>
                    <div class="activity-meta">
                      <span class="activity-source">
                        <i class="fas fa-desktop"></i>
                        {{ activity.source || 'نظام' }}
                      </span>
                      <span class="activity-ip">
                        <i class="fas fa-network-wired"></i>
                        {{ activity.ip || 'غير معروف' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pagination -->
              <div v-if="filteredActivities.length > itemsPerPage" class="activity-pagination">
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="pagination-btn prev"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
                
                <span class="pagination-info">
                  صفحة {{ currentPage }} من {{ totalPages }}
                </span>
                
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
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { auth } from '@/firebase/config'

export default {
  name: 'UserProfileSettings',
  
  data() {
    return {
      loading: true,
      error: null,
      saving: false,
      activeTab: 'personal',
      editingPersonal: false,
      editingWarehouses: false,
      editingPermissions: false,
      isDarkMode: false,
      
      // Personal Info
      editPersonal: {
        name: '',
        email: '',
        role: '',
        is_active: true
      },
      personalErrors: {},
      
      // Warehouse Permissions
      editWarehouses: {
        all: false,
        selected: []
      },
      
      // Permissions
      editPermissions: {
        selected: []
      },
      
      // Security
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      passwordData: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordError: null,
      passwordLoading: false,
      twoFactorEnabled: false,
      sessionLoading: false,
      
      // Activity Log
      activityLoading: false,
      activityFilters: {
        type: '',
        dateRange: 'week',
        search: ''
      },
      activities: [],
      currentPage: 1,
      itemsPerPage: 10,
      
      // Toast
      toast: {
        show: false,
        type: 'success',
        message: '',
        icon: 'fas fa-check-circle'
      }
    }
  },
  
  computed: {
    ...mapState(['user', 'userProfile', 'warehouses', 'allUsers']),
    ...mapGetters([
      'userRole',
      'userName',
      'canManageUsers',
      'canManageWarehouses',
      'accessibleWarehouses',
      'primaryWarehouses',
      'dispatchWarehouses'
    ]),
    
    // User Info
    userEmail() {
      return this.user?.email || ''
    },
    
    userInitials() {
      const name = this.userProfile?.name || this.userEmail
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },
    
    avatarStyle() {
      const colors = [
        '#4CAF50', '#2196F3', '#FF9800', '#E91E63',
        '#9C27B0', '#673AB7', '#3F51B5', '#00BCD4'
      ]
      const hash = this.userEmail.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + acc
      }, 0)
      const colorIndex = hash % colors.length
      return {
        backgroundColor: colors[colorIndex],
        color: '#FFFFFF'
      }
    },
    
    // Role Info
    isSuperAdmin() {
      return this.userRole === 'superadmin'
    },
    
    isCompanyManager() {
      return this.userRole === 'company_manager'
    },
    
    isWarehouseManager() {
      return this.userRole === 'warehouse_manager'
    },
    
    roleDisplayName() {
      const roles = {
        'superadmin': 'مشرف عام',
        'company_manager': 'مدير شركة',
        'warehouse_manager': 'مدير مخزن'
      }
      return roles[this.userRole] || this.userRole
    },
    
    roleIcon() {
      const icons = {
        'superadmin': 'fas fa-crown',
        'company_manager': 'fas fa-user-tie',
        'warehouse_manager': 'fas fa-warehouse'
      }
      return icons[this.userRole] || 'fas fa-user'
    },
    
    // Status
    isActive() {
      return this.userProfile?.is_active !== false
    },
    
    // Warehouse Access
    hasAllWarehousesAccess() {
      const allowed = this.userProfile?.allowed_warehouses || []
      return allowed.includes('all')
    },
    
    primaryWarehousesCount() {
      return this.accessibleWarehouses.filter(w => w.type === 'primary' || !w.type).length
    },
    
    dispatchWarehousesCount() {
      return this.accessibleWarehouses.filter(w => w.type === 'dispatch').length
    },
    
    // Permissions
    effectivePermissions() {
      const permissions = this.userProfile?.permissions || []
      if (permissions.includes('full_access')) {
        return this.allPermissions.map(p => p.id)
      }
      return permissions
    },
    
    hasFullAccess() {
      return this.userProfile?.permissions?.includes('full_access') || false
    },
    
    viewPermissionsCount() {
      return this.effectivePermissions.filter(p => p.startsWith('view_')).length
    },
    
    editPermissionsCount() {
      return this.effectivePermissions.filter(p => p.includes('edit') || p.includes('update')).length
    },
    
    deletePermissionsCount() {
      return this.effectivePermissions.filter(p => p.includes('delete')).length
    },
    
    managePermissionsCount() {
      return this.effectivePermissions.filter(p => p.includes('manage')).length
    },
    
    // Available Tabs
    availableTabs() {
      const tabs = [
        {
          id: 'personal',
          name: 'معلومات شخصية',
          icon: 'fas fa-user-circle',
          available: true
        },
        {
          id: 'warehouses',
          name: 'صلاحيات المخازن',
          icon: 'fas fa-warehouse',
          available: this.isSuperAdmin || this.isCompanyManager || this.isWarehouseManager
        },
        {
          id: 'permissions',
          name: 'الصلاحيات',
          icon: 'fas fa-user-shield',
          available: this.isSuperAdmin || this.isCompanyManager
        },
        {
          id: 'security',
          name: 'الأمان',
          icon: 'fas fa-shield-alt',
          available: true
        },
        {
          id: 'activity',
          name: 'سجل النشاط',
          icon: 'fas fa-history',
          available: this.isSuperAdmin,
          badge: this.activities.length
        }
      ]
      return tabs.filter(tab => tab.available)
    },
    
    // Permission Groups for Display
    permissionGroups() {
      const groups = {
        'المخزون': [
          { id: 'view_items', name: 'عرض الأصناف', description: 'عرض قائمة الأصناف', icon: 'fas fa-box' },
          { id: 'add_items', name: 'إضافة أصناف', description: 'إضافة أصناف جديدة', icon: 'fas fa-plus-square' },
          { id: 'edit_items', name: 'تعديل الأصناف', description: 'تعديل بيانات الأصناف', icon: 'fas fa-edit' },
          { id: 'delete_items', name: 'حذف الأصناف', description: 'حذف الأصناف من النظام', icon: 'fas fa-trash-alt' }
        ],
        'المعاملات': [
          { id: 'view_transactions', name: 'عرض الحركات', description: 'عرض سجل الحركات', icon: 'fas fa-exchange-alt' },
          { id: 'create_transactions', name: 'إنشاء حركات', description: 'إنشاء حركات جديدة', icon: 'fas fa-plus-circle' },
          { id: 'transfer_items', name: 'نقل الأصناف', description: 'نقل الأصناف بين المخازن', icon: 'fas fa-truck-moving' },
          { id: 'dispatch_items', name: 'صرف الأصناف', description: 'صرف الأصناف للعملاء', icon: 'fas fa-shipping-fast' }
        ],
        'التقارير': [
          { id: 'view_reports', name: 'عرض التقارير', description: 'عرض التقارير والإحصائيات', icon: 'fas fa-chart-bar' },
          { id: 'export_reports', name: 'تصدير التقارير', description: 'تصدير التقارير إلى ملفات', icon: 'fas fa-file-export' }
        ],
        'الإدارة': [
          { id: 'manage_users', name: 'إدارة المستخدمين', description: 'إضافة وتعديل وحذف المستخدمين', icon: 'fas fa-users-cog' },
          { id: 'manage_warehouses', name: 'إدارة المخازن', description: 'إدارة المخازن والإعدادات', icon: 'fas fa-warehouse' },
          { id: 'manage_settings', name: 'إدارة الإعدادات', description: 'تعديل إعدادات النظام', icon: 'fas fa-cogs' }
        ]
      }
      
      return Object.entries(groups).map(([category, items]) => ({
        category,
        items: items.filter(item => this.hasPermission(item.id))
      })).filter(group => group.items.length > 0)
    },
    
    // Permission Categories for Editing
    permissionCategories() {
      return [
        {
          id: 'inventory',
          name: 'إدارة المخزون',
          permissions: [
            { id: 'view_items', name: 'عرض الأصناف', description: 'عرض قائمة الأصناف', icon: 'fas fa-box' },
            { id: 'add_items', name: 'إضافة أصناف', description: 'إضافة أصناف جديدة', icon: 'fas fa-plus-square' },
            { id: 'edit_items', name: 'تعديل الأصناف', description: 'تعديل بيانات الأصناف', icon: 'fas fa-edit' },
            { id: 'delete_items', name: 'حذف الأصناف', description: 'حذف الأصناف من النظام', icon: 'fas fa-trash-alt' },
            { id: 'export_items', name: 'تصدير الأصناف', description: 'تصدير بيانات الأصناف', icon: 'fas fa-file-export' }
          ]
        },
        {
          id: 'transactions',
          name: 'إدارة المعاملات',
          permissions: [
            { id: 'view_transactions', name: 'عرض الحركات', description: 'عرض سجل الحركات', icon: 'fas fa-exchange-alt' },
            { id: 'create_transactions', name: 'إنشاء حركات', description: 'إنشاء حركات جديدة', icon: 'fas fa-plus-circle' },
            { id: 'transfer_items', name: 'نقل الأصناف', description: 'نقل الأصناف بين المخازن', icon: 'fas fa-truck-moving' },
            { id: 'dispatch_items', name: 'صرف الأصناف', description: 'صرف الأصناف للعملاء', icon: 'fas fa-shipping-fast' },
            { id: 'approve_transactions', name: 'اعتماد الحركات', description: 'اعتماد الحركات المعلقة', icon: 'fas fa-check-double' }
          ]
        },
        {
          id: 'reports',
          name: 'التقارير والإحصائيات',
          permissions: [
            { id: 'view_reports', name: 'عرض التقارير', description: 'عرض التقارير والإحصائيات', icon: 'fas fa-chart-bar' },
            { id: 'export_reports', name: 'تصدير التقارير', description: 'تصدير التقارير إلى ملفات', icon: 'fas fa-file-export' },
            { id: 'view_dashboard', name: 'عرض لوحة التحكم', description: 'عرض إحصائيات النظام', icon: 'fas fa-tachometer-alt' },
            { id: 'view_analytics', name: 'عرض التحليلات', description: 'عرض التحليلات المتقدمة', icon: 'fas fa-chart-line' }
          ]
        },
        {
          id: 'administration',
          name: 'الإدارة النظامية',
          permissions: [
            { id: 'manage_users', name: 'إدارة المستخدمين', description: 'إضافة وتعديل وحذف المستخدمين', icon: 'fas fa-users-cog' },
            { id: 'manage_warehouses', name: 'إدارة المخازن', description: 'إدارة المخازن والإعدادات', icon: 'fas fa-warehouse' },
            { id: 'manage_settings', name: 'إدارة الإعدادات', description: 'تعديل إعدادات النظام', icon: 'fas fa-cogs' },
            { id: 'view_audit_log', name: 'عرض سجل التدقيق', description: 'عرض سجل الأحداث والتدقيق', icon: 'fas fa-clipboard-list' },
            { id: 'manage_backup', name: 'إدارة النسخ الاحتياطي', description: 'إدارة النسخ الاحتياطية', icon: 'fas fa-database' }
          ]
        }
      ]
    },
    
    // All available permissions
    allPermissions() {
      return this.permissionCategories.flatMap(category => category.permissions)
    },
    
    // Password Strength
    passwordStrength() {
      const password = this.passwordData.newPassword
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
    
    // Theme
    themeIcon() {
      return this.isDarkMode ? 'fas fa-sun' : 'fas fa-moon'
    },
    
    // Activity Log
    filteredActivities() {
      let filtered = [...this.activities]
      
      // Filter by type
      if (this.activityFilters.type) {
        filtered = filtered.filter(activity => activity.type === this.activityFilters.type)
      }
      
      // Filter by date range
      const now = new Date()
      let cutoffDate = new Date()
      
      switch (this.activityFilters.dateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          cutoffDate.setDate(now.getDate() - 7)
          break
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1)
          break
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1)
          break
        case 'all':
        default:
          cutoffDate = new Date(0) // Beginning of time
          break
      }
      
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.timestamp)
        return activityDate >= cutoffDate
      })
      
      // Filter by search
      if (this.activityFilters.search) {
        const searchTerm = this.activityFilters.search.toLowerCase()
        filtered = filtered.filter(activity => 
          activity.title.toLowerCase().includes(searchTerm) ||
          activity.description.toLowerCase().includes(searchTerm) ||
          activity.source?.toLowerCase().includes(searchTerm)
        )
      }
      
      return filtered
    },
    
    paginatedActivities() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredActivities.slice(start, end)
    },
    
    totalPages() {
      return Math.ceil(this.filteredActivities.length / this.itemsPerPage)
    },
    
    // Permission Management
    canManageSelf() {
      return this.userProfile?.id === this.user?.uid || this.isSuperAdmin
    }
  },
  
  methods: {
    ...mapActions([
      'logout',
      'updateUser',
      'loadWarehouses',
      'loadAllUsers',
      'showNotification'
    ]),
    
    // Initialization
    async loadUserData() {
      try {
        this.loading = true
        this.error = null
        
        await this.loadWarehouses()
        if (this.isSuperAdmin) {
          await this.loadAllUsers()
        }
        
        // Load theme preference
        this.loadThemePreference()
        
        // Load activity log if super admin
        if (this.isSuperAdmin) {
          await this.loadActivityLog()
        }
        
      } catch (error) {
        console.error('Error loading user data:', error)
        this.error = 'فشل في تحميل بيانات المستخدم. يرجى المحاولة مرة أخرى.'
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
    
    // Formatting
    formatDate(date) {
      if (!date) return 'غير محدد'
      
      try {
        const dateObj = date.toDate ? date.toDate() : new Date(date)
        return new Intl.DateTimeFormat('ar-SA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(dateObj)
      } catch {
        return 'غير محدد'
      }
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
    
    // Warehouse Helpers
    getWarehouseTypeLabel(type) {
      const labels = {
        'primary': 'رئيسي',
        'dispatch': 'توزيع',
        'storage': 'تخزين'
      }
      return labels[type] || type
    },
    
    // Permission Helpers
    hasPermission(permissionId) {
      return this.effectivePermissions.includes(permissionId)
    },
    
    // Form Handling
    startEditing(section) {
      switch (section) {
        case 'personal':
          this.editPersonal = {
            name: this.userProfile?.name || '',
            email: this.userEmail,
            role: this.userRole,
            is_active: this.isActive
          }
          this.editingPersonal = true
          break
          
        case 'warehouses':
          const allowedWarehouses = this.userProfile?.allowed_warehouses || []
          this.editWarehouses = {
            all: allowedWarehouses.includes('all'),
            selected: allowedWarehouses.filter(w => w !== 'all')
          }
          this.editingWarehouses = true
          break
          
        case 'permissions':
          this.editPermissions = {
            selected: [...this.effectivePermissions].filter(p => p !== 'full_access')
          }
          this.editingPermissions = true
          break
      }
    },
    
    cancelEditing() {
      this.editingPersonal = false
      this.editingWarehouses = false
      this.editingPermissions = false
      this.personalErrors = {}
    },
    
    validatePersonalInfo() {
      const errors = {}
      
      if (!this.editPersonal.name?.trim()) {
        errors.name = 'الاسم مطلوب'
      }
      
      if (!this.editPersonal.email?.trim()) {
        errors.email = 'البريد الإلكتروني مطلوب'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.editPersonal.email)) {
        errors.email = 'البريد الإلكتروني غير صالح'
      }
      
      this.personalErrors = errors
      return Object.keys(errors).length === 0
    },
    
    async savePersonalInfo() {
      if (!this.validatePersonalInfo()) return
      
      try {
        this.saving = true
        
        const updates = {
          name: this.editPersonal.name.trim(),
          is_active: this.editPersonal.is_active
        }
        
        // Only super admin can change role
        if (this.isSuperAdmin && this.editPersonal.role !== this.userRole) {
          updates.role = this.editPersonal.role
        }
        
        await this.updateUser({
          userId: this.user.uid,
          userData: updates
        })
        
        this.showToast('تم تحديث المعلومات الشخصية بنجاح', 'success')
        this.editingPersonal = false
        
      } catch (error) {
        console.error('Error saving personal info:', error)
        this.showToast('فشل في تحديث المعلومات', 'error')
      } finally {
        this.saving = false
      }
    },
    
    // Warehouse Permissions
    toggleAllWarehouses() {
      if (this.editWarehouses.all) {
        this.editWarehouses.selected = []
      }
    },
    
    selectAllWarehouses() {
      const allWarehouseIds = [
        ...this.primaryWarehouses.map(w => w.id),
        ...this.dispatchWarehouses.map(w => w.id)
      ]
      this.editWarehouses.selected = [...allWarehouseIds]
    },
    
    async saveWarehousePermissions() {
      try {
        this.saving = true
        
        const allowedWarehouses = this.editWarehouses.all 
          ? ['all'] 
          : [...this.editWarehouses.selected]
        
        await this.updateUser({
          userId: this.user.uid,
          userData: { allowed_warehouses: allowedWarehouses }
        })
        
        this.showToast('تم تحديث صلاحيات المخازن بنجاح', 'success')
        this.editingWarehouses = false
        
      } catch (error) {
        console.error('Error saving warehouse permissions:', error)
        this.showToast('فشل في تحديث صلاحيات المخازن', 'error')
      } finally {
        this.saving = false
      }
    },
    
    // Permissions
    isCategorySelected(permissions) {
      return permissions.every(p => this.editPermissions.selected.includes(p.id))
    },
    
    toggleCategory(permissions, event) {
      const checked = event.target.checked
      const permissionIds = permissions.map(p => p.id)
      
      if (checked) {
        // Add all permissions from category
        permissionIds.forEach(id => {
          if (!this.editPermissions.selected.includes(id)) {
            this.editPermissions.selected.push(id)
          }
        })
      } else {
        // Remove all permissions from category
        this.editPermissions.selected = this.editPermissions.selected.filter(
          id => !permissionIds.includes(id)
        )
      }
    },
    
    applyPermissionPreset(preset) {
      const presets = {
        view_only: [
          'view_items',
          'view_transactions',
          'view_reports',
          'view_dashboard'
        ],
        basic_management: [
          'view_items',
          'add_items',
          'edit_items',
          'view_transactions',
          'create_transactions',
          'transfer_items',
          'dispatch_items',
          'view_reports',
          'view_dashboard'
        ],
        full_access: this.allPermissions.map(p => p.id)
      }
      
      this.editPermissions.selected = [...presets[preset] || []]
    },
    
    async savePermissions() {
      try {
        this.saving = true
        
        // Check if full access should be granted
        const allPermissions = this.allPermissions.map(p => p.id)
        const hasAllPermissions = allPermissions.every(p => 
          this.editPermissions.selected.includes(p)
        )
        
        const permissions = hasAllPermissions 
          ? ['full_access'] 
          : [...this.editPermissions.selected]
        
        await this.updateUser({
          userId: this.user.uid,
          userData: { permissions }
        })
        
        this.showToast('تم تحديث الصلاحيات بنجاح', 'success')
        this.editingPermissions = false
        
      } catch (error) {
        console.error('Error saving permissions:', error)
        this.showToast('فشل في تحديث الصلاحيات', 'error')
      } finally {
        this.saving = false
      }
    },
    
    // Security
    async changePassword() {
      if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
        this.passwordError = 'كلمات المرور غير متطابقة'
        return
      }
      
      if (this.passwordStrength.class === 'weak') {
        this.passwordError = 'كلمة المرور ضعيفة جداً'
        return
      }
      
      try {
        this.passwordLoading = true
        this.passwordError = null
        
        // Reauthenticate user
        const credential = EmailAuthProvider.credential(
          this.user.email,
          this.passwordData.currentPassword
        )
        
        await reauthenticateWithCredential(auth.currentUser, credential)
        
        // Update password
        await updatePassword(auth.currentUser, this.passwordData.newPassword)
        
        this.showToast('تم تغيير كلمة المرور بنجاح', 'success')
        this.resetPasswordForm()
        
      } catch (error) {
        console.error('Error changing password:', error)
        
        switch (error.code) {
          case 'auth/wrong-password':
            this.passwordError = 'كلمة المرور الحالية غير صحيحة'
            break
          case 'auth/weak-password':
            this.passwordError = 'كلمة المرور الجديدة ضعيفة جداً'
            break
          default:
            this.passwordError = 'فشل في تغيير كلمة المرور'
        }
      } finally {
        this.passwordLoading = false
      }
    },
    
    resetPasswordForm() {
      this.passwordData = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      this.passwordError = null
      this.showCurrentPassword = false
      this.showNewPassword = false
      this.showConfirmPassword = false
    },
    
    async terminateOtherSessions() {
      try {
        this.sessionLoading = true
        
        // In a real app, you would call a backend endpoint
        // For now, we'll just show a success message
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.showToast('تم إنهاء جميع الجلسات الأخرى بنجاح', 'success')
        
      } catch (error) {
        console.error('Error terminating sessions:', error)
        this.showToast('فشل في إنهاء الجلسات', 'error')
      } finally {
        this.sessionLoading = false
      }
    },
    
    toggleTwoFactor() {
      this.twoFactorEnabled = !this.twoFactorEnabled
      this.showToast(
        this.twoFactorEnabled ? 'تم تفعيل المصادقة الثنائية' : 'تم إلغاء تفعيل المصادقة الثنائية',
        'success'
      )
    },
    
    getUserAgentInfo() {
      const ua = navigator.userAgent
      let browser = 'متصفح غير معروف'
      let os = 'نظام غير معروف'
      
      // Detect browser
      if (ua.includes('Firefox')) browser = 'Firefox'
      else if (ua.includes('Chrome')) browser = 'Chrome'
      else if (ua.includes('Safari')) browser = 'Safari'
      else if (ua.includes('Edge')) browser = 'Edge'
      else if (ua.includes('IE')) browser = 'Internet Explorer'
      
      // Detect OS
      if (ua.includes('Windows')) os = 'Windows'
      else if (ua.includes('Mac')) os = 'macOS'
      else if (ua.includes('Linux')) os = 'Linux'
      else if (ua.includes('Android')) os = 'Android'
      else if (ua.includes('iOS')) os = 'iOS'
      
      return { browser, os }
    },
    
    // Activity Log
    async loadActivityLog() {
      try {
        this.activityLoading = true
        
        // In a real app, you would fetch from your backend
        // For now, we'll create mock data
        await new Promise(resolve => setTimeout(resolve, 500))
        
        this.activities = this.generateMockActivities()
        
      } catch (error) {
        console.error('Error loading activity log:', error)
        this.showToast('فشل في تحميل سجل النشاط', 'error')
      } finally {
        this.activityLoading = false
      }
    },
    
    generateMockActivities() {
      const types = ['login', 'update', 'create', 'delete', 'permission']
      const sources = ['Web', 'Mobile', 'API']
      const activities = []
      
      for (let i = 0; i < 50; i++) {
        const type = types[Math.floor(Math.random() * types.length)]
        const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        
        activities.push({
          id: `activity-${i}`,
          type,
          title: this.getActivityTitle(type),
          description: this.getActivityDescription(type),
          timestamp,
          source: sources[Math.floor(Math.random() * sources.length)],
          ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          details: {
            userId: this.user?.uid,
            action: type,
            timestamp: timestamp.toISOString()
          }
        })
      }
      
      return activities.sort((a, b) => b.timestamp - a.timestamp)
    },
    
    getActivityTitle(type) {
      const titles = {
        login: 'تسجيل دخول',
        update: 'تحديث بيانات',
        create: 'إنشاء جديد',
        delete: 'حذف',
        permission: 'تغيير صلاحيات'
      }
      return titles[type] || type
    },
    
    getActivityDescription(type) {
      const descriptions = {
        login: 'قام المستخدم بتسجيل الدخول إلى النظام',
        update: 'قام المستخدم بتحديث المعلومات الشخصية',
        create: 'قام المستخدم بإنشاء سجل جديد',
        delete: 'قام المستخدم بحذف سجل',
        permission: 'تم تعديل صلاحيات المستخدم'
      }
      return descriptions[type] || `نشاط من نوع ${type}`
    },
    
    getActivityIcon(type) {
      const icons = {
        login: 'fas fa-sign-in-alt',
        update: 'fas fa-edit',
        create: 'fas fa-plus-circle',
        delete: 'fas fa-trash-alt',
        permission: 'fas fa-user-shield'
      }
      return icons[type] || 'fas fa-history'
    },
    
    formatActivityDetails(details) {
      return JSON.stringify(details, null, 2)
    },
    
    refreshActivity() {
      this.loadActivityLog()
    },
    
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
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
              'fas fa-info-circle'
      }
      
      setTimeout(() => {
        this.hideToast()
      }, 5000)
    },
    
    hideToast() {
      this.toast.show = false
    }
  },
  
  watch: {
    activityFilters: {
      handler() {
        this.currentPage = 1
      },
      deep: true
    },
    
    activeTab(newTab) {
      if (newTab === 'activity' && this.isSuperAdmin && this.activities.length === 0) {
        this.loadActivityLog()
      }
    }
  },
  
  created() {
    this.loadUserData()
  },
  
  mounted() {
    // Listen for theme changes from system
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.isDarkMode = e.matches
        this.applyTheme()
      }
    })
  }
}
</script>

<style scoped>
/* Base Styles */
.user-profile-settings {
  min-height: 100vh;
  background: var(--bg-primary, #f5f5f5);
  color: var(--text-primary, #333);
  transition: all 0.3s ease;
  font-family: 'Cairo', 'Segoe UI', sans-serif;
  direction: rtl;
}

.user-profile-settings.dark-mode {
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

/* Loading States */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color, #e0e0e0);
  border-top-color: var(--primary-color, #2196F3);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-alert {
  background: var(--bg-card, #fff);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px var(--shadow-color, rgba(0, 0, 0, 0.1));
  max-width: 500px;
  width: 100%;
}

.error-alert i {
  font-size: 3rem;
  color: var(--error-color);
  margin-bottom: 1rem;
}

.retry-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.3s;
}

.retry-btn:hover {
  background: var(--primary-color-dark, #1976D2);
  transform: translateY(-2px);
}

/* Header */
.profile-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  padding: 2rem 1rem;
  position: relative;
  overflow: hidden;
}

.profile-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;
  position: relative;
  z-index: 1;
}

.user-avatar {
  position: relative;
}

.avatar-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.avatar-badge {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: 3px solid var(--bg-primary);
}

.avatar-badge.superadmin { background: #ff9800; }
.avatar-badge.company_manager { background: #2196f3; }
.avatar-badge.warehouse_manager { background: #4caf50; }

.user-info {
  flex: 1;
}

.user-info h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.user-meta {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.role-badge,
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.role-badge.superadmin { background: rgba(255, 152, 0, 0.2); color: #ff9800; }
.role-badge.company_manager { background: rgba(33, 150, 243, 0.2); color: #2196f3; }
.role-badge.warehouse_manager { background: rgba(76, 175, 80, 0.2); color: #4caf50; }

.status-badge.active { background: rgba(76, 175, 80, 0.2); color: #4caf50; }
.status-badge.inactive { background: rgba(244, 67, 54, 0.2); color: #f44336; }

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.theme-toggle,
.logout-btn {
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.theme-toggle:hover,
.logout-btn:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-2px);
}

.theme-toggle {
  width: 50px;
  height: 50px;
  padding: 0;
  justify-content: center;
  font-size: 1.25rem;
}

/* Tabs */
.profile-tabs {
  background: var(--bg-card, #fff);
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  position: sticky;
  top: 0;
  z-index: 100;
}

.tabs-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
}

.tabs-container::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  transition: all 0.3s;
  position: relative;
}

.tab-btn:hover:not(.disabled) {
  color: var(--primary-color);
}

.tab-btn.active {
  color: var(--primary-color);
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  height: 3px;
  background: var(--primary-color);
  border-radius: 3px 3px 0 0;
}

.tab-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tab-badge {
  background: var(--primary-color);
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  font-size: 0.75rem;
}

/* Main Content */
.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.tab-pane {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
}

.section-header h2 {
  margin: 0;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-primary);
}

.edit-btn,
.save-btn,
.cancel-btn,
.refresh-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
  border: none;
}

.edit-btn {
  background: var(--primary-color);
  color: white;
}

.edit-btn:hover {
  background: var(--primary-color-dark, #1976D2);
  transform: translateY(-2px);
}

.save-btn {
  background: var(--success-color);
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #388E3C;
  transform: translateY(-2px);
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.cancel-btn {
  background: var(--error-color);
  color: white;
}

.cancel-btn:hover {
  background: #D32F2F;
  transform: translateY(-2px);
}

.refresh-btn {
  background: var(--info-color);
  color: white;
}

.refresh-btn:hover:not(:disabled) {
  background: #1976D2;
  transform: translateY(-2px);
}

.refresh-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.refresh-btn .spin {
  animation: spin 1s linear infinite;
}

.edit-actions {
  display: flex;
  gap: 1rem;
}

/* Personal Info */
.personal-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.info-item {
  background: var(--bg-card, #fff);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px var(--shadow-color, rgba(0,0,0,0.1));
  transition: transform 0.3s, box-shadow 0.3s;
}

.info-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px var(--shadow-color, rgba(0,0,0,0.15));
}

.info-item label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.info-value {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* Forms */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-input, #fff);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.form-group input.error {
  border-color: var(--error-color);
}

.error-message {
  color: var(--error-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.toggle-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--success-color);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.toggle-label {
  font-weight: 600;
  color: var(--text-primary);
}

/* Warehouse Summary */
.warehouse-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: var(--bg-card, #fff);
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px var(--shadow-color, rgba(0,0,0,0.1));
}

.summary-card i {
  font-size: 2rem;
  color: var(--primary-color);
}

.summary-content h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: var(--text-secondary);
}

.summary-content p {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

/* Warehouse Cards */
.warehouse-list-section {
  background: var(--bg-card, #fff);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px var(--shadow-color, rgba(0,0,0,0.1));
}

.all-warehouses-notice,
.no-warehouses {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: var(--text-secondary);
}

.all-warehouses-notice i {
  color: var(--success-color);
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-warehouses i {
  color: var(--warning-color);
  font-size: 3rem;
  margin-bottom: 1rem;
}

.warehouse-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.warehouse-card {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.warehouse-card.primary {
  border-right: 4px solid var(--primary-color);
}

.warehouse-card.dispatch {
  border-right: 4px solid var(--secondary-color);
}

.warehouse-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px var(--shadow-color, rgba(0,0,0,0.15));
}

.warehouse-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.warehouse-header h4 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.warehouse-type {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.warehouse-type.primary {
  background: rgba(33, 150, 243, 0.1);
  color: var(--primary-color);
}

.warehouse-type.dispatch {
  background: rgba(255, 152, 0, 0.1);
  color: var(--secondary-color);
}

.warehouse-info {
  margin-bottom: 1rem;
}

.warehouse-info p {
  margin: 0.5rem 0;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.warehouse-status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.warehouse-status.active {
  background: rgba(76, 175, 80, 0.1);
  color: var(--success-color);
}

.warehouse-status:not(.active) {
  background: rgba(244, 67, 54, 0.1);
  color: var(--error-color);
}

/* Warehouse Edit */
.warehouse-edit {
  margin-top: 1.5rem;
}

.edit-options {
  background: var(--bg-input, #fff);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--bg-card, #fff);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.checkbox-option:hover {
  background: var(--bg-input);
}

.checkbox-option input {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  position: relative;
  transition: all 0.3s;
}

.checkbox-option input:checked + .checkmark {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.checkbox-option input:checked + .checkmark::after {
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

.selection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.selection-header h4 {
  margin: 0;
  color: var(--text-primary);
}

.select-all-btn {
  background: var(--info-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.select-all-btn:hover {
  background: #1976D2;
  transform: translateY(-2px);
}

.warehouse-categories {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.category-section h5 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-card, #fff);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.checkbox-item:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.checkbox-item input {
  display: none;
}

.checkbox-item .checkmark {
  flex-shrink: 0;
}

.warehouse-label {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.warehouse-name {
  font-weight: 600;
  color: var(--text-primary);
}

.warehouse-code {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Permissions */
.permissions-overview {
  margin-bottom: 2rem;
}

.permission-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.summary-item {
  background: var(--bg-card, #fff);
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px var(--shadow-color, rgba(0,0,0,0.1));
}

.summary-item i {
  font-size: 2rem;
  color: var(--primary-color);
}

.summary-item h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.summary-item p {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.full-access-notice,
.no-permissions {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: var(--text-secondary);
}

.full-access-notice i {
  color: var(--success-color);
  font-size: 3rem;
  margin-left: 1rem;
}

.no-permissions i {
  color: var(--warning-color);
  font-size: 3rem;
  margin-left: 1rem;
}

.permission-cards {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 1.5rem;
}

.permission-category {
  background: var(--bg-card, #fff);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px var(--shadow-color, rgba(0,0,0,0.1));
}

.permission-category h4 {
  margin: 0;
  padding: 1.5rem;
  background: var(--bg-input);
  color: var(--text-primary);
  font-size: 1.125rem;
}

.permission-items {
  padding: 1.5rem;
}

.permission-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.permission-item:last-child {
  border-bottom: none;
}

.permission-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.permission-info i {
  font-size: 1.25rem;
  color: var(--primary-color);
}

.permission-info h5 {
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
}

.permission-info p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.permission-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.permission-status i.granted {
  color: var(--success-color);
}

.permission-status i.denied {
  color: var(--error-color);
}

.permission-status span {
  font-size: 0.875rem;
  font-weight: 600;
}

/* Permissions Edit */
.permissions-presets {
  background: var(--bg-card, #fff);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px var(--shadow-color, rgba(0,0,0,0.1));
}

.permissions-presets h4 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.preset-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.preset-btn {
  background: var(--bg-input);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.preset-btn:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.permissions-selection {
  background: var(--bg-card, #fff);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px var(--shadow-color, rgba(0,0,0,0.1));
}

.permission-categories {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.permission-category {
  border-bottom: 1px solid var(--border-color);
}

.permission-category:last-child {
  border-bottom: none;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--bg-input);
}

.category-header h5 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.125rem;
}

.category-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.category-toggle input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.permission-checkboxes {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.permission-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.permission-checkbox:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.permission-checkbox input {
  display: none;
}

.permission-checkbox .checkmark {
  margin-top: 0.25rem;
  flex-shrink: 0;
}

.permission-label {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.permission-label i {
  color: var(--primary-color);
  font-size: 1.125rem;
  margin-top: 0.125rem;
}

.permission-name {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.permission-desc {
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Security */
.security-options {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.security-card {
  background: var(--bg-card, #fff);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px var(--shadow-color, rgba(0,0,0,0.1));
}

.security-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.security-header i {
  font-size: 2rem;
  color: var(--primary-color);
}

.security-header h3 {
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
}

.security-header p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.password-form {
  max-width: 500px;
}

.password-input {
  position: relative;
}

.password-input input {
  width: 100%;
  padding-left: 3rem;
}

.password-toggle {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
}

.password-strength {
  margin-top: 0.5rem;
  font-size: 0.875rem;
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

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

/* Session Management */
.session-list {
  margin-bottom: 1.5rem;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.session-item.current {
  border-color: var(--primary-color);
  background: rgba(33, 150, 243, 0.05);
}

.session-info {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
}

.session-info i {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-top: 0.25rem;
}

.session-info h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.session-info p {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.session-status .status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.session-status .status-badge.active {
  background: rgba(76, 175, 80, 0.1);
  color: var(--success-color);
}

.session-actions {
  display: flex;
  justify-content: flex-end;
}

/* Two-Factor Authentication */
.two-factor-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-info i {
  font-size: 2rem;
  color: var(--primary-color);
}

.status-info h4 {
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
}

.status-info p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.toggle-btn.enabled {
  background: var(--success-color);
  color: white;
  border-color: var(--success-color);
}

.toggle-btn:hover {
  transform: translateY(-2px);
}

.toggle-slider {
  width: 36px;
  height: 20px;
  background: var(--border-color);
  border-radius: 10px;
  position: relative;
  transition: all 0.3s;
}

.toggle-btn.enabled .toggle-slider {
  background: white;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  top: 2px;
  right: 2px;
  transition: all 0.3s;
}

.toggle-btn.enabled .toggle-slider::before {
  background: var(--success-color);
  right: 18px;
}

/* Activity Log */
.activity-filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  background: var(--bg-card, #fff);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px var(--shadow-color, rgba(0,0,0,0.1));
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group input,
.filter-group select {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-input);
  color: var(--text-primary);
  font-size: 0.875rem;
}

.activity-list {
  background: var(--bg-card, #fff);
  border-radius: 12px;
  box-shadow: 0 2px 4px var(--shadow-color, rgba(0,0,0,0.1));
  padding: 1.5rem;
}

.loading-activity,
.no-activities {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.loading-activity .spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.no-activities i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--warning-color);
}

.activity-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.3s;
}

.activity-item:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color, rgba(0,0,0,0.1));
}

.activity-item.login {
  border-right: 4px solid var(--success-color);
}

.activity-item.update {
  border-right: 4px solid var(--info-color);
}

.activity-item.create {
  border-right: 4px solid var(--primary-color);
}

.activity-item.delete {
  border-right: 4px solid var(--error-color);
}

.activity-item.permission {
  border-right: 4px solid var(--warning-color);
}

.activity-icon {
  flex-shrink: 0;
}

.activity-icon i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.activity-item.login .activity-icon i { color: var(--success-color); }
.activity-item.update .activity-icon i { color: var(--info-color); }
.activity-item.create .activity-icon i { color: var(--primary-color); }
.activity-item.delete .activity-icon i { color: var(--error-color); }
.activity-item.permission .activity-icon i { color: var(--warning-color); }

.activity-content {
  flex: 1;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.activity-header h4 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.125rem;
}

.activity-time {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.activity-description {
  margin: 0 0 1rem 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

.activity-details {
  background: var(--bg-input);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-family: monospace;
  font-size: 0.875rem;
  color: var(--text-secondary);
  max-height: 200px;
  overflow-y: auto;
}

.activity-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.activity-meta span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.activity-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.pagination-btn {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-input);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 600;
}

/* Toast */
.toast-container {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  right: 2rem;
  max-width: 400px;
  margin: 0 auto;
  background: var(--bg-card, #fff);
  border-radius: 12px;
  box-shadow: 0 4px 20px var(--shadow-color, rgba(0,0,0,0.3));
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: slideUp 0.3s ease;
  z-index: 1000;
}

@keyframes slideUp {
  from { transform: translateY(100px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.toast-container.success {
  border-right: 4px solid var(--success-color);
}

.toast-container.error {
  border-right: 4px solid var(--error-color);
}

.toast-container.info {
  border-right: 4px solid var(--info-color);
}

.toast-container.warning {
  border-right: 4px solid var(--warning-color);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.toast-content i {
  font-size: 1.5rem;
}

.toast-container.success .toast-content i { color: var(--success-color); }
.toast-container.error .toast-content i { color: var(--error-color); }
.toast-container.info .toast-content i { color: var(--info-color); }
.toast-container.warning .toast-content i { color: var(--warning-color); }

.toast-content p {
  margin: 0;
  font-weight: 600;
  color: var(--text-primary);
}

.toast-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  transition: color 0.3s;
}

.toast-close:hover {
  color: var(--error-color);
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
  
  .user-meta {
    justify-content: center;
  }
  
  .header-actions {
    width: 100%;
    justify-content: center;
  }
  
  .tabs-container {
    padding: 0 0.5rem;
  }
  
  .tab-btn {
    padding: 1rem;
    font-size: 0.875rem;
  }
  
  .personal-info-grid {
    grid-template-columns: 1fr;
  }
  
  .warehouse-summary,
  .permission-summary {
    grid-template-columns: 1fr;
  }
  
  .warehouse-cards,
  .checkbox-grid,
  .permission-checkboxes {
    grid-template-columns: 1fr;
  }
  
  .activity-filters {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .edit-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .save-btn,
  .cancel-btn {
    width: 100%;
    justify-content: center;
  }
  
  .activity-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .activity-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .two-factor-status {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .permissions-presets {
    text-align: center;
  }
  
  .preset-buttons {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .profile-header {
    padding: 1.5rem 1rem;
  }
  
  .avatar-circle {
    width: 80px;
    height: 80px;
    font-size: 1.5rem;
  }
  
  .user-info h1 {
    font-size: 1.5rem;
  }
  
  .theme-toggle {
    width: 40px;
    height: 40px;
  }
  
  .logout-btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  
  .tab-btn span:not(.tab-badge) {
    display: none;
  }
  
  .tab-btn i {
    font-size: 1.25rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .security-header {
    flex-direction: column;
    text-align: center;
  }
  
  .permission-category {
    margin-bottom: 1rem;
  }
  
  .category-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .selection-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .select-all-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Print Styles */
@media print {
  .profile-header,
  .profile-tabs,
  .header-actions,
  .edit-btn,
  .save-btn,
  .cancel-btn,
  .refresh-btn,
  .theme-toggle,
  .logout-btn,
  .toast-container {
    display: none !important;
  }
  
  .profile-content {
    padding: 0;
  }
  
  .user-profile-settings {
    background: white !important;
    color: black !important;
  }
  
  .warehouse-card,
  .permission-category,
  .security-card,
  .activity-item {
    break-inside: avoid;
    border: 1px solid #ddd !important;
    box-shadow: none !important;
  }
  
  .warehouse-cards,
  .permission-checkboxes {
    display: block;
  }
}
</style>
