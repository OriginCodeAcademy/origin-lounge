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
        	var socket = io();
      $('form').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
      });
      socket.on('chat message', function(msg){
        console.log(msg);
        $('#messages').append($('<li>').text(msg));
      });
        }
    }
})();