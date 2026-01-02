<template>
  <div class="warehouse-selector">
    <div class="selector-header">
      <h4><i class="fas fa-warehouse"></i> المخازن المسموحة</h4>
      <button 
        @click="toggleSelectAll" 
        class="select-all-btn"
        :class="{ 'selected': selectAll }"
        type="button"
      >
        {{ selectAll ? 'إلغاء تحديد الكل' : 'تحديد الكل' }}
      </button>
    </div>
    
    <div class="warehouse-list">
      <!-- All Warehouses Option -->
      <label class="warehouse-item all-warehouses">
        <input
          type="checkbox"
          :checked="selectAll"
          @change="handleAllWarehousesChange"
          :disabled="disabled"
        >
        <span class="checkbox-custom"></span>
        <div class="warehouse-info">
          <i class="fas fa-globe"></i>
          <div class="warehouse-details">
            <span class="warehouse-name">جميع المخازن</span>
            <small class="warehouse-description">الوصول إلى جميع المخازن في النظام</small>
          </div>
        </div>
      </label>
      
      <!-- Individual Warehouses -->
      <div v-if="!selectAll" class="individual-warehouses">
        <label 
          v-for="warehouse in warehouses" 
          :key="warehouse.id"
          class="warehouse-item"
          :class="{ 'disabled': disabled }"
        >
          <input
            type="checkbox"
            :value="warehouse.id"
            v-model="selectedWarehouses"
            :disabled="disabled"
          >
          <span class="checkbox-custom"></span>
          <div class="warehouse-info">
            <i :class="getWarehouseIcon(warehouse.type)"></i>
            <div class="warehouse-details">
              <span class="warehouse-name">{{ warehouse.name_ar || warehouse.name }}</span>
              <small class="warehouse-type">{{ getWarehouseTypeLabel(warehouse.type) }}</small>
              <small v-if="warehouse.location" class="warehouse-location">
                <i class="fas fa-map-marker-alt"></i> {{ warehouse.location }}
              </small>
            </div>
          </div>
        </label>
      </div>
    </div>
    
    <div v-if="!selectAll && selectedWarehouses.length > 0" class="selection-summary">
      <i class="fas fa-check-circle"></i>
      تم اختيار {{ selectedWarehouses.length }} من {{ warehouses.length }} مخزن
    </div>
    
    <div v-else-if="selectAll" class="selection-summary all-selected">
      <i class="fas fa-check-circle"></i>
      تم اختيار جميع المخازن
    </div>
  </div>
</template>

<script>
export default {
  name: 'WarehouseSelector',
  
  props: {
    value: {
      type: Array,
      default: () => []
    },
    warehouses: {
      type: Array,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      selectedWarehouses: [...this.value],
      selectAll: this.value.includes('all')
    }
  },
  
  watch: {
    value(newVal) {
      this.selectedWarehouses = [...newVal]
      this.selectAll = newVal.includes('all')
    },
    
    selectedWarehouses(newVal) {
      if (!this.selectAll) {
        this.$emit('input', newVal)
      }
    },
    
    selectAll(newVal) {
      if (newVal) {
        this.selectedWarehouses = ['all']
        this.$emit('input', ['all'])
      } else {
        this.selectedWarehouses = []
        this.$emit('input', [])
      }
    }
  },
  
  methods: {
    toggleSelectAll() {
      if (this.disabled) return
      this.selectAll = !this.selectAll
    },
    
    handleAllWarehousesChange(event) {
      if (this.disabled) return
      this.selectAll = event.target.checked
    },
    
    getWarehouseIcon(type) {
      const icons = {
        'primary': 'fas fa-warehouse',
        'dispatch': 'fas fa-truck',
        'storage': 'fas fa-box',
        'default': 'fas fa-building'
      }
      return icons[type] || icons.default
    },
    
    getWarehouseTypeLabel(type) {
      const labels = {
        'primary': 'مخزن رئيسي',
        'dispatch': 'مخزن صرف',
        'storage': 'مخزن تخزين',
        'default': 'مخزن'
      }
      return labels[type] || labels.default
    }
  }
}
</script>

<style scoped>
.warehouse-selector {
  background: var(--bg-input, #f5f5f5);
  border: 1px solid var(--border-color, #ddd);
  border-radius: 8px;
  padding: 1rem;
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color, #ddd);
}

.selector-header h4 {
  margin: 0;
  font-size: 1rem;
  color: var(--text-primary, #333);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.select-all-btn {
  background: none;
  border: 1px solid var(--primary-color, #2196F3);
  color: var(--primary-color, #2196F3);
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.select-all-btn:hover {
  background: var(--primary-color, #2196F3);
  color: white;
}

.select-all-btn.selected {
  background: var(--primary-color, #2196F3);
  color: white;
}

.select-all-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.warehouse-list {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.warehouse-item {
  display: flex;
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
  border: 1px solid transparent;
}

.warehouse-item:hover {
  background: rgba(33, 150, 243, 0.05);
  border-color: rgba(33, 150, 243, 0.2);
}

.warehouse-item.all-warehouses {
  background: rgba(76, 175, 80, 0.05);
  border-color: rgba(76, 175, 80, 0.2);
}

.warehouse-item input[type="checkbox"] {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  min-width: 18px;
  border: 2px solid var(--border-color, #ddd);
  border-radius: 4px;
  margin-top: 0.25rem;
  position: relative;
  transition: all 0.2s;
}

.warehouse-item input[type="checkbox"]:checked + .checkbox-custom {
  border-color: var(--primary-color, #2196F3);
  background: var(--primary-color, #2196F3);
}

.warehouse-item.all-warehouses input[type="checkbox"]:checked + .checkbox-custom {
  border-color: var(--success-color, #4CAF50);
  background: var(--success-color, #4CAF50);
}

.checkbox-custom::after {
  content: '\f00c';
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.75rem;
  opacity: 0;
}

.warehouse-item input[type="checkbox"]:checked + .checkbox-custom::after {
  opacity: 1;
}

.warehouse-info {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex: 1;
}

.warehouse-info i {
  font-size: 1.25rem;
  color: var(--info-color, #2196F3);
  margin-top: 0.125rem;
}

.warehouse-item.all-warehouses .warehouse-info i {
  color: var(--success-color, #4CAF50);
}

.warehouse-details {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.warehouse-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary, #333);
}

.warehouse-description {
  font-size: 0.75rem;
  color: var(--text-secondary, #666);
}

.warehouse-type {
  font-size: 0.75rem;
  color: var(--info-color, #2196F3);
  background: rgba(33, 150, 243, 0.1);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  align-self: flex-start;
}

.warehouse-location {
  font-size: 0.75rem;
  color: var(--text-muted, #888);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.125rem;
}

.individual-warehouses {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-color, #ddd);
}

.selection-summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  margin-top: 1rem;
  background: rgba(33, 150, 243, 0.1);
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--info-color, #2196F3);
}

.selection-summary.all-selected {
  background: rgba(76, 175, 80, 0.1);
  color: var(--success-color, #4CAF50);
}

.selection-summary i {
  font-size: 1rem;
}

/* Dark Mode Support */
.warehouse-selector.dark-mode {
  background: #2d2d2d;
  border-color: #404040;
}

.warehouse-selector.dark-mode .warehouse-name {
  color: #ffffff;
}

.warehouse-selector.dark-mode .warehouse-description {
  color: #b0b0b0;
}

/* Responsive */
@media (max-width: 768px) {
  .selector-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .select-all-btn {
    align-self: flex-end;
  }
}
</style>