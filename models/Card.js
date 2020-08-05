const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  ownerName: String,
  cardNumber: Number,
  expiration:Number,
  cvv: Number,
});

cardSchema.set("timestamps", true);

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
