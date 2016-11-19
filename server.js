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
    next();
});

var port = process.env.PORT || 3000; // set our port
// ============================================================================
// ======== DATABASE TABLES 

var mongoose = require('mongoose');
mongoose.connect('mongodb://origin-dev:pass1@ds149297-a0.mlab.com:49297/heroku_nrxdgp9h/'); // connect to our database
var Category = require('./server/models/custom-content/category');
var Content = require('./server/models/custom-content/content');
var RoleCategory = require('./server/models/custom-content/rolecategory');
var ContentCategory = require('./server/models/custom-content/contentcategory');
var ApiCode = require('./server/models/api-content/apicode');
var CalendarUserGroup = require('./server/models/calendar-content/usergroup');
var Messages = require('./server/models/chat/message');
var MessagesRecipients = require('./server/models/chat/messagerecipients');
var CalendarGroup = require('./server/models/calendar-content/group');
var CalendarUserGroupEvent = require('./server/models/calendar-content/usergroupevent');
var CalendarEvent = require('./server/models/calendar-content/event');
var CalendarEventType = require('./server/models/calendar-content/eventtype');




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
// on routes that end in /apicode
// ----------------------------------------------------
router.route('/apicode')

// create a apicode (accessed at POST http://localhost:8080/apicode)
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

// get all the category (accessed at GET http://localhost:8080/api/apicode)
.get(function(req, res) {
    ApiCode.find(function(err, apicode) {
        if (err)
            res.send(err);


        res.json(apicode);
    });
});

// on routes that end in /category/:category_id
// ----------------------------------------------------
router.route('/apicode/:apicode_id')

// get the category with that id
.get(function(req, res) {
    ApiCode.findById(req.params.apicode_id, function(err, apicode) {
        if (err)
            res.send(err);
        res.json(apicode);
    });
})

// update the category with this id
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

// delete the category with this id
.delete(function(req, res) {
    ApiCode.remove({
        _id: req.params.apicode_id
    }, function(err, apicode) {
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
    content.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Content created!' });
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

// on routes that end in /category/:content_id
// ----------------------------------------------------
router.route('/content/:content_id')

// get the category with that id
.get(function(req, res) {
    Content.findById(req.params.content_id, function(err, content) {
        if (err)
            res.send(err);
        res.json(content);
    });
})

// update the category with this id
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

router.route('/categorynamesbyroleid/:role_id')

.get (function(req,res,next){

    // find all rows within the RoleCategory table that have the roleId specified within the GET categorynamesbyroleid command
    RoleCategory.find({roleId: req.params.role_id}, function(err, categoryIdsForARole){

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

        // array to store the category names
        var contentInfo = [];

        console.log("In second find within contentbycategoryid");
         
        for (var i = 0; i < contentIdsForACategory.length; i++) {
            console.log(i);
            //counter that will determine when we have iterated through the contentIdsForACategory array
            var j = contentIdsForACategory.length;
            
            // find the row within the Content table that has a specific categoryId
            Content.findOne({_id: contentIdsForACategory[i].contentId}, function (error, content){
                
                // push the value within the name column of the category table, into the contentInfo array
                contentInfo.push({

                   "bodyDescr" : content.bodyDescr,
                   "title" : content.title,
                   "contentId" : content._id

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

//=============================================================================
// on routes that end in /rolecategory
// ----------------------------------------------------

router.route('/contentcategory')

// create a contentcategory (accessed at POST http://localhost:8080/contentcategory)
.post(function(req, res) {

    var contentCategory = new ContentCategory();
    contentCategory.categoryId = req.body.categoryId;
    contentCategory.contentId = req.body.contentId;

   

    // set the content category name (comes from the request)
    contentCategory.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Content Category created!' });
    });


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

// delete the role category with this id
.delete(function(req, res) {
    ContentCategory.remove({
        _id: req.params.contentCategory_id
    }, function(err, contentCategory) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
});

//=============================================================================
// on routes that end in /messagerecipients
// ----------------------------------------------------
router.route('/messagerecipients')

// get all of the users messagerecipients by ID
.get(function(req, res) {
    MessagesRecipients.find(function(err, category) {
        if (err)
            res.send(err);

        res.json(category);
    });
});

router.route('/messagerecipients/:userid')

// get all of the users messagerecipients by ID
.get(function(req, res) {
    MessagesRecipients.find({"userid": req.params.userid }, {"usernames":1, _id:0, "chatid":1, "groupname":1},function(err, messagerecipients) {
        if (err)
            res.send(err);

        res.json(messagerecipients);
    });
})

.post(function(req, res) {
    var messagesRecipients = new MessagesRecipients();
    messagesRecipients.userId = req.body.userid;
    messagesRecipients.username = req.body.username;
    messagesRecipients.chatid = req.body.chatid;
    messagesRecipients.groupid = req.body.groupid;
    messagesRecipients.channelname = req.body.channelname;
});

//=============================================================================
// on routes that end in /messages
// ----------------------------------------------------
router.route('/messages/:chatid')

// get all messages from chatid
.get(function(req, res) {
    Messages.find({"chatid": req.params.chatid}, function(err, messages) {
        if(err) res.send(err);

        res.json(messages);
    });
});

//=============================================================================
// on routes that end in /usergroup
// ----------------------------------------------------
router.route('/usergroup')

// create a usergroup (accessed at POST http://localhost:8080/usergroup)
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

// get all the usergroup (accessed at GET http://localhost:8080/api/usergroup)
.get(function(req, res) {
    CalendarUserGroup.find(function(err, usergroup) {
        if (err)
            res.send(err);


        res.json(usergroup);
    });
});

// on routes that end in /usergroup/:usergroup_id
// ----------------------------------------------------
router.route('/usergroup/:usergroup_id')

// get the usergroup with that id
.get(function(req, res) {
    CalendarUserGroup.findById(req.params.usergroup_id, function(err, usergroup) {
        if (err)
            res.send(err);
        res.json(usergroup);
    });
})

// update the usergroup with this id
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

// delete the usergroup with this id
.delete(function(req, res) {
   CalendarUserGroup.remove({
        _id: req.params.usergroup_id
    }, function(err, usergroup) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
});

//=============================================================================
// on routes that end in /group
// ----------------------------------------------------
router.route('/group')

// create a group (accessed at POST http://localhost:8080/group)
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

// get all the group (accessed at GET http://localhost:8080/api/group)
.get(function(req, res) {
    CalendarGroup.find(function(err, group) {
        if (err)
            res.send(err);


        res.json(group);
    });
});

// on routes that end in /group/:group_id
// ----------------------------------------------------
router.route('/group/:group_id')

// get the group with that id
.get(function(req, res) {
    CalendarGroup.findById(req.params.group_id, function(err, group) {
        if (err)
            res.send(err);
        res.json(group);
    });
})

// update the group with this id
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

// delete the group with this id
.delete(function(req, res) {
   CalendarGroup.remove({
        _id: req.params.group_id
    }, function(err, group) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
});


//=============================================================================
// on routes that end in /usergroupevent
// ----------------------------------------------------
router.route('/usergroupevent')

// create a usergroupevent (accessed at POST http://localhost:8080/usergroupevent)
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

// get all the usergroupevent (accessed at GET http://localhost:8080/api/usergroupevent)
.get(function(req, res) {
    CalendarUserGroupEvent.find(function(err, usergroupevent) {
        if (err)
            res.send(err);


        res.json(usergroupevent);
    });
});

// on routes that end in /usergroupevent/:usergroupevent_id
// ----------------------------------------------------

router.route('/usergroupevent/:userId')

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
})

// update the usergroupevent with this id
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

// delete the usergroupevent with this id
.delete(function(req, res) {
   CalendarUserGroupEvent.remove({
        _id: req.params.usergroupevent_id
    }, function(err, usergroupevent) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
});


//=============================================================================
// on routes that end in /event
// ----------------------------------------------------
router.route('/event')

// create a usergroupevent (accessed at POST http://localhost:8080/usergroupevent)
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

// get all the event (accessed at GET http://localhost:8080/api/event)
.get(function(req, res) {
    CalendarEvent.find(function(err, event) {
        if (err)
            res.send(err);


        res.json(event);
    });
});

// on routes that end in /event/:event_id
// ----------------------------------------------------

router.route('/event/:eventId')

.get(function(req, res) {
    CalendarEvent.find({"eventId":req.params.eventId}, function(err, usergroupevent) {
        if (err)
            res.send(err);
        res.json(usergroupevent);
    });
})

// update the event with this id
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

// delete the event with this id
.delete(function(req, res) {
   CalendarEvent.remove({
        _id: req.params.event_id
    }, function(err, event) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
});

//=============================================================================
// on routes that end in /eventtype
// ----------------------------------------------------
router.route('/eventtype')

// create a eventtype (accessed at POST http://localhost:8080/eventype)
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

// get all the eventtype (accessed at GET http://localhost:8080/api/eventtype)
.get(function(req, res) {
    CalendarEventType.find(function(err, eventtype) {
        if (err)
            res.send(err);


        res.json(eventtype);
    });
});

// on routes that end in /eventtype/:eventtype_id
// ----------------------------------------------------
router.route('/eventtype/:eventtype_id')

// get the event with that id
.get(function(req, res) {
    CalendarEventType.findById(req.params.eventtype_id, function(err, eventtype) {
        if (err)
            res.send(err);
        res.json(eventtype);
    });
})

// update the eventtype with this id
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

// delete the eventtype with this id
.delete(function(req, res) {
   CalendarEventType.remove({
        _id: req.params.eventtype_id
    }, function(err, eventtype) {
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
