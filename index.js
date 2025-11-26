// server/index.js
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root', // Change to your MySQL username
  password: '', // Change to your MySQL password
  database: 'pos-system' // Make sure this database exists
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Create users table (updated structure to match your schema)
db.query(`CREATE TABLE IF NOT EXISTS users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'cashier') DEFAULT 'cashier',
  full_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
  if (err) console.error('Error creating users table:', err);
  else console.log('Users table ready');
});

// Signup
app.post('/signup', (req, res) => {
  const { username, password, full_name, role = 'cashier' } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  db.query(
    `INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)`, 
    [username, hashedPassword, full_name, role], 
    (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(500).json({ message: 'Username already exists' });
        }
        return res.status(500).json({ message: err.message });
      }
      res.json({ 
        message: 'User created successfully', 
        user_id: results.insertId 
      });
    }
  );
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  db.query(
    `SELECT user_id, username, password, role, full_name FROM users WHERE username = ?`, 
    [username], 
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      
      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = results[0];
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      
      if (!passwordIsValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      const token = jwt.sign(
        { 
          id: user.user_id, 
          username: user.username,
          role: user.role 
        }, 
        'secretkey', 
        { expiresIn: 86400 }
      );

      res.json({ 
        message: 'Login successful', 
        token,
        user: {
          id: user.user_id,
          username: user.username,
          full_name: user.full_name,
          role: user.role
        }
      });
    }
  );
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
  
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token' });
    }
    
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// Protected route example
app.get('/profile', verifyToken, (req, res) => {
  db.query(
    `SELECT user_id, username, role, full_name, created_at FROM users WHERE user_id = ?`,
    [req.userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      if (results.length === 0) return res.status(404).json({ message: 'User not found' });
      
      res.json({ user: results[0] });
    }
  );
});

// Get all users (admin only example)
app.get('/users', verifyToken, (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  db.query(
    `SELECT user_id, username, role, full_name, created_at FROM users`,
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ users: results });
    }
  );
});

// Test route
app.get('/', (req, res) => res.send('Server is running with MySQL!'));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});