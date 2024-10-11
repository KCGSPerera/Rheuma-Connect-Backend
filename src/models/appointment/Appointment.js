const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  nextAppDateTime: { type: Date },
  lastAppDateTime: { type: Date },
  roomNo: { type: String, required: true },
  consultant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor", // Now references the Doctor model
    required: true,
  },
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled", "Rescheduled"], // Enum values for status
    default: "Scheduled", // Default status
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  patientVitals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PatientVitals',
    },
  ],
  medicalRecords: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MedicalRecord',
    },
  ],
});

module.exports = mongoose.model("Appointment", appointmentSchema);
