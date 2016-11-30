
(function() {
    'use strict';
    angular
        .module('app')
        .factory('chatFactory', chatFactory);
    chatFactory.$inject = ['$http', '$q', 'originLoungeExpressAPIBaseURL', 'chatServerURLAndPort', '$rootScope'];
    /* @ngInject */
    function chatFactory($http, $q, originLoungeExpressAPIBaseURL, chatServerURLAndPort, $rootScope) {
        $rootScope.socket = io.connect(chatServerURLAndPort);
        var service = {

            getChatsForAUser: getChatsForAUser,
            emit: emit,
            on: on
        };
        return service;

        function getChatsForAUser(userId) {
            
            var defer = $q.defer();

            $http({
                method: 'GET',
                url: originLoungeExpressAPIBaseURL + 'messagerecipients/' + userId
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