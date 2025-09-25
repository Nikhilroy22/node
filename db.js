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
      name TEXT NOT NULL
    );
  `);

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

async function createUser(name) {
  const db = await loadDb();
  db.run("INSERT INTO users (name) VALUES (?);", [name]);

  // Save DB to file
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

module.exports = { getUsers, createUser };