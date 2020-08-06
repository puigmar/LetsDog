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
const Client = require("../models/Client");

const parser = require('./../config/cloudinary.js');
const {
    modelNames
} = require("mongoose");
const {
    routes
} = require("../app");
const Review = require("../models/Review");

router.post('/validate-user', (req, res, next) => {

    const { email } = req.body;
    
    let query = { email };
    
    if (req.query.type === 'carer') {
        console.log('hay query ?key=value')
        query = {
            email,
            isCarer: true
        }
    }

    console.log(query);

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

    const keyName = key.split('.')

    if(keyName.length > 1){
        updateQuery = {
            phone: {
                [keyName[1]]: value
            }
        }
    } else {
        updateQuery = {
            $set: {
                [keyName]: value
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
                res.send(update[keyName])
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

router.post("/updateField/dog", async (req, res, next) => {

    try {
        let userId,
            updateQuery

        const {
            model,
            key,
            value
        } = req.body;

        const keyName = key.split('.')

        console.log('keyname: ', keyName)

        if(keyName.length > 1){
            updateQuery = {
                $set: {
                    [keyName]: value
                }
            }
        } else {
            updateQuery = {
                $set: {
                    [keyName]: value
                }
            }
        }

        updateQuery = {
            $set: {
                [keyName]: value
            }
        }

        console.log('updateQuery: ', updateQuery)

        dogId = req.session.currentUser.dog._id;

        const update = await Dog.findOneAndUpdate({
            _id: dogId
        }, updateQuery, {
            new: true
        })

        console.log(update);

        res.send(update[keyName].toString())

    } catch (err) {
        next(err)
    }

});
/*
router.post("/check/available-carers", async (req, res, next) => {
    
    let availableCarers = [];
    let userCoords = req.body;
    console.log(req.body)
    const SEARCHLIMIT = 20;
    const MAXTIME = 1000; // minutes

    const falseCarers = [{
        carerId: '5f299e1fbc5a2a31e4c545ab',
        geometry: {
            coordinates: [2.1941694, 41.390356499999996],
            type: 'Point'
        }
    }, {
        carerId: '5f299e37bc5a2a31e4c545ad',
        geometry: {
            coordinates: [2.1941694, 41.390356499999996],
            type: 'Point'
        }
    }]

    //carers_connected.push(...falseCarers);

    const orderCarerByTime = (array) => {
        const orderByDuration = array.sort((a, b) => a.duration - b.duration);
        return (orderByDuration < SEARCHLIMIT) ? orderByDuration : orderByDuration.splice(0, SEARCHLIMIT)
    }

    const nearestOnlineCarers = async () => {
        try {
            for (let i = 0; i < carers_connected.length; i++) {
                let url = `https://api.mapbox.com/directions/v5/mapbox/walking/${userCoords[0]},${userCoords[1]};${carers_connected[i].geometry['coordinates'][0]},${carers_connected[i].geometry['coordinates'][1]}?geometries=geojson&access_token=pk.eyJ1IjoicHVpZ21hciIsImEiOiJja2Q1cTRjMHoyOWc1MzBwZzUxNnBqZjgzIn0.Dl_LIKPYzM72_QZAE0wZWQ`;

                let queryApiDirection = await axios.get(url);

                let duration = queryApiDirection.data.routes[0].duration;

                let minutes = Math.ceil((duration / 60).toFixed(0));

                console.log(minutes)

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
    const queryCarerList = orderCarerByTime(availableCarers);

    //console.log('availableCarers: ', availableCarers)
    //console.log('queryList: ', queryCarerList);

    const carerDetails = [];

    const getCarerDetails = async () => {
        try{
            for(let i= 0; i<queryCarerList.length; i++){

                const carers = await Carer.find({userId: queryCarerList[i].carerId})
                                          .populate('liked.reviews', 'description')
                                          

                const carerId = await Carer.find({ userId: queryCarerList[i].carerId }, { carerId:1 })
                const reviews = await Review.find({ carerId }, { description: 1 })

                const newObj = {
                    carers,
                    duration: queryCarerList[i].duration,
                    reviews: reviews,
                    numReviews: reviews.length
                }

                carerDetails.push(newObj);  

            }
        } 
        catch(err){
            console.log(err)
        }
    }

    await getCarerDetails();


    res.json({result:carerDetails})
    
});*/

router.post("/check/available-carers", async (req, res, next) => {
    
    let availableCarers = [];
    let userCoords = req.body;
    console.log(req.body)
    const SEARCHLIMIT = 20;
    const MAXTIME = 1000; // minutes

    const nearestOnlineCarers = async (array) => {
        try {
            for (let i = 0; i < array.length; i++) {
                let url = `https://api.mapbox.com/directions/v5/mapbox/walking/${userCoords[0]},${userCoords[1]};${array[i].geometry['coordinates'][0]},${array[i].geometry['coordinates'][1]}?geometries=geojson&access_token=pk.eyJ1IjoicHVpZ21hciIsImEiOiJja2Q1cTRjMHoyOWc1MzBwZzUxNnBqZjgzIn0.Dl_LIKPYzM72_QZAE0wZWQ`;

                let queryApiDirection = await axios.get(url);

                let duration = queryApiDirection.data.routes[0].duration;

                let minutes = Math.ceil((duration / 60).toFixed(0));

                if(minutes < MAXTIME) {
                    array[i].duration = minutes;
                    availableCarers.push(array[i]);
                }
            }

        } catch (error) {
            next(error);
        }
    }

    const orderCarerByTime = (array) => {
        const orderByDuration = array.sort((a, b) => a.duration - b.duration);
        return (orderByDuration < SEARCHLIMIT) ? orderByDuration : orderByDuration.splice(0, SEARCHLIMIT)
    }


    await nearestOnlineCarers() // <--- cargar array falso con datos tipo socket
    const queryCarerList = orderCarerByTime(availableCarers);

    const carerDetails = [];

    const getCarerDetails = async () => {
        try{
            for(let i= 0; i<queryCarerList.length; i++){

                const carers = await Carer.find({userId: queryCarerList[i].carerId})
                                          .populate('liked.reviews', 'description')
                                          

                const carerId = await Carer.find({ userId: queryCarerList[i].carerId }, { carerId:1 })
                const reviews = await Review.find({ carerId }, { description: 1 })

                const newObj = {
                    carers,
                    duration: queryCarerList[i].duration,
                    reviews: reviews,
                    numReviews: reviews.length
                }

                carerDetails.push(newObj);  

            }
        } 
        catch(err){
            console.log(err)
        }
    }

    await getCarerDetails();


    res.json({result:carerDetails})
    
});




module.exports = router