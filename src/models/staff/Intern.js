const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const internSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  contact: { type: String, required: true },
  nic: { type: String, required: true },
  internId: { type: String, required: true, unique: true }, // Auto-generated
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
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Hashing the password before saving
internSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password for login
internSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model("Intern", internSchema);





// // Auto-generating internId (optional: this can be done in the registration logic)
// internSchema.pre('save', function (next) {
//   if (!this.internId) {
//     // Generating a custom internId (for example: INT + timestamp)
//     this.internId = 'INT' + Date.now();
//   }
//   next();
// });


// const mongoose = require("mongoose");

// const internSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   username: { type: String, required: true },
//   password: { type: String, required: true },
//   name: { type: String, required: true },
//   contact: { type: String, required: true },
//   nic: { type: String, required: true },
//   internId: { type: String, required: true, unique: true },  // Auto-generated
//   role: { type: String, default: "intern" },
//   appointments: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Appointment",
//     },
//   ],
//   medicalRecords: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "MedicalRecord",
//     },
//   ],
//   patientVitals: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "PatientVitals",
//     },
//   ],
//   doctors: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Doctor",
//     },
//   ],
//   interns: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Intern",
//     },
//   ],
//   infoHub: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "InfoHub",
//     },
//   ],
// });

// module.exports = mongoose.model("Intern", internSchema);
