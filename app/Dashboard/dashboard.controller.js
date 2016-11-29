(function() {
    'use strict';

    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['DashboardFactory', 'chatFactory', 'storageFactory', 'Idle', '$state', '$rootScope'];

    
    function DashboardController(DashboardFactory, chatFactory, storageFactory, Idle, $state, $rootScope) {
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

                     chatFactory.getChatsForAUser(vm.userId).then(function(response) {
                        
                         vm.chatGroups = response;
                         $state.go('main.calendar_index');
                     });

                
                },

                function(error){

                    console.log(error);
                    // get all the Roles that exist in the origin.API DB
                    getRoles();

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

    }
})();