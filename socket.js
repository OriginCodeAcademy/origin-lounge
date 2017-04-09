module.exports = function(app,io){

	// socket.io server's list of users connected
	var users = [];

	var user = {};

	// Initialize a new socket.io application, named 'chat'
	var chat = io.on('connection', function (socket) {

	  // socket.io server's list of chat rooms
	  socket.room = [];
	  
	  console.log('a user connected', socket.id);

	  // socket.io listener for when a client disconnects
	  socket.on('disconnect', function() {
	    
	    console.log('user disconnected', socket.userid);
	    // grab the index where the specific user's id is located within the global users array
	    var index = users.indexOf(socket.userid);
	    // remove said user id from the global users array
	    if (index > -1) {
	    	users.splice(index,1);
	    }

	    // remove user from all rooms they were in
	    for (var i = 0; i < socket.room.length; i++) {
	    	socket.leave(socket.room[i]);	
	    }
	    
	    console.log(users);

	    // let all clients know that this client has logged out and send along the latest snapshot of users 
	    // currently registered
	    socket.broadcast.emit('logged out', {users:users, userLoggedOut:socket.userid});

	  });

	  // socket.io listener for when a chat message comes in from a client
	  socket.on('chat message', function(msg) {
	  	// send chat message to all clients except the client that sent the message
	  	socket.broadcast.to(msg.chatid).emit('chat message', msg);
	    console.log(msg.chatid);

	  });

	  // socket.io listener for when a file has been sent from a client
	  socket.on('send file info', function(msg) {
	  	console.log("in 'send file info' listenter");
	  	// send file to all clients except the client that sent the message
	  	socket.broadcast.to(msg.chatid).emit('receive file info', msg);
	  });

	  // socket.io listener that adds client to socket.io server's user list, and all rooms the client is 
	  // subscribed to. It also lets all other clients know that this client has logged in.
	  socket.on('add user', function(msg) {
	
		// assign the client's userid to the socket object
	  	socket.userid = msg.userid;
	  	// add userid to the list of users 
	  	users.push(msg.userid);
	  	
	  	// add the client to a room for each chat it is a part of
	  	for (var i = 0; i < msg.chatGroups.length; i++) {
	  		// add each room to the socket object
	  		socket.room[i] = msg.chatGroups[i]._id;
	  		//join each room
	  		socket.join(msg.chatGroups[i]._id);
	  	}

	  	console.log(users);
	  	console.log(socket.userid);
	  	console.log(socket.room);

	  	// send all clients the notification that this client has logged in and pass along the local
	  	// list of users
	  	io.sockets.emit('logged in', {users:users, userLoggedIn: msg.userid});

	  });

	  // socket.io listener that enables a client to notify other clients that it added them to a new chat room
	  // and adds the client that created said room, to said room.
	  socket.on('create chatroom notification', function(msg) {
	  	console.log(msg);
	  	socket.room.push(msg._id);
	  	console.log(socket.room);
	  	socket.join(msg._id);
	  	// notify all other clients that are part of this new room
	  	socket.broadcast.emit('notify chatroom created', msg);

	  });

	  // socket.io listener that enables clients to add themselves to the new room that they are a part of (that was created by another client)
	  socket.on('create chatroom', function(msg) {
	  	console.log(msg);
	  	socket.room.push(msg._id);
	  	console.log(socket.room);
	  	socket.join(msg._id);
	  	// notify the client that requested to be added to said room, that the room was successfully created.
	  	socket.emit('chatroom created', msg);
	  });

	});
};