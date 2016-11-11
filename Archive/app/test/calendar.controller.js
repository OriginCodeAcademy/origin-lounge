(function() {
    'use strict';

    angular
        .module('app')
        .controller('CalendarController', CalendarController);

    CalendarController.$inject = ['$http'];

    /* @ngInject */
    function CalendarController($http) {
        var vm = this;
        vm.title = 'CalendarController';

        activate();

        ////////////////

     //    $('#calendar').fullCalendar({
     //  //   	dayClick: function() {
     //  //  			alert('a day has been clicked!');
    	// 	// }
    	// 	googleCalendarApiKey: 'AIzaSyCG-VFkRKprMrqqPsb7CmLd6biBP5KLxZM',
     //    events: {
     //        googleCalendarId: 'origincodelounge@gmail.com'
     //    }

    	// });
    	// $('#calendar').fullCalendar('next');

        function activate() {
        }
    }
})();