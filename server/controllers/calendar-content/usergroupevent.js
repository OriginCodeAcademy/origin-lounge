var mongoose = require('mongoose');
var CalendarUserGroupEvent = mongoose.model('usergroupevent');

// get all the Calendar usergroupevents (accessed at GET http://localhost:3000/api/usergroupevent)
module.exports.getAllCalendarUserGroupEvents = function(req, res){

    CalendarUserGroupEvent.find(function(err, usergroupevent) {
        if (err)
            res.send(err);


        res.json(usergroupevent);
    });
};

// create a Calendar usergroupevent (accessed at POST http://localhost:3000/api/usergroupevent)
module.exports.createCalendarUserGroupEvent = function(req, res){

    var usergroupevent = new CalendarUserGroupEvent();
    usergroupevent.groupId = req.body.groupId;
    usergroupevent.userId = req.body.userId;
    usergroupevent.eventId = req.body.eventId;

    // set the usergroupevent name (comes from the request)
    console.log("body:" + req.body);

    // set the usergroupevent name (comes from the request)
    console.log("usergroupevent:" + usergroupevent.groupId);
    usergroupevent.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Calendar Usergroup event created!'});
    });
};

// get all Calendar usergroupevents for a specific userId (accessed at GET http://localhost:3000/api/usergroupevent/{userId})
module.exports.getCalendarUserGroupEventsForSpecificUser = function(req, res){

    CalendarUserGroupEvent.find({"userId":req.params.userId}, {'eventId' : 1, '_id' : 0}, function(err, usergroupevent) {
        if (err)
            res.send(err);
        // CalendarEvent.find( {eventId: { $in: usergroupevent }}, function(err, event){

        // res.json(event);
        // console.log(event);
        // });

        res.json(usergroupevent);
       
    });
};

// update a specific Calendar usergroupevent (accessed at PUT http://localhost:3000/api/usergroupevent/{usergroupeventId})
module.exports.updateCalendarUserGroupEvent = function(req, res){

    CalendarUserGroupEvent.findById(req.params.usergroupevent_id, function(err, usergroupevent) {

        if (err)
            res.send(err);

        usergroupevent.groupId = req.body.groupId;
        usergroupevent.userId = req.body.userId;
        usergroupevent.eventId = req.body.eventId;

        usergroupevent.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Calendar Usergroup event updated!' });
        });

    });
};

// delete a specific Calendar usergroupevent (accessed at DELETE http://localhost:3000/api/usergroupevent/{usergroupeventId})
module.exports.deleteCalendarUserGroupEvent = function(req, res){

   CalendarUserGroupEvent.remove({
        _id: req.params.usergroupevent_id
    }, function(err, usergroupevent) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
};