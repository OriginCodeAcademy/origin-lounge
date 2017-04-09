
var app = require('http').createServer();

// initializes a new instance of socket.io by passing the app object
var io = require('socket.io')(app);

var port = process.env.PORT || 3002;

require('./socket')(app, io);

// make http server listen on port 3002
app.listen(port, function(){
  console.log('listening on *:3002');
});

