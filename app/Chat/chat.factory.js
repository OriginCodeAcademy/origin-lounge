
(function() {
    'use strict';
    angular
        .module('app')
        .factory('chatFactory', chatFactory);
    chatFactory.$inject = [
        '$http',
        '$q',
        'originLoungeExpressAPIBaseURL',
        'chatServerURLAndPort',
        '$rootScope'
        ];

    function chatFactory(
        $http,
        $q,
        originLoungeExpressAPIBaseURL,
        chatServerURLAndPort,
        $rootScope) {

        var service = {

            // Giphy related
            getGiphy: getGiphy,
            
            // GridFS related
            downloadFile: downloadFile,
            getAllFilesSharedInAChatRoom: getAllFilesSharedInAChatRoom,

            // mongoDB Chat collection related
            getAllChats: getAllChats,
            getAllMessagesForAChatRoom: getAllMessagesForAChatRoom,
            getAllUsersInAChatRoom: getAllUsersInAChatRoom,
            getChatsForAUser: getChatsForAUser,

            postChat: postChat,
            postMessage: postMessage,
            
            // socket.io related
            emit: emit,
            on: on,

        };
        return service;

        // Downloads a file from GridFS collection
        function downloadFile(fileId, filename) {
            
            var defer = $q.defer();

            $http({
                method: 'GET',
                url: originLoungeExpressAPIBaseURL + 'files/' + fileId,
                responseType: 'arraybuffer'

            })

            .then(function(response) {
                // Grab the file data and create a blob
                var file = new Blob([response.data]);
                // Save the file to the client's machine
                saveAs(file, filename);
                defer.resolve(response);
    
            },

            function(error){

                defer.reject(error);

            });

            return defer.promise;
        }

        // Get all the chat documents in the chats collection of the mongoDB
       function getAllChats() {
            
            var defer = $q.defer();

            $http({
                method: 'GET',
                url: originLoungeExpressAPIBaseURL + 'chats'
            })

            .then(function(response) {
                
                if (typeof response.data === "object") {

                    defer.resolve(response.data);
                
                } else {

                    defer.reject(response);
                }
    
            },

            function(error) {

                defer.reject(error);

            });

            return defer.promise;
        }

        // Get all the files associated with a specific chat room from the chat collection of the mongo DB
        function getAllFilesSharedInAChatRoom(chatId) {
            
            var defer = $q.defer();

            $http({
                method: 'GET',
                url: originLoungeExpressAPIBaseURL + 'files/chat/' + chatId
            })

            .then(function(response) {
                
                if (typeof response.data === "object") {

                    defer.resolve(response.data);
                
                } else {

                    defer.reject(response);
                }
    
            },

            function(error) {

                defer.reject(error);

            });

            return defer.promise;
        }

        // Get all the chat messages associated with a specific chat room from the mongoDB
        function getAllMessagesForAChatRoom(roomId) {
            
            var defer = $q.defer();

            $http({
                method: 'GET',
                url: originLoungeExpressAPIBaseURL + 'messages/' + roomId
            })

            .then(function(response) {
                
                if (typeof response.data === "object") {

                    defer.resolve(response.data);
                
                } else {

                    defer.reject(response);
                }
    
            },

            function(error) {

                defer.reject(error);

            });

            return defer.promise;
        }

        // Get a specific chat room from the chats collection within the mongoDB
        function getAllUsersInAChatRoom(roomId) {
            
            var defer = $q.defer();

            $http({
                method: 'GET',
                url: originLoungeExpressAPIBaseURL + 'chats/' + roomId
            })

            .then(function(response) {
                
                if (typeof response.data === "object") {

                    defer.resolve(response.data);
                
                } else {

                    defer.reject(response);
                }
    
            },

            function(error) {

                defer.reject(error);

            });

            return defer.promise;
        }

        // Gets a random giphy based on the string passed in
        function getGiphy(string) {
            
            var defer = $q.defer();

            $http({
                method: 'GET',
                url: 'http://api.giphy.com/v1/gifs/translate',
                params: {
                    s: string,
                    api_key: 'dc6zaTOxFJmzC'
                }
            })

            .then(function(response) {
                
                if (typeof response.data === "object") {

                    defer.resolve(response.data.data);
                
                } else {

                    defer.reject(response);
                }
    
            },

            function(error) {

                defer.reject(error);

            });

            return defer.promise;
        }

        // Get all the chatrooms that a user is subscribed to from the chats collection in mongoDB
        function getChatsForAUser(userId) {
            
            var defer = $q.defer();

            $http({
                method: 'GET',
                url: originLoungeExpressAPIBaseURL + 'chats/userid/' + userId
            })

            .then(function(response) {
                
                if (typeof response.data === "object") {

                    defer.resolve(response.data);
                
                } else {

                    defer.reject(response);
                }
    
            },

            function(error) {

                defer.reject(error);

            });

            return defer.promise;
        }

        // Registers socket.io listeners
        function on(eventName, callback) {

          $rootScope.socket.on(eventName, function () {  
            
            var args = arguments;
            $rootScope.$apply(function () {
              
              callback.apply($rootScope.socket, args);
            
            });
          
          });
        }

        // Add a chat message to the mongo DB's messsages collection
        function postMessage(message) {

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

            .then(function(response) {
                
                if (typeof response.data === "object") {

                    defer.resolve(response.data);
                
                } else {

                    defer.reject(response);
                }
    
            },

            function(error) {

                defer.reject(error);

            });

            return defer.promise;

        }

        // Add a chatroom to the mongoDB's chats collection
        function postChat(chatType, chatName, users) {

            var defer = $q.defer();

            $http({
                method: 'POST',
                url: originLoungeExpressAPIBaseURL + 'chats/',
                data: $.param({
                    groupType: chatType,
                    channelname: chatName,
                    users: users
                }),
                headers: {
                'Content-Type' : 'application/x-www-form-urlencoded'
              }
            })

            .then(function(response) {
                
                if (typeof response.data === "object") {

                    defer.resolve(response.data);
                
                } else {

                    defer.reject(response);
                }
    
            },

            function(error) {

                defer.reject(error);

            });

            return defer.promise;

        }

        // Register's socket.io emit functions
        function emit(eventName, data, callback) {
          
          $rootScope.socket.emit(eventName, data, function () {
        
            var args = arguments;
            $rootScope.$apply(function () {
        
            if (callback) {
              callback.apply($rootScope.socket, args);
            }
        
          });
        
        });
      }
    }
})();