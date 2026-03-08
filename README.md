# CLAUDE.md — Extension Brave : Gardien YouTube

## 🎯 Présentation du projet

Je construis une extension pour le navigateur Brave (compatible Chrome) appelée **Gardien YouTube**.

Son objectif : m'aider à reprendre le contrôle de mon utilisation de YouTube en introduisant une **friction intentionnelle** — une courte pause réflexive avant chaque visite.

---

## 👤 Profil du développeur

- **Niveau** : Débutant complet en programmation
- **Besoin** : Tu dois **écrire le code à ma place** ET **m'expliquer ce que tu fais** à chaque étape
- **Style d'explication** : Utilise des analogies simples et du vocabulaire accessible
- **Objectif d'apprentissage** : Je veux comprendre ce que je construis, pas juste copier-coller

---

## ⚙️ Fonctionnement de l'extension

### Déclencheur
Dès que j'ouvre un onglet sur `youtube.com` (ou `www.youtube.com`), la page est **immédiatement bloquée** et remplacée par un écran d'intention.

### Écran de blocage — flux utilisateur

1. **Afficher la question** : « Pour quelle utilisation te rends-tu sur ce site ? »
2. **Timer de 10 secondes** : Un compte à rebours visible. L'utilisateur ne peut pas répondre avant la fin. Cela force une vraie pause de réflexion.
3. **Champ de saisie** : Une fois le timer écoulé, un champ texte apparaît.
4. **Validation** :
   - La comparaison doit être **tolérante** : ignorer la casse (majuscules/minuscules), les espaces en début/fin, et la ponctuation finale (point, etc.). Ainsi `"pour apprendre des choses"` et `"Pour apprendre des choses."` sont tous les deux acceptés.
   - ✅ Si la phrase saisie correspond à `"pour apprendre des choses"` (après normalisation) → accès accordé, YouTube se charge
   - ❌ Si la phrase est incorrecte → afficher un message bienveillant (ex : *"Ce n'est pas tout à fait ça. Prends un moment, puis réessaie."*) et recommencer depuis l'étape 1
5. **Historique** : Chaque visite validée est enregistrée dans une base de données **Supabase** avec la date et l'heure (pour suivre ses habitudes)

### Ton de l'interface
- **Minimaliste et sobre** : fond blanc ou gris clair, typographie simple, aucune distraction visuelle
- Pas d'images, pas de couleurs vives, pas d'animations inutiles

---

## 📁 Structure des fichiers du projet

```
gardien-youtube/
├── manifest.json          # Configuration de l'extension (le "passeport" de l'extension)
├── background.js          # Script qui surveille les onglets ouverts
├── blocker.html           # La page de blocage affichée à l'utilisateur
├── blocker.js             # La logique de la page de blocage (timer, validation, historique)
├── blocker.css            # Le style visuel de la page de blocage
└── historique.html        # (optionnel) Page pour consulter l'historique des visites
```

---

## 📐 Règles de code

- **Simplicité avant tout** : Préférer le code simple et lisible, même s'il est moins optimisé
- **Commentaires obligatoires** : Chaque fonction doit avoir un commentaire qui explique ce qu'elle fait en français
- **Pas de librairies externes** : Uniquement du JavaScript, HTML et CSS natifs — aucun framework
- **Pas de serveur** : Tout fonctionne localement dans le navigateur, aucune donnée n'est envoyée sur internet
- **Stockage distant** : Utiliser **Supabase** comme base de données pour enregistrer l'historique des visites. Claude Code devra créer la table nécessaire sur Supabase et fournir les instructions de configuration (clé API, URL du projet).

---

## 🗄️ Base de données Supabase

### Table : `visites_youtube`

| Colonne | Type | Description |
|---|---|---|
| `id` | integer (auto) | Identifiant unique de chaque visite |
| `date_heure` | timestamp | Date et heure exactes de la visite validée |
| `intention` | text | La phrase saisie par l'utilisateur |

### Règles
- La table est créée par Claude Code lors de la mise en place du projet
- Chaque visite validée avec succès déclenche un insert dans cette table
- Les données ne sont jamais supprimées automatiquement

---

## 💬 Comment tu dois me parler

- **Explique avant de coder** : Dis-moi ce que tu vas faire et pourquoi, avant de montrer le code
- **Analogies bienvenues** : Compare les concepts techniques à des choses du quotidien
- **Décompose les étapes** : Une chose à la fois, pas tout d'un coup
- **Si tu modifies un fichier** : Dis-moi exactement quelle ligne tu changes et pourquoi
- **Si tu vois une meilleure façon de faire** : Propose-la, mais explique le pour et le contre

---

## 🚀 Prochaines étapes (ordre suggéré)

1. Créer le projet Supabase et la table `visites_youtube`
2. Créer le `manifest.json`
3. Créer `background.js` pour intercepter YouTube
4. Créer `blocker.html` + `blocker.css` (interface minimaliste)
5. Créer `blocker.js` (timer + validation tolérante + message d'erreur bienveillant)
6. Connecter `blocker.js` à Supabase pour enregistrer chaque visite validée
7. Tester l'extension dans Brave (mode développeur)

---

## ✅ Définition de "terminé"

L'extension est considérée comme fonctionnelle quand :
- [ ] Chaque visite sur YouTube déclenche le blocage
- [ ] Le timer de 10 secondes fonctionne correctement
- [ ] La validation est tolérante (casse, ponctuation, espaces ignorés)
- [ ] Un mauvais essai affiche un message bienveillant et recommence
- [ ] Chaque visite validée est enregistrée dans Supabase avec date/heure
- [ ] L'interface est sobre et sans distraction
