const mongoose = require('mongoose');

let articleSchema = new mongoose.Schema ({
    _id:String,
    img: String,
    title: String,  
    date : String,
    content : String,
    
})

let article = mongoose.model('articles', articleSchema)
module.exports = article; 