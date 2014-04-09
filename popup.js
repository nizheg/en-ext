$(function() {
	$('#answer_box').change(submitAnswer);
	$('#queue').html(chrome.extension.getBackgroundPage().getAnswers());
	$('#queue').click(function(){chrome.extension.getBackgroundPage().clearAnswers(); $('#queue').html(chrome.extension.getBackgroundPage().getAnswers())});
	
	function submitAnswer() {			
			chrome.tabs.query({currentWindow: true, url: 'http://' + localStorage["domain"] + localStorage['game_path'] + '/*'}, 
				function(tabs) {
					var answer = $('#answer_box').val();
					chrome.tabs.sendMessage(tabs[0].id, {what: answer, username: localStorage['username']}, 
						function(response) { }
					);
					chrome.extension.getBackgroundPage().addAnswer(answer);
					$('#answer_box').val('');
			});
		}
	
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			var titleRow = $('#row_title');
			var sectorsInfoRow = $('#row_sectors_info');
			var sectorsRow = $('#row_sectors');
			var correctsRow = $('#corrects');
			var lastAnswer = $('#last_answer');
			titleRow.html('');
			sectorsInfoRow.html('');
			sectorsRow.html('');
			correctsRow.html('');
			lastAnswer.html('');
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
			$('#queue').html(chrome.extension.getBackgroundPage().getAnswers());
			var bonus_count = '?';
			var bonus_done_count = '?';
			if (typeof request.bonus_count != 'undefined') {
				bonus_count = request.bonus_count;
			}
			if (typeof request.done_bonus_count != 'undefined') {
				bonus_done_count = request.done_bonus_count;
			}
			$('#bonus_info').html('Выполнено бонусов ' + bonus_done_count + '. Осталось ' + bonus_count);
			var backAnswer = chrome.extension.getBackgroundPage().getAnswer();
			if (backAnswer) {
				$('#answer_box').val(backAnswer);
				submitAnswer();
			}
		}
	);
});

