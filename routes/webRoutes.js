// routes/webRoutes.js
const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../db');

//Controller
const authController = require('../controller/LoginController');
const SignUpController = require('../controller/SignupController')
const Home = require('../controller/HomeController');

const authMiddleware = require('../middleware/authMiddleware');





//Middleware
router.get('/demo', async(req, res) => {
  const kk = await getUsers()
 //console.log(req.headers);
  res.send(kk);
});

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



// 404 fallback (মনে রাখবেন: এটাকে সব শেষে রাখতে হবে)
router.use((req, res) => {
  res.status(404).render('404', { url: req.originalUrl });
});


module.exports = router;