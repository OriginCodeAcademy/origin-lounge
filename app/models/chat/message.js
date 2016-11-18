var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messgaeSchema = mongoose.Schema({ // message setup
	message: String,
	sender: String, 
	chatid: String,
	created: {type: Date, default: Date.now()}
}, {versionKey: false});

module.exports = mongoose.model('message', messgaeSchema);