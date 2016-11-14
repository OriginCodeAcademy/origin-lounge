(function() {
    'use strict';

    angular
        .module('app')
        .controller('MainController', MainController);

    MainController.$inject = ['$http', '$window'];

    /* @ngInject */
    function MainController($http, $window) {
        var vm = this;
        vm.title = 'MainController';
        vm.eventDate = '';
        //Sample array to populate calendar
        vm.eventTypeArray = ['green', 'blue', 'red', 'grey'];
        vm.eventsArray = [{
            title: 'Event1',
            start: '2016-11-04',
            backgroundColor: 'red'
        },
        {
            title: 'Event2',
            start: '2016-11-05'
        },
        {
            title: 'Test Event',
            start: '2016-11-12'
        }];

        activate();

        ////////////////


        function activate() {
            //Hides event add box on page load
            $('#eventBox').hide();
        }

         $('#calendar').fullCalendar({

            //Click on day to add new event
            dayClick: function(date) {
                console.log(date.format());
                vm.eventDate = date.format();
                $('#eventBox').show();
                $('#eventDate').text(date.format());
            },
            //Click on event that has a url link
            eventClick: function(event) {
        if (event.url) {
            window.open(event.url);
            return false;
        }
        },
        header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,basicWeek'
    },
    defaultView: 'basicWeek',
         events: vm.eventsArray
    })
         console.log();

    //Add event button
    vm.addEvent = function(eventDate, eventTitle, eventUrl, eventDetails, eventType){

        console.log(eventType);
        //Adds event to array
        vm.eventsArray.push({
            'title' : eventTitle, 
            'start' : eventDate, 
            'url' : eventUrl, 
            'details' : eventDetails, 
            'backgroundColor' : vm.eventTypeArray[eventType],
            'borderColor' : vm.eventTypeArray[eventType]});

        console.log(vm.eventsArray);

        //Reloads calendar with new event added
        $('#calendar').fullCalendar( 'removeEventSource', vm.eventsArray );
        $('#calendar').fullCalendar( 'addEventSource', vm.eventsArray );

        //Resets the add event box
        vm.eventTitle = '';
        vm.eventUrl = '';

        $('#eventBox').hide();
    }

    //Cancel event add button
    vm.cancelEvenAdd = function(){

        //Resets the add event box
        vm.eventTitle = '';
        vm.eventUrl = '';

        $('#eventBox').hide();
    }
    }

 
})();