(function() {
    'use strict';

    angular
        .module('app')
        .controller('addChatController', addChatController);

    addChatController.$inject = ['addChatFactory', 'storageFactory'];
    
    /* @ngInject */
    function addChatController(addChatFactory, storageFactory) {
        var vm = this;
        vm.title = 'addChatController';
        vm.token = storageFactory.getLocalStorage('userSession').token;


        activate();

        //////////////

        function activate() {

        	addChatFactory.getAllUsers(vm.token)
        	.then(function(response) {
        		vm.users = response;
        		console.log(vm.users);
        	});
        }
    }
})();