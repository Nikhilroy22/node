const sqlite = require('node:sqlite');
const path = require('path');
const pp = path.join(__dirname, 'app.db');
const db = new sqlite.DatabaseSync(pp);

// CREATE TABLE
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    age INTEGER
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    Amount decimal(10,2) NOT NULL DEFAULT 500.00
  )
`);

/* Create table */
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
module.exports = {db}