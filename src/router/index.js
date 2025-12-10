// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useStore } from 'vuex';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { 
      requiresGuest: true,
      layout: 'empty'
    }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin', 'company_manager', 'warehouse_manager']
    }
  },
  {
    path: '/warehouses',
    name: 'Warehouses',
    component: () => import('@/views/Warehouses.vue'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin']
    }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/views/Users.vue'),
    meta: { 
      requiresAuth: true,
      allowedRoles: ['superadmin']
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
      }
    }
  },
  {
    path: '/inventory/add',
    name: 'AddInventory',
    component: () => import('@/views/Inventory.vue'),
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
    component: () => import('@/views/Inventory.vue'),
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
    component: () => import('@/views/Inventory.vue'),
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
    component: () => import('@/views/Transfers.vue'),
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
    component: () => import('@/views/Dispatch.vue'),
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
    component: () => import('@/views/Transactions.vue'),
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
    component: () => import('@/views/Reports.vue'),
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
    component: () => import('@/views/Profile.vue'),
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
  routes
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

export default router;
