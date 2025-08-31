self.addEventListener('install', e=>{self.skipWaiting()});
self.addEventListener('activate', e=>{clients.claim()});
// basic offline fallback
self.addEventListener('fetch', event=>{
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).catch(()=>caches.match('/offline.html')));
  }
});
