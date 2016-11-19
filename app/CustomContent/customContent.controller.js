(function() {
    'use strict';

    angular
        .module('app')
        .controller('CustomContentController', CustomContentController);

    CustomContentController.$inject = ['$stateParams', 'DashboardFactory'];

    
    function CustomContentController($stateParams, DashboardFactory) {
        var vm = this;

        var categoryId = $stateParams.categoryId;
        var categoryName = $stateParams.categoryName;
        vm.contentTitle = $stateParams.contentTitle;
        vm.contentBody = $stateParams.contentBody;

        vm.deleteContentFromACategory = deleteContentFromACategory;

        activate();

        function activate() {

            // display category name to content view
            vm.categoryName = categoryName;

            // get all content associated with the specific category Id
            DashboardFactory.getContentByCategoryId(categoryId).then(

                function(response){

                    vm.content = response;

                },

                function(error){


                });

        }

        function deleteContentFromACategory(contentId, categoryId) {

            // remove content from contentcategory table

            DashboardFactory.deleteContentCategoryEntry(contentId, categoryId).then(

                function(response){

                // remove content from local content array

                },

                function(error){

                    console.log(error);

                });
        }

    }

})();