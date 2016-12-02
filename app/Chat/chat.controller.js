(function() {
    'use strict';

    angular
        .module('app')
        .controller('chatController', chatController);

    chatController.$inject = ['chatFactory', 'storageFactory','$rootScope', '$stateParams','chatServerURLAndPort'];
    
    /* @ngInject */
    function chatController(chatFactory, storageFactory, $rootScope, $stateParams, chatServerURLAndPort) {
        var vm = this;
        
        //grab messagerecipient_id from the calendar state (once the user clicks on the name of a chat room)
        $rootScope.chatid = $stateParams.chatid;

        // grab name of chat from the calendar state and bind to view (once the user clicks on the name of a chat room)
        vm.chatRoomName = $stateParams.chatRoomName;
        
        // on click function for when user clicks "Send" in chat room
        vm.sendChatMessage = sendChatMessage;

        activate();

        function activate() {

          // get message history and display it to chat room
          chatFactory.getAllMessagesForAChatRoom($rootScope.chatid).then(

            function(response){

              // store message history 
              $rootScope.messages = response;
              console.log(response);

            },

            function(error){

              console.log(error);
            }
          );

          // get list of all users in a specific chat room
          chatFactory.getAllUsersInAChatRoom($rootScope.chatid).then(

            function(response) {

              // store chat room participants
              $rootScope.participants = response.users;
              console.log(response);
            },

            function(error){

              console.log(error);
            }

          ); 

        }
        // when user clicks submit in the chat message form, do the following
       function sendChatMessage() {
       
          // grab username and userId from local storage, as well as the current date/time
          var username = storageFactory.getLocalStorage('userSession').user.userName;
          var userId = storageFactory.getLocalStorage('userSession').user.userId;
          var dateTimeCreated = new Date().toISOString();

          // create an object with chat info to send out
          var chatMessage = {

            sender: username,
            userId: userId,
            message: vm.chatMessage,
            created: dateTimeCreated,
            chatid: $rootScope.chatid
          };

          // send the chat message out to the socket.io server
          chatFactory.emit('chat message', chatMessage);
          // blank out the chat message form after the message was emitted
          vm.chatMessage = '';
          // add message to message table in Express API server
          chatFactory.postMessage(chatMessage).then(

            function(response) {

              // add latest message to local list of messages
              $rootScope.messages.push(chatMessage);
              console.log(response);
            },

            function(error) {

              console.log(error);
            }
          );
        }
    }
})();