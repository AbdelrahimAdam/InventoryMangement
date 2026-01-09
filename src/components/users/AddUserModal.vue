<template>
  <div class="add-user-module" :class="{ 'dark-mode': isDarkMode }">
    <!-- Trigger Button - Only show for authorized users -->
    <slot name="trigger" v-if="!autoOpen && canCreateUsers">
      <button @click="openModal" class="btn-primary add-user-btn">
        <i class="fas fa-user-plus"></i>
        {{ buttonText }}
      </button>
    </slot>

    <!-- Message for unauthorized users -->
    <div v-else-if="!autoOpen && !canCreateUsers" class="unauthorized-message">
      <i class="fas fa-lock"></i>
      <p>ليس لديك صلاحية إضافة مستخدمين</p>
    </div>

    <!-- Modal Overlay -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <div class="header-content">
              <h2>
                <i class="fas fa-user-plus"></i>
                {{ editingUser ? 'تعديل مستخدم' : 'إضافة مستخدم جديد' }}
                <span v-if="isSelfEdit" class="edit-badge">تعديل الملف الشخصي</span>
              </h2>
              <p class="modal-subtitle">
                {{ editingUser ? 
                  (isSelfEdit ? 'تعديل بياناتك الشخصية' : 'تعديل بيانات المستخدم الحالي') 
                  : 'إنشاء حساب جديد للمستخدم مع تحديد الصلاحيات' }}
              </p>
              <div v-if="currentUserRole" class="current-user-info">
                <i class="fas fa-user-shield"></i>
                أنت: <strong>{{ getRoleName(currentUserRole) }}</strong>
                <span v-if="!canCreateAllRoles" class="role-restriction">
                  (يمكنك إنشاء: {{ getAllowedRolesForCreation.map(r => getRoleName(r)).join('، ') }})
                </span>
              </div>
            </div>
            <button @click="closeModal" class="modal-close" aria-label="إغلاق">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Progress Steps -->
          <div class="progress-steps">
            <div class="steps-container">
              <div 
                v-for="(step, index) in steps" 
                :key="step.id"
                class="step-item"
                :class="{ 
                  'active': currentStep === index + 1,
                  'completed': currentStep > index + 1
                }"
              >
                <div class="step-number">
                  <span v-if="currentStep > index + 1">
                    <i class="fas fa-check"></i>
                  </span>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <div class="step-info">
                  <h4>{{ step.title }}</h4>
                  <p>{{ step.description }}</p>
                </div>
                <div class="step-connector" v-if="index < steps.length - 1"></div>
              </div>
            </div>
          </div>

          <!-- Step Content Container -->
          <div class="step-content-wrapper">
            <!-- Step 1: Basic Information -->
            <transition name="step-transition">
              <div v-if="currentStep === 1" class="step-content">
                <form @submit.prevent="validateStep1" class="step-form">
                  <div class="form-section">
                    <h3>
                      <i class="fas fa-user-circle"></i> المعلومات الأساسية
                    </h3>

                    <div class="form-grid">
                      <!-- Full Name -->
                      <div class="form-group" :class="{ 'error': formErrors.name }">
                        <label for="fullName">
                          <i class="fas fa-user"></i> الاسم الكامل *
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          v-model="userData.name"
                          placeholder="أدخل الاسم الكامل للمستخدم"
                          @input="clearError('name')"
                          @blur="validateField('name')"
                          :disabled="isSelfEdit && !canEditOwnName"
                        >
                        <div class="form-hint">
                          <i class="fas fa-info-circle"></i>
                          سيظهر هذا الاسم في جميع أنحاء النظام
                          <span v-if="isSelfEdit && !canEditOwnName" class="hint-warning">
                            (للتعديل يرجى التواصل مع المشرف)
                          </span>
                        </div>
                        <span v-if="formErrors.name" class="error-message">
                          <i class="fas fa-exclamation-circle"></i> {{ formErrors.name }}
                        </span>
                      </div>

                      <!-- Email Address -->
                      <div class="form-group" :class="{ 'error': formErrors.email }">
                        <label for="email">
                          <i class="fas fa-envelope"></i> البريد الإلكتروني *
                        </label>
                        <input
                          type="email"
                          id="email"
                          v-model="userData.email"
                          placeholder="example@company.com"
                          @input="clearError('email')"
                          @blur="validateField('email')"
                          :disabled="isSelfEdit"
                        >
                        <div class="form-hint">
                          <i class="fas fa-info-circle"></i>
                          سيستخدم هذا البريد لتسجيل الدخول واستقبال الإشعارات
                          <span v-if="isSelfEdit" class="hint-warning">
                            (لا يمكن تغيير البريد الإلكتروني)
                          </span>
                        </div>
                        <span v-if="formErrors.email" class="error-message">
                          <i class="fas fa-exclamation-circle"></i> {{ formErrors.email }}
                        </span>
                      </div>

                      <!-- User Role -->
                      <div class="form-group" :class="{ 'error': formErrors.role }">
                        <label for="userRole">
                          <i class="fas fa-user-tag"></i> الدور الوظيفي *
                        </label>
                        <div class="role-selector">
                          <div 
                            v-for="role in filteredAvailableRoles" 
                            :key="role.id"
                            class="role-option"
                            :class="{ 
                              'selected': userData.role === role.id,
                              'disabled': !canAssignRole(role.id)
                            }"
                            @click="canAssignRole(role.id) && selectRole(role.id)"
                          >
                            <div class="role-icon" :class="role.id">
                              <i :class="role.icon"></i>
                            </div>
                            <div class="role-info">
                              <h4>{{ role.name }}</h4>
                              <p>{{ role.description }}</p>
                              <div v-if="!canAssignRole(role.id)" class="role-restricted">
                                <i class="fas fa-lock"></i> غير مسموح
                              </div>
                            </div>
                            <div class="role-check">
                              <i class="fas fa-check" v-if="userData.role === role.id"></i>
                            </div>
                          </div>
                        </div>
                        <span v-if="formErrors.role" class="error-message">
                          <i class="fas fa-exclamation-circle"></i> {{ formErrors.role }}
                        </span>
                      </div>

                      <!-- Phone Number (Optional) -->
                      <div class="form-group">
                        <label for="phone">
                          <i class="fas fa-phone"></i> رقم الهاتف
                        </label>
                        <div class="phone-input">
                          <select v-model="userData.phoneCountryCode" class="country-code">
                            <option value="+966">+966 🇸🇦</option>
                            <option value="+20">+20 🇪🇬</option>
                            <option value="+971">+971 🇦🇪</option>
                            <option value="+973">+973 🇧🇭</option>
                            <option value="+965">+965 🇰🇼</option>
                            <option value="+974">+974 🇶🇦</option>
                          </select>
                          <input
                            type="tel"
                            id="phone"
                            v-model="userData.phone"
                            placeholder="5X XXX XXXX"
                            @input="validatePhone"
                          >
                        </div>
                        <div class="form-hint">
                          <i class="fas fa-info-circle"></i>
                          اختياري - لاستخدامه في التواصل الطارئ
                          <span v-if="formErrors.phone" class="hint-error">
                            {{ formErrors.phone }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Step Actions -->
                  <div class="step-actions">
                    <button type="button" @click="closeModal" class="btn-secondary">
                      <i class="fas fa-times"></i> إلغاء
                    </button>
                    <button type="submit" class="btn-primary" :disabled="step1Loading">
                      <i class="fas" :class="step1Loading ? 'fa-spinner fa-spin' : 'fa-arrow-left'"></i>
                      التالي: الصلاحيات والمخازن
                    </button>
                  </div>
                </form>
              </div>
            </transition>

            <!-- Step 2: Permissions & Warehouses -->
            <transition name="step-transition">
              <div v-if="currentStep === 2" class="step-content">
                <form @submit.prevent="validateStep2" class="step-form">
                  <div class="form-sections-grid">
                    <!-- Warehouses Section -->
                    <div class="form-section warehouse-section">
                      <div class="section-header">
                        <h3>
                          <i class="fas fa-warehouse"></i> صلاحيات المخازن
                        </h3>
                        <div class="section-actions" v-if="!isSelfEdit">
                          <button 
                            type="button" 
                            @click="toggleAllWarehouses" 
                            class="btn-sm"
                            :class="{ 'btn-primary': !userData.allWarehouses, 'btn-secondary': userData.allWarehouses }"
                          >
                            <i class="fas" :class="userData.allWarehouses ? 'fa-check-square' : 'fa-square'"></i>
                            {{ userData.allWarehouses ? 'إلغاء تحديد الكل' : 'تحديد الكل' }}
                          </button>
                        </div>
                      </div>

                      <div class="warehouse-permissions">
                        <!-- All Warehouses Option -->
                        <div class="permission-option all-warehouses" v-if="!isSelfEdit">
                          <label class="checkbox-label">
                            <input
                              type="checkbox"
                              v-model="userData.allWarehouses"
                              @change="toggleAllWarehousesAccess"
                              :disabled="isSelfEdit"
                            >
                            <span class="checkbox-custom"></span>
                            <div class="checkbox-content">
                              <h4>الوصول إلى جميع المخازن</h4>
                              <p>المستخدم يمكنه الوصول إلى جميع المخازن بدون قيود</p>
                            </div>
                          </label>
                        </div>

                        <!-- Specific Warehouses -->
                        <div v-if="!userData.allWarehouses" class="specific-warehouses">
                          <div class="warehouse-categories">
                            <!-- Primary Warehouses -->
                            <div class="category-section">
                              <div class="category-header">
                                <h4>
                                  <i class="fas fa-building"></i> المخازن الرئيسية
                                </h4>
                                <button 
                                  v-if="!isSelfEdit"
                                  type="button" 
                                  @click="toggleCategory('primary')" 
                                  class="btn-sm btn-secondary"
                                >
                                  <i class="fas" :class="isCategorySelected('primary') ? 'fa-minus-square' : 'fa-check-square'"></i>
                                  {{ isCategorySelected('primary') ? 'إلغاء تحديد الكل' : 'تحديد الكل' }}
                                </button>
                              </div>
                              <div class="warehouse-grid">
                                <label
                                  v-for="warehouse in primaryWarehouses"
                                  :key="warehouse.id"
                                  class="warehouse-option"
                                  :class="{ 
                                    'selected': userData.allowedWarehouses.includes(warehouse.id),
                                    'disabled': isSelfEdit
                                  }"
                                >
                                  <input
                                    type="checkbox"
                                    :value="warehouse.id"
                                    v-model="userData.allowedWarehouses"
                                    @change="handleWarehouseSelection(warehouse.id)"
                                    :disabled="isSelfEdit"
                                  >
                                  <span class="checkbox-custom"></span>
                                  <div class="warehouse-info">
                                    <div class="warehouse-icon">
                                      <i class="fas fa-warehouse"></i>
                                    </div>
                                    <div class="warehouse-details">
                                      <h5>{{ warehouse.name_ar || warehouse.name }}</h5>
                                      <p>{{ warehouse.code }} • {{ warehouse.location || 'غير محدد' }}</p>
                                      <div class="warehouse-status" :class="{ 'active': warehouse.is_active }">
                                        <i class="fas fa-circle"></i>
                                        {{ warehouse.is_active ? 'نشط' : 'غير نشط' }}
                                      </div>
                                    </div>
                                  </div>
                                </label>
                              </div>
                            </div>

                            <!-- Dispatch Warehouses -->
                            <div class="category-section">
                              <div class="category-header">
                                <h4>
                                  <i class="fas fa-shipping-fast"></i> مخازن التوزيع
                                </h4>
                                <button 
                                  v-if="!isSelfEdit"
                                  type="button" 
                                  @click="toggleCategory('dispatch')" 
                                  class="btn-sm btn-secondary"
                                >
                                  <i class="fas" :class="isCategorySelected('dispatch') ? 'fa-minus-square' : 'fa-check-square'"></i>
                                  {{ isCategorySelected('dispatch') ? 'إلغاء تحديد الكل' : 'تحديد الكل' }}
                                </button>
                              </div>
                              <div class="warehouse-grid">
                                <label
                                  v-for="warehouse in dispatchWarehouses"
                                  :key="warehouse.id"
                                  class="warehouse-option"
                                  :class="{ 
                                    'selected': userData.allowedWarehouses.includes(warehouse.id),
                                    'disabled': isSelfEdit
                                  }"
                                >
                                  <input
                                    type="checkbox"
                                    :value="warehouse.id"
                                    v-model="userData.allowedWarehouses"
                                    @change="handleWarehouseSelection(warehouse.id)"
                                    :disabled="isSelfEdit"
                                  >
                                  <span class="checkbox-custom"></span>
                                  <div class="warehouse-info">
                                    <div class="warehouse-icon">
                                      <i class="fas fa-shipping-fast"></i>
                                    </div>
                                    <div class="warehouse-details">
                                      <h5>{{ warehouse.name_ar || warehouse.name }}</h5>
                                      <p>{{ warehouse.code }} • {{ warehouse.location || 'غير محدد' }}</p>
                                      <div class="warehouse-status" :class="{ 'active': warehouse.is_active }">
                                        <i class="fas fa-circle"></i>
                                        {{ warehouse.is_active ? 'نشط' : 'غير نشط' }}
                                      </div>
                                    </div>
                                  </div>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- No Warehouses Message -->
                        <div v-if="!userData.allWarehouses && userData.allowedWarehouses.length === 0" class="no-warehouses-message">
                          <i class="fas fa-exclamation-circle"></i>
                          <p>لم يتم اختيار أي مخزن. المستخدم لن يتمكن من الوصول إلى أي مخزن.</p>
                        </div>

                        <!-- Self Edit Message -->
                        <div v-if="isSelfEdit" class="self-edit-message">
                          <i class="fas fa-info-circle"></i>
                          <p>لا يمكنك تعديل صلاحيات المخازن الخاصة بك. يرجى التواصل مع المشرف.</p>
                        </div>
                      </div>
                    </div>

                    <!-- Permissions Section -->
                    <div class="form-section permissions-section">
                      <div class="section-header">
                        <h3>
                          <i class="fas fa-user-shield"></i> الصلاحيات التفصيلية
                        </h3>
                        <div class="permission-presets" v-if="!isSelfEdit">
                          <span>إعدادات سريعة:</span>
                          <div class="preset-buttons">
                            <button type="button" @click="applyPermissionPreset('view_only')" class="preset-btn">
                              <i class="fas fa-eye"></i> عرض فقط
                            </button>
                            <button type="button" @click="applyPermissionPreset('basic')" class="preset-btn">
                              <i class="fas fa-user-cog"></i> أساسي
                            </button>
                            <button type="button" @click="applyPermissionPreset('full')" class="preset-btn">
                              <i class="fas fa-crown"></i> كامل
                            </button>
                          </div>
                        </div>
                      </div>

                      <div class="permissions-container">
                        <div class="permissions-summary" v-if="selectedPermissionsCount > 0">
                          <i class="fas fa-check-circle"></i>
                          <div>
                            <h4>تم اختيار {{ selectedPermissionsCount }} صلاحية</h4>
                            <p>من أصل {{ totalPermissionsCount }} صلاحية متاحة</p>
                          </div>
                        </div>

                        <div class="permission-categories">
                          <div
                            v-for="category in permissionCategories"
                            :key="category.id"
                            class="permission-category"
                          >
                            <div class="category-header">
                              <h4>{{ category.name }}</h4>
                              <label class="category-toggle" v-if="!isSelfEdit">
                                <input
                                  type="checkbox"
                                  :checked="isCategorySelected(category.permissions)"
                                  @change="toggleCategorySelection(category.permissions, $event)"
                                  :disabled="isSelfEdit"
                                >
                                <span>{{ isCategorySelected(category.permissions) ? 'إلغاء تحديد الكل' : 'تحديد الكل' }}</span>
                              </label>
                            </div>

                            <div class="permission-list">
                              <label
                                v-for="permission in category.permissions"
                                :key="permission.id"
                                class="permission-item"
                                :class="{ 
                                  'selected': userData.permissions.includes(permission.id),
                                  'disabled': isSelfEdit || !canAssignPermission(permission.id)
                                }"
                              >
                                <input
                                  type="checkbox"
                                  :value="permission.id"
                                  v-model="userData.permissions"
                                  @change="handlePermissionSelection(permission.id)"
                                  :disabled="isSelfEdit || !canAssignPermission(permission.id)"
                                >
                                <span class="checkbox-custom"></span>
                                <div class="permission-info">
                                  <div class="permission-icon">
                                    <i :class="permission.icon"></i>
                                  </div>
                                  <div class="permission-details">
                                    <h5>{{ permission.name }}</h5>
                                    <p>{{ permission.description }}</p>
                                    <div v-if="!canAssignPermission(permission.id)" class="permission-restricted">
                                      <i class="fas fa-lock"></i> غير مسموح
                                    </div>
                                  </div>
                                  <div class="permission-hint" v-if="permission.hint">
                                    <i class="fas fa-info-circle"></i>
                                    <span>{{ permission.hint }}</span>
                                  </div>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>

                        <!-- Self Edit Message -->
                        <div v-if="isSelfEdit" class="self-edit-message">
                          <i class="fas fa-info-circle"></i>
                          <p>لا يمكنك تعديل الصلاحيات الخاصة بك. يرجى التواصل مع المشرف.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Step Actions -->
                  <div class="step-actions">
                    <button type="button" @click="prevStep" class="btn-secondary">
                      <i class="fas fa-arrow-right"></i> السابق
                    </button>
                    <button type="submit" class="btn-primary" :disabled="step2Loading">
                      <i class="fas" :class="step2Loading ? 'fa-spinner fa-spin' : 'fa-arrow-left'"></i>
                      التالي: كلمة المرور والإعدادات
                    </button>
                  </div>
                </form>
              </div>
            </transition>

            <!-- Step 3: Password & Settings -->
            <transition name="step-transition">
              <div v-if="currentStep === 3" class="step-content">
                <form @submit.prevent="validateStep3" class="step-form">
                  <div class="form-section">
                    <h3>
                      <i class="fas fa-key"></i> الأمان والإعدادات
                    </h3>

                    <div class="form-grid">
                      <!-- Password Section -->
                      <div class="password-section" v-if="!isSelfEdit">
                        <h4>
                          <i class="fas fa-lock"></i> كلمة المرور
                          <span class="section-badge" :class="passwordStrength.class">
                            {{ passwordStrength.text }}
                          </span>
                        </h4>

                        <div class="password-options">
                          <!-- Auto Generate Password -->
                          <div class="password-option">
                            <label class="radio-label">
                              <input
                                type="radio"
                                v-model="passwordOption"
                                value="auto"
                              >
                              <span class="radio-custom"></span>
                              <div class="option-content">
                                <div class="option-header">
                                  <h5>توليد تلقائي</h5>
                                  <span class="option-recommended">موصى به</span>
                                </div>
                                <p>توليد كلمة مرور قوية عشوائية وإرسالها للمستخدم عبر البريد</p>
                              </div>
                            </label>
                          </div>

                          <!-- Manual Password -->
                          <div class="password-option">
                            <label class="radio-label">
                              <input
                                type="radio"
                                v-model="passwordOption"
                                value="manual"
                              >
                              <span class="radio-custom"></span>
                              <div class="option-content">
                                <h5>تعيين يدوي</h5>
                                <p>تعيين كلمة مرور محددة من قبلك</p>
                              </div>
                            </label>

                            <div v-if="passwordOption === 'manual'" class="manual-password-fields">
                              <div class="form-group" :class="{ 'error': formErrors.password }">
                                <label for="password">
                                  <i class="fas fa-key"></i> كلمة المرور *
                                </label>
                                <div class="password-input">
                                  <input
                                    :type="showPassword ? 'text' : 'password'"
                                    id="password"
                                    v-model="userData.password"
                                    placeholder="كلمة المرور (8 أحرف على الأقل)"
                                    @input="validatePassword"
                                    @blur="validateField('password')"
                                  >
                                  <button
                                    type="button"
                                    @click="showPassword = !showPassword"
                                    class="password-toggle"
                                  >
                                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                                  </button>
                                </div>
                                <div class="password-strength-indicator">
                                  <div class="strength-bars">
                                    <div 
                                      v-for="n in 4" 
                                      :key="n"
                                      class="strength-bar"
                                      :class="{ 
                                        'filled': passwordStrength.score >= n,
                                        'weak': passwordStrength.class === 'weak',
                                        'medium': passwordStrength.class === 'medium',
                                        'strong': passwordStrength.class === 'strong'
                                      }"
                                    ></div>
                                  </div>
                                  <span class="strength-text">{{ passwordStrength.details }}</span>
                                </div>
                                <span v-if="formErrors.password" class="error-message">
                                  <i class="fas fa-exclamation-circle"></i> {{ formErrors.password }}
                                </span>
                              </div>

                              <div class="form-group" :class="{ 'error': formErrors.confirmPassword }">
                                <label for="confirmPassword">
                                  <i class="fas fa-key"></i> تأكيد كلمة المرور *
                                </label>
                                <div class="password-input">
                                  <input
                                    :type="showConfirmPassword ? 'text' : 'password'"
                                    id="confirmPassword"
                                    v-model="userData.confirmPassword"
                                    placeholder="أعد إدخال كلمة المرور"
                                    @input="clearError('confirmPassword')"
                                    @blur="validateField('confirmPassword')"
                                  >
                                  <button
                                    type="button"
                                    @click="showConfirmPassword = !showConfirmPassword"
                                    class="password-toggle"
                                  >
                                    <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                                  </button>
                                </div>
                                <span v-if="formErrors.confirmPassword" class="error-message">
                                  <i class="fas fa-exclamation-circle"></i> {{ formErrors.confirmPassword }}
                                </span>
                              </div>

                              <!-- Password Requirements -->
                              <div class="password-requirements">
                                <h5>متطلبات كلمة المرور:</h5>
                                <ul>
                                  <li :class="{ 'met': userData.password.length >= 8 }">
                                    <i class="fas" :class="userData.password.length >= 8 ? 'fa-check-circle' : 'fa-circle'"></i>
                                    8 أحرف على الأقل
                                  </li>
                                  <li :class="{ 'met': /[A-Z]/.test(userData.password) }">
                                    <i class="fas" :class="/[A-Z]/.test(userData.password) ? 'fa-check-circle' : 'fa-circle'"></i>
                                    حرف كبير واحد على الأقل
                                  </li>
                                  <li :class="{ 'met': /[0-9]/.test(userData.password) }">
                                    <i class="fas" :class="/[0-9]/.test(userData.password) ? 'fa-check-circle' : 'fa-circle'"></i>
                                    رقم واحد على الأقل
                                  </li>
                                  <li :class="{ 'met': /[^A-Za-z0-9]/.test(userData.password) }">
                                    <i class="fas" :class="/[^A-Za-z0-9]/.test(userData.password) ? 'fa-check-circle' : 'fa-circle'"></i>
                                    رمز خاص واحد على الأقل
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Self Edit Password Section -->
                      <div class="password-section" v-if="isSelfEdit && !editingUser">
                        <h4>
                          <i class="fas fa-lock"></i> تغيير كلمة المرور
                        </h4>
                        <div class="self-password-message">
                          <i class="fas fa-info-circle"></i>
                          <p>لحماية حسابك، يمكنك تغيير كلمة المرور من صفحة إعدادات الحساب.</p>
                          <button type="button" @click="goToAccountSettings" class="btn-sm btn-primary">
                            <i class="fas fa-cog"></i> الانتقال للإعدادات
                          </button>
                        </div>
                      </div>

                      <!-- Settings Section -->
                      <div class="settings-section">
                        <h4>
                          <i class="fas fa-cogs"></i> إعدادات الحساب
                        </h4>

                        <div class="settings-options">
                          <!-- Account Status -->
                          <div class="setting-option" v-if="!isSelfEdit">
                            <label class="toggle-label">
                              <div class="toggle-info">
                                <i class="fas fa-toggle-on"></i>
                                <div>
                                  <h5>تفعيل الحساب فوراً</h5>
                                  <p>المستخدم يمكنه تسجيل الدخول مباشرة بعد الإنشاء</p>
                                </div>
                              </div>
                              <label class="toggle-switch">
                                <input type="checkbox" v-model="userData.isActive">
                                <span class="toggle-slider"></span>
                              </label>
                            </label>
                          </div>

                          <!-- Email Notification -->
                          <div class="setting-option" v-if="!isSelfEdit && !editingUser">
                            <label class="toggle-label">
                              <div class="toggle-info">
                                <i class="fas fa-envelope"></i>
                                <div>
                                  <h5>إرسال بريد الترحيب</h5>
                                  <p>إرسال بريد إلكتروني ترحيبي يحتوي على بيانات الحساب</p>
                                </div>
                              </div>
                              <label class="toggle-switch">
                                <input type="checkbox" v-model="userData.sendWelcomeEmail">
                                <span class="toggle-slider"></span>
                              </label>
                            </label>
                          </div>

                          <!-- Two-Factor Authentication -->
                          <div class="setting-option" v-if="!isSelfEdit">
                            <label class="toggle-label">
                              <div class="toggle-info">
                                <i class="fas fa-mobile-alt"></i>
                                <div>
                                  <h5>تفعيل المصادقة الثنائية</h5>
                                  <p>إضافة طبقة أمان إضافية لحساب المستخدم</p>
                                </div>
                              </div>
                              <label class="toggle-switch">
                                <input type="checkbox" v-model="userData.twoFactorEnabled">
                                <span class="toggle-slider"></span>
                              </label>
                            </label>
                          </div>

                          <!-- Self Edit Status -->
                          <div class="setting-option" v-if="isSelfEdit">
                            <label class="toggle-label">
                              <div class="toggle-info">
                                <i class="fas fa-user-check"></i>
                                <div>
                                  <h5>حالة حسابك</h5>
                                  <p>الحساب {{ userData.isActive ? 'نشط' : 'معطل' }}</p>
                                </div>
                              </div>
                              <div class="status-badge" :class="userData.isActive ? 'active' : 'inactive'">
                                {{ userData.isActive ? 'نشط' : 'معطل' }}
                              </div>
                            </label>
                          </div>

                          <!-- Notes -->
                          <div class="form-group">
                            <label for="notes">
                              <i class="fas fa-sticky-note"></i> ملاحظات إضافية
                            </label>
                            <textarea
                              id="notes"
                              v-model="userData.notes"
                              placeholder="أي ملاحظات إضافية حول المستخدم أو الحساب..."
                              rows="3"
                              :disabled="isSelfEdit"
                            ></textarea>
                            <div class="form-hint">
                              <i class="fas fa-info-circle"></i>
                              {{ isSelfEdit ? 'ملاحظات المشرف على حسابك' : 'هذه الملاحظات مرئية للمشرفين فقط' }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Summary Preview -->
                    <div class="summary-preview">
                      <h4>
                        <i class="fas fa-clipboard-check"></i> ملخص {{ isSelfEdit ? 'الملف الشخصي' : 'المستخدم' }}
                      </h4>
                      <div class="summary-content">
                        <div class="summary-row">
                          <div class="summary-item">
                            <span class="summary-label">الاسم:</span>
                            <span class="summary-value">{{ userData.name || 'غير محدد' }}</span>
                          </div>
                          <div class="summary-item">
                            <span class="summary-label">البريد:</span>
                            <span class="summary-value">{{ userData.email || 'غير محدد' }}</span>
                          </div>
                        </div>
                        <div class="summary-row">
                          <div class="summary-item">
                            <span class="summary-label">الدور:</span>
                            <span class="summary-badge" :class="userData.role">
                              {{ getRoleName(userData.role) }}
                            </span>
                          </div>
                          <div class="summary-item">
                            <span class="summary-label">المخازن:</span>
                            <span class="summary-value">
                              {{ userData.allWarehouses ? 'جميع المخازن' : userData.allowedWarehouses.length + ' مخزن' }}
                            </span>
                          </div>
                        </div>
                        <div class="summary-row">
                          <div class="summary-item">
                            <span class="summary-label">الصلاحيات:</span>
                            <span class="summary-value">{{ selectedPermissionsCount }} صلاحية</span>
                          </div>
                          <div class="summary-item">
                            <span class="summary-label">الحالة:</span>
                            <span class="summary-badge" :class="userData.isActive ? 'active' : 'inactive'">
                              {{ userData.isActive ? 'نشط' : 'معطل' }}
                            </span>
                          </div>
                        </div>
                        <div v-if="isSelfEdit" class="summary-row">
                          <div class="summary-item full-width">
                            <span class="summary-label">المنشئ:</span>
                            <span class="summary-value">{{ editingUser?.created_by_name || 'غير معروف' }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Step Actions -->
                  <div class="step-actions">
                    <button type="button" @click="prevStep" class="btn-secondary">
                      <i class="fas fa-arrow-right"></i> السابق
                    </button>
                    <button type="submit" class="btn-success" :disabled="saving">
                      <i class="fas" :class="saving ? 'fa-spinner fa-spin' : 'fa-check'"></i>
                      {{ saving ? 
                        (isSelfEdit ? 'جاري تحديث البيانات...' : (editingUser ? 'جاري تحديث المستخدم...' : 'جاري إنشاء الحساب...')) 
                        : (isSelfEdit ? 'تحديث الملف الشخصي' : (editingUser ? 'تحديث المستخدم' : 'إنشاء الحساب')) 
                      }}
                    </button>
                  </div>
                </form>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click.self="closeSuccessModal">
      <div class="modal-container success-modal">
        <div class="modal-content">
          <div class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h2>{{ isSelfEdit ? 'تم تحديث بياناتك بنجاح!' : (editingUser ? 'تم تحديث المستخدم بنجاح!' : 'تم إنشاء الحساب بنجاح!') }}</h2>

          <div class="success-details" v-if="!isSelfEdit">
            <div class="detail-item">
              <i class="fas fa-user"></i>
              <div>
                <h4>المستخدم:</h4>
                <p>{{ createdUser?.name }}</p>
              </div>
            </div>
            <div class="detail-item">
              <i class="fas fa-envelope"></i>
              <div>
                <h4>البريد الإلكتروني:</h4>
                <p>{{ createdUser?.email }}</p>
              </div>
            </div>
            <div v-if="generatedPassword" class="detail-item">
              <i class="fas fa-key"></i>
              <div>
                <h4>كلمة المرور:</h4>
                <div class="password-display">
                  <code>{{ generatedPassword }}</code>
                  <button @click="copyPassword" class="copy-btn">
                    <i class="fas fa-copy"></i> نسخ
                  </button>
                </div>
                <p class="password-warning">
                  <i class="fas fa-exclamation-triangle"></i>
                  احفظ هذه الكلمة وقم بإرسالها للمستخدم
                </p>
              </div>
            </div>
            <div class="detail-item">
              <i class="fas fa-info-circle"></i>
              <div>
                <h4>ملاحظات:</h4>
                <p>{{ userData.sendWelcomeEmail ? 'تم إرسال بريد ترحيبي للمستخدم' : 'لم يتم إرسال بريد ترحيبي' }}</p>
              </div>
            </div>
          </div>

          <div class="success-details" v-if="isSelfEdit">
            <div class="detail-item">
              <i class="fas fa-check-circle"></i>
              <div>
                <h4>تم التحديث بنجاح</h4>
                <p>تم حفظ التغييرات على ملفك الشخصي</p>
              </div>
            </div>
            <div class="detail-item">
              <i class="fas fa-sync-alt"></i>
              <div>
                <h4>تأثير التغييرات:</h4>
                <p>قد تحتاج إلى تسجيل الخروج ثم الدخول مرة أخرى لرؤية بعض التغييرات</p>
              </div>
            </div>
          </div>

          <div class="success-actions">
            <button v-if="!isSelfEdit && !editingUser" @click="createAnotherUser" class="btn-primary">
              <i class="fas fa-user-plus"></i> إضافة مستخدم آخر
            </button>
            <button v-if="!isSelfEdit" @click="viewUser" class="btn-secondary">
              <i class="fas fa-eye"></i> عرض المستخدم
            </button>
            <button @click="closeSuccessModal" class="btn-success">
              <i class="fas fa-check"></i> تم
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="spinner"></div>
        <p>{{ loadingMessage }}</p>
      </div>
    </div>

    <!-- Error Toast -->
    <div v-if="showError" class="error-toast">
      <div class="toast-content">
        <i class="fas fa-exclamation-circle"></i>
        <div>
          <h4>حدث خطأ</h4>
          <p>{{ errorMessage }}</p>
        </div>
      </div>
      <button @click="hideError" class="toast-close">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { generatePassword } from '@/utils/passwordGenerator'
import { firestore } from '@/firebase'

export default {
  name: 'AddUserModal',
  
  props: {
    buttonText: {
      type: String,
      default: 'إضافة مستخدم'
    },
    autoOpen: {
      type: Boolean,
      default: false
    },
    editUser: {
      type: Object,
      default: null
    },
    customRoles: {
      type: Array,
      default: null
    },
    customPermissions: {
      type: Array,
      default: null
    },
    onSuccess: {
      type: Function,
      default: null
    },
    isProfileEdit: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      showModal: false,
      showSuccessModal: false,
      isDarkMode: false,
      
      currentStep: 1,
      steps: [
        {
          id: 'basic',
          title: 'المعلومات الأساسية',
          description: 'بيانات المستخدم الأساسية'
        },
        {
          id: 'permissions',
          title: 'الصلاحيات والمخازن',
          description: 'تحديد المخازن والصلاحيات'
        },
        {
          id: 'security',
          title: 'الأمان والإعدادات',
          description: 'كلمة المرور والإعدادات'
        }
      ],
      
      userData: {
        name: '',
        email: '',
        role: 'warehouse_manager',
        phone: '',
        phoneCountryCode: '+966',
        allWarehouses: false,
        allowedWarehouses: [],
        permissions: [],
        password: '',
        confirmPassword: '',
        isActive: true,
        sendWelcomeEmail: true,
        twoFactorEnabled: false,
        notes: ''
      },
      
      formErrors: {},
      passwordOption: 'auto',
      showPassword: false,
      showConfirmPassword: false,
      
      step1Loading: false,
      step2Loading: false,
      saving: false,
      loading: false,
      loadingMessage: '',
      
      createdUser: null,
      generatedPassword: '',
      
      showError: false,
      errorMessage: '',
      
      editingUser: null,
      currentUserId: null,
      currentUserRole: null
    }
  },
  
  computed: {
    ...mapState(['warehouses', 'users']),
    ...mapGetters(['primaryWarehouses', 'dispatchWarehouses']),
    
    // Current user info from Vuex store
    currentUser() {
      return this.$store.getters.currentUser
    },
    
    // Check if editing own profile
    isSelfEdit() {
      return this.isProfileEdit || 
             (this.editingUser && this.currentUserId === this.editingUser.id)
    },
    
    // Check if current user can create users (superadmin only per rules)
    canCreateUsers() {
      return this.currentUserRole === 'superadmin'
    },
    
    // Roles that current user can assign
    getAllowedRolesForCreation() {
      switch(this.currentUserRole) {
        case 'superadmin':
          return ['superadmin', 'company_manager', 'warehouse_manager', 'user']
        case 'company_manager':
          return ['warehouse_manager', 'user']
        case 'warehouse_manager':
          return ['user']
        default:
          return []
      }
    },
    
    // Filter available roles based on current user's permissions
    filteredAvailableRoles() {
      const allRoles = this.availableRoles
      if (this.currentUserRole === 'superadmin') return allRoles
      
      return allRoles.filter(role => 
        this.getAllowedRolesForCreation.includes(role.id)
      )
    },
    
    // Check if current user can create all roles
    canCreateAllRoles() {
      return this.currentUserRole === 'superadmin'
    },
    
    availableRoles() {
      if (this.customRoles) return this.customRoles
      
      return [
        {
          id: 'warehouse_manager',
          name: 'مدير مخزن',
          description: 'إدارة المخازن والأصناف المحددة',
          icon: 'fas fa-warehouse'
        },
        {
          id: 'company_manager',
          name: 'مدير شركة',
          description: 'إدارة المستخدمين والمخازن والتقارير',
          icon: 'fas fa-user-tie'
        },
        {
          id: 'superadmin',
          name: 'مشرف عام',
          description: 'صلاحيات كاملة على النظام بأكمله',
          icon: 'fas fa-crown'
        },
        {
          id: 'user',
          name: 'مستخدم عادي',
          description: 'صلاحيات محدودة للعرض والمهام البسيطة',
          icon: 'fas fa-user'
        }
      ]
    },
    
    permissionCategories() {
      if (this.customPermissions) return this.customPermissions
      
      return [
        {
          id: 'inventory',
          name: 'إدارة المخزون',
          permissions: [
            { 
              id: 'view_items', 
              name: 'عرض الأصناف', 
              description: 'عرض قائمة الأصناف والتفاصيل',
              icon: 'fas fa-box',
              hint: 'يشمل البحث والتصفية'
            },
            { 
              id: 'add_items', 
              name: 'إضافة أصناف', 
              description: 'إضافة أصناف جديدة للمخزون',
              icon: 'fas fa-plus-square',
              hint: 'إنشاء سجلات جديدة'
            },
            { 
              id: 'edit_items', 
              name: 'تعديل الأصناف', 
              description: 'تعديل بيانات الأصناف الموجودة',
              icon: 'fas fa-edit',
              hint: 'تحديث الكميات والمعلومات'
            },
            { 
              id: 'delete_items', 
              name: 'حذف الأصناف', 
              description: 'حذف الأصناف من النظام',
              icon: 'fas fa-trash-alt',
              hint: 'حذف نهائي للسجلات'
            },
            { 
              id: 'export_items', 
              name: 'تصدير الأصناف', 
              description: 'تصدير بيانات الأصناف إلى ملفات',
              icon: 'fas fa-file-export',
              hint: 'CSV, Excel, PDF'
            }
          ]
        },
        {
          id: 'transactions',
          name: 'المعاملات والحركات',
          permissions: [
            { 
              id: 'view_transactions', 
              name: 'عرض الحركات', 
              description: 'عرض سجل الحركات والمعاملات',
              icon: 'fas fa-exchange-alt',
              hint: 'جميع أنواع المعاملات'
            },
            { 
              id: 'create_transactions', 
              name: 'إنشاء حركات', 
              description: 'إنشاء حركات جديدة (إضافة، صرف، نقل)',
              icon: 'fas fa-plus-circle',
              hint: 'تسجيل المعاملات اليومية'
            },
            { 
              id: 'transfer_items', 
              name: 'نقل الأصناف', 
              description: 'نقل الأصناف بين المخازن',
              icon: 'fas fa-truck-moving',
              hint: 'تحويل المخزون'
            },
            { 
              id: 'dispatch_items', 
              name: 'صرف الأصناف', 
              description: 'صرف الأصناف للعملاء والموردين',
              icon: 'fas fa-shipping-fast',
              hint: 'طلبات الصرف'
            },
            { 
              id: 'approve_transactions', 
              name: 'اعتماد الحركات', 
              description: 'اعتماد الحركات المعلقة',
              icon: 'fas fa-check-double',
              hint: 'المراجعة والاعتماد'
            }
          ]
        },
        {
          id: 'reports',
          name: 'التقارير والإحصائيات',
          permissions: [
            { 
              id: 'view_reports', 
              name: 'عرض التقارير', 
              description: 'عرض التقارير والإحصائيات',
              icon: 'fas fa-chart-bar',
              hint: 'تقارير مخصصة'
            },
            { 
              id: 'export_reports', 
              name: 'تصدير التقارير', 
              description: 'تصدير التقارير إلى ملفات',
              icon: 'fas fa-file-export',
              hint: 'تصدير للتحليل'
            },
            { 
              id: 'view_dashboard', 
              name: 'عرض لوحة التحكم', 
              description: 'عرض إحصائيات النظام الرئيسية',
              icon: 'fas fa-tachometer-alt',
              hint: 'نظرة عامة'
            },
            { 
              id: 'view_analytics', 
              name: 'عرض التحليلات', 
              description: 'عرض التحليلات المتقدمة والرسوم البيانية',
              icon: 'fas fa-chart-line',
              hint: 'تحليلات متقدمة'
            }
          ]
        },
        {
          id: 'administration',
          name: 'الإدارة النظامية',
          permissions: [
            { 
              id: 'manage_users', 
              name: 'إدارة المستخدمين', 
              description: 'إضافة وتعديل وحذف المستخدمين',
              icon: 'fas fa-users-cog',
              hint: 'للمشرفين فقط'
            },
            { 
              id: 'manage_warehouses', 
              name: 'إدارة المخازن', 
              description: 'إدارة المخازن والإعدادات',
              icon: 'fas fa-warehouse',
              hint: 'إعدادات المخازن'
            },
            { 
              id: 'manage_settings', 
              name: 'إدارة الإعدادات', 
              description: 'تعديل إعدادات النظام العامة',
              icon: 'fas fa-cogs',
              hint: 'إعدادات النظام'
            },
            { 
              id: 'view_audit_log', 
              name: 'عرض سجل التدقيق', 
              description: 'عرض سجل الأحداث والتدقيق',
              icon: 'fas fa-clipboard-list',
              hint: 'سجلات النظام'
            }
          ]
        }
      ]
    },
    
    totalPermissionsCount() {
      return this.permissionCategories.reduce((total, category) => {
        return total + category.permissions.length
      }, 0)
    },
    
    selectedPermissionsCount() {
      return this.userData.permissions.length
    },
    
    passwordStrength() {
      const password = this.userData.password
      
      if (!password) {
        return {
          class: 'weak',
          text: 'ضعيفة',
          score: 0,
          details: 'أدخل كلمة مرور'
        }
      }
      
      let score = 0
      let details = []
      
      if (password.length >= 8) score++
      if (password.length >= 12) score++
      
      if (/[A-Z]/.test(password)) score++
      if (/[a-z]/.test(password)) score++
      if (/[0-9]/.test(password)) score++
      if (/[^A-Za-z0-9]/.test(password)) score++
      
      let strengthClass = 'weak'
      let strengthText = 'ضعيفة'
      
      if (score >= 5) {
        strengthClass = 'strong'
        strengthText = 'قوية جداً'
        details = ['ممتازة! كلمة مرور آمنة جداً']
      } else if (score >= 4) {
        strengthClass = 'strong'
        strengthText = 'قوية'
        details = ['جيدة، آمنة']
      } else if (score >= 3) {
        strengthClass = 'medium'
        strengthText = 'متوسطة'
        details = ['مقبولة، يمكن تحسينها']
      } else {
        strengthClass = 'weak'
        strengthText = 'ضعيفة'
        details = ['ضعيفة جداً، يجب تقويتها']
      }
      
      if (password.length < 8) {
        details.push('يجب أن تكون 8 أحرف على الأقل')
      }
      if (!/[A-Z]/.test(password)) {
        details.push('أضف حرف كبير واحد على الأقل')
      }
      if (!/[0-9]/.test(password)) {
        details.push('أضف رقم واحد على الأقل')
      }
      if (!/[^A-Za-z0-9]/.test(password)) {
        details.push('أضف رمزاً خاصاً (@, #, $...)')
      }
      
      return {
        class: strengthClass,
        text: strengthText,
        score: Math.min(score, 4),
        details: details.join('. ')
      }
    }
  },
  
  watch: {
    editUser: {
      immediate: true,
      handler(user) {
        if (user) {
          this.editingUser = user
          this.populateEditData(user)
          if (this.autoOpen) {
            this.openModal()
          }
        }
      }
    },
    
    autoOpen: {
      immediate: true,
      handler(autoOpen) {
        if (autoOpen) {
          this.openModal()
        }
      }
    },
    
    'userData.allWarehouses': function(newVal) {
      if (newVal) {
        this.userData.allowedWarehouses = []
      }
    },
    
    passwordOption(newVal) {
      if (newVal === 'auto') {
        this.userData.password = ''
        this.userData.confirmPassword = ''
        this.clearError('password')
        this.clearError('confirmPassword')
      }
    },
    
    // Watch for current user changes
    currentUser: {
      immediate: true,
      handler(user) {
        if (user) {
          this.currentUserId = user.id || user.uid
          this.currentUserRole = user.role
        }
      }
    }
  },
  
  methods: {
    ...mapActions(['createUser', 'updateUser', 'showNotification']),
    
    openModal() {
      // Check permissions before opening
      if (!this.canOpenModal()) {
        return
      }
      
      this.showModal = true
      this.currentStep = 1
      this.resetForm()
      this.loadThemePreference()
      
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden'
    },
    
    canOpenModal() {
      // Check if user can create users or is editing self
      if (this.isProfileEdit || (this.editingUser && this.isSelfEdit)) {
        return true // Always allow self-edit
      }
      
      if (!this.editingUser && !this.canCreateUsers) {
        this.showNotification({
          type: 'error',
          message: 'ليس لديك صلاحية إضافة مستخدمين'
        })
        return false
      }
      
      return true
    },
    
    closeModal() {
      if (!this.saving) {
        this.showModal = false
        this.resetForm()
        document.body.style.overflow = ''
        this.$emit('closed')
      }
    },
    
    loadThemePreference() {
      const savedTheme = localStorage.getItem('theme')
      this.isDarkMode = savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    },
    
    resetForm() {
      this.userData = {
        name: '',
        email: '',
        role: 'warehouse_manager',
        phone: '',
        phoneCountryCode: '+966',
        allWarehouses: false,
        allowedWarehouses: [],
        permissions: [],
        password: '',
        confirmPassword: '',
        isActive: true,
        sendWelcomeEmail: true,
        twoFactorEnabled: false,
        notes: ''
      }
      
      this.formErrors = {}
      this.passwordOption = 'auto'
      this.showPassword = false
      this.showConfirmPassword = false
      this.currentStep = 1
      this.editingUser = null
    },
    
    populateEditData(user) {
      // Convert Firestore data format to component format
      let allWarehouses = false
      let allowedWarehouses = []
      
      if (user.allowed_warehouses) {
        if (typeof user.allowed_warehouses === 'object') {
          // Object format: { warehouse1: true, warehouse2: true }
          if (user.allowed_warehouses.all === true) {
            allWarehouses = true
          } else {
            allowedWarehouses = Object.keys(user.allowed_warehouses)
              .filter(key => user.allowed_warehouses[key] === true)
          }
        } else if (Array.isArray(user.allowed_warehouses)) {
          // Array format (legacy): ['warehouse1', 'warehouse2']
          allowedWarehouses = [...user.allowed_warehouses]
          allWarehouses = allowedWarehouses.includes('all')
          if (allWarehouses) {
            allowedWarehouses = allowedWarehouses.filter(id => id !== 'all')
          }
        }
      }
      
      this.userData = {
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'warehouse_manager',
        phone: user.phone || '',
        phoneCountryCode: user.phoneCountryCode || '+966',
        allWarehouses,
        allowedWarehouses,
        permissions: user.permissions || [],
        password: '',
        confirmPassword: '',
        isActive: user.is_active !== false,
        sendWelcomeEmail: false,
        twoFactorEnabled: user.two_factor_enabled || false,
        notes: user.notes || ''
      }
      
      // For self-edit, restrict certain fields
      if (this.isSelfEdit) {
        this.userData.allowedWarehouses = [] // Don't show warehouses in self-edit
        this.userData.permissions = [] // Don't show permissions in self-edit
      }
    },
    
    nextStep() {
      if (this.currentStep < this.steps.length) {
        this.currentStep++
        this.scrollToTop()
      }
    },
    
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--
        this.scrollToTop()
      }
    },
    
    scrollToTop() {
      const container = this.$el.querySelector('.step-content-wrapper')
      if (container) {
        container.scrollTop = 0
      }
    },
    
    validateStep1() {
      this.clearErrors()
      let isValid = true
      
      // Name validation
      if (!this.userData.name?.trim()) {
        this.formErrors.name = 'الاسم الكامل مطلوب'
        isValid = false
      } else if (this.userData.name.trim().length < 2) {
        this.formErrors.name = 'الاسم يجب أن يكون على الأقل حرفين'
        isValid = false
      }
      
      // Email validation
      if (!this.userData.email?.trim()) {
        this.formErrors.email = 'البريد الإلكتروني مطلوب'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.userData.email)) {
        this.formErrors.email = 'البريد الإلكتروني غير صالح'
        isValid = false
      } else if (!this.isSelfEdit) {
        // Check email uniqueness (skip for self-edit)
        if (!this.isEmailUnique()) {
          this.formErrors.email = 'البريد الإلكتروني مستخدم بالفعل'
          isValid = false
        }
      }
      
      // Role validation
      if (!this.userData.role) {
        this.formErrors.role = 'يجب اختيار دور للمستخدم'
        isValid = false
      } else if (!this.canAssignRole(this.userData.role)) {
        this.formErrors.role = `ليس لديك صلاحية إنشاء مستخدم بدور ${this.getRoleName(this.userData.role)}`
        isValid = false
      }
      
      // Phone validation if provided
      if (this.userData.phone && !this.isValidPhone(this.userData.phone)) {
        this.formErrors.phone = 'رقم الهاتف غير صالح'
        isValid = false
      }
      
      // For self-edit, restrict role changes
      if (this.isSelfEdit && this.editingUser && this.userData.role !== this.editingUser.role) {
        this.formErrors.role = 'لا يمكنك تغيير دورك الخاص'
        isValid = false
      }
      
      if (isValid) {
        this.step1Loading = true
        setTimeout(() => {
          this.step1Loading = false
          this.nextStep()
        }, 300)
      } else {
        this.scrollToFirstError()
      }
    },
    
    validateStep2() {
      this.step2Loading = true
      
      // Apply basic permissions if none selected
      if (this.userData.permissions.length === 0 && !this.isSelfEdit) {
        this.autoAddBasicPermissions()
      }
      
      // Validate warehouse access for warehouse managers
      if (this.userData.role === 'warehouse_manager' && 
          !this.userData.allWarehouses && 
          this.userData.allowedWarehouses.length === 0 &&
          !this.isSelfEdit) {
        this.showNotification({
          type: 'warning',
          message: 'مدير المخزن يحتاج إلى صلاحية لمخزن واحد على الأقل'
        })
      }
      
      setTimeout(() => {
        this.step2Loading = false
        this.nextStep()
      }, 300)
    },
    
    validateStep3() {
      this.clearErrors()
      let isValid = true
      
      // Password validation for new users (not for self-edit)
      if (!this.isSelfEdit && !this.editingUser) {
        if (this.passwordOption === 'manual') {
          if (!this.userData.password) {
            this.formErrors.password = 'كلمة المرور مطلوبة'
            isValid = false
          } else if (this.userData.password.length < 8) {
            this.formErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
            isValid = false
          } else if (this.passwordStrength.class === 'weak') {
            this.formErrors.password = 'كلمة المرور ضعيفة جداً'
            isValid = false
          }
          
          if (this.userData.password !== this.userData.confirmPassword) {
            this.formErrors.confirmPassword = 'كلمات المرور غير متطابقة'
            isValid = false
          }
        }
      }
      
      if (isValid) {
        this.saveUser()
      } else {
        this.scrollToFirstError()
      }
    },
    
    validateField(field) {
      switch (field) {
        case 'name':
          if (!this.userData.name?.trim()) {
            this.formErrors.name = 'الاسم الكامل مطلوب'
          } else if (this.userData.name.trim().length < 2) {
            this.formErrors.name = 'الاسم يجب أن يكون على الأقل حرفين'
          } else {
            this.clearError('name')
          }
          break
          
        case 'email':
          if (!this.userData.email?.trim()) {
            this.formErrors.email = 'البريد الإلكتروني مطلوب'
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.userData.email)) {
            this.formErrors.email = 'البريد الإلكتروني غير صالح'
          } else if (!this.isSelfEdit && !this.isEmailUnique()) {
            this.formErrors.email = 'البريد الإلكتروني مستخدم بالفعل'
          } else {
            this.clearError('email')
          }
          break
          
        case 'password':
          this.validatePassword()
          break
          
        case 'confirmPassword':
          if (this.userData.password !== this.userData.confirmPassword) {
            this.formErrors.confirmPassword = 'كلمات المرور غير متطابقة'
          } else {
            this.clearError('confirmPassword')
          }
          break
      }
    },
    
    validatePassword() {
      if (!this.userData.password) {
        this.formErrors.password = 'كلمة المرور مطلوبة'
      } else if (this.userData.password.length < 8) {
        this.formErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
      } else if (this.passwordStrength.class === 'weak') {
        this.formErrors.password = 'كلمة المرور ضعيفة جداً'
      } else {
        this.clearError('password')
      }
    },
    
    validatePhone(phone) {
      const digits = phone.replace(/\D/g, '')
      return digits.length >= 9 && digits.length <= 15
    },
    
    scrollToFirstError() {
      this.$nextTick(() => {
        const firstError = this.$el.querySelector('.error')
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      })
    },
    
    clearErrors() {
      this.formErrors = {}
    },
    
    clearError(field) {
      if (this.formErrors[field]) {
        delete this.formErrors[field]
      }
    },
    
    // Check if email is unique
    isEmailUnique() {
      const email = this.userData.email?.trim().toLowerCase()
      if (!email) return true
      
      const existingUsers = this.users || []
      if (this.editingUser) {
        return !existingUsers.some(user => 
          user.email?.toLowerCase() === email && user.id !== this.editingUser.id
        )
      }
      return !existingUsers.some(user => user.email?.toLowerCase() === email)
    },
    
    // Check if current user can assign this role
    canAssignRole(roleId) {
      if (this.isSelfEdit) {
        // For self-edit, can't change role
        return roleId === this.editingUser?.role
      }
      
      return this.getAllowedRolesForCreation.includes(roleId)
    },
    
    // Check if current user can assign this permission
    canAssignPermission(permissionId) {
      if (this.isSelfEdit) return false // Can't change own permissions
      
      // Superadmin can assign all permissions
      if (this.currentUserRole === 'superadmin') return true
      
      // Restrict certain admin permissions for non-superadmins
      const restrictedPermissions = [
        'manage_users',
        'manage_settings',
        'view_audit_log'
      ]
      
      if (this.currentUserRole !== 'superadmin' && restrictedPermissions.includes(permissionId)) {
        return false
      }
      
      return true
    },
    
    selectRole(roleId) {
      if (!this.canAssignRole(roleId)) {
        this.showNotification({
          type: 'warning',
          message: `ليس لديك صلاحية تعيين دور ${this.getRoleName(roleId)}`
        })
        return
      }
      
      this.userData.role = roleId
      this.clearError('role')
      
      // Auto-set permissions based on role (for new users only)
      if (!this.editingUser && !this.isSelfEdit) {
        this.autoSetPermissionsByRole()
      }
    },
    
    getRoleName(roleId) {
      const role = this.availableRoles.find(r => r.id === roleId)
      return role ? role.name : roleId
    },
    
    toggleAllWarehouses() {
      if (this.isSelfEdit) return
      
      this.userData.allWarehouses = !this.userData.allWarehouses
      if (!this.userData.allWarehouses) {
        const allWarehouseIds = [
          ...this.primaryWarehouses.map(w => w.id),
          ...this.dispatchWarehouses.map(w => w.id)
        ]
        this.userData.allowedWarehouses = [...allWarehouseIds]
      } else {
        this.userData.allowedWarehouses = []
      }
    },
    
    toggleAllWarehousesAccess() {
      if (this.userData.allWarehouses) {
        this.userData.allowedWarehouses = []
      }
    },
    
    isCategorySelected(categoryType) {
      if (this.isSelfEdit) return false
      
      let warehouses = []
      
      if (categoryType === 'primary') {
        warehouses = this.primaryWarehouses.map(w => w.id)
      } else if (categoryType === 'dispatch') {
        warehouses = this.dispatchWarehouses.map(w => w.id)
      }
      
      if (warehouses.length === 0) return false
      
      return warehouses.every(id => this.userData.allowedWarehouses.includes(id))
    },
    
    toggleCategory(categoryType) {
      if (this.isSelfEdit) return
      
      let warehouses = []
      
      if (categoryType === 'primary') {
        warehouses = this.primaryWarehouses.map(w => w.id)
      } else if (categoryType === 'dispatch') {
        warehouses = this.dispatchWarehouses.map(w => w.id)
      }
      
      const allSelected = this.isCategorySelected(categoryType)
      
      if (allSelected) {
        this.userData.allowedWarehouses = this.userData.allowedWarehouses.filter(
          id => !warehouses.includes(id)
        )
      } else {
        warehouses.forEach(id => {
          if (!this.userData.allowedWarehouses.includes(id)) {
            this.userData.allowedWarehouses.push(id)
          }
        })
      }
      
      this.userData.allWarehouses = false
    },
    
    handleWarehouseSelection(warehouseId) {
      if (this.isSelfEdit) return
      
      if (this.userData.allWarehouses) {
        this.userData.allWarehouses = false
      }
      
      const index = this.userData.allowedWarehouses.indexOf(warehouseId)
      if (index === -1) {
        this.userData.allowedWarehouses.push(warehouseId)
      } else {
        this.userData.allowedWarehouses.splice(index, 1)
      }
    },
    
    applyPermissionPreset(preset) {
      if (this.isSelfEdit) return
      
      let permissions = []
      
      switch (preset) {
        case 'view_only':
          permissions = [
            'view_items',
            'view_transactions',
            'view_reports',
            'view_dashboard'
          ]
          break
          
        case 'basic':
          permissions = [
            'view_items',
            'add_items',
            'edit_items',
            'view_transactions',
            'create_transactions',
            'transfer_items',
            'dispatch_items',
            'view_reports',
            'view_dashboard'
          ]
          break
          
        case 'full':
          permissions = this.permissionCategories.flatMap(category => 
            category.permissions.map(p => p.id)
          ).filter(permissionId => this.canAssignPermission(permissionId))
          break
      }
      
      this.userData.permissions = [...permissions]
    },
    
    isPermissionCategorySelected(permissions) {
      if (!permissions || permissions.length === 0) return false
      return permissions.every(p => this.userData.permissions.includes(p.id))
    },
    
    toggleCategorySelection(permissions, event) {
      if (this.isSelfEdit) return
      
      const checked = event.target.checked
      const permissionIds = permissions.map(p => p.id).filter(id => this.canAssignPermission(id))
      
      if (checked) {
        permissionIds.forEach(id => {
          if (!this.userData.permissions.includes(id)) {
            this.userData.permissions.push(id)
          }
        })
      } else {
        this.userData.permissions = this.userData.permissions.filter(
          id => !permissionIds.includes(id)
        )
      }
    },
    
    handlePermissionSelection(permissionId) {
      if (this.isSelfEdit || !this.canAssignPermission(permissionId)) return
      
      const index = this.userData.permissions.indexOf(permissionId)
      if (index === -1) {
        this.userData.permissions.push(permissionId)
      } else {
        this.userData.permissions.splice(index, 1)
      }
    },
    
    autoSetPermissionsByRole() {
      if (this.isSelfEdit || this.editingUser) return
      
      switch (this.userData.role) {
        case 'warehouse_manager':
          this.applyPermissionPreset('basic')
          break
          
        case 'company_manager':
          this.applyPermissionPreset('full')
          break
          
        case 'superadmin':
          this.applyPermissionPreset('full')
          break
          
        case 'user':
          this.applyPermissionPreset('view_only')
          break
      }
    },
    
    autoAddBasicPermissions() {
      const basicViewPermissions = [
        'view_items',
        'view_transactions',
        'view_dashboard'
      ]
      
      basicViewPermissions.forEach(permission => {
        if (!this.userData.permissions.includes(permission)) {
          this.userData.permissions.push(permission)
        }
      })
    },
    
    async saveUser() {
      try {
        this.saving = true
        this.loading = true
        this.loadingMessage = this.isSelfEdit ? 'جاري تحديث بياناتك...' : 
          (this.editingUser ? 'جاري تحديث بيانات المستخدم...' : 'جاري إنشاء الحساب...')
        
        // Prepare warehouse data in Firestore-compatible format
        let allowedWarehouses = {}
        if (this.userData.allWarehouses) {
          allowedWarehouses = { all: true }
        } else if (this.userData.allowedWarehouses.length > 0) {
          // Convert array to object format: { warehouseId: true }
          this.userData.allowedWarehouses.forEach(id => {
            allowedWarehouses[id] = true
          })
        }
        
        // Filter permissions based on role and current user's permissions
        let permissions = [...this.userData.permissions]
        if (this.userData.role === 'superadmin') {
          // Superadmin gets all permissions
          permissions = this.permissionCategories.flatMap(category => 
            category.permissions.map(p => p.id)
          )
        } else if (this.userData.role === 'user') {
          // Regular users get only view permissions
          permissions = permissions.filter(p => p.startsWith('view_'))
        }
        
        // Prepare user data for Firestore
        const userData = {
          name: this.userData.name.trim(),
          email: this.userData.email.trim().toLowerCase(),
          role: this.userData.role,
          phone: this.userData.phone ? 
            `${this.userData.phoneCountryCode}${this.userData.phone.replace(/\D/g, '')}` 
            : null,
          allowed_warehouses: Object.keys(allowedWarehouses).length > 0 ? allowedWarehouses : null,
          permissions: permissions.length > 0 ? permissions : null,
          is_active: this.userData.isActive,
          two_factor_enabled: this.userData.twoFactorEnabled,
          notes: this.userData.notes.trim() || null,
          updated_at: firestore.FieldValue.serverTimestamp(),
          updated_by: this.currentUserId
        }
        
        // Add creation fields for new users
        if (!this.editingUser) {
          userData.created_at = firestore.FieldValue.serverTimestamp()
          userData.created_by = this.currentUserId
        }
        
        let result
        
        if (this.editingUser) {
          // Update existing user
          result = await this.updateUser({
            userId: this.editingUser.id,
            userData
          })
          
          this.showNotification({
            type: 'success',
            message: this.isSelfEdit ? 
              'تم تحديث بياناتك بنجاح' : 
              `تم تحديث المستخدم "${userData.name}" بنجاح`
          })
        } else {
          // Create new user - handle password
          let password = this.userData.password
          
          if (this.passwordOption === 'auto') {
            password = generatePassword(12)
            this.generatedPassword = password
          }
          
          result = await this.createUser({
            ...userData,
            password,
            sendWelcomeEmail: this.userData.sendWelcomeEmail
          })
          
          this.createdUser = {
            name: userData.name,
            email: userData.email,
            role: userData.role,
            id: result.id
          }
        }
        
        this.showSuccessModal = true
        this.showModal = false
        
        if (this.onSuccess) {
          this.onSuccess(result)
        }
        
        this.$emit('success', {
          user: result,
          password: this.generatedPassword,
          isEdit: !!this.editingUser,
          isSelfEdit: this.isSelfEdit
        })
        
      } catch (error) {
        console.error('Error saving user:', error)
        
        let errorMessage = 'حدث خطأ أثناء حفظ المستخدم'
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'البريد الإلكتروني مستخدم بالفعل'
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'البريد الإلكتروني غير صالح'
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'كلمة المرور ضعيفة جداً'
        } else if (error.code === 'permission-denied') {
          errorMessage = 'ليس لديك صلاحية تنفيذ هذه العملية'
        } else if (error.message) {
          errorMessage = error.message
        }
        
        this.showErrorToast(errorMessage)
        
      } finally {
        this.saving = false
        this.loading = false
      }
    },
    
    createAnotherUser() {
      this.showSuccessModal = false
      this.resetForm()
      this.openModal()
    },
    
    viewUser() {
      if (this.createdUser) {
        this.$router.push(`/users/${this.createdUser.id}`)
      }
      this.closeSuccessModal()
    },
    
    goToAccountSettings() {
      this.closeModal()
      this.$router.push('/account/settings')
    },
    
    closeSuccessModal() {
      this.showSuccessModal = false
      this.createdUser = null
      this.generatedPassword = ''
      document.body.style.overflow = ''
      this.$emit('completed')
    },
    
    copyPassword() {
      if (this.generatedPassword) {
        navigator.clipboard.writeText(this.generatedPassword)
        this.showNotification({
          type: 'success',
          message: 'تم نسخ كلمة المرور إلى الحافظة'
        })
      }
    },
    
    showErrorToast(message) {
      this.errorMessage = message
      this.showError = true
      
      setTimeout(() => {
        this.hideError()
      }, 5000)
    },
    
    hideError() {
      this.showError = false
      this.errorMessage = ''
    }
  },
  
  mounted() {
    this.loadThemePreference()
    
    // Get current user info
    const currentUser = this.$store.getters.currentUser
    if (currentUser) {
      this.currentUserId = currentUser.id || currentUser.uid
      this.currentUserRole = currentUser.role
    }
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.isDarkMode = e.matches
      }
    })
  },
  
  beforeDestroy() {
    document.body.style.overflow = ''
  }
}
</script>

<style scoped>
/* Add these new styles to the existing CSS */

/* Unauthorized message */
.unauthorized-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 152, 0, 0.1);
  border: 1px solid var(--warning-color);
  border-radius: 8px;
  color: var(--warning-color);
  margin: 1rem 0;
}

.unauthorized-message i {
  font-size: 1.25rem;
}

.unauthorized-message p {
  margin: 0;
  font-weight: 500;
}

/* Current user info */
.current-user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  font-size: 0.9rem;
  flex-wrap: wrap;
}

.current-user-info i {
  color: #ffd700;
}

.role-restriction {
  font-size: 0.8rem;
  opacity: 0.9;
}

/* Edit badge */
.edit-badge {
  background: rgba(33, 150, 243, 0.2);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 0.5rem;
}

/* Role restrictions */
.role-option.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.role-option.disabled:hover {
  border-color: var(--border-color);
  transform: none;
  box-shadow: none;
}

.role-restricted {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  color: var(--error-color);
  margin-top: 0.25rem;
}

/* Permission restrictions */
.permission-item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.permission-item.disabled:hover {
  border-color: var(--border-color);
  transform: none;
}

.permission-restricted {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  color: var(--error-color);
  margin-top: 0.25rem;
}

/* Self edit messages */
.self-edit-message {
  background: rgba(33, 150, 243, 0.1);
  border: 1px solid var(--primary-color);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  color: var(--primary-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.self-edit-message i {
  font-size: 1.5rem;
}

.self-edit-message p {
  margin: 0;
  line-height: 1.4;
}

/* Self password message */
.self-password-message {
  background: rgba(33, 150, 243, 0.1);
  border: 1px solid var(--primary-color);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  color: var(--primary-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.self-password-message i {
  font-size: 2rem;
}

.self-password-message p {
  margin: 0;
  line-height: 1.4;
}

/* Status badge in settings */
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-badge.active {
  background: rgba(76, 175, 80, 0.1);
  color: var(--success-color);
}

.status-badge.inactive {
  background: rgba(244, 67, 54, 0.1);
  color: var(--error-color);
}

/* Full width summary item */
.full-width {
  grid-column: 1 / -1;
}

/* Hint warnings */
.hint-warning {
  color: var(--warning-color);
  font-size: 0.8rem;
  margin-right: 0.5rem;
}

.hint-error {
  color: var(--error-color);
  font-size: 0.8rem;
  margin-right: 0.5rem;
}

/* Disabled state styling */
input:disabled,
select:disabled,
textarea:disabled,
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.warehouse-option.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.warehouse-option.disabled:hover {
  border-color: var(--border-color);
  transform: none;
}

/* User role icon colors */
.role-icon.superadmin {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
}

.role-icon.company_manager {
  background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
}

.role-icon.warehouse_manager {
  background: linear-gradient(135deg, var(--primary-color) 0%, #1976D2 100%);
}

.role-icon.user {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
}

/* Add to existing button styles */
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

/* Update existing styles for better mobile */
@media (max-width: 768px) {
  .current-user-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .role-restriction {
    font-size: 0.75rem;
  }
}
</style>