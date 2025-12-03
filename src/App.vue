<template>
  <div id="app" dir="rtl" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Show loading while initializing -->
    <div v-if="initializing" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">جاري التحميل...</p>
      </div>
    </div>

    <!-- Main app content -->
    <div v-else>
      <!-- If user is authenticated, show the authenticated layout -->
      <template v-if="isAuthenticated">
        <!-- The Dashboard component contains its own layout -->
        <router-view />
      </template>
      
      <!-- If not authenticated, show public pages (login, etc.) -->
      <template v-else>
        <router-view />
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'App',
  setup() {
    const store = useStore();
    const initializing = ref(true);

    // Check authentication status
    const isAuthenticated = computed(() => store.getters.isAuthenticated);

    onMounted(async () => {
      try {
        await store.dispatch('initializeAuth');
        await store.dispatch('loadWarehouses');
        
        // Initialize dark mode from localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        }
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        // Small delay to ensure smooth transition
        setTimeout(() => {
          initializing.value = false;
        }, 300);
      }
    });

    return {
      initializing,
      isAuthenticated
    };
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap');

* {
  font-family: 'Tajawal', Arial, sans-serif;
  box-sizing: border-box;
}

/* Base styles for RTL */
html {
  direction: rtl;
  text-align: right;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Better touch targets for mobile */
button,
a,
input,
select,
textarea {
  font-size: 16px; /* Prevents iOS zoom on focus */
}

@media (max-width: 640px) {
  button,
  a {
    min-height: 44px; /* Apple recommended minimum touch target */
    min-width: 44px;
  }
}

/* Improved scrollbar for mobile */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Mobile-first responsive utility classes */
.mobile-container {
  @apply w-full px-4 mx-auto;
}

@media (min-width: 640px) {
  .mobile-container {
    @apply px-6;
  }
}

@media (min-width: 768px) {
  .mobile-container {
    @apply px-8;
  }
}

@media (min-width: 1024px) {
  .mobile-container {
    @apply px-12 max-w-7xl;
  }
}

/* Mobile-safe margins and padding */
.safe-padding {
  @apply px-4 py-4;
}

@media (min-width: 640px) {
  .safe-padding {
    @apply px-6 py-6;
  }
}

/* Text size hierarchy for mobile */
.text-mobile-sm {
  @apply text-xs sm:text-sm;
}

.text-mobile-base {
  @apply text-sm sm:text-base;
}

.text-mobile-lg {
  @apply text-base sm:text-lg;
}

.text-mobile-xl {
  @apply text-lg sm:text-xl;
}

.text-mobile-2xl {
  @apply text-xl sm:text-2xl;
}

/* Grid utilities for mobile */
.grid-mobile {
  @apply grid grid-cols-1 gap-4;
}

@media (min-width: 640px) {
  .grid-mobile {
    @apply grid-cols-2;
  }
}

@media (min-width: 1024px) {
  .grid-mobile {
    @apply grid-cols-3;
  }
}

@media (min-width: 1280px) {
  .grid-mobile {
    @apply grid-cols-4;
  }
}

/* Mobile navigation safe area */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}

.pt-safe {
  padding-top: env(safe-area-inset-top, 0);
}

/* Improve tap highlights */
* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
}

/* Better focus styles for accessibility */
:focus:not(:focus-visible) {
  outline: none;
}

:focus-visible {
  outline: 2px solid #f59e0b;
  outline-offset: 2px;
}

/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Loading animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Mobile modal backdrop */
.modal-backdrop {
  @apply fixed inset-0 bg-black bg-opacity-50 z-50;
  backdrop-filter: blur(4px);
}

/* Mobile sheet (bottom sheet) */
.mobile-sheet {
  @apply fixed inset-x-0 bottom-0 bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

/* Mobile-first form styles */
.form-input-mobile {
  @apply w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg 
         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
         focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500
         placeholder-gray-500 dark:placeholder-gray-400
         transition-colors duration-200;
}

.form-select-mobile {
  @apply w-full pl-4 pr-10 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg 
         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
         focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500
         transition-colors duration-200
         appearance-none bg-no-repeat bg-[length:20px_20px] bg-[center_right_12px];
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
}

.dark .form-select-mobile {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
}

.form-label-mobile {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2;
}

.form-error-mobile {
  @apply mt-2 text-sm text-red-600 dark:text-red-400;
}

/* Mobile card styles */
.card-mobile {
  @apply bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 
         p-4 sm:p-6 transition-all duration-200;
}

.card-mobile:hover {
  @apply shadow-md;
}

/* Mobile button variants */
.btn-mobile {
  @apply inline-flex items-center justify-center px-4 py-3 text-base font-medium rounded-lg
         transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
         disabled:opacity-50 disabled:cursor-not-allowed;
  min-height: 44px;
}

.btn-mobile-primary {
  @apply bg-gradient-to-r from-yellow-500 to-orange-500 text-white
         hover:from-yellow-600 hover:to-orange-600
         focus:ring-yellow-500 shadow-md hover:shadow-lg;
}

.btn-mobile-secondary {
  @apply bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white
         hover:bg-gray-200 dark:hover:bg-gray-600
         focus:ring-gray-500;
}

.btn-mobile-outline {
  @apply border border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-300
         hover:bg-gray-50 dark:hover:bg-gray-800
         focus:ring-gray-500;
}

.btn-mobile-danger {
  @apply bg-red-600 text-white
         hover:bg-red-700
         focus:ring-red-500;
}

/* Mobile table styles */
.table-mobile {
  @apply min-w-full divide-y divide-gray-200 dark:divide-gray-700;
}

.table-mobile thead {
  @apply bg-gray-50 dark:bg-gray-800;
}

.table-mobile th {
  @apply px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider;
}

.table-mobile tbody {
  @apply divide-y divide-gray-200 dark:divide-gray-700;
}

.table-mobile td {
  @apply px-4 py-3 text-sm text-gray-900 dark:text-white;
}

/* Responsive table container */
.table-container-mobile {
  @apply overflow-x-auto -mx-4 sm:mx-0;
}

@media (min-width: 640px) {
  .table-container-mobile {
    @apply mx-0;
  }
}

/* Mobile navigation container */
.nav-container-mobile {
  @apply fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 pb-safe;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  body {
    background: white !important;
    color: black !important;
  }
}

/* Accessibility improvements */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  * {
    border-color: currentColor !important;
  }
  
  .btn-mobile-primary {
    background: #d97706 !important;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>