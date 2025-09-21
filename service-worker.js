
const CACHE_NAME = 'protegemoi-v3';
const ASSETS = [
  "/assets/css/styles.css",
  "/assets/docs/whitepaper.pdf",
  "/assets/i18n/ar.json",
  "/assets/i18n/en.json",
  "/assets/i18n/es.json",
  "/assets/i18n/fr.json",
  "/assets/i18n/zh.json",
  "/assets/icons/apple-touch-icon.png",
  "/assets/icons/favicon.ico",
  "/assets/icons/favicon.png",
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-256.png",
  "/assets/icons/icon-384.png",
  "/assets/icons/icon-512.png",
  "/assets/icons/maskable-192.png",
  "/assets/icons/maskable-512.png",
  "/assets/images/famille-1.jpg",
  "/assets/images/famille-2.png",
  "/assets/images/famille-3.jpg",
  "/assets/images/famille-4.jpg",
  "/assets/images/famille-5.png",
  "/assets/images/famille-6.png",
  "/assets/images/famille-7.png",
  "/assets/images/famille-8.png",
  "/assets/images/features-sheet.png",
  "/assets/images/fonctionnalites-affiche.png",
  "/assets/images/fonctionnalites-cles.png",
  "/assets/images/hero1.jpg",
  "/assets/images/home-1.png",
  "/assets/images/home-2.png",
  "/assets/images/home-3.png",
  "/assets/images/home-4.png",
  "/assets/images/home-5.jpg",
  "/assets/images/logo-officiel.png",
  "/assets/js/i18n.js",
  "/assets/js/script.js",
  "/avis.html",
  "/contact.html",
  "/famille.html",
  "/features.html",
  "/fonctionnalites.html",
  "/index.html",
  "/manifest.webmanifest",
  "/pricing.html",
  "/service-worker.js"
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
});
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const isHTML = req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html');
  if (isHTML) {
    event.respondWith(
      fetch(req).then(res=>{ caches.open(CACHE_NAME).then(c=>c.put(req, res.clone())); return res; })
      .catch(()=> caches.match(req))
    );
  } else {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res=>{ caches.open(CACHE_NAME).then(c=>c.put(req, res.clone())); return res; }))
    );
  }
});
