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
const Contract = require('../models/Contract');

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

router.post("/check/available-carers", async (req, res, next) => {
    
    let availableCarers = [];
    let userCoords = req.body;
    
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
                    console.log('available',availableCarers)
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



    const carerCoordsArr = [{
        carerId: '5f2c311e9f76bd70da23b7c3',
        geometry: { 
            coordinates: [2.1608813, 41.3904655],
            type: 'Point' 
            }
      },
      {
        carerId: '5f2c32c59f76bd70da23b7c5',
        geometry: { 
            coordinates: [2.162688, 41.399681],
            type: 'Point' 
            }
      },
      {
        carerId: '5f2c330e9f76bd70da23b7c7',
        geometry: { 
            coordinates: [2.161111, 41.398541],
            type: 'Point' 
            }
      },
      {
        carerId: '5f2c33ef9f76bd70da23b7c9',
        geometry: { 
            coordinates: [2.163320, 41.397000],
            type: 'Point' 
            }
      },
      {
        carerId: '5f2c34a79f76bd70da23b7cb',
        geometry: { 
            coordinates: [2.164444, 41.397500],
            type: 'Point' 
            }
      },
      {
        carerId: '5f2c35129f76bd70da23b7cd',
        geometry: { 
            coordinates: [2.165555, 41.398000],
            type: 'Point' 
            }
      }];

    

    await nearestOnlineCarers(carerCoordsArr) // <--- cargar array falso con datos tipo socket
    const queryCarerList = orderCarerByTime(availableCarers);

    //console.log('Es esto---------------->',queryCarerList)
      
    const carerDetails = [];

    const getCarerDetails = async () => {
        try{
            for(let i= 0; i<queryCarerList.length; i++){

                const carers = await Carer.find({_id: queryCarerList[i].carerId})
                                          .populate('liked.reviews', 'description')
                console.log(carers)
                                          

                const carerId = await Carer.find({ _id: queryCarerList[i].carerId }, { carerId:1 })
                const reviews = await Review.find({ carerId }, { description: 1 })

                const newObj = {
                    carers,
                    duration: queryCarerList[i].duration,
                    reviews: reviews,
                    numReviews: reviews.length
                }

                carerDetails.push(newObj);

                console.log('hola--------->',carerDetails)
                
                

            }
        } 
        catch(err){
            console.log(err)
        }
    }

    await getCarerDetails();

    
    res.json({result:carerDetails})
    
});


router.post("/send/contract-petition", async (req, res, next) => {

    const contract = req.body;

    try {
        const queryContract = await Contract.create(
            {
                userId: contract.userId,
                carerId: contract.carerId,
                dogId: contract.dogId,
                interval_time: contract.interval_time,
                price: contract.price,
                dogName: contract.dogName,
                dogAge: contract.dogAge,
                dogBreed: contract.dogbreed,
                meeting_point: contract.meeting_point,
                card_number: contract.card_number
            }
        );

        console.log(queryContract)
    }
    catch(err) {
        console.log(err)
    }
});

router.get('/get/pending-petitions', async (req, res, next) => {

    const getContracts = await Contract.find({pending: false})

    console.log('getcontract:', getContracts)

    const getDogs = await Dog.find({userId: getContracts.userId})

    console.log('getdogs:', getContracts)

    console.log('getDogs: ', getDogs);

    res.json({contracts: getPendingContracts});

})



module.exports = router