
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RatingSchema   = new Schema({
    wifi_id: String,
    user_id: String
});

module.exports = mongoose.model('Rating', RatingSchema);

// 5845dc1cc4aa0d0df439771e user
// 5845d8cf591d2a0c4c5f09a1 wifi