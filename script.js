
document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
const toggle = document.querySelector('.menu-toggle');
const links = document.getElementById('nav-links');
if(toggle && links){
  toggle.addEventListener('click', ()=>{
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', (!expanded).toString());
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    links.classList.remove('open'); toggle.setAttribute('aria-expanded','false');
  }));
}
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); }
  });
});
const sw = document.getElementById('billingSwitch');
if(sw){
  const label = document.querySelector('.billing-toggle label');
  const track = label ? label.children[1] : null;
  const knob = label ? label.children[2] : null;
  const render = ()=>{
    const on = sw.checked;
    if(track && knob){ track.style.background = on ? '#0a5bd7' : '#dfe7f2'; knob.style.transform = on ? 'translateX(26px)' : 'translateX(0)'; }
    document.querySelectorAll('.price').forEach(p=>{
      const m = p.getAttribute('data-monthly'), y = p.getAttribute('data-yearly');
      if(m && y) p.textContent = on ? y : m;
    });
  };
  sw.addEventListener('change', render); render();
}
