var express = require('express');
var md5 = require('MD5');
var app = express();
var ent = require('ent');
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = {};
var messages = [];
var history = 10;

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.sockets.on('connection', function(socket, user){
  var me = false;
  console.log('New user is connected');


  for(var k in users){
    socket.emit('newuser', users[k]);
  }
  for(var k in messages){
    socket.emit('newmessage', messages[k]);
  }

  socket.on('login', function(user){
    socket.user = user;
    // socket.id = {mail:user, gravatar:user.replace('@','-').replace('.','-')};
    socket.user.avatar = 'http://gravatar.com/avatar/' + md5(socket.id) + '?s=50';
    socket.emit('logged');
    users[socket.id] = socket.user;
    socket.broadcast.emit('newuser', user);
  });

  socket.on('disconnect', function(){
    if(!socket.user){
      return false;
    }
    delete users[socket.id];
    io.sockets.emit('disuser', socket.user);
  })

  socket.on('newmessage', function(message){
    // data = new Date();
    // messages.push(message);
    // if(message.length > history){
    //  messages.shift();
    // }
    io.sockets.emit('newmessage', {message:message, user:socket.user});
});

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});