const express = require("express");
const axios = require('axios');
const router = express.Router();
const {
    users,
    users_connected,
    carers_connected
} = require('../socket');

const User = require("../models/User");
const Dog = require("../models/Dog");
const Carer = require("../models/Carer");

const parser = require('./../config/cloudinary.js');
const {
    modelNames
} = require("mongoose");
const {
    routes
} = require("../app");
const { route } = require(".");

router.post('/validate-user', (req, res, next) => {
    const query = '';
    if (req.query.type === 'carer') {
        console.log('hay query ?key=value')
        query = {
            email,
            isCarer: true
        }
    } else {
        query = {
            email
        }
    }

    const {
        email
    } = req.body
    User.findOne(query)
        .then((userEmail) => {
            res.send({
                email: userEmail
            });
        })
        .catch((err) => {
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

    const {
        model,
        key,
        value
    } = req.body;

    if (req.query.phone) {
        console.log('deteta query,,')
        const key = req.query.phone.split('.');
        updateQuery = {
            phone: {
                [key[1]]: value
            }
        }
    } else {
        updateQuery = {
            $set: {
                [key]: value
            }
        }
    }

    console.log('updateQuery: ', updateQuery)

    switch (model) {
        case 'User':
            try {
                userId = req.session.currentUser.user._id;
                const update = await User.findOneAndUpdate({
                    _id: userId
                }, updateQuery, {
                    new: true
                })
                res.send(update[key])
            } catch (err) {
                console.log(err)
            }
            break;

        case 'Carer':
            try {
                userId = req.session.currentUser.carer._id;
                const update = await Carer.findByIdAndUpdate({
                    _id: userId
                }, updateQuery, {
                    new: true
                })
                res.send(update[key])
            } catch (err) {
                console.log(err)
            }
            break;
    }
});

router.post("/check/available-carers", async (req, res, next) => {
    let availableCarers = [];
    let userCoords = req.body;
    console.log(req.body)
    const SEARCHLIMIT = 20;
    const MAXTIME = 30; // minutes

    const falseCarers = [{
        carerId: '5f2809b21c1bcd0638f8f8a6',
        geometry: {
            coordinates: [2.1608813, 41.3904655],
            type: 'Point'
        }
    }, {
        carerId: '5f2809b21c1bcd0638f8f254',
        geometry: {
            coordinates: [2.162688, 41.399681],
            type: 'Point'
        }
    }, {
        carerId: '5f2809b21c1bcd0638f8853',
        geometry: {
            coordinates: [2.161111, 41.398541],
            type: 'Point'
        }
    }, {
        carerId: '5f2809b21c1bcd0638f8f125',
        geometry: {
            coordinates: [2.163320, 41.397000],
            type: 'Point'
        }
    }, {
        carerId: '5f2809b21c1bcd0638f8f9067',
        geometry: {
            coordinates: [2.164444, 41.397500],
            type: 'Point'
        }
    }, {
        carerId: '5f2809b21c1bcd0638f8f404',
        geometry: {
            coordinates: [2.165555, 41.398000],
            type: 'Point'
        }
    }, {
        carerId: '5f2809b21c1bcd0638f8f107',
        geometry: {
            coordinates: [2.160000, 41.392000],
            type: 'Point'
        }
    }, {
        carerId: '5f2809b21c1bcd0638f8f045',
        geometry: {
            coordinates: [2.162222, 41.399000],
            type: 'Point'
        }
    }]
    
    carers_connected.push(...falseCarers);

    //console.log('carers_connected: ', carers_connected)

    const filterCarerByTime = (array) => {
        const orderByDuration = array.sort((a, b) => a.duration - b.duration);
        return (orderByDuration < SEARCHLIMIT) ? orderByDuration : orderByDuration.splice(0, 15)
    }

    const nearestOnlineCarers = async () => {
        try {
            for (let i = 0; i < carers_connected.length; i++) {
                let url = `https://api.mapbox.com/directions/v5/mapbox/walking/${userCoords[0]},${userCoords[1]};${carers_connected[i].geometry['coordinates'][0]},${carers_connected[i].geometry['coordinates'][1]}?geometries=geojson&access_token=pk.eyJ1IjoicHVpZ21hciIsImEiOiJja2Q1cTRjMHoyOWc1MzBwZzUxNnBqZjgzIn0.Dl_LIKPYzM72_QZAE0wZWQ`;

                let queryApiDirection = await axios.get(url);

                let duration = queryApiDirection.data.routes[0].duration;

                let minutes = Math.ceil((duration / 60).toFixed(0));

                if(minutes < MAXTIME) {
                    carers_connected[i].duration = minutes;
                    availableCarers.push(carers_connected[i]);
                }
            }


        } catch (error) {
            console.log(error);
        }
    }

    await nearestOnlineCarers()
    const queryCarerList = filterCarerByTime(availableCarers);

    

    console.log('queryCarerList: ', queryCarerList)

});


module.exports = router