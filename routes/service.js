const express = require("express");
const router = express.Router();

const prices = require("./../config/prices");
const User = require("../models/User");
const Carer = require("../models/Carer");
const { trasformToRegularTime } = require("../helpers/methods");

// router.use((req, res, next) => {
//     if (req.session.currentUser) {
//       next();
//       return;
//     }

//     res.redirect('auth/login');
//   });

router.get("/service", (req, res, next) => {

  let transformPrices = prices.map(interval => {
    let transformTime = trasformToRegularTime(interval.intervalTime);
    return {
      intervalTime: transformTime,
      intervalRaw: interval.intervalTime,
      price: interval.price,
    }
  })
  console.log(transformPrices)
  res.render("service", { intervalList: transformPrices });
});

router.get("/setup", (req, res, next) => {
  res.render("setup");
});

router.get("/carer-profile/:id", (req, res, next) => {
  const carerId = req.params.id;
  console.log(carerId);

  Carer.findOne({ _id: carerId })
    .then((carer) => {
      console.log(carer);
      res.render("carer-profile", { selectedCarer: carer });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/waiting-for-service", (req, res, next) => {
  res.render("/service-validation");
});
module.exports = router;
