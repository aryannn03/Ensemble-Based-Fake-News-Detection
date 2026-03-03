const express = require("express");
const router = express.Router();

const { createPrediction } = require("../controllers/predictionController");
const { auth } = require("../middleware/auth");

// Protected route
router.post("/", auth, createPrediction);

module.exports = router;