const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const initSqlJs = require("sql.js");
const fs = require("fs");

(async () => {
  // SQLite লোড করো
  const SQL = await initSqlJs();

  // ডাটাবেস তৈরি (নতুন)
  const db = new SQL.Database();

  // টেবিল তৈরি
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)");

  // ডাটা ইনসার্ট
  db.run("INSERT INTO users (name, email) VALUES (?, ?)", ["Nikhil", "test@example.com"]);
  db.run("INSERT INTO users (name, email) VALUES (?, ?)", ["Arif", "arif@example.com"]);

  // ডাটা রিড
  const stmt = db.prepare("SELECT * FROM users");
  while (stmt.step()) {
    const row = stmt.getAsObject();
    console.log(row); // {id: 1, name: 'Nikhil', email: 'test@example.com'}
  }

  // ডাটাবেস সেভ করো (binary ফাইলে)
  const data = db.export();
  fs.writeFileSync("mydb.sqlite", Buffer.from(data));
})();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// EJS সেট করা
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static ফাইলের জন্য
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'রিয়েল-টাইম চ্যাট' });
});

// Catch-all 404 handler (must be last)
app.use((req, res, next) => {
  res.status(404).render('404', { url: req.originalUrl });
});


// Socket.IO
io.on('connection', (socket) => {
  console.log('User Connected');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('ইউজার ডিসকানেক্ট');
  });
});

server.listen(3000, () => {
  console.log('Server চলছে: http://localhost:3000');
});