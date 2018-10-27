var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.JWT_SECRET,
    requestProperty: 'payload'
});


var ctrlLocations = require('../controllers/locations');
var ctrlReviews = require('../controllers/reviews');
var ctrlAuth = require('../controllers/authentication');

//Locations routes
router.get('/locations', ctrlLocations.locationsListByDistance);
router.post('/locations', ctrlLocations.locationsCreate);
router.get('/locations/:locationId', ctrlLocations.locationsReadOne);
router.put('/locations/:locationId', ctrlLocations.locationsUpdateOne);
router.delete('/locations/:locationId', ctrlLocations.locationsDeleteOne);

//Review routes
router.post('/locations/:locationId/reviews', auth, ctrlReviews.reviewsCreate);
router.get('/locations/:locationId/reviews/:reviewId', auth, ctrlReviews.reviewsReadOne);
router.put('/locations/:locationId/reviews/:reviewId', auth, ctrlReviews.reviewsUpdateOne);
router.delete('/locations/:locationId/reviews/:reviewId', auth, ctrlReviews.reviewsDeleteOne);

//Authentication routes
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;
