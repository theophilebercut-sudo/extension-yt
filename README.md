# Gardien YouTube — Extension Brave/Chrome (V2)

Une extension qui introduit une **friction intentionnelle** avant chaque nouvelle visite sur YouTube. Elle t'oblige à formuler consciemment pourquoi tu y vas, avant de te laisser entrer.

---

## Comment ca fonctionne

### Ce qui se passe quand tu ouvres YouTube

1. La page YouTube est **immédiatement remplacée** par un écran de blocage.
2. Un **compte à rebours de 10 secondes** s'affiche — pendant ce temps, aucun champ ne s'affiche. Tu ne peux pas contourner la pause.
3. Une fois le décompte terminé, **un champ de texte apparaît**.
4. Tu dois taper l'une des phrases acceptées (voir la liste ci-dessous).
5. Si la phrase est correcte → tu accèdes à YouTube et tu peux **naviguer librement** (changer de vidéo, cliquer sur des liens) sans être re-bloqué.
6. Le blocage se **réactive** uniquement si tu quittes YouTube (autre site, fermeture de l'onglet, réouverture).

### Règles de validation

La comparaison est **tolérante** : les majuscules, les espaces en début/fin, et la ponctuation finale sont ignorés.

Exemples qui fonctionnent tous pour la même phrase :
- `pour apprendre des choses`
- `Pour apprendre des choses.`
- `  POUR APPRENDRE DES CHOSES  `

---

## Phrases acceptées

Voici la liste des phrases que tu peux taper pour entrer sur YouTube.
Pour en ajouter ou en retirer, modifie le tableau `PHRASES_ACCEPTEES` dans `blocker.js`.

```
"pour apprendre des choses"
"apprendre"
"pour apprendre"
"musique"
"pour suivre une formation"
"pour regarder une vidéo éducative"
"je regarde une vidéo précise"
"j'apprends quelque chose"
```

---

## Structure des fichiers

```
extension-yt/
├── manifest.json   — Configuration de l'extension (le "passeport" du navigateur)
├── background.js   — Script de fond : surveille les onglets et gère les déverrouillages
├── blocker.html    — La page de blocage affichée à l'utilisateur
├── blocker.js      — La logique : timer, validation des phrases, signal de déverrouillage
└── blocker.css     — Le style visuel : minimaliste, sobre, sans distraction
```

---

## Installer l'extension dans Brave (ou Chrome)

1. Ouvre le navigateur et va à l'adresse : `brave://extensions` (ou `chrome://extensions`)
2. Active le **Mode développeur** — le bouton est en haut à droite de la page
3. Clique sur **Charger l'extension non empaquetée**
4. Sélectionne le dossier `extension-yt` (le dossier qui contient `manifest.json`)
5. L'extension apparaît dans la liste — elle est active immédiatement

### Mettre à jour l'extension après une modification de code

Après avoir modifié un fichier (par exemple pour changer les phrases dans `blocker.js`) :

1. Retourne sur `brave://extensions`
2. Clique sur l'icône **recharger** (la flèche circulaire) à côté de l'extension Gardien YouTube
3. La nouvelle version est active

---

## Modifier les phrases acceptées

Ouvre le fichier `blocker.js` et repère ce bloc au début du fichier :

```js
const PHRASES_ACCEPTEES = [
  "pour apprendre des choses",
  "pour me divertir consciemment",
  // ...
];
```

- **Ajouter une phrase** : ajoute une ligne `"ta nouvelle phrase",` dans la liste
- **Supprimer une phrase** : supprime la ligne correspondante
- **Enregistre le fichier**, puis recharge l'extension dans le navigateur (voir ci-dessus)

---

## Choix techniques (V2)

- **Pas de base de données** : aucune donnée n'est enregistrée, aucune donnée n'est envoyée sur internet. L'extension fonctionne entièrement en local.
- **Pas de librairies externes** : uniquement du JavaScript, HTML et CSS natifs.
- **Le timer bloque réellement le champ** : le champ de saisie est caché jusqu'à la fin du décompte, il est impossible de le contourner.
- **Navigation libre après validation** : une fois la phrase validée, l'onglet est "déverrouillé". Cliquer sur des vidéos ne re-déclenche pas le blocage. Il ne se réactive que lors d'un nouveau chargement de YouTube.
