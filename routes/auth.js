const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Dog = require("../models/Dog");
const Carer = require("../models/Carer");

const bcrypt = require("bcrypt");
const Client = require("../models/Client");
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup", { err: "" });
});

router.post("/signup", (req, res, next) => {

  

  const { userData, dogData, clientData } = req.body;


  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(userData.password, salt);

  userData.password = hashPass;

  User.create(userData)
    .then(() => {

      User.findOne({ email: userData.email })
        .then((user) => {
          const userId = user._id;
          console.log(userId)
          dogData.userId = userId;
          clientData.userId = userId;
          //console.log(dogData)

          Dog.create(dogData)
            .then(() => {
              Dog.findOne({ userId: dogData.userId }).then((dog) => {
                const dogId = dog._id;
                clientData.dogId = dogId;

                Client.create(clientData)
                  .then(() => {
                    req.session.currentUser = {userData, dogData, clientData}
                    console.log(req.session.currentUser);
                    res.send(true)
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login", { err: "" });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  //console.log(req.body)

  if (email === "" || password === "") {
    res.render("auth/signup", { err: "Type something" });
    return;
  }

  User.findOne({ email }).then((user) => {
    if (!user) {
      res.render("auth/login", { err: "Email doesn't exist" });
      return;
    } 

    if (bcrypt.compareSync(password, user.password)) {
      var sessionData = {user}
      Dog.findOne({ userId: user._id })
        .then((dog) => {
          sessionData = {user, dog}
          //console.log(sessionData)
          Client.findOne({ userId: user._id})
            .then((client) => {
              sessionData = {user, dog, client}
              
              req.session.currentUser = sessionData
              console.log('datos de sesion:', req.session.currentUser)
              //console.log(req.session.currentUser)
            })
            .catch ((err) => {
              console.log(err);
            })
        })
        .catch((err) => {
          console.log(err)
        })
      res.redirect("/service");
    } else {
      res.render("auth/login", { err: "Incorrect password" });
    }
  })
  .catch((err) => {
    console.log(err);
  })
  
});

module.exports = router;
