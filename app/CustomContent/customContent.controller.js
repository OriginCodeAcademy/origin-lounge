(function() {
    'use strict';

    angular
        .module('app')
        .controller('CustomContentController', CustomContentController);

    CustomContentController.$inject = ['$stateParams', 'DashboardFactory'];

    
    function CustomContentController($stateParams, DashboardFactory) {
        var vm = this;
        var categoryId = $stateParams.categoryId;

        activate();

        function activate() {

            DashboardFactory.getContentByCategoryId(categoryId).then(

                function(response){

                    vm.content = response;
    
                },

                function(error){


                });

        }

    }

})();