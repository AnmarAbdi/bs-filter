chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'fetch_url') {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      let url = tabs[0].url;
      console.log('URL2:', url);
      sendResponse({url: url});
    });
    return true;  // To enable async sendResponse
  }
});
