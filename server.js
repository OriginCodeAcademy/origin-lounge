// Set up required packages

var express = require('express');
var bodyParser = require('body-parser');
// Body Parser to be used when dealing with file uploads to this server
var busboyBodyParser = require('busboy-body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var fs = require('fs');

// ============================================================================
// Collections
// ============================================================================ 
var Category = require('./server/models/custom-content/category');
var Content = require('./server/models/custom-content/content');
var RoleCategory = require('./server/models/custom-content/rolecategory');
var ContentCategory = require('./server/models/custom-content/contentcategory');
var ApiCode = require('./server/models/api-content/apicode');
var CalendarUserGroup = require('./server/models/calendar-content/usergroup');
var Messages = require('./server/models/chat/message');
var Chats = require('./server/models/chat/chats');
var CalendarGroup = require('./server/models/calendar-content/group');
var CalendarUserGroupEvent = require('./server/models/calendar-content/usergroupevent');
var CalendarEvent = require('./server/models/calendar-content/event');
var CalendarEventType = require('./server/models/calendar-content/eventtype');


var router = require('./server/routes/routes');

var conn = mongoose.connection;
var app = express();

// Set the port
var port = process.env.PORT || 3000;

// CORS configuration
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});

// Body parsing configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(busboyBodyParser ({limit: '200mb'}));

app.use('/api', router);

Grid.mongo = mongoose.mongo;

// Connect to our mongoDB database instance hosted on heroku
mongoose.connect('mongodb://origin-dev:pass1@ds149297-a1.mlab.com:49297/heroku_nrxdgp9h/'); 

// Adds the fs.chunks and fs.files collections to the mongo DB
conn.once('open', function () {
    console.log('open');
    var gfs = Grid(conn.db);

});


// =============================================================================
// Routes that end in /categorynamesbyroleid/:role_Ids
// =============================================================================

router.route('/categorynamesbyroleid/:role_Ids')

// get all category names for all the roleIds provided in the request (accessed at GET http://localhost:3000/api/categorynamesbyroleid/[role_Ids])
.get (function(req,res,next){
    
    // convert the comma separated query string to an array of comma separate strings
    var array = req.params.role_Ids.split(',');
    console.log("successfully split array");
    console.log(array);
    // convert the array of comma separated strings to an array of comma separated integers
    for(var i = 0; i < array.length; i++) { 
        array[i] = +array[i]; 
    }

    console.log(array);
    
    // find all rows within the RoleCategory table that have the roleIds specified within the GET categorynamesbyroleid command
    RoleCategory.find({roleId: {"$in":array}}, function(err, categoryIdsForARole){

        if (err) {
            // res.send(err);
            res.send("test");
            console.log("error");
        }

        console.log("In first find");

        // stores the categoryIdsForARole into a req variable. This req variable can be passed into the next .get function
        req.variable = categoryIdsForARole;
        next();
    });

})

.get (function(req,res) { 

        // capture the req variable provided by the .get function above and store it into a variable here
        var categoryIdsForARole = req.variable;

        // array to store the category names
        var categoryNames = [];

         
        for (var i = 0; i < categoryIdsForARole.length; i++) {
            
            //counter that will determine when we have iterated through the categoryIdsForARole array
            var j = categoryIdsForARole.length;
            
            // find the row within the category table that has a specific categoryId
            Category.findOne({_id: categoryIdsForARole[i].categoryId}, function (error, content){
                
                // push the value within the name column of the category table, into the categoryNames array
                categoryNames.push({

                   "categoryName" : content.name,
                   "categoryId" : content._id

                });

                // decrement the counter 
                j--;

                // once we have gone through the whole categoryIdsForARole array, send up the response
                if ( j === 0) {
                    res.json(categoryNames);
                }         
            });
        }
});

// =============================================================================
// Routes that end in /contentbycategoryid/:category_id
// =============================================================================

// get all content items associated with a specific category Id (accessed at GET http://localhost:3000/api/contentbycategoryid/{category_id})
router.route('/contentbycategoryid/:category_id')

.get (function(req,res,next){

    // find all rows within the ContentCategory table that have the categoryId specified within the GET contentbycategoryId command
    ContentCategory.find({categoryId: req.params.category_id}, function(err, contentIdsForACategory){

        if (err) {
            // res.send(err);
            res.send("test");
            console.log("error");
        }
        console.log("In first find within contentbycategoryid");

        // stores the contentIdsForACategory into a req variable. This req variable can be passed into the next .get function
        req.variable = contentIdsForACategory;
        console.log(contentIdsForACategory);
        next();
    });

})

.get (function(req,res) { 

        // capture the req variable provided by the .get function above and store it into a variable here
        var contentIdsForACategory = req.variable;
        console.log (contentIdsForACategory);
        console.log(contentIdsForACategory[0]._id);
        // array to store the category names
        var contentInfo = [];

        console.log("In second find within contentbycategoryid");
         
        for (var i = 0; i < contentIdsForACategory.length; i++) {
            console.log(i);

            //counter that will determine when we have iterated through the contentIdsForACategory array
            var j = contentIdsForACategory.length;
            
            //grab the contentCategoryId so we can provide it within the response
            var contentCategoryId = contentIdsForACategory[i]._id;

            // find the row within the Content table that has a specific categoryId
            Content.findOne({_id: contentIdsForACategory[i].contentId}, function (error, content){
                
                // push the value within the name column of the category table, into the contentInfo array
                contentInfo.push({

                   "bodyDescr" : content.bodyDescr,
                   "title" : content.title,
                   "contentId" : content._id,
                   "contentCategoryId" : contentCategoryId

                });

                // decrement the counter 
                j--;

                // once we have gone through the whole categoryIdsForARole array, send up the response
                if ( j === 0) {
                    res.json(contentInfo);
                }         
            });
        }
});

app.listen(port);
console.log('Magic happens on port ' + port);
