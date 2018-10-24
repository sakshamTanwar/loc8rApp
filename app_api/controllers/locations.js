var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
}

var theEarth = (() => {
    var earthRadius = 6371;

    var getDistanceFromRads = (rads) => {
        return parseFloat(rads*earthRadius);
    }

    var getRadsFromDistance = (dis) => {
        return parseFloat(dis/earthRadius);
    }

    return {
        getDistanceFromRads: getDistanceFromRads,
        getRadsFromDistance: getRadsFromDistance
    };
})();

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
                sendJsonResponse(res, 200, result);
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
