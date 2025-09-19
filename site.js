
const I18N = {
  fr: {brand:"ProtègeMoi",
    nav_vision:"Vision", nav_family:"Famille", nav_pricing:"Tarifs", nav_contact:"Contact",
    hero_title:"ProtègeMoi — Le bouclier numérique de vos enfants.",
    hero_sub:"La sécurité en ligne, simple et intelligente, pour toute la famille.",
    vision_title:"Notre vision",
    vision_html:`Avec <strong>ProtègeMoi</strong>, les familles vivent le numérique en confiance.
Notre IA <strong>détecte, bloque et alerte</strong> face aux dangers en ligne — sans espionner ni stocker de données.
<br>Nous analysons uniquement des <strong>mots clés sensibles</strong>, et notre base est <strong>mise à jour chaque jour</strong> pour rester toujours plus efficace.
<br>Nous permettons aux parents de garder le contrôle tout en respectant la liberté des enfants.
<strong>ProtègeMoi évolue avec votre famille</strong>, pour une protection durable et sereine.`,
    family_title:"La famille ProtègeMoi",
    family_sub:"Un aperçu de parents et d’enfants qui nous inspirent — vos sourires sont notre mission.",
    pricing_title:"Abonnements", pricing_lead:"Offre de lancement : <strong>-50%</strong> avec un code promo exclusif",
    monthly:"Mensuel", yearly:"Annuel",
    placeholder:"Entrez votre code promo", apply:"Appliquer", applied:"Code appliqué : -50%", invalid:"Code invalide",
    plan1:"1 enfant", plan2:"2 enfants", plan3:"3 enfants", choose:"Choisir cette offre",
    per_month:" / mois", per_year:" / an",
    contact_title:"Contact", form_name:"Nom", form_email:"Email", form_msg:"Message", form_send:"Envoyer",
    contact_direct:"Contact direct",
    comma:true
  },
  en: {brand:"ProtègeMoi",
    nav_vision:"Vision", nav_family:"Family", nav_pricing:"Pricing", nav_contact:"Contact",
    hero_title:"ProtègeMoi — Your child’s digital shield.",
    hero_sub:"Online safety, simple and smart, for the whole family.",
    vision_title:"Our Vision",
    vision_html:`With <strong>ProtègeMoi</strong>, families enjoy digital life with confidence.
Our AI <strong>detects, blocks and alerts</strong> against online risks — without spying or storing data.
<br>We only scan <strong>sensitive keywords</strong>, and our database is <strong>updated daily</strong> to stay effective.
<br>We help parents stay in control while respecting children’s freedom.
<strong>ProtègeMoi grows with your family</strong>, for lasting and reliable protection.`,
    family_title:"ProtègeMoi Family",
    family_sub:"A glimpse of the families who inspire us — your smiles are our mission.",
    pricing_title:"Subscriptions", pricing_lead:"Launch offer: <strong>-50%</strong> with a promo code",
    monthly:"Monthly", yearly:"Yearly",
    placeholder:"Enter your promo code", apply:"Apply", applied:"Promo applied: -50%", invalid:"Invalid code",
    plan1:"1 child", plan2:"2 children", plan3:"3 children", choose:"Choose this plan",
    per_month:" / month", per_year:" / year",
    contact_title:"Contact", form_name:"Name", form_email:"Email", form_msg:"Message", form_send:"Send",
    contact_direct:"Direct contact",
    comma:false
  },
  es: {brand:"ProtègeMoi",
    nav_vision:"Visión", nav_family:"Familia", nav_pricing:"Precios", nav_contact:"Contacto",
    hero_title:"ProtègeMoi — El escudo digital de tus hijos.",
    hero_sub:"Seguridad en línea, simple e inteligente, para toda la familia.",
    vision_title:"Nuestra visión",
    vision_html:`Con <strong>ProtègeMoi</strong>, las familias viven el mundo digital con confianza.
Nuestra IA <strong>detecta, bloquea y alerta</strong> frente a riesgos en línea — sin espiar ni guardar datos.
<br>Solo analizamos <strong>palabras clave sensibles</strong> y nuestra base se <strong>actualiza a diario</strong> para ser más eficaz.
<br>Ayudamos a los padres a mantener el control respetando la libertad de los niños.
<strong>ProtègeMoi crece con tu familia</strong>, para una protección duradera y segura.`,
    family_title:"Familia ProtègeMoi",
    family_sub:"Una mirada a las familias que nos inspiran — sus sonrisas son nuestra misión.",
    pricing_title:"Planes", pricing_lead:"Oferta de lanzamiento: <strong>-50%</strong> con código promocional",
    monthly:"Mensual", yearly:"Anual",
    placeholder:"Introduce tu código promocional", apply:"Aplicar", applied:"Código aplicado: -50%", invalid:"Código inválido",
    plan1:"1 niño", plan2:"2 niños", plan3:"3 niños", choose:"Elegir este plan",
    per_month:" / mes", per_year:" / año",
    contact_title:"Contacto", form_name:"Nombre", form_email:"Correo", form_msg:"Mensaje", form_send:"Enviar",
    contact_direct:"Contacto directo",
    comma:true
  },
  nl: {brand:"ProtègeMoi",
    nav_vision:"Visie", nav_family:"Familie", nav_pricing:"Tarieven", nav_contact:"Contact",
    hero_title:"ProtègeMoi — Het digitale schild van uw kinderen.",
    hero_sub:"Online veiligheid, eenvoudig en slim, voor het hele gezin.",
    vision_title:"Onze visie",
    vision_html:`Met <strong>ProtègeMoi</strong> beleven gezinnen het digitale leven met vertrouwen.
Onze AI <strong>detecteert, blokkeert en waarschuwt</strong> bij online risico’s — zonder te spioneren of data op te slaan.
<br>We controleren alleen <strong>gevoelige trefwoorden</strong> en onze database wordt <strong>dagelijks bijgewerkt</strong> voor meer effectiviteit.
<br>We helpen ouders de controle te behouden met respect voor de vrijheid van kinderen.
<strong>ProtègeMoi groeit mee met uw gezin</strong>, voor een duurzame en betrouwbare bescherming.`,
    family_title:"ProtègeMoi‑familie",
    family_sub:"Een blik op gezinnen die ons inspireren — jullie glimlach is onze missie.",
    pricing_title:"Abonnementen", pricing_lead:"Lancering: <strong>-50%</strong> met promotiecode",
    monthly:"Maandelijks", yearly:"Jaarlijks",
    placeholder:"Voer je promotiecode in", apply:"Toepassen", applied:"Code toegepast: -50%", invalid:"Ongeldige code",
    plan1:"1 kind", plan2:"2 kinderen", plan3:"3 kinderen", choose:"Kies dit plan",
    per_month:" / maand", per_year:" / jaar",
    contact_title:"Contact", form_name:"Naam", form_email:"E‑mail", form_msg:"Bericht", form_send:"Verzenden",
    contact_direct:"Direct contact",
    comma:true
  }
};

(function(){
  const CODE="PROTEGEMOI2026";
  const langSel=document.getElementById('langSel');
  const t=k=>I18N[langSel.value][k];
  function tr(){
    document.querySelectorAll('[data-i18n]').forEach(el=>el.innerHTML=t(el.getAttribute('data-i18n')));
    document.getElementById('visionHtml').innerHTML=t('vision_html');
    const ph=document.querySelector('[data-i18n-ph="placeholder"]'); if(ph) ph.placeholder=t('placeholder');
    updatePrices();
  }
  // pricing
  const toggle=document.getElementById('togglePlan');
  const promoInput=document.getElementById('promo');
  const applyBtn=document.getElementById('apply');
  const msg=document.getElementById('promoMsg');
  const cards=[...document.querySelectorAll('#cards .card')];
  let promoOk=false;
  const eur=v=>{const s=v.toFixed(2);return (I18N[langSel.value].comma?s.replace('.',','):s)+' €';};
  function updatePrices(){
    cards.forEach(c=>{const base=parseFloat(toggle.checked?c.dataset.year:c.dataset.month);
      const priceEl=c.querySelector('.price'); const strikeEl=c.querySelector('.strike');
      if(promoOk){strikeEl.textContent=eur(base); strikeEl.style.visibility='visible';
        priceEl.textContent=eur(base*0.5)+(toggle.checked?t('per_year'):t('per_month'));
      } else {strikeEl.style.visibility='hidden';
        priceEl.textContent=eur(base)+(toggle.checked?t('per_year'):t('per_month'));}
    });
    ['plan1','plan2','plan3'].forEach(k=>{
      const el=document.querySelector(`[data-i18n="{}"]`);});
  }
  applyBtn.addEventListener('click',()=>{promoOk=(promoInput.value||'').trim().toUpperCase()===CODE;
    msg.textContent=promoOk?t('applied'):t('invalid'); msg.style.color=promoOk?'green':'#b91c1c'; updatePrices();});
  toggle.addEventListener('change',updatePrices);
  langSel.addEventListener('change',tr);
  tr();

  // simple slider autoplay (2s)
  const track=document.getElementById('track');
  const dotsWrap=document.getElementById('dots');
  const slides=[...track.children];
  let i=0;
  slides.forEach((_,idx)=>{const b=document.createElement('button'); if(idx===0)b.classList.add('active');
    b.addEventListener('click',()=>{i=idx;updateSlide();}); dotsWrap.appendChild(b);});
  function updateSlide(){track.style.transform=`translateX(-${i*100}%)`;
    dotsWrap.querySelectorAll('button').forEach((b,idx)=>b.classList.toggle('active',idx===i));}
  setInterval(()=>{i=(i+1)%slides.length; updateSlide();},2000);
})();
