(function() {
    'use strict';

    angular
        .module('app')
        .controller('MainController', MainController);

    MainController.$inject = ['TestService', '$http'];

    /* @ngInject */
    function MainController(TestService, $http) {
        var vm = this;
        vm.title = 'MainController';
        vm.url = '';
        vm.theCode = '';
        vm.accessToken = '';

        activate();

        ////////////////

        function activate() {
            vm.url = document.URL;
            // console.log(theURL.split('code=', '&state='));
            // console.log(theURL);

            vm.theCode = getQueryString('code'); // returns 'chicken'
            console.log(vm.theCode);
        }

    function getQueryString( field, url ) {
        var href = url ? url : window.location.href;
        var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
        var string = reg.exec(href);
        return string ? string[1] : null;
    };


        vm.buttonPress = function(){

            // Direct Users to login and accept page
            window.location = 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=78u5hifpyxfrgt&redirect_uri=http://localhost:8080/&state=d5xbNanHOo5&scope=r_basicprofile';
       }

       // Pulls the access token and saves it
       vm.secondButton = function(theCode) {
            console.log(theCode);
            return $http({
                method:'POST',
                url: 'https://www.linkedin.com/oauth/v2/accessToken',
                params:{
                    grant_type: 'authorization_code',
                    code: theCode,
                    redirect_uri: 'http://localhost:8080/',
                    client_id: '78u5hifpyxfrgt',
                    client_secret: 'ifMXtB07pthXUJ4G'
                }
            }).then(function(response){
                console.log(response);
                vm.accessToken = response;
                return response;
            });
       }



       vm.thirdButton = function(access){
            console.log(access.data.access_token);
        return $http({
            method: 'GET',
            url: 'https://www.linkedin.com/v1/people/~',
            params:{
                format: 'json',
                oauth2_access_token: access.data.access_token
            }
        }).then(function(response){
            console.log(response);
            return response;
        });
       }
    }
})();