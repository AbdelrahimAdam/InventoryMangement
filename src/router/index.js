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
    permissions: {
      company_manager: 'viewer',
      warehouse_manager: 'full_access'
    }
  }
};

// جميع المسارات كما هي تماماً مع إضافة lazy loading فقط
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
      allowedRoles: ['superadmin', 'company_manager', 'warehouse_manager']
    }
  },
  {
    path: '/warehouses',
    name: 'Warehouses',
    component: lazyLoad('Warehouses'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin']
    }
  },
  {
    path: '/users',
    name: 'Users',
    component: lazyLoad('Users'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin']
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
      permissions: {
        company_manager: 'none',
        warehouse_manager: 'full_access'
      }
    }
  },
  {
    path: '/dispatch',
    name: 'Dispatch',
    component: lazyLoad('Dispatch'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'warehouse_manager'],
      permissions: {
        company_manager: 'none',
        warehouse_manager: 'full_access'
      }
    }
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: lazyLoad('Transactions'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'company_manager', 'warehouse_manager'],
      permissions: {
        company_manager: 'viewer',
        warehouse_manager: 'viewer'
      }
    }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: lazyLoad('Reports'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'company_manager'],
      permissions: {
        company_manager: 'viewer',
        warehouse_manager: 'none'
      }
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: lazyLoad('Profile'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'company_manager', 'warehouse_manager']
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

// Helper function to check if user can access route
const canAccessRoute = (userRole, routeMeta) => {
  if (!routeMeta.allowedRoles) return true;

  // Check if user role is allowed
  if (!routeMeta.allowedRoles.includes(userRole)) {
    return false;
  }

  // Check specific permissions if they exist
  if (routeMeta.permissions) {
    const permission = routeMeta.permissions[userRole];
    if (permission === 'none') {
      return false;
    }
  }

  return true;
};

// Check warehouse manager access
const canWarehouseManagerAccess = (userProfile, routeName) => {
  if (userProfile?.role !== 'warehouse_manager') return true;

  const allowedWarehouses = userProfile?.allowed_warehouses || [];

  // For inventory management routes, check if user has any warehouses assigned
  if (routeName?.includes('Inventory') && allowedWarehouses.length === 0) {
    return false;
  }

  return true;
};

// Cache للصلاحيات لتحسين الأداء
const routePermissionCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 دقائق

// نسخة محسنة من canAccessRoute مع cache
const canAccessRouteCached = (userRole, routeMeta) => {
  if (!routeMeta.allowedRoles) return true;

  const cacheKey = `${userRole}_${JSON.stringify(routeMeta)}`;
  const cached = routePermissionCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.result;
  }

  const result = canAccessRoute(userRole, routeMeta);
  routePermissionCache.set(cacheKey, { result, timestamp: Date.now() });
  return result;
};

router.beforeEach((to, from, next) => {
  const store = useStore();
  const user = store.state.user;
  const userProfile = store.state.userProfile;

  // Track if we're navigating after logout
  const isAfterLogout = from.name === null || from.name === undefined;

  // Handle post-logout navigation
  if (isAfterLogout && to.path === '/login') {
    next();
    return;
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !user) {
    if (to.path !== '/login') {
      next('/login');
    } else {
      next();
    }
    return;
  }

  // Handle requiresGuest
  if (to.meta.requiresGuest && user) {
    if (to.path === '/login') {
      next('/');
    } else {
      next('/');
    }
    return;
  }

  // If user exists, check role-based access
  if (user && userProfile) {
    const userRole = userProfile.role;

    // Check if route has role restrictions
    if (to.meta.allowedRoles) {
      // استخدام النسخة المحسنة مع cache
      if (!canAccessRouteCached(userRole, to.meta)) {
        next('/unauthorized');
        return;
      }

      // Special checks for warehouse managers
      if (!canWarehouseManagerAccess(userProfile, to.name)) {
        next('/unauthorized');
        return;
      }
    }
  }

  next();
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

// إضافة تحميل مسبق للمسارات بعد تحميل الصفحة الرئيسية - الإصلاح هنا
router.isReady().then(() => {
  console.log('✅ الموجه جاهز للتشغيل');
  
  // تعطيل التحميل المسبق مؤقتاً لحل مشكلة المكونات
  console.log('⏸️ تم تعطيل التحميل المسبق لحل مشكلة المكونات غير المعرفة');
  
  // كود التحميل المسبق المعدل - يتم تفعيله لاحقاً بعد إصلاح جميع المكونات
  /*
  setTimeout(() => {
    const prefetchRoutes = ['/inventory', '/transactions', '/profile'];
    console.log('📦 بدء التحميل المسبق للمسارات:', prefetchRoutes);
    
    prefetchRoutes.forEach(path => {
      try {
        console.log(`🔄 محاولة التحميل المسبق لـ ${path}`);
        const routeMatch = router.resolve(path);
        
        if (routeMatch && routeMatch.route) {
          const component = routeMatch.route.component;
          if (typeof component === 'function') {
            // تحميل المكون بأمان
            component().then(() => {
              console.log(`✅ تم التحميل المسبق لـ ${path} بنجاح`);
            }).catch(error => {
              console.warn(`⚠️ فشل التحميل المسبق لـ ${path}:`, error.message);
            });
          } else {
            console.log(`📌 ${path} ليس لديه مكون ديناميكي`);
          }
        } else {
          console.warn(`❌ لا يمكن العثور على المسار ${path}`);
        }
      } catch (error) {
        console.error(`🚨 خطأ في معالجة المسار ${path}:`, error.message);
      }
    });
  }, 3000);
  */
});

// التحقق من هيكل المسارات عند بدء التشغيل
console.log('📋 المسارات المسجلة:');
routes.forEach(route => {
  console.log(`- ${route.name}: ${route.path}`);
});

export default router;
