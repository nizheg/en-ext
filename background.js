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
