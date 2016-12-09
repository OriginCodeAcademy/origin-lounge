(function() {
    'use strict';

angular
        .module('app', [
            'ui.router', // adds state routing capabilities
            'LocalStorageModule', // adds localstorage capabilities
            'toastr', // adds toastr alerts
            'ngIdle', // adds idle capabilities
            'ui.bootstrap', 
            'hc.marked', // markdown editor related
            'hljs', // markdown editor related
            'angular-markdown-editor', // markdown editor related
            'luegg.directives', // for scroll-glue capability (which is being used to ensure the latest chat message is shown at the bottom of the chat window)
            'angular-nicescroll', // for custom scroll-bar
            'ngFileUpload', // for file uploading
            'dbaq.emoji', // for filtering of emoji text (e.g. turning :smile: into a smiley face)
            'ngSanitize' // also needed for emoji filtering (and who knows what else...)
            ])
        .value ('originAPIBaseURL', 'http://origincodeacademyapi.azurewebsites.net/', 'ui.calendar')
        .value ('chatServerURLAndPort', 'http://localhost:3002')
        .value ('originLoungeExpressAPIBaseURL', 'http://localhost:3000/api/')

        // config that is specific for the markdown editor
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

        .config(function(
            $stateProvider, 
            $urlRouterProvider,
            localStorageServiceProvider,
            $httpProvider,
            IdleProvider,
            KeepaliveProvider) {
            // local storage config
              localStorageServiceProvider
             .setPrefix('')
             .setNotify(true, true);

             // add authInterceptorService to the list of interceptors available within the httpProvider
            $httpProvider.interceptors.push('authInterceptorService');

            // set up the IdleProvider's idle and timeout values, as well as the KeepaliveProvider's interval
            IdleProvider.idle(60*10); // 10 minute idle
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

                .state('main.managecontent', {
                    url: '/managecontent',
                    templateUrl: 'app/CustomContent/manage_content.html',
                    controller: 'CustomContentController as vm',
                    params: {
                        contentTitle: null,
                        contentBody: null,
                        contentId: null,
                        categoryId: null
                    }
            })
                .state('main.calendar', {
                    url: '/calendar',
                    templateUrl: 'app/Apis/calendar/calendar.html',
                    controller: 'CalendarController as vm'
            })
                .state('main.linkedin', {
                    url: '/linkedin',
                    templateUrl: 'app/Apis/linkedin/linkedin.html',
                    controller: 'LinkedinController as vm'
            })

                .state('main.customcontent', {
                    url: '/customcontent',
                    templateUrl: 'app/CustomContent/customcontent.html'

            })
                  .state('main.customcontent.customcontentbody', {
                    url: '/customcontentbody',
                    templateUrl: 'app/CustomContent/customcontentbody.html'

            })

                  .state('main.github', {
                   url: '/github',
                   templateUrl: 'app/Apis/github/github.html',
                   controller: 'GithubController as vm'
            })

                .state('main.addDirectMessage', {
                    url: '/addDirectMessage',
                    templateUrl: 'app/Chat/addDirectMessage.html',
                    controllerAs: 'vm',
                    controller: 'addChatController'
            })

                .state('main.addOrJoinChannel', {
                    url: '/addOrJoinChannel',
                    templateUrl: 'app/Chat/addOrJoinChannel.html',
                    controllerAs: 'vm',
                    controller: 'addChatController'
            })

                .state('main.chat', {
                    url: '/chat', 
                    templateUrl: 'app/Chat/Chat.html',
                    controllerAs: 'vm',
                    controller: 'chatController',
                    params: {
                        chatid: null,
                        chatRoomName: null
                    }

            });
        })

        .run(function(
            $rootScope,
            $location,
            $state,
            storageFactory,
            Idle,
            toastr,
            $uibModal) {


            // rootScope handler for when user changes states
            $rootScope.$on('$stateChangeStart', function() {

                // if a token doesn't exist in local storage, close the socket.io connection and log the user out
                var isLogin = storageFactory.getLocalStorage("userSession");
                if(isLogin === null){
                    // close socket connection to socket.io server
                    $rootScope.socket.disconnect();
                    // jump to login page
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
                
                //close any chat socket that is currently open
                $rootScope.socket.disconnect();
                
                // jump to the login page
                $state.go('login');


            });

            // rootscope event handler for when Idle ends (user does something)
            $rootScope.$on('IdleEnd', function () {

                // close all modals that are currently open
                closeModals();

            });


            //On Before Unload event that clears local storage and redirects to the login page
            window.onbeforeunload = function() {
                storageFactory.clearAllLocalStorage();
                $rootScope.socket.disconnect();
                $state.go('login');
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