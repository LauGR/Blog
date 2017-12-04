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


    app.use('/articles', (req, res, next) => {
        article.find({}, (err, articlesMenu) => {
            req.articlesMenu = articlesMenu;
            next();
        })
    })


    app.get('/articles', ((req, res) => {
        article.find((err, articles) => {
            res.render('articles', {
                articlesMenu: req.articlesMenu,
                article: req.params.url,
                mesarticles: articles.filter((article) => {
                    return article.url == req.params.url
                })[0]
            })
        })
    }))



}