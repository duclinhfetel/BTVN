var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  

server.listen(8000); 
 
app.get('/Client/config.js', function(req, res, next) {  

    res.sendFile(__dirname + '/Client/config.js');
});

app.get('/Client/functions.js', function(req, res, next) {  

    res.sendFile(__dirname + '/Client/functions.js');
});

app.get('/ClientChat/config.js', function(req, res, next) {  

    res.sendFile(__dirname + '/ClientChat/config.js');
});

app.get('/ClientChat/functions.js', function(req, res, next) {  

    res.sendFile(__dirname + '/ClientChat/functions.js');
});