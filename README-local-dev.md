# ProtègeMoi — Démarrage local rapide

## Prérequis
- Node.js v16+

## Lancer un serveur local (avec Service Worker)
```bash
npm run serve
# puis ouvrir http://localhost:5173
```

Le flag `-c-1` désactive l'etag/Cache-Control d'http-server pour voir les mises à jour.
Pense à **Actualiser avec vidage du cache** (Ctrl+F5) après une mise à jour du service worker.

## Importer les traductions depuis le CSV
```bash
npm run import-i18n
```

## Endpoints backend
- Node/Express : `backend/node-express/server.js`
- PHP : `backend/php/contact.php`

Définir `window.CONTACT_API` dans le HTML si tu veux envoyer le formulaire côté serveur.
