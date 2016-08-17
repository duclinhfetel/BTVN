function socketOnConnect(socket) {
	socket.on(VEVENT_CONNECT, function() {

		socket.emit( ADDUSER, prompt("What's your name?"));
	});
}
function socketOnUpDateChat(socket){
	socket.on(UPDATECHAT, function (username, data) {

		$('#conversation').append('<b>'+username + ':</b> ' + data + '<br>');
	});
}
function socketOnUpDateRooms(socket){

	socket.on(UPDATEROOMS, function(rooms, current_room) {

		$('#rooms').empty();
		$.each(rooms, function(key, value) {

			if(value == current_room){

				$('#rooms').append('<div>' + value + '</div>');
			}else {

				$('#rooms').append('<div><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
			}
		});
	});
}
function enventOnclick(){
	$(function(){

		$('#datasend').click( function() {
			var message = $('#data').val();
			$('#data').val('');
			socket.emit('sendchat', message);
		});

		$('#data').keypress(function(e) {
			if(e.which == 13) {
				$(this).blur();
				$('#datasend').focus().click();
			}
		});
	});
}
