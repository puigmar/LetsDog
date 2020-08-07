const express = require("express");
const router = express.Router();

const prices = require("./../config/prices");
const User = require("../models/User");
const Carer = require("../models/Carer");
const Card = require("../models/Card");
const Contract = require("../models/Contract");
const { trasformToRegularTime } = require("../helpers/methods");

// router.use((req, res, next) => {
//     if (req.session.currentUser) {
//       next();
//       return;
//     }

//     res.redirect('auth/login');
//   });

router.get("/service", (req, res, next) => {
  let transformPrices = prices.map((interval) => {
    let transformTime = trasformToRegularTime(interval.intervalTime);
    return {
      intervalTime: transformTime,
      intervalRaw: interval.intervalTime,
      price: interval.price,
    };
  });
  console.log(transformPrices);
  res.render("service", { intervalList: transformPrices });
});

router.get("/setup", (req, res, next) => {
  res.render("setup");
});

router.get("/validation", async (req, res, next) => {
  res.render("service-validation");
});

router.get("/confirmation", (req, res, next) => {
  res.render("service-confirmation");
});

router.get("/payment", (req, res, next) => {
  res.render("payment-method");
});

router.post("/payment", (req, res, next) => {
  const { name, number, expiresMonth, expiresYear, cvv, userId } = req.body;

  console.log(req.body);

  if (
    name === "" ||
    number === "" ||
    expiresMonth === "" ||
    //expiresYear === "" ||
    cvv === ""
  ) {
    res.render("/payment", {
      err: "Te faltan campos, por favor llenalos",
    });
    return;
  }

  Card.create({
    userId: userId,
    ownerName: name,
    cardNumber: number,
    expiration: expiresMonth,
    cvv: cvv,
  })
    .then(() => {
      res.redirect("/service-map");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/service-map", (req, res, next) => {
  res.render("service-map");
});

router.post("/service-map", (req, res, next) => {
  const { contractData } = req.body;
  console.log(req.body);

  Card.findOne({ userId: contractData.userId })
    .then((card) => {
      Contract.findOneAndUpdate({_id: contractData._id}, 
        {$set: {
        card_number: contractData.card_number,
      }})
        .then(() => {
          console.log("exito");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/carer-profile/:id", async (req, res, next) => {
  const userId = req.params.id;
 
  try {
    const carer = await Carer.findOne({ userId: userId });
    console.log('carer: ', carer);
    res.render("carer-profile", { selectedCarer: carer });
  }
  catch(err) {
    console.log(err)
  }
});


module.exports = router;
