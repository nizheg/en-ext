function submitAnswer(answer) {
	$('#Answer').val(answer);	
	$('.container .aside form:first').submit();
}

chrome.storage.sync.get('en_user', function(items) { if (items.en_user) {localStorage['username'] = items.en_user} });

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
	var last_answer = $('ul.history li:contains("' + localStorage['username'] + '"):nth(0)');
	if (last_answer.length == 0) {
		last_answer = $('ul.history li:nth(0)');
	}
	var last_code = $('span', last_answer).text().trim();
	var done_bonus = $('div.content h3.color_correct').size();
	var bonus = $('div.content h3.color_bonus').size();
	chrome.runtime.sendMessage({
		"id" : "content",
		"title" : title,
		"sectors_info" : sectors_info,
		"sectors" : sectors,
		"last_answer" : last_answer.html(),
		"last_code" : last_code,
		"done_bonus_count" : done_bonus,
		"bonus_count" : bonus
	}, function(response) {});
});
