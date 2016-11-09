(function() {
    'use strict';

angular
        .module('app', ['ui.router'])
        .config(function($stateProvider, $urlRouterProvider) {
        //
            // For any unmatched url, redirect to /state1
            $urlRouterProvider.otherwise("/main");
            //
            // Now set up the states
            $stateProvider
                .state('main', {
                    url: "/main",
                    templateUrl: "app/Dashboard/main.html",
                    controller: 'DashboardController as vm'

            });
        });

})();
