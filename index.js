const express = require('express');
require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');

const http = require('http');
const path = require('path');
const JSONFileStore = require('./helper/jsonFileStore'); // যদি আলাদা ফাইল করো

const { Server } = require('socket.io');
//crash
const socketHandler = require('./socket/socketHandler'); // import
// Private Chat socket 
const PrivateChat = require('./socket/PrivateChat');

const fs = require("fs");

const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
// ✅ Import External Route
const webRoutes = require('./routes/webRoutes');
const AdminRoutes = require('./routes/AdminRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server);



// Session + Flash config
const sessionMiddleware = session({
  store: new JSONFileStore({ filePath: './helper/sessions.json' }),
  secret: 'secret123',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true
  }
})
app.use(sessionMiddleware);
app.use(flash());

// Make flash variables available to all views
app.use((req, res, next) => {
  res.locals.dev = 'devv';
  const flashErrors = req.flash('errorss');
  res.locals.errors = flashErrors.length > 0 ? flashErrors[0] : {};
  res.locals.oldInput = req.flash('oldInput')[0] || {};
  res.locals.session = req.session || {};
  //ccc = "Janu";
  next();
});


// EJS সেট করা
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true })); // form data
app.use(express.json()); // JSON data

// Static ফাইল
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Import Telegram Webhook system
//require('./helper/TelegramBot')(app);

// ✅ Use external routes
app.use('/admin', AdminRoutes);
app.use('/', webRoutes);




// 500 Error Handler (যদি কোডে কোনো সমস্যা হয়)
//app.use((err, req, res, next) => {
  //console.error('Internal Error:', err.stack);
//  res.status(500).render('500');
//});


// Socket.IO handler আলাদা ফাইল থেকে কল
//socketHandler(io, sessionMiddleware);

// Private Chat Socket.io
PrivateChat(io, sessionMiddleware);

//Server Start
server.listen(3000, () => {
  console.log('Server  http://localhost:3000');
  //console.log(process.versions);
});