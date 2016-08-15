var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var CONFIG = require('./ConfigServer/config.js');

server.listen(CONFIG.PORT); 
 
app.get('/', function(req, res, next) {  

    res.sendFile(__dirname + '/index.html');
});

io.on(CONFIG.KEY_CONNECTON, function(socket) { 

    console.log(__dirname + 'Client connected...');

    socket.emit(CONFIG.KEY_EVENT_NEW, { hello: 'world' });
  	socket.on(CONFIG.KEY_EVENT_MY_OTHER, function (data) {
    console.log(data);
 });
});