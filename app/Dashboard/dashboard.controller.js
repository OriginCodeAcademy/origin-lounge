(function() {
    'use strict';

    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['DashboardFactory', 'storageFactory', 'Idle', '$state'];

    
    function DashboardController(DashboardFactory, storageFactory, Idle, $state) {
        var vm = this;

        vm.logOut = logOut;
        vm.getContentByCategoryId = getContentByCategoryId;
        vm.deleteContentFromACategory = deleteContentFromACategory;
        vm.getContentByContentId = getContentByContentId;


        activate();

        function activate() {
            
            // this starts watching for idle. This also starts the Keepalive service by default.
            Idle.watch();

            //grabs username from local storage and binds to view
            vm.username = storageFactory.getLocalStorage('userSession').user.userName;

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
                
                },

                function(error){

                    console.log(error);

                });
        }
        
        // Logout on-click function that clears local storage and kicks user to login page
        function logOut(){
            storageFactory.clearAllLocalStorage();
            $state.go('login');
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

    }
})();