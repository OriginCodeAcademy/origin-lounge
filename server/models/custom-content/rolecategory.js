var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoleCategorySchema = new Schema({
    categoryId: String,
    roleId: String
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('roleCategory', RoleCategorySchema);
