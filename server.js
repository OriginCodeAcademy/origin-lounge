// =============================================================================
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

// set the port
var port = process.env.PORT || 3000;

// connect to our mongoDB database instance hosted on heroku
var mongoose = require('mongoose');
mongoose.connect('mongodb://origin-dev:pass1@ds149297-a0.mlab.com:49297/heroku_nrxdgp9h/'); 

//messageRecipients
// ============================================================================
// TABLES
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

// =============================================================================
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

// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
router.get('/', function(req, res) {

    res.json({ message: 'hooray! welcome to our api!' });
});

// =============================================================================
// Routes that end in /category
// =============================================================================

router.route('/category')

// create a category (accessed at POST http://localhost:3000/api/category)
.post(function(req, res) {

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


})

// get all categories (accessed at GET http://localhost:3000/api/category)
.get(function(req, res) {
    Category.find(function(err, category) {
        if (err)
            res.send(err);

        res.json(category);
    });
});

// ===================================================================
// Routes that end in /category/:category_id
// ===================================================================

router.route('/category/:category_id')

// get a specific category (accessed at GET http://localhost:3000/api/category/{categoryId})
.get(function(req, res) {
    Category.findById(req.params.category_id, function(err, category) {
        if (err)
            res.send(err);
        res.json(category);
    });
})

// update a specific category (accessed at PUT http://localhost:3000/api/category/{categoryId})
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

// delete a specific category (accessed at DELETE http://localhost:3000/api/category/{categoryId})
.delete(function(req, res) {
    Category.remove({
        _id: req.params.category_id
    }, function(err, category) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
});


// =============================================================================
// Routes that end in /apicode
// ============================================================================
router.route('/apicode')

// create an apicode entry (accessed at POST http://localhost:3000/api/apicode)
.post(function(req, res) {

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

})

// get all the apicode entries (accessed at GET http://localhost:3000/api/apicode)
.get(function(req, res) {
    ApiCode.find(function(err, apicode) {
        if (err)
            res.send(err);


        res.json(apicode);
    });
});

// ============================================================================
// Routes that end in /apicode/:apicode_id
// ============================================================================
router.route('/apicode/:apicode_id')

// get a specific apicode entry (accessed at GET http://localhost:3000/api/apicode/{apicode_Id})
.get(function(req, res) {
    ApiCode.findById(req.params.apicode_id, function(err, apicode) {
        if (err)
            res.send(err);
        res.json(apicode);
    });
})

// update a specific apicode entry (accessed at PUT http://localhost:3000/api/apicode/{apicode_Id})
.put(function(req, res) {
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
})

// delete a specific apicode entry (accessed at DELETE http://localhost:3000/api/apicode/{apicode_Id})
.delete(function(req, res) {
    ApiCode.remove({
        _id: req.params.apicode_id
    }, function(err, apicode) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
});

// =============================================================================
// Routes that end in /content
// =============================================================================

router.route('/content')

// create a content item (accessed at POST http://localhost:3000/api/content)
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

// get all content items (accessed at GET http://localhost:3000/api/content)
.get(function(req, res) {
    Content.find(function(err, content) {
        if (err)
            res.send(err);

        res.json(content);
    });
});

// ==========================================================================
// Routes that end in /content/:content_id
// ==========================================================================

router.route('/content/:content_id')

// get a specific content item (accessed at GET http://localhost:3000/api/content/{content_Id})
.get(function(req, res) {
    Content.findById(req.params.content_id, function(err, content) {
        if (err)
            res.send(err);
        res.json(content);
    });
})

// update a specific content item (accessed at PUT http://localhost:3000/api/content/{content_Id})
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

// delete a specific content item (accessed at DELETE http://localhost:3000/api/content/{content_Id})
.delete(function(req, res) {
    Content.remove({
        _id: req.params.content_id
    }, function(err, content) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
});

// =============================================================================
// Routes that end in /rolecategory
// =============================================================================

router.route('/rolecategory')

// create a roleCategory entry (accessed at POST http://localhost:3000/api/roleCategory)
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

// get all the roleCategory entries (accessed at GET http://localhost:3000/api/roleCategory)
.get(function(req, res) {
    RoleCategory.find(function(err, roleCategory) {
        if (err)
            res.send(err);

        console.log("got into get All roleCategories route");

        res.json(roleCategory);
    });
});

// ===========================================================================
// Routes that end in /rolecategory/:rolecategory_id
// ===========================================================================
router.route('/rolecategory/:rolecategory_id')

// get a specific rolecategory entry (accessed at GET http://localhost:3000/api/roleCategory/{rolecategory_Id})
.get(function(req, res) {
    RoleCategory.findById(req.params.roleCategory_id, function(err, roleCategory) {
        if (err)
            res.send(err);
        res.json(roleCategory);
    });
})

// update a specific rolecategory (accessed at PUT http://localhost:3000/api/roleCategory/{rolecategory_Id})
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

// delete a specific role category (accessed at DELETE http://localhost:3000/api/roleCategory/{rolecategory_Id})
.delete(function(req, res) {
    RoleCategory.remove({
        _id: req.params.roleCategory_id
    }, function(err, roleCategory) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
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

// =============================================================================
// Routes that end in /contentcategory
// =============================================================================

router.route('/contentcategory')

// create mulitple contentcategory entries based on the list of categoryIds received (accessed at POST http://localhost:3000/api/contentcategory)
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

// get all the contentcategory entries (accessed at GET http://localhost:3000/api/contentcategory)
.get(function(req, res) {
    ContentCategory.find(function(err, contentCategory) {
        if (err)
            res.send(err);

        res.json(contentCategory);
    });
});

// =============================================================================
// Routes that end in /contentcategory/:contentcategory_id
// =============================================================================

router.route('/contentcategory/:contentcategory_id')

// get a specific contentcategory entry (accessed at GET http://localhost:3000/api/contentcategory/{contentcategory_Id})
.get(function(req, res) {
    ContentCategory.findById(req.params.contentCategory_id, function(err, contentCategory) {
        if (err)
            res.send(err);
        res.json(contentCategory);
    });
})

// update a specific contentcategory entry (accessed at PUT http://localhost:3000/api/contentcategory/{contentcategory_Id})
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

// delete a specific contentcategory entry (accessed at DELETE http://localhost:3000/api/contentcategory/{contentcategory_Id})
.delete(function(req, res) {
    ContentCategory.remove({
        _id: req.params.contentCategory_id
    }, function(err, contentCategory) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
});

// =============================================================================
// Routes that end in /chats
// =============================================================================
router.route('/chats')

// get all chats table entries (accessed at GET http://localhost:3000/api/chats)
.get(function(req, res) {
    Chats.find(function(err, category) {
        if (err)
            res.send(err);

        res.json(category);
    });
})

// post a new chat entry (accessed at POST http://localhost:3000/api/chats)
.post(function(req, res) {
    var chats = new Chats();
    chats.userid = req.body.userid;
    chats.usernames = req.body.usernames;
    chats.channelname = req.body.channelname;
    chats.groupType = req.body.groupType;

    chats.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Chat entry created!'});
    });
});

// =============================================================================
// Routes that end in /chats/:chatid
// =============================================================================
router.route('/chats/:chatid')
// get a specific messagerecipient entry (accessed at GET http://localhost:3000/api/chats/{chatid})
.get(function(req, res) {
    Chats.findById(req.params.chatid, function(err, chat) {
        if (err)
            res.send(err);
        res.json(chat);
    });
});

// =============================================================================
// Routes that end in /chats/userid/:userid
// =============================================================================
router.route('/chats/userid/:userid')

// get all chat entries for a specific userId (accessed at GET http://localhost:3000/api/chats/userid/{userId})
.get(function(req, res) {
    Chats.find({"userid": req.params.userid }, {"usernames":1, "_id":1, "channelname":1, "groupType":1},function(err, chats) {
        if (err)
            res.send(err);

        res.json(chats);
    });
});

// =============================================================================
// Routes that end in /messages/:chatid
// =============================================================================
router.route('/messages/:chatid')

// get all messages associated with a specific chatid (accessed at GET http://localhost:3000/api/messages/{chatid})
.get(function(req, res) {
    Messages.find({"chatid": req.params.chatid}, function(err, messages) {
        if(err) res.send(err);

        res.json(messages);
    });
});
// =============================================================================
// Routes that end in /messages
// =============================================================================
router.route('/messages')

// get all messages table entries (accessed at GET http://localhost:3000/api/messages)
.get(function(req, res) {
    Messages.find(function(err, category) {
        if (err)
            res.send(err);

        res.json(category);
    });
})

// post a new messages entry (accessed at POST http://localhost:3000/api/messages)
.post(function(req, res) {
    var messages = new Messages();
    messages.chatid = req.body.chatid;
    messages.message = req.body.message;
    messages.sender = req.body.sender;
    messages.created = req.body.created;

    messages.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Message entry created!'});
    });
});

// =============================================================================
// Routes that end in /usergroup
// =============================================================================
router.route('/usergroup')

// create a Calendar usergroup (accessed at POST http://localhost:3000/api/usergroup)
.post(function(req, res) {

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

        res.json({ message: 'Code created!'});
    });

})

// get all Calendar usergroups (accessed at GET http://localhost:3000/api/usergroup)
.get(function(req, res) {
    CalendarUserGroup.find(function(err, usergroup) {
        if (err)
            res.send(err);


        res.json(usergroup);
    });
});

// ==================================================================
// Routes that end in /usergroup/:usergroup_id
// ==================================================================
router.route('/usergroup/:usergroup_id')

// get a specific Calendar usergroup entry (accessed at GET http://localhost:3000/api/usergroup/{usergroup_Id})
.get(function(req, res) {
    CalendarUserGroup.findById(req.params.usergroup_id, function(err, usergroup) {
        if (err)
            res.send(err);
        res.json(usergroup);
    });
})

// update a specific Calendar usergroup entry (accessed at PUT http://localhost:3000/api/usergroup/{usergroup_Id})
.put(function(req, res) {
    CalendarUserGroup.findById(req.params.usergroup_id, function(err, usergroup) {

        if (err)
            res.send(err);

        usergroup.userId = req.body.userId;
        usergroup.groupId = req.body.groupId;

        usergroup.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Code updated!' });
        });

    });
})

// delete a specific Calendar usergroup entry (accessed at DELETE http://localhost:3000/api/usergroup/{usergroup_Id})
.delete(function(req, res) {
   CalendarUserGroup.remove({
        _id: req.params.usergroup_id
    }, function(err, usergroup) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
});

// =============================================================================
// Routes that end in /group
// =============================================================================
router.route('/group')

// create a Calendar group (accessed at POST http://localhost:3000/api/group)
.post(function(req, res) {

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

        res.json({ message: 'Code created!'});
    });

})

// get all Calendar groups (accessed at GET http://localhost:3000/api/group)
.get(function(req, res) {
    CalendarGroup.find(function(err, group) {
        if (err)
            res.send(err);


        res.json(group);
    });
});

// ======================================================================
// Routes that end in /group/:group_id
// ======================================================================
router.route('/group/:group_id')

// get a specific Calendar group (accessed at GET http://localhost:3000/api/group/{groupId})
.get(function(req, res) {
    CalendarGroup.findById(req.params.group_id, function(err, group) {
        if (err)
            res.send(err);
        res.json(group);
    });
})

// update a specific Calendar group (accessed at PUT http://localhost:3000/api/group/{groupId})
.put(function(req, res) {
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
})

// delete a specific Calendar group (accessed at DELETE http://localhost:3000/api/group/{groupId})
.delete(function(req, res) {
   CalendarGroup.remove({
        _id: req.params.group_id
    }, function(err, group) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
});


// =============================================================================
// Routes that end in /usergroupevent
// =============================================================================
router.route('/usergroupevent')

// create a Calendar usergroupevent (accessed at POST http://localhost:3000/api/usergroupevent)
.post(function(req, res) {

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

        res.json({ message: 'Code created!'});
    });

})

// get all the Calendar usergroupevents (accessed at GET http://localhost:3000/api/usergroupevent)
.get(function(req, res) {
    CalendarUserGroupEvent.find(function(err, usergroupevent) {
        if (err)
            res.send(err);


        res.json(usergroupevent);
    });
});

// ======================================================================
// Routes that end in /usergroupevent/:user_id
// ======================================================================

router.route('/usergroupevent/:userId')

// get all Calendar usergroupevents for a specific userId (accessed at GET http://localhost:3000/api/usergroupevent/{userId})
.get(function(req, res) {
    CalendarUserGroupEvent.find({"userId":req.params.userId}, {'eventId' : 1, '_id' : 0}, function(err, usergroupevent) {
        if (err)
            res.send(err);
        // CalendarEvent.find( {eventId: { $in: usergroupevent }}, function(err, event){

        // res.json(event);
        // console.log(event);
        // });

        res.json(usergroupevent);
       
    });
});

// ======================================================================
// Routes that end in /usergroupevent/:usergroupevent_id
// ======================================================================

router.route('/usergroupevent/:usergroupevent_id')

// update a specific Calendar usergroupevent (accessed at PUT http://localhost:3000/api/usergroupevent/{usergroupeventId})
.put(function(req, res) {
    CalendarUserGroupEvent.findById(req.params.usergroupevent_id, function(err, usergroupevent) {

        if (err)
            res.send(err);

        usergroupevent.groupId = req.body.groupId;
        usergroupevent.userId = req.body.userId;
        usergroupevent.eventId = req.body.eventId;

        usergroupevent.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Code updated!' });
        });

    });
})

// delete a specific Calendar usergroupevent (accessed at DELETE http://localhost:3000/api/usergroupevent/{usergroupeventId})
.delete(function(req, res) {
   CalendarUserGroupEvent.remove({
        _id: req.params.usergroupevent_id
    }, function(err, usergroupevent) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
});


// ==================================================================
// Routes that end in /event
// ==================================================================
router.route('/event')

// create a Calendar event (accessed at POST http://localhost:3000/api/event)
.post(function(req, res) {

    var event = new CalendarEvent();
    event.eventId = req.body.eventId;
    event.title = req.body.title;
    event.detail = req.body.detail;
    event.eventTypeId = req.body.eventTypeId;
    event.date = req.body.date;
    event.time = req.body.time;

    // set the event name (comes from the request)
    console.log("body:" + req.body);

    // set the event name (comes from the request)
    console.log("event:" + event.eventId);
    event.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Code created!'});
    });

})

// get all the Calendar events (accessed at GET http://localhost:3000/api/event)
.get(function(req, res) {
    CalendarEvent.find(function(err, event) {
        if (err)
            res.send(err);


        res.json(event);
    });
});

// ===============================================================
// Routes that end in /event/:event_id
// ===============================================================

router.route('/event/:eventId')

// get a specific Calendar event by event ID (accessed at GET http://localhost:3000/api/event/{eventId})
.get(function(req, res) {
    CalendarEvent.find({"eventId":req.params.eventId}, function(err, usergroupevent) {
        if (err)
            res.send(err);
        res.json(usergroupevent);
    });
})

// update a specific Calendar event by event ID (accessed at PUT http://localhost:3000/api/event/{eventId})
.put(function(req, res) {
    CalendarEvent.findById(req.params.event_id, function(err, event) {

        if (err)
            res.send(err);

        event.eventId = req.body.eventId;
        event.title = req.body.title;
        event.detail = req.body.detail;
        event.eventTypeId = req.body.eventTypeId;
        event.date = req.body.date;
        event.time = req.body.time;

        event.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Code updated!' });
        });

    });
})

// delete a specific Calendar event by event Id (accessed at DELETE http://localhost:3000/api/event/{eventId})
.delete(function(req, res) {
   CalendarEvent.remove({
        _id: req.params.event_id
    }, function(err, event) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
});

// =============================================================================
// Routes that end in /eventtype
// =============================================================================
router.route('/eventtype')

// create a Calendar eventtype entry (accessed at POST http://localhost:3000/api/eventype)
.post(function(req, res) {

    var eventtype = new CalendarEventType();
    eventtype.eventTypeId = req.body.eventTypeId;
    eventtype.eventType = req.body.eventType;


    // set the eventtype name (comes from the request)
    console.log("body:" + req.body);

    // set the eventtype name (comes from the request)
    console.log("eventtype:" + eventtype.eventTypeId);
    eventtype.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Code created!'});
    });

})

// get all Calendar eventtype entries (accessed at GET http://localhost:3000/api/eventype)
.get(function(req, res) {
    CalendarEventType.find(function(err, eventtype) {
        if (err)
            res.send(err);


        res.json(eventtype);
    });
});

// =======================================================================
// Routes that end in /eventtype/:eventtype_id
// =======================================================================
router.route('/eventtype/:eventtype_id')

// get a specific Calendar Event Type by eventtype Id (accessed at GET http://localhost:3000/api/eventype/{eventypeId})
.get(function(req, res) {
    CalendarEventType.findById(req.params.eventtype_id, function(err, eventtype) {
        if (err)
            res.send(err);
        res.json(eventtype);
    });
})

// update a specific Calendar eventtype by eventtype Id (accessed at PUT http://localhost:3000/api/eventype/{eventypeId})
.put(function(req, res) {
    CalendarEventType.findById(req.params.eventtype_id, function(err, eventtype) {

        if (err)
            res.send(err);

        eventtype.eventTypeId = req.body.eventTypeId;
        eventtype.eventType = req.body.eventType;


        eventtype.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Code updated!' });
        });

    });
})

// delete a specific Calendar eventtype by eventtype Id (accessed at DELETE http://localhost:3000/api/eventype/{eventypeId})
.delete(function(req, res) {
   CalendarEventType.remove({
        _id: req.params.eventtype_id
    }, function(err, eventtype) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
});

// =============================================================================
// REGISTER OUR ROUTES
// =============================================================================
app.use('/api', router);

// =============================================================================
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
