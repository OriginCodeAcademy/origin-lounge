(function() {
    'use strict';

angular
        .module('app', ['ui.router','LocalStorageModule', 'toastr'])
        .value ('originAPIBaseURL', 'http://localhost:53737/')
        .config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider, $httpProvider) {
              localStorageServiceProvider
             .setPrefix('')
             .setNotify(true, true);

            $httpProvider.interceptors.push('authInterceptorService');

            // For any unmatched url, redirect to /state1
            $urlRouterProvider.otherwise("/login");

            // Now set up the states
            $stateProvider
                .state('main', {
                    url: "/main",
                    templateUrl: "app/Dashboard/main.html",
                    controller: 'DashboardController as vm'

            })
                .state('login', {
                    url: "/login",
                    templateUrl: "app/Authentication/login.html",
                    controller: 'AuthController as vm'
            });
        })

        .run(function($rootScope, $location, $state, storageFactory) {


            $rootScope.$on( '$stateChangeStart', function(e, toState  , toParams
                                                   , fromState, fromParams) {

                var isLogin = storageFactory.getLocalStorage("token");
                if(!isLogin){
                   $location.path('/login');
                }
            });
        });

})();
