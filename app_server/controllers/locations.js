/* Home Page */
module.exports.homeList = (req, res) => {
    res.render('locations-list', { title: 'Home' });
};

/* Location Info Page */
module.exports.locationInfo = (req, res) => {
    res.render('location-info', { title: 'Location Info' });
};

/* Add Review Page */
module.exports.addReview = (req, res) => {
    res.render('location-review-form', { title: 'Add Review' });
};
