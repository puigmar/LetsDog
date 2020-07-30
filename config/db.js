const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/letsdog', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });