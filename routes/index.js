const express = require('express');
const router  = express.Router();

const prices = require("./../config/prices")

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});





module.exports = router;
