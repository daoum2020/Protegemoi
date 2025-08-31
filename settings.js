const K = 'PM_USER_CONFIG';

function read(){
  try { return JSON.parse(localStorage.getItem(K) || 'null') } catch { return null }
}
function write(cfg){
  localStorage.setItem(K, JSON.stringify(cfg||{}))
}
function clearCfg(){
  localStorage.removeItem(K)
}

function fillForm(cfg){
  document.getElementById('apiKey').value = cfg?.apiKey || ''
  document.getElementById('projectId').value = cfg?.projectId || ''
  document.getElementById('authDomain').value = cfg?.authDomain || ''
  document.getElementById('appId').value = cfg?.appId || ''
  document.getElementById('messagingSenderId').value = cfg?.messagingSenderId || ''
  document.getElementById('vapidKey').value = cfg?.vapidKey || ''
  document.getElementById('hasConfig').textContent = cfg ? 'oui' : 'non'
}

function fromForm(){
  return {
    apiKey: document.getElementById('apiKey').value.trim(),
    projectId: document.getElementById('projectId').value.trim(),
    authDomain: document.getElementById('authDomain').value.trim(),
    appId: document.getElementById('appId').value.trim(),
    messagingSenderId: document.getElementById('messagingSenderId').value.trim(),
    vapidKey: document.getElementById('vapidKey').value.trim(),
  }
}

document.getElementById('saveBtn').addEventListener('click', ()=>{
  const cfg = fromForm()
  if(!cfg.apiKey || !cfg.projectId || !cfg.appId){
    document.getElementById('status').innerHTML = '<span class="danger">Champs obligatoires manquants.</span>'
    return
  }
  write(cfg)
  document.getElementById('status').innerHTML = '<span class="ok">Enregistré ✓</span>'
  document.getElementById('hasConfig').textContent = 'oui'
})

document.getElementById('clearBtn').addEventListener('click', ()=>{
  clearCfg()
  fillForm(null)
  document.getElementById('status').innerHTML = '<span class="ok">Effacé ✓</span>'
})

fillForm(read())


// --- Test notification via Cloud Function addAlert ---
async function sendTest(){
  const cfg = read()
  const parentId = document.getElementById('parentId').value.trim()
  const childId = document.getElementById('childId').value.trim()
  const text = document.getElementById('testText').value.trim() || 'Alerte de test'
  const out = document.getElementById('testStatus')
  if(!cfg || !cfg.apiKey || !cfg.projectId || !cfg.appId){
    out.innerHTML = '<span class="danger">Config Firebase manquante dans Paramètres.</span>'
    return
  }
  if(!parentId || !childId){
    out.innerHTML = '<span class="danger">parentId et childId sont requis.</span>'
    return
  }
  try{
    // ESM Firebase SDK (modular) via CDN
    const [{ initializeApp }, { getFunctions, httpsCallable }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-functions.js')
    ])
    const app = initializeApp({
      apiKey: cfg.apiKey,
      authDomain: cfg.authDomain,
      projectId: cfg.projectId,
      appId: cfg.appId
    }, 'pm-settings')
    const fun = getFunctions(app)
    const addAlert = httpsCallable(fun, 'addAlert')
    await addAlert({ parentId, childId, text })
    out.innerHTML = '<span class="ok">Alerte envoyée ✓</span>'
  }catch(e){
    console.error(e)
    out.innerHTML = '<span class="danger">Erreur: ' + (e?.message||e) + '</span>'
  }
}
document.getElementById('testBtn').addEventListener('click', sendTest)


// --- Register FCM token ---
async function registerToken(){
  const cfg = read()
  const out = document.getElementById('status')
  if(!cfg || !cfg.apiKey || !cfg.projectId || !cfg.appId || !cfg.vapidKey){
    out.innerHTML = '<span class="danger">Config Firebase/VAPID manquante.</span>'
    return
  }
  try{
    const [{ initializeApp }, { getMessaging, getToken }, { getFirestore, doc, setDoc }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js'),
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js')
    ])
    const app = initializeApp({
      apiKey: cfg.apiKey,
      authDomain: cfg.authDomain,
      projectId: cfg.projectId,
      appId: cfg.appId
    }, 'pm-settings-regtoken')
    const messaging = getMessaging(app)
    const vapidKey = cfg.vapidKey
    const token = await getToken(messaging, { vapidKey })
    if(!token){ out.innerHTML='<span class="danger">Impossible d'obtenir un token.</span>'; return }
    // Ici, on suppose que l'utilisateur parent est déjà connecté avec Firebase Auth
    const [{ getAuth }] = await Promise.all([ import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js') ])
    const auth = getAuth(app)
    const user = auth.currentUser
    if(!user){ out.innerHTML='<span class="danger">Aucun utilisateur connecté (Firebase Auth).</span>'; return }
    const db = getFirestore(app)
    await setDoc(doc(db, 'parents', user.uid, 'tokens', token), { createdAt: Date.now() })
    out.innerHTML = '<span class="ok">Token enregistré ✓</span>'
  }catch(e){
    console.error(e)
    out.innerHTML = '<span class="danger">Erreur token: ' + (e?.message||e) + '</span>'
  }
}
document.getElementById('regTokenBtn').addEventListener('click', registerToken)


/** --- Enregistrer mon token (FCM) --- */
async function saveMyToken(){
  const cfg = read()
  const out = document.getElementById('saveTokenStatus')
  const parentId = (document.getElementById('parentIdToken').value.trim() || document.getElementById('parentId')?.value?.trim() || '')
  if(!cfg || !cfg.apiKey || !cfg.projectId || !cfg.appId || !cfg.vapidKey){
    out.innerHTML = '<span class="danger">Config Firebase/VAPID manquante.</span>'; return
  }
  if(!parentId){ out.innerHTML = '<span class="danger">parentId requis.</span>'; return }
  try{
    const [
      { initializeApp },
      { getMessaging, getToken },
      { getFirestore, doc, setDoc },
    ] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js'),
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js'),
    ])
    const app = initializeApp({
      apiKey: cfg.apiKey, authDomain: cfg.authDomain, projectId: cfg.projectId, appId: cfg.appId
    }, 'pm-settings-push')
    // Register service worker for background handling
    if ('serviceWorker' in navigator) {
      await navigator.serviceWorker.register('/firebase-messaging-sw.js')
    }
    const messaging = getMessaging(app)
    const perm = await Notification.requestPermission()
    if(perm !== 'granted'){ out.innerHTML = '<span class="danger">Notifications refusées.</span>'; return }
    const token = await getToken(messaging, { vapidKey: cfg.vapidKey })
    if(!token){ out.innerHTML = '<span class="danger">Impossible d'obtenir le token.</span>'; return }
    const db = getFirestore(app)
    await setDoc(doc(db, 'parents', parentId, 'tokens', token), { createdAt: Date.now() })
    out.innerHTML = '<span class="ok">Token enregistré ✓</span>'
  }catch(e){
    console.error(e)
    out.innerHTML = '<span class="danger">Erreur: ' + (e?.message||e) + '</span>'
  }
}
document.getElementById('saveTokenBtn').addEventListener('click', saveMyToken)


/** --- Déconnexion / Clear config --- */
async function doLogout(){
  const out = document.getElementById('logoutStatus')
  try{
    // Clear local config
    localStorage.removeItem('PM_USER_CONFIG')
    // Try to sign out if Firebase auth is available
    try {
      const [{ initializeApp }, { getAuth, signOut }] = await Promise.all([
        import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js'),
      ])
      const cfg = read()
      if(cfg && cfg.apiKey && cfg.projectId && cfg.appId){
        const app = initializeApp({ apiKey: cfg.apiKey, authDomain: cfg.authDomain, projectId: cfg.projectId, appId: cfg.appId }, 'pm-settings-auth')
        const auth = getAuth(app)
        await signOut(auth).catch(()=>{})
      }
    } catch(_) {}
    out.innerHTML = '<span class="ok">Configuration effacée. Déconnexion effectuée (si possible) ✓</span>'
    // Refresh form
    fillForm(read())
  }catch(e){
    console.error(e)
    out.innerHTML = '<span class="danger">Erreur: ' + (e?.message||e) + '</span>'
  }
}
document.getElementById('logoutBtn').addEventListener('click', doLogout)


/** --- Lecture en temps réel des alertes --- */
let _unsubscribeAlerts = null

async function startRealtime(){
  const cfg = read()
  const out = document.getElementById('realtimeStatus')
  const list = document.getElementById('realtimeList')
  const parentId = (document.getElementById('parentIdRealtime').value.trim() || document.getElementById('parentId')?.value?.trim() || '')
  if(!cfg || !cfg.apiKey || !cfg.projectId || !cfg.appId){
    out.innerHTML = '<span class="danger">Config Firebase manquante.</span>'; return
  }
  if(!parentId){ out.innerHTML = '<span class="danger">parentId requis.</span>'; return }
  try{
    const [{ initializeApp }, { getFirestore, collection, query, orderBy, onSnapshot }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js')
    ])
    const app = initializeApp({ apiKey: cfg.apiKey, authDomain: cfg.authDomain, projectId: cfg.projectId, appId: cfg.appId }, 'pm-settings-realtime')
    const db = getFirestore(app)
    const col = collection(db, 'parents', parentId, 'alerts')
    const q = query(col, orderBy('createdAt', 'desc'))
    list.innerHTML = ''
    _unsubscribeAlerts = onSnapshot(q, (snap)=>{
      list.innerHTML = ''
      snap.forEach(docSnap => {
        const d = docSnap.data()
        const line = document.createElement('div')
        const ts = d.createdAt ? new Date(d.createdAt).toLocaleString() : ''
        line.textContent = `• [${ts}] ${d.text || '(sans texte)'}`
        list.appendChild(line)
      })
      out.innerHTML = '<span class="ok">Écoute active ✓</span>'
    }, (err)=>{
      console.error(err)
      out.innerHTML = '<span class="danger">Erreur snapshot: ' + (err?.message||err) + '</span>'
    })
  }catch(e){
    console.error(e)
    out.innerHTML = '<span class="danger">Erreur: ' + (e?.message||e) + '</span>'
  }
}

function stopRealtime(){
  const out = document.getElementById('realtimeStatus')
  if(_unsubscribeAlerts){ _unsubscribeAlerts(); _unsubscribeAlerts = null }
  out.innerHTML = '<span class="ok">Écoute arrêtée.</span>'
}

document.getElementById('startRealtimeBtn').addEventListener('click', startRealtime)
document.getElementById('stopRealtimeBtn').addEventListener('click', stopRealtime)


// --- Exporter les alertes en JSON ---
async function exportAlerts(){
  const cfg = read()
  const out = document.getElementById('exportStatus')
  const parentId = document.getElementById('parentIdExport').value.trim()
  if(!cfg || !cfg.apiKey || !cfg.projectId || !cfg.appId){
    out.innerHTML = '<span class="danger">Config manquante.</span>'; return
  }
  if(!parentId){ out.innerHTML = '<span class="danger">parentId requis.</span>'; return }
  try{
    const [{ initializeApp }, { getFirestore, collection, getDocs }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js')
    ])
    const app = initializeApp({ apiKey: cfg.apiKey, authDomain: cfg.authDomain, projectId: cfg.projectId, appId: cfg.appId }, 'pm-settings-export')
    const db = getFirestore(app)
    const col = collection(db, 'parents', parentId, 'alerts')
    const snap = await getDocs(col)
    const alerts = snap.docs.map(d=>({id:d.id,...d.data()}))
    const blob = new Blob([JSON.stringify(alerts,null,2)], {type:'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `alerts-${parentId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    out.innerHTML = '<span class="ok">Exporté ✓</span>'
  }catch(e){
    console.error(e)
    out.innerHTML = '<span class="danger">Erreur: ' + (e?.message||e) + '</span>'
  }
}
document.getElementById('exportAlertsBtn').addEventListener('click', exportAlerts)

// --- Compter les tokens ---
async function countTokens(){
  const cfg = read()
  const out = document.getElementById('tokensStatus')
  const parentId = document.getElementById('parentIdTokens').value.trim()
  if(!cfg || !cfg.apiKey || !cfg.projectId || !cfg.appId){
    out.innerHTML = '<span class="danger">Config manquante.</span>'; return
  }
  if(!parentId){ out.innerHTML = '<span class="danger">parentId requis.</span>'; return }
  try{
    const [{ initializeApp }, { getFirestore, collection, getDocs }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js')
    ])
    const app = initializeApp({ apiKey: cfg.apiKey, authDomain: cfg.authDomain, projectId: cfg.projectId, appId: cfg.appId }, 'pm-settings-tokens')
    const db = getFirestore(app)
    const col = collection(db, 'parents', parentId, 'tokens')
    const snap = await getDocs(col)
    const count = snap.size
    out.innerHTML = '<span class="ok">' + count + ' token(s) trouvé(s)</span>'
  }catch(e){
    console.error(e)
    out.innerHTML = '<span class="danger">Erreur: ' + (e?.message||e) + '</span>'
  }
}
document.getElementById('countTokensBtn').addEventListener('click', countTokens)


/** --- Supprimer tous les tokens pour un parent --- */
async function deleteAllTokens(){
  const cfg = read()
  const parentId = (document.getElementById('parentIdTools').value.trim() || document.getElementById('parentIdToken')?.value?.trim() || '')
  const out = document.getElementById('deleteTokensStatus')
  if(!cfg || !cfg.apiKey || !cfg.projectId || !cfg.appId){ out.innerHTML = '<span class="danger">Config Firebase manquante.</span>'; return }
  if(!parentId){ out.innerHTML = '<span class="danger">parentId requis.</span>'; return }
  if(!confirm('Supprimer TOUS les tokens pour ce parent ?')){ return }
  try{
    const [{ initializeApp }, { getFirestore, collection, getDocs, doc, deleteDoc }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js')
    ])
    const app = initializeApp({ apiKey: cfg.apiKey, authDomain: cfg.authDomain, projectId: cfg.projectId, appId: cfg.appId }, 'pm-settings-delete')
    const db = getFirestore(app)
    const colRef = collection(db, 'parents', parentId, 'tokens')
    const snap = await getDocs(colRef)
    let count = 0
    for(const d of snap.docs){
      await deleteDoc(doc(db, 'parents', parentId, 'tokens', d.id))
      count++
    }
    out.innerHTML = '<span class="ok">Supprimés: ' + count + ' token(s) ✓</span>'
  }catch(e){
    console.error(e)
    out.innerHTML = '<span class="danger">Erreur suppression: ' + (e?.message||e) + '</span>'
  }
}
document.getElementById('deleteTokensBtn').addEventListener('click', deleteAllTokens)


/** ===== Console Admin — Helpers ===== */
function logMsg(m){
  const el = document.getElementById('debugLog'); if(!el) return;
  const ts = new Date().toLocaleTimeString(); el.textContent += `[${ts}] ${m}\n`; el.scrollTop = el.scrollHeight;
}
function toCsv(rows){
  if(!rows.length) return '';
  const keys = Object.keys(rows[0]);
  const esc = v => (v==null?'':String(v).replace(/"/g,'""'));
  const head = keys.map(k=>`"${esc(k)}"`).join(',');
  const body = rows.map(r => keys.map(k=>`"${esc(r[k])}"`).join(',')).join('\n');
  return head + '\n' + body;
}
function downloadBlob(content, name, type){
  const blob = new Blob([content], {type}); const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
}

/** ===== Console Admin — Events ===== */
document.getElementById('exportAlertsCsvBtn').addEventListener('click', async ()=>{
  const cfg = read(); const parentId = (document.getElementById('parentIdAdmin').value.trim() || document.getElementById('parentIdTools')?.value?.trim() || '');
  const out = document.getElementById('adminStatus')
  if(!cfg || !cfg.apiKey || !cfg.projectId || !cfg.appId) return out.innerHTML = '<span class="danger">Config manquante.</span>';
  if(!parentId) return out.innerHTML = '<span class="danger">parentId requis.</span>';
  try{
    const [{ initializeApp }, { getFirestore, collection, getDocs, orderBy, query }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js')
    ]);
    const app = initializeApp({ apiKey: cfg.apiKey, authDomain: cfg.authDomain, projectId: cfg.projectId, appId: cfg.appId }, 'pm-admin-export-csv');
    const db = getFirestore(app);
    const q = query(collection(db, 'parents', parentId, 'alerts'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const rows = snap.docs.map(d=>({ id: d.id, createdAt: d.data().createdAt||'', text: d.data().text||'', childId: d.data().childId||'' }));
    const csv = toCsv(rows); downloadBlob(csv, `alerts_${parentId}.csv`, 'text/csv'); out.innerHTML = '<span class="ok">CSV exporté ✓</span>'; logMsg('Export CSV alertes OK');
  }catch(e){ console.error(e); out.innerHTML = '<span class="danger">Erreur CSV: '+(e?.message||e)+'</span>'; logMsg('Erreur CSV: '+(e?.message||e)); }
});

async function downloadTokens(format){
  const cfg = read(); const parentId = (document.getElementById('parentIdAdmin').value.trim() || document.getElementById('parentIdTools')?.value?.trim() || '');
  const out = document.getElementById('adminStatus')
  if(!cfg || !cfg.apiKey || !cfg.projectId || !cfg.appId) return out.innerHTML = '<span class="danger">Config manquante.</span>';
  if(!parentId) return out.innerHTML = '<span class="danger">parentId requis.</span>';
  try{
    const [{ initializeApp }, { getFirestore, collection, getDocs }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js')
    ]);
    const app = initializeApp({ apiKey: cfg.apiKey, authDomain: cfg.authDomain, projectId: cfg.projectId, appId: cfg.appId }, 'pm-admin-tokens');
    const db = getFirestore(app);
    const snap = await getDocs(collection(db, 'parents', parentId, 'tokens'));
    const items = snap.docs.map(d=>({ token: d.id, ...d.data() }));
    if(format==='json'){ downloadBlob(JSON.stringify(items,null,2), `tokens_${parentId}.json`, 'application/json') }
    else { const csv = toCsv(items); downloadBlob(csv, `tokens_${parentId}.csv`, 'text/csv') }
    document.getElementById('adminStatus').innerHTML = '<span class="ok">Tokens téléchargés ✓</span>'; logMsg('Download tokens '+format+' OK');
  }catch(e){ console.error(e); out.innerHTML = '<span class="danger">Erreur tokens: '+(e?.message||e)+'</span>'; logMsg('Erreur tokens: '+(e?.message||e)); }
}
document.getElementById('downloadTokensJsonBtn').addEventListener('click', ()=>downloadTokens('json'));
document.getElementById('downloadTokensCsvBtn').addEventListener('click', ()=>downloadTokens('csv'));

let _tokensUnsub = null;
document.getElementById('autoRefreshTokensChk').addEventListener('change', async (ev)=>{
  const checked = ev.target.checked;
  const cfg = read(); const parentId = (document.getElementById('parentIdAdmin').value.trim() || document.getElementById('parentIdTools')?.value?.trim() || '');
  const countEl = document.getElementById('autoTokensCount'); const listEl = document.getElementById('autoTokensList');
  if(!cfg || !cfg.apiKey || !cfg.projectId || !cfg.appId || !parentId){ ev.target.checked=false; return; }
  try{
    const [{ initializeApp }, { getFirestore, collection, onSnapshot }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js')
    ]);
    const app = initializeApp({ apiKey: cfg.apiKey, authDomain: cfg.authDomain, projectId: cfg.projectId, appId: cfg.appId }, 'pm-admin-auto-tokens');
    const db = getFirestore(app);
    if(checked){
      _tokensUnsub = onSnapshot(collection(db, 'parents', parentId, 'tokens'), (snap)=>{
        countEl.textContent = `Tokens: ${snap.size}`; listEl.innerHTML='';
        snap.forEach(doc=>{ const d = doc.data(); const el = document.createElement('div'); el.textContent = '• ' + doc.id; listEl.appendChild(el); });
        logMsg('Auto-refresh tokens: ' + snap.size);
      }, (err)=>{ logMsg('Auto-refresh error: '+(err?.message||err)) });
    } else {
      if(_tokensUnsub){ _tokensUnsub(); _tokensUnsub=null; countEl.textContent=''; listEl.innerHTML=''; }
    }
  }catch(e){ logMsg('Auto-refresh init error: '+(e?.message||e)); }
});

document.getElementById('purgeParentBtn').addEventListener('click', async ()=>{
  const cfg = read(); const parentId = (document.getElementById('parentIdAdmin').value.trim() || document.getElementById('parentIdTools')?.value?.trim() || '');
  const out = document.getElementById('adminStatus')
  if(!cfg || !cfg.apiKey || !cfg.projectId || !cfg.appId) return out.innerHTML = '<span class="danger">Config manquante.</span>';
  if(!parentId) return out.innerHTML = '<span class="danger">parentId requis.</span>';
  if(!confirm('Supprimer TOUTES les alertes et TOUS les tokens pour ce parent ?')) return;
  try{
    const [{ initializeApp }, { getFirestore, collection, getDocs, doc, deleteDoc }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js')
    ]);
    const app = initializeApp({ apiKey: cfg.apiKey, authDomain: cfg.authDomain, projectId: cfg.projectId, appId: cfg.appId }, 'pm-admin-purge');
    const db = getFirestore(app);
    const delAll = async (path) => {
      const [p1,p2,p3] = path; const snap = await getDocs(collection(db, p1, p2, p3));
      let cnt=0; for(const d of snap.docs){ await deleteDoc(doc(db, p1, p2, p3, d.id)); cnt++; } return cnt;
    };
    const c1 = await delAll(['parents', parentId, 'alerts']);
    const c2 = await delAll(['parents', parentId, 'tokens']);
    out.innerHTML = `<span class="ok">Purge OK: ${c1} alertes, ${c2} tokens supprimés ✓</span>`; logMsg('Purge OK');
  }catch(e){ console.error(e); out.innerHTML = '<span class="danger">Erreur purge: '+(e?.message||e)+'</span>'; logMsg('Erreur purge: '+(e?.message||e)); }
});

document.getElementById('importAlertsBtn').addEventListener('click', async ()=>{
  const file = document.getElementById('importAlertsFile').files?.[0];
  const cfg = read(); const parentId = (document.getElementById('parentIdAdmin').value.trim() || document.getElementById('parentIdTools')?.value?.trim() || '');
  const out = document.getElementById('adminStatus')
  if(!file) return out.innerHTML = '<span class="danger">Choisis un fichier JSON.</span>';
  if(!cfg || !cfg.apiKey || !cfg.projectId || !cfg.appId) return out.innerHTML = '<span class="danger">Config manquante.</span>';
  if(!parentId) return out.innerHTML = '<span class="danger">parentId requis.</span>';
  try{
    const text = await file.text(); const items = JSON.parse(text);
    const [{ initializeApp }, { getFirestore, doc, setDoc }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js')
    ]);
    const app = initializeApp({ apiKey: cfg.apiKey, authDomain: cfg.authDomain, projectId: cfg.projectId, appId: cfg.appId }, 'pm-admin-import');
    const db = getFirestore(app);
    let n=0; for(const it of items){
      const id = it.id || undefined; const data = Object.assign({ createdAt: Date.now() }, it); delete data.id;
      await setDoc(id? doc(db, 'parents', parentId, 'alerts', id): doc(db, 'parents', parentId, 'alerts', Math.random().toString(36).slice(2)), data, { merge:true });
      n++;
    }
    out.innerHTML = '<span class="ok">Import OK: '+n+' alerte(s) ✓</span>'; logMsg('Import OK '+n);
  }catch(e){ console.error(e); out.innerHTML = '<span class="danger">Erreur import: '+(e?.message||e)+'</span>'; logMsg('Erreur import: '+(e?.message||e)); }
});

// Silent notifications toggle persisted in localStorage
const SILENT_KEY = 'PM_SILENT';
const silentChk = document.getElementById('silentNotifChk');
if(silentChk){
  try{ silentChk.checked = localStorage.getItem(SILENT_KEY) === '1'; }catch{}
  silentChk.addEventListener('change', ()=>{
    if(silentChk.checked) localStorage.setItem(SILENT_KEY, '1'); else localStorage.removeItem(SILENT_KEY);
    logMsg('Mode notifications silencieuses: ' + (silentChk.checked?'ON':'OFF'));
  });
}


/** === Auth integration === */
let _auth = null
async function ensureAuth(){
  const cfg = read()
  if(!_auth && cfg && cfg.apiKey && cfg.projectId && cfg.appId){
    const [{ initializeApp }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js')
    ])
    const app = initializeApp({ apiKey: cfg.apiKey, authDomain: cfg.authDomain, projectId: cfg.projectId, appId: cfg.appId }, 'pm-settings-auth2')
    const mod = await import('./auth.js')
    _auth = await mod.initAuth(app)
    window.PM_auth.onAuthStateChanged(_auth, (user)=>{
      const uidEl = document.getElementById('authUid'); const mailEl = document.getElementById('pmAuthEmail')
      if(user){
        uidEl && (uidEl.textContent = user.uid)
        mailEl && (mailEl.textContent = user.email || 'Connecté')
        // Autofill all parentId fields
        for(const id of ['parentId','parentIdToken','parentIdRealtime','parentIdTools','parentIdAdmin','parentIdStats']){
          const el = document.getElementById(id)
          if(el && !el.value){ el.value = user.uid }
        }
      }else{
        uidEl && (uidEl.textContent = '—')
        mailEl && (mailEl.textContent = '')
      }
    })
  }
}

document.addEventListener('DOMContentLoaded', ensureAuth)

document.getElementById('loginBtn').addEventListener('click', async ()=>{
  const out = document.getElementById('authStatus')
  try{
    await ensureAuth()
    const email = document.getElementById('authEmail').value.trim()
    const pass = document.getElementById('authPass').value.trim()
    if(!email || !pass) return out.innerHTML = '<span class="danger">Email et mot de passe requis.</span>'
    await window.PM_auth.signInWithEmailAndPassword(_auth, email, pass)
    out.innerHTML = '<span class="ok">Connecté ✓</span>'
  }catch(e){ console.error(e); out.innerHTML = '<span class="danger">Erreur: '+(e?.message||e)+'</span>' }
})

document.getElementById('signupBtn').addEventListener('click', async ()=>{
  const out = document.getElementById('authStatus')
  try{
    await ensureAuth()
    const email = document.getElementById('authEmail').value.trim()
    const pass = document.getElementById('authPass').value.trim()
    if(!email || !pass) return out.innerHTML = '<span class="danger">Email et mot de passe requis.</span>'
    await window.PM_auth.createUserWithEmailAndPassword(_auth, email, pass)
    out.innerHTML = '<span class="ok">Compte créé et connecté ✓</span>'
  }catch(e){ console.error(e); out.innerHTML = '<span class="danger">Erreur: '+(e?.message||e)+'</span>' }
})

document.getElementById('logoutBtn2').addEventListener('click', async ()=>{
  const out = document.getElementById('authStatus')
  try{
    await ensureAuth()
    await window.PM_auth.signOut(_auth)
    out.innerHTML = '<span class="ok">Déconnecté ✓</span>'
  }catch(e){ console.error(e); out.innerHTML = '<span class="danger">Erreur: '+(e?.message||e)+'</span>' }
})

document.getElementById('copyUidBtn').addEventListener('click', async ()=>{
  const uid = document.getElementById('authUid').textContent
  try{
    await navigator.clipboard.writeText(uid)
    document.getElementById('authStatus').innerHTML = '<span class="ok">UID copié ✓</span>'
  }catch{}
})
