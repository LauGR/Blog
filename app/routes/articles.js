const article = require('../models/article')


module.exports = (app, passport) => {

    app.get('/articles', (req, res) => {
        article.find((err, article) => {
            res.render('articles'), {
                article: article,
                articleMenu: article,
                layout: 'layout'
            }
            console.log(article);
        })
    })
}