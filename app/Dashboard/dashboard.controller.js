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

        activate();

        function activate() {
            
            // this starts watching for idle. This also starts the Keepalive service by default.
            Idle.watch();

            //grabs username from local storage and binds to view
            vm.username = storageFactory.getLocalStorage('userSession').user.userName;

            //grabs roleId from local storage
            var roleId = storageFactory.getLocalStorage('userSession').roles.roleId;

            // get all categories for the specific role of the user that is logged in
            DashboardFactory.getCategoryNamesByRoleId(roleId).then(

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

        function getContentByCategoryId(categoryId, categoryName) {

            $state.go('main.customcontent', {categoryId: categoryId, categoryName: categoryName});
        }

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

    }
})();