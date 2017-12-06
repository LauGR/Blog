const article = require('../models/article')

module.exports = (app, passport) => {

    app.get('/articles/:_id', (req, res) => {
        article.find((err, articles) => {
            res.render('layoutarticles.ejs', {
                _id : req.params._id,
                article: articles,
                articleMenu: article,
                layout: 'layoutarticles'
            })
        })
    })
}