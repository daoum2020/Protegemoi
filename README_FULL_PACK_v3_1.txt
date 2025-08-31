
ProtègeMoi — FULL PACK v3.1
===========================
Date: 2025-08-13T00:58:24.484889Z

Ce pack contient :
- assets/
  - protegemoi_keywords_v1_2.json (ancien format par catégories)
  - protegemoi_keywords_v1_3.json (liste fusionnée de 209 phrases)
  - protegemoi_patterns_v3.json (phrases + regex robustes + catégories)
  - protegemoi_regex_pack_v3.json (pack léger pour Flutter)
  - exceptions_context_v3_1.json (réduire faux positifs en contexte médical/éducatif)

- lib/services/
  - protege_moi_detector_v3.dart (moteur v3.1, regex + exceptions)
  - protege_moi_alert_service.dart (envoi backend via Cloud Functions)

- backend/
  - main_fastapi_protegemoi.py (API de revue/alertes, optionnel)

- lib/example_usage_v3.dart (exemple minimal)
- docs/PUBSPEC_SNIPPET.yaml (ajout des assets v3.1)

Intégration rapide (Flutter) :
1) Copier `assets/` et `lib/` dans votre projet.
2) Ajouter les assets dans `pubspec.yaml` (cf. docs/PUBSPEC_SNIPPET.yaml).
3) Charger et utiliser :
   final engine = await PMv3.fromAssets();
   final alert = engine.detect(messageText, convoId: chatId);
   if (alert != null) => envoyer au parent (backend/FCM).

Notes :
- v3.1 utilise des regex tolérantes (accents manquants, apostrophes variées, leet).
- Le fichier `exceptions_context_v3_1.json` abaisse la sévérité à INFO si un terme de contexte (médical/éducatif) est présent.
- Vous pouvez enrichir les exceptions à volonté.



[Update 2025-08-13] Rétention des alertes mise à 14 jours.
