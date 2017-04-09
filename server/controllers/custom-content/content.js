var mongoose = require('mongoose');
var Content = mongoose.model('content');


// get all content items (accessed at GET http://localhost:3000/api/content)
module.exports.getAllContent = function (req, res) {
    Content.find(function(err, content) {
        if (err)
            res.send(err);

        res.json(content);
    });
};

// create a content item (accessed at POST http://localhost:3000/api/content)
module.exports.addContent = function (req, res) {

    var content = new Content();
    content.categoryId = req.body.categoryId;
    content.title = req.body.title;
    content.bodyDescr = req.body.bodyDescr;
    content.createdBy = req.body.createdBy;

    // set the content name (comes from the request)
    console.log("body:" + req.body);

    // set the content name (comes from the request)
    content.save(function(err, data) {
        if (err)
            res.send(err);

        res.json({ message: 'Content created!', contentId: data._id});
    });
};

// get a specific content item (accessed at GET http://localhost:3000/api/content/{content_Id})
module.exports.getSpecificContentEntry = function (req, res) {

    Content.findById(req.params.content_id, function(err, content) {
        if (err)
            res.send(err);
        res.json(content);
    });
};


// update a specific content item (accessed at PUT http://localhost:3000/api/content/{content_Id})
module.exports.updateContent = function (req, res) {

    Content.findById(req.params.content_id, function(err, content) {

        if (err)
            res.send(err);

        content.categoryId = req.body.categoryId;
        content.title = req.body.title;
        content.bodyDescr = req.body.bodyDescr;
        content.createdBy = req.body.createdBy;
        content.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Content updated!' });
        });

    });
};

// delete a specific content item (accessed at DELETE http://localhost:3000/api/content/{content_Id})
module.exports.deleteContent = function (req, res) {

    Content.remove({
        _id: req.params.content_id
    }, function(err, content) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
};
