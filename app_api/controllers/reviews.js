var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
}

var updateAverageRating = (locationId) => {
    Loc
        .findById(locationId)
        .select('rating reviews')
        .exec((err, location) => {
            if(!err) {
                doSetAverageRating(location);
            }
        })
}

var doSetAverageRating = (location) => {
    var i, reviewCount, ratingAverage, ratingTotal;
    if (location.reviews && location.reviews.length >= 0) {
        reviewCount = location.reviews.length;
        ratingTotal = 0;
        for (i = 0; i < reviewCount; i++) {
            ratingTotal = ratingTotal + location.reviews[i].rating;
        }
        ratingAverage = parseInt(ratingTotal / reviewCount, 10);
        location.rating = ratingAverage;
        location.save(function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Average rating updated to", ratingAverage);
            }
        });
    }
};

var doAddReview = (req, res, location) => {
    if(!location) {
        sendJsonResponse(res, 404, {
            "message": "locationId not found"
        });
    }
    else {
        location.reviews.push({
            author: req.body.author,
            rating: req.body.rating,
            reviewText: req.body.reviewText
        });
        location.save((err, location) =>{
            if(err) {
                console.log(err);
                sendJsonResponse(res, 400, err);
            }
            else {
                updateAverageRating(location._id);
                var thisReview = location.reviews[location.reviews.length - 1];
                sendJsonResponse(res, 201, thisReview);
            }
        })
    }
}

module.exports.reviewsCreate = (req, res) => {
    var locationId = req.params.locationId;
    if(locationId) {
        Loc
            .findById(locationId)
            .select('reviews')
            .exec((err, location) => {
                if(err) {
                    sendJsonResponse(res, 400, err);
                }
                else {
                    doAddReview(req, res, location);
                }
            })
    }
    else {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationId required"
        });
    }
}

module.exports.reviewsReadOne = (req, res) => {
    if(req.params && req.params.locationId && req.params.reviewId) {
        Loc
            .findById(req.params.locationId)
            .exec((err, location) => {
                if(!location) {
                    sendJsonResponse(res, 404, {
                        "message": "locationId not found"
                    });
                    return;
                }
                else if(err)
                {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                if(location.reviews && location.reviews.length > 0) {
                    var review = location.reviews.id(req.params.reviewId);
                    if(!review) {
                        sendJsonResponse(res, 404, {
                            "message": "reviewId not found"
                        });
                    }
                    else {
                        var response = {
                            location: {
                                name: location.name,
                                id: req.params.locationId
                            },
                            review: review
                        };
                        sendJsonResponse(res, 200, response);
                    }
                }
                else {
                    sendJsonResponse(res, 404, {
                        "message": "no reviews found"
                    });
                }
            })
    }
    else {
        sendJsonResponse(res, 404, {
            "message": "Not Found, locationId and reviewId are both required"
        });
    }
}

module.exports.reviewsDeleteOne = (req, res) => {
    if(!req.params.locationId || !req.params.reviewId) {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationId and reviewId are both required"
        })
        return;
    }
    Loc
        .findById(req.params.locationId)
        .select('reviews')
        .exec((err, location) => {
            if(!location) {
                sendJsonResponse(res, 404, {
                    "message": "locationId not found"
                });
                return;
            }
            else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }

            if(location.reviews && location.reviews.length > 0) {
                if(!location.reviews.id(req.params.reviewId)) {
                    sendJsonResponse(res, 404, {
                        "message": "reviewId not found"
                    });
                }
                else {
                    location.reviews.id(req.params.reviewId).remove();
                    location.save((err) => {
                        if(err) {
                            sendJsonResponse(res, 404, err);
                        }
                        else {
                            updateAverageRating(location._id);
                            sendJsonResponse(res, 204, null);
                        }
                    })
                }
            }
            else {
                sendJsonResponse(res, 404, {
                    "message": "No reviews to delete"
                });
            }
        })
}

module.exports.reviewsUpdateOne = (req, res) => {
    if(!req.params.locationId || !req.params.reviewId) {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationId and reviewId are both required"
        });
        return;
    }
    Loc
        .findById(req.params.locationId)
        .select('reviews')
        .exec((err, location) => {
            if(!location) {
                sendJsonResponse(res, 404, {
                    "message": "locationId not found"
                });
                return;
            }
            else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }

            if(location.reviews && location.reviews.length > 0) {
                var thisReview = location.reviews.id(req.params.reviewId);
                if(!thisReview) {
                    sendJsonResponse(res, 404, {
                        "message": "reviewId not found"
                    });
                }
                else {
                    thisReview.author = req.body.author;
                    thisReview.rating = req.body.rating;
                    thisReview.reviewText = req.body.reviewText;
                    location.save((err, location) => {
                        if(err) {
                            sendJsonResponse(res, 404, err);
                        }
                        else {
                            updateAverageRating(location._id);
                            sendJsonResponse(res, 200, thisReview);
                        }
                    })
                }
            }
            else {
                sendJsonResponse(res, 404, {
                    "message": "No reviews to update"
                });
            }
        })

}
