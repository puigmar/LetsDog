const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Dog = require("../models/Dog");
const Carer = require("../models/Carer");

const bcrypt = require("bcrypt");
const Client = require("../models/Client");
const bcryptSalt = 10;

router.get("/login", (req, res, next) => {
  res.render("auth/login", { err: "" });
});

router.post("/login", async (req, res, next) => {

  try {

    const { email, password } = req.body;

    if (email === "" || password === "") {
      res.render("auth/signup", { err: "Type something" });
      return;
    }

    const userQuery = await User.findOne({ email, isCarer: false });

    console.log('user: ', userQuery)

    if (!userQuery) {
      res.render("auth/login", { err: "Email doesn't exist" });
      return;
    }

    if (bcrypt.compareSync(password, userQuery.password)) {

      const queryDog = await Dog.findOne({ clientId: userQuery.userId});

      console.log('Dog: ', queryDog)

      const queryClient = await Client.findOne({ userId: queryDog.userId })

      req.session.currentUser = {
        user: userQuery,
        dog: queryDog,
        client: queryClient,
      }

      //console.log("Aqui -------->", req.session.currentUser);
      
      res.redirect("/service");

    } else {

      res.render("auth/login", { err: "Incorrect password" });

    }

  }
  catch(err) {
    next(err)
  }

});

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

router.get('/logout', (req, res, next) => {
    
  if (!req.session.currentUser) {
      res.redirect('/');
      return;
  }

  req.session.destroy((err) => {
      if (err) {
          next(err);
          return;
      }
      res.redirect('/');
  });
})

/*router.use((req, res, next) => {
  if (req.session.currentUser.isCarer === false) {
    next();
    return;
  }
  res.redirect('/login');
});*/

router.get('/profile/:id', async (req, res) => {
  const userId = req.params.id;
  console.log('carerId: ', userId)
  try{
      const theUser = await User.findOne({"_id": userId})
      res.render('profile', {user: theUser})
  }
  catch(error){
      next(error)
  }
})

router.get('/profile/dogs/:id', async (req, res) => {
  const dogId = req.params.id;
  console.log('dogId: ', dogId)
  try{
      const theDog = await Dog.findOne({"_id": dogId})
      res.render('profile-dog', {dog: theDog})
  }
  catch(error){
      next(error)
  }
})

module.exports = router;
