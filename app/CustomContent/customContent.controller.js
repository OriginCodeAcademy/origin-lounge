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
   
        activate();

        ////////////////

        function activate() {
            vm.contentTest =
            DashboardFactory.getContent().then (

                function(response) {
                return response;
                })
          
        
            console.log("In Activate of CategoryController");
        }

        function addCategory () {

        	DashboardFactory.postCategory(vm.category).then(

        		function(response) {

        			console.log(response);

        		},

        		function(error){

                    console.log(error);

        		}); 
        }
        function editCategory(){
            DashboardFactory.editCategory(vm.data).then(function(response){    
                return response;
            }),
            function(error){
                return error;
            }
        } 
        function addContent(title, body){

            DashboardFactory.postContent(title, body).then (

                function(response) {
                return response;
                })
          
        }              
    }
})();