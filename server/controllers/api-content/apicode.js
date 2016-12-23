var mongoose = require('mongoose');
var ApiCode = mongoose.model('apicode');


// get all the apicode entries (accessed at GET http://localhost:3000/api/apicode)
module.exports.getAllApiCodes = function (req, res) {

	ApiCode.find(function(err, apicode) {
	        if (err)
	            res.send(err);


	        res.json(apicode);
	    });
};

// create an apicode entry (accessed at POST http://localhost:3000/api/apicode)
module.exports.addApiCode = function (req, res) {

    var apicode = new ApiCode();
    apicode.name = req.body.name;
    apicode.userId = req.body.userId;
    apicode.linkedInKey = req.body.linkedInKey;
    apicode.githubKey = req.body.githubKey;
    apicode.linkedInUrl = req.body.linkedInUrl;

    // set the category name (comes from the request)
    console.log("body:" + req.body);

    // set the category name (comes from the request)
    console.log("apiCode:" + apicode.name);
    apicode.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Code created!'});
    });
};

// get a specific apicode entry (accessed at GET http://localhost:3000/api/apicode/{apicode_Id})
module.exports.getOneApiCodeEntry = function (req, res) {

    ApiCode.findById(req.params.apicode_id, function(err, apicode) {
        if (err)
            res.send(err);
        res.json(apicode);
    });
};

// update a specific apicode entry (accessed at PUT http://localhost:3000/api/apicode/{apicode_Id})
module.exports.updateApiCodeEntry = function (req, res) {

    ApiCode.findById(req.params.apicode_id, function(err, apicode) {

        if (err)
            res.send(err);

        apicode.name = req.body.name;
        apicode.userId = req.body.userId;
        apicode.linkedInKey = req.body.linkedInKey;
        apicode.githubKey = req.body.githubKey;
        apicode.linkedInUrl = req.body.linkedInUrl;

        apicode.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Code updated!' });
        });

    });
};

// delete a specific apicode entry (accessed at DELETE http://localhost:3000/api/apicode/{apicode_Id})
module.exports.deleteApiCodeEntry = function (req, res) {

    ApiCode.remove({
        _id: req.params.apicode_id
    }, function(err, apicode) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
};

