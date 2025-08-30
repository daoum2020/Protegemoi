// ProtègeMoi - Exemple de configuration
// ⚠️ Remplace TOUTES les valeurs par celles de ton projet Firebase & Stripe

window.PM_CONFIG = {
  // Firebase configuration
  apiKey: "AIzaSyExample-FAKE-KEY-Firebase123456",
  authDomain: "protegemoisafe.firebaseapp.com",
  projectId: "protegemoisafe",
  storageBucket: "protegemoisafe.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-XXXXXXX",

  // Notifications Web Push (Firebase Cloud Messaging)
  vapidKey: "BKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",

  // Stripe Price IDs
  prices: {
    oneChild: "price_1CHILD_FAKEID",
    twoChildren: "price_2CHILDREN_FAKEID",
    threeChildren: "price_3CHILDREN_FAKEID"
  }
}
