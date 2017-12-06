const article = require('../models/article');


module.exports = (app, passport) => {

    // BASIC ROUTE (INDEX)

    app.get('/', (req, res) => {
        article.find((err, articles) => {
            res.render('index', {
                layout: 'layout',
                article: articles,
                articleMenu: article
            });
        });
    });



}