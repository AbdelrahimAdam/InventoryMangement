import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './styles/globals.css';

// Register service worker for PWA
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.log('✅ Service Worker registered:', registration);
        
        // Check for updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) return;
          
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('🔄 New content available; please refresh.');
                
                // Dispatch event for App.vue to handle
                window.dispatchEvent(new CustomEvent('sw-updated', {
                  detail: { registration }
                }));
              }
            }
          };
        };
      })
      .catch(error => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}

// Global PWA install prompt handler
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('🔔 PWA install prompt available');
  e.preventDefault();
  deferredPrompt = e;
  
  // Dispatch event for App.vue to handle
  window.dispatchEvent(new CustomEvent('pwa-install-available', {
    detail: { deferredPrompt: e }
  }));
});

window.addEventListener('appinstalled', () => {
  console.log('✅ PWA installed successfully');
  deferredPrompt = null;
  
  // Dispatch event for App.vue to handle
  window.dispatchEvent(new CustomEvent('pwa-installed'));
});

// Make install function globally available
window.installPWA = () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    
    deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ User accepted PWA install');
      } else {
        console.log('❌ User dismissed PWA install');
      }
      deferredPrompt = null;
    });
  }
};

// Create and mount the app
console.log('🚀 Starting Vue application...');

const app = createApp(App);

app.use(store);
app.use(router);

app.mount('#app');

console.log('✅ Vue app mounted successfully');