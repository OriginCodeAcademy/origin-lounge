(function() {
    'use strict';

    angular
        .module('app')
        .controller('chatController', chatController);

    chatController.$inject = [
      'Upload',
      'chatFactory',
      'storageFactory',
      '$rootScope',
      '$stateParams',
      'chatServerURLAndPort',
      'originLoungeExpressAPIBaseURL'
    ];
    
    /* @ngInject */
    function chatController(
      Upload,
      chatFactory,
      storageFactory,
      $rootScope,
      $stateParams,
      chatServerURLAndPort,
      originLoungeExpressAPIBaseURL) {
      
        var vm = this;
        
        // list of users in chat
        var participants = [];

        // one user in the chat
        var participant = {};

        //grab chatid from the calendar state (once the user clicks on the name of a chat room)
        $rootScope.chatid = $stateParams.chatid;

        // grab name of chat from the calendar state and bind to view (once the user clicks on the name of a chat room)
        vm.chatRoomName = $stateParams.chatRoomName;
        
        // on click function for when user clicks "Send" in chat room
        vm.sendChatMessage = sendChatMessage;

        // flag to tell if a file is in process of being uploaded
        vm.fileUploadInProgress = false;

        // on click function for uploading files to server (and possibly attaching them to the room in which they were sent?)
        vm.upload = upload;

        // on click function for downloading a file from the server
        vm.download = download;

        activate();

        function activate() {

          console.log($rootScope.usersLoggedIn);
          // isLoggedIn

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

          // get all users associated with a chat room
          getAllUsersInAChatRoom();

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

        // get list of all users that are associated with a specific chat room
        function getAllUsersInAChatRoom() {

          // make the call to the express API to get all users for a specific chat room
          chatFactory.getAllUsersInAChatRoom($rootScope.chatid).then(

            function(response) {

              // grab the # of users subscribed to this chat room and display to the view
              vm.usersSubscribedToChatRoom = response.users.length;

              // zero out #of users online and subscribed to this chatroom before finding out just how many are in this chat room
              $rootScope.usersOnlineAndSubscribedToChatRoom = 0;

              // loop through all the users subscribed to this specific chat 
              loop1: 
              for (var i = 0; i < response.users.length; i++) {
                // loop through all the users logged in and see which match the users subscribed to this chatroom
                loop2:
                for (var j = 0; j < $rootScope.usersLoggedIn.length; j++) {
                  // check to see if any of the users logged in are in this specific chat room
                  if (response.users[i].userid === $rootScope.usersLoggedIn[j]){
                    // if the user is online, build up the user object to indicate the user is online (set isLogged in to true)
                    
                    $rootScope.usersOnlineAndSubscribedToChatRoom++;
                    participant = {
                      isLoggedIn: true,
                      userid: response.users[i].userid,
                      username: response.users[i].username
                    };
                    // add the user that is online to the list of users to be displayed to the chat view
                    participants.push(participant);

                    // break out of loop 2
                    break loop2; 
                  // if user is not online, build up the user object accordingly (set isLoggedIn to false)
                  } else if (j === $rootScope.usersLoggedIn.length - 1) {

                    participant = {
                      isLoggedIn: false,
                      userid: response.users[i].userid,
                      username: response.users[i].username
                    };
                    // add the user that is not online to the list of users to be displayed to the chat view
                    participants.push(participant);

                  }

                }

              }

              console.log(participants);

              $rootScope.participants = participants;

            },

            function(error){

              console.log(error);
            }

          ); 

        }

        // upload on file select
        function upload (file) {

              // catch the upload file event that's triggered when the user clicks on the + button
              if (file === null)
                return;

              // grab username
              var username = storageFactory.getLocalStorage('userSession').user.userName;

              console.log(file);

              Upload.upload({
                  url: originLoungeExpressAPIBaseURL + 'files',
                  data: {file: file, 'username': username}
              }).then(

              function (resp) {
                  console.log(resp);
                  console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
              },

              function (error) {
                  console.log('Error status: ' + error.status);
              },

              function (evt) {
                  vm.fileUploadInProgress = true;
                  var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    if (progressPercentage === 100)
                      vm.fileUploadInProgress = false;
                  console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
              });
          };

          function download(fileId) {

            chatFactory.downloadFile(fileId).then(

              function (response) {
                console.log(response);
              },

              function (error) {

                console.log(error);
              }
            );
          }
        }
})();