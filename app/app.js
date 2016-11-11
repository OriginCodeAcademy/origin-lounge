(function() {
    'use strict';

angular
        .module('app', ['ui.router','LocalStorageModule', 'toastr', 'ngIdle'])
        .value ('originAPIBaseURL', 'http://localhost:53737/')
        .config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider, $httpProvider, IdleProvider, KeepaliveProvider) {
              localStorageServiceProvider
             .setPrefix('')
             .setNotify(true, true);

             // add authInterceptorService to the list of interceptors available within the httpProvider
            $httpProvider.interceptors.push('authInterceptorService');

            // set up the IdleProvider's idle and timeout values, as well as the KeepaliveProvider's interval
            IdleProvider.idle(5); // 5 seconds idle
            IdleProvider.timeout(5); // 5 seconds after idle, time the user out
            //KeepaliveProvider.interval(5*60); // 5 minute keep-alive ping

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

        .run(function($rootScope, $location, $state, storageFactory, Idle, toastr) {

            // this starts watching for idle, when the app first runs. This also starts the Keepalive service by default.
            Idle.watch();

            // rootScope handler for when user changes states
            $rootScope.$on('$stateChangeStart', function() {


                // if a token doesn't exist in local storage, log the user out
                var isLogin = storageFactory.getLocalStorage("token");
                if(!isLogin){
                   $location.path('/login');
                }
            });

            // rootscope event handler for when the user appears to have first gone Idle 
            $rootScope.$on('IdleStart', function () {

            });

            // rootscope event handler that follows after the IdleStart event. Includes a countdown until it considers the user to be timed out
            $rootScope.$on('IdleWarn', function (countdown) {

                // toastr.error("You have been inactive for a while now...In " + countdown + " seconds you will be automatically logged out")

            });

            // rootScope event handler for when the user has been idle for long enough (idleDuration + timeout has passed)
            $rootScope.$on('IdleTimeout', function () {

                // clear out local storage
                storageFactory.clearAllLocalStorage();
                // start up the idle watch
                Idle.watch();
                // jump to the login page
                $state.go('login');


            });

            // rootscope event handler for when Idle ends (user does something)
            $rootScope.$on('IdleEnd', function () {

                console.log("Idle Ended");

            });

        });

})();
