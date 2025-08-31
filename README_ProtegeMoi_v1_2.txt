ProtègeMoi — Lexique & Détection v1.2.0
====================================

Ce pack contient :
- protegemoi_keywords_v1_2.json : règles prêtes à l'emploi (FR/EN/AR).
- protegemoi_keywords_v1_2.csv : édition rapide.
- Extensions handicap (insultes liées au handicap) avec exceptions pour réduire les faux positifs.

Intégration Flutter (résumé) :
------------------------------
1) Place ce JSON dans assets/ et charge-le.
2) Normalise le texte (minuscules, dé-accentuation, anti-leetspeak).
3) Match "phrase" avec contains() et "regex" avec RegExp.
4) Calcule "level" via severity max et thresholds (info/warn/critical).
5) Applique l'anti-spam (rate_limit_seconds) et collapse des doublons (collapse_window_seconds).
6) Envoie une notification parent via FCM/APNS.

Conseils :
- Utiliser un "jeu de test" de 200 phrases pour vérifier précision/rappel.
- Ajouter une liste "exceptions" côté app : si une phrase contient un mot médical (diagnostic, TSA…), abaisser le niveau à "info" ou ignorer.
- Journal chiffré local uniquement, purge <=30 jours.