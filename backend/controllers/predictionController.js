const Prediction = require("../models/Prediction");
const { getPredictionFromFlask } = require("../services/flaskService");

exports.createPrediction = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    // 1️⃣ Call Flask ML API
    const mlResponse = await getPredictionFromFlask(text);

    // 2️⃣ Save in DB
    const savedPrediction = await Prediction.create({
      userId: req.user.userId,
      text,
      finalLabel: mlResponse.prediction,
      confidencePercentage: mlResponse.confidence_percentage,
      confidenceLevel: mlResponse.confidence_level,
      keyInfluentialWords: mlResponse.key_influential_words.map((word) => ({
        word: word.word,
        influencePercentage: word.influence_percentage,
        influenceLevel: word.influence_level,
      })),
      explanationNote: mlResponse.explanation_note,
    });

    // 3️⃣ Return response to frontend
    return res.status(200).json({
      success: true,
      data: savedPrediction,
    });

  } catch (error) {
    console.error("Prediction error:", error);
    return res.status(500).json({
      success: false,
      message: "Prediction failed",
    });
  }
};