const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  photo: {
    type: String,
    default: "",
  },
  sex: {
    type: String,
    enum: ["macho", "hembra"],
  },
  breed: String,
  size: {
    type: String,
    enum: ["pequeño", "mediano", "grande"],
  },
  behavior: {
    withDogs: {
      type: String,
      enum: ["Agresivo", "Social", "Timido"],
    },
    withPeople: {
      type: String,
      enum: ["Agresivo", "Social", "Timido"],
    },
  },

  age: Number,
});

dogSchema.set("timestamps", true);

const Dog = mongoose.model("Dog", dogSchema);

module.exports = Dog;
