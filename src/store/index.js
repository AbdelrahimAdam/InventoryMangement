import { createStore } from 'vuex';
import { auth, db } from '@/firebase/config';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  orderBy,
  writeBatch,
  limit
} from 'firebase/firestore';
import {
  InventoryService,
  WAREHOUSE_LABELS,
  DESTINATION_LABELS,
  FIELD_LABELS,
  TRANSACTION_TYPES
} from '@/services/inventoryService';

// Import UserService - handles ALL user creation
import UserService from '@/services/UserService';

// Field name mapping
const FIELD_MAPPINGS = {
  arabicToEnglish: {
    'الاسم': 'name',
    'الكود': 'code',
    'اللون': 'color',
    'المخزن_id': 'warehouse_id',
    'المخزن': 'warehouse_id',
    'عدد_الكراتين': 'cartons_count',
    'عدد_في_الكرتونه': 'per_carton_count',
    'عدد_القزاز_الفردي': 'single_bottles_count',
    'الكميه_المضافه': 'total_added',
    'الكميه_المتبقيه': 'remaining_quantity',
    'المورد': 'supplier',
    'مكان_الصنف': 'item_location'
  },
  englishToArabic: FIELD_LABELS
};

export default createStore({
  state: {
    user: null,
    userProfile: null,
    loading: false,
    warehouses: [],
    warehousesLoaded: false,
    inventory: [],
    transactions: [],
    itemHistory: [],
    filters: {
      warehouse: '',
      search: ''
    },
    authError: null,
    operationLoading: false,
    operationError: null,
    fieldMappings: FIELD_MAPPINGS,
    notifications: [],
    unsubscribeInventory: null,
    unsubscribeTransactions: null,
    unsubscribeWarehouses: null,
    recentTransactions: [],
    recentTransactionsLoading: false,
    requiresCompositeIndex: false,
    allUsers: [],
    usersLoading: false
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_USER_PROFILE(state, profile) {
      state.userProfile = profile;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_OPERATION_LOADING(state, loading) {
      state.operationLoading = loading;
    },
    SET_OPERATION_ERROR(state, error) {
      state.operationError = error;
    },
    SET_WAREHOUSES(state, warehouses) {
      state.warehouses = warehouses;
    },
    SET_WAREHOUSES_LOADED(state, loaded) {
      state.warehousesLoaded = loaded;
    },
    SET_INVENTORY(state, inventory) {
      state.inventory = inventory;
    },
    SET_TRANSACTIONS(state, transactions) {
      state.transactions = transactions;
    },
    SET_ITEM_HISTORY(state, history) {
      state.itemHistory = history;
    },
    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters };
    },
    ADD_ITEM(state, item) {
      state.inventory.push(item);
    },
    UPDATE_ITEM(state, updatedItem) {
      const index = state.inventory.findIndex(item => item.id === updatedItem.id);
      if (index !== -1) {
        state.inventory.splice(index, 1, updatedItem);
      }
    },
    REMOVE_ITEM(state, itemId) {
      state.inventory = state.inventory.filter(item => item.id !== itemId);
    },
    UPDATE_WAREHOUSE(state, updatedWarehouse) {
      const index = state.warehouses.findIndex(w => w.id === updatedWarehouse.id);
      if (index !== -1) {
        state.warehouses.splice(index, 1, updatedWarehouse);
      } else {
        state.warehouses.push(updatedWarehouse);
      }
    },
    REMOVE_WAREHOUSE(state, warehouseId) {
      state.warehouses = state.warehouses.filter(w => w.id !== warehouseId);
    },
    SET_AUTH_ERROR(state, error) {
      state.authError = error;
    },
    CLEAR_OPERATION_ERROR(state) {
      state.operationError = null;
    },
    ADD_NOTIFICATION(state, notification) {
      notification.id = Date.now().toString();
      notification.timestamp = new Date();
      state.notifications.push(notification);

      setTimeout(() => {
        const index = state.notifications.findIndex(n => n.id === notification.id);
        if (index !== -1) {
          state.notifications.splice(index, 1);
        }
      }, 5000);
    },
    REMOVE_NOTIFICATION(state, notificationId) {
      state.notifications = state.notifications.filter(n => n.id !== notificationId);
    },
    CLEAR_NOTIFICATIONS(state) {
      state.notifications = [];
    },
    SET_UNSUBSCRIBE_INVENTORY(state, unsubscribe) {
      if (state.unsubscribeInventory) {
        state.unsubscribeInventory();
      }
      state.unsubscribeInventory = unsubscribe;
    },
    SET_UNSUBSCRIBE_TRANSACTIONS(state, unsubscribe) {
      if (state.unsubscribeTransactions) {
        state.unsubscribeTransactions();
      }
      state.unsubscribeTransactions = unsubscribe;
    },
    SET_UNSUBSCRIBE_WAREHOUSES(state, unsubscribe) {
      if (state.unsubscribeWarehouses) {
        state.unsubscribeWarehouses();
      }
      state.unsubscribeWarehouses = unsubscribe;
    },
    CLEAR_UNSUBSCRIBERS(state) {
      if (state.unsubscribeInventory) {
        state.unsubscribeInventory();
        state.unsubscribeInventory = null;
      }
      if (state.unsubscribeTransactions) {
        state.unsubscribeTransactions();
        state.unsubscribeTransactions = null;
      }
      if (state.unsubscribeWarehouses) {
        state.unsubscribeWarehouses();
        state.unsubscribeWarehouses = null;
      }
    },
    SET_RECENT_TRANSACTIONS(state, transactions) {
      state.recentTransactions = transactions;
    },
    SET_RECENT_TRANSACTIONS_LOADING(state, loading) {
      state.recentTransactionsLoading = loading;
    },
    ADD_RECENT_TRANSACTION(state, transaction) {
      state.recentTransactions.unshift(transaction);
      if (state.recentTransactions.length > 50) {
        state.recentTransactions = state.recentTransactions.slice(0, 50);
      }
    },
    SET_REQUIRES_COMPOSITE_INDEX(state, value) {
      state.requiresCompositeIndex = value;
    },
    SET_ALL_USERS(state, users) {
      state.allUsers = users;
    },
    SET_USERS_LOADING(state, loading) {
      state.usersLoading = loading;
    }
  },
  actions: {
    showNotification({ commit, getters }, notification) {
      if (!notification || !notification.message) {
        console.warn('Invalid notification:', notification);
        return;
      }

      const defaultNotification = {
        type: 'info',
        title: '',
        message: '',
        duration: 5000
      };

      const finalNotification = { ...defaultNotification, ...notification };

      commit('ADD_NOTIFICATION', finalNotification);

      if (finalNotification.type === 'error') {
        console.error('Notification Error:', finalNotification.message);
      }
    },

    async initializeAuth({ commit, dispatch }) {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            commit('SET_USER', user);
            try {
              // Load user profile - NO MORE createUserProfile calls
              await dispatch('loadUserProfile', user);
            } catch (error) {
              console.error('Error in auth initialization:', error);
              commit('SET_AUTH_ERROR', 'فشل في تحميل بيانات المستخدم');
            }
          } else {
            commit('SET_USER', null);
            commit('SET_USER_PROFILE', null);
            commit('SET_INVENTORY', []);
            commit('SET_TRANSACTIONS', []);
            commit('SET_ITEM_HISTORY', []);
            commit('SET_RECENT_TRANSACTIONS', []);
            commit('SET_WAREHOUSES_LOADED', false);
            commit('SET_REQUIRES_COMPOSITE_INDEX', false);
            commit('CLEAR_UNSUBSCRIBERS');
          }
          resolve();
        });
      });
    },

    async loadUserProfile({ commit, dispatch }, user) {
      try {
        console.log('Loading user profile for:', user.email);

        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (!userDoc.exists()) {
          console.error('User profile not found in Firestore:', user.email);

          // THIS SHOULD NOT HAPPEN - All users should be created via UserService
          // Create a minimal pending profile and notify admin
          const tempProfile = {
            email: user.email,
            name: user.email.split('@')[0],
            role: 'pending',
            allowed_warehouses: [],
            permissions: ['view_reports'],
            is_active: false,
            profile_complete: false,
            needs_approval: true,
            created_at: new Date()
          };

          await setDoc(doc(db, 'users', user.uid), tempProfile);
          commit('SET_USER_PROFILE', tempProfile);

          dispatch('showNotification', {
            type: 'warning',
            message: 'حسابك قيد المراجعة. يرجى الانتظار حتى يتم تفعيله من قبل المشرف.'
          });

          // Notify admin
          await dispatch('notifyAdminAboutPendingUser', {
            userId: user.uid,
            userEmail: user.email
          });

          return;
        }

        const userProfile = userDoc.data();
        console.log('Loaded user profile:', userProfile);

        // Check if user is active
        if (userProfile.is_active === false) {
          dispatch('showNotification', {
            type: 'error',
            message: 'حسابك غير نشط. يرجى التواصل مع المشرف.'
          });
          await dispatch('logout');
          return;
        }

        commit('SET_USER_PROFILE', userProfile);
        console.log('User profile loaded with role:', userProfile.role, 'permissions:', userProfile.permissions);

        // Show welcome notification
        dispatch('showNotification', {
          type: 'success',
          message: `مرحباً ${userProfile.name}! تم تسجيل الدخول بنجاح.`
        });

        // Load warehouses and start subscriptions
        await dispatch('loadWarehouses');
        dispatch('subscribeToInventory');
        dispatch('subscribeToTransactions');
        dispatch('getRecentTransactions');

      } catch (error) {
        console.error('Error loading user profile:', error);
        dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تحميل بيانات المستخدم'
        });
        await dispatch('logout');
      }
    },

    async notifyAdminAboutPendingUser({ dispatch }, { userId, userEmail }) {
      try {
        const notificationRef = doc(collection(db, 'admin_notifications'));
        await setDoc(notificationRef, {
          type: 'new_user_pending',
          user_id: userId,
          user_email: userEmail,
          timestamp: new Date(),
          message: 'مستخدم جديد يحتاج إلى التفعيل',
          read: false
        });

        console.log('Admin notified about pending user:', userEmail);
      } catch (error) {
        console.error('Error notifying admin:', error);
      }
    },

    async login({ commit, dispatch }, { email, password }) {
      commit('SET_LOADING', true);
      commit('SET_AUTH_ERROR', null);

      try {
        console.log('Attempting login with:', email);

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log('Login successful, user:', user.uid);

        // Load user profile - NO MORE createUserProfile calls
        await dispatch('loadUserProfile', user);
        commit('SET_USER', user);

        return user;

      } catch (error) {
        console.error('Login error details:', error);

        const errorMessage = getAuthErrorMessage(error.code);
        commit('SET_AUTH_ERROR', errorMessage);

        dispatch('showNotification', {
          type: 'error',
          message: errorMessage
        });

        throw new Error(errorMessage);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async logout({ commit, dispatch }) {
      try {
        await signOut(auth);
        commit('SET_USER', null);
        commit('SET_USER_PROFILE', null);
        commit('SET_INVENTORY', []);
        commit('SET_TRANSACTIONS', []);
        commit('SET_ITEM_HISTORY', []);
        commit('SET_RECENT_TRANSACTIONS', []);
        commit('SET_AUTH_ERROR', null);
        commit('SET_OPERATION_ERROR', null);
        commit('SET_WAREHOUSES_LOADED', false);
        commit('SET_REQUIRES_COMPOSITE_INDEX', false);
        commit('CLEAR_UNSUBSCRIBERS');

        dispatch('showNotification', {
          type: 'info',
          message: 'تم تسجيل الخروج بنجاح'
        });

      } catch (error) {
        console.error('Logout error:', error);
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تسجيل الخروج'
        });
        throw error;
      }
    },

    // =============================================
    // WAREHOUSE MANAGEMENT ACTIONS
    // =============================================

    async createWarehouse({ commit, dispatch, state }, warehouseData) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (state.userProfile?.role !== 'superadmin') {
          throw new Error('ليس لديك صلاحية لإضافة مخازن');
        }

        // Validate required fields
        if (!warehouseData.name_ar?.trim()) {
          throw new Error('اسم المخزن (عربي) مطلوب');
        }

        if (!warehouseData.type) {
          throw new Error('نوع المخزن مطلوب');
        }

        // Prepare warehouse data
        const newWarehouse = {
          name_ar: warehouseData.name_ar.trim(),
          name_en: warehouseData.name_en?.trim() || '',
          type: warehouseData.type,
          status: warehouseData.status || 'active',
          capacity: warehouseData.capacity ? parseInt(warehouseData.capacity) : null,
          location: warehouseData.location?.trim() || '',
          description: warehouseData.description?.trim() || '',
          is_main: warehouseData.is_main || false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // If this is a main warehouse, ensure no other main warehouse exists
        if (newWarehouse.is_main) {
          const existingMainWarehouse = state.warehouses.find(w => w.is_main);
          if (existingMainWarehouse && existingMainWarehouse.id !== warehouseData.id) {
            throw new Error('يوجد بالفعل مخزن رئيسي في النظام');
          }
        }

        // Add to Firestore
        const warehouseRef = await addDoc(collection(db, 'warehouses'), newWarehouse);

        dispatch('showNotification', {
          type: 'success',
          message: `تم إضافة المخزن "${newWarehouse.name_ar}" بنجاح`
        });

        return { success: true, id: warehouseRef.id, data: newWarehouse };

      } catch (error) {
        console.error('Error creating warehouse:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في إضافة المخزن'
        });

        return { success: false, error: error.message };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async updateWarehouse({ commit, dispatch, state }, { warehouseId, warehouseData }) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (state.userProfile?.role !== 'superadmin') {
          throw new Error('ليس لديك صلاحية لتعديل المخازن');
        }

        // Validate warehouse exists
        const warehouseRef = doc(db, 'warehouses', warehouseId);
        const warehouseDoc = await getDoc(warehouseRef);

        if (!warehouseDoc.exists()) {
          throw new Error('المخزن غير موجود');
        }

        const existingWarehouse = warehouseDoc.data();

        // Validate required fields
        if (!warehouseData.name_ar?.trim()) {
          throw new Error('اسم المخزن (عربي) مطلوب');
        }

        // Prepare update data
        const updateData = {
          name_ar: warehouseData.name_ar.trim(),
          name_en: warehouseData.name_en?.trim() || existingWarehouse.name_en,
          type: warehouseData.type || existingWarehouse.type,
          status: warehouseData.status || existingWarehouse.status,
          capacity: warehouseData.capacity ? parseInt(warehouseData.capacity) : existingWarehouse.capacity,
          location: warehouseData.location?.trim() || existingWarehouse.location,
          description: warehouseData.description?.trim() || existingWarehouse.description,
          is_main: warehouseData.is_main !== undefined ? warehouseData.is_main : existingWarehouse.is_main,
          updated_at: new Date().toISOString()
        };

        // If setting as main warehouse, ensure no other main warehouse exists
        if (updateData.is_main && !existingWarehouse.is_main) {
          const existingMainWarehouse = state.warehouses.find(w => w.is_main && w.id !== warehouseId);
          if (existingMainWarehouse) {
            throw new Error('يوجد بالفعل مخزن رئيسي في النظام');
          }
        }

        // Update in Firestore
        await updateDoc(warehouseRef, updateData);

        // If this was the main warehouse and we're changing it, update the old main warehouse
        if (existingWarehouse.is_main && !updateData.is_main) {
          const newMainWarehouse = state.warehouses.find(w => w.is_main && w.id !== warehouseId);
          if (!newMainWarehouse) {
            throw new Error('يجب أن يكون هناك مخزن رئيسي واحد على الأقل في النظام');
          }
        }

        dispatch('showNotification', {
          type: 'success',
          message: `تم تحديث المخزن "${updateData.name_ar}" بنجاح`
        });

        return { success: true, data: updateData };

      } catch (error) {
        console.error('Error updating warehouse:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في تحديث المخزن'
        });

        return { success: false, error: error.message };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async deleteWarehouse({ commit, dispatch, state }, warehouseId) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (state.userProfile?.role !== 'superadmin') {
          throw new Error('ليس لديك صلاحية لحذف المخازن');
        }

        // Check if warehouse exists
        const warehouseRef = doc(db, 'warehouses', warehouseId);
        const warehouseDoc = await getDoc(warehouseRef);

        if (!warehouseDoc.exists()) {
          throw new Error('المخزن غير موجود');
        }

        const warehouseData = warehouseDoc.data();

        // Prevent deletion of main warehouse
        if (warehouseData.is_main) {
          throw new Error('لا يمكن حذف المخزن الرئيسي');
        }

        // Check if warehouse has items
        const itemsQuery = query(
          collection(db, 'items'),
          where('warehouse_id', '==', warehouseId),
          limit(1)
        );

        const itemsSnapshot = await getDocs(itemsQuery);
        if (!itemsSnapshot.empty) {
          throw new Error('لا يمكن حذف المخزن لأنه يحتوي على أصناف. يرجى نقل أو حذف الأصناف أولاً.');
        }

        // Check if warehouse has transactions as source
        const fromTransactionsQuery = query(
          collection(db, 'transactions'),
          where('from_warehouse', '==', warehouseId),
          limit(1)
        );

        const fromTransactionsSnapshot = await getDocs(fromTransactionsQuery);
        if (!fromTransactionsSnapshot.empty) {
          throw new Error('لا يمكن حذف المخزن لأنه مرتبط بحركات سابقة كمصدر.');
        }

        // Check if warehouse has transactions as destination
        const toTransactionsQuery = query(
          collection(db, 'transactions'),
          where('to_warehouse', '==', warehouseId),
          limit(1)
        );

        const toTransactionsSnapshot = await getDocs(toTransactionsQuery);
        if (!toTransactionsSnapshot.empty) {
          throw new Error('لا يمكن حذف المخزن لأنه مرتبط بحركات سابقة كوجهة.');
        }

        // If all checks pass, delete the warehouse
        await deleteDoc(warehouseRef);

        dispatch('showNotification', {
          type: 'success',
          message: `تم حذف المخزن "${warehouseData.name_ar}" بنجاح`
        });

        return { 
          success: true, 
          message: 'تم حذف المخزن بنجاح' 
        };

      } catch (error) {
        console.error('Error deleting warehouse:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في حذف المخزن'
        });

        return { 
          success: false, 
          error: error.message || 'حدث خطأ في حذف المخزن' 
        };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    // =============================================
    // ITEM MANAGEMENT ACTIONS
    // =============================================

    async updateItem({ commit, dispatch, state }, { itemId, itemData }) {
  commit('SET_OPERATION_LOADING', true);
  commit('CLEAR_OPERATION_ERROR');

  try {
    if (!state.userProfile) {
      throw new Error('يجب تسجيل الدخول أولاً');
    }

    if (!['superadmin', 'warehouse_manager'].includes(state.userProfile.role)) {
      throw new Error('ليس لديك صلاحية لتعديل الأصناف');
    }

    if (!state.user?.uid) {
      throw new Error('معرف المستخدم غير متوفر');
    }

    // Check if item exists
    const itemRef = doc(db, 'items', itemId);
    const itemDoc = await getDoc(itemRef);

    if (!itemDoc.exists()) {
      throw new Error('الصنف غير موجود');
    }

    const existingItem = itemDoc.data();

    // Check permissions for warehouse managers
    if (state.userProfile.role === 'warehouse_manager') {
      const allowedWarehouses = state.userProfile.allowed_warehouses || [];
      const warehouseId = itemData.warehouse_id || existingItem.warehouse_id;
      if (allowedWarehouses.length > 0 && !allowedWarehouses.includes(warehouseId)) {
        throw new Error('ليس لديك صلاحية لتعديل أصناف في هذا المخزن');
      }
    }

    // Use existing values for fields not provided in update
    const name = itemData.name?.trim() || existingItem.name;
    const code = itemData.code?.trim() || existingItem.code;
    const color = itemData.color?.trim() || existingItem.color;
    const warehouse_id = itemData.warehouse_id || existingItem.warehouse_id;

    // Validate required fields
    if (!name || !code || !color || !warehouse_id) {
      throw new Error('جميع الحقول المطلوبة يجب أن تكون مملوءة (الاسم، الكود، اللون، المخزن)');
    }

    // Calculate new quantities - use provided values or existing ones
    const newCartonsCount = Number(itemData.cartons_count) || existingItem.cartons_count || 0;
    const newPerCartonCount = Number(itemData.per_carton_count) || existingItem.per_carton_count || 12;
    const newSingleBottlesCount = Number(itemData.single_bottles_count) || existingItem.single_bottles_count || 0;
    const newTotalQuantity = InventoryService.calculateTotalQuantity(
      newCartonsCount,
      newPerCartonCount,
      newSingleBottlesCount
    );

    if (newTotalQuantity < 0) {
      throw new Error('يجب أن تكون الكمية أكبر من أو تساوي صفر');
    }

    // Prepare update data - merge existing with new data
    const updateData = {
      name: name,
      code: code,
      color: color,
      warehouse_id: warehouse_id,
      cartons_count: newCartonsCount,
      per_carton_count: newPerCartonCount,
      single_bottles_count: newSingleBottlesCount,
      remaining_quantity: newTotalQuantity,
      total_added: itemData.total_added || existingItem.total_added,
      supplier: itemData.supplier?.trim() || existingItem.supplier || '',
      item_location: itemData.item_location?.trim() || existingItem.item_location || '',
      notes: itemData.notes?.trim() || existingItem.notes || '',
      photo_url: itemData.photo_url || existingItem.photo_url || '',
      updated_at: new Date().toISOString(),
      updated_by: state.user.uid
    };

    // Calculate quantity difference for transaction log
    const quantityDiff = newTotalQuantity - (existingItem.remaining_quantity || 0);

    // Update item in Firestore
    await updateDoc(itemRef, updateData);

    // Create transaction log if quantity changed or warehouse changed
    if (quantityDiff !== 0 || existingItem.warehouse_id !== warehouse_id) {
      const transactionData = {
        type: 'UPDATE',
        item_id: itemId,
        item_name: updateData.name,
        item_code: updateData.code,
        from_warehouse: existingItem.warehouse_id !== warehouse_id ? existingItem.warehouse_id : null,
        to_warehouse: warehouse_id,
        cartons_delta: newCartonsCount - (existingItem.cartons_count || 0),
        per_carton_updated: newPerCartonCount,
        single_delta: newSingleBottlesCount - (existingItem.single_bottles_count || 0),
        total_delta: quantityDiff,
        new_remaining: newTotalQuantity,
        user_id: state.user.uid,
        timestamp: new Date(),
        notes: `تعديل الصنف: ${itemData.notes || ''}`.trim(),
        photo_changed: !!itemData.photo_url && itemData.photo_url !== existingItem.photo_url
      };

      await addDoc(collection(db, 'transactions'), transactionData);
    }

    dispatch('showNotification', {
      type: 'success',
      message: `تم تحديث الصنف "${updateData.name}" بنجاح`
    });

    return { success: true, data: updateData };

  } catch (error) {
    console.error('Error updating item:', error);
    commit('SET_OPERATION_ERROR', error.message);

    dispatch('showNotification', {
      type: 'error',
      message: error.message || 'حدث خطأ في تحديث الصنف'
    });

    return { success: false, error: error.message };
  } finally {
    commit('SET_OPERATION_LOADING', false);
  }
},

    async deleteItem({ commit, dispatch, state }, itemId) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        // Check delete permissions
        if (state.userProfile.role === 'superadmin') {
          // Superadmin can delete any item
        } else if (state.userProfile.role === 'warehouse_manager') {
          const canDelete = state.userProfile.permissions?.includes('full_access') || 
                           state.userProfile.permissions?.includes('delete_items');
          if (!canDelete) {
            throw new Error('ليس لديك صلاحية لحذف الأصناف');
          }
        } else {
          throw new Error('ليس لديك صلاحية لحذف الأصناف');
        }

        if (!state.user?.uid) {
          throw new Error('معرف المستخدم غير متوفر');
        }

        // Check if item exists
        const itemRef = doc(db, 'items', itemId);
        const itemDoc = await getDoc(itemRef);

        if (!itemDoc.exists()) {
          throw new Error('الصنف غير موجود');
        }

        const itemData = itemDoc.data();

        // Check permissions for warehouse managers
        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (allowedWarehouses.length > 0 && !allowedWarehouses.includes(itemData.warehouse_id)) {
            throw new Error('ليس لديك صلاحية لحذف أصناف من هذا المخزن');
          }
        }

        // Create transaction log before deletion
        const transactionData = {
          type: 'DELETE',
          item_id: itemId,
          item_name: itemData.name,
          item_code: itemData.code,
          from_warehouse: itemData.warehouse_id,
          to_warehouse: null,
          cartons_delta: -(itemData.cartons_count || 0),
          per_carton_updated: itemData.per_carton_count || 12,
          single_delta: -(itemData.single_bottles_count || 0),
          total_delta: -(itemData.remaining_quantity || 0),
          new_remaining: 0,
          user_id: state.user.uid,
          timestamp: new Date(),
          notes: 'حذف الصنف نهائياً',
          photo_changed: false
        };

        // Add transaction log
        await addDoc(collection(db, 'transactions'), transactionData);

        // Delete the item
        await deleteDoc(itemRef);

        dispatch('showNotification', {
          type: 'success',
          message: `تم حذف الصنف "${itemData.name}" بنجاح`
        });

        return { 
          success: true, 
          message: 'تم حذف الصنف بنجاح' 
        };

      } catch (error) {
        console.error('Error deleting item:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في حذف الصنف'
        });

        return { 
          success: false, 
          error: error.message || 'حدث خطأ في حذف الصنف' 
        };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    // =============================================
    // USER MANAGEMENT ACTIONS
    // =============================================

    async loadAllUsers({ commit, dispatch, getters }) {
      commit('SET_USERS_LOADING', true);

      try {
        if (!getters.canManageUsers) {
          throw new Error('ليس لديك صلاحية لعرض المستخدمين');
        }

        const result = await UserService.getUsers();

        if (result.success) {
          commit('SET_ALL_USERS', result.data);
          return result.data;
        } else {
          throw new Error(result.error || 'فشل في تحميل المستخدمين');
        }
      } catch (error) {
        console.error('Error loading users:', error);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في تحميل المستخدمين'
        });
        throw error;
      } finally {
        commit('SET_USERS_LOADING', false);
      }
    },

    async createUser({ commit, dispatch, getters, state }, userData) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        console.log('Store.createUser called with:', userData);

        // IMPORTANT: Get current superadmin info BEFORE any user creation
        const currentUser = state.user;
        const currentUserProfile = state.userProfile;

        console.log('Current superadmin info:', {
          uid: currentUser?.uid,
          email: currentUser?.email,
          role: currentUserProfile?.role
        });

        if (!currentUser || !currentUserProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        if (currentUserProfile.role !== 'superadmin') {
          throw new Error('ليس لديك صلاحية لإضافة مستخدمين');
        }

        // Store superadmin credentials temporarily
        const superadminCredentials = {
          uid: currentUser.uid,
          email: currentUser.email,
          role: currentUserProfile.role
        };

        // Use UserService for ALL user creation
        const result = await UserService.createUser(userData, superadminCredentials);

        console.log('UserService.createUser result:', result);

        if (result.success) {
          // Show success notification
          dispatch('showNotification', {
            type: 'success',
            message: result.message || `تم إضافة المستخدم "${userData.name}" بنجاح`
          });

          return { success: true, data: result.data, message: result.message };
        } else {
          throw new Error(result.error || 'فشل في إنشاء المستخدم');
        }
      } catch (error) {
        console.error('Error creating user:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في إضافة المستخدم'
        });

        return { success: false, error: error.message };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async updateUser({ commit, dispatch, getters }, { userId, userData }) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        console.log('Store.updateUser called for:', userId, 'with:', userData);

        if (!getters.canManageUsers) {
          throw new Error('ليس لديك صلاحية لتحديث المستخدمين');
        }

        const result = await UserService.updateUser(userId, userData);

        console.log('UserService.updateUser result:', result);

        if (result.success) {
          // If current user is updating their own profile, update local state
          if (userId === getters.user?.uid) {
            const updatedProfile = {
              ...getters.userProfile,
              ...userData
            };
            commit('SET_USER_PROFILE', updatedProfile);
          }

          dispatch('showNotification', {
            type: 'success',
            message: result.message || 'تم تحديث المستخدم بنجاح'
          });

          return { success: true, data: result.data, message: result.message };
        } else {
          throw new Error(result.error || 'فشل في تحديث المستخدم');
        }
      } catch (error) {
        console.error('Error updating user:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في تحديث المستخدم'
        });

        return { success: false, error: error.message };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async deleteUser({ commit, dispatch, getters }, userId) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!getters.canManageUsers) {
          throw new Error('ليس لديك صلاحية لحذف المستخدمين');
        }

        const result = await UserService.deleteUser(userId);

        if (result.success) {
          dispatch('showNotification', {
            type: 'success',
            message: result.message || 'تم حذف المستخدم بنجاح'
          });

          return { success: true, message: result.message };
        } else {
          throw new Error(result.error || 'فشل في حذف المستخدم');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في حذف المستخدم'
        });

        return { success: false, error: error.message };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async updateUserStatus({ commit, dispatch, getters }, { userId, isActive }) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!getters.canManageUsers) {
          throw new Error('ليس لديك صلاحية لتغيير حالة المستخدمين');
        }

        const result = await UserService.updateUserStatus(userId, isActive);

        if (result.success) {
          dispatch('showNotification', {
            type: 'success',
            message: result.message || `تم ${isActive ? 'تفعيل' : 'تعطيل'} المستخدم بنجاح`
          });

          return { success: true, message: result.message };
        } else {
          throw new Error(result.error || 'فشل في تغيير حالة المستخدم');
        }
      } catch (error) {
        console.error('Error updating user status:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في تغيير حالة المستخدم'
        });

        return { success: false, error: error.message };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async getUserStats({ commit, dispatch, getters }) {
      try {
        if (!getters.canManageUsers) {
          throw new Error('ليس لديك صلاحية لعرض إحصائيات المستخدمين');
        }

        const result = await UserService.getUserStats();

        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.error || 'فشل في تحميل إحصائيات المستخدمين');
        }
      } catch (error) {
        console.error('Error loading user stats:', error);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في تحميل إحصائيات المستخدمين'
        });
        throw error;
      }
    },

    // =============================================
    // INVENTORY ACTIONS
    // =============================================

    async checkExistingItem({ state }, itemData) {
      try {
        const itemsRef = collection(db, 'items');
        const q = query(
          itemsRef,
          where('name', '==', itemData.name.trim()),
          where('code', '==', itemData.code.trim()),
          where('color', '==', itemData.color.trim()),
          where('warehouse_id', '==', itemData.warehouse_id)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          return {
            exists: true,
            item: { id: doc.id, ...doc.data() }
          };
        }

        return { exists: false, item: null };
      } catch (error) {
        console.error('Error checking existing item:', error);
        // في حالة خطأ (مثل الحاجة إلى فهرس مركب)، نعود بنتيجة سلبية
        return { exists: false, item: null };
      }
    },

    async addInventoryItemAtomic({ commit, dispatch, state }, { itemData, userId, isAddingCartons = true }) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        if (!['superadmin', 'warehouse_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لإضافة أصناف');
        }

        if (!userId) {
          throw new Error('معرف المستخدم غير متوفر');
        }

        if (!itemData.name?.trim() || !itemData.code?.trim() || !itemData.color?.trim() || !itemData.warehouse_id) {
          throw new Error('جميع الحقول المطلوبة يجب أن تكون مملوءة (الاسم، الكود، اللون، المخزن)');
        }

        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (allowedWarehouses.length > 0 && !allowedWarehouses.includes(itemData.warehouse_id)) {
            throw new Error('ليس لديك صلاحية لإضافة أصناف في هذا المخزن');
          }
        }

        // التحقق من الصورة
        if (itemData.photo_url && typeof itemData.photo_url !== 'string') {
          throw new Error('صيغة الصورة غير صحيحة');
        }

        // احسب الكمية الإجمالية
        const totalQuantity = InventoryService.calculateTotalQuantity(
          itemData.cartons_count,
          itemData.per_carton_count,
          itemData.single_bottles_count
        );

        if (totalQuantity <= 0) {
          throw new Error('يجب إدخال كمية صحيحة');
        }

        // نظف البيانات
        const cleanedData = {
          name: itemData.name.trim(),
          code: itemData.code.trim(),
          color: itemData.color.trim(),
          warehouse_id: itemData.warehouse_id,
          cartons_count: Number(itemData.cartons_count) || 0,
          per_carton_count: Number(itemData.per_carton_count) || 12,
          single_bottles_count: Number(itemData.single_bottles_count) || 0,
          supplier: itemData.supplier?.trim() || '',
          item_location: itemData.item_location?.trim() || '',
          notes: itemData.notes?.trim() || '',
          photo_url: itemData.photo_url || null,
          created_by: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        console.log('Adding/Updating item with data:', {
          ...cleanedData,
          photo_url_length: cleanedData.photo_url?.length || 0
        });

        // تحقق من وجود العنصر المكرر
        let existingItem = null;
        try {
          const itemsRef = collection(db, 'items');
          const q = query(
            itemsRef,
            where('name', '==', cleanedData.name),
            where('code', '==', cleanedData.code),
            where('color', '==', cleanedData.color),
            where('warehouse_id', '==', cleanedData.warehouse_id)
          );

          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            existingItem = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
            console.log('Found existing item:', existingItem);
          }
        } catch (error) {
          console.warn('Error checking existing item (might need composite index):', error);
        }

        let result;
        if (existingItem) {
          // تحديث العنصر الموجود
          const itemRef = doc(db, 'items', existingItem.id);

          const updateData = {
            ...cleanedData,
            cartons_count: existingItem.cartons_count + cleanedData.cartons_count,
            single_bottles_count: existingItem.single_bottles_count + cleanedData.single_bottles_count,
            remaining_quantity: existingItem.remaining_quantity + totalQuantity,
            total_added: existingItem.total_added + totalQuantity,
            updated_at: new Date().toISOString()
          };

          // احتفظ بالصورة القديمة إذا لم يتم تقديم صورة جديدة
          if (!cleanedData.photo_url && existingItem.photo_url) {
            updateData.photo_url = existingItem.photo_url;
          }

          await updateDoc(itemRef, updateData);
          result = { type: 'updated', id: existingItem.id, data: updateData };
        } else {
          // إضافة عنصر جديد
          const newItemData = {
            ...cleanedData,
            remaining_quantity: totalQuantity,
            total_added: totalQuantity
          };

          const docRef = await addDoc(collection(db, 'items'), newItemData);
          result = { type: 'created', id: docRef.id, data: newItemData };
        }

        // سجل الحركة
        const transactionData = {
          type: existingItem ? 'UPDATE' : 'ADD',
          item_id: result.id,
          item_name: cleanedData.name,
          item_code: cleanedData.code,
          from_warehouse: null,
          to_warehouse: cleanedData.warehouse_id,
          cartons_delta: cleanedData.cartons_count,
          per_carton_updated: cleanedData.per_carton_count,
          single_delta: cleanedData.single_bottles_count,
          total_delta: totalQuantity,
          new_remaining: result.data.remaining_quantity,
          user_id: userId,
          timestamp: new Date(),
          notes: cleanedData.notes || (existingItem ? 'تحديث كميات' : 'إضافة صنف جديد'),
          photo_changed: !!cleanedData.photo_url
        };

        await addDoc(collection(db, 'transactions'), transactionData);

        console.log(`Item ${result.type} successfully with photo:`, !!cleanedData.photo_url);

        dispatch('showNotification', {
          type: 'success',
          message: `تم ${result.type === 'created' ? 'إضافة' : 'تحديث'} الصنف "${cleanedData.name}" بنجاح`
        });

        return result;

      } catch (error) {
        console.error('Error in addInventoryItemAtomic:', error);
        const errorMessage = error.message || 'حدث خطأ غير متوقع أثناء حفظ الصنف';
        commit('SET_OPERATION_ERROR', errorMessage);

        dispatch('showNotification', {
          type: 'error',
          message: errorMessage
        });

        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async loadWarehouses({ commit, dispatch, state }) {
      try {
        if (state.warehousesLoaded) {
          console.log('Warehouses already loaded, skipping...');
          return;
        }

        console.log('Loading warehouses from Firestore...');

        await dispatch('initializeDefaultWarehouses');
        await dispatch('subscribeToWarehouses');

        commit('SET_WAREHOUSES_LOADED', true);
        console.log('Warehouses loaded successfully');

      } catch (error) {
        console.error('Error loading warehouses:', error);
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تحميل المخازن'
        });
        commit('SET_WAREHOUSES_LOADED', false);
      }
    },

    async subscribeToWarehouses({ commit, state, dispatch }) {
      if (state.unsubscribeWarehouses) {
        state.unsubscribeWarehouses();
      }

      if (!state.userProfile) {
        console.log('Cannot subscribe to warehouses: User not authenticated');
        return;
      }

      console.log('Subscribing to warehouses...');

      try {
        const warehousesQuery = query(
          collection(db, 'warehouses'),
          orderBy('name_ar')
        );

        const unsubscribe = onSnapshot(warehousesQuery, (snapshot) => {
          console.log('Warehouses snapshot received:', snapshot.size, 'warehouses');

          const warehouses = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          console.log('Warehouses loaded:', warehouses.length);
          commit('SET_WAREHOUSES', warehouses);

        }, (error) => {
          console.error('Error in warehouses subscription:', error);
          dispatch('showNotification', {
            type: 'error',
            message: 'خطأ في تحديث بيانات المخازن'
          });
        });

        commit('SET_UNSUBSCRIBE_WAREHOUSES', unsubscribe);

      } catch (error) {
        console.error('Error setting up warehouses subscription:', error);
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في إعداد اشتراك المخازن'
        });
      }
    },

    async initializeDefaultWarehouses({ commit, dispatch }) {
      try {
        console.log('Checking/initializing default warehouses...');

        const defaultWarehouses = [
          {
            id: 'main_warehouse',
            name_ar: 'مخزن شارع الشيخ',
            name_en: 'Main Warehouse',
            type: 'primary',
            is_main: true,
            status: 'active',
            capacity: 1000,
            location: 'شارع الشيخ، المنوفية',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 'tera_warehouse',
            name_ar: 'مخزن الترعه',
            name_en: 'Teraa Warehouse',
            type: 'primary',
            status: 'active',
            capacity: 800,
            location: 'الترعة، المنوفية',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 'shobeen_warehouse',
            name_ar: 'مخزن موقف شبين',
            name_en: 'Shobeen Warehouse',
            type: 'primary',
            status: 'active',
            capacity: 600,
            location: 'موقف شبين، المنوفية',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 'hyper_warehouse',
            name_ar: 'مخزن هايبر التهامي',
            name_en: 'Hyper El Tahamy Warehouse',
            type: 'primary',
            status: 'active',
            capacity: 500,
            location: 'هايبر التهامي، المنوفية',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 'matbaa_warehouse',
            name_ar: 'مخزن المطبعه',
            name_en: 'Matbaa Warehouse',
            type: 'primary',
            status: 'active',
            capacity: 400,
            location: 'المطبعة، المنوفية',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 'ghabashi_warehouse',
            name_ar: 'مخزن الغباشي',
            name_en: 'Ghabashi Warehouse',
            type: 'primary',
            status: 'active',
            capacity: 300,
            location: 'الغباشي، المنوفية',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 'factory',
            name_ar: 'صرف الي مصنع البران',
            name_en: 'Al Bran Factory Dispatch',
            type: 'dispatch',
            status: 'active',
            description: 'مصنع البران للتصنيع',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 'zahra',
            name_ar: 'صرف الي مخزن الزهراء',
            name_en: 'Al Zahra Warehouse Dispatch',
            type: 'dispatch',
            status: 'active',
            description: 'مخزن الزهراء للتوزيع',
            created_at: new Date(),
            updated_at: new Date()
          }
        ];

        const batch = writeBatch(db);
        let needsInitialization = false;

        for (const warehouse of defaultWarehouses) {
          const warehouseRef = doc(db, 'warehouses', warehouse.id);
          const warehouseDoc = await getDoc(warehouseRef);

          if (!warehouseDoc.exists()) {
            needsInitialization = true;
            batch.set(warehouseRef, warehouse);
            console.log(`Adding warehouse: ${warehouse.name_ar}`);
          }
        }

        if (needsInitialization) {
          await batch.commit();
          console.log('Default warehouses initialized successfully');

          dispatch('showNotification', {
            type: 'success',
            message: 'تم تهيئة المخازن الافتراضية'
          });
        } else {
          console.log('Warehouses already exist, skipping initialization');
        }

      } catch (error) {
        console.error('Error initializing default warehouses:', error);
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تهيئة المخازن الافتراضية'
        });
        throw error;
      }
    },

    async subscribeToInventory({ commit, state, dispatch }) {
      if (state.unsubscribeInventory) {
        state.unsubscribeInventory();
      }

      if (!state.userProfile) {
        console.log('Cannot subscribe to inventory: User not authenticated');
        return;
      }

      console.log('Subscribing to inventory for user role:', state.userProfile.role);
      console.log('Allowed warehouses:', state.userProfile.allowed_warehouses);

      try {
        let itemsQuery;
        const itemsRef = collection(db, 'items');

        if (state.userProfile.role === 'superadmin') {
          itemsQuery = query(
            itemsRef,
            orderBy('warehouse_id'),
            orderBy('name')
          );
        } else if (state.userProfile.role === 'company_manager' || state.userProfile.role === 'user') {
          itemsQuery = query(
            itemsRef,
            orderBy('warehouse_id'),
            orderBy('name')
          );
        } else if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];

          if (allowedWarehouses.length === 0) {
            console.log('No warehouses assigned to this warehouse manager');
            commit('SET_INVENTORY', []);
            return;
          }

          if (allowedWarehouses.includes('all')) {
            itemsQuery = query(
              itemsRef,
              orderBy('warehouse_id'),
              orderBy('name')
            );
          } else if (allowedWarehouses.length <= 10) {
            try {
              itemsQuery = query(
                itemsRef,
                where('warehouse_id', 'in', allowedWarehouses),
                orderBy('warehouse_id'),
                orderBy('name')
              );
            } catch (error) {
              if (error.code === 'failed-precondition') {
                console.warn('Composite index required. Using client-side filtering.');
                commit('SET_REQUIRES_COMPOSITE_INDEX', true);
                itemsQuery = query(
                  itemsRef,
                  orderBy('warehouse_id'),
                  orderBy('name')
                );
              } else {
                throw error;
              }
            }
          } else {
            console.log('More than 10 warehouses - using client-side filtering');
            itemsQuery = query(
              itemsRef,
              orderBy('warehouse_id'),
              orderBy('name')
            );
          }
        } else {
          console.log('User role not authorized for inventory access');
          commit('SET_INVENTORY', []);
          return;
        }

        const unsubscribe = onSnapshot(itemsQuery, (snapshot) => {
          console.log('Inventory snapshot received:', snapshot.size, 'items');

          const inventory = snapshot.docs.map(doc => {
            const data = doc.data();
            return InventoryService.convertForDisplay({
              id: doc.id,
              ...data
            });
          });

          let filteredInventory = inventory;
          if (state.userProfile.role === 'warehouse_manager') {
            const allowedWarehouses = state.userProfile.allowed_warehouses || [];
            if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
              if (allowedWarehouses.length > 10 || state.requiresCompositeIndex) {
                filteredInventory = inventory.filter(item => 
                  allowedWarehouses.includes(item.warehouse_id)
                );
              }
            }
          }

          console.log('Inventory loaded:', filteredInventory.length, 'items');
          commit('SET_INVENTORY', filteredInventory);

        }, (error) => {
          console.error('Error in inventory subscription:', error);

          if (error.code === 'failed-precondition') {
            commit('SET_REQUIRES_COMPOSITE_INDEX', true);
            dispatch('showNotification', {
              type: 'warning',
              title: 'تحذير الفهرس',
              message: 'يجب إنشاء فهرس مركب لتحسين الأداء. راجع وحدة التحكم في Firebase.'
            });
          } else if (error.code === 'permission-denied') {
            dispatch('showNotification', {
              type: 'error',
              message: 'ليس لديك صلاحية لعرض المخزون'
            });
          } else {
            dispatch('showNotification', {
              type: 'error',
              message: 'خطأ في تحميل المخزون'
            });
          }

          commit('SET_INVENTORY', []);
        });

        commit('SET_UNSUBSCRIBE_INVENTORY', unsubscribe);

      } catch (error) {
        console.error('Error setting up inventory subscription:', error);
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في إعداد اشتراك المخزون'
        });
        commit('SET_INVENTORY', []);
      }
    },

    async subscribeToTransactions({ commit, state, dispatch }) {
      if (state.unsubscribeTransactions) {
        state.unsubscribeTransactions();
      }

      if (!state.userProfile) {
        console.log('Cannot subscribe to transactions: User not authenticated');
        return;
      }

      console.log('Subscribing to transactions...');

      try {
        const transactionsQuery = query(
          collection(db, 'transactions'),
          orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(transactionsQuery, (snapshot) => {
          console.log('Transactions snapshot received:', snapshot.size, 'transactions');

          const transactions = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              _display: {
                from_warehouse: WAREHOUSE_LABELS[data.from_warehouse] || data.from_warehouse,
                to_warehouse: WAREHOUSE_LABELS[data.to_warehouse] ||
                             DESTINATION_LABELS[data.to_warehouse] ||
                             data.to_warehouse,
              }
            };
          });

          console.log('Transactions loaded:', transactions.length, 'transactions');
          commit('SET_TRANSACTIONS', transactions);

        }, (error) => {
          console.error('Error in transactions subscription:', error);
          dispatch('showNotification', {
            type: 'error',
            message: 'خطأ في تحميل الحركات'
          });
          commit('SET_TRANSACTIONS', []);
        });

        commit('SET_UNSUBSCRIBE_TRANSACTIONS', unsubscribe);

      } catch (error) {
        console.error('Error setting up transactions subscription:', error);
        commit('SET_TRANSACTIONS', []);
      }
    },

    async getRecentTransactions({ commit, dispatch, state }) {
      commit('SET_RECENT_TRANSACTIONS_LOADING', true);

      try {
        if (!state.userProfile) {
          console.log('Cannot load recent transactions: User not authenticated');
          return [];
        }

        console.log('Loading recent transactions...');

        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const transactionsQuery = query(
          collection(db, 'transactions'),
          where('timestamp', '>=', oneDayAgo),
          orderBy('timestamp', 'desc'),
          limit(20)
        );

        const snapshot = await getDocs(transactionsQuery);
        const transactions = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            _display: {
              from_warehouse: WAREHOUSE_LABELS[data.from_warehouse] || data.from_warehouse,
              to_warehouse: WAREHOUSE_LABELS[data.to_warehouse] ||
                           DESTINATION_LABELS[data.to_warehouse] ||
                           data.to_warehouse,
            }
          };
        });

        console.log('Recent transactions loaded:', transactions.length);
        commit('SET_RECENT_TRANSACTIONS', transactions);

        return transactions;

      } catch (error) {
        console.error('Error loading recent transactions:', error);
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في تحميل الحركات الحديثة'
        });
        return [];
      } finally {
        commit('SET_RECENT_TRANSACTIONS_LOADING', false);
      }
    },

    async addInventoryItem({ commit, dispatch, state }, { itemData, isAddingCartons = true }) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }
        if (!['superadmin', 'warehouse_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لإضافة أصناف');
        }
        if (!state.user?.uid) {
          throw new Error('معرف المستخدم غير متوفر');
        }

        if (!itemData.name?.trim() || !itemData.code?.trim() || !itemData.color?.trim() || !itemData.warehouse_id) {
          throw new Error('جميع الحقول المطلوبة يجب أن تكون مملوءة (الاسم، الكود، اللون، المخزن)');
        }

        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (!allowedWarehouses.includes(itemData.warehouse_id)) {
            throw new Error('ليس لديك صلاحية لإضافة أصناف في هذا المخزن');
          }
        }

        const totalQuantity = InventoryService.calculateTotalQuantity(
          itemData.cartons_count,
          itemData.per_carton_count,
          itemData.single_bottles_count
        );

        if (totalQuantity <= 0) {
          throw new Error('يجب إدخال كمية صحيحة');
        }

        const cleanedData = {
          name: itemData.name.trim(),
          code: itemData.code.trim(),
          color: itemData.color.trim(),
          warehouse_id: itemData.warehouse_id,
          cartons_count: Number(itemData.cartons_count) || 0,
          per_carton_count: Number(itemData.per_carton_count) || 12,
          single_bottles_count: Number(itemData.single_bottles_count) || 0,
          supplier: itemData.supplier?.trim() || '',
          item_location: itemData.item_location?.trim() || '',
          notes: itemData.notes?.trim() || ''
        };

        console.log('Adding item with cleaned data:', cleanedData);

        const result = await InventoryService.addOrUpdateItem(
          cleanedData,
          state.user.uid,
          isAddingCartons
        );

        console.log(`Item ${result.type} successfully:`, result.id);

        commit('ADD_RECENT_TRANSACTION', {
          type: TRANSACTION_TYPES.ADD,
          item_id: result.id,
          timestamp: new Date(),
          notes: cleanedData.notes || 'عملية إضافة'
        });

        dispatch('showNotification', {
          type: 'success',
          message: `تم ${result.type === 'created' ? 'إضافة' : 'تحديث'} الصنف "${cleanedData.name}" بنجاح`
        });

        return result;

      } catch (error) {
        console.error('Error adding inventory item:', error);
        const errorMessage = error.message || 'حدث خطأ غير متوقع أثناء إضافة الصنف';
        commit('SET_OPERATION_ERROR', errorMessage);

        dispatch('showNotification', {
          type: 'error',
          message: errorMessage
        });

        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async transferItem({ commit, dispatch, state }, transferData) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }
        if (!['superadmin', 'warehouse_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لنقل الأصناف');
        }
        if (!state.user?.uid) {
          throw new Error('معرف المستخدم غير متوفر');
        }

        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (!allowedWarehouses.includes(transferData.from_warehouse_id)) {
            throw new Error('ليس لديك صلاحية للنقل من هذا المخزن');
          }
        }

        const result = await InventoryService.transferItem(transferData, state.user.uid);

        console.log('Transfer completed successfully:', result.transferQty);

        commit('ADD_RECENT_TRANSACTION', {
          type: TRANSACTION_TYPES.TRANSFER,
          item_id: transferData.itemId,
          timestamp: new Date(),
          notes: 'نقل بين المخازن'
        });

        dispatch('showNotification', {
          type: 'success',
          message: 'تم نقل الصنف بنجاح'
        });

        return result;

      } catch (error) {
        console.error('Error transferring item:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ أثناء نقل الصنف'
        });

        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async dispatchItem({ commit, dispatch, state }, dispatchData) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        const canDispatch = state.userProfile.role === 'superadmin' || 
                           (state.userProfile.role === 'warehouse_manager' && 
                            state.userProfile.permissions?.includes('dispatch_items'));

        if (!canDispatch) {
          throw new Error('ليس لديك صلاحية لصرف الأصناف');
        }

        if (!state.user?.uid) {
          throw new Error('معرف المستخدم غير متوفر');
        }

        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (!allowedWarehouses.includes(dispatchData.from_warehouse_id)) {
            throw new Error('ليس لديك صلاحية للصرف من هذا المخزن');
          }
        }

        const result = await InventoryService.dispatchItem(dispatchData, state.user.uid);

        console.log('Dispatch completed successfully:', result.dispatchQty);

        commit('ADD_RECENT_TRANSACTION', {
          type: TRANSACTION_TYPES.DISPATCH,
          item_id: dispatchData.itemId,
          timestamp: new Date(),
          notes: 'صرف إلى خارجي'
        });

        dispatch('showNotification', {
          type: 'success',
          message: 'تم صرف الصنف بنجاح'
        });

        return result;

      } catch (error) {
        console.error('Error dispatching item:', error);
        commit('SET_OPERATION_ERROR', error.message);

        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ أثناء صرف الصنف'
        });

        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    updateFilters({ commit }, filters) {
      commit('SET_FILTERS', filters);
    },

    removeNotification({ commit }, notificationId) {
      commit('REMOVE_NOTIFICATION', notificationId);
    },

    clearNotifications({ commit }) {
      commit('CLEAR_NOTIFICATIONS');
    },

    clearOperationError({ commit }) {
      commit('CLEAR_OPERATION_ERROR');
    }
  },
  getters: {
    // User-related getters
    isAuthenticated: state => !!state.user,
    userRole: state => state.userProfile?.role,
    userName: state => state.userProfile?.name || state.userProfile?.email?.split('@')[0],
    allowedWarehouses: state => state.userProfile?.allowed_warehouses || [],
    userPermissions: state => state.userProfile?.permissions || [],
    authError: state => state.authError,
    operationError: state => state.operationError,
    operationLoading: state => state.operationLoading,
    fieldMappings: state => state.fieldMappings,
    warehousesLoaded: state => state.warehousesLoaded,
    notifications: state => state.notifications,
    recentTransactions: state => state.recentTransactions,
    recentTransactionsLoading: state => state.recentTransactionsLoading,
    requiresCompositeIndex: state => state.requiresCompositeIndex,
    allUsers: state => state.allUsers,
    usersLoading: state => state.usersLoading,

    // Permission checks
    canEdit: (state, getters) => {
      return ['superadmin', 'warehouse_manager'].includes(getters.userRole);
    },

    canDelete: (state, getters) => {
      if (getters.userRole === 'superadmin') return true;
      if (getters.userRole === 'warehouse_manager') {
        return getters.userPermissions.includes('full_access') || 
               getters.userPermissions.includes('delete_items');
      }
      return false;
    },

    canManageUsers: state => state.userProfile?.role === 'superadmin',
    canManageWarehouses: state => state.userProfile?.role === 'superadmin',

    canDispatch: (state, getters) => {
      if (getters.userRole === 'superadmin') return true;
      if (getters.userRole === 'warehouse_manager') {
        return getters.userPermissions.includes('dispatch_items');
      }
      return false;
    },

    // Warehouse getters
    mainWarehouse: state => state.warehouses.find(w => w.is_main),
    primaryWarehouses: state => state.warehouses.filter(w => w.type === 'primary'),
    dispatchWarehouses: state => state.warehouses.filter(w => w.type === 'dispatch'),

    accessibleWarehouses: (state, getters) => {
      if (!state.warehousesLoaded) return [];

      if (getters.userRole === 'superadmin') {
        return state.warehouses;
      }

      if (getters.userRole === 'warehouse_manager') {
        const allowedWarehouses = getters.allowedWarehouses;
        if (allowedWarehouses && allowedWarehouses.length > 0) {
          const accessiblePrimary = state.warehouses.filter(w => 
            w.type === 'primary' && allowedWarehouses.includes(w.id)
          );
          const accessibleDispatch = state.warehouses.filter(w => w.type === 'dispatch');
          return [...accessiblePrimary, ...accessibleDispatch];
        }
      }

      if (getters.userRole === 'company_manager') {
        return state.warehouses;
      }

      return [];
    },

    accessiblePrimaryWarehouses: (state, getters) => {
      const accessible = getters.accessibleWarehouses;
      return accessible.filter(w => w.type === 'primary');
    },

    accessibleDispatchWarehouses: (state, getters) => {
      const accessible = getters.accessibleWarehouses;
      return accessible.filter(w => w.type === 'dispatch');
    },

    dispatchFromWarehouses: (state, getters) => {
      if (!state.warehousesLoaded) return [];

      if (getters.userRole === 'superadmin') {
        return state.warehouses.filter(w => w.type === 'primary');
      }

      if (getters.userRole === 'warehouse_manager') {
        const allowedWarehouses = getters.allowedWarehouses;
        if (allowedWarehouses && allowedWarehouses.length > 0) {
          return state.warehouses.filter(w => 
            w.type === 'primary' && allowedWarehouses.includes(w.id)
          );
        }
      }

      return [];
    },

    // Filtered inventory with warehouse and search filters
    filteredInventory: (state) => {
      let inventory = state.inventory;

      // Filter by user's allowed warehouses if not superadmin
      if (state.userProfile?.role === 'warehouse_manager' || state.userProfile?.role === 'company_manager') {
        const allowedWarehouses = state.userProfile.allowed_warehouses || [];
        if (allowedWarehouses.length > 0) {
          inventory = inventory.filter(item => allowedWarehouses.includes(item.warehouse_id));
        }
      }

      // Apply search filter
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase();
        inventory = inventory.filter(item =>
          item.name?.toLowerCase().includes(searchLower) ||
          item.code?.toLowerCase().includes(searchLower) ||
          item.color?.toLowerCase().includes(searchLower) ||
          item.supplier?.toLowerCase().includes(searchLower) ||
          item.item_location?.toLowerCase().includes(searchLower)
        );
      }

      // Apply warehouse filter
      if (state.filters.warehouse) {
        inventory = inventory.filter(item => item.warehouse_id === state.filters.warehouse);
      }

      return inventory;
    },

    // Dashboard statistics
    dashboardStats: (state) => {
      let inventory = state.inventory;

      // Filter by user's allowed warehouses if not superadmin
      if (state.userProfile?.role === 'warehouse_manager' || state.userProfile?.role === 'company_manager') {
        const allowedWarehouses = state.userProfile.allowed_warehouses || [];
        if (allowedWarehouses.length > 0) {
          inventory = inventory.filter(item => allowedWarehouses.includes(item.warehouse_id));
        }
      }

      const totalItems = inventory.length;
      const totalQuantity = inventory.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0);
      const lowStockItems = inventory.filter(item => (item.remaining_quantity || 0) < 10).length;
      const outOfStockItems = inventory.filter(item => (item.remaining_quantity || 0) === 0).length;

      // Calculate value (assuming average value per item)
      const averageValuePerItem = 50;
      const estimatedValue = totalQuantity * averageValuePerItem;

      const recentTransactions = state.recentTransactions.length;

      // Calculate transactions by type
      const addTransactions = state.recentTransactions.filter(t => t.type === TRANSACTION_TYPES.ADD).length;
      const transferTransactions = state.recentTransactions.filter(t => t.type === TRANSACTION_TYPES.TRANSFER).length;
      const dispatchTransactions = state.recentTransactions.filter(t => t.type === TRANSACTION_TYPES.DISPATCH).length;

      return {
        totalItems,
        totalQuantity,
        lowStockItems,
        outOfStockItems,
        estimatedValue,
        recentTransactions,
        addTransactions,
        transferTransactions,
        dispatchTransactions,
        transactionsByType: {
          add: addTransactions,
          transfer: transferTransactions,
          dispatch: dispatchTransactions
        }
      };
    },

    getArabicLabel: (state) => (fieldName) => {
      return state.fieldMappings.englishToArabic[fieldName] || fieldName;
    },

    getWarehouseLabel: (state) => (warehouseId) => {
      if (!warehouseId) return '';
      const warehouse = state.warehouses.find(w => w.id === warehouseId);
      return warehouse ? warehouse.name_ar : warehouseId;
    },

    getDestinationLabel: () => (destinationId) => {
      return DESTINATION_LABELS[destinationId] || destinationId;
    },

    getWarehouseById: (state) => (warehouseId) => {
      return state.warehouses.find(w => w.id === warehouseId);
    }
  }
});

// Helper function for auth error messages
function getAuthErrorMessage(errorCode) {
  const errorMessages = {
    'auth/invalid-email': 'البريد الإلكتروني غير صحيح',
    'auth/user-disabled': 'هذا الحساب معطل',
    'auth/user-not-found': 'لا يوجد حساب بهذا البريد الإلكتروني',
    'auth/wrong-password': 'كلمة المرور غير صحيحة',
    'auth/email-already-in-use': 'هذا البريد الإلكتروني مستخدم بالفعل',
    'auth/weak-password': 'كلمة المرور ضعيفة',
    'auth/network-request-failed': 'خطأ في الاتصال بالشبكة',
    'auth/too-many-requests': 'محاولات تسجيل دخول كثيرة. يرجى المحاولة لاحقاً',
    'auth/configuration-not-found': 'خطأ في إعدادات النظام'
  };

  return errorMessages[errorCode] || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى';
}
