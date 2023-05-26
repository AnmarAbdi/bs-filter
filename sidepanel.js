<<<<<<< Updated upstream:popup.js
async function fetchArticleText(html) {
	const response = await fetch("http://localhost:5000/parse-html", {
	  method: "POST",
	  headers: {
		"Content-Type": "text/plain",
	  },
	  body: html,
	});
  
	const data = await response.json();
	return data.article_text;
  }
  
document.addEventListener("DOMContentLoaded", function () {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, { action: "fetchArticle" }, async function (response) {
		if (response.error) {
		  document.getElementById("article-text").innerText = "Error: " + response.error;
		  return;
		}
  
		const html = response.html;
		const articleText = await fetchArticleText(html);
		document.getElementById("article-text").innerText = articleText;
	  });
	});
  });
  
=======
console.log("sidepanel.js loaded");

// Handle the button click
document.addEventListener("DOMContentLoaded", function () {
  const getDefinitionButton = document.getElementById("get-definition-button");
  getDefinitionButton.addEventListener("click", handleButtonClick);
});

async function handleButtonClick() {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tabId = tabs[0].id;

    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        function: function () {
          return window.getSelection().toString();
        },
      },
      async (result) => {
        if (!result) {
          console.error('result is undefined');
          return;
        }
      
        if (!result[0]) {
          console.error('result[0] is undefined');
          return;
        }
        let highlightedText = result[0].result;
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
>>>>>>> Stashed changes:sidepanel.js
