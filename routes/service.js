const express = require('express');
const router  = express.Router();

const prices = require("./../config/prices")

// router.use((req, res, next) => {
//     if (req.session.currentUser) {
//       next();
//       return;
//     }
  
//     res.redirect('auth/login');
//   });

  router.get('/service', (req, res, next) => {
    res.render('service', {intervalList: prices});
  })
  
  router.get('/setup', (req, res, next) => {
    res.render('setup');
  })

  module.exports = router;