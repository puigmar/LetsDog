const express = require("express");
const router = express.Router();

const prices = require("../config/prices");
const User = require("../models/User");
const Carer = require("../models/Carer");
const Card = require("../models/Card");
const { trasformToRegularTime } = require("../helpers/methods");

router.get('/feedback/:id', (req, res, next) => {
  const carerId = req.params.id;
  console.log(carerId);
  Carer.findOne({ _id: carerId })
    .then((carer) => {
      console.log(carer);
      res.render("feedback", { selectedCarer: carer });
    })
    .catch((err) => {
      console.log(err);
    });
})


module.exports = router;
