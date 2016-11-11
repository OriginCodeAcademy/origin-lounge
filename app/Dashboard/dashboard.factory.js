(function() {
    'use strict';

    angular
        .module('app')
        .factory('DashboardFactory', DashboardFactory);

    DashboardFactory.$inject = ['$http', '$q'];

    function DashboardFactory($http, $q) {
        var service = {
            func: func
        };
        return service;

        ////////////////

        function func() {
        }
    }
})();