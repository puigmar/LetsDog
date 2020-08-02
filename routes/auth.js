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
  const userData = {
    email: req.body.email,
    password: req.body.password,
  };
  const dogData = {
    userId: "",
    photo: req.body.photo,
    name: req.body.name,
    age: req.body.age,
    sex: req.body.sex,
    breed: req.body.breed,
    size: req.body.size,
    behavior: { withDogs: req.body.withDogs, withPeople: req.body.withPeople },
  };
  const clientData = {
    userId: "",
    dogId: "",
    favourites: "",
    cards: "",
    coords: ""
  };



  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(userData.password, salt);

  userData.password = hashPass;

  console.log(userData);
  console.log(userData.email);
  User.create(userData)
    .then(() => {
      User.findOne({email: userData.email})
        .then ((user) => {
        const userId = user._id;
        dogData.userId = userId;
        clientData.userId = userId;
          Dog.create(dogData)
            .then(() => {
              Dog.findOne({userId: dogData.userId})
                .then ((dog) => {
                  const dogId = dog._id;
                  clientData.dogId = dogId;
                    Client.create(clientData)
                      .then(() => {
                        console.log(clientData)
                      }) 
                      .catch((err) => {
                        console.log(err)
                      })
                })
            })
            .catch((err) => {
              console.log(err)
            })
          })
          .catch((err) => {
            console.log(err)
          })
      
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login", { err: "" });
});

router.post("/login", (req, res, next) => {

const {email, password} = req.body;

    if (email === "" || password === "") {
        res.render("auth/signup", { err: "Type something" });
        return;
      }
    
    User.findOne ({email})
      .then((user) => {
          if(!user) {
              res.render('auth/login', {err:"Email doesn't exist"});
              return;
          }

          if(bcrypt.compareSync(password, user.password)) {
            req.session.currentUser = user;
            res.redirect('/')
          } else {
              res.render('auth/login', {err: 'Incorrect password'})
          }
      })
    })


module.exports = router;
