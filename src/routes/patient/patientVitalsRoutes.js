const express = require("express");
const router = express.Router();
const {
  addPatientVitals,
  getPatientVitalsByDate,
  getRecentPatientVitals,
  updatePatientVitals,
  deletePatientVitals,
} = require("../../controllers/patient/patientVitalsCtrl");

// Add patient vitals
router.post("/addVitals", addPatientVitals);

// Get patient vitals by date
router.get("/getVitalsByDate", getPatientVitalsByDate);

// Get most recent patient vitals
router.get("/getRecentVitals/:patientId", getRecentPatientVitals);

// Update patient vitals
router.put("/updateVitals/:vitalsId", updatePatientVitals);

// Delete patient vitals
router.delete("/deleteVitals/:vitalsId", deletePatientVitals);

module.exports = router;
