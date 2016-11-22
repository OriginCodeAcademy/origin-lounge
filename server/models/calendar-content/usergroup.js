var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserGroupSchema = new Schema({
    userId: String,
    groupId: String

}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('usergroup', UserGroupSchema);