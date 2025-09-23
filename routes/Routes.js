const express = require('express');
const router = express.Router();


router.get('/', motoController.getAllMotos);


module.exports = router;