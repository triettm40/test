'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const article = new Schema({
    Title: {
        type: String,
        required: [true, "can't be blank"],
        index: true,
    },
    Content: {
        type: String,
        required: [true, "can't be blank"],
        index: true,
    },
    
});
module.exports = mongoose.model('article', article);