const permissions = require('../../config/permissions');
const multer = require('multer');
const fs = require('fs');
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
    
    // PANEL ADMIN 
    app.get('/dashboard', permissions.can('access admin page'), (req, res) => {
        article.find((err, article) => {
            res.render('dashboard', {
                article: article,
                layout: 'layoutAdmin'
            })
        })
    });
    app.get('/dashboard/article/:id/delete', permissions.can('access admin page'), (req, res) => {
        article.remove({
            _id: req.params.id
        }, (err, delData) => {
            res.redirect("/dashboard");
        })
    })
    app.get('/dashboard/createarticle', permissions.can('access admin page'), (req, res) => {
            res.render('createarticle',
                {layout: 'layoutAdmin'
            });
    });


// CREATE ARTICLE PANEL ADMIN
app.post('/dashboard/createarticle', permissions.can('access admin page'),upload.single('img'), (req, res) => {
    var fileToUpload = req.file;
    var target_path = 'public/images/' + fileToUpload.originalname;
    var tmp_path = fileToUpload.path;
    let myData = new article({
        img: fileToUpload.originalname,
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
app.post('/dashboard/updatearticle/:id', permissions.can('access admin page'),upload.single('img'), (req, res) => {
    // Create Var for img
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

}