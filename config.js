window.PM_CONFIG = {
  // ==== 🔑 FIREBASE CONFIG ====
  apiKey: "AIzaSy…",                     // fourni par Firebase console
  authDomain: "protegemoisafe.firebaseapp.com",  // fourni par Firebase
  projectId: "protegemoisafe",           // ton ID projet Firebase
  storageBucket: "protegemoisafe.appspot.com",   // ton bucket
  messagingSenderId: "1234567890",       // fourni par Firebase
  appId: "1:1234567890:web:abcdef123456", // fourni par Firebase
  measurementId: "G-XXXXXXX",            // optionnel (Google Analytics)

  // ==== 🔔 NOTIFICATIONS (FCM) ====
  vapidKey: "BH44s4dBIABRpnCiGj6AiafCEyhx1TuDJkl0zkc4Qso-OX7289han21offD-EX4MtpnPLZszMewBjfz8i5Kp780", // Firebase > Cloud Messaging > Clé publique Web Push

  // ==== 💳 STRIPE PRICES ====
  prices: {
    oneChild: "price_123ABC",      // Stripe Price ID pour 1 enfant
    twoChildren: "price_456DEF",   // Stripe Price ID pour 2 enfants
    threeChildren: "price_789GHI"  // Stripe Price ID pour 3 enfants
  }
};