(function() {
    'use strict';

    var app = angular.module('app', ['ui.router', 'ui.calendar']);

    app.config(function($stateProvider, $urlRouterProvider){
        //
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/test");
        //
        // Now set up the states
        $stateProvider
            .state('test', {
                url:"/test", //Directs it to $stateParams
                templateUrl: "app/test.html",
                controller: 'MainController',
                controllerAs: 'vm'
            })
            .state('login', {
                url:"/login", //Directs it to $stateParams
                templateUrl: "app/login.html",
                controller: 'LoginController',
                controllerAs: 'vm'
            })
            .state('calendar', {
                url:"/calendar", //Directs it to $stateParams
                templateUrl: "app/calendar.html",
                controller: 'CalendarController',
                controllerAs: 'vm'
            })
    });

})();