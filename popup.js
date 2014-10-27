$(function() {
	var englishKeys = 'qwertyuiop\[\]asdfghjkl;\'zxcvbnm,./';
	var russianKeys = 'йцукенгшщзхъфывапролджэячсмитьбю.'; 
	var isChanged = false;
	var isInProcess = false;
	var gameTabId;
	printQueue();
	$('#answer_box').keydown(onkeydown);
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
				processBrutMode(request);
			}
		}
	);

	function processBrutMode(request) {
		if (localStorage["brut"] == "true") {
			if (isChanged) {
				clearQueue();
				isChanged = false;
			}
			if (request.img) {
				chrome.tabs.query({ active: true }, function(tabs) { 
					currentTabId = tabs[0].id;
					if (currentTabId != gameTabId) {
						chrome.tabs.update({ url: request.img }); 
					}
				});						
			}
		}
	}

	function onkeydown(e) {
		var answerValue = $(this).val();
		switch(e.which) {
			case 38: 
			case 40:
				var result = []; 
				for (var i = 0; i < answerValue.length; i++) {
					var index = russianKeys.indexOf(answerValue[i]);
					if (index > -1) {
						result.push((englishKeys[index]));
					} else {
						index = englishKeys.indexOf(answerValue[i]);
						if (index > -1) {
							result.push((russianKeys[index]));
						} else {
							result.push((answerValue[i]));
						}
					} 
				}
				$(this).val(result.join(''));
				break;
			case 13:
				if (answerValue.length > 0) {
					submitAnswer();
				} else {
					processQueue();
				}
				break;
			case 46:
				if (e.ctrlKey) {
					clearQueue();
					break;
				}
			default: return;
		}
		e.preventDefault(); 
	}

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
					gameTabId = tabs[0].id;
					chrome.tabs.sendMessage(gameTabId, { what: backAnswer }, function(response) { });
				}
			);
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
		var lastAnswer = $('#last_answer');
		if (request.title) {
			titleRow.html(request.title);
			var currLevelInfo = chrome.extension.getBackgroundPage().currLevelInfo;
			var isLevelChanged = currLevelInfo != "" && currLevelInfo != request.title;
			if (isLevelChanged) {
				titleRow.addClass('changed');
				clearQueue();
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

