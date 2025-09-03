# Firestore Rules + Admin Claims (ProtègeMoi)

Ce dossier contient :
- `firestore.rules` : règles de sécurité Firestore robustes avec rôles `admin` via **custom claims**.
- `admin-claims.js` : script Node pour attribuer ou retirer le rôle admin à un compte.

## Déploiement des règles

1. **Installe la CLI Firebase** si nécessaire :
   ```bash
   npm i -g firebase-tools
   firebase login
   ```

2. **Déploie les règles** :
   ```bash
   firebase deploy --only firestore:rules
   ```
   (Assure-toi que `firebase.json` pointe bien sur `firestore.rules`)

## Rôle Admin (custom claims)

1. Crée un **service account** avec le rôle "Firebase Admin" (ou utilise les Application Default Credentials).
2. Exporte la clé JSON et définis la variable d'environnement :
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=/chemin/vers/service-account.json
   ```

3. Installe Firebase Admin :
   ```bash
   npm i firebase-admin
   ```

4. Donne le rôle admin à un utilisateur :
   ```bash
   node admin-claims.js <UID_UTILISATEUR> true
   ```

   Pour retirer le rôle :
   ```bash
   node admin-claims.js <UID_UTILISATEUR> false
   ```

> Côté client, pour **forcer la prise en compte** du nouveau claim après connexion, récupère un **ID token rafraîchi** :
```js
await firebaseAuth.currentUser.getIdToken(true);
```

## Schéma recommandé

- `users/{uid}` : profil utilisateur (lecture/écriture par le propriétaire).
- `parents/{parentId}` : racine des données parent.
  - `alerts/{alertId}` : alertes (lecture/écriture par le parent et admin).
  - `tokens/{tokenId}` : tokens FCM (lecture par parent/admin, création/maj par parent/admin).
- `children/{childId}` : **admin-only** (ou déplace sous `/parents/{parentId}/children/{childId}` si le parent doit y accéder).
- `admin/{...}` : collections strictement réservées à l’équipe.

## Tips sécurité
- Restreins la **clé Web** Firebase aux domaines de prod (console GCP).
- Ajoute un **CSP** strict dans les pages publiques.
- Loggue côté backend tout appel sensible (Stripe, SOS) + vérification ID token.

Bon déploiement !