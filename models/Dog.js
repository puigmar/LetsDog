const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User"},
  photo: {
    type: String,
    default: "https://res.cloudinary.com/dtg4wdrbg/image/upload/v1596358771/letsdog_files/bujjluek1gihvczcxrza.jpg",
  },
  name: String,
  age: Number,
  sex: {
    type: String,
    enum: ["macho", "hembra"],
  },
  breed: String,
  size: {
    type: String,
    enum: ["small", "medium", "big"],
  },
  behavior: {
    withDogs: {
      type: String,
      enum: ["agresivo", "social", "timido"],
    },
    withPeople: {
      type: String,
      enum: ["agresivo", "social", "timido"],
    },
  },
});

dogSchema.set("timestamps", true);

const Dog = mongoose.model("Dog", dogSchema);

module.exports = Dog;
