const mysql = require('mysql2');

// Create MySQL connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root', // Replace with your MySQL username
  password: '', // Replace with your MySQL password
  database: 'pos-system'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Create tables (same as your original SQL)
const createTables = `
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS categories (
  category_id int(11) NOT NULL AUTO_INCREMENT,
  category_name varchar(100) NOT NULL,
  PRIMARY KEY (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS users (
  user_id int(11) NOT NULL AUTO_INCREMENT,
  username varchar(50) NOT NULL,
  password varchar(255) NOT NULL,
  role enum('admin','cashier') NOT NULL DEFAULT 'cashier',
  full_name varchar(100) DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  UNIQUE KEY username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
  product_id int(11) NOT NULL AUTO_INCREMENT,
  product_name varchar(150) NOT NULL,
  category_id int(11) DEFAULT NULL,
  price decimal(10,2) NOT NULL,
  stock int(11) NOT NULL DEFAULT 0,
  barcode varchar(50) DEFAULT NULL,
  PRIMARY KEY (product_id),
  KEY category_id (category_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sales (
  sale_id int(11) NOT NULL AUTO_INCREMENT,
  user_id int(11) NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  payment_amount decimal(10,2) NOT NULL,
  change_amount decimal(10,2) NOT NULL,
  date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (sale_id),
  KEY user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sale_items (
  sale_item_id int(11) NOT NULL AUTO_INCREMENT,
  sale_id int(11) NOT NULL,
  product_id int(11) NOT NULL,
  quantity int(11) NOT NULL,
  price decimal(10,2) NOT NULL,
  subtotal decimal(10,2) NOT NULL,
  PRIMARY KEY (sale_item_id),
  KEY sale_id (sale_id),
  KEY product_id (product_id),
  FOREIGN KEY (sale_id) REFERENCES sales(sale_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS inventory_logs (
  log_id int(11) NOT NULL AUTO_INCREMENT,
  product_id int(11) NOT NULL,
  qty_change int(11) NOT NULL,
  remark varchar(200) DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (log_id),
  KEY product_id (product_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

// Execute table creation
db.query(createTables, (err, results) => {
  if (err) {
    console.error('Error creating tables:', err);
  } else {
    console.log('Tables created successfully');
  }
});

module.exports = db;