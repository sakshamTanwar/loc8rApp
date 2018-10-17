/* Home Page */
module.exports.homeList = (req, res) => {
    res.render('index', { title: 'Home' });
};

/* Location Info Page */
module.exports.locationInfo = (req, res) => {
    res.render('index', { title: 'Location Info' });
};

/* Add Review Page */
module.exports.addReview = (req, res) => {
    res.render('index', { title: 'Add Review' });
};
