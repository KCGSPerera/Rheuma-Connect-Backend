const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    contact: { type: String, required: true },
    nic: { type: String, required: true },
    docId: { type: String, required: true, unique: true },  // Auto-generated, to be handled during registration
    role: { type: String, default: "doctor" },
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    medicalRecords: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicalRecord",
      },
    ],
    patientVitals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PatientVitals",
      },
    ],
    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],
    interns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Intern",
      },
    ],
    infoHub: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InfoHub",
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Doctor", doctorSchema);
