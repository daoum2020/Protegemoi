const translations = {
  fr: {
    brand: "ProtègeMoi",
    welcome: "Bienvenue sur ProtègeMoi",
    welcome_desc: "Surveillez et recevez des alertes en temps réel. Cliquez sur « Entrer » pour afficher le tableau de bord ci‑dessous.",
    enter: "Entrer",
    signup_title: "Restez informé",
    signup_desc: "Laissez votre email pour être prévenu du lancement.",
    email: "Email",
    btn_notify: "Prévenez‑moi",
    menu_home: "Accueil",
    menu_dashboard: "Tableau de bord",
    menu_settings: "Paramètres",
    menu_stats: "Statistiques",
    menu_billing: "Abonnement",
    menu_login: "Connexion",
    menu_link_child: "Lier un enfant",
    lang_label: "Langue",
    copyright: "ProtègeMoi"
  },
  en: {
    brand: "ProtectMe",
    welcome: "Welcome to ProtectMe",
    welcome_desc: "Monitor and receive real-time alerts. Click 'Enter' to view the dashboard below.",
    enter: "Enter",
    signup_title: "Stay informed",
    signup_desc: "Leave your email to be notified of the launch.",
    email: "Email",
    btn_notify: "Notify me",
    menu_home: "Home",
    menu_dashboard: "Dashboard",
    menu_settings: "Settings",
    menu_stats: "Statistics",
    menu_billing: "Subscription",
    menu_login: "Login",
    menu_link_child: "Link a child",
    lang_label: "Language",
    copyright: "ProtectMe"
  },
  es: {
    brand: "Protégeme",
    welcome: "Bienvenido a Protégeme",
    welcome_desc: "Supervisa y recibe alertas en tiempo real. Haz clic en 'Entrar' para ver el panel de control a continuación.",
    enter: "Entrar",
    signup_title: "Mantente informado",
    signup_desc: "Deja tu correo para ser notificado del lanzamiento.",
    email: "Correo electrónico",
    btn_notify: "Avísame",
    menu_home: "Inicio",
    menu_dashboard: "Panel",
    menu_settings: "Configuración",
    menu_stats: "Estadísticas",
    menu_billing: "Suscripción",
    menu_login: "Conexión",
    menu_link_child: "Vincular un niño",
    lang_label: "Idioma",
    copyright: "Protégeme"
  }
};

function setLang(lang, save=false) {
  if (!translations[lang]) return;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  if (save) localStorage.setItem("lang", lang);
}

// Charger la langue sauvegardée ou par défaut FR
document.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem("lang") || "fr";
  setLang(lang);
  const langSelect = document.getElementById("lang");
  if (langSelect) langSelect.value = lang;
});
