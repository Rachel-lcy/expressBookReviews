const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
const { username, password } = req.body; // Get username and password from the request body

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if the username already exists
    if (users.some(user => user.username === username)) {
        return res.status(409).json({ message: "Username already exists. Please choose another one." });
    }

    // Register a new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully!" });


});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
 // return res.status(300).json({message: "Yet to be implemented"});
 return res.status(200).send(JSON.stringify(books, null, 4)); 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const { isbn } = req.params; // Get the ISBN from the request parameters
    const book = books[isbn]; // Look up the ISBN in the books object

    if (!book) {
        return res.status(404).json({ message: "Book not found." }); // If not found, return 404
    }

    return res.status(200).json(book); // Return to book details
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
 // return res.status(300).json({message: "Yet to be implemented"});
 const { author } = req.params; 
 let booksList  = [];
 for(let key in books){ 
  if(books[key].author.toLowerCase() === author.toLowerCase() ){
    booksList.push(books[key]);
  }
 }
  if(booksList.length === 0){
    return res.status(404).json({ message: "No books found for this author." });
  } 
  return res.status(200).json(booksList);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const { title } = req.params; 
 let booksList  = [];
 for(let key in books){ 
  if(books[key].title.toLowerCase() === title.toLowerCase() ){
    booksList.push(books[key]);
  }
 }
  if(booksList.length === 0){
    return res.status(404).json({ message: "No books found for this author." });
  } 
  return res.status(200).json(booksList);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const { isbn } = req.params; // Get the ISBN in the request parameter
    const book = books[isbn]; // Find Books

    if (!book) {
        return res.status(404).json({ message: "Book not found." }); // Book does not exist
    }

    const reviews = book.reviews; // Get book reviews

    if (Object.keys(reviews).length === 0) {
        return res.status(404).json({ message: "No reviews available for this book." });
    }

    return res.status(200).json(reviews); // return book reviews

});

module.exports.general = public_users;
