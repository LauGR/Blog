const article = require('../models/article');


module.exports = (app, passport) => {

    // BASIC ROUTE (INDEX)

    app.get('/', (req, res) => {
        article.find((err, article) => {
            res.render('index', {
                layout: 'layout',
                _id : req.params.id,
                article: article,
                articleMenu: article
            });
        });
    });
}