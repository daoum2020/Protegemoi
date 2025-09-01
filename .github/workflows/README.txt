# ProtègeMoi — ALL IN ONE

Ce pack ajoute : landing, abonnements (FR/EN/ES), légales, contact, favicon/logo, et `config.js` DÉJÀ REMPLI avec ta config Firebase.

## Installation
1) Mets **tous les fichiers** à la racine de ton site (au même niveau que ton index actuel).
2) Ajoute des liens depuis ton app vers `landing.html` et `subscription.html`.
3) Ouvre `landing.html?lang=fr` pour tester.
4) (Optionnel) remplace l’ID Formspree dans `contact.html`.

## i18n
- `js/lang.merge.js` charge `locales/<lang>.json` si présent (optionnel) + `locales/<lang>.plans.json` (fourni) et remplace les `data-i18n`.
- Tu peux compléter tes fichiers `locales/*.json` en copiant le bloc `plans` depuis `locales/*.plans.json`.
