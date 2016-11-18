(function() {
    'use strict';

    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['DashboardFactory', 'storageFactory', 'Idle', '$state'];

    
    function DashboardController(DashboardFactory, storageFactory, Idle, $state) {
        var vm = this;
        vm.title = 'DashboardController';
        vm.logOut=logOut;

        activate();

        ////////////////

        function activate() {
            
            // this starts watching for idle. This also starts the Keepalive service by default.
            Idle.watch();

            //grabs username from local storage and binds to view
            vm.username = storageFactory.getLocalStorage('userSession').user.userName;
            vm.userId = storageFactory.getLocalStorage('userSession').user.userId;
            
            // get all categories from mongoDB
            DashboardFactory.getCategory().then(function(response) {
                vm.data = response.data;
            });

            DashboardFactory.getChat(vm.userId).then(function(response) {
                vm.chatGroups = response.data;
            });
        }
        
        // Logout on-click function that clears local storage and kicks user to login page
        function logOut(){
            storageFactory.clearAllLocalStorage();
            $state.go('login');
        }

    }
})();