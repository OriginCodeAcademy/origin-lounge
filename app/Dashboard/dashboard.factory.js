(function() {
    'use strict';

    angular
    .module('app')
    .factory('DashboardFactory', DashboardFactory);

    DashboardFactory.$inject = ['$http', '$q', 'storageFactory'];

    function DashboardFactory($http, $q, storageFactory) {
        var service = {
            getCategory: getCategory,
            postCategory: postCategory,
            editCategory: editCategory,
            getContent: getContent,
            postContent: postContent
            // editContent: editContent
        };
        return service;

        ////////////////

        function getCategory() {
            return $http({
                method:'GET',
                url:'http://localhost:3000/api/category'
            })
            .then(function(response){
                return response;
            })
        }

        function postCategory(catName){
              // creates the params portion of the POST URL
              var info = 'name=' + catName;
              return $http({
                method:'POST',
                url:'http://localhost:3000/api/category',
                data: info,
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
                //form:{'name':catName }
            })
              .then(function(response){
                console.log("successfully added the" +catName+ "from factory to database");
                return response;
            })
          }
          function editCategory(info){
            return $http({
                method:'PUT',
                url:'http://localhost:3000/api/category' + info.id,
                data: info,
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
                //form:{'name':catName }
            })
            .then(function(response){
                console.log("successfully added the" +catName+ "from factory to database");
                return response;
            }),
            function(error){
                return error;
            }
        }
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
             function getContent() {
            return $http({
                method:'GET',
                url:'http://localhost:3000/api/content'
            })
            .then(function(response){
                return response.data;
            })
        }
            function postContent(title, body){
              // creates the params portion of the POST URL
              var userName = storageFactory.getLocalStorage('userSession').user.userName;
              var info = 'title=' + title + '&bodyDescr=' + body + '&createdBy=' + userName;
              return $http({
                method:'POST',
                url:'http://localhost:3000/api/content',
                data: info,
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
                //form:{'name':catName }
            })
              .then(function(response){
                console.log("successfully added the" + title + "from factory to database");
                return response;
            })
          }

        



    }
})();