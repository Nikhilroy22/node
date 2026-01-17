// server.js
const express = require('express');
require('dotenv').config();

const http = require('http');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
global.chalk = chalk;

const session = require('express-session');
const flash = require('connect-flash');
const JSONFileStore = require('./helper/jsonFileStore'); // Custom JSON session store
const FileStore = require('session-file-store')(session);

const { Server } = require('socket.io');

// Controllers / Socket handlers
const socketHandler = require('./socket/socketHandler'); // Crash socket
const PrivateChat = require('./socket/PrivateChat'); // Private chat socket

// Routes
const webRoutes = require('./routes/webRoutes');
const AdminRoutes = require('./routes/AdminRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server);



/* =========================
   Session + Flash Config
========================= */
const sessionMiddleware = session({
  store: new JSONFileStore({ filePath: './helper/sessions.json',
 // ttl: 60,
//  reapInterval: 60,     // প্রতি 60 সেকেন্ডে expired sessions clean
 // reapOnStart: true,  // app start হলে expired sessions sweep করবে
 // retries: 1
  }),
  secret: 'secret123',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, 
 // maxAge: 1000 * 60  // 1 minute = 60000ms
  }
});

app.use(sessionMiddleware);
app.use(flash());

// Make flash & session variables available in all views
app.use((req, res, next) => {
  res.locals.dev = 'dev';
  //res.locals.errors = req.flash('errorss')[0] || {};
  //res.locals.oldInput = req.flash('oldInput')[0] || {};
  res.locals.session = req.session || {};
 // res.locals.errors = req.session || {};
  //res.locals.oldInput = req.session || {};
  next();
});

/* =========================
   View Engine (EJS)
========================= */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* =========================
   Middleware
========================= */
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.json()); // Parse JSON
app.use(express.static(path.join(__dirname, 'public'))); // Static files

/* =========================
   Routes
========================= */
app.use('/admin', AdminRoutes);
app.use('/', webRoutes);

/* =========================
   Socket.IO Handlers
========================= */
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });


// socketHandler(io, sessionMiddleware); // Crash socket (if needed)
//PrivateChat(io, sessionMiddleware); // Private chat socket

/* =========================
   Start Server
========================= */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});