
(function(){
  function getLang(){const p=new URLSearchParams(location.search); return p.get('lang')||'fr';}
  const L = getLang();
  function apply(map){
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const k = el.getAttribute('data-i18n');
      const v = k.split('.').reduce((a,c)=> (a&&a[c]!=null)?a[c]:undefined, map);
      if(typeof v==='string'){ el.textContent = v; }
    });
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(el=>{
      const k = el.getAttribute('data-i18n-placeholder');
      const v = k.split('.').reduce((a,c)=> (a&&a[c]!=null)?a[c]:undefined, map);
      if(typeof v==='string'){ el.setAttribute('placeholder', v); }
    });
  }
  fetch('./locales/'+L+'.json').then(r=>r.ok?r.json():{}).catch(()=>({})).then(base=>{
    // Optional secondary file with plans only
    fetch('./locales/'+L+'.plans.json').then(r=>r.ok?r.json():{}).catch(()=>({})).then(pl=>{
      apply(Object.assign({}, base, pl));
    });
  });
})();