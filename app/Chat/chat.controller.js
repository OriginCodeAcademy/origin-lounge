(function() {
    'use strict';

    angular
        .module('app')
        .controller('chatController', chatController);

    chatController.$inject = ['chatFactory', 'storageFactory','$rootScope', 'chatServerURLAndPort'];
    
    /* @ngInject */
    function chatController(chatFactory, storageFactory, $rootScope, chatServerURLAndPort) {
        var vm = this;
        vm.title = 'chatController';

        activate();

        ////////////////

        function activate() {

            // if you don't specify a URL within io() it will default to connecting to the host that serves the page
            $rootScope.socket = io(chatServerURLAndPort);
            
            // when user clicks submit in the chat message form, do the following
            $('form').submit(function() {
              // grab username and userId from local storage, as well as the message typed into the form and the current date/time
              var username = storageFactory.getLocalStorage('userSession').user.userName;
              var userId = storageFactory.getLocalStorage('userSession').user.userId;
              var message = $('#m').val();
              var dateTimeCreated = new Date().toISOString();

              // create an object with chat info to send out
              var chatMessage = {

                username: username,
                userId: userId,
                message: message,
                dateTimeCreated: dateTimeCreated
              };
              // emit a chat message that includes the datetime created as well as the username and userId
              //socket.emit('chat message', $('#m').val());

              // send the chat message out
              $rootScope.socket.emit('chat message', chatMessage);
              // blank out the chat message form after the message was emitted
              $('#m').val('');
              // unsure why the need to return a false...
              return false;
            });
            
            // capture a user connected event coming from server
            $rootScope.socket.on('user connected', function(msg){
              // add chat message to the unordered list on this html page
              $('#messages').append($('<li>').text(msg)); 
            });

            // capture a chat message coming from the server
            $rootScope.socket.on('chat message', function(msg){
              // add chat message to the unordered list on this html page
              $('#messages').append($('<li>').text(msg.username + ' said: ' + msg.message));
            });

            // capture a user disconnection event coming from server
            $rootScope.socket.on('user disconnected', function(msg){
              // add chat message to the unordered list on this html page
              $('#messages').append($('<li>').text(msg)); 
                
            });
            
             //    	chatFactory.socket.on('send:message', function (message) {
            	// 		vm.messages.push(message);
          			// });
        }
    }
})();