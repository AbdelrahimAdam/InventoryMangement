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
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
</template>

<script>
export default {
  name: 'LogoutIcon',
  props: {
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
    },
    color: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'primary', 'danger', 'warning', 'success', 'gray'].includes(value)
    },
    ariaLabel: {
      type: String,
      default: 'Logout'
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
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
        xl: 'w-8 h-8'
      };
      return sizes[this.size] || sizes.md;
    },
    colorClasses() {
      const colors = {
        default: 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100',
        primary: 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300',
        danger: 'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300',
        warning: 'text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300',
        success: 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300',
        gray: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
      };
      return colors[this.color] || colors.default;
    },
    computedClasses() {
      return [
        this.sizeClasses,
        this.colorClasses,
        'transition-colors duration-200',
        this.className
      ].join(' ').trim();
    }
  }
}
</script>

<style scoped>
/* Accessibility: Ensure proper contrast ratio */
@media (prefers-contrast: high) {
  svg {
    stroke-width: 2.5;
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  svg {
    transition: none;
  }
}

/* Focus styles for accessibility */
:focus-visible svg {
  outline: 2px solid currentColor;
  outline-offset: 2px;
  border-radius: 2px;
}

/* Dark mode specific adjustments */
.dark svg {
  stroke-opacity: 0.9;
}
</style>