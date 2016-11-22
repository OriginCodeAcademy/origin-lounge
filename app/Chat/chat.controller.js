(function() {
    'use strict';

    angular
        .module('app')
        .controller('chatController', chatController);

    chatController.$inject = ['socket', 'chatFactory'];
    
    /* @ngInject */
    function chatController(socket, chatFactory) {
        var vm = this;
        vm.title = 'chatController';

        activate();

        ////////////////

        function activate() {

        	chatFactory.socket.on('send:message', function (message) {
    			vm.messages.push(message);
  			});
        }
    }
})();