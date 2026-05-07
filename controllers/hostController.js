const Home = require("../models/home");
const Booking = require("../models/booking");

exports.getHostDashboard = async (req, res, next) => {
  try {
    const hostId = req.session.user._id;
    const hostHomes = await Home.find({ hostId }).select('_id');
    const homeIds = hostHomes.map(home => home._id);

    const totalHomes = hostHomes.length;
    const bookings = await Booking.find({ home: { $in: homeIds } })
      .populate('home')
      .sort({ checkIn: -1 });

    const totalEarnings = bookings.reduce((sum, booking) => {
      if (booking.isCanceled) {
        return sum;
      }
      return sum + (booking.totalAmount || 0);
    }, 0);

    res.render("host/dashboard", {
      pageTitle: "Host Dashboard",
      totalHomes,
      totalBookings: bookings.length,
      totalEarnings,
      isLoggedIn: req.session.isLoggedIn,
      role: req.session.role
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home",
    editing: false,
    isLoggedIn: req.session.isLoggedIn,
    role: req.session.role
  });
};

exports.postAddHome = async (req, res, next) => {
  try {
    const { houseName, price, location, rating, photoUrl, description, latitude, longitude } = req.body;
    const hostId = req.session.user._id;

    const home = new Home({
      hostId,
      houseName,
      price,
      location,
      rating,
      photoUrl,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    });

    await home.save();
    res.redirect("/host/my-homes");

  } catch (err) {
    console.log(err);
    res.redirect("/host");
  }
};

exports.getHostHomes = async (req, res, next) => {
  try {
    const hostId = req.session.user._id;
    const registeredHomes = await Home.find({ hostId });

    res.render("host/host-home-list", {
      registeredHomes,
      pageTitle: "My Homes",
      isLoggedIn: req.session.isLoggedIn,
      role: req.session.role
    });

  } catch (err) {
    console.log(err);
    res.redirect("/host");
  }
};

exports.getEditHome = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;
    const hostId = req.session.user._id;

    const home = await Home.findOne({ _id: homeId, hostId });

    if (!home) {
      return res.redirect("/host/my-homes");
    }

    res.render("host/edit-home", {
      home,
      editing: true,
      pageTitle: "Edit Home",
      isLoggedIn: req.session.isLoggedIn,
      role: req.session.role
    });

  } catch (err) {
    console.log(err);
    res.redirect("/host/my-homes");
  }
};

exports.postEditHome = async (req, res, next) => {
  try {
    const { id, houseName, price, location, rating, photoUrl, description, latitude, longitude } = req.body;
    const hostId = req.session.user._id;

    const home = await Home.findOne({ _id: id, hostId });

    if (!home) {
      return res.redirect("/host/my-homes");
    }

    await Home.findByIdAndUpdate(id, {
      houseName,
      price,
      location,
      rating,
      photoUrl,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    });

    res.redirect("/host/my-homes");

  } catch (err) {
    console.log(err);
    res.redirect("/host/my-homes");
  }
};

exports.postDeleteHome = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;
    const hostId = req.session.user._id;

    const home = await Home.findOne({ _id: homeId, hostId });

    if (!home) {
      return res.redirect("/host/my-homes");
    }

    await Home.findByIdAndDelete(homeId);
    res.redirect("/host/my-homes");

  } catch (err) {
    console.log(err);
    res.redirect("/host/my-homes");
  }
};

exports.getHostBookings = async (req, res, next) => {
  try {
    const hostId = req.session.user._id;

    const hostHomes = await Home.find({ hostId }).select('_id');
    const homeIds = hostHomes.map(h => h._id);

    const bookings = await Booking.find({ home: { $in: homeIds } })
      .populate('home')
      .sort({ checkIn: -1 });

    res.render("host/host-bookings", {
      bookings,
      pageTitle: "My Bookings",
      isLoggedIn: req.session.isLoggedIn,
      role: req.session.role
    });

  } catch (err) {
    console.log(err);
    res.redirect("/host");
  }
};