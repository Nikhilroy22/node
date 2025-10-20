// routes/webRoutes.js
const express = require('express');
const router = express.Router();

//Controller
const authController = require('../controller/LoginController');
const SignUpController = require('../controller/SignupController')
const Home = require('../controller/HomeController');

const authMiddleware = require('../middleware/authMiddleware');


router.get("/res", async(req, res) =>{
  const url = "https://1xbet86.com/LiveFeed/Get1x2_VZip?sports=16&count=50&lng=en&gr=54&antisports=4&mode=4&country=19&getEmpty=true";

const fdata = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0",     // বা অন্য header প্রয়োজনে
      "Accept": "application/json"
    }
  });
const jjj = await fdata.json();
res.json(jjj);
  
});
router.get('/bet', (req, res) => {
  
  res.render('bet');
});

router.post('/bet', (req, res) => {
  
  res.json('bet');
});


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



// 404 fallback (মনে রাখবেন: এটাকে সব শেষে রাখতে হবে)
router.use((req, res) => {
  res.status(404).render('404', { url: req.originalUrl });
});


module.exports = router;