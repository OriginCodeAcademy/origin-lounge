var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupSchema = new Schema({
    groupId: String,
    groupName: String

}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('group', GroupSchema);