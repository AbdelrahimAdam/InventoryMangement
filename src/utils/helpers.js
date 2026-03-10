export const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num || 0);

export const formatCurrency = (amount) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EGP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
}).format(amount || 0);

export const formatDate = (timestamp) => {
  if (!timestamp) return '-';
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit' });
  } catch { return '-'; }
};

export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  } catch { return ''; }
};

export const formatDateTime = (timestamp) => {
  if (!timestamp) return '-';
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch { return '-'; }
};

export const getPaymentMethodLabel = (method) => ({
  cash: 'نقدي',
  bank: 'تحويل بنكي',
  check: 'شيك',
  credit: 'آجل'
}[method] || method);

export const getInvoiceTypeLabel = (type) => ({
  B2B: 'فاتورة ضريبية (B2B)',
  B2C: 'فاتورة ضريبية (B2C)',
  simplified: 'فاتورة مبسطة'
}[type] || type);

export const getInvoiceTypeClass = (type) => {
  const classes = {
    B2B: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300',
    B2C: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300',
    simplified: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
  };
  return classes[type] || 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300';
};

export const getInvoiceStatusLabel = (status) => ({
  draft: 'مسودة',
  issued: 'صادرة',
  paid: 'مدفوعة',
  cancelled: 'ملغية'
}[status] || status);

export const getInvoiceStatusClass = (status) => {
  const classes = {
    draft: 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300',
    issued: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300',
    paid: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300',
    cancelled: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
  };
  return classes[status] || 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300';
};

export const getQuantityClass = (quantity) => {
  if (quantity < 10) return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300';
  if (quantity < 50) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300';
  return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300';
};

export const getSearchSourceLabel = (source) => ({
  cache: 'ذاكرة التخزين',
  firebase: 'القاعدة الكاملة',
  local_fallback: 'بحث محلي',
  warehouse_load: 'تحميل من المخزن'
}[source] || source);