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

const blog = require('../controller/BlogController');

// Middleware
const authMiddleware = require('../middleware/authMiddleware');

//BLOG Routes
router.get('/post/:jj', blog.userblog)

//DEMO
router.get("/demo", (req, res) => {
  
  res.render("Demo");
});

//DHAN Routes


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
router.get('/cr', (req, res) => {
  res.render('CRW');
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
router.get('/recent', MessageView.rcmsg);


/* =========================
   404 Fallback (Keep Last)
========================= */
router.use((req, res) => {
  res.status(404).render('404', { url: req.originalUrl });
});

module.exports = router;