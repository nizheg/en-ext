var optionsMap = [ 
	{"html_id": "host_name", "storage_id" : "domain"},
	{"html_id": "game_path", "storage_id" : "game_path"},
	{"html_id": "username", "storage_id" : "username"}
];

// Saves options to localStorage.
function save_options() {
	chrome.storage.sync.set({"en_user" : localStorage["username"]});
	for (var i = 0; i < optionsMap.length; i++) {
		var value = $('#' + optionsMap[i].html_id).val();
		localStorage[optionsMap[i].storage_id] = value;
	}	
	// Update status to let user know options were saved.
	var status = $("#status");
	status.html("Настройки сохранены");
	setTimeout(function() { status.html(""); }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	for (var i = 0; i < optionsMap.length; i++) {
		var value = localStorage[optionsMap[i].storage_id];
		if (value) {
			$('#' + optionsMap[i].html_id).val(value);
		}		
	}
}

$(function(){
	restore_options();
	$('#save').click(save_options);
	
	var hostName = $('#host_name');
	hostName.change(function() { $(this).css("width", $(this).val().length + 1 + "ch"); });
	hostName.css("width", hostName.val().length + 1 + "ch");
	
	var gamePath = $('#game_path')
	gamePath.keypress(function() { $(this).css("width", $(this).val().length + 1 + "ch"); });
	gamePath.change(function() { $(this).css("width", $(this).val().length + "ch"); });
	gamePath.css("width", gamePath.val().length + "ch");	
});
