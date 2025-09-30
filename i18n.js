/**
 * ProtègeMoi - Enhanced Internationalization System
 * Improved structure, performance, and accessibility
 */

class I18nManager {
  constructor() {
    this.currentLang = 'fr';
    this.fallbackLang = 'fr';
    this.translations = {};
    this.observers = [];
    this.rtlLanguages = ['ar', 'he', 'fa'];
    
    this.init();
  }

  init() {
    this.loadTranslations();
    this.setupLanguageDetection();
    this.setupLanguageSelector();
    this.setupMutationObserver();
    this.applyInitialLanguage();
  }

  /**
   * Load all translations with enhanced structure
   */
  loadTranslations() {
    this.translations = {
      fr: {
        // Navigation & Header
        brand: "ProtègeMoi",
        menu_home: "Fonctionnement",
        menu_features: "Fonctionnalités clés",
        menu_billing: "Abonnements",
        menu_contact: "Contact",
        lang_label: "Langue",
        skip_to_content: "Aller au contenu principal",

        // Hero Section
        "hero.title": "Obtenez des informations importantes sur la vie de votre enfant",
        "hero.desc": "ProtègeMoi vous fait gagner du temps et vous procure une tranquillité d'esprit en surveillant les textos, les réseaux sociaux et les contenus en ligne de votre enfant pour vous alerter des éventuels dangers.",
        "hero.alert": "Des problèmes sont présents sur les comptes de votre enfant. Affichez-les maintenant.",
        hero_cta_main: "Découvrir les abonnements",
        hero_cta_secondary: "Voir comment ça marche",

        // Vision Section
        "vision.title": "Notre vision",
        "vision.body": "Chez ProtègeMoi, nous croyons que chacun mérite une protection numérique intelligente et accessible. Que vous soyez un parent soucieux de la sécurité en ligne de vos enfants, un adolescent qui apprend à poser des limites avec la technologie, un jeune adulte confronté aux pressions du monde digital ou encore un senior en quête de sérénité, nos solutions de sécurité évoluent avec vous à chaque étape de la vie.",

        // How it works
        how_title: "Comment ProtègeMoi fonctionne",
        how_c1_title: "Surveillance intelligente",
        how_c1_desc: "Analyse des messages, recherches, images, vidéos et audio pour détecter cyberharcèlement, pornographie, drogues, sextorsion, etc.",
        how_c2_title: "Alertes IA actionnables",
        how_c2_desc: "Recevez des alertes claires avec contexte et conseils pour agir rapidement.",
        how_c3_title: "Rapports & insights",
        how_c3_desc: "Tableau de bord avec tendances, heures d'usage, applis les plus utilisées et recommandations personnalisées.",

        // Features
        features_title: "Fonctionnalités clés",
        features_lead: "Découvrez toutes les fonctionnalités qui font de ProtègeMoi la solution de contrôle parental la plus complète.",
        features_caption: "Interface complète de ProtègeMoi montrant toutes les fonctionnalités de surveillance et de protection.",

        // Pricing
        pricing_title: "Abonnements",
        pricing_promo: "Promotion",
        pricing_toggle_monthly: "Mensuel",
        pricing_toggle_yearly: "Annuel",
        pricing_badge_yearly: "-17%",
        plan_1_title: "1 enfant",
        plan_2_title: "2 enfants",
        plan_3_title: "3 enfants",
        plan_cta_1: "Souscrire",
        plan_cta_2: "Souscrire",
        plan_cta_3: "Souscrire",
        pricing_note: "Annuel = -17% déjà appliqué. Abonnement résiliable à tout moment.",

        // Contact
        contact_title: "Contactez-nous",
        contact_desc: "Notre équipe est à votre écoute pour toute question ou demande d'information.",
        contact_button: "Envoyer un message",

        // Footer
        footer_rights: "Tous droits réservés.",

        // Accessibility
        menu_toggle_label: "Ouvrir le menu de navigation",
        billing_toggle_monthly: "Facturation mensuelle sélectionnée",
        billing_toggle_yearly: "Facturation annuelle sélectionnée",
        language_changed: "Langue changée vers le français"
      },

      en: {
        // Navigation & Header
        brand: "ProtectMe",
        menu_home: "How it works",
        menu_features: "Key features",
        menu_billing: "Pricing",
        menu_contact: "Contact",
        lang_label: "Language",
        skip_to_content: "Skip to main content",

        // Hero Section
        "hero.title": "Get important insights into your child's online life",
        "hero.desc": "ProtectMe saves you time and brings peace of mind by monitoring texts, social networks and online content to alert you to potential dangers.",
        "hero.alert": "Issues have been detected on your child's accounts. View them now.",
        hero_cta_main: "View plans",
        hero_cta_secondary: "See how it works",

        // Vision Section
        "vision.title": "Our vision",
        "vision.body": "At ProtectMe, we believe everyone deserves smart and accessible digital protection. Whether you are a parent focused on your children's online safety, a teen learning to set healthy boundaries with technology, a young adult facing the pressures of the digital world, or a senior seeking peace of mind, our security solutions evolve with you at every stage of life.",

        // How it works
        how_title: "How ProtectMe works",
        how_c1_title: "Smart monitoring",
        how_c1_desc: "Analyzes messages, searches, images, video and audio to detect cyberbullying, pornography, drugs, sextortion, etc.",
        how_c2_title: "Actionable AI alerts",
        how_c2_desc: "Get clear alerts with context and guidance so you can act quickly.",
        how_c3_title: "Reports & insights",
        how_c3_desc: "Dashboard with trends, usage hours, top apps and personalized recommendations.",

        // Features
        features_title: "Key features",
        features_lead: "Discover all the features that make ProtectMe the most comprehensive parental control solution.",
        features_caption: "Complete ProtectMe interface showing all monitoring and protection features.",

        // Pricing
        pricing_title: "Pricing",
        pricing_promo: "Promo",
        pricing_toggle_monthly: "Monthly",
        pricing_toggle_yearly: "Yearly",
        pricing_badge_yearly: "-17%",
        plan_1_title: "1 child",
        plan_2_title: "2 children",
        plan_3_title: "3 children",
        plan_cta_1: "Subscribe",
        plan_cta_2: "Subscribe",
        plan_cta_3: "Subscribe",
        pricing_note: "Yearly = -17% already applied. Cancel anytime.",

        // Contact
        contact_title: "Contact us",
        contact_desc: "Our team is here to answer any question or request.",
        contact_button: "Send a message",

        // Footer
        footer_rights: "All rights reserved.",

        // Accessibility
        menu_toggle_label: "Open navigation menu",
        billing_toggle_monthly: "Monthly billing selected",
        billing_toggle_yearly: "Yearly billing selected",
        language_changed: "Language changed to English"
      },

      es: {
        // Navigation & Header
        brand: "Protégeme",
        menu_home: "Cómo funciona",
        menu_features: "Funciones clave",
        menu_billing: "Planes",
        menu_contact: "Contacto",
        lang_label: "Idioma",
        skip_to_content: "Ir al contenido principal",

        // Hero Section
        "hero.title": "Obtenga información importante sobre la vida en línea de su hijo",
        "hero.desc": "Protégeme le ahorra tiempo y le da tranquilidad al supervisar mensajes, redes sociales y contenido en línea para alertarle de posibles peligros.",
        "hero.alert": "Se han detectado problemas en las cuentas de su hijo. Mírelos ahora.",
        hero_cta_main: "Ver planes",
        hero_cta_secondary: "Ver cómo funciona",

        // Vision Section
        "vision.title": "Nuestra visión",
        "vision.body": "En Protégeme creemos que todos merecen una protección digital inteligente y accesible. Ya sea que seas un padre preocupado por la seguridad en línea de tus hijos, un adolescente que aprende a poner límites con la tecnología, un joven adulto que enfrenta las presiones del mundo digital o un senior que busca tranquilidad, nuestras soluciones de seguridad evolucionan contigo en cada etapa de la vida.",

        // How it works
        how_title: "Cómo funciona Protégeme",
        how_c1_title: "Supervisión inteligente",
        how_c1_desc: "Analiza mensajes, búsquedas, imágenes, vídeos y audio para detectar ciberacoso, pornografía, drogas, sextorsión, etc.",
        how_c2_title: "Alertas de IA accionables",
        how_c2_desc: "Recibe alertas claras con contexto y consejos para actuar rápidamente.",
        how_c3_title: "Informes e insights",
        how_c3_desc: "Panel con tendencias, horas de uso, apps más usadas y recomendaciones personalizadas.",

        // Features
        features_title: "Funciones clave",
        features_lead: "Descubre todas las funciones que hacen de Protégeme la solución de control parental más completa.",
        features_caption: "Interfaz completa de Protégeme mostrando todas las funciones de supervisión y protección.",

        // Pricing
        pricing_title: "Planes",
        pricing_promo: "Promoción",
        pricing_toggle_monthly: "Mensual",
        pricing_toggle_yearly: "Anual",
        pricing_badge_yearly: "-17%",
        plan_1_title: "1 niño",
        plan_2_title: "2 niños",
        plan_3_title: "3 niños",
        plan_cta_1: "Suscribirse",
        plan_cta_2: "Suscribirse",
        plan_cta_3: "Suscribirse",
        pricing_note: "Anual = -17% aplicado. Cancela cuando quieras.",

        // Contact
        contact_title: "Contáctanos",
        contact_desc: "Nuestro equipo está aquí para responder a cualquier pregunta o solicitud.",
        contact_button: "Enviar un mensaje",

        // Footer
        footer_rights: "Todos los derechos reservados.",

        // Accessibility
        menu_toggle_label: "Abrir menú de navegación",
        billing_toggle_monthly: "Facturación mensual seleccionada",
        billing_toggle_yearly: "Facturación anual seleccionada",
        language_changed: "Idioma cambiado a español"
      },

      nl: {
        // Navigation & Header
        brand: "BeschermMij",
        menu_home: "Werking",
        menu_features: "Belangrijkste functies",
        menu_billing: "Abonnementen",
        menu_contact: "Contact",
        lang_label: "Taal",
        skip_to_content: "Ga naar hoofdinhoud",

        // Hero Section
        "hero.title": "Ontvang belangrijke informatie over het online leven van uw kind",
        "hero.desc": "BeschermMij bespaart u tijd en geeft gemoedsrust door berichten, sociale netwerken en online inhoud te monitoren om u voor mogelijke gevaren te waarschuwen.",
        "hero.alert": "Er zijn problemen gedetecteerd op de accounts van uw kind. Bekijk ze nu.",
        hero_cta_main: "Abonnementen bekijken",
        hero_cta_secondary: "Zie hoe het werkt",

        // Vision Section
        "vision.title": "Onze visie",
        "vision.body": "Bij BeschermMij vinden we dat iedereen recht heeft op slimme en toegankelijke digitale bescherming. Of u nu een ouder bent die zich zorgen maakt over de online veiligheid van uw kinderen, een tiener die leert grenzen te stellen aan technologie, een jongvolwassene die de druk van de digitale wereld ervaart of een senior die op zoek is naar gemoedsrust — onze beveiligingsoplossingen groeien met u mee in elke levensfase.",

        // How it works
        how_title: "Hoe BeschermMij werkt",
        how_c1_title: "Slimme monitoring",
        how_c1_desc: "Analyse van berichten, zoekopdrachten, afbeeldingen, video en audio om cyberpesten, pornografie, drugs, sextortion, enz. te detecteren.",
        how_c2_title: "Actiegerichte AI-meldingen",
        how_c2_desc: "Ontvang duidelijke waarschuwingen met context en advies om snel te handelen.",
        how_c3_title: "Rapporten & inzichten",
        how_c3_desc: "Dashboard met trends, gebruiksuren, meest gebruikte apps en persoonlijke aanbevelingen.",

        // Features
        features_title: "Belangrijkste functies",
        features_lead: "Ontdek alle functies die BeschermMij de meest complete ouderlijke controle-oplossing maken.",
        features_caption: "Complete BeschermMij interface met alle monitoring- en beschermingsfuncties.",

        // Pricing
        pricing_title: "Abonnementen",
        pricing_promo: "Promotie",
        pricing_toggle_monthly: "Maandelijks",
        pricing_toggle_yearly: "Jaarlijks",
        pricing_badge_yearly: "-17%",
        plan_1_title: "1 kind",
        plan_2_title: "2 kinderen",
        plan_3_title: "3 kinderen",
        plan_cta_1: "Abonneren",
        plan_cta_2: "Abonneren",
        plan_cta_3: "Abonneren",
        pricing_note: "Jaarlijks = -17% reeds toegepast. Op elk moment opzegbaar.",

        // Contact
        contact_title: "Neem contact met ons op",
        contact_desc: "Ons team staat klaar om al uw vragen of verzoeken te beantwoorden.",
        contact_button: "Bericht sturen",

        // Footer
        footer_rights: "Alle rechten voorbehouden.",

        // Accessibility
        menu_toggle_label: "Navigatiemenu openen",
        billing_toggle_monthly: "Maandelijkse facturering geselecteerd",
        billing_toggle_yearly: "Jaarlijkse facturering geselecteerd",
        language_changed: "Taal gewijzigd naar Nederlands"
      }
    };
  }

  /**
   * Setup automatic language detection
   */
  setupLanguageDetection() {
    // Check URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    
    if (urlLang && this.translations[urlLang]) {
      this.currentLang = urlLang;
      return;
    }

    // Check localStorage
    const savedLang = localStorage.getItem('protegemoi_lang');
    if (savedLang && this.translations[savedLang]) {
      this.currentLang = savedLang;
      return;
    }

    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (this.translations[browserLang]) {
      this.currentLang = browserLang;
      return;
    }

    // Fallback to default
    this.currentLang = this.fallbackLang;
  }

  /**
   * Setup enhanced language selector
   */
  setupLanguageSelector() {
    const langSelect = document.getElementById('lang');
    if (!langSelect) return;

    // Set initial value
    langSelect.value = this.currentLang;

    // Handle language change
    langSelect.addEventListener('change', (e) => {
      const newLang = e.target.value;
      this.setLanguage(newLang, true);
    });
  }

  /**
   * Setup mutation observer for dynamic content
   */
  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.translateElement(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Apply initial language
   */
  applyInitialLanguage() {
    this.setLanguage(this.currentLang, false);
  }

  /**
   * Set language with enhanced features
   */
  setLanguage(lang, save = false) {
    if (!this.translations[lang]) {
      console.warn(`Language '${lang}' not found, falling back to '${this.fallbackLang}'`);
      lang = this.fallbackLang;
    }

    const previousLang = this.currentLang;
    this.currentLang = lang;

    // Update document language
    document.documentElement.lang = lang;

    // Update text direction for RTL languages
    document.documentElement.dir = this.rtlLanguages.includes(lang) ? 'rtl' : 'ltr';

    // Translate all elements
    this.translateAllElements();

    // Update language selector
    const langSelect = document.getElementById('lang');
    if (langSelect && langSelect.value !== lang) {
      langSelect.value = lang;
    }

    // Save to localStorage if requested
    if (save) {
      localStorage.setItem('protegemoi_lang', lang);
      
      // Update URL parameter
      const url = new URL(window.location);
      url.searchParams.set('lang', lang);
      history.replaceState(null, '', url.toString());
    }

    // Announce language change to screen readers
    if (previousLang !== lang) {
      this.announceLanguageChange(lang);
    }

    // Notify observers
    this.notifyObservers(lang, previousLang);
  }

  /**
   * Translate all elements with data-i18n attribute
   */
  translateAllElements() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      this.translateElement(element);
    });
  }

  /**
   * Translate a single element
   */
  translateElement(element) {
    const elements = element.querySelectorAll ? 
      [element, ...element.querySelectorAll('[data-i18n]')] : 
      [element];

    elements.forEach(el => {
      if (!el.hasAttribute || !el.hasAttribute('data-i18n')) return;

      const key = el.getAttribute('data-i18n');
      const translation = this.getTranslation(key);

      if (translation) {
        // Handle different element types
        if (el.tagName === 'INPUT' && (el.type === 'submit' || el.type === 'button')) {
          el.value = translation;
        } else if (el.tagName === 'INPUT' && el.placeholder !== undefined) {
          el.placeholder = translation;
        } else if (el.hasAttribute('aria-label')) {
          el.setAttribute('aria-label', translation);
        } else {
          el.textContent = translation;
        }
      }
    });
  }

  /**
   * Get translation with fallback
   */
  getTranslation(key) {
    const currentTranslations = this.translations[this.currentLang];
    const fallbackTranslations = this.translations[this.fallbackLang];

    return currentTranslations[key] || fallbackTranslations[key] || key;
  }

  /**
   * Announce language change to screen readers
   */
  announceLanguageChange(lang) {
    const messages = {
      fr: 'Langue changée vers le français',
      en: 'Language changed to English',
      es: 'Idioma cambiado a español',
      nl: 'Taal gewijzigd naar Nederlands'
    };

    const message = messages[lang] || messages[this.fallbackLang];
    
    // Use the app's announcement system if available
    if (window.protegemoiApp && window.protegemoiApp.announceToScreenReader) {
      window.protegemoiApp.announceToScreenReader(message);
    } else {
      // Fallback announcement method
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.style.position = 'absolute';
      announcement.style.left = '-10000px';
      announcement.textContent = message;
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }

  /**
   * Add language change observer
   */
  addObserver(callback) {
    this.observers.push(callback);
  }

  /**
   * Remove language change observer
   */
  removeObserver(callback) {
    const index = this.observers.indexOf(callback);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  /**
   * Notify all observers of language change
   */
  notifyObservers(newLang, previousLang) {
    this.observers.forEach(callback => {
      try {
        callback(newLang, previousLang);
      } catch (error) {
        console.error('Error in language change observer:', error);
      }
    });
  }

  /**
   * Get current language
   */
  getCurrentLanguage() {
    return this.currentLang;
  }

  /**
   * Get available languages
   */
  getAvailableLanguages() {
    return Object.keys(this.translations);
  }

  /**
   * Check if language is RTL
   */
  isRTL(lang = this.currentLang) {
    return this.rtlLanguages.includes(lang);
  }
}

// Initialize i18n system
const i18nManager = new I18nManager();

// Legacy function for backward compatibility
function setLang(lang, save = false) {
  i18nManager.setLanguage(lang, save);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { I18nManager, i18nManager };
}

// Make available globally
window.i18nManager = i18nManager;
window.setLang = setLang;
