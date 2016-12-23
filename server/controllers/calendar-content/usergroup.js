var mongoose = require('mongoose');
var CalendarUserGroup = mongoose.model('usergroup');

// get all Calendar usergroups (accessed at GET http://localhost:3000/api/usergroup)
module.exports.getAllCalendarUserGroups = function (req, res) {

    CalendarUserGroup.find(function(err, usergroup) {
        if (err)
            res.send(err);


        res.json(usergroup);
    });
};

// create a Calendar usergroup (accessed at POST http://localhost:3000/api/usergroup)
module.exports.createCalendarUserGroup = function (req, res) {

    var usergroup = new CalendarUserGroup();
    usergroup.userId = req.body.userId;
    usergroup.groupId = req.body.groupId;

    // set the usergroup name (comes from the request)
    console.log("body:" + req.body);

    // set the usergroup name (comes from the request)
    console.log("usergroup:" + usergroup.groupId);
    usergroup.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Calendar Usergroup created!'});
    });
};

// get a specific Calendar usergroup entry (accessed at GET http://localhost:3000/api/usergroup/{usergroup_Id})
module.exports.getSpecificCalendarUserGroup = function(req, res) {

    CalendarUserGroup.findById(req.params.usergroup_id, function(err, usergroup) {
        if (err)
            res.send(err);
        res.json(usergroup);
    });
};

// update a specific Calendar usergroup entry (accessed at PUT http://localhost:3000/api/usergroup/{usergroup_Id})
module.exports.updateCalendarUserGroup = function(req, res) {

    CalendarUserGroup.findById(req.params.usergroup_id, function(err, usergroup) {

        if (err)
            res.send(err);

        usergroup.userId = req.body.userId;
        usergroup.groupId = req.body.groupId;

        usergroup.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Calendar Usergroup updated!' });
        });

    });
};

// delete a specific Calendar usergroup entry (accessed at DELETE http://localhost:3000/api/usergroup/{usergroup_Id})
module.exports.deleteCalendarUserGroup = function(req, res) {

   CalendarUserGroup.remove({
        _id: req.params.usergroup_id
    }, function(err, usergroup) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
};
