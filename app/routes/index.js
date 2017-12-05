const article = require('../models/article');


module.exports = (app, passport) => {

    // BASIC ROUTE (INDEX)

    app.get('/', (req, res) => {
        article.find((err, articles) => {
            res.render('index', {
                article: articles,
                articleMenu: article
            });
        });
    });



}