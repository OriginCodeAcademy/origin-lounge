(function() {
    'use strict';

    angular
        .module('app')
        .factory('storageFactory', storageFactory);

    storageFactory.$inject = ['localStorageService'];

    /* @ngInject */
    function storageFactory(localStorageService) {
        var service = {
            clearAllLocalStorage: clearAllLocalStorage,
            getLocalStorage: getLocalStorage,
            setLocalStorage: setLocalStorage

        };
        return service;

        ////////////////

        function clearAllLocalStorage(){
            return localStorageService.clearAll();

        }

        function getLocalStorage(key){
            return localStorageService.get(key);

        }
        
        function setLocalStorage(key, value) {
        	 return  localStorageService.set(key, value);
        }

    }
})();