// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useStore } from 'vuex';

// Loading Component
const LoadingSpinner = {
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">جاري التحميل...</p>
      </div>
    </div>
  `
};

// Error Component
const ErrorComponent = {
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mb-6">
          <svg class="w-8 h-8 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">حدث خطأ</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
          تعذر تحميل الصفحة. يرجى المحاولة مرة أخرى.
        </p>
        <button @click="$router.go(-1)" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
          العودة للخلف
        </button>
      </div>
    </div>
  `
};

// Lazy loading with webpack chunk names and prefetch
const lazyLoad = (componentName, chunkName = null) => {
  const chunk = chunkName || componentName.toLowerCase();
  
  return () => ({
    component: import(
      /* webpackChunkName: "[request]" */
      /* webpackPrefetch: true */
      `@/views/${componentName}.vue`
    ).catch((error) => {
      console.error(`Failed to load component ${componentName}:`, error);
      return import('@/views/Error.vue');
    }),
    loading: LoadingSpinner,
    error: ErrorComponent,
    delay: 200, // زيادة وقت التأخير لتحسين UX
    timeout: 30000 // 30 ثانية timeout
  });
};

// Group routes by chunk for better code splitting
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: lazyLoad('Login', 'auth'),
    meta: { 
      requiresGuest: true,
      layout: 'empty',
      title: 'تسجيل الدخول'
    }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: lazyLoad('Dashboard', 'dashboard'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'company_manager', 'warehouse_manager'],
      title: 'لوحة التحكم',
      preload: true // علامة للمسارات المهمة التي تحتاج إلى preload
    }
  },
  {
    path: '/warehouses',
    name: 'Warehouses',
    component: lazyLoad('Warehouses', 'management'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin'],
      title: 'إدارة المخازن',
      preload: true
    }
  },
  {
    path: '/users',
    name: 'Users',
    component: lazyLoad('Users', 'management'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin'],
      title: 'إدارة المستخدمين'
    }
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: lazyLoad('Inventory', 'inventory'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'company_manager', 'warehouse_manager'],
      permissions: {
        company_manager: 'viewer',
        warehouse_manager: 'full_access'
      },
      title: 'المخزون'
    }
  },
  {
    path: '/inventory/add',
    name: 'AddInventory',
    component: lazyLoad('Inventory', 'inventory'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'warehouse_manager'],
      permissions: {
        company_manager: 'none',
        warehouse_manager: 'full_access'
      },
      title: 'إضافة صنف'
    }
  },
  {
    path: '/inventory/edit/:id',
    name: 'EditInventory',
    component: lazyLoad('Inventory', 'inventory'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'warehouse_manager'],
      permissions: {
        company_manager: 'none',
        warehouse_manager: 'full_access'
      },
      title: 'تعديل صنف'
    }
  },
  {
    path: '/inventory/item/:id',
    name: 'ItemDetails',
    component: lazyLoad('Inventory', 'inventory'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'company_manager', 'warehouse_manager'],
      permissions: {
        company_manager: 'viewer',
        warehouse_manager: 'viewer'
      },
      title: 'تفاصيل الصنف'
    }
  },
  {
    path: '/transfers',
    name: 'Transfers',
    component: lazyLoad('Transfers', 'operations'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'warehouse_manager'],
      permissions: {
        company_manager: 'none',
        warehouse_manager: 'full_access'
      },
      title: 'نقل المخزون'
    }
  },
  {
    path: '/dispatch',
    name: 'Dispatch',
    component: lazyLoad('Dispatch', 'operations'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'warehouse_manager'],
      permissions: {
        company_manager: 'none',
        warehouse_manager: 'full_access'
      },
      title: 'صرف المخزون'
    }
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: lazyLoad('Transactions', 'reports'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'company_manager', 'warehouse_manager'],
      permissions: {
        company_manager: 'viewer',
        warehouse_manager: 'viewer'
      },
      title: 'الحركات'
    }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: lazyLoad('Reports', 'reports'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'company_manager'],
      permissions: {
        company_manager: 'viewer',
        warehouse_manager: 'none'
      },
      title: 'التقارير'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: lazyLoad('Profile', 'user'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'company_manager', 'warehouse_manager'],
      title: 'الملف الشخصي'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: lazyLoad('Settings', 'user'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin'],
      title: 'الإعدادات'
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
    meta: { 
      layout: 'empty',
      title: 'صلاحية مرفوضة'
    }
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
    meta: { 
      layout: 'empty',
      title: 'الصفحة غير موجودة'
    }
  }
];

// Create router with scroll behavior
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // إذا كان هناك موضع محفوظ (من زر الرجوع)
    if (savedPosition) {
      return savedPosition;
    }
    
    // إذا كان هناك hash في الرابط
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 80 // تعويض للهيدر
      };
    }
    
    // العودة للأعلى في كل تنقل
    return { 
      top: 0,
      left: 0,
      behavior: 'smooth'
    };
  }
});

// Cache for route permissions
const routePermissionCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 دقائق

// Helper function to check if user can access route
const canAccessRoute = (userRole, routeMeta) => {
  if (!routeMeta.allowedRoles) return true;

  const cacheKey = `${userRole}_${JSON.stringify(routeMeta)}`;
  const cached = routePermissionCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.result;
  }

  // Check if user role is allowed
  if (!routeMeta.allowedRoles.includes(userRole)) {
    routePermissionCache.set(cacheKey, { result: false, timestamp: Date.now() });
    return false;
  }

  // Check specific permissions if they exist
  if (routeMeta.permissions) {
    const permission = routeMeta.permissions[userRole];
    if (permission === 'none') {
      routePermissionCache.set(cacheKey, { result: false, timestamp: Date.now() });
      return false;
    }
  }

  routePermissionCache.set(cacheKey, { result: true, timestamp: Date.now() });
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

// Prefetch important routes
const prefetchRoutes = () => {
  const prefetchList = routes.filter(route => route.meta?.preload);
  
  prefetchList.forEach(route => {
    if (route.component && typeof route.component === 'function') {
      // تحميل مسبق بدون تنفيذ
      route.component().catch(() => {
        console.warn(`Prefetch failed for route: ${route.name}`);
      });
    }
  });
};

// تحميل متقطع للمسارات بناءً على أولوية المستخدم
const lazyPrefetch = () => {
  // تحميل أولي للمسارات المهمة بعد تحميل الصفحة الرئيسية
  setTimeout(() => {
    prefetchRoutes();
  }, 2000);
};

// Add router hooks
router.beforeEach(async (to, from, next) => {
  const store = useStore();
  const user = store.state.user;
  const userProfile = store.state.userProfile;

  // تحديث عنوان الصفحة
  document.title = to.meta?.title 
    ? `${to.meta.title} - نظام إدارة المخزون` 
    : 'نظام إدارة المخزون';

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
      // حفظ الرابط الحالي للعودة إليه بعد تسجيل الدخول
      store.dispatch('setRedirectPath', to.fullPath);
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
      if (!canAccessRoute(userRole, to.meta)) {
        next('/unauthorized');
        return;
      }

      // Special checks for warehouse managers
      if (!canWarehouseManagerAccess(userProfile, to.name)) {
        next('/unauthorized');
        return;
      }
    }

    // Prefetch next likely routes based on user role
    if (to.name === 'Dashboard') {
      const nextRoutes = [];
      switch (userRole) {
        case 'superadmin':
          nextRoutes.push('/warehouses', '/users', '/reports');
          break;
        case 'company_manager':
          nextRoutes.push('/inventory', '/transactions', '/reports');
          break;
        case 'warehouse_manager':
          nextRoutes.push('/inventory', '/transfers', '/dispatch');
          break;
      }
      
      // تحميل مسبق للمسارات المتوقعة
      setTimeout(() => {
        nextRoutes.forEach(path => {
          const route = router.resolve(path);
          if (route.route.component && typeof route.route.component === 'function') {
            route.route.component().catch(() => {});
          }
        });
      }, 100);
    }
  }

  // التحقق من أن المكون قد تم تحميله بنجاح
  try {
    if (to.matched.length > 0) {
      const matched = to.matched[0];
      if (matched.components?.default && typeof matched.components.default === 'function') {
        // تحميل المكون قبل الانتقال للتأكد من نجاح التحميل
        await matched.components.default();
      }
    }
    
    next();
  } catch (error) {
    console.error('Failed to load route component:', error);
    next('/unauthorized');
  }
});

router.afterEach((to, from) => {
  // مسح cache للصلاحيات عند تنقل المستخدم
  if (to.meta?.requiresAuth && from.meta?.requiresAuth) {
    // الحفاظ على cache للصلاحيات بين المسارات
  } else {
    // مسح cache عند الخروج من المسارات التي تتطلب صلاحيات
    routePermissionCache.clear();
  }

  // إرسال حدث لتحميل مسارات جديدة
  if (to.name && from.name) {
    window.dispatchEvent(new CustomEvent('routeChanged', { 
      detail: { from: from.name, to: to.name } 
    }));
  }
});

// Add navigation error handler to prevent redirect loops
router.onError((error) => {
  console.error('Router error:', error);

  if (error.message.includes('redirected')) {
    // تجنب الحلقات اللانهائية
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  if (error.message.includes('Failed to fetch dynamically imported module')) {
    // إعادة تحميل الصفحة في حالة فشل تحميل المكون
    if (window.location.pathname !== router.currentRoute.value.path) {
      window.location.href = router.currentRoute.value.path;
    }
  }
});

// تحسينات الأداء
let isInitialLoad = true;

router.isReady().then(() => {
  isInitialLoad = false;
  
  // بدء تحميل مسارات إضافية بعد تحميل الصفحة الأولى
  lazyPrefetch();
  
  // إضافة event listener لتحميل مسبق عند hover على الروابط
  document.addEventListener('mouseover', (e) => {
    const link = e.target.closest('a[href]');
    if (link) {
      const href = link.getAttribute('href');
      if (href && href.startsWith('/')) {
        const route = router.resolve(href);
        if (route.route && route.route.component && typeof route.route.component === 'function') {
          // تحميل مسبق عند hover
          setTimeout(() => {
            route.route.component().catch(() => {});
          }, 50);
        }
      }
    }
  }, { passive: true });
  
  // تحميل مسبق عند ظهور علامة scroll
  const observerOptions = {
    root: null,
    rootMargin: '100px',
    threshold: 0.1
  };

  const linkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const link = entry.target;
        const href = link.getAttribute('href');
        if (href && href.startsWith('/')) {
          const route = router.resolve(href);
          if (route.route && route.route.component && typeof route.route.component === 'function') {
            route.route.component().catch(() => {});
          }
        }
      }
    });
  }, observerOptions);

  // مراقبة جميع الروابط بعد تحميل الصفحة
  setTimeout(() => {
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      linkObserver.observe(link);
    });
  }, 1000);
});

// أداة لحساب زمن التحميل
const performanceMetrics = {
  startTime: null,
  endTime: null,
  
  startNavigation() {
    this.startTime = performance.now();
  },
  
  endNavigation() {
    if (this.startTime) {
      this.endTime = performance.now();
      const loadTime = this.endTime - this.startTime;
      
      // إرسال بيانات الأداء إذا زاد وقت التحميل عن حد معين
      if (loadTime > 1000) {
        console.warn(`Route load time: ${loadTime.toFixed(2)}ms`);
        
        // يمكن إرسال هذه البيانات لخدمة تحليل الأداء
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'route_load_time', {
            load_time: loadTime,
            route: router.currentRoute.value.path
          });
        }
      }
      
      this.reset();
    }
  },
  
  reset() {
    this.startTime = null;
    this.endTime = null;
  }
};

// إضافة hooks لقياس الأداء
router.beforeEach(() => {
  performanceMetrics.startNavigation();
});

router.afterEach(() => {
  setTimeout(() => {
    performanceMetrics.endNavigation();
  }, 0);
});

// تحسينات للـ SSR والـ PWA
if ('serviceWorker' in navigator && window.workbox) {
  window.addEventListener('load', () => {
    const wb = window.workbox;
    
    // Precaching for important routes
    wb.precaching.precacheAndRoute([
      { url: '/', revision: '1' },
      { url: '/login', revision: '1' },
      { url: '/dashboard', revision: '1' }
    ]);
    
    // Cache strategy for dynamic imports
    wb.routing.registerRoute(
      new RegExp('/_nuxt/'),
      new wb.strategies.CacheFirst({
        cacheName: 'js-chunks',
        plugins: [
          new wb.expiration.Plugin({
            maxEntries: 20,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          }),
        ],
      })
    );
  });
}

export default router;