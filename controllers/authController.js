const User = require("../models/user");

// LOGIN PAGE
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
  });
};

// SIGNUP PAGE
exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
  });
};

// SIGNUP
exports.postSignup = async (req, res, next) => {
  const email = req.body.email;

  const password = req.body.password;

  const role = req.body.role;

  try {
    // CHECK EXISTING USER
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.redirect("/signup");
    }

    // CREATE USER
    const user = new User({
      email,
      password,
      role,
    });

    await user.save();

    // REDIRECT TO LOGIN
    res.redirect("/login");
  } catch (err) {
    console.log(err);

    res.redirect("/signup");
  }
};

// LOGIN
exports.postLogin = async (req, res, next) => {
  const email = req.body.email;

  const password = req.body.password;

  try {
    // FIND USER
    const user = await User.findOne({ email });

    // USER NOT FOUND
    if (!user) {
      return res.redirect("/login");
    }

    // WRONG PASSWORD
    if (user.password !== password) {
      return res.redirect("/login");
    }

    // SAVE SESSION
    req.session.isLoggedIn = true;

    req.session.role = user.role;

    req.session.user = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    console.log(req.session);

    req.session.save((err) => {
      if (err) {
        console.log(err);

        return res.redirect("/login");
      }

      // HOST LOGIN
      if (user.role === "host") {
        return res.redirect("/host");
      }

      // USER LOGIN
      return res.redirect("/homes");
    });
  } catch (err) {
    console.log(err);

    res.redirect("/login");
  }
};

// LOGOUT
exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
