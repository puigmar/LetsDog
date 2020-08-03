const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  name: String,
  profilePhoto: {
    type: String,
    default: "https://res.cloudinary.com/dtg4wdrbg/image/upload/v1596389824/letsdog_files/onjowfvjo53rkxwxhjuz.jpg",
  },
  gallery: String,
  description: String,
  phone: {
    prefix: String,
    number: String
  },
  items: {
    ontime: {
      name: String,
      score: Number,
    },
    professional: {
      name: String,
      score: Number,
    },
    loving: {
      name: String,
      score: Number,
    },
    atentive: {
      name: String,
      score: Number,
    },
  },
  coords: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  rate: {
    type: Number,
    default: 5
  }
});

carerSchema.set("timestamps", true);

const Carer = mongoose.model("Carer", carerSchema);

module.exports = Carer;
