document.addEventListener("DOMContentLoaded", async function () {
  const getDefinitionButton = document.getElementById("get-definition-button");
  getDefinitionButton.addEventListener("click", handleButtonClick);
});

// Get highlighted text function
async function handleButtonClick() {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tabId = tabs[0].id;
    console.log('Preparing to send message to tab:', tabId);
      console.log('Sending message to tab:', tabId);
      chrome.tabs.sendMessage(tabId, {method: 'getSelection'}, async (response) => {
        console.log("Response::", response)
        let highlightedText = response.body;
        const chunkSize = 350; // Set your desired chunk size

        const definitionsElement = document.getElementById("definition");

        if (highlightedText.length > chunkSize) {
          const sentences = highlightedText.match(/[^.!?]+[.!?]+/g) || [
            highlightedText,
          ];
          let chunks = [];
          let currentChunk = "";

          for (const sentence of sentences) {
            if (currentChunk.length + sentence.length <= chunkSize) {
              currentChunk += sentence;
            } else {
              chunks.push(currentChunk);
              currentChunk = sentence;
            }
          }

          if (currentChunk) {
            chunks.push(currentChunk);
          }

          for (const chunk of chunks) {
            const definition = await getDefinition(chunk);
            if (definition) {
              const newDefinitionDiv = document.createElement("div");
              newDefinitionDiv.innerText = definition;
              definitionsElement.appendChild(newDefinitionDiv);
            }
          }
        } else {
          const definition = await getDefinition(highlightedText);
          if (definition) {
            const newDefinitionDiv = document.createElement("div");
            newDefinitionDiv.innerText = definition;
            definitionsElement.appendChild(newDefinitionDiv);
          }
        }
      });
  });
}

async function getDefinition(text) {
  const response = await fetch("https://bsproxy.herokuapp.com/get-definition", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();
  const definition = data.definition;
  return definition;
}
