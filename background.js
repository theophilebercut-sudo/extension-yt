// background.js — Gardien YouTube V2
// Ce script tourne en arrière-plan et surveille tous les onglets.
// Dès qu'un onglet pointe vers YouTube, il redirige vers notre page de blocage.

// On écoute l'événement "webNavigation.onBeforeNavigate" :
// il se déclenche juste avant que le navigateur charge une page.
chrome.webNavigation.onBeforeNavigate.addListener(
  function (details) {
    // On ne redirige que l'onglet principal (frameId === 0 = la page entière,
    // pas une iframe à l'intérieur d'une page).
    if (details.frameId !== 0) return;

    // On construit l'URL de notre page de blocage,
    // en passant l'URL YouTube d'origine en paramètre
    // pour pouvoir y rediriger l'utilisateur s'il valide.
    const blockerUrl =
      chrome.runtime.getURL("blocker.html") +
      "?redirect=" +
      encodeURIComponent(details.url);

    // On remplace l'URL de l'onglet par notre page de blocage.
    chrome.tabs.update(details.tabId, { url: blockerUrl });
  },
  {
    // Filtre : on n'intervient que sur youtube.com
    url: [
      { hostEquals: "www.youtube.com" },
      { hostEquals: "youtube.com" },
      { hostSuffix: ".youtube.com" },
    ],
  }
);
