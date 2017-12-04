const mongoose = require('mongoose');

let articleSchema = new mongoose.Schema ({
    img: String,
    title: String,  
    date : String,
    content : String,
    
})

let article = mongoose.model('article', articleSchema)
module.exports = article; 