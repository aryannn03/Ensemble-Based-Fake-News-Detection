const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    totalPredictions: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
