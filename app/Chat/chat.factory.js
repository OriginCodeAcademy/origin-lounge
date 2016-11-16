(function() {
    'use strict';
    angular
        .module('app')
        .factory('chatFactory', chatFactory);
    chatFactory.$inject = ['$http', '$q'];
    /* @ngInject */
    function chatFactory($http, $q) {
        var service = {
            getChat: getChat
        };
        return service;
        ////////////////
        function getChat() {
        	var defer = $q.defer();
        	$http({
        		method: 'GET',
        		url: 'localhost:8081/chat/496344'
        	}).then(function(result) {
                if(typeof result === 'object') {
                    defer.resolve(result);
                } else{
                    defer.reject('service error');
                }
            },
            function(error){
                defect.reject(error);
            });
            return defer.promise;
        }
    }
})();