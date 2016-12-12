(function() {
    'use strict';

    angular
        .module('app')
        .controller('CalendarController', CalendarController);

    CalendarController.$inject = [
        '$http',
        '$window',
        '$filter',
        '$rootScope', 
        'calendarFactory',
        'localStorageService'];

    /* @ngInject */
    function CalendarController(
        $http,
        $window,
        $filter, 
        $rootScope,
        calendarFactory,
        localStorageService) {
        
        var vm = this;
        vm.title = 'CalendarController';
        vm.eventDate = '';
        vm.eventId = '';
        vm.eventIdsArray = [];
        vm.events = [];
        vm.eventTypes = [];

        vm.userId = '';
        //Sample array to populate calendar
        vm.eventTypeArray = ['green', 'blue', 'red', 'purple', 'grey'];

        vm.calendarArray = [];
        
        $rootScope.inChatState = false;

        activate();

        ////////////////


        function activate() {
            vm.userId = localStorageService.get('userSession').user.userId;

            calendarFactory.getEvent().then(function(result){
                // console.log(result);
            });

            calendarFactory.getUserEvent(vm.userId).then(function(result){
                // console.log(result);
                for(var i = 0; i < result.data.length; i++){
                    // console.log(result.data[i].eventId);
                    vm.eventIdsArray.push(result.data[i].eventId);
                    console.log(vm.eventTypeArray);
                }

                console.log(vm.eventTypeArray);
                for(var j = 0; j < vm.eventIdsArray.length; j++){
                // console.log(vm.eventIdsArray[i]);
                calendarFactory.getEventTitles(vm.eventIdsArray[j]).then(function(result){
                    // console.log(result.data[0].eventTypeId);
                    vm.events.push({'title' : result.data.title, 'start' : result.data.date, 'eventTypeId' : result.data.eventTypeId, 'detail' : result.data.detail});
                    console.log(vm.events);

                $('#calendar').fullCalendar( 'removeEventSource', vm.events );
                $('#calendar').fullCalendar( 'addEventSource', vm.events );
                });
            }
            });
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
                $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
            },
            //Click on event that has a url link
            eventClick: function(event) {
                console.log(event);
                $('#eventBox').show();
                $('#eventDate').text(event._start._d);
                $('#eventTitle').val(event.title);
                $('#eventDetails').val(event.detail);
                $('#eventType').val(event.eventTypeId);
                $('#eventAddButton').replaceWith('<button class="btn col-sm-4" id="eventUpdateButton" onclick ="updateEvent()">Update Event</button>');
                $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });

                console.log($('#eventUpdateButton'));
        if (event.url) {
            window.open(event.url);
            return false;
        }
        },
        header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month, agendaWeek'
    },
    defaultView: 'agendaWeek',
         events: vm.eventsArray
    });

    //Add event button
    vm.addEvent = function(eventDate, eventTitle, eventUrl, eventDetails, eventType){


        console.log(eventType);
        //Adds event to array
        vm.events.push({
            'title' : eventTitle, 
            'start' : eventDate, 
            'url' : eventUrl, 
            'details' : eventDetails, 
            'backgroundColor' : 'red',
            'borderColor' : 'red'
        });

        // console.log(vm.eventsArray);
        calendarFactory.getEvent().then(function(result){
            // should remove this as there is no need to create eventIds when the event collection itself already has a unique id for each document
            vm.eventId = result+1;

            console.log(result);
            console.log(vm.eventId);

            calendarFactory.postEvent(eventTitle, eventDate, eventDetails, vm.eventId, eventType, vm.userId).then(function(result){
                console.log(result);
            });
        });
        

        //Reloads calendar with new event added
        $('#calendar').fullCalendar( 'removeEventSource', vm.events );
        $('#calendar').fullCalendar( 'addEventSource', vm.events );

        //Resets the add event box
        vm.eventTitle = '';
        vm.eventUrl = '';

        $('#eventBox').hide();
    };

    //Cancel event add button
    vm.cancelEventAdd = function(){

        //Resets the add event box
        vm.eventTitle = '';
        vm.eventUrl = '';

        $('#eventBox').hide();
    };

}

 
})();