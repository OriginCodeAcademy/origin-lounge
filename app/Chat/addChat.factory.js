(function() {
    'use strict';
    angular
        .module('app')
        .factory('addChatFactory', addChatFactory);
    addChatFactory.$inject = ['$http', '$q', 'originAPIBaseURL'];
    /* @ngInject */
    function addChatFactory($http, $q , originAPIBaseURL) {
        var service = {
            getAllUsers: getAllUsers
        };
        return service;
        ////////////////


        function getAllUsers(role) {
        	console.log(role);
        	return $http({
        		method: 'GET',
        		url: originAPIBaseURL + 'api/users', 
        		headers: {'Authorization': "Bearer " + role}
        	}).then(function(response){
                return response.data;
            })
        }
    }
})();