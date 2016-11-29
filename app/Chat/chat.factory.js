
(function() {
    'use strict';
    angular
        .module('app')
        .factory('chatFactory', chatFactory);
    chatFactory.$inject = ['$http', '$q', 'originLoungeExpressAPIBaseURL'];
    /* @ngInject */
    function chatFactory($http, $q, originLoungeExpressAPIBaseURL) {
        // var socket = io.connect();
        var service = {

            getChatsForAUser: getChatsForAUser
            // on: on,
            // emit: emit
        };
        return service;
        ////////////////

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

        // function on(eventName, callback) {
        //   socket.on(eventName, function () {  
        //     var args = arguments;
        //     $rootScope.$apply(function () {
        //       callback.apply(socket, args);
        //     });
        //   });
        // }

      //   function emit(eventName, data, callback) {
      //     socket.emit(eventName, data, function () {
      //       var args = arguments;
      //       $rootScope.$apply(function () {
      //       if (callback) {
      //         callback.apply(socket, args);
      //       }
      //     });
      //   })
      // }
    }
})();