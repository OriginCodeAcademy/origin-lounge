var mongoose = require('mongoose');
var CalendarEventType = mongoose.model('eventtype');

// get all Calendar eventtype entries (accessed at GET http://localhost:3000/api/eventype)
module.exports.getAllCalendarEventTypes = function(req, res){

    CalendarEventType.find(function(err, eventtype) {
        if (err)
            res.send(err);


        res.json(eventtype);
    });
};

// create a Calendar eventtype entry (accessed at POST http://localhost:3000/api/eventype)
module.exports.createCalendarEventType = function(req, res){

    var eventtype = new CalendarEventType();
    eventtype.eventTypeId = req.body.eventTypeId;
    eventtype.eventType = req.body.eventType;


    // set the eventtype name (comes from the request)
    console.log("body:" + req.body);

    // set the eventtype name (comes from the request)
    console.log("eventtype:" + eventtype.eventTypeId);
    eventtype.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Calendar Event Type created!'});
    });
};

// get a specific Calendar Event Type by eventtype Id (accessed at GET http://localhost:3000/api/eventype/{eventypeId})
module.exports.getSpecificCalendarEventType = function(req, res){

    CalendarEventType.findById(req.params.eventtype_id, function(err, eventtype) {
        if (err)
            res.send(err);
        res.json(eventtype);
    });
};

// update a specific Calendar eventtype by eventtype Id (accessed at PUT http://localhost:3000/api/eventype/{eventypeId})
module.exports.updateCalendarEventType = function(req, res){

    CalendarEventType.findById(req.params.eventtype_id, function(err, eventtype) {

        if (err)
            res.send(err);

        eventtype.eventTypeId = req.body.eventTypeId;
        eventtype.eventType = req.body.eventType;


        eventtype.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Calendar Event Type updated!' });
        });

    });
};

// delete a specific Calendar eventtype by eventtype Id (accessed at DELETE http://localhost:3000/api/eventype/{eventypeId})
module.exports.deleteCalendarEventType = function(req, res){

   CalendarEventType.remove({
        _id: req.params.eventtype_id
    }, function(err, eventtype) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
};
