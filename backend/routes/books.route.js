const express = require('express')
const router = express.Router()
const Book = require('../models/Books')

router.get('/getbooks', async (req, res) => {
    const books = await Book.find();
    res.json({success: true, books});
})

router.post('/addbook', async (req, res) => {
    const body = req.body;
    const book = new Book(body);

    const existingBook = await Book.findOne({bookname: body.bookname, bookauthor: body.bookauthor});

    if(existingBook){
        return res.status(404).send({ message: "Book already exists" });
    }

    const savedBook = await book.save();

    res.json({success: true, message: "Book added successfully", savedBook});
})

router.put('/updatebook/:id', async (req, res) => {
    const newBook = {};

    if(req.body.bookname) newBook.bookname = req.body.bookname;
    if(req.body.bookauthor) newBook.bookauthor = req.body.bookauthor;
    if(req.body.bookprice) newBook.bookprice = req.body.bookprice;
    if(req.body.bookgenre) newBook.bookgenre = req.body.bookgenre;
    if(req.body.bookimage) newBook.bookimage = req.body.bookimage;

    let book = await Book.findById(req.params.id);

    if(!book){
        return res.status(404).send({message: "Book Not Found"});
    }

    book = await Book.findByIdAndUpdate(req.params.id, {$set: newBook}, {new: true});

    res.json({success: true, message: "Book updated successfully", book});

})

router.delete('/deletebook/:id', async (req, res) => {

    const book = await Book.findById(req.params.id);

    if(!book){
        return res.status(404).send({message: "Book Not Found"});
    }

    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    res.json({success: true, message: "Book deleted successfully", deletedBook});

})

router.post('/searchbooks', async (req, res) => {

    const searchItem = req.body;

    const book = await Book.findOne({bookname: searchItem.bookname, bookauthor: searchItem.bookauthor});

    if(book.length === 0){
        return res.status(404).send({message: "Book Not Found"});
    }

    res.json({success: true, book});
})


module.exports = router