const express = require('express');

const patientRoutes = require('../routes/patient/patientRoutes');
const doctorRoutes = require('../routes/staff/doctorRoutes');
const adminRoutes = require('../routes/staff/adminRoutes');
const internRoutes = require('../routes/staff/internRoutes');
const medicalRecordRoutes = require('../routes/medicalRecordRoutes');
const patientVitalsRoutes = require("../routes/patient/patientVitalsRoutes");
const infoHubRoutes = require("../routes/infoHubRoutes");
const appointmentRoutes = require("../routes//appointment/appointmentRoutes");
const { authMiddleware } = require('../middleware/authMiddleware');

const app = express();

const cors = require('cors');
app.use(cors());

// http://localhost:58875


// You may want to serve static files (like the uploaded images) by exposing the uploads folder in your app.js:
app.use('/uploads', express.static('uploads'));


// Middleware to parse JSON bodies
app.use(express.json());


// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/interns', internRoutes);
app.use('/api/medicalRecords', medicalRecordRoutes);
app.use("/api/vitals", patientVitalsRoutes);
app.use("/api/infoHub", infoHubRoutes);
app.use('/api/appointments', appointmentRoutes);

module.exports = app;
