(function() {
    'use strict';

    angular
        .module('app')
        .factory('calendarFactory', calendarFactory);

    calendarFactory.$inject = ['$http'];

    /* @ngInject */
    function calendarFactory($http) {
        var service = {
            getEvent: getEvent,
            postEvent: postEvent,
            getUserEvent: getUserEvent,
            getEventTitles: getEventTitles
        };
        return service;

        ////////////////

        function getEvent() {
        	return $http({
        		method: 'GET',
        		url: 'http://localhost:3000/api/event',
        		header:{
        			'Content-Type' : 'application/x-www-form-urlencoded'
        		}
        	}).then(function(results){
        		// console.log(results);
        		return results.data.length;
        	});
        }

        function postEvent(title, date, details, id, eventId, userId, groupId) {
        	console.log(id);
        	return $http({
        		method: 'POST',
        		url: 'http://localhost:3000/api/event',
        		header:{
        			'Content-Type' : 'application/x-www-form-urlencoded'
        		},
        		data:{
        			eventId: id,
        			title: title,
        			detail: details,
        			eventTypeId: eventId,
        			date: date
        			// time:
        		}
        	}).then(function(results){
        		return $http({
        		method: 'POST',
        		url: 'http://localhost:3000/api/usergroupevent',
        		header:{
        			'Content-Type' : 'application/x-www-form-urlencoded'
        		},
        		data:{
        			eventId: id,
        			userId: userId,
        			groupId: groupId
        		}
        	}).then(function(results){
        		
        		// console.log(results);
        	})
        		// console.log(results);
        	})
        }

        function getUserEvent(userId) {

        	return $http({
        		method: 'GET',
        		url:'http://localhost:3000/api/usergroupevent/' + userId,
        		header:{
        			'Content-Type' : 'application/x-www-form-urlencoded'
        		}

        	}).then(function(result){
        		// console.log(result);
        		return result;
        	})
        }

        function getEventTitles(array) {

        	return $http({
        		method: 'GET',
        		url: 'http://localhost:3000/api/event/' + array,
        		header:{
        			'Content-Type' : 'application/x-www-form-urlencoded'
        		}
        	}).then(function(result){
        		// console.log(result);
        		return result;
        	});

        }





    }
})();