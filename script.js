
// ---- Promo code (index & pricing) ----
(function(){
  const VALID_CODE = "PROTEGEMOI2026";
  const DISCOUNT = 0.50;
  const LS_KEY = "pm_promo";

  const priceEls = Array.from(document.querySelectorAll(".price"));
  if(!priceEls.length) return; // no price cards on this page

  // Save base values from data-*
  priceEls.forEach(el=>{
    el.dataset.baseMonthly = (el.getAttribute("data-monthly")||"").trim();
    el.dataset.baseYearly  = (el.getAttribute("data-yearly")||"").trim();
  });

  const getBillingMode = ()=>{
    const sw = document.getElementById("billingSwitch");
    return sw && sw.checked ? "yearly" : "monthly";
  };

  const fmt = (n, lang)=>{
    const loc = (lang||localStorage.getItem("lang")||document.documentElement.lang||"fr").slice(0,2);
    return new Intl.NumberFormat(loc,{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
  };

  function extractAmount(txt){
    const m = (txt||"").match(/(\d+[.,]\d{2})/);
    return m ? parseFloat(m[1].replace(",", ".")) : null;
  }
  function rebuilt(base, newNum, lang){
    const newTxt = base.replace(/(\d+[.,]\d{2})/, fmt(newNum, lang));
    return `<s style="opacity:.6">${base}</s> &nbsp; ${newTxt}`;
  }

  function setStatus(ok,msg){
    const el = document.getElementById("promoStatus");
    if(!el) return;
    el.style.color = ok ? "var(--pm-green,#0a8f3e)" : "var(--pm-red,#c62828)";
    el.textContent = msg || "";
  }

  function applyDiscount(silent=false){
    const lang = localStorage.getItem("lang") || document.documentElement.lang || "fr";
    const mode = getBillingMode();
    priceEls.forEach(el=>{
      const base = el.dataset[`base${mode==="yearly"?"Yearly":"Monthly"}`];
      const n = extractAmount(base);
      if(n==null) return;
      el.innerHTML = rebuilt(base, n*(1-DISCOUNT), lang);
    });
    localStorage.setItem(LS_KEY, JSON.stringify({code:VALID_CODE}));
    if(!silent){
      const t = {fr:"Promo appliquée : -50%", en:"Promo applied: -50%", es:"Promoción aplicada: -50%", nl:"Promo toegepast: -50%"};
      setStatus(true, t[(localStorage.getItem("lang")||"fr")]);
    }
  }
  function clearDiscount(){
    const mode = getBillingMode();
    priceEls.forEach(el=>{
      const base = el.dataset[`base${mode==="yearly"?"Yearly":"Monthly"}`];
      if(base) el.textContent = base;
    });
    setStatus(false,"");
    localStorage.removeItem(LS_KEY);
  }

  // Apply button
  document.getElementById("promoApply")?.addEventListener("click", ()=>{
    const v = (document.getElementById("promoField")?.value||"").trim();
    if(v.toUpperCase() === VALID_CODE){ applyDiscount(); }
    else{
      const t = {fr:"Code invalide", en:"Invalid code", es:"Código no válido", nl:"Ongeldige code"};
      setStatus(false, t[(localStorage.getItem("lang")||"fr")]);
    }
  });

  // Toggle monthly/yearly
  document.getElementById("billingSwitch")?.addEventListener("change", ()=>{
    localStorage.getItem(LS_KEY) ? applyDiscount(true) : clearDiscount();
  });

  // Auto-apply if exists
  try{
    const saved = JSON.parse(localStorage.getItem(LS_KEY)||"null");
    if(saved && saved.code === VALID_CODE) applyDiscount(true);
  }catch(e){}
})();


// ---- Simple hamburger menu toggle ----
(function(){
  const menu = document.querySelector('nav.menu');
  const btn = document.querySelector('.menu-toggle');
  if(!menu || !btn) return;
  btn.addEventListener('click', ()=>{
    const expanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!expanded));
    btn.setAttribute('aria-expanded', String(!expanded));
  });
  // Close when clicking a link (mobile UX)
  document.querySelectorAll('#nav-links a').forEach(a=>a.addEventListener('click', ()=>{
    menu.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-expanded','false');
  }));
})();


// --- Carousel autoplay every 2s ---
(function(){
  const car = document.getElementById('familleCarousel');
  if(!car) return;
  const slides = car.querySelector('.slides');
  const slideCount = slides.children.length;
  let index=0;
  function showSlide(i){
    index = (i+slideCount)%slideCount;
    slides.style.transform = `translateX(${-index*100}%)`;
  }
  function next(){showSlide(index+1)}
  function prev(){showSlide(index-1)}
  car.querySelector('.next').addEventListener('click', next);
  car.querySelector('.prev').addEventListener('click', prev);
  setInterval(next, 2000);
})();
