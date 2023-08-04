document.addEventListener("DOMContentLoaded", async function () {
  const getDefinitionButton = document.getElementById("get-definition-button");
  getDefinitionButton.addEventListener("click", handleButtonClick);
});

async function handleButtonClick() {
  chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
    let url = tabs[0].url;
    console.log("You are here: " + url);
    const sessionId = await getSessionId();
    await sendURL(url, sessionId);
    
    checkStatus(sessionId);
});
}

async function sendURL(url, sessionId) {
  console.log("URL to send:", url);  // Log the URL being sent
  console.log("Session ID:", sessionId);  // Log the Session ID
  const response = await fetch("https://bsproxy.herokuapp.com/send-url", { // replace with your server URL
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, session_id: sessionId }),
    credentials: 'include'  // Include cookies with the request
  });
  console.log(response.status)
  if (response.ok) {
    console.log('URL sent successfully');
  } else {
    console.error('Failed to send URL:', await response.text());
  }
}

async function checkStatus(sessionId) {
  const response = await fetch("https://bsproxy.herokuapp.com/check-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ session_id: sessionId }),
  });

  if (response.ok) {
    const data = await response.json();
    if (data.status === 'done') {
      // Display the processed text
      console.log('Processed text:', data.article_body);
    } else if (data.status === 'processing') {
      // Wait for a few seconds and then check the status again
      setTimeout(() => checkStatus(sessionId), 5000);
    } else if (data.status === 'error') {
      // Handle the error
      console.error('An error occurred while processing the text.');
    }
  } else {
    console.error('Failed to check status:', await response.text());
  }
}

// Generate a unique ID for this extension
async function getSessionId() {
  let sessionId = await new Promise((resolve, reject) => {
    chrome.storage.local.get(['session_id'], function(result) {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(result.session_id);
    });
  });

  if (!sessionId) {
    sessionId = generateUUID();
    await new Promise((resolve, reject) => {
      chrome.storage.local.set({ session_id: sessionId }, function() {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  }

  return sessionId;
}

// Function to generate a unique UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
