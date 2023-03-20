chrome.runtime.sendMessage({
    action: "fetchArticle",
    url: window.location.href,
  });
  