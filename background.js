// ================================================
// background.js — Le vigile de l'extension
// Ce script surveille tous les onglets du navigateur.
// Dès qu'un onglet charge YouTube, il redirige vers la page de blocage.
// ================================================

// Onglets ayant validé la phrase — autorisés à naviguer librement sur YouTube
const tabsAutorises = new Set();

// blocker.js envoie ce message après une validation réussie
chrome.runtime.onMessage.addListener(function (message, sender) {
  if (message.action === "autoriser" && sender.tab) {
    tabsAutorises.add(sender.tab.id);
  }
});

// Quand un onglet est fermé, on nettoie
chrome.tabs.onRemoved.addListener(function (tabId) {
  tabsAutorises.delete(tabId);
});

// Cette fonction vérifie si une URL correspond à YouTube
function estYoutube(url) {
  return url.includes("youtube.com");
}

// On écoute toutes les navigations dans le cadre principal
chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
  if (details.frameId !== 0) return;

  if (estYoutube(details.url)) {
    // YouTube : si l'onglet est autorisé, on laisse passer librement
    if (tabsAutorises.has(details.tabId)) {
      return;
    }
    // Sinon on redirige vers la page de blocage
    const urlCible = encodeURIComponent(details.url);
    const urlBlocage = chrome.runtime.getURL("blocker.html") + "?destination=" + urlCible;
    chrome.tabs.update(details.tabId, { url: urlBlocage });
  } else {
    // L'onglet quitte YouTube : on retire l'autorisation
    tabsAutorises.delete(details.tabId);
  }
});
