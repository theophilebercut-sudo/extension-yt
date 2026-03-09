// background.js — Gardien YouTube V2
// Ce script tourne en arrière-plan et surveille tous les onglets.

// ─── Onglets déverrouillés ───────────────────────────────────────────────────
// Ce Set (une liste sans doublons) contient les IDs des onglets qui ont
// déjà passé le gardien. Tant qu'un onglet est dans cette liste,
// l'utilisateur peut naviguer librement sur YouTube sans être re-bloqué.
// Imagine-le comme un tampon d'entrée dans un club : une fois tamponné,
// tu peux entrer et sortir librement de la salle.
const ongletsDeverrouilles = new Set();

// ─── Surveillance de toutes les navigations ──────────────────────────────────
// On écoute CHAQUE changement d'URL dans tous les onglets.
// Cela nous permet de réagir à deux situations :
//   1. L'onglet va sur YouTube → on vérifie s'il faut bloquer
//   2. L'onglet quitte YouTube → on retire son déverrouillage
chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
  // On ignore les iframes à l'intérieur des pages (frameId !== 0).
  // On ne s'occupe que de l'onglet principal.
  if (details.frameId !== 0) return;

  const estYouTube = estUrlYouTube(details.url);

  if (estYouTube) {
    // L'onglet charge une page YouTube.
    // Si cet onglet a déjà été validé → on laisse passer sans bloquer.
    if (ongletsDeverrouilles.has(details.tabId)) return;

    // Sinon → on redirige vers la page de blocage.
    // On passe l'URL YouTube d'origine en paramètre pour y revenir après validation.
    const blockerUrl =
      chrome.runtime.getURL("blocker.html") +
      "?redirect=" +
      encodeURIComponent(details.url);

    chrome.tabs.update(details.tabId, { url: blockerUrl });
  } else {
    // L'onglet quitte YouTube (il va sur un autre site ou tape une autre URL).
    // On retire le déverrouillage : la prochaine visite sur YouTube
    // demandera à nouveau la phrase.
    ongletsDeverrouilles.delete(details.tabId);
  }
});

// ─── Nettoyage quand un onglet est fermé ────────────────────────────────────
// Si l'utilisateur ferme l'onglet, on supprime son ID de la liste.
// Sinon la liste grossirait indéfiniment en mémoire.
chrome.tabs.onRemoved.addListener(function (tabId) {
  ongletsDeverrouilles.delete(tabId);
});

// ─── Réception du signal de déverrouillage ──────────────────────────────────
// Quand blocker.js valide la phrase, il envoie un message ici.
// On ajoute alors l'onglet à la liste des onglets déverrouillés.
chrome.runtime.onMessage.addListener(function (message, sender) {
  if (message.type === "DEVERROUILLER_ONGLET" && sender.tab) {
    ongletsDeverrouilles.add(sender.tab.id);
  }
});

// ─── Utilitaire : est-ce une URL YouTube ? ──────────────────────────────────
// Renvoie true si l'URL appartient au domaine youtube.com.
function estUrlYouTube(url) {
  try {
    const hostname = new URL(url).hostname;
    return (
      hostname === "youtube.com" ||
      hostname === "www.youtube.com" ||
      hostname.endsWith(".youtube.com")
    );
  } catch {
    // Si l'URL est invalide, on considère que ce n'est pas YouTube.
    return false;
  }
}
