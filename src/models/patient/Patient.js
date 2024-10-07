const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const patientSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePhoto: String,
  name: String,
  birthday: Date,
  age: Number, // This will be calculated when updating the profile
  medicalId: {
    type: String,
    unique: true,
    required: true,
  },
  bloodType: {
    type: String,
    enum: ['A', 'B', 'AB', 'O'],
  },
  contactNumber: String,
  allergies: Boolean,
  rheumaticType: {
    type: String,
    enum: ['Type-1', 'Type-2', 'Type-3'],
  },
  registered: {
    type: Boolean,
    default: true // Admin will accept the patient
  },
  role: { 
    type: String, 
    default: 'Patient' 
  },
  patientVitals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientVitals",
    },
  ],
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
  doctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hashing the password before saving
patientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password for login
patientSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Patient', patientSchema);
