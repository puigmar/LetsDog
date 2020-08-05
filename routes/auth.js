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

router.post("/signup", async (req, res) => {
  try {
    const { userData, dogData, clientData } = req.body;

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(userData.password, salt);

    userData.password = hashPass;

    const user = await User.create(userData);
    const dog = await Dog.create({
      userId: user._id,
      ...dogData,
    });
    const client = await Client.create({
      ...clientData,
      dogId: dog._id,
      userId: user._id,
    });
    if (client) {
      req.session.currentUser = { user: user, dog: dog, client: client };

      res.render("service");
    }
  } catch (err) {
    console.log(err);
  }
});


router.get("/login", (req, res, next) => {
  res.render("auth/login", { err: "" });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  console.log(req.body)

  if (email === "" || password === "") {
    res.render("auth/login", { err: "Type something" });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("auth/login", { err: "Email doesn't exist" });
        return;
      }

      if (bcrypt.compareSync(password, user.password)) {
        //var sessionData = {user}
        Dog.findOne({ userId: user._id })
          .then((dog) => {
            //sessionData = {user, dog}

            Client.findOne({ userId: user._id })
              .then((client) => {
                //sessionData = {user, dog, client}
                req.session.currentUser = {
                  user: user,
                  dog: dog,
                  client: client,
                };
                console.log("Aqui -------->", req.session.currentUser);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
        res.redirect("/service");
      } else {
        res.render("auth/login", { err: "Incorrect password" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
