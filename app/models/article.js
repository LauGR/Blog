const mongoose = require('mongoose');

let articleSchema = new mongoose.Schema ({    
    _id :  String,
    img: String,
    title: String,  
    date : String,
    preview: String,
    content : String,
    brouillon : {type: Boolean , default : false}
    
})

let article = mongoose.model('articles', articleSchema)
module.exports = article; 