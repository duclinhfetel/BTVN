var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
	mongoose.connect('mongodb://localhost/test');

var userSchema = new Schema({
	room: String,
	name : String,
	meg : String
});
var post = mongoose.model('Post',userSchema);
var mypost = new post();

server.listen(8080);

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var rooms = ['room1','room2','room3'];

io.sockets.on('connection', function (socket) {
	
	Adduser(socket);
	SendChat(socket);
	SwitchRoom(socket);
	Disconnect(socket);
	
});

function Adduser(socket){
	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username){
		// store the username in the socket session for this client
	socket.username = username;
		// store the room name in the socket session for this client
	socket.room = 'room1';
		// add the client's username to the global list
	usernames[username] = username;

	var mypost = new post();
	mypost.name = username;
	mypost.save();

	// send client to room 1
	socket.join('room1');
		// echo to client they've connected
	socket.emit('updatechat', 'SERVER', 'you have connected to room1');
		// echo to room 1 that a person has connected to their room
	socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
	socket.emit('updaterooms', rooms, 'room1');
	});
}
function SendChat(socket){
	socket.on('sendchat', function (data) {
		
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
		var mypost = new post({room: socket.room,name: socket.username, meg: data});
		mypost.save();

	});
}
function SwitchRoom(socket){
	socket.on('switchRoom', function(newroom){
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
		socket.emit('updaterooms', rooms, newroom);
	});

}
function Disconnect(socket){
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
	});
}