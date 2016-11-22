(function() {
    'use strict';

    angular
    .module('app')
    .factory('DashboardFactory', DashboardFactory);

    DashboardFactory.$inject = ['$http', '$q', 'storageFactory', 'originAPIBaseURL'];

    function DashboardFactory($http, $q, storageFactory, originAPIBaseURL) {
        var service = {

            deleteContentCategoryEntry: deleteContentCategoryEntry,

            editCategory: editCategory,

            getCategories: getCategories,
            getCategoryNamesByRoleId: getCategoryNamesByRoleId,
            getContentByCategoryId: getContentByCategoryId,
            getContentByContentId: getContentByContentId,
            getRoles: getRoles,
            
            postCategory: postCategory,
            postContent: postContent,
            postContentCategory: postContentCategory

        };
        return service;



         function getCategories() {
            
            var defer = $q.defer();

            $http({
                method:'GET',
                url:'http://localhost:3000/api/category/'

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
               
       
        function getCategoryNamesByRoleId(roleIds) {
            
            var defer = $q.defer();

            $http({
                method:'GET',
                url:'http://localhost:3000/api/categorynamesbyroleid/' + roleIds

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

        function getContentByCategoryId(categoryId) {
            
            var defer = $q.defer();

            $http({
                method:'GET',
                url:'http://localhost:3000/api/contentbycategoryid/' + categoryId
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

        // get Content by Content ID within the mongo DB
        function getContentByContentId (contentId) {

            var defer = $q.defer();

            $http({
                method:'GET',
                url:'http://localhost:3000/api/content/' + contentId
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

        // post a new Content Category entry into the mongoDB
        function postContentCategory(categories, contentId){

          var defer = $q.defer();
          
          // create the body portion of the POST URL
          var info = 'contentId=' + contentId + '&categoryId=' + categories;
          
          $http({
            method:'POST',
            url:'http://localhost:3000/api/contentcategory',
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

                    // store all roles into local storage
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

          // delete a ContentCategory entry in the mongoDB
          function deleteContentCategoryEntry (contentCategoryId) {

            var defer = $q.defer();

            $http({
                method: 'DELETE',
                url: 'http://localhost:3000/api/contentcategory/' + contentCategoryId
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

    }
})();