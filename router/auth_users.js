const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = {};

const isValid = (username) => {
    return users.hasOwnProperty(username);
};

const authenticatedUser = (username, password) => {
    return users[username] && users[username].password === password;
};

// Task 7: User login and JWT authentication
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const accessToken = jwt.sign({ username }, "your_jwt_secret_key", { expiresIn: "1h" });
    return res.status(200).json({ message: "Login successful", accessToken });
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(authHeader.split(" ")[1], "your_jwt_secret_key");
        const username = decoded.username;
        if (!books[isbn]) {
            return res.status(404).json({ message: "Book not found" });
        }
        if (!books[isbn].reviews) {
            books[isbn].reviews = {};
        }
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review added/updated successfully" });
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(authHeader.split(" ")[1], "your_jwt_secret_key");
        const username = decoded.username;
        if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
            return res.status(404).json({ message: "Review not found" });
        }
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
