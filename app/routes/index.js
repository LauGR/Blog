const article = require('../models/article');


module.exports = (app, passport) => {

    // BASIC ROUTE (INDEX)

    app.get('/', (req, res) => {
        article.find((err, article) => {
            res.render('index', {
                mesarticle: article,
                articleMenu: article
            });
        });
    });


    app.use('/article', (req, res, next) => {
        article.find({}, (err, articleMenu) => {
            req.articleMenu = articleMenu;
            next();
        })
    })


    app.get('/article', ((req, res) => {
        article.find((err, article) => {
            res.render('article', {
                articleMenu: req.articleMenu,
                article: req.params.url,
                mesarticle: article.filter((article) => {
                    return article.url == req.params.url
                })[0]
            })
        })
    }))



}