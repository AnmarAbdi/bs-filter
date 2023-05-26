<<<<<<< Updated upstream
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "fetchArticle") {
      fetch(request.url)
        .then((response) => response.text())
        .then((html) => {
          sendResponse({ html: html });
        })
        .catch((error) => {
          sendResponse({ error: error.message });
        });
      return true; // Required to use sendResponse asynchronously
    }
  });
  
=======
const GOOGLE_ORIGIN = 'https://www.google.com';

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;
  const url = new URL(tab.url);
  // Enables the side panel on google.com
  if (url.origin === GOOGLE_ORIGIN) {
    await chrome.sidePanel.setOptions({
      tabId,
      path: 'sidepanel.html',
      enabled: true
    });
  } else {
    // Disables the side panel on all other sites
    await chrome.sidePanel.setOptions({
      tabId,
      enabled: false
    });
  }
});
>>>>>>> Stashed changes
