const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favouriteSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  carerId: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

favoriteSchema.set("timestamps", true);

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
