// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { 
      public: true,
      layout: 'empty',
      title: 'تسجيل الدخول'
    }
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'company_manager', 'warehouse_manager'],
      title: 'لوحة التحكم'
    }
  },
  {
    path: '/warehouses',
    name: 'Warehouses',
    component: () => import('@/views/Warehouses.vue'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin'],
      title: 'إدارة المخازن'
    }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/views/Users.vue'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin'],
      title: 'إدارة المستخدمين'
    }
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('@/views/Inventory.vue'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'company_manager', 'warehouse_manager'],
      permissions: {
        company_manager: 'viewer',
        warehouse_manager: 'full_access'
      },
      title: 'إدارة المخزون'
    }
  },
  {
    path: '/inventory/add',
    name: 'AddInventory',
    component: () => import('@/components/inventory/AddItemModal.vue'),
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
    component: () => import('@/components/inventory/EditItemModal.vue'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'warehouse_manager'],
      permissions: {
        company_manager: 'none',
        warehouse_manager: 'full_access'
      },
      title: 'تعديل الصنف'
    }
  },
  {
    path: '/transfers',
    name: 'Transfers',
    component: () => import('@/views/Transfers.vue'),
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
    component: () => import('@/views/Dispatch.vue'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'warehouse_manager'],
      permissions: {
        company_manager: 'none',
        warehouse_manager: 'full_access'
      },
      title: 'صرف خارجي'
    }
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import('@/views/Transactions.vue'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'company_manager', 'warehouse_manager'],
      permissions: {
        company_manager: 'viewer',
        warehouse_manager: 'viewer'
      },
      title: 'سجل الحركات'
    }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/Reports.vue'),
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
    component: () => import('@/views/Profile.vue'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'company_manager', 'warehouse_manager'],
      title: 'الملف الشخصي'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'company_manager'],
      title: 'الإعدادات'
    }
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('@/views/Help.vue'),
    meta: { 
      requiresAuth: true,
      title: 'المساعدة'
    }
  },
  {
    path: '/test',
    name: 'Test',
    component: {
      template: `
        <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div class="text-center">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">✅ اختبار التنقل</h1>
            <p class="text-gray-600 dark:text-gray-400 mb-6">الصفحة تعمل بنجاح!</p>
            <router-link to="/dashboard" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              العودة للرئيسية
            </router-link>
          </div>
        </div>
      `
    },
    meta: { 
      requiresAuth: true,
      title: 'اختبار',
      layout: 'empty'
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
            <router-link to="/dashboard" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
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
            <router-link to="/dashboard" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
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

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Return to saved position if exists
    if (savedPosition) {
      return savedPosition;
    }
    
    // Scroll to top for new routes
    if (to.hash) {
      return {
        selector: to.hash,
        behavior: 'smooth'
      };
    }
    
    // Default to top
    return { top: 0, left: 0, behavior: 'smooth' };
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

// Global store reference
let store = null;

// Store setup injection
export const setupRouter = (appStore) => {
  store = appStore;
};

// Navigation logging for debugging
const logNavigation = (from, to) => {
  console.group('🔗 Navigation');
  console.log('From:', from.name || from.path);
  console.log('To:', to.name || to.path);
  console.log('Full path:', to.fullPath);
  console.log('Params:', to.params);
  console.log('Query:', to.query);
  console.groupEnd();
};

// Navigation guard with improved error handling
router.beforeEach(async (to, from, next) => {
  // Log navigation for debugging
  logNavigation(from, to);
  
  // Set page title
  if (to.meta.title) {
    document.title = `${to.meta.title} - نظام إدارة المخازن`;
  }
  
  // Try to get store if not injected yet
  if (!store) {
    try {
      // Try to get store from global properties
      const app = router.app;
      if (app && app.config.globalProperties.$store) {
        store = app.config.globalProperties.$store;
      }
    } catch (error) {
      console.warn('Store not available:', error);
    }
  }

  // If still no store and route requires auth, redirect to login
  if (!store && to.meta.requiresAuth) {
    console.warn('Store not available, redirecting to login');
    next('/login');
    return;
  }

  // If store is not available, allow navigation for public routes
  if (!store) {
    if (to.meta.public) {
      next();
    } else {
      next('/login');
    }
    return;
  }

  // Get authentication state
  const isAuthenticated = store.getters.isAuthenticated;
  const userProfile = store.state.userProfile;
  const userRole = userProfile?.role;

  // Public routes - allow access
  if (to.meta.public) {
    // If user is already authenticated and trying to access login, redirect to dashboard
    if (to.name === 'Login' && isAuthenticated) {
      next('/dashboard');
      return;
    }
    next();
    return;
  }

  // Routes that require authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Store the intended URL for redirect after login
    if (to.path !== '/login') {
      store.commit('SET_REDIRECT_URL', to.fullPath);
    }
    next('/login');
    return;
  }

  // If authenticated but no user profile (shouldn't happen normally)
  if (isAuthenticated && !userProfile) {
    console.warn('Authenticated but no user profile, redirecting to login');
    store.dispatch('logout');
    next('/login');
    return;
  }

  // Role-based access control
  if (to.meta.allowedRoles) {
    // Check if user has a role
    if (!userRole) {
      console.warn('User has no role assigned');
      next('/unauthorized');
      return;
    }

    // Check if user's role is allowed
    if (!canAccessRoute(userRole, to.meta)) {
      console.log(`User role ${userRole} not allowed for route ${to.name}`);
      next('/unauthorized');
      return;
    }

    // Special checks for warehouse managers
    if (!canWarehouseManagerAccess(userProfile, to.name)) {
      console.log(`Warehouse manager access denied for ${to.name}`);
      next('/unauthorized');
      return;
    }
  }

  // All checks passed, allow navigation
  next();
});

// Navigation success handler
router.afterEach((to, from) => {
  // Update active navigation state in store if needed
  if (store) {
    store.commit('SET_CURRENT_ROUTE', to.name);
  }
  
  // Analytics tracking (if implemented)
  if (window.gtag && to.name) {
    window.gtag('event', 'page_view', {
      page_path: to.path,
      page_title: to.meta.title || to.name
    });
  }
});

// Error handler with recovery
router.onError((error) => {
  console.error('🚨 Router Error:', error);
  
  // Handle chunk loading errors (common in production)
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    console.warn('Chunk loading failed, likely due to deployment. Refreshing...');
    
    // Show user-friendly message
    const message = 'تم تحديث النظام. جاري إعادة تحميل الصفحة...';
    alert(message);
    
    // Reload after a delay
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    return;
  }
  
  // Handle navigation aborted errors
  if (error.name === 'NavigationDuplicated') {
    // This is normal, just ignore it
    return;
  }
  
  // Handle other errors
  if (error.message.includes('redirected')) {
    console.warn('Redirect loop detected');
    
    // Break the loop
    if (window.location.pathname !== '/login') {
      // Clear any problematic state
      if (store) {
        store.dispatch('logout');
      }
      localStorage.clear();
      window.location.href = '/login';
    }
  }
});

// Global navigation helper
router.navigateTo = async (path, options = {}) => {
  try {
    await router.push(path);
    return true;
  } catch (error) {
    console.error('Navigation failed:', error);
    
    // Show error to user if not a duplicate navigation
    if (error.name !== 'NavigationDuplicated' && options.showError !== false) {
      const message = options.errorMessage || 'حدث خطأ في التنقل إلى الصفحة';
      alert(message);
    }
    
    return false;
  }
};

// Add router to window for debugging (remove in production)
if (process.env.NODE_ENV === 'development') {
  window.router = router;
}

export default router;