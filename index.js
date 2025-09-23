const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const dbModule = require('./db');
const fs = require("fs");

// ✅ Import External Route
const webRoutes = require('./routes/webRoutes');

dbModule.example()
  .then(() => console.log('database'))
  .catch(console.error);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// EJS সেট করা
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static ফাইল
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Use external routes
app.use('/', webRoutes);

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