const CACHE_NAME = 'quran-app-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/icons/quran-icon.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // 1. Never intercept audio streaming requests (MP3s, CDNs)
  if (url.includes('.mp3') || url.includes('cdn.islamic.network') || url.includes('mp3quran.net')) {
    return;
  }

  // 2. In development mode (Vite client, src modules, hot reloads), bypass service worker completely
  if (
    url.includes('/@vite/') || 
    url.includes('/src/') || 
    url.includes('?t=') || 
    url.includes('/@react-refresh')
  ) {
    return;
  }

  // 3. For navigation requests (loading index.html), use NETWORK FIRST, falling back to cache if offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return networkResponse;
        })
        .catch(() => {
          return caches.match('/index.html');
        })
    );
    return;
  }

  // 4. For static production assets (/assets/), cache with network fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (
          event.request.method === 'GET' &&
          (url.includes('/assets/') || url.includes('fonts.googleapis.com'))
        ) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      });
    })
  );
});
