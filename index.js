const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

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