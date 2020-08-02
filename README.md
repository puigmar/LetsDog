![](C:\Users\aleja\Desktop\1_0e5mwa-S3n40ApTMsciE-w.gif)



## LET'S DOG

Is a service for those dog owners who, at some point, need to leave their pet in the care of someone else. At that time **we offer an immediately reliable dog sitter wherever they are.**

## MVP

- Create your profile and your dog's profile
  - Modify and delete your profile
  - Add, modify or delete dog profiles
- Want to be Carer? you can do that too! 
  - Modify or delete your profile
  - Check your active service
  - Check your reviews
- Geolocalization service
- Distance and time estimates from you to the nearest Carers
- Add your payment method
- Two way validation to activate service
- Check the location of the Carer (and your dog) in real time
- Give feedback after the service is completed



## USER STORIES

#### Users

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to be able to access the homepage, log in and sign up.
- **sign up** - As a user I want to sign up on the web page so that I can request a service.
- **login** - As a user I want to be able to log in on the web page so I can request a service or check my profile and my dogs.
- **logout** - As a user I want to be able to log out from the web page so that I can make sure no one will access my account.
- **favorite list** - As a user I want to see the list of my favorite carers and delete them.
- **edit user** - As a user I want to be able to edit or delete my profile.
- **edit dogs** - As a user I want to be able to edit my dogs profile and add or delete more dogs.
- **manage favorites** -  As a user I want to be able to manage my favorites carers.
- **service** - As a user I want to set an interval and a price, set my location and with it pick the best carer for my dog, 
- **payment** - As a user I want to be able to set a payment method.
- **map service** - As a user I want to check in real time my dogs and carer position and the agreed meeting point.
- **feedback** - As a user I want to be able to provide feedback to my carer and add them as favorites if needed.

#### Carer

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to be able to access the homepage, log in and sign up.
- **sign up** - As a user I want to sign up on the web page so that I can provide a service.
- **login** - As a user I want to be able to log in on the web page so I can request a service or check my profile and my dogs.
- **logout** - As a user I want to be able to log out from the web page so that I can make sure no one will access my account.
- **dashboard** - As a user I want to check my reviews, my profile, my active service and petitions from dog owners.
- **edit user** - As a user I want to be able to edit or delete my profile.



## SERVER ROUTES

| **Method** | **Route**                     | **Description**                                              | Request  - Body                                              |
| ---------- | ----------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `GET`      | `/`                           | Main page route.                                             |                                                              |
| `GET`      | `/signup/user`                | Renders `user` form view.                                    |                                                              |
| `POST`     | `/signup/user`                | Sends `user` form data to the server and creates user in the DB.. | { email, password}                                           |
| `GET`      | `/signup/dog`                 | Renders `dog` form view.                                     |                                                              |
| `POST`     | `/signup/dog`                 | Sends `dog` info to the server and creates `dog` and then `client` in the DB. |                                                              |
| `GET`      | `/login`                      | Renders `login` view                                         |                                                              |
| `POST`     | `/login`                      | Sends `login` form info to DB                                | { email, password}                                           |
| `GET`      | `/service`                    | Private route. Renders `prices-per-interval` view.           | { timeInterval, price}                                       |
| `GET`      | `/service/auth-location`      | Private route. Renders the `auth-location` view. Activate geolocalization auth. |                                                              |
| `GET`      | `/service/location-map`       | Private route. Renders `location` view . Has the location map. | location :{ lat, long}                                       |
| `GET`      | `/service/carers`             | Private route. Renders `carers` view.                        |                                                              |
| `GET`      | `/service/carer-profile`      | Private route. Renders `carer-profile` view.                 | { userId, dogId,  carerId}                                   |
| `GET`      | `/service/validation`         | Private route. Renders `validation` view                     |                                                              |
| `POST`     | `/service/cancelation`        | Private route. Redirects and  deletes contract from DB.      |                                                              |
| `GET`      | `/service/scrow`              | Private route. Renders `payment-method` view                 |                                                              |
| `POST`     | `/service/scrow`              | Private route. Sends `payment-method` form to DB and creates `cards` model | { userId, ownerName, cardType, cardNumber, exp, cvv}         |
| `GET`      | `/service/arriving`           | Private route. Renders `arriving` view                       |                                                              |
| `GET`      | `/service/trial-time`         | Private route. Renders `trial-time` view                     |                                                              |
| `POST`     | `/service/trial-time`         | Private route.  Set `ongoing` in `contract` to true and adds `cards.Id` to `contract` | {ongoing: true, cardsId}                                     |
| `GET`      | `/service/start-service`      | Private route. Renders `main-map` view                       |                                                              |
| `GET`      | `/service/end-service`        | Private route. Renders `end` view                            |                                                              |
| `GET`      | `/feedback/average`           | Private route. Renders `average` view                        |                                                              |
| `GET`      | `/feedback/favorite`          | Private route. Renders `favorite` view                       |                                                              |
| `POST`     | `/feedback/favorite`          | Private route. Send `favorite` to `favorites` model in DB    | {carerId}                                                    |
| `GET`      | `/feedback/review`            | Private route. Renders `review` view                         |                                                              |
| `POST`     | `/feedback/review`            | Private route. Sends all info from all feedback routes to the `reviews` model in the DB | {rate, description}                                          |
| `GET`      | `/profile`                    | Private route. Renders `profile` view                        |                                                              |
| `POST`     | `/profile`                    | Private route. Has a delete profile button with a `DELETE` method |                                                              |
| `GET`      | `/profile/user/`              | Private route. Renders `profile-user` view                   |                                                              |
| `POST`     | `/profile/user/`              | Private route. Has a `PATCH` method for `email` and `password` |                                                              |
| `GET`      | `/profile/user/dogs/:id`      | Private route. Renders `dog-profile` view                    |                                                              |
| `POST`     | `/profile/user/dogs/:id`      | Private route. Has a `PATCH` , `DELETE` and `CREATE` methods |                                                              |
| `GET`      | `/profile/user/cards`         | Private route. Renders `profile-card` view                   |                                                              |
| `POST`     | `/profile/user/cards`         | Private route. Has a `PATCH` , `DELETE` and `CREATE` methods |                                                              |
| `GET`      | `/carer/signup`               | Renders `carer/signup` form view.                            |                                                              |
| `POST`     | `/carer/signup`               | Sends ``carer/signup`` form data to the server and creates user in the DB. | { email, password, photo, name, description, DNI, fiscalAddress } |
| `GET`      | `/carer/signup`               | Renders `carer/signup` form view.                            |                                                              |
| `GET`      | `/carer/dashboard`            | Private route. Renders `profile` view                        |                                                              |
| `POST`     | `/carer/dashboard`            | Private route. Has a delete profile button with a `DELETE` method |                                                              |
| `GET`      | `/carer/profile`              | Private route. Renders `profile` view                        |                                                              |
| `POST`     | ``/carer/profile``            | Private route. Has a delete profile button with a `DELETE` method |                                                              |
| `GET`      | `/carer/reviews`              | Private route. Renders `reviews` view                        |                                                              |
| `GET`      | `/carer/view/dog-profile/:id` | Private route. Renders `dog-profile` view                    |                                                              |
| `GET`      | `/carer/service/:id`          |                                                              |                                                              |

## MODELS

User model

``` javascript
{
            email: String,
            password: String,
            isCArer: {
                type: Boolean,
                default: false
            }
        },
        {
            timestamps: true
        }
```

Carer model

``` javascript
{
        userId: {type: Schema.Types.ObjectId, ref: 'User'},
        profilePhoto: {
            type: String,
            default: '',
        },
        gallery: [String],
        description: String,
        items: {
            ontime: {
                name: 'Puntual',
                score: Number
            },
            professional: {
                name: 'Profesional',
                score: Number
            },
            loving: {
                name: 'Cariños@',
                score: Number
            },
            atentive: {
                name: 'Atent@',
                score: Number
            }
        },
        coords: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        }
    },
    {
        timestamps: true
    }
```

Dog model

```javascript
{
        userId: {type: Schema.Types.ObjectId, ref: 'User'},
        photo: {
            type: String,
            default: '',
        },
        sex: {
            type: String,
            enum: ['macho', 'hembra']
        },
        breed: String,
        size: {
            type: String,
            enum: ['pequeño', 'mediano', 'grande']
        },
        behavior:{
            withDogs: {
                type: String, 
                enum: ['Agresivo', 'Social', 'Timido']
            },
            withPeople: {
                type: String, 
                enum: ['Agresivo', 'Social', 'Timido']
            }
        },
           

        age: Number,
 },
```



Client model

```javascript
{
        userId: {type: Schema.Types.ObjectId, ref: 'User'},
        favourites: [{type: Schema.Types.ObjectId, ref: 'Carer'}],
        dogsId: [{type: Schema.Types.ObjectId, ref: 'Dog'}],
        cards: [{type: Schema.Types.ObjectId, ref: 'Card'}],
        coords: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        }
    },
    {
        timestamps: true
    }
```



Contract model

```javascript
{
        userId: {type: Schema.Types.ObjectId, ref: 'User'},
        carerId: [{type: Schema.Types.ObjectId, ref: 'User'}],
        price: Number,
        interval_price: Number,
        meeting_point: String,
        cardNumber: String,
        expiration: Date,
        cvv: Number
    },
    {
        timestamps: true
    }
```



Review model

```javascript
{
        userId: {type: Schema.Types.ObjectId, ref: 'User'},
        carerId: {type: Schema.Types.ObjectId, ref: 'User'},
        dogId: {type: Schema.Types.ObjectId, ref: 'Dog'},
        average: Number,
        items: {
            ontime: {
                name: 'Puntual',
                score: Number
            },
            professional: {
                name: 'Profesional',
                score: Number
            },
            loving: {
                name: 'Cariños@',
                score: Number
            },
            atentive: {
                name: 'Atent@',
                score: Number
            }
        },
        description: String
    },
    {
        timestamps: true
    }
```



Favorites model



```javascript
{
        userId: {type: Schema.Types.ObjectId, ref: 'User'},
        carerId: [{type: Schema.Types.ObjectId, ref: 'User'}],
    },
    {
        timestamps: true
    }
```



Cards model

```javascript
{
        userId: {type: Schema.Types.ObjectId, ref: 'User'},
        ownerName: String,
        cardType: {
            type: String,
            enum: ['visa', 'master', 'american']
        },
        cardNumber: String,
        expiration: {
            type: Date
        },
        cvv: Number
    },
    {
        timestamps: true
    }
```



## BACKLOG

Check the Trello link here

- Live chat
- Modify your service in the fly (add additional time, change meeting point)



## LINKS

#### **Git**

<a href="https://github.com/puigmar/LetsDog">Repository link</a>

<a href="#">Deploy link</a>

 

