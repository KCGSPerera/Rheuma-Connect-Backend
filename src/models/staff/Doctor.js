const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

// Hashing the password before saving
doctorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password for login
doctorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Doctor", doctorSchema);



// const mongoose = require("mongoose");

// const doctorSchema = new mongoose.Schema(
//   {
//     email: { type: String, required: true, unique: true },
//     username: { type: String, required: true },
//     password: { type: String, required: true },
//     name: { type: String, required: true },
//     contact: { type: String, required: true },
//     nic: { type: String, required: true },
//     docId: { type: String, required: true, unique: true },  // Auto-generated, to be handled during registration
//     role: { type: String, default: "doctor" },
//     appointments: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Appointment",
//       },
//     ],
//     medicalRecords: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "MedicalRecord",
//       },
//     ],
//     patientVitals: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "PatientVitals",
//       },
//     ],
//     patients: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Patient",
//       },
//     ],
//     interns: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Intern",
//       },
//     ],
//     infoHub: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "InfoHub",
//       },
//     ],
//   },
//   { timestamps: true } // Automatically adds createdAt and updatedAt fields
// );

// module.exports = mongoose.model("Doctor", doctorSchema);


