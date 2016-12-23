var mongoose = require('mongoose');
var Messages = mongoose.model('message');


// get all messages table entries (accessed at GET http://localhost:3000/api/messages)
module.exports.getAllMessages = function (req, res) {

    Messages.find(function(err, category) {
        if (err)
            res.send(err);

        res.json(category);
    });
};

// post a new messages entry (accessed at POST http://localhost:3000/api/messages)
module.exports.postMessage = function (req, res) {

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
};

// get all messages associated with a specific chatid (accessed at GET http://localhost:3000/api/messages/{chatid})
module.exports.getAllMessagesForAChatRoom = function (req, res) {

    Messages.find({"chatid": req.params.chatid}, function(err, messages) {
        if(err) res.send(err);

        res.json(messages);
    });
};
