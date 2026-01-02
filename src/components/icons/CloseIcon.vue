<template>
  <svg 
    :class="computedClasses" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    :aria-label="ariaLabel"
    role="img"
  >
    <path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      :stroke-width="strokeWidth"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
</template>

<script>
export default {
  name: 'CloseIcon',
  props: {
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
    },
    color: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'primary', 'danger', 'warning', 'success', 'gray', 'white'].includes(value)
    },
    ariaLabel: {
      type: String,
      default: 'Close'
    },
    strokeWidth: {
      type: [String, Number],
      default: 2
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    sizeClasses() {
      const sizes = {
        xs: 'w-3 h-3 min-w-[12px] min-h-[12px]',
        sm: 'w-4 h-4 min-w-[16px] min-h-[16px]',
        md: 'w-5 h-5 min-w-[20px] min-h-[20px]',
        lg: 'w-6 h-6 min-w-[24px] min-h-[24px]',
        xl: 'w-8 h-8 min-w-[32px] min-h-[32px]'
      };
      return sizes[this.size] || sizes.md;
    },
    colorClasses() {
      const colors = {
        default: 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200',
        primary: 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300',
        danger: 'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300',
        warning: 'text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300',
        success: 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300',
        gray: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
        white: 'text-white dark:text-gray-100 hover:text-gray-200 dark:hover:text-gray-300'
      };
      return colors[this.color] || colors.default;
    },
    computedClasses() {
      return [
        this.sizeClasses,
        this.colorClasses,
        'transition-colors duration-200',
        'flex-shrink-0', // Prevent icon from shrinking in flex containers
        this.className
      ].join(' ').trim();
    }
  }
}
</script>

<style scoped>
/* Ensure proper contrast for accessibility */
@media (prefers-contrast: high) {
  svg {
    stroke-width: 2.5;
    stroke-opacity: 1;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  svg {
    transition: none;
  }
}

/* High contrast mode support */
@media (forced-colors: active) {
  svg {
    stroke: ButtonText;
    stroke-opacity: 1;
  }
}

/* Touch target optimization for mobile */
@media (max-width: 640px) {
  svg {
    min-width: 44px;
    min-height: 44px;
    padding: 8px;
  }
}

/* Focus management for accessibility */
:focus-visible {
  outline: 2px solid var(--color-primary, #3b82f6);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Dark mode enhancements */
.dark svg {
  stroke-opacity: 0.95;
}

/* Print styles */
@media print {
  svg {
    stroke: black !important;
    stroke-opacity: 1 !important;
  }
}
</style>