const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const SECRET_KEY = "fingerprint_customer"; 
let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
  }

  // Verify user identity
  if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid username or password." });
  }

  // Generate a JWT Token
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

  // Store JWT token in session
  req.session.token = token;  

  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});

  const { isbn } = req.params; // Get the ISBN in the request
  const { review } = req.query; // Get the review in the query parameter
  const token = req.session.token; // Get the JWT token from the session
  console.log(token);
 // Check if the user is logged in
 if (!token) {
  return res.status(401).json({ message: "Unauthorized. Please log in first." });
}
 // Parse the JWT token to get the username
 jwt.verify(token, SECRET_KEY, (err, decoded) => {
  if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
  }

  const username = decoded.username;

  // Check if ISBN exists
  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
  }

  // Ensure that the book's reviews object exists
  if (!books[isbn].reviews) {
      books[isbn].reviews = {};
  }

  // Add or update a book review
  books[isbn].reviews[username] = review;

  return res.status(200).json({ 
      message: "Review added/updated successfully", 
      reviews: books[isbn].reviews 
  });
});

});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params; // Get the ISBN in the request
  const token = req.session.token; // Get the JWT token from the session

  // Check if the user is logged in
  if (!token) {
      return res.status(401).json({ message: "Unauthorized. Please log in first." });
  }

  // Parse the JWT token to get the username
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
          return res.status(403).json({ message: "Invalid or expired token." });
      }

      const username = decoded.username;

      // Check if ISBN exists
      if (!books[isbn]) {
          return res.status(404).json({ message: "Book not found." });
      }

      // Check if a comment object exists
      if (!books[isbn].reviews || !books[isbn].reviews[username]) {
          return res.status(404).json({ message: "No review found for this book by the user." });
      }

      // Delete this user's comment
      delete books[isbn].reviews[username];

      return res.status(200).json({
          message: "Review deleted successfully.",
          reviews: books[isbn].reviews
      });
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
