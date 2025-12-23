/* eslint-disable no-console */

// Service Worker Registration Manager
class ServiceWorkerManager {
  constructor() {
    this.registration = null;
    this.updateAvailable = false;
    this.offlineMode = false;
    this.retryCount = 0;
    this.maxRetries = 3;
    
    // Bind methods
    this.register = this.register.bind(this);
    this.unregister = this.unregister.bind(this);
    this.checkForUpdates = this.checkForUpdates.bind(this);
    this.showUpdateNotification = this.showUpdateNotification.bind(this);
    this.handleNetworkChange = this.handleNetworkChange.bind(this);
    
    // Listen for network changes
    window.addEventListener('online', this.handleNetworkChange);
    window.addEventListener('offline', this.handleNetworkChange);
  }

  // Check if service workers are supported
  isSupported() {
    return 'serviceWorker' in navigator;
  }

  // Handle network status changes
  handleNetworkChange() {
    const wasOffline = this.offlineMode;
    this.offlineMode = !navigator.onLine;
    
    if (wasOffline !== this.offlineMode) {
      console.log(`📶 Network status changed: ${navigator.onLine ? 'Online' : 'Offline'}`);
      
      // Dispatch custom event for Vue components
      window.dispatchEvent(new CustomEvent('network-status-change', {
        detail: { online: navigator.onLine }
      }));
    }
  }

  // Unregister all service workers
  async unregisterAll() {
    if (!this.isSupported()) return true;
    
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log('🧹 Unregistered service worker:', registration.scope);
      }
      this.registration = null;
      return true;
    } catch (error) {
      console.error('❌ Failed to unregister service workers:', error);
      return false;
    }
  }

  // Register service worker with retry logic
  async register() {
    if (!this.isSupported()) {
      console.log('ℹ️ Service Workers not supported by this browser');
      return null;
    }

    // Don't register in development mode
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔧 Development mode: Service Worker registration skipped');
      return null;
    }

    try {
      console.log('🚀 Starting Service Worker registration...');

      // Register the service worker
      this.registration = await this.registerWithRetry();
      
      if (this.registration) {
        console.log('✅ Service Worker registered successfully:', this.registration.scope);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Start periodic update checks
        this.startUpdateChecks();
        
        // Send initialization message
        this.sendInitMessage();
      }
      
      return this.registration;
    } catch (error) {
      console.error('❌ Service Worker registration failed after all attempts:', error);
      return null;
    }
  }

  // Register with retry logic
  async registerWithRetry() {
    const swPaths = [
      '/service-worker.js',
      `${process.env.BASE_URL || '/'}service-worker.js`,
      './service-worker.js'
    ];
    
    for (const swUrl of swPaths) {
      try {
        console.log(`🔄 Attempt ${this.retryCount + 1}: Registering from ${swUrl}`);
        
        const registration = await navigator.serviceWorker.register(swUrl, {
          scope: '/',
          updateViaCache: 'none'
        });
        
        this.retryCount = 0; // Reset retry count on success
        return registration;
      } catch (error) {
        console.warn(`❌ Attempt ${this.retryCount + 1} failed:`, error.message);
        this.retryCount++;
        
        if (this.retryCount >= this.maxRetries) {
          throw error; // Max retries reached
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount));
      }
    }
    
    throw new Error('All registration paths failed');
  }

  // Set up event listeners for the registered service worker
  setupEventListeners() {
    if (!this.registration) return;

    // Listen for updates
    this.registration.addEventListener('updatefound', () => {
      const newWorker = this.registration.installing;
      if (!newWorker) return;

      console.log('🔄 New service worker found, installing...');

      newWorker.addEventListener('statechange', () => {
        console.log(`Service Worker state: ${newWorker.state}`);
        
        switch (newWorker.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
              // New update available
              console.log('🔄 New version available!');
              this.updateAvailable = true;
              this.showUpdateNotification(newWorker);
            } else {
              // First install
              console.log('📦 App ready for offline use');
            }
            break;

          case 'activated':
            console.log('✅ Service Worker activated');
            if (this.updateAvailable) {
              // Reload if update was applied
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
            break;
        }
      });
    });

    // Listen for controller changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 Service Worker controller changed');
      this.updateAvailable = false;
      
      // Update UI if needed
      window.dispatchEvent(new CustomEvent('service-worker-updated'));
    });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      this.handleServiceWorkerMessage(event);
    });
  }

  // Handle messages from service worker
  handleServiceWorkerMessage(event) {
    if (!event.data) return;
    
    console.log('📨 Message from Service Worker:', event.data);
    
    switch (event.data.type) {
      case 'CACHE_UPDATED':
        console.log('🔄 Cache updated');
        break;
        
      case 'OFFLINE_MODE':
        this.offlineMode = true;
        console.log('📶 Offline mode activated');
        break;
        
      case 'SKIP_WAITING':
        console.log('🔄 Service Worker requested skip waiting');
        this.applyUpdate();
        break;
        
      case 'INIT_RESPONSE':
        console.log('✅ Service Worker initialized:', event.data);
        break;
        
      default:
        console.log('📨 Received message:', event.data.type);
    }
  }

  // Send initialization message to service worker
  sendInitMessage() {
    if (this.registration && this.registration.active) {
      this.registration.active.postMessage({
        type: 'INIT',
        data: {
          timestamp: Date.now(),
          appVersion: process.env.VUE_APP_VERSION || '1.0.0',
          baseUrl: process.env.BASE_URL || '/'
        }
      });
    }
  }

  // Apply update and reload
  applyUpdate() {
    if (!this.registration || !this.registration.waiting) {
      console.log('⚠️ No waiting service worker found');
      return;
    }

    console.log('🔄 Applying update...');
    
    // Send skip waiting message
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    
    // Set up controller change listener for reload
    const controllerChangeListener = () => {
      console.log('🔄 New Service Worker activated, reloading...');
      window.location.reload();
    };
    
    // Add one-time listener
    navigator.serviceWorker.addEventListener('controllerchange', controllerChangeListener, { once: true });
    
    // Remove listener after 10 seconds if not triggered
    setTimeout(() => {
      navigator.serviceWorker.removeEventListener('controllerchange', controllerChangeListener);
    }, 10000);
  }

  // Show update notification to user
  showUpdateNotification(worker) {
    // Wait 3 seconds before showing to avoid interrupting initial load
    setTimeout(() => {
      // Check if user is active on the page
      if (document.hidden) return;
      
      this.createUpdateNotification(worker);
    }, 3000);
  }

  // Create update notification UI
  createUpdateNotification(worker) {
    // Remove existing notification if any
    const existingNotification = document.getElementById('sw-update-notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'sw-update-notification';
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      font-family: 'Tajawal', sans-serif;
      max-width: 400px;
      margin: 0 auto;
      animation: slideUp 0.4s ease-out;
      direction: rtl;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <div style="font-size: 28px; flex-shrink: 0;">🔄</div>
        <div style="flex: 1;">
          <div style="font-weight: bold; margin-bottom: 6px; font-size: 16px;">تحديث جديد متاح</div>
          <div style="font-size: 14px; opacity: 0.9; line-height: 1.4;">يوجد إصدار أحدث من التطبيق. قم بالتحديث للحصول على الميزات الجديدة.</div>
        </div>
      </div>
      <div style="display: flex; gap: 10px; margin-top: 16px;">
        <button id="sw-update-now" style="
          background: white;
          color: #3b82f6;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          flex: 1;
          font-family: 'Tajawal', sans-serif;
          font-size: 14px;
          transition: all 0.2s;
        " onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'" 
         onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none'">
          تحديث الآن
        </button>
        <button id="sw-update-later" style="
          background: rgba(255,255,255,0.15);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          flex: 1;
          font-family: 'Tajawal', sans-serif;
          font-size: 14px;
          transition: all 0.2s;
        " onmouseover="this.style.background='rgba(255,255,255,0.25)';this.style.transform='translateY(-2px)'" 
         onmouseout="this.style.background='rgba(255,255,255,0.15)';this.style.transform='translateY(0)'">
          لاحقاً
        </button>
      </div>
      <style>
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        #sw-update-notification button:active {
          transform: translateY(0) scale(0.98);
        }
      </style>
    `;
    
    document.body.appendChild(notification);
    
    // Add event listeners
    document.getElementById('sw-update-now').addEventListener('click', () => {
      this.applyUpdate();
      notification.remove();
    });
    
    document.getElementById('sw-update-later').addEventListener('click', () => {
      notification.remove();
    });
    
    // Auto-remove after 30 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.style.animation = 'slideUp 0.4s ease-out reverse';
        setTimeout(() => {
          if (document.body.contains(notification)) {
            notification.remove();
          }
        }, 400);
      }
    }, 30000);
  }

  // Check for updates
  async checkForUpdates() {
    if (!this.registration) return;
    
    try {
      await this.registration.update();
      console.log('🔍 Service Worker update check completed');
    } catch (error) {
      console.error('❌ Error checking for updates:', error);
    }
  }

  // Start periodic update checks
  startUpdateChecks() {
    // Check for updates every hour
    setInterval(() => {
      this.checkForUpdates();
    }, 60 * 60 * 1000);
    
    // Also check when page becomes visible again
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.checkForUpdates();
      }
    });
  }

  // Get current registration status
  getStatus() {
    return {
      supported: this.isSupported(),
      registered: !!this.registration,
      updateAvailable: this.updateAvailable,
      offlineMode: this.offlineMode,
      scope: this.registration ? this.registration.scope : null,
      retryCount: this.retryCount
    };
  }
}

// Create singleton instance
const serviceWorkerManager = new ServiceWorkerManager();

// Export for use in Vue app
export default serviceWorkerManager;

// Convenience functions
export const registerServiceWorker = () => serviceWorkerManager.register();
export const unregisterServiceWorker = () => serviceWorkerManager.unregisterAll();
export const checkForUpdates = () => serviceWorkerManager.checkForUpdates();
export const getServiceWorkerStatus = () => serviceWorkerManager.getStatus();
export const applyUpdate = () => serviceWorkerManager.applyUpdate();
