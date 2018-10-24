var mongoose = require('mongoose');

var openingTimeSchema = new mongoose.Schema({
    days: {type: String, required: true},
    opening: String,
    closing: String,
    closed: {type: Boolean, required: true}
});

var reviewSchema = new mongoose.Schema({
    author: {type: String, required: true},
    rating: {type: Number, required: true, "default": 0, min: 0, max: 5},
    reviewText: {type: String, required: true},
    createdOn: {type: Date, "default": Date.now}
});

var locationSchema = new mongoose.Schema({
    name: {type: String, required: true},
    address: String,
    rating: {type: Number, "default": 0, min: 0, max: 5},
    facilities: [String],
    loc: {
        type: {type: String},
        coordinates: []
    },
    openingTimes: [openingTimeSchema],
    reviews: [reviewSchema]
});

locationSchema.index({"loc": "2dsphere"});

mongoose.model('Location', locationSchema);
