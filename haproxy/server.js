

var http = require('http');
var morgan       = require('morgan');

var server1 = http.createServer(function (req, res) {
  console.log("Request for server1:  " + req.url + "-- port 3000 ");
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World1\n');
}).listen(3000, "127.0.0.3");

var server2 = http.createServer(function (req, res) {
  console.log("Request for server2:  " + req.url + "-- port 3000 ");
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World2\n');
}).listen(3000, "127.0.0.4");

var server3 = http.createServer(function (req, res) {
  console.log("Request for server3:  " + req.url + "-- port 3000 ");
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World3\n');
}).listen(3000, "127.0.0.5");

server1.once('listening', function() {
  console.log('Server1 running at http://127.0.0.3:3000/');
});

server2.once('listening', function() {
  console.log('Server2 running at http://127.0.0.4:3000/');
});

