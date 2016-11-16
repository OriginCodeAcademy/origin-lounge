(function() {
    'use strict';

angular
        .module('app', ['ui.router','LocalStorageModule', 'toastr', 'ngIdle', 'ui.bootstrap', 'hc.marked', 'hljs', 'angular-markdown-editor'])
        .value ('originAPIBaseURL', 'http://localhost:53737/')


        .config(['markedProvider', 'hljsServiceProvider', function(markedProvider, hljsServiceProvider) {
            // markdown config
            markedProvider.setOptions({
                gfm: true,
                tables: true,
                sanitize: true,
                highlight: function(code, lang) {
                    if (lang) {
                        return hljs.highlight(lang, code, true).value;
                    } else {
                        return hljs.highlightAuto(code).value;
                    }
                }
            });


            // highlight config
            hljsServiceProvider.setOptions({
                // replace tab with 4 spaces
                tabReplace: '    '
            });
        }])

        .config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider, $httpProvider, IdleProvider, KeepaliveProvider) {
              localStorageServiceProvider
             .setPrefix('')
             .setNotify(true, true);

             // add authInterceptorService to the list of interceptors available within the httpProvider
            $httpProvider.interceptors.push('authInterceptorService');

            // set up the IdleProvider's idle and timeout values, as well as the KeepaliveProvider's interval
            IdleProvider.idle(10*60); // 10 minute idle
            IdleProvider.timeout(10); // 10 seconds after idle, time the user out
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

            })

                .state('main.countdown', {
                    url: '/countdown',
                    templateUrl: 'app/CustomContent/countdown.html'
            })

                .state('main.announcement', {
                    url: '/announcement',
                    templateUrl: 'app/CustomContent/announcement.html'
            })

                .state('main.currentAssignment', {
                    url: '/currentAssignment',
                    templateUrl: 'app/CustomContent/currAssignment.html'
            })

                .state('main.managecontent', {
                    url: '/managecontent',
                    templateUrl: 'app/CustomContent/managecontent.html',
                    // controllerAs: 'vm',
                    // controller: 'PostController'


            });
        })

        .run(function($rootScope, $location, $state, storageFactory, Idle, toastr, $uibModal) {


            // rootScope handler for when user changes states
            $rootScope.$on('$stateChangeStart', function() {


                // if a token doesn't exist in local storage, log the user out
                var isLogin = storageFactory.getLocalStorage("userSession");
                if(isLogin === null){
                   $location.path('/login');
                }

            });

            // close any idle related modal that is currently open
             function closeModals() {
                    if ($rootScope.warning) {
                      $rootScope.warning.close();
                      $rootScope.warning = null;
                    }

                    if ($rootScope.timedout) {
                      $rootScope.timedout.close();
                      $rootScope.timedout = null;
                    }
              }

            // rootscope event handler for when the user appears to have first gone Idle 
            $rootScope.$on('IdleStart', function () {

                // close any idle related modal that is currently open
                closeModals();

                // open up a idle warning modal 
                $rootScope.warning = $uibModal.open({
                  templateUrl: 'warning-dialog.html',
                  windowClass: 'modal-danger'
                });

            });

            // rootscope event handler that follows after the IdleStart event. The countdown value represents the IdleProvider.timeout value set above
            $rootScope.$on('IdleWarn', function (countdown) {

            });

            // rootScope event handler for when the user has been idle for long enough (idleDuration + timeout has passed)
            $rootScope.$on('IdleTimeout', function () {

                // close any idle related modal that is currently open
                closeModals();

                // open up a timeout modal
                $rootScope.timedout = $uibModal.open({
                  templateUrl: 'timedout-dialog.html',
                  windowClass: 'modal-danger'
                });

                // clear out local storage
                storageFactory.clearAllLocalStorage();
                
                // stop the idle watch
                Idle.unwatch();
                
                // jump to the login page
                $state.go('login');


            });

            // rootscope event handler for when Idle ends (user does something)
            $rootScope.$on('IdleEnd', function () {

                // close all modals that are currently open
                closeModals();

            });


            // On Before Unload event that clears local storage and redirects to the login page
            window.onbeforeunload = function() {
                storageFactory.clearAllLocalStorage();
                return '';
            };
        })

        // controller for markdown editor
        .controller("MainController", ["$scope", "marked", function MarkdownController($scope, marked) {
            $scope.markdown = "Origin Code Academy:";
            $scope.markdownService = marked('#TEST');


            // --
            // normal flow, function call
            $scope.convertMarkdown = function() {
                vm.convertedMarkdown = marked(vm.markdown);
            };


        }]);




})();