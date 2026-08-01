// DJ Except4 — Service Worker (PWA)
// Version: 1.0.0

const CACHE_NAME = 'dj-except4-v1';
const PRECACHE_URLS = [
  '/',
  '/de/',
  '/en/',
  '/de/tracks/',
  '/en/tracks/',
  '/de/bio/',
  '/en/bio/',
  '/de/contact/',
  '/en/contact/',
  '/de/impressum/',
  '/en/impressum/',
  '/de/datenschutz/',
  '/en/datenschutz/',
  '/manifest.json',
  '/assets/DJ_Except4-Logo.png',
  '/assets/DJ_Except4-Schriftzug.png',
  '/assets/DJ_Except4_Wallpaper.png',
];

// Install — precache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch — cache-first strategy for static assets, network-first for HTML
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // For static assets: cache-first
  if (request.destination === 'image' ||
      request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'font') {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetched = fetch(request).then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
        return cached || fetched;
      })
    );
    return;
  }

  // For HTML pages: network-first
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request);
      })
    );
    return;
  }

  // Default: network-first
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});