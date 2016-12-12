(function() {
    'use strict';

    angular
        .module('app')
        .controller('GithubController', GithubController);

    GithubController.$inject = ['$http', '$rootScope'];

    /* @ngInject */
    function GithubController($http, $rootScope) {
        var vm = this;

        $rootScope.inChatState = false;
        vm.title = 'GithubController';
      	vm.url = '';
        vm.theCode = '';
        vm.accessToken = '';

        activate();

        ////////////////

        function activate() {
            vm.url = document.URL;

            vm.theCode = getQueryString('code');
            console.log(vm.theCode);

            if (vm.theCode != null) {
                return $http({
                    method: 'POST',
                    url: 'https://github.com/login/oauth/access_token',
                    params:{
                        client_id: '002a38cda403a1aa12a6',
                        client_secret: 'd070a664e3166d7bf3a3b4bf0515f2840b39a3a4',
                        code: vm.theCode,
                        redirect_uri: 'http://localhost:8080/#/main/github_index'
                    }
                }).then(function(response){
                    console.log(response);
                    vm.accessToken = response;

                    return $http({
                        method: 'GET',
                        url: 'https://api.github.com/user/repos?' + response.data
                    }).then(function(response){
                        console.log(response);
                        vm.repo = response.data;
                        console.log(response.data[0].name);
                        console.log(vm.repo[0].owner.login);
                        return response;
                    });
                });
            }
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
}
})();
