/* Firebase Messaging SW (PLACEHOLDERS) */
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const cfg = {
  apiKey: "PASTE_API_KEY",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};

firebase.initializeApp(cfg);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || "ProtègeMoi";
  const options = { body: payload?.notification?.body || "Nouvelle alerte", data: payload?.data || {} };
  self.registration.showNotification(title, options);
});


// Accept config via postMessage from the page
self.addEventListener('message', event => {
  if (event?.data?.type === 'PM_CONFIG') {
    self.PM_CONFIG = event.data.payload || {};
  }
});


// === PWA Offline Cache ===
const PM_PWA_VERSION = 'v2';
const PM_PWA_CACHE = `pm-cache-${PM_PWA_VERSION}`;
const PM_ASSETS = [
  './index.html', './settings.html', './stats.html', './offline.html',
  './config.js', './manifest.json',
  './logo.png', './favicon.ico',
  './favicon-32.png', './favicon-48.png', './favicon-64.png', './favicon-180.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PM_PWA_CACHE).then(cache => cache.addAll(PM_ASSETS)).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== PM_PWA_CACHE ? caches.delete(k) : Promise.resolve())))
      .then(()=> self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin GET
  if (req.method !== 'GET' || url.origin !== location.origin) return;

  // For navigation requests, try network first, then cache, then offline page
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        // Optionally update the cache
        const cache = await caches.open(PM_PWA_CACHE);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (e) {
        const cache = await caches.open(PM_PWA_CACHE);
        const cached = await cache.match(req) || await cache.match('./offline.html');
        return cached;
      }
    })());
    return;
  }

  // For assets in PM_ASSETS: cache-first
  if (isKnownAsset(url.pathname)) {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        const clone = res.clone();
        caches.open(PM_PWA_CACHE).then(c => c.put(req, clone));
        return res;
      }).catch(() => caches.match('./offline.html')))
    );
    return;
  }
});


self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});


// GitHub Pages subpath support
const PM_ASSETS_SUFFIXES = [
  '/','./index.html','./settings.html','./stats.html','./subscription.html','./offline.html',
  './config.js','./manifest.json','./logo.png','./favicon.ico',
  './favicon-32.png','./favicon-48.png','./favicon-64.png','./favicon-180.png'
];
function isKnownAsset(pathname){
  try{
    // Normalize: ensure leading slash
    const p = pathname || '/';
    // Match if endsWith any suffix (works under /user/repo/)
    return PM_ASSETS_SUFFIXES.some(sfx => p.endsWith(sfx));
  }catch{return false}
}
