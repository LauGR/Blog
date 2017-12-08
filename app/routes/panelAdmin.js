const permissions = require('../../config/permissions');
const multer = require('multer');
const fs = require('fs');
const bcrypt = require('bcrypt-nodejs');
const article = require('../models/article')
const user = require('../models/user')
const upload = multer({
    dest: 'public/images/'
})

module.exports = (app, passport) => {

    // PROFIL ADMIN 
    app.get('/dashboard/profil', permissions.can('access admin page'), (req, res) => {
        user.find((err, user) => {
            res.render('profil', {
                user: user,
                layout: 'layoutAdmin'
            })
        })
    })

    // UPDATE PROFIL ADMIN
    app.get('/dashboard/updateprofil', permissions.can('access admin page'), (req, res) => {
        res.render('updateprofil', {
            user: req.user,
            layout: 'layoutAdmin'

        })
    })

    app.post('/dashboard/updateprofil', permissions.can('access admin page'), upload.single('img'), (req, res) => {
        // Create let for img
        let fileToUpload = req.file;
        let target_path;
        let tmp_path;
        let img_path;
        if (fileToUpload != undefined || fileToUpload != null) {
            console.log('file est defini')
            target_path = 'public/images/' + fileToUpload.originalname;
            tmp_path = fileToUpload.path;
            img_path = fileToUpload.originalname;

        } else {
            console.log('pas ok')
            img_path = req.body.avatar;
        }

        user.findByIdAndUpdate(req.user, {
            $set: {
                "local.nom": req.body.nom,
                "local.prenom": req.body.prenom,
                "local.email": req.body.email,
                "local.avatar": img_path,

                // retrieve the password field
            }
        }, {
            new: true
        }, (err, user) => {
            user.save().then(item => {
                    // console.log('Ca marche')
                    if (fileToUpload != undefined || fileToUpload != null) {
                        let src = fs.createReadStream(tmp_path);
                        let dest = fs.createWriteStream(target_path);
                        src.pipe(dest);
                        //delete temp file
                        fs.unlink(tmp_path);
                        console.log('Ca marche toujours')
                    }
                    res.redirect('/dashboard/profil')
                })
                .catch(err => {
                    res.status(400);
                });
        })
    })



    app.post("/dashbord/changepassword", permissions.can('access admin page'), (req, res) => {

        req.body.password = bcrypt.hashSync(req.body.password);
        user.findByIdAndUpdate(req.user, {
            $set: {
                "local.password": req.body.password

            }
        }, {
            new: true
        }, (err, user) => {
            user.save()
        })
        res.redirect('/dashboard/profil')

    })



    // PANEL ADMIN (PERFECT TOO)
    app.get('/dashboard', permissions.can('access admin page'), (req, res) => {
        article.find((err, article) => {
            res.render('dashboard', {
                article: article,
                layout: 'layoutAdmin'
            })
        })
    });

    app.get('/dashboard/createarticle', permissions.can('access admin page'), (req, res) => {
        res.render('createarticle', {
            layout: 'layoutAdmin'
        });
    });


    app.get('/dashboard/listearticle', permissions.can('access admin page'), (req, res) => {
        article.find({}, function (err, article) {
            res.render('listearticle.ejs', {
                article: article,
                layout: 'layoutAdmin'
            })
        })

    })


    // CREATE ARTICLE OR DRAFT COPY PANEL ADMIN 
    app.post('/dashbord/createbrouillon', permissions.can('access admin page'), upload.single('img'), (req, res) => {
        var fileToUpload = req.file;
        var target_path = 'public/images/' + fileToUpload.originalname;
        var tmp_path = fileToUpload.path;
        let myData = new article({
            img: fileToUpload.originalname,
            title: req.body.title,
            date: req.body.date,
            preview: req.body.preview,
            content: req.body.content,
            brouillon: true
        });

        myData
            .save()
            .then(item => {
                var src = fs.createReadStream(tmp_path);
                var dest = fs.createWriteStream(target_path);
                src.pipe(dest);
                //delete temp file
                fs.unlink(tmp_path);
                src.on('end', () => {
                    res.redirect("/dashboard");
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


    app.post('/dashboard/listearticlepush/:id', permissions.can('access admin page'), upload.single('img'), (req, res) => {
        // Create let for img
        let fileToUpload = req.file;
        let target_path;
        let tmp_path;
        let img_path;
        if (fileToUpload != undefined || fileToUpload != null) {
            console.log('file est defini')
            target_path = 'public/images/' + fileToUpload.originalname;
            tmp_path = fileToUpload.path;
            img_path = fileToUpload.originalname;

        } else {
            console.log('pas ok')
            img_path = req.body.img;
        }
        article.findByIdAndUpdate(req.params.id, {
            $set: {
                title: req.body.title,
                date: req.body.date,
                content: req.body.content,
                img: img_path,
                brouillon: false
            }
        }, {
            new: true
        }, (err, article) => {
            article.save().then(item => {
                    // console.log('Ca marche')
                    if (fileToUpload != undefined || fileToUpload != null) {
                        let src = fs.createReadStream(tmp_path);
                        let dest = fs.createWriteStream(target_path);
                        src.pipe(dest);
                        //delete temp file
                        fs.unlink(tmp_path);
                        console.log('Ca marche toujours')
                    }
                    res.redirect('/dashboard/listearticle')
                })
                .catch(err => {
                    res.status(400);
                });

        })
    })

    // SAVE DRAFT COPY 

    app.get('/dashboard/listearticleUpdate/:id', permissions.can('access admin page'), (req, res) => {
        article.find((err, article) => {
            res.render('listearticleUpdate', {
                layout: 'layoutAdmin',
                article: req.params.id,
                article: article.filter((article) => {
                    return article.id == req.params.id
                })[0]
            })
        })
    })

    app.post('/dashboard/listearticleUpdate/:id', permissions.can('access admin page'), upload.single('img'), (req, res) => {
        // Create let for img
        let fileToUpload = req.file;
        let target_path;
        let tmp_path;
        let img_path;
        if (fileToUpload != undefined || fileToUpload != null) {
            console.log('file est defini')
            target_path = 'public/images/' + fileToUpload.originalname;
            tmp_path = fileToUpload.path;
            img_path = fileToUpload.originalname;

        } else {
            console.log('pas ok')
            img_path = req.body.img;
        }
        article.findByIdAndUpdate(req.params.id, {
            $set: {
                title: req.body.title,
                date: req.body.date,
                content: req.body.content,
                img: img_path,
            }
        }, {
            new: true
        }, (err, article) => {
            article.save().then(item => {
                    // console.log('Ca marche')
                    if (fileToUpload != undefined || fileToUpload != null) {
                        let src = fs.createReadStream(tmp_path);
                        let dest = fs.createWriteStream(target_path);
                        src.pipe(dest);
                        //delete temp file
                        fs.unlink(tmp_path);
                        console.log('Ca marche toujours')
                    }
                    res.redirect('/dashboard/listearticle')
                })
                .catch(err => {
                    res.status(400);
                });

        })
    })


    //REMOVE DRAFT COPY ARTICLE 

    app.get('/dashboard/listearticleSup/:id/delete', permissions.can('access admin page'), (req, res) => {
        article.remove({
            _id: req.params.id
        }, (err, delData) => {
            res.redirect("/dashboard/listearticle");
        })
    })


    // CREATE ARTICLE PANEL ADMIN
    app.post('/dashboard/createarticle', permissions.can('access admin page'), upload.single('img'), (req, res) => {
        var fileToUpload = req.file;
        var target_path = 'public/images/' + fileToUpload.originalname;
        var tmp_path = fileToUpload.path;
        let myData = new article({
            img: fileToUpload.originalname,
            title: req.body.title,
            date: req.body.date,
            preview: req.body.preview,
            content: req.body.content

        });
        myData
            .save()
            .then(item => {
                var src = fs.createReadStream(tmp_path);
                var dest = fs.createWriteStream(target_path);
                src.pipe(dest);
                //delete temp file
                fs.unlink(tmp_path);
                src.on('end', () => {
                    res.redirect("/dashboard");
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

    // UPDATE ARTICLE PANEL ADMIN
    app.get('/dashboard/updatearticle/:id', permissions.can('access admin page'), (req, res) => {
        article.find((err, article) => {
            res.render('updatearticle', {
                layout: 'layoutAdmin',
                article: req.params.id,
                article: article.filter((article) => {
                    return article.id == req.params.id
                })[0]
            })
        })
    })

    app.post('/dashboard/updatearticle/:id', permissions.can('access admin page'), upload.single('img'), (req, res) => {
        // Create let for img
        let fileToUpload = req.file;
        let target_path;
        let tmp_path;
        let img_path;
        if (fileToUpload != undefined || fileToUpload != null) {
            console.log('file est defini')
            target_path = 'public/images/' + fileToUpload.originalname;
            tmp_path = fileToUpload.path;
            img_path = fileToUpload.originalname;

        } else {
            console.log('pas ok')
            img_path = req.body.img;
        }
        article.findByIdAndUpdate(req.params.id, {
            $set: {
                title: req.body.title,
                date: req.body.date,
                content: req.body.content,
                img: img_path
            }
        }, {
            new: true
        }, (err, article) => {
            article.save().then(item => {
                    // console.log('Ca marche')
                    if (fileToUpload != undefined || fileToUpload != null) {
                        let src = fs.createReadStream(tmp_path);
                        let dest = fs.createWriteStream(target_path);
                        src.pipe(dest);
                        //delete temp file
                        fs.unlink(tmp_path);
                        console.log('Ca marche toujours')
                    }
                    res.redirect('/dashboard')
                })
                .catch(err => {
                    res.status(400);
                });

        })
    })

    // DELETE ARTICLE PANEL ADMIN

    app.get('/dashboard/article/:id/delete', permissions.can('access admin page'), (req, res) => {
        article.remove({
            _id: req.params.id
        }, (err, delData) => {
            res.redirect("/dashboard");
        })
    })

}