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
        $rootScope.roomid = $stateParams.messagerecipient_id;

        // grab name of chat from the calendar state and bind to view (once the user clicks on the name of a chat room)
        vm.chatRoomName = $stateParams.chatRoomName;
        vm.title = 'chatController';

        activate();

        // if you don't specify a URL within io() it will default to connecting to the host that serves the page
        // $rootScope.socket = io(chatServerURLAndPort);
        
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
            dateTimeCreated: dateTimeCreated,
            roomid: $rootScope.roomid
          };
          // emit a chat message that includes the datetime created as well as the username and userId
          //socket.emit('chat message', $('#m').val());

          // send the chat message out
          //$rootScope.socket.emit('chat message', chatMessage);
          chatFactory.emit('chat message', chatMessage);
          // blank out the chat message form after the message was emitted
          $('#m').val('');
          // unsure why the need to return a false...
          return false;
        });

        function activate() {

        }
    }
})();