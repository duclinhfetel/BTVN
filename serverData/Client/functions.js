function listen_event(socket) {
	socket.on( KEY_EVENT_NEW , function (data) {
	    console.log(data);
	    socket.emit( KEY_EVENT_MY_OTHER, { my: 'data' });
	});
}