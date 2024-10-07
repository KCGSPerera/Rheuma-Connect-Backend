const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema({
  photo: { type: String, required: true },  // Assuming this is a URL to the photo
  date: { type: Date, required: true },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
});

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
