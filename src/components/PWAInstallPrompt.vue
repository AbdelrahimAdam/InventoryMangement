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
      dismissed: false
    }
  },
  mounted() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt)
    
    // Check if already installed
    window.addEventListener('appinstalled', this.handleAppInstalled)
    
    // Check if should show prompt (not dismissed recently)
    const dismissedTime = localStorage.getItem('pwaPromptDismissed')
    if (dismissedTime) {
      const hoursSinceDismiss = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60)
      if (hoursSinceDismiss < 24) {
        this.dismissed = true
      }
    }
    
    // Check if running in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('Running in standalone mode')
      this.dismissed = true
    }
  },
  beforeUnmount() {
    window.removeEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt)
    window.removeEventListener('appinstalled', this.handleAppInstalled)
  },
  methods: {
    handleBeforeInstallPrompt(e) {
      console.log('beforeinstallprompt event fired')
      
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      
      // Stash the event so it can be triggered later
      this.deferredPrompt = e
      
      // Show the install prompt if not dismissed
      if (!this.dismissed) {
        this.showInstallPrompt = true
      }
    },
    
    handleAppInstalled() {
      console.log('App was installed successfully')
      this.dismissed = true
      this.showInstallPrompt = false
      this.deferredPrompt = null
    },
    
    async installApp() {
      if (!this.deferredPrompt) return
      
      // Show the install prompt
      this.deferredPrompt.prompt()
      
      // Wait for the user to respond to the prompt
      const choiceResult = await this.deferredPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
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
</style>