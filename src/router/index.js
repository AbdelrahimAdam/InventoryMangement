// src/router/index.js - Updated for Firebase store
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { 
      public: true,  // This route is public
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
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
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

// Global store reference
let store = null;

// Store setup injection
export const setupRouter = (appStore) => {
  store = appStore;
  console.log('Router store injected');
};

// Simple navigation guard for Firebase
router.beforeEach((to, from, next) => {
  console.log('Router navigation:', {
    from: from.path,
    to: to.path,
    toName: to.name,
    meta: to.meta
  });

  // If store is not injected yet, try to get it
  if (!store) {
    console.warn('Store not available in router guard');
    
    // For public routes, allow access
    if (to.meta.public) {
      next();
      return;
    }
    
    // For protected routes without store, redirect to login
    next('/login');
    return;
  }

  // Get authentication state from store
  const isAuthenticated = store.getters.isAuthenticated;
  const userProfile = store.state.userProfile;
  const userRole = userProfile?.role;

  console.log('Auth state in router:', {
    isAuthenticated,
    userRole,
    userProfile: userProfile ? 'Loaded' : 'Not loaded'
  });

  // Public routes - allow access
  if (to.meta.public) {
    // If user is already authenticated and trying to access login, redirect to dashboard
    if (to.name === 'Login' && isAuthenticated) {
      console.log('Already authenticated, redirecting from login to dashboard');
      next('/dashboard');
      return;
    }
    next();
    return;
  }

  // Routes that require authentication
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    next('/login');
    return;
  }

  // If authenticated but user profile is not loaded yet (shouldn't happen)
  if (!userProfile) {
    console.warn('Authenticated but no user profile, allowing navigation');
    next();
    return;
  }

  // Check if user is active
  if (userProfile.is_active === false) {
    console.log('User account is inactive');
    store.dispatch('logout');
    next('/login');
    return;
  }

  // Role-based access control
  if (to.meta.allowedRoles) {
    if (!userRole) {
      console.log('User has no role assigned');
      next('/unauthorized');
      return;
    }

    if (!canAccessRoute(userRole, to.meta)) {
      console.log(`User role ${userRole} not allowed for route ${to.name}`);
      next('/unauthorized');
      return;
    }
  }

  // All checks passed
  next();
});

// Add error handling
router.onError((error) => {
  console.error('Router error:', error);

  // Handle chunk loading errors
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    console.warn('Chunk loading failed, likely due to deployment');
    alert('تم تحديث النظام. جاري إعادة تحميل الصفحة...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
});

export default router;