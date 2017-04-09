var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Users = mongoose.Schema({
	userid : String, 
	username : String
}, 
{
	versionKey: false
});

var chatsSchema = mongoose.Schema({
	users: [Users],
	channelname: String, // channel name to be displayed
	groupType: String // direct message or chat channel
}, 
{
	versionKey: false
});

module.exports = mongoose.model('chats', chatsSchema);
