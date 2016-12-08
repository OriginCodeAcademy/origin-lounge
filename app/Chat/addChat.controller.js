(function() {
    'use strict';

    angular
        .module('app')
        .controller('addChatController', addChatController);

    addChatController.$inject = ['toastr', 'chatFactory', 'DashboardFactory', 'storageFactory', '$state', '$rootScope'];
    
    /* @ngInject */
    function addChatController(toastr, chatFactory, DashboardFactory, storageFactory, $state, $rootScope) {
        var vm = this;
        vm.title = 'addChatController';

        var userCurrentlyLoggedIn;

        // for holding the selected users to be added to a direct message/channel
        vm.selectedUsers = [];

        // to capture the channel name to be used for the new channel that is created
        vm.newChannelName = '';

        vm.createChat = createChat;


        activate();

        //////////////

        function activate() {

            // get id of user currently logged in
            userCurrentlyLoggedIn = storageFactory.getLocalStorage('userSession').user.userId;
        	
            // consider replacing this with a read of localstorage (once we add the code to store users into localstorage after we getUsers in the dashboard controller)
            DashboardFactory.getUsers().then(
                function(response) {
        		  
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

        // creates a new Channel or Direct Message (depends on the channelType received)
        // if creating a direct message, we will pass nothing for channelName (undefined) and instead build
        // up the channel name based on the names of the users being added to said direct message.
        // if creating a channel we will pass the channel name provided
        function createChat(channelType, channelName) {

            var usersToAddToNewChat = [];
            var userToAddToNewChat = {};

            var chatType = channelType;
            var chatName = '';
            
            // if channelName is undefined, start building up string of users that are to be added to direct message
            // otherwise take the channelName received and use it for the name of the channel being created
            if (channelName === undefined) {
                chatName = storageFactory.getLocalStorage('userSession').user.userName + ', ';
            } else {
                chatName  = channelName;
            }
            // find username that matches userId of selected people to include in the direct message group
            for (var i = 0; i < vm.selectedUsers.length; i++) {
                for (var j = 0; j < vm.users.length; j++) {
                    if (vm.selectedUsers[i] === vm.users[j].Id) {
                        // create user object 
                        userToAddToNewChat = {
                            userid: vm.users[j].Id,
                            username: vm.users[j].FullName
                        };
                        // build up channelName if creating a direct message
                        if ((i === vm.selectedUsers.length - 1) && (channelName === undefined)) {
                            chatName += vm.users[j].FullName;
                        } else if (channelName === undefined) {
                            chatName += vm.users[j].FullName + ', ';   
                        }
                        // add user object to list of users that will be added to this chat
                        usersToAddToNewChat.push(userToAddToNewChat);
                    }
                }
            }

            // get userid of user currently logged in
            var userIdOfUserCurrentlyLoggedIn = storageFactory.getLocalStorage('userSession').user.userId;
            // get username of user currently logged in
            var userNameOfUserCurrentlyLoggedIn = storageFactory.getLocalStorage('userSession').user.userName;
            
            // build up user object for user logged in
            userToAddToNewChat = {
                userid: userIdOfUserCurrentlyLoggedIn,
                username: userNameOfUserCurrentlyLoggedIn
            };

            // push user object of user logged in, into the list of users to add to this new chat
            usersToAddToNewChat.push(userToAddToNewChat);

            console.log(vm.selectedUsers);
            console.log(usersToAddToNewChat);

            // check to see if the chat name already exists before creating it
            chatFactory.getAllChats().then(

                function(response) {

                    for (var i = 0; i < response.length; i++) {

                        if (chatName === response[i].channelname) {
                            toastr.error("Chat name already exists, please try a different name");
                            return;
                        }
                    }
                    postChat(chatType, chatName, usersToAddToNewChat);
                },

                function(error) {

                }
            );

        }

        function postChat(chatType, chatName, users) {

            // create the new chat in mongoDB
            chatFactory.postChat(chatType, chatName, users).then(

                function(response) {

                    console.log(response);

                    // update the # of channels or direct messages based on the type of channel that was created
                    if(chatType === 'direct') {
                    
                        $rootScope.numberOfDirectMessages++;
                    
                    } else {
                    
                        $rootScope.numberOfChannels++;
                    
                    }
                    
                    // let all other socket.io clients be aware that a new chat room was created
                    // and add this client to a new socket.io room as well
                    chatFactory.emit('create chatroom notification', response);
                    // update this users chatgroup list
                    $rootScope.chatGroups.push(response);  
                    // jump to the new chat room just created
                    $state.go('main.chat', {chatid: response._id, chatRoomName: chatName});
                },

                function(error){

                    console.log(error);
                }
            );

        }
    }
})();