var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var http = require('http');
var app = require('express')(),
	ent = require('ent'), 
 	fs = require('fs');
 	nickNames = [];

var server = http.createServer(function(req, res) {
	fs.readFile('./index.html', 'utf-8', function(error, content) {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end(content);
	});
});

var io = require('socket.io').listen(server);

io.on('connection', function(socket){
	socket.on('chat message', function(message){
		io.emit('chat message', message);
	});

	socket.on('petit_nouveau', function(pseudo){
		socket.pseudo = pseudo;
	});

	socket.on('message', function (data, callback) {
		if (nickNames.indexOf(data) != -1){
			callback(false);
		}else{
			callback(true);
			socket.nickNames = data;
			nickNames.push(socket.nickNames);
			io.socket.emit('userNames', nickNames);
		}
	});
});

// io.sockets.on('connection', function(socket) {
//     socket.emit('message','vous étes bien connecté !');
//     socket.broadcast.emit('message', 'Un autre client vient de se connecter !');

//     socket.on('petit_nouveau', function(pseudo){
//     	socket.pseudo = pseudo;
//     });

//     socket.on('message', function(message) {
//         console.log('Un client me parle ! Il me dit : ' + message);
//     });	

//     socket.on('nouveau_client', function(pseudo) {
//         pseudo = ent.encode(pseudo);
//         socket.pseudo = pseudo;
//         socket.broadcast.emit('nouveau_client', pseudo);
//     });

//     socket.on('message', function (message) {
//         message = ent.encode(message);
//         socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
//     }); 

// });


server.listen(8080);