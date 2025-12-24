<template>
  <div v-if="showInstallPrompt" class="pwa-install-prompt">
    <div class="pwa-install-content">
      <div class="pwa-install-icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
      </div>
      <div class="pwa-install-text">
        <h3>تثبيت التطبيق</h3>
        <p>تثبيت تطبيق إدارة المخازن على جهازك لتجربة أفضل</p>
      </div>
      <div class="pwa-install-actions">
        <button @click="dismissPrompt" class="pwa-install-btn secondary">
          لاحقاً
        </button>
        <button @click="installApp" class="pwa-install-btn primary">
          تثبيت
        </button>
      </div>
      <button @click="dismissPrompt" class="pwa-install-close">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PWAInstallPrompt',
  data() {
    return {
      deferredPrompt: null,
      showInstallPrompt: false,
      dismissed: false,
      debugMode: process.env.NODE_ENV === 'development'
    }
  },
  mounted() {
    console.log('📱 PWAInstallPrompt mounted')
    
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt)
    
    // Listen for app installed event
    window.addEventListener('appinstalled', this.handleAppInstalled)
    
    // Check if already installed
    this.checkIfInstalled()
    
    // Check if should show prompt (not dismissed recently)
    this.checkDismissalStatus()
    
    // Check if we should show prompt based on criteria
    setTimeout(() => {
      this.checkAndShowPrompt()
    }, 3000)
    
    // Hide the HTML button if our Vue component is showing
    this.hideHTMLButton()
  },
  beforeUnmount() {
    window.removeEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt)
    window.removeEventListener('appinstalled', this.handleAppInstalled)
  },
  methods: {
    handleBeforeInstallPrompt(e) {
      console.log('✅ beforeinstallprompt event fired', e)
      
      e.preventDefault()
      this.deferredPrompt = e
      
      if (!this.dismissed) {
        this.showInstallPrompt = true
        console.log('📱 Showing install prompt from browser event')
        
        // Hide the HTML button since we're showing ours
        this.hideHTMLButton()
      }
    },
    
    handleAppInstalled() {
      console.log('🎉 App was installed successfully')
      this.dismissed = true
      this.showInstallPrompt = false
      this.deferredPrompt = null
      
      this.showNotification('تم تثبيت التطبيق بنجاح!', 'success')
    },
    
    async installApp() {
      console.log('📱 Install button clicked in Vue component')
      
      // FIRST: Try browser's deferredPrompt
      if (this.deferredPrompt) {
        await this.showBrowserInstallPrompt()
        return
      }
      
      // SECOND: Check if we're on Chrome and can trigger install
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
      if (isChrome) {
        console.log('📱 Chrome detected, trying to trigger install...')
        await this.triggerChromeInstall()
        return
      }
      
      // THIRD: Show device-specific instructions
      console.log('📱 Showing device-specific instructions')
      this.showDeviceSpecificInstructions()
    },
    
    async showBrowserInstallPrompt() {
      if (!this.deferredPrompt) return
      
      try {
        console.log('📱 Showing browser install prompt...')
        this.deferredPrompt.prompt()
        
        const choiceResult = await this.deferredPrompt.userChoice
        console.log(`📱 User choice: ${choiceResult.outcome}`)
        
        if (choiceResult.outcome === 'accepted') {
          console.log('✅ User accepted the install')
          this.showNotification('جاري تثبيت التطبيق...', 'success')
        } else {
          console.log('❌ User dismissed the install')
          this.showNotification('تم إلغاء التثبيت', 'warning')
        }
        
        this.deferredPrompt = null
        this.showInstallPrompt = false
        this.dismissPrompt()
        
      } catch (error) {
        console.error('📱 Install prompt error:', error)
        this.showDeviceSpecificInstructions()
      }
    },
    
    async triggerChromeInstall() {
      console.log('📱 Attempting to trigger Chrome installation...')
      
      // Show loading toast
      this.showNotification('جاري إعداد التثبيت...', 'info')
      
      // Method 1: Try to trigger beforeinstallprompt by reloading
      sessionStorage.setItem('forcePWAInstall', 'true')
      
      // Method 2: Show Chrome-specific instructions
      this.showChromeInstructions()
    },
    
    showChromeInstructions() {
      const isAndroid = /Android/.test(navigator.userAgent)
      const isDesktop = !isAndroid && !/iPad|iPhone|iPod/.test(navigator.userAgent)
      
      let title = ''
      let steps = []
      
      if (isAndroid) {
        title = 'تثبيت على Android (Chrome)'
        steps = [
          'اضغط على ⋮ (القائمة) في أعلى المتصفح',
          'اختر "إضافة إلى الشاشة الرئيسية"',
          'اضغط على "إضافة"'
        ]
      } else if (isDesktop) {
        title = 'تثبيت على الكمبيوتر (Chrome)'
        steps = [
          'ابحث عن أيقونة 📥 في شريط العنوان',
          'أو اضغط على ⋮ → "تثبيت تطبيق إدارة المخازن"',
          'اضغط على "تثبيت"'
        ]
      }
      
      // Show modal with instructions
      this.showInstructionsModal(title, steps, 'Chrome')
    },
    
    showDeviceSpecificInstructions() {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
      const isAndroid = /Android/.test(navigator.userAgent)
      const isDesktop = !isIOS && !isAndroid
      
      let title = ''
      let steps = []
      let browser = ''
      
      if (isIOS) {
        title = 'تثبيت على iPhone/iPad'
        steps = [
          'اضغط على 📤 (مشاركة) في أسفل Safari',
          'مرر لأسفل وابحث عن "أضف إلى الشاشة الرئيسية"',
          'اضغط على "إضافة" في الزاوية اليمنى العليا'
        ]
        browser = 'Safari'
      } else if (isAndroid) {
        title = 'تثبيت على Android'
        steps = [
          'اضغط على ⋮ (القائمة) في أعلى المتصفح',
          'اختر "إضافة إلى الشاشة الرئيسية"',
          'اضغط على "إضافة"'
        ]
        browser = 'Chrome'
      } else {
        title = 'تثبيت على الكمبيوتر'
        steps = [
          'ابحث عن أيقونة 📥 في شريط العنوان (Chrome/Edge)',
          'أو اضغط على ⋮ → "تثبيت تطبيق إدارة المخازن"',
          'اضغط على "تثبيت"'
        ]
        browser = 'Chrome أو Edge'
      }
      
      this.showInstructionsModal(title, steps, browser)
    },
    
    showInstructionsModal(title, steps, browser) {
      const stepsHTML = steps.map(step => 
        `<li style="margin-bottom: 8px; padding-right: 10px;">${step}</li>`
      ).join('')
      
      const modal = document.createElement('div')
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        padding: 20px;
        animation: fadeIn 0.3s ease;
      `
      
      modal.innerHTML = `
        <div style="background: white; border-radius: 12px; padding: 25px; max-width: 450px; width: 100%; text-align: right; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="margin: 0; color: #1f2937; font-size: 18px;">${title}</h3>
            <button onclick="this.parentElement.parentElement.parentElement.remove()" 
              style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
              ✕
            </button>
          </div>
          
          <div style="color: #4b5563; margin-bottom: 25px; line-height: 1.6;">
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <strong>الخطوات:</strong>
              <ol style="margin-right: 20px; margin-top: 10px;">
                ${stepsHTML}
              </ol>
            </div>
            
            <div style="background: #e8f4fd; border-right: 4px solid #3b82f6; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; color: #1e40af; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                <span>💡</span> ملاحظة:
              </p>
              <p style="margin: 8px 0 0 0; color: #374151; font-size: 14px;">
                تأكد من استخدام ${browser} المتصفح
              </p>
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; gap: 10px;">
            <button onclick="window.location.reload()" 
              style="flex: 1; background: #3b82f6; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-family: 'Tajawal'; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 8px;">
              <span>🔄</span> إعادة تحميل
            </button>
            <button onclick="this.parentElement.parentElement.parentElement.remove()" 
              style="flex: 1; background: #f1f5f9; color: #475569; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-family: 'Tajawal'; font-weight: 500;">
              إغلاق
            </button>
          </div>
        </div>
      `
      
      document.body.appendChild(modal)
      
      // Add animation style if not exists
      if (!document.querySelector('#modal-animations')) {
        const style = document.createElement('style')
        style.id = 'modal-animations'
        style.textContent = `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `
        document.head.appendChild(style)
      }
      
      // Close on background click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal)
        }
      })
    },
    
    dismissPrompt() {
      this.showInstallPrompt = false
      this.dismissed = true
      localStorage.setItem('pwaPromptDismissed', Date.now().toString())
    },
    
    checkIfInstalled() {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
      const isIOSStandalone = isIOS && window.navigator.standalone
      
      if (isStandalone || isIOSStandalone) {
        console.log('📱 App appears to be already installed')
        this.dismissed = true
        this.showInstallPrompt = false
        this.hideHTMLButton()
        return true
      }
      
      return false
    },
    
    checkDismissalStatus() {
      const dismissedTime = localStorage.getItem('pwaPromptDismissed')
      if (dismissedTime) {
        const hoursSinceDismiss = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60)
        if (hoursSinceDismiss < 24) {
          this.dismissed = true
          this.hideHTMLButton()
        } else {
          localStorage.removeItem('pwaPromptDismissed')
          this.dismissed = false
        }
      }
    },
    
    checkAndShowPrompt() {
      // Check basic PWA criteria
      const hasServiceWorker = !!navigator.serviceWorker?.controller
      const hasManifest = !!document.querySelector('link[rel="manifest"]')
      const isHTTPS = window.location.protocol === 'https:'
      
      const basicCriteriaMet = isHTTPS && hasServiceWorker && hasManifest
      
      if (basicCriteriaMet && !this.dismissed && !this.showInstallPrompt) {
        console.log('📱 Basic PWA criteria met, showing install prompt')
        this.showInstallPrompt = true
        this.hideHTMLButton()
      }
    },
    
    hideHTMLButton() {
      // Hide the HTML button from index.html to avoid conflicts
      const htmlButton = document.getElementById('install-btn')
      if (htmlButton) {
        htmlButton.style.display = 'none'
      }
    },
    
    showNotification(message, type = 'info') {
      if (this.$store && this.$store.dispatch) {
        this.$store.dispatch('showNotification', {
          type,
          message,
          duration: 5000
        })
      } else {
        // Fallback: create a simple toast
        const toast = document.createElement('div')
        toast.textContent = message
        toast.style.cssText = `
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
          color: white;
          padding: 14px 28px;
          border-radius: 10px;
          z-index: 10002;
          font-family: 'Tajawal', sans-serif;
          font-weight: 500;
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
          animation: slideDown 0.3s ease;
          max-width: 90%;
          text-align: center;
        `
        
        document.body.appendChild(toast)
        
        setTimeout(() => {
          toast.style.opacity = '0'
          toast.style.transition = 'opacity 0.3s ease'
          setTimeout(() => {
            if (toast.parentNode) document.body.removeChild(toast)
          }, 300)
        }, 4000)
        
        // Add animation style if not exists
        if (!document.querySelector('#toast-animations')) {
          const style = document.createElement('style')
          style.id = 'toast-animations'
          style.textContent = `
            @keyframes slideDown {
              from {
                transform: translate(-50%, -100%);
                opacity: 0;
              }
              to {
                transform: translate(-50%, 0);
                opacity: 1;
              }
            }
          `
          document.head.appendChild(style)
        }
      }
    },
    
    // Debug function
    testPWA() {
      const status = {
        isHTTPS: window.location.protocol === 'https:',
        hasServiceWorker: 'serviceWorker' in navigator,
        serviceWorkerActive: !!navigator.serviceWorker?.controller,
        hasManifest: !!document.querySelector('link[rel="manifest"]'),
        hasIcons: document.querySelectorAll('link[rel*="icon"]').length > 0,
        deferredPrompt: !!this.deferredPrompt,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches
      }
      
      console.log('📱 PWA Test:', status)
      return status
    }
  }
}
</script>

<style scoped>
.pwa-install-prompt {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  z-index: 9999;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.pwa-install-content {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  position: relative;
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1),
                0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  50% {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1),
                0 0 0 10px rgba(59, 130, 246, 0);
  }
}

.pwa-install-icon {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 10px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
  flex-shrink: 0;
}

.pwa-install-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.pwa-install-text {
  flex: 1;
  text-align: right;
}

.pwa-install-text h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.pwa-install-text p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.pwa-install-actions {
  display: flex;
  gap: 8px;
  margin-right: 12px;
}

.pwa-install-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  font-family: 'Tajawal', sans-serif;
}

.pwa-install-btn.primary {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
}

.pwa-install-btn.primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.pwa-install-btn.secondary {
  background: #f3f4f6;
  color: #4b5563;
}

.pwa-install-btn.secondary:hover {
  background: #e5e7eb;
}

.pwa-install-close {
  position: absolute;
  top: 8px;
  left: 8px;
  background: none;
  border: none;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #9ca3af;
  border-radius: 6px;
  transition: all 0.2s;
}

.pwa-install-close:hover {
  background: #f3f4f6;
  color: #6b7280;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .pwa-install-content {
    background: #1f2937;
    border-color: #374151;
  }
  
  .pwa-install-text h3 {
    color: #f9fafb;
  }
  
  .pwa-install-text p {
    color: #d1d5db;
  }
  
  .pwa-install-btn.secondary {
    background: #374151;
    color: #e5e7eb;
  }
  
  .pwa-install-btn.secondary:hover {
    background: #4b5563;
  }
  
  .pwa-install-close {
    color: #9ca3af;
  }
  
  .pwa-install-close:hover {
    background: #374151;
    color: #d1d5db;
  }
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .pwa-install-prompt {
    bottom: 10px;
    left: 10px;
    right: 10px;
  }
  
  .pwa-install-content {
    padding: 12px;
  }
  
  .pwa-install-icon {
    width: 40px;
    height: 40px;
    margin-left: 8px;
  }
  
  .pwa-install-icon svg {
    width: 20px;
    height: 20px;
  }
  
  .pwa-install-text h3 {
    font-size: 15px;
  }
  
  .pwa-install-text p {
    font-size: 13px;
  }
  
  .pwa-install-actions {
    flex-direction: column;
    gap: 6px;
    margin-right: 8px;
  }
  
  .pwa-install-btn {
    padding: 6px 12px;
    font-size: 13px;
  }
}
</style>
