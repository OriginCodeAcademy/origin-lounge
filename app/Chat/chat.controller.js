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

        vm.chatMessage = '';

        //grab chatid from the calendar state (once the user clicks on the name of a chat room)
        $rootScope.chatid = $stateParams.chatid;

        // grab name of chat from the calendar state and bind to view (once the user clicks on the name of a chat room)
        vm.chatRoomName = $stateParams.chatRoomName;
        
        // on click function for when user clicks "Send" in chat room
        vm.sendChatMessage = sendChatMessage;

        // flag to tell if a file is in process of being uploaded
        vm.fileUploadInProgress = false;

        $rootScope.numberOfFilesSharedInChatRoom = '';

        // on click function for uploading files to server (and possibly attaching them to the room in which they were sent?)
        vm.upload = upload;

        // on click function for downloading a file from the server
        vm.downloadFile = downloadFile;

        /**************************** FOR EMOJI PICKER ***************************************/
        $(document).ready(function() {
          // Initializes and creates emoji set from sprite sheet
          window.emojiPicker = new EmojiPicker({
          emojiable_selector: '[data-emojiable=true]',
          assetsPath: 'lib/img/',
          popupButtonClasses: 'fa fa-smile-o'
          });
          // Finds all elements with emojiable_selector and converts them to rich emoji input fields
          // You may want to delay this step if you have dynamically created input fields that appear later in the loading process
          // It can be called as many times as necessary; previously converted input fields will not be converted again
          window.emojiPicker.discover();
        });

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

          // get all users associated with a chat room
          getAllUsersInAChatRoom();

        }
        // when user clicks submit in the chat message form, do the following
       function sendChatMessage() {
       
          var chatMessageEntered;
          var chatMessageWithEmojisInShortForm;

          // grab username and userId from local storage, as well as the current date/time
          var username = storageFactory.getLocalStorage('userSession').user.userName;
          var userId = storageFactory.getLocalStorage('userSession').user.userId;
          var dateTimeCreated = new Date().toISOString();


          chatMessageEntered = document.getElementById('chatmessage').value;
          
          // check to see if user typed in /giphy
          if (chatMessageEntered.indexOf("/giphy ") !== -1) {
            //strip out /giphy and pass along what follows to the giphy API to get the random image
            chatMessageEntered = chatMessageEntered.replace("/giphy ", "");
            getGiphy(chatMessageEntered, username, userId, dateTimeCreated);

          } else {
          
              // these two statements are needed in order to take a unicode emoji and convert it to "colon" style (i.e. :smile:)
              chatMessageEntered = document.getElementById('chatmessage').value;
              chatMessageWithEmojisInShortForm = emojione.toShort(chatMessageEntered);

              // create an object with chat info to send out
              var chatMessage = {

                sender: username,
                userId: userId,
                message: chatMessageWithEmojisInShortForm,
                created: dateTimeCreated,
                chatid: $rootScope.chatid
              };

              // send the chat message out to the socket.io server
              chatFactory.emit('chat message', chatMessage);

              // blank out the chat message form after the message was emitted (emoji-wysiwyg-editor is the class associated with the content editable div that gets inserted into
              // the element that is tagged with data-emojiable=true)
              $('.emoji-wysiwyg-editor').empty();

              // add message to message table in Express API server
              postChatMessage(chatMessage);
          }

        }

        // get all the files that are shared in a chat room
        function getAllFilesSharedInAChatRoom(chatId){

          chatFactory.getAllFilesSharedInAChatRoom(chatId).then(
            
            function(response) {

              console.log("Response from getAllFilesSharedInAChatRoom" + response);
              $rootScope.filesSharedInChatRoom = response;
              $rootScope.numberOfFilesSharedInChatRoom = response.length;
            },

            function(error){

              console.log("Error from getAllFilesSharedInAChatRoom" + error);
            }

          );
        }

        // get list of all users that are associated with a specific chat room
        function getAllUsersInAChatRoom() {

          // make the call to the express API to get all users for a specific chat room
          chatFactory.getAllUsersInAChatRoom($rootScope.chatid).then(

            function(response) {

              getAllFilesSharedInAChatRoom($rootScope.chatid);
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

        function getGiphy(chatMessageEntered, username, userId, dateTimeCreated) {

          chatFactory.getGiphy(chatMessageEntered).then(

            function(response) {
              console.log(response.images.fixed_height.url);
              vm.giphy = '<img src="' + response.images.fixed_height.url + '">';
              // create an object with chat info to send out
              var chatMessage = {

                sender: username,
                userId: userId,
                message: vm.giphy,
                created: dateTimeCreated,
                chatid: $rootScope.chatid
              };

              // send the chat message out to the socket.io server
              chatFactory.emit('chat message', chatMessage);
              // blank out the chat message form after the message was emitted (emoji-wysiwyg-editor is the class associated with the content editable div that gets inserted into
              // the element that is tagged with data-emojiable=true)
              $('.emoji-wysiwyg-editor').empty();
              // add message to message table in Express API server
              postChatMessage(chatMessage);

            },

            function (error) {

            }
          );
        }

        // post a chat message to mongoDB
        function postChatMessage(chatMessage){
          // issue POST request
          chatFactory.postMessage(chatMessage).then(
            // handle success response to POST
            function(response) {

              // add latest message to local list of messages
              $rootScope.messages.push(chatMessage);
              console.log(response);
            },
            // handle error response to POST
            function(error) {

              console.log(error);
            }
          );

        }

        // upload a file to GRIDfs collections on mongoDB
        function upload (file) {

              // catch the upload file event that's triggered when the user clicks on the + button
              if (file === null)
                return;

              // grab username
              var username = storageFactory.getLocalStorage('userSession').user.userName;

              console.log(file);

              // send upload request
              Upload.upload({
                  url: originLoungeExpressAPIBaseURL + 'files',
                  data: {file: file, 'username': username, 'chatid': $rootScope.chatid}
              }).then(

              // response to upload request (represents when file has finished being written to backend)
              function (resp) {
                  console.log(resp);
                  console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
  
                  // hide file upload progress bar
                  vm.fileUploadInProgress = false;
                  
                  // construct "uploaded file" chat message 
                  var message = 'uploaded a file: ' + resp.config.data.file.name;

                  // create the chat message to send to other clients in the room and to the express API DB
                  var chatMessage = {
                    sender: resp.config.data.username,
                    userId: resp.data.id, // need to create another field in the chat message table for a fileid if we want to have a link to download the file, within the message itself
                    message: message,
                    created: resp.data.dateUploaded,
                    chatid: resp.config.data.chatid 
                  };                  
                  // send chat message to socket.io server to broadcast to everyone in this chatroom
                  chatFactory.emit("send file info", chatMessage);

                  // send chat message to express API DB
                  postChatMessage(chatMessage);

                  // get latest snapshot of files associated with the chatroom 
                  getAllFilesSharedInAChatRoom($rootScope.chatid);


              },

              // error handler
              function (error) {
                  console.log('Error status: ' + error.status);
              },

              // upload progress handler (not representative of when file write is complete on backend)
              function (evt) {
                  vm.fileUploadMessage = "Uploading " + evt.config.data.file.name + "... , please be patient!";
                  vm.fileUploadInProgress = true;
                  var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                  console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
              });
          };

          // download a file from GridFS collection in mongoDB
          function downloadFile(fileId, filename) {

            chatFactory.downloadFile(fileId, filename).then(

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