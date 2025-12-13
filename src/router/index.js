// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useStore } from 'vuex';

// تعريف Lazy Loading مع تحسينات الأداء
const lazyLoad = (componentName) => {
  return () => import(
    /* webpackChunkName: "[request]" */
    /* webpackPrefetch: true */
    `@/views/${componentName}.vue`
  );
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
  {
    path: '/inventory',
    name: 'Inventory',
    component: lazyLoad('Inventory'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'company_manager', 'warehouse_manager'],
      permissions: {
        company_manager: 'viewer',
        warehouse_manager: 'full_access'
      }
    }
  },
  {
    path: '/inventory/add',
    name: 'AddInventory',
    component: lazyLoad('Inventory'),
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
    component: lazyLoad('Inventory'),
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
    component: lazyLoad('Inventory'),
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
router.onError((error) => {
  console.error('Router error:', error);

  if (error.message.includes('redirected')) {
    window.location.href = '/login';
  }
});

// إضافة تحميل مسبق للمسارات بعد تحميل الصفحة الرئيسية
router.isReady().then(() => {
  // عند تحميل الصفحة الرئيسية، نقوم بتحميل المسارات الشائعة في الخلفية
  const prefetchRoutes = ['/inventory', '/transactions', '/profile'];
  
  setTimeout(() => {
    prefetchRoutes.forEach(path => {
      const route = router.resolve(path);
      if (route.route.component && typeof route.route.component === 'function') {
        route.route.component().catch(() => {});
      }
    });
  }, 1000);
});

export default router;