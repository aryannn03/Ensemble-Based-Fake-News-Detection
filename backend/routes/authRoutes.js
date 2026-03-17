const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  getMe,
  logout,
} = require("../controllers/authController");

const { auth, isUser, isAdmin } = require("../middleware/auth");

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected
router.get("/me", auth, getMe);
router.post("/logout", auth, logout);


router.get("/user/check", auth, isUser, (req, res) => {
  res.json({
    success: true,
    message: "User route accessed successfully",
    user: req.user,
  });
});

router.get("/admin/check", auth, isAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Admin route accessed successfully",
    user: req.user,
  });
});

module.exports = router;
