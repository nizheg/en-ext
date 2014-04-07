function submitAnswer(answer) {
	$('#Answer').val(answer);	
	$('.container .aside form:first').submit();
}

chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {			
			if (request.what) {
				submitAnswer(request.what);
			}
		}
	);

$(function() {
	var title = $('div.content h2:first').text().trim();
	var sectors_info = $('div.content h3[class!=timer]:first').text().trim();
	var sectors = $('div.content .cols-wrapper').html();
	var corrects = $('ul.history li.correct:lt(1)').html();
	var done_bonus = $('div.content h3.color_correct').size();
	var bonus = $('div.content h3.color_bonus').size();
	chrome.runtime.sendMessage({"title" : title, "sectors_info" : sectors_info, "sectors" : sectors, "corrects": corrects,
		"done_bonus_count" : done_bonus, "bonus_count" : bonus}, 
		function(response) {}
	);
});
