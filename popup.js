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
			titleRow.html('');
			sectorsInfoRow.html('');
			sectorsRow.html('');
			if (request.title) {
				titleRow.html(request.title);
			}
			if (request.sectors_info) {
				sectorsInfoRow.html(request.sectors_info);
			}
			if (request.sectors) {
				sectorsRow.html(request.sectors);
			}
		}
	);
});

