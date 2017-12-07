const article = require('../models/article')

module.exports = (app, passport) => {

        app.get('/articles/:id', (req, res) => {
                    article.find((err, articles) => {
                            res.render('articles', {
                                id: req.params.id,
                             
                                monArticle: articles.filter((articles) => {
                                    return articles.id == req.params.id
                                    layout: 'layout'
                                })
                                [0]
                            })

                        })

                    })
                }
