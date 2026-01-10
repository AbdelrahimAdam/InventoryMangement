import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  writeBatch,
  runTransaction,
  increment,
  serverTimestamp,
  Timestamp,
  deleteDoc,
  limit,
  startAfter
} from 'firebase/firestore';
import { db } from '@/firebase/config';

// Field mapping constants for UI - MATCHING STORE FIELDS
export const FIELD_LABELS = {
  name: 'الاسم',
  code: 'الكود', 
  color: 'اللون',
  cartons_count: 'عدد الكراتين',
  per_carton_count: 'عدد في الكرتونة',
  single_bottles_count: 'عدد القزاز الفردي',
  total_added: 'الكميه المضافه',
  remaining_quantity: 'الكميه المتبقيه',
  warehouse_id: 'المخزن',
  supplier: 'المورد',
  item_location: 'مكان الصنف',
  created_at: 'تاريخ الإنشاء',
  updated_at: 'تاريخ التحديث',
  created_by: 'تم الإنشاء بواسطة',
  updated_by: 'تم التحديث بواسطة',
  notes: 'ملاحظات',
  photo_url: 'صورة الصنف',
  category: 'الفئة',
  subcategory: 'الفئة الفرعية',
  brand: 'العلامة التجارية',
  barcode: 'الباركود',
  sku: 'رمز SKU'
};

// Warehouses from store
export const WAREHOUSES = {
  MAIN: 'main_warehouse',
  TERAA: 'tera_warehouse',
  SHOBEEN: 'shobeen_warehouse', 
  HYPER: 'hyper_warehouse'
};

// Warehouse labels from store
export const WAREHOUSE_LABELS = {
  main_warehouse: 'مخزن شارع الشيخ',
  tera_warehouse: 'مخزن الترعه',
  shobeen_warehouse: 'مخزن موقف شبين',
  hyper_warehouse: 'مخزن هايبر التهامي',
  matbaa_warehouse: 'مخزن المطبعه',
  ghabashi_warehouse: 'مخزن الغباشي'
};

// Destinations from store
export const DESTINATIONS = {
  FACTORY: 'factory',
  ZAHRA: 'zahra',
  SALE: 'sale',
  RETURN: 'return',
  DAMAGED: 'damaged'
};

export const DESTINATION_LABELS = {
  factory: 'صرف الي مصنع البران',
  zahra: 'صرف الي مخزن الزهراء',
  sale: 'مبيعات',
  return: 'مرتجعات',
  damaged: 'إتلاف'
};

// Transaction types matching store
export const TRANSACTION_TYPES = {
  ADD: 'ADD',
  TRANSFER: 'TRANSFER',
  DISPATCH: 'DISPATCH',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  INVOICE: 'INVOICE'
};

// Error messages in Arabic matching store
const ERROR_MESSAGES = {
  ITEM_NOT_FOUND: 'الصنف غير موجود',
  WRONG_WAREHOUSE: 'الصنف ليس في المخزن المحدد',
  INSUFFICIENT_QUANTITY: 'الكمية المطلوبة غير متوفرة',
  UNAUTHORIZED: 'ليس لديك صلاحية للقيام بهذا الإجراء',
  NETWORK_ERROR: 'خطأ في الاتصال بالشبكة',
  UNKNOWN_ERROR: 'حدث خطأ غير متوقع',
  INVALID_DATA: 'بيانات غير صحيحة',
  INVALID_PHONE: 'رقم الهاتف غير صحيح'
};

// Categories from store
export const CATEGORIES = {
  BEVERAGES: 'beverages',
  FOOD: 'food',
  SNACKS: 'snacks',
  HOUSEHOLD: 'household',
  PERSONAL_CARE: 'personal_care'
};

export const CATEGORY_LABELS = {
  beverages: 'مشروبات',
  food: 'مواد غذائية',
  snacks: 'سناكس',
  household: 'منظفات ومنتجات منزلية',
  personal_care: 'العناية الشخصية'
};

// Performance configuration
const PERFORMANCE_CONFIG = {
  INITIAL_LOAD: 50,
  SCROLL_LOAD: 20,
  SEARCH_LIMIT: 25,
  SEARCH_DEBOUNCE: 300,
  MIN_SEARCH_CHARS: 2
};

// Arabic text normalization (SAME AS STORE)
function normalizeArabicText(text) {
  if (!text || typeof text !== 'string') return '';
  
  text = String(text).trim();
  text = text.normalize('NFC');
  
  const diacriticsRegex = /[\u064B-\u065F\u0670\u0640\u0652\u0651\u064E\u064F\u064D\u0650\u0657\u0656\u0653\u0654\u0655]/g;
  text = text.replace(diacriticsRegex, '');
  
  const arabicNormalizationMap = {
    'إ': 'ا', 'أ': 'ا', 'آ': 'ا', 'ٱ': 'ا', 'ٲ': 'ا', 'ٳ': 'ا',
    'ى': 'ي', 'ئ': 'ي', 'ۍ': 'ي', 'ێ': 'ي', 'ې': 'ي', 'ۑ': 'ي',
    'ة': 'ه',
    'ؤ': 'و', 'ۄ': 'و', 'ۅ': 'و', 'ۆ': 'و', 'ۇ': 'و', 'ۈ': 'و', 'ۉ': 'و', 'ۊ': 'و', 'ۋ': 'و',
    'ك': 'ك', 'ڪ': 'ك', 'ګ': 'ك', 'ڬ': 'ك', 'ڭ': 'ك', 'ڮ': 'ك',
    'ء': '', 'ٔ': '', 'ٕ': '', 'ٖ': '', 'ٗ': '',
    'ـ': '',
    'گ': 'ك', 'چ': 'ج', 'پ': 'ب', 'ژ': 'ز'
  };
  
  Object.keys(arabicNormalizationMap).forEach(key => {
    const regex = new RegExp(key, 'g');
    text = text.replace(regex, arabicNormalizationMap[key]);
  });
  
  text = text.replace(/[^\u0621-\u064A\u0660-\u0669\u0671-\u06D3\s0-9]/g, '');
  text = text.replace(/\s+/g, ' ').trim().toLowerCase();
  
  return text;
}

export class InventoryService {
  /**
   * ADD OR UPDATE ITEM WITH STORE BUSINESS LOGIC
   * This matches the store's addInventoryItem action logic
   */
  static async addOrUpdateItem(itemData, userId, userProfile, isAddingCartons = true, photoUrl = null) {
    try {
      console.log('🔄 addOrUpdateItem with store business logic:', {
        name: itemData.name,
        code: itemData.code,
        color: itemData.color,
        warehouse_id: itemData.warehouse_id,
        userId,
        userRole: userProfile?.role
      });

      // Validation 1: User authentication
      if (!userProfile) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }
      
      if (!['superadmin', 'warehouse_manager'].includes(userProfile.role)) {
        throw new Error('ليس لديك صلاحية لإضافة/تعديل أصناف');
      }

      // Validation 2: Required fields
      if (!itemData.name?.trim() || !itemData.code?.trim() || !itemData.warehouse_id || !itemData.color?.trim()) {
        throw new Error('جميع الحقول المطلوبة يجب أن تكون مملوءة (الاسم، الكود، اللون، المخزن)');
      }

      // Validation 3: Warehouse access
      const warehouseId = itemData.warehouse_id;
      if (userProfile.role === 'warehouse_manager') {
        const allowedWarehouses = userProfile.allowed_warehouses || [];
        if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
          if (!allowedWarehouses.includes(warehouseId)) {
            throw new Error('ليس لديك صلاحية لإضافة/تعديل أصناف في هذا المخزن');
          }
        }
      }

      // Clean data
      const cleanedData = {
        name: itemData.name.trim(),
        code: itemData.code.trim(),
        color: itemData.color.trim(),
        warehouse_id: warehouseId,
        supplier: itemData.supplier?.trim() || '',
        item_location: itemData.item_location?.trim() || '',
        notes: itemData.notes?.trim() || '',
        photo_url: photoUrl || itemData.photo_url || null
      };

      // Check for existing item (same as store logic)
      console.log('🔍 Checking for existing item with same name+code+color+warehouse...');
      
      let existingItem = null;
      let existingItemId = null;
      
      try {
        const itemsRef = collection(db, 'items');
        const q = query(
          itemsRef,
          where('name', '==', cleanedData.name),
          where('code', '==', cleanedData.code),
          where('color', '==', cleanedData.color),
          where('warehouse_id', '==', cleanedData.warehouse_id),
          limit(1)
        );
        
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          existingItem = snapshot.docs[0].data();
          existingItemId = snapshot.docs[0].id;
          console.log('✅ Found existing item:', {
            id: existingItemId,
            name: existingItem.name,
            code: existingItem.code,
            color: existingItem.color
          });
        } else {
          console.log('📭 No existing item found');
        }
      } catch (error) {
        console.error('❌ Error checking existing item:', error);
      }

      if (existingItem && existingItemId) {
        // UPDATE EXISTING ITEM (store business logic)
        return await this._updateExistingItemStoreLogic(
          existingItemId, 
          existingItem, 
          cleanedData, 
          userId, 
          userProfile, 
          isAddingCartons, 
          itemData
        );
      } else {
        // CREATE NEW ITEM (store business logic)
        return await this._createNewItemStoreLogic(cleanedData, userId, userProfile, itemData);
      }

    } catch (error) {
      console.error('❌ Error in addOrUpdateItem:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Update existing item with STORE BUSINESS LOGIC
   */
  static async _updateExistingItemStoreLogic(itemId, existingItem, cleanedData, userId, userProfile, isAddingCartons, itemData) {
    console.log('🔄 UPDATING existing item with ID:', itemId);
    
    // Get the item reference
    const itemRef = doc(db, 'items', itemId);
    
    // BUSINESS RULE 1: عدد الكراتين - OLD + NEW (only if adding cartons)
    const newCartonsCount = Number(itemData.cartons_count) || 0;
    const currentCartonsCount = Number(existingItem.cartons_count) || 0;
    let finalCartonsCount = currentCartonsCount;
    
    if (isAddingCartons && newCartonsCount > 0) {
      finalCartonsCount = currentCartonsCount + newCartonsCount;
      console.log(`➕ عدد الكراتين: ${currentCartonsCount} + ${newCartonsCount} = ${finalCartonsCount}`);
    }
    
    // BUSINESS RULE 2: عدد في الكرتونه - REPLACE OLD WITH NEW (only if user provides)
    const currentPerCarton = Number(existingItem.per_carton_count) || 12;
    const newPerCartonCount = Number(itemData.per_carton_count) || 0;
    let finalPerCartonCount = currentPerCarton;
    
    if (newPerCartonCount > 0) {
      finalPerCartonCount = newPerCartonCount;
      console.log(`🔄 عدد في الكرتونه: ${currentPerCarton} → ${newPerCartonCount}`);
    }
    
    // BUSINESS RULE 3: عدد القزاز الفردي - REPLACE OLD WITH NEW (user enters new total)
    const currentSingleBottlesCount = Number(existingItem.single_bottles_count) || 0;
    const newSingleBottlesCount = Number(itemData.single_bottles_count) || 0;
    let finalSingleBottlesCount = currentSingleBottlesCount;
    
    // If user provided a value (including zero), replace the old value
    if (itemData.single_bottles_count !== undefined) {
      finalSingleBottlesCount = newSingleBottlesCount;
      console.log(`🔄 عدد القزاز الفردي: ${currentSingleBottlesCount} → ${newSingleBottlesCount}`);
    }
    
    // BUSINESS RULE 4: Convert single bottles to cartons if they complete a full carton
    let additionalCartonsFromSingles = 0;
    if (finalSingleBottlesCount >= finalPerCartonCount) {
      additionalCartonsFromSingles = Math.floor(finalSingleBottlesCount / finalPerCartonCount);
      finalSingleBottlesCount = finalSingleBottlesCount % finalPerCartonCount;
      finalCartonsCount += additionalCartonsFromSingles;
      
      console.log(`🔄 Converting single bottles to cartons: added ${additionalCartonsFromSingles} cartons, remaining singles: ${finalSingleBottlesCount}`);
    }
    
    // BUSINESS RULE 5: Calculate quantities
    const currentRemaining = Number(existingItem.remaining_quantity) || 0;
    const currentTotalAdded = Number(existingItem.total_added) || 0;
    
    // Calculate quantity from NEW cartons only (not from conversion)
    const oldCartonsQuantity = currentCartonsCount * currentPerCarton;
    const newCartonsQuantity = finalCartonsCount * finalPerCartonCount;
    const cartonsQuantityAdded = Math.max(0, newCartonsQuantity - oldCartonsQuantity);
    
    // Calculate new totals
    const newTotalQuantity = (finalCartonsCount * finalPerCartonCount) + finalSingleBottlesCount;
    const newTotalAdded = currentTotalAdded + cartonsQuantityAdded; // Only add carton increases
    
    console.log('📊 BUSINESS LOGIC RESULTS:', {
      finalCartons: finalCartonsCount,
      finalPerCarton: finalPerCartonCount,
      finalSingle: finalSingleBottlesCount,
      newRemaining: newTotalQuantity,
      cartonsQuantityAdded,
      newTotalAdded: newTotalAdded
    });
    
    // Prepare update data
    const updateData = {
      cartons_count: finalCartonsCount,
      per_carton_count: finalPerCartonCount,
      single_bottles_count: finalSingleBottlesCount,
      remaining_quantity: newTotalQuantity,
      updated_at: serverTimestamp(),
      updated_by: userId
    };
    
    // Only update total_added if carton quantity was added
    if (cartonsQuantityAdded > 0) {
      updateData.total_added = newTotalAdded;
    }
    
    // Update optional fields if provided
    if (itemData.supplier !== undefined) {
      updateData.supplier = itemData.supplier?.trim() || null;
    }
    
    if (itemData.item_location !== undefined) {
      updateData.item_location = itemData.item_location?.trim() || null;
    }
    
    if (itemData.notes !== undefined) {
      updateData.notes = itemData.notes?.trim() || null;
    }
    
    if (itemData.photo_url !== undefined) {
      updateData.photo_url = itemData.photo_url;
    }
    
    // CRITICAL: Preserve original matching fields
    updateData.name = cleanedData.name;
    updateData.code = cleanedData.code;
    updateData.color = cleanedData.color;
    updateData.warehouse_id = cleanedData.warehouse_id;
    updateData.created_by = existingItem.created_by || userId;
    
    console.log('💾 Update data for existing item:', updateData);
    
    // Update the item in Firestore
    await updateDoc(itemRef, updateData);
    
    // Create transaction record if quantity was added
    if (cartonsQuantityAdded > 0) {
      const transactionData = {
        type: 'ADD',
        item_id: itemId,
        item_name: cleanedData.name,
        item_code: cleanedData.code,
        from_warehouse: null,
        to_warehouse: warehouseId,
        cartons_delta: newCartonsCount,
        per_carton_updated: finalPerCartonCount,
        single_delta: newSingleBottlesCount - currentSingleBottlesCount,
        total_delta: cartonsQuantityAdded,
        new_remaining: newTotalQuantity,
        user_id: userId,
        timestamp: serverTimestamp(),
        notes: itemData.notes || `إضافة كميات: ${newCartonsCount} كراتين`,
        created_by: userProfile?.name || 'نظام'
      };
      
      await addDoc(collection(db, 'transactions'), transactionData);
    }
    
    // Create item history record
    const itemHistoryData = {
      item_id: itemId,
      warehouse_id: cleanedData.warehouse_id,
      change_type: 'UPDATE',
      old_quantity: currentRemaining,
      new_quantity: newTotalQuantity,
      quantity_delta: cartonsQuantityAdded,
      user_id: userId,
      timestamp: serverTimestamp(),
      details: {
        name: cleanedData.name,
        code: cleanedData.code,
        color: cleanedData.color,
        old_cartons: currentCartonsCount,
        new_cartons: finalCartonsCount,
        old_per_carton: currentPerCarton,
        new_per_carton: finalPerCartonCount,
        old_single: currentSingleBottlesCount,
        new_single: finalSingleBottlesCount,
        single_bottles_converted_to_cartons: additionalCartonsFromSingles,
        cartons_added: newCartonsCount,
        cartons_quantity_added: cartonsQuantityAdded,
        notes: itemData.notes
      }
    };
    
    await addDoc(collection(db, 'item_history'), itemHistoryData);
    
    // Create complete updated item
    const updatedItem = {
      id: itemId,
      ...existingItem,
      ...updateData,
      cartons_count: finalCartonsCount,
      per_carton_count: finalPerCartonCount,
      single_bottles_count: finalSingleBottlesCount,
      remaining_quantity: newTotalQuantity,
      total_added: newTotalAdded,
      updated_at: updateData.updated_at
    };
    
    return {
      success: true,
      type: 'updated',
      item: updatedItem,
      cartonsAdded: cartonsQuantityAdded,
      newRemaining: newTotalQuantity,
      convertedCartons: additionalCartonsFromSingles,
      message: `تم تحديث الصنف "${cleanedData.name}" بنجاح`
    };
  }

  /**
   * Create new item with STORE BUSINESS LOGIC
   */
  static async _createNewItemStoreLogic(cleanedData, userId, userProfile, itemData) {
    console.log('➕ CREATING new item (no matching name+code+color found)');
    
    // Calculate quantities for new item
    const cartonsCount = Number(itemData.cartons_count) || 0;
    const perCartonCount = Number(itemData.per_carton_count) || 12;
    const singleBottlesCount = Number(itemData.single_bottles_count) || 0;
    
    // Convert single bottles to cartons if complete
    let finalCartonsCount = cartonsCount;
    let finalSingleBottlesCount = singleBottlesCount;
    let additionalCartonsFromSingles = 0;
    
    if (singleBottlesCount >= perCartonCount) {
      additionalCartonsFromSingles = Math.floor(singleBottlesCount / perCartonCount);
      finalSingleBottlesCount = singleBottlesCount % perCartonCount;
      finalCartonsCount += additionalCartonsFromSingles;
      
      console.log(`🔄 Converting single bottles for new item: ${singleBottlesCount} → ${additionalCartonsFromSingles} cartons + ${finalSingleBottlesCount} singles`);
    }
    
    // Calculate total quantity
    const totalQuantity = (finalCartonsCount * perCartonCount) + finalSingleBottlesCount;
    
    if (totalQuantity <= 0) {
      throw new Error('يجب إدخال كمية صحيحة للإضافة (أكبر من صفر)');
    }
    
    // Prepare data for new item
    const newItemData = {
      name: cleanedData.name,
      code: cleanedData.code,
      color: cleanedData.color,
      warehouse_id: cleanedData.warehouse_id,
      cartons_count: finalCartonsCount,
      per_carton_count: perCartonCount,
      single_bottles_count: finalSingleBottlesCount,
      supplier: cleanedData.supplier || null,
      item_location: cleanedData.item_location || null,
      notes: cleanedData.notes || null,
      photo_url: cleanedData.photo_url || null,
      remaining_quantity: totalQuantity,
      total_added: totalQuantity,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      created_by: userId,
      updated_by: userId
    };
    
    console.log('💾 New item data:', newItemData);
    
    // Add new item to Firestore
    const docRef = await addDoc(collection(db, 'items'), newItemData);
    
    // Create transaction record
    const transactionData = {
      type: 'ADD',
      item_id: docRef.id,
      item_name: cleanedData.name,
      item_code: cleanedData.code,
      from_warehouse: null,
      to_warehouse: cleanedData.warehouse_id,
      cartons_delta: finalCartonsCount,
      per_carton_updated: perCartonCount,
      single_delta: finalSingleBottlesCount,
      total_delta: totalQuantity,
      new_remaining: totalQuantity,
      user_id: userId,
      timestamp: serverTimestamp(),
      notes: additionalCartonsFromSingles > 0 ? 
        `إضافة جديدة (تحويل ${additionalCartonsFromSingles} كرتون من القزاز الفردي)` : 
        'عملية إضافة جديدة',
      created_by: userProfile?.name || 'نظام'
    };
    
    await addDoc(collection(db, 'transactions'), transactionData);
    
    // Create complete new item
    const newItem = {
      id: docRef.id,
      ...newItemData
    };
    
    return { 
      success: true,
      type: 'created',
      id: docRef.id, 
      item: newItem,
      convertedCartons: additionalCartonsFromSingles,
      message: additionalCartonsFromSingles > 0 ? 
        `تم إضافة صنف جديد ${cleanedData.name} مع تحويل ${additionalCartonsFromSingles} كرتون من القزاز الفردي` :
        `تم إضافة صنف جديد ${cleanedData.name}`
    };
  }

  /**
   * DISPATCH ITEM WITH STORE BUSINESS LOGIC (Atomic Transaction)
   */
  static async dispatchItem(dispatchData, userId, userProfile) {
    try {
      console.log('🚀 Starting atomic dispatch operation:', dispatchData);

      if (!userProfile) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      if (!['superadmin', 'warehouse_manager'].includes(userProfile.role)) {
        throw new Error('ليس لديك صلاحية لصرف الأصناف');
      }

      // Validate required fields
      const requiredFields = [
        { field: dispatchData.item_id, name: 'معرف الصنف' },
        { field: dispatchData.from_warehouse_id, name: 'المخزن المصدر' },
        { field: dispatchData.destination, name: 'الوجهة' }
      ];

      const missingFields = requiredFields.filter(f => !f.field);
      if (missingFields.length > 0) {
        throw new Error(`بيانات الصرف غير مكتملة: ${missingFields.map(f => f.name).join('، ')}`);
      }

      // Validate user has access to source warehouse
      if (userProfile.role === 'warehouse_manager') {
        const allowedWarehouses = userProfile.allowed_warehouses || [];
        if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
          if (!allowedWarehouses.includes(dispatchData.from_warehouse_id)) {
            throw new Error('ليس لديك صلاحية للصرف من هذا المخزن');
          }
        }
      }

      // Atomic Transaction
      const result = await runTransaction(db, async (transaction) => {
        // Get item document WITHIN transaction
        const itemRef = doc(db, 'items', dispatchData.item_id);
        const itemDoc = await transaction.get(itemRef);
        
        if (!itemDoc.exists()) {
          throw new Error('الصنف غير موجود');
        }

        const itemData = itemDoc.data();

        // Validate item is in the correct warehouse
        if (itemData.warehouse_id !== dispatchData.from_warehouse_id) {
          throw new Error('الصنف ليس في المخزن المصدر المحدد');
        }

        // Calculate dispatch quantity
        let dispatchQuantity = 0;
        
        if (dispatchData.quantity !== undefined && dispatchData.quantity !== null) {
          dispatchQuantity = Number(dispatchData.quantity);
        } else {
          const cartons = Number(dispatchData.cartons_count) || 0;
          const perCarton = Number(dispatchData.per_carton_count) || 12;
          const singleBottles = Number(dispatchData.single_bottles_count) || 0;
          
          dispatchQuantity = (cartons * perCarton) + singleBottles;
        }

        if (dispatchQuantity <= 0) {
          throw new Error('يجب إدخال كمية صحيحة للصرف (أكبر من صفر)');
        }

        // Get current quantity WITHIN transaction
        let currentQuantity = 0;
        if (itemData.remaining_quantity !== undefined && itemData.remaining_quantity !== null) {
          currentQuantity = Number(itemData.remaining_quantity);
        } else {
          const cartons = Number(itemData.cartons_count) || 0;
          const perCarton = Number(itemData.per_carton_count) || 12;
          const singleBottles = Number(itemData.single_bottles_count) || 0;
          
          currentQuantity = (cartons * perCarton) + singleBottles;
        }

        // Validate sufficient quantity
        if (dispatchQuantity > currentQuantity) {
          throw new Error(
            `الكمية المطلوبة للصرف (${dispatchQuantity}) أكبر من الكمية المتاحة (${currentQuantity})`
          );
        }

        const newQuantity = currentQuantity - dispatchQuantity;
        
        // Final safety check
        if (newQuantity < 0) {
          throw new Error(`حساب الكمية غير صحيح. الكمية الجديدة ستكون سالبة: ${newQuantity}`);
        }

        // Update item WITHIN transaction
        const updateData = {
          updated_at: serverTimestamp(),
          updated_by: userId
        };

        if (itemData.remaining_quantity !== undefined && itemData.remaining_quantity !== null) {
          transaction.update(itemRef, {
            remaining_quantity: newQuantity,
            ...updateData
          });
        } else {
          const perCarton = Number(itemData.per_carton_count) || 12;
          const newCartons = Math.floor(newQuantity / perCarton);
          const newSingles = newQuantity % perCarton;

          transaction.update(itemRef, {
            cartons_count: newCartons,
            single_bottles_count: newSingles,
            ...updateData
          });
        }

        // Create transaction record WITHIN transaction
        const transactionRef = doc(collection(db, 'transactions'));
        const transactionData = {
          type: TRANSACTION_TYPES.DISPATCH,
          item_id: dispatchData.item_id,
          item_name: itemData.name || dispatchData.item_name,
          item_code: itemData.code || dispatchData.item_code,
          color: itemData.color || '',
          from_warehouse: dispatchData.from_warehouse_id,
          destination: dispatchData.destination,
          destination_id: dispatchData.destination_id,
          cartons_count: dispatchData.cartons_count || 0,
          per_carton_count: dispatchData.per_carton_count || 12,
          single_bottles_count: dispatchData.single_bottles_count || 0,
          quantity: dispatchQuantity,
          previous_quantity: currentQuantity,
          new_quantity: newQuantity,
          user_id: userId,
          user_name: userProfile?.name,
          user_role: userProfile?.role,
          user_email: userProfile?.email,
          timestamp: serverTimestamp(),
          notes: dispatchData.notes || 'صرف إلى فرع',
          priority: dispatchData.priority || 'normal',
          from_warehouse_name: dispatchData.from_warehouse_name,
          status: 'completed',
          created_by: userProfile?.name || 'نظام',
          atomic_operation: true,
          transaction_timestamp: serverTimestamp()
        };
        transaction.set(transactionRef, transactionData);

        // Create item history WITHIN transaction
        const historyRef = doc(collection(db, 'item_history'));
        const historyData = {
          item_id: dispatchData.item_id,
          warehouse_id: dispatchData.from_warehouse_id,
          change_type: 'DISPATCH',
          old_quantity: currentQuantity,
          new_quantity: newQuantity,
          quantity_delta: -dispatchQuantity,
          user_id: userId,
          user_name: userProfile?.name,
          timestamp: serverTimestamp(),
          details: {
            name: itemData.name,
            code: itemData.code,
            color: itemData.color,
            destination: dispatchData.destination,
            notes: dispatchData.notes,
            priority: dispatchData.priority,
            transaction_id: transactionRef.id,
            was_atomic: true
          }
        };
        transaction.set(historyRef, historyData);

        // Return data for caller
        return {
          itemData,
          transactionData,
          transactionId: transactionRef.id,
          dispatchQuantity,
          newQuantity
        };
      });

      return { 
        success: true, 
        item: {
          id: dispatchData.item_id,
          ...result.itemData,
          remaining_quantity: result.newQuantity,
          updated_at: new Date()
        },
        transactionId: result.transactionId,
        dispatchQuantity: result.dispatchQuantity,
        remainingQuantity: result.newQuantity
      };

    } catch (error) {
      console.error('❌ Error in atomic dispatch:', error);
      
      // Handle specific transaction errors
      if (error.code === 'failed-precondition') {
        error.message = 'فشل العملية بسبب تعارض في البيانات. يرجى المحاولة مرة أخرى.';
      } else if (error.code === 'already-exists') {
        error.message = 'هذه العملية تم تنفيذها بالفعل.';
      } else if (error.code === 'aborted') {
        error.message = 'تم إلغاء العملية. يرجى المحاولة مرة أخرى.';
      }

      throw this._handleError(error);
    }
  }

  /**
   * TRANSFER ITEM WITH STORE BUSINESS LOGIC
   */
  static async transferItem(transferData, userId, userProfile) {
    try {
      console.log('🚚 Transferring item:', transferData);

      if (!userProfile) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      if (!['superadmin', 'warehouse_manager'].includes(userProfile.role)) {
        throw new Error('ليس لديك صلاحية لنقل الأصناف');
      }

      if (!transferData.item_id || !transferData.from_warehouse_id || !transferData.to_warehouse_id) {
        throw new Error('بيانات النقل غير مكتملة');
      }

      if (transferData.from_warehouse_id === transferData.to_warehouse_id) {
        throw new Error('لا يمكن نقل الصنف إلى نفس المخزن');
      }

      // Validate user has access to both warehouses
      if (userProfile.role === 'warehouse_manager') {
        const allowedWarehouses = userProfile.allowed_warehouses || [];
        if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
          if (!allowedWarehouses.includes(transferData.from_warehouse_id) ||
              !allowedWarehouses.includes(transferData.to_warehouse_id)) {
            throw new Error('ليس لديك صلاحية للنقل من/إلى هذه المخازن');
          }
        }
      }

      return await runTransaction(db, async (transaction) => {
        // Get source item
        const sourceItemRef = doc(db, 'items', transferData.item_id);
        const sourceDoc = await transaction.get(sourceItemRef);
        
        if (!sourceDoc.exists()) {
          throw new Error('الصنف غير موجود');
        }

        const sourceItem = sourceDoc.data();

        // Validate source warehouse
        if (sourceItem.warehouse_id !== transferData.from_warehouse_id) {
          throw new Error('الصنف ليس في المخزن المصدر المحدد');
        }

        // Calculate transfer quantity
        const cartons = Number(transferData.cartons_count) || 0;
        const perCarton = Number(transferData.per_carton_count) || 12;
        const singleBottles = Number(transferData.single_bottles_count) || 0;
        const transferQuantity = (cartons * perCarton) + singleBottles;

        if (transferQuantity <= 0) {
          throw new Error('يجب إدخال كمية صحيحة للنقل');
        }

        // Check available quantity
        const availableQuantity = sourceItem.remaining_quantity || 0;
        if (transferQuantity > availableQuantity) {
          throw new Error('الكمية المطلوبة للنقل أكبر من الكمية المتاحة');
        }

        const newSourceQuantity = availableQuantity - transferQuantity;

        // Update source item
        transaction.update(sourceItemRef, {
          remaining_quantity: newSourceQuantity,
          updated_at: serverTimestamp(),
          updated_by: userId
        });

        // Find or create destination item
        const itemsRef = collection(db, 'items');
        const destQuery = query(
          itemsRef,
          where('warehouse_id', '==', transferData.to_warehouse_id),
          where('name', '==', sourceItem.name),
          where('code', '==', sourceItem.code),
          where('color', '==', sourceItem.color)
        );
        
        const destSnapshot = await getDocs(destQuery);
        
        if (!destSnapshot.empty) {
          // Update existing destination item
          const destItem = destSnapshot.docs[0];
          const destData = destItem.data();
          
          const newDestQuantity = (destData.remaining_quantity || 0) + transferQuantity;
          const newDestCartons = (destData.cartons_count || 0) + cartons;
          const newDestSingles = (destData.single_bottles_count || 0) + singleBottles;
          
          const destRef = doc(db, 'items', destItem.id);
          transaction.update(destRef, {
            remaining_quantity: newDestQuantity,
            cartons_count: newDestCartons,
            single_bottles_count: newDestSingles,
            total_added: (destData.total_added || 0) + transferQuantity,
            updated_at: serverTimestamp(),
            updated_by: userId
          });
          
        } else {
          // Create new destination item
          const newDestItem = {
            name: sourceItem.name,
            code: sourceItem.code,
            color: sourceItem.color,
            warehouse_id: transferData.to_warehouse_id,
            cartons_count: cartons,
            per_carton_count: perCarton,
            single_bottles_count: singleBottles,
            remaining_quantity: transferQuantity,
            total_added: transferQuantity,
            supplier: sourceItem.supplier || '',
            item_location: sourceItem.item_location || '',
            notes: sourceItem.notes || '',
            photo_url: sourceItem.photo_url || null,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            created_by: userId,
            updated_by: userId
          };
          
          const destRef = doc(collection(db, 'items'));
          transaction.set(destRef, newDestItem);
        }

        // Create transaction record
        const transactionRef = doc(collection(db, 'transactions'));
        const transactionData = {
          type: TRANSACTION_TYPES.TRANSFER,
          item_id: transferData.item_id,
          item_name: sourceItem.name,
          item_code: sourceItem.code,
          from_warehouse: transferData.from_warehouse_id,
          to_warehouse: transferData.to_warehouse_id,
          cartons_delta: -cartons,
          per_carton_updated: perCarton,
          single_delta: -singleBottles,
          total_delta: -transferQuantity,
          previous_remaining: availableQuantity,
          new_remaining: newSourceQuantity,
          user_id: userId,
          timestamp: serverTimestamp(),
          notes: transferData.notes || 'نقل بين المخازن',
          created_by: userProfile?.name || 'نظام'
        };
        transaction.set(transactionRef, transactionData);

        return {
          success: true,
          transferQuantity,
          sourceItemId: transferData.item_id,
          destinationWarehouse: transferData.to_warehouse_id,
          newSourceQuantity
        };
      });

    } catch (error) {
      console.error('❌ Error in transferItem:', error);
      throw this._handleError(error);
    }
  }

  /**
   * DELETE ITEM WITH STORE BUSINESS LOGIC
   */
  static async deleteItem(itemId, userId, userProfile) {
    try {
      if (!userProfile) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      if (userProfile.role === 'superadmin') {
        // Superadmin can delete
      } else if (userProfile.role === 'warehouse_manager') {
        const canDelete = userProfile.permissions?.includes('full_access') || 
                         userProfile.permissions?.includes('delete_items');
        if (!canDelete) {
          throw new Error('ليس لديك صلاحية لحذف الأصناف');
        }
      } else {
        throw new Error('ليس لديك صلاحية لحذف الأصناف');
      }

      const itemRef = doc(db, 'items', itemId);
      const itemDoc = await getDoc(itemRef);

      if (!itemDoc.exists()) {
        throw new Error('الصنف غير موجود');
      }

      const itemData = itemDoc.data();

      // Validate warehouse access for warehouse managers
      if (userProfile.role === 'warehouse_manager') {
        const allowedWarehouses = userProfile.allowed_warehouses || [];
        if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
          if (!allowedWarehouses.includes(itemData.warehouse_id)) {
            throw new Error('ليس لديك صلاحية لحذف أصناف من هذا المخزن');
          }
        }
      }

      // Create transaction record before deletion
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
        user_id: userId,
        timestamp: serverTimestamp(),
        notes: 'حذف الصنف نهائياً',
        created_by: userProfile?.name || 'نظام'
      };

      await addDoc(collection(db, 'transactions'), transactionData);

      // Delete the item
      await deleteDoc(itemRef);

      return { 
        success: true, 
        message: 'تم حذف الصنف بنجاح',
        transaction: transactionData
      };

    } catch (error) {
      console.error('❌ Error deleting item:', error);
      throw this._handleError(error);
    }
  }

  /**
   * UPDATE ITEM DETAILS (without changing quantities)
   */
  static async updateItemDetails(itemId, updates, userId, userProfile) {
    try {
      if (!itemId || !userId) {
        throw new Error('معرف الصنف ومعرف المستخدم مطلوبان');
      }

      const allowedFields = ['supplier', 'item_location', 'notes', 'per_carton_count', 'photo_url'];
      const filteredUpdates = {};
      
      // Only allow specific fields to be updated
      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          filteredUpdates[field] = updates[field];
        }
      }

      // Validate per_carton_count if being updated
      if (filteredUpdates.per_carton_count !== undefined && filteredUpdates.per_carton_count < 1) {
        throw new Error('عدد القطع في الكرتونة يجب أن يكون 1 على الأقل');
      }

      filteredUpdates.updated_at = serverTimestamp();
      filteredUpdates.updated_by = userId;

      const itemRef = doc(db, 'items', itemId);
      await updateDoc(itemRef, filteredUpdates);

      // Get updated item for transaction
      const updatedDoc = await getDoc(itemRef);
      const itemData = updatedDoc.data();

      // Create transaction record
      const transactionRef = doc(collection(db, 'transactions'));
      await addDoc(transactionRef, {
        item_id: itemId,
        item_name: itemData.name,
        item_code: itemData.code,
        from_warehouse: null,
        to_warehouse: itemData.warehouse_id,
        type: TRANSACTION_TYPES.UPDATE,
        cartons_delta: 0,
        single_delta: 0,
        total_delta: 0,
        previous_remaining: itemData.remaining_quantity,
        new_remaining: itemData.remaining_quantity,
        timestamp: serverTimestamp(),
        user_id: userId,
        notes: updates.notes || 'تحديث بيانات الصنف',
        photo_updated: filteredUpdates.photo_url !== undefined,
        created_at: serverTimestamp(),
        created_by: userProfile?.name || 'نظام'
      });

      return { 
        success: true, 
        itemId,
        photoUpdated: filteredUpdates.photo_url !== undefined 
      };

    } catch (error) {
      console.error('❌ Error in updateItemDetails:', error);
      throw this._handleError(error);
    }
  }

  /**
   * SEARCH ITEMS WITH ARABIC TEXT SUPPORT (Matching store logic)
   */
  static async searchItems(searchTerm, warehouseId = null, limit = 25, userId = null, userProfile = null) {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        throw new Error('يجب إدخال مصطلح بحث مكون من حرفين على الأقل');
      }

      const term = normalizeArabicText(searchTerm);
      console.log(`🔍 Searching for: "${searchTerm}" (normalized: "${term}")`);

      // Build query based on permissions
      const itemsRef = collection(db, 'items');
      let itemsQuery;

      if (userProfile) {
        const role = userProfile.role || '';
        
        if (role === 'superadmin' || role === 'company_manager') {
          // Can access all warehouses
          if (warehouseId && warehouseId !== 'all') {
            itemsQuery = query(
              itemsRef,
              where('warehouse_id', '==', warehouseId),
              orderBy('updated_at', 'desc'),
              limit(limit * 2) // Get more items for client-side filtering
            );
          } else {
            itemsQuery = query(
              itemsRef,
              orderBy('updated_at', 'desc'),
              limit(limit * 2)
            );
          }
        } else if (role === 'warehouse_manager') {
          const allowedWarehouses = userProfile.allowed_warehouses || [];
          
          if (allowedWarehouses.includes('all')) {
            // Can access all warehouses
            if (warehouseId && warehouseId !== 'all') {
              itemsQuery = query(
                itemsRef,
                where('warehouse_id', '==', warehouseId),
                orderBy('updated_at', 'desc'),
                limit(limit * 2)
              );
            } else {
              itemsQuery = query(
                itemsRef,
                orderBy('updated_at', 'desc'),
                limit(limit * 2)
              );
            }
          } else {
            // Limited to specific warehouses
            const validWarehouses = allowedWarehouses.filter(id => 
              typeof id === 'string' && id.trim() !== '' && id !== 'all'
            ).slice(0, 10);
            
            if (warehouseId && warehouseId !== 'all') {
              if (validWarehouses.includes(warehouseId)) {
                itemsQuery = query(
                  itemsRef,
                  where('warehouse_id', '==', warehouseId),
                  orderBy('updated_at', 'desc'),
                  limit(limit * 2)
                );
              } else {
                throw new Error('ليس لديك صلاحية للوصول إلى هذا المخزن');
              }
            } else {
              if (validWarehouses.length === 1) {
                itemsQuery = query(
                  itemsRef,
                  where('warehouse_id', '==', validWarehouses[0]),
                  orderBy('updated_at', 'desc'),
                  limit(limit * 2)
                );
              } else if (validWarehouses.length > 1) {
                try {
                  itemsQuery = query(
                    itemsRef,
                    where('warehouse_id', 'in', validWarehouses.slice(0, 10)),
                    orderBy('updated_at', 'desc'),
                    limit(limit * 2)
                  );
                } catch (error) {
                  // Fallback to single warehouse if "in" query fails
                  itemsQuery = query(
                    itemsRef,
                    where('warehouse_id', '==', validWarehouses[0]),
                    orderBy('updated_at', 'desc'),
                    limit(limit * 2)
                  );
                }
              } else {
                throw new Error('ليس لديك صلاحية للوصول إلى أي مخزن');
              }
            }
          }
        } else {
          throw new Error('ليس لديك صلاحية للبحث في المخزون');
        }
      } else {
        // No user profile, use basic query
        if (warehouseId && warehouseId !== 'all') {
          itemsQuery = query(
            itemsRef,
            where('warehouse_id', '==', warehouseId),
            orderBy('updated_at', 'desc'),
            limit(limit * 2)
          );
        } else {
          itemsQuery = query(
            itemsRef,
            orderBy('updated_at', 'desc'),
            limit(limit * 2)
          );
        }
      }

      const snapshot = await getDocs(itemsQuery);
      console.log(`📊 Firebase query returned ${snapshot.size} documents`);

      // Filter and score items with Arabic matching
      const searchResults = [];
      const allItems = [];

      snapshot.forEach(doc => {
        try {
          const data = doc.data();
          const item = {
            id: doc.id,
            name: data.name || '',
            code: data.code || '',
            color: data.color || '',
            supplier: data.supplier || '',
            warehouse_id: data.warehouse_id || '',
            remaining_quantity: data.remaining_quantity || 0,
            cartons_count: data.cartons_count || 0,
            per_carton_count: data.per_carton_count || 12,
            single_bottles_count: data.single_bottles_count || 0,
            total_added: data.total_added || 0,
            item_location: data.item_location || '',
            notes: data.notes || '',
            barcode: data.barcode || '',
            sku: data.sku || '',
            category: data.category || '',
            updated_at: data.updated_at,
            photo_url: data.photo_url || null
          };

          allItems.push(item);
        } catch (docError) {
          console.warn('⚠️ Error processing document:', docError);
        }
      });

      // Apply Arabic text matching (same as store logic)
      for (const item of allItems) {
        if (searchResults.length >= limit * 2) break;

        // Warehouse filter
        if (warehouseId && warehouseId !== 'all' && item.warehouse_id !== warehouseId) {
          continue;
        }

        let matched = false;
        let score = 0;

        // Check code first (most important)
        if (item.code) {
          const normalizedCode = normalizeArabicText(item.code);
          if (normalizedCode === term) {
            score = 100;
            matched = true;
          } else if (normalizedCode.includes(term)) {
            score = 80;
            matched = true;
          }
        }

        // Check name
        if (!matched || score < 70) {
          if (item.name) {
            const normalizedName = normalizeArabicText(item.name);
            if (normalizedName === term) {
              score = Math.max(score, 90);
              matched = true;
            } else if (normalizedName.includes(term)) {
              score = Math.max(score, 70);
              matched = true;
            }
          }
        }

        // Check other fields
        if (!matched || score < 40) {
          const otherFields = ['color', 'supplier', 'item_location', 'notes', 'barcode', 'sku', 'category'];
          for (const field of otherFields) {
            const fieldValue = item[field];
            if (fieldValue) {
              const normalizedFieldValue = normalizeArabicText(fieldValue);
              if (normalizedFieldValue.includes(term)) {
                score = Math.max(score, 40);
                matched = true;
                break;
              }
            }
          }
        }

        if (matched && score > 15) {
          searchResults.push({ item, score });
        }
      }

      // Sort by score and limit
      searchResults.sort((a, b) => b.score - a.score);
      const finalResults = searchResults
        .slice(0, Math.min(limit, searchResults.length))
        .map(scored => scored.item);

      console.log(`🎯 Returning ${finalResults.length} relevant items`);
      return finalResults;

    } catch (error) {
      console.error('❌ Error in searchItems:', error);
      throw this._handleError(error);
    }
  }

  /**
   * GET ALL ITEMS WITH PAGINATION
   */
  static async getAllItems(pageSize = 50, lastDoc = null, userProfile = null) {
    try {
      const itemsRef = collection(db, 'items');
      let itemsQuery;

      if (userProfile) {
        const role = userProfile.role || '';
        
        if (role === 'superadmin' || role === 'company_manager') {
          if (lastDoc) {
            itemsQuery = query(
              itemsRef,
              orderBy('name'),
              startAfter(lastDoc),
              limit(pageSize)
            );
          } else {
            itemsQuery = query(
              itemsRef,
              orderBy('name'),
              limit(pageSize)
            );
          }
        } else if (role === 'warehouse_manager') {
          const allowedWarehouses = userProfile.allowed_warehouses || [];
          
          if (allowedWarehouses.includes('all')) {
            if (lastDoc) {
              itemsQuery = query(
                itemsRef,
                orderBy('name'),
                startAfter(lastDoc),
                limit(pageSize)
              );
            } else {
              itemsQuery = query(
                itemsRef,
                orderBy('name'),
                limit(pageSize)
              );
            }
          } else {
            const validWarehouses = allowedWarehouses.filter(id => 
              typeof id === 'string' && id.trim() !== '' && id !== 'all'
            ).slice(0, 10);
            
            if (validWarehouses.length === 1) {
              if (lastDoc) {
                itemsQuery = query(
                  itemsRef,
                  where('warehouse_id', '==', validWarehouses[0]),
                  orderBy('name'),
                  startAfter(lastDoc),
                  limit(pageSize)
                );
              } else {
                itemsQuery = query(
                  itemsRef,
                  where('warehouse_id', '==', validWarehouses[0]),
                  orderBy('name'),
                  limit(pageSize)
                );
              }
            } else if (validWarehouses.length > 1) {
              try {
                if (lastDoc) {
                  itemsQuery = query(
                    itemsRef,
                    where('warehouse_id', 'in', validWarehouses.slice(0, 10)),
                    orderBy('name'),
                    startAfter(lastDoc),
                    limit(pageSize)
                  );
                } else {
                  itemsQuery = query(
                    itemsRef,
                    where('warehouse_id', 'in', validWarehouses.slice(0, 10)),
                    orderBy('name'),
                    limit(pageSize)
                  );
                }
              } catch (error) {
                // Fallback to single warehouse
                if (lastDoc) {
                  itemsQuery = query(
                    itemsRef,
                    where('warehouse_id', '==', validWarehouses[0]),
                    orderBy('name'),
                    startAfter(lastDoc),
                    limit(pageSize)
                  );
                } else {
                  itemsQuery = query(
                    itemsRef,
                    where('warehouse_id', '==', validWarehouses[0]),
                    orderBy('name'),
                    limit(pageSize)
                  );
                }
              }
            } else {
              throw new Error('ليس لديك صلاحية للوصول إلى أي مخزن');
            }
          }
        } else {
          throw new Error('ليس لديك صلاحية لعرض المخزون');
        }
      } else {
        // No user profile
        if (lastDoc) {
          itemsQuery = query(
            itemsRef,
            orderBy('name'),
            startAfter(lastDoc),
            limit(pageSize)
          );
        } else {
          itemsQuery = query(
            itemsRef,
            orderBy('name'),
            limit(pageSize)
          );
        }
      }

      const snapshot = await getDocs(itemsQuery);
      const items = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          _display: {
            warehouse: WAREHOUSE_LABELS[data.warehouse_id] || data.warehouse_id,
            has_photo: !!data.photo_url
          }
        };
      });

      const newLastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
      const hasMore = snapshot.size === pageSize;

      return {
        items,
        lastDoc: newLastDoc,
        hasMore
      };

    } catch (error) {
      console.error('❌ Error in getAllItems:', error);
      throw this._handleError(error);
    }
  }

  /**
   * GET ITEM BY ID
   */
  static async getItemById(itemId, userProfile = null) {
    try {
      if (!itemId) {
        throw new Error('معرف الصنف مطلوب');
      }

      const itemDoc = await getDoc(doc(db, 'items', itemId));
      
      if (!itemDoc.exists()) {
        throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND);
      }

      const itemData = itemDoc.data();

      // Check permissions if user profile provided
      if (userProfile) {
        if (userProfile.role === 'warehouse_manager') {
          const allowedWarehouses = userProfile.allowed_warehouses || [];
          if (allowedWarehouses.length > 0 && !allowedWarehouses.includes('all')) {
            if (!allowedWarehouses.includes(itemData.warehouse_id)) {
              throw new Error('ليس لديك صلاحية للوصول إلى هذا الصنف');
            }
          }
        }
      }
      
      return {
        id: itemDoc.id,
        ...itemData,
        _display: {
          warehouse: WAREHOUSE_LABELS[itemData.warehouse_id] || itemData.warehouse_id,
          has_photo: !!itemData.photo_url
        }
      };
    } catch (error) {
      console.error('❌ Error in getItemById:', error);
      throw this._handleError(error);
    }
  }

  /**
   * GET WAREHOUSE STATISTICS
   */
  static async getWarehouseStats(warehouseId = null, userProfile = null) {
    try {
      let itemsQuery = collection(db, 'items');
      
      if (warehouseId) {
        itemsQuery = query(itemsQuery, where('warehouse_id', '==', warehouseId));
      }

      // Apply permissions if user profile provided
      if (userProfile) {
        const role = userProfile.role || '';
        
        if (role === 'warehouse_manager') {
          const allowedWarehouses = userProfile.allowed_warehouses || [];
          if (!allowedWarehouses.includes('all') && allowedWarehouses.length > 0) {
            if (warehouseId) {
              if (!allowedWarehouses.includes(warehouseId)) {
                throw new Error('ليس لديك صلاحية للوصول إلى هذا المخزن');
              }
            } else {
              // If no specific warehouse, only show accessible warehouses
              const validWarehouses = allowedWarehouses.slice(0, 10);
              if (validWarehouses.length === 1) {
                itemsQuery = query(itemsQuery, where('warehouse_id', '==', validWarehouses[0]));
              } else if (validWarehouses.length > 1) {
                try {
                  itemsQuery = query(itemsQuery, where('warehouse_id', 'in', validWarehouses));
                } catch (error) {
                  itemsQuery = query(itemsQuery, where('warehouse_id', '==', validWarehouses[0]));
                }
              } else {
                return {
                  totalItems: 0,
                  totalQuantity: 0,
                  lowStockItems: 0,
                  outOfStockItems: 0,
                  itemsWithPhotos: 0,
                  warehouse: warehouseId ? WAREHOUSE_LABELS[warehouseId] : 'جميع المخازن'
                };
              }
            }
          }
        }
      }

      const snapshot = await getDocs(itemsQuery);
      const items = snapshot.docs.map(doc => doc.data());
      
      const totalItems = items.length;
      const totalQuantity = items.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0);
      const lowStockItems = items.filter(item => (item.remaining_quantity || 0) < 10 && (item.remaining_quantity || 0) > 0).length;
      const outOfStockItems = items.filter(item => (item.remaining_quantity || 0) === 0).length;
      const itemsWithPhotos = items.filter(item => !!item.photo_url).length;
      
      return {
        totalItems,
        totalQuantity,
        lowStockItems,
        outOfStockItems,
        itemsWithPhotos,
        warehouse: warehouseId ? WAREHOUSE_LABELS[warehouseId] : 'جميع المخازن'
      };
    } catch (error) {
      console.error('❌ Error in getWarehouseStats:', error);
      throw this._handleError(error);
    }
  }

  /**
   * CONVERT ITEM FOR DISPLAY
   */
  static convertForDisplay(itemData) {
    if (!itemData) return null;
    
    const totalQuantity = (itemData.cartons_count || 0) * (itemData.per_carton_count || 12) + 
                         (itemData.single_bottles_count || 0);
    
    return {
      id: itemData.id || '',
      name: itemData.name || '',
      code: itemData.code || '',
      color: itemData.color || '',
      supplier: itemData.supplier || '',
      item_location: itemData.item_location || '',
      warehouse_id: itemData.warehouse_id || '',
      remaining_quantity: itemData.remaining_quantity || totalQuantity || 0,
      cartons_count: itemData.cartons_count || 0,
      per_carton_count: itemData.per_carton_count || 12,
      single_bottles_count: itemData.single_bottles_count || 0,
      total_added: itemData.total_added || totalQuantity || 0,
      created_at: itemData.created_at,
      updated_at: itemData.updated_at,
      created_by: itemData.created_by,
      updated_by: itemData.updated_by,
      notes: itemData.notes || '',
      photo_url: itemData.photo_url || null,
      _display: {
        warehouse: WAREHOUSE_LABELS[itemData.warehouse_id] || itemData.warehouse_id || '',
        has_photo: !!itemData.photo_url,
        photo_type: itemData.photo_url ? 
          (itemData.photo_url.startsWith('data:image/') ? 
            itemData.photo_url.split(';')[0].split('/')[1] : 
            'unknown') : 
          null
      }
    };
  }

  /**
   * CALCULATE TOTAL QUANTITY
   */
  static calculateTotalQuantity(cartonsCount, perCartonCount, singleBottlesCount) {
    const cartonsQty = (Number(cartonsCount) || 0) * (Number(perCartonCount) || 1);
    const singleQty = Number(singleBottlesCount) || 0;
    return cartonsQty + singleQty;
  }

  /**
   * VALIDATE ITEM DATA
   */
  static validateItemData(itemData, operation = 'create') {
    const errors = [];

    if (!itemData.name?.trim()) errors.push('الاسم مطلوب');
    if (!itemData.code?.trim()) errors.push('الكود مطلوب');
    if (!itemData.color?.trim()) errors.push('اللون مطلوب');
    if (!itemData.warehouse_id) errors.push('المخزن مطلوب');

    if (operation === 'create') {
      const totalQty = this.calculateTotalQuantity(
        itemData.cartons_count,
        itemData.per_carton_count,
        itemData.single_bottles_count
      );
      if (totalQty <= 0) errors.push('يجب إدخال كمية صحيحة');
    }

    if (errors.length > 0) {
      throw new Error(errors.join('، '));
    }

    return true;
  }

  /**
   * ERROR HANDLING
   */
  static _handleError(error) {
    console.error('Inventory Service Error:', error);

    // Handle specific Firebase errors
    if (error.code) {
      switch (error.code) {
        case 'permission-denied':
          return new Error('ليس لديك صلاحية للقيام بهذا الإجراء');
        case 'unavailable':
          return new Error('الخدمة غير متاحة حالياً. يرجى المحاولة لاحقاً');
        case 'resource-exhausted':
          return new Error('تم تجاوز الحد المسموح. يرجى المحاولة لاحقاً');
        case 'failed-precondition':
          return new Error('البيانات غير صالحة للعملية المطلوبة');
        case 'invalid-argument':
          return new Error('بيانات غير صحيحة');
        case 'already-exists':
          return new Error('العنصر موجود بالفعل');
        case 'not-found':
          return new Error('العنصر غير موجود');
        case 'aborted':
          return new Error('تم إلغاء العملية. يرجى المحاولة مرة أخرى');
        default:
          return new Error(error.message || ERROR_MESSAGES.UNKNOWN_ERROR);
      }
    }

    // Return the original error if it's already an Error object with Arabic message
    if (error.message && error.message.includes(' ')) {
      return error;
    }

    return new Error(error.message || ERROR_MESSAGES.UNKNOWN_ERROR);
  }

  /**
   * FORMAT PHOTO URL
   */
  static formatPhotoUrl(photoUrl) {
    if (!photoUrl) return '';
    
    // Firebase Storage URL
    if (photoUrl.startsWith('https://firebasestorage.googleapis.com')) {
      return photoUrl;
    }
    
    // Base64 Data URL
    if (photoUrl.startsWith('data:image/')) {
      return photoUrl;
    }
    
    // Raw base64 string
    if (typeof photoUrl === 'string' && photoUrl.length > 100) {
      let mimeType = 'image/jpeg';
      if (photoUrl.includes('iVBORw')) mimeType = 'image/png';
      if (photoUrl.includes('R0lGOD')) mimeType = 'image/gif';
      if (photoUrl.includes('UklGR')) mimeType = 'image/webp';
      
      return `data:${mimeType};base64,${photoUrl}`;
    }
    
    return photoUrl;
  }

  /**
   * VALIDATE PHOTO URL
   */
  static isValidPhotoUrl(photoUrl) {
    if (!photoUrl) return false;
    
    if (photoUrl.startsWith('https://firebasestorage.googleapis.com')) {
      return true;
    }
    
    if (photoUrl.startsWith('data:image/')) {
      return true;
    }
    
    if (typeof photoUrl === 'string' && photoUrl.length > 100) {
      const base64Regex = /^[A-Za-z0-9+/]+=*$/;
      return base64Regex.test(photoUrl.replace(/\s/g, ''));
    }
    
    return false;
  }

  /**
   * GET STOCK STATUS
   */
  static getStockStatus(quantity) {
    if (quantity === 0) return 'نفذ';
    if (quantity < 10) return 'قليل';
    return 'متوفر';
  }

  /**
   * GET STOCK STATUS CLASS
   */
  static getStockStatusClass(quantity) {
    if (quantity === 0) return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200';
    if (quantity < 10) return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200';
    return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200';
  }

  /**
   * GET QUANTITY CLASS
   */
  static getQuantityClass(quantity) {
    if (quantity === 0) return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10';
    if (quantity < 10) return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/10';
    return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10';
  }

  /**
   * CHECK IF USER CAN EDIT ITEM
   */
  static canEditItem(item, userProfile) {
    if (!userProfile) return false;
    
    if (userProfile.role === 'superadmin') return true;
    if (userProfile.role !== 'warehouse_manager') return false;
    
    const allowedWarehouses = userProfile.allowed_warehouses || [];
    return allowedWarehouses.includes(item.warehouse_id) || allowedWarehouses.includes('all');
  }

  /**
   * CHECK IF USER CAN DELETE ITEM
   */
  static canDeleteItem(item, userProfile) {
    if (!userProfile) return false;
    
    if (userProfile.role === 'superadmin') return true;
    if (userProfile.role !== 'warehouse_manager') return false;
    
    const allowedWarehouses = userProfile.allowed_warehouses || [];
    const hasAccess = allowedWarehouses.includes(item.warehouse_id) || allowedWarehouses.includes('all');
    const hasPermission = userProfile.permissions?.includes('full_access') || 
                         userProfile.permissions?.includes('delete_items');
    
    return hasAccess && hasPermission;
  }
}

// Export default instance
export default InventoryService;
