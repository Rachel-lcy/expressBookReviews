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

  // 检查是否提供了用户名和密码
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
  }

  // 验证用户身份
  if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid username or password." });
  }

  // 生成 JWT 令牌
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

  // 存储 JWT 令牌到 session
  req.session.token = token;  

  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});

  const { isbn } = req.params; // 获取请求中的 ISBN
  const { review } = req.query; // 获取查询参数中的 review
  const token = req.session.token; // 从 session 获取 JWT 令牌
  console.log(token);
 // 检查用户是否已登录
 if (!token) {
  return res.status(401).json({ message: "Unauthorized. Please log in first." });
}
 // 解析 JWT 令牌以获取用户名
 jwt.verify(token, SECRET_KEY, (err, decoded) => {
  if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
  }

  const username = decoded.username;

  // 检查 ISBN 是否存在
  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
  }

  // 确保书籍的 reviews 对象存在
  if (!books[isbn].reviews) {
      books[isbn].reviews = {};
  }

  // 添加或更新书评
  books[isbn].reviews[username] = review;

  return res.status(200).json({ 
      message: "Review added/updated successfully", 
      reviews: books[isbn].reviews 
  });
});

});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params; // 获取请求中的 ISBN
  const token = req.session.token; // 从 session 获取 JWT 令牌

  // 检查用户是否已登录
  if (!token) {
      return res.status(401).json({ message: "Unauthorized. Please log in first." });
  }

  // 解析 JWT 令牌以获取用户名
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
          return res.status(403).json({ message: "Invalid or expired token." });
      }

      const username = decoded.username;

      // 检查 ISBN 是否存在
      if (!books[isbn]) {
          return res.status(404).json({ message: "Book not found." });
      }

      // 检查是否存在评论对象
      if (!books[isbn].reviews || !books[isbn].reviews[username]) {
          return res.status(404).json({ message: "No review found for this book by the user." });
      }

      // 删除该用户的评论
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
