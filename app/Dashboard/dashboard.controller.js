(function() {
    'use strict';

    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['DashboardFactory', 'storageFactory'];

    
    function DashboardController(DashboardFactory, storageFactory) {
        var vm = this;
        vm.title = 'DashboardController';

        activate();

        ////////////////

        function activate() {
            //grabs username from local storage and binds to view
            vm.username = storageFactory.getLocalStorage('username');
        }
    }
})();