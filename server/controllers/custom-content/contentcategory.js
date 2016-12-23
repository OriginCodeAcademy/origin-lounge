var mongoose = require('mongoose');
var ContentCategory = mongoose.model('contentCategory');

// get all the contentcategory entries (accessed at GET http://localhost:3000/api/contentcategory)
module.exports.getAllContentCategoryEntries = function (req, res) {

    ContentCategory.find(function(err, contentCategory) {
        if (err)
            res.send(err);

        res.json(contentCategory);
    });
};

// create mulitple contentcategory entries based on the list of categoryIds received (accessed at POST http://localhost:3000/api/contentcategory)
module.exports.createAContentCategoryEntry = function (req, res) {

    // convert the comma separated body string to an array of comma separate strings
    var array = req.body.categoryId.split(',');
    
    // add a contentcategory entry for each categoryId received
    for (var i = 0; i < array.length; i++){
        
        // create a new ContentCategory entry
        var contentCategory = new ContentCategory();

        //store the contentId received into the new ContentCategory entry we created
        contentCategory.contentId = req.body.contentId;
        
        // store the categoryId received into the new ContentCategory entry we created
        contentCategory.categoryId = array[i];

        contentCategory.save(function(err) {
            if (err)
                res.send(err);
        });
    }   
        res.json({ message: 'Content Category created!'});
};

// get a specific contentcategory entry (accessed at GET http://localhost:3000/api/contentcategory/{contentcategory_Id})
module.exports.getSpecificContentCategoryEntry = function (req, res) {

    ContentCategory.findById(req.params.contentcategory_id, function(err, contentCategory) {
        if (err)
            res.send(err);
        res.json(contentCategory);
    });
};

// update a specific contentcategory entry (accessed at PUT http://localhost:3000/api/contentcategory/{contentcategory_Id})
module.exports.updateContentCategoryEntry = function (req, res) {

    ContentCategory.findById(req.params.contentcategory_id, function(err, contentCategory) {

        if (err)
            res.send(err);

        contentCategory.categoryId = req.body.categoryId;
        contentCategory.contentId = req.body.contentId;
        
        contentCategory.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Content Category updated!' });
        });

    });
};

// delete a specific contentcategory entry (accessed at DELETE http://localhost:3000/api/contentcategory/{contentcategory_Id})
module.exports.deleteContentCategoryEntry = function (req, res) {

    ContentCategory.remove({
        _id: req.params.contentcategory_id
    }, function(err, contentCategory) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
};