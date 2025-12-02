import * as XLSX from 'xlsx';

export class ExportUtils {
  static exportToExcel(data, filename = 'inventory') {
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Set column widths for better readability
    const colWidths = [];
    if (data.length > 0) {
      Object.keys(data[0]).forEach(key => {
        colWidths.push({ wch: Math.max(key.length, 15) });
      });
    }
    worksheet['!cols'] = colWidths;
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'البيانات');
    
    // Generate and download file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }

  static exportToCSV(data, filename = 'inventory') {
    if (data.length === 0) {
      alert('لا توجد بيانات للتصدير');
      return;
    }

    const headers = Object.keys(data[0]);
    
    // Add BOM for UTF-8 to support Arabic in Excel
    const BOM = '\uFEFF';
    
    // Create CSV content
    const csvContent = [
      BOM + headers.join(','), // Headers row
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // Escape quotes and wrap in quotes
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\r\n');
    
    // Create and trigger download
    const blob = new Blob([csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  static formatInventoryForExport(items) {
    return items.map(item => ({
      'الاسم': item.الاسم || '',
      'الكود': item.الكود || '',
      'اللون': item.اللون || '',
      'المخزن': item.المخزن_id || '',
      'عدد الكراتين': item.عدد_الكراتين || 0,
      'عدد في الكرتونة': item.عدد_في_الكرتونه || 0,
      'عدد القزاز الفردي': item.عدد_القزاز_الفردي || 0,
      'الكميه المضافه': item.الكميه_المضافه || 0,
      'الكميه المتبقيه': item.الكميه_المتبقيه || 0,
      'تاريخ الإنشاء': item.created_at?.toDate()?.toLocaleDateString('ar-EG') || '',
      'آخر تحديث': item.updated_at?.toDate()?.toLocaleDateString('ar-EG') || '',
      'تم الإنشاء بواسطة': item.created_by || '',
      'تم التحديث بواسطة': item.updated_by || ''
    }));
  }

  static formatTransactionsForExport(transactions) {
    return transactions.map(transaction => {
      const quantity = Math.abs(
        (transaction.cartons_delta || 0) * (transaction.per_carton_updated || 1) + 
        (transaction.single_delta || 0)
      );
      
      const typeMap = {
        'ADD': 'إضافة',
        'TRANSFER': 'نقل',
        'DISPATCH': 'صرف'
      };

      return {
        'نوع الحركة': typeMap[transaction.type] || transaction.type,
        'من المخزن': transaction.from_warehouse || '-',
        'إلى المخزن': transaction.to_warehouse || '-',
        'التاريخ والوقت': transaction.timestamp?.toDate()?.toLocaleString('ar-EG') || '',
        'الكمية المنقولة': quantity,
        'الكراتين': transaction.cartons_delta || 0,
        'الفردي': transaction.single_delta || 0,
        'المستخدم': transaction.user_id || '',
        'ملاحظات': transaction.notes || '-',
        'المخزون السابق': transaction.previous_remaining || 0,
        'المخزون الجديد': transaction.new_remaining || 0
      };
    });
  }

  static exportDashboardReport(stats, inventory, transactions) {
    const reportData = {
      'التقرير الشامل': [{
        'تاريخ التقرير': new Date().toLocaleDateString('ar-EG'),
        'إجمالي الأصناف': stats.totalItems,
        'إجمالي الكمية': stats.totalQuantity,
        'الأصناف منخفضة المخزون': stats.lowStockItems,
        'الحركات اليوم': stats.recentTransactions
      }],
      'المخزون': this.formatInventoryForExport(inventory),
      'الحركات': this.formatTransactionsForExport(transactions.slice(0, 100)) // Last 100 transactions
    };

    const workbook = XLSX.utils.book_new();
    
    // Add summary sheet
    const summarySheet = XLSX.utils.json_to_sheet(reportData['التقرير الشامل']);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'ملخص');
    
    // Add inventory sheet
    const inventorySheet = XLSX.utils.json_to_sheet(reportData['المخزون']);
    XLSX.utils.book_append_sheet(workbook, inventorySheet, 'المخزون');
    
    // Add transactions sheet
    const transactionsSheet = XLSX.utils.json_to_sheet(reportData['الحركات']);
    XLSX.utils.book_append_sheet(workbook, transactionsSheet, 'الحركات');

    const filename = `تقرير-مخزون-${new Date().toISOString().split('T')[0]}`;
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }
}