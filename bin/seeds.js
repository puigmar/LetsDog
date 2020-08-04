require('../config/db');
const Review = require('../models/Review');
Review.collection.drop();

const reviews = [
    {
      clientId: '5f29945d8d4ca12efe5264f2',
      carerId: '5f299086cae8662e580067fe',
      dogId: '5f29945d8d4ca12efe5264f1',
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
        clientId: '5f29945d8d4ca12efe5264f2',
        carerId: '5f299086cae8662e580067fe',
        dogId: '5f29945d8d4ca12efe5264f1',
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