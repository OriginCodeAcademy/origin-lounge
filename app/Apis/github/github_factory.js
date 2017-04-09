(function() {
    'use strict';

    angular
        .module('app')
        .factory('GithubFactory', GithubFactory);

    GithubFactory.$inject = ['$http', 'originLoungeExpressAPIBaseURL'];

    /* @ngInject */
    function GithubFactory($http, originLoungeExpressAPIBaseURL) {
        var service = {
            getGithub: getGithub
        };
        return service;

        ////////////////

        function getGithub() {
        	return $http({
        		method: 'GET',
        		url: originLoungeExpressAPIBaseURL + 'apicode',
        		header:{
        			'Content-Type' : 'application/x-www-form-urlencoded'
        		},
        		data:{
        			githubKey: githubKey
        		}
        	}).then(function(results){
        		console.log(results)
        		return results.data;
        	});
        }

	    function postGithub(githubKey){
	    	return $http({
	    		method: 'POST',
	    		url: originLoungeExpressAPIBaseURL + 'apicode',
	    		header:{
	    			'Content-Type': 'application/x-www-form-urlencoded' 
	    		},
	    		data:{
	    			githubKey: githubKey
	    		}
	    	}).then(function(results){
	    		return $http({
	    		method: 'POST',
	    		url: originLoungeExpressAPIBaseURL + 'apicode',
	    		header:{
    				'Content-Type': 'application/x-www-form-urlencoded' 
	    		},
	    		data:{
	    			githubKey: githubKey
	    		}
    		}).then(function(results){
    			
    		})

	    	})
	    }
    }
})();