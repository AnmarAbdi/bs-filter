document.addEventListener("DOMContentLoaded", async function () {
	chrome.tabs.executeScript(
	  {
		code: "window.getSelection().toString();",
	  },
	  async function (result) { 
		let highlightedText = result[0];
		document.getElementById("highlighted-text").innerText = highlightedText;
		await getDefinition(highlightedText);
	  }
	);
  });
  
async function getDefinition(text) { 
	const apiKey = "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";
	const prompt = `Remove any and only biases and slanted language from the following article. Keep the exact article structure, and make sure to keep all context needed for the reader. Make sure to keep all quotes unchanged in the article: ${text}`;
  
	const response = await fetch("https://api.openai.com/v1/completions", {
	  method: "POST",
	  headers: {
		"Content-Type": "application/json",
		"Authorization": `Bearer ${apiKey}`
	  },
	  body: JSON.stringify({
		model: "text-davinci-003",
		prompt: prompt,
		max_tokens: 1500,
		n: 1,
		stop: null,
		temperature: 0.3,
	  }),
	});
  
	const data = await response.json();
	const definition = data.choices[0].text.trim();
	document.getElementById("definition").innerText = definition;
}
  