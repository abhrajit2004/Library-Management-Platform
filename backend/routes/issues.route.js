const express = require('express')
const router = express.Router()
const Issue = require('../models/Issue')
const Book = require('../models/Books')
const User = require('../models/User')

router.post('/issuebook/:id', async (req, res) => {

    const id = req.params.id;
    
    const user = await User.findOne({email: req.body.issuedTo});

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const book = await Book.findOne({ _id: id});

    if(!book){
        return res.status(404).json({ message: 'Book not found' });
    }

    const existingIssue = await Issue.findOne({ bookId: id, status: 'issued', issuedTo: req.body.issuedTo });

    if (existingIssue) {
        return res.status(400).json({ message: `This book is already issued to ${req.body.issuedTo}` });
    }


    const issue = new Issue({
        bookname: book.bookname,
        bookauthor: book.bookauthor,
        bookId: book._id,
        status: 'issued',
        issuedTo: req.body.issuedTo
    });

    const newIssue = await issue.save();

    if(newIssue){
        return res.status(200).json({ message: `Book issued successfully to ${req.body.issuedTo}` });
    }
})

router.post('/returnbook/:id', async (req, res) => {

    const id = req.params.id;
     
    const user = await User.findOne({email: req.body.issuedTo});

    if (!user) {
        return res.status(404).json({ message: 'User not found!' });
    }

    const book = await Book.findOne({ _id: id});

    if(!book){
        return res.status(404).json({ message: 'Book not found!' });
    }

    let existingIssue = await Issue.findOne({ _id: req.body.issueId, bookId: id, status: 'returned', issuedTo: req.body.issuedTo });

    if (existingIssue) {
        return res.status(400).json({ message: `This book is already returned by ${req.body.issuedTo}` });
    }

   let updatedIssue = await Issue.findByIdAndUpdate(req.body.issueId, { status: 'returned' }, { new: true });

    if(updatedIssue){
        return res.status(200).json({ message: `Book returned successfully by ${req.body.issuedTo}` });
    }
    else{
        return res.status(400).json({ message: 'Book return failed!' });
    }
})

module.exports = router;