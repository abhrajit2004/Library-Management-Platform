const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IssueSchema = new Schema({
    bookname: {
        type: String,
        required: true
    },
    bookauthor: {
        type: String,
        required: true
    },
    bookId:{
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'not issued'
    },
    issuedTo: {
        type: String,
        required: true
    },
    issuedDate: {
        type: Date,
        default: Date.now
    }
})

const issues = mongoose.model('Issue', IssueSchema);

module.exports = issues;