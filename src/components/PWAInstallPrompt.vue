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
      pwaCheckInterval: null,
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
    
    // Start PWA criteria checking
    this.startPWAChecking()
    
    // Check if we should show prompt based on criteria
    setTimeout(() => {
      this.checkAndShowPrompt()
    }, 3000)
    
    // Track user engagement
    this.startEngagementTracking()
  },
  beforeUnmount() {
    window.removeEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt)
    window.removeEventListener('appinstalled', this.handleAppInstalled)
    if (this.pwaCheckInterval) {
      clearInterval(this.pwaCheckInterval)
    }
    this.stopEngagementTracking()
  },
  methods: {
    handleBeforeInstallPrompt(e) {
      console.log('✅ beforeinstallprompt event fired', e)
      
      // Prevent Chrome from automatically showing the prompt
      e.preventDefault()
      
      // Stash the event so it can be triggered later
      this.deferredPrompt = e
      
      // Show the install prompt if not dismissed
      if (!this.dismissed) {
        this.showInstallPrompt = true
        console.log('📱 Showing install prompt from browser event')
        
        // Show notification
        this.showNotification('يمكنك تثبيت التطبيق على جهازك')
      }
    },
    
    handleAppInstalled() {
      console.log('🎉 App was installed successfully')
      this.dismissed = true
      this.showInstallPrompt = false
      this.deferredPrompt = null
      
      // Show success notification
      this.showNotification('تم تثبيت التطبيق بنجاح!', 'success')
    },
    
    async installApp() {
      if (!this.deferredPrompt) {
        console.log('❌ No deferred prompt available')
        
        // Show manual installation instructions
        this.showManualInstallInstructions()
        return
      }
      
      console.log('📱 Showing install prompt to user')
      
      // Show the install prompt
      this.deferredPrompt.prompt()
      
      // Wait for the user to respond to the prompt
      const choiceResult = await this.deferredPrompt.userChoice
      
      console.log(`User choice: ${choiceResult.outcome}`)
      
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ User accepted the install prompt')
        this.showNotification('جاري تثبيت التطبيق...', 'success')
      } else {
        console.log('❌ User dismissed the install prompt')
        this.showNotification('تم إلغاء التثبيت', 'warning')
      }
      
      // Clear the deferredPrompt variable
      this.deferredPrompt = null
      this.showInstallPrompt = false
      
      // Mark as dismissed for 24 hours
      this.dismissPrompt()
    },
    
    dismissPrompt() {
      this.showInstallPrompt = false
      this.dismissed = true
      
      // Store dismissal time
      localStorage.setItem('pwaPromptDismissed', Date.now().toString())
    },
    
    checkIfInstalled() {
      // Check multiple ways app might be installed
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isFullscreen = document.fullscreenElement
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
      const isIOSStandalone = isIOS && window.navigator.standalone
      
      if (this.debugMode) {
        console.log('📱 Install check:', {
          isStandalone,
          isFullscreen,
          isIOS,
          isIOSStandalone
        })
      }
      
      if (isStandalone || isFullscreen || isIOSStandalone) {
        console.log('📱 App appears to be already installed')
        this.dismissed = true
        this.showInstallPrompt = false
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
          if (this.debugMode) {
            console.log(`📱 Prompt dismissed ${hoursSinceDismiss.toFixed(1)} hours ago`)
          }
        } else {
          // Clear old dismissal
          localStorage.removeItem('pwaPromptDismissed')
          this.dismissed = false
        }
      }
    },
    
    startPWAChecking() {
      // Debug: Check PWA criteria periodically in dev mode
      if (this.debugMode) {
        this.pwaCheckInterval = setInterval(() => {
          this.debugPWACriteria()
        }, 10000)
      }
    },
    
    debugPWACriteria() {
      const criteria = {
        https: window.location.protocol === 'https:',
        serviceWorker: 'serviceWorker' in navigator,
        serviceWorkerRegistered: !!navigator.serviceWorker.controller,
        manifest: document.querySelector('link[rel="manifest"]') !== null,
        icons: document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').length > 0,
        themeColor: document.querySelector('meta[name="theme-color"]') !== null,
        viewport: document.querySelector('meta[name="viewport"]') !== null
      }
      
      console.log('📱 PWA Criteria Check:', criteria)
      
      const allMet = Object.values(criteria).every(v => v)
      console.log(allMet ? '✅ All PWA requirements met!' : '❌ Some requirements missing')
      
      return criteria
    },
    
    checkAndShowPrompt() {
      // Check if basic PWA criteria are met
      const criteria = {
        https: window.location.protocol === 'https:',
        serviceWorkerRegistered: !!navigator.serviceWorker.controller,
        manifest: document.querySelector('link[rel="manifest"]') !== null
      }
      
      const basicCriteriaMet = criteria.https && 
                               criteria.serviceWorkerRegistered && 
                               criteria.manifest
      
      if (basicCriteriaMet && !this.dismissed && !this.showInstallPrompt) {
        console.log('📱 Basic PWA criteria met, showing install prompt')
        this.showInstallPrompt = true
        
        // Show notification
        this.showNotification('يمكنك تثبيت التطبيق للحصول على تجربة أفضل')
      }
    },
    
    showManualInstallInstructions() {
      // Create a modal with manual install instructions
      const instructions = `
        <div style="padding: 20px; text-align: right; direction: rtl;">
          <h3 style="color: #3b82f6; margin-bottom: 15px;">كيفية تثبيت التطبيق:</h3>
          
          <div style="margin-bottom: 15px;">
            <strong>📱 على الهاتف (Android/Chrome):</strong>
            <ol style="margin-right: 20px;">
              <li>اضغط على قائمة النقاط الثلاث ⋮</li>
              <li>اختر "تثبيت التطبيق" أو "Add to Home Screen"</li>
            </ol>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>🍎 على iPhone/iPad (Safari):</strong>
            <ol style="margin-right: 20px;">
              <li>اضغط على أيقونة المشاركة 📤</li>
              <li>مرر لأسفل واختر "أضف إلى الشاشة الرئيسية"</li>
              <li>اضغط على "إضافة"</li>
            </ol>
          </div>
          
          <div>
            <strong>💻 على الكمبيوتر (Chrome/Edge):</strong>
            <ol style="margin-right: 20px;">
              <li>اضغط على أيقونة التثبيت في شريط العنوان 📥</li>
              <li>أو اضغط على ⋮ → "تثبيت [اسم التطبيق]"</li>
            </ol>
          </div>
        </div>
      `
      
      // Show notification that opens instructions
      if (this.$store && this.$store.dispatch) {
        this.$store.dispatch('showNotification', {
          type: 'info',
          message: 'انقر هنا لمعرفة كيفية تثبيت التطبيق',
          duration: 10000,
          action: () => this.openInstructionsModal(instructions)
        })
      } else {
        // Fallback: directly open modal
        this.openInstructionsModal(instructions)
      }
    },
    
    openInstructionsModal(instructions) {
      const modal = document.createElement('div')
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      `
      modal.innerHTML = `
        <div style="background: white; border-radius: 12px; padding: 0; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;">
          <div style="padding: 20px; border-bottom: 1px solid #e5e7eb;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h3 style="margin: 0; color: #1f2937;">تعليمات التثبيت</h3>
              <button id="close-instructions" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
            </div>
          </div>
          <div>${instructions}</div>
          <div style="padding: 20px; border-top: 1px solid #e5e7eb; text-align: left;">
            <button id="close-btn" style="background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">إغلاق</button>
          </div>
        </div>
      `
      
      document.body.appendChild(modal)
      
      const closeModal = () => {
        document.body.removeChild(modal)
      }
      
      modal.querySelector('#close-instructions').addEventListener('click', closeModal)
      modal.querySelector('#close-btn').addEventListener('click', closeModal)
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal()
      })
    },
    
    showNotification(message, type = 'info') {
      if (this.$store && this.$store.dispatch) {
        this.$store.dispatch('showNotification', {
          type,
          message,
          duration: 5000
        })
      } else {
        console.log('📱 Notification:', message)
      }
    },
    
    startEngagementTracking() {
      // Track engagement for PWA criteria
      if (!localStorage.getItem('pwaEngagementStart')) {
        localStorage.setItem('pwaEngagementStart', Date.now().toString())
      }
      
      // Update engagement time periodically
      this.engagementInterval = setInterval(() => {
        const startTime = parseInt(localStorage.getItem('pwaEngagementStart') || '0')
        const engagementTime = Date.now() - startTime
        localStorage.setItem('pwaEngagementTime', engagementTime.toString())
        
        // Log engagement in debug mode
        if (this.debugMode && engagementTime % 30000 < 1000) {
          console.log(`📱 User engagement: ${Math.round(engagementTime / 1000)} seconds`)
        }
      }, 5000)
    },
    
    stopEngagementTracking() {
      if (this.engagementInterval) {
        clearInterval(this.engagementInterval)
      }
    },
    
    // Browser console test function
    testPWA() {
      const testResults = {
        // Basic checks
        isHTTPS: window.location.protocol === 'https:',
        hasServiceWorker: 'serviceWorker' in navigator,
        serviceWorkerController: !!navigator.serviceWorker.controller,
        
        // Manifest checks
        hasManifestLink: !!document.querySelector('link[rel="manifest"]'),
        manifestIcons: 0,
        manifestValid: false,
        
        // Meta tags
        hasThemeColor: !!document.querySelector('meta[name="theme-color"]'),
        hasViewport: !!document.querySelector('meta[name="viewport"]'),
        hasAppleMeta: !!document.querySelector('meta[name="apple-mobile-web-app-capable"]'),
        
        // Icons
        hasIcons: document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').length > 0,
        
        // User engagement
        engagementTime: parseInt(localStorage.getItem('pwaEngagementTime') || '0'),
        hasSufficientEngagement: false
      }
      
      // Check manifest details
      const manifestLink = document.querySelector('link[rel="manifest"]')
      if (manifestLink) {
        fetch(manifestLink.href)
          .then(res => res.json())
          .then(manifest => {
            testResults.manifestIcons = manifest.icons?.length || 0
            testResults.manifestValid = !!manifest.name && !!manifest.short_name && !!manifest.start_url
            testResults.manifestDisplay = manifest.display || 'browser'
            
            console.log('📱 PWA Test Results:', testResults)
            console.log('📱 Manifest:', {
              name: manifest.name,
              short_name: manifest.short_name,
              display: manifest.display,
              start_url: manifest.start_url,
              icons: manifest.icons?.length
            })
            
            // Check if meets criteria
            const meetsCriteria = testResults.isHTTPS &&
                                 testResults.serviceWorkerController &&
                                 testResults.manifestValid &&
                                 testResults.manifestIcons > 0 &&
                                 testResults.hasThemeColor
            
            console.log(meetsCriteria ? '✅ Meets PWA criteria!' : '❌ Does not meet all criteria')
          })
          .catch(err => {
            console.error('📱 Manifest fetch error:', err)
            console.log('📱 PWA Test Results:', testResults)
          })
      } else {
        console.log('📱 PWA Test Results:', testResults)
      }
      
      return testResults
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

/* Animation for attention */
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

.pwa-install-content {
  animation: pulse-glow 2s infinite;
}
</style>
