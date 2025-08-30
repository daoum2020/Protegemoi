# Déploiement GitHub Pages — ProtègeMoi

## Étapes
1. Crée un dépôt **public** sur GitHub (ex: `protege-moi`).  
2. Upload **tous les fichiers** de ce dossier à la **racine** du dépôt (`index.html`, `subscription.html`, etc.).  
3. Dans **Settings → Pages** :  
   - Source: **Deploy from a branch**  
   - Branch: **main** • Folder: **/** (root)  
4. Ouvre l’URL : `https://<ton-pseudo>.github.io/protege-moi/`

## Notes
- Le Service Worker est enregistré en **chemin relatif** (`./firebase-messaging-sw.js`) pour fonctionner sous `/USERNAME/REPO/`.  
- Le cache PWA reconnaît les assets via un test **endsWith** du chemin (compatible GitHub Pages).  
- Les notifications FCM nécessitent HTTPS (OK sur GitHub Pages) et une config `config.js` correcte (apiKey, projectId, vapidKey, etc.).
