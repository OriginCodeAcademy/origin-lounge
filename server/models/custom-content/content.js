var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ContentSchema   = new Schema({
	categoryId: String,
	title: String,
	bodyDescr: String,
	createdBy: String,
	

},
		{ versionKey: false ,
	 		timestamps: true }
);

module.exports = mongoose.model('content', ContentSchema);