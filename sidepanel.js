document.addEventListener("DOMContentLoaded", async function () {
  const getDefinitionButton = document.getElementById("get-definition-button");
  getDefinitionButton.addEventListener("click", handleButtonClick);
});

async function handleButtonClick() {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tabId = tabs[0].id;
    console.log(tabId)
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        function: function () {
          return window.getSelection().toString();
        },
      },
      async (result) => {
        console.log(result)
        let highlightedText = result[0].result;
        console.log(highlightedText); // // // // // // // //
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
      }
    );
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

/* 
		+====- For a collapsable button -====+
  var coll = document.getElementsByClassName("collapsible");
  var i;
  
  for (i = 0; i < coll.length; i++) {
	coll[i].addEventListener("click", function() {
	  this.classList.toggle("active");
	  var content = this.nextElementSibling;
	  if (content.style.display === "none") {
		content.style.display = "block";
	  } else {
		content.style.display = "none";
	  }
	});
  }
  */
