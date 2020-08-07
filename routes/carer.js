const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Dog = require("../models/Dog");
const Carer = require("../models/Carer");
const Review = require("../models/Review");

const bcrypt = require("bcrypt");
const app = require("../app");
const bcryptSalt = 10;

router.get('/signup', (req, res) => {
    res.render('carer/signup')
})

router.post('/signup', async (req, res) => {
    try {
        const {userData, carerData } = req.body;

        console.log(carerData)
    
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(userData.password, salt);
    
        userData.password = hashPass;
    
        const user = await User.create(userData);
        const carer = await Carer.create({
            userId: user._id,
            ...carerData
        })
        req.session.currentUser = {user: user, carer: carer}
        res.render('carer/login')

    }
    catch(err){
        console.log(err)
    }
})

router.get('/login', (req, res) => {
    res.render('carer/login')
})

router.post('/login', async (req, res) => {

    try {
        
        const { email, password } = req.body;

        if (email === "" || password === "") {
          res.render("carer/login", { err: "Los campos no pueden estar vacíos" });
          return;
        }

        const theUser =  await User.findOne({ email, isCarer: true});

        if(theUser){
            if(!bcrypt.compareSync(password, theUser.password)){
                res.render('carer/login', {
                    errorMessage: 'Invalid password.'
                });
                return;
            }
            const theCarer = await Carer.findOne({userId: theUser._id});
            //console.log(theCarer)
            if(theCarer){
                req.session.currentUser = { user: theUser, carer: theCarer};
                res.redirect('/carer/dashboard');
            }
        }
    }
    catch(err) {
        next(err)
    }
})

router.use((req, res, next) => {
    if (req.session.currentUser) {
      next();
      return;
    }
    res.redirect('/carer/login');
});

router.get('/dashboard', (req, res) => {
    res.render('carer/dashboard')
})

router.get('/profile/:id', async (req, res) => {
    const carerId = req.params.id;
    console.log('carerId: ', carerId)
    try{
        const theCarer = await Carer.findOne({"_id": carerId})
                                    .populate('userId')

        req.session.currentUser = { carer: theCarer };
                                    
        res.render('carer/profile', {carer: theCarer})
    }
    catch(error){
        console.log(error)
    }
})

router.get('/reviews/:id', async (req, res) => {
    try{
        const carerId = req.params.id;
        const carerReview = await Review.find({carerId: carerId})
                                    .populate('carerId')
                                    .populate('dogId', '_id photo name')
        //console.log(carerReview[0].carerId);
        res.render('carer/reviews', {review: carerReview})
    }
    catch(error){
        console.log(error)
    }
})




module.exports = router;