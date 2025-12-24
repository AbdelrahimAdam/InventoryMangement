// src/registerServiceWorker.js
/* eslint-disable no-console */

export function registerServiceWorker() {
  // Only register in production and if supported
  if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    // Use correct path for service worker
    const swUrl = `${process.env.BASE_URL || '/'}service-worker.js`;
    
    // Clear any existing registrations first
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (const registration of registrations) {
        registration.unregister();
      }
    }).then(() => {
      // Register new service worker
      return navigator.serviceWorker.register(swUrl);
    }).then(registration => {
      console.log('✅ Service Worker registered successfully:', registration);
      
      // Handle updates
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;
        
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New update available
              console.log('🔄 New content available');
              
              // Notify user
              if (window.confirm('تم تحديث التطبيق. هل تريد إعادة تحميل الصفحة للحصول على أحدث نسخة؟')) {
                window.location.reload();
              }
            } else {
              // First time install
              console.log('✅ Content is cached for offline use');
            }
          }
        };
      };
      
      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // Check every hour
      
    }).catch(error => {
      console.warn('⚠️ Service Worker registration failed:', error.message);
      // Don't show error if file doesn't exist (404)
      if (!error.message.includes('404') && !error.message.includes('Failed to fetch')) {
        console.error('Service Worker registration error details:', error);
      }
    });
  });
  
  // Handle controller changes
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('🔄 Service Worker controller changed');
  });
}

// Unregister old service workers
export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    }).catch(error => {
      console.error('Error unregistering service worker:', error);
    });
  }
}
