const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

  home: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Home",
  },

  houseName: {
    type: String,
  },

  location: {
    type: String,
  },

  latitude: {
    type: Number,
  },

  longitude: {
    type: Number,
  },

  city: {
    type: String,
  },

  price: {
    type: Number,
  },

  photo: {
    type: String,
  },

  checkIn: {
    type: String,
  },

  checkOut: {
    type: String,
  },

  totalNights: {
    type: Number,
  },

  totalAmount: {
    type: Number,
  },

  transactionId: {
    type: String,
  },

  cancellationReason: {
    type: String,
  },

  isCanceled: {
    type: Boolean,
    default: false,
  },

  cancelDate: {
    type: Date,
  },

  userId: {
    type: String,
  },

});

module.exports = mongoose.model("Booking", bookingSchema);