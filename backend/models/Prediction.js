const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    // Which user made this prediction
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The news text that user submitted
    text: {
      type: String,
      required: true,
      trim: true,
    },

    // Which model was used
    modelUsed: {
      type: String,
      enum: ["ensemble", "classical", "transformer"],
      default: "ensemble",
    },

    // Final label returned by ML model
    finalLabel: {
      type: String,
      enum: ["FAKE", "REAL"],
      default: "FAKE",
    },

    // Final confidence
    finalConfidence: {
      type: Number,
      default: 0,
    },

    // store raw ML response / per-model outputs later
    subModelOutputs: {
      type: Object, // flexible JSON
      default: {},
    },

    // ID if Flask returns some prediction_id
    externalPredictionId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Prediction", predictionSchema);
