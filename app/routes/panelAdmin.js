    const permissions = require('../../config/permissions');
    const multer = require('multer');
    const fs = require('fs');
    const article = require('../models/article')
    const upload = multer({
        dest: 'public/images/'
    })

    module.exports = (app, passport) => {



        // PANEL ADMIN 

        app.get('/dashbord', permissions.can('access admin page'), (req, res) => {
            article.find((err, carte) => {
                res.render('dashbord', {
                    articles: carte,
                    layout: 'layoutAdmin'
                })

            })
        });

        app.get('/article/:id/delete', permissions.can('access admin page'), (req, res) => {
            article.remove({
                _id: req.params.id
            }, (err, delData) => {
                res.redirect("/dashbord");
            })
        })

        app.get('/dashbord/article', permissions.can('access admin page'), (req, res) => {
            res.render('article', {
                layout: 'layoutAdmin'
            });
        });


        // CREATE ARTICLE PANEL ADMIN


        app.post('/dashbord/article', permissions.can('access admin page'), (req, res) => {

            let myData = new article({
                name: req.body.name,
                url: req.body.url,
                dateA: req.body.dateA,
                dateR: req.body.dateR,
                sejour: req.body.sejour,
                preview: req.body.preview,

            });

            myData
                .save()
                .then(item => {
                    //delete temp file
                    fs.unlink(tmp_path);
                    src.on('end', () => {
                        res.redirect("/dashbord/article");
                    });
                    src.on('error', (err) => {
                        res.render('error');
                    });

                })
                .catch(err => {
                    res
                        .status(400)
                });
        });
        // UPDATE article PANEL ADMIN

        app.get('/updatearticle/:id', permissions.can('access admin page'), (req, res) => {
            article.find((err, articles) => {
                res.render('updatearticle', {
                    layout: 'layoutAdmin',
                    article: req.params.id,
                    article: articles.filter((article) => {
                        return article.id == req.params.id
                    })[0]
                })
            })
        })

        app.post('/updatearticle/:id', permissions.can('access admin page'), (req, res) => {

                article.findByIdAndUpdate(req.params.id, {
                        $set: {
                            name: req.body.name,
                            url: req.body.url,
                            dateA: req.body.dateA,
                            dateR: req.body.dateR,
                            sejour: req.body.sejour,
                            preview: req.body.preview,
                            text: req.body.text,
                            img: img_path
                        }
                    }, {
                        new: true
                    }, (err, article) => {
                        article.save().then(item => {
                                //delete temp file
                                fs.unlink(tmp_path);
                                console.log('Ca marche toujours')
                            },
                            res.redirect('/dashbord')
                        )
                    .catch(err => {
                        res.status(400);
                    });

                })
        })

    }