# ProtègeMoi — Site Complet (Package)

Ce dossier contient l'application web (pages publiques + abonnement), les règles Firestore et les outils admin.

## 1) Configuration rapide

Édite `config.js` et vérifie :
```js
window.PM_CONFIG = {
  apiKey: "AIza...",
  authDomain: "xxx.firebaseapp.com",
  projectId: "xxx",
  appId: "1:...:web:...",
  messagingSenderId: "1234567890",

  // Emails autorisés pour la console (settings/admin)
  adminEmails: ["toi@domaine.com"],

  // Stripe (IDs de prix)
  prices: {
    oneChild: "price_XXXX",
    twoChildren: "price_YYYY",
    threeChildren: "price_ZZZZ"
  }
};
```

## 2) Déployer les règles Firestore

Voir `README-RULES.md`, ou en résumé :
```bash
npm i -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

Optionnel : donner le rôle admin à un utilisateur
```bash
npm i firebase-admin
export GOOGLE_APPLICATION_CREDENTIALS=/chemin/vers/service-account.json
node admin-claims.js <UID_UTILISATEUR> true
```

## 3) Publier le site

- Héberge tout le contenu de ce dossier sur ton hébergement (GitHub Pages, Netlify, Vercel, etc.).
- Assure-toi que le domaine est bien ajouté dans **Authorized domains** de Firebase Auth.
- Restreins la clé Web dans GCP aux référers (ton domaine).

## 4) Pages clés

- `index.html` : accueil (logo + CTA Abonnements)
- `subscription.html` : offres & liaison Stripe (Cloud Function `createCheckout` → redirection Checkout)
- `settings.html` : outils (protégés par email admin via `PM_CONFIG.adminEmails`)
- `login.html` / `signup.html` / `reset.html` : Auth
- `billing.html` : boutons Stripe sans fallback dangereux

## 5) Sécurité & CSP

Les pages publiques incluent une **Content-Security-Policy** stricte.  
Si tu ajoutes d'autres scripts (reCAPTCHA, Analytics, Stripe.js…), ajuste la CSP en conséquence.

Bon déploiement 🚀
