// ================================================
// background.js — Le vigile de l'extension
// Ce script surveille tous les onglets du navigateur.
// Dès qu'un onglet charge YouTube, il redirige vers la page de blocage.
// ================================================

// Cette fonction vérifie si une URL correspond à YouTube
function estYoutube(url) {
  return url.includes("youtube.com");
}

// On écoute l'événement qui se déclenche quand une navigation commence dans un onglet
// "onBeforeNavigate" = "juste avant que la page se charge"
chrome.webNavigation.onBeforeNavigate.addListener(function (details) {

  // On ne s'intéresse qu'aux navigations dans le cadre principal (pas les iframes)
  if (details.frameId !== 0) return;

  // Si l'URL cible est YouTube...
  if (estYoutube(details.url)) {

    // ...on redirige vers notre page de blocage
    // On passe l'URL YouTube d'origine en paramètre pour pouvoir y aller après validation
    const urlCible = encodeURIComponent(details.url);
    const urlBlocage = chrome.runtime.getURL("blocker.html") + "?destination=" + urlCible;

    chrome.tabs.update(details.tabId, { url: urlBlocage });
  }
});
