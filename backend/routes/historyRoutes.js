const express = require("express");
const router = express.Router();

const {
  getUserHistory,
  getHistoryItem,
  deleteHistoryItem,
  getAllHistoryAdmin,
} = require("../controllers/historyController");

const { auth, isAdmin } = require("../middleware/auth");


router.get("/admin/all", auth, isAdmin, getAllHistoryAdmin);


router.get("/", auth, getUserHistory);
router.get("/:id", auth, getHistoryItem);
router.delete("/:id", auth, deleteHistoryItem);

module.exports = router;
