var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
server.listen(3000); 
 
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {  
    console.log('Client connected...');

    socket.emit('news', { hello: 'world' });
  	socket.on('my_other_event', function (data) {
    console.log(data);
 });
});
