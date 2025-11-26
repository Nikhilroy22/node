// routes/webRoutes.js
const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controller/LoginController');
const SignUpController = require('../controller/SignupController');
const Home = require('../controller/HomeController');
const BetController = require('../controller/BetController');
const BetApiController = require('../controller/BetApiController');
const MessageView = require('../controller/MsgViewController');

// Middleware
const authMiddleware = require('../middleware/authMiddleware');

/* =========================
   Bet Routes
========================= */
router.get('/bet', BetController.bethome);
router.post('/bet', BetController.placeBet);

// Bet API Get by ID
router.get('/bet/:id', BetApiController.ParamsBet);

// Bet API Response
router.get('/res', BetController.betapi);
router.get('/resview/:matchid', BetApiController.betapiview);

/* =========================
   Crash Page
========================= */
router.get('/crash', (req, res) => {
  res.render('crash', { user: req.session.user });
});

/* =========================
   Home Page
========================= */
router.get('/', Home.HomePage);

/* =========================
   Authentication Routes
========================= */
// Login
router.get('/login', authMiddleware, authController.showLogin);
router.post('/login', authMiddleware, authController.loginUser);

// Sign Up
router.get('/signup', authMiddleware, SignUpController.SignUp);
router.post('/signup', authMiddleware, SignUpController.SignUpPost);

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('সেশন মুছতে সমস্যা হয়েছে');
    }

    // Clear cookie
    res.clearCookie('connect.sid');

    // Redirect to login
    res.redirect('/login');
  });
});

/* =========================
   Chat Routes
========================= */
router.get('/chat', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('Chat');
});

router.get('/chat/:id', MessageView.chatview);

/* =========================
   Ping / SSE Route
========================= */
router.get('/ping', (req, res) => {
 /* res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Auto reconnect delay
  res.write('retry: 2000\n\n');

  // Client disconnect handler
  req.on('close', () => {
    console.log('Client disconnected');
  }); */
  // SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let progress = 0;
    const interval = setInterval(() => {
        progress += 5; // increment loading progress
        if(progress > 100) progress = 100;
        
        // Send progress to client
        res.write(`data: ${progress}\n\n`);

        if(progress >= 100) {
            clearInterval(interval);
            res.end();
        }
    }, 200); // every 200ms
  
  
});

// Express
router.get("/netstream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let timer = setInterval(() => {
        res.write("data: ping\n\n");
    }, 2000);

    req.on("close", () => clearInterval(timer));
});


router.get('/sse', (req, res) => {
  res.render('demo');
});

/* =========================
   404 Fallback (Keep Last)
========================= */
router.use((req, res) => {
  res.status(404).render('404', { url: req.originalUrl });
});

module.exports = router;