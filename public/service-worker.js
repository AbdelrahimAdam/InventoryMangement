// public/service-worker.js
const CACHE_NAME = 'inventory-management-v2';
const APP_SHELL_CACHE = 'app-shell-v1';

// Core app shell files - only cache what definitely exists
const appShellFiles = [
  '/',
  '/index.html'
];

// Install event - cache only essential files
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache app shell
      caches.open(APP_SHELL_CACHE)
        .then(cache => {
          console.log('Service Worker: Caching app shell');
          // Cache each file individually with error handling
          return Promise.allSettled(
            appShellFiles.map(url => 
              fetch(url)
                .then(response => {
                  if (response.ok) {
                    return cache.put(url, response);
                  }
                  throw new Error(`Failed to fetch ${url}: ${response.status}`);
                })
                .catch(error => {
                  console.warn('Service Worker: Failed to cache', url, error);
                  return null;
                })
            )
          );
        }),
      // Ensure we activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          // Delete old caches
          if (cache !== CACHE_NAME && cache !== APP_SHELL_CACHE) {
            console.log('Service Worker: Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
    .then(() => {
      console.log('Service Worker: Claiming clients');
      return self.clients.claim();
    })
    .catch(error => {
      console.error('Service Worker: Activation failed:', error);
    })
  );
});

// Fetch event - serve from cache or network with smart caching
self.addEventListener('fetch', event => {
  // Skip non-GET requests and cross-origin requests
  if (event.request.method !== 'GET' || 
      !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // For API calls, use network-first strategy
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('firestore.googleapis.com') ||
      event.request.url.includes('firebaseio.com')) {
    // Network-first for API calls
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If network fails, try to get from cache
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // For static assets, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Update cache in background
          fetchAndCache(event.request);
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetchAndCache(event.request);
      })
      .catch(() => {
        // For navigation requests, return app shell
        if (event.request.mode === 'navigate') {
          return caches.match('/')
            .then(response => response || new Response('You are offline', {
              headers: { 'Content-Type': 'text/html' }
            }));
        }
        
        return new Response('Network error', { status: 408 });
      })
  );
});

// Helper function to fetch and cache
function fetchAndCache(request) {
  return fetch(request)
    .then(response => {
      // Check if valid response
      if (!response || response.status !== 200 || response.type === 'opaque') {
        return response;
      }
      
      // Clone the response
      const responseToCache = response.clone();
      
      // Open cache and store response
      caches.open(CACHE_NAME)
        .then(cache => {
          cache.put(request, responseToCache);
        })
        .catch(error => {
          console.warn('Service Worker: Failed to cache response:', error);
        });
      
      return response;
    })
    .catch(error => {
      console.error('Service Worker: Fetch failed:', error);
      throw error;
    });
}

// Handle messages from client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for failed requests
self.addEventListener('sync', event => {
  if (event.tag === 'sync-inventory') {
    console.log('Service Worker: Background sync triggered');
    // You can implement background sync logic here
  }
});
