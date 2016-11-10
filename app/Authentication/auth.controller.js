(function() {
    'use strict';

    angular
        .module('app')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['AuthFactory', 'localStorageService', 'storageFactory', 'toastr', '$state'];

    /* @ngInject */
    function AuthController(AuthFactory, localStorageService, storageFactory, toastr, $state) {
        var vm = this;
        vm.title = 'AuthController';
        vm.username = '';

        vm.login = login;

        activate();

        ////////////////

        function activate() {


   						
        }

        function login () {

        	AuthFactory.verifyCredentials(vm.username, vm.password).then (

        		function(response) {

        			console.log(response + "username and password successfully passed from controller");

                    var roles = JSON.parse(response.roles);
        			
                    setStorage('token', response.access_token);
        			setStorage('username', response.username);
        			setStorage('userId', response.userId);
                    setStorage('role', roles[0].Name);
                    setStorage('roleId', roles[0].RoleId);

        			$state.go('main');

        			return response;

        		},

        		function (error) {

        			toastr.error('Sorry, please enter correct login information.');
        			console.log(error+"Unable to pass the login credintials in the login Controller");
        		})

        }

        function setStorage(key, value){
        	storageFactory.setLocalStorage(key, value)
        	
        		console.log("successfully setstorage in the aut controller!");
        		return ;
        }
       
              function getStorage(key){
        	storageFactory.getLocalStorage(key)
        		console.log("successfully getstorage in the aut controller!");
        		return;
        	

        }
       
        

    }
})();