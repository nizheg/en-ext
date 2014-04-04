$(function() {
	$('#answer_box').change(
		function() {			
			chrome.tabs.query({currentWindow: true, url: 'http://*.' + localStorage["domain"] + '/gameengines/encounter/play/*'}, 
				function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, {what: $('#answer_box').val()}, 
						function(response) {
							console.log(response);							
						}
					);
					$('#answer_box').val('');
			});
			
		}
	);
	
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			var titleRow = $('#row_title');
			var sectorsInfoRow = $('#row_sectors_info');
			var sectorsRow = $('#row_sectors');
			var correctsRow = $('#corrects');
			titleRow.html('');
			sectorsInfoRow.html('');
			sectorsRow.html('');
			correctsRow.html('');
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
	);
});

