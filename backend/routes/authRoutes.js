const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  getMe,
  logout,
} = require("../controllers/authController");

const { auth, isUser, isAdmin } = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", auth, getMe);


router.post("/logout", auth, logout);


router.get("/admin/check", auth, isAdmin, (req, res) => {
  return res.json({
    success: true,
    message: "Admin route accessed",
    user: req.user,
  });
});

module.exports = router;
