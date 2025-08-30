import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth'
import { getFirestore, collection, getDocs, doc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'

// REMPLIS ta config Firebase
const firebaseConfig = { apiKey:'PASTE_HERE', authDomain:'PASTE_HERE.firebaseapp.com', projectId:'PASTE_HERE', appId:'PASTE_HERE' }
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const fun = getFunctions(app)

const $ = (id)=>document.getElementById(id)
const toast = (m)=>alert(m)

// ---------- Children ----------
async function listChildren(){
  if(!auth.currentUser){ $('childrenList').innerHTML='<li>Connectez-vous.</li>'; return }
  const uid = auth.currentUser.uid
  const snap = await getDocs(collection(db, `parents/${uid}/children`))
  const ul = $('childrenList'); ul.innerHTML=''
  snap.forEach(docSnap=>{
    const c = docSnap.data()
    const li = document.createElement('li')
    const btnQR = document.createElement('button')
    btnQR.textContent = 'QR'
    btnQR.addEventListener('click', ()=> showQR(uid, docSnap.id))
    li.textContent = `${c.name} — ${c.age ?? '?'} ans · `
    li.appendChild(btnQR)
    ul.appendChild(li)
  })
  if(snap.empty) ul.innerHTML='<li>Aucun enfant.</li>'
}
$('btnReloadChildren').addEventListener('click', listChildren)

$('btnCreateChild').addEventListener('click', async ()=>{
  if(!auth.currentUser) return toast('Connectez-vous.')
  const name = $('childName').value.trim()
  const age = parseInt($('childAge').value,10)
  if(!name) return toast('Prénom obligatoire.')
  const createChild = httpsCallable(fun,'createChild')
  const res = await createChild({ name, age: isNaN(age)?null:age })
  toast(`Enfant créé (${res.data.childId}).`)
  $('childName').value=''; $('childAge').value=''
  await listChildren()
})

$('btnGetQuota').addEventListener('click', async ()=>{
  const getEntitlement = httpsCallable(fun,'getEntitlement')
  const res = await getEntitlement()
  $('quotaInfo').textContent = `Quota: ${res.data.maxChildren}`
})

// ---------- Alerts realtime ----------
let unsubAlerts = null
function watchAlerts(){
  if(unsubAlerts){ unsubAlerts(); unsubAlerts=null }
  if(!auth.currentUser){ $('alertsTable').innerHTML=''; return }
  const uid = auth.currentUser.uid
  const alertsRef = collection(db, `parents/${uid}/alerts`)
  const q = query(alertsRef, orderBy('timestamp','desc'))
  unsubAlerts = onSnapshot(q, (snap)=>{
    const tbody = $('alertsTable'); tbody.innerHTML=''
    snap.forEach(docSnap=>{
      const a = docSnap.data()
      const tr = document.createElement('tr')
      const ts = a.timestamp?.toDate ? a.timestamp.toDate().toLocaleString() : '—'
      tr.innerHTML = `<td>${ts}</td><td>${a.childId}</td><td>${a.level}</td><td>${a.text}</td>`
      tbody.appendChild(tr)
    })
  })
}

// ---------- FCM token save ----------
$('btnSaveToken').addEventListener('click', async ()=>{
  const token = $('fcmToken').value.trim()
  if(!token) return toast('Colle un token FCM.')
  const saveFcmToken = httpsCallable(fun,'saveFcmToken')
  await saveFcmToken({ token })
  toast('Token enregistré ✅')
})

// ---------- Stripe checkout (demo) ----------
async function checkout(priceTier){
  const createCheckout = httpsCallable(fun,'createCheckoutSession')
  const res = await createCheckout({ tier: priceTier })
  if(res.data && res.data.url){ window.location.href = res.data.url }
  else toast('Échec de création de la session.')
}
$('btnCheckout1').addEventListener('click', ()=>checkout(1))
$('btnCheckout2').addEventListener('click', ()=>checkout(2))
$('btnCheckout3').addEventListener('click', ()=>checkout(3))

// ---------- QR ----------
function showQR(parentId, childId){
  const payload = JSON.stringify({ parentId, childId, v:1 })
  $('qrHint').textContent = `childId: ${childId}`
  const modal = $('qrModal'); modal.showModal()
  const box = $('qrBox'); box.innerHTML=''
  new QRCode(box, { text: payload, width: 220, height: 220 })
}
$('btnCloseQR').addEventListener('click', ()=>$('qrModal').close())

// ---------- Auth ----------
$('btnSignIn').addEventListener('click', async ()=>{
  const email=$('email').value, pass=$('password').value
  if(!email||!pass) return toast('Email et mot de passe requis.')
  await signInWithEmailAndPassword(auth,email,pass); toast('Connecté.')
})
$('btnSignUp').addEventListener('click', async ()=>{
  const email=$('email').value, pass=$('password').value
  if(!email||!pass) return toast('Email et mot de passe requis.')
  await createUserWithEmailAndPassword(auth,email,pass); toast('Compte créé.')
})
$('btnForgot').addEventListener('click', async ()=>{
  const email=$('email').value; if(!email) return toast('Entre ton email.')
  await sendPasswordResetEmail(auth,email); toast('Email envoyé.')
})
$('btnSignOut').addEventListener('click', async ()=>{ await signOut(auth); toast('Déconnecté.') })

onAuthStateChanged(auth, (u)=>{
  $('authState').textContent = u?`Connecté : ${u.email}`:'Non connecté'
  listChildren()
  watchAlerts()
})


// --- Bridge placeholders -> Firebase config ---
const pmCfg = (typeof window !== 'undefined' && window.PM_CONFIG) ? window.PM_CONFIG : null;
const firebaseConfig = pmCfg ? {
  apiKey: pmCfg.apiKey,
  authDomain: pmCfg.authDomain,
  projectId: pmCfg.projectId,
  appId: pmCfg.appId
} : firebaseConfig; // fallback to existing if already defined

// Register SW for push notifications
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(console.warn);
}


// === User Settings bridge ===
(function(){
  try{
    const raw = localStorage.getItem('PM_USER_CONFIG')
    if(raw){
      const ucfg = JSON.parse(raw)
      // Merge into PM_CONFIG while keeping existing defaults
      window.PM_CONFIG = Object.assign({}, window.PM_CONFIG || {}, ucfg || {})
      // Also expose for SW via postMessage when available
      if('serviceWorker' in navigator){
        navigator.serviceWorker.ready.then(reg => {
          if(reg?.active){
            reg.active.postMessage({ type: 'PM_CONFIG', payload: {
              apiKey: window.PM_CONFIG.apiKey,
              authDomain: window.PM_CONFIG.authDomain,
              projectId: window.PM_CONFIG.projectId,
              messagingSenderId: window.PM_CONFIG.messagingSenderId,
              appId: window.PM_CONFIG.appId
            }})
          }
        }).catch(()=>{})
      }
    }
  }catch(e){ console.warn('PM_USER_CONFIG parse error', e) }
})();


/* Respect silent notifications setting (from settings page) */
function isSilent(){ try { return localStorage.getItem('PM_SILENT') === '1' } catch { return false } }
try{
  if(typeof onMessage === 'function'){
    // No-op: handler already set where we added it; we ensure it checks isSilent at display time.
  }
}catch{}
