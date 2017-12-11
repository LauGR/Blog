const article = require('../models/article')

module.exports = (app, passport) => {

    app.get('/articles/:url', (req, res) => {
        article.find((err, articles) => {
            res.render('articles', {
                url: req.params.url,

                monArticle: articles.filter((articles) => {
                    return articles.url == req.params.url
                    layout: 'layout'
                })[0]
            })

        })

    })
}