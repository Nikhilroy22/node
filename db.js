// db.js
const initSqlJs = require('sql.js');
const fs = require('fs');

const DB_PATH = 'mydb.sqlite';

async function loadDb() {
  const SQL = await initSqlJs();
  const fileBuffer = fs.existsSync(DB_PATH) ? fs.readFileSync(DB_PATH) : null;
  const db = fileBuffer ? new SQL.Database(fileBuffer) : new SQL.Database();

  // Table তৈরি (যদি না থাকে)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL
    );
  `);
// 👉 যদি ফাইল না থাকে, তাহলে নতুন ফাইল সেভ করে দেবে
 
  return db;
}

async function getUsers() {
  const db = await loadDb();
  const result = db.exec("SELECT * FROM users;");
  const columns = result[0]?.columns || [];
  const rows = result[0]?.values || [];

  return rows.map(row =>
    Object.fromEntries(columns.map((col, i) => [col, row[i]]))
  );
}

async function createUser(username, password) {
  const db = await loadDb();
  db.run("INSERT INTO users (username, password) VALUES (?, ?);", [username, password]);

  
  const result = db.exec("SELECT last_insert_rowid() as id;");
  const id = result[0].values[0][0];

  // Save DB to file
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
  
  return { id, username };
}

module.exports = { getUsers, createUser };