const mongoose = require("mongoose");

const homeSchema = mongoose.Schema({
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  houseName: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
    required: true,
  },

  photoUrl: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  latitude: {
    type: Number,
    required: false,
  },

  longitude: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model("Home", homeSchema);
