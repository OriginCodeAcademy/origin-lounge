(function() {
    'use strict';

    angular
        .module('app')
        .controller('CustomContentController', CustomContentController);

    CustomContentController.$inject = ['DashboardFactory', 'storageFactory', '$stateParams', 'toastr'];

    /* @ngInject */
    function CustomContentController(DashboardFactory, storageFactory, $stateParams, toastr) {
        var vm = this;

        // grab these state Params that are passed into this state through the ui router from another state
        vm.categoryId = $stateParams.categoryId;        
        vm.contentBody = $stateParams.contentBody;
        vm.contentId = $stateParams.contentId;
        vm.contentTitle = $stateParams.contentTitle;

        // array to hold the categories to be pre-selected when we come into the manage content state from the category content state
        vm.selectedCategories = [];

        // array that holds the selected Role
        vm.selectedRole = [];

        vm.addCategory = addCategory;
        vm.addCategoriesToRole = addCategoriesToRole;
        vm.addContent = addContent;
        vm.addContentCategory = addContentCategory;
        vm.selectedRoleChanged = selectedRoleChanged;

        vm.editCategory = editCategory;
   
        activate();

        ////////////////

        function activate() {

            // get all Roles from local storage
            vm.roles = storageFactory.getLocalStorage('roles');

            // get all Categories
            DashboardFactory.getCategories().then(

                function(response) {

                    vm.categories = response;

                    // check list of categories returned from the mongoDB to find the one that matches the specific category Id of the category we have come into this state from
                    for (var i = 0; i < vm.categories.length; i++) {

                        if (vm.categoryId === vm.categories[i]._id) {
                        
                            // set the category to be pre-selected in the category pull down menu
                            vm.selectedCategories [0] = vm.categories[i];

                        }

                    }


                },

                function(error){


                });
        
        }

        // add a category to the mongoDB
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

        // add content to the mongoDB
        function addContent(){


            DashboardFactory.postContent(vm.contentTitle, vm.contentBody).then (

                function(response) {

                    console.log(response);

                    //adds ContentCategory entries based on which Categories were selected and the contentId returned from posting a new content item
                    addContentCategory(vm.selectedCategories, response.contentId);
                
                },

                function (error){

                    console.log(error);
                    toastr.error("Unsuccessfully added Content");

                });
          
        }

        // add a contentcategory to the mongoDB 
        function addContentCategory(categories, contentId) {

            DashboardFactory.postContentCategory(categories, contentId).then (

                function(response) {

                    toastr.success("added content")

                },

                function(error) {

                    toastr.error("Unsuccessfully added ContentCategory");

                });

        }

        // edit a Category in the mongoDB
        function editCategory(){
           
            DashboardFactory.editCategory(vm.data).then(

                function(response){    
                   
                    console.log(response);
                
                },
           
                function(error){
                
                    console.log(error);
                
                });
        } 

        // on-select function when selecting a role
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