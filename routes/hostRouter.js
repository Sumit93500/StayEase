const express = require("express");

const hostController = require("../controllers/hostController");

const router = express.Router();

router.get("/", hostController.getHostDashboard);

router.get("/add-home", hostController.getAddHome);

router.post("/add-home", hostController.postAddHome);

router.get("/my-homes", hostController.getHostHomes);

router.get("/edit-home/:homeId", hostController.getEditHome);

router.post("/edit-home", hostController.postEditHome);

router.post("/delete-home/:homeId", hostController.postDeleteHome);

router.get("/my-bookings", hostController.getHostBookings);

module.exports = router;
