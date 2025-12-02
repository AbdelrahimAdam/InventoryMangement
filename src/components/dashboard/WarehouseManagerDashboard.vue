<template>
  <div class="space-y-6">
    <!-- Quick Actions -->
    <div class="bg-white shadow rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">إدارة المخزون</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button @click="showAddItemModal = true" 
                class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          إضافة صنف جديد
        </button>
        <button @click="showTransferModal = true"
                class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          نقل بين المخازن
        </button>
        <button @click="exportData"
                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          تصدير البيانات
        </button>
      </div>
    </div>

    <!-- Inventory Table -->
    <InventoryTable :items="filteredInventory" />

    <!-- Modals -->
    <AddItemModal 
      :isOpen="showAddItemModal" 
      @close="showAddItemModal = false"
      @success="handleItemAdded"
    />

    <TransferModal 
      :isOpen="showTransferModal"
      @close="showTransferModal = false"
      @success="handleTransferSuccess"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import InventoryTable from '@/components/inventory/InventoryTable.vue';
import AddItemModal from '@/components/inventory/AddItemModal.vue';
import TransferModal from '@/components/inventory/TransferModal.vue';
import { ExportUtils } from '@/utils/exportUtils';

export default {
  name: 'WarehouseManagerDashboard',
  components: {
    InventoryTable,
    AddItemModal,
    TransferModal
  },
  setup() {
    const store = useStore();
    
    const showAddItemModal = ref(false);
    const showTransferModal = ref(false);

    const filteredInventory = computed(() => store.getters.filteredInventory);

    const handleItemAdded = () => {
      store.dispatch('subscribeToInventory');
    };

    const handleTransferSuccess = () => {
      store.dispatch('subscribeToInventory');
    };

    const exportData = () => {
      const data = ExportUtils.formatInventoryForExport(filteredInventory.value);
      ExportUtils.exportToExcel(data, `inventory-${new Date().toISOString().split('T')[0]}`);
    };

    return {
      showAddItemModal,
      showTransferModal,
      filteredInventory,
      handleItemAdded,
      handleTransferSuccess,
      exportData
    };
  }
};
</script>