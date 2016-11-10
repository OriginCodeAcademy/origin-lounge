(function() {
    'use strict';

    angular
        .module('app')
        .factory('storageFactory', storageFactory);

    storageFactory.$inject = ['localStorageService'];

    /* @ngInject */
    function storageFactory(localStorageService) {
        var service = {
            setLocalStorage: setLocalStorage,
            getLocalStorage: getLocalStorage
        };
        return service;

        ////////////////

        function setLocalStorage(key, value) {
        	 return  localStorageService.set(key, value);
        }

        function getLocalStorage(key){
        	return localStorageService.get(key);

        }
    }
})();