var mongoose = require('mongoose');
var CalendarGroup = mongoose.model('group');


// get all Calendar groups (accessed at GET http://localhost:3000/api/group)
module.exports.getAllCalendarGroups = function (req, res) {

    CalendarGroup.find(function(err, group) {
        if (err)
            res.send(err);


        res.json(group);
    });
};

// create a Calendar group (accessed at POST http://localhost:3000/api/group)
module.exports.createCalendarGroup = function (req, res) {

    var group = new CalendarGroup();
    group.groupId = req.body.groupId;
    group.groupName = req.body.groupName;

    // set the group name (comes from the request)
    console.log("body:" + req.body);

    // set the group name (comes from the request)
    console.log("group:" + group.groupId);
    group.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Calendar group created!'});
    });
};


// get a specific Calendar group (accessed at GET http://localhost:3000/api/group/{groupId})
module.exports.getSpecificCalendarGroup = function (req, res) {

    CalendarGroup.findById(req.params.group_id, function(err, group) {
        if (err)
            res.send(err);
        res.json(group);
    });
};

// update a specific Calendar group (accessed at PUT http://localhost:3000/api/group/{groupId})
module.exports.updateCalendarGroup = function (req, res) {

    CalendarGroup.findById(req.params.group_id, function(err, group) {

        if (err)
            res.send(err);

        group.groupId = req.body.groupId;
        group.groupName = req.body.groupName;

        group.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Code updated!' });
        });

    });
};

// delete a specific Calendar group (accessed at DELETE http://localhost:3000/api/group/{groupId})
module.exports.deleteCalendarGroup = function (req, res) {

   CalendarGroup.remove({
        _id: req.params.group_id
    }, function(err, group) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
};