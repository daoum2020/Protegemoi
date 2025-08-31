// === ProtègeMoi — Configuration Production (GitHub Pages) ===
// Remplace les IDs Stripe 'price_xxx' par les tiens dans le Dashboard Stripe.
window.PM_CONFIG = {
  firebase: {
    apiKey: "AIzaSyBIAJIfsh_cj-qUtqDYwjLAdDMcnTsLUpU",
    authDomain: "protegemoi-ec5a9.firebaseapp.com",
    projectId: "protegemoi-ec5a9",
    appId: "1:690907366325:ios:c316da54297222dc220ffc",
    messagingSenderId: "690907366325",
    storageBucket: "protegemoi-ec5a9.appspot.com"
  },

  // IDs Stripe — MENSUEL
  // 1 enfant: 9,99 €/mois | 2 enfants: 13,99 €/mois | 3 enfants: 17,99 €/mois
  pricesMonthly: {
    oneChild:   "price_month_1_child",   // 9,99 €/mois
    twoChildren:"price_month_2_children",// 13,99 €/mois
    threeChildren:"price_month_3_children" // 17,99 €/mois
  },

  // IDs Stripe — ANNUEL (–17 %)
  // 1 enfant: 99 €/an | 2 enfants: 139 €/an | 3 enfants: 169 €/an
  pricesYearly: {
    oneChild:   "price_year_1_child",     // 99 €/an
    twoChildren:"price_year_2_children",  // 139 €/an
    threeChildren:"price_year_3_children" // 169 €/an
  },

  // Clé publique Web Push FCM (VAPID)
  vapidKey: "BH44s4dBIABRpnCiGj6AiafCEyhx1TuDJkl0zkc4Qso-OX7289han21offDEX4MtpmPLZszMewBjfz8i5Kp780",

  // Région Cloud Functions
  functionsRegion: "europe-west1",

  // Nom & support
  brand: {
    name: "ProtègeMoi",
    supportEmail: "support@votredomaine.com"
  }
};
