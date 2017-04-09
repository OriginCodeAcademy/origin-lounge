(function() {
    'use strict';

    angular
        .module('app')
        .controller('AuthController', AuthController);

    AuthController.$inject = [
        'AuthFactory',
        'localStorageService',
        'storageFactory',
        'toastr',
        '$state',
        '$rootScope'
        ];

    function AuthController(
        AuthFactory,
        localStorageService,
        storageFactory,
        toastr,
        $state,
        $rootScope) {

        var vm = this;

        vm.login = login;

        $rootScope.inChatState = false;


        activate();

        ////////////////

        function activate() {

				
        }

        // On-click handler for when user clicks Login Button
        function login () {

            // Verify username and password exist in Origin.API database
        	AuthFactory.verifyCredentials(vm.username, vm.password).then (

                // If username and password exist, do the following

        		function(response) {

        			console.log(response + "username and password successfully passed from controller");


                    var roles = JSON.parse(response.roles);
        			
                    // Create user Session object to be stored in local storage
                    var userSession = {

                        'token' : response.access_token,
                        'dateTime' : Date.now(),
                        'user' : {
                            'userName' : response.username,
                            'userId' : response.userId
                        },
                        'roles' :roles

                    };

                    // Determine if a user has admin privelages
                    // where 8 = student, 9 = current, 10 = alumni 
                    if ( (roles[0].RoleId === 8) || (roles[0].RoleId === 9) || (roles[0].RoleId === 10) ) {
                        
                        setStorage('isAdmin', false);
                    
                    } else {

                        setStorage('isAdmin', true);

                    }

                    // Store userSession object into local storage
                    setStorage('userSession', userSession);

                    // Jump to main/dashboard page
                    $state.go('main');

                    return response;

        		},

                // If username and password do not exist, do the following

        		function (error) {

        			toastr.error('Sorry, please enter correct login information.');

        		});

        }

        // Get a value out of local storage
        function getStorage(key) {
            storageFactory.getLocalStorage(key);
                console.log("successfully getstorage in the aut controller!");
                return;
        }

        // Set a value into local storage
        function setStorage(key, value) {
        	storageFactory.setLocalStorage(key, value);

        		console.log("successfully setstorage in the aut controller!");
        		return ;
        }
       
    }
})();