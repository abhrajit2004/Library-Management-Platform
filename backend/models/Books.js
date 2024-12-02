const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BooksSchema = new Schema({
    bookname: {
        type: String,
        required: true
    },
    bookauthor: {
        type: String,
        required: true
    },
    bookprice: {
        type: Number,
        required: true
    },
    bookgenre: {
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    },
    bookimage: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const books = mongoose.model('Books', BooksSchema);

module.exports = books;