const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  favourites: [{ type: Schema.Types.ObjectId, ref: "Carer" }],
  dogId: [{ type: Schema.Types.ObjectId, ref: "Dog" }],
  cards: [{ type: Schema.Types.ObjectId, ref: "Card" }],
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

clientSchema.set("timestamps", true);

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
