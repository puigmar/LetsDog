const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/service', (req, res, next) => {
  res.render('service');
})


module.exports = router;
