var mongoose = require('mongoose');
var Category = mongoose.model('category');


// get all categories (accessed at GET http://localhost:3000/api/category)
module.exports.getAllCategories = function (req, res) {

    Category.find(function(err, category) {
        if (err)
            res.send(err);

        res.json(category);
    });	
};

// get a specific category (accessed at GET http://localhost:3000/api/category/{categoryId})
module.exports.readOneCategory = function (req, res) {

	Category.findById(req.params.category_id, function(err, category) {
        if (err)
            res.send(err);
        
        res.json(category);
	});
};

// create a category (accessed at POST http://localhost:3000/api/category)
module.exports.addCategory = function (req, res) {

    var category = new Category();
    category.name = req.body.name;

    // set the category name (comes from the request)
    console.log("body:" + req.body);

    // set the category name (comes from the request)
    console.log("category:" + category.name);
    category.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Category created!' });
    });

};

// delete a specific category (accessed at DELETE http://localhost:3000/api/category/{categoryId})
module.exports.deleteCategory = function (req, res) {

    Category.remove({
        _id: req.params.category_id
    }, function(err, category) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
};

// update a specific category (accessed at PUT http://localhost:3000/api/category/{categoryId})
module.exports.updateCategory = function (req, res) {

    Category.findById(req.params.category_id, function(err, category) {

        if (err)
            res.send(err);

        category.name = req.body.name;
        category.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Category updated!' });
        });

    });
};




    

