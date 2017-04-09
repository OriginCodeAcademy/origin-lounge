(function() {
    'use strict';

    angular
        .module('app')
        .factory('storageFactory', storageFactory);

    storageFactory.$inject = ['localStorageService'];

    function storageFactory(localStorageService) {
        var service = {
            clearAllLocalStorage: clearAllLocalStorage,
            getLocalStorage: getLocalStorage,
            setLocalStorage: setLocalStorage

        };
        return service;

        // Clears all local storage
        function clearAllLocalStorage() {
            return localStorageService.clearAll();

        }

        // Gets a value from local storage
        function getLocalStorage(key) {
            return localStorageService.get(key);

        }
        
        // Sets a value to local storage
        function setLocalStorage(key, value) {
        	 return  localStorageService.set(key, value);
        }

    }
})();