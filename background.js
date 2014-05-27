if (!localStorage['domain']) {
	localStorage['domain'] = "*.en.cx";
}
if (!localStorage['game_path']) {
	localStorage['game_path'] = "/gameengines/encounter/play";
}

var answers = [];
var currLevelInfo = "";
var currBonusInfo = "";
var currSectorsInfo = "";
var actualInfo;
var hints = [];

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.id == "hint" && webkitNotifications && request.hints.length != hints.length) {
			if (request.hints[request.hints.length - 1]) {
				var notification = webkitNotifications.createNotification('', 'Hint!', request.hints[request.hints.length - 1]);
				notification.onclick = function() { notification.cancel(); };
				notification.show();
			}
			hints = request.hints;
		}
	}
);

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.id == "content") {
			actualInfo = request;
		}
	}
);

function addAnswer(val) {
	answers.push(val);
}

function removeAnswer(val) {
	var index = answers.indexOf(val);
	if (index > -1) {
		answers.splice(index, 1);
	}
}

function getAnswers() {
	return answers.join(', ');
}

function getAnswer() {
	return answers[0];
}

function clearAnswers() {
	answers = [];
}
