import { getFirestore, collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

const cfg = window.PM_CONFIG || {};
const app = initializeApp(cfg);
const db = getFirestore(app);
const auth = getAuth(app);

const ADMIN_EMAILS = (cfg.adminEmails || []).map(e=>String(e||'').toLowerCase());
function isAdmin(user){ return !!(user && user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())); }

function guardAdmin(){
  onAuthStateChanged(auth, async (user)=>{
    const adminLinkEls = document.querySelectorAll('.admin-only');
    adminLinkEls.forEach(el=>el.style.display = 'none');
    if(!user){ alert('Accès admin réservé. Connectez-vous.'); window.location.href='login.html'; return; }
    if(!isAdmin(user)){ alert('Compte non admin.'); window.location.href='index.html'; return; }
    adminLinkEls.forEach(el=>el.style.display = '');
    await refreshAll();
  });
}

async function fetchTable(colName, orderField='ts'){
  const rows = [];
  try{
    const q = query(collection(db, colName), orderBy(orderField, 'desc'), limit(200));
    const snap = await getDocs(q);
    snap.forEach(doc=> rows.push({ id: doc.id, ...doc.data() }) );
  }catch(e){ console.error('fetchTable', colName, e); }
  return rows;
}
function fillTable(tbody, data, cols){
  tbody.innerHTML = '';
  data.forEach(row=>{
    const tr = document.createElement('tr');
    cols.forEach(c=>{ const td = document.createElement('td'); td.textContent = row[c] ?? ''; tr.appendChild(td); });
    tbody.appendChild(tr);
  });
}
async function refreshAll(){
  const users = await fetchTable('users','createdAt'); fillTable(document.querySelector('#tblUsers tbody'), users, ['email','uid','createdAt']);
  const children = await fetchTable('children','createdAt'); fillTable(document.querySelector('#tblChildren tbody'), children, ['id','parentId','name']);
  const alerts = await fetchTable('alerts','ts'); fillTable(document.querySelector('#tblAlerts tbody'), alerts, ['id','parentId','childId','ts','status']);
}
function exportCSV(){
  function tableToCSV(tbl){
    return Array.from(tbl.querySelectorAll('tr')).map(r => Array.from(r.children).map(td => '"'+(td.textContent||'').replace(/"/g,'""')+'"').join(',')).join('\n');
  }
  const parts = [];
  parts.push('Users'); parts.push(tableToCSV(document.getElementById('tblUsers')));
  parts.push('\nChildren'); parts.push(tableToCSV(document.getElementById('tblChildren')));
  parts.push('\nAlerts'); parts.push(tableToCSV(document.getElementById('tblAlerts')));
  const blob = new Blob([parts.join('\n')], {type:'text/csv'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'protegemoi_admin_export.csv'; a.click();
}
document.getElementById('btnRefresh')?.addEventListener('click', refreshAll);
document.getElementById('btnExport')?.addEventListener('click', exportCSV);
document.getElementById('btnLogout')?.addEventListener('click', ()=>signOut(auth).then(()=>window.location.href='index.html'));
guardAdmin();
