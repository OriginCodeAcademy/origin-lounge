var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    name: String


}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('category', CategorySchema);
