var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = mongoose.Schema({ // message setup
	chatid : String,
	message: String,
	sender: String, 
	created: {type: Date, default: Date.now()}
}, {versionKey: false});

module.exports = mongoose.model('message', messageSchema);