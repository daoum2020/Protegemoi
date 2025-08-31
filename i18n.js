// Simple i18n loader for FR/EN/ES
const SUPPORTED = ['fr','en','es'];
const LS_KEY = 'protegemoi_lang';

function currentLang(){
  const saved = localStorage.getItem(LS_KEY);
  if (saved && SUPPORTED.includes(saved)) return saved;
  const nav = (navigator.language || 'fr').slice(0,2).toLowerCase();
  return SUPPORTED.includes(nav) ? nav : 'fr';
}

async function loadLang(lang){
  try{
    const res = await fetch(`i18n/${lang}.json`);
    const dict = await res.json();
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(dict[key]){
        if (el.tagName === 'TITLE') {
          document.title = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });
  }catch(e){ console.error('i18n load error', e); }
}

function setLang(lang){
  if(!SUPPORTED.includes(lang)) return;
  localStorage.setItem(LS_KEY, lang);
  // set select
  const sel = document.getElementById('lang'); if(sel) sel.value = lang;
  loadLang(lang);
}

window.addEventListener('DOMContentLoaded', ()=>{
  const lang = localStorage.getItem(LS_KEY) || currentLang();
  const sel = document.getElementById('lang'); if(sel) sel.value = lang;
  setLang(lang);
});

// Add URL param support ?lang=fr|en|es and persist it
function getQueryLang(){
  const params = new URLSearchParams(window.location.search);
  const q = params.get('lang');
  if(q && SUPPORTED.includes(q)) return q;
  return null;
}
window.addEventListener('DOMContentLoaded', ()=>{
  const ql = getQueryLang();
  if(ql){ setLang(ql); }
  // propagate lang in nav links
  const lang = localStorage.getItem(LS_KEY) || currentLang();
  document.querySelectorAll('nav.menu a, .brand').forEach(a=>{
    if(a.tagName === 'A'){
      const url = new URL(a.getAttribute('href'), window.location.origin + window.location.pathname);
      url.searchParams.set('lang', lang);
      a.setAttribute('href', url.pathname + url.search);
    }
  });
});


// AUTO_REDIRECT: if no ?lang= present, redirect to browser language on index.html only
(function(){
  const path = location.pathname.toLowerCase();
  const isIndex = /(?:^|\/)index\.html?$/.test(path) || path.endsWith('/protegemoi/') || path.endsWith('/protegemoi');
  const hasParam = new URLSearchParams(location.search).has('lang');
  if(isIndex && !hasParam){
    const lang = currentLang();
    const url = new URL(location.href);
    url.searchParams.set('lang', lang);
    location.replace(url.toString());
  }
})();