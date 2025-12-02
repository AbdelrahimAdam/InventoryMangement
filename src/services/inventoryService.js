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
  notes: 'ملاحظات'
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
  hyper_warehouse: 'مخزن هايبر التهامي'
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
  DISPATCH: 'DISPATCH'
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
   * Add or update item with business logic
   * @param {Object} itemData - Item data with English field names
   * @param {string} userId - User ID performing the action
   * @param {boolean} isAddingCartons - Whether user is adding cartons or single bottles
   */
  static async addOrUpdateItem(itemData, userId, isAddingCartons = true) {
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
      const cleanedData = this._cleanItemData(itemData);
      
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
   * Clean and validate item data
   */
  static _cleanItemData(itemData) {
    const cleaned = { ...itemData };
    
    // Trim string fields and ensure they're not empty
    cleaned.name = cleaned.name?.trim() || '';
    cleaned.code = cleaned.code?.trim() || '';
    cleaned.color = cleaned.color?.trim() || '';
    cleaned.supplier = cleaned.supplier?.trim() || '';
    cleaned.item_location = cleaned.item_location?.trim() || '';
    cleaned.notes = cleaned.notes?.trim() || '';
    
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
      from_warehouse: null,
      to_warehouse: newData.warehouse_id,
      type: TRANSACTION_TYPES.ADD,
      cartons_delta: isAddingCartons ? (newData.cartons_count || 0) : 0,
      single_delta: isAddingCartons ? 0 : (newData.single_bottles_count || 0),
      per_carton_updated: newData.per_carton_count,
      previous_remaining: oldRemaining,
      new_remaining: updates.remaining_quantity,
      timestamp: now,
      user_id: userId,
      notes: newData.notes || (isAddingCartons ? 'إضافة كراتين للمخزن' : 'إضافة قزاز فردي للمخزن'),
      created_at: now
    });
    
    // Commit the batch
    await batch.commit();
    
    return { type: 'updated', id: existingItem.id, addedQuantity };
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
      to_warehouse: itemData.warehouse_id,
      type: TRANSACTION_TYPES.ADD,
      cartons_delta: cartonsQty,
      single_delta: singleBottles,
      per_carton_updated: perCarton,
      previous_remaining: 0,
      new_remaining: totalAddedQty,
      timestamp: now,
      user_id: userId,
      notes: itemData.notes || 'إنشاء صنف جديد',
      created_at: now
    });
    
    // Commit the batch
    await batch.commit();
    
    return { type: 'created', id: itemRef.id, addedQuantity: totalAddedQty };
  }

  /**
   * Transfer items between warehouses
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
        
        // Handle destination item - use add/update logic for destination
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
          from_warehouse,
          to_warehouse,
          type: TRANSACTION_TYPES.TRANSFER,
          cartons_delta: -cartonsQty,
          single_delta: -singleBottlesQty,
          per_carton_updated: item.per_carton_count,
          previous_remaining: item.remaining_quantity,
          new_remaining: sourceUpdates.remaining_quantity,
          timestamp: new Date(),
          user_id: userId,
          notes: notes || `نقل من ${WAREHOUSE_LABELS[from_warehouse]} إلى ${WAREHOUSE_LABELS[to_warehouse]}`,
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
      // Update existing destination item
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
      
      const destItemRef = doc(db, 'items', destItem.id);
      await transaction.update(destItemRef, destUpdates);
      
    } else {
      // Create new destination item
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
        created_at: now,
        created_by: userId,
        updated_at: now,
        updated_by: userId
      };
      
      const destItemRef = doc(collection(db, 'items'));
      await transaction.set(destItemRef, newDestItem);
    }
  }

  /**
   * Dispatch items to external destinations
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
        
        await transaction.update(itemRef, updates);
        
        // Create transaction record
        const transactionRef = doc(collection(db, 'transactions'));
        await transaction.set(transactionRef, {
          item_id,
          from_warehouse,
          to_warehouse: to_destination,
          type: TRANSACTION_TYPES.DISPATCH,
          cartons_delta: -cartonsQty,
          single_delta: -singleBottlesQty,
          per_carton_updated: item.per_carton_count,
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
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        _display: {
          warehouse: WAREHOUSE_LABELS[doc.data().warehouse_id] || doc.data().warehouse_id,
        }
      }));
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
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        _display: {
          warehouse: WAREHOUSE_LABELS[doc.data().warehouse_id] || doc.data().warehouse_id,
        }
      }));
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

      return {
        id: itemDoc.id,
        ...itemDoc.data(),
        _display: {
          warehouse: WAREHOUSE_LABELS[itemDoc.data().warehouse_id] || itemDoc.data().warehouse_id,
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

      const allowedFields = ['supplier', 'item_location', 'notes', 'per_carton_count'];
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

      return { success: true, itemId };
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
      
      return {
        totalItems,
        totalQuantity,
        lowStockItems,
        outOfStockItems,
        warehouse: warehouseId ? WAREHOUSE_LABELS[warehouseId] : 'جميع المخازن'
      };
    } catch (error) {
      console.error('Error in getWarehouseStats:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Helper function to convert data for UI display (add Arabic labels)
   */
  static convertForDisplay(data) {
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
      }
    };
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
}