export default {
  state: {
    inventory: [],
    paginatedInventory: [], // NEW: Store only paginated items
    stats: null,
    pagination: { // NEW: Pagination state
      currentPage: 1,
      pageSize: 20,
      totalItems: 0,
      totalPages: 0,
      hasMore: false
    },
    filters: {
      warehouse: '',
      status: '',
      search: ''
    }
  },

  getters: {
    // Get paginated items (already filtered and paginated)
    inventory: (state) => state.paginatedInventory,
    
    // Get all items for filtering/stats
    allInventory: (state) => state.inventory,
    
    inventoryStats: (state) => state.stats,
    
    pagination: (state) => state.pagination
  },

  mutations: {
    SET_INVENTORY(state, inventory) {
      state.inventory = inventory;
      state.pagination.totalItems = inventory.length;
      state.pagination.totalPages = Math.ceil(inventory.length / state.pagination.pageSize);
      state.pagination.hasMore = state.pagination.currentPage < state.pagination.totalPages;
      
      // Apply pagination
      this.commit('UPDATE_PAGINATED_INVENTORY');
    },

    UPDATE_PAGINATED_INVENTORY(state) {
      const start = (state.pagination.currentPage - 1) * state.pagination.pageSize;
      const end = start + state.pagination.pageSize;
      
      // Apply filters before pagination
      let filtered = [...state.inventory];
      
      if (state.filters.warehouse) {
        filtered = filtered.filter(item => item.warehouse_id === state.filters.warehouse);
      }
      
      if (state.filters.status) {
        filtered = filtered.filter(item => {
          const qty = item.remaining_quantity || 0;
          if (state.filters.status === 'in_stock') return qty >= 10;
          if (state.filters.status === 'low_stock') return qty > 0 && qty < 10;
          if (state.filters.status === 'out_of_stock') return qty === 0;
          return true;
        });
      }
      
      if (state.filters.search) {
        const term = state.filters.search.toLowerCase();
        filtered = filtered.filter(item => 
          (item.name || '').toLowerCase().includes(term) ||
          (item.code || '').toLowerCase().includes(term) ||
          (item.supplier || '').toLowerCase().includes(term)
        );
      }
      
      // Update total count after filtering
      state.pagination.totalItems = filtered.length;
      state.pagination.totalPages = Math.ceil(filtered.length / state.pagination.pageSize);
      
      // Paginate
      state.paginatedInventory = filtered.slice(start, end);
    },

    SET_PAGE(state, page) {
      state.pagination.currentPage = page;
      this.commit('UPDATE_PAGINATED_INVENTORY');
    },

    SET_PAGE_SIZE(state, size) {
      state.pagination.pageSize = size;
      state.pagination.currentPage = 1; // Reset to first page
      this.commit('UPDATE_PAGINATED_INVENTORY');
    },

    UPDATE_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters };
      state.pagination.currentPage = 1; // Reset to first page on filter change
      this.commit('UPDATE_PAGINATED_INVENTORY');
    },

    ADD_INVENTORY_ITEM(state, item) {
      // Add to beginning of all inventory
      state.inventory.unshift(item);
      
      // Update stats
      if (!state.stats) {
        state.stats = { totalItems: 0, totalQuantity: 0, lowStockItems: 0 };
      }
      state.stats.totalItems++;
      state.stats.totalQuantity += (item.remaining_quantity || 0);
      if (item.remaining_quantity > 0 && item.remaining_quantity < 10) {
        state.stats.lowStockItems++;
      }
      
      // Update paginated view
      this.commit('UPDATE_PAGINATED_INVENTORY');
    },

    UPDATE_INVENTORY_ITEM(state, updatedItem) {
      const index = state.inventory.findIndex(item => item.id === updatedItem.id);
      if (index !== -1) {
        state.inventory[index] = updatedItem;
        this.commit('UPDATE_PAGINATED_INVENTORY');
      }
    },

    SET_STATS(state, stats) {
      state.stats = stats;
    }
  },

  actions: {
    // NEW: Optimized fetch with server-side pagination
    async fetchInventory({ commit, state }) {
      try {
        const { db } = await import('@/firebase/config');
        const { collection, query, orderBy, limit, getDocs } = await import('firebase/firestore');
        
        // Load only first page from server
        const itemsQuery = query(
          collection(db, 'items'),
          orderBy('updated_at', 'desc'),
          limit(50) // Start with only 50 items
        );
        
        const snapshot = await getDocs(itemsQuery);
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        commit('SET_INVENTORY', items);
        
        // Load stats separately
        await commit.dispatch('fetchInventoryStats');
        
      } catch (error) {
        console.error('Error fetching inventory:', error);
        throw error;
      }
    },

    async fetchInventoryStats({ commit }) {
      try {
        const { db } = await import('@/firebase/config');
        const { collection, getCountFromServer } = await import('firebase/firestore');
        
        // Get total count
        const coll = collection(db, 'items');
        const snapshot = await getCountFromServer(coll);
        const totalItems = snapshot.data().count;
        
        // Get low stock count (you might need to adjust this query)
        // For now, we'll calculate from loaded items
        
        commit('SET_STATS', {
          totalItems,
          totalQuantity: 0, // You can calculate this from loaded items
          lowStockItems: 0
        });
        
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    },

    loadMoreItems({ commit, state }) {
      if (state.pagination.hasMore) {
        commit('SET_PAGE', state.pagination.currentPage + 1);
        return true;
      }
      return false;
    },

    updateFilters({ commit }, filters) {
      commit('UPDATE_FILTERS', filters);
    }
  }
};