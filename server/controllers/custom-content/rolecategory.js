var mongoose = require('mongoose');
var RoleCategory = mongoose.model('roleCategory');


// get all the roleCategory entries (accessed at GET http://localhost:3000/api/roleCategory)
module.exports.getAllRoleCategoryEntries = function (req, res) {

    RoleCategory.find(function(err, roleCategory) {
        if (err)
            res.send(err);

        console.log("got into get All roleCategories route");

        res.json(roleCategory);
    });
};

// create a roleCategory entry (accessed at POST http://localhost:3000/api/roleCategory)
module.exports.createARoleCategoryEntry = function (req, res) {

    var roleCategory = new RoleCategory();
    roleCategory.categoryId = req.body.categoryId;
    roleCategory.roleId = req.body.roleId;

    // set the roleCategory name (comes from the request)
    roleCategory.save(function(err) {
        if (err)
            res.send(err);

		console.log("got into create a roleCategories route");
        
        res.json({ message: 'Role Category created!' });
    });
};


// get a specific rolecategory entry (accessed at GET http://localhost:3000/api/roleCategory/{rolecategory_Id})
module.exports.getSpecificRoleCategoryEntry = function (req, res) {

    RoleCategory.findById(req.params.rolecategory_id, function(err, roleCategory) {
        if (err)
            res.send(err);
        res.json(roleCategory);
    });
};

// update a specific rolecategory (accessed at PUT http://localhost:3000/api/roleCategory/{rolecategory_Id})
module.exports.updateRoleCategoryEntry = function (req, res) {

	RoleCategory.findById(req.params.rolecategory_id, function(err, roleCategory) {

        if (err)
            res.send(err);

        roleCategory.categoryId = req.body.categoryId;
        roleCategory.roleId = req.body.roleId;
        
        roleCategory.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'RoleCategory updated!' });
        });

    });
};

// delete a specific role category (accessed at DELETE http://localhost:3000/api/roleCategory/{rolecategory_Id})
module.exports.deleteRoleCategoryEntry = function (req, res) {

	RoleCategory.remove({
        _id: req.params.rolecategory_id
    }, function(err, roleCategory) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
};

