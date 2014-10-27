var optionsMap = [ 
	{"html_id": "host_name", "storage_id" : "domain"},
	{"html_id": "game_path", "storage_id" : "game_path"},
	{"html_id": "username", "storage_id" : "username"},
	{"html_id": "brut", "storage_id" : "brut"}
];

// Saves options to localStorage.
function save_options() {
	for (var i = 0; i < optionsMap.length; i++) {
		var elem = $('#' + optionsMap[i].html_id);
		var value = elem.val();
		if (elem.is(':checkbox')) {
			value = elem.prop("checked");
		}
		localStorage[optionsMap[i].storage_id] = value;
	}	
	chrome.storage.sync.set({"en_user" : localStorage["username"]});
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
			var elem = $('#' + optionsMap[i].html_id)
			elem.val(value);
			if (elem.is(':checkbox') && value == "true") {
				elem.prop("checked", true);
			}
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
