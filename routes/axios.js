const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Dog = require("../models/Dog");
const Carer = require("../models/Carer");
const { builtinModules } = require("module");

const parser = require('./../config/cloudinary.js')



router.post ('/validate-user', (req, res, next) => {
    const {email} = req.body
    User.findOne({ email })
    .then((userEmail) => {
        res.send({email: userEmail});  
    })
    .catch ((err) => {
        console.log(err)
    });

});



router.post("/validate-photo", parser.single("image"), (req, res, next) => {
    const image_url = req.file.secure_url;
    console.log('image:',image_url)
    res.send(image_url);
  });

module.exports = router