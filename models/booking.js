const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  home: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Home",
  },

  houseName: String,

  city: String,

  price: Number,

  photo: String,

  checkIn: String,

  checkOut: String,

  totalNights: Number,

  totalAmount: Number,

  transactionId: String,

  cancellationReason: String,

  isCanceled: {
    type: Boolean,
    default: false,
  },

  cancelDate: Date,

  userId: String,
});

module.exports = mongoose.model("Booking", bookingSchema);
