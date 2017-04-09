var express = require('express');
var router = express.Router();


// require Controllers
var categoryController = require('../controllers/custom-content/category');
var contentController = require('../controllers/custom-content/content');
var apiContentController = require('../controllers/api-content/apicode');
var roleCategoryController = require('../controllers/custom-content/rolecategory');
var contentCategoryController = require('../controllers/custom-content/contentcategory');
var chatsController = require('../controllers/chat/chats');
var messagesController = require('../controllers/chat/message');
var calendarUserGroupsController = require('../controllers/calendar-content/usergroup');
var calendarGroupController = require('../controllers/calendar-content/group');
var calendarUserGroupEventController = require('../controllers/calendar-content/usergroupevent');
var calendarEventController = require('../controllers/calendar-content/event');
var calendarEventTypeController = require('../controllers/calendar-content/eventtype');
var gridFSController = require('../controllers/gridFS/gridFS');



// Middleware to use for all http requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

// Test route to make sure everything is working
router.get('/', function(req, res) {

    res.json({ message: 'hooray! welcome to our api!' });
});

// Category routes
router.get('/category', categoryController.getAllCategories);
router.post('/category', categoryController.addCategory);
router.get('/category/:category_id', categoryController.readOneCategory);
router.delete('/category/:category_id', categoryController.deleteCategory);
router.put('/category/:category_id', categoryController.updateCategory);

// Content routes
router.get('/content', contentController.getAllContent);
router.post('/content', contentController.addContent);
router.get('/content/:content_id', contentController.getSpecificContentEntry);
router.put('/content/:content_id', contentController.updateContent);
router.delete('/content/:content_id', contentController.deleteContent);

// Api Code routes
router.get('/apicode', apiContentController.getAllApiCodes);
router.post('/apicode', apiContentController.addApiCode);
router.get('/apicode/:apicode_id', apiContentController.getOneApiCodeEntry);
router.put('/apicode/:apicode_id', apiContentController.updateApiCodeEntry);
router.delete('/apicode/:apicode_id', apiContentController.deleteApiCodeEntry);

// Role Category routes
router.get('/rolecategory', roleCategoryController.getAllRoleCategoryEntries);
router.post('/rolecategory', roleCategoryController.createARoleCategoryEntry);
router.get('/rolecategory/:rolecategory_id' , roleCategoryController.getSpecificRoleCategoryEntry);
router.put('/rolecategory/:rolecategory_id' , roleCategoryController.updateRoleCategoryEntry);
router.delete('/rolecategory/:rolecategory_id' , roleCategoryController.deleteRoleCategoryEntry);

// Content Category routes
router.get('/contentcategory', contentCategoryController.getAllContentCategoryEntries);
router.post('/contentcategory', contentCategoryController.createAContentCategoryEntry);
router.get('/contentcategory/:contentcategory_id' , contentCategoryController.getSpecificContentCategoryEntry);
router.put('/contentcategory/:contentcategory_id' , contentCategoryController.updateContentCategoryEntry);
router.delete('/contentcategory/:contentcategory_id' , contentCategoryController.deleteContentCategoryEntry);

// Chat routes
router.get('/chats', chatsController.getAllChatEntries);
router.post('/chats', chatsController.createChatEntry);
router.get('/chats/:chatid', chatsController.getASpecificChatEntry);
router.get('/chats/userid/:userid', chatsController.getChatsForSpecificUser);

// Messages routes
router.get('/messages', messagesController.getAllMessages);
router.post('/messages', messagesController.postMessage);
router.get('/messages/:chatid', messagesController.getAllMessagesForAChatRoom);

// Calendar UserGroup routes
router.get('/usergroup', calendarUserGroupsController.getAllCalendarUserGroups);
router.post('/usergroup', calendarUserGroupsController.createCalendarUserGroup);
router.get('/usergroup/:usergroup_id' , calendarUserGroupsController.getSpecificCalendarUserGroup);
router.put('/usergroup/:usergroup_id' , calendarUserGroupsController.updateCalendarUserGroup);
router.delete('/usergroup/:usergroup_id' , calendarUserGroupsController.deleteCalendarUserGroup);

// Calendar Group routes
router.get('/group', calendarGroupController.getAllCalendarGroups);
router.post('/group', calendarGroupController.createCalendarGroup);
router.get('/group/:group_id' , calendarGroupController.getSpecificCalendarGroup);
router.put('/group/:group_id' , calendarGroupController.updateCalendarGroup);
router.delete('/group/:group_id' , calendarGroupController.deleteCalendarGroup);

// Calendar User Group event routes
router.get('/usergroupevent', calendarUserGroupEventController.getAllCalendarUserGroupEvents);
router.post('/usergroupevent', calendarUserGroupEventController.createCalendarUserGroupEvent);
router.get('/usergroupevent/:userId' , calendarUserGroupEventController.getCalendarUserGroupEventsForSpecificUser);
router.put('/usergroupevent/:usergroupevent_id' , calendarUserGroupEventController.updateCalendarUserGroupEvent);
router.delete('/usergroupevent/:usergroupevent_id' , calendarUserGroupEventController.deleteCalendarUserGroupEvent);

// Calendar Event routes
router.get('/event', calendarEventController.getAllCalendarEvents);
router.post('/event', calendarEventController.createCalendarEvent);
router.get('/event/:eventId' , calendarEventController.getSpecificCalendarEvent);
router.put('/event/:eventId' , calendarEventController.updateCalendarEvent);
router.delete('/event/:eventId' , calendarEventController.deleteCalendarEvent);

// Calendar Event Type routes
router.get('/eventtype', calendarEventTypeController.getAllCalendarEventTypes);
router.post('/eventtype', calendarEventTypeController.createCalendarEventType);
router.get('/eventtype/:eventtype_id' , calendarEventTypeController.getSpecificCalendarEventType);
router.put('/eventtype/:eventtype_id' , calendarEventTypeController.updateCalendarEventType);
router.delete('/eventtype/:eventtype_id' , calendarEventTypeController.deleteCalendarEventType);

// GridFS routes
router.get('/files/:file_id', gridFSController.getSpecificFile);
router.get('/files/chat/:chat_id', gridFSController.getFilesInAChat);
router.post('/files', gridFSController.postAFile);

module.exports = router;

