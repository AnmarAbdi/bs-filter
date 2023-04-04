document.addEventListener("DOMContentLoaded", async function () {
	const getDefinitionButton = document.getElementById("get-definition-button");
	getDefinitionButton.addEventListener("click", handleButtonClick);
  });
  
  async function handleButtonClick() {
	chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
	  const tabId = tabs[0].id;
  
	  chrome.tabs.executeScript(
		tabId,
		{
		  code: "window.getSelection().toString();",
		},
		async (result) => {
		  let highlightedText = result[0];
		  document.getElementById("highlighted-text").innerText = highlightedText;
		  await getDefinition(highlightedText);
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
	document.getElementById("definition").innerText = definition;
  }
  