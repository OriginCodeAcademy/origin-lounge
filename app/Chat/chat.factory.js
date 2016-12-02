
(function() {
    'use strict';
    angular
        .module('app')
        .factory('chatFactory', chatFactory);
    chatFactory.$inject = ['$http', '$q', 'originLoungeExpressAPIBaseURL', 'chatServerURLAndPort', '$rootScope'];
    /* @ngInject */
    function chatFactory($http, $q, originLoungeExpressAPIBaseURL, chatServerURLAndPort, $rootScope) {
        // $rootScope.socket = io.connect(chatServerURLAndPort);
        var service = {

            getAllMessagesForAChatRoom: getAllMessagesForAChatRoom,
            getAllUsersInAChatRoom: getAllUsersInAChatRoom,
            getChatsForAUser: getChatsForAUser,
            emit: emit,
            on: on,
            postMessage: postMessage
        };
        return service;

        function getAllMessagesForAChatRoom(roomId) {
            
            var defer = $q.defer();

            $http({
                method: 'GET',
                url: originLoungeExpressAPIBaseURL + 'messages/' + roomId
            })

            .then(function(response){
                
                if (typeof response.data === "object") {

                    defer.resolve(response.data);
                
                } else {

                    defer.reject(response);
                }
    
            },

            function(error){

                defer.reject(error);

            });

            return defer.promise;
        }

        function getAllUsersInAChatRoom(roomId) {
            
            var defer = $q.defer();

            $http({
                method: 'GET',
                url: originLoungeExpressAPIBaseURL + 'chats/' + roomId
            })

            .then(function(response){
                
                if (typeof response.data === "object") {

                    defer.resolve(response.data);
                
                } else {

                    defer.reject(response);
                }
    
            },

            function(error){

                defer.reject(error);

            });

            return defer.promise;
        }

        function getChatsForAUser(userId) {
            
            var defer = $q.defer();

            $http({
                method: 'GET',
                url: originLoungeExpressAPIBaseURL + 'chats/userid/' + userId
            })

            .then(function(response){
                
                if (typeof response.data === "object") {

                    defer.resolve(response.data);
                
                } else {

                    defer.reject(response);
                }
    
            },

            function(error){

                defer.reject(error);

            });

            return defer.promise;
        }

        function on(eventName, callback) {

          $rootScope.socket.on(eventName, function () {  
            
            var args = arguments;
            $rootScope.$apply(function () {
              
              callback.apply($rootScope.socket, args);
            
            });
          
          });
        }

        function postMessage(message){

            var defer = $q.defer();

            var info = 'sender=' + message.sender + '&message=' + message.message + '&created=' + message.created + '&chatid=' + message.chatid;

            $http({
                method: 'POST',
                url: originLoungeExpressAPIBaseURL + 'messages/',
                data: info,
                headers: {
                'Content-Type' : 'application/x-www-form-urlencoded'
              }
            })

            .then(function(response){
                
                if (typeof response.data === "object") {

                    defer.resolve(response.data);
                
                } else {

                    defer.reject(response);
                }
    
            },

            function(error){

                defer.reject(error);

            });

            return defer.promise;

        }


        function emit(eventName, data, callback) {
          
          $rootScope.socket.emit(eventName, data, function () {
        
            var args = arguments;
            $rootScope.$apply(function () {
        
            if (callback) {
              callback.apply($rootScope.socket, args);
            }
        
          });
        
        })
      }
    }
})();