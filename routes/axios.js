const express = require("express");
const axios = require('axios');
const router = express.Router();
const { users, users_connected, carers_connected} = require('../socket');

const User = require("../models/User");
const Dog = require("../models/Dog");
const Carer = require("../models/Carer");

const parser = require('./../config/cloudinary.js');
const { modelNames } = require("mongoose");
const { routes } = require("../app");

router.post ('/validate-user', (req, res, next) => {
    const query = '';
    if(req.query.type === 'carer'){
        console.log('hay query ?key=value')
        query = { email, isCarer: true}
    } else {
        query = { email }
    }

    const {email} = req.body
    User.findOne(query)
    .then((userEmail) => {
        res.send({email: userEmail});  
    })
    .catch ((err) => {
        console.log(err)
    });

});

router.post("/validate-photo", parser.single("image"), (req, res, next) => {
    const image_url = req.file.secure_url;
    res.send(image_url);
  });

router.post("/updateField/carer", async (req, res, next) => {

    let userId,
        updateQuery

    const {model, key, value} = req.body;

    if(req.query.phone){
        console.log('deteta query,,')
        const key = req.query.phone.split('.');
        updateQuery = { 
            phone: {
                [key[1]]:value
            }
        }
    } else {
        updateQuery = { $set: {[key]:value}}
    }

    console.log('updateQuery: ',updateQuery)

    switch(model){
        case 'User':
            try{
                userId = req.session.currentUser.user._id;
                const update = await User.findOneAndUpdate( { _id: userId }, updateQuery, { new: true })
                res.send(update[key])
            }
            catch(err){
                console.log(err)
            }
            break;

        case 'Carer':
            try{
                userId = req.session.currentUser.carer._id;
                const update = await Carer.findByIdAndUpdate( { _id: userId }, updateQuery, { new: true })
                res.send(update[key])
            }
            catch(err){
                console.log(err)
            }
            break;
    }
  });

router.post("/check/available-carers", async (req, res, next) => {
    const availableCarers = [];

    const getNearestCarer = async () => {
        carers_connected.forEach( carer => {
            let userCoords = req.body;
            const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${userCoords[0]},${userCoords[1]};${carer.geometry['coordinates'][0]},${carer.geometry['coordinates'][1]}?geometries=geojson&access_token=pk.eyJ1IjoicHVpZ21hciIsImEiOiJja2Q1cTRjMHoyOWc1MzBwZzUxNnBqZjgzIn0.Dl_LIKPYzM72_QZAE0wZWQ`;
            
            console.log(url)

            axios.get(url)
            .then( res => {
                const route = res.data.routes;
                if(routes.duration < (60 * 20)){
                    carer.duration = route.duraton;
                    availableCarers.push(carer);
                }
            })
            .catch(err => console.log(err))
        })
    }
    await getNearestCarer();
    console.log(availableCarers)
});

module.exports = router