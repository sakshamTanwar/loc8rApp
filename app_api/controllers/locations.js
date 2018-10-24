var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
}

module.exports.locationsCreate = (req, res) => {
    Loc.create({
        name: req.body.name,
        address: req.body.address,
        facilities: req.body.facilities.split(","),
        loc: {
            type: "Point",
            coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
        },
        openingTimes: [{
            days: req.body.days1,
            opening: req.body.opening1,
            closing: req.body.closing1,
            closed: req.body.closed1,
        },
        {
            days: req.body.days2,
            opening: req.body.opening2,
            closing: req.body.closing2,
            closed: req.body.closed2,
        }]
    }, (err, location) => {
        if(err) {
            sendJsonResponse(res, 400, err);
        }
        else {
            sendJsonResponse(res, 201, location);
        }
    });
}

var ditanceBetweenPoints = (lat1, lon1, lat2, lon2) => {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))/2;
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

var updateDistance = (lng, lat, result) => {
    result = JSON.parse(JSON.stringify(result));
    for(var i = 0; i<result.length; i++) {
        var lat1 = parseFloat(result[i].loc.coordinates[1]);
        var lng1 = parseFloat(result[i].loc.coordinates[0]);
        var distance = ditanceBetweenPoints(lat, lng, lat1, lng1);
        result[i].dist = distance;
    }

    return result
}

module.exports.locationsListByDistance = (req, res) => {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var point = {
        type: "Point",
        coordinates: [lng, lat]
    };

    if((!lng && lng !== 0) || (!lat && lat !== 0)) {
        sendJsonResponse(res, 404, {
            "message": "lng and lat query parameters are required"
        });
        return;
    }

    var geoOptions = {
        $geometry: {
            type: "Point",
            coordinates: [lng, lat]
        },
        $maxDistance: 2000,
    }

    Loc.find({
            loc: {
                $nearSphere: geoOptions
            }
        })
        .exec((err, result) => {
            if(err) {
                sendJsonResponse(res, 404, err);
            }
            else {
                var updatedResult = updateDistance(lng, lat, result);
                sendJsonResponse(res, 200, updatedResult);
            }
        });
}

module.exports.locationsReadOne = (req, res) => {
    if(req.params && req.params.locationId) {
        Loc.findById(req.params.locationId).exec((err, location) => {
            if(!location) {
                sendJsonResponse(res, 404, {
                    "message": "locationid not found"
                });
                return;
            } else if(err) {
                sendJsonResponse(res, 404, err);
                return;
            }
            sendJsonResponse(res, 200, location);
        });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No locationId in request"
        })
    }
}

module.exports.locationsDeleteOne = (req, res) => {
    if(!req.params.locationId) {
        sendJsonResponse(res, 404, {
            "message": "No locationId found"
        });
    }
    else {
        Loc
            .findByIdAndRemove(req.params.locationId)
            .exec((err, location) => {
                if(err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 204, null);
            })
    }
}

module.exports.locationsUpdateOne = (req, res) => {
    if(!req.params.locationId) {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationId is required"
        });
        return;
    }

    Loc
        .findById(req.params.locationId)
        .select('-reviews -rating')
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

            location.name = req.body.name;
            location.address = req.body.address;
            location.facilities = req.body.facilities.split(",");
            location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
            location.openingTimes = [{
                days: req.body.days1,
                opening: req.body.opening1,
                closing: req.body.closing1,
                closed: req.body.closed1,
            }, {
                days: req.body.days2,
                opening: req.body.opening2,
                closing: req.body.closing2,
                closed: req.body.closed2,
            }];
            location.save((err, location) => {
                if(err) {
                    sendJsonResponse(res, 400, err);
                }
                else {
                    sendJsonResponse(res, 200, location);
                }
            })
        })
}
