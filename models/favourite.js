const mongoose = require("mongoose");

const favouriteSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  houseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Home",
    required: true,
  },
});

favouriteSchema.index({ userId: 1, houseId: 1 }, { unique: true });

module.exports = mongoose.model("Favourite", favouriteSchema);
