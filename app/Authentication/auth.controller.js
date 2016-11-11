(function() {
    'use strict';

    angular
        .module('app')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['AuthFactory', 'localStorageService', 'storageFactory', 'toastr', '$state'];

    function AuthController(AuthFactory, localStorageService, storageFactory, toastr, $state) {
        var vm = this;

        vm.login = login;

        activate();

        ////////////////

        function activate() {


   						
        }

        // On-click handler for when user clicks Login Button
        function login () {

            // Verify username and password exist in Origin.API database
        	AuthFactory.verifyCredentials(vm.username, vm.password).then (

                // if username and password exist, do the following
        		function(response) {

        			console.log(response + "username and password successfully passed from controller");

                    var roles = JSON.parse(response.roles);
        			
                    // write the following to local storage
                    setStorage('token', response.access_token);
        			setStorage('username', response.username);
        			setStorage('userId', response.userId);
                    setStorage('role', roles[0].Name);
                    setStorage('roleId', roles[0].RoleId);

                    // jump to main/dashboard page
        			$state.go('main');

        			return response;

        		},

                // if username and password do not exist, do the following
        		function (error) {

        			toastr.error('Sorry, please enter correct login information.');
        			console.log(error+"Unable to pass the login credintials in the login Controller");
        		})

        }

        // set a value into local storage
        function setStorage(key, value){
        	storageFactory.setLocalStorage(key, value)
        	
        		console.log("successfully setstorage in the aut controller!");
        		return ;
        }
       
       // get a value out of local storage
        function getStorage(key){
        	storageFactory.getLocalStorage(key)
        		console.log("successfully getstorage in the aut controller!");
        		return;
        	

        }
       
        

    }
})();