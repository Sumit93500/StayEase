const Home = require("../models/home");

const Booking = require("../models/booking");

const Favourite = require("../models/favourite");

// HOME PAGE
exports.getIndex = async (req, res, next) => {
  try {
    const homes = await Home.find();

    res.render("store/index", {
      registeredHomes: homes,

      pageTitle: "StayEase Home",

      isLoggedIn: req.session.isLoggedIn,

      role: req.session.role,
    });
  } catch (err) {
    console.log(err);
  }
};

// HOMES LIST PAGE
exports.getHomes = async (req, res, next) => {
  try {
    const homes = await Home.find();

    res.render("store/home-list", {
      registeredHomes: homes,

      pageTitle: "Homes",

      isLoggedIn: req.session.isLoggedIn,

      role: req.session.role,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getHomeDetail = async (req, res, next) => {
  try {
    const home = await Home.findById(req.params.homeId);

    if (!home) {
      return res.redirect("/homes");
    }

    res.render("store/home-detail", {
      home,
      pageTitle: home.houseName,
      isLoggedIn: req.session.isLoggedIn,
      role: req.session.role,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/homes");
  }
};

// BOOK HOME PAGE
exports.getBookHome = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;

    const home = await Home.findById(homeId);

    const checkIn = req.query.checkIn;

    const checkOut = req.query.checkOut;

    let totalNights = 1;

    if (checkIn && checkOut) {
      const start = new Date(checkIn);

      const end = new Date(checkOut);

      const difference = end - start;

      totalNights = Math.ceil(difference / (1000 * 60 * 60 * 24));

      if (totalNights < 1) {
        totalNights = 1;
      }
    }

    const totalAmount = home.price * totalNights;

    res.render("store/book-home", {
      home,

      checkIn,

      checkOut,

      totalNights,

      totalAmount,

      pageTitle: "Book Home",

      isLoggedIn: req.session.isLoggedIn,

      role: req.session.role,
    });
  } catch (err) {
    console.log(err);

    res.redirect("/");
  }
};

// RESERVE HOME PAGE
exports.getReserveHome = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;

    const home = await Home.findById(homeId);

    res.render("store/reserve", {
      home,
      pageTitle: "Reserve Home",
      isLoggedIn: req.session.isLoggedIn,
      role: req.session.role,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

exports.getPaymentPage = exports.getBookHome;

// CONFIRM BOOKING
// CONFIRM BOOKING
exports.postConfirmBooking = async (req, res, next) => {

  try {

    const {
      homeId,
      checkIn,
      checkOut,
      totalNights,
      totalAmount,
      transactionId,
    } = req.body;

    const home =
      await Home.findById(homeId);

    const booking =
      new Booking({

        home: home._id,

        houseName:
          home.houseName,

        location:
          home.location,

        latitude:
          home.latitude,

        longitude:
          home.longitude,

        city:
          home.city,

        price:
          home.price,

        photo:
          home.photoUrl,

        checkIn,

        checkOut,

        totalNights,

        totalAmount,

        transactionId,

        userId:
          req.session.user._id,

      });

    await booking.save();

    res.redirect("/bookings");

  }

  catch (err) {

    console.log(err);

    res.redirect("/");

  }

};

// CANCEL BOOKING
exports.postCancelBooking = async (req, res, next) => {
  try {
    const { bookingId, reason } = req.body;

    if (!bookingId || !reason) {
      return res.redirect(
        "/bookings?message=" +
          encodeURIComponent("Cancellation reason is required for feedback."),
      );
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      userId: req.session.user._id,
      isCanceled: false,
    });

    if (!booking) {
      return res.redirect(
        "/bookings?message=" +
          encodeURIComponent("Booking not found or already canceled."),
      );
    }

    booking.isCanceled = true;
    booking.cancellationReason = reason;
    booking.cancelDate = new Date();

    await booking.save();

    res.redirect(
      "/bookings?message=" +
        encodeURIComponent(
          "Booking canceled. Money will be refunded within 7 days.",
        ),
    );
  } catch (err) {
    console.log(err);

    res.redirect(
      "/bookings?message=" +
        encodeURIComponent("Unable to cancel booking at this time."),
    );
  }
};

// BOOKINGS PAGE
exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      userId: req.session.user._id,

      isCanceled: false,
    }).populate("home");

    res.render("store/bookings", {
      bookings,

      message: req.query.message || null,

      pageTitle: "My Bookings",

      isLoggedIn: req.session.isLoggedIn,

      role: req.session.role,
    });
  } catch (err) {
    console.log(err);
  }
};

// FAVOURITES PAGE
exports.getFavourites = async (req, res, next) => {
  try {
    const favourites = await Favourite.find({
      userId: req.session.user._id,
    }).populate("houseId");

    const favouriteHomes = favourites
      .map((fav) => fav.houseId)
      .filter((home) => home);

    res.render("store/favourite-list", {
      favouriteHomes,
      pageTitle: "Favourites",
      isLoggedIn: req.session.isLoggedIn,
      role: req.session.role,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

exports.postFavourite = async (req, res, next) => {
  try {
    const homeId = req.body.homeId || req.body.id;

    if (!homeId) {
      return res.redirect("/favourites");
    }

    const existingFavourite = await Favourite.findOne({
      userId: req.session.user._id,
      houseId: homeId,
    });

    if (!existingFavourite) {
      const favourite = new Favourite({
        userId: req.session.user._id,
        houseId: homeId,
      });

      await favourite.save();
    }

    res.redirect("/favourites");
  } catch (err) {
    console.log(err);
    res.redirect("/favourites");
  }
};

exports.postRemoveFavourite = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;

    await Favourite.deleteOne({
      userId: req.session.user._id,
      houseId: homeId,
    });

    res.redirect("/favourites");
  } catch (err) {
    console.log(err);
    res.redirect("/favourites");
  }
};
