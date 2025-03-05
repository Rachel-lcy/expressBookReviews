const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
const { username, password } = req.body; // 从请求体获取用户名和密码

    // 检查是否提供了用户名和密码
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // 检查用户名是否已存在
    if (users.some(user => user.username === username)) {
        return res.status(409).json({ message: "Username already exists. Please choose another one." });
    }

    // 注册新用户
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
  const { isbn } = req.params; // 从请求参数中获取 ISBN
    const book = books[isbn]; // 在 books 对象中查找该 ISBN

    if (!book) {
        return res.status(404).json({ message: "Book not found." }); // 如果未找到，返回 404
    }

    return res.status(200).json(book); // 返回书籍详情
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
  const { isbn } = req.params; // 获取请求参数中的 ISBN
    const book = books[isbn]; // 查找书籍

    if (!book) {
        return res.status(404).json({ message: "Book not found." }); // 书籍不存在
    }

    const reviews = book.reviews; // 获取书评

    if (Object.keys(reviews).length === 0) {
        return res.status(404).json({ message: "No reviews available for this book." });
    }

    return res.status(200).json(reviews); // 返回书评

});

module.exports.general = public_users;
