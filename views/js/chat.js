var socket = io.connect();

socket.on('message:receive', function (data) {
  $("div#chat-area").prepend("<div>" + "username: " + data.username + " message: " + data.message + "</div>");
});

// Read log for the first time (data sent from server)
socket.on('message:load', function(data) {
  $("div#chat-area").prepend("<div>" + "username: " + data.username + " message: " + data.message + "</div>");
});

function send() {
  var msg = $("input#message").val();
  $("input#message").val("");
  var uname = $("input#username").val();
console.log(uname);
  socket.emit('message:send', { message: msg, username: uname});
}
