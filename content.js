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
	var title = $('.content h2:first').text().trim();
	var sectors_info = $('.content h3[class!=timer]:first').text().trim();
	var sectors = $('.content .cols-wrapper').html();
	chrome.runtime.sendMessage({"title" : title, "sectors_info" : sectors_info, "sectors" : sectors}, 
		function(response) {}
	);
});
