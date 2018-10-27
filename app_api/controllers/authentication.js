var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
}

module.exports.register = (req, res) => {
    if(!req.body.name || !req.body.email || !req.body.password) {
        sendJsonResponse(res, 400, {
            'message': 'All fields are required'
        });
        return;
    }

    var user = new User();

    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);

    user.save((err) => {
        if(err) {
            var error = {
                message: "Email id already present"
            }
            sendJsonResponse(res, 400, error);
        }
        else {
            token = user.generateJwt();
            sendJsonResponse(res, 200, {
                'token': token
            })
        }
    })
}

module.exports.login = (req, res) => {
    if(!req.body.email || !req.body.password) {
        sendJsonResponse(res, 400, {
            'message': 'All fields are required'
        })
        return;
    }

    passport.authenticate('local', (err, user, info) => {
        if(err) {
            sendJsonResponse(res, 404, err);
            return;
        }
        if(user) {
            var token = user.generateJwt();
            sendJsonResponse(res, 200, {
                'token': token
            })
        }
        else {
            sendJsonResponse(res, 404, info);
        }
    }) (req, res);

}
