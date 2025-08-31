// Firebase Auth + Messaging (FCM) — ES module
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { isSupported, getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

const cfg = window.PM_CONFIG || {};
const app = initializeApp(cfg);
const auth = getAuth(app);

let messaging;
(async()=>{ try{ if(await isSupported()){ messaging = getMessaging(app); setupMessaging(); } }catch(e){ console.warn('FCM unsupported', e); } })();

async function setupMessaging(){
  try{
    const permission = await Notification.requestPermission();
    if(permission !== 'granted'){ console.log('Notifications not granted'); return; }
    if(!cfg.vapidKey){ console.warn('Missing vapidKey in PM_CONFIG'); return; }
    const token = await getToken(messaging, { vapidKey: cfg.vapidKey });
    if(token){ localStorage.setItem('pm_fcm_token', token); console.log('FCM token', token.slice(0,12)+'…'); }
    onMessage(messaging, (payload)=>{
      console.log('Message received', payload);
      if(Notification.permission==='granted'){
        new Notification(payload?.notification?.title || 'ProtègeMoi', { body: payload?.notification?.body || '' });
      }
    });
  }catch(err){ console.error('FCM error', err); }
}

// Expose helpers for forms
window.PM_AUTH = {
  async login(email, pass){
    await signInWithEmailAndPassword(auth, email, pass);
    localStorage.setItem('pm_auth','1');
    return true;
  },
  async signup(email, pass){
    await createUserWithEmailAndPassword(auth, email, pass);
    localStorage.setItem('pm_auth','1');
    return true;
  },
  async reset(email){
    await sendPasswordResetEmail(auth, email);
    return true;
  },
  async logout(){
    await signOut(auth);
    localStorage.removeItem('pm_auth');
    return true;
  },
  onChange(cb){
    onAuthStateChanged(auth, user=>cb(!!user, user));
  }
};

// SOS: client-side placeholder
window.PM_SOS = async function PM_SOS(){
  try{
    // local immediate notification for demo
    if(Notification.permission==='granted'){ new Notification('SOS envoyé', { body:'Alerte en cours…' }); }
    // send to backend (Cloud Function) if configured
    if(cfg.sosEndpoint){
      const token = localStorage.getItem('pm_fcm_token');
      await fetch(cfg.sosEndpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type:'sos', token, ts: Date.now() }) });
    }
    alert('SOS déclenché (démo). Configurer votre endpoint serveur pour le push réel.');
  }catch(e){ alert('Erreur SOS'); console.error(e); }
};
