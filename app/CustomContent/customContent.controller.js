(function() {
    'use strict';

    angular
        .module('app')
        .controller('CategoryController', CategoryController);

    CategoryController.$inject = ['DashboardFactory'];

    /* @ngInject */
    function CategoryController(DashboardFactory) {
        var vm = this;
        vm.title = 'CategoryController';
        vm.addCategory = addCategory;
        vm.editCategory = editCategory;
        vm.addContent = addContent;
        vm.getContentById = getContentById;
   
        activate();

        ////////////////

        function activate() {
            
            getContentById();
            console.log("In Activate of CategoryController");
        
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

        // get a content item by ID from the MongoDB    
        function getContentById(){

            DashboardFactory.getContent("582cf048e54139041c7a3a2a").then (

            function(response) {

                vm.markdown = response.bodyDescr;
                vm.markdownTitle = response.title;
            
            },

            function(error){

                console.log(error);

            });
        }


        // add content to the mongoDB
        function addContent(title, body){

            DashboardFactory.postContent(title, body).then (

                function(response) {

                    console.log(response);
                
                },

                function (error){

                    console.log(error);

                });
          
        }              
    }
})();