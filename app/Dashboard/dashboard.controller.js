(function() {
    'use strict';

    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['DashboardFactory', 'storageFactory'];

    /* @ngInject */
    function DashboardController(DashboardFactory, storageFactory) {
        var vm = this;
        vm.title = 'DashboardController';

        activate();

        ////////////////

        function activate() {
            vm.username = storageFactory.getLocalStorage('username');
        }
    }
})();