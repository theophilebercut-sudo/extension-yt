// blocker.js — Logique de la page de blocage (V2)
// Pas de base de données. Pas de tracking. Juste la friction intentionnelle.

// ─── Liste des phrases acceptées ────────────────────────────────────────────
// La comparaison est tolérante : casse, espaces et ponctuation finale ignorés.
// Tu peux ajouter ou retirer des phrases ici librement.
const PHRASES_ACCEPTEES = [
  "pour apprendre des choses",
  "apprendre",
  "pour apprendre",
  "musique",
  "pour suivre une formation",
  "pour regarder une vidéo éducative",
  "je regarde une vidéo précise",
  "j'apprends quelque chose",
];

// ─── Durée du compte à rebours (en secondes) ────────────────────────────────
const DUREE_TIMER = 10;

// ─── Récupération des éléments HTML ─────────────────────────────────────────
const timerEl = document.getElementById("timer");
const timerLabelEl = document.getElementById("timer-label");
const inputZoneEl = document.getElementById("input-zone");
const phraseInput = document.getElementById("phrase-input");
const validerBtn = document.getElementById("valider-btn");
const messageErreurEl = document.getElementById("message-erreur");

// ─── Normalisation d'une phrase ─────────────────────────────────────────────
// Cette fonction transforme une phrase pour la comparer sans se soucier :
// - des majuscules/minuscules (ex: "Pour" = "pour")
// - des espaces en début/fin (ex: "  bonjour  " = "bonjour")
// - de la ponctuation finale (ex: "bonjour." = "bonjour")
function normaliser(phrase) {
  return phrase
    .trim()          // supprime les espaces au début et à la fin
    .toLowerCase()   // tout en minuscules
    .replace(/[.,!?;:…]+$/, ""); // supprime la ponctuation à la fin
}

// ─── Vérification de la phrase saisie ───────────────────────────────────────
// Renvoie true si la phrase correspond à l'une des phrases acceptées.
function phraseEstValide(saisie) {
  const saisieNormalisee = normaliser(saisie);
  return PHRASES_ACCEPTEES.some(function (phrase) {
    return normaliser(phrase) === saisieNormalisee;
  });
}

// ─── Compte à rebours ────────────────────────────────────────────────────────
// Le champ de saisie est caché pendant tout le décompte.
// Il n'apparaît qu'une fois le timer arrivé à zéro.
function lancerTimer() {
  let secondesRestantes = DUREE_TIMER;
  timerEl.textContent = secondesRestantes;

  const intervalle = setInterval(function () {
    secondesRestantes--;
    timerEl.textContent = secondesRestantes;

    // On passe le timer en rouge dans les 3 dernières secondes
    if (secondesRestantes <= 3) {
      timerEl.classList.add("urgent");
    }

    // Quand le timer atteint zéro
    if (secondesRestantes <= 0) {
      clearInterval(intervalle); // on arrête le décompte

      // On cache le timer et son label
      timerEl.classList.add("hidden");
      timerLabelEl.classList.add("hidden");

      // On révèle la zone de saisie
      inputZoneEl.classList.remove("hidden");

      // On met le curseur directement dans le champ pour que l'utilisateur
      // puisse taper sans avoir à cliquer dessus
      phraseInput.focus();
    }
  }, 1000); // toutes les 1000 ms = 1 seconde
}

// ─── Validation et redirection ───────────────────────────────────────────────
// Quand l'utilisateur clique sur "Valider" (ou appuie sur Entrée),
// on vérifie sa phrase. Si elle est valide, on le laisse accéder à YouTube.
function valider() {
  const saisie = phraseInput.value;

  if (phraseEstValide(saisie)) {
    // Phrase correcte → on déverrouille l'onglet dans background.js.
    // Ce message indique au gardien que cet onglet peut naviguer librement
    // sur YouTube sans être re-bloqué à chaque clic.
    chrome.runtime.sendMessage({ type: "DEVERROUILLER_ONGLET" });

    // On récupère l'URL YouTube d'origine et on redirige.
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get("redirect") || "https://www.youtube.com";
    window.location.href = redirectUrl;
  } else {
    // Phrase incorrecte → message bienveillant, on vide le champ
    messageErreurEl.classList.remove("hidden");
    phraseInput.value = "";
    phraseInput.focus();
  }
}

// Écoute du clic sur le bouton
validerBtn.addEventListener("click", valider);

// Écoute de la touche Entrée dans le champ de saisie
phraseInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    valider();
  }
});

// ─── Démarrage ───────────────────────────────────────────────────────────────
// On lance le timer dès que la page est chargée.
lancerTimer();
