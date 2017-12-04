    const permissions = require('../../config/permissions');
    const multer = require('multer');
    const fs = require('fs');
    const article = require('../models/article')
    const user = require('../models/user')
    const upload = multer({
        dest: 'public/images/'
    })

    module.exports = (app, passport) => {



        // PANEL ADMIN 

        app.get('/dashbord', permissions.can('access admin page'), (req, res) => {
            article.find((err, article) => {
                res.render('dashbord', {
                    article: article,
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

        app.get('/dashbord/articles', permissions.can('access admin page'), (req, res) => {
                res.render('createarticle',
                    {layout: 'layoutAdmin'
                });
        });


    // PROFIL ADMIN 

    app.get('/dashbord/profil', permissions.can('access admin page'), (req, res) => {
        user.find((err, user) => {
            res.render('profil', {
                user: user,
                layout: 'layoutAdmin'
            })

        })
    })

    // CREATE ARTICLE PANEL ADMIN


    app.post('/dashbord/articles', permissions.can('access admin page'), (req, res) => {

        let myData = new article({
            title: req.body.title,
            date: req.body.date,
            content: req.body.content
        });

        myData
            .save()
            .then(item => {
                //delete temp file
                fs.unlink(tmp_path);
                src.on('end', () => {
                    res.redirect("/dashbord");
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
                title: req.body.title,
                date: req.body.date,
                content: req.body.content
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