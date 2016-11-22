// BASE SETUP
// =============================================================================

// call the packages we need

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();

// configure app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});

var port = process.env.PORT || 3000; // set our port

var mongoose = require('mongoose');
mongoose.connect('mongodb://origin-dev:pass1@ds149297-a0.mlab.com:49297/heroku_nrxdgp9h/'); // connect to our database
var Category = require('./app/models/custom-content/category');
var Content = require('./app/models/custom-content/content');
var RoleCategory = require('./app/models/custom-content/rolecategory');
var ContentCategory = require('./app/models/custom-content/contentcategory')

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {

    res.json({ message: 'hooray! welcome to our api!' });
});

//=============================================================================
// on routes that end in /category
// ----------------------------------------------------
router.route('/category')

// create a category (accessed at POST http://localhost:8080/category)
.post(function(req, res) {

    var category = new Category();
    category.name = req.body.name

    // set the category name (comes from the request)
    console.log("body:" + req.body);

    // set the category name (comes from the request)
    console.log("category:" + category.name);
    category.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Category created!' });
    });


})

// get all the category (accessed at GET http://localhost:8080/api/category)
.get(function(req, res) {
    Category.find(function(err, category) {
        if (err)
            res.send(err);

        res.json(category);
    });
});

// on routes that end in /category/:category_id
// ----------------------------------------------------
router.route('/category/:category_id')

// get the category with that id
.get(function(req, res) {
    Category.findById(req.params.category_id, function(err, category) {
        if (err)
            res.send(err);
        res.json(category);
    });
})

// update the category with this id
.put(function(req, res) {
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
})

// delete the category with this id
.delete(function(req, res) {
    Category.remove({
        _id: req.params.category_id
    }, function(err, category) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
});

//=============================================================================
// on routes that end in /content
// ----------------------------------------------------

router.route('/content')

// create a content (accessed at POST http://localhost:8080/content)
.post(function(req, res) {

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

})

// get all the content (accessed at GET http://localhost:8080/api/content)
.get(function(req, res) {
    Content.find(function(err, content) {
        if (err)
            res.send(err);

        res.json(content);
    });
});

// on routes that end in /content/:content_id
// ----------------------------------------------------
router.route('/content/:content_id')

// get the content with that id
.get(function(req, res) {
    Content.findById(req.params.content_id, function(err, content) {
        if (err)
            res.send(err);
        res.json(content);
    });
})

// update the content with this id
.put(function(req, res) {
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
})

// delete the content with this id
.delete(function(req, res) {
    Content.remove({
        _id: req.params.content_id
    }, function(err, content) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
});

//=============================================================================
// on routes that end in /rolecategory
// ----------------------------------------------------

router.route('/rolecategory')

// create a roleCategory (accessed at POST http://localhost:8080/roleCategory)
.post(function(req, res) {

    var roleCategory = new RoleCategory();
    roleCategory.categoryId = req.body.categoryId;
    roleCategory.roleId = req.body.roleId;

   

    // set the roleCategory name (comes from the request)
    roleCategory.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Role Category created!' });
    });


})

// get all the roleCategory (accessed at GET http://localhost:8080/api/roleCategory)
.get(function(req, res) {
    RoleCategory.find(function(err, roleCategory) {
        if (err)
            res.send(err);

        console.log("got into get All roleCategories route");
        res.json(roleCategory);
    });
});

// on routes that end in /rolecategory/:rolecategory_id
// ----------------------------------------------------
router.route('/rolecategory/:rolecategory_id')

// get the category with that id
.get(function(req, res) {
    RoleCategory.findById(req.params.roleCategory_id, function(err, roleCategory) {
        if (err)
            res.send(err);
        res.json(roleCategory);
    });
})

// update the rolecategory with this id
.put(function(req, res) {
    RoleCategory.findById(req.params.roleCategory_id, function(err, roleCategory) {

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
})

// delete the role category with this id
.delete(function(req, res) {
    RoleCategory.remove({
        _id: req.params.roleCategory_id
    }, function(err, roleCategory) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
});



//=============================================================================
// on routes that end in /categorynamesbyroleid
// ----------------------------------------------------

router.route('/categorynamesbyroleid/:role_Ids')

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

//=============================================================================
// on routes that end in /contentbycategoryid
// ----------------------------------------------------

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

router.route('/contentcategory')

// create contentcategory entries (accessed at POST http://localhost:8080/contentcategory)
.post(function(req, res) {

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

})

// get all the content category (accessed at GET http://localhost:8080/api/contentcategory)
.get(function(req, res) {
    ContentCategory.find(function(err, contentCategory) {
        if (err)
            res.send(err);

        res.json(contentCategory);
    });
});

// on routes that end in /contentcategory/:contentcategory_id
// ----------------------------------------------------
router.route('/contentcategory/:contentcategory_id')

// get the content category with that id
.get(function(req, res) {
    ContentCategory.findById(req.params.contentCategory_id, function(err, contentCategory) {
        if (err)
            res.send(err);
        res.json(contentCategory);
    });
})



// update the contentcategory with this id
.put(function(req, res) {
    ContentCategory.findById(req.params.contentCategory_id, function(err, contentCategory) {

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
})

// delete the content category with this id
.delete(function(req, res) {
    ContentCategory.remove({
        _id: req.params.contentCategory_id
    }, function(err, contentCategory) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
});



// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
