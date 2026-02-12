<template>
  <div id="app" dir="rtl" class="min-h-screen relative isolate">
    <!-- Deep far background layer - creates atmospheric depth -->
    <div class="fixed inset-0 -z-30 overflow-hidden">
      <!-- Base gradient - ultra smooth professional base -->
      <div class="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-100/30 to-gray-50 dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950"></div>
      
      <!-- Distant radial glows - far background feeling -->
      <div class="absolute top-0 -left-1/4 w-[70rem] h-[70rem] bg-blue-50/20 dark:bg-blue-900/5 rounded-full blur-[150px]"></div>
      <div class="absolute bottom-0 -right-1/4 w-[70rem] h-[70rem] bg-purple-50/15 dark:bg-purple-900/4 rounded-full blur-[150px]"></div>
      <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] bg-indigo-50/10 dark:bg-indigo-900/3 rounded-full blur-[150px]"></div>
      
      <!-- Secondary depth layer - subtle texture -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.3)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.02)_0%,transparent_70%)]"></div>
    </div>

    <!-- Global Notifications - elevated above depth layers -->
    <div v-if="notifications.length > 0" class="fixed top-4 left-4 right-4 z-50 space-y-2 max-w-md mx-auto">
      <transition-group name="notification">
        <div 
          v-for="notification in notifications.slice(0, 3)" 
          :key="notification.id"
          :class="[
            'p-4 rounded-xl shadow-[0_8px_20px_-8px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_20px_-8px_rgba(0,0,0,0.2)] backdrop-blur-sm border backdrop-saturate-150',
            notification.type === 'error' ? 'bg-red-50/90 dark:bg-red-900/30 border-red-200/80 dark:border-red-800/50 text-red-800 dark:text-red-200' :
            notification.type === 'success' ? 'bg-green-50/90 dark:bg-green-900/30 border-green-200/80 dark:border-green-800/50 text-green-800 dark:text-green-200' :
            notification.type === 'warning' ? 'bg-yellow-50/90 dark:bg-yellow-900/30 border-yellow-200/80 dark:border-yellow-800/50 text-yellow-800 dark:text-yellow-200' :
            'bg-blue-50/90 dark:bg-blue-900/30 border-blue-200/80 dark:border-blue-800/50 text-blue-800 dark:text-blue-200'
          ]"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 v-if="notification.title" class="font-semibold mb-1 text-sm">{{ notification.title }}</h3>
              <p class="text-sm">{{ notification.message }}</p>
            </div>
            <button 
              @click="removeNotification(notification.id)"
              class="mr-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex-shrink-0 transition-colors"
              :aria-label="'إغلاق الإشعار'"
            >
              <CloseIcon size="sm" color="gray" />
            </button>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Minimal Initial Loading - with depth and elevation -->
    <div v-if="initializing && !isPublicRoute && !isMobileRoute" class="fixed inset-0 z-50">
      <!-- Background with depth -->
      <div class="absolute inset-0 bg-gradient-to-b from-gray-50/95 via-gray-100/90 to-white/95 dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-700/95 backdrop-blur-sm"></div>
      
      <!-- Subtle radial glows -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-50/20 dark:bg-blue-900/10 rounded-full blur-[100px]"></div>
      </div>
      
      <!-- Content card - elevated with soft shadow -->
      <div class="relative flex flex-col items-center justify-center h-full">
        <div class="relative group">
          <!-- Card background with elevation -->
          <div class="absolute inset-0 bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)] backdrop-blur-sm"></div>
          <div class="absolute inset-0 rounded-3xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.03)]"></div>
          
          <!-- Content -->
          <div class="relative px-12 py-10 text-center">
            <!-- Logo with subtle 3D effect -->
            <div class="mb-8">
              <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/90 to-purple-600/90 flex items-center justify-center shadow-[0_10px_20px_-5px_rgba(37,99,235,0.3),0_0_0_1px_rgba(255,255,255,0.1)_inset] dark:shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)_inset]">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
            </div>

            <!-- Loading Indicator -->
            <div class="flex justify-center mb-5">
              <div class="relative">
                <div class="animate-spin rounded-full h-14 w-14 border-4 border-blue-100/50 dark:border-gray-700/50 border-t-blue-600/80 dark:border-t-blue-400/80"></div>
                <div class="absolute inset-0 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"></div>
              </div>
            </div>

            <!-- Loading Text -->
            <p class="text-gray-800 dark:text-gray-200 font-medium text-lg mb-2">جاري تحميل النظام...</p>
            <p class="text-sm text-gray-600/80 dark:text-gray-400/80">يرجى الانتظار لحظات</p>

            <!-- Preloaded Inventory Status -->
            <div v-if="preloadedItems > 0" class="mt-8">
              <div class="w-64 bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2 backdrop-blur-sm">
                <div 
                  class="bg-gradient-to-r from-blue-500/90 to-purple-600/90 h-2 rounded-full transition-all duration-500 shadow-[0_2px_4px_rgba(37,99,235,0.1)]"
                  :style="{ width: `${preloadedProgress}%` }"
                  role="progressbar"
                  :aria-valuenow="preloadedProgress"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  :aria-label="`تم تحميل ${preloadedProgress}% من البيانات`"
                ></div>
              </div>
              <p class="text-xs text-gray-600/80 dark:text-gray-400/80 mt-3">
                تم تحميل {{ preloadedItems }} صنف
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main app content -->
    <div v-else class="h-screen flex flex-col relative z-10">
      <!-- Check if current route is public (login, unauthorized, notfound) -->
      <template v-if="isPublicRoute || isMobileRoute">
        <!-- Public pages - with depth background -->
        <div class="flex-1 overflow-y-auto relative">
          <div class="absolute inset-0 -z-10">
            <div class="absolute inset-0 bg-gradient-to-b from-gray-50/90 via-gray-100/50 to-gray-50/90 dark:from-gray-950/90 dark:via-gray-900/50 dark:to-gray-950/90 backdrop-blur-[2px]"></div>
            <div class="absolute top-20 left-[5%] w-[30rem] h-[30rem] bg-blue-50/20 dark:bg-blue-900/5 rounded-full blur-[100px]"></div>
            <div class="absolute bottom-20 right-[5%] w-[30rem] h-[30rem] bg-purple-50/15 dark:bg-purple-900/4 rounded-full blur-[100px]"></div>
          </div>
          <router-view />
        </div>
      </template>

      <!-- Authenticated layout -->
      <template v-else>
        <!-- Check if user has dashboard access -->
        <template v-if="hasDashboardAccess">
          <!-- Mobile Layout -->
          <div v-if="isMobile" class="lg:hidden h-full flex flex-col relative">
            <!-- Mobile Header -->
            <MobileHeader @toggle-menu="toggleMobileMenu" />

            <!-- Mobile Sidebar Overlay -->
            <transition name="fade">
              <div 
                v-if="mobileMenuOpen"
                class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                @click="mobileMenuOpen = false"
                role="presentation"
                aria-hidden="true"
              ></div>
            </transition>

            <!-- Mobile Sidebar -->
            <transition name="slide">
              <MobileSidebar v-if="mobileMenuOpen" @close="mobileMenuOpen = false" />
            </transition>

            <!-- Mobile Main Content - with depth -->
            <main class="flex-1 overflow-y-auto relative">
              <!-- Background depth layers -->
              <div class="fixed inset-0 -z-10">
                <div class="absolute inset-0 bg-gradient-to-b from-gray-50 to-white/95 dark:from-gray-900 dark:to-gray-800/95"></div>
                <div class="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50/20 to-transparent dark:from-blue-900/5"></div>
              </div>
              
              <!-- Content card with elevation -->
              <div class="max-w-full mx-auto p-4">
                <div class="relative">
                  <div class="absolute inset-0 bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02),0_8px_20px_-6px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_25px_-6px_rgba(0,0,0,0.2)] backdrop-blur-sm"></div>
                  <div class="absolute inset-0 rounded-2xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.03)]"></div>
                  <div class="relative p-4">
                    <router-view />
                  </div>
                </div>
              </div>
            </main>

            <!-- Mobile Bottom Navigation -->
            <MobileBottomNav />
          </div>

          <!-- Desktop Layout - with enhanced depth system -->
          <div v-else class="hidden lg:flex h-full relative">
            <!-- Desktop Sidebar - with elevation -->
            <DesktopSidebar 
              :collapsed="sidebarCollapsed" 
              @toggle="toggleSidebar"
              class="relative z-20 shadow-[4px_0_25px_-8px_rgba(0,0,0,0.03)] dark:shadow-[4px_0_25px_-8px_rgba(0,0,0,0.2)]"
            />

            <!-- Main Content Area -->
            <div class="flex-1 flex flex-col overflow-hidden relative z-10 bg-transparent">
              <!-- Desktop Header -->
              <DesktopHeader @toggle-sidebar="toggleSidebar" />

              <!-- Main Content -->
              <main class="flex-1 overflow-y-auto p-5 lg:p-6">
                <div class="max-w-full mx-auto relative">
                  <!-- Preload Indicator (Only show briefly) - elevated card style -->
                  <div v-if="showPreloadIndicator && !initialDataLoaded" class="mb-5">
                    <div class="relative group">
                      <div class="absolute inset-0 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-[0_4px_12px_-4px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_20px_-8px_rgba(0,0,0,0.15)] backdrop-blur-sm"></div>
                      <div class="absolute inset-0 rounded-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.03)]"></div>
                      <div class="relative p-4">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-3">
                            <div class="relative">
                              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/90 to-purple-600/90 flex items-center justify-center shadow-[0_6px_12px_-4px_rgba(37,99,235,0.2)]">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                </svg>
                              </div>
                            </div>
                            <div>
                              <p class="text-sm font-medium text-gray-800 dark:text-gray-200">جاري تحميل المخزون...</p>
                              <p class="text-xs text-gray-600/80 dark:text-gray-400/80">تحميل {{ preloadedItems }} من {{ preloadedTarget }} صنف</p>
                            </div>
                          </div>
                          <div class="w-24 bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2 backdrop-blur-sm">
                            <div 
                              class="bg-gradient-to-r from-green-500/90 to-emerald-600/90 h-2 rounded-full transition-all duration-300 shadow-[0_2px_4px_rgba(16,185,129,0.1)]"
                              :style="{ width: `${preloadedProgress}%` }"
                              role="progressbar"
                              :aria-valuenow="preloadedProgress"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Main content card with floating elevation -->
                  <div class="relative group">
                    <div class="absolute inset-0 bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-[0_2px_20px_-6px_rgba(0,0,0,0.02),0_8px_30px_-8px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-all duration-300 group-hover:shadow-[0_20px_35px_-12px_rgba(0,0,0,0.03)] dark:group-hover:shadow-[0_20px_35px_-12px_rgba(0,0,0,0.25)]"></div>
                    <div class="absolute inset-0 rounded-2xl shadow-[inset_0_1px_3px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.03)]"></div>
                    <div class="relative p-5 lg:p-6">
                      <router-view />
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </template>

        <!-- No Dashboard Access Message - with depth and elevation -->
        <template v-else>
          <div class="h-full flex items-center justify-center relative">
            <!-- Background depth -->
            <div class="fixed inset-0 -z-10">
              <div class="absolute inset-0 bg-gradient-to-b from-gray-50/90 via-gray-100/50 to-gray-50/90 dark:from-gray-950/90 dark:via-gray-900/50 dark:to-gray-950/90"></div>
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-yellow-50/20 dark:bg-yellow-900/5 rounded-full blur-[120px]"></div>
            </div>
            
            <!-- Content card -->
            <div class="relative max-w-lg mx-auto p-6">
              <div class="absolute inset-0 bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-[0_25px_40px_-15px_rgba(0,0,0,0.03)] dark:shadow-[0_25px_40px_-15px_rgba(0,0,0,0.2)] backdrop-blur-sm"></div>
              <div class="absolute inset-0 rounded-3xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.03)]"></div>
              <div class="relative text-center p-8">
                <div class="w-20 h-20 bg-yellow-100/80 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_10px_20px_-8px_rgba(234,179,8,0.2)]">
                  <svg class="w-10 h-10 text-yellow-700 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">غير مصرح بالوصول</h2>
                <p class="text-gray-700 dark:text-gray-300 mb-8 max-w-md mx-auto">
                  عذراً، ليس لديك صلاحية للوصول إلى لوحة التحكم. يرجى التواصل مع المشرف.
                </p>
                <div class="space-x-4">
                  <button 
                    @click="logout"
                    class="px-6 py-3 bg-blue-600/90 text-white rounded-xl hover:bg-blue-700 transition-all shadow-[0_8px_16px_-6px_rgba(37,99,235,0.3)] hover:shadow-[0_10px_20px_-6px_rgba(37,99,235,0.4)] flex items-center gap-2 mx-auto backdrop-blur-sm"
                    :aria-label="'تسجيل الخروج'"
                  >
                    <LogoutIcon size="sm" color="white" />
                    تسجيل الخروج
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import MobileHeader from '@/components/layout/MobileHeader.vue';
import MobileSidebar from '@/components/layout/MobileSidebar.vue';
import MobileBottomNav from '@/components/layout/MobileBottomNav.vue';
import DesktopSidebar from '@/components/layout/DesktopSidebar.vue';
import DesktopHeader from '@/components/layout/DesktopHeader.vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';
import LogoutIcon from '@/components/icons/LogoutIcon.vue';

export default {
  name: 'App',
  components: {
    MobileHeader,
    MobileSidebar,
    MobileBottomNav,
    DesktopSidebar,
    DesktopHeader,
    CloseIcon,
    LogoutIcon
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    
    // Refs
    const initializing = ref(true);
    const mobileMenuOpen = ref(false);
    const sidebarCollapsed = ref(false);
    const isMobile = ref(false);
    const preloadedItems = ref(0);
    const preloadedTarget = ref(20);
    const initialDataLoaded = ref(false);
    const showPreloadIndicator = ref(false);
    
    // Store getters
    const notifications = computed(() => store.state.notifications || []);
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const userProfile = computed(() => store.state.userProfile);
    const userRole = computed(() => store.getters.userRole);
    const allowedWarehouses = computed(() => store.getters.allowedWarehouses);
    const warehousesLoaded = computed(() => store.state.warehousesLoaded);
    
    // Computed properties
    const isPublicRoute = computed(() => {
      const publicRoutes = ['Login', 'Unauthorized', 'NotFound', 'ForgotPassword', 'ResetPassword'];
      return publicRoutes.includes(route.name);
    });

    const isMobileRoute = computed(() => {
      return route.name === 'MobileLogin' || route.name === 'MobileUnauthorized';
    });

    const preloadedProgress = computed(() => {
      return Math.min(100, Math.round((preloadedItems.value / preloadedTarget.value) * 100));
    });

    const hasDashboardAccess = computed(() => {
      if (!isAuthenticated.value) return false;
      
      const role = userRole.value;
      const allowed = allowedWarehouses.value;
      
      if (role === 'superadmin' || role === 'company_manager') {
        return true;
      }
      
      if (role === 'warehouse_manager') {
        return allowed && allowed.length > 0;
      }
      
      return ['superadmin', 'company_manager', 'warehouse_manager'].includes(role);
    });

    // Methods
    const removeNotification = (notificationId) => {
      store.dispatch('removeNotification', notificationId);
    };

    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value;
      localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value.toString());
    };

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;
    };

    const logout = async () => {
      try {
        await store.dispatch('logout');
        router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    const preloadEssentialData = async () => {
      try {
        const { db } = await import('@/firebase/config');
        const { collection, query, orderBy, limit, getDocs, where } = await import('firebase/firestore');
        
        await store.dispatch('loadWarehouses');
        
        if (isAuthenticated.value && userProfile.value) {
          let accessibleWarehouses = store.getters.accessibleWarehouses;
          
          if (accessibleWarehouses.length === 0) {
            console.log('⚠️ User has no accessible warehouses');
            initialDataLoaded.value = true;
            return;
          }
          
          const warehouseIds = accessibleWarehouses.map(w => w.id);
          
          let itemsQuery;
          
          if (warehouseIds.length > 0) {
            itemsQuery = query(
              collection(db, 'items'),
              where('warehouse_id', 'in', warehouseIds.slice(0, 10)),
              orderBy('updated_at', 'desc'),
              limit(15)
            );
          } else {
            itemsQuery = query(
              collection(db, 'items'),
              orderBy('updated_at', 'desc'),
              limit(15)
            );
          }
          
          const itemsSnapshot = await getDocs(itemsQuery);
          const items = itemsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          store.commit('SET_INVENTORY', items);
          preloadedItems.value = items.length;
          
          items.forEach((item, index) => {
            setTimeout(() => {
              preloadedItems.value = index + 1;
            }, index * 50);
          });
          
          initialDataLoaded.value = true;
          
          showPreloadIndicator.value = true;
          setTimeout(() => {
            showPreloadIndicator.value = false;
          }, 2000);
          
          setTimeout(() => {
            loadRemainingDataInBackground();
          }, 1000);
        }
        
      } catch (error) {
        console.warn('Preload warning (non-critical):', error.message);
        initialDataLoaded.value = true;
      }
    };

    const loadRemainingDataInBackground = async () => {
      try {
        store.dispatch('loadAllInventory', { forceRefresh: false });
        store.dispatch('fetchTransactions');
        
        if (store.getters.canManageInvoices) {
          store.dispatch('loadAllInvoices');
        }
        
        if (userRole.value === 'superadmin') {
          store.dispatch('loadUsers');
        }
        
        store.dispatch('refreshDashboardCounts', 'all');
        
      } catch (error) {
        console.error('Background load error:', error);
      }
    };

    const initializeApp = async () => {
      try {
        await store.dispatch('initializeAuth');
        
        if (!isAuthenticated.value) {
          initializing.value = false;
          return;
        }
        
        const preloadPromise = preloadEssentialData();
        
        await Promise.race([
          preloadPromise,
          new Promise(resolve => setTimeout(resolve, 2000))
        ]);
        
        if (!hasDashboardAccess.value) {
          console.warn('⚠️ User does not have dashboard access');
          store.dispatch('showNotification', {
            type: 'warning',
            message: 'ليس لديك صلاحية للوصول إلى لوحة التحكم. يرجى التواصل مع المشرف.',
            duration: 5000
          });
        } else {
          if (isAuthenticated.value && !localStorage.getItem('welcomeShown')) {
            setTimeout(() => {
              store.dispatch('showNotification', {
                type: 'success',
                message: `مرحباً ${userProfile.value.name || userProfile.value.email}!`,
                duration: 3000
              });
              localStorage.setItem('welcomeShown', 'true');
            }, 500);
          }
        }
        
        initializeTheme();
        
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState !== null) {
          sidebarCollapsed.value = savedState === 'true';
        }

      } catch (error) {
        console.error('App initialization error:', error);
        
        store.dispatch('showNotification', {
          type: 'error',
          message: 'حدث خطأ في تحميل بعض البيانات. يمكنك الاستمرار في العمل.',
          duration: 5000
        });
      } finally {
        setTimeout(() => {
          initializing.value = false;
        }, 300);
      }
    };

    const initializeTheme = () => {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          if (e.matches) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      });
    };

    const checkMobile = () => {
      isMobile.value = window.innerWidth < 1024;
    };

    onMounted(async () => {
      checkMobile();
      window.addEventListener('resize', checkMobile);
      
      initializeApp();
      
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          const performance = window.performance;
          const timing = performance?.timing;
          if (timing) {
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
            console.log(`🚀 App loaded in ${loadTime}ms, DOM ready in ${domReadyTime}ms`);
          }
        }, 1000);
      }
    });

    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile);
    });

    watch(() => route.path, () => {
      mobileMenuOpen.value = false;
    });

    watch(isAuthenticated, (authenticated) => {
      if (authenticated && !initialDataLoaded.value) {
        setTimeout(() => {
          preloadEssentialData();
        }, 100);
      }
    });

    watch(userProfile, (profile) => {
      if (profile && isAuthenticated.value && !initialDataLoaded.value) {
        setTimeout(() => {
          preloadEssentialData();
        }, 100);
      }
    });

    return {
      initializing,
      mobileMenuOpen,
      sidebarCollapsed,
      isMobile,
      preloadedItems,
      preloadedTarget,
      initialDataLoaded,
      showPreloadIndicator,
      isAuthenticated,
      isPublicRoute,
      isMobileRoute,
      notifications,
      preloadedProgress,
      hasDashboardAccess,
      userRole,
      removeNotification,
      toggleSidebar,
      toggleMobileMenu,
      logout
    };
  }
};
</script>

<style scoped>
/* 
 * Visual Depth System - Professional Dashboard Aesthetic
 * Features:
 * - Multi-layer background with far/mid/near perception
 * - Floating card elevation with dual-shadow system
 * - Ultra-subtle color palette (gray/blue-gray/purple tints)
 * - Performance optimized with backdrop-blur and transitions
 */

/* Mobile sidebar animation */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Fade animation for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Notification animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Performance optimizations */
#app {
  font-family: 'Tajawal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Optimize scroll performance */
main {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

/* Smooth depth transitions */
.relative.group .absolute {
  transition: box-shadow 0.3s cubic-bezier(0.2, 0, 0, 1), backdrop-filter 0.3s ease;
}

/* Reduce motion where supported */
@media (prefers-reduced-motion: reduce) {
  .slide-enter-active,
  .slide-leave-active,
  .fade-enter-active,
  .fade-leave-active,
  .notification-enter-active,
  .notification-leave-active,
  .relative.group .absolute {
    transition: none !important;
  }
  
  .notification-enter-from,
  .notification-leave-to {
    transform: none !important;
  }
  
  .animate-spin {
    animation: none !important;
  }
  
  .animate-pulse {
    animation: none !important;
  }
}

/* Print styles */
@media print {
  #app {
    background: white !important;
  }
  
  .no-print {
    display: none !important;
  }
}

/* Optimize for mobile */
@media (max-width: 640px) {
  #app {
    font-size: 14px;
  }
}

/* Dark mode optimizations - maintain depth perception */
.dark .bg-gradient-to-b {
  background-image: linear-gradient(to bottom, var(--tw-gradient-stops));
}

/* Ensure proper stacking context for depth layers */
.fixed {
  isolation: isolate;
}

/* Accessibility: Ensure proper focus styles */
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 8px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .bg-gray-50 {
    background-color: #ffffff !important;
  }
  
  .dark .bg-gray-900 {
    background-color: #000000 !important;
  }
  
  .border-gray-200 {
    border-color: #000000 !important;
  }
  
  .text-gray-600 {
    color: #000000 !important;
  }
  
  .dark .text-gray-400 {
    color: #ffffff !important;
  }
}

/* Forced colors mode (Windows High Contrast) */
@media (forced-colors: active) {
  button,
  [role="button"] {
    border: 2px solid ButtonText;
  }
  
  .border {
    border-color: CanvasText;
  }
  
  svg {
    forced-color-adjust: none;
    stroke: ButtonText;
  }
}

/* Touch target optimization for mobile */
@media (max-width: 768px) {
  button,
  [role="button"] {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Subtle hover elevation for interactive cards */
.relative.group:hover .absolute:first-of-type {
  box-shadow: 0 25px 40px -15px rgba(0,0,0,0.02), 0 0 0 1px rgba(255,255,255,0.5) inset;
}

:global(.dark) .relative.group:hover .absolute:first-of-type {
  box-shadow: 0 25px 40px -15px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.03) inset;
}
</style>
