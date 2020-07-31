const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  profilePhoto: {
    type: String,
    default: "",
  },
  gallery: [String],
  description: String,
  tel: Number,
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
});

carerSchema.set("timestamps", true);

const Carer = mongoose.model("Carer", carerSchema);

module.exports = Carer;
