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

    // PROFILE ADMIN 
    app.get('/dashboard/profile', permissions.can('access admin page'), (req, res) => {
        user.find((err, user) => {
            res.render('profile', {
                user: user,
                layout: 'layoutAdmin'
            })
        })
    })

    // UPDATE PROFILE ADMIN
    app.get('/dashboard/updateprofile', permissions.can('access admin page'), (req, res) => {
        res.render('updateProfile', {
            user: req.user,
            layout: 'layoutAdmin'

        })
    })

    app.post('/dashboard/updateprofile', permissions.can('access admin page'), upload.single('img'), (req, res) => {
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
                "local.avatar": img_path
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
                    res.redirect('/dashboard/profile')
                })
                .catch(err => {
                    res.status(400);
                });
        })
    })

    // change password 
    app.post("/dashboard/changepassword", permissions.can('access admin page'), (req, res) => {
        // hash password before update
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
        res.redirect('/dashboard/profile')

    })



    // LIST ARTICLES
    app.get('/dashboard', permissions.can('access admin page'), (req, res) => {
        article.find((err, article) => {
            res.render('dashboard', {
                article: article,
                layout: 'layoutAdmin'
            })
        })
    });

    // CREATE  DRAFT COPY PANEL ADMIN 
    app.get('/dashboard/createarticle', permissions.can('access admin page'), (req, res) => {
        res.render('createArticle', {
            layout: 'layoutAdmin'
        });
    });

    app.post('/dashbord/createbrouillon', permissions.can('access admin page'), upload.single('img'), (req, res) => {
        let fileToUpload = req.file;
        let target_path = 'public/images/' + fileToUpload.originalname;
        let tmp_path = fileToUpload.path;
        let myData = new article({
            img: fileToUpload.originalname,
            title: req.body.title,
            url: req.body.url,
            date: req.body.date,
            preview: req.body.preview,
            content: req.body.content,
            brouillon: true
        });
        myData
            .save()
            .then(item => {
                let src = fs.createReadStream(tmp_path);
                let dest = fs.createWriteStream(target_path);
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

    // CREATE ARTICLE PANEL ADMIN
    app.post('/dashboard/createarticle', permissions.can('access admin page'), upload.single('img'), (req, res) => {
        let fileToUpload = req.file;
        let target_path = 'public/images/' + fileToUpload.originalname;
        let tmp_path = fileToUpload.path;
        let myData = new article({
            img: fileToUpload.originalname,
            title: req.body.title,
            url: req.body.url,
            date: req.body.date,
            preview: req.body.preview,
            content: req.body.content

        });
        myData
            .save()
            .then(item => {
                let src = fs.createReadStream(tmp_path);
                let dest = fs.createWriteStream(target_path);
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
            res.render('updateArticle', {
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
                url: req.body.url,
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



    // LIST DRAFT COPY PANEL ADMIN
    app.get('/dashboard/listdraftcopy', permissions.can('access admin page'), (req, res) => {
        article.find({}, function (err, article) {
            res.render('listdraftCopy.ejs', {
                article: article,
                layout: 'layoutAdmin'
            })
        })

    })

    // PUBLISH DRAFT COPY ON LIST ARTICLES
    app.post('/dashboard/listdraftcopypush/:id', permissions.can('access admin page'), upload.single('img'), (req, res) => {
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
                    res.redirect('/dashboard/listdraftcopy')
                })
                .catch(err => {
                    res.status(400);
                });

        })
    })

    // SAVE MODIFICATIONS DRAFT COPY 
    app.get('/dashboard/listdraftcopyupdate/:id', permissions.can('access admin page'), (req, res) => {
        article.find((err, article) => {
            res.render('listdraftcopyUpdate', {
                layout: 'layoutAdmin',
                article: req.params.id,
                article: article.filter((article) => {
                    return article.id == req.params.id
                })[0]
            })
        })
    })

    app.post('/dashboard/listdraftcopyupdate/:id', permissions.can('access admin page'), upload.single('img'), (req, res) => {
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
                    res.redirect('/dashboard/listdraftcopy')
                })
                .catch(err => {
                    res.status(400);
                });
        })
    })


    //REMOVE DRAFT COPY 
    app.get('/dashboard/listdraftcopysupp/:id/delete', permissions.can('access admin page'), (req, res) => {
        article.remove({
            _id: req.params.id
        }, (err, delData) => {
            res.redirect("/dashboard/listdraftcopy");
        })
    })


}