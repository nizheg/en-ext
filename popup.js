$(function() {
	var isChanged = false;
	var isInProcess = false;
	printQueue();
	$('#answer_box').change(submitAnswer);	
	$('#clear_queue').click(clearQueue);
	$('#start_queue').click(processQueue);
	
	if (chrome.extension.getBackgroundPage().actualInfo) {
		processPageRequest(chrome.extension.getBackgroundPage().actualInfo);
	}
	
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.id == "content") {
				clearInfoTable();
				processPageRequest(request);			
				printQueue();
				if (!isChanged) {
					processQueue();
				}
			}
		}
	);

	function submitAnswer() {			
		var answer = $('#answer_box').val();
		$('#answer_box').val('');
		chrome.extension.getBackgroundPage().addAnswer(answer);
		printQueue();
		if (!isInProcess) {
			processQueue();
		}
	}
	
	function clearQueue() {
		chrome.extension.getBackgroundPage().clearAnswers();
		printQueue();
	}
	
	function printQueue() {
		$('#queue').html(chrome.extension.getBackgroundPage().getAnswers());
	}
	
	function processQueue() {
		var backAnswer = chrome.extension.getBackgroundPage().getAnswer();
		if (backAnswer) {
			isInProcess = true;
			chrome.tabs.query({currentWindow: true, url: 'http://' + localStorage["domain"] + localStorage['game_path'] + '/*'}, 
			function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, 
					{ what: backAnswer, username: localStorage['username'] },
					function(response) { });
			});
		}	
	}
	
	function processFinished(answer) {
		chrome.extension.getBackgroundPage().removeAnswer(answer);
		isInProcess = false;
	}
	
	function clearInfoTable() {
		$('.info-row').each(function() {$(this).html('')});
	}
	
	function processPageRequest(request) {
		$('.hr').each(function() {$(this).html('<hr>')});
		$('.changed').each(function() {$(this).removeClass('changed');});
		isChanged = false;			
		var titleRow = $('#row_title');
		var sectorsInfoRow = $('#row_sectors_info');
		var sectorsRow = $('#row_sectors');
		var correctsRow = $('#corrects');
		var lastAnswer = $('#last_answer');
		if (request.title) {
			titleRow.html(request.title);
			var currLevelInfo = chrome.extension.getBackgroundPage().currLevelInfo;
			var isLevelChanged = currLevelInfo != "" && currLevelInfo != request.title;
			if (isLevelChanged) {
				titleRow.addClass('changed');
			}
			isChanged |= isLevelChanged;
			chrome.extension.getBackgroundPage().currLevelInfo = request.title;
		}
		if (request.sectors_info) {
			sectorsInfoRow.html(request.sectors_info);
			var currSectorsInfo = chrome.extension.getBackgroundPage().currSectorsInfo;
			var isSectorsChanged = currSectorsInfo != "" && currSectorsInfo != request.sectors_info;
			if (isSectorsChanged) {
				sectorsInfoRow.addClass('changed');
			}
			isChanged |= isSectorsChanged;
			chrome.extension.getBackgroundPage().currSectorsInfo = request.sectors_info;
		}
		if (request.sectors) {
			sectorsRow.html(request.sectors);
		}
		if (request.corrects) {
			correctsRow.html(request.corrects);
		}
		if (request.last_answer) {
			lastAnswer.html(request.last_answer);
		}
		
		var bonus_count = '?';
		var bonus_done_count = '?';
		if (typeof request.bonus_count != 'undefined') {
			bonus_count = request.bonus_count;
		}
		if (typeof request.done_bonus_count != 'undefined') {
			bonus_done_count = request.done_bonus_count;
			var currBonusInfo = chrome.extension.getBackgroundPage().currBonusInfo;
			var isBonusChanged = currBonusInfo != "" && currBonusInfo != request.done_bonus_count;
			if (isBonusChanged) {
				$('#bonus_info').addClass('changed');
			}
			isChanged |= isBonusChanged;
			chrome.extension.getBackgroundPage().currBonusInfo = request.done_bonus_count;
		}
		$('#bonus_info').html('Выполнено бонусов ' + bonus_done_count + '. Осталось ' + bonus_count);
		if (request.last_code) {
			processFinished(request.last_code);
		} else {
			isChanged = true;
			lastAnswer.addClass('changed');
			lastAnswer.html('Введенный код не распознан!');
		}
	}
});

