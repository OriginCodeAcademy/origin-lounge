
var mongoose = require('mongoose');
var CalendarEvent = mongoose.model('event');

// get all the Calendar events (accessed at GET http://localhost:3000/api/event)
module.exports.getAllCalendarEvents = function (req, res) {

    CalendarEvent.find(function(err, event) {
        if (err)
            res.send(err);


        res.json(event);
    });
};

// create a Calendar event (accessed at POST http://localhost:3000/api/event)
module.exports.createCalendarEvent = function (req, res){


    var event = new CalendarEvent();
    event.eventId = req.body.eventId;
    event.title = req.body.title;
    event.detail = req.body.detail;
    event.eventTypeId = req.body.eventTypeId;
    event.date = req.body.date;
    event.time = req.body.time;

    // set the event name (comes from the request)
    console.log("body:" + req.body);

    // set the event name (comes from the request)
    console.log("event:" + event.eventId);
    event.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Calendar event created!'});
    });

};

// get a specific Calendar event by event ID (accessed at GET http://localhost:3000/api/event/{eventId})
module.exports.getSpecificCalendarEvent = function(req, res) {

    CalendarEvent.findById(req.params.eventId, function(err, usergroupevent) {
        if (err)
            res.send(err);
        res.json(usergroupevent);
    });
};

// update a specific Calendar event by event ID (accessed at PUT http://localhost:3000/api/event/{eventId})
module.exports.updateCalendarEvent = function(req, res){

    CalendarEvent.findById(req.params.eventId, function(err, event) {

        if (err)
            res.send(err);

        event.eventId = req.body.eventId;
        event.title = req.body.title;
        event.detail = req.body.detail;
        event.eventTypeId = req.body.eventTypeId;
        event.date = req.body.date;
        event.time = req.body.time;

        event.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Calendar event updated!' });
        });

    });
};

// delete a specific Calendar event by event Id (accessed at DELETE http://localhost:3000/api/event/{eventId})
module.exports.deleteCalendarEvent = function(req, res){

   CalendarEvent.remove({
        _id: req.params.eventId
    }, function(err, event) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
};
