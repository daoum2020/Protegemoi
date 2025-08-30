// ProtègeMoi Service Worker - offline cache
const CACHE_NAME = 'protege-moi-cache-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './settings.html',
  './stats.html',
  './logo.png',
  './favicon-32.png',
  './favicon-48.png',
  './favicon-64.png',
  './favicon-180.png',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(
      names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
    ))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((resp) => resp || fetch(event.request))
  );
});
