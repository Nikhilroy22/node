const express = require('express');
const router = express.Router();
const admin = require('../middleware/IsAdmin');

const file = require('../controller/FileManagerController');
const post = require('../controller/BlogController');
const jj = require('../db/nodesqlite');

// 🔒 সব route-এর আগে middleware
router.use(admin);


router.get("/data", (req, res) => {
  const row = jj.db.prepare("SELECT * FROM users").all();
  res.json(row);
});

router.get('/', (req, res) => {
  const stats = jj.db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM users) AS totalUsers,
      (SELECT COUNT(*) FROM posts) AS totalPosts
  `).get();

  res.render("admin/home", { stats });
});

router.get("/setting", (req, res) => {
  res.render("admin/Setting");
});

// Blog
router.get('/addpost', post.blogview);
router.post('/savepost', post.savepost);

// File Manager
router.get('/filemanager', file.fileview);
router.get('/fileapi', file.filesapi);
router.post('/filedelete', file.filedelete);
router.post('/fileupload', file.cupload.single("file"), file.fileupload);

module.exports = router;