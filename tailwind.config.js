/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // This enables class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        arabic: {
          gold: '#d4af37',
          teal: '#0d9488',
          navy: '#1e3a8a',
        }
      },
      fontFamily: {
        'arabic': ['Tajawal', 'system-ui', 'sans-serif'],
      },
      direction: {
        'rtl': 'rtl',
      },
      // Extended color palette for better dark mode support
      backgroundColor: {
        'dark-800': '#1f2937',
        'dark-900': '#111827',
      },
      textColor: {
        'dark-100': '#f3f4f6',
        'dark-200': '#e5e7eb',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}