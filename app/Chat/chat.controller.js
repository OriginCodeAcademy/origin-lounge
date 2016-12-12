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
    

    function chatController(
      Upload,
      chatFactory,
      storageFactory,
      $rootScope,
      $stateParams,
      chatServerURLAndPort,
      originLoungeExpressAPIBaseURL) {
      
        var vm = this;
        
        // List of users in chat
        var participants = [];
        // One user in the chat
        var participant = {};

        vm.chatMessage = '';
        // Grab name of chat from the calendar state and bind to view (once the user clicks on the name of a chat room)
        vm.chatRoomName = $stateParams.chatRoomName;
        // Flag to tell if a file is in process of being uploaded
        vm.fileUploadInProgress = false;

        // Grab chatid from the calendar state (once the user clicks on the name of a chat room)
        $rootScope.chatid = $stateParams.chatid;
        // Global counter for how many files are shared in a chat room
        $rootScope.numberOfFilesSharedInChatRoom = '';

        // On click function for downloading a file from the server
        vm.downloadFile = downloadFile;       
        // On click function for when user clicks "Send" in chat room
        vm.sendChatMessage = sendChatMessage;
        // On click function for uploading files to server (and possibly attaching them to the room in which they were sent?)
        vm.upload = upload;

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
        /**************************************************************************************/

        activate();

        function activate() {

          // This is a hack to tell the window.onbeforeunload event (within app.js) that we are in the chat state,
          // so don't clear local storage and log us out when we close the browser from this state. Otherwise when a 
          // user clicks on a linked file in a chat message, they would be kicked out of the page without getting the file 
          $rootScope.inChatState = true;

          // Get message history and display it to chat room
          chatFactory.getAllMessagesForAChatRoom($rootScope.chatid).then(

            function(response) {

              // Store message history to global scope
              $rootScope.messages = response;
              console.log(response);

            },

            function(error) {

              console.log(error);
            }
          );

          // Get all users associated with a chat room
          getAllUsersInAChatRoom();

        }
        // When user clicks submit in the chat message form, do the following
       function sendChatMessage() {
       
          var chatMessageEntered;
          // Version of chat message that has emojis converted into their short form (i.e. smile emoji becomes ':smile:')
          var chatMessageWithEmojisInShortForm;

          // Grab username and userId from local storage, as well as the current date/time
          var username = storageFactory.getLocalStorage('userSession').user.userName;
          var userId = storageFactory.getLocalStorage('userSession').user.userId;
          var dateTimeCreated = new Date().toISOString();

          // Grab the chat message 
          chatMessageEntered = document.getElementById('chatmessage').value;
          
          // Check to see if user typed in /giphy and that it was the very first thing typed
          if (chatMessageEntered.indexOf("/giphy ") === 0) {
            // If '/giphy ' was found, then strip out /giphy and pass along what follows to the giphy API to get the random image
            chatMessageEntered = chatMessageEntered.replace("/giphy ", "");
            getGiphy(chatMessageEntered, username, userId, dateTimeCreated);

          } else {
              // If '/giphy ' was not found, then convert unicode emoji to "colon" style (i.e. :smile:)
              chatMessageEntered = document.getElementById('chatmessage').value;
              chatMessageWithEmojisInShortForm = emojione.toShort(chatMessageEntered);

              // Create chat message object to send
              var chatMessage = {

                sender: username,
                userId: userId,
                message: chatMessageWithEmojisInShortForm,
                created: dateTimeCreated,
                chatid: $rootScope.chatid
              };

              // Send the chat message out to the socket.io server
              chatFactory.emit('chat message', chatMessage);

              // Blank out the chat message form after the message was emitted.
              // Emoji-wysiwyg-editor is the class associated with the content editable div that gets inserted into
              // the element that is tagged with data-emojiable=true
              $('.emoji-wysiwyg-editor').empty();

              // Add message to message table in Express API DB
              postChatMessage(chatMessage);
          }

        }

        // Get all the files that are shared in a chat room
        function getAllFilesSharedInAChatRoom(chatId) {
          // Reach out to MongoDB to get all files stored for this chat room
          chatFactory.getAllFilesSharedInAChatRoom(chatId).then(
            
            function(response) {

              console.log("Response from getAllFilesSharedInAChatRoom" + response);
              // Add files for this chat room to the global list of files for said chat room
              $rootScope.filesSharedInChatRoom = response;
              // Grab the total # of files for this chat room and store it globally
              $rootScope.numberOfFilesSharedInChatRoom = response.length;
            },

            function(error) {

              console.log("Error from getAllFilesSharedInAChatRoom" + error);
            }

          );
        }

        // Get list of all users that are associated with a specific chat room
        function getAllUsersInAChatRoom() {

          // Make the call to the express API to get all users for a specific chat room
          chatFactory.getAllUsersInAChatRoom($rootScope.chatid).then(

            function(response) {
              // Get all Files associated with a chat room
              getAllFilesSharedInAChatRoom($rootScope.chatid);
              // Grab the # of users subscribed to this chat room and display to the view
              vm.usersSubscribedToChatRoom = response.users.length;

              // Zero out #of users online and subscribed to this chatroom before finding out just how many are in this chat room
              $rootScope.usersOnlineAndSubscribedToChatRoom = 0;

              // Loop through all the users subscribed to this specific chat 
              loop1: 
              for (var i = 0; i < response.users.length; i++) {
                // Loop through all the users logged in and see which match the users subscribed to this chatroom
                loop2:
                for (var j = 0; j < $rootScope.usersLoggedIn.length; j++) {
                  // Check to see if any of the users currently logged in are in this specific chat room
                  if (response.users[i].userid === $rootScope.usersLoggedIn[j]){
                    // If the user is online, build up the user object to indicate the user is online (set isLogged in to true)
                    // Also increment the global variable that keeps track of how many users that are subscribed to this room
                    // and are online
                    
                    $rootScope.usersOnlineAndSubscribedToChatRoom++;
                    participant = {
                      isLoggedIn: true,
                      userid: response.users[i].userid,
                      username: response.users[i].username
                    };
                    // Add the user that is online to the list of users to be displayed to the chat view
                    participants.push(participant);

                    // Break out of loop 2
                    break loop2; 
                  // If user is not online, build up the user object accordingly (set isLoggedIn to false)
                  } else if (j === $rootScope.usersLoggedIn.length - 1) {

                    participant = {
                      isLoggedIn: false,
                      userid: response.users[i].userid,
                      username: response.users[i].username
                    };
                    // Add the user that is not online to the list of users to be displayed to the chat view
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

        // Function that will get a random Giphy based on a what was typed after '/giphy '
        function getGiphy(chatMessageEntered, username, userId, dateTimeCreated) {
          // Grab random Giphy from Giphy's DB
          chatFactory.getGiphy(chatMessageEntered).then(

            function(response) {
              console.log(response.images.fixed_height.url);

              // Construct the html for the giphy to be displayed
              vm.giphy = '<img src="' + response.images.fixed_height.url + '">';

              // Create an object with chat info to send out
              var chatMessage = {

                sender: username,
                userId: userId,
                message: vm.giphy,
                created: dateTimeCreated,
                chatid: $rootScope.chatid
              };

              // Send the chat message out to the socket.io server
              chatFactory.emit('chat message', chatMessage);
              // Blank out the chat message form after the message was emitted.
              // Emoji-wysiwyg-editor is the class associated with the content editable div that gets inserted into
              // the element that is tagged with data-emojiable=true
              $('.emoji-wysiwyg-editor').empty();
              // Add message to message table in Express API DB
              postChatMessage(chatMessage);

            },

            function (error) {

            }
          );
        }

        function getclickablefileThumbnail (fileType, fileId) {

          switch(fileType) {

            case 'image/jpeg':
              console.log('Got a jpeg');
              return '<a href="http://localhost:3000/api/files/'+ fileId + '" download><img class="image-thumbnail" src="http://localhost:3000/api/files/'+ fileId + '"></a>';
              break;

            case 'image/png':
              console.log('Got a png');
              return '<a href="http://localhost:3000/api/files/'+ fileId + '" download><img class="image-thumbnail" src="http://localhost:3000/api/files/'+ fileId + '"></a>';
              break;

            case 'image/gif':
              return '<a href="http://localhost:3000/api/files/'+ fileId + '" download><img class="image-thumbnail" src="http://localhost:3000/api/files/'+ fileId + '"></a>';
              break;

            case 'image/svg+xml':
              console.log('Got an svg');
              return '<a href="http://localhost:3000/api/files/'+ fileId + '" download><img class="image-thumbnail" src="http://localhost:3000/api/files/'+ fileId + '"></a>';
              break;

            case 'text/plain':
              console.log('Got a txt file');
              return '<a href="http://localhost:3000/api/files/'+ fileId + '" download><img class="document-thumbnail" src="/app/img/txt.svg"></a>';
              break;

            case 'application/pdf':
              console.log('Got a pdf');
              return '<a href="http://localhost:3000/api/files/'+ fileId + '" download><img class="document-thumbnail" src="/app/img/pdf.svg"></a>';
              break;

            case 'text/css':
              console.log('Got a css file');
              return '<a href="http://localhost:3000/api/files/'+ fileId + '" download><img class="document-thumbnail" src="/app/img/css.svg"></a>';
              break;

            case 'application/javascript':
              console.log('Got a js file');
              return '<a href="http://localhost:3000/api/files/'+ fileId + '" download><img class="document-thumbnail" src="/app/img/javascript.svg"></a>';
              break;

            case 'application/msword':
              console.log('Got a word file');
              return '<a href="http://localhost:3000/api/files/'+ fileId + '" download><img class="document-thumbnail" src="/app/img/doc.svg"></a>';
              break;

            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
              console.log('Got a word file');
              return '<a href="http://localhost:3000/api/files/'+ fileId + '" download><img class="document-thumbnail" src="/app/img/doc.svg"></a>';
              break;

            case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
              console.log('Got a ppt file');
              return '<a href="http://localhost:3000/api/files/'+ fileId + '" download><img class="document-thumbnail" src="/app/img/ppt.svg"></a>';
              break;

            case 'application/vnd.ms-powerpoint':
              console.log('Got a ppt file');
              return '<a href="http://localhost:3000/api/files/'+ fileId + '" download><img class="document-thumbnail" src="/app/img/ppt.svg"></a>';
              break;

            case 'application/vnd.ms-excel':
              console.log('Got an excel file');
              return '<a href="http://localhost:3000/api/files/'+ fileId + '" download><img class="document-thumbnail" src="/app/img/xls.svg"></a>';
              break; 

            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
              console.log('Got an excel file');
              return '<a href="http://localhost:3000/api/files/'+ fileId + '" download><img class="document-thumbnail" src="/app/img/xls.svg"></a>';
              break;

            case 'application/x-msdownload':
              console.log('Got an exe file');
              return '<a href="http://localhost:3000/api/files/'+ fileId + '" download><img class="document-thumbnail" src="/app/img/exe.svg"></a>';
              break;

            default:
              console.log('Got type that there is no case statement for...');
              return '<a href="http://localhost:3000/api/files/'+ fileId + '" download><img class="document-thumbnail" src="/app/img/file.svg"></a>';
              break;
          }
        }

          function getDocumentThumbnailIcon (fileType) {

            switch(fileType) {

              case 'text/plain':
                console.log('Got a txt file');
                return 'txt.svg';
                break;

              case 'application/pdf':
                console.log('Got a pdf');
                return 'pdf.svg';
                break;

              case 'text/css':
                console.log('Got a css file');
                return 'css.svg';
                break;

              case 'application/javascript':
                console.log('Got a js file');
                return 'javascript.svg';
                break;

              case 'application/msword':
                console.log('Got a word file');
                return 'doc.svg';
                break;

              case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                console.log('Got a word file');
                return 'doc.svg';
                break;

              case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                console.log('Got a ppt file');
                return 'ppt.svg';
                break;

              case 'application/vnd.ms-powerpoint':
                console.log('Got a ppt file');
                return 'ppt.svg';
                break;

              case 'application/vnd.ms-excel':
                console.log('Got an excel file');
                return 'xls.svg';
                break; 

              case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                console.log('Got an excel file');
                return 'xls.svg';
                break;

              case 'application/x-msdownload':
                console.log('Got an exe file');
                return 'exe.svg';
                break;

              default:
                console.log('Got type that there is no case statement for...');
                return null;
                break;

            }
          }

        // Post a chat message to mongoDB
        function postChatMessage(chatMessage) {
          // Issue POST request
          chatFactory.postMessage(chatMessage).then(
            // Handle success response to POST
            function(response) {

              // Add latest message to global list of messages
              $rootScope.messages.push(chatMessage);
              console.log(response);
            },
            // Handle error response to POST
            function(error) {

              console.log(error);
            }
          );

        }

        // Upload a file to GridFS collections in mongoDB
        function upload (file) {

              // Catch the upload file event that's triggered when the user clicks on the + button
              if (file === null)
                return;

              // Grab the user's username
              var username = storageFactory.getLocalStorage('userSession').user.userName;

              console.log(file);

              // Gets the name of the icon file we will use for displaying the document type (only applicable to non-image type docs. If an image, this will be null)
              var documentThumbnailIcon = getDocumentThumbnailIcon(file.type);

              // Send upload request to Express API
              Upload.upload({
                  url: originLoungeExpressAPIBaseURL + 'files',
                  data: {
                    file: file, 
                    'username': username, 
                    'chatid': $rootScope.chatid,
                    'documentThumbnailIcon': documentThumbnailIcon
                  }
              
              }).then(

              // Response to upload request (This represents when file has finished being written to backend)
              function (resp) {
                  
                  // Store the HTML representing a clickable file thumbnail/icon
                  var clickablefileThumbnail;

                  console.log(resp);
                  console.log(resp.config.data.file.type);
                  console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
  
                  // Hide file upload progress bar since we are done uploading
                  vm.fileUploadInProgress = false;
                  
                  // Get the HTML string that will create a clickable file icon/thumbnail within the chat message for the file we are uploading
                  clickablefileThumbnail = getclickablefileThumbnail(resp.config.data.file.type, resp.data.id);
                  // Construct "uploaded file" chat message 
                  var message = 'uploaded a file: ' + resp.config.data.file.name + '<br>' + clickablefileThumbnail;

                  // Create the chat message to send to other clients in the room and to the express API DB
                  var chatMessage = {
                    sender: resp.config.data.username,
                    userId: resp.data.id, // Need to create another field in the chat message table for a fileid if we want to have a link to download the file, within the message itself
                    message: message,
                    created: resp.data.dateUploaded,
                    chatid: resp.config.data.chatid 
                  };                  
                  // Send chat message to socket.io server to broadcast to everyone in this chatroom
                  chatFactory.emit("send file info", chatMessage);

                  // Send chat message to express API DB
                  postChatMessage(chatMessage);

                  // Get latest snapshot of files associated with the chatroom 
                  getAllFilesSharedInAChatRoom($rootScope.chatid);


              },

              // Error handler
              function (error) {
                  console.log('Error status: ' + error.status);
              },

              // Upload progress handler (not representative of when file write is complete on backend)
              function (evt) {
                  vm.fileUploadMessage = "Uploading " + evt.config.data.file.name + "... , please be patient!";
                  vm.fileUploadInProgress = true;
                  var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                  console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
              });
          };

          // Download a file from GridFS collection in mongoDB
          function downloadFile(fileId, filename) {
            // Send GET request to GridFS collection in mongoDB
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