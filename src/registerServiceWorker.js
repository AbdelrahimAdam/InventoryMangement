/* eslint-disable no-console */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = `${process.env.BASE_URL}service-worker.js`;
    
    navigator.serviceWorker
      .register(swUrl)
      .then(registration => {
        console.log('✅ Service Worker registered:', registration);
        
        // Check for updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) {
            return;
          }
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New content available
                console.log('New content available; please refresh.');
                
                // Show update notification
                showUpdateNotification();
              } else {
                // Content is cached for offline use
                console.log('Content is cached for offline use.');
              }
            }
          };
        };
      })
      .catch(error => {
        console.error('❌ Error during service worker registration:', error);
      });
  });
}

function showUpdateNotification() {
  // You can show a custom notification here
  if (confirm('تم تحديث التطبيق. هل تريد إعادة تحميل الصفحة؟')) {
    window.location.reload();
  }
}

// Handle messages from service worker
navigator.serviceWorker.addEventListener('message', event => {
  console.log('Message from Service Worker:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    window.location.reload();
  }
});