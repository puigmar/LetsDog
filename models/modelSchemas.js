const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema (
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
)

const clientSchema = new Schema (
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
)

const dogSchema = new Schema (
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
        Size: {
            type: String,
            enum: ['pequeño', 'mediano', 'grande']
        },
        age: Number
    },
    {
        timestamps: true
    }
)

const carerSchema = new Schema (
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
)

const reviewsSchema = new Schema (
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
)

const favouritesSchema = new Schema (
    {
        userId: {type: Schema.Types.ObjectId, ref: 'User'},
        carerId: [{type: Schema.Types.ObjectId, ref: 'User'}],
    },
    {
        timestamps: true
    }
)

const cardsSchema = new Schema (
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
)

const contractSchema = new Schema (
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
)
