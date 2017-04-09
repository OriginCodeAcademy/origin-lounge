(function() {
    'use strict';

    angular
    .module('app')
    .factory('DashboardFactory', DashboardFactory);

    DashboardFactory.$inject = [
        '$http',
        '$q',
        'storageFactory',
        'originAPIBaseURL',
        'originLoungeExpressAPIBaseURL'];

    function DashboardFactory(
        $http,
        $q,
        storageFactory,
        originAPIBaseURL,
        originLoungeExpressAPIBaseURL) {
        
        var service = {

            deleteContentCategoryEntry: deleteContentCategoryEntry,

            editCategory: editCategory,

            getCategories: getCategories,
            getCategoryNamesByRoleId: getCategoryNamesByRoleId,
            getContentByCategoryId: getContentByCategoryId,
            getContentByContentId: getContentByContentId,
            getRoles: getRoles,
            getUsers: getUsers,
            
            postCategory: postCategory,
            postContent: postContent,
            postContentCategory: postContentCategory

        };
        return service;

          // Delete a ContentCategory entry in the mongoDB
          function deleteContentCategoryEntry (contentCategoryId) {

            var defer = $q.defer();

            $http({
                method: 'DELETE',
                url: originLoungeExpressAPIBaseURL + 'contentcategory/' + contentCategoryId
            })

            .then(function(response) { 

                if (typeof response.data === "object") {

                    defer.resolve(response.data);
                
                } else {

                    defer.reject(response);
                }

            },

            function(error) {

                defer.reject(error);

            });

            return defer.promise;

          }

          // Edit a Category entry in the mongoDB
          function editCategory(info) {

            var defer = $q.defer();

            $http({
                method:'PUT',
                url: originLoungeExpressAPIBaseURL + 'category/' + info.id,
                data: info,
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }

            })

            .then(function(response) {

                if (typeof response.data === "object") {

                    defer.resolve(response.data);
                
                } else {

                    defer.reject(response);
                }
    
            },

            function(error) {

                defer.reject(error);

            });

            return defer.promise;
        }

         // Get all Categories within the mongoDB
         function getCategories() {
            
            var defer = $q.defer();

            $http({
                method:'GET',
                url: originLoungeExpressAPIBaseURL + 'category/'

            })

            .then(function(response) {

                if (typeof response.data === "object") {

                    defer.resolve(response.data);
                
                } else {

                    defer.reject(response);
                }
    
            },

            function(error) {

                defer.reject(error);

            });

            return defer.promise;
        }
               
        // Get all Categories associated with a specific roleId
        function getCategoryNamesByRoleId(roleIds) {
            
            var defer = $q.defer();

            $http({
                method:'GET',
                url: originLoungeExpressAPIBaseURL + 'categorynamesbyroleid/' + roleIds

            })

            .then(function(response) {

                if (typeof response.data === "object") {

                    defer.resolve(response.data);
                
                } else {

                    defer.reject(response);
                }
    
            },

            function(error) {

                defer.reject(error);

            });

            return defer.promise;
        }

        // Get all Content entries associated with a categoryId
        function getContentByCategoryId(categoryId) {
            
            var defer = $q.defer();

            $http({
                method:'GET',
                url: originLoungeExpressAPIBaseURL + 'contentbycategoryid/' + categoryId
            })

            .then(function(response) {

                if (typeof response.data === "object") {

                    defer.resolve(response.data);
                
                } else {

                    defer.reject(response);
                }
    
            },

            function(error) {

                defer.reject(error);

            });

            return defer.promise;
        }

        // Get Content by Content ID within the mongo DB
        function getContentByContentId (contentId) {

            var defer = $q.defer();

            $http({
                method:'GET',
                url: originLoungeExpressAPIBaseURL + 'content/' + contentId
            })

            .then(function(response) {

                if (typeof response.data === "object") {

                    defer.resolve(response.data);
                
                } else {

                    defer.reject(response);
                }
    
            },

            function(error) {

                defer.reject(error);

            });

            return defer.promise;           
        }

         // Get all roles from origin.api 
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

            .then(function(response) {

                if (typeof response.data === "object") {

                    // store all roles into local storage
                    storageFactory.setLocalStorage('roles', response.data);
                    defer.resolve(response.data);
                
                } else {

                    defer.reject(response);
                }

            },

            function(error) {

                defer.reject(error);

            });

            return defer.promise;
          }

         // Get all users from origin.api 
          function getUsers() {

            var defer = $q.defer();

            var token = storageFactory.getLocalStorage('userSession').token;

            $http({
                method: 'GET',
                url: originAPIBaseURL + 'api/users/dropdown',
                headers: {
                    'Authorization' : 'Bearer ' + token
                }
            })

            .then(function(response) {

                if (typeof response.data === "object") {

                    // store all roles into local storage
                    storageFactory.setLocalStorage('users', response.data);
                    defer.resolve(response.data);
                
                } else {

                    defer.reject(response);
                }

            },

            function(error) {

                defer.reject(error);

            });

            return defer.promise;
          }

        // Post a Category to the mongoDB
        function postCategory(catName) {

              var defer = $q.defer();
              
              // creates the body portion of the POST URL
              var info = 'name=' + catName;

              $http({
                method:'POST',
                url: originLoungeExpressAPIBaseURL + 'category',
                data: info,
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }

            })

            .then(function(response) {

                if (typeof response.data === "object") {

                    defer.resolve(response.data);
                
                } else {

                    defer.reject(response);
                }
    
            },

            function(error) {

                defer.reject(error);

            });

            return defer.promise;
        }

        // Post a new Content entry into the mongoDB
        function postContent(title, body) {

          var defer = $q.defer();
          
          // grab logged in user's username from localstorage
          var userName = storageFactory.getLocalStorage('userSession').user.userName;
          
          // create the body portion of the POST URL
          var info = 'title=' + title + '&bodyDescr=' + body + '&createdBy=' + userName;
          
          $http({
            method:'POST',
            url: originLoungeExpressAPIBaseURL + 'content',
            data: info,
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }

        })
            .then(function(response) {

                if (typeof response.data === "object") {

                    defer.resolve(response.data);
                
                } else {

                    defer.reject(response);
                }
    
            },

            function(error) {

                defer.reject(error);

            });

            return defer.promise;
        }

        // Post a new Content Category entry into the mongoDB
        function postContentCategory(categories, contentId) {

          var defer = $q.defer();
          
          // Create the body portion of the POST URL
          var info = 'contentId=' + contentId + '&categoryId=' + categories;
          
          $http({
            method:'POST',
            url:originLoungeExpressAPIBaseURL + 'contentcategory',
            data: info,
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }

        })
            .then(function(response) {

                if (typeof response.data === "object") {

                    defer.resolve(response.data);
                
                } else {

                    defer.reject(response);
                }
    
            },

            function(error) {

                defer.reject(error);

            });

            return defer.promise;
        }

    }
})();