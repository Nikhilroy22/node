// db.js
const initSqlJs = require('sql.js');
const fs = require('fs');

async function loadDatabase(path) {
  const SQL = await initSqlJs();

  let db;
  if (fs.existsSync(path)) {
    const filebuffer = fs.readFileSync(path);
    db = new SQL.Database(filebuffer);
  } else {
    db = new SQL.Database(); // নতুন ইন-মেমোরি ডাটাবেস
  }
  return db;
}

async function saveDatabase(db, path) {
  const data = db.export();
  fs.writeFileSync(path, Buffer.from(data));
}

async function example() {
  const db = await loadDatabase('mydb.sqlite');

  // টেবিল তৈরি (যদি না থাকে)
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );`);

  // ইনসার্ট ডাটা
  db.run("INSERT INTO users (name) VALUES (?);", ["Alice"]);

  // সিলেক্ট করুন
  const res = db.exec("SELECT * FROM users;");
  console.log('Users:', JSON.stringify(res, null, 2));

  // সেভ করুন
  await saveDatabase(db, 'mydb.sqlite');
}

module.exports = { loadDatabase, saveDatabase, example };