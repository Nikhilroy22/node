// routes/webRoutes.js
const express = require('express');
const router = express.Router();

//Controller
const authController = require('../controller/LoginController');
const SignUpController = require('../controller/SignupController')
const Home = require('../controller/HomeController');
const BetController = require('../controller/BetController');
const BetApiController = require('../controller/BetApiController');
const MessageView = require('../controller/MsgViewController');
//Middleware
const authMiddleware = require('../middleware/authMiddleware');


// Bet ROUTE

router.get('/bet', BetController.bethome);
router.post('/bet', BetController.placeBet);



//Betb Api Get
router.get('/bet/:id', BetApiController.ParamsBet);

//Bet API RES
router.get("/res", BetController.betapi);
router.get("/resview/:matchid", BetApiController.betapiview);

//Crash page
router.get('/crash', (req, res) => {
  
  res.render('crash', {user: req.session.user})
});

// Home page
router.get('/', Home.HomePage);



// GET /login
router.get('/login',authMiddleware, authController.showLogin);

// POST /login
router.post('/login',authMiddleware, authController.loginUser);

// Get /Sign Up
router.get('/signup', authMiddleware, SignUpController.SignUp);

// Post /Sign Up
router.post('/signup', authMiddleware, SignUpController.SignUpPost);


// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('সেশন মুছতে সমস্যা হয়েছে');
    }

    // Cookie ও মুছে ফেলতে চাইলে:
    res.clearCookie('connect.sid');

    // লগআউটের পর রিডাইরেক্ট করো
    res.redirect('/login');
  });
});

router.get("/chat", (req, res) =>{
if (!req.session.user) {

  return res.redirect('/login');
  }
  res.render("Chat");
});
router.get("/chat/:id", MessageView.chatview);

//PING DATA

router.get("/ping", (req, res) => {
   res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Auto reconnect delay
  res.write("retry: 2000\n\n");

  // client disconnect handle
  req.on("close", () => {
    console.log("Client disconnected");
  });
});


// 404 fallback (মনে রাখবেন: এটাকে সব শেষে রাখতে হবে)
router.use((req, res) => {
  res.status(404).render('404', { url: req.originalUrl });
});


module.exports = router;