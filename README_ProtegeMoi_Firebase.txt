
ProtègeMoi — Firebase Functions + Dashboard (v1)
===============================================
Date: 2025-08-13T01:00:47.866449Z

Contenu:
- functions/ (TypeScript)
  - Callable: sendParentAlert (fan-out FCM)
  - HTTP: listAlerts (exposition JSON des 100 dernières alertes — à protéger)
- dashboard/ (site Hosting)
  - index.html (auth email/password, liste d'alertes basique)
- firestore.rules
- firebase.json

Installation (rapide):
1) Installer Firebase CLI:  npm i -g firebase-tools
2) Se connecter:            firebase login
3) Initialiser projet:      firebase init (Functions + Hosting + Firestore)
4) Dans functions/:         npm install && npm run build
5) Emulateurs (local):      firebase emulators:start
6) Déploiement:             firebase deploy

Intégration app mobile:
- Côté Flutter, appelez la Cloud Function sendParentAlert (HttpsCallable) avec:
  { level, categories, severity, snippet, convoId, parentTokens }
- Stockez les tokens FCM des parents dans votre backend (jamais côté enfant).

Sécurité / vie privée (IMPORTANT):
- Masquer le contenu: envoyez uniquement un snippet masqué (déjà géré côté app).
- Limiter l'accès à /api/alerts aux admins (via Hosting rewrites + Auth/IAM).
- Durée de rétention Firestore courte (ex. 14 jours) + tâche de purge (cron).



[Update 2025-08-13] Rétention des alertes mise à 14 jours.
