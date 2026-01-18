const express = require('express');
const router = express.Router();
const file = require('../controller/FileManagerController');
const post = require('../controller/BlogController');

const jj = require('../db/nodesqlite');

router.get("/data", (req, res) => {
  // INSERT
/*jj.db.prepare(
  "INSERT INTO users (name, age) VALUES (?, ?)"
).run("Nikhil", 25);
*/
// SELECT
const id = 1;

const row = jj.db.prepare(
  "SELECT * FROM users"
).all();

//console.log(row);

  res.json(row);
});

router.get('/', (req, res)=> {
  
  res.render('admin/home');
  
});

// post
router.get('/addpost', post.blogview )
router.post('/savepost', post.savepost )


// File Manager
router.get('/filemanager', file.fileview);
router.get('/fileapi', file.filesapi);
router.post('/filedelete', file.filedelete);
router.post('/fileupload', file.cupload.single("file"), file.fileupload);

module.exports = router;