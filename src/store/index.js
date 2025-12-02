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
  runTransaction
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
    fieldMappings: FIELD_MAPPINGS
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
    }
  },
  actions: {
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
            commit('SET_WAREHOUSES_LOADED', false);
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
            permissions: ['full_access', 'manage_inventory', 'create_transfers', 'view_reports', 'delete_items', 'update_items']
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
       
        // Load warehouses after creating profile
        await dispatch('loadWarehouses');
       
      } catch (error) {
        console.error('Error creating user profile:', error);
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
          
          // Load warehouses after login
          await dispatch('loadWarehouses');
          
          // Start data subscriptions
          dispatch('subscribeToInventory');
          dispatch('subscribeToTransactions');
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
        throw new Error(errorMessage);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async logout({ commit }) {
      try {
        await signOut(auth);
        commit('SET_USER', null);
        commit('SET_USER_PROFILE', null);
        commit('SET_INVENTORY', []);
        commit('SET_TRANSACTIONS', []);
        commit('SET_ITEM_HISTORY', []);
        commit('SET_AUTH_ERROR', null);
        commit('SET_OPERATION_ERROR', null);
        commit('SET_WAREHOUSES_LOADED', false);
      } catch (error) {
        console.error('Logout error:', error);
        throw error;
      }
    },
    async loadWarehouses({ commit }) {
      try {
        const warehouses = [
          {
            id: 'main_warehouse',
            name_ar: 'مخزن شارع الشيخ',
            name_en: 'Main Warehouse',
            type: 'primary',
            is_main: true
          },
          {
            id: 'tera_warehouse',
            name_ar: 'مخزن الترعه',
            name_en: 'Teraa Warehouse',
            type: 'primary'
          },
          {
            id: 'shobeen_warehouse',
            name_ar: 'مخزن موقف شبين',
            name_en: 'Shobeen Warehouse',
            type: 'primary'
          },
          {
            id: 'hyper_warehouse',
            name_ar: 'مخزن هايبر التهامي',
            name_en: 'Hyper El Tahamy Warehouse',
            type: 'primary'
          },
          {
            id: 'matbaa_warehouse',
            name_ar: 'مخزن المطبعه',
            name_en: 'Matbaa Warehouse',
            type: 'primary'
          },
          {
            id: 'ghabashi_warehouse',
            name_ar: 'مخزن الغباشي',
            name_en: 'Ghabashi Warehouse',
            type: 'primary'
          },
          {
            id: 'factory',
            name_ar: 'صرف الي مصنع البران',
            name_en: 'Al Bran Factory Dispatch',
            type: 'dispatch'
          },
          {
            id: 'zahra',
            name_ar: 'صرف الي مخزن الزهراء',
            name_en: 'Al Zahra Warehouse Dispatch',
            type: 'dispatch'
          }
        ];
        commit('SET_WAREHOUSES', warehouses);
        commit('SET_WAREHOUSES_LOADED', true);
        console.log('Warehouses loaded:', warehouses.length);
      } catch (error) {
        console.error('Error loading warehouses:', error);
        commit('SET_WAREHOUSES_LOADED', false);
      }
    },
    
    // User Management Actions
    async loadAllUsers({ commit, getters }) {
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
        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async createUser({ commit, getters }, userData) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');
      
      try {
        if (!getters.canManageUsers) {
          throw new Error('ليس لديك صلاحية لإضافة مستخدمين');
        }

        const result = await UserService.createUser(userData);
        
        if (result.success) {
          return { success: true, data: result.data, message: result.message };
        } else {
          throw new Error(result.error || 'فشل في إنشاء المستخدم');
        }
      } catch (error) {
        console.error('Error creating user:', error);
        commit('SET_OPERATION_ERROR', error.message);
        return { success: false, error: error.message };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async updateUser({ commit, getters }, { userId, userData }) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');
      
      try {
        if (!getters.canManageUsers) {
          throw new Error('ليس لديك صلاحية لتحديث المستخدمين');
        }

        const result = await UserService.updateUser(userId, userData);
        
        if (result.success) {
          return { success: true, data: result.data, message: result.message };
        } else {
          throw new Error(result.error || 'فشل في تحديث المستخدم');
        }
      } catch (error) {
        console.error('Error updating user:', error);
        commit('SET_OPERATION_ERROR', error.message);
        return { success: false, error: error.message };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async deleteUser({ commit, getters }, userId) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');
      
      try {
        if (!getters.canManageUsers) {
          throw new Error('ليس لديك صلاحية لحذف المستخدمين');
        }

        const result = await UserService.deleteUser(userId);
        
        if (result.success) {
          return { success: true, message: result.message };
        } else {
          throw new Error(result.error || 'فشل في حذف المستخدم');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        commit('SET_OPERATION_ERROR', error.message);
        return { success: false, error: error.message };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async updateUserStatus({ commit, getters }, { userId, isActive }) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');
      
      try {
        if (!getters.canManageUsers) {
          throw new Error('ليس لديك صلاحية لتغيير حالة المستخدمين');
        }

        const result = await UserService.updateUserStatus(userId, isActive);
        
        if (result.success) {
          return { success: true, message: result.message };
        } else {
          throw new Error(result.error || 'فشل في تغيير حالة المستخدم');
        }
      } catch (error) {
        console.error('Error updating user status:', error);
        commit('SET_OPERATION_ERROR', error.message);
        return { success: false, error: error.message };
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },

    async getUserStats({ commit, getters }) {
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
        throw error;
      }
    },

    // NEW ACTION: checkExistingItem
    async checkExistingItem({ commit, state }, { code, color, name, warehouse_id }) {
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
        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },
    
    // NEW ACTION: addInventoryItemAtomic
    async addInventoryItemAtomic({ commit, state }, { itemData, userId, isAddingCartons = true }) {
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
        return result;
       
      } catch (error) {
        console.error('Error in atomic item operation:', error);
        const errorMessage = error.message || 'حدث خطأ غير متوقع أثناء إضافة الصنف';
        commit('SET_OPERATION_ERROR', errorMessage);
        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },
    
    async addInventoryItem({ commit, state }, { itemData, isAddingCartons = true }) {
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
       
        return result;
       
      } catch (error) {
        console.error('Error adding inventory item:', error);
        const errorMessage = error.message || 'حدث خطأ غير متوقع أثناء إضافة الصنف';
        commit('SET_OPERATION_ERROR', errorMessage);
        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },
    subscribeToInventory({ commit, state }) {
      if (!state.userProfile) {
        console.log('Cannot subscribe to inventory: User not authenticated');
        return;
      }
      
      console.log('Subscribing to inventory...');
      
      try {
        // Simple query - get all items
        const itemsQuery = query(collection(db, 'items'));
        
        return onSnapshot(itemsQuery, (snapshot) => {
          console.log('Inventory snapshot received:', snapshot.size, 'items');
          
          const inventory = snapshot.docs.map(doc => {
            const data = doc.data();
            return InventoryService.convertForDisplay({
              id: doc.id,
              ...data
            });
          });
          
          console.log('Inventory loaded:', inventory.length, 'items');
          commit('SET_INVENTORY', inventory);
          
        }, (error) => {
          console.error('Error in inventory subscription:', error);
          // Don't set operation error for subscription errors
          console.warn('Inventory subscription error:', error.message);
        });
      } catch (error) {
        console.error('Error setting up inventory subscription:', error);
      }
    },
    subscribeToTransactions({ commit, state }) {
      if (!state.userProfile) {
        console.log('Cannot subscribe to transactions: User not authenticated');
        return;
      }
      
      console.log('Subscribing to transactions...');
      
      try {
        // Direct query without test - let it fail gracefully
        const transactionsQuery = query(
          collection(db, 'transactions'),
          orderBy('timestamp', 'desc')
        );
        
        return onSnapshot(transactionsQuery, (snapshot) => {
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
          // Don't set operation error for subscription errors
          console.warn('Transactions subscription error:', error.message);
          // Set empty transactions array on error
          commit('SET_TRANSACTIONS', []);
        });
      } catch (error) {
        console.error('Error setting up transactions subscription:', error);
        commit('SET_TRANSACTIONS', []);
      }
    },
    async transferItem({ commit, state }, transferData) {
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
        
        const result = await InventoryService.transferItem(transferData, state.user.uid);
       
        console.log('Transfer completed successfully:', result.transferQty);
       
        return result;
       
      } catch (error) {
        console.error('Error transferring item:', error);
        commit('SET_OPERATION_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },
    async dispatchItem({ commit, state }, dispatchData) {
      commit('SET_OPERATION_LOADING', true);
      commit('CLEAR_OPERATION_ERROR');
     
      try {
        // Check user permissions before dispatch
        if (!state.userProfile) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }
        if (!['superadmin', 'warehouse_manager'].includes(state.userProfile.role)) {
          throw new Error('ليس لديك صلاحية لصرف الأصناف');
        }
        if (!state.user?.uid) {
          throw new Error('معرف المستخدم غير متوفر');
        }
        
        const result = await InventoryService.dispatchItem(dispatchData, state.user.uid);
       
        console.log('Dispatch completed successfully:', result.dispatchQty);
       
        return result;
       
      } catch (error) {
        console.error('Error dispatching item:', error);
        commit('SET_OPERATION_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_OPERATION_LOADING', false);
      }
    },
    updateFilters({ commit }, filters) {
      commit('SET_FILTERS', filters);
    },
    clearOperationError({ commit }) {
      commit('CLEAR_OPERATION_ERROR');
    }
  },
  getters: {
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
      
      // Warehouse managers and company managers have access to their assigned warehouses
      if (['warehouse_manager', 'company_manager'].includes(getters.userRole)) {
        const allowedWarehouses = getters.allowedWarehouses;
        if (allowedWarehouses && allowedWarehouses.length > 0) {
          return state.warehouses.filter(w => allowedWarehouses.includes(w.id));
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
     
      const recentTransactions = state.transactions
        .filter(t => {
          if (!t.timestamp) return false;
          const timestamp = t.timestamp.toDate ? t.timestamp.toDate() : new Date(t.timestamp);
          return timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000);
        })
        .length;
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
    
    // Getter to get warehouse Arabic label
    getWarehouseLabel: () => (warehouseId) => {
      return WAREHOUSE_LABELS[warehouseId] || warehouseId;
    },
    
    // Getter to get destination Arabic label
    getDestinationLabel: () => (destinationId) => {
      return DESTINATION_LABELS[destinationId] || destinationId;
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