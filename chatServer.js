// BASE SETUP
// =============================================================================
var http = require('http');
var express = require('express'),
    app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server); 
var bodyParser = require('body-parser');
/*
// call the packages we need
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();
var io = require('socket.io').listen(app);
var socket = require('./app/server/routes/socket.js');
console.log("app: " + app);
console.log("io: " + io);
console.log("socket: " + socket);
var server = http.createServer(app);
*/

// configure app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 4000; // set our port

var mongoose = require('mongoose');
mongoose.connect('mongodb://origin-dev:pass1@ds149297-a0.mlab.com:49297/heroku_nrxdgp9h/'); 
var Messages = require('./app/models/chat/message');
var MessagesRecipients = require('./app/models/chat/messagerecipients');

// create our router
var router = express.Router();


// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log("connected to chat")
    next();
});


app.get('/chat/', function(req, res){
  res.sendFile(__dirname + '/app/Chat/chat.html');
});


//=============================================================================
// on routes that end in /messagerecipients
// ----------------------------------------------------
router.route('/messagerecipients')

// get all of the users messagerecipients by ID
.get(function(req, res) {
    MessagesRecipients.find(function(err, category) {
        if (err)
            res.send(err);

        res.json(category);
    });
});

router.route('/messagerecipients/:userid')

// get all of the users messagerecipients by ID
.get(function(req, res) {
    MessagesRecipients.find({"userid": req.params.userid }, {"usernames":1, _id:0, "chatid":1, "groupname":1},function(err, messagerecipients) {
        if (err)
            res.send(err);

        res.json(messagerecipients);
    });
})

.post(function(req, res) {
    var messagesRecipients = new MessagesRecipients();
    messagesRecipients.userId = req.body.userid;
    messagesRecipients.username = req.body.username;
    messagesRecipients.chatid = req.body.chatid;
    messagesRecipients.groupid = req.body.groupid;
    messagesRecipients.channelname = req.body.channelname;
});

//=============================================================================
// on routes that end in /messages
// ----------------------------------------------------
router.route('/messages/:chatid')

// get all messages from chatid
.get(function(req, res) {
    Messages.find({"chatid": req.params.chatid}, function(err, messages) {
        if(err) res.send(err);

        res.json(messages);
    });
});

io.attach(http);
io.sockets.on('connection', socket);



// REGISTER OUR ROUTES -------------------------------
server.use('/chat', router);



// START THE SERVER
// =============================================================================
server.listen(port);
console.log('Chat is on localhost:' + port);