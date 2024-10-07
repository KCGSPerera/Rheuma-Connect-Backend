const mongoose = require("mongoose");

const patientVitalsSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  weight: { type: Number },
  temperature: { type: Number },
  bloodPressure: { type: String },
  heartRate: { type: Number },
  respiratoryRate: { type: Number },
  oxygenLevel: { type: Number },
  examinedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Intern", // Changed to Intern model reference
  },
  date: { type: Date, default: Date.now }, // Default to current date
  time: { type: String, default: () => new Date().toLocaleTimeString() }, // Default to current time
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
});

module.exports = mongoose.model("PatientVitals", patientVitalsSchema);
