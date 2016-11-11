(function() {
    'use strict';

    angular
        .module('app')
        .service('TestService', TestService);

    TestService.$inject = ['$http'];

    /* @ngInject */
    function TestService($http) {

        ////////////////

        this.login = function(){
        	return $http({
        		method:'GET',
        		url: 'https://www.linkedin.com/oauth/v2/authorization',
        		params:{
                    response_type: 'code',
        			client_id: '78u5hifpyxfrgt',
                    redirect_uri: 'http://localhost:8080/',
                    state: 'd5xbNanHOo5',
                    scope: 'r_basicprofile'
        		}
        	}).then(function(response){
                return response;
            });
        }
    }
})();