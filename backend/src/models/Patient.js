const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
      maxlength: 100,
    },
    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
      max: [150, "Age seems invalid"],
      default: null,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: null,
    },
    contact: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s-]{7,15}$/, "Please enter a valid contact number"],
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

patientSchema.index({ name: "text" });
patientSchema.index({ createdBy: 1 });
patientSchema.index({ userId: 1 });

module.exports = mongoose.model("Patient", patientSchema);
