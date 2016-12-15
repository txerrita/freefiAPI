var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var wifiSpotSchema = new Schema({
    wifiName: String,
    hasPassword: Boolean,
    password: String,
    likes: Number,
    dislikes: Number,
    dateCreated: Date,
    position: {
        name: String,
        lat: Number,
        lon: Number
    },
    showInfo: Boolean
});

module.exports = mongoose.model('WifiSpot', wifiSpotSchema);