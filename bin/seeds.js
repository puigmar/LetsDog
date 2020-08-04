require('../config/db');
const Review = require('../models/Review');
Review.collection.drop();

const reviews = [
    {
      clientId: '5f29103d25a75108290e97d3',
      carerId: '5f2809b21c1bcd0638f8f8a7',
      dogId: '5f26a96ab400f61b8fa9a098',
      average: 4,
      items: {
        ontime: {
          name: 'Puntual',
          score: 3,
        },
        professional: {
          name: 'Profesional',
          score: 5,
        },
        loving: {
          name: 'Cariños@',
          score: 4,
        },
        atentive: {
          name: 'Atent@',
          score: 4,
        },
      },
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget diam odio. Vestibulum posuere felis enim, sit amet eleifend felis tempus sed. Aliquam nec sodales lorem.',
    },
    {
        clientId: '5f29103d25a75108290e97d3',
        carerId: '5f2809b21c1bcd0638f8f8a7',
        dogId: '5f26a96ab400f61b8fa9a098',
        average: 4,
        items: {
          ontime: {
            name: 'Puntual',
            score: 3,
          },
          professional: {
            name: 'Profesional',
            score: 5,
          },
          loving: {
            name: 'Cariños@',
            score: 4,
          },
          atentive: {
            name: 'Atent@',
            score: 4,
          },
        },
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget diam odio. Vestibulum posuere felis enim, sit amet eleifend felis tempus sed. Aliquam nec sodales lorem.',
      },
  ];

reviews.map(review => {
    const newreview = new Review(review);
    return newreview.save()
        .then((review) => {
            console.log(`${review.description} saved in DB`);
        })
        .catch(error => {
            throw new Error(`Impossible to add the author. ${error}`);
        })
    })