(function() {
    'use strict';

    angular
        .module('app')
        .factory('DashboardFactory', DashboardFactory);

    DashboardFactory.$inject = ['$http', '$q'];

    /* @ngInject */
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