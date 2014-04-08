// Saves options to localStorage.
function save_options() {
  var domain = $('#host_name').val();  
  localStorage["domain"] = domain;
  var gamePath = $('#game_path').val();  
  localStorage["game_path"] = gamePath;
  var userName = $('#username').val();  
  localStorage["username"] = userName;

  // Update status to let user know options were saved.
  var status = $("#status");
  status.html("Options Saved.");
  setTimeout(function() {
    status.html("");
  }, 750);
}

// Restores select box state to saved value from localStorage.
// TODO: move in variable and make common restore
function restore_options() {
  var domain = localStorage["domain"];
  if (domain) {
    $("#host_name").val(domain);
  }
  var gamePath = localStorage["game_path"];
  if (gamePath) {
    $("#game_path").val(gamePath);	
  }
   var userName = localStorage["username"];
  if (userName) {
    $("username").val(userName);	
  }
}

$(function(){
	restore_options();
	$('#save').click(save_options);
});
