var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventTypeSchema = new Schema({
    eventType: String,
    eventTypeId: String

}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('eventtype', EventTypeSchema);