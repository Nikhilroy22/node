const express = require('express');
const router = express.Router();
const file = require('../controller/FileManagerController');


router.get('/', (req, res)=> {
  
  res.render('admin/home');
  
});


router.get('/filemanager', file.fileview);
router.get('/fileapi', file.filesapi);
router.post('/filedelete', file.filedelete);
router.post('/fileupload', file.cupload.single("file"), file.fileupload);

module.exports = router;