var mongoose = require('mongoose');
var Chats = mongoose.model('chats');

// get all chats table entries (accessed at GET http://localhost:3000/api/chats)
module.exports.getAllChatEntries = function (req, res) {

    Chats.find(function(err, category) {
        if (err)
            res.send(err);

        res.json(category);
    });
};

// post a new chat entry (accessed at POST http://localhost:3000/api/chats)
module.exports.createChatEntry = function (req, res) {

    var chats = new Chats();
    chats.channelname = req.body.channelname;
    chats.groupType = req.body.groupType;

    for (var i = 0; i < req.body.users.length; i++) {
        var user = {
            userid: req.body.users[i].userid,
            username: req.body.users[i].username
        };
        console.log(i);
        chats.users.push(user);
    }

    //console.log(chats);

    chats.save(function(err) {
        if (err)
            res.send(err);

        res.json(chats);
    });
};

// get a specific chats entry (accessed at GET http://localhost:3000/api/chats/{chatid})
module.exports.getASpecificChatEntry = function (req, res) {

    Chats.findById(req.params.chatid, function(err, chat) {
        if (err)
            res.send(err);
        res.json(chat);
    });
};

// get all chat entries for a specific userId (accessed at GET http://localhost:3000/api/chats/userid/{userId})
module.exports.getChatsForSpecificUser = function (req, res) {

    Chats.find({"users.userid": req.params.userid }, {"users":1, "usernames":1, "_id":1, "channelname":1, "groupType":1},function(err, chats) {
        if (err)
            res.send(err);

        res.json(chats);
    });    
};
