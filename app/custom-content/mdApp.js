'use strict';
var app = 
angular.module('myApp', ['ui.router',
        'hc.marked', 'hljs', 'angular-markdown-editor'
    ])
    .config(['markedProvider', 'hljsServiceProvider', function(markedProvider, hljsServiceProvider) {
        // markdown config
        markedProvider.setOptions({
            gfm: true,
            tables: true,
            sanitize: true,
            highlight: function(code, lang) {
                if (lang) {
                    return hljs.highlight(lang, code, true).value;
                } else {
                    return hljs.highlightAuto(code).value;
                }
            }
        });


        // highlight config
        hljsServiceProvider.setOptions({
            // replace tab with 4 spaces
            tabReplace: '    '
        });
    }])

.config(function($urlRouterProvider, $stateProvider) {

    $urlRouterProvider.otherwise('/index')

    $stateProvider
        .state('announcement', {
            url: '/announcement',
            templateUrl: 'app/partials/announcement.html'
        })
        .state('currentAssignment', {
            url: '/currentAssignment',
            templateUrl: 'app/partials/currAssignment.html'
        })
        .state('managecontent', {
            url: '/managecontent',
            templateUrl: 'app/partials/managecontent.html',
            // controllerAs: 'vm',
            // controller: 'PostController'
        })
        .state('countdown', {
            url: '/countdown',
            templateUrl: 'app/partials/countdown.html'
        })
})

.controller("MainController", ["$scope", "marked", function MarkdownController($scope, marked) {
    $scope.markdown = "Origin Code Academy:";
    $scope.markdownService = marked('#TEST');


    // --
    // normal flow, function call
    $scope.convertMarkdown = function() {
        vm.convertedMarkdown = marked(vm.markdown);
    }


}]);



//////////////////////////////////////////////////////////////////////////////////////
//**********************************************************************************\\


app.controller('CategoryController', CategoryController);

CategoryController.$inject = ['$http', 'CategoryFactory'];

/* @ngInject */
function CategoryController($http, CategoryFactory) {
    var vm = this;
    vm.title = 'CategoryController';

    activate();
    ////////////////

    function activate() {
        CategoryFactory.getCategory().then(function(response) {
            vm.data = response.data;
        })
    }
};

//////////////////////////////////////////////////////////////////////////////////////
//**********************************************************************************\\


app.controller('PostController', PostController);

PostController.$inject = ['$http', 'CategoryFactory'];

/* @ngInject */
function PostController($http, CategoryFactory) {
    var vm = this;
    vm.title = 'PostController';
    vm.add= add;

   
    ////////////////

    function add() {
        

        
       
        CategoryFactory.postCategory(vm.addCategory).then(function(response) {
            console.log("passed the name" + vm.addCategory + "from add funtion to factory!");
    
            return response;
        })
    }
};



