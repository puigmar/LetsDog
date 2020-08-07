const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contractSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  carerId: { type: Schema.Types.ObjectId, ref: "Carer" },
  dogId: { type: Schema.Types.ObjectId, ref: "Dog" },
  price: String,
  interval_time: String,
  meeting_point: String,
  card_number: String,
  dogName: String,
  dogAge: String,
  dogBreed: String,
  pending: {
    type: Boolean,
    default: false
  },
  delivered: {
    type: Boolean,
    default: false
  }
});

contractSchema.set("timestamps", true);

const Contract = mongoose.model("Contract", contractSchema);

module.exports = Contract;
