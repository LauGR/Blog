const article = require('../models/article')

module.exports = (app, passport) => {

    app.get('/articles/:id   ', (req, res) => {
        article.find((err, articles) => {
            res.render('layoutarticles.ejs', {
                article: articles,
                articleMenu: article,
                layout: 'layoutarticles'
            })
        })
    })
}