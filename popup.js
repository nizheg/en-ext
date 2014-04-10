$(function() {
	function submitAnswer() {			
		var answer = $('#answer_box').val();
		chrome.extension.getBackgroundPage().addAnswer(answer);
		printQueue();
		$('#answer_box').val('');
		chrome.tabs.query({currentWindow: true, url: 'http://' + localStorage["domain"] + localStorage['game_path'] + '/*'}, 
			function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {what: answer, username: localStorage['username']},	function(response) { });
			});
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
			$('#answer_box').val(backAnswer);
			submitAnswer();
		}
	}
	
	function clearInfoTable() {
		$('.info-row').each(function() {$(this).html('')});
	}
	
	function fillInfoTable(request) {
		$('.hr').each(function() {$(this).html('<hr>')});			
		var titleRow = $('#row_title');
		var sectorsInfoRow = $('#row_sectors_info');
		var sectorsRow = $('#row_sectors');
		var correctsRow = $('#corrects');
		var lastAnswer = $('#last_answer');
		if (request.title) {
			titleRow.html(request.title);
		}
		if (request.sectors_info) {
			sectorsInfoRow.html(request.sectors_info);
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
		if (request.last_code) {
			chrome.extension.getBackgroundPage().removeAnswer(request.last_code);
		}
		var bonus_count = '?';
		var bonus_done_count = '?';
		if (typeof request.bonus_count != 'undefined') {
			bonus_count = request.bonus_count;
		}
		if (typeof request.done_bonus_count != 'undefined') {
			bonus_done_count = request.done_bonus_count;
		}
		$('#bonus_info').html('Выполнено бонусов ' + bonus_done_count + '. Осталось ' + bonus_count);
	}
	
	printQueue();
	$('#answer_box').change(submitAnswer);	
	$('#clear_queue').click(clearQueue);
	$('#start_queue').click(processQueue);
	
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			clearInfoTable();
			fillInfoTable(request);			
			printQueue();
			processQueue();
		}
	);
});

