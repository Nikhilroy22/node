const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/login',
  '/css/style.css',
  '/js/script.js',
  '/js/SportBet.js',
  '/js/eruda.js',
  '/logo.png'
];

// Install event: ফাইলগুলো ক্যাশে রাখবে
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event: পুরোনো ক্যাশ ক্লিয়ার করা
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

// Fetch event: নেটওয়ার্কে গেলে ক্যাশ থেকে serve করবে, না গেলে নেটওয়ার্কে যাবে
self.addEventListener('fetch', event => {
  console.log('[ServiceWorker] Fetch', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});