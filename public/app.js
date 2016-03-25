var socket = io.connect('http://192.168.1.24:3000');

    $('#login form').submit(function(event){
      event.preventDefault();
      socket.emit('login', {
        username : $('#username').val(),
        mail     : $('#mail').val()
      })
      $('#login').fadeOut();
    });

    socket.on('logged', function(){
      console.log('user got connected');
      // $('#holder').focus();
    });

    socket.on('newuser', function(user){
      var side = $('<div>');
      var $nickname = $('<p>');
      side.addClass('side');
      $nickname.html(user.username);
      side.append($nickname);
      $('#users').append('<div id="' + user.id + '">' + '<img src="'+ user.avatar +'">' + user.username + '</div>');
      $('#messages').append('<div class="flash">' + user.username + ' ' + 'is connected' + '</div>');
      $('.flash').animate({opacity:0}, 10000, function(){});
    });

    socket.on('disuser', function(user){
      $('#' + user.id).remove();
    });

    $('#message').submit(function(){
      event.preventDefault();
      socket.emit('newmessage', $('#m').val());
      $('#m').val('');
      $('#messages').animate({scrollTop : $('#messages').prop('scrollHeight') }, 50);
      return false;
    });

    socket.on('newmessage', function(data){
      var part = $('<div>');
      var img = $('<img>');
      var Nickname = $('<h2>');
      var content = $('<p>');
      part.addClass('msg');
      img.attr('src', data.user.avatar);
      part.append(img);
      Nickname.html(data.user.username);
      part.append(Nickname);
      content.html(data.message);
      part.append(content);

      $('#messages').append(part);
    });