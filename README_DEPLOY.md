# ProtègeMoi — Déploiement GitHub Pages (Checklist Express)

1) **Clés & Paiements**
   - Ouvre `config.js` et remplace tous les placeholders :
     - `firebase.apiKey`, `authDomain`, `projectId`, `appId`, `messagingSenderId`, (optionnel `storageBucket`)
     - `prices.*` (IDs Stripe Price mensuels)
     - `checkoutUrls.*` et `checkoutUrlsYearly.*` **ou** utilise la Function `createCheckout`
     - `vapidKey` (clé VAPID Web Push FCM)

2) **Cloud Functions (si utilisées)**
   - `createChild({ name, age })` → crée un document `parents/{uid}/children/{childId}`
   - `getEntitlement()` → retourne `{ maxChildren }`
   - `createCheckout({ priceId })` → retourne `{ url }` (Stripe Checkout)
   - `saveParentToken({ token })` → enregistre le token FCM dans `parents/{uid}/fcmTokens/{tokenId}`

3) **Sécurité Firestore (exemple minimal)**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }
    function isParent(uid) {
      return isSignedIn() && request.auth.uid == uid;
    }

    match /alerts/{id} {
      allow read: if isSignedIn() && resource.data.parentId == request.auth.uid;
      allow write: if isSignedIn() && request.resource.data.parentId == request.auth.uid;
    }

    match /parents/{uid}/children/{childId} {
      allow read, write: if isParent(uid);
    }
  }
}
```

4) **PWA & SEO**
   - `manifest.json`, `sw.js`, `firebase-messaging-sw.js`, `favicon-*.png`, `apple-touch-icon.png`, `sitemap.xml`, `robots.txt`
   - Dans `sitemap.xml` et `robots.txt`, remplace `YOUR_GITHUB_USERNAME` et `YOUR_REPO` par les tiens.

5) **Déploiement**
   - Mets **tous les fichiers** à la **racine** de ton repo GitHub (branche `main` ou `gh-pages`).
   - Active GitHub Pages : **Settings → Pages → Branch**.
   - Ouvre l’URL publiée ; teste :
     - Inscription/Connexion (Auth Firebase)
     - Liaison enfant (QR) (link-child.html)
     - Abonnements (Stripe)
     - Alertes temps réel (dashboard.html)
     - Notifications push (autoriser le navigateur)

> Astuce : Ajoute `?lang=fr|en|es` aux URLs pour vérifier le multilingue.
