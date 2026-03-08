// ================================================
// blocker.js — Logique de la page de blocage
// Gère : le timer, la validation de la réponse,
//        l'enregistrement Supabase, et la redirection
// ================================================

// ---- CONFIGURATION SUPABASE ----
// Remplace ces deux valeurs par les tiennes (Project Settings → API dans Supabase)
const SUPABASE_URL = "https://ixfyqhrcpqiuzctwtlrc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ewVG4iwMcjxu1F6s4bQB1w_omWhsE3x";

// La phrase attendue (en minuscules, sans ponctuation)
const PHRASE_ATTENDUE = "pour apprendre des choses";

// ---- RÉCUPÉRATION DES ÉLÉMENTS DE LA PAGE ----
const timerCompte = document.getElementById("timer-compte");
const timerZone   = document.getElementById("timer-zone");
const saisieZone  = document.getElementById("saisie-zone");
const champTexte  = document.getElementById("champ-texte");
const boutonValider = document.getElementById("bouton-valider");
const messageErreur = document.getElementById("message-erreur");

// ---- RÉCUPÉRATION DE L'URL YOUTUBE DE DESTINATION ----
// On lit le paramètre "destination" dans l'URL de la page de blocage
function getDestination() {
  const params = new URLSearchParams(window.location.search);
  return decodeURIComponent(params.get("destination") || "https://www.youtube.com");
}

// ---- TIMER DE 10 SECONDES ----
// Lance un compte à rebours. Une fois à 0, affiche le champ de saisie.
function lancerTimer() {
  let secondes = 10;

  const intervalle = setInterval(function () {
    secondes--;
    timerCompte.textContent = secondes;

    // Quand le timer arrive à 0 : on arrête le compte et on affiche le champ
    if (secondes <= 0) {
      clearInterval(intervalle);
      timerZone.classList.add("cache");         // Cache le timer
      saisieZone.classList.remove("cache");     // Affiche le champ de saisie
      champTexte.focus();                       // Met le curseur dans le champ
    }
  }, 1000); // 1000 millisecondes = 1 seconde
}

// ---- NORMALISATION DE LA RÉPONSE ----
// Transforme le texte pour ignorer : majuscules, espaces superflus, ponctuation finale
// Exemple : "  Pour apprendre des choses. " → "pour apprendre des choses"
function normaliser(texte) {
  return texte
    .toLowerCase()           // Tout en minuscules
    .trim()                  // Supprime les espaces au début et à la fin
    .replace(/[.,!?;:]+$/, ""); // Supprime la ponctuation en fin de phrase
}

// ---- ENREGISTREMENT DANS SUPABASE ----
// Envoie une ligne dans la table visites_youtube avec la date/heure et l'intention
async function enregistrerVisite(intention) {
  try {
    const reponse = await fetch(SUPABASE_URL + "/rest/v1/visites_youtube", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": "Bearer " + SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        intention: intention
        // date_heure est remplie automatiquement par Supabase (DEFAULT NOW())
      })
    });

    if (!reponse.ok) {
      console.error("Erreur Supabase :", reponse.status, await reponse.text());
    }
  } catch (erreur) {
    // Si la connexion échoue, on continue quand même (on ne bloque pas l'accès)
    console.error("Impossible de joindre Supabase :", erreur);
  }
}

// ---- VALIDATION DE LA RÉPONSE ----
// Vérifie si la phrase saisie correspond à la phrase attendue
async function valider() {
  const saisie = champTexte.value;
  const saisiNormalisee = normaliser(saisie);

  if (saisiNormalisee === PHRASE_ATTENDUE) {
    // ✅ Bonne réponse : enregistrer dans Supabase puis rediriger
    await enregistrerVisite(saisie);
    window.location.href = getDestination();
  } else {
    // ❌ Mauvaise réponse : afficher le message et recommencer
    messageErreur.classList.remove("cache");
    champTexte.value = "";     // Vide le champ
    champTexte.focus();        // Replace le curseur
  }
}

// ---- ÉCOUTE DU BOUTON ET DE LA TOUCHE ENTRÉE ----
boutonValider.addEventListener("click", valider);

champTexte.addEventListener("keydown", function (evenement) {
  if (evenement.key === "Enter") {
    valider();
  }
});

// ---- LANCEMENT AU CHARGEMENT DE LA PAGE ----
lancerTimer();
