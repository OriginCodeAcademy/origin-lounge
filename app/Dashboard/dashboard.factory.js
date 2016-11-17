(function() {
    'use strict';

    angular
    .module('app')
    .factory('DashboardFactory', DashboardFactory);

    DashboardFactory.$inject = ['$http', '$q', 'storageFactory', 'originAPIBaseURL'];

    function DashboardFactory($http, $q, storageFactory, originAPIBaseURL) {
        var service = {
            getCategory: getCategory,
            postCategory: postCategory,
            editCategory: editCategory,
            getContent: getContent,
            postContent: postContent,
            getRoles: getRoles
            // editContent: editContent
        };
        return service;

        // get all Categories from mongoDB
        function getCategory() {
            
            var defer = $q.defer();

            $http({
                method:'GET',
                url:'http://localhost:3000/api/category'
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

        // post a Category to the mongoDB
        function postCategory(catName){

              var defer = $q.defer();
              
              // creates the body portion of the POST URL
              var info = 'name=' + catName;

              $http({
                method:'POST',
                url:'http://localhost:3000/api/category',
                data: info,
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }

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

          // edit a Category in the mongoDB
          function editCategory(info){

            var defer = $q.defer();

            $http({
                method:'PUT',
                url:'http://localhost:3000/api/category' + info.id,
                data: info,
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }

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


         // get a Content entry in the mongoDB, by content ID
         function getContent(incoming) {

            var defer = $q.defer();

            $http({
                method:'GET',
                url:'http://localhost:3000/api/content/'+incoming
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

        // post a new Content entry into the mongoDB
        function postContent(title, body){

          var defer = $q.defer();
          
          // grab logged in user's username from localstorage
          var userName = storageFactory.getLocalStorage('userSession').user.userName;
          
          // create the body portion of the POST URL
          var info = 'title=' + title + '&bodyDescr=' + body + '&createdBy=' + userName;
          
          $http({
            method:'POST',
            url:'http://localhost:3000/api/content',
            data: info,
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }

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

          // get all roles from origin.api 
          function getRoles() {

            var defer = $q.defer();

            var token = storageFactory.getLocalStorage('userSession').token;

            $http({
                method: 'GET',
                url: originAPIBaseURL + 'api/roles',
                headers: {
                    'Authorization' : 'Bearer ' + token
                }
            })

            .then(function(response){

                if (typeof response.data === "object") {

                    storageFactory.setLocalStorage('roles', response.data);
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

    }
})();