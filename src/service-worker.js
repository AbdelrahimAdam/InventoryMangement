// Service Worker for Warehouse Management System
const CACHE_NAME = 'warehouse-management-v2';
const STATIC_CACHE = 'static-cache-v2';
const DYNAMIC_CACHE = 'dynamic-cache-v2';

// Static assets to cache immediately
const staticAssets = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('✅ Service Worker: Caching static assets');
        return cache.addAll(staticAssets);
      })
      .then(() => {
        console.log('✅ Service Worker: Install completed');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Cache addAll failed:', error);
        // Continue installation even if caching fails
        return self.skipWaiting();
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          // Delete old caches
          if (![STATIC_CACHE, DYNAMIC_CACHE].includes(cache)) {
            console.log(`🗑️ Service Worker: Deleting old cache: ${cache}`);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activation completed');
      return self.clients.claim();
    })
  );
});

// Fetch event - Enhanced strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension requests
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  // Handle different types of requests
  const url = new URL(event.request.url);
  
  // API requests - Network First with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(event));
    return;
  }
  
  // Static assets - Cache First
  if (url.pathname.match(/\.(js|css|woff2?|ttf|eot|svg)$/)) {
    event.respondWith(cacheFirstStrategy(event));
    return;
  }
  
  // Images - Cache First with network update
  if (url.pathname.match(/\.(png|jpg|jpeg|gif|webp|ico)$/)) {
    event.respondWith(cacheFirstStrategy(event));
    return;
  }
  
  // HTML pages - Network First
  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirstStrategy(event));
    return;
  }
  
  // Default: Network First
  event.respondWith(networkFirstStrategy(event));
});

// Network First Strategy
async function networkFirstStrategy(event) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    // Try network first
    const networkResponse = await fetch(event.request);
    
    // Cache the response if successful
    if (networkResponse.status === 200) {
      const clone = networkResponse.clone();
      cache.put(event.request, clone);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🌐 Network failed, trying cache:', error.message);
    
    // Try cache
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // For navigation requests, serve offline page
    if (event.request.mode === 'navigate') {
      return caches.match('/')
        .then((response) => {
          return response || getOfflinePage();
        });
    }
    
    // Return offline response
    return new Response('عذراً، أنت غير متصل بالإنترنت', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

// Cache First Strategy
async function cacheFirstStrategy(event) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(event.request);
  
  if (cachedResponse) {
    // Update cache in background
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse.status === 200) {
          cache.put(event.request, networkResponse);
        }
      })
      .catch(() => {
        // Ignore fetch errors for background updates
      });
    
    return cachedResponse;
  }
  
  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(event.request);
    
    if (networkResponse.status === 200) {
      cache.put(event.request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return new Response('Network error', { status: 503 });
  }
}

// Generate offline page
function getOfflinePage() {
  const offlineHtml = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>غير متصل - نظام إدارة المخازن</title>
      <style>
        body {
          font-family: 'Tajawal', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          margin: 0;
          padding: 0;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
        }
        .container {
          max-width: 500px;
        }
        h1 {
          font-size: 2.5em;
          margin-bottom: 20px;
        }
        p {
          font-size: 1.2em;
          opacity: 0.9;
          margin-bottom: 30px;
          line-height: 1.6;
        }
        .icon {
          font-size: 4em;
          margin-bottom: 20px;
        }
        button {
          background: white;
          color: #667eea;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 1.1em;
          cursor: pointer;
          font-family: 'Tajawal', sans-serif;
          margin: 10px;
          transition: transform 0.2s;
        }
        button:hover {
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">📶</div>
        <h1>غير متصل بالإنترنت</h1>
        <p>تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.</p>
        <button onclick="window.location.reload()">إعادة المحاولة</button>
      </div>
    </body>
    </html>
  `;
  
  return new Response(offlineHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    }
  });
}

// Handle messages from the app
self.addEventListener('message', (event) => {
  console.log('📨 Service Worker: Received message:', event.data);
  
  if (!event.data) return;
  
  switch (event.data.type) {
    case 'SKIP_WAITING':
      console.log('🔄 Service Worker: Skipping waiting phase');
      self.skipWaiting();
      break;
      
    case 'INIT':
      console.log('✅ Service Worker: Initialized with', event.data.data);
      
      // Send response back
      event.source.postMessage({
        type: 'INIT_RESPONSE',
        data: {
          status: 'active',
          cacheName: CACHE_NAME,
          timestamp: Date.now(),
          version: '2.0.0'
        }
      });
      break;
      
    case 'CLEAR_CACHE':
      console.log('🧹 Service Worker: Clearing cache as requested');
      caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
      }).then(() => {
        event.source.postMessage({
          type: 'CACHE_CLEARED',
          data: { success: true }
        });
      });
      break;
  }
});

// Handle push notifications (if needed in future)
self.addEventListener('push', (event) => {
  console.log('🔔 Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'تحديث جديد في النظام',
    icon: '/img/icons/icon-192x192.png',
    badge: '/img/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 'warehouse-update'
    },
    actions: [
      {
        action: 'open',
        title: 'فتح التطبيق'
      },
      {
        action: 'close',
        title: 'إغلاق'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('نظام إدارة المخازن', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('✅ Service Worker: Script loaded successfully');
