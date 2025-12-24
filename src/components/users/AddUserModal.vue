<template>
  <div class="add-user-module" :class="{ 'dark-mode': isDarkMode }">
    <!-- Trigger Button (for standalone usage) -->
    <slot name="trigger" v-if="!autoOpen">
      <button @click="openModal" class="btn-primary add-user-btn">
        <i class="fas fa-user-plus"></i>
        {{ buttonText }}
      </button>
    </slot>

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
              </h2>
              <p class="modal-subtitle">
                {{ editingUser ? 'تعديل بيانات المستخدم الحالي' : 'إنشاء حساب جديد للمستخدم مع تحديد الصلاحيات' }}
              </p>
            </div>
            <button @click="closeModal" class="modal-close" aria-label="إغلاق">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Progress Steps - Mobile Optimized -->
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
                        >
                        <div class="form-hint">
                          <i class="fas fa-info-circle"></i>
                          سيظهر هذا الاسم في جميع أنحاء النظام
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
                        >
                        <div class="form-hint">
                          <i class="fas fa-info-circle"></i>
                          سيستخدم هذا البريد لتسجيل الدخول واستقبال الإشعارات
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
                            v-for="role in availableRoles" 
                            :key="role.id"
                            class="role-option"
                            :class="{ 'selected': userData.role === role.id }"
                            @click="selectRole(role.id)"
                          >
                            <div class="role-icon">
                              <i :class="role.icon"></i>
                            </div>
                            <div class="role-info">
                              <h4>{{ role.name }}</h4>
                              <p>{{ role.description }}</p>
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
                          >
                        </div>
                        <div class="form-hint">
                          <i class="fas fa-info-circle"></i>
                          اختياري - لاستخدامه في التواصل الطارئ
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
                        <div class="section-actions">
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
                        <div class="permission-option all-warehouses">
                          <label class="checkbox-label">
                            <input
                              type="checkbox"
                              v-model="userData.allWarehouses"
                              @change="toggleAllWarehousesAccess"
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
                                  :class="{ 'selected': userData.allowedWarehouses.includes(warehouse.id) }"
                                >
                                  <input
                                    type="checkbox"
                                    :value="warehouse.id"
                                    v-model="userData.allowedWarehouses"
                                    @change="handleWarehouseSelection(warehouse.id)"
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
                                  :class="{ 'selected': userData.allowedWarehouses.includes(warehouse.id) }"
                                >
                                  <input
                                    type="checkbox"
                                    :value="warehouse.id"
                                    v-model="userData.allowedWarehouses"
                                    @change="handleWarehouseSelection(warehouse.id)"
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
                      </div>
                    </div>

                    <!-- Permissions Section -->
                    <div class="form-section permissions-section">
                      <div class="section-header">
                        <h3>
                          <i class="fas fa-user-shield"></i> الصلاحيات التفصيلية
                        </h3>
                        <div class="permission-presets">
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
                              <label class="category-toggle">
                                <input
                                  type="checkbox"
                                  :checked="isCategorySelected(category.permissions)"
                                  @change="toggleCategorySelection(category.permissions, $event)"
                                >
                                <span>{{ isCategorySelected(category.permissions) ? 'إلغاء تحديد الكل' : 'تحديد الكل' }}</span>
                              </label>
                            </div>
                            
                            <div class="permission-list">
                              <label
                                v-for="permission in category.permissions"
                                :key="permission.id"
                                class="permission-item"
                                :class="{ 'selected': userData.permissions.includes(permission.id) }"
                              >
                                <input
                                  type="checkbox"
                                  :value="permission.id"
                                  v-model="userData.permissions"
                                  @change="handlePermissionSelection(permission.id)"
                                >
                                <span class="checkbox-custom"></span>
                                <div class="permission-info">
                                  <div class="permission-icon">
                                    <i :class="permission.icon"></i>
                                  </div>
                                  <div class="permission-details">
                                    <h5>{{ permission.name }}</h5>
                                    <p>{{ permission.description }}</p>
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
                      <div class="password-section">
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

                      <!-- Settings Section -->
                      <div class="settings-section">
                        <h4>
                          <i class="fas fa-cogs"></i> إعدادات الحساب
                        </h4>

                        <div class="settings-options">
                          <!-- Account Status -->
                          <div class="setting-option">
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
                          <div class="setting-option">
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
                          <div class="setting-option">
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
                            ></textarea>
                            <div class="form-hint">
                              <i class="fas fa-info-circle"></i>
                              هذه الملاحظات مرئية للمشرفين فقط
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Summary Preview -->
                    <div class="summary-preview">
                      <h4>
                        <i class="fas fa-clipboard-check"></i> ملخص المستخدم
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
                      {{ saving ? 'جاري إنشاء الحساب...' : (editingUser ? 'تحديث المستخدم' : 'إنشاء الحساب') }}
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
          <h2>{{ editingUser ? 'تم تحديث المستخدم بنجاح!' : 'تم إنشاء الحساب بنجاح!' }}</h2>
          
          <div class="success-details">
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

          <div class="success-actions">
            <button @click="createAnotherUser" class="btn-primary">
              <i class="fas fa-user-plus"></i> إضافة مستخدم آخر
            </button>
            <button @click="viewUser" class="btn-secondary">
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
      
      editingUser: null
    }
  },
  
  computed: {
    ...mapState(['warehouses']),
    ...mapGetters(['primaryWarehouses', 'dispatchWarehouses']),
    
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
    }
  },
  
  methods: {
    ...mapActions(['createUser', 'updateUser', 'showNotification']),
    
    openModal() {
      this.showModal = true
      this.currentStep = 1
      this.resetForm()
      this.loadThemePreference()
      
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden'
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
      this.userData = {
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'warehouse_manager',
        phone: user.phone || '',
        phoneCountryCode: user.phoneCountryCode || '+966',
        allWarehouses: user.allowed_warehouses?.includes('all') || false,
        allowedWarehouses: user.allowed_warehouses?.filter(w => w !== 'all') || [],
        permissions: user.permissions?.filter(p => p !== 'full_access') || [],
        password: '',
        confirmPassword: '',
        isActive: user.is_active !== false,
        sendWelcomeEmail: false,
        twoFactorEnabled: user.two_factor_enabled || false,
        notes: user.notes || ''
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
      
      if (!this.userData.name?.trim()) {
        this.formErrors.name = 'الاسم الكامل مطلوب'
        isValid = false
      } else if (this.userData.name.trim().length < 2) {
        this.formErrors.name = 'الاسم يجب أن يكون على الأقل حرفين'
        isValid = false
      }
      
      if (!this.userData.email?.trim()) {
        this.formErrors.email = 'البريد الإلكتروني مطلوب'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.userData.email)) {
        this.formErrors.email = 'البريد الإلكتروني غير صالح'
        isValid = false
      }
      
      if (!this.userData.role) {
        this.formErrors.role = 'يجب اختيار دور للمستخدم'
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
      
      if (!this.userData.allWarehouses && this.userData.allowedWarehouses.length === 0) {
        this.showNotification({
          type: 'warning',
          message: 'لم يتم اختيار أي مخزن. سيتم إنشاء المستخدم بدون صلاحيات للمخازن.'
        })
      }
      
      this.autoAddBasicPermissions()
      
      setTimeout(() => {
        this.step2Loading = false
        this.nextStep()
      }, 300)
    },
    
    validateStep3() {
      this.clearErrors()
      let isValid = true
      
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
    
    selectRole(roleId) {
      this.userData.role = roleId
      this.clearError('role')
      this.autoSetPermissionsByRole()
    },
    
    getRoleName(roleId) {
      const role = this.availableRoles.find(r => r.id === roleId)
      return role ? role.name : roleId
    },
    
    toggleAllWarehouses() {
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
          )
          break
      }
      
      this.userData.permissions = [...permissions]
    },
    
    isPermissionCategorySelected(permissions) {
      if (!permissions || permissions.length === 0) return false
      return permissions.every(p => this.userData.permissions.includes(p.id))
    },
    
    toggleCategorySelection(permissions, event) {
      const checked = event.target.checked
      const permissionIds = permissions.map(p => p.id)
      
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
      const index = this.userData.permissions.indexOf(permissionId)
      if (index === -1) {
        this.userData.permissions.push(permissionId)
      } else {
        this.userData.permissions.splice(index, 1)
      }
    },
    
    autoSetPermissionsByRole() {
      switch (this.userData.role) {
        case 'warehouse_manager':
          this.applyPermissionPreset('basic')
          break
          
        case 'company_manager':
        case 'superadmin':
          this.applyPermissionPreset('full')
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
        this.loadingMessage = this.editingUser ? 'جاري تحديث بيانات المستخدم...' : 'جاري إنشاء الحساب...'
        
        const userData = {
          name: this.userData.name.trim(),
          email: this.userData.email.trim(),
          role: this.userData.role,
          phone: this.userData.phone ? `${this.userData.phoneCountryCode}${this.userData.phone}` : '',
          allowed_warehouses: this.userData.allWarehouses 
            ? ['all'] 
            : [...this.userData.allowedWarehouses],
          permissions: this.userData.permissions,
          is_active: this.userData.isActive,
          two_factor_enabled: this.userData.twoFactorEnabled,
          notes: this.userData.notes.trim()
        }
        
        let result
        
        if (this.editingUser) {
          result = await this.updateUser({
            userId: this.editingUser.id,
            userData
          })
          
          this.showNotification({
            type: 'success',
            message: `تم تحديث المستخدم "${userData.name}" بنجاح`
          })
        } else {
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
            role: userData.role
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
          isEdit: !!this.editingUser
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
/* Base Styles */
.add-user-module {
  font-family: 'Tajawal', 'Segoe UI', sans-serif;
  direction: rtl;
}

.add-user-module.dark-mode {
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
  --secondary-color: #6c757d;
}

/* Trigger Button */
.add-user-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, #1976D2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 6px rgba(33, 150, 243, 0.2);
}

.add-user-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(33, 150, 243, 0.3);
}

/* Modal Overlay - Centered and Responsive */
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
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: var(--bg-card, #fff);
  border-radius: 16px;
  box-shadow: 0 20px 60px var(--shadow-color, rgba(0, 0, 0, 0.3));
  animation: slideUp 0.3s ease;
  overflow: hidden;
  width: 100%;
}

/* Modal Header */
.modal-header {
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.header-content {
  flex: 1;
}

.header-content h2 {
  margin: 0;
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.modal-subtitle {
  margin: 0.5rem 0 0;
  opacity: 0.9;
  font-size: 0.95rem;
  line-height: 1.4;
}

.modal-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.2s;
  flex-shrink: 0;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

/* Progress Steps - Mobile Optimized */
.progress-steps {
  padding: 1.5rem 2rem;
  background: var(--bg-secondary, #f8f9fa);
  border-bottom: 1px solid var(--border-color, #e0e0e0);
}

.steps-container {
  display: flex;
  justify-content: space-between;
  position: relative;
  gap: 1rem;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  position: relative;
  flex: 1;
  z-index: 1;
  min-width: 0;
}

.step-number {
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 50%;
  background: var(--bg-input, #e9ecef);
  color: var(--text-secondary, #6c757d);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.step-item.active .step-number {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.2);
}

.step-item.completed .step-number {
  background: var(--success-color);
  color: white;
}

.step-info {
  flex: 1;
  min-width: 0;
}

.step-info h4 {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-primary, #333);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.step-info p {
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: var(--text-secondary, #666);
  display: none;
}

.step-item.active .step-info h4 {
  color: var(--primary-color);
  font-weight: 600;
}

.step-connector {
  position: absolute;
  top: 18px;
  left: -50%;
  right: 50%;
  height: 2px;
  background: var(--border-color, #e0e0e0);
  z-index: 0;
}

.step-item.completed .step-connector {
  background: var(--success-color);
}

/* Step Content Wrapper */
.step-content-wrapper {
  max-height: calc(90vh - 200px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.step-content {
  padding: 2rem;
  animation: fadeIn 0.3s ease;
}

.step-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Form Sections */
.form-section {
  background: var(--bg-card, #fff);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--border-color, #e0e0e0);
}

.form-section h3 {
  margin: 0 0 1.5rem;
  color: var(--text-primary, #333);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  flex-wrap: wrap;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Form Groups */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary, #333);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 8px;
  background: var(--bg-input, #fff);
  color: var(--text-primary, #333);
  font-size: 0.95rem;
  transition: all 0.2s;
  width: 100%;
  -webkit-appearance: none;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.form-group.error input,
.form-group.error select {
  border-color: var(--error-color);
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}

/* Form Hints */
.form-hint {
  font-size: 0.75rem;
  color: var(--text-secondary, #666);
  margin-top: 0.25rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  line-height: 1.4;
}

/* Error Messages */
.error-message {
  font-size: 0.75rem;
  color: var(--error-color);
  margin-top: 0.25rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  line-height: 1.4;
}

/* Role Selector */
.role-selector {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.role-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-input, #f8f9fa);
  border: 2px solid var(--border-color, #ddd);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  flex-wrap: wrap;
}

.role-option:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.role-option.selected {
  border-color: var(--primary-color);
  background: rgba(33, 150, 243, 0.05);
}

.role-icon {
  width: 50px;
  height: 50px;
  min-width: 50px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--primary-color) 0%, #1976D2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.role-option.superadmin .role-icon {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
}

.role-option.company_manager .role-icon {
  background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
}

.role-info {
  flex: 1;
  min-width: 200px;
}

.role-info h4 {
  margin: 0;
  font-size: 1rem;
  color: var(--text-primary, #333);
}

.role-info p {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: var(--text-secondary, #666);
  line-height: 1.4;
}

.role-check {
  color: var(--primary-color);
  font-size: 1.25rem;
  opacity: 0;
  transition: opacity 0.2s;
  min-width: 24px;
}

.role-option.selected .role-check {
  opacity: 1;
}

/* Phone Input */
.phone-input {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.country-code {
  width: 120px;
  flex-shrink: 0;
}

.phone-input input {
  flex: 1;
  min-width: 150px;
}

/* Step 2 Specific Styles */
.form-sections-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header h3 {
  margin: 0;
  flex: 1;
  min-width: 200px;
}

.section-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Warehouse Section */
.warehouse-section {
  display: flex;
  flex-direction: column;
}

.warehouse-permissions {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.permission-option.all-warehouses {
  background: var(--bg-input, #f8f9fa);
  padding: 1rem;
  border-radius: 10px;
  border: 2px solid var(--border-color, #ddd);
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  cursor: pointer;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  min-width: 20px;
  border: 2px solid var(--border-color, #ddd);
  border-radius: 4px;
  position: relative;
  transition: all 0.2s;
  margin-top: 0.25rem;
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
}

.checkbox-content h4 {
  margin: 0;
  font-size: 1rem;
  color: var(--text-primary, #333);
}

.checkbox-content p {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: var(--text-secondary, #666);
  line-height: 1.4;
}

/* Specific Warehouses */
.specific-warehouses {
  flex: 1;
  overflow-y: auto;
}

.warehouse-categories {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.category-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.category-header h4 {
  margin: 0;
  color: var(--text-primary, #333);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 150px;
}

.warehouse-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
}

.warehouse-option {
  background: var(--bg-card, #fff);
  border: 1px solid var(--border-color, #ddd);
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.warehouse-option:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.warehouse-option.selected {
  border-color: var(--primary-color);
  background: rgba(33, 150, 243, 0.05);
}

.warehouse-option input {
  display: none;
}

.warehouse-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.warehouse-icon {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 8px;
  background: var(--bg-input, #f8f9fa);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.warehouse-details {
  flex: 1;
  min-width: 0;
}

.warehouse-details h5 {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-primary, #333);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.warehouse-details p {
  margin: 0.25rem 0;
  font-size: 0.75rem;
  color: var(--text-secondary, #666);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.warehouse-status {
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
}

.warehouse-status.active {
  color: var(--success-color);
}

.warehouse-status:not(.active) {
  color: var(--error-color);
}

.no-warehouses-message {
  background: rgba(255, 152, 0, 0.1);
  border: 1px solid var(--warning-color);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  color: var(--warning-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.no-warehouses-message i {
  font-size: 1.5rem;
}

.no-warehouses-message p {
  margin: 0;
  line-height: 1.4;
}

/* Permissions Section */
.permissions-section {
  display: flex;
  flex-direction: column;
}

.permission-presets {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.permission-presets span {
  font-size: 0.875rem;
  color: var(--text-secondary, #666);
  white-space: nowrap;
}

.preset-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.preset-btn {
  background: var(--bg-card, #fff);
  border: 1px solid var(--border-color, #ddd);
  color: var(--text-secondary, #666);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  white-space: nowrap;
}

.preset-btn:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.permissions-container {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.permissions-summary {
  background: rgba(33, 150, 243, 0.1);
  border: 1px solid var(--primary-color);
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.permissions-summary i {
  font-size: 2rem;
  color: var(--primary-color);
  flex-shrink: 0;
}

.permissions-summary h4 {
  margin: 0;
  color: var(--text-primary, #333);
  font-size: 1rem;
}

.permissions-summary p {
  margin: 0.25rem 0 0;
  color: var(--text-secondary, #666);
  font-size: 0.85rem;
  line-height: 1.4;
}

.permission-categories {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.permission-category {
  background: var(--bg-card, #fff);
  border-radius: 10px;
  padding: 1rem;
  border: 1px solid var(--border-color, #ddd);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.category-header h4 {
  margin: 0;
  color: var(--text-primary, #333);
  flex: 1;
  min-width: 150px;
}

.category-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--text-secondary, #666);
  white-space: nowrap;
}

.category-toggle input {
  width: 16px;
  height: 16px;
  min-width: 16px;
  cursor: pointer;
}

.permission-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.permission-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-input, #f8f9fa);
  border: 1px solid var(--border-color, #ddd);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.permission-item:hover {
  border-color: var(--primary-color);
  transform: translateX(-4px);
}

.permission-item.selected {
  border-color: var(--primary-color);
  background: rgba(33, 150, 243, 0.05);
}

.permission-item input {
  display: none;
}

.permission-info {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.permission-icon {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 8px;
  background: var(--bg-card, #fff);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.permission-details {
  flex: 1;
  min-width: 200px;
}

.permission-details h5 {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-primary, #333);
}

.permission-details p {
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  color: var(--text-secondary, #666);
  line-height: 1.4;
}

.permission-hint {
  font-size: 0.75rem;
  color: var(--text-secondary, #666);
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem;
  background: var(--bg-card, #fff);
  border-radius: 6px;
  max-width: 200px;
  line-height: 1.4;
}

/* Step 3 Specific Styles */
.password-section,
.settings-section {
  background: var(--bg-card, #fff);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--border-color, #ddd);
}

.password-section h4,
.settings-section h4 {
  margin: 0 0 1rem;
  color: var(--text-primary, #333);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.section-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 0.5rem;
  white-space: nowrap;
}

.section-badge.weak {
  background: rgba(244, 67, 54, 0.1);
  color: var(--error-color);
}

.section-badge.medium {
  background: rgba(255, 152, 0, 0.1);
  color: var(--warning-color);
}

.section-badge.strong {
  background: rgba(76, 175, 80, 0.1);
  color: var(--success-color);
}

.password-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.password-option {
  background: var(--bg-input, #f8f9fa);
  border-radius: 10px;
  padding: 1rem;
  border: 2px solid var(--border-color, #ddd);
  transition: all 0.2s;
}

.password-option:hover {
  border-color: var(--primary-color);
}

.radio-label {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  cursor: pointer;
}

.radio-custom {
  width: 20px;
  height: 20px;
  min-width: 20px;
  border: 2px solid var(--border-color, #ddd);
  border-radius: 50%;
  position: relative;
  margin-top: 0.25rem;
  transition: all 0.2s;
}

.radio-label input {
  display: none;
}

.radio-label input:checked + .radio-custom {
  border-color: var(--primary-color);
}

.radio-label input:checked + .radio-custom::after {
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
  min-width: 200px;
}

.option-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
}

.option-header h5 {
  margin: 0;
  font-size: 1rem;
  color: var(--text-primary, #333);
}

.option-recommended {
  background: var(--success-color);
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;
}

.option-content p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-secondary, #666);
  line-height: 1.4;
}

.manual-password-fields {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color, #ddd);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.password-input {
  position: relative;
}

.password-input input {
  width: 100%;
  padding-right: 3rem;
}

.password-toggle {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary, #666);
  cursor: pointer;
  padding: 0.25rem;
  z-index: 1;
}

.password-strength-indicator {
  margin-top: 0.5rem;
}

.strength-bars {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.25rem;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: var(--border-color, #ddd);
  border-radius: 2px;
  transition: all 0.3s;
}

.strength-bar.filled.weak {
  background: var(--error-color);
}

.strength-bar.filled.medium {
  background: var(--warning-color);
}

.strength-bar.filled.strong {
  background: var(--success-color);
}

.strength-text {
  font-size: 0.75rem;
  color: var(--text-secondary, #666);
  line-height: 1.4;
}

.password-requirements {
  background: var(--bg-input, #f8f9fa);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

.password-requirements h5 {
  margin: 0 0 0.75rem;
  font-size: 0.9rem;
  color: var(--text-primary, #333);
}

.password-requirements ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.password-requirements li {
  font-size: 0.85rem;
  color: var(--text-secondary, #666);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s;
}

.password-requirements li.met {
  color: var(--success-color);
}

.password-requirements li i.fa-check-circle {
  color: var(--success-color);
}

/* Settings Options */
.settings-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.setting-option {
  background: var(--bg-input, #f8f9fa);
  border-radius: 10px;
  padding: 1rem;
  border: 1px solid var(--border-color, #ddd);
}

.toggle-label {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
  gap: 1rem;
}

.toggle-info {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
  min-width: 200px;
}

.toggle-info i {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-top: 0.25rem;
}

.toggle-info h5 {
  margin: 0;
  font-size: 1rem;
  color: var(--text-primary, #333);
}

.toggle-info p {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: var(--text-secondary, #666);
  line-height: 1.4;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  flex-shrink: 0;
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

.toggle-switch input:checked + .toggle-slider {
  background-color: var(--success-color);
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

/* Summary Preview */
.summary-preview {
  background: var(--bg-input, #f8f9fa);
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid var(--primary-color);
  margin-top: 1.5rem;
}

.summary-preview h4 {
  margin: 0 0 1rem;
  color: var(--text-primary, #333);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--bg-card, #fff);
  border-radius: 8px;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.summary-label {
  font-weight: 600;
  color: var(--text-secondary, #666);
  font-size: 0.9rem;
  white-space: nowrap;
}

.summary-value {
  color: var(--text-primary, #333);
  font-size: 0.9rem;
  text-align: left;
  white-space: nowrap;
}

.summary-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.summary-badge.warehouse_manager {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.summary-badge.company_manager {
  background: rgba(156, 39, 176, 0.1);
  color: #9c27b0;
}

.summary-badge.superadmin {
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.summary-badge.active {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.summary-badge.inactive {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

/* Step Actions */
.step-actions {
  display: flex;
  justify-content: space-between;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color, #ddd);
  flex-wrap: wrap;
  gap: 1rem;
}

/* Buttons */
.btn-primary,
.btn-secondary,
.btn-success {
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
  transform: none !important;
}

.btn-secondary {
  background: var(--bg-input, #f8f9fa);
  color: var(--text-secondary, #666);
  border: 1px solid var(--border-color, #ddd);
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

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

/* Success Modal */
.success-modal .modal-content {
  text-align: center;
  max-width: 500px;
}

.success-icon {
  font-size: 4rem;
  color: var(--success-color);
  margin-bottom: 1.5rem;
}

.success-modal h2 {
  margin: 0 0 1.5rem;
  color: var(--text-primary, #333);
  line-height: 1.4;
}

.success-details {
  background: var(--bg-input, #f8f9fa);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: right;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item i {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-top: 0.25rem;
  flex-shrink: 0;
}

.detail-item > div {
  flex: 1;
  min-width: 200px;
}

.detail-item h4 {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary, #666);
}

.detail-item p {
  margin: 0.25rem 0 0;
  color: var(--text-primary, #333);
  line-height: 1.4;
}

.password-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0.5rem 0;
  flex-wrap: wrap;
}

.password-display code {
  flex: 1;
  background: var(--bg-card, #fff);
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--border-color, #ddd);
  font-family: monospace;
  font-size: 1rem;
  text-align: center;
  min-width: 200px;
  word-break: break-all;
}

.copy-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  white-space: nowrap;
}

.password-warning {
  color: var(--warning-color);
  font-size: 0.85rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 0.5rem;
  line-height: 1.4;
}

.success-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.loading-content {
  text-align: center;
  color: white;
  max-width: 300px;
}

.loading-content .spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.loading-content p {
  font-size: 1.125rem;
  margin: 0;
  line-height: 1.4;
}

/* Error Toast */
.error-toast {
  position: fixed;
  bottom: 2rem;
  left: 1rem;
  right: 1rem;
  max-width: 400px;
  margin: 0 auto;
  background: var(--bg-card, #fff);
  border-radius: 12px;
  box-shadow: 0 4px 20px var(--shadow-color, rgba(0, 0, 0, 0.2));
  padding: 1rem 1.5rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  animation: slideUp 0.3s ease;
  z-index: 2000;
  border-right: 4px solid var(--error-color);
}

.toast-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
}

.toast-content i {
  font-size: 1.5rem;
  color: var(--error-color);
  margin-top: 0.125rem;
}

.toast-content h4 {
  margin: 0;
  color: var(--text-primary, #333);
  font-size: 0.95rem;
}

.toast-content p {
  margin: 0.25rem 0 0;
  color: var(--text-secondary, #666);
  font-size: 0.85rem;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: var(--text-secondary, #666);
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  margin-top: -0.25rem;
}

/* Step Transitions */
.step-transition-enter-active,
.step-transition-leave-active {
  transition: all 0.3s ease;
}

.step-transition-enter-from,
.step-transition-leave-to {
  opacity: 0;
  transform: translateX(20px);
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
@media (max-width: 992px) {
  .form-sections-grid {
    grid-template-columns: 1fr;
  }
  
  .step-info p {
    display: block;
  }
}

@media (max-width: 768px) {
  .modal-container {
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 1rem 1.5rem;
  }
  
  .header-content h2 {
    font-size: 1.5rem;
  }
  
  .modal-subtitle {
    font-size: 0.85rem;
  }
  
  .progress-steps {
    padding: 1rem 1.5rem;
  }
  
  .steps-container {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .step-item {
    width: 100%;
  }
  
  .step-connector {
    display: block;
    top: 0;
    bottom: 0;
    left: 18px;
    right: auto;
    width: 2px;
    height: calc(100% + 1.5rem);
    transform: translateY(18px);
  }
  
  .step-content {
    padding: 1.5rem;
  }
  
  .step-content-wrapper {
    max-height: calc(95vh - 180px);
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .warehouse-grid {
    grid-template-columns: 1fr;
  }
  
  .step-actions {
    flex-direction: column;
  }
  
  .step-actions button {
    width: 100%;
    justify-content: center;
  }
  
  .form-section h3,
  .section-header h3,
  .password-section h4,
  .settings-section h4 {
    font-size: 1.1rem;
  }
  
  .role-info {
    min-width: 150px;
  }
  
  .permission-details {
    min-width: 150px;
  }
  
  .option-content {
    min-width: 150px;
  }
  
  .toggle-info {
    min-width: 150px;
  }
  
  .detail-item > div {
    min-width: 150px;
  }
  
  .password-display code {
    min-width: 150px;
  }
}

@media (max-width: 480px) {
  .modal-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .modal-close {
    align-self: flex-end;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .section-actions {
    justify-content: flex-start;
  }
  
  .category-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .category-toggle {
    align-self: flex-start;
  }
  
  .permission-presets {
    flex-direction: column;
    align-items: stretch;
  }
  
  .preset-buttons {
    justify-content: flex-start;
  }
  
  .toggle-label {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .toggle-switch {
    align-self: flex-start;
  }
  
  .summary-row {
    grid-template-columns: 1fr;
  }
  
  .success-actions {
    flex-direction: column;
  }
  
  .success-actions button {
    width: 100%;
    justify-content: center;
  }
  
  .role-option {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
  
  .role-info {
    text-align: center;
  }
  
  .phone-input {
    flex-direction: column;
  }
  
  .country-code {
    width: 100%;
  }
  
  .permission-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .permission-info {
    flex-direction: column;
    align-items: stretch;
  }
  
  .permission-hint {
    max-width: none;
  }
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .btn-primary,
  .btn-secondary,
  .btn-success,
  .btn-sm,
  .preset-btn,
  .copy-btn,
  .modal-close,
  .password-toggle,
  .toast-close {
    min-height: 44px;
    min-width: 44px;
  }
  
  .role-option,
  .warehouse-option,
  .permission-item,
  .password-option,
  .setting-option {
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
  
  .toggle-switch {
    min-width: 60px;
    min-height: 34px;
  }
  
  .toggle-slider:before {
    min-width: 26px;
    min-height: 26px;
  }
}
</style>
