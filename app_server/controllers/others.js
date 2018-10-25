/* About Page */
module.exports.about = (req, res) => {

    var context_dic = {
        title: 'About',
        text: 'Loc8r was created to help people find places to sit down and get a bit of work done.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed lorem acnisi dignissim accumsan.'
    }

    res.render('generic-text', context_dic);
};

module.exports.angularApp = (req, res) => {
    res.render('layout', {title: 'Loc8r'});
}
