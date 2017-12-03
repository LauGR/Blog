const article = require('../models/article');


module.exports = (app, passport) => {

    // BASIC ROUTE (INDEX)

    app.get('/', (req, res) => {
        article.find((err, articles) => {
            res.render('index', {
                mesarticles: articles,
                articlesMenu: articles
            });
        });
    });


    app.use('/article/:url', (req, res, next) => {
        article.find({}, (err, articlesMenu) => {
            req.articlesMenu = articlesMenu;
            next();
        })
    })


    app.get('/article/:url', ((req, res) => {
        article.find((err, articles) => {
            res.render('article', {
                articlesMenu: req.articlesMenu,
                article: req.params.url,
                mesarticles: articles.filter((article) => {
                    return article.url == req.params.url
                })[0]
            })
        })
    }))



}