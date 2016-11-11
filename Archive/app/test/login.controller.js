(function() {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['TestService', '$http'];

    /* @ngInject */
    function LoginController(TestService, $http) {
        var vm = this;
        vm.title = 'LoginController';
      	vm.url = '';
        vm.theCode = '';
        vm.accessToken = '';

        activate();

        ////////////////

        function activate() {
            vm.url = document.URL;
            // console.log(theURL.split('code=', '&state='));
            // console.log(theURL);

            vm.theCode = getQueryString('code');
            console.log(vm.theCode);
        }

    function getQueryString( field, url ) {
        var href = url ? url : window.location.href;
        var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
        var string = reg.exec(href);
        return string ? string[1] : null;
    };

        vm.click = function(){
        	window.location = 'https://github.com/login/oauth/authorize?client_id=002a38cda403a1aa12a6&redirect_uri=http://localhost:8080/';
    }

    vm.touch = function(code) {
    	console.log(code);
    	return $http({
    		method: 'POST',
    		url: 'https://github.com/login/oauth/access_token',
    		params:{
    			client_id: '002a38cda403a1aa12a6',
    			client_secret: 'd070a664e3166d7bf3a3b4bf0515f2840b39a3a4',
    			code: code,
    			redirect_uri: 'http://localhost:8080/'
    		}
    	}).then(function(response){
    		console.log(response);
            vm.accessToken = response;
    		return response;
    	});
   }

   vm.touchAgain = function(access){
        console.log(access.data);
        return $http({
            method: 'GET',
            url: 'https://api.github.com/user/repos/commits?' + access.data
        }).then(function(response){
            console.log(response);
            return response;
        });
       }



}
})();































