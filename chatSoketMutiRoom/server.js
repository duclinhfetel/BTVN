var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// 	mongoose.connect('mongodb://localhost/test');

// var userSchema = new Schema ({
// 	room: String,
// 	name : String,
// 	meg : String
// });

// var post = mongoose.model('Post',userSchema);
// var mypost = new post();

server.listen(8080);

app.get('/', function (req, res) {

	res.sendfile(__dirname + '/index.html');

});

var usernames = {};
var rooms = ['room1','room2','room3'];

io.sockets.on('connection', function (socket) {
	
	Adduser(socket);
	SendChat(socket);
	SwitchRoom(socket);
	Disconnect(socket);
	
});

function Adduser(socket) {

	socket.on('adduser', function(username) {

		socket.username = username;
		socket.room = 'room1';
		usernames[username] = username;

		// var mypost = new post();
		// mypost.name = username;
		// mypost.save();

		socket.join('room1');
		socket.emit('updatechat', 'SERVER', 'you have connected to room1');
		socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
		socket.emit('updaterooms', rooms, 'room1');
	});
}

function SendChat(socket) {

	socket.on('sendchat', function (data) {
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
		// var mypost = new post({room: socket.room,name: socket.username, meg: data});
		// mypost.save();

	});
}

function SwitchRoom(socket) {

	socket.on('switchRoom', function(newroom) {

		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
		socket.emit('updaterooms', rooms, newroom);
	});

}
function Disconnect(socket) {

	socket.on('disconnect', function() {

		delete usernames[socket.username];
		io.sockets.emit('updateusers', usernames);
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
	});
}