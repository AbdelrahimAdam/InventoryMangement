<template>
  <div class="card">
    <!-- Mobile Card View -->
    <div class="mobile-view">
      <div v-for="item in items" :key="item.id" class="mobile-item">
        <div class="mobile-item-header">
          <h4 class="mobile-item-name">{{ item.name }}</h4>
          <span class="mobile-item-code">{{ item.code }}</span>
        </div>
        <div class="mobile-item-details">
          <div class="mobile-detail-item">
            <span class="mobile-detail-label">اللون:</span>
            <span class="mobile-detail-value">{{ item.color }}</span>
          </div>
          <div class="mobile-detail-item">
            <span class="mobile-detail-label">المخزن:</span>
            <span class="mobile-detail-value">{{ getWarehouseLabel(item.warehouse_id) }}</span>
          </div>
          <div class="mobile-detail-item">
            <span class="mobile-detail-label">المورد:</span>
            <span class="mobile-detail-value">{{ item.supplier || '-' }}</span>
          </div>
          <div class="mobile-detail-item">
            <span class="mobile-detail-label">المكان:</span>
            <span class="mobile-detail-value">{{ item.item_location || '-' }}</span>
          </div>
          <div class="mobile-detail-item">
            <span class="mobile-detail-label">الكراتين:</span>
            <span class="mobile-detail-value">{{ item.cartons_count }}</span>
          </div>
          <div class="mobile-detail-item">
            <span class="mobile-detail-label">في الكرتونة:</span>
            <span class="mobile-detail-value">{{ item.per_carton_count }}</span>
          </div>
          <div class="mobile-detail-item">
            <span class="mobile-detail-label">الفردي:</span>
            <span class="mobile-detail-value">{{ item.single_bottles_count }}</span>
          </div>
          <div class="mobile-detail-item">
            <span class="mobile-detail-label">المضاف:</span>
            <span class="mobile-detail-value">{{ item.total_added }}</span>
          </div>
          <div class="mobile-detail-item">
            <span class="mobile-detail-label">المتبقي:</span>
            <span class="mobile-detail-value">{{ item.remaining_quantity }}</span>
          </div>
        </div>
        <div class="mobile-item-footer">
          <span :class="getStockStatusClass(item.remaining_quantity)" class="stock-status">
            {{ getStockStatus(item.remaining_quantity) }}
          </span>
          <div class="mobile-item-actions">
            <!-- Mobile Actions -->
            <div v-if="!readonly" class="mobile-action-buttons">
              <button 
                @click="$emit('transfer', item)"
                class="action-btn action-btn-transfer"
                title="نقل"
              >
                <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                </svg>
                <span class="action-text">نقل</span>
              </button>
              <button 
                @click="$emit('dispatch', item)"
                class="action-btn action-btn-dispatch"
                title="صرف"
              >
                <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                <span class="action-text">صرف</span>
              </button>
              <!-- Mobile Edit/Delete buttons for superadmin/warehouse_manager -->
              <div v-if="showAdminControls" class="admin-action-buttons">
                <button 
                  @click="$emit('edit', item)"
                  class="action-btn action-btn-edit"
                  title="تعديل"
                >
                  <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  <span class="action-text">تعديل</span>
                </button>
                <button 
                  @click="$emit('delete', item)"
                  class="action-btn action-btn-delete"
                  title="حذف"
                >
                  <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  <span class="action-text">حذف</span>
                </button>
              </div>
            </div>
            <div class="mobile-item-date">
              {{ formatDate(item.updated_at) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop Table View -->
    <div class="table-view">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr class="table-header-row">
              <th class="table-header-cell">الاسم</th>
              <th class="table-header-cell">الكود</th>
              <th class="table-header-cell">اللون</th>
              <th class="table-header-cell">المخزن</th>
              <th class="table-header-cell">المورد</th>
              <th class="table-header-cell">مكان الصنف</th>
              <th class="table-header-cell">الكراتين</th>
              <th class="table-header-cell">في الكرتونة</th>
              <th class="table-header-cell">الفردي</th>
              <th class="table-header-cell">المضاف</th>
              <th class="table-header-cell">المتبقي</th>
              <th class="table-header-cell">الحالة</th>
              <th v-if="!readonly" class="table-header-cell">الإجراءات</th>
              <th class="table-header-cell">آخر تحديث</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="item in items" 
              :key="item.id"
              class="table-row"
            >
              <td class="table-cell">{{ item.name }}</td>
              <td class="table-cell table-cell-mono">{{ item.code }}</td>
              <td class="table-cell">{{ item.color }}</td>
              <td class="table-cell">{{ getWarehouseLabel(item.warehouse_id) }}</td>
              <td class="table-cell">{{ item.supplier || '-' }}</td>
              <td class="table-cell">{{ item.item_location || '-' }}</td>
              <td class="table-cell">{{ item.cartons_count }}</td>
              <td class="table-cell">{{ item.per_carton_count }}</td>
              <td class="table-cell">{{ item.single_bottles_count }}</td>
              <td class="table-cell">{{ item.total_added }}</td>
              <td class="table-cell" 
                :class="getQuantityClass(item.remaining_quantity)">
                {{ item.remaining_quantity }}
              </td>
              <td class="table-cell">
                <span :class="getStockStatusClass(item.remaining_quantity)" class="stock-status">
                  {{ getStockStatus(item.remaining_quantity) }}
                </span>
              </td>
              <td v-if="!readonly" class="table-cell">
                <div class="action-buttons">
                  <!-- Transfer and Dispatch buttons -->
                  <div class="main-action-buttons">
                    <button 
                      @click="$emit('transfer', item)"
                      class="action-btn action-btn-transfer"
                      title="نقل"
                    >
                      <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                      </svg>
                      <span class="action-text">نقل</span>
                    </button>
                    <button 
                      @click="$emit('dispatch', item)"
                      class="action-btn action-btn-dispatch"
                      title="صرف"
                    >
                      <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      <span class="action-text">صرف</span>
                    </button>
                  </div>
                  
                  <!-- Edit/Delete buttons (only for superadmin/warehouse_manager) -->
                  <div v-if="showAdminControls" class="admin-action-buttons">
                    <button 
                      @click="$emit('edit', item)"
                      class="action-btn action-btn-edit"
                      title="تعديل"
                    >
                      <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                      <span class="action-text">تعديل</span>
                    </button>
                    <button 
                      @click="$emit('delete', item)"
                      class="action-btn action-btn-delete"
                      title="حذف"
                    >
                      <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      <span class="action-text">حذف</span>
                    </button>
                  </div>
                </div>
              </td>
              <td class="table-cell">
                <span class="date-text">{{ formatDate(item.updated_at) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="items.length === 0" class="empty-state">
      <svg class="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
      </svg>
      <h3 class="empty-state-title">لا توجد بيانات</h3>
      <p class="empty-state-text">لم يتم إضافة أي أصناف بعد.</p>
    </div>
  </div>
</template>

<script>
import { WAREHOUSE_LABELS } from '@/services/inventoryService';

export default {
  name: 'InventoryTable',
  props: {
    items: {
      type: Array,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    userRole: {
      type: String,
      default: ''
    },
    showActions: {
      type: Boolean,
      default: true
    }
  },
  emits: ['transfer', 'dispatch', 'edit', 'delete'],
  computed: {
    showAdminControls() {
      return (this.userRole === 'superadmin' || this.userRole === 'warehouse_manager') && this.showActions;
    }
  },
  methods: {
    getStockStatus(quantity) {
      if (quantity === 0) return 'نفذ';
      if (quantity < 10) return 'منخفض';
      return 'متوفر';
    },
    
    getStockStatusClass(quantity) {
      if (quantity === 0) return 'badge badge-danger';
      if (quantity < 10) return 'badge badge-warning';
      return 'badge badge-success';
    },

    getQuantityClass(quantity) {
      if (quantity === 0) return 'quantity-danger';
      if (quantity < 10) return 'quantity-warning';
      return 'quantity-success';
    },
    
    getWarehouseLabel(warehouseId) {
      return WAREHOUSE_LABELS[warehouseId] || warehouseId;
    },
    
    formatDate(date) {
      if (!date) return '-';
      
      // Handle Firestore Timestamp
      const dateObj = date.toDate ? date.toDate() : new Date(date);
      
      return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj);
    }
  }
};
</script>

<style scoped>
/* Card container */
.card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.dark .card {
  background-color: #1f2937;
  border-color: #374151;
}

/* Mobile view */
.mobile-view {
  display: block;
}

@media (min-width: 768px) {
  .mobile-view {
    display: none;
  }
}

.mobile-item {
  border-bottom: 1px solid #f3f4f6;
  padding: 1rem;
}

.dark .mobile-item {
  border-bottom-color: #374151;
}

.mobile-item:last-child {
  border-bottom: none;
}

.mobile-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.mobile-item-name {
  font-weight: 500;
  font-size: 0.875rem;
  color: #1f2937;
}

.dark .mobile-item-name {
  color: #f3f4f6;
}

.mobile-item-code {
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .mobile-item-code {
  color: #9ca3af;
}

.mobile-item-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.dark .mobile-item-details {
  color: #9ca3af;
}

.mobile-detail-item {
  display: flex;
  justify-content: space-between;
}

.mobile-detail-label {
  color: #9ca3af;
  margin-left: 0.25rem;
}

.dark .mobile-detail-label {
  color: #6b7280;
}

.mobile-detail-value {
  color: #374151;
}

.dark .mobile-detail-value {
  color: #d1d5db;
}

.mobile-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.mobile-action-buttons {
  display: flex;
  gap: 0.25rem;
}

.mobile-item-date {
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .mobile-item-date {
  color: #9ca3af;
}

/* Desktop table view */
.table-view {
  display: none;
  width: 100%;
}

@media (min-width: 768px) {
  .table-view {
    display: block;
  }
}

.table-container {
  overflow-x: auto;
  max-height: calc(100vh - 200px);
  position: relative;
}

.table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
}

/* Static header */
.table-header-row {
  position: sticky;
  top: 0;
  z-index: 10;
}

.table-header-cell {
  padding: 0.75rem 1rem;
  text-align: right;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 20;
}

.dark .table-header-cell {
  color: #9ca3af;
  background-color: #1f2937;
  border-bottom-color: #374151;
}

.table-row {
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.15s;
}

.dark .table-row {
  border-bottom-color: #374151;
}

.table-row:hover {
  background-color: #f9fafb;
}

.dark .table-row:hover {
  background-color: #374151;
}

.table-cell {
  padding: 1rem;
  font-size: 0.875rem;
  color: #374151;
  white-space: nowrap;
}

.dark .table-cell {
  color: #d1d5db;
}

.table-cell-mono {
  font-family: monospace;
}

/* Column widths */
.table-header-cell:nth-child(1),
.table-cell:nth-child(1) {
  min-width: 150px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-header-cell:nth-child(2),
.table-cell:nth-child(2) {
  min-width: 100px;
}

.table-header-cell:nth-child(3),
.table-cell:nth-child(3) {
  min-width: 80px;
}

.table-header-cell:nth-child(4),
.table-cell:nth-child(4) {
  min-width: 100px;
}

.table-header-cell:nth-child(5),
.table-cell:nth-child(5) {
  min-width: 120px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-header-cell:nth-child(6),
.table-cell:nth-child(6) {
  min-width: 120px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-header-cell:nth-child(7),
.table-cell:nth-child(7) {
  min-width: 80px;
}

.table-header-cell:nth-child(8),
.table-cell:nth-child(8) {
  min-width: 100px;
}

.table-header-cell:nth-child(9),
.table-cell:nth-child(9) {
  min-width: 80px;
}

.table-header-cell:nth-child(10),
.table-cell:nth-child(10) {
  min-width: 80px;
}

.table-header-cell:nth-child(11),
.table-cell:nth-child(11) {
  min-width: 80px;
}

.table-header-cell:nth-child(12),
.table-cell:nth-child(12) {
  min-width: 90px;
}

.table-header-cell:nth-child(13),
.table-cell:nth-child(13) {
  min-width: 200px;
}

.table-header-cell:nth-child(14),
.table-cell:nth-child(14) {
  min-width: 140px;
}

/* Quantity classes */
.quantity-success {
  font-weight: 500;
  color: #059669;
}

.dark .quantity-success {
  color: #10b981;
}

.quantity-warning {
  font-weight: 500;
  color: #d97706;
}

.dark .quantity-warning {
  color: #fbbf24;
}

.quantity-danger {
  font-weight: 500;
  color: #dc2626;
}

.dark .quantity-danger {
  color: #f87171;
}

/* Stock status badges */
.stock-status {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-success {
  background-color: #dcfce7;
  color: #166534;
}

.dark .badge-success {
  background-color: #064e3b;
  color: #a7f3d0;
}

.badge-warning {
  background-color: #fef3c7;
  color: #92400e;
}

.dark .badge-warning {
  background-color: #78350f;
  color: #fde68a;
}

.badge-danger {
  background-color: #fee2e2;
  color: #991b1b;
}

.dark .badge-danger {
  background-color: #7f1d1d;
  color: #fca5a5;
}

/* Action buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

@media (min-width: 1024px) {
  .action-buttons {
    flex-direction: row;
    gap: 0.5rem;
  }
}

.main-action-buttons,
.admin-action-buttons {
  display: flex;
  gap: 0.25rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;
}

.action-icon {
  width: 0.75rem;
  height: 0.75rem;
  margin-left: 0.25rem;
}

.action-text {
  font-size: 0.75rem;
}

/* Transfer button */
.action-btn-transfer {
  background-color: #dcfce7;
  color: #166534;
}

.dark .action-btn-transfer {
  background-color: #064e3b;
  color: #a7f3d0;
}

.action-btn-transfer:hover {
  background-color: #bbf7d0;
}

.dark .action-btn-transfer:hover {
  background-color: #065f46;
}

/* Dispatch button */
.action-btn-dispatch {
  background-color: #f3e8ff;
  color: #7c3aed;
}

.dark .action-btn-dispatch {
  background-color: #5b21b6;
  color: #ddd6fe;
}

.action-btn-dispatch:hover {
  background-color: #e9d5ff;
}

.dark .action-btn-dispatch:hover {
  background-color: #6d28d9;
}

/* Edit button */
.action-btn-edit {
  background-color: #dbeafe;
  color: #1e40af;
}

.dark .action-btn-edit {
  background-color: #1e3a8a;
  color: #93c5fd;
}

.action-btn-edit:hover {
  background-color: #bfdbfe;
}

.dark .action-btn-edit:hover {
  background-color: #1e3a8a;
}

/* Delete button */
.action-btn-delete {
  background-color: #fee2e2;
  color: #991b1b;
}

.dark .action-btn-delete {
  background-color: #7f1d1d;
  color: #fca5a5;
}

.action-btn-delete:hover {
  background-color: #fecaca;
}

.dark .action-btn-delete:hover {
  background-color: #991b1b;
}

/* Date text */
.date-text {
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .date-text {
  color: #9ca3af;
}

/* Empty state */
.empty-state {
  padding: 3rem 1rem;
  text-align: center;
}

.empty-state-icon {
  width: 3rem;
  height: 3rem;
  color: #9ca3af;
  margin: 0 auto;
}

.dark .empty-state-icon {
  color: #6b7280;
}

.empty-state-title {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.dark .empty-state-title {
  color: #f3f4f6;
}

.empty-state-text {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .empty-state-text {
  color: #9ca3af;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .mobile-detail-item {
    display: flex;
    flex-direction: column;
  }
  
  .mobile-detail-label {
    margin-left: 0;
    margin-bottom: 0.125rem;
  }
  
  .mobile-action-buttons {
    flex-wrap: wrap;
  }
  
  .action-btn {
    padding: 0.125rem 0.375rem;
  }
}

@media (max-width: 768px) {
  .table-cell {
    padding: 0.75rem 0.5rem;
    font-size: 0.75rem;
  }
  
  .table-header-cell {
    padding: 0.5rem;
    font-size: 0.7rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}

/* Scrollbar styling */
.table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.dark .table-container::-webkit-scrollbar-track {
  background: #374151;
}

.table-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.dark .table-container::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.dark .table-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>