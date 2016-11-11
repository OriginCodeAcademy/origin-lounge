(function() {
    'use strict';

    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['DashboardFactory', 'storageFactory', 'Idle'];

    
    function DashboardController(DashboardFactory, storageFactory, Idle) {
        var vm = this;
        vm.title = 'DashboardController';

        activate();

        ////////////////

        function activate() {
            
            // this starts watching for idle. This also starts the Keepalive service by default.
            Idle.watch();

            //grabs username from local storage and binds to view
            vm.username = storageFactory.getLocalStorage('username');
        }
    }
})();