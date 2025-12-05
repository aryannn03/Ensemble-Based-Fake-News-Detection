const Prediction = require("../models/Prediction");


exports.getUserHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const predictions = await Prediction.find({ userId })
      .sort({ createdAt: -1 }); // latest first

    return res.status(200).json({
      success: true,
      count: predictions.length,
      data: predictions,
    });
  } catch (error) {
    console.error("Error fetching user history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch history",
    });
  }
};


exports.getHistoryItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const predictionId = req.params.id;

    const prediction = await Prediction.findOne({
      _id: predictionId,
      userId: userId,
    });

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: "Prediction not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    console.error("Error fetching history item:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch prediction",
    });
  }
};


exports.deleteHistoryItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const predictionId = req.params.id;

    const prediction = await Prediction.findOneAndDelete({
      _id: predictionId,
      userId: userId,
    });

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: "Prediction not found or not authorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Prediction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting history item:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete prediction",
    });
  }
};


exports.getAllHistoryAdmin = async (req, res) => {
  try {
    const predictions = await Prediction.find({})
      .populate("userId", "name email role") // show basic user info
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: predictions.length,
      data: predictions,
    });
  } catch (error) {
    console.error("Error fetching all history (admin):", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch history for admin",
    });
  }
};
