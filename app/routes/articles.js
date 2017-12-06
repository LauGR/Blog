const article = require('../models/article')

module.exports = (app, passport) => {

    app.get('/articles', (req, res) => {
        article.find((err, articles) => {
            res.render('articles.ejs', {
                article: articles,
                articleMenu: article,
                layout: 'articles'
            })
        })
    })
}