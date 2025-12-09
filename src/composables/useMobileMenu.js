import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export function useMobileMenu() {
  const route = useRoute()
  const mobileMenuOpen = ref(false)
  
  const openMobileMenu = () => {
    mobileMenuOpen.value = true
  }
  
  const closeMobileMenu = () => {
    mobileMenuOpen.value = false
  }
  
  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
  }
  
  // Close menu on route change
  watch(() => route.path, () => {
    mobileMenuOpen.value = false
  })
  
  return {
    mobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu
  }
}