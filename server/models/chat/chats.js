var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatsSchema = mongoose.Schema({
	userid : [String], // all users that were ever in the chat
	usernames : [String],
	channelname: String, // channel name to be displayed
	groupType: String // direct message or chat channel
}, 
{
	versionKey: false
});

module.exports = mongoose.model('chats', chatsSchema);
