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
  