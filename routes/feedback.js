const express = require("express");
const router = express.Router();

const Carer = require("../models/Carer");
const { trasformToRegularTime } = require("../helpers/methods");
const Review = require("../models/Review");

router.get("/feedback/:id", (req, res, next) => {
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
});

router.post("/feedback", (req, res, next) => {
  const { huesito, review, userId, carerId } = req.body;

  if (review === "") {
    res.render("/feedback/:id", { err: "Por favor rellena el campo" });
  }

  Review.create({
    userId: userId,
    carerId: carerId,
    rate: huesito,
    description: review,
  })
    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
