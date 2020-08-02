const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Dog = require("../models/Dog");
const Carer = require("../models/Carer");

const bcrypt = require("bcrypt");
const app = require("../app");
const bcryptSalt = 10;

router.get('/signup', (req, res) => {
    res.render('carer/signup')
})

router.post('/signup', async (req, res) => {
    try {
        const {userData, carerData } = req.body;
    
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(userData.password, salt);
    
        userData.password = hashPass;
    
        const user = await User.create(userData);
        const findUser = await User.findById(user._id);
        const carer = await Carer.create({
            carerId: findUser._id,
            ...carerData
        })
        if(carer){
            req.session.currentUser = {user: findUser, carer: carer}
            res.render('carer/dashboard')
        }
    }
    catch(err){
        console.log(err)
    }
})

module.exports = router;