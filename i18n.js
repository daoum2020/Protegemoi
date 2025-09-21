
(function(){
  const fallback = 'fr';
  function getLang(){
    const urlParam = new URLSearchParams(window.location.search).get('lang');
    return urlParam || localStorage.getItem('lang') || navigator.language?.slice(0,2) || fallback;
  }
  function apply(dict){
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(dict[key]) el.textContent = dict[key];
    });
  }
  async function load(lang){
    try{
      const res = await fetch(`/assets/i18n/${lang}.json`);
      if(!res.ok) throw new Error('lang not found');
      const data = await res.json();
      apply(data);
    }catch(e){
      if(lang !== fallback) load(fallback);
    }
  }
  document.addEventListener('DOMContentLoaded', ()=>{
    const lang = getLang();
    localStorage.setItem('lang', lang);
    load(lang);
  });
  window.setLang = function(lang){
    localStorage.setItem('lang', lang);
    location.search = '?lang='+lang;
  };
})();
