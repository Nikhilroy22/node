// routes/webRoutes.js
const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.render('index', { title: 'রিয়েল-টাইম চ্যাট' });
});

// 404 fallback (মনে রাখবেন: এটাকে সব শেষে রাখতে হবে)
router.use((req, res) => {
  res.status(404).render('404', { url: req.originalUrl });
});

module.exports = router;