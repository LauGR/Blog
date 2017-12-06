const mongoose = require('mongoose');

let articleSchema = new mongoose.Schema ({
    _id : String,
    img: String,
    title: String,  
    date : String,
    content : String,
    preview: String,
    brouillon : {type: Boolean , default : false}
    
})

let article = mongoose.model('articles', articleSchema)
module.exports = article; 