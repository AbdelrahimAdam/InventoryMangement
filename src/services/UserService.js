// src/services/UserService.js - FULLY COMPATIBLE VERSION
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
  sendEmailVerification,
  deleteUser as deleteFirebaseUser
} from 'firebase/auth';
import { auth, db } from '@/firebase/config';

class UserService {
  constructor() {
    this.usersCollection = 'users';
    this.logsCollection = 'user_logs';
    this.profilesCollection = 'user_profiles';
  }

  /**
   * Check if current user is superadmin (PER FIREBASE RULES)
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
      // Check if current user can view this user (per Firebase rules)
      if (!auth.currentUser) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

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
      
      // Check if current user can view this user (self or superadmin)
      const currentUserId = auth.currentUser.uid;
      if (currentUserId !== userId && userData.role !== 'superadmin') {
        throw new Error('ليس لديك صلاحية لعرض هذا المستخدم');
      }

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
   * Create new user - COMPATIBLE WITH FIRESTORE RULES
   * @param {Object} userData - User data from modal
   * @returns {Promise<Object>} - Created user
   */
  async createUser(userData) {
    try {
      console.log('UserService.createUser called with:', userData);
      
      // Check if current user is superadmin (per Firebase rules)
      await this._checkSuperAdminPermission();

      // Validate user data according to Firebase rules
      const validation = this.validateUserDataForFirestore(userData, false);
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

      // Prepare user document according to Firebase rules structure
      const userDoc = {
        name: userData.name ? userData.name.trim() : '',
        email: userData.email ? userData.email.trim().toLowerCase() : '',
        phone: userData.phone || null,
        phoneCountryCode: userData.phoneCountryCode || '+966',
        role: userData.role || 'company_manager',
        is_active: userData.isActive !== false,
        two_factor_enabled: userData.twoFactorEnabled || false,
        notes: userData.notes || '',
        
        // CRITICAL: Convert warehouse data to Firestore-compatible format
        allowed_warehouses: this._formatWarehousesForFirestore(
          userData.allWarehouses,
          userData.allowedWarehouses
        ),
        
        // CRITICAL: Send permissions as array (Firestore rules expect array)
        permissions: Array.isArray(userData.permissions) ? userData.permissions : [],
        
        // Metadata fields
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        created_by: auth.currentUser.uid,
        email_verified: false,
        last_login: null,
        profile_complete: true
      };

      console.log('Creating user document (Firestore compatible):', userDoc);

      // Set user display name in Firebase Auth
      await updateFirebaseProfile(firebaseUser, {
        displayName: userDoc.name
      });

      // Send email verification if requested
      if (userData.sendWelcomeEmail !== false) {
        try {
          await sendEmailVerification(firebaseUser);
        } catch (emailError) {
          console.warn('Could not send verification email:', emailError);
        }
      }

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
        role: userDoc.role
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
   * Update existing user - COMPATIBLE WITH FIRESTORE RULES
   * @param {string} userId - User ID
   * @param {Object} userData - User data from modal
   * @returns {Promise<Object>} - Updated user
   */
  async updateUser(userId, userData) {
    try {
      console.log('UserService.updateUser called for:', userId, 'with data:', userData);
      
      // Check permissions per Firebase rules
      if (!auth.currentUser) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      // Get current user data
      const currentUserDoc = await getDoc(doc(db, this.usersCollection, userId));
      if (!currentUserDoc.exists()) {
        return {
          success: false,
          error: 'المستخدم غير موجود',
          data: null
        };
      }

      const currentUserData = currentUserDoc.data();
      
      // Check if current user can update this user (self or superadmin per Firebase rules)
      const currentUserId = auth.currentUser.uid;
      if (currentUserId !== userId) {
        // Not self-update, need superadmin permission
        await this._checkSuperAdminPermission();
      }

      // Validate user data for update
      const validation = this.validateUserDataForFirestore(userData, true);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors[0],
          data: null
        };
      }

      // Prepare update data according to Firebase rules
      const updateData = {
        name: userData.name ? userData.name.trim() : currentUserData.name,
        phone: userData.phone || currentUserData.phone || null,
        phoneCountryCode: userData.phoneCountryCode || currentUserData.phoneCountryCode || '+966',
        role: userData.role || currentUserData.role,
        is_active: userData.isActive !== undefined ? userData.isActive : currentUserData.is_active,
        two_factor_enabled: userData.twoFactorEnabled !== undefined ? userData.twoFactorEnabled : currentUserData.two_factor_enabled,
        notes: userData.notes !== undefined ? userData.notes : currentUserData.notes || '',
        
        // CRITICAL: Convert warehouse data if provided
        ...(userData.allWarehouses !== undefined || userData.allowedWarehouses !== undefined ? {
          allowed_warehouses: this._formatWarehousesForFirestore(
            userData.allWarehouses,
            userData.allowedWarehouses,
            currentUserData.allowed_warehouses
          )
        } : {}),
        
        // CRITICAL: Update permissions if provided
        ...(userData.permissions !== undefined ? {
          permissions: Array.isArray(userData.permissions) ? userData.permissions : currentUserData.permissions || []
        } : {}),
        
        // Metadata
        updated_at: serverTimestamp(),
        updated_by: currentUserId
      };

      console.log('Updating user with data (Firestore compatible):', updateData);

      // Update display name in Firebase Auth if needed
      if (userData.name && userData.name !== currentUserData.name) {
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
        is_active: updateData.is_active
      });

      // Get updated user data
      const updatedUser = {
        id: userId,
        ...currentUserData,
        ...updateData,
        created_at: this._formatTimestamp(currentUserData.created_at),
        updated_at: new Date().toISOString()
      };

      return {
        success: true,
        data: updatedUser,
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
   * Delete user - COMPATIBLE WITH FIRESTORE RULES
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Result
   */
  async deleteUser(userId) {
    try {
      // Only superadmin can delete users per Firebase rules
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

      const userData = userSnap.data();

      // Don't allow self-deletion
      if (auth.currentUser?.uid === userId) {
        return {
          success: false,
          error: 'لا يمكن حذف حسابك الشخصي'
        };
      }

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
      // Only superadmin can update user status
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
   * Format warehouses for Firestore (CRITICAL FIX)
   * Converts component data to Firestore-compatible format
   * @private
   */
  _formatWarehousesForFirestore(allWarehouses, allowedWarehouses, currentWarehouses = null) {
    // If allWarehouses is true, return { all: true }
    if (allWarehouses === true) {
      return { all: true };
    }
    
    // If we have allowedWarehouses array from component
    if (Array.isArray(allowedWarehouses) && allowedWarehouses.length > 0) {
      // Convert array to object format: { warehouseId: true }
      const warehouseObject = {};
      allowedWarehouses.forEach(id => {
        warehouseObject[id] = true;
      });
      return warehouseObject;
    }
    
    // If updating and no new warehouse data provided, return current
    if (currentWarehouses) {
      return currentWarehouses;
    }
    
    // Default: empty object
    return {};
  }

  /**
   * Parse warehouses from Firestore to component format
   * Converts Firestore format to component arrays
   * @private
   */
  _parseWarehousesFromFirestore(warehousesData) {
    if (!warehousesData) {
      return { allWarehouses: false, allowedWarehouses: [] };
    }
    
    // If it's an object with 'all: true'
    if (warehousesData.all === true) {
      return { allWarehouses: true, allowedWarehouses: [] };
    }
    
    // If it's an object with warehouse IDs as keys
    if (typeof warehousesData === 'object' && !Array.isArray(warehousesData)) {
      const allowedWarehouses = Object.keys(warehousesData)
        .filter(key => warehousesData[key] === true && key !== 'all');
      return { allWarehouses: false, allowedWarehouses };
    }
    
    // If it's an array (legacy format)
    if (Array.isArray(warehousesData)) {
      const hasAll = warehousesData.includes('all');
      const allowedWarehouses = warehousesData.filter(id => id !== 'all');
      return { allWarehouses: hasAll, allowedWarehouses };
    }
    
    return { allWarehouses: false, allowedWarehouses: [] };
  }

  /**
   * Validate user data according to Firebase rules
   * @private
   */
  validateUserDataForFirestore(userData, isUpdate = false) {
    const errors = [];

    if (!userData || typeof userData !== 'object') {
      return {
        isValid: false,
        errors: ['بيانات المستخدم غير صالحة']
      };
    }

    // Name validation (per Firebase rules: minimum 2 chars)
    if (!isUpdate || userData.name !== undefined) {
      const name = userData.name || '';
      if (typeof name !== 'string' || name.trim().length < 2) {
        errors.push('الاسم يجب أن يكون على الأقل حرفين');
      }
    }

    // Email validation (per Firebase rules)
    if (!isUpdate) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!userData.email || typeof userData.email !== 'string' || !emailRegex.test(userData.email.trim())) {
        errors.push('البريد الإلكتروني غير صالح');
      }
    }

    // Role validation (per Firebase rules)
    const validRoles = ['superadmin', 'warehouse_manager', 'company_manager', 'user'];
    if (userData.role && !validRoles.includes(userData.role)) {
      errors.push('الدور غير صالح');
    }

    // Password validation for new users
    if (!isUpdate && !userData.password) {
      errors.push('كلمة المرور مطلوبة');
    }

    // Phone validation (optional)
    if (userData.phone && typeof userData.phone === 'string') {
      const phoneDigits = userData.phone.replace(/\D/g, '');
      if (phoneDigits && (phoneDigits.length < 9 || phoneDigits.length > 15)) {
        errors.push('رقم الهاتف يجب أن يكون بين 9 و 15 رقماً');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if user matches search criteria
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
   * Calculate search score for relevance sorting
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
      'unavailable': 'الخدمة غير متاحة حالياً',
      'failed-precondition': 'الشرط المسبق غير متحقق',
      'resource-exhausted': 'تم تجاوز الحد المسموح'
    };

    if (error.code && errorMessages[error.code]) {
      return errorMessages[error.code];
    }

    return error.message || 'حدث خطأ غير متوقع';
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
      company_manager: [
        'view_items',
        'view_transactions',
        'view_reports',
        'view_dashboard',
        'view_analytics',
        'export_reports'
      ],
      user: [
        'view_items',
        'view_transactions',
        'view_dashboard'
      ]
    };

    return defaultPermissions[role] || ['view_items', 'view_dashboard'];
  }

  /**
   * Get role name in Arabic
   * @param {string} role - Role key
   * @returns {string} - Role name in Arabic
   */
  getRoleName(role) {
    if (!role || typeof role !== 'string') return 'غير معروف';

    const roles = {
      superadmin: 'المشرف العام',
      warehouse_manager: 'مدير المخازن',
      company_manager: 'مدير الشركة',
      user: 'مستخدم عادي'
    };
    return roles[role] || role;
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

  /**
   * Check if user has access to warehouse
   * @param {Object} user - User object
   * @param {string} warehouseId - Warehouse ID
   * @returns {boolean} - Whether user has access
   */
  hasWarehouseAccess(user, warehouseId) {
    if (!user || !warehouseId) return false;

    // Superadmins have access to all warehouses
    if (user.role === 'superadmin') return true;

    // Check if user has access to this warehouse
    const warehouses = user.allowed_warehouses;
    
    if (!warehouses) return false;
    
    // If it's an object with 'all: true'
    if (warehouses.all === true) return true;
    
    // If it's an object with warehouse IDs as keys
    if (typeof warehouses === 'object' && !Array.isArray(warehouses)) {
      return warehouses[warehouseId] === true;
    }
    
    // If it's an array
    if (Array.isArray(warehouses)) {
      return warehouses.includes('all') || warehouses.includes(warehouseId);
    }
    
    return false;
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
}

// Create singleton instance
const userServiceInstance = new UserService();

// Export as default
export default userServiceInstance;