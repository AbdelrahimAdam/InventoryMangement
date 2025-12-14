<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  async mounted() {
    // Initialize module first
    await this.initializeInventoryModule();
    
    // Load inventory
    await this.loadInventory();
  },
  
  computed: {
    ...mapGetters('inventory', [
      'paginatedInventory',
      'paginationInfo',
      'readLimitWarning'
    ]),
    
    ...mapGetters([
      'inventoryItems', // From main store
      'userProfile'
    ])
  },
  
  methods: {
    ...mapActions('inventory', [
      'initialize',
      'loadNextPage',
      'updateFilters',
      'searchItems'
    ]),
    
    ...mapActions([
      'fetchRecentInventory' // From main store
    ]),
    
    async initializeInventoryModule() {
      await this.initialize();
    },
    
    async loadInventory() {
      await this.fetchRecentInventory();
    },
    
    async handleSearch(searchTerm) {
      const results = await this.searchItems({ searchTerm });
      // Use results...
    }
  }
};
</script>