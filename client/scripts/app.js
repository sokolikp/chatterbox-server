// YOUR CODE HERE:
var user = {
  myUsername: undefined,
  friendList: {},
  currentRoom: '',
  roomList: {}
};

var app = {
  server: 'http://127.0.0.1:3000'
};

app.init = function(){
  $(document).ready(function(){
    user.myUsername = location.search.slice(location.search.indexOf('username=')+9).replace(/\+/g,' ');
    app.fetch();

    setInterval(function(){
      app.fetch();
    }, 5000);

    $('document').on('click','.username',function(){
      app.addFriend($(this).text());
    });

    $('.submit').on('click', function(e) {
      e.preventDefault();
      app.handleSubmit($('#message').val());
      $('#message').val('');
    });

    $('#roomSelect').on('change', function() {
      user.currentRoom = $(this).val();
      app.fetch();
    });

    $('.room').on('click', function(e) {
      e.preventDefault();
      var room = $('#room').val();
      app.addRoom(room);
      $('#room').val('');
      $('#roomSelect').val(room);
      $('#roomSelect').trigger('change');
    });

    $('#chats').on('click', '.username', function(){
      app.addFriend(_.escape($(this).text()));
    });
  });
};

app.send = function(message){
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      app.fetch();
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function(){
  $.ajax({
    url: this.server,
    type: 'GET',
    order: 'createdAt',
    contentType: 'application/json',
    success: function (data) {
      data = JSON.parse(data);
      // console.log('data ', JSON.parse(data), typeof JSON.parse(data));
      // console.log('results ', data.results);
      console.log('chatterbox: Messages received');
      app.clearMessages();

      for(var i = 0; i < data.results.length; i++){
        app.addMessage(data.results[i]);
        app.addRoom(_.escape(data.results[i].roomname));
      }
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get message');
    }
  });
};

app.clearMessages = function(){
  $('#chats').children().remove();
};

app.addMessage = function(message){
  if(message.roomname !== user.currentRoom){
    return;
  }

  if(user.friendList.hasOwnProperty(_.escape(message.username))){
    strong = '<strong>';
    strong_ = '</strong>';
  } else {
    strong = strong_ = '';
  }

  $('#chats').append('<p>'+ strong + '<span class="username">'
  + _.escape(message.username)+'</span>: '
  + _.escape(message.text) + strong_ +'</p>');

};

app.addRoom = function(roomName){
  if(roomName === undefined){
    return;
  }
  if (!user.roomList.hasOwnProperty(roomName)) {
    $('#roomSelect').append('<option value="'+roomName+'">'+roomName+'</option>');
    user.roomList[roomName] = roomName;
  }
};

app.addFriend = function(friendName){
  user.friendList[_.escape(friendName)] = _.escape(friendName);
};

app.handleSubmit = function(message){
  var messageObj = {
    username: user.myUsername,
    text: message,
    roomname: user.currentRoom
  };
  app.send(messageObj);
};

app.init();
