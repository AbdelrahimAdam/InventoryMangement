import { createStore } from 'vuex';
import { auth, db } from '@/firebase/config';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
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
  runTransaction,
  limit,
  startAfter
} from 'firebase/firestore';
import {
  InventoryService,
  WAREHOUSE_LABELS,
  DESTINATION_LABELS,
  FIELD_LABELS,
  TRANSACTION_TYPES
} from '@/services/inventoryService';

// Import UserService
import UserService from '@/services/UserService';

// Field name mapping for backward compatibility
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
    // Add notification state
    notifications: [],
    // Unsubscribe functions for cleanup
    unsubscribeInventory: null,
    unsubscribeTransactions: null,
    unsubscribeWarehouses: null,
    // Recent transactions cache
    recentTransactions: [],
    recentTransactionsLoading: false,
    // Composite index check
    requiresCompositeIndex: false
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
    SET_AUTH_ERROR(state, error) {
      state.authError = error;
    },
    CLEAR_OPERATION_ERROR(state) {
      state.operationError = null;
    },
    // Notification mutations
    ADD_NOTIFICATION(state, notification) {
      notification.id = Date.now().toString();
      notification.timestamp = new Date();
      state.notifications.push(notification);

      // Auto-remove notification after 5 seconds
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
    // Unsubscribe functions
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
    // Recent transactions mutations
    SET_RECENT_TRANSACTIONS(state, transactions) {
      state.recentTransactions = transactions;
    },
    SET_RECENT_TRANSACTIONS_LOADING(state, loading) {
      state.recentTransactionsLoading = loading;
    },
    ADD_RECENT_TRANSACTION(state, transaction) {
      state.recentTransactions.unshift(transaction);
      // Keep only last 50 transactions
      if (state.recentTransactions.length > 50) {
        state.recentTransactions = state.recentTransactions.slice(0, 50);
      }
    },
    // Composite index mutation
    SET_REQUIRES_COMPOSITE_INDEX(state, value) {
      state.requiresCompositeIndex = value;
    }
  },
  actions: {
    // Notification actions
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

      // Log for debugging
      console.log(`[Notification:${finalNotification.type}] ${finalNotification.title || ''}: ${finalNotification.message}`);

      // Fallback to console for errors if UI notifications aren't working
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
              const userDoc = await getDoc(doc(db, 'users', user.uid));
              if (userDoc.exists()) {
                const userProfile = userDoc.data();
                commit('SET_USER_PROFILE', userProfile);
                console.log('User profile loaded:', userProfile.role, userProfile.allowed_warehouses);

                // Load warehouses first, then start data subscriptions
                await dispatch('loadWarehouses');

                // Start subscriptions
                dispatch('subscribeToInventory');
                dispatch('subscribeToTransactions');

              } else {
                console.log('User document not found, creating default profile...');
                await dispatch('createUserProfile', user);
              }
            } catch (error) {
              console.error('Error loading user profile:', error);
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

            // Clean up subscriptions
            commit('CLEAR_UNSUBSCRIBERS');
          }
          resolve();
        });
      });
    },

    async createUserProfile({ commit, dispatch }, user) {
      try {
        // Determine role based on email for demo users
        let userProfile = {
          email: user.email,
          role: 'company_manager',
          name: user.email.split('@')[0],
          allowed_warehouses: [],
          permissions: ['view_reports'],
          created_at: new Date()
        };

        // Set specific roles for demo accounts
        if (user.email === 'superadmin@monofia.com') {
          userProfile = {
            ...userProfile,
            role: 'superadmin',
            name: 'المشرف العام',
            allowed_warehouses: ['main_warehouse', 'tera_warehouse', 'shobeen_warehouse', 'hyper_warehouse', 'matbaa_warehouse', 'ghabashi_warehouse', 'factory', 'zahra'],
            permissions: ['all']
          };
        } else if (user.email === 'warehouse@monofia.com') {
          userProfile = {
            ...userProfile,
            role: 'warehouse_manager',
            name: 'مدير المخازن',
            allowed_warehouses: ['main_warehouse', 'tera_warehouse', 'shobeen_warehouse', 'hyper_warehouse'],
            permissions: ['full_access', 'manage_inventory', 'create_transfers', 'dispatch_items', 'view_reports', 'delete_items', 'update_items']
          };
        } else if (user.email === 'company@monofia.com') {
          userProfile = {
            ...userProfile,
            role: 'company_manager',
            name: 'مدير الشركة',
            allowed_warehouses: ['main_warehouse', 'tera_warehouse', 'shobeen_warehouse', 'hyper_warehouse', 'matbaa_warehouse', 'ghabashi_warehouse'],
            permissions: ['view_reports', 'export_data']
          };
        }

        await setDoc(doc(db, 'users', user.uid), userProfile);
        commit('SET_USER_PROFILE', userProfile);

        // Show notification
        dispatch('showNotification', {
          type: 'success',
          message: `مرحباً ${userProfile.name}! تم إنشاء حسابك بنجاح.`
        });

        // Load warehouses after creating profile
        await dispatch('loadWarehouses');

      } catch (error) {
        console.error('Error creating user profile:', error);
        dispatch('showNotification', {
          type: 'error',
          message: 'خطأ في إنشاء حساب المستخدم'
        });
        throw error;
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

        // Get or create user profile
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userProfile = userDoc.data();
          commit('SET_USER_PROFILE', userProfile);
          console.log('User profile loaded:', userProfile.role, userProfile.allowed_warehouses);

          // Show welcome notification
          dispatch('showNotification', {
            type: 'success',
            message: `مرحباً ${userProfile.name}! تم تسجيل الدخول بنجاح.`
          });

          // Load warehouses after login
          await dispatch('loadWarehouses');

          // Start data subscriptions
          dispatch('subscribeToInventory');
          dispatch('subscribeToTransactions');

          // Load recent transactions for dashboard
          dispatch('getRecentTransactions');
        } else {
          console.log('Creating new user profile...');
          await dispatch('createUserProfile', user);
        }

        commit('SET_USER', user);

        return user;

      } catch (error) {
        console.error('Login error details:', error);

        const errorMessage = getAuthErrorMessage(error.code);
        commit('SET_AUTH_ERROR', errorMessage);

        // Show error notification
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

        // Clean up subscriptions
        commit('CLEAR_UNSUBSCRIBERS');

        // Show logout notification
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

    async loadWarehouses({ commit, dispatch, state }) {
      try {
        // If warehouses already loaded, skip
        if (state.warehousesLoaded) {
          console.log('Warehouses already loaded, skipping...');
          return;
        }

        console.log('Loading warehouses from Firestore...');

        // Initialize default warehouses if none exist
        await dispatch('initializeDefaultWarehouses');

        // Subscribe to warehouses changes
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
      // Clean up existing subscription first
      if (state.unsubscribeWarehouses) {
        state.unsubscribeWarehouses();
      }

      if (!state.userProfile) {
        console.log('Cannot subscribe to warehouses: User not authenticated');
        return;
      }

      console.log('Subscribing to warehouses...');

      try {
        // SIMPLIFIED: All authenticated users can read all warehouses
        // Store will filter based on user role
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

        // Check each warehouse and add if it doesn't exist
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

          // Show notification if this was the first time
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

    // Warehouse Management Actions (for superadmin)
    async createWarehouse({ commit, dispatch, getters }, warehouseData) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        // Check if user is superadmin
        if (!getters.canManageUsers) {
          throw new Error('ليس لديك صلاحية لإضافة مخازن');
        }

        // Validate required fields
        if (!warehouseData.id?.trim() || !warehouseData.name_ar?.trim()) {
          throw new Error('المعرف والاسم العربي للمخزن مطلوبان');
        }

        // Clean the data
        const cleanedData = {
          id: warehouseData.id.trim(),
          name_ar: warehouseData.name_ar.trim(),
          name_en: warehouseData.name_en?.trim() || warehouseData.name_ar.trim(),
          type: warehouseData.type || 'primary',
          status: warehouseData.status || 'active',
          capacity: Number(warehouseData.capacity) || 0,
          location: warehouseData.location?.trim() || '',
          description: warehouseData.description?.trim() || '',
          is_main: warehouseData.is_main || false,
          created_at: new Date(),
          updated_at: new Date()
        };

        // Check if warehouse already exists
        const warehouseRef = doc(db, 'warehouses', cleanedData.id);
        const existingDoc = await getDoc(warehouseRef);

        if (existingDoc.exists()) {
          throw new Error('المخزن موجود بالفعل');
        }

        // Create warehouse
        await setDoc(warehouseRef, cleanedData);

        console.log('Warehouse created successfully:', cleanedData.id);

        // Show success notification
        dispatch('showNotification', {
          type: 'success',
          message: `تم إنشاء المخزن "${cleanedData.name_ar}" بنجاح`
        });

        return { success: true, id: cleanedData.id, data: cleanedData };

      } catch (error) {
        console.error('Error creating warehouse:', error);
        commit('SET_OPERATION_ERROR', error.message);

        // Show error notification
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في إنشاء المخزن'
        });

        return { success: false, error: error.message };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async updateWarehouse({ commit, dispatch, getters }, { warehouseId, warehouseData }) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        // Check if user is superadmin
        if (!getters.canManageUsers) {
          throw new Error('ليس لديك صلاحية لتحديث المخازن');
        }

        // Validate warehouse exists
        const warehouseRef = doc(db, 'warehouses', warehouseId);
        const existingDoc = await getDoc(warehouseRef);

        if (!existingDoc.exists()) {
          throw new Error('المخزن غير موجود');
        }

        // Prepare update data
        const updateData = {
          updated_at: new Date(),
          ...warehouseData
        };

        // Clean string fields
        if (updateData.name_ar) updateData.name_ar = updateData.name_ar.trim();
        if (updateData.name_en) updateData.name_en = updateData.name_en.trim();
        if (updateData.location) updateData.location = updateData.location.trim();
        if (updateData.description) updateData.description = updateData.description.trim();

        // Update warehouse
        await updateDoc(warehouseRef, updateData);

        console.log('Warehouse updated successfully:', warehouseId);

        // Show success notification
        dispatch('showNotification', {
          type: 'success',
          message: 'تم تحديث بيانات المخزن بنجاح'
        });

        return { success: true, id: warehouseId };

      } catch (error) {
        console.error('Error updating warehouse:', error);
        commit('SET_OPERATION_ERROR', error.message);

        // Show error notification
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في تحديث المخزن'
        });

        return { success: false, error: error.message };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async deleteWarehouse({ commit, dispatch, getters }, warehouseId) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        // Check if user is superadmin
        if (!getters.canManageUsers) {
          throw new Error('ليس لديك صلاحية لحذف المخازن');
        }

        // Check if warehouse exists
        const warehouseRef = doc(db, 'warehouses', warehouseId);
        const existingDoc = await getDoc(warehouseRef);

        if (!existingDoc.exists()) {
          throw new Error('المخزن غير موجود');
        }

        // Check if warehouse has items
        const itemsQuery = query(
          collection(db, 'items'),
          where('warehouse_id', '==', warehouseId),
          limit(1)
        );
        const itemsSnapshot = await getDocs(itemsQuery);

        if (!itemsSnapshot.empty) {
          throw new Error('لا يمكن حذف مخزن يحتوي على أصناف');
        }

        // Delete warehouse
        await deleteDoc(warehouseRef);

        console.log('Warehouse deleted successfully:', warehouseId);

        // Show success notification
        dispatch('showNotification', {
          type: 'success',
          message: 'تم حذف المخزن بنجاح'
        });

        return { success: true, id: warehouseId };

      } catch (error) {
        console.error('Error deleting warehouse:', error);
        commit('SET_OPERATION_ERROR', error.message);

        // Show error notification
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في حذف المخزن'
        });

        return { success: false, error: error.message };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async getWarehouseStats({ commit, dispatch, getters }) {
      try {
        // Check if user has permission
        if (!getters.canManageUsers && getters.userRole !== 'company_manager') {
          throw new Error('ليس لديك صلاحية لعرض إحصائيات المخازن');
        }

        const warehouses = getters.accessibleWarehouses;
        const inventory = state.inventory;

        const stats = warehouses.map(warehouse => {
          const warehouseItems = inventory.filter(item => item.warehouse_id === warehouse.id);
          const totalItems = warehouseItems.length;
          const totalQuantity = warehouseItems.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0);
          const lowStockItems = warehouseItems.filter(item => (item.remaining_quantity || 0) < 10).length;

          return {
            warehouse_id: warehouse.id,
            warehouse_name: warehouse.name_ar,
            total_items: totalItems,
            total_quantity: totalQuantity,
            low_stock_items: lowStockItems
          };
        });

        return stats;

      } catch (error) {
        console.error('Error getting warehouse stats:', error);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في تحميل إحصائيات المخازن'
        });
        return [];
      }
    },

    // User Management Actions
    async loadAllUsers({ commit, dispatch, getters }) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        // Check if user is superadmin
        if (!getters.canManageUsers) {
          throw new Error('ليس لديك صلاحية لعرض المستخدمين');
        }

        const result = await UserService.getUsers();

        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.error || 'فشل في تحميل المستخدمين');
        }
      } catch (error) {
        console.error('Error loading users:', error);
        commit('SET_OPERATION_ERROR', error.message);
        dispatch('showNotification', {
          type: 'error',
          message: error.message || 'حدث خطأ في تحميل المستخدمين'
        });
        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async createUser({ commit, dispatch, getters }, userData) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        if (!getters.canManageUsers) {
          throw new Error('ليس لديك صلاحية لإضافة مستخدمين');
        }

        const result = await UserService.createUser(userData);

        if (result.success) {
          // Show success notification
          dispatch('showNotification', {
            type: 'success',
            message: result.message || 'تم إضافة المستخدم بنجاح'
          });

          return { success: true, data: result.data, message: result.message };
        } else {
          throw new Error(result.error || 'فشل في إنشاء المستخدم');
        }
      } catch (error) {
        console.error('Error creating user:', error);
        commit('SET_OPERATION_ERROR', error.message);

        // Show error notification
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
        if (!getters.canManageUsers) {
          throw new Error('ليس لديك صلاحية لتحديث المستخدمين');
        }

        const result = await UserService.updateUser(userId, userData);

        if (result.success) {
          // Show success notification
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

        // Show error notification
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
          // Show success notification
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

        // Show error notification
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
          // Show success notification
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

        // Show error notification
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

    // Subscribe to inventory - UPDATED FOR NEW RULES
    async subscribeToInventory({ commit, state, dispatch }) {
      // Clean up existing subscription first
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

        // Role-based query construction - SIMPLIFIED
        if (state.userProfile.role === 'superadmin') {
          // Superadmin sees all items
          itemsQuery = query(
            itemsRef,
            orderBy('warehouse_id'),
            orderBy('name')
          );
        } else if (state.userProfile.role === 'company_manager' || state.userProfile.role === 'user') {
          // Company managers and regular users see all items (read-only)
          itemsQuery = query(
            itemsRef,
            orderBy('warehouse_id'),
            orderBy('name')
          );
        } else if (state.userProfile.role === 'warehouse_manager') {
          // Warehouse managers see only items in their allowed warehouses
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];

          if (allowedWarehouses.length === 0) {
            // If no warehouses assigned, show empty
            console.log('No warehouses assigned to this warehouse manager');
            commit('SET_INVENTORY', []);
            return;
          }

          // If 'all' is in allowed warehouses, show all items
          if (allowedWarehouses.includes('all')) {
            itemsQuery = query(
              itemsRef,
              orderBy('warehouse_id'),
              orderBy('name')
            );
          } else if (allowedWarehouses.length <= 10) {
            // Use 'in' query if 10 or fewer warehouses (Firestore limit)
            try {
              itemsQuery = query(
                itemsRef,
                where('warehouse_id', 'in', allowedWarehouses),
                orderBy('warehouse_id'),
                orderBy('name')
              );
            } catch (error) {
              // If composite index error, use client-side filtering
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
            // If more than 10 warehouses, use client-side filtering
            console.log('More than 10 warehouses - using client-side filtering');
            itemsQuery = query(
              itemsRef,
              orderBy('warehouse_id'),
              orderBy('name')
            );
          }
        } else {
          // Other roles (if any) - no access
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

          // Apply client-side filtering if needed
          let filteredInventory = inventory;
          if (state.userProfile.role === 'warehouse_manager') {
            const allowedWarehouses = state.userProfile.allowed_warehouses || [];
            if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
              // If we fetched all items (due to >10 warehouses or missing index), filter client-side
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
          
          // Handle specific errors
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
          
          // Set empty inventory array on error
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

    // Subscribe to transactions
    subscribeToTransactions({ commit, state, dispatch }) {
      // Clean up existing subscription first
      if (state.unsubscribeTransactions) {
        state.unsubscribeTransactions();
      }

      if (!state.userProfile) {
        console.log('Cannot subscribe to transactions: User not authenticated');
        return;
      }

      console.log('Subscribing to transactions...');

      try {
        // All authenticated users can read transactions
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
          // Set empty transactions array on error
          commit('SET_TRANSACTIONS', []);
        });

        commit('SET_UNSUBSCRIBE_TRANSACTIONS', unsubscribe);

      } catch (error) {
        console.error('Error setting up transactions subscription:', error);
        commit('SET_TRANSACTIONS', []);
      }
    },

    // Get recent transactions
    async getRecentTransactions({ commit, dispatch, state }) {
      commit('SET_RECENT_TRANSACTIONS_LOADING', true);

      try {
        if (!state.userProfile) {
          console.log('Cannot load recent transactions: User not authenticated');
          return [];
        }

        console.log('Loading recent transactions...');

        // Get transactions from last 24 hours
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

    // Clear operation error
    clearOperationError({ commit }) {
      commit('CLEAR_OPERATION_ERROR');
    },

    // Existing inventory actions with proper notification integration
    async checkExistingItem({ commit, dispatch, state }, { code, color, name, warehouse_id }) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        // Check user permissions
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }
        if (!state.user?.uid) {
          throw new Error('معرف المستخدم غير متوفر');
        }

        // Validate input parameters
        if (!code?.trim() || !color?.trim() || !name?.trim() || !warehouse_id) {
          throw new Error('جميع الحقول المطلوبة للبحث عن الصنف يجب أن تكون مملوءة');
        }

        // Clean the data
        const cleanCode = code.trim();
        const cleanColor = color.trim();
        const cleanName = name.trim();

        console.log('Checking existing item with:', { cleanCode, cleanColor, cleanName, warehouse_id });

        // Check for existing item using InventoryService logic
        const itemsRef = collection(db, 'items');
        const q = query(
          itemsRef, 
          where('warehouse_id', '==', warehouse_id),
          where('code', '==', cleanCode),
          where('color', '==', cleanColor),
          where('name', '==', cleanName)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const existingItemDoc = snapshot.docs[0];
          const existingItem = {
            id: existingItemDoc.id,
            ...existingItemDoc.data()
          };

          console.log('Found existing item:', existingItem.id);
          return {
            exists: true,
            item: InventoryService.convertForDisplay(existingItem)
          };
        }

        console.log('No existing item found');
        return { exists: false };

      } catch (error) {
        console.error('Error checking existing item:', error);
        const errorMessage = error.message || 'حدث خطأ في التحقق من وجود الصنف';
        commit('SET_OPERATION_ERROR', errorMessage);

        // Show error notification
        dispatch('showNotification', {
          type: 'error',
          message: errorMessage
        });

        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async addInventoryItemAtomic({ commit, dispatch, state }, { itemData, userId, isAddingCartons = true }) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        // Check user permissions before adding item
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }
        if (!['superadmin', 'warehouse_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لإضافة أصناف');
        }
        if (!userId) {
          throw new Error('معرف المستخدم غير متوفر');
        }

        // Validate required fields
        const requiredFields = ['name', 'code', 'color', 'warehouse_id'];
        for (const field of requiredFields) {
          if (!itemData[field]?.trim()) {
            throw new Error(`الحقل ${field} مطلوب`);
          }
        }

        // Clean the data
        const cleanedData = {
          name: itemData.name.trim(),
          code: itemData.code.trim(),
          color: itemData.color.trim(),
          warehouse_id: itemData.warehouse_id,
          cartons_count: Number(itemData.cartons_count) || 0,
          per_carton_count: Number(itemData.per_carton_count) || (isAddingCartons ? 12 : 1),
          single_bottles_count: Number(itemData.single_bottles_count) || 0,
          supplier: itemData.supplier?.trim() || '',
          item_location: itemData.item_location?.trim() || '',
          notes: itemData.notes?.trim() || ''
        };

        // Validate warehouse access for warehouse managers
        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (!allowedWarehouses.includes(cleanedData.warehouse_id)) {
            throw new Error('ليس لديك صلاحية لإضافة أصناف في هذا المخزن');
          }
        }

        // Validate quantities based on mode
        if (isAddingCartons) {
          if (cleanedData.cartons_count < 0) {
            throw new Error('عدد الكراتين لا يمكن أن يكون سالباً');
          }
          if (cleanedData.per_carton_count < 1) {
            throw new Error('عدد القطع في الكرتونة يجب أن يكون 1 على الأقل');
          }
        } else {
          if (cleanedData.single_bottles_count < 0) {
            throw new Error('عدد القزاز الفردي لا يمكن أن يكون سالباً');
          }
        }

        console.log('Performing atomic item operation with data:', cleanedData);

        // Perform atomic operation using batch write
        const batch = writeBatch(db);
        const now = new Date();

        // First, check if item exists in the current warehouse
        const itemsRef = collection(db, 'items');
        const q = query(
          itemsRef,
          where('warehouse_id', '==', cleanedData.warehouse_id),
          where('code', '==', cleanedData.code),
          where('color', '==', cleanedData.color),
          where('name', '==', cleanedData.name)
        );

        const snapshot = await getDocs(q);
        let result;

        if (!snapshot.empty) {
          // UPDATE EXISTING ITEM
          const existingItemDoc = snapshot.docs[0];
          const existingItem = existingItemDoc.data();

          console.log('Updating existing item:', existingItemDoc.id);

          const updates = {
            updated_at: now,
            updated_by: userId,
          };

          // Calculate added quantity based on mode
          let addedQuantity = 0;

          if (isAddingCartons) {
            const oldCartons = existingItem.cartons_count || 0;
            const newCartons = cleanedData.cartons_count || 0;
            updates.cartons_count = oldCartons + newCartons;

            // Only update per_carton_count if provided and valid
            if (cleanedData.per_carton_count !== undefined && cleanedData.per_carton_count !== null && cleanedData.per_carton_count >= 1) {
              updates.per_carton_count = cleanedData.per_carton_count;
            } else {
              updates.per_carton_count = existingItem.per_carton_count || 1;
            }

            const perCarton = updates.per_carton_count;
            addedQuantity = newCartons * perCarton;
            updates.single_bottles_count = existingItem.single_bottles_count || 0;
          } else {
            // When adding single bottles
            if (cleanedData.single_bottles_count !== undefined && cleanedData.single_bottles_count !== null) {
              updates.single_bottles_count = (existingItem.single_bottles_count || 0) + cleanedData.single_bottles_count;
              addedQuantity = cleanedData.single_bottles_count;
            } else {
              updates.single_bottles_count = existingItem.single_bottles_count || 0;
            }
            updates.cartons_count = existingItem.cartons_count || 0;
            updates.per_carton_count = existingItem.per_carton_count || 1;
          }

          // Update cumulative added quantity and remaining quantity
          const oldTotalAdded = existingItem.total_added || 0;
          const oldRemaining = existingItem.remaining_quantity || 0;

          updates.total_added = oldTotalAdded + addedQuantity;
          updates.remaining_quantity = oldRemaining + addedQuantity;

          // Update optional fields if provided
          if (cleanedData.notes !== undefined) updates.notes = cleanedData.notes;
          if (cleanedData.supplier !== undefined) updates.supplier = cleanedData.supplier;
          if (cleanedData.item_location !== undefined) updates.item_location = cleanedData.item_location;

          // Validate quantities
          if (updates.remaining_quantity < 0) {
            throw new Error('الكمية المتبقية لا يمكن أن تكون سالبة');
          }

          // Update the item
          const itemRef = doc(db, 'items', existingItemDoc.id);
          batch.update(itemRef, updates);

          // Create transaction record
          const transactionRef = doc(collection(db, 'transactions'));
          batch.set(transactionRef, {
            item_id: existingItemDoc.id,
            from_warehouse: null,
            to_warehouse: cleanedData.warehouse_id,
            type: TRANSACTION_TYPES.ADD,
            cartons_delta: isAddingCartons ? (cleanedData.cartons_count || 0) : 0,
            single_delta: isAddingCartons ? 0 : (cleanedData.single_bottles_count || 0),
            per_carton_updated: cleanedData.per_carton_count,
            previous_remaining: oldRemaining,
            new_remaining: updates.remaining_quantity,
            timestamp: now,
            user_id: userId,
            notes: cleanedData.notes || (isAddingCartons ? 'إضافة كراتين للمخزن' : 'إضافة قزاز فردي للمخزن'),
            created_at: now
          });

          result = { type: 'updated', id: existingItemDoc.id, addedQuantity };

        } else {
          // CREATE NEW ITEM
          console.log('Creating new item');

          // Calculate initial quantities
          const cartonsQty = cleanedData.cartons_count || 0;
          const perCarton = cleanedData.per_carton_count || 1;
          const singleBottles = cleanedData.single_bottles_count || 0;

          const totalAddedQty = (cartonsQty * perCarton) + singleBottles;

          if (totalAddedQty <= 0) {
            throw new Error('يجب إدخال كمية صحيحة');
          }

          const newItem = {
            name: cleanedData.name,
            code: cleanedData.code,
            color: cleanedData.color,
            warehouse_id: cleanedData.warehouse_id,
            cartons_count: cartonsQty,
            per_carton_count: perCarton,
            single_bottles_count: singleBottles,
            total_added: totalAddedQty,
            remaining_quantity: totalAddedQty,
            supplier: cleanedData.supplier,
            item_location: cleanedData.item_location,
            notes: cleanedData.notes,
            created_at: now,
            created_by: userId,
            updated_at: now,
            updated_by: userId
          };

          // Create item
          const itemRef = doc(collection(db, 'items'));
          batch.set(itemRef, newItem);

          // Create transaction record
          const transactionRef = doc(collection(db, 'transactions'));
          batch.set(transactionRef, {
            item_id: itemRef.id,
            from_warehouse: null,
            to_warehouse: cleanedData.warehouse_id,
            type: TRANSACTION_TYPES.ADD,
            cartons_delta: cartonsQty,
            single_delta: singleBottles,
            per_carton_updated: perCarton,
            previous_remaining: 0,
            new_remaining: totalAddedQty,
            timestamp: now,
            user_id: userId,
            notes: cleanedData.notes || 'إنشاء صنف جديد',
            created_at: now
          });

          result = { type: 'created', id: itemRef.id, addedQuantity: totalAddedQty };
        }

        // Commit the batch
        await batch.commit();

        console.log(`Item ${result.type} successfully:`, result.id);

        // Add to recent transactions
        commit('ADD_RECENT_TRANSACTION', {
          type: TRANSACTION_TYPES.ADD,
          item_id: result.id,
          timestamp: now,
          notes: cleanedData.notes || 'عملية إضافة'
        });

        // Show success notification
        dispatch('showNotification', {
          type: 'success',
          message: `تم ${result.type === 'created' ? 'إضافة' : 'تحديث'} الصنف "${cleanedData.name}" بنجاح`
        });

        return result;

      } catch (error) {
        console.error('Error in atomic item operation:', error);
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

    async addInventoryItem({ commit, dispatch, state }, { itemData, isAddingCartons = true }) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');

      try {
        // Check user permissions before adding item
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }
        if (!['superadmin', 'warehouse_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لإضافة أصناف');
        }
        if (!state.user?.uid) {
          throw new Error('معرف المستخدم غير متوفر');
        }

        // Validate required fields before calling InventoryService
        if (!itemData.name?.trim() || !itemData.code?.trim() || !itemData.color?.trim() || !itemData.warehouse_id) {
          throw new Error('جميع الحقول المطلوبة يجب أن تكون مملوءة (الاسم، الكود، اللون، المخزن)');
        }

        // Validate warehouse access for warehouse managers
        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (!allowedWarehouses.includes(itemData.warehouse_id)) {
            throw new Error('ليس لديك صلاحية لإضافة أصناف في هذا المخزن');
          }
        }

        // Validate quantities
        const totalQuantity = InventoryService.calculateTotalQuantity(
          itemData.cartons_count,
          itemData.per_carton_count,
          itemData.single_bottles_count
        );

        if (totalQuantity <= 0) {
          throw new Error('يجب إدخال كمية صحيحة');
        }

        // Clean the data before sending to InventoryService
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

        // Use the InventoryService for adding/updating items
        const result = await InventoryService.addOrUpdateItem(
          cleanedData,
          state.user.uid,
          isAddingCartons
        );

        console.log(`Item ${result.type} successfully:`, result.id);

        // Add to recent transactions
        commit('ADD_RECENT_TRANSACTION', {
          type: TRANSACTION_TYPES.ADD,
          item_id: result.id,
          timestamp: new Date(),
          notes: cleanedData.notes || 'عملية إضافة'
        });

        // Show success notification
        dispatch('showNotification', {
          type: 'success',
          message: `تم ${result.type === 'created' ? 'إضافة' : 'تحديث'} الصنف "${cleanedData.name}" بنجاح`
        });

        return result;

      } catch (error) {
        console.error('Error adding inventory item:', error);
        const errorMessage = error.message || 'حدث خطأ غير متوقع أثناء إضافة الصنف';
        commit('SET_OPERATION_ERROR', errorMessage);

        // Show error notification
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
        // Check user permissions before transfer
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }
        if (!['superadmin', 'warehouse_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لنقل الأصناف');
        }
        if (!state.user?.uid) {
          throw new Error('معرف المستخدم غير متوفر');
        }

        // Validate warehouse access for warehouse managers
        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (!allowedWarehouses.includes(transferData.from_warehouse_id)) {
            throw new Error('ليس لديك صلاحية للنقل من هذا المخزن');
          }
        }

        const result = await InventoryService.transferItem(transferData, state.user.uid);

        console.log('Transfer completed successfully:', result.transferQty);

        // Add to recent transactions
        commit('ADD_RECENT_TRANSACTION', {
          type: TRANSACTION_TYPES.TRANSFER,
          item_id: transferData.itemId,
          timestamp: new Date(),
          notes: 'نقل بين المخازن'
        });

        // Show success notification
        dispatch('showNotification', {
          type: 'success',
          message: 'تم نقل الصنف بنجاح'
        });

        return result;

      } catch (error) {
        console.error('Error transferring item:', error);
        commit('SET_OPERATION_ERROR', error.message);

        // Show error notification
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
        // Check user permissions before dispatch
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        // Check if user has dispatch permission
        const canDispatch = state.userProfile.role === 'superadmin' || 
                           (state.userProfile.role === 'warehouse_manager' && 
                            state.userProfile.permissions?.includes('dispatch_items'));

        if (!canDispatch) {
          throw new Error('ليس لديك صلاحية لصرف الأصناف');
        }

        if (!state.user?.uid) {
          throw new Error('معرف المستخدم غير متوفر');
        }

        // For warehouse managers, check if they can dispatch from this warehouse
        if (state.userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = state.userProfile.allowed_warehouses || [];
          if (!allowedWarehouses.includes(dispatchData.from_warehouse_id)) {
            throw new Error('ليس لديك صلاحية للصرف من هذا المخزن');
          }
        }

        const result = await InventoryService.dispatchItem(dispatchData, state.user.uid);

        console.log('Dispatch completed successfully:', result.dispatchQty);

        // Add to recent transactions
        commit('ADD_RECENT_TRANSACTION', {
          type: TRANSACTION_TYPES.DISPATCH,
          item_id: dispatchData.itemId,
          timestamp: new Date(),
          notes: 'صرف إلى خارجي'
        });

        // Show success notification
        dispatch('showNotification', {
          type: 'success',
          message: 'تم صرف الصنف بنجاح'
        });

        return result;

      } catch (error) {
        console.error('Error dispatching item:', error);
        commit('SET_OPERATION_ERROR', error.message);

        // Show error notification
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

    // Helper function to remove a notification
    removeNotification({ commit }, notificationId) {
      commit('REMOVE_NOTIFICATION', notificationId);
    },

    // Helper function to clear all notifications
    clearNotifications({ commit }) {
      commit('CLEAR_NOTIFICATIONS');
    }
  },
  getters: {
    // Add notifications getter
    notifications: state => state.notifications,

    // Recent transactions getter
    recentTransactions: state => state.recentTransactions,
    recentTransactionsLoading: state => state.recentTransactionsLoading,

    // Composite index status
    requiresCompositeIndex: state => state.requiresCompositeIndex,

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

    canEdit: (state, getters) => {
      return ['superadmin', 'warehouse_manager'].includes(getters.userRole);
    },

    canDelete: (state, getters) => {
      // Check if user has delete permission
      if (getters.userRole === 'superadmin') return true;
      if (getters.userRole === 'warehouse_manager') {
        return getters.userPermissions.includes('full_access') || 
               getters.userPermissions.includes('delete_items');
      }
      return false;
    },

    canManageUsers: state => state.userProfile?.role === 'superadmin',

    canManageWarehouses: state => state.userProfile?.role === 'superadmin',

    // Check if user can dispatch items
    canDispatch: (state, getters) => {
      if (getters.userRole === 'superadmin') return true;
      if (getters.userRole === 'warehouse_manager') {
        return getters.userPermissions.includes('dispatch_items');
      }
      return false;
    },

    mainWarehouse: state => state.warehouses.find(w => w.is_main),

    primaryWarehouses: state => state.warehouses.filter(w => w.type === 'primary'),

    dispatchWarehouses: state => state.warehouses.filter(w => w.type === 'dispatch'),

    // Get warehouses that the current user can access
    accessibleWarehouses: (state, getters) => {
      // If warehouses aren't loaded yet, return empty array
      if (!state.warehousesLoaded) {
        return [];
      }

      // Superadmin should see ALL warehouses (primary and dispatch)
      if (getters.userRole === 'superadmin') {
        return state.warehouses; // Return all warehouses
      }

      // Warehouse managers have access to their assigned warehouses AND dispatch warehouses
      if (getters.userRole === 'warehouse_manager') {
        const allowedWarehouses = getters.allowedWarehouses;
        if (allowedWarehouses && allowedWarehouses.length > 0) {
          // Get primary warehouses they have access to
          const accessiblePrimary = state.warehouses.filter(w => 
            w.type === 'primary' && allowedWarehouses.includes(w.id)
          );

          // Get dispatch warehouses (warehouse managers can dispatch to all dispatch warehouses)
          const accessibleDispatch = state.warehouses.filter(w => w.type === 'dispatch');

          return [...accessiblePrimary, ...accessibleDispatch];
        }
      }

      // Company managers have read-only access to ALL warehouses (from Firestore)
      if (getters.userRole === 'company_manager') {
        return state.warehouses;
      }

      return [];
    },

    // Get primary warehouses only that the user can access
    accessiblePrimaryWarehouses: (state, getters) => {
      const accessible = getters.accessibleWarehouses;
      return accessible.filter(w => w.type === 'primary');
    },

    // Get dispatch warehouses only that the user can access
    accessibleDispatchWarehouses: (state, getters) => {
      const accessible = getters.accessibleWarehouses;
      return accessible.filter(w => w.type === 'dispatch');
    },

    // Get warehouses that the user can dispatch FROM (warehouse managers only from their assigned warehouses)
    dispatchFromWarehouses: (state, getters) => {
      if (!state.warehousesLoaded) {
        return [];
      }

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
          item.supplier?.toLowerCase().includes(searchLower)
        );
      }

      // Apply warehouse filter
      if (state.filters.warehouse) {
        inventory = inventory.filter(item => item.warehouse_id === state.filters.warehouse);
      }

      return inventory;
    },

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

      const recentTransactions = state.recentTransactions.length;

      return {
        totalItems,
        totalQuantity,
        lowStockItems,
        recentTransactions
      };
    },

    // Getter to convert English field names to Arabic for display
    getArabicLabel: (state) => (fieldName) => {
      return state.fieldMappings.englishToArabic[fieldName] || fieldName;
    },

    // Getter to get warehouse Arabic label (now from Firestore data)
    getWarehouseLabel: (state) => (warehouseId) => {
      if (!warehouseId) return '';

      // First try to get from state warehouses
      const warehouse = state.warehouses.find(w => w.id === warehouseId);
      if (warehouse) {
        return warehouse.name_ar || warehouseId;
      }

      // Fallback to old WAREHOUSE_LABELS for compatibility
      return WAREHOUSE_LABELS[warehouseId] || warehouseId;
    },

    // Getter to get destination Arabic label
    getDestinationLabel: () => (destinationId) => {
      return DESTINATION_LABELS[destinationId] || destinationId;
    },

    // Get warehouse by ID
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
    'auth/network-request-failed': 'خطأ في الاتصال بالشبكة. يرجى المحاولة مرة أخرى',
    'auth/too-many-requests': 'محاولات تسجيل دخول كثيرة. يرجى المحاولة لاحقاً',
    'auth/configuration-not-found': 'خطأ في إعدادات النظام. يرجى التواصل مع الدعم الفني'
  };

  return errorMessages[errorCode] || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى';
}