const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Dog = require("../models/Dog");
const Carer = require("../models/Carer");

const bcrypt = require("bcryptjs");
const { route } = require(".");
const bcryptSalt = 10;

router.get("/signup-user", (req, res, next) => {
  res.render("auth/signup-user", { err: "" });
});

router
  .post("/signup-user", (req, res, next) => {
    const { email, password } = req.body;
    const userData = {
      userEmail: req.body.email,
      password: req.body.password,
    };
    const dogData = {
      photo,
      name,
      sex,
      breed,
      age,
      size,
      behavior,
    };

    /* if (email === "" || password === "") {
    res.render("auth/signup-user", { err: "Llename esos campos porfa!" });
    return;
  }*/

    /*User.findOne({ email })
    .then((userEmail) => {
      if (userEmail !== null) {
        res.render("auth/signup-user", {
          errorMessage: "El email ya existe, intenta con otro!",
        });
        return;
      } */

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create({ email, password: hashPass })
      .then(() => {
        res.redirect("/service");
      })
      .catch((error) => {
        console.log(error);
      });
  })
  .catch((error) => {
    next(error);
  });

router.post("/signup/check-user-data", (req, res, next) => {
  const { email, password } = req.body;
});
