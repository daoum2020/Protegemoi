// Utilities
document.getElementById('year').textContent = new Date().getFullYear();

function toggleMenu(){
  const m = document.getElementById('mainmenu');
  const btn = document.querySelector('.hamburger');
  const show = !m.classList.contains('show');
  m.classList.toggle('show', show);
  btn.setAttribute('aria-expanded', show ? 'true' : 'false');
}
function closeMenu(){
  const m = document.getElementById('mainmenu');
  const btn = document.querySelector('.hamburger');
  m.classList.remove('show');
  btn.setAttribute('aria-expanded','false');
}

// OPTIONAL: si un ancien script affichait "Nouvelle version disponible", on le neutralise
// Supprime toute bannière avec le texte correspondant
window.addEventListener('load', () => {
  const banners = Array.from(document.querySelectorAll('div,section,aside')).filter(el => /Nouvelle version disponible/i.test(el.textContent||''));
  banners.forEach(el => el.remove());
});


/* PWA: register service worker if present */
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('./sw.js').catch(()=>{});
}


// Formspree minimal handler
function handleFormspree(e){
  e.preventDefault();
  const form = e.target;
  const msg = document.getElementById('notify-msg');
  const endpoint = form.getAttribute('action');
  if(!endpoint || /XXXXYYYY/.test(endpoint)){
    msg.textContent = 'Endpoint Formspree à configurer (remplacez XXXXYYYY par votre ID).';
    return false;
  }
  const data = new FormData(form);
  fetch(endpoint, { method:'POST', body: data, headers: { 'Accept': 'application/json' }})
    .then(r => r.ok ? r.json() : Promise.reject(r))
    .then(()=>{ msg.textContent = 'Merci ! Vous serez prévenu du lancement.'; form.reset(); })
    .catch(()=>{ msg.textContent = 'Désolé, une erreur est survenue. Réessayez plus tard.'; });
  return false;
}


// === AUTH (stub) ===
const AUTH_KEY = 'pm_auth';
function isLoggedIn(){ return localStorage.getItem(AUTH_KEY)==='1'; }
function loginDemo(){ localStorage.setItem(AUTH_KEY,'1'); alert('Connecté (demo)'); gateProtected(); }
function logoutDemo(){ localStorage.removeItem(AUTH_KEY); alert('Déconnecté'); gateProtected(); }
function gateProtected(){
  const protectedSelectors = ['a[href*="dashboard"]','a[href*="stats"]','a[href*="billing"]'];
  const menu = document.getElementById('mainmenu');
  if(menu){
    protectedSelectors.forEach(sel=>{
      menu.querySelectorAll(sel).forEach(a=>{
        a.style.display = isLoggedIn()? '' : 'none';
      });
    });
  }
  document.querySelectorAll('.requires-auth').forEach(el=>{
    el.style.display = isLoggedIn()? '' : 'none';
  });
  document.querySelectorAll('.guest-only').forEach(el=>{
    el.style.display = isLoggedIn()? 'none' : '';
  });
}
window.addEventListener('DOMContentLoaded', gateProtected);


// === PWA Update banner (light) ===
(function(){
  if(!('serviceWorker' in navigator)) return;
  let newWorker;
  navigator.serviceWorker.addEventListener('controllerchange', ()=>{
    const b = document.getElementById('update-banner'); if(b){ b.remove(); }
  });
  navigator.serviceWorker.getRegistration().then(reg=>{
    if(!reg) return;
    reg.addEventListener('updatefound', ()=>{
      newWorker = reg.installing;
      newWorker.addEventListener('statechange', ()=>{
        if(newWorker.state==='installed' && navigator.serviceWorker.controller){
          const div = document.createElement('div');
          div.id='update-banner';
          div.style.cssText='position:fixed;bottom:16px;left:50%;transform:translateX(-50%);background:#0b2942;color:#fff;padding:10px 14px;border-radius:10px;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,.2)';
          div.innerHTML='Nouvelle version disponible <button class="btn" style="margin-left:8px" id="btn-refresh">Mettre à jour</button>';
          document.body.appendChild(div);
          document.getElementById('btn-refresh').onclick=()=>{ newWorker.postMessage({type:'SKIP_WAITING'}); location.reload(); };
        }
      });
    });
  });
})();

// === Add to Home Screen prompt (A2HS) minimal ===
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e)=>{ e.preventDefault(); deferredPrompt = e; });
function showA2HS(){
  if(!deferredPrompt){ alert('Installation PWA indisponible'); return; }
  deferredPrompt.prompt();
  deferredPrompt.userChoice.finally(()=>{ deferredPrompt = null; });
}


// === THEME ===
const THEME_KEY='pm_theme';
function applyTheme(t){ document.documentElement.setAttribute('data-theme', t); localStorage.setItem(THEME_KEY, t); const btn=document.getElementById('themeToggle'); if(btn){ btn.textContent=(t==='dark'?'🌙':'☀️'); } }
function initTheme(){ const saved=localStorage.getItem(THEME_KEY) || (window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'); applyTheme(saved); }
document.addEventListener('DOMContentLoaded', ()=>{
  initTheme();
  const btn = document.getElementById('themeToggle'); if(btn){ btn.addEventListener('click', ()=>{ const cur = document.documentElement.getAttribute('data-theme')||'light'; applyTheme(cur==='light'?'dark':'light'); }); }
});


// Admin link visibility based on PM_CONFIG.adminEmails and stored email
function showAdminLink(){
  const cfg = window.PM_CONFIG || {};
  const list = (cfg.adminEmails || []).map(e=>String(e||'').toLowerCase());
  const email = JSON.parse(localStorage.getItem('pm_user_email')||'null');
  const ok = email && list.includes(String(email).toLowerCase());
  document.querySelectorAll('.admin-only').forEach(el=> el.style.display = ok? '' : 'none');
}
document.addEventListener('DOMContentLoaded', showAdminLink);
