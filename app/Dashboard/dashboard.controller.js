(function() {
    'use strict';

    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['DashboardFactory', 'chatFactory', 'storageFactory', 'Idle', '$state', '$rootScope', 'chatServerURLAndPort'];

    
    function DashboardController(DashboardFactory, chatFactory, storageFactory, Idle, $state, $rootScope, chatServerURLAndPort) {
        var vm = this;

        vm.logOut = logOut;

        vm.deleteContentFromACategory = deleteContentFromACategory;

        vm.getContentByCategoryId = getContentByCategoryId;
        vm.getContentByContentId = getContentByContentId;

        activate();

        function activate() {
            
            // this starts watching for idle. This also starts the Keepalive service by default.
            Idle.watch();

            //grabs username and userId from local storage and binds to view
            vm.username = storageFactory.getLocalStorage('userSession').user.userName;
            vm.userId = storageFactory.getLocalStorage('userSession').user.userId;
            
            //grabs roles from local storage
            var roles = storageFactory.getLocalStorage('userSession').roles;

            // array to store the roleIds
            var roleIds = [];

            for (var i = 0; i < roles.length; i++) {

                roleIds.push(roles[i].RoleId);
            }

            // see if the user logged in is an admin or not
            vm.isAdmin = storageFactory.getLocalStorage('isAdmin');

            // get all categories for the specific role of the user that is logged in
            DashboardFactory.getCategoryNamesByRoleId(roleIds).then(

                function(response) {
                
                    // bind categories to the view
                    vm.categories = response;
                    console.log(response);

                    // get all the Roles that exist in the origin.API DB
                    getRoles();

                    // get all the Users that exist in the origin.API DB
                    getUsers();
                
                },

                function(error){

                    console.log(error);
                    
                    // get all the Roles that exist in the origin.API DB
                    getRoles();

                    // get all the Users that exist in the origin.API DB
                    getUsers();

                });

            
        }

        function deleteContentFromACategory(contentCategoryId) {

            // remove content from contentcategory table

            DashboardFactory.deleteContentCategoryEntry(contentCategoryId).then(

                function(response){

                // remove content from local content array

                },

                function(error){

                    console.log(error);

                });
        }

        // on-click function that goes to the custom content state and brings along the category ID and name of the category selected
        function getContentByCategoryId(categoryId, categoryName) {


            // display category name to content view
            vm.categoryName = categoryName;

            vm.categoryId = categoryId;

            // get all content associated with the specific category Id
            DashboardFactory.getContentByCategoryId(categoryId).then(

                function(response){

                    vm.content = response;
                    $state.go('main.customcontent');

                },

                function(error){

                    // clear content from custom content view if no content is found for a specific category
                    vm.content = '';
                    $state.go('main.customcontent');

                });
           
        }

        // get the content body and title for a specific content Id
        function getContentByContentId(contentId) {

            DashboardFactory.getContentByContentId(contentId).then(

                function(response){

                    vm.contentTitle = response.title;
                    vm.contentBody = response.bodyDescr;

                    $state.go('main.customcontent.customcontentbody');

                },

                function(error){


                });


        }

        // grabs all the roles from the origin.api database
        function getRoles(){

            DashboardFactory.getRoles().then(

                function(response) {

                    vm.roles = response;
                    console.log(response);

                },

                function(error) {

                    console.log(error);
                
                });

        }

        function getUsers() {

            DashboardFactory.getUsers().then(

                function(response) {

                    vm.users = response;
                    console.log(response);
                },

                function(error) {

                    console.log(error);
                });
        }

       
        // Logout on-click function
        function logOut(){
            // clear local storage
            storageFactory.clearAllLocalStorage();
            // // disconnect any chat socket that may be opened, before logging out
            // $rootScope.socket.disconnect();
            // go to login page
            $state.go('login');
        }

        // **********************************************************************************
        // This is where we register all the socket listeners. This works if there is no way
        // for the user to navigate back to the main state from another state, after they have logged in. As soon as
        // the code changes to allow the user to navigate back to the main state from other states,
        // you will now see these listeners register each time we come back to main state. This will
        // create a situation where each time the users comes to the main state, another set of these listeners will be
        // registered. This will manifest itself in many ways, one of which is the user seeing what they type show up 
        // as many times as these events are registered. So if they were registered twice, the user will see the message
        // twice.
        // **********************************************************************************

        // socket.io listener for connect event that signifies that client has connected to server
        chatFactory.on('connect', function(){

            console.log("Client connected to server"); 
            
            // get all chat rooms/private messages that the user is subscribed to
            chatFactory.getChatsForAUser(vm.userId).then(

                function(response) {
                    
                    // display chatgroups on the view           
                    vm.chatGroups = response;

                    for (var i = 0; i < response.length; i++) {
                        // send server the full list of chat rooms the user is in
                        chatFactory.emit('subscribe', {chatgroupId: response[i]._id, username: vm.username});
                    }

                    //jump to calendar state
                    $state.go('main.calendar');
                },

                function(error) {

                     //jump to calendar state
                    $state.go('main.calendar');                   

            });

        });

        // socket.io listener to capture a user connected event coming from server
        chatFactory.on('user connected', function(msg){
          // add chat message to the unordered list on this html page
          $('#messages').append($('<li>').text(msg)); 
        });

        // socket.io listener to capture a chat message coming from the server
        chatFactory.on('chat message', function(msg){
          // only add the incoming chat message to the chat if the incoming roomid from the server matches the roomid of the chat you are in
          if ($rootScope.roomid === msg.roomid){
            $('#messages').append($('<li>').text(msg.username + ' said: ' + msg.message));
          }
        });

        chatFactory.on('logged in', function(msg){
            console.log(msg.username);
            console.log(msg.chatgroupId);
            // only add the logged in message to the chat if the incoming roomid from the server matches the roomid of the chat you are in
            if ($rootScope.roomid === msg.chatgroupId){           
                $('#messages').append($('<li>').text(msg.username + ' has logged in'));  
            }
        });

        // socket.io listener to capture a user disconnection event coming from server
        chatFactory.on('user disconnected', function(msg){
          // add chat message to the unordered list on this html page
          $('#messages').append($('<li>').text(msg)); 
            
        });

    }
})();