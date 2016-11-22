var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContentCategorySchema = new Schema({
    categoryId: String,
    contentId: String
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('contentCategory', ContentCategorySchema);