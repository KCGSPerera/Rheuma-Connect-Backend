const mongoose = require("mongoose");

const internSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  contact: { type: String, required: true },
  nic: { type: String, required: true },
  internId: { type: String, required: true, unique: true },  // Auto-generated
  role: { type: String, default: "intern" },
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
  doctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
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
});

module.exports = mongoose.model("Intern", internSchema);
