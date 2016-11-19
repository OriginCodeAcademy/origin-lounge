var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserGroupEventSchema = new Schema({
    userId: String,
    groupId: String,
    eventId: String

}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('usergroupevent', UserGroupEventSchema);