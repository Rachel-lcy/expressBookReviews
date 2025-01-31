const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (users[username]) {
        return res.status(409).json({ message: "Username already exists" });
    }
    users[username] = { password };
    return res.status(201).json({ message: "User registered successfully" });
});

// Task 10: Get the list of books using async/await
public_users.get('/', async (req, res) => {
    try {
        const response = await Promise.resolve(books);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

// Task 11: Get book details based on ISBN using async/await
    public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const { isbn } = req.params;
        const book = await Promise.resolve(books[isbn]);
        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching book by ISBN" });
    }
});

// Task 12: Get book details based on author using async/await
public_users.get('/author/:author', async (req, res) => {
    try {
        const { author } = req.params;
        const filteredBooks = await Promise.resolve(Object.values(books).filter(book => book.author === author));
        if (filteredBooks.length > 0) {
            res.status(200).json(filteredBooks);
        } else {
            res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author" });
    }
});


// Task 13: Get book details based on title using async/await
public_users.get('/title/:title', async (req, res) => {
    try {
        const { title } = req.params;
        const filteredBooks = await Promise.resolve(Object.values(books).filter(book => book.title === title));
        if (filteredBooks.length > 0) {
            res.status(200).json(filteredBooks);
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title" });
    }
});


// Task 5: Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params;
    if (books[isbn] && books[isbn].reviews) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "No reviews found for this book" });
    }
});

module.exports.general = public_users;