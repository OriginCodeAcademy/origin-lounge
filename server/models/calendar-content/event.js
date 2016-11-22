var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
    eventId: Number,
    title: String,
    detail: String,
    eventTypeId: String,
    date: String,
    time: String


}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('event', EventSchema);