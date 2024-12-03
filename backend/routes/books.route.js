const express = require('express')
const router = express.Router()
const Book = require('../models/Books')

router.get('/getbooks', async (req, res) => {
    try {
        const books = await Book.find();
        res.json({ success: true, books });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });

    }
})

router.post('/addbook', async (req, res) => {
    try {
        const body = req.body;
        const book = new Book(body);

        const existingBook = await Book.findOne({ bookname: body.bookname, bookauthor: body.bookauthor });

        if (existingBook) {
            return res.status(404).send({ message: "Book already exists" });
        }

        const savedBook = await book.save();

        res.json({ success: true, message: "Book added successfully", savedBook });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });

    }
})

router.put('/updatebook/:id', async (req, res) => {
    try {
        const newBook = {};

        if (req.body.bookname) newBook.bookname = req.body.bookname;
        if (req.body.bookauthor) newBook.bookauthor = req.body.bookauthor;
        if (req.body.bookprice) newBook.bookprice = req.body.bookprice;
        if (req.body.bookgenre) newBook.bookgenre = req.body.bookgenre;
        if (req.body.bookimage) newBook.bookimage = req.body.bookimage;

        let book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).send({ message: "Book Not Found" });
        }

        book = await Book.findByIdAndUpdate(req.params.id, { $set: newBook }, { new: true });

        res.json({ success: true, message: "Book updated successfully", book });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });

    }

})

router.delete('/deletebook/:id', async (req, res) => {

    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).send({ message: "Book Not Found" });
        }

        const deletedBook = await Book.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: "Book deleted successfully", deletedBook });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });

    }

})

router.post('/searchbooks', async (req, res) => {
    try {

        const searchItem = req.body;

        const book = await Book.findOne({ bookname: searchItem.bookname });

        if (!book) {
            return res.status(404).send({ message: "Book Not Found" });
        }

        res.json({ success: true, book });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });

    }
})


module.exports = router