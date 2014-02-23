// Saves options to localStorage.
function save_options() {
  var domain = $('#host_name').val();  
  localStorage["domain"] = domain;

  // Update status to let user know options were saved.
  var status = $("#status");
  status.html("Options Saved.");
  setTimeout(function() {
    status.html("");
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var domain = localStorage["domain"];
  if (!domain) {
    return;
  }
  $("#host_name").val(domain);  
}

$(function(){
	restore_options();
	$('#save').click(save_options);
});