(function() {
    'use strict';

   angular
        .module('myApp')
        .factory('CategoryFactory', CategoryFactory);

    CategoryFactory.$inject = ['$http'];

    /* @ngInject */
    function CategoryFactory($http) {
        var service = {
            getCategory: getCategory,
            postCategory: postCategory
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
            return $http({
                method:'POST',
                url:'http://localhost:3000/api/category',
                data: catName
            })
            .then(function(response){
                console.log("successfully added the" +catName+ "from factory to database");
                return response;
            })
        }

        
    }
})();