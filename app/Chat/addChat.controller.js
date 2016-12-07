(function() {
    'use strict';

    angular
        .module('app')
        .controller('addChatController', addChatController);

    addChatController.$inject = ['chatFactory', 'DashboardFactory', 'storageFactory'];
    
    /* @ngInject */
    function addChatController(chatFactory, DashboardFactory, storageFactory) {
        var vm = this;
        vm.title = 'addChatController';

        var userCurrentlyLoggedIn;
        var usersToAddToNewChat = [];
        var userToAddToNewChat = {};

        // for holding the selected users to be added to a direct message/channel
        vm.selectedUsers = [];

        vm.newChannelName = '';

        vm.createDirectMessage = createDirectMessage;
        vm.createChannel = createChannel;


        activate();

        //////////////

        function activate() {

            // get id of user currently logged in
            userCurrentlyLoggedIn = storageFactory.getLocalStorage('userSession').user.userId;
        	
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

        // creates a new Direct Message group
        function createDirectMessage() {

            var chatType = 'direct';
            var chatName = 'test';

            // find username that matches userId of selected people to include in the direct message group
            for (var i = 0; i < vm.selectedUsers.length; i++) {
                for (var j = 0; j < vm.users.length; j++) {
                    if (vm.selectedUsers[i] === vm.users[j].Id) {
                        // create user object 
                        userToAddToNewChat = {
                            userid: vm.users[j].Id,
                            username: vm.users[j].FullName
                        };
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

            // create the new chat in mongoDB
            chatFactory.postChat(chatType, chatName, usersToAddToNewChat).then(

                function(response) {

                    console.log(response);
                },

                function(error){

                    console.log(error);
                }
            );

        }

        function createChannel() {
            
        // $("#selected-users:selected").each(function () {
        //     var $this = $(this);
        //     if ($this.length) {
        //         var selText = $this.text();
        //         console.log(selText);
        //     }
        // });
            console.log(vm.selectedUsers);

        }
    }
})();