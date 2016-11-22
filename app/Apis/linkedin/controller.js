(function() {
    'use strict';

    angular
        .module('app')
        .controller('LinkedinController', LinkedinController);

    LinkedinController.$inject = ['$http'];

    /* @ngInject */
    function LinkedinController($http) {
        var vm = this;
        vm.title = 'LinkedinController';
        vm.url = '';
        vm.theCode = '';
        vm.accessToken = '';

        activate();

        ////////////////

        function activate() {
            vm.url = document.URL;

            vm.theCode = getQueryString('code');
            console.log(vm.theCode);

            //Checks if the user has an access code
            if(vm.theCode != null) {
                return $http({
                method:'POST',
                url: 'https://www.linkedin.com/oauth/v2/accessToken',
                params:{
                    grant_type: 'authorization_code',
                    code: vm.theCode,
                    redirect_uri: 'http://localhost:8080/',
                    client_id: '78u5hifpyxfrgt',
                    client_secret: 'ifMXtB07pthXUJ4G'
                }
                }).then(function(response){
                    console.log(response);
                    vm.accessToken = response.data.access_token;
                    return $http({
                        method: 'GET',
                        url: 'https://www.linkedin.com/v1/people/~',
                        params:{
                            format: 'json',
                            oauth2_access_token: response.data.access_token
                        }
                    }).then(function(response){
                        console.log(response);
                        vm.response = response;
                            return $http({
                                method: 'POST',
                                url: 'http://localhost:3000/api/apicode',
                                header:{
                                    'Content-Type' : 'application/x-www-form-urlencoded'
                                },
                                data:{
                                    userId: 8,
                                    linkedInKey: vm.accessToken,
                                    linkedInUrl: response.data.siteStandardProfileRequest.url
                                }
                            }).then(function(response){
                                console.log(response);
                            });
                        // return response;
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

        vm.buttonPress = function(){

            window.location = 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=78u5hifpyxfrgt&redirect_uri=http://localhost:8080/&state=d5xbNanHOo5&scope=r_basicprofile';
       }
    }
})();