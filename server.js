
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io').listen(http, {
    'log level': 2
});
//var chat = require('/app/Chat');
//module.exports = express.createServer();

var mongoose = require('mongoose');
connections = [];
var username = "Phoenix";
var chatId; // will be unique for each chatroom
var userId = 1; // specific users will be given here 

// Keep the above code in server.js



mongoose.Promise = global.Promise;
// connects the chat to the database
mongoose.connect('mongodb://origin-dev:pass1@ds149297-a0.mlab.com:49297/heroku_nrxdgp9h/chat', function(err){ 
	if(err) {
		console.log(err);
	} else {
		console.log('Connection Successful!');
	}
});

var chatSchema = mongoose.Schema({ // message setup
	message: String,
	sender: String, 
	chatid: String,
	created: {type: Date, default: Date.now()}
}, {versionKey: false}); // get rid of the "_v" on the mongo table

var Chat = mongoose.model('Message', chatSchema);

// create unique chatroom (will use if statement to parse through current chatrooms)
chatId = Math.round((Math.random() * 10000000));
console.log("Current Chatroom: " + chatId);




io.on('connection', function(socket){
	// show connection
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);
	if (connections.length % 2 !== 1) {username = "Chloe"} else {username = "Phoenix"};
	console.log("Current user: " + username);
	// show disconnections
	socket.on('disconnect', function(data) {
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets connected', connections.length);
	});

	//send message
  	socket.on('chat message', function(msg){
  		var newMsg = new Chat({message: msg, sender: userId, chatid: chatId}); // logs messages
  		newMsg.save(function(err) {
  			if(err) throw err;
    		io.emit('chat message',  username + ': ' + msg);
    	});
  	});
});





/*app.use('/', function(req, res){
  res.location( __dirname + '/app/Chat');
});*/
// keep the listening code within the server.js
app.get('/', function(req, res){
  res.sendFile(__dirname + '/app/Chat/chat.html');
});

http.listen(3000, function(){
  console.log('currently running at: localhost:' + 3000 + chatId);
});

