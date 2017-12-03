const mongoose = require('mongoose');

let articlesSchema = new mongoose.Schema ({
    title: String,  
    date : String,
    content : String,
    
})

let articles = mongoose.model('articles', articlesSchema)
module.exports = articles; 