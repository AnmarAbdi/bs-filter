document.addEventListener("DOMContentLoaded", async function () {
	chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
	  const tabId = tabs[0].id;
  
	  chrome.scripting.executeScript(
		{
		  target: { tabId: tabId },
		  function: () => window.getSelection().toString(),
		},
		async (result) => {
		  let highlightedText = result[0].result;
		  document.getElementById("highlighted-text").innerText = highlightedText;
		  await getDefinition(highlightedText);
		}
	  );
	});
});

async function getDefinition(text) {
    const response = await fetch("https://bsproxy.herokuapp.com/", {
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

  