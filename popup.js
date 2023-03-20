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
  