/*GET Home Page */
module.exports.index = (req, res) => {
    res.render('index', { title: 'Express' })
};
