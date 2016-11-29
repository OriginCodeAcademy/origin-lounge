var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageRecipientsSchema = mongoose.Schema({
	userid : [String], // all users that were ever in the chat
	usernames : [String],
	chatid: String, // Room used
	groupid: String, // id of group of all those currently in the chat
	channelname: String, // channel name to be displayed
	groupType: String // direct message or chat channel
}, 
{
	versionKey: false
});

module.exports = mongoose.model('messagerecipients', messageRecipientsSchema);