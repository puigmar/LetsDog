const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  carerId: { type: Schema.Types.ObjectId, ref: "User" },
  dogId: { type: Schema.Types.ObjectId, ref: "Dog" },
  average: Number,
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
  description: String,
});

reviewSchema.set("timestamps", true);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
