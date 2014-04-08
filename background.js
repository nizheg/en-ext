if (!localStorage['domain']) {
	localStorage['domain'] = "en.cx";
}
if (!localStorage['game_path']) {
	localStorage['game_path'] = "/gameengines/encounter/play";
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getUsername")
      sendResponse({username: localStorage['username']});
    else
      sendResponse({});
});
