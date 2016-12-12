(function() {
    'use strict';

    angular
        .module('app')
        .controller('CustomContentController', CustomContentController);

    CustomContentController.$inject = [
        'DashboardFactory',
        'storageFactory',
        '$stateParams',
        '$rootScope',
        'toastr'];

    function CustomContentController(
        DashboardFactory,
        storageFactory,
        $stateParams,
        $rootScope,
        toastr) {
        
        var vm = this;

        $rootScope.inChatState = false;
        
        // Grab these state Params that are passed into this state through the ui router from another state
        vm.categoryId = $stateParams.categoryId;        
        vm.contentBody = $stateParams.contentBody;
        vm.contentId = $stateParams.contentId;
        vm.contentTitle = $stateParams.contentTitle;

        // Array to hold the categories to be shown as "selected"
        vm.selectedCategories = [];

        // Array that holds the selected Role
        vm.selectedRole = [];

        vm.addCategory = addCategory;
        vm.addCategoriesToRole = addCategoriesToRole;
        vm.addContent = addContent;
        vm.addContentCategory = addContentCategory;
        vm.selectedRoleChanged = selectedRoleChanged;
   
        activate();


        function activate() {

            // Get all Roles from local storage (This is so the Manage Categories state can display all the roles available)
            vm.roles = storageFactory.getLocalStorage('roles');

            // Get all Categories (This is so the Manage Categories and Manage Content states can display all Categories)
            DashboardFactory.getCategories().then(

                function(response) {

                    vm.categories = response;

                    // Check list of categories returned from the mongoDB to find the one that matches the specific category Id of the category we have come into this state from
                    for (var i = 0; i < vm.categories.length; i++) {

                        if (vm.categoryId === vm.categories[i]._id) {
                            // Set the category to be pre-selected in the category pull down menu
                            vm.selectedCategories [0] = vm.categories[i];

                        }

                    }


                },

                function(error) {


                });
        
        }

        // Add a category to the mongoDB
        function addCategory () {

            DashboardFactory.postCategory(vm.category).then(

                function(response) {

                    console.log(response);

                },

                function(error){

                    console.log(error);

                }); 
        }

        function addCategoriesToRole () {

        }

        // Add content to the mongoDB
        function addContent(){


            DashboardFactory.postContent(vm.contentTitle, vm.contentBody).then (

                function(response) {

                    console.log(response);

                    // Add ContentCategory entries based on which Categories were selected and the contentId returned from posting a new content item
                    addContentCategory(vm.selectedCategories, response.contentId);
                
                },

                function (error){

                    console.log(error);
                    toastr.error("Unsuccessfully added Content");

                });
          
        }

        // Add a contentcategory to the mongoDB 
        function addContentCategory(categories, contentId) {

            DashboardFactory.postContentCategory(categories, contentId).then (

                function(response) {

                    toastr.success("added content")

                },

                function(error) {

                    toastr.error("Unsuccessfully added ContentCategory");

                });

        }

        // On-select function when selecting a role
        function selectedRoleChanged () {

            console.log(vm.selectedRole);
            DashboardFactory.getCategoryNamesByRoleId(vm.selectedRole).then(

                function(response){

                    for (var i = 0; i < response.length; i++) {
                        // set the categories to be pre-selected in the category pull down menu
                        vm.selectedCategories [i] = response[i].categoryId;
                    }
                },

                function(error){

                }
            );
        }
                      
    }
})();