// Placeholder FCM SW — replace with your messaging handling if needed.
self.addEventListener('install', ()=>self.skipWaiting());
self.addEventListener('activate', ()=>self.clients.claim());
self.addEventListener('push', (event)=>{
  const data = event.data ? event.data.json() : { title:'ProtègeMoi', body:'Notification' };
  event.waitUntil(self.registration.showNotification(data.title||'ProtègeMoi', { body: data.body||'', icon: '/favicon-64.png' }));
});
self.addEventListener('notificationclick', (e)=>{ e.notification.close(); e.waitUntil(clients.openWindow('/index.html')); });
self.addEventListener('message', (e)=>{ if(e.data && e.data.type==='SKIP_WAITING'){ self.skipWaiting(); } });
