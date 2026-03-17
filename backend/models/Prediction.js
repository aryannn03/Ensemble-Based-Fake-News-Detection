const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    // Final prediction: Fake or Real
    finalLabel: {
      type: String,
      enum: ["Fake", "Real"],
      required: true,
    },

    // Confidence percentage (0–100)
    confidencePercentage: {
      type: Number,
      required: true,
    },

    // Confidence description text
    confidenceLevel: {
      type: String,
      required: true,
    },

    // Words influencing the prediction
    keyInfluentialWords: [
      {
        word: String,
        influencePercentage: Number,
        influenceLevel: String,
      },
    ],

    explanationNote: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Prediction", predictionSchema);