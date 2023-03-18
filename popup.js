document.addEventListener("DOMContentLoaded", async function () {
	chrome.tabs.executeScript(
	  {
		code: "window.getSelection().toString();",
	  },
	  async function (result) { 
		let highlightedText = result[0];
		document.getElementById("highlighted-text").innerText = highlightedText;
		await getDefinition(highlightedText); // Call the 'getDefinition' function here
	  }
	);
  });
  
async function getDefinition(text) { // The parameter should be 'text' instead of 'highlightedText'
	const apiKey = "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";
	const prompt = `Remove any biases and slanted language from the article: ${text}`;
  
	const response = await fetch("https://api.openai.com/v1/completions", {
	  method: "POST",
	  headers: {
		"Content-Type": "application/json",
		"Authorization": `Bearer ${apiKey}`
	  },
	  body: JSON.stringify({
		model: "text-davinci-003",
		prompt: prompt,
		max_tokens: 250,
		n: 1,
		stop: null,
		temperature: 0.3,
	  }),
	});
  
	const data = await response.json();
	const definition = data.choices[0].text.trim();
	document.getElementById("definition").innerText = definition;
}
  