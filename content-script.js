console.log("CONT SCRIPT")
function getSelectionHTML() {
    console.log("contscriptrunningggg")
    var userSelection;
    if (document.getSelection) {
        userSelection = document.getSelection();
    } else if (document.selection) {    // Old IE
      userSelection = document.selection.createRange();
    }
    console.log("first check:", userSelection)
    return userSelection ? userSelection.toString() : '';
}
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Message recieved: ", request)
    if (request.method == 'getSelection') {
      var selection = getSelectionHTML();
      console.log("Slection: ", selection)
      sendResponse({body: selection});
    }
  });
  