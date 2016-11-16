(function() {
    'use strict';

    angular
        .module('app')
        .controller('chatController', chatController);

    chatController.$inject = ['chatFactory'];
    
    /* @ngInject */
    function chatController(chatFactory) {
        var vm = this;
        vm.title = 'chatController';
        vm.chat;
        activate();

        ////////////////

        vm.showChat = function() {
        	chatFactory.getChat().then(
        		function(result){
        			vm.chat = result;
        		},
        		function(error){
        			toastr.error('Chat Controller Problem')
        		}
        	)
        }
        function activate() {
        	/*
        	chatFactory.getChat().then(
        		function(result){
        			vm.chat = result;
        		},
        		function(error){
        			toastr.error('Chat Controller Problem')
        		}
        	)
			*/
        }
    }
})();