var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApiCodeSchema = new Schema({
    name: String,
    userId: String,
    linkedInKey: String,
    githubKey: String,
    linkedInUrl: String


}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('apicode', ApiCodeSchema);