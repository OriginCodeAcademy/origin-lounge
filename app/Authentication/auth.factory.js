(function() {
    'use strict';

    angular
        .module('app')
        .factory('AuthFactory', AuthFactory);

    AuthFactory.$inject = ['$http', '$q', 'originAPIBaseURL' ];

    /* @ngInject */
    function AuthFactory($http, $q, originAPIBaseURL) {
        var service = {
            verifyCredentials: verifyCredentials
        };
        return service;

        ////////////////

        function verifyCredentials(username, userPassword) {

        	var defer = $q.defer();


        	var info = 'grant_type=password&username=' + username + '&password=' + userPassword;

        	
        	$http({
        		method: 'POST',
        		url: originAPIBaseURL + 'token',
        		data: info,
        		headers: {
        			'Content-Type' : 'application/x-www-form-urlencoded'
        		}	
        		
        	})
            .then(function(response) {

                
            	if (typeof response.data === 'object') {

            		defer.resolve(response.data);

            	} else {

            		defer.reject(response);

            	}
            },

            // HTTP error handler
            function(error){

            	defer.reject(error);

            });

            return defer.promise;
        }


        
    }
})();