const express = require("express");

const storeController = require("../controllers/storeController");

const router = express.Router();

const requireUser = (req, res, next) => {
  if (!req.session.isLoggedIn || req.session.role !== "user") {
    return res.redirect("/login");
  }

  next();
};

// HOME PAGE
router.get("/", storeController.getIndex);

// HOMES PAGE
router.get("/homes", storeController.getHomes);

router.get("/homes/:homeId", storeController.getHomeDetail);

// BOOK HOME PAGE
router.get("/reserve/:homeId", requireUser, storeController.getReserveHome);

router.get("/payment/:homeId", requireUser, storeController.getPaymentPage);

router.get("/book-home/:homeId", requireUser, storeController.getBookHome);

// FAVOURITES
router.post("/favourites", requireUser, storeController.postFavourite);

router.get("/favourites", requireUser, storeController.getFavourites);

router.post(
  "/favourites/delete/:homeId",
  requireUser,
  storeController.postRemoveFavourite,
);

// CONFIRM BOOKING
router.post(
  "/confirm-booking",
  requireUser,
  storeController.postConfirmBooking,
);

// CANCEL BOOKING
router.post("/cancel-booking", requireUser, storeController.postCancelBooking);

// BOOKINGS PAGE
router.get("/bookings", requireUser, storeController.getBookings);

module.exports = router;
