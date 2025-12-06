// src/services/UserService.js
import { 
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  limit,
  writeBatch
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  updateProfile as updateFirebaseProfile,
  sendEmailVerification
} from 'firebase/auth';
import { auth, db } from '@/firebase/config';

class UserService {
  constructor() {
    this.usersCollection = 'users';
    this.logsCollection = 'user_logs';
    this.profilesCollection = 'user_profiles';
  }

  /**
   * Check if current user is superadmin
   * @private
   */
  async _checkSuperAdminPermission() {
    try {
      if (!auth.currentUser) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }
      
      const userDoc = await getDoc(doc(db, this.usersCollection, auth.currentUser.uid));
      if (!userDoc.exists()) {
        throw new Error('ملف المستخدم غير موجود');
      }
      
      const userData = userDoc.data();
      if (userData.role !== 'superadmin') {
        throw new Error('ليس لديك صلاحية لإدارة المستخدمين');
      }
      
      return userData;
    } catch (error) {
      console.error('Permission check error:', error);
      throw error;
    }
  }

  /**
   * Get all users with pagination and filters
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Users with pagination info
   */
  async getUsers(params = {}) {
    try {
      await this._checkSuperAdminPermission();

      const {
        page = 1,
        limit: itemsPerPage = 20,
        search = '',
        role = '',
        is_active = null,
        sort_by = 'created_at',
        sort_order = 'desc'
      } = params;

      let usersQuery = collection(db, this.usersCollection);
      const constraints = [];

      // Apply filters
      if (role) {
        constraints.push(where('role', '==', role));
      }

      if (is_active !== null) {
        constraints.push(where('is_active', '==', is_active));
      }

      // Apply sorting
      constraints.push(orderBy(sort_by, sort_order));

      // Create query
      usersQuery = query(usersQuery, ...constraints);
      const snapshot = await getDocs(usersQuery);

      // Process results
      let users = [];
      snapshot.forEach((docSnap) => {
        const userData = docSnap.data();
        if (this._userMatchesSearch(userData, search)) {
          users.push({
            id: docSnap.id,
            ...userData,
            created_at: this._formatTimestamp(userData.created_at),
            updated_at: this._formatTimestamp(userData.updated_at),
            last_login: this._formatTimestamp(userData.last_login)
          });
        }
      });

      // Apply pagination
      const totalItems = users.length;
      const startIndex = (page - 1) * itemsPerPage;
      const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

      return {
        success: true,
        data: paginatedUsers,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalItems / itemsPerPage),
          totalItems,
          itemsPerPage
        }
      };
    } catch (error) {
      console.error('UserService.getUsers Error:', error);
      return {
        success: false,
        error: this._handleFirebaseError(error),
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 20
        }
      };
    }
  }

  /**
   * Get single user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - User object
   */
  async getUserById(userId) {
    try {
      const userDoc = doc(db, this.usersCollection, userId);
      const userSnap = await getDoc(userDoc);

      if (!userSnap.exists()) {
        return {
          success: false,
          error: 'المستخدم غير موجود',
          data: null
        };
      }

      const userData = userSnap.data();
      const formattedUser = {
        id: userSnap.id,
        ...userData,
        created_at: this._formatTimestamp(userData.created_at),
        updated_at: this._formatTimestamp(userData.updated_at),
        last_login: this._formatTimestamp(userData.last_login)
      };

      return {
        success: true,
        data: formattedUser,
        message: 'تم تحميل المستخدم بنجاح'
      };
    } catch (error) {
      console.error('UserService.getUserById Error:', error);
      return {
        success: false,
        error: this._handleFirebaseError(error),
        data: null
      };
    }
  }

  /**
   * Create new user - FIXED VERSION
   * @param {Object} userData - User data from modal
   * @returns {Promise<Object>} - Created user
   */
  async createUser(userData) {
    try {
      console.log('UserService.createUser called with:', userData);
      await this._checkSuperAdminPermission();

      // Validate user data
      const validation = this.validateUserData(userData, false);
      if (!validation.isValid) {
        console.error('Validation errors:', validation.errors);
        return {
          success: false,
          error: validation.errors[0],
          data: null
        };
      }

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email.trim().toLowerCase(),
        userData.password
      );

      const firebaseUser = userCredential.user;
      const userId = firebaseUser.uid;

      // Get default permissions if none provided
      const defaultPermissions = this.getDefaultPermissionsForRole(userData.role);
      
      // Prepare COMPLETE user document for Firestore
      const userDoc = {
        name: userData.name ? userData.name.trim() : '',
        email: userData.email ? userData.email.trim().toLowerCase() : '',
        phone: userData.phone ? userData.phone.trim() : null,
        role: userData.role || 'company_manager',
        is_active: userData.is_active !== false,
        // CRITICAL FIX: Save the permissions from modal, not default ones
        permissions: Array.isArray(userData.permissions) && userData.permissions.length > 0 
          ? userData.permissions 
          : defaultPermissions,
        // CRITICAL FIX: Save allowed_warehouses from modal
        allowed_warehouses: userData.role === 'warehouse_manager' 
          ? (Array.isArray(userData.allowed_warehouses) ? userData.allowed_warehouses : [])
          : [],
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        created_by: auth.currentUser?.uid || 'system',
        email_verified: false,
        last_login: null,
        profile_complete: true
      };

      console.log('Creating user document:', userDoc);

      // Set user display name in Firebase Auth
      await updateFirebaseProfile(firebaseUser, {
        displayName: userDoc.name
      });

      // Send email verification
      await sendEmailVerification(firebaseUser);

      // Save to Firestore
      const userRef = doc(db, this.usersCollection, userId);
      await setDoc(userRef, userDoc);

      // Create user profile
      const profileRef = doc(db, this.profilesCollection, userId);
      await setDoc(profileRef, {
        user_id: userId,
        preferences: {
          language: 'ar',
          theme: 'light',
          notifications: true
        },
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });

      // Log the action
      await this._logUserAction('create', userId, { 
        name: userDoc.name, 
        email: userDoc.email, 
        role: userDoc.role,
        permissions: userDoc.permissions,
        allowed_warehouses: userDoc.allowed_warehouses
      });

      return {
        success: true,
        data: {
          id: userId,
          ...userDoc,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        message: 'تم إنشاء المستخدم بنجاح'
      };
    } catch (error) {
      console.error('UserService.createUser Error:', error);
      return {
        success: false,
        error: this._handleFirebaseError(error),
        data: null
      };
    }
  }

  /**
   * Update existing user - FIXED VERSION
   * @param {string} userId - User ID
   * @param {Object} userData - User data from modal
   * @returns {Promise<Object>} - Updated user
   */
  async updateUser(userId, userData) {
    try {
      console.log('UserService.updateUser called for:', userId, 'with data:', userData);
      await this._checkSuperAdminPermission();

      // Get current user data
      const currentUser = await this.getUserById(userId);
      if (!currentUser.success) {
        return currentUser;
      }

      // Validate user data
      const validation = this.validateUserData(userData, true);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors[0],
          data: null
        };
      }

      // Prepare update data - CRITICAL FIX: Keep permissions and allowed_warehouses from modal
      const updateData = {
        name: userData.name ? userData.name.trim() : currentUser.data.name,
        phone: userData.phone ? userData.phone.trim() : currentUser.data.phone || null,
        role: userData.role || currentUser.data.role,
        is_active: userData.is_active !== false,
        // CRITICAL FIX: Update permissions from modal
        permissions: Array.isArray(userData.permissions) && userData.permissions.length > 0
          ? userData.permissions
          : currentUser.data.permissions || [],
        // CRITICAL FIX: Update allowed_warehouses from modal
        allowed_warehouses: userData.role === 'warehouse_manager'
          ? (Array.isArray(userData.allowed_warehouses) ? userData.allowed_warehouses : [])
          : [],
        updated_at: serverTimestamp(),
        updated_by: auth.currentUser?.uid
      };

      console.log('Updating user with data:', updateData);

      // Update display name in Firebase Auth
      if (userData.name && userData.name !== currentUser.data.name) {
        try {
          const firebaseUser = auth.currentUser;
          if (firebaseUser?.uid === userId) {
            await updateFirebaseProfile(firebaseUser, {
              displayName: updateData.name
            });
          }
        } catch (error) {
          console.warn('Could not update Firebase Auth profile:', error);
        }
      }

      // Update Firestore document
      const userRef = doc(db, this.usersCollection, userId);
      await updateDoc(userRef, updateData);

      // Log the action
      await this._logUserAction('update', userId, {
        name: updateData.name,
        role: updateData.role,
        is_active: updateData.is_active,
        permissions: updateData.permissions,
        allowed_warehouses: updateData.allowed_warehouses
      });

      return {
        success: true,
        data: {
          ...currentUser.data,
          ...updateData,
          updated_at: new Date().toISOString()
        },
        message: 'تم تحديث المستخدم بنجاح'
      };
    } catch (error) {
      console.error('UserService.updateUser Error:', error);
      return {
        success: false,
        error: this._handleFirebaseError(error),
        data: null
      };
    }
  }

  /**
   * Delete user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Result
   */
  async deleteUser(userId) {
    try {
      await this._checkSuperAdminPermission();

      // Check if user exists
      const userDoc = doc(db, this.usersCollection, userId);
      const userSnap = await getDoc(userDoc);

      if (!userSnap.exists()) {
        return {
          success: false,
          error: 'المستخدم غير موجود'
        };
      }

      // Don't allow self-deletion
      if (auth.currentUser?.uid === userId) {
        return {
          success: false,
          error: 'لا يمكن حذف حسابك الشخصي'
        };
      }

      const userData = userSnap.data();
      
      // Don't allow deletion of other superadmins
      if (userData.role === 'superadmin') {
        return {
          success: false,
          error: 'لا يمكن حذف مشرف عام آخر'
        };
      }

      // Delete from Firestore
      await deleteDoc(userDoc);

      // Delete user profile
      const profileRef = doc(db, this.profilesCollection, userId);
      await deleteDoc(profileRef);

      // Log the action
      await this._logUserAction('delete', userId, { 
        name: userData.name || 'غير معروف', 
        email: userData.email || 'غير معروف' 
      });

      return {
        success: true,
        message: 'تم حذف المستخدم بنجاح'
      };
    } catch (error) {
      console.error('UserService.deleteUser Error:', error);
      return {
        success: false,
        error: this._handleFirebaseError(error)
      };
    }
  }

  /**
   * Update user status (active/inactive)
   * @param {string} userId - User ID
   * @param {boolean} isActive - Status
   * @returns {Promise<Object>} - Result
   */
  async updateUserStatus(userId, isActive) {
    try {
      await this._checkSuperAdminPermission();

      // Check if user exists
      const userDoc = doc(db, this.usersCollection, userId);
      const userSnap = await getDoc(userDoc);

      if (!userSnap.exists()) {
        return {
          success: false,
          error: 'المخدم غير موجود'
        };
      }

      const userData = userSnap.data();
      
      // Don't allow self-deactivation for superadmins
      if (auth.currentUser?.uid === userId && userData.role === 'superadmin') {
        return {
          success: false,
          error: 'لا يمكن تعطيل حساب المشرف العام'
        };
      }

      // Don't allow deactivation of other superadmins
      if (!isActive && userData.role === 'superadmin') {
        return {
          success: false,
          error: 'لا يمكن تعطيل مشرف عام آخر'
        };
      }

      // Update status
      await updateDoc(userDoc, {
        is_active: isActive,
        updated_at: serverTimestamp(),
        updated_by: auth.currentUser?.uid
      });

      // Log the action
      await this._logUserAction(isActive ? 'activate' : 'deactivate', userId, {
        name: userData.name || 'غير معروف',
        previous_status: userData.is_active,
        new_status: isActive
      });

      return {
        success: true,
        message: `تم ${isActive ? 'تفعيل' : 'تعطيل'} المستخدم بنجاح`
      };
    } catch (error) {
      console.error('UserService.updateUserStatus Error:', error);
      return {
        success: false,
        error: this._handleFirebaseError(error)
      };
    }
  }

  /**
   * Search users by email or name
   * @param {string} searchTerm - Search term
   * @param {number} limitResults - Maximum results
   * @returns {Promise<Object>} - Search results
   */
  async searchUsers(searchTerm, limitResults = 10) {
    try {
      await this._checkSuperAdminPermission();

      const usersRef = collection(db, this.usersCollection);
      const snapshot = await getDocs(usersRef);

      const results = [];
      snapshot.forEach((docSnap) => {
        const userData = docSnap.data();
        if (this._userMatchesSearch(userData, searchTerm)) {
          results.push({
            id: docSnap.id,
            ...userData,
            created_at: this._formatTimestamp(userData.created_at),
            updated_at: this._formatTimestamp(userData.updated_at)
          });
        }
      });

      // Sort by relevance
      const sortedResults = results.sort((a, b) => {
        const aScore = this._calculateSearchScore(a, searchTerm);
        const bScore = this._calculateSearchScore(b, searchTerm);
        return bScore - aScore;
      });

      return {
        success: true,
        data: sortedResults.slice(0, limitResults),
        message: 'تم البحث بنجاح'
      };
    } catch (error) {
      console.error('UserService.searchUsers Error:', error);
      return {
        success: false,
        error: this._handleFirebaseError(error),
        data: []
      };
    }
  }

  /**
   * Get user statistics
   * @returns {Promise<Object>} - User statistics
   */
  async getUserStats() {
    try {
      await this._checkSuperAdminPermission();

      const usersRef = collection(db, this.usersCollection);
      const snapshot = await getDocs(usersRef);

      let totalUsers = 0;
      let activeUsers = 0;
      let superadmins = 0;
      let warehouseManagers = 0;
      let companyManagers = 0;

      snapshot.forEach((docSnap) => {
        const userData = docSnap.data();
        totalUsers++;
        
        if (userData.is_active !== false) activeUsers++;
        
        switch (userData.role) {
          case 'superadmin':
            superadmins++;
            break;
          case 'warehouse_manager':
            warehouseManagers++;
            break;
          case 'company_manager':
            companyManagers++;
            break;
        }
      });

      return {
        success: true,
        data: {
          total_users: totalUsers,
          active_users: activeUsers,
          inactive_users: totalUsers - activeUsers,
          superadmins,
          warehouse_managers: warehouseManagers,
          company_managers: companyManagers,
          roles_distribution: {
            superadmin: superadmins,
            warehouse_manager: warehouseManagers,
            company_manager: companyManagers
          }
        }
      };
    } catch (error) {
      console.error('UserService.getUserStats Error:', error);
      return {
        success: false,
        error: this._handleFirebaseError(error),
        data: null
      };
    }
  }

  /**
   * Generate random password
   * @param {number} length - Password length
   * @returns {string} - Generated password
   */
  generateRandomPassword(length = 12) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  /**
   * Log user action for audit trail
   * @private
   */
  async _logUserAction(action, userId, data = null) {
    try {
      const logsRef = collection(db, this.logsCollection);
      const logData = {
        action,
        user_id: userId,
        performed_by: auth.currentUser?.uid || 'system',
        performed_by_name: auth.currentUser?.displayName || 'System',
        data: data ? JSON.stringify(data) : null,
        timestamp: serverTimestamp(),
        ip_address: 'unknown'
      };

      await setDoc(doc(logsRef), logData);
    } catch (error) {
      console.error('Failed to log user action:', error);
    }
  }

  /**
   * Check if user matches search criteria with null checks
   * @private
   */
  _userMatchesSearch(userData, searchTerm) {
    if (!searchTerm || typeof searchTerm !== 'string') return true;
    
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    const name = (userData.name || '').toLowerCase();
    const email = (userData.email || '').toLowerCase();
    const phone = (userData.phone || '').toLowerCase();

    return name.includes(term) || 
           email.includes(term) || 
           phone.includes(term);
  }

  /**
   * Calculate search score for relevance sorting with null checks
   * @private
   */
  _calculateSearchScore(user, searchTerm) {
    if (!user || !searchTerm || typeof searchTerm !== 'string') return 0;
    
    let score = 0;
    const term = searchTerm.toLowerCase().trim();

    if (user.name && typeof user.name === 'string' && user.name.toLowerCase().includes(term)) score += 3;
    if (user.email && typeof user.email === 'string' && user.email.toLowerCase().includes(term)) score += 2;
    if (user.phone && typeof user.phone === 'string' && user.phone.toLowerCase().includes(term)) score += 1;

    return score;
  }

  /**
   * Format Firebase timestamp for display
   * @private
   */
  _formatTimestamp(timestamp) {
    if (!timestamp) return null;
    
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toISOString();
    }
    
    if (timestamp.toDate) {
      return timestamp.toDate().toISOString();
    }
    
    return timestamp;
  }

  /**
   * Handle Firebase errors and return user-friendly messages
   * @private
   */
  _handleFirebaseError(error) {
    if (!error) return 'حدث خطأ غير معروف';

    console.error('Firebase Error:', error.code, error.message);

    const errorMessages = {
      // Authentication errors
      'auth/email-already-in-use': 'البريد الإلكتروني مسجل مسبقاً',
      'auth/invalid-email': 'البريد الإلكتروني غير صالح',
      'auth/operation-not-allowed': 'عملية غير مسموحة',
      'auth/weak-password': 'كلمة المرور ضعيفة جداً',
      'auth/user-disabled': 'هذا الحساب معطل',
      'auth/user-not-found': 'المستخدم غير موجود',
      'auth/wrong-password': 'كلمة المرور غير صحيحة',
      'auth/too-many-requests': 'محاولات كثيرة جداً، يرجى الانتظار',
      
      // Firestore errors
      'permission-denied': 'ليس لديك صلاحية للقيام بهذا الإجراء',
      'not-found': 'المستند غير موجود',
      'already-exists': 'المستند موجود مسبقاً',
      'unavailable': 'الخدمة غير متاحة حالياً'
    };

    if (error.code && errorMessages[error.code]) {
      return errorMessages[error.code];
    }

    return error.message || 'حدث خطأ غير متوقع';
  }

  /**
   * Validate user data with null checks
   * @param {Object} userData - User data to validate
   * @param {boolean} isUpdate - Whether this is an update operation
   * @returns {Object} - Validation result
   */
  validateUserData(userData, isUpdate = false) {
    const errors = [];

    if (!userData || typeof userData !== 'object') {
      return {
        isValid: false,
        errors: ['بيانات المستخدم غير صالحة']
      };
    }

    // Name validation
    if (!userData.name || typeof userData.name !== 'string' || userData.name.trim().length < 2) {
      errors.push('الاسم يجب أن يكون على الأقل حرفين');
    }

    // Email validation
    if (!isUpdate || userData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!userData.email || typeof userData.email !== 'string' || !emailRegex.test(userData.email.trim())) {
        errors.push('البريد الإلكتروني غير صالح');
      }
    }

    // Phone validation (optional)
    if (userData.phone && typeof userData.phone === 'string' && userData.phone.trim()) {
      const phoneRegex = /^01[0-9]{9}$/;
      if (!phoneRegex.test(userData.phone.trim())) {
        errors.push('رقم الهاتف يجب أن يبدأ بـ 01 ويتكون من 11 رقماً');
      }
    }

    // Role validation
    const validRoles = ['superadmin', 'warehouse_manager', 'company_manager'];
    if (!userData.role || !validRoles.includes(userData.role)) {
      errors.push('الدور غير صالح');
    }

    // Password validation for new users
    if (!isUpdate) {
      if (!userData.password || typeof userData.password !== 'string' || userData.password.length < 8) {
        errors.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      }
    }

    // Warehouse validation for warehouse managers
    if (userData.role === 'warehouse_manager') {
      if (!Array.isArray(userData.allowed_warehouses) || userData.allowed_warehouses.length === 0) {
        errors.push('يجب اختيار مخزن واحد على الأقل لمدير المخازن');
      }
    }

    // Permissions validation (optional, but recommended)
    if (userData.permissions && !Array.isArray(userData.permissions)) {
      errors.push('صلاحيات المستخدم يجب أن تكون مصفوفة');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Format user data for display with null checks
   * @param {Object} user - User object
   * @returns {Object} - Formatted user
   */
  formatUserForDisplay(user) {
    if (!user || typeof user !== 'object') {
      return {
        id: 'غير معروف',
        name: 'غير معروف',
        email: '',
        phone: '-',
        role: 'user',
        role_name: 'غير معروف',
        is_active: false,
        status: 'غير نشط',
        status_color: 'red',
        allowed_warehouses: [],
        permissions: [],
        created_at: '-',
        updated_at: '-',
        last_login: 'لم يسجل دخول'
      };
    }

    return {
      id: user.id || 'غير معروف',
      name: user.name || 'غير معروف',
      email: user.email || '',
      phone: user.phone || '-',
      role: user.role || 'user',
      role_name: this.getRoleName(user.role),
      is_active: user.is_active !== false,
      status: user.is_active !== false ? 'نشط' : 'غير نشط',
      status_color: user.is_active !== false ? 'green' : 'red',
      allowed_warehouses: Array.isArray(user.allowed_warehouses) ? user.allowed_warehouses : [],
      permissions: Array.isArray(user.permissions) ? user.permissions : [],
      created_at: user.created_at ? new Date(user.created_at).toLocaleDateString('ar-EG') : '-',
      updated_at: user.updated_at ? new Date(user.updated_at).toLocaleDateString('ar-EG') : '-',
      last_login: user.last_login ? new Date(user.last_login).toLocaleDateString('ar-EG') : 'لم يسجل دخول'
    };
  }

  /**
   * Get role name in Arabic with null checks
   * @param {string} role - Role key
   * @returns {string} - Role name in Arabic
   */
  getRoleName(role) {
    if (!role || typeof role !== 'string') return 'غير معروف';
    
    const roles = {
      superadmin: 'المشرف العام',
      warehouse_manager: 'مدير المخازن',
      company_manager: 'مدير الشركة'
    };
    return roles[role] || role;
  }

  /**
   * Get role permissions description with null checks
   * @param {string} role - Role key
   * @returns {Array} - Permissions list
   */
  getRolePermissions(role) {
    if (!role || typeof role !== 'string') return [];
    
    const permissions = {
      superadmin: [
        'الوصول الكامل إلى جميع المخازن',
        'إدارة المستخدمين والأدوار',
        'إنشاء وتعديل وحذف الأصناف',
        'إدارة الحركات والنقل',
        'تصدير التقارير والبيانات',
        'إعدادات النظام'
      ],
      warehouse_manager: [
        'الوصول إلى المخازن المحددة فقط',
        'إنشاء وتعديل الأصناف في المخازن المسموحة',
        'إدارة الحركات والنقل بين المخازن المسموحة',
        'عرض التقارير للمخازن المسموحة',
        'تصدير بيانات المخازن المسموحة'
      ],
      company_manager: [
        'عرض جميع البيانات للقراءة فقط',
        'تصفية البيانات والتقارير',
        'تصدير التقارير والبيانات',
        'لا يمكن التعديل أو الحذف'
      ]
    };
    return permissions[role] || [];
  }

  /**
   * Clean user data before saving to Firestore
   * @param {Object} userData - Raw user data
   * @returns {Object} - Cleaned user data
   */
  cleanUserData(userData) {
    if (!userData || typeof userData !== 'object') {
      return {
        name: '',
        email: '',
        role: 'company_manager',
        is_active: true,
        allowed_warehouses: [],
        permissions: []
      };
    }

    return {
      name: userData.name ? userData.name.trim() : '',
      email: userData.email ? userData.email.trim().toLowerCase() : '',
      phone: userData.phone ? userData.phone.trim() : null,
      role: userData.role || 'company_manager',
      is_active: userData.is_active !== false,
      allowed_warehouses: Array.isArray(userData.allowed_warehouses) ? userData.allowed_warehouses : [],
      permissions: Array.isArray(userData.permissions) ? userData.permissions : []
    };
  }

  /**
   * Get default permissions for a role
   * @param {string} role - User role
   * @returns {Array} - Default permissions
   */
  getDefaultPermissionsForRole(role) {
    const defaultPermissions = {
      superadmin: ['all'],
      warehouse_manager: [
        'manage_inventory',
        'create_transfers',
        'dispatch_items',
        'update_items',
        'view_reports',
        'export_data'
      ],
      company_manager: ['view_reports', 'export_data', 'view_inventory']
    };
    
    return defaultPermissions[role] || ['view_reports'];
  }

  /**
   * Check if user has specific permission
   * @param {Object} user - User object
   * @param {string} permission - Permission to check
   * @returns {boolean} - Whether user has permission
   */
  hasPermission(user, permission) {
    if (!user || !permission) return false;
    
    const userPermissions = Array.isArray(user.permissions) ? user.permissions : [];
    
    // Superadmins have all permissions
    if (user.role === 'superadmin') return true;
    
    // Check for specific permission or 'all' or 'full_access'
    return userPermissions.includes(permission) || 
           userPermissions.includes('all') || 
           userPermissions.includes('full_access');
  }
}

// Create singleton instance
const userServiceInstance = new UserService();

// Export as default
export default userServiceInstance;
