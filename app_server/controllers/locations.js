/* Home Page */
var request = require('request');
var apiOptions = {
    server: "http://localhost:3000"
};

if(process.env.NODE_ENV === 'production') {
    apiOptions.server = "http://thawing-savannah-71712.herokuapp.com";
}

var renderHomePage = (req, res, responseBody) => {
    var message;
    if(!(responseBody.constructor === Array)) {
        message = "API lookup error";
        responseBody = [];
    }
    else {
        if(!responseBody.length) {
            message = "No places found nearby";
        }
    }
    var context_dic = {
        title: 'Loc8r - find a place to work with wifi',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        sidebar: {
            text: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you\'re looking for.'
        },
        message: message,
        locations: responseBody
    };
    res.render('locations-list', context_dic);
}

module.exports.homeList = (req, res) => {
    var requestOptions, path;
    path = '/api/locations';
    requestOptions = {
        url: apiOptions.server + path,
        method: 'GET',
        qs: {
            lng: 0,
            lat: 0,
            maxDistance: 20
        },
        json: {},
    };

    request(requestOptions, (err, response, body) => {
        renderHomePage(req, res, body);
    })
};

/* Location Info Page */
var renderDetailPage = (req, res, locDetail) => {
    var context_dic = {
        title: locDetail.name,
        pageHeader: {
            title: locDetail.name
        },
        sidebar: {
            context:  'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
            callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
        },
        location: locDetail
    };

    res.render('location-info', context_dic);
}

var _showError = (req, res, status) => {
    var title, content;
    if(status == 404) {
        title = "404, page not found";
        content = "Looks like we cannot find this page";
    }
    else {
        title = status + ", something gone wrong";
        content = "Something, somewhere, has gone wrong";
    }

    res.status(status);
    res.render('generic-text', {
        title: title,
        text: content
    });
}

var getLocationInfo = (req, res, callback) => {
    var requestOptions, path;
    path = '/api/locations/' + req.params.locationId;
    requestOptions = {
        url: apiOptions.server + path,
        method: 'GET',
        json: {}
    };

    request(requestOptions, (err, response, body) => {
        if(response.statusCode == 200) {
            callback(req, res, body);
        }
        else {
            _showError(req, res, response.statusCode);
        }

    })

}

module.exports.locationInfo = (req, res) => {
    getLocationInfo(req, res, renderDetailPage);

};

/* Add Review Page */
var renderReviewForm = (req, res, locDetail) => {
    var context_dic = {
        title: 'Review ' + locDetail.name + ' on Loc8r',
        pageHeader: { title: 'Review ' + locDetail.name },
        user: {
            displayName: "Saksham Tanwar"
        },
        error: req.query.err
    }
    res.render('location-review-form', context_dic);
}

module.exports.addReview = (req, res) => {
    getLocationInfo(req, res, renderReviewForm);
};

/* Form post for add review */
module.exports.doAddReview = (req, res) => {
    var requestOptions, path, locationId, postData;
    locationId = req.params.locationId;
    path = "/api/locations/" + locationId + "/reviews";
    console.log(req.body.rating);
    postData = {
        author: req.body.name,
        rating: parseInt(req.body.rating, 10),
        reviewText: req.body.review
    };
    requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postData
    };
    if(!postData.author || !postData.rating || !postData.reviewText) {
        res.redirect('/location/' + locationId + '/review/new?err=val');
        return;
    }
    request(requestOptions, (err, response, body) => {
        if(response.statusCode == 201) {
            res.redirect('/location/' + locationId);
        }
        else if (response.statusCode == 400 && body.name && body.name === 'ValidationError') {
            res.redirect('/location/' + locationId + '/review/new?err=val');
        }
        else {
            _showError(req, res, response.statusCode);
        }
    })
}
