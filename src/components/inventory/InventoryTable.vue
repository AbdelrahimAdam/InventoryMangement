<template>
  <div class="card">
    <!-- Export Buttons -->
    <div v-if="items.length > 0 && canExport" class="export-container">
      <button 
        @click="exportSingleCard" 
        class="export-btn"
        :disabled="exporting"
      >
        <svg class="export-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span v-if="!exporting">تصدير كرت مفرد</span>
        <span v-else>جاري التصدير...</span>
      </button>
      <button 
        @click="exportAllCards" 
        class="export-btn export-all-btn"
        :disabled="exporting"
      >
        <svg class="export-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <span v-if="!exporting">تصدير جميع الكروت</span>
        <span v-else>جاري التصدير...</span>
      </button>
    </div>

    <!-- Desktop Table View -->
    <div class="table-view">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr class="table-header-row">
              <th v-if="showPhotoColumn" class="table-header-cell">الصورة</th>
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
              <th v-if="!readonly && showActions" class="table-header-cell">الإجراءات</th>
              <th class="table-header-cell">آخر تحديث</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="item in items" 
              :key="item.id"
              class="table-row"
            >
              <!-- Photo Column -->
              <td v-if="showPhotoColumn" class="table-cell photo-cell">
                <div v-if="item.photo_url" class="photo-container">
                  <img 
                    :src="getPhotoUrl(item.photo_url)" 
                    :alt="item.name"
                    class="item-photo"
                    @click="openPhotoPreview(getPhotoUrl(item.photo_url))"
                  />
                </div>
                <div v-else class="no-photo">
                  <svg class="no-photo-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </td>
              
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
              <td v-if="!readonly && showActions" class="table-cell">
                <div class="action-buttons">
                  <!-- Transfer and Dispatch buttons -->
                  <div class="main-action-buttons">
                    <button 
                      v-if="canTransferItem(item)"
                      @click="handleTransfer(item)"
                      class="action-btn action-btn-transfer"
                      title="نقل"
                    >
                      <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                      </svg>
                      <span class="action-text">نقل</span>
                    </button>
                    <button 
                      v-if="canDispatchItem(item)"
                      @click="handleDispatch(item)"
                      class="action-btn action-btn-dispatch"
                      title="صرف"
                    >
                      <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      <span class="action-text">صرف</span>
                    </button>
                  </div>
                  
                  <!-- Edit/Delete buttons -->
                  <div v-if="showAdminControls" class="admin-action-buttons">
                    <button 
                      v-if="canEditItem(item)"
                      @click="handleEdit(item)"
                      class="action-btn action-btn-edit"
                      title="تعديل"
                    >
                      <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                      <span class="action-text">تعديل</span>
                    </button>
                    <button 
                      v-if="canDeleteItem(item)"
                      @click="handleDelete(item)"
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

    <!-- Photo Preview Modal -->
    <div v-if="showPhotoModal" class="photo-modal" @click="closePhotoPreview">
      <div class="photo-modal-content" @click.stop>
        <button class="close-modal-btn" @click="closePhotoPreview">
          <svg class="close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img :src="selectedPhotoUrl" class="modal-photo" />
      </div>
    </div>

    <!-- Progress Dialog -->
    <div v-if="exportProgress.show" class="progress-modal">
      <div class="progress-modal-content">
        <h3 class="progress-title">جاري تصدير كروت الأصناف</h3>
        <div class="progress-info">
          <div class="progress-text">
            {{ exportProgress.status }}
          </div>
          <div class="progress-details">
            {{ exportProgress.details }}
          </div>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: exportProgress.percentage + '%' }"></div>
        </div>
        <div class="progress-stats">
          <span>تم تصدير {{ exportProgress.processed }} من {{ exportProgress.total }}</span>
        </div>
        <button v-if="exportProgress.completed" @click="closeProgressDialog" class="close-progress-btn">
          إغلاق
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
    showActions: {
      type: Boolean,
      default: true
    },
    showPhotoColumn: {
      type: Boolean,
      default: true
    }
  },
  emits: ['transfer', 'dispatch', 'edit', 'delete'],
  data() {
    return {
      exporting: false,
      showPhotoModal: false,
      selectedPhotoUrl: '',
      exportProgress: {
        show: false,
        status: '',
        details: '',
        percentage: 0,
        processed: 0,
        total: 0,
        completed: false
      }
    };
  },
  computed: {
    ...mapGetters([
      'userRole',
      'allowedWarehouses',
      'canEdit',
      'canDelete',
      'canDispatch',
      'getWarehouseLabel',
      'getArabicLabel'
    ]),
    ...mapState({
      storeUserProfile: state => state.userProfile,
      storeWarehouses: state => state.warehouses,
      storeTransactions: state => state.transactions
    }),
    showAdminControls() {
      return (this.userRole === 'superadmin' || this.userRole === 'warehouse_manager') && this.showActions;
    },
    canExport() {
      return ['superadmin', 'warehouse_manager', 'company_manager'].includes(this.userRole);
    }
  },
  methods: {
    getPhotoUrl(photoUrl) {
      // تحويل Data URL إلى صيغة يمكن الوصول إليها
      if (!photoUrl) return '';
      
      // إذا كانت base64 Data URL
      if (photoUrl.startsWith('data:image/')) {
        return photoUrl;
      }
      
      // إذا كانت رابط Firebase Storage
      if (photoUrl.startsWith('https://')) {
        return photoUrl;
      }
      
      // إرجاع الرابط كما هو مع تعديل إذا لزم الأمر
      return photoUrl;
    },
    
    // إصلاح مشكلة الصور في العرض
    handleTransfer(item) {
      this.$emit('transfer', item);
    },
    
    handleDispatch(item) {
      this.$emit('dispatch', item);
    },
    
    handleEdit(item) {
      this.$emit('edit', item);
    },
    
    handleDelete(item) {
      this.$emit('delete', item);
    },
    
    canTransferItem(item) {
      if (!this.showActions || this.readonly) return false;
      if (!['superadmin', 'warehouse_manager'].includes(this.userRole)) return false;
      if (this.userRole === 'warehouse_manager') {
        const allowedWarehouses = this.allowedWarehouses || [];
        if (allowedWarehouses.length > 0 && !allowedWarehouses.includes(item.warehouse_id)) {
          return false;
        }
      }
      return item.remaining_quantity > 0;
    },
    
    canDispatchItem(item) {
      if (!this.showActions || this.readonly) return false;
      if (this.userRole !== 'superadmin') {
        if (this.userRole === 'warehouse_manager') {
          const userPermissions = this.storeUserProfile?.permissions || [];
          if (!userPermissions.includes('dispatch_items')) {
            return false;
          }
        } else {
          return false;
        }
      }
      if (this.userRole === 'warehouse_manager') {
        const allowedWarehouses = this.allowedWarehouses || [];
        if (allowedWarehouses.length > 0 && !allowedWarehouses.includes(item.warehouse_id)) {
          return false;
        }
      }
      return item.remaining_quantity > 0;
    },
    
    canEditItem(item) {
      if (!this.showActions || this.readonly) return false;
      if (!this.canEdit) return false;
      if (this.userRole === 'warehouse_manager') {
        const allowedWarehouses = this.allowedWarehouses || [];
        if (allowedWarehouses.length > 0 && !allowedWarehouses.includes(item.warehouse_id)) {
          return false;
        }
      }
      return true;
    },
    
    canDeleteItem(item) {
      if (!this.showActions || this.readonly) return false;
      if (!this.canDelete) return false;
      if (this.userRole === 'warehouse_manager') {
        const allowedWarehouses = this.allowedWarehouses || [];
        if (allowedWarehouses.length > 0 && !allowedWarehouses.includes(item.warehouse_id)) {
          return false;
        }
      }
      return true;
    },
    
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
      if (this.getWarehouseLabel) {
        return this.getWarehouseLabel(warehouseId);
      }
      if (this.storeWarehouses && this.storeWarehouses.length > 0) {
        const warehouse = this.storeWarehouses.find(w => w.id === warehouseId);
        return warehouse ? warehouse.name_ar : warehouseId;
      }
      return warehouseId;
    },
    
    formatDate(date) {
      if (!date) return '-';
      const dateObj = date.toDate ? date.toDate() : new Date(date);
      return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj);
    },
    
    openPhotoPreview(photoUrl) {
      this.selectedPhotoUrl = photoUrl;
      this.showPhotoModal = true;
      document.body.style.overflow = 'hidden';
    },
    
    closePhotoPreview() {
      this.showPhotoModal = false;
      document.body.style.overflow = '';
    },
    
    showProgressDialog(totalItems) {
      this.exportProgress = {
        show: true,
        status: 'جاري تجهيز البيانات...',
        details: '',
        percentage: 0,
        processed: 0,
        total: totalItems,
        completed: false
      };
    },

    updateProgress(status, details, processed, percentage) {
      this.exportProgress.status = status;
      this.exportProgress.details = details;
      this.exportProgress.processed = processed;
      this.exportProgress.percentage = percentage;
    },

    completeProgress() {
      this.exportProgress.status = 'اكتمل التصدير';
      this.exportProgress.details = `تم تصدير ${this.exportProgress.total} كارت بنجاح`;
      this.exportProgress.percentage = 100;
      this.exportProgress.processed = this.exportProgress.total;
      this.exportProgress.completed = true;
    },

    closeProgressDialog() {
      this.exportProgress.show = false;
      this.exporting = false;
    },

    // إعادة كتابة وظائف Excel
    async exportSingleCard() {
      try {
        this.exporting = true;
        const selectedItem = this.items[0];
        if (!selectedItem) {
          this.$store.dispatch('showNotification', {
            type: 'error',
            message: 'يرجى اختيار صنف أولاً'
          });
          return;
        }

        // إنشاء تقرير احترافي
        await this.createProfessionalReport([selectedItem], 'كرت صنف مفرد');
        
      } catch (error) {
        console.error('Error exporting single card:', error);
        this.$store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ أثناء تصدير الكرت المفرد'
        });
      } finally {
        this.exporting = false;
      }
    },

    async exportAllCards() {
      try {
        this.exporting = true;
        const totalItems = this.items.length;
        
        if (totalItems === 0) {
          this.$store.dispatch('showNotification', {
            type: 'info',
            message: 'لا توجد أصناف في المخزون'
          });
          return;
        }

        this.showProgressDialog(totalItems);

        // إنشاء تقرير احترافي لجميع الأصناف
        await this.createProfessionalReport(this.items, 'تقرير المخزون العام');
        
      } catch (error) {
        console.error('Error exporting all cards:', error);
        this.$store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ أثناء تصدير جميع الكروت'
        });
        this.closeProgressDialog();
      }
    },

    async createProfessionalReport(items, reportType) {
      // إنشاء كتيب Excel مع تصميم احترافي
      const wb = XLSX.utils.book_new();
      
      // 1. صفحة ملخص المخزون
      await this.createSummarySheet(wb, items, reportType);
      
      // 2. صفحة التفاصيل الكاملة
      await this.createDetailsSheet(wb, items);
      
      // 3. صفحة الإحصائيات
      await this.createStatisticsSheet(wb, items);
      
      // 4. صفحات الكروت الفردية (لكل صنف)
      await this.createIndividualCards(wb, items);
      
      // حفظ الملف
      const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const filename = `تقرير_المخزون_${timestamp}.xlsx`;
      XLSX.writeFile(wb, filename);
      
      this.completeProgress();
      this.$store.dispatch('showNotification', {
        type: 'success',
        message: `تم إنشاء التقرير بنجاح: ${filename}`
      });
    },

    async createSummarySheet(wb, items, reportType) {
      const wsData = [];
      
      // رأس التقرير
      wsData.push([this.getCompanyHeader()]);
      wsData.push([reportType]);
      wsData.push([`تاريخ الإصدار: ${new Date().toLocaleDateString('ar-EG')}`]);
      wsData.push([]);
      
      // جدول ملخص المخزون
      const headers = [
        'م', 'كود الصنف', 'اسم الصنف', 'اللون', 'المخزن', 
        'الكراتين', 'في الكرتونة', 'الفردي', 'الرصيد الكلي',
        'الحالة', 'المورد', 'آخر تحديث'
      ];
      wsData.push(headers);
      
      items.forEach((item, index) => {
        wsData.push([
          index + 1,
          item.code,
          item.name,
          item.color,
          this.getWarehouseLabel(item.warehouse_id),
          item.cartons_count,
          item.per_carton_count,
          item.single_bottles_count,
          item.remaining_quantity,
          this.getStockStatus(item.remaining_quantity),
          item.supplier || '-',
          this.formatDate(item.updated_at)
        ]);
      });
      
      // الإحصائيات في النهاية
      wsData.push([]);
      wsData.push(['إحصائيات المخزون']);
      wsData.push(['إجمالي الأصناف:', items.length]);
      wsData.push(['إجمالي الرصيد:', items.reduce((sum, item) => sum + item.remaining_quantity, 0)]);
      
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, 'ملخص المخزون');
    },

    async createDetailsSheet(wb, items) {
      const wsData = [];
      
      // رأس الصفحة
      wsData.push([this.getCompanyHeader()]);
      wsData.push(['تفاصيل المخزون']);
      wsData.push([]);
      
      // إنشاء قسم لكل صنف
      items.forEach((item, index) => {
        wsData.push([`الصنف ${index + 1}: ${item.name} (${item.code})`]);
        wsData.push(['كود الصنف:', item.code]);
        wsData.push(['الاسم:', item.name]);
        wsData.push(['اللون:', item.color]);
        wsData.push(['المخزن:', this.getWarehouseLabel(item.warehouse_id)]);
        wsData.push(['مكان التخزين:', item.item_location || '-']);
        wsData.push(['المورد:', item.supplier || '-']);
        wsData.push(['الكراتين:', item.cartons_count]);
        wsData.push(['في الكرتونة:', item.per_carton_count]);
        wsData.push(['الفردي:', item.single_bottles_count]);
        wsData.push(['الرصيد الكلي:', item.remaining_quantity]);
        wsData.push(['الكمية المضافة:', item.total_added]);
        wsData.push(['الحالة:', this.getStockStatus(item.remaining_quantity)]);
        wsData.push(['آخر تحديث:', this.formatDate(item.updated_at)]);
        wsData.push(['ملاحظات:', item.notes || '-']);
        wsData.push([]);
        
        // حركات الصنف
        const transactions = this.getItemTransactions(item.id);
        if (transactions.length > 0) {
          wsData.push(['آخر 5 حركات:']);
          const transHeaders = ['التاريخ', 'نوع الحركة', 'الكمية', 'الجهة', 'ملاحظات', 'الرصيد'];
          wsData.push(transHeaders);
          
          transactions.slice(0, 5).forEach(trans => {
            wsData.push([
              trans.date,
              trans.type,
              trans.quantity,
              trans.party,
              trans.notes,
              trans.balance
            ]);
          });
        }
        wsData.push([]);
        wsData.push(['---']); // فاصل بين الأصناف
        wsData.push([]);
      });
      
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, 'التفاصيل الكاملة');
    },

    async createStatisticsSheet(wb, items) {
      const wsData = [];
      
      // رأس الصفحة
      wsData.push([this.getCompanyHeader()]);
      wsData.push(['الإحصائيات والتحليل']);
      wsData.push([]);
      
      // تحليل حسب المخازن
      const warehouses = {};
      items.forEach(item => {
        const warehouseName = this.getWarehouseLabel(item.warehouse_id);
        if (!warehouses[warehouseName]) {
          warehouses[warehouseName] = {
            count: 0,
            total: 0,
            items: []
          };
        }
        warehouses[warehouseName].count++;
        warehouses[warehouseName].total += item.remaining_quantity;
        warehouses[warehouseName].items.push(item);
      });
      
      wsData.push(['تحليل حسب المخازن']);
      wsData.push(['المخزن', 'عدد الأصناف', 'إجمالي الرصيد', 'النسبة']);
      
      Object.entries(warehouses).forEach(([name, data]) => {
        const percentage = ((data.count / items.length) * 100).toFixed(1);
        wsData.push([name, data.count, data.total, `${percentage}%`]);
      });
      
      wsData.push([]);
      
      // تحليل حسب الحالة
      const statusCounts = {
        متوفر: 0,
        منخفض: 0,
        نفذ: 0
      };
      
      items.forEach(item => {
        const status = this.getStockStatus(item.remaining_quantity);
        statusCounts[status]++;
      });
      
      wsData.push(['تحليل حسب الحالة']);
      wsData.push(['الحالة', 'عدد الأصناف', 'النسبة']);
      
      Object.entries(statusCounts).forEach(([status, count]) => {
        const percentage = ((count / items.length) * 100).toFixed(1);
        wsData.push([status, count, `${percentage}%`]);
      });
      
      wsData.push([]);
      
      // الأصناف التي تحتاج اهتمام
      const lowStockItems = items.filter(item => item.remaining_quantity < 10 && item.remaining_quantity > 0);
      const outOfStockItems = items.filter(item => item.remaining_quantity === 0);
      
      if (lowStockItems.length > 0) {
        wsData.push(['الأصناف ذات المخزون المنخفض (تحت 10 وحدات)']);
        wsData.push(['م', 'الكود', 'الاسم', 'اللون', 'المخزن', 'الرصيد']);
        
        lowStockItems.forEach((item, index) => {
          wsData.push([
            index + 1,
            item.code,
            item.name,
            item.color,
            this.getWarehouseLabel(item.warehouse_id),
            item.remaining_quantity
          ]);
        });
        wsData.push([]);
      }
      
      if (outOfStockItems.length > 0) {
        wsData.push(['الأصناف المنتهية']);
        wsData.push(['م', 'الكود', 'الاسم', 'اللون', 'المخزن']);
        
        outOfStockItems.forEach((item, index) => {
          wsData.push([
            index + 1,
            item.code,
            item.name,
            item.color,
            this.getWarehouseLabel(item.warehouse_id)
          ]);
        });
      }
      
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, 'الإحصائيات');
    },

    async createIndividualCards(wb, items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const percentage = Math.round(((i + 1) / items.length) * 100);
        
        this.updateProgress(
          `جاري إنشاء كروت الأصناف`,
          `جاري إنشاء كارت: ${item.code}`,
          i + 1,
          percentage
        );
        
        const wsData = [];
        
        // تصميم كارت الصنف الاحترافي
        wsData.push([this.getCompanyHeader()]);
        wsData.push(['كارت الصنف']);
        wsData.push([]);
        
        // معلومات أساسية
        wsData.push(['معلومات الصنف الأساسية']);
        wsData.push(['كود الصنف:', item.code]);
        wsData.push(['اسم الصنف:', item.name]);
        wsData.push(['اللون:', item.color]);
        wsData.push(['المخزن:', this.getWarehouseLabel(item.warehouse_id)]);
        wsData.push(['مكان التخزين:', item.item_location || '-']);
        wsData.push(['المورد:', item.supplier || '-']);
        wsData.push([]);
        
        // معلومات الكميات
        wsData.push(['معلومات الكميات']);
        wsData.push(['الكراتين:', item.cartons_count]);
        wsData.push(['في الكرتونة:', item.per_carton_count]);
        wsData.push(['الفردي:', item.single_bottles_count]);
        wsData.push(['الرصيد الكلي:', item.remaining_quantity]);
        wsData.push(['الكمية المضافة:', item.total_added]);
        wsData.push(['الحالة:', this.getStockStatus(item.remaining_quantity)]);
        wsData.push([]);
        
        // معلومات إضافية
        wsData.push(['معلومات إضافية']);
        wsData.push(['تاريخ الإنشاء:', this.formatDate(item.created_at)]);
        wsData.push(['آخر تحديث:', this.formatDate(item.updated_at)]);
        wsData.push(['آخر تحديث للكميات:', this.getLastTransactionDate(item.id)]);
        wsData.push(['ملاحظات:', item.notes || '-']);
        wsData.push([]);
        
        // تاريخ الحركات
        const transactions = this.getItemTransactions(item.id);
        if (transactions.length > 0) {
          wsData.push(['تاريخ الحركات']);
          const transHeaders = ['التاريخ', 'نوع الحركة', 'الكمية', 'الجهة', 'ملاحظات', 'الرصيد'];
          wsData.push(transHeaders);
          
          transactions.slice(0, 10).forEach(trans => {
            wsData.push([
              trans.date,
              trans.type,
              trans.quantity,
              trans.party,
              trans.notes,
              trans.balance
            ]);
          });
        }
        
        // ملخص الحركات
        wsData.push([]);
        wsData.push(['ملخص الحركات']);
        const totalIn = transactions.filter(t => t.type === 'وارد').reduce((sum, t) => sum + t.quantity, 0);
        const totalOut = transactions.filter(t => t.type === 'منصرف').reduce((sum, t) => sum + t.quantity, 0);
        wsData.push(['إجمالي الوارد:', totalIn]);
        wsData.push(['إجمالي المنصرف:', totalOut]);
        wsData.push(['صافي الحركة:', totalIn - totalOut]);
        
        // إضافة صورة إذا كانت موجودة
        if (item.photo_url) {
          wsData.push([]);
          wsData.push(['ملاحظة:', '✓ يوجد صورة مرفقة بالصنف']);
        }
        
        // إنشاء اسم الورقة
        const sheetName = this.createSafeSheetName(item.code, item.name, i + 1);
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      }
    },

    getCompanyHeader() {
      return 'شركة ABC للتجارة والمقاولات - قسم إدارة المخزون';
    },

    getItemTransactions(itemId) {
      if (!this.storeTransactions) return [];
      
      return this.storeTransactions
        .filter(t => t.item_id === itemId)
        .map(t => {
          const quantity = t.type === 'IN' 
            ? (t.cartons_delta || 0) * (t.per_carton_updated || 1) + (t.single_delta || 0)
            : -((t.cartons_delta || 0) * (t.per_carton_updated || 1) + (t.single_delta || 0));
          
          return {
            date: this.formatDate(t.timestamp),
            type: t.type === 'IN' ? 'وارد' : 'منصرف',
            quantity: Math.abs(quantity),
            party: t.to_warehouse || t.from_warehouse || '',
            notes: t.notes || '',
            balance: t.new_remaining || 0
          };
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    getLastTransactionDate(itemId) {
      const transactions = this.getItemTransactions(itemId);
      if (transactions.length > 0) {
        return transactions[0].date;
      }
      return '-';
    },

    createSafeSheetName(itemCode, itemName, index) {
      let baseName = `${index.toString().padStart(3, '0')}_${itemCode}_${itemName}`;
      const invalidChars = ['[', ']', ':', '*', '?', '/', '\\'];
      invalidChars.forEach(char => {
        baseName = baseName.replaceAll(char, '');
      });
      return baseName.substring(0, 31);
    },

    handleClickOutside(event) {
      if (this.showPhotoModal && !event.target.closest('.photo-modal-content')) {
        this.closePhotoPreview();
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    this.closePhotoPreview();
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
  position: relative;
}

.dark .card {
  background-color: #1f2937;
  border-color: #374151;
}

/* Export container */
.export-container {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
}

.dark .export-container {
  border-bottom-color: #374151;
}

.export-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #10b981;
  color: white;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.export-btn:hover:not(:disabled) {
  background-color: #059669;
}

.export-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.export-all-btn {
  background-color: #3498db;
}

.export-all-btn:hover:not(:disabled) {
  background-color: #2980b9;
}

.export-icon {
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
}

/* Desktop table view */
.table-view {
  display: block;
  width: 100%;
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

/* Photo cell */
.photo-cell {
  width: 80px;
  padding: 0.5rem;
}

.photo-container {
  width: 60px;
  height: 60px;
  border-radius: 0.375rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: transform 0.2s;
}

.dark .photo-container {
  border-color: #4b5563;
}

.photo-container:hover {
  transform: scale(1.05);
}

.item-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-photo {
  width: 60px;
  height: 60px;
  border-radius: 0.375rem;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #d1d5db;
}

.dark .no-photo {
  background-color: #374151;
  border-color: #4b5563;
}

.no-photo-icon {
  width: 24px;
  height: 24px;
  color: #9ca3af;
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

/* Photo Modal */
.photo-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.photo-modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
}

.dark .photo-modal-content {
  background-color: #1f2937;
}

.close-modal-btn {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
}

.close-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.modal-photo {
  max-width: 100%;
  max-height: calc(90vh - 2rem);
  object-fit: contain;
}

/* Progress Modal */
.progress-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.progress-modal-content {
  background-color: white;
  border-radius: 0.5rem;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.dark .progress-modal-content {
  background-color: #1f2937;
  color: white;
}

.progress-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2C3E50;
  font-size: 1.5rem;
  font-weight: bold;
}

.dark .progress-title {
  color: white;
}

.progress-info {
  margin-bottom: 1rem;
}

.progress-text {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #2C3E50;
}

.dark .progress-text {
  color: white;
}

.progress-details {
  font-size: 0.9rem;
  color: #7F8C8D;
}

.progress-bar-container {
  height: 20px;
  background-color: #ECF0F1;
  border-radius: 10px;
  overflow: hidden;
  margin: 1rem 0;
}

.progress-bar {
  height: 100%;
  background-color: #3498DB;
  transition: width 0.3s ease;
}

.progress-stats {
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 500;
  color: #2C3E50;
}

.dark .progress-stats {
  color: white;
}

.close-progress-btn {
  display: block;
  margin: 1.5rem auto 0;
  padding: 0.75rem 2rem;
  background-color: #3498DB;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.close-progress-btn:hover {
  background-color: #2980B9;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .export-container {
    flex-direction: column;
    gap: 0.5rem;
  }

  .progress-modal-content {
    padding: 1rem;
    margin: 1rem;
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
