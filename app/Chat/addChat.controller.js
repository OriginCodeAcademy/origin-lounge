(function() {
    'use strict';

    angular
        .module('app')
        .controller('addChatController', addChatController);

    addChatController.$inject = [
        'toastr',
        'chatFactory',
        'DashboardFactory',
        'storageFactory',
        '$state',
        '$rootScope'
        ];
    

    function addChatController(
        toastr,
        chatFactory,
        DashboardFactory,
        storageFactory,
        $state,
        $rootScope) {

        var vm = this;

        var userCurrentlyLoggedIn;

        // For holding the selected users to be added to a direct message/channel
        vm.selectedUsers = [];

        // To capture the channel name to be used for the new channel that is created
        vm.newChannelName = '';

        vm.createChat = createChat;

        activate();

        //////////////

        function activate() {

            // Get id of user currently logged in
            userCurrentlyLoggedIn = storageFactory.getLocalStorage('userSession').user.userId;
        	
            // Get all users from Origin.API DB.
            // Consider replacing this with a read of localstorage (once we add the code to store users into localstorage after we getUsers in the dashboard controller)
            DashboardFactory.getUsers().then(
                function(response) {
        		  
                    // Flag the current user as being logged in.
                    // This can change once we get the Origin API updated to have a flag to notify if a user is logged in or not.
                    for (var i = 0; i < response.length; i++) {

                        if (response[i].Id == userCurrentlyLoggedIn) {
                            response[i].isLoggedIn = true;
                            break;
                        }
                    }
                  vm.users = response;
        		  console.log(vm.users);
        	   },

               function(error) {

               }
            );
        }

        // Creates a new Channel or Direct Message (depends on the channelType received).
        // If creating a direct message, we will pass nothing for channelName (undefined) and instead build
        // up the channel name based on the names of the users being added to said direct message.
        // If creating a channel we will pass the channel name provided.
        function createChat(channelType, channelName) {

            // List of users to add to this new chat
            var usersToAddToNewChat = [];
            // User to add to the new chat
            var userToAddToNewChat = {};

            // Store the channel type (either 'direct' or 'channel')
            var chatType = channelType;
            var chatName = '';
            
            // If channelName is undefined, start building up string of users that are to be added to direct message
            // by starting it off with the username of the user that created this new chat.
            // Otherwise take the channelName received and use it for the name of the channel being created
            if (channelName === undefined) {
                chatName = storageFactory.getLocalStorage('userSession').user.userName + ', ';
            } else {
                chatName  = channelName;
            }
            // Find username that matches userId of selected people to include in the direct message group
            for (var i = 0; i < vm.selectedUsers.length; i++) {
                for (var j = 0; j < vm.users.length; j++) {
                    // If there is a match between the userId of the selected users and a userId within the full list of available users
                    // then build up a new user to add to this chat.
                    // We also want to add this user's username to the name of the new direct message
                    if (vm.selectedUsers[i] === vm.users[j].Id) {
                        // Create user object 
                        userToAddToNewChat = {
                            userid: vm.users[j].Id,
                            username: vm.users[j].FullName
                        };
                        // Build up channelName if creating a direct message.
                        // If it is the last name to be added, don't add a ',' at the end.
                        if ((i === vm.selectedUsers.length - 1) && (channelName === undefined)) {
                            chatName += vm.users[j].FullName;
                        } else if (channelName === undefined) {
                            chatName += vm.users[j].FullName + ', ';   
                        }
                        // Add user object to list of users that will be added to this chat
                        usersToAddToNewChat.push(userToAddToNewChat);
                    }
                }
            }

            // Get userid of user that created this chat
            var userIdOfUserCurrentlyLoggedIn = storageFactory.getLocalStorage('userSession').user.userId;
            // Get username of user that created this chat
            var userNameOfUserCurrentlyLoggedIn = storageFactory.getLocalStorage('userSession').user.userName;
            
            // Build up user object for user that created this chat
            userToAddToNewChat = {
                userid: userIdOfUserCurrentlyLoggedIn,
                username: userNameOfUserCurrentlyLoggedIn
            };

            // Push user object of user that created this chat, into the list of users to add to this new chat
            usersToAddToNewChat.push(userToAddToNewChat);

            console.log(vm.selectedUsers);
            console.log(usersToAddToNewChat);

            // Check to see if the chat name already exists before creating it
            chatFactory.getAllChats().then(

                function(response) {

                    for (var i = 0; i < response.length; i++) {
                        // If chat name already exists then don't create it and return
                        if (chatName === response[i].channelname) {
                            toastr.error("Chat name already exists, please try a different name");
                            return;
                        }
                    }
                    // If chat name doesn't exist then go aehad and create it
                    postChat(chatType, chatName, usersToAddToNewChat);
                },

                function(error) {

                }
            );

        }

        // Function that will add a Chat entry to the MongoDB
        function postChat(chatType, chatName, users) {

            // Send HTTP POST request to create Chat entry in mongoDB
            chatFactory.postChat(chatType, chatName, users).then(

                function(response) {

                    console.log(response);

                    // Update the # of channels or direct messages based on the type of channel that was created
                    if(chatType === 'direct') {
                    
                        $rootScope.numberOfDirectMessages++;
                    
                    } else {
                    
                        $rootScope.numberOfChannels++;
                    
                    }
                    
                    // Let all other socket.io clients be aware that a new chat room was created
                    // and add this client to a new socket.io room as well
                    chatFactory.emit('create chatroom notification', response);
                    // Update this users chatgroup list
                    $rootScope.chatGroups.push(response);  
                    // Jump to the new chat room just created
                    $state.go('main.chat', {chatid: response._id, chatRoomName: chatName});
                },

                function(error){

                    console.log(error);
                }
            );

        }
    }
})();