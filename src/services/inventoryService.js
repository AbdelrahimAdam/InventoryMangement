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
  runTransaction
} from 'firebase/firestore';
import { db } from '@/firebase/config';

// Field mapping constants for UI
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
  photo_url: 'صورة الصنف'
};

export const WAREHOUSES = {
  MAIN: 'main_warehouse',
  TERAA: 'tera_warehouse',
  SHOBEEN: 'shobeen_warehouse', 
  HYPER: 'hyper_warehouse'
};

export const WAREHOUSE_LABELS = {
  main_warehouse: 'مخزن شارع الشيخ',
  tera_warehouse: 'مخزن الترعه',
  shobeen_warehouse: 'مخزن موقف شبين',
  hyper_warehouse: 'مخزن هايبر التهامي',
  matbaa_warehouse: 'مخزن المطبعه',
  ghabashi_warehouse: 'مخزن الغباشي'
};

export const DESTINATIONS = {
  FACTORY: 'factory',
  ZAHRA: 'zahra'
};

export const DESTINATION_LABELS = {
  factory: 'صرف الي مصنع البران',
  zahra: 'صرف الي مخزن الزهراء'
};

export const TRANSACTION_TYPES = {
  ADD: 'ADD',
  TRANSFER: 'TRANSFER',
  DISPATCH: 'DISPATCH',
  UPDATE: 'UPDATE'
};

// Error messages in Arabic
const ERROR_MESSAGES = {
  ITEM_NOT_FOUND: 'الصنف غير موجود',
  WRONG_WAREHOUSE: 'الصنف ليس في المخزن المحدد',
  INSUFFICIENT_QUANTITY: 'الكمية المطلوبة غير متوفرة',
  UNAUTHORIZED: 'ليس لديك صلاحية للقيام بهذا الإجراء',
  NETWORK_ERROR: 'خطأ في الاتصال بالشبكة',
  UNKNOWN_ERROR: 'حدث خطأ غير متوقع',
  INVALID_DATA: 'بيانات غير صحيحة'
};

export class InventoryService {
  /**
   * Add or update item with business logic (now supports photos)
   * @param {Object} itemData - Item data with English field names
   * @param {string} userId - User ID performing the action
   * @param {boolean} isAddingCartons - Whether user is adding cartons or single bottles
   * @param {string} photoUrl - Optional photo URL (Firebase Storage URL or base64)
   */
  static async addOrUpdateItem(itemData, userId, isAddingCartons = true, photoUrl = null) {
    try {
      const { warehouse_id, code, color, name } = itemData;
      
      // Validate required fields
      if (!warehouse_id || !code || !color || !name) {
        throw new Error('بيانات غير مكتملة: يرجى التأكد من إدخال جميع الحقول المطلوبة (الاسم، الكود، اللون، المخزن)');
      }

      if (!userId) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      // Clean and validate data
      const cleanedData = this._cleanItemData(itemData, photoUrl);
      
      // First, check if item exists without using transaction (since transactions don't support queries)
      const existingItem = await this._findExistingItem(cleanedData);
      
      if (existingItem) {
        // Update existing item using batch write instead of transaction
        return await this._updateExistingItem(existingItem, cleanedData, userId, isAddingCartons);
      } else {
        // Create new item
        return await this._createNewItem(cleanedData, userId);
      }
    } catch (error) {
      console.error('Error in addOrUpdateItem:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Find existing item without using transaction (since transactions don't support queries)
   */
  static async _findExistingItem(itemData) {
    try {
      const itemsRef = collection(db, 'items');
      
      // Validate all query parameters are defined and not empty
      if (!itemData.warehouse_id || !itemData.code || !itemData.color || !itemData.name) {
        console.warn('Missing required fields for query:', itemData);
        return null;
      }
      
      const q = query(
        itemsRef, 
        where('warehouse_id', '==', itemData.warehouse_id),
        where('code', '==', itemData.code.trim()),
        where('color', '==', itemData.color.trim()),
        where('name', '==', itemData.name.trim())
      );
      
      const snapshot = await getDocs(q);
      return snapshot.empty ? null : {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data()
      };
    } catch (error) {
      console.error('Error finding existing item:', error);
      return null;
    }
  }

  /**
   * Clean and validate item data with photo support
   */
  static _cleanItemData(itemData, photoUrl = null) {
    const cleaned = { ...itemData };
    
    // Trim string fields and ensure they're not empty
    cleaned.name = cleaned.name?.trim() || '';
    cleaned.code = cleaned.code?.trim() || '';
    cleaned.color = cleaned.color?.trim() || '';
    cleaned.supplier = cleaned.supplier?.trim() || '';
    cleaned.item_location = cleaned.item_location?.trim() || '';
    cleaned.notes = cleaned.notes?.trim() || '';
    
    // Handle photo URL
    if (photoUrl) {
      cleaned.photo_url = photoUrl;
    } else if (itemData.photo_url !== undefined) {
      cleaned.photo_url = itemData.photo_url;
    }
    
    // Validate required fields after trimming
    if (!cleaned.name) {
      throw new Error('اسم الصنف مطلوب');
    }
    if (!cleaned.code) {
      throw new Error('كود الصنف مطلوب');
    }
    if (!cleaned.color) {
      throw new Error('لون الصنف مطلوب');
    }
    if (!cleaned.warehouse_id) {
      throw new Error('المخزن مطلوب');
    }
    
    // Set default values for optional fields
    cleaned.cartons_count = Number(cleaned.cartons_count) || 0;
    cleaned.per_carton_count = Number(cleaned.per_carton_count) || 1;
    cleaned.single_bottles_count = Number(cleaned.single_bottles_count) || 0;
    cleaned.supplier = cleaned.supplier || '';
    cleaned.item_location = cleaned.item_location || '';
    cleaned.notes = cleaned.notes || '';
    cleaned.photo_url = cleaned.photo_url || null;
    
    // Validate quantities
    if (cleaned.cartons_count < 0) {
      throw new Error('عدد الكراتين لا يمكن أن يكون سالباً');
    }
    
    if (cleaned.per_carton_count < 1) {
      throw new Error('عدد القطع في الكرتونة يجب أن يكون 1 على الأقل');
    }
    
    if (cleaned.single_bottles_count < 0) {
      throw new Error('عدد القزاز الفردي لا يمكن أن يكون سالباً');
    }
    
    return cleaned;
  }

  static async _updateExistingItem(existingItem, newData, userId, isAddingCartons) {
    const batch = writeBatch(db);
    const now = new Date();
    
    const updates = {
      updated_at: now,
      updated_by: userId,
    };

    // Calculate added quantity based on the mode
    let addedQuantity = 0;

    if (isAddingCartons) {
      // When adding cartons: OLD + NEW for cartons_count, REPLACE for per_carton_count
      const oldCartons = existingItem.cartons_count || 0;
      const newCartons = newData.cartons_count || 0;
      updates.cartons_count = oldCartons + newCartons;
      
      // REPLACE per_carton_count if provided and valid
      if (newData.per_carton_count !== undefined && newData.per_carton_count !== null && newData.per_carton_count >= 1) {
        updates.per_carton_count = newData.per_carton_count;
      } else {
        updates.per_carton_count = existingItem.per_carton_count || 1;
      }
      
      // Calculate added quantity from cartons
      const perCarton = updates.per_carton_count;
      addedQuantity = newCartons * perCarton;
      
      // Preserve single bottles count
      updates.single_bottles_count = existingItem.single_bottles_count || 0;
      
    } else {
      // When adding single bottles: REPLACE single_bottles_count
      if (newData.single_bottles_count !== undefined && newData.single_bottles_count !== null) {
        updates.single_bottles_count = Math.max(0, newData.single_bottles_count);
        addedQuantity = newData.single_bottles_count;
      } else {
        updates.single_bottles_count = existingItem.single_bottles_count || 0;
      }
      
      // Preserve carton data
      updates.cartons_count = existingItem.cartons_count || 0;
      updates.per_carton_count = existingItem.per_carton_count || 1;
    }

    // Update cumulative added quantity and remaining quantity
    const oldTotalAdded = existingItem.total_added || 0;
    const oldRemaining = existingItem.remaining_quantity || 0;
    
    updates.total_added = oldTotalAdded + addedQuantity;
    updates.remaining_quantity = oldRemaining + addedQuantity;

    // Update optional fields if provided (keep existing if not provided)
    if (newData.notes !== undefined) updates.notes = newData.notes;
    if (newData.supplier !== undefined) updates.supplier = newData.supplier;
    if (newData.item_location !== undefined) updates.item_location = newData.item_location;
    
    // Handle photo URL - only update if provided
    if (newData.photo_url !== undefined) {
      updates.photo_url = newData.photo_url;
    } else if (existingItem.photo_url) {
      // Keep existing photo if not updated
      updates.photo_url = existingItem.photo_url;
    }

    // Validate quantities
    if (updates.remaining_quantity < 0) {
      throw new Error('الكمية المتبقية لا يمكن أن تكون سالبة');
    }

    if (updates.total_added < oldTotalAdded) {
      throw new Error('الكمية المضافة التراكمية لا يمكن أن تقل');
    }

    // Update the item
    const itemRef = doc(db, 'items', existingItem.id);
    batch.update(itemRef, updates);
    
    // Create transaction record
    const transactionRef = doc(collection(db, 'transactions'));
    batch.set(transactionRef, {
      item_id: existingItem.id,
      item_name: existingItem.name,
      item_code: existingItem.code,
      from_warehouse: null,
      to_warehouse: newData.warehouse_id,
      type: TRANSACTION_TYPES.UPDATE,
      cartons_delta: isAddingCartons ? (newData.cartons_count || 0) : 0,
      single_delta: isAddingCartons ? 0 : (newData.single_bottles_count || 0),
      per_carton_updated: newData.per_carton_count,
      total_delta: addedQuantity,
      previous_remaining: oldRemaining,
      new_remaining: updates.remaining_quantity,
      timestamp: now,
      user_id: userId,
      notes: newData.notes || (isAddingCartons ? 'إضافة كراتين للمخزن' : 'إضافة قزاز فردي للمخزن'),
      photo_updated: newData.photo_url !== undefined,
      created_at: now
    });
    
    // Commit the batch
    await batch.commit();
    
    return { 
      type: 'updated', 
      id: existingItem.id, 
      addedQuantity,
      photoUpdated: newData.photo_url !== undefined
    };
  }

  static async _createNewItem(itemData, userId) {
    const batch = writeBatch(db);
    const now = new Date();
    
    // Calculate initial quantities
    const cartonsQty = itemData.cartons_count || 0;
    const perCarton = itemData.per_carton_count || 1;
    const singleBottles = itemData.single_bottles_count || 0;
    
    const totalAddedQty = (cartonsQty * perCarton) + singleBottles;
    
    // Validate required fields
    if (!itemData.name || !itemData.code || !itemData.color || !itemData.warehouse_id) {
      throw new Error('جميع الحقول المطلوبة يجب أن تكون مملوءة (الاسم، الكود، اللون، المخزن)');
    }

    if (totalAddedQty <= 0) {
      throw new Error('يجب إدخال كمية صحيحة');
    }
    
    const newItem = {
      name: itemData.name,
      code: itemData.code,
      color: itemData.color,
      warehouse_id: itemData.warehouse_id,
      cartons_count: cartonsQty,
      per_carton_count: perCarton,
      single_bottles_count: singleBottles,
      total_added: totalAddedQty,
      remaining_quantity: totalAddedQty,
      supplier: itemData.supplier || '',
      item_location: itemData.item_location || '',
      notes: itemData.notes || '',
      photo_url: itemData.photo_url || null,
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
      item_name: itemData.name,
      item_code: itemData.code,
      from_warehouse: null,
      to_warehouse: itemData.warehouse_id,
      type: TRANSACTION_TYPES.ADD,
      cartons_delta: cartonsQty,
      single_delta: singleBottles,
      per_carton_updated: perCarton,
      total_delta: totalAddedQty,
      previous_remaining: 0,
      new_remaining: totalAddedQty,
      timestamp: now,
      user_id: userId,
      notes: itemData.notes || 'إنشاء صنف جديد',
      photo_added: !!itemData.photo_url,
      created_at: now
    });
    
    // Commit the batch
    await batch.commit();
    
    return { 
      type: 'created', 
      id: itemRef.id, 
      addedQuantity: totalAddedQty,
      photoAdded: !!itemData.photo_url 
    };
  }

  /**
   * Transfer items between warehouses with photo preservation
   */
  static async transferItem(transferData, userId) {
    try {
      const { item_id, from_warehouse, to_warehouse, cartons, single_bottles, notes } = transferData;
      
      if (!item_id || !from_warehouse || !to_warehouse) {
        throw new Error('بيانات النقل غير مكتملة');
      }

      if (!userId) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      const cartonsQty = Number(cartons) || 0;
      const singleBottlesQty = Number(single_bottles) || 0;

      if (cartonsQty <= 0 && singleBottlesQty <= 0) {
        throw new Error('يجب تحديد كمية للنقل');
      }
      
      return await runTransaction(db, async (transaction) => {
        const itemRef = doc(db, 'items', item_id);
        const itemDoc = await transaction.get(itemRef);
        
        if (!itemDoc.exists()) {
          throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND);
        }
        
        const item = itemDoc.data();
        
        // Validate source warehouse
        if (item.warehouse_id !== from_warehouse) {
          throw new Error(ERROR_MESSAGES.WRONG_WAREHOUSE);
        }
        
        // Calculate transfer quantity
        const perCarton = item.per_carton_count || 1;
        const transferQty = (cartonsQty * perCarton) + singleBottlesQty;
        
        if (transferQty > item.remaining_quantity) {
          throw new Error(ERROR_MESSAGES.INSUFFICIENT_QUANTITY);
        }
        
        // Update source item (decrease remaining quantity only)
        const sourceUpdates = {
          remaining_quantity: item.remaining_quantity - transferQty,
          updated_at: new Date(),
          updated_by: userId
        };
        
        // If transferring cartons, decrease carton count
        if (cartonsQty > 0) {
          sourceUpdates.cartons_count = Math.max(0, (item.cartons_count || 0) - cartonsQty);
        }
        
        // If transferring single bottles, decrease single bottles count
        if (singleBottlesQty > 0) {
          sourceUpdates.single_bottles_count = Math.max(0, (item.single_bottles_count || 0) - singleBottlesQty);
        }
        
        await transaction.update(itemRef, sourceUpdates);
        
        // Handle destination item - preserve photo and all other data
        await this._handleDestinationItem(
          transaction, 
          item, 
          to_warehouse, 
          cartonsQty, 
          singleBottlesQty, 
          transferQty, 
          userId
        );
        
        // Create transaction record
        const transactionRef = doc(collection(db, 'transactions'));
        await transaction.set(transactionRef, {
          item_id,
          item_name: item.name,
          item_code: item.code,
          from_warehouse,
          to_warehouse,
          type: TRANSACTION_TYPES.TRANSFER,
          cartons_delta: -cartonsQty,
          single_delta: -singleBottlesQty,
          per_carton_updated: item.per_carton_count,
          total_delta: -transferQty,
          previous_remaining: item.remaining_quantity,
          new_remaining: sourceUpdates.remaining_quantity,
          timestamp: new Date(),
          user_id: userId,
          notes: notes || `نقل من ${WAREHOUSE_LABELS[from_warehouse] || from_warehouse} إلى ${WAREHOUSE_LABELS[to_warehouse] || to_warehouse}`,
          created_at: new Date()
        });
        
        return { 
          success: true, 
          transferQty,
          sourceItemId: item_id,
          destinationWarehouse: to_warehouse
        };
      });
    } catch (error) {
      console.error('Error in transferItem:', error);
      throw this._handleError(error);
    }
  }

  static async _handleDestinationItem(transaction, sourceItem, to_warehouse, cartons, single_bottles, transferQty, userId) {
    try {
      // For destination item, we need to find it by querying outside the transaction first
      // Since transactions don't support queries, we'll handle this differently
      
      const destItemsRef = collection(db, 'items');
      const destQuery = query(
        destItemsRef,
        where('warehouse_id', '==', to_warehouse),
        where('code', '==', sourceItem.code),
        where('color', '==', sourceItem.color),
        where('name', '==', sourceItem.name)
      );
      
      const destSnapshot = await getDocs(destQuery); // Query outside transaction
      const now = new Date();
      
      if (!destSnapshot.empty && destSnapshot.docs.length > 0) {
        // Update existing destination item - preserve photo and other data
        const destItem = destSnapshot.docs[0];
        const destData = destItem.data();
        
        const destUpdates = {
          total_added: (destData.total_added || 0) + transferQty,
          remaining_quantity: (destData.remaining_quantity || 0) + transferQty,
          cartons_count: (destData.cartons_count || 0) + cartons,
          single_bottles_count: (destData.single_bottles_count || 0) + single_bottles,
          updated_at: now,
          updated_by: userId
        };
        
        // Preserve existing photo if destination has one, otherwise use source photo
        if (!destData.photo_url && sourceItem.photo_url) {
          destUpdates.photo_url = sourceItem.photo_url;
        }
        
        // Preserve other fields from source if destination doesn't have them
        if (!destData.supplier && sourceItem.supplier) {
          destUpdates.supplier = sourceItem.supplier;
        }
        if (!destData.item_location && sourceItem.item_location) {
          destUpdates.item_location = sourceItem.item_location;
        }
        
        const destItemRef = doc(db, 'items', destItem.id);
        await transaction.update(destItemRef, destUpdates);
        
      } else {
        // Create new destination item - copy all data including photo from source
        const newDestItem = {
          name: sourceItem.name,
          code: sourceItem.code,
          color: sourceItem.color,
          warehouse_id: to_warehouse,
          cartons_count: cartons,
          per_carton_count: sourceItem.per_carton_count || 1,
          single_bottles_count: single_bottles,
          total_added: transferQty,
          remaining_quantity: transferQty,
          supplier: sourceItem.supplier || '',
          item_location: sourceItem.item_location || '',
          notes: sourceItem.notes || '',
          photo_url: sourceItem.photo_url || null, // Copy photo from source
          created_at: now,
          created_by: userId,
          updated_at: now,
          updated_by: userId
        };
        
        const destItemRef = doc(collection(db, 'items'));
        await transaction.set(destItemRef, newDestItem);
      }
    } catch (error) {
      console.error('Error handling destination item:', error);
      throw error;
    }
  }

  /**
   * Dispatch items to external destinations (photos remain with source item)
   */
  static async dispatchItem(dispatchData, userId) {
    try {
      const { item_id, from_warehouse, to_destination, cartons, single_bottles, notes } = dispatchData;
      
      if (!item_id || !from_warehouse || !to_destination) {
        throw new Error('بيانات الصرف غير مكتملة');
      }

      if (!userId) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      const cartonsQty = Number(cartons) || 0;
      const singleBottlesQty = Number(single_bottles) || 0;

      if (cartonsQty <= 0 && singleBottlesQty <= 0) {
        throw new Error('يجب تحديد كمية للصرف');
      }
      
      return await runTransaction(db, async (transaction) => {
        const itemRef = doc(db, 'items', item_id);
        const itemDoc = await transaction.get(itemRef);
        
        if (!itemDoc.exists()) {
          throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND);
        }
        
        const item = itemDoc.data();
        
        // Validate source warehouse
        if (item.warehouse_id !== from_warehouse) {
          throw new Error(ERROR_MESSAGES.WRONG_WAREHOUSE);
        }
        
        // Calculate dispatch quantity
        const perCarton = item.per_carton_count || 1;
        const dispatchQty = (cartonsQty * perCarton) + singleBottlesQty;
        
        if (dispatchQty > item.remaining_quantity) {
          throw new Error(ERROR_MESSAGES.INSUFFICIENT_QUANTITY);
        }
        
        // Update source item (only decrease remaining, not cumulative added)
        const updates = {
          remaining_quantity: item.remaining_quantity - dispatchQty,
          updated_at: new Date(),
          updated_by: userId
        };
        
        // If dispatching cartons, decrease carton count
        if (cartonsQty > 0) {
          updates.cartons_count = Math.max(0, (item.cartons_count || 0) - cartonsQty);
        }
        
        // If dispatching single bottles, decrease single bottles count
        if (singleBottlesQty > 0) {
          updates.single_bottles_count = Math.max(0, (item.single_bottles_count || 0) - singleBottlesQty);
        }
        
        // Photo remains unchanged during dispatch
        if (item.photo_url) {
          updates.photo_url = item.photo_url;
        }
        
        await transaction.update(itemRef, updates);
        
        // Create transaction record
        const transactionRef = doc(collection(db, 'transactions'));
        await transaction.set(transactionRef, {
          item_id,
          item_name: item.name,
          item_code: item.code,
          from_warehouse,
          to_warehouse: to_destination,
          type: TRANSACTION_TYPES.DISPATCH,
          cartons_delta: -cartonsQty,
          single_delta: -singleBottlesQty,
          per_carton_updated: item.per_carton_count,
          total_delta: -dispatchQty,
          previous_remaining: item.remaining_quantity,
          new_remaining: updates.remaining_quantity,
          timestamp: new Date(),
          user_id: userId,
          notes: notes || `صرف إلى ${DESTINATION_LABELS[to_destination] || to_destination}`,
          created_at: new Date()
        });
        
        return { 
          success: true, 
          dispatchQty,
          itemId: item_id,
          destination: to_destination
        };
      });
    } catch (error) {
      console.error('Error in dispatchItem:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Get item with photo by ID
   */
  static async getItemWithPhoto(itemId) {
    try {
      if (!itemId) {
        throw new Error('معرف الصنف مطلوب');
      }

      const itemDoc = await getDoc(doc(db, 'items', itemId));
      
      if (!itemDoc.exists()) {
        throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND);
      }

      const itemData = itemDoc.data();
      
      return {
        id: itemDoc.id,
        ...itemData,
        _display: {
          warehouse: WAREHOUSE_LABELS[itemData.warehouse_id] || itemData.warehouse_id,
          has_photo: !!itemData.photo_url,
          photo_type: itemData.photo_url ? this._getPhotoType(itemData.photo_url) : null
        }
      };
    } catch (error) {
      console.error('Error in getItemWithPhoto:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Update item photo
   */
  static async updateItemPhoto(itemId, photoUrl, userId) {
    try {
      if (!itemId || !userId) {
        throw new Error('معرف الصنف ومعرف المستخدم مطلوبان');
      }

      if (!photoUrl) {
        throw new Error('رابط الصورة مطلوب');
      }

      const itemRef = doc(db, 'items', itemId);
      const itemDoc = await getDoc(itemRef);
      
      if (!itemDoc.exists()) {
        throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND);
      }

      const oldItem = itemDoc.data();
      const updates = {
        photo_url: photoUrl,
        updated_at: new Date(),
        updated_by: userId
      };

      await updateDoc(itemRef, updates);
      
      // Create transaction record
      const transactionRef = doc(collection(db, 'transactions'));
      await addDoc(transactionRef, {
        item_id: itemId,
        item_name: oldItem.name,
        item_code: oldItem.code,
        from_warehouse: null,
        to_warehouse: oldItem.warehouse_id,
        type: TRANSACTION_TYPES.UPDATE,
        cartons_delta: 0,
        single_delta: 0,
        total_delta: 0,
        previous_remaining: oldItem.remaining_quantity,
        new_remaining: oldItem.remaining_quantity,
        timestamp: new Date(),
        user_id: userId,
        notes: 'تحديث صورة الصنف',
        photo_updated: true,
        created_at: new Date()
      });

      return { 
        success: true, 
        itemId,
        photoUpdated: true 
      };
    } catch (error) {
      console.error('Error in updateItemPhoto:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Get low stock items (less than 10 remaining)
   */
  static async getLowStockItems(warehouseId = null) {
    try {
      let itemsQuery = collection(db, 'items');
      
      if (warehouseId) {
        itemsQuery = query(
          itemsQuery,
          where('warehouse_id', '==', warehouseId),
          where('remaining_quantity', '<', 10)
        );
      } else {
        itemsQuery = query(itemsQuery, where('remaining_quantity', '<', 10));
      }
      
      const snapshot = await getDocs(itemsQuery);
      return snapshot.docs.map(doc => {
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
    } catch (error) {
      console.error('Error in getLowStockItems:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Get recent transactions
   */
  static async getRecentTransactions(limit = 50) {
    try {
      const transactionsQuery = query(
        collection(db, 'transactions'),
        orderBy('timestamp', 'desc')
      );
      
      const snapshot = await getDocs(transactionsQuery);
      const transactions = snapshot.docs.slice(0, limit).map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Add display labels
      return transactions.map(transaction => ({
        ...transaction,
        _display: {
          from_warehouse: WAREHOUSE_LABELS[transaction.from_warehouse] || transaction.from_warehouse,
          to_warehouse: WAREHOUSE_LABELS[transaction.to_warehouse] || 
                       DESTINATION_LABELS[transaction.to_warehouse] || 
                       transaction.to_warehouse,
        }
      }));
    } catch (error) {
      console.error('Error in getRecentTransactions:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Get all items in a warehouse
   */
  static async getWarehouseItems(warehouseId) {
    try {
      if (!warehouseId) {
        throw new Error('يجب تحديد المخزن');
      }

      const itemsQuery = query(
        collection(db, 'items'),
        where('warehouse_id', '==', warehouseId),
        orderBy('name')
      );
      
      const snapshot = await getDocs(itemsQuery);
      return snapshot.docs.map(doc => {
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
    } catch (error) {
      console.error('Error in getWarehouseItems:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Get all items with pagination
   */
  static async getAllItems(pageSize = 50) {
    try {
      const itemsQuery = query(
        collection(db, 'items'),
        orderBy('name')
      );

      const snapshot = await getDocs(itemsQuery);
      const items = snapshot.docs.slice(0, pageSize).map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return items.map(item => ({
        ...item,
        _display: {
          warehouse: WAREHOUSE_LABELS[item.warehouse_id] || item.warehouse_id,
          has_photo: !!item.photo_url
        }
      }));
    } catch (error) {
      console.error('Error in getAllItems:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Search items by name, code, or color
   */
  static async searchItems(searchTerm, warehouseId = null) {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        throw new Error('يجب إدخال مصطلح بحث مكون من حرفين على الأقل');
      }

      const term = searchTerm.toLowerCase().trim();
      let allItems = [];

      if (warehouseId) {
        allItems = await this.getWarehouseItems(warehouseId);
      } else {
        allItems = await this.getAllItems(1000);
      }

      return allItems.filter(item => 
        item.name?.toLowerCase().includes(term) ||
        item.code?.toLowerCase().includes(term) ||
        item.color?.toLowerCase().includes(term) ||
        item.supplier?.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error('Error in searchItems:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Get item by ID
   */
  static async getItemById(itemId) {
    try {
      if (!itemId) {
        throw new Error('معرف الصنف مطلوب');
      }

      const itemDoc = await getDoc(doc(db, 'items', itemId));
      
      if (!itemDoc.exists()) {
        throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND);
      }

      const itemData = itemDoc.data();
      
      return {
        id: itemDoc.id,
        ...itemData,
        _display: {
          warehouse: WAREHOUSE_LABELS[itemData.warehouse_id] || itemData.warehouse_id,
          has_photo: !!itemData.photo_url
        }
      };
    } catch (error) {
      console.error('Error in getItemById:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Update item details (without changing quantities)
   */
  static async updateItemDetails(itemId, updates, userId) {
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

      filteredUpdates.updated_at = new Date();
      filteredUpdates.updated_by = userId;

      const itemRef = doc(db, 'items', itemId);
      await updateDoc(itemRef, filteredUpdates);

      return { 
        success: true, 
        itemId,
        photoUpdated: filteredUpdates.photo_url !== undefined 
      };
    } catch (error) {
      console.error('Error in updateItemDetails:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Get warehouse statistics
   */
  static async getWarehouseStats(warehouseId = null) {
    try {
      let itemsQuery = collection(db, 'items');
      
      if (warehouseId) {
        itemsQuery = query(itemsQuery, where('warehouse_id', '==', warehouseId));
      }

      const snapshot = await getDocs(itemsQuery);
      const items = snapshot.docs.map(doc => doc.data());
      
      const totalItems = items.length;
      const totalQuantity = items.reduce((sum, item) => sum + (item.remaining_quantity || 0), 0);
      const lowStockItems = items.filter(item => (item.remaining_quantity || 0) < 10).length;
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
      console.error('Error in getWarehouseStats:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Convert item data for display
   * @param {Object} itemData - Raw item data
   * @returns {Object} - Converted item for display
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
      searchable: itemData.searchable || '',
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
   * Helper function to convert data for UI display (add Arabic labels and photo info)
   */
  static convertForDisplayOld(data) {
    if (Array.isArray(data)) {
      return data.map(item => this._addDisplayLabels(item));
    }
    return this._addDisplayLabels(data);
  }

  static _addDisplayLabels(item) {
    if (!item) return item;
    
    return {
      ...item,
      _display: {
        warehouse: WAREHOUSE_LABELS[item.warehouse_id] || item.warehouse_id,
        has_photo: !!item.photo_url,
        photo_type: item.photo_url ? this._getPhotoType(item.photo_url) : null
      }
    };
  }

  /**
   * Utility to detect photo type from URL
   */
  static _getPhotoType(photoUrl) {
    if (!photoUrl) return null;
    
    if (photoUrl.startsWith('data:image/')) {
      return photoUrl.split(';')[0].split('/')[1];
    }
    
    if (photoUrl.startsWith('https://firebasestorage.googleapis.com')) {
      const extension = photoUrl.split('.').pop().split('?')[0].toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
        return extension;
      }
      return 'unknown';
    }
    
    return 'unknown';
  }

  /**
   * Error handling utility
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
   * Utility to calculate total quantity from cartons and single bottles
   */
  static calculateTotalQuantity(cartonsCount, perCartonCount, singleBottlesCount) {
    const cartonsQty = (Number(cartonsCount) || 0) * (Number(perCartonCount) || 1);
    const singleQty = Number(singleBottlesCount) || 0;
    return cartonsQty + singleQty;
  }

  /**
   * Validate item data before operations
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
   * Format photo URL for display - handles both Firebase Storage and base64 URLs
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
    
    // Raw base64 string (without data URL prefix)
    if (typeof photoUrl === 'string' && photoUrl.length > 100) {
      // Try to detect image type
      let mimeType = 'image/jpeg';
      if (photoUrl.includes('iVBORw')) mimeType = 'image/png';
      if (photoUrl.includes('R0lGOD')) mimeType = 'image/gif';
      if (photoUrl.includes('UklGR')) mimeType = 'image/webp';
      
      return `data:${mimeType};base64,${photoUrl}`;
    }
    
    // Return as-is for other cases
    return photoUrl;
  }

  /**
   * Validate photo URL format
   */
  static isValidPhotoUrl(photoUrl) {
    if (!photoUrl) return false;
    
    // Check for Firebase Storage URL
    if (photoUrl.startsWith('https://firebasestorage.googleapis.com')) {
      return true;
    }
    
    // Check for Data URL
    if (photoUrl.startsWith('data:image/')) {
      return true;
    }
    
    // Check for base64 string (might be without prefix)
    if (typeof photoUrl === 'string' && photoUrl.length > 100) {
      // Simple base64 validation
      const base64Regex = /^[A-Za-z0-9+/]+=*$/;
      return base64Regex.test(photoUrl.replace(/\s/g, ''));
    }
    
    return false;
  }
}

// Export default instance for easy import
export default InventoryService;
