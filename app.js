var express = require('express');
var app = express();
var server = require( 'http' ).Server();
var io = require( 'socket.io' )( server );

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.get('/', function (req, res) {
  res.render('index', { title: 'Express Sample' });
});

app.listen(process.env.PORT || 3000);

// Socket connection 
io.sockets.on('connection', function(socket) {

// Check if db already opend
if (!db.openCalled) {
  db.open(function(){
    readLogFromDb();
  });
} else {
  readLogFromDb();
}

// Send and receive data
  socket.on('message:send', function(data) {

    date = getDateAndTime();
    unixtime = new Date()/1000;
    if (data.message == '') return;
    // comments コレクションに保存
    db.collection("comments", function(err, collection) {
      collection.insert({"message":data.message, "date":date, "unixtime":unixtime, "username":data.username});
      console.log('*** DB insert ***');
    });
    io.sockets.emit('message:receive', { message: data.message, username:data.username});
  });
});

// Function to read mongo db contents
function readLogFromDb(){
  db.createCollection("comments", function(err, collection) {
    cursor = collection.find({}, {"limit":20, "sort":[['unixtime','asc']] });
    cursor.each(function(err, doc) {
      if (doc != null)
        io.sockets.emit('message:load', doc);
    });
  });
}

function getDateAndTime() {              
  dd = new Date();
  year = (dd.getYear() < 2000 ? dd.getYear()+1900 : dd.getYear() );
  month = (dd.getMonth() < 9 ? "0" + (dd.getMonth()+1) : dd.getMonth()+1 );
  day = (dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate() );
  hour = (dd.getHours() < 10 ? "0" + dd.getHours() : dd.getHours() );
  minute = (dd.getMinutes() < 10 ? "0" + dd.getMinutes() : dd.getMinutes() );
  second = (dd.getSeconds() < 10 ? "0" + dd.getSeconds() : dd.getSeconds() );
  return year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
}
