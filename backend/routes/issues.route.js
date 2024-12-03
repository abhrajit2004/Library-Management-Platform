const express = require('express')
const router = express.Router()
const Issue = require('../models/Issue')
const Book = require('../models/Books')
const User = require('../models/User')

router.get('/getissueshistory', async (req, res) => {
    const issues = await Issue.find({});
    res.json({history: issues.reverse()});
});

router.post('/issuebook/:id', async (req, res) => {

    const id = req.params.id;

    const user = await User.findOne({ email: req.body.issuedTo });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const book = await Book.findOne({ _id: id });

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    const existingIssue = await Issue.findOne({ bookId: id, status: 'issued', issuedTo: req.body.issuedTo });

    if (existingIssue) {
        return res.status(400).json({ success: false, message: `This book is already issued to ${req.body.issuedTo}`, existingIssue });
    }

    let returnedIssue = await Issue.findOne({ bookId: id, status: 'returned', issuedTo: req.body.issuedTo });

    if (returnedIssue) {
        await Issue.deleteOne({ _id: returnedIssue._id });
    }

    const issue = new Issue({
        bookname: book.bookname,
        bookauthor: book.bookauthor,
        bookId: book._id,
        status: 'issued',
        issuedTo: req.body.issuedTo
    });

    const newIssue = await issue.save();

    if (newIssue) {
        return res.status(200).json({ success: true, message: `Book issued successfully to ${req.body.issuedTo}`, newIssue });
    }
})

router.post('/returnbook/:id', async (req, res) => {

    const id = req.params.id;

    const user = await User.findOne({ email: req.body.issuedTo });

    if (!user) {
        return res.status(404).json({ message: 'User not found!' });
    }

    const book = await Book.findOne({ _id: id });

    if (!book) {
        return res.status(404).json({ message: 'Book not found!' });
    }

    let existingIssue = await Issue.findOne({ bookId: id, status: 'returned', issuedTo: req.body.issuedTo });

    if (existingIssue) {
        return res.status(400).json({ success: false, message: `This book is already returned by ${req.body.issuedTo}`, existingIssue });
    }

    let borrowedIssue = await Issue.findOne({ bookId: id, status: 'issued', issuedTo: req.body.issuedTo });

    if (borrowedIssue) {
        await Issue.deleteOne({ _id: borrowedIssue._id });
    }
    
    const issue = new Issue({
        bookname: book.bookname,
        bookauthor: book.bookauthor,
        bookId: book._id,
        status: 'returned',
        issuedTo: req.body.issuedTo
    });

    const newIssue = await issue.save();

    if (newIssue) {
        return res.status(200).json({ success: true, message: `Book returned successfully by ${req.body.issuedTo}`, newIssue });
    }

})

module.exports = router;