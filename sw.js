const CACHE_NAME='protegemoi-v1.0.5';
const ASSETS=[
  'index.html','payment.html','guide-gratuit.html','styles-improved.css','i18n-improved.js','manifest.json',
  'icons/icon-192x192.png','icons/icon-512x512.png','icons/favicon-32x32.png','icons/favicon-16x16.png',
  'logo-officiel.png',
  'assets/img/hero-boy.jpg','assets/img/apps-control.png','assets/img/alerts-mom.jpg',
  'assets/img/reports-chart.jpg','assets/img/family-dad-daughter.jpg','assets/img/gps-dad.jpg'
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):null))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const copy=res.clone(); caches.open(CACHE_NAME).then(c=>c.put(e.request,copy)); return res;}).catch(()=>caches.match('index.html'))));});
