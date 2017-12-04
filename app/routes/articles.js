const article = require('../models/article')

module.exports = (app, passport) => {

    app.get('/articles', (req, res) => {
        article.find((err, article) => {
            res.render('articles'), {
                article: article,
                layout: 'layout'
            }
            console.log(article);
        })
    })

}