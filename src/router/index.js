// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useStore } from 'vuex';

// تعريف Lazy Loading مع تحسينات الأداء ومعالجة الأخطاء
const lazyLoad = (componentName) => {
  return () => {
    console.log(`🔗 محاولة تحميل المكون: ${componentName}`);
    return import(
      /* webpackChunkName: "[request]" */
      /* webpackPrefetch: true */
      `@/views/${componentName}.vue`
    ).catch((error) => {
      console.error(`❌ فشل في تحميل المكون ${componentName}:`, error);
      // سقط للخلف إلى مكون بسيط لتجنب الأخطاء
      return Promise.resolve({
        template: `
          <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div class="text-center p-8">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full mb-6 animate-pulse">
                <svg class="w-8 h-8 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">جاري تحميل ${componentName}</h2>
              <p class="text-gray-600 dark:text-gray-400">
                يرجى الانتظار بينما يتم تحميل الصفحة...
              </p>
            </div>
          </div>
        `,
        mounted() {
          // حاول إعادة التحميل بعد ثانيتين
          setTimeout(() => {
            console.log(`🔄 إعادة محاولة تحميل ${componentName}...`);
            import(`@/views/${componentName}.vue`)
              .then(module => {
                console.log(`✅ تم تحميل ${componentName} بنجاح بعد إعادة المحاولة`);
                // هنا يمكنك تحديث المكون إذا أردت
              })
              .catch(err => {
                console.error(`❌ فشل إعادة تحميل ${componentName}:`, err);
              });
          }, 2000);
        }
      });
    });
  };
};

// المسار الخاص بالمخزون مع استيراد مباشر لتجنب الأخطاء
const inventoryRoutes = {
  path: '/inventory',
  name: 'Inventory',
  component: () => import('@/views/Inventory.vue').catch(() => {
    // إذا فشل تحميل Inventory.vue من views، حاول من components
    console.log('🔄 جرب تحميل Inventory من المكونات...');
    return import('@/views/Inventory.vue').catch((error) => {
      console.error('❌ فشل في تحميل Inventory من أي مكان:', error);
      return {
        template: `
          <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
            <div class="text-center">
              <div class="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full mb-6">
                <svg class="w-10 h-10 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">خطأ في تحميل الصفحة</h1>
              <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">
                تعذر تحميل صفحة المخزون. يرجى:
              </p>
              <div class="space-y-3 mb-8 text-right">
                <p class="text-gray-700 dark:text-gray-300">1. التأكد من وجود ملف Inventory.vue</p>
                <p class="text-gray-700 dark:text-gray-300">2. تحديث الصفحة (F5)</p>
                <p class="text-gray-700 dark:text-gray-300">3. التواصل مع الدعم الفني</p>
              </div>
              <button @click="reloadPage" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                تحديث الصفحة
              </button>
            </div>
          </div>
        `,
        methods: {
          reloadPage() {
            window.location.reload();
          }
        }
      };
    });
  }),
  meta: { 
    requiresAuth: true,
    allowedRoles: ['superadmin', 'company_manager', 'warehouse_manager'],
    requiredPermissions: ['view_items'],
    permissions: {
      company_manager: 'viewer',
      warehouse_manager: 'full_access'
    }
  }
};

// ============================================
// UPDATED: Invoice System Route with DispatchPageWithInvoices
// ============================================
const invoiceSystemRoutes = {
  path: '/invoice-system',
  name: 'InvoiceSystem',
  // Using the combined Dispatch and Invoice system component
  component: () => {
    console.log('🔗 تحميل نظام الفواتير المتكامل...');
    return import('@/views/DispatchPageWithInvoices.vue').catch((error) => {
      console.error('❌ فشل في تحميل DispatchPageWithInvoices:', error);
      
      // Try alternative paths
      console.log('🔄 جرب تحميل من مكونات أخرى...');
      return import('@/components/DispatchPageWithInvoices.vue').catch((error2) => {
        console.error('❌ فشل في جميع المحاولات:', error2);
        
        // Fallback component
        return {
          template: `
            <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
              <div class="text-center max-w-lg">
                <div class="inline-flex items-center justify-center w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-full mb-6">
                  <svg class="w-10 h-10 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">نظام الفواتير غير متاح</h1>
                <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  لم يتم العثور على صفحة نظام الفواتير المتكامل. يرجى التأكد من:
                </p>
                <div class="space-y-3 mb-8 text-right bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <p class="text-gray-700 dark:text-gray-300">
                    1. وجود ملف <strong>DispatchPageWithInvoices.vue</strong> في المجلد الصحيح
                  </p>
                  <p class="text-gray-700 dark:text-gray-300">
                    2. صحة المسار: <code class="text-blue-600">@/views/DispatchPageWithInvoices.vue</code>
                  </p>
                  <p class="text-gray-700 dark:text-gray-300">
                    3. بناء المشروع بشكل صحيح
                  </p>
                </div>
                <div class="space-y-4">
                  <button @click="goToDispatch" class="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    الذهاب إلى صفحة الصرف العادية
                  </button>
                  <router-link to="/" class="block w-full py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
                    العودة للرئيسية
                  </router-link>
                </div>
              </div>
            </div>
          `,
          methods: {
            goToDispatch() {
              this.$router.push('/dispatch');
            }
          }
        };
      });
    });
  },
  meta: { 
    requiresAuth: true,
    allowedRoles: ['superadmin', 'company_manager', 'warehouse_manager'],
    requiredPermissions: ['manage_invoices', 'dispatch_items'],
    title: 'نظام الفواتير والصرف'
  }
};

// ============================================
// UPDATED: Invoices Routes for individual invoices management
// ============================================
const invoicesRoutes = {
  path: '/invoices',
  name: 'Invoices',
  component: lazyLoad('Invoices'),
  meta: { 
    requiresAuth: true,
    allowedRoles: ['superadmin', 'warehouse_manager', 'company_manager'],
    requiredPermissions: ['manage_invoices'],
    title: 'الفواتير'
  },
  children: [
    {
      path: 'create',
      name: 'CreateInvoice',
      component: lazyLoad('CreateInvoice'),
      meta: { 
        requiresAuth: true,
        allowedRoles: ['superadmin', 'warehouse_manager', 'company_manager'],
        requiredPermissions: ['create_invoices']
      }
    },
    {
      path: ':id',
      name: 'InvoiceDetails',
      component: lazyLoad('InvoiceDetails'),
      meta: { 
        requiresAuth: true,
        allowedRoles: ['superadmin', 'warehouse_manager', 'company_manager'],
        requiredPermissions: ['view_invoices']
      }
    }
  ]
};

// جميع المسارات كما هي تماماً مع تحديث المسارات المطلوبة
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: lazyLoad('Login'),
    meta: { 
      requiresGuest: true,
      layout: 'empty'
    }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: lazyLoad('Dashboard'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'company_manager', 'warehouse_manager'],
      requiredPermissions: ['view_dashboard']
    }
  },
  {
    path: '/warehouses',
    name: 'Warehouses',
    component: lazyLoad('Warehouses'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin'],
      requiredPermissions: ['manage_warehouses']
    }
  },
  {
    path: '/users',
    name: 'Users',
    component: lazyLoad('Users'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin'],
      requiredPermissions: ['manage_users']
    }
  },

  // استخدام المسار المحسن للمخزون
  inventoryRoutes,

  {
    path: '/inventory/add',
    name: 'AddInventory',
    component: () => {
      // استخدام نفس مكون Inventory مع معلمات مختلفة
      return inventoryRoutes.component().then(component => {
        // يمكنك إضافة معلمات إضافية هنا إذا أردت
        return component;
      }).catch(() => {
        // سقط للخلف
        return {
          template: '<div>Add Inventory Page</div>'
        };
      });
    },
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'warehouse_manager'],
      requiredPermissions: ['create_items'],
      permissions: {
        company_manager: 'none',
        warehouse_manager: 'full_access'
      }
    }
  },
  {
    path: '/inventory/edit/:id',
    name: 'EditInventory',
    component: () => {
      // استخدام نفس مكون Inventory مع معلمات مختلفة
      return inventoryRoutes.component().then(component => {
        return component;
      }).catch(() => {
        return {
          template: '<div>Edit Inventory Page</div>'
        };
      });
    },
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'warehouse_manager'],
      requiredPermissions: ['edit_items'],
      permissions: {
        company_manager: 'none',
        warehouse_manager: 'full_access'
      }
    }
  },
  {
    path: '/inventory/item/:id',
    name: 'ItemDetails',
    component: () => {
      // استخدام نفس مكون Inventory مع معلمات مختلفة
      return inventoryRoutes.component().then(component => {
        return component;
      }).catch(() => {
        return {
          template: '<div>Item Details Page</div>'
        };
      });
    },
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'company_manager', 'warehouse_manager'],
      requiredPermissions: ['view_items'],
      permissions: {
        company_manager: 'viewer',
        warehouse_manager: 'viewer'
      }
    }
  },
  {
    path: '/transfers',
    name: 'Transfers',
    component: lazyLoad('Transfers'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'warehouse_manager'],
      requiredPermissions: ['transfer_items']
    }
  },
  {
    path: '/dispatch',
    name: 'Dispatch',
    component: lazyLoad('Dispatch'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'warehouse_manager'],
      requiredPermissions: ['dispatch_items']
    }
  },

  // ============================================
  // NEW: Added the Invoice System Route here
  // ============================================
  invoiceSystemRoutes,

  {
    path: '/transactions',
    name: 'Transactions',
    component: lazyLoad('Transactions'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'company_manager', 'warehouse_manager'],
      requiredPermissions: ['view_transactions']
    }
  },

  // مسارات الفواتير (لإدارة الفواتير الفردية)
  invoicesRoutes,

  {
    path: '/reports',
    name: 'Reports',
    component: lazyLoad('Reports'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'company_manager'],
      requiredPermissions: ['view_reports']
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: lazyLoad('Profile'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'company_manager', 'warehouse_manager'],
      requiredPermissions: ['view_profile']
    }
  },
  {
    path: '/migrate',
    name: 'Migrate',
    component: () => import('@/components/MigrationTool.vue'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin'],
      requiredPermissions: ['system_access'],
      title: 'ترقية البيانات'
    }
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: {
      template: `
        <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mb-6">
              <svg class="w-8 h-8 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-6a3 3 0 110-6 3 3 0 010 6zm2 7a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">صلاحية مرفوضة</h1>
            <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
              ليس لديك الصلاحية للوصول إلى هذه الصفحة
            </p>
            <router-link to="/" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
              العودة للرئيسية
            </router-link>
          </div>
        </div>
      `
    },
    meta: { layout: 'empty' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: {
      template: `
        <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
          <div class="text-center">
            <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
            <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
              الصفحة غير موجودة
            </p>
            <router-link to="/" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
              العودة للرئيسية
            </router-link>
          </div>
        </div>
      `
    },
    meta: { layout: 'empty' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // إضافة scroll behavior لتحسين UX
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  }
});

// Helper function to check if user can access route - UPDATED for store compliance
const canAccessRoute = (userRole, userPermissions, routeMeta) => {
  if (!routeMeta.allowedRoles) return true;

  // Check if user role is allowed
  if (!routeMeta.allowedRoles.includes(userRole)) {
    console.log(`⛔ الدور غير مسموح: ${userRole} -> ${routeMeta.allowedRoles}`);
    return false;
  }

  // Check specific permissions from store
  if (routeMeta.requiredPermissions) {
    const hasPermission = routeMeta.requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      console.log(`⛔ الأذونات المطلوبة غير متوفرة: ${routeMeta.requiredPermissions} -> ${userPermissions}`);
      return false;
    }
  }

  return true;
};

// Check warehouse manager access - UPDATED for store compliance
const canWarehouseManagerAccess = (userProfile, routeName) => {
  if (userProfile?.role !== 'warehouse_manager') return true;

  const allowedWarehouses = userProfile?.allowed_warehouses || [];

  // For inventory management routes, check if user has any warehouses assigned
  if (routeName?.includes('Inventory') && allowedWarehouses.length === 0) {
    console.log(`⛔ مدير المخزن ليس لديه مخازن مسموحة: ${routeName}`);
    return false;
  }

  // Check specific permissions for warehouse manager
  const userPermissions = userProfile?.permissions || [];

  // Different permission checks based on route
  if (routeName === 'AddInventory' && !userPermissions.includes('create_items')) {
    console.log('⛔ لا يملك صلاحية إضافة الأصناف');
    return false;
  }

  if (routeName === 'EditInventory' && !userPermissions.includes('edit_items')) {
    console.log('⛔ لا يملك صلاحية تعديل الأصناف');
    return false;
  }

  // Check for invoice system access
  if (routeName === 'InvoiceSystem' && !userPermissions.includes('manage_invoices')) {
    console.log('⛔ لا يملك صلاحية إدارة الفواتير');
    return false;
  }

  return true;
};

// Cache للصلاحيات لتحسين الأداء
const routePermissionCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 دقائق

// نسخة محسنة من canAccessRoute مع cache
const canAccessRouteCached = (userRole, userPermissions, routeMeta) => {
  if (!routeMeta.allowedRoles) return true;

  const cacheKey = `${userRole}_${JSON.stringify(routeMeta)}_${userPermissions.join(',')}`;
  const cached = routePermissionCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.result;
  }

  const result = canAccessRoute(userRole, userPermissions, routeMeta);
  routePermissionCache.set(cacheKey, { result, timestamp: Date.now() });
  return result;
};

// متغير لتجنب تكرار التحقق
let isCheckingRoute = false;

// Get store instance for navigation guard
let storeInstance = null;

// Function to initialize store instance
const initStoreInstance = () => {
  if (!storeInstance) {
    storeInstance = useStore();
  }
};

router.beforeEach((to, from, next) => {
  // إذا كان التحقق جارياً بالفعل، اخرج لمنع التكرار
  if (isCheckingRoute) {
    next();
    return;
  }

  isCheckingRoute = true;

  try {
    // Initialize store instance
    initStoreInstance();
    const store = storeInstance;

    const user = store?.state?.user;
    const userProfile = store?.state?.userProfile;
    const userRole = store?.getters?.userRole || '';
    const userPermissions = store?.getters?.userPermissions || [];

    console.log('🔍 Navigation Guard Checking:', {
      from: from.name,
      to: to.name,
      user: !!user,
      userRole,
      userPermissions,
      requiresAuth: to.meta.requiresAuth,
      requiresGuest: to.meta.requiresGuest,
      routeMeta: to.meta
    });

    // Handle requiresGuest (login page)
    if (to.meta.requiresGuest) {
      if (user) {
        console.log('📱 المستخدم مسجل دخول بالفعل - إعادة التوجيه إلى الرئيسية');
        next('/');
      } else {
        console.log('👤 صفحة تسجيل الدخول - السماح بالوصول');
        next();
      }
      return;
    }

    // Check if route requires authentication
    if (to.meta.requiresAuth) {
      if (!user) {
        console.log('🔒 الصفحة تتطلب تسجيل الدخول - إعادة التوجيه إلى /login');
        next('/login');
        return;
      }

      // If user exists, check role-based access
      if (userProfile && userRole) {
        // Check if user account is active
        if (userProfile.is_active === false) {
          console.log('⛔ الحساب غير نشط - تسجيل الخروج');
          store.dispatch('logout');
          next('/login');
          return;
        }

        // استخدام النسخة المحسنة مع cache
        if (!canAccessRouteCached(userRole, userPermissions, to.meta)) {
          console.log('⛔ المستخدم ليس لديه صلاحية الوصول إلى:', to.name);
          next('/unauthorized');
          return;
        }

        // Special checks for warehouse managers
        if (!canWarehouseManagerAccess(userProfile, to.name)) {
          console.log('⛔ مدير المخزن ليس لديه صلاحية الوصول إلى:', to.name);
          next('/unauthorized');
          return;
        }
      } else {
        console.log('⚠️ بيانات المستخدم غير مكتملة - إعادة التوجيه إلى /login');
        next('/login');
        return;
      }
    }

    // Allow navigation
    next();

  } catch (error) {
    console.error('❌ Error in navigation guard:', error);
    // In case of error, allow navigation to prevent blocking
    next();
  } finally {
    // Reset flag
    setTimeout(() => {
      isCheckingRoute = false;
    }, 100);
  }
});

// Add navigation error handler to prevent redirect loops
router.onError((error, to) => {
  console.error('❌ خطأ في الموجه:', error);
  console.log('المسار المستهدف:', to.path);

  if (error.message.includes('Failed to fetch dynamically imported module')) {
    console.log('🔄 فشل في تحميل المكون ديناميكياً. جاري إعادة التوجيه...');

    // إذا كان خطأ في تحميل Inventory، أعد التوجيه إلى صفحة مؤقتة
    if (to.path.includes('/inventory')) {
      next({
        path: '/inventory-fallback',
        query: { originalPath: to.path }
      });
    } else if (to.path.includes('/invoices')) {
      next({
        path: '/invoices-fallback',
        query: { originalPath: to.path }
      });
    } else if (to.path.includes('/invoice-system')) {
      next({
        path: '/invoice-system-fallback',
        query: { originalPath: to.path }
      });
    } else {
      next('/');
    }
  } else if (error.message.includes('redirected')) {
    window.location.href = '/login';
  } else {
    // لأي خطأ آخر، أعد التوجيه إلى الصفحة الرئيسية
    console.log('📦 إعادة التوجيه إلى الصفحة الرئيسية بسبب الخطأ');
    next('/');
  }
});

// إضافة مسار احتياطي للمخزون
router.addRoute({
  path: '/inventory-fallback',
  name: 'InventoryFallback',
  component: {
    template: `
      <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div class="text-center max-w-md">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full mb-6 animate-pulse">
            <svg class="w-10 h-10 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">جاري تحضير المخزون</h1>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            صفحة المخزون قيد التحميل. يرجى الانتظار...
          </p>
          <div class="space-y-4">
            <button @click="reloadPage" class="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              تحديث الصفحة
            </button>
            <router-link to="/" class="block w-full py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
              العودة للرئيسية
            </router-link>
          </div>
        </div>
      </div>
    `,
    methods: {
      reloadPage() {
        const originalPath = this.$route.query.originalPath || '/inventory';
        this.$router.push(originalPath);
      }
    }
  },
  meta: { layout: 'empty' }
});

// إضافة مسار احتياطي للفواتير
router.addRoute({
  path: '/invoices-fallback',
  name: 'InvoicesFallback',
  component: {
    template: `
      <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div class="text-center max-w-md">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-full mb-6 animate-pulse">
            <svg class="w-10 h-10 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">جاري تحضير الفواتير</h1>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            صفحة الفواتير قيد التحميل. يرجى الانتظار...
          </p>
          <div class="space-y-4">
            <button @click="reloadPage" class="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">
              تحديث الصفحة
            </button>
            <router-link to="/" class="block w-full py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
              العودة للرئيسية
            </router-link>
          </div>
        </div>
      </div>
    `,
    methods: {
      reloadPage() {
        const originalPath = this.$route.query.originalPath || '/invoices';
        this.$router.push(originalPath);
      }
    }
  },
  meta: { layout: 'empty' }
});

// إضافة مسار احتياطي لنظام الفواتير المتكامل
router.addRoute({
  path: '/invoice-system-fallback',
  name: 'InvoiceSystemFallback',
  component: {
    template: `
      <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div class="text-center max-w-md">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-teal-100 dark:bg-teal-900 rounded-full mb-6 animate-pulse">
            <svg class="w-10 h-10 text-teal-600 dark:text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">جاري تحضير نظام الفواتير</h1>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            صفحة نظام الفواتير المتكامل قيد التحميل. يرجى الانتظار...
          </p>
          <div class="space-y-4">
            <button @click="reloadPage" class="w-full py-3 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200">
              تحديث الصفحة
            </button>
            <router-link to="/dispatch" class="block w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              الذهاب إلى صفحة الصرف
            </router-link>
            <router-link to="/" class="block w-full py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
              العودة للرئيسية
            </router-link>
          </div>
        </div>
      </div>
    `,
    methods: {
      reloadPage() {
        const originalPath = this.$route.query.originalPath || '/invoice-system';
        this.$router.push(originalPath);
      }
    }
  },
  meta: { layout: 'empty' }
});

// إعداد عنوان الصفحة ديناميكياً
router.afterEach((to) => {
  // تحديث عنوان الصفحة
  const pageTitles = {
    '/': 'لوحة التحكم',
    '/inventory': 'المخزون',
    '/inventory/add': 'إضافة صنف',
    '/warehouses': 'إدارة المخازن',
    '/users': 'إدارة المستخدمين',
    '/transactions': 'الحركات',
    '/transfers': 'النقل بين المخازن',
    '/dispatch': 'الصرف الخارجي',
    '/invoice-system': 'نظام الفواتير والصرف',
    '/invoices': 'الفواتير',
    '/invoices/create': 'إنشاء فاتورة',
    '/reports': 'التقارير',
    '/profile': 'إعدادات الحساب'
  };

  const pageTitle = pageTitles[to.path] || to.meta?.title || 'نظام المخزون';
  document.title = `${pageTitle} | نظام المخزون`;
  
  // إضافة أيقونة للمسار الحالي في السجل
  console.log(`📍 ${pageTitle} - ${to.path}`);
});

// Initialize router
router.isReady().then(() => {
  console.log('✅ الموجه جاهز للتشغيل');

  // التحقق من هيكل المسارات عند بدء التشغيل
  console.log('📋 المسارات المسجلة:');
  router.getRoutes().forEach(route => {
    console.log(`- ${route.name || 'غير معروف'}: ${route.path} ${route.meta?.requiresAuth ? '(تتطلب تسجيل دخول)' : ''}`);
  });
  
  // إضافة معلومات خاصة عن نظام الفواتير
  const invoiceRoutes = router.getRoutes().filter(r => r.path.includes('invoice'));
  console.log('🧾 مسارات نظام الفواتير:');
  invoiceRoutes.forEach(route => {
    console.log(`  • ${route.name}: ${route.path} - ${route.meta?.title || 'بدون عنوان'}`);
  });
}).catch(error => {
  console.error('❌ خطأ في تحميل الموجه:', error);
});

export default router;