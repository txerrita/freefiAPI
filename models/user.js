
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    emailverified: Boolean,
    email: String,
    password: String
});

module.exports = mongoose.model('User', UserSchema);